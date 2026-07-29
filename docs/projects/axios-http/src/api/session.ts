/**
 * 会话状态归项目所有，不属于通用 HTTP 模块。
 *
 * 这里的内存实现只是最小可用样板：Access Token 存在内存里，刷新令牌由后端的
 * HttpOnly Cookie 持有。真实项目通常换成 Pinia、Zustand 或 Redux 中的会话切片，
 * 只要仍然满足 AuthSession 的四个约定即可，通用模块不需要改动。
 *
 * Access Token 不写入 localStorage 或 sessionStorage：那样任何 XSS 都能直接读走它，
 * 而内存中的令牌随页面卸载消失。
 *
 * 它放在 src/api/session.ts 而不是 http/ 目录下，是因为「会话怎么存」是项目状态，
 * 不是 HTTP 传输的一部分。HTTP 模块只通过 adapters/auth.ts 的 AuthAdapter 读写它，
 * 两边靠接口连接，谁都不知道对方的实现。
 */
export interface AuthSession {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  /** 刷新失败、会话作废时调用，只清状态。 */
  clearSession(): void;
  /** 清完之后通知项目做跳转登录页之类的动作。跟 clearSession 分开，是因为 auth.ts
   *  会保证它整个会话只触发一次，避免并发的五个请求弹五次登录框。 */
  onExpired(): void;
}

export interface CreateMemoryAuthSessionOptions {
  initialAccessToken?: string | null;
  onExpired: () => void;
}

export function createMemoryAuthSession(
  options: CreateMemoryAuthSessionOptions,
): AuthSession {
  let accessToken = options.initialAccessToken ?? null;

  return {
    getAccessToken() {
      return accessToken;
    },

    setAccessToken(token) {
      accessToken = token;
    },

    clearSession() {
      accessToken = null;
    },

    onExpired: options.onExpired,
  };
}
