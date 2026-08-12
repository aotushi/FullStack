# Axios 通用请求层设计基线

> 状态：设计已冻结；本轮审计修订与自动化验收已通过，等待用户审计确认。
>
> 适用目录：`E:\code\github\temp0724\axios`
>
> 当前实现仅位于本测试目录。用户审计并明确批准前，不会同步到 FullStack 正式文档。

## 已确认决策登记表（D-01—D-67）

本表用于核对讨论结论是否完整：

- `D-*` 编号统计已经冻结的设计决定。
- 正文按主题组织详细解释，章节数不代表决定数量。
- “已确认”表示设计决定已经冻结；实现状态记录在本文末尾。
- 当前没有尚未确认的 `P-*` 分支。

| 编号 | 状态 | 已确认的核心结论 | 详细位置 |
| --- | --- | --- | --- |
| D-01 | 已确认 | 采用“通用 Axios 核心 + 项目协议 Adapter”两层结构 | §1 |
| D-02 | 已确认 | 普通方法返回业务结果，`raw()` 显式返回完整 `AxiosResponse` | §3 |
| D-03 | 已修订 | 通用核心生成稳定的开发者错误描述与安全请求上下文；用户文案由 D-42 的项目 Presenter 决定 | §4.1、§4.3 |
| D-04 | 已确认 | 页面不普遍处理 HTTP 状态码；认证、通用展示和业务模块各负其责 | §4.2 |
| D-05 | 已确认 | HTTP 状态码是成功或失败的唯一权威；Envelope 的 `code` 只作元数据 | §2 |
| D-06 | 已确认 | 项目 Envelope Adapter 安装在主实例响应拦截器中，并保持 `AxiosResponse` 形状 | §2.1 |
| D-07 | 已确认 | `2xx` 协议格式错误抛出独立的 `ApiEnvelopeFormatError` | §2.1 |
| D-08 | 已确认 | 认证由通用认证流程与项目 `AuthAdapter` 协作完成 | §5 |
| D-09 | 已确认 | 凭证刷新使用内部裸实例，并采用单航班刷新、版本判断和最多重放一次 | §5.1、§5.2 |
| D-10 | 已修订 | `onError` 只负责展示且受 `silent` 约束；最终错误由独立的 `onReport` 上报 | §4.3、§14.2 |
| D-11 | 已确认 | 刷新成功后重放仍为 `401` 时终止刷新、失效会话并拒绝原请求 | §5.3 |
| D-12 | 已修订 | 项目 Presenter 统一映射 `4xx`、`5xx`、网络、超时、配置和协议格式错误的安全用户文案 | §4.3 |
| D-13 | 已确认 | Loading 覆盖完整逻辑请求；全屏 Loading 默认关闭，项目可启用非阻塞进度 | §7 |
| D-14 | 已取代 | 原定在 Axios 核心中提供显式重复请求控制；现由 D-37 取代 | §8 |
| D-15 | 已确认 | 自动重试默认关闭，只允许显式重试安全读取请求及指定的瞬时错误 | §9 |
| D-16 | 已确认 | 文件传输是独立浏览器模块；上传、直接下载和 Axios Blob 各有明确适用边界 | §10 |
| D-17 | 已确认 | 能力模块拥有拦截器，客户端工厂按固定顺序安装，逻辑请求能力在外层编排 | §6 |
| D-18 | 已确认 | 页面不直接调用 `http`；业务 API 模块负责接口细节和业务错误转换 | §11 |
| D-19 | 已确认 | 泛型使用语义名称，顺序固定为返回结果 `Result` 在前、请求体 `Body` 在后 | §3 |
| D-20 | 已取代 | 原定由 Axios 核心使用 `dedupe` 和 `takeLatestKey` 管理重复请求；现由 D-37 取代 | §8 |
| D-21 | 已取代 | 原定校验 `dedupe` 与 `takeLatestKey` 互斥；相关配置已由 D-37 删除 | §8 |
| D-22 | 已取代 | 原定在 Axios 核心维护共享订阅者；相关机制已由 D-37 删除 | §8 |
| D-23 | 已确认 | `src/api/http/` 保持浅层结构，仅用 `adapters/` 隔离项目接入代码 | §1.1 |
| D-24 | 已确认 | 正式文章采用“先总览和组装，再逐层展开，最后给出业务用例与验收”的顺序 | §12 |
| D-25 | 已确认 | 业务 API 模块统一放在 `src/api/modules/*.ts` | §1.1、§11 |
| D-26 | 已确认 | 业务客户端固定可信 `baseURL`、拒绝绝对 URL，并用 `allowAbsoluteUrls: false` 加固 | §13.1 |
| D-27 | 已修订 | `withCredentials` 默认关闭；具体启用范围由 D-29 按传输实例进一步收紧 | §13.2 |
| D-28 | 已确认 | 当前项目采用内存 Bearer Access Token + HttpOnly Cookie Refresh Token 的混合认证 | §5 |
| D-29 | 已确认 | 主业务实例与刷新实例分别配置凭证；跨域时只让刷新实例携带 Cookie | §5.1、§13.2 |
| D-30 | 已确认 | 核心不实现 XSRF Token；Refresh/Logout 由后端校验 Origin，并以 Referer 回退 | §13.3 |
| D-31 | 已确认 | 当前版本省略 `requestId`，不生成、不读取，也不加入 Envelope 或 HttpError | §14.1 |
| D-32 | 已修订 | 通用核心默认零日志；展示与上报分离，项目通过 `onReport` 使用安全上下文脱敏上报 | §14.2 |
| D-33 | 已确认 | 当前版本只支持浏览器 SPA；SSR 服务端请求必须使用按请求创建的独立客户端 | §1.2 |
| D-34 | 已确认 | 验收采用类型检查、单元测试、真实 HTTP 集成测试和有限浏览器测试四层验证 | §15 |
| D-35 | 已确认 | 类型、Envelope、基础错误、URL 和最终错误回调必须通过基础验收矩阵 | §15.1 |
| D-36 | 已确认 | Bearer/Cookie 混合认证、并发刷新、重放和会话失效必须通过认证验收矩阵 | §15.2 |
| D-37 | 已确认 | Axios 核心不识别或共享相同请求；项目需要读取共享时交给可选的上层数据请求库 | §8、§15.3 |
| D-38 | 已确认 | 取消、Loading 和重试必须按一次逻辑请求通过生命周期验收矩阵 | §15.3 |
| D-39 | 已确认 | 上传、直接下载、Blob 下载、文件名与浏览器资源释放必须通过传输验收矩阵 | §15.4 |
| D-40 | 已确认 | 最终验收以统一检查、行为覆盖、Chromium 测试、时序复跑和依赖审计为准 | §15.5 |
| D-41 | 已修订 | `HttpError` 只承载稳定分类、开发者描述、原生 `cause` 和方法、去 query/fragment 的路径、尝试次数、耗时；动态路径段由项目另行归一化 | §4.1、§14.2 |
| D-42 | 已确认 | 项目错误 Presenter 是用户文案的唯一归属，通用错误核心不硬编码用户文案 | §4.3 |
| D-43 | 已确认 | `onError` 与 `onReport` 分离；`silent` 只关闭展示，`cancel` 同时豁免展示和上报 | §4.3、§14.2 |
| D-44 | 已确认 | 只有认证模块真正处理过的错误才豁免展示；普通和 `skipAuth` 的 `401` 遵循常规展示规则 | §4.2、§5.3 |
| D-45 | 已确认 | 并发请求共享刷新失败时，每个逻辑请求分别上报一次，跨请求聚合交给日志平台 | §5.3、§14.2 |
| D-46 | 已确认 | 业务模块声明 `silent` 接管状态码时，负责该请求全部错误的用户反馈，并提供领域错误样板 | §11 |
| D-47 | 已确认 | 显式登录建立新会话后调用 `http.resetAuthState()`，推进凭证版本并清除上一会话的失败与失效缓存 | §5.4 |
| D-48 | 已确认 | 最终错误同时记录逻辑业务请求上下文和失败来源；Refresh 失败标记为 `auth-refresh` 并记录安全来源路径 | §4.1、§5.2、§14.2 |
| D-49 | 已确认 | `ApiEnvelopeFormatError.responseData` 允许受控读取，但不作为可枚举自有字段参与默认序列化 | §4.1、§14.2 |
| D-50 | 已确认 | 浏览器直接下载先解析 URL，只允许 `http:` 与 `https:`，其他 scheme 在创建链接前按配置错误拒绝 | §10、§13.1 |
| D-51 | 已确认 | `401` 刷新与重放只处理本实例请求拦截器标记过的请求；刷新客户端等其他 Axios 实例的错误即使流经本链也不被当作业务 `401` | §5.1、§5.2 |
| D-52 | 已确认 | 显式重建会话推进会话代际；上一代际的在途刷新不再失效新会话、不写入失败缓存，已在等待它的请求改用新凭证继续 | §5.4 |
| D-53 | 已确认 | `HttpError.presentationHint` 承载服务端返回的展示文案，与 `responseData` 同样通过非枚举访问器读取，不参与默认序列化 | §4.1、§14.2 |
| D-54 | 已确认 | 刷新失败缓存是带冷却的熔断而非永久锁定；冷却窗口内复用同一失败，窗口结束后放行一次新的刷新 | §5.3 |
| D-55 | 已确认 | 重试受总时间预算约束，只在预算容得下时才发起下一次尝试，不打断已经在进行的尝试 | §9 |
| D-56 | 已确认 | `HttpRequestConfig` 用白名单 `Pick` 出可透传的 Axios 配置键，而不是用 `Omit` 排除已知危险键 | §3.1 |
| D-57 | 已确认 | 请求上下文就地写入原错误，不带上下文重建新错误，以保住对象身份与载荷字段 | §4.1 |
| D-58 | 已确认 | Loading 用 `onLoadingChange` 布尔回调接入，计数留在 `client.ts`，不设 Loading Adapter 与独立文件 | §7 |
| D-59 | 已确认 | 会话存储属于项目状态，放在 `src/api/session.ts`，HTTP 模块只通过 `AuthAdapter` 读写 | §1.1、§5 |
| D-60 | 已确认 | 不设集中式 `types.ts`；类型留在定义它的文件，由 `http/index.ts` 统一转发给调用方 | §1.1 |
| D-61 | 已确认 | 接入 TanStack Query、SWR 等数据请求层后重试归上层，HTTP 层 `retry` 保持关闭，避免两层退避相乘 | §9 |
| D-62 | 已确认 | 认证方案是装配时选择的插件：`AuthAdapter` 即插件契约，换方案=新增 adapter 文件并替换装配一行；不预建方案注册表，也不预置多方案后 disable | §5.5 |
| D-63 | 已确认 | 封装对令牌格式不可知：不解码、不验签、不读取过期时间，过期经 `401` 被动发现；主动续期只作为可选扩展加入，且被动路径不可移除 | §5.5 |
| D-64 | 已确认 | 框架会话实现（Pinia 等）以正式文档案例落地，仓库源码保持零框架依赖；`createMemoryAuthSession` 可直接投产 | §5 |
| D-65 | 已确认 | 刷新失败按刷新请求自身的 HTTP 状态分两类：仅 `401`（凭证确定失效）失效会话；网络错误、超时与 `5xx` 只进入熔断冷却，会话保留，窗口结束后自愈 | §5.3 |
| D-66 | 已确认 | 跨标签页刷新协同（Web Locks/BroadcastChannel）不进源码：多标签页正确性由后端轮换宽限窗口决定；以「采用前检查」新增确认项与文档边界说明落地 | §5.6 |
| D-67 | 已确认 | 跨标签页会话同步以旁挂模块 `session-sync.ts` 进源码：只搬运会话事实（更新/终结广播与采纳）、不介入刷新决策；与 D-66 的划界是「互斥不进、同步进」 | §5.7 |

## 1. 设计目标

这套方案面向后台管理类前端项目，由两层组成：

1. **通用 Axios 核心**：处理 HTTP、取消、重试、认证协作和请求生命周期，
   不理解任何具体后端的业务协议。
2. **项目协议 Adapter**：理解当前项目的 `code/message/data` 返回格式，
   并把协议格式转换成业务模块需要的数据。

边界原则：

- 通用核心可以被不同项目复用。
- 项目协议、提示文案、路由、状态管理和接口地址不能进入通用核心。
- 页面不直接调用 `http`，接口细节统一留在 `src/api/modules/*.ts` 业务模块。
- 项目默认只有一个对外使用的 Axios 业务实例。
- 刷新凭证使用一个不导出的内部裸 Axios 实例，它不是第二个业务客户端。

### 1.1 目录基线

```text
src/api/
├── http/
│   ├── index.ts
│   ├── client.ts
│   ├── errors.ts
│   ├── auth.ts
│   ├── request-control.ts
│   ├── retry.ts
│   ├── transfer.ts
│   └── adapters/
│       ├── envelope.ts
│       ├── auth.ts
│       └── error-presenter.ts
├── session.ts
└── modules/
    └── users.ts
```

- `index.ts` 是唯一公共入口，负责组装并导出项目使用的 `http`，同时转发调用方
  需要的类型，使调用方只记一个导入路径。
- `client.ts` 创建 Axios 实例、提供请求方法，并编排一次逻辑请求。
- 通用能力按职责拆成平级文件，不额外建立 `core/`、`interceptors/` 或
  `handlers/` 等多层目录。
- 拦截器跟随所属能力，不再与该能力的其他逻辑分离。
- `adapters/` 只存放当前项目的协议、认证存储和错误展示接入。
- `session.ts` 在 `http/` 之外，因为会话是项目状态而不是传输能力；真实项目会用
  Pinia、Zustand 或 Redux 替换它，HTTP 模块只通过 `AuthAdapter` 读写它。
- `modules/` 按业务领域保存 API 调用，例如 `users.ts`、`orders.ts`。
- 类型留在定义它的文件里，不设集中式 `types.ts`：集中类型文件会与实现分离，
  改一个行为要改两个文件，且无法阻止它慢慢变成与实现无关的公共倾倒场。

### 1.2 运行环境

当前版本面向 Vue、React 等浏览器端后台管理 SPA，不支持在 Nuxt、Next 等 SSR
服务端渲染阶段使用同一个客户端。

- 浏览器 hydration 完成后可以使用本模块。
- SSR 服务端请求必须使用按服务端请求创建的独立 HTTP 客户端。
- 服务端不能复用本模块导出的 `http` 单例或内存 Access Token，避免不同用户之间
  共享认证状态。
- 文件下载模块依赖 Blob、Object URL 等浏览器能力。

## 2. 项目协议

当前项目的后端协议为：

```ts
export interface ApiEnvelope<Data> {
  code: number;
  message: string;
  data: Data;
}
```

协议语义已经确定：

- HTTP 状态码是请求成功或失败的唯一权威。
- `code` 只是响应附带的协议元数据，通用请求流程不依据它判断成功或失败。
- 不采用 `HTTP 200 + code 表示失败` 的方式。
- 后端失败必须返回恰当的 `4xx` 或 `5xx` HTTP 状态码。
- 通用核心中不存在 `businessCode`。

### 2.1 响应 Adapter

项目协议 Adapter 作为主 Axios 实例的响应拦截器工作：

1. 收到普通 `2xx` 响应。
2. 校验响应体是否符合 `ApiEnvelope<Data>`。
3. 保留原来的 `AxiosResponse` 对象。
4. 把 `response.data` 从 Envelope 替换为其中的 `data`。
5. 后续请求方法最终向业务模块返回解包后的结果。

不能在响应拦截器中直接写成：

```ts
return response.data.data;
```

原因是 Axios 的拦截器类型仍把返回值视为 `AxiosResponse`。直接返回业务数据会让
运行时结果与 TypeScript 类型不一致。

以下响应绕过 Envelope 校验和解包：

- `204 No Content`
- 通过 `raw()` 发起、明确要求完整响应的请求

如果 HTTP 是 `2xx`，但响应体缺少 Envelope 必需字段或格式错误，抛出项目级
`ApiEnvelopeFormatError`。它不属于通用 `HttpError`。

`data: null` 是合法结果，判断格式时应检查字段是否存在，而不是依赖其真假值。

## 3. 对外请求结果与泛型规则

普通请求方法返回业务结果，不返回 `AxiosResponse`：

```ts
get<Result>(url, config): Promise<Result>

post<Result, Body>(
  url,
  data,
  config,
): Promise<Result>

put<Result, Body>(
  url,
  data,
  config,
): Promise<Result>

patch<Result, Body>(
  url,
  data,
  config,
): Promise<Result>

delete<Result, Body>(
  url,
  config,
): Promise<Result>
```

泛型规则固定为：

- 第一个泛型永远是最终返回结果 `Result`。
- 第二个泛型永远是请求体 `Body`。
- 不使用含义不清的 `T`、`D`。
- `get` 没有请求体，所以只有 `Result`。

完整响应通过显式的 `raw()` 获得：

```ts
raw<Data, Body>(config): Promise<AxiosResponse<Data>>
```

这里使用 `Data`，因为它表示完整 Axios 响应中的 `response.data`，而不是普通方法
直接返回的业务结果。

业务模块示例：

```ts
export interface CreateUserInput {
  name: string;
}

export interface User {
  id: string;
  name: string;
}

// 完整的错误接管样板见 §11。
export function createUser(input: CreateUserInput): Promise<User> {
  return http.post<User, CreateUserInput>("/users", input);
}
```

页面只调用：

```ts
const user = await createUser({ name: "Ada" });
```

因此，页面既不需要记忆泛型顺序，也不需要知道 URL、HTTP 方法或 Envelope 格式。

### 3.1 可透传的请求配置

`HttpRequestConfig` 用白名单从 `AxiosRequestConfig` 里 `Pick` 出调用方可以透传的键，
而不是用 `Omit` 排除已知危险键：

```ts
type AllowedAxiosConfigKey =
  | "data" | "headers" | "method" | "onDownloadProgress" | "onUploadProgress"
  | "params" | "responseType" | "signal" | "timeout" | "url";
```

排除法要求穷举所有能破坏核心不变量的键，只要漏掉一个，调用方就能击穿本模块的保证：

- `validateStatus` 能把 `5xx` 判为成功，直接击穿 D-05「HTTP 状态是唯一权威」。
- `adapter` 能整体替换传输层，绕过全部拦截器。
- `transformResponse` 能在协议 Adapter 之前改写响应体。
- `paramsSerializer`、`baseURL`、`withCredentials` 属于客户端工厂一次性决定的传输策略。

Axios 的配置键还会随版本增加，排除法的清单永远滞后于依赖版本。白名单让新增键默认
被拒绝，需要放开时是一次显式决定。调用方只需要描述这一次请求，传输策略属于本模块。

## 4. 错误模型

### 4.1 通用 HttpError

通用核心把 Axios 层面的失败统一转换为稳定的 `HttpError`，并使用 ES2022 原生
`Error.cause` 保留原始错误。`HttpError.message` 是稳定的开发者描述，不作为用户文案。

通用错误种类固定为：

```ts
type HttpErrorKind =
  | "http"
  | "network"
  | "timeout"
  | "cancel"
  | "configuration"
  | "unknown";
```

- `http` 错误保留 HTTP `status`。
- 通用错误中没有业务码或项目协议码。
- 最终错误携带 `method`、去除 query 和 fragment 的 `path`、主业务实例实际尝试次数
  `attempts`、完整逻辑请求耗时 `elapsedMs` 和失败来源 `origin`。
- `origin: "business"` 表示失败来自业务请求本身；`origin: "auth-refresh"` 表示逻辑
  请求因为刷新凭证失败而结束。后一种情况额外提供去除 query/fragment 的
  `originMethod` 和 `originPath`，避免把刷新故障误判成业务端点自身的网络故障。
- `path` 不包含 query 或 fragment，但通用核心无法识别路径段中的 ID、Token 或其他
  项目敏感信息，也不会自动把 `/orders/42` 归一化成 `/orders/:id`。需要该能力时由
  项目上报 Adapter 进一步处理。
- `attempts` 包含认证重放和显式重试，不包含内部 Refresh 请求。
- 取消请求也会拒绝 Promise，但不会触发全局错误提示。
- `ApiEnvelopeFormatError` 等项目级错误保持独立，不强行包装成 `HttpError`；最终失败时
  同样补充安全请求上下文，方便统一上报。
- `ApiEnvelopeFormatError.responseData` 通过非枚举访问器供受控调试读取，不进入
  `Object.keys()` 或默认 JSON 序列化。
- `HttpError.presentationHint` 是服务端 4xx 返回的展示文案，同样只通过非枚举访问器
  读取。它来自响应体，可能带回校验值等敏感内容，因此不能作为可枚举自有字段跟着
  `onReport` 一起被序列化出去。判断可枚举字段是否安全的规则统一为：承载响应载荷的
  字段一律走访问器。

请求上下文只有在逻辑请求结束时才完整（`attempts` 和 `elapsedMs` 都要等重试和认证
重放跑完），因此由 `assignRequestErrorContext` 就地写入原错误，而不是带上下文重建
一个新错误：

- 重建会换掉对象身份。认证模块用 `WeakSet` 标记自己处理过的错误、载荷字段用
  `WeakMap` 挂在实例上，这些关联都按身份建立，换了实例就断。
- 重建要在构造处之外再维护一份字段拷贝清单。每新增一个载荷字段就要记得同步，
  漏掉不会报错，只会静默丢失——`presentationHint` 就差点踩中。
- 上下文字段本身保持可枚举，`onReport` 里 `JSON.stringify(error)` 才能拿到它们。
  实现上用 `-readonly` 映射类型放开写入权限，对外仍然是 `readonly`。

### 4.2 错误职责

调用页面不应普遍编写 HTTP 状态码分支。职责划分如下：

- 被认证模块实际处理过的 `401`：由认证模块处理。
- 未安装认证 Adapter，或声明 `skipAuth` 的 `401`：作为普通 HTTP 错误；业务模块需要
  内联反馈时显式声明 `errorMode: "silent"`。
- 其他通用错误：由项目级错误展示 Adapter 处理。
- 对业务有明确含义的状态码：由对应的 `src/api/modules/*.ts` 业务模块转换成领域错误。

例如，用户接口可以把 `409` 转换为“用户名已存在”，但通用核心不应知道这个含义。

### 4.3 用户提示

项目级错误展示通过 `onError` 回调接入，错误上报通过独立的 `onReport` 回调接入。
通用核心不导入 UI、路由、Store 或日志平台。

每个请求可使用：

```ts
errorMode: "silent"
```

它只关闭 `onError` 展示，不关闭 `onReport`，也不吞掉错误；调用方仍然收到
rejected Promise。`cancel` 不触发这两个回调。

项目 `error-presenter.ts` 接收 `HttpError | ApiEnvelopeFormatError` 并返回用户文案。
提示策略：

- `4xx`：优先使用经过校验、允许展示的 `ApiEnvelope.message`，否则使用状态码映射。
- 被认证模块处理过的 `401`：由会话失效流程反馈，不重复展示。
- 未被认证模块处理的 `401`：按普通 `4xx` 展示；登录表单等场景由业务模块显式
  `silent` 后提供内联反馈。
- `403`、`404`、`429`：按项目策略展示或交给业务模块。
- `5xx`：展示固定的安全提示，不直接暴露服务器原始消息。
- 网络、超时和客户端配置错误：展示固定的客户端提示。
- 日志只记录经过脱敏的信息。

HTTP 状态码、错误种类与提示文案的映射全部属于项目错误 Presenter，不属于通用
错误核心。`HttpError.message` 不得直接作为用户文案展示。

## 5. 认证与并发刷新

认证由通用认证流程和项目 `AuthAdapter` 共同完成：

```ts
interface AuthAdapter {
  applyCredential(config: InternalAxiosRequestConfig): void;
  refreshCredential(): Promise<void>;
  expireSession(): void;
}
```

通用认证模块只负责：

- 请求前应用凭证。
- 处理 `401`。
- 合并并发刷新。
- 使用新凭证重放原请求一次。
- 确认会话失效。

项目 Adapter 自己决定：

- 使用 Bearer Token、Cookie 还是其他凭证。
- 凭证存放在哪里。
- 刷新接口地址和返回格式。
- 退出登录后如何更新 Store 或跳转路由。

当前项目 Adapter 采用的认证基线是：

- Access Token 只保存在内存中。
- `applyCredential()` 为普通业务请求添加 `Authorization: Bearer <access-token>`。
- Refresh Token 由后端写入 `HttpOnly + Secure + SameSite` Cookie，JavaScript 不读取
  Refresh Token。
- `refreshCredential()` 调用刷新接口；浏览器自动携带 Refresh Cookie，后端返回新
  Access Token 并轮换 Refresh Cookie。
- 通用认证模块仍然只依赖 `AuthAdapter`，不会把这种项目认证协议写死到核心中。

会话本身存放在 `src/api/session.ts`，不在 `src/api/http/` 内。会话是项目状态，真实
项目会用 Pinia、Zustand 或 Redux 替换本仓库的内存实现；HTTP 模块通过 `AuthAdapter`
的三个方法读写它，因此换掉存储实现不需要改动 HTTP 模块。仓库里的
`createMemoryAuthSession` 是可替换的示例与测试夹具，不是模块的一部分。

框架切片的落地方式是正式文档案例，不是仓库代码（D-64）。仓库不引入 vue/pinia
依赖：内存实现可直接投产（不响应式只影响 UI 侧消费），而 Pinia store 在 Node
测试环境还需要激活应用上下文，进仓库会同时破坏零框架依赖与测试环境的简单性。
案例位于 FullStack 站点认证页「AuthSession 的 Pinia 实现」小节
（`docs/frontend_data_fetching/clients/axios/auth.md`）：store 实现 `AuthSession`
四个约定，按测试夹具同一形状接入 `createBearerAuthAdapter`；配置要点是不装持久化
插件（token 落 localStorage 会破坏 D-59 的内存存储立场）与装配晚于
`app.use(pinia)`；并对照真实项目 admin-backend-3 的三层结构（内存 SSOT、Pinia
只做响应式镜像、请求层接口注入）。

### 5.1 刷新传输

刷新凭证使用内部裸 Axios 实例：

- 复用必要的 `baseURL` 和 `timeout`。
- `withCredentials` 和请求安全配置按刷新接口的需要独立设置，不照搬主业务实例。
- 不安装主业务实例的协议、认证、Loading 等拦截器。
- 不向业务代码导出。

这样刷新接口失败时不会再次进入同一套 `401` 刷新流程。

独立实例本身还不足以隔离两条链路：业务请求在等待刷新时，刷新的 rejection 会沿同一
条 Promise 链进入业务实例的响应错误拦截器，此时 `error.config` 属于刷新客户端。因此
认证模块在请求拦截器中标记本实例受理的请求，响应拦截器只对带该标记的请求执行 `401`
刷新与重放。否则刷新请求会被当作业务请求重放到业务实例上，其响应还会成为原业务请求
的结果。

### 5.2 并发规则

同一个浏览器标签页内：

- 所有请求共享一个 `refreshPromise`。
- 刷新进行期间，新请求先等待刷新完成，再携带新凭证发送。
- 同时收到多个旧凭证 `401` 时，只发起一次刷新。
- 使用 `credentialVersion` 判断 `401` 是否来自旧凭证。
- 如果凭证已经更新，迟到的旧凭证 `401` 直接使用当前凭证重放，不再次刷新。
- 已取消的请求不重放。
- 每个原始请求最多重放一次，防止循环。
- Refresh 失败造成业务逻辑请求失败时，业务请求上下文仍然保留，同时标记
  `origin: "auth-refresh"`；如果刷新错误包含 Axios 配置，还会记录去 query 的刷新
  方法与路径。

多个浏览器标签页之间不能直接共享内存中的 `refreshPromise`。跨标签页协调如果成为
明确需求，需要另行设计 `BroadcastChannel`、Web Locks 或后端刷新宽限机制。

### 5.3 刷新成功后仍然 401

如果刷新接口成功，但原请求使用新凭证重放后仍返回 `401`：

- 视为不可恢复的会话失效。
- 不再次刷新。
- 同一凭证版本只调用一次 `expireSession()`。
- `expireSession()` 负责会话失效 UX，因此不触发 `onError` 展示。
- 每个最终失败的逻辑请求仍分别触发一次 `onReport`，不形成监控盲区；核心不跨请求
  去重，上报平台负责聚合。
- 原请求仍以 rejected Promise 结束。

登录等明确使用：

```ts
skipAuth: true
```

的请求不应因为自身的 `401` 清除现有会话。它按普通 HTTP 错误进入展示流程；登录
模块需要表单内联提示时必须显式设置 `errorMode: "silent"`。

刷新本身失败时，失败结果按凭证版本缓存，使同一批并发请求不会各自再打一次刷新端点。
但该缓存是带冷却的熔断，不是永久锁定：

- 冷却窗口内的同版本请求直接复用缓存的刷新错误，不再产生刷新流量。
- 窗口结束后清除缓存，放行一次新的刷新尝试。
- 窗口长度由 `refreshCooldownMs` 配置，默认 30 秒。

刷新失败是否终结会话，按刷新请求自身的 HTTP 状态分两类（D-65）：

- 刷新端点返回 `401`：Refresh Token 本身失效，凭证不可恢复，调用一次
  `expireSession()`。
- 网络错误、超时、`5xx` 及其他非 `401` 失败：端点暂时无法回答，不代表凭证失效。
  只写入熔断缓存、不清除会话；冷却结束后端点恢复即静默自愈，用户无感知。

判定依据是刷新请求自身的 HTTP 状态码，不需要额外后端约定，与 D-05 同一精神。
不分两类——刷新一失败就清会话——会把一次网络抖动放大成一次强制登出；失败被永久
缓存则会把客户端锁死到页面刷新为止，即使凭证仍然有效、服务端已经恢复。
`resetAuthState()` 同时清除冷却计时，显式登录不受上一会话的冷却窗口影响。

### 5.4 显式登录建立新会话

刷新失败和会话失效状态只属于当前会话，不能泄漏到用户重新登录后的新会话。

登录模块在登录请求成功并保存新 Access Token 后，必须显式通知同一个 HTTP 客户端：

```ts
const result = await http.post<LoginResult, LoginInput>(
  "/auth/login",
  input,
  {
    skipAuth: true,
    errorMode: "silent",
  },
);

authSession.setAccessToken(result.accessToken);
http.resetAuthState();
```

`resetAuthState()` 会：

- 推进 `credentialVersion`，使新请求属于新的凭证代际。
- 推进会话代际，并与在途刷新脱钩：新请求不再等待上一会话的刷新。
- 清除上一会话的 `failedVersion`、缓存刷新错误和 `expiredVersion`。
- 保持主 Axios 实例和已安装拦截器不变。

登录可能发生在上一会话的刷新仍在途时，因此会话代际同时约束这次在途刷新的收尾：

- 它失败时不再调用 `expireSession()`，也不写入失败缓存，否则会清掉刚建立的新会话。
- 它成功时不推进 `credentialVersion`，新会话的凭证代际由显式登录确定。
- 在它开始等待之后才发生登录的请求，忽略这次刷新失败，改用新凭证继续。

该方法只用于登录、重新登录或明确切换账号后的新会话边界。认证模块内部刷新成功时
已经自行推进版本，不再次调用它。正常采用流程是在上一轮刷新已经失败并完成
`expireSession()` 后进入登录页，登录完成后再执行上述顺序。

### 5.5 认证方案的可替换性与适配（D-62、D-63）

**格式与架构是两个维度。** JWT（RFC 7519）说的是令牌字符串的编码格式：三段
Base64、带签名、payload 可含过期时间等声明。单 token / 双 token 说的是凭证架构：
有几个凭证、怎么续期。两者正交——双 token 架构里的 Access Token 完全可以采用 JWT
格式，这正是 OAuth2/OIDC 生态的主流形态：登录响应同时携带 `access_token` 与
`refresh_token`。教程语境的“JWT 单 token 方案”（单个无状态 JWT 替代服务端会话）
真实存在，但令牌到期前无法吊销，生产实践已收敛为“短寿命 JWT + Refresh Token”。
因此“后端采用 JWT”多数情况下只是格式陈述，对本封装是零改动（D-63）：核心与
Adapter 没有任何一处解码令牌，`Bearer` 后面的字符串长什么样与实现无关。

**认证空间的两条正交轴。**

| 轴 | 取值 | 当前实现（D-28） |
| --- | --- | --- |
| 有没有续期凭证 | 无（过期即重新登录） / 有（Refresh Token 等） | 有（HttpOnly Cookie） |
| 刷新何时触发 | 被动（收到 `401` 后） / 主动（已知过期时间，提前续期） | 被动 |

令牌格式不在任何一轴上。无感刷新指调用方无感，被动触发已经达成——`401` → 单航班
刷新 → 重放，原请求的 Promise 不中断；主动触发只是省掉一次注定失败的往返，是优化
而非无感的前提。过期时间也不必来自解析 JWT：OAuth2 令牌响应本身携带 `expires_in`。

**插件契约与选择时刻（D-62）。** 本章开头的 `AuthAdapter` 三方法即插件契约——
凭证怎么带上请求、`401` 之后怎么续期、续不动了怎么办。单航班、熔断冷却、会话
代际、重放去重全部实现在通用认证模块中，任何 adapter 自动继承。方案选择发生在
装配时（`index.ts` 组装一行），与 D-58、D-61 遵循同一判定规则：选择机制的重量
跟随不确定性消除的时刻。单个部署只运行一个方案，因此“预建认证方案注册表”与
“预置多方案、disable 其余”被否决：被 disable 的方案仍进打包产物、仍需测试矩阵，
契约还会被迫放宽为所有方案需求的并集。若未来出现同一构建面对多种后端方案的需求
（多租户、私有化交付、SDK 化），在装配层以动态 `import` 注册表按启动配置只加载
一个 adapter，即可作为纯增量加入，核心不变。

**契约覆盖面与三条边界。** 契约覆盖任何“附凭证 → `401` 时异步续期 → 续期失败
则失效会话”形状的方案。触碰以下任意一条才需要修改契约本身，而不是新增 adapter：

1. `applyCredential` 是同步方法——每请求需要 `await` 的方案（如 WebCrypto 请求
   签名、发送前确认过期）装不下；
2. 通用模块假设“`401` = 凭证问题且可续期”——用 `403` 表达过期或走
   `WWW-Authenticate` 协商的方案不匹配；
3. 单客户端实例只有一条刷新轨道（一个 adapter、一个凭证版本、一个在途刷新）——
   两套独立续期的凭证需要第二个客户端实例，而入口有意不暴露工厂。

**适配示例：后端为单 token（无 Refresh Cookie）。** 改动=新增一个 adapter 文件
+替换装配一行；`session.ts`（存的是任意字符串）、通用认证模块、`client.ts` 全部
不动，登录接口照旧 `skipAuth: true`。按后端对过期的处置分两个变体。

变体 a——过期即重新登录：

```ts
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
    // 后端没有续期接口：刷新即失败，通用模块接住它走会话失效
    async refreshCredential() {
      throw new Error("Single-token scheme has no refresh endpoint");
    },
    expireSession: options.expireSession,
  };
}
```

即使没有真正的刷新，通用模块仍然提供：并发 `401` 只调用一次 `refreshCredential`、
会话只失效一次（登录跳转不重复触发）、失败进入熔断冷却、错误标记为认证已处理而
豁免全局展示。

变体 b——旧 token 换新 token（滑动过期）：`refreshCredential` 改为用当前 token
调续期接口，工厂参数相应扩展出写回新 token 的 `setAccessToken`、从续期响应挑出新
token 的 `selectAccessToken` 与可选的 `renewUrl`。续期走独立裸实例（理由同
§5.1），但不设 `withCredentials`——该方案没有 Cookie，凭证即旧 token 本身：

```ts
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

变体 b 存在结构性时序约束：旧 token 是唯一凭证，过期后没有任何凭证可用于续期，
而被动触发要等到过期后的第一个 `401` 才发生。因此变体 b 是主动触发从优化升格为
必需的唯一场景。两种引入方式：adapter 内部定时器（零契约改动）；或为
`AuthAdapter` 增加可选的过期预判方法，由通用模块在发送前触发共享的单航班刷新
（契约扩展）。无论哪种，`401` 被动路径必须保留：客户端时钟偏差与服务端提前吊销
都会使主动预判失效（D-63）。

两个教程常见做法仍然被否决：令牌进 localStorage——D-59 的内存存储不因换方案
改变；前端验签或依据 payload 做业务判断——解析出的过期时间最多用于变体 b 的续期
时机，令牌真伪由后端裁决，与 D-05 同一精神。

### 5.6 多标签页与刷新轮换的边界（D-66）

本模块的全部并发状态（单飞、熔断、代际）是标签页内的模块级变量，跨标签页互不
可见；多个标签页共享的只有 Refresh Cookie。在刷新轮换（旧 Refresh Token 作废、
签发新的，一次性凭证的重放即泄露信号，触发整个令牌家族撤销）之下，两个标签页在
一次刷新往返窗口内并发刷新时，后到者即构成旧凭证重放——后端无法把它与真实泄露
区分。单标签页同样存在重放路径：刷新响应在网络上丢失后的重试。

结论（D-66）：跨标签页刷新协同（Web Locks 互斥 + BroadcastChannel 结果复用）不
进入本模块源码。理由：

1. 它不提供独立正确性。多标签页能否安全使用由后端轮换策略决定：后端带并发宽限
   窗口（reuse interval——旧凭证在轮换后的短窗口内重放按「响应丢失重试」处理，
   补发兄弟会话而不撤家族）时，无协同也安全；后端无宽限时，前端互斥也管不住
   丢响应重试与跨设备重放。
2. 协同逻辑必须长在单飞状态机内部：锁要包住整个刷新流程，取锁后要先复查凭证是否
   已被其他标签页刷新。这等价于重写 `refreshOnce`，不是旁挂模块。
3. Web Locks 与 BroadcastChannel 是浏览器原语，引入后模块失去 Node 内全量可测性。

落地方式：正式文章的「采用前检查」新增一条——向后端确认刷新轮换是否带并发宽限
窗口。有（OAuth2 生态默认）则多标签页直接可用；无且存在多标签页使用场景时，在
项目侧自行补前端互斥（重写单飞状态机），本模块契约不变。

### 5.7 跨标签页会话同步（D-67）

D-66 挡在源码之外的是刷新**协同**——互斥与结果复用，它们必须长在单飞状态机
内部。但多标签页还有一类独立问题：会话**事实**的传播。一个标签页登出后，其余
标签页仍持有内存令牌，继续以已吊销的会话工作，直到各自撞上 `401`；一个标签页
刷新出新令牌后，轮换制下其余标签页的旧令牌已作废，每个标签页都得再各自刷新
一轮。

结论（D-67）：跨标签页会话同步以旁挂模块 `src/api/session-sync.ts` 进入源码。
与 D-66 不矛盾，划界标准是**是否介入刷新决策**：

1. 同步不介入决策。它只搬运既成事实（`session-updated` / `session-ended` 的
   广播与采纳），不参与「什么时候刷新」；模块对 `http/` 零依赖，handlers 由
   项目侧接线，删除该文件不影响其余任何测试。D-66 否决的互斥则要求重写
   `refreshOnce`，是另一类东西。
2. Node 内全量可测。`BroadcastChannel` 自 Node 15.4 起是内建原语——D-66 第 3
   条理由对「同步」已不成立；Web Locks 仍是纯浏览器原语，维持不进。
3. 乱序防护是模块的实质内容：BroadcastChannel 不保证多标签页事件的全局顺序，
   「终结之后才到达的过期更新」会复活已登出的会话。单调递增时间戳 + 同戳同源
   去重构成事件屏障，测试可在 Node 内注入伪造事件直接验证。

接线属于项目侧（样板见 admin-backend-3 的 `api/session-bridge.ts`）：收到
`session-updated` 写入会话存储并调用 `resetAuthState()` 开新代际；收到
`session-ended` 清空存储；本地会话变更时反向 publish，采纳期间抑制回声广播。
刷新成功的令牌经此传播给所有标签页，「每个标签页各自刷新」的重复轮换随之消失
——这同时把 D-66 依赖的宽限窗口并发压缩到毫秒级。

## 6. 拦截器归属与顺序

每种能力拥有自己的拦截器，但只由客户端工厂统一安装。外部不暴露
`setup(axiosInstance)`，也不允许调用方依赖或改变注册顺序。

固定安装顺序：

```ts
installRequestControl(instance);
installApiEnvelopeAdapter(instance);
installAuth(instance, authAdapter);
```

Axios 请求拦截器按后注册先执行，因此请求阶段为：

```text
Auth -> RequestControl -> 网络
```

Axios 响应拦截器按先注册先执行，因此响应阶段为：

```text
RequestControl 清理 -> Envelope 解包 -> Auth
```

Auth 必须位于响应链最后。认证模块重放请求时，内部请求已经走过一次 Envelope
解包；如果外层 Auth 后面还有 Envelope 拦截器，重放结果会被重复解包并被误判为
协议格式错误。

链上的环指注册进该链的拦截器函数，不是模块本身：模块未在某条链注册即不在该链上，
Envelope 只注册响应拦截器，请求阶段因此只有两环。每环由 `use(onFulfilled,
onRejected)` 的一对分支组成，未提供的分支让响应或错误原样穿过：RequestControl
成败两分支都执行清理；Envelope 只有成功分支，错误跳过该环；Auth 成功分支纯透传，
`401` 处理全部在失败分支。因此上述响应阶段描述的是成功路径，错误路径为
RequestControl → Auth，不经过 Envelope，`401` 原样抵达认证模块。

Loading、重试、最终错误标准化、`onError` 和 `onReport` 围绕“一次逻辑请求”编排。

## 7. Loading

Loading 覆盖一次完整逻辑请求，包括可能发生的刷新、重放和重试，而不是每次物理
Axios 请求分别开关。

通用核心不为此定义 Adapter 接口，只接受一个 `onLoadingChange(active)` 回调，并支持：

- 项目级 `showLoadingByDefault`
- 请求级 `showLoading`
- 并发计数，避免某个请求先结束时错误关闭其他请求的 Loading

计数逻辑属于「一次逻辑请求」的编排，与 `client.ts` 里的取消、重试、错误上下文
是同一件事，因此留在 `client.ts` 内，不再拆成独立文件加一层 Adapter。Adapter 抽象
只有在项目端存在多种实现需要替换时才有价值；Loading 的项目端实现永远是
「显示」和「隐藏」两个动作，用一个布尔回调表达即可，中间层只会增加导入路径。

默认策略：

- 阻塞整个页面的全屏 Loading 默认关闭。
- 非阻塞的顶部进度条可以由具体项目配置为默认开启。
- 内部凭证刷新请求不单独进入业务 Loading。

所以“全屏 Loading 默认关闭”不等于所有请求都不能显示加载状态。

## 8. 取消与数据请求层边界

### 8.1 现状

Axios 官方提供 `AbortController` / `AbortSignal` 请求取消能力，但请求共享、缓存和
业务数据身份不是 Axios 传输层的职责。

TanStack Query、SWR 等数据请求库使用业务 Key 管理读取共享和缓存。它们在本文中
只用于说明职责边界，不是当前 Axios 模块的依赖。

参考：

- [TanStack Query：Query Keys](https://tanstack.com/query/latest/docs/framework/vue/guides/query-keys)
- [TanStack Vue Query：请求取消](https://tanstack.com/query/latest/docs/framework/vue/guides/query-cancellation)
- [SWR：请求去重](https://swr.vercel.app/docs/advanced/performance#deduplication)
- [Axios：Cancellation](https://github.com/axios/axios#cancellation)

### 8.2 当前采用方案

Axios 核心不再提供：

- `dedupe`
- `dedupeKey`
- `takeLatestKey`
- 自动请求指纹
- 共享 Promise 或订阅者表
- 基于 `credentialVersion` 的共享键

Axios 核心只保留取消基础能力：

- 请求配置接受标准 `AbortSignal`。
- 内部信号与调用方传入的 `signal` 正确组合。
- `cancelAll()` 只用于退出登录、切换账号等明确的会话边界。
- 取消产生 `kind: "cancel"` 的错误，不触发全局错误提示。
- 前端取消只表示不再等待结果，不能保证服务器已经停止处理请求。

项目需要读取共享、缓存或自动重新获取时，可以在 Axios 上层选用 TanStack Query、
SWR 等数据请求库，例如：

```ts
useQuery({
  queryKey: ["users", { page, keyword }],
  queryFn: ({ signal }) => getUsers({ page, keyword }, signal),
});
```

该示例只说明数据请求层可以把 `AbortSignal` 传给业务 API 模块，再传入 Axios。
本文不安装、配置或测试 TanStack Query。项目不使用数据请求库时，每次直接调用
`http` 都会发送独立请求。

写请求不使用前端读取共享机制防重。需要防止 `POST`、`PATCH` 等重复执行时，必须
由前后端约定服务端幂等策略；可选的 `Idempotency-Key` 属于项目 API 协议，不属于
Axios 核心。

## 9. 重试

自动重试默认关闭，只能由调用方对安全读取请求显式开启。

允许自动重试：

- `GET`
- `HEAD`
- `OPTIONS`
- 网络错误
- 超时
- `502`
- `503`
- `504`

不自动重试：

- 写请求
- `400`
- `401`
- `403`
- `404`
- `409`
- `422`
- 协议格式错误
- 取消
- 客户端配置错误

重试使用指数退避和随机抖动，等待过程可被取消。整个重试循环仍然只算一次逻辑请求。

重试同时受总时间预算 `totalTimeoutMs` 约束，默认 30 秒：

- 每次准备退避前先判断「已耗时 + 本次退避」是否仍在预算内，超出预算就直接抛出当前错误。
- 预算只约束是否发起新的尝试，不打断已经在进行的尝试，因此单次请求仍由 `timeout` 负责。
- 没有预算时 `retries` 与指数退避的组合会放大总耗时（例如 `retries: 5` 配
  `baseDelayMs: 200` 的退避总和已接近 6 秒，加上每次请求自身的 `timeout` 会更久），
  用户侧只能看到一个长时间无响应的 Loading。

`429` 只有在项目明确支持 `Retry-After` 后才能加入自动重试策略。

项目同时接入 TanStack Query、SWR 等数据请求层时，重试归上层，HTTP 层的 `retry`
必须保持关闭：

- 两层都开会相乘。上层 3 次重试配 HTTP 层 3 次，一个失败读取会打出 9 个物理请求，
  两层各自的退避与预算互相看不见，`totalTimeoutMs` 也只能约束自己这一层。
- 上层持有查询身份，知道这次读取是否仍被界面需要、是否已被新的查询取代，也能把
  重试状态反馈到界面；HTTP 层只看得到一次孤立的传输。
- HTTP 层的 `retry` 保留给不经过数据请求层的调用：写请求之外的一次性读取、
  轮询、以及应用启动阶段的引导请求。

因此 `retry` 默认关闭并按请求显式开启，而不是在客户端工厂里全局打开——这样接入
数据请求层时不需要回头关掉一个全局默认值。

## 10. 文件上传与下载

文件能力属于独立、可复用的浏览器传输模块，不进入 Axios 核心。具体接口 URL、
参数和返回类型仍属于业务模块。

上传规则：

- 使用 `FormData`。
- 不手动设置 `multipart/form-data` 的 `Content-Type`，由浏览器生成包含 boundary
  的完整请求头。

下载提供两种策略：

1. 普通 GET、Cookie、签名 URL 或大文件优先使用浏览器直接下载。
2. 需要 Authorization 请求头、POST 导出、进度、取消或前端解析时使用 Axios Blob。

浏览器直接下载还必须：

- 使用 `new URL(url, document.baseURI)` 同时支持相对地址和可信绝对地址。
- 只允许 `http:` 与 `https:`。
- 在创建和点击 `<a>` 之前拒绝 `javascript:`、`data:`、`file:` 等其他 scheme，并
  抛出 `kind: "configuration"` 的 `HttpError`。
- 是否进一步限制为同源或项目域名白名单，由具体项目根据签名下载域名决定。

Blob 下载还需要：

- 解析 `Content-Disposition`。
- 优先采用 `filename*`。
- 清理不安全的文件名。
- 使用后及时释放 Object URL。

超大文件、分片和断点续传属于独立能力，不纳入当前通用封装。

## 11. 业务模块边界

页面和 UI 组件不直接调用底层 `http`。

`src/api/modules/*.ts` 负责：

- 接口 URL。
- HTTP 方法。
- 请求体和返回值类型。
- 是否静默、显示 Loading、去重或重试。
- 把具有业务含义的 HTTP 状态转换为领域错误。

页面只处理业务成功结果和明确的领域错误，不重复处理通用 HTTP 状态码。

业务模块接管某个状态码的用户反馈时，必须在请求发出前声明
`errorMode: "silent"`。这是请求级的完整展示接管：模块必须负责该请求全部错误的
用户反馈，而不仅是被转换的状态码；`onReport` 仍会正常收到最终错误。

`users.ts` 的 `409` 样板：

```ts
export class UserAlreadyExistsError extends Error {
  constructor(cause: HttpError) {
    super("User already exists", { cause });
    this.name = "UserAlreadyExistsError";
  }
}

export async function createUser(input: CreateUserInput): Promise<User> {
  try {
    return await http.post<User, CreateUserInput>("/users", input, {
      errorMode: "silent",
    });
  } catch (error) {
    if (error instanceof HttpError && error.status === 409) {
      throw new UserAlreadyExistsError(error);
    }

    throw error;
  }
}
```

这里的 `silent` 不只静默 `409`。调用页面必须同时处理
`UserAlreadyExistsError` 和该请求的其他失败；监控上报仍由全局 `onReport` 完成。

## 12. 正式文章展示顺序

正式文章采用自顶向下的阅读顺序：

1. 目标、边界和目录树。
2. `index.ts`：先展示完整组装关系和公共入口。
3. `client.ts`：Axios 实例化、基础配置和请求方法。
4. `types.ts`：公共配置与返回类型。
5. `errors.ts`：通用错误模型。
6. `adapters/envelope.ts`：响应校验与解包。
7. `auth.ts` 和认证 Adapter。
8. `request-control.ts`：组合 `AbortSignal`、跟踪活动请求和实现 `cancelAll()`。
9. Loading、重试与错误展示。
10. 文件上传和下载。
11. `src/api/modules/*.ts` 业务调用示例。
12. 测试、采用前检查、版本与参考资料。

先用 `index.ts` 帮助读者理解各模块如何组合，再进入 Axios 实例和具体能力，避免在
尚未看到整体结构时先阅读一批零散工具文件。

入口组装应直接展示 Presenter、展示回调和安全上报的接法：

```ts
export const http = createHttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  onError: (error) => message.error(presentApiError(error)),
  onReport: (error) =>
    reportHttpError({
      name: error.name,
      kind: "kind" in error ? error.kind : "protocol",
      status: error.status,
      method: error.method,
      path: error.path,
      attempts: error.attempts,
      elapsedMs: error.elapsedMs,
    }),
});
```

`message` 和 `reportHttpError` 分别代表项目实际使用的 UI 与监控接入，不属于通用
HTTP 核心。上报时只挑选安全字段，不直接传递整个错误对象。

## 13. 安全配置

### 13.1 baseURL 与绝对 URL

- `baseURL` 只能来自可信的项目环境配置，不能接受用户输入。
- 业务模块只向主 `http` 传递相对 URL。
- 对 `http://`、`https://`、`//host` 等绝对或协议相对地址进行显式校验；校验失败时
  不发送网络请求，抛出 `kind: "configuration"` 的 `HttpError`。
- Axios 实例同时设置 `allowAbsoluteUrls: false`，作为显式校验之外的第二层保护。
- 文件签名下载等可信绝对 URL 由独立传输模块处理，不经过主业务 `http`；独立模块
  仍只接受 `http:` 与 `https:`，不会直接执行任意 scheme。
- 如果未来需要访问另一个后端，应创建名称和配置明确的独立客户端，不允许单次请求
  临时替换目标域名。

### 13.2 跨域凭证

- `withCredentials` 默认保持 `false`。
- 普通业务请求使用 Bearer Access Token；主业务实例不为跨域请求开启
  `withCredentials`。
- 刷新实例需要跨域携带 Refresh Cookie 时，单独设置 `withCredentials: true`。
- 两个实例的凭证策略分别在创建时固定，不开放给业务请求逐次修改。
- 同源请求是否携带 Cookie 由浏览器的同源 Cookie 规则决定，不依赖跨域
  `withCredentials` 开关。
- 刷新接口采用跨域 Cookie 时，后端必须明确允许受信任的前端 Origin 和凭证，
  不能使用通配 Origin。

### 13.3 Refresh Cookie 的请求来源校验

当前方案不在通用 Axios 核心中实现 XSRF Token，也不添加固定的 CSRF 自定义请求头。

Refresh、Logout 等依赖 Refresh Cookie 的接口必须由后端执行以下保护：

- 只允许 `POST`，不使用 GET 修改认证状态。
- 优先读取 `Origin`，按“协议 + 主机名 + 端口”与受信任前端 Origin 精确比较。
- `Origin` 缺失时，解析 `Referer` 并比较其 Origin；不能使用字符串包含或后缀判断。
- `Origin: null`、两个请求头都缺失、解析失败或不在允许列表时，拒绝请求。
- 严格配置带凭证的 CORS，不允许通配或未经校验地反射请求 Origin。
- Refresh Cookie 使用 `HttpOnly + Secure + SameSite`。
- 可额外利用 `Sec-Fetch-Site` 拒绝明显的 `cross-site` 请求。
- 经过反向代理时，目标 Origin 来自可信部署配置或受信任代理提供的已清洗信息。

这些条件属于 Cookie Refresh 方案的后端采用前提，必须进入正式文章的“采用前检查”。

## 14. 可观测性与日志

### 14.1 requestId

当前版本不实现请求标识：

- `ApiEnvelope` 不添加 `requestId`。
- `HttpError` 不添加 `requestId`。
- 前端不生成请求标识。
- Axios 核心不读取 `X-Request-ID`。
- 后端已经返回但前端不需要的 `requestId` 可以直接忽略。
- 正式文章只把服务端请求标识和 OpenTelemetry 列为可选增强，不纳入当前实现与验收。

省略请求标识不影响请求、认证、错误处理或安全性，代价只是生产环境定位单次请求时
缺少直接关联前后端日志的编号。

### 14.2 日志与脱敏

- 通用核心不调用 `console.log`、`console.error`，也不依赖具体日志平台。
- 一次逻辑请求最终失败时最多调用一次 `onError` 展示和一次 `onReport` 上报；刷新、
  重放和重试过程不重复触发。
- `silent` 只关闭 `onError`；`cancel` 同时豁免 `onError` 和 `onReport`。
- 认证模块处理过的失败不展示，但每个逻辑请求仍上报一次。
- 项目可在 `onReport` 中接入 Sentry 等日志平台，也可以完全不记录。
- `HttpError` 提供错误种类、HTTP 状态、方法、去 query/fragment 的路径、耗时、
  尝试次数和失败来源。路径段不会被通用核心自动脱敏或模板化。
- 不记录 `Authorization`、Cookie、Token、密码、请求体、响应体或完整查询参数。
- `cause` 只用于受控调试，不能未经筛选整体上传。
- `ApiEnvelopeFormatError.responseData` 仍可供受控调试读取，但使用非枚举访问器保存，
  不进入默认 JSON 序列化。监控 SDK 可能使用自定义遍历规则，项目仍只应记录错误
  名称、状态和安全请求上下文，不能主动读取并上传该字段。
- `origin: "auth-refresh"` 时，`path` 仍表示失败的逻辑业务请求，`originMethod` 和
  `originPath` 表示真正发生刷新故障的位置；上报 Adapter 应同时保留两组含义。
- 面向用户的提示只使用安全文案，不泄露内部日志内容。

## 15. 测试与验收

验证分为四层：

1. TypeScript 类型检查：验证公共方法泛型、配置约束和公共导出。
2. 单元测试：验证错误标准化、协议校验、URL 校验、重试判断和取消判断等纯逻辑。
3. 真实 HTTP 集成测试：使用本地测试服务器验证拦截器、认证刷新、重放以及完整逻辑
   请求生命周期。
4. 浏览器测试：只覆盖 Node 环境不能真实验证的 Cookie、跨域、Blob、Object URL 和
   浏览器取消行为。

统一使用 `pnpm check` 执行全部必需验证。测试不依赖真实业务后端或外部网络。

旧原型的 17 项测试已经被替换。当前测试覆盖类型、协议、错误、认证并发、取消、
Loading、重试和文件传输，并增加真实 Chrome 浏览器验证。

### 15.1 类型、协议与基础错误

必须验证：

1. `get<Result>` 返回 `Result`。
2. `post<Result, Body>` 正确校验请求体并返回 `Result`。
3. 泛型顺序错误的类型用例不能通过编译。
4. `raw<Data, Body>` 返回完整状态、响应头和原始响应体。
5. `raw()` 绕过 Envelope Adapter。
6. `204` 绕过 Envelope 校验。
7. `data: null` 是合法 Envelope。
8. HTTP `2xx` 不依据 Envelope `code` 判断失败。
9. 缺少 `code`、`message` 或 `data` 必需字段时抛出 `ApiEnvelopeFormatError`。
10. HTTP `4xx/5xx` 产生 `HttpError`，不被误判为 Envelope 格式错误。
11. `network`、`timeout`、`cancel`、`configuration`、`unknown` 分类正确并保留
    `cause`。
12. `ERR_NETWORK` 才归为网络错误；Axios 配置类错误与其他无响应错误分别归为
    `configuration` 和 `unknown`。
13. 最终错误提供方法、去 query 的路径、尝试次数和耗时，不包含请求头或请求体。
14. 相对 URL 正常发送；绝对和协议相对 URL 在发送前被拒绝。
15. Presenter 负责全部用户文案；`HttpError.message` 保持稳定的开发者描述。
16. `onError` 只负责展示并受 `silent` 约束；`onReport` 在静默请求中仍上报。
17. `cancel` 同时豁免展示和上报；任一回调抛错都不能覆盖原始请求错误。
18. 通用核心不产生控制台日志。
19. `ApiEnvelopeFormatError` 的原始响应可显式读取，但默认序列化不包含响应体。
20. `HttpError.presentationHint` 可显式读取并被 Presenter 使用，补充请求上下文后仍
    可读，但不进入 `Object.keys()` 或默认序列化。
21. 白名单之外的 Axios 配置键无法从调用方透传：`validateStatus`、`adapter`、
    `transformResponse`、`paramsSerializer`、`baseURL`、`withCredentials` 的类型用例
    不能通过编译；白名单内的请求描述字段仍然可用。
22. 补充请求上下文返回的是原错误实例本身，`cause` 与 `responseData` 保持同一引用，
    上下文字段仍参与默认序列化。

### 15.2 认证与并发刷新

必须验证：

1. 普通业务请求携带当前 Bearer Access Token。
2. Refresh 请求不携带失效的 Bearer Token，只使用 Refresh Cookie。
3. 10 个旧 Token 请求同时返回 `401` 时只调用一次刷新接口。
4. 刷新成功后，所有请求分别重放一次并携带同一个新 Access Token。
5. 刷新进行期间新创建的请求先等待，不携带旧 Token 发出。
6. 凭证已更新后才到达的旧 Token `401` 使用当前 Token 重放，不再次刷新。
7. 等待刷新期间被取消的请求不参与重放。
8. 每个原始请求最多重放一次。
9. 刷新失败时只调用一次 `expireSession()`，所有等待请求正确失败、不重复展示，
   并按每个逻辑请求分别上报一次。
10. 刷新成功但重放仍返回 `401` 时不再刷新，只失效一次会话；该失败带认证已处理
    标记，因此不产生全局展示，但仍上报一次。
11. 未安装认证 Adapter 的 `401` 作为普通 HTTP 错误展示并上报。
12. `skipAuth: true` 请求的 `401` 不触发刷新或会话失效，默认按普通错误展示；
    登录模块需要内联提示时显式使用 `silent`。
13. 内部刷新实例不经过 Envelope、业务 Loading、业务请求控制、重试或全局错误
    展示。
14. 一次刷新和重放只产生一个 Loading 区间；最终回调按一次逻辑请求计算。
15. 浏览器跨域测试确认主实例不携带 Cookie，刷新实例携带 Refresh Cookie。
16. Refresh Cookie 设置为 `HttpOnly` 后，页面 JavaScript 无法读取。
17. 后端轮换 Refresh Cookie 后，下一次刷新使用新 Cookie。
18. 刷新失败并失效旧会话后，显式登录保存新 Token 并调用 `resetAuthState()`；新会话
    再次过期时能够重新刷新，不复用旧会话的缓存错误。
19. Refresh 网络失败的上报保留业务请求 `path`，同时带
    `origin: "auth-refresh"`、刷新方法和去 query 的刷新路径。
20. 刷新失败不会被当作业务 `401` 重放：刷新端点不会收到带业务凭证的请求，业务请求
    也不会拿到刷新接口的响应体。
21. 刷新在途时完成显式登录：上一会话的刷新随后失败不再调用 `expireSession()`，
    登录后发出的请求和已在等待该刷新的请求都使用新凭证完成。
22. 刷新失败缓存在冷却窗口内复用同一错误、不产生新的刷新流量；非 `401` 的刷新
    失败（网络错误、超时、`5xx`）不清除会话，窗口结束后刷新端点恢复正常时客户端
    静默自愈；仅刷新端点返回 `401` 时失效一次会话。

认证模块的 `credentialVersion` 只用于判断 `401` 是否来自旧凭证，不参与请求共享。

### 15.3 取消、Loading 与重试

必须验证：

1. `HttpRequestConfig` 接受标准 `AbortSignal` 并正确传递给 Axios。
2. 已取消的 `signal` 不发送网络请求。
3. 进行中的请求取消后产生 `kind: "cancel"`，不触发展示或上报。
4. `cancelAll()` 只取消当前活动业务请求，不影响已经完成的请求。
5. 公共类型和导出中不存在 `dedupe`、`dedupeKey` 或 `takeLatestKey`。
6. 两次相同的直接 `http.get()` 调用会发送两次网络请求。
7. Loading 默认关闭。
8. 显式开启 Loading 时，一次逻辑请求只开关一次。
9. 多个并发 Loading 使用计数，最后一个请求结束时才关闭。
10. 成功、失败和取消都能正确关闭 Loading。
11. 重试默认关闭。
12. 只有安全读取请求可以对临时网络错误执行重试。
13. 写请求、取消、协议错误和明确的 `4xx` 不重试。
14. 重试等待可以被 `AbortSignal` 中止。
15. 整个重试过程至多触发一次最终展示和一次最终上报。
16. 总时间预算耗尽时不再发起新的尝试：尝试次数少于 `retries + 1`，整体耗时落在预算内。

TanStack Query 或 SWR 不加入当前模块依赖，也不进入当前模块测试。项目实际接入数据
请求层后，重试归上层，本模块的 `retry` 保持关闭（见 §9），因此这里的重试用例都以
不经过数据请求层的直接调用为前提。

### 15.4 文件传输

必须验证：

1. `FormData` 上传不手动设置 `Content-Type`。
2. 浏览器生成的 multipart 请求包含有效 boundary。
3. 文件和普通表单字段都能被本地测试服务器正确接收。
4. 上传支持 `AbortSignal` 取消。
5. 普通 GET 下载可以使用浏览器直接下载策略，不强制经过 Axios Blob。
6. 需要 Authorization、POST 导出或进度时使用 Axios Blob。
7. Blob 下载优先解析 `Content-Disposition` 的 `filename*`。
8. 没有 `filename*` 时回退到 `filename`，都没有时使用安全默认名。
9. 文件名中的路径符号和危险字符会被清理。
10. 创建 Object URL 后一定执行 `URL.revokeObjectURL()`。
11. Blob 下载被取消时不创建文件链接，也不显示全局错误。
12. 下载接口以 Blob 形式返回 JSON 错误时，能够恢复并进入正常错误处理。
13. 浏览器直接下载在创建链接前拒绝 `javascript:` 等非 HTTP(S) scheme，并产生
    `configuration` 错误。
14. 大文件、分片和断点续传不属于当前测试范围。

### 15.5 最终通过标准

- `pnpm check` 依次执行 TypeScript 类型检查、Vitest 单元测试、本地 HTTP 集成测试和
  Playwright Chromium 浏览器测试。
- 当前版本只强制 Chromium；Firefox 和 WebKit 只有在实际项目声明支持时加入。
- 测试不访问真实业务后端或外部网络。
- 不允许 `.skip`、`.only`、未处理 Promise 拒绝或控制台错误。
- 每项已确认的前端行为必须对应自动测试；后端安全前提对应“采用前检查”。
- 不设置脱离行为目标的全局覆盖率数字门槛。
- `401` 并发刷新、取消和 Loading 计数等时序测试在审计时连续运行 5 次。
- `pnpm audit --prod` 不允许存在已知高危或严重生产依赖漏洞。
- 全部检查和代码审计通过后，才允许申请同步到 FullStack 正式文档。

## 16. 设计冻结状态

当前没有待确认的设计分支。D-41—D-61 的审计修订与简化已经完成自动化验收，下一阶段是
用户代码审计。2026-07-29 补录 D-62、D-63（认证方案可替换性与令牌格式不可知），
只新增文档说明，不改变任何实现与测试。用户明确批准前，不同步到 FullStack 正式文档。
2026-07-29 另补录 D-64（框架会话实现进正式文档案例、不进仓库源码）：FullStack
站点认证页新增「AuthSession 的 Pinia 实现」小节，仓库代码与测试不变。
2026-07-30 补录 D-65（刷新失败按 HTTP 状态分两类：仅刷新端点 `401` 失效会话，
网络错误与 `5xx` 只熔断冷却、窗口后自愈）：`auth.ts` 刷新失败路径增加状态判定，
测试断言相应更新。同日补录 D-66（跨标签页刷新协同不进源码，以「采用前检查」新增
确认项与文档边界专节落地）：只新增文档说明，不改变实现与测试。
2026-07-31 补录 D-67（跨标签页会话同步以旁挂模块进源码，划界「互斥不进、同步进」）：
新增 `src/api/session-sync.ts` 与 7 项 Node 内测试（广播/采纳、乱序丢弃、重复去重、
dispose、时间戳单调、缺 BroadcastChannel 降级），既有实现与测试不变。该模块源自
admin-backend-3 请求层换代（其 ADR-0004）中反向提炼的可保留能力。

## 17. 隔离实现审计记录

审计日期：2026-07-28。

- `pnpm check` 通过。
- TypeScript 严格类型检查通过。
- Vitest 共 55 项测试通过，包括公开入口约束、错误 Presenter、安全上下文与展示文案
  的序列化隔离、请求上下文就地写入、跨会话认证复位、业务实例与刷新实例的链路隔离、
  刷新失败熔断冷却、重试总预算、展示/上报分流、领域错误样板和真实本地 HTTP 集成。
- Playwright Chrome 共 8 项浏览器测试通过，其中包含危险直接下载 scheme 的真实
  浏览器拒绝用例。
- 包含并发刷新、跨会话认证、链路隔离、刷新熔断冷却、重试预算、取消、Loading、重放
  和回调分流的 39 项完整 HTTP 集成用例连续运行 5 轮，全部通过。
- 浏览器测试会拒绝应用产生的控制台错误和未处理页面异常。
- `pnpm audit --prod --audit-level high` 报告无已知生产依赖漏洞。
- 生产依赖只有 Axios。
- 测试不访问真实业务后端或外部网络。
- FullStack 正式项目未被本轮实现修改或同步。
