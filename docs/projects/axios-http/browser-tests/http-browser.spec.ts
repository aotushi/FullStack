import {
  createServer,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";

import { expect, test, type Page } from "@playwright/test";

const appOrigin = "http://localhost:5181";
let apiServer: Server;
let apiBaseURL: string;
let currentAccessToken = "";
let refreshCount = 0;
const refreshCookies: Array<string | undefined> = [];
const businessCookies: Array<string | undefined> = [];
let uploadContentType = "";
let uploadBody = "";
const browserErrors = new WeakMap<Page, string[]>();

function writeCors(response: ServerResponse) {
  response.setHeader("access-control-allow-origin", appOrigin);
  response.setHeader("access-control-allow-credentials", "true");
  response.setHeader(
    "access-control-allow-headers",
    "authorization, content-type",
  );
  response.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  response.setHeader(
    "access-control-expose-headers",
    "content-disposition, content-type",
  );
}

function sendJson(
  response: ServerResponse,
  status: number,
  body: unknown,
) {
  writeCors(response);
  response.statusCode = status;
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify(body));
}

test.beforeAll(async () => {
  apiServer = createServer(async (request, response) => {
    writeCors(response);
    if (request.method === "OPTIONS") {
      response.statusCode = 204;
      response.end();
      return;
    }

    if (request.url === "/auth/seed") {
      response.setHeader(
        "set-cookie",
        "refresh=r1; HttpOnly; Secure; SameSite=Lax; Path=/",
      );
      response.statusCode = 204;
      response.end();
      return;
    }

    if (request.url === "/auth/refresh") {
      refreshCount += 1;
      refreshCookies.push(request.headers.cookie);
      currentAccessToken = `access-${refreshCount}`;
      response.setHeader(
        "set-cookie",
        `refresh=r${refreshCount + 1}; HttpOnly; Secure; SameSite=Lax; Path=/`,
      );
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: { accessToken: currentAccessToken },
      });
      return;
    }

    if (request.url === "/business") {
      businessCookies.push(request.headers.cookie);
      if (
        request.headers.authorization !== `Bearer ${currentAccessToken}` ||
        !currentAccessToken
      ) {
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
        data: currentAccessToken,
      });
      return;
    }

    if (request.url === "/file") {
      response.statusCode = 200;
      response.setHeader("content-type", "text/csv");
      response.setHeader(
        "content-disposition",
        "attachment; filename*=UTF-8''%E6%9C%88%E6%8A%A5.csv",
      );
      response.end("name\nAda");
      return;
    }

    if (request.url === "/slow-file") {
      await new Promise((resolve) => setTimeout(resolve, 150));
      response.statusCode = 200;
      response.setHeader("content-type", "application/octet-stream");
      response.end("slow");
      return;
    }

    if (request.url === "/file-error") {
      sendJson(response, 400, {
        code: 40012,
        message: "文件格式错误",
        data: null,
      });
      return;
    }

    if (request.url === "/upload") {
      uploadContentType = request.headers["content-type"] ?? "";
      const chunks: Buffer[] = [];
      for await (const chunk of request) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      uploadBody = Buffer.concat(chunks).toString("utf8");
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: { uploaded: true },
      });
      return;
    }

    if (request.url === "/slow-upload") {
      await new Promise((resolve) => setTimeout(resolve, 150));
      sendJson(response, 200, {
        code: 0,
        message: "ok",
        data: { uploaded: true },
      });
      return;
    }

    response.statusCode = 404;
    response.end();
  });

  await new Promise<void>((resolve) => {
    apiServer.listen(0, "localhost", resolve);
  });
  const address = apiServer.address() as AddressInfo;
  apiBaseURL = `http://localhost:${address.port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    apiServer.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    apiServer.closeAllConnections();
  });
});

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().startsWith("Failed to load resource:")
    ) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  await page.goto("/browser/");
  await expect(page.locator("main")).toHaveText("Axios browser verification");
});

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page)).toEqual([]);
});

test("keeps refresh cookies out of JavaScript and business requests", async ({
  page,
}) => {
  const result = await page.evaluate(async (baseURL) => {
    return window.browserHarness.runAuth(baseURL);
  }, apiBaseURL);

  expect(result).toEqual({
    first: "access-1",
    second: "access-2",
    expireCount: 0,
    visibleCookie: "",
  });
  expect(refreshCookies).toEqual(["refresh=r1", "refresh=r2"]);
  expect(businessCookies.every((cookie) => cookie === undefined)).toBe(true);
});

test("downloads a Blob, sanitizes its name, and always revokes its URL", async ({
  page,
}) => {
  const result = await page.evaluate(async (baseURL) => {
    return window.browserHarness.downloadBlob(baseURL);
  }, apiBaseURL);

  expect(result).toEqual({
    filename: "月报.csv",
    size: 8,
    created: ["8"],
    revoked: ["blob:test-file"],
    clicked: 1,
    anchors: 0,
  });
});

test("uses a browser direct download without leaving an anchor behind", async ({
  page,
}) => {
  const result = await page.evaluate(async (baseURL) => {
    return window.browserHarness.downloadDirect(baseURL);
  }, apiBaseURL);

  expect(result.clickedHref).toBe(`${apiBaseURL}/large-file`);
  expect(result.clickedDownload).toBe("_report.csv");
  expect(result.anchors).toBe(0);
});

test("rejects executable direct-download URLs before creating an anchor", async ({
  page,
}) => {
  const result = await page.evaluate(() => {
    return window.browserHarness.rejectUnsafeDirectDownload();
  });

  expect(result).toEqual({
    kind: "configuration",
    anchors: 0,
  });
  await page.waitForTimeout(50);
  expect(
    await page.evaluate(
      () =>
        (
          window as typeof window & {
            __unsafeDownloadExecuted?: number;
          }
        ).__unsafeDownloadExecuted,
    ),
  ).toBe(0);
});

test("cancels a Blob download without global display or file creation", async ({
  page,
}) => {
  const result = await page.evaluate(async (baseURL) => {
    return window.browserHarness.cancelBlob(baseURL);
  }, apiBaseURL);

  expect(result).toEqual({
    kind: "cancel",
    errorCount: 0,
    anchors: 0,
  });
});

test("recovers a JSON API error returned through a Blob response", async ({
  page,
}) => {
  const result = await page.evaluate(async (baseURL) => {
    return window.browserHarness.readBlobError(baseURL);
  }, apiBaseURL);

  expect(result).toEqual({
    kind: "http",
    status: 400,
    message: "HTTP request failed with status 400",
    displayed: ["文件格式错误"],
  });
});

test("lets the browser generate a multipart boundary and sends all fields", async ({
  page,
}) => {
  const result = await page.evaluate(async (baseURL) => {
    return window.browserHarness.upload(baseURL);
  }, apiBaseURL);

  expect(result).toEqual({ uploaded: true });
  expect(uploadContentType).toMatch(
    /^multipart\/form-data;\s*boundary=.+/i,
  );
  expect(uploadBody).toContain('name="file"; filename="hello.txt"');
  expect(uploadBody).toContain("hello file");
  expect(uploadBody).toContain('name="title"');
  expect(uploadBody).toContain("greeting");
});

test("cancels an upload without displaying a global error", async ({ page }) => {
  const result = await page.evaluate(async (baseURL) => {
    return window.browserHarness.cancelUpload(baseURL);
  }, apiBaseURL);

  expect(result).toEqual({
    kind: "cancel",
    errorCount: 0,
  });
});
