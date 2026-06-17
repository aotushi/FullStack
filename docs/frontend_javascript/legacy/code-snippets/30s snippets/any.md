---
title: Test if any array element is truthy
tags: array
cover: basket-paper
firstSeen: 2018-02-14T11:46:15+02:00
lastUpdated: 2020-10-18T20:24:28+03:00
---

检查提供的预言函数是否为集合中至少一个元素返回'true'

```js
const any = (arr, fn = Boolean) => arr.some(fn);
```
