# Axios 请求层渐进式学习路径

从一个裸 Axios 实例出发，一次加一个能力，最后得到 `src/api/http/` 里的完整实现。

## 0. 怎么读这份文档

三份材料分工不同，别拿错：

| 材料 | 回答的问题 |
| --- | --- |
| 本文 | 按什么顺序学，每一步是**被什么问题逼出来的** |
| [DESIGN.md](../DESIGN.md) | 最终方案为什么是这样，有哪些被否决的选项 |
| [src/api/http/](../src/api/http/) | 经过测试的实现；每个文件头都有该文件的地图 |

**不要从实现的第一行读到最后一行。** 那样会在第 40 行撞上并发刷新的代际号，然后
放弃。

每个阶段都是同一个结构：

```text
一个具体场景
    ↓
先写最直觉的那版代码
    ↓
它在什么情况下塌掉（这一步最重要）
    ↓
现在的写法
    ↓
自己验证
```

**任何一个阶段都可以停下。** 第 11 节列了三个采用层级——大多数项目停在中间那层就
够了，把完整实现整个抄走反而是负担。

## 1. 先看一眼全局

一次请求的路径：

```text
页面 / 状态管理
    ↓  只认领域概念
src/api/modules/*.ts        业务 API 模块，如 users.ts 的 createUser()
    ↓  http.get / http.post
client.ts  request() → execute()      逻辑请求编排
    ↓
Axios 请求拦截器链   Auth → RequestControl
    （installAuth、installRequestControl 注册）
    ↓
                    网络
    ↓
Axios 响应拦截器链   RequestControl → Envelope → Auth
    （installRequestControl、installApiEnvelopeAdapter、installAuth 注册）
    ↓
execute() 收尾：错误归一化、上下文、展示与上报
    ↓
业务模块把 HTTP 错误翻译成领域错误，如 409 → UserAlreadyExistsError
    ↓
页面
```

请求链和响应链方向相反，是 Axios 的规则：**请求拦截器按注册的逆序执行，响应拦截器
按注册顺序执行**。所以 [client.ts](../src/api/http/client.ts) 里那三行安装顺序同时
决定了两条链，顺序不能动（D-17）。两条链的环数还不一样：Envelope 的职责是拆响应
信封，它只注册了响应拦截器，所以请求链上只有 Auth 和 RequestControl 两环。

再往下一层，链上的「环」有两个容易误会的地方。

**环 = 注册进那条链的那个函数，不是模块本身。** 图里写模块名只是为了好认。模块
没在某条链上注册拦截器，它就不在那条链上，Axios 根本不知道它存在——请求链只有
两环就是这么来的。

**每一环其实是一对处理器。** `use(onFulfilled, onRejected)` 同时挂成功、失败两个
分支；某个分支没提供，响应或错误就**原样穿过这一环**交给下一环：

| 响应链的环 | 成功分支 | 失败分支 |
| --- | --- | --- |
| [request-control.ts](../src/api/http/request-control.ts) | 有：`finish()` 清理 | 有：成败都得清理 |
| [envelope.ts](../src/api/http/adapters/envelope.ts) | 有：拆信封 | **没有**：失败的响应没有信封可拆 |
| [auth.ts](../src/api/http/auth.ts) | 有，但纯透传 `(response) => response` | 有：401 刷新与重放全在这里 |

所以上图的响应链严格说画的是**成功路**；失败路实际是「网络 → RequestControl →
Auth」，中间的 Envelope 被跳过。401 的错误能一路原样抵达 Auth，正是因为没有任何
环碰过它。

有一个概念贯穿全文，现在先记住：

| | 含义 | 谁管 |
| --- | --- | --- |
| **逻辑请求** | 调用方眼里的一次请求 | `client.ts` |
| **物理尝试** | 真正发出去的每一次 HTTP 请求 | `request-control.ts` |

一次逻辑请求可能产生多次物理尝试——重试一次是一次，401 之后的重放也是一次。
Loading 该开几次、错误该报几次、`cancelAll()` 取消什么，全都取决于你分清了这两者。

---

## 2. 阶段一：一个 Axios 实例

### 场景

前端要调同一个后端的十几个接口。

### 写法

```ts
import axios from "axios";

const transport = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

interface User {
  id: string;
  name: string;
}

const response = await transport.get<User>("/users/1");
const user = response.data;
```

要点只有四条：`axios.create()` 固定实例配置；`get/post` 发请求；返回的是完整
`AxiosResponse`；业务数据在 `response.data` 里。

### 它撑到什么时候

**接口少、后端直接返回业务对象、没有登录态**——那么到此为止就够了，后面七个阶段
都不必看。

它开始塌，是在以下任何一条成立时：

- 后端返回的不是 `User`，而是 `{ code, message, data }` 这层信封 → 阶段二
- 每个调用点都要写 `.data`，或者更糟的 `.data.data` → 阶段三
- 需要统一的错误提示、登录过期处理、Loading → 阶段四以后

### 自己验证

写一个最小实例，请求一个本地接口，说清 `response` 和 `response.data` 的区别。

---

## 3. 阶段二：拆掉响应信封

### 场景

后端所有成功响应都套一层：

```ts
interface ApiEnvelope<Data> {
  code: number;
  message: string;
  data: Data;
}
```

业务代码要的是 `data`，不想每次写 `response.data.data`。

### 先写最直觉的那版

```ts
// 幼稚版：绝大多数教程和项目里的写法
axiosInstance.interceptors.response.use((response) => {
  const body = response.data;
  if (body.code !== 0) {
    throw new Error(body.message);   // ← 问题在这一行
  }
  response.data = body.data;
  return response;
});
```

### 它塌在哪

`if (body.code !== 0) throw` 这一行，等于让**同一个失败有了两套并存的表达方式**：
HTTP 状态码说成功，信封 `code` 说失败。

后果是每一层都要猜该看哪一个：

- 重试逻辑要判断「这次失败能不能重试」，看 `status` 还是看 `code`？
- 监控要统计错误率，一个 `200` 但 `code: 500` 的响应算不算失败？
- 换一个后端、或者接一个第三方接口，`code` 的含义就变了，判断逻辑跟着散落各处。

而且 `code` 的取值约定是**项目**的，`status` 的语义是 **HTTP 标准**的。把项目约定塞
进通用传输层，这个封装就再也搬不走了。

### 现在的写法

**HTTP 状态码是成功与否的唯一权威，`code` 只是元数据。**
[adapters/envelope.ts](../src/api/http/adapters/envelope.ts) 解析出 `code`，但从头到尾
不用它做判断：

```ts
// 由 client.ts 的 raw() 打上，调用方要拿完整 response 时跳过解包。
const config = response.config as ApiEnvelopeRequestConfig;
if (config.__rawResponse) {
  return response;
}

// 204 按约定没有响应体，不能拿它去套信封格式，否则每个删除接口都会报协议错误。
if (response.status === 204) {
  response.data = undefined;
  return response;
}

// 到这里 HTTP 状态已经是成功了，响应体却不是信封——这是后端违约或者请求打到了
// 网关、登录页之类的地方。
const envelope = readApiEnvelope(response.data);
if (!envelope?.hasData) {
  throw new ApiEnvelopeFormatError(response.status, response.data);
}

response.data = envelope.data;
return response;
```

三个细节值得停一下：

1. **只替换 `response.data`，不重建 response。** `status`、`headers`、`config` 全部
   保留，下载要读 `Content-Disposition` 时才有东西可读。
2. **`hasData` 区分 `data: null` 和「压根没有 data 字段」。** 前者是合法的空数据，
   后者说明这根本不是本项目的响应。
3. **格式错误是独立类型**，不是 `HttpError`。HTTP 明明成功了却拿到非协议响应，通常
   意味着请求被网关或登录页截了胡，和业务失败不是一回事。

那这个后端不为 0 的 `code` 怎么办？——让后端用 HTTP 状态码表达失败。做不到的话，在
**业务模块**里翻译（阶段八），不要放进传输层。

### 自己验证

对照 [http-client.test.ts](../test/http-client.test.ts) 的
「requires code, message, and data in a successful envelope」：构造一个缺 `data` 字段的
`200` 响应，确认拿到的是 `ApiEnvelopeFormatError` 而不是 `undefined`。相邻那条
「accepts null data and bypasses the envelope for 204 responses」覆盖另外两种边界。

---

## 4. 阶段三：类型化入口

### 场景

不想每个调用点都写 `.data`，也不想在十几个文件里重复 `baseURL`。

### 写法

```ts
get<Result>(url, config): Promise<Result>
post<Result, Body>(url, data, config): Promise<Result>
```

泛型顺序固定：`Result` 是最终业务结果，`Body` 是请求体。调用处一眼能读：

```ts
const user = await http.post<User, CreateUserInput>("/users", { name: "Ada" });
```

九个方法不是九套实现，是三层复用：

```text
get / post / put / patch / delete / head / options
        ↓  只补 method、url、data
    request()          成功后选 response.data
    raw()              成功后选整个 response，并让 Envelope 跳过解包
        ↓
    execute()          唯一一条生命周期（阶段四）
```

所以 `request()` 和 `raw()` 的差别**不是怎么发送，而是成功后选什么当结果**——
`execute()` 收一个 `select` 回调就够了，不需要两套实现（D-02）。

### 4.1 调用方能透传哪些配置：一个容易写错的决定

#### 先写最直觉的那版

```ts
// 幼稚版：从完整 Axios 配置里排掉几个危险的
type HttpRequestConfig = Omit<AxiosRequestConfig, "baseURL" | "withCredentials">;
```

#### 它塌在哪

排除法要求你**穷举所有能破坏模块保证的键**，而你穷举不完：

| 漏掉的键 | 调用方能做什么 |
| --- | --- |
| `validateStatus` | 把 `5xx` 判为成功，直接击穿阶段二刚建立的「HTTP 状态是唯一权威」 |
| `adapter` | 整体换掉传输层，全部拦截器绕过 |
| `transformResponse` | 在协议 Adapter 之前改写响应体 |
| `paramsSerializer` | 改掉工厂统一决定的序列化方式 |

更麻烦的是 Axios 每次升级都可能加新配置键，排除清单**永远滞后于依赖版本**。

#### 现在的写法

白名单。新增键默认被拒绝，要放开是一次显式决定（D-56）：

```ts
type AllowedAxiosConfigKey =
  | "data" | "headers" | "method" | "onDownloadProgress" | "onUploadProgress"
  | "params" | "responseType" | "signal" | "timeout" | "url";

export type HttpRequestConfig<Body = unknown> = Pick<
  AxiosRequestConfig<Body>,
  AllowedAxiosConfigKey
> & AuthBehavior & ErrorBehavior & LoadingBehavior & RetryBehavior;
```

这是「默认安全」和「默认开放」的区别。判断依据很简单：**传输策略属于模块，调用方
只描述这一次请求**。

它和 `createAxiosDefaults()` 是同一条边界的两半——那边把策略定死，这边拦住调用方
按请求改回来。

### 自己验证

[typecheck.ts](../test/typecheck.ts) 里有一组 `@ts-expect-error` 断言。往
`HttpRequestConfig` 里传 `validateStatus`，确认 TypeScript 直接拒绝。

---

## 5. 阶段四：一次逻辑请求

### 场景

一次业务请求的真实经历可能是：

```text
发送 → 503 → 等 200ms → 重发 → 401 → 刷新凭证 → 带新令牌重放 → 200
```

四次物理请求。但对页面来说这是**一次**请求：Loading 应该只开关一次，错误最多报
一次，用户点取消应该整个都停掉。

### 先想清楚：Loading 放哪

```ts
// 幼稚版：放在拦截器里
axiosInstance.interceptors.request.use((config) => { spin.show(); return config; });
axiosInstance.interceptors.response.use((res) => { spin.hide(); return res; });
```

塌在哪：拦截器看到的是**物理尝试**。上面那个例子会让 Loading 开关四次——用户看到
的是转圈闪烁三下。并发两个请求时更糟，第一个结束就 `hide()`，第二个还在跑。

所以 Loading 计数、取消注册、错误上报，全都必须挂在**逻辑请求**这一层，也就是
`execute()`。

### `execute()` 的骨架

```ts
private async execute<Result, Body>(
  config: HttpRequestConfig<Body> & ApiEnvelopeBehavior,
  select: (response: AxiosResponse<unknown, Body>) => Result,
): Promise<Result>
```

两个输入：`config` 描述这次请求的行为，`select` 描述成功后返回什么。

流程分四段，[client.ts](../src/api/http/client.ts) 的文件头画了同一张图：

```text
① 准备（只做一次）
   计时起点、尝试计数器、requestContext() 闭包
   绝对 URL 守卫
   AbortController + 合并调用方 signal
   注册活动请求、按需开 Loading

② 发送（可能做很多次）
   send() = 一次物理尝试
   安全读方法且显式开了 retry → 交给 retry(send)
   否则直接 send()

③ 失败收尾（只做一次）
   归一化 → 补请求上下文 → 分发展示/上报 → 抛出

④ finally（无论如何都做）
   关 Loading、解绑信号监听、摘掉控制器
```

#### ① 里三个值得单独讲的点

**`requestContext()` 写成函数而不是对象。** 设想改成对象会怎样：

```ts
const requestContext = {
  attempts: attempts.count,                  // 在 execute() 开头，此刻是 0
  elapsedMs: performance.now() - startedAt,  // 此刻也是 0
};
```

拿最简单的场景试——**一个请求，只发一次，3 秒后超时失败，全程没有任何重试**：

| | 错误里记下的 |
| --- | --- |
| 对象版 | `attempts: 0, elapsedMs: 0`（两个值在 execute() 开头就被冻住了） |
| 函数版 | `attempts: 1, elapsedMs: 3000` |

所以原因只有一句：**这两个值在准备阶段还不存在，必须推迟到失败发生的那一刻再读。**
`execute()` 有两个失败出口，闭包在两处各取当下的快照：

```text
绝对 URL 守卫   attempts 0、elapsedMs ≈ 0   ← 一个请求都还没发出去，这正是正确答案
主 catch        attempts ≥ 1
```

（`attempts` 什么时候会大于 1，阶段六和阶段七各会给出一个原因。读到这里不需要知道。）

**路径要去掉 query 和 fragment** 才能进错误上下文，query 里常有 token、手机号这类
不该落到监控平台的东西。注意它只做到这一步：`/orders/42` 原样保留，要归一化成
`/orders/:id` 得由项目的上报 Adapter 自己做（D-41）。

**尝试计数器是一次跨文件接力**：

```text
client.ts  execute()          new RequestAttempts() 塞进 config
    ↓
request-control.ts  prepare() 每发出一次物理请求就 +1
    ↓
client.ts  requestContext()   失败时读出来写进错误
```

用类而不是数字，就是为了这三处共享同一个引用。

#### ② 里 `send()` 为什么能被反复调用

因为它里面**没有任何只该发生一次的事情**。开关 Loading、注册控制器都在它外面。
`send()` 里的 `catch` 做的是「放行」而不是「处理」——已被 auth 处理过的错误和协议
格式错误原样抛出，只有其余的才归一化成 `HttpError`（重试器需要稳定分类才能判断）。

#### ④ 为什么必须是 `finally`

成功、失败、取消三条路都要收尾。少了 `combined.dispose()`，调用方传进来的 signal
会一直挂着监听器——长生命周期的 signal 配上频繁请求就是内存泄漏。

### 自己验证

[http-client.test.ts](../test/http-client.test.ts) 里有一条
「keeps one loading interval open for concurrent logical requests」。并发发三个请求，
确认 `onLoadingChange` 只被调用两次（一次 `true`，一次 `false`）。

---

## 6. 阶段五：错误分三层

### 场景

一个请求失败了。谁决定给用户看什么字？谁决定上报什么？页面要 `catch` 什么？

### 先写最直觉的那版

```ts
// 幼稚版：拦截器里一把梭
axiosInstance.interceptors.response.use(null, (error) => {
  message.error(error.response?.data?.message ?? "请求失败");
  reportError(error);
  return Promise.reject(error);
});
```

### 它塌在哪

四个问题，一个比一个隐蔽：

1. **文案写死在传输层。** 换语言、改文风、同一个错误在不同页面要不同说法——全都
   得改这个文件。
2. **展示和上报绑死。** 某个请求要自己接管 UI（比如表单内联提示），关掉展示的同时
   把监控也一起关掉了，这个接口从此在监控里消失。
3. **`error.response.data.message` 是未经校验的服务端原文。** 后端 500 时吐出来的
   往往是堆栈或者网关的英文页，直接显示给用户。
4. **`reportError(error)` 会把整个 AxiosError 交出去**，里面挂着完整响应体——手机号、
   订单详情、后端堆栈，全部进第三方监控平台。

### 现在的写法：三层各管一段

```text
errors.ts                     只给稳定分类，一个字文案都没有
    ↓
adapters/error-presenter.ts   唯一写用户可见文字的地方
    ↓
modules/users.ts              把 HTTP 状态翻译成领域错误
```

#### 6.1 通用层：稳定分类

```ts
type HttpErrorKind =
  | "http" | "network" | "timeout" | "cancel" | "configuration" | "unknown";
```

`normalizeHttpError()` 把任何东西收敛成 `HttpError`。判断次序不能随便调，每一条都在
挡住前面漏下来的情况——特别是**取消必须排在超时前面**，因为取消也可能带`ECONNABORTED`。

#### 6.2 哪些字段可枚举：本封装最容易改坏的地方

错误对象上的字段分成两类：

| | 字段 | 存法 | 能被 `JSON.stringify` 看到 |
| --- | --- | --- | --- |
| 核心自己生成 | `kind` `status` `method` `path` `attempts` `elapsedMs` `origin` | 普通实例属性 | **能**——上报要靠它们 |
| 承载响应载荷 | `responseData` `presentationHint` `cause` | 模块级 `WeakMap` + 原型 getter | **不能** |

判断标准不是「这个字段看起来敏感吗」，而是「**它是否承载响应载荷**」。
`presentationHint` 来自响应体，服务端随时可能往那段文案里写单号或用户标识。它要是
可枚举，`onReport` 里一句 `JSON.stringify(error)` 就把这些全传出去了——而写那行代码
的人根本意识不到。

> **改动提示**：往 `HttpError` 或 `ApiEnvelopeFormatError` 加新字段时，先问它属于
> 哪一类。加成普通属性 = 默认会被上报。

#### 6.3 展示与上报分家

```ts
createHttpClient({
  onError(error) {
    message.error(presentApiError(error));   // 只展示
  },
  onReport(error) {
    reportHttpError({                        // 只上报，挑明确的安全字段
      name: error.name,
      status: error.status,
      method: error.method,
      path: error.path,
      attempts: error.attempts,
      elapsedMs: error.elapsedMs,
      origin: error.origin,
    });
  },
});
```

`errorMode: "silent"` **只关掉 `onError`，不关 `onReport`**（D-43）。业务模块声明
silent 就必须自己负责该请求的全部用户反馈，但它不该让这个接口从监控里消失。

`cancel` 是唯一两边都不通知的分类——用户自己切走页面，不是故障。

#### 6.4 补上下文为什么是「就地写入」

上下文要到逻辑请求结束才完整（`attempts`、`elapsedMs` 得等重试和重放跑完），所以
必然是「先有错误，后补上下文」。这时有两种写法，重建的代价是：

- **对象身份会断。** auth 模块用 `WeakSet` 标记「这个错误我处理过了」，载荷字段挂在
  以错误对象为键的 `WeakMap` 上，全都按实例身份建立，换个实例就查不到了。连原始
  `stack` 都会变。
- **多一份必须手工同步的拷贝清单。** 新增字段时漏掉不报错，只会静默丢失。

所以用 `-readonly` 映射类型开一个内部写入口，对外仍然只读（D-57）：

```ts
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
```

#### 6.5 Presenter 的两处顺序

[error-presenter.ts](../src/api/http/adapters/error-presenter.ts) 里 `http` 分支的顺序
是有讲究的：

```text
1. status >= 500  → 固定文案      ← 必须最先，要盖住服务端原文
2. presentationHint → 服务端文案   ← 4xx 才用，「手机号已被注册」只有后端说得准
3. 按状态码兜底    → 403/404/429
```

`switch` 不写 `default`，让 TypeScript 在 `HttpErrorKind` 新增成员时直接报错，而不是
让新分类悄悄落到一句通用文案上。

### 自己验证

对照 [protocol-and-utilities.test.ts](../test/protocol-and-utilities.test.ts)：造一个
带 `responseData` 的错误，确认 `JSON.stringify(error)` 里没有它，但 `error.responseData`
读得到。

---

## 7. 阶段六：取消、Loading、重试、文件传输

这四个能力互相独立，可以按需要挑着看。

### 7.1 取消：两层都要管

```text
逻辑请求控制器（client.ts）
    ├─ 调用方传入的 signal
    └─ 客户端内部 controller
物理请求控制器（request-control.ts）
    └─ 每次 Axios 发送各建一个
```

`cancelAll()` **两层都要取消**：正在退避等待、还没发出下一次尝试的请求只存在于逻辑
层；已经在传输途中的请求只存在于物理层。只取消一层都会漏。

合并信号优先用原生 `AbortSignal.any()`，没有就手写。手写那半有两个坑：必须返回
`dispose`（否则监听器泄漏），必须先检查有没有**已经**中止的信号（晚注册的监听器收不到
早已发生的 abort）。

还有一处容易忽略：物理请求结束后要把 `config.signal` **换回原来那个**。config 对象会
被复用（401 重放就是拿同一个再发一次），留着上一轮那个已中止的合成信号，重放会在发出
瞬间就被判为取消。

### 7.2 Loading：为什么是布尔回调而不是 Adapter

计数只在 0↔1 边界通知外部：

```text
第一个请求开始 → 计数 1 → onLoadingChange(true)
第二个请求开始 → 计数 2 → 不通知
第一个结束     → 计数 1 → 不通知
第二个结束     → 计数 0 → onLoadingChange(false)
```

项目端只提供 `onLoadingChange(active)` 一个布尔回调，**不为 Loading 定义 Adapter
接口**（D-58）。Adapter 抽象的价值在于「项目端存在多种实现需要替换」，而 Loading 的
项目端实现永远只有显示和隐藏两个动作，加一层接口和一个文件只会多出导入路径。

### 7.3 重试：三个保守决定

**决定一：写请求永不重试，即使调用方显式要求。**

```ts
const isSafeRead = ["get", "head", "options"].includes(method);
if (requestConfig.retry && isSafeRead) { ... }
```

传输层看不出一个失败的写请求到底有没有在服务端落库。重试就可能变成重复下单。要重试
的写操作应当由业务层带幂等键自己发起。

**决定二：次数上限之外还要有总时间预算。**

只有 `retries` 时，指数退避会让总耗时迅速放大——`retries: 5` 配 `baseDelayMs: 200`，
光退避总和就接近 6 秒，再加上每次请求自己的 `timeout`，用户看到的是一个长时间不动
的 Loading。每一次都没超时，加起来却久得离谱。

预算检查放在**准备退避之前**，所以它只决定「要不要再试一次」，从不打断已经发出的
尝试——那样会让一个其实就要成功的请求平白失败（D-55）。

**决定三：退避要加抖动。**

```ts
const jitter = 0.75 + Math.random() * 0.5;
const delay = baseDelay * 2 ** attempt * jitter;
```

服务端刚恢复时，如果所有客户端都在同一毫秒发起第二次尝试，会立刻把它再打垮一次。

**接了 TanStack Query / SWR 之后重试归谁？**

归上层，HTTP 层的 `retry` 保持关闭（D-61）。除了「上层 3 次 × HTTP 层 3 次 = 9 个
物理请求」这种次数相乘，更根本的原因是两层掌握的信息不同：上层持有查询身份，知道
这次读取是否仍被界面需要、是否已被新查询取代；HTTP 层只看得到一次孤立的传输。

HTTP 层的 `retry` 留给不经过数据请求层的调用——一次性读取、轮询、启动引导请求。
这也是它默认关闭的原因：接入数据请求层时不需要回头去关一个全局默认值。

### 7.4 文件传输：两条下载路径

| | 带得上 Authorization | 能读文件名 | 能报进度 | 内存 |
| --- | --- | --- | --- | --- |
| `fetchFile` + `saveFile` | 能 | 能 | 能 | 整个文件进内存 |
| `downloadDirect` | **不能**（靠 URL 签名） | 靠调用方给 | 不能 | 浏览器接管 |

[transfer.ts](../src/api/http/transfer.ts) 里有两处安全边界：

**文件名消毒。** 名字来自服务端的 `Content-Disposition`，是不可信输入，完全可能是
`../../../.bashrc`。控制字符和路径分隔符全部替换，开头的 `.` 也换掉（避免生成隐藏
文件）。

**直链协议白名单。** `downloadDirect` 会把 url 赋给 `<a href>` 然后点击，所以必须
先解析、只放行 `http:` 和 `https:`。放行 `javascript:` 等于给了一个 XSS 执行点。
校验必须在**创建 `<a>` 之前**（D-50）。

顺带两个实践细节：上传 `FormData` 时**不要手写 `Content-Type`**，浏览器会自己填上
带 boundary 的值；`createObjectURL` 建立的引用必须 `revoke`，否则整个 Blob 一直钉在
内存里。

### 自己验证

[failure-budgets.test.ts](../test/failure-budgets.test.ts) 的
「stops retrying a safe read once the budget cannot fit another attempt」：一个总是返回
503 的服务，配 `{ retries: 5, baseDelayMs: 40, totalTimeoutMs: 250 }`，断言实际发出的
请求数少于 6 次——没有预算时它会跑满 6 次、约 1.2 秒退避。

---

## 8. 阶段七：认证与凭证刷新

放在最后，因为它是唯一一个**状态多到需要先画图**的模块。

### 场景

页面同时发了 10 个请求，令牌恰好在这一刻过期，10 个请求全部收到 401。

### 先写最直觉的那版

```ts
// 幼稚版
axiosInstance.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    await refresh();                      // ← 10 个请求各调一次
    return axiosInstance(error.config);
  }
  return Promise.reject(error);
});
```

### 它塌在哪

1. **打 10 次刷新接口**，拿回 10 个新令牌，后面的把前面的挤掉——用户随机掉线。
2. **重放还是 401 就无限递归**，浏览器标签页卡死。
3. **刷新请求自己收到 401 时**，也会走进这个拦截器，再触发一次刷新。
4. **刷新接口挂了的时候**，每个请求都去捅它一下。
5. **10 个请求各弹一次「登录已过期」**。

### 现在的写法：五组状态各挡一个坑

```text
refreshPromise           单飞。已经在刷了就复用同一个 Promise      → 挡 ①
__authRetry              已经重放过一次就不再刷新                   → 挡 ②
__authManaged            只处理本实例盖过章的请求                   → 挡 ③
failedVersion/Error/At   熔断 + 冷却窗口                            → 挡 ④
expiredVersion           expireSession() 每代只触发一次             → 挡 ⑤
credentialVersion        凭证代际：区分「旧令牌失败」和「新的也失败」
sessionEpoch             会话代际：用户重新登录时推进
```

正常的失效流程：

```text
10 个业务请求返回 401
        ↓
   共享 refreshPromise
        ↓
      1 次刷新
        ↓
 10 个请求分别重放一次
```

共享的是**刷新过程**，不是业务请求结果。每个业务请求仍然有自己的 Promise、取消状态、
尝试次数和最终结果。

### 8.1 凭证代际：为什么不能只看 401

```ts
if (requestVersion >= credentialVersion) {
  await refreshOnce(requestVersion);
}
```

如果 `credentialVersion` 已经涨上去了，说明**别的请求刚刚刷新成功**，本请求直接拿新
令牌重放即可，不必再刷一次。少了这个判断，10 个并发就算有单飞也会串行地刷 10 轮。

### 8.2 熔断为什么必须带冷却

刷新失败不是一种失败，是两种，处置完全不同（D-65）：

```text
刷新端点回 401    Refresh Token 本身失效，凭证死了
                  → expireSession()：清会话、跳登录（每代只触发一次）

网络错 / 超时 / 5xx   端点此刻答不上来，凭证多半还活着
                  → 只记入熔断缓存，会话原样保留
```

直觉的写法是不分：刷新一失败就踢登录。这会把一次抖动放大成一次强制登出——凭证
仍然有效、服务端一秒后就恢复了，用户却已经站在登录页上。分辨两者不需要任何后端
约定：刷新请求本身的 HTTP 状态码就是答案，和阶段二「HTTP 状态是唯一权威」（D-05）
同一条立场。

熔断缓存对两种失败都生效：冷却窗口内的后续 401 直接复用缓存的失败，不再打刷新
端点。没有冷却，抖动会被**记到页面关闭为止**——每个后续请求都只拿到缓存里的旧
错误，用户除了刷新页面无路可走。有了冷却，窗口结束后放行一次新的尝试，端点恢复
则**静默自愈**：全程会话未清、没有惊动用户。它是**熔断**，不是终身锁定（D-54）。

### 8.3 会话代际：登录发生在刷新在途时

```ts
authSession.setAccessToken(result.accessToken);
http.resetAuthState();          // 顺序不能反
```

`resetAuthState()` 做的是「开一个新会话」而不是「清理干净」——所有代际往前推一格，
于是上一会话在途的刷新回来时会发现自己已经过时，自动作废（D-52）：

- 它成功了也丢弃——拿回来的是旧会话的令牌，写进去会覆盖用户刚登录的新凭证。
- 它失败了也不调 `expireSession()`——否则会把刚登录的会话立刻清掉。
- 已经在等它的请求忽略这个失败，改用新凭证继续。

自动刷新成功时模块已自行推进版本，不需要调这个方法。它只用于登录、重新登录、切换
账号这些**会话边界**。

### 8.4 独立实例还不够：链路隔离

刷新用的是独立的裸 Axios 实例，但两条链路**并没有因此自动隔离**：

```text
业务请求 → 请求拦截器 await refreshPromise
                    ↓ 刷新失败
        业务实例的响应错误拦截器收到刷新的 AxiosError
                    ↓ config.url = "/auth/refresh", status = 401
        误判成业务 401 → 重放刷新请求 → 其响应成为业务请求的结果
```

所以请求拦截器要盖章 `__authManaged = true`，响应拦截器把没盖章的错误原样放行
（D-51）。判断「这个错误是不是我该处理的」时，**状态码和 URL 都不够，必须确认它来自
本实例**。

### 8.5 令牌存哪

```text
Access Token   内存（会话对象里）
Refresh Token  HttpOnly Cookie，前端读不到
```

Access Token 不写 `localStorage`/`sessionStorage`：那样任何 XSS 都能直接读走它，而
内存中的令牌随页面卸载消失。

会话对象放在 [session.ts](../src/api/session.ts) 而不是 `http/` 下——会话怎么存是
**项目状态**，真实项目会换成 Pinia / Zustand / Redux 切片。HTTP 模块只通过
`AuthAdapter` 读写它（D-59）。

`withCredentials: true` 只开在刷新实例上，跨域 Cookie 的暴露面被压到一个接口。

#### AuthSession 的 Pinia 实现

`createMemoryAuthSession()` 可以直接投产，它唯一的局限是**不响应式**：导航栏显示
用户名、路由守卫判断登录态，UI 要的是能 watch 的状态。所以换 Pinia 的动机是响应式，
不是给 token 换个存储位置。用 store 实现同一个 `AuthSession`，通用模块零改动
（D-64，案例进文档、仓库源码保持零框架依赖）：

```ts
// stores/session.ts —— UI 直接消费 store 的响应式状态
export const useSessionStore = defineStore("session", () => {
  const accessToken = ref<string | null>(null);
  const isAuthenticated = computed(() => accessToken.value !== null);
  return { accessToken, isAuthenticated };
});
```

```ts
// 应用入口的装配处 —— store 适配成 AuthSession 的四个约定
const store = useSessionStore();

const session: AuthSession = {
  getAccessToken: () => store.accessToken,
  setAccessToken: (token) => {
    store.accessToken = token;
  },
  clearSession: () => {
    store.accessToken = null;
  },
  onExpired: () => {
    router.push("/login");
  },
};
```

接线去向和内存版完全一样：`getAccessToken`/`setAccessToken` 直传给
`createBearerAuthAdapter`，`clearSession` + `onExpired` 合成它的 `expireSession`——
[http-client.test.ts](../test/http-client.test.ts) 开头的 `createTestAuth` 就是现成
模板。两个配置要点：

- **不装持久化插件。** 持久化插件会把 token 写进 localStorage，本节开头的安全立场
  就被一个插件改掉。刷新页面后的会话不靠持久化恢复：启动时用 HttpOnly Cookie 调
  一次刷新接口，成功即有会话，失败即未登录。
- **装配晚于 `app.use(pinia)`。** `useSessionStore()` 要求 Pinia 实例已激活，所以
  「创建带 auth 的 http」要放进应用入口的装配流程，不能像内存版那样在模块顶层执行。

真实项目 admin-backend-3 用的是更严格的三层版本：token 的唯一权威（SSOT）是
`api/session.ts` 里的模块级内存变量，连 Pinia 都不放；Pinia store 只订阅它的变更、
给 UI 做响应式镜像；请求层依赖注入的会话接口，从不 import Pinia：

```text
api/http/*        无状态请求套件，只认注入的会话接口     对应本工程 http/
api/session.ts    内存 SSOT，真正持有 token              对应本工程 session.ts
stores/auth.ts    Pinia 响应式镜像 + 路由联动            本工程未含（UI 层）
```

多拆这层的收益是换 UI 框架时会话逻辑原地不动，代价是多一份订阅同步代码；中小项目
用上面的 Pinia 版本就够。该项目在 2026-07 的请求层换代（其 ADR-0004）中已整体换用
本工程的引擎，会话层保持这个三层结构，额外只接了一座跨标签页会话同步桥——就是
8.6 末尾那个旁挂模块。

### 8.6 多标签页：单飞管不到的并发刷新

上一节末尾那句「Web Locks 跨标签页刷新互斥」值得单独展开——不是为了实现它，而是
为了回答一个部署前必须想清楚的问题：**这套封装拿到多标签页场景下用，会发生什么？**

先划边界。前面五组状态全是模块级内存变量，作用域是**一个标签页**。用户开两个
标签页，就有两套互相看不见的状态机——单飞、熔断、代际，在隔壁标签页眼里都不存在。
大多数时候这没有问题：两边各自持有内存里的 access token，各刷各的。真正共享的只有
一样东西——**Refresh Cookie**。麻烦恰恰从这份共享开始。

**先理解轮换：刷新接口为什么是一次性的。**主流后端的刷新接口是**轮换**（rotation）
式的，本工程对接的契约也是：每次刷新，旧 Refresh Token 立刻作废、发一个新的。把
续期凭证变成一次性的，后端就免费获得一个能力——**泄露检测**：

```text
攻击者偷到 Refresh Token R1
攻击者用 R1 刷新成功 → 拿到 R2，R1 作废
真用户随后用 R1 刷新 → 后端发现 R1 被用了第二次
                      = 此刻持有 R1 的有两方，必有一方是贼
                      → 撤销这条会话链的全部凭证（token family，令牌家族）
                      → 双方一起下线：真用户重新登录夺回会话，攻击者出局
```

「同一个一次性凭证出现第二次」是无法伪造的泄露信号。这正是 OAuth2 生态（Auth0、
Keycloak……）把 Refresh Token Rotation 当默认实践的原因——**重放必须被惩罚，机制
才成立**。

**两个标签页，在后端眼里就是「贼 + 真用户」。**它们共享同一份 Cookie；令牌又是
同时签发的，于是同时过期。如果两边恰好都在这时发请求：各自撞 401，各自发起刷新，
**两个刷新请求带的是同一个 R1**。后端处理完先到的那个，R1 作废；后到的那个，和
上面时间线里「真用户的重放」一模一样——后端没有任何办法区分「贼 + 真用户」和
「两个标签页」。按机制处理就是撤销家族：**两个标签页一起被踢到登录页**。

什么条件下会真的撞上？需要「同时过期」加「在一次刷新往返（几十到几百毫秒）内并发
发出刷新」，典型场景按概率排：

- **浏览器重启恢复上次会话**——一次打开 N 个标签页，每个内存里都没有 token，全都
  拿同一份 Cookie 去恢复会话。最容易复现的一撞。
- **标签页挂后台 + 自动请求**——轮询定时器、窗口回焦自动重拉数据。用户离开超过
  令牌寿命再回来，几个标签页几乎同时撞 401。
- **手动操作反而不容易撞**：先在 A 页点一下、再切到 B 页点一下，只要间隔超过一次
  刷新往返，A 已经把新 Cookie 写回浏览器，B 带的就是新凭证——人手的速度天然把
  刷新串行化了。
- 还有一个不需要第二个标签页的变体：刷新请求发出、后端已完成轮换，**响应在网络上
  丢了**。客户端超时重试带的还是旧 token，同样构成重放。这个变体值得记住，下面
  马上用到。

**解法在哪一侧：宽限窗口 vs 前端互斥。**后端侧的标准解叫**轮换宽限窗口**（reuse
interval / rotation grace period）：旧凭证在被轮换后的几十秒内重放，视为「响应丢失
重试」而不是攻击。admin-backend-3 的宽限是 60 秒，行为上有三个精确点，每个都容易
想错：

- **它不是延长旧 token 的寿命。** 旧凭证仍然在轮换那一刻作废，宽限只是对「作废后
  紧接着的重放」网开一面——超过窗口的重放照常撤销家族，退出登录之后的重放在窗口
  内也不会复活会话。
- **后来者拿到的不是先到者那份新凭证，而是一份补发的。** 后端给宽限内的重放者
  新建一条兄弟会话（sibling），两个标签页从此各持一条凭证链、各自独立轮换，互不
  再干扰。
- **安全性没有实质让步。** 检测窗口只是收窄了几十秒；攻击者事后（从日志、备份里）
  拿到旧凭证再重放，早已出窗，照样触发家族撤销。

前端侧的解是跨标签页互斥：Web Locks 保证同一浏览器内同时只有一个标签页在刷新，
其余标签页通过 BroadcastChannel 等它的结果。admin-backend-3 曾经两侧都做——它的
前端代码里写着一句注释：「服务端轮换宽限期是这里的最后一道兜底。」后来的请求层
换代（其 ADR-0004）把前端互斥整层删掉、只留后端宽限，多标签页照常工作——「兜底」
被实践验证为真正的防线。前端互斥本来就管不住上面那个单标签页变体（丢响应重试时，
锁一直在自己手里），也管不住另一台设备；真正决定正确性的始终是后端那一侧。

**本工程为什么不把前端互斥做进来（D-66）。**三个原因，按分量排：

1. **它不提供独立的正确性。** 装了它，丢响应重试的重放照样发生；后端有宽限，不装
   它也几乎无感。多标签页能不能安全用，从头到尾由后端策略决定，前端互斥只是减少
   触发宽限的次数。
2. **它不是旁挂模块。** 互斥要包住整个刷新流程；拿到锁之后要先复查凭证是否已被
   隔壁标签页刷新过——这些判断必须长在单飞状态机内部（admin-backend-3 换代前的
   会话协调器就是这么写的），等价于重写 `refreshOnce`，而不是新增一个文件。
3. **它绑定纯浏览器原语。** Web Locks 至今没有 Node 实现，进来就要么到处 mock，
   要么升级成多页面浏览器测试。（BroadcastChannel 不在此列——它自 Node 15.4 起
   是内建原语，这正是下面那个同步模块能全量 Node 测试的原因。）

所以采用本封装前，向后端确认一句话：**「刷新轮换有没有并发宽限窗口（reuse
interval）？」**有——这是 OAuth2 方案的默认——多标签页就可以放心用；没有、且用户
确实会开多标签页，再在项目侧补前端互斥（重写单飞状态机；admin-backend-3 换代前的
会话协调器可在其 git 历史里找到参照）。那是一个明确的扩展点，不是本工程的缺口。

#### 互斥不进，同步进：旁挂的会话同步模块（D-67）

到这里多标签页的**刷新并发**已经收口：正确性归后端宽限窗口，前端互斥不进源码。
但多标签页还剩一类问题，和「谁去刷新」无关——**会话事实的传播**：

- A 标签页登出了，B 标签页内存里还留着 access token，继续以已吊销的会话工作，
  直到撞上下一个 401；
- A 标签页刷新拿到新令牌，轮换制下 B 的旧令牌已作废，B 只能自己再撞 401、再刷
  一轮——「每个标签页各自刷新」正是反复触发宽限窗口的来源。

这类问题不需要互斥，只需要**广播**：把「会话变了」这个既成事实告诉所有标签页。
[session-sync.ts](../src/api/session-sync.ts) 只做这一件事（D-67）：

```ts
const sync = createSessionSync<Session>("my-app-auth", {
  onSessionUpdated(session) { /* 写入会话存储 + resetAuthState() 开新代际 */ },
  onSessionEnded() { /* 清空会话存储 */ },
});
// 本地登录 / 刷新成功 / 登出时反向广播：
sync.publishSessionUpdated(session);
sync.publishSessionEnded();
```

它能进源码而互斥不能，分界就一条：**是否介入刷新决策**。同步不参与「什么时候
刷新」，只搬运结果；模块对 `http/` 零依赖，handlers 由项目侧接线——admin-backend-3
的桥接层就是现成样板：收到更新写入自己的会话存储并 `resetAuthState()`，收到终结
清空存储，采纳期间抑制回声广播。

模块内唯一有分量的逻辑是**事件屏障**：BroadcastChannel 不保证多标签页事件的全局
顺序，「登出之后才到达的过期更新」会复活已终结的会话。每个事件盖单调递增的时间戳
（`max(Date.now(), 上一事件 + 1)`），只接受比已见事件新的，旧事实就盖不掉新事实。

接上它还有一个顺带的收益：刷新成功的新令牌会随 `session-updated` 传给所有标签页，
其余标签页直接采纳、不再各自刷新，宽限窗口从常规路径退回真正的兜底。

### 8.7 换一种认证方案会怎样：格式、架构与插件接缝

到这里为止讲的都是「这套方案怎么工作」。最后回答一个换后端时必然遇到的问题——
后端同学说：「我们用的是 JWT，不是你们这套双 token。」前端封装要改多少？

答案取决于「JWT」这个词在指什么。它经常同时承载两个概念，先拆开：

| 概念 | 说的是什么 | 取值举例 |
| --- | --- | --- |
| **格式** | 令牌字符串本身怎么编码（RFC 7519：三段 Base64、带签名、payload 可含过期时间 `exp`） | JWT / 不透明随机串 |
| **架构** | 有几个凭证、怎么续期 | 单 token 过期重登 / Access + Refresh 双 token |

两者正交：双 token 架构里的 access token 完全可以是 JWT 格式——而且这是主流生产
形态。可以自查：找任何一个 OAuth2/OIDC 后端（Auth0、Keycloak、Cognito……），登录
响应里 `access_token` 和 `refresh_token` **同时存在**，把 `access_token` 粘到 jwt.io
能解开。双 token 和 JWT 在同一个响应里同时成立，因为它们不在同一个维度上。

教程里的「JWT 单 token 方案」（一个无状态 JWT 替代服务端会话）真实存在，但它是这个
领域的「幼稚版」：服务端不存状态，签出去的令牌**到期前无法吊销**，于是只能选长寿命
（被偷就完）或短寿命（频繁重登）。生产为解决这个矛盾收敛出来的形态，恰恰是「短寿命
JWT + Refresh Token 续期」——绕回了双 token。

所以最常见的情况是：**后端说「我们用 JWT」，指的只是令牌格式 → 零改动。**
本封装从头到尾不解码令牌——没有一处 decode，没有 jwt-decode 依赖，`Bearer ${token}`
里的字符串长什么样它不知道也不关心。阶段二把信封 `code` 当元数据、不拿它判定成败，
这里不解码令牌、不拿 payload 做判定——同一个决定的两次出现：不消费的信息不解析，
换格式才能不改代码。

#### 认证空间的两条轴

真正需要动手的是**架构**变了。整个空间用两条正交轴就能描述：

| 轴 | 取值 | 当前实现 |
| --- | --- | --- |
| 有没有续期凭证 | 无（过期重登） / 有（Refresh Token） | 有（HttpOnly Cookie） |
| 刷新何时触发 | 被动（收到 401 后） / 主动（已知过期时间，提前续） | 被动 |

令牌格式不在任何一轴上。

顺带澄清一个常见误解：**无感刷新 ≠ 主动刷新**。「无感」指调用方无感——本章前面那套
「401 → 单飞刷新 → 重放」就已经是无感刷新，原请求的 Promise 从头到尾没断过，只是慢
了一拍。主动刷新（利用已知过期时间提前续）省掉的只是那一次注定失败的 401 往返，
它是无感刷新的**优化**，不是前提。而且过期时间未必来自解析 JWT：OAuth2 标准本来就在
令牌响应体里给 `expires_in` 字段，所以连主动刷新都不绑定 JWT 格式。

#### 换方案 = 换插件

方案没有写死在状态机里。auth.ts 只依赖三个动作，这就是插件契约：

| 契约方法 | 回答的问题 | 当前实现（Bearer + Cookie） |
| --- | --- | --- |
| `applyCredential(config)` | 凭证怎么带上请求 | 设 `Authorization: Bearer <内存里的 token>` |
| `refreshCredential()` | 401 之后怎么续期 | 调刷新接口，浏览器自动带 Refresh Cookie |
| `expireSession()` | 续不动了怎么办 | 清会话、跳登录页 |

单飞、熔断冷却、会话代际、重放去重——全在状态机里，**任何插件免费继承**。

#### 实例：后端真的是单 token JWT

先向后端确认一件事：**过期之后是直接重新登录，还是有「拿旧 token 换新 token」的
续期接口？**两种答案对应两个变体。

**变体 (a)：过期即重登。**

```ts
// adapters/jwt-auth.ts —— 整个适配就这一个新文件
export function createJwtAuthAdapter(options: {
  getAccessToken(): string | null;
  expireSession(): void;
}): AuthAdapter {
  return {
    applyCredential(config) {
      const token = options.getAccessToken();
      if (token) config.headers.set("Authorization", `Bearer ${token}`);
      else config.headers.delete("Authorization");
    },
    // 后端没有续期接口：刷新即失败，状态机会接住它走 expireOnce
    async refreshCredential() {
      throw new Error("Single-token scheme has no refresh endpoint");
    },
    expireSession: options.expireSession,
  };
}
```

「没有刷新还装认证模块干什么？」——装的不是刷新，是它周边的保障：

- 10 个并发 401 → `refreshCredential` 只被调**一次**（单飞），`expireOnce` 保证登录页
  只跳**一次**，不是弹 10 次；
- 失败进入冷却缓存，后续 401 不再反复捅一个不存在的接口；
- 错误被标记「认证已处理」，全局 Toast 不会和跳登录叠在一起。

**变体 (b)：旧 token 换新 token（滑动过期）。**

在 (a) 的基础上把 `refreshCredential` 换成真的；工厂参数相应多收三项——写回新
token 的 `setAccessToken`、从续期响应里挑出新 token 的 `selectAccessToken`、可选的
`renewUrl`：

```ts
// 续期走独立裸实例——它身上没有业务拦截器，自己收到 401 不会再触发一次续期。
// 注意没有 withCredentials：本方案没有 Cookie，凭证就是旧 token 本身，放 header 里。
const renewClient = axios.create({ baseURL, timeout: 10_000 });

async refreshCredential() {
  const current = options.getAccessToken();
  if (!current) throw new Error("No token to renew");
  const response = await renewClient.post(options.renewUrl ?? "/auth/renew", null, {
    headers: { Authorization: `Bearer ${current}` },
  });
  options.setAccessToken(options.selectAccessToken(response));
}
```

对照 8.5 的 Cookie 方案，差异只有两点：凭证从 Cookie 变成旧 token 进 header；
不再需要 `withCredentials`。

但 (b) 有一个结构性时序问题，这是它和双 token 最大的不同：**旧 token 是唯一凭证，
过期之后就没有任何东西能换新的了**；而被动触发恰恰要等到过期后的第一个 401 才知道
过期——等状态机反应过来，续期接口只会说「这个 token 已经失效」。所以 (b) 几乎必然
要配主动触发。这是主动刷新从「优化」升格为「必需」的唯一场景。两种引入方式：

- adapter 内部自己起定时器，在过期前调续期——零契约改动，今天就能做；
- 给 `AuthAdapter` 加一个可选的「凭证是否将过期」方法，状态机在发送前多一个触发点，
  复用 `refreshOnce` 的全部并发保障——契约扩展，更干净。

无论哪种，**401 被动路径必须原样保留**：客户端时钟会偏、服务端会提前吊销令牌，
主动预判永远可能失手。

改动清单：

| 文件 | 动不动 |
| --- | --- |
| `adapters/jwt-auth.ts` | **新增**，整个适配的全部内容 |
| `index.ts` | 装配那一行换成新工厂 |
| `session.ts` | 不动——它存的本来就是内存里一个字符串 |
| `auth.ts` 状态机 / `client.ts` / `errors.ts` / `retry.ts` | 不动 |
| 登录接口 | 照旧 `skipAuth: true` |

两个教程常见做法这里明确不跟：token 仍放内存、不进 localStorage（XSS 一读一个准，
换方案不改变这条）；前端不验签、不拿 payload 做业务判断——decode 出 `exp` 最多用于
(b) 的续期时机，令牌真伪永远由后端裁决（和阶段二「HTTP 状态是唯一权威」同一精神）。

#### 什么时候必须改契约，而不是写新插件

三条边界，撞上任何一条，新增 adapter 文件就不够了：

1. **`applyCredential` 是同步的**——每次请求都要 `await` 的方案（WebCrypto 算签名、
   发送前确认过期）装不进去；
2. **状态机假设「401 = 凭证问题、可续期」**——用 403 表达过期、或走
   `WWW-Authenticate` 协商的方案对不上；
3. **一个客户端实例只有一条刷新轨道**——两套独立续期的凭证（比如用户态 + 应用态）
   会在同一个 `credentialVersion` 上打架。

最后是选择发生的时刻。方案选择留在**装配时**——index.ts 组装的那一行——不预建
「认证方案注册表」。这和本封装另外两个决定是同一条规则：

| 决策 | 消除的不确定性 | 保留的东西 |
| --- | --- | --- |
| Loading 不建 Adapter（D-58） | 项目端永远只有显示/隐藏两个动作 | 一个布尔回调 |
| retry 默认关闭（D-61） | 接数据请求层后重试归上层 | 按请求显式开启的口子 |
| 认证不建 list（D-62） | 每个部署只有一个方案在跑 | `AuthAdapter` 接缝本身 |

规则一句话：**接缝便宜，尽管留；机制贵，等需求。**哪天真出现「同一个构建要面对多种
后端方案」（多租户、私有化交付、SDK 化），注册表用动态 import 加在装配层，按启动
配置只加载一个 adapter，核心一行不动。

### 自己验证

[auth-session-isolation.test.ts](../test/auth-session-isolation.test.ts) 覆盖会话代际；
[http-client.test.ts](../test/http-client.test.ts) 里有并发 401 只刷新一次的用例；
[failure-budgets.test.ts](../test/failure-budgets.test.ts) 覆盖两类刷新失败的分野
——5xx 只熔断不清会话、冷却结束后静默自愈。

另做两道不用写代码的推演题：

1. 把本章开头「10 个请求全部收到 401」的场景套在 8.7 的变体 (a) 上，推演三个问题
   ——`refreshCredential` 会被调几次？登录页会跳几次？冷却窗口内随后到达的 401
   拿到什么？（答案都藏在那五组状态里：一次；一次；复用缓存的失败，不再打续期
   接口。）
2. 两个标签页同时用 R1 刷新，后端带 60 秒宽限窗口：后到的标签页拿到的是先到者的
   R2 吗？先到者的凭证链会因此中断吗？（答案在 8.6：不是，是补发的兄弟凭证；
   不会，两条链从此各自独立轮换。）

---

## 9. 阶段八：业务模块与页面

### 场景

页面要「创建用户」，用户名重复时在表单里内联提示。

### 先写最直觉的那版

```ts
// 幼稚版：页面直接调
try {
  await http.post("/users", { name });
} catch (e) {
  if (e.status === 409) setFieldError("name", "用户名已存在");
}
```

### 它塌在哪

页面被迫知道两件它不该知道的事：**接口 URL** 和 **HTTP 状态码的业务含义**。
接口改路径要全局搜索；同一个 409 在三个页面各翻译一遍，措辞还不一致。

### 现在的写法

业务模块夹在中间，把传输概念翻译成领域概念：

```ts
export async function createUser(input: CreateUserInput): Promise<User> {
  try {
    // silent 关掉全局 Toast，因为 409 要显示在表单字段旁边。
    // 注意它只关展示，不关上报——监控里照样看得到。
    return await http.post<User, CreateUserInput>("/users", input, {
      errorMode: "silent",
    });
  } catch (error) {
    // 只翻译自己认识的那一个状态码，其余原样抛出去。
    if (error instanceof HttpError && error.status === 409) {
      throw new UserAlreadyExistsError(error);   // 原错误挂在 cause 上
    }
    throw error;
  }
}
```

页面只 `catch UserAlreadyExistsError`，完全不需要知道 HTTP 是什么。

最容易写错的是**把 `catch` 写宽**——网络断了也提示用户换个名字。只翻译认识的，其余
原样往上抛。

### 职责划分

| 层 | 负责 | 不负责 |
| --- | --- | --- |
| 页面 | 领域概念、UI 反馈 | URL、HTTP 方法、状态码 |
| 业务模块 | URL、方法、类型、silent/retry 策略、领域错误 | 传输细节、认证 |
| HTTP 核心 | 传输、协议、错误分类、认证、生命周期 | 用户文案、业务语义 |

---

## 10. 端到端：三条路径

前面每个阶段各看一段，这里把它们接起来。

**普通成功**

```text
页面 createUser() → users.ts → post() 补齐 method/url/data
  → request() 指定选 response.data → execute() 建立逻辑请求、开 Loading
  → 请求链 Auth(附令牌) → RequestControl(计数+1) → 网络
  → 响应链 RequestControl(清理) → Envelope(解包成 User) → Auth(非 401 放行)
  → select(response) 取出 User → finally 关 Loading → 页面得到 User
```

**GET 撞上 503 后重试成功**

```text
send() 第一次 → 503 → 归一化 HttpError(http, 503)
  → retry() 判定可重试 → 检查总预算 → 等待带抖动的退避
  → send() 第二次 → 200 → Envelope 解包 → 返回结果
整个过程 Loading 只开关一次，不触发任何错误回调
```

**401 刷新后重放**

```text
业务请求带旧令牌 → 401 → Auth 响应拦截器启动或等待共享刷新
  → 刷新实例（独立、withCredentials）拿到新 Access Token → credentialVersion +1
  → 原请求标记 __authRetry → 重新灌回实例，走完整拦截器链（这时换上新令牌）
  → 200 → Envelope 解包 → execute() 返回结果
逻辑 Loading 只开关一次，物理尝试计数为 2
```

---

## 11. 选择你需要的层级

**不要整个抄走。** 先确认需求，再选够用的层级。

### 基础层

```text
Axios 实例 + baseURL + timeout
```

接口少、直接用 `AxiosResponse`、没有登录态。**很多内部工具停在这里就是对的。**

### 项目请求层

```text
基础层 + Envelope Adapter + 类型化入口 + 错误分类与 Presenter + 业务 API 模块
```

对应本文阶段一到五、阶段八。**大多数后台管理项目到这里就够了。**

### 完整层

```text
项目请求层 + 并发认证刷新 + 取消管理 + Loading 编排 + 安全重试 + 错误上报 + 文件传输
```

对应全部阶段。只在确实存在这些需求时才上——尤其是认证刷新，它带来的状态复杂度是
实打实的维护成本。

---

## 12. 源码阅读顺序

每个源文件的**文件头注释都是该文件的地图**，先读文件头再读实现。

**第一遍：只读主流程**

1. [index.ts](../src/api/http/index.ts)
2. [modules/users.ts](../src/api/modules/users.ts)
3. [client.ts](../src/api/http/client.ts) 的文件头 + 公共方法
4. [adapters/envelope.ts](../src/api/http/adapters/envelope.ts)

跳过：`execute()` 内部、认证状态、信号合并、底层类型声明。

**第二遍：生命周期和错误**

1. `client.ts` 的 `execute()`
2. [errors.ts](../src/api/http/errors.ts)
3. [adapters/error-presenter.ts](../src/api/http/adapters/error-presenter.ts)

**第三遍：独立能力**

1. [retry.ts](../src/api/http/retry.ts)
2. [request-control.ts](../src/api/http/request-control.ts)
3. [transfer.ts](../src/api/http/transfer.ts)

**第四遍：认证**

1. [auth.ts](../src/api/http/auth.ts)（先把文件头那五组状态看明白）
2. [adapters/auth.ts](../src/api/http/adapters/auth.ts)
3. [session.ts](../src/api/session.ts)
4. [session-sync.ts](../src/api/session-sync.ts)（旁挂的跨标签页同步，可单独读）
5. 认证相关测试

---

## 13. 练习

**每次只加一个能力，并为它写一个能跑的验证用例。** 不要一次复制完整目录。

1. 用原生 Axios 取一个用户，说清 `response` 和 `response.data` 的区别
2. 写 `ApiEnvelope` 的格式校验函数，处理 `data: null` 和缺字段两种情况
3. 写只有 `get<Result>` 的最小入口
4. 加 `post<Result, Body>`，验证请求体类型约束生效
5. 加 `raw()`，比较两者返回值
6. 把网络、超时、HTTP 错误统一成一个错误类型
7. 接一个 Presenter，让同一个错误在两种语言下显示不同文案
8. 加单请求取消，验证取消后不展示也不上报
9. 加 Loading 计数，验证并发三个请求只开关一次
10. 实现单飞刷新与重放，验证 10 个并发 401 只打一次刷新接口

第 10 项建议留到最后，它是唯一需要同时处理并发、代际和重入的练习。

---

## 14. 验证资料

| 文件 | 覆盖 |
| --- | --- |
| [http-client.test.ts](../test/http-client.test.ts) | 请求流程、认证、取消、Loading、重试 |
| [protocol-and-utilities.test.ts](../test/protocol-and-utilities.test.ts) | 协议解包、错误分类、工具函数 |
| [auth-session-isolation.test.ts](../test/auth-session-isolation.test.ts) | 会话代际与链路隔离 |
| [failure-budgets.test.ts](../test/failure-budgets.test.ts) | 刷新冷却窗口、重试总预算 |
| [session-sync.test.ts](../test/session-sync.test.ts) | 跨标签页会话同步与事件屏障 |
| [users-module.test.ts](../test/users-module.test.ts) | 业务领域错误转换 |
| [typecheck.ts](../test/typecheck.ts) | 配置白名单的类型约束 |
| [http-browser.spec.ts](../browser-tests/http-browser.spec.ts) | 必须在真实浏览器验证的行为 |

```bash
pnpm check
```

遇到读不懂的局部代码，先确定它属于哪个阶段，再单独分析。**不要让一个底层类型声明
打断整条请求主线。**
