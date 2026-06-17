---
alias: 函数
---


# 概要

在 JavaScript中，函数实际上是对象。每个函数都是Function类型的实例，而Function 也有属性和方法，跟其他引用类型一样。因为函数是对象，所以函数名就是指向函数对象的**[指针](https://www.zhihu.com/question/265576824)**，而且不一定与函数本身紧密绑定。

> 指针
>
> JavaScript中没有指针，引用的工作机制也不尽相同。在JavaScript中变量不可能成为指向另一个变量的引用。
> JavaScript引用指向的是值。如果一个值有10个引用，这些引用指向的都是同一个值，*他们相互之间没有引用/指向关系*。
> ———《你不知道的JavaScript 中卷》2.5 值和引用，第1版28页。

# 函数定义的方式及比较

函数创建有 3 种方式: 函数声明,函数表达式(箭头函数), Function声明.

## 1. 方式

### 1.1 函数声明

在关键字'function'之后,必须指定函数的名称. 在函数体中,函数必须将一个值返回给调用方.遇到return语句后,该函数会立即停止执行. 函数定义最后没有加分号.

参数传递的两种情况:

- 原始数据作为值传递给函数,如果函数改变了这个参数,不会影响到全局或调用函数.
- 引用数据作为值传递给函数,如果函数改变了这个对象的属性,这种改变对函数外部是可见的.

```js
function fn(n){
  return n;
}

let obj = {};
function fn(obj){
  obj.newpro = 'typora'
}
fn(obj)
console.log(obj.newpro, obj['newpro'])
```



### 1.2 函数表达式

如果 function 是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式。

使用这种语法定义的函数可以是**具名函数表达式或匿名函数表达式**. 具名函数表达式又叫行内函数表达式.

两种形式:

```javascript
//匿名函数(anonymous function)
let fn = function() {};
//命名函数
let fn = function functionName() {};
```



函数表达式提供函数名后,可以用于在<u>函数内部</u>代指其本身.(函数声明也可以)

```js
//一般使用const而非let来声明函数表达式的变量

const fn = function fun(n){
  return n<2?1:n*fn(n-1)
};
console.log(fn(3))

//函数表达式提供了函数名
const factorial = function fac(n){return n<2?1:n*fac(n-1)};
console.log(factorial(3))

//函数表达式中的函数名只能在函数体内使用,在函数提外使用函数名会报错.
let y =function x(){console.log(x)};
console.log(x); 
//ƒ x(){console.log(x)}
//Uncaught ReferenceError: x is not defined
```



在判断语句中的定义(函数声明和函数表达式)!!

```javascript
//不要这么做
if (condition) {
  function sayHi() { console.log('Hi!');}
} else {
  function sayHi() { console.log('Hi!');}
}
//这段代码看起来很正常,事实上，这种写法在ECAMScript 中不是有效的语法。JavaScript 引擎会尝试将其纠正为适当的声明。问题在于浏览器纠正这个问题的方式并不一致。
//多数浏览器会忽略condition 直接返回第二个声明。Firefox 会在condition 为true 时返回第一个声明。这种写法很危险，不要使用。

//不过把上面的函数声明换成函数表达式就没问题了:
let sayHi;
if (condition) {
	sayHi = function() {
		console.log("Hi!");
	};
} else {
	sayHi = function() {
		console.log("Yo!");
	};
}
```





### 1.3 箭头函数(arrow function)

```javascript
let sum = (num1, num2) => {return num1 + num2};
```

### 1.4 Function构造函数

使用Function 构造函数. 这个构造函数接收任意多个字符串参数，最后一个参数始终会被当成函数体，而之前的参数都是新函数的参数

```js
let sum = new Function('num1', 'num2', 'return num1 + num2'); //不推荐
```

我们不推荐使用这种语法来定义函数，<span style="color:red;">**因为这段代码会被解释两次**</span>(???)：第一次是将它当作常规ECMAScript 代码，第二次是解释传给构造函数的字符串。这显然会影响性能。不过，把函数想象为对象，把函数名想象为指针是很重要的。而上面这种语法很好地诠释了这些概念。

ECMAScript 6增强了Function构造函数的功能，支持在创建函数时定义默认参数和不定参数. 对于Function构造函数，新增的默认参数和不定参数这两个特性使其具备了与声明式创建函数相同的能力。

```javascript
let add = new Function('first', 'second = first', 'return first + second');
let add = new Function('...args', 'return args[0]');
```



# 构造函数(constructor)|类|实例

### 概念

```javascript
- 构造函数就是专门创建 对象 的函数
- 构造函数的定义方式和普通函数的没有区别,调用方式有区别
- 唯一的不同点,构造函数的需要**首字母大写**   //大驼峰命名法 非强制,也可以小写,只要有new

- 一个函数如果直接调用,那么它就是一个普通函数
- 一个函数如果使用new来调用,那么它就是一个构造函数  // new 函数名称()

```



### new操作符调用构造函数时具体做了什么

#### new的具体流程
> 1.在内存中新建一个对象
>
> 2.将新对象内部的[[prototype]]的指针赋值为构造函数的prototype属性
>
> 3.更新构造函数内的this(Constructor.apply(obj))为这个对象, 并执行构造函数内部的代码,
>
> 4.返回值: 如果构造函数返回非空对象,则返回该对象; 否则,返回刚创建的新对象.

```js
var obj = {};
obj.__proto__ = Foo.prototype;
Foo.call(obj)
```


#### 为什么要新建一个对象
为什么要新建一个对象来当作函数的this指向,而不直接使用构造函数的原型?








#### 实现new操作符

```javascript
//https://juejin.cn/post/6844903986479251464#heading-39
//https://juejin.cn/post/7033275515880341512#heading-35

function newOperator(ctor, ...args) {
  if (typeof ctor !== 'function') {
    throw new Error('newOperator function the first param must be a function');
  }
  let obj = Object.create(ctor.prototype);
  let res = ctor.apply(obj, args);
  // let res = ctor.call(obj, [].slice.call(arguments, 1));
  
  let isObject = typeof res === 'object' && res !== null;
  let isFunction = typeof res === 'function';  //????  是不是引用类型
  
  return isObject || isFunction ? res : obj;
}

function createObject(ctor) {
  let obj = Object.create(null);
  Object.setPropertyOf(obj, ctor.prototype);// 上面的两步可以合并为一步: obj = Object.create(ctor.prototype)
  
  const res = ctor.apply(obj, [].slice.call(arguments, 1));
  
  return typeof(res) === 'object' ? ret : obj;
}

//其它形式
Function.method('new', function() {
	let that = Object.create(this.prototype);
	let res = this.apply(that, arguments);
	return (typeof res === 'object' && res) || that;
})

Function.prototype.method = function(name, fn) {
	this.prototype[name] = fn;
	return this;
}
```



```javascript
//https://github.com/mqyqingfeng/Blog/issues/13

function newOperator() {
  let obj = {};
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype; 
  //let obj = Object.create(Constructor.prototype);
  let result = Constructor.apply(obj, arguments);
  return typeof result === 'object' ? result : obj;
}
```



#### 构造函数显示return的情况

```js
1.return一个对象(返回复杂数据类型),那么this就指向这个返回的对象;
2.return返回的不是一个对象(返回基本类型),this仍然指向实例.
```




### 类与实例

```JavaScript
# 其他
- 一个构造函数也称为是一个类,通过该构造函数所创建的对象称为该类实例
- 通过同一个构造函数所创建的对象称为 一类对象

let per = new Person(); //一个Person类,  per是Person类的实例    
let per2 = new Person(); //per和per2是同一类对象
```



### instanceof

```JavaScript
# 计算机判断某个对象是否是某个类的实例

- instanceof 检查某个对象是否是某个类的实例(实例化对象)    
* 语法:
	对象 instanceof 类
	per instanceof Person  //true  不加括号
```



### 普通与构造函数返回值

```JavaScript
普通函数返回值
function Person(){} //注意函数内部没有return
let per = Person();
console.log(per); // undefined

构造函数返回值
function Person(){}  //注意函数内部没有return
let per = new Person();
console.log(per); // Person {} 

构造函数将新的对象设置为函数中的this,就是Person{} 就是per
故:
function Person(){
    console.log(this);
}
let per = new Person(); //返回值就是Person {} 


```






### 构造函数返回值-更新

```HTML
0.构造函数可以有返回值也可以没有
1.没有返回值,则返回实例化对象.
2.若有返回值则检查其返回值是否为引用类型. 如果是非引用类型(string, number, boolean, null, undefined),则与无返回值相同,实际上返回的是实例化对象.
 2.1 例如: function f(){return true;} new f()//new f
3.若返回值是引用类型,则实际返回值是这个引用类型.
 3.1 例如: function f(){return {a:1}}; new f()//new f
```



### 构造函数括号加不加

```HTML
https://blog.csdn.net/yihanzhi/article/details/80050716

用new创造的构造函数之后的括号用不用加?

1.加不加效果相同
 function Parent(){this.num = 1;}
 console.log(new Parent()); //{num:1}
 console.log(new Parent); //{num:1}

2.加不加效果不同
 function Parent(){this.num = 1;}
 console.log(new Parent().num);//1
 console.log(new Parent.num); //报错

结果分析: new Parent.num的执行优先级是: 先执行Parent.num,此时返回结果为undefined;后执行new, 因为new后面必须跟构造函数,所以new undefined会报错.

new Parent().num的执行顺序是: new Parent(),括号的优先级大于点号,所以相当于(new Parent()).num,所以结果为1.

new的构造函数后跟括号优先级会提升.
```



### 构造函数执行流程

```JavaScript
# 构造函数的执行流程

1.构造函数执行首先会创建一个新的对象
2.将新的对象设置为函数中的this, 可以通过this在构造函数内部访问到新建的对象
3.执行函数中的代码
4.将新的对象作为返回值返回 //通过上面的返回值可以确认




- 向新建的对象里添加属性
function Person(){}
let per = new Person();

per.name = '孙悟空';
per.age = '18';

如果按照上面这种添加方式,那么构造函数的设置是没有意义的.只能在构造函数里面添加才有意义,所以在构造函数中怎么访问这个对象呢? 通过this.

function Person(){
    this.name = '孙悟空';
    this. age = '18';
}
let per = new Person();

- 函数更新,使用参数传递变量
function Person(name, age){
    this.name = name;
    this.age = age;
}

let per = new Person(name, age);
```



### **案例**

```javascript
function Person(name, age){   //声明构造函数Person
    this.name = name;		  //为新对象添加属性和属性值 
    this.age = age;
    console.log(this); //这个打印的对象本身 从程序运行上来看打印了2次,分别是{name:'孙悟空', age:18}和猪八戒
}

let per = new Person('孙悟空', 18);
let per2 = new Person('猪八戒', 28);

console.log(per);
console.log(per2);

console.log(per.name);         //孙悟空
console.log(per.name = '朝天阙'); //朝天阙



====================instanceof==========================
* 用来检查某个对象是否是某个类的实例.返回的是布尔值
* 语法
	对象 instanceof 类
	
	per instanceof Person   per是新建的对象

```




## 2. 比较(函数声明和函数表达式)

> 如果 function 是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式。

* JS引擎对函数声明和函数表达式生成函数定义时机不同: 代码执行前(函数声明提升);代码执行到
* 因为执行时机不同,函数声明可提前调用;函数表达式则不能.
* 除了函数什么时候定义之外,这两种语法等价

JavaScript 引擎在加载数据时对它们是区别对待的。JavaScript 引擎在任何代码执行之前，会先读取函数声明，并在执行上下文中生成函数定义。而函数表达式必须等到代码执行到它那一行，才会在执行上下文中生成函数定义。

```javascript
//正常运行
console.log(sum(10, 10));
function sum(num1, num2) { return num1 + num2;}
```

以上代码可以正常运行，因为函数声明会在任何代码执行之前先被读取并添加到执行上下文。这个过程叫作**函数声明提升（function declaration hoisting).**在执行代码时，JavaScript 引擎会先执行一遍扫描，把发现的函数声明提升到源代码树的顶部。因此即使函数定义出现在调用它们的代码之后，引擎也会把函数声明提升到顶部。

如果把前面代码中的函数声明改为等价的函数表达式，那么执行的时候就会出错：

```javascript
//报错
console.log(sum(10, 10));
let sum = function(num1, num2) { return num1 + num2; }
```

上面的代码之所以会出错，是因为这个函数定义包含在一个变量初始化语句中，而不是函数声明中。这意味着代码如果没有执行到加粗的那一行，那么执行上下文中就没有函数的定义，所以上面的代码会出错。这并不是因为使用let 而导致的，使用var 关键字也会碰到同样的问题：

```javascript
//报错
console.log(sum(10, 10));
var sum = function(num1, num2) { return num1 + num2; }
```



## 3. 函数声明的形式- 块级函数

在ECMAScript 3和早期版本中，在代码块中声明一个块级函数严格来说是一个语法错误,但是每个浏览器对这个特性的支持都稍有不同，所以最好不要使用这个特性（最好的选择是使用函数表达式）。

为了遏制这种相互不兼容的行为，ECMAScript 5的严格模式中引入了一个错误提示，当在代码块内部声明函数时程序会抛出错误：

```javascript
'use strict'
if (true) {
  //在ES5中抛出语法错误,在Es6中不报错
  function doSomething() {
    //空函数
  }
}
```

<u>在ECMAScript 6中，会将doSomething()函数视作一个块级声明，从而可以在定义该函数的代码块内访问和调用它。</u>

```javascript
'use strict'
if (true) {
  console.log(typeof doSomething); //'function'
  
  function doSomething() {
    //函数体
  }
  
  doSomething();
}

console.log(typeof doSomething); //'undefined'
```

**在定义函数的代码块内，块级函数会被提升至顶部**，所以typeof doSomething的值为"function"，这也佐证了，即使你在函数定义的位置前调用它，还是能返回正确结果；但是一旦if语句代码块结束执行，doSomething()函数将不再存在。

### 块级函数的使用场景

块级函数与let函数表达式类似，一旦执行过程流出了代码块，函数定义立即被移除。二者的区别是，在该代码块中，块级函数会被提升至块的顶部，而用let定义的函数表达式不会被提升

```javascript
'use strict'
if (true) {
  console.log(typeof doSomething); //'function'
  
  let doSomething = function () {
    //函数体
  };
  
  doSomething();
}

console.log(typeof doSomething);
```

在这段代码中，当执行到typeof doSomething时，由于此时尚未执行let声明语句，doSomething()还在当前块作用域的临时死区中，因此程序被迫中断执行。

### ES6非严格模式下的块级函数

在ECMAScript 6中，即使处于非严格模式下，也可以声明块级函数，但其行为与严格模式下稍有不同。<span style="text-decoration-line:underline; text-decoration-style:dashed;text-decoration-color:red;">这些函数不再提升至代码块的顶部，而是提升至外围函数或全局作用域的顶部。</span>

```javascript
//ES6中的行为

if (true) {
  console.log(typeof doSomething); //'function'
  
  function doSomething() {
    //函数体
  }
  
  doSomething();
}

console.log(typeof doSomething); //'function'
```

在这个示例中，doSomething()函数被提升至全局作用域，所以在if代码块外也可以访问到。ECMAScript 6将这个行为标准化了，移除了之前存在于各浏览器间不兼容的行为，所以所有ECMAScript 6的运行时环境都将执行这一标准。



### 函数名

因为函数名就是指向函数的指针，所以它们跟其他包含对象指针的变量具有相同的行为。这意味着
一个函数可以有多个名称.

* 使用不带括号的函数名会访问函数指针，而不会执行函数
* 把函数名称 设置为null之后，就切断了它与函数之间的关联
* ECMAScript 6 的所有函数对象都会暴露一个<span style="color:blue">只读的name 属性</span>，其中包含关于函数的信息。
  * 多数情况下，这个属性中保存的就是一个函数标识符，或者说是一个字符串化的变量名
  * 即使函数没有名称，也会如实显示成空字符串。
  * 如果它是使用Function 构造函数创建的，则会标识成"anonymous
  * 如果函数是一个获取函数、设置函数，或者使用bind()实例化，那么标识符前面会加上一个前缀

```javascript
function sum(num1, num2) {
	return num1 + num2;
}
console.log(sum(10, 10)); // 20
let anotherSum = sum;
console.log(anotherSum(10, 10)); // 20
sum = null;
console.log(anotherSum(10, 10)); // 20

//函数的name属性
function foo() {}
let bar = function() {};
let baz = () => {};
console.log(foo.name); //foo
console.log(bar.name); //bar
console.log(baz.name); //baz
console.log((() => {}).name); //(空字符串)
console.log((new Function()).name); //anonymous

//设置函数,获取函数,bind方法绑定的函数的name值
function foo() {}
console.log(foo.bind(null).name); //bound foo

let dog = {
  years: 1,
  get age() {
    return this.years;
  },
  set age(newAge) {
    this.years = newAge;
  }
};

let propertyDescriptor = Object.getOwnPropertyDescriptor(dog, 'age');
console.log(propertyDescriptor.get.name); // get age
console.log(propertyDescriptor.set.name); // set age
```

### 匿名和具名函数

#### 匿名函数表达式

函数表达式可以是匿名的，而函数声明则不可以省略函数名——在JavaScript的语法中这是非法的。

```javascript
setTimeout(function() { //
  console.log('xxx');
}, 1000)
```

#### 匿名函数表达式缺点

匿名函数表达式有几个缺点需要考虑:

* 在栈追踪中不会显示出有意义的函数名,调试困难
* 在递归或事件触发后事件监听器需要解绑自身时需要引用自己, 只能使用已经过期的arguments.callee引用
* 匿名函数省略了对于代码可读性/可理解性很重要的函数名



#### 具名函数表达式(行内函数表达式)

XX

#### 最佳实践

给函数表达式指定一个函数

#### 练习题

```javascript
var a = 10
(function a() {
  a = 20
  console.log(a) //输出函数a的内容
})

// ECMAScript 标准中要求 NFE 实现两个特性1.只能在函数体内访问函数名变量。2.函数名变量可以理解为常量，不可改变。所以a = 20被忽略了，在严格模式下会报错
```







# 函数调用

定义一个函数并不会自动的执行它。定义了函数仅仅是赋予函数以名称并明确函数被调用时该做些什么。**调用**函数才会以给定的参数真正执行这些动作.

函数一定要处于调用它们的域中,因为函数的声明可以被提升,所以可以在声明之前调用.函数提升只适用于函数声明,而不适应于函数表达式.

如果一个函数中没有使用return语句，则它默认返回`undefined`。要想返回一个特定的值，则函数必须使用 `return` 语句来指定一个要返回的值。(使用[new](https://developer.mozilla.org/zh-cn/docs/JavaScript/Reference/Operators/new)关键字调用一个[构造函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)除外)

```JavaScript
//it's work;
cosole.log(square(5))
function square(n){return n*n};


console.log(square); //square is hoisted with an initial value undefined;
console.log(square(5)); //Uncaught TypeError: square is not a function
const square = function(n){return n*n};
```




# 函数参数

ECMAScript 函数既不关心传入的参数个数，也不关心这些参数的数据类型。调用时传入参数数量不要求于定义时参数数值一致.因为ECMAScript 函数的参数在内部表现为一个数组, 在function关键字定义(非箭头)函数时,可以在函数内部访问arguments对象.

**ECMAScript 中函数的参数就是局部变量**。

#### 形参与实参🔸

**实参**: 调用函数时，传递给函数的值被称为函数的实参（值传递).

**形参**: 形参就相当于在函数中声明了对应的变量,但是没有实际的值.

>当实参是基本数据类型的值时，实际是将实参的值复制一份传递给形参，在函数运行结束时形参被释放，而实参中的值不会变化。当实参是引用类型的值时，实际是将实参的内存地址传递给形参，即实参和形参都指向相同的内存地址，此时形参可以修改实参的值，但是不能修改实参的内存地址

```js
# 形参(形式参数)
定义函数时,可以在函数的()中定义数量不等的形参
形参就相当于在函数中声明了对应的变量,但是没有实际的值. //返回的是undefined
function fn(a, b){
    console.log('a =', a);  //undefined
    console.log('b =', b);  //undefined
}



## 实参(实际参数)
在调用函数时,可以向函数中传递数量不等的实参,
实参会赋值给对应的形参
在JS中不会检查实参的类型和数量
 - 可传递任意类型的实参
 - 可以传递任意数量的实参
 - 如果数量一样,则实参和形参一一对应
 - 如果实参少,则没有对应的实参的形参是undefined
 - 如果实参多,则多余的实参不会被使用
```



#### 函数参数的传递方式
[[202301181129b|函数参数传递方式]]







## ES6-默认参数

##### what

在ECMAScript5.1 及以前，实现默认参数的一种常用方式就是检测某个参数是否等于undefined，如果是则意味着没有传这个参数，那就给它赋一个值; ES6支持显式定义默认参数.

在使用默认参数时，arguments 对象的值不反映参数的默认值，只反映传给函数的参数。

跟ES5 严格模式一样，修改命名参数也不会影响arguments 对象，它始终以调用函数时传入的值为准.

默认参数值并不限于原始值或对象类型，也可以使用调用函数返回的值

<u>函数的默认参数只有在函数被调用时才会求值，不会在函数定义时求值. 且计算默认值的函数只有在调用函数但未传相应参数时才会被调用</u>。

```js
//未使用默认参数
function multiplay(a,b){
	b=(typeof b!=='undefined'?b:1);
  return a*b;
}
multiplay(5)

//使用默认参数
function multiplay(a,b=1){
  return a*b;
}
multiply(5)

//arguments对象始终以传入的值为准
function makeKing(name = 'Henry') {
  name = 'Louis';
  return `King ${arguments[0]}`;
}
makeKing(); //King undefined
makeKing('Louis'); //King 

//默认参数值使用函数返回值
let romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
let ordinality = 0;
function getNumerals() {
  //每次调用后递增
  return romanNumerals[ordinary++];
}
function makeKing(name='Henry', numerals = getNumerals()) {
  return `King ${name} ${numerals}`;
}
console.log(makeKing()); // 'King Henry I'
console.log(makeKing('Louis', 'XVI')); // 'King Louis XVI'
console.log(makeKing()); // 'King Henry II'
console.log(makeKing()); // 'King Henry III'
```



##### **使用对象做函数默认值与Python比较**

```javascript
function make_list(v, the_list = []) {
  return this_list.push(v)
}

make_list(12) //12

make_list(47) //47

make_list('oh no') //'oh no'
```

```python
def make_list(v, the_list=[]):
	the_list.append(v)
	retur the_list
	
	
make_list(12) //[12]

make_list(47) //[12, 47]

make_list('oh no') ///[12, 47, 'oh no']

//solution

def make_list(v, the_list=[]):
  if the_list is Node:
    the_list = []
  the_list.append(v)
  return the_list
```









##### **默认参数表达式**

默认参数除了原始值,还可以是非原始值.例如函数.

```javascript
function getValue() {
  return 5;
}

function add(first, second = getValue()) {
  return first + second;
}

console.log(add(1, 2)); //3
console.log(add(1)); //6
```

初次解析函数声明时不会调用getValue()方法，只有当调用add()函数且不传入第二个参数时才会调用。

注意，当使用函数调用结果作为默认参数值时，如果忘记写小括号，例如，second= getValue，则最终传入的是对函数的引用，而不是函数调用的结果。

正因为默认参数是在函数调用时求值，所以可以使用先定义的参数作为后定义参数的默认值

```javascript
function add(first, second = first) {
  return first + second;
}

console.log(add(1, 1)); //2
console.log(add(1)); //2
```





##### **默认参数作用域与暂时性死区**!

因为在求值默认参数时可以定义对象，也可以动态调用函数，所以函数参数肯定是在某个作用域中
求值的。给多个参数定义默认值实际上跟使用let 关键字顺序声明变量一样.

因为参数是按顺序初始化的，所以后定义默认值的参数可以引用先定义的参数

参数初始化顺序遵循“暂时性死区”规则，即前面定义的参数不能引用后面定义的

参数也存在于自己的作用域中，它们不能引用函数体的作用域

```javascript
function makeKing(name = 'Henry', numerals = 'VIII') {
	return `King ${name} ${numerals}`;
}
console.log(makeKing()); // King Henry VIII
//这里的默认参数会按照定义它们的顺序依次被初始化。可以依照如下示例想象一下这个过程：
function makeKing() {
  let name = 'Henry';
  let numerals = 'VIII';
  return `King ${name} ${numerals}`;
}

//因为参数是按顺序初始化的，所以后定义默认值的参数可以引用先定义的参数
function makeKing(name = 'Henry', numerals = name) {
	return `King ${name} ${numerals}`;
}
console.log(makeKing()); // King Henry Henry

//参数初始化顺序遵循“暂时性死区”规则，即前面定义的参数不能引用后面定义的
// 调用时不传第一个参数会报错
function makeKing(name = numerals, numerals = 'VIII') {
	return `King ${name} ${numerals}`;
}

//参数也存在于自己的作用域中，它们不能引用函数体的作用域
// 调用时不传第二个参数会报错
function makeKing(name = 'Henry', numerals = defaultNumeral) {
	let defaultNumeral = 'VIII';
	return `King ${name} ${numerals}`;
}
```

函数参数有自己的作用域和临时死区，其与函数体的作用域是各自独立的，也就是说<span style="color:blue">参数的默认值不可访问函数体内声明的变量</span>。



```javascript
// 函数调用时,声明的默认参数,可以在函数外部访问

function f(x) {
  console.log(x);
  var x = 200;
  console.log(x);
  }
f(a = 100);
console.log(a); //100
```







## ES6-剩余参数

就是下面的参数收集



#### ES6-参数扩展与收集

**扩展参数**

在给函数传参时，有时候可能不需要传一个数组，而是要分别传入数组的元素.

```javascript
//假设有如下函数定义，它会将所有传入的参数累加起来：
let values = [1,2,3,4];
function sum() {
  let sum = 0;
  for (let i=0; i<arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
}
//es5中 想把定义在这个函数这面的数组拆分，那么就得求助于apply()方法
console.log(sum().apply(null, values));

//es6 扩展操作符
console.log(sum(...values));
```

arguments 对象只是消费扩展操作符的一种方式。在普通函数和箭头函数中，也可以将扩展操作符用于命名参数，当然同时也可以使用默认参数.

```javascript
function getProduct(a, b, c = 1) {
	return a * b * c;
}
let getSum = (a, b, c = 0) => {
	return a + b + c;
}
console.log(getProduct(...[1,2])); // 2
console.log(getProduct(...[1,2,3])); // 6
console.log(getProduct(...[1,2,3,4])); // 6

console.log(getSum(...[0,1])); // 1
console.log(getSum(...[0,1,2])); // 3
console.log(getSum(...[0,1,2,3])); // 3
```



**收集参数**

在函数定义时，可以使用扩展操作符把不同长度的独立参数组合为一个数组(Array的实例)

收集参数的前面如果还有命名参数，则只会收集其余的参数；如果没有则会得到空数组。因为收集
参数的结果可变，所以只能把它作为最后一个参数：

使用收集参数并不影响arguments 对象，它仍然反映调用时传给函数的参数

```javascript
//位置 只能放在最后
function getProduct(...values, lastValue) {} //不可以

//不影响arguments对象
getSum(1,2,3);
function getSum(...values) {
  console.log(arguments.length); //3
  console.log(arguments); //
  console.log(values); //[1,2,3]
}

//打印的arguments
0: 1
1: 2
2: 3
callee: [Exception: TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them at Arguments.invokeGetter (<anonymous>:3:28)]
length: 3
Symbol(Symbol.iterator): ƒ values()
get callee: ƒ ()
set callee: ƒ ()
[[Prototype]]: Object
```

参数收集(剩余参数, 不定参数)的使用限制:

* 每个函数最多只能声明一个不定参数,而且一定要放在所有参数的末尾;
* 不定参数不能用于对象字面量setter之中

```javascript
//抛出语法错误.当不定参在对象字面量setter中使用
let obj = {
  set name(...value) {
    //
  }
}

//之所以存在这条限制，是因为对象字面量setter的参数有且只能有一个。而在不定参数的定义中，参数的数量可以无限多，所以在当前上下文中不允许使用不定参数。
```



### 函数参数的传递方式:

> 在按值传递参数时，值会被复制到一个局部变量（即一个命名参数，或者用ECMAScript 的话说，就是arguments 对象中的一个槽位）。
>
> 在按引用传递参数时，值在内存中的位置会被保存在一个局部变量，这意味着对本地变量的修改会反映到函数外部。（这在ECMAScript 中是不可能的。）
>
> ---Javascript高级程序设计 4.1.3 传递参数



**结论**

* <span style="color: red">参数如果是基本类型是按值传递,如果是引用类型按共享传递</span>
* 按值传递拷贝了原值，按共享传递拷贝了引用，都是拷贝值，所以可以理解成都是按值传递。
* 但是因为拷贝副本也是一种值的拷贝,所以在高程中也直接认为是按值传递.



> 以下内容来自JavaScript深入之参数按值传递 https://github.com/mqyqingfeng/Blog/issues/10



##### 几种传递方式

**按值传递** 

```javascript
function test(a) {
  a = a + 10
}
var a = 10;
test(a)
console.log(a) //10

//
var value = 1;
function foo(v) {
  v = 2;
  console.log(v); //2
}

foo(value);
console.log(value); //1
```



**引用传递?**

拷贝虽然很好理解，但是当值是一个复杂的数据结构的时候，拷贝就会产生性能上的问题。

所以还有另一种传递方式叫做按引用传递。

所谓按引用传递，就是传递对象的引用，函数内部对参数的任何改变都会影响该对象的值，因为两者引用的是同一个对象。

```javascript
var obj = {
  value: 1
};

function foo(o) {
  o.value = 2;
  console.log(o.value); //2
}

foo(obj);
console.log(obj.value); //2
```

那以上这种传值方式到底是不是按引用传递呢?

**共享传递**

案例

```javascript
var obj = 1;

function foo(o) {
  o = 2;
  console.log(o); //2
}

foo(obj); 
console.log(obj); //1



//证明对象在函数的参数传递中是按 ? 传递的代码
function setName(obj) {
    obj.name = "Nicholas";   //obj地址没有改变
    obj = new Object();      //obj地址改变
    obj.name = "Greg";
}

var person = new Object(); 
setName(person);
alert(person.name); // "Nicholas"
var person = new Object();
setName(person);
alert(person.name); // "Nicholas"
```

<span style="color:red">如果JavaScript采用的是引用传递,外层的值也会被修改,以上案例中却没有被修改,所以不是引用传递.</span>

其实还有第三种传递方式, 共享传递.

<span style="text-decoration: underline wavy">共享传递是指, 在传递对象的时候, 传递对象的引用的副本.</span>

注意: 按引用传递是传递对象的引用, 而<u>按共享传递是传递对象的引用的副本</u>.

所以修改o.value,可以通过引用找到原值,但是直接修改o,并不会修改原值.




## 函数内部

在ECMAScript 5 中，函数内部存在两个特殊的对象：arguments 和this。ECMAScript 6 又新增
了new.target 属性。

#### arguments

**define**

> `arguments` is an Array-like object accessible inside functions that contains the values of the arguments passed to that function. (实参个数为3, 形参个数为1, arguments对象也包含所有的实参)

**Properties**

`arguments.callee`

> Reference to the currently executing function that the arguments belong to.
>
> Forbidden in strict mode

arguments 对象的callee 属性，是一个指向arguments 对象所在函数的指针。阶乘函数要正确执行就必须保证函数名是factorial，从而导致了紧密耦合。

使用arguments.callee 就可以让函数逻辑与函数名解耦.

不推荐广泛使用arguments.callee属性，其中有一个主要原因是使用arguments.callee属性后会改变函数内部的this值。

```javascript
//使用callee属性解决阶乘函数的耦合

function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);
    //return num * factorial(num - 1);
  }
}
//用arguments.callee 代替了之前硬编码的factorial。这意味着无论函数叫什么名称，都可以引用正确的函数
let trueFactorial = factorial;
factorial = function() { return 0; }
console.log(trueFactorial(5)); //120
console.log(factorial(5)); //0
```



```js
// arguments.callee  ???

var sillyFunction = function (recursed) {
   if (!recursed) {
       console.log(this);  // Window {}
       return arguments.callee(true);
   }
   console.log(this);  // Arguments {}
};
sillyFunction();
```



`arguments.length`

> the number of arguments that were passed to the function

`arguments[@@iterator]`

> Returns a new Array iterator object that contains the values for each index in `arguments`



**arguments.callee实例**

> [实现一个函数 where，它返回它被调用的时候所在的函数的名字](https://www.zhihu.com/question/37904806/answer/488668791)

写一个函数,实现调用这个函数的函数的名称  ????????

```javascript
//非严格模式下
function where() {
  return arguments.callee.caller.name;
}
```

```javascript
//严格模式下
const where = () => {
  let reg = /\s+at\s(\S+)\s\(/g
  let str = new Error().stack.toString();
  let res = reg.exec(str) && reg.exec(str)
  return res && res[1];
}
```



**类数组对象转换成数组的 5 种方法**

```javascript
[].slice.call(arguments)
[].splice.call(arguments, 0);
[].concat.apply([], arguments);
Array.from(arguments)
[...arguments]
for循环
```





**desc**

* 'Array-Like' means that `arguments` has a `length` property and properties indexed from zero, but it doesn't hava `Array`'s built-in methods like `forEach()` or `map()`.
* the `arguments` object is a local variable available within all non-arrow functions.
* u can refer to a function's arguments inside that function by using its `arguments` object
* it has entries(条目) for each argument the function was called with, with the first entry's index at 0.
* each arguments can also be set or reassigned
* the arguments object is not an `Array`. It is similar, but lacks all `Array` properties except `length`.
* <u>**converted to a real Array**</u>
  * [].slice.call(arguments)
  * [].splice.call(arguments, 0)
  * [].concat.apply([], arguments)
  * Array.from(arguments)
  * [...arguments]
* the `typeof` opetator returns `'object'` when used with `arguments`





`arguments`变量只是 *”***类数组对象**“，并不是一个数组。称其为类数组对象是说它有一个<u>索引编号和`length`属性</u>。它并不拥有全部的Array对象的操作方法。

arguments 对象是一个类数组对象（但不是Array 的实例）:

* 使用中括号语法访问传入的实参,而不必定义形参
* 访问arguments.length,确定传入参数个数
* arguments对象可以跟命名参数一起使用
* arguments对象的值始终与对应的命名参数同步,但内存地址是不同的.
* arguments 对象的长度是根据传入的参数个数，而非定义函数时给出的命名参数个数确定的
* 如果只传了1个参数,然后为arguments[1]赋值,这个值并不会反映到第二个命名参数.
* ES5严格模式下,为arguments[n]赋值不会改变传入实参的值;重写arguments对象会导致语法错误
  * 非严格模式下,为arguments[n]赋值会改变形参中第n个实参的值.

* ES6中,如果一个函数使用了<span style="color:blue">默认参数值,</span>则无论是否显式定义严格模式,arguments对象的行为与ES5严格模式下一致(参数变化但arguments不变)
* 箭头函数中不能访问arguments,但可以在包装函数中将其传给箭头函数

```JavaScript
//在浏览器中的表现形式
function fn() {
	console.log(arguments)
}
fn(1,2,3); //Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]

//与命名参数一起使用
function doAdd(num1, num2) {
  if (arguments.length === 1) {
    console.log(num1 + 10);
  } else if (arguments.length === 2) {
    console.log(argments[0] + num2);
  }
}

//始终与命名参数同步
function doAdd(num1 ,num2) {
  arguments[1] = 10; //修改arguments[1]也会修改num2 的值
  console.log(arguments[0] + num2);
}

//arguments.length由传参个数确定,而非形参个数
doAdd(10, 10) //2
function doAdd(num1, num2, num3) {
	console.log(arguments.length)
}

//实参只有一个的话,arguments[1]的赋值不会改变第二个;形参有俩实参传1个,则第二个为undefined

//严格模式下,arguments中括号语法不会改变实参的值;
function sum(num1, num2) {
  'use strict'
  arguments[1] = 2;
  return num1 + num2;
}
sum(10, 10); //20


//ES5严格模式下或ES6存在默认参数下,参数变化但arguments对象不会变
function fn(a, b = 1) {
  a = 3;
  b = 4;
  console.log(a === arguments[0]); //false
  console.log(b === arguments[1]); //false
}

//严格模式下,重写arguments会导致语法错误
function sum(num1, num2) {
  'use strict'
  arguments = {};
}

//Uncaught SyntaxError: Unexpected eval or arguments in strict mode
```





#### this

**定义**

* this是<span style="color:red">函数调用时</span>创建执行上下文的一个属性,会在函数执行的过程中用到.

* this是在运行时进行绑定的,并不是在编写时绑定,它的上下文取决于函数调用时的各种条件.

* this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。

当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息。this就是这个记录的一个属性，会在函数执行的过程中用到。

##### 使用原因

来个例子:

```javascript
function identify() {
  return this.name.toUpperCase();
}

function speak() {
  let greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}

let me = {
  name: 'Kyle'
};

let you = {
  name: 'Reader'
};

identify.call(me); //KYLE
identify.call(you); //READER

speak.call(me); //Hello, I'm KYLE
speak.call(you); //Hello, I'm READER
```

这段代码可以在不同的上下文对象（me和you）中重复使用函数identify()和speak()，不用针对每个对象编写不同版本的函数。如果不使用this，那就需要给identify()和speak()显式传入一个上下文对象。

```javascript
function identify(context) {
  return context.name.toUpperCase();
}

function speak(context) {
  let greeting = "Hello, I'm " + identify(context);
  console.log(greeting);
}
```

**所以综上所述,使用this的原因有:**

* 显式传递上下文对象会让代码越来越混乱

* 调用函数时不用显示传递上下文对象, this隐式传递一个对象引用,API简洁且易于复用

  



##### 调用位置

调用位置就是函数在代码中被调用的位置（而不是声明的位置）。

因为某些编程模式可能会隐藏真正的调用位置。最重要的是要分析调用栈（就是为了到达当前执行位置所调用的所有函数）。我们关心的调用位置就在当前正在执行的函数的前一个调用中。

查看调用栈的方法

1. 把调用栈想象成一个函数调用链，就像我们在前面代码段的注释中所写的一样。但是这种方法非常麻烦并且容易出错。
2. 浏览器内置的开发者工具
   1. 函数第一行代码 设置断点
   2. 第一行前插入 debugger; 语句

调用栈中第二个元素，这就是真正的调用位置。 如下图所示:

![屏幕截图-2022-04-09-163810](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/屏幕截图-2022-04-09-163810.72ky3op08200.webp)



##### this绑定规则

> 来源: 你不知道的JavaScript(上卷)

函数的执行过程中调用位置如何决定this的绑定对象。

* 默认绑定,
* 隐式绑定,
* 显示绑定,
* new绑定



###### 1.默认绑定

最常用的函数调用类型：独立函数调用。可以把这条规则看作是无法应用其他规则时的默认规则。

```JavaScript
function foo() {
  console.log(this.a);
}

var a = 2;
foo(); //2
```

通过分析调用位置来看看foo()是如何调用的。在代码中，foo()直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。

注意事项:

如果使用严格模式(strict mode), 则不能将全局对象用于默认绑定, this会被绑定到undefined.

<u>虽然<span style="color:red;">this的绑定规则完全取决于调用位置</span>,但是只有foo()运行在非strict mode下时,默认绑定才能绑定到全局对象; 在严格模式下调用foo()则不影响默认绑定.</u>

```JavaScript
function foo() {
  'use strict'
  console.log(this.a);
}

var a = 2;
foo(); 
//VM53:3 Uncaught TypeError: Cannot read properties of undefined (reading 'a')
//  at foo (<anonymous>:3:20)
//  at <anonymous>:7:1
```



###### 2.隐式绑定

调用位置是否有上下文对象,或者说是否被某个对象**拥有或包含**,不过这种说法可能会造成一些误导.

```JavaScript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
};

obj.foo(); //2
```

<span style="text-decoration:underline wavy blue">无论是直接在obj中定义还是先定义函数再添加为引用属性,这个函数严格来说都不属于obj对象.</span>

<u>因为JavaScript是基于函数作用域的(ES6中增加了块作用域),JavaScript中的对象没有作用域的概念.</u>

比如全局代码:

```JavaScript
var num = 9;
var obj = {
  a:2,
  fn:function(){}
}
```

函数fn的作用域是全局对象,你可以在fn中访问num,但是不能访问到a, 也就是说函数fn的作用域链上并不包含obj对象, 如果要访问a,只能在fn里使用this.a来访问,并且对函数fn的调用方式是obj.fn()

Note:

* 当函数引用有上下文对象时,隐式绑定规则会把函数调用中的this绑定到这个上下文对象.
* 对象属性引用链中只有上一层或者说最后一层在调用位置中起作用.

```JavaScript
function foo() {
  console.log(this.a);
}

var obj2 = {
  a:42,
  foo:foo
};

var obj1 = {
  a: 2,
  obj2: obj2
};

obj1.obj2.foo(); //42
```



**隐式丢失**

一个最常见的this绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而把this绑定到全局对象或者undefined上，取决于是否是严格模式。

隐式丢失的几种情况: ?

* 将<u>对象.方法</u>赋值给变量,调用这个变量
* 参数传递.将函数通过参数传递进函数.
* 把函数传入语言内置的函数

<u>将对象.方法赋值给变量</u>

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a:2,
  foo:foo
};

var bar = obj.foo;

var a = 'oops, global!';

bar(); //'oops, global!'
```

虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身，因此此时的bar()其实是一个不带任何修饰的函数调用，因此应用了默认绑定。



<u>传入回调函数</u>; 也会存在调用回调函数的函数修改this的情况

```javascript
function foo() {
  console.log(this.a);
}

function doFoo(fn) {
  fn();
}

var obj = {
  a:2,
  foo:foo
};

var a = 'oops, global!';

doFoo(obj.foo); //'oops, global!'
```

<span style="background: #ccc">参数传递其实就是一种**隐式赋值**</span>，因此我们传入函数时也会被隐式赋值，所以结果和上一个例子一样。

<u>把函数传入语言内置的函数.</u>

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
};

var a = 'oops, global!';

setTimeout(obj.foo, 100); //'oops, global!'
```

javascript内置的setTimeout()函数实现和下面的伪代码类似:

```javascript
function setTimeout(fn, delay) {
  //等待delay毫秒
  fn();
}
```

问题:

无论是哪种情况，this的改变都是意想不到的，<u>实际上你无法控制回调函数的执行方式，因此就没有办法控制调用位置以得到期望的绑定</u>。之后我们会介绍如何通过<u>固定this</u>来修复这个问题。



###### 3.显式绑定

分析隐式绑定时，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把this间接（隐式）绑定到这个对象上。

那么如果我们不想在对象内部包含函数引用，而想在某个对象上强制调用函数，该怎么做呢？

显示绑定: 使用call()/apply()

有两种情况需要注意，<span style="color:blue;">传null或undefined时</span>，将是JS执行环境的全局变量。浏览器中是window，其它环境（如node）则是global。

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2
};

foo.call(obj); //2


function foo() {
  console.log(this.a);
}

var obj = {
  a:2
};

foo.call(obj);
```

通过foo.call(), 我们可以在调用foo时强制把它的this绑定到obj上.

如果你<span style="color:blue">传入了一个原始值（字符串类型、布尔类型或者数字类型）</span>来当作this的绑定对象，这个原始值会被转换成它的对象形式（也就是new String(..)、new Boolean(..)或者newNumber(..)）。这通常被称为**“装箱”**。(**拆箱**: 将对象转化成基本数据类型)



Note:

显示绑定仍然无法解决之前提出的问题. 但是有几种方法可以解决. ???? 什么问题?

> 来源: 微信读书中书友想法
>
> 使用场景很普遍,但就是没有考虑到.
>
> 虽然call和apply可以在任意地方调用,但是它是直接进行调用送的.设想,如果在某个第三方库中,其异步的回调函数需要改变this,如果这个时候使用call/apply会立即调用并更改this,异步在不知道完成与否的情况下,异步回调直接运行了.

**1.硬绑定**

显示绑定的一个变种

我们创建了函数bar()，并在它的内部手动调用了foo.call(obj)，因此强制把foo的this绑定到了obj。无论之后如何调用函数bar，它总会手动在obj上调用foo。这种绑定是一种显式的强制绑定，因此我们称之为硬绑定。

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2
};

var bar = function() {
  foo.call(obj);
};

bar(); //2
setTimeout(bar, 100); //2
```

硬绑定应用场景:

1.创建一个包裹函数,负责接收参数并返回值.

```javascript
function foo(sth) {
  console.log(this.a, sth);
  return this.a + sth;
}

let obj = {
  a: 2
};

let bar = function() {
  return foo.apply(obj, arguments);
};

let b = bar(3);//2 3
console.log(b); //5
```

2.创建一个可以重复使用的辅助函数

```javascript
function foo(sth) {
  console.log(this.a , sth);
  return this.a + sth;
}

//简单的绑定函数
function bind(fn, obj) {
  return function() {
    return fn.apply(obj, arguments);
  };
}

let obj = {
  a: 2
};

let bar = bind(foo, obj);

let b = bar(3); //2 3
console.log(b); //5
```

由于硬绑定是一种非常常用的模式，所以ES5提供了内置的方法Function.prototype.bind.

bind(..)会返回一个硬编码的新函数，它会把你指定的参数设置为this的上下文并调用原始函数。



**2.API调用的'上下文'**

第三方库的许多函数，以及JavaScript语言和宿主环境中许多新的内置函数，都提供了一个可选的参数，通常被称为“上下文”（context），其作用和bind(..)一样，确保你的回调函数使用指定的this。

这些函数实际上就是<span style="color:red">通过call(..)或者apply(..)实现了显式绑定</span>，这样你可以少写一些代码。

举个例子:

```javascript
function foo(el) {
  console.log(el, this.id);
}


var obj = {
  id: 'awesome'
}

//调用foo()时把this绑定到obj
[1,2,3].forEach(foo, obj);
```



```javascript
//来个例子

Array.prototype.forEach = function() {
  //check the type and lengths
  
  let arr = this;
  let callback = [].shift.call(arguments);
  let thisArg = arguments[0] || globalThis;
  for (let i=0,len=arr.length; i<len; i++) {
    callback.call(thisArg, arr[i], i, arr)
  }
}
```





###### 4.new绑定



使用new来调用函数,或者说发生构造函数调用时,会自动执行下面的操作:

1. 内存中新建一个对象
2. 将新建对象的隐式原型[[prototype]]指针赋值为构造函数的原型prototype
3. 这个新对象会绑定到函数调用的this
4. 如果函数返回非空对象,则返回;否则,返回新建对象.

```javascript
//构造函数篇 模拟实现new操作符

function newOp() {
  let obj = {};
  let Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  let result = Constructor.apply(obj, arguments);
  return typeof result === 'object' ? result : obj;
}
```



##### 绑定优先级

1.隐式绑定和显示绑定哪个优先级高?

显示绑定>隐式绑定

```javascript
function foo() {
  console.log(this.a);
}

let obj1 = {
  a: 2,
  foo: foo
};

let obj2 = {
  a: 3,
  foo: foo
};

obj1.foo(); //2
obj2.foo(); //3

obj1.foo.call(obj2); //3
obj2.foo.call(obj1); //2
```

2.new绑定和隐式绑定

new绑定 > 隐式绑定

```javascript
function foo(sth) {
  this.a = sth;
}

let obj1 = {
  foo: foo
};

let obj2 = {};


obj.foo(2);
console.log(obj1.a); //2

obj1.foo.call(obj2, 3);
console.log(obj2.a); //3

let bar = new obj1.foo(4);
console.log(obj1.a);//
console.log(bar.a);//4
```

可以看到new绑定比隐式绑定优先级高. new绑定和隐式绑定在同一个地方上

3.new绑定和显示绑定

new绑定 > 显示绑定

因为new和call/apply无法一起使用,因此无法通过new foo.call(obj1)来直接进行测试.但是可以使用硬绑定来测试它俩的优先级.

硬绑定: Function.prototype.bind()会创建一个新的包装函数,这个函数会忽略它当前的this绑定(无论绑定的对象是什么),并把我们提供的对象绑定到this上.

来个例子: 

```javascript
function foo(sth) {
  this.a = sth;
}

let obj1 = {};

let bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); //2

let baz = new bar(3);
console.log(obj1.a); //2
console.log(baz.a); //3
```

bar被硬绑定到obj1上,但是new bar(3)并没有像我们预计的把obj1.a修改为3.相反, new修改了硬绑定(到obj1的)调用bar()中的this.





##### 判断this

1. 函数是否在new中调用(new绑定)? 如果是, this绑定到新创建的对象
2. 函数是否通过call, apply(显示绑定)或者硬绑定调用? 如果是的话, this绑定的是指定的对象.
3. 函数在某个上下文对象中调用(隐式绑定), this绑定的是那个上下文对象
4. 如果都不是的话,使用默认绑定,但在严格模式下,会绑定到undefined,否则绑定到全局对象.



##### **this的不同指向**

* 以`函数`形式调用,非严格模式下指向`window`,严格模式为`undefined`
* 以`方法`形式调用,this指向调用方法的`对象`
* 以`构造函数`形式调用,this指向`实例`
* 以`call/apply`形式调用, this是它们的`第一个参数`
  * 有两种情况需要注意，传null或undefined时，将是JS执行环境的全局变量。浏览器中是window，其它环境（如node）则是global。

* 以`箭头函数`形式调用,this由`外层作用域`决定
* 在`DOM事件`中,this指向当前触发事件的`事件源`



##### **改变this指向的几种方式**

* 箭头函数
* 函数内部赋值`_this=this`
* 使用`apply call bind`
* 构造函数



##### this绑定例外 !!!

<u>1.可以忽略的this</u>

> 如果把null或undefined作为this的绑定对象传入call, apply, bind, 这些值在调用时会被忽略,实际应用的默认绑定规则.

<span style="color:blue">什么情况下传入null?</span>

一种常见的做法是使用apply()来展开一个数组,并当做参数传入一个函数.类似地, bind()可以对参数进行柯里化,这种方法有时很有用:

```javascript
function foo(a, b) {
  console.log('a: ' + a +', b:' + b);
}

//把数组展开成参数
foo.apply(null, [2,3]); //a:2, b:3

//使用bind()进行柯里化
var bar = foo.bind(null, 2);
bar(3); //a:2, b:3
```

这两种方法都需要传入一个参数当作this的绑定对象。如果函数并不关心this的话，你仍然需要传入一个占位值，这时null可能是一个不错的选择，就像代码所示的那样。

注意: ES6中使用展开运算符来代替apply来展开数组.

<span style="color:blue">存在的问题及解决方法:</span>

如果某个函数确实使用了this（比如第三方库中的一个函数），那默认绑定规则会把this绑定到全局对象（在浏览器中这个对象是window），这将导致不可预计的后果（比如修改全局对象）。

更安全的this-- 空集

一种“更安全”的做法是传入一个特殊的对象，把this绑定到这个对象不会对你的程序产生任何副作用。在这里可以使用空对象.

```javascript
let ∅ = Object.create(null);
```

无论你叫它什么，在JavaScript中创建一个空对象最简单的方法都是Object.create(null)（详细介绍请看第5章）。Object.create(null)和{}很像，但是并不会创建Object.prototype这个委托，所以它比{}“更空”.

```javascript
function foo(a, b) {
  console.log('a: ' + a +', b:' + b);
}

//DMZ对象
let ∅ = Object.create(null);

//把数组展开成参数
foo.apply(∅, [2,3]); //a:2, b:3

//使用bind()进行柯里化
var bar = foo.bind(null, 2);
bar(3); //a:2, b:3
```



<u>2.间接引用</u>

另一个需要注意的是，你有可能（有意或者无意地）创建一个函数的“间接引用”，在这种情况下，调用这个函数会应用默认绑定规则。

间接引用最容易在赋值时发生:

```javascript
function foo() {
  console.log(this.a);
}

let a = 2;
let o = {a:3, foo:foo};
let p = {a:4};

o.foo(); //3
(p.foo = o.foo)(); //2
```

赋值表达式p.foo = o.foo的返回值是目标函数的引用，因此调用位置是foo()而不是p.foo()或者o.foo()。根据我们之前说过的，这里会应用默认绑定。

Note:

对于默认绑定来说，决定this绑定对象的并不是调用位置是否处于严格模式，而是函数体是否处于严格模式。

如果函数体处于严格模式，this会被绑定到undefined，否则this会被绑定到全局对象。

<u>3. 硬绑定存在的问题及解决</u> ????!!!!

硬绑定这种方式可以把this强制绑定到指定的对象（除了使用new时），防止函数调用应用默认绑定规则。问题在于，<span style="color:blue">硬绑定会大大降低函数的灵活性，使用硬绑定之后就无法使用隐式绑定或者显式绑定来修改this</span>。

如果可以给默认绑定指定一个全局对象和undefined以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改this的能力。

可以通过一种被称为软绑定的方法来实现我们想要的效果：

```javascript
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function(obj) {
    let fn = this;
    
    //捕获所有curried函数
    let curried = [].slice.call(arguments, 1);
    let bound = function() {
      return fn.apply(!this||this===(window||global) ? obj : this, curried.concat.apply(curried, arguments));
    };
    
    bound.prototype = Object.create(fn.prototype);
    
    return bound;
  }
}
```

除了软绑定之外，softBind(..)的其他原理和ES5内置的bind(..)类似。

* 它会对指定的函数进行封装，首先检查调用时的this，如果this绑定到全局对象或者undefined，那就把指定的默认对象obj绑定到this，否则不会修改this。
* 此外，这段代码还支持可选的柯里化.

测试softBind

> 这个地方的设置还是非常优秀的应该说.
>
> 开始虽然每一句都是明白,但不能理解具体实现的功能.尤其是三元表达式哪里,其实是忽略了一个事实: this的值去取决于调用的位置. 再加上三个例子,更好的理解.

```javascript
function foo() {
  console.log('name: ' + this.name)
}

let obj = {name: 'obj'},
    obj2 = {name: 'obj2'},
    obj3 = {name: 'obj3'};

let fooOBJ = foo.softBind(obj);

fooOBJ(); //name: obj

obj2.foo = foo.softBind(obj);
obj2.foo(); //name: obj2

fooOBJ.call(obj3); //name: obj3
```



##### 箭头函数的this

箭头函数并不是使用function关键字定义的,而是使用被称为'胖箭头'的操作符`=>`定义的. 箭头函数不使用this的四种标准规则,而是根据外层(函数或全局)作用域来决定this.





##### **实例**

以函数形式调用

```javascript
var a = 1000,
    obj = {
      a: 1,
      b: this.a + 1
    };

function fun() {
  let obj = {
    a: 1,
    c: this.a + 2
  }
  return obj.c;
}

console.log(fun()); //
console.log(obj.b); //

```

```JavaScript
var x= 0;
var foo = {
    x:1,
    bar:{
        x:2,
        baz: function () {
            console. log(this.x)
        }
    }
}
var a = foo. bar. baz;
foo.bar.baz(); //2
a();  //0
简化:
foo = {x:1, bar:{}}
bar = {x:2, baz:f}
baz : f

先执行的是foo.bar.baz(); 即调用baz对应的函数
之后调用的a(),以函数形式调用,相当于window.a

```



以对象方法形式调用

```javascript
var a = 1;
var obj = {
  a: 2,
  b: function() {
    return this.a;
  }
}
var t = obj.b;
console.log(t());//
```





#### caller

ECMAScript 5 也会给函数对象上添加一个属性：caller。这个属性引用的是调用当前函数的函数，或者如果是在全局作用域中调用的则为null。

```javascript
function outer() {
	inner();
}
function inner() {
	console.log(inner.caller);
}
outer();
//以上代码会显示outer()函数的源代码。这是因为ourter()调用了inner()，inner.caller指向outer()。如果要降低耦合度，则可以通过arguments.callee.caller 来引用同样的值：

function inner() {
  console.log(arguments.callee.caller); //降低耦合度
}


```

<u>在严格模式下访问arguments.callee 会报错</u>。ECMAScript 5 也定义了arguments.caller，但在严格模式下访问它会报错，在非严格模式下则始终是undefined。这是为了分清arguments.caller和函数的caller 而故意为之的。而作为对这门语言的安全防护，这些改动也让第三方代码无法检测同一上下文中运行的其他代码。严格模式下还有一个限制，就是不能给函数的caller 属性赋值，否则会导致错误。

**实践**

> 既不是标准,也不会称为标准.  不要在生产环境中使用



#### new.target

**概述!!!**

JavaScript函数有两个不同的内部方法：**Call和Construct**

* 当通过new关键字调用函数时，执行的是[[Construct]]函数，它负责创建一个通常被称作实例的新对象，然后再执行函数体，将this绑定到实例上；具有[[Construct]]方法的函数被统称为构造函数。
* 如果不通过new关键字调用函数，则执行[[Call]]函数，从而直接执行代码中的函数体。
* 不是所有函数都有[[construct]]方法,因此不是所有函数都可以通过new来调用.例如箭头函数



**ES5 ES6判断函数是否通过new调用**

在ECMAScript 5中，如果想确定一个函数是否通过new关键字被调用（或者说，判断该函数是否作为构造函数被调用），最流行的方式是使用instanceof

```javascript
function Person(name) {
  if (this instanceof Person) {
    this.name = name; //如果通过new关键字调用;
  } else {
    throw new Error('必须通过new关键字来调用Person');
  }
}

let person = new Person('Nicholas');
let person = Person('Nicholas'); //抛出错误
```

由于[[Construct]]方法会创建一个Person的新实例，并将this绑定到新实例上，通常来讲这样做是正确的，但这个方法也不完全可靠，因为有一种不依赖new关键字的方法也可以将this绑定到Person的实例上

```javascript
function Person(name) {
  if (this instanceof Person) {
    this.name = name; 
  } else {
    throw new Error('必须通过new关键字来调用Person');
  }
}

let person = new Person('Nicholas');
let notAPerson = Person.call(person, 'Michael'); //有效
```

调用Person.call()时将变量person传入作为第一个参数，相当于在Person函数里将this设为了person实例。<u>对于函数本身，无法区分是通过Person.call()（或者是Person.apply()）还是new关键字调用得到的Person的实例。</u>

**用途**

* **为了解决判断函数是否通过new关键字调用的问题**

为了解决判断函数是否通过new关键字调用的问题，ECMAScript 6引入了new.target这个**元属性**. <u>元属性是指非对象的属性，其可以提供非对象目标的补充信息（例如new）</u>

当调用函数的[[Construct]]方法时，<u>new.target被赋值为new操作符的目标，通常是新创建对象实例，也就是函数体内this的构造函数;</u>(????)    如果调用[[Call]]方法，则new.target的值为undefined。



```javascript
function King() {
  if (!new.target) {
    throw 'King must be instantiated using "new" '
  }
  console.log('King instantiated using "new" ');
}
new King(); // King instantiated using "new"
King(); // Error: King must be instantiated using "new"


function Person(name) {
  if (typeof new.target !== 'undefined') {
    this.name = name;
  } else {
    throw new Error('必须通过new关键字来调用函数');
  }
}
let person = new Person('Nicholas');
let notAPerson = Person.call(person, 'Michael'); //抛出错误
```

* **检查new.target是否被某个特定构造函数所调用**

```javascript
function Person(name) {
  if (typeof new.target === Person) {
    this.name = naem;
  } else {
    throw new Error('必须通过new关键字来调用Person')
  }
}

function anotherPerson(name) {
  Person.call(this, name);
}

let person = new Person('Nicholas'); 
let anotherPerson = new anotherPerson('Nicholas'); //抛出错误
```

真正的调用Person.call(this, name)没有使用new关键字，因此new.target的值为undefined会抛出错误。

**注意:**  在函数外使用new.target是一个语法错误。



# 函数属性与方法

ECMAScript 中的函数是对象，因此有属性和方法。**每个函数都有两个属性：length和prototype**。其中，length 属性保存函数定义的命名参数的个数,剩余参数的加入不会影响length属性的值.

#### **属性-length**

```javascript
function sayName(name) {
	console.log(name);
}
function sum(num1, num2) {
	return num1 + num2;
}
function sayHi() {
	console.log("hi");
}
console.log(sayName.length); // 1
console.log(sum.length); // 2
console.log(sayHi.length); // 0

function sayName(name, ...obj) {
  //
}
console.log(sayName.length); //1
```



#### 属性-name

> 辨别函数就是一项具有挑战性的任务. 此外, 匿名函数表达式的广泛使用更是加大了调试的难度，开发者们经常要追踪难以解读的栈记录。为了解决这些问题，ECMAScript 6中为所有函数新增了name属性.



* 函数声明的name: 函数名称
* 匿名函数表达式的name: 变量名称
* 非匿名函数表达式的name: 函数名称权重大于变量
* 对象中的方法的name: 方法名称
* 对象中setter和getter方法的name: 'get 函数名称' 'set 函数名称'
* 通过bind()函数创建的函数的name: 'bound 函数名称'
* 通过Function构造函数创建的函数的name: 'anonymous'

```javascript
//函数声明 函数表达式
function doSomething() {
  //
}
let doAnotherThing = function() {};

console.log(doSomething.name); //doSomething
console.log(doAnotherThing.name); //doAnotherThing

//非匿名函数表达式
let doAnotherThing = function doSomething() {};
console.log(doAnotherThing.name); //doSomething

//对象方法中的name值
let person = {
  get firstName() { return 'Nicholas'},
  sayName() {console.log(this.name)}
};
console.log(person.firstName.name); //'get firstName'
console.log(person.sayName.name); //sayName

//通过bind()函数创建的函数
let doSomething = function() {};
console.log(doSomething.bind().name); //'bound doSomething'

//通过Function创建的函数
console.log((new Function()).name); //'anonymous'

//箭头函数的name
console.log((() => {}).name); //''
```

**切记**，函数name属性的值不一定引用同名变量，它只是协助调试用的额外信息，所以<u>不能使用name属性的值来获取对于函数的引用</u>。



#### **属性-prototype**

prototype 是保存引用类型所有实例方法的地方，这意味着toString()、valueOf()等方法实际上都保存在prototype 上，进而由所有实例共享。<u>在ECMAScript 5中，prototype 属性是不可枚举的，因此使用for-in 循环不会返回这个属性</u>。

### 函数的方法

#### Function.prototype.call


**define**

> the method calls a function with a given `this` value and arguments provided individually

**syntax**

```javascript
call()
call(thisArg)
call(thisArg, arg1)
call(thisArg, arg1,...,argN)
```

`thisArg` optional

* the value to use as `this` when calling `func`
* In certain cases, `thisArg` may not be the actual value seen by the method.
  * if the method is a function in [non-strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), null and undefined will be replaced with the global object, and primitive values will be converted to objects.

`arg1, ..., argN` optional

* arguments for the function

**return value**

* the result of calling the function with the specified `this` value and arguments

**desc**

* the `call()` allows for a function/method belonging to one object to be assigned and called for a different object.
* `call()` provides a new value of `this` to the function/emthod.
* With `call()` , u can write a method once and then inherit it in another object, without having to rewrite the method for the new object.





**call()方法中this值参数**

如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。

```javascript
- call方法的第一个参数,如果参数为空或null或undefined, 则默认传参全局对象.
var obj={};
var f=function(){return this};
console.log(f()===window);//log: true
console.log(f.call(obj)===obj);//log: true
console.log(f.call(null) === window); //true
console.log(f.call(undefined) === window); //true

- 如果call传参不是以上的类型,则转换成相应的包装对象,然后传入方法.例如,5转成number实例.
var f=function(){return this};
f.call(5);//log:Number {5}
```

**call()方法实例**

```javascript
//示例 mdn
1.使用call方法调用父构造函数
function Product(name,price){
  this.name = name;
  this.price = price;
}

function Food(name,price){
  Product.call(this,name,price);
  this.category = 'food';
}
function Toy(name,price){
  Product.call(this, name, price);
  this.category = 'toy';
}

let cheese = new Food('feta',5);
let fun = new Toy('robot',40);

console.log(cheese.name, cheese.price)

//使用call方法调用匿名函数
var animals = [
  { species: 'Lion', name: 'King' },
  { species: 'Whale', name: 'Fail' }
];

for(let i=0;i<animals.length;i++){
  (function(i){
    this.print=function(){
      console.log('#'+i+''+this.species+':'+this.name)
    }
  }).call(animals[i],i)
}

//使用 call 方法调用函数并且指定上下文的 'this'
function greet(){
  let reply = [this.animal, 'typically sleep between',this.sleepDuration].join('');
  console.log(reply);
}
let obj = {animal:'cats', sleepDuration:'12 and 16 hours'};
greet.call(obj); // cats typically sleep between 12 and 16 hours

//使用 call 方法调用函数并且不指定第一个参数（argument）
let sData = 'wisen';
function display(){
	console.log('sData value is %s', this.sData);//%s 相当于%string  相当于占位符作用
}
display.call(); //sData value is 

//在严格模式下，this 的值将会是 undefined
'use strict'
let sData = 'wisen';
function display(){
	console.log('sData value is %s', this.sData);   //%s 相当于%string  相当于占位符作用
}
display.call(); //can't read the property of 'sData' of undefined 
```

**实现call()方法**

> 想法: 不用管细枝末节,实现主要功能,再对参数进行判断

```javascript
Function.prototype.myCall = function() {
  let thisArg = arguments[0] || globalThis;
  thisArg.tempFn = this;
  if (arguments.length === 0) {
    return thisArg.tempFn(...[...arguments])
  }
  let result = thisArg.tempFn(...[...arguments].slice(1));  //Array.from(arguments).splice(1)
  delete thisArg.tempFn;
  return result;
}

//添加Symbol()避免变量重复
Function.prototype.myCall = function() {
  let thisArg = arguments[0] || globalThis;
  let tempFn = Symbol();
  thisArg[tempFn] =  this;
  const result = arguments.length > 1 ? thisArg[tempFn](...[...arguments].slice(1)) : thisArg[tempFn]();
  delete thisArg[tempFn];
  return result;
}

//https://juejin.cn/post/7033275515880341512#heading-44
Function.prototype.myCall = function(thisArg) {
  thisArg = thisArg || globalThis;
  thisArg.func = this;
  const args = [];
  for (let i=1; i<arguments.length; i++){
    args.push('arguments[' + i + ']');
  }
  const result = eval('thisArg.func(' + args + ')');
  delete thisArg.func;
  return result;
}


Function.prototype.myCall = function() {
  let obj = [].shift.call(arguments) || globalThis;
  obj.tempFn = this
  
  let res = obj.tempFn(...[...arguments]);
  delete obj.tempFn;
  return res;
}
```



```javascript
//推荐使用ES6的展开运算符来代替arguments   听别人说的,还没验证


Function.prototype.myCall = function(...items) {
  //items = JSON.parse(JSON.stringify(items));
  let obj = items.shift()||globalThis;
  let tmepFn = Symbol();
  obj[tempFn] = this;
  
  let res = obj[tempFn](...items);
  delete obj[tempFn];
  
  return res;
}
```



**注意事项2**

当打印添加临时属性的对象时,其结果会包含删除的临时属性,但展开后是没有删除属性的.

同时Chrome会有提示信息: "the value was evaluated upon first expanding. It may have changed since then"

英文提示即是原因,手动展开的过程其实做了<span style="color:blue">预计算</span>.

参考链接:

[CSDN](https://blog.csdn.net/yexudengzhidao/article/details/114657002)

[stackoverflow](https://stackoverflow.com/questions/23429203/weird-behavior-with-objects-console-log)

```javascript


let obj = {};
console.log(obj);
console.log(obj.a);
obj.a = 1;
```

打印结果为:

为什么obj里明明有值,打印obj.a却是undefined

![](https://img-blog.csdnimg.cn/20210311131318444.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3lleHVkZW5nemhpZGFv,size_16,color_FFFFFF,t_70)







**注意事项**2 ????

```javascript
如果这么写:
let getType = Object.prototype.toString.call;

问题:
1.getType的类型是什么  function 
2.getType可以通过加小括号来调用吗? 报错,显示getType不是一个函数

原因:
getType.name; //call

```




#### Function.prototype.apply()

**define**

> the method calls a function with a given `this` value, and `arguments` provided as an array(or an <u>array-like object</u>)

**syntax**

```javascript
apply(thisArg)
apply(thisArg, argsArray)
```

**parameters**

`thisArg`

* the value of `this` provided for the call to `func`
* Note that `this` may not be the actual value seen by the method: 
  * if the method is a function in non-strict mode code, `null` and `undefined` will be replaced with the global object, and primitive values will be boxed(原始值会被包装). 

`argsArray` optional

* an array-like object, specifying the arguments with which `func` should be called, or `null` or `undefined` if no arguments should be provided to the function.
* Starting with ECMAScript 5 these arguments can be <u>a generic array-like object</u> instaed of an array.

**return value**

* the result of calling the function with the specified `this` value and arguments

**desc**

* when the first arguments is undefined or null a similar outcome can be achieved using the array spread syntax.
* u can assign a different `this` object when calling an existing function. `this` refers to the current object(the calling object). With `apply`, u can write a method once, and then inherit it in another object, without having to rewrite the tmethod for the new object.
* With `apply`, u can also use an <u>array literal</u>. for example, `func.apply(this, ['eat', 'bananas'])`, `func.apply(this, new Array('eat', 'banans'))`
* U can also use `arguments` for the `argsArray` parameter. `arguments` is a local variable of a function. It can be used for all unspecified arguments of the called object. Thus, u don't know the arguments of the called object when u use the `apply` method.  U can use `arguments` to pass all the arguments to the called object.
* Since ECMAScript 5th Edition, u can also use any kind of object which is array-like. In practice, this means it's going to have a `length` property, and integer('index') properties in the range(0...length-1).



**examples**

Using apply to append an array to other

> U can use `push` to append an element to an array. If u pass an array to `push`, it will actually add that array as a single element.
>
> `concat` does have the desired behavior in this case, but it does not append to the existing array, it instead creates and returns a new array.
>
> So what now? a loop? surely not?

```javascript
const array = ['a', 'b'];
const elements = [0, 1, 2];
array.push.apply(array, elements)


Array.apply(null, {length: 20});
```

Using apply and built-in functions  ????

> clever usage of `apply` allows u to use built-in functions for some tasks that would probably have otherwise been written by looping over the array values
>
> 通过巧妙地使用 apply，您可以将内置函数用于某些任务，否则这些任务可能是通过循环遍历数组值来编写的。

```javascript
// min/max number in an array
const numbers = [5,6,2,3,7];

let max = Math.max.apply(null, numbers);//this about equal to Math.max(numbers[0],...)
// 其它写法
let max2 = Math.max(...numbers);

let min = Math.min.apply(null, numbers);

//vs. simple loop based algorithm
max = -Infinity, min = +Infinity;

for (let i=0; i<numbers.length; i++) {
  if (numbers[i] > max) {
    max = numbers[i]
  }
  if (numbers[i] < min) {
    min = numbers[i];
  }
}
```

But beware: by using `apply` this way, you run the risk of exceeding <u>the JavaScript engine's argument length limit.</u>

The consequences of applying a function with too many arguments(that is, more that tens of thousands of arguments) varies across engines.(应用具有太多参数（即，超过数万个参数）的函数的后果因引擎而异。) The JavaScriptCore engine has hard-coded [arguments limit of 65536.](https://bugs.webkit.org/show_bug.cgi?id=80797)

This is because the limit(and indeed, even the nature of any <u>excessively-large-stack</u> behavior) is unspecified(未规定的). Some engines will throw an exception. More perniciously(更有害的是), others will arbitrarily(任意的) limit the number of arguments actually passed to the applied function. To illustrate this latter case: if such an engine had a limit of four arguments(actual limits are of course significantly higher), it would be as if the arguments `5,6,3,2` had been passed to `apply` in the examples above, <u>rather than(而不是)</u> the full array.

If your value array might grow into the tens of thousands, use a hybrid(混合的) strategy: apply your function to chunks of the array at a time: 将数组切块后循环传入目标方法

```javascript
function minOfArray(arr) {
  let min = Infinity;
  let QUANTUM  =32768;
  
  for (let i=0; i<arr.length; i+=QUANTUM) {
    let submin = Math.min.apply(null, arr.slice(i, Math.min(i+QUANTUM, len)));
    min = Math.min(submin, min)
  }
  return min;
}

let min = minOfArray([5,6,2,3,7]);
```



Using apply to chain constructors

> U can use `apply` to chain `[constructors]`(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) for an object.

In the following example we will create a global `Function` method called `construct`, which will enable u to use an array-like object with a constructor instead of an arguments list.(使用能够在构造器中使用一个类数组对象而非参数列表)

```javascript
//使用Object.create()
Function.prototype.construct = function(aArgs) {
  let oNew = Object.create(this.prototype);
  this.apply(oNew, aArgs);
  return oNews;
}
//使用Object.__proto__
Function.prototype.construct = function(aArgs) {
  let oNew = {};
  oNew.__proto__ = this.prototype;
  this.apply(oNew, aArgs);
  return oNew;
}

//使用闭包
Function.prototype.construct = function(aArgs) {
  let fConstructor = this,
      fNewConstr = function() {
        fConstructor.apply(this, aArgs);
      }
  fNewConstr.prototype = fConstructor.prototype;
  return new fNewConstr();
}

//使用Function构造器
Function.prototype.construct = function(aArgs) {
  let fNewConstr = new Function('');
  fNewConstr.prototype = this.prototype;
  let oNew = new fNewConstr();
  this.apply(oNew, aArgs);
  return oNew;
}
```

```javascript
function MyConstructor(arguments) {
  for (let nProp = 0; nProp < arguments.length; nProp++) {
    this['property' + nProp] = arguments[nProp];
  }
}

let myArray = [4, 'hello world', false];
let myInstance = new MyConstructor(myArray); //fix MyConstructor.construct is not a function

console.log(myInstance.property1); //'hello world'
console.log(myInstance instanceof MyConstructor); //'true'
console.log(myInstance.constructor); //MyConstructor
```



**实现apply方法**

```javascript
Function.prototype.apply = function(obj) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.apply this is not a function');
  }
  let fn = obj || globalThis;
  let tempFn = Symbol();
  fn[tempFn] = this
  let res = fn.tempFn(...Array.prototype.slice.call(arguments, 1));
  delete fn.tempFn;
  return res;
  
}
```

```javascript
//https://github.com/mqyqingfeng/Blog/issues/11
Function.prototype.apply = function(obj, arr) {
  obj = Object(obj) || globalThis;
  let fn = obj;
  let tempFn = Symbol();
  fn[tempFn] = this;
  let args = [];
  for (let i=1; i<arr.length; i++) {
    args.push('arguments[' + i + ']');
  }
  return eval('fn[tempFn](' + args +')');
}
```


```js

Function.prototype.myApply = function(obj, arr) {
  obj = obj || globalThis;
  obj.tempFn = this;
  let result;
  if (!arr) {
  	result = eval('obj.tempFn()')
  } else {
    let args = [];
    for (let i=0; i<arr.length; i++) {
      args.push('arr[' + i + ']');
    }
    result = eval('obj[tempFn](' + args + ')');
  }
  
  delete obj.tempFn;
  return result;
}
```


```js
Function.prototype.apply = function(obj, arr) {
  obj = toObject(obj);
  let tempFn = Symbol();
  obj[tempFn] = this;
  let result = obj.tempFn(...arr);
  delete obj.tempFn;
  return result;
  
}

//解决基本类型数据应被转换成对象
function toObject(val) {
  const type = typeof val;
  //let result = val;
  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
      val = Object(val);
      break;
    default:
      val = obj || globalThis;
  }
  return val;
}
```


#### call()和apply()总结

> While the syntax of this function is almost identical to that of [`call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call), the fundamental difference is that `call()` accepts an **argument list**, while `apply()` accepts a **single array of arguments**.

```javascript
call() 
 - 当我们调用函数call()方法时,函数会立即执行就好像我们直接调用了函数
 - call()方法的第一个参数会自动成为函数中的this
 - call()的实参是从第二个参数一个一个传递
 

apply()
 - apply()的作用和call()方法是一样的,都可以指定函数的this
 - apply()的实参是直接传递一个数组作用于第二个参数
 - 使用apply()方法传递需要使用数组


- 使用场景:
 - es5,原型继承. 父类.call(this,属性1,属性2);
 - 第一个参数传入null或undefined时, this指向的是window.
 - 如果想直接传arguments对象或者一个数组，那就用apply()；否则，就用call()。如果不用	 给被调用的函数传参，则使用哪个方法都一样。


# this到底是谁?
 1.以函数形式调用,this是window;严格模式下this指向undefined
 2.以方法形式调用,this就是调用方法的对象
 3.以构造函数形式调用,this是新建的对象
 4.以call和apply调用,this是他们的第一个参数
```


**两者之间的区别?**
* 相同: 若第一个参数为null,则函数体内的this会指向默认的宿主对象,在浏览器中则是window,严格模式下,this还是null
* 不同: 第二个参数的形式不同

**call和apply的用途:**
* 改变函数内部的this指向: 
* 模拟bind方法
* 借用其它对象的方法
	* 第一种: 借用构造函数
	* 第二种: 类数组对象借用数组方法
```js
//改变this指向


document.getElementById(function(func) {
	return function() {
		return func.apply(document, arguments)
	}
})(document.getElementById)

let getId = document.getElementById;
let div = getId('div1')
alert(div.id) //输出: div1


// 模拟bind方法
Function.prototype.bind = function() {

	let self = this;
	let context = [].shift.call(arguments)
	argsOuter = [].slice.call(context)

	return function() {
		let argsInner = [].slice.call(arguments)
		self.apply(context, [...argsInner, ...argsOuter])
		// self.apply(context, argsInner.concat(argsOuter))
	}
}

//借用其它对象的方法

// 借用-第一种场景

	var A = function( name ){
			this.name = name;
	};

	var B = function(){
			A.apply( this, arguments );
	};

	B.prototype.getName = function(){
			return this.name;
	};

	var b = new B( 'sven' );
	console.log( b.getName() );  // 输出： 'sven'

// 借用第二种
(function(){
		Array.prototype.push.call( arguments, 3 );
		console.log ( arguments );    // 输出[1,2,3]
})( 1, 2 );
```


#### Function.prototype.bind()

**define**

> 创建一个新函数,在bind()被调用时,这个新函数的`this`被指定位`bind()`的第一个参数,而其余参数将作为新函数的参数,供调用时使用.

**syntax**

```javascript
function.bind(thisArg[, arg1[, arg2[, ...]]])
```

**parameter**

`thisArg`

* 调用绑定函数时作为`this`参数传递给目标函数的值.如果使用`new`运算符构造绑定函数,则忽略该值.
* 当使用`bind`在`setTimeout`中创建一个函数(作为回调提供)时,作为`thisArg`传递的任何原始值都将转换为`object`.
* 如果`bind`函数的参数列表为空,或者`thisArg`是`null`或`undefined`,执行作用域的`this`将被视为新函数的`thisArg`.

`arg1,arg2,...`(optional)

* 当目标函数被调用时,被预置入绑定函数的参数列表中的参数.

**return value**

* 返回一个原函数的拷贝,并拥有指定`this`值和初始参数.

**desc**
* 当调用时候,可以视为`const boundFn = (...restArgs) => fn.call(thisArg, arg1,arg2,...restArgs)`
* 绑定后的函数可以进一步用bind绑定
	* 新绑定后的函数,this值将会被忽略,因为目标函数已经绑定了this
	* 新绑定后的函数,调用后,最终还是调用的第一次绑定的函数,
	* 函数接收参数的顺序: 第一次绑定的入参,第二次绑定的入参,...,函数最后接收的入参.
* 一个绑定函数也可以使用new操作符构造，如果其目标函数是可构造的。这样做就好像目标函数已经被构造了一样。预置的参数会像往常一样提供给目标函数，而提供的this值会被忽略（因为构建准备了自己的this，如Reflect.construct的参数所示）。如果直接构造绑定函数，new.target将是目标函数。（也就是说，绑定函数对于new.target是透明的。）
* 因为绑定函数没有prototype属性,它不能当作基类来扩展
* 当绑定函数在`instanceof`右侧时,此操作符将到达目标函数(在绑定函数内存储)并读取它的`prototype`
* 绑定函数拥有以下属性:
	* length 目标函数的`length`减去要绑定参数数量(不包括thisArg参数),最小值是0.
	* name  目标函数的`name`加上'bound '前缀(有空格).
* 绑定函数也会继承目标函数的原型链.但它不会有其它目标函数属性(例如静态属性,例如目标函数是一个类)

```css
//构建函数
class Base {
	constructor(...args) {
		console.log(new.target === Base)
		console.log(args)
	}
}

const BoundBase = Base.bind(null, 1,2)

new BoundBase(3,4) //true, [1,2,3,4]


// instanceof
class Base {}
const BoundBase = Base.bind(null,1,2)
console.log(new Base() instanceof BoundBase) //true
```

**examples**

```javascript
this.x = 9;    // 在浏览器中，this 指向全局的 "window" 对象
var module = {
  x: 81,
  getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX();
// 返回 9 - 因为函数是在全局作用域中调用的

// 创建一个新函数，把 'this' 绑定到 module 对象
// 新手可能会将全局变量 x 与 module 的属性 x 混淆
var boundGetX = retrieveX.bind(module);
boundGetX(); // 81
```


 **偏函数**

`bind()` 的另一个最简单的用法是使一个函数拥有预设的初始参数。只要将这些参数（如果有的话）作为 `bind()` 的参数写在 `this` 后面。当绑定函数被调用时，这些参数会被插入到目标函数的参数列表的开始位置，传递给绑定函数的参数会跟在它们后面。

```javascript
function list() {
  return Array.prototype.slice.call(arguments);
}

function addArguments(arg1, arg2) {
    return arg1 + arg2
}

var list1 = list(1, 2, 3); // [1, 2, 3]

var result1 = addArguments(1, 2); // 3

// 创建一个函数，它拥有预设参数列表。
var leadingThirtysevenList = list.bind(null, 37);

// 创建一个函数，它拥有预设的第一个参数
var addThirtySeven = addArguments.bind(null, 37);

var list2 = leadingThirtysevenList();
// [37]

var list3 = leadingThirtysevenList(1, 2, 3);
// [37, 1, 2, 3]

var result2 = addThirtySeven(5);
// 37 + 5 = 42

var result3 = addThirtySeven(5, 10);
// 37 + 5 = 42 ，第二个参数被忽略
```

配合setTimeout

在默认情况下，使用 [`window.setTimeout()`](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout) 时，`this` 关键字会指向 [`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) （或 `global`）对象。当类的方法中需要 `this` 指向类的实例时，你可能需要显式地把 `this` 绑定到回调函数，就不会丢失该实例的引用。

```javascript
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#%E9%85%8D%E5%90%88_settimeout
```

作为构造函数使用的绑定函数

Warning: 这部分演示了 JavaScript 的能力并且记录了 `bind()` 的超前用法。以下展示的方法并不是最佳的解决方案，且可能不应该用在任何生产环境中。

```javascript
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#%E4%BD%9C%E4%B8%BA%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E4%BD%BF%E7%94%A8%E7%9A%84%E7%BB%91%E5%AE%9A%E5%87%BD%E6%95%B0
```

快捷调用

在你想要为一个需要特定的 **`this`** 值的函数创建一个捷径（shortcut）的时候，`bind()` 也很好用。

你可以用 [`Array.prototype.slice`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 来将一个类似于数组的对象（array-like object）转换成一个真正的数组，就拿它来举例子吧。你可以简单地这样写：

```javascript
let slice = Array.prototype.slice;
//...
slice.apply(arguments);
```

用 `bind()`可以使这个过程变得简单。在下面这段代码里面，`slice` 是 [`Function.prototype` (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 的 [`apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 方法的绑定函数，并且将 `Array.prototype` 的 [`slice()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 方法作为 **`this`** 的值。这意味着我们压根儿用不着上面那个 `apply()`调用了

```javascript
// 与前一段代码的 "slice" 效果相同
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.apply.bind(unboundSlice);

// ...

slice(arguments);
```


**实现bind()方法**


```javascript
//2 edition
Function.prototype.myBind = function(cxt) {
  let fn = this;
  let argsOut = [].slice.call(arguments, 1);
  return function () {
    let argsInner = [].slice.call(arguments);
    fn.apply(cxt, argsOut.concat(argsInner));
  }
}
```

```javascript
//3 edition 实现构造函数效果
//一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

Function.prototype.myBind = function(cxt) {
  let fn = this;
  let argsOut = [].slice.call(arguments, 1);
  
  let bound = function() {
    let argsInner = [].slice.call(arguments);
    //当作为构造函数使用时,this指向实例,fn指向调用绑定方法的函数.因为下面的'bound.prototype = this.prototype', 已经修改了bound.prototype为调用方法的函数的原型.此时结果为true,当结果为true时,也就是外部使用了new操作符,这时需要将内部的传递的this更改为实例本身.
    return fn.apply(this instanceof fn ? this : cxt, argsOut.concat(argsInner));
  }
  //修改返回函数的prototype为调用绑定方法函数的prototype,实例就可以继承函数的原型中的值
  bound.prototype = this.prototype;
  return bound;
}
```



```javascript
//4 edition
//避免实例通过原型链更改函数原型上的属性,使用空函数中转
Function.prototype.myBind = function(cxt) {
  let fn = this;
  let argsOut = [].slice.call(arguments, 1);
  let bound = function() {
    let argsInner = [].slice.call(arguments);
    fn.apply(this instanceof fn ? this : cxt, argsOut.concat(argsInner));
  }
  bound.prototype = this.prototype;
  return bound
}


function func() {
	console.log('this', this)
}
let obj = {a:1, b:2}

let res = new func.myBind(obj)
//直接调用会报错: 
//点运算符优先级高于new运算符,
Uncaught TypeError: Right-hand side of 'instanceof' is not callable

let res = func.myBind(obj)
let result = new res()
//
```



```javascript
//lastest edition

Function.prototype.myBind = function(cxt) {
  if (typeof this !== "function") {
  	throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
  let fn = this;
  let argsOut = [].slice.call(arguments, 1);
  let fNOP = function() {};
  let fbound = function() {
    let argsInner = [].slice.call(arguments);
    return fn.apply(this instanceof fNOP ? this : cxt, argsOut.concat(argsInner));
  }
  fNOP.prototype = this.prototype;
  fbound.prototype = new fNOP();
  return fbound;
}
```



**new和bind一起使用的问题/疑惑**

new调用和bind一起使用,会出现问题

```javascript
function func() {
  console.log('this', this)
}

new func.bind()
//Uncaught TypeError: func.bind is not a constructor  应该是对参数类型进行的判断
// typeof

new (func.bind()) //没报错 正常执行

let res = new func.myBind()
res()
//Uncaught TypeError: Right-hand side of 'instanceof' is not callable
// instanceof 左边的this打印的值是window



new func.myBind() //返回的是bound函数
new (func.myBind())() //返回的是Bound类对象
```


**来源**
[js 手动实现bind方法，超详细思路分析！ - 听风是风 - 博客园 (cnblogs.com)](https://www.cnblogs.com/echolun/p/12178655.html)   这个人写的真好!!!
[JavaScript深入之bind的模拟实现 - 掘金 (juejin.cn)](https://juejin.cn/post/6844903476623835149)








# 尾调用优化

ECMAScript 6关于函数最有趣的变化可能是尾调用系统的引擎优化. <u>尾调用指的是函数作为另一个函数的最后一条语句被调用:</u>

```javascript
function doSomething() {
  return doSomething(); //尾调用
}
```

在ECMAScript 5的引擎中，尾调用的实现与其他函数调用的实现类似：创建一个新的**栈帧（stackframe）**，将其推入调用栈来表示函数调用。也就是说，在循环调用中，每一个未用完的栈帧都会被保存在内存中，当调用栈变得过大时会造成程序问题。

#### ES6中的尾调用优化

ECMAScript 6缩减了严格模式下尾调用栈的大小（非严格模式下不受影响），如果满足以下条件，尾调用不再创建新的栈帧，而是清除并重用当前栈帧：

* 尾调用不访问当前栈帧的变量（也就是说函数不是一个闭包）
* 在函数内部，尾调用是最后一条语句
* 尾调用的结果作为函数值返回

```javascript
//以下这段示例代码满足上述的三个条件，可以被JavaScript引擎自动优化：
'use strict'
function doSomething() {
  //优化后
  return doSomethingElse();
}
```

在这个函数中，尾调用doSomethingElse()的结果立即返回，不调用任何局部作用域变量。如果做一个小改动，不返回最终结果，那么引擎就无法优化当前函数：

```javascript
'use strict'
function doSomething() {
  //无法优化 无返回
  doSomethingElse();
}
```

同样地，如果你定义了一个函数，在尾调用返回后执行其他操作，则函数也无法得到优化：

```javascript
'use strict'
function doSomething() {
  //无法优化 尾调用不在尾部
  let result = doSomethingElse();
  return result;
}
```

由于没有立即返回doSomethingElse()函数的值，因此此例中的代码无法被优化。

可能最难避免的情况是闭包的使用，它可以访问作用域中所有变量，因而导致尾调用优化失效

```javascript
'use strict'
function doSomething() {
  var num = 1,
      func = () => num;
  
  //无法优化,该函数是一个闭包
  return func();
}
```



#### 如何利用尾调用优化

实际上，尾调用的优化发生在引擎背后，除非你尝试优化一个函数，否则无须思考此类问题。<span style="text-decoration: underline wavy blue">递归函数是其最主要的应用场景，此时尾调用优化的效果最显著</span>。请看下面这个阶乘函数：

```javascript
function factorial(n) {
  if (n <= 1) {
    return 1;
  } else {
    //无法优化,必须在返回后执行乘法操作
    return n * factorial(n - 1);
  }
}
```

由于在递归调用前执行了乘法操作，因而当前版本的阶乘函数无法被引擎优化。如果n是一个非常大的数，则调用栈的尺寸就会不断增长并存在最终导致栈溢出的潜在风险。

优化这个函数，首先要确保乘法不会在函数调用后执行，你可以通过默认参数来将乘法操作移出return语句，结果函数可以携带着临时结果进入到下一个迭代中。以下这段新代码具有相同的行为，但可以被ECMAScript 6引擎优化：

```javascript
function factorial(n, p = 1) {
  if (n <= 1) {
    return 1 * p;
  } else {
    let result = n * p;
    
    //优化后
    return factorial(n - 1, result);
  }
}
```

当你写递归函数的时候，记得使用尾递归优化的特性，如果递归函数的计算量足够大，则尾递归优化可以大幅提升程序的性能。

# 函数的其它形式


## 立即调用的匿名函数(IIEF)

#### 概述

立即调用的匿名函数又被称作立即调用的函数表达式（IIFE，Immediately Invoked Function Expression）。它类似于函数声明，但由于被包含在括号中，所以会被解释为函数表达式。紧跟在第一组括号后面的第二组括号会立即调用前面的函数表达式。

使用IIFE 可以模拟块级作用域，即在一个函数表达式内部声明变量，然后立即调用这个函数。这样位于函数体作用域的变量就像是在块级作用域中一样。ECMAScript 5 尚未支持块级作用域，使用IIFE模拟块级作用域是相当普遍的。

在ECMAScript 5.1 及以前，为了防止变量定义外泄，IIFE 是个非常有效的方式。这样也不会导致闭包相关的内存问题，因为不存在对这个匿名函数的引用。为此，只要函数执行完毕，其作用域链就可以被销毁。

在ECMAScript 6 以后，IIFE 就没有那么必要了，因为块级作用域中的变量无须IIFE 就可以实现同样的隔离。下面展示了两种不同的块级作用域形式

#### 优点

优势:

1.不会污染所在作用域,不用通过函数名调用运行

#### 用法:

1.两种使用形式

2.当做函数调用并传递参数

3.倒置代码运行顺序,将需要的函数放在第二位,在IIFE执行后当做参数传递进去



```JavaScript
* 立即执行函数,在函数定义完毕后立即调用,只会调用一次
* 语法:
	(function(){语句...})() //调用括号放在里外都可以
  (function(){console.log(语句);}())
                

```



```javascript
//当做函数调用并传递参数: 基本使用
var a = 2;
(function IIFE(global) {
  var a = 3;
  console.log(a); //3
  console.log(global.a); //2
})(window);

console.log(a); //2
```



```javascript
//当做函数调用并传递参数: 解决undefined标识符的默认值被错误覆盖导致的异常

undefined = true;  //不要这么做
(function IIFE(undefined) {
  var a;
  if (a === undefined) {
    console.log('xxx');
  }
})();
```



```javascript
//倒置代码运行顺序
var a = 2;
(function IIFE(def) {
  def(window);
})(
	function def(global) {
    var a = 3;
    console.log(a); //3
    console.log(global.a); //2
  }
)
```



```JavaScript
var a = b = 10;   //等价于 var a = 10; b = 10;
　　(function(){
　　var a=b=20
　　})();
console.log(b);
代码简化:
var a = 10;
b =10;
(function(){
　　var a=20;
    b=20;
　　})();
console.log(b);//b的值开始是10,后来被立即执行函数输出的20覆盖.

var a = b = 10;
(function(){
    var b = 20;
})();
console.log(b); //10 函数作用域,函数内部声明的变量是局部变量,只能再内部访问

```



## 箭头函数

ECMAScript 6 新增了使用胖箭头（=>）语法定义函数表达式的能力。很大程度上，箭头函数实例化的函数对象与正式的函数表达式创建的函数对象行为是相同的。**任何可以使用函数表达式的地方，都可以使用箭头函数**：

#### 1. 与传统函数的差异

* **没有`this`, `super`, `arguments`, `new.target`绑定.** 箭头函数中的这些值由外围最近一层非箭头函数决定
* **不能通过`new`关键字来调用.** 箭头函数没有`[[constructor]]`方法,所以不能用作构造函数,如果通过new关键字调用箭头函数,抛出错误
* **没有原型**. 由于不可以通过new关键字调用箭头函数，因而没有构建原型的需求，所以箭头函数不存在prototype这个属性。
* **不可以改变`this`的绑定**. 函数内部的this值不可被改变，在函数的生命周期内始终保持一致。
* this值取决于外部非箭头函数的this值,且不能通过`call()`, `apply()`, `bind()`方法来改变this的值.
* **不支持`arguments`对象**. 箭头函数没有arguments绑定，所以你必须通过命名参数和不定参数这两种形式访问函数的参数。
* **不支持重复的命名参数**. 无论在严格还是非严格模式下，箭头函数都不支持重复的命名参数；而在传统函数的规定中，只有在严格模式下才不能有重复的命名参数。
* 箭头函数同样也有一个name属性,这与其他函数的规则不同.  空字符串



```javascript
//访问箭头函数的参数 替代普通函数arguments方法
let nums = (...nums) => nums;

//利用箭头函数简化立即执行函数(自执行函数)
(() => {
  console.log(1);
})()
//但是注意,使用以下这种写法会报错:
(()=>{
  console.log(1);
}())
```



#### 2. 差异的原因

> this绑定是JavaScript程序中一个常见的错误来源，在函数内很容易就对this的值失去控制，其经常导致程序出现意想不到的行为，箭头函数消除了这方面的烦恼；
>
> 其次，如果限制箭头函数的this值，简化代码执行的过程，则JavaScript引擎可以更轻松地优化这些操作，而常规函数往往同时会作为构造函数使用或者以其他方式对其进行修改。
>
> 在箭头函数内，其余的差异主要是减少错误以及理清模糊不清的地方。这样一来，JavaScript引擎就可以更好地优化箭头函数的执行过程。



#### 3. 语法

* 当箭头函数只有一个参数时，可以直接写参数名，箭头紧随其后，箭头右侧的表达式被求值后便立即返回。即使没有显式的返回语句，这个箭头函数也可以返回传入的第一个参数，不需要更多的语法铺垫。
* 如果要传入两个或两个以上的参数，要在参数的两侧添加一对小括号
* 如果函数没有参数，也要在声明的时候写一组没有内容的小括号
* 如果你希望为函数编写由多个表达式组成的更传统的函数体，那么需要用花括号包裹函数体，并显式地定义一个返回值
* 如果想创建一个空函数，需要写一对没有内容的花括号
* <span style="text-decoration-line:underline; text-decoration-color:red; text-decoration-style:double;"> 如果想在箭头函数外返回一个对象字面量，则需要将该字面量包裹在小括号里</span>

```javascript
//箭头函数简洁的语法非常适合嵌入函数的场景
let ints = [1, 2, 3];
console.log(ints.map(function(i) { return i + 1; })); // [2, 3, 4]
console.log(ints.map((i) => { return i + 1 })); // [2, 3, 4]

//如果只有一个参数，那也可以不用括号。只有没有参数，或者多个参数的情况下，才需要使用括号
// 以下两种写法都有效
let double = (x) => { return 2 * x; };
let triple = x => { return 3 * x; };
// 没有参数需要括号
let getRandom = () => { return Math.random(); };
// 多个参数需要括号
let sum = (a, b) => { return a + b; };
// 无效的写法：
let multiply = a, b => { return a * b; };

//箭头函数也可以不用大括号:使用大括号就说明包含“函数体”，可以在一个函数中包含多条语句，跟常规的函数一样。如果不使用大括号，那么箭头后面就只能有一行代码.省略大括号会隐式返回这行代码的值
// 以下两种写法都有效，而且返回相应的值
let double = (x) => { return 2 * x; };
let triple = (x) => 3 * x;
// 可以赋值
let value = {};
let setName = (x) => x.name = "Matt";
setName(value);
console.log(value.name); // "Matt"
// 无效的写法：
let multiply = (a, b) => return a * b;



//箭头函数不能使用arguments、super 和new.target，也不能用作构造函数。此外，箭头函数也没有prototype 属性。

//虽然箭头函数中没有arguments对象,但是可以在包装函数中把它提供非箭头函数 ??
function foo() {
  let bar = () => {
    console.log(arguments[0]); //5
  };
  bar();
}
foo(5);
```

#### 4. 箭头函数的this
> this永远指向函数的调用者.但在箭头函数中,this指向的是定义时所在的对象,而不是使用时所在的对象. --Javascript重难点实例精讲7.5.1

箭头函数中没有this绑定，必须通过查找作用域链来决定其值,取决于该函数外部非箭头函数的this值。如果箭头函数被非箭头函数包含，则this绑定的是最近一层非箭头函数的this；否则，this的值会被设置为undefined。且不能通过call()、apply()或bind()方法来改变this的值。

```javascript
//1st version
let pageHandler = {
  id: '123456',
  init: function() {
    document.addEventListener('click', function(event) {
      this.doSomething(event.type); //抛出错误
    }, false)
  },
  
  doSomething: function(type) {
    console.log('Handling' + type + 'for' + this.id);
  }
}

//2ed version
let pageHandler = {
  id: '123456',

  init: function() {
    document.addEventListener('click', (function(event) {
      this.doSomething(event.type);
    }).bind(this), false);
  },

  doSomething: function(type) {
    console.log('Handing' + type + 'for' + this.id);
  }
}
调用bind(this)后事实上创建了一个新函数，它的this被绑定到当前的this，也就是PageHandler。为了避免创建一个额外的函数，我们可以通过一个更好的方式来修正这段代码：使用箭头函数。

//3rd
let pageHandler = {
  id: '123456',
  
  init: function() {
    document.addEventListener('click', event => this.doSomething(event.type), false);
  },
  
  doSomething: function(type) {
    console.log('Handling' + type + ' for ' + this.id);
  }
}
```



箭头函数缺少正常函数所拥有的prototype属性，它的设计初衷是“即用即弃”，所以不能用它来定义新的类型。如果尝试通过new关键字调用一个箭头函数，会导致程序抛出错误，

```javascript
let MyType = () => {},
    object = new MyType(); //错误,不可以通过new关键字调用箭头函数
```





#### 5. 案例

```JavaScript


//箭头函数-数组排序
arr = [3, 1, 2, 4, 5, 7, 8, 9, 6];
arr.sort((a,b) => a - b); 从小到大,升序排列

//箭头函数-返回值是个对象 格式需要加括号
fn = () => {name:'孙悟空'};
alert(fn()); //返回值是undefined  原因:对象是大括号,返回值也有大括号,浏览器无法分清.

更新:
fn = () => ({name:'孙悟空'});
alert(fn()); //[object Object]



//箭头函数- this是谁
fn=()=>alert(this); 
fn(); 
//[object window] 以函数形式调用,this是window
//fn的外层作用域是全局,全局作用域的this是谁?是window.所以fn的this也是window.箭头函数没有权利设置自己的this,完全看外层作用域是谁,外层作用域是谁,this是谁.

fn=()=>alert(this);
let ojb= {
    name:'孙悟空',
    tt:fn
}
obj.tt();  //this是谁? 以方法的形式调用,应是obj.但是


fn=()=>alert(this);
let obj={
    name:'孙悟空',
    tt:fn,
    sayHello:function(){
        function inner(){ 
            alert(this); //this是谁?看inner的this是谁,看inner的调用方式:函数, 故window.
        }
        inner();
    }
}
obj.sayHello();


let obj = {
    name:'孙悟空',
    tt:fn,
    say.Hello(){
        let inner = () => alert(this);//inner的外层作用域是say.Hello,say.Hello这个函数的this是谁,是obj,那么箭头函数的this的就是obj
        inner();
    }
}
obj.sayHello();
```



```js
var foo = 'aaa';
var obj = {
  foo:'bbb',
  get:function () {
    var foo = 'ccc';
    var that = this;
    return function () {
      return that.foo
    }
  }
}


console.log(obj.get()())

var b = obj.get;
console.log(b()())

//函数的arguments参数
function fn(a,b) {
     return (...rest) => {
        console.log(argumnets)  //argumnets访问的是外层作用域的
    }
}

fn(1, 2)(3,4)
```

#### 6. 使用

**箭头函数与数组**

诸如sort()、map()及reduce()这些可以接受回调函数的数组方法，都可以通过箭头函数语法简化编码过程并减少编码量

```js
let result = values.sort(function(a, b) {
  return a - b;
})

let result = values.sort((a, b) => a - b);

```

**箭头函数没有arguments绑定**

箭头函数没有自己的arguments对象，且未来无论函数在哪个上下文中执行，**箭头函数始终可以访问外围函数的arguments对象**

```javascript
function createArrowFunctionReturningFirstArg() {
  return () => arguments[0];
}

let arrowFunction = createArrowFunctionReturningFirstArg(5);

console.log(arrowFunction()); //5
```



**箭头函数辨识方法**

使用typeof和instanceof操作符调用箭头函数与调用其他函数并无二致。

```javascript
let comparator = (a, b) => a - b;

console.log(typeof comparator); //'function'
console.log(comparator instanceof Function); //true
```

仍然可以在箭头函数上调用call()、apply()及bind()方法，但与其他函数不同的是，箭头函数的this值不会受这些方法的影响

```javascript
let sum = (num1, num2) => num1 + num2;

console.log(sum.call(null, 1, 2)); //3
console.log(sum.apply(null, [1, 2])); //3

let boundSum = sum.bind(null, 1, 2);
console.log(boundSum()); //3
```

通过call()方法和apply()方法调用sum()函数并传递参数；通过bind()方法创建boundSum()函数，并传入参数1和2。这些参数都不需要直接传入。

包括回调函数在内所有使用匿名函数表达式的地方都适合用箭头函数来改写。





# 函数的使用 ?


## 递归函数

#### 定义

> 程序调用自身时的变成技巧称为递归(recursion)

#### 实现方法

一个函数可以指向并调用自身.调用自身的函数我们称之为**递归函数**. 有三种方法可以达到这个目的:

* 函数名
* arguments.callee
* 作用域下的一个指向该函数的变量名

```js
let foo = function bar(){
  //statement
}

//在函数体内以下语句是等价的
bar()
arguments.callee() //ES5禁止在严格模式下使用此属性
foo()
```

某种意义上说，递归近似于循环。两者都重复执行相同的代码，并且两者都需要一个终止条件（避免无限循环或者无限递归）

```js
//循环
let x= 0;
while(x<10){
  x++;
}
//递归
function loop(x){
  if(x>=10) return {console.log(x)};
  return loop(x+1)
}

loop(0)
```

#### 递归中的解耦

```javascript
//阶乘 非严格模式下-arguments.callee
//在严格模式下运行的代码是不能访问arguments.callee
function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);//非严格模式下使用
  }
}

//阶乘 严格模式下(非严格模式下也可以用)-命名函数表达式
const factorial = (function f(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * f(num - 1);
  }
});
```



#### 使用

##### 阶乘

以阶乘为例

```javascript
function factorial(n) {
  if (n === 1) return n;
  return n * factorial(n - 1)
}
```

示意图(图片来自 [wwww.penjee.com](https://github.com/mqyqingfeng/Blog/issues/wwww.penjee.com))：

![](https://camo.githubusercontent.com/e7f3e971eebd1f8c6e0bd15be013506e516443ed7caeb27dc29c983bf5b1a2e9/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f726563757273696f6e2f666163746f7269616c2e676966)

##### 斐波那契数列

> 一对兔子从出生后的第3个月起，每月可生出一对小兔子。
> 编写函数，求第n个月时，兔子的对数。
>
> 斐波那契数列:1 1 2 3 5 8 13 21.....
>
> 简化: 某一项数是前两项数之和

在[《JavaScript专题之函数记忆》](https://github.com/mqyqingfeng/Blog/issues/46)中讲到过的斐波那契数列也使用了递归：

```javascript
function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
```



#### 递归条件

从这两个例子中，我们可以看出：

构成递归需具备边界条件、递归前进段和递归返回段，当边界条件不满足时，递归前进，当边界条件满足时，递归返回。阶乘中的 `n == 1` 和 斐波那契数列中的 `n < 2` 都是边界条件。

总结一下递归的特点：

1. 子问题须与原始问题为同样的事，且更为简单；
2. 不能无限制地调用本身，须有个出口，化简为非递归状况处理。



#### 执行上下文栈

在[《JavaScript深入之执行上下文栈》](https://github.com/mqyqingfeng/Blog/issues/4)中，我们知道：

当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。

试着对阶乘函数分析执行的过程，我们会发现，JavaScript 会不停的创建执行上下文压入执行上下文栈，对于内存而言，维护这么多的执行上下文也是一笔不小的开销呐！那么，我们该如何优化呢？

答案就是尾调用。

#### 尾调用

尾调用，是指函数内部的最后一个动作是函数调用。该调用的返回值，直接返回给函数。

举个例子:

```javascript
function f(x) {
  return g(x);
}
```

非尾调用:

```javascript
function f(x) {
  return g(x) + 1;
}
```

并不是尾调用，因为 g(x) 的返回值还需要跟 1 进行计算后，f(x)才会返回值。

两者又有什么区别呢？答案就是执行上下文栈的变化不一样。

为了模拟执行上下文栈的行为，让我们定义执行上下文栈是一个数组：

```
    ECStack = [];
```

我们模拟下第一个尾调用函数执行时的执行上下文栈变化：

```
// 伪代码
ECStack.push(<f> functionContext);

ECStack.pop();

ECStack.push(<g> functionContext);

ECStack.pop();
```

我们再来模拟一下第二个非尾调用函数执行时的执行上下文栈变化：

```
ECStack.push(<f> functionContext);

ECStack.push(<g> functionContext);

ECStack.pop();

ECStack.pop();
```

也就说尾调用函数执行时，虽然也调用了一个函数，但是因为原来的的函数执行完毕，执行上下文会被弹出，执行上下文栈中相当于只多压入了一个执行上下文。然而非尾调用函数，就会创建多个执行上下文压入执行上下文栈。

<u>函数调用自身，称为递归。如果尾调用自身，就称为尾递归。</u>

所以我们只用把阶乘函数改造成一个尾递归形式，就可以避免创建那么多的执行上下文。但是我们该怎么做呢？



#### 阶乘函数优化 ????

我们需要做的就是把所有用到的内部变量改写成函数的参数，以阶乘函数为例：

```javascript
function factorial(n, res) {
  if (n == 1) return res;
  return factorial(n-1, n*res);
}
```

然而这个很奇怪呐……我们计算 4 的阶乘，结果函数要传入 4 和 1，我就不能只传入一个 4 吗？

这个时候就要用到我们在[《JavaScript专题之偏函数》](https://github.com/mqyqingfeng/Blog/issues/43)中编写的 partial 函数了：

```
var newFactorial = partial(factorial, _, 1)

newFactorial(4) // 24
```



#### 应用

如果你看过 [JavaScript 专题系列](https://github.com/mqyqingfeng/Blog)的文章，你会发现递归有着很多的应用。

作为专题系列的第十八篇，我们来盘点下之前的文章中都有哪些涉及到了递归：

1.[《JavaScript 专题之数组扁平化》](https://github.com/mqyqingfeng/Blog/issues/36)：

```javascript
function flatter(arr) {
  return arr.reduce((prev, crx) => {
    return prev.concat(Array.isArray(crx) ? flatter(crx) : crx)
  },[])
}
```

2.[《JavaScript 专题之深浅拷贝》](https://github.com/mqyqingfeng/Blog/issues/32)：

```javascript
let deepCopy = function(obj) {
  if (typeof obj !== 'object') return;
  let newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}
```

3.[JavaScript 专题之从零实现 jQuery 的 extend](https://github.com/mqyqingfeng/Blog/issues/33)：

```javascript
```

4.[《JavaScript 专题之如何判断两个对象相等》](https://github.com/mqyqingfeng/Blog/issues/41)：

```javascript
```

5.[《JavaScript 专题之函数柯里化》](https://github.com/mqyqingfeng/Blog/issues/42)：

```javascript
```






## 函数变种 ?

> 暂时先用这个名字,表示函数使用的各种的变形

#### Function composition(函数组合)  //未完成

> [JavaScript function composition: What’s the big deal? (jrsinclair.com)](https://jrsinclair.com/articles/2022/javascript-function-composition-whats-the-big-deal/)

##### 概述

> Function composition  is where we take two functions , and combines them into one.
>
> That is our new function calls one function, takes the result, and passes it into another function.

```javascript
//we cal our function c2, short for 'compose two functions together'

const c2 = (funcA, funcB) => x => funcA(funcB(x));
```



##### 案例

Markdown标签转换

```javascript

//[link text goes here](http://example.com/example-url)

//![alt text goes here](/link/to/image/location.png)   

//we take a string and replace the pattern with appropriate HTML

const imagify = str = str.replace(
	/!\[([^\]"<]*)\]\(([^)<"]*)\)/g,
  '<img src="$2" alt="$1">'
)

const linkify = str = str.replace(
	/\[([^\]"<]*)\]\(([^)<"]*)\)/g,
  '<a href="$2" rel="noopener nowfollow">$1</a>'
)

const linkifyAndImagify = c2(linkify, imagify)

const linkifyAndImagify = str => linkify(imagify(str))

//For example,we counld define a bullet operator()
```




### 函数绑定

> https://zh.javascript.info/bind

当将对象方法作为回调进行传递，例如传递给 `setTimeout`，这儿会存在一个常见的问题：“丢失 `this`”。

#### 丢失的this

一旦方法被传递到与对象分开的某个地方 —— `this` 就丢失。

下面是使用 `setTimeout` 时 `this` 是如何丢失的：

```javascript
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(user.sayHi, 1000); // Hello, undefined!
```

输出没有像 `this.firstName` 那样显示 “John”，而显示了 `undefined`！

因为 `setTimeout` 获取到了函数 `user.sayHi`，但它和对象分离开了。最后一行可以被重写为：

```javascript
let f = user.sayHi;
setTimeout(f, 1000); // 丢失了 user 上下文
```

#### 解决方法1-包装器

最简单的解决方案是使用一个包装函数：

```javascript
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(function() {
  user.sayHi(); // Hello, John!
}, 1000);


//更简短
setTimeout(() => user.sayHi(), 1000); // Hello, John!
```

**代码存在的漏洞**

如果在 `setTimeout` 触发之前（有一秒的延迟！）`user` 的值改变了怎么办？那么，突然间，它将调用错误的对象！

```javascript
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(() => user.sayHi(), 1000);

// ……user 的值在不到 1 秒的时间内发生了改变
user = {
  sayHi() { alert("Another user in setTimeout!"); }
};

// Another user in setTimeout!
```

下一个解决方案保证了这样的事情不会发生。



#### 解决方案2-bind

```javascript
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

let sayHi = user.sayHi.bind(user); // (*)

// 可以在没有对象（译注：与对象分离）的情况下运行它
sayHi(); // Hello, John!

setTimeout(sayHi, 1000); // Hello, John!

// 即使 user 的值在不到 1 秒内发生了改变
// sayHi 还是会使用预先绑定（pre-bound）的值，该值是对旧的 user 对象的引用
user = {
  sayHi() { alert("Another user in setTimeout!"); }
};
```

在 `(*)` 行，我们取了方法 `user.sayHi` 并将其绑定到 `user`。`sayHi` 是一个“绑定后（bound）”的方法，它可以被单独调用，也可以被传递给 `setTimeout` —— 都没关系，函数上下文都会是正确的。

这里我们能够看到参数（arguments）都被“原样”传递了，只是 `this` 被 `bind` 绑定了：

```javascript
let user = {
  firstName: "John",
  say(phrase) {
    alert(`${phrase}, ${this.firstName}!`);
  }
};

let say = user.say.bind(user);

say("Hello"); // Hello, John!（参数 "Hello" 被传递给了 say）
say("Bye"); // Bye, John!（参数 "Bye" 被传递给了 say）
```

**便捷方法 bindAll**

如果一个对象有很多方法，并且我们都打算将它们都传递出去，那么我们可以在一个循环中完成所有方法的绑定：

```javascript
for (let key in user) {
  if (typeof user[key] == 'function') {
    user[key] = user[key].bind(user);
  }
}
```

JavaScript 库还提供了方便批量绑定的函数，例如 lodash 中的 [_.bindAll(object, methodNames)](http://lodash.com/docs#bindAll)。



#### 获取函数的调用次数

指向自身

* 变量(词法标识符)
  * 如果要从函数内部引用它自身,只使用this是不够的.一般来说你需要通过一个指向函数对象的词法标识符(变量)来引用它.
* arguments.callee
  * 已经被弃用和批判
  * 引用当前正在运行的函数对象
  * 唯一一种可以从匿名函数内部引用自身的方法
  * 更好的方式是避免使用匿名函数,至少在需要自引用时使用具名函数(表达式)



实例

获取函数的调用次数

1.词法作用域

```javascript
function foo(num) {
  console.log('foo: ' + num);
  
  data.count++;
}

let data = { count: 0};

let i;
for(i=0;i<10;i++) {
  if (i>5) {
    foo(i);
  }
}

//foo被调用了多少次
console.log(data.count);
```

2.变量

```javascript
function foo(num) {
  console.log('foo: ' + num);
  
  foo.count++;
}

foo.count = 0;
let i;
for(i=0;i<10;i++) {
  if(i>5) {
    foo(i);
  }
}

//foo被调用的次数
console.log(foo.count);
```

3.arguments.callee

```javascript
//好像无法输出匿名函数的调用次数

setTimeout((num) => {
  arguments.callee
}, 100)
```

4.this

```javascript
function foo(num) {
  console.log('foo: ' + num);
  
  this.count++;
}

foo.count = 0;
let i;
for(i=0;i<10;i++) {
  if(i>5) {
    foo.call(foo, i)
  }
}

//foo被调用的次数
console.log(count);
```






## 闭包 ???

> https://github.com/mqyqingfeng/Blog/issues/9

### 1.定义

> 一个函数和对其周围状态（**lexical environment，词法环境**）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是**闭包**（**closure**）。<u>闭包让你可以在一个内层函数中访问到其外层函数的作用域</u>。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来  ---MDN


> 闭包是指函数能记住并能持续访问其作用域外部的变量, 即使其在不同的作用域中执行完成. - <你不知道的JS>

简化: 闭包 = 函数 + 周围状态的引用

ECMAScript中，闭包指的是：

1. 从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
2. 从实践角度：以下函数才算是闭包：
   1. 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
   2. 在代码中引用了自由变量




你可以在一个函数里面嵌套另外一个函数。嵌套（内部）函数对其容器（外部）函数是私有的。它自身也形成了一个闭包。一个闭包是一个可以自己拥有独立的环境与变量的表达式（通常是函数). 嵌套函数可以”继承“容器函数的参数和变量。换句话说，内部函数包含外部函数的作用域。

由于内部函数可以访问外部函数的作用域，因此当内部函数生存周期大于外部函数时，外部函数中定义的变量和函数的生存周期将比内部函数执行时间长。当内部函数以某一种方式被任何一个外部函数作用域访问时，一个闭包就产生了

可以总结如下:

* 允许函数嵌套

- 内部函数只可以在外部函数中访问
- 内部函数形成了一个闭包：它可以访问外部函数的所有参数和变量及外部函数能访问的所有变量和函数，但是外部函数却不能使用它的参数和变量。



##### 概要

```JavaScript
- 闭包就是能访问到外部函数变量的内部函数
- 闭包可以用来将一些不愿意被别人访问的变量隐藏起来 //闭包的作用就是藏东西,暴露的东西使用返回值返回,缺点就是内存占用,可忽略
- 闭包构成要素:
 1. 必须有函数的嵌套
 2. 内部函数要引用外部函数的变量
 3. 必须将内部函数作为返回值返回  //不正确
 
 
- 闭包的生命周期
 闭包在外部函数调用时创建,调用一次产生一个
 相同对象调用,形成闭包.
 闭包在内部函数被垃圾回收时销毁.
```



```js
//https://www.zhihu.com/question/460940032

function createIncrement() {
  let count = 0;
  function increment() { 
    count++;
  }

  let message = `Count is ${count}`;
  function log() {
    console.log(message);
  }
 
  return [increment, log];
}

const [increment, log] = createIncrement();
increment(); 
increment(); 
increment(); 
log(); // 0


在①处调用 createIncrement 时，②处的 message 实际上已经创建出来了，那就相当于是字符串不变量了
把函数log写成:
function log(){
  console.log(`Count is ${count}`)
}
```

![](https://pic1.zhimg.com/80/v2-c518a99960e698edba1c3dca36e11804_720w.jpg?source=1940ef5c)







##### 保存变量

一个闭包必须保存它可见作用域中所有参数和变量。因为每一次调用传入的参数都可能不同，每一次对外部函数的调用实际上重新创建了一遍这个闭包。只有当返回的嵌套函数没有再被引用时，内存才会被释放.



##### 多层嵌套函数

函数可以被多层嵌套。例如，函数A可以包含函数B，函数B可以再包含函数C。B和C都形成了闭包，所以B可以访问A，C可以访问B和A。因此，闭包可以包含多个作用域；他们递归式的包含了所有包含它的函数作用域。这个称之为**作用域链**

```js
function A(x){
  function B(y){
    function C(z){
      console.log(x+y+z)
    }
    C(3);
  }
  B(2);
}
A(1)
```

##### 命名冲突🔸

如果一个闭包的函数定义了一个和外部函数的某个变量名称相同的变量，那么这个闭包将无法引用外部函数的这个变量.

当同一个闭包作用域下两个参数或者变量同名时，就会产生命名冲突。更近的作用域有更高的优先权，所以最近的优先级最高，最远的优先级最低。这就是作用域链。链的第一个元素就是最里面的作用域，最后一个元素便是最外层的作用域。

```js
function outside(){
  var x = 5;
  return function inside(x){
    return x*2;
  }
}
outside()(10); //20

//解析:
命名冲突发生在return x上，inside的参数x和outside变量x发生了冲突。这里的作用链域是{inside, outside, 全局对象}。因此inside的x具有最高优先权，返回了20（inside的x）而不是10（outside的x）
```





##### 案例

```JavaScript
创建一个函数,函数每次调用时,都显示它执行的叠加次数

function outer(){
    let times = 0;
    function inner(){
        times++;
        alert(times);
    }
    return inner;  //返回值是内部函数,而不是调用内部函数
}

let result = outer()
result();//outer()(); outer()()执行的是内部函数,故每次均为1;result()执行的是闭包函数,叠加

result = null; //内部函数会被垃圾回收
```






### 2.示例

让我们先写个例子，例子依然是来自《JavaScript权威指南》，稍微做点改动

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo();
```

首先我们要分析一下这段代码中执行上下文栈和执行上下文的变化情况

另一个与这段代码相似的例子，在[《JavaScript深入之执行上下文》](https://github.com/mqyqingfeng/Blog/issues/8)中有着非常详细的分析。如果看不懂以下的执行过程，建议先阅读这篇文章。

这里直接给出简要的执行过程：

1. 进入全局代码，创建全局执行上下文，全局执行上下文压入执行上下文栈
2. 全局执行上下文初始化
3. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 执行上下文被压入执行上下文栈
4. checkscope 执行上下文初始化，创建变量对象、作用域链、this等
5. checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出
6. 执行 f 函数，创建 f 函数执行上下文，f 执行上下文被压入执行上下文栈
7. f 执行上下文初始化，创建变量对象、作用域链、this等
8. f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

了解到这个过程，我们应该思考一个问题，那就是：

当 f 函数执行的时候，checkscope 函数上下文已经被销毁了啊(即从执行上下文栈中被弹出)，怎么还会读取到 checkscope 作用域下的 scope 值呢？

以上的代码，要是转换成 PHP，就会报错，因为在 PHP 中，f 函数只能读取到自己作用域和全局作用域里的值，所以读不到 checkscope 下的 scope 值。(这段我问的PHP同事……)

然而 JavaScript 却是可以的！

当我们了解了具体的执行过程后，我们知道<span style="color:red"> f 执行上下文维护了一个作用域链</span>：

```javascript
fContext = {
  Scope: [AO, checkscopeContext.AO, globalContext.VO]
}
```

对的，就是因为这个作用域链，f 函数依然可以读取到 checkscopeContext.AO 的值，说明当 f 函数引用了 checkscopeContext.AO 中的值的时候，即使 checkscopeContext 被销毁了，但是 JavaScript 依然会让 checkscopeContext.AO 活在内存中，f 函数依然可以通过 f 函数的作用域链找到它，正是因为 JavaScript 做到了这一点，从而实现了闭包这个概念。

所以，让我们再看一遍实践角度上闭包的定义：

1. 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
2. 在代码中引用了自由变量

在这里再补充一个《JavaScript权威指南》英文原版对闭包的定义:

> This combination of a function object and a scope (a set of variable bindings) in which the function’s variables are resolved is called a closure in the computer science literature.

闭包在计算机科学中也只是一个普通的概念，大家不要去想得太复杂。



### 3.练习题

```javascript
var data = [];

for (var i=0; i<3; i++) {
  data[i] = function() {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```javascript
globalContext = {
  VO: {
    data: [...],
    i: 3
  }
}
```

当执行 data[0] 函数的时候，data[0] 函数的作用域链为：

```javascript
data[0]Context = {
  Scope: [AO, globalContext.VO]
}
```

data[0]Context 的 AO 并没有 i 值，所以会从 globalContext.VO 中查找，i 为 3，所以打印的结果就是 3。

data[1] 和 data[2] 是一样的道理。

所以让我们改成闭包看看：

```javascript
var data = [];

for (var i=0; i<3; i++) {
  data[i] = (function(i) {
    return function() {
      console.log(i);
    }
  })(i);
}

data[0]();
data[1]();
data[2]();
```

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```javascript
globalContext = {
  VO: {
    data: [...],
    i: 3
  }
}
```

跟没改之前的一样.

当执行data[0]函数的时候,data[0]函数作用域链发生了改变:

```javascript
data[0]Context = {
  Scope: [AO, 匿名函数Context.AO, globalContext.VO]
}
```

匿名函数执行上下文的AO为:

```javascript
匿名函数Context = {
  AO: {
    arguments: {
      0: 0,
      length: 1
    },
    i: 0
  }
}
```

data[0]Context 的 AO 并没有 i 值，所以会沿着作用域链从匿名函数 Context.AO 中查找，这时候就会找 i 为 0，找到了就不会往 globalContext.VO 中查找了，即使 globalContext.VO 也有 i 的值(值为3)，所以打印的结果就是0



```javascript
// 牛客网 专项练习题

function test() {
    var n = 4399;
    function add(){
        n++;
        console.log(n);
    }
    return {n:n,add:add}
}
var result = test();
var result2 = test();
result.add();
result.add();
console.log(result.n);  //4399
result2.add();

// 这里{n：n}是对变量n里的值进行缓存，而不是本身n这个指针变量，这样生成add的时候n指向的值是多少{n：n}里的值就是多少 
// 没看明白说的什么 先这样
```





### 4.实例

在定时器, 事件监听器,Ajax请求,跨窗口通信,Web Works或者其他的异步(或同步)任务中,<span style="color:blue;"> 只要使用了回调函数,实际上就是在使用闭包.</span>

**IIFE模式是闭包吗?**

```javascript
var a = 2;
(function IIFE() {
  console.log(a);
})();
```

以上代码并不是严格的闭包:

* <span style="text-decoration: underline wavy">因为函数（示例代码中的IIFE）并不是在它本身的词法作用域以外执行的。它在定义时所在的作用域中执行</span>
* <span style="text-decoration: underline wavy">a是通过普通的词法作用域查找而非闭包被发现的</span>

#### 循环和闭包

```javascript
for (var i=1; i<=5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i*1000)
}
```

延迟函数的回调会在循环结束时才执行. 即使每个迭代中执行的setTimeout(..., 0), 所有的回调函数依然是在循环结束后才被执行.

**代码的问题:**

我们试图假设循环中的每个迭代在运行时都会给自己“捕获”一个i的副本。<u>但是根据作用域的工作原理，实际情况是尽管循环中的五个函数是在各个迭代中分别定义的，但是它们都被封闭在一个共享的全局作用域中，因此实际上只有一个i。</u>

**代码改进**

我们需要更多的闭包作用域，特别是在循环的过程中每个迭代都需要一个闭包作用域。

<u>1.IIFE</u>

IIFE会通过声明并立即执行一个函数来创建作用域。

```javascript
for (var i=0; i<=5; i++) {
  (setTimeout(function IIFE() {
    console.log(i);
  }, i*1000))(i)
}

for (var i=1; i<=5; i++) {
  (function(){
    setTimeout(function timer() {
      console.log(i);
    },i*1000)
  })();
}

//正确代码
for (var i=1; i<=5; i++) {
  (function() {
    var j = i;
    setTimeout(function timer() {
      console.log(j);
    }, j*1000)
  })()
}
//改进
for (var i=1; i<=5; i++) {
  (function() {
    setTimeout(function timer() {
      console.log(i);
    }, i*1000)
  })(i);
}
```

<u>2.let代替IIFE</u>

使用let声明来代替IIFE创建新的作用域

```javascript
for (var i=1; i<=5; i++) {
  let j=i; //闭包的块作用域
  setTimeout(function timer() {
    console.log(j);
  }, j*1000);
}
```

改进:

for循环头部的let声明还会有一个特殊的行为。这个行为指出变量在循环过程中不止被声明一次，每次迭代都会声明。随后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量。

```javascript
for (let i=1; i<=5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i*1000)
}
```


## 函数式编程

### 使用函数处理数组
> JS可以把函数当做对象来处理,意味着可以在JS中使用函数式编程风格.

假设有一个数值数组,我们希望计算这些数值的平均值和标准差.

**非函数风格**

```js
let data = [1,1,2,5,5]

//平均值等于所有元素之和除以元素个数
let total = 0
for (let i=0; i<data.length; i++) {
	total += data[i]
}
let mean = total/data.length //平均值为3

//标准差, 要计算每个元素相对于平均值偏差的平方总和,然后
total2 = 0
for (let i=0; i<data.length; i++) {
	let devitation = data[i] - mean
	total += deviation * deviation
}
let stddev = Math.sqrt(total/(data.length-1))
```

**数组方法**
```js
const sum = (x,y) => x + y
const square = x => x * x

let data = [1,1,2,5,5]
let mean = data.reduce(sum) / data.length
let deviations = data.map(x => x - mean)
let stddev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length - 1) )
```

**定义函数方法**
```js
const map = function(a, ...args) { return a.map(...args)}
const reduce = function(a, ...args) { return a.reduce(...args) }


const sum = (x,y) => x + y
const square = x => x * x

const data = [1,1,2,5,5]
let mean = map(data, sum) / data.length
let deviations = map(data, x => x -mean)
let stddev = Math.sqrt(reduce(map(deviations, square), sum) / (data.length - 1))
```