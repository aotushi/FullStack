/**
 * 401 自动刷新与重放。这是整个封装里状态最多的文件，先说清楚它在解决什么问题。
 *
 * 场景：页面同时发了 10 个请求，令牌恰好在这一刻过期，于是 10 个请求全部收到 401。
 * 幼稚的实现会打 10 次刷新接口，拿回 10 个新令牌，后面的把前面的挤掉——用户随机
 * 掉线。所以核心诉求是：**无论多少请求同时撞上 401，只刷新一次，然后把它们全部重放**。
 *
 * 围绕这个诉求有六组状态，各自挡住一个坑：
 *
 *   refreshPromise            单飞。已经在刷了就复用同一个 Promise，不发起第二次。
 *   credentialVersion         凭证代际。区分「你拿旧令牌失败」和「新令牌也失败」：
 *                             前者该刷新重放，后者说明是真的没权限，再刷也没用。
 *   failedVersion/Error/At    熔断。刷新接口自己挂掉时，别让每个请求都去捅它一下；
 *                             但也不能永久锁死，所以带一个冷却窗口。
 *   expiredVersion            去重。让 expireSession()（通常是跳登录页）每代只触发
 *                             一次，而不是 10 个请求弹 10 次。
 *   sessionEpoch              会话代际。跨过会话边界（登录、登出）时推进，使上一个
 *                             会话遗留的在途刷新不再影响新状态。
 *   activeTransitions         边界闸。登录/登出执行期间挡住新刷新的产生——代际只能
 *                             作废旧刷新的内存写入，Set-Cookie 拦不到，唯有不让它
 *                             启程。见 runAuthTransition()。
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
  /**
   * 取回新凭证但**不落盘**，返回一个提交函数。写入由认证模块在确认会话代际未变后
   * 执行——若适配器自己写，旧会话的在途刷新回来时已经覆盖了用户刚登录的新凭证，
   * 代际检查只能追认损失。
   */
  refreshCredential(): Promise<() => void>;
  /**
   * 判定一次刷新失败是否意味着凭证已死、会话应当终结。「哪种失败表示 Refresh
   * Token 失效」是后端契约（本项目是刷新端点的 401，OAuth 式后端是
   * 400 + invalid_grant），所以住在适配器里，引擎不内置任何状态码假设。
   * 返回 false 的失败走引擎的熔断冷却，窗口结束后重试。
   */
  shouldExpireSession(error: unknown): boolean;
  expireSession(): void;
}

export interface AuthControl {
  resetAuthState(): void;
  /**
   * 会话边界动作（登录、登出）的执行闸：先挡住新刷新的产生，再排空已在途的刷新，
   * 然后执行 action——边界请求与凭证写入都要放进 action 里闸内完成。代际机制只护
   * 得住内存里的令牌，刷新响应里的 Set-Cookie 由浏览器在响应到达时直接写入，JS
   * 拦不到；闸保证从排空到写入的整个窗口内没有任何认证响应在途或启程，边界动作的
   * 响应就是最后写 Cookie 的那一个。闸内撞上 401 的请求会排队，闸放开后复查凭证
   * 代际：边界已换代就直接用新凭证重放，不再刷新。
   * action 的返回值与异常原样透传；无论成败，闸都会释放。注意 action 里只能发
   * skipAuth 的边界请求——普通请求撞 401 会排队等闸，在 action 里等自己就是死锁。
   */
  runAuthTransition<T>(action: () => Promise<T>): Promise<T>;
  /**
   * 等到没有在途刷新为止。刷新失败也算「落定」，此方法不复抛刷新的错误。
   * 这是 runAuthTransition 的排空原语：单独使用只能清掉「已有的」在途刷新，挡不住
   * 排空之后、边界动作往返期间新起的那一个——会话边界请用 runAuthTransition。
   */
  waitForRefreshSettled(): Promise<void>;
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
  // 会话边界闸：>0 表示登录/登出正在执行。计数而非布尔，是给「边界里又套边界」
  // 这种理论情况留的余量；闸的等待方在 refreshOnce() 顶部。
  let activeTransitions = 0;
  let transitionGate: Promise<void> | undefined;
  let openTransitionGate: (() => void) | undefined;

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
  async function refreshOnce(version: number) {
    // 会话边界（登录、登出）执行期间不起新刷新：边界动作的响应必须是最后写 Cookie
    // 的认证响应，此刻多起的刷新会晚到并把它回盖。等闸放开——用循环是因为醒来时
    // 可能又有新的边界开始了。
    while (transitionGate) {
      await transitionGate;
    }

    // ——闸后复查代际：边界动作若已提交新凭证（登录成功），这个 401 属于上一代，
    // 直接返回让调用方拿新令牌重放；代际没动（比如登录失败了）才继续走刷新。
    if (version < credentialVersion) {
      return;
    }

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
        .then((commitCredential) => {
          // 上一会话的刷新即使成功也要丢弃：它拿回来的是旧会话的令牌，提交了会把
          // 用户刚登录的新凭证覆盖掉。适配器只取回不落盘，落盘由这里把关。
          if (epoch !== sessionEpoch) {
            return;
          }

          commitCredential();
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
            // 只有适配器确认「这次失败意味着凭证已死」才终结会话（本项目的答案
            // 是刷新端点的 401，见适配器；D-65）。网络错、超时、5xx 只说明端点
            // 「暂时无法回答」，此刻清会话会把一次抖动放大成一次强制登出；
            // 留给上面的熔断冷却，窗口结束后自愈。
            if (adapter.shouldExpireSession(error)) {
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
    // 跨过会话边界（登录、登出、切换账号）时调。它做的是「翻过这一页」，而不是
    // 「清理干净」——所有代际都往前推一格，于是上一会话的在途刷新回来时会发现
    // 自己已经过时，自动作废。
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
    async runAuthTransition<T>(action: () => Promise<T>): Promise<T> {
      // ①上闸：从此刻起新撞上 401 的请求只在 refreshOnce() 顶部排队，不再起刷新。
      activeTransitions += 1;
      transitionGate ??= new Promise((resolve) => {
        openTransitionGate = resolve;
      });

      try {
        // ②排空：等已在途的刷新落定（成败都算）。闸已上，排空后不会再冒出新的。
        while (refreshPromise) {
          await refreshPromise.catch(() => undefined);
        }

        // ③执行边界动作：登录/登出请求和凭证写入都在闸内完成，「响应已回、写入
        // 未落」的微任务缝隙也在闸的保护之内。
        return await action();
      } finally {
        // ④放闸：无论 action 成败都释放，唤醒排队的 401 去复查代际。
        activeTransitions -= 1;
        if (activeTransitions === 0) {
          const release = openTransitionGate;
          transitionGate = undefined;
          openTransitionGate = undefined;
          release?.();
        }
      }
    },
    async waitForRefreshSettled() {
      // 用循环而不是单次 await：等待期间可能又有新请求触发下一轮刷新，
      // 要等到「此刻确实没有在途刷新」才放行。
      while (refreshPromise) {
        await refreshPromise.catch(() => undefined);
      }
    },
  };
}
