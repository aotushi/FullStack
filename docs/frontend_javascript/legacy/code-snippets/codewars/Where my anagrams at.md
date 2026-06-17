### Introduction

> What is an anagram? Well, two words are anagrams of each other if they both contain the same letters. For example:

```javascript
'abba' & 'baab' == true

'abba' & 'bbaa' == true

'abba' & 'abbba' == false

'abba' & 'abca' == false
```

> Write a function that will find all the anagrams of a word from a list. You will be given two inputs a word and an array with words. You should return an array of all the anagrams or an empty array if there are none. For example:

```javascript
anagrams('abba', ['aabb', 'abcd', 'bbaa', 'dada']) => ['aabb', 'bbaa']

anagrams('racer', ['crazer', 'carer', 'racar', 'caers', 'racer']) => ['carer', 'racer']

anagrams('laser', ['lazing', 'lazy',  'lacer']) => []
```

**Note for Go**
For Go: Empty string slice is expected when there are no anagrams found.



### Solution

```javascript
//my
//两个判断条件：字符串长度相同 字符也相同 ?? 字符相同即可

function anagrams(word, words) {
  return words.filter(item => {
    return item.length === word.length && item.split('').sort().join('') === word.split('').sort().join('');
  })
}
```



```javascript
//recommend

String.prototype.sort = function() {
  return this.split('').sort().join('');
}

function anagrams(word, words) {
  return words.filter(item => item.sort() === word.sort())
}
```



