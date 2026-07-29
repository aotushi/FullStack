/**
 * HTTP 模块的对外门面：整个应用只从这里拿 `http` 实例和相关类型，不直接 import
 * ./client、./auth 这些内部文件。
 *
 * 想读懂实现，入口是 client.ts 的文件头——那里画了一次请求的完整路径。
 */

import { createHttpClient } from "./client";

// 类型和实例共用一个入口，调用方不需要记住哪个东西在哪个文件里。
// 类型导出没有运行时存在，所以本模块真正的运行时导出仍然只有 http 一个。
export type {
  CreateHttpClientOptions,
  ErrorBehavior,
  ErrorMode,
  HttpClient,
  HttpRequestConfig,
  HttpRetryOptions,
  LoadingBehavior,
  RetryBehavior,
} from "./client";
export type { AuthAdapter, AuthBehavior } from "./auth";

// 下面这段是接入示例，不是最终形态。实际项目里 baseURL 换成
// import.meta.env.VITE_API_BASE_URL，并把注释掉的四个回调按需接上 UI 和监控。
//
// onError 里的 presentApiError 是这套设计的分工体现：通用核心只产出稳定的错误分类，
// 一句用户文案都不写；文案全部由 adapters/error-presenter.ts 这个项目适配器决定。
export const http = createHttpClient({
  baseURL: "/api",
  timeout: 10_000,
  // 在实际项目入口中接入 UI 和监控：
  // showLoadingByDefault: false,
  // onLoadingChange: (active) => (active ? spin.show() : spin.hide()),
  // onError: (error) => message.error(presentApiError(error)),
  // onReport: (error) => reportHttpError({
  //   name: error.name,
  //   kind: "kind" in error ? error.kind : "protocol",
  //   status: error.status,
  //   method: error.method,
  //   path: error.path,
  //   attempts: error.attempts,
  //   elapsedMs: error.elapsedMs,
  //   origin: error.origin,
  //   originMethod: error.originMethod,
  //   originPath: error.originPath,
  // }),
});
