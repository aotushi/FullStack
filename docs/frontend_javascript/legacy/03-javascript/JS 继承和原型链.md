---
alias: 继承
---



## 继承

#### 来源
> https://github.com/mqyqingfeng/Blog/issues/16


#### 介绍

> JavaScript各种继承方式和优缺点

#### list

* 原型链继承
* 借用构造函数(经典继承)
* 组合继承
* 原型式继承
* 寄生式继承
* 寄生组合式继承



### 原型链继承

#### 是什么

> 子类原型 = 父类实例  Child.prototype = new Parent()

**每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。**通俗点说就是，实例通过内部指针可以访问到原型对象，原型对象通过constructor指针，又可以找到构造函数

#### 缺点
1.**引用类型的属性被所有实例共享**
2.**子类不能向父类中传参**
* 在子类的构造函数中并没有设置与父类的关联，从而导致无法向父类的构造函数传递参数。
* 无法实现多继承
  * 由于子类构造函数的prototype属性只能设置为一个值，如果同时设置为多个值的话，后面的值会覆盖前面的值，导致Cat只能继承一个父类
* 为子类增加原型对象上的属性和函数时，必须放在实例化父类前

```js
function Parent() {
  this.name = 'kevin';
}

Parent.prototype.getName = function() {
  console.log(this.name);
}

Parent.prototype.stringVal = 'parentA';

function Child() {}

Child.prototype = new Parent();

let child1 = new Parent();

console.log(child1.getName()); //'kevin'
```



```javascript
//引用类型的属性被所有实例共享

function Parent() {
  this.names = ['kevin', 'daisy'];
  this.year = 1010
}

function Child() {}

Child.prototype = new Parent();

let child1 = new Child();
child1.names.push('yayu');
child1.year = 'abab';
console.log(child1.names); //['kevin', 'daisy', 'yayu']

let child2 = new Child();
console.log(child2.names); //['kevin', 'daisy', 'yayu']
console.log(child2.year); //1010
```





### 借助构造函数(经典继承)
#### 是什么

> 在子类构造函数中,通过call()/apply()调用父类构造函数


在解决原型对象中包含引用类型值所带来问题的过程中，开发人员开始使用一种叫做**借用构造函数**的技术。实现原理是，在子类的构造函数中，通过 apply ( ) 或 call ( )的形式，调用父类构造函数，以实现继承。

核心: 使用父类的构造函数增强子类实例, 等于是复制父类的实例给子类(没用到原型)

#### 优缺点
**优点:**
* 避免原型链继承中引用类型的属性被所有实例共享
* 可以在子类中向父类传参
**缺点:**
* 方法都在构造函数中定义,每次创建实例都会重新创建一遍方法,
* 只能继承父类的实例属性和方法,不能继承原型的属性/方法

```js
//方式1

function Parent(name, age) {
	this.name = name
	this.age = age
	this.sayHello = function(){
        alert('hello, 大家好,我是'+this.name);
    }
}

function Child(name, age) {
	Parent.call(this, name, age)
}

let c1 = new Child('孙悟空', 18)
let c2 = new Child('猪八戒', 18)
```

以上代码存在的问题是,  实例的方法在父类构造函数中声明的,**每次实例化都会重复创建一次, 浪费空间**.
解决方法是, 创建一个全局的方法:
```js
function gobalSayHello() {
	alert('hello, 大家好,我是'+this.name);
}
function Parent(name, age) {
	this.name = name
	this.age = age
	this.sayHello = globalSayHello
}

function Child(name, age) {
	Parent.call(this, name, age)
}

let c1 = new Child('孙悟空', 18)
let c2 = new Child('猪八戒', 18)
```

这种方式虽然说解决了每次实例化都会重复创建一次, 但也会产生新的问题: 
* 每次实例化都会重新赋值一次
* 函数在全局中声明会影响命名空间

最好的方式,  函数只创建一次,值只赋值一次


### 组合继承

#### 是什么

> https://slbyml.github.io/javascript/extend.html#%E7%BB%84%E5%90%88%E5%BC%8F%E7%BB%A7%E6%89%BF

> 组合继承（有时候也叫伪经典继承）综合了原型链和盗用构造函数，将两者的优点集中了起来。基本的思路是使用原型链继承原型上的属性和方法，而通过盗用构造函数继承实例属性。
>
> 这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性

#### 优缺点
**优点**
* 融合原型链继承和构造函数的优点
**缺点**
* 父类的构造函数执行了两次: 一次在子类的构造函数中call方法执行了一遍; 一次在在子类原型实例化父类的时候执行一遍

#### 实现方式
##### 方式一:
 1. 借用父类的构造函数: `Parent.call(this,name,age)`
 2. 子类原型等于父类的实例 `Child.prototype = new Parent()`
 3. 子类原型构造器重新指定为子类型 `Child.prototype.constructor = Child`
##### 方式二:
1. 子类继承父类: `class Child extends Parent`;
2. 子类构造器中调用父类的构造: `super(name,age)`

**构造函数**的实现
```js
// 方式一

function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function() {
  return this.name
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

Child.prototype = new Parent();

let child1 = new Child('kevin', '18');
child1.colors.push('black');
console.log(child1.name); //'kevin'
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

let child2 = new Child('daisy', '20');
console.log(child2.name); //'daisy'
console.log(child2.age); //20
console.log(child2.colors); //["red", "blue", "green"]
```

**类**的实现
```js

//方式2

class Parent {
	constructor(name) {
		this.name = name
		this.colors = ['red', 'blue', 'green']
	}

	getName() {
		return this.name
	}
}


class Child extends Parent {
	constructor(name, age) {
		super(name)
		this.age = age
	}
}

const child1 = new Child('Alice', 10)
child1.colors.push('black')

const child2 = new Child('Bob', 12)

console.log(child1.getName()) // 'Alice'
console.log(child2.colors) // ['red', 'blue', 'green']
console.log(child1 instanceof Parent) //true
```



#### 类的实现方法的优点
* `extends`关键字会自动建立**原型链继承**(等价于`Child.prototype=Object.create(Parent.prototype))`
* `super()`实现了**构造函数继承**(等价于`Parent.call(this, ...args))`
* 没有组合继承的原型属性冗余问题(比传统组合继承更高效)
* 方法自动挂载在原型上, 语法更直观



### 原型式继承
#### 是什么
Douglas Crockford的原型式继承. 通过object()函数创建一个临时构造函数，将传入的对象赋值给这个构造函数的原型，然后返回构造函数的实例。本质上，object()是对传入的对象执行了一次浅复制.

这种原型式继承适用的情况: 你有一种对象,想在它的基础上再创建一个新对象.**就是就是 ES5 Object.create 的模拟简化实现.**

```javascript
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

#### 缺点
* 跟原型链继承一样., 引用类型属性共享
* 无法传递参数

```javascript
let person = {
  name: 'kevin',
  friends: ['daisy', 'kelly']
};

let person1 = object(person);
let person2 = object(person);

person1.name = 'person1';
console.log(person2.name); //'kevin'

person1.friends.push('taylor');
console.log(person2.frineds); //["daisy", "kelly", "taylor"]
```



### 寄生式继承
#### 是什么
> 创建一个仅用于封装继承过程的函数,该函数在内部以某种形式来增强对象(例如添加方法),最后返回对象

```javascript
function createObj(o) {
  let clone = object.create(o);
  clone.sayName = function() {
    console.log('hi');
  }
  return clone;
}
```

缺点: 

跟借用构造函数模式一样,每次创建对象都会创建一遍方法



### 寄生组合式继承
#### 背景
* 组合式继承的最大缺点是会调用两次父构造函数. 
	* 一次是设置子类型实例的原型时: `Child.prototype = new Parent()`
	* 一次是创建子类实例时. `let child1 = new Child('kevin' 18)`

#### 是什么
> 不使用 `Child.prototype = new Parent()` ，而是间接的让 `Child.prototype` 访问到 `Parent.prototype`

```javascript
function Parent(name) {
  this.name = name;
  this.corlors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function() {
  console.log(this.name);
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

//关键步骤
function F() {}
F.prototype = Parent.prototype;
Child.prototype = new F();

let child1 = new Child('kevi', '18');
```

封装下这个方法

```javascript
function object(o) {
  function F() {};
  F.prototype = o;
  return new F();
}

function prototype(child, parent) {
  let prototype = object(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}

//使用时
prototype(Child, Parent)
```

#### 特点
* 寄生组合式继承是引用类型最理想的继承范式
* 只调用了一次 Parent 构造函数, 
* 原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf



## 原型链

#### 定义

> 由相互关联的原型组成的链状结构就是原型链
>
> 在JS中,实例对象与原型之间的链接,叫做原型链. 其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法.然后层层递进,就构成了实例与原型的链条,这就是原型链的基本概念.

#### 原型链终点

Object.prototype的原型为null

```javascript
console.log(Object.prototype.__proto__ === null); //true
```

null代表什么？

> null 表示“没有对象”，即该处不应该有值。

所以 Object.prototype.\_\_proto\_\_ 的值为 null 跟 Object.prototype 没有原型，其实表达了一个意思

![原型链](https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype5.png)

图中<u>由相互关联的原型组成的链状结构就是原型链</u>，也就是蓝色的这条线。

#### 原型链概述

- 当我们要获取一个对象的属性时,浏览器会先在对象自身中寻找
- 如果有则直接使用,如果没有则去对象的原型中寻找
- 找到了则使用,没有则去原型的原型里去寻找.以此类推, 直到找到Object的原型,如果依然没有找到则返回undefined
- Object的原型是所有对象的原型,它的原型没有原型

#### 使用

- 可以将对象中公有的属性(方法)统一存储在原型对象中. 这样只需要设置一次,即可让所有的实例都具有该属性(方法)
- 以后在创建构造函数时,
  对象中独有的属性, 在构造函数内通过this.xxx的形式来设置
  对象中公有的属性, 在构造函数外,通过原型来设置,xxx.prototype.xxx

**其它方式**
> 对象,函数,数组,字符串,数字,正则和布尔值都可以通过Object.prototype添加方法的方式来扩展方法.
> 简单方式就是通过给Function.prototype增加方法来使得该方法对所有函数可用:

```js
Function.prototype.method = function(name, func) {
	this.prototype(name) = func;
	return this;
}

// 注意: 基本类型的原型是公有结构,保险做法是只有确定没有该方法时才添加它
Function.prototype.method = function(name, func) {
	if (!this.prototype[name]) {
		this.prototype(name) = func;
	}
	return this;
}
```

使用:
1.JS添加取整方法
```js
Number.method('integer', function() {
	return Math[this < 0 ? 'ceil' : 'floor'](this);
})
```

2.JS添加移除字符串首尾空白的方法
```js
String.method('trim', function() {
	return this.replace(/^\s+|\s+$/g, '');
})
```



### 补充

#### constructor

```javascript
//例子
function Person() {}

let person = new Person;
console.log(person.constructor === Person); //true
```

当获取 person.constructor 时，其实 person 中并没有 constructor 属性,当不能读取到constructor 属性时，会从 person 的原型也就是 Person.prototype 中读取，正好原型中有该属性

```javascript
person.constructor === Person.prototype.constructor; //true
```



#### \_\_proto\_\_ !!!

绝大部分浏览器都支持这个非标准的方法访问原型，然而<u>它并不存在于 Person.prototype 中，实际上，它是来自于 Object.prototype</u> ，与其说是一个属性，不如说是一个 getter/setter，当使用 obj.\_\_proto\_\_ 时，可以理解成返回了 Object.getPrototypeOf(obj)





#### 真的是继承吗？

> 最后是关于继承，前面我们讲到“每一个对象都会从原型‘继承’属性”，实际上，继承是一个十分具有迷惑性的说法，引用《你不知道的JavaScript》中的话，就是：
>
> 继承意味着复制操作，然而 JavaScript 默认并不会复制对象的属性，相反，JavaScript 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，<span style="color: red">委托</span>的说法反而更准确些。

\_\_proto\_\_特性

* 只能在对象字面量中指定一次\_\_proto\_\_, 如果指定两个则会抛出错误.这是唯一具有该限制的对象字面量属性
* 可计算形式["__proto__"]的行为类似于普通属性，不会设置或返回当前对象的原型。与对象字面量属性相关的所有规则均适用于此形式，应用不可计算的形式则会抛出异常。

ECMAScript 6引擎中，Object.prototype.\_\_proto\_\_被定义为一个访问器属性，其get方法会调用Object.getPrototypeOf()方法，其set方法会调用Object.setPrototypeOf()方法。因此，使用\_\_proto\_\_和使用Object.getPrototypeOf()方法或Object.setPrototypeOf()方法的区别在于，**\_\_proto\_\_可以直接设置对象字面量的原型**。

```javascript
let person = {
  getGreeting() {
    return 'Hello';
  }
};

let dog = {
  getGreeting() {
    return 'Woof';
  }
};

//原型是person
let friend = {
  __proto__: person
};

console.log(friend.getGreeting()); //'Hello'
console.log(Object.getPrototypeOf(friend) === person); //true
console.log(friend.__proto__ === person); //true

//将原型设置为dog
friend.__proto__ = dog;
console.log(friend.getGreeting()); //'Woof'
console.log(friend.__proto__ === dog); //true
console.log(Object.getPrototypeOf(friend) === dog); //true
```

此示例没有通过调用Object.create()方法来创建friend对象，而是创建一个标准对象字面量，并将一个值赋给\_\_proto\_\_属性。<u>换句话说，当使用Object.create()方法创建对象时，必须为所有其他对象属性指定完整的属性描述符。 ????</u>



### 原型链漏洞

> https://mp.weixin.qq.com/s/lDwSyQF-7LvbrqMTLq_raw



### 来源

> [JavaScript深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2#)



### 原型链图

![chian prototype](https://programmer.help/images/blog/d59acf5d5aca9dad1461354443dd7c17.jpg)





### 构造函数创建对象

```javascript
function Person() {
  
}

let person = new Person();
person.name = 'Kevin';
console.log(person.name); //Kevin
```

在这个例子中，Person 就是一个构造函数，我们使用 new 创建了一个实例对象 person。

### 原型

#### 定义

可以这样理解：每一个JavaScript对象(null除外)在创建的时候就会<u>与之关联另一个对象</u>，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

#### 构造函数与原型关系

* 每个函数都有一个 prototype 属性，它指向了一个对象，这个对象正是调用该构造函数而创建的**实例**的原型对象
 * 如果函数作为普通函数调用,则原型对象没有用;
 * 如果函数作为构造函数调用, 那么它所创建的对象都会由一个隐含的属性(__proto__)也指向该原型对象
 * 原型对象就相当于是一个公共区域,可以被类及该类的所有实例访问 //类-构造函数 实例-函数创建的对象



#### 实例与原型的关系

这是每一个JavaScript对象(除了 null )都具有的一个属性，叫\_\_proto\_\_，这个属性会指向该对象的原型.

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层(Object.prototype)为止。

```javascript
//可以在火狐或者谷歌中输入
function Person() {}

let person = new Person;
console.log(person.__proto__ == Person.prototype); //true
```

#### 原型与构造函数的关系

原型是否有属性指向构造函数或实例呢？

指向实例倒是没有，因为一个构造函数可以生成多个实例，但是原型指向构造函数倒是有的，每个原型都有一个 constructor 属性指向关联的构造函数。

```javascript
function Person() {}

console.log(Person.prototype.constructor === Person); //true
```

