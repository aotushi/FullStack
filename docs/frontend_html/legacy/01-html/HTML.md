#  文档资源

## 1.标准和文档

* w3.org
* whatwg.org
* developer.mozilla.org
* msdn.microsoft.com
* developer.apple.com

## 2.大师

* Tim Berners-Lee
* Brendan Eich
* Bjarne Stroustrup





# HTML标签

## 是什么
- HTML 标签是由*尖括号*包围的关键词，比如 \<html>
- HTML 标签通常是*成对出现*的，比如 \<b> 和 \</b>
- 标签对中的第一个标签是*开始标签*，第二个标签是*结束标签*
- 开始和结束标签也被称为*开放标签*和*闭合标签*

## 种类
* 单标签(自结束标签)
* 双标签(有开始有结束)

## 标签的关系
* 嵌套关系(包含关系,祖先和后代的关系)
* 并列关系(同级关系,兄弟之间的关系)



# HTML元素组成

## 主要组成部分

* 开始标签(Opening tag): 包含元素的名称(本例为p)，被大于号、小于号所包围。表示元素从这里开始或者开始起作用.
* 结束标签(Closing tag): 与开始标签相似，只是其在元素名之前包含了一个斜杠。这表示着元素的结尾 
* 内容: 元素的内容
* 元素: 开始标签+结束标签+内容,便是一个完整的元素

![element.png (584×255) (mozit.cloud)](https://media.prod.mdn.mozit.cloud/attachments/2019/02/08/16475/cfa4526491ae15e6256fd67bb16bc7ea/element.png)



#### 标签和元素的关系

> [HTML Tags Vs Elements - Tutorial Republic](https://www.tutorialrepublic.com/html-tutorial/html-elements.php)

* 一个HTML元素是开始标签及它的属性,结束标签,及两者之间的所有的集合
* 简单起见,标签项和元素通常来表示同样的事情-就是它在你网页上定义的东西.



# HTML元素分类

> [HTML 元素参考 - HTML（超文本标记语言） | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)

以下HTML元素根据功能进行分类,

## 根元素

| ELement  |          Description           |
| -------- |:------------------------------:|
| `<html>` | 代表一个HTML文档的根(顶级元素) |


## 文档元数据
元数据(metadata)包含关于页面的信息.包括样式,脚本,帮助软件(搜索引擎,浏览器等)来使用和渲染页面的数据.
样式或脚本的元数据可能定义在当前页面或另一个文件.
|  Element  | Description|
|:---------:| ------------------ |
| `<base>`  | 指定文档中所有相对URL使用的基础URL.一个文档中只能有一个这样的元素|
| `<head>`  | 包含文档中机器可读的信息,例如title,scripts,style sheets    |
| `<link>`  | 指定当前文档和外部资源的关系.常用来链接CSS,除了别的以外也用来建立网站图标(“favicon”样式图标和移动设备上主屏幕和应用程序的图标) |
| `<meta>`  | 表示不能被其它HTMLmeta-related元素代表的元数据,例如`<base> <link> <script> <style> <title>`     |
| `<style>` | 包含文档或部分文档的样式信息(?). 标签包含CSS, 应用到包含此元素的文档内容上. |
| `<title>` | 定义显示在浏览器标题栏或页面选项卡上的文档标题.它仅包含文本;元素内的标签会被忽略. |



## 分区根元素

| Element  | Description                                       |
| -------- | ------------------------------------------------- |
| `<body>` | 代表HTML文档的内容.一个文档中只能有一个这样的元素 | 


## 内容分区
内容分区元素允许你组织文档内容为逻辑块. 使用分区元素来为页面内容创建大致轮廓,包含header和footer导航, 及识别内容分区的heading元素.

| Element | Description |
| ------- | ----------- |
| `<address>`                 | 表示包含的HTML为个人或组织提供联系信息  |
| `<article>`                 | 代表在文档/页面/应用或网站中的自包含组合, 旨在独立分发或复用(例如,在联合发布中?).包含示例: 论坛帖子、杂志或报纸文章、博客条目、产品卡、用户提交的评论、交互式小部件或小工具或任何其他独立的内容项。 |
| `<aside>`                   | 代表文档的一部分,其内容与文档主要内容间接相关.  Asides(离题的话)通常以侧边栏或呼出框(call-out boxes)呈现.                                                                                           |
| `<footer>`                  | 代表它最近的章节内容或章节根元素的根部. 一个`<footer>`单独包含分区作者,版权数据或相关文档链接的信息.                                                                                                |
| `<header>`                  | 代表介绍性内容,通常是一组介绍性或导航性辅助工具.它可能包含一些标题元素,但也包含logo,搜索表单,作者名字和其它元素.                                                                                    |
| `<h1> <h2><h3><h4><h5><h6>` | 代表6类章节标题.`<h1>`是最高分区标准,`<h6>`是最低.                                                                                                                                                  |
| `<hgroup>`                  | 代表含有次级内容(例如子标题,一个可选的标题,或一个标签行)分组的标题 ?                                                                                                                                |
| `<main>`                    | 代表文档的正文的主要内容. 主要内容区域由直接与文档的中心主题或应用程序的中心功能相关或扩展的内容组成                                                                                                |
| `<nav>`                     | 代表网页的一个章节,其目的是提供导航链接,或在当前文档内或链接到其它文档. 平常的导航章节例子是菜单栏(menu),内容表格和索引.                                                                            |
| `<section>`                 | 代表文档通用独立章节,其没有有更具体的语义元素来代表它. 章节应该总是有一个标题,除了极少数例外.  |


#### 文本内容
是使用HTML文本内容元素来组织放置在开始`<body>`和关闭`</body>`标签之间的内容的块或章节,对[可访问性](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility)和[SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO)是重要的,这些元素识别该内容的目的或结构.

| Element        | Description                                                                                                                                                                                                                  |     |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| `<blockquote>` | 表明被包含的文本是一个延伸引用.通常,这是通过缩进(indentation)来直观渲染的. 使用`cite`属性提供引用来源的URL,而使用`<cite>`元素提供源文字表示.                                                                                 |     |
| `<dd>`         | 提供说明列表中(`<dl>`)中前置的(`<dt>`)的说明,定义或值.                                                                                                                                                                       |     |
| `<div>`        | 文档流通用容器.它不会在内容或样式上有影响直至以一些方式使用CSS设置样式(例如, 样式直接应用于它, 或者一些布局样式例如flexbox应用到它父元素上).                                                                                 |     |
| `<dl>`         | 表示一个描述列表. 这个元素包含术语组(指定使用`<dt>`元素)和描述组(由`<dd>`提供)的列表. 这个元素的平常用法是现词汇表或显示元数据（键值对列表）?                                                                                |     |
| `<dt>`         | 在说明或定义列表中指定一个术语,并且必须在`<dl>`元素内部使用.它通常跟着一个`<dd>`元素; 然后,一行中多个`<dt>`元素表明表示多个术语，这些术语都由紧接着的下一个 `<dd>` 元素定义                                                  |     |
| `<figcaption>` | 表示一个标题或图例来描述其父元素`<figure>`剩余的内容                                                                                                                                                                         |     |
| `<hr>`         | 表示在段落标准元素之间的一个主题终端: 例如,在一个故事中情节变换, 或章节内部主题转移.                                                                                                                                         |     |
| `<li>`         | 表示一个列表中的一项.它必须被父元素包含: 一个有序列表(`<ol>`), 一个无序列表(`<ul>`). 在菜单和无序列表中, 列表项通常使用==项目符号==(?)来展示. 在有序列表中,它们通常在左侧用升序计数(ascending counter)来展示,例如数字或字母. |     |
| `<menu>`  ?    | `<ul>`的语义代替,但被浏览器视为与`<ul>`来说没什么不同. 与 `<ul>` 没有什么不同。它表示项的无序列表（由`<li>` 元素表示）。                                                                                                     |     |
| `<ol>`         | 表示有序列表项,通常渲染为一个数字列表.                                                                                                                                                                                       |     |
| `<ul>`         | 表示无序列表项,通常渲染为一个符号列表.                                                                                                                                                                                       | `   |
| `<p>`          | 表示一个段落.段落通常在视觉媒体中表示为文本块，由空行和/或首行缩进与相邻块分隔, 但是HTML段落可以是任何内容的解构分组,例如图片或表单.                                                                                         |     |
| `<pre>`        | 表示预格式化的文本，该文本应该按照 HTML 文件中编写的格式精确呈现.文本通常使用非对称(non-proportional),或等宽monospaced字体表示.元素中的空格(Whitespace)作为编写的方式展示.                                                   |     |


#### 内联文本语义
使用内联文本语义来定义文字,行,或文本片段的含义,结构或样式.  


| Element    | Desc |                                                                                                                                                                                                                           |     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| `<a>`      | 与自身的`href`属性一起来创建到网页的超链接,文件邮件地址,当前页面位置,或URL可以指向的任何事物                                                                                                                                    |     |
| `<abbr>`   | 代表缩写或首字母缩写词                                                                                                                                                                                                          |     |
| `<b>`      | 用来吸引用户注意力到不被赋予重要性的内容上.大多数浏览器以粗体显示. 不建议使用, 使用`font-weight`代替粗体,使用`<strong>`来强调重要性                                                                                             |     |
| `<bdi>`    | 告诉浏览器双向算法将其包含的文本与周围的文本区别对待. 当网页动态插入文本且不知道插入文本方向时很有用.?                                                                                                                          |     |
| `<bdo>`    | 重写当前文本方向.                                                                                                                                                                                                               |     |
| `<br>`     | 在文本中产生一个换行(carriage-return回车).在诗歌或地址上很有用,其中行划分很重要.                                                                                                                                                |     |
| `cite>`    | 用来标识引用内容的标题.                                                                                                                                                                                                         |     |
| `<code>`   | 修饰片段或计算机代码.文本内容默认使用用户代理默认等宽字体展示.                                                                                                                                                                  |     |
| `<data>`   | 用机器可读的翻译来链接给定的内容.如果内容是时间相关或日期相关,必须使用`<time>`                                                                                                                                                  |     |
| `<dfn>`    | 用来指示通过在定义的短语或句子上下文中定义的术语.  祖先`<p>`元素,配对的`<dt>/<dd>`,或`<dfn>`最近的祖先部分,被认为是术语的定义.                                                                                                  |     |
| `<em>`     | 标记重点强调的文本.可以嵌套,嵌套的每层标准表明强调的更高等级.                                                                                                                                                                   |     |
| `<i>`      | 表示由于某种原因与普通文本分离的文本范围,例如惯用语,技术用语,分类名称等.过去,也曾被用作斜体文字展示,也是此元素名称的来源.                                                                                                       |     |
| `<kbd>`    | 表示内联文本修饰的,来自键盘,声音输入,或其它任何文本输入设备的文字用户输入的范围. 按照惯例，用户代理默认使用其默认等宽字体呈现 `<kbd>` 元素的内容，尽管 HTML 标准没有强制要求这样做。                                            |     |
| `<mark>`   | 表示由于在封闭上下文中标记段落的相关性而被标记或突出显示以供参考或表示的文本。                                                                                                                                                  |     |
| `<q>`      | 指明封闭文本是短的行内引用. 长引用使用`<blockquote>`                                                                                                                                                                            |     |
| `<rp>`     | 用来为浏览器不支持使用`<ruby>`元素的ruby注释提供回退括号. 1个`<rp>`元素应当包含每个涵盖注释文本的`<rt>`元素开/关括号.                                                                                                           |     |
| `<rt>`     | 指定ruby注释的ruby文本,用来为东亚板式设计提供发音/翻译/音译信息. 此元素必须包含在`<ruby>`内.                                                                                                                                    |     |
| `<ruby>`   | 表示在基文本的上方、下方或旁边呈现的小批注，通常用于显示东亚字符的发音.也可以用作其它类型文字的注释,但是此用法较少.                                                                                                             |     |
| `<s>`      | 使用删除线(strikethrouth)渲染文本,表示其不在相关或不再精准. 不合适,使用`<del>`或`<ins>`来比较合适.                                                                                                                              |     |
| `<samp>`   | 用来包含表示从计算机程序中输出的简单(或引用)行内文本. 其内容使用浏览器默认等宽字体单独渲染.                                                                                                                                     |     |
| `<small>`  | 表示侧面注释和小字体，如版权和法律文本，独立于其样式表示。使用更小字体渲染文本,例如从`small`到`x-small`.                                                                                                                        |     |
| `<span>`   | 用于短语的原生行内容器,本质上不代表任何东西.它可用于出于样式目的（使用 class 或 id 属性）或因为它们共享属性值（如 lang）而对元素进行分组。它应该只使用在其它语义元素不合适的情况下. 和`<div>`元素类似,但是元素类型不同(行内,块) |     |
| `<strong>` | 指定内容有更加重要,严肃或紧急.浏览器用加粗来渲染它.                                                                                                                                                                             |     |
| `<sub>`    | 指定行内文本应该处于纯粹排版原因来作为下标展示.                                                                                                                                                                                 |     |
| `<sup>`    | 同上,但是是上标.                                                                                                                                                                                                                |     |
| `<time>`   | 代表时间上的特定阶段.  它可能包括日期时间属性，以将日期转换为机器可读的格式，从而获得更好的搜索引擎结果或自定义功能，例如提醒。                                                                                                 |     |
| `<u>`      | 表示内联文本的范围，该文本的呈现方式应指示它具有非文本批注。默认情况下，这呈现为简单的实心下划线，但可以使用 CSS 进行更改。                                                                                                     |     |
| `<var>`    | 代表数学表达式或程序上下文中变量的名字.  它通常使用当前字体的斜体版本呈现，尽管该行为取决于浏览器。                                                                                                                             |     |
| `<wbr>`    | 表示断字机会——文本中的一个位置，浏览器可以选择在该位置断行，但其断行规则不会在该位置创建断行。                                                                                                                                  |     |





#### 图片和多媒体

| ELement   | Description                                                                               |     |
| --------- | ----------------------------------------------------------------------------------------- | --- |
| `<area>`  | 定义了图像映射中预定义可点击区域的区域.图片映射允许图片上的几何区域使用超链接来联系                                                |     |
| `<audio>` | 用来在文档中嵌入声音内容.它可能包含一个或多个音频源,使用`src`属性或source元素来表示:浏览器会选择最合适的那个.它还可以作为使用MediaStream的流媒体的目标。 |     |
| `<img>`   | 在文档中嵌入图片                                                                                  |     |
| `<map>`   | 使用`<area>`元素来定义图片映射(一块可点击的链接去区域)                                                          |     |
| `<track>` | 作为媒体元素音频和视频的子级，它允许您指定定时文本轨道（或基于时间的数据），例如自动处理字幕。这些轨道以WebVTT格式（.vtt文件）格式化——Web视频文本轨迹。       |     |
| `<video>` | 嵌入媒体播放器来支持文档中的视频播放.你也能给audio使用`<video>` 元素,但音频元素可能提供一个更合适的用户体验.                           |     |


#### 嵌入内容

| Element     | Description                                                                                                                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<embed>`   | 在文档指定位置插入外部内容.其由外部应用或其它交互内容源(例如浏览器插件)提供.                                                                                                                         |
| `<iframe>`  | 表示一个嵌套浏览器上下文,嵌入另一个HTML页到当前页                                                                                                                                                    |
| `<object>`  | 表示外部源,可以被视为图片,嵌套浏览器上下文,或被插件处理的资源.                                                                                                                                       |
| `<picture>` | 包含0或多个`<source>`元素或1个`<img>`元素,来为不同显示器/设备场景                                                                                                                                    |
| `<portal>`  | 允许将另一个HTML页面嵌入到当前页面中，以便更流畅地导航到新页面。                                                                                                                                     |
| `<source>`  | 为图片,audio元素,video元素指定多个媒体源. 它是一个空元素,意味着它没有内容且没有结束标签. 它通常用在多个文件格式中提供相同媒体内容,为多个浏览器提供兼容性,因为对[图片文件格式](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types)和[媒体文件格式](https://developer.mozilla.org/en-US/docs/Web/Media/Formats)支持不同. | 


#### SVG和MathML
你可以直接嵌入SVG和MathML内容到HTML文档中,用`<svg>`和`<math>`元素.

| ELement  | Description                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<svg>`  | 定义新坐标系和[视区](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox)的容器。它被用作SVG文档的最外层元素，但也可以用于将SVG片段嵌入到SVG或HTML文档中。 |
| `<math>` | MathML中的顶层元素。每个有效的MathML实例都必须包含在其中。此外，您不应将第二个`<math>`元素嵌套在另一个`<math>`元素中，但可以在其中有任意数量的其他子元素。                                                                                                                                                                          |


#### 脚本

为了创建动态内容和 Web 应用程序，HTML 支持使用脚本语言，最突出的就是 JavaScript。有一些特定的元素用于支持此功能。

| Element                                                                                                                                                                                                                                                     | Desc |    
| -------- | ------------------------------------------------------------------------------------------------ |
| canvas   | 用来通过 [canvas scripting API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) 或 [WebGL API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API) 绘制图形及图形动画的容器元素。                                                      |    
| noscript | 定义脚本未被执行时（页面的脚本类型不受支持，或当前浏览器关闭了脚本）的替代内容。                                                                                                                                                                             |
| script   | 用于嵌入可执行脚本或数据。这通常用作嵌入或者引用 JavaScript 代码。 元素也能在其他语言中使用，比如 [WebGL](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API) 的 GLSL 着色器语言和 [JSON](https://developer.mozilla.org/zh-CN/docs/Glossary/JSON)。 |   



#### Demarcating edit
> “划分编辑”。这里的 “Demarcating edits” 可以理解为将一段文本或文章按照不同的标准进行分类和区分。例如，在维基百科上，每篇文章都有多个部分，如引言、内容、参考资料等。对于每个部分，编辑者需要根据其特点和功能来进行分类和区别。

这些元素让你提供对已经被更改文本特定部分的指示.

| ELement | Description                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `<del>` | 表示文本范围已经从文档中被删除. 例如,这能在渲染'track changes'或源代码比较时使用.`<ins>`元素用作相反的目的: 来标记已经添加到文档中的文本. |
| `<ins>` | 表示一些文本已经被添加到文档中.                                                                                                           | 


#### 表格内容
这里的元素用来创建和处理表格类数据.

| ELement   | Description |
| --------- | ----------- |
| `<table>` | 表示表格数据            |


#### 表单

| ELement | Description |
| ------- | ----------- |
|         |             |


#### 交互元素

| ELement | Description |
| ------- | ----------- |
|         |             |


#### Web组件

| ELement | Description |
| ------- | ----------- |
|         |             |


#### 过时和不推荐元素

| ELement | Description |
| ------- | ----------- |
|         |             |

* acronym
* applet
* bgsoud
* big
* blink
* center
* content
* dir
* font
* grame
* frameset
* image
* keygen
* marquee
* menuitem
* nobr
* noembed
* noframes
* params
* plaintext
* rb
* rtc
* shasow
* spacer
* strike
* tt
* xmp



## HTML属性参考
>https://developer.mozilla.org/en-US/docs/Web/HTML/Reference




## 全局属性
>https://developer.mozilla.org/en-US/docs/Web/HTML/Reference







### title

> 全局属性,包含表示与其所属元素相关的公告信息文本

使用场景包括:

* `<iframe>`元素, 
* data table
* `<link rel='stylesheet'>`
* `<abbr>`
* `<input>` 更推荐使用`<label>`



**多行title**

使用`U+000A LINE FEED` (`LF`)代表换行符.

```html
<p>
  Newlines in <code>title</code> should be taken into account. This
  <span
    title="This is a
multiline title">
    example span
  </span>
  has a title a attribute with a newline.
</p>
<hr />
<pre id="output"></pre>

//js
const span = document.querySelector("span");
const output = document.querySelector("#output");
output.textContent = span.title;
```





**限制**

以下场景存在使用问题:

* 使用只能触摸的设置
* 使用键盘导航
* 使用辅助技术导航,例如屏幕阅读或屏幕放大
* 有认知问题的人/有控制障碍的人

因为浏览器支持的不一致,再加上浏览器呈现页面的额外辅助技术解析. 如果需要一个提示功能,更推荐使用[高访问性技术.](https://inclusive-components.design/tooltips-toggletips/)



#### 高访问性技术
















## 内容分类
> https://developer.mozilla.org/en-US/docs/Web/HTML/Reference


## 日期和时间格式化
>https://developer.mozilla.org/en-US/docs/Web/HTML/Reference




# HTML标签写法和注释

#### 标签写法

在HTML中,标签和属性名字是大小写不敏感.意味着标签`<P>` 和 `<p>`在HTML中定义同样的段落.

但是在XHTML中,它们是大小写敏感的.

使用建议: 使用小写标签和属性名在HTML中.



#### HTML注释

An HTML comment begins with `<!--`, and ends with `-->`, as shown in the example below:

```html
<!-- This is an HTML comment -->
<!-- This is a multi-line HTML comment 
     that spans across more than one line -->
<p>This is a normal piece of text.</p>


<!-- Hiding this image for testing
<img src="images/smiley.png" alt="Smiley">
-->
```



# HTML元素的类型 //todo
>[Content categories - HTML: HyperText Markup Language | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories)


元素可以被分成两类: 块级别元素 和 行内级别元素.
块元素装饰文档结构,行内元素装饰块的内容.
块元素占据可访问宽度的100%,它的首尾被渲染成换行符; 行内元素仅占据它所需空间.
最常用的块级元素:
```
<div>
<p>
<h1> - <h6>
<form>
<ol>
<ul>
<li>
```

最常用的行内元素
```
<img>
<a>
<span>
<strong>
<b>
<em>
<i>
<code>
<input>
<button>
```



## 块元素

> 块级别元素是作为块被格式化的元素(即, 占据可用全部宽度),在块元素之前和之后有换行符.
> 通常来说,块元素可以包含行内元素和其他块元素.


## 内联元素
内联级元素是源文档中不构成新内容块的元素; 内容以行形式分布. ????
内联元素通常只包含文本和其他内联元素.
一个内联元素仅仅占据需要的宽度,也不会强制换行.


## 元素类型 最新分类
>[HTML Standard (whatwg.org)](https://html.spec.whatwg.org/multipage/dom.html)
>


最新的HTML规范已经不按inline和block来区分元素.在规范中每个元素会规定如下两项:
> [a 标签为什么能够包含块级元素？ - 知乎](https://www.zhihu.com/question/34952563/answer/60672228)



* [categories](https://html.spec.whatwg.org/multipage/dom.html#element-dfn-categories) 该元素本身的分类
* [content model](https://html.spec.whatwg.org/multipage/dom.html#%3Cspan%20data-search-entity=)   规定了合法的元素的内容（子元素、文本等）类型。





# HTML属性

#### 是什么

* 定义元素额外的特征或属性,例如图片的宽度和高度. 
* 属性通常被定义在开始(闭合)标签,通常包含名字/值对,例如`name="value"`. 属性值应始终用引号引起来.

* 一些属性需要特定元素.来个例子, 一个`<img>`标签必须包含一个`src`  和 `alt`属性.

* 在HTML5中有几个属性不是由名字/值对构成,只是仅仅由名字构成.这样的属性被称为**布尔值属性**. 通常用的布尔值属性是`checked, readonly, required`等等.

* 属性值通常**大小写敏感**,除了id和class属性. 使用推荐是小写.



#### 图示

![](https://mdn.mozillademos.org/files/16476/attribute.png)



#### 属性的组成

* 在属性与元素名称（或上一个属性，如果有超过一个属性的话）之间的<span style="color:blue">空格符</span>
* 属性的<span style="color:blue">名称</span>，并接上一个等号。
* 由引号所包围的<span style="color:blue">属性值</span>



#### 命名注意事项

不包含 ASCII 空格（以及 `"` `'`  `=` `<` `>` 反引号）的简单属性值可以不使用引号，但是建议将所有属性值用引号括起来，这样的代码一致性更佳，更易于阅读。





# HTML文档结构/声明/组成 //todo

## 基本结构(4部分)

* DTD(文档类型声明 `<!DOCTYPE>` declaration)
* The main container(`<html>` element)
* The head section(`<head>` element)
* The body section(`<body>` element)



## 文档声明类型

### 作用

会通知浏览器即将处理的文档类型,允许它们相应的调整处理机制.这DTD插入一个特殊标签(<!DOCTYPE>),为每个文档采用特定形式.此声明只能出现在文档开始.



## main container: HTML元素

### 组成

分成两部分: the `<head>` and  the `<body>`

### \<head>元素

`<head>`部分是文档元信息(metadata)的容器.描述了文档的各种属性信息,包括文档标题,与其他文件的关系等.

#### 分类
此元数据可以根据使用的元素分成5类.

* The document's title: 简要描述文档中处理的主题.这是必要的一项,使用`<title>`元素插入.
* Style declarations: Style组定义用在为文档中的元素设置描述性属性. 它使用`<style>`元素插入.
* Client-side scripts: 插入程序以提供功能和交互. 用`<script>`元素来声明
* Meta statement: 定义自定义的属性和值. 使用`<meta>`元素插入.
* Relational information: 表示与文档以某种方式相关的资源. 使用`<link>`标签插入.
* base


#### 顺序及性能
>html 中的 \<head> 元素通常放了一堆脚本、样式和 meta 等内容，你可能从未在意过这些内容的摆放顺序，但是错误的顺序会直接影响网页的加载和渲染效率，这个演讲中提到了原理：https://youtube.com/watch?v=uqLl-Yew2o8&t=2873s，作者建议遵循如下顺序：

1. preconnect
2. script-async
3. css-contains-@ import
4. sync-js
5. sync-css
6. preload
7. script-defer
8. prefetch / prerender
9. seo-relative

有一个工具叫做 capo.js，https://github.com/rviscomi/capo.js，使用它可以快速识别和优化性能问题，同时也提供了一个 Chrome 插件，可以安装试一试：https://chrome.google.com/webstore/detail/capo-get-your-%EF%B9%A4%F0%9D%9A%91%F0%9D%9A%8E%F0%9D%9A%8A%F0%9D%9A%8D%EF%B9%A5/ohabpnaccigjhkkebjofhpmebofgpbeb



### \<body>元素

文档`<body>`仅仅是可渲染部分的容器.从这开始写你自己的内容(添加标题,段落,图片等),当页面加载时候你的访客立即访问的部分.



### meta标签

#### 资料

> [HTML meta标签总结与属性使用介绍 - SegmentFault 思否](https://segmentfault.com/a/1190000004279791)
>
> [HTML Standard (whatwg.org)](https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element)



#### 作用

* meta常用于定义页面的说明，关键字，最后修改日期，和其它的元数据。
* 这些元数据将服务于浏览器（如何布局或重载页面），搜索引擎和其它网络服务



#### 组成
- 如果设置了 [`name`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-name) 属性，`meta` 元素提供的是文档级别（*document-level*）的元数据，应用于整个页面。
- 如果设置了 [`http-equiv`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-http-equiv) 属性，`meta` 元素则是编译指令，提供的信息与类似命名的 HTTP 头部相同。
- 如果设置了 [`charset`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#attr-charset) 属性，`meta` 元素是一个字符集声明，告诉文档使用哪种字符编码。
- 如果设置了 [`itemprop`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes#attr-itemprop) 属性，`meta` 元素提供用户定义的元数据。



#### name属性

##### 作用

* 与之对应的属性值为content，content中的内容是对name填入类型的具体描述，便于搜索引擎抓取
* name属性主要用于描述网页，比如网页的关键词，叙述等。

##### description
```html
<meta name="description" content="xxx">
```

##### viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1"
```



##### robots

说明：robots用来告诉爬虫哪些页面需要索引，哪些页面不需要索引。
content的参数有all,none,index,noindex,follow,nofollow。默认是all。

```html
<meta name="robots" content="none"> 

<meta name="robots" content="index,follow,max-snippet:200,max-image-preview:large">

//max-snippet 谷歌搜索参数 最多只能使用 [number] 个字符作为此搜索结果的文字摘要。
//max-image-preview:       设置此网页的图片预览在搜索结果中的尺寸上限。
      
```





#### http-equiv属性

http-equiv顾名思义，相当于http的文件头作用。equiv的全称是"equivalent"

##### http-equiv="content-type"

说明：用于设定网页字符集，便于浏览器解析与渲染页面

```html
<meta http-equiv="content-Type" content="text/html;charset=utf-8">  //旧的HTML，不推荐

<meta charset="utf-8"> //HTML5设定网页字符集的方式，推荐使用UTF-8
```

##### http-equiv="X-UA-Compatible"(浏览器采取何种版本渲染当前页面)

说明：用于告知浏览器以何种版本来渲染页面。（一般都设置为最新模式，在各大框架中这个设置也很常见。）

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/> //指定IE和Chrome使用最新版本渲染当前页面
```

##### http-equiv="cache-control"(指定请求和响应遵循的缓存机制)

**实例1**

说明：指导浏览器如何缓存某个响应以及缓存多长时间。

```html
<meta http-equiv="cache-control" content="no-cache">
```

共有以下几种用法：

1. no-cache: 先发送请求，与服务器确认该资源是否被更改，如果未被更改，则使用缓存。
2. no-store: 不允许缓存，每次都要去服务器上，下载完整的响应。（安全措施）
3. public : 缓存所有响应，但并非必须。因为max-age也可以做到相同效果
4. private : 只为单个用户缓存，因此不允许任何中继进行缓存。（比如说CDN就不允许缓存private的响应）
5. maxage : 表示当前请求开始，该响应在多久内能被缓存和重用，而不去服务器重新请求。例如：max-age=60表示响应可以再缓存和重用 60 秒。

> [参考链接：HTTP缓存](https://link.segmentfault.com/?enc=g0wxoHT0Oi4trg%2F%2Ban326g%3D%3D.dEwDy5%2FLkodWzR2WjHO05GZuB6PtHxTtOBUB1IDUDaERHCm3hXiEiPVHJzbYOa8d8%2Bw1LuwSX3ne0BZ%2FPWKqZ1KNEXjrYZJH41veJo6QM4d%2B5RhdP27jIuR%2B89KmUlmlPVIMpMymxG96ffRTtVU9tat2pi6tP03mSJqyUn3cINY%3D)

实例2 禁止百度自动转码

说明：用于禁止当前页面在移动端浏览时，被百度自动转码。虽然百度的本意是好的，但是转码效果很多时候却不尽人意。所以可以在head中加入例子中的那句话，就可以避免百度自动转码了。
举例：

```html
<meta http-equiv="Cache-Control" content="no-siteapp" />
```

##### http-equiv="expires"

说明:用于设定网页的到期时间，过期后网页必须到服务器上重新传输。

```html
<meta http-equiv="expires" content="Sunday 26 October 2016 01:00 GMT" />
```



##### http-equiv="Set-Cookie"(cookie设定)

如果网页过期。那么这个网页存在本地的cookies也会被自动删除。

```html
<meta http-equiv="Set-Cookie" content="name, date"> //格式

<meta http-equiv="Set-Cookie" content="User=Lxxyx; path=/; expires=Sunday, 10-Jan-16 10:00:00 GMT"> //具体范例
```



##### http-equiv="Refresh"

meta实现自动刷新

```html
<!-- 在 5s 之后自动跳转到同域下的 page2.html 页面 -->
<meta http-equiv="Refresh" content="5; URL=page2.html">
```



#### 其他类型元数据

Facebook和twitter提供的元数据协议

```html
<meta property="twitter:site" content="@FinancialTimes">
<meta proeprty="fb:pages" content="8860325749">
```



### link标签

#### 作用

* 指明当前文档和外部资源的关系
* 最常用连接到样式表, 网站icon图标(facivon, 移动端上的home屏幕或者app)



#### 属性





#### 作用

通过预处理提升渲染速度

- **dns-prefetch**。当 link 标签的 rel 属性值为“dns-prefetch”时，浏览器会对某个域名预先进行 DNS 解析并缓存。这样，当浏览器在请求同域名资源的时候，能省去从域名查询 IP 的过程，从而减少时间损耗。
- **preconnect**。让浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析、TLS 协商、TCP 握手，通过消除往返延迟来为用户节省时间。
- **prefetch/preload**。两个值都是让浏览器预先下载并缓存某个资源，但不同的是，prefetch 可能会在浏览器忙时被忽略，而 preload 则是一定会被预先下载。
- **prerender**。浏览器不仅会加载资源，还会解析执行页面，进行预渲染。

![Untitled](
)





### script标签
> [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

#### 概述
没有async,defer,type=module属性的脚本,没有type=module属性的**行内脚本(inline script)**,在浏览器继续解析页面之前获取和立即执行.
脚本应该以`text/javascript` MIME类型来提供, 但是浏览器是松弛的,若脚本是图片类型(`image/*`),视频类型(`video/*`),音频类型(`audio/*`), 或`text/csv`,会被浏览器阻塞.
如果脚本被阻塞,一个事件被发送到元素;否则,将是`load`事件


#### 属性

**async**
对传统脚本来说,如果async存在,那传统脚本会在解析的同时并行获取,并在可用时立即执行.(所以其打印位置在DOMContentLoaded前后都可能)
对模块脚本来说,如果async存在,那脚本和所有的依赖将在延迟队列中执行,所以它们在解析时获取并一旦可用立即执行.
此属性允许消除**解析器阻塞JavaScript(parser-blocking JS)**，其中浏览器必须在继续解析之前加载和评估脚本。在这种情况下，延迟具有类似的效果

**defer**
这个布尔值属性被设置为,脚本应该在文档解析之后,但是在DOMContentLoaded之前执行.
如果缺少src属性,则不能使用此属性,其不会起到任何作用.
对模块脚本没有作用,模块脚本默认延迟.
带有defer属性的脚本将以它们出现在文档中的顺序来执行

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
		<script src="./defer.js" defer></script>  //最先打印
		<script src="./async.js" async></script>  //最后打印
	</head>
	<body>
		<p>
			Lorem, ipsum
		</p>
		<script>
			document.addEventListener("DOMContentLoaded", () => {
				console.log("dom loaded");  //中间打印
			});
		</script>
	</body>
</html>
```

#### defer,async比较

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









**crossorigin**
>对没有通过标准CORS检查,通常的script元素会传递最少的信息给`window.onerror`
>若想为静态资源使用单独域名的网站进行错误记录,则使用这个属性.

当一个脚本发生错误时，浏览器会触发`window.onerror`事件。然而，如果脚本来自于不同的源，并且没有设置`crossorigin`属性，浏览器将不会提供详细的错误信息。这是出于安全原因，以防止潜在的信息泄露。
通过将`crossorigin`属性设置为`anonymous`，浏览器会在发出请求时包含CORS头，这使得服务器可以决定是否允许跨域访问。如果服务器允许跨域访问，浏览器将提供详细的错误信息。
以下是一个示例，说明如何使用`crossorigin="anonymous"`属性来捕获跨域脚本的错误信息：
```html
/*
请注意，为了使这个示例正常工作，服务器需要配置CORS响应头，例如`Access-Control-Allow-Origin: *`。否则，浏览器将不会提供详细的错误信息。
*/
<html>  
<head>  
  <title>Error Logging Example</title>  
  <script>  
    window.onerror = function(message, source, lineno, colno, error) {  
      console.log('Error message:', message);  
      console.log('Error source:', source);  
      console.log('Error line number:', lineno);  
      console.log('Error column number:', colno);  
      console.log('Error object:', error);  
    };  
  </script>  
</head>  
<body>  
  <script src="https://example.com/script.js" crossorigin="anonymous"></script>  
</body>  
</html>
```


**integrity**
>这个属性包含内联元数据,用户代理能用它来验证所获取的资源已经交付,没有意外操作.

这个属性通常用于HTML的`<link>`和`<script>`标签中，以确保浏览器获取的资源是完整的且未被篡改.
integrity 属性用于在 `<script>` 标签中提供资源的哈希值(如 SHA-256 或 SHA-384),以帮助浏览器验证所加载的脚本是否匹配预期值,从而防止受到意外或恶意操纵。
```html
<script 
				src="https://example.com/example.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"> 
</script> 
```
当浏览器加载这个脚本时,它会计算脚本的 SHA-384 哈希值,并与提供的 integrity 值进行比较。如果两者匹配,则脚本加载成功。如果不匹配,则脚本不会被执行,并且浏览器会报告警告,说明资源可能被非法修改。


**nomodule**
>此布尔属性被设置来说明这个脚本不应该在支持ES modules的浏览器中执行,实际上,这可以用来对不支持模块化JS代码的旧浏览器提供回退脚本.

nomodule 属性用于在 `<script>` 标签中指示脚本只能由不支持 ES6 模块的浏览器执行。

```html
<script src="module.js" type="module"></script>
<script src="nomodule.js" nomodule></script>
```

-   module.js 是一个 ES6 模块脚本,只会在支持 ES6 模块的浏览器中执行。
-   nomodule.js 是一个传统的脚本,在不支持 ES6 模块的浏览器中执行。
-   支持 ES6 模块的浏览器会忽略 nomodule 属性,因此 nomodule.js 不会在这些浏览器中执行。

所以这个技巧可用于提供一种向后兼容的方式,为不支持 ES6 模块的旧浏览器提供一个备选脚本,而在支持 ES6 模块的现代浏览器中继续使用 ES6 模块。
另一个示例:

```html
<script type="module">
  import * as module from './module.js';
  // ...
</script>
<script nomodule src="fallback.js"></script> 
```

在这个例子中,module.js 是一个 ES6 模块,会在支持 ES6 模块的浏览器中执行。fallback.js 是一种备选脚本,只会在不支持 ES6 模块的浏览器中执行。

所以总的来说,nomodule 属性的目的是为不支持 ES6 模块的浏览器提供后备脚本,同时继续使用 ES6 模块为支持模块化的现代浏览器服务。



**nonce**
一个加密随机数(nonce, 使用一次的数字)来允许script-src内容安全策略中的脚本.服务器必须在每次传输策略时生成唯一的随机数值.提供一个不能被猜测的随机数很重要,否则绕过资源策略将变得非常容易.



**referrerpolicy**
指示在获取脚本或通过脚本获取资源时,发送哪个referrer.(引荐者)

> Document.referrer属性返回链接到当前页面的页面URI.
> 如果用户直接导航到页面(不通过link,但可能用了书签),它的值为空字符串.
> 在`<iframe>`中, `Document.referrer`将被初始化为父窗口的`window.location`相同的值,并作为href.

在`<script>`元素中，referrerpolicy属性用于控制浏览器在请求脚本时发送的Referer头。这对于保护用户隐私和安全性非常重要，因为它可以防止敏感信息泄露给第三方。以下是referrerpolicy属性的一些可能值：
1. no-referrer：不发送Referer头。  
2. no-referrer-when-downgrade：仅在协议从HTTPS切换到HTTP时不发送Referer头。  
3. origin：仅发送来源页面的域名，不包括路径和查询参数。  
4. origin-when-cross-origin：在同源请求中发送完整的Referer头，在跨域请求中仅发送域名。  
5. same-origin：仅在同源请求中发送Referer头，在跨域请求中不发送。  
6. strict-origin：仅在协议不降级的情况下发送域名。  
7. strict-origin-when-cross-origin：在同源请求中发送完整的Referer头，在跨域请求中仅在协议不降级的情况下发送域名。  
8. unsafe-url：始终发送完整的Referer头，包括路径和查询参数。


**src**
指明外部script的URI; 这可以用做直接在文档内部嵌入script的替代方法.

**type**
此属性指定所表示脚本的类型.

* 属性为空(默认),或空字符串,或JS MIME类型
* module
* importmap
* 任何其它值








**blocking**
>[HTML Standard (whatwg.org)](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#blocking-attributes)
>[The Script element - HTML: HyperText Markup Language | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)


>属性明确的指出某些操作应该在获取脚本时被阻塞.
>The operations that are to be blocked must be a space-separated list of blocking attributes listed below.(这句话不好翻译不出来)

`render`: 屏幕上内容的渲染被阻塞  //好像暂时有的浏览器不支持.







#### 问题:
在script标签中写入defer或者async时，就会使JS文件异步加载，即html执行到script标签时，JS加载和文档解析同时进行.
async是在加载完成后,立即执行,阻塞HTML解析.
defer是在加载完成后,等到HTML加载完成后再加载.
所以,浏览器解析new Vue时候会报错.
两种解决方案:
1.移除关键字
2.将Vue实例代码放在一个DOMContentLoader事件监听器中,以确保在创建实例之前,vue已经加载完成.
```html
//Uncaught ReferenceError: Vue is not defined
<html>
  <head>
    <script src="https://unpkg.com/vue@2" async ></script>
  </head>
  <body>
    <div id="root">
      //...
    </div>
    
    <script>
	    document.addEventListener('DOMContentLoaded', function() {
		    let vm = new Vue({
        el:"#root",
	      })
	    })
    </script>
  </body>
</html>
```





### viewport









### style标签



### title标签



### base标签





### 其他

异步加载HTML

> [Async Fragments: Rediscovering Progressive HTML Rendering with Marko (ebayinc.com)](https://tech.ebayinc.com/engineering/async-fragments-rediscovering-progressive-html-rendering-with-marko/)









# HTML标签/元素


### `<a>`

#### 是什么




#### a标签案例

**如何选中a标签的部分文字** //未完成: 选择部分文字时,需要链接功能正常
<iframe src="https://codesandbox.io/embed/shu-biao-zai-abiao-qian-shang-xuan-zhong-bu-fen-wen-zi-6kspxr?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="鼠标在a标签上选中部分文字"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>




### `<label>`
#### 概述


#### 案例
纯展示,鼠标无法选中
```js
.FormControl-label {
	-webkit-user-select: none;
	user-select: none;
}
label {
	cursor: default; //箭头
}
```






### `<img>`








# crossorigin属性
#### **概况**
用在audio,video,img,link,script元素上.
定义元素如何处理跨域请求,为元素请求数据启用CORS请求的配置.
<span style="color:blue">简单来说就是表示该脚本的请求是否应遵循跨域资源共享(CORS)规则</span>

#### **值**
`anonymous`
请求使用CORS头, 凭据符号被设置为'same-origin'.(这里的same-origin是对请求行为的描述,不是一个可设置的值)
除非目的地是同源,否则不会通过cookies,client-side SSL凭据或http身份验证交换用户凭据.
>当`crossorigin`属性设置为`anonymous`时，浏览器将发出一个不带凭据（如cookies、客户端SSL证书或HTTP认证）的跨域请求。服务器需要在响应头中设置`Access-Control-Allow-Origin`，以允许跨域请求。


```html
<!DOCTYPE html>
<html>  
<head>  
  <title>CORS Example</title>  
</head>  
<body>  
  <script src="https://example.com/script.js" crossorigin="anonymous"></script>  
</body>  
</html>
```

//请求非同源 不发送凭据
```http
GET /script.js HTTP/1.1  
Host: http://example.com/         //请求目的地: 客户端指定自己想访问的http服务器的域名/IP和端口号.
Origin: https://yourdomain.com/   //请求出发地:   指示请求来自哪个站点,只有服务器名,不包含路径信息
```

```http
HTTP/1.1 200 OK  
Access-Control-Allow-Origin: *  
Content-Type: application/javascript
```

//请求同源情况下, 发送凭据
```http
GET /script.js HTTP/1.1  
Host: example.com  
Origin: https://example.com
Cookie: session_id=12345
```

```http
// 由于请求页面和资源位于相同的域,并不需要CORS头.如果服务器已经配置了CORS响应头,那么它可能如下所示:

HTTP/1.1 200 OK  
Access-Control-Allow-Origin: https://example.com
Content-Type: application/javascript
```






`use-credentials`
>请求时使用CORS头,凭据标识被设置为'include',并且用户凭据总是包含在内.

当`crossorigin`属性设置为`use-credentials`时，浏览器将发出一个带有凭据的跨域请求。服务器需要在响应头中设置`Access-Control-Allow-Origin`和`Access-Control-Allow-Credentials`，以允许带有凭据的跨域请求。

```html
<!DOCTYPE html>
<html>  
<head>  
  <title>CORS Example</title>  
</head>  
<body>  
  <script src="https://example.com/script.js" crossorigin="use-credentials"></script>  
</body>  
</html>
```

请求头
```http
GET /script.js HTTP/1.1  
Host: example.com 
Origin: https://yourdomain.com
Cookie: session_id=12345
```

响应头
服务器允许带有凭据的跨域请求,如果服务器不支持CORS或未正确设置响应头，浏览器将阻止跨域请求。
```http
HTTP/1.1 200 OK  
Access-Control-Allow-Origin: https://yourdomain.com 
Access-Control-Allow-Credentials: true 
Content-Type: application/javascript
```


`""`
设置属性名为空值,比如`corssorigin`或`crossorigin=""`, 是和`anonymous`一样.
不合法关键字和空字符串将作为`anonymous`来处理.
