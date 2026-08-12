# Axios 请求层实验

这是 FullStack 文档《Axios 请求层》的配套可运行工程与审计目录，站点文档入口在
`docs/frontend_data_fetching/clients/axios.md`。

## 学习入口

- [Axios 请求层渐进式学习路径](./docs/learning-path.md)：从最小 Axios 实例逐步理解
  当前完整实现。
- [完整设计基线](./DESIGN.md)：查看已经确认的设计边界、取舍和验收要求。

## 当前状态

- [DESIGN.md](./DESIGN.md) 中的 D-01—D-67 已冻结。
- 实现已经迁移到 `src/api/http/`，业务调用示例位于 `src/api/modules/`。
- `src/api/http/index.ts` 只导出配置完成的统一 `http` 实例，另转发调用方需要的类型；
  底层工厂和能力不通过入口暴露。
- TypeScript、63 项 Vitest、本地 HTTP 集成、8 项 Chrome 浏览器测试、5 轮集成复跑
  和生产依赖审计已经通过。
- 已作为正式文档的配套工程收录进本仓库；站点学习页从这里的真实源码构建时直读。

## 目录

```text
docs/
└── learning-path.md

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
├── session-sync.ts
└── modules/
    └── users.ts
```

`session.ts` 在 `http/` 之外：会话是项目状态，真实项目会换成 Pinia、Zustand 或
Redux，HTTP 模块只通过 `AuthAdapter` 读写它。Pinia 版实现案例（D-64）见站点
认证与刷新页「AuthSession 的 Pinia 实现」小节
（`docs/frontend_data_fetching/clients/axios/auth.md`）。

`session-sync.ts` 同样在 `http/` 之外：跨标签页会话同步只广播会话事实（更新/终结）
并做乱序防护，不介入刷新决策，handlers 由项目侧接到自己的会话存储上（D-67）。

## 验证

安装依赖后执行：

```bash
pnpm check
```

该命令依次执行：

1. 严格 TypeScript 检查。
2. Vitest 单元测试和真实本地 HTTP 集成测试。
3. Playwright Chrome 浏览器测试。

生产依赖安全检查单独执行：

```bash
pnpm audit --prod --audit-level high
```

所有测试只访问本地服务，不依赖真实业务后端或外部网络。
