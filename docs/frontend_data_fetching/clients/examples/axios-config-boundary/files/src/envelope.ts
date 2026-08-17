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
与阶段三相同：如果另一个后端返回 { ok: true, result: User }，只替换本文件的协议和取值：

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

response.data = unwrapApiEnvelope(response.data);
*/
