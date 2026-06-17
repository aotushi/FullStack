## HTTP概述

> [HTTP概述 - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Overview)

### 是什么 

全称：超文本传输协议（`HyperText Transfer Protocol`）

概念：`HTTP` 是一种能够获取像 `HTML`、图片等网络资源的通讯协议（`protocol`）。它是在 `web` 上进行数据交换的基础，是一种 `client-server` 协议

`HTTP`——因特网的多媒体信使 ——《HTTP权威指南》。`HTTP` 在因特网的角色：充当一个信使的角色，干的就是一个跑腿的活，在客户端和服务端之间传递信息，但我们又不能缺少它。`HTTP` 协议是应用层的协议，是与前端开发最息息相关的协议。平时我们遇到的 `HTTP` 请求、 `HTTP` 缓存、`Cookies`、跨域等其实都跟 `HTTP` 息息相关





### 基于HTTP组件系统

#### 客户端: user-agent

user-agent 就是任何能够为用户发起行为的工具。这个角色通常都是由浏览器来扮演。一些例外情况，比如是工程师使用的程序，以及Web开发人员调试应用程序。



#### Web服务器

在上述通信过程的另一端，是由Web Server来*服务*并提供客户端所请求的文档。Server只是虚拟意义上代表一个机器：它可以是共享负载（负载均衡）的一组服务器组成的计算机集群，也可以是一种复杂的软件，通过向其他计算机（如缓存，数据库服务器，电子商务服务器 ...）发起请求来获取部分或全部资源。



#### 代理Proxies

在浏览器和服务器之间，有许多计算机和其他设备转发了HTTP消息。由于Web栈层次结构的原因，它们大多都出现在传输层、网络层和物理层上，对于HTTP应用层而言就是透明的，虽然它们可能会对应用层性能有重要影响。还有一部分是表现在应用层上的，被称为**代理（Proxies）**。代理（Proxies）既可以表现得透明，又可以不透明（“改变请求”会通过它们）。代理主要有如下几种作用：

- 缓存（可以是公开的也可以是私有的，像浏览器的缓存）
- 过滤（像反病毒扫描，家长控制...）
- 负载均衡（让多个服务器服务不同的请求）
- 认证（对不同资源进行权限管理）
- 日志记录（允许存储历史信息）



### HTTP特点

#### 可扩展的

在 HTTP/1.0 中出现的 [HTTP headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers) 让协议扩展变得非常容易。只要服务端和客户端就新 headers 达成语义一致，新功能就可以被轻松加入进来。

#### HTTP是无状态的,有会话的

HTTP是无状态的：在同一个连接中，两个执行成功的请求之间是没有关系的。

这就带来了一个问题，用户没有办法在同一个网站中进行连续的交互，使用HTTP的头部扩展，HTTP Cookies就可以解决这个问题。把Cookies添加到头部中，创建一个会话让每次请求都能共享相同的上下文信息，达成相同的状态。

HTTP本质是无状态的，使用Cookies可以创建有状态的会话。

#### HTTP和连接

通过 `TCP`，或者 `TLS`——加密的 `TCP` 连接来发送，理论上任何可靠的传输协议都可以使用。连接是传输层控制的，这从根本上来讲不是 `HTTP` 的范畴。

一个连接是由传输层来控制的，这从根本上不属于HTTP的范围。

也就是说，`HTTP` 依赖于面向连接的 `TCP` 进行消息传递，但连接并不是必须的。只需要它是可靠的，或不丢失消息的（至少返回错误）。

`HTTP/1.0` 默认为每一对 `HTTP` 请求/响应都打开一个单独的 `TCP` 连接。当需要连续发起多个请求时，这种模式比多个请求共享同一个 `TCP` 链接更低效。为此，`HTTP 1.1` 持久连接的概念，底层 `TCP` 连接可以通过 `connection` 头部实现。但 `HTTP 1.1` 在连接上也是不完美的，后面我们会提到。



![img](https://mmbiz.qpic.cn/mmbiz_png/betIP9fVPicP9mOWh8f5hp8VpYXOEAAvN3ibffK8frUExPhos5xWZDOyx9QZ9XxUdTibf95uoEF8X9Moa1NeUBmicw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

### HTTP能控制什么

- [缓存 ](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)
  文档如何缓存能通过HTTP来控制。服务端能告诉代理和客户端哪些文档需要被缓存，缓存多久，而客户端也能够命令中间的缓存代理来忽略存储的文档。
- *开放同源限制*
   HTTP可以通过修改头部来开放这样的限制，因此Web文档可以是由不同域下的信息拼接成的 
- *认证*
  一些页面能够被保护起来，仅让特定的用户进行访问。基本的认证功能可以直接通过HTTP提供，使用[`Authenticate`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Authenticate)相似的头部即可，或用HTTP Cookies来设置指定的会话。
- *[代理和隧道](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Proxy_servers_and_tunneling)*
  通常情况下，服务器和/或客户端是处于内网的，对外网隐藏真实 IP 地址。因此 HTTP 请求就要通过代理越过这个网络屏障。但并非所有的代理都是 HTTP 代理。例如，SOCKS协议的代理就运作在更底层，一些像 FTP 这样的协议也能够被它们处理。
- *会话* 
  使用HTTP Cookies允许你用一个服务端的状态发起请求，这就创建了会话。虽然基本的HTTP是无状态协议。这很有用，不仅是因为这能应用到像购物车这样的电商业务上，更是因为这使得任何网站都能轻松为用户定制展示内容了。

### 基于HTTP的组件系统

`HTTP` 的组件系统包括客户端、`web` 服务器和代理

![img](https://mmbiz.qpic.cn/mmbiz_png/betIP9fVPicP9mOWh8f5hp8VpYXOEAAvNXVlfJFhDX9IJHrcMPj9zhvNicO6Zk2tOWymqLHrAGEUKI5lvKz8WsNw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

#### 客户端: user-agent

浏览器，特殊比如是工程师使用的程序，以及 `Web` 开发人员调试应用程序

#### Web服务端

由 `Web Server` 来服务并提供客户端所请求的文档。每一个发送到服务器的请求，都会被服务器处理并返回一个消息，也就是 `response`

#### 代理(proxies)

在浏览器和服务器之间，有很多计算机和其他设备转发了 `HTTP` 消息。它们可能出现在传输层、网络层和物理层上，对于 `HTTP` 应用层而言就是透明的

有如下的一些作用

- 缓存
- 过滤（像防病毒扫描、家长控制）
- 负载均衡
- 认证（对不同的资源进行权限控制）
- 日志管理



### HTTP流

> 当客户端想要和服务端进行信息交互时（服务端是指最终服务器，或者是一个中间代理），过程表现为下面几步：

#### 1.打开一个TCP连接

TCP连接被用来发送一条或多条请求，以及接受响应消息。客户端可能打开一条新的连接，或重用一个已经存在的连接，或者也可能开几个新的TCP连接连向服务端。

#### 2.发送一个HTTP报文

HTTP报文（在HTTP/2之前）是语义可读的。在HTTP/2中，这些简单的消息被封装在了帧中，这使得报文不能被直接读取，但是原理仍是相同的。

```http
GET / HTTP/1.1
Host: developer.mozilla.org
Accept-Language: fr
```



#### 3.读取服务端返回的报文信息

```http
HTTP/1.1 200 OK
Date: Sat, 09 Oct 2010 14:28:02 GMT
Server: Apache
Last-Modified: Tue, 01 Dec 2009 20:18:22 GMT
ETag: "51142bc1-7449-479b075b2891b"
Accept-Ranges: bytes
Content-Length: 29769
Content-Type: text/html

<!DOCTYPE html... (here comes the 29769 bytes of the requested web page)
```



#### 4.关闭连接或者为后续请求重用连接。

当HTTP流水线启动时，后续请求都可以不用等待第一个请求的成功响应就被发送。然而HTTP流水线已被证明很难在现有的网络中实现，因为现有网络中有很多老旧的软件与现代版本的软件共存。因此，HTTP流水线已被在有多请求下表现得更稳健的HTTP/2的帧所取代。



### HTTP报文

HTTP/1.1以及更早的HTTP协议报文都是语义可读的。在HTTP/2中，这些报文被嵌入到了一个新的二进制结构，帧。帧允许实现很多优化，比如报文头部的压缩和复用。即使只有原始HTTP报文的一部分以HTTP/2发送出来，每条报文的语义依旧不变，客户端会重组原始HTTP/1.1请求。因此用HTTP/1.1格式来理解HTTP/2报文仍旧有效。

有两种HTTP报文的类型，请求与响应，每种都有其特定的格式。

#### 请求

案例:

![http-request](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/http-request.21xsklz7rx28.webp)



#### 响应

![HTTP-response](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/HTTP-response.5zyxiin1ews0.webp)

### HTTP历史

`HTTP（HyperText Transfer Protocol）`是万维网（`World Wide Web`）的基础协议。`Tim Berners-Lee` 博士和他的团队在`1989-1991`年间创造出它。【HTTP、网络浏览器、服务器】

在 1991 年发布了 `HTTP 0.9` 版，在 1996 年发布 1.0 版，1997 年是 1.1 版，1.1 版也是到今天为止传输最广泛的版本。2015 年发布了 2.0 版，其极大的优化了 `HTTP/1.1` 的性能和安全性，而 2018 年发布的 3.0 版，继续优化 `HTTP/2`，激进地使用 `UDP` 取代 `TCP` 协议，目前，`HTTP/3` 在 2019 年 9 月 26 日 被 `Chrome`，`Firefox`，和 `Cloudflare` 支持





#### HTTP 1.0

- 协议版本信息会随着每个请求发送
- 响应状态码
- 引入了 `HTTP` 头的概念，无论是请求还是拓展，允许传输元数据。使协议变得灵活，更加具有拓展性
- `Content-Type` 请求头，具备了传输除纯文本 `HTML` 文件以外其他类型文档的能力 在响应中，`Content-Type` 标头告诉客户端实际返回的内容的内容类型



#### HTTP 1.1

* 连接可以复用。长连接：`connection: keep-alive`。
* 增加了管道化技术（`HTTP Pipelinling`），允许在第一个应答被完全发送完成之前就发送第二个请求，以降低通信延迟。
* 支持响应分块，分块编码传输：`Transfer-Encoding: chunked``Content-length` 声明本次响应的数据长度。
* 引入额外的缓存控制机制。
* `Host` 头. 不同的域名配置同一个 `IP` 地址的服务器。`Host` 是 `HTTP 1.1` 协议中新增的一个请求头，主要用来实现虚拟主机技术。



#### HTTP 2.0

- `HTTP/2` 是二进制协议而不是文本协议。先来看几个概念：

- - 帧：客户端与服务器通过交换帧来通信，帧是基于这个新协议通信的最小单位。
  - 消息：是指逻辑上的 HTTP 消息，比如请求、响应等，由一或多个帧组成。
  - 流：流是连接中的一个虚拟信道，可以承载双向的消息；每个流都有一个唯一的整数标识符

- `HTTP 2.0` 中的帧将 `HTTP/1.x` 消息分成帧并嵌入到流 (`stream`) 中。

- 这是一个复用协议。并行的请求能在同一个连接中处理，移除了 `HTTP/1.x` 中顺序和阻塞的约束。多路复用允许同时通过单一的 `HTTP/2` 连接发起多重的请求-响应消息

- 压缩了`headers`。`HTTP1.x` 的 `header` 带有大量信息，而且每次都要重复发送，就造成了性能的损耗。为了减少此开销和提升性能，`HTTP/2` 使用 `HPACK` 压缩格式压缩请求和响应标头元数据，这种格式采用两种简单但是强大的技术：这种格式支持通过静态霍夫曼代码对传输的标头字段进行编码，从而减小了各个传输的大小。这种格式要求客户端和服务器同时维护和更新一个包含之前见过的标头字段的索引列表（换句话说，它可以建立一个共享的压缩上下文），此列表随后会用作参考，对之前传输的值进行有效编码。

- 服务端推送。其允许服务器在客户端缓存中填充数据，通过一个叫服务器推送的机制来提前请求。



#### 如何升级HTTP版本

使用 `HTTP/1.1` 和 `HTTP/2` 对于站点和应用来说是透明的。拥有一个最新的服务器和新点的浏览器进行交互就足够了



## HTTP协议

> https://developer.mozilla.org/zh-CN/docs/Web/HTTP
>
> [(26 封私信 / 12 条消息) 前端工程师应该对 HTTP 了解到什么程度？从哪些途径去熟悉更好？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/20391668) 代办



### what

> 介绍: 超文本传输协议(英语：**H**yper**T**ext **T**ransfer **P**rotocol，缩写：**HTTP**)是一种用于分布式、协作式和[超媒体](https://zh.wikipedia.org/wiki/超媒體)信息系统的[应用层](https://zh.wikipedia.org/wiki/应用层)[协议](https://zh.wikipedia.org/wiki/网络传输协议)[[1\]](https://zh.wikipedia.org/wiki/超文本传输协议#cite_note-ietf2616-1)。HTTP是[万维网](https://zh.wikipedia.org/wiki/全球資訊網)的数据通信的基础。
>
> 设计HTTP最初的目的是为了提供一种发布和接收[HTML](https://zh.wikipedia.org/wiki/HTML)页面的方法。通过HTTP或者[HTTPS](https://zh.wikipedia.org/wiki/HTTPS)协议请求的资源由[统一资源标识符](https://zh.wikipedia.org/wiki/统一资源标志符)（Uniform Resource Identifiers，URI）来标识。
>
> 协议主要规定了两方面的内容:
>
> * 客户端向服务器发送数据,称之为==请求报文==
> * 服务器向客户端返回数据,称之为==响应报文==

**简单理解**

> **HTTP 是一个在计算机世界里专门在两点之间传输文字、图片、音频、视频等超文本数据的约定和规范**

**超文本**

*超文本*是用超链接的方法，将各种不同空间的文字信息组织在一起的网状文本.最成功的超文本系统之应用，当属在互联网上使用的[万维网](https://zh.wikipedia.org/wiki/全球資訊網)[[2\]](https://zh.wikipedia.org/wiki/超文本#cite_note-2)。



### 版本

> HTTP的发展是由[蒂姆·伯纳斯-李](https://zh.wikipedia.org/wiki/提姆·柏內茲-李)于1989年在[欧洲核子研究组织](https://zh.wikipedia.org/wiki/歐洲核子研究組織)（CERN）所发起
>
> 1999年6月公布的 [RFC 2616](https://tools.ietf.org/html/rfc2616)，定义了HTTP协议中现今广泛使用的一个版本——HTTP 1.1。
>
> 2014年12月，[互联网工程任务组](https://zh.wikipedia.org/wiki/互联网工程任务组)（IETF）的Hypertext Transfer Protocol Bis（httpbis）工作小组将[HTTP/2](https://zh.wikipedia.org/wiki/HTTP/2)标准提议递交至[IESG](https://zh.wikipedia.org/w/index.php?title=IESG&action=edit&redlink=1)进行讨论[[2\]](https://zh.wikipedia.org/wiki/超文本传输协议#cite_note-2)，于2015年2月17日被批准。[[3\]](https://zh.wikipedia.org/wiki/超文本传输协议#cite_note-approval2-3) 
>
> HTTP/2标准于2015年5月以RFC 7540正式发表，取代HTTP 1.1成为HTTP的实现标准。[[4\]](https://zh.wikipedia.org/wiki/超文本传输协议#cite_note-rfc7540-4)



HTTP/1.0

这是第一个在通讯中指定版本号的HTTP协议版本。

HTTP/1.1

默认采用持续连接（Connection: keep-alive），能很好地配合代理服务器工作。还支持以[管道方式](https://zh.wikipedia.org/wiki/HTTP管线化)在同时发送多个请求，以便降低线路负载，提高传输速度。

HTTP/1.1相较于HTTP/1.0协议的区别主要体现在：

- 缓存处理
- 带宽优化及网络连接的使用
- 错误通知的管理
- 消息在网络中的发送
- 互联网地址的维护
- 安全性及完整性

HTTP/2, HTTP/3

they have kept the above mentioned features of HTTP/1.1





### HTTP报文组成(消息)

> [HTTP消息 - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Messages)

HTTP消息是服务器和客户端之间交换数据的方式。有两种类型的消息︰ 

* 请求（requests）--由客户端发送用来触发一个服务器上的动作；

* 响应（responses）--来自服务器的应答。

HTTP消息由采用<span style="background: #f3f3f3;color:#ef7060">ASCII</span>编码的多行文本构成。在HTTP/1.1及早期版本中，这些消息通过连接公开地发送。在HTTP/2中，为了优化和性能方面的改进，曾经可人工阅读的消息被分到多个HTTP帧中。通过配置文件（用于代理服务器或者服务器），`API`（用于浏览器）或者其他接口提供 `HTTP` 消息



#### 典型的HTTP会话

- 建立连接 在客户端-服务器协议中，连接是由客户端发起建立的。在 `HTTP` 中打开连接意味着在底层传输层启动连接，通常是 `TCP`。使用 `TCP` 时，`HTTP` 服务器的默认端口号是 `80`，另外还有 `8000` 和 `8080` 也很常用
- 发送客户端请求
- 服务器响应请求



#### HTTP请求和响应

HTTP 请求和响应具有类似解构, 由以下部分组成:

1.**起始行(start line)**

* 请求的起始行：请求方法、请求 `Path` 和`HTTP` 版本号 
* 响应的起始行：`HTTP` 版本号、响应状态码以及状态文本描述

2.**请求头(HTTP Headers)**: 指明请求或描述消息正文

3.**空行(empty):** 指示所有关于请求的元数据已经发送完毕

4.**可选的正文(body)**: 包含请求或响应的相关数据, 正文大小由起始行HTTP头指定

起始行和HTTP消息中的HTTP头统称为请求头 而其有效负载被称为消息正文.

<img src="https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/HTTPMsgStructure2.6ek1f6fu5hw0.webp" alt="HTTPMsgStructure2" style="zoom: 200%;" />



### HTTP消息- Request

#### 起始行

##### 组成

* 请求方法(区分大小写)
* 空格(a [space](https://en.wikipedia.org/wiki/Space_(punctuation)))
* 请求URL
* 另一个空格
* 协议版本,回车和换行

```http
GET /images/logo.png HTTP/1.1
```



##### <u>HTTP方法</u>

描述要求执行的动作. 例如,`GET`表示要获取资源, `POST`表示向服务器推送数据(创建/修改资源,或产生要返回的临时文件).

##### <u>请求目标request target(请求路径/Path)</u>

通常是一个URL,或者是协议,端口号和域名的绝对路径. 通常以请求的环境为特征.请求的格式因不同的hTTP方法而异. 求路径（`Path`）有以下几种：

1). 一个绝对路径,末尾跟上一个 ' ? ' 和查询字符串. 这是最常见的形式，称为 原始形式 (`origin form`)，被 `GET`，`POST`，`HEAD` 和 `OPTIONS` 方法所使用

```http
POST / HTTP/1.1
GET /background.png HTTP/1.0
HEAD /test.html?query=alibaba HTTP/1.1
OPTIONS /anypage.html HTTP/1.0
```

2).一个完整的`URL`. 主要在使用 `GET` 方法连接到代理的时候使用

```http
GET http://developer.mozilla.org/en-US/docs/Web/HTTP/Messages HTTP/1.1
```

3).由域名和可选端口（以':'为前缀）组成的 `URL` 的 `authority component`，称为 `authority form`。仅在使用 `CONNECT` 建立 `HTTP` 隧道时才使用

```http
CONNECT developer.mozilla.org:80 HTTP/1.1
```

4).星号形式 (`asterisk form`)，一个简单的星号('*')，配合 `OPTIONS` 方法使用，代表整个服务器。

```js
OPTIONS * HTTP/1.1
```



##### <u>HTTP版本</u>

定义了剩余报文的结构，作为对期望的响应版本的指示符。



#### Headers

来自请求的 [HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) 遵循和 HTTP header 相同的基本结构：不区分大小写的字符串，紧跟着的冒号 `(':')` 和一个结构取决于 header 的值。 整个 header（包括值）由一行组成，这一行可以相当长。

请求头可以分为几组：

* *General headers，*例如 [`Via`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Via)，适用于整个报文。
* *Request headers，*例如 [`User-Agent`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/User-Agent)，[`Accept-Type`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Type)，通过进一步的定义(例如 [`Accept-Language`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Language))，或者给定上下文(例如 [`Referer`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referer))，或者进行有条件的限制 (例如 [`If-None`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/If-None)) 来修改请求。
* *Entity headers，*例如 [`Content-Length`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Length)，适用于请求的 body。显然，如果请求中没有任何 body，则不会发送这样的头文件。

一些示例:

```md
Accept: 接受的数据类型  */* 表示其他类型
Accept-language 接受的语言 q=0.5表示喜好系数.
User-Agent  用户代理,浏览器的字符串标识
Accept-Encoding:  客户端接受的压缩方式
Host  主机名
Connection   链接.请求响应完成后链接的处理方式
 - keep alive  保持链接
 - close 关闭
Cookie 特殊的请求头.每一次向服务器发送请求,cookie会自动携带,传递给服务器
 - 格式:键名:键值;键名:键值;....

请求头的类型比较多,不止以上几种.可以去mdn查询:httpheaders
```



#### Body

请求的最后一部分是它的 body。不是所有的请求都有一个 body: 例如获取资源的请求，GET，HEAD，DELETE 和 OPTIONS，通常它们不需要 body。 有些请求将数据发送到服务器以便更新数据：常见的的情况是 POST 请求（包含 HTML 表单数据）

Body 大致可分为两类：

- *Single-resource bodies*，由一个单文件组成。该类型 body 由两个 header 定义： [`Content-Type`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type) 和 [`Content-Length`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Length).
- *[Multiple-resource bodies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#multipartform-data)*，由多部分 body 组成，每一部分包含不同的信息位。通常是和  [HTML Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms) 连系在一起。

![HTTP_Request_Headers2](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/HTTP_Request_Headers2.4tfbn35oqs80.webp)

单文件body和多body, 两者的不同表现在于 `Content-Type`的值。

1）`Content-Type —— application/x-www-form-urlencoded`对于 `application/x-www-form-urlencoded` 格式的表单内容，有以下特点:

I.其中的数据会被编码成以`&`分隔的键值对

II.字符以URL编码方式编码。

```http
// 转换过程: {a: 1, b: 2} -> a=1&b=2 -> 如下(最终形式)
"a%3D1%26b%3D2"
```

2)`Content-Type —— multipart/form-data`

请求头中的 `Content-Type` 字段会包含 `boundary`，且 `boundary` 的值有浏览器默认指定。例: `Content-Type: multipart/form-data;boundary=----WebkitFormBoundaryRRJKeWfHPGrS4LKe`。

数据会分为多个部分，每两个部分之间通过分隔符来分隔，每部分表述均有 `HTTP` 头部描述子包体，如`Content-Type`，在最后的分隔符会加上--表示结束。

```http
Content-Disposition: form-data;name="data1";
Content-Type: text/plain
data1
- - --WebkitFormBoundaryRRJKeWfHPGrS4LKe
Content-Disposition: form-data;name="data2";
Content-Type: text/plain
data2
- - --WebkitFormBoundaryRRJKeWfHPGrS4LKe--
```



**请求体示例**

get请求 请求体是空的
post请求, 请求体一般不为空

请求体格式是非常灵活的,任意编写.
-两种主要形式:

 - URL查询字符串
 - JSON形式

form表单可以发送很多HTTP请求,并不是只能发送get.
表单一定要加name属性.没有name属性,input元素就是无效的数据.没有name就没有办法拼接内容

HTML样式:
\<input name="login_email">
\<input name="login_password">
请求体终端打印样式:
login_email=779498590@qq.com&login_password=zDAZn2w76CUCPzD
{"name":"xiaohigh", "age": 33}
请求体格式是非常灵活的, 任意编写. url 参数与 JSON 格式两种情况用的较多



### HTTP消息-Response

#### 起始行

组成:

* 协议版本
* 空格
* 响应状态码
* 另一个空格
* 一个可能空洞的原因短语, 回车和换行等.



#### 响应头



#### 可选的响应体

响应的body部分:

1）由已知长度的单个文件组成。该类型 `body` 由两个 `header` 定义：`Content-Type` 和 `Content-Length`

2）由未知长度的单个文件组成，通过将 `Transfer-Encoding` 设置为 `chunked` 来使用 `chunks` 编码。

关于 `Content-Length` 在下面 `HTTP 1.0` 中会提到，这个是 `HTTP 1.0` 中新增的非常重要的头部。





### 请求方法

HTTP/1.1协议中共定义了八种方法（也叫“动作”）来以不同方式操作指定的资源：

- `GET`：请求服务器发送某个资源

- `HEAD`：跟 `GET` 方法类似，但服务器在响应中只返回了首部。不会返回实体的主体部分。

- `PUT`：向服务器中写入文档。语义：用请求的主体部分来创建一个由所请求的 `URL` 命名的新文档

- `POST`：用来向服务器中输入数据的。通常我们提交表单数据给服务器。【`POST` 用于向服务器发送数据，`PUT` 方法用于向服务器上的资源（例如文件）中存储数据】

- `TRACE`：主要用于诊断。实现沿通向目标资源的路径的消息环回（`loop-back`）测试 ，提供了一种实用的 `debug` 机制。

- `OPTIONS`：请求 `WEB` 服务器告知其支持的各种功能。可以询问服务器支持哪些方法。或者针对某些特殊资源支持哪些方法。

- `DELETE`：请求服务器删除请求 `URL` 中指定的的资源

- CONNECT

  HTTP/1.1协议中预留给能够将连接改为隧道方式的代理服务器。通常用于SSL加密服务器的链接（经由非加密的HTTP代理服务器）。

方法名称是区分大小写的。当某个请求所针对的资源不支持对应的请求方法的时候，服务器应当返回[状态码405](https://zh.wikipedia.org/wiki/HTTP状态码#405)（Method Not Allowed），当服务器不认识或者不支持对应的请求方法的时候，应当返回[状态码501](https://zh.wikipedia.org/wiki/HTTP状态码#501)（Not Implemented）。

**HTTP服务器至少应该实现GET和HEAD方法**，其他方法都是可选的。当然，所有的方法支持的实现都应当符合下述的方法各自的语义定义。此外，除了上述方法，特定的HTTP服务器还能够扩展自定义的方法。例如：

- PATCH（由 [RFC 5789](https://tools.ietf.org/html/rfc5789) 指定的方法）

**安全方法**

安全方法：`HTTP` 定义了一组被称为安全方法的方法。`GET` 方法和 `HEAD` 方法都被认为是安全的，这意味着 `GET` 方法和 `HEAD` 方法都不会产生什么动作 —— `HTTP` 请求不会再服务端产生什么结果，但这并不意味着什么动作都没发生，其实这更多的是 `web` 开发者决定的



#### GET和POST区别

首先要了解下副作用和幂等的概念，副作用指的是对服务器端资源做修改。幂等指发送 `M` 和 `N` 次请求（两者不相同且都大于 1），服务器上资源的状态一致。应用场景上，get是无副作用的，幂等的。post 主要是有副作用的，不幂等的情况

技术上有以下的区分：

- 缓存：`Get` 请求能缓存，`Post` 请求不能
- 安全：`Get` 请求没有 `Post` 请求那么安全，因为请求都在 `URL` 中。且会被浏览器保存历史纪录。`POST` 放在请求体中，更加安全
- 限制：`URL` 有长度限制，会干预 `Get` 请求，这个是浏览器决定的
- 编码：`GET` 请求只能进行 `URL` 编码，只能接收 `ASCII` 字符，而 `POST` 没有限制。`POST` 支持更多的编码类型，而且不对数据类型做限制
- 从 `TCP` 的角度，`GET` 请求会把请求报文一次性发出去，而 `POST` 会分为两个 `TCP` 数据包，首先发 `header` 部分，如果服务器响应 `100(continue)`， 然后发 `body` 部分。(火狐浏览器除外，它的 `POST` 请求只发一个 `TCP` 包)

GET和POST使用场景
```js
GET:
1.地址栏输入URL访问
2.点击a链接
3.link标签引入css
4.script标签引入js
5.img标签引入图片
6.form表单 <form method='get'>
7.ajax
8.其他标签(iframe..)

POST:
1.form表单 <form method='post'>
2.ajax
```



#### get请求可以添加请求体吗

> [谁说 HTTP GET 就不能通过 Body 来发送数据呢？ - 掘金 (juejin.cn)](https://juejin.cn/post/6844903685206573069)



背景知识:

把 form 的 method 设置为 post，表单数据会放在 body 中，而 method 为 get（默认值） 时，提交时浏览器会把表单中的字符拼接到 action 的 URL 后作为 query parameter 传送。

结论: 一般post带请求体, get带URL请求参数.





### http状态码

> [List of HTTP status codes - Wikipedia](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

#### 概述

> **HTTP状态码**（英语：HTTP Status Code）是用以表示[网页服务器](https://zh.wikipedia.org/wiki/網頁伺服器)[超文本传输协议](https://zh.wikipedia.org/wiki/超文本传输协议)响应状态的3位数字代码。
>
> 所有状态码被分为五类，状态码的第一个数字代表了响应的五种状态之一。所示的消息短语是典型的，但是可以提供任何可读取的替代方案。 除非另有说明，状态码是HTTP/1.1标准（[RFC 7231](https://tools.ietf.org/html/rfc7231)）的一部分。[[1\]](https://zh.wikipedia.org/wiki/HTTP状态码#cite_note-1)
>
> HTTP状态码的官方注册表由[互联网号码分配局](https://zh.wikipedia.org/wiki/互联网号码分配局)（Internet Assigned Numbers Authority）维护

#### 5 classes standard

There are five classes defined by the standard:

- *1xx informational response* – the request was received, continuing process
- *2xx successful* – the request was successfully received, understood, and accepted
- *3xx redirection* – further action needs to be taken in order to complete the request
- *4xx client error* – the request contains bad syntax or cannot be fulfilled
- *5xx server error* – the server failed to fulfil an apparently valid request



> 所有HTTP响应的第一行都是**状态行**，依次是当前**HTTP版本号**，3位数字组成的[状态代码](https://zh.wikipedia.org/wiki/HTTP状态码)，以及描述状态的短语，彼此由空格分隔。

#### 1xx(信息状态码)
- 100（客户端继续发送请求，这是临时响应）：这个临时响应是用来通知客户端它的部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应。服务器必须在请求完成后向客户端发送一个最终响应
- 101：服务器根据客户端的请求切换协议，主要用于websocket或http2升级


#### 2xx(成功状态码)
- 200（成功）：请求已成功，请求所希望的响应头或数据体将随此响应返回
- 201（已创建）：请求成功并且服务器创建了新的资源
- 202（已创建）：服务器已经接收请求，但尚未处理完成
- 203（非授权信息）：服务器已成功处理请求，但返回的信息可能来自另一来源
- 204（无内容）：服务器成功处理请求，但没有返回任何内容
- 205（重置内容）：服务器成功处理请求，但没有返回任何内容
- 206（部分内容）：表示服务器成功处理了部分请求，通常在断点续传或分块下载时使用


#### 3xx(重定向状态码)
- 300（多种选择）：针对请求，服务器可执行多种操作。 服务器可根据请求者 (user agent) 选择一项操作，或提供操作列表供请求者选择
- 301（永久移动）：请求的网页已永久移动到新位置。 服务器返回此响应（对 GET 或 HEAD 请求的响应）时，会自动将请求者转到新位置
- 302（临时移动）： 服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求
- 303（查看其他位置）：请求者应当对不同的位置使用单独的 GET 请求来检索响应时，服务器返回此代码
- 304（协商缓存）：服务器通过返回状态码304可以告诉客户端请求资源成功，但是这个资源不是由服务器提供返回给客户端的，而是客户端本地浏览器缓存中就有的这个资源，因为可以从缓存中获取这个资源，从而节省传输的开销。（也有可能是前端没有配置`nginx`代理）
- 305 （使用代理）： 请求者只能使用代理访问请求的网页。 如果服务器返回此响应，还表示请求者应使用代理
- 307 （临时重定向）： 服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求

#### 4xx(客户端错误状态码)
表示服务器无法处理请求，客户端出现错误。
400     //错误请求  服务器不理解请求的语法
401     //未授权  请求要求身份验证。对于需要登录的网页，服务器可能返回此响应
403     //禁止  服务器拒绝请求
404     //未找到  服务器找不到请求的网页
405     //方法禁用  禁用请求中指定的方法
406     //不接受  无法使用请求的内容特性响应请求的网页
407     //需要代理授权  此状态码与401（未授权）类似，但指定请求者应当授权使用代理
408     //请求超时  服务器等候请求时发生超时
409     //冲突  服务器在完成请求时发生冲突。服务器必须在响应中包含有关冲突的信息。
410     //已删除  如果请求的资源已永久删除，服务器就会返回此响应
411     //需要有效长度  服务器不接受不含有效内容长度标头字段的请求
412     //未满足前提条件  服务器未满足请求者在请求者设置的其中一个前提条件
413     //请求实体过大  服务器无法处理请求，因为请求实体过大，超出了服务器的处理能力
414     //请求的URI过长  请求的URI（通常为网址）过长，服务器无法处理
415     //不支持媒体类型  请求的格式不受请求页面的支持
416     //请求范围不符合要求  如果页面无法提供请求的范围，则服务器会返回此状态码
417     //未满足期望值  服务器未满足“期望”请求标头字段的要求


#### 5xx(服务端错误状态码)
常见的有：
500     //服务器内部错误  服务器遇到错误，无法完成请求
501     //尚未实施  服务器不具备完成请求的功能。例如，服务器无法识别请求方法时可能会返回此代码
502     //错误网关  服务器作为网关或代理，从上游服务器无法收到无效响应
503     //服务器不可用  服务器目前无法使用（由于超载或者停机维护）。通常，这只是暂时状态
504     //网关超时  服务器作为网关代理，但是没有及时从上游服务器收到请求
505     //HTTP版本不受支持  服务器不支持请求中所用的HTTP协议版本



### 端口号

```js
- 是计算机服务的端口,一台计算机有65536个端口. 2**16
UDP,TCP协议报头只有两字节存储端口号,所以只能是0~65535


//https://www.zhihu.com/question/361111920/answer/1828767342
台主机上的 TCP 连接数并不会受端口号 65535 的限制，我们有很多的办法绕开。最终限制最大 TCP 连接数的资源是机器上的内存。
```



### 首部(HTTP Headers)

1.通用首部（`General headers`）同时适用于请求和响应消息，但与最终消息主体中传输的数据无关的消息头。如 `Date`

2.请求首部（`Request headers`）包含更多有关要获取的资源或客户端本身信息的消息头。如 User-Agent

3.响应首部（`Response headers`）包含有关响应的补充信息

4.实体首部（`Entity headers`）含有关实体主体的更多信息，比如主体长(`Content-Length`)度或其 `MIME` 类型。如 `Accept-Ranges`

详细的 `Header` 见 **[HTTP Headers 集合](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)**









## HTTP HTTPS

> https://juejin.cn/post/7016593221815910408

### 概述

http: 是一个客户端和服务器端请求和应答的标准（TCP），用于从 WWW 服务器传输超文本到本地浏览器的超文本传输协议。
 https:是以安全为目标的 HTTP 通道，即 HTTP 下 加入 SSL 层进行加密。其作用是：建立一个信息安全通道，来确保数据的传输，确保网站的真实性。



### 区别及优缺点

http 是超文本传输协议，信息是明文传输，HTTPS 协议要比 http 协议`安全`，https 是具有安全性的 ssl 加密传输协议，可防止数据在传输过程中被窃取、改变，确保数据的完整性(当然这种安全性并非绝对的，对于更深入的 Web 安全问题，此处暂且不表)。

http 协议的`默认端口`为 80，https 的默认端口为 443。

http 的连接很简单，是无状态的。https 握手阶段比较`费时`，会使页面加载时间延长 50%，增加 10%~20%的耗电。

https `缓存`不如 http 高效，会增加数据开销。

Https 协议需要 ca 证书，费用较高，功能越强大的`证书费`用越高。

SSL 证书需要绑定 `IP`，不能再同一个 IP 上绑定多个域名，IPV4 资源支持不了这种消耗。



###  HTTPS协议工作原理

客户端在使用 HTTPS 方式与 Web 服务器通信时有以下几个步骤：

1. 客户端使用 https url 访问服务器，则要求 web 服务器`建立 ssl 链接`。
2. web 服务器接收到客户端的请求之后，会`将网站的证书（证书中包含了公钥），传输给客户端`。
3. 客户端和 web 服务器端开始`协商 SSL 链接的安全等级`，也就是加密等级。
4. 客户端浏览器通过双方协商一致的安全等级，`建立会话密钥`，然后通过网站的公钥来加密会话密钥，并传送给网站。
5. web 服务器`通过自己的私钥解密出会话密钥`。
6. web 服务器`通过会话密钥加密与客户端之间的通信`。

[解读HTTP1/HTTP2/HTTP3](https://juejin.cn/post/6995109407545622542)



## HTTP缓存

前端缓存分为强缓存和协商缓存

### 强缓存

* 强缓存主要使用Expires、Cache-Control 两个头字段;
* 两者同时存在Cache-Control 优先级更高。
* 当命中强缓存的时候，客户端不会再求，直接从缓存中读取内容，并返回HTTP状态码200。


#### Expires概述

* 响应头，代表该资源的过期时间。是一个GMT 格式的标准时间。

**优缺点**
* 优点: - 在过期时间以内，为用户省了很多流量;减少了服务器重复读取磁盘文件的压力.
* 缺点:
	* 缓存过期以后，服务器不管文件有没有变化会再次请求服务器。
	* 缓存过期时间是一个具体的时间，这个时间依赖于客户端的时间，如果时间不准确或者被改动缓存也会随之受到影响。

#### Cache-Control概述

* 请求头/响应头.缓存控制字段，精确控制缓存策略
* 为了让强缓存更精确，HTTP1.1增加了Cache-Control字段。Cache-Control既能出现在请求头又能出现在响应头
**服务端参数**

| 服务端参数名称     | 含义                                                             |
| ----------- | -------------------------------------------------------------- |
| max-age=xxx | 在xxx秒内有效                                                       |
| s-maxage    | 用于表示 cache 服务器上（比如 cache CDN，缓存代理服务器）的缓存的有效时间的，并只对 public 缓存有效 |
| no-cache    | 不使用本地强缓存。需要使用缓存协商                                              |
| no-store    | 直接禁止浏览器缓存数据，每次用户请求该资源，都会向服务器发送一个请求，每次都会下载完整的资源。                |
| public      | 可以被所有的用户缓存，包括终端用户和中间代理服务器。                                     |
| private     | 只能被终端用户的浏览器缓存，不允许中间缓存代理进行缓存，默认的。                               |

**客户端参数**

| 客户端参数名称        | 含义                                                                    |
| -------------- | --------------------------------------------------------------------- |
| max-stale=N    | 表示客户端到代理服务器上拿缓存的时候，即使代理缓存过期了也不要紧，只要过期时间在N秒之内，还是可以从代理中获取的              |
| min-fresh=N    | 表示代理缓存需要一定的新鲜度，不要等到缓存刚好到期再拿，一定要在到期前N 秒之前的时间拿，否则拿不到。                   |
| only-if-cached | 这个字段加上后表示客户端只会接受代理缓存，而不会接受源服务器的响应。如果代理缓存无效，则直接返回 504（Gateway Timeout） |



验证方式

以下表示一旦资源过期（比如已经超过 `max-age`），在成功向原始服务器验证之前，缓存不能用该资源响应后续请求

```http
Cache-Control: must-revalidate
```



以下是一个 `Cache-Control` 强缓存的过程：

- 首次请求，直接从 server 中获取。其中会设置 `max-age=100`
- 第二次请求，`age=10`，小于 100，则命中 `Cache`，直接返回
- 第三次请求，`age=110`，大于 110。强缓存失效，就需要再次请求 `Server`



### 协商缓存

`If-Modified-Since——Last-Modified`

`Last-Modified` 表示本地文件最后修改日期，浏览器会在 `request header` 加上 `If-Modified-Since`（上次返回的 `Last-Modified` 的值），询问服务器在该日期后资源是否有更新，有更新的话就会将新的资源发送回来

但是如果在本地打开缓存文件，就会造成 `Last-Modified` 被修改，所以在 `HTTP / 1.1` 出现了 `ETag`



`If-none-match——ETags`

`Etag` 就像一个指纹，资源变化都会导致 `ETag` 变化，跟最后修改时间没有关系，`ETag` 可以保证每一个资源是唯一的。`If-None-Match` 的 `header` 会将上次返回的 `Etag` 发送给服务器，询问该资源的 `Etag` 是否有更新，有变动就会发送新的资源回来

```
If-none-match、ETags优先级高于 If-Modified-Since、Last-Modified
```



第一次请求

![640 (411×369)](https://mmbiz.qpic.cn/mmbiz_png/betIP9fVPicP9mOWh8f5hp8VpYXOEAAvNKd9HCOXvg9evnZ8Via0v3j9cEeaauXuj2Zyic9uSds4diavSXarAVCO9g/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

第二次请求

![img](https://mmbiz.qpic.cn/mmbiz_png/betIP9fVPicP9mOWh8f5hp8VpYXOEAAvNDw5BPliaicNNulJDzMINsS4vIUeZuCJ7nGcCfOIXcC96ECk3V70Zmp7A/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)



协商缓存，假如没有改动的话，返回 304 ，改动了返回 200 资源

- 200：强缓存 `Expires/Cache-Control` 失效时，返回新的资源文件
- 200 `(from cache)`: 强缓 `Expires/Cache-Control` 两者都存在，未过期，`Cache-Control` 优先 `Expires` 时，浏览器从本地获取资源成功
- 304 `(Not Modified)`：协商缓存 `Last-modified/Etag` 没有过期时，服务端返回状态码304

现在的200`(from cache)`已经变成了 `disk cache`(磁盘缓存)和 `memory cache`(内存缓存)两种



#### revving技术

上面提到 `HTTP` 缓存相关，但是很多有时候，我们希望上线之后需要更新线上资源。

`web` 开发者发明了一种被 `Steve Souders` 称之为 `revving` 的技术。不频繁更新的文件会使用特定的命名方式：在 `URL` 后面（通常是文件名后面）会加上版本号。

弊端：更新了版本号，所有引用这些的资源的地方的版本号都要改变

`web` 开发者们通常会采用自动化构建工具在实际工作中完成这些琐碎的工作。当低频更新的资源（`js/css`）变动了，只用在高频变动的资源文件（`html`）里做入口的改动。



## cookie


> 浏览器系列之 Cookie 和 SameSite 属性 https://github.com/mqyqingfeng/Blog/issues/157

### cookie

> 一般我们都会说 “HTTP 是一个无状态的协议”，不过要注意这里的 HTTP 其实是指 HTTP 1.x，而所谓无状态协议，简单的理解就是即使同一个客户端连续两次发送请求给服务器，服务器也识别不出这是同一个客户端发送的请求，这导致的问题就比如你加了一个商品到购物车中，但因为识别不出是同一个客户端，你刷新下页面就没有了……

#### 出现背景
* 为了解决 HTTP 无状态导致的问题，后来出现了 Cookie。(首先无状态并不是不好，有优点，但也会导致一些问题)
* Cookie 的存在也不是为了解决通讯协议无状态的问题，只是为了<span style="color:blue">解决客户端与服务端会话状态的问题</span>，这个状态是指后端服务的状态而非通讯协议的状态。



#### cookie介绍

> Cookie（复数形态Cookies），类型为「小型文本文件」，指某些网站为了辨别用户身份而储存在用户本地终端上的数据。

* 一般不超过 4KB 的变量存储在浏览器上
* 由一个名称（Name）、一个值（Value）和其它几个用于控制 Cookie 有效期、安全性、使用范围的可选属性组成.
* cookie本质是一个存储在浏览器的文本,随着http请求自动传递给服务器.也可以说cookie是一个请求头(响应头):
  * 服务器以响应头的形式将cookie发送浏览器
  * 浏览器收到以后自动将cookie保存
  * 浏览器再次访问服务器时, 会以[请求头]的形式将cookie发回.



#### 设置cookie

> [ vue2+axios 使用get或者post, 如何能够在请求头添加Cookie？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/67080919)

##### 生成

首先根据cookie的来源,可以分为两种:

- 服务端设定的cookie
- 客户端设定的cookie

服务端设置cookie，在响应请求的时候设置Header就可以了。

```http
Set-Cookie: "[键]=[值];domain=[域];path=[路径];expires=[有效期]"
```

客户端设置cookie, 调用浏览器提供的api

```http
document.cookie = '键=值;domin=[域];path=[路径];expires=[有效期]'
```



##### 接收

服务端如何接收cookie?

浏览器发送请求前，会检索在**当前域和当前路径下，没过期的cookie**，如果有的话会**自动**携带在请求头中，发送给服务器。

然而，不是所有的cookie都会被发送，这是因为：

- 传输会严重降低性能
- 会引发潜在的隐私问题

所以，**只有服务器设置的cookie会发送给服务器，其他的都会被过滤掉**。



##### 其他

用cookie传递数据的原因? 

- 如果你想检验登陆状态，cookie应该由服务端设定
- 如果你想用cookie暂存某些数据，这些数据则实际上不必发送
- 如果你想发送数据，可以在query、body中携带
- 如果你想在客户端主动操作授权，可以使用[authorization](https://www.zhihu.com/search?q=authorization&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A249521556})

我们在axios中可以这样设置：

```js
{
  url: '/test',
  method: 'get',
  auth: {
    user: 'zhangsan',
    password: '123456'
  }
}
```







#### 会话性cookie

会话期Cookie是最简单的 `Cookie`：浏览器关闭之后它会被自动删除，也就是说它仅在会话期内有效。会话期 `Cookie` 不需要指定过期时间（`Expires`）或者有效期（`Max-Age`）。需要注意的是，有些浏览器提供了会话恢复功能，这种情况下即使关闭了浏览器，会话期 `Cookie` 也会被保留下来，就好像浏览器从来没有关闭一样



#### 持久性cookie

持久性 `Cookie` 可以指定一个特定的过期时间（`Expires`）或有效期（`Max-Age`）。

```http
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
```

#### Cookie的Secure和HttpOnly 标记

标记为 `Secure` 的 `Cookie` 只应通过被 `HTTPS` 协议加密过的请求发送给服务端。

标记为 `Secure` 的 `Cookie` 只应通过被 `HTTPS` 协议加密过的请求发送给服务端。但即便设置了 `Secure` 标记，敏感信息也不应该通过 `Cookie` 传输，因为 `Cookie` 有其固有的不安全性，`Secure` 标记也无法提供确实的安全保障

通过 `JavaScript` 的 `Document.cookie` `API` 是无法访问带有 `HttpOnly` 标记的 `cookie`。这么做是为了避免跨域脚本攻击（`XSS`）

```http
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
```



#### cookie作用域

`Domain` 和 `Path` 标识定义了 `Cookie` 的作用域：即 `Cookie` 应该发送给哪些 `URL`。

`Domain` 标识指定了哪些主机可以接受 `Cookie`。如果不指定，默认为当前的主机（不包含子域名）。如果指定了 `Domain`，则一般包含子域名。

例如，如果设置 `Domain=mozilla.org`，则 `Cookie` 也包含在子域名中（如`developer.mozilla.org`）。

`Path` 标识指定了主机下的哪些路径可以接受 `Cookie`（该 `URL` 路径必须存在于请求 `URL` 中）。以字符 %x2F ("/") 作为路径分隔符，子路径也会被匹配。

例如，设置 `Path=/docs`，则以下地址都会匹配：

```http
/docs
/docs/Web/
/docs/Web/HTTP
```



#### SameSite Cookies

`SameSite Cookie` 允许服务器要求某个 `cookie` 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击

- `None` 浏览器会在同站请求、跨站请求下继续发送 `cookies`，不区分大小写。【旧版本 `chrome` 默认 `Chrome 80` 版本之前】
- `Strict` 浏览器将只在访问相同站点时发送 `cookie`。
- `Lax` 将会为一些跨站子请求保留，如图片加载或者 `frames` 的调用，但只有当用户从外部站点导航到 `URL` 时才会发送。如 `link` 链接

```js
Set-Cookie: key=value; SameSite=Strict
```



`None Strict Lax`

在新版本的浏览器（`Chrome 80` 之后）中，`SameSite` 的默认属性是 `SameSite=Lax`。换句话说，当 `Cookie` 没有设置 `SameSite` 属性时，将会视作 `SameSite` 属性被设置为 `Lax` —— 这意味着 `Cookies` 将不会在当前用户使用时被自动发送。如果想要指定 `Cookies` 在同站、跨站请求都被发送，那么需要明确指定`SameSite` 为 `None`。因为这一点，我们需要好好排查旧系统是否明确指定 `SameSite`，以及推荐新系统明确指定 `SameSite`，以兼容新旧版本 `Chrome`



更多cookie[知识](https://juejin.cn/post/6844903841909964813)







#### 如何查看

> 浏览器 >>> application >>> Cookies

在浏览器里查看到了 Cookie，这并不意味着 Cookie 文件只是存放在浏览器里的。实际上，Cookies 相关的内容还可以存在本地文件里，就比如说 Mac 下的 Chrome，存放目录就是 `~/Library/Application Support/Google/Chrome/Default`，里面会有一个名为 Cookies 的数据库文件，你可以使用 sqlite 软件打开它

存放在本地的好处就在于即使你关闭了浏览器，Cookie 依然可以生效。



#### Cookie的设置

##### 设置流程

1. 客户端发送 HTTP 请求到服务器
2. 当服务器收到 HTTP 请求时，在响应头里面添加一个 Set-Cookie 字段
3. 浏览器收到响应后保存下 Cookie
4. 之后对该服务器每一次请求中都通过 Cookie 字段将 Cookie 信息发送给服务器。



##### 案例

以 `https://main.m.taobao.com/` 为例来看下这个过程：

我们在请求返回的 Response Headers 可以看到 Set-Cookie 字段：

![cookie1](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/cookie1.48sie5jdf600.webp)

然后我们查看一下Cookie:

![cookie2](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/cookie2.2ho9972y93q0.webp)

我们刷新一遍页面，再看下这个请求，可以在 Request Headers 看到 cookie 字段：

![cookie3](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/cookie3.5svpn2zexc00.webp)





#### Cookie的属性

下面这张图里我们可以看到 Cookies 相关的一些属性：

![cookie4](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/cookie4.687zvx9e1ic0.webp)

主要说一些大家可能没有注意的点：

##### **Name/Value**

用 JavaScript 操作 Cookie 的时候注意对 Value 进行编码处理。

##### **Expires**

Expires 用于设置 Cookie 的过期时间。比如：

```javascript
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
```

当 Expires 属性缺省时，表示是<span style="color:blue">会话性 Cookie</span>，像上图 Expires 的值为 Session，表示的就是会话性 Cookie。当为会话性 Cookie 的时候，值保存在客户端内存中，并在用户关闭浏览器时失效。需要注意的是，有些浏览器提供了会话恢复功能，这种情况下即使关闭了浏览器，会话期 Cookie 也会被保留下来，就好像浏览器从来没有关闭一样。

与会话性 Cookie 相对的是<span style="color:blue">持久性 Cookie</span>，持久性 Cookies 会保存在用户的硬盘中，直至过期或者清除 Cookie。这里值得注意的是，设定的日期和时间只与客户端相关，而不是服务端。



##### **Max-age**

Max-Age 用于设置在 Cookie 失效之前需要经过的秒数。比如：

```
Set-Cookie: id=a3fWa; Max-Age=604800;
```

Max-Age 可以为正数、负数、甚至是 0。

如果 max-Age 属性为正数时，浏览器会将其持久化，即写到对应的 Cookie 文件中。

当 max-Age 属性为负数，则表示该 Cookie 只是一个会话性 Cookie。

当 max-Age 为 0 时，则会立即删除这个 Cookie。

假如 Expires 和 Max-Age 都存在，Max-Age 优先级更高。



##### **Domain**

Domain 指定了 Cookie 可以送达的主机名。假如没有指定，那么默认值为当前文档访问地址中的主机部分（但是不包含子域名）。

像淘宝首页设置的 Domain 就是 .taobao.com，这样无论是 a.taobao.com 还是 b.taobao.com 都可以使用 Cookie。

在这里注意的是，不能跨域设置 Cookie，比如阿里域名下的页面把 Domain 设置成百度是无效的：

```
Set-Cookie: qwerty=219ffwef9w0f; Domain=baidu.com; Path=/; Expires=Wed, 30 Aug 2020 00:00:00 GMT
```



##### Path

Path 指定了一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部。比如设置 `Path=/docs`，`/docs/Web/` 下的资源会带 Cookie 首部，`/test` 则不会携带 Cookie 首部。

Domain 和 Path 标识共同定义了 Cookie 的作用域：即 Cookie 应该发送给哪些 URL。

##### Secure属性

标记为 Secure 的 Cookie 只应通过被HTTPS协议加密过的请求发送给服务端。使用 HTTPS 安全协议，可以保护 Cookie 在浏览器和 Web 服务器间的传输过程中不被窃取和篡改。

##### HTTPOnly

设置 HTTPOnly 属性可以防止客户端脚本通过 document.cookie 等方式访问 Cookie，有助于避免 XSS 攻击。

##### SameSite

 Chrome80 版本中默认屏蔽了第三方的 Cookie

**作用**

SameSite 属性可以让 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）

**属性值**

SameSite 可以有下面三种值：

1. **Strict** 仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致。
2. **Lax** 允许部分第三方请求携带 Cookie
3. **None** 无论是否跨站都会发送 Cookie

之前默认是 None 的，Chrome80 后默认是 Lax。

**跨域和跨站**

首先要理解的一点就是跨站和跨域是不同的。同站(same-site)/跨站(cross-site)」和第一方(first-party)/第三方(third-party)是等价的。但是与浏览器同源策略（SOP）中的「同源(same-origin)/跨域(cross-origin)」是完全不同的概念。

同源策略的同源是指两个 URL 的协议/主机名/端口一致。例如，https://www.taobao.com/pages/...，它的协议是 https，主机名是 [www.taobao.com，端口是](http://www.taobao.xn--com%2C-ye1g628gmm4a/) 443。

同源策略作为浏览器的安全基石，其「同源」判断是比较严格的，相对而言，Cookie中的「同站」判断就比较宽松：只要两个 URL 的 eTLD+1 相同即可，不需要考虑协议和端口。其中，eTLD 表示有效顶级域名，注册于 Mozilla 维护的公共后缀列表（Public Suffix List）中，例如，.com、.co.uk、.github.io 等。eTLD+1 则表示，有效顶级域名+二级域名，例如 taobao.com 等。

举几个例子，www.taobao.com 和 [www.baidu.com](http://www.baidu.com/) 是跨站，www.a.taobao.com 和 [www.b.taobao.com](http://www.b.taobao.com/) 是同站，a.github.io 和 b.github.io 是跨站(注意是跨站)。




接下来看下从 None 改成 Lax 到底影响了哪些地方的 Cookies 的发送？直接来一个图表：

![samesite](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/samesite.7egvdxoc1y40.webp)

从上图可以看出，对大部分 web 应用而言，Post 表单，iframe，AJAX，Image 这四种情况从以前的跨站会发送三方 Cookie，变成了不发送。

Post表单：应该的，学 CSRF 总会举表单的例子。

iframe：iframe 嵌入的 web 应用有很多是跨站的，都会受到影响。

AJAX：可能会影响部分前端取值的行为和结果。

Image：图片一般放 CDN，大部分情况不需要 Cookie，故影响有限。但如果引用了需要鉴权的图片，可能会受到影响。

除了这些还有 script 的方式，这种方式也不会发送 Cookie，像淘宝的大部分请求都是 jsonp，如果涉及到跨站也有可能会被影响。

**问题**

1. 天猫和飞猪的页面靠请求淘宝域名下的接口获取登录信息，由于 Cookie 丢失，用户无法登录，页面还会误判断成是由于用户开启了浏览器的“禁止第三方 Cookie”功能导致而给与错误的提示
2. 淘宝部分页面内嵌支付宝确认付款和确认收货页面、天猫内嵌淘宝的登录页面等，由于 Cookie 失效，付款、登录等操作都会失败
3. 阿里妈妈在各大网站比如今日头条，网易，微博等投放的广告，也是用 iframe 嵌入的，没有了 Cookie，就不能准确的进行推荐
4. 一些埋点系统会把用户 id 信息埋到 Cookie 中，用于日志上报，这种系统一般走的都是单独的域名，与业务域名分开，所以也会受到影响。
5. 一些用于防止恶意请求的系统，对判断为恶意请求的访问会弹出验证码让用户进行安全验证，通过安全验证后会在请求所在域种一个Cookie，请求中带上这个Cookie之后，短时间内不再弹安全验证码。在Chrome80以上如果因为Samesite的原因请求没办法带上这个Cookie，则会出现一直弹出验证码进行安全验证。
6. 天猫商家后台请求了跨域的接口，因为没有 Cookie，接口不会返回数据
7. ……



**解决**

解决方案就是设置 SameSite 为 none。

以 Adobe 网站为例：https://www.adobe.com/sea/，查看请求可以看到：

![Adobe](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/Adobe.19seh6no9qg0.webp)

不过也会有两点要注意的地方：

1. HTTP 接口不支持 SameSite=none

如果你想加 SameSite=none 属性，那么该 Cookie 就必须同时加上 Secure 属性，表示只有在 HTTPS 协议下该 Cookie 才会被发送。

1. 需要 UA 检测，部分浏览器不能加 SameSite=none

IOS 12 的 Safari 以及老版本的一些 Chrome 会把 SameSite=none 识别成 SameSite=Strict，所以服务端必须在下发 Set-Cookie 响应头时进行 User-Agent 检测，对这些浏览器不下发 SameSite=none 属性


**注意**
> [(12) Barret李靖 on X: "Chrome 在 2024.01.04 也就是下周四，会开启 1% 的全球灰度，限制（默认禁止）Chrome 浏览器访问第三方 cookies，https://t.co/1o1T2AT1Mp，其目的是通过限制网站对第三方 cookie 的访问来限制跨站点跟踪，同时也可以防范大量 CSRF 攻击问题，影响的网站会比较多。… https://t.co/DaGYDc3jvh" / X (twitter.com)](https://twitter.com/Barret_China/status/1740665621866840568)
Chrome在2024.01.04开始灰度测试,限制(默认禁止)Chrome浏览器访问第三方cookies([Google shares update on next step toward phasing out third-party cookies in Chrome (blog.google)](https://blog.google/products/chrome/privacy-sandbox-tracking-protection/)).
会有哪些影响?
* A站点下iframe内嵌了B站点, 当iframe中的b站点发起请求时, 它当前域下的cookie会禁止被携带. 例如，如果要求 B 站点必须是登录态，那么即便 B 站点刚在独立 Tab 页登录过，它在 iframe 下仍然会是未登录态，因为这种情况不允许它获取 B 站点下的 cookies 了.
* A 站点通过 ajax 请求 B 站点的接口，此时 B 站点下的 cookies 在请求时会禁止被携带。也就是说，广告类、推荐类业务等都会直接受到影响，请求是可以发出去的，但是丢失了当前用户身份信息，无法进行身份识别和内容推荐
当前的策略则更强，不管你是否有设置 SameSite=None，默认禁止访问第三方 cookies。 当然，它也提供了几个规避策略，允许网站自主修复这个问题：
* 在 cookies 中增加 partitioned 属性，例如 `key=value; SameSite=None; Secure; Partitioned;`. Partitioned，它的作用是允许在 A 站点下新写一份 cookies，这份 cookies 跟独立打开 A 站点写下的 cookies 是两个储存空间，互不干扰.
* Chrome 提供了一个 Related Website Sets 的白名单机制，允许你通过提交配置的方式给浏览器增加白名单，配置的作用是明确 A 站点与 B 站点存在关联关系，详情可以看这里：[https://github.com/GoogleChrome/related-website-sets/blob/main/RWS-Submission_Guidelines.md…](https://t.co/yWpUAhcwJU)
* 通过 Storage Access API 向用户获得授权，跟网页要打开摄像头要求授权一样，只不过有效期只有 30 天。详情可以看这里：[https://developers.google.com/privacy-sandbox/3pcd/storage-access-api?hl=zh-cn…](https://t.co/S2d6ByvDIA)






#### cookie的不足

* 各个浏览器对cookie的数量和大小都有不同的限制，这样就导致我们不能在Cookie中保存过多的信息。一般数量不超过50个，单个大小不超过4kb。
* cookie是由服务器发送给浏览器，再由浏览器将cookie发回，如果cookie较大会导致发送速度非常慢，降低用户的体验



#### 框架下cookie的使用

```js
通过配置cookie-parser中间件,可以将cookie解析为一个对象,并且添加为response的cookie属性.
使用步骤:
//1.下载安装包
npm i cookie-parser -S

//2.引入
const express=require('express');
var cookieParser=require('cookie-parser');
//3.设置中间件
app.use(cookieParser());

app.get('/set-cookie', (requset, response)=>{
    //4.创建cookie的两种方式:区别在于参数个数,生命周期
    //格式: response.cookie('参数1','参加2',留存时间对象) 
    //设置后,浏览器端的Response-Headers中会多出一个响应头Set-Cookie.Request-Headers多出一个Cookie的请求头
    //Request-Headers: Cookie:name=xiaohigh
    //Response-Headers:Set-Cookie: name(参数1)=xiaohigh(参数2); Path=/
    
    response.cookie('username', 'sunwukong', {maxAge:60*60*24*1000});
    response.cookie('name', 'xiaohigh', {maxAge:60*1000}) //声明周期 60秒*1000毫秒
})       
    
    //5.获取cookie  
    app.get('/get-cookie', (request, response)=>{
    	conole.log(request.cookies); //服务端
    	response.send('获取cookie'); //cookie设置是对响应头进行设置,响应体没有内容.所以需要send.不设置会一直页面会一直请求.
	})  

//5.删除cookie
app.get('/clearcookie', (request, response)=>{
    response.clearCookie('username')//用来删除一个指定的cookie
})
app.listen(80);



- 格式补充:
set-cookie 是服务器响应cookie
- path=/
path路径,设置该cookie生效的路径
/ 表示根目录
domain 该cookie生效的域名 例如baike.baidu.com

- 声明周期
1.设置时间的cookie
结束时间:设置的时间周期
2.未设置时间的cookie
结束时间:关闭浏览器.但若还在相应时间范围内,带声明周期的cookie会存在.




```



#### cookie与token
> [后端可以直接从cookie里取到token，为什么前端还要token设置到Authorization？ - 知乎](https://www.zhihu.com/question/558219586)

前后端交互时,用户身份信息token的两种方案:
* 将 token 放在 cookie 里；
* 将 token 放在请求头里，用 Authorization 字段


**将token放在cookie里**
设置 cookie 可以依赖后端的 Set-Cookie 响应头，同域名的情况下发送所有请求的时候 cookie 也是自动带上的（也有坏处，这样经常会造成网络流量和带宽的浪费，所以 CDN 的域名都是和主站不同的，避免请求带上 cookie 浪费流量）；
在安全性方面，cookie 可以设置 HttpOnly 来保护 cookie 无法被 JS 代码捕获，避免 XSS 等攻击，还可以设置 Secure 来确保只在 https 环境下传输 token；这些能力由浏览器提供，Authorization 无法实现；
cookie 会存在 CSRF 攻击的问题，虽然浏览器厂商在逐步禁止第三方 cookie（似乎推迟到 2024 年了），但是这个问题还是不得不防（如果想使用第三方 cookie，可以在后端响应中设置 cookie 的 SameSite 属性）；

cookie 会存在 CSRF 攻击的问题,浏览器厂商在逐步禁止第三方 cookie（似乎推迟到 2024 年了），但是这个问题还是不得不防（如果想使用第三方 cookie，可以在后端响应中设置 cookie 的 SameSite 属性）；
在一级域名相同的情况下，cookie 可以实现跨子域名互通，比如 a.example.com 和 b.example.com 之间可以实现 cookie 互通（设置 cookie 时提供 Domain=example.com 属性），这个能力也是 Authorization 不具备的；
网页中的图片 <img /> 请求时也会自动带上 cookie，好处是便于控制网络图片的访问权限，例如网络相册的权限控制可以精确到用户级，这个是 Authorization 做不到的，它必须把 token 放在 url 查询里面才行；缺点：如果网页中的背景图、icon 等资源图片放在相同的域名下，每次请求这些资源图片都会带上 cookie，很浪费带宽和服务器的流量， 所以 CDN 的域名一定要和主域名区分开。


**token放在请求头中,用Authentication字段**
此字段需要由 JS 代码来写入，请求想要带上 Authorization 字段则需要用 JS 代码来给请求方法添加全局拦截器，因此它天生具备防止 CSRF 的功能；只有浏览器使用 cookie，而 Node.js 等环境是没有 cookie 的（评论区有人补充，现在小程序也可以支持 cookie），只能使用 Authorization；因为此字段完全由 JS 来操作；虽然它原生没有提供 cookie 的 Secure、Expires 等功能，但你可以通过 JS 代码自行实现； 前端将 token 持久存储，一般会存储在 LocalStorage 里面，此时存在 XSS 攻击盗取 token 的问题（将 LocalStorage 里的 token 加密可以一定程度上避免此问题），而且它是无法跨域互通的，即使两个网站的一级域名相同也无法互通；部分认证规范要求使用 Authorization 字段，例如 JWT，如果使用了相关的认证（尤其是第三方服务），则必须使用此字段。



### session

> Session 是一个对象，存储特定用户会话所需的属性及配置信息。
>
> Session是保存在服务器端的数据.（保存介质， 文件、数据库、内存）



#### session工作流程

```
我们可以在服务器中为每一次会话创建一个对象，然后每个对象都设置一个唯一的id，并将该id以cookie的形式发送给浏览器(响应头中查看)，然后将会话中产生的数据统一保存到这个对象中，这样我们就可以将用户的数据全都保存到服务器中，而不需要保存到客户端，客户端只需要保存一个id即可。
```





#### 框架下session使用

```js
查看使用:npmjs.com网站

//1.下载安装
npm i express-session

//2.引入模块
var session=require('express-session');

//3.中间件设置
app.use(session({
    name:'id22',          //设置cookie的name,默认值是connect.sid
    secret: 'keyboard cat', //参与加密的字符串(又称签名)
    resave: false,         //是否在每次请求时重新保存session
    saveUninitialized: true, //是否每一个客户端都进行初始化 是否为每次请求都设置一个cookie用来储存session的id.建议使用true,虽然初始默认值是false.
    //cookie:{secure:true}  //需要证书
    //设置cookie
    cookie:{
        httpOnly:true, //开启权限,前后端无法无法通过JS操作
        maxAge:1000*30 //控制sessionID的过期时间的.
    }
}))

//4.设置session 
//session的存储位置: 内存. 放在内存中的特点: 重启之后session会丢失
app.get('/set-session', (request, response)=>{
    request.session.name='xiaohigh';
    request.session.email='xiaohigh@qq.com';
//浏览器请求此页面之后,在Response-Headers中有Set-Cookie,其值有connect-id及加密值,path路径,HTTPOnly(表明该cookie只能进行HTTP请求使用,表明该cookie不允许浏览器使用JS修改cookie. 通常可使用document.cookie获取当前浏览器的cookie).  
    response.send('session的设置');
})

//5.获取session
app.get('/get-session', (request, response)=>{
    console.log(request.session.name);
    console.log(request.session.email);
    
    response.send('获取session');
})

//6.删除session
app.get('/clear-session', (request, response)=>{
    request.session.destroy(function(){
        response.send('session删除成功');
    })
})

app.listen(80);

```





### cookie与session的区别

1)	**存在的位置：**
cookie 存在于客户端
session 存在于服务器端，一个session域对象为一个用户浏览器服务
2)	**安全性：(https证书)**
cookie是以明文的方式存放在客户端的，安全性较低，可以通过一个加密算法进行加密后存放
session存放于服务器中，所以安全性较好
3)	**网络传输量：**
cookie会传递消息给服务器
session本身存放于服务器，但是通过cookie传递id，会有少量的传送流量
4)	**大小：**
cookie 保存的数据不能超过4K，很多浏览器都限制一个站点最多保存50个cookie
session 保存数据理论上没有任何限制











## 相关的使用案例











## 面试题整理

```js
https://github.com/forthealllight/blog/issues/19

https://juejin.cn/post/6844903844216832007#heading-13
```





















