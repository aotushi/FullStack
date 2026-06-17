---
alias: 数组
---


## 数组
>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#description


### 概述

* 数组是一种类列表对象，它的原型中提供了遍历和修改元素的相关操作。
* JavaScript 数组的长度和元素类型都是非固定的。因为数组的长度可随时改变，并且其数据在内存中也可以不连续，所以 JavaScript 数组不一定是密集型的，这取决于它的使用方式。一般来说，数组的这些特性会给使用带来方便，但如果这些特性不适用于你的特定使用场景的话，可以考虑使用类型数组 [`TypedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)。

* 只能用整数作为数组元素的索引，而不能用字符串。后者称为 [关联数组](https://en.wikipedia.org/wiki/Associative_array)。使用非整数并通过 [方括号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects#对象和属性) 或 [点号](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Property_Accessors) 来访问或设置数组元素时，所操作的并不是数组列表中的元素，而是数组对象的 [属性集合](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#属性) 上的变量。

* ==数组对象的属性和数组元素列表是分开存储的，并且数组的遍历和修改操作也不能作用于这些命名属性。==
* JS数组是可扩展的且可包含不同[[数据类型|数据类型]]的混合(当这些特征是不合需要的, 使用类型数组代替)
* JS数组不是[[202304101041|关联数组]]等,数组元素不能通过使用作为索引的任意字符串来访问,必须通过使用非负整数(或它们各自的字符串形式)的索引来访问.
* JS数组是零索引(zero-indexed): 数组第一个元素在索引0,以此类推,最后一个元素在数组length属性减1的位置.
* JS**数组拷贝操作**创建的是浅拷贝(shallow copies)(所有标准内建的拷贝操作)


### 关联数组

#### 来源
>https://en.wikipedia.org/wiki/Associative_array

#### 和数组比较
关联数组是一种以键/值对形式存储数据的数组。键可能是数字也可能是字符串,而数组的键(索引)必须是从0开始的正整数.


### 稀疏数组(sparse arrays) 密集数组(dense arrays)



#### 什么是稀疏数组
>包含'empty slots'的数组, 不和插槽被`undefined`填充的数组一样.

可以把稀疏数组当成包含undefined元素的非稀疏数组. 当你遍历它的时候,可以看到没有元素,JS跳过holes(空位置)

```javascript
let a = new Array(3) //[,,]
a.length //3

a[0] //undefined

a.forEach((x, i) => { console.log(i + '.' + x)}) //没有打印结果
a.map((x, i) => i) //[,,]
```



#### 密集数组

```html
//一种创建密集数组的方法 因为文章是12年的,所以了解一下即可

var a = Array.apply(null, Array(3))
console.log(a); //[undefined, undefined, undefined]

//等于
Array(undefined, undefined, undefined)
```



#### 创建

* 使用Array()构造函数创建
* 给大于当前数组length的新数组索引赋值
* 使用delete操作符创建

```javascript
let a = new Array(3) //[,,]
a.length //3

a[0] //undefined

```



#### other

> [javascript - How does Function.prototype.call.bind work? - Stack Overflow](https://stackoverflow.com/questions/11121586/how-does-function-prototype-call-bind-work)

```javascript
Array.apply(null, Array(3)).map(Function.prototype.call.bind(Number))

//相当于
Array.apply(null, Array(3)).map(Number.call(param))

//大概等于 这里有个点: map方法的回调函数并没有显式的传参(实现map方法,即可理解)
Array.apply(null, Array(3)).map(
	function(x,i,...) { return Number.call(x, i, ...) }
)
//记住'x'是调用的第一个参数且指明'this'的值.                     
```



#### 最佳实践

在实践中,用上面的方式创建密集数组会让别人难以理解你的代码.使用工具函数例如`_.range()`是更好的选择.

```javascript
_.range(3) //[0,1,2]
```

用`map`来合并,使用提供的值填充一个数组

```javascript
_.range(3).map(() => 'a')
```



#### 来源
[Sparse arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#sparse_arrays)

[JavaScript: sparse arrays vs. dense arrays (2ality.com)](https://2ality.com/2012/06/dense-arrays.html)






### 数组特点

* 数组是值的有序集合,其中的值叫做*元素*,每个元素有一个数值表示的位置,叫做*索引*.
* JS数组是无类型限制的,即数组中的元素可以是任意类型
* JS数组是基于零且使用32位数值索引的,第一个元素的索引是0,最大可能的索引是 `4 294 967 294 (2**32 - 2)`,即数组最大包含`4 294 967 295(2**32`个元素. 
* JS数组是动态的,按需增大或缩小,无需再大小变化时重新为它们分配内存空间
* JS数组可以是稀疏的,即元素不一定具有连续的索引,中间也可能有间隙.
* 每个JS数组都有一个length属性. 
  * 对稀疏数组, length大于所有元素的最高索引
  * 对非稀疏数组, length属性保存数组中元素的个数
* ES6新增定型数组(typed array).具有固定的长度和固定的元素类型.其具有极高性能,支持对二进制数据的字节级访问. ????


### 数组索引
* 数组对象不能使用任意字符串作为元素索引(如关联数组中)但必须使用非负整数(或它们各自字符串形式).
* 通过非整数设置或访问将不会设置或检索数组列表自身的元素,将会设置或访问一个与**数组的对象属性集合(object property collection)**相关的一个变量.
* 数组的**对象属性**和数组**元素列表**是分离的,并且数组的==遍历和更新==操作不能应用到命名的属性上.
* 按下面方式尝试访问数组元素会抛出语法错误.因为属性名称是不合法的.  `console.log(arr.0) //a syntax error`
* JS语法要求使用括号标识代替点标识来访问属性.也可以引用数组索引（例如，年份`['2']`而不是年份`[2]`），尽管通常不是必需的。
* `year[2]`中的2会通过JS引擎的隐式`toString`转换强制转换为字符串. 作为结果`2`和`02`在`year`对象上将引用不同的插槽.
* 只有`year[2]`是真正的数组索引,`year[02]`是一个在数组迭代中不会被访问的任意字符串属性



### 长度和数字属性关系

当设置一个合法的数组索引属性,且这个属性在数组边界之外,JS引擎将更新数组的`length`属性

```js
const fruits = [];
fruits.push("banana", "apple", "peach");
console.log(fruits.length); // 3


fruits[5] = "mango";
console.log(fruits[5]); // 'mango'
console.log(Object.keys(fruits)); // ['0', '1', '2', '5']
console.log(fruits.length); // 6


//Increasing the length.
fruits[5] = "mango";
console.log(fruits[5]); // 'mango'
console.log(Object.keys(fruits)); // ['0', '1', '2', '5']
console.log(fruits.length); // 6


//Decreasing the length property does, however, delete elements.
fruits.length = 2;
console.log(Object.keys(fruits)); // ['0', '1']
console.log(fruits.length); // 2
```



### 数组方法和空插槽

[[202304101356|稀疏数组]](sparse array)中的空插槽行为在数组之间是不一致的. 
通常来说,较老的方法将跳过空插槽,而新的方法将插槽作为`undefined`.

在遍历多个元素的方法之中,以下方法在访问索引之前会执行`in`检查,并且不会用`undefined`合并空插槽.

- [`concat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
- [`copyWithin()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)
- [`every()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- [`filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [`flat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
- [`flatMap()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
- [`forEach()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [`indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
- [`lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)
- [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [`reduceRight()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)
- [`reverse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
- [`slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
- [`some()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
- [`sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [`splice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)


如下方法对空插槽就像它们是`undefined`一样.
- [`entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries)
- [`fill()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)
- [`find()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- [`findIndex()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
- [`findLast()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast)
- [`findLastIndex()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex)
- [`group()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group) Experimental
- [`groupToMap()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupToMap) Experimental
- [`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
- [`join()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
- [`keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)
- [`toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)
- [`values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values)

### 复制方法和变更方法
一些方法调用时不会更改存在的谁说,相反会返回一个新数组.首先通过构造一个新数组并填充元素. 复制总是发生在浅层(浅拷贝), 这些方法永远不会拷贝初始化数组之外的任何东西.原始数组的元素(Elements)拷贝进新数组.通过区分对象数据和原始数据两种形式进行分别拷贝.

以下方法通过访问`this.constructor[Symbol.species]`来确定使用的构造函数来创建数组:
- [`concat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
- [`filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [`flat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
- [`flatMap()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
- [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
- [`splice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) (to construct the array of removed elements that's returned)

下面的方法总是用基于`Array`构造函数创建新数组:
- [`toReversed()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed)
- [`toSorted()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)
- [`toSpliced()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced)
- [`with()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with)


以下表格列举了更改原始数组的方法,和对应的不更改数组的方法.

| 更改的方法     | 对应的非更改的方法 |
| -------------- | ------------------ |
| copyWith()     | 无                 |
| fill()         | 无                 |
| pop()          | slice(0,-1)        |
| push(v1,v2)    | concat(v1,v2)      |
| reverse()      | toReversed()       |
| shift()        | slice(1)           |
| sort()         | toSorted()         |
| splice()       | toSpliced()        |
| unshift(v1,v2) | toSpliced(v1,v2)   |

将一个改变的方法转换为可选的非改变方法的简单方式是使用[[展开运算符|展开运算符]]或slice()来首先创建一个拷贝.



### 迭代的方法
很多数组的方法那一个回调函数当做一个参数. 这个回调函数按顺序调用并为数组中每个元素最多调用一次,回调函数的返回值用来确定方法的返回值.它们共用相同的共识:
```js
method(callbackFn, thisArg)
```

`callbackFn`拥有3个参数:
* element 数组中正在处理的当前元素
* index   数组中正在处理的当前元素的索引
* array   调用该方法的数组

`callbackFn`预计的返回值依赖于被调用的数组方法.
当调用`callbackFn`时,`thisArg`参数(默认是`undefined`)将被用作`this`值.
`callbackFn`最终观察到的`this`值根据通常的规则(this 缺)来决定:
如果`callbackFn`是non-strict:
* 原始this值会被包装成对象
* `undefined/null`会被globalThis(缺了)替换
* `thisArg`与任何使用箭头函数定义的`callbackFn`无关,因为箭头函数没有自己的this绑定

所有的iterative 方法都是复制方法和原生方法,尽管它们对空插槽的行为不同.

以下是可迭代方法:
- [`every()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- [`filter()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [`find()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
- [`findIndex()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
- [`findLast()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast)
- [`findLastIndex()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex)
- [`flatMap()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
- [`forEach()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [`group()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group)
- [`groupToMap()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupToMap)
- [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`some()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)

值得一提的是, every/some/find/finedIndex/finedLast/findLastIndex不总是在每个元素上调用`callbackFn`,一旦返回值确定它们会停止迭代.
reduce/reduceRight和通常迭代方法不同,它们不接受thisArg
sort方法也接受一个回调函数,但是它不是一个可迭代方法.



### 原生数组方法
数组方法总是原生的,它们不能访问数组对象的任意内部数据. 它们只能通过`length`属性和索引元素(也就是索引)访问数组元素. 这意味着数组方法在类数组对象也同样可以被调用.


### length属性规范化

`length`属性转换成整数然后限制其范围在0到2<sup>53</sup>-1. 
`NaN`变成0, 所以即使length属性不存在或为undefined, 它表现的就像它的值为0一样.
JS避免设置length属性为一个[不安全的整数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER).
如果长度设为大于2<sup>53</sup>-1的数字,所有内建的方法将抛出一个[[202301302098a2|TypeError]].
然而,因为数组的length属性如果被设置为大于2<sup>32</sup>会抛出一个错误,安全整数的阈值通常不会达到,除非在一个非数组对象中调用这个方法.

```js
Array.prototype.flat.call({}) //[]
```

一些数组方法设置数组对象的length属性. 它们通常在规范化之后设置这个值,所以length通常以一个整数结束.  ???
```js
const a = { length: 0.7 };
Array.prototype.push.call(a);
console.log(a.length); // 0
```






### 类数组(array-like)对象



### 问题

#### JS中关联数组和索引数组的区别
**内部数据类型不同**
关联数组内部使用键/值对来存储数据，其中“键”是一个字符串或者数字，而“值”可以是任何 JavaScript 数据类型。数组则是使用数字作为索引来存储数据，它们不需要明确的“键”和“值”类型。

**遍历方式不同**
关联数组可以使用 for-in 循环遍历，因为它的键都是字符串或者数字。而数组则通常使用 for 或者 forEach 循环遍历。

**数组具有内置方法**
在 JavaScript 中，数组具有大量的内置方法（如 push、pop、splice、shift 等），这些方法可以方便地对数组进行操作。关联数组则没有这些内置方法，但是可以通过 JavaScript 对象方法（如 Object.keys、Object.values、Object.entries 等）来实现一些类似的操作。

**存储方式不同**
关联数组使用具有唯一身份的“键”来存储数据，这些键可以是字符串或者数字，并且用于访问和修改存储在数组中的“值”。而数组则是使用数字索引来存储和访问数组中的元素。也就是说，关联数组可以视为对象的特殊形式，而通常的 JavaScript 数组则是数字索引的标号元素集合。

关联数组和数组都是 JavaScript 中用于表示集合的方式，各有其优点和应用场景。如果你需要使用唯一身份的“键”来存储数据，则关联数组是更好的选择。但如果你需要使用数字索引来存储和访问数据，则数组是更常用的方式。



#### 为什么数组最大索引是2<sup>32</sup>-2 ?

为什么JS数组索引最大是`4 294 967 294`, 而不是`4 294 967 295`?

> [Why is a JavaScript Array index at most 4294967294 but not 4294967295? - Stack Overflow](https://stackoverflow.com/questions/12766422/why-is-a-javascript-array-index-at-most-4294967294-but-not-4294967295)
>
> 数组长度是32位整数.所以数组长度可以从`0`到`Math.pow(2, 32) - 1` ,也就是`4 294 967 295`  ???
>
> 数组长度`n`表明其范围是从`0`到`n-1`. 所以JS数组最大的索引是`(Math.pow(2, 32)-1) - 1)` 或 `Math.pow(2, 32) - 2`, 也就是`4 294 967 294`.
>
> 所以JS数组可以包含最大`4 294 967 295`个元素,而不是`2 294 967 296`个元素.

```js
# 数组Array    //A大写,是一个类,首字母需要大写
 * 数组也是一个对象    //对象主要是用来存储对象的
 * 数组用来存储有序的数据   //Object对象中存储的数据是无序的
 * 数组中存储的数据成为 元素(element)
 * 数组中每一个元素都有一个唯一的序号,这个序号被称为 索引(index)
 * 索引是一组从0开始的整数
 * 使用typeof检查数组时,返回的是 'object'

```





#### 空位empty和undefined的区别

> https://juejin.cn/post/6844904025993773063#heading-14

**介绍**
数组的空位是指数组中某些索引位置没有任何值.通常发生在直接给一个数组的非连续索引赋值时.



**ES5和ES6的不同表现**
- ES5 对空位的处理，就非常不一致，大多数情况下会忽略空位
	* `forEach()`, `filter()`, `reduce()`, `every()` 和 `some()` 都会跳过空位。
	* `map()` 会跳过空位，但会保留这个值。
	* `join()` 和 `toString()` 会将空位视为 `undefined`，而 `undefined` 和 `null` 会被处理成空字符串。

* ES6 则是明确将空位转为`undefined`
	* `entries()`、`keys()`、`values()`、`find()`和 `findIndex()` 会将空位处理成 `undefined`。
	* `for...of` 循环会遍历空位。
	* `fill()` 会将空位视为正常的数组位置。
	* `copyWithin()` 会连空位一起拷贝。
	* 展开运算符（`...`）也会将空位转为 `undefined`。
	* `Array.from` 方法会将数组的空位，转为 `undefined`。

**最佳实践**
注意 由于行为不一致和存在性能隐患，因此实践中要避免使用数组空位。如果确实需要空位，则可以显式地用undefined 值代替。

```js
//ES5 的方法则会忽略这个空位，但具体的行为也会因方法而异：

const options = [1,,,,5];
// map()会跳过空位置
console.log(options.map(() => 6)); // [6, empty*3, 6]
// join()视空位置为空字符串
console.log(options.join('-')); // "1----5"


//ES6
const a = Array.from([,,,]); // 使用ES6 的Array.from()创建的包含3 个空位的数组
for (const val of a) {
  alert(val === undefined);
}
// true
// true
// true
alert(Array.of(...[,,,])); // [undefined, undefined, undefined]
for (const [index, value] of options.entries()) {
  alert(value);
}
// 1
// undefined
// undefined
// undefined
// 5


//其他
const options = [1,,,,5];
for (const option of options) {
  console.log(option === undefined);
}
// false
// true
// true
// true
// false
```





#### 字符串索引和数值索引比较

```markdown
https://www.cnblogs.com/goloving/p/9180588.html
```

**结论**

1. **Javascript数组下标值的范围为0到2的32次方**
2. **对于任意给定的数字下标值，如果不在此范围内，js会将它转换为一个字符串，并将该下标对应的值作为该数组对象的一个属性值而不是数组元素，例如array[-1] = "yes" 其实就相当于给array对象添加了一个名为-1的属性，属性值为yes。**

```js
let arr = [];
arr['a'] = 'ahh';
arr['b'] = 'banner';
arr['c'] = 'cyx';
console.log(arr.length); //0
```



#### 值为null或undefined

如果数组中属性值含有null或undefined, 那么调用toLocaleString(),join(),toString(),<del>valueOf()</del>方法时, 返回的结果中以空字符串表示.

```javascript
let arr = [null, undefined, 1];

//浏览器环境下
console.log(arr.toLocaleString()); //',,1'
console.log(arr.join('')); //'1'
console.log(arr.join()); //',,1'
console.log(arr.toString()); //',,1'
console.log(arr.valueOf()); //[null, undefined, 1]
```



#### 稀疏数组和密集数组

> https://www.cnblogs.com/goloving/p/8686780.html

1.定义
稀疏数组:数组中的元素之间可以有空隙empty,
密集数组:每个元素都有值,即使是undefiend.
2.创建

```javascript
//2.1创建稀疏数组:数组元素实际只有2个，但是长度确实3.当你遍历这个数组的时候,不同的方法会有差异.
let arr = new Array(3);
arr[0]=0;
arr[2]=2; //中间一项是empty,这个arr数组是稀疏数组.

2.2创建密集数组:有真实元素了，虽然元素的值是undefined，但是你可以遍历到这些数组元素
let arr = Array.apply(null,Array(3)); //等同于let arr = Array(undefined,undefined,undefined);
```



### 数组多元化

#### 创建多元连续的数组
例如:
```js
aperture(2, [1,2,3,4]) //[ [1,2], [2,3], [3,4]]
aperture(3, [1,2,3,4]) //[ [1,2,3],[2,3,4]]
aperture(5, [1,2,3,4]) //[]
```

```js
// reduce
const apetrue = (n, arr) => arr.reduce((acc, crt, idx, arr) => {
	if (idx+n <= arr.length) {
		acc.push(arr.slice(idx, idx+n))
	}
	return acc
}, [])


//for循环
let arr2 = []
for (let i=0; i<arr.length; i++) {
	if (i+n <= arr.length) {
		arr2.push(arr.slice(i, i+=n))
	} else {
		break
	}
}

//slice方法  不理解

arr.slice(n-1).map((v,i) => {
	return n > arr.length
		? []
		: arr.slice((v,i) => arr.slice(i, i+n))
})
```


#### 创建多元不连续数组

不连续数组的关键就是使用slice方法的时候,开始的索引需是不连续的
```js
let arr = [1,2,3,4,5,6],arr2=[],n=2;

for (let i=0; i<arr.length; i+=2) {
	if (i+n <= arr.length) {
		arr2.push(arr.slice(i, i+n))
	} else {
		break
	}
}

arr.reduce((acc,crt,idx)=>{
	if (idx % n == 0) {
		acc.push(arr.slice(idx, idx+n))
	}
	return acc
},[])
```


下面是多个数组组合新数组, 
```js
 handleCheckedItemAr(firstArr, restArr) {
   // 公共方法 处理两个数组
   function combineArr(a, b) {
     let newArr = [];
     a.forEach((itemA) => {
       let result = b.map((itemB) =>
            Array.isArray(itemA) ? itemA.concat(itemB) : [itemA, itemB]);
       newArr.push(...result);
     });
     return newArr;
   }

   return restArr.reduce(
     (pre, itemArr) =>
     pre.length === 0
     ? combineArr(firstArr, itemArr)
     : combineArr(pre, itemArr),
     []
   );
 }
```



### 其它
```js
多元数组: [ [a1,a2,a3...], [b1,b2,b3,...], [c1,c2,c3,...],[...] ]

将这个数组处理下如下形式:
[a1, b1,c1],  [a1, b1, c2],  [a1, b1, c3]
```

```js
let arr = [
	['a1','a2','a3','a4'],
	['b1','b2','b3','b4'],
	['c1','c2','c3','c4'], 
	['d1','d2','d3','d4'] 
]

arr.reduce((acc, crt, idx) => {
	acc.push(arr.map(item => item[idx]))
	return acc
}, [])

//那么如果每项数组长度大于arr的长度
let arr = [
	['a1','a2','a3','a4', 'a5'],
	['b1','b2','b3','b4', 'b5'],
	['c1','c2','c3','c4', 'c5'],
	['d1','d2','d3','d4', 'd5'] 
]

//在下手之前应该厘清大概的顺序,有个大概的方向并通过实现代码来测试这个想法.
//我们需要在遍历arr每一项时,对每项(数组)进行遍历操作

arr.reduce((acc,crt,idx) => {
	if (idx===0) {
		crt.forEach((item,idx) => acc.push([crt[idx]]))
	} else {
		crt.forEach((item2,idx2) => acc[idx2].push(item2))
	}
	return acc
},[])

```




### 读写数组元素

* 使用`[]`操作访问数组元素: 方括号左侧是数组的引用,方括号内是一个具有非负整数值得表达式.

* 只要使用小于`2**32 - 1`的非负整数作为属性名,数组就会自动为你维护length的属性的值.

* JS会将数值索引转换为字符串,然后再将这个字符串作为属性名.

* 明确区分数组索引和对象属性名: 所有索引都是属性名,但只有介于`0`和`2**32 - 2`之间的整数属性名才是索引.

* 在数组上可以以任意名字创建属性.如果这个属性是数组索引,数组自动按需更新其length属性

* 使用负数或非整数值来索引数组,其数值会变成字符串,会被当做属性名.

* 查询任何对象中不存在的属性都不会导致错误,只会返回undefined.


### 添加/删除数组元素

#### 添加

* push/unshift
* arr[arr.length] = 'xxx'



#### 删除

* shift/pop
* arr[length]
* delete

删除数组元素类似于(但不完全等同于)给该元素`undefined`的值. 

对数组元素使用`delete`操作符不会修改length属性,也不会把高索引位的元素向下移动来填充被删除属性的空隙.

从数组删除元素后,数组会变得稀疏.



### 迭代数组

#### 方式

到ES6为止,迭代数组的几种方式有:

* for...of
* forEach
* for循环

#### 特点

* for/of使用数组内置数组迭代器按照升序返回数组的元素. 对于稀疏数组,这个循环没有特殊行为,凡是不存在的元素都返回`undefined`
* forEach是数组提供的一种用于自身迭代的函数式方法. 因此需要给forEach传递一个函数.与for/of不同,forEach能感知稀疏数组,不会对没有的元素数组调用函数.
* for循环,使用在嵌套循环或关注性能场景.如果不是密集数组(dense array),则需要添加判断

**for 循环两种应用**

```javascript
//把数组长度保存到局部某良
for (let i=0,len=arr.length; i<len; i++) {
  //循环体
}


//从后向前迭代数组
for (let i=arr.length; i>=0; i--) {
  //循环体
}


//添加非密集数组判断
for (let i=0,len=arr.length; i<len; i++) {
  if (arr[i] === undefined) continue;
  //循环体
}
```



#### 迭代数组多种方法2

##### 1. 遍历数组方法列举(8种,不全)

1. 普通for循环

```javascript
for (let i = 0; i < arr.length; i++) {
  
}
```

简要说明: 最简单的一种，也是使用频率最高的一种，虽然性能不弱，但仍有优化空间

2. 优化版for循环

```javascript
for (let i = 0, len = arr.length; i < len; i++) {
  
}
```

简要说明: 使用临时变量，将长度缓存起来，避免重复获取数组长度，当数组较大时优化效果才会比较明显。

**这种方法基本上是所有循环遍历方法中性能最高的一种**

3. 弱化版for循环

```javascript
for (let i = 0; arr[i] !== null; i++) {
  
}
```

这种方法其实严格上也属于for循环，只不过是没有使用length判断，而使用变量本身判断

**实际上，这种方法的性能要远远小于普通for循环**

4. forEach循环

```javascript
arr.forEach((item,index,arr) => {});
```

数组自带的foreach循环，使用频率较高，实际上性能比普通for循环弱

5. forEach变种

```javascript
Array.prototype.forEach.call(arr, (item,index,arr) => {})
```

由于foreach是Array型自带的，对于一些非这种类型的，无法直接使用(如NodeList)，所以才有了这个变种，使用这个变种可以让类似的数组拥有foreach功能。

实际性能要比普通foreach弱

6. for...in循环

```javascript
for(let i in arr) {
  
}
```

众多循环中效率最低

7. for...of循环

```javascript
for(let value of arr) {
  
}
```

es6里的，性能要好于forin，但仍然比不上普通for循环

8. map循环

```javascript
arr.map((item,index,arr) => {})
```



##### 2. 遍历数组方法性能比较图

以下截图中的数据是，在chrome (支持es6)中运行了100次后得出的结论(每次运行10次,一共10个循环，得到的分析结果)

![遍历数组](https://dailc.github.io/jsfoundation-perfanalysis/staticresource/performanceAnalysis/demo_js_performanceAnalysis_jsarrayGoThrough_1.png)

##### 3. 各方法详解

##### for循环顺序

```js
for(let i=0; i<arr.length; i++){}

for(let i=arr.length;i>0;i--){}
```



##### forEach

**介绍**

- forEach()是数组对象的方法,可以用来对数组进行遍历,它需要一个函数作为参数. //没有返回值
- 传递给数组的函数会调用多次,数组中有几个元素就调用几次
- 每次调用时,会将元素的信息以参数的形式传递进函数
- forEach()不能遍历对象,可以使用for-in

**返回值**

forEach() 被调用时，不会改变原数组，也就是调用它的数组
forEach返回值是undefined,没有返回值.

**实例**

```js
forEach的回调函数有三个参数:
第一个: item 当前遍历的元素
第二个: index 当前遍历的元素的索引
第三个: array 当前正在遍历的元素
    
数组.forEach(function(item, index, array){ //顺序很重要
    console.log(item, index, array); 
})
```



##### for...of

`for…of` 是在 ES6（ECMAScript 6）中实现标准化的。它会对一个可迭代的对象（例如 `array`、`map`、`set`、`string` 等）创建一个循环

```js
const arr = [3, 5, 7];
const str = 'hello';
for (const i of arr) {
   console.log(i); // 输出 3, 5, 7
}
for (const i of str) {
   console.log(i); // 输出 'h', 'e', 'l', 'l', 'o'
}



使用for/of获取数组索引，可以这样写
for(const[i,v] of arr.entries()) {
  console.log(i,v);
}
```



##### for...in

**`for...in`语句**以任意顺序遍历一个对象的除[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)以外的[可枚举](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)属性，包括继承的可枚举属性.

`for…in` 语句除返回数字索引外，还将返回用户定义的属性的名称。 

因此，在遍历数组时最好使用带有数字索引的传统 `for` 循环, `for...of`。 

```js
// for…in 循环遍历对象的属性，而 for…of 循环遍历可迭代对象的值。
let arr = [1,2,3];
for(let i in arr){
  console.log(i); //'0','1','2'
}

//数组具有一个可枚举的方法，也会被for-in遍历到
let arr = [1,2,3];
arr.name = 'test';
for (let i in arr) {
  console.log(i + ":" + arr[i])
}
//0:1
//1:2
//2:3
//name: 'test'
```



#### 如何停止遍历数组

##### 1. forEach()中无法return/break,

**for循环, for-in, for...of**能正确响应break、continue和return语句，但forEach不行。 

具体查看 `语句 > JS中如何跳出循环/结束遍历`中的内容

```js
//跳出for循环使用break, 但在数组中用forEach循环如果要退出使用break会报错,使用return只能跳出本次循环

//原因:

根据forEach的实现,回调函数只是执行而不使用返回值,函数中的return可以终止下面的语句执行,相当于跳出了本次循环.

//如何终端forEach
0. 使用for循环
1. 使用some/every
2. 使用try&catch
```





##### 2. map循环如何跳出?

```js
//前提: map无法跳出, 所以es6中才会添加for-of语法

//原因: map是个迭代,不是循环

//解决方法:
1. try-catch  使用throw抛出错误.
2. 使用for-of循环
3. 使用some/every更合理
```





### for...of
`for...of`语句(statement)执行一个循环来对每个可迭代对象[[202301181103d|iterable object]]上的值进行操作.


#### 可迭代对象

^08df4d

一个具有[[202301181103d1a1|Symbol.iterator]]方法的对象. 
这个属性是一个函数并返回一个`next()`函数. `next()`函数返回一个包含两个属性的对象: `value`和`done`. 

value属性包含当前迭代值, done属性表明迭代是否完成.

一些内置类型,例如Array 或 Map,是默认的可迭代对象.可以用[[for...of]]迭代一个可迭代对象.

可迭代对象包括: 
* 内建对象(Array,String, TypedArray, Map, Set, NodeList)的实例, 
* arguments对象, 
* 生成器函数制造的生成器,
* 用户定义的迭代对象.


#### desc
`for...of`循环以一定的顺序操作来自一个接一个可迭代的值. 循环对一个值的每次操作被称为*iteration*, ==循环也被称为迭代可迭代对象==. 每个迭代执行可以引用当前值的语句.

当一个`for...of`循环迭代可迭代对象, 它第一个调用可迭代对象的`[@@iterator]()`方法, 返回一个iterator, 然后重复调用结果iterator的`next()`方法来生成一系列应被赋值给 `variable` 的值.

当迭代器完成时(iterator的方法`next()`返回对象包含`done:true`)退出. 你也可以使用控制流语句来改变正常的控制流. `break`退出循环并执行循环体之后的第一个语句, 而`continue`跳过当前迭代剩余语句并继续下一个迭代.

如果`for...of`循环过早退出(例如: 遇到`break`语句或抛出一个错误), 迭代器的`return()`方法被调用来执行任何清理. ??

`for...of`的`variable`部分接受可以出现在`=`操作前的任何内容. 你可以用`const`声明一个变量只要它不在循环体内重复声明(它可以在迭代间改变,因为这是两个隔开的变量). 否则,你可以用'let'.

注意: 每个迭代创建一个新的变量. 在循环体内容重复声明这个变量不会影响迭代对象中它的原始值(例如一个数组).

可以用destructuring或也能用一个对象属性例如`for (x.y of iterable)`

明确禁止使用`async`作为变量名字. 不合法语法.


```js
const arr = [3, 5, 7];
const str = 'hello';
for (const i of arr) {
   console.log(i); // 输出 3, 5, 7
}
for (const i of str) {
   console.log(i); // 输出 'h', 'e', 'l', 'l', 'o'
}



使用for/of获取数组索引，可以这样写
for(const[i,v] of arr.entries()) {
  console.log(i,v);
}
```


#### example

##### iterating over a user-defined iterable

> 迭代一个带有`@@iterator`方法并返回一个自定义iterator的对象.

```js
const iterable = {
	[Symbol.iterator]() {
		let i=1;
		return {
			next() {
				if (i<3) {
					return {value: i++, done: false}
				}
				return {value: undefined, done: true}
			}
		}
	}
}


for (const value of iterable) {
	console.log(value)
}
//1
//2
//3
```


> 可迭代的迭代器(内置`[@@iterator]()`方法并返回`this`)是一个常用的技巧,可以使迭代器在需要迭代的语法中使用,例如`for...of`

```js
let i = 1;

const iterator = {
  next() {
    if (i <= 3) {
      return { value: i++, done: false };
    }
    return { value: undefined, done: true };
  },
  [Symbol.iterator]() {
    return this;  // this就是迭代器对象
  },
};

for (const value of iterator) {
  console.log(value);
}
// 1
// 2
// 3
```



#### 过早退出

> `break`语句执行在第一次循环会导致过早退出. 迭代器不会完成, 所以第二次循环将从第一次循环停止的地方继续.

```js
const source = [1,2,3]

const iterator = source[Symbol.iterator]()

for (const value of iterator) {
	console.log(value)
	if (value === 1) {
		break
	}
	console.log('this string will not be logged')
}
// 1

// 另一个循环使用相同的迭代器, 从上一次循环离开的地方开始
for (const value of iterator) {
	console.log(value)
}

//2 
//3

// 这个迭代器已用完
// 这个循环将不执行迭代.
for (const value of iterator) {
	console.log(value)
}
// no output
```


> break在生成器中的使用



#### for...of 和 for...in比较

for...in和for...of语句都迭代一些内容.主要区别是具体迭代什么.

for...in语句迭代对象的可枚举字符串属性(enumerable string property)
for...of语句迭代可迭代对象(iterable object)定义的应被迭代的值.

for...of在对象上使用会报错, '对象不是一个可迭代对象'
for...in可以在可迭代对象上使用

### enumerable string property

可枚举属性指的是属性内部的可枚举标签被设置为true的属性.


#### 可枚举属性怎么生成
通过声明或通过属性初始化来创建的属性的可枚举值为true,
通过[[202301180954a|Object.defineProperty]]定义的属性默认不可枚举(enumerable:false).


#### 怎么访问可枚举属性
大多数迭代意味(例如for...in循环和[[JS Base#Object.keys]])只访问可枚举的键.
















## 创建数组

> 在ECMAScript 6以前,创建数组有两种方式: 调用Array构造函数;数组字面量语法. 
>
> 这两种方法均需列举数组中的元素,功能受限.如果将一个类数组对象(具有数值型索引和length属性的对象)转换为数组,可选方法有限.
>
> 为了解决以上问题,ES6新增了Array.of()和Array.from()两个方法



**方式列举**

* 数组字面量
* Array()构造函数
* 工厂方法 Array.of() Array.from()
* 对可迭代对象使用`...`扩展操作符



#### Array构造函数

##### 3种调用方式:

* 不传参调用: 创建一个没有元素的空数组
* 传入一个整数,创建一个指定长度的空数组(非整数会报错)
* 传入两个或多个数字,或传入一个非数值元素, 创建一个包含以上元素的数组



##### 1.1 Array构造函数的缺点

```JavaScript
//如果给Array构造函数传入一个数值型的值，那么数组的length属性会被设为该值；如果传入多个值，此时无论这些值是不是数值型的，都会变为数组的元素。这个特性令人感到困惑，你不可能总是注意传入数据的类型，所以存在一定的风险。


解决: Array.of()
```



#### 数组字面量表示法

* 数组字面量是在中括号中包含以逗号分隔的元素列表
* 字面量中的值不需要是常量,可以是任意表达式
* 可以包含对象字面量或其他数组字面量
* 数组字面量中连续包含多个逗号,且逗号之间没有值,则这个数组就是稀疏的.省略了值得数组元素不存在,但是按索引查询时又会返回undefined.
* 数组字面量语法允许末尾出现逗号.因为`[,,]`的长度是2不是3.

```js
let colors = ["red", "blue", "green"]; // 创建一个包含3 个元素的数组
let names = []; // 创建一个空数组
let values = [1,2,]; // 创建一个包含2 个元素的数组
```

注意 与对象一样，在使用数组字面量表示法创建数组不会调用Array 构造函数。



#### 扩展操作符

* 可以使用扩展操作符`...`在一个数组中包含另一个数组的元素
* 扩展操作符是创建数组(浅)副本的一种方式
* 扩展操作符适用于任何可迭代对象(可迭代对象可使用for/of循环遍历).字符串是可迭代对象.

```javascript
let a = [1,2,3]
let b = [0,...a,4] //[0,1,2,3,4]

```









#### Array.of()

Array 构造函数还有两个ES6 新增的用于创建数组的静态方法：from()和of()。from()用于将类数组结构转换为数组实例，而of()用于将一组参数转换为数组实例。

**背景**

解决Array()构造函数无法创建一个只包含数值元素的数组



```javascript
function createArray(arrayCreator, value) {
  return arrayCreator(value);
}

let items = createArray(Array.of, value);
```





#### Array.from()

> JavaScript不支持直接将非数组对象转换为真实数组，arguments就是一种类数组对象，如果要把它当作数组使用则必须先转换该对象的类型
>
> Array.from()方法可以接受<span style="color:red">**可迭代对象或类数组对象**</span>作为第一个参数，最终创建一个新的，浅拷贝的数组实例.可迭代对象包 内置可迭代对象如下：[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)、[`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)、[`TypedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map) 和 [`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)，它们的原型对象都实现了 `@@``iterator` 方法。
>
> 注意: Array.from()方法也是通过this来确定返回数组的类型的。(?)

**特点**

* 该方法可接收一个可迭代对象或类数组对象,并返回包含该元素对象元素的新数组
* 如果传入可迭代对象 / arguments对象, Array.from(iterable) 与`[...iterable]`一样.
* 创建数组副本的一种方式

**参数**

```javascript
Array.from(arrayLike[, mapFn[, thisArg]]
```

`arrayLike` 想要转换成数组的伪数组对象或可迭代对象

`mapFn` **可选**

* 如果指定了该参数，新数组中的每个元素会执行该回调函数

`thisArg` **可选**

* 执行回调函数 `mapFn` 时 `this` 对象

##### **返回值**

一个新的[`数组`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)实例

##### **描述**

`Array.from()` 可以通过以下方式来创建数组对象

* 伪数组对象（拥有一个 `length` 属性和若干索引属性的任意对象）
* [可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)（可以获取对象中的元素,如 Map和 Set 等）
* `Array.from()` 方法有一个可选参数 `mapFn`，让你可以在最后生成的数组上再执行一次 [`map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 方法后再返回。也就是说` Array.from(obj, mapFn, thisArg) `就相当于` Array.from(obj).map(mapFn, thisArg),` 除非创建的不是可用的中间数组。 这对一些数组的子类`,`如 [typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) 来说很重要, 因为中间数组的值在调用 map() 时需要是适当的类型。
* `from()` 的 `length` 属性为 1 ，即 `Array.from.length === 1`。

##### **实例**

可迭代对象 ^c02583

```javascript
Array.from(Array(1000).keys())

Array(1000).keys() 返回一个可迭代对象

```



string生成数组

```javascript
Array.from('string');
//['s', 't', 'r', 'i', 'n', 'g']
```

从Set生成数组

```javascript
const set = new Set(['foo', 'bar', 'baz', 'foo']);
Array.from(set);
// [ "foo", "bar", "baz" ]
```

从Map生成数组

```javascript
const map = new Map([[1, 2], [2, 4], [4, 8]]);
Array.from(map);
// [[1, 2], [2, 4], [4, 8]]

const mapper = new Map([['1', 'a'], ['2', 'b']]);
Array.from(mapper.values());
// ['a', 'b'];

Array.from(mapper.keys());
// ['1', '2'];
```

数组去重合并

```javascript
function combine(){
    let arr = [].concat.apply([], arguments);  //没有去重复的新数组
    return Array.from(new Set(arr));
}

var m = [1, 2, 2], n = [2,3,3];
console.log(combine(m,n));                     // [1, 2, 3]
```



## 类数组转换为数组

##### ES5和ES6 在转换组数上的比较

1.ES5 将类数组对象转换为数组: 将函数中的arguments对象转换为数组

```JavaScript
//第一种方法 for循环+push
function makeArray(arrayLike) {
  let result = [];
  for (let i=0; i<arraryLike.length; i++) {
    result.push(arrayLike[i]);
  }
  
  return result;
}

function doSomething() {
  let args = markArray(arguments);
  
  //使用args
}



//第二种方法 slice()方法
//slice()方法 只需数值型索引和length属性就能够正确运行，所以任何类数组对象都能被转换为数组
function makeArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
  // return [].slice.call(arrayLike)
}

function doSomething() {
  let args = makeArray(arguments);
  
  //使用args
}
```

2.ES6 将类数组对象转换为数组

```JavaScript
function doSomething() {
  let args = Array.from(arguments);
  
  //使用args
}

//Array.from()方法调用会基于arguments对象中的元素创建一个新数组，args是Array的一个实例，包含arguments对象中同位置的相同值。
```



##### Array.from() 映射转换

> 如果想要进一步转化数组，可以提供一个映射函数作为Array.from()的第二个参数，这个函数用来将类数组对象中的每一个值转换成其他形式，最后将这些结果储存在结果数组的相应索引中

```JavaScript
function translate() {
  return Array.from(arguments, value => value + 1);
}

let numbers = translate(1,2,3);
console.log(numbers); //2,3,4
```



> 如果用映射函数处理对象，也可以给Array.from()方法传入第三个参数来表示映射函数的this值

```javascript
let helper = {
  diff: 1,
  add(value) {
    return value + this.diff;
  }
};

function translate() {
  return Array.from(arguments, helper.add, helper);
}
```

> 用Array.from()转换可迭代对象
>
> Array.from()方法可以处理类数组对象和可迭代对象，也就是说该方法能够将所有含有Symbol.iterator属性的对象转换为数组

```javascript
let numbers = {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
};

let numbers2 = Array.from(numbers, value => value + 1);

console.log(numbers2) //2,3,4
```

> 注意： 如果一个对象既是类数组又是可迭代的，那么Array.from()方法会根据迭代器来决定转换哪个值。

##### 使用

参数

```javascript
arrayLike 类数组或可迭代对象
mapFn 可选 映射函数被数组中每一个元素调用
thisArg 可选 当执行映射函数时候使用这个值
```



`Array.from()` 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例

```javascript
//语法
Array.from(arrayLike[,mapFn[,thisArg]])
arrayLike 要转换成数组的伪数组对象或可迭代对象
mapFn 如果指定了该参数，新数组中的每个元素会执行该回调函数
thisArg 可选参数，执行回调函数 mapFn 时 this 对象

//返回值
一个新的数组

//描述
Array.from() 可以通过以下方式来创建数组对象：
 - 伪数组对象（拥有一个 length 属性和若干索引属性的任意对象）
 - 可迭代对象（可以获取对象中的元素,如 Map和 Set 等）
```



Array.from()的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 Unicode 字符,可以避免 JavaScript 将大于`\uFFFF`的 Unicode 字符，算作两个字符的 bug。

```javascript
function countSymbols(string) {
  return Array.from(string).length;
}

countSymbols('\uD842\uDFB7'); //1
```



## 判断数组的方式

### 判断数组的7种方式

**概览**

* [].\_\_proto\_\_ === Array.prototype
* [] instanceof Array
* [].constructor === Array
* Array.prototype.isPrototypeOf([])
* Object.getPrototypeOf([]) === Array.prototype
* Object.prototype.toString.call([]).slice(8, -1)
* Array.isArray([])

#### 原型链方法

**instanceof**

```javascript
arr instanceof Array
```

**\_\_proto\_\_**

```javascript
arr.__proto === Array.prototype;

Array.prototype.isPrototypeOf(arr);

Object.getPrototypeOf(arr) === Array.prototype;

[].constructor === Array;
```



#### 数组和对象方法

**Array.isArray()**

```javascript
Array.isArray([]);
```

**Object.prototype.toString()**

```javascript
Object.prototype.toString.call([]) === '[object Array]'

Object.prototype.toString.call([]).slice(8, -1);
```



```js
1.instacneof

function isArray(obj){
    return obj instanceof Array;
}
instanceof操作符的问题在于，它假定只有一个全局执行环境。如果网页中包含多个框架，那实际上就存在2个以上不同的全局执行环境，从而存在2个以上不同版本的Array构造函数
如果你从一个框架向另一个框架传人一个数组，那么传人的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数。

为解决这个问题，ES5 新增了Array.isArray()方法


2.对象的constuctor属性
var arr = [1,2,3,1]
alert(arr.constuctor===Array) //true

arr.__proto__ == Array.prototype
arr.__proto__.constructor == Array

第1种和第2种方法貌似无懈可击，但是实际上还是有些漏洞的，当你在多个frame中来回穿梭的时候，这两种方法就亚历山大了。

由于每个iframe都有一套自己的执行环境，跨frame实例化的对象彼此是不共享原型链的，因此导致上述检测代码失效!
    

3.Object.prototype.toString.call(obj)
function isArray(obj){
    return Object.prototype.toString.call(obj)==='[object Array]'
}

4.Array.isArray()
ECMAScript5将Array.isArray()正式引入JavaScript，目的就是准确地检测一个值是否为数组。在IE8之前的版本是不支持的。
function (obj) {
    return Array.isArray(obj)
}


```



## 数组属性

### 数组的属性

使用`Reflect.ownKeys(Array)`获取Array自身全部属性(可枚举,不可枚举,符号)

```javascript
['length', 'name', 'prototype', 'isArray', 'from', 'of', Symbol(Symbol.species)]
```



#### length

数组(无论是否稀疏)中任何元素的索引都不会大于或等于数组的length.为了维持这种不变式(invariant), 数组有两个特殊行为.

* 如果给一个索引为i的数组元素赋值,而i大于或等于数组当前的length,则数组的length属性会被设置为*i+1*
* 如果将length属性设置为一个小于其当前值得非负整数n,则任何索引大于或等于n的数组元素都会从数组中删除.







## 数组方法

### Array.prototype.pop()

#### define
> remove the last element from an array and returs that element.
> this method changes the length of the array.


#### return values
* the removed element from the array
* [[202301170826|undefined]] if the array is empty

#### des
* 与 Array.prototype.shift()类似,但处理位置不同
* 如果想获取移除最后元素的数组,使用Array.prototype.slice(0,-1)
* 是[**原生方法**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#generic_array_methods).它只期望拥有`length`属性和整数键属性的`this`值.
* 尽管字符串是类数组,但此方法使用在字符串上不适合,因为字符串是不可变的.

#### examples

在非数组对象上调用
此方法读取`this`的`length`属性: 如果normalized length是0,`length`属性重新被设为0(无论它之前可能是负数或undefined).否则,将返回并删除在`length-1`上的属性.



以类数组的方式使用对象

```js
const collection = {
  length: 0,
  addElements(...elements) {
    // obj.length will be incremented automatically
    // every time an element is added.

    // Returning what push returns; that is
    // the new value of length property.
    return [].push.call(this, ...elements);
  },
  removeElement() {
    // obj.length will be decremented automatically
    // every time an element is removed.

    // Returning what pop returns; that is
    // the removed element.
    return [].pop.call(this);
  },
};

collection.addElements(10, 20, 30);
console.log(collection.length); // 3
collection.removeElement();
console.log(collection.length); // 2
```




### Array.prototype.sort


#### **定义**

`sort()`方法用[原地算法](https://en.wikipedia.org/wiki/In-place_algorithm)对数组的元素进行排序，并返回数组的引用。
默认排序是==升序==, 创建在转换元素为字符串,并比较它们UTF-16代码单元值序列的基础上.


#### **参数**

```javascript
arr.sort([compareFunction])
```

`compareFunction` 可选

* 用来指定按某种顺序进行排列的函数。如果省略，元素按照转换为的字符串的各个字符的<u>Unicode code point value</u>进行排序。([字符编码笔记:ASCII, Unicode和UTF-8](https://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html))
* `firstEl` 第一个用于比较的元素。
* `secondEl` 第二个用于比较的元素

#### **返回值**

排序后的数组。请注意，数组已原地排序，并且不进行复制。

#### **描述**

* 如果没有指明`compareFn`, 那么元素会按照转换为字符串的诸个字符的Unicode位点进行排序.
  * 例如: 'Banana'排在'cherry'之前. 数字9排在80之后.
  
* 所有`Undefined`元素会被排在数组的末尾
  
* 如果指明了 `compareFunction` ，那么数组会按照调用该函数的返回值排序。即 a 和 b 是两个将要被比较的元素(所有`undefined`元素被排在数组末尾, 没有调用`compareFn`)

| `compareFn(a, b)` return value | sort order      |
| ------------------------------ | --------------- |
| > 0                            | `a` 在 `b` 之后 |
| < 0                            | `a` 在 `b`之前  |
| === 0                          | 保持原来的顺序  |

```javascript
//比较函数格式:
function compare(a, b) {
  if (a < b ) {           // 按某种排序标准进行比较, a 小于 b
    return -1;
  }
  if (a > b ) {
    return 1;
  }
  // a must be equal to b
  return 0;
}
```


更正式的,比较函数被期望具有以下属性,为了确保更好的排序行为:
* *Pure*: 比较器不会改变被比较的对象或任何外部状态(这很重要,因为不能保证比较函数在什么时候什么方式被调用,所以任何特定的调用将不会产生可见的影响对外部)
* *Stable*: 比较器根据相同的输入对返回相同的结果
* *Anti-symmetric*(反对称): `compareFn(a,b)` 和 `compareFn(b,a)` 必须都是0或有相反的符号.
* *Transitive*: 如果`compareFn(a,b)`和`compareFn(b,c)`都是整数,0或负数, 那么`compareFn(a,b)`像前两者具有相同的正值.

注意, 遵循上述限制的比较函数总会返回1,0和-1, 或一直返回0.如果比较函数值回函1和0,或只返回0和-1,它不能进行可靠的排序因为反对称被破坏. 比较器函数总是返回0将会使这个数组不会改变,但毫无疑问是可靠的.


要比较数字而非字符串，比较函数可以简单的以 a 减 b，如下的函数将会将数组升序排列(如果不包含`Infinity`和`NaN`.
```js
function compareNumber(a,b) {
	return a - b
}
```

sort()方法是通用(??待办)的.它只希望拥有`length`属性和整数键属性的`this`值.尽管字符串也是类数组,但这个方法不适合在字符串上使用,因为字符串是不可变的(immutable)



```javascript
// 记忆方法: 26个字符从a到z是从小到大, a - b理解为从小到大,是升序. b -a是从大到小

- 升序排列:
function(a, b){
  return a - b;  
}

- 降序排列:
function(a, b){
  return b - a;
}

- 乱序排列
function(a, b){
  return Math.random() - Math.random
}
//或
() => Math.random() - 0.5;

- 不传递参数
[1,3,2,5,4].sort(() => -1); //[4, 5, 2, 3, 1]
[1,3,2,5,4].sort(() => 1); //[1,3,2,5,4]
[1,3,2,5,4].sort(() => 0); //[1,3,2,5,4]
```



#### sort(compareFn)升序可以简写为a-b


```javascript
//let arr = [1, 22, 15, 32, 4, 5];
arr.sort((a, b) => a - b); //升序排列 [1, 4, 5, 15, 22, 32]
arr.sort((a, b) => b - a); //降序排列 [...]

```

回调函数的格式为（a,b）=> { return xxx }，ab为数组中任意两个数:

* 当返回值大于0, a放在b的后面
* 当返回值小于0, a放在b的前面
* 当返回值等于0, 位置不变

```javascript
当 a>b 时，

a - b > 0  ，排序结果 ===> b，a （升序）

b - a < 0  ，排序结果 ===> a，b （降序）

当 b>a 时，

a - b < 0  ，排序结果 ===> a，b （升序）

b - a > 0  ，排序结果 ===> b，a （降序）

当 a=b 时，

a - b = b - a =0 , 排序结果 ===> 保持不变
```

`结论`: 无论a>b还是b>a，return a-b 总能得到升序的结果，而 return b-a 总能得到降序的结果. 另外，return a-b / return b - a 只是一种在理解的基础上简便的写法。复杂的写法就是使用上面的'比较函数的格式'.

问题:


#### 来源
[csdn](https://blog.csdn.net/weixin_42207975/article/details/107538527)
#### 重写sort

>    本篇文章重要 精读  看不懂

```javascript
//插入排序 v1.0
const insertSort = (arr, start=0, end) => {
  end = end || arr.length;
  for (let i=start; i<end; i++) {
    for (let j=i; j>start&&arr[j-1]>arr[j]; j--) {
      let temp = arr[j];
      arr[j] = arr[j-1];
      arr[j-1] = temp;
    }
  }
  return arr;
}

//插入排序v2.0 优化插入
//实际上交换元素会有相当大的性能消耗，我们完全可以用变量覆盖的方式来完成   ???? 这个我不明白
const insertSort = (arr, start = 0, end) => {
  end = end || arr.length;
  for (let i=start; i<arr.length; i++) {
    let e = arr[i];
    let j;
    for (j=i; j>start&&arr[j-1]>e; j--) {
      arr[j-1] = arr[j];
    }
    arr[j] = e;
  }
  return arr;
}


//
```



#### 来源

[(建议精读)原生JS灵魂之问(中)，检验自己是否真的熟悉JavaScript？ - 掘金 (juejin.cn)](https://juejin.cn/post/6844903986479251464#heading-33)

https://juejin.cn/post/6844903986479251464#heading-33 



**sort接口代码实现**

> [数组的 sort() 方法详解 - 掘金 (juejin.cn)](https://juejin.cn/post/6971747560784560165)
>
> [v8/array.js at ad82a40509c5b5b4680d4299c8f08d6c6d31af3c · v8/v8 (github.com)](https://github.com/v8/v8/blob/ad82a40509c5b5b4680d4299c8f08d6c6d31af3c/src/js/array.js)

 [array.js](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8%2Fblob%2Fad82a40509c5b5b4680d4299c8f08d6c6d31af3c%2Fsrc%2Fjs%2Farray.js) 文件下，关于 sort 接口实现的代码如下：

```js
function InnerArraySort(array, length, comparefn) {
  // In-place QuickSort algorithm
  // For short (length <= 22) arrays, insertion sort is used for efficiency.
  
  if (!IS_CALLABLE(comparefn)) {
    comparefn = function (x, y) {
      if (x === y) return 0;
      if (% _IsSmi(x) && % _IsSmi(y)) {
        return % SmiLexicographicCompare(x, y);
      }
      //将数组元素转换为字符串
      x = TO_STRING(x);
      y = TO_STRING(y);
      if (x === y) return 0;
      else return x < y ? -1 : 1;
    };
  }
  var InsertionSort = function InsertionSort(a, from, to) {
    for (var i = from + 1; i < to; i++) {
      var element = a[i];
      for (var j = i - 1; j >= from; j--) {
        var tmp = a[j];
        //调用比较函数 a: tmp, b:element
        var order = comparefn(tmp, element);
        if (order > 0) {
          a[j + 1] = tmp;
        } else {
          break;
        }
      }
      a[j + 1] = element;
    }
  };

  var QuickSort = function QuickSort(a, from, to) {
    //some code here
  }
}

function ArraySort(comparefn) {
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.sort");

  var array = TO_OBJECT(this);
  var length = TO_LENGTH(array.length);
  return InnerArraySort(array, length, comparefn)
}
```

代码分析：

1. v8 中实现 sort() 方法时，采用了 ”**插入排序**“ 和 ”**快速排序**“ 两种排序方式。
2. 对于短数组（长度 <= 22）来说，插入排序效率更高。
3. 如果没有传入 `comparefn` ，则生成一个 `comparefn` 比较函数。
4. 在自动生成的比较函数中，会将传入的数组元素通过 `TO_STRING` 方法转换为字符串，再行比较。
5. 对比比较函数中的 b 为游标值，这一点和最新版的 chrome 浏览器表现不同。

我们在 sort 方法中传入的函数用在了这里：

```javascript
var order = comparefn(tmp, element);
```

根据我们传入函数的返回值，数组进行排序操作：

```javascript
if (order > 0) {
    a[j + 1] = tmp;
} else {
    break;
}
```

- 如果返回值`（a-b）`大于0，即 `a > b`, 则将当前拿来比较的值 a 复制给它的下一位，并继续使用游标值 b 向前进行比较。
- 如果返回值小于等于 0 ，则结束比较，并将游标值 b 填在最后一次比较值 a 的后面。

比较函数如果写完全的话，应该是：

```javascript
arr.sort((a,b) => {
    const res = a - b;
    return res > 0 ? 1 : (res < 0 ? -1 : 0 );
});
```

即比较函数的返回值严格来说只有三个：-1、0 和 1 。



#### sort实例

#### 排序有对象的数组
通过比较属性的值来进行排序
```js
const items = [
  { name: "Edward", value: 21 },
  { name: "Sharpe", value: 37 },
  { name: "And", value: 45 },
  { name: "The", value: -12 },
  { name: "Magnetic", value: 13 },
  { name: "Zeros", value: 37 },
];


//sort by value
items.sort((a,b) => a.value - b.value)

// sort by name
items.sort((a,b) => {
	const nameA = a.name.toUpperCase()
	const nameB = b.name.toUpperCase()
	if (nameA < nameB) {
		return -1
	}
	if (nameA > nameB) {
		return 1
	}
	return 0
})
```

#### 排序non-ASCII字符
可以对非ASCII字符的字符串,使用[[202301180818a|String.prototype.localeCompare()]].这个方法可以比较这些字符.
```js
const items = ["réservé", "premier", "communiqué", "café", "adieu", "éclair"];
items.sort((a, b) => a.localeCompare(b));

// items is ['adieu', 'café', 'communiqué', 'éclair', 'premier', 'réservé']


//对上面案例中的items进行排序
items.sort((a,b) => a.name.localeCompare(b.name))
```

#### 使用映射改善排序

> `compareFunction` 可能需要对元素做多次映射以实现排序，尤其当 `compareFunction` 较为复杂，且元素较多的时候，某些 `compareFunction` 可能会导致很高的负载。使用 map 辅助排序将会是一个好主意。基本思想是首先将数组中的每个元素比较的实际值取出来，排序后再将数组恢复。

```js
let arr = ['Delta', 'alpha', 'CHARLIE', 'bravo'];
// 对需要排序的数字和位置的临时存储
let mappedObj = arr.map((item,index)=>{
  return {index:index,value:item.toLowerCase()};
})
// 按照多个值排序数组
mappedObj.sort((a,b)=>{
  return +(a.value>b.value)||+(a.value===b.value)-1;
})
// 根据索引得到排序的结果
let result = mappedObj.map((item)=>{
  return list[item.index]
})
```

排序稳定性

> 自 ES10（EcmaScript 2019）起，[规范](https://tc39.es/ecma262/#sec-array.prototype.sort) 要求 `Array.prototype.sort` 为稳定排序。

也就是说,当有相同排序条件时,按排序之前的位置来排序

```javascript
const students = [
  { name: "Alex",   grade: 15 },
  { name: "Devlin", grade: 15 },
  { name: "Eagle",  grade: 13 },
  { name: "Sam",    grade: 14 },
];


students.sort((firstItem, secondItem) => firstItem.grade - secondItem.grade);

[
  { name: "Eagle",  grade: 13 },
  { name: "Sam",    grade: 14 },
  { name: "Alex",   grade: 15 }, // grade 相同时维持原先的顺序 (稳定排序)
  { name: "Devlin", grade: 15 }, // grade 相同时维持原先的顺序 (稳定排序)
];
```



数组乱序

```javascript
const shuffleArr = arr => arr.sort(() => Math.random() - 0.5)
```



// todo  20220928

https://juejin.cn/post/6971747560784560165



### Array.prototype.toSorted()
通过副本操作数组,非破坏性方法
```js const arr = ['c', 'a', 'b'];
 const result = arr.toSorted();
 console.log(result);  // ['a', 'b', 'c']
 console.log(arr);     // ['c', 'a', 'b']

```

### 数组4方法

> ECMAScript 给数组提供几个方法，让它看起来像是另外一种数据结构
>
> 数组对象可以像栈一样,也就是一种限制插入和删除项的数据结构.
>
> 栈是一种后进先出的结构(LIFO, Last-In-First-Out), 也就是最近添加的项会被先删除. 数据项的插入(push,称为推入)和删除(称为弹出,pop)只在栈的一个地方发生,栈顶. 
>
> ECMAScript 数组提供了push()和pop()方法，以实现类似栈的行为。



### 数组方法分类



#### 迭代器方法

用于迭代数组元素,会按照顺序把数组每个元素传给我们提供的函数,可便于对数组进行迭代,映射,过滤,测试和归并.

##### 特点

* 所有这些方法都接收一个<span style="color:blue">函数</span>作为<span style="color:blue">第一个参数</span>,并对数组每个元素(或某些元素)都调用一次这个函数.
  * 如果数组是稀疏的,则不会对不存在的数组元素调用传入的这个函数
  * 函数接收3个参数:数组元素的值,数组元素的索引,数组本身.
* 多数迭代器方法接收可选<span style="color:blue">第二个参数</span>.其作用是更新第一个参数函数内部的<span style="color:blue">this值</span>
* 函数返回值通常不重要,,但不同方法会以不同方式处理这个值.

##### forEach

* 迭代数组每个元素,并对每个元素都调用一次指定的函数

* forEach并未提供一种终止迭代的方式.没有与常规for循环中的break语句对等的机制

##### map

* 返回函数的返回值组成的数组,不修改调用它的数组.
* 如果数组是稀疏的,则缺失元素不会调用函数,但返回的数组也会与原始数组一样稀疏:长度相同,缺失的元素也相同



##### filter

* 返回一个数组,该数组为调用它的数组的子数组
* 传给方法的函数是断言函数,即返回true或false的函数
* 会<span style="color:blue">跳过</span>稀疏数组中缺失的元素,它返回的数组总是密集的,可以清理掉稀疏数组中的空隙

```javascript
//清除稀疏数组中缺失的元素

arr.filter(item => item)
arr.filter(() => true)

// 既清理空隙又删除值为undefined/null 的元素
arr.filter(item => item!==undefined && item !== null)
```



##### find/fineIndex

* 与filter函数相似,表现在它们都是遍历数组,寻找断言函数返回真值的元素
* 不同的是,这俩方法会在找到第一个元素时停止迭代
* 如果没有找到匹配的元素,find返回undefined, findIndex返回-1



##### every/some

* 数组断言方法
* 什么时候停止迭代数组
  * some()方法在断言函数第一次返回true或全部断言函数返回false时
  * every()方法在断言函数第一次返回false或全部断言函数返回true时
* 空数组上调用,按照数学的传统(??)
  * some, 返回false
  * every, 返回true

##### reduce/reduceRight

* reduce/reduceRight使用我们制定的函数**归并(注入/折叠)**数组元素
* 如果不传初始值,在空数组上调用reduce()会导致TypeError
* 如果数组只有一个值,或者是空数组但有初始值,则会返回这个值,不会调用归并函数
* 不接收用于指定归并函数this值得可选参数
* 使用范围: 只要能够把两个值(比如两个对象)组合成同一个类型值的函数,都可以用作归并函数
* 使用数组归并表达的算法容易复杂化,建议使用常规循环逻辑处理数组更容易阅读,编写和分析.



#### 栈和队列方法

* 通过`push(), pop(), unshift(), shift()`实现栈和队列的方法
* push()和pop()可以把数组当做栈(先进后出)来操作
  * push方法向数组末尾添加一个或多个元素,返回数组新的长度
  * pop方法删除数组最后的元素,返回删除的值
  * 这两个方法都会立刻修改数组
* unshift()和shift()方法可以把数组当做栈来处理
  * unshift在数组开头添加一个或多个元素,已有元素索引相应向更高处索引页移动,返回数组最新长度
    * unshift一次插入和多次插入的顺序不相同.
  * shift删除并返回数组的第一个元素,所有后续元素都向下移动一个位置,以占据数组开头空出的位置.
  * unshift和shift可以实现栈,但效率不如push 和 pop.因为每次在数组开头删除或添加元素都要向上或向下移动元素.
* 最佳实践: 使用push在数组末尾添加,使用shift在数组开头删除来实现队列





#### 子数组方法

使用slice,splice,fill,copyWithin方法,是数组处理连续区域的方法.

##### slice

* slice方法返回数组的切片(slice)或者子数组
* 接收两个参数
* 不会修改原数组



##### splice

* 对数组进行插入和删除,也可以同时执行这两种操作,会修改原数组
* splice参数: 第一个参数是删除或插入的起点位置(不是索引),第二个参数是删除的数量.两个参数之后任意多个参数,表示要在第一个参数指定的位置插入数组的元素
* splice返回被删除的元素的数组,如果没有删除元素则返回<u>空数组</u>



##### fill

* fill方法将数组的元素或切片设置为指定的值.
* 会修改调用它的数组
* 返回修改后的数组
* 第一个参数是要把数组元素设置成的值,可选的第二个参数指定起始索引,省略则从0开始填充.可选第三个参数指定终止索引,不包含这个索引.



##### copyWithin

* 把数组切片复制到数组中的新位置
* 会修改数组并返回修改后的数组,但不会改变数组的长度.
* 第一个参数指定要把第一个元素复制到的目的索引
* 第二个参数指定要复制的第一个元素的索引.如果省略第二个参数,则默认值为0.
* 第三个参数指定要复制的元素切片的终止索引.如果省略,使用数组的长度



#### 其他方法(打平,添加, 数组转字符串)

##### flat

* flat方法用于创建并返回一个新数组,这个新数组包含与它调用flat的数组相同的元素,如果元素是数组会被打平
* 不传参调用,只会打平一级嵌套.如果想要打平更多层级,需要传一个数值参数



##### flatMap

* 与map方法相似,返回的数组自动被打平.



##### concat



##### 数组转字符串

Array定义了3个数组转字符串的方法: join toString toLocaleString



##### 作为数组的字符串

* JS字符串的行为类似utf-16字符的只读数组,除了使用charAt访问个别数组,还可以使用方括号语法
* 字符串与数组行为类似也意味着,可以对字符串使用数组的方法
* 字符串是不可修改值,尝试用数组的方法修改字符串并不会导致错误,静默失败



#### 索引和排序方法

数组实现与字符串的同名方法类似的indexOf,lastIndexOf,includes方法.

##### indexOf/lastIndexOf

* 从数组中搜索指定的值并返回第一个找到的元素的索引,如果没有找到则返回`-1`. 如果字符串这俩方法第二个参数为负值,会被当成0.
* indexOf从前到后;lastIndexOf从后到前
* 使用`===`全等运算符来比较参数和数组元素.
  * 如果比较的对象,则比较的是对象的地址
  * 如果想查找对象的内容,可以使用find方法并传入自定义的断言函数
* 都接收第二个参数,起始搜索位置.如果不传,indexOf从开头,lastIndexOf从末尾开始. 参数可以是负值,相对于数组末尾的偏移.



```javascript
//使用indexOf方法获取数组中与参数相同元素的所有索引值


function filterIndex(arr, x) {
  let len = arr.length
  let idx = 0
  let res = []
  
  while (idx < len) {
    idx = arr.indexOf(x, idx)
    
    if (idx === -1) {
      break
    }
    
    res.push(idx)
    idx++
  }
}



//其他方法
arr.filter((item,idx) => item===x && res.push(idx))
arr.reduce((acc, pre, idx) => {
  if (pre===x) acc.push(idx)
}, [])
```



##### includes

* 测试元素是否属性某个数组,返回布尔值
* 与indexOf方法的区别
  * indexOf使用`===`操作符同样的算法测试相等性,该相等性算法将非数值看成与其他值都不一样,包括与自身也不一样.
  * includes使用稍微不同的相等测试,认为NaN与自身相等.



##### sort

* sort方法对数组进行就地排序并返回排序后的数组
* 在不传参调用时,按字母顺序对数组元素进行排序(如有必要,临时将它们转换为字符串再比较
* 如果数组包括未定义的元素,它们会被排到数组的末尾
* 要对数组元素进行非字母顺序的排序,必须传入一个比较函数作为参数.
  * 这个函数决定它的两个参数哪一个在排序后的数组中应该出现在前面
  * 如果要第一个参数在前, 第二个参数在后, 比较函数应该返回一个小于0的数值
  * 如果要第一个参数要出现在第二个参数后面, 比较函数应该返回一个大于0的数值
  * 如果两个值相等,则比较函数应该返回0.
* 如果对字符串数组做不区分大小写的字母序排序,传入的比较函数应该使用toLowerCase()方法,将其两个参数都转换为小写,再比较.



##### reverse

* 翻转数组元素的顺序,并返回反序后的数组







# 数组方法

数组方法之多，大致可以分为

* **改变数组本身**
* **不改变数组本身**的(返回一个新的数组)
* **其他**对数组本身功能性作用的方法





## 方法分类

| 破坏性方法                | 返回值                                       |
| ------------------------- | -------------------------------------------- |
| Array.prototype.splice()  | 用于插入,删除或替换数组的元素                |
| Array.prototype.push()    | 向数组末尾添加1个或多个元素,返回数组新的长度 |
| Array.prototype.pop()     | 删除并返回数组最后一个元素                   |
| Array.prototype.unshift() | 向数组开头添加1个或多个元素,返回数组新的长度 |
| Array.prototype.shift()   | 删除并返回数组的第一个元素                   |
| Array.prototype.reverse() | 反转数组的元素顺序                           |
| Array.prototype.sort()    | 对数组元素进行排序                           |



| 非破坏性方法名称                      | 返回值                                                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Array.prototype.toString()    | 字符串                                                                                                                                                       |
| Array.prototype.slice()       | 对数组进行截取,返回截取的数组                                                                                                                                           |
| Array.prototype.concat()      | 连接2个或多个数组,并返回结果                                                                                                                                           |
| Array.prototype.join()        | 将一个数组（或一个[类数组对象](https://developer.mozilla.org/zh-CN_docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的所有元素连接成一个字符串并返回这个字符串 |
| Array.prototype.some()        | 检测数组中是否有元素符合指定条件                                                                                                                                          |
| Array.prototype.every()       | 检测数组元素是否都符合条件                                                                                                                                             |
| Array.prototype.filter()      | 返回符合检测条件的元素并返回符合条件的所有元素组成的数组                                                                                                                              |
| Array.prototype.map()         | 通过指定函数处理每个元素,并解放者处理后的数组                                                                                                                                   |
| Array.prototype.valueOf()     | 返回数组对象的原始值                                                                                                                                                |
| Array.prototype.reduce()      |                                                                                                                                                           |
| Array.prototype.reduceRight() |                                                                                                                                                           |
| Array.prototype.copyWithin()  |                                                                                                                                                           |
| Array.prototype.fill()        |                                                                                                                                                           |
| Array.prototype.flatMap()     |                                                                                                                                                           |
| Array.prototype.with()        | 兼容性不好,node>20                                                                                                                                             |
| Array.prototype.toReversed()  | 兼容性不好                                                                                                                                                     |
| Array.prototype.toSroted()    | 兼容性不好                                                                                                                                                     |
| Array.prototype.toSpliced()   | 兼容性不好                                                                                                                                                     |



| 功能性方法                       | 说明       |
| -------------------------------- | ---------- |
| forEach                          |            |
| Array.from()                     |            |
| Array.fromAsync()                |            |
| Array.isArray()                  |            |
| Array.prototype.includes()       |            |
| Array.prototype.indexOf()        |            |
| Array.prototype.lastIndexOf()    |            |
| Array.prototype.find()           |            |
| Array.prototype.findIndex()      |            |
| Array.prototype.findLast()       | 兼容性问题 |
| Array.prototype.findLstIndex     | 兼容性问题 |
| Array.prototype.at()             | 兼容性问题 |
| Array.of()                       |            |
| Array.prototype.flat()           |            |
| Array.prototype.every()          |            |
| Array.prototype.some()           |            |
| Array.prototype.join()           |            |
| Array.prototype.toString()       |            |
| Array.prototype.toLocaleString() |            |
| Array.prototype.entries()        |            |
| Array.prototype.keys()           |            |
| Array.prototype.values()         |            |






## Array.prototype.splice-删除 替换 新增

**定义**

**`splice()`** 方法通过**删除或替换**现有元素或者**原地添加**新的元素来修改数组,并以数组形式返回被修改的内容。此方法会改变原数组。

**参数**

```javascript
array.splice(start[, deleteCount[, item1[, items[, ...]]]])
```

`start`

* 如果为空. 则返回一个空数组
* 指定修改的开始位置（从0计数）。可以将其视为新的长度.
* 如果超出了数组的长度，则从数组末尾开始添加内容；
* 如果是负值，则表示从数组末位开始的第几位（从-1计数，这意味着-n是倒数第n个元素并且等价于`array.length-n`）；
* 如果负数的绝对值大于数组的长度，则表示开始位置为第0位。

`deleteCount` 可选

* 整数，表示要移除的数组元素的个数。
* 如果 `deleteCount` 大于 `start` 之后的元素的总数，则从 `start` 后面的元素都将被删除（含第 `start` 位）。
* 如果 `deleteCount` 被省略了，或者它的值大于等于`array.length - start`(也就是说，如果它大于或者等于`start`之后的所有元素的数量)，那么`start`之后数组的所有元素都会被删除。
* 如果 `deleteCount` 是 0 或者负数，则不移除元素。返回空数组.

`item1, item2,...`

* 要添加进数组的元素,从`start` 位置开始。如果不指定，则 `splice()` 将只删除数组元素

**返回值**

由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。

**实例**

```javascript
1.从第2位开始删除1个元素,插入'drum'
let myFish = ['angel',"clown", "mandarin", "sturgeon"]
myFish.splice(2,1,'drum')

2.从倒数第2位开始删除1个元素
var myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];
var removed = myFish.splice(-2, 1);
// 运算后的 myFish: ["angel", "clown", "sturgeon"]
// 被删除的元素: ["mandarin"]

```



**代码实现** ????

```js
// https://juejin.cn/post/6844903986479251464#heading-39


```





## Array.prototype.push()

**定义**

`**push()**` 方法将<u>一个或多个元素</u>添加到数组的末尾，并返回该数组的**新长度**

**返回值**

新的`length`属性

**描述**

`push` 方法具有通用性。该方法和 [`call()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 或 [`apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 一起使用时，可应用在类似数组的对象上。`push` 方法根据 `length` 属性来决定从哪里开始插入给定的值。如果 `length` 不能被转成一个数值，则插入的元素索引为 0，包括 `length` 不存在时。当 `length` 不存在时，将会创建它。

唯一的原生类数组（array-like）对象是 [`Strings`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)，尽管如此，它们并不适用该方法，因为字符串是不可改变的。

**实例**

向对象中添加属性
```js
let a = {}
Array.prototype.push.call(a, 'first')

alert(a.length) // 1
alert(a[0]) //'first'

//根据下面push源码可以发现, 传入的对象至少要满足两个条件:
1.对象本身可以存取属性
2.对象length属性可读写
```

向数组中添加元素

```javascript
let sports = ['soccer', 'baseball']
let total = sports.push('football', 'swimming')

console.log(sports)  // ['soccer', 'baseball', 'football', 'swimming']
console.log(total)   // 4
```

合并两个数组

```javascript
let vegetables = ['parsnip', 'potato']
let moreVegs = ['celery', 'beetroot']

// Merge the second array into the first one
vegetables.push(...moreVegs);

//另一种写法
Array.prototype.push.apply(vegetables, moreVegs);
[].push.apply(vegetables, moreVegs)
console.log(vegetables)  // ['parsnip', 'potato', 'celery', 'beetroot']

//也可以使用concat()方法
let vegetables = ['parsnip', 'potato']
let moreVegs = ['celery', 'beetroot']
let result = vegetables.concat(moreVegs);
console.log(result); // ['parsnip', 'potato', 'celery', 'beetroot']
```


用类数组方式使用对象([Using an object in an array-like fashion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push#using_an_object_in_an_array-like_fashion))

`push`是通用的,`Array.prototype.push`也能在对象上使用.

我们无需创建一个数组来存储对象集合,反而,我们可以用对象集合存储它自己,在`Array.prototype.push`上使用`call`来调用, ,让方法认为在处理数组. 

```javascript
let obj = {
  length: 0,
  addElem: function addElem(elem) {
    // obj.length is automatically incremented
    // every time an element is added.
    [].push.call(this, elem);
  }
};

obj.addElem({});
obj.addElem({});

console.log(obj.length); //2
```



**实现**

```javascript
//https://juejin.cn/post/6844903986479251464#heading-39

Array.prototype.push = function(...items) {
  let O = Object(this)
  let len = O.length >>> 0
  let argCount = items.length >>> 0
  // 2** 53-1 为JS能表示的最大的数
  if (len+argCount > 2**53-1) {
    throw new TypeError('The number of array is over the max value restricted!')
  }
  
  for (let i=0; i<argCount; i++) {
    O[len+i] = items[i]
  }
  
  let newLength = len + argCount
  O.length = newLength
  
  return newLength
}

// v8引擎中的实现
function ArrayPush() {
		var n = TO_UINT32( this.length );    // 被push的对象的length
		var m = %_ArgumentsLength();     // push的参数个数
		for (var i = 0; i < m; i++) {
			this[ i + n ] = %_Arguments( i );   // 复制元素     (1)
		}
		this.length = n + m;      // 修正length属性的值    (2)
		return this.length;
};
```



## Array.prototype.pop

**定义**

`**pop()**`方法从数组中删除最后一个元素，并返回该元素的值。此方法更改数组的长度。

**返回值**

从数组中删除的元素(当数组为空时返回[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined))。

**描述**

`pop` 方法有意具有通用性。该方法和 [`call()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 或 [`apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 一起使用时，可应用在类似数组的对象上。`pop`方法根据 `length`属性来确定最后一个元素的位置。如果不包含`length`属性或`length`属性不能被转成一个数值，会将`length`置为0，并返回`undefined`。

如果你在一个空数组上调用 pop()，它返回  [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。





## Array.prototype.unshift()

> 队列解构  先进先出   待补充

**定义**

**`unshift()`** 方法将一个或多个元素添加到数组的**开头**，并返回该数组的**新长度**(该方法修改原有数组**)**。

**Syntax**

```javascript
unshift(element0)
unshift(element0, element1, ...,elementN)
```

**Return value**

this new length property of the object upon which the method was called.



**描述**

`unshift` 方法会在调用它的<u>类数组对象</u>的开始位置插入给定的参数。 (数组, arguments对象)

`unshift` 特意被设计成具有通用性；这个方法能够通过 [`call`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 或 [`apply`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 方法作用于类数组对象上。不过对于没有 length 属性的对象，调用该方法可能没有任何意义。

注意, 如果传入多个参数，它们会被以块的形式插入到对象的开始位置，它们的顺序和被作为参数传入时的顺序一致。 于是，传入多个参数调用一次 `unshift` ，和传入一个参数调用多次 `unshift` (例如，循环调用)，它们将得到不同的结果.

**实例**

```javascript
let arr = [4,5,6];
arr.unshift(1,2,3);
console.log(arr); // [1, 2, 3, 4, 5, 6]

arr = [4,5,6]; // 重置数组
arr.unshift(1);
arr.unshift(2);
arr.unshift(3);
console.log(arr); // [3, 2, 1, 4, 5, 6]
```



**实现**

```javascript
// https://juejin.cn/post/6844903986479251464#heading-39

//自己的
Array.prototype.pop = function() {
  let O = Object(this)
  let len = O.length >>> 0
   
  let deleteItem = O[len - 1]
  
  O.length = len - 1;
  
  return deleteItem;
}

//完善的
Array.prototype.pop = function() {
  let O = Object(this)
  let len = O.length >>> 0
  
  if (len === 0) {
		O.length = 0 //???
    return undefind
  }
  
  len--
  let value = O[len]
  delete O[len]
  O.length = len
  return value
}
```



## Array.prototype.shift()

**定义**

`shift()` 方法从数组中删除**第一个**元素，并返回该元素的值。此方法更改数组的长度。

**返回值**

从数组中删除的元素; 如果数组为空则返回[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined) 。

**描述**

`shift` 方法移除索引为 0 的元素(即第一个元素)，并返回被移除的元素，其他元素的索引值随之减 1。如果 [`length`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/length) 属性的值为 0 (长度为 0)，则返回 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。

`shift` 方法并不局限于数组：这个方法能够通过 [`call`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 或 [`apply`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 方法作用于类似数组的对象上。

**实例**

```javascript
//shift() 方法经常用于while loop的环境中.。下例中每个循环将要从一个数组中移除下一项元素，直至它成为空数组。

var names = ["Andrew", "Edward", "Paul", "Chris" ,"John"];

while( (i = names.shift()) !== undefined ) {
    console.log(i);
}
// Andrew, Edward, Paul, Chris, John
```



## Array.prototype.reverse()

**定义**

`reverse()` 方法将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组。

**参数**

```javascript
arr.reverse()
```

**返回值**

颠倒后的数组。

**描述**

* `reverse` 方法颠倒数组中元素的位置，改变了数组，并返回该数组的引用
* reverse方法是特意类化的；此方法可被 [called](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 或 [applied](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)于类似数组对象。
* 对象如果不包含反映一系列连续的、基于零的数值属性中的最后一个长度的属性，则该对象可能不会以任何有意义的方式运行。

**重写**

```javascript
Array.prototype.myReverse = function() {
  let temp;
  
  //偶数
  if (this.length % 2 === 0) {
    for (let i=0; i<this.length/2; i++) {
      temp = this[i];
      this[i] = this[this.length-1-i];
      this[this.length-1-i] = temp;
      temp = null;
    }
  }
  
  
  //奇数
  if (this.length % 2 !== 0) {
    for (let i=0; i<=Math.ceil(this.length / 2); i++) {
    	if (Math.ceil(this.length/2) === i) {
        this[i] = this[i]
      }
      
      temp = this[i];
      this[i] = this[this.length-1-i];
      this[this.length-1-i] = temp;
      temp = null;
    }
  }
  
  return this;
}
```



**实例**

颠倒类数组中的元素

```javascript
const a = {0: 1, 1: 2, 2: 3, length: 3};

console.log(a); // {0: 1, 1: 2, 2: 3, length: 3}

Array.prototype.reverse.call(a); //same syntax for using apply()
[].reverse.call(a)

console.log(a); // {0: 3, 1: 2, 2: 1, length: 3}
```



## Array.prototype.sort() 空











#### 非破坏性方法





#### 功能性方法



## Array.prototype.toString

`**toString()**` 返回一个字符串，表示指定的数组及其元素

```js
Array.prototype.toString()

//描述
-Array对象覆盖了Object的 toString 方法。对于数组对象，toString 方法连接数组并返回一个字符串，其中包含用逗号分隔的每个数组元素。
-当一个数组被作为文本值或者进行字符串连接操作时，将会自动调用其 toString 方法
```



## Array.prototype.forEach

**syntax**

```javascript
forEach(callback, thisArg)
```



**方法重写**

```javascript
Array.prototype.myForEach = function(callback) {
  let _arr = this,
      thisArg = arguments[1] || globalThis;
  
  //判断this是否合法
  if (this === null || this === undefined) {
    return new TypeError("cannot read property of 'myForEach' of null");
  }
  
  //判断callback是否合法
  if (Object.prototype.toString.call(callback).slice(8, -1) !== 'Function') {
    return new TypeError(callback + 'is not a function');
  }
  
  
  for (let i=0; i<_arr.length; i++) {
    callback.call(thisArg, _arr[i], i, _arr);
  }
}
```



## Array.prototype.slice-截取

**定义**

`**slice()**` 方法返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的**浅拷贝**（包括 `begin`，不包括`end`）。原始数组不会被改变。

**Syntax**

```javascript
slice()
slice(start)
slice(start, end)
```



**参数**

`begin` 可选

* 提取起始处的索引（从 `0` 开始），从该索引开始提取原数组元素。

* 如果该参数为负数，则表示从原数组中的倒数第几个元素开始提取

* 如果省略 `begin`，则 `slice` 从索引 `0` 开始。

* 如果 `begin` 超出原数组的索引范围，则会返回空数组。

`end`  可选

* 提取终止处的索引（从 `0` 开始），在该索引处结束提取原数组元素
* 如果该参数为负数， 则它表示在原数组中的倒数第几个元素结束抽取
* 如果 `end` 被省略，则 `slice` 会一直提取到原数组末尾。包括最后一个
* 如果 `end` 大于数组的长度，`slice` 也会一直提取到原数组末尾.

**返回值**

一个含有被提取元素的新数组

**描述**

`slice` 不会修改原数组，只会返回一个浅复制了原数组中的元素的一个新数组。原数组的元素会按照下述规则拷贝：

* 如果该元素是个对象引用 （不是实际的对象），`slice` 会拷贝这个对象引用到新的数组里。两个对象引用都引用了同一个对象。如果被引用的对象发生改变，则新的和原来的数组中的这个元素也会发生改变。
* 对于字符串、数字及布尔值来说（不是 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)、[`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) 或者 [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 对象），`slice` 会拷贝这些值到新的数组里。在别的数组里修改这些字符串或数字或是布尔值，将不会影响另一个数组。

<u>如果向两个数组任一中添加了新元素，则另一个不会受到影响。</u>

```javascript
let obj = {a: 'a', b: 'b'},
    arr = [1, obj, {c: 'c'}];

let result = arr.slice();

obj['a'] = 'aa';
console.log(result);  //[1, {a: 'aa', b: 'b'}, {c: 'c'}]
```



**实例**

0.访问数组最后一位
```js
const lastItem = arr => arr.slice(-1)[0]
```

1.复制数组

```JavaScript
//复制整个数组的方法
	arr.slice()
	arr.slice('')  //非数字类型参数下相当于没传递参数
	arr.slice(0)
```

2.类数组转换为真数组

```javascript
//es5
let arrLike = {0:0, 1:1, 2:2, length: 3};
let arr = Array.prototype.slice.call(arrLike);
let result = [].slice.call(arrLike);

//es6
Array.of(arguments)
```

3.将字符串第一个字符变小写
```js
const lowerCaseFirst = str => `${str.charAt(0).toLowerCase()}${str.slice(1)}`
```

4.将表格数据处理为分页形式
```js
// 背景信息: 前端接口没有分页, 请求回来的数据是全部数据. 利用分页数据(当前页,页面数量)更新来截取并展示数组的数据

function handleTableData(page, size, total, tableData) {
  if (page * size <= total) {
    return tableData.slice((page - 1) * size, page * size);
  } else {
    return tableData.slice((page - 1) * size, total);
  }
}
```

**代码实现**

```js
Array.prototype.mySlice = function(start, end) {
  let arr = this;
  let newArr = [];
  
  start = start || 0;
  end = end || arr.length;
  start = start < 0 ? 0 : start;
  end = end + arr.length < 0 ? 0 : end + length;
  if (end > arr.length) end = arr.length;
  
  if (start > arr.length || end === 0) {
    return newArr;
  }
  
  for (let i=start; i<end; i++) {
    newArr.push(arr[i]);
  }
  return newArr;
}
```






## Array.prototype.toSpliced()
通过副本进行操作.非破坏性方法.

## Array.prototype.concat()

**定义**

**`concat()`** 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组

**参数**

```javascript
var new_array = old_array.concat(value1[, value2[, ...[, valueN]]])
```

`valueN` 可选

数组和/或值，将被合并到一个新的数组中。如果省略了所有 `valueN` 参数，则 `concat` 会返回调用此方法的现存数组的一个<u>浅拷贝</u>。

**返回值**

新的 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 实例

**描述**

* `concat`方法创建一个新的数组，它由被调用的对象中的元素组成，每个参数的顺序依次是该参数的元素（如果参数是数组）或参数本身（如果参数不是数组）。它不会递归到嵌套数组参数中。
* `concat`方法不会改变`this`或任何作为参数提供的数组，而是返回一个浅拷贝，它包含与原始数组相结合的相同元素的副本。 原始数组的元素将复制到新数组中:
  * 对象引用（而不是实际对象）：`concat`将对象引用复制到新数组中。 原始数组和新数组都引用相同的对象。
  * 数据类型如字符串，数字和布尔（不是[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)，[`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) 和 [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 对象）：`concat`将字符串和数字的值复制到新数组中
  * 对于新数组的任何操作（仅当元素不是对象引用时）都不会对原始数组产生影响，反之亦然。

**实例**

连接3个数组

```javascript
var num1 = [1, 2, 3],
    num2 = [4, 5, 6],
    num3 = [7, 8, 9];

var nums = num1.concat(num2, num3);

console.log(nums);
// results in [1, 2, 3, 4, 5, 6, 7, 8, 9]


let arr = [1,2,3];
let res = arr.concat(4,5,[6,7],8,{a: 9});
console.log(res); //[1,2,3,4,5,6,7,8,{a:9}]
```

连接对象

```javascript
//合并对象
let obj ={a:2}
let arr=[1,2,3]
let result = arr.concat(obj);
console.log(result);//[1,2,3,{a:2}]
```

浅拷贝验证

```javascript
let arr=[1,2,3,{a:4}];
let result=arr.concat();
arr[3].a=5;
console.log(arr, result);
//[1, 2, 3,{a:5}] [1, 2, 3,{a:5}]
```



**代码实现**

```js
//代码实现

Array.prototype.concat=function(){
  let length = arguments.length;
  let result = this;
  if(length===0){
    return result;
  }else{
    for(let i=0;i<length;i++){
      if(Array.isArray(arguments[i])){
        result.push(...arguments[i])
      }else{
        result.push(arguments[i])
      }
    }
    return result;
  }
}
```





  



## Array.prototype.indexOf()

**定义**

`indexOf()`方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1

**参数**

```javascript
arr.indexOf(searchElement[, fromIndex])
```

`searchElement`

* 要查找的元素

`fromIndex` 可选

* 开始查找的位置。包括查找的位置
* 如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回-1
* 如果参数中提供的索引值是一个负值，则将其作为数组末尾的一个抵消或者通过(length+负值)得出
* 如果参数中提供的索引值是一个负值，并不改变其查找顺序，查找顺序仍然是从前向后查询数组

**返回值**

首个被找到的元素在数组中的索引位置; 若没有找到则返回 -1.

**描述**

* `indexOf` 使用[strict equality (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#using_the_equality_operators) (无论是 ===, 还是 triple-equals操作符都基于同样的方法)进行判断 `searchElement与`数组中包含的元素之间的关系
* <span style="color:blue">和`includes`类似, `+0`和`-0`是被认为是相等的, 但是`NaN`与`NaN`相反, `indexOf`认为不相等, `includes`认为相等</span>



**重写**

```javascript
Array.prototype.myIndexOf = function(searchItem, fromIndex) {
  if (this.length === 0 || fromIndex >= this.length) {
    return -1;
  }
  if (!searchItem) {
    return new Error('need offer an initial value')
  }
  
  if (fromIndex < 0) {
    fromIndex = fromIndex+this.length < 0 ? 0 : fromIndex+this.length;
  }
  
  for (let i=0; i<this.length; i++) {
    if (searchItem === this[i]) {
      return i;
    }
  }
  return -1;
}
```



**实例**

数组去重

```javascript
let arr = [1,2,3,1,1,4,3,2,5,6,7];
let newArr = [];
arr.forEach(item => {
  if (newArr.indexOf(item) === -1) {
    newArr.push(item);
  }
});
```

找出元素出现的所有位置

```javascript
let arr = [1,2,3,1,1,4,3,2,5,6,7];
let indexArr = [];

function searchIndex(ele, arr) {
  for (let i=0; i<arr.length;) {
    let index = arr.indexOf(ele, i);
    if (index === -1) return;
    indexArr.push(index);
    i = index + 1;
  }
  return indexArr;
}

searchIndex(1, arr)

//另一种方法
let indices = [],
    array = ['a', 'b', 'c', 'd', 'a', 'd'],
    ele = 'a';

let idx = array.indexOf(ele);
while(idx !== -1) {
	indices.push(idx);
  idx = array.indexOf(element, idx + 1);
}
```



**代码实现**

```js
Array.prototype.indexOf=function(item,index){
  let start;
  let flag=false;
  let length = this.length;
  if(!start){
    start=0;
  }else if(start>length){
    start=length;
  }else if(start<0){
    start=length+start;
  }
  
  for(let i=start;i<length;i++){
    if(arr[i]===item){
      flag = true;
      return i;
    }
  }
  if(!flag){
    return -1;
  }
}
```



## Array.prototype.lastIndexOf()

**定义**

`lastIndexOf()` 方法返回指定元素（也即有效的 JavaScript 值或变量）在数组中的最后一个的索引，如果不存在则返回 -1。从数组的后面向前查找，从 `fromIndex` 处开始。

**参数**

```javascript
arr.lastIndexOf(searchElement[, fromIndex])
```

`searchElement`

* 被查找的元素

`fromIndex` 可选

* 从此位置开始逆向查找。
* 默认为数组的长度减 1(`arr.length - 1`)，即整个数组都被查找。
* 如果该值大于或等于数组的长度，则整个数组会被查找。
* 如果为负值，将其视为从数组末尾向前的偏移。
* 即使该值为负，数组仍然会被从后向前查找。
* 如果该值为负时，其绝对值大于数组长度，则方法返回 -1，即数组不会被查找。

**重写**

```javascript
Array.prototype.lastIndexOf = function(searchItem, fromIndex = this.length -1) {
  if (this.length === 0) {
    return new Error("the array's length must greater than 0")
  }
  if (fromIndex < 0 && Math.abs(fromIndex) > this.length) {
    return -1;
  }
  if (fromIndex < 0 && Math.abs(fromIndex) <= this.length) {
    fromIndex = this.length + fromIndex;
  }
  if (fromIndex >= this.length) {
    fromIndex = this.length;
  }
  for (let i=fromIndex; i>=0; i--) {
    if (searchItem === this[i]) {
      return i;
    }
  }
  return -1;
}
```



**返回值**

数组中该元素最后一次出现的索引，如未找到返回-1。

**描述**

`lastIndexOf` 使用[严格相等](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Using_the_Equality_Operators)（strict equality，即 ===）比较 `searchElement` 和数组中的元素

**实例**

用 `lastIndexOf` 查找到一个元素在数组中所有的索引（下标），并使用 [`push`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push) 将所有添加到另一个数组中。

```javascript
let arr = [1,2,3,4,5,1,2,1,3,1,5,2,4,4,1],
    indexArr = [];

function searchIndex(arr, ele) {
  let idx = arr.lastIndexOf(ele);
  while(idx !== -1) {
    indexArr.push(idx);
    if (idx === 0) return;
    idx = arr.lastIndexOf(ele, idx - 1);
  }
}


//另外的方法
let idx = arr.lastIndexOf(ele);
while(idx !== -1) {
  indexArr.push(idx);
  idx = (idx > 0 ? arr.lastIndexOf(ele, idx - 1) : -1);
}

```

数组中有且只有一个且只取第一个此类元素

```javascript
function getNoRepeatParament(s) {
  let arr = s.toLowerCase().split('');
  for (let value of arr) {
    if (arr.indexOf(value) === arr.lastIndexOf(value)) return s[arr.indexOf(value)]
  }
}
```

获取数组中的只出现一次的元素

```javascript

let arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 1, 2, 3, 4];

let filterArr = arr.filter((item, index) => arr.indexOf(item) === arr.lastIndexOf(value));


```



## Array.prototype.join()

**定义**

`**join()**` 方法将一个数组（或一个[类数组对象](https://developer.mozilla.org/zh-CN_docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的所有元素连接成一个字符串并返回这个字符串。如果数组只有一个项目，那么将返回该元素字符串而不使用分隔符。

toString()与join()实现同样的效果

**参数**

```javascript
arr.join([separator])
```

`separator` 可选

* 指定一个字符来分隔数组的每个元素。
* 如果需要，将分隔符转换为字符串。
* 如果缺省该值，数组元素用逗号（`,`）分隔。
* 如果`separator`是空字符串(`""`)，则所有元素之间都没有任何字符。

**返回值**

一个所有数组元素连接的字符串。如果 `arr.length` 为0，则返回空字符串

**描述**

* 所有的数组元素被转换成字符串，再用一个分隔符将这些字符串连接起来。
* 如果一个元素为 `undefined` 或 `null`，它会被转换为空字符串。

**实例**

连接类数组对象

```javascript
Array.prototype.join.call(arguments)
[].join.call(arguments)
```

**代码实现**

```js
//手写代码
当数组调用toString(),String()方法的时候,底层代码也调用了join(),所以使用转换字符换方法重写函数会出现死循环.

Array.prototype.join=function(sep){
  if(!sep){
    sep=','
  }
  let arr = this;
  let newStr = '';
  for(let i=0;i<arr.length;i++){
    newStr += arr[i]+ (arr[i]===arr[length-1]?'':sep)
  }
  return newStr
}
let arr = [1,2,3]
let result = arr.join()
```



  



## Array.prototype.toReversed()
通过副本操作,非破坏性方法
```js
 const arr = ['a', 'b', 'c'];
 const result = arr.toReversed();
 console.log(result); // ['c', 'b', 'a']
 console.log(arr);    // ['a', 'b', 'c']
```


### Array.prototype.map()

**定义**

map()方法返回一个由原数组中每个元素调用一个指定方法后的返回值组成的新数组, 可以改变原数组



**参数**

```javascript
let new_array = arr.map(function callback(currentValue[,index[, array]])) {
  //
}[, thisArg]
```

`callback` 

* 生成新数组元素的函数，使用三个参数：
  * `currentValue` `callback` 数组中正在处理的当前元素。
  * `index`**可选**  `callback` 数组中正在处理的当前元素的索引
  * `array` **可选** `map` 方法调用的数组。
* `thisArg` 可选
  * 执行 `callback` 函数时值被用作`this`

**返回值**

一个由原数组每个元素执行回调函数的结果组成的新数组。

**描述**

* `map` 方法会给原数组中的每个元素都按顺序调用一次  `callback` 函数。
* `callback` 每次执行后的返回值（包括 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)）组合起来形成一个新数组。
*  `callback` 函数只会在有值的索引上被调用；那些从来没被赋过值或者使用 `delete` 删除的索引则不会被调用。
* 如果 `thisArg` 参数提供给`map`，则会被用作回调函数的`this`值。否则[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)会被用作回调函数的`this`值。
* `map `不修改调用它的原数组本身（当然可以在 `callback` 执行时改变原数组）!!!!
* `map` 方法处理数组元素的范围是在 `callback` 方法第一次调用之前就已经确定了。调用`map`方法之后追加的数组元素不会被`callback`访问。
* 如果存在的数组元素改变了，那么传给`callback`的值是`map`访问该元素时的值。在`map`函数调用后但在访问该元素前，该元素被删除的话，则无法被访问到。
* 根据规范中定义的算法，如果被map调用的数组是离散的，新数组将也是离散的保持相同的索引为空。

**实现**

依照 [ecma262 草案](https://link.juejin.cn/?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-array.prototype.map)，实现的map的规范如下:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e311d99e860405~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)



```javascript
//根据草案实现
//https://juejin.cn/post/6844903938890661896#comment
//https://juejin.cn/post/6844903986479251464#heading-39
Array.prototype.map = function(callback, thisArg) {
  
  // 处理数组类型异常
  
  // 处理回调类型异常
  
  //先转换为对象
  let O = Object(this)
  let T = thisArg || undefined
  
  let len = O.length >>> 0
  let A = new Array(len)
  for (let k=0; k<len; k++) {
    //如果使用hasOwnProperty 它只查找私有属性
    if (k in O) {
      let kValue = O[k]
      let mappedValue = callback.call(T,kValue,k,O)
      A[k] = mappedValue
    }
  }
  return A
}


//注意  
//length >>> 0 字面意思右移零位,这里的作用是保证len为数字且为整数.

//为什么使用in查找而不使用hasOwnProperty查找:    in使用原型链查找, 能有效处理稀疏数组的情况  这个地方我是存疑的,如果k不存在于数组O身上,那么在原型上也找不到. 例如 0 in [] 返回的是false
```



```javascript
//V8源码实现  

function ArrayMap(f, receiver) {
  CHECK_OBJECT_COERCIBLE(this, 'Array.prototype.map')
  
  // Pull out the length so that modification to the length in the loop will not affect the looping and side effects are visible
  
  var array = TO_OBJECT(this)
  let length = TO_LENGTH(array.length)
  if (!IS_CALLABLE(f)) throw $make_type_error(kCalledNonCallable, f);
  
  for (var i=0; i<length; i++) {
    if (i in array) {
      var element = array[i]
      %CreateDataProperty(result, i, %_Call(f, receiver, element, i, array))
    }
  }
  
  return result
}
```



```javascript
//简略版

Array.prototype.myMap = function(callback) {
  let arr = this,
      thisArg = arguments[1],
      resArr = [];
  
  // verify this
  if (Object.prototype.toString.call(this).slice(8, -1) !== 'Array') {
    throw new TypeError('the Object type must be an Array');
  }
  // verify callback
  if (arguments.length === 0) {
    throw new TypeError('undefined is not a function');
  }
  
  for (let i=0; i<arr.length; i++) {
    resArr.push(callback.call(thisArg, arr[i], i, arr));
  }
  return resArr;
}
```



**实例**

[使用 map 重新格式化数组中的对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map#使用_map_重新格式化数组中的对象)

```javascript
var kvArray = [{key: 1, value: 10},
               {key: 2, value: 20},
               {key: 3, value: 30}];

var reformattedArray = kvArray.map(function(obj) {
   var rObj = {};
   rObj[obj.key] = obj.value;
   return rObj;
});

// reformattedArray 数组为： [{1: 10}, {2: 20}, {3: 30}],
```

使用技巧

```javascript
["1", "2", "3"].map(parseInt); //[1, NaN, NaN]

["1", "2", "3"].map(parseInt('1', 0));  //十进制 1
["1", "2", "3"].map(parseInt('2', 1));  //基数超范围 NaN
["1", "2", "3"].map(parseInt('3', 2));  //NaN


//解决方案
function returnInt(element) {
  return parseInt(element, 10);
}

['1', '2', '3'].map(returnInt); // [1, 2, 3]
// Actual result is an array of numbers (as expected)

// Same as above, but using the concise arrow function syntax
['1', '2', '3'].map( str => parseInt(str) );

// A simpler way to achieve the above, while avoiding the "gotcha":
['1', '2', '3'].map(Number); // [1, 2, 3]

// But unlike parseInt(), Number() will also return a float or (resolved) exponential notation:
['1.1', '2.2e2', '3e300'].map(Number); // [1.1, 220, 3e+300]
// For comparison, if we use parseInt() on the array above:
['1.1', '2.2e2', '3e300'].map( str => parseInt(str) ); // [1, 2, 3]
```

[Mapping 含 undefined的数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map#mapping_含_undefined的数组)

```javascript
let numbers = [1,2,3,4];
let filterNumbers = numbers.map((num, index) => {
  if (index < 3) return num;
});

console.log(filterNumbers); //[1,2,3,undefined]
```



## Array.prototype.filter()

**定义**

`filter()` 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素.不会改变原数组，它返回过滤后的新数组.

**参数**

```javascript
let newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
```

`callback` 

* 用来测试数组的每个元素的函数。返回 `true` 表示该元素通过测试，保留该元素，`false` 则不保留。它接受以下三个参数：
  * `element`  数组中当前正在处理的元素。
  * `index`  **可选** 正在处理的元素在数组中的索引
  * `array` **可选** 调用了 `filter` 的数组本身

`thisArg` 

* 执行 `callback` 时，用于 `this` 的值。

**返回值**

一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。

**描述**

* `filter` 为数组中的每个元素调用一次 `callback` 函数，并利用所有使得 `callback` 返回 true 或[等价于 true 的值](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy)的元素创建一个新数组。
* `callback` 只会在已经赋值的索引上被调用，对于那些已经被删除或者从未被赋值的索引不会被调用。那些没有通过 `callback` 测试的元素会被跳过，不会被包含在新数组中。
* 如果为 `filter` 提供一个 `thisArg` 参数，则它会被作为 `callback` 被调用时的 `this` 值。否则，`callback` 的 `this` 值在非严格模式下将是全局对象，严格模式下为 `undefined`。
* `filter` 遍历的元素范围在第一次调用 `callback` 之前就已经确定了。在调用 `filter` 之后被添加到数组中的元素不会被 `filter` 遍历到。
* 如果已经存在的元素被改变了，则他们传入 `callback` 的值是 `filter` 遍历到它们那一刻的值。被删除或<u>从来未被赋值的元素</u>不会被遍历到。(null, undefined会被当做元素输出, 空位不会)



**重写**

```javascript
Array.prototype.myFilter = function(callback) {
  let _arr = this,
      thisArg = arguments[1] || window,
      result = [];
  
  for (let i=0; i<_arr.length; i++) {
    if (callback.call(thisArg, _arr[i], i, _arr)) {
      result.push(_arr[i])
    }
  }
  return result;
}
```



**实例**

[过滤 JSON 中的无效条目](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#过滤_json_中的无效条目)

```javascript
//使用 filter() 创建具有非零 id 的元素的 json

var arr = [
  { id: 15 },
  { id: -1 },
  { id: 0 },
  { id: 3 },
  { id: 12.2 },
  { },
  { id: null },
  { id: NaN },
  { id: 'undefined' }
];

var invalidEntries = 0;

function isNumber(obj) {
  return obj !== undefined && typeof(obj) === 'number' && !isNaN(obj);
}

function filterById(item) {
  if (isNumber(item.id) && item.id !== 0) {
    return true;
  }
  invalidEntries++;
  return false;
}

var arrByID = arr.filter(filterByID);

console.log('Filtered Array\n', arrByID);
// Filtered Array
// [{ id: 15 }, { id: -1 }, { id: 3 }, { id: 12.2 }]

console.log('Number of Invalid Entries = ', invalidEntries);
// Number of Invalid Entries = 5
```



## Array.prototype.reduce()

**定义**

`reduce()` 方法对数组中的每个元素执行一个由您提供的**reducer**函数(升序执行)，将其结果汇总为单个返回值。

**参数**

```javascript
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])

Accumulator(acc) 累计器
Current Value(cur)当前值
Current Index(idx)当前索引
Source Array(src)源数组
```

reducer函数的返回值分配给累计器,该返回值在数组的每个迭代中被记住,并最后成为最终的单个结果值.

`callback` 

执行数组中每个值 (如果没有提供 `initialValue则第一个值除外`)的函数，包含四个参数：

* `accumulator` 累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或`initialValue`（见于下方）。
* `currentValue` 数组中正在处理的元素
* `index` **可选** 数组中正在处理的当前元素的索引。 如果提供了`initialValue`，则起始索引号为0，否则从索引1起始。
* `array` **可选** 调用`reduce()`的数组

`initialValue`  **可选**

* 作为第一次调用 `callback`函数时的第一个参数的值。 
* 如果没有提供初始值，则将使用数组中的第一个元素。 
* 在空数组上调用 没有初始值的reduce 将报错。

```javascript
[].reduce(() => {})
//Uncaught TyperError: Reduce of empty array with no initial value 

[].reduce(() => {}, 0) //0
```



**返回值**

函数累计处理的结果

**描述**

* `reduce`为数组中的每一个元素依次执行`callback`函数，不包括数组中被删除或从未被赋值的元素，接受四个参数：
* 回调函数第一次执行时，`accumulator` 和`currentValue`的取值有两种情况：
  * 如果提供了`initialValue`，`accumulator`取值为`initialValue`，`currentValue`取数组中的第一个值；`currentIndex`为`currentValue`的索引值.
  * 如果没有提供 `initialValue`，那么`accumulator`取数组中的第一个值，`currentValue`取数组中的第二个值。
  * 如果没有提供`initialValue`，reduce 会从索引1的地方开始执行 callback 方法，跳过第一个索引。如果提供`initialValue`，从索引0开始。
* 如果数组为空且没有提供`initialValue`，会抛出[`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 。
* 如果数组仅有一个元素（无论位置如何）并且没有提供`initialValue`， 或者有提供`initialValue`但是数组为空，那么此唯一值将被返回并且`callback`不会被执行。

提供初始值通常更安全，正如下面的例子，如果没有提供`initialValue`，则可能有四种输出： !!!!

```javascript
var maxCallback = ( acc, cur ) => Math.max( acc.x, cur.x );
var maxCallback2 = ( max, cur ) => Math.max( max, cur );

// reduce() 没有初始值
[ { x: 2 }, { x: 22 }, { x: 42 } ].reduce( maxCallback ); // NaN
[ { x: 2 }, { x: 22 }            ].reduce( maxCallback ); // 22
[ { x: 2 }                       ].reduce( maxCallback ); // { x: 2 }
[                                ].reduce( maxCallback ); // TypeError

// map/reduce; 这是更好的方案，即使传入空数组或更大数组也可正常执行
[ { x: 22 }, { x: 42 } ].map( el => el.x )
                        .reduce( maxCallback2, -Infinity );
```

**方法重写**

`reduce` 可以理解为「归一」，意为海纳百川，万剑归一



ECMA-262 规范文档实现如下:

> https://tc39.es/ecma262/#sec-array.prototype.reduce

<img src="https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/image.7aj30gv837c0.webp" alt="image" style="zoom: 150%;" />

```javascript
//https://juejin.cn/post/6844903938890661896#heading-3

Array.prototype.reduce = function(callback, initialValue) {
  // 异常处理
  
  let O = Object(this)
  let len = O.length >>> 0
  let k = 0, accumulator
  
  // 新增
  if (initialValue) {
    accumulator = initialValue
  } else {
    // step 4.
    if (len === 0) {
      throw new TypeError('reduce of empty array with no intial value')
    }
    
    // step 8.
    let kPresent = false  //没有找到关于Pk的解释
    while(!kPresent && (k < len)) {
      kPresent = k in O
      if (kPresent) {
        accumulator = O[k]
      }
      k++
    }
  }
  
  while(k < len) {
    if (k in O) {
      let kValue = O[k]
      accumulator = callback.call(undefined, accumulator, kValue, k, O)
    }
    k++
  }
  
  return accumulator
}
```



```javascript
Array.prototype.myReduce = function (callback) {
  let _arr = this,
      accumulator = argument[1],
      i = 0;
  //判断是否存在参数
  if (arguments.length === 0) {
    throw new TypeError('undefined is not a function');
  }
  //判断是否传入初始值
  if (accumulator === undefined) {
    accumulator = _arr[i];
    i++;
  }
  
  for (;i<_arr.length; i++) {
    accumulator = callback(accumulator, _arr[i], i, _arr);
  }
  
  return accumulator;
}
```





**实例**

1.计算数组中元素出现的次数

```js
let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice','Bruce', 'Alice'];
let nameNum = names.reduce((prev,current,index)=>{
  if(current in prev){
    prev[current]++;  //pre[current] = pre[current] + 1;
  }else{
    prev[current]=1;
  }
  return prev;
},{})
console.log(nameNum); //{ Alice: 3, Bob: 1, Tiff: 1, Bruce: 2 }


// 其他方法 20220928  麻烦

[1,2,3,4,2,3,4].reduce((acc, crt) => 
	crt in acc
  ? Object.assign(acc, {[crt]: acc[crt]++})
  : Object.assing(acc, {[crt]: 1})                    
	, {})
```



2.数组去重

```js
let arr = [1,2,3,4,4,1]
let newArr = arr.reduce((prev,current)=>{
    if(!prev.includes(current)){
        return prev.concat(current)  //push也可以
    }else{ //else没有必要
        return prev;
    }
},[])

//简化
arr.reduce((prev, crt) => !prev.includes(crt) ? prev.concat(crt) : prev [])
```



3. 二维数组转换成一维数组

```js
let arr = [[0, 1], [2, 3], [4, 5]]
let newArr = arr.reduce((prev,current)=>{
    return prev.concat(current)
},[]);

console.log(newArr)
```



4. 多维数组转换成一维数组

```js
// 递归 recursion
// flat
let arr = [[0, 1], [2, 3], [4,[5,6,7]]]
let newArr = function(arr){
    return arr.reduce((prev,current)=>{
        return prev.concat(Array.isArray(current)?newArr(current):current);
    },[])
}


arr.reduce((acc, crt) =>
	Array.isArray(crt)
    	? acc.concat(crt.flat(Infinity))
        : acc.concat(crt)
,[])

```



5.对象里的属性求和

```js
var result = [
    {
        subject: 'math',
        score: 10
    },
    {
        subject: 'chinese',
        score: 20
    },
    {
        subject: 'english',
        score: 30
    }
];

let sum = result.reduce((prev, current) => {
    return prev+current.score
},0)

console.log(sum)
```



6.数组转换成对象

```js
//数组1
let arr = ['1', '2', '3', '4', '1', '2', '4'];
let obj = arr.reduce((prev,current,index)=>{
  return Object.assign(prev,{[index]:current});
},{});

console.log(obj);
{
  '0': '1',
  '1': '2',
  '2': '3',
  '3': '4',
  '4': '1',
  '5': '2',
  '6': '4'
}

//数组2
将它转化为一个根据id值作为key，将数组每项作为value的对象
const userList = [
  {
    id: 1,
    username: 'john',
    sex: 1,
    email: 'john@163.com'
  },
  {
    id: 2,
    username: 'jerry',
    sex: 1,
    email: 'jerry@163.com'
  },
  {
    id: 3,
    username: 'nancy',
    sex: 0,
    email: ''
  }
];

let obj = userList.reduce((prev,current)=>{
  return {...prev,[current.id]:current}
},{})
console.log(obj)
```

7.按属性对object分类

```js
var people = [
    { name: 'Alice', age: 21 },
    { name: 'Max', age: 20 },
    { name: 'Jane', age: 20 }
];
  
function groupBy(objArray, property) {
    return objArray.reduce((acc, current) => {
        let key = current[property];
        if (!acc[key]) {
            acc[key]=[]
        }
        acc[key].push(current);
        return acc;
    },{})
}

let a = groupBy(people, 'age')
console.log(a)

//这个地方如果使用三元表达式的话,要比函数体的形式麻烦很多
function groupBy(arr, key) {
  return arr.reduce((acc, crt) => acc[crt[key]]?
                    {...acc, crt[key]:acc[crt[key]].concat(crt)}:
                    {...acc, crt[key]:[crt]}
                    ,{})
}
//上面对象键要求是字符串,JS中的已使用的字符会造成解释器混乱报错


{
  '20': [ { name: 'Max', age: 20 }, { name: 'Jane', age: 20 } ],
  '21': [ { name: 'Alice', age: 21 } ]
}

//20211203
function classifyObj(arr, property) {
  return arr.reduce((acc, cur) => {
    if (cur[property] in acc) {
      acc[property] = acc[property].concat(cur);
    } else {
      acc[property] = [].concat(cur[property]);
    }
    
    returrn acc;
  }, {})
}
```

8.[使用展开运算符和initialValue绑定包含在对象数组中的数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#使用展开运算符和initialvalue绑定包含在对象数组中的数组)

```javascript
var friends = [
  {
    name: 'Anna',
    books: ['Bible', 'Harry Potter'],
    age: 21
  }, 
  {
    name: 'Bob',
    books: ['War and peace', 'Romeo and Juliet'],
    age: 26
  }, 
  {
    name: 'Alice',
    books: ['The Lord of the Rings', 'The Shining'],
    age: 18
  }
];

//输出结果
// allbooks = [
//   'Alphabet', 'Bible', 'Harry Potter', 'War and peace',
//   'Romeo and Juliet', 'The Lord of the Rings',
//   'The Shining'
// ]

let result1 = frineds.reduce((acc, cur) => {
  return acc.concat(cur.books)
}, ['Alphabet'])

let result2 = friends.reduce((acc, cur) => {
  //acc.push(...cur.books)
  //return acc
  return [...acc, ...cur.books]
}, ['Alphabet'])
```

9.数组去重

```javascript
let myArray = ['a', 'b', 'a', 'b', 'c', 'e', 'e', 'c', 'd', 'd', 'd', 'd'];
let myOrderedArray = myArray.reduce((acc, cur) => {
  if (!acc.includes(cur)) {  //(acc.indexOf(cur) === -1)
    acc.push(cur)
  }
  return acc;
}, []);

//其他方法
let arr = [1,2,1,2,3,5,4,5,3,4,4,4,4];
let result = arr.sort().reduce((init, current) => {
    if(init.length === 0 || init[init.length-1] !== current) {
        init.push(current);
    }
    return init;
}, []);
console.log(result); //[1,2,3,4,5]


```

9.按顺序运行Promise !!!!????

```javascript
function runPromiseInSequence(arr, input) {
  return arr.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(input)
  );
}

// promise function 1
function p1(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 5);
  });
}

// promise function 2
function p2(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 2);
  });
}

// function 3  - will be wrapped in a resolved promise by .then()
function f3(a) {
 return a * 3;
}

// promise function 4
function p4(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 4);
  });
}

const promiseArr = [p1, p2, f3, p4];
runPromiseInSequence(promiseArr, 10)
  .then(console.log);   // 1200
```

10.使用reduce实现map ????!!!!

```javascript
if (!Array.prototype.mapUsingReduce) {
  Array.prototype.mapUsingReduce = function(callback, thisArg) {
    return this.reduce((mapperdArray, currentValue, index, array) => {
      mappedArray[index] = callback.call(thisArg, currentValue, index, array)
      return mapeedArray;
    }, [])
  }
}


[1,2,,3].mapUsingReduce((cur, idx, arr) => cur + index + array.length)
//[5,7,,10]
```


11.获取所有cookie并转为对象
```js
const getCookies = () => document.cookie
	.split(';')
	.map(item => item.split('='))
	.reduce((acc, [k,v]) => acc[k.trim().replace('"','') && acc, {})
```


12.将URL参数转换为对象
```js
const getUrlParams = query = Array.from(new URLSearchParams(query)).reduce((acc,[k,v]) => Object.assign({}, p, {[k]: p[k] ? (Array.isArray(p[k]) ? p[k] : [p[k]]).concat(v) : v}),{})
```


13.将数组转换为对象
```js
const arrayToObject = (arr, key) => arr.reduce((acc, crt) => ({...acc, [acc[key]]:crt}), {})

const arrToObject2 = (arr, key) => arr.reduce((acc, crt) => {
	acc[crt[key]] = crt
	return acc
}, {})
```

14.将数组按照属性计数
```js
const countBy = (arr, prop) => arr.reduce((acc,crt) => ((acc[crt[prop]] = ++acc[crt[prop]] || 1),acc) {})
```

15.反转对象的key-value
```js
const invert = obj => Object.keys(obj).reduce((acc,crt) => ({...acc,acc[obj[key]]:key}), {})

const invert2 = obj => Object.keys(obj).reduce((acc,crt) => Object.assign(acc,{obj[key]:key}))
```

16.其它
```js
//从对象中删除值为null/undefined

const removeNullAndUndefined = obj => 
	Object.entries(obj).reduce((acc,[k,v]) => v==null ? (a : (a[key]:v),a)), {})
```


## Array.prototype.some

**定义**

`**some()**` 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个Boolean类型的值。

如果用一个空数组进行测试，在任何情况下它返回的都是`false`。

```javascript
[].some(()=>{})  //false
```

**参数**

```javascript
arr.some(callback(element[, index[, array]])[, thisArg])
```

`callback` 

* 用来测试每个元素的函数，接受三个参数：
  * `element` 数组中正在处理的元素
  * `idx` **可选** 数组中正在处理的元素的索引值
  * `array` **可选** 调用`some()`的当前数组

`thisArg` **可选**

* 执行 `callback` 时使用的 `this` 值

我们来看下this的几种情况:

```javascript
//thisArg存在, callback参数中即使没有传递也可以访问 当然是没有call
[1].some(function () {console.log(this), [1,2,3]) //[1,2,3]

//
```



**返回值**

* 数组中有至少一个元素通过回调函数的测试就会返回**`true`**；所有元素都没有通过回调函数的测试返回值才会为false。
* 如果是空数组,返回false

**描述**

* `some()` 为数组中的每一个元素执行一次 `callback` 函数，直到找到一个使得 callback 返回一个“真值”（即可转换为布尔值 true 的值）。如果找到了这样一个值，`some()` 将会立即返回 `true`。否则，`some()` 返回 `false`。
* `callback` 只会在那些”有值“的索引上被调用，不会在那些被删除或从来未被赋值的索引上调用。
* 如果一个`thisArg`参数提供给some()，它将被用作调用的 `callback`的 `this` 值。否则， 它的 `this` value将是 `undefined`。
* `some()` 被调用时不会改变数组
* `some()` 遍历的元素的范围在第一次调用 `callback`. 前就已经确定了。
* 在调用 `some()` 后被添加到数组中的值不会被 `callback` 访问到。
* 如果数组中存在且还未被访问到的元素被 `callback` 改变了，则其传递给 `callback` 的值是 `some()` 访问到它那一刻的值。已经被删除的元素不会被访问到

**重写**

```javascript
Array.prototype.mySome = function(callback) {
  let _arr = this,
      thisArg = arguments[1] || window,
      flag = false;
  
  for (let i=0; i<_arr.length; i++) {
    if (callback.call(thisArg, _arr[i], i, _arr)) {
      return true
    }
  }
  return flag;
}
```



**实例**

1.判断数组中是否存在某个值

```javascript
var fruits = ['apple', 'banana', 'mango', 'guava'];

function checkAvaliability(arr, val) {
  return arr.some((item) => item === val)
}
```

2.将任意值转换为布尔类型

```javascript
let TRUTHY_VALUES = [true, 'true', 1];

function getBoolean(value) {
 	'use strict'
  if (typeof value === 'string') {
    value = value.toLowerCase().trim();
  }
  return TRUTHY_VALUES.some(item => t === value)
}
getBoolean(false);   // false
getBoolean('false'); // false
getBoolean(1);       // true
getBoolean('true');  // true
```


## Array.prototype.every()

**定义**

`every()` 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。

若收到一个空数组，此方法在一切情况下都会返回 `true`

```javascript
[].every(()=>{})  //true
```

**参数**

```javascript
arr.every(callback(element[, index[, array]])[, thisArg])
```

`callback` 用来测试每个元素的函数，它可以接收三个参数

* `element` 用于测试的当前值
* `index` **可选** 用于测试的当前值的索引
* `array` **可选** 调用 `every` 的当前数组

`thisArg` **可选**

* 执行 `callback` 时使用的 `this` 值

我们来看一下传递的这个this值

```javascript
//箭头函数形式+非严格模式下 这个值是window
[].every(() => console.log(this), 1); //在Chrome中打印的是window对象

[].every(function() {console.log(this)}, 1); // Number {1} 包装类
```





**返回值**

* 如果回调函数的每一次返回都为 [truthy](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy) 值，返回 `**true**` ，否则返回 `**false**`
* 如果是<span style="color:blue;">**空数组**</span>调用, 函数即使有内容也返回`true`



**描述**

* `every` 方法为数组中的每个元素执行一次 `callback` 函数，直到它找到一个会使 `callback` 返回 [falsy](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy) 的元素。如果发现了一个这样的元素，`every` 方法将会立即返回 `false`。否则，`callback` 为每一个元素返回 `true`，`every` 就会返回 `true`。`callback` 只会为那些已经被赋值的索引调用。不会为那些被删除或从未被赋值的索引调用。
* 如果为 `every` 提供一个 `thisArg` 参数，则该参数为调用 `callback` 时的 `this` 值。如果省略该参数，则 `callback` 被调用时的 `this` 值，在非严格模式下为全局对象，在严格模式下传入 `undefined`。
* `every` 遍历的元素范围在第一次调用 `callback` 之前就已确定了。在调用 `every` 之后添加到数组中的元素不会被 `callback` 访问到。如果数组中存在的元素被更改，则他们传入 `callback` 的值是 `every` 访问到他们那一刻的值。那些被删除的元素或从来未被赋值的元素将不会被访问到。
* `every` 和数学中的"所有"类似，当所有的元素都符合条件才会返回`true`。正因如此，若传入一个空数组，无论如何都会返回 `true`。（这种情况属于[无条件正确](http://en.wikipedia.org/wiki/Vacuous_truth)：正因为一个[空集合](https://en.wikipedia.org/wiki/Empty_set#Properties)没有元素，所以它其中的所有元素都符合给定的条件。)!!!!????

**重写**

```javascript
Array.prototype.myEvery = function(callback) {
  let _arr = this,
      thisArg = arguments[1] || window,
      flag = true;
  
  for (let i=0; i<_arr.length; i++) {
    if (!callback(thisArg, _arr[i], i, _arr)) {
      return false;
    }
  }
  
  return flag;
}
```



**实例**

**Polyfill**

```javascript
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every

```

1.检测多个对象是否相等
```js
const isEqual = (...objs) => objs.every(obj => JSON.stringify(obj) === JSON.stringfiy(objs[0]))
```


## ES6- find()/findIndex()

##### 概况

在ECMAScript 5以前的版本中，由于没有内建的数组搜索方法，因此想在数组中查找元素会比较麻烦，于是ECMAScript 5正式添加了indexOf()和lastIndexOf()两个方法，可以用它们在数组中查找特定的值。

这两种方法仍有局限之处，即每次只能查找一个值，如果想在一系列数字中查找第一个偶数，则必须自己编写代码来实现。于是ECMAScript 6引入了find()方法和findIndex()方法来解决这个问题。

##### 参数

find()方法和findIndex()方法都接受<u>两个参数：一个是回调函数；另一个是可选参数，用于指定回调函数中this的值。</u>

执行回调函数时，传入的参数分别为：数组中的某个元素和该元素在数组中的索引及数组本身，与传入map()和forEach()方法的参数相同。

##### 返回值

如果给定的值满足定义的标准，回调函数应返回true，一旦回调函数返回true，find()方法和findIndex()方法都会立即停止搜索数组剩余的部分。



find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined

```js
const array1 = [1,2,3,4,5];
const found = array1.find(item=>item>3);
console.log(found); //4

```



findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回-1。

```js
const array1 = [5, 12, 8, 130, 44];

const isLargeNumber = (element) => element > 13;

console.log(array1.findIndex(isLargeNumber));
// expected output: 3
```

**重写**

```javascript
Array.prototype.myFind = function(callback) {
  let _arr = this,
      thisArg = arguments[1] || globalThis;
  
  for (let i=0; i<_arr.length; i++){
    if (callback.call(thisArg, _arr[i], i, _arr)) {
      return _arr[i]
    }
  }
  return undefined;
}
```


## Array.prototype.findLast()
从尾到头搜索数组.它们的用法和 `find()`、`findIndex()` 类似，唯一不同的是它们是 从后向前 遍历数组，这两个方法适用于数组和类数组。


## Array.prototype.findIndex()








## Array.prototype.with()
该方法会以非破坏性的方式替换给定 index 处的数组元素，即 `arr[index]=value` 的非破坏性版本。
```js 
 const arr = ['a', 'b', 'c'];
 const result = arr.with(1, 'X');
 console.log(result);  // ['a', 'X', 'c']
 console.log(arr);     // ['a', 'b', 'c']

```


## Array.prototype.toLocaleString()
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString

### 概述
Number值的toLocaleString()方法返回一个表示此数字的语言敏感字符串。
在支持 Intl.NumberFormat API 的实现中，此方法仅调用 Intl.NumberFormat。


### 语法
```js
toLocaleString()
toLocaleString(locales)
toLocaleString(locales, options)

```

### 参数

locales 和 options 参数让应用程序可以指定应该使用哪种语言的格式化约定。
对于支持 Intl.NumberFormat API 的实现,这两个参数与 Intl.NumberFormat() 构造函数的参数完全对应。
对于不支持 Intl.NumberFormat 的实现,要求忽略这两个参数,使用的语言环境和返回字符串的形式完全由实现自己决定。


locales(可选)






## ES6-fill()

**定义**

`**fill()**` 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。

**参数**

```javascript
arr.fill(value[, start[, end]])
```

`value` 用来填充数组元素的值

`start` **可选**  起始索引，默认值为0。

`end`   **可选**  终止索引，默认值为 `this.length`

**返回值**

修改后的数组

**描述**

* **`fill`** 方法接受三个参数 `value`, `start` 以及 `end`. `start` 和 `end` 参数是可选的, 其默认值分别为 `0` 和 `this` 对象的 `length `属性值。
* 如果 `start` 是个负数, 则开始索引会被自动计算成为 `length+start`, 其中 `length` 是 `this` 对象的 `length `属性值。如果 `end` 是个负数, 则结束索引会被自动计算成为 `length+end`。
* **`fill`** 方法故意被设计成通用方法, 该方法不要求 `this` 是数组对象
* **`fill`** 方法是个可变方法, 它会改变调用它的 `this` 对象本身, 然后返回它, 而并不是返回一个副本
* 当一个对象被传递给 **`fill`**方法的时候, 填充数组的是这个对象的引用



**实例**

```javascript
[1, 2, 3].fill(4);               // [4, 4, 4]
[1, 2, 3].fill(4, 1);            // [1, 4, 4]
[1, 2, 3].fill(4, 1, 2);         // [1, 4, 3]
[1, 2, 3].fill(4, 1, 1);         // [1, 2, 3]
[1, 2, 3].fill(4, 3, 3);         // [1, 2, 3]
[1, 2, 3].fill(4, -3, -2);       // [4, 2, 3]
[1, 2, 3].fill(4, NaN, NaN);     // [1, 2, 3]
[1, 2, 3].fill(4, 3, 5);         // [1, 2, 3]
Array(3).fill(4);                // [4, 4, 4]
[].fill.call({ length: 3 }, 4);  // {0: 4, 1: 4, 2: 4, length: 3}

// Objects by reference.  !!!!
var arr = Array(3).fill({}) // [{}, {}, {}];
// 需要注意如果fill的参数为引用类型，会导致都执行都一个引用类型
// 如 arr[0] === arr[1] 为true
arr[0].hi = "hi"; // [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]
```

**Polyfill**

```javascript
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
```

**实例**
```js
const randomIP = () => Array(4).fill(0).
	map((_, i) => Math.floor(Math.random()*255) + (i===0 ? 1 : 0)).
	join('.')

//ip地址第一个数字不能为0
```


## ES6-copyWithin()
> https://www.zhangxinxu.com/wordpress/2022/12/js-array-copywithin/

##### 是什么
copyWithin() 方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度。

##### 语法
```js
copyWithin(target)
copyWithin(target, start)
copyWithin(target, start, end)
```

表示复制start-end的内容，并从target开始替换。

**参数**
`target`
0为基底的索引,复制序列(sequence)到该位置, 会转换成一个整数:
* 负索引从数组末尾往回计数, 如果`target < 0`, 使用`traget + array.length`
* 如果`target < -array.length`, 使用0
* 如果`target >= array.length`, 不复制任何数据
* 如果`target`在`start`之后, 复制的序列将被修改以符合`arr.length`

`start` 可选
开始复制元素的以0位基底的索引, 转换成数字:
* 负索引会从数组末尾往回计数, 如果`start < 0`, 使用`start + array.length`
* 如果`start < -array.length` 或 `start`被忽略, 则使用0
* 如果 `start >= array.length`, 不复制任何数据

`end` 可选
0为基底的索引, 在该索引处结束复制元素, 转换成数字.copyWithin（）复制到但不包括结尾。
* 负索引会数组末尾往回计数, 如果`end < 0`, 则`end + array.length`
* 如果 `end < -array.length`, 则使用0
* 如果 `end >= array.length` 或 `end` 被忽略, 使用`array.length`, 会使直到末尾的所有元素被复制.
* 如果`end` 在规范化(?)之后的start之前或它的位置, 则不复制任何内容


**返回值**
更改后的数组

##### 描述









copyWithin()方法与fill()方法相似，其也可以同时改变数组中的多个元素。fill()方法是将数组元素赋值为一个指定的值，而copyWithin()方法则是从数组中复制元素的值。调用copyWithin()方法时需要传入两个参数：一个是该方法开始填充值的索引位置，另一个是开始复制值的索引位置。

```javascript
//复制数组前两个元素到后两个元素
let numbers = [1,2,3,4];
//从数组e索引2开始黏贴值 从数组的索引0开始复制值

number.copyWith(2, 0);

console.log(numbers.toString()); //1,2,1,2
```

这段代码从numbers的索引2开始粘贴值，所以索引2和3将被重写。给copyWithin()传入第二个参数0表示，从索引0开始复制值并持续到没有更多可复制的值。

默认情况下，copyWithin()会一直复制直到数组末尾的值，但是你可以提供可选的第三个参数来限制被重写元素的数量。第三个参数是不包含结束索引，用于指定停止复制值的位置。在代码中它是这样的：

```javascript
let numbers = [1,2,3,4];

//从数组的索引2开始粘贴值
//从数组的索引0开始复制值
//当位于索引1时停止复制值

numbers.copyWith(2,0,1);

console.log(numbers.toString()); //1,2,1,4
```

**copywith() 对比 slice()**
JavaScript中数组的copyWithin()和slice()方法作用都是复制数组，且都是浅复制。
区别一:
copyWithin()是将数组中的一部分复制并替换另外一部分，总长度是不变的，而slice()方法只复制，不替换，返回的数组长度是由复制的数组项目个数决定的.
```js
arr = [1, 'A', '甲', 'I'];
console.log(arr.copyWithin(2, 3));
// 结果是： [1, 'A', 'I', 'I']


arr = [1, 'A', '甲', 'I'];
console.log(arr.slice(2, 3));
// 结果是： ['甲']

```

区别二:
copyWithin()方法会改变原始的数组，而slice()方法并不会

区别三:
slice()复制对于字符串也是有效的，但是copyWithin()方法却不支持
```js
// 返回值是'angx'
('zhangxinxu').slice(2, 6)

// 会无情报错
('zhangxinxu').copyWithin(2, 6)
```

**实际应用**





## ES6-includes()

**定义**

`**includes()**` 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 `true`，否则返回 `false`。

**参数**

```javascript
arr.includes(valuefToFind[, fromIndex])
```

`valueToFind` 需要查找的元素值

* 使用 `includes()`比较字符串和字符时是区分大小写的

`fromIndex` **可选**

* 从`fromIndex` 索引处开始查找 `valueToFind`。
* 如果为负值，则按升序从 `array.length + fromIndex` 的索引开始搜 （即使从末尾开始往前跳 `fromIndex` 的绝对值个索引，然后往后搜寻）。默认为 0。

**返回值**

* 返回一个布尔值 [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean) 。
* 如果在数组中（或 `fromIndex` 指定的范围中）找到了 `valueToFind`，则返回 `true`，否则返回 `false`。
* 0 的值将全部视为相等，与符号无关（即 -0 与 0 和 +0 相等），但 `false` 不被认为与 0 相等; `NaN`与自身返回的是true.
* 技术上来讲，`includes()` 使用 <a href='https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness#%E9%9B%B6%E5%80%BC%E7%9B%B8%E7%AD%89'>`零值相等`</a> 算法来确定是否找到给定的元素

> 零值相等: 和同值相等类似,不过会人为`+0`和`-0`相等
>
> 同值相等: 由`Object.is`方法提供



**实例**

```javascript
NaN == NaN; //false
Object.is(NaN, NaN); //true

0 == -0 //true
Object.is(0, -0); //false

0 == undefined //false
0 == null //false


[NaN].includes(NaN); //true
[NaN].indexOf(NaN); //-1

[-0].includes(0); //true
[-0].indexOf(0); //0
```



## ES6-flat()

**定义**

`flat()` 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

**参数**

```javascript
var newArray = arr.flat([depth])
```

`depth` **可选**

* 指定要提取嵌套数组的结构深度，默认值为 1
* 使用 Infinity，可展开任意深度的嵌套数组

**返回值**

* 一个包含将数组与子数组中所有元素的新数组

* `flat()` 方法会移除数组中的空项

**实例**

[扁平化嵌套数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#扁平化嵌套数组)

```javascript
var arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

//使用 Infinity，可展开任意深度的嵌套数组
var arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

[扁平化与数组空项](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#扁平化与数组空项)

```javascript
var arr4 = [1, 2, , 4, 5];
arr4.flat();
// [1, 2, 4, 5]
```

替代方案

[使用 `reduce` 与 `concat`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#使用_reduce_与_concat)

```javascript
var arr = [1, 2, [3, 4]]

// 展开一层数组
arr.flat();
// 等效于
arr.reduce((acc, val) => acc.concat(val), []);
// [1, 2, 3, 4]

// 使用展开运算符 ...
const flattened = arr => [].concat(...arr)
```

[reduce + concat + isArray + recursivity](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#reduce_concat_isarray_recursivity)

```javascript
// 使用 reduce、concat 和递归展开无限多层嵌套的数组
var arr1 = [1,2,3,[1,2,3,4, [2,3,4]]];

function flatDepth(arr) {
  return arr.reduce((acc, cur) => {
    if (Array.is(cur)) {
      return acc.concat(flatDepth(cur))
    } else {
      return acc.concat(...cur)
    }
  }, [])
}


//MDN

```

##### **方法实现**

> https://juejin.cn/post/6844904025993773063#heading-14
>
> 写的非常好,读起来很流畅,思路清晰. 抄一遍

Array.prototype.flat()特点:

* 用于将数组'拉平',变为一维数组.该方法返回一个新数组,对原数据没有影响
* 不传参时,默认'拉平'一层; 可以传入一个整数,标识想要'拉平'的层数.
* 传入`<=0`的整数数组将返回原数组,不'拉平'
* `Infinity`关键字作为参数时,无论多少层嵌套,都会转为一维数组.
* 如果原数组有空位, 此方法会跳过空位

1.实现思路（简洁顺畅，要的就是这个感觉）

在数组中找到是数组类型的元素,然后将它们展开.

* 第一个要解决的就是遍历数组元素
* 第二个要解决的是判断元素是否为数组
* 第三个要解决的将数组的元素展开一层

2.遍历数组的方案

包括不限于下面几种:

* for循环
* for...of 
* for...in
* forEach()
* entries()
* values()
* keys()
* reduce()
* map()

3.判断元素是否为数组的方案 <span style="color:red;">**7**</span> 种

* [] instanceof Array
* [].\_\_proto\_\_ === Array.prototype
* [].constructor === Array
* Array.prototype.isPrototypeOf([])
* Object.getPrototypeOf([]) === Array.prototype
* Object.prototype.toString.call([]).slice(8, -1)
* Array.isArray([])

说明:

* `instanceof` 操作符是假定只有一种全局环境,如果网页中包含多个框架,多个全局环境,如果你从一个框架向另一个框架传入一个数组,那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数.(所以在这种情况下不准确)
* typeof 操作符对数组类型返回object

4.将数组元素展开一层的方法

* 展开运算符 + concat
* concat+apply
* toString + split

展开运算符+concat

concat()方法用来合并两个或多个数组,在拼接过程中加上展开运算符会展开一层数组.

concat+apply

主要是利用apply在绑定作用域时,传入的第二个参数是一个数组或类数组对象,其中的数组元素将作为单独的参数传给函数. 也就是在调用apply函数的过程中,会将传入的数组一个个传入到要执行的函数中,相当对数组进行了一层展开.

toString+split

如果数组中的元素都是数字的话,是可行的.但是不推荐,因为操作字符串是危险的.

```javascript
const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];

//1 其实这里加不加展开运算符都是可以 都会展开最外一层
[].concat(...arr)

//2
[].concat.apply([], arr)

//3
arr.toString().split(',')
arr.toString().split(',').map(v => parseInt(v));
```

准备工作都已经完成,第一版flat方法实现:

```javascript
//concat + 递归

const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];

function flat(arr) {
  let res = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      res = res.concat(arguments.callee(item)); //递归
      //或使用展开运算符
      //res.push(...arguments.callee(item))
    } else {
      res.push(item);
    }
  });
  return res;
}
```



```javascript
//用reduce实现flat函数

const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }]

const flat = arr => {
  return arr.reduce((acc, crt) => {
    return acc.concat(Array.isArray(crt) ? flat(crt) : crt)
  }, [])
};

// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];
```



```javascript
//用栈的思想实现flat函数

function flat(arr) {
  let res = [];
  let stack = [].concat(arr); //将数组元素拷贝至栈,直接赋值会改变原数组
  //如果栈不为空,则循环遍历
  while (stack.length !== 0) {
    const val = stack.pop();
    if (Array.isArray(val)) {
      stack.push(...val); //如果是数组再次入栈,并且展开了一层
    } else {
      res.unshift(val); //如果不是数组就将其取出来放入结果数组
    }
  }
  return res;
}
```



```javascript
//通过传入整数参数控制拉平层数 !!!!
function flat(arr, num=1) {
 return num > 0
  ? arr.reduce((pre, cur) => {
   pre.concat(Array.isArray(cur) ? flat(cur, num-1) : cur)
 }, [])
  : arr.slice();
}
```



```javascript
//使用Generator 实现 flat

function* flat(arr,num) {
  if (num === undefined) num = 1;
  for (const item of arr) {
    if (Array.isArray(item) && num > 0) {
      yield* flat(item, num-1);
    } else {
      yield item;
    }
  }
}

// 调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象。
// 也就是遍历器对象（Iterator Object）。所以我们要用一次展开运算符得到结果
[...flat(arr, Infinity)]    
// [1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 1, 2, 3, 5, "string", { name: "弹铁蛋同学" }];

作者：弹铁蛋同学
链接：https://juejin.cn/post/6844904025993773063
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```



```javascript
//在原型链上重写 flat 函数
Array.prototype.flat = function(num=1) {
  if (!Number(num) || Number(num) < 0) {
    return this;
  }
  let arr = this.concat(); 
  while(num > 0) {
    if (arr.some(x => Array.isArray(x))) {
      arr = [].concat.apply([], arr);
    } else {
      break; //数组中没有数组元素并且不管num是否依旧大于0, 停止循环
    }
    num--;
  }
  return arr;
}
```



```javascript
//考虑数组空位的情况
// flat 函数执行是会跳过空位的。ES5 大多数数组方法对空位的处理都会选择跳过空位包括：forEach(), filter(), reduce(), every() 和 some() 都会跳过空位。

//reduce+递归
function flat(num=1) {
  if (!Number(num) || Num(num)<0) {
    return this;
  }
  let arr = [].concat(this);
  return num > 0
  	? arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? cur.flat(--num): cur),[])
  	: arr.slice();
}
const arr = [1,[3,4],,,];
arr.flat(); //[1,3,4]


//forEach+递归
function flat(num=1) {
  if (!Number(num) || Number(num) < 0) {
    return this;
  }
  let arr = [];
  this.forEach(item => {
    if (Array.isArray(item)) {
      arr = arr.concat(item.flat(--num));
    } else {
      arr.push(item);
    }
  });
  return arr;
};


```

扩展阅读: **由于空位的处理规则非常不统一，所以建议避免出现空位。** 见数组中的相关知识点.

```javascript
//concat + 递归

const arr = [1, 2, 3, 4, [1, 2, 3, [1, 2, 3, [1, 2, 3]]], 5, "string", { name: "弹铁蛋同学" }];

function myFlat(arr) {
  if (!Array.isArray(arr)) {
    return alert('参数需要是一个数组');
  }
  
  let newArr = [];
  arr.forEach(v => {
    if (Array.isArray(v)) {
      newArr = newArr.concat(myFlat(v));
    } else {
      newArr.push(v);
    }
  })
  
  return newArr;
}
```







## Array.keys()

**定义**
`**keys()** `方法返回一个包含数组中每个索引键的`**Array Iterator**`对象

**参数**

```javascript
arr.keys()
```

**返回值**

一个新的 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 迭代器对象

**实例**!!!!

[索引迭代器会包含那些没有对应元素的索引](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/keys#索引迭代器会包含那些没有对应元素的索引)

```javascript
var arr = ["a", , "c"];
var sparseKeys = Object.keys(arr);
var denseKeys = [...arr.keys()];
console.log(sparseKeys); // ['0', '2']
console.log(denseKeys);  // [0, 1, 2]
```

**其他**

这里要注意是的是和对象Object.keys()方法的比较,对象的方法返回的是一个数组.



## Array.values()

**定义**

**`values()`** 方法返回一个新的 **`Array Iterator`** 对象，该对象包含数组每个索引的值

**参数**

```javascript
arr.values()
```

**返回值**

一个新的 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 迭代对象

**描述**

* **Array.prototype.values** 是 **Array.prototype[Symbol.iterator]** 的默认实现。
* 一次性：数组迭代器是一次性的，或者说临时对象

**实例**

[使用 `for...of` 循环进行迭代](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/values#使用_for...of_循环进行迭代)

```javascript
let arr = ['w', 'y', 'k', 'o', 'p'];
let eArr = arr.values();

for (let letter of eArr) {
  console.log(letter);
} //"w" "y "k" "o" "p"
```

[使用 `.next()` 迭代](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/values#使用_.next_迭代)

```javascript
var arr = ['a', 'b', 'c', 'd', 'e'];
var iterator = arr.values();
iterator.next();               // Object { value: "a", done: false }
iterator.next().value;         // "b"
iterator.next()["value"];      // "c"
iterator.next();               // Object { value: "d", done: false }
iterator.next();               // Object { value: "e", done: false }
iterator.next();               // Object { value: undefined, done: true }
iterator.next().value;         // undefined
```

一次性：数组迭代器是一次性的，或者说临时对象

```javascript
var arr = ['a', 'b', 'c', 'd', 'e'];
 var iterator = arr.values();
 for (let letter of iterator) {
 console.log(letter);
} //"a" "b" "c" "d"
for (let letter of iterator) {
console.log(letter);
} // undefined
```



## Array.entries()

**定义**

`entries()` 方法返回一个新的**Array Iterator**对象，该对象包含数组中每个索引的键/值对

**参数**

```javascript
arr.entries()
```

**返回值**

一个新的 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 迭代器对象。[Array Iterator](https://www.ecma-international.org/ecma-262/6.0/#sec-createarrayiterator)是对象，它的原型（__proto__:Array Iterator）上有一个[next](https://www.ecma-international.org/ecma-262/6.0/#sec-%arrayiteratorprototype%.next)方法，可用用于遍历迭代器取得原数组的[key,value]。



**实例**

1.Array.iterator

```javascript
var arr = ["a", "b", "c"];
var iterator = arr.entries();
console.log(iterator);

/*Array Iterator {}
         __proto__:Array Iterator
         next:ƒ next()
         Symbol(Symbol.toStringTag):"Array Iterator"
         __proto__:Object
*/
```

2.iterator.next()

```javascript
var arr = ["a", "b", "c"];
var iterator = arr.entries();
console.log(iterator.next());

/*{value: Array(2), done: false}
          done:false
          value:(2) [0, "a"]
           __proto__: Object
*/
// iterator.next()返回一个对象，对于有元素的数组，
// 是next{ value: Array(2), done: false }；
// next.done 用于指示迭代器是否完成：在每次迭代时进行更新而且都是false，
// 直到迭代器结束done才是true。
// next.value是一个["key","value"]的数组，是返回的迭代器中的元素值。
```

3.iterator.next方法运行

```javascript
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/entries
```

4.二维数组按行排序

```javascript
var arr = [[1, 34], [456, 2, 3, 44, 234], [4567, 1, 4, 5, 6], [34, 78, 23, 1]]


//entries
function sortArr(arr) {
    var goNext = true;
    var entries = arr.entries();
    while (goNext) {
        var result = entries.next();
        if (result.done !== true) {
            result.value[1].sort((a, b) => a - b);
            goNext = true;
        } else {
            goNext = false;
        }
    }
    return arr;
}

sortArr(arr);

/*(4) [Array(2), Array(5), Array(5), Array(4)]
    0:(2) [1, 34]
    1:(5) [2, 3, 44, 234, 456]
    2:(5) [1, 4, 5, 6, 4567]
    3:(4) [1, 23, 34, 78]
    length:4
    __proto__:Array(0)
*/



//reduce
let result = arr.reduce((acc, cur) => {
  acc.push(cur.sort((a, b) => a - b))
  return acc;
 }, [])
```

5.使用for...of循环

```javascript
var arr = ["a", "b", "c"];
var iterator = arr.entries();
// undefined

for (let e of iterator) {
    console.log(e);
}

// [0, "a"]
// [1, "b"]
// [2, "c"]
```



### Array.at() //?待办





## 数组使用案例

### 数组浅拷贝
```js
let arr = [1,2,null, '1', Boolean, {a:1}]

let arr2 = arr.concat();
let arr3 = arr.slice(0)
let arr4 = [...arr]
```

### 数组实例

### 数组乱序

```javascript
const shuffleArray = arr => arr.sort(() => Math.random() - 0.5)
```



### 数组方法在字符串上使用

!!!!

>  [来源](https://github.com/getify/You-Dont-Know-JS): 通过“借用”数组的方法可以很方便的处理字符串。可以“借用”数组的非变更方法，但不能“借用”数组的可变更方法.

```javascript
Array.prototype.非破坏性方法.call('任意字符串', parameter)
[].非破坏性方法.call('任意字符串', parameter)
```



```js
//https://www.jianshu.com/p/0362b6cd90d6

let a = 'foo';
//数组的非变更方法,就是不改变原有数组的方法
let b = Array.prototype.join.call(a,'-'); //'f-o-o'
let c = Array.prototype.map.call(a,i=>i.toUpperCase()).join(); //'FOO'
let c = Array.prototype.slice.call(a);//['f','o','o']

//数组的可变更方法,就是会改变原有数组的方法
let e = Array.prototype.reverse.call(a);
//chrome: Uncaught TypeError: Cannot assign to read only property '0' of object '[object String]'


```



### 创建一个包含1 … N的数组

```javascript
//https://www.codenong.com/3746725/

//循环方法  写法繁琐
let arr = [];
for (let i=0; i<=n; i++) {
  arr.push(i);
}

//ES6
Array.from( Array(num).keys() )

[...Array(num).keys()]

Array.from({length: num}, (v, k) => k + 1);

[...Array(10).keys()].map(x => ++x) ???

Array(N).fill().map(i => i+1)

Array(N).fill(0)
```





### 判断数组是否包含某个值

**in** 

只能判断键是否存在于数组及prototype chain中

```js
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in

//作用
如果指定的属性在指定的对象或其原型链中，则in 运算符返回true。
//语法
prop in object
 prop: 一个字符串类型或者 symbol 类型的属性名或者数组索引（非symbol类型将会强制转为字符串）
 objectname: 检查它（或其原型链）是否包含具有指定名称的属性的对象。

//案例
let trees = new Array('redwood', 'bay', 'cedar', 'oak');
1 in trees //返回true
2 in trees //返回true
'bay' in trees //false

//数组空位
0 in [undefined, undefined]; //true
0 in [,,,]; //false
```



```javascript
for循环
indexOf/lastIndexOf
includes
find/findIndex
some/every
concat
filter
reduce
```





### 向数组中添加元素

```JavaScript
* 向数组中添加元素
	数组[索引] = 值
arr[0] = 10;
arr[1] = 11;
arr[2] = 12;
arr[6] = 15;   
```



### 删除元素

```JavaScript
# 删除数组中的元素,但是位置还在

- delete 数组[索引]
```





### 判断两个数组是相等

```js
//https://segmentfault.com/a/1190000016574183
//https://juejin.cn/post/6860071737196429319
//https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript


//1.如果两个数组均为字符串或数字类型,元素顺序无需一致. 使用sort排序/every/遍历来判断
a.length === b.length && a.sort().toString() === b.sort().toString()
a.length === b.length && a.every(item => b.includes(item));

//1.简单方案 适用于大多数情况.除了null !== undefined,它们转换成JSON都代表null并被认为相等.
function (a1, a2) {
  //数组中必须没有对象或未定义行为?? 
  return JSON.stringify(a1) === JSON.stringify(a2);
}

使用JSON来stringify对象的话,ES6规定了属性的迭代顺序,所以可以对相同对象使用

//2.

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  
  for (let i=0; i<a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
```



### 合并两个数组的方法

**1.concat**

```js
var a = [1,2,3];
var b = [4,5,6];
var c = a.concat(b);//c=[1,2,3,4,5,6];
```

这里有一个问题，concat方法连接a、b两个数组后，a、b两个数组的数据不变，同时会返回一个新的数组。这样当我们需要进行多次的数组合并时，会造成很大的内存浪费，所以这个方法肯定不是最好的。



**2.for循环**

> 这样的写法可以解决第一种方案中对内存的浪费，但是会有另一个问题：丑

```js
for(var i in b){
  a.push(b[i]);
}
```

**3.apply**

```js
a.push.apply(a,b);
```

调用a.push这个函数实例的apply方法，同时把，b当作参数传入，这样a.push这个方法就会遍历b数组的所有元素，达到合并的效果。上面的操作就等同于：`a.push(4,5,6);`



**4.展开运算符**

```js
var a = [1,2,3];
var b = [4,5,6];
var newA = [...a,...b]
```



### 伪数组转换为真数组的3种方法

```js
1.slice方法
let realArr = Array.prototype.slice.call(arr);
2.ES6的展开运算符
let realArr = [...arr];
3.ES6方法From,任何有length属性的对象，都可以通过Array.from方法转为数组，而此时展开运算符就无法转换
let realArr = Array.from(arr);
```



### 查询字符串中字母出现的次数

```js
//方法1
var str = 'aalskdjfslkdjsdkjfsldkjfzz';
var arr = str.split('');
arr.sort();
for(let i=0; i<arr.length; i++){
    var fir = arr.indexOf(arr[i]);
    var las = arr.lastIndexOf(arr[i]) + 1;
    if(arr[i] != arr[i+1]){
        var arrNew = arr.slice(fir, las);
        console.log(arrNew);
}
    
//方法2 
关系数组: 就是将字符串作为数组索引的一种使用数组的方式
var str = 'aalskdjfslkdjsdkjfsldkjfzz';    
var arr = [];
for(var i=0; i<str.length; i++){
    arr[str[i]] = arr[str[i]] + 1 || 1;
}
console.log(arr); //[a: 2, l: 3, s: 4, k: 4, d: 4, …]

    
//方法3: reduce 在reduce实例中
var str = 'aalskdjfslkdjsdkjfsldkjfzz';  
let result = str.split('').reduce((acc, cur, idx) => {
  if (acc[cur]) {
    acc[cur]++;
  } else {
    acc[cur] = 1;
  }
  
  return acc;
}, {})
```



### 数组去重的 ? 种方法

* **双for循环**
  * splice
  * 新数组(函数形式, 全局形式(分两种, 变量是在内部外部声明)
  * 索引(新增)
* **for循环**
  * indexOf
  * includes
  * 对象键值对( 放到下面的Object键值对中)
* **reduce**
  * includes+(push/concat)
* **filter**
  * indexOf
  * sort
* **sort()**
  * 排序后去重
  * 快慢指针

* Object键值对
  * key的差异
  * 全等运算符+类型

* **ES6**
  * Set
  * Map






**双for循环+splice**

```JavaScript
# 去除数组中重复的数字

let arr = [1,2,3,1,1,4,3,2,5,6,7];

for(let i=0; i<arr.length; i++){
    for(let j=i+1; j<arr.length; j++){
        if(arr[i] === arr[j]){
            arr.splice(j,1);
            j--;
        }
        
    }
}


for (let i=0; i<arr.length; i++) {
  for (let j=i-1; j>0; j--) {
    if (arr[i] === arr[j]) {
      arr.splice(j, 1);
      i--;
    }
  }
}

//其他写法 这种写法效率肯定是低的
for (let i=0; i<arr.length; i++) {
  for (let j=i+1; j<arr.length; j++) {
    if (arr[i] === arr[j]) {
      arr.splice(i, 1);
      i--;
      //break;
    }
  }
}
```

**双for循环+新数组**

```javascript
//https://juejin.cn/post/6844903482093387783

var arr = [1,1,'1','1']
function unique(arr) {
	var res = []
	for (var i=0,len=arr.length; i<len; i++) {
		for (var j=0,len2=res.length; j<len2; j++) { // len变量名称不能一致； var声明的变量没有作用域限制；
			if (arr[i] === res[j]) {
				break;
			}

			if (j === len2) {
				res.push(arr[i])
			}
		}
	}
	return res;
}


//如果改用let,两种实现方案

function unique21(arr) {
	let res = []
	for (let i=0,len=arr.length; i<len; i++) {
		for (let j=0, len1=res.length; j<=len1; j++) {
			if (arr[i] === res[j]) {
				break;
			}
			if (j === len1) {
				res.push(arr[i])
			}
		}
	}
}


function unique22(arr) {
  let res = [], j;
  for (let i = 0, len = arr.length; i < len; i++) {
    for (j=0; j < res.length; j++) {
      if (arr[i] === res[j]) {
        break;
      }
    }
    if (res.length === j) {
      res.push(arr[i])
     }
  }
  return res;
}



// 错误示例

// j无法在作用域外访问
function unique(array) {
  let res = [];
  for (let i=0; i<array.length; i++) {
    for (let j=0, resLen=res.length; j<len; j++) {
      if (arr[i] === res[j]) {
        break;
      }
    }
    //如果array[i]是唯一的,那么执行完循环,j等于res.length
    if (j === res.length) {
      res.push(arr[i]);
    }
  }
}

// 死循环
// 错误示例
/*
当内层循环检查结束后，由于 `j===res.length`，故将元素添加到了 res 数组的末尾，此时数组的长度 `res.length` 发生了变化，而内层循环此时的终止条件 `j<=res.length` 中的 `res.length` 已经改变，导致内层循环无法正常停止，从而陷入死循环。

为了解决这个问题，应该将内层循环中的 `res.length` 缓存到一个变量 `len` 中，然后在循环中使用这个变量，这样就保证了循环内部长度不会发生变化：
*/
for (let i=0;i<arr.length; i++) {
  for (let j=0;j<=res.length;j++) {
    if (arr[i] === res[j]) {
      break;
    }
    
    if (res.length === j) {
      res.push(arr[i]);
    }
  }
}


// j会递增
let res = [];
let j = 0;
for (let i=0; i<arr.length; i++) {
  for (; j<res.length; j++) {
    if (arr[i] === res[j]) {
      break;
    }
  }
  
  if (j === res.length) {
    res.push(arr[i]);
  }
}
```




**双for循环 + 索引判断**

```js
//数组去重 双for循环+索引

let arr = [1,2,3,4,5,2,3,4,6,7,'1'], res = [];

for (let i=0,len=arr.length; i<len; i++) {
  for (let j=i+1; j<len; j++) {
    if (arr[i] === arr[j]) {
      j = ++i
    }
  }
  
  res.push(arr[i])
}
```





for+indexOf / for+includes

```javascript
function unique(arr) {
  let uniqueArr = [];
  for (let i=0; i<arr.length; i++) {
    if (uniqueArr.indexOf(arr[i]) === -1) {
      uniqueArr.push(arr[i]);
    }
  }
  return uniqueArr;
}


function unique(arr) {
  let uniqueArr = [];
  for (let i=0; i<arr.length; i++) {
    if (!uniqueArr.includes(arr[i])) {
      uniqueArr.push(arr[i])
    }
  }
  return uniqueArr;
}
```





reduce+includes/indexOf + concat/push

```javascript
//reduce方法
let arr = [1,2,3,4,4,1]
let newArr = arr.reduce((prev,current)=>{
  if(!prev.includes(current)){   //写繁琐了,没有必要
    return prev.push(current)
  }else{
    return prev;
  }
},[])

let arr=[1,2,2,4,null,null].reduce(prev,current)=>{
  return prev.includes(current)?prev:prev.concat(current)
         //!prev.includes(current)&&prev.push(current)
,[]}


//220728
arr.reduce((pre, crt) => pre.includes(crt) ? pre : pre.concat(crt), [])
arr.reduce((pre, crt) => pre.indexOf(crt) === -1 ? pre.concat(crt) : pre, [])
```



filter+indexOf方法

```javascript
//filter方法
let arr = [1,2,2,4,null,null].filter((item,index,arr)=>arr.indexOf(item)===index)

//存在的问题: 
1.arr.indexOf(NaN)的结果是-1,所以会忽略NaN这个值.
2.对象不去重

//排序后
arr.concat().sort().filter((item,idx,arr) => !idx || item !==arr[idx-1]);
```



filter+sort()

```javascript
//https://juejin.cn/post/6844903482093387783#:~:text=%E5%8F%AF%E4%BB%A5%E6%9F%A5%E7%9C%8B%20Github%E3%80%82-,filter,-ES5%20%E6%8F%90%E4%BE%9B%E4%BA%86

//ES6
arr.concat().sort().filter((item, idx, arr) => !idx || item !== arr[idx - 1])
```

sort排序后去重

先将要去重的数组使用 sort 方法排序后，相同的值就会被排在一起，然后我们就可以只判断当前元素与上一个元素是否相同，相同就说明重复，不相同就添加进 res.

* 对一个已经排好序的的数组去重,这种方法效率肯定是高于indexOf
* sort()排序有漏洞, 并不适用于特殊类型的排序. !!!!???

```javascript
//冴羽博客 https://github.com/mqyqingfeng/Blog/issues/27

function unique(arr) {
  let res = [];
  let sortedArr = arr.concat().sort();
  let seen;
  
  for (let i=0; i<sortedArr.length; i++) {
    //如果第一个元素或相邻的元素不相同
    if (!i || seen !== sortedArr[i]) {
    	res.push(sortedArr[i]) ;
    }
    seen = sortedArr[i];
  }
  return res;
}
```

API1(sort排序+indexOf)

根据一个参数isSorted判断传入的数组是否已经排序,如果为true,我们就判断相邻元素是否相同;如果为false,就使用indexOf判断.

```javascript
function unique(arr, isSorted) {
  let res = [];
  let seen = []; //原版中seen声明成数组,但是本案例中声明成数组并没有被使用到. 应该是下面的API1优化中需要使用的,这里才顺手这么写的.
  
  for (let i=0; i<arr.length; i++) {
    let value = arr[i];
    if (isSorted) {
      if (!0 || seen !== value) {
        res.push(value);
      }
      seen = value;
    } else if (res.indexOf(value) === -1) {
      res.push(value);
    }
  } 
  return res;
}
```

API1优化 !!!!

新需求: 字母的大小写视为一致，比如'a'和'A'，保留一个就可以了！

虽然我们可以先处理数组中的所有数据，比如将所有的字母转成小写，然后再传入unique函数，但是有没有方法可以省掉处理数组的这一遍循环，直接就在去重的循环中做呢? impressive!!!

```javascript
function unique(arr, isSorted, iteratee) {
  let res = [];
  let seen = [];
  
  for (let i=0; i<arr.length; i++) {
    let value = arr[i];
    computed = iteratee ? iteratee(value, i, arr) : value;
    
    if (isSorted) {
      if (!i || seen !== computed) {
        res.push(value)
      }
      seen = computed;
    } else if (iteratee) {
      if (seen.indexOf(computed) === -1) {
        seen.push(computed);
        res.push(value);
      }
    } else if (res.indexOf(value) === -1) {
      res.push(value);
    }
  }
}

console.log(unique(arr, false, (item) => {
  return typeof item === 'string' ? item.toLowerCase() : item;
}));//[1, 'a', 2]
```

在这一版也是最后一版的实现中，函数传递三个参数：

array：表示要去重的数组，必填

isSorted：表示函数传入的数组是否已排过序，如果为 true，将会采用更快的方法进行去重

iteratee：传入一个函数，可以对每个元素进行重新的计算，然后根据处理的结果进行去重

至此，我们已经仿照着 underscore 的思路写了一个 unique 函数，具体可以查看 [Github](https://github.com/jashkenas/underscore/blob/master/underscore.js#L1722)

```javascript
//https://github.com/jashkenas/underscore/blob/master/underscore.js#L1722

function uniq(arr, isSorted, iteratee, context) {
  if (!isBoolean(isSorted)) {
    context = iteratee;
    iteratee = isSorted;
    isSorted = false;
  }
  if (iteratee!= null) iteratee = cb(iteratee, context);
  let result = [];
  let seen = [];
  for (let i=0,length=getLength(arr); i<length; i++) {
    let value = arr[i],
        computed = iteratee ? iteratee(value, i, arr) : value;
    
    if (isSorted && !iteratee) {
      if (!i || seen !== computed) {
        result.push(value);
      }
      seen = computed;
    } else if (iteratee) {
      if (!contains(seen, computed)) {
        seen.push(computed);
        result.push(value);
      }
    } else if (!contains(result, value)) {
      result.push(value);
    }
  }
  return result;
}
```





sort()排序+快慢指针 不好理解.

```javascript
//https://juejin.cn/post/6844904202162929671

function unique(arr) {
  arr.sort((a, b) => a - b);
  let left = 0,
      right = 1;
  
  while(right < arr.length) {
    if (arr[left] === arr[right]) {
      right++;
    } else {
      arr[left + 1] = arr[right];
      left++;
      right++;
    }
  }
  return arr.slice(0, left+1);
}

//https://juejin.cn/post/7033275515880341512
function unique2(arr) {
  arr.sort((a, b) => a - b);
  let slow = 1,
      fast = 1;
  
  while(fast < arr.length) {
    if (arr[fast - 1] !== arr[fast]) {
      arr[slow++] = arr[fast];
    }
    ++fast;
  }
  arr.length = slow;
  return arr;
}
```













Object键值对

key的差异性

> 存在的问题: 键值对方法不能去重正则表达式

这种方法是利用一个空的 Object 对象，我们把数组的值存成 Object 的 key 值，比如 Object[value1] = true，在判断另一个值的时候，如果 Object[value2]存在的话，就说明该值是重复的。示例代码如下：

```javascript
let obj = {};
arr.filter((item,idx,arr) => obj.hasOwnProperty(item) ? false : (obj[item] = item));
```

因为 1 和 '1' 是不同的，但是这种方法会判断为同一个值，这是因为对象的键值只能是字符串，所以我们可以使用 `typeof item + item` 拼成字符串作为 key 值来避免这个问题

```javascript
//对象的可计算属性方括号 可以放表达式  :))))

arr.filter((item,idx,arr) => obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true));

```

上面的方法依然存在问题,无法正确区分出两个对象,使用JSON.stringify()将对象序列化

```javascript
arr.filter(v => obj.hasOwnProperty(v) ? false : (obj[typeof v + JSON.stringify(v)] = true));
//test
```

依然存在的问题: 考虑到 `JSON.stringify` 任何一个正则表达式的结果都是 `{}`，所以这个方法并不适用于处理正则表达式去重。(引用[勘误](https://github.com/mqyqingfeng/Blog/issues/212) )

```javascript
console.log(JSON.stringify(/a/)); //{}
console.log(JSON.stringify(/b/)); //{}
```

改进: Map键值对

> 使用Map映射是否会解决呢?

```javascript
let map = new Map();
let arr = [1,2,3,'1',/a/, {a:1},/a/, ];

let res = arr.filter((item,idx,arr) => map.has(item) ? false : map.set(item, true));

//优化
let res = arr.filter((item,idx,arr) => !map.has(item) && map.set(item, true));
```







ES6-Set去重

```javascript
function unique() {
  return Array.from(new Set([].concat.apply([], arguments)));
}

function unique(arr) {
  return Array.from(new Set(arr));
}

//简化
function unique(arr) {
  return [...new Set(arr)];
}

//再简化
let unique = (arr) => [...new Set(arr)];
```



ES6-Map方法

```javascript
function unique(arr) {
  let map = new Map(),
      newArr = [];
  for (let i=0; i<arr.length; i++){
    if (!map.get(arr[i])) {
      map.set(arr[i], true);
      newArr.push(arr[i]);
    }
  }
  return newArr;
}


function unique2(arr) {  //太聪明了真是. 来自JS专题之数组去重
  let map = new Map();
  return arr.filter((item) => !map.has(item) && map.set(item, 1));
}
```



### 数组去重的方法存在的问题(冴羽)

> https://github.com/mqyqingfeng/Blog/issues/27

**特殊类型的比较**

```javascript
let str1 = '1';
let str2 = new String('1');

str1 == str2; //true
str1 === str2; //false

null == null; //true
null === null; //true

undefined == undefined //true
undefined === undefined; //true

NaN == NaN; //false
NaN === NaN; //false

/a/ == /a/; //false
/a/ === /a/; //false

{} == {}; //false
{} === {}; //false
```



对于这样一个数组使用以上的去重方法:

```javascript
var array = [1, 1, '1', '1', null, null, undefined, undefined, new String('1'), new String('1'), /a/, /a/, NaN, NaN];
```

```javascript
var str1 = '1';
var str2 = new String('1');

console.log(str1 == str2); // true
console.log(str1 === str2); // false

console.log(null == null); // true
console.log(null === null); // true

console.log(undefined == undefined); // true
console.log(undefined === undefined); // true

console.log(NaN == NaN); // false
console.log(NaN === NaN); // false

console.log(/a/ == /a/); // false
console.log(/a/ === /a/); // false

console.log({} == {}); // false
console.log({} === {}); // false
```



我们重点关注下对象和 NaN 的去重情况：

| 方法                                                         | 结果                                                         | 说明                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------- |
| for循环(双for+新数组)                                        | [1, "1", null, undefined, String, String, /a/, /a/, NaN, NaN] | 对象和 NaN 不去重                       |
| indexOf(作者用的是新数组+for循环+indexOf方法)                | [1, "1", null, undefined, String, String, /a/, /a/, NaN, NaN] | 对象和 NaN 不去重                       |
| sort<br />结论是数字1不去重,没有勘误.不知道是哪个数字1,是包装类的吗? | [/a/, /a/, "1", 1, String, 1, String, NaN, NaN, null, undefined] | 对象和 NaN 不去重 <br />数字 1 也不去重 |
| filter+indexOf                                               | [1, "1", null, undefined, String, String, /a/, /a/]          | 对象不去重 NaN 会被忽略掉               |
| filter+sort                                                  | [/a/, /a/, "1", 1, String, 1, String, NaN, NaN, null, undefined] | 对象和 NaN 不去重 数字 1 不去重         |
| 优化后的键值对方法                                           | [1, "1", null, undefined, String, /a/, NaN]                  | 全部去重                                |
| Set                                                          | [1, "1", null, undefined, String, String, /a/, /a/, NaN]     | 对象不去重 NaN 去重                     |

这里再次声明一下，键值对方法不能去重正则表达式。

想了解为什么会出现以上的结果，看两个 demo 便能明白：

```javascript
//demo1
let arr = [1,2,NaN];
arr.indexOf(NaN); //-1
```

<span style="color: blue;">indexOf 底层还是使用 === 进行判断，因为 NaN === NaN的结果为 false，所以使用 indexOf 查找不到 NaN 元素</span>

```javascript
//demo2
function unique(arr) {
  return Array.from(new Set(arr));
}
console.log(unique([NaN, NaN])); //[NaN]
```

<span style="color: blue;">Set 认为尽管 NaN === NaN 为 false，但是这两个元素是重复的。</span>



### 数组扁平化 !!!!

> [面试官连环追问：数组拍平（扁平化） flat 方法实现 - 掘金 (juejin.cn)](https://juejin.cn/post/6844904025993773063#heading-14)
>
> [2021年前端各大公司都考了那些手写题(附带代码) - 掘金 (juejin.cn)](https://juejin.cn/post/7033275515880341512)



* toString + split
* flat
* replace + split
* replace + JSON.parse
* 递归+ for/reduce
* 展开运算符

```javascript
//toString + split
let arr = [1, [2, [3, [4, 5]]], 6];// -> [1, 2, 3, 4, 5, 6]
let str = arr.toString().split(',')

数组上的toString方法
```



```javascript
//flat

let res = arr.flat(Infinity)
```



```javascript
//JSON + replace + split
let str = JSON.stringify(arr)
let res = str.replace(/(\[|\])/g, '').split(',')
```



```javascript
//JSON + replace + JSON.parse
let str = JSON.stringify(arr)
let res = str.replace(/(\[|\])/g, '')
res = '[' + res + ']'
res = JSON.parse(res)
```



```javascript
//普通递归 + for/reduce
let res = []
let fn = function(arr) {
  for (let i=0; i<arr.length; i++) {
    if (Array.isArray(arr[i])) {
      fn(arr[i])
    }
    else {
      res.push(arr[i])
    }
  }
}

function flat(arr) {
  return arr.reduce((pre, crt) => pre.concat(Array.isArray(crt) ? flat(crt) : crt, []))
}
```



```javascript
//展开运算符

while(arr.some(Array.isArray)) {
  arr = [].concat(...arr)
}
```



```javascript
// [] + concat + expand operator

const deepFlatten = arr => {
  return [].concat(
  	...arr.map(
    	v => Array.isArray(v)
      	? deepFlatten(v)
      	: v
    )
  )
}
```





### 排序-数组排序|冒泡排序

> https://segmentfault.com/a/1190000014175918

实现原理

> 数组中有 `n` 个数，比较每相邻两个数，如果前者大于后者，就把两个数交换位置；这样一来，一轮for循环就可以选出一个最大的数放在最后面；那么经过 `n-1`（数组的 length - 1） 轮，就完成了所有数的排序。

![](https://segmentfault.com/img/bV7DXR?w=228&h=244)



首先 找数组中最大的数, 并把它放到数组最后.

```javascript
let arr = [3,4,1,2]


for (let i=0; i<arr.length -1; i++) {
  // 如果前一个数 大于 后一个数 就交换两数位置
  if (arr[i] > arr[i+1]) {
    let temp = arr[i]
    arr[i] = arr[i+1]
    arr[i+1] = temp
  }
}

console.log(arr) //[3,1,2,4]
```



重复 `arr.length - 1 `次，便可以实现数组按从小到大的顺序排好了

```javascript
var arr = [3,4,1,2];
// 遍历数组，次数就是arr.length - 1
for (var j = 0; j < arr.length - 1; j++) {
    // 这里 i < arr.length - 1 ，要思考思考合适吗？我们下面继续说
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            var temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
        }
    }
}
console.log(arr)  // [1,2,3,4]
```



内层 for 循环的次数写成，`i < arr.length - 1` ，是不是合适呢

当第一次，找到最大数，放到最后，那么下一次，遍历的时候，是不是就不能把最后一个数算上了呢？因为他就是最大的了，不会出现

```javascript
var arr = [3, 4, 1, 2];
function bubbleSort (arr) {
  for (var j = 0; j < arr.length - 1; j++) {
    // 这里要根据外层for循环的 j，逐渐减少内层 for循环的次数
    for (var i = 0; i < arr.length - 1 - j; i++) {
      if (arr[i] > arr[i + 1]) {
        var temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
      }
    }
  }
  return arr;
}
bubbleSort(arr);
```

我们想下这个情况，当原数组是，
`arr = [1,2,4,3];`
在经过第一轮冒泡排序之后，数组就变成了
`arr = [1,2,3,4];`
此时，数组已经排序完成了，但是按上面的代码来看，数组还会继续排序，所以我们加一个标志位，如果某次循环完后，没有任何两数进行交换，就将标志位 设置为 true，表示排序完成，这样我们就可以减少不必要的排序，提高性能。

```javascript
var arr = [3, 4, 1, 2];
function bubbleSort (arr) {
  var max = arr.length - 1;
  for (var j = 0; j < max; j++) {
    // 声明一个变量，作为标志位
    var done = true;
    for (var i = 0; i < max - j; i++) {
      if (arr[i] > arr[i + 1]) {
        var temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        done = false;
      }
    }
    if (done) {
      break;
    }
  }
  return arr;
}
bubbleSort(arr);
```







```JavaScript
# 编写代码，对arr进行排序

# 嵌套for循环就是冒泡排序,也是最慢的排序方式

===========================第1版=============================
let arr = [3,1,4,6,5,2,9,7,8,0];

for(let j=0; j<arr.length; j++){
    for(let i=0; i<arr.length; i++){   //值大小比较,最后是倒数第二和倒数第一的比较,长度减1
        if(arr[i] > arr[i+1]){
            arr.splice(i,2,arr[i+1],arr[i]);
        }
	}
}
console.log(arr);

=========================第2版-老师版======================
let arr = [3,1,4,6,5,2,9,7,8,0];

for(let j=0; j<arr.length-1; j++){  
    //解释说是当把1排出来后,后面8个数的位置是正确的,那么0的位置肯定也是正确的.所以负1次结果和负2次结果一致
    for(let i=0; i<arr.length-1; i++){   
        //console.log(arr[i],arr[i+1]) 打印结果,最后一组是0和undefined.故循环长度减1
        if(arr[i] > arr[i+1]){
            //arr.splice(arr[i],2,arr[i+1],arr[i]);
            let tem = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
        }
	}
}
console.log(arr);

```



#### 排序-数组快速排序问题

```JavaScript
  快速排序（quickSort）
  - 定义函数，实现快速排序
  
  - 原理：
  [3,1,2,5,8,9,0,7,6]
  1.从数组中获取到一个基准值:3
  2.创建两个数组left和right
  3.将数组中的其他值和基准值进行比较
  	如果比3小，则将值放入到left中
  	如果比3大，则将值放入到right中
  	[1,2,0] 3 [5,8,9,7,6]
  4.重复对left和right在进行排序
  5.最后将结果拼为一个数组
```

  

```JavaScript
let arr = [3,1,2,5,8,9,0,7,6];

//let str=arr[0];      
//let left=[], right=[];
//非常严重的错误, 这俩是设置在函数内部的,因为形参和数组名字相同导致没有考虑位置,
function fn(nums){
    let str=nums[0]; //获取基准值
	let left=[], right=[];
    if(nums.length<2){ //设置基准条件
        return nums;   //数组的长度小 不需要继续排序
    }
    for(let i=1; i<nums.length; i++){ //遍历数组nums,将所有值和基准值进行比较
    if(nums[i] > str){
        right.push(nums[i]); //小于基准值,放到left中
    }else{
        left.push(nums[i]);
    }
}
//return left.concat(str+right.concat());
    return fn(left).concat(str,fn(right));
}

fn(arr);
```



#### 排序-数组快速排序(更新)



```JavaScript
上面快速排序方法存在的问题:
 
如果目标数组是一个从0开始的有序数组的且元素多,所以排序的时候只会使用right函数,函数调用次数过多,崩溃.(教学案例数组的长度是10000)

解决方案: 函数内的基准值采用随机数
```



```JavaScript
let arr = [];
for(let i=1; i<10000; i++){
    arr.push(i);
}

function fn(nums){
     if(nums.length<2){  //写错了没执行 内存溢出
            return nums;
        }
    
	let str = Math.floor(Math.random()*nums.length);  
    //nums.lenght/2 也可以用这种.
    let basic = nums[str];
	let left=[], right=[];
  
	for(i=0; i<nums.length; i++){
    	//if(basic === nums[i]){
        //	continue;
    	//}
        if(str === i){
            continue;
        }
        
    	if(nums[i] < basic){
        	left.push(nums[i]);
    	}else{
        	right.push(nums[i]);
    	}
	}
	return fn(left).concat(basic, fn(right));
}

fn(arr);
```





#### 排序-快排|冒泡|sort比较

```JavaScript
快速排序, 冒泡排序, sort排序用时比较
```



```JavaScript
let arr1 = [], arr2 = [], arr3 = [];
for(let i=0; i<100000; i++){
    let num = Math.round(Math.random()*100000);
    arr1.push(num);
    arr2.push(num);
    arr3.push(num);
}
================冒泡排序========================

let arr = [1, 3, 4, 7, 9, 2, 0, 8, 5, 6];
function bubble(arr){
    for(let j=0; j<arr.length-1; j++){
        for(let i=0; i<arr.length-1; i++){
            if(arr[i] > arr[i+1]){
                let temp;
                temp = arr[i+1];
                arr[i+1] = arr[i];
                arr[i] = temp;
                //arr.splice(i,2,arr[i],arr[i+1]); 另一种写法
            }
        }
    }
console.log(arr);
}
bubble(arr);
===================sort排序===============================

console.time('sort');   //系统自带 时间最短
arr1.sort(function(a, b){
    return a - b;
})
console.timeEnd('sort');


console.time('快排');  //用时其次,大概10倍sort
sortArr(arr2);
console.timeEnd('快排');

console.time('冒泡');  //用时很大
bubble(arr3);
console.timeEnd('冒泡');

```



### 求数组的最大值和最小值

JavaScript提供了Math.max()函数返回一组数中的最大值,但是注意:

* 如果有任一参数不能被转换为数值, 则结果NaN
* 如果没有参数, 结果为`-Infinity`(负无穷大)

**方法list**

* for循环
* reduce
* 排序
* eval
* apply
* ES6展开运算符

```javascript
let arr = [1,2,3,4,5,6,'99'];

//for循环
let result = arr[0];
for (let i of arr) {
  if (arr[i] > result) result = arr[i];
}
console.log(result);

//reduce
arr.reduce((acc, cur, idx) => acc > cur ? acc : cur, 0)

//排序
let maxNum = arr.sort((a, b) => a - b)[length - 1]

//eval
eval("Math.max(" + arr + ")") //将一个数组转换成参数传进 Math.max 函数
//apply方法
Math.max.apply(null, arr);

//ES6展开运算符
let maxNum = Math.max(...arr);


```





### [[202303011106|数组多元化]]



### 如何将一个长数组字符串转换为数组
```js
//可以使用的方法有:

JSON.parse(str)  // 对格式有要求

Array.from(str)

[...str]

eval(str)
```



