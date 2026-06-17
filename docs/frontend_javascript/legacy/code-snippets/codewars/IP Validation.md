### Introduction

> Write an algorithm that will identify valid IPv4 addresses in dot-decimal format. IPs should be considered valid if they consist of four octets, with values between `0` and `255`, inclusive.

#### Valid inputs examples:

```javascript
1.2.3.4
123.45.67.89
```

#### Invalid input examples

```javascript
1.2.3
1.2.3.4.5
123.456.78.90
123.045.067.089
```



### Solution

```javascript
//my
function isValidIP(str) {
  if (str.split('.').length !== 4) {
    return false;
  } else {
    return str.split('.').every(item => {
      return +item >= 0 && +item <= 255 && item.length === String(+item).length;
    })
  }
}

isValidIP('01.02.03.04')
isValidIP('1e0.1e1.1e2.2e2')
isValidIP('1.2.3.4\n')
isValidIP('\n1.2.3.4')
isValidIP('1.2.3.4 ')
isValidIP('1.2.3. -7')
isValidIP('abc.def.ghi.jkl')
```



```javascript
//recommend


function isValidIP(str) {
  return /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|$)){4}$/.test(str);
}


const net = require('net');
const isValidIP = (s) => net.isIP(s);




```

