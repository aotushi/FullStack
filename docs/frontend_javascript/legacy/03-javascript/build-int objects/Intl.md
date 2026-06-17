
## 方法
### Intl.Collator
#### 概述
> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator

Intl.Collator 对象支持区分语言的字符串比较。此方法可以看成是`String.prototype.localeCompare()`方法更全新的版本

#### 语法
> new Intl.Collator([locales[, options]])

a
#### 示例
##### 使用Collator
```js
console.log(new Intl.Collator().compare("a", "c")); // -1, or some other negative value
console.log(new Intl.Collator().compare("c", "a")); // 1, or some other positive value
console.log(new Intl.Collator().compare("a", "a")); // 0

```

不同浏览器的返回结果存在差异,因为这些值是特定实现的. 规范只要求 before 和 after 值为负值和正值。(顺序返回负值, 倒序返回正值)

##### 使用本地化
这个应该用的不多,看下例子即可.
```js
// in German, ä sorts with a
console.log(new Intl.Collator("de").compare("ä", "z"));
// -1, or some other negative value

// in Swedish, ä sorts after z
console.log(new Intl.Collator("sv").compare("ä", "z"));
// 1, or some other positive value
```

##### 传参



##### 实例
options有个可选参数是`numeric`，布尔属性，是否按照数值进行比较，默认是`false`.

数值字符串排序

```js
['15', '2', '100'].sort();    
// 结果是：["100", "15", "2"]  不是我们想要的结果


['15', '2', '100'].sort(new Intl.Collator(undefined, { numeric: true }).compare);
// 结果是：["2", "15", "100"]

```

汉字拼音排序
```js
var arrUsername = ["陈坤", "邓超", "杜淳", "冯绍峰", "韩庚", "胡歌", "黄晓明", "贾乃亮", "李晨", "李易峰", "鹿晗", "井柏然", "刘烨", "陆毅", "孙红雷"];

arrUsername.sort(new Intl.Collator('zh').compare);
// 结果是：["陈坤", "邓超", "杜淳", "冯绍峰", "韩庚", "胡歌", "黄晓明", "贾乃亮", "井柏然", "李晨", "李易峰", "刘烨", "陆毅", "鹿晗", "孙红雷"]
```