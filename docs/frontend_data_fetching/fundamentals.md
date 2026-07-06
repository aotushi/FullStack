# Fundamentals

Frontend data fetching starts from the request and response model. This page records the platform-level concepts that should be understood before choosing `fetch`, `ofetch`, `axios`, Nuxt `useFetch`, or TanStack Query.

## 前端请求的基本模型

前端请求不是直接拿到数据，而是浏览器代表页面向服务器发出一次网络请求。服务器处理请求后返回响应，页面再根据响应结果更新界面。

### 浏览器作为客户端

浏览器是请求的发起方。

前端代码运行在浏览器里，但真正把请求发出去的是浏览器。例如调用 `fetch("/api/user")` 时，JavaScript 是在调用浏览器提供的网络能力。

浏览器还会负责或限制很多行为：

- 是否允许跨域
- 是否携带 Cookie
- 是否使用缓存
- 哪些请求头可以设置
- 哪些响应头可以读取

### 服务器作为资源提供方

服务器是资源提供方。

前端请求的目标通常不是直接调用服务器里的某个函数，而是请求某个资源或操作结果。例如：

```text
GET /api/users/1
POST /api/orders
```

服务器收到请求后，会根据 URL、method、headers、body 等信息决定如何处理，并返回结果。

### 请求与响应

一次网络交互通常由请求和响应组成：

```text
request -> response
```

请求里通常包含：

- 请求地址
- 请求方法
- 请求头
- 请求体

响应里通常包含：

- 状态码
- 响应头
- 响应体

前端真正要处理的不只是数据，还包括状态码、错误、权限、缓存、重定向等信息。

### 网络请求的异步特性

网络请求是异步的。

请求需要经过网络传输和服务器处理，耗时不可预测。前端不能在等待请求时阻塞整个页面，所以请求通常返回一个 `Promise`。

```js
const response = await fetch("/api/user");
const data = await response.json();
```

这也是为什么前端请求通常要处理 loading、success、error、retry、cancel、stale response 等状态。请求结果不会立即出现，而且可能失败、变慢、过期，或者被新的请求替代。

### 参考资料

- [浏览器输入 URL 后发生了什么](../web_foundation/browser-url-lifecycle.md)

## Sending Request Data

- URL
- method
- headers
- query
- body
- credentials
- cache mode

## Reading Response Data

- status
- success and failure boundaries
- headers
- JSON
- text
- Blob
- ArrayBuffer
- stream

## Browser Boundaries

This page only records the application-facing model. `frontend_browser` owns the platform mechanics of CORS, preflight requests, and the browser `Request`, `Response`, and `Headers` APIs.

- same-origin policy
- CORS as an application constraint
- cookies and credentials
- which headers can be read or written

## Request Lifecycle Control

This page owns the primitive vocabulary. Project-level patterns such as cancel-on-unmount and stale-response handling belong in [Design guidelines](./design-guidelines.md).

- cancellation
- timeout
- retry boundary
- stale response problem

## Debugging Basics

- DevTools Network panel
- status code
- request headers
- response headers
- payload
- timing

Related:

- [Clients](./clients.md)
- [Design guidelines](./design-guidelines.md)
- [frontend_browser](../frontend_browser/)
