# 运算符
> [Expressions and operators - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#bigint_operators)

## 运算符分类

* Assignment operators(赋值)
* Comparison operators(比较)
* Arithmetic operators(数学)
* Bitwise operators(位)
* Logical operators(逻辑)
* BigInt operators(BigInt)
* String operators(字符串)
* Conditional(ternary) operators(条件/三元)
* Comma operator(逗号)
* Unary operator(一元)
* Relational operators(关系)


## Assignment operators
### 是什么
> 将右侧操作数值分配给左侧操作数

### 集合列表
|名称|速记操作符|含义

| 名称                                    |                                                                  速记操作符                                                                   | 含义               |
| ------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------: | ---------------- |
| Assignment(赋值)                        |                                                                 `x=f()`                                                                  | `x=f()`          |
| Addition assignment(加法赋值)             |                                                                 `x+=f()`                                                                 | `x = x + f()`    |
| Subtraction assignment(减法赋值)          |                                                                 `x-=f()`                                                                 | `x = x - f()`    |
| Multiplication assignment(乘法赋值)       |                                                                 `x*=f()`                                                                 | `x = x * f()`    |
| Division assignment(除法赋值)             |                                                                 `x/=f()`                                                                 | `x = x / f()`    |
| Remainder assignment(剩余赋值)            |                                                                 `x%=f()`                                                                 | `x = x % f()`    |
| Exponentiation assignment(幂赋值)        |                                                               `x **= f()`                                                                | `x = x ** f()`   |
| Left shift assignment(左移赋值)           |                                                                `x<<=f()`                                                                 | `x << = f()`     |
| Right shift assignment                |                                                                `x>>=f()`                                                                 | `x >> = f()`     |
| Bitwise AND assignment(按位与赋值)         |                                                                 `x&=f()`                                                                 | `x = x & f()`    |
| Bitwise XOR assignment(按位异或赋值)        |                                                                 `x^=f()`                                                                 | `x = x ^ f()`    |
| Btiwise OR assignmnet(按位或赋值)          |                                                                `x\|=f()`                                                                 | `x = x \| f()`   |
| Logical AND assignment(逻辑与赋值)         |                                                               `x &&= f()`                                                                | `x = x && f()`   |
| Logical OR assignment(逻辑或赋值)          |                                                              `x \|\|= f()`                                                               | `x = x \|\| f()` |
| Nullish coalescing assignment(空值合并赋值) |                                                                `x??=f()`                                                                 | `x = x ?? f()`   |
| Destructuring assignment(解构赋值)        | [`[a, b] = arr`, `{ a, b } = obj`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) |                  |
| Spread syntax                         |                                                                                                                                          |                  |



### Destructuring assignment(解构赋值运算符)


#### 0.对象解构

将对象解构应用到了变量的声明中

```javascript
let node = {
  type: 'Identifier',
  name: 'foo'
};

let {type, name} = node;

console.log(type); //'Identifier'
console.log(name); //'foo'
```

**初始化程序**

如果使用var、let或const解构声明变量，则必须要提供初始化程序（也就是等号右侧的值）

如果不使用解构功能，则var和let声明不强制要求提供初始化程序，但是对于cosnt声明，无论如何必须提供初始化程序.

```javascript
var {type, name}; //语法错误
let {type, name}; //语法错误
const {type, name}; //语法错误
```

**解构赋值**

到目前为止，我们已经将对象解构应用到了变量的声明中。然而，我们同样可以在给变量赋值时使用解构语法。举个例子，你可能在定义变量之后想要修改它们的值，就像这样：

```javascript
let node = {
  type: 'Identifier',
  name: 'foo'
},
    type = 'Literal',
    name = 5;

//使用解构语法为多个变量赋值
({type, name} = node);

console.log(type); //'Identifier'
console.log(name); //'foo'
```

在这个示例中，声明变量type和name时初始化了一个值，在后面几行中，通过解构赋值的方法，从node对象读取相应的值重新为这两个变量赋值。请注意，<span style="text-decoration:underline double red">一定要用一对小括号包裹解构赋值语句，JavaScript引擎将一对开放的花括号视为一个代码块，而语法规定，代码块语句不允许出现在赋值语句左侧，添加小括号后可以将块语句转化为一个表达式，从而实现整个解构赋值的过程。</span>

**解构赋值表达式的值与表达式右侧（也就是=右侧）的值相等**，如此一来，在任何可以使用值的地方你都可以使用解构赋值表达式。想象一下给函数传递参数值的过程：

```javascript
let node = {
  type: 'Identifier',
  name: 'foo'
},
    type = 'Literal',
    name = 5;

function outputInfo(value) {
  console.log(value === node); //true
}

outputInfo({type, name} = node); //变量从作用域中查找

console.log(type);//'Identifier'
console.log(name);//'foo'
```

解构赋值表达式（也就是=右侧的表达式）如果为null或undefined会导致程序抛出错误。也就是说，<u>任何尝试读取null或undefined的属性的行为都会触发运行时错误</u>。



**默认值**

使用解构赋值表达式时，如果指定的局部变量名称在对象中不存在，那么这个局部变量会被赋值为undefined

```javascript
let node = {
  type: 'Identifier',
  name: 'foo'
};

let {type, name, value} = node;

console.log(value); //undefined
```

当指定的属性不存在时，可以随意定义一个默认值，在属性名称后添加一个等号（=）和相应的默认值即可：

```javascript
let node = {
  type: 'Identifier',
  name: 'foo'
};

let {type, name, value = true} = node;

console.log(value); //true
```

为变量value设置了默认值true，只有当node上没有该属性或者该属性值为undefined时该值才生效.



**为非同名局部变量赋值**

如果希望使用不同命名的局部变量来存储对象属性的值，ECMAScript 6中的一个扩展语法可以满足你的需求，这个语法与完整的对象字面量属性初始化程序的很像

```javascript
let node = {
  type: 'Identifier',
  name: 'foo'
};

let {type: localType, name: localName} = node;

console.log(localType); //'Identifier'
console.log(lcoalName); //'foo'
```

type: localType语法的含义是读取名为type的属性并将其值存储在变量localType中，这种语法实际上与传统对象字面量的语法相悖，原来的语法名称在冒号左边，值在右边；现在值在冒号右边，而对象的属性名在左边。

当使用其他变量名进行赋值时也可以添加默认值，只需在变量名后添加等号和默认值即可：

```javascript
let node = {
  type: 'Identifier'
};

let {type: localType, name:lcoalName = 'bar'} = node;

console.log(localType); //'Identifier'
console.log(localName); //'bar'
```



**嵌套解构对象**

解构嵌套对象仍然与对象字面量的语法相似，可以将对象拆解以获取你想要的信息：

```javascript
let node = {
  type: 'Identifier',
  name: 'foo',
  loc: {
    start: {
      line: 1,
      colum: 1
    },
    end: {
      line: 1,
      cloumn: 4
    }
  }
};

let {loc: { start }} = node;
```

在上面的解构示例中，<span style="text-decoration:underline double red;">所有冒号前的标识符都代表在对象中的检索位置，其右侧为被赋值的变量名；如果冒号后是花括号，则意味着要赋予的最终值嵌套在对象内部更深的层级中。</span>

更进一步，也可以使用一个与对象属性名不同的局部变量名：

```javascript
let node = {
  type: 'Identifier',
  name: 'foo',
  loc: {
    start: {
      line: 1,
      column: 1
    },
    end: {
      line: 1,
      column: 4
    }
  }
};

//提取node.loc.start.line

let {loc: {start: {line: lineOut}}} = node;

console.log(localStart); //1
console.log(localStart); //1
```

**语法警示**

在使用嵌套解构功能时请注意，你很可能无意中创建了一个无效表达式。内空花括号在对象解构的语法中是合法的，然而这条语句却什么都不会做：

```javascript
//未声明任何变量
let {loc: {}} = node;
```



#### 1. 数组解构

**解构**

数组解构使用的是数组字面量，且解构操作全部在数组内完成，而不是像对象字面量语法一样使用对象的命名属性.

```javascript
let colors = ['red', 'green', 'blue'];

let [firstColor, secondColor] = colors;

console.log(firstColor);  //'red'
console.log(secondColor); //'green'
```

<u>在数组解构语法中，我们通过值在数组中的位置进行选取，且可以将其存储在任意变量中，未显式声明的元素都会直接被忽略。</u>切记，在这个过程中，数组本身不会发生任何变化。

在解构模式中，也可以直接省略元素，只为感兴趣的元素提供变量名。举个例子，如果你只想取数组中的第3个值，则不需要提供第一个和第二个元素的变量名称：

```javascript
let colors = ['red', 'green', 'blue'];
let [,, thirdColor] = colors;

console.log(thirdColor); //'blue'
```

当通过var、let或const声明数组解构的绑定时，必须要提供一个初始化程序，这一条规定与对象解构的规定类似。

**解构赋值**

数组解构也可用于赋值上下文，但不需要用小括号包裹表达式，这一点与对象解构的约定不同。

```javascript
let colors = ['red', 'green', 'blue'],
    firstColor = 'black',
    secondColor = 'purple';

[firstColor, secondColor] = colors;

console.log(firstColor); //'red'
console.log(secondColor); //'green'
```

数组解构语法还有一个独特的用例：交换两个变量的值。如果要在ECMAScript 5中交换两个变量的值，则须引入第三个临时变量：

```javascript
//ES5
let a = 1,
    b = 2,
    temp;

temp = a;
a = b;
b = temp;

//ES6
let a = 1,
    b = 2;
[a, b] = [b, a];
```

**注意**

如果右侧数组解构赋值表达式的值为null或undefined，则会导致程序抛出错误，这一特性与对象解构赋值很相似。



**默认值**

可以在数组解构赋值表达式中为数组中的任意位置添加默认值，当指定位置的属性不存在或其值为undefined时使用默认值

```javascript
let colors = ['red'];
let [ firstColor, secondColor = 'green'] = colors;

console.log(firstColor); //'red'
console.log(secondColor); //'green'
```



**嵌套数组解构**

嵌套数组解构与嵌套对象解构的语法类似，在原有的数组模式中插入另一个数组模式，即可将解构过程深入到下一个层级

```javascript
let colors = ['red', ['green', 'lightgreen'], 'blue'];

let [firstColor, [secondColor]] = colors;

console.log(firstColor); //'red'
console.log(secondColor); //'green'
```



**不定元素**

在数组解构语法中有一个和函数不定参数相似的概念：不定元素。在数组中，可以通过...语法将数组中的其余元素赋值给一个特定的变量.

在被解构的数组中，不定元素必须为最后一个条目，在后面继续添加逗号会导致程序抛出语法错误

```javascript
let colors = ['red', 'green', 'blue'];

let [firstColor, ...restColors ] = colors;

console.log(firstColor); //'red'
console.log(restColors); //['green', 'blue']
```

**使用**

* 不定元素语法有助于从数组中提取特定元素并保证其余元素可用
* 数组复制

```javascript
//ES5实现数组复制功能-concat
let colors = ['red', 'green', 'blue'];
let clonedColors = colors.concat();

console.log(clonedColors); //['red', 'green', 'blue']

//ES6的数组复制
let colors = ['red', 'green', 'blue'];
let [...clonedColors] = colors;

console.log()


```

比较这个方法与concat()方法的可读性，二者孰优孰劣是一个见仁见智的问题



#### 2. 混合解构

可以混合使用对象解构和数组解构来创建更多复杂的表达式，如此一来，可以从任何混杂着对象和数组的数据解构中提取你想要的信息

```javascript
let node = {
  type: 'Identifier',
  name: 'foo',
  loc: {
    start: {
      line: 1,
      column: 1
    },
    end: {
      line: 1,
      column: 4
      }
  },
  range: [0, 3]
};

let {
  loc: {start},
  range: [startIndex]
} = node;

console.log(start.line); //1
console.log(start.column); //1
console.log(startIndex); //0
```

解构模式中的loc:和range:仅代表它们在node对象中所处的位置（也就是该对象的属性）。当你使用混合解构的语法时，则可以从node提取任意想要的信息。这种方法极为有效，<u>尤其是当你从JSON配置中提取信息时，不再需要遍历整个结构了。</u>



#### 解构参数

**基本使用**

当定义一个接受大量可选参数的JavaScript函数时，我们通常会创建一个可选对象，将额外的参数定义为这个对象的属性

```javascript
//options的属性标识其他参数
function setCookie(name, value, options) {
  options = options || {};
  
  let secure = options.secure,
      path = options.path,
      domain = options.domain,
      expires = options.expires;
  
  //设置cookie代码
}

//第三个参数映射到options中
setCookie('type', 'js', {
  secure: true,
  expires: 6000
})
```

> 许多JavaScript库中都有类似的setCookie()函数，而在示例函数中，name和value是必需参数，而secure、path、domain和expires则不然，这些参数相对而言没有优先级顺序，将它们列为额外的命名参数也不合适，此时为options对象设置同名的命名属性是一个很好的选择。
>
> 现在的问题是，仅查看函数的声明部分，无法辨识函数的预期参数，必须通过阅读函数体才可以确定所有参数的情况。

如果将options定义为解构参数，则可以更清晰地了解函数预期传入的参数。解构参数需要使用对象或数组解构模式代替命名参数

```javascript
function setCookie(name, value, {secure, path, domain, expires}) {
  //函数体
}

setCookie('type', 'js', {
  type: true,
  expires: 6000
})
```

这个函数与之前示例中的函数具有相似的特性，只是现在使用<u>解构语法代替了第3个参数来提取必要的信息</u>，其他参数保持不变，但是对于调用setCookie()函数的使用者而言，解构参数变得更清晰了

**解构参数可以使用默认值、混合对象和数组的解构模式及非同名变量存储提取出来的信息。**



**必须传值的解构参数**

解构参数有一个奇怪的地方，默认情况下，如果调用函数时不提供被解构的参数会导致程序抛出错误

```javascript
//调用上一个示例中的setCookit()函数，如果不传递第3个参数，会报错
setCookie('type', 'js');
```

缺失的第3个参数，其值为undefined，而解构参数只是将解构声明应用在函数参数的一个简写方法，其会导致程序抛出错误。

<u>如果解构赋值表达式的右值为null或undefined，则程序会报错</u>，同理，若调用setCookie()函数时不传入第3个参数，也会导致程序抛出错误。

如果解构参数是必需的，大可忽略掉这些问题；但如果希望将解构参数定义为可选的，那么就必须为其**提供默认值**来解决这个问题：

```javascript
function setCookie(name, value, {secure, path, domain, expires} = {}) {
  //...
}  
```



**解构参数的默认值**

可以为解构参数指定默认值，就像在解构赋值语句中做的那样，只需在参数后添加等号并且指定一个默认值即可

```javascript
function setCookie(name, value, {
  secure = false,
  path = '/',
  domain = 'exmaple.com',
  expires = new Date(Date.now() + 3600000000)
}) {
  //...
}
```

 在这段代码中，解构参数的每一个属性都有默认值，从而无须再逐一检查每一个属性是否都有默认值。

然而，这种方法也有很多缺点：

* 首先，函数声明变得比以前复杂了；

* 其次，<u>如果解构参数是可选的，那么仍然要给它添加一个空对象作为参数</u>，否则像setCookie（"type"，"js"）这样的调用会导致程序抛出错误。

这里建议对于对象类型的解构参数，为其赋予相同解构的默认参数：

```javascript
function setCookie(name, value, {
  secure = false,
  path = '/',
  domain = 'example.com',
  expires = new Date(Date.now() + 3600000000)
} = {
  secure = false,
  path = '/',
  domain = 'example.com',
  expires = new Date(Date.now() + 3600000000)
}) {
  //...
}
```

现在函数变得更加完整了，第一个对象字面量是解构参数，第二个为默认值。但是这会造成非常多的**代码冗余**，你可以将默认值提取到一个**独立对象**中，并且使用该对象作为解构和默认参数的一部分，从而消除这些冗余

```javascript
const setCookieDefaults = {
  secure: false,
  path: '/',
  domain: 'example.com',
  expires: new Date(Date.now() + 3600000000)
};

function setCookie(name, value, {
  secure = setCookieDefaults.secure,
  path = setCookieDefaults.path,
  domain = setCookieDefaults.domain,
  expires = setCookieDefaults.expires
} = setCookieDefaults) {
  //...
}
```

在这段代码中，默认值已经被放到setCookieDefaults对象中，除了作为默认参数值外，在解构参数中可以直接使用这个对象来为每一个绑定设置默认参数。使用解构参数后，不得不面对处理默认参数的复杂逻辑，但它也有好的一面，如果要改变默认值，可以立即在setCookieDefaults中修改，<u>改变的数据将自动同步到所有出现过的地方。</u>



















<hr>



#### Spread syntax
>[Spread syntax (...) - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)


**是什么**
扩展运算符允许可迭代对象,例如字符串或数组,在函数调用或数组字面量中扩展为0或多个参数或元素
扩展运算符允许在需要零个或多个参数（用于函数调用）或元素（用于数组字面量）的位置扩展可迭代对象（例如数组或字符串）,在对象字面量中,扩展运算符枚举对象属性并添加键值对到新创建的对象中.

**语法**
```js
myFunction(a, ...iterableObj, b)
[1, ...iterableObj, '4']
{...obj, key:'value'}
```

**描述**
* 使用场景: 在数组,对象,函数调用中解构
* 只有可迭代的值才能被解构,例如数组或字符串.缺少`Symbol.iterator`方法的plain objects是不迭代对象.





## Comparison operators(比较运算符)
### 是什么
> 比较运算数,返回逻辑值


### 集合列表

| 名称                               | 描述                           | 案例  |
| -------------------------------- | ---------------------------- | --- |
| Equal(`==`) 相等                   | 如果操作数相等,则返回`true`            |     |
| Not Equal(`!=`)                  | 如果操作数不相等,则返回`true`           |     |
| Strict equal(`===`) 严格相等         | 如果操作数相等且类型相同.                |     |
| Strict not equal(`!==`) 严格不相等    | 如果操作数类型相同但不相等,或不同类型,返回`true` |     |
| Greater than or equal(`>=`) 大于等于 | 如果左操作数大于或等于右操作数,则返回`true`    |     |
| Less than(`<`)                   | 如果左操作数小于右操作数,则返回`true`       |     |
| Less than or equal(`<=`)         | 如果左操作数小于或等于右操作数,则返回`true`    |     |
|                                  |                              |     |


### Equal
#### 是什么

相等操作符比较两个值是否相等，在比较前将两个被比较的值转换为相同类型。在转换后（等式的一边或两边都可能被转换），最终的比较方式等同于全等操作符 === 的比较方式。 相等操作符满足交换律。

#### 规则

相等运算符（`==`和`!=`）使用[抽象相等比较算法](https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3)比较两个操作数。

* 如果两个操作数都是对象，则仅当两个操作数都引用同一个对象时才返回`true`。
* 如果两个操作数是不同类型的，就会尝试在比较之前将它们转换为相同类型：
  * 当数字与字符串进行比较时，会尝试将字符串转换为数字值
    * 如果字符串是十六进制的数据，会转换为十进制后再进行比较。
    * 字符串并不支持八进制的数据，如果字符串以0开头，则0会直接省略，后面的值当作十进制返回。
  * 如果操作数之一是`Boolean`，则将布尔操作数转换为1或0. `true`转换为1, `false`转换为0.
  * 如果操作数之一是对象，另一个是数字或字符串，会尝试使用对象的`valueOf()`和`toString()`方法将对象转换为原始值。
* 如果操作数具有相同的类型
  - `String`：`true`仅当两个操作数具有相同顺序的相同字符时才返回。
  - `Number`：`true`仅当两个操作数具有相同的值时才返回。`+0`并被`-0`视为相同的值。如果任一操作数为`NaN`，则返回`false`。
  - `Boolean`：`true`仅当操作数为两个`true`或两个`false`时才返回`true`
* `null == undefined` 返回值是`true`

```html
字符串和数字的布尔类型转换规则是： Javascript会将undefined，false和0，NaN和空字符串'',空格字符串'  '视为false，其他值视为true


'' == false //true
0 == false //true
0 == undefined //false
'' == undefined //false
undefined == undefined; //true
null == null; //true
NaN == NaN; //false


null == undefined  //true
undefined == false  //false
undefined == 0 //false
```


#### 规范

`"=="` 用于比较两个值是否相等，当要比较的两个值类型不一样的时候，就会发生类型的转换。

关于使用"=="进行比较的时候，具体步骤可以查看[规范11.9.5](http://es5.github.io/#x11.9.3)：

当执行x == y 时：

* 如果x与y是同一类型:

  * x是Undefined, 返回true
  * x 是 Null, 返回true
  * x 是数字

    * x 是NaN, 返回false
  * y 是NaN, 返回false
    * x 与 y相等, 返回true
  * x 是+0, y是-0, 返回true
    * x是-0, y是+0, 返回true
  * 返回false
  * x 是字符串, 完全相等返回true, 否则返回false
  * x是布尔值, x和y都是true或false, 返回true, 否则返回false
  * x和y指向同一个对象, 返回true, 否则返回false
* x 是null并且y 是undefined, 返回true
* x 是undefined,并且y 是null, 返回true
* x 是数字, y是字符串, 判断x == ToNumber(y)
* x 是布尔值, 判断ToNumber(x) == y
* y 是布尔值, 判断 x == ToNumber(y)
* x 是字符串或者数字, y是对象, 判断 x == ToPrimitive(y)
* x 是对象, y是字符串或者数字, 判断ToPrimitive(x) == y
* 返回false

#### 1. null 和 undefined

```javascript
console.log(null == undefined);
```

看规范第2, 3步:

> * 如果x是null并且y是undefined, 返回true
> * 如果y是null并且x是undefined, 返回true

所以结果自然是true

这时候，我们可以回想在[《JavaScript专题之类型判断(上)》](https://github.com/mqyqingfeng/Blog/issues/28)中见过的一段 `demo`，就是编写判断对象的类型 `type` 函数时，如果输入值是 `undefined`，就返回字符串 `undefined`，如果是 `null`，就返回字符串 `null`。

如果是你，你会怎么写呢？

下面是JQuery的写法:

```javascript
function type(obj) {
  if (obj == null) {
    return obj + '';
  }
  ...
}
```

#### 2. 字符串与数字

```javascript
console.log('1' == 1);
```

规范中第4, 5步: 都是转换成数字后再进行比较

#### 3. 布尔值与其他类型

```javascript
console.log(true == '2');
```

看规范6, 7步,当一方出现布尔值的时候，就会对这一方的值进行ToNumber处理，也就是说true会被转化成1.

所以, 当一方是布尔值的时候, 会对布尔值进行转换.一般很少使用相等,而是如下写法:

```javascript
//不建议
if (a == true) {}

//建议
if (a) {}

//更好
if (!!a) {}
```

#### 4. 对象与非对象

```javascript
console.log(42 == ['42']);
```

规范第8, 9步, 对象会使用 `ToPrimitive`, 



#### 5. 其他

```javascript
console.log(false == undefined);
```

`false == undefined` 相当于 `0 == undefined` 不符合上面的情形，执行最后一步 返回 `false`



```javascript
console.log(false == []);
```

`false == []` 相当于 `0 == []` 相当于 `0 == ''`, 相当于`0 ==0`, 结果返回true

```javascript
console.log([] == ![]);
```

`[] == ![]` 相当于`[] == false` 相当于`[] == 0` 相当于`'' = 0` 相当于`0 == 0`, 返回true



```javascript
console.log(false == '0'); 
console.log(false == 0);
console.log(false == '')


console.log('' == 0)
console.log('' == [])

console.log([] == 0)

console.log('' == [null])
console.log(0 == '\n');
console.log([] == 0);
```





**为什么undefined == false返回false**

> [来源](https://stackoverflow.com/questions/19277458/why-does-undefined-equals-false-return-false/19277873)

ECMA文档定义没有直接指出原因,但从下面这句话可以看出原因:
`"the comparison x == y, where x and y are values, produces true or false."`

同时,null的定义如下:

`NUll or nil means 'no value' or 'not applicable'`

在Javascript中, `undefined`也是同样的设置,它没有任何值.然而, `false`有一个值.  `Null`和`undefined`不应该提供任何值,同样的, 它也没有能转换成抽象相等比较的值, 所以这个结果总是`false`. 

这也是`null == undefined` 返回`true`的原因(它们两个都没有任何值,此点没有相应解释). 应该注意`null===undefined`返回`false`, 因为这是两种类型.

**相等操作符对于不同类型的值,如图**

| 被比较值 B |           |           |         |                       |                               |                                 |                                 |
| :--------- | --------- | --------- | ------- | --------------------- | ----------------------------- | ------------------------------- | ------------------------------- |
|            |           | Undefined | Null    | Number                | String                        | Boolean                         | Object                          |
| 被比较值 A | Undefined | `true`    | `true`  | `false`               | `false`                       | `false`                         | `IsFalsy(B)`                    |
|            | Null      | `true`    | `true`  | `false`               | `false`                       | `false`                         | `IsFalsy(B)`                    |
|            | Number    | `false`   | `false` | `A === B`             | `A === ToNumber(B)`           | `A=== ToNumber(B)`              | `A== ToPrimitive(B)`            |
|            | String    | `false`   | `false` | `ToNumber(A) === B`   | `A === B`                     | `ToNumber(A) === ToNumber(B)`   | `ToPrimitive(B) == A`           |
|            | Boolean   | `false`   | `false` | `ToNumber(A) === B`   | `ToNumber(A) === ToNumber(B)` | `A === B`                       | `ToNumber(A) == ToPrimitive(B)` |
|            | Object    | `false`   | `false` | `ToPrimitive(A) == B` | `ToPrimitive(A) == B`         | `ToPrimitive(A) == ToNumber(B)` | `A === B`                       |





### 全等运算符===

#### 判断规则:

* 全等操作符比较两个值是否相等，两个被比较的值在比较前都不进行隐式转换。
  * 基本类型数据存在包装类型。在未使用new操作符时，简单类型的比较实际为值的比较，而使用了new操作符后，实际得到的是引用类型的值

* 如果两个被比较的值具有不同的类型，这两个值是不全等的。

* 如果两个被比较的值类型相同，值也相同，并且都不是 number 类型时，两个值全等。*
* 如果两个值都是 number 类型，当两个都不是 NaN，并且数值相同，或是两个值分别为 +0 和 -0 时，两个值被认为是全等的。

在日常中使用全等操作符几乎总是正确的选择。对于除了数值之外的值，全等操作符使用明确的语义进行比较：一个值只与自身全等。

对于数值，全等操作符使用略加修改的语义来处理两个特殊情况：

第一个情况是，浮点数 0 是不分正负的。区分 +0 和 -0 在解决一些特定的数学问题时是必要的，但是大部分情况下我们并不用关心。全等操作符认为这两个值是全等的。

第二个情况是，浮点数包含了 NaN 值，用来表示某些定义不明确的数学问题的解，例如：正无穷加负无穷。全等操作符认为 NaN 与其他任何值都不全等，包括它自己。（**等式 `(x !== x)` 成立的唯一情况是 x 的值为 NaN）**





#### 不相等运算符(!=)

* 推荐使用不全等运算符
* 如果两个值不相等返回true,相等返回false
* 会做自动的类型转换





#### 不全等运算符(`!==`)

* 不全等
* 如果两个不全等返回true,相等返回false
* 不会做自动的类型转换




#### 4.1 JS相等性判断及实例应用

##### 如何判断两个参数相等

> https://github.com/mqyqingfeng/Blog/issues/41

见04_Javascript-高级中的'如何判断两个参数相等'

  

  

##### JavaScript中的相等性判断

看到好的文章就情不自禁的抄写一遍...

> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness#%E4%B8%A5%E6%A0%BC%E7%9B%B8%E7%AD%89

ES2015中有四种相等算法:

* 抽象(非严格)相等比较(==)
* 严格相等比较(===): 用于`Array.prototype.indexOf`, `Array.prototype.lastIndexOf`,和 `case-matching`.(也就是Switch语句)
* [同值零](https://262.ecma-international.org/6.0/#sec-samevaluezero): 用于`$TypedArray%` 和 `ArrayBuffer` 构造函数,以及`Map`和`Set`操作,  并将用于 ES2016/ES7 中的`String.prototype.includes`
* [同值](https://262.ecma-international.org/6.0/#sec-samevalue): 用于所有其他地方.

<u>Note: SameValueZero differs froms SameValue only in its treatment of `+0` and `-0`.</u>

JavaScript提供3种不同的值比较操作:

* 严格相等比较(也被称作'strict equality', 'identity', 'triple equals'), 使用`===`
* 抽象相等比较('loose equality', 'double equals'), 使用`==`
* `Object.is` (ECMAScript2015/ES6新特性)

简而言之，在比较两件事情时，双等号将执行类型转换; 三等号将进行相同的比较，而不进行类型转换 (如果类型不同, 只是总会返回 false ); 而Object.is的行为方式与三等号相同，但是对于NaN和-0和+0进行特殊处理，所以最后两个不相同，而Object.is（NaN，NaN）将为 `true`



##### 同值相等

同值相等解决了最后一个用例：确定两个值是否在任何情况下功能上是相同的。（这个用例演示了[里氏替换原则](http://zh.wikipedia.org/zh-cn/里氏替换原则)的实例。）当试图对不可变（immutable）属性修改时发生出现的情况：

```javascript
// 向 Nmuber 构造函数添加一个不可变的属性 NEGATIVE_ZERO
Object.defineProperty(Number, "NEGATIVE_ZERO",
                      { value: -0, writable: false, configurable: false, enumerable: false });

function attemptMutation(v)
{
  Object.defineProperty(Number, "NEGATIVE_ZERO", { value: v });
}
```

`Object.defineProperty` 在试图修改不可变属性时，如果这个属性确实被修改了则会抛出异常，反之什么都不会发生。例如如果 v 是 -0 ，那么没有发生任何变化，所以也不会抛出任何异常。但如果 v 是 +0 ，则会抛出异常。不可变属性和新设定的值使用 same-value 相等比较。

同值相等由 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 方法提供。



##### 零值相等

与同值相等类似，不过会认为 +0 与 -0 相等。



#### javascript中的相等判断

| x                   | y                   | `==`    | `===`   | `Object.is` |
| :------------------ | :------------------ | :------ | :------ | :---------- |
| `undefined`         | `undefined`         | `true`  | `true`  | `true`      |
| `null`              | `null`              | `true`  | `true`  | `true`      |
| `true`              | `true`              | `true`  | `true`  | `true`      |
| `false`             | `false`             | `true`  | `true`  | `true`      |
| `"foo"`             | `"foo"`             | `true`  | `true`  | `true`      |
| `0`                 | `0`                 | `true`  | `true`  | `true`      |
| `+0`                | `-0`                | `true`  | `true`  | `false`     |
| `0`                 | `false`             | `true`  | `false` | `false`     |
| `""`                | `false`             | `true`  | `false` | `false`     |
| `""`                | `0`                 | `true`  | `false` | `false`     |
| `"0"`               | `0`                 | `true`  | `false` | `false`     |
| `"17"`              | `17`                | `true`  | `false` | `false`     |
| `[1,2]`             | `"1,2"`             | `true`  | `false` | `false`     |
| `new String("foo")` | `"foo"`             | `true`  | `false` | `false`     |
| `null`              | `undefined`         | `true`  | `false` | `false`     |
| `null`              | `false`             | `false` | `false` | `false`     |
| `undefined`         | `false`             | `false` | `false` | `false`     |
| `{ foo: "bar" }`    | `{ foo: "bar" }`    | `false` | `false` | `false`     |
| `new String("foo")` | `new String("foo")` | `false` | `false` | `false`     |
| `0`                 | `null`              | `false` | `false` | `false`     |
| `0`                 | `NaN`               | `false` | `false` | `false`     |
| `"foo"`             | `NaN`               | `false` | `false` | `false`     |
| `NaN`               | `NaN`               | `false` | `false` | `true`      |



#### 使用实践

总的来说，除了对待[`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)的方式，[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)唯一让人感兴趣的，是当你需要一些元编程方案时，它对待0的特殊方式，特别是关于属性描述器，即你的工作需要去镜像[`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)的一些特性时。

如果你的工作不需要这些，那你应该避免使用[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)，使用[`===`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators)来代替。

即使你需要比较两个[`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)使其结果为`true`，总的来说编写使用[`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) 检查的特例函数(用旧版本ECMAScript的[`isNaN方法`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN))也会比想出一些计算方法让[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)不影响不同符号的0的比较更容易些。

这里是一个会区别对待-0和+0的内置方法和操作符不完全列表：



<u>一元负(`-`)</u>

对`0一元负操作得到``-0`。但表达式的抽象化可能在你没有意识到得情况下导致-0延续传播。例如当考虑下例时:

```javascript
let stoppingForce = Obj.mas * -obj.velocity;
```



<u>Math.atan2, Math.ceil, Math.pow, Math.round</u>

即使传入的参数中没有-0，这些方法的返回值都有可能是-0。例如当用 [`Math.pow`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)计算`-Infinity`的任何负奇指数的幂都会得到`-0`



<u>Math.floor, Math.max, Math.min, Math.sin, Math.square, Math.tan</u>

当传入参数中有-0时，这些方法也可能返回-0。例如， `Math.min(-0, +0)` 得出 `-0`。



<u>`~`, `<<`, `>>`</u>    //20220307

这些操作符内部都使用了ToInt32算法。因为内部32位整数类型只有一个0（没有符号区别），-0的符号在反操作后并不会保留下来。例如`Object.is(~~(-0), -0)`和`Object.is(-0 << 2 >> 2, -0)` `都会得到false`.

在未考虑0的符号的情况下依赖于[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)`是危险的。当然，如果本意就是区分-0和+0的话，`[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)`能按照期望完成工作。`









## Arithmetic operators(算术运算符)

### 是什么
> 使用数值(获取字面量,变量)作为操作数,返回单个数值.


### 列表

除了`+,-,*,/`,JS还提供了如下算术运算符:

| 操作符                           | 描述                                                                     | 例子  |
| ----------------------------- | ---------------------------------------------------------------------- | --- |
| Remainder(`%`)                | 二元运算符. 返回两个操作数相除的整数余数.                                                 |     |
| Increment(`++`)               | 一元运算符. 添加到操作数上,如果是前置(`++x`)添加,返回操作数加1后的值;  如果是后置(`x++`)添加,返回添加前的操作数的值. |     |
| Decrement(`--`)               | 一元运算符. 添加到操作数上. 逻辑和Increment一致.                                        |     |
| Unary negation(`-`)           | 一元运算符。返回其操作数的负值。                                                       |     |
| Unary plus(`+`)               | 一元运算符. 如果尚未转换为数字,会尝试将操作数转换为数值. 转换规则                                    |     |
| Exponentiation operator(`**`) | 计算指数幂的底数，即 base^exponent                                               |     |



### 1.算术运算符

算术运算符以数值（字面量或变量）作为其操作数，并返回一个单个数值。标准算术运算符是加法（+），减法（-），乘法（*）和除法（/）。

```js
加法 +   减法 -   乘法 *   除法 /

ES6新增 幂运算(平方) **   0.5次幂可以进行平方根的计算. 不支持老版本浏览器

取模 % : 取除法的余数 10%2取余数0 


//示例
数字相加 
true+1 //Boolean+Number 2

字符串链接
Number+String
5+'foo' //'5foo'
```

#### 除法(/)

除法运算符的结果是操作数的商 ，左操作数是被除数，右操作数是除数。

```js

//示例
1 / 2      // 在 JavaScript 中返回 0.5
1 / 2      // 在 Java 中返回 0
// （不需要数字是明确的浮点数）

1.0 / 2.0  // 在 JavaScript 或 Java 中都返回 0.5

2.0 / 0    // 在 JavaScript 中返回 Infinity
2.0 / 0.0  // 同样返回 Infinity
2.0 / -0.0 // 在 JavaScript 中返回 -Infinity
```



#### 乘法(\*)

```js
//示例
2 * 2 // 4
-2 * 2 // -4
Infinity * 0 // NaN
Infinity * Infinity // Infinity
"foo" * 2 // NaN
```



#### 求余(%)

求余运算符返回第一个操作数对第二个操作数的模，即 `var1` 对 `var2` 取模，其中 `var1` 和 `var2` 是变量。取模功能就是 `var1` 除以 `var2` 的整型余数。

```js
//语法
运算符: var1%var2

//示例
12%5 //2
-1%2 //-1
NaN%2 //NaN
1%2 //1
2%3 //2
-4%2 //0
5.5%2 //1.5
```




## Bitwise operators(按位运算符)





#### 概述

> 在`JavaScript`内部，数值都是以64位浮点数的形式储存，但是做位运算的时候，是以32位带符号的整数进行运算的，并且返回值也是一个32位带符号的整数。

> 位运算符将它的操作数视为32位的二进制串（0和1组成）而非十进制八进制或十六进制数。例如：十进制数字9用二进制表示为1001，位运算符就是在这个二进制表示上执行运算，但是返回结果是标准的JavaScript数值。

> 位运算只对整数有效，遇到小数时，会将小数部分舍去，只保留整数部分。所以，将一个小数与`0`进行二进制或运算，等同于对该数去除小数部分，即取整数位。([网道](https://wangdoc.com/javascript/operators/bit) )

javascript位运算符表格一览

| Operator                                                     | Usage     | Description                                                  |
| ------------------------------------------------------------ | --------- | ------------------------------------------------------------ |
| 按位与 AND                                                   | a & b     | 在a,b的位表示中,每一个对应的位都为1则返回1,否则返回0         |
| 按位或 OR                                                    | a \| b    | 在a,b的位标识中,每一个对应的位,只要有一个为1则返回1,否则返回0 |
| 按位异或 XOR                                                 | a ^ b     | 在a,b的位表示中，每一个对应的位，两个不相同则返回1，相同则返回0. |
| 按位非[ NOT](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_NOT) | `~ a`     | 反转被操作数的位。                                           |
| 左移[ shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Left_shift) | `a << b`  | 将a的二进制串向左移动b位,右边移入0.                          |
| 算术右移                                                     | `a >> b`  | 把a的二进制表示向右移动b位，丢弃被移出的所有位.(译注:算术右移左边空出的位是根据最高位是0和1来进行填充的) |
| 无符号右移(左边空出位用0填充)                                | `a >>> b` | 把a的二进制表示向右移动b位，丢弃被移出的所有位，并把左边空出的位都填充为0 |
|                                                              |           |                                                              |

位运算 NOT 是三步的处理过程：

- 操作数被转换为32bit整數，以位序列（0和1组成）表示.若超過32bits，則取低位32bit，如下所示：

  ```javascript
  Before: 11100110111110100000000000000110000000000001
  After:              10100000000000000110000000000001
  ```

- 第一个操作数的每一位都与第二个操作数的对应位组对: 第一位对应第一位,第二位对应第二位,以此类推.

- 运算符被应用到每一对"位"上, 最终的运算结果由每一对“位”的运算结果组合起来.

例如,十进制数9的二进制表示是1001,十进制数15的二进制表示是1111.因此,当位运算符应用到这两个值时,结果如下:

简单的理解，对任一数值 x 进行按位非操作的结果为 **-(x + 1)**

| 表达式  | 结果 | 二进制描述                       |
| ------- | ---- | -------------------------------- |
| 15 & 9  | 9    | 1111 & 1001                      |
| 15 \| 9 | 15   | 1111 & 1001                      |
| 15 ^ 9  | 6    | 1111 ^ 1001   => 0110            |
| ~ 15    | -16  | ~00000...1111 ===> 1111.....0000 |
|         |      |                                  |

#### 0. 计算机中如何表示数字

数字以一系列高低电信号的形式保存在计算机硬件中,因此他们被认为是基数为2的数(基数为2的数称为二进制数).

由于在计算机中所有信息的都是由二进制位(binary digit)或位(bit)表示,因此二进制数计算的'原子'单位是单个数位.有两种取值:高或低,开或关,真或假,1或0.

在64位<u>双字(doubleword/DW)</u>中,从右向左依次将位编号位0,1,2,3...,RISC-V中的双字为64位宽,因此可以表示2的64次方种不同的组合模式.这些组合自然可以表示从0到2的64次方减1(18 446 774 073 709 551 615)之间的数.
$$
00000000\quad00000000\quad00000000\quad00000000\quad00000000\quad00000000\quad00000000\quad00000000_2=0_{10}\\

00000000\quad00000000\quad00000000\quad00000000\quad00000000\quad00000000\quad00000000\quad00000001_2=1_{10}\\
00000000\quad00000000\quad00000000\quad00000000\quad00000000\quad00000000\quad00000000\quad00000010_2=2_{10}\\
...\\
11111111\quad11111111\quad 11111111\quad 11111111\quad 11111111 \quad11111111\quad 11111111 \quad11111101_2 = 18\;446\;744\;073\;709\;551\;613_{10}\\

11111111\quad11111111\quad 11111111\quad 11111111\quad 11111111 \quad11111111\quad 11111111 \quad11111110_2 = 18\;446\;744\;073\;709\;551\;614_{10}\\

11111111\quad11111111\quad 11111111\quad 11111111\quad 11111111 \quad11111111\quad 11111111 \quad11111111_2 = 18\;446\;744\;073\;709\;551\;615_{10}\\
$$
位(bit),音译'比特',表示二进制位.位是计算机内部数据存储的最小单位,一个二进制位只可以表示0或1两种状态中的一种,两个二进制位有4种状态,三个二进制位可表示8种状态.

字节(Byte),字节是通过网络传输信息(或硬盘,内存存储存储信息),计算机种数据处理的基本单位.规定一个字节由8个二进制位构成,即1个字节等于8个比特.(1Byte = 8bit).通常1个字节可以存入一个ASCII码,2个字节可以存放一个汉字国标码. 一个ascii码就是一个字节,因为ascii码的二进制范围是00000000到11111111,十进制范围是0到255.

字(word),是计算机进行数据处理时,一次存取,加工和传送的数据长度称为字.

* 1个字等于两个字节等于16位

* 一个字通常由1个或多个字节构成.计算机的字长决定了其cpu一次操作处理实际位数的多少.计算机的字长越长,性能越好.

双字(D)

* 1个双字等于2个字等于32位
* 1个双字是4个字节



**原码表示**

计算机程序可以计算正数和负数,因此需要一种表示方法了区分正数和负数.最显然的一个方法是增加一个符号位来表示,这种表示方法称为**原码表示**(sing and magnitude).因为存在符号位位置不明确及需要额外的步骤来设置符号,导致被放弃.

**补码**(two's complement)

简化硬件表示法:前导0表示正数,前导1表示负数.
$$
00000000\quad00000000\quad 00000000\quad 00000000\quad 00000000 \quad00000000\quad 00000000 \quad00000000_2 = 0_{10}\\

00000000\quad00000000\quad 00000000\quad 00000000\quad 00000000 \quad00000000\quad 00000000 \quad00000001_2 = 1_{10}\\

00000000\quad00000000\quad 00000000\quad 00000000\quad 00000000 \quad00000000\quad 00000000 \quad00000010_2 = 2_{10}\\

...\\

01111111\;11111111\;11111111\;11111111\;11111111\;11111111\;11111111 \;11111101_2 = 9\;223\;372\;036\;854\;775\;805_{10}\\

01111111\;11111111\;11111111\;11111111\;11111111\;11111111\;11111111 \;11111110_2 = 9\;223\;372\;036\;854\;775\;806_{10}\\

01111111\;11111111\;11111111\;11111111\;11111111\;11111111\;11111111 \;11111111_2 = 9\;223\;372\;036\;854\;775\;807_{10}\\
...\\
10000000\;00000000\;00000000\;00000000\;00000000\;00000000\;00000000\;00000000_2 = -9\;223\;372\;036\;854\;775\;808_{10}\\

10000000\;00000000\;00000000\;00000000\;00000000\;00000000\;00000000\;00000001_2 = -9\;223\;372\;036\;854\;775\;807_{10}\\

10000000\;00000000\;00000000\;00000000\;00000000\;00000000\;00000000\;00000010_2 = -9\;223\;372\;036\;854\;775\;806_{10}\\

...\\

11111111\;11111111\;11111111\;11111111\;11111111\;11111111\;11111111 \;11111101_2 = -3_{10}\\

11111111\;11111111\;11111111\;11111111\;11111111\;11111111\;11111111 \;11111110_2 = -2_{10}\\

11111111\;11111111\;11111111\;11111111\;11111111\;11111111\;11111111 \;11111111_2 = -1_{10}\\
$$
从0到`9 223 372 036 854 775 807`(2<sup>63</sup> - 1)的正数与之前的表示相同.位模式1000...000<sub>2</sub>表示最小负数-9 223 372 036 854 775 808<sub>10</sub>(-2<sup>63</sup>). 而后是一组递增的负数: 从-9 223 372 036 854 775 807<sub>10</sub>(1000...000<sub>2</sub>)到-1(111...111<sub>2</sub>).

二进制补码有一个负数没有相应的正数: -9 223 372 036 854 775 808<sub>10</sub>.

二进制补码的优点:  所有负数的最高有效位都为1.因此硬件只需要检测这一位就可以查看是正数还是负数(数字0被认为是正数).这个为通常称为**符号位(sign bit)**. 通过符号位,可以用每位数值乘以2的幂之和来表示正负数的64位数:

符号位乘以-2<sup>63</sup>,然后其余位分别乘以他们各自基值的正值.
$$
(x_{63} × -2^{63}) + (x_{62} * 2^{62}) + (x_{61} * 2^{61}) + ... + (x_1 * 2^1) + (x_0 * 2^0)
$$


例题: 二进制转换为十进制

下面这个64位二进制补码的十进制是多少?

11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111100<sub>2</sub>

答案:

(1\*-2<sup>63</sup>) + (1\*2<sup>62</sup>) + (1\*2<sup>61</sup>) + ... + (1\*2<sup>2</sup>) + (0\*2<sup>1</sup>) + (0*2<sup>0</sup>)

= -2<sup>63</sup> + 2<sup>62</sup> + 2<sup>61</sup> + ... + 2<sup>2</sup> + 0 + 0

= -9 223 372 036 854 775 808<sub>10</sub> + 9 223 372 036 854 775 804<sub>10</sub>

= -4<sub>10</sub>



二进制补码的两种快捷方式

<u>对二进制补码求相反数的快速方法</u>

把每个0都转为1以及每个1都转为0,然后对结果加1. 这个捷径基于以下观察: 一个数与其取反表达式的和一定是111...111<sub>2</sub>,它表示负1. 由于x+<span style="text-decoration: overline">x</span> = -1.,因此x+<span style="text-decoration: overline">x</span>+1 = 0或x+1 = -<span style="text-decoration: overline">x</span>.(用符号来表示<span style="text-decoration: overline">x</span>按位取反)



<u>将一个用n位表示的二进制数转换位一个用多于n位表示的数</u>

先取位数更少的数的最高位(符号位),并将其复制来填充位数更多的数的新位.原来的非符号位被复制到新双字的右侧部分.这个方式通常被称为符号扩展(sign extension)

实例,将16位二进制数2<sub>10</sub>和-2<sub>10</sub>转换成64位二进制数

数字2的16位二进制数
00000000 00000010<sub>2</sub> = 2<sub>10</sub>

通过把最高有效位(0)复制48份放到双字的左侧,将其转换位64位数.把原来的值放到右侧:

00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000010<sub>2</sub> = 2<sub>10</sub>

使用前面的快捷方式对16位二进制数2求反,因此:

11111111 11111101<sub>2</sub> + 1<sub>2</sub> = 11111111 11111110<sub>2</sub>

将负数转换成64位意味着要将符号位复制48次并放到左侧:

11111111 11111111 11111111 11111111 11111111 11111111 11111111 11111110<sub>2</sub> = -2<sub>10</sub>

该方式之所以有效是因为在正数二进制补码的左侧实际上是无限个0,而负数的二进制补码在左边是无限个1. 二进制位模式隐藏了前面的位以适应硬件的宽度,符号扩展只是恢复了一些.



**计算机中为什么需要补码和反码**

> https://demonlee.tech/archives/%E8%AE%A1%E7%AE%97%E6%9C%BA%E4%B8%AD%E8%BF%90%E7%AE%97%E4%B8%BA%E4%BD%95%E9%9C%80%E8%A6%81%E5%8F%8D%E7%A0%81%E5%92%8C%E8%A1%A5%E7%A0%81



二进制位运算符

> 二进制运算符将他们的操作数作为32个二进制位(0或1)的集合,并蒋方舟标准的JS数值.

#### 二进制位与(AND) `&`

> 按位与运算符(&)在两个操作数对应的二进制位都为1时,该位的结果值才为1, 否则为0

##### 语法

```javascript
a & b
```

##### 描述

操作数被转换为32位整数，并由一系列位（0和1）表示。 超过32位的数字将丢弃其最高有效位。 例如，以下大于32位的整数将被转换为32位整数：

```javascript
Before: 11100110111110100000000000000110000000000001
After:              10100000000000000110000000000001
```

第一个操作数中的每个位都与第二个操作数中的相应位配对：第一位到第一位，第二位到第二位，依此类推。

将运算符应用于每对位，然后按位构造结果。

```javascript
.    9 (base 10) = 00000000000000000000000000001001 (base 2)
    14 (base 10) = 00000000000000000000000000001110 (base 2)
                   --------------------------------
14 & 9 (base 10) = 00000000000000000000000000001000 (base 2) = 8 (base 10)
```

将任何数字`x`与`0`进行按位与运算将得出`0`。

##### 实例

<u>如何判断一个数字是不是2的n次方幂</u>

方案1: 按位与操作符

通过二进制的方法来判断.规律: 只要num是2的次方幂,最高位必然是1,其余为0.num-1则最高位必然是0, 其余位为1.

```javascript
8的二进制 1000 8-1 的二进制 0111    按位与运算      1000&0111 => 0000   所以8是2的n次方幂
9的二进制 1001 9-1 的二进制 1000    按位与运算      1001&1000 => 1000   所以9不是2的次方幂。
24的二进制 11000  24-1的二进制 10111 按位与运算     11000&10111 => 10000  所以24不是2的次方幂。
```

通过num.toString(2)来获取num的二进制

```javascript
//代码实现

function check(num) {
  return (num > 0 ) &&((num & (num-1)) === 0)
}

function check(num) {
  return /^10$/.test(num.toString(2))
}

function check(num) {
  return Number.isInteger(Math.log2(num))
}
```







#### 按位非运算符

按位非(~)运算符,反转操作数的位.

注意位运算符“非”将所有的32位取反，而值的最高位(最左边的一位)为1则表示负数(2-补码表示法)。

对非数值变量取反,得到的一定是负1,因为实际上等于对0取反.

```javascript
二进制相反数是该二进制每位反转,然后+1;
15的反码是~15, 那么~15 + 1 = -15,所以 ~15 = -15 - 1;

~x 相当于 -(x+1)
~~x 相当于-(-(x+1) + 1) x+1-1
```

对一个非数值变量取反操作,得到的一定是-1,因为实际上等于对0做取反操作

```javascript
~null //-1
~NaN //-1
~'xx' //-1
~{} //-1
~function func() {} //-1
```



`~1`的步骤:

* 将十进制数字1转换为32位的二进制: `0000 0000 ... 0000 0001`    
* 按位取反 `1111 1111 ... 1111 1110`.这个就是结果,但我们需要将它再取反,获得容易计算的二进制数.
* 最高位数字1表示负数,0表示正数. 将除了符号位之外的其他数字取反. `1000 0000 ... 0000 0001`
* 末位加1取其补码(**二进制负数等于反码+1**)  `1000 000 ... 000 0010`
* 转换为十进制 `-2`



> 来源: https://www.cnblogs.com/moqiutao/p/6275483.html
>
> * 按位取反的运算规则是所有的计算机语言都是这样的。这样做的主要原因是为了为了统一减法和加法，在计算机中，减法会变成加一个负数，而负数会以补码的形式存储。而这样主要是因为补码和数字的十进制数有这么转换关系，负数：**`补码(x) = -x - 1`**，正数：**`补码(x) = x`**
> * 因为补码是针对负数存在的，那么只要数据类型有**`无符号数`**，就没有这样的烦恼了，比如C语言有无符号整型，就能对无符号整型直接按位取反。
> * 如果没有无符号类型，而且也只是想要按位取反，而不是附带补码的按位取反，需要另外的方法。让全1的数据和当前数据做按位抑或就行了。比如，你有一个32位的数据a，需要对它做按位取反，那么这样就行了：**`0xFFFF ^ a`**
>
> https://juejin.cn/post/6844903717611782157
>
> * 二进制的负数就是取该二进制数的补码,然后+1  (补码就是按位取反后的数)
> * 二进制数, 最高位为0表示正数,最高位为1表示负数.
> * `~`按位非操作其实就是取补码的过程,也就是上述求该值负数的逆过程,所以可以简单的理解为该值取负值后减1。
>
> 



**应用**

**1. indexOf()**

```javascript
//判断数组或字符串是否存在某个元素
if (str.indexOf(query) !== -1) {}
if (str.indexOf(query) >= 0) {}

if (~str.indexOf(query))
不存在返回-1,~-1 = 0 ,大于-1的值,0,1,2,3 ... 按位非的值1,2,3,4...都大于0
```



**2. ~~value**

对于浮点数,~~value可以代替parseInt(value),而且前者效率更高些

```javascript
parseInt(-2.99); //-2
~~(-2.99); //-2
```



```javascript
console.log('~null: ', ~null);       // => -1
console.log('~undefined: ', ~undefined);  // => -1
console.log('~0: ', ~0);          // => -1
console.log('~{}: ', ~{});         // => -1
console.log('~[]: ', ~[]);         // => -1
console.log('~(1/0): ', ~(1/0));      // => -1
console.log('~false: ', ~false);      // => -1
console.log('~true: ', ~true);       // => -2
console.log('~1.2543: ', ~1.2543);     // => -2
console.log('~4.9: ', ~4.9);       // => -5
console.log('~(-2.999): ', ~(-2.999));   // => 1



console.log('~~null: ', ~~null);       // => 0
console.log('~~undefined: ', ~~undefined);  // => 0
console.log('~~0: ', ~~0);          // => 0
console.log('~~{}: ', ~~{});         // => 0
console.log('~~[]: ', ~~[]);         // => 0
console.log('~~(1/0): ', ~~(1/0));      // => 0
console.log('~~false: ', ~~false);      // => 0
console.log('~~true: ', ~~true);       // => 1
console.log('~~1.2543: ', ~~1.2543);     // => 1
console.log('~~4.9: ', ~~4.9);       // => 4
console.log('~~(-2.999): ', ~~(-2.999));   // => -2
```



#### 2.位移运算符

在二进制基础上对数字进行移动操作



##### 2.1 `<<` 按位左移运算符

> Bitwise left shift operator

**what**
> 将第一个操作数向左移动指定位数，左边超出的位数将会被清除，右边将会补零。

**语法**
```js
a << b
```

**描述**
例如， 9 << 2 得出 36：
```js
9 (十进制): 00000000000000000000000000001001 (二进制)


9 << 2 (十进制): 00000000000000000000000000100100 (二进制) = 36 (十进制)
```

移动任意数字 x 至左边 y 位，得出 x * 2 ** y。 
所以例如：9 << 3 等价于 9 * 2³ = 9 * 8 = 72。





##### 2.2 `>>` 按位右移运算符
> Bitwise right shift opearotr

**what**
是将一个操作数按指定移动的位数向右移动，右边移出位被丢弃，左边移出的空位补符号位（最左边那位）

**语法**
```js
a >> b
```

**描述**
这个操作符向右移动第一个操作数(operand)指定位数. 向右移动(shifted off to right)的多余位将被丢弃. 最左边位的副本从左边移入. 由于最左边新位与之前最左边位有相同的值, 符号位(最左边位)不会变. 所以又被称作'sign-propagating'(符号传播).

考虑十进制(decimal)数字9 和 -9 的32位二进制表示
```js
     9 (base 10): 00000000000000000000000000001001 (base 2)
    -9 (base 10): 11111111111111111111111111110111 (base 2)
```
注意,负10进制数字-9的二进制表示是正十进制数字9的二进制表示的补码.也就是说(That is),它通过将`000000000000000000000000001001`的所有位取反并加1来计算的。
在这两种情况下, 二进制数的符号都是由最左边位给出: 对于正十进制数9,二进制表示的最左边位是0, 对于负十进制数-9, 二进制表示的最左边位是1

给予10进制数字9和-9的二进制表示:
`9>>2` 产生2:
```js
     9 (base 10): 00000000000000000000000000001001 (base 2)
                  --------------------------------
9 >> 2 (base 10): 00000000000000000000000000000010 (base 2) = 2 (base 10)
```
注意,两个最右边位, `01`, 已经移出, 并且最左边位的两个副本, `0` 已经从左边移入(shift in)

`-9 >> 2`,产生 `-3`
```js
     -9 (base 10): 11111111111111111111111111110111 (base 2)
                   --------------------------------
-9 >> 2 (base 10): 11111111111111111111111111111101 (base 2) = -3 (base 10)
```

注意两个最右边位,`11`,是如何移出的. 但就最左边位而言, 在这种情况下, 最左边位是`1`. 所以最左边`1`位的两个副本已经从左边移入 - 这保留了负号.

左操作数将被转换成32位整数,这意味着浮点数字将被删除, 不在 32 位边界内的数字将溢出/下溢。
右操作数将被转换成无符号32位整数,然后取模32(then take modulo 32), 因此，实际偏移量将始终是介于 0 和 31 之间的正整数（包括 0 和 31）。例如, `100>>32`和`100>>0`一样(结果是100), 因为32取模32是0.  ???






##### 2.3 `>>>` 按位无符号右移运算符

**Define**

> Bitwise unsigned right shift oprator
>
> the unsigned right shift operator(>>>) (zero-fill right shift) shifts the first operand the specified number of bits to the right. Excess bits shifted off to the right are discarded. Zero bits are shifted in from the left. The sign bit becomes 0, so the result is always non-negative. Unlike the other bitwise operators, zero-fill right shift returns an unsigned 32-bit integer.

无符号右移操作符（>>>）（零填充右移）将第一个操作数向右移动指定的位数。向右移出的多余的位被丢弃,再从从左边移入0。符号位变为0，所以结果总是非负的。与其他位操作符不同，零填充右移返回一个无符号的32位整数。

**Desc**

> this operator shifts first operand the specified number of bits to the right.
>
> 这个操作符向右移动第一个操作数具体位数
>
> Excess bits <u>shifted off(移出)</u> to the right are discarded.
>
> 向右移出多余的比特(位)被丢弃
>
> Zero bits are <u>shifted in(移入)</u> from the left.
>
> 0位从左边被移入
>
> The sign bit becomes `0`, so the result always non-negative.
>
> 符号位成为0, 所以结果总是非负的.
>
> Unlike the other bitwise operators, zero-fill right shift returns an unsigned 32-bit integer.
>
> 和其他位操作符不同, `0填充右移`返回一个 无符号 的32位整数





对非负整数,零填充右移符号和符号传播右移得到一样的结果.例如

```javascript
9(base 10): 00000000000000000000000000001001 (base 2)
9>>>2(base 10): 00000000000000000000000000000010 (base 2) = 2 (base 10)
```

对负数来说,两者结果不同

```javascript 
-9    (base 10):   11111111111111111111111111110111 (base 2)
-9>>>2(base 10):   00111111111111111111111111111101 (base 2)

//如何快速得出右移后的十进制数
1.取反加1 11....11
2.计算 1*(-2的31次方) + 1*(2的30次方) + ... + 1*(2的1次方) + 1*(2的0次方) = 1073741821 = 9>>>2

-1>>>0 这里JS会把符号位替换成0,所以结果并不是-1,而是-2的32次方+1

```

**注意**

* 取整,但不可对负数取整.

* JS做位运算时,小数部分会忽略

* 非数值运算会变成0

```javascript
1.01 >>> 2
1.01(10)        00000000000000000000000000000001 //? 这里写错了,应该是仍然存在小数位吧,但在应用右移操作符时应该会被忽略
1.01(10) >>> 2  00000000000000000000000000000000 //转换成十进制为0

-2 >>> 0
2        00000000000000000000000000000010
-2       11111111111111111111111111111110  //进制转负数需要取反且加1
-2 >>> 0 11111111111111111111111111111110  //结果是将二进制转换成10进制  




1>>>0  //1
1.5>>>0 //1
-1>>>0 //4294967295
null>>>0 //0
undefined>>>0 //0
'sldkfj'>>>0 //0
```



**Other**

1.1 JS中为什么浮点数也能参与位运算,在java,go,c中是不允许的?

在JS中Number类型不区分整型,浮点型的.为了不丢失精度,JS中的Number类型实际上是一个基于IEEE754标准的双精度64位浮点数.

JS需要位运算时,会将操作数转成32位比特序列,也就是补码.再按照64位浮点数存储.

1.2 JS中非数值类型如何进行位运算?

* 对于非数值类型,会首先将操作数转成一个整型(就是0),然后再进行计算.实际上这是一个伪命题,实质上是对非数值操作数的整型表达式进行的位运算.
* JS中的整型在内存中是一个64位双精度浮点型,但JS在进行位运算时,会将操作数转成带符号位的32位比特序列,也就是补码(????).运算结束后,再按照64位存储.这里肯定会存在精度丢失的问题,JS如何处理呢?超过32位的部分直接截断.






## Logical operators(逻辑运算符)

#### 逻辑与(&&)

> &&用来对两个值进行 与 运算
>
> 当两个值同时为true时,才会返回true, 否则返回false
>
> 与是找false的  因为有一个false,&&的结果就是false
>
> 与运算是短路的与, 如果第一个值是false,则不会看第二个值

```JavaScript
let result = true && true; // true

result = false && true; // false
result = true && false; // false
result = false && false; // false


true && alert('你猜我出来吗?'); // 第一个值是true,会查看第二个值
false && alert('你猜我出来吗?'); //不会弹出 第一个值是false,不会看第二个值
```





#### 逻辑或(||)

>||用来对两个值进行 或 运算
>
>当两个值有一个是true,就返回true, 都是false才返回false
>
>==或是找true的==
>
>或运算是短路的或,如果第一个值是true,则不会看第二个值

```JavaScript
result = true || true; //true
result = true || false; //true
result = false || true; // true
result = false || false; //false

false || alert('你猜我出来吗?'); //第一个值是false,会查看第二个值
true || alert('你猜我出来吗'); // 不会弹出. 第一个值是true,不会查看第二个
```







#### 非布尔值的逻辑运算

当对非布尔值进行逻辑运算,它会先将其转换为布尔值.然后进行逻辑运算,最终**返回原值.**

- **与运算**
  - 第一个值是false,直接返回第一个
  - 第一个值是true,返回第二个

```JavaScript
let result = 1 && 2; //返回2

result = 0 && 1; //返回0

result = 0 && NaN; //返回0
result = NaN && 0; //返回NaN
```



- **或运算**
  - 第一个值是true,直接返回第一个
  - 第一个值是false,返回第二个

```JavaScript
let result = 1 || 2; //返回1
result = 0 || 2; //返回2
result = null || 'hello'; //返回'hello'

result = null || undefined; //返回undefined
```



#### 逻辑运算符的赋值操作

**空值合并操作符: ** ??

在当左侧操作数为 undefined 或 null 时，该操作符会将右侧操作数赋值给左侧变量

```js
const name = null ?? '前端';
console.log(name); //前端

空值合并操作符和逻辑操作符结合使用:
a ||= b; // 等同于 a || (a = b);

a &&= b; // 等同于 a && (a = b);

a ??= b; // 等同于 a ?? (a = b);
```


#### 5.3 空值合并运算符??

```javascript
a ?? b
//如果 a 是已定义的，则结果为 a，既不是 null 也不是 undefined 的表达式称为“已定义的（defined）
//如果 a 不是已定义的，则结果为 b。
```

如果第一个参数不是 `null/undefined`，则 `??` 返回第一个参数。否则，返回第二个参数。

```javascript
//重写

let result = (a!==null && a!== undefined) ? a : b;
```

**使用场景**

* 为可能是未定义的变量提供一个默认值

```javascript
let user;
console.log(user ?? 'Anonymous'); //Anonymous
            
let user = 'John';
console.log(user ?? 'Anonymous'); //John
```



* 从一系列值中选择出第一个非`null/undefined`的值

```javascript
//用这些变量之一显示用户名，如果这些变量的值都是未定义的，则显示 “Anonymous”。

let firstName = null,
    lastName = null,
    nickName = 'John';

console.log(firstName ?? lastName ?? nickName ?? 'Anonymous'); //John
```



**与或运算符区别**

或运算符 `||` 可以以与 `??` 运算符相同的方式使用, 例如，在上面的代码中，我们可以用 `||` 替换掉 `??`，也可以获得相同的结果.

重要区别:

- `||` 返回第一个 **真** 值。 (除了 `null undefined false 0 ''`之外的值)
- `??` 返回第一个 **已定义的** 值。 (除了`undefined, null`之外的值)



**优先级**

`??` 运算符的优先级相当低：在 [MDN table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table) 中为 `5`。因此，`??` 在 `=` 和 `?` 之前计算，但在大多数其他运算符（例如，`+` 和 `*`）之后计算。

如果我们需要在还有其他运算符的表达式中使用 `??` 进行取值，需要考虑加括号



**?? 与 && 或 || 一起使用**

出于安全原因，JavaScript 禁止将 `??` 运算符与 `&&` 和 `||` 运算符一起使用，除非使用括号明确指定了优先级。

```javascript
//下面的代码会触发一个语法错误：
let x = 1 && 2 ?? 3; // Syntax error

//这个限制无疑是值得商榷的，但它被添加到语言规范中是为了避免人们从 || 切换到 ?? 时的编程错误。
let x = (1 && 2) ?? 3; // 正常工作了
```







## Conditional(ternary) operators(三元运算符)

* 语法: ==条件表达式 ? 语句1 : 语句2==

* 执行流程:

  * 条件运算符在执行的时候,它会先对 条件表达式 进行求值判断
    * 如果判断结果为true,  则执行语句1
    * 如果判断结果为false, 则执行语句2 

* ```JavaScript
  false ? alert('语句1') : alert('语句2');
  
  let a = 115;
  let b = 30;
  let c = 500;
  
  //获取a和b中的较大值
```js
  let max = a > b ? a : b;
  console.log(max);
  
  //获取a,b,c中的最大值
  
  let max = a > b ? a : b;
  max = max > c ? max : c;
  console.log(max);
```










## Unary operators(一元运算符)

#### 一元运算符

> 只需要一个 **操作数** 进行运算.  typeof 就是一元运算符

#### 一元正号(+)

```js
//特点
1.一元正号运算符位于其操作数前面，计算其操作数的数值
2.会尝试将其转换成一个数值。 尽管一元负号也能转换非数值类型，但是一元正号是转换其他对象到数值的最快方法，也是最推荐的做法，因为它不会对数值执行任何多余操作。
3.可将字符串转换成整数和浮点数形式，也可以转换非字符串值 true，false 和 null。
4.小数和十六进制格式字符串也可以转换成数值。
5.负数形式字符串也可以转换成数值（对于十六进制不适用）。如果它不能解析一个值，则计算结果为 NaN。
```



```js
//使用

+3 //3
+'3' //3
+true //1
+false //0
+null //0
+function(val){return val}; //NaN
```



#### 一元负号(-)

一元负号运算符位于操作数前面，并转换操作数的符号

```js
//语法

运算符: -x

//示例
var x = 3;
y = -x; //y=-3 x=3
```



#### 一元操作符

当 + 运算符作为一元操作符的时候，查看 [ES5规范1.4.6](http://es5.github.io/#x11.4.6)，会调用 `ToNumber` 处理该值，相当于 `Number('1')`，最终结果返回数字 `1`。

```javascript
console.log(+[]); 
console.log(+['1']); 
console.log(+['1','2','3']);
console.log(+{});
```

既然是调用 `ToNumber` 方法，回想[《JavaScript 深入之头疼的类型转换(上)》](https://github.com/mqyqingfeng/Blog/issues/159)中的内容，当输入的值是对象的时候，先调用 `ToPrimitive(input, Number)` 方法，执行的步骤是：

1. 如果 `obj` 为基本类型，直接返回
2. 否则，调用 `valueOf` 方法，如果返回一个原始值，则 `JavaScript` 将其返回。
3. 否则，调用 `toString` 方法，如果返回一个原始值，则`JavaScript` 将其返回。
4. 否则，`JavaScript` 抛出一个类型错误异常。

以 `+[]` 为例，`[]` 调用 `valueOf` 方法，返回一个空数组，因为不是原始值，调用 `toString` 方法，返回 `""`。

得到返回值后，然后再调用 `ToNumber` 方法，`""` 对应的返回值是 `0`，所以最终返回 `0`。


##### 规范:

> 规范地址：http://es5.github.io/#x11.6.1
>
> 当计算 value1 + value2时：
>
> 1. lprim = ToPrimitive(value1)
> 2. rprim = ToPrimitive(value2)
> 3. 如果 lprim 是字符串或者 rprim 是字符串，那么返回 ToString(lprim) 和 ToString(rprim)的拼接结果
> 4. 返回 ToNumber(lprim) 和 ToNumber(rprim)的运算结果



##### Null 与 数字

```javascript
console.log(null + 1);
```

按照以上规范的步骤进行分析:

1.lprim = ToPrimitive(null) 因为null是基本类型,直接返回,所以lprim = null

2.rprim = ToPrimitive(1) 因为1是基本类型,直接返回. 所以rprim = 1

3.lprim 和 rprim都不是字符串

4.返回ToPrimitive(null) 和 ToPrimitive(1)的运算结果

接下来：

`ToNumber(null)` 的结果为0，(回想上篇 Number(null))，`ToNumber(1)` 的结果为 1

所以，`null + 1` 相当于 `0 + 1`，最终的结果为数字 `1`。



##### 数组与数组

```javascript
console.log([] + []);
```

按照规范:

1.lprim = ToPrimitive([]), []是数组, 相当于调用ToPrimitive([], Number), 先调用valueOf方法,返回对象本身,因为不是原始值,调用toString方法,返回空字符串''.

2.rprim类似

3.lprim 和 rpim都是字符串,执行拼接操作

所以, [] + [] 相当于 '' + '', 最终结果是空字符串''.



##### 数组与对象

```javascript
console.log([] + {});
console.log({} + []);
```

按照规范:

1.lprim = ToPrimitive([]), lprim = ''

2.rprim = ToPrimitive({}), 相当于调用ToPrimitive({}, Number).  先调用valuefOf()方法,返回对象本身,,因为不是原始值,调用toString方法, 返回'[object Object].

3.lprim 和 rpim都是字符串, 执行拼接操作

所以, `[] + {}` 相当于 `'' + [object Object]`, 最终的结果是'[object Object]'.

下面的案例, 按照示例推出结果

```javascript
console.log(1 + true);
console.log({} + {});
console.log(new Date(2017, 04, 21) + 1);
```

结果是

```javascript
console.log(1 + true); // 2
console.log({} + {}); //'[object Object][object Object]'
console.log(new Date(2017, 04, 21) + 1); //"Sun May 21 2017 00:00:00 GMT+0800 (CST)1"
```



##### 注意:

以上的运算都是在 `console.log` 中进行，如果你直接在 `Chrome` 或者 `Firebug` 开发工具中的命令行直接输入，你也许会惊讶的看到一些结果的不同，比如：

```javascript
> {} + []
<. 0
```

我们刚才才说过 `{} + []` 的结果是 `"[object Object]"` 呐，这怎么变成了 `0` 了？

不急，我们尝试着加一个括号：

```javascript
> ({} + [])
< "[object Object]"
```

结果又变成了正确的值，这是为什么呢？

其实，在不加括号的时候，`{}` 被当成了一个独立的空代码块，所以 `{} + []` 变成了 `+[]`，结果就变成了 0

同样的问题还出现在 `{} + {}` 上，而且火狐和谷歌的结果还不一样：

```javascript
> {} + {}
//火狐: NaN
//Chrome: "[object Object][object Object]"
```

如果 `{}` 被当成一个独立的代码块，那么这句话相当于 `+{}`，相当于 `Number({})`，结果自然是 `NaN`，可是 `Chrome` 却在这里返回了正确的值。

那为什么这里就返回了正确的值呢？我也不知道，欢迎解答~   ????


#### 逻辑非(!)

> 可以用来对一个布尔值进行**取反**操作   true 变 false  false 变 true



对 非布尔值 进行<u>逻辑非</u>运算,会先将其转换为布尔值 然后再取反

利用这个特点,可以对一个<u>非布尔值</u>取两次反,来将其转换为对应的布尔值

原理和Boolean()函数一样,但是更简便(隐式类型转换)

```javascript
let a = false;
a = !a;
console.log(a, typeof a); // true true


let b = 10;
b = !b;
console.log(b, typeof b); //false, "boolean"

b=!!b;
console.log(b,typeof b); // true, "boolean"
```





## BigInt operators




## String operators



## Comma operator(逗号运算符)


在JavaScript中描述了一组用于操作数据值的运算符，包括算术运算符（加号、减号）、关系运算符（大于、小于）、等于运算符（双等于、三等于）、位运算符（与、或、非）等。

由于JavaScript是弱类型语言，因此在运算符的使用上更加灵活，接下来就对其中比较重要的一些运算符进行详细的讲解。

### 逗号操作符

一方面它是基本的分隔符，例如，函数传递多个参数时，使用逗号分隔。另一方面它可以作为一个运算符，作用是将多个表达式连接起来，从左至右依次执行。

逗号作为运算符的表现形式为：表达式1，表达式2，表达式3，……，表达式n。

它的求解过程将按照从左至右的顺序进行，优先执行表达式1，然后执行表达式2……直到执行表达式n，最后返回表达式n的结果。

#### 定义

**逗号操作符** 对它的每个操作数求值（从左到右），并返回最后一个操作数的值。

#### 描述

当你想要在期望一个表达式的位置包含多个表达式时，可以使用逗号操作符。这个操作符最常用的一种情况是：`for` 循环中提供多个参数。

#### 示例

假设 `a` 是一个二维数组，每一维度包含 10 个元素，则下面的代码使用逗号操作符一次递增/递减两个变量。需要注意的是，`var` 语句中的逗号***不是***逗号操作符，因为它不是存在于一个表达式中。尽管从实际效果来看，那个逗号同逗号运算符的表现很相似。但确切地说，它是 `var` 语句中的一个特殊符号，用于把多个变量声明结合成一个。

```javascript
for (var i = 0, j = 9; i <= 9; i++, j--)
  document.writeln("a[" + i + "][" + j + "] = " + a[i][j]);
```



处理后返回

另一个使用逗号操作符的例子是在返回值前处理一些操作。如同下面的代码，只有最后一个表达式被返回，其他的都只是被求值。

```javascript
function myFunc () {
  var x = 0;

  return (x += 1, x); // the same of return ++x;
}
```



#### 逗号作为运算符的使用场景

<u>1. 在for循环中批量执行表达式</u>

逗号运算符在for循环中的使用场景是批量执行表达式。如果一个for循环中有多个变量需要执行表达式，可以通过逗号运算符一次性执行。

```js
for (var i = 0, j = 10; i < 10, j < 20; i++, j++) {
   console.log(i, j); 
}
```

一般在for循环的末尾处，只允许执行单个表达式。在这里我们通过逗号运算符，将i++和j++两个表达式视为同一个表达式，因此可以一次执行，处理i与j两个变量的递增。



<u>2. 用于交换变量，无须额外变量</u>  ???

在我们需要交换两个变量的值时，通常的做法如下所示。

```js
var a = 'a';
var b = 'b';
var c;

c = a;
a = b;
b = c;
```

借助临时变量c先存储a的值，然后将b值赋给a，再将c值赋给b，这样就可以实现变量交换了。

不允许使用额外的变量存储, 使用逗号运算符的方案。
```js
var a = 'a';
var b = 'b';
// 方案1
a = [b, b = a][0];
// 方案2
a = [b][b = a, 0];   // ?
```

在方案1中，前一部分[b, b = a]是一个一维数组，数组第二项值是b = a，实际会将a值赋给b，然后返回“'a'”，因此数组最终的值为['b', 'a']，然后取索引0的值为'b'，赋给变量a，最终实现a = 'b', b = 'a'。

在方案2中，前一部分[b]是一个一维数组，后一部分[b = a, 0]，实际会先执行b = a，将a值赋给b，然后返回“0”，因此后一部分实际是修改了b的值并返回索引“0”，最终是a = `[b][0]`，即a = b，实现了a与b的交换。 why?



<u>3. 用于简化代码</u>

因为逗号运算符可以使多个表达式先后执行，并且返回最后一个表达式的值，因此对于某些特定的函数，我们可以使用逗号运算符进行简写。

```js
if (x) {
   foo();
   return bar();
} else {
   return 1;
}
// 使用逗号运算符简写后
x ? (foo(), bar()) : 1;
```



<u>4. 用小括号保证逗号运算符的优先级</u>

在所有的运算符中，逗号运算符的优先级是最低的，因此对于某些涉及优先级的问题，我们需要使用到小括号，将含有逗号运算符的表达式括起来。

```js
var a = 20;
var b = ++a, 10;
console.log(b);  // Uncaught SyntaxError: Unexpected number
```



## Unary operators(一元运算符)

### 是什么
> 一元运算符,是对只有一个操作数的操作.


### delete
> [delete - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete)

**define**

> the delete operator<span style="color:blue"> removes a property from an object</span>; if no more references to the same proeprty are held, it is eventually released automatically.(如果没有对同一属性更多的引用, 它最终将自动被释放)

**syntax**

> delete expression

Where expression should evaluate to property references. e.g.:

```javascript
delete obj.property
delete obj['property']
```

**return value**

`true` for all cases except when the proeprty is  an [`own`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)(Object.hasOwnProperty()) [`non-configurable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_delete) property, in which case, `false` is returned in non-strict mode.

```javascript
```



**example**

无法删除函数参数

```javascript
```




### void

### typeof操作符

#### **使用形式**
typeof运算符用于返回操作数的数据类型，有以下两种使用形式.
operand表示需要返回数据类型的操作数，可以是引用类型，也可以是基本数据类型。
```js
typeof operand
typeof (operand)
```

#### **注意事项**
* 括号有的时候是必须的，如果不加上括号将会因为优先级的问题得不到我们想要的结果。


#### 返回值和使用场景

|类型|结果|
|---|---|
|Undefined|"undefined"|
|Null|"object"|
|Boolean|"boolean"|
|Number|"number"|
|String|"string"|
|Symbol|"symbol"|
|函数对象|"function"|
|任何其它对象|"object"|

**处理Undefined类型的值**
虽然Undefined类型的值只有一个undefined，但是typeof运算符在处理以下3种值时都会返回“undefined”
* undefined本身
* 未声明的变量
* 已声明未初始化的变量

**处理Boolean类型值**
Boolean类型的值只有两个，分别是true和false。typeof运算符在处理这两个值以及它们的包装类型时都会返回“boolean”，但是不推荐使用包装类型的写法
```js
typeof true === 'boolean';          // true
typeof false === 'boolean';         // true
typeof Boolean(true) === 'boolean'; // true，不推荐这么写
```

**处理Number类型的值**
对于Number类型的数据，可以概括为以下这些值，typeof运算符在处理时会返回“number”。
* 数字，如1、123、145。
* Number类型的静态变量，如Number.MAX_VALUE、Number.EPSILON等。
* Math对象的静态变量值，如Math.PI、Math.LN2（以e为底，2的对数）。
* NaN，虽然NaN是Not a Number的缩写，但它是Number类型的值。
* Infinity和-Infinity，表示的是无穷大和无穷小的数。
* 数值类型的包装类型，如Number(1)、Number(123)，虽然它们也会返回“number”，但是并不推荐这么写

**处理String类型的值**
对于String类型的数据，可以概括为以下这些值，typeof运算符在处理时会返回“string”
* 任何类型的字符串，包括空字符串和非空字符串。
* 返回值为字符串类型的表达式。
* 字符串类型的包装类型，例如String('hello')、String('hello' +'world')，虽然它们也会返回“String”，但是并不推荐这么写。

**处理Symbol类型的值**
typeof运算符处理后得到的返回值为“symbol”
```js
typeof Symbol() === 'symbol';      // true
typeof Symbol('foo') === 'symbol'; // true
```

**处理Function类型的值**
对于Function类型的数据，可以概括为以下这些值，typeof运算符在处理时会返回“function”。
* 函数的定义，包括函数声明或者函数表达式两种形式。
* 使用class关键字定义的类，class是在ES6中新增的关键字，它不是一个全新的概念，原理依旧是原型继承，本质上仍然是一个Function。
* 某些内置对象的特定函数，例如Math.sin()函数、Number.isNaN()函数等。
* Function类型对象的实例，一般通过new关键字得到.
```js
var foo = function () {};
function foo2() {}

typeof foo === 'function';       // true，函数表达式
typeof foo2 === 'function';      // true，函数声明
typeof class C{} === 'function'; // true
typeof Math.sin === 'function';  // true
typeof new Function() === 'function';  // true，new操作符得到Function类型的实例
```

**处理Object类型的值**
对于Object类型的数据，可以概括为以下这些值，typeof运算符在处理时会返回“object”。
* 对象字面量形式，例如{name: 'kingx'}。
* 数组，例如[1, 2, 3]和Array(1, 2, 3)。
* 所有构造函数通过new操作符实例化后得到的对象，例如new Date()、new function(){}，但是new Function(){}除外。
* 通过new操作符得到的基本数据类型的包装类型对象，如new Boolean(true)、newNumber(1)，但不推荐这么写

与基本数据类型的包装类型相关的部分，我们都有写“不推荐这么写”，这是为什么呢？
>因为涉及包装类型时，使用了new操作符与没有使用new操作符得到的值在通过typeof运算符处理后得到的结果是不一样的，很容易让人混淆。

```js
typeof {a:1} === 'object';      // true，对象字面量
typeof [1, 2, 4] === 'object';  // true，数组
typeof new Date() === 'object'; // true，Date对象的实例
// 下面的代码容易令人迷惑，不要使用！
typeof new Boolean(true) === 'object';  // true
typeof new Number(1) === 'object';      // true
typeof new String("abc") === 'object';  // true
```

#### typeof对null的处理
具体可查看本文档typeof部分: [[#1.typeof]]
使用typeof运算符对null进行处理，返回的是“object”. 因为null是一个原生类型的数据，为什么typeof运算符会返回“object”呢？

这是一个在JavaScript设计之初就存在的问题，这里简单介绍下。在JavaScript中，每种数据类型都会使用3bit表示。

* 000表示Object类型的数据。
* 001表示Int类型的数据。·
* 010表示Double类型的数据。·
* 100表示String类型的数据。
* 110表示Boolean类型的数据。

由于null代表的是空指针，大多数平台中值为0x00，因此null的类型标签就成了0，所以使用typeof运算符时会判断为object类型，返回“object”。

#### typeof运算符相关语法的括号
括号有时是必须存在的，如果不加上括号则会因为优先级的问题得不到我们想要的结果。
```js
var number = 123;
typeof (number + ' hello');  // "string"
typeof number + ' hello';    // "number hello"
```

```js
typeof 1 / 0;     // "NaN"
typeof (1 / 0);   // "number"
```













## Relational operators(关系运算符)

#### in

如果指定的属性在指定的对象或其原型链中，则**`in` 运算符**返回`true`. in运算符也会检索对象的原型，**只有当对象原型为null时使用这个方法才比较稳妥**。

```js
//语法
prop in object
 prop:一个字符串类型或者 symbol 类型的属性名或者数组索引（非symbol类型将会强制转为字符串）
 object:检查它（或其原型链）是否包含具有指定名称的属性的对象
 
//示例
数组中必须使用索引号,而不是数组元素的值
let arr = new Array("redwood", "bay", "cedar", "oak", "maple");
0 in arr; //true
6 in arr; //false
'bay' in arr //false
'length' in arr //true

内置对象
'PI' in Math //true

对象
let myObj = {make: "Honda", model: "Accord", year: 1998};
'make' in myObj; //true
```



对被删除的属性使用in,返回false

```js
var mycar = {make: "Honda", model: "Accord", year: 1998};
delete mycar.make;
"make" in mycar;  // 返回false

var trees = new Array("redwood", "bay", "cedar", "oak", "maple");
delete trees[3];
3 in trees; // 返回false
```

属性的值赋值为[`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，而没有删除它，则 `in` 运算仍然会返回`true`

```js
var mycar = {make: "Honda", model: "Accord", year: 1998};
mycar.make = undefined;
"make" in mycar;  // 返回true

var trees = new Array("redwood", "bay", "cedar", "oak", "maple");
trees[3] = undefined;
3 in trees; // 返回true
```

继承属性

如果一个属性是从原型链上继承来的，`in` 运算符也会返回 `true`

```js
"toString" in {}; // 返回true

String方法是是谁身上的，无论是Object还是Function，都是返回的false.
```





#### instanceof

instanceof运算符判断一个对象是否为另一个对象的实例

the `instanceof` operator tests to see if <u>the `prototype` of a constructor</u> appears anywhere in <u>the prototype chain</u> of <u>an object</u>. The return value is a boolean value.

**Syntax**

```javascript
object instanceof constructor
```

**Desc**

the `instanceof` operator tests the presence of `constructor.prototype` in `objdct`'s prototype chain.

> Note that the value of an `instanceof` test can change based on changes to the `prototype` property of constructors.
>
> It can also be changed by changing an object's prototype using `Object.setPrototypeOf`.  
>
> It is also possible using the non-standard `__proto__` property.

```javascript
function Fn() {};
function Fn2() {};

let a = new Fn();
let b = new Fn();

a instanceof Fn;
Object.setPrototypeOf(a, Fn2);
a instanceof Fn; //false
```



**`instanceof` and mulptiple context(e.g. frames or windows)**





**Examples**

<u>Using instanceof with String</u>

```javascript
let literalString = 'This is a literal string';
let stringObject = new String('String created with constructor');

literalString instanceof String; //false
stringObject instanceof String; //true

literalString instanceof Object; //false
stringObject instanceof Object; //true

stringObject instanceof Date; //false
```

<u>Using instanceof with Date</u>

```javascript
let myDate = new Date();

myDate instanceof Date; //true
myDate instanceof Object; //true
myDate instanceof String; //false
```

<u>Object created using Object.create()</u>

```javascript
function Shape() {}
function Rectangle() {
  Shape.call(this);
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

let rect = new Rectangle();

rect instanceof Object; //true
rect instanceof Shape; //true
rect instanceof Rectangle; //true
rcct instanceof String; //false

let literalObject = {};
let nullObject = Object.create(null);
nullObject.name = 'My object';

literalObject instanceof Object; //true
({}) instanceof Object; //true
nullObject instanceof Object; //false  prototype is end of prototype chain(null)
```



**重写instanceof** //0306

```javascript
//https://juejin.cn/post/7033275515880341512#:~:text=%F0%9F%A6%89%20%E5%85%B6%E4%BB%96-,Instanceof,-%E8%80%83%E5%AF%9F%E9%A2%91%E7%8E%87%3A%20(%E2%AD%90%E2%AD%90%E2%AD%90%E2%AD%90)


function instance_of(Case, Constructor) {
  //基本数据类型返回false
  //兼容一下函数对象
  if (typeof(Case) !== 'object' && typeof(Case) !== 'function' || Case === 'null') {
    return false;
  }
  let CaseProto = Object.getPrototypeOf(Case);
  while(true) {
    if (CaseProto == null) return false;
    //找到相同的原型
    if (CaseProto === Constructor.prototype) return true;
    CaseProto = Object.getPrototypeOf(CaseProto);
  }
}
```



```javascript
function instanceOf(proto, Ctor) {
  
  while(proto !== null) {
    if (proto !== Ctor.prototype) {
      proto = Object.getPrototypeOf(proto);
    } else {
      return true;
    }
  }
  return false;
}
```



### 实例

#### 使用instanceof判断对象类型弊端
用其判断对象类型确实可以解决 `null` 的问题，但它也有一些局限性和弊端：
**跨 iframe 或不同 JavaScript 运行环境的问题**：  
`instanceof` 检查的是对象的原型链，这在同一个 JavaScript 运行环境中是有效的。但是，如果你在不同的 iframe 或者不同的 JavaScript 运行环境中使用 `instanceof`，由于每个 iframe 有自己独立的全局对象，`instanceof` 可能会失效。例如：
```js
let iframe = document.createElement('iframe');
document.body.appendChild(iframe);
let iframeObject = iframe.contentWindow.Object;

let obj = new iframeObject();
console.log(obj instanceof Object); // false

```

**无法区分子类对象**：  
`instanceof` 只能判断对象是否是某个构造函数的实例，但无法区分对象的具体类型。例如：
在这种情况下，`dog` 实例既是 `Animal` 的实例，也是 `Dog` 的实例，`instanceof` 无法区分具体的子类对象。
```js
class Animal {}
class Dog extends Animal {}

let dog = new Dog();
console.log(dog instanceof Animal); // true
console.log(dog instanceof Dog); // true

```

**对象的原型被改变时**
如果对象的原型被动态改变，`instanceof` 的判断结果会受到影响。例如：
```js
function MyObject() {}
let obj = new MyObject();

console.log(obj instanceof MyObject); // true

Object.setPrototypeOf(obj, Object.prototype);
console.log(obj instanceof MyObject); // false

```


**无法检测内置对象的具体类型*

对于一些内置对象（如 `Array`、`Function`、`Date` 等），`instanceof` 可以工作，但它无法区分用户定义的对象和内置对象的具体类型。
```js
let arr = [];
console.log(arr instanceof Array); // true
console.log(arr instanceof Object); // true

```

























---











---


# 运算符优先级

# 运算符优先级

> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence


## 是什么
运算符的优先级决定了表达式中运算执行的先后顺序。优先级高的运算符会作为优先级低的运算符的操作数。

## 优先级和结合性
OP1 和 OP2 都是操作符的占位符
```js
a OP1 b OP2 c
```

* 左结合（左到右）相当于把左边的子表达式加上小括号 (a OP b) OP c
* 右结合（右到左）相当于 a OP (b OP c)
* 赋值运算符,幂运算符是右结合的,其它算术运算符都是左结合
* <span style="color:blue">无论结合性和优先级如何,求值顺序总是从左到右.</span>
* <span style="color:blue">当有多个具有相同优先级的运算符时，结合性的差异就会发挥作用。仅使用一个或多个不同优先级的运算符时，结合性不会影响输出</span>
* 判断执行顺序的时候，优先级在结合性之前。例如,混合求除法和幂时，求幂会先于除法



## 结合性

### 右结合
除了以下两种运算符,其它算术运算符都是左结合.
* 赋值运算符
* 幂运算符

#### 赋值运算符
```js
a = b = 5; // 相当于 a = (b = 5)
```

* 首先 b 被赋值为 5
* 然后 a 也被赋值为 b = 5 的返回值，也就是 5。

#### 幂运算符

```js
function echo(name, num) {
    console.log("Evaluating the " + name + " side");
    return num;
}
// 注意这里的除法运算符 (/)
console.log(echo("left", 6) / echo("right", 2));


// Evaluating the left side
// Evaluating the right side
// 3
```


### 实例

### 多个相同优先级的运算符下的结合性

```js
function echo(name, num) {
    console.log("Evaluating the " + name + " side");
    return num;
}
// 注意这里的除法运算符 (/)
console.log(echo("left", 6) / echo("middle", 2) / echo("right", 3));


Evaluating the left side
Evaluating the middle side
Evaluating the right side
1
```

```js
function echo(name, num) {
    console.log("Evaluating the " + name + " side");
    return num;
}
// 注意这里的幂运算符 (**)
console.log(echo("left", 2) ** echo("middle", 3) ** echo("right", 2));


Evaluating the left side
Evaluating the middle side
Evaluating the right side
512
```


```js
function echo(name, num) {
    console.log("Evaluating the " + name + " side");
    return num;
}
// 注意这里左边和中间的被圆括号包围的求幂表达式
console.log((echo("left", 2) ** echo("middle", 3)) ** echo("right", 2));


Evaluating the left side
Evaluating the middle side
Evaluating the right side
64
```



## 优先级

### 运算符优先级表


#### 示例
1.对象地址变更的优先级
>https://www.cnblogs.com/chenyi4/p/11381371.html
```js
// 问题

var a = {n: 1};
var b = a;
a.x = a = {n: 2};
 
console.log(a.x);
console.log(b.x);

```

```js
// 解答

a.x = a = {n:2} //可以写成 a.x = (a = {n:2})

// 1.赋值运算符从右结合(相当于给右侧的表达式加上小括号,提升了优先级)
// 2.分组(括号)运算符的优先级大于成员访问的运算符
// 3.无论结合性和优先级问题,求值顺序总是从左到右.所以先计算a.x再计算(a={n:2})
// 4.(a={n:2})的返回值是{n:2}, 所以a.x={n:2},此时a依然指向堆中{n:1}的地址,所以b.x为{n:2}
// 5.a={n:2}, 变量a被指向了堆中新的地址.所以, a.x为undefined, b.x为{n:2}
```



### 分组和短路

在优先级表格中,分组（Grouping） 具有最高优先级。然而，这并不意味着总是优先对分组符号 ( … ) 内的表达式进行求值，尤其是涉及短路时。

短路是条件求值的术语:
* 逻辑或运算符（“OR”）
* 逻辑与（“AND”）
* 空值合并
* 可选链
* 条件（三元）运算符

#### 示例

```js
a || b * c; // 首先对 `a` 求值，如果 `a` 为真值则直接返回 `a`
a && b < c; // 首先对 `a` 求值，如果 `a` 为虚值则直接返回 `a`
a ?? (b || c); // 首先对 `a` 求值，如果 `a` 不是 `null` 或 `undefined` 则直接返回 `a`
a?.b.c; // 首先对 `a` 求值，如果 `a` 是 `null` 或 `undefined` 则直接返回 `undefined`


3 > 2 && 2 > 1;
// 返回 true

3 > 2 > 1;
// 返回 false，因为 3 > 2 是 true，然后 true 会在比较运算符中
// 被隐式转换为 1，因此 true > 1 会变为 1 > 1，结果是 false
// 加括号可以更清楚：(3 > 2) > 1
```


# Expressions



## 关于this !!!!

> https://github.com/mqyqingfeng/Blog/issues/7

### 1.前言

当JavaScript代码执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

对于每个执行上下文，都有三个重要属性:

* 变量对象(Variable Object, VO)
* 作用域链(Scope chain)
* this

因为我们要从 ECMASciript5 规范开始讲起。

先奉上 ECMAScript 5.1 规范地址：

英文版：http://es5.github.io/#x15.1

中文版：http://yanhaijing.com/es5/#115



### 2. Types

首先是第8章的types

> Types are further subclassified into ECMAScript language types and specification types.
>
> An ECMAScript language type <u>corresponds to</u>(对应的) values that are directly manipulated by an ECMAScript programmer using the ECMAScript language. The ECMAScript language types are Undefined, Null, Boolean, String, Number, and Object.
>
> A specification type corresponds to meta-values that are used within algorithms to describe the semantics of ECMAScript language constructs and ECMAScript language types. The specification types are Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, and Environment Record.

我们简单的翻译一下：

ECMAScript 的类型分为语言类型和规范类型。

ECMAScript 语言类型是开发者直接使用 ECMAScript 可以操作的。其实就是我们常说的Undefined, Null, Boolean, String, Number, 和 Object。

而规范类型相当于 meta-values，是用来用算法描述 ECMAScript 语言结构和 ECMAScript 语言类型的。规范类型包括：Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, 和 Environment Record。

没懂？没关系，我们只要知道在 ECMAScript 规范中还有一种只存在于规范中的类型，它们的作用是用来描述语言底层行为逻辑。

今天我们要讲的重点是便是其中的 Reference 类型。它与 this 的指向有着密切的关联。

### Reference

#### 含义

8.7章 The Reference Specification Type:

> The Reference type is used to explain the behaviour of such operators as delete ,typeof, and the assignment operators.

所以 Reference 类型就是用来解释诸如 delete、typeof 以及赋值等操作行为的。

来自youyuxi的解释:

> 这里的 Reference 是一个 Specification Type，也就是 “只存在于规范里的抽象类型”。它们是为了更好地描述语言的底层行为逻辑才存在的，但并不存在于实际的 js 代码中。

#### 组成部分

> A Reference is a resolved name binding.
>
> A Reference consists of three components, the base value, the referenced name and the Boolean valued strict reference flag.
>
> The base value is either undefined, an Object, a Boolean, a String, a Number, or an environment record (10.2.1).
>
> A base value of undefined indicates that the reference could not be resolved to a binding. The referenced name is a String.

从上面的话可以看出,Reference主要包括3个部分:

* base value
* referenced name
* strict reference 

base value 就是属性所在的对象或者就是 EnvironmentRecord，它的值只可能是 undefined, an Object, a Boolean, a String, a Number, or an environment record 其中的一种。

referenced name 就是属性的名称.

举个例子:

```javascript
var foo = 1;
//对应的Reference是
var fooReference = {
  base: EnviromentRecord,
  name: 'foo',
  strict: false
}
```



```javascript
var foo = {
  bar: function() {
    return this;
  }
};

foo.bar();

//bar对应的Reference是
var BarReference = {
  base: foo,
  propertyName: 'bar',
  strict: false
}
```

而且规范中还提供了获取 Reference 组成部分的方法，比如 GetBase 和 IsPropertyReference。

1.GetBase

> GetBase(V). Returns the base value component of the reference V.

返回 reference 的 base value

2.IsPropertyReference

> IsPropertyReference(V). Returns true if either the base value is an object or HasPrimitiveBase(V) is true; otherwise returns false.

简单的理解：如果 base value 是一个对象，就返回true。



### GetValue

除此之外，紧接着在 8.7.1 章规范中就讲了一个用于从 Reference 类型获取对应值的方法： GetValue。

简单模拟 GetValue 的使用：

```javascript
var foo = 1;
var fooReference = {
  base: EnvironmentRecord,
  name: 'foo',
  strict: false
};
GetValue(fooReference); //1
```

GetValue 返回对象属性真正的值，但是要注意：

**调用 GetValue，返回的将是具体的值，而不再是一个 Reference**



### 如何确定this的值

看规范 11.2.3 Function Calls：

这里讲了当函数调用的时候，如何确定 this 的取值。

只看第一步、第六步、第七步：

> 1.Let *ref* be the result of evaluating MemberExpression.

> 6.If Type(*ref*) is Reference, then
>
> a. If IsPropertyReference(ref) is true, then
>
> ​	i. Let thisValue be GetBase(ref).
>
> b.Else, the base of ref is an Enviroment Record.
>
> ​	i.Let thisValue be the result of calling the ImplicitThisValue concreate method of GetBase(ref)
>
> 7.Else, Typeof(ref) is not Reference.
>
> a. Let thisValue be undefined.

让我们描述一下:

1.计算MemberExpression的结果赋值非ref

2.判断ref是不是一个Reference类型

 2.1 如果ref是Reference,并且IsPropertyReference(ref)是true, 那么this的值为GetBase(ref)

 2.2 如果ref是Reference,并且base value值是Environment Record,那么this 的值为ImplicitThisValue(ref)

3.ref不是一个Reference类型

 3.1 this的值是undefined.



### 具体分析

一步步看:

**1.计算MemberExpression的结果赋值给ref**

什么是MemberExpression? 看规范 11.2 Left-Hand-Side Expressions

- PrimaryExpression // 原始表达式 可以参见《JavaScript权威指南第四章》
- FunctionExpression // 函数定义表达式
- MemberExpression [ Expression ] // 属性访问表达式
- MemberExpression . IdentifierName // 属性访问表达式
- new MemberExpression Arguments // 对象创建表达式

举个例子:

```javascript
function foo() {
  console.log(this);
}

foo(); //MemberExpression是foo

function foo() {
  return function() {
    console.log(this);
  }
}
foo()(); //MemberExpression是foo()

var foo = {
  bar: function() {
    return this;
  }
}
foo.bar(); //MemberExpression是foo.bar
```

所以简单理解 MemberExpression 其实就是()左边的部分。



**2.判断ref是不是一个Reference类型**

关键就在于看规范是如何处理各种 MemberExpression，返回的结果是不是一个Reference类型

举个例子:

```javascript
var value = 1;
var foo = {
  value: 2,
  bar: function() {
    return this.value;
  }
};

//示例1
console.log(foo.bar());

//示例2
console.log((foo.bar)())

//示例3
console.log((foo.bar = foo.bar)());

//示例4
console.log((false||foo.bar)())

//示例5
console.log((foo.bar, foo.bar)())
```

#### foo.bar()

查看规范 11.2.1 Property Accessors，这里展示了一个计算的过程，什么都不管了，就看最后一步：

> Return a value of type Reference whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.

我们得知该表达式返回了一个 Reference 类型！

根据之前的内容，我们知道该值为：

```javascript
var Reference = {
  base: foo,
  name: 'bar',
  strict: false
}
```

接下来按照2.1的判断流程走:

> 2.1 如果ref是Reference, 并且IsPropertyReference(ref)是true,那么this的值为GetBase(ref)

该值是Reference类型,那么IsPropertyReference(ref)的结果是多少呢?

前面我们已经铺垫了 IsPropertyReference 方法，如果 base value 是一个对象，结果返回 true。

base value 为 foo，是一个对象，所以 IsPropertyReference(ref) 结果为 true。 

这个时候我们可以确定this 的值了

```javascript
this = GetBase(ref);
```

GetBase 也已经铺垫了，获得 base value 值，这个例子中就是foo，所以 this 的值就是 foo ，示例1的结果就是 2.

#### (foo.bar)()

示例2:

```javascript
console.log((foo.bar)());
```

foo.bar被()包住,查看规范11.1.6 The Grouping Operator

直接看结果部分:

> The production *PrimaryExpression: **(Expression)*** is evaluated as follows:

> Return the result of evaluating Expression. This may be of type Reference.
>
> Note This algorithm(运算法则) does not apply GetValue to the result of evaluating Expression.

实际上()并没有对MemberExpression进行计算,所以其实跟示例1的结果是一样的.



#### (foo.bar = foo.bar)()

示例3,有赋值操作运算符,查看规范11.13.1 Simple Assignment(=):

计算的第三步:

> 3. Let rval be GetValue(rref)

因为使用了GetValue,所以返回的值不是Reference类型

按照之前讲的判断逻辑

> 如果 ref 不是Reference，那么 this 的值为 undefined

this为undefined,非严格模式下,this的值为 undefined 的时候，其值会被隐式转换为全局对象。



#### (false || foo.bar)()

示例4，逻辑与算法，查看规范 11.11 Binary Logical Operators：

计算的第二步:

> 2.Let lval be GetValue(lref)

因为使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined



#### (foo.bar, foo.bar)()

示例5，逗号操作符，查看规范11.14 Comma Operator ( , )

计算的第二步:

> 2.Call GetValue(lref).

因为使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined



#### 揭晓结果

最后一个例子的结果是

```javascript
var value = 1;

var foo = {
  value: 2,
  bar: function() {
    return this.value;
  }
};

//示例1
foo.bar(); //2

//示例2
console.log((foo.bar)()); //2

//示例3
console.log((foo.bar = foo.bar)()); //1

//示例4
console.log((false || foo.bar)()); //1

//示例5
console.log((foo.bar, foo.bar)()); //1
```

注意：以上是在非严格模式下的结果，严格模式下因为 this 返回 undefined，所以示例 3 会报错。(接下去的不会执行了)



### 补充

还有一个最普通的情况

```javascript
function foo() {
  console.log(this);
}
foo();
```

MemberExpression是foo,解析标识符,查看规范 10.3.1 Identifier Resolution，会返回一个 Reference 类型的值：

```javascript
var fooReference = {
  base: EnvironmentRecord,
  name: 'foo',
  strict: false
}
```





### new介绍

> the `new` operator lets developers create an instance of a user-defined object type or one of the built-in object types that has a constructor function.



#### Syntax

> new constructor [ ([arguments])]

#### Parameters

`constructor`

A class or function that specifies the type of the object instance

`arguments`

A list of values that the `constructor` will be called with

#### Desc

**the `new` keyword does the following things:**

1.create <span style="color:blue">a blank, plain JavaScript object</span>

2.Adds a property to the new object(`__proto`__) that links to the constructor function's prototype object.

3.Binds the newly created object instance as the `this` context(i.e. all references to `this` in the constructor function now refer to the object created in the first step)

4.Returns `this` if the function doesn't return an object



**when the code `new Foo(...)` is executed, the following things happen:**

1.A new object is created, inherited from `Foo.prototype`

2.the constructor function `Foo` is called with the specified arguments, and with `this` bound to the newly created object. `new Foo` is equivalent to `new Foo()`. i.e. if no argument list is specified, `Foo` is called without arguments.

3.the object(not null, false, 3.1415 or other primitive types) returned by the constructor function becomes the result of the whole `new` expression. If the constructor function doesn't explicitly return an object, the object created in step 1 is used instead (normally constructors don't return a value, but they can choose to do s<u>o if they want to override the normal object createion process</u>) 没太明白,中文版翻译可以理解


