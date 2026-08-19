import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type CreateAxiosDefaults,
} from "axios";
import { installApiEnvelopeAdapter, readApiErrorMessage } from "./envelope";
import {
  ApiEnvelopeFormatError,
  HttpError,
  normalizeRequestError,
  type RequestError,
} from "./errors";
import { presentApiError } from "./presenter";

export interface User {
  id: string;
  name: string;
}

type UserRequest = "normal" | "fast" | "slow" | "failure";
export type ErrorMode = "global" | "silent";

type AllowedAxiosConfigKey =
  | "data"
  | "headers"
  | "method"
  | "onDownloadProgress"
  | "onUploadProgress"
  | "params"
  | "responseType"
  | "signal"
  | "timeout"
  | "url";

export interface ErrorBehavior {
  // 本封装的单次请求行为，不属于 AxiosRequestConfig。
  errorMode?: ErrorMode;
}

export interface LoadingBehavior {
  showLoading?: boolean;
}

export type HttpRequestConfig<Body = unknown> = Pick<
  AxiosRequestConfig<Body>,
  AllowedAxiosConfigKey
> &
  ErrorBehavior &
  LoadingBehavior;

export interface CreateHttpClientOptions {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  // 创建客户端时接入界面提示和监控；页面请求不能替换它们。
  onError?: (error: RequestError) => unknown;
  onReport?: (error: RequestError) => unknown;
  onLoadingChange?: (active: boolean) => void;
}

function createAxiosDefaults(options: CreateHttpClientOptions): CreateAxiosDefaults {
  return {
    baseURL: options.baseURL,
    timeout: options.timeout ?? 10_000,
    allowAbsoluteUrls: false,
    withCredentials: options.withCredentials ?? false,
    // 让 Axios 用 ETIMEDOUT 标记超时，供 errors.ts 稳定分类。
    transitional: { clarifyTimeoutError: true },
  };
}

function isAbsoluteUrl(url: string | undefined) {
  return Boolean(url && (/^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith("//")));
}

function invokeErrorCallback(
  callback: ((error: RequestError) => unknown) | undefined,
  error: RequestError,
) {
  try {
    void Promise.resolve(callback?.(error)).catch(() => undefined);
  } catch {
    // 提示或上报组件自己的故障不能替换原始请求错误。
  }
}

class HttpClient {
  private loadingCount = 0;

  constructor(
    private readonly instance: AxiosInstance,
    private readonly options: CreateHttpClientOptions,
  ) {}

  private startLoading() {
    this.loadingCount += 1;
    if (this.loadingCount === 1) this.options.onLoadingChange?.(true);
  }

  private stopLoading() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) this.options.onLoadingChange?.(false);
  }

  private notifyFailure(error: RequestError, errorMode: ErrorMode) {
    if (error instanceof HttpError && error.kind === "cancel") return;

    invokeErrorCallback(this.options.onReport, error);
    if (errorMode !== "silent") invokeErrorCallback(this.options.onError, error);
  }

  request<Result, Body = unknown>(config: HttpRequestConfig<Body>): Promise<Result> {
    return this.execute<Result, Body>(config);
  }

  private async execute<Result, Body = unknown>(config: HttpRequestConfig<Body>): Promise<Result> {
    const { errorMode = "global", showLoading = false, ...axiosConfig } = config;

    if (showLoading) this.startLoading();

    try {
      try {
        if (isAbsoluteUrl(axiosConfig.url)) {
          throw new HttpError({
            kind: "configuration",
            message: "Absolute request URLs are not allowed",
          });
        }

        const response = await this.instance.request<Result, AxiosResponse<Result, Body>, Body>(
          axiosConfig,
        );
        return response.data;
      } catch (cause) {
        const error = normalizeRequestError(cause, {
          readErrorMessage: readApiErrorMessage,
        });
        this.notifyFailure(error, errorMode);
        throw error;
      }
    } finally {
      if (showLoading) this.stopLoading();
    }
  }

  get<Result>(url: string, config?: HttpRequestConfig) {
    return this.request<Result>({ ...config, method: "get", url });
  }

  post<Result, Body = unknown>(url: string, data?: Body, config?: HttpRequestConfig<Body>) {
    return this.request<Result, Body>({ ...config, data, method: "post", url });
  }
}

export function createHttpClient(options: CreateHttpClientOptions) {
  const instance = axios.create(createAxiosDefaults(options));
  installApiEnvelopeAdapter(instance);
  return new HttpClient(instance, options);
}

const requestEvents: string[] = [];

export const http = createHttpClient({
  baseURL: "/api",
  timeout: 2_000,
  withCredentials: false,
  onLoadingChange(active) {
    requestEvents.push(`Loading：${active ? "打开" : "关闭"}`);
  },
  onError(error) {
    // onError 收到的已经是 RequestError，因此直接使用精确的展示入口。
    requestEvents.push(`全局提示：${presentApiError(error)}`);
  },
  onReport(error) {
    const label = error instanceof ApiEnvelopeFormatError ? "protocol" : error.kind;
    requestEvents.push(`错误上报：${label}`);
  },
});

const requestPath: Record<UserRequest, string> = {
  normal: "/users/1",
  fast: "/users/fast",
  slow: "/users/slow",
  failure: "/users/failure",
};

export function resetRequestEvents() {
  requestEvents.length = 0;
}

export function readRequestEvents() {
  return [...requestEvents];
}

export function loadUser(request: UserRequest) {
  return http.get<User>(requestPath[request], { showLoading: true });
}
