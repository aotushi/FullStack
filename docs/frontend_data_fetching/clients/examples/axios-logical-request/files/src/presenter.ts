import { ApiEnvelopeFormatError, HttpError, type RequestError } from "./errors";

// 使用位置：http.ts 传给 createHttpClient 的 onError 回调。
// 此处收到的 error 已经是 RequestError，可以直接按稳定分类生成提示文案。
export function presentApiError(error: RequestError): string {
  if (error instanceof ApiEnvelopeFormatError) {
    return "响应格式异常，请稍后重试";
  }

  switch (error.kind) {
    case "cancel":
      return "请求已取消";
    case "timeout":
      return "请求超时，请稍后重试";
    case "network":
      return "网络连接失败，请检查网络";
    case "configuration":
      return "请求配置异常，请联系管理员";
    case "unknown":
      return "请求失败，请稍后重试";
    case "http":
      // 5xx 必须先拦截，不能把服务端内部故障信息展示给用户。
      if ((error.status ?? 0) >= 500) return "服务暂时不可用，请稍后重试";
      if (error.presentationHint) return error.presentationHint;
      if (error.status === 401) return "登录状态已失效，请重新登录";
      if (error.status === 403) return "没有权限执行此操作";
      if (error.status === 404) return "请求的内容不存在";
      if (error.status === 429) return "操作过于频繁，请稍后再试";
      return `请求未能完成（HTTP ${error.status ?? "未知"}）`;
  }
}

// 使用位置：main.ts 的页面 catch(error)。
// catch 变量是 unknown：属于本封装时复用 presentApiError，否则返回安全兜底。
export function presentRequestError(error: unknown, fallback = "请求失败，请稍后重试"): string {
  if (error instanceof ApiEnvelopeFormatError || error instanceof HttpError) {
    return presentApiError(error);
  }

  return fallback;
}
