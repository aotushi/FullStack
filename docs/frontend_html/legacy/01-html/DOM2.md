---
aliases: 文档对象模型, DOM
---

# 资源
> [Introduction to the DOM - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
> [Document - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/Document)
> https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API




# 文档对象模型/DOM

## 是什么
当浏览器加载一个页面后, 浏览器会为页面创建一个以对象建模的模型,称作文档对象模型(Document Object Module),简称DOM.

它指的是,页面上由文档结构和内容组成的对象的数据形式.

DOM将文档表示为nodes和objects.所以编程语言可以与页面进行交互.作为网页的面向对象的表示,它可要被脚本语言更改,例如JS.


DOM是面向对象语言(python, js, php,java等)的接口.DOM代表作为[[202302202238|节点]]树的HTML文档.


## 为什么需要DOM?
HTML是用来构建网页, JS是用来为网页添加行为.但JS不能直接理解HTML文档. 所以, 对应的文档被创建出来.
DOM基本上是用对象的方式表示相同HTML文档的不同格式. 



## 如何访问DOM

### [来源](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction#accessing_the_dom)

在页面中直接使用`document`或`window`对象的API来操作文档自身或其任意子元素.
注意: 通常不推荐在HTML中写javascript, javascript将放在一起并与HTML分离.

## 基本数据类型

### [来源](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction#fundamental_data_types)




## 使用DOM
`document`对象代表网页, 通过这个对象可以用来:
* 获取元素,
* 遍历元素,
* 操作元素,
* 操作属性,
* 操作样式
* 添加事件等

#### 来源
https://www.javascripttutorial.net/javascript-dom/


### 网页中的数据类型

| Data Type(Interface)       | Description                                                                   |
| -------------------------- | ----------------------------------------------------------------------------- |
| [[202303022253\|Document]] | 根document对象自身.(例如可以通过元素的`ownerDocument`来获取它属于的`document` | 
| Node                       |                                                                               |
| Element                    |                                                                               |
| NodeList                   |                                                                               |
| Attr                       |                                                                               |
| NamedNodeMap               |                                                                               |
|                            |                                                                               |




## 节点
节点是DOM树中任意对象的通用名称.



## 节点类型
DOM树中的节点被节点类型识别. JS使用整数来决定节点类型.


| constant                         | value | description                                                                  |
| -------------------------------- | ----- | ---------------------------------------------------------------------------- |
| Node.ELEMENT_NODE                | 1     | 元素节点,例如`<p>`, `<div>`                                                  |
| Node.TEXT_NODE                   | 3     | 元素或属性内的文本                                                           |
| Node.CDATA_SECTION_NODE          | 4     | A CDATASection, such as `<!CDATA[[ … ]]``>`.                                 |
| Node.PROCESSING_INSTRUCTION_NODE | 7     | A ProcessingInstruction of an XML document, such as `<?xml-stylesheet … ?> ` |
| Node.COMMENT_NODE                | 8     | 注释节点, 例如`<!-- ... -->`                                                 |
| Node.DOCUMENT_NODE               | 9     | 文档节点                                                                     |
| Node.DOCUMENT_TYPE_NODE          | 10    | 文档类型节点, 例如`<!DOCTYPE html>`                                          |
| Node.DOCUMENT_FRAGMENT_NODE      | 11    | 文档片段节点                                                                             |


## 获取节点
```js
node.nodeType
```





# Document
> [Document - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/Document)


`Document`接口代表浏览器中任何加载的网页,并提供作为网页内容的入口点,也就是DOM tree(DOM tree是树结构,其节点代表HTML或XML文档的内容.). DOM tree包含元素,例如`<body>`和 `<table>`,提供对文档的全局功能,例如如何获取页面的URL和创建新的元素.

`
`Document`接口描述任意类型文档的通用属性和方法. 根据文档类型,可以使用更大的API: HTML文档,以'text/html'内容类型提供,也实现HTMLDocument接口, 而XML/SVG文档实现XMLDocument接口.





## 构造函数

[`Document()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/Document "Document()")

Document构造函数创建一个新的文档对象,该对象是在浏览器中加载的网页,且作为页面内容的入口.




## 实例属性


### activeElement
>[Document: activeElement property - Web APIs | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement)

#### 是什么
>此只读属性接口返回当前是否被聚焦(focus)的元素DOM.
>通常情况下, 如果 [`HTMLInputElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement) 或者 [`HTMLTextAreaElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLTextAreaElement)元素中有文字被选中时， `activeElement`属性就会返回该元素。这时，你可以调用该元素的`selectionStart` 和 `selectionEnd` 属性获取更多选中文字的信息。其他情况下，焦点元素也可能是[`<select>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select)元素 (menu) 或者一个别的 [`<input>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input) 元素，比如 `"button"`、`"checkbox"` 或者 `"radio"`。

**注意事项**
> Focus(接收用户input事件的元素)与selection(当前文档高亮部分)不是一回事.
> 你可以通过使用'window.getSelection()'得到当前选中内容.

### 语法

```js
element = DocumentOrShadowRoot.activeElement
```

返回值:
* 当前获得焦点的Element
* 如果没有焦点元素, 会返回`<body>`或`null`

### 实例
**获取选中的文本**
```js
function onMouseUp(e) {
	const activeTextarea = document.activeElement
	const selection = activeTextarea.value.substring(
		activeTextarea.selectionStart, activeTextarea.selectionEnd
	)
}
```




## 实例方法

### checkValidity


### reportValidity


### select


### setCustomValidity


### setRangeText



### setSelectionRange



### showPicker


### stepDown


### stepUp





## 事件


### selectionchange(实验)

#### 概述
> [Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection)的`selectionchange`在Document当前的Selection改变时触发.
> 这个事件是不能取消的且不会冒泡
> 可以通过为`selectionchange`添加事件监听器或使用`onselectionchange`事件处理器来处理这个事件.

**注意**
此事件与`<input>或<textarea>`元素中选中文本变化时触发的`selectionchange`事件不完全一样.

#### 语法
```js
addEventListener("selectionchange", (event) => {});

onselectionchange = (event) => {};
```

#### 案例
选中文本时更改默认背景颜色为天蓝色
```js
// 最简单的方案, 是添加伪类 `::selection {background-color: skyblue;}`


//第一种方案 无法实现暂时
document.addEventListener('selectionchange', function(e) {
	// 选择用户选择的文本
	let selection = window.getSelection()
	// 获取所选文本的范围
	let range = selection.getRangeAt(0)
	// 获取所选文本的富节点
	let parent = range.commonAncestorContainer
	// 将父节点设置为可编辑状态
	parent.contentEditable = true
	// 将选中文本的背景色设置为天蓝色
	document.execCommand('styleWithCSS', null, true)
	document.execCommand('backColor', null, 'skyblue')
	// 取消父节点的可编辑状态
	parent.contentEditable = false
})



```









## 继承


## DOM相关页面



# 来源
https://developer.mozilla.org/en-US/docs/Web/API/Document







### HTMLDocument

由于历史原因. `Window`对象的一个属性,其值是Document接口. 可以认为`HTMLDocument`是`Document`的别名..
可以用来加载HTML页面到DOM中

它是一个函数,暂时没什么用. 