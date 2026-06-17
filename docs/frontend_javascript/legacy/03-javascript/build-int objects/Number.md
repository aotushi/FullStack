---
alias: numbers 进制
---


## 0. 介绍

在JavaScript中，Number类型的数据既包括了整型数据，也包括了浮点型数据。

JavaScript 的 **`Number`** 对象是经过封装的能让你处理数字值的对象。`Number` 对象由 `Number()` 构造器创建。

JS使用IEEE754标准定义的64位浮点格式表示数值,这意味着JS可以表示的最大整数是
$$
\pm1.797\,693\,134\,862\,315\,7\,\times\,10^{308}
$$
最小整数是:
$$
\pm5\,\times\,10^{-324}
$$
JS可以准确表示的数值范围是:
$$
-\,9\,007\,199\,254\,740\,992\,(-2^{53}) \,-\,9\,007\,199\,254\,740\,992\,(2^{53})
$$
原因?

### 0.1 进制

最基本的数值采用的是十进制整数，另外，数值还可以通过八进制或者十六进制表示。

八进制。如果想要用八进制表示一个数值，那么首位必须是0，其他位必须是0～7的八进制序列。如果后面位数的字面值大于7，则破坏了八进制数据表示规则，前面的0会被忽略，当作十进制数据处理。

```js
let num1 = 024 //20
let num2 = 079 //79
```

十六进制。如果想要用十六进制表示一个数值，那么前两位必须是0x，其他位必须是十六进制序列（0～9，a～f或者A～F）。如果超过了十六进制序列，则会抛出异常。

```js
let num3 = 0x3f //63
let num4 = 0x2g //syntaxError: Invalid or unexpected token
```




### 0.2 类型转换
将其他类型的值转换为Number类型的情况。在JavaScript中，一共有3个函数可以完成这种转换，分别是Number()函数、parseInt()函数、parseFloat()函数.

#### Number()函数
Number()函数可以用于将任何类型转换为Number类型，它在转换时遵循下列规则。
* 如果是数字，会按照对应的进制数据格式，统一转换为十进制并返回。
* 如果是Boolean类型的值，true将返回为“1”，false将返回为“0”
* 如果值为undefined，则返回“NaN”
* 如果值为字符串类型，则遵循下列规则
	* 如果该字符串只包含数字，则会直接转换成十进制数；如果数字前面有0，则会直接忽略这个0
	* 如果字符串是有效的十六进制形式，则会转换为对应的十进制数值
	* 如果字符串是有效的八进制形式，则不会按照八进制转换，而是直接按照十进制转换并输出，因为前置的0会被直接忽略
	* 如果字符串为空，即字符串不包含任何字符，或为连续多个空格，则会转换为0
	* 如果字符串包含了任何不是以上5种情况的其他格式内容，则会返回“NaN”
* 如果值为对象类型，则会先调用对象的valueOf()函数获取返回值，并将返回值按照上述步骤重新判断能否转换为Number类型。如果都不满足，则会调用对象的toString()函数获取返回值，并将返回值重新按照步骤判断能否转换成Number类型。如果也不满足，则返回“NaN”。




### 1. 分类

* JavaScript 中的常规数字以 64 位的格式 [IEEE-754](https://en.wikipedia.org/wiki/IEEE_754-2008_revision) 存储，也被称为“双精度浮点数”。
* BigInt 数字，用于表示任意长度的整数。有时会需要它们，因为常规数字不能超过 2<sup>53</sup> 或小于 -2<sup>53</sup>



### 2. 语法


* 在JS 中所有的数字包括整数和浮点数都是number类型
* JS中大部分整数可以精确表示,超过一定范围后可能得到一个近似值
  * 再大就会使用科学计数法表示,超过一定范围会返回infinity.
  * 需要较大运算且需要精确结果,不要在JS中算
* 特殊的数值
  * infinity是数值,字面量, 表示无穷(正负).
  * 非法数字 NaN 返回类型是number
* 在JS中进行小数运算,可能得到一个不精确的结果,不要直接在JS中进行对精度要求较高的运算
* 创建特殊进制的数字
  * 二进制 以0b开头 例, 0b1010
  * 八进制 以0o开头 
  * 十六进制 以0x开头
* 大整数(ES2020新增  了解)
  * 大整数以n结尾
  * 使用typeof检查一个大整数时,会返回类型 bigint
  * 大整数只能和大整数进行运算

**数值分隔符:**
数字的可读性随着数字变长而变差，数字分隔符会让长数字更加清晰
在二进制、十六进制、BigInt ,10进制等中都可以使用。

```js
const x = 1000000000000
const y = 1_000_000_000_000
console.log(x === y) // true


```





#### 分隔符

可以用下划线将数值字面量分割为容易看清的数字段:

```javascript
let billion = 1_000_000_000; //以下划线作为千分位分隔符
let bytes = 0X89_AB_CD_EF; //作为字节分隔符
let bits = 0b0001_1101_0111; //作为半字节分隔符
let fraction = 0.123_456_789; //
```



#### 其他

**包装类实现**

原始值在某种情况下被转换成它的对象形式(new String(), new Number(), new Boolean()),这通常称为"装箱".

把基本数据类型转换为对应的引用类型的操作称为<span style="color:red">装箱"</span> 把引用类型转换为基本的数据类型称为<span style="color:red">拆箱"</span>

```javascript
new Number(value);
let a = new Number('123'); //a === 123 is false  a打印结果: Number {123}
let b= Number('123'); //b === 123 is true
a instanceof Number //true
b instanceof Number //false
```

**科学计数法**

在 JavaScript 中，我们通过在数字后附加字母 “e”，并指定零的数量来缩短数字

`"e"` 把数字乘以 `1` 后面跟着给定数量的 0 的数字

`e` 后面的负数表示除以 1 后面跟着给定数量的 0 的数字

```javascript
let billion = 1e9; //10亿,数字1后面跟9个0

1e3 = 1* 1000
1e-3 = 1 / 1000(= 0.001)  //-3 除以 1 后面跟着 3 个 0 的数字
```



## 方法


### Number.prototype.toFixed()
#### 概述
> 这个方法的值返回一个字符串,该字符串使用具有指定小数位数的定点表示法表示此数字。
> 总结为一句话就是: 将数字格式化为指定小数位的字符串.

#### 语法
```js
toFixed()
toFixed(digits)
```

**参数**
`digits(可选)`
- 用来表示小数点后展示的位数;
- 介于0~100之间的值
- 如果忽略,默认值是0.

**返回值**
使用定点符号表示给定数字的字符串
如果数字的大小（忽略符号）大于或等于 10<sup>21</sup>（与 `Number.prototype.toString()` 的返回值相同）,则使用科学记数法。

**异常

`RangeError`
如果`digits`不在0-100之间,则抛出此类型错误

`TypeError`
如果此方法在不是一个`Number`的对象上调用,则抛出此类型的错误.

#### 描述
此方法返回一个数值的字符串表示,不使用指数表示法，并且正好是小数点后的数字。
如有必要，这个数值会被四舍五入(is rounded)，并在必要时用零填充小数部分，以使其具有指定的长度。

假如数值的绝对值大于等于10<sup>21</sup>, 这个方法使用和`Number.prototype.toString()`一样的算法, 并且返回指数表示法的字符串. 
如果数字的值是非有限的(non-finite)，toFixed() 返回`Infinity`,`NaN`, `-Infinity`.
对于某些值，toFixed() 的输出可能比 toString() 更精确，因为 toString() 只打印足够的有效数字以区分该数字与相邻的数值。
```js
(1000000000000000128).toString(); // '1000000000000000100'
(1000000000000000128).toFixed(0); // '1000000000000000128'
```

选择一个足够大的精确位数可能返回意外结果,因为小数部分数值在浮点数(floating point)中无法精确表示.例如:
```js
(0.3).toFixed(50); // '0.29999999999999998889776975374843459576368331909180'

```

因为成员访问(memeber access)比一元减号有更高的优先级,所以对负数进行组合.
```js
-2.34.toFixed(1); // -2.3, a number
(-2.34).toFixed(1); // '-2.3'

```

#### 相关问题
##### 调用方式
整数调用toFixed方法时候,需要注意:
```js
5.toFixed(2); //Uncaught SyntaxError: Invalid or unexpected token

(5).toFixed(2); //'5.00'
Number(5).toFiexed(2); //'5.00'
5..toFixed(2); //'5.00'
```

```md
这个错误发生的原因是JavaScript解析器的工作方式。让我解释一下：

语法解析：
当JavaScript解析器遇到 5. 时，它会将这个点号解释为小数点，而不是方法调用的点号。
数字字面量：
在JavaScript中，5. 是一个有效的数字字面量，等同于 5.0。
意外的标记：
解析器期望在小数点后看到数字，但却遇到了 toFixed，这就导致了"意外的标记"错误。
```


#### 具体舍入规则
**toFixed舍入的具体规则是什么?**
> [js中计算后结果如何保留小数点后N位 - 小小邪 - 博客园 (cnblogs.com)](https://www.cnblogs.com/xielong/p/12341598.html)

**为什么会存在舍入?**
```
toFixed方法在JavaScript中存在舍入规则主要是因为浮点数精度问题和IEEE 754标准的限制。让我解释一下具体的规则和原因:

舍入的必要性:
JavaScript使用IEEE 754标准来表示浮点数。这种表示方法无法精确表示所有十进制小数，因此在进行小数计算和转换时需要舍入。

```

**舍入规则**
toFixed方法使用所谓的"银行家舍入法"（Banker's Rounding）或"四舍六入五成双"。具体规则如下:

- 截止位后, 小于5的小数部分舍去
- 截止位后, 大于5的小数部分进位
- 截止位后, 等于5的情况:
	* 如果5后面还有数字，则进位
	* 如果5后面没有数字，则根据5前面的数字决定:
		* 如果是0，则舍去
		* 如果非0，则进位

```js


(2.50).toFixed(1) // '2.5'
(2.54).toFixed(1) // '2.5'

(2.56).toFixed(1) // '2.6'

(2.550).toFixed(1) // '2.5'
(2.551).toFixed(1) // '2.6'
(2.559).toFixed(1) // '2.6'
```


简略版银行家舍入方法
```js
function bankRound(num, decimalPlaces) {
	let d = decimalPlaces || 0;
	let m = Math.pow(10, d);
	let n = +(d ? num*m : num).toFixed(8); //避免浮点数精度问题
	let i = Math.floor(n), f = n - i;
	let e = 1e - 8; //小数点后第9位
	let r = (f > 0.5 - e && f < 0.5 + e) ?
						((i % 2 === 0) ? i : i+1) :
						Math.round(n);
	return d ? r / m : r;
}
```

实现一个截取n位小数的方法
```js
//substring方法
function save2Point(value) {
	let dotPosition = value.indexOf('.') + 1;
	let dotBackStr = value.substring(dotPosition)
	let save2Str = dotBackStr.length >= 2 ? dotBackStr.substring(0,2) : Number(dotBackStr).toFixed(2);
	return dotPosition ? dotBackS : value.toFixed(2);
}

//数组
let str;
str = [...dotStr].pop()
str = str.pop();
let save2PointStr = str.join('')

```






### Number.prototype.toString()

方法 `num.toString(base)` 返回在给定 `base` 进制数字系统中 `num` 的字符串表示形式

`base` 的范围可以从 `2` 到 `36`。默认情况下是 `10`

常见的用例如下：

- **base=16** 用于十六进制颜色，字符编码等，数字可以是 `0..9` 或 `A..F`。
- **base=2** 主要用于调试按位操作，数字可以是 `0` 或 `1`。
- **base=36** 是最大进制，数字可以是 `0..9` 或 `A..Z`。所有拉丁字母都被用于了表示数字。对于 `36` 进制来说，一个有趣且有用的例子是，当我们需要将一个较长的数字标识符转换成较短的时候，例如做一个短的 URL。可以简单地使用基数为 `36` 的数字系统表示：

```javascript
123456..toString(36); // 2n9c
(123456).toString(36)
```

注意: 如果我们放置一个点：`123456.toString(36)`，那么就会出现一个 error，因为 JavaScript 语法隐含了第一个点之后的部分为小数部分。<span style="color:blue">如果我们再放一个点，那么 JavaScript 就知道小数部分为空</span>，现在使用该方法。

也可以写成 `(123456).toString(36)`。


#### 来源

[[202301171006]]


**其他方法**

* Number.isNaN()
* Number.isFinite()
* Number.isInteger()
* Number.parseFloat()
* Number.parseInt()

#### isFinite() 

**定义**

该全局 **`isFinite()`** 函数用来判断被传入的参数值是否为一个有限数值（finite number）。在必要情况下，参数会首先转为一个数值

**参数**

```javascript
isFinite(testValue)
```

**描述**

* isFinite 是全局的方法，不与任何对象有关系
* 你可以用这个方法来判定一个数字是否是有限数字。`isFinite` 方法检测它参数的数值。如果参数是 `NaN`，正无穷大或者负无穷大，会返回`false`，其他返回 `true`

* 和全局的 [`isFinite()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isFinite) 函数不同，`Number.isFinite()`方法不会强制将一个非数值的参数转换成数值，这就意味着，只有数值类型的值，且是有穷的（finite），才返回 `true`   !!!!
* isFinite(value)` 将其参数转换为数字，如果是常规数字，则返回 `true`，而不是 `NaN/Infinity/-Infinity
* 有时 `isFinite` 被用于验证字符串值是否为常规数字.
* 

```javascript
isFinite(Infinity);  // false
isFinite(NaN);       // false
isFinite(-Infinity); // false

isFinite(0);         // true
isFinite(null);      // true, 在更强壮的Number.isFinite(null)中将会得到false


isFinite("0");       // true, 在更强壮的Number.isFinite('0')中将会得到false


Number.isFinite('1') ;//false
isFinite('1'); //true

alert( isFinite("str") ); // false，因为是一个特殊的值：NaN
alert( isFinite(Infinity) ); // false，因为是一个特殊的值：Infinity

Number.isFinite(''); //false
isFinite(''); //true

Number.isFinite(' '); //false
isFinite(' '); //true
```



#### parseInt()

**定义**

**parseInt(string, radix)**  解析一个字符串并返回指定基数的**十进制整数**， `radix` 是2-36之间的整数，表示被解析字符串的基数。

**参数**

```javascript
parseInt(string, radix);
```

`string`   要被解析的值。

* 如果参数不是一个字符串，则将其转换为字符串(使用  `ToString `抽象操作)。字符串开头的空白符将会被忽略。

`radix` **可选**

* 从 `2` 到 `36`，表示字符串的基数。例如指定 16 表示被解析值是十六进制数。请注意，10不总是默认值.

**返回值**
* 从给定的字符串中解析出的一个整数
* `NaN`  (当基数小于2或者大于36,或第一个非空格字符串不能转换为数字)

**描述**

* `parseInt`函数将其第一个参数转换为一个字符串，对该字符串进行解析，然后返回一个整数或`NaN`
* 如果第一个字符不能转换为数字，`parseInt`会返回 `NaN`
* 如果 `parseInt `遇到的字符不是指定 `radix `参数中的数字，它将忽略该字符以及所有后续字符，并返回到该点为止已解析的整数值。 `parseInt` 将数字截断为整数值。 允许前导和尾随空格
* 由于某些数字在其字符串表示形式中使用e字符（例如 `6.022×23` 表示` 6.022e23` ），因此当对非常大或非常小的数字使用数字时，使用 `parseInt` 截断数字将产生意外结果
* `parseInt` 可以理解两个符号。`+` 表示正数，`-` 表示负数（从ECMAScript 1开始）。它是在去掉空格后作为解析的初始步骤进行的。如果没有找到符号，算法将进入下一步；否则，它将删除符号，并对字符串的其余部分进行数字解析。
* 如果 `radix` 是 `undefined`、`0`或未指定的，JavaScript会假定以下情况：
  * 如果输入的 `string`以 "`0x`"或 "`0x`"（一个0，后面是小写或大写的X）开头，那么radix被假定为16，字符串的其余部分被当做十六进制数去解析
  * 如果输入的 `string`以 "`0`"（0）开头， `radix`被假定为`8`（八进制）或`10`（十进制）。具体选择哪一个radix取决于实现。ECMAScript 5 澄清了应该使用 10 (十进制)，但不是所有的浏览器都支持。**因此，在使用 `parseInt` 时，一定要指定一个 radix**。
  * 如果输入的 `string` 以任何其他值开头， `radix` 是 `10` (十进制)
* 要将一个数字转换为特定的 `radix` 中的字符串字段，请使用 `thatNumber.toString(radix)`函数
* 警告: `parseInt`将 [`BigInt`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)转换为[`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)，并在这个过程中失去了精度。这是因为拖尾的非数字值，包括 "n"，会被丢弃。



<u>非字符串类型转换为字符串类型</u>

如果遇到传入的参数是非字符串类型的情况，则需要将其优先转换成字符串类型，即使传入的是整型数据。

```js
parseInt('0x12', 16) //18
parseInt(0x12, 16) //24
```

第一条语句直接将字符串"0x12"转换为十六进制数，得到的结果为1×16+2=18；第二条语句由于传入的是十六进制数，所以会先转换成十进制数18，然后转换成字符串"18"，再将字符串"18"转换成十六进制数，得到的结果为1×16+8=24。



<u>数据截取的前置匹配原则</u>

parseInt()函数在做转换时，对于传入的字符串会采用<u>前置匹配</u>的原则。即从字符串的第一个字符开始匹配，如果处于基数指定的范围，则保留并继续往后匹配满足条件的字符，直到某个字符不满足基数指定的数据范围，则从该字符开始，舍弃后面的全部字符。在获取到满足条件的字符后，将这些字符转换为整数。

```js
parseInt('fg123', 16) //15
```

如果遇到的字符串是以"0x"开头的，那么在按照十六进制处理时，会计算后面满足条件的字符串；如果按照十进制处理，则会直接返回“0”。

```js
parseInt('0x12', 16) //18=16+2
parseInt('0x12', 10) //10
```

需要注意的一点是，如果传入的字符串中涉及算术运算，则不执行，算术符号会被当作字符处理；如果传入的参数是算术运算表达式，则会先运算完成得到结果，再参与parseInt()函数的计算。

```js
parseInt(15*3, 10) //45 先运算完成得到45,再进行parseInt(45,10)的运算
parseInt('15*3', 10) //15 直接当做字符串处理,并不会进行乘法运算
```



<u>对包含字符e的不同数据的处理差异</u>

处理的数据中包含字符e时，不同进制数的处理结果有很大不同。

当传入的参数本身就是Number类型时，会将e按照科学计数法计算后转换成字符串，然后按照对应的基数转换得到最终的结果。

如果传入的字符串中直接包含e，那么并不会按照科学计数法处理，而是会判断字符e是否处在可处理的进制范围内，如果不在则直接忽略，如果在则转换成对应的进制数。

```js
parseInt(6e3, 10) //6000
parseInt(6e3, 16) //24576
parseInt('6e3', 10) //6
parseInt('6e3', 16) //1763
```

第四条语句parseInt('6e3', 16)，表示的是将字符串'6e3'转换为十六进制的整数，因为字符'e'在十六进制所能表达的范围内，所以会转换为14进行计算，最后得到的结果为6×162 +14×16 + 3 =1763。



<u>对浮点型数的处理</u>

如果传入的值是浮点型数，则会忽略小数点及后面的数，直接取整。

```js

parseInt('6.01', 10) //6
parseInt('6.99', 10) //6
```

以下语句都会返回“15”

```js
parseInt("0xF", 16);    // 十六进制的F为15，返回“15”
parseInt("F", 16);      // 十六进制的F为15，返回“15”
parseInt("17", 8);      // 八进制的"17"，返回结果为1×8 + 7 = 15
parseInt(021, 8);      // 021先转换成十进制得到17，然后转换成字符串"17"，再转换成
                      // 八进制，返回结果为1×8 + 7 = 15
parseInt("015", 10);   // 前面的0忽略，返回“15”
parseInt(15.99, 10);   // 直接取整，返回“15”
parseInt("15,123", 10); // 字符串"15,123"一一匹配，得到"15"，转换成十进制后返回“15”
parseInt("FXX123", 16); // 字符串"FXX123"一一匹配，得到"F"，转换成十六进制后返回“15”
parseInt("1111", 2);    // 1×23 + 1×22 + 1×2 + 1 = 15
parseInt("15 * 3", 10); // 字符串中并不会进行算术运算，实际按照"15"进行计算，返回“15”
parseInt("15e2", 10);   // 实际按照字符串"15"运算，返回“15”
parseInt("15px", 10);   // 实际按照字符串"15"运算，返回“15”
parseInt("12", 13);     // 按照十三进制计算，返回结果为1×13 + 2 = 15
```



<u>map()函数 与 parseInt()函数的隐形坑</u>

设想这样一个场景，存在一个数组，数组中的每个元素都是Number类型的字符串['1','2', '3', '4']，如果我们想要将数组中的元素全部转换为整数，我们该怎么做呢？

我们可能会想到在Array的map()函数中调用parseInt()函数，代码如下。

```js
var arr = ['1', '2', '3', '4'];

var result = arr.map(parseInt);

console.log(result);
```

但是在运行后，得到的结果是[1, NaN, NaN, NaN]，与我们期望的结果[1, 2, 3, 4]差别很大，这是为什么呢？其实这就是一个藏在map()函数与parseInt()函数中的隐形坑。

上面的代码实际与下面的代码等效。

```js
arr.map(function (val, index) {
    return parseInt(val, index);
});
```

parseInt()函数接收的第二个参数实际为数组的索引值，所以实际处理的过程如下所示

```js
parseInt('1', 0);  // 1
parseInt('2', 1);  // NaN
parseInt('3', 2);  // NaN
parseInt('4', 3);  // NaN
```

任何整数以0为基数取整时，都会返回本身，所以第一行代码会返回“1”。

第二行代码parseInt('2', 1)，因为parseInt()函数对应的基数只能为2～36，不满足基数的整数在处理后会返回“NaN”；

第三行代码parseInt('3', 2)，表示的是将3处理为二进制表示，实际上二进制时只有0和1，3超出了二进制的表示范围，无法转换，返回“NaN”；

第四行代码parseInt('4', 3)，与第三行类似，4无法用三进制的数据表示，返回“NaN”。

因此我们在map()函数中使用parseInt()函数时需要注意这一点，不能直接将parseInt()函数作为map()函数的参数，而是需要在map()函数的回调函数中使用，并尽量指定基数，代码如下所示。

```js
var arr = ['1', '2', '3', '4'];

var result = arr.map(function (val) {  
    return parseInt(val, 10);
});

console.log(result);  // [1, 2, 3, 4]
```





**实例**

##### JS中任意进制转换

> [各种 2 到 62 任意进制之间的转换-蚊子-前端博客 (xiabingbao.com)](https://www.xiabingbao.com/post/algorithm/hex-covert-rb1w5l.html)

在 JavaScript 中，有两个系统方法 parseInt 和 toString，综合运用这两个方法，可以实现 `36进制`内的任意进制的转换。

- parseInt(string, radix): 将任意进制 radix(36 进制内)转为 10 进制的数字，radix 表示 string 本身是多少进制的；
- num.toString(radix): 将 10 进制的数字转为任意进制 radix 的字符串，radix 表示要转换成多少进制的；

```javascript
const convert = (num:string, base:number,to:number) {
  return parseInt(num, base).toString(to)
}
```



#### parseFloat()

**定义**

**`parseFloat()`** 函数解析一个参数（必要时先转换为字符串）并返回一个浮点数. 如果给定值不能转换为数值，则会返回“NaN”。与parseInt()函数相比，parseFloat()函数没有进制的概念

**参数**

```javascript
parseFloat(string)
```

`string`  需要被解析成为浮点数的值

**返回值**

给定值被解析成**浮点数**。如果给定值不能被转换成数值，则会返回 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)。

**描述**

* `parseFloat`是个全局函数,不属于任何对象
* 如果 `parseFloat` 在解析过程中遇到了正号（`+`）、负号（`-` U+002D HYPHEN-MINUS）、数字（`0`-`9`）、小数点（`.`）、或者科学记数法中的指数（e 或 E）以外的字符，则它会忽略该字符以及之后的所有字符，返回当前已经解析到的浮点数
  * 正负号必须出现在字符的第一位，而且不能连续出现。


```js
parseFloat('+1.2');   // 1.2
parseFloat('-1.2');   // -1.2
parseFloat('++1.2');  // NaN，符号不能连续出现
parseFloat('--1.2');  // NaN，符号不能连续出现
parseFloat('1+1.2');  // 1，'+'出现在第二位，不会当作符号位处理
```



* 第二个小数点的出现也会使解析停止（在这之前的字符都会被解析）
* 参数首位和末位的空白符会被忽略。
* 如果参数字符串的第一个字符不能被解析成为数字,`则` `parseFloat` 返回 `NaN`。
* `parseFloat` 也可以解析并返回 [`Infinity`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Infinity)。
* `parseFloat`解析 [`BigInt`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 为 [`Numbers`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number), 丢失精度。因为末位 `n` 字符被丢弃。
* 对于字符串中出现的合法科学运算符e，进行运算处理后会转换成浮点型数，这点与parseInt()函数的处理有很大的不同。

```js
parseFloat('4e3');   // 4000
parseInt('4e3', 10); // 4
```

* 对于小数点，只能正确匹配第一个，第二个小数点是无效的，它后面的字符也都将被忽略

```js
parseFloat('11.20');  // 11.2
parseFloat('11.2.1'); // 11.2
```



考虑使用 [`Number(*value*)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number) 进行更严谨的解析，只要参数带有无效字符就会被转换为 [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN) 

`parseFloat` 也可以转换一个已经定义了 `toString` 或者 `valueOf` 方法的对象，它返回的值和在调用该方法的结果上调用 `parseFloat` 值相同



**实例**

下面的例子都返回**3.14**

```javascript
parseFloat('3.0'); //3 结果是数字

parseFloat(3.14);
parseFloat('3.14');
parseFloat('  3.14  ');
parseFloat('314e-2');
parseFloat('0.0314E+2');
parseFloat('3.14some non-digit characters');
parseFloat({ toString: function() { return "3.14" } });
```

大整数的返回值

均返回 `900719925474099300`，当整数太大以至于不能被转换时将失去精度

```javascript
parseFloat(900719925474099267n);
parseFloat('900719925474099267n');
```




#### Number.trunc

```js
- 将数字的小数部分抹掉,返回整数部分
Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0

- 对于非数值，Math.trunc内部使用Number方法将其先转为数值。
Math.trunc('123.456') // 123
Math.trunc(true) //1
Math.trunc(false) // 0
Math.trunc(null) // 0

- 对于空值和无法截取整数的值，返回NaN。
Math.trunc(NaN);      // NaN
Math.trunc('foo');    // NaN
Math.trunc();         // NaN
Math.trunc(undefined) // NaN


```





#### Number.isInteger

```js
- 判断一个数是否为integer整数类型
- 参数不是数值,返回false

- JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。
Number.isInteger(25)//true
Number.isInteger(25.0)//true
Number.isInteger(25.1)//false


Number.isInteger() // false
Number.isInteger(null) // false
Number.isInteger('15') // false
Number.isInteger(true) // false
```

#### Number.isSafeInteger()和安全整数

```js
https://www.bookstack.cn/read/es6-3rd/spilt.6.docs-number.md
- JS能精确表示的整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值。

Math.pow(2, 53);//9007199254740992
9007199254740992  // 9007199254740992
9007199254740993  // 9007199254740992 超过2的53次方之后,一个数就不精确了.
Math.pow(2, 53) === Math.pow(2, 53) + 1
// true

ES6 引入了Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限。


```




### Number.prototype.toLocaleString()



## 实例
>https://seven777777.github.io/myblog/work/2020/09/29/toLocaleString/

```js
//阿拉伯数字转中文

let num = 1;
num.toLocaleString('zh-u-nu-hanidec') //'一'

//转千分位
let num = '12345678.123'
num.toLocaleString(); //"12,345,678.123"

//百分比
var num = 1345.2345
num.toLocaleString('zh',{style:'percent'}) // "134,523%"
num.toLocaleString('zh',{style:'percent' , useGrouping: false}) // "134523%"
num.toLocaleString('zh',{style:'percent' , useGrouping: false}) // "134523%"

//转货币符号
var num = 1234.2345
num.toLocaleString('zh',{style:'currency' , currency:'CNY' }) // "¥1,234.23"
num.toLocaleString('ja',{style:'currency' , currency:'JPY' }) // "￥1,234"
num.toLocaleString('zh',{style:'currency' , currency:'CNY' , useGrouping: false , minimumFractionDigits: 3}) // "¥1234.235"


var arr = [1,22,3333]
arr.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }) // ￥1,￥22,￥3,333


//指定整数最少位数,小数最少与最多位数，有效数字的位数，不够用 0 补全 （采用四舍五入法）
let num = 1234.456;
num.toLocaleString('zh', { minimumIntegerDigits: 5 }); //01,234.456
num.toLocaleString('zh', { minimumFractionDigits: 4, useGrouping: false }); //1234.4560
num.toLocaleString('zh', { maximumFractionDigits: 2, useGrouping: false }); //1234.46
num.toLocaleString('zh', { minimumSignificantDigits: 8, useGrouping: false }); //1234.4560
num.toLocaleString('zh', { maximumSignificantDigits: 4, useGrouping: false }); //1234


//转换时间显示
var date = new Date()
date.toLocaleString() // "2020/9/28 下午5:14:53"
date.toLocaleString('zh',{ hour12: false }) // "2020/9/28 17:14:53"
```











#### Number() parseInt() parseFloat()比较

* Number()函数转换的是传入的整个值，并不是像parseInt()函数和parseFloat()函数一样会从首位开始匹配符合条件的值。如果整个值不能被完整转换，则会返回“NaN”。
* parseFloat()函数在解析小数点时，会将第一个小数点当作有效字符，而parseInt()函数在解析时如果遇到小数点会直接停止，因为小数点不是整数的一部分。
* parseFloat()函数在解析时没有进制的概念，而parseInt()函数在解析时会依赖于传入的基数做数值转换。



#### isNaN() 与 Number.isNaN()对比

Number类型数据中存在一个比较特殊的数值NaN（Not a Number），它表示应该返回数值却并未返回数值的情况。

NaN存在的目的是在某些异常情况下保证程序的正常执行。例如0/0，在其他语言中，程序会直接抛出异常，而在JavaScript中会返回“NaN”，程序可以正常执行。

NaN有两个很明显的特点，第一个是任何涉及NaN的操作都会返回“NaN”，第二个是NaN与任何值都不相等，即使是与NaN本身相比。

在判断NaN时，ES5提供了isNaN()函数，ECMAScript 6（后续简称ES6）为Number类型增加了静态函数isNaN()。

既然在ES5中提供了isNaN()函数，为什么要在ES6中专门增加Number.isNaN()函数呢？两者在使用上有什么区别呢？

##### isNaN()函数

isNaN()函数的作用，它用来确定一个变量是不是NaN。NaN是一个Number类型的数值，只不过这个值无法用真实的数字表示。

如果传递的参数是Number类型数据，可以很容易判断是不是NaN。

<span style="color:red">如果传递的参数是非Number类型</span>，它返回的结果往往会让人费解。

```js
isNaN({}) //true
```

首先要知道NaN产生的条件，一方面是在数据运算时，返回了一个无法表示的数值，例如0/ 0就会返回“NaN”。有一点需要注意的是除了0 / 0，其他数据除以0都返回“Infinity”。

另一方面是在需要做强制类型转换时，某些数据不能直接转换为数值类型，就会返回“NaN”，例如1 - 'a' = NaN，因为字符串'a'无法参与数值运算。

而isNaN()函数正好会进行数据的类型转换，它在处理的时候会去判断传入的变量值能否转换为数字，如果能转换成数字则会返回“false”，如果无法转换则会返回“true”。

```js
isNaN(NaN);       // true
isNaN(undeﬁned);  // true
isNaN({});        // true

isNaN(true);      // false，Number(true)会转换成数字1
isNaN(null);      // false，Number(null)会转换成数字0
isNaN(1);         // false
isNaN('');        // false，Number('')会转换为成数字0
isNaN("1");            // false，字符串"1"可以转换成数字1
isNaN("JavaScript");   // true，字符串"JavaScript"无法转换成数字
// Date类型
isNaN(new Date());     // false
isNaN(new Date().toString());  // true
```

Date是一种比较特殊的类型，当我们调用new Date()函数生成的实例并转换为数值类型时，会转换为对应的时间戳，例如下面的代码。

```js
Number(new Date()); // 1543333199705
```





##### Number.isNaN()函数

因为isNaN()函数本身存在误导性，而ES6中的Number.isNaN()函数会在真正意义上去判断变量是否为NaN，不会做数据类型转换。<span style="color:blue">只有在传入的值为NaN时，才会返回“true”，传入其他任何类型的值时会返回“false”。</span>

```js
Number.isNaN(NaN);        // true
Number.isNaN(undeﬁned);   // false
Number.isNaN(null);       // false
Number.isNaN(true);       // false
Number.isNaN('');         // false
Number.isNaN(123);        // false
```

面代码运行后，除了传入NaN会返回“true”以外，传入其他的值都会返回“false”。如果在非ES6环境中想用ES6中的isNaN()函数，该怎么办呢？我们有以下**兼容性处理方案**。

```js
// 兼容性处理
if(!Number.isNaN) {
    Number.isNaN = function (n) {
       return n !== n;
    }
}
```

因为在所有类型的数据中，如果一个变量和自身作比较，只有在变量值为NaN时才会返回“false”，其他情况都是返回“true”。

所以n !== n返回“true”，只有在n为NaN的时候才成立。



**总结**

* isNaN()函数在判断是否为NaN时，需要先进行数据类型转换，只有在无法转换为数字时才会返回“true”
* Number.isNaN()函数在判断是否为NaN时，只需要判断传入的值是否为NaN，并不会进行数据类型转换。






### 6. 不精确的计算

实数有无限多个,但JS的浮点格式只能表示其中有限个(确切说,是`18 437 736 874 454 810 627`个).这意味着通过JS操作实数,数值表示的经常是实际数值的近似值.

JS使用IEEE-754浮点表示法是一种二进制表示法,无法精确表示哪怕0.1这么简单的数,只能近似表示0.1.

#### 0. 问题

在内部，数字是以 64 位格式 [IEEE-754](http://en.wikipedia.org/wiki/IEEE_754-1985) 表示的，所以正好有 64 位可以存储一个数字：其中 52 位被用于存储这些数字，其中 11 位用于存储小数点的位置（对于整数，它们为零），而 1 位用于符号.

1.如果一个数字太大，则会溢出 64 位存储，并可能会导致无穷大

```javascript
console.log(1e500); //Infinity
```

2.使用二进制数字系统无法 **精确** 存储 *0.1* 或 *0.2*，就像没有办法将三分之一存储为十进制小数一样

```javascript
alert( 0.1 + 0.2 ); // 0.30000000000000004
```

<u>IEEE-754 数字格式通过将数字舍入到最接近的可能数字来解决此问题</u>。这些舍入规则通常不允许我们看到“极小的精度损失”，但是它确实存在

```javascript
alert( 0.1.toFixed(20) ); // 0.10000000000000000555
```

<u>当我们对两个数字进行求和时，它们的“精度损失”会叠加起来。</u>这就是为什么 `0.1 + 0.2` 不等于 `0.3`. 许多其他编程语言也存在同样的问题。

#### 1. 解决

最可靠的方法是借助方法 [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) 对结果进行舍入.如果需要显示 `¥ 0.30`，这实际上很方便。对于其他情况，我们可以使用一元加号将其强制转换为一个数字：

```javascript
let sum = 0.1 + 0.2;
alert( sum.toFixed(2) ); // 0.30

let sum = 0.1 + 0.2;
alert( +sum.toFixed(2) ); // 0.3
```

乘/除法可以减少误差，但不能完全消除误差

```javascript
alert( (0.1 * 10 + 0.2 * 10) / 10 ); // 0.3
alert( (0.28 * 100 + 0.14 * 100) / 100); // 0.4200000000000001
```

#### 2. 实例

**数字**

```javascript
// Hello！我是一个会自我增加的数字！
alert( 9999999999999999 ); // 显示 10000000000000000


9999999999999999..toString(2).length //54
```

出现了同样的问题：精度损失。有 64 位来表示该数字，其中 52 位可用于存储数字，但这还不够。所以最不重要的数字就消失了。JavaScript 不会在此类事件中触发 error。它会尽最大努力使数字符合所需的格式，但不幸的是，这种格式不够大到满足需求。

```javascript
Object.is(0, -0); //false

0 === -0; //true
```

数字内部表示的另一个有趣结果是存在两个零：`0` 和 `-0`。

这是因为在存储时，使用一位来存储符号，因此对于包括零在内的任何数字，可以设置这一位或者不设置。在大多数情况下，这种区别并不明显，因为运算符将它们视为相同的值。



**6.35.toFixed(1) == 6.3**

为什么 `6.35` 被舍入为 `6.3` 而不是 `6.4`?

在内部，`6.35` 的小数部分是一个无限的二进制。在这种情况下，它的存储会造成精度损失。

```javascript
6.35.toFixed(20); // 6.34999999999999964473
```

精度损失可能会导致数字的增加和减小。在这种特殊的情况下，数字变小了一点，这就是它向下舍入的原因

那么 `1.35` 会怎样呢？

```javascript
1.35.toFixed(20); // 1.35000000000000008882
```

在这里，精度损失使得这个数字稍微大了一些，因此其向上舍入.

**如何以正确的方式进行舍入,解决`6.35`的问题?**

`63.5` 完全没有精度损失。这是因为小数部分 `0.5` 实际上是 `1/2`。以 2 的整数次幂为分母的小数在二进制数字系统中可以被精确地表示，现在我们可以对它进行舍入

```javascript
(6.35 * 10).toFixed(20); //63.50000000000000000000


Math.round(6.35 * 10) / 10; // 6.35 -> 63.5 -> 64(rounded) -> 6.4
```

#### 表示任意精度整数BigInt

新数值类型BigInt. 



### 6.1 浮点型运算

在JavaScript中，整数和浮点数都属于Number类型，它们都统一采用64位浮点数进行存储。

虽然它们存储数据的方式是一致的，但是在进行数值运算时，却会表现出明显的差异性。整数参与运算时，得到的结果往往会和我们所想的一样，而对于浮点型运算，有时却会出现一些意想不到的结果，如下面的代码所示。

```js
// 加法
0.1 + 0.2 = 0.30000000000000004
0.7 + 0.1 = 0.7999999999999999

// 减法
1.5 - 1.2 = 0.30000000000000004
0.3 - 0.2 = 0.09999999999999998

// 乘法
0.7 * 180 = 125.99999999999999
9.7 * 100 = 969.9999999999999

// 除法
0.3 / 0.1 = 2.9999999999999996
0.69 / 10 = 0.06899999999999999
```



#### 问题原因

首先我们来看看一个浮点型数在计算机中的表示，它总共长度是64位，其中最高位为符号位，接下来的11位为指数位，最后的52位为小数位，即有效数字的部分。

* 第0位：符号位sign表示数的正负，0表示正数，1表示负数。
* 第1位到第11位：存储指数部分，用e表示。·
* 第12位到第63位：存储小数部分（即有效数字），用f表示，如图1-1所示。

![epub_34232297_2](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/epub_34232297_2.2p0j8wcfqg00.webp)

因为浮点型数使用64位存储时，最多只能存储52位的小数位，对于一些存在无限循环的小数位浮点数，会截取前52位，从而丢失精度，所以会出现上面实例中的结果。



#### 计算过程

接下来以0.1 + 0.2 = 0.30000000000000004的运算为例，看看为什么会得到这个计算结果。

首先将各个浮点数的小数位按照“乘2取整，顺序排列”的方法转换成二进制表示。

具体做法是用2乘以十进制小数，得到积，将积的整数部分取出；

然后再用2乘以余下的小数部分，又得到一个积；再将积的整数部分取出，如此推进，直到积中的小数部分为零为止。

然后把取出的整数部分按顺序排列起来，先取的整数作为二进制小数的高位有效位，后取的整数作为低位有效位，得到最终结果。

0.1转换为二进制表示的计算过程如下。

```js
0.1 * 2 = 0.2 //取出整数部分0

0.2 * 2 = 0.4 //取出整数部分0

0.4 * 2 = 0.8 //取出整数部分0

0.8 * 2 = 1.6 //取出整数部分1

0.6 * 2 = 1.2 //取出整数部分1

0.2 * 2 = 0.4 //取出整数部分0

0.4 * 2 = 0.8 //取出整数部分0

0.8 * 2 = 1.6 //取出整数部分1

0.6 * 2 = 1.2 //取出整数部分1
```

1.2取出整数部分1后，剩余小数为0.2，与这一轮运算的第一位相同，表示这将是一个无限循环的计算过程。

因此0.1转换成二进制表示为0.0 0011 0011 0011 0011 0011 0011……（无限循环）。

同理对0.2进行二进制的转换，计算过程与上面类似，直接从0.2开始，相比于0.1，少了第一位的0，其余位数完全相同，结果为0.0011 0011 0011 0011 0011 0011……（无限循环）。

将0.1与0.2相加，然后转换成52位精度的浮点型表示。

```js
 0.0001 1001 1001 1001 1001 1001  1001 1001 1001 1001 1001 1001 1001   (0.1)
+ 0.0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011 0011   (0.2)
= 0.0100 1100 1100 1100 1100 1100 1100 1100 1100 1100 1100 1100 1100
```

得到的结果为0.0100 1100 1100 1100 1100 1100 1100 1100 1100 1100 1100 1100 1100，转换成十进制值为0.30000000000000004。



#### 解决方法

这里提供一种方法，主要思路是将浮点数先乘以一定的数值转换为整数，通过整数进行运算，然后将结果除以相同的数值转换成浮点数后返回。

下面提供一套用于做浮点数加减乘除运算的代码。

```js
const operationObj = {
   /**
    * 处理传入的参数，不管传入的是数组还是以逗号分隔的参数都处理为数组
    * @param args
    * @returns {*}
    */
   getParam(args) {
      return Array.prototype.concat.apply([], args);
   },

   /**
    * 获取每个数的乘数因子，根据小数位数计算
    * 1.首先判断是否有小数点，如果没有，则返回1；
    * 2.有小数点时，将小数位数的长度作为Math.pow()函数的参数进行计算
    * 例如2的乘数因子为1，2.01的乘数因子为100
    * @param x
    * @returns {number}
    */
   multiplier(x) {
      let parts = x.toString().split('.');
      return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
   },

   /**
    * 获取多个数据中最大的乘数因子
    * 例如1.3的乘数因子为10，2.13的乘数因子为100
    * 则1.3和2.13的最大乘数因子为100
    * @returns {*}
    */
   correctionFactor() {
       let args = Array.prototype.slice.call(arguments);
       let argArr = this.getParam(args);
       return argArr.reduce((accum, next) => {
           let num = this.multiplier(next);
           return Math.max(accum, num);
       }, 1);
   },

   /**
    * 加法运算
    * @param args
    * @returns {number}
    */
   add(...args) {
       let calArr = this.getParam(args);
       // 获取参与运算值的最大乘数因子
       let corrFactor = this.correctionFactor(calArr);
       let sum = calArr.reduce((accum, curr) => {
           // 将浮点数乘以最大乘数因子，转换为整数参与运算
           return accum + Math.round(curr * corrFactor);
       }, 0);
       // 除以最大乘数因子
       return sum / corrFactor;
   },

   /**
    * 减法运算
    * @param args
    * @returns {number}
    */
   subtract(...args) {
       let calArr = this.getParam(args);
       let corrFactor = this.correctionFactor(calArr);
       let diﬀ = calArr.reduce((accum, curr, curIndex) => {
          // reduce()函数在未传入初始值时，curIndex从1开始，第一位参与运算的值需要
          // 乘以最大乘数因子
          if (curIndex === 1) {
              return Math.round(accum * corrFactor) - Math.round(curr * corrFactor);
          }
          // accum作为上一次运算的结果，就无须再乘以最大因子
          return Math.round(accum) - Math.round(curr * corrFactor);
       });
     // 除以最大乘数因子
       return diﬀ / corrFactor;
   },

   /**
    * 乘法运算
    * @param args
    * @returns {*}
    */
   multiply(...args) {
      let calArr = this.getParam(args);
      let corrFactor = this.correctionFactor(calArr);
      calArr = calArr.map((item) => {
          // 乘以最大乘数因子
          return item * corrFactor;
      });
      let multi = calArr.reduce((accum, curr) => {
          return Math.round(accum) * Math.round(curr);
      }, 1);
      // 除以最大乘数因子
      return multi / Math.pow(corrFactor, calArr.length);
   },

   /**
    * 除法运算
    * @param args
    * @returns {*}
    */
   divide(...args) {
       let calArr = this.getParam(args);
       let quotient = calArr.reduce((accum, curr) => {
           let corrFactor = this.correctionFactor(accum, curr);
           // 同时转换为整数参与运算
           return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
       });
       return quotient;
   }
};
```

接下来我们通过以下这些代码对加减乘除运算分别做测试，运算结果和我们期望的一致。

```js
console.log(operationObj.add(0.1, 0.7));      // 0.8
console.log(operationObj.subtract(0.3, 0.2)); // 0.1
console.log(operationObj.multiply(0.7, 180)); // 126
console.log(operationObj.divide(0.3, 0.1));   // 3
```














### 数字的使用案例


#### 类型转换之花式字母表示法

先看下效果:

```javascript
//下面这一句打印什么
[+[][0] + []][0][1]
```

打印结果是:

```javascript
> [+[][0] + []][0][1]
<. 'a'
```

打印一句话:

```javascript
[[][0] + []][0][5]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][8]+[[[] == []][0] + []][0][2]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][6]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]]+[]][0][23]+[[][0] + []][0][3]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][8]+[+[1 + [[][0] + []][0][3] +309][0] + []][0][7]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][6]+[[][0] + []][0][0]
```

打印结果是:

```javascript
< 'I love you'
```

让我们开始解密:

第一个效果:

```javascript
[][0]
```

因为空数组不存在第一个元素, 所以结果是undefined

第二个效果:

```javascript
undefined + []
```

undefined + `[]` 相当于 undefined + "" 结果为"undefined"字符串。

第三个效果：

通过下标就可以取到对应的字母

```javascript
['undefined'][0][0]
```

这时候我们就获得了"u"字母，通过改变下标，我们可以获取u、n、d、e、f、i 共6个字母

##### NaN

第一个效果:

```javascript
+undefined
```

相当于Number(undefined), 结果是NaN.

第二个效果:
```javascript
NaN + []
```

相当于NaN + '', 结果为NaN的字符串形式

第三个效果:
```javascript
['NaN'][0][1]
```

通过这种方式我们可以去到'a'



##### false

第一个效果

```javascript
[] == []
```

结果是false

第二个效果

```javascript
//通过value + [] 转换成字符串
false + []
```

第三个效果:

```javascript
//通过[value][0][n] 取字母
```



##### true

```javascript
+[] == +[]
```

相当于比较 "" == ""，结果自然为 true

通过以上 4 种方法取到的字母依然有限，我们需要一些其他的方法来获得更多的字母。

##### Infinity

注意：在前面我们已经取到了字母 e。

```javascript
+("1e309")
```

转成数字后，相当于 1 乘以 10 的 309 次方，大于 JavaScript 最大的数，所以结果会是 Infinity，剩下的步骤与上面的相同，以后就不赘述了。

我们可以从中取出 t 和 y

##### function

注意：到此为止，我们已经获得了 u n d e f i t r f a l s t y，从中我们可以拼成"find"字符串。

```javascript
[]['find']
```

会显示数组的find函数，结果为：

```javascript
function find() { [native code]}
```

通过这种方法,我们可以取出c o v.

不过注意：通过这种方式取字母 v 会有兼容性问题！！！ ????



##### 神奇的constructor

注意，我们已经有了 17 个字母了，我们现在可以拼出"constructor"!

constructor 可是一个神奇的属性，因为通过它，我们可以获得各种类型的值对象的构造函数！

```javascript
0['constructor'] //function Number() {[native code]}

''['constructor'] //function String() {[native code]}

...
```

通过以上方式，我们可以取 m、g

也许我们会疑问，`""` 如何表示呢？

```javascript
[] + [] === '' //true
```



##### name

有了 m，我们现在可以拼出 name，可是 name 有什么用呢？

```javascript
'to' + ''['constructor']['name'] //'toString'
```

我们最终的目的是拼出万能的"toString"字符串



##### 万能的toString

我们之所以拼出 toString，是因为利用 toString 这个方法可以表示出 26个 字母!

这时候，就要隆重介绍下这个平时看起来不起眼，但是在这里确实最终主角的 toString 方法！

以下引自 W3C school：

作用:

> toString() 方法可把一个 Number 对象转换为一个字符串，并返回结果。

用法:

> NumberObject.toString(radix)

参数解释:

radix: 标识数字的基数, 是2 ~ 36之间的整数. 若省略该参数, 则使用基数10. 但注意, 如果该参数是10以外的其他值, 则ECMAScript标准允许返回任意值.

举个例子:

 ```javascript
 let number = new Number(10);
 number.toString(16);
 ```

就是将10用16进制进行标识, 上面的例子打印的结果是'a'.

注意, radix 的最大可以标识36.

```javascript
let number = new Number(35);
number.toString(36);
```

打印的字母是'z'. 用这种方法我们可以标识剩下的所有字母

但是我们怎么利用这个 toString 方法呢？准确的说，我们该怎么生成一个 number 对象呢？还要拼出 new Number 吗？

其实都不用！这个时候，就彰显出了 JavaScript 隐式类型转换的优秀之处:

```javascript
35['toString'](36) //'z'
```

注意：到了这个时候，我们也不得不使用()了！

到此为止，我们已经可以表示出所有的字母了，有的很轻松的就表示出来，有的则有些麻烦，而且显示也很长，比如字母 p：

```javascript
25[[[+[] == +[]][0] + []][0][0]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][6] + [[] + []][0][[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][3]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][6]+[[][0] + []][0][1]+[[[] == []][0] + []][0][3]+[[+[] == +[]][0] + []][0][0]+[[+[] == +[]][0] + []][0][1]+[[][0] + []][0][0]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][3]+[[+[] == +[]][0] + []][0][0]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][6]+[[+[] == +[]][0] + []][0][1]][[[][0] + []][0][1]+[+[][0] + []][0][1]+[0[[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][3]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][6]+[[][0] + []][0][1]+[[[] == []][0] + []][0][3]+[[+[] == +[]][0] + []][0][0]+[[+[] == +[]][0] + []][0][1]+[[][0] + []][0][0]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][3]+[[+[] == +[]][0] + []][0][0]+[[][[[][0] + []][0][4]+[[][0] + []][0][5]+[[][0] + []][0][1]+[[][0] + []][0][2]] + []][0][6]+[[+[] == +[]][0] + []][0][1]]+[]][0][11]+[[][0] + []][0][3]]](27)
```





#### [重复，直到输入的是一个数字](https://zh.javascript.info/number#zhong-fu-zhi-dao-shu-ru-de-shi-yi-ge-shu-zi)

> 创建一个函数 `readNumber`，它提示输入一个数字，直到访问者输入一个有效的数字为止。
>
> 结果值必须以数字形式返回。
>
> 访问者也可以通过输入空行或点击“取消”来停止该过程。在这种情况下，函数应该返回 `null`。

```javascript
function readNumber() {
  let num;
  do {
    num = prompt('enter a number', 0);
  } while(!isFinite(num))
  if (num === null || num === '' || num === ' ') return null;
  
  return +num;
}

alert(`Read: ${readNumber()}`);


function readNumber() {
  let num = prompt('输入数字');
  
}
```



#### 舍入到具体的小数点多少位?

* 乘除法
* toFixed()  函数 [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) 将数字舍入到小数点后 `n` 位，并以字符串形式返回结果. 会向上或向下舍入到最接近的值，类似于 `Math.round`; 如果小数部分比所需要的短，则在结尾添加零

```javascript
//要将数字舍入到小数点后两位

//1.乘除法
let num = 1.23456;
Math.floor(num * 100) / 100; // 1.23456 -> 123.456 -> 123 -> 1.23

//2.toFixed(n)
let num = 12.34;
num.toFixed(1); //'12.3'

let num = 12.36;
num.toFixed(1); //'12.4'

let num = 12.34;
num.toFixed(5); //'12.34000'
```




> [前端应该知道的JavaScript浮点数和大数的原理 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/66949640)


**如何解决数字精度问题**

> [JavaScript 浮点数运算的精度问题 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/191395766)

1.类库

* 使用[bignumber](https://link.zhihu.com/?target=http%3A//mikemcl.github.io/bignumber.js/%23valueOf)这个库来解决
* Math.js
* decimal.js
* big.js

2.其他

* 整数, 使用String类型来取值或者传值,否则会丧失精度
* 浮点数
  * toFixed() 对结果进行四舍五入



#### 2.浮点数取整的几种方式

* Math.ceil() 向上取整
* Math.floor() 向下取整
* Math.random() 四舍五入取整
* parseInt() 剔除小数部分



### 判断数值

#### 正则判断数值
包括整数,小数,负数