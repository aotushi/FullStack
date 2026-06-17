### Introduction

> Define a function that takes one integer argument and returns logical value `true` or `false` depending on if the integer is a prime.
>
> Per Wikipedia, a prime number (or a prime) is a natural number greater than 1 that has no positive divisors other than 1 and itself.
>
> #### Requirements
>
> - You can assume you will be given an integer input.
> - You can not assume that the integer will be only positive. You may be given negative numbers as well (or `0`).
> -  **NOTE on performance**: There are no fancy optimizations required, but still *the* most trivial solutions might time out. Numbers go up to 2^31 (or similar, depends on language version). Looping all the way up to `n`, or `n/2`, will be too slow.



### Example

```javascript
is_prime(1)  /* false */
is_prime(2)  /* true  */
is_prime(-1) /* false */
```





### Solution

```javascript
//my
primie 质数(素数) 大于1的,只能被自身和1整除的自然数
trivial 琐碎的
Per WiKi 根据维基百科
fancy 花哨的  fancy optimizations 花哨的优化
position divisor 正除数

function isPrime(num) {
  if (num <= 1) return false;
  let sum = 0;
  for (let i=2; i<=~~(num/2); i++) {
    if (num % i === 0) {
      sum += 1;
      break;
    }
  }
  
  if (sum === 0) {
    return true;
  } else {
    return false;
  }
}


function isPrime(num) {
  if (num <= 1) return false;
  let flag = true;
  for (let i=2; i<=num/2; i++) {
    if (num % i === 0) {
      flag = false;
      break;
    }
  }
  
  if (flag) {
    return true;
  } else {
    return false;
  }
}
STDERR: Execution Timed Out 12000ms
Why did my code time out?
Our servers are configured to only allow a certain amount of time for your code to execute. In rare cases the server may be taking on too much work and simply wasn't able to run your code efficiently enough. Most of the time though this issue is caused by inefficient algorithms. If you see this error multiple times you should try to optimize your code further.


function isPrime(num) {
  if (num <= 1) return false;
  if (num === 2 || num === 3) return true;
  for (let i=2; i<= ~~Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}


```



```javascript
//recommend

function isPrime(num) {
  for (let i=2; i<=Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return num > 1;
}


const isPrime = num => {
  for (let i=2; i<= num ** .5; i++) {
    if (!(num % i)) return false;
  }
  return num > 1;
}


const isPrime = num => {
  let i = 1;
  while (i++ < num - 1) {
    if (num % i === 0) {
      return false;
    }
  }
  
  return num > 1;
}
```

