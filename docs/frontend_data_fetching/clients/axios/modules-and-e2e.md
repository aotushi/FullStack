# 业务模块与端到端

本页对应学习路径的阶段八，然后把前面所有阶段接成三条端到端路径，最后给出练习和
验证资料。

## 阶段八：业务模块与页面

### 场景

页面要「创建用户」，用户名重复时在表单里内联提示。

### 先写最直觉的那版

```ts
// 幼稚版：页面直接调
try {
  await http.post("/users", { name });
} catch (e) {
  if (e.status === 409) setFieldError("name", "用户名已存在");
}
```

### 它塌在哪

页面被迫知道两件它不该知道的事：**接口 URL** 和 **HTTP 状态码的业务含义**。
接口改路径要全局搜索；同一个 409 在三个页面各翻译一遍，措辞还不一致。

### 现在的写法

业务模块夹在中间，把传输概念翻译成领域概念：

```ts
export async function createUser(input: CreateUserInput): Promise<User> {
  try {
    // silent 关掉全局 Toast，因为 409 要显示在表单字段旁边。
    // 注意它只关展示，不关上报——监控里照样看得到。
    return await http.post<User, CreateUserInput>("/users", input, {
      errorMode: "silent",
    });
  } catch (error) {
    // 只翻译自己认识的那一个状态码，其余原样抛出去。
    if (error instanceof HttpError && error.status === 409) {
      throw new UserAlreadyExistsError(error); // 原错误挂在 cause 上
    }
    throw error;
  }
}
```

页面只 `catch UserAlreadyExistsError`，完全不需要知道 HTTP 是什么。

最容易写错的是**把 `catch` 写宽**——网络断了也提示用户换个名字。只翻译认识的，其余
原样往上抛。

### 职责划分

| 层        | 负责                                         | 不负责                 |
| --------- | -------------------------------------------- | ---------------------- |
| 页面      | 领域概念、UI 反馈                            | URL、HTTP 方法、状态码 |
| 业务模块  | URL、方法、类型、silent/retry 策略、领域错误 | 传输细节、认证         |
| HTTP 核心 | 传输、协议、错误分类、认证、生命周期         | 用户文案、业务语义     |

---

## 端到端：三条路径

前面每个阶段各看一段，这里把它们接起来。

**普通成功**

```text
页面 createUser() → users.ts → post() 补齐 method/url/data
  → request() 指定选 response.data → execute() 建立逻辑请求、开 Loading
  → 请求链 Auth(附令牌) → RequestControl(计数+1) → 网络
  → 响应链 RequestControl(清理) → Envelope(解包成 User) → Auth(非 401 放行)
  → select(response) 取出 User → finally 关 Loading → 页面得到 User
```

**GET 撞上 503 后重试成功**

```text
send() 第一次 → 503 → 归一化 HttpError(http, 503)
  → retry() 判定可重试 → 检查总预算 → 等待带抖动的退避
  → send() 第二次 → 200 → Envelope 解包 → 返回结果
整个过程 Loading 只开关一次，不触发任何错误回调
```

**401 刷新后重放**

```text
业务请求带旧令牌 → 401 → Auth 响应拦截器启动或等待共享刷新
  → 刷新实例（独立、withCredentials）拿到新 Access Token → credentialVersion +1
  → 原请求标记 __authRetry → 重新灌回实例，走完整拦截器链（这时换上新令牌）
  → 200 → Envelope 解包 → execute() 返回结果
逻辑 Loading 只开关一次，物理尝试计数为 2
```

---

## 练习

**每次只加一个能力，并为它写一个能跑的验证用例。** 不要一次复制完整目录。

1. 用原生 Axios 取一个用户，说清 `response` 和 `response.data` 的区别
2. 写 `ApiEnvelope` 的格式校验函数，处理 `data: null` 和缺字段两种情况
3. 写只有 `get<Result>` 的最小入口
4. 加 `post<Result, Body>`，验证请求体类型约束生效
5. 加 `raw()`，比较两者返回值
6. 把网络、超时、HTTP 错误统一成一个错误类型
7. 接一个 Presenter，让同一个错误在两种语言下显示不同文案
8. 加单请求取消，验证取消后不展示也不上报
9. 加 Loading 计数，验证并发三个请求只开关一次
10. 实现单飞刷新与重放，验证 10 个并发 401 只打一次刷新接口

第 10 项建议留到最后，它是唯一需要同时处理并发、代际和重入的练习。

---

## 验证资料

| 文件                                  | 覆盖                                |
| ------------------------------------- | ----------------------------------- |
| `test/http-client.test.ts`            | 请求流程、认证、取消、Loading、重试 |
| `test/protocol-and-utilities.test.ts` | 协议解包、错误分类、工具函数        |
| `test/auth-session-isolation.test.ts` | 会话代际与链路隔离                  |
| `test/failure-budgets.test.ts`        | 刷新冷却窗口、重试总预算            |
| `test/session-sync.test.ts`           | 跨标签页会话同步与事件屏障          |
| `test/users-module.test.ts`           | 业务领域错误转换                    |
| `test/typecheck.ts`                   | 配置白名单的类型约束                |
| `browser-tests/http-browser.spec.ts`  | 必须在真实浏览器验证的行为          |

```bash
cd docs/projects/axios-http
pnpm install
pnpm check
```

遇到读不懂的局部代码，先确定它属于哪个阶段，再单独分析。**不要让一个底层类型声明
打断整条请求主线。**

---

## 本页源码

构建时从 `docs/projects/axios-http/` 的真实文件直读，和测试跑的是同一份。装配入口和
业务模块：

::: code-group

<<< @/projects/axios-http/src/api/http/index.ts [http/index.ts]

<<< @/projects/axios-http/src/api/modules/users.ts [modules/users.ts]

:::

测试与配置——上面验证资料表格里的全部文件：

::: code-group

<<< @/projects/axios-http/test/http-client.test.ts [http-client.test.ts]

<<< @/projects/axios-http/test/protocol-and-utilities.test.ts [protocol-and-utilities.test.ts]

<<< @/projects/axios-http/test/auth-session-isolation.test.ts [auth-session-isolation.test.ts]

<<< @/projects/axios-http/test/failure-budgets.test.ts [failure-budgets.test.ts]

<<< @/projects/axios-http/test/session-sync.test.ts [session-sync.test.ts]

<<< @/projects/axios-http/test/users-module.test.ts [users-module.test.ts]

<<< @/projects/axios-http/test/typecheck.ts [typecheck.ts]

<<< @/projects/axios-http/browser-tests/http-browser.spec.ts [http-browser.spec.ts]

<<< @/projects/axios-http/vitest.config.ts [vitest.config.ts]

<<< @/projects/axios-http/playwright.config.ts [playwright.config.ts]

<<< @/projects/axios-http/package.json [package.json]

:::
