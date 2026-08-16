# 最小客户端：实例、数据入口与响应信封

本页对应学习路径的阶段一到三：从一个裸 Axios 实例开始，加一层直接返回业务数据的
类型化入口，再把后端信封处理抽成独立适配器。完成本页就得到一个可用于普通 CRUD 的
最小请求层。怎么读、全局链路图见
[学习路径](./learning-path.md)。

## 阶段一：一个 Axios 实例

### 场景

前端调用后端几个接口; 实用统一的接口.

```ts
//接口结构
{
  code: '0',
  message: 'xxx',
  data: {}
}
```

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

interface ApiEnvelope<Data> {
  code: number;
  message: string;
  data: Data;
}

const response = await transport.get<ApiEnvelope<User>>("/users/1");
const user = response.data.data;
```

要点只有四条：`axios.create()` 固定实例配置；`get/post` 发请求；返回的是完整
`AxiosResponse`；`response.data` 是后端信封，业务数据在 `response.data.data` 里。

### 它撑到什么时候

**接口少、页面愿意显式处理 AxiosResponse 和响应信封、没有登录态**——那么到此为止
就够了，后面七个阶段都不必看。

它开始塌，是在以下任何一条成立时：

- 每个调用点都要重复处理 `AxiosResponse` 和响应信封 → 阶段二
- 希望通用客户端可以更换后端响应格式 → 阶段三
- 需要统一的错误提示、登录过期处理、Loading → [阶段四](./request-and-errors.md)以后

### 代码示例

<CodeLab
  project="axios-minimal-instance"
  default-file="src/http.ts"
  layout="notebook"
  height="680px"
/>

---

## 阶段二：直接返回业务数据

### 从阶段一继续

阶段一的每个请求都要先拿到 `AxiosResponse`，再读取后端响应信封：

```ts
async function loadUser() {
  const response = await transport.get<ApiEnvelope<User>>("/users/1");
  return response.data.data;
}
```

请求一多，这段选择业务数据的代码会散落在每个调用点。这里增加一层最小客户端，统一
完成两层选择：先离开 `AxiosResponse`，再离开后端响应信封。

```ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

class HttpClient {
  constructor(private readonly instance: AxiosInstance) {}

  async request<Result>(config: AxiosRequestConfig): Promise<Result> {
    const response = await this.instance.request<ApiEnvelope<Result>>(config);
    return response.data.data;
  }

  get<Result>(url: string, config?: AxiosRequestConfig) {
    return this.request<Result>({ ...config, method: "get", url });
  }
}

const transport = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

export const http = new HttpClient(transport);
```

页面现在直接声明并取得业务数据：

```ts
async function loadUser() {
  return http.get<User>("/users/1");
}
```

`loadUser()` 的类型是 `Promise<User>`。因此 `const user = await loadUser()` 拿到的就是
`User`，页面不再接触 `AxiosResponse`、`code`、`message` 或信封中的 `.data`。

### 代码示例

这个阶段重点看 `src/http.ts`：Axios 实例没有变化，只增加了 `HttpClient.request()` 和 `get()`。运行后 `loadUser()` 直接返回
`User`。

<CodeLab
  project="axios-data-client"
  default-file="src/http.ts"
  layout="notebook"
  height="680px"
/>

### 它撑到什么时候

如果项目只有一种固定响应格式，给 `HttpClient` 补齐 `post()`、`put()`、`delete()`，这层
封装就能支持普通 CRUD。希望通用客户端不依赖某个后端的信封格式时，再进入阶段三。

---

## 阶段三：抽出响应信封适配器

### 从阶段二继续

三个阶段的 Mock 都把成功结果统一包在同一层信封里：

```ts
interface ApiEnvelope<Data> {
  code: number;
  message: string;
  data: Data;
}
```

阶段二的页面调用已经是最终形态：

```ts
const user = await http.get<User>("/users/1");
```

阶段二的 `HttpClient.request()` 写死了 `response.data.data`，因此它只能处理 `{ code, message, data }` 这种响应。阶段三把这段拆包逻辑移到独立适配器中。这样 HttpClient 只负责发送请求和返回响应体；更换后端响应格式时，只需更换适配器，页面调用方式不变。

### 增加响应适配器

```ts
// api/http/envelope.ts
import type { AxiosInstance } from "axios";

export interface ApiEnvelope<Data> {
  code: number;
  message: string;
  data: Data;
}

export function installApiEnvelopeAdapter(instance: AxiosInstance) {
  instance.interceptors.response.use((response) => {
    const envelope = response.data as ApiEnvelope<unknown>;
    response.data = envelope.data;
    return response;
  });
}
```

先安装适配器，再把 Axios 实例交给阶段二的 `HttpClient`：

```ts
const transport = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

installApiEnvelopeAdapter(transport);
export const http = new HttpClient(transport);
```

此时 `HttpClient.request()` 不再知道 `ApiEnvelope`，只需要返回 `response.data`：

```ts
async request<Result>(config: AxiosRequestConfig): Promise<Result> {
  const response = await this.instance.request<Result>(config);
  return response.data;
}
```

Mock 返回的是 `ApiEnvelope<User>`，适配器先把 `response.data` 换成 `User`，随后
`HttpClient.request()` 把它返回给页面。页面代码仍然是 `http.get<User>()`。

### 换一种响应格式

假设另一个后端不使用 `data`，而是返回：

```json
{
  "ok": true,
  "result": {
    "id": "1",
    "name": "Ada"
  }
}
```

只需要把适配器里的协议类型和取值改成：

```ts
interface ApiEnvelope<Data> {
  ok: boolean;
  result: Data;
}

const envelope = response.data as ApiEnvelope<unknown>;
response.data = envelope.result;
```

`HttpClient` 仍然返回 `response.data`，页面仍然使用 `await http.get<User>()`。阶段三示例的
`src/envelope.ts` 末尾也保留了这份替换代码，可以直接对照两个适配器；这就是把响应格式
独立出来的实际意义。

### 一条边界规则

这个方案用 HTTP 状态码判断请求成功或失败，信封中的 `code` 只作为项目协议的元数据。
如果现有后端固定使用 `200 + 业务码` 表达失败，需要在项目协议适配器里明确翻译，不能
假装它和普通 HTTP 接口完全相同。具体取舍见[总览页](../axios.md)。

### 代码示例

这个练习保持阶段二的调用方式和返回结果，只改变内部组织：`src/http.ts` 不再出现
`ApiEnvelope`，信封知识集中到 `src/envelope.ts`。运行后，预览仍然只会看到 `User`。
修改 Mock 中的名字，确认两个阶段的页面代码都不需要变化。

<CodeLab
  project="axios-envelope-unwrapping"
  default-file="src/envelope.ts"
  layout="notebook"
  height="680px"
/>

### 从练习版到完整实现

练习版先只覆盖普通 JSON 成功响应。[本页末尾的完整实现](#本页源码)还补了三条生产边界：
信封结构不合法时抛出明确错误；`204` 不解包；调用方需要原始响应时跳过解包。这些是
主流程成立后的加固，不需要和第一次理解拦截器同时记住。

### 阶段三进阶：增加配置边界

这不是第四套方案，而是在阶段三的代码上继续增加一项能力。阶段三的
`get()` 仍然接收完整 `AxiosRequestConfig`，调用方可以为某一次请求替换 `baseURL`、
`adapter` 或 `transformResponse`，从而绕过前面建立的固定实例和响应适配器。

下面三部分保持不变：

- `installApiEnvelopeAdapter(instance)` 继续拆响应信封
- `HttpClient.request()` 继续返回 `response.data`
- 页面继续使用 `await http.get<User>()`

只在这个基础上加入原封装的配置边界：创建客户端时确定传输策略；发送请求时只描述
本次请求。

| 创建客户端时固定                       | 单次请求可以传入                                            |
| -------------------------------------- | ----------------------------------------------------------- |
| `baseURL`、默认 `timeout`、Cookie 策略 | `params`、`headers`、`signal`、本次 `timeout`、上传下载进度 |

#### 新增一：单次请求配置白名单

阶段三的 `AxiosRequestConfig` 改为从原封装缩小得到的 `HttpRequestConfig`：

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
>;
```

然后只替换阶段三 `HttpClient` 的参数类型，返回规则不变：

```ts
async request<Result, Body = unknown>(
  config: HttpRequestConfig<Body>,
): Promise<Result> {
  const response = await this.instance.request<
    Result,
    AxiosResponse<Result, Body>,
    Body
  >(config);

  return response.data;
}

get<Result>(url: string, config?: HttpRequestConfig) {
  return this.request<Result>({ ...config, method: "get", url });
}
```

#### 新增二：把固定配置收进工厂

阶段三直接调用 `axios.create()`；进阶版把同一段创建过程收进工厂：

```ts
interface CreateHttpClientOptions {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
}

function createAxiosDefaults(options: CreateHttpClientOptions): CreateAxiosDefaults {
  return {
    baseURL: options.baseURL,
    timeout: options.timeout ?? 10_000,
    allowAbsoluteUrls: false,
    withCredentials: options.withCredentials ?? false,
    transitional: { clarifyTimeoutError: true },
  };
}

function createHttpClient(options: CreateHttpClientOptions) {
  const instance = axios.create(createAxiosDefaults(options));
  // 阶段三的响应适配器保持不变。
  installApiEnvelopeAdapter(instance);
  return new HttpClient(instance);
}

export const http = createHttpClient({
  baseURL: "/api",
  timeout: 10_000,
  withCredentials: false,
});
```

页面只多了可选的单次请求配置，返回结果没有变化：

```ts
const user = await http.get<User>("/users/1", {
  params: { source: "profile" },
  signal: new AbortController().signal,
});
```

`params` 和 `signal` 描述这一次请求；`baseURL`、`withCredentials`、`adapter` 和
`transformResponse` 不能从 `get()` 传入。

原封装的白名单就是这十个 Axios 字段。完整版本会在后续页面分别加入
`AuthBehavior`、`ErrorBehavior`、`LoadingBehavior` 和 `RetryBehavior`；这里暂时不引用
尚未学习的能力。

白名单只能限制配置对象，不能判断 `get()` 收到的 URL 字符串是不是绝对地址。原封装还
会在 `execute()` 中拒绝绝对业务 URL，这项运行时检查随[下一页](./request-and-errors.md)
的请求主流程再加入。

#### 合并后的完整代码

<CodeLab
  project="axios-config-boundary"
  default-file="src/http.ts"
  layout="notebook"
  height="760px"
/>

这个 CodeLab 是阶段三代码加上上述两处增量。`src/envelope.ts` 与阶段三相同；
`src/typecheck.ts` 验证白名单内的配置可以使用，而 `baseURL`、`adapter` 和
`transformResponse` 会被 TypeScript 拒绝。

---

## 本页源码

上面的四个 CodeLab 是为了逐步学习而缩小的版本。下面的信封 Adapter 从
`docs/projects/axios-http/` 的原封装源码直读；进阶示例中的白名单和固定配置也来自同一
份 `client.ts`。生产版的 `request()/raw()/execute()` 会在
[下一页](./request-and-errors.md)继续展开。

<<< @/projects/axios-http/src/api/http/adapters/envelope.ts [http/adapters/envelope.ts]
