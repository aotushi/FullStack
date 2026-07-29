# Axios 请求层

这是一套基于 Axios 的项目请求层封装。页面代码只调业务模块里的领域函数，剩下的事
——类型化入口、逻辑请求生命周期、错误分类与展示、并发 401 单飞刷新、取消 /
Loading / 重试、文件传输——由请求层内部分工完成。核心拆成两层：**通用 HTTP 核心**
只依赖 HTTP 标准语义；**项目协议**（信封解包、错误文案、凭证读写）全部收进
Adapter，换一个后端协议只动 `adapters/` 和装配入口。

全部代码来自仓库内一套可运行、带测试的工程，各阶段页文末内嵌的源码在构建时从真实
文件直读，和测试跑的是同一份。

- 学习入口：[渐进式学习路径](./axios/learning-path.md)（导读 + 五个阶段分页）
- 代码与设计基线：仓库内 `docs/projects/axios-http/`；某个决定为什么这样定、否决了
  哪些替代方案，翻工程根目录的 `DESIGN.md`

## 分层与文件地图

```text
docs/projects/axios-http/            可运行工程：pnpm check = 类型检查 + 单测 + 浏览器测试
├── DESIGN.md                        设计基线：全部决策与被否决的替代方案
├── test/                            Vitest 单元与本地 HTTP 集成测试
├── browser-tests/                   Playwright Chrome 测试
└── src/api/
    ├── http/                        通用核心——只依赖 HTTP 标准语义
    │   ├── index.ts                 对外门面：创建并导出 http 的接入示例 + 类型出口
    │   ├── client.ts                类型化入口 + execute() 逻辑请求生命周期 + 拦截器装配
    │   ├── errors.ts                错误归一化：网络 / HTTP 状态 / 协议格式三类
    │   ├── auth.ts                  并发 401 单飞刷新状态机：五组状态、代际与熔断
    │   ├── request-control.ts       物理尝试计数：双层取消 + Loading 边界
    │   ├── retry.ts                 安全读重试：总时间预算 + 退避抖动
    │   ├── transfer.ts              文件传输：带凭证下载、读文件名、直链下载
    │   └── adapters/                项目协议——换后端只动这里
    │       ├── envelope.ts          信封解包 { code, message, data }
    │       ├── error-presenter.ts   错误文案：错误分类到提示语的项目分支
    │       └── auth.ts              凭证读写 + 调刷新接口
    ├── session.ts                   会话状态（真实项目换成 Pinia/Zustand 切片）
    └── modules/                     业务 API 模块：领域函数 + 领域错误（users.ts 示范）
```

验证命令与测试覆盖清单见[业务模块与端到端](./axios/modules-and-e2e.md)「验证资料」。

### 改什么动哪里

新需求先对号入座，绝大多数变更只落在一个文件：

| 变更                               | 落点                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| 新增业务接口                       | `modules/` 新文件，其余不动                                                                       |
| 换信封字段、后端 200 + 业务码      | `adapters/envelope.ts`（下文三层适配）                                                            |
| 改错误文案、接多语言               | `adapters/error-presenter.ts`                                                                     |
| 换认证方案                         | `adapters/` 新认证 Adapter，在 `http/index.ts` 给工厂注入 `auth`（[认证与刷新](./axios/auth.md)） |
| 接监控上报、全局错误提示、Loading  | `http/index.ts` 里给工厂传 `onReport` / `onError` / `onLoadingChange` 回调                        |
| 新增横切能力（请求签名、灰度头等） | `http/` 新文件 + `client.ts` 一行装配                                                             |

### 删减方向

三个采用层级（[学习路径](./axios/learning-path.md)「选择你需要的层级」）映射到物理
文件，砍能力就是删文件加删装配行，核心结构不变：

- **停在项目请求层**（大多数后台管理项目）：删 `auth.ts`、`adapters/auth.ts`、
  `session.ts`、`request-control.ts`、`retry.ts`、`transfer.ts`，去掉 `client.ts`
  里对应的拦截器安装和工厂选项。
- **只要基础层**：整套封装都不需要——`axios.create()` 加 `baseURL`、`timeout`
  就够，很多内部工具停在这里就是对的。

## 接口约定与协议立场

示例后端的成功响应统一套一层信封：

```ts
export interface ApiEnvelope<Data> {
  code: number;
  message: string;
  data: Data;
}
```

立场只有几条，但每条都影响整个封装的形状：

- **HTTP 状态码是成功与否的唯一权威。** `code` 只是元数据，传输层不写
  `if (code !== 0) throw`——那会让同一个失败出现两套并存的表达，重试、监控、网关
  每一层都要猜该看哪一个。
- 登录失效使用 HTTP `401`，不是 `200` 加业务错误码。
- `204 No Content`、文件下载和第三方接口不套用信封。
- Access Token 放内存；Refresh Token 走 `HttpOnly` Cookie，前端读不到。

### 后端用 200 + 业务码表达失败怎么办

按顺序考虑三层：

1. **首选：推动后端用 HTTP 状态码表达失败。** 标准语义让重试、监控、网关、缓存全
   链路不需要私有知识。
2. **个别接口如此：在业务模块里翻译**（学习路径阶段八的做法），传输层不动。
3. **整个后端如此、存量协议改不动：改写 `adapters/envelope.ts` 一个文件。**
   「`code` 非 0 即失败」就是这一支后端的协议事实，而协议判定本来就属于协议
   Adapter。改法和代价见[最小客户端](./axios/minimal-client.md)「整个后端都用
   200 + 业务码怎么办」。

## 默认能力与可选能力

| 能力           | 状态           | 说明                                                                          |
| -------------- | -------------- | ----------------------------------------------------------------------------- |
| API 地址与超时 | 默认启用       | 工厂统一 `baseURL`、`timeout`，配置白名单拦住调用方按请求改回                 |
| 请求凭证       | 默认启用       | 自动附 `Authorization`，401 单飞刷新后重放；`skipAuth: true` 按请求跳过       |
| 数据剥壳       | 默认启用       | Envelope Adapter 拆 `{ code, message, data }`；`raw()` 拿完整响应             |
| 统一错误       | 默认启用       | 归一化分类 + Presenter 文案 + 上报；`errorMode: "silent"` 只关展示不关上报    |
| 外部取消信号   | 可选           | 按请求传 `signal`；`cancelAll()` 双层取消始终可用                             |
| 全局 Loading   | 可选，默认关闭 | `showLoading: true` 按请求开启；按逻辑请求计数，只在 0↔1 边界回调             |
| 自动重试       | 可选，默认关闭 | 仅安全读方法，写请求即使显式要求也不重试；带总时间预算与退避抖动              |
| 文件传输       | 可选           | `fetchFile`/`saveFile` 带凭证下载并读文件名，`downloadDirect` 走 URL 签名直链 |
| 重复请求取消   | 不做           | 归查询层（TanStack Query、pinia-colada 等）——它们持有查询身份                 |
| 接口缓存       | 不做           | 同上；HTTP 层只看得到一次孤立传输                                             |

## 不负责什么

- **写请求防重复提交**：客户端取消挡不住已经落库的请求，必须由服务端幂等兜底。
- **XSRF 头部**：凭证主体走内存 Bearer 头，跨域 Cookie 只暴露给刷新接口；防线在
  服务端的同源与 Origin 校验，前端不再附带 XSRF 头。

## 调用长什么样

页面只认领域概念，业务模块负责 URL、类型和状态码翻译：

```ts
// src/api/modules/users.ts
export async function createUser(input: CreateUserInput): Promise<User> {
  try {
    // silent 只关全局 Toast 展示，不关监控上报——409 要显示在表单字段旁边
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

```ts
// 页面
try {
  await createUser({ name: "Ada" });
} catch (error) {
  if (error instanceof UserAlreadyExistsError) {
    setFieldError("name", "用户名已存在");
  }
}
```

## 采用前检查

把这套封装接进项目之前，逐项确认；任何一项对不上，先读对应页再动手：

| 检查项                                       | 对不上时看哪                                                  |
| -------------------------------------------- | ------------------------------------------------------------- |
| 后端用 HTTP 状态码表达失败，成功码已确认     | 上文「200 + 业务码」三层适配                                  |
| 登录失效返回的 HTTP 状态是 `401`             | [认证与刷新](./axios/auth.md)「什么时候必须改契约」           |
| 刷新接口与普通接口是否同一套信封/域名规则    | 刷新走独立裸实例、不套信封（[认证与刷新](./axios/auth.md)）   |
| token 保存方式已定（内存 + HttpOnly Cookie） | 换方案看[认证与刷新](./axios/auth.md)「换一种认证方案会怎样」 |
| 文件接口的返回形态已确认（响应体还是直链）   | [生命周期能力](./axios/lifecycle.md)「两条下载路径」          |
| Loading、retry 等可选能力按需开启            | 默认关闭是有意的，接查询层时重试归上层                        |
| 并发 401 的行为有自动化测试兜底              | `test/http-client.test.ts` 可直接当模板                       |
| 上传/下载的取消与 `204` 场景已验证           | `test/protocol-and-utilities.test.ts`、`browser-tests/`       |

## 参考

- [Axios：创建实例](https://axios-http.com/docs/instance)
- [Axios：拦截器](https://axios-http.com/docs/interceptors)
- [Axios：错误处理](https://axios-http.com/docs/handling_errors)
- [Axios：取消请求](https://axios-http.com/docs/cancellation)
- [Axios：multipart/form-data](https://axios-http.com/docs/multipart)
- [OWASP：Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
