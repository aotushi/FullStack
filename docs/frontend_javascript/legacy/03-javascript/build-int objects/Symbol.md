---
alias: symbol
---


### 1.简介
背景
在传统的JavaScript中，对象的属性名都是由字符串构成的。这样就会带来一个问题，假如一个对象继承了另一个对象的属性，我们又需要定义新的属性时，很容易造成属性名的冲突。
为了解决这个问题，ES6引入了一种新的基本数据类型Symbol，它表示的是一个独一无二的值。至此,JS一共有6种基本数据类型[[JS Base|]].[[JS Base#JS数据类型#分类]]

### 是什么

> ES6引入新的原始数据类型,`Symbol()` 函数返回 `symbol`类型的值，通过 `Symbol`创建返回的 `symbol` 值都是**唯一**的。一个`symbol` 值能作为对象属性的标识符；这是该**数据类型**仅有的目的。
>
> symbol值不能跟任何值进行计算. 
>
> 使用for..in或者for...of循环遍历的时候,遍历不到symbol属性.  可以使用Object.getOwnpropertySymbols()获取对象的symbol属性,使用 **Reflect.ownKeys**(对象)来遍历获取对象所有的属性.

```js
const s1 = Symbol();
console.log(s1);              //Symbol()
console.log(typeof s1);       //symbol

const s2 = Symbol('aa');
console.log(s2);              //Symbol(aa)
console.log(typeof s2);       //symbol

//每个返回的symbol值都是唯一的,所以相同值的symbol比较运算,返回false.
Symbol('aa') === Symbol('aa')  //false
```





#### 1.1 特点

1. Symbol 值通过 Symbol 函数生成，使用 typeof，结果为 "symbol"
```javascript
let s = Symbol();
console.log(typeof s); //'symbol'
```

2. Symbol 函数前不能使用 new 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。

3. instanceof 的结果为 false
```javascript
let s = Symbol('foo');
console.log(s instanceof Symbol); //false
```

4. Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
```javascript
let s1 = Symbol('foo');
console.log(s1); //Symbol(foo)
```

5. 如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值。
```javascript
const obj = {
  toString() {
    return 'abc';
  }
};
const sym = Symbol(obj);
console.log(sym); // Symbol(abc)
```

6. Symbol 函数的参数只是表示对当前 Symbol 值的描述，相同参数的 Symbol 函数的返回值是不相等的。
```javascript
// 没有参数的情况
var s1 = Symbol();
var s2 = Symbol();

console.log(s1 === s2); // false

// 有参数的情况
var s1 = Symbol('foo');
var s2 = Symbol('foo');

console.log(s1 === s2); // false
```

7. Symbol 值不能与其他类型的值进行运算，会报错。
```javascript
var sym = Symbol('My symbol');

console.log("your symbol is " + sym); // TypeError: can't convert symbol to string
```

8. Symbol 值可以显式转为字符串。
```javascript
var sym = Symbol('My symbol');

console.log(String(sym)); // 'Symbol(My symbol)'
console.log(sym.toString()); // 'Symbol(My symbol)'
```

9. Symbol 值可以作为标识符，用于对象的属性名，可以保证不会出现同名的属性。
```javascript
let mySymbol = Symbol();

//第一种写法
let a = {};
a[mySymbol] = 'Hello';

//第二种写法
let a = {
  [mySymbol]: 'Hello'
};

//第三种写法
let a = {};
Object.defineProperty(a, mySymbol, {value: 'Hello'})

// 以上写法都得到同样结果
console.log(a[mySymbol]); // "Hello!"
```

10. <span style="color:blue">Symbol创建的值是**不可枚举**的</span>, 以下方式遍历对象的结果不会包含`symbol`内容:
	* `for...in`循环: 循环会遍历对象的可枚举属性,但会忽略不可枚举的属性. (for...in内部是调用对象的[[Enumerate]]方法来遍历键的,而[[Enumerate]]只会返回字符串键)
	* `Object.keys()`: 方法返回一个数组,其中包含对象所有可枚举属性的名称.不可枚举的属性不会被包含在返回的数组中.
	* `JSON.stringify()`: 只会序列化对象的可枚举属性,而不会包含不可枚举属性.
		* `JSON.stringify` 直接转换 `symbol`类型数据,转换后的结果为 `undefined`
		* `JSON.stringify` 的时候，如果对象中 `key` 或者 `value`都是 `Symbol`类型时候。转换过程会把它忽略掉
	* `Object.assign()`: 用于将源对象中可枚举属性复制到目标对象. 不可枚举属性不会复制.
	* `Object.getOwnPropertyNames()`: 返回一个数组,包含对象的所有属性(包括不可枚举属性)的名称,但是不包含使用**symbol**值作为名称的属性
 可以将`Symbol`类型数据遍历出来的函数:
   * `Object.getOwnPropertySymbols`方法可以获取指定对象的所有`Symbol`属性名
   * `Reflect.ownKeys`方法可以获取执行对象的所有`Symbol`属性名
   * `Object.assign` 将属性从源对象复制到目标对象，会包含 `Symbol` 类型作为 `key` 的属性
```javascript
var obj = {};
var a = Symbol('a');
var b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols);
// [Symbol(a), Symbol(b)]

// 对象的Symbol键的enumerable属性为true,但不会在for...in循环中被遍历,但会出现在Object.assign的可枚举属性中
const symbolKey = Symbol('key');  
const source = {  
  [symbolKey]: 'Symbol Property',  
  regularProperty: 'Regular Property'  
};
const target = {}

Object.getOwnPropertyDescriptors(source)[symbolKey].enumerable; //true

Object.assign(target, source);

console.log(target); // {regularProperty: 'Regular Property', Symbol(key): 'Symbol Property'}

// chrome浏览器开发者工具在打印target后,当你点击对象旁边的三角扩展开这个对象时候,会有个提示:
"this value was evaluated upon first time. it my has changed since then".
// 这种情况出现的两种原因(官方文档): 对象属性的值是函数或Symbol类型; console.log打印对象时展开了该属性

```

11. 如果我们希望使用同一个 Symbol 值，可以使用 Symbol.for。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。
```javascript
var s1 = Symbol.for('foo');
var s2 = Symbol.for('foo');

console.log(s1 === s2); // true
```

12. Symbol.keyFor 方法返回一个已登记的 Symbol 类型值的 key。
```javascript
var s1 = Symbol.for("foo");
console.log(Symbol.keyFor(s1)); // "foo"

var s2 = Symbol("foo");
console.log(Symbol.keyFor(s2) ); // undefined
```


### 2. 创建Symbol

> 所有原始值,除了Symbol依赖都有各自的字面形式(字符串,数字,布尔值,null,undefined).
>
> Symbol唯一且合理的使用方式, 是为对象添加\[属性\].
>
> 调用Symbol()函数时,也可以传入一个字符串参数作为对符号的描述,将来可以通过这个字符串来调试代码.但这个字符串参数与符号定义或标识符无关.



#### 0. 创建Symbol

可以通过全局的Symbol函数创建一个Symbol. 

```javascript
//创建了一个名为firstName的Symbol，用它将一个新的属性赋值给person对象
let firstName = Symbol(),
    person = {};

person[firstName] = 'Nicholas';
console.log(person[firstName]); //'Nicholas'
```

**注意**

>  由于Symbol是原始值，因此调用new Symbol()会导致程序抛出错误。也可以执行new Object（你的Symbol）创建一个Symbol的实例，但目前尚不清楚这个功能何时可以使用。



#### 1. Symbol函数

**Symbol函数接受<span style="color:blue;">一个可选参数</span>**，其可以让你添加一段文本描述即将创建的Symbol，这段描述不可用于属性访问，但是建议你在每次创建Symbol时都添加这样一段描述，以便于阅读代码和调试Symbol程序

```javascript
let firstName = Symbol('first name'),
    person = {};

person[firstName] = 'Nicholas';

console.log('first name' in person); //false
console.log(person[firstName]); //'Nicholas'
console.log(firstName); //'Symbol("first name")'
```

**[[Description]]**

Symbol的描述被存储在内部的[[Description]]属性中，只有当调用Symbol的toString()方法时才可以读取这个属性。在执行console.log()时隐式调用了firstName的toString()方法，所以它的描述会被打印到日志中，但<u>不能直接在代码里访问[[Description]].</u>

```javascript
let firstName = Symbol('first name'),
    result = firstName.toString();

console.log(result); //'Symbol(first name)'
```



**Symbole的辨识方法**

Symbol是原始值，且ECMAScript 6同时扩展了typeof操作符，支持返回"symbol"，所以可以用typeof来检测变量是否为Symbol类型。

通过其他间接方式也可以检测变量是否为Symbol类型，但是typeof操作符是最准确也是你最应首选的检测方式。

```javascript
let symbol = Symbol('test symbol');
console.log(teypof symbol); //'symbol'
```



### 4. Symbol共享体系

#### 0. 背景

希望在不同的代码中共享同一个Symbol，例如，在你的应用中有两种不同的对象类型，但是你希望它们使用同一个Symbol属性来表示一个独特的标识符。一般而言，在很大的代码库中或跨文件追踪Symbol非常困难而且容易出错，出于这些原因，ECMAScript 6提供了一个可以随时访问的**全局Symbol注册表**。



#### 1. Symbol.for()

如果想创建一个可共享的Symbol，要使用Symbol.for()方法。它只接受一个参数，也就是即将创建的Symbol的字符串标识符，这个参数同样也被用作Symbol的描述

```javascript
let uid = Symbol('uid'),
    obj = {};

obj[uid] = '12345';

console.log(obj[uid]); //'12345'
console.log(uid); //'Symbol(uid)'
```

Symbol.for()方法首先在全局Symbol注册表中搜索键为"uid"的Symbol是否存在，如果存在，直接返回已有的Symbol；否则，创建一个新的Symbol，并使用这个键在Symbol全局注册表中注册，随即返回新创建的Symbol。

后续如果再传入同样的键调用Symbol.for()会返回相同的Symbol

```javascript
let uid = Symbol.for('uid'),
    obj = {
      [uid]: '12345'
    };

console.log(obj[uid]); //'12345'
console.log(uid); //'Symbol(uid)'

let uid2 = Symbol.for('uid');

console.log(uid === uid2); //true
console.log(obj[uid2]); //'12345'
console.log(uid); //'Symbol(uid)'
```



#### 2. Symbole.keyFor()

可以使用Symbol.keyFor()方法在Symbol全局注册表中检索与Symbol有关的键

```javascript
let uid = Symbol.for('uid');
console.log(Symbol.keyFor(uid)); //'uid'

let uid2 = Symbol.for('uid');
console.log(Symbole.keyFor(uid2)); //'uid'

let uid3 = Symbol('uid');
console.log(Symbol.keyFor(uid3)); //undefined
```

Symbol全局注册表是一个类似全局作用域的共享环境，也就是说你不能假设目前环境中存在哪些键。当使用第三方组件时，尽量使用Symbol键的命名空间以减少命名冲突。举个例子，jQuery的代码可以为所有键添加"jquery"前缀，就像"jquery.element"或其他类似的键。



### 4. Symbol与类型强制转换

自动转型是JavaScript中的一个重要语言特性，利用这个特性能够在特定场景下将某个数据强制转换为其他类型。然而，<u>其他类型没有与Symbol逻辑等价的值</u>，因而Symbol使用起来不是很灵活，<u>尤其是不能将Symbol强制转换为字符串和数字类型</u>，否则如果不小心将其作为对象属性，最终会导致不一样的执行结果。

**与字符串类型**

使用console.log()方法来输出Symbol的内容，它会调用Symbol的String()方法并输出有用的信息。也可以像这样直接调用String()方法来获得相同的内容

```javascript
let uid = Symbol.for('uid'),
    desc = String(uid);

console.log(desc); //'Symbol(uid)'
```

String()函数调用了uid.toString()方法，返回字符串类型的Symbol描述里的内容。但是，如果你尝试将Symbol与一个字符串拼接，会导致程序抛出错误：

```javascript
let uid = Symbol.for('uid'),
    desc = uid + ''; //报错
```

将uid与空字符串拼接，首先要将uid强制转换为一个字符串，而Symbol不可以被转换为字符串，故程序直接抛出错误。

**与数字类型**

将Symbol与每一个数学运算符混合使用都会导致程序抛出错误

```javascript
let uid = Symbol.for('uid'),
    sum = uid / 1; //报错
```

这个示例尝试将Symbol除1，程序直接抛出错误。而且无论使用哪一个数学操作符，都无法正常运行

**与逻辑操作符**

Symbol与JavaScript中的非空值类似，其等价布尔值为true

### Symbol属性检索

Object.keys()方法和Object.getOwnPropertyNames()方法可以检索对象中所有的属性名：前一个方法返回所有可枚举的属性名；后一个方法不考虑属性的可枚举性一律返回。然而为了保持ECMAScript 5函数的原有功能，这两个方法都不支持Symbol属性，而是在ECMAScript 6中添加一个**Object.getOwnPropertySymbols()**方法来检索对象中的Symbol属性。

**Object.getOwnPropertySymbols()**

Object.getOwnPropertySymbols()方法的返回值是一个包含所有Symbol自有属性的数组

```javascript
let uid = Symbol.for('uid');
let obj = {
  [uid]: '12345'
};

let symbols = Object.getOwnPropertySymbols(obj);

console.log(symbols.length); //1
console.log(symbols[0]); //'Symbol(uid)'
```



**继承**

所有对象一开始都没有自己独有的属性，但是对象可以从原型链中继承Symbol属性。ECMAScript 6通过一些well-known Symbol预定义了这些属性。



```js
//要求: 向对象中添加方法up
//使用symbol为对象obj属性的两种方式: 
//		对象块作用域外: obj[属性名称];  
//		对象块作用域内: obj{[s]:值}

let game = {
    name: 'name1'
};

//添加方式0
//弊端: 无法判断对象里是否有重名的属性或方法
 game.up = function(){
     console.log('向上');
 }

//添加方式1 函数体外

let methodUp = Symbol('up');
game[methodUp] = function(){
    console.log('向上');
};

game[methodUp]();//调用方法

书写规范: 
game.methodUp的结果是game对象中有methodUp方法  不采纳
game[methodUp], 将methodUp变量对应的值作为对象的属性名,添加到对象中

//添加方式2  函数体内
let methodDown = Symbol('down');
let game = {
    name: 'name1',
    [methodDown]:function(){
        console.log('向下');
    }
}
game[methodDown]();


```



### Symbol属性/方法

#### Symbol.toStringTag
**概述**
> `Symbol.toStringTag` 官方描述是一个字符串值属性，用于创建对象的默认字符串描述。由 `Object.property.toString()` 方法内部访问

`MDN` 描述: `Object.property.toString()` 返回一个表示该对象的字符串。旨在重写(自定义)派生类对象的类型转换逻辑。最常用的场景是判断类型.
举个例子:
```js
const toStringCallFun = Object.prototype.toString.call
toStringCallFun(new Date); //[object Date]
toStringCallFun(new String);  // [object String]  
toStringCallFun(Math); // [object Math]  
toStringCallFun(undefined); // [object Undefined]  
toStringCallFun(null); // [object Null]
```

默认情况下，`toString()` 方法被每个 `Object` 对象继承，如果此方法在自定义对象中未被覆盖，`toString()` 返回`“[object type]”`，其中 `type` 是对象的类型。

`Symbol.toStringTag` 官方已经说了它定义了 `Object.prototype.toString()` 方法的返回值。在`ES6` 之后大多数内置的对象提供了它们自己的 `Symbol.toStringTag` 标签，`toString` 时回默认返回 `Symbol.toStringTag` 键对应的值。比如常见的如下
```js
Object.prototype.toString.call(new Map());       // "[object Map]"  
Object.prototype.toString.call(function* () {}); // "[object GeneratorFunction]"  
Object.prototype.toString.call(Promise.resolve()); // "[object Promise]"  
// ... and more
```
但是在早期不是所有对象都有 `toStringTag` 属性，没有 `toStringTag` 属性的对象也会被`toString()` 方法识别并返回特定的类型标签。如下：
```js
let toStringFunc = Object.prototype.toString  
toStringFunc.call('foo')                        // '[object String]'  
toStringFunc.call([1, 2])                       // '[object Array]'  
toStringFunc.call(3)                            // '[object Number]'  
toStringFunc.call(true)                         // '[object Boolean]'  
toStringFunc.call(undefined)                    // '[object Undefined]'  
toStringFunc.call(null)                         // '[object Null]'
```
我们可以 `Symbol.toStringTag` 做点什么? 我们自己创建的类，`toString()` 可就找不到 `toStringTag` 属性喽！只会默认返回 `Object` 标签
```js
class TestClass{}  
Object.prototype.toString.call(new TestClass());// '[object Object]'
```
我们给类增加一个 `toStringTag` 属性，自定义的类也就拥有了自定义的类型标签
```js
class TestClass{  
    get [Symbol.toStringTag](){  
        return "TestToStringTag"  
    }  
}  
Object.prototype.toString.call(new TestClass());// '[object TestToStringTag]'
```


#### Symbol.prototype.valueOf()

**Define**

`**valueOf()**` 方法返回当前 symbol 对象所包含的 symbol 原始值

**Syntax**

```javascript
symbol.valueOf()
```

**Description**

在 JavaScript 中，虽然大多数类型的对象在某些操作下都会自动的隐式调用自身的 `valueOf()` 方法或者 `toString()` 方法来将自己转换成一个原始值，但 symbol 对象不会这么干，symbol 对象无法隐式转换成对应的原始值：

```javascript
Object(Symbol("foo")) + "bar";
// TypeError: can't convert symbol object to primitive
// 无法隐式的调用 valueOf() 方法

Object(Symbol("foo")).valueOf() + "bar";
// TypeError:  can't convert symbol to string
// 手动调用 valueOf() 方法，虽然转换成了原始值，但 symbol 原始值不能转换为字符串

Object(Symbol("foo")).toString() + "bar";
// "Symbol(foo)bar"，需要手动调用 toString() 方法才行
```






### 其他

#### 1. Symbol内置属性

> 扩展对象内置的功能, 不需要手动调用, 某些场景下会被动执行. 

```js
//声明一个对象
let obj = {
    name: 'yourname',
    [Symbol.replace]: function(){//注意写法,obj中Symbol.replace方法
        console.log('replace方法');
        return '对象方法执行了';
    }
}

//声明一个字符串
let str = 'hello Symbol';
//通过replace方法使用obj对象
let result = str.replace(obj, 'abc'); //这里的replace方法返回结果就是obj对象里的replace方法调用结果

console.log(result);

//打印结果
replace方法
对象方法执行了
```



#### 2. symbol为什么没有包装类型

```js
https://www.zhihu.com/question/316717095/answer/628772556
```



> 除了`null`和`undefined`，JS 里的原始类型都有对应的包装对象类型。为什么要有包装对象？是为了能用`.`语法来读取属性、调用方法（对象才能有属性和方法），比如 `"foo".length`、`(1).toFixed(2)`等代码中，都隐式的用到了包装对象。`null`和`undefined`不需要属性和方法，所以不需要包装对象。
>
> symbol 也需要读取属性和方法，所以也需要有包装对象，但一样也不推荐直接使用包装对象。ES6 是个新的开始，可以做一些大胆的改革，所以`new Symbol()` 被故意设计为抛异常，而不是墨守成规返回包装对象。但仍然能用 `Object()`把 symbol 转换为包装对象，有一个原因是因为已经有代码用 `Object(value) === value` 来判断一个值是不是对象值。
>
> 而且比起写出 `new Number()`、`new String()`、`new Boolean()` 这样的代码，菜鸟们写出 `new Symbol()`的概率更大，因为 symbol 没有字面量，而老的三种原始类型都有，有字面量的话会更容易学会用字面量。
>
> 但其实这个决定是有争议的，因为造成了语言的不统一，凭什么那仨不报错而你要报错？而且即便真把 symbol 的包装对象误作为属性键来使用，其实也能正常使用，因为有自动解包装的逻辑。
>
> ```js
> s = Symbol()
> ({[s]:1})[Object(s)] // 1
> ```
>
> 
>
> 未来的第七种原始类型 `BigInt()`，因为同样的原因，也不能被 `new`




### Symbol的使用场景
#### 用作对象属性名
在使用Symbol类型的数据时，存在几种不同的写法，遵循的一个原则就是为对象字面量新增属性时需要使用方括号\[\]。不能通过点运算符为对象添加Symbol属性
```js
// 新增一个symbol属性
let PROP_NAME = Symbol();

// 第一种写法
let obj = {};
obj[PROP_NAME] = 'Hello';

// 第二种写法
let obj = {
    [PROP_NAME]: 'Hello'
};

// 第三种写法
let obj = {};
Object.deﬁneProperty(obj, PROP_NAME, {
    value: 'Hello' 
});
```

```js
const PROP_NAME = Symbol();
const obj = {};

obj.PROP_NAME = 'Hello!';
console.log(obj[PROP_NAME]);  // undeﬁned
console.log(obj['PROP_NAME']); // 'Hello'
```


#### 用于属性区分
>我们可能会遇到这样一种场景，即通过区分两个属性来做对应的处理。

例如: 求图形的面积
```js
// 求图形的面积
function getArea(shape, options) {
    let area = 0;
    switch (shape) {
        case 'triangle':
            area = .5 * options.width * options.height;
            break;
        case 'rectangle':
            area = options.width * options.height;
            break;
    }
    return area;
}
console.log(getArea('triangle', { width: 100, height: 100 }));  // 5000
console.log(getArea('rectangle', { width: 100, height: 100 })); // 10000
```
在上面的写法中，字符串'triangle'和'rectangle'会强耦合在代码中
而事实上，我们仅想区分各种不同的形状，并不关心每个形状使用什么字符串表示，我们只需要知道每个变量的值是独一无二的即可，此时使用Symbol就会很合适。
```js
// 事先声明两个Symbol值，用于作判断
let shapeType = {
    triangle: Symbol('triangle'),
    rectangle: Symbol('rectangle')
};

function getArea(shape, options) {
    let area = 0;
    switch (shape) {
        case shapeType.triangle:
            area = .5 * options.width * options.height;
            break;
        case shapeType.rectangle:
            area = options.width * options.height;
            break;
    }
    return area;
}

console.log(getArea(shapeType.triangle, { width: 100, height: 100 }));  // 5000
console.log(getArea(shapeType.rectangle, { width: 100, height: 100 })); // 10000
```

#### 用于属性名遍历
使用Symbol作为属性名时，不能通过Object.keys()函数或者for...in来枚举，可以将一些不需要对外操作和访问的属性通过Symbol来定义。
```js
let obj = {
    [Symbol('name')]: 'Hello',
    age: 18,
    title: 'Engineer'
};

console.log(Object.keys(obj));   // ['age', 'title']

for (let p in obj) {
    console.log(p);  // 分别会输出：'age' 和 'title'
}

console.log(Object.getOwnPropertyNames(obj));   // ['age', 'title']
```

因为Symbol属性不会出现在属性遍历的过程中，所以在使用JSON.stringify()函数将对象转换为JSON字符串时，Symbol值也不会出现在结果中。
**如何获取?** [[JS Base#对象自身方法#Object.getOwnPropertySymbols()]]

#### 自定义迭代器之Symbol.iterator
`Symbol.iterator` 为每一个可遍历对象定义了默认的迭代器。该迭代器可以被`for of`循环使用。`Array,Map,Set,String` 都有内置的迭代器。 但是普通对象是不支持迭代器功能的，也就不能使用 `for of` 循环遍历。 接下来我们使用 `Symbol.iterator` 实现一个可迭代对象

```js
let symbolObjTest1 = {  
    0:"a",  
    1:"b",  
    2:"c",  
    length:3,  
    [Symbol.iterator]:function(){  
        let index = 0;  
        return {  
            next(){ // 迭代器返回的对象需要有next函数  
                return {  
                    value:symbolObjTest1[index++], // value为迭代器生成的值  
                    done:index>symbolObjTest1.length // 迭代器的终止条件，done为true时终止遍历  
                }  
            }  
        }  
    }  
}  
for(const iterator1 of symbolObjTest1){  
    console.log(iterator1); // 打印 a b c  
}
```


#### Symbol.iterator属性中使用Generator
```js
let symbolObjTest2 = {  
    0:"d",  
    1:"e",  
    2:"f",  
    length:3,  
    [Symbol.iterator]:function*(){ // 注意Generator函数格式  
        let index = 0;  
        while(index<symbolObjTest2.length){  
            yield symbolObjTets2[index++]  
        }  
    }  
}  
for(const iterator2 of symbolObjTest2){  
    console.log(iterator2);//打印 d e f  
}
```

#### 不影响原始对象遍历，遍历正常返回key value
```js
const obj = {a:1,b:2,c:3};  
obj[Symbol.iterator] = function*(){  
    for(const key of Object.keys(this)){  
        yield [key,this[key]]  
    }  
}  
for(const [key,value] of obj){  
    console.log(`${key}:${value}`); // 打印  
}
```

#### 将一个class对象实现支持迭代器
```js
class Animal{  
    constructor(name,sex,isMammal){  
        this.name = name;  
        this.sex = sex;  
        this.isMammal = isMammal;  
    }  
}  
  
class Zoo{  
 constructor(){  
    this.animals = [];  
 }  
 addAnimals(animal){  
    this.animals.push(animal);  
 }  
 [Symbol.iterator](){  
    let index = 0;  
    const animals = this.animals;  
    return {  
        next(){  
            return {  
                value:animals[index++],  
                done:index>animals.length  
            }  
        }  
    }  
 }  
}  
  
const zoo = new Zoo();  
zoo.addAnimals(new Animal('dog','victory',true));  
zoo.addAnimals(new Animal('pig','defeat',false));  
zoo.addAnimals(new Animal('cat','defeat',false));  
for (const animal of zoo) {  
    console.log(`${animal.name};${animal.sex};${animal.isMammal}`)  
}  
// 打印 dog;victory;true     pig;defeat;false    cat;defeat;false
```


#### Symbol.asyncIterator 实现对象异步迭代器
> `Symbol.asyncIterator` 可用于实现以一个对象的异步迭代器,多用于处理异步数据流场景.

举个使用的例子: 假设开发的业务中一个功能，需要调用大量的异步请求(网络请求、数据库查询、或者文件操作)，但是这个功能需要这些异步请求依次获取数据，根据 `before after` 结果统计出最后内容，因此需要使用异步迭代器完成。

```js
// 异步迭代器demo  
class AsyncRequest{  
    constructor(request){  
        this._request = request;  
    }  
    async *[Symbol.asyncIterator](){  
        for (const item of this._request) {  
            const res = await this._dealAsyncRequest(item);  
            yield res;  
        }  
    }  
    async _dealAsyncRequest(item){  
        // 模拟异步处理数据请求的过程  
        return new Promise((resolve)=>{  
            setTimeout(()=>{  
                resolve(item*100);  
            },1000)  
        })  
    }  
}  
(async function dealData(){  
    const dataSource = new AsyncRequest([1,2,3,4]);  
    for await(const data of dataSource){  
        console.log(data)  
    }  
})()
```

使用 `for await of` 进行异步迭代时，每次迭代都会等待前一个异步操作完成，然后再进行下一次迭代，这样可确保按顺序处理每个异步操作的结果

#### Symbol 基础类型（Reflect.Meta应用）

>在定义元数据的时候 `Reflect.Meta` 其实它是一个全局变量，这里面的 `key` 很多使用 `Symbol` 类型，防止出现重复内容。 比如Nest框架的实现，在使用`Reflect.Meta`定义 `http method` 元数据时，也都会使用 `Symbol,`我想也是防止**其他库**也使用装饰器定义出相同的 `key`，使用 `Symbol('path')` 可以避免重复问题

```ts
  
export const pathMetadataKey = Symbol('path');  

export function GET(path: string) {  
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {  
    Reflect.defineMetadata(pathMetadataKey, path, target, propertyKey);  
    implementProcess(Method.GET, path, target, propertyKey, descriptor);  
  }  
}
```

#### 手动实现一个Symbol
在这里仅实现一个尽量满足 `Symbol` 特点的函数，因为有一些能力是互相冲突的，进行了一些取舍，具体实现的能力直接在代码中进行了注释。欢迎提建议交流
```js
(function(){  
    let root = this;  
    // 因为symbol一个特殊的能力就是可以保证对象key的唯一性  
    const generateName = (function(){  
        let postfix = 0;  
        return function(descStr){  
            postfix++;  
            return `&&_${descStr}_&&_${postfix}`;  
        }  
    })()  
    const CustomSymbol = function(desc){  
        // 不可以 new  
        if(this instanceof CustomSymbol) throw new TypeError('Symbol is not a constructor')  
        // desc 如果不是undefined会被toString  
        let descStr =desc === undefined ? undefined : String(desc);  
        // 需保证 symbol 值唯一性  
        let symbol = Object.create({  
            toString:function(){  
                return this.__Name__;  
                // 没有直接返回Symbol字符串是和保证作为对象key的唯一性有冲突，选择了后者 obj[symbol1] obj[symbol2]  
                // return 'Symbol('+this.__Desc__+')';  
            },  
            // 显示调用返回该值 隐式调用(会先调用对象的valueOf函数，如果没有返回基本值，就会再调用toString方法)  
            valueOf:function(){  
                return this;  
            }  
        });  
        // 保证 symbol 值唯一性  
        Object.defineProperties(obj,{  
            '__Desc__':{  
                value:descStr,  
                writable:false,  
                enumerable:false,  
                configurable:false,  
            },  
            // __Name__的generateName保证作为对象key时唯一性  
            '__Name__':{  
                value:generateName(descStr),  
                writable:false,  
                enumerable:false,  
                configurable:false,  
            }  
        });  
        return symbol;  
    }  
      let forMap = {}  
    Object.defineProperties(customSymbol,{  
        // 实现 Symbol.for  
        'for':{  
            value:function(desc){  
                let descStr = des  
                if(!Reflect.has(forMap,key)){  
                    Reflect.set(forMap,key,customSymbol(descStr))  
                }  
                return Reflect.get(forMap,key)  
            },  
            writable:false,  
            enumerable:false,  
            configurable:false,  
        },  
        // 实现 Symbol.keyFor  
        'keyFor':{  
            value:function(symbolValue){  
                for (const [key,value] of forMap.entries()) {  
                    if(value === symbolValue) return key  
                }  
            },  
            writable:false,  
            enumerable:false,  
            configurable:false  
        }  
    })  
    root.symbol = CustomSymbol;  
})()
```