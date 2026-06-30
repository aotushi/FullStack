/// <reference types="@cloudflare/workers-types" />
/// <reference path="../worker-configuration.d.ts" />

import { handleUrlLifecycleLab } from "./labs/url-lifecycle";

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");

  return Response.json(data, {
    ...init,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/health") {
        return json({
          ok: true,
          service: "fullstack-worker",
        });
      }

      if (url.pathname === "/api/labs/url-lifecycle") {
        return handleUrlLifecycleLab(request);
      }

      if (url.pathname.startsWith("/api/")) {
        return json(
          {
            error: "not_found",
            message: "Unknown API route.",
            path: url.pathname,
          },
          { status: 404 },
        );
      }

      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "worker_request_failed",
          path: url.pathname,
          error: error instanceof Error ? error.message : String(error),
        }),
      );

      return json(
        {
          error: "internal_error",
          message: "Worker request failed.",
        },
        { status: 500 },
      );
    }
  },
} satisfies ExportedHandler<Env>;
