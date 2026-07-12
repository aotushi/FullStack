# Axios

## axios 二次封装

Axios 二次封装的目标不是把 Axios 再包一层，而是把项目里的请求约定集中起来：入口统一、返回结构统一、错误处理统一、登录态处理统一，并给业务代码保留清晰的类型。

### 1. 前端请求流程图

<img
  class="axios-request-flow-image"
  src="../assets/axios-request-flow.webp"
  alt="前端请求流程图"
  loading="lazy"
/>

<style>
.axios-request-flow-image {
  display: block;
  width: min(100%, 560px);
  height: auto;
  margin: 16px auto 24px;
}
</style>

### 2. 基础封装（最小可用版本）

基础封装先解决最小闭环：创建实例、读取环境变量、带上公共请求信息、剥离响应数据、约定返回结构，并暴露常用请求方法。

- axios 实例（baseURL / timeout / headers）
- 环境变量管理 baseURL（dev / prod）
- 基础请求拦截器（携带 token、公共参数）
- 基础响应拦截器（数据剥壳、基础错误提示）
- 返回结构约定
- 类型声明与泛型返回
- request / get / delete / head / options / post / put / patch 基础方法

::: code-group

```ts [http.ts]
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

// 项目统一响应结构：服务端返回 { code, message, data }，业务代码只拿 data。
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

type RequestKeyResolver<D = unknown> = (config: InternalAxiosRequestConfig<D>) => string;

type RequestConfig<D = unknown> = AxiosRequestConfig<D> & {
  // 静默请求：调用方可用它跳过全局错误提示。
  silent?: boolean;
  // 登录、刷新 token 等接口可跳过 Authorization 头。
  skipAuth?: boolean;
  // 全局 loading 默认关闭，由调用方按需开启。
  showLoading?: boolean;
  // 是否参与重复请求处理。
  dedupe?: boolean;
  // 带请求体的方法可由业务提供语义化标识或计算函数。
  dedupeKey?: string | RequestKeyResolver<D>;
};

type InternalRequestConfig<D = unknown> = InternalAxiosRequestConfig<D> & RequestConfig<D>;

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      // Vite 会按模式读取 .env.development / .env.production。
      // 示例：VITE_API_BASE_URL=/api 或 https://api.example.com。
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // request.use 的第二个参数只处理请求发送前、拦截器链已经进入拒绝状态的异常。
    // 当前没有额外的恢复或清理逻辑，因此省略；只返回 Promise.reject(error) 与省略效果相同。
    // 网络错误、超时和非 2xx 响应由响应拦截器的失败回调统一处理。
    this.instance.interceptors.request.use((config: InternalRequestConfig) => {
      // config 是本次请求的完整配置对象；headers 只是 config 里的请求头部分。
      if (!config.skipAuth) {
        const token = localStorage.getItem("access_token");
        if (token) {
          // 修改请求头时，只改 config.headers，而不是把 config 当成 headers。
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // 公共参数也可以在这里统一追加，例如 tenantId、locale、traceId。
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => {
        const result = response.data as ApiResponse<unknown>;

        if (result.code !== 0) {
          // 基础错误提示放在这里；复杂错误归一化放到“拦截器进阶”。
          return Promise.reject(new Error(result.message || "请求失败"));
        }

        // 数据剥壳：调用 http.get<User>() 时，业务代码直接拿到 User。
        return result.data;
      },
      (error) => {
        // 这里处理请求发出后的网络错误、超时、取消和非 2xx 响应。
        return Promise.reject(error);
      },
    );
  }

  request<T, D = unknown>(config: RequestConfig<D>): Promise<T> {
    return this.instance.request<unknown, T, D>(config);
  }

  get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get<unknown, T>(url, config);
  }

  delete<T, D = unknown>(url: string, config?: RequestConfig<D>): Promise<T> {
    return this.instance.delete<unknown, T, D>(url, config);
  }

  head<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.head<unknown, T>(url, config);
  }

  options<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.options<unknown, T>(url, config);
  }

  post<T, D = unknown>(url: string, data?: D, config?: RequestConfig<D>): Promise<T> {
    return this.instance.post<unknown, T, D>(url, data, config);
  }

  put<T, D = unknown>(url: string, data?: D, config?: RequestConfig<D>): Promise<T> {
    return this.instance.put<unknown, T, D>(url, data, config);
  }

  patch<T, D = unknown>(url: string, data?: D, config?: RequestConfig<D>): Promise<T> {
    return this.instance.patch<unknown, T, D>(url, data, config);
  }
}

export const http = new HttpClient();

// 使用时在调用点传入泛型，而不是指望拦截器“自动推导”运行时数据类型。
interface User {
  id: number;
  name: string;
}

const user = await http.get<User>("/user/1");
```

```js [http.js]
import axios from "axios";

/**
 * 项目统一响应结构：服务端返回 { code, message, data }，业务代码只拿 data。
 * @template T
 * @typedef {{ code: number, message: string, data: T }} ApiResponse
 */

/**
 * @typedef {import("axios").AxiosRequestConfig & {
 *   silent?: boolean,
 *   skipAuth?: boolean,
 *   showLoading?: boolean,
 *   dedupe?: boolean,
 *   dedupeKey?: string | ((config: import("axios").InternalAxiosRequestConfig) => string)
 * }} RequestConfig
 */

function createHttpClient() {
  const instance = axios.create({
    // Vite 会按模式读取 .env.development / .env.production。
    // 示例：VITE_API_BASE_URL=/api 或 https://api.example.com。
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // request.use 的第二个参数只处理请求发送前、拦截器链已经进入拒绝状态的异常。
  // 当前没有额外的恢复或清理逻辑，因此省略；只返回 Promise.reject(error) 与省略效果相同。
  // 网络错误、超时和非 2xx 响应由响应拦截器的失败回调统一处理。
  instance.interceptors.request.use((config) => {
    // config 是本次请求的完整配置对象；headers 只是 config 里的请求头部分。
    if (!config.skipAuth) {
      const token = localStorage.getItem("access_token");
      if (token) {
        // 修改请求头时，只改 config.headers，而不是把 config 当成 headers。
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 公共参数也可以在这里统一追加，例如 tenantId、locale、traceId。
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      /** @type {ApiResponse<unknown>} */
      const result = response.data;

      if (result.code !== 0) {
        // 基础错误提示放在这里；复杂错误归一化放到“拦截器进阶”。
        return Promise.reject(new Error(result.message || "请求失败"));
      }

      // 数据剥壳：调用方直接拿到业务数据。
      return result.data;
    },
    (error) => {
      // 这里处理请求发出后的网络错误、超时、取消和非 2xx 响应。
      return Promise.reject(error);
    },
  );

  return {
    /**
     * @template T
     * @param {RequestConfig} config
     * @returns {Promise<T>}
     */
    request(config) {
      return instance.request(config);
    },

    /**
     * @template T
     * @param {string} url
     * @param {RequestConfig} [config]
     * @returns {Promise<T>}
     */
    get(url, config) {
      return instance.get(url, config);
    },

    /**
     * @template T
     * @param {string} url
     * @param {RequestConfig} [config]
     * @returns {Promise<T>}
     */
    delete(url, config) {
      return instance.delete(url, config);
    },

    /**
     * @template T
     * @param {string} url
     * @param {RequestConfig} [config]
     * @returns {Promise<T>}
     */
    head(url, config) {
      return instance.head(url, config);
    },

    /**
     * @template T
     * @param {string} url
     * @param {RequestConfig} [config]
     * @returns {Promise<T>}
     */
    options(url, config) {
      return instance.options(url, config);
    },

    /**
     * @template T
     * @template D
     * @param {string} url
     * @param {D} [data]
     * @param {RequestConfig} [config]
     * @returns {Promise<T>}
     */
    post(url, data, config) {
      return instance.post(url, data, config);
    },

    /**
     * @template T
     * @template D
     * @param {string} url
     * @param {D} [data]
     * @param {RequestConfig} [config]
     * @returns {Promise<T>}
     */
    put(url, data, config) {
      return instance.put(url, data, config);
    },

    /**
     * @template T
     * @template D
     * @param {string} url
     * @param {D} [data]
     * @param {RequestConfig} [config]
     * @returns {Promise<T>}
     */
    patch(url, data, config) {
      return instance.patch(url, data, config);
    },
  };
}

export const http = createHttpClient();
```

:::

### 3. 拦截器进阶

拦截器进阶处理的是跨请求的公共行为：请求标识、loading、错误归一化，以及登录态刷新。

#### 3.1 请求策略与前置处理

基础请求拦截器已经完成 `token` 和`公共参数处理`。进阶部分继续解决两个问题：

- 为`取消重复请求`、`接口缓存`生成稳定的请求标识。
- 按请求`控制全局 loading`，并正确`处理并发请求`。

请求拦截器只负责发出请求前的准备工作。请求完成后的 loading 清理放在响应拦截器中，具体的重复请求取消放在第 4 节。

Axios 能发送哪些方法，与哪些方法适合自动生成去重标识是两个问题。通用 `request` 方法负责完整的方法覆盖；自动标识只用于无需检查请求体的安全方法：

| 方法                       | 默认标识策略           | 原因                                      |
| -------------------------- | ---------------------- | ----------------------------------------- |
| `GET` / `HEAD` / `OPTIONS` | 根据 method + URL 生成 | 安全方法，参数可以由完整 URL 表达         |
| `QUERY`                    | 要求提供 `dedupeKey`   | 请求体参与查询条件，且仍是实验性方法      |
| `POST` / `PUT` / `PATCH`   | 要求提供 `dedupeKey`   | 请求体可能是 JSON、FormData、File 或 Blob |
| `DELETE`                   | 要求提供 `dedupeKey`   | 虽然幂等，但仍可能改变服务端状态          |
| `postForm` 等表单快捷方法  | 要求提供 `dedupeKey`   | 请求体可能包含无法稳定序列化的文件        |

这里不尝试对任意请求体执行 `JSON.stringify`。业务比通用封装更清楚哪些字段真正决定“同一个请求”，因此带请求体的方法使用语义化 key 更可靠。

##### 请求级配置

第 2 节的 `RequestConfig` 增加以下配置：

| 配置          | 默认值  | 作用                   |
| ------------- | ------- | ---------------------- |
| `showLoading` | `false` | 是否展示全局 loading   |
| `dedupe`      | `false` | 是否参与重复请求处理   |
| `dedupeKey`   | 无      | 指定请求标识或计算函数 |
| `skipAuth`    | `false` | 是否跳过登录凭证       |
| `silent`      | `false` | 是否跳过全局错误提示   |

`showLoading` 和 `silent` 分别控制 loading 与错误提示，避免一个配置承担多种含义。

##### 请求标识与 loading

::: code-group

```ts [http.ts]
type RequestRuntimeMeta = {
  requestKey?: string;
  loadingStarted?: boolean;
  retrying?: boolean;
};

type AdvancedRequestConfig = InternalRequestConfig & {
  __requestMeta?: RequestRuntimeMeta;
};

const AUTO_KEY_METHODS = new Set(["get", "head", "options"]);

function getRequestMeta(config: AdvancedRequestConfig) {
  config.__requestMeta ??= {};
  return config.__requestMeta;
}

function resolveRequestKey(instance: AxiosInstance, config: AdvancedRequestConfig) {
  const method = (config.method ?? "get").toLowerCase();
  const uri = instance.getUri(config);

  if (config.dedupeKey) {
    const customKey =
      typeof config.dedupeKey === "function" ? config.dedupeKey(config) : config.dedupeKey;

    return `${method}:${uri}:${customKey}`;
  }

  // 只有不依赖请求体的安全方法可以直接使用 URL 生成 key。
  if (AUTO_KEY_METHODS.has(method)) {
    return `${method}:${uri}`;
  }

  return undefined;
}

function createRequestLifecycle(instance: AxiosInstance) {
  let loadingCount = 0;

  function startLoading(config: AdvancedRequestConfig) {
    const meta = getRequestMeta(config);

    if (!config.showLoading || meta.loadingStarted) {
      return;
    }

    meta.loadingStarted = true;
    loadingCount += 1;

    if (loadingCount === 1) {
      // openGlobalLoading();
    }
  }

  function finish(config?: InternalAxiosRequestConfig) {
    const currentConfig = config as AdvancedRequestConfig | undefined;

    if (!currentConfig?.__requestMeta?.loadingStarted) {
      return;
    }

    currentConfig.__requestMeta.loadingStarted = false;
    loadingCount = Math.max(loadingCount - 1, 0);

    if (loadingCount === 0) {
      // closeGlobalLoading();
    }
  }

  function prepare(config: InternalRequestConfig) {
    const currentConfig = config as AdvancedRequestConfig;

    if (currentConfig.dedupe) {
      const requestKey = resolveRequestKey(instance, currentConfig);

      if (!requestKey) {
        const method = (currentConfig.method ?? "get").toUpperCase();
        throw new TypeError(`${method} 请求启用 dedupe 时必须提供 dedupeKey`);
      }

      getRequestMeta(currentConfig).requestKey = requestKey;
    }

    // 放在最后执行，避免前置处理抛错后遗留未关闭的 loading。
    startLoading(currentConfig);
    return config;
  }

  return {
    prepare,
    finish,
    resolveKey: (config: AdvancedRequestConfig) => resolveRequestKey(instance, config),
  };
}
```

```js [http.js]
/**
 * @typedef {import("axios").InternalAxiosRequestConfig & RequestConfig & {
 *   __requestMeta?: {
 *     requestKey?: string,
 *     loadingStarted?: boolean,
 *     retrying?: boolean
 *   }
 * }} AdvancedRequestConfig
 */

const AUTO_KEY_METHODS = new Set(["get", "head", "options"]);

/** @param {AdvancedRequestConfig} config */
function getRequestMeta(config) {
  config.__requestMeta ??= {};
  return config.__requestMeta;
}

/**
 * @param {import("axios").AxiosInstance} instance
 * @param {AdvancedRequestConfig} config
 */
function resolveRequestKey(instance, config) {
  const method = (config.method ?? "get").toLowerCase();
  const uri = instance.getUri(config);

  if (config.dedupeKey) {
    const customKey =
      typeof config.dedupeKey === "function" ? config.dedupeKey(config) : config.dedupeKey;

    return `${method}:${uri}:${customKey}`;
  }

  // 只有不依赖请求体的安全方法可以直接使用 URL 生成 key。
  if (AUTO_KEY_METHODS.has(method)) {
    return `${method}:${uri}`;
  }

  return undefined;
}

/**
 * @param {import("axios").AxiosInstance} instance
 */
function createRequestLifecycle(instance) {
  let loadingCount = 0;

  /** @param {AdvancedRequestConfig} config */
  function startLoading(config) {
    const meta = getRequestMeta(config);

    if (!config.showLoading || meta.loadingStarted) {
      return;
    }

    meta.loadingStarted = true;
    loadingCount += 1;

    if (loadingCount === 1) {
      // openGlobalLoading();
    }
  }

  /** @param {AdvancedRequestConfig | undefined} config */
  function finish(config) {
    if (!config?.__requestMeta?.loadingStarted) {
      return;
    }

    config.__requestMeta.loadingStarted = false;
    loadingCount = Math.max(loadingCount - 1, 0);

    if (loadingCount === 0) {
      // closeGlobalLoading();
    }
  }

  /** @param {AdvancedRequestConfig} config */
  function prepare(config) {
    if (config.dedupe) {
      const requestKey = resolveRequestKey(instance, config);

      if (!requestKey) {
        const method = (config.method ?? "get").toUpperCase();
        throw new TypeError(`${method} 请求启用 dedupe 时必须提供 dedupeKey`);
      }

      getRequestMeta(config).requestKey = requestKey;
    }

    // 放在最后执行，避免前置处理抛错后遗留未关闭的 loading。
    startLoading(config);
    return config;
  }

  return {
    prepare,
    finish,
    resolveKey: (config) => resolveRequestKey(instance, config),
  };
}
```

:::

在第 2 节已有的拦截器中接入生命周期，不再为 token、请求标识和 loading 分别注册多个请求拦截器。请求开始和结束必须成对处理：

::: code-group

```ts [http.ts]
const requestLifecycle = createRequestLifecycle(this.instance);

this.instance.interceptors.request.use((config: InternalRequestConfig) => {
  if (!config.skipAuth) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // 公共参数处理完成后，再生成 key 并启动 loading。
  return requestLifecycle.prepare(config);
});

this.instance.interceptors.response.use(
  (response) => {
    requestLifecycle.finish(response.config);

    const result = response.data as ApiResponse<unknown>;
    if (result.code !== 0) {
      throw new Error(result.message || "请求失败");
    }

    return result.data;
  },
  (error: unknown) => {
    requestLifecycle.finish(axios.isAxiosError(error) ? error.config : undefined);
    throw error;
  },
);
```

```js [http.js]
const requestLifecycle = createRequestLifecycle(instance);

instance.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // 公共参数处理完成后，再生成 key 并启动 loading。
  return requestLifecycle.prepare(config);
});

instance.interceptors.response.use(
  (response) => {
    requestLifecycle.finish(response.config);

    const result = response.data;
    if (result.code !== 0) {
      throw new Error(result.message || "请求失败");
    }

    return result.data;
  },
  (error) => {
    requestLifecycle.finish(axios.isAxiosError(error) ? error.config : undefined);
    throw error;
  },
);
```

:::

调用方按需启用能力。URL 参数请求可以自动生成 key；带请求体的方法需要提供语义化 key：

::: code-group

```ts [TypeScript]
type SearchPayload = {
  keyword: string;
  page: number;
};

http.get<User[]>("/users", {
  params: { keyword: "axios" },
  showLoading: true,
  dedupe: true,
});

http.post<User[], SearchPayload>(
  "/users/search",
  { keyword: "axios", page: 1 },
  {
    dedupe: true,
    dedupeKey: (config) => {
      const body = config.data as SearchPayload;
      return `${body.keyword}:${body.page}`;
    },
  },
);
```

```js [JavaScript]
http.get("/users", {
  params: { keyword: "axios" },
  showLoading: true,
  dedupe: true,
});

http.post(
  "/users/search",
  { keyword: "axios", page: 1 },
  {
    dedupe: true,
    dedupeKey: (config) => {
      const body = config.data;
      return `${body.keyword}:${body.page}`;
    },
  },
);
```

:::

需要注意：

1. 全局 loading 默认关闭，页面局部加载状态仍由页面自身管理。
2. `request` 方法负责完整的方法覆盖，`AUTO_KEY_METHODS` 只决定哪些方法可以自动生成 key。
3. `finish` 在最终成功、失败和取消路径中只执行一次；token 刷新时应等重放请求最终结束后再执行。
4. `requestLifecycle.resolveKey` 可以独立用于接口缓存，不要求同时开启 `dedupe`。
5. 写请求的客户端取消不能替代服务端幂等机制。
6. `__requestMeta.requestKey` 的登记、替换和清理统一放在第 4 节的 `pendingMap` 中实现。

#### 3.2 响应拦截器进阶

- 错误归一化（HTTP 错误 / 业务错误 / 网络错误）
- token 无感刷新
  - 401 捕获与请求重放
  - 并发处理：多个 401 只刷新一次（等待队列）
  - 刷新失败兜底（退出登录）

```ts
type NormalizedError = {
  type: "http" | "business" | "network" | "cancel";
  status?: number;
  code?: number;
  message: string;
};

function normalizeError(error: unknown): NormalizedError {
  if (axios.isCancel(error)) {
    return { type: "cancel", message: "请求已取消" };
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
      return {
        type: "http",
        status: error.response.status,
        message: error.message,
      };
    }

    return {
      type: "network",
      message: "网络异常，请稍后重试",
    };
  }

  return {
    type: "business",
    message: error instanceof Error ? error.message : "请求失败",
  };
}
```

Token 无感刷新需要重点处理并发：不能每个 401 都刷新一次 token。

```ts
type RefreshQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let refreshQueue: RefreshQueueItem[] = [];

async function refreshToken() {
  const refreshTokenValue = localStorage.getItem("refresh_token");
  const result = await axios.post<{ accessToken: string }>("/auth/refresh", {
    refreshToken: refreshTokenValue,
  });

  localStorage.setItem("access_token", result.data.accessToken);
  return result.data.accessToken;
}

function replayWaitingRequests(token: string) {
  refreshQueue.forEach(({ resolve }) => resolve(token));
  refreshQueue = [];
}

function rejectWaitingRequests(error: unknown) {
  refreshQueue.forEach(({ reject }) => reject(error));
  refreshQueue = [];
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  // redirectToLogin();
}
```

响应拦截器中只保留流程骨架，具体的存储、跳转、提示逻辑交给项目能力处理。

```ts
this.instance.interceptors.response.use(
  (response) => {
    requestLifecycle.finish(response.config);
    return response.data.data;
  },
  async (error) => {
    const originalRequest = error.config as AdvancedRequestConfig | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest.__requestMeta?.retrying
    ) {
      requestLifecycle.finish(originalRequest);
      throw normalizeError(error);
    }

    getRequestMeta(originalRequest).retrying = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(this.instance(originalRequest));
          },
          reject: (refreshError) => {
            requestLifecycle.finish(originalRequest);
            reject(refreshError);
          },
        });
      });
    }

    try {
      isRefreshing = true;
      const token = await refreshToken();
      replayWaitingRequests(token);
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return this.instance(originalRequest);
    } catch (refreshError) {
      requestLifecycle.finish(originalRequest);
      rejectWaitingRequests(refreshError);
      logout();
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  },
);
```

### 4. 取消请求（基于 AbortController）

新版 Axios 推荐使用 `AbortController`，不再优先使用 `CancelToken`。

- 单个请求取消
- 重复请求取消（pendingMap，结合拦截器实现）
- 全部请求取消（路由切换场景）

#### 4.1 单个请求取消

```ts
const controller = new AbortController();

http.get<User[]>("/users", {
  signal: controller.signal,
});

controller.abort();
```

#### 4.2 重复请求取消

重复请求取消适合搜索、筛选等只关心最新结果的场景。写请求即使在客户端取消，也可能已经被服务端处理，不能把它当作防止重复提交的唯一手段。

```ts
type PendingRequest = {
  controller: AbortController;
  signal: AbortSignal;
};

const pendingMap = new Map<string, PendingRequest>();

function addPendingRequest(config: AdvancedRequestConfig) {
  const requestKey = config.__requestMeta?.requestKey;
  if (!requestKey) {
    return;
  }

  pendingMap.get(requestKey)?.controller.abort();

  const controller = new AbortController();
  const signal = config.signal
    ? AbortSignal.any([config.signal, controller.signal])
    : controller.signal;

  config.signal = signal;
  pendingMap.set(requestKey, { controller, signal });
}

function removePendingRequest(config: AdvancedRequestConfig) {
  const requestKey = config.__requestMeta?.requestKey;
  if (!requestKey) {
    return;
  }

  // 被取消的旧请求稍后进入错误分支时，不能删除已经登记的新请求。
  if (pendingMap.get(requestKey)?.signal === config.signal) {
    pendingMap.delete(requestKey);
  }
}
```

请求准备和 pending 登记放在同一个请求拦截器中，避免多个请求拦截器的执行顺序影响结果：

```ts
this.instance.interceptors.request.use((config: InternalRequestConfig) => {
  // 此前仍可保留 token、公共参数等基础处理。
  const preparedConfig = requestLifecycle.prepare(config);
  addPendingRequest(preparedConfig as AdvancedRequestConfig);
  return preparedConfig;
});

this.instance.interceptors.response.use(
  (response) => {
    removePendingRequest(response.config);
    return response;
  },
  (error) => {
    if (error.config) {
      removePendingRequest(error.config);
    }

    return Promise.reject(error);
  },
);
```

#### 4.3 全部请求取消

全部取消通常用于路由切换、退出登录、关闭页面级弹窗等场景。

```ts
function cancelAllRequests() {
  pendingMap.forEach(({ controller }) => controller.abort());
  pendingMap.clear();
}
```

注意事项：

1. 取消请求只是不再接收客户端响应，不代表服务端一定停止处理。
2. 取消异常需要单独识别，避免显示成普通错误。
3. 批量取消要保证幂等，重复调用不应该报错。

### 5. 可选增强

可选增强不要一开始就全部塞进基础封装。它们更适合在项目确实需要时按能力增量加入。

#### 5.1 接口缓存

接口缓存适合低频变化的数据，例如字典、配置项、静态枚举。缓存 key 可以复用请求标识。

```ts
const cacheMap = new Map<string, { expireAt: number; data: unknown }>();

function getCache<T>(key: string): T | undefined {
  const cached = cacheMap.get(key);
  if (!cached || cached.expireAt < Date.now()) {
    cacheMap.delete(key);
    return undefined;
  }

  return cached.data as T;
}

function setCache(key: string, data: unknown, ttl = 60_000) {
  cacheMap.set(key, {
    data,
    expireAt: Date.now() + ttl,
  });
}
```

#### 5.2 失败重试

重试适合网络抖动、幂等 GET 请求、短暂服务不可用。不要默认重试非幂等写请求。

```ts
async function retry<T>(task: () => Promise<T>, max = 2): Promise<T> {
  let lastError: unknown;

  for (let index = 0; index <= max; index += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
```

#### 5.3 上传 / 下载（进度回调）

上传和下载通常需要单独暴露方法，因为它们的响应类型、进度事件和错误提示方式不同于普通 JSON 请求。

```ts
function upload<T>(url: string, file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData();
  formData.append("file", file);

  return http.post<T, FormData>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress(event) {
      if (event.total) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
}
```

### 参考资料

> [Juejin: Axios 封装方案](https://juejin.cn/post/7124573626161954823)
>
> [blog/docs/ts/axios.md at master · kvchen95/blog](https://github.com/kvchen95/blog/blob/master/docs/ts/axios.md)
>
> [基于 Axios 封装一个完美的双 token 无感刷新 - 掘金](https://juejin.cn/post/7271139265442021391)
>
> <https://mp.weixin.qq.com/s/7ZjF2ZtDShC9UiWOTjxm4Q>
>
> <https://mp.weixin.qq.com/s/LHDd3Tol0JIORdMfFpZKaA>
