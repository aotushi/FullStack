---
alias: json
---


### 1.介绍
JSON数据在网络传输时存在两种类型，一种是JSON对象类型，一种是JSON字符串类型，两种类型的转换涉及JSON序列化和反序列化的知识。

**JSON** 对象包含两个方法: 
1. 用于解析 [JavaScript Object Notation](http://json.org/) ([JSON](https://developer.mozilla.org/zh-CN/docs/Glossary/JSON)) 的 `parse()` 方法
2. 将对象/值转换为 JSON字符串的 `stringify()` 方法。
除了这两个方法, JSON这个对象本身并没有其他作用，也不能被调用或者作为构造函数调用。

**序列化对象如下** 
* 对象
* null 
* 数组
* 数值
* 字符串
* 布尔值



**写法**
JSON字符串不能以逗号结尾，否则会解析异常
```js
var json = '{"name":"kingx"}';      // 这个是正确的JSON格式

var json = "{\"name\":\"kingx\"}";  // 这个也是正确的JSON格式

var json = '{name:"kingx"}';        // 这个是错误的JSON格式，因为属性名没有用双引号括起来

var json = "{'name':'kingx'}";      //这个也是错误的JSON格式，属性名应该用双引号括起来，而它用了单引号
```

```js
JSON.parse("[1, 2, 3, 4, ]");  // 解析异常，数组最后一个元素后面出现逗号
JSON.parse('{"foo" : 1, }');   // 解析异常，最后一个属性值后面出现逗号
```


### 2. JSON VS Javascript

| JS类型     | JSON的不同点                                                 |
| ---------- | ------------------------------------------------------------ |
| 对象  数组 | 属性名称必须是双引号括起来的字符串; 最后一个属性后不能有逗号 |
| 数值       | 禁止出现前导零 （ JSON.stringify 方法自动忽略前导零，而在 JSON.parse 方法中将会抛出 SyntaxError）；如果有小数点, 则后面至少跟着一位数字。 |
| 字符串     | 只有有限的一些字符可能会被转义；禁止某些控制字符； Unicode 行分隔符 （[U+2028](https://unicode-table.com/cn/2028/)）和段分隔符 （[U+2029](https://unicode-table.com/cn/2029/)）被允许 ; 字符串必须用双引号括起来。 |



### 3. 方法

#### 1 JSON.parse()/反序列化

> JSON反序列化的实现方式有两种，一种是使用JSON对象内置的parse()函数，一种是使用eval()函数。
> JSON.parse()函数用来解析JSON字符串，构造由字符串描述的JavaScript值或对象.
> 解析JSON字符串并返回对应的值，可以额外传入一个转换函数，用来将生成的值和其属性, 在返回之前进行某些修改。

**语法**

```js
JSON.parse(text[, reviver])

//参数
//text 要被解析成 JavaScript 值的字符串，关于JSON的语法格式
//reviver 可选 转换器, 如果传入该参数(函数)，可以用来修改解析生成的原始值，调用时机在 parse 函数返回之前。



//eval()函数
//eval()函数用于计算JavaScript字符串，并把它作为脚本来执行。在使用eval()函数进行JSON反序列化时，其语法如下所示。
eval("(" + str + ")")
```


**参数**
`text`
表示待解析的JSON字符串。
`reviver`
可选参数。如果是一个函数，则规定了原始值在返回之前如何被解析改造。如果被解析的JSON字符串是非法的，则会抛出异常。


**返回值**
对象
如果传入的字符串不符合JSON规范，　则抛出SyntaxError错误


**示例**

```js
JSON.parse('{}'); //{}
JSON.parse('true'); //true
JSON.parse('"foo"'); //"foo"
JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
JSON.parse('null');   //null
```



**reviver函数**

> 如果指定了 `reviver` 函数，则解析出的 JavaScript 值（解析值）会经过一次转换后才将被最终返回（返回值）
>
> 更具体点讲就是：解析值本身以及它所包含的所有属性，会按照一定的顺序（从最最里层的属性开始，一级级往外，最终到达顶层，也就是解析值本身）分别的去调用 `reviver` 函数，在调用过程中，当前属性所属的对象会作为 `this` 值，当前属性名和属性值会分别作为第一个和第二个参数传入 `reviver` 中。如果 `reviver` 返回 `undefined`，则当前属性会从所属对象中删除，如果返回了其他值，则返回的值会成为当前属性新的属性值。
>
> 当遍历到最顶层的值（解析值）时，传入 `reviver` 函数的参数会是空字符串 `""`（因为此时已经没有真正的属性）和当前的解析值（有可能已经被修改过了），当前的 `this` 值会是 `{"": 修改过的解析值}`，在编写 `reviver` 函数时，要注意到这个特例。（这个函数的遍历顺序依照：从最内层开始，按照层级顺序，依次向外遍历）

```js
JSON.parse('{"p": 5}', function(k,v) {
  if(k === '') return v; // 如果到了最顶层，则直接返回属性值，
  return v*2;						// 否则将属性值变为原来的 2 倍。
})											// { p: 10 }

JSON.parse('{"1": 1, "2": 2,"3": {"4": 4, "5": {"6": 6}}}', function (k, v) {
    console.log(k); // 输出当前的属性名，从而得知遍历顺序是从内向外的，
                    // 最后一个属性名会是个空字符串。
    return v;       // 返回原始属性值，相当于没有传递 reviver 参数。
});

// 1
// 2
// 4
// 6
// 5
// 3
// ""
```







#### 2 JSON序列化/JSON.stringify()

JSON序列化即将JSON对象处理为JSON字符串的过程，以方便数据的传输。
**定义**

`JSON.stringify()` 方法将一个 JavaScript <u>对象或值</u>转换为 JSON 字符串，如果指定了一个 replacer 函数，则可以选择性地替换值，或者指定的 replacer 是数组，则可选择性地仅包含数组指定的属性。

**语法**

```js
JSON.stringify(value[, replacer[, space]])
```

`value` 将要序列化成 一个 JSON 字符串的值, 通常为<span style="color:blue">对象或数组</span>

`replacer` **可选**
* 如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；
* 如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；
	* 如果属性值为对象或者数组，则会继续序列化该属性值，直到属性值为基本类型、函数或者Symbol类型才结束。
* 如果该参数为 <u>null 或者未提供</u>，则对象所有的属性都会被序列化。

`space` **可选**
* 指定缩进用的空白字符串，用于美化输出（pretty-print）；
* 如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；
* 如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；
* 如果该参数没有提供（或者为 null），将没有空格。

**描述**

`JSON.stringify()`将值转换为相应的JSON格式：

- 转换值如果有 toJSON() 方法，那么toJSON()函数就会覆盖默认的序列化行为，被序列化的值将不再是原来的属性值，而是toJSON()函数的返回值。
- 非数组对象的属性不能保证以特定的顺序出现在序列化后的字符串中。
- 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值
```js
JSON.stringify([new Number(1), new String("false"), new Boolean(false)]);  //'[1,"false",false]'
```
- <u>`undefined`</u>、<u>任意的函数</u>以及 <u>symbol 值</u>，
  - 出现在非数组对象的属性值中时, 在序列化过程中会被忽略(属性和属性值都会被忽略)
  - 出现在数组中时,被转换成 `null`
  - 函数、undefined 被单独转换时，会返回 undefined(Symbol()也返回undeinfed,但一般都是放在对象中用作属性键)
```js
// 在非数组对象中
JSON.stringify({
	x: undefined,
	y: Object,
	z: Symbol('')
})

//输出
'{}'

//在数组对象中
JSON.stringify({
	[undefined, Object, Symbol('')]
})
//输出
'[null, null, null]'

//被单独转换
JSON.stringify(undefined) //undefined
JSON.stringify(()=>{})    //undefined
JSON.stringify(Symbol())  //undefined
```

- 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
```js
let a = {name: 'a'}
let b = {name: 'b'}
a.child = b
b.parent = a

JSON.stringify(a)

//控制台报错
TypeError: Converting circular structure to JSON
```
- 所有以 symbol 为属性键的属性都会被完全忽略掉，即便 `replacer` 参数中强制指定包含了它们。
```js
JSON.stringify(
	{
		[Symbol('foo')]: 'foo'
	}
)

//输出结果
'{}'
```
- Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理。(Date.now()数值格式)
- NaN 和 Infinity 格式的数值及 null 都会被当做 null。
- 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性。(不可枚举属性会被忽略)




**实例**

```js
JSON.stringify({});                        // '{}'
JSON.stringify(true);                      // 'true'
JSON.stringify("foo");                     // '"foo"'
JSON.stringify([1, "false", false]);       // '[1,"false",false]'
JSON.stringify({ x: 5 });                  // '{"x":5}'

JSON.stringify({x: undefined, y: Object, z: Symbol("")});
// '{}'

JSON.stringify([undefined, Object, Symbol("")]);
// '[null,null,null]'

JSON.stringify({[Symbol("foo")]: "foo"});
// '{}'

JSON.stringify({[Symbol.for("foo")]: "foo"}, [Symbol.for("foo")]);
// '{}'

JSON.stringify(
  {[Symbol.for("foo")]: "foo"},
  function (k, v) {
    if (typeof k === "symbol"){
      return "a symbol";
    }
  }
);


// undefined

// 不可枚举的属性默认会被忽略：
JSON.stringify(
  Object.create(
    null,
    {
      x: { value: 'x', enumerable: false },
      y: { value: 'y', enumerable: true }
    }
  )
);

// "{"y":"y"}"
```

**replace函数**

replacer 参数可以是<u>一个函数或者一个数组</u>。作为函数，它有两个参数，键（key）和值（value），它们都会被序列化。

在开始时, `replacer` 函数会被传入一个空字符串作为 `key` 值，代表着要被 `stringify` 的这个对象。随后每个对象或数组上的属性会被依次传入。 

函数应当返回JSON字符串中的value, 如下所示:

- 如果返回一个 [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number), 转换成相应的字符串作为属性值被添加入 JSON 字符串。
- 如果返回一个 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String), 该字符串作为属性值被添加入 JSON 字符串。
- 如果返回一个 [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean), "true" 或者 "false" 作为属性值被添加入 JSON 字符串。
- 如果返回任何其他对象，该对象递归地序列化成 JSON 字符串，对每个属性调用 replacer 方法。除非该对象是一个函数，这种情况将不会被序列化成 JSON 字符串。
- 如果返回 undefined，该属性值不会在 JSON 字符串中输出。

**注意:** 不能用 replacer 方法，从数组中移除值（values），如若返回 undefined 或者一个函数，将会被 null 取代。

replacer是一个函数
```javascript
function replacer(key, value) {
  if (typeof value === 'string') {
    return undefined;
  }
  return value;
}

let foo = {foundation: 'Mozilla', model: 'box', week: 45, transprot: 'cart', month: 7};

let jsonString = JSON.stringify(foo, replacer);

//'{"week": 45, "month": 7}'
```

如果 `replacer` 是一个数组，数组的值代表将被序列化成 JSON 字符串的属性名
```javascript
JSON.stringify(foo, ['week', 'month']);
//'{"week":45,"month":7}', 只保留 “week” 和 “month” 属性值。
```



**space参数**
* `space `参数用来控制结果字符串里面的间距。
* 如果是一个数字, 则在字符串化时每一级别会比上一级别缩进多这个数字值的空格（最多10个空格）；
* 如果是一个字符串，则<u>每一级别</u>会比上一级别多缩进该字符串（或该字符串的前10个字符）。

```javascript
JSON.stringify({a:2}, null, ' '); //'{\n "a": 2\n}'
```

使用制表符(\t)来缩进
```javascript
JSON.stringify({ uno: 1, dos : 2 }, null, '\t')
// '{            \
//     "uno": 1, \
//     "dos": 2  \
// }'
```

**toJSON()方法**
如果一个被序列化的对象拥有 `toJSON` 方法，那么该 `toJSON` 方法就会覆盖该对象默认的序列化行为：不是该对象被序列化，而是<u>调用 `toJSON` 方法后的返回值会被序列化</u>
函数内部的this指向当前对象
```javascript
var obj2 = {
    name: 'kingx',
    age: 15,
    address: String('北京市'),
    interest: ['basketball', 'football'],
    email: 'zhouxiongking@163.com',
    toJSON: function () {
          // 只返回name和age属性值，并且修改key
        return {
            Name: this.name,
            Age: this.age
        };
    }
};


console.log(JSON.stringify(obj 2));                    //{"Name":"kingx","Age":15}
console.log(JSON.stringify({name: obj 2}, ['name']));  //{"name":{}}
```


**序列化顺序**
* 如果待序列化的对象存在toJSON()函数，则优先调用toJSON()函数，以toJSON()函数的返回值作为待序列化的值，否则返回JSON对象本身。
* 如果stringify()函数提供了第二个参数replacer，则对上一步的返回值经过replacer参数处理。
* 如果stringify()函数提供了第三个参数，则对JSON字符串进行格式化处理，返回最终的结果。


**bug**

```js
//一个组件为了保留一份 JSON 对象，使用 JSON.stringify 将其转换成字符串, 后面使用 JSON.parse 方法之后，发现数据有所变化
let obj = {
  name: 'Gopal',
  age: Infinity
}
let originObj = JSON.stringify(obj)
console.log(originObj) // {"name":"Gopal","age":null}
```

```js
//解决方法
方法1: 直接赋值, 重新给age属性赋值
方法2:
function censor(key, value) {
  if(key === 'Infinity') {
    return "Infinity"
  }
  return value;
}

let b = JSON.stringify(a ,censor);
let c = JSON.parse(
	b,
  function (key, value) {
    return value === "Infinity" ? Infinity : value;
  }
)
```




### 4. JSON.stringify()实例

#### 1. 调试对象

使用 JSON.stringify()先将对象转换为字符串

```javascript

//Initialize a User object
const user = {
"name" : "蔡生",
"age" : 26
}
console.log(user);
// [object Object]


console.log(JSON.stringify(user));
//"{"name": "蔡生", "age": 26}"
```

#### 2. 存储localStorage对象

存储用户创建的一个对象，并且，即使在浏览器被关闭后仍能恢复该对象。

```javascript
// 创建一个示例数据
var session = {
    'screens' : [],
    'state' : true
};
session.screens.push({"name":"screenA", "width":450, "height":250});
session.screens.push({"name":"screenB", "width":650, "height":350});
session.screens.push({"name":"screenC", "width":750, "height":120});
session.screens.push({"name":"screenD", "width":250, "height":60});
session.screens.push({"name":"screenE", "width":390, "height":120});
session.screens.push({"name":"screenF", "width":1240, "height":650});

// 使用 JSON.stringify 转换为 JSON 字符串
// 然后使用 localStorage 保存在 session 名称里
localStorage.setItem('session', JSON.stringify(session));

// 然后是如何转换通过 JSON.stringify 生成的字符串，该字符串以 JSON 格式保存在 localStorage 里
var restoredSession = JSON.parse(localStorage.getItem('session'));

// 现在 restoredSession 包含了保存在 localStorage 里的对象
console.log(restoredSession);
```

#### 3. 数组去重

对数组中的对象进行去重

```javascript
function unique(arr) {
  let unique = {};
  arr.forEach(item => unique[JSON.stringify(item)]) = item;
  arr = Object.keys(unique).map(u => JSON.parse(u));
  
  return arr;
}
```

以上这种方案存在问题, {x:1,y:2}与{y:2,x:1}通过 JSON.stringify 字符串化值不同，但显然他们是重复的对象。

```javascript
function unique2(arr) {
  let unique = {};
  arr.forEach(item => {
    let newData = {};
    Object.keys(item).sort().forEach(key => newData[key] = item[key]);
    unique[JSON.stringify(newData)] = item;
  })
  return arr = Object.keys(unique).map(item => JSON.prase(item));
}
```

#### 3.1 数组中对象属性排序

```javascript
//https://mp.weixin.qq.com/s?__biz=MzAxODE4MTEzMA==&mid=2650078414&idx=1&sn=f8564c1bfea10a3aa9c19ed08eeed830&chksm=83da61abb4ade8bd3aecc2e501d6eb7a27c078af3255ea57aae6ed413534e5844d8544077046&scene=21#wechat_redirect


JSON.stringify(obj, Object.keys(obj).sort())
JSON.stringify(obj, ['a', 'b', 'c'])
JSON.stringify(Object.keys(obj).sort().reduce((acc, cur) => acc[cur] = obj[k], {}) )
```

#### 3.2 完整的数组中对象去重(未完成!!!!)

```javascript
//第一种
function unique(arr) {
	let unique = {};
  arr.forEach(item => unique[JSON.stringify(item, Object.keys(item).sort())] = item)
  return arr = Object.keys(unique).map(item => JSON.parse(item))
}


//第二种
function unique(arr) {
  let unique = {};
  arr.forEach(item => unique[orderedJsonStringify(item)] = item);
  return arr = Object.keys(unique).map(item => JSON.parse(item))
}

function orderedJsonStringify(item) {
  return JSON.stringify(Object.keys(item).sort().reduce((acc, cur) => acc[cur] = item[cur]))
}


```





#### 4. replacer函数的使用 ????

还是上面这道题，我们可以在第二个参数上解决对象属性的顺序问题，给它加上一个数组['name','author']

```javascript

function unique(arr) {
  let unique = {};
  arr.forEach(item => unique[JSON.stringify(item, ['name', 'author'])] = item )
  return arr = Object.keys(unique).map(item => JSON.parse(item));
}
```



#### 5. 实现深拷贝 ????

```javascript
function deeppClone(data) {
  return JSON.parse(JSON.stringify(data))
}
```



#### 6. 判断数组是否包含某对象,或者判断对象是否相等

```javascript
//判断数组中是否包含某对象
let data = [
    {name:'echo'},
    {name:'前端开发博客'},
    {name:'蔡生'},
    ],
    val = {name:'蔡生'};
JSON.stringify(data).indexOf(JSON.stringify(val)) !== -1;//true

//判断两数组/对象是否相等
let a = [1,2,3],
    b = [1,2,3];
JSON.stringify(a) === JSON.stringify(b);//true
```







### 5. 实例

#### 1.删除json中的转义字符右斜杠 ??

```js
JSON.stringify(data).toString.replace(new RegExp("\\\\\"","gm"),"\""))

data.replaceAll('\\','');
```

#### 2 判断对象/数组是否相等

```js
let a = [1,2,3],
    b = [1,2,3];
JSON.stringify(a) === JSON.stringify(b);// true  

//Object.is()
//toString()  隐患: 数字1和字符串1会被认为相等
```



#### 3 localStorage/sessionStorage存储对象

>  localStorage/sessionStorage 只可以存储字符串，当我们想存储对象的时候，需要使用 JSON.stringify 转换成字符串，获取的时候再 JSON.parse

```js
// 存
function setLocalStorage(key,val) {
    window.localStorage.setItem(key, JSON.stringify(val));
};
// 取
function getLocalStorage(key) {
    let val = JSON.parse(window.localStorage.getItem(key));
    return val;
};
```



#### 4 实现对象深拷贝

```js
无法实现对含有方法的对象的拷贝
```



#### 5 路由(浏览器地址)传参

因为浏览器传参只能通过字符串进行，所以也是需要用到 JSON.stringify



#### 6. 存储函数

> https://mp.weixin.qq.com/s/1Sbr_GGm5k-L0oq4_cfQ3w

