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

/*
与阶段三相同：如果另一个后端返回 { ok: true, result: User }，只替换本文件的协议和取值：

interface ApiEnvelope<Data> {
  ok: boolean;
  result: Data;
}

const envelope = response.data as ApiEnvelope<unknown>;
response.data = envelope.result;
*/
