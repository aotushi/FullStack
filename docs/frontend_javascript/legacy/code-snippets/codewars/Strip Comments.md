### Intructions

> Complete the solution so that it strips all text that follows any of a set of comment markers passed in. Any whitespace at the end of the line should also be stripped out.

#### Examples

Given an input string of:

```js
apples, pears # and bananas
grapes
bananas !apples
```

The output expected would be:

```js
apples, pears
grapes
bananas
```

the code  would be called likes so:

```js
var result = solution("apples, pears # and bananas\ngrapes\nbananas !apples", ["#", "!"])
// result should == "apples, pears\ngrapes\nbananas"
```





### Solutions

```js

function solution(input, markers) {
  let inputArr = input.split(`\n`)
  inputArr.map(itemArr => { 
    let res = itemArr.slice(0, markers.reduce((pre, item) => {
    Math.min(pre, itemArr.includes(item) ? itemArr.indexOf(item) : itemArr.length )
  }, itemArr.length))) 
  	return res[res.length -1] === ' ' ? res.trimEnd() : res;
  }).join('\n')
}
```





```js
// clever !!!
function solution(input, markers) {
  return input.split('\n').map(
  	line => markers.reduce(
    	(line, marker) => line.split(marker)[0].trim(), line
    )
  ).join('\n')
}


function solution(input, markers) {
  return input.replace(new RegExp("\\s?[" + markers.join('') + '].*(\\n)?', 'gi'), '$1')
}
```







