---
alias: Promise
---


### 资料

https://github.com/wangfupeng1988/js-async-tutorial


# 异步编程背景

[[01_HTML&CSS&JS&TS#事件循环]]



# Promises/A+

## Promise使用原因

* 指定回调函数的方式更加灵活
  * 旧的:必须在启动异步任务前指定(实际生活中订阅必须在活动开始之前,而promise更加灵活,可随时添加处理程序.)
  * promise:启动异步任务->返回promise对象->给promise对象绑定回调函数(甚至可以在异步任务结束后指定多个)
* 支持链式调用,解决回调地域的问题
  * 回调地域:回调函数嵌套调用,外部回调函数异步执行的结果是嵌套的回调执行的条件
  * 终极解决方案:async/await



# Promise介绍

## 概述

> Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。
>
> 所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。
> 从语法上说，Promise 是一个对象，可以获取异步操作的消息。

### 类比

> 你是一位歌手, 你承诺（promise）会在单曲发布(结果)的第一时间发给他们。
> 你给了粉丝们一个列表。他们可以在上面填写他们的电子邮件地址，以便当歌曲发布后，让所有订阅了的人能够立即收到。
> 即便遇到不测，例如录音室发生了火灾，以致你无法发布新歌，他们也能及时收到相关通知



## 作用

ES6推出的新的更好的异步编程解决方案(相对于纯回调的方式)

- 在异步操作启动前或完成后, 再指定回调函数得到异步结果
- 解决嵌套回调的回调地狱问题  ---promise链式调用
- 可以处理多个异步请求并发. `Promise.all`的出现让我们可以更加方便的处理多个任务完成时在进行处理的逻辑。





## 特点和缺点

### **Promise对象有两个特点:**

* <u>对象的状态不受影响</u>
  * Promise对象代表一个异步操作,有3种状态: pending,fulfilled,rejected
  * 只有异步操作的结果,可以决定当前是哪一种状态,任何其他操作均无效.
* <u>一旦状态改变,就不会再发生变化.</u>
  * Promise状态改变,只有两种可能.从pending->fulfilled或从pending->rejected
  * 如果状态已改变(称为resolved,已定型).再对Promise对象添加回调,也会立即得到这个结果.

### **Promise的缺点:**

* 无法取消Promise,一旦建立就会立即执行,无法中途取消.
* 如果不设置回调,Promise内部抛出的错误,不会反应到外部.
* 当处于pending状态时,无法得知目前进展到哪一步(刚开始还是即将完成)
* 单一值. 

Promise只能有一个完成值或拒绝原因,而在实际使用中,往往需要传递多个值,一般做法是构造一个对象或数组,然后再传递,then中获得这个值后,又会进行取值赋值的操作,每次封装和解封会让代码变的笨重. 建议使用ES6的解构赋值.

```javascript
Promise.all([Promise.resolve(1), Promise.resolve(2)])
.then(([x, y]) => {
  console.log(x, y);
})
```



## 基本用法

ES6 规定，`Promise`对象是一个构造函数，用来生成`Promise`实例。

### 构造函数语法:

```javascript
let promise = new Promise(function (resolve, reject) {
  //executor (生产者代码, 也就是'歌手')
  console.log('Promise')
  resolve()
})

promise.then(function() {
	console.log('resolved')
})
```

## 执行过程


## 执行器函数

> 生产者代码, 歌手

`Promise`构造函数接收一个函数作为参数，其被称为**执行器函数(executor)**,当`new Proimse`被创建后会立即调用(executor会自动运行),然后等待执行resolve()函数或者reject()函数来确定Promise的最终状态.//(executor就是歌手)

该函数的两个参数分别是`resolve`和`reject`。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。
>在接收的函数中处理异步请求，然后判断异步请求的结果，
>	如果结果为“true”，则表示异步请求执行成功，调用resolve()函数，resolve()函数一旦执行，Promise的状态就从pending变为fulfilled；
>	如果结果为“false”，则表示异步请求执行失败，调用reject()函数，reject()函数一旦执行，Promise的状态就从pending变为rejected。
>	resolve()函数和reject()函数可以传递参数，作为后续.then()函数或者.catch()函数执行时的数据源


当executor获得了结果,无论是早还是晚,它应该调用以下回调之一:
* resolve() / resolve(value)  -- 如果任务成功完成并带有结果value
* reject() / reject(error)    -- 如果出现了error, error即为error对象

**`resolve`函数的作用**，将`Promise`对象的状态从<span style="background:#ccc">“未完成”变为“成功”</span>（即从 pending 变为 fulfilled），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；

**`reject`函数的作用**，将`Promise`对象的状态从<span style="background:#ccc">“未完成”变为“失败”</span>（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

与最初的 “pending” promise 相反，一个 resolved 或 rejected 的 promise 都会被称为 <span style="background:#ccc">“settled”。</span>

```javascript
//成功完成任务

let promise = new Promise((resolve, reject) => {
  setTimeout(()=>resolve('done'), 1000)
});

//失败的任务
let promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('ddd')), 1000)
})
```



## 返回值

由`new Promise`构造函数<span style="color:blue">返回的`promise`对象</span>具有以下内部属性:

* `state`   
  * 最初是`pending`, 
  * 然后在 `resolve` 被调用时变为 `"fulfilled"`，
  * 或者在 `reject` 被调用时变为 `"rejected"`

* `result` 
  * 最初是 `undefined`，
  * 然后在 `resolve(value)` 被调用时变为 `value`，
  * 或者在 `reject(error)` 被调用时变为 `error`。


所以，executor 最终将 `promise` 移至以下状态之一:

<svg xmlns="http://www.w3.org/2000/svg" width="512" height="246" viewBox="0 0 512 246"><defs><style>@import url(https://fonts.googleapis.com/css?family=Open+Sans:bold,italic,bolditalic%7CPT+Mono);@font-face{font-family:'PT Mono';font-weight:700;font-style:normal;src:local('PT MonoBold'),url(/font/PTMonoBold.woff2) format('woff2'),url(/font/PTMonoBold.woff) format('woff'),url(/font/PTMonoBold.ttf) format('truetype')}</style></defs><g id="promise" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g id="promise-resolve-reject.svg"><path id="Rectangle-1" fill="#FBF2EC" stroke="#DBAF88" stroke-width="2" d="M1 91h182v70H1z"/><text id="new-Promise(executor" fill="#7E7C7B" font-family="PTMono-Regular, PT Mono" font-size="14" font-weight="normal"><tspan x="2" y="82">new Promise(executor)</tspan></text><text id="state:-&quot;pending&quot;-res" fill="#AF6E24" font-family="PTMono-Regular, PT Mono" font-size="14" font-weight="normal"><tspan x="13" y="115.432">state: "pending"</tspan> <tspan x="13" y="135.432">result: undefined</tspan></text><path id="Line" fill="#C06334" fill-rule="nonzero" d="M196.51 134.673l.908.419 103.284 47.574 2.51-5.45L313 189.433l-15.644.5 2.509-5.45-103.283-47.574-.909-.418.837-1.817z"/><path id="Line-Copy" fill="#C06334" fill-rule="nonzero" d="M297.38 56L313 57l-10.173 11.896-2.335-5.528-103.103 43.553-.921.39-.778-1.843.92-.39 103.104-43.552-2.334-5.527z"/><text id="resolve(value)" fill="#C06334" font-family="PTMono-Regular, PT Mono" font-size="14" font-weight="normal" transform="rotate(-23 244.39 72.63)"><tspan x="185.59" y="77.13">resolve(value)</tspan></text><text id="reject(error)" fill="#C06334" font-family="PTMono-Regular, PT Mono" font-size="14" font-weight="normal" transform="rotate(25 251.634 150.64)"><tspan x="197.034" y="155.141">reject(error)</tspan></text><path id="Rectangle-1-Copy" fill="#FBF2EC" stroke="#478964" stroke-width="2" d="M323 10h182v64H323z"/><text id="state:-&quot;fulfilled&quot;-r" fill="#478964" font-family="PTMono-Regular, PT Mono" font-size="14" font-weight="normal"><tspan x="338" y="34.432">state: "fulfilled"</tspan> <tspan x="338" y="54.432">result: value</tspan></text><path id="Rectangle-1-Copy-3" fill="#FEF1F0" stroke="#D35155" stroke-width="2" d="M323 177h182v64H323z"/><text id="state:-&quot;rejected&quot;-re" fill="#AF6E24" font-family="PTMono-Regular, PT Mono" font-size="14" font-weight="normal"><tspan x="338" y="201.432">state: "rejected"</tspan> <tspan x="338" y="221.432">result: error</tspan></text></g></g></svg>



## 总结

1.**只能有一个结果或一个 error**
* executor 只能调用一个 `resolve` 或一个 `reject`。
* `resolve/reject` 只需要一个参数（或不包含任何参数），并且将忽略额外的参数。
* 任何状态的更改都是最终的。所有其他的再对 `resolve` 和 `reject` 的调用都会被忽略：

```javascript
let promise = new Promise((resolve, reject) => {
  resolve('done');
  
  reject(new Error('...')); //被忽略
  setTimeout(() => resolve('...')); //被忽略
})
```

2.**以** `Error` **对象 reject**
* `reject`可以使用任何类型的参数来完成（就像 `resolve` 一样）。建议使用 `Error` 对象（或继承自 `Error` 的对象）

3.**Resolve/reject 可以立即进行**
* executor 通常是异步执行某些操作，并在一段时间后调用 `resolve/reject`，但这不是必须的.我们还可以立即调用 `resolve` 或 `reject`
```javascript
let promise = new Promise(function(resolve, reject) {
  // 不花时间去做这项工作
  resolve(123); // 立即给出结果：123
});
```

4.`state` **和** `result` **都是内部的**
* Promise 对象的 `state` 和 `result` 属性都是内部的。我们无法直接访问它们。
* 但我们可以对它们使用 `.then`/`.catch`/`.finally` 方法。



## then catch finally

> 消费者代码 歌手的粉丝

### 生产者代码和消费者代码关系

* Promise对象充当的是 executor（“生产者代码”或“歌手”）和消费函数（“粉丝”）之间的连接，后者将接收结果或 error。
* 可以通过使用 `.then`、`.catch` 和 `.finally` 方法为消费函数进行注册。(为粉丝进行订阅)



##### then

<u>概述</u>

* Promise在原型属性上添加了一个then()函数，表示在Promise实例状态改变时执行的回调函数。.
* `then`方法可以接受两个回调函数作为参数,回调函数都接受`Promise`对象传出的值作为参数。
  * 第一个回调函数是`Promise`对象的状态变为`resolved`时调用，
  * 第二个回调函数是`Promise`对象的状态变为`rejected`时调用。
* 这两个参数都是可选的，不一定都要提供.可以按照任意组合的方式来监听
* then()函数返回的是一个新Promise实例，因此可以使用链式调用then()函数，在上一轮then()函数内部return的值会作为下一轮then()函数接收的参数值。
* 基于then()函数的链式调用写法，可以解决“回调地狱”问题。

```javascript
promise.then(function(value) {
  //...
}, function(error) {
  //...
})
```



```javascript
let promise = readFile('example.txt');

promise.then(function(contents) {
  //完成
  console.log(contents);
}, function(err) {
  //拒绝
  console.log(err.message);
});

promise.then(function(contents) {
  //完成
  console.log(contents);
});

promise.then(null, function(err) {
  //拒绝
  console.log(err.message);
})
```

上面这3次then()调用操作的是同一个Promise。第一个同时监听了执行完成和执行被拒；第二个只监听了执行完成，错误时不报告；第三个只监听了执行被拒，成功时不报告。





### catch()

<u>概述</u>

* catch()方法，相当于只给其传入拒绝处理程序的then()方法
* 使用`null`作为第一个参数: `then(null, errorHandleingFunction)`
* 或使用: `.catch(errorHandlingFunction)`, 其`.catch(f)`调用时`.then(null, f)`的完全模拟,它只是一个简写形式.



```javascript
promise.catch(function(err) {
  //拒绝
  console.log(err.message);
});

//与以下调用相同
promise.then(null, function(err) {
  //拒绝
  console.log(err.message);
})
```



<u>执行器错误</u>

如果执行器内部抛出一个错误，则Promise的拒绝处理程序就会被调用.<span style="color:blue">**每个执行器中都隐含一个try-catch块**</span>，所以错误会被捕获并传入拒绝处理程序. 例如

```javascript
let promise = new Promise(function(resolve, reject) {
  throw new Error('Explosion');
});

promise.catch(function(error) {
  console.log(error.message); //'Explosion'
})

//以上等价于
let promise = new Promise(function(resolve, reject) {
  try {
    throw new Error('Explosion');
  } catch(err) {
    reject(err);
  }
});

promise.catch(function(error) {
  console.log(error.message); //Explosion
})
```

为了简化这种常见的用例，执行器会捕获所有抛出的错误，但只有当拒绝处理程序存在时才会记录执行器中抛出的错误，否则错误会被忽略掉.







### then() + catch()

* then()方法和catch()方法一起使用才能更好地<u>处理异步操作结果</u>。

* 如果不给Promise添加拒绝处理程序，那所有失败就自动被忽略.

* 如果一个Promise处于已处理状态，在这之后添加到任务队列中的处理程序仍将执行。所以无论何时你都可以添加新的完成处理程序或拒绝处理程序，同时也可以保证这些处理程序能被调用。

```javascript
let promise = readFile('example.txt');

//最初的完成处理程序
promise.then(function(contents) {
  console.log(contents);
  
  //现在又添加一个
  promise.then(function(contents) {
    console.log(contents);
  })
})
```

**注意**

每次调用then()方法或catch()方法都会<span style="color:blue">创建一个新任务</span>，当Promise被解决（resolved）时执行。

<span style="color:blue">这些任务最终会被加入到一个为Promise量身定制的独立队列中</span>，这个任务队列的具体细节对于理解如何使用Promise而言不重要，通常你只要理解任务队列是如何运作的就可以了。



### finally

像常规 `try {...} catch {...}` 中的 `finally` 子句一样，promise 中也有 `finally`。

* `.finally(f)` 调用与 `.then(f, f)` 类似，在某种意义上，`f` 总是在 promise 被 settled 时运行：即 promise 被 resolve 或 reject。
* `finally` 是执行清理（cleanup）的很好的处理程序（handler），例如无论结果如何，都停止使用不再需要的加载指示符（indicator）。

```javascript
new Promise((resolve, reject) => {
  //do something
}).finally(() => stop loading indicator)
 // 所以，加载指示器（loading indicator）始终会在我们处理结果/错误之前停止
	.then(res => show res, err => show err)
```





#### **finally 与 then 的区别**

* `finally` 处理程序（handler）没有参数。在 `finally` 中，我们不知道 promise 是否成功。
* `finally` 处理程序将 <u>结果和 error</u> 传递给下一个处理程序。




## 使用Promise进行错误处理

当一个 promise 被 reject 时，控制权将移交至最近的 rejection 处理程序（handler）。

### 隐式try...catch

Promise 的执行者（executor）和 promise 的处理程序（handler）周围有一个“隐式的 `try..catch`”。如果发生异常，它（译注：指异常）就会被捕获，并被视为 rejection 进行处理。

下面两段代码工作上完全相同:

```javascript
//1
new Promise((resolve, reject) => {
  throw new Error('Whoops');
}).catch(alert)
```

```javascript
//2
new Promise((resolve, reject) => {
  reject(new Error('Whoops'));
}).catch(alert);
```

### **处理范围**

* executor周围
* executor函数的处理程序(then, catch)

在 executor 周围的“隐式 `try..catch`”自动捕获了 error，并将其变为 rejected promise。

如果我们在 `.then` 处理程序（handler）中 `throw`，这意味着 promise 被 rejected，因此控制权移交至最近的 error 处理程序（handler）

```javascript
new Promise((resolve, reject) => {
  resolve('ok');
}).then(res => {
  throw new Error('whoops');
}).catch(alert);//Error: Whoops!
```



如果是多个报错的话, 只会处理从顺序上出现的第一个错误

```javascript
Promise.resolve(1)
.then(() => a())
.then(() => b())
.catch(alert) //ReferenceError: a is not defined

Promise.reject(1)
.then(() => a())
.then(() => b())
.catch(alert) //1
```

### **再次抛出**

对于 promise 来说, 错误如果无法处理它，可以将其再次抛出,这也是可以的。

在 `.catch` 中 `throw`，那么控制权就会被移交到下一个最近的 error 处理程序（handler）。如果我们处理该 error 并正常完成，那么它将继续到最近的成功的 `.then` 处理程序（handler）。

catch 正常处理错误(返回除错误之外的其他值: promise或其他任意)

```javascript
//执行流: catch=>then
new Promise((resolve, reject) => {
  throw new Error("Whoops");
}).catch((err) => alert('aaa'))
.then(() => alert('success')); //success
```

catch 抛出错误

```javascript
//执行流 catch => catch

new Promise((resolve, reject) => {
  throw new Error('Whoops');
})
.catch(err => {throw err}) //必须只为{},否则识别不了throw
.then()  //不走这一步,写不写没关系,最好写上
.catch(alert); //弹出报错信息: Error: Whoops
```



### **未处理的rejection**

当一个error没有被处理会发生什么? 例如，我们忘了在链的尾端附加 `.catch`

```javascript
new Promise(function() {
  noSuchFunction(); // 这里出现 error（没有这个函数）
})
  .then(() => {
    // 一个或多个成功的 promise 处理程序（handler）
  }); // 尾端没有 .catch！
```

如果出现 error:

* promise 的状态将变为 “rejected”，
* 然后执行应该跳转至最近的 rejection 处理程序（handler）。
* 但上面这个例子中并没有这样的处理程序（handler）。因此 error 会“卡住（stuck）”。没有代码来处理它。



对于在 promise 中未被处理的 rejection，JavaScript 引擎会跟踪此类 rejection，在这种情况下会生成一个全局的 error, 你可以在控制台（console）中看到。

在浏览器中，我们可以使用 `unhandledrejection` 事件来捕获这类 error：

```javascript

window.addEventListener('unhandledrejection', function(event) {
  // 这个事件对象有两个特殊的属性：
  alert(event.promise); // [object Promise] - 生成该全局 error 的 promise
  alert(event.reason); // Error: Whoops! - 未处理的 error 对象
})

Promise.reject(3);
```

其他文章: 

> unhandledrejection 处理没有显式捕获Promise异常
>
> https://github.com/justjavac/the-front-end-knowledge-you-may-not-know/issues/7
>
> Chrome现在均无触发



### Fetch错误处理示例

比较完善的fetch错误处理

```javascript
class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

function loadJson(url) {
  return fetch(url)
  	.then(response => {
    	if (response.status === 200) {
        return response.json();
      } else {
        throw new HttpError(response);
      }
  })
}

loadJson('no-such-user.json')
.catch(alert); //HttpError: 404
```



从 GitHub 加载给定名称的用户。如果没有这个用户，它将告知用户填写正确的名称;

拥有我们自己的错误处理类的好处是我们可以使用 `instanceof` 很容易地在错误处理代码中检查错误。

```javascript
function getGitHubUser() {
  let name = prompt('enter a name?', 'iliakan');
  
  return loadJson(`https://api.github.com/users/${name}`)
  .then(user => user)
  .catch(err => {
    if (err instanceof HttpError && err.response.status === 404) {
      return getGitHubUser();
    } else {
      throw err;
    }
  })
}
```


### 全局的Promise拒绝处理

有关Promise的其中一个最具争议的问题是，如果在没有拒绝处理程序的情况下拒绝一个Promise，那么不会提示失败信息，这是JavaScript语言中唯一一处没有强制报错的地方.
Promise的特性决定了很难检测一个Promise是否被处理过

```javascript
let rejected = Promise.reject(42);

//此时,rejected还没有被处理

//过了一会
rejected.catch(function(value) {
  //现在rejected已经被处理
  console.log(value);
})
```

任何时候都可以调用then()方法或catch()方法，无论Promise是否已解决这两个方法都可以正常运行，但这样就很难知道一个Promise何时被处理。在此示例中，Promise被立即拒绝，但是稍后才被处理。

### 4.1 Node.js

在Node.js中，处理Promise拒绝时会触发process对象上的两个事件：

* unhandledRejection 在一个事件循环中，当Promise被拒绝，并且没有提供拒绝处理程序时被调用。
* rejectionHandled      在一个事件循环后，当Promise被拒绝，并且没有提供拒绝处理程序时被调用

**unhandledRejection**

拒绝原因（通常是一个错误对象）及被拒绝的Promise作为参数被传入unhandledRejection事件处理程序中，以下代码展示了unhandledRejection的实际应用：

```javascript
let rejected;

process.on('unhandledRejection', function(reason, promise) {
  console.log(reason.message); //'Explosion'
  console.log(rejected === promise); //true
});

rejected = Promise.reject(new Error('Explosion'));
```

这个示例创建了一个已拒绝Promise和一个错误对象，并监听了unhandledRejection事件，事件处理程序分别接受错误对象和Promise作为它的两个参数。

**rejectionHandled**

rejectionHandled事件处理程序只有一个参数，也就是被拒绝的Promise

```javascript
let rejected;

process.on('rejectionHandled', function(promise) {
  console.log(rejected === promise); //true
});

rejected = Promise.reject(new Error('Explosion'));

//等待添加拒绝处理程序
setTimeout(() => {
  rejected.catch(function(value) {
    console.log(value.message); //Explosion
  })
},1000)
```

这里的rejectionHandled事件在拒绝处理程序最后被调用时触发，如果在创建rejected之后直接添加拒绝处理程序，那么rejectionHandled事件不会被触发，因为rejected创建的过程与拒绝处理程序的调用在同一个事件循环中，此时rejectionHandled事件尚未生效。

通过事件rejectionHandled和事件unhandledRejection将潜在未处理的拒绝存储为一个列表，等待一段时间后检查列表便能够正确地跟踪潜在的未处理拒绝。例如下面这个简单的未处理拒绝跟踪器

```javascript
let possiblyUnhandledRejections = new Map();

//如果一个拒绝没被处理,则将它添加到map集合中
process.on('unhandledRejection', function(reason, promise) {
  possiblyUnhandleRjections.set(promise, reason);
});

process.on('rejectionHandled', function(promise) {
  possiblyUnhandleRejections.delete(promise);
});

setInterval(function() {
  possiblyUnhandledRejections.forEach(function(reason, promise) {
    console.log(reason.message ? reason.message : reason);
    
    //做一些什么来处理这些拒绝
    handleRejection(promise, reason);
  });
  
  possiblyUnhandledRejections.clear();
}, 60000);
```

这段代码使用Map集合来存储Promise及其拒绝原因，每个Promise键都有一个拒绝原因的相关值。每当触发unhandledRejection事件时，会向Map集合中添加一组Promise及拒绝原因；每当触发rejectionHandled事件时，已处理的Promise会从Map集合中移除。结果是，possiblyUnhandledRejections会随着事件调用不断扩充或收缩。setInterval()调用会定期检查列表，将可能未处理的拒绝输出到控制台（实际上你会通过其他方式记录或者直接处理掉这个拒绝）。在这个示例中使用的是Map集合而不是WeakMap集合，这是因为你需要定期检查Map集合来确认一个Promise是否存在，而这是WeakMap无法实现的。



### 4.2 浏览器

浏览器也是通过触发两个事件来识别未处理的拒绝的，虽然这些事件是在window对象上触发的，但实际上与Node.js中的完全等效。

* unhandledrejection　在一个事件循环中，当Promise被拒绝，并且没有提供拒绝处理程序时被调用。
* rejectionhandled　    在一个事件循环后，当Promise被拒绝，并且没有提供拒绝处理程序时被调用。

在Node.js实现中，事件处理程序接受多个独立参数；而在浏览器中，事件处理程序接受一个有以下属性的事件对象作为参数：

* type　事件名称（"unhandledrejection"或"rejectionhandled"）
* promise　被拒绝的Promise对象
* reason　来自Promise的拒绝值

浏览器实现中的另一处不同是，在两个事件中都可以使用拒绝值（reason），例如：

```javascript
let rejected;

window.onunhandledrejection = function(event) {
  console.log(event.type); //unhandledrejection
  console.log(event.reason.message); //Explosion
  console.log(rejected === event.promise); //true
}

window.onrejectionhandled = function(event) {
  console.log(event.type); //rejectionhandled
  console.log(event.reason.message); //Explosion
  console.log(rejected === event.promise); //true
}

rejected = Promise.reject(new Error('Explosion'));
```

这段代码用DOM 0级记法的onunhandledrejection和onrejectionhandled给两个事件处理程序赋值，如果你愿意的话也可以使用addEventListener("unhandledrejection")和addEventListener("rejectionhandled")，每个事件处理程序接受一个含有被拒绝Promise信息的事件对象，该对象的属性type、promise和reason在这两个事件处理程序中均可使用。在浏览器中，跟踪未处理拒绝的代码也与Node.js中的非常相似：

```javascript
//深入理解Es6 11.3章
```


## Promise链

### 概况

如果异步任务要一个接一个地执行, Promise 提供了一些方案来做到这一点。

```javascript
new Proise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000);
}).then(value => {
  alert(value); //1
  return value * 2; //2
}).then(value => {
  alert(value);
  return value * 2; 
}).then(value => {
  alert(value);   //4
  return value * 2;
})
```

### 返回Promise

`.then(handler)` 中所使用的处理程序（handler）可以<span style="color:blue">**显式创建并返回**</span>(`return new Promise())`一个 promise。(显式两个字是自己添加的, 因为then的回调函数本身返回一个promise)

在这种情况下，其他的处理程序（handler）将等待它 settled 后再获得其结果（result）

```javascript
new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000);
}).then(res => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result*2), 1000);
  });
}).then(res => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000)
  })
}).then(res => alert(res)); //4
```

<span style="color:blue;">返回Promise,使我们能够建立异步行为链</span>



### 实例1-loadScript

实现上面的多个loadScript调用,按顺序次序加载脚本

```javascript
loadScript("/article/promise-chaining/one.js")
  .then(function(script) {
    return loadScript("/article/promise-chaining/two.js");
  })
  .then(function(script) {
    return loadScript("/article/promise-chaining/three.js");
  })
  .then(function(script) {
    // 使用在脚本中声明的函数
    // 以证明脚本确实被加载完成了
    one();
    two();
    three();
  });
```

从技术上讲，我们可以向每个 `loadScript` 直接添加 `.then`，就像这样：

```javascript
loadScript("/article/promise-chaining/one.js").then(script1 => {
  loadScript("/article/promise-chaining/two.js").then(script2 => {
    loadScript("/article/promise-chaining/three.js").then(script3 => {
      // 此函数可以访问变量 script1，script2 和 script3
      one();
      two();
      three();
    });
  });
});
```

这段代码做了相同的事儿：按顺序加载 3 个脚本。但它是“向右增长”的。所以会有和使用回调函数一样的问题。



### Thenables  ????

<span style="color:blue;">then处理程序（handler）返回的不完全是一个 promise</span>，而是返回的被称为 “thenable” 对象 — 一个具有方法 `.then` 的任意对象。它会被当做一个 promise 来对待。

按照这个想法是，第三方库可以实现自己的“promise 兼容（promise-compatible）”对象。它们可以具有扩展的方法集，但也与原生的 promise 兼容，因为它们实现了 `.then` 方法。

```javascript
class Thenable {
  constructor(num) {
    this.num = num;
  }
  then(resolve, reject) {
    alert(resolve);// function() { native code }
    
    setTimeout(() => resolve(this.num * 2), 1000)// (**)
  }
}

new Promise(resolve => resolve(1))
  .then(result => {
    return new Thenable(result); // (*)
  })
  .then(alert); // 1000ms 后显示 2
```

JavaScript 检查在 `(*)` 行中由 `.then` 处理程序（handler）返回的对象：如果它具有名为 `then` 的可调用方法，那么它将调用该方法并提供原生的函数 `resolve` 和 `reject` 作为参数（类似于 executor），并等待直到其中一个函数被调用。在上面的示例中，`resolve(2)` 在 1 秒后被调用 `(**)`。然后，result 会被进一步沿着链向下传递。

这个特性允许我们将自定义的对象与 promise 链集成在一起，而不必继承自 `Promise`。



### 实例2-fetch

使用 [fetch](https://zh.javascript.info/fetch) 方法从远程服务器加载用户信息,基本语法很简单:

```javascript
let promise = fetch(url);
```

执行这条语句，向 `url` 发出网络请求并返回一个 promise。

当远程服务器返回 header（是在 **全部响应加载完成前**）时，该 promise 使用一个 `response` 对象来进行 resolve。

向 GitHub 发送一个请求，加载用户个人资料并显示头像：

```javascript
fetch('article/promise-chaining/user.json')
.then(response => response.json())
.then(user => fetch(`https://api.github.com/users/${user.name}`))
.then(response => response.json())
.then(githubUser => {
  let img = document.createElement('img');
  img.src = githubUser.avatar_url;
  img.className = 'promise-avatar-example';
  document.body.append(img);
  
  setTimeout(() => img.remove(), 3000)
})
```

这段代码存在的问题: 在头像显示结束并被移除 **之后** 做点什么？就目前而言是做不到的.

解决: 使链可扩展，我们需要返回一个在头像显示结束时进行 resolve 的 promise。

```javascript
fetch('/article/promise-chaining/user.json')
	.then(response => response.json())
	.then(user => fetch(`https://api.github.com/users/${user.name}`))
	.then(response => response.json())
	.then(githUser => new Promise((reseolve, reject) => {
      let img = document.createElement('img');
      img.src = githubUser.avatar_url;
      img.className = 'promise-avatar-example';
      document.body.append(img);
      
      setTimeout(() => {
        img.remove();
        resolve(githubUser);
      }, 3000)
  }))
  .then(githubUser => alert(`Finished showing ${githubUser.name}`))
```

拆分可重用的代码:

```javascript
function loadJson(url) {
  return fetch(url).then(response => response.json())
}

function loadGithubUser(name) {
  return loadJson(`https://api.github.com/users/${name}`);
}

function showAvatar(githubUser) {
  return new Promise(function (resolve, reject) {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    document.body.append(img);
    
    setTimeout(() => {
      img.remove();
      resolve(githubUser)
    }, 3000)
  });
}

//使用它们
loadJson('/article/promise-chaining/user.json')
	.then(user => loadGithubUser(user.name))
	.then(showAvatar)
	.then(githubUser => alert(`Finished showing ${githubUser.name}`))
```



## Promise继承

Promise与其他内建类型一样，也可以作为基类派生其他类，所以你可以定义自己的Promise变量来扩展内建Promise的功能。例如，假设你想创建一个既支持then()方法和catch()方法又支持success()方法和failure()方法的Promise，则可以这样创建该Promise类型

```javascript
class MyPromise extends Promise {
  //使用默认的构造函数
  success(resolve, reject) {
    return this.then(resolve, reject);
  }
  
  failure(reject) {
    return this.catch(reject);
  }
}

let promise = new MyPromise(function(resolve, reject) {
  resolve(42);
});

promise.success(function(value) {
  console.log(value); //42
}).failur(function(value) {
  console.log(value);
})
```

由于静态方法会被继承，因此派生的Promise也拥有MyPromise.resolve()、MyPromise.reject()、MyPromise.race()和MyPromise.all()这4个方法，后二者与内建方法完全一致，而前二者却稍有不同。

由于MyPromise.resolve()方法和MyPromise.reject()方法通过Symbol.species属性（参见第9章）来决定返回Promise的类型，故调用这两个方法时无论传入什么值都会返回一个MyPromise的实例。如果将内建Promise作为参数传入其他方法，则这个Promise将被解决或拒绝，然后该方法将会返回一个新的MyPromise，于是就可以给它的成功处理程序及失败处理程序赋值。

```javascript
//es6 第11章 

```



## Promise实现 🚩🚩🚩

> https://juejin.cn/post/6945319439772434469
>
> 非常重要的一道题.需要多阅读多理解,Promise理解的并不好



```javascript
//version 1 实现基本功能

const PENDING = 'pending'
const 'FULFILLED' = 'fulfilled'
const 'REJECTED' = 'rejected'

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject)
  }
  
  status = PENDING
  value = null
  reason = null
  
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
    }
  }
  
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.value = reason
    }
  }
  
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    else if (this.status === Rejected) {
      onRejected(this.reason)
    }
  }
}
```



```javascript
//version 2
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject)
  }
  
  status = PENDING
  value = null
  reason = null
  
  // 添加异步处理
  onFulfilledCallback = null
  onRejectedCallback = null
  
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      
      //添加异步处理
      this.onFulfilledCallback && this.onFulfilledCallback(this.value)
    }
  }
  
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.value = reason
      
      //添加异步处理
      this.onRejectedCallback && this.onRejectedCallback(this.reason)
    }
  }
  
  
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    else if (this.status === REJECTED) {
      onRejected(this.value)
    }
    else if (this.status === PENDING) {
      // 因为不知道后面状态的变化,所以将成功和失败的回调储存起来
      // 等到执行成功失败函数的时候再进行传递
      onFulfilledCalback = onFulfilled
      onRejectedCallback = onRejected
    }
  }
}
```



```javascript
// version 3 实现then方法多次调用添加多个处理函数

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject)
  }
  
  status = PENDING
  value = null
  reason = null
  
  //
  onFulfilledCallback = []
  onRejectedCallback = []
  
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      
      //this.onFulfilledCallback.length && this.onFulfilledCallback.shift()(value) 只会执行一次
      while(this.onFulfilledCallback.length) {
        this.onFulfilledCallback.shift()(value)
      }
    }
  }
  
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.value = reason
      
      //this.onRejectedCallback.length && this.onRejectedCallback.shift()(reason)
      while(this.onRejectedCalback.length) {
        this.onRejectedCallback.shift()(reason)
      }
    }
  }
  
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    else if (this.status === REJECTED) {
      onRejected(this.value)
    }
    else if (this.status === PENDING) {
      this.onFulfilledCallback.push(onFulfilled)
      this.onRejectedCallback.push(onRejected)
    }
  }
}
```



4 实现then方法的链式调用

then方法要链式调用就需要返回一个Promise对象

then方法里面return一个返回值作为下一个then方法的参数,如果return一个Promise对象,那么就需要判断它的状态

```javascript
class MyPromise {
  //...
  then(onFulfilled, onRejected) {
    //为了链式调用这里直接创建一个 MyPromise, 并在后面return出去
    const promise2 = new MyPromise((resolve, reject) => {
      //这里的内容在执行器中,会立即执行
      if (this.status === FULFILLED) {
        //获取成功回调的执行结果
        const x = onFulfilled(this.value)
        //传入 resolvePromise 集中处理
        resolvePromise(x, resolve, reject)
      }
      else if (this.status === REJECTED) {
        onRejected(this.value)
      }
      else if (this.status === PENDING) {
        this.onFulfilledCallback.push(onFulfilled)
        this.onRejectedCallback.push(onRejected)
      }
    })
    return promise2
  }
}

function resolvePromise(x, resolve, reject) {
  if (x instanceof MyPromise) {
    //执行x, 调用then方法, 目的是将其状态变为 fulfilled 或 rejected
    // x.then(value => resolve(value), reason=>reject(reason))
    //简化之后
    x.then(resolve, reject)
  }
  else {
    //普通纸
    resolve(x)
  }
}
```



5 then方法链式调用识别 Promise 是否返回自己

如果then方法返回的是自己的Promise对象,则会发生循环调用,这个时候程序会报错

```javascript
//test.js

const promsie = new MyPromise((resolve, reject) => {
  resolve(100)
})

const p1 = promise.then(value => {
  console.log(value)
  return p1
})
```

使用原生Promise执行上面的代码,会报类型错误

```javascript
Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
```

在MyPromise中实现一下:

```javascript
class MyPromise {
  ....
  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve,reject)=> {
      if (this.status === FULFILLED) {
        const x = onFulfilled(this.value)
      	//resolvePromise 集中处理,将promise2 传入
      	resolvePromise(promise2, x, resolve, reject)
      }
      else if (this.status === REJECTED) {
        onRejected(this.reason)
      }
      else if (this.status === PENDING) {
        this.onFulfilledCallback.push(onFulfilled)
        this.onRejectedCallback.push(onRejected)
      }
    })
    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  //如果相等了,说明return的是自己,抛出类型错误并返回
  if (promise2 === x) {
    return TypeError(new TypeError('Chaing cycle detected for promise #<Promise>'))
  }
  
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  }else {
    resolve(x)
  }
}
```

执行报错:

```javascript
resolvePromise(promise2, x, resolve, reject);
                       ^

ReferenceError: Cannot access 'promise2' before initialization
```

我们必须要等 promise2 完成初始化。这个时候我们就要用上宏微任务和事件循环的知识了，这里就需要创建一个异步函数去等待 promise2 完成初始化，前面我们已经确认了创建微任务的技术方案 --> `queueMicrotask`

```javascript
//MyPromise

class MyPromise {
  //...
  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        //创建一个微任务 等待promise2 完成初始化
        queueMicrotask(() => {
          //获取成功回调函数的执行结果
          const x = onFulfilled(this.value)
          //传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject)
        })
      } else if (this.status === REJECTED) {
        //...
      }
    })
    
    return promise2
  }
}
```



6 捕获错误及then链式调用其他状态代码补充

6.1捕获执行器错误

```javascript
// MyPromise

constructor(executor) {
  try {
    executor(this.resolve, this.reject)
  } catch(error) {
    this.reject(error)
  }
}
```

验证:

```javascript
const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
    // resolve('success')
    throw new Error('执行器错误')
})
 
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
}, reason => {
  console.log(2)
  console.log(reason.message)
})
```

执行结果

```javascript
2
执行器错误
```

6.2then执行时错误捕获

```javascript
//MyPromise

then(onFulfilled, onRejected) {
  const promise2 = new MyPromise((resolve, reject) => {
    if (this.status === FULFILLED) {
    	queueMicrotask(() => {
        try {
          const x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch(error) {
          reject(error)
        }
      })
    }
    else if (this.status === REJECTED) {
      cosnt x = onRejected(this.reason)
      resolvePromise(promise2, x, resolve, reject)
    }
    else if (this.status === PENDING) {
      this.onFulfilledCallback.push(onFulfilled)
      this.onRejectedCallback.push(onRejected)
    }
  })
}
```

7 对rejected和pending状态进行改造,参考fulfilled

> 改造内容:
>
> 1. 增加异步状态下的链式调用
> 2. 增加回调函数执行结果的判断
> 3. 增加识别 Promise 是否返回自己
> 4. 增加错误捕获

```javascript
//MyPromise.js

then(onFulfilled, onRejected) {
  const promise2 = new MyPromise((resolve, reject) => {
  	if (this.status === FULFILLED) {
      queueMicrotask(() => {
        try {
          const x = onFulfilled(this.value)
          resolveProimse(promise2, x, resolve, reject)
        } catch(error) {
          reject(error)
        }
      })
    }
    else if (this.status === REJECTED) {
      queueMicrotask(() => {
        try {
          const x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch(error) {
          reject(error)
        }
      })
    }
    else if (this.status === PENDING) {
      this.onFulfilledCallback.push(() => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch(error) {
            reject(error)
          }
        })
      })
      this.onRejectedCallback.push(() => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch(error) {
            reject(error)
          }
        })
      })
    }
  })
  
  reurn promise2
}
```



8 then中的参数变为可选

上面我们处理 then 方法的时候都是默认传入 onFulfilled、onRejected 两个回调函数，但是实际上原生 Promise 是可以选择参数的单传或者不传，都不会影响执行。

```javascript
//MyPromise

then(onFulfilled, onRejected) {
  // 如果不传,就使用默认函数
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
  onRejected = typeof onRejected === 'function' ? 
onRejected : reason => {throw reason}
  
  const promise2 = new MyPromise((resolve, reject) => {
    
  })
}
```



9 实现resolve与reject的静态调用

` Promise.resolve` 来返回一个 Promise 对象

```javascript
MyPromise {
  //...
  
  //resolve静态方法
  static resolve(parameter) {
    if (parameter instanceof MyPromise) {
      return parameter
    }
    
    //转成常规方式
    return new MyPromise(resolve => {
      resolve(parameter)
    })
  }
  
  //rejec静态方法
  static reject(parameter) {
    return new MyPromise((resolve, reject) => {
      
    })
  }
}
```





## Promise实现2

> https://github.com/xieranmaya/blog/issues/3
>
> https://juejin.cn/post/6844903625769091079
>
> https://juejin.cn/post/6844904077537574919
>
> https://juejin.cn/post/6945319439772434469
>
> 掘金来自搜索promise的前几位结果





# 静态方法 6种

### Promise.resolve()
> 这两个静态方法(Promise.resolve, Promise.reject返回的期约在被返回时并未兑现或拒绝，但它们会在当前同步代码块运行结束后立即兑现或拒绝。通常，这会在几毫秒之后发生，除非有很多待定的异步任务等待运行

如果把期约p1传给Promise.resolve()，它会返回一个新期约p2，p2会立即解决，<span style="text-decoration: underline wavy;">但要等到p1兑现或被拒绝时才会兑现或被拒绝。</span>

##### 实现

```javascript
Promise.myResolve = function(val) {
  if (val instanceof Promise) {
    return val
  }
  
  return new Promise(resolve => resolve(val))
}
```



### Promise.reject()



##### 实现

```javascript
Promise.myReject = function(err) {
  return new Promise((resolve, reject) => reject(err))
}
```







### Promise.all()

##### 概述
> 此静态方法接受一个由promise元素组成的数组作为入参,返回一个Promise.
> 当入参中所有的promise成功时(包括空迭代对象),返回的Promise才会成功,其值是一个成功状态值组成的数组.
> 当入参中由任意一个promise失败,返回的Promise才会失败, 其值是第一个失败的promise的值.

##### Syntax
```javascript
Promise.all(iterable)
```

##### Param
`iterable`
An [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) object such as an [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

##### Return value

* An **already resovled**(已完成) Promise if the iterble passed is empty.(是同步完成的, 见下面)
* An **asynchronously resolved**(异步已完成) Promise if the iterable passed contained no promises.
* A **pending Promise** (处理中)in all other cases
* This returned promise is then resolved/rejected asynchronously(as soon as the stack is empty) when all the promises in the given *iterable* have resolved, or if any of the promises reject.

> 以上关于返回值的描述中:
> 已完成和异步已完成有什么区别吗???
> 'as soon as the stack is empty'  怎么理解呢?



##### Desc

* the method can be useful for aggregating the results of multiple promises.
* it is typically used when there are multiple related asynchronous tasks that the overrall code relied on to work successfully - all of whom we want to fulfill before the code execution continues.
* `Promise.all()` will reject immediatelly upon **any** of the input promises rejecting. In comparison, the promise returned by `Promise.allSettled()` will wait for all input promises to complete, regardless of whether or not one rejects.
* the order of the promise array is preserved upon completion of this method.(描述不清晰, 返回promise数组的顺序和传入的顺序一样)

##### Fulfillment

* the returned promise is fulfilled(执行, 结束, 满足) with an array containing **all** the resolved values(including non-promise values) in the *iterable* passed as the argumetn:
  * If an <span style="color:blue; font-weight:bold;">empty iterable</span> is passed, then the promise returned by this method is <span style="color:blue">fulfilled synchronously</span>. The resolved values is an empty array.
  * If a nonempty *iterable* is passed, and **all** of <u>the promises fulfill, or are not promsies</u>, then the promise returned by this method is **fulfilled asynchronously**

##### Rejection

If any of the passed-in promises reject, `Promise.all` asynchronously rejects with the value of the promises that rejected, whether or not other promise have resolved.



##### 注意事项
作为参数的Promise实例p1、p2、p3，如果已经定义了catch()函数，那么当其中一个Promise状态变为rejected时，并不会触发Promise.all()函数的catch()函数。
```js
const p1 = new Promise((resolve, reject) => {
    resolve('success');
})
    .then(result => result)
    .catch(e => e);

const p2 = new Promise((resolve, reject) => {
    throw new Error('error');
})
    .then(result => result)
        .catch(e => e);

Promise.all([p1, p2])
    .then(result => console.log(result)) // ['success', Error: error]
    .catch(e => console.log(e));
```


##### **实现Promise.all**

```javascript
//https://juejin.cn/post/7033275515880341512#:~:text=%E5%8F%82%E8%80%83%E4%BB%A3%E7%A0%81-,%E5%AE%9E%E7%8E%B0promise.all,-%E8%80%83%E5%AF%9F%E9%A2%91%E7%8E%87%3A%20(%E2%AD%90%E2%AD%90%E2%AD%90%E2%AD%90%E2%AD%90)

function promisesAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      throw new TypeError('promises must be an array');
    }
    
    let resArr = [];
    let count = 0;
    promises.forEach((promise, idx) => {
      promise.then(
        res => {
        resArr[idx] = res;
        count++;
        count === promises.length && resolve(resArr);
      },
        err => { reject(err) }          
      );
    })
  })
}


//20220724
Promise.prototype.all = function (promises) {
	return new Promise((resolve, reject) => {
		// 判断是否为可迭代对象
		if (!Array.isArray(promises)) {
			throw new TypeError('promises must be an iterable object')
		}

		let resultArr = []
		promises.forEach((promise, idx) => {
			promise.then(
				value => {
					resultArr[idx] = value
					idx === (promises.length - 1) && resolve(resultArr)
				 },
				error => { 
					reject(error)
				}
			)
		})
	})
}
```



##### 实例

Promise.all的异步或同步

异步:
```javascript
let resolvedpromisesArray = [Promise.resolve(33), Promise.resolve(44)];

let p = Promise.all(resolvedpromisesArray);

console.log(p);

setTimeout(() => {
  console.log('the stack is not empty');
  console.log(p);
})

//Promise {<pending>}
//2 定时器的ID
//the stack is not empty
//Promise {<fulfilled>: Array(2)}
```

如果Promise.all() reject的话, 会有同样的打印顺序:
```javascript
let p = Promise.all([Promise.resolve(3), Promise.reject(4)]);

console.log(p);
setTimeout(() => {
  console.log('the stack is not empty');
  console.log(p);
})
//Promise {<pending>}
//3
//the stack is not empty
//Promise {<rejected>: 4}
```

存储URL的数组,将一个任务数组映射成promise数组,然后将其包装到promise

```javascript
let urls = [
  'https://api.github.com/users/iliakan',
  'https://api.github.com/users/remy',
  'https://api.github.com/users/jeresig'
];

let request = urls.map(url => fetch(url));

Promise.all(request)
	.then(responses => responses.forEach(
		response => alert(`${response.url}: ${response.status}`)
	))
```

一个更真实的示例，通过 GitHub 用户名来获取一个 GitHub 用户数组中用户的信息（我们也可以通过商品 id 来获取商品数组中的商品信息，逻辑都是一样的）：

```javascript
let names = ['iliakan', 'remy' ,'jeresig'];

let request = names.map(name => fetch(`https://api.github.com/users/${name}`));

Promise.all(request)
	.then(responses => responses)
	.then(responses => Promise.all(responses.map(r => r.json())))
	.then(users => users.forEach(user => alert(user.name)))
```


**串行期约**
> JS权威指南第7版  第13章

动态构建一个函数,并行执行任意数量的请求.
```js
function fetchSequentially(urls) {
	// 保存响应体
	const bodies = []

	// 只抓取一个URL响应体
	function fetchOne(url) {
		return fetch(url)
			.then(response => response.text())
			.then(body => {
				// 保存响应体到数组, 这里故意声乐了返回值
				bodies.push(body)
			})
	}

	//从一个立即(以undefined值)兑现的期约开始
	let p = Promise.resolve(undefined)

	// 现在循环目标URL, 构建任意长度的期约链
	// 链的每个环节都会拿取一个URL的响应体
	for (url of urls) {
		p = p.then(() => fetchOne(url))
	}

	// 期约链的最后一个期约兑现后,响应体数组也已经就绪.因此,可以将这个bodies数组通过期约返回.注意,这里并未包含任何错误处理程序,我们希望把错误传播给调用者.
	return p.then(() => bodies)
}


fetchSequentially(urls)
	.then(bodies => {/*处理*/})
	.catch(e => console.error(e))
```







### Promise.allSettled
> [Promise.allSettled() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

##### 概述
> 此静态方法接收一个包含promises的可迭代对象作为入参并返回单个Promise. 当所有入参的promise状态settle(包含空的迭代对象)之后,返回的promise才会解决(fullfill),并带有一个描述每个promise结果的对象数组.




##### Syntax

```javascript
Promise.allSettled(iterable)
```

##### Parameters

`iterable`

* an iterable Object, such as an array, in which each member is a Promise.

##### Return values

* 
* 当且仅当传进一个空迭代对象作为参数,返回一个已经完成状态的Promise空数组对象.
* 对于每个结果对象，都有一个 `status` 字符串。如果它的值为 `fulfilled`，则结果对象上存在一个 `value` 。如果值为 `rejected`，则存在一个 `reason` 。value（或 reason ）反映了每个 promise 决议（或拒绝）的值。

```javascript
//status是显式存在的

Promise.allSettled([1,2,3]).then(val => console.log(val));

//log:
[
  {status: 'fulfilled', value: 1},
  {status: 'fulfilled', value: 2},
  {status: 'fulfilled', value: 3}
]
```

##### 实现

```javascript
Promise.myAllSettled = function (promises) {
  
  // 判断数组长度
  if (promises.length === 0) return Promise.resolve([]);

  // 非promise对象包装成promise对象
  const _promises = promises.map(promise => promise instanceof Promise ? promsie : Promise.resolve(promise));

  return Promise((resolve, reject) => {
    
    const res = [];
    let unPromisesCount = _promises.length;
    
    _promises.forEach((promise, idx) => {
      promise.then(val => {
        res[idx] = {
          status: 'fulfilled',
          val
        };
        unPromisesCount -= 1;
        if (unPromisesCount === 0) {
          return resolve(res);
        }
      });
  
      promise.catch(err => {
        res[idx] = {
          status: 'rejected',
          err
        };
        unPromisesCount -= 1;
        if (unPromisesCount === 0) {
          return reject(res);
        }
      })
    })
  })
}


//https://segmentfault.com/a/1190000025142845

function allSettled(promises) {
  if (promises.length === 0) return Promise.resolve([])
  
  const _promises = promises.map(
    item => item instanceof Promise ? item : Promise.resolve(item)
    )
  
  return new Promise((resolve, reject) => {
    const result = []
    let unSettledPromiseCount = _promises.length
    
    _promises.forEach((promise, index) => {
      promise.then((value) => {
        result[index] = {
          status: 'fulfilled',
          value
        }
        
        unSettledPromiseCount -= 1
        // resolve after all are settled
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      }, (reason) => {
        result[index] = {
          status: 'rejected',
          reason
        }
        
        unSettledPromiseCount -= 1
        // resolve after all are settled
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      })
    })
  })
}
```





### Promise.any

##### 概述

* `Promise.any()` 接收一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)可迭代对象，只要其中的一个 `promise` 成功，就返回那个已经成功的 `promise` 。
* 如果可迭代对象中没有一个 `promise` 成功（即所有的 `promises` 都失败/拒绝），就返回一个失败的 `promise `和[`AggregateError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)类型的实例，它是 [`Error`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error) 的一个子类，用于把单一的错误集合在一起。
* 本质上，这个方法和[`Promise.all()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)是相反的。



##### Syntax

```javascript
Promise.any(iterable)
```

##### Parameter

`iterable`

一个可迭代对象,例如Array

##### Return values

- 如果传入的参数是一个空的可迭代对象，则返回一个 **已失败（already rejected）** 状态的 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。
- 如果传入的参数不包含任何 `promise`，则返回一个 **异步完成** （**asynchronously resolved**）的 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。
- 其他情况下都会返回一个**处理中（pending）** 的 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。 
- 只要传入的迭代对象中的任何一个 `promise` 变成成功（resolve）状态，或者其中的所有的 `promises` 都失败，那么返回的 `promise` 就会 **异步地**（当调用栈为空时） 变成成功/失败（resolved/reject）状态。

##### Desc

* 这个方法用于返回第一个成功的 `promise` 。只要有一个 `promise` 成功此方法就会终止，它不会等待其他的 `promise` 全部完成。
* 不像 [Promise.all()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 会返回一组完成值那样（resolved values），我们只能得到一个成功值（假设至少有一个 `promise` 完成）
* 也不像 [Promise.race()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) 总是返回第一个结果值（resolved/reject）那样，这个方法返回的是第一个 *成功的* 值。
* Fulfillment
  * 如果传入的参数是一个空的可迭代对象, 这个方法将会同步返回一个已经完成的 `promise`。
  * 如果传入的任何一个 `promise` 已成功, 或者传入的参数不包括任何 `promise`, 那么 `Promise.any` 返回一个异步成功的 `promise`。
* Rejection
  * 如果所有传入的 `promises` 都失败, `Promise.any` 将返回异步失败，和一个 [AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) 对象，它继承自 [Error](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)，有一个 `error` 属性，属性值是由所有失败值填充的数组。



##### 实现

```javascript
//https://juejin.cn/post/7033275515880341512#heading-35
Promise.myAny = function(promises) {
  return new Promise((resolve, reject) => {
    let idx = 0;
    if (promises.length === 0) return;
    
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
      	val => resolve(val),
        err => {
          idx++;
          if (idx === promises.length) {
            return new AggregateError('all promise were rejected')
          }
        }
      )
    })
  })
}


//https://zhuanlan.zhihu.com/p/376881585
/**
 * @param {Array<Promise>} promises
 * @returns {Promise}
 */
function any(promises) {
  // return a Promise, which resolves as soon as one promise resolves
  return new Promise((resolve, reject) => {
    let isFulfilled = false
    const errors = []
    let errorCount = 0
    promises.forEach((promise, index) => promise.then((data) => {
      if (!isFulfilled) {
        resolve(data)
        isFulfilled = true
      }
    }, (error) => {
      errors[index] = error
      errorCount += 1

      if (errorCount === promises.length) {
        reject(new AggregateError('none resolved', errors))
      }
    }))
  })
}


//https://github.com/azl397985856/fe-interview/issues/125
Promise.any = ps => new Promise((resolve, reject) => {
 let cnt = 0;
 ps.map(p => p.then(resolve).catch((err) => ++cnt === ps.length && reject(err)))
})
```



### Promise.race   ????

##### 概述

返回一个Promise,一旦迭代器中的某个promise解决或拒绝,返回的promise就会解决或拒绝.

##### Syntax

```javascript
Promise.race(iterable)
```

##### Parameter

`iterable`

可迭代对象,类似Array.

##### Return values

一个**待定的** [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 只要给定的迭代中的一个promise解决或拒绝，就采用第一个promise的值作为它的值，从而**异步**地解析或拒绝（一旦堆栈为空）????



##### Desc

* `race` 函数返回一个 `Promise`，它将与第一个传递的 promise 相同的完成方式被完成。它可以是完成（ resolves），也可以是失败（rejects），这要取决于第一个完成的方式是两个中的哪个。

* 如果传的迭代是空的，则返回的 promise 将永远等待。

* 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，则` Promise.race` 将解析为迭代中找到的第一个值



##### 实现

```javascript
// resolve将非Promise转换为promise

Promise.myRace = function (promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach(p => {
      Promise.resolve(p).then(val => resolve(val), err => reject(err))
    })
  })
}


//https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/140

Promise._race = promises => new Promise((resolve, reject) => {
  promises.forEach(promise => promise.then(resolve, reject))
})

Promise.myrace = function(iterator) {
    return new Promise ((resolve,reject) => {
        try {
            let it = iterator[Symbol.iterator]();
            while(true) {
                let res = it.next();
                console.log(res);
                if(res.done) break;
                if(res.value instanceof Promise) {
                    res.value.then(resolve,reject);
                } else {
                    resolve(res.value)
                }
                
            }
        } catch (error) {
            reject(error)
        }
    }) 
}
```


# 原型方法

### Promise.prototype.then()

Promise实例具有then方法,也就是说,then方法是定义在原型对象上的.

**作用**: 为Promise实例添加状态改变时的回调函数.

**参数**: then方法的第一个参数是Promise实例resolved状态时调用的回调函数,第二个参数是rejected状态时调用的回调函数,都是可选的.

**返回值**: **then方法返回一个新的Promise实例**(注意,不是原来的Promise实例). 因此可以采用链式写法, 即then方法后再调用一个then方法.

前一个回调函数，有可能返回的还是一个`Promise`对象（即有异步操作），这时后一个回调函数，就会等待该`Promise`对象的状态发生变化，才会被调用。

**注意事项**  值穿透现象
在Promise的then()函数或者catch()函数中，接收的是一个函数，函数的参数是resolve()函数或者reject()函数的返回值。而如果传入的值是非函数，那么就会产生值穿透现象。
何为值穿透现象？简单点理解就是then/catch中只有传入的是函数时候才会将返回值传递给下一个链式调用. 传递的非函数值会被直接忽略掉，继续执行链式调用后续的函数。
```js
Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .then(console.log);


Promise.resolve(1) 
	.then(() => { return 2 }) 
	.then(() => { return 3 }) 
	.then(console.log) //3

Promise.resolve(1) 
	.then(function () { return 2 }) 
	.then(() => { Promise.resolve(3) }) 
	.then(console.log) //undefined
```
第三个then()函数因为接收到console.log()函数，因此会执行，此时接收的是最开始的resolve(1)的值，因此场景5最终会输出“1”。



#### Promise.prototype.catch()

Promise.prototype.catch()是then(null, rejection)或then(undefined, rejection)的别名,用于指定发生错误时的回调函数.

```javascript
const promise = new Promise(function(resolve, reject) {
  throw new Error('test');
});

promise.catch(function(err) {
  console.log(error);
});

//Error: test
```

上面代码中，`promise`抛出一个错误，就被`catch()`方法指定的回调函数捕获。注意，上面的写法与下面两种写法是等价的。

```javascript
//写法一

const promise = new Promise(function(resolve, reject) {
  try {
    throw new Error('test');
  } catch(e) {
    reject(e);
  }
});

promise.catch(function(error) {
  console.log(error);
});

//写法二
const promise = new Promise(function(resolve, reject) {
  reject(new Error('test'));
});

promise.catch(function(error) {
  console.log(error);
})
```

比较上面两种写法，可以发现<u>`reject()`方法的作用，等同于抛出错误。</u>

如果Promise状态已经变成resolved, 再抛出错误是无效的.

```javascript
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});

promise
	.then(function(value) { console.log(value) })
	.catch(function(error) { console.log(error) });
```

上面代码中，Promise 在`resolve`语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就永久保持该状态，不会再变了。

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获。

```javascript
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

上面代码中，一共有三个 Promise 对象：一个由`getJSON()`产生，两个由`then()`产生。它们之中任何一个抛出的错误，都会被最后一个`catch()`捕获。

一般来说，<u>不要在`then()`方法里面定义 Reject 状态的回调函数（即`then`的第二个参数）</u>，总是使用`catch`方法。

```javascript
//bad
promise
	.then(function(data) {
  //success
}, function(err) {
  //error
});

//good
promise
	.then(function(data) {
  	//success
	})
	.catch(function(err) {
  	//error
	});
```

上面代码中，第二种写法要好于第一种写法，理由是第二种写法可以捕获前面`then`方法执行中的错误，也更接近同步的写法（`try/catch`）。因此，建议总是使用`catch()`方法，而不使用`then()`方法的第二个参数。



**与try/catch比较**

跟传统的`try/catch`代码块不同的是，<span style="background:#ccc">如果没有使用`catch()`方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。</span>

```javascript
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    //下面一行会报错,因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);
//Uncaught (in promise) ReferenceError: x is not defined
//123
```

上面代码中，`someAsyncThing()`函数产生的 Promise 对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示`ReferenceError: x is not defined`，但是不会退出进程、终止脚本执行，2 秒之后还是会输出`123`。这就是说，<u>Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。</u>

再比如:

```javascript
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  setTimeout(function() {throw new Error('tset')}, 0)
});
promise.then(function(value) { console.log(value) });

//ok
//Uncaught Error: test
```

上面代码中，Promise 指定在下一轮“事件循环”再抛出错误。到了那个时候，Promise 的运行已经结束了，所以这个错误是在 Promise 函数体外抛出的，会冒泡到最外层，成了未捕获的错误。

一般建议, Promise 对象后面要跟`catch()`方法，这样可以处理 Promise 内部发生的错误。<span style="background:#ccc">`catch()`方法返回的还是一个 Promise 对象</span>，因此后面还可以接着调用`then()`方法。

```javascript
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    //下面一行代码会报错,因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing()
.catch(function(error) {
  console.log('oh, no', error);
})
.then(function() {
  console.log('carry on');
});

// oh no, [RefferenceError: x is not defined]
// carry on
```

上面代码运行完`catch()`方法指定的回调函数，会接着运行后面那个`then()`方法指定的回调函数。如果没有报错，则会跳过`catch()`方法。

```javascript
Promise.resolve()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
// carry on
```

catch方法之中还能再抛出错误

```javascript
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  return someOtherAsyncThing();
}).catch(function(error) {
  console.log('oh no', error);
  // 下面一行会报错，因为 y 没有声明
  y + 2;
}).then(function() {
  console.log('carry on');
});
// oh no [ReferenceError: x is not defined]
```

上面代码中，`catch()`方法抛出一个错误，因为后面没有别的`catch()`方法了，导致这个错误不会被捕获，也不会传递到外层。如果改写一下，结果就不一样了。

```javascript
someAsyncThing().then(function() {
  return someOtherAsyncThing();
}).catch(function(error) {
  console.log('oh no', error);
  // 下面一行会报错，因为y没有声明
  y + 2;
}).catch(function(error) {
  console.log('carry on', error);
});
// oh no [ReferenceError: x is not defined]
// carry on [ReferenceError: y is not defined]
```

第二个`catch()`方法用来捕获前一个`catch()`方法抛出的错误。



### Promise.prototype.finally()

the method returns a `Promise`. when the promises is finally either fulfilled or rejected, the specified callback function is executed. this provides a way for code to be run whether the promise was fulfilled successfully, or instead rejected.

**Syntax**

```javascript 
p.finally(onFinally)

p.finally(function() {
  //settled
})
```

**parameters**

`onFinally`

* A function called when the `Promise` is settled.

**Return values**

> returns a `Promise` whose `finally` handler is set to the specified function, `onFinally`.
>
> 我觉的这句话说的非常模糊.

**Desc**

如果你想在 promise 执行完毕后无论其结果怎样都做一些处理或清理时，`finally()` 方法可能是有用的。

`finally()` 虽然与 `.then(onFinally, onFinally)` 类似，它们不同的是：

- 调用内联函数时，不需要多次声明该函数或为该函数创建一个变量保存它。
- 由于无法知道`promise`的最终状态，所以`finally`的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况。
- 与`Promise.resolve(2).then(() => {}, () => {})` （resolved的结果为`undefined`）不同，`Promise.resolve(2).finally(() => {})` resolved的结果为 `2`。
- 同样，`Promise.reject(3).then(() => {}, () => {})` (fulfilled的结果为`undefined`), `Promise.reject(3).finally(() => {})` rejected 的结果为 `3`。

> Note:  在finally回调中 throw (或返回被闪退的promise) 将以 throw() 指定的原因拒绝新的promise.



`finally`方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是`fulfilled`还是`rejected`。这表明，`finally`方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。

`finally`本质上是`then`方法的特例。

```javascript
promise
.finally(() => {
  //语句
})

//等同于
promise
.then(result => {
  //语句
  return result;
}),
  error => {
  //语句
  throw error;
}
```

上面代码中，如果不使用`finally`方法，同样的语句需要为成功和失败两种情况各写一次。有了`finally`方法，则只需要写一次。

它的实现也很简单。

 ```javascript
Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
  	value => P.resolve(callback()).then(() =>vlaue),
    reason => P.resolve(callback()).then(() =>{ throw reason })
  );
};
 ```

上面代码中，不管前面的 Promise 是`fulfilled`还是`rejected`，都会执行回调函数`callback`。

从上面的实现还可以看到，`finally`方法总是会返回原来的值。????

```javascript
// resolve 的值是 undefined
Promise.resolve(2).then(() => {}, () => {})

// resolve 的值是 2
Promise.resolve(2).finally(() => {})

// reject 的值是 undefined
Promise.reject(3).then(() => {}, () => {})

// reject 的值是 3
Promise.reject(3).finally(() => {})
```

**实现Promise.finally**

```javascript
Promise.prototoype.Finally = function(cb) {
  return this.then(
    (value) => {
    	return Promise.resolve(cb()).then(() => value)
  }, (err) => {
    	return Promise.resolve(cb()).then(() => throw err)
  })
}
```



```javascript
Promise.prototype.finally = function(cb) {
  return this.then(
    val => Promise.resolve(cb()).then(() => val),
    err => Promise.resolve(cb()).then(() => throw err)
  )
}
```




# Promise实例

### 动态加载JS文件
>[九个超级好用的 Javascript 技巧 - 掘金](https://juejin.cn/post/7223938976158957624)

```js
function loadJS(files, done) {
	// 获取head标签
  const head = document.queryElementsByTagName('head')[0]
  Promise.all(files.map(file => {
    return new Promise(resolve => {
      // 创建script标签并添加到head
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.async = true
      s.src = file
      //监听load事件
      s.addEventListener('load', e => resolve(), false)
      head.appendChild(s)
    })
  })).then(done)  //所有均完成,执行用户的回调事件
}

loadJS(['test1.js', 'test2.js'], () => {
  // 用户的回调逻辑
})
```
### 重写loadScript

```javascript
function loadScript(src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
  	script.src = src;
    //注意,没有传递参数
  	script.onload = () => resolve(script);
    script.onerror = () => reject(new Error('error'));
    
    document.body.head.append(script);
  })
}

let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js");

promise.then(
  script => alert(`${script.src} is loaded!`),
  error => alert(`Error: ${error.message}`)
);

promise.then(script => alert('Another handler...'));
```



1.Promise新建后就会立即执行

```javascript
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved');
})

console.log('Hi');
//Promise
//Hi
//resolved
```

上面代码中，Promise 新建后立即执行，所以首先输出的是`Promise`。然后，`then`方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以`resolved`最后输出。



### 异步加载图片

```javascript
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const img = new Image();
    
    img.onload = function() {
      resolve(img);
    };
    
    img.onerror = function() {
      reject(new Error('could not load image at ' + url));
    }
    
    img.src = url;
  })
}
```

上面代码中，使用`Promise`包装了一个图片加载的异步操作。如果加载成功，就调用`resolve`方法，否则就调用`reject`方法。

### 实现Ajax操作

```javascript
cosnt getJSON = function(url) {
  const promise = new Promise(function(resolve, reject) {
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    
    const client = new XMLHttpRequest();
    client.open('GET'url);
    client.onreadystatechange = handler;
    client.responseType = 'json';
    client.setRequestHeader('Accept', 'application/json');
    client.send();
  });
  
  return promise;
}

getJSON('/posts.json').then(function(json){
  console.log('content: ' + json);
}, function(error) {
  console.log('出错了', error);
})
```

上面代码中，`getJSON`是对 XMLHttpRequest 对象的封装，用于发出一个针对 JSON 数据的 HTTP 请求，并且返回一个`Promise`对象。需要注意的是，在`getJSON`内部，`resolve`函数和`reject`函数调用时，都带有参数。

如果调用`resolve`函数和`reject`函数时带有参数，那么它们的参数会被传递给回调函数。`reject`函数的参数通常是`Error`对象的实例，表示抛出的错误；`resolve`函数的参数除了正常的值以外，还可能是另一个 Promise 实例



### 4.resolve()函数可以是另一个Promise实例

```javascript
const p1 = new Promise((resulve, reject) => {
  //...
});

const p2 = new Promise((resolve, reject) => {
  //..
  resolve(p1);
})
```

代码说明:

1.`p2`的`resolve`方法将`p1`作为参数,即一个异步操作的结果是返回另一个异步操作

2.`p1`的状态传递给了`p2`, 也就是<span style="color:red; font-weight:bold;">`p1`的状态决定了`p2`的状态</span>.

3.如果`p1`的状态是`pending`，那么`p2`的回调函数就会等待`p1`的状态改变；

4.如果`p1`的状态已经是`resolved`或者`rejected`，那么`p2`的回调函数将会立刻执行。

```javascript
const p1 = new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
	.then(result => console.log(result))
	.catch(error => console.log(error))
```

代码说明:

* 由于`p2`返回的是另一个 Promise，导致`p2`自己的状态无效了，由`p1`的状态决定`p2`的状态。
* 后面的`then`语句都变成针对后者（`p1`）。又过了 2 秒，`p1`变为`rejected`，导致触发`catch`方法指定的回调函数。



5.调用resolve() 或 reject() 并不会终结Promise的参数函数的执行

```javascript
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```

代码说明及最佳实践:

* 立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。
* 一般来说,调用`resolve`或`reject`以后，Promise 的使命就完成了，后继操作应该放到`then`方法里面，而不应该直接写在`resolve`或`reject`的后面.
* 最好在他们前面加上return

6.返回一个promise

如果向Promise.resolve()方法或Promise.reject()方法传入一个Promise，那么这个Promise会被直接返回。

```javascript
let promise = Promise.resolve(new Promise(function() {}));
console.log(promise); //Promise {<pending>}
promise.then(function(value) {
  console.log(value);  //不会执行 因为返回的未完成状态的promise
});


let promise2 = Promise.reject(new Promise(function() {}));
console.log(promise2); //Promise{<rejected>: Promise}
promise2.catch(function(value) {
  console.log(value); // 会执行
});
```







**任务编排**

如果你曾经使用过setTimeout()或setInterval()函数，你应该熟悉这种名为**任务编排（job scheduling）**的过程。当编排任务时，会向任务队列中添加一个新任务，并明确指定将任务延后执行。

**调用resolve()后会触发一个异步操作，传入then()和catch()方法的函数会被添加到任务队列中并异步执行**

```javascript
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  
  resolve();
});

promise.then(function() {
  console.log('Resolved');
});

//输出结果
Promsie
Hi
Resolved
```


### 如何串行执行多个Promise

案例: 一个封装的延迟函数，然后一个装有3,4,5的数组，需求就是在开始执行时依次等待3, 4, 5秒，并在之后打印对应输出

```javascript
//https://juejin.cn/post/6844903801296519182

function delay(time) {
  return new Promise((resolve, reject) => {
    console.log(`wait ${time}s`);
    setTimeout(() => {
      console.log('execute');
      resolve();
    }, time*1000)
  })
}

const arr = [3,4,5];
```

1.reduce

```javascript
arr.reduce((s,v) => {
  return s.then(() => delay(v))
}, Promise.resolve())
```

2.async + 循环+await

```javascript
(
	async function() {
    for (const v of arr) {
      await delay(v)
    }
  }
)()
```

3.普通循环

```javascript
let p = Promise.resolve();
for (const i of arr) {
  p = p.then(() => delay(i));
}

//while循环存在一定的问题
//思路没啥问题，问题就在于i放在外层时实际上每次都被改动，这和一道经典的面试题一样
let i;
let p = Promise.resolve();
while(i = arr.shift()) {
  p = p.then(() => delay(i))
}

//更正
let i;
let p = Promise.resolve();
while(i = arr.shift()) {
  let s = i;
  p = p.then(() => delay(s))
}
```



4.递归

```javascript
function dispatch(i, p=Promise.resolve()) {
  if (!arr[i]) return Promise.resolve();
  return p.then(() => dispatch(i+1, delay(arr[i])))
}

dispatch(0)
```



5.for await of 

 待完成

6.generator

```javascript
待完成
```





//

```html
<script>
  // 1) 创建promise对象(pending状态), 指定执行器函数
  const p = new Promise((resolve, reject) => {
    // 2) 在执行器函数中启动异步任务
    setTimeout(() => {
      const time = Date.now()
      // 3) 根据结果做不同处理
      // 3.1) 如果成功了, 调用resolve(), 指定成功的value, 变为resolved状态
      if (time%2===1) {
        resolve('成功的值 '+ time)
      } else { // 3.2) 如果失败了, 调用reject(), 指定失败的reason, 变为rejected状态
        reject('失败的值' + time)
      }
    }, 2000)
  })

  // 4) 用promise指定成功或失败的回调函数来获取成功的vlaue或失败的reason
  p.then(
    value => { // 成功的回调函数onResolved, 得到成功的vlaue
      console.log('成功的value: ', value)
    },
    reason => { // 失败的回调函数onRejected, 得到失败的reason
      console.log('失败的reason: ', reason)
    }
  )
</script>

```



### 30%中奖案例

```html
 // 点击按钮, 1s 后显示是否中奖.  30%概率中奖
// 中奖弹出   恭喜恭喜  显示中奖号码
// 未中奖弹出  再接再厉  显示号码

//回调函数写法
<body>
    <button id='btn'>点击按钮</button>
    <script>
        function rand(m, n){
            return Math.round(Math.random()*(n-m)+m);
        }
    	const btn=document.querySelector('#btn');
        btn.onclick=function(){
            setTimeout(()=>{
                let n = random(1,100);
                if(n<=30){
                    alert('恭喜恭喜,中奖号码'+n);
                }else{
                    alert('再接再厉,中奖号码'+n);
                }
            },1000)
        }
    </script>   
</body>

//Promise方法
<script>
	btn.onclick=function(){
        let p=new Promise((resolve, reject)=>{
            setTimeout(()=>{
                let n = random(1,100);
                if(n<=30){
                    //alert('恭喜恭喜,中奖号码'+n);
                    resolve(n);
                }else{
                    //alert('再接再厉,中奖号码'+n);
                    reject(n);
                }
            },1000)
        });
        
        p.then((value)=>{
            console.log('成功啦, 恭喜中奖啦!! 中奖号码为 '+value );
        }, (reason)=>{
            console.log('失败啦, 再接再厉  号码为' + reason );
        })
    }
</script>
```





### 读取文件

```html
//resource文件下有名称为1,2,3的html文件

//无promise版本
<script>
const fs = require('fs');

fs.readFile('./resource/1.htmlx', (err, data) => {
    if(err) throw err;
    console.log(data.toString());
});
    
//throw err报错信息: err是一个对象
[Error: ENOENT: no such file or directory, open 'D:\0922frontend\1215\day15\课堂\Promise\代码\1-Promise\1-基础\resource\1.htmlx'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'D:\\0922frontend\\1215\\day15\\课堂\\Promise\\代码\\1-Promise\\1-基础\\resource\\1.htmlx'
}
    
</script>

//promise版本
<script>
	const fs=require('fs');
    let p=new Promise((resolve, reject)=>{
        let data=fs.readFile('./resource/1.html', (err,data)=>{
            if(err){
                reject(err);
            }
            resolve(data);
        })
    });
    p.then((value)=>{
        console.log(value.toString())
    }, (reason)=>{
        console.log(reason.code);//
    })
</script>


```



### 发送ajax请求

```js
<scirpt>
    cosnt btn=document.querySelector('button');
	btn.onclick=function(){
        let p = new Promise((resolve, reject)=>{
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'http:');
            xhr.send();
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status < 300){
                        //成功的情况,成功的值是非常灵活可自定义的
                        resolve({
                            status:xhr.status,
                            statustext:xhr.statusText,
                            headers:xhr.getAllResponseHeaders(),
                            body:xhr.responseText
                        })
                    }else{ 
                        //失败的情况  失败的情况也是放在readyState这个判断中的.
                        reject(xhr.status);
                    }
                }
            }
        })
    }
//对成功和失败的情况进行处理
//格式:p.then(成功函数1, 失败函数2)
p.then((value)=>{
		console.log(value);
    },(reason)=>{
		console.log(reason);
    })
</script>    
```



### 连接mongoose数据库

```js
//db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/h5200922');

//实例化 Promise 对象
let p = new Promise((resolve, reject) => {
    //连接成功
    mongoose.connection.on('open', () => {
        resolve();
    });
    //连接失败
    mongoose.connection.on('error', () => {
        reject();
    });
});

//暴露
module.exports = p;


//html
const mongoose = require('mongoose');
//引入 db.js
const p = require('./db/db');

p.then(value => {
    //结构对象
    const UserSchema = new mongoose.Schema({
        username:String,
        password:String,
        age: Number,
        gender: String
    })

    const UserModel = mongoose.model('users', UserSchema);

    //mongoose 提供 promise 的结果处理
    UserModel.find({username: 'abc'}).then(data => {
        console.log(data);
    });
}, reason => {
    console.log('连接失败, 请重试');
})


```



### 封装函数读取文件内容

```js
/**
 * 作用: 读取文件的中的内容
 * 封装一个函数 mineReadFile
 * 参数        path 文件路径
 * 返回结果    Promise 对象
 */

根据函数使用形式倒推封装函数:
mineReadFile('./resource/1.html')
.then(value=>{console.log(value.toString())}, reason=>{console.log('读取失败')})

//函数封装
const fs=require('fs');
function mineReadFile(path){
    return new Promise((resoleve, reject)=>{ //返回一个Promise对象
        //使用readFile读取文件内容
        fs.readFile(path, (err, data)=>{
            if(err){
                //调用reject函数
                reject(err);
            }
            //成功的状态,调用resolve函数
            resolve(data);
        })
    })
}

mineReadFile(path).then(value=>{console.log(value), reason=>{console.log(reason)}});

========================彻底封装=======================
const fs=require('fs');
function mineReadFile(path){
    return new Promise((resolve, reject)=>{
        fs.readFile(path,(err,data)=>{
            if err reject err;
            resolve(data);
        })
    }).then(value=>{console.log(value)}, reason=>{console.log(reason)})
}

mineReadFile(path);
```





### promisify

```
可以将 fs 模块中的异步的 API, 转化成返回 promise 对象形式的函数
```



```js
//nodejs中的内置模块
//传入一个错误优先的回调函数
const util=require('util');
const fs=require('fs');

//获取读取文件的函数 将函数转换为promise形态
const mineReadFile=util.promisify(fs.readFile);

========第二种形式===============
const {promisify}=require('util');
const myReadFile=promisify(require('fs').readFile);

//读取文件
mineReadFile('./resource/1.html')
.then(value=>{
    console.log(value.toString());
}, reason=>{
    console.log(reason);
})

```



###  如何将Promise.then中的值直接return出来

> https://www.wenyuanblog.com/blogs/javascript-how-to-return-value-in-promise.html

需求: 定义一个 `foo` 函数，在里面执行异步操作，然后取得 `Promise.then` 中的值并 `return` 出来，以便在别的地方使用该返回值。

不可能实现直接将 `Promise.then` 中的值 `return` 出来. 直接return那只将结果return到then中,如果赋值给外部变量,则存在同步异步问题

```javascript
//直接return

function foo() {
  let p = new Promise((resolve, reject) => {
    resolve('hello');
  });
  p.then(value => value);
}
let result = foo();
console.log(result); //undefined  foo函数没有返回值


//没有返回正确的值
function foo() {
  let result = '';
  let p = new Promise((resolve, reject) => {
    resolve('hello');
  })
  p.then(value => {
    result = value;
  })
  
  return result;
}

result = foo();
console.log(result); //''

前面声明了 result，而后面对它的赋值发生在异步操作中
```

正确的使用方式只能是：`return` 出 `Promise` 对象，然后在 `.then` 的执行体中处理异步请求得到的值（或者用 `async/await`）

```javascript
//异步请求封装成一个方法 并return异步请求的结果给变量

function getSomething() {
  return new Promise((resolve, reject) => {
    service.getList().then(res => {
      resolve(res);
    })
  })
}
//Promise + async实现
async function asyncFn() {
  let resultData = await getSomething();
  return result;
}

//then 不正确
asyncFn().then(value => {
  let data = value;
})
```



### 创建未完成状态的Promise

用Promise构造函数可以创建新的Promise,构造函数只接收一个参数: 包含初始化Promise代码的执行器(executor)函数. 执行器接受两个参数,分别是resolve()函数和reject()函数. 执行器成功完成时调用resolve()函数,反之失败则调用reject()函数. Promise的执行器会立即执行,然后才执行后续流程中的代码.

```javascript
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  
  resolve();
});
console.log('Hi');

//输出的内容
Promise
Hi
```

在执行器中，无论是调用resolve()还是reject()，都会向任务队列中添加一个任务来解决这个Promise。

### 如何改变promise的状态?

3种方式改变状态:

* resolve(value): 如果当前是pending就会变为fulfilled
* reject(reason): 如果当前是pending就会变为rejected
* 抛出异常: 如果当前是pending就会变为rejected

- 其他情况下的状态值都是pending.

```js
let p = new Promise((resolve, reject) => {
    // resolve();
    // reject();
    // throw '有点问题';  手动抛出错误
    // console.log(a);   a没有定义,由执行环境去抛出错误
});

console.log(p);
         
         
```



### 为Promise对象指定多个成功或失败的回调

```js
//当promise改变为对应状态时都会调用 多次调用then方法
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('error');
    }, 1000);
});

// //指定回调
p.then(value => {
    console.log(value);
}, reason => {
    console.error(reason);
});

p.then(value => {
    alert(value);
}, reason => {
    alert(reason);
});
```





### 改变promise状态和指定回调函数(then)谁先谁后

1.都有可能. 正常是先指定回调再改变状态

2.先改变状态再指定回调//同步

* 直接调用resolve()/reject()
* 延迟更长时间调用回调函数

```javascript
let p = new Promise((resolve, reject) => {
  setTimeout(() => { resolve('ok'), 1000})
});

setTimeout(() => {p.then(val => console.log(val)), 3000});
```

3.先指定回调函数再改变状态

```javascript
let p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('ok'), 1000);
});
p.then(val => console.log(val));
```

4.什么时候得到数据

* 如果先指定的回调函数,当状态发生改变时调用回调,得到数据
* 如果先改变的状态,当指定回调时候就会调用,得到数据





### promise.then()返回新的promise的结果状态由什么决定

> then方法的返回结果是一个promise对象

* 简单表达: 由then()指定的回调函数执行结果决定(<u>执行结果就是函数的返回值</u>)
* 详细表达:                                    
  * 如果抛出异常, 新promise变为rejected, reason为抛出的异常(throw抛出的值)
  * 如果返回非promise的任意值, 新promise变为fulfilled, 其值为返回值
  * 如果返回的是另一个新promise, 此promise的结果就会成为新promise的结果,其值也会为then方法的返回值.







### promise如何串连多个操作任务?

* promise的then()返回一个新的promise, 可以开成then()的链式调用
* 通过then的链式调用串连多个同步/异步任务



链式调用实例-读取多个文件

```js
//合并1-3个HTML文件

//普通写法 回调地狱
const fs=require('fs');

fs.readFile('./resource/1.html', (err, data)=>{
    if(err) throw err;
    fs.readFile('./resource/2.html', (err, data2)=>{
        if(err) throw err;
        fs.readFile('./resource/3.html', (err, data3)=>{
            if(err) throw err;
            console.log(data+data2+data3);//加号 自动转换成字符串
        })
    })
})

//promise
const fs=require('fs');

const p=new Promise((resolve, reject)=>{
    fs.readFile('./resource/1.html', (err, data)=>{
        if(err) reject(err);
        resolve(data);
    })
});

p.then(vlaue=>{
    return new Promise((resolve, reject)=>{
        fs.readFile('./resource/2.html', (err, data)=>{
            if(err) reject(err);
            resolve([value, data]);
        })
    })
}).then(value=>{
    return new Promise((resolve, reject)=>{
        fs.readFile('./resource/3.html' (err, data)=>{
            if(err) reject(err);
            resolve([...value, data])
        })
    })
}).then(vlaue=>{
    console.log(value.join(''));
}).catch((reaso n)=>{
    console.log(reason);
    fs.writeFileSync('./error.log', reason.path+'\r\n', {falg:'a'});//错误路径
})

//promisify
const {promisify}=require('util');
const mineReadFile=promisify(require('fs').readFile);
const p1 = mineReadFile('./resource/1.html');
const p2 = mineReadFile('./resource/2.html');
const p3 = mineReadFile('./resource/3.html');

const result=Promise.all([p1, p2, p3]);
result.then(value=>{
    console.log(value.join(''));
}, reason=>{
    console.log('读取失败');
})


//async和await
const {promisify}=require('util');
const readFile=promisify(require('fs').readFile);

async function mine(){
    const one = await readFile('./resource/1.html');
    const two = await readFile('./resource/2.html');
    const three = await readFile('./resource/3.html');
    
    return console.log(one+two+three);
}

mine();
```







### Promise异常穿透

* 当使用promise的then链式调用时, 可以在最后指定失败的回调, 
* 前面任何操作出了异常, 都会传到最后失败的回调中处理

```js

new Promise((resolve, reject) => {
    resolve('ok');
    // reject('error'); 假如是失败promise,依然会向后执行到catch
}).then(value => {
    //console.log(value);// ok 
    throw 'oh no'; //返回失败回调,向下执行,被catch获取
}).then(value => {
    console.log(value);// undefined
}).catch(reason => {
    console.error(reason);
});
```



### Promise中断链条

* 返回一个pending状态的promise对象 有且只有这一种方法: 中断方法 return new Promise(()=>{})

```js
const p=new Promise((resolve, reject)=>{
    console.log(11);
    resolve();
});
p.then((value)=>{
    console.log(22);
    return new Promise(()=>{});
}).then((value)=>{
    console.log(33);
}).then((value)=>{
    console.log(44);
}).then((value)=>{
    console.log(55);
})

//11
//22
// 自动返回的Promise{<pending>}
```




# JS异步之宏队列和微队列

> [从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节 - 掘金 (juejin.cn)](https://juejin.cn/post/6945319439772434469)

### 原因

* Js 是单线程都，但是一些高耗时操作就带来了进程阻塞问题。为了解决这个问题，Js 有两种任务的执行模式：**同步模式（Synchronous）和异步模式（Asynchronous）**。
* 在异步模式下，创建**异步任务主要分为宏任务与微任务两种**。ES6 规范中，宏任务（Macrotask） 称为 Task， 微任务（Microtask） 称为 Jobs。宏任务是由宿主（浏览器、Node）发起的，而微任务由 JS 自身发起。

分类

### 宏任务和微任务的几种创建方式

| 宏任务                 | 微任务                        |
| ---------------------- | ----------------------------- |
| setTimeout             | requestAnimationFrame(有争议) |
| setInterval            | MutationObserver(浏览器环境)  |
| MessageChannel         | Promise.[then/catch/finally]  |
| I/O, 事件队列          | process.nextTick(Node环境)    |
| setImmediate(Node环境) | queueMicrotask                |
| script(整体代码)       |                               |



<u>如何理解script整体代码是个宏任务呢?</u>

实际上如果同时存在两个 script 代码块，会首先在执行第一个 script 代码块中的同步代码，如果这个过程中创建了微任务并进入了微任务队列，第一个 script 同步代码执行完之后，会首先去清空微任务队列，再去开启第二个 script 代码块的执行。所以这里应该就可以理解 script（整体代码块）为什么会是宏任务。






```
1.	JS中用来存储[待执行回调函数]的队列包含2个不同特定的列队
2.	宏列队: 用来保存待执行的宏任务(回调函数), 比如: 定时器回调/DOM事件回调/ajax回调
3.	微列队: 用来保存待执行的微任务(回调), 比如: promise的回调/MutationObserver的回调
4.	JS执行时会区别这2个队列
(1)	JS引擎首先必须先执行所有的初始化同步任务代码
(2)	每次准备取出第一个宏任务执行前, 都要将所有的微任务一个一个取出来执行.微队列等级高于宏队列

```



```js
//因为是一道前端面试题，所以答案是以浏览器的eventloop机制为准的，在node平台上运行会有差异。
// https://www.cnblogs.com/fundebug/p/10095355.html

async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
}

async function async2() {
    console.log("async2");
}

console.log("script start");

setTimeout(function() {
    console.log("setTimeout");
}, 0);

async1();

new Promise(function(resolve) {
    console.log("promise1");
    resolve();
}).then(function() {
    console.log("promise2");
});

console.log("script end");

//打印结果:
script start
async1 start
async2
promise1
script end
async1 end
promise2
undefined
setTimeout
```







#### 试题1

```js
<script type="text/javascript">
//宏队列 1
//微队列 3 4
//同步 2 5
 
    setTimeout(() => {
        console.log(1)
    }, 0)
    new Promise((resolve) => {
        console.log(2)
        resolve()
    }).then(
        () => {
        console.log(3)
    }).
    then(
        () => {
        console.log(4)
    })
    console.log(5)

</script> 
```





#### 案例2

```HTML
<script type="text/javascript">
    //同步  3 7 4
    //微队列 1 2
    //宏队列 5 
    let first = () => (new Promise((resolve, reject) => {
        console.log(3)
        let p = new Promise((resolve, reject) => {
            console.log(7)
            setTimeout(() => {
                console.log(5)
                resolve(6)
            }, 0)
            resolve(1)
        })
        resolve(2)
        p.then((arg) => {
            console.log(arg)
        })
    }))
    first().then((arg) => {
        console.log(arg)
    })
    console.log(4)
</script>
```



#### 案例3

```js
<script type="text/javascript">
    
    setTimeout(() => {
        console.log("0")
    }, 0);

    new Promise((resolve, reject) => {
        console.log("1")
        resolve()
    }).then(() => {
        console.log("2")
        new Promise((resolve, reject) => {
            console.log("3")
            resolve()
        }).then(() => {
            console.log("4")
        }).then(() => {
            console.log("5")
        })
    }).then(() => {
        console.log("6")
    });

    new Promise((resolve, reject) => {
        console.log("7")
        resolve()
    }).then(() => {
        console.log("8")
    })

    
</script>
```





#### Promise+setTimeout+Async执行顺序

> [setTimeout+Promise+Async输出顺序？很简单呀！ - 掘金 (juejin.cn)](https://juejin.cn/post/7016298598883131423)

##### JS执行机制

* 遇到 同步代码 直接执行
* 遇到 异步代码 先放一边, 并将它的回调函数存起来,存的地方叫做 事件队列
* 等所有同步代码都执行完, 再从事件队列中把存起来的所有 异步回调函数 拿出来按顺序执行



##### 宏任务和微任务

`事件队列`是用来存异步回调的，但是异步也分类型啊，异步任务分为`宏任务`和`微任务`，并且**微任务执行时机先于宏任务**

| #                         | 浏览器 | Node |
| ------------------------- | ------ | ---- |
| **I/O**                   | ✅      | ✅    |
| **setTimeout**            | ✅      | ✅    |
| **setInterval**           | ✅      | ✅    |
| **setImmediate**          | ❌      | ✅    |
| **requestAnimationFrame** | ✅      | ❌    |

##### 微任务

| #                                        | 浏览器 | Node |
| ---------------------------------------- | ------ | ---- |
| **Promise.prototype.then catch finally** | ✅      | ✅    |
| **process.nextTick**                     | ❌      | ✅    |
| **MutationObserver**                     | ✅      | ❌    |

##### 执行顺序

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df0c109150d34369913d7039a6f41370~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)



##### 案例

**步骤:**

1.标记区分异步和同步

2.异步中,标记区分宏任务和微任务

3.分轮数,一轮一轮慢慢走

```javascript
console.log(1) //同步
setTimeout(() => {
  console.log(2) //异步: 宏任务 setTimeout1
  Promise.resolve().then(() => { //异步: 微任务 then1
    console.log(3)
  })
});
console.log(4) //同步
new Promise((resolve,reject) => {
  console.log(5)//同步
  resolve()
}).then(() => {//异步 微任务 then2
  console.log(6)
  setTimeout(() => {//异步 宏任务 setTimeout2
    console.log(7)
  })
})
console.log(8) //宏任务

```

分轮:

| 轮数   | 说明                    | 输出       | 产生                                        | 剩余                                                |
| ------ | ----------------------- | ---------- | ------------------------------------------- | --------------------------------------------------- |
| 第一轮 | 执行外层同步输出        | 1，4，5，8 | 宏任务：`setTimeout1` <br />微任务：`then2` | 宏任务：`setTimeout1` <br />微任务：`then2`         |
| 第二轮 | 执行微任务`then2`       | 6          | 宏任务：`setTimeout2` 微任务：无            | 宏任务：`setTimeout1，setTimeout2` <br />微任务：无 |
| 第三轮 | 执行宏任务`setTimeout1` | 2          | 宏任务：无 微任务：`then1`                  | 宏任务：`setTimeout2` 微任务：`then1`               |
| 第四轮 | 执行微任务`then1`       | 3          | 宏任务：无 微任务：无                       | 宏任务：`setTimeout2` 微任务：无                    |
| 第五轮 | 执行宏任务`setTimeout2` | 7          | 宏任务：无 微任务：无                       | 宏任务：无 微任务：无                               |



```javascript
new Promise((resolve,reject)=>{
  console.log(1)  //同步
  resolve()
}).then(()=>{ //异步 then1
  console.log(2)
  new Promise((resolve,reject)=>{
      console.log(3) //同步
      resolve()
  }).then(()=>{ //异步then2
      console.log(4)
  }).then(()=>{ //异步then3
      console.log(5)
  })
}).then(()=>{ //异步then4
  console.log(6)
})
```

这里执行then1,产生微任务then2, then4的解释 ????



| 轮数 | 说明             | 输出 | 产生                                 | 剩余                                 |
| ---- | ---------------- | ---- | ------------------------------------ | ------------------------------------ |
| 1    | 执行同步输出     | 1    | 宏任务: 无<br />微任务: then1        | 宏任务: 无<br />微任务: then1        |
| 2    | 执行微任务then1  | 2,3  | 宏任务: 无<br />微任务: then2, then4 | 宏任务: 无<br />微任务: then2, then4 |
| 3    | 执行then2, then4 | 4,6  | 宏任务: 无<br />微任务: then3        | 宏任务: 无<br />微任务: then3        |
| 4    | 执行微任务then3  | 5    | 宏任务: 无<br />微任务: 无           | 宏任务: 无<br />微任务: 无           |

```javascript
setTimeout(() => {
  console.log("0") //异步 宏任务 setTimeout1
}, 0)

new Promise((resolve,reject)=>{
  console.log("1") //同步
  resolve()
}).then(()=>{ //异步 微任务 then1        
  console.log("2")
  new Promise((resolve,reject)=>{
    console.log("3") //同步
    resolve()
  }).then(()=>{      //异步 微任务 then4
    console.log("4")    
  }).then(()=>{      //异步 微任务 then5
    console.log("5")    
  })
}).then(()=>{       //异步 微任务 then6
  console.log("6")
})

new Promise((resolve,reject)=>{
  console.log("7")  //同步
  resolve()
}).then(()=>{       //异步 微任务 then8
  console.log("8")
})
```

| 轮数 | 说明                     | 输出  | 产生                                              | 剩余                                          |
| ---- | ------------------------ | ----- | ------------------------------------------------- | --------------------------------------------- |
| 1    | 执行同步输出             | 1,7   | 宏任务: setTimeout1<br />微任务: then1, then8     | 宏任务: setTimeout1<br />微任务: then1, then8 |
| 2    | 执行微任务: then1,then8  | 2,3,8 | 宏任务: setTimeout1<br />微任务: then4, then6 ??? | 宏任务: setTimeout1<br />微任务: then4, then6 |
| 3    | 执行微任务: then4, then6 | 4,6   | 宏任务: setTimeout1<br />微任务: then5            | 宏任务: setTimeout1<br />微任务: then5        |
| 4    | 执行微任务: then5        | 5     | 宏任务: setTimeout1<br />微任务: 无               | 宏任务: setTimeout1<br />微任务: 0            |
| 5    | 执行宏任务               | 0     | 宏任务: 无<br />微任务: 无                        |                                               |





```javascript
new Promise((resolve, reject) => {
  console.log(1)
  resolve()
}).then(() => {
  console.log(2)
  // 多了个return
  return new Promise((resolve, reject) => {
    console.log(3)
    resolve()
  }).then(() => {
    console.log(4)
  }).then(() => { // 相当于return了这个then的执行返回Promise
    console.log(5)
  })
}).then(() => {
  console.log(6)
})
```



```javascript
async function async1() {
  console.log(1); //同步
  await async2(); //同步
  console.log(2); //同步
}
async function async2() {
  console.log(3);
}
console.log(4);//同步
setTimeout(function () { //异步 宏任务
  console.log(5);
});
async1()//同步
new Promise(function (resolve, reject) {
  console.log(6); //同步
  resolve();
}).then(function () { //异步 微任务
  console.log(7);
});
console.log(8); //同步

```

第一步: 

```javascript
async function async1() {
  console.log(1);
  await async2();
  console.log(2);
}
async function async2() {
  console.log(3);
}

new Promise((resolve, reject) => {
  setTimeout(() => { //异步, 宏任务 setTimeout1
    resolve()
    console.log(4)
  }, 1000);
}).then(() => { //异步 微任务 then1
  console.log(5)
  new Promise((resolve, reject) => {
    setTimeout(() => { //异步 宏任务setTimeout3
      async1() //异步 微任务async1
      resolve()
      console.log(6)
    }, 1000)
  }).then(() => { //异步 微任务then7
    console.log(7)
  }).then(() => { //异步 微任务8
    console.log(8)
  })
}).then(() => {//异步 微任务9
  console.log(9)
})

new Promise((resolve, reject) => {
  console.log(10) // 同步
  setTimeout(() => { //异步, 宏任务 setTimeout2
    resolve()
    console.log(11)
  }, 3000);
}).then(() => { //异步 微任务 then12
  console.log(12)
})
```



```javascript
async1 转换成 new Promise



new Promise((resolve, reject) => {
  setTimeout(() => { //异步 宏任务 setTimeout1
    resolve()
    console.log(4)
  }, 1000);
}).then(() => { //异步 then5
  console.log(5)
  new Promise((resolve, reject) => {
    setTimeout(() => { //异步 宏任务 setTimeout3
      // async1()
      console.log(1);
      new Promise((resolve, reject) => {
        console.log(3)
      }).then(() => { //异步 then2
        console.log(2)
      })
      resolve()
      console.log(6)
    }, 1000)
  }).then(() => { //异步then7
    console.log(7)
  }).then(() => { //异步then8
    console.log(8)
  })
}).then(() => { //异步then9
  console.log(9)
})

new Promise((resolve, reject) => {
  console.log(10) // 同步
  setTimeout(() => { //异步, 宏任务setTimeout2
    resolve()
    console.log(11)
  }, 3000);
}).then(() => { //异步then12
  console.log(12)
})
```



| 轮数 | 执行                             | 输出    | 产生                                              | 剩余                                               |
| ---- | -------------------------------- | ------- | ------------------------------------------------- | -------------------------------------------------- |
| 1    | 同步输出                         | 10      | 宏任务: setTimeout1, setTimeout2<br />微任务: 无  | 宏任务: setTimeout1, setTimeout2<br />微任务: 无   |
| 2    | 宏任务: setTimeout1, setTimeout2 | 4       | 宏任务: setTimeout2<br />微任务:  then5, then12   | 宏任务: setTimeout2<br />微任务: then5, then12     |
| 3    | 微任务: then5                    | 5       | 宏任务: setTimeout3,setTimeout2<br />微任务:then9 | 宏任务: setTimeout3 setTimeout2<br />微任务: then9 |
| 4    | 微任务: then9                    | 9       | 宏任务: setTimeout3 setTimeout2<br />微任务: 无   | 宏任务: setTimeout3 setTimeout2<br />微任务: 无    |
| 5    | 宏任务: setTimeout3              | 1,3,6,2 | 宏任务: setTimeout2<br />微任务: then7            | 宏任务: setTimeout2<br />微任务: then7             |
| 6    | 微任务: then7                    | 7       | 宏任务: setTimeout2<br />微任务: then8            | 宏任务: setTimeout2<br />微任务: then8             |
| 7    | 微任务: then8                    | 8       | 宏任务: setTimeout2<br />微任务: 无               | 宏任务: setTimeout2<br />微任务: 无                |
| 8    | 宏任务: setTimeout2              | 11      | 宏任务: 无<br />微任务: then12                    | 宏任务: 无<br />微任务: then12                     |
| 9    | 微任务 then12                    | 12      | 宏任务: 无<br />微任务: 无                        | 宏任务: 无<br />微任务: 无                         |



##### 案例4

> [从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节 - 掘金 (juejin.cn)](https://juejin.cn/post/6945319439772434469#heading-15)

```javascript
Promise.resolve().then(() => { //then0
  console.log(0);
  return Promise.resolve(4); //
}).then((res) => {  //then4
  console.log(res)
})

Promise.resolve().then(() => { //then1
  console.log(1);
}).then(() => { //then2
  console.log(2);
}).then(() => { //then3
  console.log(3);
}).then(() => { //then5
  console.log(5);
}).then(() =>{ ////then6
  console.log(6);
})
```

| 分轮 | 说明                | 输出 | 产生      | 剩余 |
| ---- | ------------------- | ---- | --------- | ---- |
| 1    | 执行异步then0,then1 | 0,1  | 新Promise |      |


### Promise题目

> https://juejin.cn/post/6844903625609707534
> https://juejin.cn/post/6844904077537574919
> https://juejin.cn/post/6945319439772434469#heading-31
> https://juejin.cn/post/6844903625769091079
> https://juejin.cn/post/6994594642280857630






##### 如果100个请求,使用Promise怎么控制并发  ??
>https://juejin.cn/post/7219961144584552504

题目
```js
// sendRequest(requestList:, limits, callback): void
sendRequest(
    [
        () => request('1'),
        () => request('2'),
        () => request('3'),
        () => request('4')
    ],
    3, // 并发数
    (res) => {
        console.log(res)
    }
)

// 其中 request 可以是：
function request(url, time = 1) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('请求结束：' + url);
            if (Math.random() > 0.5) {
                resolve('成功')
            } else {
                reject('错误')
            }
        }, time * 1e3)
    })
}
在格式化后的代码中，我们将每个参数放在新的一行，并使用适当的缩进来提高可读性。此外，我们还添加了注释来说明每个参数的作用。
```

概念
并发(Concurrency):同一时间段内多个任务都在进行,但不一定同时进行。每个任务会互相切换执行,由操作系统根据一定的调度算法决定哪个任务该执行。
并发控制: 意思是多个并发的任务，一旦有任务完成，就立刻开启下一个任务
切片控制: 将并发任务切片的分配出来，比如10个任务，切成2个片，每片有5个任务，当前一片的任务执行完毕，再开始下一个片的任务，这样明显效率没并发控制那么高了

并行(Parallelism):多个任务同时进行,真正意义上的同时进行。一般需要多核CPU才能实现并行。
```js
// 两个任务依次执行,互相切换
console.log('Start task 1');
setTimeout(() => console.log('Task 1 finished'), 1000);

console.log('Start task 2'); 
setTimeout(() => console.log('Task 2 finished'), 1000);
```
在多核CPU上,并行的例子可能输出:
```js
并发和并行是两个概念:

并发(Concurrency):同一时间段内多个任务都在进行,但不一定同时进行。每个任务会互相切换执行,由操作系统根据一定的调度算法决定哪个任务该执行。

并行(Parallelism):多个任务同时进行,真正意义上的同时进行。一般需要多核CPU才能实现并行。

例子:

并发(Concurrency)的例子:
```js
// 两个任务依次执行,互相切换
console.log('Start task 1');
setTimeout(() => console.log('Task 1 finished'), 1000);

console.log('Start task 2'); 
setTimeout(() => console.log('Task 2 finished'), 1000);
```

并行(Parallelism)的例子,需要在多核CPU上执行:
```js
// 两个任务同时执行
console.log('Start task 1');
setTimeout(() => console.log('Task 1 finished'), 1000);

console.log('Start task 2');
setTimeout(() => console.log('Task 2 finished'), 1000);
```

在单核CPU上,上面的两个例子的输出都是:

```
Start task 1 
Start task 2
Task 1 finished
Task 2 finished
```

但在多核CPU上,并行的例子可能输出:
```js
Start task 1 
Start task 2 
Task 1 finished
Task 2 finished 
```
或
```js
Start task 1
Task 1 finished
Start task 2
Task 2 finished
```

这是因为两个任务可以同时执行,不需要互相切换.

```text
首先执行能执行的并发任务，根据并发的概念，每个任务执行完毕后，捞起下一个要执行的任务。

将关键步骤拆分出合适的函数来组织代码

1.  循环去启动能执行的任务
    
2.  取出任务并且推到执行器执行
    
3.  执行器内更新当前的并发数，并且触发捞起任务
    
4.  捞起任务里面可以触发最终的回调函数和调起执行器继续执行任务
```

```js
function sendRequest(requestList, limits, callback) {
  const promises = requestList; // 取得请求list
  const concurrentNum = Math.min(limits, requestList.length); // 得到开始时，能执行的并发数
  let concurrentCount = 0; // 当前并发数 

  // 第一次先跑起可以并发的任务
  const runTaskNeeded = () => {
    let i = 0;
    while (i < concurrentNum) {
      i++;
      runTask();
    }
  };

  // 取出任务并且执行任务
  const runTask = () => {
    const task = promises.shift();
    task && runner(task);
  };

  // 执行器
  // 执行任务，同时更新当前并发数
  const runner = async (task) => {
    try {
      concurrentCount++;
      await task();
    } catch (error) {
    } finally {
      // 并发数--
      concurrentCount--;
      // 捞起下一个任务
      picker();
    }
  };

  // 捞起下一个任务
  const picker = () => {
    if (concurrentCount < limits && promises.length > 0) {
      // 任务队列里还有任务并且此时还有剩余并发数的时候 执行
      // 继续执行任务
      runTask();
      // 队列为空的时候，并且请求池清空了，就可以执行最后的回调函数了
    } else if (promises.length == 0 && concurrentCount == 0) {
      // 执行结束
      callback && callback();
    }
  };

  // 入口执行
  runTaskNeeded();
}
```

另一种实现
核心代码是判断是当你 【有任务执行完成】 ，再去判断是否有剩余还有任务可执行。可以先维护一个pool（代表当前执行的任务），利用await Promise.race这个pool，不就知道是否有任务执行完毕了吗？
```js
async function sendRequest(requestList, limits, callback) {
  // 维护一个promise队列
  const promises = [];
  // 当前的并发池,用Set结构方便删除
  const pool = new Set(); // set也是Iterable<any>[]类型，因此可以放入到race里

  // 开始并发执行所有的任务
  for (let request of requestList) {
    // 开始执行前，先await 判断 当前的并发任务是否超过限制
    if (pool.size >= limits) {
      // 这里因为没有try catch ，所以要捕获一下错误，不然影响下面微任务的执行
      await Promise.race(pool)
        .catch((err) => err);
    }

    const promise = request(); // 拿到promise
    // 删除请求结束后，从pool里面移除
    const cb = () => {
      pool.delete(promise);
    };
    // 注册下then的任务
    promise.then(cb, cb);
    pool.add(promise);
    promises.push(promise);
  }

  // 等待所有promise完成，调用回调函数
  Promise.allSettled(promises).then(callback, callback);
}
```

