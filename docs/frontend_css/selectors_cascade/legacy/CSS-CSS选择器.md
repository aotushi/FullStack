---
aliases: CSS选择器索引
---



# 选择器分类
>CSS选择器可以分为4种，即选择器、选择符、伪类和伪元素。

## 4种选择器
### 选择器
> 平常使用的CSS声明块前面的标签、类名等

### 选择符
> 选择符有5种，即表示后代关系的空格（　）​、表示父子关系的箭头(>)、表示相邻兄弟关系的加号(+)、表示兄弟关系的波浪线(~)，以及表示列关系的双管道(||)

### 伪类
>伪类的特征是其前面有一个冒号(:)，通常与浏览器行为和用户行为相关联，可以看作CSS世界的JavaScript。


### 伪元素
> 伪元素的特征是其前面有两个冒号(::)，常见的有::before、::after、::first- letter和::first-line等。







## 选择器作用域(了解)

### 伪类:scope
目前虽然伪类:scope也能解析，但只能当作全局作用域。了解即可.

## CSS选择器命名空间(了解)

#### 如何使用

> 在CSS选择器世界中命名空间的作用也是避免冲突。例如，在HTML和SVG中都会用到`<a>`链接，此时就可能产生冲突，我们可以借助命名空间进行规避，具体方法是使用@namespace规则声明命名空间.

```less
@namespace url(http://www.w3.org/1999/xhtml); 
@namespace svg url(http://www.w3.org/2000/svg); 

/* XHTML中的<a>元素 */ 
a {} 

/* SVG中<a>元素 */ 
svg|a {} 


/* 同时匹配XHTML和SVG的<a>元素 */ 
*|a {}

```


CSS选择器命名空间很少使用,原因有二。其一，在HTML中直接内联SVG的应用场景并不多，它更多的是作为独立的SVG资源使用，即使内联，也很少有需要对特性SVG标签进行样式控制的需求；其二，有其他更简单的替代方案.
```css
svg a {}
```




## 选择器使用

### 无效CSS选择器应用
>很多CSS伪类选择器是最近几年才出现的，浏览器并不支持，浏览器会把这些选择器当作无效选择器.当这些无效的CSS选择器和浏览器支持的CSS选择器在代码中一起出现的时候，会导致整个选择器无效。


#### 1.分开书写
```css
/* IE浏览器可识别 */
.example:hover,
.example:active {
   color: red;
}
/* IE浏览器不可识别 */
.example:focus-within {
   color: red;
}
```


#### 2.`-webkit-`私有前缀
浏览器可以识别以-webkit-私有前缀开头的伪元素,可以使用这个特性来区分IE浏览器和非IE浏览器.

```css

/* IE浏览器 */
.example {
  background: black;
}
/* 其他浏览器 */
.example, ::-webkit-whatever {
  background: gray;
}
```


# 选择器



## 属性选择器

### 来源
> https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Attribute_selectors

### 存在和值选择器
#### 概述
又可以称作'属性值直接匹配选择器'

#### 集合

| 声明              | 案例                              | 作用                                                           |
| --------------- | ------------------------------- | ------------------------------------------------------------ |
| `[attr]`        | `[title]`                       | 选择带有`title`属性的所有元素                                           |
| `[attr]`        | li`[class]`                     | 选择带有class属性的`<li>`元素                                         |
| `[attr=value]`  | `a[href="https://example.com"]` | 精确匹配带有`attr`属性及值为`value`的元素                                  |
| `[attr~=value]` | `p[class~="special"]`           | 精确匹配带有`attr`属性及值为`value`的元素或匹配`attr`属性列表(以空格分离)中含有`value`的元素 |
| [attr\|=value]  | div[lang\|="zh"]                | 精确匹配带有`attr`属性及值为`value`的元素或匹配以`value`开头紧且跟连字号(`-`)的元素       |
|                 |                                 |                                                              |
|                 |                                 |                                                              |

```css
//选取的指定词汇必须是只以此词汇或者以此词汇+"-"的属性值
<div class="de"></div>
<div class="de-lang"></div>
//而不是连接起来作为整体值中以此词汇开头的,这种找不到
<div class="delang"></div>

```


#### 使用场景

**AMCSS开发模式**
> AMCSS是Attribute Modules for CSS的缩写，表示借助HTML属性来进行CSS相关开发。 --<CSS选择器世界(第2版)

AMCSS则是基于属性控制的，例如：
```css
<button button="large blue">按钮</button>
```
为了避免属性名称冲突，可以给属性添加一个统一的前缀，如am-，于是有：
```css
<button am-button="large blue">按钮</button>
```
然后借助[attr~="val"]这个属性值单词完全匹配选择器进行匹配。
当我们的布局或样式需要有一个专门的命名空间的时候，就采用AMCSS这种开发模式。






### 子字符串匹配选择器(substring matching selector)

#### 概述

| 声明              | 案例                  | 作用                       |
| --------------- | ------------------- | ------------------------ |
| `[attr^=value]` | `li[class^="box-"]` | 匹配属性以`box-`开头的元素         |
| `[attr$=value]` | `li[class$="-box"]` | 匹配有`-box`结尾的属性的元素        |
| `[attr*=value]` | `li[class*="box"]`  | 匹配在属性字符串任意位置包含`box`属性的元素 |




#### 使用场景
**搜索过滤**
```html

<input type="search" placeholder="输入城市名称或拼音" />
<ul>
   <li data-search="重庆市chongqing">重庆市</li>
   <li data-search="哈尔滨市haerbin">哈尔滨市</li>
   <li data-search="长春市changchun">长春市</li>
   ...
</ul>

<script>
var eleStyle = document.createElement('style');
document.head.appendChild(eleStyle);
// 文本框输入
input.addEventListener("input", function() {
   var value = this.value.trim();
   eleStyle.innerHTML = value ? '[data-search]:not([data-search*="'+ value +'"])
{ display: none; }' : '';
});
</script>
```






### 大小写敏感(Case-sensitivity)
在关闭括号前面使用字符`i`来匹配大小写不敏感的属性. 这个符号告诉浏览器匹配不区分大小写的ASCII字符.




## 标签选择器

### 注意事项
#### 1.不区分大小写
HTML标签不区分大小写,所以,标签选择器也不区分大小写.
```css
IMG {}
```

#### 2.任意元素匹配
只要出现再页面中的html元素就能匹配,无论是自定义/未知/SVG/特殊等等.
```html
<abc>1. 颜色是？</abc>
<cs-abc>2. 颜色是？</cs-abc>
abc { color: deepskyblue; }
cs-abc { color: deeppink; }
```

与布局无关的元素也可以匹配,例如`<head> <meta> <title> <script> <style>`元素等.
案例连接: https://demo.cssworld.cn/selector2/4/1-3.php
```css
// 可以让标题内容直接在页面中显示出来
head, title {
  display: block;
}

// 让页面内联样式可编辑,页面渲染效果所见即所得.经测试,需要先生命head的display样式为block
style {
  display: block;
	-webkit-user-modify: read-write-plaintext-only;
}
```


#### 3.通配选择器

**是什么**
> 通配选择器是一个特殊的标签选择器，它可以指代所有类型的标签元素，包括自定义元素以及`<script>、<style>、<title>`等元素，但是不包括伪元素。
> 当通配选择器和其他选择器级联使用的时候，星号是可以省略的。只有当单独使用通配选择器的时候，我们才需要把星号呈现出来

```
*[hreflang|=en]等同于[hreflang|=en]​；

*.warning等同于.warning；

*#myid等同于#myid。

body > * {}
```




## 类选择器

### 注意事项
#### 1.区分大小写
> 类选择器本质上匹配的是属性值，而属性值是区分大小写的，所以类选择器也区分大小写。
> 使用正则符来进行小写处理

```css
[class~='myname' i] {}
```


#### 2.任意级联
> 类选择器可以任意级联书写，也就是选择器前后连在一起，没有任何其他字符

```html
<p class="myName active">xxxx</p>

<style>
//可以匹配上面的html元素
 .active.myName.active.active {}
</style>
```


#### 3.空格只能分隔,无法匹配
> 多个类名间的空格无论有多少，位置在哪里，都无法通过类选择器匹配。并且即使空格通过HTML转义写法书写，类选择器也不会匹配

```html
<style>
	.myName.active { color: red; }
</style>

<p class="myName&#x20;active">zhangxinxu</p>
```

如果希望知道class属性值中是否有冗余的空格，则只能使用属性选择器进行匹配来识别。
```css
[class="test "] {}

<p class="test ">aaaa</p>
```

## ID选择器

### 注意事项
#### 1.使用时必须是完整id属性值
```html
<button id="cs-button cs-button-primary">主按钮</button>
#cs-button {}              /* 无效 */
#cs-button-primary {}      /* 无效 */

#cs-button\20 cs-button-primary {} //有效

#cs-button\0020cs-button-primary {} //有效 转义空格

[id~="cs-button"] {}  //有效 使用属性值匹配选择器
[id~="cs-button-primary"] {} //有效 同上
```







## 选择符-后代选择符

### 使用事项

#### 当包含后代选择符的时候，整个选择器的优先级与祖先元素的DOM层级没有任何关系，这时要看落地元素的优先级。

```html

<div class="lightblue">
   <div class="darkblue">
      <p>1. 颜色是？</p>
   </div>
</div>
<div class="darkblue">
   <div class="lightblue">
      <p>2. 颜色是？</p>
   </div>
</div>
.lightblue p { color: lightblue; }
.darkblue p { color: darkblue; }
```

1和2的颜色分别是什么?
落地元素就是最后的`<p>`元素。两个`<p>`元素彼此分离，非嵌套，因此DOM层级平行，没有先后之分。再看选择器的优先级，`.lightblue p`和`.darkblue p`出现了一个类选择器（数值10）和一个标签选择器（数值1）​，选择器优先级数值一样。此时就要看它们在CSS文件中的位置，遵循“后来居上”的规则，由于.darkblue p位置靠后，因此`<p>`都是按照color:darkblue进行颜色渲染的，于是，最终1和2的文字颜色都是深蓝色。

#### JS中对后代选择符的使用介绍
**querySelectorAll**
`querySelectorAll`获取的是整个页面符合条件的DOM元素.

```html
<div id="myId">
   <div class="lonely">单身如我</div>
   <div class="outer">
      <div class="inner">内外开花</div>
   </div>
</div>

// 1. 长度是？
document.querySelectorAll('#myId div div').length;  //1
// 2. 长度是？
document.querySelector('#myId').querySelectorAll('div div').length; //3
```

想让querySelectorAll后面的选择器不是全局匹配，也是有办法的，可以使用:scope伪类
```js
// 3. 长度是？
document.querySelector('#myId').querySelectorAll(':scope div div').length;
```


#### :scope伪类
**概述:**
* 除了IE/Edge, 其它浏览器均支持
* 目前作用和`:root`伪类相似
* 和JS Api交互较多. `:scope`伪类为参考元素伪类，而不是作用域伪类。

因为如今的网页只有一个CSS作用域，所以:scope伪类等同于:root伪类。
```css
// 下面两个CSS选择器的效果相同

:scope {
   background-color: skyblue;
}

:root {
   background-color: skyblue;
}
```

用来区分IE/Edge和其它浏览器
```css

/* IE/Edge */
.cs-class {}
/* Chrome/Firefox/Safari等其他浏览器 */
:scope .cs-class {}



//第二种方法 更推荐
/* IE/Edge */
.cs-class {}
/* Chrome/Firefox/Safari等其他浏览器 */
:scope, .cs-class {}
```


与JS Api交互较多
> 这些API包括querySelector()、querySelectorAll()、matches()和Element.closest()。

```js

document.querySelector('#myId').querySelectorAll(':scope div div');
```

此时':scope div div'中的:scope匹配的就是#myId元素，语义就是返回页面中既匹配#myId div div选择器又是#myId子元素的元素。





## 选择符-子选择符(>)

### 子选择符和后代选择符区别
* 子选择符只匹配第一代子元素，而后代选择符会匹配所有子元素。


### 使用建议

#### 1.能不用就不用,维护成本较高

#### 2.使用场景
##### 1).状态类名控制
例如，使用.active类名进行状态切换，会遇到祖先和后代都存在.active切换的场景，此时子选择符是必需的，可以避免影响后代元素，例如：
```css
.active > .cs-module-x {}
```

##### 2).标签受限
例如，当`<li>`标签重复嵌套，同时我们无法修改标签名称或者设置类名的时候（例如WordPress中的第三方小工具）​，就需要使用子选择符进行精确控制。
```css
.widget > li {}
.widget > li li {}
```

##### 3).层级位置与动态判断
例如，一个时间选择组件的HTML通常会放在`<body>`元素下，作为`<body>`的子元素以绝对定位浮层的形式呈现。但有时候其需要以静态布局嵌在页面的某个位置，这时如果我们不方便修改组件源码，则可以借助子选择符快速打一个补丁：
```css
:not(body) > .cs-date-panel-x {
   position: relative;
}
```



## 选择符-相邻兄弟选择符(+)


### 实例

#### 1.实现`:first-child`伪类效果

```css
// > IE8
.cs-li:not(:first-child) { margin-top: 1em; }

// 兼容IE8
.cs-li { margin-top: 1em; }
.cs-li:first-child { margin-top: 0; }

// 借助相邻兄弟选择器
.cs-li + .cs-li { margin-top: 1em; }
```


#### 2.低成本交互效果
相邻兄弟选择符最有价值的应用还是配合诸多伪类以低成本实现很多实用的交互效果，它是众多高级选择器技术的核心。

例如, 聚焦输入框时,显示文字.
```html
用户名：<input><span class="cs-tips">不超过10个字符</span>

.cs-tips {
   color: gray;
   margin-left: 15px;
   position: absolute;
   visibility: hidden;
}
:focus + .cs-tips {
   visibility: visible;
}
```



## 选择符-随后兄弟选择符(~)



## 选择符-列选择符(||)


## 伪类






# 优先级

^0da5c3


> CSS中的优先级规则分为两大类，一类称为继承，另一类称为级联。- `<CSS选择器世界(第2版) 2.1 继承与级联`


## 继承
> 关于继承，只需要记住这样一句话：被继承的CSS声明的优先级一定位于整个CSS世界的底层。

举个例子:
> 对于 ::first-line 伪元素,直接应用的属性总是优先于继承的属性,即使继承的属性使用了 !important。


```html
<p id="text">文字</p>

p::first-line {color: blue;}
#text { color: green !important}
```


如果一个CSS属性同时继承自多个元素，则DOM层级越深的元素所继承的CSS优先级越高。


## 级联

### 级联规则

^1b53fa

> 在CSS的继承与级联规则中，级联层的优先级定义为以下10项。

(1)transition过渡声明；
(2)设置了!important的浏览器内置样式；
(3)设置了!important的用户设置的样式；
(4)@layer规则中设置的包含!important的样式；
(5)开发者设置的包含!important的样式；
(6)animation动画声明；
(7)开发者设置的CSS样式；
(8)@layer规则中的CSS样式；
(9)用户设置的CSS样式；
(10)浏览器内置的CSS样式。


#### 注意事项
* 对于transition过渡声明，规则中称其优先级最高，位于顶级，但是无论如何测试它都是一个普通的CSS属性行为，并不具有规则所称的具有顶级的层级
* 对于animation动画声明，在规则中，其优先级低于!important属性，但是实际测试结果却不是这样的：除Firefox浏览器之外的所有浏览器，包括Chrome、Safari、Edge甚至IE浏览器，其@keyframes规则中的CSS优先级都高于!important。
* 浏览器内置样式，官方说法叫作“用户代理样式, 在右上角会有user agent stylesheet的标识，中文版显示的是“用户代理样式表”​。
* 用户设置样式，这指的是用户通过某些行为带来的样式，例如浏览器自身提供的样式设置选项，或者是安装了某个浏览器插件。在右上角会有injected stylesheet字样，中文版显示的是“注入样式表”​。
* 开发者设置的样式，其实就是Web前端开发人员日常所写的CSS代码，无论是内联在HTML中的CSS还是CSS文件中的代码，都属于这个级联层

级联层的优先顺序: 日常开发代码>@layer开发代码>插件注入代码>浏览器内置代码
开发者设置的级联层优先级最高，浏览器内置的级联层的优先级最低。每个层级中的任何CSS的优先级都不可能比它上面的层级高。


## @layer规则
> 作用是可以让CSS代码的级联层级降低，因为@layer规则的级联层级比常规的CSS代码的级联层级低。


### 语法规则
```css
@layer {rules} 
@layer layer-name {rules}; 
@layer layer-name; 
@layer layer-name, layer-name, layer-name;
```

@layer {rules}语法没有任何层级名，称为**匿名级联层**，而下面3种语法均需要自定义级联层的名称，称为**命名级联层**。


#### 1.匿名级联层


#### 2.命名级联层-命名带规则语法
和匿名级联层语法的唯一区别就是多了一个名称，便于开发人员识别与管理
```css
@layer button {
	.container .some-button {
		height: 30px;
	}
}

@layer link {
	:any-link {
		color: blue;
	}
}
```


#### 3.命名级联层-单命名语法
>@layer layer-name主要用于灵活设置@layer规则之间的优先级顺序。
```css
@layer peacock;

/* ……大量的CSS代码…… */
/* ……大量的CSS代码…… */
/* ……大量的CSS代码…… */

/* 虽然我位置靠后，但我优先级最低 */
@layer peacock {
  .bottom-layer {
      content: 'hello world'
  }
}


// 虽然@layer peacock{}出现在CSS语句的最后面，但是由于在开头设置了@layer peacock;这行代码，peacock这个级联层中的所有CSS代码的优先级都是最低的。
```


#### 4.命名级联层-多命名语法
> @layer layer-name, layer-name, layer-name这个多命名语法和@layer layer-name这个单命名语法的作用是类似的，也是用来灵活调整@layer规则的整体优先级的。
> 在默认情况下，@layer规则内CSS声明的优先级取决于先后顺序

```css
// 默认情况, 后面的优先级高于前面的
@layer b1 {
	button {
		padding: 10px;
	}
}

@layer b2 {
	button {
		padding: 20px; /* 生效 */
	}
}

// 多命名语法调整优先级顺序
@layer b2, b1;
@layer b1{
	button {
		padding: 10px; /* 生效 */
	}
}
@layer b2 {
	button {
		padding: 20px;
	}
}
```



### 嵌套
> @layer规则还支持更加复杂的嵌套语法。每多一层@layer，样式的优先级就降低一层。

**@layer嵌套优先级**
```css
@layer outer {
    button { 
		    /* 生效的样式*/
        width: 100px;
        height: 30px;
    }
    @layer inner {
        button {
            height: 40px;
            width: 160px;
        }
    }
}
```


**点(.)级联语法**
> 内外嵌套的语法还可以使用字符点(.)进行连接，例如，上面例子中的CSS代码和下面的CSS代码的效果是完全一样的.
> 嵌套层数不限.

```css
@layer outer {
  button {
    width: 100px;
    height: 30px;
  }
}
@layer outer.inner {
  button {
    height: 40px;
    width: 160px;
  }
}
```


**多嵌套语法下的优先级**
> 当存在多个@layer规则，同时这些@layer规则之间都有嵌套关系的时候，各个CSS声明的优先级又是怎样的呢？只需要记住这样一句话：内层@layer规则的优先级由外层@layer规则决定。

```css
// 这里layer-name是汉字
@layer 甲 {
  p { color: red; }
  @layer 乙 {
    p { color: green; }
  }
}
@layer 丙 {
  p { color: orange; }
  @layer 丁 {
    p { color: blue; }
  }
}
```



### 实践

#### 整个CSS变成@layer
> 使用@import来实现第三方CSS,例如CDN引入的CSS,变成低优先级的级联层.

**如何实现?**
> 在@import语法后面添加一个layer(some-name?),支持匿名引入语法;

```css
@import './example.css' layer(example); //example自定义名称可加可不加

//或 
@import './example.css' layer;
```

**如何调整引入CSS优先级**
> 参照多命名语法的用法

```css
layer button, example;
@import './example.css' layer(example);
@layer button {}
```

****


## !important

### !important逆向跨越
> 回顾一下[[CSS-CSS选择器#^1b53fa]]级联的10个优先级.发现!important的级联层的提升规则是逆向越级.

#### 是什么
> !important逆向越级指的是,原本级联层级高的CSS使用了!important后,优先级反而低;原本级联层低的CSS使用了!important后,优先级反而高.

#### 案例
浏览器内置样式,如果后面跟着!important,那它的优先级最高,无法更改;
注入的CSS中包含!important,开发人员无法重置.这也开发者无法更改广告拦截插件中的CSS的原因.


<hr>


## CSS选择器的优先级

### 同等级CSS优先级规则概述
每一个级联层中的CSS优先级也有明显的不可跨越的等级，我们将其划分为0～4共5个等级，其中前4个等级由CSS选择器决定，最后一个等级由书写形式决定。

#### 5级分类表

| 级别  | 包含哪些?              | 案例  |     |
| --- | ------------------ | --- | --- |
| 0级  | 通配选择器, 选择符, 逻辑组合伪类 |     |     |
| 1级  | 标签选择器              |     |     |
| 2级  | 类选择器,属性选择器,伪类      |     |     |
| 3级  | ID选择器              |     |     |
| 4级  | style属性内联          |     |     |


#### 0级
通配选择器,写作`*`.
选择符指空格,>,+,~,||
逻辑组合伪类有`:not(), :is(), :where()`等, 这些伪类不会影响优先级,影响优先级的是括号内的选择器(`:where()`比较特殊，括号内参数的优先级永远是0). 也只有逻辑组合伪类的优先级是0,其它伪类优先级不是.



### CSS选择器优先级的计算规则

#### 是什么
> CSS选择器优先级的计算规则,业界流传甚广的是**数值计算法**.每一段CSS语句的选择器都可以对应一个具体的优先级数值,数值越大优先级越高,其中的CSS语句将被优先渲染.
> 其中: 0级选择器,优先级数值为0; 1级选择器,优先级数值为1; 2级选择器,优先级数值为10; 3级选择器,优先级数值为100
> 


#### 案例

<span style="color:blue">一个选择器的优先级可以说是由四个部分相加 (分量)，可以认为是个十百千 — 四位数的四个位数：</span>

1. **千位**： 如果声明在 [`style`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes#attr-style) 的属性（内联样式）则该位得一分。这样的声明没有选择器，所以它得分总是1000。
2. **百位**： 选择器中包含<u>ID选择器</u>则该位得一分。
3. **十位**： 选择器中包含<u>类选择器、属性选择器、伪类</u>则该位得一分。
4. **个位**：选择器中包含<u>元素、伪元素选择器</u>则该位得一分。

**注**: <span style="color:blue">通用选择器 (`*`)，组合符 (`+`, `>`, `~`, ' ')，和逻辑伪类 (`:not`) 不会影响优先级。</span>

在进行计算时不允许进行进位，例如，20 个类选择器仅仅意味着 20 个十位，而不能视为 两个百位，也就是说，无论多少个类选择器的权重叠加，都不会超过一个 ID 选择器。



| 选择器                                    | 千位 | 百位 | 十位 | 个位 | 优先级 |
| :---------------------------------------- | :--- | :--- | :--- | :--- | :----- |
| `h1`                                      | 0    | 0    | 0    | 1    | 0001   |
| `h1 + p::first-letter`                    | 0    | 0    | 0    | 3    | 0003   |
| `li > a[href*="en-US"] > .inline-warning` | 0    | 0    | 2    | 2    | 0022   |
| `#identifier`                             | 0    | 1    | 0    | 0    | 0100   |
| 内联样式                                  | 1    | 0    | 0    | 0    | 1000   |

**选择器优先级图表**

![](https://justcode.ikeepstudying.com/wp-content/uploads/2016/07/css_weight.png)


#### 应用

##### 提升CSS选择器优先级的几种方法
通常方法是增加嵌套,或者是增加一个标签选择器. 但这些不是好方法.

**1.重复选择器自身**
```css
div.foo {}


// 重复选择器自身 降低耦合
.foo.foo {}
```


**2.借助必然存在的属性选择器**
```css
.foo[class]{}
#foo[id] {}
```

**3.巧用:not伪类**
```css
.foo:not(abc) {}
#foo:not(xyz) {}
```

#### 点评
CSS选择器优先级数值计算法实际上是一个不严谨的方法.例如由于1和10之间的差距过小导致连续10个标签选择器的优先级和1个类选择器的优先级相当。然而事实并非如此，**不同选择器优先级等级的差距是无法跨越的。**


## CSS选择器命名

### 是否区分大小写
> 在HTML中，标签和属性都是不区分大小写的，而属性值是区分大小写的。于是，相对应地，在CSS中，标签选择器不区分大小写，属性选择器中的属性也不区分大小写，而类选择器和ID选择器本质上是属性值，因此要区分大小写。
> 然而，随着各大浏览器支持属性选择器中的属性值时也不区分大小写（在]前面加一个i）​，已经没有严格意义上的对大小写敏感的选择器了，因为类选择器和ID选择器本质上也是属性选择器。
> 因此，如果希望HTML中的类名对大小写不敏感，可以这样：

```css
[class ~='val' i] {}
```


### 命名合法性

#### 命名规则图
> CSS选择器世界(第2版) 3.2




> 类选择器和ID选择器命名时, 可以使用数字开头,但不是直接使用数字,需要将其转义

#### 数字开头
* 选择器命名,开头可以使用转义后的数值,建议使用完整的16进制,避免CSS压缩工具去除空格;
```css
.1-foo {} //无效写法,不能直接写数字

.\31 -foo{} //`\31 `是CSS字符1的16进制转义表示

.\000031-foo {} //使用完整的16进制写法,就不用再后面添加空格
```

#### 其它字符开头
**不合法的ASCII字符**: 
包括IE在内的浏览器都支持上面的斜杠转义写法，
```bash
如!、"、#、$、%、&、'、(、)、*、+、,、-、.、/、:、;、<、=、>、?、@、​[​、\、​]​、^、`、{、|、}、~

//上述字符可以无需使用转义字符表示, 可直接搭配斜杠来转义.例如:

.\+foo{}
```



**中文字符/中文标点字符/emoji字符**
以下CSS选择器均有效
```css
.我是foo {}


.。foo {}

.☺ { color: red; }
```

**短横线**
规则:
* 如果是一根短横线(-)，那么短橫线后面必须有其他字符、字母、下划线或者其他编码字符；
* 如果是两根连续的短横线(--)，则它的后面即使不跟任何字符也是合法的.


### 如何命名

#### 规则总结
##### 1.长命名还是短命名
> CSS选择器的语义和HTML的语义是不一样的，前者只是为了便于人们识别，它对机器而言没有任何区别，因此价值无法体现；所以长命名和短命名之间,选择短命名.


```css
//推荐
.some-intro { line-height: 1.75; }

//不推荐
.some-introduction { line-height: 1.75; }
```


##### 2.单命名还是组合命名

单命名的优点是字符少、书写快，缺点是容易出现命名冲突的问题；组合命名的优点是不容易出现命名冲突，但书写起来较烦琐

##### 3.不要使用拼音

##### 4.参考HTML,XML标签命令方式
> HTML标签本身就是非常好的语义化的短命名，且其数量众多，我们大可直接借鉴。
> 这些命名可以不和HTML标签一一对应，例如：
> 例如:

```css
.cs-module-header {}
.cs-module-body {}
.cs-module-aside {}
.cs-module-main {}
.cs-module-nav {}
.cs-module-section {}
.cs-module-content {}
.cs-module-summary {}
.cs-module-detail {}
.cs-module-option {}
.cs-module-img {}
.cs-module-footer {}
```

**推荐写法**
* 对于列表/链接,很多人可能会使用'list/link',不过也可以直接使用'li/a',更加简洁高效.
```css
<div class="cs-module-ul" role="listbox">
   <a href class="cs-module-li" role="option">菜单内容1</a>
   <a href class="cs-module-li" role="option">菜单内容2</a>
   <a href class="cs-module-li" role="option">菜单内容3</a>
   <a href class="cs-module-li" role="option">菜单内容4</a>
   <a href class="cs-module-li" role="option">菜单内容5</a>
</div>


.cs-module-li {}    /* 列表 */
.cs-module-a {}     /* 链接 */
```

* 对于组,描述,盒子的推荐写法
```css
.cs-module-g {}       /* 组 */
.cs-module-desc {}    /* 描述 */


.cs-module-x {}    /* module容器盒子 */
```

使用x代替box的原因很有意思: 1.box频率使用对象集中; 2.x代替box,节省字节(1个英文字符是1byte,); 3.x比较周正,视觉观感良好.

##### 5.参考HTML特定属性
* 表单元素的type属性
```css
.cs-radio {}
.cs-checkbox {}
.cs-range {}

.cs-tspan-email {}
.cs-tspan-number {}
.cs-tspan-color {}
.cs-tspan-tel {}
.cs-tspan-date {}
.cs-tspan-url {}
.cs-tspan-time {}
.cs-tspan-file {}

.cs-grid {}
.cs-grid-cell {}
.cs-log {}
.cs-menu {}
.cs-menu-bar {}
.cs-menu-item {}
.cs-region {}
.cs-row {}
.cs-slider {}
.cs-tab {}
.cs-tab-list {}
.cs-tab-panel {}
.cs-tooltip {}
.cs-tree {}

```


##### 6.参考CSS伪类和HTML布尔属性中
激活状态的状态类名.active源自伪类:active；
禁用状态的状态类名.disabled源自伪类:disabled或HTML disabled属性；
列表选中状态的状态类名.selected源自HTML selected属性；
选中状态的状态类名.checked源自伪类:checked或HTML checked属性；
出错状态的状态类名.invalid源自伪类:invalid。


### CSS选择器最佳实践

#### 1.不使用ID选择器

#### 2.不要嵌套选择器
* 正确选择器的用法,全部使用无嵌套的纯类选择器.
* 基本布局使用没有嵌套,没有级联的类选择器
```css
//嵌套 不推荐
<nav class="nav">
   <a href>链接1</a>
   <a href>链接2</a>
   <a href>链接3</a>
</nav>
.nav {}
.nav a {}

//不嵌套 推荐
<div class="box">
   <figure class="pic">
      <img src="./example.png" alt="示例图片">
      <figcaption><i class="icon"></i>图片标题</figcaption>
   </figure>
</div>
.box {}
.box .pic {}
.box .pic .icon {}

// 嵌套 不推荐
<div class="box">
   <figure class="pic">
      <img src="./example.png" alt="示例图片">
      <figcaption><i class="icon"></i>图片标题</figcaption>
   </figure>
</div>
.box {}
.box .pic {}
.box .pic .icon {}

// 不嵌套 推荐
<div class="cs-box">
   <figure class="cs-box-pic">
      <img src="./example.png" alt="示例图片">
      <figcaption><i class="cs-box-pic-icon"></i>图片标题</figcaption>
   </figure>
</div>
.cs-box {}
.cs-box-pic {}
.cs-box-pic-icon {}
```

#### 3.合理使用面向属性的命名

**介绍**
使用选择器的属性名和属性值搭配的类名

**使用场景**
> 我习惯将一个网站的页面归纳为下面几部分：公用结构、公用模块、UI组件、精致布局和一些细枝末节.
> 公用结构、公用模块、UI组件、精致布局都不适合使用面向属性的类名;
> 一些细枝末节和特殊场景下的微调则非常适合这种面向属性的命名

**实例**
1.某个图片,希望dispaly表现为block.这张图片只用一次.
如果使用类名选择器, 类名的意义在于重复利用,如果只用一次,则没有必要;
如果使用标签选择器, 则降低了代码质量,增加了维护成本.
```css
.pic_default_img { display: block; }


.dd_succ .pic_default img { display: block; }


```

```html
<figure class="pic_default"> <img src="1.png" class="db"> </figure>
```

#### 4.正确使用状态类名

基于状态类名实现交互控制可以有效降低日后的维护成本
* active disabled checked selected open等

**使用建议**
> 建议状态类名的命名也尽可能和原生控件的标准HTML属性一致，这样代码更易读。
> 例如对于自定义单复选框的选中状态，建议使用.checked；对于自定义下拉列表的选中状态，建议使用.selected；对于自定义弹框，建议使用.open。其余全部可以采用.active。


## 选择器最佳实践
### 1.命名书写
#### 1) 建议命名使用小写,采用英文单词或缩写.专有名词可以使用拼音.

```css
.cs-logo-youku {}
```

不建议使用驼峰式命名.建议将驼峰式命名应用于JS DOM,以便和CSS样式类名区分.

#### 2) 对于组合命名,可以用短横线或下划线连接,可以组合使用短横线和下划线,也可以使用连续的短横线或下划线连接,保持一致.
组合个数没有必要超过5个.
```css
.cs-logo-youku {}
.cs_logo_youku {}
.cs-logo--youku {}
.cs-logo__youku {}
```

#### 3) 设置统一前缀,强化品牌又避免样式冲突
```css
.cs-header {}
.cs-logo {}
.cs-logo-a {}
```

### 2.选择器类型
> 根据选择器的使用类型，我将网站CSS样式分为3个部分，分别是CSS重置样式、CSS基础样式和CSS交互变化样式。

1.不建议使用ID选择器,必须要用的情况下,使用属性选择器代替
```css
[id="someId"] {}
```

2.CSS样式重置用标签选择器或属性选择器等
```css
body, p { margin: 0; }

[type="radio"],
[type="checkbox"] {
   position: absolute; clip: rect(0 0 0 0);
}
```

3.所有CSS基础样式全部使用类选择器，没有层级，没有标签。
```css
.cs-module .img {}    /* 不建议 */
.cs-module-ul > li {}    /* 不建议 */
```

4.所有选择器嵌套或者级联以及所有伪类都在CSS交互样式发生变化的时候使用
```css

.cs-content.active {
   height: auto;
}
.active > .cs-content-more {
   display: none;
}

.cs-button:active {
   filter: hue-rotate(5deg);
}
.cs-input:focus {
   border-color: var(--blue);
}
```