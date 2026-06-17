## markup

翻译不顺畅的地方 使用中文(英文)形式. 标签为: 翻译.  就是搜索翻译两个字可以浏览器这些地方





## 介绍

> [How browsers work (taligarsiel.com)](http://taligarsiel.com/Projects/howbrowserswork1.htm)
>
> [How browsers work (web.dev)](https://web.dev/howbrowserswork/)

网页浏览器可能是使用最广泛的软件.在这篇文章中我将解析它们如何在屏幕后工作.我们将会理解, 当我们在地址栏输入'google.com'直到你看到在浏览器屏幕上的谷歌页面,发生了什么.



### 我们将要谈论的浏览器

目前主要使用的浏览器有5种: Internet Explorer, Firefox, Firefox, Safari, Chrome 和 Opera.

我将给出来自开源浏览器的案例-Firefox,Chrome 和 Safari, 以上部分开源.

根据[W3C browser statistics](http://www.w3schools.com/browsers/browsers_stats.asp), 目前(2009, 10月), Firefox,Safari和Chrome的使用份额接近60%.

所以今天开源浏览器是浏览器商业的很大一部分.



### 浏览器主要功能

浏览器的主要功能是呈现你选择的网页资源, 通过从服务器请求它和在浏览器窗口展示它.资源格式通常是HTML,但也可以是PDF,图片或其他. 资源位置通过用户使用一个统一资源标识符URI(Uniform resource Identifier).更多信息在文章中的网络章节.

浏览器解释和展示HTML文件的方式是被HTML和CSS规范指定.这些规范被W3C(World Wide Web Consortium 万维网联盟)组织维护, 也是网页的标准组织.

目前HTML版本是4(http://www.w3.org/TR/html401/). 版本5在进行中. 当前CSS版本是2(http://www.w3.org/TR/CSS2/), 版本3在进行中.

若干年来,浏览器只遵循部分标准且开发了各自的扩展.这对网页开发造成了严重的兼容问题.今天大多数浏览器或多或少都符合这个规范.

浏览器用户界面彼此有很多共同点.常见的共同的用户界面元素是:

* 插入URI的地址栏
* 前进和后退按钮
* 收藏选项
* 刷新和停止当前文档加载的刷新和停止按钮
* 让你到主页的主页按钮

奇怪的是, 浏览器的用户界面未在任何正当规范中指定, 它只是多年经验和通过浏览器各自模仿形成的良好实践.HTML5规范没有定义一个浏览器必须有的UI元素,但是列举了一些常用的元素. 这些元素中是地址栏,状态栏和工具栏.当然有浏览器特定浏览器的不同的功能,例如Firefox下载管理.



### 浏览器高层结构(high  level structure)

浏览器主要组成部分是:([1.1](http://taligarsiel.com/Projects/howbrowserswork1.htm#1))

1. 用户界面 - 包括地址栏, 后退/前进按钮, 收藏夹单元等. 除了你看到的请求页面主窗口外的浏览器展示的每个部分.
2. 浏览器引擎 - 查询和操作渲染引擎的接口(界面?)
3. 渲染引擎 -  负责显示请求的内容.例如,如果请求内容是HTML,渲染引擎负责解析HTML和CSS,并且在屏幕上展示解析的内容.
4. 网络 - 用于网络调用,例如HTTP请求. 它具有独立于平台的接口和每个平台底部实现. 
5. UI后端 - 用于描绘基本的工具例如组合框和窗口. 它暴露了一个非平台指定的通用接口. 在底部它采用操作系统用户接口的方法.
6. JavaScript接口. 用于解析和执行JavaScript代码.
7. 数据存储. 这是一个持久层. 浏览器需要在硬盘上保存所有类型的数据,例如,cookies. 新的HTML规范(HTML5)定义了`网页数据库(web database)',一个浏览器中的完整数据库(尽管轻量).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 



![浏览器主要组成部分 (taligarsiel.com)](http://taligarsiel.com/Projects/layers.png)



需要注意是的,Chrome与大多数浏览器不同, 有多个渲染引擎实例-每个tab页一个. 每个tab页是一个单独的进程(process).





### 组件之间的联系

Firefox和Chrome开发了一个特殊的联络基础设施.会在特定章节讨论.







## 2.渲染引擎

渲染引擎的作用是渲染,就是在浏览器屏幕上展示请求的内容.

渲染引擎默认能展示HTML和XML文档和图片,也能通过一个插件程序(一个浏览器扩展)展现其他类型.一个例子是使用PDF查看查看来展示PDF.我们将在特定的章节讨论插件和扩展.在这个章节,我们将聚焦主要使用案例-展示用CSS格式化的HTML和图片.



### 2.1渲染引擎

我们的参考浏览器 - Firefox,Chrome和Safari是建立在两个渲染引擎基础上的. Firefox使用**Gecko** - 一个"自制(home made)"Mozilla 渲染引擎. Safari和Chrome都使用**Webkit**.

Webkit是一个开源渲染引擎,开始作为Linux平台引擎而后被Apple更改用于支持Mac和Windows. 查看[http://webkit.org/ ](http://webkit.org/ )更多信息.



### 2.2主要流程(the main flow)

渲染引擎开始于从网络层获取请求文档的内容. <span style="color:red">这通常以8k 块完成. ??</span>

在这之后是渲染引擎的基本流程:

![flow.png (600×66) (taligarsiel.com)](http://taligarsiel.com/Projects/flow.png)



```mermaid
graph LR
A[解析HTML来构建DOM树] --> B[渲染树结构] 
B --> C[渲染树的样式]
C --> D[绘制渲染树]
```

渲染引擎将开始解析HTML文档,并将HTML标签转换为名为'内容树(content tree)'的树中的DOM节点. 它将解析外部 CSS 文档和样式元素中的style数据. 在HTML中的样式信息和可视化结构 将会被用于创建其他树- [渲染树](http://taligarsiel.com/Projects/howbrowserswork1.htm#Render_tree_construction).

渲染树包含带有像颜色和尺寸的视觉属性的矩形.矩形按正确的顺序展示在屏幕上.

渲染树构建之后, 它会经历一个"布局"过程.这意味着给每个节点应该出现在屏幕上的精确坐标. 

下一个阶段是绘制 - 遍历渲染树并且每个节点会使用UI后端布局来绘制.

重要的是要了解这是一个逐渐的过程. 为了更好的用户体验, 渲染引擎将会尽快在屏幕上展示内容. 它不会等到所有HTML都被解析后才开始构建和布局渲染树. 部分内容将会被解析和展示,然而该过程将继续(处理)来自网络的其余内容.



### 2.3主要流程案例

Figure3: **Webkit main flow**

![webkitflow.png (624×289) (taligarsiel.com)](http://taligarsiel.com/Projects/webkitflow.png)



Figure4: **Mozilla's Gecko rendering engine main flow**

![image008.jpg (624×290) (taligarsiel.com)](http://taligarsiel.com/Projects/image008.jpg)



从图3到图4,你能看到尽管Webkit和Gecko稍稍使用不同的术语,但流程基本是相同的.

Gecko称视觉格式化的元素树为,<span style="color: blue">框架树(Frame tree)</span>. 每一个元素是一个框架. Webkit使用术语"<span style="color: blue">渲染树</span>", 它有"渲染对象"组成. 

Webkit使用术语"<span style="color: blue">布局(layout)</span>"来放置元素, 而Gecko称之为"<span style="color: blue">回流(Reflow)</span>".  

"附件(Attachment)"是Webkit用来连接DOM节点和视觉信息来创建渲染树的术语. 一个微小的非语义差异是Gecko在HTML和DOM树之间有一个额外的层.它被称作"内容槽(content sink)"并且是制作DOM元素的工厂. 

我们将会讨论流程的每一个部分:





### 2.4.解析和DOM树构造

#### 2.4.1 解析-整体

因为解析在渲染引擎内是一个非常重要的进程,我们将更深入的研究它.从解析的一点介绍开始吧.

解析文档意味着将它翻译成有意义的结构,一些代码能理解和使用的东西.解析的结果通常是代表文档结构的节点树.它被称作一个解析树或语法树.

例子 - 解析表达式"2 + 3 - 1"可以返回这个树:

**Figure 5: mathematical expression tree node**

![image009.png (400×155) (taligarsiel.com)](http://taligarsiel.com/Projects/image009.png)



##### 语法(Grammars)

解析是基于文档遵循的语法规则-写入的语言或格式. 你能解析的每个格式必须有由词汇和语法规则组成的确定语法.它被称作"<span style="color:blue">上下文无关语法(context free grammar)</span>". 人类语言不是这样的语言, 所以不能使用传统解析技术来解析.



##### 解析器 - 词法分析器组合(Parser - Lexer combination)

解析能被分成两个子进程: 词法分析 和 语法分析.

**词法分析(Lexical analysis)**是将输入分解为标记(tokens)的过程. <span style="color:blue">标记(Tokens)</span>是语言词汇 - 有效构建块的集合. 在人类语言中它将由所有出现在对应语言词典中的词汇构成.

**语法分析(Syntax analysis)**是语言语法规则的应用.

解析器通常在两个组件之间分配工作 - 词法分析器(lexer,有时称作分词器 tokenizer)负责将输入分解成合法标记(令牌), 解析器负责构建解析树, 通过按照语言语法规则来分析分档结构. 词法分析器知道如何去除无关字符,例如空白符和换行.

Figure 6: from source document to parse trees

![image011.png (101×300) (taligarsiel.com)](http://taligarsiel.com/Projects/image011.png)



解析过程是迭代的. 解析器通常会要求词法分析器提供一个新的标记(令牌)并尝试将该令牌与语法规则之一进行匹配. 如果规则被匹配,与标记(令牌)相关的节点将会被添加到解析树,然后解析器将会请求另一个标记(令牌).

如果没有规则匹配,解析器将内部存储标记(令牌), 并继续请求令牌直到匹配所有内部存储的标记(令牌)规则被找到. 如果没找到规则, 那么解析器将抛出一个异常. 这意味文档不合法且包含语法错误.



##### 翻译(Translation)

很多时候解析树不是最终的产品.解析常用语翻译 - 转换输入文档为其他格式. 一个例子是编译(compilation). 将源代码编译为机器码的编译器首先将它解析为解析树然后将树翻译为机器代码文档.

Figure 7: compilation flow

![image013.png (104×400) (taligarsiel.com)](http://taligarsiel.com/Projects/image013.png)

##### 解析案例(Parsing example)

图5中,我们通过数学表达式建立了一个解析树.让我们尝试定义一个简单的数学语言并查看解析过程.

词汇(Vocabulary): 我们的语言能包含整数, 加号和减号.

语法(Syntax):

1. 语言语法构建块是表达式,术语和操作符.
2. 语言包含任意数量表达式
3. 一个表达式被定义一个"术语",其次是"操作符",其次是其他术语.
4. 操作符是加号标记(令牌)或减号标记(令牌)
5. 术语是整数标记(令牌)或一个表达式

让我们分析输入"2+3-1".

第一个匹配规则的子字符串是'2', 根据规则#5,这是一个术语. 第二个匹配的是"2+3",匹配第二项规则 - 一个术语之后跟操作符,然后跟另一个术语. 下一个匹配将只会在输入结束后被击中.  "2 + 3 - 1" 是一个表达式因为我们已经知道 "?2+3?"是一个术语所以我们有一个术语后跟操作符,后跟其他术语. "2 + +"将不会匹配任何规则所以是一个不合法的输入.



##### 词汇和语法的正式定义(Formal definitions for vocabulary and syntax)

词汇(Vocabulary)经常通过[正则表达式](https://www.regular-expressions.info/)来展示.

例如,我们的语言将被如下定义:

```js
INTEGER: 0|[1-9][0-9]*
PLUS: +
MINUS: -
```

就像你看到的,整数通过正则表达式定义.

语法通常以称作[BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form)的格式来定义. 我们的语言将被定义如下:

```js
expression := term operation term
operation := PLUS | MINUS
term := INTEGER | expression
```



我们讲过,一种语言能被常规解析器解析,如果它的语法是上下文无关语法. 上下文无关语法直观定义是能被BNF完整表达的语法. 正式定义查看  http://en.wikipedia.org/wiki/Context-free_grammar



##### 解析器类型(Types of parsers)

有两种基本类型解析器 - 从上到下解析器(top down parsers)和从下到上解析器(bottom up parsers). 直观解释是自顶向下解释器查看语法的高级结构并且尝试匹配其中之一. 自顶向上解析器开始于输入并渐渐转换为语法规则, 从低级规则开始,直到高级规则被满足.

让我们看看两类解析器将如何解析案例:

自上而下解析器将从高级规则开始 - 它将识别"2+3"并作为表达式. 届时将识别"2+3-1"作为表达式(识别表达式的进程会进化为匹配其他规则, 但是起点是最高级的规则).

自下而上解析器将扫描输入输入直到规则匹配,届时将用规则替换匹配的输入.一直持续到输入的结束. 部分匹配的表达式在解析栈上被放置到解析器堆上(parser stack).

| Stack                | Input |
| -------------------- | ----- |
|                      | 2+3-1 |
| term                 | +3-1  |
| term expression      | 3-1   |
| expression           | -1    |
| expression operation | 1     |
| expression           |       |

自下而上解析器的类型被称作移位归纳解析器(shift reduce parser), 因为输入被向右移位(想象一个指针首先指向输入开始并向右移动)并逐渐被归纳为语法规则.



###### 自动生成解析器

有工具可以为你生成解析器.它们是被称作解析器生成器.你用你的语言的语法 - 词汇和语法规则来喂食它们,它们会生成一个有效的解析器. 创建一个解析器需要对解析的深刻理解,手动创建一个优化过的解析器是困难的,所以解析器生成器能很有用.

Webkit用两个致命的解析器生成器 - Flex用于创建词法分析器,Bison创建解析器(你可能会遇到他们的名字是 Lex 和 Yacc). Flex输入是一个包含正则表达式定义的标记(令牌)文档, Bison 的输入是 BNF 格式的语言语法规则。 



#### 2.4.2 HTML 解析器

HTML解析器的工作是解析HTML标签为解析树.



##### HTML语法定义

HTML词法(vocabulary)和语法(syntax)被w3c组织创建的规范来定义的. 当前的版本是HTML4,HTML5工作正在进行中.



##### 不是上下文无关语法

正如我们在解析介绍中看到的, 语法可以被例如BNF格式来定是定义.

不幸的是,所有传统的解析器都不适应HTML(我不是为了好玩才提出它们 - 它们将用在解析CSS和JavaScript). HTML不能简单的被解析器需要的上下文无关语法所定义.

有一个正式的格式来定义HTML - DTD(文档类型定义 Document Type Definition) - 但是它不是一个上下文无关语法.

在第一个网站上HTML会显示的奇怪 - HTML是更接近XML. 有很多可用的XML解析器. HTML有一个XML变体 - XHTML - 所以有什么大的区别吗?

区别就是HTML方式更宽容, 它允许你忽略隐式添加的标签, 有时候忽略标签的开始或结束等.大体上它是一个"软"语法,与XML苛刻僵硬的语法相反.

显然, 这个微小的差异让世界变得不同. 一方面这是HTML流行的主要原因 - 它容许你的错误和让页面作者的生活更轻松. 在另一方面, 写一个格式语法是很困难的. 所以总结一下 - HTML不容易解析, 不能被传统解析器解析,因为它语法不是上下文无关语法, 也不能被XML解析器解析.



##### HTML DTD

HTML定义采用DTD格式. 这个格式用来定义[SGML](https://en.wikipedia.org/wiki/Standard_Generalized_Markup_Language)家族的语言. 这个格式包括所有允许的元素, 元素的属性和层次结构的定义, HTML DTD没有形成上下文无关语法.

DTD有一些变体. 严格模式仅符合规范,但其他模式包含过去浏览器用过标签的支持.目的是向后兼容旧内容。当前严格的 DTD 在这里：http://www.w3.org/TR/html4/strict.dtd



##### DOM

输出树- 解析树是DOM元素和属性节点的树. DOM是Document Object Model的缩写.它是 HTML 文档的对象表示，也是 HTML 元素与 JavaScript 等外部世界的接口。(It is the object presentation of the HTML document and the interface of HTML elements to the outside world like JavaScript.)

树根是"[Document](https://www.w3.org/TR/1998/REC-DOM-Level-1-19981001/level-one-core.html#i-Document)"对象.

DOM与标记几乎是一对一关系. 例如, 如下标记:

```html
<html>
	<body>
		<p>
			Hello World
		</p>
		<div> <img src="example.png"/></div>
	</body>
</html>
```

将会被翻译成下面的DOM树:

Figure 8: DOM tree of the example markup

![image015.png (400×219) (taligarsiel.com)](http://taligarsiel.com/Projects/image015.png)



像HTML, DOM是被w3c组织规定的. 查看http://www.w3.org/DOM/DOMTR.  它是操作文档的原生规范. 一个特定的模块描述HTML特定元素. HTML定义能在这里找到: http://www.w3.org/TR/2003/REC-DOM-Level-2-HTML-20030109/idl-definitions.html.

翻译:

当我说这个树包含DOM节点, 我的意思是树是由实现 DOM 接口之一的元素构成的(I mean the tree is constructed of elements that implement one of the DOM interfaces). 浏览器使用具体的实现，这些实现具有浏览器内部使用的其他属性。(Browsers use concrete implementations that have other attributes used by the browser internally.)



##### 解析算法

就像我们在之前部分看到的,HTML不能用通常的自上而下或自下而上解析器来解析

原因是:

1. 语言的宽容性质
2. 浏览器有传统容错来支持众所周知的不合法HTML实例这一事实.
3. 解析过程是重入式(reentrant)的. 通常在解析时资源不能改变,但在HTML中,脚本标签包含"document.write"来添加额外的标记(令牌), 所以解析过程实际上更改了输入.

无法使用常规解析技术,浏览器创建自定义解析器来解析HTML.

翻译:

解析算法在 HTML5 规范中有详细描述(The parsing algorithm is described in details by the HTML5 spepcification). 算法由两阶段构成 - 标记化和树构建.

标记化是词法分析,解析输入为标记.HTML标记是开始标签,结束标签,属性名和属性值.

标记器识别标记,将其提供给树构造器并使用下一个字符来识别下一个标记以此类推知道结束.

Figure 6: HTML parsing flow (taken from HTML5 spec)

![image017.png (308×400) (taligarsiel.com)](http://taligarsiel.com/Projects/image017.png)



##### 标记化算法(tokenization algorithm)

算法输出HTML标记(令牌). 算法表达为状态机.每个状态消耗输入流一个或多个字符并根据这些字符更新下一个状态. 结果会被当前标签状态和树结构状态所影响. 这意味着同一个消耗的字符串对于正确的下一个状态会产生不同的结果,这取决于当前状态. 算法太复杂无法完全实现,所以让我们看一个简单例子来帮我们理解其规则.

基本案例 - 标签化下面的HTML:

```html
<html>
	<body>
		Hello world
	</body>
</html>
```

初始状态是"**Data state**". 当遇到"<"字符, 状态变成"**Tag open state**". 消耗"a-z"字符会导致"State tag token"创建, 状态变成"**Tag name state**". 我们一直处于这个状态直到">"字符被消耗. 每个字符都被附加到新的标记名后面. 在我们例子中创建的标记是'html'标签.

当到达">"标签时, 当前标签会被触发且状态变回"**Data state**". "\<body>"标签将会被以同样的步骤对待. 到目前为止"html"和"body"标签被触发. 我们现在反悔"Data state". 消费"Hello world"的"H"字符将引起创建和触发字符标记化, 一直持续到"\<body>"的"<". 我们将触发"Hello world"的每个字符标记.

我们现在回到"**Tag open state**". 消费下一个输入"/"将引发"end tag token"的创建并移至"**Tag name state**". 我们又处于这个状态直到访问到">". 然后新的标签标记被触发我们回到"**Data state**". "\<html>"输入像前面例子被触发.

Figure 9: Tokenizing the example input

![image019.png (627×387) (taligarsiel.com)](http://taligarsiel.com/Projects/image019.png)

##### 树构造算法

翻译:

解析器被创建时,文档对象会被创建. 在树构造阶段在DOM根部的文档将被更改且元素将会添加到它身上. 每个被标记器(tokenizer)分发的节点会被树构造器处理. 对于每个标记, 规范定义了哪个DOM元素与之相关且将会为这个标记创建. 除了添加元素到DOM树之外,它也添加到开放元素的堆栈中.(Except of adding the element to the DOM tree it is also added to a stack of open stack).  堆栈用来修复嵌套的错误和未关闭的标签. 算法也用来作为状态机的描述. 这个状态被称作"insertion modes"(插入模式)

让我们看看输入例子的树构建过程:

```html
<html>
	<body>
		Hello world
	</body>
</html>
```

树构建阶段的输入是来自标记化阶段的一系列标记, 第一个模式是"初始模式".接收html标记将引起移动至"**before html**"模式且在该模式下重新处理该标记. 这将引起HTMLHTMLElement元素的创建且它将被附加到根文档对象的后面.

状态将被更改为"**before head**". 我们接收"body"标记. 一个HTMLHeadElement将被隐式创建虽然我们没有"head"标记且它将被添加到树.

我们现在移至"**in head**"模式之后到"**after head**". body标记是重新处理, HTMLBodyElement被创建和插入,模式被转移到"**in body**".

"Hello world"字符串的字符标记现在被接收. 第一个将导致创建插入"Text"节点,其他字符将附加到该节点.

body末尾标记的接收将导致转移到"**after body**"模式. 我们现在将现在接收html结束标签,它将我们移动到"**after after body**"模式.

接收文件标记的末尾将结束解析.

Figure 10: tree construction of example html

![image022.gif (532×769) (taligarsiel.com)](http://taligarsiel.com/Projects/image022.gif)

##### 解析完成后的动作

在这个阶段浏览器将标记文档标记为交互式和开始以"deferred"解析脚本- 在文档解析之后执行. 文档状态之后将被设为"complete"并将触发"load"事件.

你可以查看HTML5规范中标记化和树构造的完整算法 - http://www.w3.org/TR/html5/syntax.html#html-parser



##### 浏览器容错(Browser error tolerance)

你永远不会得到一个"Invalid Syntax"错误在HTML页面上. 浏览器修复不合法内容并继续.

拿这个HTML作为案例:

```html
<html>
  <mytag>
  </mytag>
  <div>
  <p>
  </div>
  	Really lousy HTML
  </p>
</html>
```



我一定违反了大约一百万条规则("mytag"不是标准标签, "p"和"div"元素及更多的错误嵌套),但是浏览器仍然正确展示它且没有控诉. 所以很多解析器代码修正HTML作者的错误.

错误处理在浏览器中非常一致,但是足够惊奇的是它不是HTML当前规范的一部分. 像书签和后退/前进按钮一样,它只是多年来在浏览器中发展起来的东西. 有很多已知的无效HTML结构在很多网站中重复,浏览器尝试与其他浏览器一致的方式修复它们.

HTML5规范定义了部分需求. Webkit在HTML解析器类开头的注释中很好的总结了这一点.

```md
解析器解析标记的输入为文档, 建立文档树. 如果文档符合规范, 直接解析.
不幸的是, 我们必须处理很多不规范的HTML文档, 所以解析器必须容错.

我们必须处理至少以下错误:
1.被添加的元素被明确禁止在某个外部标签内
翻译:
在这种情况下,我们应该关闭所有所有标签, 直到禁止该元素的标签, 然后再添加它.(In this case we should close all tags up to the one, which forbids the element, and add it afterwards.)


2.我们不被允许直接增加元素
这可能是写文件的人忘记了中间的一些标签(或在中间的标签是可选的)
可能是下面标签的这种情况: HTML HEAD BODY TBODY TR TD LI(我忘记任何一个了吗?)

3.我们想在行内元素中添加一个块元素. 关闭所有的行内元素直到接下来更高的块元素.

4.如果这没有帮助,关闭所有元素直到我们被允许添加元素或忽略标签.
```



让我们看看Webkit容错案例:

`</br> instead of<br>`

一些网站用`</br>`代替`<br>`. 为了兼容IE且Firefox Webkit像对待`<br>`一样.

代码

```js
if (t->isCloseTag(brTag) && m_document->inCompatMode()) {
     reportError(MalformedBRError);
     t->beginTag = true;
}
```

笔记 - 错误处理是内部的,它不会展示给用户.



`杂乱的表格`

杂乱的表格(游离表)是在另一个表格内容内的表格, 但不在表格单元内.

像这个例子:

```html
<table>
	<table>
		<tr><td>inner table</td></tr>
         </table>
	<tr><td>outer table</td></tr>
</table>
Webkit will change the hierarchy to two sibling tables:
<table>
	<tr><td>outer table</td></tr>
</table>
<table>
	<tr><td>inner table</td></tr>
 </table>
```

代码:

```js
if (m_inStrayTableContent && localName == tableTag)
        popBlock(tableTag);
```

Webkit为当前元素内容用了一个堆栈(stack) - 它将外部表格栈中的内部表格. 这些表现在将是同级的表.



`元素的表单嵌套(Nested form element)`

这个实例中,用户在另一个表单内部放置了一个表单, 第二个表单会被忽略.

代码:

```js
if (!m_currentFormElement) {
        m_currentFormElement = new HTMLFormElement(formTag,    m_document);
}
```



`太深的标签结构`

它的注释是这么说的:

```md
www.liceo.edu.mx 是一个达到嵌套大约1500个标签等级的网站的案例, 全部来自一堆<b>s.
翻译:
我们最多只允许20个相同类型的嵌套标签，然后就把它们全部忽略掉。(We will only allow at most 20 nested tags of the same type before just ignoring them all together.)  ???
```

```js
{

unsigned i = 0;
for (HTMLStackElem* curr = m_blockStack;
         i < cMaxRedundantTagDepth && curr && curr->tagName == tagName;
     curr = curr->next, i++) { }
return i != cMaxRedundantTagDepth;
}
```



`错放的HTML或body结束标签`

再一次, 它自己的注释

```md
支持实际的破损HTML
我们永不关闭body标签, 因为一些愚蠢的web页面在实际文档末尾之前关闭了它.
让我们信赖(依靠)end()调用来关闭.
```

```js
if (t->tagName == htmlTag || t->tagName == bodyTag )
        return;
```

所以web作者注意 - 除非你想在Webkit容错代码作为一个案例 - 写良好格式的HTML



#### 2.4.3 CSS 解析(CSS parsing)

记得在介绍中的解析概念吗? 不像HTML, CSS是上下文无关语法并且能用介绍中描述的解析器格式来解析.

事实上, CSS规范定义CSS词法和语法规范(http://www.w3.org/TR/CSS2/grammar.html)

让我们看一些例子.

词汇语法(词汇)被每个标记(令牌)的正则表达式定义.

```yaml
comment		\/\*[^*]*\*+([^/*][^*]*\*+)*\/
num		[0-9]+|[0-9]*"."[0-9]+
nonascii	[\200-\377]
nmstart		[_a-z]|{nonascii}|{escape}
nmchar		[_a-z0-9-]|{nonascii}|{escape}
name		{nmchar}+
ident		{nmstart}{nmchar}*
```

"ident"是'identifier'的缩写 , 像类名. "name"是元素id(被'#'所引用的)

在BNF中的语法描述:

```yaml
ruleset
  : selector [ ',' S* selector ]*
    '{' S* declaration [ ';' S* declaration ]* '}' S*
  ;
selector
  : simple_selector [ combinator selector | S+ [ combinator selector ] ]
  ;
simple_selector
  : element_name [ HASH | class | attrib | pseudo ]*
  | [ HASH | class | attrib | pseudo ]+
  ;
class
  : '.' IDENT
  ;
element_name
  : IDENT | '*'
  ;
attrib
  : '[' S* IDENT S* [ [ '=' | INCLUDES | DASHMATCH ] S*
    [ IDENT | STRING ] S* ] ']'
  ;
pseudo
  : ':' [ IDENT | FUNCTION S* [IDENT S*] ')' ]
  ;
```



解释: 

规则集的结构

```md
div.error , a.error {
	color:red;
	font-weight:bold;
}
```

div.error和 a.error是选择器. 花括号内部包含应用在规则集上的规则. 此结构在定义中被正式定义:

```js
ruleset
  : selector [ ',' S* selector ]*
    '{' S* declaration [ ';' S* declaration ]* '}' S*
  ;
```

这意味着规则集是一个选择器或被逗号和空格(空格采用S标准)分隔的可选数量的选择器. 规则集包含大括号和其内部的生命或可选的如果用分号分隔的声明. "声明"和"选择器"将在下面的BNF定义中被定义:



##### Webkit CSS 解析器

Webkit使用[Flex and Bison](http://taligarsiel.com/Projects/howbrowserswork1.htm#parser_generators)解析生成器来自动从CSS语法文件中创建解析器. 正如你从解析器介绍中回忆的那样, Bison创建了自下而上移位减少解析器. FireFox使用自上而下手动写入解析器. 在两个案例中, 每个CSS文件将被解析为 样式表对象(StyleSheet object), 每个对象包含CSS规则. CSS规则对象包含选择器和声明对象和其他对应于CSS语法的对象.

Figure 7: parsing CSS

![image023.png (500×393) (taligarsiel.com)](http://taligarsiel.com/Projects/image023.png)









#### 2.4.4 解析脚本(Parsing scripts)

This will be dealt with in the chapter about JavaScript





#### 2.4.5 脚本和样式表运行顺序(The order of processing scripts and style sheets)

##### 脚本(Scripts)

网页模式是同步的(synchronous). 作者期望脚本被解析且立即执行,当解析器到达一个`<script>`标签时. <span style="color:blue">文档解析会会暂停直至脚本执行完.</span> 如果脚本是外部的则其资源必须被首先从网络上获取 - 这也是同步完成的, 解析停止直到资源被获取. 这是很多年来的模式并且在HTML4和5规范中也规定了. 作者可以用'defer'来标记这个脚本,因此它将不会停止文档解析并在解析后执行. HTML5添加了选项来标记脚本以异步方式,所以它将以不同的线程来解析和执行.



##### 推测的解析(Speculative parsing)

Webkit和Firefox都做了优化. 当执行脚本时, 另一个线程解析剩余文档并找出其他需要从网络加载的资源并加载它们. 通过这种方式,可以在并行连接上加载资源且整体的速度更好. 注意: 推测性解析器不更改DOM树并把它留给主解析器, 它只解析外部资源例如外部脚本, 样式表和图片的引用.

##### 样式表(Style sheet)

另一方面,样式表具有不同的模式. 概念上看既然样式表不改变DOM树, 没有原因等待和停止文档的解析. 然而有一个问题, 在文档解析阶段脚本要求样式信息. 如果样式尚未加载和解析, 脚本将会得到错误答案且明显会引起很多问题. 看起来是一个边缘案例但是非常普遍. Firefox当在有一个样式表让在加载和解析时,会阻塞所有脚本. Webkit只有当尝试访问确定样式可能被未加载样式表影响的属性时候才阻塞脚本.



### 2.5 渲染树构造(Render tree construction)

当DOM树被构建时, 浏览器构造了另一个树,渲染树. 此树是按显示顺序排列的可视化元素. 它是文档的可视化展示. 此树的目的是以它们自己正确的顺序能够来绘制内容.

Firefox在渲染树"frames"中调用元素. Webkit使用术语 "渲染器(renderer)" 或 "渲染对象(render  object)".

渲染器知道如何布局和绘制自身及后代.

Webkits 渲染器对象类, 渲染器基类有如下定义:

```js
class RenderObject{
	virtual void layout();
	virtual void paint(PaintInfo);
	virtual void rect repaintRect();
	Node* node;  //the DOM node
	RenderStyle* style;  // the computed style
	RenderLayer* containgLayer; //the containing z-index layer
}
```

每个渲染器对象代表一个通常与节点CSS盒子相关的矩形区域, 通过CSS2规范定义. 它包含像宽度,高度和未知的几何图形信息.

盒子类型被与节点相关的"display"样式属性所影响(see the [style computation](http://taligarsiel.com/Projects/howbrowserswork1.htm#style_computation) section). 以下是Webkit代码, 用于根据display属性决定应该为DOM节点创建哪种类型的渲染器.

```js
{
    Document* doc = node->document();
    RenderArena* arena = doc->renderArena();
    ...
    RenderObject* o = 0;

    switch (style->display()) {
        case NONE:
            break;
        case INLINE:
            o = new (arena) RenderInline(node);
            break;
        case BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case INLINE_BLOCK:
            o = new (arena) RenderBlock(node);
            break;
        case LIST_ITEM:
            o = new (arena) RenderListItem(node);
            break;
       ...
    }

    return o;
}
```



元素类型也被考虑, 例如表单控件和表格有特殊的框架.

在Webkit中,如果一个元素像创建一个特殊的渲染器,它将覆盖(override)"createRenderer"方法. 样式对象的渲染器指针包含非几何图形信息.

#### 渲染树与DOM树的关系

渲染树与DOM元素相关,但不是一对一的关系. 非可视化DOM元素(Non visual DOM elements)将不会插入渲染树中. 一个例子就是`head`元素. display属性被声明为"none"的元素也不会出现在树中(有"hidden"视觉属性的元素将出现在树中).

有一些DOM元素对应几个可视化对象.这些元素通常带有复杂的结构,其不能被单个矩形所描述.例如, "select"元素具有3个渲染器 - 一个战士面积,一个用来下拉列表盒子,一个用于按钮.当文字被打断成多行也是如此, 因为宽度不足以支持一行,新行将被加到额外的渲染器上.

另一个多个解析器案例是破碎的HTML. 根据CSS规范,内联元素必须包含要么仅块元素要么仅内联元素. 假如有混合内容, 匿名块解析器将被创建来包裹行内元素.

某些渲染对象与DOM节点有关但不是在树上的同一位置. 浮动和绝对定位元素是脱离文档流, 放置在树中不同的位置,并映射到实际的框架. 占位符框架是它们应该在的位置.

Figure 11: The render tree and the corresponding DOM tree(**[3.1](http://taligarsiel.com/Projects/howbrowserswork1.htm#3_1)**). The "Viewport" is the initial containing block. In Webkit it will be the "RenderView" object.

![image025.png (731×396) (taligarsiel.com)](http://taligarsiel.com/Projects/image025.png)

#### 构建树的流程(the flow of constructoring the tree)

在Firefox里, 演示文稿(presentation) 注册为DOM更新的监听器. 演示文稿将框架的创建委托给"FrameConstructor", 而构造函数解决了样式(see [style computation](http://taligarsiel.com/Projects/howbrowserswork1.htm#style))并创建了一个框架.

在Webkit中,解析样式和创建渲染器的过程被称作"attachment"(附加物??). 每个DOM节点有一个"attach"方法. 附加物(Attachment)是同步的, 节点插入到DOM树中调用新的节点"attach"方法.

处理HTML和body标签会导致构建渲染树根.根部渲染器对象对应于CSS规范所称的包含块 - 包含所有其他块的最上面的块. 它的尺寸(dimensions)是视口 - 浏览器窗口展示区域尺寸. Firefox称它为视口框架(ViewProtFrame), Webkit称它为渲染视口(RenderView).这是文档指向的渲染器对象. 剩余树作为DOM节点插入构建.

在这个主题上查看CSS2 - http://www.w3.org/TR/CSS21/intro.html#processing-model



#### 2.5.3 样式计算(Style Computation)

构建渲染树需要计算每个渲染树对象可视化属性. 通过计算每个元素样式属性来完成.

该样式包含各种来源样式表,内联样式元素和HTML中可视化属性(例如'bgcolor'属性).其后者会被转换为匹配的CSS样式属性.

样式表来源浏览器默认样式表, 通过页面作者提供的样式表和用户样式表(user style sheets), 这些样式表是通过浏览器用户(浏览器让你定义你喜欢的样式. 在Firefox, 例如, 通过在"Firefox Profile"文件夹中放置样式表来完成).

样式计算带来一些不同点:

1. 样式数据是非常大的结构, 拥有若干样式属性, 这能导致存储问题.

2. 找到每个元素匹配的规则,如果没有优化能引起性能问题. 为每个元素遍历整个规则列表以找到匹配是沉重的任务. 选择器具有复杂结构,能导致匹配过程开始看起来在有前途的路上,实际被证明是徒劳的并且必须尝试另一条路.

   例如, 这个组合选择器:

   ```css
   div div div div {
     ...
   }
   ```

   意味着规则应用到3个divs后台的"\<div>". 假设你想检查规则是否应用到给定的"\<div>"元素. 你选择树上的一个确定路径来检查. 你可能需要向上遍历节点树并且该规则不适用. 然后你需要尝试树中的其他路径.

3. 应用规则涉及定义规则层级的相当复杂的层叠规则.

让我们看下浏览器如何面对这些问题:

##### 分享样式数据(Sharing style data)

Webkit节点引用样式对象(渲染器样式),在某些情况下，节点可以共享这些对象。.这节点是同级节点或表亲节点: 

1. 元素一定处于相同的鼠标状态(例如, 一个不能处于 ：hover 中，而另一个则不处于)
2. 任何一个元素都不应该有ID
3. tag名字应该匹配
4. 应该匹配class属性
5. 映射属性集合一定相同
6. link状态必须匹配
7. 焦点状态必须匹配
8. 两个元素都不应受到属性选择器影响, 这里的影响是指在选择器中的任何位置都有使用属性选择器的选择器匹配. 翻译??
9. 在这些元素上不能有行内样式属性
10. 根本不能使用同级选择器. 当遇到任何同级选择器时, WebCore会简单的抛出一个全局开关, 并在它们出现时禁用整个文档的样式共享.(WebCore simply throws a global switch when any sibling selector is encountered and disables style sharing for the entire document when they are present.) 这包括`+`选择器和像":first-child"和":last-child"选择器.



##### Firefox 规则树(Firefox rule tree)

Firefox有两种额外的树对应更早的样式计算 - 规则树(rule tree)和样式上下文树(style context tree). Webkit也有样式对象但是他们不像样式上下文树一样存储在树中, 只有DOM节点指向其相关的样式.

Figure 13: Firefox style context tree([2.2](http://taligarsiel.com/Projects/howbrowserswork1.htm#2_2))

![image035.png (640×407) (taligarsiel.com)](http://taligarsiel.com/Projects/image035.png)

样式上下文包含结束值.通过以正确顺序应用所有匹配规则计算和执行将它们从逻辑值转换为精确值的操作计算出来的. 例如, 如果逻辑值是屏幕的百分比,他讲被计算并转换为绝对单位(absolute units). 规则树的主意真是聪明. 它实现了在节点直接分享这些值又避免了重复计算. 这节省了空间.

所有匹配的规则存储在树中. 在路径中的底部节点有更高的优先级.树包含所有被发现的规则匹配的路径. 存储规则是懒存储. 树在每个节点的开始不会计算, 在一个节点样式需要计算的任何时候,计算路径会被加入到树. 

想法是把树的路径看做是词库中的词. 比方说,我们已经计算出规则树:

![tree.png (400×261) (taligarsiel.com)](http://taligarsiel.com/Projects/tree.png)

假设我们需要为另一个上下文树中的元素匹配规则,并找出匹配规则(在正确的顺序)是B - E - I. 我们已经有树中的路径因为我们计算路径 A - B - E - I - L. 我们现在酱油更少的工作要做.

让我们看下树是如何作为工作来保存.



**划分为结构(Division into structs)**

样式上下文被划分为多个结构. 这些结构包含为某个类别例如border或color的样式信息. 结构中的所有属性继承或非继承. 继承属性是除非由元素定义,否则会从其父级继承的属性. 非继承属性(称作'reset'属性)如果没有定义使用默认值.

该树通过在书中缓存整个结构(包含计算的端值)来帮助我们. 方案是如果底部节点没有为结构提供定义, 则使用上层节点中的缓存结构.

**使用规则树来计算样式上下文**

当为某个元素计算样式上下文, 我们首先计算规则树中的路径或使用已经存在的一个路径. 我们届时开始在路径中应用规则来填充结构在我们新的样式上下文中. 我们从底部节点路径开始 - 有最高优先级(通常是最具体的选择器)并向上遍历树,直到结构满了为止. 如果在规则节点上没有结构的规范, 那时我们可以大大优化 - 我们沿着树向上走直到找到一个完全指定它的节点,然后简单指向它 - 这是最好的优化 - 整个结构是被分享的. 这节省了端值和内存的计算.

如果我们找到了部分定义,我们就往上走,直到结构被填满.(If we find partial definitions we go up the tree until the struct is filled.) 翻译!!

如果我们没有在结构中找到任何定义,那么万一该结构是一个'inherited'类型 - 我们指向**context tree**中父元素的结构, 在这种情况下我们也能成功分享结构. 如果它是重置结构(reset struct), 那么将使用默认值.

如果最具体的节点增加了数值那么我们需要增加额外的计算来将它转化为实际值. 我们可以在树节点存储结构所以它可以被子元素使用.

如果一个元素有同级或兄弟指向相同的树节点那么**"entire style context"**可以在它们之间共享.

让我们看个案例,: 假设我们有如下HTML

```html
<html>
	<body>
		<div class="err" id="div1">
			<p>
        this is a <span class="big"> big error </span>
        this is also a
        <span class="big"> very  big  error</span> error
      </p>
		</div>
		<div class="err" id="div2">another error</div>
    	</body>
</html>
```

并且有如下规则:

```md
1.	div {margin:5px;color:black}
2.	.err {color:red}
3.	.big {margin-top:3px}
4.	div span {margin-bottom:4px}
5.	#div1 {color:blue}
6.	#div2 {color:green}
```



为了简化,我们假设我们只需要填写两个结构 - 颜色结构和边距结构. 颜色结构只包含一个成员 - 颜色. 边距结构包含4个方面. 规则树结构看起来像这样(节点使用节点名字来标记: 它们指向规则的'#'.)

Figure 12: The rule tree

![image027.png (500×294) (taligarsiel.com)](http://taligarsiel.com/Projects/image027.png)



上下文树看起来像这样(节点名子: 它们指向规则节点)

Figure 13: The context tree

![image029.png (400×305) (taligarsiel.com)](http://taligarsiel.com/Projects/image029.png)



假设我们解析HTML并得到第二个`<div>`标签. 我们需要为这个节点创建样式上下文并用样式结构填充它.

我们将匹配这个规则并发现匹配`<div>`的规则是1, 2 和 6. 这意味着我们的元素可以使用已经在树中存在的路径且我们只需要为规则6添加一个节点(在规则树中的节点F).

我们将创建样式上下文并把它放在上下文树中. 新的样式上下文将指向规则树中的节点F.

我们现在需要填充样式结构. 我们将从添加边界结构(margin struct)开始. 由于最新的规则节点(F)不能添加进边界结构,我们可以向上直至我们找到在之前节点插入中计算的缓存结构并使用它. 我们将在节点B找到它, 它是指定margin规则最上层的节点.

我们确实对颜色结构有定义, 所以我们不能用存储的结构. 既然颜色有属性我们不需要上树来填充其他属性. 我们将计算端值(转换字符串到RGB 等)并在这个节点上缓存计算的结构.

在第二个`<span>`元素上的工作更简单.我们将匹配规则并得出它指向规则G的结论, 像前面的span. 既然我们有同级元素指向相同的节点, 我们能共享整个样式上下文且只需指向之前span的上下文.

对于包含从父元素继承的规则结构来说, 缓存是在上下文树上进行的(颜色属性实际上继承的, 但Firefox将其视为重置并在规则树上进行缓存.)

例如如果我们在段落中为字体添加规则:

```css
p {font-family:Verdana;font size:10px;font-weight:bold} 
```

那么在上下文树中作为段落子元素的div元素, 能从父元素出共享一样的字体结构. 如果对"div"来说没有明确的字体规则.

在没有规则树中的Webkit中, 匹配的声明被遍历了4次. 首先非重要高优先级属性(属性首先被应用是因为其他元素依赖它们,例如display)被应用, 然后是搞优先级的重要属性,然后是正常优先级非重要属性,然后是正常优先级的重要规则. 这意味着多次出现的属性将按照正常层叠的顺序来解析. 最后的胜出.

所以总结一下, - 共享样式对象(完全或其中的一些结构)解决问题[1](http://taligarsiel.com/Projects/howbrowserswork1.htm#issue1) and [3](http://taligarsiel.com/Projects/howbrowserswork1.htm#issue3). Firefox规则树有助于以正确的顺序来应用属性.

##### (操作规则以轻松匹配)Manipulating the rules for an easy match

样式规则有好几个来源:

* CSS规则, 或在外部样式表或在样式元素中  ` p {color: blue}`
* 行内样式属性 `<p style="color:blue">`
* HTML可视化属性(属性会被映射到相关的样式规则) `<p bgcolor="blue">`

最后两项可以轻松匹配到元素因为它拥有样式属性且HTML属性可以使用元素作为key进行映射.

如问题[issue #2](http://taligarsiel.com/Projects/howbrowserswork1.htm#issue2)中所述,css规则匹配可能更棘手. 为了解决这个困难, 对规则进行了操作, 以方便使用.

在解析样式表之后, 根据选择器, 规则被加到若干个hash地图中的一个. 有按id, 按类名, 按标签名的地图, 还有一个不适合这些类别的通用地图. 如果选择器是一个id, 规则将会添加到id映射, 如果是类它将添加到类映射等.

这个操作让匹配规则更简单. 没有必要在每个声明中查找- 我们能从这些映射中提取一个元素的相关规则. 这个优化消除了95+%的规则, 所以在匹配过程中设置不需要考虑这些规则([4.1](http://taligarsiel.com/Projects/howbrowserswork1.htm#4_1)).

让我们看看下面样式规则的案例:

```css
p.error {color:red}
#messageDiv {height:50px}
div {margin:5px}
```

第一条规则将插入到类映射中. 第二条将插入到id映射,第三条插入到标签映射中.

对下面的HTML片段:

```html
<p class="error">an error occurred </p>
<div id=" messageDiv">this is a message</div>
```

我们将首先尝试为'p'元素找到规则. 类映射将包含'error'键,在这个键下降找到'p.error'的规则. div元素在id映射(键是id)和标签映射中拥有相关的规则. 因此,剩下的工作就是找出那些由键真正匹配的规则将会被提取.

例如,如果div的规则是:

```css
table div {margin:5px}
```

它将从标签映射中提取出来, 因为键是最右侧的选择器,但是它将不匹配没有table祖先的div的元素.

Webkit和Firefox都会做同样的操作.

##### **在正确的层叠顺序中应用规则(Applying the rules in the correct cascade order)**

样式对象具有与每个视觉属性(所有css属性,但更通用)对应的属性. 如果这个属性没有被任何匹配规则所定义 - 那么有些属性可以从父元素样式对象继承. 其他属性有默认属性.

问题从有多余一个定义时开始 - 层叠顺序了解决这个问题.

**样式表层叠顺序(style sheet cascade order)**

一个样式属性的生命可以出现在若干样式表中, 会在一个样式表中有很多次. 这意味着应用规则的顺序很重要. 这被称作'cascade'(层叠)顺序. 按照CSS2规范, 层叠顺序是(从低到高):

1. 浏览器声明
2. 用户正常声明
3. 作者正常声明
4. 作者重要声明
5. 用户重要声明

浏览器声明式最不重要的,只有声明被标记为重要时,用户声明会覆盖作者声明. 相同顺序的声明会被规范[specifity](http://taligarsiel.com/Projects/howbrowserswork1.htm#specifity)排序,然后再按指定的顺序排序. ?? HTML视觉属性被翻译成匹配的CSS声明. 它们被当做低优先级的作者规则.



**特异性(specifity)**

选择器特异性通过CSS2 规范来定义,就像下面的:

* 如果声明来自'style'属性而不是用选择器的规则,就计数为1,否则为0(=a)
* 计算选择器中 ID 属性的数字(=b)
* 计算选择器中伪类(pseudo-classes)和其他属性的数字(=c)
* 计算选择器中元素名字和伪元素(pseudo-elements)的数字(=d)

连接这4个数字 a-b-c-d(在一个有大基数的数字系统中)给与了特异性.

你需要使用的数字基数由其中一个类别中最高的计数来定义.

例如, 如果a=14你能用16进制基数. 在不太可能的情况,a=17,你将需要一个17位数字基数. 后一种情况用像这样的选择器可以发生: html body div div p...(z在你选择器中17个标签, 可能性不大)

一些案例:

```css
 *             {}  /* a=0 b=0 c=0 d=0 -> specificity = 0,0,0,0 */
 li            {}  /* a=0 b=0 c=0 d=1 -> specificity = 0,0,0,1 */
 li:first-line {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
 ul li         {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
 ul ol+li      {}  /* a=0 b=0 c=0 d=3 -> specificity = 0,0,0,3 */
 h1 + *[rel=up]{}  /* a=0 b=0 c=1 d=1 -> specificity = 0,0,1,1 */
 ul ol li.red  {}  /* a=0 b=0 c=1 d=3 -> specificity = 0,0,1,3 */
 li.red.level  {}  /* a=0 b=0 c=2 d=1 -> specificity = 0,0,2,1 */
 #x34y         {}  /* a=0 b=1 c=0 d=0 -> specificity = 0,1,0,0 */
 style=""          /* a=1 b=0 c=0 d=0 -> specificity = 1,0,0,0 */
```



**规则排序(Sorting the rules)**

在规则匹配之后, 根据层叠规则来进行排序. Webkit为小列表使用冒泡排序(bubble sort),为大列表使用合并排序(merge sort). Webkit通过覆盖规则的`>`操作符来实现排序.

```css
静态布尔操作符 > (CSSRuleDate& r1, CSSRuleData& r2)
{
  int spec1 = r1.selector()->specificity();
  int spec2 = r2.selector()->specificity();
  return (spec1 == spec2) : r1.position() > r2.position() : spec1 > spec2; 
}
```



#### 2.5.4 渐进过程(Gradual process)

Webkit使用标志来标记是否所有顶部样式表(包括@imports)已经加载.如果匹配时样式还未完全加载 - 使用占位符并在文档中标记它, 一旦样式加载完就重新计算.



### 2.6 布局(Layout)

当渲染器被创建并添加到树的时候, 它不会有位置和尺寸. 计算这些值被称作布局(layout)或重排(reflow).

HTML使用基于流的布局模型,这意味着大多数时间可以在一次通过中计算几何结构.在流中靠后的元素不会影响流中靠前元素的几何形状,所以布局能持续从左到右,从上到下贯穿整个文档.也有例外情况-例如,HTML表格可能需要多次传递([3.5](http://taligarsiel.com/Projects/howbrowserswork1.htm#3_5)).

坐标系相对于根框架(root frame). 使用顶部和左侧坐标(coordinates).
布局(Layout)是一个递归过程. 它开始于根渲染器,与HTML文档元素相关. 布局将在部分或全部帧层次中继续递归，为需要几何信息的每个渲染器计算几何信息。
根渲染器的位置是0, 其尺寸为视口(浏览器窗口的可见部分)
所有渲染器有一个"布局(layout)"或"重排(reflow)"方法, 每个渲染器会调用需要布局的子元素的layout(布局)方法

#### 1.脏位系统[Dirty bit system](http://taligarsiel.com/Projects/howbrowserswork1.htm#Dirty_bit_system)
为了不因为每个较小的变化而做一个整体布局, 浏览器使用'dirty bit'(脏位)系统. 更改或添加的渲染器将其自身及其子级标记为'脏'- 需要布局.
有两个标志-"dirty"和"children are dirty". Children are dirty 意味着尽管渲染器自身可能正常, 它至少有一个子级需要布局.

#### 2.[Global and incremental layout](http://taligarsiel.com/Projects/howbrowserswork1.htm#Global_and_incremental_layout)
布局在整个渲染器上可以被触发 - 这是"global"布局. 这可能是由于以下原因发生的:
1. 由于全局样式改变影响所有的渲染器, 例如字体大小变化.
2. 由于屏幕大小被调整
布局可以是增量的(Layout can be incremental), 只有脏的渲染器将被布局(这可能会导致一些损坏, 这将需要额外的布局)
增量布局当渲染树是脏的时候触发(异步). 例如当来自网络的额外内容并被添加到DOM树之后,新的渲染器被附加到渲染树时.
![](http://taligarsiel.com/Projects/reflow.png)

Figure 20:Incremental layout - only dirty renderers and their children are layed out(3.6).




#### 3.[Asynchronous and Synchronous layout](http://taligarsiel.com/Projects/howbrowserswork1.htm#Asynchronous_and_Synchronous_layout)
增量布局是异步完成的. Firefox将增量布局的"reflow commands"排队, 调度程序会触发这些命令的批处理执行.Webkit也有一个计时器来执行增量布局-遍历树,并布局掉脏渲染器.
Scripts查询样式信息,例如'offsightHeight'能同步触发增量布局.
全局布局通常将会异步触发.
有时候,布局会在初始布局之后作为回调触发,因为某些属性(如滚动位置)发生了更改.


#### 4.[Optimizations](http://taligarsiel.com/Projects/howbrowserswork1.htm#Optimizations)
当布局被'调整大小resize'或渲染器位置(而非大小)的更改而触发时,渲染器大小将从缓存中获取,而不会重新计算.
在一些案例中,只有一个子树被更改, 布局不从root开始.这种情况可能发生在更改是本地的并且不影响其周围环境的情况下-例如将文本插入到文本字段中（否则每次击键都将触发从根开始的布局）


#### 5.[The layout process](http://taligarsiel.com/Projects/howbrowserswork1.htm#The_layout_process)
布局通常有如下模式:
	1.父渲染器决定自身宽度
	2.父节点检查子节点(Parent goes over the children and:)
		1.放置子渲染器(设置它为x 与 y)
		2.如果需要调用子布局(它们是脏位, 或者我们在全局布局中,或者其它原因). 这将计算子布局的高度.
	3.父节点使用子节点累加高度与外边距和内边距高度来设置它自己高度 - 这将会被父渲染器的父节点使用.
	4.设置它的脏位为false.

Firefox使用一个'state'对象(nsHTMLReflowState)作为一个参数来布局(称作'reflow回流'). 其中,状态包括父节点宽度.
Firefox布局输出是一个'metrics度量'对象(nsHTMLReflowState). 它将包含渲染器的计算高度.		
	

#### 6.[Width calculation](http://taligarsiel.com/Projects/howbrowserswork1.htm#Width_calculation)
渲染器宽度用容器盒子的宽度, 渲染器样式'width'属性,边距和边来计算.
例如下面div的宽度
```html
<div style="width:30%" />
```
将会被Webkit计算如下(类RenderBox方法calcWidth):
* 容器宽度是容器可用宽度与0的最大值. 

#### 7.[Line Breaking](http://taligarsiel.com/Projects/howbrowserswork1.htm#Line_Breaking)

































































































































































































































































































































































