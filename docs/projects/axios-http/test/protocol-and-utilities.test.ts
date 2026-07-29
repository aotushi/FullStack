import axios from "axios";
import { describe, expect, it, vi } from "vitest";

import {
  presentApiError,
  readApiErrorMessage,
} from "../src/api/http/adapters/error-presenter";
import {
  ApiEnvelopeFormatError,
  assignRequestErrorContext,
  HttpError,
  normalizeHttpError,
} from "../src/api/http/errors";
import * as publicHttpEntry from "../src/api/http/index";
import { retry } from "../src/api/http/retry";
import { readDownloadFilename } from "../src/api/http/transfer";

describe("application HTTP entry", () => {
  it("exposes only the configured http instance", () => {
    expect(Object.keys(publicHttpEntry)).toEqual(["http"]);
  });
});

describe("response protocol", () => {
  it("keeps developer descriptions in the core and user copy in the presenter", async () => {
    const error = await normalizeHttpError(
      new axios.AxiosError("offline", "ERR_NETWORK"),
    );

    expect(error.message).toBe("Network request failed");
    expect(presentApiError(error)).toBe("网络异常，请检查连接后重试");
  });

  it("keeps all user-facing fallback copy inside the presenter", async () => {
    const timeout = await normalizeHttpError(
      new axios.AxiosError("slow", "ETIMEDOUT"),
    );
    const canceled = await normalizeHttpError(
      new axios.CanceledError("left page"),
    );
    const server = await normalizeHttpError({
      isAxiosError: true,
      response: {
        status: 503,
        data: { internal: "do not display" },
      },
    });
    const unknown = await normalizeHttpError(new Error("boom"));
    const format = new ApiEnvelopeFormatError(200, { broken: true });

    expect([
      timeout.message,
      canceled.message,
      server.message,
      unknown.message,
      format.message,
    ]).toEqual([
      "Request timed out",
      "Request canceled",
      "HTTP request failed with status 503",
      "Unknown request failure",
      "API response does not match the expected envelope",
    ]);
    expect([
      presentApiError(timeout),
      presentApiError(canceled),
      presentApiError(server),
      presentApiError(unknown),
      presentApiError(format),
    ]).toEqual([
      "请求超时，请稍后重试",
      "请求已取消",
      "服务暂时不可用，请稍后重试",
      "请求失败，请稍后重试",
      "接口返回格式异常，请稍后重试",
    ]);
  });

  it("keeps malformed response data out of default error serialization", () => {
    const responseData = {
      secret: "PII-IN-BODY",
    };
    const error = new ApiEnvelopeFormatError(200, responseData);

    expect(error.responseData).toBe(responseData);
    expect(Object.keys(error)).not.toContain("responseData");
    expect(JSON.stringify(error)).not.toContain("PII-IN-BODY");
  });

  it("keeps server-provided display copy out of default error serialization", async () => {
    const error = await normalizeHttpError(
      {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            code: 40010,
            message: "字段 idCard=110101199001011234 校验失败",
            data: null,
          },
        },
      },
      { readErrorMessage: readApiErrorMessage },
    );
    const contextual = assignRequestErrorContext(error, {
      method: "POST",
      path: "/users",
      attempts: 1,
      elapsedMs: 12,
      origin: "business",
    });

    expect(error.presentationHint).toBe(
      "字段 idCard=110101199001011234 校验失败",
    );
    // 写入请求上下文后展示文案仍可用，但依然不进入默认序列化
    expect(presentApiError(contextual)).toBe(
      "字段 idCard=110101199001011234 校验失败",
    );
    expect(Object.keys(error)).not.toContain("presentationHint");
    expect(JSON.stringify(error)).not.toContain("110101199001011234");
    expect(JSON.stringify(contextual)).not.toContain("110101199001011234");
  });

  it("writes the request context into the original error instead of rebuilding it", async () => {
    const cause = {
      isAxiosError: true,
      response: { status: 500, data: null },
    };
    const httpError = await normalizeHttpError(cause);
    const responseData = { broken: true };
    const formatError = new ApiEnvelopeFormatError(200, responseData);
    const context = {
      method: "GET",
      path: "/report",
      attempts: 2,
      elapsedMs: 34,
      origin: "business",
    } as const;

    // 重建会换掉对象身份，任何按身份建立的关联（WeakSet、WeakMap）都会失效，
    // 而且每新增一个载荷字段都要在重建处补一次拷贝，漏掉就是静默丢失。
    expect(assignRequestErrorContext(httpError, context)).toBe(httpError);
    expect(assignRequestErrorContext(formatError, context)).toBe(formatError);
    expect(httpError.cause).toBe(cause);
    expect(formatError.responseData).toBe(responseData);

    // 请求上下文属于安全字段，必须留在默认序列化里供上报使用。
    expect(JSON.parse(JSON.stringify(httpError))).toMatchObject(context);
    expect(JSON.parse(JSON.stringify(formatError))).toMatchObject(context);
  });

  it("reads an API error carried by a Blob response", async () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: new Blob(
          [
            JSON.stringify({
              code: 40012,
              message: "文件格式错误",
              data: null,
            }),
          ],
          { type: "application/json" },
        ),
      },
    };

    const normalized = await normalizeHttpError(error, {
      readErrorMessage: readApiErrorMessage,
    });

    expect(normalized).toMatchObject({
        kind: "http",
        status: 400,
        message: "HTTP request failed with status 400",
      });
    expect(presentApiError(normalized)).toBe("文件格式错误");
  });

  it("classifies client-side failures and preserves their original cause", async () => {
    const failures = [
      {
        error: new axios.AxiosError("offline", "ERR_NETWORK"),
        kind: "network",
      },
      {
        error: new axios.AxiosError("slow", "ETIMEDOUT"),
        kind: "timeout",
      },
      {
        error: new axios.CanceledError("left page"),
        kind: "cancel",
      },
      {
        error: new Error("unexpected"),
        kind: "unknown",
      },
    ] as const;

    for (const { error, kind } of failures) {
      const normalized = await normalizeHttpError(error);
      expect(normalized.kind).toBe(kind);
      expect(normalized.cause).toBe(error);
    }
  });

  it("separates Axios configuration failures from network and unknown failures", async () => {
    const badOption = new axios.AxiosError(
      "bad option",
      axios.AxiosError.ERR_BAD_OPTION,
    );
    const invalidUrl = new axios.AxiosError(
      "invalid URL",
      axios.AxiosError.ERR_INVALID_URL,
    );
    const unclassified = new axios.AxiosError(
      "adapter failed",
      "ERR_UNCLASSIFIED",
    );

    const configuration = await normalizeHttpError(badOption);
    const invalidConfiguration = await normalizeHttpError(invalidUrl);
    const unknown = await normalizeHttpError(unclassified);

    expect(configuration).toMatchObject({
      kind: "configuration",
      message: "Request configuration failed",
      cause: badOption,
    });
    expect(invalidConfiguration.kind).toBe("configuration");
    expect(unknown.kind).toBe("unknown");
    expect(presentApiError(configuration)).toBe(
      "请求配置错误，请联系管理员",
    );
    expect(Object.keys(configuration)).not.toContain("cause");
  });
});

describe("retry", () => {
  it("retries temporary failures up to the configured limit", async () => {
    const task = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(
        new HttpError({ kind: "network", message: "offline" }),
      )
      .mockRejectedValueOnce(
        new HttpError({ kind: "http", status: 503, message: "busy" }),
      )
      .mockResolvedValue("ok");

    await expect(retry(task, { retries: 2, baseDelay: 1 })).resolves.toBe("ok");
    expect(task).toHaveBeenCalledTimes(3);
  });

  it("does not start a retry wait that would overrun the total budget", async () => {
    const task = vi.fn(async () => {
      throw new HttpError({ kind: "network", message: "offline" });
    });

    const startedAt = Date.now();
    await expect(
      retry(task, { retries: 5, baseDelay: 40, totalTimeoutMs: 250 }),
    ).rejects.toMatchObject({ kind: "network" });
    const elapsed = Date.now() - startedAt;

    // 无预算时会跑满 6 次尝试、约 1.2 秒退避
    expect(task.mock.calls.length).toBeLessThan(6);
    expect(elapsed).toBeLessThan(600);
  });

  it("stops a retry wait when its signal is aborted", async () => {
    const controller = new AbortController();
    const task = vi.fn(async () => {
      throw new HttpError({ kind: "network", message: "offline" });
    });
    const result = retry(task, {
      retries: 2,
      baseDelay: 100,
      signal: controller.signal,
    });

    controller.abort("left page");

    await expect(result).rejects.toMatchObject({
      kind: "cancel",
      message: "Request canceled",
    });
    expect(task).toHaveBeenCalledTimes(1);
  });
});

describe("file transfer utilities", () => {
  it("prefers UTF-8 filenames and removes unsafe path characters", () => {
    expect(
      readDownloadFilename(
        "attachment; filename*=UTF-8''%E6%9C%88%E6%8A%A5%2F2026.xlsx",
      ),
    ).toBe("月报_2026.xlsx");
  });

  it("uses a safe fallback when no filename is returned", () => {
    expect(readDownloadFilename(undefined, "../report.csv")).toBe("_report.csv");
  });
});
