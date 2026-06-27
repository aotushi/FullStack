type LifecycleStepKind = "actual" | "partial" | "simulated" | "skipped";

type LifecycleStep = {
  id: string;
  title: string;
  kind: LifecycleStepKind;
  description: string;
  observable: boolean;
};

const allowedProtocols = new Set(["http:", "https:"]);
const allowedCacheModes = new Set(["none", "memory", "http-cache", "etag"]);
const allowedResourceTypes = new Set(["html", "css", "js", "image", "json"]);
const allowedStatusCodes = new Set([200, 301, 302, 304, 401, 403, 404, 500]);

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");

  return Response.json(data, {
    ...init,
    headers,
  });
}

function readScenarioUrl(value: string | null, fallbackOrigin: string) {
  const fallbackUrl = new URL("/resource", fallbackOrigin);

  try {
    const parsed = new URL(value || fallbackUrl.href);
    if (!allowedProtocols.has(parsed.protocol)) {
      return fallbackUrl;
    }

    return parsed;
  } catch {
    return fallbackUrl;
  }
}

function readOption(
  params: URLSearchParams,
  key: string,
  allowedValues: Set<string>,
  fallback: string,
) {
  const value = params.get(key);
  return value && allowedValues.has(value) ? value : fallback;
}

function readStatusCode(params: URLSearchParams) {
  const value = Number(params.get("status") || 200);
  return allowedStatusCodes.has(value) ? value : 200;
}

function readDelay(params: URLSearchParams) {
  const value = Number(params.get("delay") || 120);
  if (!Number.isFinite(value)) return 120;
  return Math.min(Math.max(Math.trunc(value), 0), 3000);
}

function makeSteps(
  scenarioUrl: URL,
  cacheMode: string,
  statusCode: number,
  delay: number,
  resourceType: string,
): LifecycleStep[] {
  const isHttps = scenarioUrl.protocol === "https:";
  const hasRedirect = statusCode === 301 || statusCode === 302;
  const cacheDescription =
    cacheMode === "none"
      ? "浏览器没有命中可用缓存，需要继续访问网络。"
      : cacheMode === "etag"
        ? "浏览器携带缓存验证信息，服务器可以返回 304 或新的资源。"
        : cacheMode === "memory"
          ? "浏览器可能直接从内存缓存读取资源，不一定访问网络。"
          : "浏览器会检查 HTTP 缓存策略，判断资源是否仍然新鲜。";

  return [
    {
      id: "url-parse",
      title: "URL 解析",
      kind: "actual",
      observable: true,
      description: "浏览器解析协议、主机名、路径和查询参数。",
    },
    {
      id: "cache-check",
      title: "缓存检查",
      kind: cacheMode === "none" ? "partial" : "simulated",
      observable: false,
      description: cacheDescription,
    },
    {
      id: "dns",
      title: "DNS 解析",
      kind: "simulated",
      observable: false,
      description:
        "浏览器需要把域名解析为可连接的服务器地址。普通前端代码无法直接观察 DNS 查询细节。",
    },
    {
      id: "connection",
      title: "建立连接",
      kind: "simulated",
      observable: false,
      description:
        "浏览器和服务器建立网络连接。TCP/TLS 或 QUIC 细节由浏览器、操作系统和网络环境共同决定。",
    },
    {
      id: "tls",
      title: "TLS 握手",
      kind: isHttps ? "simulated" : "skipped",
      observable: false,
      description: isHttps
        ? "HTTPS 请求会进行 TLS 握手，用于确认通信对象并协商加密参数。"
        : "HTTP 请求不进行 TLS 握手，传输内容不会被 HTTPS 加密保护。",
    },
    {
      id: "http-request",
      title: "发送 HTTP 请求",
      kind: "actual",
      observable: true,
      description: `浏览器发送 ${resourceType.toUpperCase()} 资源请求。`,
    },
    {
      id: "server-processing",
      title: "服务器处理请求",
      kind: "actual",
      observable: true,
      description: `服务端按当前示例参数生成响应。模拟服务器处理延迟为 ${delay}ms。`,
    },
    {
      id: "http-response",
      title: "返回 HTTP 响应",
      kind: "actual",
      observable: true,
      description: hasRedirect
        ? `服务器返回 ${statusCode}，浏览器会根据 Location 发起后续请求。`
        : `服务器返回 ${statusCode}，浏览器继续处理响应头和响应体。`,
    },
    {
      id: "browser-response",
      title: "浏览器处理响应",
      kind: "partial",
      observable: true,
      description: "浏览器根据状态码、响应头、缓存策略和资源类型决定下一步行为。",
    },
    {
      id: "render",
      title: "页面解析与渲染",
      kind: resourceType === "html" ? "partial" : "skipped",
      observable: resourceType === "html",
      description:
        resourceType === "html"
          ? "HTML 响应会进入解析、资源发现、样式计算、布局、绘制和合成流程。"
          : "当前资源不是 HTML，不会直接触发完整页面渲染流程。",
    },
  ];
}

async function wait(delay: number) {
  if (delay <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export async function handleUrlLifecycleLab(request: Request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return json(
      {
        error: "method_not_allowed",
        message: "Use GET for this lab endpoint.",
      },
      {
        status: 405,
        headers: {
          Allow: "GET, HEAD",
        },
      },
    );
  }

  const requestUrl = new URL(request.url);
  const scenarioUrl = readScenarioUrl(requestUrl.searchParams.get("url"), requestUrl.origin);
  const cacheMode = readOption(requestUrl.searchParams, "cache", allowedCacheModes, "none");
  const resourceType = readOption(
    requestUrl.searchParams,
    "resource",
    allowedResourceTypes,
    "html",
  );
  const statusCode = readStatusCode(requestUrl.searchParams);
  const delay = readDelay(requestUrl.searchParams);

  await wait(delay);

  const body = {
    id: crypto.randomUUID(),
    scenario: {
      url: scenarioUrl.href,
      protocol: scenarioUrl.protocol.replace(":", ""),
      cache: cacheMode,
      status: statusCode,
      delay,
      resourceType,
    },
    steps: makeSteps(scenarioUrl, cacheMode, statusCode, delay, resourceType),
  };

  if (request.method === "HEAD") {
    return new Response(null, {
      status: 204,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  return json(body);
}
