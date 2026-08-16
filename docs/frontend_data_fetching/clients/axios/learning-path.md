# Axios 封装：从一条请求开始

下面始终请求同一个用户接口，Mock 也始终返回同一种响应信封：

```ts
interface ApiEnvelope<Data> {
  code: number;
  message: string;
  data: Data;
}
```

变化只发生在客户端：阶段一得到 `AxiosResponse<ApiEnvelope<User>>`；阶段二开始，
`await http.get<User>()` 直接得到 `User`；阶段三保持这个结果，只把响应协议从客户端
中提取成独立适配器。

## 1. 固定 Axios 实例

最基础的封装只做两件事：固定后端地址和公共超时。

```ts
// api/http.ts
import axios from "axios";

export const http = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});
```

页面直接使用这个实例：

```ts
// UserPage.ts
interface User {
  id: string;
  name: string;
}

async function loadUser(userId: string) {
  const response = await http.get<ApiEnvelope<User>>(`/users/${userId}`);
  return response.data.data;
}
```

此时已经具备一个可用的请求入口。问题也很明显：每个页面都要处理
`AxiosResponse` 和后端响应信封，并重复读取 `response.data.data`。

## 2. 直接返回业务数据

在 Axios 实例外增加一层最小客户端，同时收起 `AxiosResponse` 和后端响应信封。

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

const instance = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

export const http = new HttpClient(instance);
```

页面只描述自己需要的结果类型：

```ts
async function loadUser(userId: string) {
  return http.get<User>(`/users/${userId}`);
}
```

此时 `await loadUser()` 的结果就是 `User`。`post()`、`put()`、`delete()` 也可以用同样
的方法补齐。这个版本已经可以用于普通项目，但 `HttpClient` 内部直接认识了本项目的
`ApiEnvelope`。

## 3. 抽出后端响应适配器

前两个阶段使用的 Mock 一直返回统一响应信封：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "id": "42",
    "name": "Ada"
  }
}
```

阶段二已经让页面直接得到 `User`，但通用客户端和 `{ code, message, data }` 绑在了一起。
现在把这段协议知识移到一个可安装的响应适配器中：

```ts
function installApiEnvelopeAdapter(instance: AxiosInstance) {
  instance.interceptors.response.use((response) => {
    if (response.status === 204) {
      response.data = undefined;
      return response;
    }

    const envelope = readApiEnvelope(response.data);
    if (!envelope?.hasData) {
      throw new ApiEnvelopeFormatError(response.status, response.data);
    }

    response.data = envelope.data;
    return response;
  });
}
```

`HttpClient` 恢复为只选择 Axios 的 `response.data`：

```ts
async request<Result>(config: AxiosRequestConfig): Promise<Result> {
  const response = await this.instance.request<Result>(config);
  return response.data;
}
```

页面代码和阶段二完全相同：

```ts
async function loadUser(userId: string) {
  return http.get<User>(`/users/${userId}`);
}
```

阶段二和阶段三的 `await` 结果都是 `User`。变化只发生在内部：后端响应格式现在只存在于
Adapter 中；更换后端协议时，修改 Adapter，不修改页面和客户端公开方法。
例如另一套接口返回 `{ ok: true, result: User }`，适配器改为读取 `envelope.result` 即可，
`HttpClient` 和 `loadUser()` 仍然保持原样。
[最小客户端](./minimal-client.md)随后还提供一个阶段三进阶版本：不改变这条请求主线，只在
阶段三代码上增加固定配置和单次请求白名单。
[查看响应协议的完整实现](./minimal-client.md)。

## 4. 让失败走同一个出口

网络断开、超时、HTTP 失败和响应格式错误不能让页面分别猜测。`request()` 因此进入
统一的 `execute()`：

```ts
class HttpClient {
  request<Result>(config: HttpRequestConfig): Promise<Result> {
    return this.execute(config, (response) => response.data as Result);
  }

  private async execute<Result>(
    config: HttpRequestConfig,
    select: (response: AxiosResponse) => Result,
  ): Promise<Result> {
    try {
      const response = await this.instance.request(config);
      return select(response);
    } catch (cause) {
      const error =
        cause instanceof ApiEnvelopeFormatError ? cause : await normalizeHttpError(cause);

      this.notifyFailure(error, config.errorMode === "silent", false);
      throw error;
    }
  }
}
```

客户端负责把失败整理成稳定的错误对象，但不会吞掉错误。页面需要局部处理时仍然使用
普通的 `try/catch`：

```ts
async function loadUser(userId: string) {
  try {
    return await http.get<User>(`/users/${userId}`, {
      errorMode: "silent",
    });
  } catch (error) {
    // 当前页面自己的降级处理
  }
}
```

[查看错误分类和展示分流](./request-and-errors.md)。

## 5. 把一次请求的收尾集中起来

当项目需要 Loading、取消或重试时，它们都必须覆盖同一次 `loadUser()`。继续扩展
`execute()`，而不是在页面外再套几层函数：

```ts
private async execute<Result>(
  config: HttpRequestConfig,
  select: (response: AxiosResponse) => Result,
): Promise<Result> {
  const controller = new AbortController();
  const combined = config.signal
    ? combineAbortSignals([config.signal, controller.signal])
    : { signal: controller.signal, dispose: () => {} };
  const showLoading = config.showLoading ?? false;

  this.logicalRequestControllers.add(controller);
  if (showLoading) this.startLoading();

  try {
    const send = async () => {
      const response = await this.instance.request({
        ...config,
        signal: combined.signal,
      });
      return select(response);
    };

    const method = (config.method ?? "get").toLowerCase();
    const shouldRetry =
      config.retry && ["get", "head", "options"].includes(method);

    return shouldRetry
      ? await retry(send, {
          retries: config.retry.retries,
          baseDelay: config.retry.baseDelayMs,
          totalTimeoutMs: config.retry.totalTimeoutMs,
          signal: combined.signal,
        })
      : await send();
  } finally {
    if (showLoading) this.stopLoading();
    combined.dispose();
    this.logicalRequestControllers.delete(controller);
  }
}
```

上一步的错误归一化仍然包在这段发送逻辑外层，这里只突出新加入的生命周期。

页面只声明这一次请求需要什么：

```ts
async function loadUser(userId: string, signal: AbortSignal) {
  return http.get<User>(`/users/${userId}`, {
    showLoading: true,
    retry: {
      retries: 2,
      totalTimeoutMs: 8_000,
    },
    signal,
  });
}
```

Loading 只开关一次；内部即使重试，请求仍然只有一个页面级生命周期。
[查看取消、Loading 与重试的完整实现](./lifecycle.md)。

## 6. 在请求链上加入认证恢复

受保护接口还需要两项能力：发送前带上 Access Token，收到 401 后刷新凭证并重放原
请求。它们安装在同一个 Axios 实例上：

```ts
export function createHttpClient(options: CreateHttpClientOptions) {
  const instance = axios.create(createAxiosDefaults(options));

  const requestControl = installRequestControl(instance);
  installApiEnvelopeAdapter(instance);

  const authControl = options.auth
    ? installAuth(instance, options.auth, {
        refreshCooldownMs: options.refreshCooldownMs,
      })
    : undefined;

  return new AxiosHttpClient(instance, requestControl, authControl, options);
}
```

`loadUser()` 仍然不需要知道 Token 和刷新接口：

```text
loadUser()
  → 请求拦截器加入 Access Token
  → GET /users/42
  → 收到 401
  → 所有并发 401 共享一次刷新
  → 保存新凭证
  → 原请求重新进入同一个 Axios 实例
  → 请求拦截器换上新 Token
  → GET /users/42
  → 返回 User
```

如果刷新失败，认证模块结束当前会话；如果刷新成功但重放仍是 401，则直接失败，不再
循环刷新。[查看认证与 401 恢复](./auth.md)。

## 最终结构

前面的代码最后落在这些文件中：

```text
api/
├─ http/
│  ├─ index.ts                 唯一对外入口
│  ├─ client.ts                request/get/post 与 execute()
│  ├─ errors.ts                稳定的错误分类
│  ├─ request-control.ts       物理请求计数与取消
│  ├─ retry.ts                 安全读取重试
│  ├─ auth.ts                  Token 注入、401 刷新与重放
│  └─ adapters/
│     ├─ envelope.ts           后端响应格式
│     ├─ error-presenter.ts    项目错误文案
│     └─ auth.ts               当前项目的认证方式
└─ session.ts                  当前会话
```

页面最终只从 `index.ts` 获取一个 `http` 实例：

::: details 查看真实入口源码
<<< @/projects/axios-http/src/api/http/index.ts [http/index.ts]
:::

## 主线之外的扩展

下面的能力不改变普通请求的主线，需要时再阅读：

- `transfer.ts`：上传、Blob 下载和浏览器直接下载。
- `session-sync.ts`：在多个标签页之间同步登录、刷新和退出结果。
- `raw()`：需要响应头、状态码或完整 `AxiosResponse` 时跳过自动解包。
