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

type ServerHit = { method: string; url: string; authorization?: string };

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

/**
 * 建立一个「首次刷新被挂起、随后失败」的会话场景。
 * 释放挂起前，测试可以模拟显式重新登录。
 */
async function startExpiringSessionServer(options: {
  secondRefreshSucceeds: boolean;
}) {
  const hits: ServerHit[] = [];
  let releaseFirstRefresh: (() => void) | undefined;
  const firstRefreshGate = new Promise<void>((resolve) => {
    releaseFirstRefresh = resolve;
  });
  let refreshCount = 0;

  const baseURL = await startServer(async (request, response) => {
    hits.push({
      method: request.method ?? "",
      url: request.url ?? "",
      authorization: request.headers.authorization,
    });

    if (request.url === "/auth/refresh") {
      refreshCount += 1;
      if (refreshCount === 1) {
        await firstRefreshGate;
        sendJson(response, 401, {
          code: 40100,
          message: "refresh expired",
          data: null,
        });
        return;
      }

      if (options.secondRefreshSucceeds) {
        sendJson(response, 200, {
          code: 0,
          message: "ok",
          data: { accessToken: "rotated-token" },
        });
        return;
      }

      sendJson(response, 401, {
        code: 40100,
        message: "refresh expired",
        data: null,
      });
      return;
    }

    if (
      request.headers.authorization === "Bearer new-login-token" ||
      request.headers.authorization === "Bearer rotated-token"
    ) {
      sendJson(response, 200, { code: 0, message: "ok", data: "fresh-data" });
      return;
    }

    sendJson(response, 401, { code: 40100, message: "expired", data: null });
  });

  return {
    baseURL,
    hits,
    refreshCount: () => refreshCount,
    releaseFirstRefresh: () => releaseFirstRefresh?.(),
  };
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

describe("session isolation between the business client and the refresh client", () => {
  it("never replays a refresh request through the business client", async () => {
    const scenario = await startExpiringSessionServer({
      secondRefreshSucceeds: true,
    });
    const session = createMemoryAuthSession({
      initialAccessToken: "expired-first-session",
      onExpired: vi.fn(),
    });
    const onError = vi.fn();
    const http = createHttpClient({
      baseURL: scenario.baseURL,
      auth: createTestAuth(scenario.baseURL, session),
      onError,
    });

    const expiredRequest = http.get("/protected").catch((error: unknown) => error);
    await delay(120);

    // 用户在刷新在途时完成显式登录
    session.setAccessToken("new-login-token");
    http.resetAuthState();

    const afterLogin = http.get<string>("/profile");
    await delay(60);

    scenario.releaseFirstRefresh();
    await expiredRequest;

    await expect(afterLogin).resolves.toBe("fresh-data");
    // 业务请求必须真的发出，而不是拿到刷新接口的响应体
    expect(
      scenario.hits.some((hit) => hit.method === "GET" && hit.url === "/profile"),
    ).toBe(true);
    // 刷新端点只应由无凭证的刷新客户端访问
    expect(
      scenario.hits.filter(
        (hit) => hit.url === "/auth/refresh" && hit.authorization !== undefined,
      ),
    ).toEqual([]);
    expect(scenario.refreshCount()).toBe(1);
    expect(onError).not.toHaveBeenCalled();
  });

  it("keeps a re-established session alive when the previous refresh finally fails", async () => {
    const scenario = await startExpiringSessionServer({
      secondRefreshSucceeds: false,
    });
    const onExpired = vi.fn();
    const session = createMemoryAuthSession({
      initialAccessToken: "expired-first-session",
      onExpired,
    });
    const http = createHttpClient({
      baseURL: scenario.baseURL,
      auth: createTestAuth(scenario.baseURL, session),
    });

    const expiredRequest = http.get("/protected").catch((error: unknown) => error);
    await delay(120);

    session.setAccessToken("new-login-token");
    http.resetAuthState();

    const afterLogin = http.get<string>("/profile");
    await delay(60);

    scenario.releaseFirstRefresh();
    await expiredRequest;

    await expect(afterLogin).resolves.toBe("fresh-data");
    // 上一会话的刷新失败不得再次失效已经重建的会话
    expect(onExpired).not.toHaveBeenCalled();
    expect(session.getAccessToken()).toBe("new-login-token");
  });

  it("continues a request that was already waiting for the previous session's refresh", async () => {
    const scenario = await startExpiringSessionServer({
      secondRefreshSucceeds: false,
    });
    const onExpired = vi.fn();
    const session = createMemoryAuthSession({
      initialAccessToken: "expired-first-session",
      onExpired,
    });
    const http = createHttpClient({
      baseURL: scenario.baseURL,
      auth: createTestAuth(scenario.baseURL, session),
    });

    const expiredRequest = http.get("/protected").catch((error: unknown) => error);
    await delay(120);

    // 该请求先进入等待，登录发生在它等待期间
    const waiting = http.get<string>("/profile");
    await delay(60);
    session.setAccessToken("new-login-token");
    http.resetAuthState();

    scenario.releaseFirstRefresh();
    await expiredRequest;

    await expect(waiting).resolves.toBe("fresh-data");
    expect(onExpired).not.toHaveBeenCalled();
    expect(session.getAccessToken()).toBe("new-login-token");
  });
});
