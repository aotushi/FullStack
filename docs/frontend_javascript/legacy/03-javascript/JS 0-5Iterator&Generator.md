---
alias: 迭代器和生成器
---


## 概述
>[迭代器和生成器 - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_generators)
>JavaScript权威指南12章


for/of循环和扩展操作符可以直接操作可迭代对象

### 关系
* **可迭代对象**指的是任何具有专用迭代器方法，且该方法返回迭代器对象的对象。
* **迭代器对象**指的是任何具有next()方法，且该方法返回迭代结果对象的对象。
* **迭代结果对象**是具有属性value和done的对象。

### 迭代一个可迭代对象
要迭代一个可迭代对象
* 1.要调用其迭代器方法获得一个迭代器对象。
* 2.重复调用这个迭代器对象的next()方法，直至返回done属性为true的迭代结果对象。
这里比较特别的地方是，可迭代对象的迭代器方法没有使用惯用名称，而是使用了符号Symbol.iterator作为名字。因此可迭代对象iterable的简单for/of循环也可以写成如下这种复杂的形式：
```js
let iterable = [99]
let iterator = iterable[Symbol.iterator]()
for (let result=iterator.next(); !result.done; result=iterator.next()) {
	console.log(result.value) // 99
}
```

### 注意
内置可迭代数据类型的迭代器对象本身也是可迭代的（也就是说，它们有一个名为Symbol.iterator的方法，返回它们自己）
在下面的代码所示的需要迭代“部分使用”的迭代器时，这种设计是有用的：
```js
let list = [1,2,3,4,5]
let iter = list[Symbol.iterator]()
let head = iter.next().value; //1
let tail = [...iter] // [2,3,4,5]
```


### 创建可迭代对象/迭代器对象/迭代结果对象
示例12-1：可迭代的数值Range类
```js

class Range {
	constructor(from,to) {
		this.from = from
		this.to = to
	}

	// 让Range对象像数值的集合一样
	has(x) { return typeof x === 'number' && this.from <= x && x <= this.to; }

  // 使用集合表示法返回当前范围的字符串表示
  toString() {
	  return `{x | ${this.from} <= x <= ${this.to}`
  }

	// 通过返回一个迭代器对象,让Range对象可迭代
	// 注意这个方法的名字是一个特殊的符号,不是字符串
	[Symbol.iterator]() {
		// 每个迭代器实例必须相互独立,互不影响地迭代自己的范围
		// 因此需要一个状态变量跟踪迭代的位置.从第一个大于等于from的整数开始
		let next = Math.ceil(this.from)
		let last = this.to
		return {
			// 这个next()方法是迭代器对象的标志
			// 它必须返回一个迭代器结果对象
			next() {
				return (next <= last) //如果没有返回last,则返回next并给它加1,否则返回表示完成的对象
					? { value: next++ }
					: { done: true }
			},
			//为了方便起见，让迭代器本身也可迭代
			[Symbol.iterator]() { return this; }
		}
	}
}


for (let x of new Range(1,10)) console.log(x) //打印数值1到10

[...new Range(-2, 2)] //[-2,-1,0,1,2]
```


### 迭代协议

迭代协议具体分为两个协议：[可迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#可迭代协议)和[迭代器协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#迭代器协议)。

### 可迭代协议

**可迭代协议**允许 JavaScript 对象定义或定制它们的迭代行为，例如，在一个 [`for..of`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of) 结构中，哪些值可以被遍历到。

#### Symbol.iterator / @@iterator

要成为**可迭代**对象， 一个对象必须实现 `**@@iterator**` 方法。这意味着对象（或者它[原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)上的某个对象）必须有一个键为 `@@iterator` 的属性，可通过常量 [`Symbol.iterator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) 访问该属性：

| 属性                  | 值                          |
| ------------------- | -------------------------- |
| `[Symbol.iterator]` | 一个无参数的函数,其返回值为一个符合迭代器协议的对象 |


### 迭代器协议
**默认Iterator接口**
只有部署了Iterator接口的数据结构才能使用for...of遍历，举例如下
```js
// 对象默认不能使用for...of循环
const obj = {
    name: 'kingx',
    age: 11
};
for (let key of obj) {
    console.log(key); // TypeError: obj[Symbol.iterator] is not a function
}
// 数组能正常使用for...of循环
const arr = ['one', 'two'];
for (let key in arr) {
    console.log(key); // 0, 1
}
```



**原生具备iterator接口的数据**(可用for of遍历): 
* Array 
* Arguments 
* Set 
* Map 
* String 
* TypeArray 
* NodeList

**自定义迭代器**
自定义一些可以使用for...of循环的数据结构，那么该怎么做呢？==需要自定义遍历数据的时候, 要想到迭代器==
方法就是为数据结构添加上Iterator接口，Iterator接口是部署在==Symbol.iterator==属性上的，它是一个函数，因此我们只需要对特定的数据结构加上Symbol.iterator属性即可。

案例: 为对象类型数据添加Iterator接口,使得它可以使用for...of循环.
```javascript
function Person(name, age) {
	this.name = name
	this.age = age
}

Person.prototype[Symbol.iterator] = function() {
	// 设置变量,记录遍历的次数
	let count = 0
	// 通过Object.keys()函数获取实例自身的所有属性
	let propArr = Object.keys(this)
	return {
		next: function() {
			if (count < propArr.length) {
				let index = count++
				return {
					value: propArr[index]
					done: false
				}
			} else {
				value: undefined
				done: true
			}
		}
	}

}
```

**ES5实现迭代器功能**
```javascript
function createIterator(items) {
  let i=0;
  return {
    next:function() {
      let done = i>= items.length;
      let value = !done ? items[i++] : undefined;
      
      return {
        done: done,
        value: value
      }
    }
  }
}

//iterator是一个迭代器对象
let iterator = createIterator([1,2,3]);

console.log(iterator.next()); // { done: false, value: 1 }
console.log(iterator.next()); // { done: false, value: 2 }
console.log(iterator.next()); // { done: false, value: 3 }
console.log(iterator.next()); // { done: true, value: undefined }
```





### for...of
ES6中增加了一种新的for...of循环，主要目的是为了统一所有数据结构的遍历方式。
除了迭代器之外，我们还需要一个可以遍历迭代器对象的方式，ES6 提供了 for of 语句，我们直接用 for of 遍历一下我们上节生成的遍历器对象试试：

```javascript
let iterator = createIterator([1,2,3]);

for(let value of iterator) {
  console.log(value);
}
```

结果报错 `TypeError: iterator is not iterable`，表明我们生成的 iterator 对象并不是 iterable(可遍历的)。

那什么才是可遍历的呢？

其实一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。

<u>ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性</u>，或者说，一个数据结构只要具有 Symbol.iterator 属性，就可以认为是"可遍历的"（iterable）。

举个例子:

```javascript
const obj = {
    value: 1
};

for (value of obj) {
    console.log(value);
}

// TypeError: iterator is not iterable
```

我们直接 for of 遍历一个对象，会报错，然而如果我们给该对象添加 Symbol.iterator 属性：

```javascript
const obj = {
  value: 1
};

obj[Symbol.iterator] = function() {
  return createIterator([1,2,3]);
}

for (value of obj) {
  console.log(value);
}
// 1
// 2
// 3
```

我们也可以发现 for of 遍历的其实是对象的 Symbol.iterator 属性。



#### 默认可遍历对象

 ES6 默认部署了 Symbol.iterator 属性，当然我们也可以手动修改这个属性：

```javascript
var colors = ["red", "green", "blue"];

colors[Symbol.iterator] = function() {
    return createIterator([1, 2, 3]);
};

for (let color of colors) {
    console.log(color);
}

// 1
// 2
// 3
```




#### 使用范围

* 数组
* Set
* Map
* 类数组对象(arguments, DOM NodeList对象)
* Generator对象
* 字符串

**数组结构使用for...of**

**Set/Map结构使用for...of循环**

**NodeList结构使用for...of循环**

**arguments对象使用for...of循环**
arguments也是一个类数组对象，同样可以使用for...of循环进行遍历

**特定函数返回值使用for...of循环**
对象类型的数据无法直接使用for...of循环进行遍历，但是我们可以借助ES6中Object对象新增的几个函数来间接地实现for...of循环
* Object.entries()[[JS Base#Object.entries()]]函数：返回一个遍历器对象，由键、值构成的对象数组。
* Object.keys()[[JS Base#Object.keys]] 函数：返回一个遍历器对象，由所有的键构成的数组。
* Object.values()[[JS Base#Object.values()]]函数：返回一个遍历器对象，由所有的值构成的数组。


#### 模拟实现for...of

模拟实现 for of 也比较简单，基本就是通过 Symbol.iterator 属性获取迭代器对象，然后使用 while 遍历一下：
```javascript
function forOf(obj, cb) {
  let iterable, result;
  if (typeof obj[Symbol.iterator] !== 'function') {
    throw new TypeError(obj + 'is not iterator')
  }
  if (typeof cb !== 'function') {
    throw new TypeError('cb must be callable')
  }
  iterable = obj[Symbol.iterator]();
  result = iterable.next();
  while(!result.done) {
    cb(result.value);
    result = iterable.next();
  }
}
```


#### for...of与forEach, for...in比较
引用: [[JS Base#for...of与forEach,for...in比较]]


### 内建迭代器
ES6 为数组、Map、Set 集合内建了以下三种迭代器：
1.entries()返回一个遍历器对象,用来遍历[键名,键值]组成的数组.对于数组,键名就是索引.
2.keys() 返回一个遍历器对象,用来遍历所有的键名.
3.values()返回一个遍历器对象,用来遍历所有的键值.


### 关闭迭代器
对于`for...of`的循环，可以由`break`, `throw continue `  或`return`终止。在这些情况下，迭代器关闭。


### 迭代器工作原理
```js
1.创建一个指针对象, 指向当前数据结构的起始位置
2.第一次调用对象的next方法,指针自动指向数据结构的第一个成员
3.接下来不断调用next方法,指针一直往后移动,直到指向最后一个成员 //会多循环一次
4.每调用next方法返回一个包含value和done属性的对象  //最后一次
```



#### 数组迭代器

```js
- 数组可以实现遍历的原因: 内部实现了迭代器iterator接口,内部有迭代器方法Symbol.iterator方法(在原型上的方法,通过浏览器可以查看到其原型上具有这个方法)
- [Symbol.iterator]()返回值类型是一个对象

const arr = ['唐僧', '孙悟空', '猪八戒', '沙僧'];
const iterator = arr[Symbol.iterator]();//在原型上有Symbol.iterator方法
console.log(iterator);//输出结果: 指针对象 Array Iterator{}

iterator.next();//log {value: '唐僧', done: false} //false表示迭代还没有结束
iterator.next();//log {value: '孙悟空', done: false}
iterator.next();//log {value: '猪八戒', done: false}
iterator.next();//log {value: '沙僧', done: false}
iterator.next();//log {value: undefined, done: true}

```



#### 迭代器自定义遍历对象

```js
- 配合浏览器报错完善函数功能
- 循环遍历的是对象里的members数组.

const team = {
    name: 'exampleName',
    members: ['a', 'b', 'c', 'd'],
    //添加迭代器方法,实现for..of功能
    [Symbol.iterator]: function(){
        //声明索引变量
        let index = 0;
        return{//TypeError:Result of Symbol.iterator method is not an object at... 
        	   //TypeError: undefined is not a function at ... //对象里需要next方法
        	next:()=>{
    			//TypeError: Iterator result undefined is not an object at ... 所以需要在next方法种也返回一个对象,对象的内容根据打印的结果来
    			//到这一步,刷新页面后,页面会一直返回undefined. 因为没有结束
    			//为了实现value遍历目标值, 需要声明一个索引/指针变量
    			//return{value:xxx, done:false};
                let result ={value: this.member[index]}
                //处理done
                if(index<this.member.length){
                    result.done = false;
                }else{
                    result.done = true;
                }
                index++;
                return result;
			}
    	}
    }
}

//this指向team.两种实现方式:箭头函数, this赋值(_this self that等)
const team = {
    name: 'exampleName',
    members: ['a', 'b', 'c', 'd'],
    [Symbol.iterator]:{
        let index = 0;
        return{
        	next:()=>{
    			let result={value:this.members[index]};
    			if(index<this.members.length){
                    result.done=false;
                }else{
                    result.done=true;
                }
    			return result;
				index++;
			}
    	}
    }
}

for(let i of team){
    console.log(i);//log结果: 
}

=======================================
const team2 = {
    name: 'exampleName',
    members: ['a', 'b', 'c', 'd']
}
for(let i of team2['members']){
    console.log(i);//log结果: a b c d
}
```


### 实现

> [迭代器和生成器 - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators#iterables)

它允许创建一个简单的范围迭代器，它定义了从开始（包括）到结束（独占）间隔步长的整数序列。 
它的最终返回值是它创建的序列的大小，由变量iterationCount跟踪。
```javascript
function makeRangeIterator(start = 0, end = Infinity, step = 1) {
    let nextIndex = start;
    let iterationCount = 0;

    const rangeIterator = {
       next: function() {
           let result;
           if (nextIndex < end) {
               result = { value: nextIndex, done: false }
               nextIndex += step;
               iterationCount++;
               return result;
           }
           return { value: iterationCount, done: true }
       }
    };
    return rangeIterator;
}
```

使用这个迭代器
```js
let it = makeRangeIterator(1, 10, 2);

let result = it.next();
while (!result.done) {
 console.log(result.value); // 1 3 5 7 9
 result = it.next();
}

console.log("Iterated over sequence of size: ", result.value); // 5
```


### 迭代器如何关闭/todo
> [JavaScript迭代器如何关闭? - 知乎](https://www.zhihu.com/question/462012759/answer/1914177301)





### iteration protocols
迭代器协议不是新的内置或语法, 这些协议可以被任意遵循一些规范的对象来实现.

有两种协议: 
* [[202301181103d1a|iterable protocol]]
* [[202301181103d1b@%|iterator protocol]]



### iterable protocol

iterable protocol允许JS对象定义或定制它们的迭代器行为, 例如以for...of构造来循环什么值.
一些内置类型是具有默认迭代行为的内置可迭代对象(built-in iterable),例如数组或映射.

为了可迭代, 一个对象必须实现`@@iterator`方法, 意味着这个对象(或者是其原型链上的对象)必须有一个带有`@@iterator`键的属性,该属性可以通过常量`Symbol.iterator`获得.

`[Symbol.iterator]`
返回一个遵循[[202301181103d1b@%|iterator protocol]]的对象,且没有参数的函数

当一个对象需要被迭代时, 它的`@@iterator`方法会被0参数调用, 返回用来获取被迭代值的迭代器.

注意当这个0参数函数被调用时, 是在可迭代对象上作为一个方法被调用. 所以在方法内部, `this`关键字用来访问可迭代对象的属性, 来决定在迭代时提供什么.

这个函数可以是一个普通函数, 或它可以是一个生成器函数, 所以当调用时, 返回一个迭代器对象. 在生成器函数内部, 每个条目(each entry)可以通过使用`yield`来提供.



### Symbol.iterator


`Symbol.iterator`静态数据属性表示指定==返回对象迭代器的方法==的已知符号. ??
如果这个属性被设置在一个对象上, 那么它是可迭代的并且能用于for...of循环和其它语法.


#### 数据属性
| 数据属性     | 值           |
| ------------ | ------------ |
| value        | `@@iterator` |
| writable     | false        |
| enumerable   | false        |
| configurable | false        |




#### 来源
带有`@@iterator`方法的内置类型:

[[202301181103d1a1a|Array.prototyep[@@iterator]()]]


### `Array.prototyep[@@iterator]()`

Array的`@@iterator`方法执行[[可迭代协议|可迭代协议]]并允许数组被绝大多数期望可迭代的语法使用,例如[[展开运算符|展开运算符]]和[[202301181103c|for...of]]循环. 

它返回一个迭代器, 其生成数组中每个索引的值.



#### 语法
```js
array[Symbol.iterator]()
```



### iterator protocol


迭代器协议定义了一个标准方式来生成一系列值(或有限或无线), 并且当生成所有值后可能返回一个值.

当一个对象带有下面语义来执行`next()`方法,那么它就是一个迭代器.

`next()` 
接受0个或1个参数并返回一个遵循`IteratorResult`接口的对象. 如果当一个内置语言的特性在使用这个迭代器并返回一个非对象值, 将会抛出一个[[202301302098a2|TypeError]]("iterator.next() returned a non-object value").

所有的迭代器方法(next(), return(), throw())都被期望返回一个执行[[202301181103d1b1@%|IteratorResult]]接口的对象. 它必须有以下属性:

`done` optional
布尔值. 如果迭代器能生成序列中的下一个值则为false(这相当不完全指定`done`属性 ???)
如果迭代器完成序列其值为true. 在这种情况下, `value`可以选择指定迭代器的返回值.

`value` optional
任意被迭代器返回的js值. 当`done`为true时会被忽略.


在实际中, 两个属性都不是必须的.如果不包含其中一个属性的对象被返回, 它相当于`{done:false, value:undefined}`.

如果一个迭代器返回包含`done:true`的结果, 任何随后调用`next()`方法都预计返回`done:true`, 尽管这在语言级别没有强制执行.

`next`方法接受一个提供给方法体的值. 内置语言特性将不会传递任何值. 传递给生成器的next方法的值将成为相应`yield`表达式的值.

可选的, 迭代器也能实现`return(value)`和`throw(exception)`方法, 当调用这些方法时,告诉迭代器调用者已经完成迭代,并可以执行任何必要的清理(例如关闭数据库连接).

`return(value)` optional
接收0或1个参数并返回一个遵循`IteratorResult`接口对象的函数, 通常`value`等于传入的`value`, `dont`等于true
调用这个方法告诉迭代器调用者不准备再调用`next()`方法并能执行任意清理操作.


`throw(exception)` optional
接收0或1个参数并返回一个遵循`IteratorResult`接口对象的函数. 尤其是`done`等于`true`. 调用这个方法告诉迭代器调用者检测到一个错误状况, 并且`exception`是一个特定的[[202301181154|Error]]实例.

让迭代器可迭代很简单: 仅执行一个`[@@iterator]()`方法并返回`this`:
```js
// Satisfies both the Iterator Protocol and Iterable
const myIterator = {
  next() {
    // ...
  },
  [Symbol.iterator]() {
    return this;
  },
};
```

这样的对象被称作可迭代的迭代器. 这样做允许一个迭代器被期望迭代的不同语法使用 - 所以, 在没有实现可迭代的情况下, 实现迭代器协议很少有用.(事实上, 几乎所有语法和APIs期望可迭代, 而不是迭代器). 生成器就是一个例子:
```js
const aGeneratorObject = (function* () {
  yield 1;
  yield 2;
  yield 3;
})();

console.log(typeof aGeneratorObject.next);
// "function" — it has a next method (which returns the right result), so it's an iterator

console.log(typeof aGeneratorObject[Symbol.iterator]);
// "function" — it has an @@iterator method (which returns the right iterator), so it's an iterable

console.log(aGeneratorObject[Symbol.iterator]() === aGeneratorObject);
// true — its @@iterator method returns itself (an iterator), so it's an iterable iterator
```





#### async iterator and async iterable



#### 语言和迭代器协议交互

所有的内置可迭代对象(因为它们的原型对象实现了`@@iterator`方法)
* String
* Array
* TypeArray
* Map
* Set
* Segments

除此之外, arguments对象和一些DOM集合类型例如NodeList也是可迭代对象. ReadableStream是到现在提笔位置唯一内置异步可迭代对象.

'Generator functions'返回一个'generator objects', 它是可迭代的迭代器. 
'Async generator functions'返回'async generator objects', 它们是异步可迭代迭代器.

从内置可迭代对象返回的迭代器实际上都继承自一个公共类(目前未公开), 该类实现了前面提到的`[Symbol.iterator](){return this;}`方法, 使它们都成为可迭代的迭代器.

奖励,这些内置的迭代器可能除了被迭代器协议需要的`next()`方法之外,还会有'helper methods'. 你可以通过在一个图形控制台中记录它来检查迭代器的原型链.



#### 接受可迭代对象的内置APIs
* Map()
* WeakMap()
* Set()
* WeakSet()
* Promise.all()
* Promise.allSettled()
* Promise.reace()
* Promise.any()
* Array.from()

#### 期望可迭代对象的语法
* for...of
* 数组和参数展开运算符
* yield*
* 数组解构


### IteratorResult


### ReadableStream

Streams API的ReadableStream接口代表byte数据的可读流. 'Fetch API'通过'Response'对象的属性'body'提供了一个ReadableStream的精确实例.

ReadableStream是一个'transferable object'



#### 来源

https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream





### 概述
Generator()函数是ES6提供的一种异步编程解决方案。


### Generator函数特征
* function关键字与函数名之间有一个星号（*）。
* 函数体内部使用yield关键字来定义不同的内部状态。

**实例**
下面的代码定义了一个简单的Generator()函数，内部包含两个状态，hello与world。
```js
function* helloworldGenerator() {
    console.log('Generator执行');
    yield 'hello';
    yield 'world';
}

const hw = helloworldGenerator();
console.log('这是测试执行先后顺序的语句');
hw.next();
```
上面代码的执行结果如下所示
```js
这是测试执行先后顺序的语句
Generator执行
```


#### yield表达式与next()关系
Generator()函数返回的是部署了Iterator接口的对象，而该对象是通过调用next()函数来遍历内部状态的，所以在没有调用下一轮next()函数时，函数处于暂停状态，而这个暂停状态就是通过yield表达式来体现的，因此Generator()函数对异步的控制是通过yield表达式来实现的
通过Iterator接口的next()函数执行过程可以看出next()函数与yield表达式的关系。
* next()函数的返回值是一个具有value和done属性的对象，next()函数调用后，如果遇到yield表达式，就会暂停后面的操作，并将yield表达式执行的结果作为value值进行返回，此时done属性的值为false。
* 当再次执行next()函数时，会再继续往下执行，直到遇到下一个yield表达式。
* 当所有的yield语句执行完毕时，会直接运行至函数末尾，如果有return语句，将return语句的表达式值作为value值返回；如果没有return语句，则value以undefined值进行返回，这两种情况下的done属性的值都为true，遍历结束。
```js
function* helloworldGenerator() {
    yield 'hello';
    yield 'world';
    return 'success';
}

const hw = helloworldGenerator();
hw.next();  // {value: "hello", done: false}
hw.next();  // {value: "world", done: false}
hw.next();  // {value: "success", done: true}
```


#### for...of与Generator
Generator()函数的返回值是一个部署了Iterator接口的对象，刚好可以使用for...of循环进行遍历，并且不需要手动调用next()函数，遍历的结果就是yield表达式的返回值。

对象类型的值在默认情况下是不能使用for...of循环进行遍历的，但是借助于Generator()函数可以实现for...of循环的遍历。
主要思路是给对象的Symbol.iterator属性设置一个Generator()函数，在Generator()函数内通过yield控制遍历的返回值。
```js
function* propGenerator() {
    let propArr = Object.keys(this);
    for (let prop of propArr) {
     // 通过yield控制每轮循环的返回值为由属性名和属性值构成的数组
        yield [prop, this[prop]];
    }
}
let obj = {
    name: 'kingx',
    age: 12
};
// 为obj对象添加Symbol.iterator属性
obj[Symbol.iterator] = propGenerator;
// 对yield的返回值
for (let [key, value] of obj) {
    console.log(key, ':', value);
}
```









## 迭代器(iterator)和生成器(generator)(未完成)????!!!!

### 0. 背景

迭代器的使用可以极大地简化数据操作，于是ECMAScript 6也向JavaScript中添加了这个迭代器特性。**新的数组方法和新的集合类型（例如Set集合与Map集合）都依赖迭代器的实现**，这个新特性对于高效的数据处理而言是不可或缺的，你也会发现在语言的其他特性中也都有迭代器的身影：**新的for-of循环、展开运算符（...），甚至连异步编程都可以使用迭代器**。

### 1. for循环的问题

```javascript
let colors = ['red', 'green', 'blue'];
for (let i = 0; i < colors.length; i++) {
  console.log(colors[i]);
}
```

虽然循环语句的语法简单，但是<u>如果将多个循环嵌套则需要追踪多个变量</u>，代码的复杂度会大大增加，一不小心就错误使用了其他for循环的跟踪变量，从而导致程序出错。<u>迭代器的出现旨在消除这种复杂性并减少循环中的错误。</u>  (要解决循环内部索引跟踪的相关问题，要解决这个问题，需要两个工具：一个是迭代器，另一个是for-of循环。如此一来，便不需要再跟踪整个集合的索引，只需关注集合中要处理的内容。)

### 2. 迭代器

迭代器是一种特殊对象，它具有一些专门为迭代过程设计的专有接口，所有的迭代器对象都有一个next()方法，每次调用都返回一个结果对象。结果对象有两个属性：一个是value，表示下一个将要返回的值；另一个是done，它是一个布尔类型的值，当没有更多可返回数据时返回true。迭代器还会保存一个内部指针，用来指向当前集合中值的位置，每调用一次next()方法，都会返回下一个可用的值。

如果在最后一个值返回后再调用next()方法，那么返回的对象中属性done的值为true，属性value则包含迭代器最终返回的值，这个返回值不是数据集的一部分，它与函数的返回值类似，是函数调用过程中最后一次给调用者传递信息的方法，如果没有相关数据则返回undefined。

用ECMAScript 5的语法创建一个迭代器

```javascript
function createIterator(items) {
  let i = 0;
  return {
    next: function() {
      let done = (i >= items.length),
          value = !done ? item[i++] : undefined;
      
      return {
        done: done,
        value: value
      };
    }
    
  }
}

let iterator = createIterator([1,2,3]);

console.log(iterator.next()); //"{value: 1, done: false}"
console.log(iterator.next()); //"{value: 2, done: false}"
console.log(iterator.next()); //"{value: 3, done: false}"
console.log(iterator.next()); //"{value: undefined, done: true}"

//之后所有的调用都会返回相同内容
console.log(iterator.next()); //"{value: undefined, done: true}"
```

在ECMAScript 6中，迭代器的编写规则也同样复杂，但ECMAScript 6同时还引入了一个生成器对象，它可以让创建迭代器对象的过程变得更简单。

### 3. 生成器

#### 0. 定义

**生成器是一种返回迭代器的函数**，通过function关键字后的星号（*）来表示，函数中会用到新的关键字yield。星号可以紧挨着function关键字，也可以在中间添加一个空格. <u>不能用箭头函数来创建生成器.</u>

```javascript
//生成器
function *createIterator() {
  yield 1;
  yield 2;
  yield 3;
}

//生成器的调用方式与普通函数相同,只不过返回的是一个迭代器
let iterator = createIterator();
console.log(iterator.next().value); //1
console.log(iterator.next().value); //2
console.log(iterator.next().value); //3
```

在这个示例中，createIterator()前的星号表明它是一个生成器；<u>yield关键字也是ECMAScript 6的新特性，可以通过它来指定调用迭代器的next()方法时的返回值及返回顺序</u>。生成迭代器后，连续3次调用它的next()方法返回3个不同的值，分别是1、2和3。

生成器的调用过程与其他函数一样，最终返回的是创建好的迭代器。

每当执行完一条yield语句后函数就会自动停止执行。举个例子，在上面这段代码中，执行完语句yield 1之后，函数便不再执行其他任何语句，直到再次调用迭代器的next()方法才会继续执行yield 2语句.

使用yield关键字可以返回任何值或表达式，所以可以通过生成器函数批量地给迭代器添加元素.例如，可以在循环中使用yield关键字：

```javascript
function *createIterator(items) {
  for (let i = 0; i < items.length; i++) {
    yield items[i];
  }
}

let iterator = createIterator([1,2,3]);
console.log(iterator.next()); //"{value: 1, done: false}"
console.log(iterator.next()); //"{value: 2, done: false}"
console.log(iterator.next()); //"{value: 3, done: false}"
console.log(iterator.next()); //"{value: undefined, done: true}"

//之后所有的调用都会返回相同内容
console.log(iterator.next()); //"{value: undefined, done: true}"
```

给生成器函数createIterator()传入一个items数组，而在函数内部，for循环不断从数组中生成新的元素放入迭代器中，每遇到一个yield语句循环都会停止；每次调用迭代器的next()方法，循环会继续运行并执行下一条yield语句。

生成器函数是ECMAScript 6中的一个重要特性，可以将其用于所有支持函数使用的地方。

#### 1. yield使用限制

yield关键字只可在生成器内部使用，在其他地方使用会导致程序抛出语法错误，即便在生成器内部的函数里使用也是如此

```javascript
function *createIterator(items) {
  items.forEach(function(item) {
    //语法错误
    yield item + 1;
  });
}
```

从字面上看，<u>yield关键字确实在createIterator()函数内部，但是它与return关键字一样，二者都不能穿透函数边界。</u>嵌套函数中的return语句不能用作外部函数的返回语句，而此处嵌套函数中的yield语句会导致程序抛出语法错误。

#### 2. 生成器函数表达式

可以通过函数表达式来创建生成器，只需在function关键字和小括号中间添加一个星号（*）即可

```javascript
let createIterator = function *(items) {
  for (let i = 0; i < items.length; i++) {
    yield items[i];
  }
};

let iterarot = createIterator([1,2,3]);
console.log(iterator.next()); //"{value: 1, done: false}"
console.log(iterator.next()); //"{value: 2, done: false}"
console.log(iterator.next()); //"{value: 3, done: false}"
console.log(iterator.next()); //"{value: undefined, done: true}"

//之后所有的调用都会返回相同内容
console.log(iterator.next()); //"{value: undefined, done: true}"
```

在这段代码中，createIterator()是一个生成器函数表达式，而不是一个函数声明。由于函数表达式是匿名的，因此星号直接放在function关键字和小括号之间。

#### 3. 生成器对象的方法

由于生成器本身就是函数，因而可以将它们添加到对象中。例如，在ECMAScript 5风格的对象字面量中，可以通过函数表达式来创建生成器

```javascript
let o = {
  createIterator: function *(items) {
    for (let i = 0; i < items.length; i++) {
      yield items[i];
    }
  }
};
let iterator = o.createIterator([1,2,3]);
```

也可以用ECMAScript 6的函数方法的简写方式来创建生成器，只需在函数名前添加一个星号（*）

```javascript
let o = {
  *createIterator(items) {
    for (let i = 0; i < items.length; i++) {
      yield items[i];
    }
  }
};
let iterator = o.createIterator([1,2,3]);
```

尽管可以在星号和方法名之间留白，但我们还是将星号紧贴在方法名之前。



### 4. 可迭代对象和for-of循环 ????!!!!

可迭代对象具有**Symbol.iterator**属性，是一种与迭代器密切相关的对象。Symbol.iterator通过指定的函数可以返回一个作用于附属对象的迭代器。在ECMAScript 6中，所有的集合对象（数组、Set集合及Map集合）和字符串都是可迭代对象，这些对象中都有默认的迭代器。

由于生成器默认会为Symbol.iterator属性赋值，因此所有通过生成器创建的迭代器都是可迭代对象。

#### 1. for-of循环

for-of循环每执行一次都会调用可迭代对象的next()方法，并将迭代器返回的结果对象的value属性存储在一个变量中，循环将持续执行这一过程直到返回对象的done属性的值为true

```javascript
let values = [1,2,3];
for (let num of values) {
  console.log(num);
}
```

这段for-of循环的代码通过调用values数组的Symbol.iterator方法来获取迭代器，这一过程是在JavaScript引擎背后完成的。随后迭代器的next()方法被多次调用，从其返回对象的value属性读取值并存储在变量num中，依次为1、2和3，当结果对象的done属性值为true时循环退出，所以num不会被赋值为undefined。

**使用场景**

如果只需迭代数组或集合中的值，用for-of循环代替for循环是个不错的选择。相比传统的for循环，for-of循环的控制条件更简单，不需要追踪复杂的条件，所以更少出错。

**注意事项**

如果将for-of语句用于**不可迭代对象、null或undefined**将会导致程序抛出错误。



#### 2. 访问默认迭代器

可以通过Symbol.iterator来访问对象默认的迭代器

```javascript
let values = [1,2,3];

let iterator = values[Symbol.iterator]();

console.log(iterator.next()); //'{value: 1, done: false}'
console.log(iterator.next()); //'{value: 2, done: false}'
console.log(iterator.next()); //'{value: 3, done: false}'
console.log(iterator.next()); //'{value: undefined, done: true}'
```

在这段代码中，通过Symbol.iterator获取了数组values的默认迭代器，并用它遍历数组中的元素。在JavaScript引擎中执行for-of循环语句时也会有类似的处理过程。

由于具有Symbol.iterator属性的对象都有默认的迭代器，因此可以用它来检测对象是否为可迭代对象：

```javascript
function isIterable(object) {
  return typeof object[Symbol.iterator] === 'function';
}

console.log(isIterat)
```

这里的isIterable()函数可以检查指定对象中是否存在默认的函数类型迭代器，而for-of循环在执行前也会做相似的检查。



#### 3. 创建可迭代对象

默认情况下，开发者定义的对象都是不可迭代对象，但如果给Symbol.iterator属性添加一个生成器，则可以将其变为可迭代对象

```javascript
let collection = {
  items: [],
  *[Symbol.iterator]() {
    for (let item of this.items) {
      yield item;
    }
  }
};

coollection.items.push(1);
coollection.items.push(2);
coollection.items.push(3);

for (let x of collection) {
  console.log(x);
}
```

在这个示例中，先创建一个生成器（注意，星号仍然在属性名前）并将其赋值给对象的Symbol.iterator属性来创建默认的迭代器；而在生成器中，通过for-of循环迭代this.items并用yield返回每一个值。



### 4. 内建迭代器 !!!!

#### 0. 背景

在ECMAScript 6中，已经默认为许多内建类型提供了内建迭代器，只有当这些内建迭代器无法实现你的目标时才需要自己创建。通常来说当你定义自己的对象和类时才会遇到这种情况. 否则，完全可以依靠内建的迭代器完成工作，而最常使用的可能是集合的那些迭代器。



#### 1. 集合对象迭代器

在ECMAScript 6中有3种类型的集合对象：数组、Map集合与Set集合。为了更好地访问对象中的内容，这3种对象都内建了以下三种迭代器：

* entries() 返回一个迭代器,其值为多个键值对
* values() 返回一个迭代器,其值为集合的值
* keys() 返回一个迭代器, 其值为集合中所有的键名

**entries()迭代器**

每次调用next()方法时，entries()迭代器都会返回一个数组，数组中的两个元素分别表示集合中每个元素的键与值。如果被遍历的对象是数组，则第一个元素是数字类型的索引；如果是Set集合，则第一个元素与第二个元素都是值（Set集合中的值被同时作为键与值使用）；如果是Map集合，则第一个元素为键名。

```javascript
let colors = ['red', 'green', 'blue'];

let tracking = new Set([1234, 5678, 9012]);
let data = new Map();

data.set('title', 'Understanding ECMAScript 6');
data.set('format', 'ebook');

for (let entry of colors.entries()) {
  console.log(entry);
}

for (let entry of tracking.entries()) {
  console.log(entry);
}

for (let entry of data.entries()) {
  console.log(entry);
}


//[0 ,'red']
//[1, 'green']
//[2, 'blue']
//[1234, 12345]
//[5678, 5678]
//[9012, 9012]
//['title', 'Understanding ECMAScript 2016']
//['format', 'ebook']
```

**values()迭代器**

调用values()迭代器时会返回集合中所存的所有值

```javascript
let colors = ['red', 'green', 'blue'];

let tracking = new Set([1234, 5678, 9012]);
let data = new Map();

data.set('title', 'Understanding ECMAScript 6');
data.set('format', 'ebook');

for (let value of colors.values()) {
  console.log(value);
}

for (let value of tracking.values()) {
  console.log(value);
}

for (let value of data.values()) {
  console.log(value);
}


//'red'
//'green'
//'blue'
//1234
//5678
//9012
//'Understanding ECMAScript 2016'
//'ebook'
```

**keys()**

keys()迭代器会返回集合中存在的每一个键。如果遍历的是数组，则会返回数字类型的键，数组本身的其他属性不会被返回；如果是Set集合，由于键与值是相同的，因此keys()和values()返回的也是相同的迭代器；如果是Map集合，则keys()迭代器会返回每个独立的键。

```javascript
let colors = ['red', 'green', 'blue'];

let tracking = new Set([1234, 5678, 9012]);
let data = new Map();

data.set('title', 'Understanding ECMAScript 6');
data.set('format', 'ebook');

for (let key of colors.keys()) {
  console.log(key);
}

for (let key of tracking.keys()) {
  console.log(key);
}

for (let key of data.keys()) {
  console.log(key);
}


//0
//1
//2
//1234
//5678
//9012
//'title'
//'format'
```

对于数组对象来说，无论是否为数组添加命名属性，打印出来的都是数字类型的索引；而for-in循环迭代的是数组属性而不是数字类型的索引

**不同集合类型的默认迭代器**

每个集合类型都有一个默认的迭代器，在for-of循环中，如果没有显式指定则使用默认的迭代器。<span style="text-decoration: underline double red">数组和Set集合的默认迭代器是values()方法，Map集合的默认迭代器是entries()方法。</span>有了这些默认的迭代器，可以更轻松地在for-of循环中使用集合对象。

```javascript
let colors = ['red', 'green', 'blue'];

let tracking = new Set([1234, 5678, 9012]);
let data = new Map();

data.set('title', 'Understanding ECMAScript 6');
data.set('format', 'ebook');

for (let value of colors) {
  console.log(value);
}

for (let value of tracking {
  console.log(value);
}

for (let entry of data.entrys()) {
  console.log(entry);
}

//'red'
//'green'
//'blue'
//1234
//5678
//9012
//['title', 'Understanding ECMAScript 6']
//['format', 'ebook']
```

WeakSet集合与WeakMap集合就没有内建的迭代器，由于要管理弱引用，因而无法确切地知道集合中存在的值，也就无法迭代这些集合了。

**解构与for-of循环**

如果要在for-of循环中使用解构语法，则可以利用Map集合默认构造函数的行为来简化编码过程

```javascript
let data = new Map();

data.set('title', 'Understanding ECMAScript 6');
data.set('format', 'ebook');

//与用data.entries()方法相同
for (let [key, value] of data) {
  console.log(key + '=' + value);
}
```

在这段代码的for-of循环语句中，将Map集合中每一个条目解构为key和value两个变量。使用这种方法后，便不再需要访问含有键和值的两元素数组，也不需要通过Map集合的内建方法取出每一个键和值。

<span style="text-decoration: underline double blue">除了Map集合外，我们也可将for-of循环中的解构方法应用于Set集合与数组</span>。



#### 2. 字符串迭代器

ECMAScript 5正式规定可以通过方括号访问字符串中的字符（也就是说，text[0]可以获取字符串text的第一个字符，并以此类推）。<u>由于方括号操作的是编码单元而非字符，因此无法正确访问双字节字符</u>.

```javascript
let msg = 'A𠮷B'
for (let i = 0; i < msg.length; i++) {
  console.log(msg[i]);
}

//'A'
//�
//�
//(空)
//(空)
//'B'


//在浏览器换种的打印失败的只有两行,不是文档中的声明的4行
```

由于双字节字符被视作两个独立的编码单元，从而最终在A与B之间打印出4个空行

ECMAScript 6的目标是全面支持Unicode，并且我们可以通过改变字符串的默认迭代器来解决这个问题，使其操作字符而不是编码单元。现在，我们修改前一个示例中字符串的默认迭代器，让for-of循环输出正确的内容.

```javascript
let msg = 'A𠮷B'
for (let str of msg) {
  console.log(str);
}
//'A'
//𠮷
//'B'
```



#### 3. NodeList迭代器

DOM标准中有一个NodeList类型，document对象中的所有元素都用这个类型来表示。

NodeList对象和数组之间的差异:

* 二者都使用length属性来表示集合中元素的数量
* 都可以通过方括号来访问集合中的独立元素；
* 在内部实现中，二者的表现非常不一致

自从ECMAScript 6添加了默认迭代器后，DOM定义中的NodeList类型（定义在HTML标准而不是ECMAScript 6标准中）也拥有了默认迭代器，其行为与数组的默认迭代器完全一致。所以可以将NodeList应用于for-of循环及其他支持对象默认迭代器的地方。

```javascript
let divs = document.getElementByTagName('div');

for (let div of divs) {
  console.log(div.id);
}
```

### 5. 展开运算符与非数组可迭代对象

**展开运算符可以操作所有可迭代对象**，并根据默认迭代器来选取要引用的值，从迭代器读取所有值。然后按照返回顺序将它们依次插入到数组中。

#### 0. 用于Set集合

```javascript
let set = new Set([1,2,3,3,3,3,4,5]),
    array = [...set];
```



#### 1. 用于Map集合

```javascript
let map = new Map([['name', 'Nicholas'],['age', 25]] ),
    array = [...map];

console.log(array);
//[['name', 'Nicholas'],['age', 25]]
```

在此示例中，展开运算符把Map集合转换成包含多个数组的数组，Map集合的默认迭代器返回的是多组键值对，所以结果数组与执行new Map()时传入的数组看起来一样。



#### 2. 数组字面量中使用多次

```javascript
let smallNumbers = [1,2,3],
    bigNumbers = [100, 101, 102],
    allNumbers = [0, ...smallNumbers, ...bigNumbers];

console.log(allNumbers.length); //7
console.log(allNumbers); //[0,1,2,3,100,101,102]
```

#### 3. 总结

由于展开运算符可以作用于任意可迭代对象，因此<u>如果想将可迭代对象转换为数组，这是最简单的方法</u>。

你既可以将字符串中的每一个字符（不是编码单元）存入新数组中，也可以将浏览器中NodeList对象中的每一个节点存入新的数组中



### 6. 高级迭代器

#### 0. 给迭代器传递参数

如果给迭代器的next()方法传递参数，则这个参数的值就会替代生成器内部上一条yield语句的返回值。而如果要实现更多像异步编程这样的高级功能，那么这种给迭代器传值的能力就变得至关重要。

```javascript
function *createIterator() {
  let first = yield 1,
      second = yield first + 2,
      yield second + 3;
}

let iterator = createIterator();
console.log(iterator.next()); //'{value: 1, done: false}'
console.log(iterator.next(4)); //'{value: 6, done: false}'
console.log(iterator.next(5)); //'{value: 8, done: false}'
console.log(iterator.next()); //'{value: undefined, done: true}'
```

这里有一个特例，**第一次调用next()方法时无论传入什么参数都会被丢弃**。由于传给next()方法的参数会替代上一次yield的返回值，而在第一次调用next()方法前不会执行任何yield语句，因此在第一次调用next()方法时传递参数是毫无意义的。



#### 1. 在迭代器中抛出错误

除了给迭代器传递数据外，还可以给它传递错误条件。通过throw()方法，当迭代器恢复执行时可令其抛出一个错误。将错误对象传给throw()方法后，在迭代器继续执行时其会被抛出。

```javascript
function *createIterator() {
  let first = yield 1,
      second = yield first + 2,
      yield second + 3; //永远不会被执行
}

let iterator = createIterator();
console.log(iterator.next()); //'{value: 1, done: false}'
console.log(iterator.next(4)); //'{value: 6, done: false}'
console.log(iterator.throw(new Error('Boom'))); //从生成器中抛出的错误
```

在这个示例中，前两个表达式正常求值，而<span style="text-decoration:underline wavy blue">调用throw()方法后，在继续执行let second求值前，错误就会被抛出并阻止了代码继续执行</span>。这个过程与直接抛出错误很相似，二者唯一的区别是抛出的时机不同。

知道调用throw()方法后生成器内部抛出错误的位置，你就可以在生成器内部通过try-catch代码块来捕获这些错误：

```javascript
function *createIterator() {
  let first = yield 1,
      second;
  try {
    second = yield first + 2;  //yield 4+2 然后抛出错误
  }catch (e) {
    second = 6;              //如果捕获到错误,则给变量second赋另外一个值
  }
  yield second + 3;
}

let iterator = createIterator()
console.log(iterator.next()); //"{value: 1, done: false}"
console.log(iterator.next(4)); //'{value: 6, done: false}'
console.log(iteartor.next(throw(new Error('Boom')))); //'{value: 9, done: false}'
console.log(iterator.next()); //'{value: undefined, done: false}'
```

try-catch代码块包裹着第二条yield语句。尽管这条语句本身没有错误，但在给变量second赋值前还是会主动抛出错误，catch代码块捕获错误后将second变量赋值为6，下一条yield语句继续执行后返回9。

调用throw()方法后也会像调用next()方法一样返回一个结果对象。由于在生成器内部捕获了这个错误，因而会继续执行下一条yield语句，最终返回数值9。

如此一来，next()和throw()就像是迭代器的两条指令，调用next()方法命令迭代器继续执行（可能提供一个值），调用throw()方法也会命令迭代器继续执行，但同时也抛出一个错误，在此之后的执行过程取决于生成器内部的代码。

在迭代器内部，如果使用了yield语句，则可以通过next()方法和throw()方法控制执行过程，当然，也可以使用return语句返回一些与普通函数返回语句不太一样的内容



#### 2. 生成器返回语句

由于生成器也是函数，因此可以通过return语句提前退出函数执行，对于最后一次next()方法调用，可以主动为其指定一个返回值。

在生成器中，return表示所有操作已经完成，属性done被设置为true；如果同时提供了相应的值，则属性value会被设置为这个值。

```javascript
function *createIterator() {
  yield 1;
  return;
  yield 2;
  yield 3;
}

let iterator = createIterator();
console.log(iterator.next()); //'{value: 1, done: false}'
console.log(iterator.next()); //'{value: undefined, done: true}'
```

return语句紧随第一条yield语句，其后的yield语句将不会被执行。

在return语句中也可以指定一个返回值，该值将被赋值给返回对象的value属性

```javascript
function *createIterator() {
  yield 1;
  return 42;
}

let iterator = createIterator();
console.log(iterator.next()); //'{value: 1, done: false}'
console.log(iterator.next()); //'{value: 42, done: true}'
console.log(iterator.next()); //'{value: undefined, done: true}'
```

通过return语句指定的返回值，只会在返回对象中出现一次，在后续调用返回的对象中，value属性会被重置为undefined。

展开运算符与for-of循环语句会直接忽略通过return语句指定的任何返回值，只要done一变为true就立即停止读取其他的值



#### 3. 委托生成器

在某些情况下，我们需要将两个迭代器合二为一，这时可以创建一个生成器，再给yield语句添加一个星号，就可以将生成数据的过程委托给其他生成器。当定义这些生成器时，只需将星号放置在关键字yield和生成器的函数名之间即可

```javascript
function *createIterator() {
  yield 1;
  yield 2;
}

function *createColorIterator() {
  yield 'red';
  yield 'green';
}

function *createCombinedIterator() {
  yield *createIterator();
  yield *createColorIterator();
  yield true;
}

let iterator = createCombinedIterator();

console.log(iterator.next()); //'{value: 1, done: false}'
console.log(iterator.next()); //'{value: 2, done: false}'
console.log(iterator.next()); //'{value: 'red', done: false}'
console.log(iterator.next()); //'{value: 'green', done: false}'
console.log(iterator.next()); //'{value: true, done: false}'

console.log(iterator.next()); //'{value: undefined, done: false}'
```

这里的生成器createCombinedIterator()先后委托了另外两个生成器create-NumberIterator()和createColorIterator()。仅根据迭代器的返回值来看，它就像是一个完整的迭代器，可以生成所有的值。直到最后由createNumberIterator()和createColorIterator()创建的迭代器无法返回更多的值，此时执行最后一条yield语句并返回true。

有了生成器委托这个新功能，你可以进一步利用生成器的返回值来处理复杂任务，例如：

```javascript
function *createNumberIterator() {
  yield 1;
  yield 2;
  return 3;
}

function *createRepeatingIterator(count) {
  for (let i=0; i<count; i++) {
    yield 'repeat';
  }
}

function *createCombinedIterator() {
  let result = yield *createNumberIterator();
  yield *createRepeatingIterator(result);
}

let iterator = createCombinedIterator();

console.log(iterator.next()); //'{value: 1, done: false}'
console.log(iterator.next()); //'{value: 2, done: false}'
console.log(iterator.next()); //'{value: 'repeat', done: false}'
console.log(iterator.next()); //'{value: 'repeat', done: false}'
console.log(iterator.next()); //'{value: 'repeat', done: false}'
console.log(iterator.next()); //'{value: 'repeat', done: false}'
console.log(iterator.next()); //'{value: undefined, done: true}'
```

在生成器createCombinedIterator()中，执行过程先被委托给了生成器createNumberIterator()，返回值会被赋值给变量result，执行到return 3时会返回数值3。这个值随后被传入createRepeatingIterator()作为它的参数，因而生成字符串"repeat"的yield语句会被执行三次。

注意，无论通过何种方式调用迭代器的next()方法，数值3永远不会被返回，它只存在于生成器createCombinedIterator()的内部。但如果想输出这个值，则可以额外添加一条yield语句，例如：

```javascript
function *createNumberIterator() {
  yield 1;
  yield 2;
  return 3;
}

function *createRepeatingIterator(count) {
  for (let i=0; i<count; i++) {
    yield 'repeat';
  }
}

function *createCombinedIterator() {
  let result = yield *createNumberIterator();
  yield result;
  yield *createRepeatingIterator(result);
}

let iterator = createCombinedIterator();
```



yield *也可直接应用于字符串，例如yield * "hello"，此时将使用字符串的默认迭代器。



### 7. 异步执行任务

由于生成器支持在函数中暂停代码执行，因而可以深入挖掘异步处理的更多用法。



#### 0. 简单任务执行器

由于执行yield语句会暂停当前函数的执行过程并等待下一次调用next()方法，因此你可以创建一个函数，在函数中调用生成器生成相应的迭代器，从而在不用回调函数的基础上实现异步调用next()方法

```javascript
function fun(taskDef) {
  //创建一个无使用限制的迭代器
  let task = taskDef();
  
  //开始执行任务
  let result = task.next();
  
  //循环调用next()的函数
  function step() {
    if (!result.done) {
      result = task.next();
      step();
    }
  }
  
  //开始迭代执行
  step();
}
```

借助这个run()函数，可以像这样执行一个包含多条yield语句的生成器

```javascript
run(function *() {
  console.log(1);
  yield;
  console.log(2);
  yield;
  console.log(3);
})
```



#### 1. 向任务执行器传递数据(未完成)

给任务执行器传递数据的最简单办法是，将值通过迭代器的next()方法传入作为yield的生成值供下次调用。

```javascript

```



#### 2. 异步任务执行器(未完成)

