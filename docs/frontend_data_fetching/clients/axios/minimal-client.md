# 最小客户端：实例、信封与类型化入口

本页对应学习路径的阶段一到三：从一个裸 Axios 实例开始，拆掉响应信封，再给出类型化
入口。完成本页就得到一个可用于普通 CRUD 的最小请求层。怎么读、全局链路图见
[学习路径](./learning-path.md)。

## 阶段一：一个 Axios 实例

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
- 需要统一的错误提示、登录过期处理、Loading → [阶段四](./request-and-errors.md)以后

### 自己验证

写一个最小实例，请求一个本地接口，说清 `response` 和 `response.data` 的区别。

---

## 阶段二：拆掉响应信封

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
    throw new Error(body.message); // ← 问题在这一行
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
`adapters/envelope.ts` 解析出 `code`，但从头到尾不用它做判断：

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
**业务模块**里翻译（[阶段八](./modules-and-e2e.md)），不要放进传输层。整个后端都用
`200 + code` 表达失败、存量协议又改不动的情况，见下面的适配小节。

### 整个后端都用 200 + 业务码怎么办

完整的三层决策次序——首选推动后端改、个别接口在业务模块里翻译、整个后端如此才动
协议层——见[总览页](../axios.md)「后端用 200 + 业务码表达失败怎么办」。走到第三层
时，「`code` 非 0 即失败」已经是这一支后端的协议事实，而协议判定本来就属于协议
Adapter——改写 `adapters/envelope.ts` 一个文件：

```ts
// adapters/envelope.ts 的变体：这一支后端把失败也放在 HTTP 200 里
const envelope = readApiEnvelope(response.data);
if (!envelope?.hasData) {
  throw new ApiEnvelopeFormatError(response.status, response.data);
}
if (envelope.code !== 0) {
  // 项目自定义的业务错误类型，Presenter 增加对应分支给出文案
  throw new ApiBusinessError(envelope.code, envelope.message);
}
response.data = envelope.data;
```

诚实地说清代价：若登录失效也走业务码，认证模块的 401 触发点同样要在协议层翻译成
401 语义再交给状态机。封装能把这类协议的混乱**圈在 `adapters/` 里**，不能消灭它。

### 自己验证

对照 `test/http-client.test.ts` 的
「requires code, message, and data in a successful envelope」：构造一个缺 `data` 字段的
`200` 响应，确认拿到的是 `ApiEnvelopeFormatError` 而不是 `undefined`。相邻那条
「accepts null data and bypasses the envelope for 204 responses」覆盖另外两种边界。

---

## 阶段三：类型化入口

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
`execute()` 收一个 `select` 回调就够了，不需要两套实现。`execute()` 本身是
[下一页](./request-and-errors.md)的主角。

### 调用方能透传哪些配置：一个容易写错的决定

#### 先写最直觉的那版

```ts
// 幼稚版：从完整 Axios 配置里排掉几个危险的
type HttpRequestConfig = Omit<AxiosRequestConfig, "baseURL" | "withCredentials">;
```

#### 它塌在哪

排除法要求你**穷举所有能破坏模块保证的键**，而你穷举不完：

| 漏掉的键            | 调用方能做什么                                                   |
| ------------------- | ---------------------------------------------------------------- |
| `validateStatus`    | 把 `5xx` 判为成功，直接击穿阶段二刚建立的「HTTP 状态是唯一权威」 |
| `adapter`           | 整体换掉传输层，全部拦截器绕过                                   |
| `transformResponse` | 在协议 Adapter 之前改写响应体                                    |
| `paramsSerializer`  | 改掉工厂统一决定的序列化方式                                     |

更麻烦的是 Axios 每次升级都可能加新配置键，排除清单**永远滞后于依赖版本**。

#### 现在的写法

白名单。新增键默认被拒绝，要放开是一次显式决定：

```ts
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

export type HttpRequestConfig<Body = unknown> = Pick<
  AxiosRequestConfig<Body>,
  AllowedAxiosConfigKey
> &
  AuthBehavior &
  ErrorBehavior &
  LoadingBehavior &
  RetryBehavior;
```

这是「默认安全」和「默认开放」的区别。判断依据很简单：**传输策略属于模块，调用方
只描述这一次请求**。

它和 `createAxiosDefaults()` 是同一条边界的两半——那边把策略定死，这边拦住调用方
按请求改回来。

### 自己验证

`test/typecheck.ts` 里有一组 `@ts-expect-error` 断言。往
`HttpRequestConfig` 里传 `validateStatus`，确认 TypeScript 直接拒绝。

---

## 本页源码

构建时从 `docs/projects/axios-http/` 的真实文件直读，和测试跑的是同一份。本页落地的
是信封 Adapter；类型化入口和 `request()/raw()/execute()` 都在 `client.ts` 里，随
[下一页](./request-and-errors.md)展示。

<<< @/projects/axios-http/src/api/http/adapters/envelope.ts [http/adapters/envelope.ts]
