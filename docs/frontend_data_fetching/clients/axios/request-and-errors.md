# 请求失败与统一收尾

[上一页](./minimal-client.md)已经得到一个最小客户端：页面调用
`await loadUser()`，成功时直接拿到 `User`。本页不改变这个调用方式，只继续增加
两项能力：先让所有失败走同一个出口，再把一次请求的开始与结束集中起来。

## 阶段三：先看问题

### 先看阶段三怎样抛出错误

阶段三的请求方法没有 `catch`：

```ts
async request<Result, Body = unknown>(
  config: HttpRequestConfig<Body>,
): Promise<Result> {
  const response = await this.instance.request<Result>(config);
  return response.data;
}
```

这不表示错误消失了。`await this.instance.request()` 一旦失败，Promise 会自动拒绝，错误
沿着 `request() → get() → loadUser()` 原样到达页面：

```ts
try {
  const user = await loadUser();
} catch (error) {
  // 阶段三：直接收到 Axios 或响应适配器抛出的错误
}
```

同一个 `catch` 收到的对象并不统一：

| 失败场景         | 阶段三抛给页面的内容                               |
| ---------------- | -------------------------------------------------- |
| 403、500         | `AxiosError`，状态码和响应体在 `error.response` 中 |
| 超时、断网       | `AxiosError`，还要判断 `code`、`request` 等字段    |
| 2xx 响应格式错误 | `envelope.ts` 抛出的普通 `Error`                   |

### 阶段三的问题是什么

阶段三已经能让页面捕获错误，问题不是“捕获不到”，而是**页面收到的错误结构不稳定**。如果
直接停在这里，每个页面都要认识 Axios、认识本项目的响应格式，还要各自决定 4xx、5xx、
超时和断网显示什么。全局提示和错误上报也容易在不同页面重复实现。

阶段三已有的固定配置、单次请求白名单、响应适配器、`get()` 和 `post()` 全部保留，
阶段四只解决失败出口不统一的问题。

## 阶段四：先看完整方案

先不进入任何函数内部。从整体看，阶段四只给阶段三的成功路径外面增加一个 `catch`：

```ts
try {
  const response = await this.instance.request<Result>(axiosConfig);
  return response.data;
} catch (cause) {
  const error = normalizeRequestError(cause);
  this.notifyFailure(error, errorMode);
  throw error;
}
```

失败依次经过三步，后面的内容也严格按这三行寻找依赖：

| catch 中的代码                    | 后面负责实现它的部分                        |
| --------------------------------- | ------------------------------------------- |
| `normalizeRequestError(cause)`    | 优化一建立错误分类；优化五增加 4xx 候选提示 |
| `notifyFailure(error, errorMode)` | 优化二至四完成文案、通知分流和边界保护      |
| `throw error`                     | 回到完整实现时说明页面为什么仍能捕获错误    |

优化五只会扩展第一行的参数，不改变这条执行顺序。

## 拆开实现 catch 中的三行

### 优化一：先确定错误分类

`normalizeRequestError()` 要解决的不是“有没有错误”，而是“不同错误如何用同一种方式
表达”。先确定输入会落入哪些分类，再讨论代码实现：

| 原始信号                     | 整理结果                 | 页面可以依赖什么           |
| ---------------------------- | ------------------------ | -------------------------- |
| `error.response` 存在        | `kind: "http"`           | `status`                   |
| `ECONNABORTED` / `ETIMEDOUT` | `kind: "timeout"`        | 稳定的超时分类             |
| `ERR_NETWORK`                | `kind: "network"`        | 稳定的网络分类             |
| 已知 Axios 配置错误码        | `kind: "configuration"`  | 知道重试无效，应检查代码   |
| `axios.isCancel(error)`      | `kind: "cancel"`         | 可以跳过提示与上报         |
| 无法识别                     | `kind: "unknown"`        | 安全兜底                   |
| 2xx 但响应信封不合法         | `ApiEnvelopeFormatError` | 区分 HTTP 失败与协议不成立 |

这些分类最终收敛成两种运行时错误对象：传输相关失败使用 `HttpError`，响应协议信封不成立
保留为 `ApiEnvelopeFormatError`：

```text
阶段三直接暴露给页面的错误
├─ AxiosError
└─ 响应适配器抛出的普通 Error

整理后对外约定的错误类型
RequestError（TypeScript 联合类型）
├─ HttpError
└─ ApiEnvelopeFormatError
```

`RequestError` 只是 TypeScript 联合类型名称，不是第三种运行时错误对象：

```ts
type RequestError = HttpError | ApiEnvelopeFormatError;
```

分类和输出结构确定后，再看方案的完整代码。下面的 `errors.ts` 立即实现
`normalizeRequestError()`，不会再留下只有函数名、找不到实现的跳跃：

```ts
import axios from "axios";

const AXIOS_CONFIGURATION_CODES = new Set([
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ERR_DEPRECATED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
  "ERR_FORM_DATA_DEPTH_EXCEEDED",
]);

type HttpErrorKind = "http" | "network" | "timeout" | "cancel" | "configuration" | "unknown";

class ApiEnvelopeFormatError extends Error {
  readonly name = "ApiEnvelopeFormatError";

  constructor() {
    super("API response does not match the expected envelope");
  }
}

interface HttpErrorOptions {
  kind: HttpErrorKind;
  message: string;
  status?: number;
  cause?: unknown;
}

class HttpError extends Error {
  readonly name = "HttpError";
  readonly kind: HttpErrorKind;
  readonly status?: number;

  constructor(options: HttpErrorOptions) {
    super(options.message, { cause: options.cause });
    this.kind = options.kind;
    this.status = options.status;
  }
}

type RequestError = ApiEnvelopeFormatError | HttpError;

function normalizeRequestError(error: unknown): RequestError {
  // 已经整理过的错误保持原对象，不重复包装。
  if (error instanceof ApiEnvelopeFormatError || error instanceof HttpError) {
    return error;
  }

  // 取消可能也带 ECONNABORTED，所以必须先于超时判断。
  if (axios.isCancel(error)) {
    return new HttpError({
      kind: "cancel",
      message: "Request was canceled",
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

  const code = error.code?.toUpperCase();

  if (code === "ECONNABORTED" || code === "ETIMEDOUT") {
    return new HttpError({
      kind: "timeout",
      message: "Request timed out",
      cause: error,
    });
  }

  if (error.response) {
    const status = error.response.status;
    return new HttpError({
      kind: "http",
      message: `HTTP request failed with status ${status}`,
      status,
      cause: error,
    });
  }

  if (AXIOS_CONFIGURATION_CODES.has(code ?? "")) {
    return new HttpError({
      kind: "configuration",
      message: "Request configuration failed",
      cause: error,
    });
  }

  if (code === "ERR_NETWORK") {
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
```

这里看似重复的三处代码分别承担不同职责：

| 位置               | 作用                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| `HttpErrorOptions` | 约束构造函数接收什么                                                    |
| 类字段声明         | 约束实例创建后对外具有什么；`readonly` 禁止随后改写，`?` 表示可能没有值 |
| `this.kind = ...`  | 在运行时把输入真正保存到实例                                            |

判断顺序就是分类规则：先保留已经整理过的错误，再依次判断取消、非 Axios 错误、超时、
HTTP 响应、配置错误和网络错误，最后用 `unknown` 兜底。到这里，后续模块已经可以直接调用
一个完整的 `normalizeRequestError()`。

### 优化二：按稳定分类提供固定文案

基础版本不读取 `error.response.data`，只根据已经整理好的 `kind` 和 `status` 决定文案。
这样先把“错误分类”和“项目响应格式”分开学：

```ts
// 使用位置：http.ts 传给 createHttpClient 的 onError 回调。
// 此处收到的 error 已经是 RequestError，可以直接按稳定分类生成提示文案。
export function presentApiError(error: RequestError): string {
  if (error instanceof ApiEnvelopeFormatError) {
    return "响应格式异常，请稍后重试";
  }

  switch (error.kind) {
    case "cancel":
      return "请求已取消";
    case "timeout":
      return "请求超时，请稍后重试";
    case "network":
      return "网络连接失败，请检查网络";
    case "configuration":
      return "请求配置异常，请联系管理员";
    case "unknown":
      return "请求失败，请稍后重试";
    case "http":
      if ((error.status ?? 0) >= 500) return "服务暂时不可用，请稍后重试";
      if (error.status === 401) return "登录状态已失效，请重新登录";
      if (error.status === 403) return "没有权限执行此操作";
      if (error.status === 404) return "请求的内容不存在";
      if (error.status === 429) return "操作过于频繁，请稍后再试";
      return `请求未能完成（HTTP ${error.status ?? "未知"}）`;
  }
}

// 使用位置：main.ts 等页面代码的 catch(error)。
// catch 变量是 unknown：属于本封装时复用 presentApiError，否则返回安全兜底。
export function presentRequestError(error: unknown, fallback = "请求失败，请稍后重试"): string {
  if (error instanceof ApiEnvelopeFormatError || error instanceof HttpError) {
    return presentApiError(error);
  }

  return fallback;
}
```

两个函数对应两个不同的输入边界：

| 函数                    | 调用位置                    | 此处拿到的错误      | 作用                                 |
| ----------------------- | --------------------------- | ------------------- | ------------------------------------ |
| `presentApiError()`     | `http.ts` 的 `onError` 回调 | 已是 `RequestError` | 直接按分类生成精确文案               |
| `presentRequestError()` | 页面 `catch (error)`        | 仍是 `unknown`      | 识别本封装错误；其他异常返回安全兜底 |

先看全局提示最终会怎样接入。到优化二为止，真正完成的是 `presenter.ts` 中的两个文案
函数；下面这段先展示项目希望达到的调用方式。`onError` 怎样进入创建配置、怎样保存到
`HttpClient`、又怎样在请求失败时触发，会在优化三中沿着同一个 `http.ts` 逐步接通：

```ts
import { presentApiError } from "./presenter";

const requestEvents: string[] = [];

const http = createHttpClient({
  baseURL: "/api",
  onError(error) {
    // error 的类型由 CreateHttpClientOptions 保证为 RequestError。
    requestEvents.push(`全局提示：${presentApiError(error)}`);
  },
});
```

准确地说，`createHttpClient()` 本身不会调用 Presenter。优化三会让它保存项目传入的
`onError`，再由 `notifyFailure()` 触发该回调，回调最后调用 `presentApiError()`：

```text
notifyFailure(error, errorMode)
  → 项目传入的 onError(error: RequestError)
  → presentApiError(error)
  → 全局提示
```

页面自己的 `catch` 则是另一个独立使用位置。TypeScript 把 `error` 视为 `unknown`，所以先走
安全入口：

```ts
import { presentRequestError } from "./presenter";

try {
  const user = await loadUser();
} catch (error) {
  result.textContent = presentRequestError(error);
}
```

```text
catch(error: unknown)
  → presentRequestError(error)
  → 是 RequestError：presentApiError(error)
  → 不是 RequestError：安全兜底文案
```

因此，`presentRequestError()` 不是 `createHttpClient()` 内部的一部分；它是教学示例为了处理
页面 `unknown` 边界额外提供的包装函数。原封装案例的 `onError` 已经拿到 `RequestError`，
直接使用 `presentApiError()`。

到优化二为止，403 使用前端固定文案，500 也不会直接暴露后端原文。这里暂时不引入
`readApiErrorMessage` 或 `presentationHint`，优化五再说明它们解决的具体问题。

### 优化三：完整接入提示与上报

这一节只修改 `src/http.ts`。`errors.ts` 已经能整理错误，`presenter.ts` 已经能生成文案，
但阶段三的 `HttpClient` 还没有保存回调，也没有在失败时触发它们。下面从阶段三进阶版
的 `http.ts` 继续，每次只增加一个连接点。

#### 第一步：让单次请求可以声明是否静默

先扩展阶段三已有的 `HttpRequestConfig`。保留原来的 Axios 配置白名单，只在交叉类型末尾
增加本封装自己的 `ErrorBehavior`：

```ts
export type ErrorMode = "global" | "silent";

export interface ErrorBehavior {
  errorMode?: ErrorMode;
}

export type HttpRequestConfig<Body = unknown> = Pick<
  AxiosRequestConfig<Body>,
  AllowedAxiosConfigKey
> &
  ErrorBehavior;
```

这一步只建立单次请求配置。现在 TypeScript 已经允许页面传入
`{ errorMode: "silent" }`，但它还不会影响执行结果；下一步先让客户端拥有需要调用的
回调。

#### 第二步：在创建客户端时接收回调

先在 `http.ts` 顶部从 `errors.ts` 引入本节需要的类型和函数：

```ts
import { normalizeRequestError, type RequestError } from "./errors";
```

然后在阶段三已有的 `CreateHttpClientOptions` 末尾增加 `onError` 和 `onReport`：

```ts
export interface CreateHttpClientOptions {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  onError?: (error: RequestError) => unknown;
  onReport?: (error: RequestError) => unknown;
}
```

配置传入工厂之后，还要由 `HttpClient` 保存。把原来只接收 `instance` 的构造函数：

```ts
class HttpClient {
  constructor(private readonly instance: AxiosInstance) {}
}
```

替换为：

```ts
class HttpClient {
  constructor(
    private readonly instance: AxiosInstance,
    private readonly options: CreateHttpClientOptions,
  ) {}
}
```

工厂返回客户端的位置也要同时补上第二个参数：

```diff
 function createHttpClient(options: CreateHttpClientOptions) {
   const instance = axios.create(createAxiosDefaults(options));
   installApiEnvelopeAdapter(instance);
-  return new HttpClient(instance);
+  return new HttpClient(instance, options);
 }
```

到这里，`this.options` 的来源已经明确：项目创建客户端时传入回调，工厂把同一份配置
交给 `HttpClient` 保存。

#### 第三步：在 HttpClient 内增加失败分流

现在把 `notifyFailure()` 放进 `HttpClient`，紧跟在构造函数后面：

```ts
class HttpClient {
  constructor(
    private readonly instance: AxiosInstance,
    private readonly options: CreateHttpClientOptions,
  ) {}

  private notifyFailure(error: RequestError, errorMode: ErrorMode) {
    this.options.onReport?.(error);
    if (errorMode !== "silent") {
      this.options.onError?.(error);
    }
  }
}
```

规则只有两条：所有请求失败都先进入 `onReport`；只有非静默请求才进入 `onError`。
这个方法刚刚定义好，下一步马上把它接入已有的请求方法。

#### 第四步：在请求失败时真正调用分流方法

用下面两个方法替换阶段三原来的 `async request()`。公开的 `request()` 只负责转交，新的
`execute()` 才负责取出 `errorMode`、发送请求和处理失败：

```ts
request<Result, Body = unknown>(
  config: HttpRequestConfig<Body>,
): Promise<Result> {
  return this.execute<Result, Body>(config);
}

private async execute<Result, Body = unknown>(
  config: HttpRequestConfig<Body>,
): Promise<Result> {
  const { errorMode = "global", ...axiosConfig } = config;

  try {
    const response = await this.instance.request<
      Result,
      AxiosResponse<Result, Body>,
      Body
    >(axiosConfig);

    return response.data;
  } catch (cause) {
    const error = normalizeRequestError(cause);
    this.notifyFailure(error, errorMode);
    throw error;
  }
}
```

这里第一次把本节新增的内容全部连起来：

```text
config.errorMode
  → execute() 从 Axios 配置中单独取出
  → 请求失败后 normalizeRequestError(cause)
  → notifyFailure(error, errorMode)
  → onReport / onError
  → throw error 继续交给页面
```

`errorMode` 是本封装的行为，不会被传给 Axios。`throw error` 也不能省略：全局提示和错误
上报只是附加动作，页面仍然需要收到同一个 `RequestError`，才能决定空状态或局部降级。

#### 第五步：在项目入口提供具体回调

现在回到优化二预览过的客户端创建位置。先引入 Presenter，再把创建配置替换为下面的
完整版本：

```ts
import { presentApiError } from "./presenter";

const requestEvents: string[] = [];

const http = createHttpClient({
  baseURL: "/api",
  onError(error) {
    requestEvents.push(`全局提示：${presentApiError(error)}`);
  },
  onReport(error) {
    requestEvents.push(`错误上报：${error.name}`);
  },
});
```

`HttpClient` 仍然不知道项目使用 Toast、弹窗还是监控 SDK。它只调用回调；项目入口中的
`onError` 再使用优化二的 `presentApiError()` 生成文案。

#### 第六步：对比普通请求和静默请求

普通请求不传 `errorMode`，失败时既上报，也触发全局提示：

```ts
await http.get<User>("/users/1");
```

页面准备自己显示空状态时，只关闭这一次请求的全局提示：

```ts
await http.get<User>("/users/1", {
  errorMode: "silent",
});
```

两种请求最终都会把错误抛给页面，差异只在是否调用 `onError`：

| 请求方式              | `onReport` | `onError` | 页面 `catch` |
| --------------------- | ---------- | --------- | ------------ |
| 默认 `global`         | 调用       | 调用      | 收到错误     |
| `errorMode: "silent"` | 调用       | 不调用    | 收到错误     |

这里出现的配置分别属于不同层次：

| 名称                                 | 谁使用它                           |
| ------------------------------------ | ---------------------------------- |
| `baseURL`、`timeout`、`transitional` | Axios 实例配置                     |
| `errorMode`                          | 本封装增加的单次请求行为           |
| `onError`、`onReport`                | 创建 `HttpClient` 时注入的外部回调 |

### 优化四：通知失败不能替换请求错误

优化三还有两个边界：主动取消不应提示或上报；提示组件或监控 SDK 自己失败，也不能
替换真正的请求错误。因此把回调调用收口到一个安全函数，再给 `notifyFailure()` 补上取消
分支：

```ts
function invokeErrorCallback(
  callback: ((error: RequestError) => unknown) | undefined,
  error: RequestError,
) {
  try {
    void Promise.resolve(callback?.(error)).catch(() => undefined);
  } catch {
    // 外部回调失败，到这里结束，不能改变请求结果。
  }
}

private notifyFailure(error: RequestError, errorMode: ErrorMode) {
  if (error instanceof HttpError && error.kind === "cancel") return;

  invokeErrorCallback(this.options.onReport, error);
  if (errorMode !== "silent") {
    invokeErrorCallback(this.options.onError, error);
  }
}
```

优化四只替换回调的调用方式：优化三已经接通的 `execute()`、`errorMode` 和抛错流程都不
需要移动。下一项优化再给 4xx 增加可选的业务提示。

### 优化五：让 4xx 携带可选业务提示

优化二的固定文案能说明“没有权限”或“内容不存在”，却无法解释“手机号已注册”“验证码
错误”这类具体业务原因。这些信息只有服务端最清楚，因此 4xx 可以额外携带一个候选提示。

为什么不直接把服务端文案写入 `Error.message`？因为两个字段面向不同对象：

| 字段               | 作用                                                                  |
| ------------------ | --------------------------------------------------------------------- |
| `message`          | 核心生成的稳定技术描述，供调试和错误分析使用                          |
| `presentationHint` | 项目 Adapter 从 4xx 响应中读取的候选用户提示，最终仍由 Presenter 决定 |

例如同一个错误可以同时保留：

```ts
{
  kind: "http",
  status: 400,
  message: "HTTP request failed with status 400",
  presentationHint: "该手机号已被注册",
}
```

这样服务端文案变化不会破坏稳定的错误分类，Presenter 也可以覆盖或忽略它。由于候选提示
可能包含手机号、订单号等响应数据，完整案例把它存入 `WeakMap`，只通过不可枚举的 getter
读取，避免 `JSON.stringify(error)` 默认把它带入错误上报：

```ts
interface HttpErrorOptions {
  kind: HttpErrorKind;
  message: string;
  status?: number;
  presentationHint?: string;
  cause?: unknown;
}

const presentationHints = new WeakMap<HttpError, string>();

class HttpError extends Error {
  readonly kind: HttpErrorKind;
  readonly status?: number;

  get presentationHint() {
    return presentationHints.get(this);
  }

  constructor(options: HttpErrorOptions) {
    super(options.message, { cause: options.cause });
    this.kind = options.kind;
    this.status = options.status;

    if (options.presentationHint !== undefined) {
      presentationHints.set(this, options.presentationHint);
    }
  }
}
```

字段由三个模块协作产生和使用。首先，项目 Adapter 决定怎样读取当前项目的错误响应：

```ts
function readApiErrorMessage(payload: unknown) {
  return readApiEnvelope(payload)?.message;
}
```

然后在优化一的完整 `normalizeRequestError()` 上增加可选读取器，并替换其中已经讲过的
`error.response` 分支。其余分类分支保持不变：

```diff
interface NormalizeRequestErrorOptions {
  readErrorMessage?: (payload: unknown, status: number) => string | undefined;
}

- function normalizeRequestError(error: unknown): RequestError {
+ function normalizeRequestError(
+   error: unknown,
+   options: NormalizeRequestErrorOptions = {},
+ ): RequestError {

  if (error.response) {
    const status = error.response.status;
    return new HttpError({
      kind: "http",
      message: `HTTP request failed with status ${status}`,
      status,
+     presentationHint:
+       status >= 400 && status < 500
+         ? options.readErrorMessage?.(error.response.data, status)
+         : undefined,
      cause: error,
    });
  }
```

因此只有 4xx 会请求候选提示；5xx 可能包含堆栈或网关信息，不读取。

最后由 Presenter 决定优先级。5xx 固定文案必须在最前面，随后才考虑 4xx 候选提示，
没有候选提示时继续按状态码兜底：

```ts
if ((error.status ?? 0) >= 500) return "服务暂时不可用，请稍后重试";
if (error.presentationHint) return error.presentationHint;
if (error.status === 403) return "没有权限执行此操作";
```

因此 CodeLab 中的 403 会显示 Mock 返回的“没有查看此用户的权限”，500 仍只显示前端
固定文案。换成其他项目协议时，只需要替换 `readApiErrorMessage()`，`HttpError` 和
Presenter 不需要认识响应体结构。

## 回到整体：阶段四完整实现

现在回看优化三已经接通的请求方法。优化四保护了回调边界，优化五扩展了错误整理参数；
下面把这些变化合在一起，得到阶段四最终的 `execute()`：

```ts
private async execute<Result, Body = unknown>(
  config: HttpRequestConfig<Body>,
): Promise<Result> {
  const { errorMode = "global", ...axiosConfig } = config;

  try {
    const response = await this.instance.request<Result>(axiosConfig);
    return response.data;
  } catch (cause) {
    const error = normalizeRequestError(cause, {
      readErrorMessage: readApiErrorMessage,
    });

    this.notifyFailure(error, errorMode);
    throw error;
  }
}
```

这三行分别对应：

1. `normalizeRequestError()`：优化一建立分类，优化五增加项目 4xx 文案读取器。
2. `notifyFailure()`：优化二提供固定文案，优化三完成分流，优化四保护回调边界。
3. `throw error`：把同一个错误继续交给页面，客户端不替页面决定如何降级。

需要自己展示空状态的页面仍然使用普通 `try/catch`，并用 `errorMode: "silent"` 关闭本次
请求的全局提示：

```ts
try {
  return await http.get<User>("/users/1", {
    errorMode: "silent",
  });
} catch (error) {
  // 页面自己的空状态或降级处理
}
```

### 代码示例

CodeLab 中的 `src/http.ts` 是阶段三进阶版加上统一失败出口；`src/errors.ts` 负责分类并
生成 4xx 候选提示，`src/envelope.ts` 负责项目响应协议，`src/presenter.ts` 决定最终展示。
运行六种场景可以逐一验证固定文案、4xx 业务提示、静默请求和错误上报。

<CodeLab
  project="axios-unified-errors"
  default-file="src/http.ts"
  layout="notebook"
  height="780px"
/>

---

## 阶段五：把一次请求的收尾集中起来

阶段四已经统一了失败出口，但 Loading 如果散落在页面里，成功、失败和提前返回很容易
漏掉关闭动作。现在只给同一个 `execute()` 增加一层请求外壳：

```ts
private async execute<Result>(config: HttpRequestConfig): Promise<Result> {
  const { errorMode = "global", showLoading = false, ...axiosConfig } = config;

  if (showLoading) this.startLoading();

  try {
    try {
      const response = await this.instance.request<Result>(axiosConfig);
      return response.data;
    } catch (cause) {
      const error = normalizeRequestError(cause, {
        readErrorMessage: readApiErrorMessage,
      });
      this.notifyFailure(error, errorMode);
      throw error;
    }
  } finally {
    if (showLoading) this.stopLoading();
  }
}
```

`finally` 覆盖成功和失败两条路径，所以 Loading 一定能够收尾。此时一次
`loadUser()` 只发送一次物理请求；[下一阶段](./lifecycle.md)加入取消与重试后，内部可以
发送多次，但页面外面的这层开始、错误出口和最终清理都不用移动。

```text
页面的一次 loadUser()
  → execute() 开始一次逻辑请求
      → 当前：发送一次
      → 后续：可以重试，但仍留在 execute() 内
  → finally 只收尾一次
```

### 并发请求不能提前关闭 Loading

一个布尔值不足以处理并发。客户端保存正在显示 Loading 的请求数，只在 `0 → 1` 和
`1 → 0` 两个边界通知界面：

```ts
private startLoading() {
  this.loadingCount += 1;
  if (this.loadingCount === 1) this.options.onLoadingChange?.(true);
}

private stopLoading() {
  this.loadingCount = Math.max(0, this.loadingCount - 1);
  if (this.loadingCount === 0) this.options.onLoadingChange?.(false);
}
```

因此两个并发请求中，较快的请求结束时不会把较慢请求的 Loading 关掉。

### 代码示例

这个示例完整保留阶段四的错误出口，只在 `HttpClient` 中加入 `showLoading`、计数器和
`finally`。运行“两个并发请求”，可以看到一快一慢两次请求只产生一次打开和一次关闭。

<CodeLab
  project="axios-logical-request"
  default-file="src/http.ts"
  layout="notebook"
  height="780px"
/>

完整快照中的对应测试是
`test/http-client.test.ts` 的
`keeps one loading interval open for concurrent logical requests`：它并发发送 `/slow` 和
`/fast` **两个**请求，第二个先结束时 Loading 保持打开，第一个结束后才关闭。

## 与完整封装的对应关系

CodeLab 是按学习顺序裁剪的版本；`docs/projects/axios-http/` 是本站用于测试完整方案的
项目快照，两者承担的作用不同。

| 本页先学的部分          | 完整快照中的位置                           | 完整版随后增加的内容      |
| ----------------------- | ------------------------------------------ | ------------------------- |
| 错误分类与 4xx 候选提示 | `src/api/http/errors.ts`                   | 请求上下文、Blob 错误响应 |
| 固定兜底与展示优先级    | `src/api/http/adapters/error-presenter.ts` | 更多项目协议适配          |
| `execute()` 与 Loading  | `src/api/http/client.ts`                   | 取消、重试、认证重放      |

CodeLab 已实现优化五：`presentationHint` 通过 `WeakMap` 保持不可枚举，`cause` 使用
JavaScript 原生的 `Error.cause`。完整快照随后还会处理 Blob 错误响应，并用同样方式隐藏
`responseData`；这些生产加固不改变本页建立的字段职责和展示优先级。

项目快照会随本站测试维护，但它不是对外部原项目目录的自动同步副本。阅读时应把 CodeLab
当作学习增量，把项目快照当作完整实现与测试依据。
