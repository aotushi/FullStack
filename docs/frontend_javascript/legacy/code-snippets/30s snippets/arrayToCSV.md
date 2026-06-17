---
title: Array to CSV
tags: array,string
cover: sunrise-over-city
firstSeen: 2018-06-27T20:26:43+03:00
lastUpdated: 2020-11-03T21:55:08+02:00
---

converts a 2D array to a comma-separated values string

example:

```js
arrayToCSV([
	["a", "b"],
	["c", "d"],
]); // '"a","b"\n"c","d"'
arrayToCSV(
	[
		["a", "b"],
		["c", "d"],
	],
	";"
); // '"a";"b"\n"c";"d"'
arrayToCSV([
	["a", '"b" great'],
	["c", 3.1415],
]);
// '"a","""b"" great"\n"c",3.1415'
```

```js
const arrToCSV = (arr, delimiter = ",") =>
	arr
		.map((item) =>
			item.map((item2) => (
				isNaN(item2) ? `"${item2.replace(/"/g, '""')}"` : item2;
      )).join(delimiter)
		)
		.join("\n");
```

```js
const arrToCSV2 = (arr, delimiter=',') => arr.reduce((acc,crt,idx) => {
  crt.forEach(v => isNaN(v) ? `"${v.replace("/g, '""')}"` : v)
}, [])
```
