---
aliases: proxy
---

### 概述
主要用于改变对象的默认访问行为，实际表现是在访问对象之前增加一层拦截，任何对对象的访问行为都会通过这层拦截。在拦截中，我们可以增加自定义的行为。

### 语法
```js
const proxy = new Proxy(target, handler)
```
一个构造函数，接收两个参数，一个是目标对象target；另一个是配置对象handler，用来定义拦截的行为。

#### 参数
**proxy, target与handler之间的关系**
Proxy构造函数的实例,任何对proxy实例的属性的访问都会自动转发至target对象上，我们可以针对访问的行为配置自定义的handler对象，因此外界通过proxy访问target对象的属性时，都会执行handler对象自定义的拦截操作。

```js
// 定义目标对象
const person = {name: 'kingx', age:'23'}
// 定义配置对象
let handler = {
	get: function(target,prop,receiver) {
		console.log('你访问了person的属性')
		return target[prop]
	}
}
// 生成Proxy的实例
const p = new Proxy(person, handler)

//执行结果
console.log(p.name)
// 你访问了person的属性
// kingx
```


#### 注意事项
1).必须通过代理实例访问
如果需要配置对象的拦截行为生效，那么必须是对代理实例的属性进行访问，而不是直接对目标对象进行访问。
如果直接通过目标对象person访问name属性，则不会触发拦截行为
```js
console.log(person.name); // kingx
```

2).配置对象不能为空对象
如果需要配置对象的拦截行为生效，那么配置对象不能为空对象。如果为空对象，则代表没有设置任何拦截，实际是对目标对象的访问。另外配置对象不能为null，否则会抛出异常。
```js
const p2 = new Proxy(person, {});
console.log(p2.name); // kingx
```




### 方法
#### get(target,propKey, receiver)
>拦截对象属性的读取操作，例如调用proxy.name或者proxy[name]，其中target表示的是目标对象，propKey表示的是读取的属性值，receiver表示的是配置对象。


#### set(target,propKey,value,receiver)
拦截对象属性的写操作，即设置属性值，例如proxy.name='kingx'或者proxy[name]='kingx'，其中target表示目标对象，propKey表示的是将要设置的属性，value表示将要设置的属性的值，receiver表示的是配置对象。

#### has(target,propKey)
拦截hasProperty的操作，返回一个布尔值，最典型的表现形式是执行propKey in target，其中target表示目标对象，propKey表示判断的属性。

#### deleteProperty(target,propKey)
拦截delete proxy\[propKey\]的操作，返回一个布尔值，表示是否执行成功，其中target表示目标对象，propKey表示将要删除的属性。


#### ownKeys(target)
拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环等操作，其中target表示的是获取对象自身所有的属性名。

#### getOwnPropertyDescriptor(proxy, propKey)
拦截Object.getOwnPropertyDescriptor(proxy, propKey)操作，返回属性的属性描述符构成的对象，其中target表示目标对象，propKey表示需要获取属性描述符集合的属性。

#### defineProperty(target,propKey,propDesc)
拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy,propDescs)操作，返回一个布尔值，其中target表示目标对象，propKey表示新增的属性，propDesc表示的是属性描述符对象。

#### preventExtensions(target)
拦截Object.preventExtensions(proxy)操作，返回一个布尔值，表示的是让一个对象变得不可扩展，不能再增加新的属性，其中target表示目标对象。

#### getPropertyOf(target)
拦截Object.getPrototypeOf(proxy)操作，返回一个对象，表示的是拦截获取对象原型属性，其中target表示目标对象。

#### isExtensible(proxy)
拦截Object.isExtensible(proxy)，返回一个布尔值，表示对象是否是可扩展的，其中target表示目标对象。


#### setPrototypeOf(target,proto)
拦截Object.setPrototypeOf(proxy, proto)操作，返回一个布尔值，表示的是拦截设置对象的原型属性的行为，其中target表示目标对象，proto表示新的原型对象。

#### apply(target,object,args)
拦截Proxy实例作为函数调用的操作，例如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)，其中target表示目标对象，object表示函数的调用方，args表示函数调用传递的参数。

#### construct(target,args)
拦截Proxy实例作为构造函数调用的操作，例如new proxy(...args)，其中target表示目标对象，args表示函数调用传递的参数。

这些函数都有一个通用的特性，即如果在target中使用了this关键字，再通过Proxy处理后，this关键字指向的是Proxy的实例，而不是目标对象target。




#### 读取不存在的属性
>在正常情况下，读取一个对象不存在的属性时，会返回“undefined”。通过Proxy的get()函数可以设置读取不存在的属性时抛出异常，从而避免对undefined值的兼容性处理。

```js
let person = {
    name: 'kingx'
};
const proxy = new Proxy(person, {
    get: function (target, propKey) {
        if(propKey in target) {
            return target[propKey];
        } else {
            throw new ReferenceError(`访问的属性${propKey}不存在`);
        }
    }
});
console.log(proxy.name); // kingx
console.log(proxy.age); // ReferenceError: 访问的属性age不存在
```


#### 读取负索引的值
数组的索引值是从0开始依次递增的，正常情况下我们无法读取负索引的值，但是通过Proxy的get()函数可以做到这一点。
负索引实际就是从数组的尾部元素开始，从后往前，寻找元素的位置。
```js
const arr = [1, 4, 9, 16, 25];
const proxy = new Proxy(arr, {
    get: function (target, index) {
        index = Number(index);
        if (index > 0) {
            return target[index];
        } else {
            // 索引为负值，则从尾部元素开始计算索引
            return target[target.length + index];
        }
    }
});
console.log(proxy[2]);  // 9
console.log(proxy[-2]); // 16
```


#### 禁止访问私有属性
在一些约定俗成的写法中，私有属性都会以下画线（\_）开头，事实上我们并不希望用户能访问到私有属性，这可以通过设置Proxy的get\(\)函数来实现。
```js
const person = {
    name: 'kingx',
    _pwd: '123456'
};
const proxy = new Proxy(person, {
    get: function (target, prop) {
        if (prop.indexOf('_') === 0) {
            throw new ReferenceError('不可直接访问私有属性');
        } else {
            return target[prop];
        }
    }
});
console.log(proxy.name); // kingx
console.log(proxy._pwd); // ReferenceError: 不可直接访问私有属性
```
在上面的实例中，我们在Proxy的get()函数中进行了设置，如果访问的某个属性是以下画线（\_）开头的，则直接抛出异常，其他属性则可以正常访问。


#### Proxy访问属性的限制
当我们期望使用Proxy对对象的属性进行代理，并修改属性的返回值时，我们需要这个属性不能同时为不可配置和不可写。如果这个属性同时为不可配置和不可写，那么在通过代理读取属性时，会抛出异常。
```js
const target = Object.deﬁneProperties({}, {
    // 可配置的name属性
    name: {
        value: 'kingx',
        conﬁgurable: true,
        writable: false
    },
    // 不可配置的age属性
    age: {
        value: 12,
        conﬁgurable: false,
        writable: false
    }
});
const proxy = new Proxy(target, {
    get: function (targetObj, prop) {
        return 'abc';
    }
});
console.log(proxy.name); // abc
console.log(proxy.age);  // TypeError: expected '12' but got 'abc')
```
因为name属性是不可写但可配置的，所以可以通过代理改变其真实值，从而得到“abc”；而age属性是不可写且不可配置的，所以在访问时就会直接抛出异常，异常信息栈的内容如下所示。
```md
TypeError: 'get' on proxy: property 'age' is a read-only and non-conﬁgurable
data property on the proxy target but the proxy did not return its actu al 
value (expected '12' but got 'abc')
```

从异常信息栈可以看出，不可写且不可配置的属性只能返回其实际值。

#### 拦截属性赋值操作
set()函数会拦截属性的赋值操作，例如这样一个场景：事先确定好了某个属性的取值区间，但是在对属性赋值时却不在这个区间内，则可以直接抛出异常。
定义一个person对象，包含一个age属性，取值区间为0～200，只要设置的值不在这个区间内，就会抛出异常。
```js
const proxy = new Proxy({}, {
    set: function (target, prop, value) {
        if (prop === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer');
            }
            if (value > 200 || value < 0) {
                throw new RangeError('The age is invalid');
            }
        }  else {
            target[prop] = value;
        }
    }
});
proxy.name = 'kingx';  // 正常
proxy.age = 10;  // 正常
proxy.age = 201; // RangeError: The age is invalid
```

在上面的实例中，我们在Proxy的set()函数中进行了特殊处理，首先保证设置的属性为age，然后判断设置的值是否为整数值，如果不是整数值，则抛出TypeError的异常；紧接着判断设置的值是否在0～200内，如果不在，则抛出RangeError的异常。

#### 隐藏内部私有属性
Proxy提供了has()函数，用于拦截hasProperty()函数，即判断对象是否具有某个属性，如果具有则返回“true”，如果不具有则返回“false”，典型的就是in操作符。
需要注意的是has()函数判断的是hasProperty()函数，而不是hasOwnProperty()函数，即has()函数不判断一个属性是对象自身的属性，还是对象继承的属性。
has()函数有一个最大的用处就是隐藏某些以下画线开头（\_）的私有属性，不对外暴露它们，从而通过in循环时不会遍历出私有属性值。
```js
const obj = {
    _name: 'kingx',
    age: 13
};
const proxy = new Proxy(obj, {
    has: function (target, prop) {
        if(prop[0] === '_') {
           return false;
        }
        return prop in target;
    }
});
console.log('age' in proxy);   // true
console.log('_name' in proxy); // false
```
在上面的实例中，我们在Proxy的has()函数中进行了处理，如果属性名第一个字符是下画线，则直接返回“false”，表示的是属性不存在对象中；而其他不以下画线开头的属性则直接通过in操作符判断是否存在于target中，如果存在就返回“true”，不存在就返回“false”。
还有一点需要注意的是，has()函数只会对in操作符生效，而不会对for...in循环操作符生效。

#### 禁止删除某个属性
Proxy中提供了deleteProperty()函数，用于拦截delete操作，返回“true”时表示属性删除成功，返回“false”时表示属性删除失败。
利用这个特性，我们可以做特殊处理，不能删除以下画线开头的私有属性。当删除了私有属性时，会抛出异常，终止操作。
```js
let obj = {
    _name: 'kingx',
    age: 12
};
const proxy = new Proxy(obj, {
    deleteProperty: function (target, prop) {
        if (prop[0] === '_') {
            throw new Error(`Invalid attempt to delete private "${prop}" property`);
        }
        return true;
    }
});
delete proxy.age;  // 删除成功
delete proxy._name; // Error: Invalid attempt to delete private "_name" property
```
在上面的实例中，我们在Proxy的deleteProperty()函数中进行了处理，如果属性名第一个字符是下画线，则直接抛出一个异常，其他属性则返回“true”，表明可以正常删除。因此我们在执行delete proxy.age时，可以成功删除age属性；而在执行delete proxy._name时，会抛出异常。


#### 函数的拦截
Proxy中提供了apply()函数，用于拦截函数调用的操作，函数调用包括直接调用、call()函数调用、apply()函数调用3种方式。
通过对函数调用的拦截，可以加入自定义操作，从而得到新的函数处理结果。
```js
function sum(num1, num2) {
    return num1 + num2;
}
const proxy = new Proxy(sum, {
    apply: function (target, obj, args) {
        return target.apply(obj, args) * 2;
    }
});
console.log(proxy(1, 3));  // 8
console.log(proxy.call(null, 3, 4));  // 14
console.log(proxy.apply(null, [5, 6]));  // 22
```




### Proxy使用场景
#### 1.实现真正私有
JavaScript中虽然没有私有属性的语法，但存在一种约定俗成的下画线写法，我们可以通过Proxy处理下画线写法来实现真正的私有。
真正的私有所要达到的目标有以下几个。
* 不能访问到私有属性，如果访问到私有属性则返回“undefined”。
* 不能直接修改私有属性的值，即使设置了也无效。
* 不能遍历出私有属性，遍历出来的属性中不会包含私有属性。(上面说到for...in可以遍历出proxy私有属性)
```js
const apis = {
    _apiKey: '12ab34cd56ef',
    getAllUsers: function () {
        console.log('这是查询全部用户的函数');
    },
    getUserById: function (userId) {
        console.log('这是根据用户id查询用户的函数');
    },
    saveUser: function (user) {
        console.log('这是保存用户的函数');
    }
};
const proxy = new Proxy(apis, {
    get: function (target, prop) {
        if (prop[0] === '_') {
            return undeﬁned;
        }
        return target[prop];
    },
    set: function (target, prop, value) {
        if (prop[0] !== '_') {
            target[prop] = value;
        }
    },
    has: function (target, prop) {
        if (prop[0] === '_') {
            return false;
        }
        return prop in target;
    }
});
console.log(proxy._apiKey); // undeﬁned
console.log(proxy.getAllUsers()); // 这是查询全部用户的函数
proxy._apiKey = '123456789'; // 设置无效
console.log('getUserById' in proxy);  // true
console.log('_apiKey' in proxy); // false
```


#### 增加日志记录
在日常的开发中，针对那些调用频繁、运行缓慢或者占用资源密集型的接口，我们期望能记录它们的使用情况，这个时候我们可以通过Proxy作为中间件增加日志记录。
为了达到上面的目的，我们需要使用Proxy进行拦截，首先通过get()函数拦截到调用的函数名，然后通过apply()函数进行函数的调用。
因此在实现上，get()函数会返回一个函数，在这个函数内通过apply()函数调用原始函数，然后调用记录操作日志的函数。
```js
const apis = {
    _apiKey: '12ab34cd56ef',
    getAllUsers: function () {
        console.log('这是查询全部用户的函数');
    },
    getUserById: function (userId) {
        console.log('这是根据用户id查询用户的函数');
    },
    saveUser: function (user) {
        console.log('这是保存用户的函数');
    }
};
// 记录日志的方法
function recordLog() {
    console.log('这是记录日志的函数');
}
const proxy = new Proxy(apis, {
    get: function (target, prop) {
        const value = target[prop];
        return function (...args) {
            // 此处调用记录日志的函数
            recordLog();
            // 调用真实的函数
            return value.apply(null, args);
        }
    }
});
proxy.getAllUsers();
```
在上面的实例中，我们新增了一个用于记录日志的函数，在Proxy的get()函数中返回一个函数，分别调用记录日志的函数和真实的函数。
```md
这是记录日志的函数
这是查询全部用户的函数
```
这样就可以在不影响原应用正常运行的情况下增加日志记录。如果我们只想要对特定的某些函数增加日志，那么可以在get()函数中进行特殊的处理，对函数名进行判断。


#### 提供友好提示或者阻止特定操作
通过Proxy，我们可以增加某些操作的友好提示或者阻止特定的操作，主要包括以下几类
* 某些被弃用的函数被调用时，给用户提供友好提示。
* 阻止删除属性的操作。
* 阻止修改某些特定的属性的操作。

```js
let dataStore = {
    noDelete: 1234,
    oldMethod: function () {/*...*/},
    doNotChange: “tried and true”
};
let NO_DELETE = ['noDelete'];
let DEPRECATED = ['oldMethod'];
let NO_CHANGE = ['doNotChange'];
const proxy = new Proxy(dataStore, {
    set(target, key, value, proxy) {
        if (NO_CHANGE.includes(key)) {
            throw Error(`Error! ${key} is immutable.`);
        }
        return true;
    },
    deleteProperty(target, key) {
        if (NO_DELETE.includes(key)) {
            throw Error(`Error! ${key} cannot be deleted.`);
        }
        return true;
    },
    get(target, key, proxy) {
        if (DEPRECATED.includes(key)) {
            console.warn(`Warning! ${key} is deprecated.`);
        }
        const val = target[key];
        return typeof val === 'function' ?
            function (...args) {
                val.apply(null, args);
            } : val;
    }
});
proxy.doNotChange = "foo"; // Error! doNotChange is immutable.
delete proxy.noDelete; // Error! noDelete cannot be deleted.
proxy.oldMethod(); // Warning! oldMethod is deprecated.
```


