---
aliases: 行内元素
---

#### 来源
> [CSS中 块级元素、行内元素、行内块元素区别](https://juejin.cn/post/6998925491797229599)
> https://developer.mozilla.org/zh-CN/docs/Web/HTML/Inline_elements

#### 行内元素
**是什么**
行内元素不可以设置宽（width）和高（height），但可以与其他行内元素位于同一行，行内元素内一般不可以包含块级元素。行内元素的高度一般由元素内部的字体大小决定，宽度由内容的长度控制。 

**特点**
* 不会独占一行，相邻的行内元素会排列在同一行里，直到一行排不下才会自动换行，其宽度随元素的内容而变化；
* 高/宽无效，对外边距（margin）和内边距（padding）仅设置左右方向有效  上下无效；
* 设置行高有效，等同于给父级元素设置行高；
* 元素的宽度就是它包含的文字或图片的宽度，不可改变；
* 行内元素中不能放块级元素，a链接里面不能再放链接；

```sh
结构类: br span
样式类: b big em i strong small a
语义类: abbr acronym code cite dfn kbd label
```
