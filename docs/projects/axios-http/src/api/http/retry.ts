/**
 * 指数退避重试。由 client.ts 的 execute() 调用，只包住「一次物理尝试」。
 *
 * 边界要划清楚：这一层管的是**同一个请求**的网络抖动，不管数据的新鲜度。缓存、
 * 去重、失效后重取那些属于数据获取层（TanStack Query / SWR）的职责，不要在这里长。
 * 两层叠加时，把重试关掉交给上层统一管也是合理选择。
 */

import { HttpError } from "./errors";

export interface RetryOptions {
  retries?: number;
  baseDelay?: number;
  totalTimeoutMs?: number;
  signal?: AbortSignal;
  shouldRetry?: (error: unknown) => boolean;
}

// 重试的总时间预算。没有它的话，单次 timeout 10s × 3 次尝试 + 退避等待，用户可能
// 要盯着 Loading 转半分钟——每一次都没超时，加起来却久得离谱。
const DEFAULT_TOTAL_TIMEOUT_MS = 30_000;

// 等待期间也要能被取消，否则 cancelAll() 之后请求还会在退避结束时冒出来。
// 取消用 HttpError kind: "cancel" 表达，让上层跟其他取消走同一条路径。
function wait(delay: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(
        new HttpError({
          kind: "cancel",
          message: "Request canceled",
          cause: signal.reason,
        }),
      );
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, delay);

    function abort() {
      clearTimeout(timer);
      reject(
        new HttpError({
          kind: "cancel",
          message: "Request canceled",
          cause: signal?.reason,
        }),
      );
    }

    signal?.addEventListener("abort", abort, { once: true });
  });
}

export async function retry<Result>(
  task: () => Promise<Result>,
  options: RetryOptions = {},
): Promise<Result> {
  const retries = options.retries ?? 2;
  const baseDelay = options.baseDelay ?? 200;
  const totalTimeoutMs = options.totalTimeoutMs ?? DEFAULT_TOTAL_TIMEOUT_MS;
  const startedAt = Date.now();
  // 默认只重试「重试确实可能成功」的失败：网络断、超时，以及 502/503/504 这三个
  // 明确表示上游临时不可用的状态码。
  //
  // 反过来说，4xx 一律不重试——参数错了、没权限、资源不存在，再发一百次也是同样的
  // 结果，只是在给服务端添堵。500 同样不在名单里：它代表服务端逻辑出错，不是临时性的。
  const shouldRetry =
    options.shouldRetry ??
    ((error: unknown) => {
      if (!(error instanceof HttpError)) {
        return false;
      }

      return (
        error.kind === "network" ||
        error.kind === "timeout" ||
        (error.kind === "http" && [502, 503, 504].includes(error.status ?? 0))
      );
    });

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      if (attempt >= retries || !shouldRetry(error)) {
        throw error;
      }

      // 退避时间乘一个 0.75~1.25 的随机抖动。服务端刚恢复时，如果所有客户端都在
      // 同一毫秒发起第二次尝试，会立刻把它再打垮一次；抖动把这波流量摊开。
      const jitter = 0.75 + Math.random() * 0.5;
      const delay = baseDelay * 2 ** attempt * jitter;
      // 预算检查放在等待**之前**：只判断「这次等待加上已花的时间会不会超预算」，
      // 超了就直接把当前错误抛出去。它从不打断已经发出的尝试——那样会让一个其实
      // 就要成功的请求平白失败。
      if (Date.now() - startedAt + delay >= totalTimeoutMs) {
        throw error;
      }

      await wait(delay, options.signal);
    }
  }
}
