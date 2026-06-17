### Introduction

> Alice and Bob were on a holiday. Both of them took many pictures of the places they've been, and now they want to show Charlie their entire collection. However, Charlie doesn't like these sessions, since the motive usually repeats. He isn't fond of seeing the Eiffel tower 40 times. He tells them that he will only sit during the session if they show the same motive at most N times. Luckily, Alice and Bob are able to encode the motive as a number. Can you help them to remove numbers such that their list contains each number only up to N times, without changing the order?



### Task

> Given a list lst and a number N, create a new list that contains each number of lst at most N times without reordering. For example if N = 2, and the input is [1,2,3,1,2,1,2,3], you take [1,2,3,1,2], drop the next [1,2] since this would lead to 1 and 2 being in the result 3 times, and then take 3, which leads to [1,2,3,1,2,3].



### Example

```javascript
deleteNth ([1,1,1,1],2) // return [1,1]
  
deleteNth ([20,37,20,21],1) // return [20,37,21]
```





### Solution

```javascript
//数组中元素出现的次数要在n以内,超出的保留n个,不够的不变

function deleteNth(arr, n) {
  let getObj = arr.reduce((accumulator, currentValue, currentIndex, arr) => {
    if (accumulator[currentValue]) {
      accumulator[currentValue]++;
    } else {
      accumulator[currentValue] = 1;
    }
    // console.log(accumulator)
    return accumulator;
  }, {});
  let arrNew = [];

  Object.keys(getObj).forEach(item => {
    if (getObj[item] > n) {
      getObj[item] = n;
    }
    for (let i = 0; i < getObj[item]; i++) {
      arrNew.push(+item) 
    }
  })


  console.log(arrNew);
}

// deleteNth([1, 2, 3, 4, 2, 3, 4,2,3,4, 5], 2);
deleteNth([1,1,3,3,7,2,2,2,2], 3)

=========

function deleteNth(arr, n) {
  function getNumber(arr, ele) {
    //统计元素在数组中出现的次数
    let count = 0;
    arr.forEach(item => {
      if (item === ele) {
        count++;
      }
    })
    return count;
  }
  
  return arr.reduce((pre,value,index,arr) => {
   if (!pre.includes(value) || getNumber(pre, value) < n) {
     pre.push(value);
   }
    return pre;
  }, []);
}


          
          
```



```javascript
//recommend
function deleteNth(arr, x) {
  let cache = {};
  return arr.filter(n => {
    cache[n] = (cache[n]||0) + 1;
    return cache[n] <= x;
  })
}


function deleteNth(arr, n) {
  let count = {};
  return arr.filter(item => {
    count[item] = ~~count[a] + 1;
    return count[a] <= x;
  })
}
```

