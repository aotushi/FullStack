import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { installApiEnvelopeAdapter } from "./envelope";

export interface User {
  id: string;
  name: string;
}

class HttpClient {
  constructor(private readonly instance: AxiosInstance) {}

  async request<Result>(config: AxiosRequestConfig): Promise<Result> {
    const response = await this.instance.request<Result>(config);
    return response.data;
  }

  get<Result>(url: string, config?: AxiosRequestConfig) {
    return this.request<Result>({ ...config, method: "get", url });
  }
}

const transport = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

installApiEnvelopeAdapter(transport);

export const http = new HttpClient(transport);

export function loadUser() {
  return http.get<User>("/users/1");
}
