---
aliases:
  - 字符串
---



#### 长字符串的2种实现方式

两种方法:

* 使用 + 运算符将多个字符串连接起来
* 每行末尾使用反斜杠字符（“\\”）,但输出的时候还是一行

```javascript
let longString = "This is a very long string which needs " +
                 "to wrap across multiple lines because " +
                 "otherwise my code is unreadable.";

//确保反斜杠后面没有空格或任何除换行符之外的字符或缩进; 否则反斜杠将不会工作。 
let longString = "This is a very long string which needs \
to wrap across multiple lines because \
otherwise my code is unreadable.";
```



# 描述



## 基本字符串和字符串对象的区别

<u>字符串字面量 (通过单引号或双引号定义) 和 直接调用 String 方法(没有通过 new 生成字符串对象实例)的字符串都是基本字符串。</u>

<u>JavaScript会自动将基本字符串转换为字符串对象</u>，只有将基本字符串转化为字符串对象之后才可以使用字符串对象的方法。

当基本字符串需要调用一个字符串对象才有的方法或者查询值的时候(基本字符串是没有这些方法的)，JavaScript 会自动将基本字符串转化为字符串对象并且调用相应的方法或者执行查询。

```javascript
let s_prim = 'foo';
let s_obj = new String(s_prim);

console.log(typeof s_prim); //'string'
console.log(typeof s_ojb); //'object'
```

当使用 [`eval`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)时，基本字符串和字符串对象也会产生不同的结果。`eval` 会将基本字符串作为源代码处理; 而字符串对象则被看作对象处理, 返回对象。

```javasript
let s1 = '2 + 2';
let s2 = new String('2 + 2');

console.log(eval(s1)); //4
console.log(eval(s2)); //'2+2'
```



利用 [`valueOf`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/valueOf) 方法，我们可以将字符串对象转换为其对应的基本字符串

```javascript
console.log()
```

## [字符串是不可变的](https://zh.javascript.info/string#zi-fu-chuan-shi-bu-ke-bian-de)

在 JavaScript 中，字符串不可更改

 ```javascript
 let str = 'hello';
 
 str.length = 0;
 console.log(str); //'hello'
 
 str[0] = 'a';
 console.log(str); //'hello'
 ```

通常的解决方法是创建一个新的字符串，并将其分配给 `str` 而不是以前的字符串

```javascript
let str = 'Hi';

str = 'h' + str[1];  // 替换字符串

alert( str ); // hi
```


## 定义字符串

在JavaScript中，有3种定义字符串的方式，分别是字符串字面量，直接调用String()函数与new String()构造函数。

* 字符串字面量
* String函数  使用 `String` 函数将其他值生成或转换成字符串
* new String()



#### <u>字符串字面量</u>

字符串字面量就是直接通过单引号或者双引号定义字符串的方式。

需要注意的是，在JavaScript中，单引号和双引号是等价的，都可以用来定义字符串，只不过使用单引号开头的字符串就要使用单引号结尾，使用双引号开头的字符串就要使用双引号结尾。



#### <u>直接调用String()函数</u>

直接调用String()函数，会将传入的任何类型的值转换成字符串类型，在转换时遵循的规则如下。

* 如果是Number类型的值，则直接转换成对应的字符串。
*  如果是Boolean类型的值，则直接转换成'true'或者'false'。
* 如果值为null，则返回字符串'null'；
* 如果值为undefined，则返回字符串'undefined'；
* 如果值为字符串，则直接返回字符串本身；
* 如果值为引用类型，则会先调用toString()函数获取返回值，将返回值按照上述步骤①～⑤判断能否转换字符串类型，如果都不满足，则会调用对象的valueOf()函数获取返回值，并将返回值重新按照步骤①～⑤判断能否转换成字符串类型，如果也不满足，则会抛出类型转换的异常。



#### <u>new String()构造函数</u>

new String()构造函数使用new运算符生成String类型的实例，对于传入的参数同样采用和上述String()函数一样的类型转换策略，最后的返回值是一个String类型对象的实例。

```js
new String('hello JavaScript'); // String {"hello JavaScript"}
```


#### 3者的区别

使用第一种字符串字面量方式和第二种直接调用String()函数的方式得到的字符串都是基本字符串，而通过第三种方式，new运算符生成的字符串是字符串对象。

基本字符串在作比较时，只需要比较字符串的值即可；而在比较字符串对象时，比较的是对象所在的地址。

我们看看以下用来测试相等的实例。

```js
var str = 'hello';
var str2 = String(str);
var str3 = String('hello');
var str4 = new String(str);
var str5 = new String(str);
var str6 = new String('hello');

str === str2;   // true
str2 === str3;  // true
str3 === str4;  // false
str4 === str5;  // false
str5 === str6;  // false
```





## 转义字符
### js中使用转义字符的原因
[[js词法解构#^7c5949]]

除了普通的可打印字符以外，一些有特殊功能的字符可以通过转义字符的形式放入字符串中

??? 为什么在浏览器控制台中输出`a\nb`不会换行，换成console.log和alert才可以

以下列表展示可以在JS字符串中使用的特殊字符:

| 自身character                    | 含义                                        |
| -------------------------------- | ------------------------------------------- |
| \0                               | 零字节  console.log('stri\0ng') //'stri ng' |
| \b                               | 退格符                                      |
| \f                               | 换页符                                      |
| \n                               | 换行符                                      |
| \r  Carriage return              | 回车                                        |
| \t                               | tab(制表符)                                 |
| \v Vertical tab                  | 垂直标签                                    |
| \\'   Apostrophe or single quote | 撇号或单引号                                |
| \\" double quote                 | 双引号                                      |
| \\\   Backslash character        | 反斜杠字符                                  |
| \XXX                             |                                             |
| \xXX                             | Latin-1字符（x小写)                         |
| \uXXX                            | Unicode码                                   |
| \u{XXXXX}                        |                                             |

**转义字符Escaping characters**

> 对于表格中没有的字符, 前置的反斜杠将会被忽略. 但是这种用法不推荐且应该避免.

你能在一个字符串内部通过前置反斜杠插入一个引号. 这称为转移引号(this is known as escaping the quotation mark)

```js
let quote = "he read \"the cremation of sam mcgee\" by r.w. service.";
console.log(quote);

//he read "the cremation of sam mcgee" by r.w. service.
```

你能通过在换行符之前使用反斜杠来转义换行(line breaks)

```js
let str = 'this string \
is broken \
across multiple \
lines.'

console.log(str);
//this string is broken across multiple lines.
```


## Unicode字符
>[Unicode与前端字符编码全揭秘 - 掘金 (juejin.cn)](https://juejin.cn/post/7070079762429034526)

[[Unicode编码|Unicode]]





## 编码格式

在ECMAScript 6出现以前，JavaScript字符串一直基于16位字符编码（UTF-16）进行构建。每16位的序列是一个编码单元（code unit），代表一个字符. length、charAt()等字符串属性和方法都是基于这种编码单元构造的。在过去16位足以包含任何字符，直到Unicode引入扩展字符集，Unicode的目标是为全世界每一个字符提供全球唯一的标识符。如果我们把字符长度限制在16位，码位数量将不足以表示如此多的字符。

UTF-16中，前2<sup>16</sup>个码位均以16位的编码单元表示，这个范围被称作基本多文种平面（BMP，Basic Multilingual Plane）。超出这个范围的码位则要归属于某个辅助平面（supplementaryplane），其中的码位仅用16位就无法表示了。为此，UTF-16引入了代理对（surrogate pair），其规定用两个16位编码单元表示一个码位。

字符串里的字符有两种，一种是由一个编码单元16位表示的BMP字符，另一种是由两个编码单元32位表示的辅助平面字符。

```javascript
let text = '𠮷';
console.log(text.length); //2
console.log(/^.$/.test(text)); //false
console.log(text.charAt(0)); //''
console.log(text.charAt(1)); //''
console.log(text.charCodeAt(0)); //55362
console.log(text.charCodeAt(1)); //57271

//Unicode字符“[插图]”是通过代理对来表示的，因此，这个示例中的JavaScript字符串操作将其视为两个16位字符。
```



```JavaScript
字符串在计算机底层实际上就是一个字符数组
let str = 'Hello'; --> ['H', 'e', 'l', 'l', 'o'];

因为字符串是不可变数据类型,所以数组的破坏性方法无法使用.
```



## 字符串与正则相关方法

#### str.search()

```javascript 
- 可以去字符串中搜索指定的内容
- 该方法可以传递一个正则表达式
- 可以检查字符串中是否含有符合正则表达式的内容

- 返回值
- 返回第一个符合条件的内容的索引
- 如果没有,返回-1


let str = 'Hello13764567901Atguigu';
let result = str.search(/1[3-9][0-9]{9}/);
console.log(result);// 返回值是5


```



#### str.split()

```javascript
- 用来将一个字符串拆分成一个数组
- 可以根据正则表达式去拆字符串

let str = '孙悟空abc猪八戒adc沙和尚';
result = str.split(/a[bd]c/); //["孙悟空", "猪八戒", "沙和尚"]


```



#### str.replace()

```javascript
- 用来使用新的内容替换字符串中的旧内容
- str.replace(新内容, 旧内容);
- 参数:
	1.被替换的内容(支持正则表达式)
	2.新的内容
- 注意:
默认情况下,replace()只会替换第一个符合条件的内容,如果希望替换所有的内容,则需要使用全局匹配模式 g

str = '孙悟空abc猪八戒Adc沙和尚';
// result = str.replace('孙悟空','牛魔王');
result = str.replace(/a[bd]c/g,'哈哈');
result = str.replace(/a[bd]c/ig,'哈哈'); 



```



#### str.match()

```javascript
- 可以将字符串中符合正则表达式中的内容提取出来
- 它会将匹配到的结果保存到一个数组中返回
链接: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match

str = 'dasdhasjdks13567890456gjkslafjwieoruqiowrtqi13675689042fjaskfgj13890979681aksfjkaf'
result = str.match(/1[3-9][0-9]{9}/g);
// alert(result[0]);
// alert(result[1]);
```






## 方法

在String对象的原型链上有一系列的函数，例如indexOf()函数、substring()函数、slice()函数等，通过String对象的实例可以调用这些函数做字符串的处理。

但是我们发现，采用字面量方式定义的字符串没有通过new运算符生成String对象的实例也能够直接调用原型链上的函数。

```js
'hello'.indexOf('e');  // 1
'hello'.substring(1);  // 'ello'
'hello'.slice(1);      // 'ello'
```

这是为什么呢？

实际上基本字符串本身是没有字符串对象的函数，而在基本字符串调用字符串对象才有的函数时，JavaScript会自动将基本字符串转换为字符串对象，形成一种包装类型，这样基本字符串就可以正常调用字符串对象的方法了。

基本字符串和字符串对象在经过eval()函数处理时，会产生不同的结果。

eval()函数会将基本字符串作为源代码处理，如果涉及表达式会直接进行运算，返回运算后的结果；而字符串对象则会被看作对象处理，返回对象本身。

```js
var s1 = '2 + 2';               // 创建一个字符串字面量
var s2 = new String('2 + 2');   // 创建一个对象字符串
console.log(eval(s1));          // 4
console.log(eval(s2));          // String {"2 + 2"}
```


![](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/code1.3jgtzdbqhjs0.webp)

### Unicode支持

#### codePointAt()

ECMAScript 6新增加了<u>完全支持UTF-16</u>的codePointAt()方法，这个方法接受<u>编码单元的位置而非字符位置作为参数</u>，返回与字符串中给定位置对应的码位，即一个整数值。

```javascript
let text = '𠮷a';

console.log(text.charCodeAt(0)); //55362
console.log(text.charCodeAt(1)); //57271
console.log(text.charCodeAt(2)); //97

console.log(text.codePointAt(0)); //134071
console.log(text.codePointAt(1)); //57271
console.log(text.codePointAt(2)); //97
```

**对于BMP字符集中的字符，codePointAt()方法的返回值与charCodeAt()方法的相同，而对于非BMP字符集来说返回值则不同。**字符串text中的第一个字符是非BMP的，包含两个编码单元，所以它的length属性值为3。charCodeAt()方法返回的只是位置0处的第一个编码单元，而codePointAt()方法则返回完整的码位，即使这个码位包含多个编码单元。对于位置1（第一个字符的第二个编码单元）和位置2（字符“a”），二者的返回值相同。

要检测一个字符占用的编码单元数量，最简单的方法是调用字符的codePointAt()方法，可以写这样的一个函数来检测：

```javascript
function is32Bit(c) {
  return c.codePointAt(0) > 0XFFFF;  //0xffff是65535
}

console.log(is32Bit('𠮷')); //true
console.log(is32Bit('a')); //false
```



#### String.fromCodePoint()

ECMAScript通常会面向同一个操作提供正反两种方法。你可以使用codePointAt()方法在字符串中检索一个字符的码位，也可以使用String.fromCodePoint()方法根据指定的码位生成一个字符。

```javascript
console.log(String.fromCodePoint(134071)); //𠮷
```



#### normalize()

Unicode的另一个有趣之处是，如果我们要对不同字符进行排序或比较操作，会存在一种可能，它们是等效的。有两种方式可以定义这种关系。首先，规范的等效是指无论从哪个角度来看，两个序列的码位都是没有区别的；第二个关系是兼容性，两个互相兼容的码位序列看起来不同，但是在特定的情况下可以被互相交换使用。

但如果你曾经开发过一款国际化的应用，那么normalize()方法就有用得多了。

所以，代表相同文本的两个字符串可能包含着不同的码位序列。举个例子，字符“æ”和含两个字符的字符串“ae”可以互换使用，但是严格来讲它们不是等效的，除非通过某些方法把这种等效关系标准化。

ECMAScript 6为字符串添加了一个normalize()方法，它可以提供Unicode的标准化形式。这个方法接受一个可选的字符串参数，指明应用以下的某种Unicode标准化形式：

· 以标准等价方式分解，然后以标准等价方式重组（"NFC"），默认选项。

· 以标准等价方式分解（"NFD"）。

· 以兼容等价方式分解（"NFKC"）。

· 以兼容等价方式分解，然后以标准等价方式重组（"NFKD"）。

对于这4种形式之间差异的解读不在本书的范围之内，你只需牢记**，在对比字符串之前，一定先把它们标准化为同一种形式。**举个例子：

```javascript
let normalized = values.map(function(text) {
  return text.normalize();
})

normalized.sort(function(first, second) {
  if (first < second) {
    return -1;
  } else if (first === second) {
    return 0;
  } else {
    return 1;
  }
})
```

以上这段代码将values数组中的所有字符串都转换成同一种标准形式，因此该数组可以被正确地排序。<u>如果你想对原始数组进行排序，则可以在比较函数中添加normalize()方法</u>，就像这样：

```javascript
values.sort(function(first, second) {
  let firstNormalized = first.nromalize(),
      secondNormalized = second.normalize();
  
  if (firstNormalized < secondNormalized) {
    return -1;
  } else if (firstNormalized === secondNormalized) {
    return 0;
  } else {
    return 1;
  }
})
```

切记在进行排序和比较操作前，将被操作字符串按照同一标准进行标准化。这里的示例都采用默认的NFC形式，你也可以明确指定其他形式：

```javascript
values.sort(function(first, second) {
  let firstNormalized = first.nromalize('NFD'),
      secondNormalized = second.normalize('NFD');
  
  if (firstNormalized < secondNormalized) {
    return -1;
  } else if (firstNormalized === secondNormalized) {
    return 0;
  } else {
    return 1;
  }
})
```



### 子串识别

#### includes()

#### startsWith()

#### endsWith()

自JavaScript首次被使用以来，开发者们就开始使用indexOf()方法来在一段字符串中检测另一段子字符串，而在ECMAScript 6中，提供了以下3个类似的方法可以达到相同效果：

* includes()方法，如果在字符串中检测到指定文本则返回true，否则返回false
* startsWith()方法，如果在字符串的起始部分检测到指定文本则返回true，否则返回false
* endsWith()方法，如果在字符串的结束部分检测到指定文本则返回true，否则返回false。

以上的3个方法都接受两个参数：

第一个参数指定要搜索的文本；

第二个参数是可选的，指定一个开始搜索的位置的索引值。

如果指定了第二个参数，则includes()方法和startsWith()方法会从这个索引值的位置开始匹配，endsWith()方法则从字符串长度减去这个索引值的位置开始匹配；如果不指定第二个参数，includes()方法和startsWith()方法会从字符串起始处开始匹配，endsWith()方法从字符串末尾处开始匹配。实际上，指定第二个参数会大大减少字符串被搜索的范围。

#### ES6方法和ES5比较

尽管这3个方法执行后返回的都是布尔值，也极大地简化了子串匹配的方法，但是如果你需要在一个字符串中寻找另一个子字符串的实际位置，还需使用indexOf()方法或lastIndexOf()方法。

对于startsWith()、endsWith()及includes()这3个方法，如果你没有按照要求传入一个字符串，而是传入一个正则表达式，则会触发一个错误产生；而对于indexOf()和???

### String.prototype.padStart
#### 概述


#### 语法


#### 实例

### String.prototype.padEnd

#### 概述
> 为目标字符串填充字符串,并达到某个长度要求

#### 语法
```js
padEnd(targetLength)
padEnd(targetLength, padString)
```

**参数**
`targetLength`
* 填充后的字符串的长度
* 如果此值小于或等于`str.length`, 当前字符串会原样返回

`padString` (可选)
* 用来填补当前字符串所使用的字符
* 如果`padString`太长不符合`targetLength`, 那它将会被截断.对于从左到右的语言，将应用最左边的部分；对于从右到左的语言，将应用最右边的部分。
* 参数默认值是''(`U+0020`)

**返回值**
声明的`targetLength`和`padString`应用到当前`str`的尾部的1个字符串.

**例子**
```js
'abc'.padEnd(10) //'abc       '
'abc'.padEnd(10,'foo') //'abcfoofoof'
'abc'.padEnd(6, '123456') //'abc123'
'abc'.padEnd(1) //'abc'
'abc'.padEnd(0) //'abc'
```


#### 实例
```
```









### concat()

**定义**

**`concat()`** 方法将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回

**参数**

```javascript
str.concat(str2,[, ...strN])
```

`str2 [, ...strN]`  需要连接到str的字符串

**返回值**

一个新的字符串，包含参数所提供的连接字符串

**描述**

* `concat` 方法将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回。 `concat` 方法并不影响原字符串。

* 如果参数不是字符串类型，它们在连接之前将会被转换成字符串
* 强烈建议使用[赋值操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Assignment_Operators)（`+`, `+=`）代替 `concat` 方法. `concat`存在性能问题.

```HTML
"".concat({})    // [object Object]
"".concat([])    // ""
"".concat(null)  // "null"
"".concat(true)  // "true"
"".concat(4, 5)  // "45"
```



### includes()

**定义**

**`includes()`** 方法用于判断一个字符串是否包含在另一个字符串中，根据情况返回 true 或 false。

**参数**

```javascript
str.includes(searchString[, fromIndex])
```

`searchString` 要搜索的字符串

`fromIndex` **可选** 

* 从当前字符串的哪个索引位置开始搜寻子字符串，默认值为 `0`

**描述**

* 区分大小写



### indexOf()

**定义**

`indexOf()` 方法返回调用它的 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 对象中第一次出现的指定值的索引，从 `fromIndex` 处进行搜索。如果未找到该值，则返回 -1。

**参数**

```javascript
str.indexOf(searchValue[, fromIndex]);
```

`searchValue` 要被查找的字符串值

* 如果没有提供确切地提供字符串，[searchValue 会被强制设置为 `"undefined"`](https://tc39.github.io/ecma262/#sec-tostring)， 然后在当前字符串中查找这个值。
* 举个例子：`'undefined'.indexOf()` 将会返回0，因为 `undefined` 在位置0处被找到，但是 `'undefine'.indexOf()` 将会返回 -1 ，因为字符串 `'undefined'` 未被找到。

`fromIndex` **可选** 

* 数字表示开始查找的位置。可以是任意整数，默认值为 `0`
* 如果 `fromIndex` 的值小于 `0`，或者大于 `str.length` ，那么查找分别从 `0` 和`str.length` 开始。（译者注： `fromIndex` 的值小于 `0`，等同于为空情况； `fromIndex` 的值大于或等于 `str.length` ，那么结果会直接返回 `-1` 。）

**返回值**

* 查找的字符串 `searchValue` 的第一次出现的索引，如果没有找到，则返回 `-1`

* 若被查找的字符串 `searchValue` 是一个<u>空字符串</u>，将会产生“奇怪”的结果。如果 `fromIndex` 值为空，或者 `fromIndex` 值小于被查找的字符串的长度，返回值和以下的 `fromIndex` 值一样
* 如果 `fromIndex` 值大于等于字符串的长度，将会直接返回字符串的长度（`str.length`）

```javascript
'hello world'.indexOf('') // 返回 0
'hello world'.indexOf('', 0) // 返回 0
'hello world'.indexOf('', 3) // 返回 3
'hello world'.indexOf('', 8) // 返回 8
"Blue Whale".indexOf("", -1)       // 返回 0

'hello world'.indexOf('', 11) // 返回 11
'hello world'.indexOf('', 13) // 返回 11
'hello world'.indexOf('', 22) // 返回 11
```

**描述**

* `indexOf` 方法是区分大小写的

```javascript
"Blue Whale".indexOf("blue")      // 返回 -1
```

**实例**

[使用 `indexOf` 统计一个字符串中某个字母出现的次数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf#使用_indexof_统计一个字符串中某个字母出现的次数)

```javascript
var str = 'To be, or not to be, that is the question.';
var count = 0;
var pos = str.indexOf('e');

while(pos !== -1) {
  count++;
  pos = str.indexOf('e', pos+1)
}
```







### lastIndexOf()

**定义**

 **`lastIndexOf()`** 方法返回调用[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 对象的指定值最后一次出现的索引，在一个字符串中的指定位置 `fromIndex`处从后向前搜索。如果没找到这个特定值则返回-1 。

**参数**

```javascript
str.lastIndexOf(searchValue[, fromIndex])
```

`searchValue` 一个字符串，表示被查找的值。

* 如果`searchValue`是空字符串，则返回`fromIndex`

`fromIndex` **可选**

* 待匹配字符串searchValue的开头一位字符从 str的第fromIndex位开始向左回向查找。
* `fromIndex`默认值是 `+Infinity`。
* 如果 `fromIndex >= str.length` ，则会搜索整个字符串。
* 如果 `fromIndex < 0` ，则等同于 `fromIndex == 0`。

**返回值**

返回指定值最后一次出现的索引(该索引仍是以从左至右0开始记数的)，如果没找到则返回-1。

**描述**

* `'abab'.lastIndexOf('ab', 2)` 将返回 2 而不是 0, 因为fromIndex只限制待匹配字符串的开头
* `lastIndexOf` 方法区分大小写

```javascript
'canal'.lastIndexOf('a');     // returns 3 （没有指明fromIndex则从末尾l处开始反向检索到的第一个a出现在l的后面，即index为3的位置）
'canal'.lastIndexOf('a', 2);  // returns 1（指明fromIndex为2则从n处反向向回检索到其后面就是a，即index为1的位置）
'canal'.lastIndexOf('a', 0);  // returns -1(指明fromIndex为0则从c处向左回向检索a发现没有，故返回-1)
'canal'.lastIndexOf('x');     // returns -1
'canal'.lastIndexOf('c', -5); // returns 0（指明fromIndex为-5则视同0，从c处向左回向查找发现自己就是，故返回0）
'canal'.lastIndexOf('c', 0);  // returns 0（指明fromIndex为0则从c处向左回向查找c发现自己就是，故返回自己的索引0）
'canal'.lastIndexOf('');      // returns 5
'canal'.lastIndexOf('', 2);   // returns 2


"blue Whale, Killer Whale".lastIndexOf("blue"); // returns 0

"Blue Whale, Killer Whale".lastIndexOf("blue"); // returns -1
```



### match()

**定义**

 **`match()`** 方法检索返回一个字符串匹配正则表达式的结果

**参数**

```javascript
str.match(regexp)
```

`regexp` 一个[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)对象。

* 如果传入一个非正则表达式对象，则会隐式地使用 `new RegExp(obj)` 将其转换为一个 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp) 。
* 如果你没有给出任何参数并直接使用match() 方法 ，你将会得到一 个包含空字符串的 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) ：[""] 。

**返回值**

* 如果使用g标志，则将返回与完整正则表达式匹配的所有结果，但不会返回捕获组。
* 如果未使用g标志，则仅返回第一个完整匹配及其相关的捕获组（`Array`）。 在这种情况下，返回的项目将具有如下所述的其他属性。
  * `groups`: 一个捕获组数组 或 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)（如果没有定义命名捕获组）
  * `index`: 匹配的结果的开始位置
  * `input`: 搜索的字符串

一个[`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)，其内容取决于global（`g`）标志的存在与否，如果未找到匹配则为[`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)

```javascript
const paragraph = 'The quick brown fox jumps over the lazy dog. It barked.';
const regex = /[A-Z]/g;
const found = paragraph.match(regex);

console.log(found); //['T', 'I']


const regex = /[A-Z]/;
const found = paragraph.match(regex);
console.log(found); 

//['T', index: 0, input: 'The quick brown fox jumps over the lazy dog. It barked.', groups: undefined]
```



**描述**

* 如果正则表达式不包含 `g `标志，`str.match()` 将返回与 [`RegExp.exec()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)相同的结果

**实例**

使用 `match` 查找 "`Chapter`" 紧跟着 1 个或多个数值字符，再紧跟着一个小数点和数值字符 0 次或多次。正则表达式包含 `i` 标志，因此大小写会被忽略 ????

```javascript
let str = 'For more information, see Chapter 3.4.5.1',
    re = /see (Chapter \d+(\.\d)*)/i,
    found = str.match(re);

console.log(found)
            
            
// logs [ 'see Chapter 3.4.5.1',
//        'Chapter 3.4.5.1',
//        '.1',
//        index: 22,
//        input: 'For more information, see Chapter 3.4.5.1' ]

// 'see Chapter 3.4.5.1' 是整个匹配。
// 'Chapter 3.4.5.1' 被'(chapter \d+(\.\d)*)'捕获。
// '.1' 是被'(\.\d)'捕获的最后一个值。
// 'index' 属性(22) 是整个匹配从零开始的索引。
// 'input' 属性是被解析的原始字符串。
```

[`match` 使用全局（global）和忽略大小写（ignore case）标志](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match#example_using_global_and_ignore_case_flags_with_match)

```javascript
var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var regexp = /[A-E]/gi;
var matches_array = str.match(regexp);

console.log(matches_array);
// ['A', 'B', 'C', 'D', 'E', 'a', 'b', 'c', 'd', 'e']
```

[`使用match()，不传参数`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match#使用match，不传参数)

```javascript
var str = "Nothing will come of nothing.";

str.match();   // returns [""]
```

[一个非正则表达式对象作为参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match#一个非正则表达式对象作为参数)

当参数是一个字符串或一个数字，它会使用new RegExp(obj)来隐式转换成一个 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)。如果它是一个有正号的正数，RegExp() 方法将忽略正号。

```javascript
var str1 = "NaN means not a number. Infinity contains -Infinity and +Infinity in JavaScript.",
    str2 = "My grandfather is 65 years old and My grandmother is 63 years old.",
    str3 = "The contract was declared null and void.";


str1.match("number");   // "number" 是字符串。返回["number"]
str1.match(NaN);        // NaN的类型是number。返回["NaN"]
str1.match(Infinity);   // Infinity的类型是number。返回["Infinity"]
str1.match(+Infinity);  // 返回["Infinity"]
str1.match(-Infinity);  // 返回["-Infinity"]
str2.match(65);         // 返回["65"]
str2.match(+65);        // 有正号的number。返回["65"]
str3.match(null);       // 返回["null"]
```



### matchAll()

**定义**

**`matchAll()`** 方法返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器

```javascript
const regexp = /t(e)(st(\d?))/g;
const str = 'test1test2';

const array = [...str.matchAll(regexp)];
console.log(array)

//
[
  ['test1', 'e', 'st1', '1', index: 0, input: 'test1test2', groups: undefined],
  ['test2', 'e', 'st2', '2', index: 5, input: 'test1test2', groups: undefined]
]
```

**参数**

`regexp`  正则表达式对象

* 如果所传参数不是一个正则表达式对象，则会隐式地使用 `new RegExp(obj)` 将其转换为一个 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp) 。

* `RegExp`必须是设置了全局模式`g`的形式，否则会抛出异常`TypeError`。

**返回值**

一个迭代器（不可重用，结果耗尽需要再次调用方法，获取一个新的迭代器）

**实例**

在 `matchAll` 出现之前，通过在循环中调用 `regexp.exec()` 来获取所有匹配项信息（regexp 需使用 `/g` 标志）

```javascript
const regexp = RegExp('foo[a-z]*','g');
const str = 'table football, foosball';
let match;

while ((match = regexp.exec(str)) !== null) {
  console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
  // expected output: "Found football start=6 end=14."
  // expected output: "Found foosball start=16 end=24."
}
```

如果使用 `matchAll` ，就可以不必使用 while 循环加 exec 方式（且正则表达式需使用 `/g` 标志）。使用 `matchAll` 会得到一个迭代器的返回值，配合 `for...of`, [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), 或者 [`Array.from()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from) 可以更方便实现功能：

```javascript
const regexp = RegExp('foo[a-z]*','g');
const str = 'table football, foosball';
const matches = str.matchAll(regexp);

for (const match of matches) {
  console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`);
}
// expected output: "Found football start=6 end=14."
// expected output: "Found foosball start=16 end=24."

// matches iterator is exhausted after the for..of iteration
// Call matchAll again to create a new iterator
Array.from(str.matchAll(regexp), m => m[0]);
// Array [ "football", "foosball" ]
```

如果没有 `/g` 标志，`matchAll` 会抛出异常。

```javascript
const regexp = RegExp('[a-c]','');
const str = 'abc';
Array.from(str.matchAll(regexp), m => m[0]);
// TypeError: String.prototype.matchAll called with a non-global RegExp argument
```

`matchAll` 内部做了一个 regexp 的复制，所以不像 [regexp.exec](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec), `lastIndex` 在字符串扫描时不会改变。????

```javascript
const regexp = RegExp('[a-c]','g');
regexp.lastIndex = 1;
const str = 'abc';
Array.from(str.matchAll(regexp), m => `${regexp.lastIndex} ${m[0]}`);
// Array [ "1 b", "1 c" ]
```

`matchAll` 的另外一个亮点是更好地获取捕获组。因为当使用 `match()` 和 `/g` 标志方式获取匹配信息时，捕获组会被忽略：

```javascript
let array = [...str.matchAll(regexp)];

array[0];
// ['test1', 'e', 'st1', '1', index: 0, input: 'test1test2', length: 4]
array[1];
// ['test2', 'e', 'st2', '2', index: 5, input: 'test1test2', length: 4]
```





### repeat()

**定义**

ECMAScript 6还为字符串增添了一个repeat()方法，其接受一个number类型的参数，表示该字符串的重复次数，返回值是当前字符串重复一定次数后的新字符串

**参数**

```javascript
str.repeat(count)
```

`count`  介于 `0` 和 [`+Infinity`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/POSITIVE_INFINITY) 之间的整数。表示在新构造的字符串中重复了多少遍原字符串

**返回值**

包含指定字符串的指定数量副本的新字符串

**描述**

* [`RangeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Negative_repetition_count): 重复次数不能为负数。
* [`RangeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Resulting_string_too_large): 重复次数必须小于 infinity，且长度不会大于最长的字符串。

**实例**

```javascript
"abc".repeat(-1)     // RangeError: repeat count must be positive and less than inifinity
"abc".repeat(0)      // ""
"abc".repeat(1)      // "abc"
"abc".repeat(2)      // "abcabc"
"abc".repeat(3.5)    // "abcabcabc" 参数count将会被自动转换成整数.
"abc".repeat(1/0)    // RangeError: repeat count must be positive and less than inifinity

({toString : () => "abc", repeat : String.prototype.repeat}).repeat(2)
//"abcabc",repeat是一个通用方法,也就是它的调用者可以不是一个字符串对象.
```

使用场景.例如其在操作文本时非常有用，比如在代码格式化工具中创建缩进级别，

```javascript
//缩进指定数量的空格
let indent = ' '.repeat(4),
    indentLevel = 0;

//当需要增加缩进时
let newIndent = indent.repeat(++indentLevel);
```



### replace()

**定义**

**`replace()`** 方法返回一个由替换值（`replacement`）替换部分或所有的模式（`pattern`）匹配项后的新字符串。模式可以是一个字符串或者一个[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)，替换值可以是一个字符串或者一个每次匹配都要调用的回调函数。<span style="color:blue">如果`pattern`是字符串，则仅替换第一个匹配项。</span>原字符串不会改变

**参数**

```javascript
replace(regexp, newSubstr)
replace(regexp, replacerFunction)

replace(substr, newSubstr)
replace(substr, replacerFunction)
```

`regexp(pattern)` 

* 一个[`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp) 对象或者其字面量。该正则所匹配的内容会被第二个参数的返回值替换掉

`substr(pattern)`

* 一个将被 `newSubStr` 替换的 [`字符串`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)。其被视为一整个字符串，而不是一个正则表达式。仅第一个匹配项会被替换。

`newSubStr(replacement)`

* 用于替换掉第一个参数在原字符串中的匹配部分的[`字符串`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)。该字符串中可以内插一些特殊的变量名。参考下面的[使用字符串作为参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace#使用字符串作为参数)。

`function(replacement)`

* 一个用来创建新子字符串的函数，该函数的返回值将替换掉==第一个参数==匹配到的结果。参考下面的[指定一个函数作为参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace#指定一个函数作为参数)。

**描述**
* 该方法并不改变调用它的字符串本身，而只是返回一个新的替换后的字符串。
* <span style="color:blue">在进行全局的搜索替换时，正则表达式需包含 `g` 标志</span>

**使用字符串作为参数**
替换纸字符串可以包含以下指定的替代模式:

| 变量名    | 代表的值                                                     |
| --------- | ------------------------------------------------------------ |
| \$\$        | 插入一个'$'                                                  |
| \$\&        | inserts the matched substring  (与 regexp 相匹配的子串)      |
| \$\`        | 插入当前匹配的字串左边的内容                                 |
| \$\'        | 插入当前匹配的子串右边的内容                                 |
| \$\n        | 假如第一个参数是 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)对象，并且 n 是个小于100的非负整数，那么插入第 n 个括号匹配的字符串。提示：索引是从1开始。如果不存在第 n个分组，那么将会把匹配到到内容替换为'$n'的字面量。比如不存在第3个分组，就会用“$3”替换匹配到的内容 |
| \$\<Name\> | 这里*`Name`* 是一个分组名称。如果在正则表达式中并不存在分组（或者没有匹配），这个变量将被处理为空字符串。只有在支持命名分组捕获的浏览器中才能使用 |

```javascript
let str = 'hello world';

str.replace('o', '$$'); //'hell$ world'
str.replace('o', '$&'); //'hello world' ????
str.replace('o', '$`'); //'hellhell world'
str.replace('o', "$'"); //'hell world world'
```

**指定一个函数作为参数**

你可以指定一个函数作为第二个参数。在这种情况下，当匹配执行后，该函数就会执行。 函数的返回值作为替换字符串。 (注意：上面提到的特殊替换参数在这里不能被使用。) 另外要注意的是，<u>如果第一个参数是正则表达式，并且其为全局匹配模式，那么这个方法将被多次调用，每次匹配都会被调用</u>

函数参数:

| 变量名               | 代表的值                                                                                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `match`           | 匹配的子串。（对应于上述的$&。）                                                                                                                                                                                                          |
| `p1,p2, ...`      | 假如replace()方法的第一个参数是一个[`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp) 对象，则代表第n个括号匹配的字符串。（对应于上述的$1，$2等。）例如，如果是用 `/(\a+)(\b+)/` 这个来匹配，`p1` 就是匹配的 `\a+`，`p2` 就是匹配的 `\b+`。 |
| `offset`          | 匹配到的子字符串在原字符串中的偏移量。（比如，如果原字符串是 `'abcd'`，匹配到的子字符串是 `'bc'`，那么这个参数将会是 1）                                                                                                                                                      |
| `string`          | 被匹配的原字符串。                                                                                                                                                                                                                  |
| NamedCaptureGroup | 命名捕获组匹配的对象                                                                                                                                                                                                                 |

精确的参数个数依赖于 `replace()` 的第一个参数是否是一个正则表达式（[`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)）对象，以及这个正则表达式中指定了多少个括号子串，如果这个正则表达式里使用了命名捕获， 还会添加一个命名捕获的对象)

该函数 `func(match, p1, p2, ..., pn, offset, input, groups)` 带参数调用：

1. `match` － 匹配项，
2. `p1, p2, ..., pn` － 分组的内容（如有），
3. `offset` － 匹配项的位置，
4. `input` － 源字符串，
5. `groups` － 所指定分组的对象。

如果正则表达式中没有括号，则只有 3 个参数：`func(str, offset, input)`

按其在字符串中的位置来替换每个匹配项

```javascript
'Ho-Ho-ho'.replace(/ho/gi, (match, offset) => offset)  //'0-3-6'
```

在下面的示例中，有两对括号，因此将使用 5 个参数调用替换函数：第一个是完全匹配项，然后是 2 对括号，然后是匹配位置（在示例中未使用）和源字符串：

```javascript
let str = "John Smith";

let result = str.replace(/(\w+) (\w+)/, (match, name, surname) => `${surname}, ${name}`);

alert(result); // Smith, John
```

如果有许多组，用 rest 参数（…）可以很方便的访问：

```javascript
let str = "John Smith";

let result = str.replace(/(\w+) (\w+)/, (...match) => `${match[2]}, ${match[1]}`);

alert(result); // Smith, John
```

或者，如果我们使用的是命名组，则带有它们的 `groups` 对象始终是最后一个对象，因此我们可以这样获得它：

```javascript
let str = "John Smith";

let result = str.replace(/(?<name>\w+) (?<surname>\w+)/, (...match) => {
  let groups = match.pop();

  return `${groups.surname}, ${groups.name}`;
});

alert(result); // Smith, John
```

使用函数可以为我们提供终极替代功能，因为它可以获取匹配项的所有信息，可以访问外部变量，可以做任何事。



**实例**  ????

[交换字符串中的两个单词](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace#交换字符串中的两个单词)

```javascript
var re = /(\w+)\s(\w+)/;
var str = "John Smith";
var newstr = str.replace(re, "$2, $1");
// Smith, John
console.log(newstr);
```



千分位处理

> https://godbasin.github.io/vue-ebook/vue-ebook/3.html#_3-2-2-%E8%BF%87%E6%BB%A4%E5%99%A8

```javascript
// 全局定义
// 千分位处理
Vue.filter('thousandth', function (value) {
  if (!value) return '';
  return value && value.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
    return pre + groupOf3Digital.replace(/\d{3}/g, ',$&')
  });
})
```



字符串中8-10位, 前8位变为型星号,11位+, 前11位位星号

```js
let str = '123456789012a1234567890c123456789D1234567890123456789012'
let reg = /\d{8,}/g
 //let reg1 = /[^\d]+(\d{8})(\d{1})[^\d]+/g
//let reg2 = /(\d{11})(\d{1})/g
 
str.replace(reg, (match, offset, input) => {
  if (match.length <= 10) {

    return [].slice.call(match).map((item, idx, arr) => idx <= 7 ? "*" : item).join('')

  } else {
    return [].slice.call(match).map((item, idx, arr) => idx <= 10 ? "*" : item).join('')
  }
 })
```


下划线转驼峰
```js
const toHump = str => str.replace(/\_(\w+)/g, (all, letter) => letter.toUpperCase())
```

驼峰转下划线
```js
const toLine = str => str.replace(/([A-Z])/g, '_$1').toLowerCase()
```






### replaceAll()

##### define

the method returns a new string with all matches of a `pattern` replaced by a `replacement`. the `pattern` can be a string or a `RegExp`, and the `replacement` can be a string or a function to be called for each match.

The original string is left unchanged.

global flag required when calling replaceAll  with regexp



##### Syntax

```javascript
replaceAll(pattern, replacement)
```



##### Parameters

`pattern`

can be a string or an object with a  [`Symbol.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/replace) method --- the typical example being a  [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp). Any value that doesn't have the `Symbol.replace` method will be coerced to a string.

 If `pattern` is a `RegExp` object (via the [`IsRegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/match#disabling_the_isregexp_check) check), then is must have the global(g) flag set, or a [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) is thrown.















### search()

**定义**

**`search()`** 方法执行正则表达式和 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 对象之间的一个搜索匹配

**参数**

```javascript
str.search(regexp)
```

`regexp`  一个[`正则表达式（regular expression）`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)对象

* 如果传入一个非正则表达式对象 `regexp`，则会使用 `new RegExp(regexp)` 隐式地将其转换为正则表达式对象。

**返回值**

如果匹配成功，则 `search()` 返回正则表达式在字符串中首次匹配项的<u>索引</u>;否则，返回 `-1`

**描述**

* 当你想要知道字符串中是否存在某个模式（pattern）时可使用 `search()`，类似于正则表达式的 [`test()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) 方法。
* 当要了解更多匹配信息时，可使用 [`match()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match)（但会更慢一些），该方法类似于正则表达式的 [`exec()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec) 方法。

**实例**

```javascript
let str = 'hello world';

str.search('o'); //4
str.search(/o/); //4
```











### slice()

**定义**

**`slice()`** 方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串

**参数**

```javascript
str.slice(beginIndex[, endIndex])
```

`beginIndex` 从该索引（以 0 为基数）处开始提取原字符串中的字符

* 如果值为负数，会被当做 `strLength + beginIndex` 看待，这里的`strLength` 是字符串的长度

`endIndex`  **可选**

* 在该索引（以 0 为基数）处结束提取字符串。
* 如果省略该参数，`slice()` 会一直提取到字符串末尾。
* 如果该参数为负数，则被看作是 strLength + endIndex
* 新字符串包括`beginIndex`但不包括 `endIndex`

**返回值**

返回一个从原字符串中提取出来的新字符串

**描述**

* `slice` 不会修改原字符串（只会返回一个包含了原字符串中部分字符的新字符串

**实例**

slice()传入负值索引

```javascript
var str = 'The morning is upon us.';
str.slice(-3);     // 返回 'us.'
str.slice(-3, -1); // 返回 'us'
str.slice(0, -1);  // 返回 'The morning is upon us'
```

复制字符串

```HTML
- 复制字符串
str.slice();
str.slice(0);
```



### split()????

**定义**

`**split()** `方法使用指定的分隔符字符串将一个[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)对象分割成子字符串数组，以一个指定的分割字串来决定每个拆分的位置。 

**描述**

如果使用<u>空字符串(“)作为分隔符</u>，则字符串不是在每个用户感知的字符(图形素集群)之间，也不是在每个Unicode字符(代码点)之间，而是在每个UTF-16代码单元之间。这会摧毁代理对。还请参见[how do you get a string to a character array in javascript](https://stackoverflow.com/questions/4547609/how-do-you-get-a-string-to-a-character-array-in-javascript/34717402#34717402)

**参数**

```javascript
str.split([separator[, limit]])
```

`separator`  **可选**  描述拆分应发生位置的模式,可以是简单的字符或者正则表达式

* 最简单的情况是分隔符是<u>单个字符</u>,被用来分割限定的字符串.例如,包含制表符分隔值 （TSV） 的字符串可以通过将制表符作为分隔符传递来解析
* 如果分隔符<u>包含多个字符</u>,则必须找到整个字符序列才能拆分
* 如果分隔符<u>被省略或者字符串中没有</u>,则返回数组包含一个由整个字符串构成的元素
* 如果分隔符出现在字符串的<u>开始(或结尾)</u>,则返回的数组的相应位置是空字符串
* 如果分隔符是一个<u>空字符串</u>, 字符串将转换为其每个 UTF-16"字符"的数组

> 如果使用空字符串(“)作为分隔符，则字符串不是在每个用户感知的字符(图形素集群)之间，也不是在每个Unicode字符(代码点)之间，而是在每个UTF-16代码单元之间。这会摧毁代理对

`limit`  **可选** 一个非负整数，指定对要包含在数组中的子字符串数的限制。

* 如果提供,在分隔符出现的位置分割字符串,但在限制条目已放入数组时停止.
* 如果在达到指定限制之前先到达字符串的末尾，它可能包含少于限制的条目。
* 新数组中不返回剩下的文本
* 如果限制是0, 则返回一个空数组



**返回值**

返回源字符串以分隔符出现位置分隔而成的一个 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 

**描述**

* 找到分隔符后，将其从字符串中删除，并将子字符串作为数组返回.
* 如果分隔符是包含捕获括号的正则表达式，则每次分隔符匹配时，捕获括号的结果（包括任何未定义的结果）将被拼接到输出数组中。但是，并不是所有浏览器都支持此功能。
* 如果分隔符是一个数组,那么这个数组会被强制转换成字符串且用作分隔符

**实例**

实例1

```javascript
let str = 'hello world';

console.log(str.split(' ')); ['hello', 'world']
console.log(str.split()); ['hello world']
console.log(str.split('h')); //['', 'ello world', '']

let str = 'hello world';
console.log(str.split('o', 0)); //[]
console.log(str.split('o', 2)); //['hell', 'w']
console.log(str.split('o', 5)); //['hell', 'w', 'rld']

```

没有分隔符+空字符串

```javascript
let str = '';
console.log(str.split()); //['']
```

移除字符串中的空格

```javascript
const names = 'Harry Trump ;Fred Barney; Helen Rigby ; Bill Abel ;Chris Hand '

const re = /\s*(?:;|$)\s*/
const nameList = names.split(re)

console.log(nameList); //
```

[靠正则来分割使结果中包含分隔块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split#example_capturing_parentheses)

如果 `separator` 包含捕获括号（capturing parentheses），则其匹配结果将会包含在返回的数组中

```javascript
var myString = "Hello 1 word. Sentence number 2.";
var splits = myString.split(/(\d)/);

console.log(splits);

//[ "Hello ", "1", " word. Sentence number ", "2", "." ]
```

[使用一个数组来作为分隔符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split#使用一个数组来作为分隔符)

```javascript
```



分隔符为最后一位时, 使用split转换为数组,其最后一位为空
分隔符含有第一位时,也是同样效果
```js
// split使用字符串来作为分隔符是同样的效果

'a '.split(/\s/) //['a', '']
'a,'.split(/,/) //['a', '']

'#/'.split('#') // ['', '/']
```

分隔符是空字符串,字符串将转换为每个UTF-16单元的数组
```js
'😂'.split('') //['\uD83D', '\uDE02']
```

### startsWith()

**定义**

`startsWith()` 方法用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 `true` 或 `false`

**参数**

```javascript
str.startsWith(searchString[, position])
```

`searchString` 要搜索的字符串

`position` **可选** 

* 在 `str` 中搜索 `searchString` 的开始位置，默认值为 0

**返回值**

如果在字符串的开头找到了给定的字符则返回**`true`**；否则返回**`false`**

**描述**

这个方法能够让你确定一个字符串是否以另一个字符串开头。这个方法区分大小写

**实例**

```javascript
var str = "To be, or not to be, that is the question.";

alert(str.startsWith("To be"));         // true
alert(str.startsWith("not to be"));     // false
alert(str.startsWith("not to be", 10)); // true
```

### endsWith()

**定义**

`endsWith()`方法用来判断当前字符串是否是以另外一个给定的子字符串“结尾”的，根据判断结果返回 `true` 或 `false`。

**参数**

```javascript
str.endsWith(searchString[, length])
```

`searchString`  要搜索的字符串

`length` **可选** 

* 作为 `str` 的长度。默认值为 `str.length`

**返回值**

如果传入的子字符串在搜索字符串的末尾则返回**`true`**；否则将返回 **`false`**

**描述**

* 大小写敏感

**实例**

```javascript
var str = "To be, or not to be, that is the question.";

alert( str.endsWith("question.") );  // true
alert( str.endsWith("to be") );      // false
alert( str.endsWith("to be", 19) );  // true
alert(str.endsWith('to be', 18)); //false
```



### substring()

>[String.prototype.substring() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring)

**定义**

返回一个字符串在开始索引到结束索引之间的一个子集,或从开始索引直到字符串末尾的一个子集.

**参数**

```javascript
str.substring(indexStart[, indexEnd])
```

`indexStart` 

* 需要截取的第一个字符的索引，该索引位置的字符作为返回的字符串的首字母

`indexEnd` **可选**

* 一个 0 到字符串长度之间的整数，以该数字为索引的字符<span style="text-decoration: underline wavy blue">不包含在截取的字符串内</span>

**描述**

* 提取从`indexStart`到`indexEnd`(不包括)之间的字符.
* 如果省略`indexEnd`, 则提取到字符串末尾
* 如果任一参数小于0或者为NaN, 则被当做0
* 如果任一参数大于字符串长度, 则被当做字符串的长度
* 如果`indexStart`大于`indexEnd`, 则提取结果就像是两个参数调换了一样

**实例**

```javascript
let str = 'mozilla';

//输出'moz'
console.log(str.substring(0,3));
console.log(str.substring(3,0));
console.log(str.substring(3,-3));
console.log(str.substring(3,NaN));
console.log(str.substring(-2, 3));
console.log(str.substring(NaN, 3));

//输出'lla'
console.log(str.substring(4));
console.log(str.substring(4, str.length))
console.log(str.substring(4, 7));
console.log(str.substring(7, 4));

//输出''
console.log(str.substring(4,4)); //''

//输出'mozilla'
console.log(str.substring(0));
console.log(str.substring(0, 7));
```




**语法**
```js
substring()
```



**实例**
使用substring搭配循环定时器出现文本打字机效果
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .container {
        width: 900px;
        height: 400px;
        margin: 0 auto;
        background-color: #000;
        font-size: 24px;
        color: #000;
      }
      .wrap {
        word-break: break-word;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <span class="wrap"></span>
    </div>
    <script>
      let words = "Don't promise when you're happy, Don't reply when you're angry, and don't decide when you're sad.".split(" ");
      const wrapNode = document.querySelector(".wrap");
      let i = 0,
        j = 0;

      let timeId = window.setInterval(() => {
        if (i === words.length - 1 && j === words[i].length - 1) {
          clearInterval(timeId);
        }

        let preWord = i > 0 ? words.slice(0, i).join(" ") + " " : "";
        let result =
          preWord +
          (i === words.length - 1
            ? words[i].substring(0, j + 1)
            : words[i].substring(0, j));
        wrapNode.innerText = result;
      }, 100);
    </script>
  </body>
</html>

```




### String.prototype.toString()

**定义**

`**toString()**` 方法返回指定对象的字符串形式

**参数**

```javascript
str.toString()
```

**返回值**

一个表示调用对象的字符串

**描述**

* `String` 对象覆盖了[`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 对象的 `toString` 方法；并没有继承 [`Object.toString()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)。
* 对于 `String` 对象，`toString` 方法返回该对象的字符串形式，和 [`String.prototype.valueOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/valueOf) 方法返回值一样。

**实例**

输出一个字符串对象（String object）的字符串值

```javascript
var x = new String("Hello world");

console.log(x); //  String {'Hello world'}
alert(x.toString())      // 输出 "Hello world"
```



### trim()

**定义**

**`trim()`** 方法会从一个字符串的两端删除空白字符。在这个上下文中的空白字符是所有的空白字符 (space, tab, no-break space 等) 以及所有行终止符字符（如 LF，CR等）

**描述**

* `trim()` 方法返回一个从两头去掉空白字符的字符串，并不影响原字符串本身

**Polyfill**

如果 `trim()` 不存在，可以在所有代码前执行下面代码

```javascript
if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\sFEFF\xA0]+$/g, '');
  }
}
```

### trimEnd()/trimRight()

### trimStart()/trimLeft()

### valueOf()

**定义**

**`valueOf()`** 方法返回 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 对象的原始值

**描述**

* 此方法通常由JavaScript在内部调用，而不是在代码中显式调用

**实例**

```javascript
var x = new String('Hello world');
console.log(x.valueOf()); // Displays 'Hello world'
```



#### String.prototype.localeCompare

##### Define

> the method returns a number indicating whether a reference string comes before, or after, or is the same as the given string in sort order.

##### Syntax

> referenceStr.localeCompare(compareString[, lcoales[, options]])

##### Parameters

`compareString`

* the string against which the `referenceStr` is compared.

`locales and options`

* these arguments customize the behavior of the function and let application specify the language whose formatting conventions should be used. In implementations which ignore the locales and options arguments, the locale used and the form of the string returned are entirely implementation-dependent.



##### Return value

* A negative number if the referenceStr occurs before compareString;
* positive if the referenceStr occurs after compareString
* 0 if they are equivalent.





**实例**

比较两个输入框的时间

```js
startTime.localCompare(endTime) 
```



### 模板字面量中使用原始值

模板标签同样可以访问原生字符串信息，也就是说通过模板标签可以访问到字符转义被转换成等价字符前的原生字符串。最简单的例子是使用内建的**String.raw()**标签：

```javascript
let msg1 = `Multiline\nstring`,
    msg2 = String.raw`Multiline\nstring`;

console.log(msg1); //'Multiline
									 //string'

console.log(msg2); //Multiline\\nstring
```

在这段代码中，变量message1中的\n被解释为一个新行，而变量message2获取的是\n的原生形式"\\\n"（反斜杠与n字符），必要的时候可以像这样来检索原生的字符串信息。

原生字符串信息同样被传入模板标签，标签函数的第一个参数是一个数组，它有一个额外的属性raw，是一个包含每一个字面值的原生等价信息的数组。举个例子，literals[0]总有一个等价的literals.raw[0]，包含着它的原生字符串信息。了解之后，可以使用以下代码模仿String.raw()

```javascript
function raw(literals, ...substitutions) {
  let result = '';
  //根据substitutions的数量来确定循环的执行次数
  for (let i=0; i<substitutions.length; i++) {
    //使用原生值
    result += literals.raw[i];
    result += substitutions[i];
  }
  
  //合并最后一个literals
  result += literals.raw[literals.length - 1];
  return result;
}

let msg = raw`Multiline\nstring`;

console.log(msg); //'Multiline\\nstring'
console.log(msg.length); //27
```




### String.prototype.localeCompare

#### Define

> the method returns a number indicating whether a reference string comes before, or after, or is the same as the given string in sort order.

#### Syntax
```js
referenceStr.localeCompare(compareString[, lcoales[, options]])
```


#### Parameters

`compareString`

* the string against which the `referenceStr` is compared.

`locales and options`

* these arguments customize the behavior of the function and let application specify the language whose formatting conventions should be used. In implementations which ignore the locales and options arguments, the locale used and the form of the string returned are entirely implementation-dependent.



#### Return value

* A negative if the referenceStr occurs before compareString;
* A positive if the referenceStr occurs after compareString
* 0 if they are equivalent.


注意,这里的返回值和[[202302272171|Array.prototype.sort()]]比较器函数的返回值很类似.


#### **实例**

比较两个输入框的时间

```js
startTime.localCompare(endTime) 
```



### 模板字面量中使用原始值

模板标签同样可以访问原生字符串信息，也就是说通过模板标签可以访问到字符转义被转换成等价字符前的原生字符串。最简单的例子是使用内建的**String.raw()**标签：

```javascript
let msg1 = `Multiline\nstring`,
    msg2 = String.raw`Multiline\nstring`;

console.log(msg1); //'Multiline
									 //string'

console.log(msg2); //Multiline\\nstring
```

在这段代码中，变量message1中的\n被解释为一个新行，而变量message2获取的是\n的原生形式"\\\n"（反斜杠与n字符），必要的时候可以像这样来检索原生的字符串信息。

原生字符串信息同样被传入模板标签，标签函数的第一个参数是一个数组，它有一个额外的属性raw，是一个包含每一个字面值的原生等价信息的数组。举个例子，literals[0]总有一个等价的literals.raw[0]，包含着它的原生字符串信息。了解之后，可以使用以下代码模仿String.raw()

```javascript
function raw(literals, ...substitutions) {
  let result = '';
  //根据substitutions的数量来确定循环的执行次数
  for (let i=0; i<substitutions.length; i++) {
    //使用原生值
    result += literals.raw[i];
    result += substitutions[i];
  }
  
  //合并最后一个literals
  result += literals.raw[literals.length - 1];
  return result;
}

let msg = raw`Multiline\nstring`;

console.log(msg); //'Multiline\\nstring'
console.log(msg.length); //27
```





## 字符串使用案例

### 从字符串中<u>通过位置</u>获取单个字符

要获取在 具体 位置的一个字符，可以使用方括号 `[position]` 或者调用 [str.charAt(pos)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/String/charAt) 方法

```javascript
let str = `Hello`;

// 第一个字符
alert( str[0] ); // H
alert( str.charAt(0) ); // H

// 最后一个字符
alert( str[str.length - 1] ); // o
```

方括号是获取字符的一种现代化方法，而 `charAt` 是历史原因才存在的。

它们之间的唯一区别是，如果没有找到字符，`[]` 返回 `undefined`，而 `charAt` 返回一个空字符串

```javascript
let str = `Hello`;

alert( str[1000] ); // undefined
alert( str.charAt(1000) ); // ''（空字符串）
```



### 字符串比较

在 JavaScript 中，你只需要使用[比较操作符(>/</>=/<=)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)

```javascript
let a = 'a',
    b = 'b';

if (a < b) {
  //
} else {
  //
}
```

使用从字符串实例继承而来的 [`localeCompare`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) 方法也能达到同样的效果



### 字符串逆序输出

字符串的逆序输出就是将一个字符串以相反的顺序进行输出。

真实场景如下所示。

给定一个字符串'abcdefg'，执行一定的算法后，输出的结果为'gfedcba'。

针对这个场景，以下总结出了5种不同的处理函数。

>  算法1

借助数组的reverse()函数。

首先将字符串转换为字符数组，然后通过调用数组原生的reverse()函数进行逆序，得到逆序数组后再通过调用join()函数得到逆序字符串。

```js
function reverseString(str) {
  return str.split('').reverse().join('')
}
```

> 算法2

利用字符串本身的charAt()函数。

从尾部开始遍历字符串，然后利用charAt()函数获取字符并逐个拼接，得到最终的结果。charAt()函数接收一个索引数字，返回该索引位置对应的字符。

```js
function reverseString(str) {
  let result = ''
  for (let i=str.length-1; i>=0; i--) {
    result += str.charAt(i)
  }
  return result
}
```

> 算法3

是通过递归实现逆序输出，与算法2的处理类似。

递归从字符串最后一个位置索引开始，通过charAt()函数获取一个字符，并拼接到结果字符串中，递归结束的条件是位置索引小于0。

```js
function reverseString3(strln, pos, strOut) {
  if (pos < 0) {
    return strOut
  }
  strOut += strln.charAt(pos--)
  return reverseString3(strln, pos, strOut)
}
```

> 算法4

通过call()函数来改变slice()函数的执行主体

调用call()函数后，可以让字符串具有数组的特性，在调用未传入参数的slice()函数后，得到的是一个与自身相等的数组，从而可以直接调用reverse()函数，最后再通过调用join()函数，得到逆序字符串。

```js
function reverseString4(str) {
  let arr = [].slice.call(str)
  return arr.reverse().join('')
}
```

> 算法5

是借助栈的先进后出原则。

由于JavaScript并未提供栈的实现，我们首先需要实现一个栈的数据结构，然后在栈中添加插入和弹出的函数，利用插入和弹出方法的函数字符串逆序。

首先，我们来看下基本数据结构——栈的实现。通过一个数组进行数据存储，通过一个top变量记录栈顶的位置，随着数据的插入和弹出，栈顶位置动态变化。

栈的操作包括两种，分别是出栈和入栈。出栈时，返回栈顶元素，即数组中索引值最大的元素，然后top变量减1；入栈时，往栈顶追加元素，然后top变量加1。

```js
// 栈
function Stack() {
   this.data = []; // 保存栈内元素
   this.top = 0;   // 记录栈顶位置
}
// 原型链增加出栈、入栈方法
Stack.prototype = {
   // 入栈:先在栈顶添加元素，然后元素个数加1
   push: function push(element) {
       this.data[this.top++] = element;
   },
   // 出栈：先返回栈顶元素，然后元素个数减1
   pop: function pop() {
       return this.data[--this.top];
   },
   // 返回栈内的元素个数，即长度
   length: function () {
       return this.top;
   }
};
```

然后通过自定义实现的栈来实现字符串的逆序输出。

```js
// 算法5：自定义栈实现
function reverseString5(str) {
   //创建一个栈的实例
   var s = new Stack();
   //将字符串转成数组
   var arr = str.split('');
   var len = arr.length;
   var result = '';
   //将元素压入栈内
   for(var i = 0; i < len; i++){
      s.push(arr[i]);
   }
   //输出栈内元素
   for(var j = 0; j < len; j++){
      result += s.pop(j);
   }
   return result;
}
```



### 统计字符串中出现次数最多的字符及出现的次数

真实场景如下所示。假如存在一个字符串'helloJavascripthellohtmlhellocss'，其中出现次数最多的字符是l，出现的次数是7次。

针对这个场景，以下总结出了5种不同的处理算法。

> 算法1

算法1的主要思想是通过key-value形式的对象来存储字符串以及字符串出现的次数，然后逐个判断出现次数最大值，同时获取对应的字符，具体实现如下。

首先通过key-value形式的对象来存储数据，key表示不重复出现的字符，value表示该字符出现的次数。

然后遍历字符串的每个字符，判断是否出现在key中。如果在，直接将对应的value值加1；如果不在，则直接新增一组key-value，value值为1。·

得到key-value对象后，遍历该对象，逐个比较value值的大小，找出其中最大的值并记录key-value，即获得最终想要的结果。

```js
// 算法1
function getMaxCount(str) {
   var json = {};
   // 遍历str的每一个字符得到key-value形式的对象
   for (var i = 0; i < str.length; i++) {
       // 判断json中是否有当前str的值
       if (!json[str.charAt(i)]) {
           // 如果不存在，就将当前值添加到json中去
           json[str.charAt(i)] = 1;
       } else {
           // 如果存在，则让value值加1
           json[str.charAt(i)]++;
       }
   }
   // 存储出现次数最多的值和出现次数
   var maxCountChar = '';
   var maxCount = 0;
   // 遍历json对象，找出出现次数最大的值
  for (var key in json) {
      // 如果当前项大于下一项
      if (json[key] > maxCount) {
          // 就让当前值更改为出现最多次数的值
          maxCount = json[key];
          maxCountChar = key;
      }
   }
   //最终返回出现最多的值以及出现次数
   return '出现最多的值是' + maxCountChar + '，出现次数为' + maxCount;
}
var str = 'helloJavaScripthellohtmlhellocss';
getMaxCount(str); // '出现最多的值是l，出现次数为7'
```





> 算法2

算法2同样会借助于key-value形式的对象来存储字符与字符出现的次数，但是在运算上有所差别。

首先通过key-value形式的对象来存储数据，key表示不重复出现的字符，value表示该字符出现的次数。·

然后将字符串处理成数组，通过forEach()函数遍历每个字符。在处理之前需要先判断当前处理的字符是否已经在key-value对象中，如果已经存在则表示已经处理过相同的字符，则无须处理；如果不存在，则会处理该字符item。·

通过split()函数传入待处理字符，可以得到一个数组，该数组长度减1即为该字符出现的次数。

获取字符出现的次数后，立即与表示出现最大次数和最大次数对应的字符变量maxCount和maxCountChar相比，如果比maxCount大，则将值写入key-value对象中，并动态更新maxCount和maxCountChar的值，直到最后一个字符处理完成。

最后得到的结果即maxCount和maxCountChar两个值。

```js
// 算法2
function getMaxCount2(str) {
   var json = {};
   var maxCount = 0, maxCountChar = '';
   str.split('').forEach(function (item) {
       // 判断json对象中是否有对应的key
       if (!json.hasOwnProperty(item)) {
           // 当前字符出现的次数
           var number = str.split(item).length - 1;
           // 直接与出现次数最大值比较，并进行更新
           if(number > maxCount) {
               // 写入json对象
               json[item] = number;
               // 更新maxCount与maxCountChar的值
               maxCount = number;
               maxCountChar = item;
           }
       }
   });

   return '出现最多的值是' + maxCountChar + '，出现次数为' + maxCount;
}

var str = 'helloJavaScripthellohtmlhellocss';
getMaxCount2(str); // '出现最多的值是l，出现次数为7'
```



> 算法3

对字符串进行排序，然后通过lastIndexOf()函数获取索引值后，判断索引值的大小以获取出现的最大次数。

首先将字符串处理成数组，调用sort()函数进行排序，处理成字符串。

然后遍历每个字符，通过调用lastIndexOf()函数，确定每个字符出现的最后位置，然后减去当前遍历的索引，就可以确定该字符出现的次数。

确定字符出现的次数后，直接与次数最大值变量maxCount进行比较，如果比maxCount大，则直接更新maxCount的值，并同步更新maxCountChar的值；如果比maxCount小，则不做任何处理。

计算完成后，将索引值设置为字符串出现的最后位置，进行下一轮计算，直到处理完所有字符。

```js
// 算法3
function getMaxCount3(str) {
   // 定义两个变量，分别表示出现最大次数和对应的字符
   var maxCount = 0, maxCountChar = '';
   // 先处理成数组，调用sort()函数排序,再处理成字符串
   str = str.split('').sort().join('');
   for (var i = 0, j = str.length; i < j; i++) {
       var char = str[i];
       // 计算每个字符串出现的次数
       var charCount = str.lastIndexOf(char) - i + 1;
       // 与次数最大值作比较
       if (charCount > maxCount) {
           // 更新maxCount和maxCountChar的值
           maxCount = charCount;
           maxCountChar = char;
       }
       // 变更索引为字符出现的最后位置
       i = str.lastIndexOf(char);
   }
   return '出现最多的值是' + maxCountChar + '，出现次数为' + maxCount;
}

var str = 'helloJavaScripthellohtmlhellocss';
getMaxCount3(str);  // '出现最多的值是l，出现次数为7'
```



> 算法4

将字符串进行排序，然后通过正则表达式将字符串进行匹配拆分，将相同字符组合在一起，最后判断字符出现的次数。

首先将字符串处理成数组，调用sort()函数进行排序，处理成字符串。

然后设置正则表达式reg，对字符串使用match()函数进行匹配，得到一个数组，数组中的每个成员是相同的字符构成的字符串。

遍历数组，依次将成员字符串长度值与maxCount值进行比较，动态更新maxCount与maxCountChar的值，直到数组所有元素处理完成。

```js
// 算法4
function getMaxCount4(str) {
   // 定义两个变量，分别表示出现最大次数和对应的字符
   var maxCount = 0, maxCountChar = '';
   // 先处理成数组，调用sort()函数排序,再处理成字符串
   str = str.split('').sort().join('');
   // 通过正则表达式将字符串处理成数组(数组每个元素为相同字符构成的字符串)
   var arr = str.match(/(\w)\1+/g);
   for (var i = 0; i < arr.length; i++) {
       // length表示字符串出现的次数
       var length = arr[i].length;
       // 与次数最大值作比较
       if (length > maxCount) {
           // 更新maxCount和maxCountChar
           maxCount = length;
           maxCountChar = arr[i][0];
       }
   }
   return '出现最多的值是' + maxCountChar + '，出现次数为' + maxCount;
}

var str = 'helloJavaScripthellohtmlhellocss';
getMaxCount4(str);  // '出现最多的值是l，出现次数为7'
```

在本算法中，使用到了正则表达式/(\w)\1+/g，其中\1表示的是(\w)匹配的内容，而\w表示的是匹配字符、数字、下画线，(\w)\1+正则的目的是匹配重复出现的字符。



> 算法5

是借助replace()函数，主要实现方式如下。

通过while循环处理，跳出while循环的条件是字符串长度为0。

在while循环中，记录原始字符串的长度originCount，用于后面做长度计算处理。

获取字符串第一个字符char，通过replace()函数将char替换为空字符串''，得到一个新的字符串，它的长度remainCount相比于originCount会小，其中的差值originCount - remainCount即为该字符出现的次数。

确定字符出现的次数后，直接与maxCount进行比较，如果比maxCount大，则直接更新maxCount的值，并同步更新maxCountChar的值；如果比maxCount小，则不做任何处理。

处理至跳出while循环，得到最终结果

```js
// 算法5
function getMaxCount5(str) {
   // 定义两个变量，分别表示出现最大次数和对应的字符
   var maxCount = 0, maxCountChar = '';
   while (str) {
       // 记录原始字符串的长度
       var originCount = str.length;
       // 当前处理的字符
       var char = str[0];
       var reg = new RegExp(char, 'g');
       // 使用replace()函数替换处理的字符为空字符串
       str = str.replace(reg, '');
       var remainCount = str.length;
       // 当前字符出现的次数
       var charCount = originCount - remainCount;
       // 与次数最大值作比较
       if (charCount > maxCount) {
          // 更新maxCount和maxCountChar的值
          maxCount = charCount;
          maxCountChar = char;
       }
   }
   return '出现最多的值是' + maxCountChar + '，出现次数为' + maxCount;
}

var str = 'helloJavaScripthellohtmlhellocss';
getMaxCount5(str);  // '出现最多的值是l，出现次数为7'
```



### 去除字符串中重复字符

针对这个场景，以下总结出了3种不同的处理算法。

> 算法1

算法1的主要思想是使用key-value类型的对象存储，key表示唯一的字符，处理完后将所有的key拼接在一起即可得到去重后的结果。

首先通过key-value形式的对象来存储数据，key表示不重复出现的字符，value为boolean类型的值，为true则表示字符出现过。

然后遍历字符串，判断当前处理的字符是否在对象中，如果在，则不处理；如果不在，则将该字符添加到结果数组中。

处理完字符串后，得到一个数组，转换为字符串后即可获得最终需要的结果。

```js
// 算法1
function removeDuplicateChar1(str) {
   // 结果数组
   var result = [];
   // key-value形式的对象
   var json = {};
   for (var i = 0; i < str.length; i++) {
       // 当前处理的字符
       var char = str[i];
       // 判断是否在对象中
       if(!json[char]) {
           // value值设置为false
           json[char] = true;
           // 添加至结果数组中
           result.push(char);
       }
   }
   return result.join('');
}

var str = 'helloJavaScripthellohtmlhellocss';
removeDuplicateChar1(str);  // 'heloJavscriptm'
```



> 算法2

借助数组的filter()函数，然后在filter()函数中使用indexOf()函数判断

通过call()函数改变filter()函数的执行体，让字符串可以直接执行filter()函数。

在自定义的filter()函数回调中，通过indexOf()函数判断其第一次出现的索引位置，如果与filter()函数中的index一样，则表示第一次出现，符合条件则return出去。这就表示只有第一次出现的字符会被成功过滤出来，而其他重复出现的字符会被忽略掉。

filter()函数返回的结果便是已经去重的字符数组，将其转换为字符串输出即为最终需要的结果。

```js
// 算法2
function removeDuplicateChar2(str) {
   // 使用call()函数改变ﬁlter函数的执行主体
   let result = Array.prototype.ﬁlter.call(str, function (char, index, arr) {
      // 通过indexOf()函数与index的比较，判断是否是第一次出现的字符
      return arr.indexOf(char) === index;
   });
   return result.join('');
}

var str = 'helloJavaScripthellohtmlhellocss';
removeDuplicateChar2(str);  // 'heloJavscriptm'
```



> 算法3

借助ES6中的Set数据结构，Set具有自动去重的特性，可以直接将数组元素去重。

将字符串处理成数组，然后作为参数传递给Set的构造函数，通过new运算符生成一个Set的实例。

将Set通过展开运算符（...）转换成数组形式，最终转换成字符串获得需要的结果。

```js
// 算法3
function removeDuplicateChar3(str) {
   // 字符串转换的数组作为参数，生成Set的实例
   let set = new Set(str.split(''));
    // 将set重新处理为数组，然后转换成字符串
   return [...set].join('');
}

var str = 'helloJavaScripthellohtmlhellocss';
removeDuplicateChar3(str);  // 'heloJavscriptm'
```



### 判断一个字符串是否为回文字符串

回文字符串是指一个字符串正序和倒序是相同的，例如字符串'abcdcba'是一个回文字符串，而字符串'abcedba'则不是一个回文字符串。

需要注意的是，这里不区分字符大小写，即a与A在判断时是相等的。

真实的场景如下。给定两个字符串'abcdcba'和'abcedba'，经过一定的算法处理，分别会返回“true”和“false”。

针对这个场景，以下总结出了3种不同的处理算法。

> 算法1

算法1的主要思想是将字符串按从前往后顺序的字符与按从后往前顺序的字符逐个进行比较，如果遇到不一样的值则直接返回“false”，否则返回“true”。

```js
// 算法1
function isPalindromicStr1(str) {
   // 空字符则直接返回“true”
   if (!str.length) {
       return true;
   }
   // 统一转换成小写，同时转换成数组
   str = str.toLowerCase().split('');
   var start = 0, end = str.length - 1;
   // 通过while循环判断正序和倒序的字母
   while(start < end) {
      // 如果相等则更改比较的索引
      if(str[start] === str[end]) {
          start++;
          end--;
      } else {
          return false;
      }
   }
   return true;
}

var str1 = 'abcdcba';
var str2 = 'abcedba';

isPalindromicStr1(str1);  // true
isPalindromicStr1(str2);  // false
```



> 算法2

算法2与算法1的主要思想相同，将正序和倒序的字符逐个进行比较，与算法1不同的是，算法2采用递归的形式实现。

递归结束的条件有两种情况，一个是当字符串全部处理完成，此时返回“true”；另一个是当遇到首字符与尾字符不同，此时返回“false”。而其他情况会依次进行递归处理。

```js
// 算法2
function isPalindromicStr2(str) {
   // 字符串处理完成，则返回“true”
   if(!str.length) {
      return true;
   }
   // 字符串统一转换成小写
   str = str.toLowerCase();
   let end = str.length - 1;
   // 当首字符和尾字符不同，直接返回“false”
   if(str[0] !== str[end]) {
      return false;
   }
   // 删掉字符串首尾字符，进行递归处理
   return isPalindromicStr2(str.slice(1, end));
}

var str1 = 'abcdcba';
var str2 = 'abcedba';

isPalindromicStr2(str1);  // true
isPalindromicStr2(str2);  // false
```



> 算法3

算法3的主要思想是将字符串进行逆序处理，然后与原来的字符串进行比较，如果相等则表示是回文字符串，否则不是回文字符串。

```js
// 算法3
function isPalindromicStr3(str) {
   // 字符串统一转换成小写
   str = str.toLowerCase();
   // 将字符串转换成数组
   var arr = str.split('');
   // 将数组逆序并转换成字符串
    var reverseStr = arr.reverse().join('');
    return str === reverseStr;
}

var str1 = 'abcdcba';
var str2 = 'abcedba';

isPalindromicStr3(str1);  // true
isPalindromicStr3(str2);  // false
```


### 字符串首字母大写
> https://mp.weixin.qq.com/s/cXwuy77f3akNSGkVuBVXoA

* for循环
* for + replace

首先应该能想到的是for循环, 展开运算符这两种.
```js
//展开运算符
let str = 'string'

let [s, ...str] = str
str = [s.toUpperCase(), ...str].join('')

// map
[].map.call(str, (item,idx) => idx==='0' ? item.toUpperCase() : item ).join('')

//字符串拼接
str.charAt(0).toUpperCase + str.slice(1)

// 正则和replace
str.replace(/^./, str => str.toUpperCase())
					 
// 模板字符串
`${str.charAt(0).toUpperCase()}${str.slice(1)}`

// 使用substring代替slice
str.charAt(0).toUpperCase() + str.substring(1)
```

