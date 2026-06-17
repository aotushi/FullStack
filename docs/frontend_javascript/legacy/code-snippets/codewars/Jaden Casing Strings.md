### introductions

> Jaden Smith, the son of Will Smith, is the star of films such as The Karate Kid (2010) and After Earth (2013). Jaden is also known for [some of his philosophy that he delivers via Twitter](https://twitter.com/jaden). When writing on Twitter, he is known for almost always capitalizing every word. For simplicity, you'll have to capitalize each word, check out how contractions are expected to be in the example below.
>
> Your task is to convert strings to how they would be written by Jaden Smith. The strings are actual quotes from Jaden Smith, but they are not capitalized in the same way he originally typed them.



### Example

> ```
> Not Jaden-Cased: "How can mirrors be real if our eyes aren't real"
> Jaden-Cased:     "How Can Mirrors Be Real If Our Eyes Aren't Real"
> ```





### Solution

 ```js
 String.prototype.toJanDenCase = function () {
   return this.split(' ').map(item => item[0].toUpperCase().concat(item.slice(1,item.length))).join(' ');
   //或  this.split(' ').map(item => item[0].toLocaleUpperCase() + item.slice(1)).join(' ');
 }
 
 这个地方还是使用charAt(0)获取首字符比较合理，唯一的问题的charAt()不支持BMP字符，需要函数写法兼容
 ```



```js
//recommend

String.prototype.toJanDenCase = function () {
  return this.split(' ').map(function(item) {
    return item.charAt(0).toUpperCase+item.slice(1);
  }).join(' ')
}
```

