---
aliases: 正则表达式,regexp
---


# 学习资源
* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp

* https://github.com/ziishaned/learn-regex/blob/master/translations/README-cn.md
* https://github.com/cdoco/common-regex
* https://github.com/qdlaoyao/js-regex-mini-book
* https://learn.microsoft.com/zh-cn/dotnet/standard/base-types/regular-expression-language-quick-reference?redirectedfrom=MSDN#Anchor_0
* https://regexlearn.com/zh-cn/learn  (!!!)
* [你是如何学会正则表达式的？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/48219401)


# 正则可视化工具
* [Regexper](https://regexper.com/)


## 是什么

正则表达式是一种匹配模式,要么匹配位置或要么[[202301181205a|匹配字符]]。在 JavaScript 中，正则表达式也是对象。


## 正则表达式创建的2种方式

### 字面量
```js
var re = /ab+c/
```

### 构造函数
调用RegExp对象的构造函数.

```js
let re = new RegExp('ab+c');
let re2  = new RegExp(/ab+c/)
```
注意,使用构造函数创建时,需要提供转义
```js
let re = new RegExp('\\w+')  //需要添加反斜杠来转义反斜杠
let re = /\w+/
```



## 断言

断言包括边界，它表示行和词的开头和结尾，以及以某种方式表示可能存在匹配的其他模式（包括前看、后看和条件表达式）。

边界类型断言

| Characters | Meaning                                                      |
| ---------- | ------------------------------------------------------------ |
| `^`        | 1. 匹配输入的开头。<br />2. 如果多行标志被设置为 "true"，也会在换行符之后立即匹配。例如，/^A/不匹配 "an A "中的 "A"，但匹配 "An A "的第一个 "A"。<br />3. 当 '`^`' 作为第一个字符出现在一个字符集合模式`[^]`时，它将会有不同的含义 |
| `$`        | 匹配输入的结束。如果多行标志被设置为 true，那么也匹配换行符前的位置 |
| `\b`       | 1. 匹配一个词的边界。这是指一个单词字符后面或前面没有另一个单词字符的位置，如一个字母和一个空格之间。<br />2. 请注意，一个匹配的词的边界不包括在匹配中。换句话说，一个匹配的单词边界的长度为零。 |



其他断言

| Characters | Meaning                      |
| ---------- | ---------------------------- |
| `x(?=y)`   | 先行断言: 只有当'x'后跟'y'才匹配'x'      |
| `x(?!y)`   | 非先行断言: 只有当'x'后面不跟着'y'才匹配'x'  |
| `(?<=y)x`  | 后行断言: 只有'x'前面是'y'时,匹配'x'     |
| `(?<!y)x`  | 非后行断言: 只有'x'前面不是'y'时候,才匹配'x' |



案例

使用`^`操作符匹配输入的开始

```javascript
let fruits = ["Apple", "Watermelon", "Orange", "Avocado", "Strawberry"];

// Select fruits started with 'A' by /^A/ Regex.
// Here '^' control symbol used only in one role: Matching beginning of an input.

let fruitsStartsWithA = fruits.filter(fruit => /^A/.test(fruit));
console.log(fruitsStartsWithA); //[ 'Apple', 'Avocado' ]

let fruitsStartsWithNotA = fruits.filter(furit => /^[^A]/.test(fruit));
console.log(fruitsStartsWithNotA); //[ 'Watermelon', 'Orange', 'Strawberry' ]
```

匹配一个单词边界

```javascript
let fruitsWithDescription = ["Red apple", "Orange orange", "Green Avocado"];

// Select descriptions that contains 'en' or 'ed' words endings:
let enEdSelection = fruitsWithDescription.filter(descr => /(en|ed)\b/.test(descr));

console.log(enEdSelection); // [ 'Red apple', 'Green Avocado' ]
```

前行断言

```javascript
console.log('First test'.match(regex)); // [ 'First' ]
console.log('First peach'.match(regex)); // null
console.log('This is a First test in a year.'.match(regex)); // [ 'First' ]
console.log('This is a First peach in a month.'.match(regex)); // null
```

非前行断言

```javascript
console.log(/\d+(?!\.))/g.exec('3.141'); //['141', index: 2, input: '3.141']
```

断言和范围中'?!'组合使用的不同含义 ????

```javascript
let orangeNotLemon = "Do you want to have an orange? Yes, I do not want to have a lemon!";

// Different meaning of '?!' combination usage in Assertions /x(?!y)/ and  Ranges /[^?!]/
let selectNotLemonRegex = /[^?!]+have(?! a lemon)[^?!]+[?!]/gi
console.log(orangeNotLemon.match(selectNotLemonRegex)); // [ 'Do you want to have an orange?' ]

let selectNotOrangeRegex = /[^?!]+have(?! an orange)[^?!]+[?!]/gi
console.log(orangeNotLemon.match(selectNotOrangeRegex)); // [ ' Yes, I do not want to have a lemon!' ]
```

后行断言

```javascript
let oranges = ['ripe orange A ', 'green orange B', 'ripe orange C',];

let ripe_oranges = oranges.filter( fruit => fruit.match(/(?<=ripe )orange/));
console.log(ripe_oranges); // [ 'ripe orange A ', 'ripe orange C' ]
```


## 字符串相关方法

### String.prototype.match()


### String.prototype.split()


### String.prototype.replace()


### String.prototype.search()



## 正则表达式方法






# 速查表


| JavaScript  正则表达式迷你书 |                                                        |
| -------------------- | ------------------------------------------------------ |
| 字面量                  |                                                        |
| 模式                   | 说明                                                     |
| 字母、数字                | 匹配字面量本身。比如  /f/，匹配字母 "f"。                              |
| \0                   | 匹配  NUL 字符。                                            |
| `\t`                 | 匹配水平制表符。                                               |
| `\v`                 | 匹配垂直制表符。                                               |
| `\n`                 | 匹配换行符。                                                 |
| `\r`                 | 匹配回车符。                                                 |
| `\f`                 | 匹配换页符。                                                 |
| `\xnn`               | 匹配拉丁字符。比如  `\xOA` 等价于 `\n`。                            |
| `\uxxxx`             | 匹配  Unicode 字符。比如 `\u2028` 匹配行终止符，`\u2029` 匹配段终止符。     |
| `\cX`                | 匹配  ctrl+X。比如 `\cI` 匹配 `ctrl+I`，等价于 `\t`。              |
| `[\b]`               | 匹配  Backspace 键（特殊记忆）。                                 |
| 字符组                  |                                                        |
| 模式                   | 说明                                                     |
| [abc]                | 匹配  "a"、"b"、"c" 其中任何一个字符。                              |
| [a-d1-4]             | 匹配  "a"、"b"、"c"、"d"、"1"、"2"、"3"、"4" 其中任何一个字符。          |
| `[^abc]`             | 匹配除了  "a"、"b"、"c" 之外的任何一个字符。                           |
| `[^a-d1-4]`          | 匹配除了  "a"、"b"、"c"、"d"、"1"、"2"、"3"、"4" 之外的任何一个字符。       |
| .                    | 通配符，匹配除了少数字符（`\n`）之外的任意字符。                             |
| `\d`                 | 匹配数字，等价于  [0-9]。                                       |
| `\D`                 | 匹配非数字，等价于  `[^0-9]`                                    |
| `\w`                 | 匹配单词字符，等价于  [a-zA-Z0-9_]。                              |
| `\W`                 | 匹配非单词字符，等价于  [^a-zA-Z0-9_]。                            |
| `\s`                 | 匹配空白符，等价于  `[ \t\v\n\r\f]`。                            |
| `\S`                 | 匹配非空白符，等价于  `[^ \t\v\n\r\f]`。                          |
| 量词                   |                                                        |
| 模式                   | 说明                                                     |
| {n,m}                | 连续出现  n 到 m 次。贪婪模式。                                    |
| {n,}                 | 至少连续出现  n 次。贪婪模式。                                      |
| {n}                  | 连续出现  n 次。贪婪模式。                                        |
| ?                    | 等价于  {0,1}。贪婪模式。                                       |
| +                    | 等价于  {1,}。贪婪模式。                                        |
| *                    | 等价于  {0,}。贪婪模式。                                        |
| {n,m}?               | 连续出现  n 到 m 次。惰性模式。                                    |
| {n,}?                | 至少连续出现  n 次。惰性模式。                                      |
| {n}?                 | 连续出现  n 次。惰性模式。                                        |
| `??`                 | 等价于  {0,1}?。惰性模式。                                      |
| `+?`                 | 等价于  {1,}?。惰性模式。                                       |
| `\*?`                | 等价于  {0,}?。惰性模式。                                       |
| 位置                   |                                                        |
| 模式                   | 说明                                                     |
| ^                    | 匹配开头的位置，当正则有修饰符  m 时，表示匹配行开头位置。                        |
| $                    | 匹配结尾的位置，当正则有修饰符  m 时，表示匹配行结尾位置。                        |
| `\b`                 | 匹配单词边界，即，`\w 与 \W`、`^ 与 \w`、`\w 与 $` 之间的位置。            |
| `\B`                 | 匹配非单词边界，即，`\w 与 \w`、`\W 与 \W`、^ 与 `\W`，`\W` 与 $ 之间的位置。 |
| (?=abc)              | 匹配 "abc" 前面的位置，即此位置后面匹配 "abc"。                         |
| (?!abc)              | 匹配非 "abc" 前面的位置，即此位置后面不匹配 "abc"。                       |
| 括号的作用                |                                                        |
| 模式                   | 说明                                                     |
| (ab)                 | 捕获型分组。把  "ab" 当成一个整体，比如 (ab)+ 表示 "ab"  至少连续出现一次。       |
| (?:ab)               | 非捕获型分组。与  (ab) 的区别是，它不捕获数据。                            |
| `(good\|nice)`       | 捕获型分支结构。匹配  "good" 或 "nice"。                           |
| `(?:good\|nice)`     | 非捕获型分支结构。与  `(good\|nice)` 的区别是，它不捕获数据。                |
| `\num`               | 反向引用。比如  `\2`，表示引用的是第二个括号里的捕获的数据。                      |
| 修饰符                  |                                                        |
| 符号                   | 说明                                                     |
| g                    | 全局匹配，找到所有满足匹配的子串。                                      |
| i                    | 匹配过程中，忽略英文字母大小写。                                       |
| m                    | 多行匹配，把  ^ 和 $  变成行开头和行结尾。                              |
| String相关实例方法         |                                                        |
| 属性                   | 方法作用说明                                                 |
| search               | 返回正则匹配到的第一个子串在目标字符串中的下标位置。                             |
| split                | 以正则匹配到的子串，对目标字符串进行切分。返回一个数组。                           |
| match                | 对目标字符串执行正则匹配操作，返回的匹配结果数组中包含具体的匹配信息。                    |
| replace              | 对目标字符串进行替换操作。正则是其第一个参数。返回替换后的字符串。                      |
| replace第二个参数中的特殊字符   |                                                        |
| 字符                   | 说明                                                     |
| $1,$2,…,$99          | 匹配第  1-99 个分组里捕获的文本                                    |
| `$&`                 | 匹配到的子串文本                                               |
| `$\\`                | 匹配到的子串的左边文本                                            |
| $'                   | 匹配到的子串的右边文本                                            |
| `\$\$`               | 美元符号                                                   |
| RegExp相关实例方法         |                                                        |
| 属性                   | 方法作用说明                                                 |
| test                 | 判断目标字符串中是否有满足正则匹配的子串。返回布尔值。                            |
| exec                 | 比 match 更强大的正则匹配操作。返回结果与 match 一致。                     |
| RegExp静态属性           |                                                        |
| 属性                   | 方法作用说明                                                 |
| $1,…,$9              | 最近一次第  1-9 个分组捕获的数据。                                   |
| input                | 最近一次目标字符串，可以简写成  $_                                    |
| lastMatch            | 最近一次匹配的文本，可以简写成  $&                                    |
| lastParen            | 最近一次捕获的文本，可以简写成  $+                                    |
| leftContext          | 目标字符串中  lastMatch 之前的文本，可以简写成 $`                       |
| rightContext         | 目标字符串中  lastMatch 之后的文本，可以简写成 $'                       |
来源
JavaScript 正则表达式迷你书 > 速查表


# 实例
### 匹配汉字的最佳方案

> [[JS 0-1Grammar and types#Unicode字符属性转义序列]]

```js
'abc汉字'.replace(/\p{Unified_Ideograph}/ug, '');  // return: 'abc'
```



### 检查路径是否是相对路径
正则表达式中的`'\\'`代表一个`'\'`反斜杠字符。这个正则表达式中的`'\\/'`代表匹配一个反斜杠'/'字符。
`[\\/]`的正则含义就是匹配`\`或`/`其中一个.
```js
const isRelative = path => !/^([a-z]+:)?[\\/]/i.test(path)
```

#### 检查设备是否是IOS
>https://stackoverflow.com/questions/9038625/detect-if-device-is-ios

```js
[
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
```