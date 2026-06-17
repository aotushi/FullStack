---
aliases: 
tags:
  - CSS如何运行
cssclasses:
---
## CSS如何运行?

> [CSS如何运行 - 学习 Web 开发 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/First_steps/How_CSS_works)

当浏览器展示一个文件的时候，它必须兼顾文件的内容和文件的样式信息，下面我们会了解到它处理文件的标准的流程。

1. 浏览器<span style="color:blue">载入HTML文件</span>（比如从网络上获取）。
2. 将HTML文件转化成一个<span style="color:blue">DOM（Document Object Model）</span>，DOM是文件在计算机内存中的表现形式，下一节将更加详细的解释DOM。
3. 接下来，浏览器会<span style="color:blue">拉取</span>该HTML相关的大部分资源，比如嵌入到页面的图片、视频和CSS样式。JavaScript则会稍后进行处理，简单起见，同时此节主讲CSS，所以这里对如何加载JavaScript不会展开叙述。
4. 浏览器拉取到CSS之后会进行<span style="color:blue">解析</span>，根据选择器的不同类型（比如element、class、id等等）把他们分到不同的“桶”中。浏览器基于它找到的不同的选择器，将不同的规则（基于选择器的规则，如元素选择器、类选择器、id选择器等）应用在对应的DOM的节点中，并添加节点依赖的样式（这个中间步骤称为渲染树）。
5. 上述的规则应用于渲染树之后，渲染树会依照应该出现的结构进行<span style="color:blue">布局</span>
6. 网页<span style="color:blue">展示</span>在屏幕上（这一步被称为着色）

结合下面的图示更形象：

![](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/How_CSS_works/rendering.svg)

