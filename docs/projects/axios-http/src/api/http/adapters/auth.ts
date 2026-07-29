/**
 * 认证适配器：把「本项目用 Bearer Token + Cookie 刷新」这套具体做法，翻译成 auth.ts
 * 要的三个动作（带凭证、刷新凭证、作废会话）。
 *
 * auth.ts 那边只管**什么时候**刷新（单飞、冷却、重放），完全不知道令牌长什么样。
 * 换成别的认证方案——自定义 header、双 token、OAuth——只需要另写一个这样的文件。
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
      options.setAccessToken(options.selectAccessToken(response));
    },

    expireSession: options.expireSession,
  };
}
