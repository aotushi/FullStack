import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export interface User {
  id: string;
  name: string;
}

export interface ApiEnvelope<Data> {
  code: number;
  message: string;
  data: Data;
}

function unwrapApiEnvelope<Data>(body: unknown): Data {
  if (
    typeof body !== "object" ||
    body === null ||
    !("code" in body) ||
    !("message" in body) ||
    !("data" in body)
  ) {
    throw new Error("响应格式错误：期望 { code, message, data }，请检查接口或 Mock 是否生效。");
  }

  return (body as ApiEnvelope<Data>).data;
}

// 新增
class HttpClient {
  constructor(private readonly instance: AxiosInstance) {}

  async request<Result>(config: AxiosRequestConfig): Promise<Result> {
    const response = await this.instance.request<unknown>(config);
    return unwrapApiEnvelope<Result>(response.data);
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

export function loadUser() {
  return http.get<User>("/users/1");
}
