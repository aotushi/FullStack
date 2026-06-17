---
aliases: 类,class
---
## 概述
<blockquote style="padding:24px;margin:16px 0; border:3px solid #f7f4f3">
<style>
	footer::before {
		content: "\E81A"
		font-size:17px;
		line-height: 40px;
		position: absolute;
		left: -53px;
		top: -8px;
		width: 40px;
		height: 40px;
		text-align: center;
		color: #ccc;
	}
	
</style>
<div style="float:left;box-sizing:border-box;width:75%;padding-right:70px;">
	<div style="font-style:italic;color:#716f6e">
		<p>在面向对象的编程中，<em>class</em> 是用于创建对象的可扩展的程序代码模版，它为对象提供了状态（成员变量）的初始值和行为（成员函数或方法）的实现。</p>
	</div>
</div>
<footer style="float:right;position:relative;box-sizing:border-box;width:20%;">
	<cite style="font-size:14px;line-height:20px;font-style:normal;">Wikipedia</cite>
</footer>
<div style="clear:both;"></div>
</blockquote>


### 类的概述

#### 什么是类
类是一种设计模式.

面向对象编程强调的是数据和操作数据行为的相互关联,例如所有字符串都是String类的实例,包含字符数据和数据上的方法.
例子:
交通工具类: 定义引擎,载人能力等;
汽车类: 使用交通工具类中定义的方法(继承); 使用和父类相同的方法名来表示重写父类(多态)
汽车的实例: 车辆识别码




#### 类的特点
面向类的设计模式：实例化（instantiation）、继承（inheritance）和（相对）多态（polymorphism）.但这些概念实际上无法直接对应到JavaScript的对象机制,而是使用了其它方法来实现.


#### JS中的类
类意味着复制
传统的类被实例化时,它的行为会被复制到实例中.类被继承时,行为也会被复制到子类中.
JS并不会(像类那样)自动创建对象的副本.混入模式无法完全模拟类的复制行为,对象(和函数)只是复制引用.


#### 模拟类的复制行为
继承或实例化时, JS的对象机制并不会自动执行复制行为.简单来说,JS中只有对象,不存在被实例化的'类'.一个对象不会被复制到其它对象,它们会被关联起来.
JS中模拟类的复制行为的方法: 混入(分为[[显式混入|显式混入]]和 [[隐式混入|隐式混入]])




## 定义类的2种方式
类是“特殊的函数”，类和函数都有两种存在形式：声明形式和表达式形式


### 类声明
语法
```js
class MyClass {
	constructor (..) {..}
	method1() {}
	method2() {}
	//...
}
```

使用带有class关键字的类名.括号里写法和对象类似,但没有逗号
```js

class PersonClass {
  //等价于PersonType构造函数
  constructor(name) {
    this.name = name;
  }
  
  //等价于PersonType.prototype.sayName
  sayName() {
    console.log(this.name);
  }

	//PersonClass.prototype.age ??
	age = 13
}
```

其对应的ES5代码实现
```js
function PersonClass(name) {
	this.name = name
}

PersonClass.prototype.sayName = function() {
	console.log(this.name)
}

PersonClass.prototype.age = 13
```

#### 类的使用

使用`new PersonClass('jack')` 来创建具有上述列出所有方法/属性的新对象. 
`new`会自动调用`constructor()`方法, 因此可以在`constructor()`中初始化对象.


#### 修改类constructor函数返回值

可以通过在constructor函数中通过return返回一个新对象来覆盖默认的对象
```js
class Person {
	constructor(name) {
		this.name = name
		this.sex  = 'man'
	}
}
```

使用return返回一个对象
```js
class Person {
	constructor(name) {
		return {
			name,
			sex: 'man'
		}
	}
}
```





#### 类的new操作符做了什么  //不完全

1.创建一个新的对象
2.`constructor`使用给定的参数运行,并将参数挂载到`this`上

参考: 构造函数的new操作符做了什么?  [[Function#new的具体流程]]

#### 来源

[当new User('John')被调用](https://zh.javascript.info/class)




### 类表达式
表达式形式的函数和类与之类似，只是不需要在关键字后添加标识符。<u>类表达式的设计初衷是为了声明相应变量或传入函数作为参数。</u> ??


#### syntax
匿名类表达式
```js
let P = class { }

console.log(P.name) //'P'
```
命名类表达式
声明时，在关键字class后添加一个标识符即可定义为**命名类表达式**
```js
let P = class P2 {}
console.log(P.name) //'P2'

let P1 = class P2 {
	sayName() {
		console.log(P2.name) //'P2'
		console.log(P1.name) //chrome: ReferenceError: P1 is not defined; Edge:'P2'
	}
}

console.log(P2) //ReferenceError: P2 is not defined
```


#### ES5模拟实现一个类
在JavaScript引擎中，类表达式的实现与类声明稍有不同。对于类声明来说，通过let定义的外部绑定与通过const定义的内部绑定具有相同名称；而命名类表达式通过const定义名称，从而MyClass2只能在类的内部使用。
```js
//ES6

let MyClass = class MyClass2 {
	constructor(name) {
		this.name = name
	}

	sayName() {
		console.log(this.name)
	}
}
```


```js
let PersonClass = (function() {
  'use strict'
  const PersonClass = function(name) {
    //确保通过关键字new调用该函数
    if (typeof new.target === 'undefined') {
      throw new Error('必须通过关键字new调用该构造函数');
    }
    this.name = name;
  }
  
  Object.defineProperty(PersonClass2.prototype, 'sayName', {
    value: function() {
      //确保不会通过关键字new调用该方法
      if (typeof new.target !== 'undefined') {
        throw new Error('不可使用new调用该方法');
      }
      console.log(this.name);
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
  
  return PersonClass2;
})();
```

这段代码中有两处PersonClass声明：一处是外部作用域中的let声明，一处是立即执行函数表达式（IIFE）中的const声明，<span style="text-decoration: underline wavy blue;">这也从侧面说明了为什么可以在外部修改类名而内部却不可修改</span>。

在构造函数中，先检查new.target是否通过new调用，如果不是则抛出错误；紧接着，将sayName()方法定义为不可枚举，并再次检查new.target是否通过new调用，如果是则抛出错误；最后，返回这个构造函数。

从这个示例我们可以看到，尽管可以在不使用new语法的前提下实现类的所有功能，但如此一来，代码变得极为复杂。


### 类声明和类表达式的区别
* 二者均不会像函数声明一样被提升
* name属性不同，匿名类表达式的name属性值是一个空字符串，而类声明的name属性值为类名
* 在JavaScript引擎中，类表达式的实现与类声明稍有不同: 类声明，通过let定义的外部绑定与通过const定义的内部绑定具有相同名称；而命名类表达式通过const定义名称，从而PersonClass2只能在类的内部使用。


### 类与语法糖之间的差异
>[Class 基本语法 (javascript.info)](https://zh.javascript.info/class#bu-jin-jin-shi-yu-fa-tang)

人们常说 `class` 是一个语法糖（旨在使内容更易阅读，但不引入任何新内容的语法）.
如下代码通过使用构造器及原型方法来实现类的效果:
```js
// 类实现
class User {
	constructor(name) {
		this.name = name
	}
	sayHi() {
		alert(this.name)
	}
}


//es5实现
function User(name) {
	return this.name
}
User.prototype.sayHi = function() {
	alert(this.name)
}
```

但它们之间存在巨大的差异:
1.通过 `class` 创建的函数具有特殊的内部属性标记 `[[IsClassConstructor]]: true`
2.类的方法不可枚举.类定义将 `"prototype"` 中的所有方法的 `enumerable` 标志设置为 `false`
3.类中总是使用'use strict'.


## 类体

### class body
类体是花括号内的部分.定义类成员的地方,例如类方法或构造函数.
类内部以'严格模式'执行,即使没有'use strict'指令
一个类可由3部分作为特征:  ??
* Kind: getter, setter,method,filed
* Location: Static or instance
* Visibility: Public or private


### constructor

#### 概述
是类的专用方法,用来创建和初始化类的对象实例.

#### syntax

#### description
* 是一个类必须具有的函数.可以手动添加,如果没有则会自动隐式添加constructor()函数。
	* 如果是基类, 默认constructor是空的
	* 如果是派生类,默认constructor会传递所有给与的参数,后通过super来调用父类构造函数
* constructor()函数默认会返回当前对象的实例 ??，即默认的this指向，我们可以手动修改返回值 [[202301181330a12|修改类constructor函数返回值]]


```js
class ValidationError extends Error {
	constructor(message) {
		super(message)
		this.name = 'ValidationError'
		this.code = '42'
	}

	printCustomeMessage() {
		return `Validation failed: -((details: ${this.message}, code:${this.code})`
	}
}


```

#### 来源

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor





### extends
用在[[03 JavaScript&TypeScript/202301181330a|类声明]]或[[202301181330b|类表达式]]中用来创建子类.

#### syntax
```js
class ChildClass extends ParentClass { /* … */ }
```

`ParentClass`
计算结果为构造函数(包括类)或`null`的表达式([[202301181331d2|extends右侧表达式]])

#### desc
* `extends`关键字能用来将自定义类及内建对象编入子类.
* 能被[[new|new]]调用且有prototype属性的任意构造函数能成为父类的候选.例如(构造的实例,bound函数,Proxy能被构建但它们都没有prototype属性,所以它们不能被子类)
* 父类`prototype`属性必须是一个对象或 `null`, 非对象的`prototype`无论如何不会按它应该的运行(会被`new`操作符忽略)
* `extends`设置`ChildClass`的prototype为ParentClass(具体查看 [[202301181331d1|extends中的原型]])
* `extends`右侧不必是一个标识符.你可以用任意可计算成构造函数的表达式(在创建混入时候有用)



#### extends改变的prototype

|                         | Prototype of ChildClass | Prototype of ChildClass.prototype |   
| ----------------------- | ----------------------- | --------------------------------- | 
| `extends` clause absent | Function.prototype      | Object.prototype                  |     
| `extends null`          | Function.prototype      | null                              |     
| `extends ParentClass`   | ParentClass             | ParentClass.prototype             |     

来源
[mdn-extends](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)


##### extends右侧表达式的要求

只要表达式可以被解析为一个函数并且具有[[Construct]]属性和原型，那么就可以用extends进行派生。

```js
function Rectangle(length, width) {
  this.length = length;
  this.width = width;
}

Rectangle.prototype.getArea = function() {
  return this.length * this.width;
};

class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}

let x = new Square(3);
console.log(x.getArea()); //9
console.log(x instanceof Rectangle); //true
```


##### 动态的基类
extends强大的功能使得类可以继承自任意类型的表达式，由于可以动态确定使用哪个基类，因而可以创建不同的继承方法。
例如，可以像这样创建mixin：

```javascript
let SerializableMixin = {
  serialize() {
    return JSON.stringify(this);
  }
};

let AreaMixin = {
  getArea() {
    return this.length * this.width;
  }
};

function mixin(...mixins) {
  let base = function() {};
  Object.assign(base.prototype, ...mixins);
  return base;
}

class Square extends mixin(AreaMixin, SerializableMixin) {
  constructor(length) {
    super();
    this.length = length;
    this.width = width;
  }
}

let x = new Square(3);
console.log(x.getArea()); //9
console.log(x.serialize()); //"{"length": 3, "width": 3}"
```


在extends后可以使用任意表达式，但不是所有表达式最终都能生成合法的类。如果使用null或生成器函数（曾在第8章讲解）会导致错误发生，类在这些情况下没有[[Consturct]]属性，尝试为其创建新的实例会导致程序无法调用[[Construct]]而报错。









### 内建对象的继承

自JavaScript数组诞生以来，开发者一直都希望通过继承的方式创建属于自己的特殊数组。在ECMAScript 5及早期版本中这几乎是不可能的，用传统的继承方式无法实现这样的功能

```javascript
//内建数组行为
let colors = [];
colors[0] = 'red';
console.log(colors.length); //1

colors.length = 0;
console.log(colors[0]); //undefined


//尝试通过ES5语法继承数组
function MyArray() {
  Array.apply(this, arguments);
}

MyArray.prototype = Object.create(Array.prototype, {
  constructor: {
    value: MyArray,
    writable: true,
    configurable: true,
    enumerable: true
  }
});

let colors = new MyArray();
colors[0] = 'red';
console.log(colors.length); //0
```

这段代码最后console.log()的输出结果与预期不符，MyArray实例的length和数值型属性的行为与内建数组中的不一致，这是因为通过传统JavaScript继承形式实现的数组继承没有从Array.apply()或原型赋值中继承相关功能。

<u>ECMAScript 6类语法的一个目标是支持内建对象继承，因而ES6中的类继承模型与ECMAScript 5及早期版本中的稍有不同，主要体现在两个方面:</u>

* 在ECMAScript 5的传统继承方式中，先由派生类型（例如，MyArray）创建this的值，然后调用基类型的构造函数（例如Array.apply()方法）。这也意味着，this的值开始指向的是MyArray的实例，但是随后会被来自Array的其他属性所修饰。
* ECMAScript 6中的类继承则与之相反，先由基类（Array）创建this的值，然后派生类的构造函数（MyArray）再修改这个值。所以一开始可以通过this访问基类的所有内建功能，然后再正确地接收所有与之相关的功能。

以下示例是一个基于类生成特殊数组的实践

```javascript
class MyArray extends Array {
  //空
}

let colors = new MyArray();
colors[0] = 'red';
console.log(colors[0]); //'red'

colors.length = 0;
console.log(colors[0]); //undefined
```

MyArray直接继承自Array，其行为与Array也很相似，操作数值型属性会更新length属性，操作length属性也会更新数值型属性。于是，可以正确地继承Array对象来创建自己的派生数组类型，当然也可以继承其他的内建对象。添加所有的这些功能后，内建对象继承的最后一个特殊情况便被ECMAScript 6及派生类语法有效解决了，只是这个特殊情况仍值得我们探索一番。



### Symbol.species属性 ????

<u>内建对象继承的一个实用之处是，原本在内建对象中返回实例自身的方法将自动返回派生类的实例</u>。所以，如果你有一个继承自Array的派生类MyArray，那么像slice()这样的方法也会返回一个MyArray的实例。

```javascript
class MyArray extends Array {
  //空
}

let items = new MyArray(1,2,3,4),
    subitems = items.slice(1, 3);

console.log(items instanceof MyArray); //true
console.log(subitems instanceof MyArray); //true
```

正常情况下，继承自Array的slice()方法应该返回Array的实例，但是在这段代码中，slice()方法返回的是MyArray的实例。在浏览器引擎背后是通过Symbol.species属性实现这一行为。

Symbol.species是诸多内部Symbol中的一个，它被用于定义返回函数的静态访问器属性。被返回的函数是一个构造函数，每当要在实例的方法中（不是在构造函数中）创建类的实例时必须使用这个构造函数。以下这些内建类型均已定义Symbol.species属性：

* Array
* ArrayBuffer
* Map
* Promise
* RegExp
* Set
* Typed arrays

列表中的每个类型都有一个默认的Symbol.species属性，该属性的返回值为this，这也意味着该属性总会返回构造函数。如果在自定义的类中实现这个功能，则代码看起来可能是这样的：

```javascript
//几个内建类型像这样使用species
class MyClass {
  static get [Symbol.species]() {
    return this;
  }
  
  constructor(value) {
    this.value = value;
  }
  
  clone() {
    return new this.constructor[Symbol.species](this.value);
  }
}
```

在这个示例中，Symbol.species被用来给MyClass赋值静态访问器属性，请注意，这里只有一个getter方法却没有setter方法，这是因为在这里不可以改变类的种类。调用this.constructor[Symbol.species]会返回MyClass，clone()方法通过这个定义可以返回新的实例，从而允许派生类覆盖这个值。举个例子：

```javascript
class MyClass {
  static get [Symbol.species]() {
    return this;
  }
  
  constructor(value) {
    this.value = value;
  }
  
  clone() {
    return new this.constructor[Symbol.species](this.value);
  }
}


class MyDerivedClass1 extends MyClass {
  //空
}

class MyDerivedClass2 extends MyClass {
  static get [Symbol.species]() {
    return MyClass;
  }
}

let instance1 = new MyDerivedClass1('foo'),
    clone1 = instace1.clone(),
    instance2 = new MyDerivedClass2('bar'),
    clone2 = instance2.clone();


console.log(clone1 instanceof MyClass); //true
console.log(clone1 instanceof MyDerivedClass1); //true
console.log(clone2 instanceof MyClass); //true
console.log(clone2 instanceof MyDerivedClass1); //false
```

在这里，MyDerivedClass1继承MyClass时未改变Symbol.species属性，由于this.constructor[Symbol.species]的返回值是MyDerivedClass1，因此调用clone()返回的是MyDerivedClass1的实例；MyDerivedClass2继承MyClass时重写了Symbol.species让其返回MyClass，调用MyDerivedClass2实例的clone()方法时，返回值是一个MyClass的实例。通过Symbol.species可以定义当派生类的方法返回实例时，应该返回的值的类型。

未完成...

#### 来源



### 类的继承案例

#### ES5继承

```javascript
//ES5
function Rectangle(length, width) {
  this.length = length;
  this.width = width;
}

Rectangle.prototype.getArea = function() {
  return this.length * this.width;
}

function Square(length) {
  Rectangle.call(this,length,length);
}


Square.prototype = Object.create(Rectangle.prototype, {
  constructor: {
    value: Square,
    enumerable: true,
    writable: true,
    configurable: true
  }
});

let square = new Square(3);

console.log(square.getArea()); //9
console.log(square instanceof Square); //true
console.log(square instanceof Rectangle); //true


// Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
// Square.prototype.__proto__ === Rectangle.prototype


```


#### ES6继承
使用extends关键字
在子类的constructor构造函数中，需要首先调用super()函数执行父类的构造函数，再执行子类的函数修饰this。
```js
class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
  
  getArea() {
    return this.length * this.width;
  }
}

class Square extends Rectangle {
  constructor(length) {
    //等价于 Rectangle.call(this, length, width)
    super(length, width); //优先调用super()函数执行父类构造函数
  }
}

let square = new Square(3);

console.log(square.getArea()); //9
console.log(square instanceof Sqaure); //true
console.log(square instanceof Rectangle); //true
```

#### 来源
[mdn-extends](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)





### 方法定义
> 方法定义是在对象初始化程序中定义函数属性的简短语法.


#### 语法
```js
({
  property(parameters) {},
  *generator(parameters) {},
  async property(parameters) {},
  async *generator(parameters) {},

  // with computed keys
  [expression](parameters) {},
  *[expression](parameters) {},
  async [expression](parameters) {},
  async *[expression](parameters) {},
})
```


#### description
缩写语法与getter和setter语法类似.
在对象字面量中的方法定义和在类中的方法一致.
方法不能是构造器.如果尝试距离则会抛出[[202301302098a2|TypeError]]错误
只有用函数定义的方法才能使用`super`关键字.  `super.prop`寻找方法已经初始化的对象原型上的属性.

```js
const obj = {
	__proto__: {
		prop: 'foo'
	},
	method: function() {
		console.log(super.prop)
	},
	method1() {
		console.log(super.prop)
	}
}

obj.method(); //SyntaxError: 'super' keyword unexpected here
obj.method1(); //'foo'
```

#### 来源
[mdn Method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)






#### getter
`get`语法绑定一个对象的属性到一个函数,当查找属性时函数将被调用. 也可以用在class中.
getter方法没有参数

#### syntax
```js
{get prop() {/*...*/}}

{ get [expression]() {/*...*/}}
```


#### description
有时候,需要访问一个返回动态计算值得属性,或想在不要求使用显式方法调用来显示(reflect反射,表明)内部变量的状态.
一个属性不能同时有一个getter绑定和实际拥有一个值,虽然可以用一个getter和setter组合来创建一个伪属性(pseudo-property)类型. ??
对getter属性赋值(obj.xxx=xxx)不会改变(但writable[[202301180942#^75c010]]值为true)
使用delete操作符来删除getter属性
在已经声明过的对象上定义getter需要使用[[202301180954a|Object.defineProperty]]
lazyGetters: 
get和Object.defineProperty()用在类上差异不大,效果相同.


### setter

`set`语法绑定一个对象的属性到一个函数上,当尝试设置这个属性时被调用.它也可以用在类中.

#### syntax
一个setter必有1个参数
```js
{ set prop(val) { /* … */ } }
{ set [expression](val) { /* … */ } }
```

#### description
对象属性不可能同时有setter和拥有一个实际的值. (同名属性值后面覆盖前面的)
使用[[delete|delete]]作符删除setter




#### Public class fileds(公有类字段)
静态和实例公有字段是writable,enumerable,configurable属性.
正因为如此,和他们私有对应的字段不同,它们可以参与原型继承.

#### syntax
```js
class ClassWithFiled {
	instanceFiled
	instanceFiledWithInitiaizer = 'instance field'
	static staticField
	static staticFieldWithInitializer = 'static field'
}
```

语法限制:
* 静态属性(字段或方法)名称不能为'prototype'
* 类字段(静态??或实例)名称不能为'constructor'

#### desc
公有类字段可以包括:
* 公有(实例)字段/公有方法
* 公有静态字段
* 公有访问器

公有实例字段存在每个类创建的实例上.通过声明一个公有字段,你可以确保这个字段始终存在,并且类的定义是[self-documenting](https://en.wiktionary.org/wiki/self-documenting#:~:text=self%2Ddocumenting%20(not%20comparable),understood%20without%20consulting%20separate%20documentation.)<sup>[1]</sup>
公有实例字段在基类构造时(在构造函数体运行之前),或仅在子类`super()`返回后,被添加到实例上.(在constructor/super前打印this可以验证,值均为undefined)
没有初始值(without initializers??)的字段会被初始化为`undefined`. 
像属性一样,字段名称也可以被计算.

在字段初始化器??(field initializer)中,`this`在构建中指向类实例,且`super`指向基类的`prototype`属性, 其包含基类的实例方法,但不包含基类的实例字段.
```js
class Base {
  baseField = "base field";
  anotherBaseField = this.baseField;
  baseMethod() {
    return "base method output";
  }
}

class Derived extends Base {
  subField = super.baseMethod();
  subField2 = super.baseField;
}

const base = new Base();
const sub = new Derived();

console.log(base.anotherBaseField); // "base field"

console.log(sub.subField2); //undefined
```

因为类的实例字段在各个构造器执行前添加,你可以在构造器内访问字段的值. 然而,因为派生类的实例字段在`super()`返回后才定义,所以基类的构造器不能访问派生类的字段.
```js
class Base {
  constructor() {
    console.log("Base constructor:", this.field);
  }
}

class Derived extends Base {
  field = 1;
  constructor() {
    super();
    console.log("Derived constructor:", this.field);
    this.field = 2;
  }
}

const instance = new Derived();
// Base constructor: undefined
// Derived constructor: 1
console.log(instance.field); // 2
```

因为类字段使用 \[\[[DefineOwnProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/defineProperty)\]\] 语义添加的(本质是`Object.defineProperty(), 延伸下,其均不可枚举)`, 在派生类中的字段声明不会调用基类中的setter. 这个行为与在构造器中使用`this.filed = ...`不同.
```js
class Base {
  set field(val) {
    console.log(val);
  }
}

class DerivedWithField extends Base {
  field = 1;
}

const instance = new DerivedWithField(); // No log

class DerivedWithConstructor extends Base {
  constructor() {
    super();
    this.field = 1;
  }
}

const instance2 = new DerivedWithConstructor(); // Logs 1
```

注意: 在类字段规范被最终确定DefineOwnProperty语义前,大多数转译器,包括Babel和tsc, 变换类字段为DerivedWithConstructor形式, 这会在类字段标准化后引起小bugs.???

```js

```

#### 来源
[mdn-public instance fileds](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)

[1] Written and structured in such a way that it can be understood without consulting separate documentation.


### static
`static`关键为一个类定义静态方法或静态字段,或静态初始化块.不能直接读取类实例上的静态属性.相反,在类上静态字段可以被读取.

静态方法,经常用于公共方法:创建/克隆对象, 缓存, 固定配置等你不需要赋值到实例上的.

#### syntax
```js
class ClassWithStatic {
  static staticField;
  static staticFieldWithInitializer = value;
  static staticMethod() {
    // …
  }
}
```

语法限制:
* 静态属性(字段或方法)名称不能为prototype.(因为其访问形式是MyClass.xx,和原型访问路径相同)
* 类字段(静态或实例)名称不能为constructor.(和类中constructor方法名称会产生冲突)


#### desc
公共静态属性: 静态方法,静态字段,静态存取器
公共静态属性在使用 \[\[DefineOwnProperty\]\]语义(本质上是[[202301180954a|Object.defineProperty]])进行类计算时,被添加到类构造函数中.
它们会被从类构造函数中再次存取(访问).
公共静态字段不会在子类上再次初始化,但是可以通过原型链访问.
从静态方法中通过this访问另一个静态成员
从构造函数或方法中访问静态成员时,需要使用类名称.(或者this.constructor)



#### 来源
[mdn-public instance fileds](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)




### Private class features
类字段默认是公有的,但私有类成员可以通过使用哈希`#`前缀来创建.

隐私成员在这个语法存在之前不是语言原生的.在原型继承上,它的行为可能模仿WeakMap对象或闭包,但是在人体工程学方面,它们不能与`#`语法比较.

#### syntax
```js
class ClassWithPrivate {
  #privateField;
  #privateFieldWithInitializer = 42;

  #privateMethod() {
    // …
  }

  static #privateStaticField;
  static #privateStaticFieldWithInitializer = 42;

  static #privateStaticMethod() {
    // …
  }
}
```

注意:
* 私有标识符不能是`#constructor`
* 在一个类中声明的所有私有标识符必须不同.唯一例外是当两个声明定义一个getter-setter对.

>These features are collectively called private properties. However, constructors cannot be private in JavaScript. To prevent classes from being constructed outside of the class, you have to use a private flag.(为了组织从外部构建类,必须使用私有符号)??? 很不理解

* 从类的外部引用 `#` 名称是语法错误
* 在类体内引用未声明的私有属性,或使用[[delete]]删除声明的属性,是语法错误.
* 和普通对象不同, 访问对象不存在的私有属性会抛出[[202301302098a2|TypeError]]而非`undefined`
* 使用`in`操作符检查是否存在私有属性(字段/方法)
* 私有属性不是原型继承模式的一部分,所以它们只能在当前类体内被访问且不被子类继承.
* 不同类内部相同名称的私有属性完全不同,并且不会互操作.
* 将它们视作附加到由类管理的每个实例的外部元数据.


请注意,私有名称的必然结果总是预声明和不可删除的? 不理解
> Note a corollary of private names being always pre-declared and non-deletable: if you found that an object possesses one private property of the current class (either from a try...catch or an in check), it must possess all other private properties. An object possessing the private properties of a class generally means it was constructed by that class (although not always).




#### examples
##### 模拟私有构造函数


#### 来源
[mdn-public instance fileds](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)



### 静态属性/静态方法

* 静态属性和静态方法(ES5静态方法[[静态方法]])同样存在于类内部，使用static关键字修饰
* 静态属性和静态方法无法被实例访问，只能通过类自身使用
* 静态方法中的this指向的是类本身，和实例函数中的this是隔离的，所以同一个类中可以存在函数名相同的静态函数和实例函数。
* <u>与函数不同的是，类属性不可被赋予新值</u>  不正确,看下面

```js
// 类实例
class Person2 {
	static name = 'name1'
	static getName = function() { console.log(Person2.name)} //'name1'
	name = 'name2'
	getName() { console.log(this.name)} //'name2'
}
```


分别检查静态属性/静态方法,及实例属性原型上的方法.
类只有length属性和prototype的writable属性为false,不能被更改.
类原型上的constructor和getName方法其writable属性均为true,可被更改
```js
Object.getOwnPropertyDescriptors(Person2)

getName:{writable: true, enumerable: false, configurable: true, value: ƒ}
length:{value: 0, writable: false, enumerable: false, configurable: true}
name:{value: 'name1', writable: true, enumerable: true, configurable: true}
prototype:{value: {…}, writable: false, enumerable: false, configurable: false}
[[Prototype]]:Object


```

```js
Object.getOwnPropertyDescriptors(Person2.prototype)

constructor:{writable: true, enumerable: false, configurable: true, value: ƒ}
getName:{writable: true, enumerable: false, configurable: true, value: ƒ}
[[Prototype]]:Object
```




### 生成器方法

在对象字面量中，可以通过在方法名前附加一个星号（\*）的方式来定义生成器，在类中亦是如此，可以将任何方法定义成生成器。

```javascript
class MyClass {
  *createIterator() {
    yield 1;
    yield 2;
    yield 3;
  }
}

let instance = new MyClass();
let iterator = instance.createIterator();
```

如果用对象来表示集合，又希望通过简单的方法迭代集合中的值，那么生成器方法就派上用场了。数组、Set集合及Map集合为开发者们提供了多个生成器方法来与集合中的元素交互。



尽管生成器方法很实用，但如果你的类是用来表示值的集合的，那么为它定义一个默认迭代器会更有用。通过Symbol.iterator定义生成器方法即可为类定义默认迭代器

```javascript
class Collection {
  constructor() {
    this.items = [];
  }
  
  *[Symbol.iterator]() {
    yield *this.items.values();
  }
}

let collection = new Collection();
collection.items.push(1);
collection.items.push(2);
collection.items.push(3);

for let x of collection) {
  console.log(x);
}

//1
//2
//3
```

这个示例用可计算名称创建了一个代理this.items数组values()迭代器的生成器方法。任何管理一系列值的类都应该引入默认迭代器，因为一些与特定集合有关的操作需要所操作的集合含有一个迭代器。

如果不介意在对象的实例中出现添加的方法和访问器属性，则可以将它们添加到类的原型中；如果你希望它们只出现在类中，那么需要使用静态成员.


### 类方法遮蔽

派生类中的方法总会覆盖基类中的同名方法。举个例子，给Square添加getArea()方法来重新定义这个方法的功能：

```javascript
class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
  
  //覆盖并遮蔽Rectangle.prototype.getArea()方法
  getArea() {
    return this.length * this.length;
  }
}
```

由于为Square定义了getArea()方法，便不能在Square的实例中调用Rectangle.prototype.getArea()方法.

如果你想调用基类中的该方法，则可以调用super.getArea()方法

```javascript
class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
  
  //覆盖并遮蔽Rectangle.prototype.getArea()方法
  getArea() {
    return super.getArea();
  }
}
```


### 在类的构造函数中使用new.target

new.target及它的值根据函数被调用的方式而改变。在类的构造函数中也可以通过new.target来确定类是如何被调用的。在简单情况下，new.target等于类的构造函数

```javascript
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length; 
    this.width = width;
  }
}

//new.target的值是Rectangle
let obj = new Rectangle(3, 4); //输出true
```

这段代码展示了当调用new Rectangle(3, 4)时等价于Rectangle的new.target。类构造函数必须通过new关键字调用，所以总是在类的构造函数中定义new.target属性。但是其值有时会不同，请看这段代码：

```javascript
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length; 
    this.width = width;
  }
}

class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}

//new.target的值是Square
let obj = new Square(3); //输出false
```

Square调用Rectangle的构造函数，所以当调用发生时new.target等于Square。这一点非常重要，因为每个构造函数都可以根据自身被调用的方式改变自己的行为。例如，可以用new.target创建一个抽象基类（不能被直接实例化的类），就像这样：

```javascript
//抽象基类
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('这个类不能被直接实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    this.length = length;
    this.width = width;
  }
}

let x = new Shape(); //抛出错误

let y = new Rentangle(3, 4);
console.log(y instanceof Shape); //true
```

这个示例中，每当new.target是Shape时构造函数总会抛出错误，这相当于调用new Shape()时总会出错。但是，仍可用Shape作为基类派生其他类，示例中的Rectangle便是这样。super()调用执行了Shape的构造函数，new.target与Rectangle等价，所以构造函数继续执行不会抛出错误。

因为类必须通过new关键字才能调用，所以在类的构造函数中，new.target属性永远不会是undefined。



### 静态成员

#### ES5

在ECMAScript 5及早期版本中，直接将方法添加到构造函数中来模拟静态成员是一种常见的模式

```javascript
function PersonType(name) {
  this.name = name;
}

//静态方法
PersonType.create = function(name) {
  return new PersonType(name);
};

//实例方法
PersonType.prototype.sayName = function() {
  console.log(this.name);
}
```

由于工厂方法PersonType.create()使用的数据<u>不依赖PersonType的实例，因而其会被认为是一个静态方法</u>。

#### ES6

ECMAScript 6的类语法简化了创建静态成员的过程，在<u>方法或访问器属性名</u>前使用正式的<span style="color:blue">**静态注释**</span>即可
https://tie.pub/2019/07/private-methods-accessors-in-classes/
**注意事项**

* 类中的所有方法和访问器属性都可以用static关键字来定义，唯一的限制是不能将static用于定义构造函数方法。

* 不可在实例中访问静态成员，必须要直接在类中访问静态成员。

```javascript
class PersonClass {
  
  //等价于PersonType构造函数
  constructor(name) {this.name = name; }
  
  //等价于PersonType.prototype.sayName
  sayName() {console.log(this.name); }
  
  //等价于PersonType.create
  static create(name) {return new PersonClass(name); }
}

let person = PersonClass.create('Nicholas');

//
class PersonClass2 {
  
  constructor(name) {
    this.name = name;
  }
  
  static get getValue() {
    return this.name;
  }
  
}

let personclass2 = new PersonClass2('jack');
console.log(PersonClass2.nameValue); //'jack'
```





## 其它

### 类的初始化顺序
> 来源: <TS全栈开发> 10.7.1

**类的实例化顺序是: **

1.初始化父类属性,赋予默认值
2.执行父类构造函数
3.初始化子类属性,赋予默认值
4.执行子类构造函数

```js

class A {
	name = 'A'
	constructor() {
		console.log('this is ' + this.name)
	}
}

class B extends A {
	name = 'B'
}
```




#### 类与自定义类型对象之间的差异
* 函数声明可以被提升，而类声明与let声明类似，不能被提升；真正执行声明语句之前，它们会一直存在于临时死区([[202301161403|时间死区]])中。
* 类声明中的所有代码将自动运行在严格模式下，而且无法强行让代码脱离严格模式执行.
* 在自定义类型中，需要通过Object.defineProperty()方法手工指定某个方法为不可枚举；<span style="color:blue">而在类中，所有方法都是不可枚举的.</span> 静态方法和原型方法均是.
* 每个类都有一个名为\[\[Construct\]\]**的内部方法，通过关键字new调用那些不含\[\[Construct\]\]的方法会导致程序抛出错误.
* 使用除关键字new以外的方式调用类的构造函数会导致程序抛出错误.
* <span style="color:blue">在类中修改类名会导致程序报错.</span>类的名称只在类中为常量，但可以在外部修改



#### 使用注意事项
* 类声明/类表达式只能与new关键字配合使用
* 类声明/类表达式不存在提升
* this的指向: 类内部的this指向类的实例.如果单独使用类实例方法,this的指向会发生变化,会带来问题

```js
//类的this指向

class MyClass {
	constructor(name) {
		this.name = name
	}
	getName() {
		console.log(this.name)
	}
}

const m = new MyClass()
let {getName} = m
getName() //TypeError: cannot read property 'name' of undefined
// 在ES6的class关键字中使用了严格模式。在严格模式下this不指向全局环境，而是指向undefined
```



## 使用


### 一等公民-类

一等公民-类

<u>在程序中，一等公民是指一个可以传入函数，可以从函数返回，并且可以赋值给变量的值.</u> JavaScript函数,类都是一等公民（函数也被称作头等函数）

#### 将类作为参数传入函数中 

```javascript
function createObject(classDef) {
  return new classDef();
}

let obj = createObject(class {
  sayHi() {
    console.log('Hi');
  }
});

obj.sayHi(); //Hi
```

在这个示例中，调用createObject()函数时传入一个匿名类表达式作为参数，然后通过关键字new实例化这个类并返回实例，将其储存在变量obj中。

#### 通过立即调用类构造函数可以创建单例 ????

用new调用类表达式，紧接着通过一对小括号调用这个表达式

```javascript
let person = new class {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}('Nicholas');

person.sayName(); //Nicholas
```

这里先创建一个匿名类表达式，然后立即执行。<u>依照这种模式可以使用类语法创建单例，并且不会在作用域中暴露类的引用</u>，其后的小括号表明正在调用一个函数，而且可以传参数给这个函数。





### [重构-以多态取代条件表达式](https://www.cnblogs.com/starof/p/14515461.html)

> 非常清晰顺畅的一篇文章 好评!
> 不过在<做法>中的几条,有的名词不理解.
> 并且其最终的代码中存在书写错误,落了getter函数调用的括号; 变量名称bird/b

复杂的条件逻辑是编程中最难理解的东西之一，给条件逻辑添加**结构**。

可以将条件逻辑拆分到不同的场景（或者叫高阶用例），从而拆分条件逻辑。使用类和多态能把逻辑的拆分表述得更清楚，多态是改善复杂条件逻辑的有力工具。

有两种常见场景，
* 一种是，好几个函数都有基于类型的switch语句，每个类型处理各自的条件逻辑。把switch中每个分支逻辑创建一个类，用多态来承载各个类型特有的行为。 
* 另一种是：有一个基础逻辑，在其上又有一些变体。基础逻辑放进基类，基础逻辑可能是最常用的，也可能是最简单的。变体放进子类，强调与基类基础逻辑的差异。

#### 原代码
例子，朋友有一群鸟，他想知道鸟飞得多快，以及鸟的羽毛是什么样的。
```js
//朋友有一群鸟，他想知道鸟飞得有多快，以及它们的羽毛是什么样的。

//飞的多快
function speeds(birds) {
    return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
}
//羽毛
function plumages(birds) {
    return new Map(birds.map(b => [b.name, plumage(b)]))
}


function plumage(bird){
    switch(bird.type){
        case 'EuropeanSwallow':
            return "average";
        case 'AfricanSwallow':
            return (bird.numberOfCoconuts>2)?"tired":"average";
        case 'NorwegianBlueParrot':
            return (bird.voltage>100)?'scorched':'beautiful';
        default:
            return 'unknow';
    }
}

function airSpeedVelocity(bird){
    switch(bird.type){
        case 'EuropeanSwallow':
            return 35;
        case 'AfricanSwallow':
            return 40-2*bird.numberOfCoconuts;
        case 'NorwegianBlueParrot':
            return (bird.isNailed)?0:10+bird.voltage/10;
        default:
            return null;
    }
}
```

#### 做法
1.如果现有的类不具备多态行为,就用工厂函数创建之,令工厂函数返回恰当的对象实例
2.在**调用方**代码中使用**工厂函数**获得对象实例。
3.将带有条件逻辑的函数移到超类中。如果条件逻辑还未提炼至独立的函数，首先对其使用提炼函数。
4.任选一个子类，在其中建立一个函数，使之覆写超类中容纳条件表达式的那个函数。将与该子类相关的条件表达式分支复制到新函数中，并对它进行适当调整。
5，重复上述过程，处理其他条件分支。
6，在超类中保留默认情况的逻辑。或者，如果超类应该是抽象的，就把该函数声明为abstract，或在其中直接抛出异常，表明计算责任都在子类中。

#### 实例
对airSpeedVelocity和plumage两个函数使用函数组合成类，这个类会作为基类。
```js
//飞的多快
function speeds(birds) {
    return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
}
//羽毛
function plumages(birds) {
    return new Map(birds.map(b => [b.name, plumage(b)]))
}

function plumage(bird) {
    return new Bird(bird).plumage;
}

function airSpeedVeliocity(bird) {
    return new Bird(bird).airSpeedVeliocity;
}

class Bird {
    constructor(birdObject) {
        Object.assign(this, birdObject);
    }

    get plumage() {
        switch (this.type) {
            case 'EuropeanSwallow':
                return "average";
            case 'AfricanSwallow':
                return (this.numberOfCoconuts > 2) ? "tired" : "average";
            case 'NorwegianBlueParrot':
                return (this.voltage > 100) ? 'scorched' : 'beautiful';
            default:
                return 'unknow';
        }
    }

    get airSpeedVelocity() {
        switch (this.type) {
            case 'EuropeanSwallow':
                return 35;
            case 'AfricanSwallow':
                return 40 - 2 * this.numberOfCoconuts;
            case 'NorwegianBlueParrot':
                return (this.isNailed) ? 0 : 10 + this.voltage / 10;
            default:
                return null;
        }
    }
}
```

针对每种鸟创建一个子类，用一个工厂函数来实例化合适的子类对象。
```js
class EuropeanSwallow {
}
class AfricanSwallow {
}
class NorwegianBlueParrot {

}

function createBird(bird) {
    switch (bird.type) {
        case 'EuropeanSwallow':
            return new EuropeanSwallow(bird);
        case 'AfricanSwallow':
            return new AfricanSwallow(bird);
        case 'NorwegianBlueParrot':
            return new NorwegianBlueParrot(bird);
        default:
            return new Bird(bird);
    }
}
```

有了需要的类结构，现在处理两个条件逻辑。

先从plumage函数开始，从switch语句中选一个分支，在适当的子类中覆写这个逻辑。
```js
class EuropeanSwallow {
    get plumage(){
        return "average";
    }
}

超类Bird中EuropeanSwallow逻辑分支改为抛出异常。
get plumage() {
        switch (this.type) {
            case 'EuropeanSwallow':
               throw "oops";
            case 'AfricanSwallow':
                return (this.numberOfCoconuts > 2) ? "tired" : "average";
            case 'NorwegianBlueParrot':
                return (this.voltage > 100) ? 'scorched' : 'beautiful';
            default:
                return 'unknow';
        }
    }
```

接着处理下一个分支,最后超类Bird的变化
```js
//之前的超类
get plumage() {
        switch (this.type) {
            case 'EuropeanSwallow':
                throw 'oops';
            case 'AfricanSwallow':
                throw 'oops';
            case 'NorwegianBlueParrot':
                throw 'oops';
            default:
                return 'unknow';
        }
    }

//之后的超类
get plumage() {
	return 'unknow'
}
```

airSpeedVelocity也如法炮制，

然后对顶层的airSpeedVelocity和plumage做了内联处理,
从
```js
function plumages(birds) {
    return new Map(birds.map(b => [b.name, plumage(b)]))
}

function plumage(bird) {
    return new Bird(bird).plumage;
}
```
变为
```js
function plumages(birds) {
	return new Map(birds
		.map(b => createBird(b)) 
		.map(bird => [bird.name, bird.airSpeedVelocity])
	)
}
```

最终完成的代码
```js
function speeds(birds) {
  return new Map(birds
    .map(b => createBird(b))
    .map(b => [b.name, b.airSpeedVelocity()]))
}

function plumages(birds) {
  return new Map(birds
    .map(b => createBird(b))
    .map(b => [b.name, b.plumage()])
  )
}

function createBird(bird) {
	switch (bird.type) {
		case "EuropeanSwallow":
			return new EuropeanSwallow(bird);
		case "AfricanSwallow":
			return new AfricanSwallow(bird);
		case "NorwegianBlueParrot":
			return new NorwegianBlueParrot(bird);
		default:
			return new Bird(bird);
	}
}

class Bird {
	constructor(bird) {
		return Object.assign(this, bird);
	}

	get plumage() {
		return "unknow";
	}
	get airSpeedVelocity() {
		return null;
	}
}

class EuropeanSwallow extends Bird {
	// constructor(this) {

	// }
	get plumage() {
		return "average";
	}
	get airSpeedVelocity() {
		return 35;
	}
}

class AfricanSwallow extends Bird {
	get plumage() {
		return this.numberOfCocounts > 2 ? "tired" : "average";
	}

	get airSpeedVelocity() {
		return 40 - 2 * this.numberOfCocounts;
	}
}

class NorwegianBlueParrot extends Bird {
	get plumage() {
		return this.voltage > 100 ? "scorched" : "beautiful";
	}
	get airSpeedVelocity() {
		return this.isNailed ? 0 : 10 + bird.voltage / 10;
	}
}
```