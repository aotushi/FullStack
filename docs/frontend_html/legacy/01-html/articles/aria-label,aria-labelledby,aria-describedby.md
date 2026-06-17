> https://www.tpgi.com/short-note-on-aria-label-aria-labelledby-and-aria-describedby/


## 如何使用aria-label,aria-labelledby,aria-describedby

### 背景
因为它们对所有的HTML元素并不总是能正常生效.

### 概述
* `aria-label`, `aria-labelledby`属性能用来给予元素一个可访问的名字.
* `aria-describedby`属性用来给元素一个可访问的描述.
* 不是所有的元素能被赋予可访问的名字和/或描述.

### 使用场景

* [交互元素](https://www.w3.org/TR/html52/dom.html#interactive-content): 
	* `a`标签(当含有href属性)
	* `audio`,`video`(含有control属性)
	* `input`(除非type='hidden')
	* `select`
	* `button`
	* `textarea`
* 具有[landmark role](https://www.w3.org/TR/wai-aria-1.1/#landmark_roles)的元素(地标角色,是页面中被当做导航地标的区域.最佳实践使用对应的HTML标签代替)
	* 隐式
		* HTML标签: header,footer,main,nav,aside,section,form
	* 显示
		* banner // 等于header标签
		* complementary  //等于aside标签
		* contentinfo
		* form
		* main
		* navigation
		* region
		* search
* 那些使用role属性来明确指定其作为widget(部件,例如按钮,链接等)部件的HTML元素
* `iframe`和`img`元素


