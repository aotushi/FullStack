
# 性能优化资源
* https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzkxNTIwMzU5OQ==&action=getalbum&album_id=1783331624198144008&scene=173&from_msgid=2247493765&from_itemidx=1&count=3&nolastread=1#wechat_redirect

* [barretlee/performance-column: 🚅 性能专栏](https://github.com/barretlee/performance-column)
* [聊一聊前端性能优化 - 掘金 (juejin.cn)](https://juejin.cn/post/6911472693405548557)
* [🔥 2022 前端性能优化最佳实践 - SegmentFault 思否](https://segmentfault.com/a/1190000041753539)
* [前端性能优化 24 条建议(2020) - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/121056616?utm_source=com.microsoft.todos&utm_medium=social&utm_oi=41541510889472)

待办
- [ ] https://github.com/thedaviddias/Front-End-Performance-Checklist
# 性能优化(雅虎军规)


## 背景

>性能优化的目的，就是为了提供给用户更好的体验，这些体验包含这几个方面：**展示更快**、**交互响应快**、**页面无卡顿情况**。
 更详细的说，就是指，在用户输入url到站点完整把整个页面展示出来的过程中，通过各种优化策略和方法，让页面加载更快；在用户使用过程中，让用户的操作响应更及时，有更好的用户体验。





## 雅虎军规图
![](https://image-static.segmentfault.com/984/490/984490192-6265650bc7d5b)



#### cookie
* 减少cookie大小
* 静态资源不需要cookie，可以采用其他的域名，不会主动带上cookie

#### content
* 减少http请求
* 减少NDS查询
* 避免重定向
* 缓存ajax请求
* 延迟加载
* 预加载
* 减少DOM节点数量
* 尽量减少iframe使用
* 避免404
* 划分内容到不同的域名


#### images
* 优化图片
* 使用css sprite优化
* 不要在HTML中缩放图片
* 使用Favicon.icon尽可能小且可缓存

#### css
* 把样式写在`<head>`中
* 不要使用css表达式
* 使用link代替`@import`
* 避免使用Filters

#### javascript
* JS放在底部
* 把JS和css放在外部文件中
* 压缩JS和css
* 移除重复脚本
* 减少dom操作
* 使用高效的事件处理

#### mobile
* 保持单个文件小于25k
* 把打包的内容分为多段文档

#### server
* 使用cdn
* 添加Expires或cache-control缓存头
* 启用Gzip
* 配置Etags
* 尽早输出缓冲?
* ajax使用get请求
* 避免图片src为空



#### 总结

#### 避免过多的回流和重绘
连续触发页面回流操作
```js
//这段代码的实现和示意图感觉不相符
  let cards = document.getElementsByClassName("MuiPaper-rounded");
  const update = (timestamp) => {
    for (let i = 0; i <cards.length; i++) {
      let top = cards[i].offsetTop;
      cards[i].style.width = ((Math.sin(cards[i].offsetTop + timestamp / 100 + 1) * 500) + 'px')
    }
    window.requestAnimationFrame(update)
  }
  update(1000);
```

<iframe src="https://codesandbox.io/embed/bom-requestanimationframe-wtc5bn?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="bom-requestAnimationFrame"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>





# 性能优化指标


#### 监听窗口激活状态

```js
//窗口激活状态监听
let vEvent = 'visibilitychange';
if (document.webkitHidden != undefined) {
    vEvent = 'webkitvisibilitychange';
}

function visibilityChanged() {
    if (document.hidden || document.webkitHidden) {
        document.title = '客官，别走啊~'
        console.log("Web page is hidden.")
    } else {
        document.title = '客官，你又回来了呢~'
        console.log("Web page is visible.")
    }
}

document.addEventListener(vEvent, visibilityChanged, false);
```


#### 观察长任务(performance中的Task)
```js
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log(entry)
    }
})

observer.observe({entryTypes: ['longtask']})
```


#### 监听网络变化
网络变化时给用户反馈网络问题，有时候看直播的时候自己的网络卡顿，直播平台也会提醒你或者自动给你切换清晰度
```js
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
var type = connection.effectiveType;

function updateConnectionStatus() {
  console.log("Connection type changed from " + type + " to " + connection.effectiveType);
  type = connection.effectiveType;
}

connection.addEventListener('change', updateConnectionStatus);
```


#### 计算DOMContentLoaded时间

```js
window.addEventListener('DOMContentLoaded', (event) => {
    let timing = performance.getEntriesByType('navigation')[0];
    console.log(timing.domInteractive);
    console.log(timing.fetchStart);
    let diff = timing.domInteractive - timing.fetchStart;
    console.log("TTI: " + diff);
})
```

#### 更多计算规则
```md
DNS 解析耗时: domainLookupEnd - domainLookupStart
TCP 连接耗时: connectEnd - connectStart
SSL 安全连接耗时: connectEnd - secureConnectionStart
网络请求耗时 (TTFB): responseStart - requestStart
数据传输耗时: responseEnd - responseStart
DOM 解析耗时: domInteractive - responseEnd
资源加载耗时: loadEventStart - domContentLoadedEventEnd
First Byte时间: responseStart - domainLookupStart
白屏时间: responseEnd - fetchStart
首次可交互时间: domInteractive - fetchStart
DOM Ready 时间: domContentLoadEventEnd - fetchStart
页面完全加载时间: loadEventStart - fetchStart
http 头部大小： transferSize - encodedBodySize
重定向次数：performance.navigation.redirectCount
重定向耗时: redirectEnd - redirectStart
```



### Network

Chrome浏览器控制台中Network选项下,可以看到资源加载详情，初步评估影响`页面性能`的因素。
鼠标右键可以自定义选项卡，页面底部是当前加载资源的一个概览。`DOMContentLoaded` DOM渲染完成的时间，`Load`：当前页面所有资源加载完成的时间
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62898f76c242450eb318b1816428ff65~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

使用**ctrl+shift+P**来调出控制台扩展工具,添加规则


#### **瀑布流waterfall**
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1613fbeaffb64587a36613271ecfcade~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

-   `Queueing` 浏览器将资源放入队列时间
-   `Stalled` 因放入队列时间而发生的停滞时间
-   `DNS Lookup` DNS解析时间
-   `Initial connection` 建立HTTP连接的时间
-   `SSL` 浏览器与服务器建立安全性连接的时间
-   `TTFB` 等待服务端返回数据的时间
-   `Content Download` 浏览器下载资源的时间


### Lighthouse
-   `First Contentful Paint` 首屏渲染时间，1s以内绿色
-   `Speed Index` 速度指数，4s以内绿色
-   `Time to Interactive` 到页面可交换的时间

根据chrome的一些策略自动对网站做一个质量评估，并且会给出一些优化的建议。



### Performance
对网站最专业的分析~后面会多次讲到



### webPageTest
可以模拟不同场景下访问的情况，比如模拟不同浏览器、不同国家等等，在线测试地址：[webPageTest](https://link.juejin.cn/?target=https%3A%2F%2Fwww.webpagetest.org%2F "https://www.webpagetest.org/")

下面是两张示意图:
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1da6a84b5944311a4f8c6f78b2f5fa1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2fd7f9c05be47bb80ad67064fc72917~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)



### 资源打包分析

#### webpack-bundle-analyzer


### 开启sourcemap
`bpack.config.js`

```java
module.exports = {
    mode: 'production',
    devtool: 'hidden-source-map',
}
复制代码
```

`package.json`

```json
"analyze": "source-map-explorer 'build/*.js'",
复制代码
```

`npm run analyze`

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2057c48588f942579c235925d943c162~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)




# 优化-页面渲染

## http
### 减少http请求
一个完整的 HTTP 请求需要经历 DNS 查找，TCP 握手，浏览器发出 HTTP 请求，服务器接收请求，服务器处理请求并发回响应，浏览器接收响应等过程。
接下来看一个具体的例子帮助理解 HTTP ：
![](https://pic4.zhimg.com/80/v2-ff4da0780527ab348f5594c04da5d667_1440w.webp)


名词解释：
-   Queueing: 在请求队列中的时间。
-   Stalled: 从TCP 连接建立完成，到真正可以传输数据之间的时间差，此时间包括代理协商时间。
-   Proxy negotiation: 与代理服务器连接进行协商所花费的时间。
-   DNS Lookup: 执行DNS查找所花费的时间，页面上的每个不同的域都需要进行DNS查找。
-   Initial Connection / Connecting: 建立连接所花费的时间，包括TCP握手/重试和协商SSL。
-   SSL: 完成SSL握手所花费的时间。
-   Request sent: 发出网络请求所花费的时间，通常为一毫秒的时间。
-   Waiting(TFFB): TFFB 是发出页面请求到接收到应答数据第一个字节的时间。
-   Content Download: 接收响应数据所花费的时间。

从这个例子可以看出，真正下载数据的时间占比为 `13.05 / 204.16 = 6.39%`，文件越小，这个比例越小，文件越大，比例就越高。这就是为什么要建议将多个小文件合并为一个大文件，从而减少 HTTP 请求次数的原因。

### 使用http2
HTTP2 相比 HTTP1.1 有如下几个优点：

**解析速度快**
服务器解析 HTTP1.1 的请求时，必须不断地读入字节，直到遇到分隔符 CRLF 为止。而解析 HTTP2 的请求就不用这么麻烦，因为 HTTP2 是基于帧的协议，每个帧都有表示帧长度的字段。

**多路复用**
HTTP1.1 如果要同时发起多个请求，就得建立多个 TCP 连接，因为一个 TCP 连接同时只能处理一个 HTTP1.1 的请求。
在 HTTP2 上，多个请求可以共用一个 TCP 连接，这称为多路复用。同一个请求和响应用一个流来表示，并有唯一的流 ID 来标识。 多个请求和响应在 TCP 连接中可以乱序发送，到达目的地后再通过流 ID 重新组建。

**首部压缩**
HTTP2 提供了首部压缩功能。

**优先级**

HTTP2 可以对比较紧急的请求设置一个较高的优先级，服务器在收到这样的请求后，可以优先处理。

**流量控制**

由于一个 TCP 连接流量带宽（根据客户端到服务器的网络带宽而定）是固定的，当有多个请求并发时，一个请求占的流量多，另一个请求占的流量就会少。流量控制可以对不同的流的流量进行精确控制。

**服务器推送**

HTTP2 新增的一个强大的新功能，就是服务器可以对一个客户端请求发送多个响应。换句话说，除了对最初请求的响应外，服务器还可以额外向客户端推送资源，而无需客户端明确地请求。

例如当浏览器请求一个网站时，除了返回 HTML 页面外，服务器还可以根据 HTML 页面中的资源的 URL，来提前推送资源。





## JS中的性能优化
#### 1.不要覆盖原生方法
> 无论你的 JavaScript 代码如何优化，都比不上原生方法。因为原生方法是用低级语言写的（C/C++），并且被编译成机器码，成为浏览器的一部分。当原生方法可用时，尽量使用它们，特别是数学运算和 DOM 操作。

#### 2.使用事件委托(简化DOM操作)


#### 3.JS动画
> 尽量避免添加大量的JS动画，CSS3动画和 Canvas 动画都比 JS 动画性能好。  
使用`requestAnimationFrame`来代替`setTimeout`和`setInterval`，因为`requestAnimationFrame`可以在正确的时间进行渲染，`setTimeout` 和`setInterval`无法保证渲染时机。不要在定时器里面绑定事件。


#### 4.防抖和节流
```js
// 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。
function debounce(func, delay) {
    let time = null;
    return function (...args) {
        const context = this;
        if (time) {
            clearTimeout(time);
        }
        time = setTimeout(() => {
            func.call(context, ...args);
        }, delay);
    };
}
```

```js
// 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。
function throttle(func, delay) {
    let prevTime = Date.now();
    return function (...args) {
        const context = this;
        let curTime = Date.now();
        if (curTime - prevTime > delay) {
            prevTime = curTime;
            func.call(context, ...args);
        }
    };
}
```


#### 注意程序的局部性
一个编写良好的计算机程序常常具有良好的局部性，它们倾向于引用最近引用过的数据项附近的数据项，或者最近引用过的数据项本身，这种倾向性，被称为局部性原理。有良好局部性的程序比局部性差的程序运行得更快。




## 页面其它优化()

### 避免CSS及JS阻塞

#### CSS阻塞
我们提到 DOM 和 CSSOM 合力才能构建渲染树。这一点会给性能造成严重影响：默认情况下，CSS 是阻塞的资源。浏览器在构建 CSSOM 的过程中，不会渲染任何已处理的内容，即便 DOM 已经解析完毕了。

只有当我们开始解析 HTML 后、解析到 link 标签或者 style 标签时，CSS 才登场，CSSOM 的构建才开始。 很多时候，DOM 不得不等待 CSSOM。因此我们可以这样总结：

CSS 是阻塞渲染的资源。需要将它尽早、尽快地下载到客户端，以便缩短首次渲染的时间。**尽早（将 CSS 放在 head 标签里）和尽快（启用 CDN 实现静态资源加载速度的优化）**


#### JS阻塞
**JS 的作用在于修改**，它帮助我们修改网页的方方面面：内容、样式以及它如何响应用户交互。这“方方面面”的修改，本质上都是对 DOM 和 CSSDOM 进行修改。因此 JS 的执行会阻止 CSSOM，在我们不作显式声明的情况下，它也会阻塞 DOM。
**JS 引擎是独立于渲染引擎存在的**。我们的 JS 代码在文档的何处插入，就在何处执行。当 HTML 解析器遇到一个 script 标签时，它会暂停渲染过程，将控制权交给 JS 引擎。JS 引擎对内联的 JS 代码会直接执行，对外部 JS 文件还要先获取到脚本、再进行执行。等 JS 引擎运行完毕，浏览器又会把控制权还给渲染引擎，继续 CSSOM 和 DOM 的构建。 因此与其说是 JS 把 CSS 和 HTML 阻塞了，不如说是 JS 引擎抢走了渲染引擎的控制权。

实际使用,需遵循的原则:
* 将 CSS 放在文件头部，JavaScript 文件放在底部
- JS 应尽量少影响 DOM 的构建
- 改变JS阻塞方式
	- defer(并行下载,在DOM渲染完成后再执行)
	- async(并行下载,下载完成后立即执行,阻塞dom渲染)


### 降低CSS选择器复杂性
浏览器读取选择器，遵循的原则是从选择器的右边到左边读取。看个示例：
```css
#block .text p {
    color: red;
}
```
1.  查找所有 P 元素。
2.  查找结果 1 中的元素是否有类名为 text 的父元素
3.  查找结果 2 中的元素是否有 id 为 block 的父元素

CSS 选择器优先级
内联 > ID选择器 > 类选择器 > 标签选择器

根据以上两个信息可以得出结论：

1.  减少嵌套。后代选择器的开销是最高的，因此我们应该尽量将选择器的深度降到最低（最高不要超过三层），尽可能使用类来关联每一个标签元素
2.  关注可以通过继承实现的属性，避免重复匹配重复定义
3.  尽量使用高优先级的选择器，例如 ID 和类选择器。
4.  避免使用通配符，只对需要用到的元素进行选择

### 使用字体图标 iconfont 代替图片图标
字体图标就是将图标制作成一个字体，使用时就跟字体一样，可以设置属性，例如 font-size、color 等等，非常方便。并且字体图标是矢量图，不会失真。还有一个优点是生成的文件特别小。

### 压缩字体文件
使用 [fontmin-webpack](https://github.com/patrickhulce/fontmin-webpack) 插件对字体文件进行压缩



### 减少重流重绘

#### 如何解决?
**CSS**
-   避免使用table布局。
-   尽可能在DOM树的最末端改变class。
-   避免设置多层内联样式。
-   将动画效果应用到position属性为absolute或fixed的元素上。
-   避免使用CSS表达式（例如：calc()）。

**JavaScript**
-   避免频繁操作样式，最好一次性重写style属性，或者将样式列表定义为class并一次性更改class属性。
-   避免频繁操作DOM，创建一个documentFragment，在它上面应用所有DOM操作，最后再把它添加到文档中。
-   也可以先为元素设置display: none，操作结束后再把它显示出来。因为在display属性为none的元素上进行的DOM操作不会引发回流和重绘。
-   避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
-   对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流



#### 1.骨架屏
用css提前占好位置，当资源加载完成即可填充，减少页面的回流与重绘，同时还能给用户最直接的反馈。 图中使用插件：[react-placeholder](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbuildo%2Freact-placeholder "https://github.com/buildo/react-placeholder")
关于实现骨架屏还有很多种方案，用`Puppeteer`服务端渲染的挺多的

使用css伪类：[只要css就能实现的骨架屏方案](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000020437426 "https://segmentfault.com/a/1190000020437426")


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3666ae07b9eb4d839f7a893b89d83f47~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)




#### 窗口化

原理：只加载当前窗口能显示的DOM元素，当视图变化时，删除隐藏的，添加要显示的DOM就可以保证页面上存在的dom元素数量永远不多，页面就不会卡顿

图中使用的插件：[react-window](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbvaughn%2Freact-window "https://github.com/bvaughn/react-window")
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a459cc811844b7793aff6c9878d19ad~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

安装：`npm i react-window`

引入：`import { FixedSizeList as List } from 'react-window';`

使用：
```js
const Row = ({ index, style }) => (
  <div style={style}>Row {index}</div>
);
 
const Example = () => (
  <List
    height={150}
    itemCount={1000}
    itemSize={35}
    width={300}
  >
    {Row}
  </List>
);
```


### 缓存
为了避免用户每次访问网站都得请求文件，我们可以通过添加 Expires 或 max-age 来控制这一行为。Expires 设置了一个时间，只要在这个时间之前，浏览器都不会请求文件，而是直接使用缓存。而 max-age 是一个相对时间，建议使用 max-age 代替 Expires 。

不过这样会产生一个问题，当文件更新了怎么办？怎么通知浏览器重新请求文件？

可以通过更新页面中引用的资源链接地址，让浏览器主动放弃缓存，加载新资源。

具体做法是把资源地址 URL 的修改与文件内容关联起来，也就是说，只有文件内容变化，才会导致相应 URL 的变更，从而实现文件级别的精确缓存控制。什么东西与文件内容相关呢？我们会很自然的联想到利用[数据摘要要算法](https://baike.baidu.com/item/%E6%B6%88%E6%81%AF%E6%91%98%E8%A6%81%E7%AE%97%E6%B3%95/3286770?fromtitle=%E6%91%98%E8%A6%81%E7%AE%97%E6%B3%95&fromid=12011257)对文件求摘要信息，摘要信息与文件内容一一对应，就有了一种可以精确到单个文件粒度的缓存控制依据了。





#### 1.http缓存
##### keep-alive

判断是否开启：看`response headers`中有没有`Connection: keep-alive` 。开启以后，看`network`的瀑布流中就没有 `Initial connection`耗时了

nginx设置keep-alive（默认开启）

```ini
# 0 为关闭
#keepalive_timeout 0;
# 65s无连接 关闭
keepalive_timeout 65;
# 连接数，达到100断开
keepalive_requests 100;
复制代码
```

##### Cache-Control / Expires / Max-Age

设置资源是否缓存，以及缓存时间

##### Etag / If-None-Match

资源唯一标识作对比，如果有变化，从服务器拉取资源。如果没变化则取缓存资源，状态码304，也就是协商缓存

##### Last-Modified / If-Modified-Since

通过对比时间的差异来觉得要不要从服务器获取资源

更多HTTP缓存参数可参考：[使用 HTTP 缓存：Etag, Last-Modified 与 Cache-Control](https://link.juejin.cn/?target=https%3A%2F%2Fharttle.land%2F2017%2F04%2F04%2Fusing-http-cache.html "https://harttle.land/2017/04/04/using-http-cache.html")





#### 2.Service worker
借助webpack插件`WorkboxWebpackPlugin`和`ManifestPlugin`,加载serviceWorker.js,通过`serviceWorker.register()`注册

```js
new WorkboxWebpackPlugin.GenerateSW({
    clientsClaim: true,
    exclude: [/\.map$/, /asset-manifest\.json$/],
    importWorkboxFrom: 'cdn',
    navigateFallback: paths.publicUrlOrPath + 'index.html',
    navigateFallbackBlacklist: [
        new RegExp('^/_'),
        new RegExp('/[^/?]+\\.[^/]+$'),
    ],
}),

new ManifestPlugin({
    fileName: 'asset-manifest.json',
    publicPath: paths.publicUrlOrPath,
    generate: (seed, files, entrypoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
        }, seed);
        const entrypointFiles = entrypoints.app.filter(
            fileName => !fileName.endsWith('.map')
        );

        return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
        };
    },
}),
```



#### 浏览器缓存
缓存的意义就在于减少请求，更多地使用本地的资源，给用户更好的体验的同时，也减轻服务器压力。所以，最佳实践，就应该是尽可能命中强缓存，同时，能在更新版本的时候让客户端的缓存失效。
在更新版本之后，如何让用户第一时间使用最新的资源文件呢？机智的前端们想出了一个方法，在更新版本的时候，顺便把静态资源的路径改了，这样，就相当于第一次访问这些资源，就不会存在缓存的问题了
```js
entry:{
    main: path.join(__dirname,'./main.js'),
    vendor: ['react', 'antd']
},
output:{
    path:path.join(__dirname,'./dist'),
    publicPath: '/dist/',
    filname: 'bundle.[chunkhash].js'
}
```

综上所述，我们可以得出一个较为合理的缓存方案：
- HTML：使用协商缓存。
- CSS、JS和图片：使用强缓存，文件命名带上hash值。

#### 文件名哈希 ?
Webpack 给我们提供了三种哈希值计算方式，分别是`hash`、`chunkhash`和`contenthash`。










### 预加载&懒加载

#### preload
就拿demo中的字体举例，正常情况下的加载顺序是这样的：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e3226bc21f14a41ac195618456bdde9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

假如preload
```html
<link rel="preload" href="https://fonts.gstatic.com/s/longcang/v5/LYjAdGP8kkgoTec8zkRgqHAtXN-dRp6ohF_hzzTtOcBgYoCKmPpHHEBiM6LIGv3EnKLjtw.119.woff2" as="font" crossorigin="anonymous"/> 
<link rel="preload" href="https://fonts.gstatic.com/s/longcang/v5/LYjAdGP8kkgoTec8zkRgqHAtXN-dRp6ohF_hzzTtOcBgYoCKmPpHHEBiM6LIGv3EnKLjtw.118.woff2" as="font" crossorigin="anonymous"/> 
<link rel="preload" href="https://fonts.gstatic.com/s/longcang/v5/LYjAdGP8kkgoTec8zkRgqHAtXN-dRp6ohF_hzzTtOcBgYoCKmPpHHEBiM6LIGv3EnKLjtw.116.woff2" as="font" crossorigin="anonymous"/> 
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9790c73b17ef43a9acb1701215aca9d4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)





#### prefetch
场景：首页不需要这样的字体文件，下个页面需要：首页会以最低优先级Lowest来提前加载
```html
<link rel="prefetch" href="https://fonts.gstatic.com/s/longcang/v5/LYjAdGP8kkgoTec8zkRgqHAtXN-dRp6ohF_hzzTtOcBgYoCKmPpHHEBiM6LIGv3EnKLjtw.113.woff2" as="font"/> 
<link rel="prefetch" href="https://fonts.gstatic.com/s/longcang/v5/LYjAdGP8kkgoTec8zkRgqHAtXN-dRp6ohF_hzzTtOcBgYoCKmPpHHEBiM6LIGv3EnKLjtw.118.woff2" as="font"/> 
<link rel="prefetch" href="https://fonts.gstatic.com/s/longcang/v5/LYjAdGP8kkgoTec8zkRgqHAtXN-dRp6ohF_hzzTtOcBgYoCKmPpHHEBiM6LIGv3EnKLjtw.117.woff2" as="font"/> 
```

需要的页面，从`prefetch cache`中取
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04a0fe68e9634c20b963d1d2817126ad~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

webpack也是支持这两个属性的:[webpackPrefetch 和 webpackPreload](https://link.juejin.cn/?target=https%3A%2F%2Fwww.cnblogs.com%2Fskychx%2Fp%2Fwebpack-webpackChunkName-webpackPreload-webpackPreload.html "https://www.cnblogs.com/skychx/p/webpack-webpackChunkName-webpackPreload-webpackPreload.html")


### 懒加载
#### 图片
* 普通图片
* 渐进式图片(类似高斯模糊),需要出稿时指定这种格式
* `响应式图片`
原生模式：`<img src="./img/index.jpg" sizes="100vw" srcset="./img/dog.jpg 800w, ./img/index.jpg 1200w"/>`




#### 路由
通过函数 + import实现

`const Page404 = () => import(/* webpackChunkName: "error" */'@views/errorPage/404');`


### 白屏loading

* 使用`webpack`插件`HtmlWebpackPlugin`将loading资源插入到页面中
* 

### 图片资源的优化
>[🔥 2022 前端性能优化最佳实践 - JavaScript进阶之路 - SegmentFault 思否](https://segmentfault.com/a/1190000041753539)


#### 图片延迟加载
在页面中，先不给图片设置路径，只有当图片出现在浏览器的可视区域时，才去加载真正的图片，这就是延迟加载。
首先可以将图片这样设置，在页面不可见时图片不会加载：

```html
<img data-src="https://avatars0.githubusercontent.com/u/22117876?s=460&u=7bd8f32788df6988833da6bd155c3cfbebc68006&v=4">
```

等页面可见时，使用 JS 加载图片：

```js
const img = document.querySelector('img')
img.src = img.dataset.src
```

这样图片就加载出来了，完整的代码可以看一下参考资料。
参考资料：

-  [web 前端图片懒加载实现原理](https://juejin.im/entry/594a483061ff4b006c12cea1)


#### 响应式图片
响应式图片的优点是浏览器能够根据屏幕大小自动加载合适的图片。

通过 `picture` 实现

```html
<picture>
    <source srcset="banner_w1000.jpg" media="(min-width: 801px)">
    <source srcset="banner_w800.jpg" media="(max-width: 800px)">
    <img src="banner_w800.jpg" alt="">
</picture>
```

通过 `@media` 实现
```css
@media (min-width: 769px) {
    .bg {
        background-image: url(bg1080.jpg);
    }
}
@media (max-width: 768px) {
    .bg {
        background-image: url(bg768.jpg);
    }
}
```



#### 降低图片质量
例如 JPG 格式的图片，100% 的质量和 90% 质量的通常看不出来区别，尤其是用来当背景图的时候。我经常用 PS 切背景图时， 将图片切成 JPG 格式，并且将它压缩到 60% 的质量，基本上看不出来区别。

压缩方法有两种，一是通过在线网站进行压缩，二是通过 webpack 插件 image-webpack-loader。它是基于 [imagemin](https://link.segmentfault.com/?enc=PAoQ%2BkIno1eABSR%2Bi3eflA%3D%3D.7PB%2BfABhYfIPZz805iNFLC73YrooJkNp9aa2idh1joQGH5yBIHzfJcMbYnfpBTfjjxTkQZMeKgY2vrQyQg9W1fLjUTq3CV9K0Xb4jeD%2B9UQ%3D) 这个 Node 库来实现图片压缩的。

使用很简单，我们只要在`file-loader`之后加入 `image-webpack-loader` 即可：
```js
npm i -D image-webpack-loader
```

webpack配置如下:
```bash
// config/webpack.base.js
// ...
module: {
    rules: [
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash].[ext]',
                        outputPath: 'images/'
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        // 压缩 jpeg 的配置
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        // 使用 imagemin**-optipng 压缩 png，enable: false 为关闭
                        optipng: {
                            enabled: false
                        },
                        // 使用 imagemin-pngquant 压缩 png
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        },
                        // 压缩 gif 的配置
                        gifsicle: {
                            interlaced: false
                        },
                        // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                        webp: {
                            quality: 75
                        }
                    }
                }
            ]
        }
    ];
}
```


#### 3.图片懒加载
在页面中，先不给图片设置路径，只有当图片出现在浏览器的可视区域时，才去加载真正的图片，这就是延迟加载。对于图片很多的网站来说，一次性加载全部图片，会对用户体验造成很大的影响，所以需要使用图片延迟加载。


#### 4.使用CSS3代替图片
有很多图片使用 CSS 效果（渐变、阴影等）就能画出来，这种情况选择 CSS3 效果更好。因为代码大小通常是图片大小的几分之一甚至几十分之一。
参考资料：
-   [img图片在webpack中使用](https://juejin.im/post/5cad99b5518825215d37b894)

#### 使用webpack格式图片
> WebP 的优势体现在它具有更优的图像数据压缩算法，能带来更小的图片体积，而且拥有肉眼识别无差异的图像质量；同时具备了无损和有损的压缩模式、Alpha 透明以及动画的特性，在 JPEG 和 PNG 上的转化效果都相当优秀、稳定和统一。

参考资料：
-  [WebP 相对于 PNG、JPG 有什么优势？](https://www.zhihu.com/question/27201061)



## 压缩

### Gzip
开启方式可参考：[nginx开启gzip](https://juejin.cn/post/6844903605187641357 "https://juejin.cn/post/6844903605187641357")

还有一种方式：打包的时候生成gz文件，上传到服务器端，这样就不需要nginx来压缩了，可以降低服务器压力。 可参考：[gzip压缩文件&webPack配置Compression-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000020976930 "https://segmentfault.com/a/1190000020976930")

### 服务端压缩




### JS/CSS/HTML压缩
工程化项目中直接使用对应的插件即可，webpack的主要有下面三个：

-   UglifyJS
-   webpack-parallel-uglify-plugin
-   terser-webpack-plugin 具体优缺点可参考：[webpack常用的三种JS压缩插件](https://link.juejin.cn/?target=https%3A%2F%2Fblog.csdn.net%2Fqq_24147051%2Farticle%2Fdetails%2F103557728 "https://blog.csdn.net/qq_24147051/article/details/103557728")。`压缩原理`简单的讲就是去除一些空格、换行、注释，借助es6模块化的功能，做了一些`tree-shaking`的优化。同时做了一些代码混淆，一方面是为了更小的体积，另一方面也是为了源码的安全性。

css压缩主要是mini-css-extract-plugin，当然前面的js压缩插件也会给你做好css压缩。使用姿势：
```js
npm install --save-dev mini-css-extract-plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
plugins:[
 new MiniCssExtractPlugin({
       filename: "[name].css",
       chunkFilename: "[id].css"
   })
]
```

html压缩可以用`HtmlWebpackPlugin`，单页项目就一个index.html,性能提升微乎其微~


### HTTP2首部压缩
**http2的特点**
-   二进制分帧
-   首部压缩
-   流量控制
-   多路复用
-   请求优先级
-   服务器推送`http2_push: 'xxx.jpg'` 具体升级方式也很简单，修改一下nginx配置，方法请自行`Google`











# 优化-webpack

除了上面提到的几个插件之外,还有以下几种:
### 1.DllPlugin提升构建速度

通过`DllPlugin`插件，将一些比较大的，基本很少升级的包拆分出来，生成`xx.dll.js`文件,通过`manifest.json`引用

`webpack.dll.config.js`
```js
const path = require("path");
const webpack = require("webpack");
module.exports = {
    mode: "production",
    entry: {
        react: ["react", "react-dom"],
    },
    output: {
        filename: "[name].dll.js",
        path: path.resolve(__dirname, "dll"),
        library: "[name]"
    },
    plugins: [
        new webpack.DllPlugin({
            name: "[name]",
            path: path.resolve(__dirname, "dll/[name].manifest.json")
        })
    ]
};
```

`package.json`
```js
"scripts": {
    "dll-build": "NODE_ENV=production webpack --config webpack.dll.config.js",
  },
```

### 2.splitChunks拆包

```js
optimization: {
	splitChunks: {
			cacheGroups: {
					vendor: {
							name: 'vendor',
							test: /[\\/]node_modules[\\/]/,
							minSize: 0,
							minChunks: 1,
							priority: 10,
							chunks: 'initial'
					},
					common: {
							name: 'common',
							test: /[\\/]src[\\/]/,
							chunks: 'all',
							minSize: 0,
							minChunks: 2
					}
			}
	}
},
```


### 减少 ES6 转为 ES5 的冗余代码
>Babel 插件会在将 ES6 代码转换成 ES5 代码时会注入一些辅助函数
为了不让这些辅助函数的代码重复出现，可以在依赖它们时通过 `require('babel-runtime/helpers/createClass')` 的方式导入，这样就能做到只让它们出现一次。`babel-plugin-transform-runtime` 插件就是用来实现这个作用的，将相关辅助函数进行替换成导入语句，从而减小 babel 编译出来的代码的文件大小。

首先，安装 `babel-plugin-transform-runtime` ：
```bash
npm install babel-plugin-transform-runtime —save-dev
```


然后，修改 `.babelrc` 配置文件为：
```js
"plugins": [
    "transform-runtime"
]
```


### 提取公共代码
Webpack 内置了专门用于提取多个Chunk 中的公共部分的插件 CommonsChunkPlugin，我们在项目中 CommonsChunkPlugin 的配置如下：
```js
// 所有在 package.json 里面依赖的包，都会被打包进 vendor.js 这个文件中。
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: function(module, count) {
    return (
      module.resource &&
      /\.js$/.test(module.resource) &&
      module.resource.indexOf(
        path.join(__dirname, '../node_modules')
      ) === 0
    );
  }
}),
// 抽取出代码模块的映射关系
new webpack.optimize.CommonsChunkPlugin({
  name: 'manifest',
  chunks: ['vendor']
})
```


### 模板预编译


### 提取组件的CSS
当使用单文件组件时，组件内的 CSS 会以 style 标签的方式通过 JavaScript 动态注入。这有一些小小的运行时开销，如果你使用服务端渲染，这会导致一段 “无样式内容闪烁 (fouc) ” 。将所有组件的 CSS 提取到同一个文件可以避免这个问题，也会让 CSS 更好地进行压缩和缓存。  
查阅这个构建工具各自的文档来了解更多：

-   [webpack + vue-loader](https://link.segmentfault.com/?enc=E6ETqJMKg%2FQSTpVKl1%2BB%2FA%3D%3D.U%2FgkROAzLHjCJjr1sKNgFq87F5XNJuMFnJ75rynfJ04fz0Ebvr3lOFOnsocltHIV3Qj8pEZTtz8dxF8RGWtcf9hNPiQcDPaU17A6xSIuP653sf9rzLlQ7me%2F%2BSo2V0KnbtLdNlwHZg6VG7rSFKimVw%3D%3D) ( vue-cli 的 webpack 模板已经预先配置好)
-   [Browserify + vueify](https://link.segmentfault.com/?enc=a8FbLJFWK11%2BEgt0lNLOqw%3D%3D.k7kNAi%2FnqSfAIi9wDUgq2rGxfn0RLRFmH%2FEgv03Oi3LCpTE0fZbN2stQt83CcxJY8XKwcYhTZ6tM7QUiUTdMK0R6J%2BE2uG0pJW%2B1P%2FMIC3h6BMr64VUWshmJ4q26o0H2)
-   [Rollup + rollup-plugin-vue](https://link.segmentfault.com/?enc=6uktLru3oS%2BI0DsgGLtqwQ%3D%3D.Lo2OZbicYbRL6MnJlabjlJ39HdAI56NCCk%2Fat7kVhBxV%2FnXKyGNtMRmr%2BKv4EFo4YHMcxv%2B5Uv7i4FTDdKJIJgzT6gWeIZqU4aC4vxIw09K8%2B5DWQD4M%2FbVhs5aQUXC5o3gaRUOzqdnENhNlHO6AB76KhUlbDc4vnBM32KWcBh0%3D)


### 按需加载代码
通过 Vue 写的单页应用时，可能会有很多的路由引入。当打包构建的时候，JS 包会变得非常大，影响加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应的组件，这样就更加高效了。




# 优化-Vue



# 



## 字体优化

原因是引入的字体文件大,但页面上并没有使用太多的相关字体,造成了字体浪费.一个字体文件好几兆.

### 了解各平台下字体情况
[html - 如何优雅的选择字体(font-family) - 前端学习 - SegmentFault 思否](https://segmentfault.com/a/1190000006110417#articleHeader0)

https://www.cnblogs.com/wangmeijian/p/4163936.html

### 字体优化方案
font-spider和fontmin都是一种字体子集化方案
* font-spider
* fontmin
* 转换格式

#### font-spider
只能优化已知的字体文件,如果是在线字体或自托管字体,需要额外的配置.

对脚手架生成的工具无效,因为此工具的使用范围:
```md
字蛛通过分析本地 CSS 与 HTML 文件获取 WebFont 中没有使用的字符，并将这些字符数据从字体中删除以实现压缩，同时生成跨浏览器使用的格式。
```
而脚手架生成的public/index.html中,是通过js动态插入的内容. 所以无法使用

不过可以收集使用的文字,在本地html页面,运行font-spider生成新的文字文件来处理
例如:
>[js vuecli react-app 字体引入加载缓慢 ，font-spider 根据使用字体生成新的字体文件_font-spider react-CSDN博客](https://blog.csdn.net/weixin_44544388/article/details/105507522)




#### fontmin
https://blog.shenzjd.com/pages/493b3e94e222f/#font-spider

两种方案, 一种是使用软件进行转换,另一种使用nodejs调用来转换.都会获得生成的字体文件.


#### 转换格式
根据实例字体文件8m左右, 此网站转换正确,并没有默认进行子集化处理.

![[SourceHanSansCN-Normal.otf]]

推荐网站:
> https://kombu.kanejaku.org/

![[Pasted image 20240502172148.png]]





