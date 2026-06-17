## Math

### add.js

#### 概述

返回两个Number类型的值之和

#### Syntax

> const add = createMathOperation((augend, addend) => augend + addend, 0)



#### parameters

`augend`

* {number} the first number in an addition

`addend`

* {number} the second number in an addition



#### return values

{number} returns the total.



#### Note:

##### 输入值的情况

如果都为`undefined`, 返回默认值

如果`value !== undefined && other === undefined` 返回 `value`

如果``other!==undefined && value === undefined`, 返回`other`

(注意这里的判断顺序, 先不等再相等,可以少判断一次)

##### 任意一方值为string  baseToString

如果`typeof value === 'string'`,直接返回

如果`Array.isArray(value)`, 则转换为字符串: `${value.map(递归)}`

如果是symbol类型(),`Symbol.prototype.toString.call(value)` 或 空字符串.

如果是字符串`-0`

```javascript
const result = `${value}`
return (result === '0' && (1 / value) === -INFINITY) ? : '-0' : 'result'
```

> 为什么是以上几种类型的判断呢?
>
> 当任意一方的类型为字符串时,传入的两个值都要转换成字符串形式.
>
> 可能是没写其他类型的判断.

##### 除了string类型之外的处理 baseToNumber

如果传进的值是number, 返回

如果是symbol类型,返回NaN

其他均返回`+value`



##### 结构问题

> const add = createMathOperation((augend, addend) => augend + addend, 0)
>
> 格式处理是在createMathOperation中的返回函数中操作的,这种位置的设计很有意思.



## Function

### after.js

#### Syntax

> _.after(n, func)

#### parameter

`n`   (*number*): `func`函数应该在调用多少次后才执行

`func` (*Function*) : 用来限定的函数

#### Return value

(*Function*) 返回新的限定函数



#### 案例

```javascript
let saves = ['profile', 'settings'];

let done = _.after(saves.length, function() {
  console.log('done saving');
})

_.forEach(saves, function(type) {
  asyncSave({'type': type, 'complete': done})
})
```



#### Note

内部使用apply改变了this, 返回的闭包函数也能接收参数.



