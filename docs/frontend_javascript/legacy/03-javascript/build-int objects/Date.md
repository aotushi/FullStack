---
alias: date
---


创建一个 JavaScript `Date` 实例，该实例呈现时间中的某个时刻。`Date` 对象则基于 [Unix Time Stamp](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_16)，即自1970年1月1日（UTC）起经过的毫秒数。



#### 基本形式

```javascript
new Date()
new Date(value)
new Date(dateString);
new Date(year, monthIndex[, day[, hours[, minutes[, seconds[, milliseconds]]]]]);
```

创建一个新`Date`对象的唯一方法是通过[`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 操作符，例如：`let now = new Date();`若将它作为常规函数调用（即不加 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 操作符），将返回一个字符串，而非 `Date` 对象

`Date()` 构造函数有**四种基本形式**

* 没有参数 新创建的Date对象表示实例化时刻的日期和时间

* Unix时间戳
  * `value` 一个 Unix 时间戳（[Unix Time Stamp](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_16)），它是一个整数值，表示自1970年1月1日00:00:00 UTC（the Unix epoch）以来的毫秒数，忽略了闰秒。请注意大多数 Unix 时间戳功能仅精确到最接近的秒。
  
* 时间戳字符串
  * `dateString` 表示日期的字符串值。该字符串应该能被 [`Date.parse()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) 正确方法识别
  * 由于浏览器之间的差异与不一致性，强烈不推荐使用`Date`构造函数来解析日期字符串 (或使用与其等价的`Date.parse`)
  
* 分别提供日期与时间的每一个成员  

  > 当至少提供了年份与月份时，这一形式的 `Date() `返回的 `Date `对象中的每一个成员都来自下列参数。
  >
  > 没有提供的成员将使用最小可能值（对日期为`1`，其他为`0`）。

| 变量         | 可选 | 含义                                                         |
| ------------ | ---- | ------------------------------------------------------------ |
| year         | 否   | 表示年份的整数值。0 到 99 会被映射至 1900 年至 1999 年，其它值代表实际年份 |
| monthIndex   | 否   | 表示月份的整数值，从 0（1 月）到 11（12 月）。               |
| date         | 是   | 表示一个月中的第几天的整数值，从1开始。默认值为1             |
| hours        | 是   | 表示一天中的小时数的整数值 (24小时制)。默认值为0（午夜）     |
| minutes      | 是   | 表示一个完整时间（如 01:10:00）中的分钟部分的整数值。默认值为0 |
| seconds      | 是   | 表示一个完整时间（如 01:10:00）中的秒部分的整数值。默认值为0 |
| milliseconds | 是   | 表示一个完整时间的毫秒部分的整数值。默认值为0                |



下面是几种形式:

<u>用整数初始化日期对象</u>

```js
new Date(2017, 06, 06).toLocalDateString() //"2017/06/06"
new Date(2017, 1, 1).toLocalDateString() //"2017/02/01"
new Date(2017, 1-2, 01).toLocalDateString() //"2016/12/1"
new Date(2017, 06, 06, 06, 06, 06).toLocalString() //"2017/7/6 上午6:06:06"
```



<u>字符串</u>

> 格式就是：年月日 具体时间，其中年月日之间使用`-`或者`/`连接，具体时间使用`:`连接；
>
> 年月日和具体时间的连接可以使用`空格`隔开或者`T`隔开。

```js
new Date("2017/06/06").toLocalDateString() // '2017/6/6'
new Date("2017-07-07").toLocalDateString() //'2017/7/7'
new Date('2017-7-7').toLocalDateString() //'2017/8/8'

var date = new Date("2022-09-28T18:06:49")
```



<u>时间戳</u>

```js
let timeStamp = new Date().getTime(); //1677278029738
new Date(timeStamp).toLocalString() // "2019/8/20 上午10:10:29"
new Date(timeStamp - 1 * 60 * 60 * 1000).toLocalString() //"2019/8/20 上午9:10:29"
```



<u>注意事项</u>

在IE浏览器中不支持横杠格式 `"2011-06-06"` ，需要转换为 `"2011/06/06"`

**解决方案：进行字符串替换**

```js
let timeStamp = '2011-06-06'
new Date(timeStamp.replace(/\-/g, '/')).toLocaleDateString() // "2011/6/6"
```



**Date.length**

`Date.length` 的值是 7。这是该构造函数可接受的参数个数


### 3.方法

#### **Date.now()**

返回自 1970-1-1 00:00:00  UTC（世界标准时间）至今所经过的毫秒数 <span style="color:blue;">数值格式</span>

#### **Date.parse()**

解析一个表示日期的字符串，并返回从 1970-1-1 00:00:00 所经过的毫秒数

**Date.UTC()**

接受和构造函数最长形式的参数相同的参数（从2到7），并返回从 1970-01-01 00:00:00 UTC 开始所经过的毫秒数。

#### **Date.prototype.getFullYear()**

**`getFullYear()`** 方法根据本地时间返回指定日期的年份



#### **Date.prototype.getMonth**()

根据

Date本地时间，返回一个指定的日期对象的月份，为基于0的值（0表示一年中的第一月）



**Date.prototype.getDate()**

根据本地时间，返回一个指定的日期对象为一个月中的哪一日（从1--31）

```javascript
new Date().getDate();
```



#### **Date.prototype.getDay()**

**`getDay()`** 方法根据本地时间，返回一个具体日期中一周的第几天，0 表示星期天

```javascript
new Date().getDay(); //
```



#### Date.prototype.toISOString()

**`toISOString()`** 方法返回一个 ISO（[ISO 8601 Extended Format](http://en.wikipedia.org/wiki/ISO_8601)）格式的字符串： **YYYY-MM-DDTHH:mm:ss.sssZ**。时区总是 UTC（协调世界时），加一个后缀“Z”标识。

语法

```javascript
dateObj.toISOString()
```

案例

```javascript
var today = new Date("05 October 2011 14:48 UTC");
alert(today.toISOString()); // 返回 2011-10-05T14:48:00.000Z
```



### 4.实例

#### 日期格式化

> JS重难点实例精讲 2.3.1

方法1实现的方式对时间格式有较强的限制，例如，yyyy表示的是年份，MM表示的是月份，dd表示的是天数等。在方法设计上只针对性地处理yyyy/MM/dd/HH/mm/ss等常用的时间格式。如匹配到yyyy字符串就返回时间的年份值，匹配到MM字符串就返回时间的月份值。

```js
/**
  * 方法1
  * @description 对Date的扩展，将 Date 转换为指定格式的String
  *  月(MM)、日(dd)、小时(HH)、分(mm)、秒(ss)固定用两个占位符
  *  年(yyyy)固定用4个占位符
  * @param fmt
  * @example    *   (new Date()).format("yyyy-MM-dd HH:mm:ss") // 2018-07-31 20:09:04
  *   (new Date()).format("yyyy-MM-dd") // 2018-07-31 20:08
  * @returns {*}
  */
Date.prototype.format = function (pattern) {
   function zeroize(num) {
      return num < 10 ? "0" + num : num;
   }
   var pattern = pattern;    // YYYY-MM-DD或YYYY-MM-DD HH:mm:ss
   var dateObj = {
       "y": this.getFullYear(),
       "M": zeroize(this.getMonth() + 1),
       "d": zeroize(this.getDate()),
       "H": zeroize(this.getHours()),
       "m": zeroize(this.getMinutes()),
       "s": zeroize(this.getSeconds())
   };
   return pattern.replace(/yyyy|MM|dd|HH|mm|ss/g, function (match) {
       switch (match) {
           case "yyyy" :
              return dateObj.y;
           case "MM" :
              return dateObj.M;
           case "dd" :
              return dateObj.d;
           case "HH" :
              return dateObj.H;
           case "mm" :
              return dateObj.m;
           case "ss" :
              return dateObj.s;
       }
   });
};

//代码测试
var d = new Date();

console.log(d.format('yyyy-MM-dd HH:mm:ss')); // 2017-11-26 15:50:00
console.log(d.format('yyyy-MM-dd')); // 2017-11-26
console.log(d.format('yyyy-MM-dd HH:mm')); // 2017-11-26 15:50
```



方法2 !!

方法2是对方法1的优化，两者都是通过正则表达式来实现想要的效果。只是方法1对时间格式字符串的要求比较严格，实际运用的场景比较少。方法2对时间格式字符串的要求相对宽松，只要能匹配到y、M、d、H、m、s等即可，并不要求出现的次数，最后的返回值会根据匹配到的字符次数进行动态展示。

在方法2的设计中，时间格式基本包括年、月、日、时、分、秒、毫秒，有时会包含季度。其中年用y表示，使用1～4个占位符；月用M表示，日用d表示，小时用H表示，分钟用m表示，秒用s表示，季度用q表示，可以使用1～2字符；毫秒用S表示，实际值为1～3位的数字，使用1个占位符。

```js
/**
  * 方法2
  * @description 对Date的扩展，将 Date 转换为指定格式的String
  *  月(M)、日(d)、小时(H)、分(m)、秒(s)、季度(q) 可以用 1~2 个占位符，
  *  年(y)可以用 1~4 个占位符，毫秒(S)只能用 1 个占位符(是 1~3 位的数字)
  * @param fmt
  * @example    * (new Date()).format("yyyy-MM-dd HH:mm:ss") // 2018-07-31 20:09:04
  * (new Date()).format("yyyy-M-d H:m")  // 2018-07-31 20:09
  * @returns {*}
  */
Date.prototype.format = function (fmt) {
   var o = {
       "M+": this.getMonth() + 1, //月份
       "d+": this.getDate(), //日
       "H+": this.getHours(), //小时
       "m+": this.getMinutes(), //分
       "s+": this.getSeconds(), //秒
       "q+": Math.ﬂoor((this.getMonth() + 3) / 3), //季度
       "S": this.getMilliseconds() //毫秒
   };
   if (/(y+)/.test(fmt))
   	fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - 
RegExp.$1.length));
   for (var k in o)
     if (new RegExp("(" + k + ")").test(fmt))
       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : 
                         (("00" + o[k]).substr(("" + o[k]).length)));
   return fmt;
};
```



3.基于成型的类库Moment.js

方法1和方法2都是基于原生的JavaScript实现。这里在方法3中推荐一款非常好用的时间处理工具库Moment.js，它是一款专门用于处理时间的库，支持多种不同的格式化类型。





#### 计算经过的时间

```javascript
// 使用 Date 对象
var start = Date.now();

// 调用一个消耗一定时间的方法：
doSomethingForALongTime();
var end = Date.now();
var elapsed = end - start; // 以毫秒计的运行时长


// 使用内建的创建方法
var start = new Date();

// 调用一个消耗一定时间的方法：
doSomethingForALongTime();
var end = new Date();
var elapsed = end.getTime() - start.getTime(); // 运行时间的毫秒值
```



#### 计算注册的天数

```js
var person = {
  level: '2',
  name: '小丽',
  registTime: '2021-11-01',
}
var h2 = document.querySelector('h2');
let dates = Math.floor((new Date() - new Date(person.registTime)) / (1000*60*60*24) )
h2.innerHTML = `尊贵的牛客网${person.level}级用户${person.name}您好，您已经注册牛客网${dates}天啦~`
```



```js
// 计算 某个日期是否是31天之后

let dateNow = new Date()
let date31Ago = new Date()

date31Ago = date31Ago.setDate(dateNow.getDate() - 30)
let date31AgoStrDate = new Date(date31Ago).toISOString().split('T')[0]

dayjs(timeNum).isAfter(date31AgoStrDate, 'day')
```



```js
//获取当前日期30天前的日期

let nowDate = new Date()
let date30Ago = new Date(nowDate - 60*60*24*30*1000)
```



#### Date混合使用

```JavaScript
- 显示当前年月日时间信息(使用模板字符串)

let d = new Date();
alert(`$(d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`);
```






### 5. 库

#### moment.js

> https://momentjs.com/



#### day.js(首选)

> https://dayjs.gitee.io/zh-CN/









#### 注意事项

* 当Date作为构造函数调用并传入多个参数时，如果数值大于合理范围时（如月份为 13 或者分钟数为 70），相邻的数值会被调整。比如 new Date(2013, 13, 1)等于new Date(2014, 1, 1)
* 当Date作为构造函数调用并传入多个参数时，所定义参数代表的是当地时间。如果需要使用世界协调时 UTC，使用 `new Date(Date.UTC(...))` 和相同参数



