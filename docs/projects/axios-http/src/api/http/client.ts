/**
 * HTTP 客户端工厂。本文件只做编排：把 Axios 实例、三个拦截器模块和「逻辑请求」
 * 生命周期装配起来。分类、解包、认证这些具体逻辑都在邻居文件里。
 *
 * 一次 request() 走过的路：
 *
 *   execute()            开 Loading、建 AbortController、备好错误上下文
 *     └ retry()          仅 GET/HEAD/OPTIONS 才套这一层 → retry.ts
 *         └ 请求链        Auth → Envelope → RequestControl → 网络
 *         └ 响应链        RequestControl → Envelope → Auth（401 在此刷新并重放）
 *     └ 失败时           normalizeHttpError() 定分类        → errors.ts
 *                       assignRequestErrorContext() 补上下文 → errors.ts
 *                       notifyFailure() 分发给 onError / onReport
 *   finally              关 Loading、解绑信号、摘掉控制器
 *
 * 「逻辑请求」是理解本文件的关键概念：调用方眼里的一次请求。它可能对应多次物理
 * 尝试——重试、401 刷新后的重放。Loading 开关和 cancelAll() 都按逻辑请求计数，
 * 所以中途重试不会让 Loading 闪一下。物理尝试的计数在 request-control.ts。
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type CreateAxiosDefaults } from "axios";

import { installAuth, isHandledAuthError, readHandledAuthErrorOrigin, type AuthAdapter, type AuthBehavior, type AuthControl } from "./auth";
import {
  ApiEnvelopeFormatError,
  assignRequestErrorContext,
  HttpError,
  normalizeHttpError,
  type RequestError,
  type RequestErrorContext,
} from "./errors";
import { installApiEnvelopeAdapter, type ApiEnvelopeBehavior } from "./adapters/envelope";
import { readApiErrorMessage } from "./adapters/error-presenter";
import { combineAbortSignals, installRequestControl, RequestAttempts } from "./request-control";
import { retry } from "./retry";

export type ErrorMode = "global" | "silent";

export interface ErrorBehavior {
  errorMode?: ErrorMode;
}

export interface HttpRetryOptions {
  retries?: number;
  baseDelayMs?: number;
  totalTimeoutMs?: number;
}

export interface RetryBehavior {
  retry?: HttpRetryOptions;
}

export interface LoadingBehavior {
  showLoading?: boolean;
}

/**
 * 调用方可以透传的 Axios 配置采用白名单，而不是从完整配置里排除敏感键。
 *
 * 排除法挡不住 `validateStatus`（可以把 `5xx` 变成成功，击穿「HTTP 状态是唯一
 * 权威」）、`adapter`（可以整体换掉传输层）、`transformResponse`（可以在协议
 * Adapter 之前改写响应体）这类同样能破坏核心不变量的键。传输策略属于本模块，
 * 调用方只需要描述这一次请求。
 *
 * 另一半在下面的 `createAxiosDefaults()`：那里把传输策略定死，这里拦住调用方
 * 按请求改回来。
 */
type AllowedAxiosConfigKey =
  | "data"
  | "headers"
  | "method"
  | "onDownloadProgress"
  | "onUploadProgress"
  | "params"
  | "responseType"
  | "signal"
  | "timeout"
  | "url";

export type HttpRequestConfig<Body = unknown> = Pick<AxiosRequestConfig<Body>, AllowedAxiosConfigKey> &
  AuthBehavior &
  ErrorBehavior &
  LoadingBehavior &
  RetryBehavior;

export interface CreateHttpClientOptions {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  auth?: AuthAdapter;
  refreshCooldownMs?: number;
  showLoadingByDefault?: boolean;
  /**
   * 仅在活动请求数发生 0↔1 变化时调用，因此并发请求只开关一次。计数在下面的
   * `startLoading()` / `stopLoading()`。项目端实现永远只有显示和隐藏两个动作，
   * 所以这里是布尔回调而不是 Adapter 接口。
   */
  onLoadingChange?: (active: boolean) => void;
  /**
   * 下面这两个回调是「展示」和「上报」的分家，是本封装最容易被合并写错的地方：
   * `errorMode: "silent"` 只关掉展示，不关掉上报——否则静默请求一出错就从监控里
   * 消失了。分发规则见下面的 `notifyFailure()`。
   */
  onError?: (error: RequestError) => void;
  onReport?: (error: RequestError) => void;
}

type HttpClientRuntimeOptions = Pick<CreateHttpClientOptions, "showLoadingByDefault" | "onLoadingChange" | "onError" | "onReport">;

type TrackedRequestConfig<Body> = HttpRequestConfig<Body> &
  ApiEnvelopeBehavior & {
    __requestAttempts: RequestAttempts;
  };

// 路径去掉 query 和 fragment 之后，才允许进入错误上下文和上报——query 里常有
// token、手机号这类不该落到监控平台的东西。
//
// 注意它只做到这一步：核心认不出路径段里的 ID，`/orders/42` 原样保留，需要归一化
// 成 `/orders/:id` 的话由项目的上报 Adapter 自己做。
function readSafeRequestPath(url?: string) {
  if (!url) {
    return "";
  }

  try {
    return new URL(url, "http://request.local").pathname;
  } catch {
    return url.split(/[?#]/, 1)[0] ?? "";
  }
}

// 刷新失败时，要报的是「哪个刷新请求挂了」，得取回刷新请求自己的 config。这时错误
// 可能已经被包了一层，所以既认原始 AxiosError，也认藏在 `cause` 里的那一个。
// 用处见 execute() 的 catch 分支：`origin === "auth-refresh"` 那一段。
function readAxiosError(value: unknown) {
  if (axios.isAxiosError(value)) {
    return value;
  }

  if (value instanceof Error && axios.isAxiosError(value.cause)) {
    return value.cause;
  }

  return undefined;
}

// 项目回调不允许改写请求的失败结果：同步抛出被吞掉，返回的 Promise 拒绝也被接住。
// 这样调用方拿到的永远是原始请求错误，而不是 Toast 组件或监控 SDK 自己的故障。
function invokeErrorCallback(callback: ((error: RequestError) => void) | undefined, error: RequestError) {
  try {
    void Promise.resolve(callback?.(error) as unknown).catch(() => {});
  } catch {
    // 回调自身的异常到此为止，不向上冒泡。
  }
}

export interface HttpClient {
  request<Result, Body = unknown>(config: HttpRequestConfig<Body>): Promise<Result>;
  raw<Data, Body = unknown>(config: HttpRequestConfig<Body>): Promise<AxiosResponse<Data, Body>>;
  get<Result>(url: string, config?: HttpRequestConfig): Promise<Result>;
  delete<Result, Body = unknown>(url: string, config?: HttpRequestConfig<Body>): Promise<Result>;
  head<Result>(url: string, config?: HttpRequestConfig): Promise<Result>;
  options<Result>(url: string, config?: HttpRequestConfig): Promise<Result>;
  post<Result, Body = unknown>(url: string, data?: Body, config?: HttpRequestConfig<Body>): Promise<Result>;
  put<Result, Body = unknown>(url: string, data?: Body, config?: HttpRequestConfig<Body>): Promise<Result>;
  patch<Result, Body = unknown>(url: string, data?: Body, config?: HttpRequestConfig<Body>): Promise<Result>;
  resetAuthState(): void;
  waitForRefreshSettled(): Promise<void>;
  cancelAll(): void;
}

// 传输策略在这里一次性定死，调用方没法按请求覆盖（拦截动作在上面的
// `AllowedAxiosConfigKey`）：`allowAbsoluteUrls: false` 让 Axios 自己也拒收绝对
// URL，`withCredentials` 默认关闭，跨域 Cookie 只留给刷新实例。
function createAxiosDefaults(options: CreateHttpClientOptions): CreateAxiosDefaults {
  return {
    baseURL: options.baseURL,
    timeout: options.timeout ?? 10_000,
    allowAbsoluteUrls: false,
    withCredentials: options.withCredentials ?? false,
    transitional: {
      // 让超时报 ETIMEDOUT。不开的话超时和网络错误共用同一个错误码，errors.ts 就
      // 只能靠 message 文本猜是哪一种。
      clarifyTimeoutError: true,
    },
  };
}

export function createHttpClient(options: CreateHttpClientOptions): HttpClient {
  const defaults = createAxiosDefaults(options);
  const axiosInstance = axios.create(defaults);
  // 下面三行的顺序不能动。Axios 的请求拦截器按注册的**逆序**执行、响应拦截器按
  // 注册顺序执行，所以这一处写法同时决定了两条方向相反的链
  // （Envelope 只注册响应拦截器，请求链上没有它）：
  //
  //   请求：Auth → RequestControl → 网络
  //   响应：网络 → RequestControl → Envelope → Auth
  //
  // 关键是 Auth 必须落在响应链的最后一环：它重放的请求已经走过一次 Envelope 解包，
  // 若后面还挂着 Envelope，会对同一个响应二次解包，误判成协议格式错误。
  const requestControl = installRequestControl(axiosInstance);
  installApiEnvelopeAdapter(axiosInstance);

  const authControl = options.auth
    ? installAuth(axiosInstance, options.auth, {
        refreshCooldownMs: options.refreshCooldownMs,
      })
    : undefined;

  return new AxiosHttpClient(axiosInstance, requestControl, authControl, options);
}

class AxiosHttpClient implements HttpClient {
  private readonly logicalRequestControllers = new Set<AbortController>();
  private activeLoadingCount = 0;

  constructor(
    private readonly axiosInstance: AxiosInstance,
    private readonly requestControl: ReturnType<typeof installRequestControl>,
    private readonly authControl: AuthControl | undefined,
    private readonly runtimeOptions: HttpClientRuntimeOptions = {},
  ) {}

  // request() 和 raw() 走的是同一条生命周期，差别只有成功之后拿什么当结果——所以
  // execute() 收一个 select 回调，不需要维护两套实现。
  request<Result, Body = unknown>(config: HttpRequestConfig<Body>): Promise<Result> {
    return this.execute(config, (response) => response.data as Result);
  }

  // `__rawResponse` 是一个双向信号：既让下面的 select 返回整个 response，也让
  // adapters/envelope.ts 的拦截器认出这次请求要跳过解包。
  raw<Data, Body = unknown>(config: HttpRequestConfig<Body>): Promise<AxiosResponse<Data, Body>> {
    return this.execute({ ...config, __rawResponse: true }, (response) => response as AxiosResponse<Data, Body>);
  }

  // 下面这一串方法别名只做一件事：补上 method、url、data，然后转交 request()。
  // 它们不碰生命周期，所以读懂 execute() 就等于读懂了全部九个方法。
  get<Result>(url: string, config?: HttpRequestConfig): Promise<Result> {
    return this.request<Result>({ ...config, method: "get", url });
  }

  delete<Result, Body = unknown>(url: string, config?: HttpRequestConfig<Body>): Promise<Result> {
    return this.request<Result, Body>({ ...config, method: "delete", url });
  }

  head<Result>(url: string, config?: HttpRequestConfig): Promise<Result> {
    return this.request<Result>({ ...config, method: "head", url });
  }

  options<Result>(url: string, config?: HttpRequestConfig): Promise<Result> {
    return this.request<Result>({ ...config, method: "options", url });
  }

  post<Result, Body = unknown>(url: string, data?: Body, config?: HttpRequestConfig<Body>): Promise<Result> {
    return this.request<Result, Body>({ ...config, data, method: "post", url });
  }

  put<Result, Body = unknown>(url: string, data?: Body, config?: HttpRequestConfig<Body>): Promise<Result> {
    return this.request<Result, Body>({ ...config, data, method: "put", url });
  }

  patch<Result, Body = unknown>(url: string, data?: Body, config?: HttpRequestConfig<Body>): Promise<Result> {
    return this.request<Result, Body>({ ...config, data, method: "patch", url });
  }

  resetAuthState() {
    this.authControl?.resetAuthState();
  }

  waitForRefreshSettled() {
    return this.authControl?.waitForRefreshSettled() ?? Promise.resolve();
  }

  private async execute<Result, Body>(
    config: HttpRequestConfig<Body> & ApiEnvelopeBehavior,
    select: (response: AxiosResponse<unknown, Body>) => Result,
  ): Promise<Result> {
    const startedAt = performance.now();
    const attempts = new RequestAttempts();
    // 写成函数而不是对象：这两个值在这一行都还是 0，必须推迟到失败发生的那一刻再读。
    // 写成对象的话，一个「只发一次、3 秒后超时」的请求也会被记成 attempts 0、耗时 0。
    // 下面两个失败出口各调它一次，各自取当下的快照。
    const requestContext = (): RequestErrorContext => ({
      method: (config.method ?? "get").toUpperCase(),
      path: readSafeRequestPath(config.url),
      attempts: attempts.count,
      elapsedMs: Math.max(0, performance.now() - startedAt),
      origin: "business",
    });

    // 绝对 URL 在进 Axios 之前就拦掉。上面的 `allowAbsoluteUrls: false` 已经是一道
    // 防线，这里再挡一次是为了给出 kind: "configuration" 的明确错误，而不是让调用方
    // 面对一个语焉不详的传输层报错。`//evil.com` 这种协议相对写法也要一起认出来。
    if (typeof config.url === "string" && (/^\/\//.test(config.url) || /^[a-z][a-z\d+.-]*:/i.test(config.url))) {
      const cause = new TypeError("Absolute business URL is not allowed");
      const error = new HttpError({
        kind: "configuration",
        message: "Absolute business URL is not allowed",
        cause,
        context: requestContext(),
      });
      this.notifyFailure(error, config.errorMode === "silent", false);
      // 模块外面的调用方会捕获这个error
      throw error;
    }

    // 这个 controller 属于「逻辑请求」这一层，cancelAll() 取消的就是它。调用方自己
    // 传的 signal 不能直接用——那样 cancelAll() 就管不到了——所以两个信号合成一个，
    // 任意一边中止都算中止。合成实现见 request-control.ts 的 combineAbortSignals()。
    const controller = new AbortController();
    const combined = config.signal
      ? combineAbortSignals([config.signal as AbortSignal, controller.signal])
      : {
          signal: controller.signal,
          dispose: () => {},
        };
    // `__requestAttempts` 是交给拦截器层的计数器：这里只负责建好塞进 config，
    // 真正自增的是 request-control.ts 的 prepare()——它每发出一次物理请求就 +1，
    // 于是重试和 401 重放都会被算进去，最后由上面的 requestContext() 读出来。
    const requestConfig: TrackedRequestConfig<Body> = {
      ...config,
      __requestAttempts: attempts,
      signal: combined.signal,
    };
    const showLoading = config.showLoading ?? this.runtimeOptions.showLoadingByDefault ?? false;
    this.logicalRequestControllers.add(controller);

    if (showLoading) {
      this.startLoading();
    }

    try {
      // send() 是「一次物理尝试」。它被 retry() 反复调用，所以里面不能有任何只该
      // 发生一次的事情（开关 Loading、注册控制器都在它外面）。
      //
      // 里面这个 catch 做的是「放行」而不是「处理」：已被 auth 模块处理过的错误和
      // 协议格式错误都保持原样往上抛，只有其余的才在这里归一化成 HttpError。
      const send = async () => {
        try {
          const response = await this.axiosInstance.request<unknown, AxiosResponse<unknown, Body>, Body>(requestConfig);

          return select(response);
        } catch (error) {
          if (isHandledAuthError(error)) {
            throw error;
          }

          if (error instanceof ApiEnvelopeFormatError) {
            throw error;
          }

          throw await normalizeHttpError(error, {
            readErrorMessage: readApiErrorMessage,
          });
        }
      };
      // 重试只对安全方法开放，而且是硬性限制而非默认值：POST/PUT/PATCH 即便调用方
      // 显式传了 retry 也不会重试。传输层看不出一个失败的写请求到底有没有在服务端
      // 落库，重试就可能变成重复下单。要重试的写操作应当由业务层带幂等键自己发起。
      const method = (requestConfig.method ?? "get").toLowerCase();
      const isSafeRead = ["get", "head", "options"].includes(method);

      if (requestConfig.retry && isSafeRead) {
        return await retry(send, {
          retries: requestConfig.retry.retries,
          baseDelay: requestConfig.retry.baseDelayMs,
          totalTimeoutMs: requestConfig.retry.totalTimeoutMs,
          signal: combined.signal,
        });
      }

      return await send();
    } catch (error) {
      // 逻辑请求的收尾：无论中间重试了几次、刷新过几回，最终只在这里归一化一次、
      // 补一次上下文、通知一次。
      const handledAuth = isHandledAuthError(error);
      const authErrorOrigin = readHandledAuthErrorOrigin(error);
      const normalized =
        error instanceof ApiEnvelopeFormatError
          ? error
          : await normalizeHttpError(error, {
              readErrorMessage: readApiErrorMessage,
            });
      const context = requestContext();
      // 失败可能有两个来源：业务请求自己挂了，或者它触发的 401 刷新挂了。后者要额外
      // 记下刷新请求的方法和路径，否则监控上看到的是业务接口出错，排查方向就跑偏了。
      if (authErrorOrigin === "auth-refresh") {
        const sourceError = readAxiosError(error);
        context.origin = "auth-refresh";
        context.originMethod = sourceError?.config?.method?.toUpperCase();
        context.originPath = readSafeRequestPath(sourceError?.config?.url);
      }
      // 就地写入而不是带着上下文重建一个新错误：重建会丢掉对象身份（`instanceof`
      // 和 WeakSet 判定全部失效）和挂在上面的载荷字段。
      const contextualError = assignRequestErrorContext(normalized, context);
      this.notifyFailure(contextualError, config.errorMode === "silent", handledAuth);
      throw contextualError;
    } finally {
      // 三件收尾都必须在 finally：成功、失败、取消都要走到。少了 dispose() 会让
      // 调用方传进来的 signal 一直挂着监听器，长生命周期的 signal 就是内存泄漏。
      if (showLoading) {
        this.stopLoading();
      }
      combined.dispose();
      this.logicalRequestControllers.delete(controller);
    }
  }

  // Loading 按逻辑请求计数，只在 0↔1 的边界上通知外部：并发的三个请求共享一个展示
  // 区间，中途的重试和 401 重放也不会让它闪一下。stopLoading() 的零值保护是防止
  // 异常路径下多减一次把计数打成负数。
  private startLoading() {
    this.activeLoadingCount += 1;
    if (this.activeLoadingCount === 1) {
      this.runtimeOptions.onLoadingChange?.(true);
    }
  }

  private stopLoading() {
    if (this.activeLoadingCount === 0) {
      return;
    }

    this.activeLoadingCount -= 1;
    if (this.activeLoadingCount === 0) {
      this.runtimeOptions.onLoadingChange?.(false);
    }
  }

  // 两层都要取消：逻辑请求这一层（正在 backoff 等待、还没发出下一次尝试的请求只存在
  // 于这一层），以及 request-control.ts 里已经在途的物理请求。只取消其中一层都会漏。
  cancelAll() {
    this.logicalRequestControllers.forEach((controller) => controller.abort());
    this.logicalRequestControllers.clear();
    this.requestControl.cancelAll();
  }

  // 三条分发规则，对应三种「这个错误该让谁知道」：
  //   cancel      —— 谁都不告诉。用户自己切走的页面，不是故障。
  //   已被 auth 处理 —— 只上报不展示。auth 模块已经弹过登录框了，不要再叠一个 Toast。
  //   silent      —— 只上报不展示。调用方自己接管了 UI，但监控不能跟着一起瞎。
  private notifyFailure(error: RequestError, silent: boolean, handledAuth: boolean) {
    if (error instanceof HttpError && error.kind === "cancel") {
      return;
    }

    invokeErrorCallback(this.runtimeOptions.onReport, error);
    if (!silent && !handledAuth) {
      invokeErrorCallback(this.runtimeOptions.onError, error);
    }
  }
}
