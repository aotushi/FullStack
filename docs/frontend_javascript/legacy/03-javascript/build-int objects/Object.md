---
alias:对象
---


## 概述

> 对象是一种复合值,它汇聚多个值(原始值或其他对象)并允许我们按名字存储和获取这些值.
>
> 对象是一个属性的无序集合,每个属性都有名字和值.属性名通常是字符串(也可以是符号),因此可以说是对象把字符串映射为值.
>
> 除了维持自己的属性之外,JS对象也可以从其他对象继承属性,这个其他对象被称为其'原型'.
>
> JS对象是动态的,即可以动态添加和删除属性.不过,也可以用对象来模拟静态类型语言中的静态对象和'结构体'.
>
> 对象属性有一个名字和值,属性名可以是任意字符串,包括空字符串(或任意符号),但对象不能包括两个同名的属性.值可以是任意JS值,或者是设置函数或获取函数(或两个函数同时存在).

在JavaScript中，几乎所有的对象都是`Object`类型的实例，它们都会从`Object.prototype`继承属性和方法，虽然大部分属性都会被覆盖（shadowed）或者说被重写了（overridden）。 

除此之外，`Object` 还可以被故意的创建，但是这个对象并不是一个“真正的对象”（例如：通过 `Object.create(null)`），或者通过一些手段改变对象，使其不再是一个“真正的对象”（比如说: `Object.setPrototypeOf`）。



对象的相关操作包括创建对象, 以及设置, 查询, 删除, 测试和枚举它们的值.

### 动态语言 vs 静态语言
> `微信读书 <Javascript设计模式与开发实践>`
编程语言按照**数据类型**大体可以分为两类，一类是静态类型语言，另一类是动态类型语言。
#### 是什么
* 静态类型语言在编译时便已确定变量的类型
* 动态类型语言的变量类型要到程序运行的时候，待变量被赋予某个值之后，才会具有某种类型。
#### 静态语言的优点/缺点
* 优点: 在编译时就能发现类型不匹配的错误;编译器还可以针对这些信息对程序进行优化，提高程序执行速度。
* 缺点: 迫使程序员依照强契约来编写程序;类型的声明也会增加更多的代码,分散开发人员的精力;

#### 动态语言的优点/缺点
* 优点: 编写的代码数量更少,简洁;
* 缺点: 无法保证变量的类型,可能在程序运行期间发生跟类型相关的错误.

### 对象的3大特征

#### 多态
> 多态的实际含义是：同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果.多态的思想是将**做什么**和**谁去做及怎么做**分离开来.
> 举个简单例子, 让鸡和鸭都叫(都有这个方法),但是它们发出的声音不同.
> 多态最根本的作用就是通过**把过程化的条件分支语句转化为对象的多态性**，从而消除这些条件分支语句。


**其它解释**
* 继承和重写的方法能有相同的名称且能共存的事实, 称为'多态(polymorphism)' - <你不知道的JS>



案例: 编写一个地图应用,使用谷歌地图的api的show方法,负责展示地图.后来需要将谷歌地图换成百度地图
```js
//使用谷歌地图
let googleMap = {
	show: function() {
		console.log('开始渲染谷歌地图')
	}
}

let renderMap = function() {
	googleMap.show()
}
renderMap()
```

```js
//将谷歌地图换成百度地图
var googleMap = {
		show: function(){
			console.log( ’开始渲染谷歌地图’ );
		}
};

var baiduMap = {
		show: function(){
			console.log( ’开始渲染百度地图’ );
		}
};

var renderMap = function( type ){
		if ( type === 'google' ){
			googleMap.show();
		}else if ( type === 'baidu' ){
			baiduMap.show();
		}
};

renderMap( 'google' );    //输出：开始渲染谷歌地图
renderMap( 'baidu' );     //输出：开始渲染百度地图
```
上面的代码的弹性非常脆弱,一旦换成其它地图,无疑需要改动renderMap函数,继续添加分支语句.使用多态思想分离谁去做和做什么.

```js

let renderMap = function(map) {
	if (map.show instanceof Function) {
		map.show()
	}
}

renderMap(googleMap)
renderMap(baiduMap)
```





#### 封装
> 在许多语言系统中,封装数据是由语法解析实现的,语言一般提供了private, public, protected等关键字来提供不同的访问权限.
> 但是JS中没有这些关键字支持,只能**依赖变量的作用域**来实现封装特性,而且只能模拟出public,private两种封装性.

**封装的表现**
* 封装数据
* 封装实现
* 封装类型
* 封装变化

> 封装数据

```js
var myObject = (function(){
		var __name = 'sven';    //私有（private）变量
		return {
			getName: function(){    //公开（public）方法
					return __name;
			}
		}
})();

console.log( myObject.getName() );    //输出：sven
console.log( myObject.__name )     //输出：undefined
```

> 封装实现

有俩方面: 对外而言,对象内部的变化对其他对象而言是不可见的。对内而言,当我们修改一个对象时，可以随意地修改它的内部实现，只要对外的接口没有变化，就不会影响到程序的其他功能。

> 封装类型

封装类型是静态类型语言中一种重要的封装方式。一般而言，封装类型是通过抽象类和接口来进行的.
JS既没有能力也没有必要做.



> 封装变化

通过封装变化的方式,把系统中稳定不变的部分和容易变化的部分隔离开来，在系统的演变过程中，我们只需要替换那些容易变化的部分。这可以最大程度地保证程序的稳定性和可扩展性。

#### 继承
> <<JS设计模式与开发实战>> 1.4

JS是原型继承的语言.而原型继承语言有几项基本规则:
* 所有数据都是对象(除了`undefined`)
* 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它。
* 对象会记住它的原型。
* 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型。



### 类型转换 ??

`({} + 1).length === 16 //true !!`  调用toString转换成字符串再加1,长度是16



({} + 'b' > {} + 'a')返回值

```javascript
({} + 'b' > {} + 'a') //true


{} + 'b' > {} + 'a' //false
```



## 类数组对象

##### 定义

> 拥有一个length属性和若干索引属性的对象



##### 与数组的比较

* 在读写,长度,遍历上与数组相同
* 无法直接调用数组方法, 可以借助Function.call方法间接调用

```javascript
let arrayLike = {
  0: 'name',
  1: 'age',
  2: 'sex',
  length: 3
};

Array.prototype.join.call(arrayLike, '&');
Array.prototype.slice.call(arrayLike, 0); //['name', 'age', 'sex'] slice可以将类数组转换成数组

Array.prototype.map.call(arrayLike, function(item) {
  return item.toUpperCase();
});
//['NAME', 'AGE', 'SEX']
```



##### 类数组转换成数组的 6 种方法

* [].slice.call(arrayLike)

* [].splice.call(arrayLike, 0)

* [].concat.apply([], arrayLike)

* Array.from(arrayLike)

* [...arrayLike]

* for循环+push

  

## 纯粹对象 !!

> https://hacks.mozilla.org/category/es6-in-depth/
>
> https://www.jianshu.com/p/b644bcf935ac



#### 是什么

vuejs文档中提到的纯粹对象:  **(含有零个或多个的 key/value 对)**：浏览器 API 创建的原生对象，原型上的 property 会被忽略。



#### 介绍

传统的对象不是纯粹的

例如,声明的`let obj = {}`就是一个不纯粹的对象, 是通过原型链继承了Object, 也就生来自带了`Object`的一系列内置属性和方法

`var obj = {}`相当于是执行了这个语句 `var obj = Object.create(Object.prototype)`：



#### 如何创建纯粹对象

Object.create(null)



#### 非纯粹对象的坏处

`({} + 1).length === 16 //true !!`  调用toString转换成字符串再加1,长度是16



## 对象3种创建方式

对象创建可以通过对象字面量, new关键字和`Object.create()`函数来创建.



<u>**概述**</u>

* `new Object()`   //`Object()`行为等同于`new Object()`
* `Object.create()`
* 字面量



#### 对象字面量创建

<u>定义及规范</u>

创建JS对象最简单的方式. 对象字面量最简单的形式是包含一对花括号中的一组逗号分隔的"名: 值"对. 

<span style="color: blue">属性名是JS标识符或字符串字面量(允许空字符串).</span>

<span style="color: blue">属性值是任何JS表达式,这个表达式值(可以是原始值或对象值)会变成属性的值</span>



<u>特点</u>

* 对象字面量最后一个属性后面的**逗号**是合法的,有些编程风格指南鼓励添加这些逗号,以便将来在对象字面量末尾再增加新属性不会导致语法错误.
* 对象字面量是一个表达式,每次求值都会创建并初始化一个新的/不一样的对象.
  * 字面量每次被求值得时候,它的每个属性的值也会被求值.这意味着同一个对象字面量如果出现在循环体中,或出现在被重复调用的函数体内,可以创建很多新对象,且这些新对象属性的值可能不同.



#### new操作符创建

<u>概述</u>

new操作符用于创建和初始化一个新对象. new关键字后面必须跟一个函数调用.以这种方式使用的函数被称为'构造函数(constructor)', 目的是初始化新创建的对象.

JS为内置的类型提供了构造函数:

```javascript
let o = new Object(); //创建一个空对象, 与{}相同
let a = new Array(); //创建一个空数组, 与[]相同
let d = new Date(); //创建一个表示当前时间的日期对象
let r = new Map(); //创建一个映射对象, 用于存储键/值映射
```



`Object` 构造函数为给定的参数创建一个包装类对象（object wrapper），具体有以下情况：

* 如果给定值是 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null) 或 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，将会创建并返回一个<u>空对象</u>
* 如果传进去的是一个基本类型的值，则会构造其<u>包装类型的对象</u>
* 如果给定值是一个已经存在的对象，则会返回这个已经存在的值（相同地址）。

当以非构造函数形式被调用时， `Object` 和 `new Object()`表现一致。



#### Object.create()创建

**原型**

介绍此种创建方式前, 首先需要了解JS中的原型知识:

几个每一个JS对象都有一个另一个与之关联的对象.这另一个对象被称为原型(prototype),第一个对象从这个原型继承属性.

通过对象字面量创建的所有对象都有相同的原型对象, 在JS代码中可以通过`Object.prototype`引用这个原型对象.使用new关键字和构造函数调用创建的对象, 使用构造函数prototype属性的值作为它们的原型.换句话说,使用`new Object()`创建的对象继承自`Object.prototype`, 与通过`{}`创建的对象一样.

几乎所有对象都有原型,但是只有少数对象具有prototype属性,正是这些有prototype属性的对象为所有其他对象定义了原型.

Object.prototype是为数不多没有原型的对象,因为它不继承任何属性.

**Object.create**

用于创建一个新对象,使用其第一个参数作为新对象的原型.

传入null可以创建一个没有原型的新对象.这样创建的对象不会继承任何东西.

若为null，则对象的原型为undefined

如果想创建一个普通的空对象(类似`{}` 或 `new Object()`返回的对象), 传入`Object.prototype`:

```javascript
let o = Object.create(Object.prototype)
```

Object.create()的一个用途是防止对象被某个第三方库意外修改. 这种情况下不要直接把对象传给库函数,而要传入一个继承自它的对象. 如果函数读取这个对象的属性,可以读到继承的值. 而如果它设置这个对象的属性, 则修改不会影响原始对象.


## 对象属性

### 计算属性名

见15.可计算属性名

### 扩展属性

ECMAScript 提案（第3阶段）的[剩余/扩展属性](https://github.com/tc39/proposal-object-rest-spread)将[扩展](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)属性添加到对象文字。它将自己提供的对象的枚举属性复制到一个新的对象上。

使用比[`Object.assign()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)更短的语法，可以轻松克隆（不包括原型）或合并对象。

```javascript
```

**注意**:  `Object.assign()`会触发`setter`,而展开操作符不会.




## 对象的属性的类型(数据+访问器)

> 在JS中,对象属性分为两类: 数据属性和访问器属性. 

在创建普通属性时属性描述符会使用默认值，我们也可以使用Object.defineProperty(..)来添加一个新属性或者修改一个已有属性（如果它是configurable）并对特性进行设置。



#### 1. 数据属性

> 数据属性包含的是一个数据的位置,在这可以对数据值进行读写.

##### 1.1 数据属性的4个属性描述符

> configurable enumerable writable 默认为true
>
> value 默认为undefined

<span style="color:blue;">**configurable** 可配置</span>

* 表示属性能否删除而重新定义，或者是否可以修改为访问器属性，默认值为true。

* 只要属性是可配置的，就可以使用defineProperty(..)方法来修改属性描述符;

* 把configurable修改成false是单向操作，无法撤销！

* 即便属性是`configurable:false`，我们还是可以把writable的状态由true改为false，但是无法由false改为true。

* 除了<span style="color:blue">无法修改</span>，configurable:false还会<span style="color:blue">禁止删除</span>这个属性：

如果对象的某个属性是某个对象/函数的最后一个引用者，对这个属性执行delete操作之后，这个未引用的对象/函数就可以被垃圾回收。但是，不要把delete看作一个释放内存的工具（就像C/C++中那样），它就是一个删除对象属性的操作，仅此而已。





<span style="color:blue;">**enumerable** 可枚举</span>

这个描述符控制的是属性是否会出现在对象的属性枚举中，比如说for..in循环

* 设置成false，这个属性就不会出现在枚举中，可以正常访问它。

* 设置成true就会让它出现在枚举中。



<span style="color:blue;">**writable **可写</span>

writable决定是否可以修改属性的值。 ^75c010

如果其值为 false, 那么更新对应的属性值,不会发生变化;如果在严格模式下重写会报错.

可以把`writable:false`看作是属性不可改变，相当于你定义了一个空操作setter。严格来说，如果要和`writable:false`一致的话，你的setter被调用时应当抛出一个`TypeError`错误。

```javascript
'use strict'

let myObject = {};

Object.defineProperty(myObject, 'a', {
  value: 2,
  writable: false,
  enumerable: true,
  configurable: true
})

myObject.a = 3; //TypeEror
```



<span style="color:blue;">**value**值</span>

包含该属性的数据值. 默认为undefined.



##### 1.2 修改数据属性的默认特性

修改属性的默认特性用到方法`Object.defineProperty()`方法, 它有3个参数: 属性所在的对象, 属性名, 一个描述符对象.

```js
Object.defineProperty(person, 'name', {
  writable: false,
  value: 'newmack',
  configurable: false,
  enumerable: false
})

console.log(Object.getOwnPropertyDescriptor(person, 'name'));

//执行到这里会报错, 因为configurable设置为false,后面就不能对该属性的4个特性进行修改 Uncaught ReferenceError: person is not defined
Object.defineProperty(person, 'name', {configurable: true});

//person.name = 'lucy'; 由于writable为false,代码执行到这里会报错  Uncaught ReferenceError: person is not defined
//delete person.name    由于configurable为false, 代码执行到这里会报错. 
//enumerable为false的属性, 不能通过for-in循环返回
```





#### 2. 访问器属性 getter/setter

##### 概述

> 除了对象的**数据属性**(即有一个名字和普通的值)之外, JS还支持为对象定义**访问器属性**(accessor property), 这种属性不是一个值,而是一个或两个访问器方法: 一个获取方法(getter), 一个设置方法(setter).
>
> 访问器属性不能直接定义，要通过Object.defineProperty()这个方法来定义。

当程序<u>读取一个访问器属性</u>的值时,JS会调用获取方法(不传参数). 这个方法的返回值就是属性访问表达式的值. 

当程序<u>设置一个访问器属性</u>的值时,JS会调用设置方法,传入赋值语句右边的值. 设置方法的返回值会被忽略.

如果一个属性既有获取方法也有设置方法,则该属性是一个<span style="color:blue">可读写属性. </span>

如果只有一个获取方法,那它就是<span style="color:blue">只读属性</span>.

如果只有一个设置方法,那它就是<span style="color:blue">只写属性</span>(这种属性通过数据属性是无法实现的),读取这种属性始终会得到undefined.



对象默认的[[Put]]和[[Get]]操作分别可以控制属性值的设置和获取。

在ES5中可以使用getter和setter部分改写默认操作，但是只能应用在单个属性上，无法应用在整个对象上。

getter是一个隐藏函数，会在获取属性值时调用。

setter也是一个隐藏函数，会在设置属性值时调用。

**访问描述符**: 定义了getter、setter或者两者都有的一个属性. JS会忽略其value和writable,取而代之的是关心set和get,configurable,enumerable.

**数据描述符**: 和上面相对,没有定义getter, setter

如何定义getter/setter



**定义**

访问器属性可以通过对象字面量的一个扩展语法来定义(获取方法/设置方法是在ES5中引入的):

```javascript
let o = {
  //一个普通的数据属性
  dataProp: vaule,
  
  //通过一对函数定义的一个访问器属性
  get accessorProp() { return this.dataProp },
  set accessorProp(value) { this.dataProp = vaule }
}
```

访问器属性是通过一个或两个方法来定义的,方法名就是属性名.除了前缀是get和set之外,这两个方法看起来就想用ES6简写语法定义的普通方法一样(在ES6中,也可以使用计算的属性名来定义获取方法和设置方法. )

访问器属性的复杂操作

```Javascript
let p = {
  //x y 是常规的可读写属性
  x: 1.0,
  y: 1.0,
  
  //r是由获取和设置方法定义的可读写访问器属性
  get r() { return Math.hypot(this.x, this.y)},
  set r(value) {
    let oldvalue = Math.hypot(this.x, this.y)
    let ratio = newvalue / oldvalue
    this.x *= ratio
    this.y *= ratio
  },
  
  //theta是一个定义了获取方法的只读访问器属性
  get theta() { return Math.atan2(this.y, this.x )}
}

p.r
p.theta //
```





**继承**

和数据属性一样, 访问器属性也是可以继承的.因此可以把上面定义的p对象作为其他对象的原型.



**实例**

<u>通过获取方法返回随机数</u>

```javascript
//给出一个0-255之间的随机数

const random = {
  get octet() { return Math.floor(Math.random()*256)},
  get uint16() { return Math.floor(Math.random()*65536); },
  get int16() { return Math.floor(Math.random()*65536) - 32768; }
}
```



##### 2.1访问器属性4特性

<span style="color:blue;">**configurable**</span>

>  默认为false. 表示能否通过delete删除属性从而重新定义属性，能否修改属性的特性，或能否把属性修改为访问器属性

<span style="color:blue;">**enumerable**</span>

表示能否通过for-in循环返回属性,默认为false

<span style="color:blue;">**Get**</span>

在读取属性时调用的函数,默认值为undefined

<span style="color:blue;">**Set**</span>

在写入属性时调用的函数,默认值为undefined

```js
//访问器属性不包含数值,它包含的是一对getter和setter函数. 访问器属性不能像数据一样直接定义,它必须使用Object.defindeProperty()方法来定义

let book = {
  _year = '2017', //下划线表示是内部属性,只能通过对象的方法来读写
  editor: 1
}

Object.defineProperty(book, 'year', {
  get: function () {
    return this._year;
  },
  //若只指定get方法,不指定set方法,那就默认该属性是只读的.
  set: function (newYear) {
    if(newYear !== this._year) {
      this._year = newYear;
      this.editor++;
    }
  }
})

//打印出属性year的特性描述
console.log(Object.definePropertyDescriptor(book, 'year'));
Object {enumearble: false, configurable: false, get:function, set:function}
//关于configurable这个特性，因为访问器属性里面这个特性默认值为false，如果程序后面需要对该属性进行delete操作等，那就在定义访问器属性时，将这个特性设置为true，不然这个会导致后面一些报错的问题。
```



##### 2.2 `for...in`与`enumerable`

`enumerable`属性和`for...in`循环

* `enumerable`值为`true`, 属性会出现在`for...in`循环中
* `enumerable`值为`false`, 属性不会出现在`for...in`循环中
* 无论`enumerable`值为什么, `in`操作符都正常使用

> 注意:
>
> 数组上应用for..in循环有时会产生出人意料的结果，因为这种枚举不仅会包含所有数值索引，还会包含所有可枚举属性



**区分属性是否可枚举的方法**

* `for...in`
* `Object.prototype.propertyIsEnumerable('a')`

`propertyIsEnumerable(..)`会检查给定的属性名是否直接存在于对象中（而不是在原型链上）并且满足`enumerable:true`。



`in`和`hasOwnProperty(..)`的区别在于是否查找[[Prototype]]链，

`Object.keys(..)`和`Object.getOwnPropertyNames(..)`都只会查找对象直接包含的属性。

##### 2.3 如何获取操作符'in'使用的属性列表

（目前）并没有内置的方法可以获取in操作符使用的属性列表.

不过你可以递归遍历某个对象的整条[[Prototype]]链并保存每一层中使用Object.keys(..)得到的属性列表——只包含可枚举属性。

```javascript
let obj = {};
let res = [Object.keys(obj)];

while(true) {
  let proto = Object.getPrototypeOf(obj);
  if (proto === null) return
  
  res.concat(Object.keys(proto))
  obj = proto
}


//Object.prototype中的属性是不可枚举的

Object.getOwnPropertyDescriptor(Object.prototype, 'constructor')

configurable: true
enumerable: false
value: ƒ Object()
assign: ƒ assign()
create: ƒ create()
defineProperties: ƒ defineProperties()
defineProperty: ƒ defineProperty()
entries: ƒ entries()
freeze: ƒ freeze()
fromEntries: ƒ fromEntries()
getOwnPropertyDescriptor: ƒ getOwnPropertyDescriptor()
getOwnPropertyDescriptors: ƒ getOwnPropertyDescriptors()
getOwnPropertyNames: ƒ getOwnPropertyNames()
getOwnPropertySymbols: ƒ getOwnPropertySymbols()
getPrototypeOf: ƒ getPrototypeOf()
hasOwn: ƒ hasOwn()
is: ƒ is()
isExtensible: ƒ isExtensible()
isFrozen: ƒ isFrozen()
isSealed: ƒ isSealed()
keys: ƒ keys()
length: 1
name: "Object"
preventExtensions: ƒ preventExtensions()
prototype: {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}
seal: ƒ seal()
setPrototypeOf: ƒ setPrototypeOf()
values: ƒ values()
arguments: (...)
caller: (...)
[[Prototype]]: ƒ ()
[[Scopes]]: Scopes[0]
writable: true
[[Prototype]]: Object
```




### getter vs Object.defineProperty()

get和Object.defineProperty()用在类上差异不大,效果相同.

```js
class Example {
	get hello() {
		return 'world'
	}
}

const obj = new Example()
console.log(obj.hello) //'world'

console.log(Object.getOwnPropertyDescriptor(obj, 'hello')) //undefined
console.log(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), 'hello'))

//// { configurable: true, enumerable: false, get: function get hello() { return 'world'; }, set: undefined }
```



## 查询和设置属性

#### 属性操作(访问/设置)

左边应该是一个表达式,其值为一个对象.

* `.`操作符  被称为'属性访问'.  右边必须是一个命名属性的简单标识符, 需要满足标识符的命名规范
* `[]`操作符 被称为'键访问'.   方括号中的值必须是一个表达式,其结果为包含目的属性名的字符串.可以接受任意UTF-8/Unicode字符串作为属性名
  * 更准确说法: 该表达式必须求值为一个字符串或一个可以转换为字符串或符号的值.


```javascript
let author = book.author;  //取得book的author属性
let name = author.name; //取得author的'name'属性
let title = book['main title']; //取得book的'main title'属性
```

要创建或设置属性,与查询属性一样,,使用点或方括号,但它们会放在赋值表达式的左边.

```javascript
book.edition = 8
```



属性名的类型

* **字符串** 如果你使用string（字面量）以外的其他值作为属性名，那它首先会被转换为一个字符串。

可计算属性名

* 通过<u>表达式</u>来计算属性名,来获取相应的属性名.

* 可计算属性名最常用的场景可能是ES6的符号（Symbol）

```javascript
let obj = {
  [Symbol.Something] : 'hello world'
}
```



#### 属性设置中的继承

为对象o的属性x赋值,有三种情况:

1. 如果o有一个名为x的自有(非继承)属性,赋值行为会修改已有x属性的值
2. 如果o没有名为x的属性, 则会在对象o上创建一个名为x的属性
3. 如果o之前继承了x,现在这个<span style="color:red">继承的属性</span>会被新赋值的同名属性<span style="color:red">覆盖.</span>

属性赋值查询原型链只为确定是否允许赋值. 如果o继承了一个名为x的只读属性,则不允许赋值.注意: 如果允许赋值,则只会在原始对象上创建或设置属性,而不会修改原型链中的对象.

<span style="color:red">查询属性时会用到原型链, 设置属性时不影响原型链是重要的JS特性</span>



#### 访问不存在的属性

**类型**

属性访问表达式并不能总是会返回或设置值. 在null 或 undefined上设置属性也会导致TypeError.

<span style="color:blue">查询不存在的属性不是错误</span>. 如果在o的自有属性和继承属性中都没有找到属性x, 则属性访问表达式`o.x`的求值结果为 `undefined`. 

<span style="color:blue">查询不存在的对象的属性则是错误</span>.因为null或undefined没有属性,查询这两个值得属性是错误.

##### 如何避免 3种

```javascript
//简单却麻烦写法
let surname = undefined
if (book) {
  if (book.author) {
    surname = book.author.surname
  }
}

//取得surname,null或undefined的简洁惯用技术
surname = book && book.author && book.author.surname

//ES2020 可选链操作符 ?.
let surname = book?.author?.suranme
```



##### **属性设置失败的情况**  ????

在对象o上设置属性p在以下情况会失败:

* o有一个只读自有属性p: 不能设置只读属性
* o有一个只读继承属性p: 不能用同名自有属性隐藏只读继承属性
* o没有自有属性p,o没有继承通过设置方法定义的属性p,o的extensible特性是false. 因为p在o上不存在,如果没有要调用的设置方法,那么p必须要添加到o上. 但如果o不可扩展(extensibl为false),则不能再它上面定义新属性.





#### 读取对象的属性发生了什么?

在语句规范中, `obj.a`在obj上实际上是实现了[[Get]]操作(有点像函数调用: `[[Get]]()` ).

* 对象默认的内置`[[Get]]`操作, 首先在对象中查找是否有名称相同的属性,如果有就返回属性的值.
* 如果没有找到名称相同的属性,`[[Get]]`算法会从原型链上查找属性.
* 如果找不到, 返回值undefined



#### 赋值对象的属性发生了什么??

如果已经存在这个属性，[[Put]]算法大致会检查下面这些内容。

1．属性是否是访问属性(getter) ？如果是并且存在setter就调用setter。

2．属性的数据描述符中writable是否是false？如果是，在非严格模式下静默失败，在严格模式下抛出TypeError异常。

3．如果都不是，将该值设置为属性的值。

如果属性不存在,  第五章.(你不知道的JS)



#### 属性和方法的区别

如果访问的对象属性是一个函数, 把对象内部引用的函数称为“方法”似乎有点不妥。

严格来说，函数永远不会“属于”一个对象.

> 来自 本文件中的this->隐式绑定

* 因为JavaScript是基于函数作用域的(ES6中增加了块作用域),<span style="color:blue">JavaScript中的对象没有作用域的概念.</span>

* <span style="color:blue">对象属性函数的作用域是全局对象</span>,你可以在其内部中访问全局变量,但是不能访问到对象中的属性, <span style="color:blue">也就是说属性函数的作用域链上并不包含这个对象</span>, 如果要访问对象中的属性,只能在函数里使用this.'属性'来访问,并且对函数的调用方式是obj.fn()



#### 重复的对象字面量属性

ECMAScript 5严格模式中加入了对象字面量重复属性的校验，当同时存在多个同名属性时会抛出错误。

但是在ECMAScript6中重复属性检查被移除了，无论是在严格模式还是非严格模式下，代码不再检查重复属性，**对于每一组重复属性，都会选取最后一个取值**.

```javascript
//ES6
'use strict'
let person = {
  name: 'Nicholas',
  name: 'Greg'
};
console.log(person.name); //'Greg'
```

## 删除属性

#### 概述

delete操作符用于从对象中移除属性.它唯一的操作数应该是一个属性访问表达式. 它并不操作属性的值,而是操作属性本身.

delete操作符只删除自有属性,不删除继承属性(要删除继承属性,必须从定义属性的原型对象上删除.这样做会影响继承该原型的所有对象)

#### 返回值

如果delete操作成功或没有影响(如删除不存在的属性),则delete表达式求值为true. 

对非属性访问表达式(无意义地)使用delete,同样也会求值为true:

```javascript
let o = {x : 1}
delete o.x //true 删除属性x
delete o.x //true 什么也不做仍然返回true
delete o.toStrin //true 什么也不做(toString不是自有属性)
delete 1 // true. 无意义,仍然返回true
```

#### 其他情况

##### configurable

delete不会删除configurable属性为false的属性.

<u>那些属性是不可配置的呢?</u>

* 通过变量声明或函数声明创建的全局对象的属性
* 某些内置对象的属性

获取这些对象属性的configurable的值,可通过`Object.getOwnPropertyDescriptor()`来获取, 其值为布尔值.

##### 严格模式与非严格模式

* 在严格模式下,删除不可配置的属性会导致TypeError. 在非严格模式下,delete直接求值为false
* 在非严格模式下删除全局对象可配置的属性时,可省略对全局对象的引用,只在delete操作符后面加上属性名
* 在严格模式下,如果操作数是一个像x这样的非限定标识符,delete会抛出SyntaxError, 即必须写出完整的属性访问表达式.



## 测试属性

检查对象是否有一个给定名字的属性,

* 直接查询

* in操作符
* hasOwnProperty()
* propertyIsEnumerable()

in**操作符**

in操作符要求左边是一个属性名,右边是一个对象. 如果对象包含相应名字的自有属性或继承属性,将返回true.

**hasOwnProperty()**

用于测试对象是否有给定名字的属性, 对继承的属性它返回false

**propertyIsEnumerable()**

细化了hasOwnproperty()方法. 如果传入的属性是自有属性且这个属性的enumerable特性为true, 这个方法返回true.

某些内置属性是不可枚举的,使用常规JS代码创建的属性都是可枚举的,除非使用Object.defineProperty创建不可枚举的属性.

**最简单的方式**

* in
* 属性查询`obj.a !== undefined`

```javascript
let o = {x:1}
o.x !== undefined //true o有属性x
o.y !== undefined //false o没有属性y
o.toString !== undefined //true  o继承了toString属性
```



两者的区别:

in可以区分不存在的属性和存在但仍被设置为undefined的属性.

```javascript
let o = {x:undefined}
o.x !== undefined //false 
o.y !== undefined //false 属性y不存在
'x' in o //true
'y' in o //false
delete o.x
'x' in o //false

```



#### 判断属性存在与否

例如,如何区分访问对象属性的值为undefined时,其是否是显式声明的undefined还是不存在?

可以在不访问属性值的情况下判断对象中是否存在这个属性：

* `in`操作符: 检查属性名是否在对象及其[[Prototype]]原型链中
* `hasOwnProperty`只会检查属性是否在对象中,不检查原型链
  * `Object.create(null)` 没有原型,无法使用`has...`
  * 强制解决: `Object.prototype.hasOwnProperty.call(obj, 'a')`


## 枚举属性

#### 5种方式

遍历或获取对象的所有属性,有 5 种方式:

* for...in
* Object.keys()
* Object.getOwnPropertyNames()
* Object.getOwnPropertySymbols()
* Reflect.ownkeys()

##### for...in

> for...in循环对指定对象的每个可枚举(自有或继承)属性都会运行一次循环体. 根据书中所指,这里的继承是指Object.create()继承了自己写的一个对象.
>
> 对象继承的内置方法是不可枚举的

```javascript
let o = {x:1, y:2, z:3}
o.propertyIsEnumerable('toString') //false  toString不可枚举(也不是自有属性)
for (let p in o) {
  console.log(p);  //打印x,y,z, 但没有toString
}
```

为防止for...in枚举继承的属性,可以在循环体内加一个显示测试

```javascript
for (let p in o) {
  if (!o.hasOwnProperty(p)) continue //跳过继承属性
}

for (let p in o) {
  if (typeof o[p] === 'function') continue //跳过所有方法
}
```



除了使用for...in循环,有时候可以先获取对象所有属性名的数组,然后再通过for/of循环遍历数组. 有4个函数可以获取属性名数组:

##### Object.keys()

返回对象可枚举自有属性的数组. 不包含不可枚举属性, 继承属性或名字是符号的属性.



##### Object.getOwnPropertyNames()

与Object.keys()类似, 但也返回不可枚举自有属性名的数组, 只要他们的名字是字符串.

##### Object.getOwnPropertySymbols()

返回名字是符号的自有属性,无论是否可枚举.

##### Reflect.wonkeys()

返回所有属性名,包括可枚举和不可枚举属性,以及字符串属性和符号属性.

#### 属性枚举顺序

> ES6正式定义了枚举对象自有属性的顺序. 
>
> Object.keys(), Object.getOwnPropertyNames(), Object.getOwnPropertySymbols(), Reflect.ownKeys()及JSON.stringify()等相关方法都按照下面的顺序列出属性, 另外也受限于它们要列出不可枚举属性还是列出字符串属性或符号属性.

1. 先列出名字非负整数的字符串属性, 按照数值顺序从最小到最大. 这条规则意味着数组和类数组对象的属性会按照顺序被枚举
2. 在列出类数组索引的所有属性之后,再列出所有剩下的字符串名字(包括看来器想负数或浮点数的名字)的属性. 这些属性按照它们添加到对象的先后顺序列出. 对于在对象字面量中定义的属性,按照它们在字面量中出现的顺序列出.
3. 最后, 名字为符号对象的属性按照它们添加到对象的先后顺序列出.



for...in循环的枚举顺序并不像上述枚举函数那么严格,但实现通常会按照上面描述的顺序枚举自有属性, 然后再沿原型链上溯,以同样的顺序枚举每个原型对象的属性. 不过要注意, 如果已经有同名属性被枚举过了,甚至如果有一个同名属性是不可枚举的, 那么这个属性就不会枚举了.





#### ES5和ES6属性枚举的区别

>  ECMAScript 5中未定义对象属性的枚举顺序，由JavaScript引擎厂商自行决定。然而，ECMAScript6严格规定了对象的自有属性被枚举时的返回顺序，这会影响到Object.getOwnPropertyNames()方法
>
>  Reflect.ownKeys返回属性的方式，
>
>  Object.assign()方法处理属性的顺序.



#### 自有属性枚举顺序规则

* 所有数字键按升序排序
* 所有字符串键按照他们被加入对象的顺序排序
* 所有Symbol键按照他们被加入对象的顺序排序

 ```javascript
let obj = {
  a: 1,
  0: 1,
  c: 1,
  2: 1,
  b: 1,
  1: 1
};

obj.d = 1;

console.log(Object.getOwnPropertyNames(obj).join('')); '012acbd'
 ```

**注意**

对于for-in循环，由于并非所有厂商都遵循相同的实现方式，因此<span style="text-decoration:underline wavy">仍未指定一个明确的枚举顺序</span>；而<span style="text-decoration:underline double red;">Object.keys()方法和JSON.stringify()方法都指明与for-in使用相同的枚举顺序，因此它们的枚举顺序目前也不明晰。</span>

#### for...in枚举

`for...in`语句以任意顺序遍历一个对象的除了[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)以外的[可枚举](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)属性.

**数组迭代和for...in的关系**

for...in不应该用于迭代一个关注索引顺序的Array

`for ... in`是为遍历对象属性而构建的，不建议与数组一起使用，数组可以用`Array.prototype.forEach()`和`for ... of`处理有`key-value`数据（比如属性用作“键”），需要检查其中的任何键是否为某值的情况时，还是推荐用`for ... in`

**仅迭代自身的属性?**

如果你只要考虑对象本身的属性，而不是它的原型，那么使用 [`Object.getOwnPropertyNames()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames) 或执行 [`Object.prototype.hasOwnProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) 来确定某属性是否是对象本身的属性（也能使用[`propertyIsEnumerable`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable)）



```js
//作用
for-in 来枚举对象中的属性及原型上的属性
//语法:
	for(let 变量 in 对象){
		语句...
	}
    
//for...in无法对symbol私有属性遍历
let sys = Symbol();
const obj = {
  name:'jack',
  [symbol]:'objSymbol'
}
for(let i in obj){
  console.log(i); //只能打印name属性
}
	
//示例 for...in遍历自身及原型上的属性
let obj ={a:1, b:2, c:3};
function addObj(){
	this.d = 4;
}
addObj.prototype = obj;
let newObj = new addObj;
for(let i in newObj){
  console.log(i);  //d a b c
};
 
//示例 hasOwnProperty+for...in
let obj = {a:1,b:2,c:3};
function addObj(){
  this.d = 4;
}
addObj.prototype = obj;
let newObj = new addObj;
for(let i in newObj){
  if(newObj.hasOwnProperty(i)){
    console.log(i); //d
  }
}
```



#### 遍历对象循环方式的比较

> 枚举 enumerable  可数的,可列举的,可枚举的
>
> 遍历 traverse
>
> 迭代 iterator

```js
for循环 for..in    for..of  object.keys()

forEach 是数组的一个方法，主要页是用来遍历数组的，效率最高，但是不可以使用continue和break
for循环是js当中最简单的遍历方法  主要是针对数组进行遍历的，效率不高，但是可以使用continue和break
for..in 循环主要是用来遍历对象的（遍历对象的可枚举属性的） 效率最低，原因是因为不但要遍历自身的属性还要遍历原型的

for..of 是es6里面新加的一种遍历方法（前提必须是可迭代对象），效率没有forEach高（比其它的要高），也可以使用continue和break，for..of只能针对可迭代对象

遍历对象最快的方法也是使用forEach 是把对象属性转化为数组然后进行遍历
Object.keys(searchParams) 是把一个对象转化为数组，这个数组当中存储的是这个对象所有的属性
```



####  遍历对象的 9种方法

> https://mp.weixin.qq.com/s/RbuZWsgO4hzsbnzqViN99w



| 类型                              | 特点                                                         |
| :-------------------------------- | :----------------------------------------------------------- |
| Object.keys(obj)                  | 返回对象本身可直接枚举的属性(不含Symbol属性）                |
| Object.values(obj)                | 返回对象本身可直接枚举的属性值(不含Symbol属性）              |
| Object.entries(obj)               | 返回对象本身可枚举属性键值对相对应的数组(不含Symbol属性）    |
| Object.getOwnPropertyNames(obj)   | 返回对象所有自身属性的属性名（不包括Symbol值作为名称的属性） |
| Object.getOwnPropertySymbols(obj) | 返回一个给定对象自身的所有 Symbol 属性的数组                 |
| for……in                           | 所有可枚举的属性（包括原型上的）                             |
| for……of                           | 必须部署了Iterator接口后才能使用，例如数组、Set和Map结构、类数组对象、Generator对象以及字符串 |
| forEach                           | break不能中断循环                                            |
| Reflect.ownKeys(obj)              | 对象自身所有属性                                             |






## 序列化对象

**对象序列化(serialization)**是把对象的状态转换为字符串的过程,之后可以从中恢复对象的状态.

函数JSON.stringify() 和 JSON.parse() 用于序列化和恢复JS对象. 这两个函数使用JSON数据交换格式. JSON表示JavaScript Object Notation(JavaScript 对象表示法), 其语法与JavaScript对象和数组字面量非常相似.

```JavaScript
let o = {x:1, y:{z:[false, null, '']}} //定义一个对象
let s = JSON.stringify(o); //s == '{"X":1, "y":{"z": [false, null, ""]}}'
let p = JSON.parse(s);     //p == {x:1, y:{z:[false, null, '']}}
```

#### JSON语法概述

**概述**

JSON语法是JS语法的子集,不能表示所有的JS的值. 可以序列化和恢复的值包括<span style="color:blue">对象/数组/字符串/有限数值/true/false/null</span>.

<span style="color:red">NaN/Infinity/-Infinity</span>会被序列化成null. 

日期对象会被序列化成ISO格式的日期字符串(参见Date.toJSON()函数),但JSON.parse()会保持其字符串形式,不会恢复原始的日期对象.

<span style="color:red">函数/RegExp/Error对象/undefined值</span>不能被序列化或修复.

JSON.stringify只序列化对象的可枚举自有属性. 如果属性值无法序列化,则该属性会从输出的字符串中删除.

JSON.stringify()和JSON.parse()都接收可选的第二个参数,用于自定义序列化及恢复操作.



## 方法定义

> 对象属性也可以是一个[函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions)、[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)、[setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)方法。

```javascript
var o = {
  property: function([parameters]) {},
  get property() {},
  set property(value) {}
}

//ES2015引入简短写法, 'function'关键字可以省略

//shorthand method names(ES6)
let o = {
  property([parameters]) {},
  get property() {},
  set property(value) {}
}
```

ECMAScript 2015 提供了一种简明地定义以生成器函数作为值的属性的方法。

```javascript
var o = {
  * generator() {
    //
  }
}

//ES5中可以这样写(需要注意的是 ES5 没有生成器)
var o = {
  generatorMehtod: function *() {
    //
  }
}
```



## 对象原型方法

ECMAScript其中一个设计目标是：不再创建新的全局函数，也不在Object.prototype上创建新的方法。

从ECMAScript 5开始，避免创建新的全局方法和在Object.prototype上创建新的方法。 当开发者想向标准添加新方法时，他们会找一个适当的现有对象。

而在ECMAScript 6中，为了使某些任务更易完成，在全局Object对象上引入了一些新方法。

#### 实例方法





####   in

```Markdown
in 
	如果指定的属性在指定的对象或其原型链中，则in 运算符返回true。参数prop是指属性名或者数组索引
	语法: '属性名' in 对象   //注意加引号,是字符串.不加引号会被认为是一个变量
	如果对象中有这个属性名,返回true.如果没有返回false
	
	
delete
	用来删除对象中的指定属性,无论有没有这个属性,返回true 
	语法: 
  delete obj.username
  delete obj['a-b']   
	
hasOwnproperty
hasOwnProperty() 检查属性是否存在于对象自身中
```







JS中对象的**属性值**可以是任意类型的数据,也可以是一个对象

```JavaScript
let obj = Object();

obj.age = 18;
obj.test = Object();
obj.test.name = '猪八戒';
obj.test.tt = Object();

```

 

#### delete
[[delete|delete]]

```js
delete obj.pro
delete obj[pro]
```




#### toJSON()

Object.prototype并非定义toJSON()方法,但JSON.stringify()方法会从要序列化的对象上寻找toJSON()方法. 如果要序列化的对象上存在这个方法就会调用它,然后序列化该方法的返回值, 而不是原始对象.

Date类定义了自己的toJSON()方法,返回一个表示日期的序列化字符串.

```javascript
let point = {
  x: 1,
  y: 2,
  toString: function() {return `${this.x}, ${this.y}`},
  toJSON: function() { return this.toString() }
}
```



#### 3. Object.prototype.toString()

**Define**

> the method returns a string representing the object.

**Syntax**

```javascript
toString()
```

**Return value**



**Desc**

Every object has a `toString()` method that is automatically called when the object is to be represented as a text value or when an object is referred to in a manner in which a string is expected(或当以预期字符串方式引用对象时).

By default, the `toString()` method is inherited by every object descended from `Object`. If this method is not overridden in a custom object, `toString()` return `[object type]`, where `type` is the object type. 

The following code illustrates this:

```javascript
const o = new Object();
o.toString(); //[object Object]
```

很多类都会重新定义自己的toString方法.例如,在把数组转换为字符串时,可以得到数组元素的一个列表,每个元素也都会转换为字符串; 把函数转换为字符串时,可以得到函数的源代码.



Note:

> Starting in JavaScript 1.8.5, 'toString()' called on null returns '[object null]', and undefined returns '[object undefined]', as defined in the 5th Edition of ECMAScript and subsequent Errata.

**Parameters**

For Numbers and BigInts `toString()` takes an optional parameter `radix` the value of radix must be minimun 2 and maximum 36.

By using `radix` you can also convert base 10 numbers(like 1,2,3,4,5,....) to another base numbers, in example blow we are conveting base 10 number to a base 2 (binary) number.

```javascript
let base10Int = 10;
console.log(base10Int.toString(2)); //1010
```

and same for big integers

```javascript
let bigNum = BigInt(20);
console.log(bigNum.toString()); //10100
```



**Examples**

<u>1.Overriding the default toString method</u>

You can create a function to be called in place of the default `toString()` method. The `toString()` method takes no arguments and should return a string. The `toString()` method you create can be any value you want, but it will be most useful if it carries information about the object.

The following code defines the 'Dog' object type and creates 'theDog', an object of type 'Dog':

```javascript
function Dog(name, breed , color, sex) {
  this.name = name;
  this.breed = breed;
  this.color = color;
  this.sex = sex;
}

theDog = new Dog('Gabby' , 'Lab', 'chocolate', 'female');
```

If you call the 'toString()' method on this custom object, it returns the default value inherited from `Object`:

```javascript
theDog.toString() //'[object Object]'
```

The following code create and assigns 'dogToString()' to override the default 'toString()' method. This function generates a string containing the 'name breed color and sex'of the object, in the form 'property =value'.

```javascript
Dog.prototype.toString = function dogToString() {
  const ret = 'Dog ' + this.name + ' is a ' + this.sex + ' ' + this.color + ' ' + this.breed;
  return ret;
}
```

With the preceding code in place, any time `toString()` is used in a `Dog` context, JavaScript automatically calls the `dogToString()` function, which returns the following string:

```javascript
"Dog Gabby is a female chocolate Lab"
```



<u>2.Using toString() to detect object class</u>

`toString()` can be used with every object and (by default) allows you to get its class.

To use the `Object.prototype.toString()` with every object, you need to call [`Function.prototype.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) or [`Function.prototype.apply()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) on it, passing the object you want to inspect as the first parameter (called `thisArg`).

```javascript
cosnt toString = Object.prototype.toString;

toString.call(new Date);    // [object Date]
toString.call(new String);  // [object String]
toString.call(Math);        // [object Math]

// Since JavaScript 1.8.5
toString.call(undefined);   // [object Undefined]
toString.call(null);        // [object Null]
```

Using `toString()` in this way is unreliable; objects can change the behavior of `Object.prototype.toString()` by defining a [`Symbol.toStringTag`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) property, leading to unexpected results. For example:

```javascript
const myDate = new Date();
Object.prototype.toString.call(myDate);     // [object Date]

myDate[Symbol.toStringTag] = 'myDate';
Object.prototype.toString.call(myDate);     // [object myDate]

Date.prototype[Symbol.toStringTag] = 'prototype polluted';
Object.prototype.toString.call(new Date()); // [object prototype polluted]
```

Note:

```javascript
toString.call(true); //[object Boolean]

'toString' in window' //true
```



#### 4. Object.prototype.valueOf()

**Define**

> this method returns the **primite value** of the specified object

与toString()类似,通常在对象转换为某些非字符串原始值(通常是数值)时被调用.内置的一些类定义了自己的valueOf()方法: Date类的valueOf()可以将日期转换为数值,这样就让日期对象可以通过`< 和 >`操作符进行比较.

**Syntax**

> valueOf()

**Return value**

the primitive value of the specified object.

A [(unary) plus sign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus) can sometimes be used as a shorthand for valueOf. e.g. in `+new Number()`.

**Desc**

<u>JavaScript calls the `valueOf` method to convert an object to a primitive value.</u> You rarely need to invoke the `valueOf` method yourself, JavaScript **automatically invoke it** when encountering  an object where a primitive value is expected.

By default, the `valueOf` method is inherited by every object descended from `Object`. Every built-in core object overrides this method to return an appopriate value. **If an object has no primitive value, `valueOf` returns the object iteself.**

<u>You can use `valueOf` within your own code to convert a built-in object into a primitive value.</u> When you create a custom object, you can override `Object.prototype.valueOf()` to call a custom method instead of the default  `Object` method.

Overriding valueOf for custom objects

You can create a function to be called in place of the default `valueOf` method. Your function must take no arguments.

Suppose you have an object type `MyNumberType` and you want to create a `valueOf` method for it. The following code assigns a user-defined function to the object's `valueOf` method.

```javascript
MyNumberType.prototype.valueOf = function() {return customPrimitiveValue;};
```

With the preceding code in place(使用上述代码), any time an object of type `MyNumberType` is used in a context where ti is to be represented as a primitive value,(只要在上下文中使用`MyNumberType`类型的对象,该对象将表示为私有值), JavaScript automatically calls the function defined in the preceding code.

An object's `valueOf` method is usually invoked by JavaScript, but you can invoke it yourself as follows:

```javascript
myNumberType.valueOf()
```

Note:

> Objects in string contexts convert via the 'toString()' method, which is different from 'String' objects converting to string primitive using 'valueOf'. All objects hava a string convertion, if only "[object type]". But many objects do not convert to number, boolean or function.

**Examples**

Using valueOf on custom types

```javascript
function MyNumberType(n) {
  this.number = n;
}
MyNumberType.prototype.valueOf = function() {
  return this.number;
};

let myObj = new MyNumberType(4);
myObj + 3 ;//7
```

Using uary plus

```javascript
+"5" // 5 (string to number)
+"" // 0 (string to number)
+"1 + 2" // NaN (doesn't evaluate)
+new Date() // same as (new Date()).getTime()
+"foo" // NaN (string to number)
+{} // NaN
+[] // 0 (toString() returns an empty string list)
+[1] // 1
+[1,2] // NaN
+new Set([1]) // NaN
+BigInt(1) // Uncaught TypeError: Cannot convert a BigInt value to a number
+undefined // NaN
+null // 0
+true // 1
+false // 0
```





#### Object.prototype.hasOwnProperty()

##### define

> the method returns a boolean indicating whether the object has the specified property as its own property(as opposed to inheriting it)
>
> Note: `Object.hasOwn()` is recommended over `hasOwnProperty()`, in browsers where it it supported.

##### Syntax

> hasOwnProperty(prop)

##### Parameters

`prop`

* The `String` name or `Symbol` of the property to test

##### Return values

> returns `true` if the object has the specified property as own property, `false` otherwise.

##### Desc

* the method returns `true` if the specified property is a direct property of the object --even if the value is `null` or `undefined`.
* the method returns `false` if the property is inherited, or has not been declared at all.
* Unlike the `in` operator, this method does not check for the specified property in the object's prototype chain.
* the method can be called on most JS objects, because most objects descend from `Object`, and hence inherit its methods.
* <span style="color:red">the method will not be available in objects where it is reimplemented(在对象上重新实现了hasOwnProperty方法), or on objects created using `Object.create(null)`(as these don't inherit from `Object.prototype`).</span>


##### 实现
```js
//implement by self

Object.protoype.hasOwnProperty2 = function(key) {
	let obj = this;
	key = typeof key === 'symbol' ? key : String(key)
	return Object.getOwnPropertyDescriptor(obj, key) !== undefined
}

Object.prototype.getOwnProperty3 = function(key) {
	let obj = this;
	key = typeof key === 'symbol' ? key : String(key)
	return Object.keys(obj).includes(key)
}
```


##### 实例
在日常开发中, eslint不建议在对象上直接调用`hasOwnProperty`方法, 说是会有性能问题(why?).
所以会有如下几种变通方案:
```js
Object.prototype.hasOwnProperty.call(obj, key)
Object.hasOwn(obj, key)
key in obj
```



### Object.hasOwn()

#### 是什么
> 




### Object.defineProperty()

**define**

> the static method defines a new property directly on an object, or modifies an existing property on an object, and return the object.

**syntax**

> Object.definePorperty(object, prop, descriptor)

`object`

* the object on which to define the property

`prop`

* the name or Symbol of the property to be defined or modefied

`descriptor`

* the descriptor for the property being defined or modefied.

**return value**

the object that was passed to the function



**Desc**

this method allows a precise addition to or modification of a property on an object.

<u>Normal property addition through assignment(赋值) creates properties</u> which show up during property enumeration(for...in or Object.keys() method), whose values may be changed, and which may be deleted.

this method allows these extra details to be changed from their defaults.

<span style="text-decoration: underline wavy">By default, values added using `Object.defineProperty()` are <u>immutable(不可改变的)</u> and not enumerable.</span>

Property descriptors present in objects come in two main flavors:  data descriptors and accessor descriptor.

* A data descriptor is a property that has a value, which may or may not be writable
* An accessor descriptor is a property described by a getter-setter pair of functions.
* A descriptor must be one of these two flavors; it cannot be both.

Both data and accessor descriptors are objects. they share the following optional keys(note: the defaults mentioned here are in the case of defining properties using 'Object.defineProperty()'):

* `configurable`
  * true if the type of this proeprty descriptor may be changed and if the property may be deleted from the correspongding object.
  * default to false
* `enumerable`
  * true if and only if this property shows up during enumeration of the properties on the correspongding object.
  * default to false

**A data descriptor** also has the following optional keys:

* `value`
  * default to false
  * the value associated with the property. can be any valid JavaScript value (number, object, function, etc)

* `writable`
  * default to false
  * true if the value associated with the property may be changed with an <u>assignment operator(赋值运算符)</u>.

**A accessor descriptor** also has the following optional keys:

* `get`
  * A function which serves as a getter for the property, or undefined if there is no getter.
  * when the property is accessed, this function is called without arguments and with this set to the object through which the property is accessed(this may not be the object on which the property is defined due to inheritance). the return value will be used as the value of the property.(这个长句不明白. 当访问该属性时, 会调用这个函数,没有参数,但会传入this对象(由于继承关系,this并不一定是该属性的对象). 返回值会被用作属性的值.
  * default to undefined
* `set`
  * A function which serves as a setter for the property, or undefined if there is no setter.
  * when the property is assigned, this function is called with one argument(the value being assigned to the property) and with this set to the object through which the property is assigned.
  * default to undefined

If a descriptor has <u>neither of</u> `value` ,`writable`, `get` and `set` keys, ti is treated as a data descriptor. If a descriptor has both [`value` or `writable`] and [`get` or `set` ]keys, an exception is thrown.

Bear in mind that these attributes <u>are not necessarily(不一定是)</u> the descriptor's own properties. Inherited properties will be considered as well. In order to ensure these defaults are preserved, you might freeze the `Object` upfront, specify all options explicityly, or point to null with `Object.create(null)`. 



**修改属性**

Writable属性

当writable属性设为false时,该属性被称为'不可写的'. 它不能被重新赋值.

```javascript
let o = {};
Object.defineProperty(o, 'a', {
  value: 37,
  writable: false
});

console.log(o.a); //37
o.a = 25; //No error thrown(it would throw in strict mode, even if the value had been the same)
console.log(o.a); //37


//strict mode
(function() {
  'use strict'
  let o = {};
  Object.defineProperty(o, 'a', {
    value: 3,
    writable: false
  });
  
  o.a = 3; //throws TypeError: 'b' is read-only
  return o.b;
})();
```



Enumerable属性

`enumerable`定义了对象的属性是否可以在`for...in`循环和`Object.keys()`中被枚举.

```javascript
```



Configurable属性

`configurable`特性标识对象的属性是否可以被删除,以及除`value`和`writable`特性外的其他特性是否可以被修改.



添加多个属性和默认值

使用点运算符和 `Object.defineProperty()` 为对象的属性赋值时，数据描述符中的属性默认值是不同的

```javascript
let o = {};
o.a = 1;
//等同于
Object.defineProperty(o, 'a', {
  value: 1,
  writable: true,
  configurable: true,
  enumerable: true
})


Object.defineProperty(o, 'a', {value: 1});
//等同于
Object.defineProperty(o, 'a', {
  value: 1,
  writable: false,
  configurable: false,
  enumerable: false
})
```



继承属性

如果访问者的属性是被继承的，它的 `get` 和 `set` 方法会在子对象的属性被访问或者修改时被调用。如果这些方法用一个变量存值，该值会被所有对象共享。

```javascript
function myclass() {}

let value;
Object.defineProperty(myclass.prototype, 'x', {
  get() {
    return value;
  },
  set(x) {
    value = x;
  }
})
let a = new myclass();
let b = new myclass();

a.x = 1;
console.log(b.x); //1
```

可以通过将值存储在另一个属性中解决.在get和set方法中,this指向某个被访问和修改属性的对象.

```javascript
function myclass() {}

Object.defineProperty(myclass.prototype, 'x', {
  get() {
    return this.stored_x;
  },
  set(x) {
    this.stored_x = x;
  }
});

let a = new myclass();
let b = new myclass();

a.x = 1;
console.log(b.x);//undefined
```

不像访问者属性,值属性始终在对象自身上设置,而不是一个原型.然而,如果一个不可写的属性被继承,它仍然可以防止修改对象的属性.

```javascript
function myclass() {}

myclass.prototype.x = 1;
Object.defineProperty(myclass.prototype, 'y', {
  writable: false,
  value: 1
});

let a = new myclass();
a.x = 2;
console.log(a.x); // 2
console.log(myclass.prototype.x); // 1
a.y = 2; // Ignored, throws in strict mode
console.log(a.y); // 1
console.log(myclass.prototype.y); // 1

```



**实例**

> https://juejin.cn/post/6950664413317693470

使用defineProperty实现`a==1&&b==2&&c==3`为true

```javascript
var val = 0;
Object.defineProperty(window, 'a', {
  get() {
    return ++val;
  }
});
console.log(....); //true
```











### Object.prototype.toLocaleString()
> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString

#### 概述
Object实例的这个方法返回表示这个对象的字符串. 此方法旨在由派生对象重写，以用于特定于区域设置的目的。


#### 语法
```js
toLocaleString()
```

#### 入参
无
覆盖方法的对象接收至少2个入参,`locales`, `options`. 


#### 返回值
调用`this.toString()`的返回值

#### 描述
所有继承来自`Object.prototype`的对象(除了`null-prototype objects`)都继承了`toLocaleString()`方法. 
返回结果是调用`this.toString()`的结果.

这个方法的存在是为了确保所有对象都"至少"有一个 `toLocaleString()` 方法可用。一些内置对象像 `Array`、`Number`、`Date` 等会覆盖默认的 `toLocaleString()` 方法,使用一个更加特化的实现,以满足它们各自的需求。

- [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array): [[Array#Array.prototype.toLocaleString()]]
- [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number): [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString)
- [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date): [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)
- [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray): [`TypedArray.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/toLocaleString)
- [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt): [`BigInt.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt/toLocaleString)





<hr>


## 对象自身方法

### polyfill和shim的比较

> [Object.defineProperty是Es5中无法shim的特性 shim是什么？_夏目友人帐...的博客-CSDN博客_无法shim的特性](https://blog.csdn.net/xiaoyuer_2020/article/details/111364064)

* shim
  一个shim是一个库，它将一个新的API引入到一个旧的环境中，而且仅靠旧环境中已有的手段实现。

* polyfill

  一个polyfill是一段代码(或者插件)，提供了那些开发者们希望浏览器原生提供支持的功能

通常的做法是，先检查当前浏览器是否支持某个[API](https://so.csdn.net/so/search?q=API&spm=1001.2101.3001.7020)，如果不支持的话就加载对应的polyfill，然后新旧浏览器就都可以使用这个API了


### Object.hasOwn

#### define
> 如果规定的对象具有指定的属性作为它自身的属性就返回true; 如果属性是继承的,或不存在, 则返回false


#### syntax
```js
Object.hasOwn(obj, prop)
```

* obj: 需要测试的对象
* prop: 用来测试的字符串名称或Symbol

#### desc
* 它比`Object.prototype.hasOwnProperty()`更推荐使用, 因为它作用于`null-prototype objects`和重写了继承的方法`Object.prototype.hasOwnProperty`的对象.
* `Object.hasOwn`比调用`Object.prototype.hasOwnProperty`更直观

intuitive?(更直观)
```js

/ 第一种写法 - 直接调用（可能有风险）
obj.hasOwnProperty('prop')

// 第二种写法 - 安全但不直观
Object.prototype.hasOwnProperty.call(obj, 'prop')

// 更直观的写法 
Object.hasOwn(obj, 'prop')
```

### Object.is

当你想在JavaScript中比较两个值时，多使用全等运算符（===），从而避免在比较时触发强制类型转换的行为。

判断两个值是否为[同一个值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness).  于相等运算符,全等运算符一起可以来判断操作数是否为同一个对象的实例.

与`==`运算符不同,`Object.is`不会强制转换两边的值.

与`===`运算符不同,`Object.is`会将`-0`和`+0`视为不相等,将`Number.NaN`与`NaN`视为相等.

`+0  `和 `-0`在JavaScript引擎中被表示为两个完全不同的实体

ECMAScript 6引入了Object.is()方法来弥补全等运算符的不准确运算。这个方法接受两个参数，如果这两个参数类型相同且具有相同的值，则返回true。

```js
Object.is(value1,value2)

返回值:布尔值

//判断条件:



//示例
Object.is([], []);           // false

var foo = { a: 1 };
var bar = { a: 1 };
Object.is(foo, foo);         // true
Object.is(foo, bar);         // false

Object.is(null, null);       // true

Object.is(0, -0);            // false 
Object.is(0, +0);            // true
Object.is(-0, -0);           // true
Object.is(NaN, 0/0);         // true
Object.is(NaN,NaN);          //true
```

**Object.is与`===`比较**

```javascript
//不同
1.它适用于 NaN：Object.is(NaN，NaN) === true
2.Object.is(0，-0) === false，从技术上讲这是对的，因为在内部，数字的符号位可能会不同，即使其他所有位均为零。

//相同
在所有其他情况下，Object.is(a，b) 与 a === b 相同
```

#### 实例

**1.判定多个值相等**
```js
function recursivelyCheckEqual(x,...rest) {
	return Object.is(x, rest[0]) && (rest.length < 2 || recursivelyCheckEqual(...rest))
}
```

**2.零值相等**
>**将NaN视作相等，将+0和-0视作相等。**
`Map`**数据结构基于零值相等算法**，我们可以借助Map数据结构验证：

```js
const m = new Map();  
  
//Map内部使用SameValueZero比较操作，基本上相当于使用严格对象相等的标准来检查键的匹配性  
const a = 0/"",//NaN  
      b = 0/"";//NaN  
const pz = +0;  
const nz = -0;  
  
console.log(a === b);//false  
console.log(pz === nz);//true  
  
m.set(a, "foo");  
m.set(pz, "bar");  
  
console.log(m.get(b));// foo  
console.log(m.get(nz));// bar


// 自定义代码实现
// 零值相等不作为 JavaScript API 公开，但可以通过自定义代码实现：
function sameValueZeor(x,y) {
	if (typeof x === 'number' && typeof y === 'number') {
		return x === y || ( x !== x && y !== y)
	}

	return x === y
}
```



### Object.create

**Define**

> the method creates a new object, using an exist object as the prototype of the newly created object.

**Syntax**

> Object.create(proto)
>
> Object.create(proto, propertiesObject)

**Parameters**

`proto`

* The object which should be the prototype of the newly-created object.

`propertiesObject` optional

* If specified and not undefined, an object whose enumerable own properties(that is , those properties defined upon itself and not enumerable properties along its prototype chain)specify property descriptors to be added to the newly-created object, with the corresponding property names. (如果被指定且不是未定义的, 一个对象的可枚举自身属性(即那些定义在自身的属性, 而不是沿着其原型链的可枚举属性)指定要添加到新创建的对象中的属性描述符,以及相应的属性名.)
* These properties correspond to the second argument of Object.defineProperties().(该对象的属性类型参数Object.defineProperties()的第二个参数)

**Return value**

> A new object with the specified prototype object and properties.

**Exceptions**

The `proto` parameter 

* null
* an Object excluding <u>[primitive wrapper objects](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#primitive_wrapper_objects_in_javascript)</u>(原始包装对象)

<u>If `proto` is neither of these a TypeError is thrown.</u>

**Custom and Null objects**

> A new object created from a completely custom object (especially one created from the null object, which is basically a custom object with NO members) can behave in unexpected way.
>
> This is especially true when debugging, since common object-property converting/detecting utility functions may generate errors, or lose information(especially if using silent error-traps(静默错误陷阱) that ignore errors).
>
> For example, here are two objects

```javascript
let oco = Object.create({});
let ocn = Object.create(null);

console.log(oco); //{}
console.log(ocn); //{}

oco.p = 1;
ocn.p = 0;

console.log(oco); //{p:1}
console.log(ocn); //{p:0}

'oco is: ' + oco //'oco is: [object Object]'
'ocn is: ' + ocn //throws error: cannot convert object to primitive value.

alert(oco); //shows [object Object]
alert(ocn); //throws error: cannot convert object to primitive value

oco.toString(); //[object Object]
ocn.toString(); //throws error: ocn.toString is not a function

oco.valueOf(); //{}
ocn.valueOf(); //throws error: ocn.valueOf is not a function

oco.hasOwnProperty('p'); //true
ocn.hasOwnProperty('p'); //throws error: ocn.hasOwnProperty is not a function
```



As said, these differences can make debugging(调试) even simple -seeming problems quickly go astray(迷途的).

a simple common debugging function

```javascript
// display top-level property name: value pairs of given object

function ShowProperties(obj) {
  for (let prop in obj) {
    console.log(prop + ': ' + obj[prop] + '\n');
  }
}
```

Not such simple result: (especially if silent error-trapping has hidden the error message)

```javascript
ob = {}; ob.po = oco; ob.pn = ocn;
ShowProperties(ob); //display top-level properties
 - po: [object Object]
 - Error: cannot convert object to primitive value
 
Note that only first property gets show.

//but if the same object is created in a different order  at least in some implementations

ob = {}; ob.pn = ocn; ob.po = oco;
ShowProperties(ob);
-Error: cannot convert object to primitive value

Note that neigher property gets shown.
```

Note that such a different order may arise statically via disparate fixed codings such as here, but also dynamically via whatever the order any such property-adding code-branches actually get executed at runtime as depends on inputs and/or random-variables.[请注意，这种不同的顺序可能通过不同的固定编码（如此处）静态出现，但也可以通过任何此类添加属性的代码分支在运行时实际执行的顺序动态出现，这取决于输入和/或随机变量。]

Then again, the actual iteration order is not guaranteed no matter what the order members are added.

Be aware of , also, that using Object entries() on an object created via Object.create() will rsult in an empty array being returned.

```javascript
let obj = Object.create({a: 1, b: 2});
console.log(Object.entries(obj)); //[]
```

Some NON-solutions

Adding the missing object-method directly from the standard-object does NOT work.

```javascript
ocn = Object.create(null);

ocn.toString = Object.toString;

> ocn.toString //shows 'toString() {[native code]}'
> ocn.toString == Object.toString //true

>ocn.toString() //error: Function.prototypetoString requires that 'this' be a Function
```

Adding the missing object-method directly to new object's 'protptype' does not work either, since the new object does not hava a real prototype (which is really the cause of ALL these problems) and one cannot be directly added:

```javascript
let ocn = Object.create(null);

ocn.prototype.toString = Object.toString; //Error: cannot set property 'toString' of undefined

ocn.prototype = {};
ocn.prototype.toString = Object.toString;

> ocn.toString() //error: ocn.toString is not a function
```

Adding the missing object-method by calling 'Object.setPropertyOf()' with the name of the standard-object itself as the second argument does not work either.

```javascript
ocn = Object.create(null);
Object.setPropertyOf(ocn, Object);//wrong; sets new object's prototype to the Object() function

> ocn.toString() //error: Function.prototype.toString requires that 'this' be a function
```

In addition to all the string-related functions shown above, this also adds:

```javascript
ocn.valueOf(); //{}
ocn.hasOwnProperty('x'); //'false'
ocn.constructor // 'Object() {[native code]}'

// ... and all the rest of the properties and methods of Object.prototype
```



Some OK solutions

* generic method
* generic prototype

adding the missing object-method directly from the standard-object does NOT work. However, adding the **generic method** directly, DOES:

```javascript
ocn = Object.create(null);

ocn.toString = toString;

> ocn.toString() //'[object Object]'
> 'ocn is: ' + ocn; //'ocn is: [object Object]'

ob = {}; ob.pn = ocn; ob.po = oco;

> ShowProeprties(ob);
 - po: [object Object]
 - pn: [object Object]
```

However, setting the **generic prototype** as the new object's prototype works even better.

```javascript
ocn = Object.create(null);
Object.setPropertyOf(ocn, Object.prototype);
```



**Example**

1.组合式继承

```javascript
//Shape superclass
function Shape() {
  this.x = 0;
  this.y = 0;
}

//superclass method
Shape.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  console.log('Shape moved');
}

//Rectangle  - subclass
function Rectangle() {
  Shape.call(this); //call super constructor
}

//subclass extends superclass
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

let rect = new Rectangle();

console.log('Is rect an instance of Rectangle ?', rect instanceof Rectangle) //true
console.log('Is rect an instance of Shape?', rect instanceof Shape); //true
rect.move(1, 1); //outputs, 'Shape moved'
```

2.Using propertiesObject argument with Object.create()

* by default properties ARE NOT writable, enumerable or configurable:

```javascript
let o;

//create an object with null property
o = Object.create(null);

o = {};
// is equal to :
o = Object.create(Object.prototype);

o = Object.create(Object.prototype, {
  foo: {
    wiritable: true,
    configurable: true,
    value: 'hello'
  },
  bar: {
    configurable: false,
    get: function() {return 10},
    set: function(value) {
      console.log('Setting `o.bar` to', value);
    }
  }
})



function Constructor() {}
o = new Constructor();
//is equivalent to:
o = Object.create(Constructor.prototype);
// Of course, if there is autual initialization code in the constructor function, the Object.create() cannot reflect it.

//Create a new object whose prototype is a new, empty object and add a single property 'p' ,with value 42.
o = Object.create({}, {p: {value: 42}});
// by default properties ARE NOT writable, enumerable or configurable:
o.p = 24;
> o.p //42
o.q = 12;
for (let prop in o) {
  console.log(prop);
}
//'q'

delete o.p;  //false


//to specify an ES3 property
o2 = Object.create({}, {
  p: {
    value: 42,
    writable: true,
    enumerable: true,
    configurable: true
  }
});
// is not equivalent to: o2 = Object.create({p: 42}) this will create an object with prototype
```

**Polyfill**

```javascript
if (typeof Object.create !== 'function') {
  Object.create = function (proto, propertiesObject) {
    throw new TypeError('object prototype may only be an object: ' + proto);
  } else if (proto = null) {
    throw new Error ("this browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
    
    if (typeof propertiesObject !== 'undefined') throw new Error("this browser's implementation of Object.create is a shim and doesn't support a second argument.")
  }
  
  function F() {}
  F.prototype = proto;
  return new F();
  
}
```

**如何实现Object.create()方法**

```javascript
//https://juejin.cn/post/7033275515880341512#:~:text=%E5%8F%82%E8%80%83%E4%BB%A3%E7%A0%81-,%E5%AE%9E%E7%8E%B0object.create,-function%20newCreate(proto


function newCreate(proto, propertiesObject) {
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw TypeError('object prototype may only be an Object')
  }
  
  function F() {};
  F.prototype = proto;
  let obj = new F();
  
  if (propertiesObject !== undefined) {
    Object.keys(propertiesObject).forEach(key => {
      let value = propertiesObject[key];
      if (typeof value !== 'object' || value === null) {
        throw TypeError('Object prototype ....')
      } else {
        Object.defineProperty(obj, key, value);
      }
    })
  }
  return obj;
}

//https://www.jianshu.com/p/b644bcf935ac

if (typeof Object.create !== 'function') {
  Object.create = (function() {
    function Temp() {}
    
    let hasOwn = Object.prototype.hasOwnProperty
    return function(O) {
      if (typeof O != 'object') {
        throw TypeError('object prototype may only be an Object or null')
      }
      
      Temp.prototype = O
      let obj = new Temp()
      Temp.prototype = null
      
      //存在参数properties
      if (arguments.length > 1) {
        let Properties = object(arguments[1])
        for (let prop in Properties) {
          if (hasOwn.call(Properties, prop)) { //?
            obj[prop] = Properties[prop]
          }
        }
      }
      
      return obj
    }
  })()
}
```







### Object.assign()

##### **介绍**

> 用于将所有可枚举属性的值从一个或多个源对象分配到目标对象. 它将返回目标对象.

##### **语法**

```javascript
Object.assign(target, ...sources);
```

**参数**

`target`  目标对象

`sources` 源对象

**返回值**

目标对象

##### **描述**

* 源对象中的属性会覆盖目标对象中有相同属性的键(key).同样,后面源对象的属性也会覆盖前面相同的属性.
* 此方法只拷贝源对象自身可枚举<span style="color: blue;"><sup>enumerable</sup></span>的属性到目标对象.不拷贝继承的属性,不能拷贝prototype.
* 方法在源对象上使用`[[Get]]`,在目标对象上使用`[[Set]]`,所以它会调用[getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) 和 [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set). 所以,这个方法分配属性,而不仅仅是复制或定义新的属性
* 如果合并的源对象中包含getters,那么合并新属性到原型上是不适合的.(Therefore it assign properties, versus copying or defining new properties.)
* <span style="span:hover{color:red;}">为了将属性定义(包括其可枚举性)复制到原型, 应使用`Object.getOwnPropertyDescriptor()` 代替`Object.defineProperty()`.</span>
* `String` 和 `Symbol` 属性会被拷贝.
	* 如果该参数不是对象,则会先转成对象,然后返回.undefined,null无法转成对象,如果将这两个值放在第一个参数的位置上会报错: `TypeError: Cannot convert undefined or null to object`
	* 字符串合入目标对象,数值和布尔值会被忽略.因为只有字符串的包装对象,会产生可枚举属性.
* 为了预防错误,,例如,一个属性是不可写的,会出现一个类型错误,如果在报错之前添加了任意属性那么`target`对象会改变.

> Note:
>
> Object.assign() does not throw on `null` or `undefined` source
>
> 不会抛出`null`或`undefined`源

```js
let str = Object.assign('123', {a:1})
console.log(str) // String {'123', a:1 }
console.log(str.toString()) // '123'


let err = Object.assign()
```



**使用概述**

object.assign接受两个或多个对象作为参数. 它会修改并返回第一个参数,第一个参数是目标对象,但不会修改第二个及后续参数,那些事来源对象. 对于每个来源对象,它会把该对象的<span style="color:red">可枚举自有属性(包括名字为符号的属性)</span>复制到目标对象. 它按照参数列表顺序逐个处理来源对象,第一个来源对象的属性会覆盖目标对象的同名属性,而第二个来源对象(如果有)的属性会覆盖第一个来源对象的同名属性.

Object.assign以普通的属性获取和设置方式复制属性. 因此如果一个来源对象有获取方法或目标对象有设置方法, 则他们会在复制期间被调用, 但这些方法本身不会被复制.

**使用原因**

将属性从一个对象分配到另一个对象的一个原因是, 如果有一个默认对象为很多属性定义了默认值,并且如果该对象中不存在同名属性,可以将这些默认属性复制到另一个对象中.

但是像下面这样简单的使用Object.assign不会达到目的:

```javascript
Object.assign(o, defaults) //用default覆盖o的所有属性
```

此时,需要一个新对象,先把默认值复制到新对象中,然后再使用o的属性覆盖那些默认值:

```javascript
o = Object.assign({}, default, o)
```

同时,ES6中新增了扩展操作符也可以表达这种对象复制和覆盖操作:

```javascript
o = {...defaults, ...o}
```

为了避免额外的对象创建和复制, 也可以重写Object.assign(), 只复制那些不存在的属性:

```javascript
// 与Object.assign类似,但不覆盖已经存在的属性
// (同时也不处理符号属性)

function merge(target, ...sources) {
  for (let source of sources) {
    for (let key of Object.keys(source)) {
      if (!(key in target)) { //这里跟Object.assign不同
        target[key] = source[key]
      }
    }
  }
  return target
}
```



**Polyfill**

这个Polyfill不支持symbol属性,由于ES5中本来就不存在symbols

```javascript
if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, varArgs) {
      'use strict'
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object')
      }
      
      let to = Object(target);
      
      for (let i=1; i<arguments.length; i++) {
        let nextSource = arguments[i];
        
        if (nextSource !== null && nextSource !== undefined) { //why? 使用 或 不行吗
          for (let nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) { //nextSource.hasOwnProperty
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      
      return to;
    },
    writable: true,
    configurable: true
  })
}
```





##### **实例**

<u>Cloning an object</u>

```javascript
const obj = {a: 1};
const copy = Object.assign({}, obj);
console.log(copy); //{a: 1}
```



<u>Warning for Deep Clone</u>

For [deep cloning](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy), we need to use alternatives, because `Object.assign()` copies property values.

If the source value is a reference to an object, it only copies the reference value.

```javascript
function test() {
  'use strict';

  let obj1 = { a: 0 , b: { c: 0}};
  let obj2 = Object.assign({}, obj1);
  console.log(JSON.stringify(obj2)); // { "a": 0, "b": { "c": 0}}

  obj1.a = 1;
  console.log(JSON.stringify(obj1)); // { "a": 1, "b": { "c": 0}}
  console.log(JSON.stringify(obj2)); // { "a": 0, "b": { "c": 0}}

  obj2.a = 2;
  console.log(JSON.stringify(obj1)); // { "a": 1, "b": { "c": 0}}
  console.log(JSON.stringify(obj2)); // { "a": 2, "b": { "c": 0}}

  obj2.b.c = 3;
  console.log(JSON.stringify(obj1)); // { "a": 1, "b": { "c": 3}}
  console.log(JSON.stringify(obj2)); // { "a": 2, "b": { "c": 3}}

  // Deep Clone
  obj1 = { a: 0 , b: { c: 0}};
  let obj3 = JSON.parse(JSON.stringify(obj1));
  obj1.a = 4;
  obj1.b.c = 4;
  console.log(JSON.stringify(obj3)); // { "a": 0, "b": { "c": 0}}
}

test();
```



<u>Merging object</u>

```javascript
const o1 = { a: 1 };
const o2 = { b: 2 };
const o3 = { c: 3 };

const obj = Object.assign(o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
console.log(o1);  // { a: 1, b: 2, c: 3 }, target object itself is changed.
```

<u>Merging objects with same properties</u>

the properties are overwritten by other objects that have the same properties later in the parameters order.

```javascript
const o1 = { a: 1, b: 1, c: 1 };
const o2 = { b: 2, c: 2 };
const o3 = { c: 3 };

const obj = Object.assign({}, o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
```

<u>Copying symbol-typed properties</u>

```javascript
const o1 = { a: 1 };
const o2 = { [Symbol('foo')]: 2 };

const obj = Object.assign({}, o1, o2);
console.log(obj); // { a : 1, [Symbol("foo")]: 2 } (cf. bug 1207182 on Firefox)
Object.getOwnPropertySymbols(obj); // [Symbol(foo)]
```

<u>Properties on the prototype chain and non-enumerable properties cannot be copied</u>

```javascript
const obj = Object.create({foo: 1}, {
  bar: {
    value: 2 //bar is a non-enumerable property
  },
  baz: {
    value: 3,
    enumerable: true //baz is an own enumerable property
  }
});

const copy = Object.assign({}, obj);
console.log(copy); //{baz: 3}
```

<u>Primitives will be wrapper to objects</u>

> <span style="color:red;">Note, only string wrappers can have own enumerable properties.</span>

```javascript
const v1 = 'abc';
const v2 = true;
const v3 = 10;
const v4 = Symbol('foo');

const obj = Object.assign({}, v1, null, v2, undefined, v3, v4);
// Primitives will be wrapped, null and undefined will be ignored.
// Note, only string wrappers can have own enumerable properties.
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```

<u>Exceptions will interrupt the ongoing copying task </u>

```javascript
const target = Object.defineProperty({}, 'foo', {
  value: 1,
  writable: true
});

Object.assign(target, {bar: 2}, {foo2: 3, foo: 3}, {baz: 4});
//TypeError: 'foo' is read-only
//the exception is thrown when assigning target.foo

console.log(target.bar);  // 2, the first source was copied successfully.
console.log(target.foo2); // 3, the first property of the second source was copied successfully.
console.log(target.foo);  // 1, exception is thrown here.
console.log(target.foo3); // undefined, assign method has finished, foo3 will not be copied.
console.log(target.baz);  // undefined, the third source will not be copied either.
```

<u>Copying accessors</u> ????

```javascript
const obj = {
  foo: 1,
  get bar() {
    return 2;
  }
};

let copy = Object.assign({}, obj);
console.log(copy); //{foo:1, bar: 2} //the value of copy.bar is obj.bar's getter's return value.

//this is an assign function that copies full descriptors
function completeAssign(target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {})
    
    //by default, Object.assign copies enumerable Symbols, too
    Object.getOwnPropertySymbol(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);  });
  return target;
}


```

##### 实现

**ES5实现ES6Object.assign()功能**

混合（Mixin）是JavaScript中实现对象组合最流行的一种模式。在一个mixin方法中，一个对象接收来自另一个对象的属性和方法

```javascript
function mixin(receiver, supplier) {
  Object.keys(supplier).forEach(key => receiver[key] = supplier[key]);
}
```

mixin()函数遍历supplier的自有属性并复制到receiver中（<u>此处的复制行为是浅复制，当属性值为对象时只复制对象的引用</u>）。这样一来，receiver不通过继承就可以获得新属性，请参考这段代码：

```javascript
function EventTarget() { }
EventTarget.prototype = {
    constructor: EventTarget,
    emit: function() {},
    on: function() {}
  };

let myObject = {};
mixin(myObject, EventTarget.prototype);

myObject.emit('somethingChanged');
```

在这段代码中，myObject接收EventTarget.prototype对象的所有行为，从而使myObject可以分别通过emit()方法发布事件或通过on()方法订阅事件。

这种混合模式非常流行，因而ECMAScript 6添加了Object.assign()方法来实现相同的功能，这个方法接受一个接收对象和任意数量的源对象，最终返回接收对象。<u>mixin()方法使用赋值操作符（assignment operator）=来复制相关属性，却不能复制访问器属性到接收对象中</u>，因此最终添加的方法弃用mixin而改用assign作为方法名。

任何使用mixin()方法的地方都可以直接使用Object.assign()方法来替换

```javascript
function EventTarget() {}
EventTarget.prototype = {
  constructor: EventTarget,
  emit: function() {},
  on: function() {}
}

let myObject = {};
Object.assign(myObject, EventTarget.prototype);
myObject.emit('somethingChanged');
```

Object.assign()方法可以接受任意数量的源对象，并按指定的顺序将属性复制到接收对象中。所以如果多个源对象具有同名属性，则排位靠后的源对象会覆盖排位靠前的





**Object.assign()** 方法用于**将所有可枚举属性的值**从一个或多个源对象分配到目标对象。它将返回目标对象. 同时它也可以实现**浅拷贝**.因为 `Object.assign()`拷贝的是（可枚举）属性值。

```js
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

const target = {a:1,b:2};
const source = {b:3,c:3};

const returnTarget = Object.assign(target,source);

console.log(target);//{ a: 1, b: 4, c: 5 }
console.log(returnTarget);//{ a: 1, b: 4, c: 5 }

//浅拷贝测试
target['e']=5;
console.log(returnTarget.e) //5
```



**访问器属性**

Object.assign()方法不能将提供者的访问器属性复制到接收对象中。由于Object.assign()方法执行了赋值操作，因此<u>提供者的访问器属性最终会转变为接收对象中的一个数据属性.</u>

```javascript
let receiver = {},
    supplier = {
      get name() {
        return 'file.js'
      }
    };

Object.assign(receiver, supplier);

let descriptor = Object.getOwnPropertyDescriptor(receiver, 'name');

console.log(descriptor.value); //'file.js'
console.log(descriptor.get); //undefined
```



##### 存在的问题

指回替换对象的第一层key, 对于多层的,会当做值处理

> https://blog.csdn.net/weixin_45818024/article/details/114651552
>
> https://juejin.cn/post/6882549580559777800



```javascript
//对象的合并 存在的问题: 原型链污染漏洞
function merge(target, source) {
    for (let key in source) {
        if (key in source && key in target) {
            merge(target[key], source[key])
        } else {
            target[key] = source[key]
        }
    }
}
```





### Object.keys

返回一个由一个给定对象的**自身可枚举属性**组成的数组，数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致.

**不保证对象属性的顺序**,mdn上没有直接说明,只是说明和手动遍历相同.因为迭代的顺序是依赖于浏览器实现的，结论是不保证.

```js
// simple array
var arr = ['a', 'b', 'c'];
console.log(Object.keys(arr)); // console: ['0', '1', '2']

// array like object
var obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.keys(obj)); // console: ['0', '1', '2']

// array like object with random key ordering
var anObj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.keys(anObj)); // console: ['2', '7', '100']
```



```js
//对象中的属性排序,新对象
var anObj = { 100: 'a', 2: 'b', 7: 'c' };
let arr = Object.keys(anObj);
let newObj = {};
for(let i=0;i<arr.length;i++){
  newObj[arr[i]]=anObj[arr[i]]
}
console.log(newObj); //{ '2': 'b', '7': 'c', '100': 'a' }
```





### Object.values()

> 这个方法返回一个参数对象自身可枚举属性值组成的数组，数组元素顺序和for...in循环相同。(唯一的不同是for...in循环也枚举原型链上的属性)
>
> 描述：
>
> return an array whose elements are the enumerable property values found on the object. the ordering of the properties is the same as that given by looping over the property values of the object manaually.

```javascript
const obj = {
  a: 'something',
  b: 42,
  c: false
};

console.log(Object.values(obj)); //['something', 42, false]

//Array-like object
const arrayLikeObj = {0: 'a', 1: 'b', 2: 'c'};
console.log(Object.values(arrayLikeObj)); //['a', 'b', 'c']

//Array-like object with random key ordering
const arrayLikeObj2 = {100: 'a', 2: 'b', 7: 'c'};
console.log(Object.values(arrayLikeObj2)); //['b', 'c', 'a']

//getFoo is property which isn't enumerable    enumerable默认为false
const my_obj = Object.create({}, {getFoo: {value: function() {return this.foo;}}});
my_obj.foo = 'bar';
console.log(Object.values(my_obj)); //['bar']
```



### Object.entries()

##### Define

> the method returns an array of a given object's own enumerable string-keyed property `[key, value]` pairs. 
>
> This is the same as iterating with a `for...in` loop, excep that a `for...in` loop enumerates properties in the prototype chain as well.
>
> The order of the array returned by `Object.entries()` is the same as that provided by a `for...in` loop. If there is a need for defferent ordering, then the array should be sorted first, like `Object.entries(obj).sort((a, b) => b[0].localCompare(a[0]))`.

##### Syntax

> Object.entries(obj)

##### Parameters

`obj` 

* The object whose own enumerable <u>string-keyed</u><sup>字符串键控</sup> property `[key, value]` pairs are to be returned.

##### Return value

​	An array of the given object's own enumerable string-keyed property `[key, value]` pairs.

##### Desc

* the method returns an array whose elements are arrays corresponding to the enumerable string-keyed property `[key, value]` pairs found directly upon `object`.
* the ordering of the proeprties is the same as that given by looping over the property values of the object manually.

##### Polyfill

​	to add compatible `Object.entries()`support in older enviroments that do not natively support it, you can use any of the following:

- a demonstration implementation of `Object.entries` in the [tc39/proposal-object-values-entries](https://github.com/tc39/proposal-object-values-entries) (if you don't need any support for IE);
- a polyfill in the [es-shims/Object.entries](https://github.com/es-shims/Object.entries) repositories;
- or, you can use the simple, ready-to-deploy polyfill listed below:

```javascript
if (!Object.entries) {
  Object.entries = function(obj) {
    let ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i); //preallocate the Array
    while(i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
    return resArray;
  }
}
```

For the above polyfill code snippet, if you need support for IE<9, then you will also need an `Object.keys()` polyfill (such as the one found on the [`Object.keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) page).



##### Examples ????

```javascript
const obj = { foo: 'bar', baz: 42 };
console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]

// array like object
const obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.entries(obj)); // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]

// array like object with random key ordering
const anObj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.entries(anObj)); // [ ['2', 'b'], ['7', 'c'], ['100', 'a'] ]

// getFoo is property which isn't enumerable ????
const myObj = Object.create({}, { getFoo: { value() { return this.foo; } } });
myObj.foo = 'bar';
console.log(Object.entries(myObj)); // [ ['foo', 'bar'] ]

// non-object argument will be coerced to an object
console.log(Object.entries('foo')); // [ ['0', 'f'], ['1', 'o'], ['2', 'o'] ]

// returns an empty array for any primitive type except for strings (see the above example), since primitives have no own properties
console.log(Object.entries(100)); // [ ]

// iterate through key-value gracefully
const obj = { a: 5, b: 7, c: 9 };
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
}

// Or, using array extras
Object.entries(obj).forEach(([key, value]) => {
  console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
});
```

Converting an Object to a Map

the `new Map()` constructor accepts an iterable of entries. With `Object.entries`, you can easily convert from `Object` to `Map`:

```javascript
const obj = {foo: 'bar', baz: 42};
const map = new Map(Object.entries(obj));

console.log(map); //Map(2) {'foo' => 'bar', 'baz' => 42}
```

Iterating througn an Object

Using `Array Destructuring`, you can iterate through objects easily:

```javascript
const obj = {foo: 'bar', baz: 42};
Object.entries(obj).forEach(([key, value]) => console.log(`${key}: ${value}`))
```


**注意事项**
> [为什么Object.entries和Array.prototype.entries的返回值类型不同? - 知乎](https://www.zhihu.com/question/465364604/answer/1945950621)

所以所有的 XXX.prototype.keys/values/entries （Array、Map、Set，还有Web APIs的集合类）返回的都是迭代器。 只有Object.keys/values/entries是例外，返回的是数组。原因其实很简单，就是这组API是ES5时代加入的，那个时候还没有迭代器（ES6加入的）。其中一个重要理由可能是，对于大集合，分配一个很大的数组，性能会很差，而迭代器则没有这个负担。

### Object.fromEntries()
> [Object.fromEntries() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)

#### 是什么
> this static method transforms a list of key-value pairs into an object.

#### syntax
```js
Object.fromEntries(iterable)
```

**参数**
`itertable`
一个可迭代对象, 例如数组或Map, 包含对象列表. 每个对象应含有两个属性: 键和值.
通常,这个对象作为双元素数组出现, 第一个元素是key,第二个元素是值.

**返回值**
一个新的对象, 其属性由迭代器的条目给出.

#### 描述
此方法接收一个键值对(key-value)列表并且返回一个对象,该对象的属性由这些条目(entries)提供. 可迭代参数预期为为一个实现了`[Symbol.iterator]()`方法的对象, 该对象的方法返回一个迭代器对象，该对象生成两个元素数组类对象。 


#### 实例
1.将Map转换成对象
```js
const map = new Map(
	['foo', 'bar'],
	['baz', 40]
)

const obj = Object.fromEntries(map)
console.log(obj) //{foo:'bar', baz: 40}
```


转换数组为对象
```js
const arr = [
  ["0", "a"],
  ["1", "b"],
  ["2", "c"],
];
const obj = Object.fromEntries(arr);
console.log(obj); // { 0: "a", 1: "b", 2: "c" }
```

对象转换
```js
const object1 = { a: 1, b: 2, c: 3 };

const object2 = Object.fromEntries(
  Object.entries(object1).map(([key, val]) => [key, val * 2]),
);

console.log(object2);
// { a: 2, b: 4, c: 6 }
```




### Object.getPrototypeOf()

##### Define

> the method returns the prototype(i.e the value of the internal [[Prototype]] property) of the specified object

##### Syntax

> Object.getPrototype(bj)

##### Parameters

`obj`

* the object whose prototype is to be returned

##### return value

* the prototype of the given object. 
* <u>If there are no inherited properties, `null` is returned.</u>

##### examples

Using getPrototypeOf

```javascript
let proto = {};
var obj = Object.create(proto);
Object.getPrototypeOf(bj) === proto; //true
```

Non-object coercion(强制转换)

In ES5, it will throw a TypeError exception if the obj parameter isn't an object.

In ES2015, the parameter will be coerced to an Object.

```javascript
Object.getPrototypeOf('foo');
// TypeError: "foo" is not an object (ES5 code)
Object.getPrototypeOf('foo');
// String.prototype                  (ES2015 code)
```



#### Object.setPrototypeOf() (未完成)

##### Define

> the method sets the prototype of a specified object to another object or null.

##### Warning

> Changing the [[Prototype]] of an object is, by the nature of [how modern JavaScript engines optimize property accesses](https://mathiasbynens.be/notes/prototypes), currently a very slow operation in every browser and JavaScript engine. In addition, the effects of altering inheritance are subtle and far-flung, and are not limited to the time spent in the `Object.setPrototypeOf()` statement, but may extend to any code that ahs access to any object whose `[[Protootype]]` has been altered.
>
> Because this feature is a part of the language, it is still the burden on engine developers to implement that feature performantly(ideally). Until engine developers address this issue, if u are concerned about performance, u should avoid setting the `[[Prototype]]` of an object. Instead, create a new object with the secired `[[Prototype]]` using `Object.create(null)`.

##### Syntax

> Object.setPrototypeOf(obj, prototype)

##### Parameters

`obj`

* the object which is to have its prototype set.

`prototype`

* the object's new prototype(an object or null).

##### return value

* the specified object

##### Desc

* Throws a TypeError exception if the object whose `[[Prototype]]` is to be modified is non-extensible according to `Object.isExtensible()`.
* Does nothing if the `prototype` parameter isn't an object or `null`(i.e., number , string, boolean, or undefined). Otherwise, this method changes the `[[Prototype]]` of `obj` to the new value.
* `Object.setPrototypeOf()` is in the ECMAScript 2015 specification. It is generally considered the proper way to set the prototype of an object, vs. the more controversial `Object.prototype.__proto__` property.





#### Object.prototype.isPrototypeOf()



#### Object.getOwnPropertyDescriptor()

##### Define

>the method returns an object describing the configuration of a specific property on a given object(that is, one directly present on an object and not in the object's prototype chain).
>
>The object returned is mutable but mutating it has no effect on the original property's configuration.

##### Syntax

> Object.getOwnPropertyDescriptor(obj, prop);

##### Parameter

`obj`

* the object in which to look for the proeprty

`prop`

* the name or `Symbol` of the proeprty whose description is to be retrieved(检索).

##### Desc

* this method permits examinition(检查) of the precise description of a property.
* A property in JavaScript consists of either a string-valued(字符串值) name or a Symbol and a property descriptor.
* Futher information about property descriptor types and their attributes can be found in `Object.defineProperty()`
* A property descriptor is a record with some of the following attributes:
  * `value`  
    * the value associated with the property(data descriptors only)
  * `writable` 
    *  `true` if and only if the value associated with the property may be changed(data descriptors only)
  * `get` 
    * A function which serves as a getter for the property, or `undefined` if there is no getter(accessor descriptor only)
  * `set`
    * A function which serves as a setter for the property, or `undefined` if there is no setter(accessor descriptor only)
  * `configurable`
    * `true` if and only if the type of this proeprty descriptor may be changed and if the property any be deleted from the corresponding object.
  * `enumerable`
    * `true` if and only if the property shows up during enumeration of the properties on the corresponding object.

##### Examples

Using Object.getOwnPropertyDescriptor

```javascript
let o, d;
o = {get foo() {return 17;}};
d = Object.getOwnPropertyDescripor(o, 'foo');
//d 
{
  configurable: true,
  enumerable: true,
  get: /*this getter function*/,
  set: undefined
}

o = {bar: 42};
d = Object.getOwnPropertyDescriptor(o, 'bar');
{
  value: 42,
  writable: true,
  configurable: true,
  enumerable: true
}

o = {[Symbol.for('baz')]: 73};
d = Object.getOwnPropertyDescriptor(o, Symbol.for('baz'));
{
  configurable: true,
  enumerable: true,
  value: 73,
  writable: true
}

o = {};
Object.defineProperty(o, 'qux', {
  value: 8675309,
  writable: false,
  enumerable: false
});
d = Object.getOwnPropertyDescriptor(o, 'qux');
{
  value: 8675309
  writable: false,
  enumerable: false,
  configurable: false
}
```

Non-object coercion(强制转换)

> In ES5, if the first argument to this method is not an object(a primitive), then it will cause a `TypeError`. In ES2015, a non-object first argument will be coerced to an object at first.

```javascript
Object.getOwnPropertyDescriptor('foo', 0);
//TypeError: 'foo' is not an object //ES5 code

Object.getOwnPropertyDescriptor('foo', 0);
{
  configurable: false,
  enumerable: true,
  value: 'f',
  writable: false
}
```



#### Object.getOwnPropertyDescriptors()

##### Define

>the method returns all own property descriptors of a given object

##### Syntax

> Object.getOwnPropertyDescriptors(obj);

##### Parameter

`obj`

* the object for which to get all own property descriptors

##### return value

* An object containing all own property descriptors of an object. 
* Might be <u>an empty object</u>, if there are no properties.

##### Desc

* the method permits examiniation of the precise description of all own properties of an object.
* A property in JavaScript consists of either a string-valued name or a `Symbol` and a property descriptor.
* Futher information about property descriptor types and their attributes can be found in `Object.defineProperty()`
* A proeprty descriptor is a record with some of the following attributes:
  * `value`
    * the value associated with the property(data descriptor only)
  * `writable`
    * `true` if and only if the values associated with property may be changed(data descriptors only)
  * `get`
    * A function which serves as a getter for the property, or `undefined` if there is no getter(accessor descriptors only)
  * `set`
    * A function which serves as a stter for the property, or `undefined` if there is no setter(accessor descriptor only).
  * `configurable`
    * `true` if and only if the type of this proeprty descriptor may be changed and if the property may be deleted from the corresponding object.
  * `enumerable`
    * `true` if and only if this property shows up during enumeration of the properties on the corresponding object.



##### example

<u>Creating a shallow(浅的) clone</u>   ????

Whereas the `Object.assign()` method will only copy enumerable and own properties from a source object to a target object, u are able to use this method and `Object.create()` for a shallow copy between two unknown objects:

```javascript
Object.create(
	Object.getPrototype(obj),
  Object.getOwnPropertyDescriptors(obj)
)
```

<u>Creating a subclass</u> ????

A typical way of creating a subclass is to define the subclass, set its prototype to an instance of the superclass, and then define properties on that instance.

This can get awkward(笨拙的) especially for getters and setters. Instead, u can use this code to set the prototype.

```javascript
function superclass() {}
superclass.prototype = {};

function subclass() {}
subclass.prototype = Object.create(
	superclass.prototype,
  {
    // define the subclass constructor, methods, and the properties here
  }
)
```





#### Object.getOwnPropertyNames()

Object.getOwnPropertyNames()返回<u>直接挂在目标对象上的</u>可枚举、不可枚举属性. 但为了和ES5保持一致,不包括Symbol属性.

```js
https://juejin.cn/post/6844903796062191624

//保证对象属性顺序的迭代方式
js内部的ownPropertyKeys方法,定义了对象属性遍历的顺序.
基于内部ownPropertyKeys方法实现的方法有Object.hasOwnPropertyNames()和Reflect.ownKeys(),这两种都保证对象属性的顺序.
Reflect.ownKeys()返回的结果等价于Object.hasOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))包括直接挂在目标对象上的可枚举、不可枚举、Symbols的属性组成的数组。但是要考虑兼容性（ES6提出，ie不支持)

Object.getOwnPropertyNames()返回直接挂在目标对象上的可枚举、不可枚举属性组成的，在ES5提出，兼容性更好，支持IE9+：


//为Object.keys()添加顺序
Object.keys.sort()
```



#### Object.getOwnPropertySymbols()

##### Define

> the method returns an array of all symbol properties found directly upon a given object.

##### Syntax

> Object.getOwnPropertySymbol(obj)

##### Parameters

`obj`

* the object whose symbol properties are to be returned

##### return value

* an array of all symbol properties found directly upon the given object

##### Desc

* Similar to `Object.getOwnPropertyNames()`, u can get all symbol properties of a given object as an array of symbols.
* Note that `Object.getOwnPropertyNames()` itself does not contain the symbol properties of an object and only the string properties.
* As all objects have no own symbols properties initially, `Object.getOwnPropertySymbols()` returns an empty array unless u have set symbol properties on ur object.

##### example

```javascript

//xxx
```



#### Object.defineProperty()

**define**

> the static method defines a new property directly on an object, or modifies an existing property on an object, and return the object.

**syntax**

> Object.definePorperty(object, prop, descriptor)

`object`

* the object on which to define the property

`prop`

* the name or Symbol of the property to be defined or modefied

`descriptor`

* the descriptor for the property being defined or modefied.

**return value**

the object that was passed to the function



**Desc**

this method allows a precise addition to or modification of a property on an object.

<u>Normal property addition through assignment(赋值) creates properties</u> which show up during property enumeration(for...in or Object.keys() method), whose values may be changed, and which may be deleted.

this method allows these extra details to be changed from their defaults.

<span style="text-decoration: underline wavy">By default, values added using `Object.defineProperty()` are <u>immutable(不可改变的)</u> and not enumerable.</span>

Property descriptors present in objects come in two main flavors:  data descriptors and accessor descriptor.

* A data descriptor is a property that has a value, which may or may not be writable
* An accessor descriptor is a property described by a getter-setter pair of functions.
* A descriptor must be one of these two flavors; it cannot be both.

Both data and accessor descriptors are objects. they share the following optional keys(note: the defaults mentioned here are in the case of defining properties using 'Object.defineProperty()'):

* `configurable`
  * true if the type of this proeprty descriptor may be changed and if the property may be deleted from the correspongding object.
  * default to false
* `enumerable`
  * true if and only if this property shows up during enumeration of the properties on the correspongding object.
  * default to false

**A data descriptor** also has the following optional keys:

* `value`
  * default to false
  * the value associated with the property. can be any valid JavaScript value (number, object, function, etc)

* `writable`
  * default to false
  * true if the value associated with the property may be changed with an <u>assignment operator(赋值运算符)</u>.

**A accessor descriptor** also has the following optional keys:

* `get`
  * A function which serves as a getter for the property, or undefined if there is no getter.
  * when the property is accessed, this function is called without arguments and with this set to the object through which the property is accessed(this may not be the object on which the property is defined due to inheritance). the return value will be used as the value of the property.(这个长句不明白. 当访问该属性时, 会调用这个函数,没有参数,但会传入this对象(由于继承关系,this并不一定是该属性的对象). 返回值会被用作属性的值.
  * default to undefined
* `set`
  * A function which serves as a setter for the property, or undefined if there is no setter.
  * when the property is assigned, this function is called with one argument(the value being assigned to the property) and with this set to the object through which the property is assigned.
  * default to undefined

If a descriptor has <u>neither of</u> `value` ,`writable`, `get` and `set` keys, ti is treated as a data descriptor. If a descriptor has both [`value` or `writable`] and [`get` or `set` ]keys, an exception is thrown.

Bear in mind that these attributes <u>are not necessarily(不一定是)</u> the descriptor's own properties. Inherited properties will be considered as well. In order to ensure these defaults are preserved, you might freeze the `Object` upfront, specify all options explicityly, or point to null with `Object.create(null)`. 



**修改属性**

Writable属性

当writable属性设为false时,该属性被称为'不可写的'. 它不能被重新赋值.

```javascript
let o = {};
Object.defineProperty(o, 'a', {
  value: 37,
  writable: false
});

console.log(o.a); //37
o.a = 25; //No error thrown(it would throw in strict mode, even if the value had been the same)
console.log(o.a); //37


//strict mode
(function() {
  'use strict'
  let o = {};
  Object.defineProperty(o, 'a', {
    value: 3,
    writable: false
  });
  
  o.a = 3; //throws TypeError: 'b' is read-only
  return o.b;
})();
```



Enumerable属性

`enumerable`定义了对象的属性是否可以在`for...in`循环和`Object.keys()`中被枚举.

```javascript
```



Configurable属性

`configurable`特性标识对象的属性是否可以被删除,以及除`value`和`writable`特性外的其他特性是否可以被修改.



添加多个属性和默认值

使用点运算符和 `Object.defineProperty()` 为对象的属性赋值时，数据描述符中的属性默认值是不同的

```javascript
let o = {};
o.a = 1;
//等同于
Object.defineProperty(o, 'a', {
  value: 1,
  writable: true,
  configurable: true,
  enumerable: true
})


Object.defineProperty(o, 'a', {value: 1});
//等同于
Object.defineProperty(o, 'a', {
  value: 1,
  writable: false,
  configurable: false,
  enumerable: false
})
```



继承属性

如果访问者的属性是被继承的，它的 `get` 和 `set` 方法会在子对象的属性被访问或者修改时被调用。如果这些方法用一个变量存值，该值会被所有对象共享。

```javascript
function myclass() {}

let value;
Object.defineProperty(myclass.prototype, 'x', {
  get() {
    return value;
  },
  set(x) {
    value = x;
  }
})
let a = new myclass();
let b = new myclass();

a.x = 1;
console.log(b.x); //1
```

可以通过将值存储在另一个属性中解决.在get和set方法中,this指向某个被访问和修改属性的对象.

```javascript
function myclass() {}

Object.defineProperty(myclass.prototype, 'x', {
  get() {
    return this.stored_x;
  },
  set(x) {
    this.stored_x = x;
  }
});

let a = new myclass();
let b = new myclass();

a.x = 1;
console.log(b.x);//undefined
```

不像访问者属性,值属性始终在对象自身上设置,而不是一个原型.然而,如果一个不可写的属性被继承,它仍然可以防止修改对象的属性.

```javascript
function myclass() {}

myclass.prototype.x = 1;
Object.defineProperty(myclass.prototype, 'y', {
  writable: false,
  value: 1
});

let a = new myclass();
a.x = 2;
console.log(a.x); // 2
console.log(myclass.prototype.x); // 1
a.y = 2; // Ignored, throws in strict mode
console.log(a.y); // 1
console.log(myclass.prototype.y); // 1

```



**实例**

> https://juejin.cn/post/6950664413317693470

使用defineProperty实现`a==1&&b==2&&c==3`为true

```javascript
var val = 0;
Object.defineProperty(window, 'a', {
  get() {
    return ++val;
  }
});
console.log(....); //true
```













#### Object.defineProperties()

**define**

> the method defines new or modifies existing properties directly on an object, returning the object.

**syntax**

> Object.defineProperties(obj, props);

`obj` 

* the object on which to define or modify properties

`props` 

> An Object whose keys represent the names of properties to be defined or modified and whose values are objects describing those properties. Each value in 'props' must be either a data descriptor or an accessor descriptor; it cannot be both.

Data descriptors and access descriptors may <u>optionally</u> contain the following keys:

`configurable`

* true <u>if and only if</u> (当且仅当) the type of this property descriptor may be changed <u>and if</u>(并且) the proeprty may be deleted from the corresponding object.  

* Default to false.

`enumerable`

* true if and only if this property shows up during enumeration of the properties on the corresponding object.
* default to false

A data descriptor also has the following <u>optional</u> keys:

`value`

* the value associated with the property. Can be any valid JavaScript value(number, object,function,etc).
* default to undefined

`writable`

* true if and only if the value associated with the property may be changed with an [<u>assignment operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#assignment_operators)</u>(赋值运算符).
* default to false

An access descriptor also has the following <u>optional</u> keys:

`get`

* A function which <u>serves as(作为)</u> a getter for the property, or undefined if there is no getter.
* the function's return value will be used as the value of the property.
* default to undefined

`set`

* A function which serves as a setter for the property, or undefined if there is no setter.
* the function will receive as ites only argument the new value being assigned to the property
* default to undefined

If a descriptor has neither of `value`, `writable`, `get` and `set` keys, it is treated as a data descriptor.

If a descriptor has both `value` or `writable` and `get` or `set` keys, an exception is thrown.

**return value**

the object that was passed to the function

**Example**

Using Object.defineProperties

```javascript
let obj = {};
Object.defineProperties(obj, {
  'property1': {
    value: true,
    writable: true
  },
  'property2': {
    value: 'hello',
    writabel: false
  }
})
```





#### Object.hasOwn():pencil2:

##### Define

> the static method return `true` if the specified object has the indicated property as its own property. If the property is inherited, or does not exist, the method returns `false`
>
> Note: `Object.hasOwn()` is intended as a replacement for `Object.hasOwnProperty()`

##### **Syntax**

> Object.hasOwn(instance, prop);

##### **Parameters**

`instance`

* the JavaScript object instace to test.

`prop`

* the `String` name or `Symbol` of the property to test.

##### **Desc**

* the `Object.hasOwn()` method returns `true` if the specified property is a direct property of the object -even if the property values is `null` or `undefined`.
* the method returns `false` if the property is inherited, <u>or has not been declared at all.</u>  ????
* Unlike the `in` operator, this method <u>does not check for the specified property in the object's prototype chain.</u>
* It is recommended over `Object.hasOwnProperty()` because it works for objects created using `Object.create(null)` and with objects that have overridden the inherited `hasOwnProperty()` method.
* While it is possible to workaround these problems by calling `Object.prototype.hasOwnProperty()` on an external object, `Object.hasOwn()` is more intuitive(直观的).

##### **example**

<u>Using hasOwn to test for a property's existence</u>

> The following code shows how to determine whether the `example` oject contains a proeprty named `prop`

```javascript
let example = {};
Object.hasOwn(example, 'prop');   // false = 'prop' has not been defined

example.prop = 'exists';
Object.hasOwn(example, 'prop');   // true - 'prop' has been defined

example.prop = null;
Object.hasOwn(example, 'prop');   // true - own property exists with value of null

example.prop = undefined;
Object.hasOwn(example, 'prop');   // true - own property exists with value of undefined
example.hasOwnProperty('prop')
```





<u>Direct  vs. inherited properties</u>

> the following example differentiates between direct properties and properties inherited through the prototype chain.

```javascript
let example = {}
example.prop = 'exists';

// `hasOwn` will only return true for direct properties:
Object.hasOwn(example, 'prop');             // returns true
Object.hasOwn(example, 'toString');         // returns false
Object.hasOwn(example, 'hasOwnProperty');   // returns false

// The `in` operator will return true for direct or inherited properties:
'prop' in example;                          // returns true
'toString' in example;                      // returns true
'hasOwnProperty' in example;                // returns true
```





<u>Iterating over the properties of an object</u>

> To iterate over the enumerable properties of an object, 

```javascript
let example = { foo: true, bar: true };
for (let name of Object.keys(example)) {
  // ...
}
```

but if you need to use `for...in`, u can use `Object.hasOwn()` to skip the inherited properties:

```javascript
let example = { foo: true, bar: true };
for (let name in example) {
  if (Object.hasOwn(example, name)) {
    // ...
  }
}
```





<u>Checking if an Array index exists</u>

> the elements of an `Array` are defined as direct properties, so you can use `hasOwn()` method to check whether a particular index exists

```javascript
let fruits = ['Apple', 'Banana','Watermelon', 'Orange'];
Object.hasOwn(fruits, 3);   // true ('Orange')
Object.hasOwn(fruits, 4);   // false - not defined
```



<u>Problematic cases for hasOwnProperty</u>

> the section demonstrate that `hasOwn()` is immune to the problems that affect `hasOwnProperty`.
>
> Firstly, it can be used with objects that have reimplemented `hasOwnProperty()`

```javascript
let foo = {
  hasOwnProperty: function() {
    return false;
  },
  bar: 'xxx'
};

if (Object.hasOwn(foo, 'bar')) {
  console.log(foo.bar); //
}
```

It can also be used to test objects created using `Object.create(null)`. These do not inherit from `Object.prototype`, and so `hasOwnProperty()` is inaccessible.

```javascript
let foo = Object.create(null);
foo.prop = 'exists';

if (Object.hasOwn(foo, 'prop')) {
  console.log(foo.prop);
}
```



#### Object.prototype.toString()

**Syntax**

```javascript
toString()
```



**Return value**

A string representing the object

**Desc**

An object's toString() method is most commonly invoked when that object undergoes...

* explicit(明确的) [type conversion](https://developer.mozilla.org/en-US/docs/Glossary/Type_Conversion) to a string(for example, String(myObject))
* implicit(含蓄的)  [type coercion](https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion) into a string(for example, myObject + 'hello world')

> Note: This assumes the object does not have a custom implementation of <span style="color:red;">**`Symbol.toPrimitive`**</span>. If it does, that method will take priority and be called instaed of `toString()`

While not as common, the method can be invoked directly(for example, myObject.toString())

By default toString() returns "[object Type]", where Type is the object type.

```javascript
const o = new Object().toString(); //o is "[object Object]"

//Symbol.toPrimitive
let obj = {
  toString() {return 1},
  [Symbol.toPrimitive]() {return 2}
};
obj + '1' //'21'
String(obj); //'2'
```

This method is inherited by every object descended from Object, but can be overridden by either the author or built-in descendant objects (for example, `Number.prototype.toString()`)



**Parameters**

* Be default `toString()` takes no parameters.
* however,objects that inherit from `Object` may override it with their own implementation that do take parameters. For example, the `toString()` methods implemented by `Number` and `BigInt` take an optional `radix`  parameter.

**Examples**

<u>Overriding the default toString method.</u>

* the `toString()` function you create must return a primitive.
* If it returns an object and the method is called implicitly<sup>含蓄的暗中的</sup>(i.e. during type conversion or coercion), then its result will be ignored 
  * and the value of a related method  <span style="color: red;"> **`valueOf()`**</span>, will be used instead, 
  * or a `TypeError` will be thrown if none of these methods return a primitive.

```javascript
//varify the upside conclusion
let obj = {
  toString() {return {} },
  valueOf() {return 1}
};
String(obj); //'1'
obj + 'a'; //'1a'
```



<u>Using toString() to detect object class</u>

`toString()` can be used with every object and (by default) allows you to get its class.

* To use the base `Object.prototype.toString()` with an object that has had it overridden, you need to call [`Function.prototype.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) or [`Function.prototype.apply()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) on it, passing the object you want to inspect as the first parameter (called `thisArg`).

```javascript
const toString = Object.prototype.toString;

toString.call(new Date); //[object Date]
toString.call(new String); //[object String]
toString.call(Math); //[object Math]

//since JavaScript 1.8.5
toString.call(undefined) //[object Undefined]
toString.call(null); //[object Null]
```



* Using `toString()` in this way is unreliable; objects can change the behavior of `Object.prototype.toString()`by defining a <span style="color: red;">**`Symbol.toStringTag`** </span>property, leading to unexpected results.

```javascript
const myDate = new Date();
Object.prototype.toString.call(myDate); //[object Date]

myDate[Symbol.toSTringTag] = 'myDate';
Object.prototype.toString.call(myDate); //[object myDate]

Date.prototype[Symbol.toStringTag] = 'prototype polluted';
Object.prototype.toString.call(new Date()); //[object prototype polluted]
```



**应用**

使用toString方法实现`a==1&&a==2&&a==3`结果为true

> https://juejin.cn/post/6950664413317693470
>
> 还有数组,Object.defineProperty方法

```javascript
let a = {
  i: 1,
  toString() {
    return a.i;
  }
}

a==1&&a==2&&a==3
//true
```





#### ES2022-Object.hasOwn()




#### Object.is

```js
- 判断两个值是否完全相等
- 和'==='相似,但是在NaN比较上不一致.
Object.is(a, b); //判断a与b是否全等
Object.is(NaN, NaN); //true
console.log(NaN === NaN); //false
Object.is(100, '100'); //false

```



#### Object.assign

> 于将所有==可枚举属性的值==从一个或多个源对象分配到目标对象。它将返回目标对象。

```js
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
- 对象的合并, 应用场景:配置对象的合并

- 语法:
Object.assign(proto, [, propertiesObject]); 
 - 参数:proto:必须.表示新建对象的原型对象,即该参数会被赋值到目标对象(即新对象,或说是最后返回的对象)的原型上.该参数可以是null(创建空的对象时需传入null),对象,函数的prototype属性. 否则会抛出TypeError错误.
 - prototiesObject:可选.该参数对象是一组属性与值//[,] mdn上的语法,表示可选参数
该参数对象是一组属性与值，该对象的属性名称将是新创建的对象的属性名称，值是属性描述符（这些属性描述符的结构与 Object.defineProperties() 的第二个参数一样）。这些属性是新对象自身的属性，而不是新对象原型链上的属性。

- 案例:
let obj={a:1, b:2};
let obj2={c:3, d:4, a:100}; //属性相同,后面的覆盖前面的
const result = Object.assign(obj, obj2);
console.log(result); //{a: 100, b: 2, c: 3, d: 4}
console.log(obj);// {a: 100, b: 2, c: 3, d: 4}
console.log(result === obj);//true


Object.assign方法只会拷贝源对象自身的并且可枚举(数组,对象等)的属性到目标对象.
修改属性和属性值为变量和字符串-,新对象会跟着改变.

继承属性和不可枚举属性是不能拷贝的
const obj=Object.create({foo:1},{//foo是个继承属性
    bar:{
        value:2 //bar是不可枚举属性
    },
    baz:{
        value:3,
        enumerable:true //baz是个自身可枚举属性
    }
})

const copy=Object.assign({}, obj);
console.log(copy);//{baz:3}

```



#### 直接修改\_\_proto\_\_设置原型

```js
let obj={a:1, b:2};
let obj2={c:3, d:4, a:100};

obj.__proto__ = obj2;
console.log(obj);//打印显示obj__proto__的obj2
```






## 对象不变性

这里的不变性是浅不变性,只会影响目标对象和它的直接属性。如果目标对象引用了其他对象（数组、对象、函数，等），其他对象的内容不受影响，仍然是可变的.



##### 1.对象常量

结合writable:false和configurable:false就可以创建一个真正的常量属性（不可修改、重定义或者删除）

```javascript
let myObj = {};

Object.defineProperty(myObj, 'FAVORITE NUMBER', {
  value: 42,
  writable: false,
  configurable: false
})
```



##### 2.禁止扩展

如果你想禁止一个对象添加新属性并且保留已有属性，可以使用Object.preventExtensions(..)

在非严格模式下，创建属性b会静默失败。在严格模式下，将会抛出TypeError错误。

```javascript
let myObj = {a:2};

Object.perventExtensions(myObj);

myObj.b = 3;
myObj.b; //undefined
```

```javascript
'use strict'
let obj = {a:2}

Object.preventExtensions(obj);

obj.b = 3;
//Uncaught TypeError: Cannot add property b, object is not extensible
```



##### 3.密封

Object.seal(..)会创建一个“密封”的对象，这个方法实际上会在一个现有对象上调用Object.preventExtensions(..)并把所有现有属性标记为configurable:false。

密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性（虽然可以修改属性的值）



##### 4.冻结

Object.freeze(..)会创建一个冻结对象，这个方法实际上会在一个现有对象上调用Object.seal(..)并把所有“数据访问”属性标记为writable:false，这样就无法修改它们的值。

这个方法是你可以应用在对象上的级别最高的不可变性，它会禁止对于对象本身及其任意直接属性的修改（不过就像我们之前说过的，这个对象引用的其他对象是不受影响的）。



##### 深度冻结对象的方法

首先在这个对象上调用Object.freeze(..)，然后遍历它引用的所有对象并在这些对象上调用Object.freeze(..)。但是一定要小心，因为这样做有可能会在无意中冻结其他（共享）对象





### Object的属性

#### Object.prototype.constructor

> 返回创建实例对象的`Object`构造函数的引用. 注意, 此属性的值是对函数本身的引用,而不是一个包含函数名称的字符串. 
>
> 对原始类型来说, 如`1`,`true`和`"test"`, 该值只可读. ????

```javascript
console.log(1['constructor']); //f Number() { [native code] }
true['constructor'] = 1
console.log(true['constructor']); //f Boolean() { [native code] }


let obj = {};
obj.constructor = 2;
console.log(obj.constructor); //2
```



**Des**

* all objects (with the execption of objects created with `Object.create(null)` )will have a `constructor` property.
* Objects created without the explicit use of a constructor function (such as object- and array-literals) will have a `constructor` property that points to the Fundamental Object type for that object.

```javascript
let o = {};
o.constructor === Object //true

let o = new Object;
o.constructor === Object //true

let a = [];
a.constructor === Array; //true

let a = new Array;
a.constructor === Array; //true

let n = new Number(3);
n.constructor === Number //true
```



**Examples**

<u>Displaying the constructor of an object</u>



<u>Changing the constructor of an object</u>

One can assign the `constructor` property for any value except `null` and `undefined` since those don't have a corresponding constructor function (like `String`, `Number`, `Boolean` etc,), but values which are primitives won't keep the change (with no exception thrown).

This is due to the same mechanism, which allows one to set any property on primitive values (except `null` and `undefined`) with no effect.

Namely whenever one uses such a primitive as an object an instance of the corresponding constructor is created and discarded right after the statement was executed.

```javascript
let val = null;
val.constructor = 1; //TypeError: val is null

val = 'abc';
val.constructor = Number; //
val.constructor === String //true

val.foo = 'bar'; //an implicit instance of String ('abc') was created and assigned the prop foo

val.foo === undefined; //true, since a new instance of String('abc') was created for this comparison, which doesn't have the foo property.
```

So basically one can change the value of the `constructor` property for anything, except the primitives mentioned above, <span style="color:red;">**note that changing the `constructor` property does not affect the instanceof operator**</span>:

```javascript
let a = [];
a.constructor = String;
a.constructor === String; //true

a instanceof String; //false
a instanceof Array; //true

a = new Foo();
a.constructor = 'bar';
a.constructor === 'bar'; //true


//etc.
```



```javascript
//标红那句话不理解.

// 对象 instanceof 函数

//1. instanceOf 的作用: 一个构造函数的原型是否出现在一个对象原型链上的任意位置

//2.a.constructor = String; 也就是说实例a的隐式原型的值为构造函数的显式原型: a.constructor.prototype

//3.instanceof操作符获取原型使用的是 Object.getPrototypeOf(instance); (具体用的那种方法需要查, 从其方法实现中的代码获取的getPrototypeOf)
	Object.getPrototypeOf(a); //数组的原型

//4. 所以更改构造函数原型不会影响instanceof操作符
```



If the object is sealed/frozen then the change has no effect and no exception is thrown:

```javascript
let a = Object.seal({});

a.constructor = Number;
a.constructor === Number; //false

```



<u>Changing the constructor of a function</u>



## 对象不变性

这里的不变性是浅不变性,只会影响目标对象和它的直接属性。如果目标对象引用了其他对象（数组、对象、函数，等），其他对象的内容不受影响，仍然是可变的.



##### 1.对象常量

结合writable:false和configurable:false就可以创建一个真正的常量属性（不可修改、重定义或者删除）

```javascript
let myObj = {};

Object.defineProperty(myObj, 'FAVORITE NUMBER', {
  value: 42,
  writable: false,
  configurable: false
})
```



##### 2.禁止扩展

如果你想禁止一个对象添加新属性并且保留已有属性，可以使用Object.preventExtensions(..)

在非严格模式下，创建属性b会静默失败。在严格模式下，将会抛出TypeError错误。

```javascript
let myObj = {a:2};

Object.perventExtensions(myObj);

myObj.b = 3;
myObj.b; //undefined
```

```javascript
'use strict'
let obj = {a:2}

Object.preventExtensions(obj);

obj.b = 3;
//Uncaught TypeError: Cannot add property b, object is not extensible
```



##### 3.密封

Object.seal(..)会创建一个“密封”的对象，这个方法实际上会在一个现有对象上调用Object.preventExtensions(..)并把所有现有属性标记为configurable:false。

密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性（虽然可以修改属性的值）



##### 4.冻结

Object.freeze(..)会创建一个冻结对象，这个方法实际上会在一个现有对象上调用Object.seal(..)并把所有“数据访问”属性标记为writable:false，这样就无法修改它们的值。

这个方法是你可以应用在对象上的级别最高的不可变性，它会禁止对于对象本身及其任意直接属性的修改（不过就像我们之前说过的，这个对象引用的其他对象是不受影响的）。



##### 深度冻结对象的方法

首先在这个对象上调用Object.freeze(..)，然后遍历它引用的所有对象并在这些对象上调用Object.freeze(..)。但是一定要小心，因为这样做有可能会在无意中冻结其他（共享）对象





### Object的属性

#### Object.prototype.constructor

> 返回创建实例对象的`Object`构造函数的引用. 注意, 此属性的值是对函数本身的引用,而不是一个包含函数名称的字符串. 
>
> 对原始类型来说, 如`1`,`true`和`"test"`, 该值只可读. ????

```javascript
console.log(1['constructor']); //f Number() { [native code] }
true['constructor'] = 1
console.log(true['constructor']); //f Boolean() { [native code] }


let obj = {};
obj.constructor = 2;
console.log(obj.constructor); //2
```



**Des**

* all objects (with the execption of objects created with `Object.create(null)` )will have a `constructor` property.
* Objects created without the explicit use of a constructor function (such as object- and array-literals) will have a `constructor` property that points to the Fundamental Object type for that object.

```javascript
let o = {};
o.constructor === Object //true

let o = new Object;
o.constructor === Object //true

let a = [];
a.constructor === Array; //true

let a = new Array;
a.constructor === Array; //true

let n = new Number(3);
n.constructor === Number //true
```



**Examples**

<u>Displaying the constructor of an object</u>



<u>Changing the constructor of an object</u>

One can assign the `constructor` property for any value except `null` and `undefined` since those don't have a corresponding constructor function (like `String`, `Number`, `Boolean` etc,), but values which are primitives won't keep the change (with no exception thrown).

This is due to the same mechanism, which allows one to set any property on primitive values (except `null` and `undefined`) with no effect.

Namely whenever one uses such a primitive as an object an instance of the corresponding constructor is created and discarded right after the statement was executed.

```javascript
let val = null;
val.constructor = 1; //TypeError: val is null

val = 'abc';
val.constructor = Number; //
val.constructor === String //true

val.foo = 'bar'; //an implicit instance of String ('abc') was created and assigned the prop foo

val.foo === undefined; //true, since a new instance of String('abc') was created for this comparison, which doesn't have the foo property.
```

So basically one can change the value of the `constructor` property for anything, except the primitives mentioned above, <span style="color:red;">**note that changing the `constructor` property does not affect the instanceof operator**</span>:

```javascript
let a = [];
a.constructor = String;
a.constructor === String; //true

a instanceof String; //false
a instanceof Array; //true

a = new Foo();
a.constructor = 'bar';
a.constructor === 'bar'; //true


//etc.
```



```javascript
//标红那句话不理解.

// 对象 instanceof 函数

//1. instanceOf 的作用: 一个构造函数的原型是否出现在一个对象原型链上的任意位置

//2.a.constructor = String; 也就是说实例a的隐式原型的值为构造函数的显式原型: a.constructor.prototype

//3.instanceof操作符获取原型使用的是 Object.getPrototypeOf(instance); (具体用的那种方法需要查, 从其方法实现中的代码获取的getPrototypeOf)
	Object.getPrototypeOf(a); //数组的原型

//4. 所以更改构造函数原型不会影响instanceof操作符
```



If the object is sealed/frozen then the change has no effect and no exception is thrown:

```javascript
let a = Object.seal({});

a.constructor = Number;
a.constructor === Number; //false

```



<u>Changing the constructor of a function</u>



## 变更原型

定义属性为`__proto__: 值` 或 `"__proto__": 值 `<span style="color: red;">不会创建</span>一个名称为`__proto__`的属性. 相反, 如果提供的值是一个对象或`null`, 会更改创建对象的`[[prototype]]`的值. (<span style="color:red; font-weight: bold;">如果这个值不是一个对象或`null`,这个对象不会发生变化</span>)

```javascript
let obj1 = {};
console.log(Object.getPrototypeOf(obj1) === Object.prototype); //true

let obj2 = {__proto__: null};
console.log(Object.getPrototypeOf(obj2) === null); //true

let protoObj = {};
let obj3 = {'__proto__': protoObj};
console.log(Object.getPrototypeOf(obj3) === protoObj);//true

let obj4 = {__proto__ : 'not an object or null'};
console.log(Object.getPrototypeOf(obj4) === Object.prototype); //true
console.log(!obj4.hasOwnProperty('__proto__')); //true
```

对象中只允许一次原型变更,多次变更会报语法错误.

不用冒号的属性定义不会原型变更.

> Property definitions that do not use 'colon' notation are not prototype mutations. They are property definitions that behave identically to similar definitions using any other name.

不使用冒号标记的属性定义,不会变更对象的原型;而是和其他具有不同名字的属性一样是普通属性定义.

```javascript
let __proto__ = 'variable';

let obj1 = {__proto__};
console.log(Object.getPropertyOf(obj1) === Object.prototype); //true
console.log(obj1.hasOwnProperty('__proto__')); //true
console.log(obj1.__proto__ === 'variable'); //true

let obj2 = {__proto__() {return 'hello'}};
console.log(obj2.__proto__() === 'hello'); //true

let obj3 = { ['__prot' + 'o__']: 17};
console.log(obj3.__proto__ === 17); //true
```



## 创建实例对象的 8 种模式

#### 1.工厂模式

缺点: 对象无法识别,因为所有的实例都指向一个原型

```javascript
function createPerson(name) {
  let o = new Object();
  o.name = name;
  o.getName = function() {
    console.log(this.name);
  };
  return o;
}

let person1 = createPerson('kevin');
```



#### 2.构造函数模式

优点: 实例可以识别为一个特定的类型

缺点: 每次创建实例时，每个方法都要被创建一次



```JavaScript
function Person(name) {
    this.name = name;
    this.getName = function () {
        console.log(this.name);
    };
}

var person1 = new Person('kevin');
```



##### 2.1 构造函数模式优化

优点: 解决了每个方法都要被重新创建的问题

缺点: 不是封装

```javascript
function Person(name) {
  this.name = name;
  this.getName = getName;
}
function getName() {
  console.log(this.name);
}

let person1 = new Person('kevin');
```



#### 3.原型模式

优点：方法不会重新创建

缺点：1. 所有的属性和方法都共享 2. 不能初始化参数

```javascript
function Person() {}

Person.prototype.name = 'kevin';
Person.prototype.getName = function() {
  console.log(this.name);
}

let person1 = new Person();
```



##### 3.1 原型模式优化

优点：封装性好了一点

缺点：重写了原型，丢失了constructor属性

```javascript
function Person() {}

Person.prototype = {
  name: 'kevin',
  getName: function() {
    console.log(this.name);
  }
};

let person1 = new Person();
```



##### 3.2 原型模式优化二

优点：实例可以通过constructor属性找到所属构造函数

缺点：原型模式该有的缺点还是有

```javascript
function Person() {}

Person.prototype = {
  constructor: Person,
  name: 'kevin',
  getName: function() {
    console.log(this.name);
  }
};

let person1 = new Person();
```



#### 4.组合模式

构造函数模式与原型模式双剑合璧。

优点：该共享的共享，该私有的私有，使用最广泛的方式

缺点：有的人就是希望全部都写在一起，即更好的封装性

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype = {
  constructor: Person,
  getName: function() {
    console.log(this.name);
  }
};

let person1 = new Person();
```



#### 5.动态原型模式

```javascript
function Person(name) {
  this.name = name;
  if (typeof this.getName !== 'function') {
    Person.prototype.getName = function() {
      console.log(this.name);
    }
  }
}

let person1 = new Person();
```

注意：使用动态原型模式时，不能用对象字面量重写原型

解释下为什么：

```javascript
function Person(name) {
  this.name = name;
  if (typeof this.getName !== 'function') {
    Person.prototype = {
      constrcutor: Person,
      getName: function() {
        console.log(this.name);
      }
    }
  }
}

let person1 = new Person('kevin');
let person2 = new Person('daisy');

//报错 并没有该方法
person1.getName();

//注释掉上面的代码,这句是可以执行的
person2.getName();
```

为了解释这个问题，假设开始执行`var person1 = new Person('kevin')`。

如果对 new 和 apply 的底层执行过程不是很熟悉，可以阅读底部相关链接中的文章。

我们回顾下 new 的实现步骤：

1. 首先新建一个对象
2. 然后将对象的原型指向 Person.prototype
3. 然后 Person.apply(obj)
4. 返回这个对象

注意这个时候，回顾下 apply 的实现步骤，会执行 obj.Person 方法，这个时候就会执行 if 语句里的内容，<u>注意构造函数的 prototype 属性指向了实例的原型，使用字面量方式直接覆盖 Person.prototype，并不会更改实例的原型的值，person1 依然是指向了以前的原型，而不是 Person.prototype。</u>而之前的原型是没有 getName 方法的，所以就报错了！((划线部分: 关于原型链以前的理解是有问题的. 我以为新建实例对象的原型会一直指向构造函数原型, 无论构造函数原型如何变化. 这是错误的, 因为实例原型只有过一次被赋值的行为, 再执行构造函数内部代码并更改函数原型并不会再影响实例原型啊,  背诵原型图后想当然以为这个关系是实时的一直存在的.))

如果你就是想用字面量方式写代码，可以尝试下这种：

```javascript
function Person(name) {
  this.name = name;
  if (typeof this.getName !== 'function') {
    Person.prototype = {
      getName: function() {
        console.log(this.name);
      }
    }
    return new Person(name);
  }
}


let person1 = new Person('kevin');
let person2 = new Person('daisy');

person1.getName(); //kevin
person2.getName(); //daisy
```



#### 6.寄生构造函数模式

```javascript
function Person(name) {
  let o = new Object();
  o.name = name;
  o.getName = function() {
    console.log(this.name);
  }
  return o;
}

let person1 = new Person('kevin');
console.log(person1 instanceof Person); //false
console.log(person1 instanceof Object); //true
```

寄生构造函数模式，我个人认为应该这样读：

<u>寄生-构造函数-模式，也就是说寄生在构造函数的一种方法。</u>

也就是说打着构造函数的幌子挂羊头卖狗肉，你看创建的实例使用 instanceof 都无法指向构造函数！

这样方法可以在特殊情况下使用。比如我们想<span style="text-decoration: underline wavy;">创建一个具有额外方法的特殊数组，但是又不想直接修改Array构造函数</span>，我们可以这样写：

```javascript
function specialArray() {
  let values = new Array();
  
  for (let i=0, len=arguments.length; i<len; i++) {
    values.push(arguments[i]);
  }
  
  values.toPipedString = function() {
    return this.join('|');
  }
  return values;
}

let colors = new SpecialArray('red', 'blue', 'green');
let colors2 = SpecialArray('red2', 'blues', 'green2');

console.log(colors);
console.log(colors.toPipedString()); // red|blue|green

console.log(colors2);
console.log(colors2.toPipedString()); // red2|blue2|green2

```

你会发现，其实所谓的寄生构造函数模式就是比工厂模式在创建对象的时候，多使用了一个new，实际上两者的结果是一样的。

但是作者可能是希望能像使用普通 Array 一样使用 SpecialArray，虽然把 SpecialArray 当成函数也一样能用，但是这并不是作者的本意，也变得不优雅。????

<u>在可以使用其他模式的情况下，不要使用这种模式。</u>

但是值得一提的是，上面例子中的循环：

```javascript
for (let i=0, len=arguments.length; i<len; i++) {
  values.push(arguments[i]);
}
```

可以替换成:

```javascript
values.push.apply(values, arguments);
[].push.apply(values, arguments);
```



#### 7.稳妥构造函数模式

```javascript
function Person(name) {
  let o = new Object();
  o.sayName = function() {
    console.log(name);
  };
  return o;
}

let person1 = person('kevin');

person1.sayName(); //'kevin'

person1.name = 'daisy';
person1.sayName(); //kevin

console.log(person1.name); //daisy
```

所谓**稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象。**

与寄生构造函数模式有两点不同：

1. 新创建的实例方法不引用 this
2. 不使用 new 操作符调用构造函数

稳妥对象最适合在一些安全的环境中。

稳妥构造函数模式也跟工厂模式一样，无法识别对象所属类型。




## 对象的引用和复制

#### 1.引用类型和原始类型引用复制的区别

> 原始类型(数字,字符串,布尔值,symbol,bigInt)是以'整体值'的形式被复制的, 对象是'通过引用'被存储和复制的.
>
> 赋值了对象的变量存储的不是对象本身,而是该对象'在内存中的地址', 也就是对象的引用.
>
> 当一个对象变量被复制(引用被复制), 该对象并没有被复制.
>
> 我们可以通过任何一个变量来访问对象并修改它的内容,修改对另一个变量是可见的.



#### 2.通过引用来比较

**当两个对象为同一个对象时,两者才相等**

```js
let a = {};
let b = a; //复制引用

console.log(a == b); //true
console.log(a === b); //true

```

**两个独立的对象不相等,即使都为空的条件下**

```js
let a = {},
    b = {};

console.log(a == b); //false 
console.log(a === b); //false

let a = Object.create(null),
    b = Object.create(null);

console.log(a == b); //false
```

**数值比较**

对于类似 `obj1 > obj2` 的比较，或者跟一个原始类型值的比较 `obj == 5`，对象都会被转换为原始值。



#### 3.克隆与合并

如果想要复制一个对象, 创建一个独立的拷贝,克隆.(假设对象的所有属性都是原始类型)

克隆对象需要面对的问题:

* 区分浅拷贝和深拷贝

* 对待循环引用的处理

* 函数的处理: 是采用toString还是其他



#### 4.浅拷贝对象



##### 1. for循环复制

创建一个新对象，并通过遍历现有属性的结构，在原始类型值的层面，将其复制到新对象，以复制已有对象的结构。

```js
let user = {
  name: 'John',
  age: 30
};

let clone = {};

for(let k in user) {
  clone[key] = user[key];
}

// 现在 clone 是带有相同内容的完全独立的对象
clone.name = "Pete"; // 改变了其中的数据

alert( user.name ); // 原来的对象中的 name 属性依然是 John
```

##### 2. Object.assign

> 它会遍历一个或多个源对象的所有可枚举(enumerable)的自有键(owned key)并把它们复制(适用`=`操作符赋值)到目标对象, 最后返回目标对象.



用 `Object.assign` 代替 `for..in` 循环来进行简单克隆

```js
let user = {
  name: "John",
  age: 30
};

let clone = Object.assign({}, user); 
```

##### 3. 数组中的浅拷贝

* slice
* concat
* 展开运算符

深层克隆

对象属性为其他对象的引用,如何处理? 如果使用上面的克隆循环的方式, 属性对象会以引用形式被拷贝.

```js
let user = {
  name: 'John',
  sizes: {
    height: 182,
    width: 50
  }
}

let clone = Object.assign({}, user);
clone.sizes === user.sizes //true
```

为了解决此问题，我们应该使用会检查每个 `user[key]` 的值的克隆循环，如果值是一个对象，那么也要复制它的结构。这就叫“深拷贝”。

可以使用递归或者使用现成的实例,例如lodash库中的_.cloneDeep(obj).

```js
//深拷贝

1.JSON.parse(JSON.stringify(obj))

2.
```





##### 总结

```js
对象通过引用被赋值和拷贝。换句话说，一个变量存储的不是“对象的值”，而是一个对值的“引用”（内存地址）。因此，拷贝此类变量或将其作为函数参数传递时，所拷贝的是引用，而不是对象本身。

所有通过被拷贝的引用的操作（如添加、删除属性）都作用在同一个对象上。

为了创建“真正的拷贝”（一个克隆），我们可以使用 Object.assign 来做所谓的“浅拷贝”（嵌套对象被通过引用进行拷贝）或者使用“深拷贝”函数，例如 _.cloneDeep(obj)。
```



#### 5.深拷贝

> 几种深拷贝方式

##### 5.1 JSON方式

适用于JSON安全对象（可以被序列化为一个JSON字符串并且可以根据这个字符串解析出一个结构和值完全一样的对象）

适用于JSON安全对象（可以被序列化为一个JSON字符串并且可以根据这个字符串解析出一个结构和值完全一样的对象）

```js
function deepClone(target) {
	return JSON.parse(JSON.stringify(obj));
}
```



##### 5.2 普通方法

```js
//09 文档中
直接进行赋值操作,字符串,数组,对象及对象的方法

例如,对象的方法
target.fn = proObj.fn.bind(target);
```



##### 5.3 递归



## 对象字面量扩展语法

#### ES6-属性初始值简写

在ECMAScript 5及更早版本中，对象字面量只是简单的<u>键值对集合</u>，这意味着初始化属性值时会有一些重复.

```javascript
//ES5
function createPerson(name, age) {
  return {
    name: name,
    age: age
  };
}
```

在ECMAScript 6中，通过使用属性初始化的简写语法，可以消除这种属性名称与局部变量之间的重复书写。**当一个对象的属性与本地变量同名时，不必再写冒号和值，简单地只写属性名即可。**

```javascript
//ES6
function createPerson(name, age) {
  return {
    name,
    age
  }
}
```

对象字面量里只有一个属性的名称时，JavaScript引擎会在可访问作用域中查找其同名变量；如果找到，则该变量的值被赋给对象字面量里的同名属性。



#### ES6-对象方法简写

在ECMAScript 6中，语法更简洁，消除了冒号和function关键字

简写方法的属性名可以是对象字面量允许的任何形式.除了常规的JS标识符外,也可以使用字符串字面量和计算的属性名,包括符号属性名.

```javascript
//ES5
let person = {
  name: 'Nicholas',
  sayName: function() {
    console.log(this.name);
  }
};

//ES6
let person = {
  name: 'Nicholas',
  sayName() {
    console.log(this.name);
  }
}

//属性名称
const METHOD_NAME = 'm'
const symbol = Symbol()
let weirdMethods = {
  'method with Spaces'(x) { return x+1 },
  [METHOD_NAME](x) {return x + 2},
  [symbol](x) {return x + 3}
}
```

通过对象方法简写语法，在person对象中创建一个sayName()方法，该属性被赋值为一个匿名函数表达式，它拥有在ECMAScript 5中定义的对象方法所具有的全部特性。<span style="text-decoration:underline double red;">二者唯一的区别是，简写方法可以使用super关键字.</span>

为了让对象可迭代(以便在for/of循环中使用), 必须使用符号Symbol.iterator为它定义一个方法.



#### 可计算属性名

##### ES5可计算属性名

在ECMAScript 5及早期版本的对象实例中，如果想要通过计算得到属性名，就需要**用方括号代替点记法**。有些包括某些字符的字符串字面量作为标识符会出错，其和变量放在方括号中都是被允许的。

```javascript
//ES5
let person = {},
    lastName = 'last name';

person['first name'] = 'Nicholas';
person['lastName'] = 'Zakas';

console.log(person['first name']); //'Nicholas'
console.log(person[lastName]); //'Zakas'
```

在对象字面量中，可以直接使用字符串字面量作为属性名称

```javascript
let person = {
  'first name': 'Nicholas'
};
console.log(person['first name']); //'Nicholas'
```

这种模式适用于属性名提前已知或可被字符串字面量表示的情况。然而，如果属性名称"firstname"被包含在一个变量中（就像之前示例中的那样），或者需要通过计算才能得到该变量的值，那么在ECMAScript 5中是无法为一个对象字面量定义该属性的。

##### ES6可计算属性名

<u>而在ECMAScript 6中，可在对象字面量中使用可计算属性名称，其语法与引用对象实例的可计算属性名称相同，也是使用方括号</u>

```javascript
let lastName = 'last Name';
let person = {
  'first name': 'Nicholas',
  [lastName]: 'Zakas'
};

console.log(person['first name']); //'Nicholas'
console.log(person[lastName]); //'Zakas'
```

在对象字面量中使用方括号表示的该属性名称是可计算的，它的内容将被求值并被最终转化为一个字符串，因而同样可以**使用表达式作为属性的可计算名称**

```javascript
let suffix = ' name';
let person = {
  ['first' + suffix]: 'Nicholas',
  ['last' + suffix]: 'Zakas'
};

console.log(person['first name']); //
console.log(person['last name']); //
```

任何可用于对象实例括号记法的属性名，也可以作为字面量中的计算属性名。



##### 数组支持`[]`访问形式

* 可以给数组添加命名属性
* 添加了命名属性（无论是通过．语法还是[]语法），数组的length值并未发生变化。
* 如果你试图向数组添加一个属性，但是属性名“看起来”像一个数字，那它会变成一个数值下标
* 用对象来存储**键/值对**，只用数组来存储**数值下标/值对**。

##### 符号作为属性名

在ES6及之后, 属性名可以是字符串和符号. 如果把符号赋值给一个变量或常量,那么可以使用计算属性语法将符号作为属性名.

```javascript
const extension = Symbol('my extension symbol')
let o = {
  [extension]: {
    //这个对象中存储扩展数据
  }
}

o[extension].x = 0
```

**特点**

* 创建新符号需要调用Symbol()工厂函数(符号是原始值,不是对象,因此Symbol()不是构造函数,不能使用new调用).
* Symbol返回值不等于任何其他符号或其他值.
* 可以给Symbol()传一个字符串,在把符号转换为字符串时会用到这个字符串. 这个字符串的作用仅限于辅助调试,使用相同字符串参数创建的两个符号依旧是不同的符号.
* 使用符号不是为了安全,是为了对象定义安全的扩展机制
  * 从第三方代码得到一个对象,需要给该对象添加一个属性,但不希望自己的属性和原有任何属性起冲突,那么可以使用符号作为属性名.也不担心第三方修改意外修改以符号命名的属性.
  * 当然,第三方可以通过Object.getOwnPropertySymbols()找到你使用的符号,然后修改或删除你的属性.这也是符号不安全的原因之一.



#### 扩展操作符

在ES2018及之后,可以在对象字面量中使用'扩展操作符'(...)把已有对象的属性复制到新对象中.

只有在对象字面量中,三个点才回产生把一个对象的属性复制到另一个对象中的插值行为.

扩展操作符只扩展对象的自有属性,不扩展任何继承属性.

注意: 扩展操作符可能给JS解释器带来巨大工作量.如果对象有n个属性,把这个属性扩展到另一个对象可能是一种`O(n)`操作. 这意味着,如果在循环或递归函数中通过...向一个大对象不断追加属性,则很可能是在写一个抵消的`O(n**2)`算法.随着n越来越大,这个算法可能成为性能瓶颈.

##### 扩展操作符的一些案例

```javascript
{...'a'} // {0 : 'a'}
{...false} // {}
{...true} // {}
{...1}    // {}
```



## 对象原型访问及更改
#### 0. 实例化后更改对象的原型

**ES5**

正常情况下，无论是通过**构造函数或Object.create()**方法创建对象，其原型是在对象被创建时指定的。对象原型在实例化之后保持不变，直到ECMAScript 5都是JavaScript编程最重要的设定之一，虽然在ECMAScript 5中添加了Object.getPrototypeOf()方法来返回任意指定对象的原型，但仍缺少对象在实例化后改变原型的标准方法。

**ES6**

ECMAScript 6的<span style="color:blue; font-weight:bold">Object.setPrototypeOf()</span>方法来改变这一现状，通过这个方法可以改变任意指定对象的原型，它接受两个参数：被改变原型的对象及替代第一个参数原型的对象

```javascript
let person = {
  getGreeting() {
    return 'hello';
  }
};

let dog = {
  getGreeting() {
    return 'woof';
  }
}

//以person对象为原型
let friedn = Object.create(person);
console.log(friend.getGreeting()); //'hello'
console.log(Object.getPrototypeOf(friend) === person); //true

//将原型设置为dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting()); //'woof'
console.log(Object.getPrototypeOf(friend) === dog); //true
```



**[[prototype]]**

对象原型的真实值被储存在内部专用属性[[Prototype]]中，

调用Object.getPrototypeOf()方法返回储存在其中的值，调用Object.setPrototypeOf()方法改变其中的值。



#### 1. 简化原型访问的Super引用

ECMAScript 6引入了Super引用的特性，<u>使用它可以更便捷地访问对象原型</u>

如果你想重写对象实例的方法，又需要调用与它同名的原型方法，在ES5和ES6中的实现方法:

```javascript
//ES5
let person = {
  getGreeting() {
    return 'hello';
  }
};

let dog = {
  getGreeting() {
    return 'woof';
  }
}

let friend = {
  getGreeting() {
    return Object.getPrototypeOf(this).getGreeting.call(this) + ', hi';
  }
};

//将原型设置为person
Object.setPrototypeOf(friend, person);
console.log(friend.getGreeting()); //'hello, hi'
console.log(Object.getPrototypeOf(friend) === person); //true


//将原型设置为dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting()); //'hello, woof'
console.log(Object.getPrototypeOf(friend) === dog); //true

//Object.getPrototypeOf()方法可以确保调用正确的原型，并向输出字符串叠加另一个字符串
//后面的.call(this)可以确保正确设置原型方法中的this值
```

要准确记得如何使用Object.getPrototypeOf()方法和.call(this)方法来调用原型上的方法实在有些复杂，所以ECMAScript 6引入了super关键字. <span style="color:blue;font-weight:bold">简单来说，Super引用相当于指向对象原型的指针，实际上也就是**Object.getPrototypeOf(this)**的值。</span>

```javascript
//ES6
let friend = {
  getGreeting() {
    //与ES5中的Object.getPrototypeOf(this).getGreeting.call(this)相同
    return super.getGreeting() + ', hi';
  }
};

```

调用super.getGreeting()方法相当于在当前上下文中调用Object.getPrototypeOf(this).getGreeting.call(this)。同样，可以通过Super引用调用对象原型上所有其他的方法。当然，<span style="text-decoration: underline wavy blue">必须要在使用简写方法的对象中使用Super引用，但如果在其他方法声明中使用会导致语法错误</span>

```javascript
let friend = {
  getGreeting: function() {
    //语法错误
    return super.getGreeting() + ', hi';
  }
};
```

在这个示例中用匿名function定义一个属性，由于在当前上下文中Super引用是非法的，因此当调用super.getGreeting()方法时会抛出语法错误。????

Super引用在多重继承的情况下非常有用，因为在这种情况下，使用Object.getPrototypeOf()方法将会出现问题。????!!!!

```javascript
let person = {
  getGreeting() {
    return 'hello';
  }
};

//以person为原型对象
let friend = {
  getGreeting() {
    return Object.getPrototypeOf(this).getGreeting.call(this) + '. hi';
  }
};

Object.setPrototypeOf(friend, person);

//原型是friend
let relative = Object.create(friend);

console.log(person.getGreeting()); // 'hello'
console.log(friend.getGreeting()); // 'hello, hi'
console.log(relative.getGreeting()); //error  ????!!!!
```

this是relative, relative的原型是friend对象，当执行relative的getGreeting方法时，会调用friend的getGreeting()方法，而此时的this值为relative，Object.getPrototypeOf(this)又会返回friend对象。所以就会进入递归调用直到触发栈溢出报错。

在ECMAScript 5中很难解决这个问题，但在ECMAScript 6中，使用Super引用便可以迎刃而解：

```javascript
let person = {
  getGreeting() {
    return 'hello';
  }
};

//以person为原型对象
let friend = {
  getGreeting() {
    return super.getGreeting.call(this) + '. hi';
  }
};

Object.setPrototypeOf(friend, person);

//原型是friend
let relative = Object.create(friend);

console.log(person.getGreeting()); // 'hello'
console.log(friend.getGreeting()); // 'hello, hi'
console.log(relative.getGreeting()); // 'hello, hi'
```

Super引用不是动态变化的，它总是指向正确的对象，在这个示例中，无论有多少其他方法继承了getGreeting方法，super.getGreeting()始终指向person.getGreeting()方法。





#### 1. super 和[[HomeObject]]

**[[HomeObject]]**

在ECMAScript 6以前从未正式定义“方法”的概念，方法仅仅是一个具有功能而非数据的对象属性。而<u>在ECMAScript 6中正式将方法定义为一个函数，它会有一个内部的**[[HomeObject]]属性**来容纳这个方法从属的对象。</u>

```javascript
let person = {
  //方法
  getGreeting() {
    return 'Hello';
  }
};

//不是方法
function shareGreeting() {
  return 'Hi';
}
```

由于直接把函数赋值给了person对象，因而getGreeting()方法的[[HomeObject]]属性值为person。而创建shareGreeting()函数时，由于未将其赋值给一个对象，因而该方法没有明确定义[[HomeObject]]属性。在大多数情况下这点小差别无关紧要，但是当使用Super引用时就变得非常重要了。

**Super**

可以使用super关键字调用对象原型上的方法，此时的this绑定会被自动设置为当前作用域的this值。

<span style="text-decoration:underline wavy blue">Super的所有引用都通过[[HomeObject]]属性来确定后续的运行过程。第一步是在[[HomeObject]]属性上调用Object.getPrototypeOf()方法来检索原型的引用；然后搜寻原型找到同名函数；最后，设置this绑定并且调用相应的方法。</span>

```javascript
let person = {
  getGreeting() {
    return 'Hello';
  }
};

//以person对象为原型
let friend = {
  getGreeting() {
    return super.getGreeting() + ', hi';
  }
};

Object.setPropertyOf(frined, person);

console.log(friend.getGreeting()); //'Hello, hi'
```

friend.getGreeting()方法的[[HomeObject]]属性值是friend，friend的原型是person，所以**super.getGreeting()等价于person.getGreeting.call(this)**。




## 对象使用案例


#### 合并多个对象的方法

> https://juejin.cn/post/6882549580559777800
>
> https://blog.csdn.net/weixin_45818024/article/details/114651552



##### 1. 利用assign合并多个对象



##### 利用扩展操作符



##### 浅拷贝





##### 深拷贝













#### 比较两个对象中的属性是否相同数量是否相等

```js
//Object.keys()或Object.assign()
function (obj1, obj2) {
  if (
  	Object.keys({...obj1, ...obj2}).length === Object.keys(obj1)
  		&&
    Object.keys({...obj1, ...obj2}).length === Object.keys(obj2)
  ) {
    return '两个对象的属性名数量相等值相同'
  }
}


//Set
使用集合代替展开运算符


//
```



#### 两个对象的属性是否相等

```js
//
function compareObj(obj1, obj2) {
  //比较两个对象的长度
  let obj1Len = Object.keys(obj1).length;
  let obj2Len = Object.keys(obj2).length;
  if (obj1Len === obj2Len) {  //对象属性都是原始数据类型
    return Object.keys(obj1).every(item => obj2.hasOwnProperty(item) && obj1[item] === obj2[item]);
  }
}


```



```js
//https://www.geeksforgeeks.org/how-to-check-two-objects-have-same-data-using-javascript/
<script>
	const obj1 = {
		name: 'Ram',
		age: 21,
		hobbies: ['Cricket', 'Swimming']
	};

	const obj2 = {
		name: 'Ram',
		age: 21,
		hobbies: ['Cricket', 'Swimming']
	};
	const haveSameData = function(obj1, obj2) {
		const obj1Length = Object.keys(obj1).length;
		const obj2Length = Object.keys(obj2).length;

		if(obj1Length === obj2Length) {
			return Object.keys(obj1).every(
				key => obj2.hasOwnProperty(key)
				&& obj2[key] === obj1[key]);
		}
		return false;
	}
	document.write(haveSameData(obj1, obj2));
</script>
```

```js
//https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects

```



#### 0. 对象转换为数组

```javascript
//es5
//对象的key的集合或者value的集合 简单
let arr = [];
for (let i in object) {
  arr.push(object[i]);
}

//key-value形式的数组
let arr = [];
for (let i in obj) {
  let o = {};
  o[i] = obj[i];
  arr.push(o);
}

//es6 Object.keys()

//es7
//Object.values 和 Object.entries，作为遍历一个对象的补充手段，供 for...of 循环使用

//Object.entries 方法的另一个用处是，将对象转为真正的 Map 结构
const obj = { foo: 'bar', baz: 42 };  
const map = new Map(Object.entries(obj));  
map
```



#### 1. 比较两个对象相同属性的值是否不同

```javascript
let obj1 = {a: 1, b: 2, c: 3},
    obj2 = {b: 1, a: 1, c: 3};

for (const [key, value] of Object.entries(obj1)) {
  if (obj2[key] !== value) return false  
}

//报错信息: Uncaught SyntaxError: Illegal return statement
//return只能在函数中使用
```



#### 2. 去重数组中的对象

```javascript
let arr = [{a: 1, b: 2}, {a: 1, b: 2}, {b:1, a: 2}, {c: 3, d: 4}];

//条件: keys长度是否相同, a[key]等于b的value
//先判断属性值为基本类型

let result = arr.reduce((acc, cur) => {
  
 let selectVal = acc.some(item => {
   
   let lenIsSame = Object.keys({...item, ...cur}).length === Object.keys(cur).length,
       valIsSame = Object.entries(item).every(([key, value]) => cur[key] === value);
   
   return lenIsSame && valIsSame;
 });
  
 if (!selectVal) {
   acc.push(cur);
 }
  
 return acc;
}, [arr[0]])
```



#### 3. 判断两个对象相等

> 见运算符>>>关系运算符>>>全等运算符中的 自定义函数



#### 判断对象是空对象

```js
let data = {}
let b = JSON.stringify(data) == '{}'
console.log(b) //true
```


**getOwnPropertyNames() && getOwnPropertySymbols()**
```js
const a = {[Symbol()]: 'a'}
const b = {a: 'a'}
const c = {}

console.log(Object.getOwnPropertyNames(a).length === 0 && Object.getOwnPropertySymbols(a).length === 0)  // false 
console.log(Object.getOwnPropertyNames(b).length === 0 && Object.getOwnPropertySymbols(b).length === 0)  // false
console.log(Object.getOwnPropertyNames(c).length === 0 && Object.getOwnPropertySymbols(c).length === 0)  // true
```


**Reflect.ownKeys()**
```js
const a = { [Symbol()]: 'a' } 
const b = { a: 'a' } 
const c = {} 
console.log(Reflect.ownKeys(a).length === 0) // false
console.log(Reflect.ownKeys(b).length === 0) // false 
console.log(Reflect.ownKeys(c).length === 0) // true
```