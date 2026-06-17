---
aliases: async, await
---


async/await 是以更舒适的方式使用promise的一种特殊语法.

### 实现原理 /未完成

> [Async 是如何被 JavaScript 实现的 (qq.com)](https://mp.weixin.qq.com/s/FfDe9mpEvJF17lW8eqMLLQ)



#### aysnc/await 概述

* `async`用来描述`async`函数的. 函数的返回值为promise对象.
* promise对象的结果和状态由`async`函数的返回值决定. 返回规则和then方法回调返回结果是一样的.
  * 如果返回结果是非promise类型的值,则返回值是成功的promise
  * 抛出一个错误, 函数的状态为失败状态rejected, 错误值为函数返回值.
  * 如果返回结果是promise类型的值, 则promise的状态和值决定了async这个promise的状态和返回
* await右侧的表达式一般为promise对象, 但也可以是其它的值
  * 如果表达式是promise对象, await返回的是promise成功的值.如果是失败的值,await会把promise的异常抛出, 并使用try..catch捕获错误.
  * 如果表达式是其它值, 直接将此值作为await的返回值
* await...后面的代码相当于放到成功的回调中
* await调用函数后, 当前函数后边所有代码会在当前函数执行完毕后, 被放入到微任务队列中.
* await只能用于async函数或es模块顶级作用域中

```js

async function fn1() {
	console.log(1)
	await console.log(2)
	console.log(3)
}

fn1()

console.log(4)

//1 2 4 3
```



### async function

#### 概述

async是一个关键字,用来描述函数: 即这个函数总是会返回一个promise. 其他值将自动被包装在一个 resolved的promise中.



### await

#### 概述

* 只能在async函数内部使用. <span style="color:blue">关键字await让引擎等待直到promise完成(settle)并返回结果.</span>

* await右侧的表达式一般为promise对象, 但也可以是其它的值
* 如果表达式是promise对象, await返回的是promise成功的值.如果是失败的值,await会把promise的异常抛出,可以使用try..catch捕获错误.
* 如果表达式是其它值, 直接将此值作为await的返回值

案例:

```Javascript
async function f() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('don'), 1000)
  });
  
  let result = await promise; //等待, 直到 promise resolve
  
  alert(result); //'done'
}

f();
```

这个函数在执行的时候，“暂停”在了 `(*)` 那一行，并在 promise settle 时，拿到 `result` 作为结果继续往下执行。所以上面这段代码在一秒后显示 “done!”。



#### 总结

* <span style="color:red; font-weight: bold;">`await` 实际上会暂停函数的执行</span>，直到 promise 状态变为 settled，然后以 promise 的结果继续执行。

* 这个行为不会耗费任何 CPU 资源，因为 JavaScript 引擎可以同时处理其他任务：执行其他脚本，处理事件等。

* 相比于 `promise.then`，它只是获取 promise 的结果的一个更优雅的语法。并且也更易于读写。

#### 注意事项

* 不能在普通函数中使用 `await`, 会报语法错误`Syntax error`
* 现在浏览器在 modules 里 允许顶层 await
* await 接收 `thenables`
* Class 中的 async 方法

<u>现在浏览器在 modules 里 允许顶层 await </u>

>  在现代浏览器中，当我们处于一个 module 中时，那么在顶层使用 `await` 也是被允许的。我们将在 [模块 (Module) 简介](https://zh.javascript.info/modules-intro) 中详细学习 modules。
>
>  补充: ES2022 已经支持

```javascript
// 我们假设此代码在 module 中的顶层运行
let response = await fetch('/article/promise-chaining/user.json');
let user = await response.json();

console.log(user);
```

```javascript
//polyfill: 包装到匿名的异步函数中。

(async () => {
  let response = await fetch('/article/promise-chaining/user.json');
  let users = await response;
})();

```



<u>await 接收 'thenables'</u>

> 像 `promise.then` 那样，`await` 允许我们使用 thenable 对象（那些具有可调用的 `then` 方法的对象）。这里的想法是，第三方对象可能不是一个 promise，但却是 promise 兼容的：如果这些对象支持 `.then`，那么就可以对它们使用 `await`。

```javascript
class Thenable {
  constructor (num) {
    this.num = num;
  }
  
  then(resolve, reject) {
    alert(resolve);
    setTimeout(() => resolve(this.num * 2), 1000);
  }
}


async function f() {
  let res = await new Thenable(1);
  alert(res);
}

f();
```



<u>Class 中的 async 方法</u>

要声明一个 class 中的 async 方法，只需在对应方法前面加上 `async` 即可：

```javascript
class Waiter {
  async wait() {
    return await Promise.resolve(1);
  }
}

new Waiter()
  .wait()
  .then(alert); // 1（alert 等同于 result => alert(result)）
```



### async和await结合使用

#### 注意事项

```
1.	await必须写在async函数中, 但async函数中可以没有await
2.	如果await的promise失败了, 就会抛出异常, 需要通过try...catch捕获处理

```



#### 案例+++

```js
//https://www.cnblogs.com/fundebug/p/10095355.html

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
```





```js
//await右侧不是promise对象
async function main(){
    let result = await 123;
    console.log(result);
}
main();//执行结果是123


//右侧为promise类型的值 即使是异步函数,也能正常获取成功的结果
async function main(){
    let result = await (new Promise((resolve, reject)=>{
        resolve('ok');
    }));
    console.log(result);
}
main();//执行结果是ok

async function main(){
    let p = Promise.resolve('ok');
    let result = await p;
    console.log(result);
}
main();//执行结果是ok

//如果promise的对象是失败 会抛出错误,使用try..catch
async function main(){
    try(
         let p = await (new Promise(resolve, reject)=>{
        	reject('error');
        });
    	console.log(p);
    )catch(e){
       console.log(e);
    }
}
main();//输出结果为catch函数输出的'error'
```



#### 案例2

```js
- 读取resource文件夹下的1-3个HTML文件

const fs=require('fs');
const {promisify}=require('util');
let readfile=promisify(fs.readFile);

async function main(){
    let p1=await readfile('./resource/1.html');
    let p2=await readfile('./resource/2.html');
    let p3=await readfile('./resource/3.html');

    console.log(p1+p2+p3);
}
mian();
```



#### 案例3-封装ajax

```html
- 封装ajax函数,实现获取url接口结果
<button>点击获取天气</button
<script>
function sendAjax(url){
    let xhr=new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange=function(){
       return new Promise((resolve, reject)=>{
        if(xhr.readyState === 4){
            if(xhr.status>=200 && xhr.status<300){
                resolve(xhr.responseText);
            }else{
                reject(xhr.status)
            }
        }
    }
   })
}

const btn=document.querySelector('button');
btn.onclick=async function(){
	let url='';
	let result = await sendAjax(url);
	console.log(result);
    <!--promise方法 sendAjax.then()   -->
                                                
};
</script>
```



### map中遍历使用async函数

```js
//https://zhuanlan.zhihu.com/p/88695806

当 async 函数被执行时，将立即返回 pending 状态的Promise（ Promise 是 Truthy 的）！因此，在 map 循环时，不会等待 await 操作完成，而是直接进入下一次循环，所以应当配合 for 循环使用 async。
对于 forEach 而言，参考 MDN 中它的 Polyfill 可知，若回调函数为异步操作，它将会表现出并发的情况，因为它不支持等待异步操作完成后再进入下一次循环。


//来个例子: 自定义Sleep函数阻塞代码一段时间
//方案1
const sleep = ms => new Promise(resolve=>{
  setTimeout(()=>{
    resolve()
  },ms)
});
const mapResult = [1,2].map(async num => {   //使用async函数后map的返回值为 //[Promise{<pending>}, Promise{<pending>]}
  await sleep(3000);
})

//方案2
const sleep = wait => new Promise(resolve=>setTimout(resolve, wait));
const __main = async function () {
  const tasks = [1,2,3];
  let results = await tasks.reduce(async (previousValue, currentValue) => {
    let results = await previousValue;
    console.log(`task ${currentValue} start`);
    await sleep(1000 * currentValue);
    console.log(`${currentValue}`);
    console.log(`task ${currentValue} end`);
    results.push(currentValue);
    return results;
  }, []);
  console.log(results);
}
__main();
```



### ES2022- await

> https://h3manth.com/ES2022/

> await outside of async functions in modules

```javascript
// say this is index.mjs

// fails
await Promise.resolve('🍎');
// → SyntaxError: await is only valid in async function

// fix with wrapping
(async function() {
  await Promise.resolve('🍎');
  // → 🎉
}());

// to top-level await
await Promise.resolve('🍎') // '🍎'
const i18n = await import(`./content-${language}.mjs`);
```




### Error 处理

#### 概述

如果一个 promise 正常 resolve，`await promise` 返回的就是其结果。但是如果 promise 被 reject，它将 throw 这个 error，就像在这一行有一个 `throw` 语句那样。

```javascript
//下面两段代码是一样的:

async function f() {
  await Promise.reject(new Error('whoops'));
}


async function f() {
  throw new Error('whoops');
}
```



#### 处理

在真实开发中，promise 可能需要一点时间后才 reject。在这种情况下，在 `await` 抛出（throw）一个 error 之前会有一个延时。

* 可以用 `try..catch` 来捕获上面提到的那个 error，与常规的 `throw` 使用的是一样的方式：
* try 可以包装多行 await 代码
* 没有使用`try...catch`,可以在函数调用后面添加`.catch` 来处理这个error

```javascript
//try...catch
async function f() {
  try {
    let response = await fetch('http://no-such-url');
  } catch (e) {
    alert(e); //TypeError: failed to fetch
  }
}

f();
```



```javascript
//try 包含多行await

async function f() {
  try {
    let response = await fetch('/no-user-here');
    let user = await response.json();
  } catch (e) {
    //捕获 fetch 和 response.json 中的错误
    alert(e);
  }
}

f();
```



```javascript
//使用.catch来处理

async function f() {
  let response = await fetch('http://no-such-url');
}

//f()变成一个rejected的promise
f().catch(alert); // TypeError: failed to fetch
```









```js
await等的是右侧「表达式」的结果
右侧如果是函数，那么函数的return值就是「表达式的结果」
右侧如果是一个 'hello' 或者什么值，那表达式的结果就是 'hello'

async function async1() {
    console.log( 'async1 start' )
    await async2()
    console.log( 'async1 end' )
}
async function async2() {
    console.log( 'async2' )
}
async1()
console.log( 'script start' )

上面例子中， 'async2' 和 'script start' 谁先打印呢？
实践的结论是，从右向左的。先打印async2，后打印的script start

await 等到之后,对于await来说，分2个情况:不是promise对象,是promise对象

如果不是 promise , await会阻塞后面的代码，先执行async外面的同步代码，同步代码执行完，再回到async内部，把这个非promise的东西，作为 await表达式的结果

如果它等到的是一个 promise 对象，await 也会暂停async后面的代码，先执行async外面的同步代码，等着 Promise 对象 fulfilled，然后把 resolve 的参数作为 await 表达式的运算结果。

分析一下 await async2()
前文提过await，1.它先计算出右侧的结果，2.然后看到await后，中断async函数

先得到await右侧表达式的结果。执行async2()，打印同步代码console.log('async2'), 并且return Promise.resolve(undefined)
await后，中断async函数，先执行async外的同步代码
目前就直接打印 console.log('async2')

回到async内部，执行await Promise.resolve(undefined)
如果一个 Promise 被传递给一个 await 操作符，await 将等待 Promise 正常处理完成并返回其处理结果。
在我们这个例子中，就是Promise.resolve(undefined)正常处理完成，并返回其处理结果。那么await async2()就算是执行结束了。
目前这个promise的状态是fulfilled，等其处理结果返回就可以执行await下面的代码了。

那何时能拿到处理结果呢？
需要在then的第一个参数里，才能拿到结果。
所以这里的 await Promise.resolve() 就类似于 Promise.resolve(undefined).then((undefined) => {})
把then的第一个回调参数 (undefined) => {} 推入微任务队列。then执行完，才是await async2()执行结束。
await async2()执行结束，才能继续执行后面的代码

```


