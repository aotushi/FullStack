# 浏览器输入 URL 后发生了什么

<script setup>
import UrlLifecyclePlayground from "./components/url-lifecycle/UrlLifecyclePlayground.vue";
</script>

## 总览

一次典型访问大致会经过这些阶段：

1. 浏览器解析并补全 URL。
2. 浏览器查找缓存，判断是否可以直接使用已有资源。
3. 如果需要访问网络，浏览器通过 DNS 找到目标服务器地址。
4. 浏览器和服务器建立连接。HTTPS 还需要完成 TLS 握手。
5. 浏览器发送 HTTP 请求。
6. 服务器处理请求并返回 HTTP 响应。
7. 浏览器读取响应，处理状态码、缓存、重定向、资源类型等信息。
8. 如果响应是 HTML，浏览器继续解析 HTML、CSS、JavaScript，并渲染页面。

这个过程不是一个单点动作，而是浏览器、操作系统、DNS、网络协议、服务器和渲染引擎共同完成的一条链路。

## 交互示例

<UrlLifecyclePlayground />

## URL 解析

URL 是浏览器访问资源的地址描述。

当用户输入内容后，浏览器会先判断它更像一个 URL 还是搜索关键词。如果是 URL，浏览器会解析出协议、域名、路径、查询参数等部分。

例如：

```text
https://<domain>/<path>?<query>
```

可以拆成：

- `https`：协议
- `<domain>`：主机名
- `<path>`：路径
- `<query>`：查询参数

如果用户没有输入协议，现代浏览器通常会尝试补全协议，优先使用 HTTPS。

## DNS 解析

浏览器不能只靠域名直接连接服务器，它需要知道目标服务器的 IP 地址。DNS 的作用就是把域名解析成 IP 地址。

DNS 查询通常会经过多级缓存和服务器：

- 浏览器 DNS 缓存
- 操作系统缓存
- hosts 文件
- 本地 DNS 服务器
- 根域名服务器
- 顶级域名服务器
- 权威域名服务器

常见理解方式：

- 客户端到本地 DNS 通常可以看作递归查询。
- 本地 DNS 到上级 DNS 服务器之间通常是迭代查询。

DNS 也不只是“查 IP”。它还可能参与负载均衡、就近访问、CDN 调度等过程。

## 建立连接

知道服务器地址后，浏览器需要和服务器建立连接。

在 HTTP/1.1 和 HTTP/2 场景下，底层通常依赖 TCP。TCP 连接建立时会经历三次握手：

1. 客户端发送连接请求。
2. 服务器确认请求，并返回自己的连接确认。
3. 客户端再次确认，连接建立。

如果使用 HTTPS，还会在 TCP 连接之后进行 TLS 握手。TLS 的作用是确认通信对象、协商加密参数，并保护后续传输内容。

更现代的 HTTP/3 使用 QUIC，底层基于 UDP，连接模型和 TCP 不同，但目标仍然是建立一条可靠、安全、可传输 HTTP 数据的通信通道。

## 发送 HTTP 请求

连接建立后，浏览器会发送 HTTP 请求。

请求通常包含：

- 请求方法，例如 `GET`、`POST`
- 请求路径
- 请求头
- Cookie
- 请求体

例如：

```text
GET /<path> HTTP/1.1
Host: <domain>
Accept: text/html
```

服务器收到请求后，会根据 URL、method、headers、cookies、body 等信息决定如何处理。

## 返回 HTTP 响应

服务器处理完成后，会返回 HTTP 响应。

响应通常包含：

- 状态码
- 响应头
- 响应体

例如：

```text
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: max-age=3600
```

浏览器会根据响应结果继续处理：

- `200`：正常读取响应体。
- `301` / `302`：根据 `Location` 继续跳转。
- `304`：使用本地缓存。
- `401` / `403`：认证或权限失败。
- `404` / `500`：资源不存在或服务器错误。

## 连接关闭与复用

早期 HTTP 请求经常会在响应完成后关闭 TCP 连接。TCP 关闭通常会经历四次挥手。

现代 Web 中，连接不一定会立刻关闭：

- HTTP/1.1 默认支持 keep-alive。
- HTTP/2 可以在一个连接中复用多个请求。
- HTTP/3 使用 QUIC，也有不同的连接复用方式。

所以学习“四次挥手”有助于理解 TCP，但在实际浏览器访问中，还需要结合连接复用一起看。

## 浏览器渲染页面

如果服务器返回的是 HTML，浏览器会进入页面解析和渲染流程。

大致过程包括：

1. 解析 HTML，构建 DOM 树。
2. 解析 CSS，生成样式规则。
3. 结合 DOM 和 CSS，计算每个节点的样式。
4. 生成布局树，计算元素位置和尺寸。
5. 绘制页面内容。
6. 合成图层并显示到屏幕上。

如果 HTML 中引用了 CSS、JavaScript、图片、字体等资源，浏览器还会继续发起新的请求。页面展示不是单个请求完成的结果，而是多个资源请求和渲染步骤共同完成的结果。

## 和前端请求的关系

前端代码中的 `fetch`、`axios`、`ofetch` 等工具，只是这条链路中的一部分。

它们主要负责让 JavaScript 发起 HTTP 请求，但请求仍然会受到浏览器能力和边界影响，例如：

- CORS
- Cookie 和 credentials
- 缓存
- 请求取消
- 网络错误
- 状态码处理

理解“浏览器输入 URL 后发生了什么”，可以帮助理解为什么前端请求不是简单的“调用接口拿数据”。

## 参考资料

- [细说浏览器输入URL后发生了什么 - 掘金](https://juejin.cn/post/6844904054074654728)
- [从URL输入到页面展现到底发生什么？](https://github.com/ljianshu/Blog/issues/24)
- [what-happens-when-zh_CN](https://github.com/skyline75489/what-happens-when-zh_CN/blob/master/README.rst)
