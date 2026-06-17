---
alias: reflect
---

## 概述
Reflect对象与Proxy对象一样，也是ES6为了操作对象而提供的新API
>JS重难点实例精讲7.10.1 Reflect概述

什么是Reflect对象呢？
有一个名为Reflect的全局对象，上面挂载了对象的某些特殊函数，这些函数可以通过类似于Reflect.apply()这种形式来调用，所有在Reflect对象上的函数要么可以在Object原型链中找到，要么可以通过命令式操作符实现，例如delete和in操作符。

为什么还要在ES6中专门增加一个Reflect对象呢？
1.更合理地规划与Object对象相关的API
在ES6中，Object对象的一些明显属于语言内部的函数都会添加到Reflect对象中，这样Object对象与Reflect对象中会存在相同的处理函数。而在未来的设计中，语言内部的函数将只会添加到Reflect对象中。
2.用一个单一的全局对象去存储这些函数,方便统一管理

3.将一些命令式的操作符如delete、in等使用函数来替代，这样做的目的是为了让代码更好维护，更容易向下兼容，同时也避免出现更多的保留字
```js
// 传统写法
'assign' in Object // true

// 新写法
Reﬂect.has(Object, 'assign') // true
```

4.修改Object对象的某些函数的返回结果，可以让其变得更合理，使得代码更好维护。
如果一个对象obj是不能扩展的，那么在调用Object.defineProperty(obj,name, desc)时，会抛出一个异常。因此在传统的写法中，我们需要通过try...catch处理。
而使用Reflect.defineProperty(obj, name, desc)时，返回的是“false”，新的写法就可以通过if...else实现。
```js
// 传统写法
try {
    Object.defineProperty(target, property, attributes);
    // success
} catch (e) {
    // failure
}

// 新写法
if (Reﬂect.defineProperty(target, property, attributes)) {
    // success
} else {
    // failure
}
```

5.Reflect对象的函数与Proxy对象的函数一一对应，只要是Proxy对象的函数，就能在Reflect对象上找到对应的函数。
这就让Proxy对象可以方便地调用对应的Reflect对象上的函数，完成默认行为，并以此作为修改行为的基础。

### Reflect静态函数
Reflect对象本身并不是一个构造函数，而是直接提供静态函数以供调用


### Reflect与Proxy ???
ES6在设计的时候就将Reflect对象和Proxy对象绑定在一起了，Reflect对象的函数与Proxy对象的函数一一对应，因此在Proxy对象中调用Reflect对象对应的函数是一个明智的选择。


## 方法

### Reflect.ownKeys()
#### **概述**
> 静态方法. 返回目标对象自有属性的一个数组


#### 语法
**返回值**
目标对象自有属性键的一个数组,包含字符串和symbols.对大多数对象来说,这个数组的顺序将会是:
* 以增加的数字顺序（但作为字符串）的非负整数索引
* 按属性创建顺序的其他字符串键
* 按属性创建顺序的符号键。

**例外**
如果目标不是一个对象, 返回TypeError


Reflect.ownKeys()提供了获取对象所有属性键的反射语义。这是获取所有自有属性 - 可枚举和不可枚举，字符串和符号 - 的唯一方式，在一个调用中无需额外的过滤逻辑。例如，Object.getOwnPropertyNames()取得Reflect.ownKeys()的返回值并只过滤出字符串值，而Object.getOwnPropertySymbols()则只过滤出符号值。因为普通对象实现`[[OwnPropertyKeys]]`以在符号键之前返回所有字符串键，所以Reflect.ownKeys(target)通常等同于Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))。然而，如果对象具有自定义的`[[OwnPropertyKeys]]`方法（如通过代理的 ownKeys 处理器），那么键的顺序可能会不同。

Reflect.ownKeys()调用目标对象内部方法`[[OwnPropertyKeys]]`。
