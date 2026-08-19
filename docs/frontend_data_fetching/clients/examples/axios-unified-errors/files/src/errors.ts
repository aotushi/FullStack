import axios from "axios";

const AXIOS_CONFIGURATION_CODES = new Set([
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ERR_DEPRECATED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
  "ERR_FORM_DATA_DEPTH_EXCEEDED",
]);

export type HttpErrorKind = "http" | "network" | "timeout" | "cancel" | "configuration" | "unknown";

export class ApiEnvelopeFormatError extends Error {
  readonly name = "ApiEnvelopeFormatError";

  constructor() {
    super("API response does not match the expected envelope");
  }
}

export interface HttpErrorOptions {
  kind: HttpErrorKind;
  message: string;
  status?: number;
  presentationHint?: string;
  cause?: unknown;
}

// 服务端文案可能包含用户数据：允许展示层读取，但不让 JSON.stringify(error) 默认带走。
const presentationHints = new WeakMap<HttpError, string>();

export class HttpError extends Error {
  readonly name = "HttpError";
  readonly kind: HttpErrorKind;
  readonly status?: number;

  get presentationHint() {
    return presentationHints.get(this);
  }

  constructor(options: HttpErrorOptions) {
    super(options.message, { cause: options.cause });
    this.kind = options.kind;
    this.status = options.status;
    if (options.presentationHint !== undefined) {
      presentationHints.set(this, options.presentationHint);
    }
  }
}

export type RequestError = ApiEnvelopeFormatError | HttpError;

export interface NormalizeRequestErrorOptions {
  readErrorMessage?: (payload: unknown, status: number) => string | undefined;
}

export function normalizeRequestError(
  error: unknown,
  options: NormalizeRequestErrorOptions = {},
): RequestError {
  if (error instanceof ApiEnvelopeFormatError || error instanceof HttpError) {
    return error;
  }

  // 取消也可能带 ECONNABORTED，所以必须先于超时判断。
  if (axios.isCancel(error)) {
    return new HttpError({
      kind: "cancel",
      message: "Request was canceled",
      cause: error,
    });
  }

  if (!axios.isAxiosError(error)) {
    return new HttpError({
      kind: "unknown",
      message: "Unknown request failure",
      cause: error,
    });
  }

  const code = error.code?.toUpperCase();
  if (code === "ECONNABORTED" || code === "ETIMEDOUT") {
    return new HttpError({
      kind: "timeout",
      message: "Request timed out",
      cause: error,
    });
  }

  if (error.response) {
    const status = error.response.status;
    return new HttpError({
      kind: "http",
      message: `HTTP request failed with status ${status}`,
      status,
      // 4xx 是可修正的客户端或业务问题，服务端通常能给出更具体的操作提示。
      // 5xx 可能含内部故障信息，交给 presenter 使用固定安全文案。
      presentationHint:
        status >= 400 && status < 500
          ? options.readErrorMessage?.(error.response.data, status)
          : undefined,
      cause: error,
    });
  }

  if (AXIOS_CONFIGURATION_CODES.has(code ?? "")) {
    return new HttpError({
      kind: "configuration",
      message: "Request configuration failed",
      cause: error,
    });
  }

  if (code === "ERR_NETWORK") {
    return new HttpError({
      kind: "network",
      message: "Network request failed",
      cause: error,
    });
  }

  return new HttpError({
    kind: "unknown",
    message: "Unknown request failure",
    cause: error,
  });
}
