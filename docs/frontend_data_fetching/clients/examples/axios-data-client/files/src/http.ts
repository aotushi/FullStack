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

// 新增
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

export function loadUser() {
  return http.get<User>("/users/1");
}
