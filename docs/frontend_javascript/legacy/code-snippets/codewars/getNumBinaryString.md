### Introduction

> 获取输入数字的二进制字符串形式. 不是codewars中的题目



### Solution

```javascript

function getBinary(num, str = '') {
  if (num <= 1) {
    str += num === 0 ? '0' : '1';
    return str.split('').reverse().join('');
  } else {
    if (num % 2 === 0) {
      //偶数
      str += '0';
      return getBinary((num / 2), str);
    } else {
      //奇数
      str += '1';
      return getBinary(~~(num / 2), str);
    }
  }
}
```

