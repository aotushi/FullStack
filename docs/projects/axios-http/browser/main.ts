import {
  downloadDirect,
  fetchFile,
  saveFile,
  uploadFile,
} from "../src/api/http/transfer";
import { createBearerAuthAdapter } from "../src/api/http/adapters/auth";
import { readApiEnvelope } from "../src/api/http/adapters/envelope";
import { presentApiError } from "../src/api/http/adapters/error-presenter";
import { createHttpClient } from "../src/api/http/client";

function selectAccessToken(response: { data: unknown; status: number }) {
  const envelope = readApiEnvelope(response.data);
  const result = envelope?.data;
  if (
    !envelope?.hasData ||
    !result ||
    typeof result !== "object" ||
    !("accessToken" in result) ||
    typeof result.accessToken !== "string"
  ) {
    throw new Error(`Invalid refresh response (${response.status})`);
  }
  return result.accessToken;
}

const browserHarness = {
  async runAuth(apiBaseURL: string) {
    await fetch(`${apiBaseURL}/auth/seed`, {
      method: "POST",
      credentials: "include",
    });

    let accessToken: string | null = "expired";
    let expireCount = 0;
    const auth = createBearerAuthAdapter({
      baseURL: apiBaseURL,
      getAccessToken: () => accessToken,
      setAccessToken: (token) => {
        accessToken = token;
      },
      selectAccessToken,
      expireSession: () => {
        accessToken = null;
        expireCount += 1;
      },
    });
    const http = createHttpClient({ baseURL: apiBaseURL, auth });

    const first = await http.get<string>("/business");
    accessToken = "expired-again";
    const second = await http.get<string>("/business");

    return {
      first,
      second,
      expireCount,
      visibleCookie: document.cookie,
    };
  },

  async downloadBlob(apiBaseURL: string) {
    const http = createHttpClient({ baseURL: apiBaseURL });
    const file = await fetchFile(http, "/file");
    const created: string[] = [];
    const revoked: string[] = [];
    let clicked = 0;
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;
    const originalClick = HTMLAnchorElement.prototype.click;

    URL.createObjectURL = (blob) => {
      created.push(blob instanceof Blob ? `${blob.size}` : "media-source");
      return "blob:test-file";
    };
    URL.revokeObjectURL = (url) => {
      revoked.push(url);
    };
    HTMLAnchorElement.prototype.click = function click() {
      clicked += 1;
    };

    try {
      saveFile(file);
    } finally {
      URL.createObjectURL = originalCreate;
      URL.revokeObjectURL = originalRevoke;
      HTMLAnchorElement.prototype.click = originalClick;
    }

    return {
      filename: file.filename,
      size: file.blob.size,
      created,
      revoked,
      clicked,
      anchors: document.querySelectorAll("a").length,
    };
  },

  async downloadDirect(apiBaseURL: string) {
    let clickedHref = "";
    let clickedDownload = "";
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function click() {
      clickedHref = this.href;
      clickedDownload = this.download;
    };

    try {
      downloadDirect(`${apiBaseURL}/large-file`, {
        filename: "../report.csv",
      });
    } finally {
      HTMLAnchorElement.prototype.click = originalClick;
    }

    return {
      clickedHref,
      clickedDownload,
      anchors: document.querySelectorAll("a").length,
    };
  },

  rejectUnsafeDirectDownload() {
    const auditWindow = window as typeof window & {
      __unsafeDownloadExecuted?: number;
    };
    auditWindow.__unsafeDownloadExecuted = 0;

    try {
      downloadDirect(
        "javascript:window.__unsafeDownloadExecuted=1",
      );
      return {
        kind: "resolved",
        anchors: document.querySelectorAll("a").length,
      };
    } catch (error) {
      return {
        kind:
          error && typeof error === "object" && "kind" in error
            ? error.kind
            : "unknown",
        anchors: document.querySelectorAll("a").length,
      };
    }
  },

  async cancelBlob(apiBaseURL: string) {
    let errorCount = 0;
    const http = createHttpClient({
      baseURL: apiBaseURL,
      onError: () => {
        errorCount += 1;
      },
    });
    const controller = new AbortController();
    const pending = fetchFile(http, "/slow-file", {
      signal: controller.signal,
    });
    window.setTimeout(() => controller.abort(), 10);

    try {
      await pending;
      return { kind: "resolved", errorCount };
    } catch (error) {
      return {
        kind:
          error && typeof error === "object" && "kind" in error
            ? error.kind
            : "unknown",
        errorCount,
        anchors: document.querySelectorAll("a").length,
      };
    }
  },

  async readBlobError(apiBaseURL: string) {
    const displayed: string[] = [];
    const http = createHttpClient({
      baseURL: apiBaseURL,
      onError: (error) => {
        displayed.push(presentApiError(error));
      },
    });

    try {
      await fetchFile(http, "/file-error");
      return { kind: "resolved", displayed };
    } catch (error) {
      return {
        kind:
          error && typeof error === "object" && "kind" in error
            ? error.kind
            : "unknown",
        status:
          error && typeof error === "object" && "status" in error
            ? error.status
            : undefined,
        message: error instanceof Error ? error.message : "",
        displayed,
      };
    }
  },

  async upload(apiBaseURL: string) {
    const http = createHttpClient({ baseURL: apiBaseURL });
    return uploadFile<{ uploaded: boolean }>(
      http,
      "/upload",
      new Blob(["hello file"], { type: "text/plain" }),
      {
        filename: "hello.txt",
        fields: { title: "greeting" },
      },
    );
  },

  async cancelUpload(apiBaseURL: string) {
    let errorCount = 0;
    const http = createHttpClient({
      baseURL: apiBaseURL,
      onError: () => {
        errorCount += 1;
      },
    });
    const controller = new AbortController();
    const pending = uploadFile(
      http,
      "/slow-upload",
      new Blob([new Uint8Array(1024 * 1024)], {
        type: "application/octet-stream",
      }),
      { signal: controller.signal },
    );
    window.setTimeout(() => controller.abort(), 10);

    try {
      await pending;
      return { kind: "resolved", errorCount };
    } catch (error) {
      return {
        kind:
          error && typeof error === "object" && "kind" in error
            ? error.kind
            : "unknown",
        errorCount,
      };
    }
  },
};

declare global {
  interface Window {
    browserHarness: typeof browserHarness;
  }
}

window.browserHarness = browserHarness;
