import type { AxiosInstance } from "axios";

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

export function installApiEnvelopeAdapter(instance: AxiosInstance) {
  instance.interceptors.response.use((response) => {
    response.data = unwrapApiEnvelope(response.data);
    return response;
  });
}

/*
如果另一个后端返回的是：

{
  "ok": true,
  "result": { "id": "1", "name": "Ada" }
}

只需要把本文件替换为下面的协议和取值方式。HttpClient、loadUser() 和页面都不需要修改。

interface ApiEnvelope<Data> {
  ok: boolean;
  result: Data;
}

function unwrapApiEnvelope<Data>(body: unknown): Data {
  if (typeof body !== "object" || body === null || !("ok" in body) || !("result" in body)) {
    throw new Error("响应格式错误：期望 { ok, result }。");
  }

  return (body as ApiEnvelope<Data>).result;
}

export function installApiEnvelopeAdapter(instance: AxiosInstance) {
  instance.interceptors.response.use((response) => {
    response.data = unwrapApiEnvelope(response.data);
    return response;
  });
}
*/
