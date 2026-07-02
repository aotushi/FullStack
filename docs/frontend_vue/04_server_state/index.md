# Server State

这个模块放 Vue 项目中的服务端数据管理。

内容边界：

- Axios / Fetch 封装。
- API 层设计。
- loading、error、empty 状态。
- 请求取消。
- 缓存、重试、去重。
- token refresh。
- 服务端状态和 Pinia 的边界。

通用 HTTP 知识放在 `frontend_data_fetching/`；这里重点记录 Vue 项目里的接入方式。
