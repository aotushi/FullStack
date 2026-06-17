
> [Control flow and error handling - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)






# Exception handling statements



### try...catch

`try...catch`语句由`try`块和`catch`块,`finally`块或两个都有组成.
`try`块首先执行,如果它抛出异常,在`catch`块中的代码将执行. 
`finally`块中的代码在控制流退出整个构造函数前执行.

#### Syntax
```js
try {
  tryStatements
} catch (exceptionVar) {
  catchStatements
} finally {
  finallyStatements
}
```

`exceptionVar` optional
这是一个可选的标识符,为关联`catch`块而保留捕获的异常. 如果没有使用这个值,那么可以省略圆括号.例如: `catch {}`.

#### Description
* try,catch或finally块必须是一组数据,而不是单个声明.
* 如果try块中抛出错误,catch块会捕获并执行其中的代码;如果没有抛出,则会跳过catch块.
* finally块总在控制流结束`try...catch...finally`构造函数前执行,无论异常是否被抛出或捕获.
* 可以嵌套1个或多个`try`语句.如果一个内部的`try`语句没有`catch`块,则最近的`try`语句的`catch`块将被代替使用.

* 无限制的catch块和有条件的catch块

无限制的意思就是try块中抛出的任何异常都会被catch捕获.
有限制的意思是,可以通过组合if..else和try...catch来创建. 如下:
```js
try {
  myroutine(); // may throw three types of exceptions
} catch (e) {
  if (e instanceof TypeError) {
    // statements to handle TypeError exceptions
  } else if (e instanceof RangeError) {
    // statements to handle RangeError exceptions
  } else if (e instanceof EvalError) {
    // statements to handle EvalError exceptions
  } else {
    // statements to handle any unspecified exceptions
    logMyErrors(e); // pass exception object to error handler
  }
}
```
通常的做法是只捕获(并消音)一小部分期望的错误,并在其它情况中抛出这个错误.
```js
try {
  myRoutine();
} catch (e) {
  if (e instanceof RangeError) {
    // statements to handle this very common expected error
  } else {
    throw e; // re-throw the error unchanged
  }
}
```


##### 异常标识符
这个标识符只能在catch块的作用域中可用.如果不需要,可以省略.

##### finally块
>finally 块包含要在 try 块和 catch 块（如果有的话）执行后执行的语句，但在 try...catch...finally 块之后的语句之前执行.
 控制流始终会进入`finally`块,以如下方式之一继续:
 * 在`try`块正常完成执行前(并且没有异常抛出)
 * 在`catch`块正常完整执行前
 * 在`try`块或`catch`块中的控制流语句(statement)(return/throw/break/continue)执行前

在`finally`块中的控制流语句(`return/throw/break/continue`)将会隐藏(mask)任何`try`块或`catch`块中的==完成值(completion vaule)== ??.
在`finally`块中有[控制流语句](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements#control_flow)是一个坏主意.只有为清除代码才用. ?












在了解try-catch使用之前,需要先了解JS中有哪些原生错误类型.
javascript中有8种[[202301302098a|错误类型]]








```js
- 捕获错误 try...catch
- 抛出错误 throw error

* 语法固定 try...catch   try 尝试的意思  catch 捕获
* 1. try catch捕获到错误之后, 后续代码可以继续执行
* 2. catch 可以将错误信息捕获到. e 是一个对象, 有message和stack两个属性
* 3. 抛出错误之后, 在后续的 try 里面的代码不会执行
* 4. try 不能捕获语法错误. 其他三种类型错误可以捕获. TypeError RangeError EvalError
* 5. 允许使用 throw 手动的抛出错误
* 6. 抛出任意类型的数据





- 运行流程
1.try catch捕获到错误之后,后续代码是可以继续执行的
2. catch可以将错误信息捕获到,e是一个对象,有message和stack两个属性
 2.1 message: 发生错误的信息; stack:发生错误的位置,配合使用console.dir(e)
3.抛出错误之后,在后续的try里的代码是不会执行的
4.try不能捕获语法错误,其他三种类型错误可以捕获
5.允许使用throw手动抛出错误
   Throw new Error(‘xxx’)   catch(e) 
6.抛出任意类型的数据


- err对象的结构
1.	message属性: 错误相关信息
2.	stack属性: 函数调用栈记录信息 错误发生的位置信息
```



```js
try捕获到错误之后,把错误信息变成对象, 然后传递给catch
try{
    console.log(a);
    console.log(111);//出错之后的代码不会执行
}catch(e){
    console.log(e);//结果是字符串
    console.dir(e);//
}
console.log('可继续执行'); 
```


catch捕获的错误可能不在try块或者是我们自己引入的?

例如:

```js
function promptDirection(question) {
	let result = prompt(question);
	if (result.toLowerCase() == "left") return "L";
	if (result.toLowerCase() == "right") return "R";
	throw new Error("Invalid direction: " + result);
}

for (;;) {
	try {
		let dir = promtDirection("Where?"); // ← typo!
		console.log("You chose ", dir);
		break;
	} catch (e) {
		console.log("Not a valid direction. Try again.");
	}
}
```

因为函数名称错误,会返回一个'undefined variable',但catch忽略了这个异常,它错误的将绑定错误当做指示错误输入.不仅引起无线循环,还埋葬有用的错误信息.



#### 捕获异常的规则


不要覆盖捕获(blanket-catch),除非是为了将它们路由到某个地方.例如,通过网络高速另一个系统我们的程序崩溃了


捕获特定的异常:通过识别catch块中的获取的异常(识别异常)是否是我们感兴趣的,如果不是则抛出

#### 来源
微信读书>Eloquent JavaScript>Selective catching


#### 识别异常

比较Error的message和我们期望的错误信息

```js
class InputError extends Error {}

function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new InputError("Invalid direction: " + result);
}

for (;;) {
  try {
    let dir = promtDirection("Where?");
    console.log("You chose ", dir);
    break;
  } catch (e) {
    if (e instanceof InputError) {
      console.log("Not a valid direction. Try again.");
    } else {
      throw e;
    }
  }
}
```





#### 来源
微信读书>Eloquent JavaScript>Selective catching




## throw
`throw`语句抛出用户定义的异常. 当前函数的执行将停止(在`throw`之后的语句不会执行),控制权(?)将被传递进调用栈中的第一个`catch`块.
如果在调用方函数中不存在`catch`块,程序将终止.


#### syntax
```js
throw expression
```

#### description
当抛出异常,表达式指定异常的值.
throw可以抛出任何javascript值,相应的catch[[try..catch throw]]可以捕获任何javascript值.

throw虽然可以抛出任意值,但一般使用Error或其子类.原因

