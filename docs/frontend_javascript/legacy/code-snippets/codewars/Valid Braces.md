### Introduction

> Write a function that takes a string of braces, and determines if the order of the braces is valid. It should return `true` if the string is valid, and `false` if it's invalid.
>
> This Kata is similar to the [Valid Parentheses](https://www.codewars.com/kata/valid-parentheses) Kata, but introduces new characters: brackets `[]`, and curly braces `{}`. Thanks to `@arnedag` for the idea!
>
> All input strings will be nonempty, and will only consist of parentheses, brackets and curly braces: `()[]{}`.
>
> #### What is considered Valid?
>
> A string of braces is considered valid if all braces are matched with the correct brace.



### Example

```javascript
"(){}[]"   =>  True
"([{}])"   =>  True
"(}"       =>  False
"[(])"     =>  False
"[({})](]" =>  False
```





### Solution

```javascript
//my
//判断条件: 任何两个相同的元素之间的元素个数为偶数(0,2,4)

function judgeBraces(str) {
  if (str.length % 2 !== 0) return false;
  
  let result = str.split('').map(item => {
    switch(item) {
      case '(':
      case ')':
        item = 1;
        break;
      case '[':
      case ']':
        item = 2;
        break;
      case '{':
      case '}':
        item = 3;
        break;
      default:
        console.log('aaa');
        break;
    }
  });
  
	for (let i=0; i<result.length; i++) {
    
    let firstIndex = i,
        lastIndex = result.findIndex((ele, index) => ele === result[firstIndex] && index > firstIndex);
    
    if ((lastIndex - firstIndex - 1) % 2 === 0 && (result[lastIndex - 1] - result[firstIndex + 1] === 0)) {
      return true;
    } else {
      return false;
    }
  }
  
}


```



```javascript
//recommend

```

