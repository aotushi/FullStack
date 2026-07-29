/**
 * 文件上传与下载。这些是纯函数，第一个参数收 HttpClient——不挂在客户端上是因为它们
 * 依赖 DOM（document、URL.createObjectURL），而客户端本身在 Node 里也要能跑。
 *
 * 下载有两条路，用途不同，别混：
 *
 *   fetchFile + saveFile   走封装发请求，拿到 Blob 再触发保存。带得上 Authorization
 *                          头，能读 Content-Disposition 拿真实文件名，能报进度。
 *                          代价是整个文件先进内存。
 *   downloadDirect         直接交给浏览器下载。适合大文件和已签名的 URL；带不上
 *                          自定义请求头，所以鉴权只能靠 URL 里的签名。
 *
 * 本文件有两处安全考量，都在注释里单独标了：文件名消毒、直链协议白名单。
 */

import type { AxiosProgressEvent } from "axios";

import type { HttpClient, HttpRequestConfig } from "./client";
import { HttpError } from "./errors";

export interface UploadFileOptions
  extends Omit<HttpRequestConfig<FormData>, "data" | "method" | "url"> {
  fieldName?: string;
  filename?: string;
  fields?: Record<string, string>;
  onProgress?: (progress: AxiosProgressEvent) => void;
}

export interface DownloadFileOptions<Body = unknown>
  extends Omit<
    HttpRequestConfig<Body>,
    "data" | "method" | "responseType" | "url"
  > {
  fallbackFilename?: string;
  method?: "get" | "post";
  data?: Body;
}

export interface DownloadedFile {
  blob: Blob;
  filename: string;
}

export interface DirectDownloadOptions {
  filename?: string;
}

// 文件名消毒。它处理的是**不可信输入**：名字来自服务端的 Content-Disposition 头，
// 完全可能是 `../../../.bashrc` 或者带控制字符的东西。
//
//   第一条 replace  干掉控制字符和路径分隔符，防止写到目标目录外面去
//   第二条 replace  开头的 `.` 一律换掉，避免生成 Linux 下的隐藏文件
//   兜底           清干净之后可能什么都不剩，那就给个默认名
function sanitizeFilename(filename: string) {
  const cleaned = filename
    .replace(/[\u0000-\u001f<>:"/\\|?*]/g, "_")
    .replace(/^[._]+/, "_")
    .trim();
  return cleaned || "download";
}

// 直链下载的协议白名单，是本文件另一处安全防线。
//
// downloadDirect 会把 url 赋给 `<a href>` 然后点击它，所以 url 必须先解析、只放行
// http 和 https。放行 `javascript:` 等于给了一个 XSS 执行点，放行 `data:`、`blob:`
// 则可以用来投递本地构造的内容。**在创建链接之前**就拒绝，而不是创建完再检查。
function readDirectDownloadUrl(url: string) {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url, document.baseURI);
  } catch (cause) {
    throw new HttpError({
      kind: "configuration",
      message: "Direct download URL is invalid",
      cause,
    });
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new HttpError({
      kind: "configuration",
      message: "Direct download URL must use HTTP or HTTPS",
    });
  }

  return parsedUrl.href;
}

/**
 * 从 Content-Disposition 头里取文件名。三级降级，顺序就是 RFC 6266 的优先级：
 *
 *   1. filename*=UTF-8''...   RFC 5987 编码形式，中文文件名只能靠它
 *   2. filename="..."         带引号，名字里有空格时用这种
 *   3. filename=...           不带引号的裸值
 *
 * `filename*` 必须排在第一位：两者同时出现时（服务端为兼容老客户端常常都发），
 * `filename` 里的中文往往已经是乱码了。
 *
 * 每一条出口都过 sanitizeFilename，一个都不能漏。
 */
export function readDownloadFilename(
  contentDisposition: string | null | undefined,
  fallback = "download",
) {
  if (!contentDisposition) {
    return sanitizeFilename(fallback);
  }

  const encoded = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(contentDisposition)?.[1];
  if (encoded) {
    try {
      return sanitizeFilename(decodeURIComponent(encoded));
    } catch {
      // 服务端把 % 转义写坏了会让 decodeURIComponent 抛错。这时退回原始字符串，
      // 名字丑一点也比整个下载失败好。
      return sanitizeFilename(encoded);
    }
  }

  const quoted = /filename\s*=\s*"([^"]+)"/i.exec(contentDisposition)?.[1];
  if (quoted) {
    return sanitizeFilename(quoted);
  }

  const plain = /filename\s*=\s*([^;]+)/i.exec(contentDisposition)?.[1];
  return sanitizeFilename(plain?.trim() || fallback);
}

export function uploadFile<Result>(
  http: HttpClient,
  url: string,
  file: Blob,
  options: UploadFileOptions = {},
): Promise<Result> {
  const {
    fieldName = "file",
    filename,
    fields,
    onProgress,
    ...requestConfig
  } = options;
  const formData = new FormData();

  // 不设 Content-Type。浏览器会自己填上 multipart/form-data 并附带 boundary 参数，
  // 手写这个头反而会因为缺 boundary 让服务端解析不出内容。
  if (filename) {
    formData.append(fieldName, file, filename);
  } else {
    formData.append(fieldName, file);
  }

  Object.entries(fields ?? {}).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return http.post<Result, FormData>(url, formData, {
    ...requestConfig,
    onUploadProgress: onProgress,
  });
}

export async function fetchFile<Body = unknown>(
  http: HttpClient,
  url: string,
  options: DownloadFileOptions<Body> = {},
): Promise<DownloadedFile> {
  const {
    data,
    fallbackFilename = "download",
    method = "get",
    ...requestConfig
  } = options;
  // 这里必须用 raw() 而不是普通请求，有两个原因：文件名藏在响应头里，普通请求只
  // 给 data 拿不到头；而且 responseType: "blob" 的响应体本来就不是信封，raw() 顺带
  // 让 Envelope 拦截器跳过解包。
  const response = await http.raw<Blob, Body>({
    ...requestConfig,
    data,
    method,
    responseType: "blob",
    url,
  });
  const contentDisposition = response.headers["content-disposition"];

  return {
    blob: response.data,
    filename: readDownloadFilename(
      typeof contentDisposition === "string" ? contentDisposition : undefined,
      fallbackFilename,
    ),
  };
}

// 触发浏览器保存。整段的要点在 finally：createObjectURL 建立的引用会一直把整个 Blob
// 钉在内存里，必须 revoke。一个几十 MB 的导出反复下载几次，漏掉这一步就是几百 MB
// 回收不掉。锚点元素同理要摘掉。
export function saveFile(file: DownloadedFile) {
  const objectUrl = URL.createObjectURL(file.blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = file.filename;
  anchor.style.display = "none";
  document.body.append(anchor);

  try {
    anchor.click();
  } finally {
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }
}

export function downloadDirect(
  url: string,
  options: DirectDownloadOptions = {},
) {
  const anchor = document.createElement("a");
  anchor.href = readDirectDownloadUrl(url);
  if (options.filename) {
    anchor.download = sanitizeFilename(options.filename);
  }
  anchor.style.display = "none";
  document.body.append(anchor);

  try {
    anchor.click();
  } finally {
    anchor.remove();
  }
}
