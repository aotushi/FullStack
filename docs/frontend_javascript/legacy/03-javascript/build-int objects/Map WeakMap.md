---
alias: map
---


### 背景

ECMAScript 6中的Map类型是一种储存着许多**键值对的有序列表**，其中的键名和对应的值支持所有的数据类型。<u>键名的等价性判断是通过调用Object.is()方法实现的</u>，所以数字5与字符串“5”会被判定为两种类型，可以分别作为独立的两个键出现在程序中，这一点与对象中不太一样，因为对象的属性名总会被强制转换成字符串类型。

它类似于==对象和集合==，也是键值对的集合。但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。Map也实现了iterator接口，所以可以使用『展开运算符』和『for…of…』进行遍历



### Map
#### 0. 声明
```javascript
new Map(); //创建映射
```

在对象中，无法用对象作为对象属性的键名；但是在Map集合中，却可以这样做
```javascript
let map = new Map(),
    key1 = {},
    key2 = {};

map.set(key1, 5);
map.set(key2, 42);

console.log(map.get(key1)); //5
console.log(map.get(key2)); //42
```

在这段代码中，分别用对象key1和key2作为两个键名在Map集合里存储了不同的值。这些键名不会被强制转换成其他形式，所以这两个对象在集合中是独立存在的，也就是说，<u>以后你不再需要修改对象本身就可以为其添加一些附加信息</u>。

#### 1. 初始化方法
可以向Map构造函数传入**数组**来初始化一个Map集合，这一点同样与Set集合相似。数组中的每个元素都是一个子数组，子数组中包含一个键值对的键名与值两个元素

```javascript
let map = new Map([['name', 'Nicholas'], ['age', 25]]);

console.log(map.has('name')); //true
console.log(map.get('name')); //'Nicholas'
console.log(map.has('age')); //true
console.log(map.get('age')); //25
console.log(map.size); //2
```

数组包裹数组的模式看起来可能有点儿奇怪，但由于Map集合可以接受任意数据类型的键名，<u>为了确保它们在被存储到Map集合中之前不会被强制转换为其他数据类型，因而只能将它们放在数组中，因为这是唯一一种可以准确地呈现键名类型的方式</u>。!!!!????



### Map与其它数据结构转换
**Map转换为数组**
Map转换为数组，可以通过展开运算符实现。
```js
//Map转换为数组
const map = new Map();
map.set('name', 'kingx');
map.set('age', 12);

const arr = [...map];
console.log(arr); // [ [ 'name', 'kingx' ], [ 'age', 12 ] ]
```


**数组转换为Map**
通过Map构造函数实现，使用new操作符生成Map的实例。

**Map转换为对象**
```js
// Map转换为对象
function mapToObj(map) {
    let obj = {};
    for(let [key, value] of map) {
        obj[key] = value;
    }
    return obj;
}
console.log(mapToObj(map));  // { name: 'kingx', age: 12 }
```

**对象转Map**
只需要遍历对象的属性并通过set()函数添加到Map的实例中即可。
```js
// 对象转换为Map
function objToMap(obj) {
    let map = new Map();
    for (let k of Object.keys(obj)) {
        map.set(k, obj[k]);
    }
    return map;
}
console.log(objToMap({yes: true, no: false}));
// Map {"yes" => true, "no" => false}
```

**Map转JSON字符串**
* 第一种是当Map的键名都是字符串时，可以先将Map转换为对象，然后调用JSON.stringify()函数
* 第二种是当Map的键名有非字符串时，我们可以先将Map转换为数组，然后调用JSON.stringify()函数
```js
// Map转换为JSON，通过对象
function mapToJson(strMap) {
    // 先将map转换为对象，然后转换为JSON
    return JSON.stringify(mapToObj(strMap));
}
let myMap = new Map().set('yes', true).set('no', false);
console.log(mapToJson(myMap)); // {"yes":true,"no":false}
```

```js
// Map转换为JSON,通过数组
function mapToArrayJson(map) {
    // 先通过展开运算符转换为数组，再转换为JSON
    return JSON.stringify([...map]);
}
let myMap2 = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap2); // [[true,7],[{"foo":3},["abc"]]] 
```

**Set转换为Map**
可以将遍历Map本身获取到的键和值构成一个数组，然后通过add()函数添加至set实例中。
```js
// Map实例转换为Set
function mapToSet(map) {
    let set = new Set();
    for (let [k,v] of map) {
        set.add([k, v])
    }
    return set;
}
const map14 = new Map()
    .set('yes', true)
    .set('no', false);
mapToSet(map14); // Set { [ 'yes', true ], [ 'no', false ] }
```

**Map转换为Set**
可以将遍历Map本身获取到的键和值构成一个数组，然后通过add()函数添加至set实例中。
```js
// Map实例转换为Set
function mapToSet(map) {
    let set = new Set();
    for (let [k,v] of map) {
        set.add([k, v])
    }
    return set;
}
const map14 = new Map()
    .set('yes', true)
    .set('no', false);
mapToSet(map14); // Set { [ 'yes', true ], [ 'no', false ] }
```


## Weak Map

#### 0. 概要
Weak Map是弱引用Map集合，也用于存储对象的弱引用。**Weak Map集合中的键名必须是一个对象或Symbol，如果使用其它键名会报错**；集合中保存的是这些对象的弱引用，如果在弱引用之外不存在其他的强引用，引擎的垃圾回收机制会自动回收这个对象，同时也会移除Weak Map集合中的键值对。但是只有集合的键名遵从这个规则，键名对应的值如果是一个对象，则保存的是对象的强引用，不会触发垃圾回收机制。

>更新: ES2023,weakmap可以使用symbol作为键.


**Weak Map集合最大的用途是保存Web页面中的DOM元素**，例如，一些为Web页面打造的JavaScript库，会通过自定义的对象保存每一个引用的DOM元素。

使用这种方法最困难的是，一旦从Web页面中移除保存过的DOM元素，如何通过库本身将这些对象从集合中清除；否则，可能由于库过于庞大而导致内存泄露，最终程序不再正常执行。如果用WeakMap集合来跟踪DOM元素，这些库仍然可以通过自定义的对象整合每一个DOM元素，而且当DOM元素消失时，可以自动销毁集合中的相关对象。

#### 1. 创建

Weak Map类型是一种存储着许多键值对的无序列表，列表的**键名必须是非null类型的对象，键名对应的值则可以是任意类型**。Weak Map的接口与Map非常相似，通过**set()方法添加数据，通过get()方法获取数据**

```javascript
let map = new Weak Map(),
  	element = document.querySelector('.element');

map.set(element, 'Original');

//移除element元素
element.parentNode.removeChild(element);
element = null;

//此时Weak Map集合为空


// 使用Symbol作为键
const weak = new WeakMap()
const key = Symbol('my ref')
const someobj = {/*data data data */}
weak.set(key, someobj)
```

与Weak Set集合相似的是，Weak Map集合也不支持size属性，从而无法验证集合是否为空；同样，由于没有键对应的引用，因而无法通过get()方法获取到相应的值，Weak Map集合自动切断了访问这个值的途径，当垃圾回收程序运行时，被这个值占用的内存将会被释放。



### 方法与属性

#### set(key,value)
如果要向Map集合中添加新的元素，可以调用set()方法并分别传入键名和对应值作为两个参数

返回值是map
```javascript
let map = new Map();
map.set('title', 'Understanding ECMAScript 6');
map.set('year', 2016);

```
注意: 如果Map实例的键是原生数据类型，则采用严格相等判断是否为同一个键。
对于Number类型数据，+0和-0严格相等，虽然NaN与NaN不严格相等，但是Map会将其视为一个相同的键。
字符串'true'与Boolean类型true不严格相等，是两个不同的键。
对于Undefined类型和Null类型，undefined与null也是两个不同的键。
```js
let map = new Map();
map.set(-0, 123);
map.get(+0); // 123

map.set(NaN, 123);
map.set(NaN, 234);
map.get(NaN); // 234
```

#### get(key)
调用get()方法可以获得两个键名对应的值。如果调用get()方法时传入的键名在Map集合中不存在，则会返回undefined。

```javascript
let map = new Map();
map.set('title', 'Understanding ECMAScript 6');
map.set('year', 2016);

console.log(map.get('title')); //Understanding ECMAScript 6
console.log(map.get('year')); //2016
```


#### has(key)
返回一个布尔值，表示某个键是否在当前Map对象中

#### delete(key)
delete()函数删除某个键，返回“true”；如果删除失败，返回“false”。

#### clear()
clear()函数清除所有成员，没有返回值。
移除Map集合中的所有键值对.clear()方法可以快速清除Map集合中的数据，同样，Map集合也支持批量添加数据 ????

#### size
代表当前集合中包含的键值对数量

### 遍历
与Set一样，Map的遍历同样可以采用4种函数，分别是forEach()函数、keys()函数、values()函数、entries()函数。


#### forEach(item,key,map)
Map集合的forEach()方法与Set集合和数组中的forEach()方法类似，回调函数都接受3个参数
```javascript
let map = new Map([['name', 'Nicholas'], ['age', 25]]);

map.forEach((value, key, ownermap) => {
  console.log(key + ' ' + value);
  console.log(ownermap === map);
});

//name Nicholas
//true
//age 25
//true
```

可以指定forEach()函数的第二个参数作为回调函数的this值。

keys()函数返回的是键的集合，values()函数返回的是值的集合，entries()函数返回的键值对的集合。
这些集合都是Iterator的实例，可以通过for...of进行遍历。
```js
for (let key of map.keys()) {
    console.log(key);
}
// name
// age

for (let value of map.values()) {
    console.log(value);
}
// kingx
// 12

for (let obj of map.entries()) {
    console.log(obj);
}
// [ 'name', 'kingx' ]
// [ 'age', 12 ]
```



#### 2. Weak Map集合初始化

Weak Map集合的初始化过程与Map集合类似，调用WeakMap构造函数并传入一个数组容器，容器内包含其他数组，每一个数组由两个元素构成：第一个元素是一个键名，传入的值必须是非null的对象；第二个元素是这个键对应的值（可以是任意类型）

```javascript
let key1 = {},
    key2 = {},
    map = new Weak Map([[key1, 'hello'], [key2, '42']]);

console.log(map.has(key1)); //true
console.log(map.get(key1)); //'hello'
console.log(map.has(key2)); //true
console.log(map.get(key2)); //42
```

如果给WeakMap构造函数传入的诸多键值对中含有非对象的键，会导致程序抛出错误。

#### 3. 方法

Weak Map集合只支持两个可以操作键值对的方法：

has()方法可以检测给定的键在集合中是否存在；

delete()方法可以移除指定的键值对。

**Weak Map集合与Weak Set集合一样，二者都不支持键名枚举，从而也不支持clear()方法**

Weak Map集合的键名只支持非null的对象值；调用delete()方法可以从Weak Map集合中移除指定的键值对，此时如果再调用has()方法检查这个键名会返回false，调用get()方法返回undefined。




#### 4. 私有对象数据!!!!????

尽管Weak Map集合会被大多数开发者用于储存DOM元素，但它其实也有许多其他的用途: 其中的一个实际应用是**存储对象实例的私有数据**。在ECMAScript 6中对象的所有属性都是公开的，如果想要储存一些只对对象开放的数据. 怎么做呢.

```javascript
function Person(name) {
  this._name = name;
}

Person.prototype.getName = function() {
  return this._name;
}
```

这段代码中，约定前缀为下划线\_的属性为私有属性，不允许在对象实例外改变这些属性。例如，只能通过getName()方法读取this.\_name属性，不允许改变它的值。然而没有任何标准规定如何写\_name属性，所以它也有可能在无意间被覆写。

在ECMAScript 5中，可以通过以下这种模式创建一个对象接近真正的私有数据：

```javascript
let Person = (function() {
  let privateDate = {},
      privateId = 0;
  
  function Person(name) {
    Object.defineProperty(this, '_id', {value: privateId++});
    privateDate[this._id] = {name: name};
  }
  
  Person.prototype.getName = function() {
    return privateData[this._id].name;
  };
  
  return Person;
})();
```

在上面的示例中，变量Person由一个立即调用函数表达式（IIFE）生成，包括两个私有变量：privateData和privateId。privateData对象储存的是每一个实例的私有信息，privateId则为每个实例生成一个独立ID。当调用Person构造函数时，属性_id的值会被加1，这个属性不可枚举、不可配置并且不可写。

然后，新的条目会被添加到privateData对象中，条目的键名是对象实例的ID；privateData对象中储存了所有实例对应的名称。调用getName()函数，即可通过this.\_id获得当前实例的ID，并以此从privateData对象中提取实例名称。在IIFE外无法访问privateData对象，即使可以访问this.\_id，数据实际上也很安全。

这种方法最大的问题是，如果不主动管理，由于无法获知对象实例何时被销毁，因此privateData中的数据就永远不会消失。而使用Weak Map集合就可以解决这个问题

```javascript
let Person = (function() {
  let privateData = new WeakMap();
  
  function Person(name) {
    privateData.set(this, {name: name});
  }
  
  Person.prototype.getName = function() {
    return privateData.get(this).name;
  };
  
  return Person;
})();
```



#### 5. 使用方式及限制

当你要在Weak Map集合与普通的Map集合之间做出选择时，需要考虑的主要问题是，是否只用对象作为集合的键名。如果是，那么Weak Map集合是最好的选择。当数据再也不可访问后集合中存储的相关引用和数据都会被自动回收，这有效地避免了内存泄露的问题，从而优化了内存的使用。

相对Map集合而言，Weak Map集合对用户的可见度更低，其不支持通过forEach()方法、size属性及clear()方法来管理集合中的元素。如果你非常需要这些特性，那么Map集合是一个更好的选择，只是一定要留意内存的使用情况。

当然，如果你只想使用非对象作为键名，那么普通的Map集合是你唯一的选择。

### 实现Map

```javascript
//https://juejin.cn/post/7033275515880341512#:~:text=%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81-,%E5%AE%9E%E7%8E%B0%20map,-function%20defaultToString(key
function defaultToString(key) {
  if (key === null) {
    return 'NULL';
  } else if (key === undefined) {
    return 'UNDEFINED';
  } else if (Object.prototype.toString.call(key) === '[object Object]' || Object.prototype.toString.call(key) === '[object Array]') {
    return JSON.stringify(key);
  }
  return key.toString();
}

class Map {
  constructor() {
    this.items = [];
    this.size = 0;
  }
  
  set(key, value) {
    if (!this.has(key)) {
      this.items[defaultToString(key)] = value;
      this.size++;
    }
    return this;
  }
  
  get(key) {
    return this.items[defaultToString(key)];
  }
  
  has(key) {
    return this.items[defaultToString(key)] !== undefined;
  }
  
  delete(key) {
    if (this.has(key)) {
      delete this.items[key];
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
      if (this.has(key)) {
        values.push(key);
      }
    }
    return values;
  }
}
```


#### Map对象排序

> https://juejin.cn/post/6940644097652703246

* Array.from(将类数组对象或可遍历对象转换成数组)
* sort
* 转回map对象(Map([ [a,b], [c,d] ])会生成{a=>b, c=>d})

```javascript
const map = new Map() // 我偏偏要乱序，你能咋地
map.set(2, '林二心')
map.set(1, '林一心')
map.set(5, '林五心')
map.set(4, '林四心')
map.set(3, '林三心')
console.log(map) // Map { 2 => '林二心', 1 => '林一心', 5 => '林五心', 4 => '林四心', 3 => '林三心' }



const arr = Array.from(map);
console.log(arr);
console.log(arr) 
/* [ [ 2, '林二心' ],
     [ 1, '林一心' ],
     [ 5, '林五心' ],
     [ 4, '林四心' ],
     [ 3, '林三心' ] ] */

arr.sort((a,b) => a[0] - b[0]);
console.log(arr);
/* [  [ 1, '林一心' ],
      [ 2, '林二心' ],
      [ 3, '林三心' ],
      [ 4, '林四心' ],
      [ 5, '林五心' ] ] */


const map2 = new Map(arr);
console.log(map2)
```
