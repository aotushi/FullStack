
## HTTP

### HTTP报文结构
> https://github.com/Easay/issuesSets/issues/64


1.**起始行(start line)**
* 请求的起始行：请求方法、请求 `Path` 和`HTTP` 版本号 
* 响应的起始行：`HTTP` 版本号、响应状态码以及状态文本描述

2.**HTTP头(HTTP Headers)**: 指明请求或描述消息正文

3.**空行(empty):** 指示所有关于请求的元数据已经发送完毕

4.**可选的正文(body)**: 包含请求或响应的相关数据, 正文大小由起始行HTTP头指定

起始行和HTTP消息中的HTTP头统称为请求头 而其有效负载被称为消息正文.

<img src="https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/HTTPMsgStructure2.6ek1f6fu5hw0.webp" alt="HTTPMsgStructure2" style="zoom: 200%;" />


### 输入网址后发生了什么

> [what-happens-when-zh_CN/README.rst at master · skyline75489/what-happens-when-zh_CN (github.com)](https://github.com/skyline75489/what-happens-when-zh_CN/blob/master/README.rst?utm_medium=social&utm_source=wechat_session&from=timeline&isappinstalled=0)


1. 浏览器接收到URL，解析URL, 然后是通过'渲染进程'发出网络请求线程
2. 一个完整的HTTP请求的发出分两步
	1. DNS解析(浏览器-系统自身->host->本地域名服务器->迭代查询根域名服务器->顶级域名服务器->权威域名服务器)
	2. 通信链路建立(TCP3次握手->4次挥手)
		1. 进行三次握手,建立TCP连接
			1. 第一次握手：建立连接。客户端发送连接请求报文段
			2. 第二次握手：服务器收到报文段。同时，自己还要发送请求信息给客户端
			3. 第三次握手：客户端收到服务器的报文段。然后将向服务器发送报文段，客户端服务器更新状态,完成TCP三次握手。
		2. 客户端发送HTTP请求,服务器处理请求,返回响应结果
			1. 一方完成数据发送任务.关闭TCP连接,四次挥手
			2. 客户端告诉服务器，我不需要再发送数据了。
			3. 服务器告诉客户端，我知道你不需要再发送数据了。
			4. 服务器告诉客户端，我也不需要再发送数据了。
			5. 客户端告诉服务器，我知道你不需要再发送数据了。
3. 服务器接收到请求并转到具体的处理后台
	1. 一般是反向代理服务器先处理
	2. 然后进入后台处理, 最终结果以http响应包形式发送
4. 前后台之间的HTTP交互和涉及的缓存机制
	1. HTTP1.0/HTTP1.1/HTTP2.0不同的处理机制
	2. 强缓存/协商缓存
5. 浏览器接收到数据包后的关键渲染路径
	1. HTML 被 HTML 解析器解析成 DOM 树；
	2. CSS  被 CSS 解析器解析成 CSSOM 树；
	3. 结合 DOM 树和 CSSOM 树，生成一棵渲染树(Render Tree,这一过程称为 Attachment)
	4. 生成布局(flow)，浏览器在屏幕上“画”出渲染树中的所有节点；
	5. 将布局绘制(paint)在屏幕上，显示出整个页面。
6. JS引擎的解析过程
	1. JS更改渲染树的结构, 重新执行渲染流程


![[typeUrlProcess.png]]





### 浏览器如何渲染页面的？
> https://juejin.cn/post/7299696650896080922  
1. **解析 HTML 和构建 DOM 树**：
- 浏览器开始解析 HTML 数据，并构建文档对象模型（DOM）树，表示网页的结构和内容。DOM 树是一个树状结构，其中每个 HTML 元素都被表示为一个节点，包括文本、标签、属性等。

2. **解析 CSS 和构建 CSSOM 树**：
- 同时，浏览器也开始解析 CSS 数据，并构建 CSS 对象模型（CSSOM）树，表示网页的样式和布局信息。CSSOM 树与 DOM 树一一对应，每个元素都有对应的样式信息。

3. **合并 DOM 和 CSSOM，构建渲染树**：
- 浏览器将 DOM 树和 CSSOM 树合并，构建渲染树（Render Tree）。渲染树包含了需要渲染的页面内容，但不包括那些被 CSS 隐藏的元素。

4. **布局计算**：
- 浏览器开始计算每个元素在页面中的精确位置和尺寸，这个过程称为布局计算。浏览器确定元素如何放置和相互布局。

5. **绘制页面**：
- 浏览器使用计算出的位置和尺寸信息来绘制页面。这包括将页面内容绘制到屏幕上的像素点上，以及处理字体渲染、图像显示等。

6. **处理 JavaScript**：
- 如果页面包含 JavaScript，浏览器将执行 JavaScript 代码。JavaScript 可能会修改 DOM 树和样式，从而触发重新布局和绘制。

7. **反复执行布局和绘制**：
- 如果 JavaScript 或用户交互导致页面内容发生变化，浏览器会根据需要执行布局和绘制的步骤。这个过程可能会多次发生。

8. **渲染完毕**：
- 一旦浏览器完成所有的布局和绘制，页面就会呈现给用户，用户可以看到并与页面进行交互。

这个渲染过程是高度优化的，浏览器会尽力减少布局和绘制的次数，以提供更快的性能。同时，浏览器还可以通过缓存和其他技术来加速页面的加载和渲染。不过，开发人员也可以通过优化 HTML、CSS 和 JavaScript 代码来改善页面的加载速度和性能。


### GET和POST的区别
**作用**
GET: 用于获取资源。
POST: 用于提交资源。
**数据发送方式**
GET: 通过URL将数据传输到服务器。
POST: 通过HTTP协议body将数据传输到服务器。
**数据发送大小**
GET: 受限于浏览器和服务器的限制，通常最多为2048个字符。
POST: 通常没有大小限制。但是，很多服务器会对提交数据的大小设置一个上限。
**数据发送格式**
GET: 只能发送ASCII字符。
POST: 没有编码限制，可以传输二进制数据。
**处理速度**
GET: 数据通过URL传输，处理速度更快。
POST: 数据通过消息主体传输，处理速度略慢。
**数据缓存**
GET: 可以被缓存，结果可被缓存。
POST: 不能被缓存。
**安全性**
GET: 数据以明文形式出现在URL中，并且被浏览器保存在历史记录中。跨站点脚本利用（XSS）容易利用这种意味着敏感数据不应使用GET传输。
POST: 与GET相比，POST提供更好的安全性，因为数据不可见在URL中，且由于该方法请求的数据存储在HTTP协议的内部，所以不容易被网络上的其他用户获取。

### post为什么会发两次请求?
> 浏览器会执行跨域请求，其中POST请求常常会伴随着两次发送：一次OPTIONS请求（CORS预检）和一次实际的POST请求。
POST请求发送两次的现象是因为浏览器在执行跨域的POST请求时，为了确保安全性，会发送一个OPTIONS请求进行CORS预检。服务器的CORS配置决定了是否允许实际的POST请求。理解CORS预检的过程，能够帮助更好地处理跨域请求问题，确保Web应用的安全性和稳定性。


### Accept和Content-Type

Accept请求头用来告知客户端可以处理的内容类型，这种内容类型用MIME类型来表示。 服务器使用 Content-Type 应答头通知客户端它的选择。

```text
Accept: text/html
Accept: image/*
Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8
```

1.Accept属于请求头， Content-Type属于实体头。
Http报头分为通用报头，请求报头，响应报头和实体报头。
请求方的http报头结构：通用报头|请求报头|实体报头
响应方的http报头结构：通用报头|响应报头|实体报头

2.Accept代表发送端（客户端）希望接受的数据类型。
比如：Accept：text/xml;
代表客户端希望接受的数据类型是xml类型

Content-Type代表发送端（客户端|服务器）发送的实体数据的数据类型。
比如：Content-Type：text/html;
代表发送端发送的数据格式是html。

二者合起来，
Accept:text/xml；
Content-Type:text/html
即代表希望接受的数据类型是xml格式，本次请求发送的数据的数据格式是html。


### post常用的数据格式,form-data和json的区别
- application/json: json格式文本
- application/x-www-form-urlencoded: 形如query参数(name=tom&age=12)的文本
- multipart/form-data: 文件上传 这种格式主要用于文件上传，但也可以包含其他表单数据。当使用 `FormData` 时，Axios 会自动设置正确的 `Content-Type` 头，所以你可以省略手动设置 header。

```js
//application/x-www-form-urlencoded

this.$post(url, data, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [(data) => {
    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }]
});

//使用qs库来更简单的处理
import qs from 'qs';

this.$post(url, qs.stringify(data), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});


// multipart/form-data
let formData = new FormData();
// 添加文件
formData.append('file', fileObject);
// 添加其他数据
formData.append('name', 'value');

this.$post(url, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

```

### 状态码
| 状态码 | 类别                             | 描述                   |
| ------ | -------------------------------- | ---------------------- |
| 1xx    | Informational（信息状态码）      | 接受请求正在处理       |
| 2xx    | Success（成功状态码）            | 请求正常处理完毕       |
| 3xx    | Redirection（重定向状态码）      | 需要附加操作已完成请求 |
| 4xx    | Client Error（客户端错误状态码） | 服务器无法处理请求     |
| 5xx    | Server Error（服务器错误状态码） | 服务器处理请求出错     |


### Http与Https的区别
* url
* 端口
* 安全性/加密
* 证书: HTTP无需证书，而HTTPS 需要CA机构wosign的颁发的SSL证书


### 什么是Http协议无状态协议?怎么解决Http协议无状态协议?

无状态协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息也就是说，当客户端一次HTTP请求完成以后，客户端再发送一次HTTP请求，HTTP并不知道当前客户端是一个”老用户“。

可以使用Cookie来解决无状态的问题，Cookie就相当于一个通行证，第一次访问的时候给客户端发送一个Cookie，
当客户端再次来的时候，拿着Cookie(通行证)，那么服务器就知道这个是”老用户“。

### HTTP连接优化
>https://github.com/Easay/issuesSets/issues/67

### http状态码
HTTP状态码是服务器对客户端请求的响应代码。以下是一些常见的HTTP状态码及其含义：

1. 1xx (信息性状态码)：
    - 100 Continue: 请求已接收，继续处理
2. 2xx (成功状态码)：
    - 200 OK: 请求成功
    - 201 Created: 已创建新资源
    - 204 No Content: 请求成功，但无返回内容
3. 3xx (重定向状态码)：
    - 301 Moved Permanently: 资源已永久移动到新位置
    - 302 Found: 临时重定向
    - 304 Not Modified: 资源未修改，可使用缓存
4. 4xx (客户端错误状态码)：
    - 400 Bad Request: 请求无效或不能被服务器理解
    - 401 Unauthorized: 未授权，需要身份验证
    - 403 Forbidden: 服务器拒绝请求
    - 404 Not Found: 请求的资源不存在
    - 405 Method Not Allowed: 不允许使用该HTTP方法
    - 429 Too Many Requests: 客户端在给定的时间内发送了太多请求
5. 5xx (服务器错误状态码)：
    - 500 Internal Server Error: 服务器遇到意外情况
    - 502 Bad Gateway: 作为网关或代理的服务器从上游服务器收到无效响应
    - 503 Service Unavailable: 服务器暂时无法处理请求
    - 504 Gateway Timeout: 网关或代理服务器未及时从上游服务器收到响应

### 强缓存和协商缓存

#### 强缓存 (Strong Cache)

强缓存允许浏览器直接从本地缓存中读取资源,无需向服务器发送请求。

##### 实现方式:
1. Expires (HTTP/1.0)
    - 设置资源的过期时间
    - 示例: `Expires: Wed, 21 Oct 2025 07:28:00 GMT`
2. Cache-Control (HTTP/1.1)
    - 更灵活的缓存控制
    - 示例: `Cache-Control: max-age=31536000`
##### 特点:

- 如果命中缓存,浏览器直接使用缓存数据,不与服务器交互
- 响应速度最快
- 节省带宽
- 减轻服务器负载
#### 协商缓存 (Negotiation Cache)
协商缓存需要向服务器发送请求,由服务器判断资源是否有更新。如果资源未更新,返回304状态码,浏览器继续使用本地缓存。

##### 实现方式:

1. Last-Modified / If-Modified-Since
    - 基于资源的最后修改时间
    - 示例:
```bash
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT 
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
```
2. ETag / If-None-Match
    - 基于资源的唯一标识符
    - 示例:

```js
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4" 
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```
##### 特点:

- 每次请求都会与服务器交互
- 可以及时更新缓存
- 如果资源未更新,仅返回304状态码,节省带宽

#### 对比

|特性|强缓存|协商缓存|
|---|---|---|
|是否与服务器交互|否|是|
|响应速度|最快|较快|
|内容更新|不及时|及时|
|服务器负载|最低|较低|

#### 缓存流程

1. 浏览器首先检查强缓存
2. 如果强缓存命中,直接使用缓存数据
3. 如果强缓存未命中,发送请求到服务器,检查协商缓存
4. 如果协商缓存命中,服务器返回304,浏览器使用本地缓存
5. 如果协商缓存未命中,服务器返回新的资源

#### 应用场景

- 强缓存: 适用于长期不变的静态资源(如第三方库、logo等)
- 协商缓存: 适用于经常变动的资源(如HTML页面、API数据等)



### Ajax
#### 概述
Ajax是一种用于创建异步Web应用的技术，它可以在不刷新整个网页的情况下，与服务器交换数据并更新部分网页内容，从而提高用户体验和性能。

Ajax的核心是XMLHttpRequest对象，它可以使用JavaScript向服务器发送请求，并接收服务器的响应。响应的数据格式可以是XML、JSON、文本或其他类型。然后，JavaScript可以使用DOM操作来修改网页内容




#### 使用Ajax的优缺点分别是什么
>https://www.frontendinterviewhandbook.com/javascript-questions#what-are-the-advantages-and-disadvantages-of-using-ajax

**优点**
- 交互性更好。来自服务器的新内容可以动态更改，无需重新加载整个页面。
- 减少与服务器的连接，因为脚本和样式只需要被请求一次。
- 状态可以维护在一个页面上。JavaScript 变量和 DOM 状态将得到保持，因为主容器页面未被重新加载。
- 基本上包括大部分 SPA 的优点。

**缺点**
- 动态网页很难收藏
	- URL可能不会随内容变化而更新导致收藏无法访问
	- 动态网页可能依赖临时会话信息/身份验证,收藏无法访问/显示错误
- 如果 JavaScript 已在浏览器中被禁用，则不起作用。
- 有些网络爬虫不执行JavaScript，也不会看到 JavaScript 加载的内容。
- 基本上包括大部分SPA的缺点


#### Ajax和Fetch区别
* 语言支持:ajax 是 XMLHttpRequest 的简写,依赖 XMLHttpRequest 对象,支持 IE5+。fetch 是 Fetch API 的一部分,使用 Promise,支持 IE10+。
* 接口:ajax 使用 XMLHttpRequest 对象,接口相对底层。fetch 使用 Fetch API,接口更简单。例如:
```js
// ajax
const xhr = new XMLHttpRequest()
xhr.open('GET', '/user/12345')
xhr.send()

// fetch
fetch('/user/12345')
```
* 响应格式:ajax 默认返回 XML 响应,需要手动解析。fetch 默认返回 JSON,可以直接使用 .json() 方法解析。
* 错误处理:ajax 使用 onerror 事件捕捉错误。fetch 使用 Promise 的 catch 方法捕捉错误。
* 超时处理:ajax 可以使用 timeout 属性设置超时时间。fetch 使用 Promise 的 catch 可以设置超时。
* 取消请求:ajax 可以使用 abort() 方法取消请求。fetch 的 Promise 对象没有 abort 方法,需要使用 cancelable Promise 实现取消。

```js
//超时
// ajax
const xhr = new XMLHttpRequest()
xhr.timeout = 1000 // 1秒超时
xhr.open('GET', '/user/12345')
xhr.ontimeout = () => {
  console.log('超时!')
}
xhr.send()

// fetch
fetch('/user/12345', {
  timeout: 1000 
})
.catch(err => {
  if (err.message === 'Timeout') {
    console.log('超时!')
  }
})


//取消
const xhr = new XMLHttpRequest()
xhr.open('GET', '/user/12345')
xhr.send()
xhr.abort() // 取消请求

// fetch
const controller = new AbortController()
fetch('/user/12345', { signal: controller.signal })
.then() // ...
controller.abort() // 取消fetch请求
```



#### 封装一个简易的ajax异步请求函数

##### 简洁版(必须)

```js
/* 
xhr + promise 封装一个异步ajax请求的通用函数  简洁版
*/
function ajax(url) {
  return new Promise((resolve, reject) => {
    // 创建一个XHR对象
    const xhr = new XMLHttpRequest()
    // 初始化一个异步请求(还没发请求)func
    xhr.open('GET', url, true)
    xhr.onreadystatechange = function () {
      // 如果状态值不为4, 直接结束(请求还没有结束)
      if (xhr.readyState !== 4) {
        return
      }
      // 如果响应码在200~~299之间, 说明请求都是成功的
      if (xhr.status>=200 && xhr.status<300) {
        // 指定promise成功及结果值
        resolve(JSON.parse(xhr.responseText))
      } else { // 请求失败了
        // 指定promise失败及结果值
        reject(new Error('request error staus '+ request.status))
      }
    }
    xhr.send(null)
  })
}
```

##### 加强版(可选)

```js
/* 
xhr + promise 封装一个异步ajax请求的通用函数  加强版
  返回值: promise
  参数为配置对象
    url: 请求地址
    params: 包含所有query请求参数的对象
    data: 包含所有请求体参数数据的对象
    method: 为请求方式
*/
function axios({url, params={}, data={}, method='GET'}) {
  // 返回一个promise对象
  return new Promise((resolve, reject) => {
    // 创建一个XHR对象
    const request = new XMLHttpRequest()
    
    // 根据params拼接query参数
    let queryStr = Object.keys(params).reduce((pre, key) => {
      pre += `&${key}=${params[key]}`
      return pre
    }, '')
    if (queryStr.length>0) {
      queryStr = queryStr.substring(1)
      url += '?' + queryStr
    }
    // 请求方式转换为大写
    method = method.toUpperCase()
    
    // 初始化一个异步请求(还没发请求)
    request.open(method, url, true)
    // 绑定请求状态改变的监听
    request.onreadystatechange = function () {
      // 如果状态值不为4, 直接结束(请求还没有结束)
      if (request.readyState !== 4) {
        return
      }
      // 如果响应码在200~~299之间, 说明请求都是成功的
      if (request.status>=200 && request.status<300) {
        // 准备响应数据对象
        const responseData = {
          data: JSON.parse(request.response),
          status: request.status,
          statusText: request.statusText
        }
        // 指定promise成功及结果值
        resolve(responseData)
      } else { // 请求失败了
        // 指定promise失败及结果值
        const error = new Error('request error staus '+ request.status)
        reject(error)
      }
    }

    // 如果是post/put请求
    if (method==='POST' || method==='PUT' || method==='DELETE') {
      // 设置请求头: 使请求体参数以json形式传递
      request.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
      // 包含所有请求参数的对象转换为json格式
      const dataJson = JSON.stringify(data)
      // 发送请求, 指定请求体数据
      request.send(dataJson)
    } else {// GET请求
      // 发送请求
      request.send(null)
    }
  })
}
```



### 跨域
#### 概述
跨域是指一个域下的文档或脚本试图去请求另一个域下的资源，这种资源一般是由浏览器的同源策略所禁止访问的。
跨域问题的出现是因为浏览器和服务器之间需要进行数据交互，而有些数据又不希望被其他来源的网站访问，所以需要有一种机制来限制或允许跨域请求。

#### 同源策略
同源策略是浏览器为了保护用户隐私和安全而实施的一种安全机制，它要求两个 URL 的协议、域名和端口都相同，才能认为是同源，否则就是跨域。

#### 跨域解决方法
[[Browser#跨域10种解决方案]]



## 浏览器和网络

### reflow repaint

#### Reflow

当涉及到DOM节点的布局属性发生变化时，就会重新计算该属性，浏览器会重新描绘相应的元素，此过程叫Reflow（回流或重排）。

#### Repaint

当影响DOM元素可见性的属性发生变化 (如 color) 时, 浏览器会重新描绘相应的元素, 此过程称为Repaint（重绘）。因此重排必然会引起重绘。

#### 引起Repaint和Reflow的一些操作

![[六 性能优化#1.触发布局与重绘的操作有哪些?]]




#### Repaint和Reflow是不可避免的，只能说对性能的影响减到最小，给出下面几条建议：

- 避免逐条更改样式。建议集中修改样式，例如操作className。
- 避免频繁操作DOM。创建一个documentFragment或div，在它上面应用所有DOM操作，最后添加到文档里。设置display:none的元素上操作，最后显示出来。
- 避免频繁读取元素几何属性（例如scrollTop）。绝对定位具有复杂动画的元素。
- 绝对定位使它脱离文档流，避免引起父元素及后续元素大量的回流




## git操作

- git config --global credential.helper store (记住用户和密码)

- 分支操作
  ​	拉取远程新分支到本地
  ​	git pull (如果分支是在clone后创建的才需要执行)
  ​	git checkout -b dev origin/dev

- 版本注释一般规范
  feature 特性：新增功能
  docs 文档：新增文档
  fix 修复 Bug
- xiongjian分支到本地仓库xiongjian分支上
  git fetch origin xiongjian:xiongjian 拉取远程仓库

```bash
git checkout -b branchName

git add .

git commit -m 'xxx'

git checkout master

git merget branchName

git pull

git push
```






