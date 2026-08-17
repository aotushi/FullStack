import { http, type User } from "./http";

if (false) {
  // 白名单内：描述这一次请求。
  const user: Promise<User> = http.get<User>("/users/1", {
    headers: { "x-trace": "1" },
    params: { source: "profile" },
    signal: new AbortController().signal,
    timeout: 5_000,
  });

  // @ts-expect-error baseURL 只能在创建客户端时确定。
  http.get<User>("/users/1", { baseURL: "https://other.example" });

  // @ts-expect-error 跨站 Cookie 策略只能在创建客户端时确定。
  http.get<User>("/users/1", { withCredentials: true });

  // @ts-expect-error 单次请求不能替换 Axios 传输层。
  http.get<User>("/users/1", { adapter: () => Promise.reject(new Error()) });

  // @ts-expect-error 响应体必须先经过信封适配器。
  http.get<User>("/users/1", { transformResponse: [] });

  void user;
}
