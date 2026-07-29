/**
 * 协议适配器：把后端 `{ code, message, data }` 的信封拆掉，让业务代码直接拿到 data。
 *
 * 这是「通用 Axios 核心」和「本项目协议」之间的分界线。核心不知道信封长什么样，
 * 换一个后端只需要改这个文件。
 *
 * 读这个文件请特别注意一件事：`code` 被解析出来了，却从头到尾没有参与「成功还是
 * 失败」的判断。判定权只在 HTTP 状态码手里，`code` 只是元数据。很多封装在这里
 * 写成 `if (code !== 0) throw`，于是同一个失败有两套并存的表达方式，上层每次都要
 * 猜该看哪一个——这里刻意不那么做。
 */

import {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { ApiEnvelopeFormatError } from "../errors";

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

export interface ApiEnvelopeBehavior {
  __rawResponse?: boolean;
}

type ApiEnvelopeRequestConfig = InternalAxiosRequestConfig &
  ApiEnvelopeBehavior;

// 只认结构，不认取值：`code` 和 `message` 的类型对得上就算一个信封。
// `hasData` 单独记一笔，是因为 `data: null` 和「压根没有 data 字段」要区分开——
// 前者是合法的空数据，后者说明响应根本不是本项目的协议格式。
export function readApiEnvelope(
  value: unknown,
): ParsedApiEnvelope | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as Partial<ApiEnvelope<unknown>>;
  if (
    typeof candidate.code !== "number" ||
    typeof candidate.message !== "string"
  ) {
    return undefined;
  }

  return {
    code: candidate.code,
    message: candidate.message,
    data: candidate.data,
    hasData: "data" in candidate,
  };
}

export function installApiEnvelopeAdapter(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use((response) => {
    // 由 client.ts 的 raw() 打上，调用方要拿完整 response 时跳过解包。
    const config = response.config as ApiEnvelopeRequestConfig;
    if (config.__rawResponse) {
      return response;
    }

    // 204 按约定没有响应体，不能拿它去套信封格式，否则每个删除接口都会报协议错误。
    if (response.status === 204) {
      response.data = undefined;
      return response;
    }

    // 到这里 HTTP 状态已经是成功了，响应体却不是信封——这是后端违约或者请求打到了
    // 网关、登录页之类的地方。它不是业务失败，所以单独一个错误类型，不走 HttpError
    // 那套分类。
    const envelope = readApiEnvelope(response.data);
    if (!envelope?.hasData) {
      throw new ApiEnvelopeFormatError(response.status, response.data);
    }

    response.data = envelope.data;
    return response;
  });
}
