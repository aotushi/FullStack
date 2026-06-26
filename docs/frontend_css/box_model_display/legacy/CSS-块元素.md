---
aliases: 块级元素
---

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
结构类: header article aside footer p div
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

