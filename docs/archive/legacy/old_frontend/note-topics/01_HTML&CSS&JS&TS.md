# HTML

### 文档声明的作用

* DOCTYPE文档类型声明**告诉浏览器（解析器）应该以什么样（html或xhtml）的文档类型定义****来解析文档**
* 不同的渲染模式会影响浏览器对 CSS 代码甚⾄ JavaScript 脚本的解析。
* 它必须声明在HTML⽂档的第⼀⾏

### 浏览器渲染页面的2种模式

- **CSS1Compat：标准模式（Strick mode）**，默认模式，浏览器使用W3C的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面。
- **BackCompat：怪异模式(混杂模式)(Quick mode)**，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后兼容的方式显示。





### 文档声明（Doctype）和`<!Doctype html>`有何作用? 严格模式与混杂模式如何区分？它们有何意义?

#### 文档声明的作用

文档声明是为了告诉浏览器，当前`HTML`文档使用什么版本的`HTML`来写的，这样浏览器才能按照声明的版本来正确的解析。

**<!Doctype html>的作用：**`<!doctype html>` 的作用就是让浏览器进入标准模式，使用最新的 `HTML5` 标准来解析渲染页面；如果不写，浏览器就会进入混杂模式，我们需要避免此类情况发生。

**严格模式与混杂模式**

- **严格模式**： 又称为标准模式，指浏览器按照`W3C`标准解析代码；
- **混杂模式**： 又称怪异模式、兼容模式，是指浏览器用自己的方式解析代码。混杂模式通常模拟老式浏览器的行为，以防止老站点无法工作；

**严格模式和混杂模式的区别**

- 如果文档包含严格的`DOCTYPE` ，那么它一般以严格模式呈现
- 包含过渡 `DTD` 和 `URI` 的 `DOCTYPE` ，也以严格模式呈现，但有过渡 `DTD` 而没有 `URI` （统一资源标识符，就是声明最后的地址）会导致页面以混杂模式呈现（**有 URI 的过渡 DTD ——严格模式；没有 URI 的过渡 DTD ——混杂模式**）；
- `DOCTYPE` 不存在或形式不正确会导致文档以混杂模式呈现（**DTD不存在或者格式不正确——混杂模式**）；
- `HTML5` 没有 `DTD` ，因此也就没有严格模式与混杂模式的区别，`HTML5` 有相对宽松的 法，实现时，已经尽可能大的实现了向后兼容(**HTML5 没有严格和混杂之分**)。


### 标签语义化

什么是语义化？就是用合理、正确的标签来展示内容，比如h1~h6定义标题。

#### 好处
- 易于用户阅读，样式丢失的时候能让页面呈现清晰的结构。
- 有利于SEO，搜索引擎根据标签来确定上下文和各个关键字的权重。
- 方便其他设备解析，如盲人阅读器根据语义渲染网页
- 有利于开发和维护，语义化更具可读性，代码更好维护，与CSS3关系更和谐。


#### 语义化标签
* 新的语义化元素：article 、footer 、header 、nav 、section,progress,detail&summary
* 新的 API：音频(用于媒介回放的 video 和 audio 元素)、图形（绘图 canvas 元素）



### doctype作用
doctype是文档类型声明，目的是告诉解析器要使用什么样的文档类型定义（DTD）来解析文档。
浏览器本身分为两种模式，<u>一种是标准模式，一种是怪异模式</u>，浏览器通过doctype来区分这两种模式. doctype来声明标准模式，如果不存在就怪异模式，有些样式会和标准模式存在差异.



### 行内元素和块级元素

#### 区别
- 排列方式：
	- 行内元素：在同一行内从左到右排列。
    - 块元素：独占一行，从上到下垂直排列。
- 宽高及内外边距
    - 行内元素：默认宽度为其内容宽度，无法设置 width 和 height;只能设置左右 margin 和 padding，上下无效。
    - 块元素：默认宽度为父容器的 100%，可以设置 width 和 height;可以设置所有方向的 margin 和 padding
- 包含规则：
    - 行内元素：一般只能包含文本或其他行内元素。
    - 块元素：可以包含行内元素和其他块元素。
- 常见元素：
	- 行内元素：如 `<span>、<a>、<strong>、<em>` 等。
	- 块元素：如 `<div>、<p>、<h1>-<h6>、<ul>、<li>` 等。


#### 块级元素
* 每个块级元素都是独自占一行；
* 高度，行高，外边距（margin）以及内边距（padding）都可以控制；
* 元素的宽度如果不设置的话，默认为父元素的宽度（父元素宽度100%；
* 多个块状元素标签写在一起，默认排列方式为从上至下；

```
 <address>  // 定义地址 
 <caption>  // 定义表格标题 
 <dd>      // 定义列表中定义条目 
 <div>     // 定义文档中的分区或节 
 <dl>    // 定义列表 
 <dt>     // 定义列表中的项目 
 <fieldset>  // 定义一个框架集 
 <form>  // 创建 HTML 表单 
 <h1>    // 定义最大的标题
 <h2>    // 定义副标题
 <h3>     // 定义标题
 <h4>     // 定义标题
 <h5>     // 定义标题
 <h6>     // 定义最小的标题
 <hr>     // 创建一条水平线
 <legend>    // 元素为 fieldset 元素定义标题
 <li>     // 标签定义列表项目
 <noframes>    // 为那些不支持框架的浏览器显示文本，于 frameset 元素内部
 <noscript>    // 定义在脚本未被执行时的替代内容
 <ol>     // 定义有序列表
 <ul>    // 定义无序列表
 <p>     // 标签定义段落
 <pre>     // 定义预格式化的文本
 <table>     // 标签定义 HTML 表格
 <tbody>     // 标签表格主体（正文）
 <td>    // 表格中的标准单元格
 <tfoot>     // 定义表格的页脚（脚注或表注）
 <th>    // 定义表头单元格
 <thead>    // 标签定义表格的表头
 <tr>     // 定义表格中的行
```
#### 行内元素
行内元素不可以设置宽（width）和高（height），但可以与其他行内元素位于同一行，行内元素内一般不可以包含块级元素。行内元素的高度一般由元素内部的字体大小决定，宽度由内容的长度控制。
行内元素有以下特点：
* 不会独占一行，相邻的行内元素会排列在同一行里，直到一行排不下才会自动换行，其宽度随元素的内容而变化；
* 高宽无效，对外边距（margin）和内边距（padding）仅设置左右方向有效,上下无效(上下内外边距会在浏览器上展示出来,但是在空间上没有效果.)
* 设置行高有效，等同于给父级元素设置行高；
* 元素的宽度就是它包含的文字或图片的宽度，不可改变；
* 行内元素中不能放块级元素;
```
 <a>     // 标签可定义锚 
 <abbr>     // 表示一个缩写形式 
 <acronym>     // 定义只取首字母缩写 
 <b>     // 字体加粗 
 <bdo>     // 可覆盖默认的文本方向 
 <big>     // 大号字体加粗 
 <br>     // 换行 
 <cite>     // 引用进行定义 
 <code>    // 定义计算机代码文本
 <dfn>     // 定义一个定义项目
 <em>     // 定义为强调的内容
 <i>     // 斜体文本效果
 <kbd>     // 定义键盘文本
 <label>     // 标签为 input 元素定义标注（标记）
 <q>     // 定义短的引用
 <samp>     // 定义样本文本
 <select> // 创建单选或多选菜单
 <small>     // 呈现小号字体效果
 <span>     // 组合文档中的行内元素
 <strong> // 加粗
 <sub>     // 定义下标文本
 <sup>     // 定义上标文本
 <textarea>     // 多行的文本输入控件
 <tt>     // 打字机或者等宽的文本效果
 <var>    // 定义变量
```





#### 来源
> [CSS中 块级元素、行内元素、行内块元素区别](https://juejin.cn/post/6998925491797229599)
> https://developer.mozilla.org/zh-CN/docs/Web/HTML/Inline_elements

#### 行内元素
**是什么**
行内元素不可以设置宽（width）和高（height），但可以与其他行内元素位于同一行，行内元素内一般不可以包含块级元素。行内元素的高度一般由元素内部的字体大小(行高决定)决定，宽度由内容的长度控制。 

**特点**
* 不会独占一行，相邻的行内元素会排列在同一行里，直到一行排不下才会自动换行，其宽度随元素的内容而变化；
* 高/宽无效，对外边距（margin）和内边距（padding）仅设置左右方向有效  上下无效；
* 设置行高有效，等同于给父级元素设置行高；
* 元素的宽度就是它包含的文字或图片的宽度，不可改变；
* 行内元素中不能放块级元素，a链接里面不能再放链接；

**有哪些**
> https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements#list_of_inline_elements

```md
a abbr acronym audio 
b bdi bdo big br button 
canvas cite code 
data datalist del dfn 
em embed
i iframe img input ins 
kbd label 
map mark meter 
noscript 
object output
picture progress
1 
ruby 
s samp script select slotsmall span strong sub sup svg 
template textarea time
u tt 
var video 
wbr
```



#### 块级元素
**是什么**
占据一整行，可自定义宽度/高度等. 可容纳块级元素和行内元素.
**特点**
* 每个块元素独占一行
* 高度，行高，外边距（margin）以及内边距（padding）都可以控制；
* 元素的宽度如果不设置的话，默认为父元素的宽度（父元素宽度100%；
* 多个块状元素标签写在一起，默认排列方式为从上至下
**块元素介绍**
```sh
标题类: h1-h6
结构类: header main article aside footer p div
表格类: table thead tbody tr th td tfoot
列表类: dl dt dd / li ol ul
表单类: form
语义类: adress caption(标题) figure,canvas,video,audio
```

**使用js判断元素是否是块级元素**
>https://segmentfault.com/q/1010000003994838

```js
//chatgpt生成: 1.获取元素的display属性; 2.判断元素tagName

window.getComputedStyle(ele).display === 'block'

document.getElementById('myEle').tagName
```


#### 行内块元素
**是什么**
行内块级元素，它既具有块级元素的特点，也有行内元素的特点，它可以自由设置元素宽度和高度，也可以在一行中放置多个行内块级元素。比如：input、img就是行内块级元素，它可设置高宽以及一行多个

**特点**
* 高度、行高、外边距以及内边距都可以控制；
* 默认宽度就是它本身内容的宽度，不独占一行，但是之间会有空白缝隙，设置它上一级的 font-size 为 0，才会消除间隙；

**元素介绍**
```sh

img
input
button 
select
textarea
```

#### 元素之间的转换
* display：block ，定义元素为块级元素
* display : inline ，定义元素为行内元素
* display：inline-block，定义元素为行内块级元素



### link标签和script标签位置
为什么最好把CSS的`<link>`标签放在`<head></head>`之间？
为什么最好把 JS 的`<script>`标签恰好放在`</body>`之前，有例外情况吗？

把`<link>`放在`<head>`中
将样式表放在文档底部附近，会使许多浏览器（包括 Internet Explorer）不能逐步呈现页面。一些浏览器会阻止渲染，以避免在页面样式发生变化时，重新绘制页面中的元素。这种做法可以防止呈现给用户空白的页面或没有样式的内容。

把`<script>`标签恰好放在`</body>`之前
脚本在下载和执行期间会阻止 HTML 解析。把`<script>`标签放在底部，保证 HTML 首先完成解析，将页面尽早呈现给用户。

例外情况是当你的脚本里包含`document.write()`时。但是现在，`document.write()`不推荐使用。同时，将`<script>`标签放在底部，意味着浏览器不能开始下载脚本，直到整个文档（document）被解析。也许，对此比较好的做法是，`<script>`使用`defer`属性，放在`<head>`中。



### defer 与 async区别

[[HTML#defer,async比较]]

- 加载时机：
    - defer：HTML 解析时并行加载脚本，但要等到 HTML 解析完成后才执行。
    - async：HTML 解析时并行加载脚本，加载完成后立即执行，不等待 HTML 解析完成。
- 执行顺序：
    - defer：按照它们在文档中出现的顺序执行。
    - async：谁先加载完成谁先执行，执行顺序不确定。
- DOM 就绪性：
    - defer：保证在 DOMContentLoaded 事件之前执行，此时 DOM 已经构建完毕。
    - async：可能在 DOM 尚未完全加载时就执行。
- 适用场景：
    - defer：适用于需要按顺序执行、依赖于 DOM 或其他脚本的脚本。
    - async：适用于独立的脚本，如分析统计、广告代码等。


> https://pagespeedchecklist.com/async-and-defer#loading-process
> https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html

async与defer都会异步加载JS而不会阻塞渲染, 但 async 会尽快执行，并且没有特定的顺序，而 defer 则按顺序运行，直到加载过程结束时，就在 DOMContentLoaded 事件之前。

![[image 20241209211321.png]]

**async**
* 以较低权限在后台下载(和defer相同)
* 能中断页面渲染来执行
* 尽快执行且没有特定顺序

**defer**
* 同async第一条
* 不会中断页面渲染来执行
* 在DOMContentLoaded事件执行前按顺序执行


```js
//defer时间线
开始解析 HTML  
↓  
浏览器遇到 <script defer>  
↓  
后台并行下载 JS（不阻塞 HTML 解析）  
↓  
继续解析 HTML  
↓  
DOM Tree 构建完成（HTML 解析完成）  
↓  
开始按顺序执行 defer 脚本  
↓  
defer 脚本全部执行完成  
↓  
触发 DOMContentLoaded  
↓  
图片 / 字体 / iframe 等资源继续加载  
↓  
所有资源加载完成  
↓  
触发 window.onload


//async时间线
开始解析 HTML  
↓  
浏览器遇到 <script async>  
↓  
后台并行下载 JS  
↓  
继续解析 HTML  
↓  
async 脚本下载完成  
↓  
立即暂停 HTML 解析  
↓  
立刻执行 async 脚本  
↓  
执行完成  
↓  
恢复 HTML 解析  
↓  
DOM Tree 构建完成  
↓  
触发 DOMContentLoaded  
↓  
所有资源加载完成  
↓  
触发 window.onload
```




//todo
### img标签中使用srcset属性.
因为需要设计响应式图片。我们可以使用两个新的属性: srcset 和 sizes——来提供更多额外的资源图像和提示，帮助浏览器选择正确的一个资源.
* srcset 提供多图像资源
* sizes  用媒体查询方法来指定图像宽度
浏览器处理过程:
* 查看设备宽度
* 检查 sizes 列表中哪个媒体条件是第一个为真
* 查看给予该媒体查询的槽大小
* 加载 srcset 列表中引用的最接近所选的槽大小的图像


```html
<img 
    src="/static/flamingo-fallback.jpg"
    srcset="
    /static/flamingo4x.png 4x,
    /static/flamingo3x.png 3x,
    /static/flamingo2x.png 2x,
    /static/flamingo1x.png 1x " >


<img 
  src="https://cloud4.gogoing.site/files/2020-08-21/bbc63bf5-6f56-4d0a-a996-72fff804725c.png"
  sizes="(max-width: 376px) 375px, (max-width: 769px) 768px, 1024px"
  srcset="
    https://cloud3.gogoing.site/files/2020-08-21/bbc63bf5-6f56-4d0a-a996-72fff804725c.png 375w,
    https://cloud2.gogoing.site/files/2020-08-21/69d2679d-eefe-434a-8755-7f8b09166bf3.png 768w,
    https://cloud1.gogoing.site/files/2020-08-21/291087d7-beda-402f-9c28-b23e71beb32e.png 1024w"
>

```



### href 与 src 区别
> https://zhuanlan.zhihu.com/p/91960069

| 名称                        | 是什么                 | 用在哪里              | 作用               | 浏览器解析方式                                                              | 其它  |
| ------------------------- | ------------------- | ----------------- | ---------------- | -------------------------------------------------------------------- | --- |
| href(hypertext Reference) | 表示超文本引用,指向网络资源所在位置  | link/a            | 建立当前文档与外部资源之间的关系 | 浏览器通常会并行下载资源，不阻塞 HTML 解析(同时也是为什么建议使用 link 方式加载 CSS，而不是使用 @import 方式) | 0   |
| src(source)               | 表示引用资源,目的是把文件下载到页面上 | img/script/iframe | 将外部资源嵌入当前文档      | 某些标签（如普通 script）会阻塞 HTML 解析                                          | 0   |


### head标签中的内容顺序
>https://twitter.com/Barret_China/status/1684192099024146432

>html 中的 `<head>` 元素通常放了一堆脚本、样式和 `meta` 等内容，你可能从未在意过这些内容的摆放顺序，但是错误的顺序会直接影响网页的加载和渲染效率.
>其本质就是, 让高优先级、影响渲染的资源更早被浏览器发现

建议遵循如下顺序：
1. preconnect
2. script-async
3. css-contains-@ import
4. sync-js
5. sync-css
6. preload
7. script-defer
8. prefetch / prerender
9. seo-relative
有一个工具叫做 capo.js，https://github.com/rviscomi/capo.js，使用它可以快速识别和优化性能问题，同时也提供了一个 Chrome 插件，可以安装试一试：https://chrome.google.com/webstore/detail/capo-get-your-EF%B9%A4%F0%9D%9A%91%F0%9D%9A%8E%F0%9D%9A%8A%F0%9D%9A%8D%EF%B9%A5/ohabpnaccigjhkkebjofhpmebofgpbeb


### meta viewport

#### 是什么
> meta viewport 是一个 HTML 元素，用于控制网页在移动设备上的显示和缩放行为。它通过设置 viewport 元素的属性，告诉浏览器如何调整页面的尺寸和缩放，以适应不同屏幕大小和分辨率的设备。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
```

- name 为 viewport 表示供移动设备使用
- content 定义了 viewport 的属性
    - width 表示显示宽度为设备宽度（兼容苹果）
    - initial-scale 表示设备与视口的缩放比率（兼容IE）


### Data URL概述
#### 是什么
> Data URL（以前称 Data URI）是一种将资源内容直接嵌入 URL 中的方案。

其本质是：
- 不再单独请求资源
- 而是把资源本身直接写进 HTML / CSS / JS 中

常用于：
- 小图片
- SVG
- icon
- 字体
- base64 图片预览
#### 基本格式

```txt
data:[mime-type][;base64],data
```

示例：

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...">
```

结构说明：

```txt
data:
    协议头

image/png
    MIME 类型

;base64
    表示后续数据使用 Base64 编码

iVBOR...
    实际资源内容
```

---

#### 浏览器处理流程

普通资源：

```txt
HTML
→ 发现 img/src
→ 发起 HTTP 请求
→ 下载资源
→ 解码渲染
```

Data URL：

```txt
HTML
→ 发现 data:
→ 直接解码
→ 渲染资源
```

因此：

- 不会产生额外 HTTP 请求
    
- 不需要 DNS/TCP/TLS/HTTP 建连
    

---

#### 常见使用场景

##### HTML 图片

```html
<img src="data:image/png;base64,xxx">
```

---

##### CSS 背景图

```css
background-image: url("data:image/png;base64,xxx");
```

---

##### SVG 内嵌

```html
<img src="data:image/svg+xml,<svg>...</svg>">
```

SVG 通常甚至不需要 base64。

---

##### 文件预览

```js
const reader = new FileReader()

reader.readAsDataURL(file)
```

结果：
```txt
data:image/png;base64,...
```

常用于：
- 上传前图片预览
- 本地文件展示
---

#### 优点

##### 减少 HTTP 请求
适用于：
- icon
- 小图
- loading 图
尤其在 HTTP/1.1 时代收益明显。
##### 减少请求延迟

省去：
```txt
DNS
→ TCP 传输控制协议
→ TLS 传输层安全协议
→ HTTP
```

---

##### 单文件化

适合：
- 离线 HTML
- 邮件模板
- demo 页面
- 导出页面
---

#### 缺点

##### Base64 会导致体积膨胀

通常：

```txt
原始文件 × 1.33
```

原因：
```txt
3 字节 → 4 字符
```

---

##### 无法独立缓存

普通图片：

```txt
logo.png
```

浏览器可以单独缓存。

Data URL：

```txt
跟 HTML/CSS 绑定
```

HTML 改动后：

- 整个文件重新下载
    
- 无法复用缓存
    

---

##### 增大 HTML/CSS 体积

如果嵌入大资源：

- HTML 变大
    
- 解析变慢
    
- 内存占用增加
    

---

##### 不利于资源复用

多个页面引用同一资源时：

- 每个页面都会重复保存一份
    

---

#### 现代 Web 中的定位

HTTP/2、HTTP/3 出现后：
- 多路复用
- 并发连接优化

已经显著降低了 HTTP 请求成本。

因此：
```txt
Data URL 已不再是主要性能优化方案
```

现代最佳实践：
- 小资源：适合
- 大资源：不推荐

通常建议：
```txt
< 5KB ~ 10KB 的资源可考虑 Data URL
```

#### Data URL vs Blob URL

##### Data URL

特点
- 内容直接写进 URL
- 本质是字符串

示例：

```txt
data:image/png;base64,...
```

适合：
- 小资源
- 简单预览
---
##### Blob URL

示例：

```js
URL.createObjectURL(blob)
```

生成：

```txt
blob:http://xxx/abcd
```

特点：

- 浏览器内部内存引用
- 不直接保存真实数据

适合：
- 大文件
- 视频
- 本地文件
- 上传预览

Blob URL 通常性能优于 Data URL。

---
##### 总结

```txt
Data URL 是一种将资源内容直接嵌入 URL 的方案。

优点：
- 减少 HTTP 请求
- 适合小资源内联

缺点：
- Base64 导致体积膨胀
- 无法独立缓存
- 不适合大资源

现代 Web 中通常仅用于小型图片、SVG、icon 等场景。
```



# CSS
> https://segmentfault.com/a/1190000013325778
> [常规](https://evelance.notion.site/3deb29fe2f464eaa938606bbbb2fc3e4)


### 常规问题
#### 初始化CSS原因? 
- 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。
- 当然，初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。
- 最简单的初始化方法： `* { padding: 0; margin: 0; }` （强烈不建议）
- 使用 `normalize.css`
#### min-width, max-width,width的包含关系(优先级)是什么?
**属性的含义：**
- `min-width` 限制元素的最小宽度
- `max-width` 限制元素的最大宽度
- `width` 元素的宽度
**三者之间的优先级：**
`min-width` 和 `max-width` 的优先级都高于 `width`。即使 `width` 后面加上 `!important`。
- 当浏览器缩小导致元素宽度小于 `min-width` 时，元素的 `width` 就会被 `min-width` 的值取代，浏览器出现滚动条来容纳元素。
- 当浏览器放大导致元素的宽度大于 `max-width` 时，元素的 `width` 就会被 `max-width` 值取代。
- 当 `min-width` 值大于 `max-width` 时，则以 `min-width` 值为准。
**所以三者优先级排序： min-width > max-width > width**

### 元素竖向的百分比设定是相对于父容器的高度吗
- 对于 height 属性来说是的。
- 对于 **margin-top/bottom(padding-top/bottom) 来讲不是**，而是**相对于容器的宽度**计算的



### 页面中引入CSS文有几种方式
向页面中添加样式表的时候，层叠机制的原理是次序决定优先级。

如果为某个元素应用样式时，有两个或更多特殊性相等的规则相互竞争，则后声明的样式胜出。

* 行内样式
* 内部样式表
* 链接 `<link type="text/css" rel="stylesheet" href="style.css">`
* 导入 `@import url(style.css)`

```css
//行内
<div style="color: green; margin-top: 30px;border: 1px solid red;width: 500px">行内样式实例1</div>

//内部样式表
<style> 
p { color: #6478de; border: red 1px solid; } 
</style>

//链入外部样式
<link type="text/css" rel="stylesheet" href="style.css" >

//导入外部样式
<style> @import "qt_02_style.css"; </style>
```

### link 与 @import 的区别
就结论而言，强烈建议使用`link`标签，慎用`@import`方式。

> https://segmentfault.com/a/1190000015950516

**区别**
* 从属关系: `@import`是 CSS 提供的语法规则，只有导入样式表的作用；`link`是HTML提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。
* 加载顺序: 加载页面时，`link`标签引入的 CSS 被同时加载；`@import`引入的 CSS 将在页面加载完毕后被加载。
* 兼容性: `@import`是CSS2.1才有的语法，故只可在 IE5+ 才能识别；`link`标签不存在兼容性问题。
* DOM可控性: `@import`不能被DOM控制




### 盒模型

#### 是什么?
>[The box model - Learn web development | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)

指网页布局中，每个 HTML 元素都可以看作是一个矩形盒子（box），包括元素的内容区域、内边距（padding）、边框（border）和外边距（margin）四个部分。

可通过`box-sizing`进行设置。根据计算宽高的区域可分为：

- `content-box` (W3C 标准盒模型) 默认使用
- `border-box` (IE 盒模型)
- `padding-box`
- `margin-box` (浏览器未实现)

#### 作用
通过设置元素的盒模型属性(box-sizing 属性)，可以控制元素的大小、位置和边距，以及元素之间的距离和排列方式。盒模型也是响应式设计和网页布局的基础。

#### 分类
* 标准盒模型
* 替代(IE)盒模型

#### 差异
主要差异在于计算元素宽度和高度时所包含的内容不同。
标准盒模型:元素的宽度和高度只包括内容区域，不包括内边距、边框和外边距。
IE盒模型: 元素的宽度和高度包括了内容区域、内边距和边框，不包括外边距

默认浏览器会使用标准模型。如果需要使用替代模型，您可以通过为其设置 box-sizing: border-box 来实现。


#### 切换
默认浏览器会使用标准模型。
替代模型  box-sizing: border-box
标准模型  box-sizing: content-box

#### 实例
所有元素都使用替代模式
设置 box-sizing 在 `<html>` 元素上，然后设置所有元素继承该属性.
```css
html {
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}
```



### px、rem和em的区别
> https://github.com/Easay/issuesSets/issues/19

* px（像素）：相对长度单位，像素px是相对于显示器屏幕分辨率而言的。

* em：相对长度单位。相对于父元素的字体大小。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。
任意浏览器的默认字体高都是16px。所有未经调整的浏览器都符合: 1em=16px。为了简化font-size的换算，需要在css中的body选择器中声明Font-size=62.5%，这就使em值变为 `16px*62.5%=10px`, 这样`12px=1.2em, 10px=1em`, 也就是说只需要将你的原来的px数值除以10，然后换上em作为单位就行了。
```css
body {
  font-size: 62.5%; /* 设置为 10px */
}

h1 {
  font-size: 2.4em; /* 相当于 24px */
}

p {
  font-size: 1.6em; /* 相当于 16px */
}
```

* rem：是CSS3新增的一个相对单位。使用rem为元素设定字体大小时，仍然是相对大小，但相对的只是HTML根元素。通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。

#### vw vh vmin vmax
1vh等于1%的视口高度。例如，浏览器高度是900px，那么`1vh = 900*1%=9px`，同理，若视口宽度是750px,则1vw是7.5px。

vh和vw是相对于视口的宽度和高度，而vmin和vmax则关于视口高度和宽度两者的最小或者最大值。例如，如果浏览器的高宽分别为700px和1100px，则1vmin=7px，1vmax=11px；如果高宽分别是1080px和800px,则1vmin=8px,1vmax=10.8px。

#### 使用场景
假设有一个元素，你需要让它始终在屏幕上可见。只要对其高度和宽度使用vmin单位，并赋予其低于100的值就可以做到了。例如，可以这样定义一个至少有两个边触摸到屏幕的方形：
```css
.box {
    height: 100vmin;
    width: 100vmin;
}
```
如果需要让这个方框始终铺满整个视口的可见区域：
```css
.box {
    height: 100vmax;
    width: 100vmax;
}
```



#### 盒模型内部/外部显示类型
> 了解
> https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model#补充：内部和外部显示类型

外部显示类型: 外部显示类型来决定盒子是块级还是内联
内部显示类型: 决定了盒子内部元素是如何布局的, 默认情况下是按照**正常文档流**布局. 可以通过display:flex等方式改变内部显示类型.

### 浮动
#### 浮动问题
由于浮动元素不在文档流中, 浮动元素会漂浮在文档流的块框上。
* 父元素高度无法被撑开,影响与父元素同级的元素
* 与浮动元素同级的非浮动元素（内联元素）会跟随其后
* 若非第一个元素浮动，则该元素之前的元素也需要浮动

#### 清除浮动方法
>https://github.com/Easay/issuesSets/issues/12


一般来说，元素设置为浮动后会脱离文档流，不会对文档流中其他元素造成影响。但是文本内容会记住浮动元素的大小，并在排布时避开它。造成文本环绕浮动盒子的效果。要阻止行盒子环绕在浮动盒子外面，需要给包含行盒子的元素应用clear属性。

清除浮动主要是为了解决父元素因为子元素浮动而引起的内部高度为0的问题。

##### 清除浮动的方式有：

* 父级元素定义height（不推荐）
缺点：只适合高度固定的布局，要给出精确的高度，如果高度和父级div不一样时，会产生问题。
* 结尾处加空div标签+clear:both（不推荐）
在最后加空div标签，并设定clear:both，会在空div标签上方创造出足够的垂直外边距，从而为包住浮动元素创造空间。父元素自动检测子盒子最高的高度，然后与其同高。
* 父级div定义伪类：after+zoom（推荐🌷）
IE8以上和非IE浏览器才支持:after，原理和方法2有点类似，zoom(IE专有属性)可解决ie6,ie7浮动问题。
```css
.father:after{
      content:" ";
      clear:both;
      display: block;
      /* height:0px; */
  }
```

* 父级div定义overflow:hidden
缺点：内容增多的时候容易造成不会自动换行导致内容被隐藏掉，无法显示要溢出的元素
* 父级div定义overflow:auto
当在父级div定义overflow: hidden|auto时，浏览器会自动检查浮动区域的高度。


#### 其它
* 元素浮动后,display自动变为block





### 说说BFC的理解
#### 定义

当元素在页面上垂直或水平排布时，它们之间如何相互影响，CSS有几套不同的规则，其中一套叫块级格式化上下文（Block Formatting Context）。
**格式化上下文**
Formatting context 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。
最常见的 Formatting context 有 Block fomatting context (简称BFC)和 Inline formatting context (简称IFC)。

BFC是一个独立的布局环境，其中的元素布局是不受外界的影响，并且在一个BFC中，块盒与行盒（行盒由一行中所有的内联元素所组成）都会垂直的沿着其父元素的边框排列。


#### 会渲染BFC的元素
>https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
* document的根元素(`<html>`)
* 浮动(float值不为none)
* 绝对定位元素(元素position值为absolute/fixed)
* 行内块(元素display属性值为inline-block)
* 表格单元(元素display属性为table-cell,默认的HTML表格)
* 表格标题(元素display属性为table-caption,默认的HTML表格)
* 被拥有`display:table`属性隐式创建的匿名table表格
* 带有overflow属性(其值不能为visible/clip)的块元素(`因为overflow:visible元素并没有限制其内容的布局，其内容可以自由地溢出元素的边界，因此没有必要创建新的BFC来限制其影响范围。`)
* `display:flow-root`
* contain属性值为layout/content/paint的元素
* Flex子元素(属性为display:flex/inline-flex的元素的直接子元素),如果它们本身不是flex或grid或table容器.
* Grid子元素(属性为display:grid/inline-grid的元素的直接子元素),如果它们本身不是flex或grid或table容器.
* 多列容器(元素其column-count/column-width不是auto,column-count不是1)
* column-span:all


#### BFC区域布局规则
1. 内部的Box按垂直方向排列;
2. 计算BFC的高度时，浮动元素也参与计算
3. Box之间垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
4. 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
5. BFC的区域不会与float box重叠。
6. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

#### BFC应用


防止margin重叠: 创建新的BFC来防止相邻元素间的margin重叠
```css
//防止margin重叠  两个p标签的上下外边距会使用两个外边距中较大的那个值,使其中一个p变为bfc区域后,外边距为两个外边距和.


将其中一个p标签变为bfc区域:
 overflow: hidden; || display: inline-block; || dispaly: flex; || display: 
```
自适应两栏布局: 利用BFC不与浮动元素重叠的特性
```html

```
清除内部浮动: BFC可以包含浮动,用来清除浮动防止父元素高度塌陷
```html
<style>
    .par {
        border: 5px solid #fcc;
        width: 300px;
        // overflow: hidden; 实现bfc后, par元素高度会计算上内部的浮动元素
    }
 
    .child {
        border: 5px solid #f66;
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="par">
        <div class="child"></div>
        <div class="child"></div>
    </div>
</body>
```

- 清除浮动：
    - 子浮动，父 `overflow: hidden`（缺点：阴影和下拉菜单）
- div 垂直方向 margin 上下合并：
    - 其中一个包 div ，设置 `overflow：hidden`
- div 垂直方向 margin 内外合并：
    - 父容器 1px 透明上边框
    - 父容器 `overflow: hidden`
- 右侧 div 自适应：左边浮动，右边设置 `overflow：hidden`

### line-height理解
行高是指一行文字的高度，具体说是两行文字间基线的距离。CSS中起高度作用的是 height 和 line-height，没有定义 height 属性，最终其表现作用一定是 line-height 。


###  display:none, visiblity: hidden; opacity: 0之间的区别
- `display: none` （不占空间，不能点击）（回流+重绘）
- `visibility: hidden` （**占据空间**，不可点击）（重绘）
- `opacity: 0`（**占据空间**，可以点击）（重建图层，性能较高）

更多：[分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/100)

### 浏览器如何解析 CSS 选择器的，换句话说 CSS 的匹配规则是什么？

从右向左，提高查找效率
- 浏览器根据选择器过滤掉 DOM 中的元素，并向上遍历其父元素以确定匹配项。
- 选择器链的长度越短，浏览器可以越快地确定该元素是否与选择器匹配。
（div p em）
- 如果从左到右，有无数多个 div 都得向下查找，效率低
- 反之，只有当当前元素是 em 时，才会向上查找，效率高

**例如**：
- 使用这个选择器 `p span`，浏览器首先找到所有`<span>`元素，然后一直向上遍历其父元素直到根以找到`<p>`元素。
- 对于特定的`<span>`，一旦找到`<p>` ，它就知道 `<span>` 匹配并可以停止匹配。


### 文字超长的省略号写法
#### 单行文本省略
```css
.single-line-ellipsis {
  width: 200px; /* 设置一个固定宽度，根据实际需求调整 */
  white-space: nowrap; /* 强制文本在一行内显示 */
  overflow: hidden; /* 超出宽度的部分隐藏 */
  text-overflow: ellipsis; /* 用省略号表示超出的文本 */
}
```

#### 多行文本省略
```css

.multi-line-ellipsis {
  width: 200px; /* 设置一个固定宽度，根据实际需求调整 */
  overflow: hidden; /* 超出宽度的部分隐藏 */
  text-overflow: ellipsis; /* 这行对于多行省略号只是辅助，主要靠下面的属性 */
  display: -webkit-box; /* 开启弹性伸缩盒子模型 */
  -webkit-line-clamp: 3; /* 显示的行数，超出部分用省略号表示，这里设置为 3 行，可根据需求修改 */
  -webkit-box-orient: vertical; /* 子元素垂直排列 */
}
```


### 图片为什么有左右上下间隙,怎么去除?
**原因：**
- 左右：因为 img 是 `inline-block` 行内块元素，行内元素之间有『换行（回车），空格，tab』时会产生左右间隙
- 上下：**行内元素默认与父容器基线对齐**，而基线与父容器底部有一定间隙，所以上下图片间有间隙。
**解决办法：**
- 移除上下间隙：
    - img 本身设置 `display: block;`
    - 父元素设置 `font-size: 0;` （基线与字体大小有关，字体为零，基线间就没距离了）
    - img 本身设置 `vertical-align: bottom;`（让inline-block的img与每行的底部对齐）
- 移除左右间距：
    - 行内元素间不要有换行，连成一行写消除间隙
    - 第一行结尾写上 `<!-- ，第二行开头跟上 -->` 。即利用注释消除间距
    - 父元素 font-size 设置 0

### chrome字体如何小于12px?
- 老版：`webkit-text-size-adjust: none`
- 新版：`webkit-transform: scale(.8, .8)`


### 为什么会发生样式抖动?
因为没有指定元素具体高度和宽度，比如数据还没有加载进来时元素高度是 100px(假设这里是 100px)，数据加载进来后，因为有了数据，然后元素被撑大，所有出现了抖动

### css 如何匹配前 N 个子元素及最后 N 个子元素
- 如何匹配最前三个子元素: `:nth-child(-n+3)`
- 如何匹配最后三个子元素: `:nth-last-child(-n+3)`
### li 与 li 之间有看不见的空白间隔是什么原因引起的？有什么解决办法？
- **场景：**
    - 有时，在写页面的时候，会需要将这个块状元素横排显示，此时就需要将 display 属性设置为 inline-block，此时问题出现了，在两个元素之间会出现大约8px左右的空白间隙。
- **原因：**
    - 浏览器的默认行为是把 inline 元素间的空白字符（空格换行tab）渲染成一个空格，也就是我们上面的代码 `<li>` 换行后会产生换行字符，而它会变成一个空格，当然空格就占用一个字符的宽度。
- **解决：**
    - 给 ul 标签设置 `font-size: 0;` 并为 li 元素重新设置 `font-size: XXpx;`



### 选择器优先级
[[CSS-CSS选择器#优先级]]
CSS中的优先级规则分为两大类，一类称为**继承**，另一类称为**级联**。
* 继承的优先级是最低的;
* 级联优先级:
	* 开发者设置的CSS样式；
	* @layer规则中的CSS样式；
	* 用户设置的CSS样式；
	* 浏览器内置的CSS样式。
* 每个级联层中优先级计算公式:
	* 将不同选择器分配不同数值,选择器数值越高,优先级越高,但不会超过它上一级的优先级

计算公式:
* 0级 通配符,选择符,逻辑伪类
* 1级 元素
* 2级 类 属性 伪类
* 3级 ID
* 4级 行内样式

#### 计算优先级
<span style="color:blue">一个选择器的优先级可以说是由四个部分相加 (分量)，可以认为是个十百千 — 四位数的四个位数：</span>

1. **千位**： 如果声明在 [`style`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes#attr-style) 的属性（内联样式）则该位得一分。这样的声明没有选择器，所以它得分总是1000。
2. **百位**： 选择器中包含<u>ID选择器</u>则该位得一分。
3. **十位**： 选择器中包含<u>类选择器、属性选择器、伪类</u>则该位得一分。
4. **个位**：选择器中包含<u>元素、伪元素选择器</u>则该位得一分。

**注**: <span style="color:blue">通配符选择器 (`*`)，组合符 (`+`, `>`, `~`, ' ')，和否定伪类 (`:not`) 不会影响优先级。</span>


### flex弹性布局

#### 是什么?
是一种一维布局模型，它提供了强大的空间分布和对齐能力，能够有效地处理不同尺寸的元素布局。Flexbox布局是CSS3中引入的一种新的布局模式，特别适用于响应式设计和不确定内容尺寸的情况。

#### flex容器6属性及作用
* **flex-direction**  主轴的方向（即子元素的排列方向: row | row-reverse | column | column-reverse。默认row。
* **flex-wrap** 子元素是否需要换行.可选值有:nowrap | wrap | wrap-reverse。默认nowrap。
* **flex-flow** 上面两项合并写法
* **justify-content** 子元素在主轴的对齐方式
	* flex-start
	* flex-end
	* center
	* space-between  两端对齐，项目之间的间隔都相等。
	* space-around   每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
* **align-items** 子元素在交叉轴上的对齐方式
	* flex-start  交叉轴的起点对齐
	* flex-end
	* center   交叉轴的起点对齐
	* baseline 项目的第一行文字的基线对齐。
	* stretch  默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。
* **align-content** 定义了多根交叉轴存在时子元素在交叉轴上的对齐方式。如果项目只有一根轴线，该属性不起作用。

#### flex元素6属性
* order 定义子元素的排列顺序(在主轴上数字越小越靠前)
* flex-grow 元素的放大比例,默认为0.如果都为1,则每项元素在空间扩大时等分剩余空间
* flex-shrink 元素的缩小比例
	* 默认为1,空间不足时均等比例缩小;用0来表示禁止缩小.
	* 如果一个子元素的flex-shrink属性为0,其它子元素的为1.则空间不足时,前者不缩小.
	* 负值对该属性无效
* flex-basis 默认值为auto,表示元素占据主轴空间的原大小.
  * 可以设置具体数值或auto
  * 如果值为auto,则元素大小将根据内容自动调整.

* flex 上面3项的缩写. 
  * `flex:1`表示项目会根据剩余空间按等比例放大/缩小(相等于 1 1 0%).最后值不为auto就不会按本身宽度而均分计算.
  * `flex:none`  等价于`flex:0 0 auto`  盒子没有很大或缩小,基于各自内容自适应大小,采用本身默认大小
  * `flex:100px` 等价于`flex:1 1 100px`，表示项目会根据剩余空间按比例放大，也会按比例缩小，基准长度为100像素.
* align-self 单个元素的对齐方式


#### 实例

##### flex布局解决最后一行两边分布的问题
**解决前:**
![[Pasted image 20250227160455.png]]

**解决后:**
![[Pasted image 20250227160433.png]]

**解决方案:**

```html
<div class="container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
    <div class="item">7</div>
    <span></span>
    <span></span>
  </div>
```


**方案说明:**
 如果我们每一行显示的个数为 n，那我们可以最后一行子项的后面加上 n-2 个 span 元素，span 元素的宽度和其它子项元素宽度一样，但不用设置高度。
**为什么是添加 n-2 个 span 元素呢 ？**
- 当最后一行只有 1 个子元素时，他会默认靠左，不用处理
- 当最后一行子元素正好时，我们就不用关心这个问题。
所以要去掉这两种情况，只需要加 n-2 个 span 元素就好


### Grid布局

#### 是什么
Grid 布局则是将容器划分成行和列，产生单元格，然后指定项目所在的单元格，可以看作是二维布局。

#### 优缺点
- **grid 布局的优点：**
    1. 固定和灵活的轨道尺寸
    2. 可以使用行号，名称或通过定位网格区域将项目放置在网格上的精确位置。网格还包含一种算法，用于控制未在网格上显示位置的项目的放置。
    3. 在需要时添加其他行和列
    4. 网格包含对齐功能，以便我们可以控制项目放置到网格区域后的对齐方式，以及整个网格的对齐方式。
    5. 可以将多个项目放入网格单元格或区域中，它们可以彼此部分重叠。然后可以用 z-index 属性控制该分层。
- **grid 布局的缺点：**
    - 兼容性不太好













##### 如何实现响应式flex布局
通过使用媒体查询和弹性盒子属性，实现响应式Flex布局，以适应不同的屏幕尺寸。
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flexbox Responsive Layout</title>
  <style>
    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
    }

    .item {
      flex: 1 0 calc(33.333% - 20px);
      margin-bottom: 20px;
      background-color: #ccc;
      text-align: center;
      padding: 10px;
    }

    @media (max-width: 768px) {
      .item {
        flex: 1 0 calc(50% - 20px);
      }
    }

    @media (max-width: 480px) {
      .item {
        flex: 1 0 calc(100% - 20px);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
    <div class="item">Item 4</div>
    <div class="item">Item 5</div>
    <div class="item">Item 6</div>
  </div>
</body>
</html>
```

##### 等高列
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Equal Height Columns with Flexbox</title>
  <style>
    .container {
      display: flex;
    }

    .column {
      flex: 1;
      padding: 20px;
      background-color: #ccc;
    }

    .column:first-child {
      margin-right: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="column">
      <h2>Column 1</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam malesuada felis vel augue accumsan, at posuere neque tincidunt. Sed pulvinar, nisi in fringilla fringilla, lorem nisl semper purus, vel consequat ipsum nibh vitae libero.</p>
    </div>
    <div class="column">
      <h2>Column 2</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam malesuada felis vel augue accumsan, at posuere neque tincidunt. Sed pulvinar, nisi in fringilla fringilla, lorem nisl semper purus, vel consequat ipsum nibh vitae libero. Proin dictum arcu a libero pulvinar auctor. </p>
      <p>Praesent lobortis erat vel justo finibus, nec ullamcorper quam pretium. Vivamus sed ipsum ligula. Donec lobortis sodales massa eu placerat.</p>
    </div>
  </div>
</body>
</html>
```


### position

#### position属性有那些值
position 属性用于指定一个元素在文档中的定位方式.
position有四个常用属性值：relative、absolute、fixed、static。三个不常用的：inherit、initial、sticky、unset

不设置Position的值或设置了position:static，top，left，right，bottom不起作用.
通过position属性，我们可以让元素相对于其正常位置，父元素或者浏览器窗口进行偏移。

#### position属性值介绍

##### static
默认值. 不设定position或者设定position:static都不会对这个div（或者别的标签）的布局有影响. top，left，right，bottom不会起作用

##### relative
* 相对定位. 未脱离文档流,**基于元素的margin左上角进行偏移**,不会影响其它元素的位置
* left和right同时存在，仅left有效;当top和bottom同时存在仅top有效。

##### absolute
* 绝对定位. 元素脱离了文档流,**绝对定位元素相对于最近的非static祖先元素定位**。基于祖先元素的左上角位置, 不包含margin区域, 从padding区域开始计算.
* 当祖先元素不存在时，则相对于ICB（inital container block, 初始包含块）,可以理解为窗口/body元素.
* 关于盒子层叠的次序，可以设置一个叫z-index的属性，值越大，离眼睛越近。

##### fixed
* 固定定位. 以浏览器的窗口为参考点进行定位.
* 当出现滚动条时，对象不会随着滚动，IE6以下不支持该属性。

##### sticky
* 磁贴定位. 
* 像position:relative和position:fixed的合体:

#### 实例

##### 1.声明为fixed/absolute时
* 该元素将变为块级元素(例子,span设置absolute后,可以设置宽高)
* 如果该元素是块元素且宽度是100%,则宽度变为auto

##### 2.实现水平垂直居中
> 见下面





### 重排和重绘
> https://juejin.cn/post/6844904083212468238


#### 重绘重排区别
重绘和重排是浏览器渲染页面的两个过程，它们有以下区别：
* 重绘是指元素的外观发生改变，但不影响布局的情况，例如改变颜色、背景、边框等。
* 重排是指元素的几何属性发生改变，影响了布局的情况，例如改变位置、大小、内容等。
* 重排往往有重绘。因此，在优化页面性能时，应该尽量减少重排和重绘的次数和范围。

#### 哪些操作导致重排
[[六 性能优化#2.重排和重绘的优化#1.触发布局与重绘的操作有哪些?]]


#### 哪些操作会导致重绘
- 更新元素的颜色
- 文本方向
- 阴影

#### 重排优化

##### 1.减少重排范围
* 尽可能直接在目标元素上操作,而不用操作父元素/兄弟元素
* 不使用table布局,1个小改动会造成整个table重新布局

##### 2.减少重排次数
* 样式集中改变 class代替style
* 分离读写操作
* 将DOM元素离线操作
* 使用absolute或fixed脱离文档流
* 优化动画

**样式集中改变**

**分离读写操作**
读操作放在一起,写入操作放在一起

**将DOM离线** !!
* 使用 display:none
* documentFragment
* 复制节点,副本操作,然后替换

```js


// 缓存 DOM 元素（只获取一次）
const container = document.getElementById('container');

// 合并样式操作（减少回流）
Object.assign(container.style, {
  width: '100px',
  height: '200px',
  border: '10px solid red',
  color: 'red'
});

// 离线后的操作（复用缓存对象）
// 假设后续需要修改部分属性
Object.assign(container.style, {
  width: '200px',     // 覆盖原有宽度
  backgroundColor: 'blue' // 新增背景色
});
```

**优化动画**
* 动画效果应用position为absolute/fixed
* 启用GPU加速的属性: CSS转换, CSS33D变换transform webgl, 视频







### css问题总结

#### 用css实现瀑布流
利用column-count和break-inside这两个CSS3属性即可

<iframe src="https://codesandbox.io/embed/staging-frog-598uwu?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="css3 瀑布流"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
   


#### 有什么不同的方式可以隐藏内容？
> https://www.frontendinterviewhandbook.com/zh/css-questions#有什么不同的方式可以隐藏内容使其仅适用于屏幕阅读器'
> 注意,链接提供的方法中涉及的Metadata格式化规范方法, WAI-ARIA规范和隐藏元素不太相关.

* display: none;：这是最常见的一种隐藏元素的方法。该属性可以完全从页面中删除元素，并在布局中不占用空间。然而，这种方法会将元素完全从文档流中删除，包括任何子元素和事件监听器。

* visibility: hidden;：这种方法与 display: none; 类似，但元素仍会占用布局空间。元素仍保留在文档流中，但对用户不可见，并且不会响应事件。

* opacity: 0;：该属性将元素的不透明度设置为 0，使元素在页面上不可见，但仍会保留在文档流中并响应事件。

* position: absolute;：将元素的 position 属性设置为absolute，可以将其从文档流中移除并相对于其最近的定位祖先进行定位。可以通过将 left 或 top 属性设置为负值来将元素移出视图区域。

* clip-path: polygon(0 0, 0 0, 0 0, 0 0);：该属性可以将元素裁剪成一个多边形，通过将其所有点的坐标设置为相同的值（例如，0），可以将元素完全裁剪并隐藏。

* height: 0; width: 0; overflow: hidden;：该属性将元素的高度和宽度设置为 0，并将其 overflow 属性设置为 hidden，以将其内容隐藏在元素内部。

* transform: scale(0);：该属性将元素缩放为 0，使其在页面上不可见，但仍会保留在文档流中并响应事件。


#### css水平居中,垂直居中, 水平垂直居中

*水平居中*
- 行内元素: `text-align: center`
- 块级元素: `margin: 0 auto`
- position:absolute +left:50%+ transform:translateX(-50%)
- `display:flex + justify-content: center`

*垂直居中*
- 行内元素 line-height
- 块级元素
	- flex
		- `display:flex + align-items: center`
		- display:table+display:table-cell + vertical-align: middle;
	- grid
	- table-cell
	- 定位+translate
		-  position：absolute +top:50%+ transform:translateY(-50%)

**水平垂直居中**
* flex
* absolute+left/top+margin 或者 absolute+left/top+transform
* absolute+(left/right/top/bottom) + margin
* tabel-cell + vertical-align

```css

// flex
display: flex;
justify-content: center;
align-items: center;


// 定位+margin-1
position: absolute;
top: 50%;
left: 50%;
margin-top: -halfOfWidthpx;
margin-left: -halfOfWidthpx;

// 定位+margin-2
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
margin: auto;


//定位+translate
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%)

//父元素 table-cell
display: table-cell
vertical-align: middle;
```


#### 单行文本溢出
```css
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
```

#### 多行文本溢出
```css
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2; // 最多显示几行
-webkit-box-orient: vertical;
```



### 使用css画一个三角形/圆形/半圆
> https://github.com/Easay/issuesSets/issues/7


#### 三角形


* border
* border+transform
* 伪元素
* linear-gradient
* clip-path
* svg
<iframe src="https://codesandbox.io/embed/san-jiao-xing-3mqln7?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="三角形"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>


**border方式**
```css
div {
	width: 0px;
	height: 0px;
	border-width: 0 40px 40px;
	border-style: solid;
	border-color: transparent transparent green;
}
```

**clip-path方式**
clip-path属性使用裁剪方式创建元素的可显示区域，区域内的部分显示，区域外的隐藏。
```css
#triangle{
	width:100px;
	height:100px;
	background: red;
	clip-path:polygon(0 100%,50% 0,100% 100%);
}
```

#### 圆形/半圆/扇形
```css
.circle {
    border-radius: 50%
}


.container{ //半圆
    width: 100px;
    height: 50px;
    background: red;
    border-radius: 50px 50px 0 0;
}

.container{ //扇形
    width: 50px;
    height: 50px;
    background: red;
    border-radius: 50px 0 0;
}
```




#### inline-block元素间间距问题
> [去除inline-block元素间间距的N种方法 « 张鑫旭-鑫空间-鑫生活 (zhangxinxu.com)](https://www.zhangxinxu.com/wordpress/2012/04/inline-block-space-remove-去除间距/)

- 移除空格
- 使用margin负值
- 使用font-size:0
- letter-spacing
- word-spacing


#### 布局案例
##### 1.左侧固定右侧自适应
**1-1.float方案**
缺点: 初始渲染后,无法自动适应宽高,有空白
<iframe src="https://codesandbox.io/embed/bu-ju-zuo-ce-gu-ding-you-ce-zi-gua-ying-ez6btk?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="布局-左侧固定右侧自适应"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

**1-2.flex方案**
<HTML>
<iframe height="300" style="width:100%;" src="https://codepen.io/westover/embed/MYWbNvO?default-tab=html%2Cresult"></iframe>
</HTML>



##### 2.圣杯布局
**2.1 浮动方案**
<iframe src="https://codesandbox.io/embed/bu-ju-sheng-bei-bu-ju-yt3zf5?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="布局-圣杯布局"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>



##### 3.双飞翼布局
**3.1 浮动方案**
<iframe src="https://codesandbox.io/embed/bu-ju-shuang-fei-yi-bu-ju-fnjxv4?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="布局-双飞翼布局"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


#### 单行/多行文本居中
使用line-height实现
<iframe src="https://codesandbox.io/embed/wen-ben-chu-li-wc1nq3?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="文本处理"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>




### CSS 预处理器 //?

CSS 预处理器的原理: 是将类 CSS 语言通过 **Webpack 编译** 转成浏览器可读的真正 CSS。在这层编译之上，便可以赋予 CSS 更多更强大的功能，常用功能:

- 嵌套
- 变量
- 循环语句
- 条件语句
- 自动前缀
- 单位转换
- mixin 复用

```js
//less
0.嵌套 &代表当前选择器的父级.使用嵌套（nesting）代替层叠或与层叠结合使用

1.变量声明 @+变量名称=值
2.使用变量 
 2.1作为属性值
 2.2作为属性名 @{变量名称}
 2.3作为选择器 #@{变量名称} @{#变量名称}
 2.4


3.循环语句
4.条件语句

5.自动前缀




7.混入mixin
混合（Mixin）是一种将一组属性从一个规则集包含（或混入）到另一个规则集的方法。
```

# JavaScript

## 常规问题
### var/const/let的区别
- const定义常量, let/var定义变量
- const和let相对于var
  - 有块作用域
  - 没有变量提升
  - 不会添加到window上
  - 不能重复声明

### 声明变量的6种方式
>https://github.com/Easay/issuesSets/issues/113
* var
* let
* const
* function
* import
* class
#### 代码示例
代码1
```js
 function fun(str){
  let str = 'hello'+'world!';
  console.log(str);
}
fun('123');
```
结果：运行后是一个语法错误：Uncaught SyntaxError：Identifier 'code' has already been declared

代码二
```js
var str = 'hello';

function fun(){
  console.log(str);
  let str = 'world';
  console.log(str);
}
fun();
```
结果：只要块级作用域内存在let命令，它所声明的变量就“绑定”这个区域，不再受外部的影响，这也就是传说中的 暂时性死区，ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错，所以上面是一段错误代码：Uncaught ReferenceError: Cannot access 'str' before initialization。

代码三
```js
const obj = {};
let str = '坚持一周写两篇博客';
let addObj = obj.names = str;

console.log(addObj); //坚持一周写两篇博客
console.log(obj);{names:"坚持一周写两篇博客"}
```

const需要注意：
* 只声明不赋值，会报错；
* 只在声明所在的块级作用域内有效；
* const命令声明的常量不提升，存在暂时性死区；
* 不可重复声明；
* 冻结对象，可以使用Object.freeze方法


**function**
ES6规定：
允许在块级作用域内声明函数。
函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
同时，函数声明还会提升到所在的块级作用域的头部。
上面三条规则只对 ES6 的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作let处理。

根据这三条规则，浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于var声明的变量。

// 浏览器的 ES6 环境
```js
function f() { console.log('I am outside!'); }
(function () {
  var f = undefined;
  if (false) {
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function
```
**import**
import用于加载文件，在大括号接收的是一个或多个变量名，这些变量名需要与想要导入的变量名相同。

🌰：导入action.js文件中的某一个变量，这个变量里保存了一段代码块，所以要写成：import { Button } from 'action'，这个时候，就从action.js中获取到了一个叫 Button 的变量。

如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名，比如：
```js
import { NewButton as Button } from 'action.js';
```

**class**
```js
class Interest {
	constructor( x, y, e, z ){
		this.x = x;
		this.y = y;
		this.e = e;
		this.z = z;
	}

	MyInterest(){
		let arr = [];
		console.log(`我会${[...arr,this.x,this.y,this.e,this.z]}!`);
	}
}

let GetInterest = new Interest('唱','跳','rap','篮球');
console.log(GetInterest.MyInterest());  //我会唱,跳,rap,篮球!
```



### **执行上下文**

#### 是什么
当 JavaScript 引擎执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

每个执行上下文都有3个属性:
* 变量对象(Variable object，VO)
* 作用域链(Scope chain)
* this

### 执行上下文栈

#### 定义

执行上下文栈（Execution context stack，ECS）来管理执行上下文
当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。


### 变量对象
#### 是什么
变量对象是与执行上下文相关的<span style="color:red">数据作用域</span>，存储了在上下文中定义的变量和函数声明。在函数被调用但是函数尚未被执行时被创建的.创建过程实际上就是函数初始化的过程.
全局上下文中的变量对象就是全局对象
函数上下文中的变量对象(活动对象)是进入函数上下文时被创建的

#### 变量对象的组成
执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：
1. 进入执行上下文
2. 代码执行
当进入执行上下文时，这时候还没有执行代码，
变量对象会包括：
1. 函数的所有形参 (如果是函数上下文)
   - 创建由名称和对应值组成的一个变量对象的属性
   - 没有实参，属性值设为 undefined
2. 函数声明
   - 创建由名称和对应值（函数对象(function-object)）组成一个变量对象的属性
   - 如果变量对象已经存在相同名称的属性，则完全替换这个属性
3. 变量声明
   - 创建由名称和对应值（undefined）组成一个变量对象的属性
   - <span style="color:blue">如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性</span>

#### 变量对象实例
```javascript
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

在进入执行上下文后，这时候的 AO 是：
```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

代码执行:
在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值
还是上面的例子，当代码执行完后，这时候的 AO 是：
```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```


### 作用域
#### 产生的背景
将变量引入程序带来的问题: 变量存储在哪里? 程序需要的时候如何找到它们?
#### 是什么
存储变量和查找变量的规则.

#### 变量查找案例 (`var a = 2`)

以`var a = 2`为例:
* 首先, 编译器会将这段程序分解成词法单元，然后将词法单元解析成一个树结构。
* 遇到`var a`，<span style="color:blue;">编译器会询问作用域</span>是否在同作用域集合中存在同名变量
  * 是 编译器会忽略该声明，继续进行编译；
  * 否 它会要求作用域在当前作用域的集合中声明一个新的变量，并命名为a
* 编译器为引擎运行生成所需的代码,用来处理a=2这个赋值操作.<span style="color:blue;">引擎运行时会首先询问作用域</span>，在当前的作用域集合中是否存在一个叫作`a`的变量。
  * 是, 引擎就会使用这个变量
  * 否, 引擎会继续查找该变量
    * 找到, 就会将2赋值给它;
    * 没找到, 引擎就会举手示意并抛出一个异常 ?!!

#### 引擎查找变量两套规则

查找变量的两种查询方式:
- LHS查询  “赋值操作的目标是谁（LHS） 一般出现在赋值操作的左侧
- RHS查询  “谁是赋值操作的源头（RHS）”  一般出现在赋值操作的右侧

#### 查询未声明变量的处理过程
在变量还没有声明（在任何作用域中都无法找到该变量）的情况下，这两种查询的行为是不一样的。具体表现如下:
- RHS查询遍寻不到所需的变量,引擎会抛出`ReferenceError`异常
- LHS查询遍寻不到所需变量,
  - 非严格模式: 全局作用域会创建一个具有该名称的变量,并返还给引擎(非'严格模式'下)
  - 严格模式: 抛出同RHS查询失败时类似的`ReferenceError`异常
- RHS查询找到一个变量,但对变量进行不合理操作(例如,对函数类型进行调用,引用null/undefined值中的属性), 引擎抛出`TypeError`.

> `ReferenceError` 同作用域判别失败相关
> `TypeError` 代表作用域判别成功了，但是对结果的操作是不合法的



#### 作用域的两种类型

作用域共有两种主要的工作模型。
- 词法作用域: 最为普遍的，被大多数编程语言所采用的。<span style="color:blue;">词法作用域就是定义在词法阶段的作用域</span>。
- 动态作用域，仍有一些编程语言在使用（比如Bash脚本、Perl中的一些模式等）


#### JS中的作用域类型
* 全局作用域
* 函数作用域
* 块作用域

#### JS函数作用域的特点

> 在某个位置独立调用,将会局部提升

* 函数的作用域由函数的<u>定义位置决定</u>,和函数的调用位置无关
* 函数作用域在函数调用时<u>创建</u>，在调用结束时<u>销毁</u>  
* 函数每次调用都会产生一个<u>新的</u>函数作用域，函数作用域之间<u>相互独立</u>
* 在函数作用域中声明的变量是<u>局部变量</u>,只能在函数内部访问; 省略var或let，则变量默认会成为<u>全局</u>变量(不希望出现的情况)
* 在函数内部，使用var声明的变量和使用function开头的函数也会被<u>提升</u>


#### JS中的块作用域有哪些?

<u>with</u>

用with从对象中创建出的作用域仅在with声明中而非外部作用域中有效。

<u>try...catch</u>

其中声明的变量仅在catch内部有效

<u>let</u>

let关键字可以将变量绑定到所在的任意作用域中（通常是{ .. }内部）。换句话说，let为其声明的变量<span style="color:blue;">隐式地劫持了所在的块作用域</span>


#### JS块作用域的作用

1.作用域作用-垃圾回收

让引擎清楚地知道没有必要继续保存某些数据

```javascript
function process(data) {
  //...
}
{ //在这个块中定义的内容完事可以销毁
	var someReallyBigData = {};
	process(someReallyBigData);
}

//
```

<u>2.let循环</u>

<span style="color:blue">for循环头部的let不仅将i绑定到了for循环的块中，事实上它将其重新绑定到了循环的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值。</span>

下面通过另一种方式来说明每次迭代时进行重新绑定的行为：

```javascript
{
  let j;
  for (j=0; j<10; j++) {
    let i=j; //每个迭代重新绑定
    console.log(i);
  }
}

//说明了几件事情?
//1. for循环内存在块作用域
//2. let声明的变量会绑定到循环的每一次迭代中
```

<u>3.创建块作用域变量</u>

可以用来创建块作用域变量，但其值是固定的（常量）。之后任何试图修改值的操作都会引起错误。

4.基于作用域隐藏变量和函数


#### 作用域嵌套

是什么?
当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。

查找规则?
引擎从当前的执行作用域开始查找变量，如果找不到，就向上一级继续查找。当抵达最外层的全局作用域时，无论找到还是没找到，查找过程都会停止。

#### 作用域链

定义
由多个执行上下文的<u>变量对象</u>构成的链表叫做作用域链. 当查找变量时,会,就会,全局....


### 对象


### 数组

#### 数组遍历的方法有哪些?
* for循环
* while循环
* forEach
* for...of
* every/some reduce/map filter








### 函数
#### 函数声明和函数表达式区别
* **函数名称是否必须**
	* 以函数声明的方法定义的函数,函数名是必须的
	* 函数表达式的函数名是可选的
* **函数是否提升**
	* 以函数声明的方法定义的函数,函数可以在函数声明之前调用
	* 函数表达式的函数只能在声明之后调用
* **使用范围**
	* 以函数声明的方法定义的函数并不是真正的声明,它们仅仅可以出现在全局中,或者嵌套在其他的函数中,但是<span style="color: blue">它们不能出现在循环/条件或try/catch/finally中</span>
	* 函数表达式可以在任何地方声明。换句话说，函数声明不是一个完整的语句，所以不能出现在if-else,for循环，finally，try catch语句以及with语句中。

```js
//（函数声明整体会被提升到当前作用域的顶部，函数表达式也提升到顶部但是只有其变量名提升）

// 函数表达式
console.log(expressionFunc); // 输出: undefined
// expressionFunc(); // 如果取消注释,会抛出 TypeError: expressionFunc is not a function

var expressionFunc = function() {
    console.log("This is a function expression");
};

```


#### call/apply/bind
##### bind能多次绑定一个函数吗?
可以多次绑定,但后续绑定不能覆盖已经指定的this值.

同样使用call/apply也无法改变绑定后函数的this值.

##### 手写bind方法
```js

Function.prototype.bind2 = function(...restArgs) {
	
	let obj = [].call.shift(restArgs) || globalThis
	let fn = this;

	return function() {
		let innerArgs = [].slice.call(arguments)
		return fn.apply(obj, restArgs.concat(innerArgs))
	}
	
}
```

##### 手写new方法
  >
  1.在内存中新建一个对象
>
>2.将新对象内部的[[prototype]]的指针赋值为构造函数的prototype属性
>
>3.更新构造函数内的this(Constructor.apply(obj))为这个对象, 并执行构造函数内部的代码,
>
>4.返回值: 如果构造函数返回非空对象,则返回该对象; 否则,返回刚创建的新对象.

```js

function newOperator() {
  let obj = {};
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype; 
  //let obj = Object.create(Constructor.prototype);
  let result = Constructor.apply(obj, arguments);
  return typeof result === 'object' ? result : obj;
}
```



### 闭包
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.7g1aiggs0g00.webp)
#### 定义
闭包是一个函数以及其周围状态（词法环境）的引用的组合。简单说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。

#### 形成原因
存在上级作用域的引用
当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

#### 如何创建
- 嵌套的内部函数引用了外部函数的变量, 当调用外部函数并执行返回的内部函数

#### 优点
- 保护函数的私有变量不受外部干扰,实现方法或属性的私有化
- 形成不被销毁的栈内存

#### 缺点
* 内存泄露: 程序申请了内存,但没有及时释放,导致内存空间被浪费
* 内存溢出: 程序申请的内存超过系统提供的上限,导致无法分配内存.

#### 使用场景
* 数据私有化
* 函数工厂
* 实现模块化
闭包使用场景包括: 使用return返回函数; 函数作为参数; IIFE; 定时器setTimeout; 所有的回调函数.

1.回调
闭包有用之处在于它可以将一些数据和操作它的函数关联起来。这和面向对象编程明显相似。在面对象编程中，我们可以将某些数据（对象的属性）与一个或者多个方法相关联。(在<span style="color:red">定时器, 事件监听器,Ajax请求,跨窗口通信,Web Works或者其他的异步(或同步)任务</span>中,<span style="color:blue;"> 只要使用了回调函数,实际上就是在使用闭包.</span>)
因此，当你想只用一个方法操作一个对象时，可以使用闭包。

2.模拟私有方法
私有方法不仅可以限制代码的访问权限，还提供了管理全局命名空间的强大能力，避免非核心的方法弄乱了代码的公共接口。


#### 闭包实例

##### 简述函数执行过程
```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo();
```

简要复述其执行过程:

1. 进入全局代码，创建全局执行上下文，全局执行上下文压入执行上下文栈
2. 全局执行上下文初始化
3. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 执行上下文被压入执行上下文栈
4. checkscope 执行上下文初始化，创建变量对象、作用域链、this等
5. checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出
6. 执行 f 函数，创建 f 函数执行上下文，f 执行上下文被压入执行上下文栈
7. f 执行上下文初始化，创建变量对象、作用域链、this等
8. f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

问题:

当 f 函数执行的时候，checkscope 函数上下文已经被销毁了啊(即从执行上下文栈中被弹出)，怎么还会读取到 checkscope 作用域下的 scope 值呢？

<span style="color:red"> f 执行上下文维护了一个作用域链</span>：



##### 实现一个只能执行3次的函数
有一个函数，参数是一个函数，返回值也是一个函数，返回的函数功能和入参的函数相似，但这个函数只能执行3次，再次执行无效，如何实现

```javascript
function sayHi() {
    console.log('hi')
}

function threeTimes(fn) {
    let times = 0
    return () => {
        if (times++ < 3) {
            fn()
        }
    }
}

const newFn = threeTimes(sayHi)
newFn()
newFn()
newFn()
newFn()
newFn() // 后面两次执行都无任何反应
```



##### 实现add函数,让add(a)(b)和add(a,b)两种调用结果相同

```javascript
function add(a, b) {
  if (b === undefined) {
    return function(x) {
       return a + x
    }
  }
  
  return a + b
}
```



#### 闭包面试题

1.for循环
```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0](); //输出3
data[1](); //输出3
data[2](); //输出3
```

如何改造:
* 立即执行函数
* 使用let
```js
var data = []
for (var i=0; i<3; i++) {
	//data[i] = (function() {console.log(i)})(i) 错误
	data[i] = (function(j){console.log(j)})(i)
}


//let
var data = []
for (let i=0; i<3; i++) {
	console.log(i)
}
```



#### 其它
##### IIFE是闭包吗?

```javascript
var a = 2;
(function IIFE() {
  console.log(a);
})();
```

以上代码并不是严格的闭包:
* 因为函数（示例代码中的IIFE）并不是在它本身的词法作用域以外执行的。它在定义时所在的作用域中执行
* a是通过普通的词法作用域查找而非闭包被发现的。


##### 循环和闭包
```javascript
for (var i=1; i<=5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i*1000)
}
```

延迟函数的回调会在循环结束时才执行. 即使每个迭代中执行的setTimeout(..., 0), 所有的回调函数依然是在循环结束后才被执行.

**代码的问题:**

我们试图假设循环中的每个迭代在运行时都会给自己“捕获”一个i的副本。<u>但是根据作用域的工作原理，实际情况是尽管循环中的五个函数是在各个迭代中分别定义的，但是它们都被封闭在一个共享的全局作用域中，因此实际上只有一个i。</u>

解决:

IIFE解决方案:
```javascript
//正确代码
for (var i=1; i<=5; i++) {
  (function() {
    var j = i;
    setTimeout(function timer() {
      console.log(j);
    }, j*1000)
  })()
}
//改进
for (var i=1; i<=5; i++) {
  (function() {
    setTimeout(function timer() {
      console.log(i);
    }, i*1000)
  })(i);
}
```

使用let代替IIFE
使用let声明来代替IIFE创建新的作用域
```javascript
for (var i=1; i<=5; i++) {
  let j=i; //闭包的块作用域
  setTimeout(function timer() {
    console.log(j);
  }, j*1000);
}
```



##### 模块
通过在模块实例的内部保留对公共API对象的内部引用，可以从内部对模块实例进行修改，包括添加或删除方法和属性，以及修改它们的值。
* 接收参数
* 命名将要作为公共API返回的对象

```javascript
var foo = (function CoolModule(id) {
  function change() {
    //修改公共API
    publicAPI.identify = identify2;
  }
  
  function identify1() {
    console.log(id);
  }
  
  function identify2() {
    console.log(id.toUpperCase());
  }
  
  var publicAPI = {
    change: change,
    identify: identify1
  };
  
  return publicAPI;
})('foo module');

foo.identify(); //'foo module'
foo.change();
foo.identify(); //'FOO MODULE'
```

其他后续内容, 笔记中记录的比较详细, 面试就说到这里吧


### this

#### 介绍
* 执行上下文的一个属性
* 是在运行时进行绑定的,和函数声明的位置无关.

#### 使用原因
* 显式传递上下文对象会让代码越来越混乱
* 调用函数时候不用传递上下文对象, this隐式传递一个对象引用,API简洁易于复用

#### 绑定规则
> 你不知道的js
* 默认绑定
  * 非严格模式下,函数直接调用,this绑定到window/globalThis; 严格模式下,this是undefined
* 隐式绑定
  * 调用位置上是否有上下文对象或者说是否被某个对象拥有或包含.(注意: 函数不属于对象,从作用域上来解释)
  * 规则:
    * 当引用函数有上下文对象时,隐式规则会把this绑定到上下文对象
    * <span style="color:red">对象属性引用链中只有最后一层在调用位置中起作用</span>
  * 存在的问题: 
    * 隐式丢失: 丢失绑定对象,会应用默认绑定.
	  * 隐式丢失 几种情况
	    * 将`对象.方法`赋值给变量,调用这个变量
	    * 参数传递, 将函数是通过参数传递进函数
	    * 把函数传入语言内置的函数
	  * 隐式绑定存在问题
	    * 隐式丢失中,无法控制回调函数的执行方式,也就无法控制调用位置以得到期望的值
	    * 如何解决？ 固定this

* 显式绑定
  * 不想在对象内部包含函数引用，而想在某个对象上强制调用函数。  使用call/apply/bind
  * 如果call/apply第一个参数传入原始值？？
    * 装箱  基本类型转成它的对象形式
  * 显示绑定存在的问题（理解）
    * 虽然call和apply可以在任意地方调用,但是它是直接进行调用送的.设想,如果在某个第三方库中,其异步的回调函数需要改变this,如果这个时候使用call/apply会立即调用并更改this,异步在不知道完成与否的情况下,异步回调直接运行了.
* new绑定

使用new来调用函数,或者说发生构造函数调用时,会自动执行下面的操作:
1. 内存中新建一个对象
2. 将构造函数的原型prototype赋值给新建对象的隐式原型[[prototype]]指针
3. 执行函数,并将函数的this更改为这个对象
4. 如果函数返回非空对象,则返回;否则,返回新建对象.
```js
//隐式绑定丢失
//把函数传如语言内置的函数
function foo() {
  console.log(this.a)
}

var obj = {
  a:2,
  foo: foo
}

var a = 'oops, global!'
setTimeout(obj.foo, 100); //'oops, global'
//js内置的setTimeout函数和下面的伪代码类似
functionsetTimeout(fn, delay) {
  //delay
  fn()
}
```

```js
// new绑定

const newFn = () => {
	let obj = {}
	let fn = arguments[0]
	let args = [].slice.call(arguments, 1)
	obj.__proto__ = fn.prototype
	let res = fn.call(obj, args)
	return typeof res === 'object' ? res : obj
}



function newOperator() {
  let obj = {};
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype; 
  //let obj = Object.create(Constructor.prototype);
  let result = Constructor.apply(obj, arguments);
  return typeof result === 'object' ? result : obj;
}

function createObject(ctor) {
  let obj = Object.create(null);
  Object.setPropertyOf(obj, ctor.prototype);
  // 上面的两步可以合并为一步: obj = Object.create(ctor.prototype)
  
  const res = ctor.apply(obj, [].slice.call(arguments, 1));
  
  return typeof(res) === 'object' ? res : obj;
}
```

### this在不同场景下的取值?

- 常规情况下, 函数中的this取决于执行函数的方式
  - fn(): 直接调用  ==> **this是?**  window
  - new fn(): new调用 ==> **this是?**  新建的对象
  - obj.fn(): 通过对象调用 ==> **this是?**  obj
  - fn.call/apply(obj): 通过函数对象的call/apply来调用 ==> **this是?**  obj

- 特殊情况:
  - bind(obj)返回的函数  ==> **this是?**  obj
  - 箭头函数 ==> **this是?**  外部作用域的this
  - 回调函数
    - 定时器/ajax/promise/数组遍历相关方法回调  ==> **this是?**  window 或 当前的事件源
    - vue控制的回调函数  ==> **this是?**  组件的实例
    - React控制的生命周期回调, 事件监听回调  ==>  **this是?**  组件对象 / undefined

- 如何控制函数的this?  
  - 利用函数的bind()
  - 利用箭头函数
  - 也可以用外部保存了this的变量



### 原型链
#### 是什么
由相互关联的原型组成的<span style="color: blue">链状结构</span>

#### 原型对象
##### 定义
每一个JavaScript对象(null除外)在创建的时候就会<u>与之关联另一个对象</u>，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

#### 原型链查找规则概述
- 当我们要获取一个对象的属性时,浏览器会先在对象自身中寻找
- 如果有则直接使用,如果没有则去对象的原型中寻找
- 找到了则使用,没有则去原型的原型里去寻找.以此类推, 直到找到Object的原型,如果依然没有找到则返回undefined
- Object的原型是所有对象的原型,它的原型没有原型

#### 原型链图例
![原型与原型链结构图.png](https://i.loli.net/2021/03/31/mAWeRV3vnhjDM5B.png)








### 继承

[[JS 继承和原型链#继承]]





### 面向对象的3特征
- 封装:
  - 将可复用的代码用一个结构包装起来, 后面可以反复使用
  - js的哪些语法体现了封装性: 函数 ==> 对象 ==> 模块 ==> 组件 ==> 库
  - 封装都要有个特点: 不需要外部看到的必须隐藏起来, 只向外部暴露想让外部使用的功能或数据
- 继承
  - JS中的6种继承方式
- 多态: 多种形态
  - 理解
    - 声明时指定一个类型对象, 并调用其方法,
    - 实际使用时可以指定任意子类型对象, 运行的方法就是当前子类型对象的方法
  - JS中有多态:(去看class中的笔记)
    - 由于JS是弱类型语言, 在声明时都不用指定类型
    - 在使用时可以指定任意类型的数据 ==> 这已经就是多态的体现了





### 防抖节流原理及应用

#### 使用背景
如果是复杂的回调函数或是 ajax 请求呢? 假设 1 秒触发了 60 次，每个回调就必须在 1000 / 60 = 16.67ms 内完成，否则就会有卡顿出现。出现防抖和节流两种方案.

(高频操作导致一定时间内不能实现函数的全部功能,进而导致卡顿)

#### 应用场景
**防抖**
防抖是指在一定时间内，如果连续触发同一事件，只会执行一次事件处理函数，并且是在最后一次事件触发之后一段时间开始执行。比如下拉加载更多，在用户频繁快速滚动的情况下，只有在用户停止滚动操作，并且停留一段时间后（如300毫秒），才会请求新数据。
使用场景:
* 输入框输入并触发搜索功能时；
* 窗口大小调整，调整结束后才更新布局
* 按钮多次点击，仅仅触发一次事件。

**节流**
节流是指在一定时间内，只能触发一次事件处理函数。比如鼠标连续滚动页面时，如果不加以控制，会造成页面不停的滚动，甚至卡顿。通过节流函数控制，能够让滚动事件的触发变得更加平滑。在这种情况下，事件处理函数会在指定时间内定时执行，将事件的触发频率限制为每隔一定时间响应一次，保证页面滚动的流畅性和减轻浏览器资源消耗和溢出。
使用场景:
* 鼠标不停地拖拽某个元素时；
* 页面滚动加载数据的情况下，滚动时数据量过大；
* 拖动元素变形或改变位置等，触发过程操作不发生过为间隔性的很小的操作。


#### 防抖原理
* 在事件<span style="color:red">触发 n 秒后才执行</span>;
* 如果你在一个事件触发的 n 秒内又触发了这个事件，以新的事件的时间为准，n 秒后才执行.
```javascript
function debounce(fn, wait) {
  let timeId
  return function() {
    clearTimeout(timeId)
    timeId = setTimeout(fn, wait)
  }
}

//2 version  修复this 与 事件对象传递
function debounce2(fn, wait) {
  let timeId
  return function() {
    if (timeId) clearTimeout(timeId)
    let thisArg = this
    let args = arguments
    timeId = setTimeout(() => fn.apply(thisArg, args), wait)
  }
}

//3 version 立即执行  
function debounce3(fn, wait, immediate) {
  let timeId
  return function() {
    let thisArg = this, args = arguments
    
    if (timeId) clearTimeout(timeId)
   	
    if (immediate) {  //这个立方总是理解不好
      let callNow = !timeId
      timeId = setTimeout(() => {timeId = null} , wait)
      if (callNow) fn.apply(thisArg, args)
    } else {
      timeId = setTimeout(() => {fn.apply(thisArg, args)}, wait)
    }
  }
}


//其他
/* 
实现函数防抖的函数
*/
function debounce(callback, delay) {
  return function (event) {
    console.log('debounce 事件...')
    
    // 清除待执行的定时器任务
    if (callback.timeoutId) {
      clearTimeout(callback.timeoutId)
    }
    // 每隔delay的时间, 启动一个新的延迟定时器, 去准备调用callback
    callback.timeoutId = setTimeout(() => {
      callback.call(this, event)
      // 如果定时器回调执行了, 删除标记
      delete callback.timeoutId
    }, delay)
  }
}



//使用案例
<span>节流input表单:</span><input id="inputNode" />
    
let inputNode = document.getElementById('inputNode');
function ajax(content){console.log('ajax request'+content)};

function debounce(callback,delay){
    //n秒内又触发,则会重新计时
    if(callback.timeoutId){ 
        clearTimeout(callback.timeoutId)
    }
    callback.timeoutId = setTimeout(()=>{
        callback(event);
        //callback.call(this,event)
        delete callback.timeoutId;
    },delay);  
}

let debounceAjax = debounce(ajax, 3000);
inputNode.addEventListener('keyup',function(e){
    debounceAjax(e.target.value)
})
```



#### 节流原理
<span style="color:red">每隔一段时间只执行一次事件</span>。
节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。
```js
//时间戳
function throttle(fn, wait) {
  let ctx, args;
  let start = 0
  return function() {
    let now = +new Date()
    ctx = this
    args = arguments
    
    if (now - start > wait) {
      fn.apply(ctx, args)
      start = now
    }
  }
}
//定时器
function throttle(fn, wait) {
  let timeId
  return function() {
    let thisArg = this
    let args = arguments
    
    if (!timeId) {
      timeId = setTimeout(() => {
        timeId = null
        fn.apply(thisArg, args)
      }, wait)
    }
  }
}

//比较两个方法：

//1. 第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
//2. 第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件

//时间戳 + 定时器方案


/* 
实现函数节流的函数
*/

function throttle(callback, delay) {
  let start = 0 // 必须保存第一次点击立即调用
  return function (event) { // 事件回调函数
      // this是发生事件的dom元素
    console.log('throttle 事件')
    const current = Date.now()
    if (current - start > delay) { // 从第2次点击开始, 需要间隔时间超过delay
      callback.call(this, event)
      // 将当前时间指定为start, ==> 为后面的比较做准备
      start = current
    }
  }
}

<span>节流input表单:</span><input id="inputNode" />
    
let inputNode = document.getElementById('inputNode');
function ajax(content){console.log('ajax request'+content)}

function throttle(callback,delay){
    let start = 0;
    return function(event){
        let current = Date.now();
        if(current-start>delay){
            callback.call(this,event);  //用不用call, 不用
            start = current;
        }
    }
}

let throttleAjax = throttle(ajax,2000);
inputNode.addEventListener('keyup', function(e){
    throttleAjax(e.target.value)
})

```



### 白屏时间
白屏时间是指浏览器从输入网址，到浏览器开始显示内容的时间。

Performance 接口可以获取到当前页面中与性能相关的信息,该类型的对象可以通过调用只读属性 Window.performance 来获得。

performance.timing.navigationStart: PerformanceTiming.navigationStart 是一个返回代表一个时刻的 unsigned long long 型只读属性，为紧接着在相同的浏览环境下卸载前一个文档结束之时的 Unix毫秒时间戳。如果没有上一个文档，则它的值相当于 PerformanceTiming.fetchStart。

所以将以下脚本放在 `</head>` 前面就能获取白屏时间。

```html
<script>
	new Date() - performance.timing.navigationStart
</script>
```



### 模块化

ES6模块的暴露和引入语法

暴露: 分别暴露, 对象暴露, 默认暴露

```javascript
// 分别暴露
export const a = 'a'
export const b = 'b'

//暴露对象
const c = 'c'
const d = 'd'
export {
	c,
  d as dd
}

//默认暴露
export default function foo() {}

```

引入: 通用引入; 解构赋值形式引入; 简便导入

```javascript
import * as m1from './m1'

//解构赋值形式引入
import {default as aaa} from 'xx.js'

//简便导入
import _ from 'lodash'
```







### 异步

#### 事件循环

##### 事件循环
> https://github.com/kvchen95/blog/blob/master/docs/js/event-loop.md

**为什么?**
JavaScript 是单线程的，但它需要处理很多异步操作（比如加载图片、发送网络请求等）。如果让 JS 一直等待这些异步操作完成，就会导致程序卡住，无法继续执行其他任务。为了解决这个问题，JS 把这些异步操作交给宿主环境（如浏览器或 Node.js）去处理，自己则继续执行后面的代码。等到异步操作完成后，宿主环境会通知 JS，JS 再回过头来处理这些异步任务的后续逻辑。

但是，任务一多，JS 就需要知道这些任务的执行顺序。于是，**任务队列** 就诞生了。任务队列就像一个**待办事项列表**，JS 会按照队列中的顺序依次处理任务。

**是什么**?
>**事件循环（EventLoop）** 就是用来实现这套任务调度机制的。它不断地从任务队列中取出任务并执行，确保 JS 能够高效地处理同步任务和异步任务。

在 JS 中，异步任务分为两种：
1. **浏览器处理的任务**（如 `setTimeout`、图片加载）：这些任务是由宿主环境处理的，完成后会被放入 **宏任务队列**。
2. **JS 自身的异步任务**（如 `Promise`、`async/await`）：这些任务是 JS 语言本身提供的，完成后会被放入 **微任务队列**。
为了确保任务的有序执行，JS 设计了一套规则：
- **微任务队列** 的优先级高于 **宏任务队列**。
- 每当一个宏任务执行完毕后，JS 会立即检查并执行所有微任务，直到微任务队列为空，才会继续执行下一个宏任务。


**事件循环的How?**

1. 执行全局同步代码. 也就是变量声明和赋值, 函数定义,等等.
2. 将异步任务放入对应的队列
	2.1 在执行全局同步代码的过程中，如果遇到异步任务（如 `setTimeout`、`Promise`），JS 会根据任务类型将其放入相应的队列：
	2.2 **宏任务队列**：存放由宿主环境处理的异步任务，如 `setTimeout`、`setInterval`、DOM 事件、AJAX 请求等。
	2.3 **微任务队列**：存放 JS 自身的异步任务，如 `Promise` 的 `then` 回调、`async/await`、`MutationObserver` 等。

3. 全局同步代码执行完毕. 此时事件循环开始工作,宏任务队列和微任务队列中可能已经又任务了.

4. **执行宏任务**：EventLoop 从宏任务队列中取出一个任务执行。 
	1. 这个任务可能是: 初始的脚本代码
	2. 后续的`setTimeout`, `setInterval`回调
    
5.  **执行所有微任务**：在当前宏任务执行过程中，如果产生微任务（如 Promise 的 `then` 回调），这些微任务会被放入微任务队列。在当前宏任务执行完毕后，EventLoop 会立即执行所有微任务，直到微任务队列为空。
    
- **渲染更新**：在浏览器环境中，执行完微任务后，可能会进行页面的渲染更新。
    
- **重复循环**：EventLoop 继续从宏任务队列中取出下一个任务，重复上述过程。


#### 实例
![[Pasted image 20241009134747.png]]
```js
setTimeout(() => {
    console.log("0")
  }, 0)
  new Promise((resolve,reject)=>{
    console.log("1")
    resolve()
  }).then(()=>{        
    console.log("2")
    new Promise((resolve,reject)=>{
      console.log("3")
      resolve()
    }).then(()=>{      
      console.log("4")
    }).then(()=>{       
      console.log("5")
    })
  }).then(()=>{  
    console.log("6")
  })

  new Promise((resolve,reject)=>{
    console.log("7")
    resolve()
  }).then(()=>{         
    console.log("8")
  })
```


#### 异步加载JS脚本的方法
>https://github.com/Easay/issuesSets/issues/122

**方法一：给script标签添加defer属性**
添加了defer属性，js脚本会异步加载，但会等到html解析完成后，在window.onload事件之前执行。
添加了defer属性的js文件执行的顺序和在文档中定义的顺序一样。
```html
<script src="../your_file.js" defer></script>
```
**方法二：给script标签添加async属性**
async属性会让js并行下载，但是js文件下载完成之后立刻执行无论html是否解析完毕
添加了async属性的js文件执行顺序不能保证
```js
<script src="../your_file.js" async></script>
```
**方法三：动态添加script标签**
和img标签不一样，设置了script的src属性并不会开始下载，而是要添加到文档中Js文件才会开始下载
```js
let script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'your_file.js';
// 只有添加到html文件中才会开始下载
document.body.append(script);
```
问题⚠️：异步加载script的目的是不对html的渲染造成阻塞，如果脚本中有操作dom的行为，则不能进行。但动态添加script标签需要获取body，所以该script代码段放的位置不能在head标签中，至少要放到body标签内。

**方法四：使用xhr脚本注入**
会受到同源策略的限制
```js
let xhr = new XMLHttpRequest()
xhr.open('get', './01.extra.js', true)
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = './01.extra.js';
            script.text = xhr.responseText;
            console.log(xhr.responseText)
            // 只有添加到html文件中才会开始下载
            document.body.append(script);
        }
    }
}
xhr.send(null);

```


#### 限制并发数（异步并发控制）?
>https://github.com/Easay/issuesSets/issues/143

```js
/**
 *
 * @param { 并发限制 } poolLimit
 * @param { promise 数组 } array
 * @param { callback } iteratorFn
 */
function asyncPool(poolLimit, array, iteratorFn) {
    let i = 0
    const ret = []
    const executing = []
    const enqueue = function () {
        // ① 边界条件，array 为空或者 promise 都已达到 resolve 状态
        if (i === array.length) {
            return Promise.resolve()
        }
        const item = array[i++]

        // ② 生成一个 promise 实例，并在 then 方法中的 onFullfilled 函数里返回实际要执行的 promise，
        const p = Promise.resolve().then(() => iteratorFn(item, array))
        ret.push(p)

        // ④ 将执行完毕的 promise 移除
        const e = p.then(() => executing.splice(executing.indexOf(e), 1))
        // ③ 将正在执行的 promise 插入 executing 数组
        executing.push(e)
        // console.log(executing)
        let r = Promise.resolve()
        // ⑥ 如果正在执行的 promise 数量达到了并发限制，则通过 Promise.race 触发新的 promise 执行
        if (executing.length >= poolLimit) {
            r = Promise.race(executing)
            // console.log("r:")
            // console.log(r)
        }

        // ⑤ 递归执行 enqueue，直到满足 ①
        return r.then(() => enqueue())
    }
    return enqueue().then(() => Promise.all(ret))
}

const timeout = i => new Promise(resolve => setTimeout(() => {
    console.log(i)
    resolve(i)
}, i));
asyncPool(2,[1000,5000,3000,2000],timeout).then(results => {
    console.log(results)
})
```





### Promise

#### 概述

> Promise 是异步编程的一种解决方案，比传统的回调函数和事件更好。
> 所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。类比为订阅演唱会的时间地址.

#### 状态
Promise有三种状态，分别是：Pending（进行中）， Fulfilled(Resolved已完成)，Rejected (已失败)。
Promise从Pending状态开始，如果成功就转到成功态，并执行resolve回调函数；如果失败就转到失败状态并执行reject回调函数。

#### 优点
- 指定回调函数的时机更加灵活
	- 在异步操作启动前
	- 在异步操作完成后
- promise链式调用解决嵌套回调的回调地狱问题 
```js
// 异步操作启动前执行操作
let promise = doSomething()
promise.then(successCallback, failureCallback)

// 异步操作完成后指定回调
let promise = doSomething()
setTimeout(() => {(promise.then(successCallback, failureCallback)), 3000)
```


#### promise.prototype.then()返回值
Promise.then()方法返回一个新的 Promise 对象，它的状态和值取决于 then 中的回调函数的执行结果。具体来说，有以下几种情况：
* 返回一个Promise,其值和状态决定了返回Promise的值和状态
* 返回一个错误, 返回一个失败的Promise,其值为返回的错误
* 其它值 返回一个成功的Promise,其值为其它值



#### Promise-API实现

| 静态方法                         | 作用                                                                                                                                                         | 其他  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| Promise.all(iterable)        | 传入一个可迭代对象,返回一个promise<br/>* 当入参中所有的promise成功时(包括空迭代对象),返回的Promise才会成功,其值是一个成功状态值组成的数组.<br>> 当入参中由任意一个promise失败,返回的Promise才会失败, 其值是第一个失败的promise的值.         |     |
| Promise.allSettled(iterable) | 此静态方法接收一个包含promises的可迭代对象作为入参并返回单个Promise. 当所有入参的promise状态settle(包含空的迭代对象)之后,返回的promise才会解决(fullfill),并带有一个描述每个promise结果的对象数组.                             |     |
| Promise.any()                | 接收一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)可迭代对象，只要其中的一个 `promise` 成功，就返回那个已经成功的 `promise` 。 |     |
| Promise.race                 | 返回一个Promise,一旦迭代器中的某个promise成功或拒绝,返回的promise就会解决或拒绝.                                                                                                       |     |





##### Promise.all

##### 概述
all方法接受一个或多个promsie（以数组方式传递），返回一个新promise，该promise状态取决于传入的参数中的所有promsie的状态：
当所有promise都完成时，返回的promise完成，其最终值为由所有完成promsie的最终值组成的数组；
当某一promise被拒绝时，则返回的promise被拒绝，其拒绝原因为第一个被拒绝promise的拒绝原因；

##### 代码实现
```javascript
//20220724
Promise.prototype.all = function (promises) {
	return new Promise((resolve, reject) => {
		// 判断是否为可迭代对象
		if (!Array.isArray(promises)) {
			throw new TypeError('promises must be an iterable object')
		}

		let resultArr = []
		promises.forEach((promise, idx) => {
			promise.then(
				value => {
					resultArr[idx] = value
					idx === (promises.length - 1) && resolve(resultArr)
				 },
				error => { 
					reject(error)
				}
			)
		})
	})
}
```

##### 案例
```js
function p1(){
    var promise1 = new Promise(function(resolve,reject){
        console.log("p1的第一条输出语句");
        console.log("p1的第二条输出语句");
        resolve("p1完成");
    })
    return promise1;
}

function p2(){
    var promise2 = new Promise(function(resolve,reject){
        console.log("p2的第一条输出语句");
        setTimeout(()=>{console.log("p2的第二条输出语句");resolve("p2完成")},2000);

    })
    return promise2;
}

function p3(){
    var promise3 = new Promise(function(resolve,reject){
        console.log("p3的第一条输出语句");
        console.log("p3的第二条输出语句");
        resolve("p3完成")
    });
    return  promise3;
}

Promise.all([p1(),p2(),p3()]).then(function(data){
    console.log(data);
})


//输出结果
p1的第一条输出语句
p1的第二条输出语句
p2的第一条输出语句
p3的第一条输出语句
p3的第二条输出语句
p2的第二条输出语句
['p1完成','p2完成','p3完成']
```

##### Promise.allSettled

```javascript
function allSettled(promises) {
  if (promises.length === 0) return Promise.resolve([])
  
  const _promises = promises.map(
    item => item instanceof Promise ? item : Promise.resolve(item)
    )
  
  return new Promise((resolve, reject) => {
    const result = []
    let unSettledPromiseCount = _promises.length
    
    _promises.forEach((promise, index) => {
      promise.then((value) => {
        result[index] = {
          status: 'fulfilled',
          value
        }
        
        unSettledPromiseCount -= 1
        // resolve after all are settled
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      }, (reason) => {
        result[index] = {
          status: 'rejected',
          reason
        }
        
        unSettledPromiseCount -= 1
        // resolve after all are settled
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      })
    })
  })
}
```



##### Promise.any

```javascript
function any(promises) {
  // return a Promise, which resolves as soon as one promise resolves
  return new Promise((resolve, reject) => {
    let isFulfilled = false
    const errors = []
    let errorCount = 0
    promises.forEach((promise, index) => promise.then(
      (data) => {
      if (!isFulfilled) {
        resolve(data)
        isFulfilled = true
      }
    }, 
      (error) => {
      errors[index] = error
      errorCount += 1

      if (errorCount === promises.length) {
        reject(new AggregateError('none resolved', errors))
      }
    }))
  })
}

//https://github.com/azl397985856/fe-interview/issues/125
Promise.any = ps => new Promise((resolve, reject) => {
  ps.forEach((p, idx) => p.then(resolve)).catch(err => idx === (ps.length - 1) && reject(new Aggregate('none resolved')))
})
```



##### Promise.race

```javascript
Promise.race2 = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => Promise.resolve(promise).then(resolve, reject))
  })
}
```


#### Promise面试题
>https://github.com/Easay/issuesSets/issues/77


##### 如何改变Promise的状态

```js
//3种方法
1.resolve() 状态由pending变为fulfilled
2.reject()  状态由pending变为rejected
3.抛出异常   状态由pending变为rejected
```



##### Promise状态改变和指定回调函数(then)谁先谁后

```js
1.都有可能. 正常时先指定回调再改变状态
2.先改变状态再指定回调的方法//同步
 2.1 直接调用resolve()/reject()
 2.2 延迟更长时间才调用then()
    let p = new Promise((resolve, reject)=>{
        setTimeout(()=>{resolve('ok')},1000);
    })
    setTimeout(()=>{p.then(value=>{console.log(value)})},3000)
 
3.先指定回调(先调用then方法)再改变状态//执行器种直接异步调用resolve()/reject()
   let p = new Promise((resolve,reject) => {
        setTimeout(function(){
            resolve('ok')
        },1000)
     })
     p.then(value => {
         console.log(value);
     })

4.什么时候得到数据?
4.1 如果先指定的回调函数,当状态发生改变时,调用回调函数,得到数据
4.2 如果先改变的状态,在指定回调函数时,回调函数就会调用,得到数据
```



##### Promise.then()返回新的Promise的结果状态由什么决定

```js
//then方法的返回结果是一个promise对象
(1)	简单表达: 由then()指定的回调函数执行的结果决定(执行结果就是函数的返回值)
(2)	详细表达:                                    
①	如果抛出异常, 新promise变为rejected, reason为抛出的异常/throw抛出的值
②	如果返回的是非promise的任意值, 新promise变为fulfilled(resolved) 值为返回值
③	如果返回的是另一个新promise, 此promise的结果就会成为新promise的结果,其值也会为then方法的返回值.
```



##### Promise异常穿透

```js
(1)	当使用promise的then链式调用时, 可以在最后指定失败的回调 
(2)	前面任何操作出了异常, 都会传到最后失败的回调中处理
```



##### Promise中断链条

```js
//返回一个pending状态的promise对象  return new Promise(()=>{})
//传一个错误的promise对象值,会被catch捕获,如果没有catch方法会报错
```


##### Promise.all如何将所有promise状态都保存下来
>https://github.com/Easay/issuesSets/issues/141

可以通过将所有primose状态都以resolved结束，即使内部请求挂掉被catch捕获到错误，但最后返回一个具体的值标识错误态即可。
```js
// ?
async function initAll() {
	const [
			loginComphasInited,
			activityConfig,
			styleData,
	] = await Promise.all([
			this.getLoginComp(),
			this.getActivityConfig(),
			this.getMarketingConfig(),
	])
	const { hasActivityConfig, hasEnded } = activityConfig
	if(!loginComphasInited || !hasActivityConfig) {
			this.handleError()
			return
	}
	if(hasEnded) {
			setPageSatus()
	}
}


async function activityConfig(){
	try{
		const { contracts, hasEnded } = await this.$apis.post()
		this.contracts = contracts || []
		return {
				hasActivityConfig: true,
				hasEnded,
		}
	}catch(err){
			return {
					hasActivityConfig: false,
			}
	}
}
```


##### 打印顺序
> https://juejin.cn/post/7055460626923012104
> https://juejin.cn/post/6945319439772434469


```js
setTimeout(() => {
    console.log("0")
  }, 0)
  
new Promise((resolve,reject)=>{
    console.log("1")
    resolve()
  }).then(()=>{        
    console.log("2")
    new Promise((resolve,reject)=>{
      console.log("3")
      resolve()
    }).then(()=>{      
      console.log("4")
    }).then(()=>{       
      console.log("5")
    })
  }).then(()=>{  
    console.log("6")
  })

new Promise((resolve,reject)=>{
    console.log("7")
    resolve()
  }).then(()=>{         
    console.log("8")
  })
```


##### 如果100个请求,使用Promise怎么控制并发  ??
>https://juejin.cn/post/7219961144584552504

题目
```js
// sendRequest(requestList:, limits, callback): void
sendRequest(
    [
        () => request('1'),
        () => request('2'),
        () => request('3'),
        () => request('4')
    ],
    3, // 并发数
    (res) => {
        console.log(res)
    }
)

// 其中 request 可以是：
function request(url, time = 1) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('请求结束：' + url);
            if (Math.random() > 0.5) {
                resolve('成功')
            } else {
                reject('错误')
            }
        }, time * 1e3)
    })
}
在格式化后的代码中，我们将每个参数放在新的一行，并使用适当的缩进来提高可读性。此外，我们还添加了注释来说明每个参数的作用。
```

概念
并发(Concurrency):同一时间段内多个任务都在进行,但不一定同时进行。每个任务会互相切换执行,由操作系统根据一定的调度算法决定哪个任务该执行。
并发控制: 意思是多个并发的任务，一旦有任务完成，就立刻开启下一个任务
切片控制: 将并发任务切片的分配出来，比如10个任务，切成2个片，每片有5个任务，当前一片的任务执行完毕，再开始下一个片的任务，这样明显效率没并发控制那么高了

并行(Parallelism):多个任务同时进行,真正意义上的同时进行。一般需要多核CPU才能实现并行。
```js
// 两个任务依次执行,互相切换
console.log('Start task 1');
setTimeout(() => console.log('Task 1 finished'), 1000);

console.log('Start task 2'); 
setTimeout(() => console.log('Task 2 finished'), 1000);
```
在多核CPU上,并行的例子可能输出:
```js
并发和并行是两个概念:

并发(Concurrency):同一时间段内多个任务都在进行,但不一定同时进行。每个任务会互相切换执行,由操作系统根据一定的调度算法决定哪个任务该执行。

并行(Parallelism):多个任务同时进行,真正意义上的同时进行。一般需要多核CPU才能实现并行。

例子:

并发(Concurrency)的例子:
```js
// 两个任务依次执行,互相切换
console.log('Start task 1');
setTimeout(() => console.log('Task 1 finished'), 1000);

console.log('Start task 2'); 
setTimeout(() => console.log('Task 2 finished'), 1000);
```

并行(Parallelism)的例子,需要在多核CPU上执行:
```js
// 两个任务同时执行
console.log('Start task 1');
setTimeout(() => console.log('Task 1 finished'), 1000);

console.log('Start task 2');
setTimeout(() => console.log('Task 2 finished'), 1000);
```

在单核CPU上,上面的两个例子的输出都是:

```
Start task 1 
Start task 2
Task 1 finished
Task 2 finished
```

但在多核CPU上,并行的例子可能输出:
```js
Start task 1 
Start task 2 
Task 1 finished
Task 2 finished 
```
或
```js
Start task 1
Task 1 finished
Start task 2
Task 2 finished
```

这是因为两个任务可以同时执行,不需要互相切换.

```text
首先执行能执行的并发任务，根据并发的概念，每个任务执行完毕后，捞起下一个要执行的任务。

将关键步骤拆分出合适的函数来组织代码

1.  循环去启动能执行的任务
    
2.  取出任务并且推到执行器执行
    
3.  执行器内更新当前的并发数，并且触发捞起任务
    
4.  捞起任务里面可以触发最终的回调函数和调起执行器继续执行任务
```

```js
function sendRequest(requestList, limits, callback) {
  const promises = requestList; // 取得请求list
  const concurrentNum = Math.min(limits, requestList.length); // 得到开始时，能执行的并发数
  let concurrentCount = 0; // 当前并发数 

  // 第一次先跑起可以并发的任务
  const runTaskNeeded = () => {
    let i = 0;
    while (i < concurrentNum) {
      i++;
      runTask();
    }
  };

  // 取出任务并且执行任务
  const runTask = () => {
    const task = promises.shift();
    task && runner(task);
  };

  // 执行器
  // 执行任务，同时更新当前并发数
  const runner = async (task) => {
    try {
      concurrentCount++;
      await task();
    } catch (error) {
    } finally {
      // 并发数--
      concurrentCount--;
      // 捞起下一个任务
      picker();
    }
  };

  // 捞起下一个任务
  const picker = () => {
    if (concurrentCount < limits && promises.length > 0) {
      // 任务队列里还有任务并且此时还有剩余并发数的时候 执行
      // 继续执行任务
      runTask();
      // 队列为空的时候，并且请求池清空了，就可以执行最后的回调函数了
    } else if (promises.length == 0 && concurrentCount == 0) {
      // 执行结束
      callback && callback();
    }
  };

  // 入口执行
  runTaskNeeded();
}
```

另一种实现
核心代码是判断是当你 【有任务执行完成】 ，再去判断是否有剩余还有任务可执行。可以先维护一个pool（代表当前执行的任务），利用await Promise.race这个pool，不就知道是否有任务执行完毕了吗？
```js
async function sendRequest(requestList, limits, callback) {
  // 维护一个promise队列
  const promises = [];
  // 当前的并发池,用Set结构方便删除
  const pool = new Set(); // set也是Iterable<any>[]类型，因此可以放入到race里

  // 开始并发执行所有的任务
  for (let request of requestList) {
    // 开始执行前，先await 判断 当前的并发任务是否超过限制
    if (pool.size >= limits) {
      // 这里因为没有try catch ，所以要捕获一下错误，不然影响下面微任务的执行
      await Promise.race(pool)
        .catch((err) => err);
    }

    const promise = request(); // 拿到promise
    // 删除请求结束后，从pool里面移除
    const cb = () => {
      pool.delete(promise);
    };
    // 注册下then的任务
    promise.then(cb, cb);
    pool.add(promise);
    promises.push(promise);
  }

  // 等待所有promise完成，调用回调函数
  Promise.allSettled(promises).then(callback, callback);
}
```



### async/await
#### 概述
* `async`用来描述`async`函数的.函数的返回值为promise对象.
* promise对象的结果和状态由`async`函数的返回值决定. 返回规则和then方法回调返回结果是一样的.
  * 如果返回结果是非promise类型的值,则返回值是成功的promise
  * 抛出一个错误, 函数的状态为失败状态rejected, 错误值为函数返回值.
  * 如果返回结果是promise类型的值, 则promise的状态和值决定了async这个promise的状态和返回
* await右侧的表达式一般为promise对象, 但也可以是其它的值
    * 如果表达式是promise对象, await返回的是promise成功的值.如果是失败的值,await会把promise的异常抛出, 我们可以使用try..catch捕获错误.
    * 如果表达式是其它值, 直接将此值作为await的返回值
* await...后面的代码相当于放到成功的回调中


#### async/await与promise的关系
- async/await是消灭异步回调的最终方法
- 简化promise对象的使用, 不用再使用then/catch来指定回调函数. 但和Promise并不互斥
- 执行async函数, 返回promise对象,  
  - await相当于promise的then
  - try...catch可捕获异常, 相当于promise的catch







### js的垃圾回收机制
>https://github.com/Easay/issuesSets/issues/91

#### 背景
JS引擎中对变量的存储主要有两种位置：栈内存和堆内存，栈内存存储基本数据类型以及引用数据的内存地址，堆内存储引用类型的数据。

#### 堆内存回收
V8的堆内存回收分为新生代内存和老生代内存，新生代内存是临时分配的内存，存在时间短，老生代内存存在时间长。

**新生代内存回收机制**
新生代内存容量小，64位系统下仅有32M。新生代内存分为From、To两部分，进行垃圾回收时，先扫描From，将非存活对象回收，将存活对象顺序复制到To中，之后调换From/To，等待下一次回收。
**老生代内存回收机制**
晋升：如果新生代的变量经过多次回收依然存在，那么就会被放入老生代内存中；
标记清除：老生代内存会先遍历所有对象并打上标记，然后对正在使用或被强引用的对象取消标记，回收被标记的对象；
整理内存碎片：把对象挪到内存的一端




#### 常见的GC算法
引用计数
使用引用计数器，当引用数字为0时立即回收。优点是：发现垃圾立即回收；缺点是：无法回收循环引用的对象。

标记清除
遍历所有对象，标记活动对象；再次遍历所有对象，清除没有标记的对象。将回收的空间加到空闲链表中，方便后面的程序申请使用。

标记整理
在标记和清除之间，添加了内存空间的整理。通过移动对象位置使得空间连续。





## 手写代码

### 来源
* https://bigfrontend.dev/zh/problem

### 深拷贝

#### 是什么
深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且**修改新对象不会影响原对象**。

浅拷贝: 当我们把一个对象赋值给一个新的变量时，赋的其实是该对象的在==栈==中的地址，而不是堆中的数据。两个对象指向的是同一个存储空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的。

#### 浅拷贝
和深拷贝对应的浅拷贝,JS中的相关方法有:
* `[].slice(0)`
* `[].concat(arr)`
* 展开运算符
* Object.assign(obj1,obj2)

#### 深拷贝实现方式
* structuredClone
- JSON.parse(JSON.stringfy(obj)) 
  -  ===> 问题: 方法/函数会丢失(undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时)
  -  ===> 问题2: 循环引用会出错(死循环)
- 递归遍历
  - 如果是基本类型与函数直接返回, 函数就不会丢失也不会拷贝
  - 如果是对象/数组创建拷贝对象/数组
  - 问题: 循环引用会出错的问题(死循环)
- 使用Map缓存拷贝对象
  - 如果发现一个对象已经产生拷贝对象, 直接返回这人拷贝对象
  - 使用Map存储 ==> key为源对象, value是拷贝产生的对象  (不能用对象来存储, 因为对象的key为字符串)
- 库. lodash

```js
/* 
1). 大众乞丐版
    问题1: 函数属性会丢失   原因: json字符串数据是不存在函数, 函数属性就会丢失
    问题2: 循环引用会出错   原因: 转换为json字符串是会产生死循环查找, 报错
利用JSON转换成json字符串, 再解析回来
*/
deepClone1 (target) {
  if (target!==null && typeof target==='object' ) {
    return JSON.parse(JSON.stringify(target))
  } else {
    return target
  }
},
```


```javascript
//作者：神三元
//链接：https://juejin.cn/post/6844903986479251464
const getType = obj => Object.prototype.toString.call(obj);

const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;

const canTraverse = {
  '[object Map]': true,
  '[object Set]': true,
  '[object Array]': true,
  '[object Object]': true,
  '[object Arguments]': true,
};
const mapTag = '[object Map]';
const setTag = '[object Set]';
const boolTag = '[object Boolean]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const handleRegExp = (target) => {
  const { source, flags } = target;
  return new target.constructor(source, flags);
}

const handleFunc = (func) => {
  // 箭头函数直接返回自身
  if(!func.prototype) return func;
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  // 分别匹配 函数参数 和 函数体
  const param = paramReg.exec(funcString);
  const body = bodyReg.exec(funcString);
  if(!body) return null;
  if (param) {
    const paramArr = param[0].split(',');
    return new Function(...paramArr, body[0]);
  } else {
    return new Function(body[0]);
  }
}

const handleNotTraverse = (target, tag) => {
  const Ctor = target.constructor;
  switch(tag) {
    case boolTag: 
      return new Object(Boolean.prototype.valueOf.call(target));
      // valueOf方法从对象中提取出其基本类型
      // new Object是为了创建了一个新的某某对象包装器
    case numberTag:
      return new Object(Number.prototype.valueOf.call(target));
    case stringTag:
      return new Object(String.prototype.valueOf.call(target));
    case symbolTag: //es6不推荐使用new,Symbol无法使用;所以使用valueOf
      return new Object(Symbol.prototype.valueOf.call(target));
    case errorTag: 
    case dateTag:
      // Date对象，valueOf方法返回的是日期的毫秒表示,使用Object包装会变成数值类
      // Error`对象表示运行时错误，并且它们通常包含消息、堆栈追踪和其他属性。valueOf方法并不适用于获取Error对象的所有信息
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
}

const deepClone = (target, map = new WeakMap()) => {
  if(!isObject(target)) 
    return target;
  let type = getType(target);
  let cloneTarget;
  if(!canTraverse[type]) {
    // 处理不能遍历的对象
    return handleNotTraverse(target, type);
  }else {
    // 这波操作相当关键，可以保证对象的原型不丢失！
    let ctor = target.constructor;
    cloneTarget = new ctor();
  }

  if(map.get(target)) 
    return target;
  map.set(target, true);

  if(type === mapTag) {
    //处理Map
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(item, map));
    })
  }
  
  if(type === setTag) {
    //处理Set
    target.forEach(item => {
      cloneTarget.add(deepClone(item, map));
    })
  }

  // 处理数组和对象
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map);
    }
  }
  return cloneTarget;
}
```



#### 复述一下深拷贝的操作流程:

* 定义函数,  参数(target, map=new WeakMap())
* 判断是否是对象(判断条件), 非对象直接返回
* 获取具体的对象类型
* 判断是否是 5种 可遍历的对象 (可遍历对象5个: Array/Object/Set/Map/Arguments)
  * 如果是不可遍历的对象, 声明外部函数`handleNotCanTraverse(target, type)`来处理
    * 一类: 调用原型上的`valueOf`方法获取原始值, 再使用`new Object()`生成包装类对象 (string / number / boolean /symbol )
    * 一类: 默认调用原型上的构造函数,生成新的对象 (date error)
    * 一类: 调用独立的方法来处理( 正则表达式, 函数)
  * 如果是可遍历的对象
    * 首先是:  通过`target.constructor`属性获取其构造函数, 调用构造函数生成相应的实例对象
    * 如果存在对象引用 , 会提前在函数的参数中添加`map = new WeakMap()` (这个地方不熟悉的话可以省略不说)
      * 存在对象引用: 直接返回这个对象; 
      * 当前对象不存在引用, 将当前对象添加进map集合中 `map.set(target, true)`
    * 如果是map类型
      * `cloneTarget.set(deepClone(key, map), deepClone(item, map))`
    * 如果是set类型
      * `cloneTarget.add(deepClone(item , map))`
    * 如果是对象 / 数组 类型, 使用`for...in`循环来处理
      * `cloneTarget[key] = deepClone(target[key], map)`



### 数组相关

#### 判断数据类型是否为数组的方案7种
* [] instanceof Array
* [].\_\_proto\_\_ === Array.prototype
* [].constructor === Array
* Array.prototype.isPrototypeOf([])
* Object.getPrototypeOf([]) === Array.prototype
* Object.prototype.toString.call([]).slice(8, -1)
* Array.isArray([])


#### 数组扁平化 7种
* toString + split
* flat
* JSON.stringify + replace + split / JSON.parse
* 递归
  * for ...of
  * reduce
* 展开运算符 + some 
```javascript
//toString + split

arr.toString().split(',')

//flat
arr.flat(Infinity)

//JSON + replace+split
//JSON.stringify(arr.replace(/\[|\]/g, '')).split(',')
JSON.stringify(arr).replace(/\[|\]/g, '').split(',')``

//JSON + replace + JSON.parse
let res = JSON.stringify(arr).replace(/\[|\]/g, '')
let newArr = JSON.parse('[' + res + ']')

//递归+for/reduce
let res = []
function flat(arr) {
  for (let i=0; i<arr.length; i++) { 
    if (Array.isArray(arr)) {
    	flat(arr[i])
  	} else {
      res.push(arr[i])
    }
  }
}
//
function flat(arr) {
  return arr.reduce((pre, crt) => {
    return pre.concat(Array.isArray(crt) ? flat(crt) : pre.concat(crt)
  }, [])
}
                    

//展开运算符
while(arr.some(Array.isArray)) {
    arr = [].concat(...arr)  // arr = [].concat(arr) 加不加展开运算符都一样的 多循环一次
  }
```



#### 实现flat
```javascript
//递归
// arguments.callee指向argumetns对象所在函数的指针, 实现函数名与逻辑的解耦
function flat(arr) {
  let res = []
  arr.forEach(item => {
    if (Array.isArray(item)) {
      res = res.concat(arguments.callee(item)) 
      // res.push(...arguments.callee(item))
    } else {
      res.push(item)
    }
  })
  
  return res
}

//reduce
const flat = arr => {
  return arr.reduce((acc, crt) => {}, [
    return acc.concat(Array.isArray(crt) ? flat(crt) : crt)
  ])
}

//其他方法
```







#### 数组去重 7 种
* for + for  + splice
* for + for+ 新数组
* for + indexOf / includes
* reduce + indexOf/includes
* filter + indexOf / sort()
  * indexOf存在的问题
  * sort排序的问题  sort()排序有漏洞, 并不适用于特殊类型的排序. !!!!???
* sort快慢指针
* 键值对 
	* object键值对+filter(存在的问题: 不能去重正则表达式)
	* map键值对+filter
* new Set()
```javascript
let arr = [1,2,3,1,1,4,3,2,5,6,7];
// for + for 

for (let i=0; i<arr.length; i++) {
  for (let j=i+1; j<arr.length; j++) {
	  if (arr[j] === arr[i]) {
		  arr.splice(j, 1)
	    j--
	  }
  }
}

//for + 新数组

let newArr = []
let j;

for (let i=0; i<arr.length; i++) {
  for (j=0; j<newArr.length; j++) {
    if (arr[i] === newArr[j]) {
      break
    }
  }
  if (j === newArr.length) {
    newArr.push(arr[i])
  }
}

let newArr = [];
for (let i = 0, len = arr.length; i < len; i++) {
	let isDuplicate = false;
	for (let j = 0, len2 = newArr.length; j < len2; j++) {
		if (arr[i] === newArr[j]) {
			isDuplicate = true;
			break;
		}
	}
	if (!isDuplicate) {
		newArr.push(arr[i]);
	}
}
```



```javascript
//for + indexOf / includes

let res = []
for (let i=0; i<arr.length; i++) {
  if (res.indexOf(arr[i] === -1)) { // !res.includes(arr[i])
    res.push(arr[i])
  }
}
```



```javascript
// reduce + indexOf / includes

arr.reduce((pre, crt) => pre.includes(crt) ? pre : pre.concat(crt), [])
arr.reduce((pre, crt) => pre.indexOf(crt) === -1 ? pre.concat(crt) : pre, [])
```



```javascript
//filter + indexOf

arr.filter((item, idx, arr) => arr.indexOf(item) == idx)
//存在的问题
1.arr.indexOf(NaN)的结果是-1,所以会忽略NaN这个值.
2.对象不去重

arr.concat().sort().filter((item, idx, arr) => !idx || item !== arr[idx - 1])
```



```javascript
//sort快慢指针

//https://juejin.cn/post/6844904202162929671

function unique(arr) {
  arr.sort((a, b) => a - b);
  let left = 0,
      right = 1;
  
  while(right < arr.length) {
    if (arr[left] === arr[right]) {
      right++;
    } else {
      arr[left + 1] = arr[right];
      left++;
      right++;
    }
  }
  return arr.slice(0, left+1);
}

//https://juejin.cn/post/7033275515880341512
function unique2(arr) {
  arr.sort((a, b) => a - b);
  let slow = 1,
      fast = 1;
  
  while(fast < arr.length) {
    if (arr[fast - 1] !== arr[fast]) {
      arr[slow++] = arr[fast];
    }
    ++fast;
  }
  arr.length = slow;
  return arr;
}
```



```javascript
//object键值对

// 考虑到 `JSON.stringify` 任何一个正则表达式的结果都是 `{}`，所以这个方法并不适用于处理正则表达式去重。

let obj = {}
arr.filter( v => obj.hasOwnProerpty(v) ? false : (obj[typeof v + JSON.stringify(v)] = true))
```



```javascript
//map键值对

let map = new Map()
arr.fitler((item, idx, arr) => !map.has(item) && map.set(item, true))
```



```javascript
// set
let res = (arr) => [...new Set(arr)]
```

#### 数组去重存在的问题

重点关注下 对象 和NaN 的去重

| 方法                                                         | 结果                                                         | 说明                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------- |
| for循环(双for+新数组)                                        | [1, "1", null, undefined, String, String, /a/, /a/, NaN, NaN] | 对象和 NaN 不去重                       |
| indexOf(作者用的是新数组+for循环+indexOf方法)                | [1, "1", null, undefined, String, String, /a/, /a/, NaN, NaN] | 对象和 NaN 不去重                       |
| sort<br />结论是数字1不去重,没有勘误.不知道是哪个数字1,是包装类的吗? | [/a/, /a/, "1", 1, String, 1, String, NaN, NaN, null, undefined] | 对象和 NaN 不去重 <br />数字 1 也不去重 |
| filter+indexOf                                               | [1, "1", null, undefined, String, String, /a/, /a/]          | 对象不去重 NaN 会被忽略掉               |
| filter+sort                                                  | [/a/, /a/, "1", 1, String, 1, String, NaN, NaN, null, undefined] | 对象和 NaN 不去重 数字 1 不去重         |
| 优化后的键值对方法                                           | [1, "1", null, undefined, String, /a/, NaN]                  | 全部去重                                |
| Set                                                          | [1, "1", null, undefined, String, String, /a/, /a/, NaN]     | 对象不去重 NaN 去重                     |






#### 数组翻转

1. 使用原型中的reverse方法

   ```js
   let array = [1, 2, 3, 4, 5]
   array.reverse() 
   ```
   
2. 循环
* 临时变量(索引之和等于长度减1)
* unshift
   ```js
   for(var i = 0; i < arr.length; i++){
       var temp = arr[i];
       arr[i] = arr[arr.length - 1 - i]
       arr[arr.length - 1 - i] = temp;
   }
   
   ```

   


#### 排序算法
> https://github.com/Easay/issuesSets/issues/44

##### 简单排序: 冒泡 / 选择 / 插入

```js
/* 
冒泡排序的方法
*/
function bubbleSort (array) {
  // 1.获取数组的长度
  var length = array.length;

  // 2.反向循环, 因此次数越来越少
  for (var i = length - 1; i >= 0; i--) {
    // 3.根据i的次数, 比较循环到i位置
    for (var j = 0; j < i; j++) {
      // 4.如果j位置比j+1位置的数据大, 那么就交换
      if (array[j] > array[j + 1]) {
        // 交换
        // const temp = array[j+1]
        // array[j+1] = array[j]
        // array[j] = temp
        [array[j + 1], array[j]] = [array[j], array[j + 1]];
      }
    }
  }

  return arr;
}

/* 
选择排序的方法
*/
function selectSort (array) {
  // 1.获取数组的长度
  var length = array.length

  // 2.外层循环: 从0位置开始取出数据, 直到length-2位置
  for (var i = 0; i < length - 1; i++) {
    // 3.内层循环: 从i+1位置开始, 和后面的内容比较
    var min = i
    for (var j = min + 1; j < length; j++) {
      // 4.如果i位置的数据大于j位置的数据, 记录最小的位置
      if (array[min] > array[j]) {
        min = j
      }
    }
    if (min !== i) {
      // 交换
      [array[min], array[i]] = [array[i], array[min]];
    }
  }

  return arr;
}

/* 
插入排序的方法
*/
// 插入排序实现
function insertionSort(arr) {
    // 对传入数组的拷贝进行排序，避免修改原数组
    const array = [...arr];
    
    // 从第二个元素开始遍历
    for (let i = 1; i < array.length; i++) {
        // 保存当前要插入的元素
        const current = array[i];
        let j = i - 1;
        
        // 将所有大于 current 的元素向右移动一位
        while (j >= 0 && array[j] > current) {
            array[j + 1] = array[j];
            j--;
        }
        
        // 在正确的位置插入当前元素
        array[j + 1] = current;
    }
    
    return array;
}
```



##### 快速排序

```js
function quickSort(arr) {
  // 递归结束的条件
  if(arr.length < 2){
    return arr
  }
  // 获取中间值
  let flag = Math.floor(arr.length / 2);
  let flagValue = arr.splice(flag, 1)[0];
  
  let leftArr = [];
  let rightArr = [];
  for (var i = 0; i < arr.length; i++) {
    var arrItem = arr[i];
    
    if(arrItem > flagValue){
      rightArr.push(arrItem)
    }else {
      leftArr.push(arrItem)
    }
  }
  
  leftArr = quickSort(leftArr);
  rightArr = quickSort(rightArr);
  return [...leftArr, flagValue, ...rightArr]
}
```





### 函数相关

#### 函数的call() / apply() / bind()

```javascript

//call
Function.prototype.call2 = function(...items) {
  let obj = items.shift() || globalThis
  let tempFn = Symbol()
  obj[tempFn] = this
  
  let res = obj[tempFn](...items)
  delete obj[tempFn]
  
  return res
}

// 不建议使用arguments
Function.prototype.myCall = function() {
  let obj = [].shift.call(arguments) || globalThis;
  obj.tempFn = this
  
  let res = obj.tempFn(...[...arguments]);
  delete obj.tempFn;
  return res;
}



//apply
Function.prototype.apply2 = function(...items) {
  let obj = items.shift() || globalThis
  obj[tempFn] = this
  let res = obj[tempFn](items)
  delete obj[tempFn]
  
  return res
}

//bind

//1 version
Function.prototype.bind = function(cxt) {
  let fn = this
  let argsOut = [].slice.call(arguments)
  return function() {
    let argsInner = [].slice.call(arguments)
    fn.apply(cxt, argsOut.concat(argsInner))
  }
}

//

//2 version  避免实例通过原型链更改函数原型上的属性,使用空函数中转 + 可以使用new调用
Function.prototype.bind = function () {
	let fn = this
  let argsOut = [].slice.call(arguments, 1)
  let fNOP = function() {}
  let fbound = function () {
    let argsInner = [].slice.call(arguments)
    return fn.apply(this instanceof fNOP ? this : crt, argsOut.concat(argusInner))
  }
  
  fNOP.prototype = this.prototype
  fbound.prototype = new fNOP()
  return fbound
}
```



```js
/* 
自定义函数对象的call方法
*/
function call (fn, obj, ...args) {
  // 如果传入的是null/undefined, this指定为window
  if (obj===null || obj===undefined) {
    obj = obj || window
  }
  // 给obj添加一个方法: 属性名任意, 属性值必须当前调用call的函数对象
  obj.tempFn = fn
  // 通过obj调用这个方法
  const result = obj.tempFn(...args)
  // 删除新添加的方法
  delete obj.tempFn
  // 返回函数调用的结果
  return result
}

/* 
自定义函数对象的apply方法
*/
function apply (fn, obj, args) {
  // 如果传入的是null/undefined, this指定为window
  if (obj===null || obj===undefined) {
    obj = obj || window
  }
  // 给obj添加一个方法: 属性名任意, 属性值必须当前调用call的函数对象
  obj.tempFn = fn
  // 通过obj调用这个方法
  const result = obj.tempFn(...args)
  // 删除新添加的方法
  delete obj.tempFn
  // 返回函数调用的结果
  return result
}

/* 
  自定义函数对象的bind方法
  重要技术:
    高阶函数
    闭包
    call()
    三点运算符
*/
function bind (fn, obj, ...args) {
  if (obj===null || obj===undefined) {
    obj = obj || window
  }
  
  return function (...args2) {
    call(fn, obj, ...args, ...args2)
  }
}
```



### 字符串处理

```js
/* 
1. 字符串倒序: reverseString(str)  生成一个倒序的字符串
2. 字符串是否是回文: palindrome(str) 如果给定的字符串是回文，则返回 true ；否则返回 false
3. 截取字符串: truncate(str, num) 如果字符串的长度超过了num, 截取前面num长度部分, 并以...结束
*/

/* 
1. 字符串倒序: reverseString(str)  生成一个倒序的字符串
*/
function reverseString(str) {
  // return str.split('').reverse().join('')
  // return [...str].reverse().join('')
  return Array.from(str).reverse().join('')
}

/* 
2. 字符串是否是回文: palindrome(str) 如果给定的字符串是回文，则返回 true ；否则返回 false
*/
function palindrome(str) {
  return str === reverseString(str)
}

/* 
3. 截取字符串: truncate(str, num) 如果字符串的长度超过了num, 截取前面num长度部分, 并以...结束
*/
function truncate(str, num) {
  return str.length > num ? str.slice(0, num) + '...' : str
}
```



### instanceof内部原理和实现

instanceof运算符判断一个对象是否为另一个对象的实例

```javascript

function isntanceof2(case, Ctor) {
    //基本数据类型返回false
  //兼容一下函数对象
  if (typeof(Case) !== 'object' && typeof(Ctor) !== 'function' || Case === 'null') {
    return false;
  }
  
  let caseProto = Object.getPrototypeOf(case)
  while(true) {
    if (caseProto == null) return false
    //找到相同的原型
    if (caseProto === Ctor.prototype) return true
    caseProto = Object.getPrototypeOf(caseProto)
  }
}


```


### 函数柯里化
> https://github.com/Easay/issuesSets/issues/78


函数柯里化是一种将接收多个参数的函数转换为接收一个参数并返回另一个函数的技术。更加灵活地控制函数的功能和输入。

#### 案例
考虑一个接收两个参数的函数，它将它们相乘并返回结果：
```js
function multiply(a, b) {
  return a * b;
}

multiply(2, 3);  // 6
```

使用柯里化转换函数
```js
function multiply(a) {
  return function(b) {
    return a * b;
  };
}

multiply(2)(3);  // 6
```



#### 实现代码
```js
function curryIt(fn){
    var args = [];
    return function curried() {
        // 类数组转数组方式1：
        var arg = [].slice.call(arguments);
        // 方式2：
        //var arg = Array.from(arguments);
        args = args.concat(arg);
        if(args.length < fn.length){
            // return arguments.callee;
            return function () {
	            return curried.apply(this, args.concat(arguments))
            }
        }else{
            return fn.apply(null,args);
        }
    }   
}
```


#### 使用setTimeout实现setInterval
>https://github.com/Easay/issuesSets/issues/95
```js
function mySetInterval(fn, delay) {
	function interval() {
		setTimeout(interval, delay)
		fn()
	}
	setTimeout(interval, delay)
}

mySetInterval(() => console.log(1), 1000)


```
//实现clearInterval
```js
let id = 0
let timeMap = {}
const mySetInterval = (cb, time) => {
	let timeId = id;
	id++
	const fn = () => {
		cb()
		timeMap[timeId] = setTimeout(() => {fn()}, time)
	}
	timeMap[timeId] = setTimeout(fn, time)
	return timeId
}

function clearInterval(id) {
	clearTimeout(timeMap[id])
	delte timeMap[id]
}

let newId = mySetInterval(count, 1000)
setTimeout(() => clearInterval(newId), 3000)

function count() {
	console.log('a')
}
```


#### 实现一个准确的倒计时 ?
>https://github.com/Easay/issuesSets/issues/105


#### 实现curry() -(BEF.dev)
```js

function curry() {
	let 
}
```




### 高阶函数
#### 实现一个currying函数
> https://bigfrontend.dev/problem/implement-curry
```js
//错误方法
function curry(fn) {
	let args = []
	return function curried() {
		args.push(...arguments)
		if (args < fn.length) {
			return curried
		} else {
			return fn(...args)
		}
	}
}

//正确方法
function curry(fn) {
	return curried(...args) {
		let fnArgsLen = fn.length
		if (args.length < fnArgsLen) {
			return function(...moreArgs) {
				return curried.apply(this, args.concat(moreArgs))
			}
		} else {
			return fn.apply(this, args)
		}
	}
}
```

#### 按需求实现一个debounce函数
> https://bigfrontend.dev/problem/implement-basic-debounce

```js

let currentTime = 0
const run = (input) => {
  currentTime = 0
  const calls = []
  const func = (arg) => {
     calls.push(`${arg}@${currentTime}`)
  }
  const debounced = debounce(func, 3)
  input.forEach((call) => {
     const [arg, time] = call.split('@')
     setTimeout(() => debounced(arg), time)
  })
  return calls
}
expect(run(['A@0', 'B@2', 'C@3'])).toEqual(['C@5'])



function debounce(fn, delay) {
	let timeout
	return function(...args) {
		if (timeout) {
			clearTimeout(timeout)
		}

		
	}
}
```






## DOM/BOM
### 事件(了解)

**事件是文档或者浏览器窗口中发生的，特定的交互瞬间。**

事件是用户或浏览器自身执行的某种动作，如click,load和mouseover都是事件的名字。

事件是javaScript和DOM之间交互的桥梁。

### 事件流

#### 概述

事件流描述的是从页面中接收事件的顺序

#### 两种事件流模型

事件传播的顺序对应浏览器的两种事件流模型：捕获型事件流和冒泡型事件流

**冒泡型事件流**：事件的传播是从**最特定**的**事件目标**到最不特定的**事件目标**。即从DOM树的叶子到根。**【推荐】**

**捕获型事件流**：事件的传播是从**最不特定**的**事件目标**到最特定的**事件目标**。即从DOM树的根到叶子。



#### DOM事件流

DOM标准采用捕获+冒泡。两种事件流都会触发DOM的所有对象，从document对象开始，也在document对象结束

DOM标准规定事件流包括三个阶段：事件捕获阶段、处理目标阶段和事件冒泡阶段。
- 事件捕获阶段：**实际目标**（\<div>）在捕获阶段**不会接收事件**。也就是在捕获阶段，事件从document到\<html>再到\<body>就停止了。上图中为1~3.
- 处理目标阶段：事件在\<div>上发生并处理。**但是事件处理会被看成是冒泡阶段的一部分**。
- 冒泡阶段：事件又传播回文档。

事件捕获阶段,实际目标不会接收事件?
> 根据早期的DOM事件模型，实际目标元素在捕获阶段默认是不会处理事件的。这意味着，虽然事件会传递到目标元素，但是如果你没有明确地设置事件监听器在捕获阶段触发（在JavaScript中通过`addEventListener`的第三个参数设置为`true`），那么在捕获阶段，目标元素不会对事件做出响应。
> 事件进入目标阶段，在这个阶段，无论是否设置捕获，目标元素的事件监听器都会被触发。然后，事件开始冒泡阶段，它会沿DOM树向上传播，直到根节点。在冒泡阶段，如果父元素上有事件监听器设置为在冒泡阶段触发（通过`addEventListener`的第三个参数设置为`false`或不设置这个参数，因为默认值是`false`），那么这些监听器会被调用。



### 事件绑定方式
- 嵌入dom
```js
<button onclick="func()">按钮</button>
```

- 直接绑定
```js
btn.onclick = function(){}
```

- 事件监听
```js
btn.addEventListener('click',function(){})
```


### 事件冒泡
事件在传递给目标元素后, 会由内向外传递给外层的元素处理

### 事件委托
* 事件委托利用了事件冒泡，不直接给多个子元素绑定多个事件监听, 而是给它们共同的父元素绑定一个监听
* 当操作任意子元素时, 事件会冒泡到父元素上处理
* 使用事件委托可以节省内存。
```javascript
<ul>
  <li>苹果</li>
  <li>香蕉</li>
  <li>凤梨</li>
</ul>

// good
document.querySelector('ul').onclick = (event) => {
  let target = event.target
  if (target.nodeName === 'LI') {
    console.log(target.innerHTML)
  }
}

// bad
document.querySelectorAll('li').forEach((e) => {
  e.onclick = function() {
    console.log(this.innerHTML)
  }
})
```



### event.target/event.currentTarget
Event.target：指向触发事件的元素；
Event.currentTarget：指向绑定事件的元素。即添加事件监听器的元素。在事件传播过程中，它的值可能会发生改变。

当事件在DOM中传播时，event.target始终指向最初触发事件的元素，而event.currentTarget则随着事件的捕获或冒泡阶段而变化，指向当前处理事件的元素。

例如，如果你在一个ul元素上绑定了一个点击事件，并且点击了其中一个li子元素，那么event.target就是这个li元素，而event.currentTarget就是这个ul元素。

你可以利用event.target来实现事件委托，即通过在父元素上绑定一个事件处理函数来处理子元素的相同类型的事件。







### 事件冒泡与事件委托

#### 1) 事件冒泡的流程
- 基于DOM树形结构
- 事件在目标元素上处理后, 会由内向外(上)逐层传递
- 应用场景: 事件代理/委托/委派

#### 2) 事件委托
- 减少内存占用(事件监听回调从n变为1)
- 动态添加的内部元素也能响应
- 不直接给多个子元素绑定多个事件监听, 而是给它们共同的父元素绑定一个监听
- 当操作任意子元素时, 事件会冒泡到父元素上处理
- 在事件回调中通过event.target得到发生事件的目标元素, 并进行相关处理


### 封装一个绑定事件监听的函数

> [封装事件监听函数_巴拉巴拉小魔仙_的博客-CSDN博客](https://blog.csdn.net/m0_66637749/article/details/122708615)

```js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <div>
      <button id="btn">按钮</button>
      <ul id="divBox">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </ul>
    </div>
    <script>
      function bindEvent(ele, type, selector, fn) {
        if (fn == null) {
          fn = selector
          selector = null
        }

        ele.addEventListener(type, event => {
          const target = event.target
          if (selector) {
            // 代理绑定
            if (target.matches(selector)) {
              fn.call(target, event)
            }
          } else {
            // 普通绑定
            fn.call(ele, event)
          }
        })
      }


      // 普通绑定
      const btn = document.getElementById('btn')
      bindEvent(btn, 'click', function(e) {
        e.preventDefault();
        console.log(this)
        alert(this.innerText)
      })

      // 代理绑定
      const div = document.getElementById('divBox')
      bindEvent(div, 'click', 'li', function(e) {
        e.preventDefault()
        alert(this.innerText)
      })
    </script>
  </body>
</html>

```


### DOM查找/添加/删除节点
#### 获取节点
* id
* class
* name
* tagName
* 查询

#### 获取/设置元素属性值
* element.getAttribute(attributeName)
* element.setAttribute(attributeName, attributeValue)


#### 创建节点
* document.createElement('h3')
* document.createTextNode(String) //创建文本节点
* document.createAttribute('class') //创建一个属性节点

#### 增添/替换/删除节点
* element.appendChild(Node) //再ele元素内部最后添加一个节点,参数是节点类型
* element.insertBefore(newNode, existingNode) //在ele内部中的existingNode前面插入newNode
* element.replaceChild() //替换子元素
* element.removeChild() //删除子元素

#### 删除节点
* element.removeChild(Node)



### 前台数据存储

#### 存储方式
- cookie
- sessionStorage
- localStorage



#### localStoarge与sessionStorage比较
- 相同点:
  - 浏览器不能禁用, 请求时不会自动携带
  - 纯浏览器端存储, 
  - 只能保存文本, 如果是对象或数组, 需要转换为JSON
  - API相同:
    - setItem(key, value)
    - getItem(key, value)
    - removeitem(key, value)
- 不同点(关闭浏览器是否会被删除):
  - localStorage保存在本地文件中, 除非编码或手动删除, 否则一直存在
  - sessonStorage数据保存在当前会话内存中, 关闭浏览器则清除

#### sessionStorage同源跨窗口可以共享吗?
只有在本页面中以新页签或窗口打开的同源页面会‘临时复制’之前页面的sessionStorage。
a标签也是同样的效果



#### cookie与localStorage和sessionStorage比较
都是浏览器提供的用于存储数据的技术
* **存储大小不同**：cookie一般只能存储4KB左右的数据，而localStorage和sessionStorage可以存储更大的数据，一般为5MB或更多。
* **数据有效期不同**：cookie可以设置过期时间，如果没有设置，则在浏览器关闭时失效；localStorage始终有效，除非用户手动清除；sessionStorage只在当前浏览器窗口关闭前有效。
* **作用域不同**：cookie在所有同源窗口中都是共享的，并且会随着每次HTTP请求发送到服务器；localStorage也在所有同源窗口中共享，但不会发送到服务器；sessionStorage一般不在不同的浏览器窗口中共享。
* **数据安全性不同**：cookie相对较容易被篡改或窃取，因此不适合存储敏感信息；localStorage和sessionStorage相对较安全，但仍然可能受到XSS攻击

#### cookie与session比较
cookie和session都是用来记录客户状态的机制，但它们有以下几个区别：
* 存储位置不同：cookie数据存放在客户端浏览器中，session数据存放在服务器上。
* 安全性不同：cookie相对较容易被篡改或窃取，因此不适合存储敏感信息；session相对较安全，因为它只能通过特定的sessionID来访问。
* 服务器性能不同：session会占用服务器的内存资源，如果访问量过大，可能会影响服务器的性能；cookie则不会给服务器增加负担。
* 存储容量和有效期不同：单个cookie保存的数据一般不能超过4KB，而且一个站点最多只能保存20个cookie；session则没有明确的上限，但出于对服务器性能的考虑，应该尽量精简和及时删除无用的session。
* 有效期: cookie可以设置过期时间，如果没有设置，则在浏览器关闭时失效；session也有一定的有效期，一般为30分钟，如果超过这个时间没有活动，则会自动失效.



# TypeScript面试题
> [TypeScript高频面试题及解析本文整理了一些TypeScript 的高频面试题，并附带详细答案及解析代码，涉及包括 - 掘金](https://juejin.cn/post/7321542773076082699)



## 常规问题
### 类型声明和类型推断的区别
* 类型声明是显式地为变量或函数指定类型
* 类型推断是TypeScript根据赋值语句右侧的值自动推断变量的类型
```ts
// 类型声明
let x: number;
x = 10;
// 类型推断
let y = 20; // TypeScript会自动推断y的类型为number

```

### 接口是什么, 作用,使用场景?和类型别名的区别
#### 是什么
> 接口是用于描述对象的形状的结构化类型。它定义了对象应该包含哪些属性和方法。

#### 区别
* 接口定义了一个契约，描述了对象的形状（属性和方法），以便在多个地方共享。它可以被类、对象和函数实现。
* 类型别名给一个类型起了一个新名字，便于在多处使用。它可以用于原始值、联合类型、交叉类型等。与接口不同，**类型别名可以用于原始类型、联合类型、交叉类型等，而且还可以为任意类型指定名字**


### 泛型是什么, 如何创建泛型函数和泛型类, 实际用途
#### 是什么


### 枚举是什么? 作用及案例.
#### 是什么
> 枚举是一种对数字值集合进行命名的方式。它们可以增加代码的可读性，并提供一种便捷的方式来使用一组有意义的常量。

```ts
enum Color {
 red,
 green,
 blue
}

let selectedColor: Color = Color.red
```

#### 枚举和常量枚举区别
* 枚举可以包含计算得出的值，而常量枚举则在编译阶段被删除，并且不能包含计算得出的值，它只能包含常量成员。
* 常量枚举在编译后会被删除，而普通枚举会生成真实的对象。
```ts
const enum Direction {
    Up,
    Down,
    Left,
    Right
}

function move(direction: Direction) {
    switch (direction) {
        case Direction.Up: //编译之后, 只会保留值
            console.log('向上移动');
            break;
        case Direction.Down:
            console.log('向下移动');
            break;
        case Direction.Left:
            console.log('向左移动');
            break;
        case Direction.Right:
            console.log('向右移动');
            break;
    }
}

move(Direction.Up); 

```

### 如何处理可空类型（nullable types）和undefined类型，如何正确处理这些类型以避免潜在错误


在TypeScript中，可空类型是指一个变量可以存储特定类型的值，也可以存储`null`或`undefined`。（通过使用可空类型，开发者可以明确表达一个变量可能包含特定类型的值，也可能不包含值（即为`null`或`undefined`）

为了声明一个可空类型，可以使用联合类型（Union Types），例如 `number | null` 或 `string | undefined`。 例如：


### 联合类型和交叉类型, 类型断言

### 命名空间和模块

`模块`提供了一种组织代码的方式，使得我们可以轻松地在多个文件中共享代码，

`命名空间`则提供了一种在全局范围内组织代码的方式，防止命名冲突
模块示例:


```ts
//模块
// greeter.ts
export function sayHello(name: string) {
  return `Hello, ${name}!`;
}
// app.ts
import { sayHello } from './greeter';
console.log(sayHello('John'));



// 命名空间
// greeter.ts
namespace Greetings {
  export function sayHello(name: string) {
    return `Hello, ${name}!`;
  }
}
// app.ts
<reference path="greeter.ts" />
console.log(Greetings.sayHello('John'));


```






# TS面试题

## TS内置数据类型又那些?
```js
boolean（布尔类型）

number（数字类型）

string（字符串类型）

null 和 undefined 类型

array（数组类型）object 对象类型

tuple（元组类型）：允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

enum（枚举类型）：`enum`类型是对JavaScript标准数据类型的一个补充，使用枚举类型可以为一组数值赋予友好的名字

any（任意类型）

never 类型

void 类型
```


## any类型介绍

### 作用
**作用:**
为编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来**自用户输入或第三方代码库**（不确定用户输入值的类型，第三方代码库是如何工作的）。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。

**any的问题**

1. 类型污染：any`类型的对象会导致后续的属性类型都会变成`any
2. 使用不存在的属性或方法而不报错

### any和泛型的区别？

泛型有类型推论，编译器会根据传入的参数自动地帮助我们确定T的类型

any则是不检验

### any和unknown有什么区别？
unknown 和 any 的主要区别是 unknown 类型会更加严格：在对 unknown 类型的值执行大多数操作之前，我们必须进行某种形式的检查。而在对 any 类型的值执行操作之前，我们不必进行任何检查。


### any和泛型的比较
泛型有类型推论，编译器会根据传入的参数自动地帮助我们确定T的类型

any则是不检验





### TypeScript 中 any、never、unknown、null & undefined 和 void 有什么区别？

- `any`: 动态的变量类型（失去了类型检查的作用）。
- `never`: 永不存在的值的类型。例如：never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
- `unknown`: 任何类型的值都可以赋给 unknown 类型，但是 unknown 类型的值只能赋给 unknown 本身和 any 类型。
- `null & undefined`: 默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和 undefined 赋值给 number 类型的变量。当你指定了 --strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们各自。
- `void`: 没有任何类型。例如：一个函数如果没有返回值，那么返回值可以定义为void。



## 设计模式



## 数据结构和算法

