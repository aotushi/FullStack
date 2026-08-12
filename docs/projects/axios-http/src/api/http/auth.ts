/**
 * 401 自动刷新与重放。这是整个封装里状态最多的文件，先说清楚它在解决什么问题。
 *
 * 场景：页面同时发了 10 个请求，令牌恰好在这一刻过期，于是 10 个请求全部收到 401。
 * 幼稚的实现会打 10 次刷新接口，拿回 10 个新令牌，后面的把前面的挤掉——用户随机
 * 掉线。所以核心诉求是：**无论多少请求同时撞上 401，只刷新一次，然后把它们全部重放**。
 *
 * 围绕这个诉求有五组状态，各自挡住一个坑：
 *
 *   refreshPromise            单飞。已经在刷了就复用同一个 Promise，不发起第二次。
 *   credentialVersion         凭证代际。区分「你拿旧令牌失败」和「新令牌也失败」：
 *                             前者该刷新重放，后者说明是真的没权限，再刷也没用。
 *   failedVersion/Error/At    熔断。刷新接口自己挂掉时，别让每个请求都去捅它一下；
 *                             但也不能永久锁死，所以带一个冷却窗口。
 *   expiredVersion            去重。让 expireSession()（通常是跳登录页）每代只触发
 *                             一次，而不是 10 个请求弹 10 次。
 *   sessionEpoch              会话代际。用户手动重新登录时推进，使上一个会话遗留的
 *                             在途刷新不再影响新会话。
 *
 * 另有两个 WeakSet，用来标记「这个错误认证模块已经处理过了」，client.ts 据此决定
 * 不再叠一个全局提示。用 WeakSet 而不是往错误上加字段，既不污染错误对象，也不会
 * 被 JSON.stringify 带进监控上报。
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

export interface AuthBehavior {
  skipAuth?: boolean;
}

export interface AuthAdapter {
  applyCredential(config: InternalAxiosRequestConfig): void;
  refreshCredential(): Promise<void>;
  expireSession(): void;
}

export interface AuthControl {
  resetAuthState(): void;
}

export interface InstallAuthOptions {
  refreshCooldownMs?: number;
}

// 刷新失败后的熔断冷却：窗口期内不再打刷新端点，窗口结束后放行一次新的尝试。
// 它是「熔断」不是「锁定」——刷新接口抖动一下不该让用户在整个会话里都用不了。
const DEFAULT_REFRESH_COOLDOWN_MS = 30_000;

type AuthRequestConfig = InternalAxiosRequestConfig &
  AuthBehavior & {
    /** 本实例的请求拦截器盖的章。见下面响应拦截器里为什么必须认它。 */
    __authManaged?: boolean;
    /** 已经因为 401 重放过一次。防止「刷新了、重放了、还是 401」时无限循环。 */
    __authRetry?: boolean;
    /** 发出这个请求时用的是第几代凭证。 */
    __credentialVersion?: number;
  };

const handledAuthErrors = new WeakSet<object>();
const authRefreshErrors = new WeakSet<object>();

function markHandledAuthError(
  error: unknown,
  origin: "business" | "auth-refresh",
) {
  if ((typeof error === "object" && error !== null) || typeof error === "function") {
    handledAuthErrors.add(error);
    if (origin === "auth-refresh") {
      authRefreshErrors.add(error);
    }
  }
  return error;
}

export function isHandledAuthError(error: unknown) {
  return Boolean(
    ((typeof error === "object" && error !== null) || typeof error === "function") &&
      handledAuthErrors.has(error),
  );
}

export function readHandledAuthErrorOrigin(error: unknown) {
  if (
    (typeof error !== "object" || error === null) &&
    typeof error !== "function"
  ) {
    return undefined;
  }

  if (authRefreshErrors.has(error)) {
    return "auth-refresh" as const;
  }

  return handledAuthErrors.has(error) ? ("business" as const) : undefined;
}

// 刷新可能要等几百毫秒，用户在这期间完全可能切走页面。所以等待前后都要复查取消
// 状态，别把一个已经没人要的请求重新发出去。
function throwIfCanceled(config: AuthRequestConfig) {
  if (config.signal?.aborted) {
    throw new axios.CanceledError("Request canceled", config);
  }
}

export function installAuth(
  axiosInstance: AxiosInstance,
  adapter: AuthAdapter,
  options: InstallAuthOptions = {},
): AuthControl {
  const refreshCooldownMs =
    options.refreshCooldownMs ?? DEFAULT_REFRESH_COOLDOWN_MS;
  let credentialVersion = 0;
  let refreshPromise: Promise<void> | undefined;
  let failedVersion: number | undefined;
  let failedError: unknown;
  let failedAt = 0;
  let expiredVersion: number | undefined;
  // 会话代际：显式重建会话时推进，用于判定在途刷新是否已经过时。
  let sessionEpoch = 0;

  // 同一代凭证只失效一次。10 个请求同时确认「登录真的过期了」，用户也只该被踢到
  // 登录页一次。
  function expireOnce(version: number) {
    if (expiredVersion === version) {
      return;
    }

    expiredVersion = version;
    adapter.expireSession();
  }

  // 单飞的实现：所有撞上 401 的请求都调它，但真正打刷新接口的只有第一个。
  function refreshOnce(version: number) {
    if (failedVersion === version) {
      if (Date.now() - failedAt < refreshCooldownMs) {
        // 熔断打开：直接复用上次那个失败，不再打刷新端点。
        return Promise.reject(failedError);
      }

      // 冷却结束，清掉失败缓存放行一次新的刷新。少了这一段，刷新端点抖动一次就会
      // 把客户端永久锁死，用户不刷新页面就再也发不出请求。
      failedVersion = undefined;
      failedError = undefined;
    }

    if (!refreshPromise) {
      // 把当下的会话代际捕获进闭包。刷新是异步的，等它回来时用户可能已经重新登录
      // 过了；对比这个快照就能认出「我是上一个会话遗留的刷新」。
      const epoch = sessionEpoch;
      let pending: Promise<void> | undefined;
      pending = adapter
        .refreshCredential()
        .then(() => {
          // 上一会话的刷新即使成功也要丢弃：它拿回来的是旧会话的令牌，写进去会把
          // 用户刚登录的新凭证覆盖掉。
          if (epoch !== sessionEpoch) {
            return;
          }

          credentialVersion += 1;
          failedVersion = undefined;
          failedError = undefined;
        })
        .catch((error: unknown) => {
          const handledError = markHandledAuthError(error, "auth-refresh");
          // 同理，上一会话的刷新失败也不该把用户刚建立的新会话再踢下线。
          if (epoch === sessionEpoch) {
            failedVersion = version;
            failedError = handledError;
            failedAt = Date.now();
            // 只有刷新端点明确回答 401——Refresh Token 本身失效——才终结会话。
            // 网络错、超时、5xx 只说明端点「暂时无法回答」，此刻清会话会把一次
            // 抖动放大成一次强制登出；留给上面的熔断冷却，窗口结束后自愈（D-65）。
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              expireOnce(version);
            }
          }

          throw handledError;
        })
        .finally(() => {
          // 只在自己仍然是「当前那一次刷新」时才清空。resetAuthState() 可能已经把
          // refreshPromise 换成别的了，无条件清空会把新的那次也一起抹掉。
          if (refreshPromise === pending) {
            refreshPromise = undefined;
          }
        });
      refreshPromise = pending;
    }

    return refreshPromise;
  }

  axiosInstance.interceptors.request.use(async (config) => {
    const currentConfig = config as AuthRequestConfig;
    // 盖章：标记这个请求由本实例受理，响应拦截器只处理盖过章的。
    currentConfig.__authManaged = true;
    if (currentConfig.skipAuth) {
      return currentConfig;
    }

    // 刷新进行中就先排队等着，而不是拿着明知已经过期的令牌硬发出去——那样只会白白
    // 换回一个 401，然后走一遍重放流程。等一下反而更快。
    if (refreshPromise) {
      const waitedEpoch = sessionEpoch;
      try {
        await refreshPromise;
      } catch (error) {
        // 等待期间用户重新登录了：上一会话的刷新失败与我无关，拿新凭证继续就行。
        if (sessionEpoch === waitedEpoch) {
          throw error;
        }
      }
    }

    throwIfCanceled(currentConfig);
    // 记下这次用的是第几代凭证。收到 401 时靠它判断「是我的令牌旧了，还是刷新过
    // 之后仍然被拒」——这两种情况的处置完全不同。
    currentConfig.__credentialVersion = credentialVersion;
    adapter.applyCredential(currentConfig);
    return currentConfig;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
      }

      const config = error.config as AuthRequestConfig | undefined;
      if (
        !config ||
        // 只处理盖过章的请求。刷新客户端等别的 Axios 实例产生的错误也可能流经这条
        // 链，把它们当成业务 401 会触发一次本不该发生的刷新。
        !config.__authManaged ||
        error.response?.status !== 401 ||
        config.skipAuth
      ) {
        return Promise.reject(error);
      }

      const requestVersion = config.__credentialVersion ?? credentialVersion;
      // 已经重放过一次还是 401：新令牌都不认，那就是真的没有权限。到此为止，
      // 不再刷新——否则就是死循环。
      if (config.__authRetry) {
        expireOnce(requestVersion);
        return Promise.reject(markHandledAuthError(error, "business"));
      }

      try {
        // 只有「我用的凭证还是当前这一代」才需要刷新。如果 credentialVersion 已经
        // 涨上去了，说明别的请求刚刚刷新成功，本请求直接拿新令牌重放即可。
        if (requestVersion >= credentialVersion) {
          await refreshOnce(requestVersion);
        }

        throwIfCanceled(config);
        config.__authRetry = true;
        // 重放。注意是把整个 config 重新灌回实例，所以它会再走一遍完整的拦截器链，
        // 请求拦截器会在这时给它换上刚刷新出来的新令牌。
        return axiosInstance(config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    },
  );

  return {
    // 用户重新登录时调。它做的是「开一个新会话」，而不是「清理干净」——所有代际都
    // 往前推一格，于是上一会话的在途刷新回来时会发现自己已经过时，自动作废。
    resetAuthState() {
      sessionEpoch += 1;
      credentialVersion += 1;
      failedVersion = undefined;
      failedError = undefined;
      failedAt = 0;
      // 清掉它，新会话才能在需要时重新触发一次 expireSession。
      expiredVersion = undefined;
      // 与在途刷新脱钩：新会话的请求不再排队等上一会话那次刷新的结果。
      refreshPromise = undefined;
    },
  };
}
