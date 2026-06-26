> 文档主要内容来自 大漠的掘金小册内容: <<现代Web布局>>

## 基本术语
### web坐标轴
> 简而言之,CSS坐标系统在物理属性上有x轴(水平轴),y轴(垂直轴),z轴(层叠).随着css的逻辑属性出现, css坐标系统分为内联轴(inline axis)和块轴(block axis).


内联方向称为内联轴(inline axis),也就是书写模式的方向;块方向称之为块轴(block axis),是盒子自然流的方向. 它们会随着css的书写模式改变.

![[Pasted image 20241111193643.png]]

**CSS物理坐标系和逻辑坐标系**:

| 物理属性    | 逻辑属性(horizontal-tb) | 逻辑属性(vertical-lr) | 逻辑属性(vertical-rl) |
| ------- | ------------------- | ----------------- | ----------------- |
| x轴(水平轴) | inline轴(内联轴)        | block轴(块轴)        | block轴(块轴)        |
| y轴(垂直轴) | block(块轴)           | inline轴(内联轴)      | inline轴(内联轴)      |

### 容器和容器空间
每个html元素在css中就是一个盒子,又称为*容器*.这个容器随着类型不同,而有不同的称呼.

**物理属性和逻辑属性在box上的对比:**![[Pasted image 20241111194845.png]]


![[Pasted image 20241111194252.png]]


### 书写模式
不同的语系，它们的书写模式（阅读模式）是有差异的：

- **拉丁语体系** 是从左往右，比如英语、西班牙语、德语、法语等；

- **阿拉伯语体系** 是从右往左，比如阿拉伯语、希伯来语等；

- **汉语体系** 有两种方式，有可能是从左往右，也有从上向往下，比如中文、日文、韩文等。

正因为语言的书写方式不同，在 Web 中呈现不同语系时，CSS 中的块（Block）和 内联（Inline）表现的方式也会不同。
可以通过 HTML 元素的 `dir` 属性或 CSS 的 `direction` 属性来控制书写模式, 还可以使用 CSS 的 `writing-mode` 属性来控制：
![[Pasted image 20241111195551.png]]

### 逻辑属性

#### 产生背景
开发国际业务时候, 因为存在不同的书写方式,同一套CSS要添加很多属性选择器来适配不同书写方式下的页面.
例如:
```css
.thumb {
	margin-right: 1rem;
}

[dir='rtl'] .thumb {
	margin-left: 1rem
}
```
为了解决类似的问题,W3C 的 CSS 工作组（CSS Working Group） 发布了 [CSS逻辑属性和值](https://link.juejin.cn/?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fcss-logical-1%2F%23intro "https://www.w3.org/TR/css-logical-1/#intro")

#### 是什么
没有方向性的概念,只有start,end,block,inline的概念.在ltr中,start对应的是left,在rtl中,start又对应的是right.逻辑属性更适应不同的书写模式.

#### 盒子模型的物理属性和逻辑属性
![[Pasted image 20241111200701.png]]


## Flex布局

### 是什么
> **Flexbox 布局 是一种布局机制，用于在一个维度上为项目组设置布局！**

### 概念合集
![[Pasted image 20241111201357.png]]


### 术语
![[Pasted image 20241111201736.png]]

#### flex容器
* HTML 上的大多数元素都可以是 Flex 容器, 只要在元素上显式设置display为flex或inline-flex即可.但是html中的可替代元素是无法成为flex容器的,比如img,input,select.
* 可以在flex容器上显式使用width/height(或逻辑属性:inline-size/block-size,显式设置尺寸推荐使用)设置flex容器主轴和侧轴的尺寸,也可以使用`min-*`和`max-*`对其尺寸加以限制.
* 如果没有显式给flex容器设置尺寸,则会根据所有flex项目的大小来决定,或根据flex容器的父容器来决定.


### flex容器属性
#### 概述
![[Pasted image 20241111205632.png]]

#### flex-wrap
> 如果 Flex 容器没有足够多的空间，Flex 项目在溢出之前，每一个 Flex 项目将会尽可能缩小到其最小内容（`min-content`）的尺寸。即 **Flex 项目一旦达到最小内容（`min-content`）大小， Flex 项目将开始溢出 Flex 容器** ！


#### flex-flow
可以显式设置一个值或两个值:
* 只设置一个值, 该值和flex-direction相匹配, flex-wrap取值initial;
* 只设置一个值, 该值和flex-wrap相匹配, flex-direction取值initial;
* 设置了两个值, `flex-direction` 和 `flow-wrap` 没有先后顺序之分, 即`flex-flow: column wrap` 和 `flex-flow: wrap column` 所起作用是等同的。


#### gap
`gap` 是用来定义**列与列** 或 **行与行** 之间的间距。
可以接受1或2个值: 当只显式设置一个值时，那么第二个值和第一个值等同，如果显式设置两个值，第一个值是 `row-gap` 属性的值，第二个则是 `column-gap` 属性的值：



### flex项目属性


![[Pasted image 20241111205727.png]]



