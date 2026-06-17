---
aliases: flex
---





# flex

## 介绍

Flex是Flexible Box的缩写，意为”弹性布局”，用来为盒状模型提供最大的灵活性。
任何一个容器都可以指定为Flex布局。行内元素也可以设置flex布局.
设为Flex布局以后:
* 子元素的块级特性会消失;
* 子元素的`float`、`clear`和`vertical-align`属性将失效。



## 基本概念与概念

![](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/.4lahpd7pbs40.webp)


### Flex容器
>HTML 上的大多数元素都可以是Flex容器，比如 `div` 、`ul` 、`main` 块元素，`span` 、`em` 这样的内联元素。只需要在 HTML 元素上显式设置 `display` 的值为 `flex` 或 `inline-flex` 即可。
>**注意，HTML 中的可替代元素是无法成为Flex容器的，比如`img`、 `input`、 `select`等元素！**

![](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/.1munzxai0xmo.webp)

### Flex容器与子元素关系
* 当一个元素变成了Flex容器之后，它的子元素，包括其伪元素 `::before` 、`::after` 和 文本节点 都将成为 **Flex 项目**
* 在 Flexbox 布局中，Flex容器和Flex项目之间的关系永远是**父子关系**。因此，Flex项目也可以是它的子元素的Flex容器，即 显式地在Flex项目设置 `display` 属性值为 `flex` 或 `inline-flex`


### 主轴与侧轴及方向
* 在 Flexbox 中，Flex容器内也有两个轴，而且这两个轴只存在于Flex容器中，分别叫 **主轴** （Main Axis）和 **侧轴** （Cross Axis）。
* Flexbox 中的主轴由 `flex-direction` 属性设置，默认情况下，主轴沿行方向（内联轴 Inline Axis）分布，如果该属性为 `column` ，则主轴沿列方向（块轴 Block Axis）分布
* Flexbox 布局中的主轴、主方向、侧轴和侧方向会随着：flex-direction,CSS 的书写模式`writing-mode` 或阅读模式 `direction` 影响。
* 主轴还是侧轴都有方向性,所以就有开始处（即起点）和结束处（即终点）之分。根据起点和终点之分，Flex 容器中的每根轴又有 **主轴起点** 、**主轴终点** 、**侧轴起点** 和 **侧轴终点** 之分。每根轴的起点和终点是由 `flex-direction` 和 `writing-mode` (或 `direction`) 来决定的。
* 

![](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/.4pvf311r0jk0.webp)


### 容器的宽度和高度
* **主轴尺寸,侧轴尺寸与宽度,高度的关系**
	* 主轴尺寸和侧轴尺寸可以用来决定一个 Flex 容器的大小。但它们并不完全等同于 Flex 容器的宽高（`width x height` ）。
	* 因为 `flex-direction` 和 `writing-mode` 或 `direction` 属性值不同时，用于描述 Flex 容器的物理属性 `width` 和 `height` 有可能会互换的。
	* 当 `flex-direction` 为 `row` ，且书写模式和阅读模式是 LTR 时，主轴的尺寸对应的就是 Flex 容器的宽度，侧轴的尺寸对应的则是 Flex 容器的高度；
	* 当 `flex-direction` 为 `column` ，且书写模式和阅读模式是 LTR 时，主轴的尺寸对应的就是 Flex 容器的高度，侧轴的尺寸对应的则是 Flex 容器的宽度。
* **设置容器的宽度和高度**
	* 在 Flex 容器上显式使用 CSS 的物理属性 `width` 和 `height` 
	* 或使用 CSS 的逻辑属性 `inline-size` 和 `block-size` 设置 Flex 容器主轴和侧轴的尺寸 
	* 也可以使用 `min-*` 和 `max-*` 对 Flex 容器主轴和侧轴的尺寸加以限制。

![](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/.2u3drqntyzk0.webp)


## 概念性知识
### CSS元素尺寸大小决定因素
* `auto` 
	* 设置值为 `auto` 时，容器的大小将会以**容器上下文**来计算。
	* 如果它是个块元素，等于父容器宽度; 如果它是个内联元素，则等于元素内容的尺寸大小；
	* 不过给 `min-width`、`min-height`、`min-inline-size` 或 `min-block-size` 设置值为 `auto` 时，将会指定一个自动计算好的最小值 
* `none` 如果取值为 `none` 时，元素盒子的大小是没有任何限制的。
* `<length-percentage>` 
	*  `<length>` 是一个长度值，它可能是一个固定长度值，也可能是一个相对长度值，主要取决于其单位，比如 `px` 是一个固定值，`vw` 和 `rem` 又是一个相对值。
	* `<percent>` 是一个百分比值，根据其父元素的宽度来解析百分比。
* `min-content`
	* 如果指定了内联轴，那么 `min-content` 对应的大小则是内联大小，否则将表现为属性的初始值，即固有的最小宽度。
* `max-content`
	* 如果指定了内联轴，那么 `max-content` 对应的大小则是内联大小，否则将表现为属性的初始值，即固有的首选宽度。
* `fit-content()`
	* 如果显式指定了内联轴，使用 `fit-content()` 函数，可以用指定的参数替换可用空间，即 `min(max-content, max(min-content, <length-percentage>))`；否则将表现为属性的初始值。
	* 对于内在尺寸，`fit-content(<length>)` 表现长度值（`<length>`）。如果 `fit-content()` 使用了百分比值，`min-content` 作为最小内容，`max-content` 作为最大内容 。

### flexbox布局中的项目尺寸影响因素
* 上述多个尺寸
* flex-basis 指定Flex项目在Flex容器主轴方向的初始值
	* 除了 `auto` 和 `content`，`flex-basis` 都以与水平书写模式中 `width`相同的方式解析（除了 `width` 值设置为 `auto`，`flex-basis` 设置为 `content`）。












## 容器的6属性

```markdown
flex-direction
flex-wrap
flex-flow
justify-content
align-items
align-content
```


## flex元素的属性

### flex属性
#### 默认值
flex属性默认值是: `flex: 0 1 auto`,其对应的是:
* `flex-grow`初始值是0,表示flex项目不扩展(不瓜分flex项目剩余空间);
* `flex-shrink`初始值是1,表示flex项目会收缩(即flex项目在原始尺寸上按比例减去flex容器的不足空间)
* `flex-basis`初始值是auto,表示flex项目的基本尺寸是flex项目的最大内容尺寸(即max-content)

#### 其它形式的值
flex属性可以执行单值,双值,3个值.
##### 单值语法
- 一个无单位的数值（`<number>`），比如 `flex: 1` ，这个时候它（即`1`）会被当作 `flex-grow` 属性的值；
- 一个有效的长度值（`<length-percentage>` ），比如 `flex: 30vw` ，这个时候它（即 `30vw`）会被当作 `flex-basis` 属性的值；
- 关键词 `none` 、 `auto` 或 `initial` （即初始值）。

```css
.item {
	flex: 1;

/*等同于*/
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}

.item {
	flex: 30vw;

	/*等同于*/
	flex-grow: 1;
	flex-shrink: 1;
	flex-basis: 30vw;

.item {
  flex: auto;
    
  /* 等同于 */
  flex-grow: 1;     /* Flex 项目可以扩展到超过其 flex-basis */
  flex-shrink: 1;   /* Flex 项目可以收缩到小于其 flex-basis */
  flex-basis: auto; /* Flex 项目为基本大小 auto，即 max-content */

.item {
  flex: initial;
  
  /* 等同于 */
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;


.item {
  flex: none;
  
  /* 等同于 */
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;

}
```

`flex: auto;`会将每个flex项目设置为最大内容大小(max-content)后再均分flex容器的剩余空间.
`flex: 1` 表示所有flex项目大小都为0,平均增长并共享flex容器空间;
`flex:1;min-width:0;` 可以实现每个flex项目宽度相等;
`flex: initial`, flex项目会根据width或height来确定尺寸,flex项目不会扩展,但会收缩来适应flex容器,其相当于`flex: 0 1 auto;`
`flex: none;` Flex项目会根据自身的 `width` （或 `inline-size`），和 `height` （或 `block-size`）来设置尺寸，它是完全非弹性的，即不会收缩，也不会扩展来适应 Flex 容器。其相当于 `flex: 0 0 auto`。

`flex: <positive-number>`(正数)和`flex:1 0px`相同.flex项目可伸缩,并将




##### 双值语法
其第一个值必须为 **一个无单位的数值（`<number>`）** ，并且它会**被当作** **`flex-grow`** **属性的值** ；第二个值必须为以下之一：

- 一个无单位的数值（`<number>`），它会被当作 `flex-shrink` 属性的值；

- 一个有效的长度值（`<length-percentage>`），它会被当作 `flex-basis` 属性的值。

比如:
```css
.item {
	flex: 1 2;

/*等同于*/
  flex-grow: 1;
  flex-shrink: 2;
  flex-basis: 0%;
}

.item {
	flex: 2 30vw;

	/*等同于*/
	flex-grow: 2;
	flex-shrink: 1;
	flex-basis: 30vw;
}
```

##### 三值语法
- 第一个值必须是一个无单位的数值（`<number>`），并且它会被当作 `flex-grow` 属性的值；

- 第二个值必须是一个无单位的数值（`<number>`），并且它会被当作 `flex-shrink` 属性的值；

- 第三个值必须是一个有效的长度值（`<length-percentage>`），并且它会被当作 `flex-basis` 属性的值。

比如:
```css
.items {
  flex: 2 1 200px;
    
  /* 等同于 */
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 200px;
}
​
.item {
  flex: 30vw 2 1;
  
  /* 等同于 */
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 30vw;
}
```


