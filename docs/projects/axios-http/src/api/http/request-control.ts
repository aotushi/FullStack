/**
 * 物理尝试这一层的取消控制。和 client.ts 是一对：
 *
 *   client.ts        逻辑请求——调用方眼里的一次请求
 *   request-control  物理尝试——真正发出去的每一次 HTTP 请求
 *
 * 一次逻辑请求可能产生多次物理尝试（重试、401 刷新后重放），所以两层各有一套
 * AbortController，cancelAll() 也要两层都取消：正在退避等待、还没发出下一次尝试的
 * 请求只存在于逻辑层；已经在传输途中的请求只存在于这一层。
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

type RequestRuntimeMeta = {
  controller: AbortController;
  originalSignal?: InternalAxiosRequestConfig["signal"];
  disposeCombinedSignal: () => void;
};

type ControlledRequestConfig<Body = unknown> =
  InternalAxiosRequestConfig<Body> & {
    __requestControlMeta?: RequestRuntimeMeta;
    __requestAttempts?: RequestAttempts;
  };

// 物理尝试的计数器。对象由 client.ts 的 execute() 创建并塞进 config，在这里自增，
// 最后回到 execute() 写进错误上下文。用类而不是数字，是因为要跨这三处共享同一个
// 引用——传数字的话每一层拿到的都是副本。
export class RequestAttempts {
  count = 0;
}

/**
 * 把多个 AbortSignal 合成一个：任意一个中止，合成信号就中止。
 *
 * 优先用原生 `AbortSignal.any()`；它不在的环境（较老的浏览器）退回手写实现。
 * 手写那半要注意两件事：
 *   · 返回 dispose，调用方在请求结束时必须调，否则监听器会一直挂在调用方的 signal
 *     上。长生命周期的 signal（比如整个页面共用一个）配上频繁请求，就是内存泄漏。
 *   · 先检查有没有已经中止的信号。晚注册监听器收不到早已发生的 abort 事件。
 */
export function combineAbortSignals(signals: AbortSignal[]) {
  const AbortSignalWithAny = AbortSignal as typeof AbortSignal & {
    any?: (signals: AbortSignal[]) => AbortSignal;
  };

  if (AbortSignalWithAny.any) {
    return {
      signal: AbortSignalWithAny.any(signals),
      dispose: () => {},
    };
  }

  const controller = new AbortController();
  const subscriptions: Array<{ signal: AbortSignal; listener: () => void }> = [];

  function dispose() {
    subscriptions.forEach(({ signal, listener }) => {
      signal.removeEventListener("abort", listener);
    });
    subscriptions.length = 0;
  }

  const abortedSignal = signals.find((signal) => signal.aborted);
  if (abortedSignal) {
    controller.abort(abortedSignal.reason);
    return { signal: controller.signal, dispose };
  }

  signals.forEach((signal) => {
    const listener = () => {
      controller.abort(signal.reason);
      dispose();
    };

    subscriptions.push({ signal, listener });
    signal.addEventListener("abort", listener, { once: true });
  });

  return { signal: controller.signal, dispose };
}

export function installRequestControl(axiosInstance: AxiosInstance) {
  const pendingControllers = new Set<AbortController>();

  // 每次物理请求发出前都会走到这里——包括重试和 401 重放，因为它们都是重新进入
  // Axios 的请求链。计数器加在这里，统计到的才是真实的尝试次数。
  function prepare(config: ControlledRequestConfig) {
    if (config.__requestAttempts) {
      config.__requestAttempts.count += 1;
    }

    const controller = new AbortController();
    const originalSignal = config.signal;
    const combined = originalSignal
      ? combineAbortSignals([originalSignal as AbortSignal, controller.signal])
      : {
          signal: controller.signal,
          dispose: () => {},
        };

    const meta: RequestRuntimeMeta = {
      controller,
      originalSignal,
      disposeCombinedSignal: combined.dispose,
    };

    config.__requestControlMeta = meta;
    config.signal = combined.signal;
    pendingControllers.add(controller);

    return config;
  }

  // 请求结束后必须把 config 恢复原样：解绑监听器，把 signal 换回调用方原来那个。
  //
  // 恢复这一步不是洁癖。config 对象会被复用——401 重放就是拿同一个 config 再发一次。
  // 如果留着上一轮那个已经中止的合成信号，重放会在发出的瞬间就被判为取消。
  function finish(config?: ControlledRequestConfig) {
    const meta = config?.__requestControlMeta;
    if (!meta || !config) {
      return;
    }

    meta.disposeCombinedSignal();
    config.signal = meta.originalSignal;
    config.__requestControlMeta = undefined;
    pendingControllers.delete(meta.controller);
  }

  axiosInstance.interceptors.request.use((config) => {
    return prepare(config as ControlledRequestConfig);
  });

  // 成功和失败两条路都要 finish()。只在成功分支清理的话，一个总是超时的接口会把
  // 监听器和控制器一直攒着。
  axiosInstance.interceptors.response.use(
    (response) => {
      finish(response.config as ControlledRequestConfig);
      return response;
    },
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        finish(error.config as ControlledRequestConfig | undefined);
      }

      return Promise.reject(error);
    },
  );

  return {
    cancelAll() {
      pendingControllers.forEach((controller) => controller.abort());
      pendingControllers.clear();
    },
  };
}
