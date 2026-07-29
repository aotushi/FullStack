# 逻辑请求与错误

本页对应学习路径的阶段四到五：先把「一次逻辑请求」的生命周期立起来，再把错误拆成
三层。前置内容在[最小客户端](./minimal-client.md)。

## 阶段四：一次逻辑请求

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
axiosInstance.interceptors.request.use((config) => {
  spin.show();
  return config;
});
axiosInstance.interceptors.response.use((res) => {
  spin.hide();
  return res;
});
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

流程分四段，`client.ts` 的文件头画了同一张图：

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
  attempts: attempts.count, // 在 execute() 开头，此刻是 0
  elapsedMs: performance.now() - startedAt, // 此刻也是 0
};
```

拿最简单的场景试——**一个请求，只发一次，3 秒后超时失败，全程没有任何重试**：

|        | 错误里记下的                                                     |
| ------ | ---------------------------------------------------------------- |
| 对象版 | `attempts: 0, elapsedMs: 0`（两个值在 execute() 开头就被冻住了） |
| 函数版 | `attempts: 1, elapsedMs: 3000`                                   |

所以原因只有一句：**这两个值在准备阶段还不存在，必须推迟到失败发生的那一刻再读。**
`execute()` 有两个失败出口，闭包在两处各取当下的快照：

```text
绝对 URL 守卫   attempts 0、elapsedMs ≈ 0   ← 一个请求都还没发出去，这正是正确答案
主 catch        attempts ≥ 1
```

（`attempts` 什么时候会大于 1，[阶段六](./lifecycle.md)和[阶段七](./auth.md)各会给出
一个原因。读到这里不需要知道。）

**路径要去掉 query 和 fragment** 才能进错误上下文，query 里常有 token、手机号这类
不该落到监控平台的东西。注意它只做到这一步：`/orders/42` 原样保留，要归一化成
`/orders/:id` 得由项目的上报 Adapter 自己做。

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

`test/http-client.test.ts` 里有一条
「keeps one loading interval open for concurrent logical requests」。并发发三个请求，
确认 `onLoadingChange` 只被调用两次（一次 `true`，一次 `false`）。

---

## 阶段五：错误分三层

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

#### 通用层：稳定分类

```ts
type HttpErrorKind = "http" | "network" | "timeout" | "cancel" | "configuration" | "unknown";
```

`normalizeHttpError()` 把任何东西收敛成 `HttpError`。判断次序不能随便调，每一条都在
挡住前面漏下来的情况——特别是**取消必须排在超时前面**，因为取消也可能带`ECONNABORTED`。

#### 哪些字段可枚举：本封装最容易改坏的地方

错误对象上的字段分成两类：

|              | 字段                                                            | 存法                           | 能被 `JSON.stringify` 看到 |
| ------------ | --------------------------------------------------------------- | ------------------------------ | -------------------------- |
| 核心自己生成 | `kind` `status` `method` `path` `attempts` `elapsedMs` `origin` | 普通实例属性                   | **能**——上报要靠它们       |
| 承载响应载荷 | `responseData` `presentationHint` `cause`                       | 模块级 `WeakMap` + 原型 getter | **不能**                   |

判断标准不是「这个字段看起来敏感吗」，而是「**它是否承载响应载荷**」。
`presentationHint` 来自响应体，服务端随时可能往那段文案里写单号或用户标识。它要是
可枚举，`onReport` 里一句 `JSON.stringify(error)` 就把这些全传出去了——而写那行代码
的人根本意识不到。

> **改动提示**：往 `HttpError` 或 `ApiEnvelopeFormatError` 加新字段时，先问它属于
> 哪一类。加成普通属性 = 默认会被上报。

#### 展示与上报分家

```ts
createHttpClient({
  onError(error) {
    message.error(presentApiError(error)); // 只展示
  },
  onReport(error) {
    reportHttpError({
      // 只上报，挑明确的安全字段
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

`errorMode: "silent"` **只关掉 `onError`，不关 `onReport`**。业务模块声明
silent 就必须自己负责该请求的全部用户反馈，但它不该让这个接口从监控里消失。

`cancel` 是唯一两边都不通知的分类——用户自己切走页面，不是故障。

#### 补上下文为什么是「就地写入」

上下文要到逻辑请求结束才完整（`attempts`、`elapsedMs` 得等重试和重放跑完），所以
必然是「先有错误，后补上下文」。这时有两种写法，重建的代价是：

- **对象身份会断。** auth 模块用 `WeakSet` 标记「这个错误我处理过了」，载荷字段挂在
  以错误对象为键的 `WeakMap` 上，全都按实例身份建立，换个实例就查不到了。连原始
  `stack` 都会变。
- **多一份必须手工同步的拷贝清单。** 新增字段时漏掉不报错，只会静默丢失。

所以用 `-readonly` 映射类型开一个内部写入口，对外仍然只读：

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

#### Presenter 的两处顺序

`adapters/error-presenter.ts` 里 `http` 分支的顺序是有讲究的：

```text
1. status >= 500  → 固定文案      ← 必须最先，要盖住服务端原文
2. presentationHint → 服务端文案   ← 4xx 才用，「手机号已被注册」只有后端说得准
3. 按状态码兜底    → 403/404/429
```

`switch` 不写 `default`，让 TypeScript 在 `HttpErrorKind` 新增成员时直接报错，而不是
让新分类悄悄落到一句通用文案上。

### 自己验证

对照 `test/protocol-and-utilities.test.ts`：造一个
带 `responseData` 的错误，确认 `JSON.stringify(error)` 里没有它，但 `error.responseData`
读得到。

---

## 本页源码

构建时从 `docs/projects/axios-http/` 的真实文件直读，和测试跑的是同一份。每个文件头
注释是该文件的地图。

::: code-group

<<< @/projects/axios-http/src/api/http/client.ts [http/client.ts]

<<< @/projects/axios-http/src/api/http/errors.ts [http/errors.ts]

<<< @/projects/axios-http/src/api/http/adapters/error-presenter.ts [http/adapters/error-presenter.ts]

:::
