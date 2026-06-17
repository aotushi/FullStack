---
aliases: 布尔值声明,Boolean
---



> The `Boolean` object is an object wrapper for a boolean value



### **Desc**

* the value passed as the first parament is converted to a boolean value, if necessary.
* If the value is omitted or is `0`, `-0`, `false`, `NaN`, `undefined`, or the empty string (`''`), the object has an initial value of `false`
* All other values, includes any object, an empty array(`[]`), or the string `'false'`, craete an object with an initial value of `true`
* Do not confuse(混淆) the primitive `Boolean` values `true` and `false` with the `true` and `false` values of the `Boolean` object.
* Any object of the value is not `undefined` or `null`, including a `Boolean` object whose value is `false`evaluates to `true` when passed to a **conditional statement(条件声明)**.

```javascript
let x= new Boolean(false);
if (x) {
  //this code is executed
}
```

* this behavior does not apply to `Boolean` primitive. 

```javascript
let x = false;
if (x) {
  // this code is not execute
}
```

* Do not use a `Boolean` object to convert a non-boolean value to a boolean value. To perform this task, instead, use `Boolean` as a function, or a `double NOT operator`:

```javascript
let x = Boolean(expression); //use this..
var x = !!(expression); //... or this
var x = new Boolean(expression); //don't use this


Boolean(false)      //false
new Boolean(false)  // Boolean {false}
```

* If U specify any object, including a `Boolean` object whose value is `false`, as the initial value of `Boolean` object, the new `Boolean` object has a value of `true`.

```javascript
var myFalse = new Boolean(false); //initial value of false
var g = Boolean(myFalse); //initial value of true
var myString = new String('Hello'); //string object
var s = Boolean(myString); //initial value of true


//如何解决这个问题呢?  使用valueOf()方法

var myFalse = new Boolean(false);
var g = Boolean(myFalse.valueOf()); //false
var g = new Boolean(myFalse.valueOf()); //Boolean {false}

ES6之后不推荐使用(new 基本类型())的语法 好像两种没什么不同
new Object(基本类型.prototype.valueOf.call(myFalse));
new Object(基本类型.prototype.valueOf(myFalse));
```

* Do not use a `Boolean` object in place of a `Boolean` primitive

* When using `==` to loosely compare an object to a boolean primitive, it's important to have a clear understanding of what's actually being compared. Consider the following example:

```javascript
if ([]) {console.log('[] is truthy')} //logs '[] is truthy'
if ([] == false) { console.log('[] == false')}; // logs '[] == false'
```

the reason for `[]==false` even though `[]` is truthy is: the comparison `[] == false` compares the value of `[]` to `false`. And to get the value of `[]`, the JavaScript engine first calls `[].toString()`. That results in `''`, and that is what's actually compared to `false`. In other words, `[] == false` is equivalent to `'' == false`. And `''` is falsy-- and so that's what explains the behavior in the example.





### Constructor

`Boolean`

create a new `Boolean` object



### Instance methods

#### Boolean.prototype.toString()

**Desc**

> returns a string of either `true` or `false` depending upon the value of the object. Overrides the `Object.prototype.toString()` method.



#### Boolean.prototype.valueOf()

**Desc**

> returns the primitive value of the `Boolean` object. Overrides the `Object.prototype.valueOf()` method.



### Examples

<u>Creating `Boolean` objects with an initial value of `false`</u>

```javascript
var bNnParam = new Boolean();
var bZero = new Boolean(0);
var bNull = new Boolean(null);
var bEmptyString = new Boolean('');
var bfalse = new Boolean(false);
```



<u>Createing `Boolean` objects with an initial value of `true`</u>

```javascript
var btrue = new Boolean(true);
var btrueString = new Boolean('true');
var bfalseString = new Boolean('false');
var sSuLin = new Boolean('Su Lin');
var aArrayProto = new Boolean([]);
var bObjeProto = new Boolean({});
```



