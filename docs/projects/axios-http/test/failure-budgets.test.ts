import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createMemoryAuthSession,
  type AuthSession,
} from "../src/api/session";
import { createBearerAuthAdapter } from "../src/api/http/adapters/auth";
import { readApiEnvelope } from "../src/api/http/adapters/envelope";
import { createHttpClient } from "../src/api/http/client";
import { ApiEnvelopeFormatError } from "../src/api/http/errors";

const openServers = new Set<Server>();

function sendJson(response: ServerResponse, status: number, body: unknown) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify(body));
}

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function startServer(
  handler: (
    request: IncomingMessage,
    response: ServerResponse,
  ) => void | Promise<void>,
) {
  const server = createServer((request, response) => {
    Promise.resolve(handler(request, response)).catch(() => {
      sendJson(response, 500, { message: "test server failed" });
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

/** 刷新端点只在第一次抖动失败，之后恢复正常。 */
async function startFlakyRefreshServer() {
  let refreshCount = 0;

  const baseURL = await startServer((request, response) => {
    if (request.url === "/auth/refresh") {
      refreshCount += 1;
      if (refreshCount === 1) {
        sendJson(response, 500, { message: "refresh endpoint hiccup" });
        return;
      }

      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: { accessToken: "good-token" },
      });
      return;
    }

    if (request.headers.authorization === "Bearer good-token") {
      sendJson(response, 200, { code: 0, message: "ok", data: "fresh-data" });
      return;
    }

    sendJson(response, 401, { code: 40100, message: "expired", data: null });
  });

  return { baseURL, refreshCount: () => refreshCount };
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

describe("refresh failure cooldown", () => {
  it("reuses the cached refresh failure inside the cooldown window", async () => {
    const scenario = await startFlakyRefreshServer();
    const onExpired = vi.fn();
    const session = createMemoryAuthSession({
      initialAccessToken: "stale-token",
      onExpired,
    });
    const http = createHttpClient({
      baseURL: scenario.baseURL,
      auth: createTestAuth(scenario.baseURL, session),
      refreshCooldownMs: 10_000,
    });

    await expect(http.get("/protected")).rejects.toMatchObject({
      kind: "http",
      status: 500,
      origin: "auth-refresh",
    });
    expect(scenario.refreshCount()).toBe(1);

    await expect(http.get("/protected")).rejects.toMatchObject({
      kind: "http",
      status: 500,
    });
    // 冷却期内不得再打刷新端点，会话也不应被重复失效
    expect(scenario.refreshCount()).toBe(1);
    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it("retries the refresh once the cooldown has elapsed", async () => {
    const scenario = await startFlakyRefreshServer();
    const session = createMemoryAuthSession({
      initialAccessToken: "stale-token",
      onExpired: vi.fn(),
    });
    const http = createHttpClient({
      baseURL: scenario.baseURL,
      auth: createTestAuth(scenario.baseURL, session),
      refreshCooldownMs: 40,
    });

    await expect(http.get("/protected")).rejects.toMatchObject({ status: 500 });
    expect(scenario.refreshCount()).toBe(1);

    await delay(80);

    // 刷新端点恢复后客户端必须自愈，而不是终身锁死在失败缓存上
    await expect(http.get<string>("/protected")).resolves.toBe("fresh-data");
    expect(scenario.refreshCount()).toBe(2);
    expect(session.getAccessToken()).toBe("good-token");
  });
});

describe("retry total budget", () => {
  it("stops retrying a safe read once the budget cannot fit another attempt", async () => {
    let hits = 0;
    const baseURL = await startServer((_request, response) => {
      hits += 1;
      sendJson(response, 503, { code: 50300, message: "busy", data: null });
    });
    const http = createHttpClient({ baseURL });

    const startedAt = Date.now();
    await expect(
      http.get("/report", {
        retry: { retries: 5, baseDelayMs: 40, totalTimeoutMs: 250 },
      }),
    ).rejects.toMatchObject({ kind: "http", status: 503 });
    const elapsed = Date.now() - startedAt;

    // 不设预算时会跑满 6 次尝试、约 1.2 秒退避
    expect(hits).toBeLessThan(6);
    expect(elapsed).toBeLessThan(600);
  });
});
