/**
 * 认证适配器：把「本项目用 Bearer Token + Cookie 刷新」这套具体做法，翻译成 auth.ts
 * 要的四个动作（带凭证、刷新凭证、判定终结、作废会话）。
 *
 * auth.ts 那边只管**什么时候**刷新（单飞、冷却、重放）与**要不要采纳**刷新结果
 * （会话代际把关），完全不知道令牌长什么样。换成别的认证方案——自定义 header、
 * 双 token、OAuth——只需要另写一个这样的文件。
 */

import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import type { AuthAdapter } from "../auth";

export interface CreateBearerAuthAdapterOptions {
  baseURL: string;
  timeout?: number;
  refreshUrl?: string;
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  selectAccessToken(response: AxiosResponse<unknown>): string;
  expireSession(): void;
}

export function createBearerAuthAdapter(
  options: CreateBearerAuthAdapterOptions,
): AuthAdapter {
  // 刷新走一个**独立的** Axios 实例，这是关键设计而不是随手为之：
  //
  //   · 它身上没装业务实例的拦截器，所以刷新请求自己收到 401 时不会再触发一次刷新，
  //     否则就是无限递归。
  //   · withCredentials: true 只开在这一个实例上。刷新令牌是 HttpOnly Cookie，只有
  //     刷新接口需要带它；业务请求默认不带（见 client.ts），跨域 Cookie 的暴露面
  //     就被压到了一个接口。
  const refreshClient = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? 10_000,
    allowAbsoluteUrls: false,
    withCredentials: true,
    transitional: {
      clarifyTimeoutError: true,
    },
  });

  return {
    applyCredential(config: InternalAxiosRequestConfig) {
      const accessToken = options.getAccessToken();
      if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      } else {
        // 没有令牌时要主动**删掉** header，不能只是不设。重放的请求用的是同一个
        // config 对象，上面还留着退出登录前的旧令牌。
        config.headers.delete("Authorization");
      }
    },

    async refreshCredential() {
      const response = await refreshClient.post<unknown>(
        options.refreshUrl ?? "/auth/refresh",
      );
      // 解析在取回时就做——响应格式不对属于「这次刷新失败」，要立刻抛出去。
      const accessToken = options.selectAccessToken(response);

      // 只取回不落盘：写入由认证模块确认会话代际未变后执行。刷新在途期间用户可能
      // 已经重新登录或登出，这里直接写会把旧会话的令牌盖到新状态上。
      return () => {
        options.setAccessToken(accessToken);
      };
    },

    shouldExpireSession(error) {
      // 本项目的后端契约：刷新端点用且仅用 401 表示 Refresh Token 失效（D-65）。
      // 这是项目约定而非通用规律——OAuth 式后端就用 400 + invalid_grant 表达
      // 同一件事，接那种后端时换掉这一条判定即可。
      return axios.isAxiosError(error) && error.response?.status === 401;
    },

    expireSession: options.expireSession,
  };
}
