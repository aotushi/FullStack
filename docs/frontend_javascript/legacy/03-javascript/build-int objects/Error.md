---
aliases:
  - Error
---



#### Error概述
JS提供了Error类,通常使用Error对象或其子类作为throw抛出的错误.使用Error对象的一个主要原因是创建Error对象时,该对象可以捕获javascript栈状态,如果异常未捕获,则会显示包含错误消息的栈跟踪信息 [[202301302098c4|Error.prototype.stack]],而这对排查错误很有用(栈跟踪信息会展示创建Error对象的地方,而非throw语句抛出的地方. 如果始终在抛出前创建该对象, 如throw new Error(),则不会有困惑).

当runtime错误产生时候会抛出Error对象,也能被用做用户定义异常的对象.
Error对象是一个序列化对象,所以它可以被`structorClone()`深克隆,或使用`postMessage()`在`Works`间拷贝.


#### Error构造函数
Error构造函数创建一个error对象

##### Syntax
```js
new Error()
new Error(message)
new Error(message, options)
new Error(message, fileName)
new Error(message, fileName, lineNumber)

Error()
Error(message)
Error(message, options)
Error(message, fileName)
Error(message, fileName, lineNumber)

```

 >Error() can be called with or without new. Both create a new Error instance.


##### parameters

`message` <span style="border:1px solid;border-radius:4rem;padding:0.125rem 0.375rem;white-space:nowrap;font-size:10px;">optional</span>
人类可读的错误描述.(就是字符串的语句)

`options` <span style="border:1px solid;border-radius:4rem;padding:0.125rem 0.375rem;white-space:nowrap;font-size:10px;">optional</span>
一个对象,有如下属性:
* `cause` 可选: 
	* 一个来表明错误详细原因的值
	* 使用场景: 需要捕获并重新抛出一个更详细或更有用错误信息时


`fileName` <span style="border:1px solid;border-radius:4rem;padding:0.125rem 0.375rem;white-space:nowrap;font-size:10px;">optional</span>  <abbr title="Non-standard. Check cross-browser support before using" >NONStandard</abbr>
引起错误的文件的路径,从`fileName`属性得来. 默认展示包含调用Error构造函数代码的文件名.



`lineName` <span style="border:1px solid;border-radius:4rem;padding:0.125rem 0.375rem;white-space:nowrap;font-size:10px;">optional</span>  <abbr title="Non-standard. Check cross-browser support before using" >NONStandard</abbr>
引发错误的文件的行号,反映在`lineNumber`属性中. 默认为包含`Error()`构造函数调用的行号.


#### Error实例属性

[[202301302098c1|Error.prototype.message]]
用户创建的Error对象,作为构造函数的第一个参数的字符串

[[202301302098c2|Error.prototype.name]]
由构造函数决定

[[202301302098c3|Error.prototype.cause]]
声明当前错误被抛出的原因,通常是另一个捕获的错误.
作为用户创建的Error对象, 是构造函数第二个参数`cause`属性提供的值

Error.prototype.fileName
非标准的Mozilla属性

Error.prototype.lineNumber
非标准的Mozilla属性

Error.prototype.columnNumber
非标准的Mozilla属性

[[202301302098c4|Error.prototype.stack]]
栈追踪的非标准属性



#### 子类
除了Error类,JS还定义了它的子类[[202301302098a|Error子类]],以便触发ECMAscript定义的特殊类型的错误.


### ES 2022-Error cause

> cause property indicating the cause of an error. [📕](https://github.com/tc39/proposal-error-cause)

```
const actual = new Error('a better error!', { cause: 'Error cause' });

actual instanceof Error; // true
actual.cause; // 'Error cause'





try {
  maybeWorks();
} catch (err) {
  throw new Error('maybeWorks failed!', { cause: err });
}
```





### 自定义子类

[[202301181407|类的继承]]

以便更好封装自己程序的错误信息.自定义对的可以不限于message和name属性.

例如,使用HTTP请求,可能需要定义一个HTTPError类,这个类通过status属性保存请求失败对应的HTTP状态码.
```js
class HTTPError extends Error {
	constructor(status, statusText, url) {
		super(`${status} ${statusText}: ${url}`)
		this.status = status
		this.statusText = statusText
		this.url = url
	}

	get name() {return 'HTTPError'}
}

let error = new HTTPError(404, 'Not Found', 'http://exmaple.com')
error.status //404
error.message //'404 Not Found: http://example.com'
error.name    //HTTPError
```


#### 来源
微信读书-javascript权威指南(原书第七版)-11.5




#### 错误类型

* [[202301302098a1|语法错误]] SyntaxError
* [[202301302098a2|类型错误]] TypeError
* 范围错误 RangeError
* eval错误 EvalError
* [[202301302098a3|引用错误]] ReferenceError
* URI错误 URIError
* AggregateError 
* InternalError

##### 来源
[前端中 try-catch 捕获不到哪些异常和错误](https://www.xiabingbao.com/post/error/try-catch-cant-error.html)
[MDN Error types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#error_types)




#### 语法错误
通常指代码语句写的有问题,浏览器无法对其进行解析
例如:
```js
const a=;
console.log(a); // Uncaught SyntaxError: Unexpected token ';
```

##### 来源

[前端中 try-catch 捕获不到哪些异常和错误](https://www.xiabingbao.com/post/error/try-catch-cant-error.html#2.1+%E8%AF%AD%E6%B3%95%E9%94%99%E8%AF%AF%EF%BC%88SyntaxError%EF%BC%89)



#### 类型错误
一般有两种情况:
* 操作符使用在了不适当的类型变量上,例如对数字类型使用concat操作
* 操作的变量遇到不可预期的null或undefind值

例如:
```js
const obj = {};
obj.concat([1]); // Uncaught TypeError: obj.concat is not a function

const a = null;
a.nickname; // Uncaught TypeError: Cannot read property 'nickname' of null
```

##### 来源
[前端中 try-catch 捕获不到哪些异常和错误](https://www.xiabingbao.com/post/error/try-catch-cant-error.html#2.2+%E7%B1%BB%E5%9E%8B%E9%94%99%E8%AF%AF%EF%BC%88TypeError%EF%BC%89)





#### 引用错误
表示试图访问一个未经声明的变量
例如:
```js
console.log(nick); //Uncaught ReferenceError: nick is not defined
```


#### 来源

[前端中 try-catch 捕获不到哪些异常和错误](https://www.xiabingbao.com/post/error/try-catch-cant-error.html#2.5+%E5%BC%95%E7%94%A8%E9%94%99%E8%AF%AF%EF%BC%88ReferenceError%EF%BC%89)




#### Error.prototype.message

Error实例的message数据属性(data prototype)[[202301180942#1. 数据属性]]是报错的可读描述.

**属性特性**

| Name         | value    |
| ------------ | -------- |
| Value        | 默认为空 |
| Writable     | yes      |
| Enumerable   | No       |
| Configurable | yes      |




**描述**
此属性包含了错误的简短描述,如果其可访问或已被设置. message和name组合被`Error.prototype.toString()`方法用来创建错误的字符串表示.

通常,`message`属性是空字符串,但通过将描述信息作为Error构造函数的第一个参数来为实例重写此行为.


#### Error.prototype.name

`Error.prototype`的name数据属性被所有Error实例所共享.
它代表错误类型的名称. 对`Error.prototype.name`来说, 它初始值是`Error`.
子类例如 `TypeError` 和 `SyntaxError`提供他们自己的name属性.


**属性特性**

| Name         | value    |
| ------------ | -------- |
| name         | 字符串.对`Error.prototype.name`,初始值是`Error` |
| Writable     | yes      |
| Enumerable   | No       |
| Configurable | yes      |




**描述**
默认情况下, Error的实例也被给予`Error`的name. Error.prototype.toString（）方法使用name属性和message属性来创建错误的字符串表示形式。



#### Error.prototype.cause
一个Error实例的`cause`数据属性表明错误最初的具体原因.(specific original cause of error)
当捕获或重新抛出带有更具体或有用的错误信息的错误,以便仍能使用最初的错误时使用.



**属性特性**

| Name         | value                                           |
| ------------ | ----------------------------------------------- |
| cause        | 在`options.cause`参数中传递给Error构造函数的值.可能没声明 |
| Writable     | yes                                             |
| Enumerable   | No                                              |
| Configurable | yes                                             |




**描述**
`cause`的值可以是任意类型. 不应假设捕获的错误拥有一个`Error`作为它的`cause`, 同样情况下也不能保证`catch`语句绑定的变量是一个`Error`.

以下提供结构化数据作为错误原因(error cause)案例,展示non-error被谨慎提供作为原因的案例.

**案例**
Rethrowing an error with a cause
```js
try {
	connectToDatabase()
} catch(err) {
	throw new Error('Connecting to database failed.', {cause: err})
}
```
上面catch捕获的err是Error的子类[[202301302098a3|ReferenceError]]


提供结构化数据作为error cause
为人类阅读编写的错误信息,可能对机器解析不太合适. 因为很容易受到重写或标点变动的影响,这可能会破坏为理解它们而编写的现有解析.  ???
所以从函数中抛出错误时, 作为一个人类可读错误信息的代替,你可以为机器解析,提供结构化数据的原因.

```js
function makeRSA(p, q) {
  if (!Number.isInteger(p) || !Number.isInteger(q)) {
    throw new Error('RSA key generation requires integer inputs.', {
      cause: { code: 'NonInteger', values: [p, q] },
    });
  }
  if (!areCoprime(p, q)) {
    throw new Error('RSA key generation requires two co-prime integers.', {
      cause: { code: 'NonCoprime', values: [p, q] },
    })
  }
  // rsa algorithm…
}
```



### Error.prototype.stack

#### 概述

^e65c5b

*非标准*  ^40892e
该属性值是一个多行字符串,包含创建错误对象时JS调用栈的栈跟踪信息.在捕获到异常错误时,可以将这个属性的信息作为日志收集起来. ^96c5a3

Error实例的非标准`stack`属性提供哪些函数被调用,调用顺序,调用哪行和文件及调用参数的追踪.
stack字符串从最近的调用到较早的,然后返回到原始的全局作用域调用.



#### **属性特性**

| Name         | value                                                     |
| ------------ | --------------------------------------------------------- |
| stack        | a string |
| Writable     | yes                                                       |
| Enumerable   | No                                                        |
| Configurable | yes                                                       |

因为是非标准属性,所以根据安装位置不同执行不同.
* 在FireFox, 它是`Error.prototype`上的访问器属性(accessor property)[[202301180942#2. 访问器属性 getter/setter]]
* 在Chrome和Safari中, 它是在Error实例上带描述的数据属性


#### **描述**
每一步将被新的一行的隔开,行的第一部分是函数名称(如果从全局作用域中并非一个调用),接着是'@'符号,文件位置(除当函数是error构造函数作为错误被抛出),冒号和行号(如果有文件位置).





#### Error.prototype.toString()
返回代表指定Error对象的字符串.其格式为: name属性的值+冒号+空格+message属性构成. 重写了Object.prototype.toString方法 [[202301170827#2.Object.prototype.toString]] 
```js
Error.prototype.toString = function () {
  if (
    this === null ||
    (typeof this !== "object" && typeof this !== "function")
  ) {
    throw new TypeError();
  }
  let name = this.name;
  name = name === undefined ? "Error" : `${name}`;
  let msg = this.message;
  msg = msg === undefined ? "" : `${msg}`;
  if (name === "") {
    return msg;
  }
  if (msg === "") {
    return name;
  }
  return `${name}: ${msg}`;
};

```


使用
```js
const e1 = new Error("fatal error");
console.log(e1.toString()); // "Error: fatal error"

const e2 = new Error("fatal error");
e2.name = undefined;
console.log(e2.toString()); // "Error: fatal error"

const e3 = new Error("fatal error");
e3.name = '';
console.log(e3.toString()); // "fatal error"

const e4 = new Error("fatal error");
e4.name = "";
e4.message = undefined;
console.log(e4.toString()); // ""

const e5 = new Error("fatal error");
e5.name = "hello";
e5.message = undefined;
console.log(e5.toString()); // "hello"

```
