# 认证与凭证刷新

本页对应学习路径的阶段七。它排在所有能力的最后，因为它是唯一一个**状态多到需要
先画图**的模块。

## 场景

页面同时发了 10 个请求，令牌恰好在这一刻过期，10 个请求全部收到 401。

## 先写最直觉的那版

```ts
// 幼稚版
axiosInstance.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    await refresh(); // ← 10 个请求各调一次
    return axiosInstance(error.config);
  }
  return Promise.reject(error);
});
```

## 它塌在哪

1. **打 10 次刷新接口**，拿回 10 个新令牌，后面的把前面的挤掉——用户随机掉线。
2. **重放还是 401 就无限递归**，浏览器标签页卡死。
3. **刷新请求自己收到 401 时**，也会走进这个拦截器，再触发一次刷新。
4. **刷新接口挂了的时候**，每个请求都去捅它一下。
5. **10 个请求各弹一次「登录已过期」**。

## 现在的写法：五组状态各挡一个坑

```text
refreshPromise           单飞。已经在刷了就复用同一个 Promise      → 挡 ①
__authRetry              已经重放过一次就不再刷新                   → 挡 ②
__authManaged            只处理本实例盖过章的请求                   → 挡 ③
failedVersion/Error/At   熔断 + 冷却窗口                            → 挡 ④
expiredVersion           expireSession() 每代只触发一次             → 挡 ⑤
credentialVersion        凭证代际：区分「旧令牌失败」和「新的也失败」
sessionEpoch             会话代际：用户重新登录时推进
```

正常的失效流程：

```text
10 个业务请求返回 401
        ↓
   共享 refreshPromise
        ↓
      1 次刷新
        ↓
 10 个请求分别重放一次
```

共享的是**刷新过程**，不是业务请求结果。每个业务请求仍然有自己的 Promise、取消状态、
尝试次数和最终结果。401 重放也是「一次逻辑请求产生多次物理尝试」的第二个来源
（第一个是[重试](./lifecycle.md)）。

## 凭证代际：为什么不能只看 401

```ts
if (requestVersion >= credentialVersion) {
  await refreshOnce(requestVersion);
}
```

如果 `credentialVersion` 已经涨上去了，说明**别的请求刚刚刷新成功**，本请求直接拿新
令牌重放即可，不必再刷一次。少了这个判断，10 个并发就算有单飞也会串行地刷 10 轮。

## 熔断为什么必须带冷却

刷新失败的原因不可知。刷新端点返回 401 说明 Refresh Token 真的失效了，但它也可能只是
掉线一秒或者撞上一次 5xx。

没有冷却，后一种情况会让客户端把这一秒的抖动**记到页面关闭为止**：凭证仍然有效、
服务端早已恢复，但每个后续请求都只拿到缓存里的旧错误，用户除了刷新页面无路可走。

有了冷却窗口：窗口内仍然只打一次刷新端点（并发去重达成），窗口结束后放行一次新的
尝试（自愈达成）。它是**熔断**，不是终身锁定。

## 会话代际：登录发生在刷新在途时

```ts
authSession.setAccessToken(result.accessToken);
http.resetAuthState(); // 顺序不能反
```

`resetAuthState()` 做的是「开一个新会话」而不是「清理干净」——所有代际往前推一格，
于是上一会话在途的刷新回来时会发现自己已经过时，自动作废：

- 它成功了也丢弃——拿回来的是旧会话的令牌，写进去会覆盖用户刚登录的新凭证。
- 它失败了也不调 `expireSession()`——否则会把刚登录的会话立刻清掉。
- 已经在等它的请求忽略这个失败，改用新凭证继续。

自动刷新成功时模块已自行推进版本，不需要调这个方法。它只用于登录、重新登录、切换
账号这些**会话边界**。

## 独立实例还不够：链路隔离

刷新用的是独立的裸 Axios 实例，但两条链路**并没有因此自动隔离**：

```text
业务请求 → 请求拦截器 await refreshPromise
                    ↓ 刷新失败
        业务实例的响应错误拦截器收到刷新的 AxiosError
                    ↓ config.url = "/auth/refresh", status = 401
        误判成业务 401 → 重放刷新请求 → 其响应成为业务请求的结果
```

所以请求拦截器要盖章 `__authManaged = true`，响应拦截器把没盖章的错误原样放行。
判断「这个错误是不是我该处理的」时，**状态码和 URL 都不够，必须确认它来自本实例**。

## 令牌存哪

```text
Access Token   内存（会话对象里）
Refresh Token  HttpOnly Cookie，前端读不到
```

Access Token 不写 `localStorage`/`sessionStorage`：那样任何 XSS 都能直接读走它，而
内存中的令牌随页面卸载消失。

会话对象放在 `session.ts` 而不是 `http/` 下——会话怎么存是**项目状态**，真实项目会
换成 Pinia / Zustand / Redux 切片。HTTP 模块只通过 `AuthAdapter` 读写它。

`withCredentials: true` 只开在刷新实例上，跨域 Cookie 的暴露面被压到一个接口。

### AuthSession 的 Pinia 实现

`createMemoryAuthSession()` 可以直接投产，它唯一的局限是**不响应式**：导航栏显示
用户名、路由守卫判断登录态，UI 要的是能 watch 的状态。所以换 Pinia 的动机是响应式，
不是给 token 换个存储位置。用 store 实现同一个 `AuthSession`，通用模块零改动：

```ts
// stores/session.ts —— UI 直接消费 store 的响应式状态
export const useSessionStore = defineStore("session", () => {
  const accessToken = ref<string | null>(null);
  const isAuthenticated = computed(() => accessToken.value !== null);
  return { accessToken, isAuthenticated };
});
```

```ts
// 应用入口的装配处 —— store 适配成 AuthSession 的四个约定
const store = useSessionStore();

const session: AuthSession = {
  getAccessToken: () => store.accessToken,
  setAccessToken: (token) => {
    store.accessToken = token;
  },
  clearSession: () => {
    store.accessToken = null;
  },
  onExpired: () => {
    router.push("/login");
  },
};
```

接线去向和内存版完全一样：`getAccessToken`/`setAccessToken` 直传给
`createBearerAuthAdapter`，`clearSession` + `onExpired` 合成它的 `expireSession`——
`test/http-client.test.ts` 开头的 `createTestAuth` 就是现成模板。两个配置要点：

- **不装持久化插件。** 持久化插件会把 token 写进 localStorage，本节开头的安全立场
  就被一个插件改掉。刷新页面后的会话不靠持久化恢复：启动时用 HttpOnly Cookie 调
  一次刷新接口，成功即有会话，失败即未登录。
- **装配晚于 `app.use(pinia)`。** `useSessionStore()` 要求 Pinia 实例已激活，所以
  「创建带 auth 的 http」要放进应用入口的装配流程，不能像内存版那样在模块顶层执行。

真实项目 admin-backend-3 用的是更严格的三层版本：token 的唯一权威（SSOT）是
`api/session.ts` 里的模块级内存变量，连 Pinia 都不放；Pinia store 只订阅它的变更、
给 UI 做响应式镜像；请求层依赖注入的会话接口，从不 import Pinia：

```text
api/http/*        无状态请求套件，只认注入的会话接口     对应本工程 http/
api/session.ts    内存 SSOT，真正持有 token              对应本工程 session.ts
stores/auth.ts    Pinia 响应式镜像 + 路由联动            本工程未含（UI 层）
```

多拆这层的收益是换 UI 框架时会话逻辑原地不动，代价是多一份订阅同步代码；中小项目
用上面的 Pinia 版本就够。该项目的进阶能力——过期前 ≤30 秒主动续期、Web Locks
跨标签页刷新互斥、BroadcastChannel 会话复用——也全部长在会话协调层，请求套件依赖
的始终是同一个注入接口。

## 换一种认证方案会怎样：格式、架构与插件接缝

到这里为止讲的都是「这套方案怎么工作」。最后回答一个换后端时必然遇到的问题——
后端同学说：「我们用的是 JWT，不是你们这套双 token。」前端封装要改多少？

答案取决于「JWT」这个词在指什么。它经常同时承载两个概念，先拆开：

| 概念     | 说的是什么                                                                          | 取值举例                                      |
| -------- | ----------------------------------------------------------------------------------- | --------------------------------------------- |
| **格式** | 令牌字符串本身怎么编码（RFC 7519：三段 Base64、带签名、payload 可含过期时间 `exp`） | JWT / 不透明随机串                            |
| **架构** | 有几个凭证、怎么续期                                                                | 单 token 过期重登 / Access + Refresh 双 token |

两者正交：双 token 架构里的 access token 完全可以是 JWT 格式——而且这是主流生产
形态。可以自查：找任何一个 OAuth2/OIDC 后端（Auth0、Keycloak、Cognito……），登录
响应里 `access_token` 和 `refresh_token` **同时存在**，把 `access_token` 粘到 jwt.io
能解开。双 token 和 JWT 在同一个响应里同时成立，因为它们不在同一个维度上。

教程里的「JWT 单 token 方案」（一个无状态 JWT 替代服务端会话）真实存在，但它是这个
领域的「幼稚版」：服务端不存状态，签出去的令牌**到期前无法吊销**，于是只能选长寿命
（被偷就完）或短寿命（频繁重登）。生产为解决这个矛盾收敛出来的形态，恰恰是「短寿命
JWT + Refresh Token 续期」——绕回了双 token。

所以最常见的情况是：**后端说「我们用 JWT」，指的只是令牌格式 → 零改动。**
本封装从头到尾不解码令牌——没有一处 decode，没有 jwt-decode 依赖，`Bearer ${token}`
里的字符串长什么样它不知道也不关心。[阶段二](./minimal-client.md)把信封 `code` 当
元数据、不拿它判定成败，这里不解码令牌、不拿 payload 做判定——同一个决定的两次
出现：不消费的信息不解析，换格式才能不改代码。

### 认证空间的两条轴

真正需要动手的是**架构**变了。整个空间用两条正交轴就能描述：

| 轴             | 取值                                               | 当前实现              |
| -------------- | -------------------------------------------------- | --------------------- |
| 有没有续期凭证 | 无（过期重登） / 有（Refresh Token）               | 有（HttpOnly Cookie） |
| 刷新何时触发   | 被动（收到 401 后） / 主动（已知过期时间，提前续） | 被动                  |

令牌格式不在任何一轴上。

顺带澄清一个常见误解：**无感刷新 ≠ 主动刷新**。「无感」指调用方无感——本页前面那套
「401 → 单飞刷新 → 重放」就已经是无感刷新，原请求的 Promise 从头到尾没断过，只是慢
了一拍。主动刷新（利用已知过期时间提前续）省掉的只是那一次注定失败的 401 往返，
它是无感刷新的**优化**，不是前提。而且过期时间未必来自解析 JWT：OAuth2 标准本来就在
令牌响应体里给 `expires_in` 字段，所以连主动刷新都不绑定 JWT 格式。

### 换方案 = 换插件

方案没有写死在状态机里。auth.ts 只依赖三个动作，这就是插件契约：

| 契约方法                  | 回答的问题       | 当前实现（Bearer + Cookie）                 |
| ------------------------- | ---------------- | ------------------------------------------- |
| `applyCredential(config)` | 凭证怎么带上请求 | 设 `Authorization: Bearer <内存里的 token>` |
| `refreshCredential()`     | 401 之后怎么续期 | 调刷新接口，浏览器自动带 Refresh Cookie     |
| `expireSession()`         | 续不动了怎么办   | 清会话、跳登录页                            |

单飞、熔断冷却、会话代际、重放去重——全在状态机里，**任何插件免费继承**。

### 实例：后端真的是单 token JWT

先向后端确认一件事：**过期之后是直接重新登录，还是有「拿旧 token 换新 token」的
续期接口？**两种答案对应两个变体。

**变体 (a)：过期即重登。**

```ts
// adapters/jwt-auth.ts —— 整个适配就这一个新文件
export function createJwtAuthAdapter(options: {
  getAccessToken(): string | null;
  expireSession(): void;
}): AuthAdapter {
  return {
    applyCredential(config) {
      const token = options.getAccessToken();
      if (token) config.headers.set("Authorization", `Bearer ${token}`);
      else config.headers.delete("Authorization");
    },
    // 后端没有续期接口：刷新即失败，状态机会接住它走 expireOnce
    async refreshCredential() {
      throw new Error("Single-token scheme has no refresh endpoint");
    },
    expireSession: options.expireSession,
  };
}
```

「没有刷新还装认证模块干什么？」——装的不是刷新，是它周边的保障：

- 10 个并发 401 → `refreshCredential` 只被调**一次**（单飞），`expireOnce` 保证登录页
  只跳**一次**，不是弹 10 次；
- 失败进入冷却缓存，后续 401 不再反复捅一个不存在的接口；
- 错误被标记「认证已处理」，全局 Toast 不会和跳登录叠在一起。

**变体 (b)：旧 token 换新 token（滑动过期）。**

在 (a) 的基础上把 `refreshCredential` 换成真的；工厂参数相应多收三项——写回新
token 的 `setAccessToken`、从续期响应里挑出新 token 的 `selectAccessToken`、可选的
`renewUrl`：

```ts
// 续期走独立裸实例——它身上没有业务拦截器，自己收到 401 不会再触发一次续期。
// 注意没有 withCredentials：本方案没有 Cookie，凭证就是旧 token 本身，放 header 里。
const renewClient = axios.create({ baseURL, timeout: 10_000 });

async refreshCredential() {
  const current = options.getAccessToken();
  if (!current) throw new Error("No token to renew");
  const response = await renewClient.post(options.renewUrl ?? "/auth/renew", null, {
    headers: { Authorization: `Bearer ${current}` },
  });
  options.setAccessToken(options.selectAccessToken(response));
}
```

对照前面「令牌存哪」的 Cookie 方案，差异只有两点：凭证从 Cookie 变成旧 token 进
header；不再需要 `withCredentials`。

但 (b) 有一个结构性时序问题，这是它和双 token 最大的不同：**旧 token 是唯一凭证，
过期之后就没有任何东西能换新的了**；而被动触发恰恰要等到过期后的第一个 401 才知道
过期——等状态机反应过来，续期接口只会说「这个 token 已经失效」。所以 (b) 几乎必然
要配主动触发。这是主动刷新从「优化」升格为「必需」的唯一场景。两种引入方式：

- adapter 内部自己起定时器，在过期前调续期——零契约改动，今天就能做；
- 给 `AuthAdapter` 加一个可选的「凭证是否将过期」方法，状态机在发送前多一个触发点，
  复用 `refreshOnce` 的全部并发保障——契约扩展，更干净。

无论哪种，**401 被动路径必须原样保留**：客户端时钟会偏、服务端会提前吊销令牌，
主动预判永远可能失手。

改动清单：

| 文件                                                      | 动不动                               |
| --------------------------------------------------------- | ------------------------------------ |
| `adapters/jwt-auth.ts`                                    | **新增**，整个适配的全部内容         |
| `index.ts`                                                | 装配那一行换成新工厂                 |
| `session.ts`                                              | 不动——它存的本来就是内存里一个字符串 |
| `auth.ts` 状态机 / `client.ts` / `errors.ts` / `retry.ts` | 不动                                 |
| 登录接口                                                  | 照旧 `skipAuth: true`                |

两个教程常见做法这里明确不跟：token 仍放内存、不进 localStorage（XSS 一读一个准，
换方案不改变这条）；前端不验签、不拿 payload 做业务判断——decode 出 `exp` 最多用于
(b) 的续期时机，令牌真伪永远由后端裁决（和「HTTP 状态是唯一权威」同一精神）。

### 什么时候必须改契约，而不是写新插件

三条边界，撞上任何一条，新增 adapter 文件就不够了：

1. **`applyCredential` 是同步的**——每次请求都要 `await` 的方案（WebCrypto 算签名、
   发送前确认过期）装不进去；
2. **状态机假设「401 = 凭证问题、可续期」**——用 403 表达过期、或走
   `WWW-Authenticate` 协商的方案对不上；
3. **一个客户端实例只有一条刷新轨道**——两套独立续期的凭证（比如用户态 + 应用态）
   会在同一个 `credentialVersion` 上打架。

最后是选择发生的时刻。方案选择留在**装配时**——index.ts 组装的那一行——不预建
「认证方案注册表」。这和本封装另外两个决定是同一条规则：

| 决策                                   | 消除的不确定性                  | 保留的东西             |
| -------------------------------------- | ------------------------------- | ---------------------- |
| [Loading 不建 Adapter](./lifecycle.md) | 项目端永远只有显示/隐藏两个动作 | 一个布尔回调           |
| [retry 默认关闭](./lifecycle.md)       | 接数据请求层后重试归上层        | 按请求显式开启的口子   |
| 认证不建注册表                         | 每个部署只有一个方案在跑        | `AuthAdapter` 接缝本身 |

规则一句话：**接缝便宜，尽管留；机制贵，等需求。**哪天真出现「同一个构建要面对多种
后端方案」（多租户、私有化交付、SDK 化），注册表用动态 import 加在装配层，按启动
配置只加载一个 adapter，核心一行不动。

## 自己验证

`test/auth-session-isolation.test.ts` 覆盖会话代际；
`test/http-client.test.ts` 里有并发 401 只刷新一次的用例。

另做一道不用写代码的推演题：把本页开头「10 个请求全部收到 401」的场景套在变体 (a)
上，推演三个问题——`refreshCredential` 会被调几次？登录页会跳几次？冷却窗口内随后
到达的 401 拿到什么？（答案都藏在那五组状态里：一次；一次；复用缓存的失败，不再打
续期接口。）

---

## 本页源码

构建时从 `docs/projects/axios-http/` 的真实文件直读，和测试跑的是同一份。每个文件头
注释是该文件的地图。`auth.ts` 建议先把文件头那五组状态看明白再读实现。

::: code-group

<<< @/projects/axios-http/src/api/http/auth.ts [http/auth.ts]

<<< @/projects/axios-http/src/api/http/adapters/auth.ts [http/adapters/auth.ts]

<<< @/projects/axios-http/src/api/session.ts [session.ts]

:::
