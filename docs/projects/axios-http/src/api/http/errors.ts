/**
 * 错误模型。整个封装的错误都在这里定型，client.ts 只负责在合适的时机调用。
 *
 * 两个类型，分工不同：
 *   HttpError              传输层面的失败，带 kind 分类（http/network/timeout/…）
 *   ApiEnvelopeFormatError HTTP 明明成功了，响应体却不是本项目协议格式
 *
 * 一条贯穿全文件的原则：**这里一个字用户文案都没有**。核心只产出稳定的分类和安全
 * 的请求上下文，文案由 adapters/error-presenter.ts 决定。这样换 UI 语言、换文案风格，
 * 甚至同一个错误在不同页面显示不同说法，都不需要动这个文件。
 *
 * 另一条要留意的是「哪些字段可枚举」，见下面 WeakMap 处的说明——那是本文件最容易
 * 改错的地方。
 */

import axios from "axios";

// Axios 用这些 code 表示「请求还没发出去就配置错了」。单独归成 configuration，
// 是因为它们和网络故障的处置方式完全不同：这类错误重试一万次也是一样的结果，
// 该改的是代码。
const AXIOS_CONFIGURATION_CODES = new Set([
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ERR_DEPRECATED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
  "ERR_FORM_DATA_DEPTH_EXCEEDED",
]);

export type HttpErrorKind =
  | "http"
  | "network"
  | "timeout"
  | "cancel"
  | "configuration"
  | "unknown";

export type RequestErrorOrigin = "business" | "auth-refresh";

export interface RequestErrorContext {
  method: string;
  path: string;
  attempts: number;
  elapsedMs: number;
  origin: RequestErrorOrigin;
  originMethod?: string;
  originPath?: string;
}

export type HttpErrorOptions = {
  kind: HttpErrorKind;
  message: string;
  status?: number;
  presentationHint?: string;
  cause?: unknown;
  context?: Partial<RequestErrorContext>;
};

/**
 * 下面两个 WeakMap 是同一个设计的两处应用，值得单独说明——这是本文件最容易改坏的
 * 地方。
 *
 * 错误对象上的字段分成两类：
 *
 *   会被序列化的   kind、status、method、path、attempts、elapsedMs、origin
 *                 普通的实例属性，可枚举。onReport 里 JSON.stringify(error) 要能
 *                 原样拿到它们，监控平台才有东西可看。
 *
 *   不该被序列化的 responseData、presentationHint、cause
 *                 存在模块级 WeakMap 里，只通过原型上的 getter 读。它们**不可枚举**，
 *                 所以 JSON.stringify 看不见。
 *
 * 为什么第二类要藏起来：它们装的是整个响应体和服务端原文，里面可能有手机号、订单
 * 详情、后端堆栈。要是可枚举，onReport 一句 JSON.stringify 就把这些全传到第三方
 * 监控平台去了，而写这行代码的人根本意识不到。
 *
 * 改动提示：往这两个类加新字段时，先问它属于哪一类。加成普通属性 = 默认会被上报。
 */
const apiEnvelopeResponseData =
  new WeakMap<ApiEnvelopeFormatError, unknown>();

export class ApiEnvelopeFormatError extends Error {
  readonly status: number;
  readonly method: string;
  readonly path: string;
  readonly attempts: number;
  readonly elapsedMs: number;
  readonly origin: RequestErrorOrigin;
  readonly originMethod?: string;
  readonly originPath?: string;

  get responseData() {
    return apiEnvelopeResponseData.get(this);
  }

  constructor(
    status: number,
    responseData: unknown,
    context: Partial<RequestErrorContext> = {},
  ) {
    super("API response does not match the expected envelope");
    this.name = "ApiEnvelopeFormatError";
    this.status = status;
    apiEnvelopeResponseData.set(this, responseData);
    this.method = context.method ?? "UNKNOWN";
    this.path = context.path ?? "";
    this.attempts = context.attempts ?? 0;
    this.elapsedMs = context.elapsedMs ?? 0;
    this.origin = context.origin ?? "business";
    this.originMethod = context.originMethod;
    this.originPath = context.originPath;
  }
}

const httpErrorPresentationHints = new WeakMap<HttpError, string>();

export class HttpError extends Error {
  readonly kind: HttpErrorKind;
  readonly status?: number;
  readonly method: string;
  readonly path: string;
  readonly attempts: number;
  readonly elapsedMs: number;
  readonly origin: RequestErrorOrigin;
  readonly originMethod?: string;
  readonly originPath?: string;

  get presentationHint() {
    return httpErrorPresentationHints.get(this);
  }

  constructor(options: HttpErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "HttpError";
    this.kind = options.kind;
    this.status = options.status;
    if (options.presentationHint !== undefined) {
      httpErrorPresentationHints.set(this, options.presentationHint);
    }
    this.method = options.context?.method ?? "UNKNOWN";
    this.path = options.context?.path ?? "";
    this.attempts = options.context?.attempts ?? 0;
    this.elapsedMs = options.context?.elapsedMs ?? 0;
    this.origin = options.context?.origin ?? "business";
    this.originMethod = options.context?.originMethod;
    this.originPath = options.context?.originPath;
  }
}

export type RequestError = HttpError | ApiEnvelopeFormatError;

// 请求上下文要到逻辑请求彻底结束才完整（试了几次、花了多久），但错误对象在中途就
// 已经创建好了。所以这里选择**就地写入**，而不是拿着上下文重建一个新错误。
//
// 重建的代价是丢掉对象身份：auth.ts 用 WeakSet 记录「这个错误我处理过了」，
// presentationHint / responseData 挂在以错误对象为键的 WeakMap 上，连原始 stack
// 都会变。换个对象，这些关联全部失效。
//
// 字段本身是 readonly，所以这里用 -readonly 的映射类型开一个内部写入口——对外仍然
// 只读，只有这个函数能改。
type RequestErrorContextFields = {
  -readonly [Key in keyof RequestErrorContext]: RequestErrorContext[Key];
};

export function assignRequestErrorContext<Error extends RequestError>(
  error: Error,
  context: RequestErrorContext,
): Error {
  Object.assign(error as Error & RequestErrorContextFields, context);
  return error;
}

// 当请求带 responseType: "blob"（下载）时，失败响应的 body 也会是 Blob——里面其实
// 是一段 JSON 错误信息，但类型不对，直接读会拿到 "[object Blob]"。这里把它还原成
// 对象，错误文案才能正常取出来。
async function readErrorPayload(value: unknown): Promise<unknown> {
  if (typeof Blob === "undefined" || !(value instanceof Blob)) {
    return value;
  }

  const text = await value.text();
  if (!text) {
    return value;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export interface NormalizeHttpErrorOptions {
  readErrorMessage?: (payload: unknown, status: number) => string | undefined;
}

/**
 * 把任何东西——AxiosError、DOMException、别人扔的字符串——收敛成一个 HttpError。
 *
 * 下面这串判断**次序不能随便调**，每一条都在挡住前面漏下来的情况：
 *
 *   1. 已经是 HttpError    原样返回，避免重试路径上反复包装
 *   2. 取消                 必须排在超时前面：取消也可能带 ECONNABORTED
 *   3. 不是 AxiosError      到这里说明根本不是请求本身的问题
 *   4. 超时                 靠 ETIMEDOUT/ECONNABORTED 识别
 *   5. 有 response          服务端应答了，是 http 错误，此时才有 status
 *   6. 配置错误             请求没能发出去
 *   7. 网络错误             发出去了但没到达
 *   8. 兜底 unknown         宁可分类模糊，也不要漏掉一个错误
 *
 * 注意第 5 条：判断依据是「有没有 response」，不是状态码的数值。HTTP 状态是成功
 * 与否的唯一权威，信封里的 code 不参与这个判断。
 */
export async function normalizeHttpError(
  error: unknown,
  options: NormalizeHttpErrorOptions = {},
): Promise<HttpError> {
  if (error instanceof HttpError) {
    return error;
  }

  if (axios.isCancel(error)) {
    return new HttpError({
      kind: "cancel",
      message: "Request canceled",
      cause: error,
    });
  }

  if (!axios.isAxiosError(error)) {
    return new HttpError({
      kind: "unknown",
      message: "Unknown request failure",
      cause: error,
    });
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return new HttpError({
      kind: "timeout",
      message: "Request timed out",
      cause: error,
    });
  }

  if (error.response) {
    const payload = await readErrorPayload(error.response.data);
    const status = error.response.status;
    return new HttpError({
      kind: "http",
      status,
      message: `HTTP request failed with status ${status}`,
      // 只有 4xx 才取服务端文案：那是「你提交的东西有问题」，服务端最清楚该怎么说。
      // 5xx 一律不取——服务端崩溃时返回的往往是堆栈或者网关的英文页面，直接显示给
      // 用户既看不懂又泄露实现细节，那种情况统一用 presenter 的兜底文案。
      presentationHint:
        status >= 400 && status < 500
          ? options.readErrorMessage?.(payload, status)
          : undefined,
      cause: error,
    });
  }

  if (AXIOS_CONFIGURATION_CODES.has(error.code ?? "")) {
    return new HttpError({
      kind: "configuration",
      message: "Request configuration failed",
      cause: error,
    });
  }

  if (error.code === "ERR_NETWORK") {
    return new HttpError({
      kind: "network",
      message: "Network request failed",
      cause: error,
    });
  }

  return new HttpError({
    kind: "unknown",
    message: "Unknown request failure",
    cause: error,
  });
}
