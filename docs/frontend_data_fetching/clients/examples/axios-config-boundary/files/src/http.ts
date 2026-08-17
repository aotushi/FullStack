import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type CreateAxiosDefaults,
} from "axios";
import { installApiEnvelopeAdapter } from "./envelope";

export interface User {
  id: string;
  name: string;
}

// 阶段三进阶新增一：只开放单次请求真正需要的 Axios 配置。
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

// 阶段三进阶新增二：实例的固定策略只在创建客户端时传入。
export interface CreateHttpClientOptions {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
}

function createAxiosDefaults(options: CreateHttpClientOptions): CreateAxiosDefaults {
  return {
    // 所有业务请求共享同一个后端入口。
    baseURL: options.baseURL,

    // 公共默认超时；单次请求仍可通过白名单覆盖。
    timeout: options.timeout ?? 10_000,

    // 绝对 URL 不能直接替换 baseURL；真正的 URL 校验在 execute() 中完成。
    allowAbsoluteUrls: false,

    // 跨站 Cookie 策略由客户端统一决定，不允许页面按请求修改。
    withCredentials: options.withCredentials ?? false,
  };
}

class HttpClient {
  constructor(private readonly instance: AxiosInstance) {}

  // 阶段三仍然返回 response.data，只把参数类型换成上面的白名单。
  async request<Result, Body = unknown>(config: HttpRequestConfig<Body>): Promise<Result> {
    const response = await this.instance.request<Result, AxiosResponse<Result, Body>, Body>(config);

    return response.data;
  }

  get<Result>(url: string, config?: HttpRequestConfig) {
    return this.request<Result>({ ...config, method: "get", url });
  }

  post<Result, Body = unknown>(url: string, data?: Body, config?: HttpRequestConfig<Body>) {
    return this.request<Result, Body>({ ...config, data, method: "post", url });
  }
}

export function createHttpClient(options: CreateHttpClientOptions) {
  const instance = axios.create(createAxiosDefaults(options));
  // 阶段三的响应适配器原样保留。
  installApiEnvelopeAdapter(instance);
  return new HttpClient(instance);
}

export const http = createHttpClient({
  baseURL: "/api",
  timeout: 10_000,
  withCredentials: false,
});

export function loadUser() {
  return http.get<User>("/users/1", {
    headers: { "x-example": "config-boundary" },
    params: { source: "profile" },
    signal: new AbortController().signal,
  });
}
