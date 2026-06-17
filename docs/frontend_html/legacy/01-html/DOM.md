---

---

# DOM介绍

> DOM是文档对象模型，全称为Document Object Model。DOM用一个逻辑树来表示一个文档，树的每个分支终点都是一个节点，每个节点都包含着对象。DOM提供了对文档结构化的表述，通过绑定不同的事件可以改变文档的结构、样式和内容，从而能实现“动态”的页面。



对DOM的所有操作都是document对象开始.它是DOM的主'入口点',从它我们可以访问任何节点.

最顶层的树节点可以直接作为document的属性来使用:

```js
<html> = document.documentElement    
<body> = document.body 
<body> = document.head
```



**可能的问题**

document.body的值可能是null

脚本无法访问在运行时不存在的元素.尤其是如果一个脚本在head标签中,那么脚本是无法访问到document.body的,因为浏览器没有读到它.



# DOM选择器

> DOM选择器用于快速定位DOM元素。在原生的JavaScript中有提供根据id、name等属性来查找的传统选择器，也有新型的、更高效的querySelector选择器和querySelectorAll选择器，支持丰富的元素、属性、内容选择等。

## 选择器种类
* 通过id定位
* 通过class定位
* 通过name属性定位
* 通过标签名定位
* querySelector选择器
* querySelectorAll选择器
* 

<u>1. 通过id定位元素 返回匹配到id的第一个元素</u>

```js
document.getElementById('xxx')
```

<u>2.通过class定位</u>

通过类名定位元素，返回由匹配到的元素构成的HTMLCollection对象，它是一个类数组结构。

```js
document.getElementsByClassName('xxx');
```

返回值为一个HTMLCollection对象，里面包含匹配到的元素. 如下是匹配到的两个li元素

```js
HTMLCollection(2) [li.one, li
 - 0: li.one
 - 1: li.one
 - length: 2
 -  _ _proto_ _:  HTMLCollection
```



<u>3. 通过name属性定位</u>
通过元素标签上的name属性进行定位，返回由匹配到的元素构成的NodeList对象，它是一个类数组结构。
```js
<input type='hidden' name='up'/>

document.getElementsByName('up');
```

返回的值为一个NodeList对象，里面包含匹配到的name属性为“node”的元素。
```js
NodeList(3) [li, li, li]
 - 0: li
 - 1: li
 - 2: li
 - length: 3
 -  _ _proto_ _:  NodeList
```



<u>4. 通过标签名定位</u>
通过标签名定位元素，返回由匹配到的元素构成的HTMLCollection对象。
```js
document.getElementsByTagName('xxx');
```

返回值为一个HTMLCollection对象，里面包含匹配到的元素值.
```js
HTMLCollection(2) [ul, ul]
- 0: ul
- 1: ul
- length: 2
- _ _proto_ _: HTMLCollection
```



<u>5.querySelector选择器</u>
* querySelector选择器返回的是在基准元素下，选择器匹配到的元素集合中的第一个元素。
* baseElement是基准元素，返回的元素必须是匹配到的基准元素的第一个子元素。该基准元素可以为Document，也可以为基本的Element。
* selectors是一个标准的CSS选择器
```js
element = baseElement.querySelector(selectors);
```

使用案例:
```html
<div>
  <h5>Original content</h5>
  <span>outside span</span>
  <p class="content">
    inside paragraph
    <span>inside span</span>
    inside paragraph
</p>
  </div>
```
1.获取p元素下的第一个span元素
```js
document.querySelector('p span').innerText; // inside span
```

2.获取class为content下的元素的第一个span元素
```js
document.querySelector('.content span').innerText; // inside span
```

3.获取第一个span或者h5元素
```js
document.querySelector('h5, span').innerText // Original content
```

然后通过以下这段代码来验证上述返回值的匹配过程。
```js
var baseElement = document.querySelector("p");
console.log(baseElement.querySelector("div span").innerText); // inside span
```
第一行代码获取的基准元素为p元素，第二行代码中的选择器为“div span”。<span style="color:blue">虽然在p元素中没有div元素，却依旧能匹配到span元素。这是因为在匹配过程会优先找出div元素下span元素的集合</span>，然后判断span元素是否属于p元素的子元素，最后返回第一个匹配到的span元素值。



<u>6.querySelectorAll选择器</u>

querySelectorAll选择器与querySelector选择器类似，区别在于querySelectorAll选择器会返回基准元素下匹配到的所有子元素的集合。返回值是一个NodeList的集合

语法
```js
elementList = baseElement.querySelectorAll(selectors);
```

querySelectorAll选择器匹配过程与querySelector选择器一样，优先获取所有匹配元素的集合，然后判断每个元素是否属于基准元素。如果属于则返回结果，最终返回一个NodeList对象。

一个页面是不允许有相同id的元素的。如果出现了相同的id，则无法通过getElementById()函数获取到除第一个元素以外的元素。

但是对于querySelectorAll选择器来说却是一个特例。将id选择器传入querySelectorAll选择器中后，可以通过id获取多个匹配的元素，然后通过索引获取特定的值。

# HTMLCollection对象与NodeList对象

> children属性和childNodes属性的不同在本质上是HTMLCollection对象和NodeList对象的不同。HTMLCollection对象与NodeList对象都是DOM节点的集合，但是在节点处理方式上是有差异的。

```html
<div id="main">
    <p class="ﬁrst">ﬁrst</p>
    <p class="second">second<span>content</span></p>
</div>
<script>
    var main = document.getElementById("main");
    console.log(main.children);
    console.log(main.childNodes);
</script>
```



```js
HTMLCollection(2) [p.ﬁrst, p.second]
 - 0: p.ﬁrst
 - 1: p.second
 - length: 2
 -  _ _proto_ _:  HTMLCollection
NodeList(5) [text, p.ﬁrst, text, p.second, text]
 - 0: text
 - 1: p.ﬁrst
 - 2: text
 - 3: p.second
 - 4: text
 - length: 5
 -  _ _proto_ _:  NodeList
```



## HTMLCollection对象

HTMLCollection对象具有length属性，返回集合的长度，可以通过item ()函数和namedItem()函数来访问特定的元素。

**item()函数**

HTMLCollection对象可以调用item()函数，通过序号来获取特定的某个节点，超过索引则返回“null”。

```js
<div id="main">
    <p class="ﬁrst">ﬁrst</p>
    <p class="second">second</p>
    <p class="third">third</p>
    <p class="four">four</p>
</div>
<script>
    var main = document.getElementById("main").children;
    console.log(main.item(0));
    console.log(main.item(2));
</script>
```

通过item()函数定位第一个和第三个子元素，输出结果如下所示。

```js
<p class="first">first</p>
<p class="third">third</p>
```



**namedItem()函数**

> namedItem()函数用来返回一个节点。首先通过id属性去匹配，然后如果没有匹配到则使用name属性匹配，如果还没有匹配到则返回“null”。当出现重复的id或者name属性时，只返回匹配到的第一个值。



```html
<form id="main">
    <input type="text" id="username">
    <input type="text" name="username">
    <input type="text" name="password">
</form>

<script>
    var main = document.getElementById("main").children;
    console.log(main.namedItem('username'));

</script>
```

在定义了id和name属性均为“username”值的两个元素后，最后输出的结果是id为“username”的元素。

```html
<input type="text" id="username">
```



## NodeList对象

NodeList对象也具有length属性，返回集合的长度，也同样具有item()函数，通过索引定位子元素的位置



### HTMLCollection对象和NodeList对象的实时性

> HTMLCollection对象和NodeList对象并不是历史文档状态的静态快照，而是具有实时性的。对DOM树新增或者删除一个相关节点，都会立刻反映在HTMLCollection对象与NodeList对象中。
>
> HTMLCollection对象与NodeList对象都只是类数组结构，并不能直接调用数组的函数。而通过call()函数和apply()函数处理为真正的数组后，它们就转变为一个真正的静态值了，不会再动态反映DOM的变化。



```js
<form id="main">
    <input type="text" id="username">
    <input type="text" name="password">
</form>

<script>
    // 获取HTMLCollection
    var mainChildren = document.getElementById('main').children;
        console.log(mainChildren.length);  // 2

    // 新增一个input元素
    var newInput = document.createElement('input');
    main.appendChild(newInput);
    console.log(mainChildren.length);  // 3

    // 通过call()函数处理成数组结构
    mainChildren = Array.prototype.slice.call(mainChildren, 0);
    mainChildren.splice(1, 1);
    console.log(mainChildren.length);  // 2

    // 再新增一个input元素
    var newInput2 = document.createElement('input');
    main.appendChild(newInput2);
    console.log(mainChildren.length);  // 2  不是实时的

</script>
```



NodeList对象与HTMLCollection对象相比，存在一些细微的差异，主要表现在不是所有的函数获取的NodeList对象都是实时的。例如通过querySelectorAll()函数获取的NodeList对象就不是实时的。



```html
<ul id="main">
    <li>文本1</li>
    <li>文本2</li>
    <li>文本3</li>
    <li>文本4</li>
    <li>文本5</li>
</ul>

<script>
    // 获取ul
    var main = document.getElementById('main');
    // 获取li集合
    var lis = document.querySelectorAll('ul li');
    // 第一次输出li集合长度，值为5
    console.log(lis.length);

   // 新增li元素
    var newLi = document.createElement('li');
    var text = document.createTextNode('文本8');
    newLi.appendChild(text);
    main.appendChild(newLi);
    // 再次输出li集合长度，值为5
    console.log(lis.length);
    // 重新获取li的集合并输出长度，值为6
    console.log(document.querySelectorAll('ul li').length);
</script>
```



综上所述，HTMLCollection对象和NodeList对象具有以下的相同点和不同点。

相同点

* 都是类数组对象，有length属性，可以通过call()函数或apply()函数处理成真正的数组。·
* 都有item()函数，通过索引定位元素。·
* 都是实时性的，DOM树的变化会及时反映到HTMLCollection对象和NodeList对象上，只是在某些函数调用的返回结果上会存在差异。

不同点:

* HTMLCollection对象比NodeList对象多个namedItem()函数，可以通过id或者name属性定位元素
* HTMLCollection对象只包含元素的集合（Element），即具有标签名的元素；而<span style="color:blue; font-weight: bold;">NodeList对象是节点的集合，既包括元素，也包括节点，例如text文本节点</span>。



## 常用的DOM操作

> 文档树是由各种类型节点构成的集合，DOM操作实际是对文档结构中节点的操作。文档结构树中的节点类型众多，但是操作的主要节点类型为元素节点、属性节点和文本节点。

元素节点是拥有一对开闭合标签的元素整体，例如常见的div、ul、li标签都是元素节点

属性节点是元素节点具有的属性，例如图5-1中a标签的href属性。

文本节点是DOM中用于呈现文本内容的节点，例如图5-1中h1标签内部的“我的标题”。



#### 新增节点

> 新增节点其实包括两个步骤，首先是新建节点，然后将节点添加至指定的位置。

假如有如下所示的这段HTML代码。

```html
<ul id="container">
    <li class="ﬁrst">文本1</li>
    <li class="second">文本2</li>
    <li>文本3</li>
    <li id="target">文本4</li>
    <li>文本5</li>
    <li>文本6</li>
</ul>
```

操作：第一步，在ul的末尾添加一个li元素，其类名为“last”，内容为“新增文本1”；第二步，在新增的li之前再新增第二个li，内容为“新增文本2”。

1.获取指定元素
```js
let container = document.querySelector('#container')
```

2.创建一个元素节点
```js
var newLiOne = document.createElement('li');
```

3.创建一个属性节点,并设置值
```js
var newLiAttr = document.createAttribute('class');
newLiAttr.value = 'last';
```

4.将属性节点绑定在元素节点上。
```js
newLiOne.setAttributeNode(newLiAttr);
```

5.新创建一个文本节点
```js
var newTextOne = document.createTextNode('新增文本1');
```

6.将文本节点作为元素节点的子元素。
```js
newLiOne.appendChild(newTextOne);
```

7.使用appendChild()函数将新增元素节点添加至末尾。
```js
container.appendChild(newLiOne);
```

8.新创建第二个元素节点
```js
var newLiTwo = document.createElement('li');
```

9.新创建第二个文本节点
```js
var newTextTwo = document.createTextNode('新增文本2');
```

10.将文本节点作为元素节点的子元素
```js
newLiTwo.appendChild(newTextTwo);
```

11.使用insertBefore()函数将节点添加至第一个新增节点的前面
```js
container.insertBefore(newLiTwo, newLiOne);
```

在新增属性节点时，还有另外一种更简单的setAttribute()函数。以上面代码为例，可以通过下面这一行代码完成上述③④这两步共3行代码的功能。但是setAttribute()函数不兼容IE8及更早的版本，在使用时需要考虑到所使用的浏览器环境
```js
newLiOne.setAttribute('class', 'last');
```



#### 删除节点

> 删除节点的操作实际包含删除元素节点、删除属性节点和删除文本节点这3个操作

针对以下这段相同的HTML代码进行节点删除的操作。

```html
<ul id="main">
    <li>文本1</li>
    <li>文本2</li>
    <li>文本3</li>
</ul>
<a id="link" href="http://www.mianshiting.com">面试厅</a>
```



<u>1.删除ul的第一个li元素节点</u>

a.获取该元素的父元素
```js
let main = document.querySelector('#main')
```

b.获取待删除节点
待删除节点是父元素的第一个元素节点，很多读者可能直接想到的是使用firstChild属性，这是不可取的。firstChild属性实际是取childNodes属性返回的NodeList对象中的第一个值，在此例中实际为一个换行符。

如果需要获取第一个元素节点，应该使用firstElementChild属性。
```js
var ﬁrstChild = main.firstElementChild;
```

c.通过父节点，调用removeChild()函数删除该节点
```js
main.removeChild(firstChild);
```



<u>2.删除a标签的href属性</u>

删除一个元素的属性需要进行两步操作。

a.获取该元素
```js
var link = document.querySelector('#link');
```

b.通过元素节点，调用removeAttribute()函数删除指定属性节点
```js
link.removeAttribute('href');
```



<u>3.删除ul最后一个li元素的文本节点</u>
a.获取元素节点。在获取最后一个元素节点时，使用的是lastElementChild属性而不是lastChild属性
```js
var lastChild = main.lastElementChild;
```

b.获取文本节点
在获取文本节点时，需要使用的是childNodes属性，然后取返回的NodeList对象的第一个值。不能使用children属性，因为children属性返回的是HTMLCollection对象，表示的是元素节点，不包括文本节点内容。
```js
var textNode = lastChild.childNodes[0];
```

c.通过元素节点，调用removeChild()函数删除指定的文本节点

```js
lastChild.removeChild(textNode);
```

关于删除文本节点还有一种比较简单的处理方法，那就是将元素节点的innerHTML属性设置为空。
```js
lastChild.innerHTML = '';
```

<span style="text-decoration:underline">在删除文本节点时，我们更推荐使用设置innerHTML属性为空的方法。</span>

#### 修改节点
修改节点包含着很多不同类型的操作，包括修改元素节点、修改属性节点和修改文本节点
```js
<div id="main">
    <!-- 测试修改元素节点 -->
    <div id="div1">替换之前的元素</div>
    <!-- 测试修改属性节点 -->
    <div id="div2" class="classA" style="color: green;">这是修改属性的节点</div>
    <!-- 测试修改文本节点 -->
    <div id="last">这是最后一个节点内容</div>
</div>
```



**1.修改元素节点**
修改元素节点的操作一般是直接将节点元素替换为另一个元素，可以使用replaceChild()函数来实现。replaceChild()函数的调用方是父元素，接收两个参数，第一个参数表示新元素，第二个参数表示将要被替换的旧元素。
```js
<script>
    // 1.获取父元素与待替换的元素
    var main = document.querySelector('#main');
    var div1 = document.querySelector('#div1');
    // 2.创建新元素
    var newDiv = document.createElement('div');
    var newText = document.createTextNode('这是新创建的文本');
    newDiv.appendChild(newText);
    // 3.使用新元素替换旧的元素
    main.replaceChild(newDiv, div1);
</script>
```



**2.修改属性节点**
修改属性节点有两种处理方式：一种是通过getAttribute()函数和setAttribute()函数获取和设置属性节点值；另一种是直接修改属性名。第二种方式有个需要注意的地方是，直接修改的属性名与元素节点中的属性名不一定是一致的。就像class这个属性，因为它是JavaScript中的关键字，是不能直接使用的，所以需要使用className来代替。
```js
var div2 = document.querySelector('#div2');
// 方法1: 通过setAttribute()函数设置
div2.setAttribute('class', 'classB');
// 方法2: 直接修改属性名，注意不能直接用class，需要使用className
div2.className = 'classC';

// 方法1: 通过setAttribute()函数设置
div2.setAttribute('style', 'color: red;');
// 方法2: 直接修改属性名
div2.style.color = 'blue';
```



**3.修改文本节点**
修改文本节点与删除文本节点一样，将innerHTML属性修改为需要的文本内容即可。
```js
var last = document.querySelector('#last');
// 直接修改innerHTML属性
last.innerHTML = '这是修改后的文本内容';
//如果设置的innerHTML属性值中包含HTML元素，则会被解析
//使用如下代码进行验证
last.innerHTML = '<p style="color: red">这是修改后的文本内容</p>';
//在浏览器中渲染后，可以看到“这是修改后的文本内容”为红色
```


**innerHTML/innerText**

* innerText 
	* 获取元素内容,但只会获取文本,不会获取内部标签
* innerHTML
	* 获取元素内部 标签+文本


**innerText**
注意事项: 在Chrome浏览器中,赋值末尾为空格字符串,但浏览器最终没有渲染.
解决方法: 
* Unicode 非换行空格字符 `\u00A0`
* innerHTML + 非断行空格实体 `&nbsp;`



**textContent vs. innerText**
当设置或读取的内容为纯文本,两种方法没有区别 innerText与node.textContent
两者区别: innerText只对可见元素有效; node.textContent对隐藏元素也有效 但依然不显示

兼容性封装获取元素文本
```html
- 封装一个函数 既能获取元素的文本也能设置一个元素的文本
- 在设置和获取的时候  能够使用textContent的情况下 优先使用textContent  如果不能使用 再使用innerText
```

```JavaScript
<p id="pNode">今天晚上吃点啥</p>
<button id="btn">按钮</button>


window.onload = function(){
    var pNode = document.getElementById('pNode');
    var btnNode = document.getElementById('btn');
    btnNode.onclick = function(){
        setOrGetContent(pNode);
        setOrGetContent(pNode, '今天吃火锅');
    }
    
    function setOrGetContent(node, content){
        if(arguments.length == 1){
            if(node.textContent){
                return node.textContent;
            }else{
                return node.innerText
            }
        }else if(arguments == 2){
            if(content.textContent){
                node.textContent = content;
            }else{
                node.innerText = content;
            }
        }
    }
}
```


排它思想实现文本切换
<iframe src="https://codesandbox.io/embed/reverent-panna-ocir64?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dom-exclusive"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


# 事件/事件流

```js
https://www.cnblogs.com/starof/p/4066381.html
```



### 一.事件

**事件是文档或者浏览器窗口中发生的，特定的交互瞬间。是把所有东西粘在一起的胶水**

事件是用户或浏览器自身执行的某种动作，例如用户在某些内容上的点击、鼠标经过某个特定元素或按下键盘上的某些按键或某个web页面加载完成,用户滚动窗口或改变窗口大小.
通过JavaScript你可以监听特定事件的发生及事件发生后对其作出的响应.

事件是javaScript和DOM之间交互的桥梁。

事件有**DOM0, DOM2和DOM3**的区分

DOM0就是直接通过 onclick写在html里面的事件, 比如:

```html
<input onclick="alert(1)">
```

DOM2是通过addEventListener绑定的事件, 还有IE下的DOM2事件通过attachEvent绑定;

DOM3是一些新的事件, 区别**DOM3和DOM2的方法我感觉是DOM3事件有分大小写的,DOM2没有**; ??





### 二.事件流

>在浏览器中，JavaScript和HTML之间的交互是通过事件去实现的，常用的事件有代表鼠标单击的click事件、代表加载的load事件、代表鼠标指针悬浮的mouseover事件。在事件发生时，会相对应地触发绑定在元素上的事件处理程序，以处理对应的操作。常一个页面会绑定很多的事件，那么具体的事件触发顺序是什么样的呢？
>事件流描述的是从页面中接收事件的顺序

#### 1.事件流感性认知

问题：单击页面元素，什么样的元素能感应到这样一个事件？

答案：单击元素的同时，也单击了元素的容器元素，甚至整个页面。

案例: [3个同心圆](https://www.cnblogs.com/starof/p/4066381.html).



#### 2.事件流

#### 2.1 两种事件流模型

事件传播的顺序对应浏览器的两种事件流模型：捕获型事件流和冒泡型事件流

页面上有一个table表格，分别在table表格、tbody表格体、tr行、td单元格上绑定了click事件。假如我在td上执行了单击的操作，那么将会产生什么样的事件流呢？
* 第一种事件传递顺序是先触发最外层的table元素，然后向内传播，依次触发tbody、tr与td元素。
* 第二种事件传递顺序先触发由最内层的td元素，然后向外传播，依次触发tr、tbody与table元素。
* 第一种事件传递顺序对应的是捕获型事件流，第二种事件传递顺序对应的是冒泡型事件流。


**冒泡型事件流**：
事件会从最内层的元素开始发生，一直向上传播，直到document对象。

**捕获型事件流**：
事件会从最外层开始发生，直到最具体的元素。
事件捕获的思想就是不太具体的节点应该更早接收到事件，而最具体的节点最后接收到事件

| 冒泡型事件传播                                               | 捕获型事件传播                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![](https://images0.cnblogs.com/blog/315302/201411/010945436598199.png) | ![](https://images0.cnblogs.com/blog/315302/201411/010945579257474.png) |

note:由于老版本浏览器不支持，很少有人使用事件捕获。**建议使用事件冒泡**。



#### 2.2 DOM事件流

DOM标准采用捕获+冒泡。两种事件流都会触发DOM的所有对象，从document对象开始，也在document对象结束

![](https://images2015.cnblogs.com/blog/315302/201606/315302-20160621155328756-279009443.png)

DOM标准规定事件流包括三个阶段：事件捕获阶段、处理目标阶段和事件冒泡阶段。

- 事件捕获阶段：**实际目标**（`<div>`）在捕获阶段**不会接收事件**。也就是在捕获阶段，事件从document到\<html>再到\<body>就停止了。上图中为`1 --> 3`.
- 处于目标阶段：事件在`<div>`上发生并处理。**但是事件处理会被看成是冒泡阶段的一部分**。
- 冒泡阶段：事件又传播回文档。

事件捕获阶段,实际目标不会接收事件?
> 根据早期的DOM事件模型，实际目标元素在捕获阶段默认是不会处理事件的。这意味着，虽然事件会传递到目标元素，但是如果你没有明确地设置事件监听器在捕获阶段触发（在JavaScript中通过`addEventListener`的第三个参数设置为`true`），那么在捕获阶段，目标元素不会对事件做出响应。
> 事件进入目标阶段，在这个阶段，无论是否设置捕获，目标元素的事件监听器都会被触发。然后，事件开始冒泡阶段，它会沿DOM树向上传播，直到根节点。在冒泡阶段，如果父元素上有事件监听器设置为在冒泡阶段触发（通过`addEventListener`的第三个参数设置为`false`或不设置这个参数，因为默认值是`false`），那么这些监听器会被调用。


note:

* 尽管“DOM2级事件”标准规范明确规定事件捕获阶段不会涉及事件目标，但是在IE9、Safari、Chrome、Firefox和Opera9.5及更高版本都会在捕获阶段触发事件对象上的事件。结果，就是有两次机会在目标对象上面操作事件。

* 并非所有的事件都会经过冒泡阶段 。所有的事件都要经过捕获阶段和处于目标阶段，但是有些事件会跳过冒泡阶段：如，获得输入焦点的focus事件和失去输入焦点的blur事件。

  两次机会在目标对象上面操作事件例子:

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<style>
    #outer{
        position: absolute;
        width: 400px;
        height: 400px;
        top:0;
        left: 0;
        bottom:0;
        right: 0;
        margin: auto;
        background-color: deeppink;
    }
    #middle{
        position: absolute;
        width: 300px;
        height:300px;
        top:50%;
        left: 50%;
        margin-left: -150px;
        margin-top: -150px;
        background-color: deepskyblue;
    }
    #inner{
        position: absolute;
        width: 100px;
        height:100px;
        top:50%;
        left:50%;
        margin-left: -50px;
        margin-top: -50px;;
        background-color: darkgreen;
        text-align: center;
        line-height: 100px;
        color:white;
    }
    #outer,#middle,#inner{
        border-radius:100%;
    }
</style>
<body>
<div id="outer">
    <div id="middle">
        <div id="inner">
            click me!
        </div>
    </div>
</div>
<script>
    var innerCircle= document.getElementById("inner");
    innerCircle.addEventListener("click", function () {
        alert("innerCircle的click事件在捕获阶段被触发");
    },true);
    innerCircle.addEventListener("click", function () {
        alert("innerCircle的click事件在冒泡阶段被触发");
    },false);
    var middleCircle= document.getElementById("middle");
    middleCircle.addEventListener("click", function () {
        alert("middleCircle的click事件在捕获阶段被触发");
    },true);
    middleCircle.addEventListener("click", function () {
        alert("middleCircle的click事件在冒泡阶段被触发");
    },false);
    var outerCircle= document.getElementById("outer");
    outerCircle.addEventListener("click", function () {
        alert("outerCircle的click事件在捕获阶段被触发");
    },true);
    outerCircle.addEventListener("click", function () {
        alert("outerCircle的click事件在冒泡阶段被触发");
    },false);
</script>
</body>
</html>
```

![](https://images0.cnblogs.com/blog/315302/201411/052135036896502.png)





#### 事件触发的3个阶段

1. document 往事件触发地点，捕获前进，遇到相同注册事件立即触发执行
2. 到达事件位置，触发事件（如果该处既注册了冒泡事件，也注册了捕获事件，按照注册顺序执行）
3. 事件触发地点往 document 方向，冒泡前进，遇到相同注册事件立即触发

我们在注册事件的时候，通常使用的是 捕获 或者 冒泡 的 一种：

```js
obj.addEventListener('click', func, true)  //第三个参数为true,  捕获方式
obj.addEventListener('click', func, false) //第三个参数为false, 冒泡方式
```

事件只会因为捕获或者冒泡触发一次。举个栗子：

```html
<body>
  <div id="s1">
    s1
    <div id="s2">
      s2
    </div>
  </div>
</body>

<script>
	s1.addEventListener('click', function(evt){ console.log("s1")}, true)
  s2.addEventListener('click', function(evt){ console.log("s2")}, true)
</script>
```

点击s2, 结果:

```yaml
s1
s2
```

因为这里采用的是捕获模式，从 document 往 s2 走，依次发现 s1 和 s2 都有注册捕获事件，于是便触发了，然后冒泡，没找到冒泡事件，不执行任何操作。如果将 true 改成 false，可以看到结果相反。为了更好的让你理解整个事件机制，我给他们的捕获和冒泡模式下都注册事件：

```html
<body>
  <div id="s1">
    s1
    <div id="s2">
      s2
    </div>
  </div>
</body>

<script>
	s1.addEventListener('click', function(evt){ console.log("s1 捕获模式下")}, true)
  s2.addEventListener('click', function(evt){ console.log("s2 捕获模式下")}, true)
  s1.addEventListener('click', function(evt){ console.log("s1 冒泡模式下")}, false)
  s2.addEventListener('click', function(evt){ console.log("s2 冒泡模式下")}, false)
</script>
```

点击s2, 结果:

```yaml
s1 捕获模式下
s2 捕获模式下
s2 冒泡模式下
s1 冒泡模式下
```



**event.stopPropagation() 阻止事件冒泡和捕获.,

**stopImmediatePropagation 的使用**

stopPropagation 可以阻止事件的进一步传播，但是他阻止不了该元素上绑定的其他函数的执行，比如我们在 obj 上绑定了 func1 和 func2，如果我们在 func1 中使用了 stopPropagation ，那 func2 依然还是会执行出来。倘若这里使用 stopImmediatePropagation，结果就不一样了，他不仅阻止事件的传播，还阻止 func2 的执行。如：





#### 3.事件流的典型应用--事件代理

传统的事件处理中，需要为**每个元素**添加事件处理器。js事件代理则是一种简单有效的技巧，通过它可以把事件处理器添加到**一个父级元素**上，从而避免把事件处理器添加到**多个子级元素**上。

#### 3.1事件代理

事件代理的原理用到的就是事件冒泡和目标元素，把事件处理器添加到父元素，等待子元素事件冒泡，并且父元素能够通过target（IE为srcElement）判断是哪个子元素，从而做相应处理.

```html
<body>
<ul id="color-list">
<li>red</li>
<li>orange</li>
<li>yellow</li>
<li>green</li>
<li>blue</li>
<li>indigo</li>
<li>purple</li>
</ul>
<script>
(function(){
    var colorList=document.getElementById("color-list");
    colorList.addEventListener('click',showColor,false);
    function showColor(e)
    {
        e=e||window.event;
        var targetElement=e.target||e.srcElement;
        if(targetElement.nodeName.toLowerCase()==="li"){
        alert(targetElement.innerHTML);
        }
    }
})();
</script>
</body>
```



#### 3.2事件代理的好处

- 将多个事件处理器减少到一个，因为事件处理器要驻留内存，这样就提高了性能。
- DOM更新无需重新绑定事件处理器，因为事件代理对不同子元素可采用不同处理方法。如果新增其他子元素（a,span,div等），直接修改事件代理的事件处理函数即可，不需要重新绑定处理器，不需要再次循环遍历。

#### 3.3事件代理的弊端

代码如下：事件代理同时绑定了li和span，当点击span的时候，li和span都会冒泡

```html
<li><span>li中的span的内容</span></li>

<script>
    $(document).on('click', 'li', function(e){
        alert('li li');
    });

    $(document).on('click', 'span', function(e){
        alert('li span');
    })
</script>
```

解决方法:

1.span的事件处理程序中阻止冒泡

给子级加 event.stopPropagation( )

```js
$(document).on('click', 'span', function(e){
  alert('li span');
  e.stopPropagation();
})
```



2.li的事件处理程序中检测target元素

return false;

```js
$(document).on('click', 'li', function (e) {
  if (e.target.nodeName == 'SPAN') {
    e.stopPropagation();
    return false;
  }
  alert('li li');
});
```



#### 3.4事件代理的有趣应用

点击一个列表,输出对应的索引

```js
let ul=document.querySelector('ul');
let lis=ul.querySelectorAll('ul li');
ul.addEventListener('click',function(e){
  let target=e.target;
  if(target.nodeName.toUpperCase()==='LI'){
    alert([].indexOf.call(lis,target))
  }
})
```



#### 3.5 阻止事件冒泡

> https://juejin.cn/post/6844903834075021326

 **给子级加 event.stopPropagation( )**

```ini
$("#div1").mousedown(function(e){
    var e=event||window.event;
    event.stopPropagation();
});复制代码
```



**2. 在事件处理函数中返回 false**

```javascript
$("#div1").mousedown(function(event){
    var e=e||window.event;
    return false;
});复制代码
```

但是这两种方式是有区别的。`return false` 不仅阻止了事件往上冒泡，而且阻止了事件本身(默认事件)。`event.stopPropagation()`则只阻止事件往上冒泡，不阻止事件本身。



**3. `event.target==event.currentTarget`，让触发事件的元素等于绑定事件的元素，也可以阻止事件冒泡；**

```html
<body>
  <div id="bt1">
    <div id="bt2">
      <div id="bt3"></div>
    </div>
  </div>
</body>

<script>
	let bt3 = document.getElemnetById('bt3')
  let bt2 = document.getElementById('bt2')
  let bt1 = document.getElementById('bt1')
  
  bt3.onclick = function(event) {
    if (event.target === event.currentTarget) {
      console.log(3)
    }
  }
  
  bt2.onclick = function(event) {
    if (event.target === event.curretTarget) {
      console.log(2)
    }
  }
  
    bt1.onclick = function(event) {
    if (event.target === event.curretTarget) {
      console.log(1)
    }
  }
</script>
```


#### 3.6 html中自定义属性中的应用
在html元素上可以添加`data-xx`形式的自定义属性, 使用`event.target.dataset.xxx`来获取自定义属性.
```vue
<div @click="onSearch" :data-name='iconState'>
	<van-icon :data-name1='iconState' />
</div>
```

注意, 当鼠标点击div元素时候, `event.target.dataset`中是name, 当改为touch事件(手机)时候, 点击div元素时候,`event.target.dataset`中是name1.
#### 阻止默认行为

**介绍**

在众多的HTML标签中，有一些标签是具有默认行为的，这里简单地列举3个。

· a标签，在单击后默认行为会跳转至href属性指定的链接中。

· 复选框checkbox，在单击后默认行为是选中的效果。

· 输入框text，在获取焦点后，键盘输入的值会对应展示到text输入框中。

在一般情况下我们是允许标签的默认行为的，就像用户的正常操作，但是在某些时候我们是需要阻止这些标签的默认行为的，同样使用上述3种场景作为说明。

a标签，假如a标签上显示的文案不符合预期，我们在单击a标签时将不会跳转至对应的链接中去。

· 复选框checkbox，假如已选中的复选框在单击的时候不会被取消，依然是选中的状态。

· 输入框text，假如我们限制用户输入的值只能是数字和大小写字母，其他的值不允许输入。

如何编写代码来阻止元素的默认行为呢？ 通过**event.preventDefault()**函数去实现



**实例**

场景描述：限制用户输入的值只能是数字和大小写字母，其他的值则不能输入，如输入其他值则给出提示信息，提示信息在两秒后消失。

背景知识:

本例需要获取的数字和字母的Unicode编码范围如下所示。

· 数字的Unicode编码范围是48～57。

· 大写字母A～Z的Unicode编码范围是65～90。

· 小写字母a～z的Unicode编码范围是97～122。

因为浏览器的兼容性问题，Event对象提供了多种不同的属性来获取键的Unicode编码，分别是event.keyCode、event.charCode和event.which。

```js
let charCode = event.keyCode || event.which || event.charCode
```

```html
<input type="text" id="text">
<div id="tip"></div>

<script>
    var text = document.querySelector('#text');
    var tip = document.querySelector('#tip');
    text.addEventListener('keypress', function (event) {
        var charCode = event.keyCode || event.which || event.charCode;
        // 满足输入数字
        var numberFlag = charCode <= 57 && charCode >= 48;
        // 满足输入大写字母
        var lowerFlag = charCode <= 90 && charCode >= 65;
        // 满足输入小写字母
        var supperFlag = charCode <= 122 && charCode >= 97;

        if (!numberFlag && !lowerFlag && !supperFlag) {
            // 阻止默认行为，不允许输入
            event.preventDefault();
            tip.innerText = '只允许输入数字和大小写字母';
        }
        // 设置定时器,清空提示语
        setTimeout(function () {
            tip.innerText = '';
        }, 2000);
    });
</script>
```















### 三.事件处理程序

事件是用户或浏览器自身执行的某种动作，如click,load和mouseover都是事件的名字。响应某个事件的函数就叫**事件处理程序**（也叫**事件处理函数**、**事件句柄**）。事件处理程序的名字以"on"开头，因此click事件的事件处理程序就是onclick,load事件的事件处理程序就是onload。

根据W3C DOM标准，事件处理程序分为**DOM0、DOM2、DOM3**这3种级别的事件处理程序。由于在DOM1中并没有定义事件的相关内容，因此没有所谓的DOM1级事件处理程序。



为事件指定事件处理程序的方法主要有3种

#### 1. 绑定事件的三种方式

#### 1 DOM0级事件处理程序

> DOM0级事件处理程序是将一个函数赋值给一个事件处理属性，有两种表现形式。
>
> 第一种是先通过JavaScript代码获取DOM元素，再将函数赋值给对应的事件属性。
>
> 第二种是直接在html中设置对应事件属性的值，值有两种表现形式，一种是执行的函数体，另一种是函数名，然后在script标签中定义该函数。



**事件直接加在html元素上。**

首先，这种方法已经过时了。因为动作(javascript代码)和内容(html代码)紧密耦合，修改时即要修改html也要修改js。但是写个小demo的时候还是可以使用的。此事件为[DOM 0级标准](https://baike.baidu.com/item/DOM/50288?fr=aladdin)。同时，这个事件的优先级是最高的。

这种方式也有两种方法，都很简单：

第一种：直接在html中定义事件处理程序及包含的动作

```html
<input type='button' value='click me' onclick='alert('clicked')'/>
```



第二种：html中定义事件处理程序，执行的动作则调用其他地方定义的脚本

```html
<input type='button' value='click me' onclick='showMsg()'/>
<script>
	function showMsg(){
    alert('clicked')
  }
</script>
```

note:

1）通过event变量可以直接访问事件本身，比如onclick="alert(event.type)"会弹出click事件。

2）this值等于事件的目标元素，这里目标元素是input。比如 onclick="alert(this.value)"可以得到input元素的value值。

3)  以上两种DOM0级事件处理程序同时存在时，第一种在JavaScript中定义的事件处理程序会覆盖掉后面在html标签中定义的事件处理程序。



#### 1.2 DOM0事件处理程序

**把一个函数赋值给一个事件处理程序属性。**

这种方法简单而且跨浏览器，但是只能为一个元素添加一个事件处理函数。

因为这种方法为元素添加多个事件处理函数，则后面的会覆盖前面的。

```html
<input id='myBtn' type='button' value='click me'/>
<script>
	let myBtn=document.querySelector('myBtn');  //1.取得btn对象
  myBtn.onclick=function(){   //2.相当于给myBtn添加了一个onclick的属性  3.把函数赋值给onclick事件处理程序属性
    alert('clicked')
  }
</script>
```

**删除事件处理程序**

```js
myBtn.onclick=null;
```



#### 1.3 DOM2事件处理程序

> 在DOM2级事件处理程序中，当事件发生在节点时，目标元素的事件处理函数就会被触发，而且目标元素的每个祖先节点也会按照事件流顺序触发对应的事件处理程序。DOM2级事件处理方式规定了添加事件处理程序和删除事件处理程序的方法。

**两种处理方式**

针对DOM2级事件处理程序，不同的浏览器厂商制定了不同的实现方式，主要分为IE浏览器和非IE浏览器。

* 在IE10及以下版本中，只支持事件冒泡阶段。在IE11中同时支持事件捕获阶段与事件冒泡阶段。在IE10及以下版本中，可以通过**attachEvent()函数**添加事件处理程序，通过**detachEvent()函数**删除事件处理程序。

```js
element.attachEvent('on'+eventName, handler) //添加事件处理程序
element.detachEvent('on'+eventName, handler) //删除事件处理程序
```

* 在IE11及其他非IE浏览器中，同时支持事件捕获和事件冒泡两个阶段，可以通过**addEventListener()函数**添加事件处理程序，通过**removeEventListener()函数**删除事件处理程序。

```js
addEventListener(eventName, handler, useCapture);       //添加事件处理程序
removeEventListener(eventName, handler, useCapture);  //删除事件处理程序
```

其中的useCapture参数表示是否支持事件捕获，true表示支持事件捕获，false表示支持事件冒泡，默认状态为false。



**两种处理方式的差异**

相同点: 

1.在DOM2级事件处理程序中，不管是IE浏览器还是非IE浏览器都支持对同一个事件绑定多个处理函数。

```js
var handler1 = function (){}
var handler2 = function (){}
---------------IE10及以下------------------
btn.attachEvent('onclick', handler1);
btn.attachEvent('onclick', handler2);
  
---------------IE11及非IE-----------------
btn.addEventListener('click', handler1);
btn.addEventListener('click', handler2);
```

2.在需要删除绑定的事件时，不能删除匿名函数，因为添加和删除的必须是同一个函数。下面这种同时绑定和取消handler()函数的情况，可以删除掉绑定的事件。

```js
var wrap = document.getElementById('wrap');

var handler = function () {
    console.log('789');
};

// 第一种方式绑定和取消的是同一个函数，因此可以取消绑定的事件
wrap.addEventListener('click', handler, false);
wrap.removeEventListener('click', handler);
```

而如果采用下面这种方式，则无法取消绑定的事件，因为它们使用的都是匿名函数的形式，绑定与取消的函数并不是同一个。

```js
wrap.addEventListener('click', function () {
    console.log('123');
}, false);

wrap.removeEventListener('click', function () {});
```



不同点:

1.在IE浏览器中，使用attachEvent()函数为同一个事件添加多个事件处理函数时，会按照添加的相反顺序执行。

2.在IE浏览器下，使用attachEvent()函数添加的事件处理程序会在全局作用域中运行，因此this指向全局作用域window。在非IE浏览器下，使用addEventListener()函数添加的事件处理程序在指定的元素内部执行，因此this指向绑定的元素。

```js
<button id="mybtn">单击</button>
<script>
  var btn = document.getElementById("mybtn");
  // IE浏览器
  btn.attachEvent("onclick", function () {
      alert(this); // 指向window
});
  // 非IE浏览器
    btn.addEventListener("click", function () {
      alert(this); // 指向绑定的元素
});
  </script>
```



兼容处理:

因为浏览器的差异性，我们需要使用不同的方法来实现DOM2级事件处理程序

```js
var EventUtil = {
    addEventHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeEventHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.removeEventListener(type, handler);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on"+type] = null;
        }
    }
}
```



**DOM2级事件 介绍**

DOM2级事件”中规定的事件流同时支持了事件捕获阶段和事件冒泡阶段，而作为开发者，我们可以选择事件处理函数在哪一个阶段被调用。

addEventListener方法用来为一个特定的元素绑定一个事件处理函数，是JavaScript中的常用方法。addEventListener有三个参数：

```vbnet
 element.addEventListener(event, function, useCapture)
```

DOM2级事件处理程序可以为一个元素添加多个事件处理程序。其定义了两个方法用于添加和删除事件处理程序：

* addEventListener()

* removeEventListener()。

**所有的DOM节点都包含这2个方法。**

这两个方法都需要3个参数：事件名，事件处理函数，布尔值。

| 参数       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| event      | 必须。字符串，指定事件名。<br />**注意:** 不要使用 "on" 前缀。 例如，使用 "click" ,而不是使用 "onclick"。<br />必须。字符串，指定事件名。 |
| function   | 必须。指定要事件触发时执行的函数。<br />当事件对象会作为第一个参数传入函数。 事件对象的类型取决于特定的事件。例如， "click" 事件属于 MouseEvent(鼠标事件) 对象。<br /> |
| useCapture | 可选。布尔值，指定事件是否在捕获或冒泡阶段执行。<br />true - 事件句柄在捕获阶段执行（即在事件捕获阶段调用处理函数）<br />false- 默认。事件句柄在冒泡阶段执行（即表示在事件冒泡的阶段调用事件处理函数） |







**添加事件处理程序**：现在为按钮添加两个事件处理函数，一个弹出“hello”,一个弹出“world”。

```html
<input id="myBtn" type="button" value="click me!"/>
<script>
    var myBtn=document.getElementById("myBtn");
    myBtn.addEventListener("click",function(){
        alert("hello");
    },false);
    myBtn.addEventListener("click",function(){
        alert("world");
    },false);
</script>
```

**删除事件处理程序**：通过addEventListener添加的事件处理程序必须通过removeEventListener删除，且参数一致。

**note**:**通过addEventListener添加的匿名函数将无法删除。**下面这段代码将不起作用！

```js
myBtn.removeEventListener("click",function(){
  alert("world");
},false);
```

看似该removeEventListener与上面的addEventListener参数一致，实则第二个参数中匿名函数是完全不同的。

所以为了能删除事件处理程序，代码可以这样写

```html
<input id="myBtn" type="button" value="click me!"/>
<script>
    var myBtn=document.getElementById("myBtn");
    var handler=function(){
        alert("hello");
    }
    myBtn.addEventListener("click",handler,false);
    myBtn.removeEventListener("click",handler,false);
</script>
```



#### 1.4 DOM3级事件处理

> DOM3级事件处理程序是在DOM2级事件的基础上重新定义了事件，也添加了一些新的事件。
>
> 最重要的区别在于DOM3级事件处理程序允许自定义事件，自定义事件由**createEvent("CustomEvent")**函数创建，返回的对象有一个**initCustomEvent()函数**，通过传递对应的参数可以自定义事件。



函数可以接收以下4个参数。

* type：字符串、触发的事件类型、自定义，例如“keyDown”“selectedChange”。
* bubble（布尔值）：表示事件是否可以冒泡。
* cancelable(布尔值）：表示事件是否可以取消。
* detail（对象）：任意值，保存在event对象的detail属性中。

创建完成的自定义事件，可以通过dispatchEvent()函数去手动触发，触发自定义事件的元素需要和绑定自定义事件的元素为同一个元素。

<u>案例</u>

需求: 我们需要实现的场景是：在页面初始化时创建一个自定义事件myEvent，页面上有个div监听这个自定义事件myEvent，同时有一个button按钮绑定了单击事件；当我们单击button时，触发自定义事件，由div监听到，然后做对应的处理。

上述场景可以分为3步去实现。· 创建自定义事件。· 监听自定义事件。· 触发自定义事件。

HTML代码

```html
<div id="watchDiv">监听自定义事件的div元素</div>
<button id="btn">单击触发自定义事件</button>
```

<u>1.创建自定义事件:</u>

通过立即执行函数创建一个自定义事件。该自定义事件支持冒泡，而且会携带参数detailData。

在创建自定义事件之前，需要判断浏览器是否支持DOM3级事件处理程序。可以通过判断下面代码的返回值来确认:
* 如果返回值为“true”，则表示浏览器支持；
* 如果返回值为“false”，则表示浏览器不支持。
```js
document.implementation.hasFeature('CustomEvents', '3.0')
```

代码如下:
```js
var customEvent;
// 创建自定义事件
(function () {
    if (document.implementation.hasFeature('CustomEvents', '3.0')) {
        var detailData = {name: 'kingx'};
        customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent('myEvent', true, false, detailData);
    }
})();
```



<u>2.监听自定义事件</u>
通过addEventListener()函数监听自定义的myEvent事件
```js
// 获取元素
var div = document.querySelector('#watchDiv');
// 监听myEvent事件
div.addEventListener('myEvent', function (e) {
    console.log('div监听到自定义事件的执行, 携带的参数为: ', e.detail);
});
```



<u>3.触发自定义事件</u>
我们将触发自定义事件的入口放在button上，当单击button时会通过dispatchEvent()函数触发myEvent事件。
```js
// 获取元素
var btn = document.querySelector('#btn');
// 绑定click事件，触发自定义事件
btn.addEventListener('click', function () {
    div.dispatchEvent(customEvent);
});
```

运行以上代码，当我们单击button按钮后，会看到如下结果。
```md
div监听到自定义事件的执行，携带的参数为：{name: "kingx"}
```
该结果表明，在div上监听的自定义事件得到了触发，传递的detailData参数也得以接收。

自定义事件支持事件冒泡机制，可以在初始化自定义事件的initCustomEvent()函数中通过第二个参数来设置事件是否可以冒泡,上述例子中自定义的myEvent事件是支持冒泡的。
沿用上面的例子，我们在document上增加了对自定义的myEvent事件的监听。
当我们单击button按钮时，得到的结果如下所示。
```js
document.addEventListener('myEvent', function () {
    console.log('document监听到自定义事件的执行');
});


// div监听到自定义事件的执行，携带的参数为：{name: "kingx"}
// document监听到自定义事件的执行
```





## 如何自定义事件

> [创建和触发 events - 事件参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/Events/Creating_and_triggering_events)


初始化事件 
* const eventName = new Event('xxx')
* const evnetName = new CustomEvent('xxx', {'detail': elem.dataset.xxx})

绑定事件 elem.addEventListener('xxx', () =>{})
触发事件 elem.dispatchEvent(event)

#### 创建自定义事件
```
var event = new Event('build');

// Listen for the event.
elem.addEventListener('build', function (e) { ... }, false);

// Dispatch the event.
elem.dispatchEvent(event);
```

#### CustomEvent()
```javascript
var event = new CustomEvent('build', { 'detail': elem.dataset.time });
```









### 四.IE事件处理程序

```js
https://www.cnblogs.com/starof/p/4067121.html
```



### 五.事件对象

**什么是事件对象？在触发DOM上的事件时都会产生一个对象**

#### 认识

事件在浏览器中是以Event对象的形式存在的，每触发一个事件，就会产生一个Event对象。该对象包含所有与事件相关的信息，包括事件的元素、事件的类型及其他与特定事件相关的信息。

例如：鼠标操作产生的event中会包含鼠标位置的信息；键盘操作产生的event中会包含与按下的键有关的信息。

所有浏览器都支持event对象，但支持方式不同，在DOM中event对象必须作为唯一的参数传给事件处理函数，在IE中event是window对象的一个属性。


#### 获取Event对象
获取Event对象的方式有以下两种。
* 在事件处理程序中，Event对象会作为参数传入，参数名为event。
* 在事件处理程序中，通过window.event属性获取Event对象。
```js
var btn = document.querySelector('#btn');

btn.addEventListener('click', function (event) {
    // 方式1:event作为参数传入
    console.log(event);
    // 方式2:通过window.event获取
    var winEvent = window.event;
    console.log(winEvent);
    // 判断两种方式获取的event是否相同
    console.log(event == winEvent);
});
```
分别在Chrome、Firefox和Safari浏览器中运行，并单击id为btn的按钮。在Chrome浏览器中运行时，得到的结果如下所示。
```js
MouseEvent {isTrusted: true, screenX: 119, screenY: 321, …}
MouseEvent {isTrusted: true, screenX: 119, screenY: 321, …}
true
```
在Firefox浏览器中运行时，得到的结果如下所示。
```js
click { target: button#btn2, buttons: 0, clientX: 145, …}
undeﬁned
false
```
在Safari浏览器中运行时，得到的结果如下所示。
```js
MouseEvent {isTrusted: true, screenX: 119, screenY: 321, …}
MouseEvent {isTrusted: true, screenX: 119, screenY: 321, …}
true
```
从结果可以看出，不同的浏览器的表现还是有差异性的。Chrome浏览器和Safari浏览器同时支持两种方式获取event对象，而Firefox浏览器只支持这种将event作为参数传入的方式。
**兼容性处理**
```js
var EventUtil = {
	// 获取事件对象
	return event || window.event;
}
```


#### 获取事件的目标元素
在事件处理程序中，我们可能经常需要获取事件的目标元素，以便对目标元素做相应的处理。
在IE浏览器中，event对象使用**srcElement属性**来表示事件的目标元素；而在非IE浏览器中，event对象使用**target属性**来表示事件的目标元素，为了提供与IE浏览器下event对象相同的特性，某些非IE浏览器也支持srcElement属性。
**兼容性处理**
```js
btn.addEventListener('click', function(event) {
	// 获取Event对象
	var event = EventUtil.getEvent(event)
	
	// 使用两种属性获取目标事件的目标元素
	var NolTarget = event.target;
	var IETarget = event.srcElement;
	
})
```

```js
var EventUtil = {
	//...
	// 获取事件目标元素
	getTarget(event) {
		return event.target || event.srcElement
	}
}
```


#### 2.html事件处理程序中的event

这样会创建一个包含局部变量event的函数。可通过event直接访问事件对象。

```html
<input id="btn" type="button" value="click" onclick=" console.log('html事件处理程序'+event.type)"/>
```



#### 3.DOM中的事件对象

DOM0级和DOM2级事件处理程序都会把event作为参数传入

```js
<body>
<input id="btn" type="button" value="click"/>
<script>
    var btn=document.getElementById("btn");
    btn.onclick=function(event){
        console.log("DOM0 & click");
        console.log(event.type);    //click
    }
    btn.addEventListener("click", function (event) {
        console.log("DOM2 & click");
        console.log(event.type);    //click
    },false);
</script>
</body>
```



#### 3.1 DOM中事件对象重要**属性和方法**:

#### 3.1属性: 事件类型和事件目标

- type属性，用于获取事件类型
- target属性 用户获取事件目标 事件加在哪个元素上。（更具体target.nodeName）

#### 3.2方法: 阻止冒泡和默认行为

- stopPropagation()方法 用于阻止事件冒泡
- preventDefault()方法 阻止事件的默认行为 移动端用的多



#### 4.IE中的事件对象

```js
https://www.cnblogs.com/starof/p/4077532.html
```



### 六.事件对象的公共成员

#### 1.DOM中的event的公共成员

event对象包含与创建它的特定事件有关的属性和方法。触发的事件类型不一样，可用的属性和方法不一样。但是，DOM中所有事件都有以下公共成员。【注意bubbles属性和cancelable属性】

| 属性/方法                  | 类型         | 读写 | 说明                                                         |
| -------------------------- | ------------ | ---- | ------------------------------------------------------------ |
| bubbles                    | Boolean      | 只读 | 表明事件是否冒泡                                             |
| **stopPropagation()**      | Function     | 只读 | 取消事件的进一步捕获或冒泡。如果bubbles为true,则可以使用这个方法 |
| stopImmediatePropagation() | Function     | 只读 | 取消事件的进一步捕获或冒泡**，同时阻止任何事件处理程序被调用**（DOM3级事件中新增） |
| cancelable                 | Boolean      | 只读 | 表明是否可以取消事件的默认行为                               |
| **preventDefault()**       | Function     | 只读 | 取消事件的默认行为。如果cancelable是true，则可以使用这个方法 |
| defaultPrevented           | Boolean      | 只读 | 为true表示已经调用了preventDefault()(DOM3级事件中新增)       |
| **currentTarget**          | Element      | 只读 | 其事件处理程序当前正在处理事件的那个元素（**currentTarget始终\=\=\=this,即处理事件的元素**） |
| **target**                 | Element      | 只读 | 直接事件目标，\*\*真正触发事件的目标\*\*                         |
| detail                     | Integer      | 只读 | 与事件相关的细节信息                                         |
| **eventPhase**             | Integer      | 只读 | 调用事件处理程序的阶段：1表示捕获阶段，2表示处于目标阶段，3表示冒泡阶段 |
| trusted                    | Boolean      | 只读 | 为true表示事件是由浏览器生成的。为false表示事件是由开发人员通过JavaScript创建的（DOM3级事件中新增） |
| **type**                   | String       | 只读 | 被触发的事件的类型                                           |
| view                       | AbstractView | 只读 | 与事件关联的抽象视图。等同于发生事件的window对象             |



#### 1.1.对比currentTarget和target
两者都可以表示事件的目标元素，但是在事件流中两者却有不同的意义。
区别:
* target属性在事件目标阶段，理解为真实操作的目标元素
* currentTarget属性在事件捕获、事件目标、事件冒泡这3个阶段，理解为当前事件流所处的某个阶段对应的目标元素。

在事件处理程序内部，对象this始终等于currentTarget的值，而target则只是包含事件的实际目标。

```html
<body>
<input id="btn" type="button" value="click"/>
<script>
    document.body.onclick=function(event){
        console.log("body中注册的click事件");
        console.log("this===event.currentTarget? "+(this===event.currentTarget)); //true
        console.log("currentTarget===document.body?"+(event.currentTarget===document.body)); //true
        console.log('event.target===document.getElementById("btn")? '+(event.target===document.getElementById("btn"))); //true
    }
</script>
</body>
```



#### 1.2.通过type属性，可以在一个函数中处理多个事件。

原理：通过检测event.type属性，对不同事件进行不同处理。

举例：定义一个handler函数用来处理3种事件：click,mouseover,mouseout。

运行效果：点击按钮，弹出框。鼠标经过按钮，按钮背景色变为粉色；鼠标离开按钮，背景色恢复默认。

```html
<body>
  <input id='btn' type='button' value='click'/>
  <script>
  	let handler=function(event){
      switch(event.type){
        case 'click':
          alert('clicked');
          break;
        case 'mouseover':
          event.target.style.backgroundColor='pink';
          break;
        case 'mouseout':
          event.target.style.backgroundColor='';
      }
    }
    let btn=document.getElementById('btn');
    btn.onclick=handler;
    btn.onmouseover=handler;
    btn.onmouseouter=handler;
  </script>
</body>
```



#### 1.3 阻止事件冒泡
**stopPropagation()和stopImmediatePropagation()对比**
* stopPropagation()和 stopImmediatePropagation()都可以用来取消事件的进一步捕获或冒泡。
* stopPropagation()函数仅会阻止事件冒泡，其他事件处理程序仍然可以调用。
* stopImmediatePropagation()函数不仅会阻止冒泡，也会阻止其他事件处理程序的调用

```html
<body>
<input id="btn" type="button" value="click"/>
<script>
    var btn=document.getElementById("btn");
    btn.addEventListener("click",function(event){
        console.log("buttn click listened once");
//    event.stopPropagation();//取消注释查看效果
//    event.stopImmediatePropagation();//取消注释查看效果
    },false);
    btn.addEventListener("click",function(){
        console.log("button click listened twice");
    },false);
    document.body.onclick= function (event) {
        console.log("body clicked");
    }
</script>
</body>
```


#### 阻止默认行为
在众多的HTML标签中，有一些标签是具有默认行为的，这里简单地列举3个。
* a标签，在单击后默认行为会跳转至href属性指定的链接中。
* 复选框checkbox，在单击后默认行为是选中的效果。
* 输入框text，在获取焦点后，键盘输入的值会对应展示到text输入框中。

通过event.preventDefault()函数去实现阻止元素的默认行为

**案例**: 限制用户输入的值只能是数字和大小写字母，其他的值则不能输入，如输入其他值则给出提示信息，提示信息在两秒后消失。
键盘按键值的知识点，其实就是键盘的每个键有对应的Unicode编码:
* 数字的Unicode编码范围是48～57。
* 大写字母A～Z的Unicode编码范围是65～90。
* 小写字母a～z的Unicode编码范围是97～122。
因为浏览器的兼容性问题，Event对象提供了多种不同的属性来获取键的Unicode编码，分别是event.keyCode、event.charCode和event.which。
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <input type="text" placeholder="只能输入数字或字母"/>
  <div id="tip"></div>
  <script>
    let text = document.querySelector('input')
    let tip = document.querySelector('#tip')
    text.addEventListener('keypress', function(event) {
      let charCode = event.keyCode || event.which || event.charCode;
      let numberFlag = charCode <= 57 && charCode >= 48
      let lowerFlag = charCode <= 90 && charCode >= 65
      let supperFlag = charCode <= 122 && charCode >= 97

      if (!numberFlag || !lowerFlag || !supperFlag) {
        // 阻止默认行为 不允许输入
        event.preventDefault()
        tip.innerHTML = '只允许输入数字或大小写字母'
      }
      // 设置定时器 清空提示语
      setTimeout(()=>{tip.innerText = ''}, 2000)
    })
  </script>
</body>
</html>
```

#### 1.4 eventPhase

eventPhase值在捕获阶段为1，处于目标阶段为2，冒泡阶段为3。

| 常量                  | 值   |
| --------------------- | ---- |
| Event.CAPTURING_PHASE | 1    |
| Event.AT_TARGET       | 2    |
| Event.BUBBLING_PHASE  | 3    |

可以通过下面代码查看：

```
var btn=document.getElementById("btn");
btn.onclick= function (event) {
console.log(event.CAPTURING_PHASE); //1
console.log(event.AT_TARGET); //2
console.log(event.BUBBLING_PHASE); //3
}
```



#### 2.IE中event公共成员

IE中的event的属性和方法和DOM一样会随着事件类型的不同而不同，但是也有一些是所有对象都有的公共成员，且这些成员大部分有对应的DOM属性或方法。

| 属性/方法    | 类型    | 读/写 | 说明                                                         |
| ------------ | ------- | ----- | ------------------------------------------------------------ |
| cancelBubble | Boolean | 读/写 | 默认为false,但将其设置为true就可以取消事件冒泡（**与DOM中stopPropagation()方法的作用相同**） |
| returnValue  | Boolean | 读/写 | 默认为true，但将其设置为false就可以取消事件的默认行为（**与DOM中的preventDefault()方法的作用相同**） |
| srcElement   | Element | 只读  | 事件的目标（**与DOM中的target属性相同**）                    |
| type         | String  | 只读  | 被触发的事件的类型                                           |


#### 事件委托
**背景**
>事件委托是利用事件冒泡原理，管理某一类型的所有事件，利用父元素来代表子元素的某一类型事件的处理方式。

**案例**
* 已有元素的的事件绑定
* 新创建元素的事件绑定

##### 已有元素的事件绑定
场景:
假如页面上有一个ul标签，里面包含1000个li子标签，我们需要在单击每个li时，输出li中的文本内容。
如果采用每个li标签绑定一个click事件,对浏览器的性能是一个很大的挑战，主要包含以下两方面原因。
* 事件处理程序过多导致页面交互时间过长
* 事件处理程序过多导致内存占用过多
采用事件委托机制: 将事件绑定到父元素上, 然后利用事件冒泡原理，当事件进入冒泡阶段时，通过绑定在父元素上的事件对象来判断当前事件流正在进行的元素。如果和期望的元素相同，则执行相应的事件代码。

<iframe src="https://codesandbox.io/embed/dom-shi-jian-wei-tuo-yi-cun-zai-yuan-su-p1qfjm?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dom-事件委托-已存在元素"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>


##### 新创建元素的事件绑定
**场景**：假如页面上有一个ul标签，里面包含9个li子标签，我们需要在单击每个li时，输出li中的文本内容；在页面上有一个button按钮，单击button按钮会创建一个新的li元素，单击新创建的li元素，输出它的文本内容。

根据上面的场景描述，我们可以通过以下两种方法来实现。
* 手动绑定
* 事件委托

**手动绑定**
错误案例
通过querySelectorAll()函数获取到的li元素虽然会实时感知到数量的变化，但并不会实时增加对事件的绑定。如果需要新元素也具有相同的事件，则需要手动调用事件绑定的代码。
<iframe src="https://codesandbox.io/embed/dom-shi-jian-wei-tuo-xin-tian-jia-yuan-su-shou-dong-bang-ding-1-2tnrbd?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dom-事件委托-新添加元素-手动绑定1"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

解决方案:
	1.将遍历添加click事件处理程序代码封装成一个函数
	2.在添加完新元素后，重新调用一次①中封装的函数
<iframe src="https://codesandbox.io/embed/dom-shi-jian-wei-tuo-xin-tian-jia-yuan-su-shou-dong-bang-ding-1-forked-wde6gz?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dom-事件委托-新添加元素-手动绑定1 (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
   

**事件委托**

<iframe src="https://codesandbox.io/embed/dom-shi-jian-wei-tuo-xin-tian-jia-yuan-su-shou-dong-bang-ding-1-forked-1ok2bl?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dom-事件委托-新添加元素-事件冒泡"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>



#### contextmenu右键事件
**是什么**
Context Menu是一个与用户进行友好交互的菜单，例如鼠标的右键产生的效果。默认情况下，在网页上右击可以看到“重新加载”“打印”“查看页面源码”等选项；在图片上右击会出现“保存至本地”“另存为”等选项。




# UI事件

## 一.鼠标事件

#### 1.鼠标事件类型

[DOM0, DOM2, DOM3介绍](https://www.jianshu.com/p/3acdf5f71d5b)

DOM3级事件中定义了9个鼠标事件。

| 鼠标事件名称          | 功能概述                                                     |
| --------------------- | ------------------------------------------------------------ |
| mousedown/mouseup     | 鼠标按钮被按下/释放（左键或者右键）时触发。不能通过键盘触发  |
| click/dbclick         | 单击鼠标**左键**或者按下回车键时触发。这点对确保易访问性很重要，意味着onclick事件处理程序既可以通过键盘也可以通过鼠标执行。/双击鼠标**左键**时触发 |
| mouseover/mouseout    | 鼠标移入目标元素上方。鼠标移到其后代元素上时会触发/鼠标移出目标元素上方 |
| mouseenter/mouseleave | 鼠标移入元素范围内触发，**该事件不冒泡**，即鼠标移到其后代元素上时不会触发/鼠标移出元素范围时触发，**该事件不冒泡**，即鼠标移到其后代元素时不会触发 |
| mousemove             | 鼠标在元素内部移到时不断触发。不能通过键盘触发               |

**note**:

在一个元素上相继触发mousedown和mouseup事件，才会触发click事件。两次click事件相继触发才会触发dblclick事件。

如果取消 了mousedown或mouseup中的一个，click事件就不会被触发。直接或间接取消了click事件，dblclick事件就不会被触发了。

#### 2.事件顺序

在单个动作触发多个事件时，事件的顺序是固定的。也就是说，会遵循 `mousedown` → `mouseup` → `click` 的顺序调用处理程序。

#### 2.1事件触发的顺序

举例：通过双击按钮，看一下上面触发的事件。

```html
<body>
<input id="btn" type="button" value="click"/>
<script>
    var btn=document.getElementById("btn");
    btn.addEventListener("mousedown",function(event){
        console.log("mousedown");
    },false);
    btn.addEventListener("mouseup",function(){
        console.log("mouseup");
    },false);
    btn.addEventListener("click", function () {
        console.log("click");
    },false);
    btn.addEventListener("dblclick", function () {
        console.log("dblclick");
    },false);
</script>
</body>
```

![双击鼠标,事件触发顺序](https://images0.cnblogs.com/blog/315302/201411/182134449882507.jpg)

#### 2.2 mouseenter和mouseover

与css当中使用hover伪类实现的移入移出相比,JS当中的移入和移出是分开操作的,如果移入修改了某些内容,移出时是不会自动还原的

 区别：

mouseover事件会冒泡，这意味着，鼠标移到其后代元素上时会触发。

mouseenter事件不冒泡，这意味着，鼠标移到其后代元素上时不会触发。

一般情况下mouseover即可，特殊情况才用mousemove，mousemove更耗资源，比如要监控鼠标坐标的变化等

//事件冒泡: 即在子元素上触发的事件会向上传递至父级元素，并触发绑定在父级元素上的相应事件。

在事件触发时，浏览器会产生一个event对象，在这个对象上有一个target属性，指向了触发事件的最底层的DOM，通过target我们可以准确的找到事件触发的元素。

**mouseenter不支持冒泡, mouseover支持冒泡**  mousemover也不支持冒泡

```html
//原文链接：https://blog.csdn.net/weixin_41072247/article/details/79315402
1.鼠标移入父级div,33行与30行分别先后打印 outer outer
2.鼠标移入子级div,33行与30行分别先后打印 inner outer

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>onmouseover&onmouseenter</title>
    <style> 
        #outer{
            position: relative;
            width: 200px;
            height: 200px;
            margin: 100px;
            border: 1px solid #ccc;
        }
        #inner{
            position: absolute;
            left: -50px;
            top: 0;
            width: 100px;
            height: 100px;
            border: 1px solid #ccc;
        }       
    </style>
</head>
<body>
    <div id="outer">    
        <div id="inner"></div>
    </div>
    <script>
        outer.onmouseenter = function(e){
            console.log(e.target.id) // outer
        }
        outer.onmouseover = function(e){
            console.log(e.target.id) // inner
        }
    </script>
</body>
</html>
```

#### 2.3 mouseover和mousemove的区别

一般情况下mouseover即可，特殊情况才用mousemove，mousemove更耗资源，比如要监控鼠标坐标的变化等。

onmousemove

鼠标移动事件, 在绑定了这个事件的元素内, 只要移动,就会持续高频次触发, 一直检测你的移动状态

只要想绑定一个事件, 让它在整个页面当中都可以生效,直接绑定给==document==

#### 3.鼠标左键和右键

```js
<script type="text/javascript">
document.onmousedown=function (ev)
{
    var oEvent=ev||event; //IE浏览器直接使用event或者window.event得到事件本身。
    alert(oEvent.button);// IE下鼠标的 左键是1 ，  右键是2   ff和chrome下 鼠标左键是0  右键是2
};
</script>
```



#### 4.鼠标按钮

与点击相关的事件始终具有 `button` 属性，该属性允许获取确切的鼠标按钮。

通常我们不在 `click` 和 `contextmenu` 事件中使用这一属性，因为前者只在单击鼠标左键时触发，后者只在单击鼠标右键时触发。

不过，在 `mousedown` 和 `mouseup` 事件中则可能需要用到 `event.button`，因为这两个事件在任何按键上都会触发，所以我们可以使用 `button` 属性来区分是左键单击还是右键单击。

`event.button` 的所有可能值如下：

| 鼠标按键状态    | event.button |
| --------------- | ------------ |
| 左键 (主要按键) | 0            |
| 中键 (辅助按键) | 1            |
| 右键 (次要按键) | 2            |



#### 5.组合键

所有的鼠标事件都包含有关按下的组合键的信息。

事件属性：

- `shiftKey`：Shift
- `altKey`：Alt（或对于 Mac 是 Opt）
- `ctrlKey`：Ctrl
- `metaKey`：对于 Mac 是 Cmd

如果在事件期间按下了相应的键，则它们为 `true`。

比如，下面这个按钮仅在 Alt+Shift+click 时才有效：

```html
<button id='button'>Alt+Shift+click on me</button>

<script>
	button.click=function(event){
    if(event.altKey && event.shiftKey){
      alert('hooray')
    }
  }
</script>
```



#### 6. 鼠标坐标

所有的鼠标事件都提供了两种形式的坐标：

1. 相对于窗口的坐标：`clientX` 和 `clientY`。以当前窗口的左上角为参照物，并且同一位置的坐标会随着页面的滚动而改变。
2. 相对于文档的坐标：`pageX` 和 `pageY`。以文档的左上角为参照物，并且同一位置的坐标不随页面的滚动而改变

案例:鼠标移动到输入字段上，可以看到 `clientX/clientY`

```html
<input onmouseover="this.value=event.clientX+':'+event.clientY" value="mouse over me"/>
```



#### 7.防止鼠标按下时的操作

双击鼠标会有副作用，在某些界面中可能会出现干扰：它会选择文本。

比如，双击下面的文本，除了我们的处理程序外，还会选择文本：

比如,  如果按下鼠标左键，并在不松开的情况下移动鼠标，这也常常会造成不必要的选择。

```html
<span ondbclick='alert(dbclick)'>double-click me</span>
```

如何解决?在这种情况下，最合理的方式是防止浏览器对 `mousedown` 进行操作。这样能够阻止刚刚提到的两种选择：

```html
Before...
<b ondblclick="alert('Click!')" onmousedown="return false">
  Double-click me
</b>
...After
```



如何防止复制?如果我们想禁用选择以保护我们页面的内容不被复制粘贴，那么我们可以使用另一个事件：`oncopy`

```html
<div oncopy="alert('copying forbidden!')';return false"
  Dear user,
  The copying is forbidden for you.
  If you know JS or HTML, then you can get everything from the page source though.
</div>   
```



#### 8.[总结](https://zh.javascript.info/mouse-events-basics#zong-jie)

鼠标事件有以下属性：

- 按钮：`button`。
- 组合键（如果被按下则为 `true`）：`altKey`，`ctrlKey`，`shiftKey` 和 `metaKey`（Mac）。
  - 如果你想处理 Ctrl，那么不要忘记 Mac 用户，他们通常使用的是 Cmd，所以最好检查 `if (e.metaKey || e.ctrlKey)`。
- 窗口相对坐标：`clientX/clientY`。
- 文档相对坐标：`pageX/pageY`。

`mousedown` 的默认浏览器操作是文本选择，如果它对界面不利，则应避免它。



#### 9.案例-可选列表

创建一个可以选择元素的列表，例如在文件管理器中。

- 点击列表元素，只选择该元素（添加 `.selected` 类），取消选择其他所有元素。
- 如果点击时，按键 Ctrl（在 Mac 中为 Cmd）是被按下的，则选择会被切换到被点击的元素上，但其他元素不会被改动。

```js
//DOM classList属性
classList 属性返回元素的类名，作为 DOMTokenList 对象。
该属性用于在元素中添加，移除及切换 CSS 类。
classList 属性是只读的，但你可以使用 add() 和 remove() 方法修改它。

语法:
element.classList
返回值:
一个 DOMTokenList, 包含元素的类名列表
方法
toggle(class, true|false) 在元素中切换类名 第一个参数为要在元素中移除的类名 第二个是可选参数，是个布尔值用于设置元素是否强制添加或移除类，不管该类名是否存在

event.target 打印的是节点元素及内容
event.target.classList返回元素的类名 可替换 新增 删除
event.target.className
```



<iframe height="300" style="width: 100%;" scrolling="no" title="dom-鼠标事件-可选列表" src="https://codepen.io/westover/embed/yLMxjmE?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/westover/pen/yLMxjmE'>dom-鼠标事件-可选列表</a> by xxl
  (<a href='https://codepen.io/westover'>@westover</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>






## 二.移动鼠标

#### 1.mouseover mouseouter

当鼠标指针移到某个元素上时，`mouseover` 事件就会发生，而当鼠标离开该元素时，`mouseout` 事件就会发生

<svg xmlns="http://www.w3.org/2000/svg" width="278" height="92" viewBox="0 0 278 92"><defs><style>@import url(https://fonts.googleapis.com/css?family=Open+Sans:bold,italic,bolditalic%7CPT+Mono);@font-face{font-family:'PT Mono';font-weight:700;font-style:normal;src:local('PT MonoBold'),url(/font/PTMonoBold.woff2) format('woff2'),url(/font/PTMonoBold.woff) format('woff'),url(/font/PTMonoBold.ttf) format('truetype')}</style></defs><g id="dom" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g id="mouseover-mouseout.svg"><path id="Rectangle-6" fill="#FFF9EB" stroke="#E8C48E" stroke-width="2" d="M95 25h88.014v50.451H95z"/><text id="&lt;DIV&gt;" fill="#8A704D" font-family="OpenSans-Bold, Open Sans" font-size="14" font-weight="bold"><tspan x="118.964" y="56">&lt;DIV&gt;</tspan></text><path id="Fill-55" fill="#EE6B47" d="M109 51.828S88.159 39.088 74.327 34c-.336 2.104-.67 4.208-1.007 6.311-22.67-1.178-45.696.566-67.32 5.234l8.31 12.565c18.27-3.944 37.724-5.417 56.88-4.422-.337 2.105-.672 4.208-1.007 6.312C81.31 56.21 109 51.828 109 51.828"/><text id="mouseover" fill="#8A704D" font-family="PTMono-Bold, PT Mono" font-size="14" font-weight="bold"><tspan x="17" y="21">mouseover</tspan></text><path id="Fill-56" fill="#EE6B47" d="M268 51.828S247.159 39.088 233.327 34c-.336 2.104-.67 4.208-1.007 6.311-22.67-1.178-45.696.566-67.32 5.234l8.31 12.565c18.27-3.944 37.724-5.417 56.88-4.422-.337 2.105-.672 4.208-1.007 6.312C240.31 56.21 268 51.828 268 51.828"/><text id="mouseout" fill="#8A704D" font-family="PTMono-Bold, PT Mono" font-size="14" font-weight="bold"><tspan x="193" y="21">mouseout</tspan></text></g></g></svg>

#### 2.relatedTarget属性

此属性是对 `target` 的补充。当鼠标从一个元素离开并去往另一个元素时，其中一个元素就变成了 `target`，另一个就变成了 `relatedTarget`. 

对于 `mouseover`：

- `event.target` —— 是鼠标移过的那个元素。
- `event.relatedTarget` —— 是鼠标来自的那个元素（`relatedTarget` → `target`）。

`mouseout` 则与之相反：

- `event.target` —— 是鼠标离开的元素。
- `event.relatedTarget` —— 是鼠标移动到的，当前指针位置下的元素（`target` → `relatedTarget`）



note:`relatedTarget` 属性可以为 `null`. 这是正常现象，仅仅是意味着鼠标不是来自另一个元素，而是来自窗口之外。或者它离开了窗口。



#### 2.1 案例

下面这个示例中，每张脸及其功能都是单独的元素。当你移动鼠标时，你可以在文本区域中看到鼠标事件。

每个事件都具有关于 `target` 和 `relatedTarget` 的信息

//**失败版本**. 父元素没有使用绝对定位,子元素使用overflow:hidden以后,出现元素下移.使用vertical-align之后,只有父元素回归位置,子元素却没有. 

```html
https://codepen.io/westover/pen/ExWLpqM
```

//**成功版本**

<iframe height="265" style="width: 100%;" scrolling="no" title="WNpKQZQ" src="https://codepen.io/westover/embed/WNpKQZQ?height=265&theme-id=light&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/westover/pen/WNpKQZQ'>WNpKQZQ</a> by xxl
  (<a href='https://codepen.io/westover'>@westover</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>




#### 3. 跳过元素

当鼠标移动时，就会触发 `mousemove` 事件。但这并不意味着每个像素都会导致一个事件。浏览器会一直检查鼠标的位置。如果发现了变化，就会触发事件。这意味着，如果访问者非常快地移动鼠标，那么某些 DOM 元素就可能被跳过.

鼠标指针并不会“访问”所有元素。它可以“跳过”一些元素. 鼠标指针可能会从窗口外跳到页面的中间。在这种情况下，`relatedTarget` 为 `null`

**案例:**

将鼠标指针移动到 `<div id="child">` 中，然后将其快速向下移动过其父级元素。如果移动速度足够快，则父元素就会被忽略。鼠标会越过父元素而不会引起其注意

<iframe height="320" style="width: 100%;" scrolling="no" title="VwpBVrG" src="https://codepen.io/westover/embed/VwpBVrG?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/westover/pen/VwpBVrG'>VwpBVrG</a> by xxl
  (<a href='https://codepen.io/westover'>@westover</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>




#### 4. 事件mouseenter和mouseleave

事件 `mouseenter/mouseleave` 类似于 `mouseover/mouseout`。它们在鼠标指针进入/离开元素时触发。

但是有两个重要的区别：

1. 元素内部与后代之间的转换不会产生影响。
2. 事件 `mouseenter/mouseleave` 不会冒泡





#### 5.事件委托

事件 `mouseenter/leave` 非常简单且易用。但它们不会冒泡。因此，我们不能使用它们来进行事件委托

例如, \<table> 上的 mouseenter/leave 的处理程序仅在鼠标指针进入/离开整个表格时才会触发。无法获取有关其内部移动的任何信息。

因此使用 mouseover/mouseout.

 

#### 6.总结

* 快速移动鼠标可能会跳过中间元素
* `mouseover/out` 和 `mouseenter/leave` 事件还有一个附加属性：`relatedTarget`。这就是我们来自/到的元素，是对 `target` 的补充
* 即使我们从父元素转到子元素时，也会触发 `mouseover/out` 事件。浏览器假定鼠标一次只会位于一个元素上 —— 最深的那个
* `mouseenter/leave` 事件在这方面不同：它们仅在鼠标进入和离开元素时才触发。并且它们不会冒泡



#### 7. 案例

1.工具提示行为

编写 JavaScript，在带有 `data-tooltip` 特性（attribute）的元素上显示一个工具提示。该特性的值应该成为工具提示的文本

<iframe height="500" style="width: 100%;" scrolling="no" title="dom-工具提示行为" src="https://codepen.io/westover/embed/XWMPjjE?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/westover/pen/XWMPjjE'>dom-工具提示行为</a> by xxl
  (<a href='https://codepen.io/westover'>@westover</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>



2.智能工具提示

编写一个函数，该函数仅在访问者将鼠标 **移至** 元素而不是 **移过** 元素的情况下，在该元素上显示工具提示

如果访问者将鼠标移至元素上，并停下来 —— 显示工具提示。如果他们只是将鼠标移过元素，那就没必要显示



```js
这个案例真的比较难理解,起码我是这么想.
https://zh.javascript.info/mousemove-mouseover-mouseout-mouseenter-mouseleave#shi-jian-mouseovermouseoutrelatedtarget
```





## 三.鼠标拖放事件??

如何使用鼠标事件来实现拖放





## 四.指针事件??

指针事件（Pointer Events）是一种用于处理来自各种输入设备（例如鼠标、触控笔和触摸屏等）的输入信息的现代化解决方案。

除非你写的代码需要兼容旧版本的浏览器，例如 IE 10 或 Safari 12 或更低的版本，否则无需继续使用鼠标事件或触摸事件 —— 我们可以使用指针事件。

#### 1.指针事件类型

| 指针事件           | 类似的鼠标事件 |
| ------------------ | -------------- |
| pointerdown        | mousedown      |
| pointerup          | mouseup        |
| pointermove        | mousemove      |
| pointerover        | mouseover      |
| pointerout         | mouseout       |
| pointerenter       | mouseenter     |
| pointerlevave      | mouseleave     |
| pointercancel      |                |
| gotpointercapture  |                |
| lostpointercapture |                |



note:

我们可以把代码中的 `mouse<event>` 都替换成 `pointer<event>`，程序仍然正常兼容鼠标设备。

替换之后，程序对触屏设备的支持会“魔法般”地提升。但是，我们可能需要在 CSS 中的某些地方添加 `touch-action: none`

#### 2.指针事件属性

指针事件具备和鼠标事件完全相同的属性，包括 `clientX/Y` 和 `target` 等，以及一些其他属性

**pointerId**  触发当前事件的指针唯一标识符

浏览器生成的。使我们能够处理多指针的情况，例如带有触控笔和多点触控功能的触摸屏

**pointerType**  指针的设备类型。必须为字符串，可以是：“mouse”、“pen” 或 “touch”。

可以使用这个属性来针对不同类型的指针输入做出不同响应

**isPrimary** 当指针为首要指针（多点触控时按下的第一根手指）时为 `true`

**其他**

#### 3.多点触控

未完成



## 五.键盘事件keydown和keyup

在现代设备上，还有其他“输入内容”的方法,例如，人们使用语音识别（尤其是在移动端设备上）或用鼠标复制/粘贴。

如果我们想要跟踪 `<input>` 字段中的所有输入，那么键盘事件是不够的。无论如何，还需要一个名为 `input` 的事件来跟踪 `<input>` 字段中的更改。

当我们想要处理键盘行为时，应该使用键盘事件（虚拟键盘也算）。例如，对方向键 Up 和 Down 或热键（包括按键的组合）作出反应。

<iframe height="300" style="width: 100%;" scrolling="no" title="dom-键盘事件" src="https://codepen.io/westover/embed/YzZBKoP?height=265&theme-id=light&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/westover/pen/YzZBKoP'>dom-键盘事件</a> by xxl
  (<a href='https://codepen.io/westover'>@westover</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>




#### 1.keydown/keyup

当一个按键被按下时，会触发 `keydown` 事件，而当按键被释放时，会触发 `keyup` 事件。



##### event.code/event.key

事件对象的 `key` 属性允许获取字符，而事件对象的 `code` 属性则允许获取“物理按键代码”

例如，同一个按键 Z，可以与或不与 `Shift` 一起按下。我们会得到两个不同的字符：小写的 `z` 和大写的 `Z`。

`event.key` 正是这个字符，并且它将是不同的。但是，`event.code` 是相同的：

| Key     | event.key | event.code |
| ------- | --------- | ---------- |
| Z       | z(小写)   | KeyZ       |
| shift+Z | Z(大写)   | KeyZ       |

**大小写敏感：**`"KeyZ"`**，不是** `"keyZ"`



**两个如何选择?**  

1.event.code

`vent.key` 的值是一个字符，它随语言而改变。如果访问者在 OS 中使用多种语言，并在它们之间进行切换，那么相同的按键将给出不同的字符。因此检查 `event.code` 会更好，因为它总是相同的。

```js
document.addEventListener('keydown' function(e) {
  if(event.code ==='KeyZ' && (event.ctrlKey || event.metaKey)) {
    alert('Undo');
  }
})
```



2.看情况

* 想要处理与布局有关的按键？那么 `event.key` 是我们必选的方式。

* 一个热键即使在切换了语言后，仍能正常使用？那么 `event.code` 可能会更好。

**event.code问题**

对于不同的键盘布局，相同的按键可能会具有不同的字符。幸运的是，这种情况只发生在几个代码上

为了可靠地跟踪与受键盘布局影响的字符，使用 `event.key` 可能是一个更好的方式。



#### 2.自动重复

如果按下一个键足够长的时间，它就会开始“自动重复”：`keydown` 会被一次又一次地触发，然后当按键被释放时，我们最终会得到 `keyup`。因此，有很多 `keydown` 却只有一个 `keyup` 是很正常的。

对于由自动重复触发的事件，`event` 对象的 `event.repeat` 属性被设置为 `true`。

#### 3.默认行为

例如:

- 出现在屏幕上的一个字符（最明显的结果）。
- 一个字符被删除（Delete 键）。
- 滚动页面（PageDown 键）。
- 浏览器打开“保存页面”对话框（Ctrl+S）
- ……等。

阻止对 `keydown` 的默认行为可以取消大多数的行为，但基于 OS 的特殊按键除外。例如，在 Windows 中，Alt+F4 会关闭当前浏览器窗口。并且无法通过在 JavaScript 中阻止默认行为来阻止它。

1.案例: 下面的这个 `<input>` 期望输入的内容为一个电话号码，因此它不会接受除数字，`+`，`()` 和 `-` 以外的按键

```html
<input onkeydown="return checkPhoneKey(event.key)" placeholder='Phone,please' type="tle">
  
<script>
	function checkPhoneKey(key) {
    return (key>='0'&&key<='9')||key=='+'||key=='-'||key=='('||key==')'
  }
</script>

//事件名称前添加return的原因?
https://www.cnblogs.com/peijie-tech/p/3748453.html
```

请注意，像 Backspace，Left，Right，Ctrl+V 这样的特殊按键在输入中无效。这是严格过滤器 `checkPhoneKey` 的副作用。

过滤条件放宽:

```js
<script>
function checkPhoneKey(key) {
  return (key >= '0' && key <= '9') || key == '+' || key == '(' || key == ')' || key == '-' ||
    key == 'ArrowLeft' || key == 'ArrowRight' || key == 'Delete' || key == 'Backspace';
}
</script>
<input onkeydown="return checkPhoneKey(event.key)" placeholder="Phone, please" type="tel">
```



#### 4.遗存

大多数浏览器对它们都存在兼容性问题: `keypress` 事件，还有事件对象的 `keyCode`、`charCode` 和 `which` 属性

大多数浏览器对它们都存在兼容性问题，以致使该规范的开发者不得不弃用它们并创建新的现代的事件（本文上面所讲的这些事件），除此之外别无选择。旧的代码仍然有效，因为浏览器还在支持它们，但现在完全没必要再使用它们。



#### 5.总结

按一个按键总是会产生一个键盘事件，无论是符号键，还是例如 Shift 或 Ctrl 等特殊按键。唯一的例外是有时会出现在笔记本电脑的键盘上的 Fn 键。它没有键盘事件，因为它通常是被在比 OS 更低的级别上实现的。



**键盘事件**

* keydonw 按下键(如果长按按键,则将自动重复)
* keyup 释放按键时

**键盘事件主要属性**

* code 按键代码('KeyA', 'ArrowLeft'等),特定于键盘上按键的物理位置.
* key 字符('A', 'a'等),对非字符按键,通常具有和code相同的值

过去，键盘事件有时会被用于跟踪表单字段中的用户输入。这并不可靠，因为输入可能来自各种来源。我们有 `input` 和 `change` 事件来处理任何输入



#### 6.练习

创建一个 `runOnKeys(func, code1, code2, ... code_n)` 函数，在同时按下 `code1, code2, ... code_n` 键时运行函数 `func`。

例如，当按键 `"Q"` 和 `"W"` 被一起按下时（任何语言中，无论是否 CapsLock），下面的代码将显示 `alert`：

<iframe height="265" style="width: 100%;" scrolling="no" title="dom-键盘事件keyup/keydown" src="https://codepen.io/westover/embed/WNpPopw?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/westover/pen/WNpPopw'>dom-键盘事件keyup/keydown</a> by xxl
  (<a href='https://codepen.io/westover'>@westover</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>






## 六.滚动







#### 5. 事件坐标(鼠标的位置)++.

事件坐标,就是事件发生时,鼠标所在的位置

#### 类型

##### clientX && clientY

取值是鼠标相对视口的水平和垂直距离,相对于 ==视口的左上角==(以视口左上角为原点) 最常用 受滚动条影响

##### pageX && pageY

取值鼠标相对于页面的水平和垂直距离, 相对的是==页面的左上角== (以页面左上角为原点) 不受滚动条影响

##### offsetX && offsetY

取值鼠标相对于自身元素的水平距离和垂直距离, 相对的是==元素自身左上角==(以自身元素左上角为原点)



#### 实例

```HTML
- 图片跟随鼠标移动而移动, 使用循环定时器快速切换
<style>
img{
    width: 100px;
    position: absolute;
    left:0;
    top:0;
         }
</style>

<img src="1.jpg">

<script>
	window.onload = function(){
        var imgNode = document.querySelector('img');
        var num = 0;
        setInterval(function(){
            num++;
            imgNode.src = num%2 + 1 + 'jpg';
        }, 50);
        
        document.onmousemove = function(event){
            imgNode.style.left = event.clientX + 'px';
            imgNode.style.top = event.clientY + 'px';
            
        };
    }

</script>

```



#### 二级菜单切换

```html
<ul class="list clearFix">
    <li>男装
        <ul class="item">
            <li>衬衫</li>
            <li>裤子</li>
            <li>鞋</li>
        </ul>
    </li>
    <li>女装
        <ul class="item">
            <li>衬衫</li>
            <li>裤子</li>
            <li>鞋</li>
        </ul>
    </li>
    <li>电器
        <ul class="item">
            <li>衬衫</li>
            <li>裤子</li>
            <li>鞋</li>
        </ul>
    </li>
</ul>

<script>
 window.onload = function(){

        var items = document.querySelectorAll('.item');
        var lists = document.querySelectorAll(('.list>li'));


        for(var i=0; i<lists.length; i++){
           lists[i].index = i;			
            //用for给li添加index属性索引,以实现和二级ul下标对应
		    //
            
            //lists[i].onclick = function(){
            //    console.log(this.index);
            //} 检查一级ul下的li的索引是否和index属性一一对应
           lists[i].onmouseenter = function(){
               items[this.index].style.display = 'block';
               //为什么不用i代替this.index? 
               //循环都执行后才会给每个li绑定事件.当触发事件时,外层循环早已执行完.i的值是循环终止的值.在循环外是i+1. 
           }//循环操作绑定事件回调的时候,在回调内部一定不能使用外部循环的变量,因为它一定是最后一个数
           lists[i].onmouseleave = function(){
               items[this.index].style.display = 'none';
           }
        }

    }
</script>

```



## 八.键盘事件

```JavaScript
- 键盘事件分为onkeyup(键盘抬起)和onkeydown(键盘按下)两种
- 实际开发中,onkeyup用的多一些.因为在一次交互逻辑中,抬起事件只会被触发一次,不会反复调用回调函数.但是onkeydown事件,如果不抬起键盘,会一直触发
- 判断用户输入哪个键
- 通过事件对象上一个叫做keycode的属性,来判断当前的按键
- 高级浏览器中,事件对象会作为回调函数的第一个形参传递过来供我们使用 常见名字event ev e
```



```html
<input type='text'>
<scirpt>
window.onload = function(){
    var inputNode = document.querySelector('input');
    inputNode.onkeyup = function(event){
    //通常判断按键时,直接写一个if,对按键进行判断,然后将后续逻辑写在if里面
    	if(event.keycode === 13){  //enter键的keycode值是13
    		this.value = '';	   //清空事件源input标签的内容
    		//this.value value的值是字符串
    		}
    	}
    }
</scirpt>
```



## 九.光标事件

```JavaScript
- 获得焦点 onfocus
- 失去焦点 onblur
```



```javascript
- 案例: 输入框得到焦点 背景色变pink 文字颜色

window.onload = function(){
    var inputNode = document.querySelector('input');
    
    inputNode.onfocus = fucntion(){
        console.log('获得焦点');
        this.style.backgroundColor = 'pink';
        this.style.color = 'yellow';
    }
}
```



#### 爱好选择器

```html
- if表达式的结果为true和false,可将直接表达式赋值给执行语句 缩减语句

<input type="checkbox" class="checkAllBox">全选/全不选
<br>
<input type="checkbox" class="item">学习
<input type="checkbox" class="item">买东西
<input type="checkbox" class="item">滑雪
<input type="checkbox" class="item">打游戏
<br>
<button class="btn1">全选</button>
<button class="btn2">全不选</button>
<button class="btn3">反选</button>


<script>
    window.onload = function(){
        var checkbox = document.querySelector('.checkAllBox');
        var items = document.querySelectorAll('.item');
        var btn1 = document.querySelector('.btn1');
        var btn2 = document.querySelector('.btn2');
        var btn3 = document.querySeletocr('.btn3');
        
        //全选和全不选
        btn1.onclick = function(){
            checkbox.checked = true;
            for(var i=0; i<items.length; i++){
                items[i].checked = true;
            }
        }
        btn2.onclick = function(){
            checkbox.checked = false;
            for(var i=0; i<items.length; i++){
                items[i].checked = false;
            }
        }
        //反选
        btn3.onclick = function(){
            for(var i=0; i<items.length; i++){
                items[i].checked = !items[i].checked;
            }
            //反选情况2:当反选按钮实现4个全选时,更新上面box状态
            var num = 0;
            for(var i=0; i<items.length; i++){
                if(items[i].checked){
                    num++;
                }
                //if(num === items.length){
                //    checkbox.checked = true;
                //}else{
                //    checkbox.checked = false;
                //} 使用如下语句代替if else判断
                checkbox.checked = num==items.length;
                
            }
            
        }
    }
</script>    
```



```js
# 爱好选择器 使用封装函数实现第三部分全选更新上面box

btn3.onclick = function(){
	for(var i=0; i<items.length; i++){
        items[i].checked = !items[i].checked;
    }
    checkAll();
}

for(var i=0; i<items.length; i++){
    items[i].onclick = function(){
        checkAll();
    }
}

function checkAll(){
    var num = 0;
    for(var i=0; i<items.length; i++){
        if(item[i].checked){
            num++;
        }
        checkAll.checked = num==items.length;
    }
}
```



## 其他 右键事件

#### 是什么

Context Menu是一个与用户进行友好交互的菜单，例如鼠标的右键产生的效果。默认情况下，在网页上右击可以看到“重新加载”“打印”“查看页面源码”等选项；在图片上右击会出现“保存至本地”“另存为”等选项。


#### 定制contextmenu事件


#### 自定义右键事件

**效果**
![屏幕截图-2022-12-03-153049](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/屏幕截图-2022-12-03-153049.1bw4d0q69i3k.webp)



**实例**
<iframe src="https://codesandbox.io/embed/jovial-pike-fube5o?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Sandbox Info  dom-事件委托-右键事件"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>



### 文档加载完成事件
#### 是什么
load事件会在页面、脚本或者图片加载完成后触发。其中，支持onload事件的标签有body、frame、frameset、iframe、img、link、script。

#### 应用
如果load事件用于页面初始化，则有两种实现方式
* 第一种方式是在body标签上使用onload属性，类似于onclick属性的设置，其实就是DOM0级事件处理程序。
```html
<!-- 使用onload属性 -->
<body onload="bodyLoad()">
<script>
    function bodyLoad() {
        console.log('文档加载完成，执行onload方法');
    }
</script>
</body>
```
* 第二种方式是设置window对象的onload属性，属性值为一个函数。
```html
<script>
    window.onload = function () {
        console.log('文档加载完成，执行onload方法');
    };
</script>
```
使用以上两种方式中的任何一种，页面在加载完成后，都会输出“文档加载完成，执行onload方法”。
注意:
在load事件的两种实现方式中，第一种方式的优先级会高于第二种方式，如果同时采用两种方式，则只有第一种方式会生效。

#### 应用
//其他




# 节点

**什么是节点**

文档树所有包含的东西都可以称作节点

**节点的分类**

元素 文本 属性 注释

元素内的文本形成**文本节点**,被标记为==#text== .一个文本节点只包含一个字符串.它没有子项,并且总是树的叶子.

请注意文本节点的特殊字符:

* 换行符 `↵`（在 JavaScript 中为 `\n`）
* 空格: `␣`

空格和换行符都是完全有效的字符,它们形成文本节点并成为DOM一部分.只有两个顶级排除项:

1.\<head>之前的空格和换行符均被忽略.

2.\</body>之后不能有空格.如果在其后放置东西,会被自动移动到body内,并处于body的最下方,因为HTML规范要求所有内容必须为于body内.



**注意事项**

按照DOM规范,表格必须具有\<tbody>. 但HTML文档却忽略了它,浏览器在创建DOM时,自动创建了\<tbody>.



### 查找元素的其他方式

#### 节点:

换行符会被当做文本节点,当文本连续时中间没有元素分割,换行与否都会当做一个节点

#### 子节点和子元素

##### childNodes(儿子节点)

拿到某个元素子节点:包括元素,文本,注释节点

高级浏览器: 元素, 文本(文本,空格,换行), 注释

低版本浏览器: 元素, 文本(不包括空格和换行), 注释

**实例**

参考下面的案例:

| 节点类型 | nodeName   | nodeType | nodeValue |
| -------- | ---------- | -------- | --------- |
| 文本节点 | `#text`      | 3        | 文本内容  |
| 元素节点 | 全大写英文 | 1        | null      |
| 注释节点 | `#comment `  | 8        | 注释内容  |



##### children

拿到的是某个元素的子元素节点

高级浏览器: 元素

低版本浏览器: 元素, 注释



##### 两者实例比较

```HTML
<div class="box">
    hahahaha
    <h2>哈哈哈</h2><p>今天中午吃点啥</p>
    <span>大米饭</span>
    <div>明天我休息了</div>
    <!--今天挺冷的-->
</div>
<script type="text/javascript">
    window.onload = function () {
        var boxNode = document.querySelector('.box');
        console.log(boxNode.childNodes);
        console.log(boxNode.children);

    }


NodeList(10) [text, h2, p, text, span, text, div, text, comment, text]
HTMLCollection(4) [h2, p, span, div]   
```





#### 获取元素的子节点和子元素

> 封装一个筛选所有子元素节点的方法

```html
<div class="box">
    hahahaha
    <h2>哈哈哈</h2><p>今天中午吃点啥</p>
    <span>大米饭</span>
    <div>明天我休息了</div>
    <!--今天挺冷的-->
</div>

<script>
 window.onload = function (){
     var boxNode = document.querySelector('.box');
     
     function allchildElementNodes(node){
         var arr = [];//声明一个数组,作为存储所有子元素节点的容器
         //遍历当前所有的子节点,通过判断nodeType是否为1 来确定是否加入数组
         for(var i=0; i<node.childNodes.length; i++){
             if(node.childNodes){
                 arr.push(node.childNodes[i]);
             }
         }
         return arr;
     }
     var result = allChildElementNodes(boxNode);
     console.log(result);
     
     //获取子元素节点 返回所有子元素节点 低版本浏览器会返回元素和注释节点
     console.log(node.children);
 }   
    
</script>    
```







### 查找元素的其他方式2

#### 查找子元素

firstChild 第一个子节点

firstElementChild 第一个子元素节点  //从父元素的视角进行获取  连标签也会获取

lastChild 最后一个子节点

lastElementChild 最后一个子元素节点

previousSibling 上一个兄弟节点    //从兄弟元素角度进行获取

previousElementSibling 上一个兄弟元素节点

nextSibling 下一个兄弟节点

nextElementSiling 下一个兄弟元素节点

#### 查找父元素

parentNode 获取父节点

parentElementNode 获取父元素节点

#### 查找某个元素的所有兄弟元素

```js
const a = el => [].slice.call(el.parentNode.children).filter(child => child !== el)
```

**总结**  ???

> 在获取某个元素的父元素时,以上的parentNode和parentElementNode方法, 得到的结果一样
>
> 所有获取元素节点的方式 都是高级浏览器生效 低级浏览器不能使用
>
> 所有获取节点的方式(不分类型的) 都是所有浏览器通用的.
>
> 父节点必须是元素节点



### 封装获取第一个子元素节点的方法

```html
<div class="box">
    hahahaha
    <h2>哈哈哈</h2><p>今天中午吃点啥</p>
    <span>大米饭</span>
    <div>明天我休息了</div>
    <!--今天挺冷的-->
</div>


<script>
    window.onload = function(){ 
        var boxNode = document.querySelector('.box');
        
        function getFirstElementChild(node){
            if(node.firstElementChild){
                return node.firstElementChild;
            }else{
                var result = node.firstElementChild
                while(result!==0 && reuslt.nodeType!==1){
                    result = result.nextSibling;
                }
                return result;
            }
        }
</script>    
```







### 创建节点3种方式

```html
<div class="box">
    <h2>哈哈哈</h2>
</div>

<script>
	window.onload = function(){
        var boxNode = document.querySelector('.box');
        //第一种方式
        document.write('<h1>文本内容会覆盖页面</h1>');
        
        //第二种方式
        boxNode.innerHTML = boxNode.innerHTML + '<h1>文本内容</h1>';
        //简化版
        boxNode.innerHTML += '<h1>文本内容</h1>';
        
        //第三种方式 开发中最常用的 适用于循环结构
        //1.创建节点 createElement 传递的参数为:标签名称 这个方法返回的就是创建好的这个标签的dom对象
        var hNode = document.creatElement('h1');
        //2.操作这个节点
        hNode.innerHTML = '文本内容';
        //3.将这个dom对象放入到元素中
        boxNode.appenChild(hNode);
    }
</script>
```



### 创建元素节点比较

```HTML
createElement 适用于添加可循环的数据

innerHTML  适用于不可循环区域
```





### 创建节点案例

```html
<div class='box'>
</div>

<script>
	windown.onload = function(){
        var boxNode = document.querySelector('.box');
        var arr = ['吃饭','睡觉','滑雪','打鼓','桌游'];
        
        str = '<ul>';
        for(var i=0; i<arr.length; i++){
            str += '<li>'+arr[i]+'<\li>';  
    }
        str += '<\ul>';
        console.log(str);
}
</script>
```







## 节点增删改

> 都是父元素调用

```html
<ul class="list">
        <li>泰坦泰尼克号</li>
        <li>变形金刚</li>
        <li class="test">钢铁侠</li>
        <li>蜘蛛侠</li>
        <li>美国队长</li>
    </ul>
```



#### appendChild

**添加节点** 由父元素调用,传递一个要添加的子元素

```html
- appendChild
<script>
   window.onload = function(){
       var list = document.querySelector('.list');
       var liNode = document.createElement('li');
       liNode.innerHTML = '新加的内容';//内容不限,可以是标签,属性,文本等
       list.appendChild('liNode');
   } 
</script>    
```



#### insertBefore

**插入节点** 由父元素调用,传递两个参数.第一个参数为新增节点,第二个为参照节点.如果参照物为null,则等同于追加元素

```html
- 以类名为test元素为参照节点
父元素.insertBeofre(新增节点, 参照节点)

<script>
	window.onload = function(){
        var testNode = document.querySelector('.test');
        var liNode = document.createElement('li');
        liNode.innerHTML = '替换的内容';
        list.insertBefore(liNode, testNode);
        list.insertBefore(liNode, null);//最后追加节点
    }
</script> 

```



#### replaceChild

**替换节点** 由父元素调用,传递两个参数.第一个参数是替换的节点,第二个参照节点.replaceChild(替换, 参照)

```html
- 替换类名为test的元素

<script>
	window.onload = function(){
        var testNode = document.querySelector('.test');
        var liNode = document.createElement('li');
        liNode.innerHTML = '内容内容内容';
        list.replaceChild(liNode, testNode);
    }

</script>
```



#### removeChild

**删除节点** 由父元素调用,需要填入要删除的子元素

```html
- removeChild() 和 remove()
<script>
	window.onload = function(){
        var testNode = document.querySelector('.test');
        list.removeChild(testNode);
    }
</script>

- 上面的代码可以使用testNode.remove()实现同样效果.但IE里无法使用
```



#### 其他

```js
element.cloneNode(true) 能对一个节点进行深度克隆
```





#### 案例-input与li

```HTML
//1.鼠标移到li标签内容上方,变换背景颜色,包括新增li的.
//2.键盘事件，触发回车之后，把表单的内容动态创建li标签，所有的li标签移入变色

<html>
    <head>
        <meta charset='utf-8'>
        <title>title</title>
    </head>
    <body>
        <input type="text" >
        <ul class="list">
    	<li>七里香</li>
        <li>七里香</li>
        <li>七里香</li>
		</ul>
        <script>
        	window.onload = function(){
                //获取键盘输入,判断输入内容
                var inputNode = document.querySelector('input');
                var ulNode = document.querySelector('.list');
                var liNodes = document.querySelector('.list>li');
                
                inputNode.onkeyup = function(event){
                    //1.判断是否是回车按键
                    if(event === 13){
                        //2.获取输入内容
                        var content = this.value;//2.1 value是input的属性 赋值操作
                        //3.判断输入内容是否为空
                        if(content.trim()){//没考虑到输入前后空格情况
                            //4.将内容添加到ul列表中
                            var newLi = document.createElement('li');
                            newLi.innerHTML = content;
                            ulNode.appendChild('newLi');
                            
                            //z.为新加元素绑定事件
                            newLi.onmouseenter = function(){
                                this.style.background = 'pink';
                            };
                            newLi.onmouseenter = function(){
                                this.style.background = '';
                            };
                        }else{
                            alert('请输入正确信息');
                        }
                        this.value = '';//清空输入内容
                    }
                }; //注意此处分号
                for(var i=0; i<liNodes.length; i++){
                    liNodes[i].onmouseenter = function(){
                        //liNodes[i].style.background = 'pink';
                        this.style.background = 'pink';
                    }
                    liNodes[i].onmouseleave = function(){
                        //liNodes[i].style.background = '';
                        this.style.background = '';
                    }
                }
                //for循环存在两个问题.
                //1.新添加的li标签无法获得背景色,使用console打印只有0,1,2三个数字.必须在新增li标签处添加鼠标移入事件.
                //2.使用liNodes[i]+let可以实现效果,但换成var报错.
            }
        </script>
    </body>
</html>
```



#### 添加li标签

\1. 列表只展示数组中的name属性
\2. 实现点击"销量升序"按钮，列表内容按照销量升序重新渲染
\3. 实现点击"销量降序"按钮，列表内容按照销量降序重新渲染
注意：
\1. 必须使用DOM0级标准事件（onclick）

```html
// https://www.nowcoder.com/practice/18ea36ef9b0c470e9db7681eced6e8df?tpId=271&tqId=39548&rp=1&ru=/exam/oj&qru=/exam/oj&sourceUrl=%2Fexam%2Foj%3Fpage%3D1%26tab%3DJS%25E7%25AF%2587%26topicId%3D271&difficulty=undefined&judgeStatus=undefined&tags=&title=


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
        <button class='up'>销量升序</button>
        <button class='down'>销量降序</button>
        <ul></ul>

        <script>
            var cups = [
                { type: 1, price: 100, color: 'black', sales: 3000, name: '牛客logo马克杯' },
                { type: 2, price: 40, color: 'blue', sales: 1000, name: '无盖星空杯' },
                { type: 4, price: 60, color: 'green', sales: 200, name: '老式茶杯' },
                { type: 3, price: 50, color: 'green', sales: 600, name: '欧式印花杯' }
            ]
            var ul = document.querySelector('ul');
            var upbtn = document.querySelector('.up');
            var downbtn = document.querySelector('.down');
            // 补全代码
            
            
            function sortFn(x = 'up') {
                ul.innerHTML = '';
                let onlyNameOfCups;
                if (x === 'up') {
                    onlyNameOfCups = cups.sort((a,b)=>a.sales-b.sales).map(v => v.name)
                    console.log(onlyNameOfCups)
                } else {
                    onlyNameOfCups = cups.sort((a,b)=>b.sales-a.sales).map(v => v.name)
                }
                
                for (let i=0,length=onlyNameOfCups.length; i<length; i++) {
                    let liNode = document.createElement('li');
                    liNode.innerHTML = onlyNameOfCups[i]
                    ul.appendChild(liNode)
                }
                
            }
            upbtn.onclick = function(evt) {
                
                sortFn('up')

            }
            
            downbtn.onclick = function(evt) {
                sortFn('down')
            }
        </script>
    </body>
</html>


//
const _listRendering = arr => {
    var str = ''
    arr.forEach(element => {
        str += `<li>${element.name}</li>`
    })
    ul.innerHTML = str
}
upbtn.onclick = function () {
    var upArr = cups.sort(function (a, b) {
        return a.sales - b.sales
    })
    _listRendering(upArr)
}
downbtn.onclick = function () {
    var downArr = cups.sort(function (a, b) {
        return b.sales - a.sales
    })
    _listRendering(downArr)
}
```





#### 高级浏览器

```JavaScript
var boxNode = document.querySelector('.box');

boxNode.addEventListener('click', fn1);  //绑定1
fn1(){
    console.log('点击1');
}


- DOM2事件 是允许给一个事件类型 指定多个回调函数的,高级浏览器触发的顺序是 从上到下

boxNode.addEventListener('click', function(){ //绑定2
    console.log('点击2');
})



- 解绑
boxNode.removeEventListener('click', fn1); 
```



#### 低级浏览器

```JavaScript
attachEvent 第一个参数:事件类型(字符串传递,且带on) 第二个参数回调函数

boxNode.attachEvent('onclick', fn2);
function fn(){
	console.log('点击1');
}

- 低级浏览器中,如果一个事件类型,指定多个回调函数,触发的顺序由下至上
boxNode.attachEvent('onclick', function(){
	console.log('点击2');
});

- 和高级浏览器相同, 解绑时一定要保证参数和绑定时完全一致 //函數需要放在外面
boxNode.detachEvent('onclick', fn2);

```



### DOM2事件&兼容性绑定

```html
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        .box{
            width: 200px;
            height: 200px;
            background: pink;
        }
    </style>
</head>
<body>
<div class="box"></div>
</body>


<script>
	window.onload = function(){
        var boxNode = document.querySelector('.box');
        addEvent(boxNode, 'click', function(){
            console.log("点击");
        })
        
        //3个参数:1.要绑定的元素 2.要绑定的事件 3.事件的回调函数
        function addEvent(node, eventName, callback){
            //写兼容性函数时,需要通过判断一个方法时能使用 写函数访问不写函数调用
            if(node.addEventListener){
                node.addEventListener(eventName, callback);
                console.log('高级');
            }else{
                node.attachEvent(on+'eventname', callback);
                console.log('低级');
            }
        }
        
        function removeEvent(eventName, callback){}
    }
</script>
```






















## 元素的大小和滚动

JavaScript 中有许多属性可让我们读取有关元素宽度、高度和其他几何特征的信息

### 0.介绍

需要获取浏览器滚动条的偏移量. 有的浏览器(Chrome)使用html能够获取到值,body为0. 有的浏览器是使用body获取到值,但html为0. 它俩是一个互斥的状态,有且只有一个能够获取到值,另外一个为0. 所以使用兼容方案,==两个值相加==或者使用 ==或运算==.

虽然scroll事件发生在window上,但实际上反映的是页面中相应元素的变化.

### 1.scrollTop

属性 `scrollLeft/scrollTop` 是元素的隐藏、滚动部分的 width/height.换句话说，`scrollTop` 就是“已经滚动了多少”

在下图中，我们可以看到带有垂直滚动块的 `scrollHeight` 和 `scrollTop`



<svg xmlns="http://www.w3.org/2000/svg" width="489" height="542" viewBox="0 0 489 542"><defs><style>@import url(https://fonts.googleapis.com/css?family=Open+Sans:bold,italic,bolditalic%7CPT+Mono);@font-face{font-family:'PT Mono';font-weight:700;font-style:normal;src:local('PT MonoBold'),url(/font/PTMonoBold.woff2) format('woff2'),url(/font/PTMonoBold.woff) format('woff'),url(/font/PTMonoBold.ttf) format('truetype')}</style></defs><defs><linearGradient id="linearGradient-1" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stop-color="#FFF"/><stop offset="100%" stop-color="#F1F1F1"/></linearGradient><linearGradient id="linearGradient-2" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stop-color="#FFF"/><stop offset="100%" stop-color="#F1F1F1"/></linearGradient></defs><g id="dom" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g id="metric-scroll-top.svg"><path fill="#FFF" d="M0 0h489v542H0z"/><text id="Introduction" fill="#5A4739" font-family="OpenSans-Bold, Open Sans" font-size="16" font-weight="bold"><tspan x="94" y="54">Introduction</tspan>  <tspan x="94" y="82" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">This Ecma Standard is based on several </tspan> <tspan x="94" y="101" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">originating technologies, the most well </tspan> <tspan x="94" y="120" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">known being JavaScript (Netscape) and </tspan> <tspan x="94" y="139" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">JScript (Microsoft). The language was </tspan> <tspan x="94" y="158" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">invented by Brendan Eich at Netscape and </tspan> <tspan x="94" y="177" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">first appeared in that company’s Navigator </tspan> <tspan x="94" y="196" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">2.0 browser. It has appeared in all </tspan> <tspan x="94" y="215" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">subsequent browsers from Netscape and </tspan> <tspan x="94" y="234" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">in all browsers from Microsoft starting with </tspan> <tspan x="94" y="253" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">Internet Explorer 3.0.</tspan> <tspan x="94" y="272" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">The development of this Standard started </tspan> <tspan x="94" y="291" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">in November 1996. The first edition of this </tspan> <tspan x="94" y="310" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">Ecma Standard was adopted by the Ecma </tspan> <tspan x="94" y="329" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">General Assembly of June 1997.</tspan> <tspan x="94" y="348" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">That Ecma Standard was submitted to ISO/</tspan> <tspan x="94" y="367" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">IEC JTC 1 for adoption under the fast-track </tspan> <tspan x="94" y="386" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">procedure, and approved as international </tspan> <tspan x="94" y="405" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">standard ISO/IEC 16262, in April 1998. The </tspan> <tspan x="94" y="424" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">Ecma General Assembly of June 1998 </tspan> <tspan x="94" y="443" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">approved the second edition of ECMA-262 </tspan> <tspan x="94" y="462" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">to keep it fully aligned with ISO/IEC 16262. </tspan> <tspan x="94" y="481" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">Changes between the first and the second </tspan> <tspan x="94" y="500" font-family="OpenSans-Regular, Open Sans" font-size="14" font-weight="normal">edition are editorial in nature.</tspan></text><path id="Rectangle-1" fill="#E8C48F" fill-opacity=".88" d="M425 122v290H51V122h374zm-25 25H76v240h324V147z"/><path id="Rectangle-2" stroke="#E8C48F" stroke-opacity=".8" stroke-width="2" d="M75 22h326v500H75z"/><text id="scrollTop" fill="#EE6B47" font-family="PTMono-Regular, PT Mono" font-size="12" font-weight="normal" transform="rotate(-90 16.5 84)"><tspan x="-15.9" y="88">scrollTop</tspan></text><path id="Line-43" stroke="#EE6B47" stroke-dasharray="3,6" stroke-linecap="square" stroke-width="2" d="M9.5 147h66.14"/><path id="Line-42" stroke="#EE6B47" stroke-dasharray="3,6" stroke-linecap="square" stroke-width="2" d="M10.5 21h66.14"/><path id="Line-39" fill="#EE6B47" fill-rule="nonzero" d="M35 20.5l7 14h-6v97.819l6 .001-7 14-7-14 6-.001V34.5h-6l7-14z"/><path id="Rectangle-14" fill="#FFF" fill-opacity=".8" d="M88 33h312v89H88z"/><path id="Rectangle-15" fill="#FFF" fill-opacity=".8" d="M88 411h312v89H88z"/><text id="scrollHeight:723px" font-family="PTMono-Regular, PT Mono" font-size="14" font-weight="normal" transform="rotate(-90 449 270)"><tspan x="373.4" y="274.5" fill="#EE6B47">scrollHeight:</tspan> <tspan x="482.6" y="274.5" fill="#3B86C4">723px</tspan></text><path id="Line-27" stroke="#EE6B47" stroke-dasharray="3,6" stroke-linecap="square" stroke-width="2" d="M393.5 22h78.14"/><path id="Line-28" stroke="#EE6B47" stroke-dasharray="3,6" stroke-linecap="square" stroke-width="2" d="M393.5 522h78.14"/><path id="Line-25" fill="#EE6B47" fill-rule="nonzero" d="M462 24.5l7 14h-6v466h6l-7 14-7-14h6v-466h-6l7-14z"/><g id="Scrollbar" transform="translate(384 147)"><rect id="Rectangle-19" width="15" height="239" x=".5" y=".5" fill="#F3F2F2" stroke="#E9E9E9" rx="3"/><g id="Rectangle-18-+-Triangle-1"><rect id="Rectangle-18" width="15" height="19" x=".5" y=".5" fill="url(#linearGradient-1)" stroke="#CFCFCF" rx="3"/><path id="Triangle-1" fill="#92979F" d="M8 7l3.2 6H4.8z"/></g><g id="Rectangle-18-+-Triangle-2" transform="matrix(1 0 0 -1 0 240)"><rect id="Rectangle-18" width="15" height="19" x=".5" y=".5" fill="url(#linearGradient-1)" stroke="#CFCFCF" rx="3"/><path id="Triangle-1" fill="#92979F" d="M8 7l3.2 6H4.8z"/></g><g id="Rectangle-18-+-Triangle-3-+-Group" transform="translate(0 50)"><g id="Rectangle-18-+-Triangle-3" fill="url(#linearGradient-2)" stroke="#CFCFCF" transform="matrix(1 0 0 -1 0 51)"><rect id="Rectangle-18" width="15" height="50" x=".5" y=".5" rx="3"/></g><g id="Group" fill="#D8D8D8" stroke="#979797" transform="translate(4 20)"><path id="Rectangle-22" d="M.5.5h7v1h-7z"/><path id="Rectangle-23" d="M.5 3.5h7v1h-7z"/><path id="Rectangle-24" d="M.5 6.5h7v1h-7z"/><path id="Rectangle-25" d="M.5 9.5h7v1h-7z"/></g></g></g></g></g></svg>



####  1.1 可修改性

大多数几何属性是只读的，但是 `scrollLeft/scrollTop` 是可修改的，并且浏览器会滚动该元素

案例地址:

```html
https://codepen.io/westover/pen/bGqjbJy
```

<iframe height="265" style="width: 100%;" scrolling="no" title="scrollTop可修改" src="https://codepen.io/westover/embed/bGqjbJy?height=265&theme-id=light&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/westover/pen/bGqjbJy'>scrollTop可修改</a> by xxl
  (<a href='https://codepen.io/westover'>@westover</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>




#### 1.2 其他

将scrollTop设置为0或者一个大的值,例如1e9,将会使元素滚动到顶部/底部.

#### 1.3 案例

1.3.1 `elem.scrollTop` 属性是从顶部滚动出来的部分的大小。如何获得底部滚动的大小（我们称其为 `scrollBottom`）？

```js
let scrollBottom = ele.srollHeight-ele.scrollTop-ele.clientHeight;
（完全高度）减去（已滚出顶部的高度）减去（可见部分的高度）— 得到的结果就是滚动出来的底部的部分
```

1.3.2 求滚动条的宽度

对于 Windows，它通常在 `12px` 和 `20px` 之间变化。如果浏览器没有为其保留任何空间（滚动条以半透明的形式处于文本上面，也是可能发生的），那么它可能是 `0px`









#### 获取滚动条位置

**浏览器1:** document.documentElement.scrollTop

**浏览器2:** document.body.scrollTop



#### 设置滚动条位置

设置滚动条位置,其实就是修改HTML和body的scrollTop值.但是情况和获取相同,不同的浏览器需要分别通过html和body来操作.所以兼容设置的方案就是两个都设置,不会有其他影响.

一个元素的**scrollTop值**是这个**元素内容**顶部到它的**视口可见内容**的顶部的距离.例如如果设置300(没有单位),元素会向视口位置移动300px的距离. 没有负数.



#### 浏览器兼容性设置

document.documentElement.scrollTop || document.body.scrollTop

document.documentElement.scrollTop + document.body.scrollTop

#### 实例

```HTML
<style>
    button{
        margin-top: 300px;
    }
</style>

<button id="btn">按钮</button>

<script>
	window.onload = function(){
        var btnNode = document.querySelector('#btn');
        btnNode.onclick = function(){
            document.documentElement.scrollTop = document.body = 200;
        };
    }
</script>


```



### 滚动条动画实例-回顶部

#### 回到顶部2种方法

时间固定 : 路程越远, 则速度越快, 现在最常用

速度固定: 路程越远,时间越长.



#### 动画时长及帧

> 使用循环定时器,  在帧时长的单位上移动

动画总时长,  

动画帧时长(范围是30-16, 小于16和16效果在肉眼下区别很小)

总帧数= 动画总时长 / 帧时长.

总偏移(就是当前浏览器的scrollTop)

单次偏移 = 总偏移 / 总帧数.



#### 实例

```HTML
# 时间固定的前提下,点击按钮,滚动条返回顶部


<style>
    *{
        margin: 0;
        padding: 0;
    }
    body{
        height: 2000px;
    }
    #btn{
        position: fixed;
        bottom: 100px;
        right:50px;
    }
</style>

<button id="btn">回到顶部</button>

<script>
	window.onload = function(){
        var btnNode = document.querySelector('#btn');
        var allTime = 2000; //定义总时长
        var itemTime = 20;  //定义动画帧时长
        btnNode.onclick = function(){
            //获取总偏移
            var offset = document.documentElement.scrollTop || document.body.scrollTop;
            //计算单次偏移
            var itemOffset = offset / (allTime / itemTime);//单次偏移=总偏移/(总时长/动画帧时长)
			var timer = setInterval(function(){
                if(offset <= 0){
                   	clearInterval(timer);
                   }
                
                offset -= itemOffset; 
                document.documentElement.scrollTop = document.body.scrollTop = offset;
            }, itemTime);
            
        }
    }
</script>

单次偏移 * 动画帧时长 * 总帧数 = 总偏移

```


#### scrollTo方法
```js
backToTop() {
  const scroller = document.getElementsByClassName('page__scroller')[0];
  scroller.scrollTo({
    top: 0,
    behavior: 'smooth' // 指定滚动行为为平滑滚动
  });
},

```

### 元素的宽度与位置

```HTML
- clientWidth和clientHeight 可以获取初始包含块的宽度和高度,相当于视口但不是视口

clientWidth: 目标元素的宽度
clientWidth = width+paddingleft+paddingright;

clientHeight:目标元素的高度
clientHeight = height+paddingtop+paddingbottom

offsetWidth: 目标元素的宽度(加边框)
offsetWidth = width+paddingleft+paddingright+borderleft+borderright;

offsetHeight: 目标元素的高度(加边框)
offsetHeight = height+paddingtop+paddingbottom+bordertop+borderbotton

相对于包含块的偏移,就和绝对定位一样.不是相对于视口,目前所学的没有直接获取的
offsetLeft:
offsetTop:


clientLeft: 
clientTop:
内容边界到边界的距离,可以理解为border.但并不是border

遇到xy就要想到鼠标对象

```





### 导航跟随

```HTML
# 滚动条超过一屏的距离后, 导航漂浮.低于一屏的距离,回到原来的位置
# onscroll BOM事件,用于检测浏览器滚动条是否正在被移动
# 视口高度 获取的固定方式: var H = document.documentElement.clientHeight;

 <style>
     *{
         margin: 0;
         padding: 0;
     }
     body{
         height: 2000px;
     }
     .box{
         width: 100%;
         height: 80px;
         background: pink;
     }
</style>

<div class="box"></div>

<script>
	window.onload = function(){
        var H = document.documentElement.clientHeight;//视口高度
        var box = document.querySelector('.box');
        window.onscroll = function(){//用于检测浏览器滚动条,是否正在被移动,无论是什么方式
            var scrollT = document.documentElement.scrollTop||document.body.scrollTop;
            //兼容获取当前浏览器滚动条的偏移
            if(scrollT > H){
                box.style.position = 'fixed';//当前滚动的距离超过一屏, 导航漂浮
            }else{
                box.style.position = 'static';
            }
        }
    }
</script>
```



### 盒子来回移动

```HTML
# 页面上的盒子在浏览器视口宽度范围内来回移动

<style>
    *{
        margin: 0;
        padding: 0;
    }
    .box{
        width: 100px;
        height: 100px;
        background: pink;
        position: absolute;
        left: 0;
        top: 0;
    }
</style>

<div class="box"></div>

<script>
	window.onload = function(){
        var boxNode = document.querySelector('.box');
        var startLeft = 0;
        var step = 5;
        setInterval(function(){
            startLeft += step;
            if(startLeft > document.documentElement.clientWidth - boxNode.clientWidth){
                startLeft = document.documentElement.clientWidth - boxNode.clientWidth;
                step = -5; 
                //这个地方第一次的写法是 startLeft -= step; 是不正确的.这样会造成死循环
            }else if(startLeft <= 0){
                startLeft = 0;
                step = 5;
            }
            boxNode.style.left = startLeft;
        },10)
    }
</script>
```





### 拖拽基础

```HTML
<style>
    *{
        margin: 0;
        padding: 0;
    }
    .box{
        width: 100px;
        height: 100px;
        background: pink;
        position: absolute;
        left: 0;
        top: 0;

    }
</style>
<div class="box"></div>
<script>
	window.onload = function(){
        var boxNode = document.querySelector('.box');
        boxNode.onmousedown = functio(event){
            //鼠标坐标使用event.clientX的原因? 打印event就是鼠标事件
            //获取鼠标开始坐标
            var startX = event.clientX;
            var startY = event.clientY;
            //获取元素坐标
            var eleX = boxNode.offsetLeft;
            var eleY = boxNode.offsetTop;
            boxNode.onmousemove = function(event){
                //获取鼠标结束坐标
                var endX = event.clientX;
                var endY = event.clientY;
                //获取鼠标移动距离差
                var disX = endX - startX;
                var disY = endY - startY;
                
                //更新目标元素的坐标:原始坐标+移动距离
                boxNode.style.left = eleX + disX + 'px';
                boxNode.style.top = eleY + disY + 'px';
            };
            boxNode.onmouseup = function(){
                boxNode.onmousemove = boxNode.onmouseup = null; //鼠标按键抬起所有动作结束.注销函数.否则点击和移动事件不会结束.
            };
        };
       
    }
</script>

```





### 拖拽问题的解决

```HTML
# 鼠标移动过快,元素跟不上.
鼠标会脱离元素, 因为先移动鼠标,然后获取鼠标坐标,然后经过计算,最终设置元素.这个过程中页面渲染是需要时间的,元素没有第一时间跟随鼠标移动,鼠标就脱离出来了.脱离之后, 鼠标不再事件源身上,代码失效.

# 消除文字图片等内容可以被拖拽的浏览器默认行为
1.dom0级事件 阻止默认行为就是在时间回调函数的结尾添加 return false;
 - 低版本id中,文字的拖拽不算做默认行为范畴,只能通过开启全局捕获的方式进行
 - 开启全局捕获之后,就是将后续所有的事件,都聚焦在这个元素身上.相当于无论点击那里都是在点击这个元素.切记,全局捕获有开启就一定有释放.



<script>
	window.onload = function(){
        var boxNode = document.querySelector('.box');
        boxNode.onmousedown = functio(event){
            //开启全局捕获.因为高版本浏览器不认识这个方法,所以先访问.如果存在则结果为真,再调用.
            boxNode.setCapture && boxNode.setCapture();
            
            //鼠标坐标使用event.clientX的原因? 打印event就是鼠标事件
            //获取鼠标开始坐标
            var event = event || window.event;
            var startX = event.clientX;
            var startY = event.clientY;
            //获取元素坐标
            var eleX = boxNode.offsetLeft;
            var eleY = boxNode.offsetTop;
            document.onmousemove = function(event){
                var event = event || window.event;
                //获取鼠标结束坐标
                var endX = event.clientX;
                var endY = event.clientY;
                //获取鼠标移动距离差  
                var disX = endX - startX;
                var disY = endY - startY;
                
                //更新目标元素的坐标:原始坐标+移动距离  这个地方理解起来有困难.前提是鼠标在元素上位置是固定的.画图需要一条辅助线来理解
                boxNode.style.left = eleX + disX + 'px';
                boxNode.style.top = eleY + disY + 'px';
            };
            document.onmouseup = function(){
                boxNode.onmousemove = boxNode.onmouseup = null; //鼠标按键抬起所有动作结束.注销函数.否则点击和移动事件不会结束.
                //释放全局捕获
                boxNode.releaseCapture && boxNode.releaseCapture();
            };
        };
       return false;//阻止默认行为
    }
</script>
```





### 拖拽边界值测试

#### 边界值判断2种逻辑

范围限定类: 大于最大值等于最大值, 小于最小值等于最小值

首尾相接类: 大于最大值等于最小值, 小于最小值等于最大值  例如轮播图



```html
# 让元素在视口范围活动,如果移动到视口边界,则禁止继续向边界外侧移动.
# 为什么不能直接使用鼠标移动后元素的offsetLeft和offsetTop, 再加上这两个值的初始值. 错误. *******

- 因为鼠标移动之后,offsetLeft是设置出来的,是无法获取的.
- 1.offsetLeft 返回元素上边界到它的包含元素的上边界的偏移量,以像素为单位.
- 2.什么叫偏移量, 就是指绝对位置.
- 3.无论鼠标移动元素到哪里, 绝对位置不会变.
- 4.如何获取视觉位置 this.getBoundingClientRect().top


<script>
	window.onload = function(){
        var boxNode = document.querySelector('.box');
        boxNode.onmousedown = function(event){
            boxNode.setCapture && boxNode.setCapture();
            var event = event||window.event;
            var startX = event.clientX;
            var startY = event.clientY;
            var eleX = boxNode.offsetLeft;
            var eleY = boxNode.offsetTop;
            
            boxNode.onmousemove = function(event){
                var endX = event.clientX;
                var endY = event.clientY;
                var disX = endX - startX;
                var disY = endY - startY;
                
                var lastX = disX + eleX;
                var lastY = disY + eleY;
                if(lastX > document.documentElement.clientWidth - boxNode.clientWidth){
                    lastX = document.documentElement.clientWidth - boxNode.clientWidth;
                }else if(lastX <= 0){ //实现吸附效果,将最小值改为10.将最大值减去10;
                    lastX = 0;
                }
                if(lastY > document.documentElement.clientHeight - boxNode.clientHeight){
                    lastY = document.documentElement.clientHeight - boxNode.clientHeight;
                }else if(lastY <= 0){
                    lastY = 0;
                }
                
                boxNode.style.left = lastX + 'px';
                boxNode.style.top + lastY + 'px';
            }
        	boxNode.onmouseup = function(){
                boxNode.onmousemove = boxNode.onmouseup = null;
                boxNode.releaseCapture && boxNode.releaseCapture();//释放全局捕获
            }
            return false;//阻止默认行为
        }//阻止默认行为和释放全局捕获的位置不一样
        
    }
</script>
```


## window大小和滚动 //todo


## 坐标
大多数 JavaScript 方法处理的是以下两种坐标系中的一个：
**相对于窗口** —— 类似于 position:fixed，从窗口的顶部/左侧边缘计算得出。
* 我们将这些坐标表示为 clientX/clientY
**相对于文档** —— 与文档根（document root）中的 position:absolute 类似，从文档的顶部/左侧边缘计算得出。
* 我们将它们表示为 pageX/pageY。
当页面滚动到最开始时，此时窗口的左上角恰好是文档的左上角，它们的坐标彼此相等。但是，在文档移动之后，元素的窗口相对坐标会发生变化，因为元素在窗口中移动，而元素在文档中的相对坐标保持不变。

在下图中，我们在文档中取一点，并演示了它滚动之前（左）和之后（右）的坐标：
<figure>
	<div class="image" style="width: 728px">
		<div class="image__ratio" ></div>
		<object
			type="image/svg+xml"
			data="https://zh.javascript.info/article/coordinates/document-and-window-coordinates-scrolled.svg"
			width="728"
			height="300"
			class="image__image"
			data-use-theme=""
		>
			<img src="https://zh.javascript.info/article/coordinates/document-and-window-coordinates-scrolled.svg" alt="" width="728" height="300" />
		</object>
	</div>
</figure>
当文档滚动:
* pageY —— 元素在文档中的相对坐标保持不变，从文档顶部（现在已滚动出去）开始计算。
* clientY —— 窗口相对坐标确实发生了变化（箭头变短了），因为同一个点越来越靠近窗口顶部。


### 元素坐标 getBoundingClientRect









## DOM案例及功能  //todo

### 复制到剪贴板

在Web应用程序中，复制到剪贴板因其对用户的便利性而迅速流行起来。

注意：根据caniuse，该方法对93.08%的全球用户有效。所以必须检查用户的浏览器是否支持该API。为了支持所有用户，你可以使用一个输入并复制其内容。

```javascript
cosnt copyToClipboard = text => navigator.clipboard?.writeText && navigator.clipboard.writeText(text)
```



### 滚动到顶部/底部

```javascript
const scrollToTop = element => element.scrollIntoView({behavior: 'smooth', block:'start'})

cosnt scrollToBottom = element => element.scrollIntoView({behavior: 'smooth', block:'end'})
```



### 生成随机颜色

```javascript
const generateRandomHexColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16)}`
```







### 拖拽九宫格碰撞

```js
## 浏览器在每个元素上都getBoudingClientRect()方法 返回一个DOMrect对象,包含6个属性:left, top, right, bottom, height和width. 这些元素给出了元素在页面中相对于视口的位置.


<style>
    *{
        margin: 0;
        padding: 0;
    }
    .box{
        width: 100px;
        height: 100px;
        background: pink;
        position: absolute;
        left: 0;
        top: 0;

    }
    img{
        width: 150px;
        height: 140px;
        position: absolute;
        left:0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
    }
</style>

<div class='box'>文本内容</div>
<img src="1.jpg" alt="">
<scripot>
	window.onload = function(){
    	var boxNode = document.querySelector('.box');
    	var imgNode = document.querySelector('img');
    	
    	boxNode.onmousedown = function(event){
    		var event = event||window.event;
            boxNode.setCapture && boxNode.setCapture();
    		var startX = event.clientX;
    		var startY = event.clientY;
    		var eleX = boxNode.offsetLeft;
    		var eleY = boxNode.offsetTop;
            
            
            boxNode.onmousemove = function(event){
    		var event = event||window.event;
    		var endX = event.clientX;
    		var endY = event.clientY;
    		var disX = endX - startX;
    		var disY = endY -startY;
    		
    		var lastX = eleX + disX;
    		var lastY = eleX + disY;
    		
            if(lastX > document.documentElement.clientWidth - boxNode.clientWidth){
                lastX = document.documentElement.clientWidth - boxNode.clientWidth;
            }else if(lastX <= 0){
                lastX = 0;
            }
            if(lastY > document.documentElement.clientHeight - boxNode.clientHeight){
                lastY = document.documentElement.clientHeight - boxNode.clientHeight;
            }else if(lastY <= 0){
                lastY = 0;
            }
            
            boxNode.style.left = lastX + 'px';
    		boxNode.style.top = lastY + 'px';
            
            var boxNodeL = boxNode.offsetLeft + boxNode.clientWidth;
            var imgNodeL = imgNode.getBoundingClientRect().left;
            
            var boxNodeT = boxNode.offsetTop + boxNode.clientTop;
            var imgNodeT = imgNode.getBoundingClientRect().top;
            
            var boxNodeR = boxNode.offsetLeft;
            var imgNodeR = imgNode.getBoundingClientRect().left + imgNode.clientWidth;
            
            var boxNodeB = boxNode.offsetTop;
            var imgNodeB = imgNode.getBoundingClientRect().top + imgNode.clientHeight;
            
            //将所有不相邻的条件集中,通过或运算,全部写在if中,如果都不满足,则说明一定为真
            if(boxNodeL<imgNodeL||boxNodeT<imgNodeT||boxNodeR>imgNodeR||boxNodeB>imgNodeB){
                //如果有任意一个条件为true, 则原图不变
                imgNode.src = '1.jpg';
            }else{
                imgNode.src = '2.jpg';
            }
    		
    }
    	boxNode.onmouseup = function(){
            boxNode.onmousemove = boxNode.onmouseup = null;
            boxNode.releaseCapture && boxNode.releaseCapture();
            
        }
            return false;
    }
    
    
    	
    }
</scripot>
```



### 禁用浏览器滚动条

如果给body或html其中的某个设置overflow属性,都是将overflow属性设置给了document, 作用于整个页面.如果同时给html和body设置overflow属性,则html设置的属性作用于document, body的作用于自身. 背景background同样作用.

页面当中,其实一共有两个浏览器的滚动条(document和body), 所以通常写页面时,都会讲html和body共同禁止.

```HTML
html, body{
	height:100%;
	overflow:hidden;
}
```







### 自定义滚动条布局-PC



```HTML
<style>
    *{
        margin:0;
        padding:0;
    }
    html,body{
        height:100%;
        overflow:hidden;
    }
    .wrap{
        width:100%;
        height:100%;
        background:pink;
    }
    .scrollWrap{
        width:20px;
        height:100%;
        background:deeppink;
        position:fixed;
        right:0;
        top:0;
    }
    .scrollIn{
        width:10px;
        height:100px;
        background:yellowgreen;
        position:absolute;
        left:2px;
        top:0;
    }
</style>


<body>
    <!--自定义滚动条结构 滑槽 -->
    <div class='scrollWrap'>
        <!-- 滑块 -->
        <div class='scrollIn'></div>
    </div>
</body>
```



### 自定义滚动条-滑块移动

#### 自定义滚动条的万能比例:

滚动条高度/屏幕的高度 = 屏幕的高度/内容的高度 = 滚动条的滚动距离/内容的滚动距离

滚动条高度/滑槽的高度 = 屏幕的高度/内容的高度 = 滚动条的滚动距离/内容的滚动距离 屏幕高度与滑槽高度是相等的

```HTML
<style>
    *{
        margin:0;
        padding:0;
    }
    html,body{
        height:100%;
        overflow:hidden;
    }
    .wrap{
        width:100%;
        height:100%;
        background:pink;
    }
    .scrollWrap{
        width:20px;
        height:100%;
        background:deeppink;
        position:fixed;
        right:0;
        top:0;
    }
    .scrollIn{
        width:10px;
        height:100px;
        background:yellowgreen;
        position:absolute;
        left:2px;
        top:0;
    }
    .content{
        width:100%;
        position:absolute;
        left:0;
        top:0;
    }
</style>


<body>
<div class="wrap">
    <!--内容区-->
    <div class="content">
        <ul class="list"></ul>
    </div>
    <!--自定义滚动条结构     滑槽-->
    <div class="scrollWrap">
        <!--滑块-->
        <div class="scrollIn"></div>
    </div>
</div>
</body>


<script>
    window.onload = function(){
        var scrollIn = document.querySelector('.scrollIn');
        var list = document.querySelector('.list');
        var content = document.querySelector('.content');

        for(let i=0; i<300; i++){
            var liNode = document.createElement('li');
            liNode.innerHTML = i;
            list.appendChild(liNode);
        }

        // 滑块的高度/屏幕的高度 = 屏幕的高度/内容的高度 = 滚动条的滚动距离/内容的滚动距离
        // 比例 = 屏幕的高度 /内容的高度
        var scale = document.documentElement.clientHeight / list.offsetHeight;
        // 设置滑块高度 屏幕高度*scale
        scrollIn.style.height = document.documentElement.clientHeight * scale + 'px';
        scrollIn.onmousedown = function(event){
            //鼠标起始位置
            var startY = event.clientY;
            var eleY = scrollIn.offsetTop;

            document.onmousemove = function(event){
                var endY = event.clientY;
                var disY = endY - startY;

                //滑块最终的位置
                var lastY = eleY + disY;

                //滑块范围限定
                if(lastY < 0){
                    lastY = 0
                }else if(lastY > document.documentElement.clientHeight - scrollIn.clientHeight){
                    lastY = document.documentElement.clientHeight - scrollIn.clientHeight;
                }

                //设置给滑块
                scrollIn.style.top = lastY + 'px';
                //让内容区跟随滚动 滑块的滚动距离/scale
                var contentY =lastY / scale;
                content.style.top = - contentY + 'px'; //注意负值
            }
            document.onmouseup = function(){
                document.onmousemove = document.onmouseup = null;
            }
        }


    }
</script>
```



### 滚轮事件

mousewheel 既能使用dom0绑定,也能使用dom2绑定. Chrome/IE支持. 使用event.wheelDelta, 滚动向上输出120. 向下输出-120

DOMMouseScroll 只能使用dom2绑定. Firefox支持. 使用event.detail. 滚轮向上输出-3, 向下输出3.



```HTML
<style>
    *{
        margin: 0;
        padding: 0;
    }
    .box{
        width: 100px;
        height: 100px;
        margin-top: 150px;
        background: pink;
    }
</style>

<script>
	window.onload = function(){
        var box = document.querySelector('.box');
        var flag = true;//true代表向上, false代表向下
        document.addEventListener('mousewheel', fun); //chrome/IE 支持
        document.addEventListener('DOMMouseScroll', fun); //Firefox支持
        //虽然绑定事件时,需要根据不同的浏览器绑定不同的事件,不过我们在事件回调函数中处理的逻辑相同.所以,将事件的回调函数单独定义成有名函数,同时指定给两个事件.
        //滚轮事件是可以给元素使用的,只是实际应用场景不多.大多数情况下,都是在整个页面当中操作
        
        function fun(event){
            if(event.wheelDelta){//ie/chrome浏览器  负值向下 正值向上
                if(event.wheelDelta < 0){
                    flag = false;//向下
                }else{
                    flag = true;//向上
                }
            }else if(evnet.detail){
                if(event.detail > 0){
                    flag = false; //向下
                }else{
                    flag = true; //向上
                }
            }
            //通过flag赋值,统一上下方向
            
            if(flag){
                box.style.height = box.offsetHeight - 10 + 'px';
            }else{
                box.style.height = box.offsetheight + 10 + 'px';
            }
        }
        
    }
</script>
```



#### 阻止浏览器默认行为

`return false`阻止的是dom0所触发的默认行为

dom2通过event下面的event.preventDefault()





### 自定义滚动条滚轮控制滑块

```HTML
<style>
    *{
        margin: 0;
        padding: 0;
    }
    html,body{
        height: 100%;
        overflow: hidden;
    }
    .wrap{
        width: 100%;
        height: 100%;
        background: pink;
    }
    .scrollWrap{
        width: 20px;
        height: 100%;
        background: deeppink;
        position: fixed;
        right:0;
        top: 0;
    }
    .scrollIn{
        width: 16px;
        /*height: 100px;*/
        background: yellowgreen;
        position: absolute;
        left:2px;
        top:0;
    }
    .content{
        width: 100%;
        position: absolute;
        left:0;
        top:0;
    }
</style>

<div class='wrap'>
    <div class='content'>
        <ul class='list'></ul>
    </div>
    
    <div class='scrollWrap'>
        <div class='scrollIn'></div>
    </div>
</div>


<script>
	window.onload = function(){
        var scrollIn = document.querySelector('.scrollIn');
        var list = document.querySelector('.list');
        var content = document.querySelector('.content');
        
        //创建内容
        for(let i=1; i<300; i++){
            var liNode = document.createElement('li');
            liNode.innerHTML = i;
            list.appendChild(liNode);
        }
        
        //公式: 滑块的高度/屏幕的高度 = 屏幕的高度/内容的高度 = 滚动条的滚动距离/内容的滚动距离
        var scale = document.documentElement.clientHeight / content.offsetHeight;
        //求滑块高度
        scrollIn.style.height = document.documentElement.clientHeight * scale + 'px';
        
        scrollIn.onmousedown = function(event){
            //鼠标起始位置
            var startY = event.clientY;
            //元素距离包含块元素的距离
            var eleY = srcollIn.offsetTop;
            
            document.onmousemove = function(event){
                var endY = event.clientY;
                var disY = endY - startY;
                //滑块最终的位置
                var lastY = disY + eleY;
                
                //滑块范围限定
                if(lastY < 0){
                    lastY = 0;
                }else(lastY > document.documentElement.clientHeight - scrollIn.clientHeight){
                    lastY = document.documentElement.clientHeight - scrollIn.clientHeight;
                }
                
                //设置滑块滑动的距离
                scrollIn.style.top = lastY + 'px';
                //内容的滚动距离 滚动条的滚动距离/scale
                var contentY = lastY / scale;
                content.style.top = -contentY + 'px';
            };
            document.onmouseup = function(){
                document.onmousemove = document.onmouseup = null;
            };
        }
        
        //滚轮相关逻辑
        document.addEventListener('mousewheel', fun);
        document.addEventListener('DOMMouseScroll', fun);
        var flag = true;
        function fun(event){
            if(event.wheelDelta){
                //ie chrome
                if(event.wheelDelta < 0){
                    flag = false;
                }else{
                    flag = true;
                }
            }else if(event.detail){
                if(event.detail > 0){
                    flag = false;
                }else{
                    flag = true;
                }
            }
            if(flag){
                var scrollT = scrollIn.offsetTop - 10;
                if(scrollT < 0){
                    scrollT = 0;
                }
                scrollIn.style.top = scrollT + 'px';
                content.style.top = -scrollT / scale +'px';
                
            }else{
                var scrollT = scrollIn.offsetTop - 10;
                if(scrollT > document.documentElement.clientHeight - scrollIn.clientHeight){
                    scrollT = document.documentElement.clientHeight - scrollIn.clientHeight;
                }
                scrollIn.style.top = scrollT + 'px';
                content.style.top = -scrollT / scale + 'px';
            }
            
        }
    }
</script>
```



### 自定义滚动条优化

```js
document.addEventListener('mousewheel', fun);
document.addEventListener('DOMMouseScroll', fun);

var flag = true;
function fun(event){
	if(event.wheelDelta){
		if(event.wheelDelta > 0){
            flag = true;
        }else{
            flag = false;
        }
	}else if(event.detail){
        if(event.detail > 0){
            flag = false;
        }else{
            flag = true;
        }
    }
    
    if(flag){
        var scrollT = scrollIn.offsetTop - 10;
        if(scrollT < 0){
            scrollT = 0;
        }
        scrollIn.style.top = scrollT + 'px';
        content.style.top = -scrollT / scale + 'px';
    }else{
        var scrollT = scrollIn.offsetTop + 10;
        if(scrollT > document.documentElement.clientHeight - scrollIn.clientHeight){
            scrollT = document.documentElement.clientHeight -scrollIn.clientHeight;
        }
        scrollIn.style.top = scrollT + 'px';
        content.style.top = -scrollT / scale + 'px';
    }
}
```





```js
document.addEventListener('mousewheel', fun);
document.addEventListener('DOMMouseScroll', fun);

var flag = true;
var step = 10;
function fun(event){
	if(event.wheelDelta){
		if(event.wheelDelta > 0){
            step = 10;
        }else{
            step = -10;
        }
	}else if(event.detail){
        if(event.detail > 0){
            step = -10;
        }else{
            step = 10;
        }
    }
    
    if(flag){
        
        if(scrollT < 0){
            scrollT = 0;
        }
    }else{ 
        if(scrollT > document.documentElement.clientHeight - scrollIn.clientHeight){
            scrollT = document.documentElement.clientHeight -scrollIn.clientHeight;
        }
       
    }
     var scrollT = scrollIn.offsetTop + 10;
     scrollIn.style.top = scrollT + 'px';
     content.style.top = -scrollT / scale + 'px';
}
```





### 轮播图

#### HTML部分

```HTML
<!DOCTYPE html>
<html>
    <head>
        <meta charset = 'utf-8'>
        <title>title</title>
    </head>
    <body>
        <div class='container'>
            <ul class='list'>
                <li><img src='img/1.jpg' alt=''></li>
                <li><img src='img/2.jpg' alt=''></li>
                <li><img src='img/3.jpg' alt=''></li>
                <li><img src='img/4.jpg' alt=''></li>
                <li><img src='img/5.jpg' alt=''></li>
            </ul>
        </div>
    </body>
</html>
```



#### JavaScript部分

```js

```





### 页面不能点击(禁用click,input等事件)

```js
在vue组件中,想实现所有多有的点击事件实现不能点击的效果,包括二次封装的vant组件.

几种方法:
1.如果是根组件模板中,在根标签之下添加<form><filedset disabled></filedset></form> 但只能对表单内的input标签起作用
2.使用事件捕获:
 document.addEventListener('click', function() {return ....}, true)

3.class属性pointer-evnets:none; 给父组件添加之后也会影响到子组件,同时移动端上滑动效果也失效.

4.知乎 https://www.zhihu.com/question/290066361
```



```js
2.使用事件捕获

<div @input.capture = 'disableAllEvents' @click.capture = 'disableAllEvents'>
  
methods: {
  disableAllEvents(e) {
    e.target.readOnly = true;
    //e.target.disabled = true;
    
    e.stopPropagation(); //或者使用事件修饰符 .stop()
  }
}
```





### 图片懒加载

> [my--article/前端性能优化之图片懒加载.md at master · Michael-lzg/my--article (github.com)](https://github.com/Michael-lzg/my--article/blob/master/other/前端性能优化之图片懒加载.md)

#### 背景

1. 减少资源的加载，页面启动只加载首屏的图片，这样能明显减少了服务器的压力和流量，也能够减小浏览器的负担。
2. 防止并发加载的资源过多而阻塞 js 的加载，影响整个网站的启动。
3. 能提升用户的体验，不妨设想下，用户打开页面的时候，如果页面上所有的图片都需要加载，由于图片数目较大，等待时间很长这就严重影响用户体验。

#### 原理

1. 拿到所有的图片 dome 。
2. 遍历每个图片判断当前图片是否到了可视区范围内。
3. 如果到了就设置图片的 src 属性。
4. 绑定 window 的 `scroll` 事件，对其进行事件监听。



#### 案例

假设页面结构:

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Lazyload</title>
    <style>
      img {
        display: block;
        margin-bottom: 50px;
        height: 200px;
        width: 400px;
      }
    </style>
  </head>
  <body>
    <img src="./img/default.png" data-src="./img/1.jpg" />
    <img src="./img/default.png" data-src="./img/2.jpg" />
    <img src="./img/default.png" data-src="./img/3.jpg" />
    <img src="./img/default.png" data-src="./img/4.jpg" />
    <img src="./img/default.png" data-src="./img/5.jpg" />
    <img src="./img/default.png" data-src="./img/6.jpg" />
    <img src="./img/default.png" data-src="./img/7.jpg" />
    <img src="./img/default.png" data-src="./img/8.jpg" />
    <img src="./img/default.png" data-src="./img/9.jpg" />
    <img src="./img/default.png" data-src="./img/10.jpg" />
  </body>
</html>
```

先获取所有图片的 dom，通过 `document.body.clientHeight` 获取可视区高度，再使用 `element.getBoundingClientRect()` API 直接得到元素相对浏览的 top 值， 遍历每个图片判断当前图片是否到了可视区范围内。代码如下：

```javascript
function lazyLoad() {
  // 获取可视高度
  let viewHeight = document.body.clientHeight
  // 获取图片
  let imgs = document.querySelectorAll('img[data-src]')
  
  imgs.forEach((item, index) => {
    if (item.dataset.src === '') return
    
    // 用于获得页面中某个元素的左/上/右/下分别相对浏览器视窗的位置
    let rect = item.getBoundingClientRect()
    if (rect.bottom) >= 0 && rect.top < viewHeight) {
      item.src = item.dataset.src
      item.removeAttribute('data-src')
    }
  })
}
```

最后给 window 绑定 `onscroll` 事件

```javascript
window.addEventListener('scroll', lazyLoad)
```



#### 存在的问题

因为 `scroll` 事件会在很短的时间内触发很多次，严重影响页面性能，为了提高网页性能，我们需要一个节流函数来控制函数的多次触发，在一段时间内（如 200ms）只执行一次回调。

```javascript
function throttle(fn, delay) {
  let timeId
  let prevTime
  return function(...args) {
    let context = this
    let currentTime = +Date.now()
    
    if (!prevTime) prevTime = currentTime
    if (TimeId) clearTimeout(timeId)
    
    if (currentTime - prevTime > delay) {
      fn.apply(context, args)
      prevTime = currentTime
      clearTimeout(timeId)
    }
    
    timeId = setTimeout(function() {
      fn.apply(context, args)
      timeId = null
      prevTime = +Date.now()
    }, delay)
  }
}
```

然后修改一下 `srcoll` 事件

```
window.addEventListener('scroll', throttle(lazyload, 200))
```



##### IntersectionObserver

通过上面例子的实现，我们要实现懒加载都需要去监听 `scroll` 事件，尽管我们可以通过函数节流的方式来阻止高频率的执行函数，但是我们还是需要去计算 `scrollTop`，`offsetHeight` 等属性，有没有简单的不需要计算这些属性的方式呢，答案就是 `IntersectionObserver`。

`IntersectionObserver` 是一个新的 API，可以自动"观察"元素是否可见，Chrome 51+ 已经支持。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。我们来看一下它的用法：

```javascript
let io = new IntersectionObserver(callback, option)

//开始观察
io.observe(document.getElementById('example'))

//停止观察
io.unobserve(element)

//关闭观察期
io.disconnect()
```

`IntersectionObserver` 是浏览器原生提供的构造函数，接受两个参数：callback 是可见性变化时的回调函数，option 是配置对象（该参数可选）。

目标元素的可见性变化时，就会调用观察器的回调函数 callback。callback 一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。

```javascript
let io = new IntersectionObserver((entries) => {
  console.log(entries)
})
```

- time：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
- target：被观察的目标元素，是一个 DOM 节点对象
- isIntersecting: 目标是否可见
- rootBounds：根元素的矩形区域的信息，`getBoundingClientRect()`方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回 null
- boundingClientRect：目标元素的矩形区域的信息
- intersectionRect：目标元素与视口（或根元素）的交叉区域的信息
- intersectionRatio：目标元素的可见比例，即 `intersectionRect` 占 `boundingClientRect` 的比例，完全可见时为 1，完全不可见时小于等于 0



<u>实现图片懒加载</u>

```javascript
const imgs = document.querySelectorAll('img[data-src]')
const config = {
  rootMargin: '0px',
  threshold: 0
}

let observer = new IntersectionObserver((entries, self) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      let img = entry.target
      let src = img.dataset.src
      if (src) {
        img.src = src
        img.removeAttribute('data-src')
      }
      
      //解除观察
      self.unobserve(entry.target)
    }
  })
}, config)


```






