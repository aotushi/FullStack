/**
 * 错误文案适配器：整个封装里**唯一**写用户可见文字的地方。
 *
 * errors.ts 只给分类，这里把分类翻成人话。这条分界线的价值在于：换语言、改文风、
 * 接入 i18n，都只动这一个文件；反过来，产品同学要改一句提示，也不必碰传输层代码。
 *
 * 落在这里的每一句话都可以问一句「用户看完知道该干什么吗」——这也是为什么没有一句
 * 是「请求失败: Error: Network Error」这种把内部信息直接甩给用户的写法。
 */

import { readApiEnvelope } from "./envelope";
import {
  ApiEnvelopeFormatError,
  type HttpError,
} from "../errors";

export function readApiErrorMessage(payload: unknown) {
  return readApiEnvelope(payload)?.message;
}

export function presentApiError(
  error: HttpError | ApiEnvelopeFormatError,
) {
  if (error instanceof ApiEnvelopeFormatError) {
    return "接口返回格式异常，请稍后重试";
  }

  // switch 不写 default，让 TypeScript 在 HttpErrorKind 新增成员时直接报错，
  // 而不是让那个新分类悄悄落到一句通用文案上。
  switch (error.kind) {
    case "cancel":
      return "请求已取消";
    case "timeout":
      return "请求超时，请稍后重试";
    case "network":
      return "网络异常，请检查连接后重试";
    case "configuration":
      return "请求配置错误，请联系管理员";
    case "unknown":
      return "请求失败，请稍后重试";
    case "http":
      // 顺序有讲究。5xx 的判断放在最前面，因为它要**盖住**服务端文案：后端 500 时
      // 吐出来的经常是堆栈或网关英文页，不能直接给用户看。
      if ((error.status ?? 0) >= 500) {
        return "服务暂时不可用，请稍后重试";
      }
      // 4xx 才优先用服务端文案。「手机号已被注册」这种话只有后端说得准，前端穷举
      // 不完，所以有就用。
      if (error.presentationHint) {
        return error.presentationHint;
      }
      // 后端没给文案时，才轮到前端按状态码兜底。
      if (error.status === 403) {
        return "无权执行此操作";
      }
      if (error.status === 404) {
        return "请求的资源不存在";
      }
      if (error.status === 429) {
        return "请求过于频繁，请稍后重试";
      }
      return `请求失败（HTTP ${error.status ?? "未知"}）`;
  }
}
