### introductions

> Complete the solution so that it splits the string into pairs of two characters. If the string contains an odd number of characters then it should replace the missing second character of the final pair with an underscore ('_').



### Examples:

```javascript
solution('abc') // should return ['ab', 'c_']
solution('abcdef') // should return ['ab', 'cd', 'ef']
```



### Solution

```js
//my
function solution(str) {
  let arr = [];
  if(str.length === 0) {
    return arr;
  } else if (str.length === 1) {
    return arr.push(str+'_');
  } else if (str.length%2 === 0) {
    for (let i=0; i<str.length; i+=2) {
      arr.push(str.slice(i, i+2===str.length?str.length+1:i+2));
    }
  } else if (str.length%2 !== 0) {
    for (let i=0; i<str.length-1; i+=2) {
      arr.push(str.slice(i, i+2));
    }
    arr.push(str[str.length-1]+'_');
  }
  return arr;
}


//2021.11.17 不得不说推荐的方法还是非常简单的 字符串可以使用中括号来取得相应索引的元素
function solution(str) {
  if (str.length %2 !== 0) {
    str += '_';
  }
  let arr = [];
  str.split('').forEach((_, index) => {
    if ((index + 1) % 2 === 0) {
      arr.push(str.split('')[index - 1] + str.split('')[index])
    }
  });
  
  return arr;
}


function solution(str) {
  if (str.length % 2 !== 0) {
    str += '_';
  }
  let arr = [];
  
  for (let i=0; i<=str.length/2; i+=2) {
    arr.push(str.slice(i, i+2));
  }
  
  return arr;
}
```



```js
//recommended

function solution(str) {
  let i = 0;
  let arr = new Array();
  if (str.length % 2 !== 0) {
    str = str + '_';
  }
  
  while (i<str.length) {
    result.push(str[i] + str[i+1]);
    i+=2;
  }
  return result;
}
```



### full test suite

```js
You have passed all of the tests! :)
```

