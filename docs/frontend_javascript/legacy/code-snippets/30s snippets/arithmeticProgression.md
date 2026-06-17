---
title: Arithmetic progression
tags: math,algorithm
cover: u-got-this
firstSeen: 2020-10-04T11:37:07+03:00
lastUpdated: 2021-10-13T19:29:39+02:00
---

创建在数学运算过程中数字的数组, 从给定的正整数开始,直到指定的限制.

例子:

```js
arithmeticProgression(5, 25); //[5,10,15,20,25]
```

```js
const arithmeticProgression = (int, limit) => Array.from({ length: int }).map((item, idx) => (idx + 1) * int);
```

进化版
一个是下划线,另一个是 Math.ceil 的使用

```js
const arithmeticProgression = (n, lim) =>
  Array.from({length: Math.ceil(lim/n)}).map(_, i) => (i+1)*n
```
