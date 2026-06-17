---
aliases: 迭代, iteration
---


#### while循环

语法:

```JavaScript
while(条件表达式){
    语句...
}
```



执行流程
* while语句在执行时,先对条件表达式进行求值判断
* 如果判断结果为false,则语句结束
* 如果结果为true,则只带代码块(循环体)中的代码
  * 执行完毕继续对条件表达式进行求值判断,以此类推



条件表达式恒为true的循环,是死循环,会一直执行

```js
// 初始化表达式,初始化一个变量
let i = 0;

//条件表达式, 设置循环运行的条件
while(i < 5){
    //执行语句
    //更新表达式,对初始化变量进行修改
    i++;
}
```









#### do-while循环

语法:

```JavaScript
do{
    语句...
}while(条件表达式)
```

执行流程:

* do-while在执行时,它会先执行do后的循环体,
  * 执行完毕对对while后的条件表达式进行求值判断
    * 如果为false,则语句直接结束
    * 如果为true, 则继续执行循环体,以此类推

* while是先判断后执行,do-while是先执行后判断, 可以确保循环体至少执行一次



案例:

```JavaScript
let money = 1000;
let count = 0;
while(money < 5000){
    money *= 1.05;
    count++;
}
alert('count');


============================
let money = 1000;
let count = 0;

do{
    money *= 1.05;
    count++;
}while(money < 5000);

alert(count);
```





#### for循环

#### 语法:

```JavaScript
for(1初始化表达式; 2条件表达式; 4更新表达式){
    3语句...
}
```

#### **执行流程:**

1. 先执行初始化表达式,初始化一个变量(只会执行一次)

2. 执行条件表达式进行求值判断

   2.1 若结果为false, 语句结束

3. 若结果为true, 执行循环体

4. 执行 更新表达式, 对变量进行更新

5. 重复2.

其他

3个表达式都可以省略, 如果都不写, 则循环变成死循环, 慎用

```js
for(;;){
    alert(123);  //关掉后会弹出窗口,一直运行
}
```



#### for循环案例

##### 求100以内所有的奇数之和

```js
let num = 0; //创建一个变量,用来存储结果
for(let i=0; i<100; i++){   //获取100以内所有的整数
    if(i % 2 !== 0){        // 判断i是否是奇数
        num += i;			// 所有奇数 相加
    }
}
console.log(num);
====================================================
let result = 0;
for(let i=1; i<100; i+=2){   //通过更新表达式,获取奇数.
    result += i;
}
console.log(result);
```



##### 求100以内所有7的倍数之和,以及个数

```js
let num = 0;
let count = 0;
for(let i=0; i<100; i+=7){
  num += i;
  count++;
}


for(let i=0;i<100;i++){
  if(i%7===0){
    num += i;
    count++;
  }
}

console.log(num,count);
```



##### 水仙花数

水仙花数.  水仙花数是指一个 n 位数（n≥3 ），它的每个位上的数字的 n 次幂之和等于它本身（例如：1\*\*3 + 5\*\*3 + 3\*\*3 = 153）编写代码，求 1000 以内所有的水仙花数！

```js
//获取1000以内所有的3位数
for(let i=100; i<1000; i++){
    //获得3位数的百位数,十位数和个位数. 没有思路就使用案例法,例如123求百位,是123除以100得1.
    let hundred1 = parseInt(i / 100);
    let sec2 = parseInt( (i - hundred1*100) / 10 ) ;
    let thr3 = i % 10;
    
    if(hundred**3 + sec2**3 +thr3**3 === i){
        console.log(i);
    }
}
```



**质数**

获取用户输入的任何整数,判断其是否为质数.(质数也叫素数,一个数如果只能被1和它本身整除，那么这个数就是质数。1不是质数也不是合数。)   ==重点==

```js
/* n是不是质数？
             - 要看n是不是质数，就是看n有没有除1和n以外的其他因数
               如果有，n就不是质数
               如果没有，n就是质数
 
             - 获取所有可能整除n的数（除了1和n）
               2 3 4 5 6 ... n-1
*/


let i = +prompt('请输入一个整数');   //创建一个变量表示数字
let flag = true;    //定义一个变量来记录i的状态,模式i是质数
for(let j=2; j<i; j++){  //获取所有可能整数i的数(除了1和i本身)
    if(i % j ===0){      //i能被j整数,说明i一定不是质数
        flag = false;   // 进入判断证明i不是质数,修改flag为false
        break;
    }
}
if(flag){					//判断 i 是否为质数
        alert(`${i}是质数`);
    }else{
        alert(`${i}不是质数`);
}


 
 
 ================================================================
 https://blog.csdn.net/yeyue1992/article/details/81348722
 
 方法1: 因子一定有2个
 let num = +prompt('请输入一个整数');
 let count = 0;
 for(i=1; i<num; i++){
     if(num%i === 0){
         count++;
     }
 }
 if(count === 2){
     console.log(`${num}是质数`);
 }else{
     console.log(`${num}不是质数`);
 }

100以内的质数
let count = 0;
for(let i=1;i<100;i++) {
  for(let j=1;j<=i;j++) {
    if(i%j===0){
      count++;
    };
  }
  if(count===2){
    console.log(i);
  }
  count = 0;
}
 
 
 方法2,因子和=num+1
let num = +prompt('请输入一个整数');
let sum = 0;
for(i=1; i<=num; i++){
    if(num%i === 0){
        sum +=i;
    }      
}
if(sum === num+1){
    console.log(`${num}是质数`);
}else{
    console.log(`${num}不是质数`);
}
```



##### 判断数组中某元素出现的次数

```js
let arr = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice', 'Bruce', 'Alice'];
let newArr = [];
for(let i=0; i<arr.length; i++){
    let temp = arr[i];
    let count = 0;
    for(let j=0; j<arr.length; j++){
        if(arr[j]===temp){
            count++;
            arr[j]=-1;
        }
    }
    if(temp!==-1){
        newArr.push(temp+':'+count)
    }
}

console.log(newArr) sd
```







#### 嵌套for循环

> 嵌套循环时, 外循环每执行一次,内循环就执行一个完整的周期



```js
* * * * *
* * * * *
* * * * *
* * * * *
* * * * *
    
for(i=0; i<5; i++){        //外循环 对应的是高度
    for(j=0; j<5; j++){    //内循环 对应的是宽度
        document.write('*');
    }
    document.write('<br>');
}

* * * * *
* * * * 
* * *
* * 
* 
    
for(i=0; i<5; i++){
    for(j=0; j<5-i; j++){
        document.write('*');
    }
    document.write('<br>');
}

* 
* *
* * * 
* * * * 
* * * * *
    
for(i=0; i<5; i++){
    for(j=0; j<i+1; j++){
        document.write('*');
    }
    document.write('<br>');
}

```



练习:在浏览器窗口中打印99乘法表

```js
<script>
    for(let i=1; i<10; i++){     //创建一个外循环,控制图形的高度
        for(let j=1; j<i+1; j++){ //j<=i; 创建一个内循环,控制图形的宽度
            document.write(`${j}×${i}`+'='+i*j);  //开始的时候,j和i的位置谁先谁后没有想.j是管宽度的，i是管高度的
            // document.write(`${j}*${i}`+'='+Number(i)*Number(j); 这是开始的写法 完全没有必要使用Number()
        }
		document.write('<br>');
    }
</script>
```





求100以内所有的质数

```JavaScript

for(i=2; i<100; i++){   //获取100以内所有的数
    let flag = true;    //创建一个变量记录i的状态,默认i是质数
    for(j=2; j<i; j++){ //获取所有可能整除i的数
        if(i % j === 0){ //判断i能否被j整除
            flag = false;  //进入判断说明i一定不是质数
            			// 将flag修改为false
        }
    }
     if(flag){console.log(i);} //如果i是质数则打印i
}

======================
    将let flag = true; 放到外层循环的外面,程序还会实现效果吗?
    打印结果只会有2和3
	4进入判断,非质数,flag的值变为false,再次循环的时候无论是否为质数,flag的值都是false了.
 
    
    
//扩展 设计数据
例如设计flag数据,注意3项: 数据类型,名称, 位置
流程:界面变化->要有对应的数据
```



#### for...in

##### Define

> The statement iterators over all [enumerable properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) of an object that are keyed by strings(ignoring ones keyd by Symbols), including inherited enumerable properties.
>
> for...in语句迭代对象所有可枚举的以字符串为键的属性(忽略Symbol为键的属性), 包括继承的可枚举属性.

##### Syntax

```javascript
for (variable in object) {
  //statement
}
```

`variable` 每次迭代分配的不同的属性名

`object`  不含有Symbol属性且迭代可枚举属性的对象

##### Description

* `for...in`循环只能迭代可枚举非Symbol属性
* 被内建构造函数创建的对象,例如`Array`, `Object`会从`Object.prototype`和`String.prototype`继承非枚举的属性,例如字符串的`Indexof`方法或者对象的`toString()`方法.
* 循环将会迭代对象自己和从原型链继承的所有的可枚举属性
* **此循环以无序的方式迭代对象的属性**
  * 如果在一次迭代中更改一个属性并随后会访问它,那么它在循环中的值会是改变之后的值；
  * 在被访问之前删除的属性不会被获取到；
  * 迭代时添加的属性可能被访问到或忽略掉
* 通常，最好在迭代时不要添加，更改或者移除属性，除非是当前正在访问的属性
* 不能保证一个添加的属性是否会被访问，一个被修改的属性（除了当前属性）是否会在修改之前或之后被访问，或者一个被删除的属性是否会在删除之前被访问。
* **数组迭代和for...in**
  * `for...in`不应该用在迭代一个注重索引顺序的数组上
  * 数组索引只是具有整数名称的可枚举属性，在一般方面与对象属性相同
  * 不能保证`for...in`以特定方式返回索引
  * `for...in`循环语句将返回所有可枚举属性，包括非整数名属性和继承的属性
  * 因为迭代顺序是与实现有关，迭代一个数组可能不按照构成顺序访问数组。所以当迭代访问顺序重要的数组时最好用有数字索引的 for循环（或`Array.prototype.forEach()`, `for...of`循环）。
* **只迭代自身的属性**
  * 如果你只考虑对象自身的属性,不包括原型上的,使用`getOwnPropertyNames()` 或执行`hasOwnProperty()`检查 (`propertyIsEnumerable()`也能使用)
  * 可选的,如果你了解没有任何外部代码干扰, 可以使用检查方法来扩展内建的属性




##### Why use

考虑到`for...in`是用来迭代对象属性,不推荐用在数组上.那么其作用是什么?

* 它最长用作来debug, 是一种检查对象属性的简单方式( 用在控制台或其他地方输出  )
* 尽管存储数据数组经常更实用, 但处理数据首选键值对的情况下,可能存在这种情况,你想检查这些键中是否有某个特定的值.



##### Examples

迭代对象所有可枚举非symbol属性

```javascript
let obj = {a: 1, b: 2, c: 3};
for (const prop in obj) {
  console.log(`obj.${prop} = ${obj[prop]}`)
}
```

迭代自身的属性(搭配`hasOwnProperty()`)  推荐总是使用'hasOwnProperty'

```javascript
let triangle = {a: 1, b: 2, c: 3};

function ColoredTriange() {
  this.color = 'red';
}

ColoredTriangle.prototype = triangle;

let obj = new ColoredTriangel();

for (const prop in obj) {
  if (obj.hasOwnProperty(prop)) {
    console.log(`obj.${prop} = ${obj[prop]}`)
  }
}
```



使用构造函数返回的对象实例,迭代时会迭代原型上的属性,非构造函数生成的对象不会迭代

```javascript
//如果Object.create(null)  字面量形式是构造函数的语法糖
Object.prototype.pro = 'val';
let obj = Object.create(null);
obj.a = 'a';
for (let i in obj) {
  console.log(i); //'a'
}
```



#### for...of

##### Define

`for...of`语句创建一个循环来迭代可迭代对象,包括内建`String`, `Array`, 类数组对象(例如, `arguments` 或 `NodeList`), `TypedArray`, `Map`, `Set` 和用户定义的迭代. 它调用了一个自定义迭代钩子来为对象每个不同的属性的值执行语句.

##### Syntax

```javascript
for (variable of iterable) {
  statement
}

//变量没有被声明也可以正常迭代,没有报错
```

`varibale` 每一次迭代中被声明成变量的每个不同属性的值. 变量可以被`const`, `let`, 或 `var`声明.

`iterable`  被迭代的对象(有迭代的属性)

##### Example

迭代数组

```javascript
const iterable = [10, 20, 30];

for (const value of iterable) {
  console.log(value);
}
```

如果在块内重新声明了变量, 则使用`let`代替`const`

```javascript
const iterable = [10, 20, 30];

for (let value of iterable) {
  value += 1;
  console.log(value);
}
```

迭代字符串

```javascript
const iterable = 'boo';

for (const value of iterable) {
  console.log(value);
}
```

迭代类型数组

```javascript
const iterable = new Unit8Array([0x00, 0xff]);

for (const value of iterable) {
  console.log(value);
}
```

迭代Map集合

```javascript
const iterable = new Map([['a', 1], ['b', 2], ['c', 3]]);

for (const entry of iterable) {
  console.log(entry);
}

//"['a', 1]"
//"['b', 2]"
//"['c', 3]"

for (const [key, value] of iterable) {
  console.log(value);
}
```

迭代Set集合

```javascript
const iterable = new Set([1,1,2,2,3,3]);

for (const value of iterable) {
  console.log(value);
}
```

迭代arguments对象

可以迭代arguments对象来检查所有传入JS函数中的参数

```javascript
(function() {
  for (const arguments of arguments) {
    console.log(arguments);
  }
})(1,2,3)
```

迭代DOM集合

迭代DOM集合例如NodeList: 以下的案例为一个段落直接的后代段落添加一个red类

```javascript
const articleParagraphs = document.querySelectorAll('article > p');

for (const paragraph of articleParagraphs) {
  paragraph.classList.add('red');
}
```

**关闭迭代器**

在`for...of`循环中, 突然的迭代中止可以由`break`, `throw` 或 `return`引起. 在这些情况下,迭代器被关闭.

```javascript
function* foo() {
  yield 1;
  yield 2;
  yield 3;
}
for (const o of foo()) {
  console.log(o);
  break; //close iterator, execution continues outside of the loop
}
console.log('done');

// 1
//'done'
```

迭代生成器

```javascript
function* fibonacci() {
  let [prev, curr] = [0, 1];
  while(true) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

for (const n of fibonacci()) {
  console.log(n);
  if (n >= 1000) {
    break;
  }
}
```

不能复用生成器

生成器不能重复使用,即使`for...of`循环提前中止, 例如使用`break`关键字. 在上面一个循环中,生成器关闭, 试图再次迭代,也不能产生任何进一步的任何结果

```javascript
const gen = (function* () {
  yield 1;
  yield 2;
  yield 3;
})();

for (const o of gen) {
  console.log(o);
  break;//closes iterator
}

for (const o of gen) {
  console.log(o); //Never called
}
```

迭代其他可迭代对象

你也可以迭代一个明确实现了迭代协议的对象

```javascript
const iterable = {
  [Symbol.iterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 3) {
          return {value: this.i++, done: false};
        }
        return {value: undefined, done: true};
      }
    }
  }
};


for (const value of iterable) {
  console.log(value);
}

```

**Difference between `for...of` and `for...in`**

* `for...in`语句迭代一个对象的可枚举属性
* `for...of`语句迭代可迭代对象定义的要迭代的值 (The `for...of` statement iterates over values that the [iterable object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#iterables) defines to be iterated over.)

以下的案例展示了两者在数组上的不同

```javascript
Object.prototype.objCustom = function() {};
Array.prototype.arrCustom = function() {};

const iterable = [3,5,7];
iterable.foo = 'hello';

for (const i in iterable) {
  console.log(i); //logs: '0', '1', '2', 'foo', 'arrCustom', 'objCustom'
}

for (const i in iterable) {
  if (iterable.hasOwnProperty(i)) {
    console.log(i); //logs: '0', '1', '2', 'foo'
  }
}

for (const i of iterable) {
  console.log(i); //logs 3, 5, 7
}
```






### for...of与forEach,for...in比较
* forEach循环无法跳出循环.不支持break与continue关键字,如果使用会抛出异常; 使用return关键字只会跳出当前循环,但仍会执行后续循环
* for...in循环为遍历对象设计,对数组遍历不友好.
	* 其遍历数组时, 返回的键是字符串表示的数组的索引,并不是数组项的值
	* 手动为数组实例添加的属性,同样会被遍历出来.事实上我们并不希望这些属性会被遍历出来
* 使用for...of循环时, 可以使用break,continue和return关键字



### JS中如何跳出循环/结束遍历

> https://segmentfault.com/a/1190000020176190
>
> https://juejin.cn/post/6844904032071319565

下表是JS中常用的实现循环遍历的方法的跳出/结束遍历的办法

* break, continue都是在for循环中使用的语句
* return只能在函数内部使用



```javascript
//Array.prototype.forEach

let arr = [1,2,3,4,5]
let arr2 = []
arr.forEach(item => {
  if (item == 2) {
    //break Uncaught SyntaxError: illegal break statement
    //continue; //Uncaught SyntaxError: illegal continue statement: no surrouding iteration stateemnt
    //return; //[1,3,4,5] 只能跳出本次循环
    //return true; //[1,3,4,5] 只能跳出本次循环
    //return false; //[1,3,4,5] 只能跳出本次循环
  }
	arr2.push(item)
})
```



| 序号 | 方法          | break  | continue     | return       | return true  | return false | throw |
| ---- | ------------- | ------ | ------------ | ------------ | ------------ | ------------ | ----- |
| 1    | for循环       | √      | 跳出本次循环 | 不合法       | 不合法       | 不合法       |       |
| 2    | for...in      | √      | 跳出本次循环 | 不合法       | 不合法       | 不合法       |       |
| 3    | Array.forEach | 不合法 | 不合法       | 跳出本次循环 | 跳出本次循环 | 跳出本次循环 |       |
| 4.   | Array.map     | 不合法 | 不合法       | 跳出本次循环 | 跳出本次循环 | 跳出本次循环 |       |
| 5    | Array.some    | 不合法 | 不合法       | 跳出本次循环 | 成功         | 跳出本次循环 |       |
| 6    | Array.every   | 不合法 | 不合法       | 成功         | 跳出本次循环 | 成功         |       |
| 7    | Array.filter  | 不合法 | 不合法       | 跳出本次循环 | 跳出本次循环 | 跳出本次循环 |       |
| 8    | for...of      | √      | √            | √            |              |              | √     |



**其他问题**

* `for...of`循环单独使用return会报错: `Uncaught SyntaxError: Illegal return statement`
  * 测试环境: Chrome浏览器

​	

```javascript
for (let [key, value] of Object.entries({a: 1, b: 2})) {
  if (key === 'a') return 'a'; //报错
}

//解决: 添加到函数中
(() => {
  for (let [key, value] of Object.entries({a: 1, b: 2})) {
    if (key === 'a') return 'a'; //打印'a'
  }
})()
```



### 可枚举性enumerable ????

#### 概述

* 可枚举属性是指那些内部 “可枚举” 标志设置为 `true` 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为即为 `true`，对于通过 [Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 等定义的属性，该标识值默认为 `false`。

* 可枚举的属性可以通过 [for...in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 循环进行遍历（除非该属性名是一个 [Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)）。

* 属性的所有权是通过判断该属性是否直接属于某个对象决定的，而不是通过原型链继承的。

一个对象的所有的属性可以一次性的获取到。有一些内置的方法可以用于判断、迭代/枚举以及获取对象的一个或一组属性，下表对这些方法进行了列举。

#### Detection

|                              | Own object                                                   | Own object and prototype chain   | Prototype chain only             |
| ---------------------------- | ------------------------------------------------------------ | -------------------------------- | -------------------------------- |
| Enumerable                   | propertyIsEnumerable<br />hasOwnProperty                     | Not available without extra code | Not available without extra code |
| Nonenumerable                | hasOwnProperty<br /><br />filtered to exclude enumerable using<br />propertyIsEnumerable | Not available without extra code | Not available without extra code |
| Enumerable and Nonenumerable | hasOwnProperty                                               | in                               | Not available without extra code |

#### Retrieval(检索/取回)

|                              | Own object                                                   | Own object and property chain    | Property chain only              |
| ---------------------------- | ------------------------------------------------------------ | -------------------------------- | -------------------------------- |
| Enumerable                   | Object.keys<br />getOwnPropertyNames<br />getOwnPropertySymbols | Not available without extra code | Not available without extra code |
| Nonenumerable                | getOwnPropertyNames,<br />getOwnPropertySymbols => filtered to exclude enumerable using<br />propertyIsEnumerable | Not available without extra code | Not available without extra code |
| Enumerable and Nonenumerable | getOwnPropertyNames<br />getOwnPropertySymbols               | Not available without extra code | Not available without extra code |



#### Iteration

|                              | Own object                                                   | Own object and property chain    | Property chain only              |
| ---------------------------- | ------------------------------------------------------------ | -------------------------------- | -------------------------------- |
| Enumerable                   | Object.keys<br />getOwnPropertyNames<br />getOwnPropertySymbols | for...in<br />(ecluding symbols) | Not available without extra code |
| Nonenumerable                | getOwnPropertyNames<br />getOwnPropertySymbols => filtered to exclude enumerable using<br />propertyIsEnumerable | Not available without extra code | Not available without extra code |
| Enumerable and Nonenumerable | getOwnPropertyNames<br />getOwnPropertySymbols               | Not available without extra code | Not available without extra code |



#### Obtaining properties by enumerability/ownership

按可枚举/所有权获取属性

> Note that this is not the most efficient algorithm for all cases, but useful for a quick demonstration

<u>1. detection can occur by</u>

`SimplePropertyRetriver.theGetMethodYouWant(obj).indexOf(prop) > -1`



<u>2. Iteration can occur by</u>

`SimplePropertyRetriver.theGetMethodYouWant(obj).forEach(function(vlaue, prop) {})`;

(or use `filter()`, `map()`, etc)

```javascript
var SimplePropertyRetriver = {
  getOwnEnumerable: function(obj) {
    return this._getPropertyNames(obj, true, false, this._enumerable);
    // or could use for...in filtered with hasOwnProperty or just this: return Object.keys(obj)
  },
  getOwnNonenumerables: function(obj) {
    return this._getPropertyNames(obj, true, false, this._notEnumerable);
  },
  getOwnEnumerablesAndNonenumerables: function(obj) {
    return this._getPropertyNames(obj, true, false, this._enumerableAndNonenumerable);
    //or jsut use: Object.getOwnPropertyNames(obj)
  },
  getPropertyEnumerables: function(obj) {
    return this.getPropertyNames(obj, false, true, this._Enumerable);
  },
  getPropertyNonenumerables: function(obj) {
    return this._getPropertyNames(obj, false, true, this._notEnumerabl)
  },
  getPropertyEnumerablesAndNonenumerables: function(obj) {
    return this._getPropertyNmaes(obj, false, true, this._enumerableAndNotEnumerable);
  },
  //private static property checker callbacks
  _enumerable: function(obj, prop) {
    return obj.propertyIsEnumerable(prop);
  },
  _notEnumerable: function(obj, prop) {
    return !obj.propertyIsEnumerable(prop);
  },
  _enumerableAndNotEnumerable: function(obj, prop) {
    return true;
  },
  //Inspired by http://stackoverflow.com/a/8024294/271577
  _getPropertyNames: function getAllPropertyNames(obj, iterateSelefBool, iteratePrototypeBool, includPropCB) {
    var props = [];
    do {
      if (iterateSelfBool) {
        Object.getOwnPropertyNames(obj).forEach(prop => {
          if (props.indexOf(prop) === -1 && includePropCb(obj, prop)) {
            props.push(prop);
          }
        })
      }
      if (!iteratePrototypeBool) {
        break;
      }
      iterateSelfBool = true;
    } while (obj = Object.getPropertyOf(obj));
    return props;
  }
}
```



#### detection table

| Enumerable                         | Nonenumerable | Symbols keys | Inherited Enumerable | Inherited Nonenumerable | Inherited Symbols keys |       |
| :--------------------------------- | :------------ | :----------- | :------------------- | :---------------------- | :--------------------- | ----- |
| `in`                               | true          | true         | true                 | true                    | true                   | true  |
| `for..in`                          | true          | false        | false                | true                    | false                  | false |
| `obj.hasOwnProperty`               | true          | true         | true                 | false                   | false                  | false |
| `obj.propertyIsEnumerable`         | true          | false        | true                 | false                   | false                  | false |
| `Object.keys`                      | true          | false        | false                | false                   | false                  | false |
| `Object.getOwnPropertyNames`       | true          | true         | false                | false                   | false                  | false |
| `Object.getOwnPropertyDescriptors` | true          | true         | true                 | false                   | false                  | false |
| `Reflect.ownKeys()`                | true          | true         | true                 | false                   | false                  | false |



### 可枚举性和可迭代对象🌈

JavaScript数据遍历循环的两个属性: 可枚举属性和可迭代对象

<span style="color:blue">基本上，在 JavaScript 中，所有可迭代对象都是可枚举对象，但并非所有可枚举对象都是可迭代对象。</span>

可迭代的内置类型包括 Array、String、Set 和 Map.  对象不可迭代,因为它没有指定 @iterator 方法。



#### 可枚举属性

可枚举属性总是出现在for...in循环中.

可枚举对象:

* 通过赋值运算符将属性赋值给对象,内部可枚举标志(enumerable)默认为true
* 通过`Object.defineProperty添加的属性,其可枚举属性默认为false



#### 可迭代对象

如果一个对象定义了它的迭代行为(设置@iterator接口),那么它是可迭代的.



#### 循环loop 迭代iterate 遍历traversal 递归recursion

循环: 在满足条件的情况下，重复执行同一段代码。比如，while语句。

迭代（iterate），指的是按照某种顺序逐个访问列表中的每一项。比如，for语句。

遍历（traversal），指的是按照一定的规则访问树形结构中的每个节点，而且每个节点都只访问一次。

递归（recursion），指的是一个函数不断调用自身的行为。比如，以编程方式输出著名的斐波纳契数列。

