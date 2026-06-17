---
title: Approximately number equality
tags: math
cover: engine
firstSeen: 2018-02-14T12:47:13+02:00
lastUpdated: 2020-11-01T20:50:57+02:00
---

检查两个数字是否大约相等

案例

```js
approximatelyEqual(Math.PI / 2.0, 1.5708); //true
```

```js
const approximatelyEqual = (n1, n2, epsilon = 0.001) => Math.abs(n1 - n2) < epsilon;
```
