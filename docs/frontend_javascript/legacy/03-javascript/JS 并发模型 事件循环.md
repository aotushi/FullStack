
# 事件循环
> <<TypeScript全栈开发>> - 15.1异步任务运行机制

## 异步编程的背景

> JS代码是单线程执行的,即同一时间只能执行一个任务。

JavaScript之所以不支持**多线程**执行，主要由于它起源于浏览器。
作为浏览器脚本，它会与用户进行交互，并操作UI的DOM结构，如果支持多线程并发操作，将会引起比较复杂的问题，例如，线程1在DOM上添加一个节点，而线程2删除该节点，此时操作将出现冲突。为了避免产生这类问题，JavaScript被设计成了单线程执行模式。

> 同步编程的局限在于，某些耗时长的操作会一直等待,CPU闲置,效率低,体验差

如果某句代码或某段代码执行比较耗时（如网络通信、文件存取、数据库连接等）​，程序将一直等待，直到这句代码或这段代码执行完。在此之前，整个程序都将陷入阻塞。如果是计算量大还行,但是大多数情况下CPU是闲置的,所以此种情况下采用同步编程效率低,体验差.


## 异步编程的机制
>https://github.com/kvchen95/blog/blob/master/docs/js/event-loop.md

### what/why/how
**是什么**?
给JS分配任务的过程就是`EventLoop`.

**为什么?**
JavaScript 是单线程的，但它需要处理很多异步操作（比如加载图片、发送网络请求等）。如果让 JS 一直等待这些异步操作完成，就会导致程序卡住，无法继续执行其他任务。为了解决这个问题，JS 把这些异步操作交给宿主环境（如浏览器或 Node.js）去处理，自己则继续执行后面的代码。等到异步操作完成后，宿主环境会通知 JS，JS 再回过头来处理这些异步任务的后续逻辑。

但是，任务一多，JS 就需要知道这些任务的执行顺序。于是，**任务队列** 就诞生了。任务队列就像一个待办事项列表，JS 会按照队列中的顺序依次处理任务。

在 JS 中，异步任务分为两种：

1. **浏览器处理的任务**（如 `setTimeout`、图片加载）：这些任务是由宿主环境处理的，完成后会被放入 **宏任务队列**。
    
2. **JS 自身的异步任务**（如 `Promise`、`async/await`）：这些任务是 JS 语言本身提供的，完成后会被放入 **微任务队列**。
    

为了确保任务的有序执行，JS 设计了一套规则：

- **微任务队列** 的优先级高于 **宏任务队列**。
    
- 每当一个宏任务执行完毕后，JS 会立即检查并执行所有微任务，直到微任务队列为空，才会继续执行下一个宏任务。
    

**事件循环（EventLoop）** 就是用来实现这套任务调度机制的。它不断地从任务队列中取出任务并执行，确保 JS 能够高效地处理同步任务和异步任务。

事件循环就是用来实现`事件调度`的. 

**事件循环的How?**

1. 执行全局同步代码. 也就是变量声明和赋值, 函数定义,等等.

2. 将异步任务放入对应的队列
	2.1 在执行全局同步代码的过程中，如果遇到异步任务（如 `setTimeout`、`Promise`），JS 会根据任务类型将其放入相应的队列：

	2.2 **宏任务队列**：存放由宿主环境处理的异步任务，如 `setTimeout`、`setInterval`、DOM 事件、AJAX 请求等。
    
	2.3 **微任务队列**：存放 JS 自身的异步任务，如 `Promise` 的 `then` 回调、`async/await`、`MutationObserver` 等。

3. 全局同步代码执行完毕. 此时事件循环开始工作,宏任务队列和微任务队列中可能已经有任务了.

4. **执行宏任务**：EventLoop 从宏任务队列中取出一个任务执行。 
	1. 这个任务可能是: 初始的脚本代码
	2. 后续的`setTimeout`, `setInterval`回调
    
5.  **执行所有微任务**：在当前宏任务执行过程中，如果产生微任务（如 Promise 的 `then` 回调），这些微任务会被放入微任务队列。在当前宏任务执行完毕后，EventLoop 会立即执行所有微任务，直到微任务队列为空。
    
- **渲染更新**：在浏览器环境中，执行完微任务后，可能会进行页面的渲染更新。
    
- **重复循环**：EventLoop 继续从宏任务队列中取出下一个任务，重复上述过程。



**事件调度的原因?**
由于 JavaScript 是单线程的，且运行在宿主环境（如浏览器或 Node.js）中，EventLoop 帮助 JavaScript 在等待异步任务（如网络请求、文件读取等）完成时，继续执行其他任务。

**事件循环如何实现事件调度?**

JS中的异步任务可以分为两类?
1. 浏览器处理的任务:  - 这类任务是由宿主环境（浏览器）处理的，JavaScript 只是调用浏览器的 API（如 `img.src`）来触发任务。- 当任务完成后，浏览器会将回调函数（如 `onload`）放入 **宏任务队列** 中，等待 EventLoop 调度执行。
2. JS自身的异步任务: 例如Promise的回调. `async/await`、`MutationObserver` 等。这些任务是 JavaScript 语言本身提供的异步机制。- 这些任务会被放入 **微任务队列** 中，EventLoop 会在当前宏任务执行完毕后，立即执行所有微任务。








![[tx23852.jpg]]
## 异步编程模式
基于JS异步编程机制,先后诞生了不同的异步编程模式:
* 回调函数
* Promise对象
* async/await语法



















#### 多进程和多线程

1.进程: 程序的一次执行, 它占有一片独有的内存空间

2.线程: CPU的基本调度单位, 是程序执行的一个完整流程



##### 进程与线程

1.一个进程中一般至少有一个运行的线程: 主线程

2.一个进程中也可以同时运行多个线程, 我们会说程序是多线程的

3.一个进程内的数据可以供其中的多个线程直接共享

4.多个进程之间的数据是不能直接共享的,可桥接



#### 浏览器进程分类

Firefox, IE: 单进程

Chrome, edge: 多进程



##### 查看浏览器是否多进程

任务管理器-进程



##### 浏览器运行是单线程还是多线程?

都是多线程运行的.



#### JS单线程

##### 如何证明JS执行是单线程的?

* setTimeout()的回调函数是在主线程执行的
* **定时器, 回调函数**只有在运行栈中的代码全部执行完后才有可能执行  //定时器是同步,回调函数是异步. 事件是同步, 回调是异步.

##### 为什么JS要用单线程模式, 而非多线程模式





#### 实例

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<script type="text/javascript">
//      定时器方法执行 本身是同步的  回调函数的执行是异步的
//      事件的绑定是同步的  但是事件回调函数的触发执行  是异步的
    box.onclick = function () {
          setTimeout(function () {
            console.log('哈哈哈')
        },3000);
    }
    var a = 0;
    for (var i = 0; i < 50000; i++) {
        for (var j = 0; j < 50000; j++) {
            a++;
        }
    }
    console.log(a)
   //setTimeout()
</script>
</body>
</html>
```



 

#### 同步异步

同步: 同步执行完成才会去执行异步

异步: 只要是异步的任务都会有自己的管理模块进行托管



### 事件循环模型

1.所有代码分类

* 初始化执行代码(同步代码): 包含绑定dom事件监听, 设置定时器, 发送ajax请求的代码
* 回调执行代码(异步代码): 处理回调逻辑

2.JS引擎执行代码的基本流程:

​	初始化代码 ---> 回调代码

3.模型的2个重要组成部分

* 事件管理模块
* 回调队列

4.模型的运转流程

* 执行初始化代码, 将事件回调函数交给对应模块管理
* 当事件发生时, 管理模块会将回调函数及其数据添加到回调队列中





### webworker ??

webworker模拟多线程

1.H5规范提供了JS分线程的实现, 取名为: Web Worker

2.相关API

* Worker: 构造函数, 加载分线程执行的JS文件
* Worker.prototype.onmessage: 用于接收另一个线程的回调函数
* Worker.prototype.postMessage: 向另一个线程发送消息

每个线程可以向不同线程发送消息, 也可以接收不同线程传来的消息

主线程操作

 发送消息: worker.postMessage(消息可以是任何数据)

 接收消息: worker.onmessage = function(event){console.log(event.date)} //接收到的消息或者数据在时间对象的data属性当中



子线程操作

发送消息: this.postMessage(消息可以是任何数据)

接受消息: this.onmessage = function(event){ console.log(event.data)} //接收的消息或者数据在时间对象的data属性当中



3.不足:

* worker内代码不能操作DOM
* 不能跨域加载JS
* 不是每个浏览器都支持这个新特性



```html
- webworker.html


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<script type="text/javascript">
    console.log('今天晚上吃点啥');
//    var a = 0;
//    for (var i = 0; i < 30000; i++) {
//        for (var j = 0; j < 30000; j++) {
//            a++
//        }
//    }
    
//  构造函数调用  传入用于启动分线程的文件路径
    var myWorker = new Worker('mywork.js');
//  postMessage 由主线程 向子线程  传输数据
    myWorker.postMessage(50000);
//  主线程接收子线程 传回来的数据
    myWorker.onmessage = function (event) {
      console.log(event.data);
    }
</script>
</body>
</html>
```



```js
- mywork.js

function fun(a){
	var b = 0;
	for(var i=0; i<a; i++){
        for(var j=0; j<a; j++){
            b++;
        }
    }
    return b;
}
// onmessage 当主线程向子线程传输信息之后, 这个事件的回调函数就会触发
// 用事件对象上的一个属性来获取主线程post过来的数据, event.data
self.onmessage = function(event){
    var result = fun(event.data);
    self.postMessage(result);
}
```



### 最佳实践

#### 异步代码的几个推荐做法

> [写好 JavaScript 异步代码的几个推荐做法 (qq.com)](https://mp.weixin.qq.com/s/1Py2vPwjjqw17rn-uBfJ7g)
>
> https://maximorlov.com/linting-rules-for-asynchronous-code-in-javascript/


##### no-async-promise-executor

不建议将 `async` 函数传递给 `new Promise` 的构造函数。

```js
// ❌
new Promise(async (resolve, reject) => {});

// ✅
new Promise((resolve, reject) => {});
```

首先，你在 `Promise` 的构造函数里去使用 `async` ，那么包装个 `Promise` 可能就是没啥必要的。另外，如果 `async` 函数抛出了异常，新构造的 `promise` 实例并不会 `reject` ，那么这个错误就捕获不到了。



##### no-await-in-loop

不建议在循环里使用 `await`，有这种写法通常意味着程序没有充分利用 `JavaScript` 的事件驱动。

建议将这些异步任务改为并发执行，这可以大大提升代码的执行效率。

```js
// ❌
for (const url of urls) {
  const response = await fetch(url);
}

// ✅
const responses = [];
for (const url of urls) {
  const response = fetch(url);
  responses.push(response);
}

await Promise.all(responses);
```



##### no-promise-executor-return

不建议在 `Promise` 构造函数中返回值，`Promise` 构造函数中返回的值是没法用的，并且返回值也不会影响到 `Promise` 的状态。

正常的做法是将返回值传递给 `resolve`，如果出错了就传给 `reject`。

```js
// ❌
new Promise((resolve, reject) => {
  return result;
});

// ✅
new Promise((resolve, reject) => {
  resolve(result);
});
```



##### require-atomic-updates ??

不建议将赋值操作和 `await` 组合使用，这可能会导致条件竞争。

看看下面的代码，你觉得 `totalPosts` 最终的值是多少？

```js
// ❌
let totalPosts = 0;

async function getPosts(userId) {
  const users = [{ id: 1, posts: 5 }, { id: 2, posts: 3 }];
  //await sleep(Math.random() * 1000);
  await setTimeout(() => {}, Math.random()*1000);
  return users.find((user) => user.id === userId).posts;
}

async function addPosts(userId) {
  totalPosts += await getPosts(userId);
}

await Promise.all([addPosts(1), addPosts(2)]);
console.log('Post count:', totalPosts);
```

`totalPosts` 会打印 3 或 5，并不会打印 8

问题在于读取 `totalPosts` 和更新 `totalPosts` 之间有一个时间间隔。这会导致竞争条件，<span style="color:red">当值在单独的函数调用中更新时，更新不会反映在当前函数范围中</span>。因此，两个函数都会将它们的结果添加到 `totalPosts` 的初始值0。

避免竞争条件正确的做法：

```js
// ✅
let totalPosts = 0;

async function getPosts(userId) {
  const users = [{ id: 1, posts: 5 }, { id: 2, posts: 3 }];
  await sleep(Math.random() * 1000);
  return users.find((user) => user.id === userId).posts;
}

async function addPosts(userId) {
  const posts = await getPosts(userId);
  totalPosts += posts; // variable is read and immediately updated
}

await Promise.all([addPosts(1), addPosts(2)]);
console.log('Post count:', totalPosts);
```



##### max-nested-callbacks

防止回调地狱，避免大量的深度嵌套：

回调地狱让代码难以阅读和维护，建议将回调都重构为 `Promise` 并使用现代的 `async/await` 语法。

```js
/* eslint max-nested-callbacks: ["error", 3] */

// ❌
async1((err, result1) => {
  async2(result1, (err, result2) => {
    async3(result2, (err, result3) => {
      async4(result3, (err, result4) => {
        console.log(result4);
      });
    });
  });
});

// ✅
const result1 = await asyncPromise1();
const result2 = await asyncPromise2(result1);
const result3 = await asyncPromise3(result2);
const result4 = await asyncPromise4(result3);
console.log(result4);
```



##### no-return-await

返回异步结果时不一定要写 `await` ，如果你要等待一个 `Promise`，然后又要立刻返回它，这可能是不必要的。

```js

// ❌
async () => {
  return await getUser(userId);
}
```

从一个 `async` 函数返回的所有值都包含在一个 `Promise` 中，你可以直接返回这个 `Promise`。

```js
// ✅
async () => {
  return getUser(userId);
}
```

当然，也有个例外，如果外面有 `try...catch` 包裹，删除 `await` 就捕获不到异常了，在这种情况下，建议明确一下意图，把结果分配给不同行的变量。

```js
// 👎
async () => {
  try {
    return await getUser(userId);
  } catch (error) {
    // Handle getUser error
  }
}

// 👍
async () => {
  try {
    const user = await getUser(userId);
    return user;
  } catch (error) {
    // Handle getUser error
  }
}
```



##### prefer-promise-reject-errors

建议在 `reject Promise` 时强制使用 `Error` 对象，这样可以更方便的追踪错误堆栈。

```js
// ❌
Promise.reject('An error occurred');

// ✅
Promise.reject(new Error('An error occurred'));
```



##### node/handle-callback-err

强制在 `Node.js` 的异步回调里进行异常处理。

在 `Node.js` 中，通常将异常作为第一个参数传递给回调函数。忘记处理这些异常可能会导致你的应用程序出现不可预知的问题。

如果函数的第一个参数命名为 `err` 时才会触发这个规则，你也可以去 `.eslintrc` 文件里自定义异常参数名。

```js
// ❌
function callback(err, data) {
  console.log(data);
}

// ✅
function callback(err, data) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(data);
}
```



##### node/no-sync

不建议在存在异步替代方案的 `Node.js` 核心 `API` 中使用同步方法。

在`Node.js` 中对 `I/O` 操作使用同步方法会阻塞事件循环。大多数场景下，执行 `I/O` 操作时使用异步方法是更好的选择。

```js
// ❌
const file = fs.readFileSync(path);

// ✅
const file = await fs.readFile(path);
```



##### @typescript-eslint/await-thenable

不建议 `await` 非 `Promise` 函数或值。

```js
// ❌
function getValue() {
  return someValue;
}

await getValue();

// ✅
async function getValue() {
  return someValue;
}

await getValue();
```



##### @typescript-eslint/no-floating-promises

建议 `Promise` 附加异常处理的代码。

```js
// ❌
myPromise()
  .then(() => {});

// ✅
myPromise()
  .then(() => {})
  .catch(() => {});
```



##### @typescript-eslint/no-misused-promises

不建议将 `Promise` 传递到并非想要处理它们的地方，例如 if 条件。

```js
// ❌
if (getUserFromDB()) {}

// ✅ 👎
if (await getUserFromDB()) {}
```

更推荐抽一个变量出来提高代码的可读性。

```js
// ✅ 👍
const user = await getUserFromDB();
if (user) {}
```


