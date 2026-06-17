## 作用域

> 来自: 你不知道的JavaScript  笔记->再精简

### 背景

作用域是什么?

存储变量和查找变量的规则.

原因?

将变量引入程序带来的问题: 变量存储在哪里? 程序需要的时候如何找到它们?

### 作用域是什么

#### 编译原理

传统编译语言的3个步骤:

* 分词/词法分析(Tokenizing/Lexing)
  * 将字符串分解成对编程语言有意义的代码块(代码块又被称作词法单元token)
  * 分词(tokenizing)和词法分析(Lexing)的区别: 词法单元的识别是通过有状态还是无状态
* 解析/语法分析(Parsing): 将词法单元转换成抽象语法树(AST)
* 代码生成

JavaScript的编译过程:

* JavaScript的编译过程不是发生在构建之前的,大部分情况下编译发生在代码执行前的几微秒（甚至更短！）的时间内

#### 理解作用域

**参与处理的模块**

* 引擎

  * 从头到尾负责整个JavaScript程序的编译及执行过程。

* 编译器

  * 负责语法分析及代码生成等脏活累活

* 作用域

  * 负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。


**处理过程**

分解`var a = 2`:

* 编译器首先会将这段程序分解成<u>词法单元</u>，然后将词法单元解析成一个<u>树结构</u>。
* 遇到`var a`，<span style="color:blue;">编译器会询问作用域</span>在同作用域集合中是否存在同名变量
  * 是: 编译器会忽略该声明，继续进行编译；
  * 否: 它会要求作用域在当前作用域的集合中声明一个新的变量，并命名为a
* 接下来编译器会为引擎生成运行时所需的代码，这些代码被用来处理`a = 2`这个赋值操作. <span style="color:blue;">引擎运行时会首先询问作用域</span>，在当前的作用域集合中是否存在一个叫作`a`的变量。
  * 如果是，引擎就会使用这个变量；
  * 如果否，引擎会继续查找该变量
    * 引擎寻找变量 `a`
      * 找到, 就会将2赋值给它; 
      * 没找到, 引擎就会举手示意并抛出一个异常！

> 总结:
>
> 变量的赋值操作会执行两个动作: 
>
> 首先编译器会在当前作用域中<span style="color:blue;">**声明一个变量**</span>（如果之前没有声明过）;
>
> 然后在运行时引擎会在作用域中<span style="color:blue;">**查找该变量**</span>，如果能够找到就会对它**赋值**。



**编译器的具体处理**

> 编译器在编译过程的第二步中生成了代码，引擎执行它时，会通过查找变量a来判断它是否已声明过。查找的过程由作用域进行协助，但是引擎执行怎样的查找，会影响最终的查找结果。

查找变量通过两种查询方式:

* LHS查询
* RHS查询

当变量出现在赋值操作的左侧时进行LHS查询，出现在右侧时进行RHS查询。(并不完全是)

“<span style="color:blue">赋值操作的目标是谁（LHS）</span>”以及<span style="color:blue">“谁是赋值操作的源头（RHS）”</span>。(完全是)



#### 作用域嵌套

**What?**

> 作用域是根据名称查找变量的一套规则.
>
> 当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。

**How?**

> 查找规则:
>
> 引擎从当前的执行作用域开始查找变量，如果找不到，就向上一级继续查找。当抵达最外层的全局作用域时，无论找到还是没找到，查找过程都会停止。



#### 异常处理

在变量还没有声明（在任何作用域中都无法找到该变量）的情况下，这两种查询的行为是不一样的。具体表现如下:

* RHS查询遍寻不到所需的变量,引擎会抛出`ReferenceError`异常
* LHS查询遍寻不到所需变量,

  * 非严格模式: 全局作用域会创建一个具有该名称的变量,并返还给引擎(非'严格模式'下)
  * 严格模式: 抛出同RHS查询失败时类似的`ReferenceError`异常

* RHS查询找到一个变量,但对变量进行不合理操作(例如,对函数类型进行调用,引用null/undefined值中的属性), 引擎抛出`TypeError`.

> `ReferenceError` 同作用域判别失败相关
>
> `TypeError` 代表作用域判别成功了，但是对结果的操作是非法或不合理的。





## 作用域分类

#### 编程语言中的分类

作用域共有两种主要的工作模型。

* 词法作用域: 最为普遍的，被大多数编程语言所采用的。
* 动态作用域，仍有一些编程语言在使用（比如Bash脚本、Perl中的一些模式等）

#### 词法作用域:

<span style="color:blue;">词法作用域就是定义在词法阶段的作用域</span>。换句话说，词法作用域是由你在写代码时将变量和块作用域写在哪里来决定的，因此当词法分析器处理代码时会保持作用域不变（大部分情况下是这样的）。

#### 词法作用域查找规则:

* 查找是从所处的最内部开始,逐级向上/外.遇到第一个匹配的标识符停止
* 多层嵌套作用域中可以定义同名标识符,存在'遮蔽效应'(内部遮蔽了外部的)
* 指回查找一级标识符.如果代码中引用了foo.bar.baz，词法作用域查找只会试图查找foo标识符，找到这个变量后，<span style="color:blue">对象属性访问规则</span>会分别接管对bar和baz属性的访问。

#### 欺骗词法:

> 具体查阅<你不知道的JavaScript>

JavaScript中有两种机制来实现这个目的.欺骗词法作用域会导致性能下降。

* eval()
* with

#### JS中的作用域有:

* 全局作用域
* 函数作用域
* 块作用域




### 函数作用域

#### 概述

> 函数作用域的含义是指，属于这个函数的全部变量都可以在整个函数的范围内使用及复用（事实上在嵌套的作用域中也可以使用）

* 函数的作用域由函数的定义位置决定,和函数的调用位置无关

* 函数作用域在函数调用时创建，在调用结束时销毁  
* 函数每次调用都会产生一个新的函数作用域，函数作用域与函数作用域之间相互独立
* 在函数作用域中声明的变量是 局部变量,只能在函数内部访问，无法被外部访问

* 在函数内部，使用var声明的变量和使用function开头的函数也会被提升

* 如果在函数内部声明变量时，省略var或let，则变量默认会成为全局变量(不希望出现的情况)



#### 设计优劣

* 充分利用JavaScript变量可以根据需要改变值类型的“动态”特性。 (???? 哪里有应用?
* 不细心处理变量,带来意想不到的问题.(????



#### 基于作用域隐藏变量和函数

> 在任意代码片段外部添加包装函数，可以将内部的变量和函数定义“隐藏”起来，外部作用域无法访问包装函数内部的任何内容。

**原因**

大都是从<span style="color:blue">最小特权原则(最小授权 / 最小暴露)</span>中引申出来的。这个原则是指在软件设计中，应该最小限度地暴露必要内容，而将其他内容都“隐藏”起来，比如某个模块或对象的API设计。

**隐藏作用域优点**

* 避免暴漏过多的变量或函数，实现私有化
* 避免同名标识符之间的冲突, 冲突会导致变量的值被意外覆盖。

**避免标识符冲突的实例**

<u>1. 全局命名空间中的第三方库</u>

这些库通常会在全局作用域中声明一个变量，通常是一个对象。这个对象被用作库的命名空间，所有需要暴露给外界的功能都会成为这个对象（命名空间）的属性，而不是将自己的标识符暴露在顶级的词法作用域中。

<u>2.模块管理</u>

使用任意模块管理器，任何库都无需将标识符加入到全局作用域中，而是通过依赖管理器的机制将库的标识符显式地导入到另外一个特定的作用域中



**使用函数隐藏作用域存在的问题**

具名函数本身就会污染所在作用域,没有函数名又该如何运行?

解决: 立即执行函数表达式

匿名函数表达式的缺点:

回答: 具体查看本笔记中 函数 >匿名和具名函数 > 缺点



**最佳实践**

推荐始终给匿名函数表达式添加函数名称, 编程具名函数表达式(行内函数表达式)

```javascript
setTimeout(function timeoutHandle() {
  console.log('...')
}, 1000)
```



**IIFE  立即执行函数表达式** 实践

优势:

1.不会污染所在作用域,不用通过函数名调用运行

用法:

1.两种使用形式

2.当做函数调用并传递参数

3.倒置代码运行顺序,将需要的函数放在第二位,在IIFE执行后当做参数传递进去



**原笔记内容**

- 在函数内定义的变量不能在函数之外的任何地方访问 || 一个函数可以访问定义在其范围内的任何变量和函数
- 定义在全局域中的函数可以访问所有定义在全局域中的变量。
- 在一个函数中定义的函数也可以访问在其父函数中定义的所有变量和父函数有权访问的任何其他变量




### 块作用域

块作用域是一个用来对之前的最小授权原则进行扩展的工具，将代码从在函数中隐藏信息扩展为在块中隐藏信息。

#### **JS中的块作用域**

JS中的块作用域有`with, try...catch, let, const`:

<u>with</u>

用with从对象中创建出的作用域仅在with声明中而非外部作用域中有效。

<u>try...catch</u>

其中声明的变量仅在catch内部有效

<u>let</u>

let关键字可以将变量绑定到所在的任意作用域中（通常是{ .. }内部）。换句话说，let为其声明的变量<span style="color:blue;">隐式地劫持了所在的块作用域</span>

优点:

let进行的声明不会再块作用域中进行提升.声明的代码被运行之前,声明并不存在.

#### 块作用域的作用

<u>1.垃圾收集</u> 

和闭包及回收内存垃圾的回收机制相关.

<span style="color:blue;">为变量显式声明块作用域，并对变量进行本地绑定是非常有用的工具</span>

考虑以下函数:

```javascript
function process(data) {
  //...
}

var someReallyBigData = {};
process(someReallyBigData);

var btn = document.getElementById('my button');
btn.addEventListener('click', function click(evt) {
  console.log('button clicked');
})
```

click函数的点击回调并不需要someReallyBigData变量。理论上这意味着当process(..)执行后，在内存中占用大量空间的数据结构就可以被垃圾回收了。但是，<span style="color:red;">由于click函数形成了一个覆盖整个作用域的闭包</span>，JavaScript引擎极有可能依然保存着这个结构（取决于具体实现）。

> ???? 这里的闭包是怎么实现的呢? 内部函数并没有引用外部函数的变量, 也许是需要解绑导致的吗?

块作用域可以打消这种顾虑，可以让引擎清楚地知道没有必要继续保存someReallyBigData了：

```javascript
function process(data) {
  //...
}
{ //在这个块中定义的内容完事可以销毁
	var someReallyBigData = {};
	process(someReallyBigData);
}
var btn = document.getElementById('my button');
btn.addEventListener('click', function click(evt) {
  console.log('button clicked');
})
```

<u>2.let循环</u>

```javascript
for (let i=0; i<10; i++) {
  console.log(i);
}
cosole.log(i); //ReferenceError
```

<span style="color:blue">for循环头部的let不仅将i绑定到了for循环的块中，事实上它将其重新绑定到了循环的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值。</span>

下面通过另一种方式来说明每次迭代时进行重新绑定的行为：

```javascript
{
  let j;
  for (j=0; j<10; j++) {
    let i=j; //每个迭代重新绑定
    console.log(i);
  }
}
```

<u>3.const声明</u>

可以用来创建块作用域变量，但其值是固定的（常量）。之后任何试图修改值的操作都会引起错误。



#### 函数作用域实例

```javascript
function fn2(){
    console.log(c);   //显示undefined  表明var c有在函数内部有变量提升
    tt();			  //显示'tt' 表明函数tt() 在函数fn2()中提升
    var c = 10;
    function tt(){console.log('tt');}
}    
   

=========================================================
    
function fn3(){
    c = 10;    //变量c变成全局变量 相当于window.c = 10;
}    
fn3();       // 为什么在这里,需要调用函数fn3才能访问变量c  理解:调用函数就是让函数内的代码运行
console.log('c =', c);  //
```





### js中的9种作用域
> https://mp.weixin.qq.com/s/2R58yPHmroE8VzR48p5SIw

JS的9种作用域:
* Global作用域: 全局作用域,在浏览器环境下就是window,在node环境下是global
* Local作用域: 本地作用域,或者叫函数作用域
* Block作用域: 块级作用域
* Script作用域: let, const声明的全局变量会保存在Script作用域,这些变量可以直接访问,但却不能通过window.xx访问
* 模块作用域: 其实严格来说这也是函数作用域，因为 node 执行它的时候会包一层函数，算是比较特殊的函数作用域，有 module、exports、require 等变量
* Catch Block作用域: catch 语句的作用域可以访问错误对象
* With Block 作用域：with 语句的作用域就是传入的对象的值
* Closure 作用域：函数返回函数的时候，会把用到的外部变量保存在 Closure 作用域里，这样再执行的时候该有的变量都有，这就是闭包。
* eval 的闭包比较特殊，会把所有变量都保存到 Closure 作用域
* Eval 作用域：eval 代码声明的变量会保存在 Eval 作用域

#### Global作用域
通过 var 声明一个变量，打个断点，可以看到 Scope 里有 Global 类型的作用域，也就是全局作用域，里面保存了变量 a：
在浏览器环境下，可以通过 a 访问全局变量，也可以通过 window.a 访问。
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.6lgnt208oig0.webp)



#### Local作用域
声明个函数，在函数内声明一个变量，调用这个函数的时候，可以看到 Scope 里有 Local 类型的作用域，也就是本地作用域，里面保存了变量 b：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.7j082481rbs0.webp)



#### Block作用域
es6 加入了块语句，它也同样会生成作用域：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.5f58578oruo0.webp)

如图，会把里面声明的变量 a 放到 Block 作用域内，也就是块级作用域。

if、while、for 等语句都会生成 Block 作用域.

#### Script作用域
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.4bg4b3pwjz40.webp)

![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.6v7vrlscp7g0.webp)

a、b、c 如果都是全局变量，那在浏览器里就可以通过 window.xx 来访问，但结果 window.a 和 window.b 都是 undefined，而直接访问 a、b 能拿到值。

看下现在的作用域就知道了：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.pejsz360880.webp)

你会发现 let、const 声明的全局变量被放到了 script 作用域，而 var 声明的变量被放到了 global 作用域。

这就是浏览器环境下用 let const 声明全局变量时的特殊作用域，script 作用域。可以直接访问这个全局变量，但是却不能通过 window.xx 访问。
所以你再看到这样的代码，就不奇怪了：
```js
windown.xxx = xxx
```

这个 xxx 肯定是通过 let、const 声明的全局变量，需要手动挂到 window 上。

那上面这个 script 作用域在 node 环境里有么？

我们用 node 调试下：

#### 模块作用域
同样的代码，在 node 环境下就没有了 Script 作用域，但是多了一个 Local 作用域：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.71icl3x6qyw0.webp)
这个 Local 作用域还有 module、exports、require 等变量，这个叫做模块作用域。

这个作用域有些特殊，其实它也是函数作用域。为什么呢？后面会有解释。

说到特殊的作用域，其实还有一些：

#### Catch Block作用域
Catch 语句也会生成一个特殊的作用域，Catch Block 作用域，特点是能访问错误对象：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.5q5xr9q0c400.webp)

在 node 里也是一样，只不过还有一层模块作用域：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.2lgq80y02tc0.webp)

那 finally 语句呢？

这个就没啥特殊的了，就是 Block 作用域：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.5camk9bpsdg0.webp)


#### with Block作用域
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.2ya15ttkzb60.webp)

with 语句里的作用域就是这个对象：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.6yp1336isho0.webp)

换成普通的对象更明显一些：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.1a44ayve3zmo.webp)



#### Closure作用域
闭包是 JS 的常见概念，它是一个函数返回另一个函数的形式，返回的函数引用了外层函数的变量，就会以闭包的形式保存下来。
比如:
```js
function fun() {
    const a = 1;
    const b = 2;
    return function () {
        const c = 2;

        console.log(a, c);
        debugger;
    };
}

const f = fun();
f();
```
那闭包的变量怎么保存的呢？

通过 node 可以看到：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.52dw3l3gsoc0.webp)
通过 Closure 作用域保存了变量 a 的值，这个 Closure 作用域就是闭包的核心。

那为啥只保存了 a 没保存 b、c 呢？

c 是返回的函数的作用域里的，不是外部作用域，而 b 则是没用到，所以 Closure 作用域里只保存了 a。

然后执行的时候就会恢复这个 Closure 作用域：

闭包里还有一种特殊情况，就是 eval：

上面的代码如果我改动一下，把打印语句变成 eval，会发生什么呢？
```js
function fun() {
    const a = 1;
    const b = 2;
    return function () {
        const c = 2;
        const d = 4;

        return function () {
            const e = 5;

            eval("console.log(a, c, e);");
        };
    };
}

const f = fun()();
f();
```

![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.2gedfiecjgn4.webp)
你会发现它把所有外部的作用域的变量都保存到了 Closure 作用域，包括模块作用域的变量。

为什么呢？

因为它根本不会去分析字符串呀，也没法分析，万一你这段 JS 是动态从服务端获取再 eval 的呢？
没法分析怎么保证代码执行不出错呢？

全部保存不就行了？

所以当返回的函数有 eval 的时候，JS 引擎就会形成特别大的 Closure，会把所有的变量都放到里面。

这样再执行 eval 的时候就不会出错了：
但是这样明显性能不好，会占用更多的内存，所以闭包里尽量不要用 eval。

前面说模块作用域是特殊的函数作用域，为什么这么说呢？

这就与 node 模块的执行机制有关系了。

比如这样一段代码：
```js
function func() {
require;
debugger;
}
func()
```
执行后发现形成了闭包：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.6j9zl6ohaek0.webp)

而如果不访问模块作用域的变量，就没有这一层了：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.5ya6fthprv40.webp)

我这明明没有闭包的代码呀！

这就与 node 模块的执行机制有关系了：

node 会把模块变为一个函数，它有 exports、require、module、__dirname、__filename 这五个参数，然后传入这五个参数来执行：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.7irno3qpfhw0.webp)
所以模块作用域就是个函数作用域而已！

模块里的函数引用模块作用域的变量，再执行，自然就形成了闭包。


#### Eval作用域
```js
eval(`
    const a = 1;
    const b = 2;
    const c = 3;

    console.log(a,b,c);
    debugger;
`);
```
执行之后是这样的：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.5g27mbzva400.webp)

可以看到有单独的 Eval 作用域，eval 的代码里声明的变量都在这个作用域里：
![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.1cpuv2hvb7nk.webp)







### 词法作用域和动态作用域

> https://github.com/mqyqingfeng/Blog/issues/3

### 1.定义

作用域是指程序源代码中定义变量的区域。

作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域。

### 2.作用域分类

* 全局作用域
* 函数作用域
* 块作用域(非函数大括号限制的空间)



### 3. 静态作用域和动态作用域

<u>因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。</u>

<u>而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。</u>

```javascript
//案例
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();

// 结果是 ???
```

假设JavaScript采用静态作用域，让我们分析下执行过程：

执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

假设JavaScript采用动态作用域，让我们分析下执行过程：

执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。

前面我们已经说了，JavaScript采用的是静态作用域，所以这个例子的结果是 1。

### 4.动态作用域

也许你会好奇什么语言是动态作用域？

bash 就是动态作用域，不信的话，把下面的脚本存成例如 scope.bash，然后进入相应的目录，用命令行执行 `bash ./scope.bash`，看看打印的值是多少。

```javascript
value = 1;
function foo() {
  echo $value;
}

function bar() {
  local value = 2;
  foo;
}
bar
```



### 5. 练习题

<JavaScript高级程序设计>中的例子

```javascript
var scope = 'global scope';
function checkscope() {
  var scope = 'local scope';
  function f() {
    return scope;
  }
  return f();
}

checkscope();
```

```javascript
var scope = 'global scope';
function checkscope() {
  var scope = 'local scope';
  function f() {
    return scope;
  }
  return f;
}

checkscope()();
```

两段代码都会打印：`local scope`。

原因也很简单，因为JavaScript采用的是词法作用域，函数的作用域基于函数创建的位置。





## JS中的作用域

### 全局作用域



### 函数作用域

#### 定义

属于这个函数的全部变量都可以在整个函数的范围内使用及复用

#### 隐藏变量和函数的好处

* 最小暴露原则(最小限度暴露必要内容)
* 避免同名标识符冲突
  * 全局命名空间(全局仅声明唯一一个对象,属性放到对象里)
  * 模块管理



#### 函数作用域特点

> 在某个位置独立调用,将会局部提升

* 函数的作用域由函数的<u>定义位置决定</u>,和函数的调用位置无关
* 函数作用域在函数调用时<u>创建</u>，在调用结束时<u>销毁</u>  
* 函数每次调用都会产生一个<u>新的</u>函数作用域，函数作用域之间<u>相互独立</u>
* 在函数作用域中声明的变量是 <u>局部变量</u>,只能在函数内部访问; 省略var或let，则变量默认会成为<u>全局</u>变量(不希望出现的情况)
* 在函数内部，使用var声明的变量和使用function开头的函数也会被提升



### 块作用域

#### 概述

块作用域是一个用来对之前的最小授权原则进行扩展的工具，将代码从在函数中隐藏信息扩展为在块中隐藏信息。

#### JS中的块

<u>with</u>

用with从对象中创建出的作用域仅在with声明中而非外部作用域中有效。

<u>try.catch</u>

其中声明的变量仅在catch内部有效

<u>let</u>

let关键字可以将变量绑定到所在的任意作用域中（通常是{ .. }内部）。换句话说，let为其声明的变量<span style="color:blue;">隐式地劫持了所在的块作用域</span>



#### 块作用域的作用

<u>1.垃圾收集</u>

让引擎清楚地知道没有必要继续保存某些数据

```javascript
function process(data) {
  //...
}
{ //在这个块中定义的内容完事可以销毁
	var someReallyBigData = {};
	process(someReallyBigData);
}

//
```

<u>2.let循环</u>

<span style="color:blue">for循环头部的let不仅将i绑定到了for循环的块中，事实上它将其重新绑定到了循环的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值。</span>

下面通过另一种方式来说明每次迭代时进行重新绑定的行为：

```javascript
{
  let j;
  for (j=0; j<10; j++) {
    let i=j; //每个迭代重新绑定
    console.log(i);
  }
}

//说明了几件事情?
//1. for循环内存在块作用域
//2. let声明的变量会绑定到循环的每一次迭代中
```

<u>3.创建块作用域变量</u>

可以用来创建块作用域变量，但其值是固定的（常量）。之后任何试图修改值的操作都会引起错误。



#### 提升

<span style="color:blue">函数声明和变量var声明都会被提升。函数会首先被提升，然后才是变量。</span>

函数声明和变量声明相同, 变量声明会被覆盖;

函数表达式不会进行提升,如果进行函数调用会抛出`TypeError`异常()(RHS,不合理操作报错)

有多个相同函数声明,前面的会被最后的覆盖.







## 执行上下文栈

> https://github.com/mqyqingfeng/Blog/issues/4
>
> 相关链接:
>
> https://github.com/mqyqingfeng/Blog/issues/5  变量对象
>
> [JavaScript深入之作用域链 · Issue #6 · mqyqingfeng/Blog (github.com)](https://github.com/mqyqingfeng/Blog/issues/6) 
>
> [JavaScript深入之从ECMAScript规范解读this · Issue #7 · mqyqingfeng/Blog (github.com)](https://github.com/mqyqingfeng/Blog/issues/7)

### 1. 顺序执行

如果要问到 JavaScript 代码执行顺序的话，想必写过 JavaScript 的开发者都会有个直观的印象，那就是顺序执行，毕竟：

```javascript
var foo = function() {
  console.log('foo1')
}
foo(); //'foo1'

var foo = function() {
  console.log('foo2')
}
foo(); //'foo2'
```

然而去看这段代码：

```javascript
function foo() {
  console.log('foo1')
}
foo(); //'foo2'
function foo() {
  console.log('foo2')
}
foo(); //'foo2'
```

 打印的结果却是两个 `foo2`。

刷过面试题的都知道这是因为 JavaScript 引擎并非一行一行地分析和执行程序，而是一段一段地分析执行。当执行一段代码的时候，会进行一个“准备工作”，比如第一个例子中的变量提升，和第二个例子中的函数提升。

<span style="color:red">但是本文真正想让大家思考的是：这个“一段一段”中的“段”究竟是怎么划分的呢？</span>

到底JavaScript引擎遇到一段怎样的代码时才会做“准备工作”呢？



### 2. 可执行代码

这就要说到 JavaScript 的可执行代码(executable code)的类型有哪些了？

其实很简单，就三种，<u>全局代码、函数代码、eval代码。</u>

举个例子，<u>当执行到一个函数的时候，就会进行准备工作，这里的“准备工作”，就叫做"执行上下文(execution context)"。</u>

### 3. 执行上下文栈

我们写的函数多了去了，如何管理创建的那么多执行上下文呢？

所以 JavaScript 引擎创建了<u>**执行上下文栈（Execution context stack，ECS）**来管理执行上下文</u>

为了模拟执行上下文栈的行为，让我们定义执行上下文栈是一个数组：

```javascript
ECStack = [];
```

试想当 JavaScript 开始要解释执行代码的时候，最先遇到的就是全局代码，所以初始化的时候首先就会向执行上下文栈压入一个全局执行上下文，我们用 globalContext 表示它，并且只有当整个应用程序结束的时候，ECStack 才会被清空，所以程序结束之前， ECStack 最底部永远有个 globalContext：

```javascript
ECStack = [
  globalContext
];
```

现在JavaScript遇到了这段代码:

```JavaScript
function fn3() {
  console.log('fn3');
}
function fn2() {
  fn3();
}
function fn1() {
  fn2();
}
fn1();
```

<span style='text-decoration: underline wavy blue'>当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。</span>知道了这样的工作原理，让我们来看看如何处理上面这段代码：

```javascript
//伪代码

//fn1()
ECStack.push(<fn1> functionContext)

//fn1中调用了fn2,需要创建fn2的执行上下文
ECStack.push(<fn2>, functionContext);

//fn2中调用了fn3,需要创建fn3的执行上下文
ECStack.push(<fn3>, functionContext);

//fn3执行完毕
ECStack.pop();

//fn2执行完毕
ECStack.pop();

//fn1执行完毕
ECStack.pop();

// javascript接着执行下面的代码，但是ECStack底层永远有个globalContext
```



### 4.练习题

让我们看看上篇文章[《JavaScript深入之词法作用域和动态作用域》](https://github.com/mqyqingfeng/Blog/issues/3)最后的问题：

```javascript
let scope = 'global scope';
function checkscope() {
  let scope = 'local scope';
  function f() {
    return scope;
  }
  return f();
}
checkscope();
```

```javascript
let scope = 'global scope';
function checkscope() {
  let scope = 'local scope';
  function f() {
    return scope;
  }
  return f;
}
checkscope()();
```

两段代码执行的结果一样，但是两段代码究竟有哪些不同呢？

答案就是执行上下文栈的变化不一样。

让我们模拟第一段代码：

```javascript
ECStack.push(<checksopce> functionContext);
ECStack.push(<f>, functionContext);
ECStack.pop();
ECStack.pop();
```

模拟第二段代码:

```javascript
ECStack.push(<checkscope> functionContext);
ECStack.pop();
ECStack.push(<f> functionContext);
ECStack.pop();
```

这样概括的回答执行上下文栈的变化不同，是不是依然有一种意犹未尽的感觉呢，为了更详细讲解两个函数执行上的区别，我们需要探究一下执行上下文到底包含了哪些内容，所以欢迎阅读下一篇《JavaScript深入之变量对象》。



## 变量对象

### 1. 执行上下文的3个属性

当 JavaScript 引擎执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

对于每个执行上下文，都有三个重要属性：

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

### 2. 变量对象

<u>变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。</u>

因为不同执行上下文下的变量对象稍有不同，所以我们来聊聊全局上下文下的变量对象和函数上下文下的变量对象。

### 3. 全局上下文

我们先了解一个概念，叫全局对象。在 [W3School](http://www.w3school.com.cn/jsref/jsref_obj_global.asp) 中也有介绍：

> 全局对象是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性。
>
> 在顶层 JavaScript 代码中，可以用关键字 this 引用全局对象。因为全局对象是作用域链的头，这意味着所有非限定性的变量和函数名都会作为该对象的属性来查询。
>
> 例如，当JavaScript 代码引用 parseInt() 函数时，它引用的是全局对象的 parseInt 属性。全局对象是作用域链的头，还意味着在顶层 JavaScript 代码中声明的所有变量都将成为全局对象的属性。

全局对象案例介绍:

1.可以通过this 引用，在客户端 JavaScript 中，全局对象就是 Window 对象。

```javascript
console.log(this);
```

2.全局对象是由 Object 构造函数实例化的一个对象。

```javascript
console.log(this instanceof Object);
```

3.预定义了一堆，嗯，一大堆函数和属性

```javascript
// 都能生效
console.log(Math.random());
console.log(this.Math.random());
```

4.作为全局变量的宿主

```javascript
var a = 1;
console.log(this.a);
```

5.客户端 JavaScript 中，全局对象有 window 属性指向自身。

```javascript
var a = 1;
console.log(window.a);

this.window.b = 2;
console.log(this.b);
```

**全局上下文中的变量对象就是全局对象呐！**



### 2.函数上下文

<u>在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象</u>。

活动对象和变量对象其实是一个东西，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 activation object 呐，而只有被激活的变量对象，也就是活动对象上的各种属性才能被访问。

活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。

### 3.执行过程

执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：

1. 进入执行上下文
2. 代码执行

#### 进入执行上下文

当进入执行上下文时，这时候还没有执行代码，

变量对象会包括：

1. 函数的所有形参 (如果是函数上下文)
   - 由名称和对应值组成的一个变量对象的属性被创建
   - 没有实参，属性值设为 undefined
2. 函数声明
   - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
   - 如果变量对象已经存在相同名称的属性，则完全替换这个属性
3. 变量声明
   - 由名称和对应值（undefined）组成一个变量对象的属性被创建；
   - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

举个例子:

```javascript
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

在进入执行上下文后，这时候的 AO 是：

```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```



```javascript
https://www.nowcoder.com/test/question/done?tid=60510589&qid=56246#summary

var foo = {n:1};
(function(foo){
    console.log(foo.n);
    foo.n = 3;
    var foo = {n:2};
    console.log(foo.n);
})(foo);
console.log(foo.n);
```





#### 代码执行

在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值

还是上面的例子，当代码执行完后，这时候的 AO 是：

```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

到这里变量对象的创建过程就介绍完了，让我们简洁的总结我们上述所说：

1. 全局上下文的变量对象初始化是全局对象
2. 函数上下文的变量对象初始化只包括 Arguments 对象
3. 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值
4. 在代码执行阶段，会再次修改变量对象的属性值



### 练习题

**第一题**

```javascript
function foo() {
  console.log(a);
  a = 1;
}
foo(); //

function bar() {
  a = 1;
  console.log(a);
}
bar(); //
```

第一段会报错：`Uncaught ReferenceError: a is not defined`。

第二段会打印：`1`。

这是因为<u>函数中的 "a" 并没有通过 var 关键字声明，所以不会被存放在 AO 中</u>。

第一段执行 console 的时候， AO 的值是：

```javascript
AO = {
  arguments: {
    length: 0
  }
}
```

没有 a 的值，然后就会到全局去找，全局也没有，所以会报错。

当第二段执行 console 的时候，全局对象已经被赋予了 a 属性，这时候就可以从全局找到 a 的值，所以会打印 1。



**第二题**

```javascript
console.log(foo);
function foo() {
  console.log('foo');
}
var foo = 1;
```

会打印函数，而不是 undefined 。

<u>这是因为在进入执行上下文时，首先会处理函数声明，其次会处理变量声明</u>，<u>如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性</u>。

```javascript
function fn(a) {
  var a;
  console.log(a);
  a = 3;
  console.log(a);
}
fn(2); //2 3
```





## 作用域链

> [JavaScript深入之作用域链 · Issue #6 · mqyqingfeng/Blog (github.com)](https://github.com/mqyqingfeng/Blog/issues/6)

在[《JavaScript深入之执行上下文栈》](https://github.com/mqyqingfeng/Blog/issues/4)中讲到，当JavaScript代码执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

对于每个执行上下文，都有三个重要属性：

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this



### 1.含义

在[《JavaScript深入之变量对象》](https://github.com/mqyqingfeng/Blog/issues/5)中讲到，当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。<span style="color:red">这样由多个执行上下文的变量对象构成的链表就叫做作用域链。</span>

下面，让我们以一个函数的创建和激活两个时期来讲解作用域链是如何创建和变化的。

### 2. 函数创建

在[《JavaScript深入之词法作用域和动态作用域》](https://github.com/mqyqingfeng/Blog/issues/3)中讲到，**函数的作用域在函数定义的时候就决定了**。
这是因为函数有一个内部属性 [[scope]]，<span style="color:red">当函数创建的时候，就会保存所有父变量对象到其中</span>，你可以理解 [[scope]] 就是所有父变量对象的层级链，但是注意：[[scope]] 并不代表完整的作用域链！

举个例子:
```javascript
function foo() {
  function bar() {
    ...
  }
}
```

函数创建时,各自的[[scope]]为:
```javascript
foo.[[scope]] = [globalContext.VO]

bar.[[scope]] = [
  fooContext.AO,
  globalContext.VO
]
```

### 3. 函数激活
当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。
这时候执行上下文的作用域链，我们命名为 Scope：
```javascript
Scope = [AO].concat([[Scope]]);
```
至此，作用域链创建完毕。

### 4. 案例
以下面的例子为例，结合着之前讲的变量对象和执行上下文栈，我们来总结一下<u>函数执行上下文中作用域链和变量对象的创建过程</u>：

```javascript
var scope = 'global scope';
function checkscope() {
  var scope2 = 'local scope';
  return scope2;
}
checkscope();
```

执行过程如下:
1.checkscope函数被创建,保存作用域链到内部属性[[scope]]
```javascript
checkscope.[[scope]] = [
  globalContext.VO
]
```

2.执行checkscope函数,创建checkscope函数执行上下文,checkscope函数执行上下文被压入执行上下文栈
```javascript
ECStack = [
  checkscopeContext,
  globalContext
]
```

3.checkscope函数并不立即执行,开始准备工作,第一步: 复制函数[[scope]]属性创建作用域链
```javascript
checkscopeContext = {
  Scope: checkscope.[[scope]];
}
```

4.第二步: 用arguments创建活动对象,随后初始化活动对象,加入形参,函数声明,变量声明
```javascript
checkscopeContext = {
  AO: {
    arguments: {
      length: 0
    },
    scope2: undefined
  },
  Scope: checkscope.[[scope]]
}
```
5.第三步: 将活动对象压入checkscope作用域顶端
```javascript
checkscopeContext = {
  AO: {
    arguments: {
      length: 0
    },
    scope2: undefined
  },
  Scope: [AO, [[Scope]]]
}
```

6.准备工作做完,开始执行函数,随着函数的执行,修改AO的属性值
```javascript
checkscopeContext = {
  AO: {
    arguments: {
      length: 0
    },
    scope2: 'local scope'
  },
  scope: [AO, [[Scope]]]
}
```

7.查找到scope2的值,返回后的函数执行完毕,函数上下文从执行上文栈中弹出
```javascript
ECStack = [
  globalContext
];
```





## 执行上下文

> [JavaScript深入之执行上下文 · Issue #8 · mqyqingfeng/Blog (github.com)](https://github.com/mqyqingfeng/Blog/issues/8)

在[《JavaScript深入之执行上下文栈》](https://github.com/mqyqingfeng/Blog/issues/4)中讲到，当 JavaScript 代码执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

对于每个执行上下文，都有三个重要属性：

- 变量对象(Variable object，VO)
- 作用域链(Scope chain)
- this

然后分别在[《JavaScript深入之变量对象》](https://github.com/mqyqingfeng/Blog/issues/5)、[《JavaScript深入之作用域链》](https://github.com/mqyqingfeng/Blog/issues/6)、[《JavaScript深入之从ECMAScript规范解读this》](https://github.com/mqyqingfeng/Blog/issues/7)中讲解了这三个属性。

阅读本文前，如果对以上的概念不是很清楚，希望先阅读这些文章。

因为，这一篇，我们会结合着所有内容，讲讲执行上下文的具体处理过程。

### 1.思考题

```javascript
var scope = 'global scope';
function checkscope() {
  var scope = 'local scope';
  function f() {
    return scope;
  }
  return f();
}
checkscope()
```

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```

两段代码都会打印'local scope'。虽然两段代码执行的结果一样，但是两段代码究竟有哪些不同呢？

紧接着就在下一篇[《JavaScript深入之执行上下文栈》](https://github.com/mqyqingfeng/Blog/issues/4)中，讲到了两者的区别在于执行上下文栈的变化不一样，然而，如果是这样笼统的回答，依然显得不够详细，本篇就会详细的解析执行上下文栈和执行上下文的具体变化过程。

### 2. 具体执行分析

我们分析第一段代码：

```javascript
var scope = 'global scope';

function checkscope() {
  var scope = 'local scope';
  function f() {
    return scope;
  }
  return f();
}

checkscope();
```

执行过程如下：

1.执行全局代码，创建全局执行上下文，全局上下文被压入执行上下文栈

```javascript
ECStack = [
  globalContext
];
```

2.全局上下文初始化

```javascript
globalContext = {
  VO: [global],
  Scope: [globalContext.VO],
  this: globalContext.VO
}
```

3.初始化同时,checkscope 函数被创建，保存作用域链到函数的内部属性[[scope]]

```javascript
checkscope.[[scope]] = [
  globalContext.VO
]
```

4.执行checkscope函数,创建checkscope函数执行上下文,checkscope函数执行上下文被压入执行上下文栈

```javascript
ECStack = [
  checkscopeContext,
  globalContext
]
```

5.checkscope函数执行上下文初始化:

5.1 复制函数[[scope]]属性创建作用域链

5.2 用arguments创建活动对象

5.3 初始化活动对象,即加入形参,函数声明,变量声明

5.4 将活动对象压入checkscope作用域链顶端



同时f函数被创建，保存作用域链到 f 函数的内部属性[[scope]]

```javascript
checkscopeContext = {
  AO: {
    arguments: {
      length: 0
    },
    scope: undefined,
    f: reference to function f() {}
  },
  Scope: [AO, globalContext.VO],
  this: undefined
}
```

6.执行f函数,创建f函数执行上下文, f函数执行上下文被压入执行上下文栈.

```javascript
ECStack = [
  fContext,
  checkscopeContext,
  globalContext
]
```

7.f函数执行上下文初始化,以下跟第5步相同

7.1 复制函数[[scope]]属性创建作用域链

7.2 用arguments创建活动对象

7.3 初始化活动对象,即加入形参,函数声明,变量声明

7.4 将活动对象压入f作用域链顶端

```javascript
fContext = {
  AO: {
    arguments: {
      length: 0
    }
  },
  Scope: [AO, checkscopeContext.AO, globalContext.VO],
  this: undefined
}
```

8.f函数执行,沿着作用域链查找scope的值,返回scope的值

9.f函数执行完毕, f函数上下文从执行上下文栈中弹出

```javascript
ECStack = [
  checkscopeContext,
  globalContext
]
```

10.checkscope函数执行完毕,checkscope执行上下文从执行上下文栈中弹出

```javascript
ECStack = [
  globalContext
]
```















## JavaScript专题系列-GitHub冴羽的博客

> [mqyqingfeng/Blog: 冴羽写博客的地方，预计写四个系列：JavaScript深入系列、JavaScript专题系列、ES6系列、React系列。 (github.com)](https://github.com/mqyqingfeng/Blog)



### JavaScript专题之函数柯里化(未完成)

> [JavaScript专题之函数柯里化 · Issue #42 · mqyqingfeng/Blog (github.com)](https://github.com/mqyqingfeng/Blog/issues/42)

#### define

维基百科中的定义

> In mathematics and computer science, currying is the technique of translating the evaluation(评估) of a function that takes multiple arguments (or a tuple(数组) of arguments) into evaluating a sequence of functions, each with a single argument.

在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

举个例子

```javascript
function add(a, b) {
  return a + b;
}

//制定add函数,一次传入两个参数即可
add(1, 2); //3

//假设有一个curry函数可以做到柯里化
let addCurry = curry(add);
addCurry(1)(2);
```



举个例子

> [js 中的多个连续的箭头函数与柯里化 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/26794822)

柯里化函数及其ES6写法

```js
function add(a) {
    return function(b) {
        return a + b
    }
}

var add3 = add(3)
add3(4) === 3 + 4 //true
```

add 函数 在 es6 里的写法等价为

```js
let add = a => b => a + b
```

n 个连续箭头组成的函数实际上就是柯里化了 n - 1次。







#### implemention

curry 的这种用途可以理解为：参数复用。本质上是降低通用性，提高适用性。

//....

#### 1 edition

这个版本的柯里化函数只能用一次,也就是addCurry()函数只能用一次

```javascript
function curry(fn) {
  let argsOut = [].slice.call(arguments, 1);
  return function() {
    let argsInner = [].slice.call(arguments);
    return fn.apply(this, argsOut.concat(argsInner));
  }
}
```

```javascript
//应用
function add(a ,b) {
  return a + b;
}

let addCurry = curry(add, 1, 2);
addCurry() //3
//或者
let addCurry = curry(add, 1);
addCurry(2) //3
//或者
let addCurry = curry(add);
addCurry(1, 2); //3
```

已经有柯里化的感觉了，但是还没有达到要求，不过我们可以把这个函数用作辅助函数，帮助我们写真正的 curry 函数。

#### 2 edition

```javascript
function sub_curry(fn) {
  let argsOut = [].slice.call(arguments, 1);
  return function() {
    let argsInner = [].slice.call(arguments);
    return fn.apply(this, argsOut.concat(argsInner));
  }
}

function curry(fn, length) {
  length = length ||fn.length;
  let slice = Array.prototype.slice;
  return function() {
    if (length > arguments.length) {
      let combined = [fn].concat(slice.call(arguments));
      return curry(sub_curry.apply(this, combined), length - arguments.length);
    } else {
      return fn.apply(this, arguments);
    }
  }
}
```



我们来验证下这个函数:

```javascript
let fn = curry(function(a, b, c) {
  return [a, b, c];
})

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]
```

效果已经达到我们的预期，然而这个 curry 函数的实现好难理解呐……

为了让大家更好的理解这个 curry 函数，我给大家写个极简版的代码：



```javascript
//简单版

function sub_curry(fn) {
  return function() {
    return fn()
  }
}

function curry(fn, length) {
  length = length || 4;
  return function() {
    if (length > 1) {
      return curry(sub_curry(fn), --length);
    } else {
      return fn();
    }
  }
}


let fn0 = function() {
  console.log(1);
}

let fn1 = curry(fn0);

fn1()()()(); //
```

当执行到fn1()时,函数返回:

```javascript
curry(sub_curry(fn0))
//相当于
curry(function() {
  return fn0()
})
```

当执行到fn1()()时,函数返回:

```javascript
curry(sub_curry(function() {
  return fn()
}))
//相当于
curry(function() {
  return (function() {
    return fn0()
  })()
})
//相当于
curry(function() {
  return fn0()
})
```

当执行 fn1()()() 时，函数返回：

```javascript
// 跟 fn1()() 的分析过程一样
curry(function(){
    return fn0()
})
```



当执行到fn1()()()()时, 因为此时length>1为false,所以执行fn():

```javascript 
fn();
//相当于
(function(){
  return fn0()
})()
//相当于
fn0();

```



#### 2.1 更易懂版本

如果你觉得还是无法理解，你可以选择下面这种实现方式，可以实现同样的效果：

```javascript
function curry(fn, args) {
  let length = fn.length;
  args = args || [];
  
  return function() {
    let _args = args.slice(0);
    let arg, i;
    
    for (let i=0; i<arguments.length; i++) {
      arg = arguments[i];
      _args.push(arg);
    }
    
    if (_args.length < length) {
      return curry.call(this, fn, _args);
    } else {
      return fn.apply(this, _args);
    }
  }
}
```



#### 3 edition  ???? 看不懂

curry 函数写到这里其实已经很完善了，但是注意这个函数的传参顺序必须是从左到右，根据形参的顺序依次传入，如果我不想根据这个顺序传呢？

我们可以创建一个占位符，比如这样：

```javascript
function curry(fn, args, holes) {
  length = fn.length;
  args = args || [];
  holes = holes || [];
  
  return function() {
    let _args = args.slice(0),
    		_holes = holes.slice(0),
        argsLen = args.length,
        holesLen = holes.length,
        arg, i, index = 0;
    
    for (i=0; i<arguments.length; i++){
      arg = arguments[i];
      if (arg === _&&holesLen) {
        
      }
    }
  }
}
```

我们直接看第三版的代码：

```js
// 第三版
function curry(fn, args, holes) {
    length = fn.length;

    args = args || [];

    holes = holes || [];

    return function() {

        var _args = args.slice(0),
            _holes = holes.slice(0),
            argsLen = args.length,
            holesLen = holes.length,
            arg, i, index = 0;

        for (i = 0; i < arguments.length; i++) {
            arg = arguments[i];
            // 处理类似 fn(1, _, _, 4)(_, 3) 这种情况，index 需要指向 holes 正确的下标
            if (arg === _ && holesLen) {
                index++
                if (index > holesLen) {
                    _args.push(arg);
                    _holes.push(argsLen - 1 + index - holesLen)
                }
            }
            // 处理类似 fn(1)(_) 这种情况
            else if (arg === _) {
                _args.push(arg);
                _holes.push(argsLen + i);
            }
            // 处理类似 fn(_, 2)(1) 这种情况
            else if (holesLen) {
                // fn(_, 2)(_, 3)
                if (index >= holesLen) {
                    _args.push(arg);
                }
                // fn(_, 2)(1) 用参数 1 替换占位符
                else {
                    _args.splice(_holes[index], 1, arg);
                    _holes.splice(index, 1)
                }
            }
            else {
                _args.push(arg);
            }

        }
        if (_holes.length || _args.length < length) {
            return curry.call(this, fn, _args, _holes);
        }
        else {
            return fn.apply(this, _args);
        }
    }
}

var _ = {};

var fn = curry(function(a, b, c, d, e) {
    console.log([a, b, c, d, e]);
});

// 验证 输出全部都是 [1, 2, 3, 4, 5]
fn(1, 2, 3, 4, 5);
fn(_, 2, 3, 4, 5)(1);
fn(1, _, 3, 4, 5)(2);
fn(1, _, 3)(_, 4)(2)(5);
fn(1, _, _, 4)(_, 3)(2)(5);
fn(_, 2)(_, _, 4)(1)(3)(5)
```



### JavaScript专题之偏函数

#### 定义

维基百科中对偏函数 (Partial application) 的定义为：

> In computer science, partial application(or partial function application) refers to the process of fixing a number of arguments to a function, producing another function of smaller arity.
>
> 翻译:
>
> 在计算机科学中，局部应用是指固定一个函数的一些参数，然后产生另一个更小元的函数。

什么是元? 元是指函数参数的个数,比如一个带有两个参数的函数被称为二元函数.

来个例子:

```javascript
function add(a, b) {
  return a + b;
}

//执行 add 函数，一次传入两个参数即可
add(1, 2)

//假设有一个 partial 函数可以做到局部应用
let addOne = partial(add, 1);
addOne(2); //3
```



#### 柯里化与局部应用

两者的区别:

* 柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。
* 局部应用则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数。

如果说两者有什么关系的话，引用 [functional-programming-jargon](https://github.com/hemanth/functional-programming-jargon#partial-application) 中的描述就是：

> Curried functions are automatically partially applied.



#### 重写partial

目的是模仿 underscore 写一个 partial 函数

也许你在想我们可以直接使用 bind 呐，举个例子：

```javascript
function add(a, b) {
    return a + b;
}

var addOne = add.bind(null, 1);

addOne(2) // 3
```



##### 第一版

```javascript
function partial(fn) {
  let args = [].slice.call(arguments, 1);
  return function() {
    let newArrs = args.concat([].slice.call(arguments));
    return fn.apply(this, newArrs);
  }
}
```



demo

```javascript
function add(a, b) {
  return a + b + this.value;
}

let addOne = partial(add, 1);

let value = 1;
let obj = {
  value: 2,
  addOne: addOne
}

obj.addOne(2); //???
//使用bind时, 结果是4
//使用partial时, 结果是5
```



##### 第二版 ????

然而正如 curry 函数可以使用占位符一样，我们希望 partial 函数也可以实现这个功能，我们再来写第二版：

```javascript
let _ = {};

function partial(fn) {
  let args = [].slice.call(arguments, 1);
  return function() {
    let position = 0,
        len = args.length;
    for (let i=0; i<len; i++) {
      args[i] = args[i] === _ ? arguments[position++] : args[i];
    }
    while(position < arguments.length) args.push(arguments[position++]);
    return fn.apply(this, args);
  }
}
```



### JavaScript专题之惰性函数

#### 需求

我们现在需要写一个 foo 函数，这个函数返回首次调用时的 Date 对象，注意是首次。



#### 解决方案

##### 1 普通方法

```javascript
let t;

function foo() {
  if (t) return t;
  t = new Date();
  return t;
}
```

问题有两个，一是污染了全局变量，二是每次调用 foo 的时候都需要进行一次判断。

##### 2 闭包

使用闭包避免污染全局变量

还是没有解决调用时都必须进行一次判断的问题。

```javascript
let foo = (function() {
  let t;
  return function() {
    if (t) return t;
    t = new Date();
    return t;
  }
})
```

##### 3. 函数对象

函数也是一种对象，利用这个特性，我们也可以解决这个问题。

依旧没有解决调用时都必须进行一次判断的问题。

```javascript
function foo() {
  if (foo.t) return foo.t;
  foo.t = new Date();
  return foo.t;
}
```



##### 4. 惰性函数

惰性函数就是解决每次都要进行判断的这个问题，解决原理很简单，<u>重写函数</u>。

如何重写?在函数体内重新赋值, 然后根据需要来返回.

```javascript
let foo = function() {
  let t = new Date();
  foo = function() {
    return t;
  };
  
  return foo();
}
```



#### 应用

DOM 事件添加中，为了兼容现代浏览器和 IE 浏览器，我们需要对浏览器环境进行一次判断：

```javascript
//简化写法

function addEvent(type, e1, fn) {
  if (window.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (window.attachEvent) {
    el.attachEvent('on' + type, fn);
  }
}
```

问题在于我们每当使用一次 addEvent 时都会进行一次判断。

利用惰性函数，我们可以这样做：

```javascript
function addEvent(type, el, fn) {
  if (window.addEventListener) {
    addEvent = function(type, el, fn) {
      el.addEventListener(type, fn, false);
    }
  } else if (window.attachEvent) {
    addEvent = function (type, el, fn) {
      el.attachEvent('on' + type, fn);
    }
  }
}
```

当然,我们可以使用闭包形式

```javascript
let addEvent = (function() {
  if (window.addEventListener) {
    return function(type, el, fn) {
      el.addEventListener(type, fn, false);
    }
  } else if (window.attachEvent) {
    return function(type, el, fn) {
      el.attachEvent('on' + type, fn);
    }
  }
})();
```

当我们每次都需要进行条件判断，其实只需要判断一次，接下来的使用方式都不会发生改变的时候，想想是否可以考虑使用惰性函数。

#### 重要参考

> [peter.michaux.ca - Lazy Function Definition Pattern](http://peter.michaux.ca/articles/lazy-function-definition-pattern)



### JavaScript专题之函数组合   ????

> [JavaScript专题之函数组合 · Issue #45 · mqyqingfeng/Blog (github.com)](https://github.com/mqyqingfeng/Blog/issues/45)

#### 需求

我们需要写一个函数，输入 'kevin'，返回 'HELLO, KEVIN'。

#### 尝试

```javascript
let toUpperCase = function(x) {return x.toUpperCase()};
let hello = function(x) {return 'HELLO, ' + x}
function greet(x) {
  return hello(toUpperCase(x));
}
greet('kevin');
```



#### 优化

试想我们写个compose函数

```javascript
let compose = function(f, g) {
  return function(x) {
    return f(g(x));
  }
}
```

greet函数就可以被优化为:

```javascript
let greet = compose(hello, toUpperCase);
greet('kevin');
```

<u>利用 compose 将两个函数组合成一个函数，让代码**从右向左**运行，而不是由内而外运行，可读性大大提升。这便是函数组合。</u>

但是现在的 compose 函数也只是能支持两个参数，如果有更多的步骤呢？我们岂不是要这样做：

```javascript
compose(d, compose(c, compose(b, a)))
```

为什么我们不写一个帅气的 compose 函数支持传入多个函数呢？这样就变成了：

```javascript
compose(d, c, b, a)
```



#### compose

我们直接抄袭underscore的compose函数的实现:

```javascript
function compose() {
  let args = arguments;
  let start = args.length - 1;
  let i = start;
  return function() {
    let result = args[start].apply(this, arguments);
    while(i--) result = args[i].call(this, result);
    return result;
  }
}
```

现在的 compose 函数已经可以支持多个函数了，然而有了这个又有什么用呢？

在此之前，我们先了解一个概念叫做 pointfree。

#### pointfree

<u>pointfree 指的是函数无须提及将要操作的数据是什么样的</u>。依然是以最初的需求为例：

```javascript
// 需求：输入 'kevin'，返回 'HELLO, KEVIN'。

// 非 pointfree，因为提到了数据：name
let greet = function(name) {
  return ('hello ' + name).toUpperCase();
}

// pointfree
//先定义基本运算,这些可以封装起来复用
let toUpperCase = function(x) {return x.toUpperCase();};
let hello = function(x) {return 'HELLO, ' + x;};

let greet = compose(hello, toUpperCase);
greet('kevin')
```

我们再举个稍微复杂一点的例子，为了方便书写，我们需要借助在[《JavaScript专题之函数柯里化》](https://github.com/mqyqingfeng/Blog/issues/42)中写到的 curry 函数：

```javascript
// 需求：输入 'kevin daisy kelly'，返回 'K.D.K'

// 非 pointfree，因为提到了数据：name
let initials = function(name) {
  return name.split(' ').map(item => item[0].toUpperCase()).join('. ')
}

let initials = function(name) {
  return name.split(' ').map(compose(toUpperCase, head)).join('. ');
}

//pointfree 
// 先定义基本运算
let split = curry(function(separator, str) { str.split(separator) });
let head = function(str) { return str.slice(0, 1) };
let toUpperCase = function(str) { return str.toUpperCase() };
let join = curry(function(sepatator, arr) { return arr.join(separator) });
let map = curry(function(fn, arr) { return arr.map(fn) });

let initials = compose(join(' '), map(compose(toUpperCase, head), split(' ')));

initials('kevin daisy kelly')
```

从这个例子中我们可以看到，利用柯里化（curry）和函数组合 (compose) 非常有助于实现 pointfree。

也许你会想，这种写法好麻烦呐，我们还需要定义那么多的基础函数……可是如果有工具库已经帮你写好了呢？比如 [ramda.js](http://ramda.cn/docs/)：

```javascript
//使用ramda.js
let initials = R.compose(R.join(' '), R.map(R.compose(R.toUpper, R.head)), R.split(' '));
```

而且你也会发现：

> Pointfree 的本质就是使用一些通用的函数，组合出各种复杂运算。上层运算不要直接操作数据，而是通过底层函数去处理。即不使用所要处理的值，只合成运算过程。

那么使用 pointfree 模式究竟有什么好处呢？

> pointfree 模式能够帮助我们减少不必要的命名，让代码保持简洁和通用，更符合语义，更容易复用，测试也变得轻而易举。

#### 实战 ???? 懵逼

这个例子来自于 [Favoring Curry](http://fr.umio.us/favoring-curry/)：

假设我们从服务器获取这样的数据：

```javascript
var data = {
    result: "SUCCESS",
    tasks: [
        {id: 104, complete: false,            priority: "high",
                  dueDate: "2013-11-29",      username: "Scott",
                  title: "Do something",      created: "9/22/2013"},
        {id: 105, complete: false,            priority: "medium",
                  dueDate: "2013-11-22",      username: "Lena",
                  title: "Do something else", created: "9/22/2013"},
        {id: 107, complete: true,             priority: "high",
                  dueDate: "2013-11-22",      username: "Mike",
                  title: "Fix the foo",       created: "9/22/2013"},
        {id: 108, complete: false,            priority: "low",
                  dueDate: "2013-11-15",      username: "Punam",
                  title: "Adjust the bar",    created: "9/25/2013"},
        {id: 110, complete: false,            priority: "medium",
                  dueDate: "2013-11-15",      username: "Scott",
                  title: "Rename everything", created: "10/2/2013"},
        {id: 112, complete: true,             priority: "high",
                  dueDate: "2013-11-27",      username: "Lena",
                  title: "Alter all quuxes",  created: "10/5/2013"}
    ]
};
```

我们需要写一个名为 getIncompleteTaskSummaries 的函数，接收一个 username 作为参数，从服务器获取数据，然后筛选出这个用户的未完成的任务的 ids、priorities、titles、和 dueDate 数据，并且按照日期升序排序。

以 Scott 为例，最终筛选出的数据为：

```javascript
[
  {id: 110, title: "Rename everything", 
   dueDate: "2013-11-15", priority: "medium"},
  {id: 104, title: "Do something", 
   dueDate: "2013-11-29", priority: "high"}
]
```



```javascript
function getIncompleteTaskSummaties(username) {
  return username.tasks.map(item => {
    let obj = {};
  	for (const [key, value] of Object.entries(item)) {
      if (['id','title','dueDate','priority'].includes(key)) {
        obj[key] =  value;
      }
    }
    return obj;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
}
```

看不懂????

```javascript
//第一版 过程式编程
var fetchData = function() {
    // 模拟
    return Promise.resolve(data)
};

var getIncompleteTaskSummaries = function(membername) {
     return fetchData()
         .then(function(data) {
             return data.tasks;
         })
         .then(function(tasks) {
             return tasks.filter(function(task) {
                 return task.username == membername
             })
         })
         .then(function(tasks) {
             return tasks.filter(function(task) {
                 return !task.complete
             })
         })
         .then(function(tasks) {
             return tasks.map(function(task) {
                 return {
                     id: task.id,
                     dueDate: task.dueDate,
                     title: task.title,
                     priority: task.priority
                 }
             })
         })
         .then(function(tasks) {
             return tasks.sort(function(first, second) {
                 var a = first.dueDate,
                     b = second.dueDate;
                 return a < b ? -1 : a > b ? 1 : 0;
             });
         })
         .then(function(task) {
             console.log(task)
         })
};

getIncompleteTaskSummaries('Scott')
```

如果使用pointfree模式:

```javascript
// 第二版 pointfree 改写
var fetchData = function() {
    return Promise.resolve(data)
};

// 编写基本函数
var prop = curry(function(name, obj) {
    return obj[name];
});

var propEq = curry(function(name, val, obj) {
    return obj[name] === val;
});

var filter = curry(function(fn, arr) {
    return arr.filter(fn)
});

var map = curry(function(fn, arr) {
    return arr.map(fn)
});

var pick = curry(function(args, obj){
    var result = {};
    for (var i = 0; i < args.length; i++) {
        result[args[i]] = obj[args[i]]
    }
    return result;
});

var sortBy = curry(function(fn, arr) {
    return arr.sort(function(a, b){
        var a = fn(a),
            b = fn(b);
        return a < b ? -1 : a > b ? 1 : 0;
    })
});

var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(prop('tasks'))
        .then(filter(propEq('username', membername)))
        .then(filter(propEq('complete', false)))
        .then(map(pick(['id', 'dueDate', 'title', 'priority'])))
        .then(sortBy(prop('dueDate')))
        .then(console.log)
};

getIncompleteTaskSummaries('Scott')
```

如果直接使用 ramda.js，你可以省去编写基本函数:

```javascript
// 第三版 使用 ramda.js
var fetchData = function() {
    return Promise.resolve(data)
};

var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(R.prop('tasks'))
        .then(R.filter(R.propEq('username', membername)))
        .then(R.filter(R.propEq('complete', false)))
        .then(R.map(R.pick(['id', 'dueDate', 'title', 'priority'])))
        .then(R.sortBy(R.prop('dueDate')))
        .then(console.log)
};

getIncompleteTaskSummaries('Scott')
```

当然了，利用 compose，你也可以这样写：

```javascript
// 第四版 使用 compose
var fetchData = function() {
    return Promise.resolve(data)
};

var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(R.compose(
            console.log,
            R.sortBy(R.prop('dueDate')),
            R.map(R.pick(['id', 'dueDate', 'title', 'priority'])
            ),
            R.filter(R.propEq('complete', false)),
            R.filter(R.propEq('username', membername)),
            R.prop('tasks'),
        ))
};

getIncompleteTaskSummaries('Scott')
```

compose 是从右到左依此执行，当然你也可以写一个从左到右的版本，但是从右向左执行更加能够反映数学上的含义。

ramda.js 提供了一个 R.pipe 函数，可以做的从左到右，以上可以改写为：

```javascript
// 第五版 使用 R.pipe
var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(R.pipe(
            R.prop('tasks'),
            R.filter(R.propEq('username', membername)),
            R.filter(R.propEq('complete', false)),
            R.map(R.pick(['id', 'dueDate', 'title', 'priority'])
            R.sortBy(R.prop('dueDate')),
            console.log,
        ))
};
```



### JavaScript专题之函数记忆 ????

> [JavaScript专题之函数记忆 · Issue #46 · mqyqingfeng/Blog (github.com)](https://github.com/mqyqingfeng/Blog/issues/46)

#### 定义

函数记忆是指将上次的计算结果缓存起来，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据。

举个例子:

```javascript
function add(a, b) {
  return a + b;
}

//假设memorize可以实现函数记忆
let memorizeAdd = memorize(add);

memorizeAdd(1, 2); //3
memorizeAdd(1, 2); //相同的参数，第二次调用时，从缓存中取出数据，而非重新计算一次
```



#### 原理

实现这样一个 memorize 函数很简单，原理上只用把参数和对应的结果数据存到一个对象中，调用时，判断参数对应的数据是否存在，存在就返回对应的结果数据。

#### 第一版

```javascript
function memorize(f) {
  let cache = {};
  return function() {
    let key = arguments.length + Array.prototype.join.call(arguments, ',');
    if (key in cache) {
      return cache[key]
    } else {
      return cache[key] = f.apply(this, arguments);
    }
  }
}

//key为什么要这么处理?
//担心 Array.prototype.join.call(arguments, ",") 会导致缓存的 key 值相同，比如在一些特殊情况下：
function add(a, b) {
  console.log(a + b);
}
let memorizeAdd = memorize(add);
memorizeAdd(1, 2); //3
memorizeAdd('1,2'); //3
```

我们来测试一下：

```
var add = function(a, b, c) {
  return a + b + c
}

var memoizedAdd = memoize(add)

console.time('use memoize')
for(var i = 0; i < 100000; i++) {
    memoizedAdd(1, 2, 3)
}
console.timeEnd('use memoize')

console.time('not use memoize')
for(var i = 0; i < 100000; i++) {
    add(1, 2, 3)
}
console.timeEnd('not use memoize')
```

在 Chrome 中，使用 memoize 大约耗时 60ms，如果我们不使用函数记忆，大约耗时 1.3 ms 左右。

#### 注意

什么，我们使用了看似高大上的函数记忆，结果却更加耗时，这个例子近乎有 60 倍呢！

所以，函数记忆也并不是万能的，你看这个简单的场景，其实并不适合用函数记忆。

需要注意的是，函数记忆只是一种编程技巧，本质上是牺牲算法的空间复杂度以换取更优的时间复杂度，在客户端 JavaScript 中代码的执行时间复杂度往往成为瓶颈，因此在大多数场景下，这种牺牲空间换取时间的做法以提升程序执行效率的做法是非常可取的。

#### 第二版

因为第一版使用了 join 方法，我们很容易想到当参数是对象的时候，就会自动调用 toString 方法转换成 `[Object object]`，再拼接字符串作为 key 值。我们写个 demo 验证一下这个问题：

```JavaScript
var propValue = function(obj){
    return obj.value
}

var memoizedAdd = memoize(propValue)

console.log(memoizedAdd({value: 1})) // 1
console.log(memoizedAdd({value: 2})) // 1
```

两者都返回了 1，显然是有问题的，所以我们看看 underscore 的 memoize 函数是如何实现的：

```javascript
// 第二版 (来自 underscore 的实现)
var memoize = function(func, hasher) {
    var memoize = function(key) {
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!cache[address]) {
            cache[address] = func.apply(this, arguments);
        }
        return cache[address];
    };
    memoize.cache = {};
    return memoize;
};
```

这个实现可以看出，underscore 默认使用 function 的第一个参数作为 key，所以如果直接使用

```javascript
var add = function(a, b, c) {
  return a + b + c
}

var memoizedAdd = memoize(add)

memoizedAdd(1, 2, 3) // 6
memoizedAdd(1, 2, 4) // 6
```

肯定是有问题的，如果要支持多参数，我们就需要传入 hasher 函数，自定义存储的 key 值。所以我们考虑使用 JSON.stringify：

```javascript
var memoizedAdd = memoize(add, function(){
    var args = Array.prototype.slice.call(arguments)
    return JSON.stringify(args)
})

console.log(memoizedAdd(1, 2, 3)) // 6
console.log(memoizedAdd(1, 2, 4)) // 7
```

如果使用 JSON.stringify，参数是对象的问题也可以得到解决，因为存储的是对象序列化后的字符串。

#### 使用场景

我们以斐波那契数列为例：

```
var count = 0;
var fibonacci = function(n){
    count++;
    return n < 2? n : fibonacci(n-1) + fibonacci(n-2);
};
for (var i = 0; i <= 10; i++){
    fibonacci(i)
}

console.log(count) // 453
```

我们会发现最后的 count 数为 453，也就是说 fibonacci 函数被调用了 453 次！也许你会想，我只是循环到了 10，为什么就被调用了这么多次，所以我们来具体分析下：

```
当执行 fib(0) 时，调用 1 次

当执行 fib(1) 时，调用 1 次

当执行 fib(2) 时，相当于 fib(1) + fib(0) 加上 fib(2) 本身这一次，共 1 + 1 + 1 = 3 次

当执行 fib(3) 时，相当于 fib(2) + fib(1) 加上 fib(3) 本身这一次，共 3 + 1 + 1 = 5 次

当执行 fib(4) 时，相当于 fib(3) + fib(2) 加上 fib(4) 本身这一次，共 5 + 3 + 1 = 9 次

当执行 fib(5) 时，相当于 fib(4) + fib(3) 加上 fib(5) 本身这一次，共 9 + 5 + 1 = 15 次

当执行 fib(6) 时，相当于 fib(5) + fib(4) 加上 fib(6) 本身这一次，共 15 + 9 + 1 = 25 次

当执行 fib(7) 时，相当于 fib(6) + fib(5) 加上 fib(7) 本身这一次，共 25 + 15 + 1 = 41 次

当执行 fib(8) 时，相当于 fib(7) + fib(6) 加上 fib(8) 本身这一次，共 41 + 25 + 1 = 67 次

当执行 fib(9) 时，相当于 fib(8) + fib(7) 加上 fib(9) 本身这一次，共 67 + 41 + 1 = 109 次

当执行 fib(10) 时，相当于 fib(9) + fib(8) 加上 fib(10) 本身这一次，共 109 + 67 + 1 = 177 次
```

所以执行的总次数为：177 + 109 + 67 + 41 + 25 + 15 + 9 + 5 + 3 + 1 + 1 = 453 次！

如果我们使用函数记忆呢？

```
var count = 0;
var fibonacci = function(n) {
    count++;
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
};

fibonacci = memoize(fibonacci)

for (var i = 0; i <= 10; i++) {
    fibonacci(i)
}

console.log(count) // 12
```

我们会发现最后的总次数为 12 次，因为使用了函数记忆，调用次数从 453 次降低为了 12 次!

兴奋的同时不要忘记思考：为什么会是 12 次呢？

从 0 到 10 的结果各储存一遍，应该是 11 次呐？咦，那多出来的一次是从哪里来的？

所以我们还需要认真看下我们的写法，在我们的写法中，其实我们用生成的 fibonacci 函数覆盖了原本了 fibonacci 函数，当我们执行 fibonacci(0) 时，执行一次函数，cache 为 {0: 0}，但是当我们执行 fibonacci(2) 的时候，执行 fibonacci(1) + fibonacci(0)，因为 fibonacci(0) 的值为 0，`!cache[address]` 的结果为 true，又会执行一次 fibonacci 函数。原来，多出来的那一次是在这里！



### JavaScript专题之乱序

> [JavaScript专题之乱序 · Issue #51 · mqyqingfeng/Blog (github.com)](https://github.com/mqyqingfeng/Blog/issues/51)

#### 乱序

乱序的意思就是将数组打乱。

#### Math.random

一个经常会遇见的写法是使用 Math.random()：

```javascript
let values = [1,2,3,4,5];

values.sort(() => Math.random() - 0.5);

console.log(values)
```

`Math.random() - 0.5` 随机得到一个正数、负数或是 0，如果是正数则降序排列，如果是负数则升序排列，如果是 0 就不变，然后不断的升序或者降序，最终得到一个乱序的数组。

看似很美好的一个方案，实际上，效果却不尽如人意。不信我们写个 demo 测试一下：

```javascript
let times = [0,0,0,0,0];

for (let i=0; i<100000; i++) {
  let arr = [1,2,3,4,5];
  arr.sort(() => Math.random() - 0.5);
  times[arr[4] - 1]++;
}

console.log(times);
```

测试原理是：将 `[1, 2, 3, 4, 5]` 乱序 10 万次，计算乱序后的数组的最后一个元素是 1、2、3、4、5 的次数分别是多少。

一次随机的结果为：

```javascript
[30636, 30906, 20456, 11743, 6259]
```

结果表示 10 万次中，数组乱序后的最后一个元素是 1 的情况共有 30636 次，是 2 的情况共有 30906 次，其他依此类推。

我们会发现，最后一个元素为 5 的次数远远低于为 1 的次数，所以这个方案是有问题的。

#### 插入排序

如果要追究这个问题所在，就必须了解 sort 函数的原理，然而 ECMAScript 只规定了效果，没有规定实现的方式，所以不同浏览器实现的方式还不一样。

为了解决这个问题，我们以 v8 为例，v8 在处理 sort 方法时，当目标数组长度小于 10 时，使用插入排序；反之，使用快速排序和插入排序的混合排序。

所以我们来看看 v8 的源码，因为是用 JavaScript 写的，大家也是可以看懂的。

源码地址：https://github.com/v8/v8/blob/master/src/js/array.js

为了简化篇幅，我们对 `[1, 2, 3]` 这个数组进行分析，数组长度为 3，此时采用的是插入排序。

插入排序的源码是：

```javascript
function InsertionSort(a, from, to) {
  for (let i = from+1; i<to; i++) {
    let element = a[i];
    for (let j=i-1; j>=from; j--) {
      let tmp = arr[j];
      let order = comparefn(tmp, element);
      if (order > 0) {
        a[j+1] = tmp;
      } else {
        break;
      }
    }
    a[j+1] = element;
  }
}
```

其原理在于将第一个元素视为有序序列，遍历数组，将之后的元素依次插入这个构建的有序序列中。

我们来个简单的示意图：

![](https://camo.githubusercontent.com/dd3f21a42c693891a11a5ec75e56d8be95c269e3399969c6aeec05cce2aa7d82/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f736f72742f696e73657274696f6e2e676966)



#### 具体分析

明白了插入排序的原理，我们来具体分析下 [1, 2, 3] 这个数组乱序的结果。

演示代码为：

```javascript
let values = [1,2,3];

values.sort(() => Math.random() - 0.5);
```

注意此时 sort 函数底层是使用插入排序实现，InsertionSort 函数的 from 的值为 0，to 的值为 3。

我们开始逐步分析乱序的过程：

因为插入排序视第一个元素为有序的，所以数组的外层循环从 `i = 1` 开始，a[i] 值为 2，此时内层循环遍历，比较 `compare(1, 2)`，因为 `Math.random() - 0.5` 的结果有 50% 的概率小于 0 ，有 50% 的概率大于 0，所以有 50% 的概率数组变成 [2, 1, 3]，50% 的结果不变，数组依然为 [1, 2, 3]。

假设依然是 [1, 2, 3]，我们再进行一次分析，接着遍历，`i = 2`，a[i] 的值为 3，此时内层循环遍历，比较 `compare(2, 3)`：

有 50% 的概率数组不变，依然是 `[1, 2, 3]`，然后遍历结束。

有 50% 的概率变成 [1, 3, 2]，因为还没有找到 3 正确的位置，所以还会进行遍历，所以在这 50% 的概率中又会进行一次比较，`compare(1, 3)`，有 50% 的概率不变，数组为 [1, 3, 2]，此时遍历结束，有 50% 的概率发生变化，数组变成 [3, 1, 2]。

综上，在 [1, 2, 3] 中，有 50% 的概率会变成 [1, 2, 3]，有 25% 的概率会变成 [1, 3, 2]，有 25% 的概率会变成 [3, 1, 2]。

另外一种情况 [2, 1, 3] 与之分析类似，我们将最终的结果汇总成一个表格：

| 数组          | i = 1           | i = 2         | 总计          |
| ------------- | --------------- | ------------- | ------------- |
| [1, 2, 3]     | 50% [1, 2, 3]   | 50% [1, 2, 3] | 25% [1, 2, 3] |
| 25% [1, 3, 2] | 12.5% [1, 3, 2] |               |               |
| 25% [3, 1, 2] | 12.5% [3, 1, 2] |               |               |
| 50% [2, 1, 3] | 50% [2, 1, 3]   | 25% [2, 1, 3] |               |
| 25% [2, 3, 1] | 12.5% [2, 3, 1] |               |               |
| 25% [3, 2, 1] | 12.5% [3, 2, 1] |               |               |

为了验证这个推算是否准确，我们写个 demo 测试一下：

```
var times = 100000;
var res = {};

for (var i = 0; i < times; i++) {
    
    var arr = [1, 2, 3];
    arr.sort(() => Math.random() - 0.5);
    
    var key = JSON.stringify(arr);
    res[key] ? res[key]++ :  res[key] = 1;
}

// 为了方便展示，转换成百分比
for (var key in res) {
    res[key] = res[key] / times * 100 + '%'
}

console.log(res)
```

这是一次随机的结果：

[![Math random 效果演示](https://camo.githubusercontent.com/cee66d8a65ef2c9ea96826083cf8af395c3d3e73e78f4428c3eaacaae5c51606/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f73687566666c652f6d61746852616e646f6d2e706e67)](https://camo.githubusercontent.com/cee66d8a65ef2c9ea96826083cf8af395c3d3e73e78f4428c3eaacaae5c51606/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f73687566666c652f6d61746852616e646f6d2e706e67)

我们会发现，乱序后，`3` 还在原位置(即 [1, 2, 3] 和 [2, 1, 3]) 的概率有 50% 呢。

所以根本原因在于什么呢？其实就在于在插入排序的算法中，当待排序元素跟有序元素进行比较时，一旦确定了位置，就不会再跟位置前面的有序元素进行比较，所以就乱序的不彻底。

那么如何实现真正的乱序呢？而这就要提到经典的 Fisher–Yates 算法。

#### Fisher-Yates

为什么叫 Fisher–Yates 呢？ 因为这个算法是由 Ronald Fisher 和 Frank Yates 首次提出的。

话不多说，我们直接看 JavaScript 的实现：

```javascript
function shuffle(a) {
  let j, x, i;
  for (i=a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i-1];
    a[i-1] = a[j];
    a[j] = x;
  }
  return a;
}
```

原理很简单，就是遍历数组元素，然后将当前元素与以后随机位置的元素进行交换，从代码中也可以看出，这样乱序的就会更加彻底。

如果利用 ES6，代码还可以简化成：

```javascript
function shuffle(a) {
  for (let i=a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i-1], a[j]] = [a[j], a[i-1]];
  }
  return a;
}
```



<<<<<<< HEAD

### JavaScript专题之偏函数

#### 定义

维基百科中对偏函数 (Partial application) 的定义为：

> In computer science, partial application(or partial function application) refers to the process of fixing a number of arguments to a function, producing another function of smaller arity.
>
> 翻译:
>
> 在计算机科学中，局部应用是指固定一个函数的一些参数，然后产生另一个更小元的函数。

什么是元? 元是指函数参数的个数,比如一个带有两个参数的函数被称为二元函数.

来个例子:

```javascript
function add(a, b) {
  return a + b;
}

//执行 add 函数，一次传入两个参数即可
add(1, 2)

//假设有一个 partial 函数可以做到局部应用
let addOne = partial(add, 1);
addOne(2); //3
```



#### 柯里化与局部应用

两者的区别:

* 柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。
* 局部应用则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数。

如果说两者有什么关系的话，引用 [functional-programming-jargon](https://github.com/hemanth/functional-programming-jargon#partial-application) 中的描述就是：

> Curried functions are automatically partially applied.



#### 重写partial

目的是模仿 underscore 写一个 partial 函数

也许你在想我们可以直接使用 bind 呐，举个例子：

```javascript
function add(a, b) {
    return a + b;
}

var addOne = add.bind(null, 1);

addOne(2) // 3
```



#### 第一版

```javascript
function partial(fn) {
  let args = [].slice.call(arguments, 1);
  return function() {
    let newArrs = args.concat([].slice.call(arguments));
    return fn.apply(this, newArrs);
  }
}
```



demo

```javascript
function add(a, b) {
  return a + b + this.value;
}

let addOne = partial(add, 1);

let value = 1;
let obj = {
  value: 2,
  addOne: addOne
}

obj.addOne(2); //???
//使用bind时, 结果是4
//使用partial时, 结果是5
```



#### 第二版 ????

然而正如 curry 函数可以使用占位符一样，我们希望 partial 函数也可以实现这个功能，我们再来写第二版：

```javascript
let _ = {};

function partial(fn) {
  let args = [].slice.call(arguments, 1);
  return function() {
    let position = 0,
        len = args.length;
    for (let i=0; i<len; i++) {
      args[i] = args[i] === _ ? arguments[position++] : args[i];
    }
    while(position < arguments.length) args.push(arguments[position++]);
    return fn.apply(this, args);
  }
}
```



### JavaScript专题之惰性函数

#### 需求

我们现在需要写一个 foo 函数，这个函数返回首次调用时的 Date 对象，注意是首次。



#### 解决方案

##### 1 普通方法

```javascript
let t;

function foo() {
  if (t) return t;
  t = new Date();
  return t;
}
```

问题有两个，一是污染了全局变量，二是每次调用 foo 的时候都需要进行一次判断。

##### 2 闭包

使用闭包避免污染全局变量

还是没有解决调用时都必须进行一次判断的问题。

```javascript
let foo = (function() {
  let t;
  return function() {
    if (t) return t;
    t = new Date();
    return t;
  }
})
```

##### 3. 函数对象

函数也是一种对象，利用这个特性，我们也可以解决这个问题。

依旧没有解决调用时都必须进行一次判断的问题。

```javascript
function foo() {
  if (foo.t) return foo.t;
  foo.t = new Date();
  return foo.t;
}
```



##### 4. 惰性函数

惰性函数就是解决每次都要进行判断的这个问题，解决原理很简单，重写函数。

```javascript
let foo = function() {
  let t = new Date();
  foo = function() {
    return t;
  };
  
  return foo();
}
```



#### 应用

DOM 事件添加中，为了兼容现代浏览器和 IE 浏览器，我们需要对浏览器环境进行一次判断：

```javascript
//简化写法

function addEvent(type, e1, fn) {
  if (window.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (window.attachEvent) {
    el.attachEvent('on' + type, fn);
  }
}
```

问题在于我们每当使用一次 addEvent 时都会进行一次判断。

利用惰性函数，我们可以这样做：

：

```
function addEvent (type, el, fn) {
    if (window.addEventListener) {
        addEvent = function (type, el, fn) {
            el.addEventListener(type, fn, false);
        }
    }
    else if(window.attachEvent){
        addEvent = function (type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }
}
```

当然我们也可以使用闭包的形式：

```
var addEvent = (function(){
    if (window.addEventListener) {
        return function (type, el, fn) {
            el.addEventListener(type, fn, false);
        }
    }
    else if(window.attachEvent){
        return function (type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }
})();
```

当我们每次都需要进行条件判断，其实只需要判断一次，接下来的使用方式都不会发生改变的时候，想想是否可以考虑使用惰性函数。

重要参考

[Lazy Function Definition Pattern](http://peter.michaux.ca/articles/lazy-function-definition-pattern)





### JavaScript专题之解读 v8 排序源码

> https://github.com/mqyqingfeng/Blog/issues/52)




### JavaScript专题之如何判断两个参数相等

#### 前言

> https://github.com/mqyqingfeng/Blog/issues/41





## JavaScript underscore系列 (未开始)

### 来源:

> [mqyqingfeng/Blog: 冴羽写博客的地方，预计写四个系列：JavaScript深入系列、JavaScript专题系列、ES6系列、React系列。 (github.com)](https://github.com/mqyqingfeng/Blog)







## 防抖函数

> https://github.com/mqyqingfeng/Blog/issues/22
>
> [Implementing Debounce in Javascript | by Eldar Jahijagic | CodeX | Jun, 2022 | Medium](https://medium.com/codex/implementing-debounce-in-javascript-cf185cd2084b)



### 了解

#### Mechanical Bounce

Bounce is a property of mechanical buttons and switches, which when pressed introduce electrical noise. This noise obscures the input signal, making the system read it incorrectly.

![](https://miro.medium.com/max/1400/1*9zWmigqVxVd7t6ofj2waQA.png)



#### software Bounce

There is obviously the sofeware counterpart of the bounce issue and solutions for it.Some relate to the *software side* of microcontrollers, as the issue can be addressed in that approach as well*.*



#### what does input signal bounce occur

The most commons places that you may experience this are:

- User input fields
- Buttons and switches
- Reading message queus

In our case at hand, the signal itself will be produced by the user, for example on an input field that has a change listener.

Components such as these can either experience noise, or a large amount of expected input, or they can simply be abused by the end-user.

Let’s consider the following example:

```javascript
#html
<input onKeyUp="inputChanged()" type="text" />
  
#JS
function inputChanged() {
  console.log('Input event detected')
}
```



This is one of the usual cases when you want to listen to user input changes

*Notice how* `*onChange*` *isn’t used, as it emits an event only when* `*focus*` *shifts from the input field.*

In this sense, `onChange` is mitigating the issue on its own. However, it might not be that useful in cases when you want to react in real-time.

The `onKeyUp` listener emits an event, whenever a user changes the input value. This is often useful for e.g. a real-time search feature.

The issue here is that typing something into a field `onKeyUp` will produce a lot of events in a short time period rather.

![](https://miro.medium.com/max/1044/1*0qM3-JkwhMVHkSx1Nti_Og.gif)





If you are filtering some results, the UI will possibly get stuttery and your performance will be affected.



we want to implement a timeout between two event signals, a time period which if elapses, triggers our batch read. ??

> 我们想在两个事件信号之间执行一个超时, 如果经过这个时间段, 触发我们的批处理读取.



#### solution

With the above said, illustrating debounce, events and the timeout period between two receiving event signals would look like the following.

![](https://miro.medium.com/max/1400/1*RfsnGce8LCoIjO6pVACxKA.png)

For a debounce method, we need a timeout or threshold time, and we want to **trigger an event only once this expires**.





An easy way how to implement a debounce method is by making use of `setTimeout` as illustrated in the following snippet:

```javascript
# HTML
<input id="input-field" onKeyUp="inputChanged()" type="text"/>
# JS
const inputField = document.getElementById("input-field");
function getResult() {
   console.log("Input event detected.");
   console.log(inputField.value);
   // Do something with the input
}
const debounce = {
   isWaiting: false,
   
   submit: function (func) {
      if (!this.isWaiting) {
        this.isWaiting = true;
         
         setTimeout(() => {
             func.apply();
             this.isWaiting = false;
         }, 1000);
      }
   }
}
function inputChanged() {
 debounce.submit(getResult);
}
```



A more sophisticated approach requires us to track the time elapsed between events, as we want to trigger a function only once that period *expires*.

A vanilla Javascript approach looks like the following:

```javascript
# HTML
<input id="input-field" onKeyUp="inputChanged()" type="text"/>
# JS
const inputField = document.getElementById("input-field");
function getResult() {
   console.log("Input event detected.");
   console.log(inputField.value);
   // Do something with the input
}
const debounce = {
   timerId: 0,
   timeout: 1000,
   
   submit: function (func) {
       this.cancel();
       
       this.timerId = setTimeout(() => {
           func.apply(this);
       }, this.timeout);
   },
   
   cancel: function() {
       clearTimeout(this.timerId);
   }
}
function inputChanged() {
 debounce.submit(getResult);
}
```





### 前言

在前端开发中会遇到一些频繁的事件触发，比如：

1. window 的 resize、scroll
2. mousedown、mousemove
3. keyup、keydown
   ……

如果是复杂的回调函数或是 ajax 请求呢? 假设 1 秒触发了 60 次，每个回调就必须在 1000 / 60 = 16.67ms 内完成，否则就会有卡顿出现。

来个例子:

index.html文件:

```html
<!doctype html>
<html>
	<head>
    <meta charset='utf-8'>
    <meta http-equiv='x-ua-compatible' content='IE=edge, chrome=1'>
    <title>debounce</title>
    <style>
      #container{
        width:100%; height:200px;line-height:200px;text-align:center;
      }
    </style>
  </head>
  <body>
    <div id='container'></div>
    <script src='debounce.js'></script>
  </body>
</html>
```



JS文件:

```javascript
let count = 1;
let container = document.getElementById('container');

function getUserAction() {
  container.innerHTML = count++;
}

container.onmousemove = getUserAction;
```





为了解决这个问题，一般有两种解决方案：

1. debounce 防抖
2. throttle 节流

**防抖原理**

* 尽管触发事件，但是我一定在事件<span style="color:red">触发 n 秒后才执行</span>;

* 如果你在一个事件触发的 n 秒内又触发了这个事件，以新的事件的时间为准，n 秒后才执行.
* 就是要等你触发完事件 n 秒内不再触发事件


普通版本
```js
function debounce(fn, delay) {
	let timer = null
	return function(...args) {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}

		timer = setTimeout(() => {
			fn.apply(this, args)
			clearTimeout(timer)
			timer = null
		}, delay)
	}
}
```

### 第一版

```javascript
function debounce (func, wait) {
  let timeId;
  return function () {
    clearTimeout(timeId);
    timeId = setTimeout(func, wait);
  }
}

//使用闭包的原因?
//1.需要获取函数调用产生的标志,如果不使用闭包,调用标志应该声明在全局中,变量污染问题
//2.
```

如果我们要使用它，以最一开始的例子为例：

```
container.onmousemove = debounce(getUserAction, 1000);
```

现在随你怎么移动，反正你移动完 1000ms 内不再触发，我才执行事件。从 165 次降低成了 1 次!.看看使用效果：

![1](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/1.13oxbw7r57ng.gif)



**存在的问题**

> this指向问题

如果我们在 `getUserAction` 函数中 `console.log(this)`，在不使用 `debounce` 函数的时候，`this` 的值为：

```html
<div id="container"></div>
```

如果使用我们的 debounce 函数，`getUserAction`函数中的this 就会指向 Window 对象,因为setTimeout中的函数是在全局环境中执行的.

所以我们需要将 this 指向正确的对象。

debounce函数中的this指向的是window

debounce内的闭包函数中的this指向的是绑定的DOM节点

```javascript
let count = 1,
    container = document.getElementById('container');

function getUserAction() {
  container.innerHTML = count++;
}

container.onmousemove = getUserAction;

//添加防抖函数后
container.onmousemove = debounce(getUserAction, 1000);
```



但如果我们使用debounce函数,this就会指向Window对象.



### 第二版(修复this问题)

```javascript
function debounce(func, wait) {
  let timeId;
  // 这个层级中的this指向window 因为在JS环境中直接调用
  return function() {
    //这个执行上下文中的this指向DOM节点
    let context = this;
    clearTimeout(timeId);
    timeId = setTimeout(function() { func.call(context) }, wait);
  }
}
```

**存在的问题**

JavaScript 在事件处理函数中会提供事件对象 event，我们修改下 getUserAction 函数：

```javascript
function getUserAction(e) {
  console.log(e);
  container.innerHTML = count++;
}
```

如果我们不使用debounce函数, 这里会打印MouseEvent对象, 如图所示:

![](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/image.b4rj2g2gg3c.webp)



但是,我们在debounce函数中,却指回打印undefined

### 第三版(修复事件对象传递)

```javascript
function debounce(func, wait) {
  let timeId;
  return function() {
    let context = this;
    let args = arguments;
    clearTimeout(timeId);
    timeId = setTimeout(function() {func.apply(context, args)}, wait);
  }
}
```



### 第四版(立即执行)

新增需求: 

不希望非要等到事件停止触发后才执行，我希望立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。

通过加一个immediate参数来判断是否是立即执行.

```javascript
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this,
        args = arguments;
    
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      console.log('timeId', timeId); //第一次为undefined 以后均为null
      //如果已经执行, 不再执行
      let callNow = !timeout;
      timeout = setTimeout(function() { timeout = null }, wait);
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function() {func.apply(context, args)}, wait);
    }
  }
}
```

这个函数没有第一时间理解. onmousemove事件绑定的函数是debounce内返回的那个函数.

这个函数需要常回来看看 ,理解的并不好.

效果如图:

![68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f6465626f756e63652f6465626f756e63652d342e676966](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f6465626f756e63652f6465626f756e63652d342e676966.2lfn802pm700.gif)

### 第五版(返回值) ????

此时注意一点，就是getUserAction 函数可能是有返回值的，所以我们也要返回函数的执行结果，但是当 immediate 为 false 的时候，<span style="text-decoration: underline wavy">因为使用了 setTimeout ，我们将 func.apply(context, args) 的返回值赋给变量，最后再 return 的时候，值将会一直是 undefined</span>，所以我们只在 immediate 为 true 的时候返回函数的执行结果。

```javascript
function debounce(func, wait, immeidate) {
  let timeout, result;
  return function() {
    let context = this,
        args = arguments;
    
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(function() { timeout = null }, wait);
      if (callNow) result = func.apply(context, args);
    } else {
      timeout = setTimeout(function() { func.apply(context, args)}, wait);
    }
    return result;
  }
}
```

Note:

setTimeout(fn, wait)定时器中函数的返回值问题,需要找资料加深理解.



### 第六版(取消防抖立即触发)

最后我们再思考一个小需求，我希望能取消 debounce 函数，比如说我 debounce 的时间间隔是 10 秒钟，immediate 为 true，这样的话，我只有等 10 秒后才能重新触发事件，现在我希望有一个按钮，点击后，取消防抖，这样我再去触发，就可以又立刻执行.

```javascript
function debounce(func, wait, immediate) {
  let timeout, result;
  let debounced = function() {
    let context = this,
        args = arguments;
    
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(function() {
        timeout = null;
      }, wait)
      if (callNow) result = func.apply(context, args);
    } else {
      timeout = setTimeout(function() {func.apply(context, args)}, wait);
    }
    return result;
  }
  deboundced.cancel = function() {
    cleatTimeout(timeout);
    timeout = null;
  }
  return debounced;
}
```



## 节流函数

> [JavaScript专题之跟着 underscore 学节流 · Issue #26 · mqyqingfeng/Blog (github.com)](https://github.com/mqyqingfeng/Blog/issues/26)



### 原因

同防抖函数中的原因: 

高频事件需要在一定时间内处理,如果函数处理的时间大于平均每次的时间,那么就会造成卡顿.

### 原理

如果你持续触发事件，<span style="color:red">每隔一段时间只执行一次事件</span>。

根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。



### 时间戳方案

使用时间戳，当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。

```javascript
//第一版

function throttle(func, wait) {
  let context, args;
  let previous = 0;
  return function() {
    let now = +new Date();
    context = this;
    args = arguments;
    
   	if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    } 
  }
}
```

例子依然是用讲 debounce 中的例子，如果你要使用：

```javascript
container.onmousemove = throttle(getUserAction, 1000);
```

效果如图:

![tt](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/tt.k0kq8gr42u8.gif)



### 定时器方案

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。

```javascript
function throttle(func, wait) {
  let timeout,
      previous = 0;
  
  return function() {
    context = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(function() {
        timeout = null;
        func.apply(context, args)
      }, wait)
    }
  }
}
```

为了让效果更加明显，我们设置 wait 的时间为 3s，效果演示如下：

![ttt](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/ttt.4dx160w341e0.gif)

我们可以看到：当鼠标移入的时候，事件不会立刻执行，晃了 3s 后终于执行了一次，此后每 3s 执行一次，当数字显示为 3 的时候，立刻移出鼠标，相当于大约 9.2s 的时候停止触发，但是依然会在第 12s 的时候执行一次事件。



所以比较两个方法：

1. 第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
2. 第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件





### 时间戳+定时器方案 ????

功能要求: 鼠标移入能立刻执行，停止触发的时候还能再执行一次.

```javascript
function throttle(func, wait) {
  let timeout, context, args, result;
  let previous = 0;
  
  let later = function() {
    previous = +new Date();
    timeout = null;
    func.apply(context, args)
  };
  
  let throttled = function() {
    let now = +new Date();
    //下次触发 func 剩余的时间
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    
    //如果没有剩余时间了或者你改了系统时间
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
  };
  
  return throttled;
}
```

效果图如下:

鼠标移入，事件立刻执行，晃了 3s，事件再一次执行，当数字变成 3 的时候，也就是 6s 后，我们立刻移出鼠标，停止触发事件，9s 的时候，依然会再执行一次事件。

![68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f7468726f74746c652f7468726f74746c65332e676966](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f7468726f74746c652f7468726f74746c65332e676966.4uxh87j1z9q0.gif)

### 优化 ????

我有时也希望无头有尾，或者有头无尾，这个咋办？

那我们设置个 options 作为第三个参数，然后根据传的值判断到底哪种效果，我们约定:

leading：false 表示禁用第一次执行
trailing: false 表示禁用停止触发的回调

```javascript
// 第四版
function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function() {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
    };
    return throttled;
}
```



### 取消

在 debounce 的实现中，我们加了一个 cancel 方法，throttle 我们也加个 cancel 方法：

```javascript
// 第五版 非完整代码，完整代码请查看最后的演示代码链接
...
throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
}
...
```



### 注意

我们要注意 underscore 的实现中有这样一个问题：

那就是 `leading：false` 和 `trailing: false` 不能同时设置。

如果同时设置的话，比如当你将鼠标移出的时候，因为 trailing 设置为 false，停止触发的时候不会设置定时器，所以只要再过了设置的时间，再移入的话，就会立刻执行，就违反了 leading: false，bug 就出来了，所以，这个 throttle 只有三种用法：

```javascript
container.onmousemove = throttle(getUserAction, 1000);
container.onmousemove = throttle(getUserAction, 1000, {
    leading: false
});
container.onmousemove = throttle(getUserAction, 1000, {
    trailing: false
});
```



### 其他方案

```javascript
function throttle(fn, wait) {
  let timeId
  let prevTime
  return function(...args) {
    const currentTime = +Date.now()
    const context = this
    if (!prevTime) prevTime = currentTime
    if (timeId) clearTimeout(timeId)
    
    if (currentTime - prevTime > delay) {
      fn.apply(context, args)
      prevTime = currentTime
      clearTimeout(timeId)
    }
    
    timeId = setTimeout(function() {
      prevTime = +Date.now()
      timeId = null
      fn.apply(context, args)
    }, delay)
  }
}
```





ES5

### 严格模式

> 'use.strict'

#### 位置:

##### 1.全局

```js
- 代码块开始
'use strict'
```



##### 2.函数内部

```js
- 函数大括号之后开始的位置
function main(){
	'use strict'
}
```



#### 严格模式特性

1.不允许使用未声明的变量

2.函数内部的this不指向window

3.eval作用域

4.对象不能有重复的属性

5.严格模式下,函数不允许有同名的形参

6.新增了一些保留字

```js
-eval 是一个函数,接受字符串参数,会对字符串进行JS语法解析并运行

eval('var a=100; var b=200; console.log(a)');
console.log(a, b);//100   100 200  注意打印顺序,先打印了eval里的值

新增保留字:private protected implements
```



### Object.create

> 作用是创建一个新的对象,使用现有对象来提供新创建对象的\_\_proto\__

#### Object.create(prototype, [descriptors])

Object.create 方法可以以指定对象为原型创建新的对象，同时可以为新的对象设置属性, 并对属性进行描述

* value : 指定值
* writable : 标识当前属性值是否是可修改的, 默认为 false
* configurable：标识当前属性是否可以被删除 默认为 false
* enumerable：标识当前属性是否能用for in 枚举 默认为 false
* get:   当获取当前属性时的回调函数
* set:   当设置当前属性时,会自动执行, 并将返回结果, 作为该属性的值



#### 创建对象

```js
//创建对象的3种方式: 字面量{},new Object(), Object()

var car = {
	name: '汽车',
    drive: function(){console.log('可以行使');}
}

var passat = Object.create(car, {
    brand:{
        //属性值
        value: '帕萨特',
        writable: true, //该属性是否可以修改
        configurable: true, //该属性是否可以删除
        enumerable: true  //该属性是否可以枚举 是否可以使用for..in遍历
    },
    color:{
         value: '黑色',
         enumerable: true
    }
       
})
```



#### 通过getter和setter控制属性

```js
//getter作用:动态属性设置, getter方法 无需手动调用,当获取对象的该属性时,会自动执行,将返回结果作为该属性的值.
//getter和setter方法中  , this是指向新对象的
//setter 当修改对象的该属性的时候,会自动执行 例如: passat.price = 2500;
//getter和setter不能与value属性共存


var car = {
	name: '汽车',
    drive: function(){console.log('可以行使');}
}

var passat = Object.create(car, {
  brand:{
    //属性值
    value: '帕萨特',
    writable: true, //该属性是否可以修改
    configurable: true, //该属性是否可以删除
    enumerable: true  //该属性是否可以枚举
  },
  color:{},

  price:{//获取price的时候,方法会自动执行,返回值会作为属性值.
    get: function(){return this.jiage;},
    set: function(value){//参数value就是修改的时候赋的值.
      this.jiage = value; //给对象新添加了一个属性,方便get方法使用.
      //能否使用this.price,不可以,会出现无限递归
    }
  }    

});

passat.price = 20000;
console.log(passat);
```







### Object.defineProperties

> 为对象添加或修改属性
>
> 此方法执行在一个对象上定义新的属性或修改现有属性,并返回该对象.





## ES6

### let

```HTML
let声明变量的 
标识符规范:1.字母,数字,下划线,$,不能以数字开头,区分大小写;2.不能是系统保留字关键字;3.使用驼峰命名法(大小)

let声明的特点:
1.不允许重复声明
2.块级作用域
3.变量提升(临时性死区)
4.不影响作用域链
```






### const

> 用来声明一个常量(值不变)  constable variable
>
> 一旦声明,就必须立即初始化, 常量的值就不能改变.
>
> 声明变量不提升,和let一样.



> `const`实际上保证的，并不是变量的值不得改动，而是变量指向的那个==内存地址==所保存的数据不得改动。对于简单类型的数据（**数值、字符串、布尔值**），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（**主要是对象和数组**），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const`只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。
>
> https://www.bookstack.cn/read/es6-3rd/spilt.3.docs-let.md



```html
- 声明特点:
1.声明的时候一定要赋初始值//不赋值报错
2.常量的名称一般为全大写 //潜规则
3.不允许修改常量的值
4.不允许重复声明
5.块级作用域: 只在声明所在的块级作用域内有效.
6.关于数组和对象元素的修改
 改变常量的地址(直接赋新值)就会报错,改数组和对象的值不会报错

const TEAM = ['a', 'b', 'c', 'd'];
TEAM.push('e');
console.log(TEAM);//没有报错, 打印a-e的值

const FAKER = {name: 'aaa'};
FAKER.name = 'bbb';//没有报错,只是更改属性,没有改对象的地址


- 应用场景: 声明对象类型使用const,非对象类型声明使用let// 引用类型, 基本数据类型
 
```

```js
{
    const ABC = 100;
    console.log(ABC);//100
}
console.log(ABC);//报错 is not defined . 如果常量为A,打印的是window 待补充


if (true) {
  console.log(MAX); // ReferenceError
  const MAX = 5;
}
//const声明的常量也是不提升,同样存在暂时性死区,只能在声明的位置后面使用.
```








### 字符串的迭代与解构

> 字符串原型上暴露了一个@@iterator方法,表示可以迭代字符串的每个字符.
>
> 字符串通过解构转成类似数组的对象
>
> 字符串可通过数组来解构赋值.
>
> 有length属性.

```js
let message = 'abc';
let stringIterator=message[Symbol.iterator]();

console.log(stringIterator.next()); //{value:'a', done:false}
console.log(stringIterator.next());//{value:'b', done:false}
console.log(stringIterator.next());//{value:'c', done:false}
console.log(stringIterator.next());//{value:undefined, done:true}

在for-of循环中可以通过这个迭代器按序访问每个字符:
for(const i of 'abc'){
    console.log(i);
}
//log:
//a
//b
//c

有了这个迭代器后,字符串可以通过解构操作符来解构了.例如,可以更方便的把字符串分隔为字符数组:
let message='abcde';
console.log([...message]);//['a', 'b', 'c', 'd', 'e']


- 字符串也可以解构赋值,这是因为此时，字符串被转换成了一个类似数组的对象。
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值。
let{length: len}='hello';
len//5
```





### 变量的解构赋值

> 解构赋值: ES6允许按照一定模式从数组和对象中提取属性/值, 对变量进行赋值, 这被称为解构赋值[Destructuring].
>
> 
>
> 1.数组的解构赋值需要按顺序进行赋值
>
> 2.对象的解构赋值则是通过对象属性进行赋值, 不需要按照顺序进行, 无法匹配的则为undefined.
>
> 3.如果**对象**解构赋值中**,属性名和变量名不同,则不能简写**. 例如 let{a:a}={a:1}可简写,let{a:b}={a:1}不能简写.



> 解构赋值语法是一种JavaScript表达式.通过解构赋值,可以将==属性/值==从==对象/数组==中取出, 赋值给其他变量.



#### 数组解构赋值

```js
- 数组的解构赋值

const arr = ['a', 'b', 'c', 'd'];
let [aa, bb, cc, dd] = arr;
let [aa, bb, cc, dd] = ['a', 'b', 'c', 'd'];//一一对应的关系
let [,,,d]=arr;
console.log(aa);//a
console.log(bb);//b
console.log(cc);//c
console.log(dd);//d
console.log(d); //d

- 默认值. 为了防止从数组中取出一个值为undefined的对象,可以在表达式左边的数组中为任意对象预设默认值.
var a, b;
[a=5, b=7]=[1];
console.log(a);//1
console.log(b);//7

- 案例//配合展开运算符下的解构后依然是一个数组
let [a, ...arr]=[1,2,3,4]//log:a=1, arr=[2,3,4]
let [x, y, ...z]=['a'] //log: x='a', y=undefined, z=[]
let[a, [b], d]=[1, [2,3], 4];//log:a=1, b=2, d=4
let[a,b]=[1,2,3];//log: a=1, b=2

ES6内部使用严格相等运算符, 判断一个位置是否有值. 解构赋值可以使用默认值,只有当数组成员严格等于undefined时,默认值才有效
let[a,b='b']=['a', undefined]; //log: a='a', b='b'
let[a=1]=[null]//log:  a=null null不严格等于undefined
let[a=1]=[]//log: a=1

如果解构不成功,变量的值就等于undefined
let[foo]=[];
let[bar, foo]=[];  //bar和foo都是undefined
以上两种情况都属于解构不成功,foo的值都等于undefined

如果默认值是一个表达式,那么这个表达式是惰性求值,即只有在用到的时候,才会求值. //惰性求值
function f(){
    console.log('aaa');
}
let[x=f()]=[1];//log: x=1
let[y=f()]=[];
y;//'aaa'


默认值可以引用解构赋值的其他变量,但该变量必须已经声明.
let[a=1, b=a]=[];//log: b:1
let[x=1, y=x]=[2];//log: x=2, y=2
let[x=1, y=x]=[1,2];//log:x=1, y=2
let[a=b, b=1]=[];//报错: b is not defined
```





#### 对象解构赋值

```js
对象和解构和数组的解构有一个重要的不同. 数组的元素是按次序排列的,变量的取值由它的位置决定;而对象的属性没有次序,变量必须与属性名同名,才能取到正确的值.
```

```js
# let {属性名:变量名}={属性名:属性值,属性名:属性值}

- 对象解构赋值中,变量不像数组有位置要求
let{bar, foo}={foo:'aaa', bar:'bbb'};
foo//'aaa'
bar//'bbb'

- 变量没有对应的同名属性,导致取不到值,解构失败. 最后等于undefined
let{foo}={bar:'bar'};
foo//undefined

- 把对象的方法赋值到变量上
let{log, sin, cos}=Math;
const{log}=console;
log('hello');//hello

- 解构赋值变量名与属性名不同,必须的写法
let{属性名:变量名}={属性名:属性值,属性名:属性值}
let{foo:baz}={foo:'aaa', bar:'bbb'};
baz//'aaa'
foo//foo is not defined

let obj={first:'hello', last:'world'};
let{first:f, last:l}=obj;
f//'hello'
l//'world'

这实际上说明,对象的解构赋值实际上下面形式的简写.对象解构赋值的内部机制,是先找到同名属性,再赋给对应的变量.
let{foo:foo, bar:bar}={foo:'aaa', bar:'bbb'};

- 解构嵌套解构的对象
let obj={
    p:[
        'hello',
        {y:'world'}
    ]
};
let{p:[x,{y}]}=obj;
p//p is not defined
x//hello
y//world
 p也要作为变量赋值
 let{p,p:[x,{y}]}=obj;

const node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};
let { loc, loc: { start }, loc: { start: { line }} } = node;
line//1
loc//Object{start:Object}
start//Object{line:1, column:5}
上面代码有三次解构赋值,分别是对loc,start,line三个属性的解构赋值. 注意,最后一次对line属性的解构赋值之中，只有line是变量，loc和start都是模式，不是变量。

let obj={};
let arr=[];
({foo:obj.prop, bar:arr[0]}={foo:123, bar:true});
obj//{prop:123}
arr//[true]

- 解构模式是嵌套的对象,且子对象所在的父属性不存在,将报错.
let{foo:{bar}}={baz:'baz'};
等号左边对象的foo属性，对应一个子对象。该子对象的bar属性，解构时会报错。原因很简单，因为foo这时等于undefined，再取子属性就会报错。

- 对象的解构赋值可以取到继承的属性
const obj1={};
const obj2={foo:'bar'};
Object.setPrototypeOf(obj1, obj2);

const {foo}=obj1;
foo//'bar'
对象obj1的原型对象是obj2。foo属性不是obj1自身的属性，而是继承自obj2的属性，解构赋值可以取到这个属性。

- 默认值
var {x = 3} = {};
x // 3
var {x, y = 5} = {x: 1};
x // 1
y // 5
var {x: y = 3} = {};
y // 3

var {x: y = 3} = {x: 5};
y // 5
var { message: msg = 'Something went wrong' } = {};
msg // "Something went wrong"

- 默认值生效条件:对象的属性值严格(===)等于undefined
var {x = 3} = {x: undefined};
x // 3
var {x = 3} = {x: null};
x // null

注意点:
1.如果要将一个已经声明的变量用于解构赋值，必须非常小心。
// 错误的写法
let x;
{x} = {x: 1};
// SyntaxError: syntax error
上面代码的写法会报错，因为 JavaScript 引擎会将{x}理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。
// 正确的写法
let x;
({x} = {x: 1});

2.解构赋值允许等号坐标的模式之中, 不放置任何变量名.
({} = [true, false]);
({} = 'abc');
({} = []);
上面的表达式虽然毫无意义，但是语法是合法的，可以执行。

3.由于数组本质是特殊的对象,因此可以对数组进行对象属性的解构.
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3
```



```js
- 对象的解构赋值
let redian = {
    name: 'targetName',
    chaozuo: function(){console.log('print chaozuo');},
    wushu: function(){console.log('print wushu');}
}

//提取内部函数的原始方法
let chaozuo = redian.chaozuo;
let wushu = redian.wushu;

//从对象中解构方法,使用频率较高. 变量名称需和相应属性或方法名称一致
let{chaozuo, wushu}=redian;
chaozuo();
wushu();
===========================================================

let guodegang = {
    name: '郭德纲',
    tags: ['郭a', '郭b', '郭c'],
    xiangsheng: function(){console.log('说相声')}
}

let {name, tags, xiangsheng};
let {name, tags:[a,b,c], xiangsheng} = guodegang;//此时tags不可用,只能用数组里的变量
let {tags:[a,b,c], name} = guodegang; //赋值对象里的变量没有顺序要求.
let {tags:[a,b,c], xiangsheng} = guodegang;
	console.log(xiangsheng());

```



#### 数组和对象解构赋值的其他例子

```js
- 数组的解构赋值
let [a,,c]=[1,2,3];
console.log(a);//1
console.log(c);//3
-对象的解构赋值
let{a,c}={a:1,b:2,c:3};
console.log(a);//1
console.log(c);//3

let{a,,c}={a:1,b:2,c:3};
console.log(a);//Uncaught SyntaxError: Unexpected token ','

let [a,b]=[1];
console.log(a);//1
console.log(b);//undefined


- 对象的解构赋值
let {a,b,c}={b:1, a:2};
console.log(a);//2
console.log(b);//1
console.log(c);//undefined

以上的完整写法:
let {a:a, b:b, c:c}={b:1, a:2};
console.log(a);//2
console.log(b);//1
console.log(c);//undefined
//因为等式左边属性名称和变量名相同,因此可以直接写成let{a,b,c}={b:1, a:2};
//如果属性名和变量名不同,则不能简写.
let {a:b}={a:1};
console.log(b);//1  b为变量名,a为属性名,不能直接输出a


- 对象解构赋值的应用
const {log} = console;
log('hello');//hello, 等同于console.log()
```



#### 数值和布尔值的解构赋值

```
解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。

let {toString: s} = 123;
s === Number.prototype.toString // true
let {toString: s} = true;
s === Boolean.prototype.toString // true
上面代码中，数值和布尔值的包装对象都有toString属性，因此变量s都能取到值。

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

 复制代码
let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```



#### 函数参数的解构赋值 ?????

```
函数参数的解构赋值
函数的参数也可以使用解构赋值。
参数变量是默认声明的,所以不能使用let或const再次声明.
使用参数默认值时,函数不能有同名参数.
参数默认值是不传值的,而是每次都重新计算默认值表达式的值.也就是说,参数默认值是惰性求值的.

let x = 99;
function foo(p = x + 1) {
  console.log(p);
}
foo() // 100
x = 100;
foo() // 101
参数p的默认值是x + 1。这时，每次调用函数foo，都会重新计算x + 1，而不是默认p等于 100。




function add([x, y]){
  return x + y;
}
add([1, 2]); // 3
上面代码中，函数add的参数表面上是一个数组，但在传入参数的那一刻，数组参数就被解构成变量x和y。对于函数内部的代码来说，它们能感受到的参数就是x和y。

下面是另一个例子。

[[1, 2], [3, 4]].map(([a, b]) => a + b);
// [ 3, 7 ]
函数参数的解构也可以使用默认值。

function move({x = 0, y = 0} = {}) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
上面代码中，函数move的参数是一个对象，通过对这个对象进行解构，得到变量x和y的值。如果解构失败，x和y等于默认值。

注意，下面的写法会得到不一样的结果。

function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
上面代码是为函数move的参数指定默认值，而不是为变量x和y指定默认值，所以会得到与前一种写法不同的结果。

undefined就会触发函数参数的默认值。

 复制代码
[1, undefined, 3].map((x = 'yes') => x);
// [ 1, 'yes', 3 ]



```







### 模板字符串(template string)

> 字符串声明的3种方式, 单引号 双引号 反引号

```js
1.使用回车换行

2.变量,表达式拼接
${变量}
${表达式}//加减乘除,三元运算符等等

let wangning = '王宁';
// let str = '几年前'+wangning+'离开了开心麻花';
// let str = `几年前${wangning}离开了开心麻花`;
let str = `几年前${ '王' + '宁' }离开了开心麻花`;
console.log(str);


- 使用场景
拼接
保存HTML,换行字符串...
```





### 对象的简化写法

```js
- 使用变量替换属性名和属性值
- 对象方法的简化 省略冒号和function或者使用变量代替

let obj={
    name: 'abc',
    change: function(){console.log('example')},
    improve: function(){console.log('example')}
}

简化:

let name ='abc';
let change = function(){console.log('example')};

let obj = {
    //变量的简化 name:name
    name,
    change,
    //方法的简化 省略function和冒号
    improve(){console.log('example')}
}

- ${}中可以放入任意JS表达式,可以进行运算,以及引用对象属性,调用函数
- 如果需要引用模板字符串本身,在需要时执行,可以写成函数
let func=(name)=>`hello ${name}`
func('jack')// 'hello jack'

```





### 箭头函数

> ES6允许使用箭头(=>)定义函数



```HTML
1.声明格式
let fn=(形参)=>{代码体}


2.函数调用
fn(实参)


3.特性
- this是静态的.始终指向外层作用域下this的值.//箭头函数的外部还是箭头,那直接向上寻找.无论如何更改例如call,apply,bind等.
- 不能作为构造函数使用 //new fn()报错
- 不能使用arguments获取实参 //
	let main = ()=>{console.log(arguments)}; main(1,2,3) //报错 arguments未定义
- 箭头函数简写
 - 不写小括号: 当形参有且只有一个的时候
 - 不写大括号: 当代码体只有一条语句,并且语句的执行结果为函数返回值(不写大括号,return也不能写)

4.总结
- 适合箭头函数场景: 与this无关的回调设置.定时器,数组方法回调//filter
- 不适合箭头函数场景: 与this有关的回调设置. DOM事件的回调, 对象里的方法
```







#### 箭头函数案例

```html 
- 需求1:点击div 2s后颜色变成粉色

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>箭头函数实践</title>
    <style>
        div {
            width: 200px;
            height: 200px;
            background: #58a;
        }
    </style>
</head>
<body>
    <div id="ad"></div>
    <script>
        //需求-1  点击 div 2s 后颜色变成「粉色」
       let obj = document.querySelector('div');
       //es5实现,变量传递this
       obj.onclick = function(){
           let self = this;
           setTimeout(function(){
               self.style.background='pink';
           }, 2000)
       }
       //es6实现,箭头函数
       //箭头函数中的this取决于外层作用域中的this指向
       obj.onclick = function(){
           setTimeout(()=>{
               this.style.background='pink';
           }, 2000)
       }

       
    </script>
</body>

</html>
```



```js
- 需求2:从数组中返回偶数的元素

数组filter方法
let arr = [1,2,3,99,55,6,7,8,8,8,6,5,4,43,3];
let result = arr.filter(
    function(item){
        if(item % 2 === 0){
            return true;
        }else{
            return false;
        }
    }
)

        
let result = arr.filter(item=>item%2===0);
console.log(result);
```







### 参数的默认值

```js
ES6允许给函数参数赋值初始值

1. 参数直接设置默认值,具有默认值的参数,位置一般要靠后(潜规则)
function add(a,b,c=9){
     console.log(a+b+c);
 }
add(1,3);//13 1+3+9

function add(a,b=9,c){
     console.log(a+b+c);
 }
add(1,3);//NaN  

2. 与解构赋值结合使用,解构赋值的形式先后顺序不受影响

- 原始写法:
 function connect(options){
     console.log(options.host);
     console.log(options.port);
     console.log(options.name);
     console.log(options.pass);
 }
connect({
    host: '1.1.1.1',
    port: 27017,
    name: 'root',
    pass: 'admin'
});

- 与解构赋值结合使用, 解构赋值的顺序先后不影响.对应的是键位:
 function connect({host, port, name, pass='admin'}){ //赋值是等于号
     console.log(host);
     console.log(port);
     console.log(name);
     console.log(pass);
 }
connect({
    host: '127.0.0.1',
    port: 27017,
    name: 'root',
    //pass: 'admin' 使用函数的默认值来代替
});




```





### rest参数

> 剩余参数. 允许将一个不定数量的参数表示为一个==数组==.
>
> 如果参数的最后一个命名参数以`...`为前缀, 则它将成为一个由剩余参数组成的真数组, 其中从0(包括)到`theArgs.length`(排除)的元素由传递给函数的实际参数提供.

```HTML
- rest参数是用来替换arguments的. 
- 剩余参数(rest)和arguments对象之间的区别:
 - 1.剩余参数可包含那些没有对应形参的实参.而arguments包含了传给函数的所有实参
 - 2.arguments对象不是一个真正的数组, 剩余参数是真正的Array实例.(可以打印查看区别).
 - 3.arguments对象还有一些附加属性, 例如callee属性.


- 多个参数情况下,rest参数需要放在形参的最后一位


rest使用场景: 对于函数实参个数不确定的时候,
arguments使用场景: 对于实参个数不确定. 求最大值,求和...

- 解构剩余参数
剩余参数可以被解构,这意味这它们的变量可以被解包到不同的变量中.
function f(...[a,b,c]){
	return a+b+c;
}
f(1) //NaN b and c are undefined
f(1,2,3)//6
f(1,2,3,4)//6 the fourth parameter is not destructured
```





```js
//rest参数用来代替arguments
function main(...args){
    console.log(arguments);//[1, 2, 3, callee: (...), Symbol(Symbol.iterator): ƒ]
    console.log(args); //[1, 2, 3]
}
main(1,2,3,4,5)

//多个参数, rest参数放在最后一位
function sum(index1, index2, ...abc){
    var sum = 0;f
    abc.forEach(item=>sum += item);
    return sum+arguments[0]+arguments[1];
    //return sum + index1 +index2;
}
console.log(sum(1,2,3,4,5,6))

=======================================================
为了在arguments对象上使用Array方法,它首先必须被转换成一个数组
function sortArguments() {
  var sortedArgs = arguments.sort();
  return sortedArgs; // 不会执行到这里
}
 
alert(sortArguments(5,3,7,1)); // 抛出TypeError异常:arguments.sort is not a function

function sortArguments(){
    var args=Array.prototype.slice.call(arguments);
    var sortArgs=args.sort();
    return sortArgs;
}
console.log(sortArguments(5,3,7,1)); //log: 1,3,5,7
```





### spread展开运算符

> 展开运算符也是...   ,是rest参数的逆运算 把数组和对象展开,变成以逗号分隔的参数序列 .
>
> 可以展开实现了迭代器的的数据.(Array string set map Nodelist typearray arguments)
>
> 只能用于可迭代对象



#### 数组使用展开运算符

```js
- 数组的展开
const arr = ['a0', 'b1', 'c2'];
function fn(){console.log(arguments)}
fn(...arr);//log结果: ["a0", "b1", "c2", callee: ƒ, Symbol(Symbol.iterator): ƒ]
fn(arr); //log结果: [Array(3), callee: ƒ, Symbol(Symbol.iterator): ƒ]



- 数组的克隆
const arr = [1,2,3,4]
const newArr = [...arr];
console.log(arr===newArr);//false
console.log(...arr);//log结果: 1 2 3 4
//解析:
...arr就是以逗号分隔的参数序列:1,2,3,4; 然后外层有中括号,所以newArr就是[1,2,3,4]

let [...tail] = [1, 2, 3, 4];
console.log(tail); //log: [1,2,3,4]


- 数组的合并
const arr = [1,2,3,4];
const arr2 = [4,5,6,7,8];
const newArr = [...arr, ...arr2];
console.log(newArr);//log结果: [1, 2, 3, 4, 4, 5, 6, 7, 8]



???错了
- 数组合并转换成对象4 没有这种用法,数值是不固定,是错误的.
const arr = [];//没有值
const arr2 = [5,6,7,8];
const arr3 = [9,10,11];
const newArr = {...arr, ...arr2, ...arr3};
console.log(newArr);//log结果: Object { 0: 9, 1: 10, 2: 11, 3: 8 }
```



#### 对象使用展开运算符

```js
- 对象没有迭代结构,所以直接使用展开运算符会报错.但可以使用大括号,浅克隆.但函数方法会丢失
let obj={a:1, b:2, c:3};
console.log(...obj);//报错 对象原型上没有迭代器
console.log({...obj});//正常输出

- 对象的合并(相同属性,前面的值会被后面相同属性的值覆盖)
const obj1 = {a:'aa'};
const obj2 = {b:'bb'};
const obj3 = {c:'cc'};
const obj4 = {d:'dd', c:'ll'};
const allobj={...obj1, ...obj2, ...obj3, ...obj4};
console.log(allobj);
//打印结果:
{a: "aa", b: "bb", c: "ll", d: "dd"}


- 对象的展开//注意参数外的大括号; 对象展开之后的对象和原对象不是一个对象,两者比较返回false
const obj={a:'aa', b:'bb', c:'cc'};
const newObj = {...obj};
console.log(newObj); //log结果: {a: "aa", b: "bb", c: "cc"}
console.log(obj===newObj);//false


- 对象合并转数组
const obj1 = {a:'aa'};
const obj2 = {b:'bb'};
const obj3 = {c:'cc'};
const obj4 = {d:'dd', c:'ll'};
const allobj=[...obj1, ...obj2, ...obj3, ...obj4];
console.log(allobj);//log结果: Uncaught TypeError: obj1 is not iterable  对象是不可以迭代的

var obj = {'key1': 'value1'};
var array = [...obj]; // TypeError: obj is not iterable

```



#### 字符串使用展开运算符

```js
[...'hello'] //["h", "e", "l", "l", "o"]
```





### spread展开运算符应用

```js
//1.数组的合并
const arr1 = ['a1', 'a2'];
const arr2 = ['b1', 'b2'];
const newArr = [...arr1, ...arr2];
console.log(newArr);
//打印结果:
["a1", "a2", "b1", "b2"]



//2.数组的克隆 是两个不同的数组,并非拷贝模式.数字是基本数据类型,不可变.对象是引用类型,需要引用地址.
const arrOld = ['a', 'b', 'c'];
const arrNew = [...arrOld];
console.log(arrNew);//log结果: Array(3) [ "a", "b", "c" ]
console.log(arrOld === arrNew);//false

arrNew[0]='d';
console.log(arrOld);//Array(3) [ "a", "b", "c" ]
console.log(arrNew);//Array(3) [ "d", "b", "c" ]




//3.伪数组转真数组
function fn(){
    return arguments;
}
var args = fn(1,2,3);
console.log(args, [...args]);
//打印结果
//[1, 3, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
//[1, 3, 3]
```









## 深拷贝与浅拷贝

### 概念

* 浅拷贝是创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以**如果其中一个对象改变了这个地址，就会影响到另一个对象**
* 深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且**修改新对象不会影响原对象**。







```js
https://blog.csdn.net/chaopingyao/article/details/105432129
2021.05.27

https://juejin.cn/post/6844904197595332622

https://segmentfault.com/a/1190000018874254

https://segmentfault.com/a/1190000039310119#:~:text=%E6%B5%85%E6%8B%B7%E8%B4%9D%E5%8F%AA%E5%A4%8D%E5%88%B6%E6%8C%87%E5%90%91,%E4%BC%9A%E6%94%B9%E5%88%B0%E5%8E%9F%E5%AF%B9%E8%B1%A1%E3%80%82
```



### 赋值,深拷贝浅,拷贝比较

这三者的区别如下，不过比较的前提都是**针对引用类型**：

- 当我们把一个对象赋值给一个新的变量时，**赋的其实是该对象的在栈中的地址，而不是堆中的数据**。也就是两个对象指向的是同一个存储空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的。
- 浅拷贝：重新在堆中创建内存，拷贝前后对象的基本数据类型互不影响，但拷贝前后对象的引用类型因共享同一块内存，会相互影响。
- 深拷贝：从堆内存中开辟一个新的区域存放新对象，对对象中的子对象进行递归拷贝,拷贝前后的两个对象互不影响。




### 浅拷贝

#### 定义

#### 实现方式

* Object.assign
* `{...obj}`
* Array.prototype.slice()
* Array.prototype.concat()
* 函数库lodash的_.clone方法

#### 案例

`Object.assign()`

```javascript
let obj = {
  age: 18,
  natrue: ['smart', 'good'],
  names: {
    name1: 'fx',
    name2: 'xka'
  },
  love: function() {
    console.log('fx is a great girl')
  }
};

let newObj = Object.assign({}, obj)
newObj.names.name1 = 'fx2';

console.log(obj.names.name1); //'fx2'
```

`Array.prototype.slice()`

```javascript
let arr = [
  {item1: 'a', item2: 'b'},
  {item2: 'c', item2: 'd'}
];

let newArr = arr.slice();
newArr[0].item1 = 'aa';

console.log(arr[0].item1); //'aa'
```

`Array.prototype.concat()`

```javascript
let arr = [1, 3, {
    username: 'kobe'
    }];
let arr2 = arr.concat();    
arr2[2].username = 'wade';
console.log(arr); //[ 1, 3, { username: 'wade' } ]
```

`展开运算符`

```javascript
//obj
let obj1 = { name: 'Kobe', address:{x:100,y:100}}
let obj2= {... obj1}
obj1.address.x = 200;
obj1.name = 'wade'
console.log('obj2',obj2) // obj2 { name: 'Kobe', address: { x: 200, y: 100 } }

//array
let arr1 = [1,2,{a: {b: 3}}];
let arr2 = [...arr1];
arr1[2].a.b = 4;
console.log(arr2[2].a.b); //4
```

`_.clone`

```javascript
let _ = require('lodash');
let obj1 = {
  a: 1,
  b: {f: {g: 1}},
  c: [1,2,3]
};

let obj2 = _.clone(obj1);
console.log(obj1.b.f === obj2.b.f); //true
```

#### 手写浅拷贝

遍历对象，然后把属性和属性值都放在一个新的对象

```javascript
let copyObj = function(obj) {
  //只拷贝对象
  if (typeof obj !== 'object') return;
  //根据obj类型判断,是新建数组还是对象
  let newObj = obj instanceof Array ? [] : {};
  //遍历obj,并且判断是obj属性才拷贝
  for (let key in obj) {   //Object.keys()只包含自身可枚举的属性
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
```







### 深拷贝

#### 定义

#### 实现方式

* `_.cloneDeep()`

* Jquery.extend()

* 递归手写

* JSON.parse(JSON.stringify())
* structruedClone

  

#### 1. `_.cloneDeep()`

```javascript
let _ = require(lodash);
let obj1 = {
  a: 1,
  b: {f: {g: 1}},
  c: [1,2,3]
};
let obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f); //false
```

Lodash深拷贝可能存在的风险,按需引入中脚手架工具是否进行了(tree shaking)处理
```js
import cloneDeep from 'lodash/cloneDeep'   17.4k(gipped: 5.3k)
import {cloneDeep} from 'lodash'           71.5k(gzipped: 25.2k)
```

**[Lodash按需引入的几种方案](https://www.cnblogs.com/fancyLee/p/10932050.html):**
1.引入单个函数

2.借助lodash-webpack-plugin,babel-plugin-lodash插件优化

3.lodash-es结合tree-shaking




#### 2.Jquery.extend()

```javascript
$.extend(deepCopy, target, object1, [bojectN]); 

let $ = require('jquery');
let obj1 = {
  a: 1,
  b: {f: {g: 1}},
  c: [1,2,3]
};
let obj2 = $.extend(true, {}, obj1);
console.log(obj1.b.f === obj2.b.f); //false
```

#### 3-A1.手写递归

递归方法实现深度克隆原理：**遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝**。

> 来源: https://segmentfault.com/a/1190000020255831  

解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。

```javascript
//对象和数组的深拷贝
//对自身引用的处理+WeakMap; for...in低效

function cloneDeep(target, map = new WeakMap()) {
  if (typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {};
    
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);
    
    for (const key in target) {
      cloneTarget[key] = cloneDeep(target[key]);
    }
    
    return cloneTarget;
    
  } else {
    return target;
  }
}
```



#### 3-A2.手写递归

```javascript
//性能优化

//工具 循环函数 
//使用for或者while循环解决低效的for...in(不同测试环境或工具下 for循环和while 时间有差异)
function forEach(array, callback) {
  let index = -1;
  const len = array.length;
  while(++index < len) {
    callback(array[index], index);
  }
  return array;
}

function clone(target, map = new WeakMap()) {
  if (typeof target === 'object') {
    const isArray = Array.isArray(target);
    let cloneTarget = isArray ? [] : {};
    
    // solve circular reference
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);
    
    // recursion assignment
    let keys = isArray ? undefined : Object.keys(target);
    forEach( keys || target, (value, idx) => {
      if (keys) {
        idx = value;
      }
      cloneTarget[idx] = clone(target[idx]);
    })
    return cloneTarget;
  } else {
    return target;
  }
}
```

#### 3-A3.手写递归

```javascript
//完整版


function isObject(target) {
  let type = typeof target;
  return type !== 'null' && (type === 'object' || type === 'function');
}

function getType(target) {
  return Object.prototype.toString.call(target).slice(8, -1);
}

function cloneSymbol(target) {
  return Object(Symbol.prototype.valueOf.call(target));
}

function cloneRegExp(target) {
  let regFlag = /\w*$/;
  let result = new target.constructor(target.source, regFlag.exec(target));
  result.lastIndex = target.lastIndex;
  return result;
}

function cloneFunction(target) {
  let paramReg = /(?=\().+(?=\)\s*{$)/;
  let bodyReg = /(?={)(.|\n)+(?=})/m;
  let funcString = target.toString();
  if (target.prototype) {
    let body = bodyReg.exec(funcString);
    let param = paramReg.exec(funcString);
    if (body) {
      let paramArr = param[0].split(',');
      if (param) {
        return new Function(...paramArr, body[0]);
      } else {
        // no parameter
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    // arrow function
    return eval(target);
  }
}

function getInit(target, type) {
  switch	(type) {
    case 'String':
    case 'Number':
    case 'Boolean':
    case 'Date':
    case 'Error':  //浏览器和nodejs在拷贝Error时报错
      return new target.constructor(target);
    case 'Symbol':
      return cloneSymbol(target);
    case 'RegExp':
      return cloneRegExp(target);
    case 'Function':
      return cloneFunction(target);
  }
}

function clone(target, map = new WeakMap()) {
  if (!isObject) {
    return target;
  }
  
  let type = getType(target);
  let cloneTarget;
  
  if (cloneDeepType.includes(type)) {
    cloneTarget = getInit(target);
  } else {
    return cloneOtherType(target, type);
  }
  
  if (map.get(target)) {
    return map.get(target);
  }
  map.set(target, cloneTarget);
  
  if (type === 'Set') {
    target.forEach(value => cloneTarget.add(clone(value)))
    return cloneTarget;
  }
  
  if (type === 'Map') {
    target.forEach((value, key) => cloneTarget.set(key, clone(value));
    return cloneTarget;
  }
  
  let keys = type === 'Array' : undefined ? Object.keys(target);
  forEach(keys || target, (value, idx) => {
    if (keys) {
      idx = value;
    }
    
    cloneTarget[idx] = clone(target[idx]);
  })
  
  return cloneTarget;
}


//error msg:
"Error: Error
    at cloneOtherType (<anonymous>:84:20)
    at clone (<anonymous>:109:16)
    at <anonymous>:140:28
    at forEach (<anonymous>:24:9)
    at clone (<anonymous>:136:5)
    at <anonymous>:183:14"
```



```javascript
const map = new Map();
map.set('key', 'value');
map.set('ConardLi', 'code秘密花园');

const set = new Set();
set.add('ConardLi');
set.add('code秘密花园');

const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8],
    empty: null,
    map,
    set,
    bool: new Boolean(true),
    num: new Number(2),
    str: new String(2),
    symbol: Object(Symbol(1)),
    date: new Date(),
    reg: /\d+/,
    error: new Error(),
    func1: () => {
        console.log('code秘密花园');
    },
    func2: function (a, b) {
        return a + b;
    }
};
```



#### 3-A4 另一种方案

```javascript
//https://juejin.cn/post/6844903986479251464#heading-56

//存在的问题:

问题: new Boolean( new Boolean(false) ) 的结果是 Boolean {true}
解决: new Boolean( new Boolean(false).valueOf()); //Boolean {false}
其他: 不推荐,ES6后不推荐使用[new 基本类型()]这样的语法
```



```javascript
const getType = obj => Object.prototype.toString.call(obj);
const isObject = target => typeof target === 'object' || typeof target === 'function' && target !== null;

const canTraverse = {
  '[object Map]': true,
  '[object Set]': true,
  '[object Object]': true,
  '[object Array]': true,
  '[object Arguments]': true
};

const mapTag = '[object Map]';
const setTag = '[object Set]';
const boolTag = '[object Boolean]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const handleRegExp = (target) => {
  const {source, flags} = target;
  return new target.constructor(source, flags);
};

const handleFunc = (func) => {
  //箭头函数直接返回自身
  if (!func.prototype) return func;
  const bodyReg = /(?<={)(.|\n)+(?=})/;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  
  //分别匹配函数参数 和 函数体
  const param = paramReg.exec(funcString);
  const body = bodyReg.exec(funcString);
  if (!body) return null;
  if (param) {
    const paramArr = param[0].split(',');
    return new Function(...paramArr, body[0]);
  } else {
    return new Function(body[0]);
  }
}

const handleNotTraverse = (target, tag) => {
  const Ctor = target.constructor;
  switch(tag) {
    case boolTag:
      return new Object(Boolean.prototype.valueOf.call(target));
    case numberTag:
      return new Object(Number.prototype.valueOf.call(target));
    case stringTag:
      return new Object(String.prototype.valueOf.call(target));
    case symbolTag:
      return new Object(Symbol.prototype.valueOf.call(target));
    case errorTag:
    case dateTag:
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
};


const deepClone = (target, map = new WeakMap()) {
  if (!isObject) return target;
  let type = getType(target);
  let cloneTarget;
  
  if (!canTraverse[type]) {
    //处理不能遍历的对象
    return hadleNotTraverse(target, type);
  } else {
    //包装对象原型不丢失
    let ctor = target.construcotr;
    cloneTarget = new ctor();
  }
  
  if (map.get(target)) {
    return target;
  }
  map.set(target, true);
  
  if (type === mapTag) {
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(item, map));
    })
  }
  
  if (type === setTag) {
    target.forEach(item => {
      cloneTarget.add(deepClone(item, map));
    })
  }
  
  for (let key in target) {
    if (target.hasOwnProperty(key)) { //原因?
      cloneTarget[key] = deepClone(target[key], map);
    }
  }
  return cloneTarget;
}
```







#### 3-B1 直接赋值

简略版,赋值操作,可复用性很低

```javascript
const target = {
    name: 'aaa',
    pos: ['a','b','c'],
    founder: {
        name:'man'
    },
    fn() {}
};

let container = [];

container.name = target.name;
container.pos = []; //不能直接引用target.pos, 否则两个属性公用一个内存地址,一个改动另一个也会跟着变
container.pos[0] = target.pos[0];
container.pos[1] = target.pos[1];
container.pos[2] = target.pos[2];
container.founder = {};
container.founder['name'] = target.founder.name;
container.fn = target.fn.bind(container);
```



#### 3-B2.手写递归

上面简略版提高复用性,函数

```javascript
//工具函数 判断数据类型
function targetType(target) {
  return Object.prototype.toString.call(target).slice(8, -1);
}

//深拷贝函数
function clone(target) {
  let container = target instanceof Array ? [] : {};
  
  for (const key in target) {
    let type = targetType(target[key]);
    if (type === "Object" || type === "Array")  {
      container[key] = clone(target[key]);
    } else if (type === 'Function') {
      container[key] = target[key].bind();
    } else {
      container[key] = target[key];
    }
  }
  
  return container;
}

//问题
开始写成了 type === "Object" || "Array" Node环境中没有报错,浏览器环境中会报错

//属性值没有对象的深拷贝
function deepClone(obj) {
  if (typeof obj !== 'object') return;
  let newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
    }
  }
  return newObj;
}
```





#### 4. JSON方式

```javascript
let cloneObj = JSON.parse(JSON.stringify(obj));
```



```js
- 会忽略undefined
- 会忽略symbol
- 如果对象属性为Function,因为JSON格式字符串不支持Function,在序列化的时候回自动删除;
- 诸如Map, Set, RegExp, Date, ArrayBuffer和其他内置类型在进行序列化时会丢失
- 不支持循环引用对象的拷贝.
```







##### 4.1 JSON深拷贝缺点

```js
https://www.jianshu.com/p/52db1d0c1780
```

###### 1  属性值对象里有时间对象

```js
JSON返回结果是字符串形式,不是对象形式

let test = {
  name: 'e',
  data: [new Date(1536627600000), new Date(1540047600000)]
};

let result = JSON.parse(JSON.stringify(test));
console.log(b);

{name: "e", data: Array(2)}
{name: "e", ["2018-09-11T01:00:00.000Z", "2018-10-20T15:00:00.000Z"]  }

```



###### 2 属性值对象里有正则缩写,Error对象

```js
//序列号结果得到空对象
const test = {
  name: 'e',
  data: new RegExp('\\w+')
}
const result = JSON.parse(JSON.stringify(test));
test.name = 'test';
console.log(result); //{name: 'e', data: {}}
```



###### 3 属性值对象里有函数,undefined

```js
//
const test = {
  name: 'e',
  data: function fn() {
    console.log('fff');
  },
 	obj: {a: undefined}
}

const result = JSON.parse(JSON.stringify(test));
test.name = 'test';
console.error('ddd', test, result);
//result的打印结果是
{name: 'e', obj: {}}
//test打印结果
{name: 'e', obj: {a: undefined}, data:fn()}
```



###### 4 如果属性值对象里由NaN, Infinity和-Infinity, 序列化结果是变成null



###### 5 不可枚举属性

JSON.stringify()只能序列化对象的可枚举的自有属性，例如 如果obj中的对象是有构造函数生成的， 则使用JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的constructor；

```js
function Person(name) {
  this.name = name;
  console.log(name);
}

const lilai = new Person('lilai');

const test = {
  name: 'a',
  data: lilai,
}

const result = JSON.parse(JSON.stringify(test));
test.name = 'test';
console.log(test, result);
```



###### 6 对象中存在循环引用的情况也无法实现深拷贝



总结

序列化JS对象,所有函数和原型成员对象会被忽略.能被深拷贝的数据类型有<span style="color:red">**字符串,数值,布尔值,扁平对象.**</span>

性能问题:  尽管使用深拷贝会完全的克隆一个新对象，不会产生副作用，但是深拷贝因为使用递归，性能会不如浅拷贝，在开发中，还是要根据实际情况进行选择



#### 5. 递归

> JS重难点实例精讲 4.3.2

```js

(function (_) {
	let types = 'Array Object Function RegExp Date String Boolean Number Null Undefined'.split(' ')
	function type() {
		return Object.prototype.toString.call(this).slice(8, -1)
	}

	for (let i = types.length; i--;) {
		_['is' + types[i]] = (function (self) {
			return function (elem) {
				return type.call(elem) === self
			}
		})(types[i])
	}
	return _;
})(_ = {})

function deepClone(source) {
	let parents = []
	let children = []

	function getRegExp(reg) {
		let result = ''
		if (reg.ignoreCase) {
			result += 'i'
		}
		if (reg.global) {
			result += 'g'
		}
		if (reg.multiline) {
			result += 'm'
		}
		return result
	}
	// 递归
	function _clone(parent) {
		if (parent === null) return parent
		if (typeof parent !== 'object') return parent
		let child, proto;
		if (_.isArray(parent)) {
			child = []
		} else if (_.isRegExp(parent)) {
			child = new RegExp(parent.source, getRegExp(parent))
			if (parent.lastIndex) child.lastIndex = parent.lastIndex
		} else if (_.isDate(parent)) {
			child = new Date(parent.getTime())
		} else {
			// 处理对象原型
			proto = Object.getPrototypeOf(parent)
			child = Object.create(proto)
		}

		// 处理循环引用
		let index = parents.indexOf(parent)
		if (index !== -1) {
			return children[index]
		}
		// 没有引用过,则添加至parents和children数组中
		parents.push(parent)
		children.push(child)

		//遍历对象属性
		for (let prop in parent) {
			if (parent.hasOwnProperty(prop)) {
				// 递归处理
				child[prop] = _clone(prop)
			}
		}
		return child
	}
	return _clone(source)
}
```



#### 6.structuredClone

> https://developer.mozilla.org/en-US/docs/Web/API/structuredClone

特点:
* 使用结构化克隆算法对给定值进行深拷贝
* 支持把原始值中的可转移对象转义到新对象,而不是把属性引用拷贝过去
* 可以拷贝无限嵌套的对象和数组
* 可拷贝循环引用

不能做的:
*  [Function](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FFunction "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function") 对象是不能被结构化克隆算法复制的；如果你尝试这样子去做，这会导致抛出 DATA_CLONE_ERR 的异常。
- 企图去克隆 DOM 节点同样会抛出 DATA_CLONE_ERR 异常。
- 对象的某些特定参数也不会被保留 ??

语法
```js
structuredClone(value)
structuredClone(value, options)
```

对比JSON,Lodash, structuredClone三种深拷贝方法

| 名称                            | 优点                           | 缺点                                 |
| ------------------------------- | ------------------------------ | ------------------------------------ |
| JSON.parse(JSON.stringify(obj)) | 简单,兼容性好,处理简单数据方便 | 无法处理Date,null,function等         |
| cloneDeep                       | 兼容性好,功能强大              | 注意处理tree-shaking否则会有性能损耗 |
| structuredClone                 | 浏览器原生支持                 | 兼容性不好                                     |


### 练习

#### 歌曲列表

```HTML
<script>
	const btn=document.querySelector('button');
    const table=document.querySelector('tbody');
    
    btn.onclick=function(){
        const xhr=new XMLHttpRequest();
        xhr.open('GET', 'http://127.0.0.1/songs');
        xhr.send();
        xhr.onreadystatechange=function(){
            if(xhr.readyState === 4){
                let result = responseText;
                let data=JSON.parse(result);
                //遍历数据
                data.data.forEach(item=>{
                 //创建tr td,然后插入元素
                 const tr = document.createElement('tr');
                 const td1 = document.createElement('td');
                 td1.innerHTML=item.id;
                 const td2 = document.createElement('td');
                 td2.innerHTML=item.name   
                 const td3 = document.createElement('td');
                 td3.innerHTML=item.time_public;   
                 const td4 = document.createElement('td');
                 td4.innerHTML=item.singer[0].name;   
                 const td5 = document.createElement('td');
                 td5.innerHTML=item.album.name;
                    
                 //将td插入到tr中
                 tr.appendChild(td1);
                 tr.appendChild(td2);   
                 tr.appendChild(td3);
                 tr.appendChild(td4);
                 tr.appendChild(td5);   
                 //将tr插入到table中
                 table.appendChild(tr);   
                })
            }
        }
    }
</script>
```



```html
=====服务端======
<script>
const express=require('exprss');
const app=express();
    
app.all('/songs', (request, response)=>{
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Header', '*');
    response.setHeader('Content-Type','application/json;charset=utf-8');
    response.end(require('fs').readFileSync('./data.json'));
    
});
app.all('*', (request, response)=>{
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.send('404');
})    


</script> 

===================客户端=======================
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>歌曲表格</title>
    <link crossorigin='anonymous' href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container">
    <h2 class="page-header">歌曲表格 <button class="btn btn-sm btn-info">点击获取歌曲列表</button></h2>
    <table class="table table-striped table-hover table-border">
        <tr>
            <td>ID</td>
           <td>歌曲名称</td>
            <td>发布时间</td>
            <td>歌手名称</td>
            <td>专辑名称</td>
        </tr>
    </table>
</div>
<script>
	const btn=document.querySelector('button');
    btn.onclick=function(){
        const xhr=new XMLHttpRequest();
        xhr.open('GET', 'http://127.0.0.1/songs');
        xhr.send();
        xhr.onreadystatechange=function(){
            if(xhr.readyState===4){
                if(xhr.status>=200 && xhr.status<300){
                    let obj=JSON.parse(xhr.responseText);
                    
                    obj.data.forEach(items=>{
                        const tr=document.createElement('tr');
                        const td1=document.createElement('td');
                        const td2=document.createElement('td');
                        const td3=document.createElement('td');
                        const td4=document.createElement('td');
                        const td5=document.createElement('td');
                        
                        td1.innerHTML=items.id;
                        td2.innerHTML=items.name;
                        td3.innerHTML=items.time_public;
                        td4.innerHTML=items.singer[0].name;
                        td5.innerHTML=items.album.name;
                        
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tr.appendChild(td3);
                        tr.appendChild(td4);
                        tr.appendChild(td5);
                        
                        table.appendChild(tr);
                    })
                }
            }
        }
    }
</script>    
    
```





### 封装jquery中的ajax

```js
//get请求类型中,jQuery发送ajax,参数对象的位置是作为URL的参数.


let $={
    get:function(url, data, callback){
        let xhr=new XMLHttpRequest();
        let str='';
        for(let i in data){
            str += `${i}=${data[i]}`;
        }
        let url=(str+'?'+url).slice(0, -1);
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange=function(){
            if(xhr.readystate===4){
                if(xhr.status>=200 && xhr.status<300){
                    callback(xhr.responseText);
                }
            }
        }
    }
}

$.get('http://127.0.0.1', {a:100, b:200}, function(data){console.log(data)})
```


























## todo


### 代码混淆

> https://mp.weixin.qq.com/s/5m_b7maviQ2P0CfX9_1R7g



### 十六进制字符串编码



### 字符串数组映射



### 死代码注入





### 作用域混淆

### 字符编码



### 变量缩短



### 代码压缩




## todo 


### 工具函数

> https://mp.weixin.qq.com/s/GX9jjKrzEtG5pyXQj4A6qw



#### 校验数据类型

```js
export const typeOf = function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}
```



#### 防抖

```js
export const debounce = (() => {
  let timer;
  return (fn, wait=800) => {
    timer && clearTimeout(timer)
    timer = setTimeout(fn, wait)
  }
})
```



#### 节流

```js
export const throttle = (() => {
  let start = 0;
  return (fn, wait=800) => {
    let now = +new Date();
    if (now - start > wait) {
      fn();
      start = now;
    }
  }
})
```



#### 手机号脱敏

```js
export const hideMobile = (mobile) => mobile.replace(/^(\d{3})\d{4}(\d{r})$/, "$1****$2")
```



#### 开启全屏 ?

```js
export const launchFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen()
  }
}
```



#### 关闭全屏

```js
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}
```



#### 大小写转换

**参数：**

- str 待转换的字符串
- type 1-全大写 2-全小写 3-首字母大写

```js
export const turnCase = (str, type) => {
  switch(type) {
    case 1:
      return str.toUpperCase();
    case 2:
      return str.toLowerCase();
    case 3:
      return str[0].toUpperCase() + str.subString(1).toLowerCase()
    default:
      return str;
  }
}
```



#### 解析URL参数

```js
export const getSearchParams = () => {
  const searchPar = new URLSearchParams(window.localtion.search)
  const paramsObj = {}
  for (const [key, value] of searchPar.entries()) {
    paramsObj[key] = value
  }
  return paramsObj
}
```



#### 判断手机是Android还是IOS

```js
/** 
 * 1: ios
 * 2: android
 * 3: 其它
 */

export const getOSType = () => {
  let u = navigator.userAgent, app = navigator.appVersion;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  let isIOS = !!u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/);
  if (isIOS) {
    return 1;
  }
  if (isAndroid) {
    return 2;
  }
  return 3;
}
```



#### 数组对象根据字段去重

**参数：**

- arr 要去重的数组
- key 根据去重的字段名

```js
const responseList = [
    { id: 1, name: '树哥' },
    { id: 2, name: '黄老爷' },
    { id: 3, name: '张麻子' },
    { id: 1, name: '黄老爷' },
    { id: 2, name: '张麻子' },
    { id: 3, name: '树哥' },
    { id: 1, name: '树哥' },
    { id: 2, name: '黄老爷' },
    { id: 3, name: '张麻子' },
]

uniqueArrayObject(responseList, 'id')
// [{ id: 1, name: '树哥' },{ id: 2, name: '黄老爷' },{ id: 3, name: '张麻子' }]
```



```js
export const a = (arr, key='id') => {
  arr.reduce((acc, crt) => acc.some(v => v[key] === crt[key]) ? acc : acc.concat(crt),[])
}
```





#### 滚动到页面顶部 ??

```js
export const scrollToTop = () => {
  const height = document.documentElement.scrollTop || document.body.scrollTop;
  if (height > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, height - height / 8);
  }
}
```



#### 滚动到元素位置

```js
export const smoothScroll = element => {
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth'
  })
}
```



#### uuid ??

```js
export const uuid = () => {
  const temp_url = URL.createObjectURL(new Blob());
  const uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url); //释放URL
  return uuid.substring(uuid.lastIndexOf('/') + 1)
}
```



#### 金额格式化

**参数：**

- {number} number：要格式化的数字
- {number} decimals：保留几位小数
- {string} dec_point：小数点符号
- {string} thousands_sep：千分位符号

```js
export const moneyFormat = (number, decimals, dec_point, thousands_sep) => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  const n = !isFinite(+number) ? 0 : +number
  const prec = !isFinite(+decimals) ? 2 : Math.abs(decimals)
  const sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep
  const dec = typeof dec_point === 'undefined' ? '.' : dec_point
  let s = ''
  const toFixedFix = function(n, prec) {
    const k = Math.pow(10, prec)
    return '' + Math.ceil(n * k) / k
  }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}
```



#### 存储操作 ??

```js
class MyCache {
  constructor(isLocal = true) {
    this.storage = isLocal ? localStorage : sessionStorage
  }

  setItem(key, value) {
    if (typeof (value) === 'object') value = JSON.stringify(value)
    this.storage.setItem(key, value)
  }

  getItem(key) {
    try {
      return JSON.parse(this.storage.getItem(key))
    } catch (err) {
      return this.storage.getItem(key)
    }
  }

  removeItem(key) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }

  key(index) {
    return this.storage.key(index)
  }

  length() {
    return this.storage.length
  }
}

const localCache = new MyCache()
const sessionCache = new MyCache(false)

export { localCache, sessionCache }
```



#### 下载文件

**参数：**

- api 接口
- params 请求参数
- fileName 文件名

```js
const downloadFile = (api, params, fileName, type='get') => {
  axios({
    method: type,
    url: api,
    reponseType: 'blob',
    params: params
  }).then(res => {
    let str = res.headers['content-disposition']
    if (!res || !str) {
      return
    }
    
    let suffix = ''
    //截取文件名和文件类型
    if (str.lastIndexOf('.')) {
      fileName ? '' : fileName = decodeURI(str.substring(str.indexOf('=') + 1, str.lastIndexOf('.')))
      suffix = str.substring(str.lastIndexOf('.'), str.length)
    }
    
    // 如果支持微软的文件下载方式(ie10+浏览器)
    if (window.navigator.msSaveBlob) {
      try {
        const blobObject = new Blob([res.data]);
        window.navigator.msSaveBlob(blobObject, fileName + suffix);
      } catch(e) {
        console.log(e)
      }
    } else {
      // 其他浏览器
      let url = window.URL.createObjectURL(res.data)
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName + suffix)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    }
  }).catch(err => {
    console.log(err.message)
  })
}
```



#### 事件操作

强烈推荐使用 **day.js**

Day.js 是一个仅 2kb 大小的轻量级 JavaScript 时间日期处理库，下载、解析和执行的JavaScript更少，为代码留下更多的时间。



#### 深拷贝

此方法存在一定局限性：一些特殊情况没有处理: 例如Buffer对象、Promise、Set、Map。

**如果确实想要完备的深拷贝，推荐使用 lodash 中的 cloneDeep 方法。**

```js
export const clone = parent => {
  // 判断类型
  const isType = (obj, type) => {
    if (typeof obj !== "object") return false;
    const typeString = Object.prototype.toString.call(obj);
    let flag;
    switch (type) {
      case "Array":
        flag = typeString === "[object Array]";
        break;
      case "Date":
        flag = typeString === "[object Date]";
        break;
      case "RegExp":
        flag = typeString === "[object RegExp]";
        break;
      default:
        flag = false;
    }
    return flag;
  };

  // 处理正则
  const getRegExp = re => {
    var flags = "";
    if (re.global) flags += "g";
    if (re.ignoreCase) flags += "i";
    if (re.multiline) flags += "m";
    return flags;
  };
  // 维护两个储存循环引用的数组
  const parents = [];
  const children = [];

  const _clone = parent => {
    if (parent === null) return null;
    if (typeof parent !== "object") return parent;

    let child, proto;

    if (isType(parent, "Array")) {
      // 对数组做特殊处理
      child = [];
    } else if (isType(parent, "RegExp")) {
      // 对正则对象做特殊处理
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (isType(parent, "Date")) {
      // 对Date对象做特殊处理
      child = new Date(parent.getTime());
    } else {
      // 处理对象原型
      proto = Object.getPrototypeOf(parent);
      // 利用Object.create切断原型链
      child = Object.create(proto);
    }

    // 处理循环引用
    const index = parents.indexOf(parent);

    if (index != -1) {
      // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
      return children[index];
    }
    parents.push(parent);
    children.push(child);

    for (let i in parent) {
      // 递归
      child[i] = _clone(parent[i]);
    }

    return child;
  };
  return _clone(parent);
};
```



#### 模糊搜索

**参数：**

- list 原数组
- keyWord 查询的关键词
- attribute 数组需要检索属性

```js
// 示例
const list = [
  { id: 1, name: '树哥' },
  { id: 2, name: '黄老爷' },
  { id: 3, name: '张麻子' },
  { id: 4, name: '汤师爷' },
  { id: 5, name: '胡万' },
  { id: 6, name: '花姐' },
  { id: 7, name: '小梅' }
]
fuzzyQuery(list, '树', 'name') // [{id: 1, name: '树哥'}]
```



```js
export const fuzzyQuery = (list, keyWord, attribute='name') => {
  //return list.find(v => v[attribute].includes(keyWord));
  return list.filter(v => v[attribute].includes(keyWrod));
}


export const fuzzyQuery = (list, keyWord, attribute = 'name') => {
  const reg = new RegExp(keyWord)
  const arr = []
  for (let i = 0; i < list.length; i++) {
    if (reg.test(list[i][attribute])) {
      arr.push(list[i])
    }
  }
  return arr
}
```



#### 遍历树节点 ??

示例

```js
//假设我们要从树状结构数据中查找 id 为 9 的节点

const treeData = [
  {
  id: 1,
  label: '一级 1',
  children: [{
    id: 4,
    label: '二级 1-1',
    children: [{
      id: 9,
      label: '三级 1-1-1'
    }, {
      id: 10,
      label: '三级 1-1-2'
    }]
  }]
 }, {
  id: 2,
  label: '一级 2',
  children: [{
    id: 5,
    label: '二级 2-1'
  }, {
    id: 6,
    label: '二级 2-2'
  }]
  }, {
    id: 3,
    label: '一级 3',
    children: [{
      id: 7,
      label: '二级 3-1'
    }, {
      id: 8,
      label: '二级 3-2'
    }]
}],

let result
foreachTree(data, (item) => {
  if (item.id === 9) {
    result = item
  }
})
console.log('result', result)  // {id: 9,label: "三级 1-1-1"}   
```



```js
export const foreachTree = (data, callback, childrenName = 'children') => {
  for (let i = 0; i < data.length; i++) {
    callback(data[i])
    if (data[i][childrenName] && data[i][childrenName].length > 0) {
      foreachTree(data[i][childrenName], callback, childrenName)
    }
  }
}
```



































