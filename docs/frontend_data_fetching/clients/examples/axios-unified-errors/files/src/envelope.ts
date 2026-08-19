import type { AxiosInstance } from "axios";
import { ApiEnvelopeFormatError } from "./errors";

export interface ApiEnvelope<Data> {
  code: number;
  message: string;
  data: Data;
}

export interface ParsedApiEnvelope {
  code: number;
  message: string;
  data?: unknown;
  hasData: boolean;
}

// 协议结构只在本文件校验，HttpClient 不需要认识 { code, message, data }。
export function readApiEnvelope(value: unknown): ParsedApiEnvelope | undefined {
  if (!value || typeof value !== "object") return undefined;

  const candidate = value as Partial<ApiEnvelope<unknown>>;
  if (typeof candidate.code !== "number" || typeof candidate.message !== "string") {
    return undefined;
  }

  return {
    code: candidate.code,
    message: candidate.message,
    data: candidate.data,
    hasData: "data" in candidate,
  };
}

// 只有协议适配器知道本项目的错误响应里，哪一个字段可以作为候选展示文案。
export function readApiErrorMessage(payload: unknown) {
  return readApiEnvelope(payload)?.message;
}

export function installApiEnvelopeAdapter(instance: AxiosInstance) {
  instance.interceptors.response.use((response) => {
    const envelope = readApiEnvelope(response.data);
    if (!envelope?.hasData) throw new ApiEnvelopeFormatError();

    response.data = envelope.data;
    return response;
  });
}
