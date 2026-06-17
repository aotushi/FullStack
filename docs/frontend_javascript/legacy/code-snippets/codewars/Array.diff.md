### introductions

> Your goal in this kata is to implement a difference function, which subtracts one list from another and returns the result.
>
> It should remove all values from list `a`, which are present in list `b` keeping their order.
>
> ```javascript
> arrayDiff([1,2],[1]) == [2]
> ```
>
> If a value is present in `b`, all of its occurrences must be removed from the other:
>
> ```javascript
> arrayDiff([1,2,2,2,3],[2]) == [1,3]
> ```



### solution

```js
function arrayDiff(a,b) {
  let arr = [];
  a.forEach(item=>{
    if(b.indexOf(item) === -1) {
      arr.push(item);
    }
  });
  return arr;
}


//2021.11.16

function arrayDiff(a, b) {
  if (a.length > b.length) {
    return a.filter(item => !b.includes(item));
  } else {
    return b.filter(item => !a.includes(item));
  }
}
```



```js
//recommend
function arrayDiff(a,b){
  return a.filter(item=>!b.includes(item))
}


function arrayDiff(a,b) {
  return a.filter(function(x) {return b.indexOf(x) === -1;})
}

function arrayDiff(a,b) {
  b = new Set(b);
  return a.filter(v=>!b.has(v))
}
```

