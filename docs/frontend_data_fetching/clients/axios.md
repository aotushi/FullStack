# Axios 请求层：先看懂，再深入

<script setup lang="ts">
import AxiosFlowExplorer from "./components/axios-flow/AxiosFlowExplorer.vue";
</script>

这套方案整理自 `admin-backend-3/apps/page/src` 的真实前端代码。它要解决的不是“怎么发一个
Axios 请求”，而是：**页面只说自己要什么数据，认证、响应解包、错误、重试、取消和会话同步
由各自模块接力完成。**

先记住一句话：

> 页面调用业务 API 函数；业务 API 调用 `http`；`http` 把后端响应处理成页面真正需要的数据。

页面之所以看起来复杂，是因为原代码同时包含“业务分层”和“请求内部流程”。把这两条轴分开，
整套封装就容易读了。

## 先看完整流程

下面不是概念示意图，而是按当前代码职责整理出的模块地图。第一次只看蓝绿主线；之后切到
“401 刷新”或“失败与重试”，再点开节点看输入和输出。

<AxiosFlowExplorer />

## 30 秒建立心智模型

一次普通的用户列表请求，调用关系只有四句：

```ts
// 1. 页面不碰 Axios，只使用查询状态
const usersQuery = useUsersListQuery();

// 2. query 指定真正取数据的业务函数
query: getUsersApi;

// 3. 业务函数声明方法、路径和返回类型
export function getUsersApi() {
  return http.get<AdminUserListItem[]>("/api/users/list");
}

// 4. 页面最终拿到 AdminUserListItem[]，不是 AxiosResponse，也不是后端信封
```

中间发生的事情虽然多，但可以压缩成六层：

| 层         | 主要文件                                      | 只回答一个问题                                  |
| ---------- | --------------------------------------------- | ----------------------------------------------- |
| 页面       | `views/*.vue`                                 | 用户现在要做什么？                              |
| 服务端状态 | `queries/*.ts`                                | 数据是否在加载、缓存何时失效？                  |
| 业务 API   | `api/modules/*.ts`                            | 请求哪个接口，参数和结果是什么类型？            |
| HTTP 门面  | `api/http/index.ts`                           | 当前项目使用哪一个客户端和哪套协议？            |
| HTTP 核心  | `client.ts`、`request-control.ts`、`retry.ts` | 一次逻辑请求怎么开始、发送和收尾？              |
| 项目适配器 | `adapters/*`、`session*.ts`                   | token、响应信封、错误文案和多标签页规则是什么？ |

这六层不是为了“文件越多越专业”。它们让改动有固定落点：新增用户接口不会碰刷新状态机，
修改后端信封也不会迫使所有页面一起改。

## 正常请求是怎么回来的

以 `http.get<AdminUserListItem[]>("/api/users/list")` 为例：

1. `client.ts` 创建一个**逻辑请求**，登记开始时间、取消控制器和可选 Loading。
2. 如果调用方显式开启重试，`retry.ts` 包住本次发送；写请求不会进入自动重试。
3. Auth 请求拦截器读取内存 access token，写入 `Authorization`，并记录凭证代际。
4. `request-control.ts` 记录一次**物理尝试**，组合取消信号，然后 Axios 发出请求。
5. 响应回来后，Request Control 先清掉这次物理尝试留下的监听器和控制器。
6. `adapters/envelope.ts` 校验 `{ success: true, data }`，把 `data` 放回响应。
7. Auth 的成功分支原样放行；`client.ts` 取出 `response.data`。
8. Promise 回到业务模块和 query，页面得到 `AdminUserListItem[]`。

这里最重要的不是拦截器语法，而是两个概念：

| 概念     | 含义                     | 例子                           |
| -------- | ------------------------ | ------------------------------ |
| 逻辑请求 | 调用方眼里的一次 Promise | 页面加载一次用户列表           |
| 物理尝试 | 真正发送的一次 HTTP 请求 | 首次发送、退避重试、401 后重放 |

一次逻辑请求可以包含多次物理尝试，所以 Loading 只开关一次，最终错误只通知一次，
`attempts` 却能记录真实发送次数。

## 401 为什么不会把页面代码弄乱

业务请求收到 401 后，Auth 响应拦截器接管恢复过程：

1. 先确认它是当前实例管理的请求，并且没有 `skipAuth`。
2. 如果这个请求已经重放过一次，立即停止，防止无限循环。
3. 如果别的请求已经刷新出更新一代凭证，直接使用新凭证重放。
4. 否则进入 `refreshOnce()`；同一标签页的并发 401 共享同一个 `refreshPromise`。
5. `adapters/auth.ts` 使用**独立 Axios 实例**调用 `/api/auth/refresh`。独立实例没有业务
   拦截器，因此刷新接口自己的 401 不会再次触发刷新。
6. 刷新成功后，把完整会话写入 `session.ts`，原请求带新 Bearer token 最多重放一次。
7. `session-bridge.ts` 观察会话变化，通过 `session-sync.ts` 广播给其他标签页。

失败时还有一条很关键的边界：

- 刷新接口明确返回 401：refresh 会话已失效，结束当前会话。
- 刷新接口网络错误、超时或 5xx：只是暂时无法刷新，保留会话并短暂熔断，避免请求风暴。
- 刷新成功后原业务请求仍返回 401：新凭证也不被接受，结束会话，不再刷新。

因此页面只等待原来的 Promise。它不需要排队并发请求，也不需要自己保存 token 或重发请求。

## 拦截器顺序为什么容易看反

`client.ts` 的安装顺序同时控制两个方向：

```text
注册顺序：RequestControl → Envelope → Auth

请求执行：Auth → RequestControl → 网络
响应成功：网络 → RequestControl → Envelope → Auth
响应失败：网络 → RequestControl → Auth
```

原因有两条：

- Axios 的请求拦截器按注册的**逆序**执行，响应拦截器按注册的**顺序**执行。
- Envelope 只注册成功响应处理器，不参与请求，也不处理失败响应。

Auth 必须位于响应链最后。它在 401 后重放整个 config；如果后面还有 Envelope，重放结果可能
被再次解包，最终被误判成协议格式错误。

## 错误不是一句“请求失败”

错误处理被拆成三段，每段只做一件事：

| 模块                          | 职责                                                                                 | 不做什么       |
| ----------------------------- | ------------------------------------------------------------------------------------ | -------------- |
| `errors.ts`                   | 归一化为 `http / network / timeout / cancel / configuration / unknown`，补安全上下文 | 不写用户文案   |
| `adapters/error-presenter.ts` | 把稳定分类翻成用户能理解的提示；4xx 可采用服务端文案，5xx 用安全兜底                 | 不决定是否展示 |
| `client.ts`                   | 决定是否调用 `onError` 和 `onReport`，最后把同一个错误抛回调用方                     | 不吞掉请求结果 |

分发规则也很明确：

- `cancel`：不提示，也不上报。
- `errorMode: "silent"`：页面接管提示，但监控仍能收到错误。
- Auth 已处理的会话错误：只上报，不叠加第二个全局提示。
- 其他最终错误：展示、上报，并继续抛给 query 或页面。

重试发生在“最终通知”之前。只有 GET / HEAD / OPTIONS，且错误属于网络、超时或
502/503/504，才可能在总时间预算内退避重试；POST / PUT / PATCH 即使显式传入配置也不
自动重试。

## 协议约定先确认

当前项目不是任意后端都能直接套用，它依赖这些约定：

```ts
// 2xx 成功
interface ApiEnvelope<Data> {
  success: true;
  data: Data;
}

// 4xx / 5xx 失败
interface ApiFailure {
  error: string;
  code?: string;
}
```

- HTTP 状态码是成功或失败的权威；`2xx + success: false` 会被视为协议违约。
- `204 No Content` 返回 `undefined`，不要求信封。
- 文件下载调用 `raw()`，保留完整响应和 `Content-Disposition`，并跳过信封解包。
- access token 只放内存；refresh 凭证由 HttpOnly Cookie 承载，前端不能读取。
- 登录和退出用 `skipAuth: true` 表示不附 Bearer、不参与 401 自动刷新；这不等于禁止浏览器
  携带 Cookie。

如果另一个后端使用 `code / message / data`，或用 `200 + 业务码` 表达失败，优先改
`adapters/envelope.ts`，不要把协议判断散落到每个页面。

## 哪些能力属于哪一层

| 能力                         | 归属                | 原因                                       |
| ---------------------------- | ------------------- | ------------------------------------------ |
| URL、方法、请求体与领域类型  | `api/modules/*`     | 它们属于某个业务资源                       |
| Bearer 注入与 401 恢复       | HTTP Auth + Adapter | 所有受保护请求共享同一规则                 |
| 响应信封                     | Envelope Adapter    | 它是当前后端的协议事实                     |
| 取消、尝试次数、逻辑 Loading | HTTP Client         | 它们必须覆盖重试和重放                     |
| 查询缓存、读取去重、失效重取 | Pinia Colada        | 查询层持有 query key 和数据新鲜度          |
| 防止重复写入                 | 服务端幂等          | 客户端取消无法撤销已经落库的写操作         |
| Toast 和监控接入             | 项目回调            | 核心只提供稳定错误，不绑定 UI 库和监控 SDK |

## 改需求时去哪里

| 需求                        | 首选落点                          |
| --------------------------- | --------------------------------- |
| 新增接口                    | `api/modules/` 新增或修改领域函数 |
| 改后端成功信封              | `adapters/envelope.ts`            |
| 改错误文案或接 i18n         | `adapters/error-presenter.ts`     |
| 改 token / Cookie 方案      | `adapters/auth.ts` 与装配入口     |
| 改 401 并发、熔断、重放规则 | `auth.ts`，并补认证测试           |
| 接全局 Loading、Toast、监控 | `http/index.ts` 给客户端传回调    |
| 改缓存或查询去重            | `queries/*`，不要塞进 Axios 核心  |
| 新增上传下载能力            | `transfer.ts`                     |

## 推荐阅读顺序

不要从 `client.ts` 第一行一路读到底。按“先主线、后分支”阅读：

1. `api/modules/users.ts`：先看页面需要怎样的业务函数。
2. `api/http/index.ts`：确认实例在哪里创建、注入了哪些项目规则。
3. `client.ts` 文件头、`HttpClient` 接口和方法别名：先忽略 `execute()` 细节。
4. `adapters/envelope.ts`：看正常响应为什么能直接得到业务数据。
5. `client.ts` 的 `execute()`：理解逻辑请求的开始、发送、失败与 finally。
6. `errors.ts` 与 `error-presenter.ts`：理解稳定分类和用户文案为什么分开。
7. `request-control.ts`、`retry.ts`、`transfer.ts`：分别学习独立能力。
8. 最后读 `auth.ts`、`adapters/auth.ts`、`session.ts`、`session-bridge.ts` 和
   `session-sync.ts`。

这组文章已经按同样顺序拆开：

1. [渐进式学习路径](./axios/learning-path.md)
2. [最小客户端：实例、信封与类型化入口](./axios/minimal-client.md)
3. [逻辑请求与错误](./axios/request-and-errors.md)
4. [生命周期能力：取消、Loading、重试与文件](./axios/lifecycle.md)
5. [认证与凭证刷新](./axios/auth.md)
6. [业务模块与端到端](./axios/modules-and-e2e.md)

## 不一定需要完整方案

根据项目复杂度选到够用为止：

| 层级       | 组成                                                            | 适合                                 |
| ---------- | --------------------------------------------------------------- | ------------------------------------ |
| 基础层     | `axios.create()` + `baseURL` + `timeout`                        | 接口少、无复杂登录态的内部工具       |
| 项目请求层 | 基础层 + 信封 + 类型入口 + 错误分类 + 业务模块                  | 大多数后台管理项目                   |
| 完整层     | 项目请求层 + 401 单飞 + 取消 + Loading + 重试 + 文件 + 会话同步 | 确实遇到这些并发与生命周期问题的项目 |

配套的通用化、可运行示例位于仓库 `docs/projects/axios-http/`，包含源码、设计记录、单元测试、
本地 HTTP 集成测试和浏览器测试。它用于验证机制；真实项目还会在装配入口接入自己的环境配置、
Pinia、Element Plus 和接口模块。

## 参考

- [Axios：创建实例](https://axios-http.com/docs/instance)
- [Axios：拦截器](https://axios-http.com/docs/interceptors)
- [Axios：错误处理](https://axios-http.com/docs/handling_errors)
- [Axios：取消请求](https://axios-http.com/docs/cancellation)
- [Axios：multipart/form-data](https://axios-http.com/docs/multipart)
- [OWASP：Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
