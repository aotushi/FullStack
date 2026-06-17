# Desc

Alright, detective, one of our colleagues successfully observed our target person, Robby the robber. We followed him to a secret warehouse, where we assume to find all the stolen stuff. The door to this warehouse is secured by an electronic combination lock. Unfortunately our spy isn't sure about the PIN he saw, when Robby entered it.

The keypad has the following layout:

```bash
┌───┬───┬───┐
│ 1 │ 2 │ 3 │
├───┼───┼───┤
│ 4 │ 5 │ 6 │
├───┼───┼───┤
│ 7 │ 8 │ 9 │
└───┼───┼───┘
    │ 0 │
    └───┘
```

He noted the PIN `1357`, but he also said, it is possible that each of the digits he saw could actually be another adjacent digit (horizontally or vertically, but not diagonally). E.g. instead of the `1` it could also be the `2` or `4`. And instead of the `5` it could also be the `2`, `4`, `6` or `8`.

He also mentioned, he knows this kind of locks. You can enter an unlimited amount of wrong PINs, they never finally lock the system or sound the alarm. That's why we can try out all possible (*) variations.

\* possible in sense of: the observed PIN itself and all variations considering the adjacent digits

Can you help us to find all those variations? It would be nice to have a function, that returns an array (or a list in Java/Kotlin and C#) of all variations for an observed PIN with a length of 1 to 8 digits. We could name the function `getPINs` (`get_pins` in python, `GetPINs` in C#). But please note that all PINs, the observed one and also the results, must be strings, because of potentially leading '0's. We already prepared some test cases for you.

Detective, we are counting on you!



# result



```js
function getPINs(observed) {
	// TODO: This is your job, detective!
	let adjacentObj = {
		1: [1, 2, 4],
		2: [1, 2, 3, 5],
		3: [2, 3, 6],
		4: [1, 4, 5, 7],
		5: [2, 4, 5, 6, 8],
		6: [3, 5, 6, 9],
		7: [4, 7, 8],
		8: [5, 7, 8, 9, 0],
		9: [6, 8, 9],
		0: [0, 8],
	};

	let observedArr = observed.split("");
	let len = observedArr.length;
	let res;

	function arrFn(len) {
		res = Array.from({ length: len }).reduce((acc, crt, idx) => {
			let result = idx === 0 ? adjacentObj[observedArr[idx]] : acc.map((item) => adjacentObj[observedArr[idx]].map((item1) => item + "" + item1));
			return result.flat(Infinity);
		}, []);
		return res;
	}

	res = arrFn(len).map(item => String(item))
	return res;
}
```





### best practice

```js
function getPINs(observerd) {
  return observed.split('')
  	.map(t => ({
      '0': [ '0', '8' ],
      '1': [ '1', '2', '4' ],
      '2': [ '1', '2', '3', '5' ],
      '3': [ '2', '3', '6' ],
      '4': [ '1', '4', '5', '7' ],
      '5': [ '2', '4', '5', '6', '8' ],
      '6': [ '3', '5', '6', '9' ],
      '7': [ '4', '7', '8' ],
      '8': [ '5', '7', '8', '9', '0' ],
      '9': [ '6', '8', '9' ]
  }[t]))
  .reduce((acc,crt) =>[].concat.apply([], acc.map(item=>crt.map(item1 => item+item1))))
}
```

