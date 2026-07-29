import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";

import axios, { AxiosHeaders } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

import { type AuthAdapter } from "../src/api/http/auth";
import {
  createMemoryAuthSession,
  type AuthSession,
} from "../src/api/session";
import { createBearerAuthAdapter } from "../src/api/http/adapters/auth";
import { readApiEnvelope } from "../src/api/http/adapters/envelope";
import { presentApiError } from "../src/api/http/adapters/error-presenter";
import { createHttpClient } from "../src/api/http/client";
import {
  ApiEnvelopeFormatError,
  HttpError,
} from "../src/api/http/errors";
import { fetchFile } from "../src/api/http/transfer";

type TestHandler = (
  request: IncomingMessage,
  response: ServerResponse,
) => void | Promise<void>;

const openServers = new Set<Server>();

function sendJson(response: ServerResponse, status: number, body?: unknown) {
  response.statusCode = status;
  if (body === undefined) {
    response.end();
    return;
  }

  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify(body));
}

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function readBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function startServer(handler: TestHandler) {
  const server = createServer((request, response) => {
    Promise.resolve(handler(request, response)).catch((error: unknown) => {
      sendJson(response, 500, {
        message: error instanceof Error ? error.message : "test server failed",
      });
    });
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  openServers.add(server);

  const address = server.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}`;
}

function createTestAuth(baseURL: string, session: AuthSession) {
  return createBearerAuthAdapter({
    baseURL,
    getAccessToken: session.getAccessToken,
    setAccessToken: session.setAccessToken,
    expireSession() {
      session.clearSession();
      session.onExpired();
    },
    selectAccessToken(response) {
      const envelope = readApiEnvelope(response.data);
      const result = envelope?.data;
      if (
        !envelope?.hasData ||
        !result ||
        typeof result !== "object" ||
        !("accessToken" in result) ||
        typeof result.accessToken !== "string"
      ) {
        throw new ApiEnvelopeFormatError(response.status, response.data);
      }

      return result.accessToken;
    },
  });
}

afterEach(async () => {
  await Promise.all(
    [...openServers].map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
          server.closeAllConnections();
        }),
    ),
  );
  openServers.clear();
});

describe("core HTTP Interface", () => {
  it("unwraps successful envelopes and preserves request-body types", async () => {
    const baseURL = await startServer(async (request, response) => {
      const input = JSON.parse(await readBody(request)) as { name: string };
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: { id: 1, name: input.name },
      });
    });
    const http = createHttpClient({ baseURL });

    await expect(
      http.post<{ id: number; name: string }, { name: string }>("/users", {
        name: "Ada",
      }),
    ).resolves.toEqual({ id: 1, name: "Ada" });
  });

  it("uses the HTTP status for success and treats envelope code as metadata", async () => {
    const baseURL = await startServer((_request, response) => {
      sendJson(response, 200, {
        code: 40001,
        message: "metadata only",
        data: { id: 1 },
      });
    });
    const http = createHttpClient({ baseURL });

    await expect(http.get("/users/1")).resolves.toEqual({ id: 1 });
  });

  it("requires code, message, and data in a successful envelope", async () => {
    const baseURL = await startServer((request, response) => {
      const valid = {
        code: 0,
        message: "ok",
        data: true,
      };
      const missingField = request.url?.slice(9) as
        | "code"
        | "message"
        | "data";
      const body = { ...valid } as Partial<typeof valid>;
      delete body[missingField];
      sendJson(response, 200, body);
    });
    const http = createHttpClient({ baseURL });

    for (const field of ["code", "message", "data"]) {
      await expect(http.get(`/missing-${field}`)).rejects.toBeInstanceOf(
        ApiEnvelopeFormatError,
      );
    }
  });

  it("accepts null data and bypasses the envelope for 204 responses", async () => {
    const baseURL = await startServer((request, response) => {
      if (request.url === "/empty") {
        sendJson(response, 204);
        return;
      }

      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: null,
      });
    });
    const http = createHttpClient({ baseURL });

    await expect(http.get("/nullable")).resolves.toBeNull();
    await expect(http.delete<void>("/empty")).resolves.toBeUndefined();
  });

  it("does not retry a format error and reports it once", async () => {
    let requestCount = 0;
    const baseURL = await startServer((_request, response) => {
      requestCount += 1;
      sendJson(response, 200, {
        code: 0,
        message: "missing data",
      });
    });
    const onError = vi.fn();
    const onReport = vi.fn();
    const http = createHttpClient({ baseURL, onError, onReport });

    await expect(
      http.get("/broken", {
        retry: { retries: 2, baseDelayMs: 1 },
      }),
    ).rejects.toBeInstanceOf(ApiEnvelopeFormatError);
    expect(requestCount).toBe(1);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onReport).toHaveBeenCalledTimes(1);
    expect(onReport.mock.calls[0]?.[0]).toMatchObject({
      method: "GET",
      path: "/broken",
      attempts: 1,
    });
  });

  it("keeps raw response data and headers when the caller opts out of the protocol", async () => {
    const baseURL = await startServer((_request, response) => {
      response.statusCode = 200;
      response.setHeader("x-report-version", "7");
      response.end("raw report");
    });
    const http = createHttpClient({ baseURL });

    const response = await http.raw<string>({
      method: "get",
      url: "/report",
    });

    expect(response.data).toBe("raw report");
    expect(response.headers["x-report-version"]).toBe("7");
  });

  it("reports global errors once and leaves silent errors to the caller", async () => {
    const baseURL = await startServer((_request, response) => {
      sendJson(response, 500, {
        code: 50001,
        message: "temporary failure",
        data: null,
      });
    });
    const onError = vi.fn();
    const http = createHttpClient({ baseURL, onError });

    await expect(http.get("/global")).rejects.toBeInstanceOf(HttpError);
    await expect(
      http.get("/silent", { errorMode: "silent" }),
    ).rejects.toBeInstanceOf(HttpError);

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("keeps project protocol metadata out of generic HTTP errors", async () => {
    const baseURL = await startServer((_request, response) => {
      sendJson(response, 409, {
        code: 40001,
        message: "用户名已存在",
        data: null,
      });
    });
    const http = createHttpClient({ baseURL });

    const error = await http.get("/users").catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({
      kind: "http",
      status: 409,
      message: "HTTP request failed with status 409",
    });
    expect(presentApiError(error as HttpError)).toBe("用户名已存在");
    expect(error).not.toHaveProperty("businessCode");
    expect(error).not.toHaveProperty("details");
  });

  it("rejects absolute and protocol-relative business URLs before networking", async () => {
    let requestCount = 0;
    const baseURL = await startServer((_request, response) => {
      requestCount += 1;
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: true,
      });
    });
    const onError = vi.fn();
    const onReport = vi.fn();
    const http = createHttpClient({ baseURL, onError, onReport });

    const absoluteError = await http
      .get(`${baseURL}/absolute`, { errorMode: "silent" })
      .catch((error: unknown) => error);
    expect(absoluteError).toMatchObject({ kind: "configuration" });
    expect(absoluteError).toHaveProperty("cause");
    await expect(
      http.get("//example.test/protocol-relative", { errorMode: "silent" }),
    ).rejects.toMatchObject({ kind: "configuration" });
    expect(requestCount).toBe(0);
    expect(onError).not.toHaveBeenCalled();
    expect(onReport).toHaveBeenCalledTimes(2);
    expect(onReport.mock.calls.map(([error]) => error)).toEqual([
      expect.objectContaining({ path: "/absolute", attempts: 0 }),
      expect.objectContaining({ path: "/protocol-relative", attempts: 0 }),
    ]);
  });
});

describe("request control and logical loading", () => {
  it("retries an explicitly enabled safe read after a temporary failure", async () => {
    let requestCount = 0;
    const baseURL = await startServer((_request, response) => {
      requestCount += 1;
      if (requestCount < 3) {
        sendJson(response, 503, {
          code: 50300,
          message: "busy",
          data: null,
        });
        return;
      }

      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: "ready",
      });
    });
    const http = createHttpClient({ baseURL });

    await expect(
      http.get<string>("/report", {
        retry: { retries: 2, baseDelayMs: 1 },
      }),
    ).resolves.toBe("ready");
    expect(requestCount).toBe(3);
  });

  it("keeps one loading interval open for concurrent logical requests", async () => {
    let requestCount = 0;
    const baseURL = await startServer(async (_request, response) => {
      requestCount += 1;
      await delay(requestCount === 1 ? 60 : 10);
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: requestCount,
      });
    });
    const events: string[] = [];
    const http = createHttpClient({
      baseURL,
      onLoadingChange: (active) => events.push(active ? "open" : "close"),
    });

    const first = http.get("/slow", { showLoading: true });
    const second = http.get("/fast", { showLoading: true });

    await second;
    expect(events).toEqual(["open"]);
    await first;
    expect(events).toEqual(["open", "close"]);
  });

  it("supports a project loading default while allowing request overrides", async () => {
    const baseURL = await startServer((_request, response) => {
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: true,
      });
    });
    const events: string[] = [];
    const http = createHttpClient({
      baseURL,
      showLoadingByDefault: true,
      onLoadingChange: (active) => events.push(active ? "open" : "close"),
    });

    await http.get("/default");
    await http.get("/disabled", { showLoading: false });

    expect(events).toEqual(["open", "close"]);
  });

  it("closes loading after both failure and cancellation", async () => {
    const baseURL = await startServer(async (request, response) => {
      if (request.url === "/slow") {
        await delay(100);
        sendJson(response, 200, {
          code: 0,
          message: "ok",
          data: true,
        });
        return;
      }

      sendJson(response, 500, {
        code: 50000,
        message: "internal",
        data: null,
      });
    });
    const events: string[] = [];
    const http = createHttpClient({
      baseURL,
      onLoadingChange: (active) => events.push(active ? "open" : "close"),
    });

    await expect(
      http.get("/failed", { showLoading: true, errorMode: "silent" }),
    ).rejects.toMatchObject({ status: 500 });
    const controller = new AbortController();
    const canceled = http.get("/slow", {
      showLoading: true,
      signal: controller.signal,
    });
    controller.abort();
    await expect(canceled).rejects.toMatchObject({ kind: "cancel" });

    expect(events).toEqual(["open", "close", "open", "close"]);
  });

  it("sends two direct requests even when their method and URL are identical", async () => {
    let requestCount = 0;
    const baseURL = await startServer((_request, response) => {
      requestCount += 1;
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: true,
      });
    });
    const http = createHttpClient({ baseURL });

    await expect(
      Promise.all([http.get("/search"), http.get("/search")]),
    ).resolves.toEqual([true, true]);
    expect(requestCount).toBe(2);
  });

  it("does not send a request whose signal was already canceled", async () => {
    let requestCount = 0;
    const baseURL = await startServer((_request, response) => {
      requestCount += 1;
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: true,
      });
    });
    const controller = new AbortController();
    controller.abort("left page");
    const onError = vi.fn();
    const onReport = vi.fn();
    const http = createHttpClient({ baseURL, onError, onReport });

    await expect(
      http.get("/never-sent", { signal: controller.signal }),
    ).rejects.toMatchObject({ kind: "cancel" });
    expect(requestCount).toBe(0);
    expect(onError).not.toHaveBeenCalled();
    expect(onReport).not.toHaveBeenCalled();
  });

  it("keeps retry disabled by default and never retries writes or 4xx errors", async () => {
    const requestCounts = new Map<string, number>();
    const baseURL = await startServer((request, response) => {
      const url = request.url ?? "";
      requestCounts.set(url, (requestCounts.get(url) ?? 0) + 1);
      sendJson(response, url === "/client-error" ? 409 : 503, {
        code: 1,
        message: "failed",
        data: null,
      });
    });
    const http = createHttpClient({ baseURL });

    await expect(
      http.get("/default", { errorMode: "silent" }),
    ).rejects.toMatchObject({ status: 503 });
    await expect(
      http.post("/write", {}, {
        errorMode: "silent",
        retry: { retries: 2, baseDelayMs: 1 },
      }),
    ).rejects.toMatchObject({ status: 503 });
    await expect(
      http.get("/client-error", {
        errorMode: "silent",
        retry: { retries: 2, baseDelayMs: 1 },
      }),
    ).rejects.toMatchObject({ status: 409 });

    expect(Object.fromEntries(requestCounts)).toEqual({
      "/default": 1,
      "/write": 1,
      "/client-error": 1,
    });
  });

  it("reports only the final failure after retry exhaustion", async () => {
    let requestCount = 0;
    let reportedError: HttpError | ApiEnvelopeFormatError | undefined;
    const baseURL = await startServer((_request, response) => {
      requestCount += 1;
      sendJson(response, 503, {
        code: 50300,
        message: "internal details",
        data: null,
      });
    });
    const onError = vi.fn((error: HttpError | ApiEnvelopeFormatError) => {
      reportedError = error;
    });
    const onReport = vi.fn();
    const http = createHttpClient({ baseURL, onError, onReport });

    await expect(
      http.get("/temporary?token=must-not-leak", {
        retry: { retries: 2, baseDelayMs: 1 },
      }),
    ).rejects.toMatchObject({
      kind: "http",
      status: 503,
      message: "HTTP request failed with status 503",
    });
    expect(requestCount).toBe(3);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onReport).toHaveBeenCalledTimes(1);
    expect(onReport).toHaveBeenCalledWith(reportedError);
    expect(reportedError).toMatchObject({
      method: "GET",
      path: "/temporary",
      attempts: 3,
    });
    expect(reportedError?.elapsedMs).toBeGreaterThanOrEqual(0);
    expect(JSON.stringify(reportedError)).not.toContain("must-not-leak");
  });

  it("keeps reporting a failure when request-level display is silent", async () => {
    const baseURL = await startServer((_request, response) => {
      sendJson(response, 409, {
        code: 40900,
        message: "conflict",
        data: null,
      });
    });
    const onError = vi.fn();
    const onReport = vi.fn();
    const http = createHttpClient({ baseURL, onError, onReport });

    await expect(
      http.post("/users", {}, { errorMode: "silent" }),
    ).rejects.toMatchObject({ kind: "http", status: 409 });

    expect(onError).not.toHaveBeenCalled();
    expect(onReport).toHaveBeenCalledTimes(1);
  });

  it("preserves the request failure when display or report callbacks throw", async () => {
    const baseURL = await startServer((_request, response) => {
      sendJson(response, 500, {
        code: 50000,
        message: "internal",
        data: null,
      });
    });
    const onError = vi.fn(() => {
      throw new Error("display callback failed");
    });
    const onReport = vi.fn(() => {
      throw new Error("report callback failed");
    });
    const http = createHttpClient({ baseURL, onError, onReport });

    await expect(http.get("/failed")).rejects.toMatchObject({
      kind: "http",
      status: 500,
    });
    expect(onReport).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("cancels all currently active business requests", async () => {
    const baseURL = await startServer(async (_request, response) => {
      await delay(100);
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: true,
      });
    });
    const http = createHttpClient({ baseURL });
    const request = http.get("/slow", { errorMode: "silent" });

    http.cancelAll();

    await expect(request).rejects.toMatchObject({ kind: "cancel" });
  });

});

describe("file transfer integration", () => {
  it("supports a POST export through the Axios Blob path", async () => {
    let receivedMethod: string | undefined;
    let receivedBody: string | undefined;
    const baseURL = await startServer(async (request, response) => {
      receivedMethod = request.method;
      receivedBody = await readBody(request);
      response.statusCode = 200;
      response.setHeader(
        "content-disposition",
        "attachment; filename*=UTF-8''report.csv",
      );
      response.setHeader("content-type", "text/csv");
      response.end("name\nAda");
    });
    const http = createHttpClient({ baseURL });

    const file = await fetchFile(http, "/exports/users", {
      method: "post",
      data: { active: true },
    });

    expect(receivedMethod).toBe("POST");
    expect(JSON.parse(receivedBody ?? "")).toEqual({ active: true });
    expect(file.filename).toBe("report.csv");
  });
});

describe("authentication capability", () => {
  it("displays and reports an unhandled 401 when no auth adapter is installed", async () => {
    const baseURL = await startServer((_request, response) => {
      sendJson(response, 401, {
        code: 40100,
        message: "sign in required",
        data: null,
      });
    });
    const onError = vi.fn();
    const onReport = vi.fn();
    const http = createHttpClient({ baseURL, onError, onReport });

    await expect(http.get("/profile")).rejects.toMatchObject({
      kind: "http",
      status: 401,
    });
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onReport).toHaveBeenCalledTimes(1);
  });

  it("applies the current credential through a generic auth adapter", async () => {
    const baseURL = await startServer((request, response) => {
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: request.headers.authorization,
      });
    });
    const auth: AuthAdapter = {
      applyCredential(config) {
        config.headers.set("Authorization", "Bearer current");
      },
      refreshCredential: vi.fn(),
      expireSession: vi.fn(),
    };
    const http = createHttpClient({ baseURL, auth });

    await expect(http.get("/profile")).resolves.toBe("Bearer current");
  });

  it("refreshes once for ten concurrent 401 responses and replays all requests", async () => {
    let protectedCount = 0;
    let refreshCount = 0;
    let refreshAuthorization: string | undefined;
    let releaseRefresh!: () => void;
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
    });
    const baseURL = await startServer(async (request, response) => {
      if (request.url === "/auth/refresh") {
        refreshCount += 1;
        refreshAuthorization = request.headers.authorization;
        await refreshGate;
        sendJson(response, 200, {
          code: 0,
          message: "ok",
          data: { accessToken: "fresh" },
        });
        return;
      }

      protectedCount += 1;
      if (request.headers.authorization !== "Bearer fresh") {
        sendJson(response, 401, {
          code: 40100,
          message: "expired",
          data: null,
        });
        return;
      }

      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: { allowed: true },
      });
    });
    const session = createMemoryAuthSession({
      initialAccessToken: "expired",
      onExpired: vi.fn(),
    });
    const http = createHttpClient({
      baseURL,
      auth: createTestAuth(baseURL, session),
    });

    const requests = Array.from({ length: 10 }, () =>
      http.get<{ allowed: boolean }>("/protected"),
    );

    await vi.waitFor(() => {
      expect(protectedCount).toBe(10);
      expect(refreshCount).toBe(1);
    });
    releaseRefresh();

    await expect(Promise.all(requests)).resolves.toEqual(
      Array.from({ length: 10 }, () => ({ allowed: true })),
    );
    expect(refreshCount).toBe(1);
    expect(protectedCount).toBe(20);
    expect(session.getAccessToken()).toBe("fresh");
    expect(refreshAuthorization).toBeUndefined();
  });

  it("clears and expires a failed concurrent refresh only once", async () => {
    let protectedCount = 0;
    let refreshCount = 0;
    let releaseRefresh!: () => void;
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
    });
    const baseURL = await startServer(async (request, response) => {
      if (request.url === "/auth/refresh") {
        refreshCount += 1;
        await refreshGate;
        sendJson(response, 401, {
          code: 40100,
          message: "refresh expired",
          data: null,
        });
        return;
      }

      protectedCount += 1;
      sendJson(response, 401, {
        code: 40100,
        message: "expired",
        data: null,
      });
    });
    const session: AuthSession = {
      getAccessToken: vi.fn(() => "expired"),
      setAccessToken: vi.fn(),
      clearSession: vi.fn(),
      onExpired: vi.fn(),
    };
    const onError = vi.fn();
    const onReport = vi.fn();
    const http = createHttpClient({
      baseURL,
      auth: createTestAuth(baseURL, session),
      onError,
      onReport,
    });
    const requests = Array.from({ length: 10 }, () =>
      http.get("/protected"),
    );

    await vi.waitFor(() => {
      expect(protectedCount).toBe(10);
      expect(refreshCount).toBe(1);
    });
    releaseRefresh();

    const results = await Promise.allSettled(requests);
    expect(results.every((result) => result.status === "rejected")).toBe(true);
    expect(session.clearSession).toHaveBeenCalledTimes(1);
    expect(session.onExpired).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(onReport).toHaveBeenCalledTimes(10);
  });

  it("allows a newly established session to refresh after the previous session failed", async () => {
    let refreshCount = 0;
    const baseURL = await startServer((request, response) => {
      if (request.url === "/auth/refresh") {
        refreshCount += 1;
        if (refreshCount === 1) {
          sendJson(response, 401, {
            code: 40100,
            message: "refresh expired",
            data: null,
          });
          return;
        }

        sendJson(response, 200, {
          code: 0,
          message: "ok",
          data: { accessToken: "fresh-second-session" },
        });
        return;
      }

      if (
        request.headers.authorization === "Bearer new-login-token" ||
        request.headers.authorization === "Bearer fresh-second-session"
      ) {
        sendJson(response, 200, {
          code: 0,
          message: "ok",
          data: true,
        });
        return;
      }

      sendJson(response, 401, {
        code: 40100,
        message: "expired",
        data: null,
      });
    });
    const session = createMemoryAuthSession({
      initialAccessToken: "expired-first-session",
      onExpired: vi.fn(),
    });
    const http = createHttpClient({
      baseURL,
      auth: createTestAuth(baseURL, session),
    });

    await expect(http.get("/protected")).rejects.toMatchObject({
      status: 401,
    });
    expect(refreshCount).toBe(1);
    expect(session.onExpired).toHaveBeenCalledTimes(1);

    session.setAccessToken("new-login-token");
    http.resetAuthState();
    await expect(http.get("/profile")).resolves.toBe(true);

    session.setAccessToken("expired-second-session");
    await expect(http.get("/protected")).resolves.toBe(true);
    expect(refreshCount).toBe(2);
    expect(session.getAccessToken()).toBe("fresh-second-session");
    expect(session.onExpired).toHaveBeenCalledTimes(1);
  });

  it("handles a concurrent network refresh failure without repeated display", async () => {
    const baseURL = await startServer((_request, response) => {
      sendJson(response, 401, {
        code: 40100,
        message: "expired",
        data: null,
      });
    });
    const refreshError = new axios.AxiosError(
      "offline",
      "ERR_NETWORK",
      {
        headers: new AxiosHeaders(),
        method: "post",
        url: "/auth/refresh?token=must-not-leak",
      },
    );
    const auth: AuthAdapter = {
      applyCredential(config) {
        config.headers.set("Authorization", "Bearer expired");
      },
      refreshCredential: vi.fn(async () => {
        throw refreshError;
      }),
      expireSession: vi.fn(),
    };
    const onError = vi.fn();
    const onReport = vi.fn();
    const http = createHttpClient({ baseURL, auth, onError, onReport });

    const results = await Promise.allSettled(
      Array.from({ length: 10 }, () => http.get("/protected")),
    );

    expect(results).toHaveLength(10);
    expect(
      results.every(
        (result) =>
          result.status === "rejected" &&
          result.reason instanceof HttpError &&
          result.reason.kind === "network",
      ),
    ).toBe(true);
    expect(auth.refreshCredential).toHaveBeenCalledTimes(1);
    expect(auth.expireSession).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(onReport).toHaveBeenCalledTimes(10);
    expect(onReport.mock.calls.map(([error]) => error)).toEqual(
      Array.from({ length: 10 }, () =>
        expect.objectContaining({
          origin: "auth-refresh",
          originMethod: "POST",
          originPath: "/auth/refresh",
          path: "/protected",
        }),
      ),
    );
  });

  it("does not refresh again when a replay also returns 401", async () => {
    let protectedCount = 0;
    let refreshCount = 0;
    const baseURL = await startServer((request, response) => {
      if (request.url === "/auth/refresh") {
        refreshCount += 1;
        sendJson(response, 200, {
          code: 0,
          message: "ok",
          data: { accessToken: "fresh" },
        });
        return;
      }

      protectedCount += 1;
      sendJson(response, 401, {
        code: 40100,
        message: "still expired",
        data: null,
      });
    });
    const onExpired = vi.fn();
    const session = createMemoryAuthSession({
      initialAccessToken: "expired",
      onExpired,
    });
    const onError = vi.fn();
    const onReport = vi.fn();
    const http = createHttpClient({
      baseURL,
      auth: createTestAuth(baseURL, session),
      onError,
      onReport,
    });

    await expect(http.get("/protected")).rejects.toMatchObject({
      kind: "http",
      status: 401,
      method: "GET",
      path: "/protected",
      attempts: 2,
    });
    expect(refreshCount).toBe(1);
    expect(protectedCount).toBe(2);
    expect(onExpired).toHaveBeenCalledTimes(1);
    expect(session.getAccessToken()).toBeNull();
    expect(onError).not.toHaveBeenCalled();
    expect(onReport).toHaveBeenCalledTimes(1);
  });

  it("keeps one loading interval around refresh and replay", async () => {
    let protectedCount = 0;
    const baseURL = await startServer((request, response) => {
      if (request.url === "/auth/refresh") {
        sendJson(response, 200, {
          code: 0,
          message: "ok",
          data: { accessToken: "fresh" },
        });
        return;
      }

      protectedCount += 1;
      if (request.headers.authorization !== "Bearer fresh") {
        sendJson(response, 401, {
          code: 40100,
          message: "expired",
          data: null,
        });
        return;
      }

      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: true,
      });
    });
    const events: string[] = [];
    const session = createMemoryAuthSession({
      initialAccessToken: "expired",
      onExpired: vi.fn(),
    });
    const http = createHttpClient({
      baseURL,
      auth: createTestAuth(baseURL, session),
      onLoadingChange: (active) => events.push(active ? "open" : "close"),
    });

    await expect(
      http.get("/protected", { showLoading: true }),
    ).resolves.toBe(true);
    expect(protectedCount).toBe(2);
    expect(events).toEqual(["open", "close"]);
  });

  it("holds new requests until an active refresh has completed", async () => {
    let refreshCount = 0;
    let waitingRequestCount = 0;
    let releaseRefresh!: () => void;
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
    });
    const baseURL = await startServer(async (request, response) => {
      if (request.url === "/auth/refresh") {
        refreshCount += 1;
        await refreshGate;
        sendJson(response, 200, {
          code: 0,
          message: "ok",
          data: { accessToken: "fresh" },
        });
        return;
      }

      if (request.url === "/waiting") {
        waitingRequestCount += 1;
      }

      if (request.headers.authorization !== "Bearer fresh") {
        sendJson(response, 401, {
          code: 40100,
          message: "expired",
          data: null,
        });
        return;
      }

      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: true,
      });
    });
    const session = createMemoryAuthSession({
      initialAccessToken: "expired",
      onExpired: vi.fn(),
    });
    const http = createHttpClient({
      baseURL,
      auth: createTestAuth(baseURL, session),
    });

    const first = http.get("/first");
    await vi.waitFor(() => {
      expect(refreshCount).toBe(1);
    });
    const waiting = http.get("/waiting");
    await delay(20);
    expect(waitingRequestCount).toBe(0);

    releaseRefresh();
    await expect(Promise.all([first, waiting])).resolves.toEqual([true, true]);
    expect(waitingRequestCount).toBe(1);
  });

  it("replays a late old-credential 401 without refreshing a second time", async () => {
    let refreshCount = 0;
    let releaseLateResponse!: () => void;
    const lateResponseGate = new Promise<void>((resolve) => {
      releaseLateResponse = resolve;
    });
    let slowAttempt = 0;
    const baseURL = await startServer(async (request, response) => {
      if (request.url === "/auth/refresh") {
        refreshCount += 1;
        sendJson(response, 200, {
          code: 0,
          message: "ok",
          data: { accessToken: "fresh" },
        });
        return;
      }

      if (request.url === "/slow") {
        slowAttempt += 1;
        if (slowAttempt === 1) {
          await lateResponseGate;
        }
      }

      if (request.headers.authorization !== "Bearer fresh") {
        sendJson(response, 401, {
          code: 40100,
          message: "expired",
          data: null,
        });
        return;
      }

      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: true,
      });
    });
    const session = createMemoryAuthSession({
      initialAccessToken: "expired",
      onExpired: vi.fn(),
    });
    const http = createHttpClient({
      baseURL,
      auth: createTestAuth(baseURL, session),
    });

    const slow = http.get("/slow");
    await expect(http.get("/trigger")).resolves.toBe(true);
    expect(refreshCount).toBe(1);
    releaseLateResponse();

    await expect(slow).resolves.toBe(true);
    expect(refreshCount).toBe(1);
    expect(slowAttempt).toBe(2);
  });

  it("does not send a request canceled while it is waiting for refresh", async () => {
    let refreshCount = 0;
    let waitingRequestCount = 0;
    let releaseRefresh!: () => void;
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
    });
    const baseURL = await startServer(async (request, response) => {
      if (request.url === "/auth/refresh") {
        refreshCount += 1;
        await refreshGate;
        sendJson(response, 200, {
          code: 0,
          message: "ok",
          data: { accessToken: "fresh" },
        });
        return;
      }

      if (request.url === "/waiting") {
        waitingRequestCount += 1;
      }

      sendJson(response, 401, {
        code: 40100,
        message: "expired",
        data: null,
      });
    });
    const session = createMemoryAuthSession({
      initialAccessToken: "expired",
      onExpired: vi.fn(),
    });
    const http = createHttpClient({
      baseURL,
      auth: createTestAuth(baseURL, session),
    });

    const first = http.get("/first");
    await vi.waitFor(() => {
      expect(refreshCount).toBe(1);
    });
    const controller = new AbortController();
    const waiting = http.get("/waiting", {
      signal: controller.signal,
      errorMode: "silent",
    });
    controller.abort();
    releaseRefresh();

    await expect(waiting).rejects.toMatchObject({ kind: "cancel" });
    await expect(first).rejects.toMatchObject({ status: 401 });
    expect(waitingRequestCount).toBe(0);
  });

  it("leaves the session unchanged for a skipAuth request that returns 401", async () => {
    const baseURL = await startServer((_request, response) => {
      sendJson(response, 401, {
        code: 40100,
        message: "invalid login",
        data: null,
      });
    });
    const auth: AuthAdapter = {
      applyCredential: vi.fn(),
      refreshCredential: vi.fn(),
      expireSession: vi.fn(),
    };
    const onError = vi.fn();
    const onReport = vi.fn();
    const http = createHttpClient({ baseURL, auth, onError, onReport });

    await expect(
      http.post("/login", undefined, { skipAuth: true }),
    ).rejects.toMatchObject({ kind: "http", status: 401 });
    expect(auth.applyCredential).not.toHaveBeenCalled();
    expect(auth.refreshCredential).not.toHaveBeenCalled();
    expect(auth.expireSession).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onReport).toHaveBeenCalledTimes(1);
  });
});
