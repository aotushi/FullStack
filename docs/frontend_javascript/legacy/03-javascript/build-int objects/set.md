---
aliases: set, map
---


### 0. 背景

在ECMAScript 6标准制定以前，由于可选的集合类型有限，数组使用的又是数值型索引，因而经常被用于创建队列和栈。如果开发者们需要使用非数值型索引，就会用非数组对象创建所需的数据结构，而这就是Set集合与Map集合的早期实现。

Set集合是一种无重复元素的列表，通常的做法是检测给定的值在某个集合中是否存在。

Map集合内含多组键值对，集合中每个元素分别存放着可访问的键名和它对应的值，Map集合经常被用于缓存频繁取用的数据

Set集合常被用于检查对象中是否存在某个键名，而Map集合常被用于获取已存的信息



### ES5实现set/map

在ECMAScript 5中，开发者们用对象属性来模拟这两种集合:

<u>这里的变量set是一个原型为null的对象，不继承任何属性</u>。在ECMAScript 5中，开发者们经常用类似的方法检查对象的某个属性值是否存在。

```javascript
//ES5模拟set集合

let set = Object.create(null);

set.foo = true;

//检查属性是否存在
if (set.foo) {
  //执行的代码
}
```

模拟这两种集合对象的唯一区别是存储的值不同,set中是布尔值.

```javascript
//ES5模拟map集合

let map = Object.create(null);
map.foo = 'bar';

//获取已存值
let value = map.foo;

console.log(value); //'bar'
```



### ES5方案的缺点

#### 1. 类型转换

**数字转换为字符串**

如果程序很简单，确实可以用对象来模拟Set集合与Map集合，但如果触碰到对象属性的某些限制，那么这个方法就会变得更加复杂。例如，所有对象的属性名必须是字符串类型，必须确保每个键名都是字符串类型且在对象中是唯一的

```javascript
//number类型作为属性会自动类型转换为字符串
let map = Object.create(null);

map[5] = 'foo';

console.log(map['5']); //'foo'
```

对象的某个属性赋值为字符串"foo"，而这个属性的键名是数值型的5，它会被自动转换成字符串，所以<u>map["5"]和map[5]引用的其实是同一个属性。如果你想分别用数字和字符串作为对象属性的键名，则内部的自动转换机制会导致很多问题。当然，用对象作为属性的键名也会遇到类似的问题</u>

**对象转换为字符串**

```javascript
//对象作为属性会自动发生类型转换
let map = Object.create(null),
    key1 = {},
    key2 = {};
map[key1] = 'foo';

console.log(map[key2]); //'foo'
```

<span style="text-decoration: underline double red;">由于对象属性的键名必须是字符串，因而这段代码中的key1和key2将被转换为对象对应的默认字符串"[object Object]"，所以map[key2]和map[key1]引用的是同一个属性。</span>

**属性值为假值时**

对于Map集合来说，如果它的属性值是假值，则在要求使用布尔值的情况下（例如在if语句中）会被自动转换成false。强制转换本身没有问题，但如果考虑这个值的使用场景，就有可能导致错误发生。

如果map.count的值为0或者不存在，if语句中的代码块将不会被执行. <u>在大型软件应用中，一旦发生此类问题将难以定位及调试，从而促使ECMAScript 6在语言中加入Set集合与Map集合这两种新特性。</u>

```javascript
let map = Object.create(null);
map.count = 1;

//本意是检查'count'属性是否存在,实际上检查的是该值是否非零
if (map.count) {
  //执行的代码
}
```

在JavaScript中有一个**in运算符**，其不需要读取对象的值就可以判断属性在对象中是否存在，如果存在就返回true。但是，in运算符也会检索对象的原型，只有当对象原型为null时使用这个方法才比较稳妥。


#### 0. 概要

ECMAScript 6中新增的Set类型是一种**有序列表**，其中含有一些**相互独立的非重复值**，通过Set集合可以快速访问其中的数据，更有效地追踪各种离散值。

ES6 新的数据结构 Set（集合）,它类似于数组，但**成员的值都是唯一的**，集合实现了iterator接口，所以可以使用『展开运算符』和『for…of…』进行遍历，  集合是键值对形式,但是键值是一样的.



#### 创建Set集合
Set本身是一个构造函数，可以接收一个数组或者类数组对象作为参数
初始化的2种方式:
**1.new Set()**
调用new Set()创建Set集合,调用add()方法向集合中添加元素，访问集合的size属性可以获取集合中目前的元素数量。
```javascript
let set = new Set();
set.add(5);
set.add('5');

console.log(set.size); //2

//Set(2) {5, '5'}
```


##### 2. 使用数组
```javascript
new Set([1,2,3,4])
```




#### 参数

<span style="text-decoration:underline double red">Set构造函数可以接受所有可迭代对象作为参数，数组、Set集合、Map集合都是可迭代的</span>，因而都可以作为Set构造函数的参数使用；构造函数通过**迭代器**从参数中提取值。

**在Set集合中，不会对所存值进行强制的类型转换**，数字5和字符串“5”可以作为两个独立元素存在（引擎内部使用第4章介绍的Object.is()方法检测两个值是否一致）。当然，<u>如果向Set集合中添加多个对象，则它们之间彼此保持独立：</u>

```javascript
//Set集合中添加多个空对象

let set = new Set(),
    key1 = {},
    key2 = {};

set.add(key1);
set.add(key2);

console.log(set.size); //2
```

由于key1和key2不会被转换成字符串，因而它们在Set集合中是两个独立的元素；如果被转换，则二者的值都是"[object Object]"。



### 属性
#### constructor
构造函数，默认就是Set函数

#### size
返回实例的成员总数。



### 方法

#### add(value)
>Set.prototype.add(value)：添加一个值，返回Set结构本身。
向Set实例中添加新的值时，不会发生类型转换。这可以理解为使用add()函数添加新值时，新值与Set实例中原有值是采用严格相等（`===`）进行比较的，只有在严格相等的比较结果为不相等时，才会将新值添加到Set实例中。

**如果多次调用add()方法并传入相同的值作为参数，那么后续的调用实际上会被忽略**：
```javascript
let set = new Set();
set.add(5);
set.add('5');
set.add(5); //重复- 本地调用直接被忽略

console.log(set.size); //2
```

但是上述规则对于NaN是一个特例，NaN与NaN在进行严格相等的比较时是不相等的，但是在Set内部，NaN与NaN是严格相等的，因此一个Set实例中只可以添加一个NaN。
```js
let set = new Set();
set.add(NaN);
set.add(NaN);
console.log(set); // Set { NaN }
```


#### size
访问集合的**size属性**可以获取集合中目前的元素数量

```javascript
let set = new Set(4);
//VM23977:1 Uncaught TypeError: number 4 is not iterable (cannot read property Symbol(Symbol.iterator))

let set = new Set([4]);
console.log(set.size); //1
```

#### has()
通过has()方法可以检测Set集合中是否存在某个值,返回值为布尔值

```javascript
let set = new Set();
set.add(5);
set.add('5');

console.log(set.has(5)); //true
console.log(set.has(6)); //false
```

#### delete()/clear()
调用delete()方法可以移除Set集合中的某一个元素，删除某个值，返回布尔值。
调用clear()方法会移除集合中的所有元素
```javascript
let set = new Set();
set.add(5);
set.add('5');

console.log(set.has(5)); //true

set.delete(5);

console.log(set.has(5)); //false
console.log(set.size); //1

set.clear();

console.log(set.has('5')); //false
console.log(set.size); //0
```


#### Set遍历
遍历方式有:
* forEach
* keys(): 返回键名的遍历器
* values(): 返回键值的遍历器
* entries(): 返回键值对的遍历器
通过遍历器,获得的对象都是遍历器对象Iterator，然后通过for...of循环可以获取每一项的值。
因为Set实例的键和值是相等的，所以keys()函数和values()函数实际返回的是相同的值。


**forEach**
针对Set数据结构，我们可以使用传统的forEach()函数进行遍历。
```javascript
mySet.forEach((value, value, set) => {}, thisArg)
```

forEach(item,key,set)方法的回调函数接收以下3个参数:
* 第一个参数item: 表示的是Set中的每个元素
* 第二个参数key: 表示的是键，实际与第一个参数相同
* 第三个参数set: 
在Set中没有索引的概念，它实际是键和值相同的集合，第二个参数表示的是键，实际与第一个参数相同
然而**Set集合没有键名**，ECMAScript 6标准制定委员会本可以规定Set集合的forEach()函数的回调函数只接受两个参数，但这可能导致几个方法之间分歧过大，于是他们最终决定所有函数都接受3个参数：**Set集合中的每个元素也按照键名和值的形式储存**，从而才能保证在所有forEach()方法的回调函数中前两个参数值具有相同含义。

在Set集合的forEach()方法中，第二个参数也与数组的一样，如果需要在回调函数中使用this引用，则可以将它作为第二个参数传入forEach()函数



#### Set集合转数组

尽管Set集合更适合用来跟踪多个值，而且又可以通过forEach()方法操作集合中的每一个元素，但是你<u>不能像访问数组元素那样直接通过索引访问集合中的元素</u>。如有需要，最好先将Set集合转换成一个数组。
```javascript
let set = new Set([1,2,3,4,5,5,5,]),
    array = [...set];

console.log(array); //[1,2,3,4,5]
```
可以用数组来初始化Set集合，Set构造函数同样会过滤掉重复的值从而保证集合中的元素各自唯一。
```javascript
let set = new Set([1,2,3,4,5,5,5,5,5,5]);
console.log(set.size); //5
```
自动去重的功能对于将已有代码或JSON结构转换为Set集合执行得非常好。



将对象存储在Set的实例与存储在变量中完全一样，只要Set实例中的引用存在，垃圾回收机制就不能释放该对象的内存空间，于是之前提到的Set类型可以被看作是一个**强引用的Set集合**.

```javascript
let set = new Set(),
    key = {};

set.add(key);
console.log(set.size); //1

//移除原始引用
key = null;

console.log(set.size); //1

//重新取回原始引用
key = [...set][0]
```

将变量key设置为null时便清除了对初始对象的引用，但是Set集合却保留了这个引用，你仍然可以使用展开运算符将Set集合转换成数组格式并从数组的首个元素取出该引用。但有时候你会希望当其他所有引用都不再存在时，让Set集合中的这些引用随之消失。举个例子，如果你在Web页面中通过JavaScript代码记录了一些DOM元素，这些元素有可能被另一段脚本移除，而你又不希望自己的代码保留这些DOM元素的最后一个引用。（这个情景被称作内存泄露。）

ECMAScript 6中引入了另外一个类型：Weak Set集合（弱引用Set集合）,<span style="text-decoration:underline wavy blue">Weak Set集合只存储对象的弱引用，并且不可以存储原始值；集合中的弱引用如果是对象唯一的引用，则会被回收并释放相应内存</span>。



#### 创建Weak Set集合

用WeakSet构造函数可以创建Weak Set集合，集合支持3个方法：add()、has()和delete()。

```javascript
let set = new WeakSet(),
    key = {};

set.add(key);

console.log(set.has(key)); //true

set.delete(key);

console.log(set.has(key)); //false
```

可以调用WeakSet构造函数并传入一个可迭代对象来创建Weak Set集合

```javascript
let key1 = [],
    key2 = [],
    set = new WeakSet([key1, key2]);

console.log(set.has(key1)); //true
console.log(set.has(key2)); //false
```



### 强引用和弱引用Set的区别

**0. 两种Set类型之间最大的区别是Weak Set保存的是对象值的弱引用**

```javascript
let set = new WeakSet(),
    key = {};

//向set集合中添加对象
set.add(key);

console.log(set.has(key)); //true

//移除对象key的最后一个强引用(Weak Set中的引用也自动移除)
key = null;

console.log(set.has(key)); //false  在浏览器中可以打印出flase. 如果使用add添加原始类型就会报错

```

这段代码执行过后，就无法访问Weak Set中key的引用了。由于我们需要向has()方法传递一个强引用才能验证这个弱引用是否已被移除，因此测试有点儿难以进行下去，但是请你相信，JavaScript引擎一定会正确地移除最后一个弱引用。????

**1. 在WeakSet的实例中，如果向add()、has()和delete()这3个方法传入非对象参数都会导致程序报错**

浏览器环境中add(), delete()会正常报错,has()不会

```javascript
new WeakSet().has('a'); //测试,在浏览器环境中不会报错
```

**2.Weak Set集合不可迭代，所以不能被用于for-of循环**

```javascript

```

**3.Weak Set集合不暴露任何迭代器（例如keys()和values()方法），所以无法通过程序本身来检测其中的内容。**????

```javascript

```

4.Weak Set集合不支持forEach()方法

5.Weak Set集合不支持size属性



### 案例

如果你只需要跟踪对象引用，你更应该使用Weak Set集合而不是普通的Set集合。Set类型可以用来处理列表中的值，但是不适用于处理键值对这样的信息结构。ECMAScript 6也添加了Map集合来解决类似的问题。

#### Set与数组的转换
将数组转换为Set时，只需要通过Set的构造函数即可；将Set转换为数组时，通过Array.from()函数或者展开运算符即可。

#### 数组去重
```javascript
const arr = ['大事儿','小事儿','好事儿','坏事儿','小事儿'];
const arr2 = [...new Set(arr)];

//封装函数
function eliminateDuplicates(items) {
  return [...new Set(items)];
}
```

#### 数组交集
```javascript
//集合论中，设A，B是两个集合，由所有属于集合A且属于集合B的元素所组成的集合，叫做集合A与集合B的交集
let arr = [1,2,3,4,1,2],
		arr2 = [3,4,5,6,4,3];

let result = [...new Set(arr)].filter(item => [...new Set(arr2)].some(item2 => item2 === item));

let result = arr.filter(item => arr2.includes(item));
```

#### 数组合集
```javascript
//给定两个集合A，B，把他们所有的元素合并在一起组成的集合，叫做集合A与集合B的并集
let arr = [1,2,3,4,1,2],
    arr2 = [3,4,5,6,4,3];

let result = [...new Set([...arr, ...arr2])];
```

#### 数组差集
```javascript
//对于给定的两个集合，返回一个包含所有存在于第一个集合且不存在于第二个集合的元素的新集合
let arr = [1,2,3,4,1,2],
    arr2 = [3,4,5,6,4,3];

let result = [...new Set(arr)].filter(item => ![...new Set(arr2)].includes(item));
let result = [...new Set(arr)].filter(item => !(new Set(arr2)).has(item));
```


### 实现Set方法

```javascript
//https://juejin.cn/post/7033275515880341512#:~:text=%F0%9F%9B%AB%20ES6%E7%AF%87-,%E5%AE%9E%E7%8E%B0set,-class%20Set%20%7B%0A%20%20constructor

class Set {
  constructor() {
    this.items = {};
    this.size = 0;
  }
  has(ele) {
    return ele in this.items;
  }
  
  add(ele) {
    if (!this.has(ele)) {
      this.items[ele] = ele;
      this.size++;
    }
    return this;
  }
  delete(ele) {
    if (this.has(ele)) {
      delete this.items[ele];
      this.size--;
    }
    return this;
  }
  
  clear() {
    this.items = [];
    this.size = 0;
  }
  
  values() {
    let values = [];
    for (let key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        values.push(key);
      }
    }
    return values;
  }
}
```


