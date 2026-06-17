---
title: Consecutive element subarrays
tags: array
author: chalarangelo
cover: camera-zoom
firstSeen: 2020-05-13T13:25:33+03:00
lastUpdated: 2020-10-18T20:24:28+03:00
---

创建多元连续元素的数组

例子:

```js
aperture(2, [1, 2, 3, 4]); //[[1,2],[2,3],[3,4]]
aperture(3, [1, 2, 3, 4]); // [[1, 2, 3], [2, 3, 4]]
aperture(5, [1, 2, 3, 4]); // []
```

```js
const aperture = (n, arr) =>
	arr.reduce((acc, crt, idx) => {
		if (idx + n <= arr.length) {
			acc.push(arr.slice(idx, idx + n));
		}
		return acc;
	}, []);
```

```md
延伸下, 创建多个不连续元素的数组
aperture2(2, [1,2,3,4]) //[[1,2], [3,4]]
```

```js
let arr = [1, 2, 3, 4, 5, 6],
	arr2 = [],
	n = 2;

arr.reduce((acc, crt, idx) => (idx % n == 0 ? acc.push(arr.slice(idx, idx + n)) && acc : acc), []);

arr.reduce((acc, crt, idx) => (idx % n === 0 ? acc.concat(arr.slice(i, i + n)) : acc), []);

//for循环实现

for (let i = 0; i < arr.length; i += 2) {
	if (i + n < arr.length) {
		arr2.push(arr.slice(i, i + n));
	} else {
		break;
	}
}
```

原答案

```js
const aperture = (n, arr) => (n > arr.length ? [] : arr.slice(n - 1).map((v, i) => arr.slice(i, i + n)));
```

为什么能够使用'arr.slice(n - 1)'?
