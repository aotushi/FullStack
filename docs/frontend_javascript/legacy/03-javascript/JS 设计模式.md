
## 概述
> 内容来源<<JS设计模式与开发实战>>
> 设计模式在很多时候其实都体现了语言的不足之处。Peter Norvig曾说，设计模式是对语言不足的补充，如果要使用设计模式，不如去找一门更好的语言.


## 单例模式

### 概述
> 保证一个类仅有一个实例，并提供一个访问它的全局访问点。
> 比如线程池、全局缓存、浏览器中的window对象,前端使用场景中的点击按钮出现的登录浮窗...



### 传统单例模式
> 用一个变量来标志当前是否已经为某个类创建过对象. 如果是, 则在下一次获取该类的实例时, 直接返回之前创建的对象.

```js
//实现1

let Singleton = function(name) {
	this.name = name;
	this.instance = null
}

Singleton.prototype.getName = function() {
	alert(this.name)
}

Singleton.getInstance = function(name) {
	if (!this.instance) {
		this.instance = new Singleton(name)
		}
	return this.instance
}

let a = Singleton.getInstance('sven1')
let b = Singleton.getInstance('sven2')

alert(a === b) //true
```

```js
//实现2
let Singleton = function(name) {
	this.name = name
}
Singleton.protoype.getName = function() {
	alert(this.name)
}

Singleton.getInstance = function(name) {
	let instance = null
	return function() {
		if (!instance) {
			instance = new Singleton(name)
		}
		return instance
	}
}

let a = Singleton.getInstance('sven1')
let b = Singleton.getInstance('sven2')

alert(a === b) //true
```

上面的单例模式存在的问题是, Singleton类的使用者必须知道这是一个单例类，跟以往通过new XXX的方式来获取对象不同，这里偏要使用Singleton.getInstance来获取对象。


### 透明的单例模式
> 实现一个“透明”的单例类，用户从这个类中创建对象的时候，可以像使用其他任何普通类一样。

> 使用CreateDiv单例类，它的作用是负责在页面中创建唯一的div节点

#### "透明"的含义
> 底层仍返回唯一的实例,但调用者无需改变使用习惯,代码形式上与普通类无异. 这就是透明的含义.


#### 与传统单例模式的对比

| 维度    | 透明单例模式                | 传统单例模式                    |
| ----- | --------------------- | ------------------------- |
| 实例化方式 | `new Singleton()`     | `Singleton.getInstance()` |
| 代码侵入性 | 对调用者透明,无需改变使用习惯       | 需要显示调用特定方法                |
| 设计复杂度 | 较高(闭包, 自执行函数, 拦截构造函数) | 较低(直接暴露工厂方法)              |
| 可读性   | 隐藏实现细节, 有理解成本         | 明确表达单例意图,易于理解             |


#### 代码实现
```js

let CreateDiv = (function() {

	let instance
	CreateDiv = function(html) {
		if (instance) {   //拦截重复实例化
			return instance
		}
		this.html = html
		this.init()
		return instance = this //缓存首次实例
	}

	CreateDiv.prototype.init = function() {
		let div = document.createElement('div')
		div.innerHTML = this.html
		document.body.appendChild(div)
	}
	return CreateDiv;  //返回代理后的构造函数
})()


let a = new CreateDiv('sven1')
let b = new CreateDiv('sven2')

alert(a === b) // true
```


```js
//抽离

function Singleton(config) {
	if (Singleton.instance) {
		return Singleton.instance
	}
	
	this.config = config || {}
	this.init()
	
	Singleton.instance = this	
}


Singleton.prototype.init = function() {
	//执行初始化
	console.log('init', this.config)
}


const a = new Singleton({name: 'first'})
const b = new Singleton({name: 'second'})
a.init() //只会输出 'init {name: 'first'}'
console.log(a === b) //true

```



#### 代码存在的问题
* 构造函数负责了两件事, 违反了'单一职责原则'
* 如果将来需要利用这个类创建很多div, 即让这个类从单例模式变为普通的类,还必须改写

#### 潜在问题
*  **参数处理的陷阱**
	第2次调用`new CreateDiv('sven2')`时参数`sven2`会被静默忽略,可能会让开发者误以为每次初始化可以传递不同参数.
* 原型链的副作用
	由于单例实例在首次创建后便被缓存,后续通过`CreateDiv.prototype`修改原型方法时, 已存在的实例仍会继承这些修改.



### 用代理实现单例模式

#### 背景
> 解决透明单例模式存在的两个问题: 单一职责+未来可能存在的扩展


#### 代码实现
* 在CreaetDiv构造函数中,把负责管理单例的代码移除出去
* 引入代理类proxySingletonCreateDiv

```js

let CreateDiv = function(html) {
	this.html = html
	this.init()
}

CreateDiv.prototype.init = function() {
	let div = document.createElement('div')
	div.innerHTML = this.html
	document.body.appendChild(div)
}
```


```js
//引入代理类
let ProxySingletonCreateDiv = (
	function() {
		let instance
		return function(html) {
			if (!instance) {
				instance = new CreateDiv(html)
			}

			return instance
		}
	}
)()


let a = new ProxySingletonCreateDiv('sven1')
let b = new ProxySingletonCreateDiv('sven2')

alert(a === b) //true
```




### JavaScript中的单例模式

#### 背景
> 传统的单例模式实现在JavaScript中并不适用. 
> 单例模式的核心: 1确保只有一个实例; 2提供全局访问.



#### 降低全局变量带来的命名污染的2种方式
* **使用命名空间**
* **使用闭包封装私有变量**


#### 1.使用命名空间
> 使用命名空间可以减少全局变量的数量. 最简单的方式是用**对象字面量**的方式

```js
//第一种方式
let namespace= {

	a: function() {
		alert(1)
	},

	b: function() {
		alert(2)
	}
} 
```


```js
// 第二种方式 动态创建命名空间

let MyApp = {}

MyApp.namespace = function(name) {
	let parts = name.split('.')
	let current = MyApp
	for (let i in parts) {
		if (!current[parts[i]]) {
			current[parts[i]] = {}
		}
		current = current[parts[i]]
	}
}


MyApp.namespace('event')
MyApp.namespace('dom.style')

//上述代码等价于

let MyArr = {
	event: {},
	dom: {
		style: {}
	}
}



```


#### 2.使用闭包封装私有变量


```js

let user = (function() {
	let __name = 'sven', __age=29
	return {
		getUserInfo: function() {
			return __name + '-' + __age
		}
	}
})()
```

### 惰性单例

#### 是什么
> 惰性单例指的是在需要的时候才创建对象实例。


#### 基于类的惰性单例模式
就是传统的单例模式
```js

Singleton.getInstance = (function() {
	let instance = null
	return function(name) {
		if (!instance) {
			instance = new Singleton(name)
		}
		return instance
	}
})
```


##### 实例-实现唯一的登录弹窗

**方案1**
* 页面加载完成时便创建好div弹窗, 呈隐藏状态
* 用户点击登录按钮, 展示这个弹窗

```html
// 实现1
<html>
	<body>
		<button id="loginBtn">登录</button>
	</body>

	<script>
		let createLoginLayer = function() {
			let div = document.createElement('div')
			div.innerHTML = '我是登录弹窗'
			div.style.display = 'none'
			document.body.appendChild(div)
			return div
		}

		document.getElementById('loginBtn').onclick = function() {
			if (!loginLayer) {
				loginLayer = createLoginLayer()
			}
			loginLayer.style.display = 'block'
			//
		
		 return loginLayer
		}
	</script>
</html>
```

```html

//实现2

<html>
	<body>
		<button id="loginBtn">登录</button>
	</body>

	<script>
		let createLoginLayer = function() {
			let div;
			return function() {
				if (!div) {
					div = document.createElement('div')
					div.innerHTML = '我是登录弹窗'
					div.style.display = 'none'
					document.body.appendChild(div)
					return div
				}
			}
		}

		document.getElementById('loginBtn').onclick = function() {
			let loginLayer = createLoginLayer()
			loginLayer.style.display = 'block'
		}
	</script>
</html>
```



### 通用的惰性单例模式

#### 背景

* 方案1存在问题: 违反单一职责原则, 创建对象和管理单例的逻辑都放在createLoginLayer对象内部
* 如果下次需要创建页面唯一的iframe, script标签,必须如法炮制,把createLoginLayer函数几乎抄一遍


#### 实现

**单例逻辑**
```js

let getSingle = function(fn) {
	let result
	return function() {
		return result || (result = fn.apply(this, arguments))
	}
}
```


```js


//创建浮窗

let createLoginLayer = function() {
	let div = document.createElement('div')
	div.innerHTML = '我是登录浮窗'
	div.style.display = 'none'
	document.body.appendChild(div)
	return div
}

let createSingleLoginLayer = getSingle(createLoginLayer)

document.getElementById('loginBtn').onclick =function() {
	let loginLayer = createSingleLoginLayer()
	loginLayer.style.display = 'block'
}
```


```js

//创建iframe

let createSingleIframe = getSingle(function() {
	let iframe = document.createElement('iframe')
	document.body.appendChild(iframe)
	return iframe
})

document.getElementById('loginBtn').onclick = function() {
	let loginLayer = createSingleIframe()
	loginLayer.src = 'http://baidu.com'
}
```



##### 其它用途
单例模式用途远不止创建对象. 例如通常渲染完页面中的一个列表之后，接下来要给这个列表绑定click事件，如果是通过ajax动态往列表里追加数据，在使用事件代理的前提下，click事件实际上只需要在第一次渲染列表的时候被绑定一次, 但如果不想去判断是否第一次渲染列表. 
例如在Jquery中, 给节点绑定one事件:

```js

let bindEvent = function() {
	$('div').one('click', function() {
		alert('click')
	})
}

let render = function() {
	console.log('开始渲染列表')
	bindEvent()
}




render()
render()
render()
```

```js
//使用getSingle

let bindEvent = getSingle(function() {
	document.getElementById('div1').onclick = function() {
		alert('click')
	}
	return true
})


let render = function() {
	console.log('开始渲染列表')
	bindEvent()
}

render()
render()
render()
```



## 策略模式

### 定义
> 定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。