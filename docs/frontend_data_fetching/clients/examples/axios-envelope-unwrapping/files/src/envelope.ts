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

export function installApiEnvelopeAdapter(instance: AxiosInstance) {
  instance.interceptors.response.use((response) => {
    const envelope = response.data as ApiEnvelope<unknown>;
    response.data = envelope.result;
    return response;
  });
}
*/
