



### react介绍及基础使用

用来操作dom的,可以换个说法,替换原生操作dom的js的.



### 引入js脚本开发

```html
使用React开发Web项目，我们需要引入两个js脚本：

react.development.js

react 是react核心库，只要使用react就必须要引入
下载地址：https://unpkg.com/react@18.0.0/umd/react.development.js
react-dom.development.js

react-dom 是react的dom包，使用react开发web应用时必须引入
下载地址：https://unpkg.com/react-dom@18.0.0/umd/react-dom.development.js

```



### 3个api

#### React.createElement()

- `React.createElement(eleName, [eleProps], [...eleChildren])`
- 用来创建React元素,最终会通过<u>虚拟dom</u>转换为真实的dom元素
- React元素一旦创建,就无法修改. 因为dom操作太复杂了,只能通过创建新的元素来替换.



```html
<script>

	const button = React.createElement('button', {
    id: 'btn',
    className: 'btnClass',
    onClick: alertFn
  }, '点我一下')
  
  const div = React.creteElement('div', {}, '我是一个div', button)
  const root = ReactDOM.createRoot(document.querySelector('root'))
  root.render(div)
  
  function alertFn() {
    alert('alert')
  }
</script>

```



```html

//现在要替换button的内容,只能重新声明一个新的button,然后让react重新渲染.这样只会<<重新渲染button元素>>


<body>
  <button id="btn2">
    原生按钮
  </button>
  <div id="root"></div>
</body>
<script>
 const button = React.createElement('button', {
    id: 'btn',
    className: 'btnClass',
    onClick: alertFn
  }, '点我一下')
  
  const div = React.creteElement('div', {}, '我是一个div', button)
  const root = ReactDOM.createReact(document.querySelector('root'))
  root.render(div)
  
  function alertFn() {
    alert('alert')
  }
  
  
  const btnNode = document.getElementById('btn2');
  btnNode.addEventListener('click', function(event) {
    const button = React.createElement('button', {
    id: 'btn',
    className: 'btnClass',
    onClick: alertFn
  }, 'clickMe');

    const div = React.creteElement('div', {}, '我是一个div', button)
    //这里直接使用上面声明的root
    root.render(div) 
  })
  


</script>
```



#### ReactDOM.createRoot()

- `createRoot(container[, options])`
- 用来创建React的根容器，容器用来放置React元素

```html
<body>
  <div id="root"></div>
</body>

<script>

	const button = React.createElement('button', {
    id: 'btn',
    className: 'btnClass',
    onClick: alertFn
  }, '点我一下')
  
  const div = React.creteElement('div', {}, '我是一个div', button)
  const root = ReactDOM.createRoot(document.querySelector('root'))
  root.render(div)
  
  // ReactDOM.render(div, document.getElementById('root')) //老版本的用法, 相当于createRoot+render
  
  function alertFn() {
    alert('alert')
  }
</script>
```



#### root.render()

- `root.render(element)`
- 当首次调用时，容器节点里的所有 DOM 元素都会被替换，后续的调用则会使用 React 的 DOM 差分算法（DOM diffing algorithm）进行高效的更新。
- 不会修改容器节点（只会修改容器的子节点）。可以在不覆盖现有子节点的情况下，将组件插入已有的 DOM 节点中。
- 重新渲染时(当重复调用render),react会比较两次渲染结果,对dom做最少的更改



### dom操作和react操作类比

```script
//dom操作
const div = document.createElement('div')
div.innerHTML = '我是一个div元素'
document.getElementById('root').appendChild(div)

//react操作
const div = React.createElement('div', {}, '我是一个div元素')
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(div)
```



















### JSX

#### 基本介绍和使用 

JSX 是 JavaScript 的语法扩展，JSX 使得我们可以以类似于 HTML 的形式去使用 JS。<u>JSX便是React中声明式编程的体现方式</u>。

声明式编程，简单理解就是以结果为导向的编程。使用JSX将我们所期望的网页结构编写出来，然后React再根据JSX自动生成JS代码(使用babel来翻译)。所以我们所编写的JSX代码，最终都会转换为以调用`React.createElement()`创建元素的代码。



使用babel将jsx内容转换成js.

```html
babel下载地址：https://unpkg.com/babel-standalone@6/babel.min.js

<body>
  <div id="root"></div>
  <div id="root2"></div>
</body>
<script type="text/babel">
  // 命令式
  const nativeButton = document.createElement('button')
  nativeButton.id = 'imp-btn'
  nativeButton.textContent = '原生按钮'
  document.getElementById('root').appendChild(nativeButton)

  // 声明式
  const button = <button>我是按钮</button>
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(button)
</script>
```





#### JSX注意事项

1. 不是字符串,不要加引号
2. 有且只有一个根标签
3. **html标签小写开头，React组件大写开头**
4. 标签必须正常闭合.自结束标签必须写斜杠
5. 事件名称必须是驼峰形式,事件对应的必须是函数名称,不能是函数体代码
6. 可以使用**`{}`**插入JS表达式。（表达式：有返回值的语句。JSX也是表达式）
7. 在JSX中, 属性可以直接在标签中设置（class使用className，style必须用{}）
8. 将会忽略`[], true, false, null, undefined`



#### 渲染列表

注意: JSX中`{}`只能放js表达式,不能放语句,但是语句中可以去操作jsx

```html
	<script type="text/babel">

  const arr = ['孙悟空', '猪八戒', '沙和尚']

  let list = <ul>{arr.map((item, index) => <li key={index}>{item}</li>)}</ul>


  const div = <div> {list} </div>

  const root = ReactDOM.createRoot(document.getElementById("root")); //获取根元素对应的react元素

  root.render(div);
	</script>
```

#### 虚拟DOM

渲染机制, react通过虚拟dom,将react元素和原生dom进行映射,虽然操作react元素,但是这些操作最终都会在真实dom中体现.

虚拟dom的好处:

* 降低dom原生api的复杂度
* 解决兼容问题
* 提升性能,减少dom的不必要操作

通过一个例子来体现:

当在列表中重新渲染时候(root.render()), react通过diffing算法, 将新的元素和旧元素进行比较,通过比较找到发生变化的元素,并且只对发生变化的元素进行修改.

**比较逻辑:**

1. 比较两次数据时, react先比较父元素,父元素不同,直接所有元素全部替换
2. 父元素一致,再去逐个比较子元素,直到找到所有发生变化的元素为止

```html
	<script type="text/babel">


    const arr = ['孙悟空', '猪八戒', '沙和尚']

    let list = <ul>{arr.map((item, index) => <li>{item}</li>)}</ul>

    const button = <button onClick={handleBtnClick}>点我一下</button>

    function handleBtnClick() {
      console.log('按钮被点击了')
      // arr.unshift('唐僧') //第一项不一致,导致其后所有项都会发生变化
      arr.push('唐僧') //前3项一致,所以只有新增项才会发生变化
      
      list = <ul>{arr.map((item, index) => <li key={index}>{item}</li>)}</ul>

      root.render(<div> {list} {button} </div>)
    }

    const div = <div> {list} {button} </div>

		const root = ReactDOM.createRoot(document.getElementById("root")); //获取根元素对应的react元素

		root.render(div);
	</script>
```



**循环中的key值**

上例中的数组循环时候,需要为每一项添加独一无二的key值.

在列表的最后新增一个元素, 没有改变列表其它元素,并不会产生性能问题.

在列表的最前新增一个元素, 其余元素的未知全都发生了变化, 而React默认是根据位置比较元素,所以此时所有元素都会被修改. 所以为列表设计了key属性, 当设置key以后再比较元素时,就会比较元素的key.

```html
	<script type="text/babel">


    const arr = ['孙悟空', '猪八戒', '沙和尚']

    let list = <ul>{arr.map((item, index) => <li key={item}>{item}</li>)}</ul>

    const button = <button onClick={handleBtnClick}>点我一下</button>

    function handleBtnClick() {
      console.log('按钮被点击了')
      arr.unshift('唐僧')
      
      list = <ul>{arr.map((item, index) => <li key={item}>{item}</li>)}</ul>

      root.render(<div> {list} {button} </div>)
    }

    const div = <div> {list} {button} </div>

		const root = ReactDOM.createRoot(document.getElementById("root")); //获取根元素对应的react元素

		root.render(div);
	</script>
```



如果key值是索引,可能会产生问题. 就上面的例子而言, 如果在列表最前面插入新元素的话,那原列表所有元素的key值都发生了变化,都需要重新渲染. 如果元素索引不会发生变化,就可以使用索引当key或者不设置key.











### 手动创建react项目

> 笔记: [创建React项目（手动） – 李立超 | lilichao.com](https://lilichao.com/?p=5710)
>
> 视频: https://www.bilibili.com/video/BV1bS4y1b7NV

我们先手动创建项目,react提供react-scripts包.

##### 手动创建项目的步骤

1. 创建项目, 目录结构如下:

```md
根目录
    - public
        - index.html （添加标签 <div id="root"></div>）
    - src
        - App.js
        - index.js
```

2. 进入所在目录,并执行命令`npm init -y`或`yarn init -y`
3. 安装项目依赖：`npm install react react-dom react-scripts -S` 或 `yarn add react react-dom react-scripts`
4. 运行`npx react-scripts start`启动项目（初次启动需要输入y确认）
   1. 或者将`react-scripts start`设置到`package.json`的scripts选项中，然后通过`npm start`启动（初次启动需要输入y确认）”scripts”: { “start”: “react-scripts start” }



20241118,安装的react, react-dom, react-scripts版本分别是: 

```json
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "^5.0.1"
  }
```



**index.html内容**

```html
<!DOCTYPE html>
<html lang="zh">
<head>
   <meta charset="UTF-8">
   <title>Title</title>
</head>
<body>
<div id="root"></div>
</body>
</html>
```



**App.js**

```js
const App = <div><h1>hello world!</h1></div>

export default App;
```



**index.js**

```js
import ReactDom from 'react-dom/client'; //版本18之后,需要在客户端引入时添加client, 服务器上也有对应的名称.
import App from './App'


const root = ReactDom.createRoot(document.getElementById('root'))
root.render(App)
```



##### 启动项目/构建项目

```bash
npx react-scripts start
npx react-scripts build
```

执行后,会在package.json中生成默认配置,及根目录下生成build文件夹. 为了更方便使用这个命令, 将其配置到package.json文件中.

```json
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
```





### 项目练习

#### 1.手动创建项目

具体操作根据上一目录中的内容来操作,同时需要在package.json中添加eslint,用来检查react语法是否正确.

```json
...
"eslintConfig": {
  "extends": [
    "react-app" //会有语法提示, 可选
  ]
}
```

#### 项目介绍

> [练习1：学习记录器 – 李立超 | lilichao.com](https://lilichao.com/?p=5753)

![img](https://my-wp.oss-cn-beijing.aliyuncs.com/wp-content/uploads/2022/04/20220418220344552.png)





##### 页面CSS实现

首先实现其中一个的样式


### React语法
#### 引入组件

**介绍**

react中有两种组件创建方式:

- 函数式组件(简单, 首推使用)
  - 就是一个返回JSX的普通函数
  - 组件首字母必须大写. ?
- 类组件



函数组件实现:

```js
// src/App.js

const App = function() {
  return <div><h1>hello world</h1></div>
}
export default App

// src/index.js
import ReactDom from 'react-dom/client'
import App from './App'
const root = ReactDom.createRoot(document.getElementById('root'))
root.render(<App/>)
```



类组件实现:

```js
// src/App.js

// 类组件必须继承React.Component
class App extends React.Component {
  
  
  //类组件中,必须添加一个render()方法,且方法的返回值要是一个jsx
  render() {
    return <div>我是一个类组件</div>
  }
}
```



#### 事件

> [事件 – 李立超 | lilichao.com](https://lilichao.com/?p=5730)



原生dom中事件的实现:

```html
//dom0
<button onclick="alert('点击了一下')">
  点击按钮
</button>

//dom2
document.getElementById('btn').addEventListener('click',(event) => {
//...
})
```



react中的事件绑定:

```jsx
const clickHandler = () => {
  alert('点击了一下')
}

const ele = <button onClick={clickHandler}>点击这个按钮</button>
```



注意事项:

* react事件使用驼峰命名法
* 事件属性需要一个函数对象,而不是调用函数



#### 事件对象

React事件也会产生事件对象，在事件的响应函数中可以定义第一个参数来获取事件对象：

```jsx

const clickHandler = (e) => {
  e.preventDefault()
  e.stopPropagation()
}
```



#### props

> [props – 李立超 | lilichao.com](https://lilichao.com/?p=5734)

组件的参数需要通过属性传递，可以像这样向组件中**传递参数**：

```
<Button bgColor='red' color='white'>我是一个按钮</Button>
```

上边的案例中我们设置了两个属性，这些属性会被封装到一个对象中并作为参数传递给Button组件，只需要在Button组件中定义一个参数即可获取，通常这个参数我们会命名为props，像这样：

```jsx

import './Button.css';
const Button = (props) => {
    return <button style={{backgroundColor:props.bgColor, color:props.color}}>{props.children}</button>;
};


export default Button;
```

在组件内部可以通过props.xxx来访问外部传递进的属性，从而达到动态设置的目的。需要注意的是，**标签体(标签之内的内容)**也可以设置为props的一个属性，叫做children，可以通过props.children来获取标签体的内容。

还有一点一定要记住，props中的属性是**只读**属性是无法修改的！

**props.children**

相当于vue中的插槽.使用props.children来接受父组件中当前组件标签之间写入的内容



开发环境下的数据传递与使用: 

> 两种方案, 具体的和解构简写的

```jsx
const Logs = () => {
  return <div className="logs">
    {/* <LogItem date={new Date(2024,11,19,15,30)} desc={'学习react'} time={'40分钟'}/> */}

    {
      resData.map((item,index) => {
        // return <LogItem key={index} date={item.date} desc={item.desc} time={item.time}/>
        return <LogItem key={index} {...item}/>
      })
    }
    
  </div>

}
```





#### state

> [state – 李立超 | lilichao.com](https://lilichao.com/?p=5597)
>
> [state的问题 – 李立超 | lilichao.com](https://lilichao.com/?p=5602)



对应vue中的响应式数据. 如何声明?

* 引入构造函数useState
* 需要在组件(函数组件,类组件)中声明,返回一个数组,数组中有两个参数,一个初始值,另一个是更新响应式数据的函数,会触发组件的重新渲染.

```jsx
import {useState} from 'react'

let [count, setCount] = useState(1)
```

setCount修改的是下一次渲染时候count的值

setCount()会触发组件的重新渲染,它是异步的. 

```jsx
const add = () => {
  setCount(2)
  setCount(3)
  setCount(4) //因为是异步的,所以这3次执行都会放到任务队列中, 也只会执行最后一次.
}
```







#### state注意事项

如果修改的state是一个对象, 然后只修改对象的某个属性,那么这个对象在更改之后,不会触发渲染.
setState会触发组件的重新渲染,但如果是在原对象上更改, 调用setState不会触发重新渲染.

```jsx
const App = () => {
  console.log('app组件执行了,组件创建完成')
  
  let [counter, setCount] = useState({
    name: '孙悟空',
    age: 18
  })
  const update1 = () => {
    counter.name = '猪八戒'
    console.log('add>counter>', counter)  //虽然更改了对象,但是setCount没有触发重新渲染
    setCount(counter)
  }
  const update2 = () => {
    // let counter2 = Object.assign({}, counter)  第一种方案
    // counter2.name = '猪八戒'
    // setCount(counter2)

    setCount({...counter, name: '猪八戒'})  //第二种方案
  }

  return <div className="app">
    <h2>{counter.name}--{counter.age}</h2>
    <button onClick={update1}>+</button>
    <button onClick={update2}>-</button>
  </div>
}
export default App
```



#### state问题

setState()会触发组件的重新渲染,它是异步的. 所以当调用setState(),需要用旧state的值时,要注意,可能会出现计算错误的情况. 

为了避免这种情况, 为setState传递<span style="color: blue; font-weight: bold;">回调函数</span>的形式来修改state

```jsx
const App = () => {
  console.log('app组件执行了,组件创建完成')
  
  let [counte, setCounte] = useState(1)
  const update1 = () => {
		setTimeout(() => {
      setCounte(counte + 1)  // 在1秒内点击两次, coute的值都是相同的旧值,而不是第一次点击后的新counte
    }, 1000)
  }

    const update2 = () => {
    setState(state => state + 1)  //可以获取到state的最新值
  }
    
    
  return <div className="app">
    <h2>{counter.name}--{counter.age}</h2>
    <button onClick={update1}>+</button>
    <button onClick={update2}>+Callback</button>
  </div>
}
export default App
```



#### useRef()

**用法**
 1. 保存dom的引用
 2. 保存其它内容


**1.保存dom的引用**
* 1.<span style="color: red;">钩子函数注意事项:</span>
	- React中的钩子函数只能用于函数组件或自定义钩子中
	- 钩子函数只能直接在函数中调用
  - 2.将容器设置为想要获取DOM对象元素的ref属性 //react会自动获取当前元素的dom对象,设置为容器的current属性

```jsx
import {useRef} from 'react'

const App = () => {
  console.log('app组件执行了,组件创建完成')

  // const h2Ref = useRef()
  const h2Ref = {current: null}
  console.log('h2Ref', h2Ref.current) //{current: h2#h2}

  const h2Node = document.getElementById('h2')
  console.log('h2Ref === h2Node', h2Ref.current === h2Node) // true



  const handleBtnClick = () => {
    console.log('h2Ref', h2Ref)
  }
  return <div className="app">
    <h2 id="h2" ref={h2Ref}>hello world</h2>
    <button onClick={handleBtnClick}>+</button>
    <button >+Callback</button>
  </div>
}
export default App

```


**2.保存其它内容,但不会触发重新渲染**
如果想触发重新渲染, 还需要配合state.
useRef一般用来存一些不是用于渲染的内容的.
```tsx
import {useRef} from 'react'

function App() {
	const numRef = useRef<number>(0)

	return (
		<div onClick={
			numRef.current += 1
		}>{numRef.current}</div>
	)
}

export default App
```


##### useRef特点
- 返回一个普通对象, 对象的current属性是一个DOM对象  {current: undefined}
- 我们可以创建一个对象,来代替useRef()返回的对象
- 两者区别: 我们创建的对象,组件每次重新渲染都会创建一个新对象; useRef()创建的对象, 可以确保每次渲染获取到的都是同一个对象
- 使用场景: 当需要一个对象不会因为组件的重新渲染而改变时, 旧可以使用useRef



#### 类组件

类组件的props的是存储到类的实例对象中,可以直接通过实例对象访问.

```jsx

//声明标签属性
<User name="孙悟空" age={18} gender={'男'} />

//接受标签属性
import React, {Component} from 'react'

class User extends Component {
  
  render(
  	return <div>
     	<ul>
      	<li>{this.props.name}</li> 
        <li>{this.props.age}</li>
        <li>{this.props.gender}</li>
      </ul>
     </div>
  )
}
```



类组件中的state统一存储到实例对象的state属性中,可以通过this.state来访问, 通过this.setState()来修改

当通过this.setState()修改state时候, 只会修改设置了的属性, 没有设置的不会修改.

在函数组件中, 响应函数直接以函数形式定义在组件中

在类组件中,响应函数是以类的方法定义,之前的属性都会

但是仅限于直接存储在state中的属性.之前的属性都会被保留.

```jsx
import React, {Component} from 'react'

class User extends Component {
  state = {
    count: 0,
    test: 'hhhh'
  }
  
  clickHandler = () => {
    // this.setState({count: this.state.count+1})  //采用这种方式 test也不会丢失
    this.setState(pre => {
      return {
        count: pre + 1
      }
    })
  }
  
  render(
  	return <div>
     	<h1>{this.state.count} -- {this.state.test}</h1>  //test值不会丢失
      <button onClick={clickHandler} >点击</button>
     </div>
  )
}
```



```jsx
import React, {Component} from 'react'

class User extends Component {
  state = {
    count: 0,
    test: 'hhhh',
    obj: {
      name: '孙悟空',
      age: 18
    }
  }
  
  clickHandler = () => {
    // this.setState({count: this.state.count+1})
    this.setState({
      // obj: {name: '猪八戒'}  //obj.age不是直接在state中声明的,所以会丢失,解决方法是对象合并
      obj: {...this.state.obj, name:'猪八戒'}
    })
  }
  
  render(
  	return <div>
     	<h1>{this.state.count} -- {this.state.test} </h1>
      <h1>{this.state.obj.name} -- {this.state.obj.age}</h1>
      <button onClick={clickHandler} >点击</button>
     </div>
  )
}
```



获取DOM对象

1.创建一个属性,用来存储DOM对象. 类组件中使用`React.createRef()`

2.在指定标签上使用这个属性

```jsx

import React, {Component} from 'react'

class User extends Component {

  divRef = React.createRef()
  
  render(
  	return <div ref={this.divRef}>
     	
      <button  >点击</button>
     </div>
  )
}
```



#### card组件

功能类似于vue中的插槽, 提取公共部分,减少代码量.



#### 添加表单

获取表单中的信息:  使用事件+`e.target.value`

禁用表单提交的默认操作: 禁用默认操作 `e.preventDefault()`

点击按钮后清空表单旧数据,

* 非受控组件: 普通变量形式
* 受控组件: 使用react的state, useState

```jsx

// src/Components/LogsForm.js  双向绑定

const LogsForm = (props) => {

  // let inputDate, inputDesc, inputTime;

  const [inputDate , setInputDate] = useState('');
  const [inputDesc , setInputDesc] = useState('');
  const [inputTime, setInputTime] = useState(0);

  const dateChangeHandler = (e) => {
    // inputDate = e.target.value
    setInputDate(e.target.value)
  }

  const descChangeHandler = (e) => {
    // inputDesc = e.target.value
    setInputDesc(e.target.value)
  }

  const timeChangeHandler = (e) => {
    // inputTime = e.target.value
    setInputTime(e.target.value)
  }

  const formSubmitHandler = (e) => {
    e.preventDefault();

    const newLog = {
      date: new Date(inputDate),
      desc: inputDesc,
      time: +inputTime
    };

    console.log('newLog', newLog)

    // 清空
    setInputDate('');
    setInputDesc('');
    setInputTime('');
    }



  return (
    <div className="logs-form">
      <div className="form-item">
        <label htmlFor="date">日期:</label>
        <input onChange={dateChangeHandler} value={inputDate} id="date" type="date" />
      </div>

      <div className="form-item">
        <label htmlFor="desc">内容:</label>
        <input onChange={descChangeHandler} value={inputDesc} id="desc" type="text" />
      </div>

      <div className="form-item">
        <label htmlFor="time">时长:</label>
        <input onChange={timeChangeHandler} value={inputTime} id="time" type="number" />
      </div>

      <div className="form-btn">
        <button onClick={formSubmitHandler}>提交</button>
      </div>
    </div>
  );
};

export default LogsForm;
```



把双向绑定数据集中到一个对象中. 两种方式建议第一种, 单独声明的形式,

```jsx
const LogsForm = (props) => {

  // let inputDate, inputDesc, inputTime;

  // const [inputDate , setInputDate] = useState('');
  // const [inputDesc , setInputDesc] = useState('');
  // const [inputTime, setInputTime] = useState(0);

  const [formData, setFormData ] = useState({
    inputDate: '',
    inputDesc: '',
    inputTime: ''
  })

  const dateChangeHandler = (e) => {
    // inputDate = e.target.value
    // setInputDate(e.target.value)

    setFormData({
      ...formData,
      inputDate: e.target.value
    })
  }

  const descChangeHandler = (e) => {
    // inputDesc = e.target.value
    // setInputDesc(e.target.value)

    setFormData({
      ...formData.inputDesc,
      inputDesc: e.target.value
    })
  }

  const timeChangeHandler = (e) => {
    // inputTime = e.target.value
    // setInputTime(e.target.value)

    setFormData({
      ...formData.inputTime,
      inputTime: e.target.value
    })
  }




  const formSubmitHandler = (e) => {
    e.preventDefault();

    const newLog = {
      date: new Date(formData.inputDate),
      desc: formData.inputDesc,
      time: +(formData.inputTime)
    };

    console.log('newLog', newLog)

    // 清空
    // setInputDate('');
    // setInputDesc('');
    // setInputTime('');

    setFormData({
      inputDate: '',
      inputDesc: '',
      inputTime: ''
    })
    }



  return (
    <div className="logs-form">
      <div className="form-item">
        <label htmlFor="date">日期:</label>
        <input onChange={dateChangeHandler} value={formData.inputDate} id="date" type="date" />
      </div>

      <div className="form-item">
        <label htmlFor="desc">内容:</label>
        <input onChange={descChangeHandler} value={formData.inputDesc} id="desc" type="text" />
      </div>

      <div className="form-item">
        <label htmlFor="time">时长:</label>
        <input onChange={timeChangeHandler} value={formData.inputTime} id="time" type="number" />
      </div>

      <div className="form-btn">
        <button onClick={formSubmitHandler}>提交</button>
      </div>
    </div>
  );
};

export default LogsForm;
```



**数据共享**

使用祖先组件来共享数据: state的提升

子组件传递数据=> 父组件 使用props的回调函数形式  中间可以间隔多个组件调用初始的函数

父组件传递数据=> 子组件 使用props

```jsx
// src/App.js 

const onSaveLog = (newLog) => {
    setLogsData([newLog, ...logsData]);
  };

  return (
    <div className="app">
      <LogsForm onSaveLog={onSaveLog} />
      <Logs LogsData={logsData} />
    </div>
  );
};
```



**删除数据**

将处理函数传递给子组件,在传递给子组件, 在最后的子组件中直接调用这个函数.





#### **创建自定义confirmModal(dialog)**

##### 创建逻辑



##### 存在问题

弹窗组件confirmModal展示以后, 可以点击多个触发其展示的组件logItem的删除按钮, 也就是会显示多个.使用幕布(背景层)来禁用触发,纯css实现. 

这个地方应该也能使用单例模式来实现.





#### 使用portal修改项目

原因: 因为只在特定使用删除组件, 耦合严重,可能存在的衍生css样式问题多. 

解决方案是,使用react的传送门portal功能, 其作用是将组件渲染到指定位置.



使用步骤:

1. 在index.html新增一个html元素
2. 修改组件的渲染方式
   1. 通过`ReactDOM.createPortal()`作为返回值创建元素
   2. 参数: 
      1. jsx(修改前return后的代码)
      2. 目标位置(DOM元素)

```html
//public/index.html

<body>
  <div id="root"></div>
  <div id="backdrop"></div>
</body>

```



```jsx
// src/Components/Backdrop/Backdrop.js

//因为弹窗组件confirmModal是包裹在Backdrop组件中的,所以我们将在Backdrop组件中使用portal功能

import ReactDOM from 'react-dom';

//修改前
const Backdrop = (props) => {
  return <div className="backdrop">{props.children}</div>
}

//修改后
const backdropRoot = document.getElementById('backdrop-root')
const Backdrop = (props) => {
  return ReactDOM.createPortal(
  	<div className="backdrop">{props.children}</div>,
  	backdropRoot
  )
}
```



#### 过滤功能

filter筛选



### 自动创建项目

使用包来创建react项目

```sh
npx create-react-app  名字

npx create-react-app@latest my-app
```



#### 项目解构

##### package.json

'eject': 慎用, 相关webpack配置.

'test': 单元测试相关.

##### public

manifest.json: 

应用配置文件说明 webapp相关的配置

robots.txt

爬虫规则



#### 内联样式和样式表, CSS模块



```jsx
// src/App.js
// src/App.css

App.css中的样式是全局的,没有作用域, 存在样式覆盖问题. 使用CSS模块来解决没有作用域的问题.
```

##### 如何创建CSS模块

1.创建xx.module.css

2.在组件中引入css

3.通过classes设置类 `<p className={class.p1} />`  会生成唯一的class值

```jsx
import classes from './App.module.css'


```



#### Fragment

类似于vue中的template, 返回子组件,不会创建任何多余的元素. 

react中的`React.Fragment`起到这个作用.

使用方式:

1.自定义实现Fragment

2.`React.Fragment`

3.简写`React.Fragment` ==> `<>`

```jsx

const Out = (props) => {
  return (
		{
      props.children
    }
	)
}
export default Out
```



### 项目-订餐应用

#### 实现适配

```jsx
//src/Index.js

document.documentElement.style.fontSize = 100/705 * 'vw';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
  	<App />
  </React.StrictMode>
)
```

#### 开发

![aaabbb](./assets/20220506173307498-1536x831.png)



![img](https://my-wp.oss-cn-beijing.aliyuncs.com/wp-content/uploads/2022/05/20220506213746650-1024x579.png)

##### Meal组件



##### counter组件

注意: jsx中使用逻辑判断时候, 带出多个标签时如何处理?

```jsx
  return (
    <div className={classes.counter}>
      {!!props.amount && <Fragment></Fragment><button className={classes.sub}>-</button>) && (<span className={classes.num}>{props.amount}</span></Fragment>}
      <button className={classes.add}>+</button>
    </div>
  );
```



##### 使用图表字体代替按钮符号

> https://docs.fontawesome.com/web/use-with/react

字体基线问题导致按钮符号偏下. 使用fontawesome

安装依赖

```
npm i --save @fortawesome/fontawesome-svg-core

npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons


npm i --save @fortawesome/react-fontawesome@latest

```



引入组件

```jsx
import {fontAwesome} from '@fortawesome/fontawesome-svg-core'

```



引入图标

```js
import {faPlus, faMinus} from '@fortawesome/free-solid-svg-icons'
```

使用图标

```jsx
<FontAwesomeIcon icon={faPlus} />
```



##### Meals数据传递

数据要存放在使用它的组件的父组件之中.



##### 添加删除购物车中的商品

如果使用props方式传递回调函数的话, 但是传递层级多.



#### Context的使用

组件之间的通信:
在React中组件间的数据通信是通过props进行的，父组件给子组件设置props，子组件给后代组件设置props，props在组件间自上向下（父传子）的逐层传递数据。但并不是所有的数据都适合这种传递方式

Context为我们提供了一种在不同组件间共享数据的方式，它不再拘泥于props刻板的逐层传递，而是在外层组件中统一设置，设置后内层所有的组件都可以访问到Context中所存储的数据。



##### **1.创建Context:**
语法:
```tsx
//defaultValue可以是任意类型的值.
const myContext = React.createContext(defaultValue)
```

创建:
```js
// src/store/Xxx.js

const Xxx = React.createContext({name:'孙悟空',age: 28})

export default Xxx
```




##### **2.父组件提供context.Provider**
生产者`Xxx.provider`来提供响应数据的. 

```jsx
import Xxx from '../store/Xxx'


const App = () => {
  return <div>
    <A/>  //A组件中访问不了生产者提供的数据
  	<Xxx.provider value={{name:'猪八戒', age:18}}>
    	
      <B/>
      <C/>
    </Xxx.provider>
  </div>
}
```


##### **3.子组件接收数据**

**方式1** 使用`Xxx.Consumer`组件来创建元素

```tsx
// 使用`组件+回调函数+入参`的形式来创建子组件

// B.tsx
import Xxx from './stroe/Xxxd'
(
	<Xxx.Consumer>
  	{
      (ctx) => {   
        return <div>
        	{ctx.}  //可以访问ctx中的内容
        </div>
      }
    }
  </Xxx.Consumer>
)
```




**方式2(推荐使用)** 使用钩子函数`useContext(导入的内容)`  
只需要将Context对象作为参数传递给钩子函数，它就会直接给我们返回Context对象中存储的数据。
```jsx
import React, {useContext} from 'react';
import Xxx from '../store/Xxx';

const MyComponent = () => {

    const ctx = useContext(Xxx);

    return (
        <ul>
            <li>{ctx.name}</li>
            <li>{ctx.age}</li>
            <li>{ctx.gender}</li>
        </ul>
    );
};

export default MyComponent;
```



##### **context的嵌套**
* 组件访问context时遵循就近原则
* 如果没有Provider, 则读取Context的初始化属性

```jsx
import Xxx from '../store/Xxx'


const App = () => {
  return <div>
    <A/>  //A组件中访问不了生产者提供的数据
  	<Xxx.provider value={{name:'猪八戒', age:18}}>
      <B/>
      <Xxx2.provider value={{name:'沙和尚', age: 38}}>
      	<C/>
      </Xxx2.provider>
    </Xxx.provider>
  </div>
}
```



##### 搜索框实现

过滤

##### 购物车及购物车详情的显示与隐藏

注意事项:

```jsx
  const toggleShowCartDetail = () => {
    // setShowCartDetail(!showCartDetail);
    setShowCartDetail(preState => !preState);

  }
```



backdrop中的冒泡

1.props的扩展运算符用法

```jsx
const Backdrop = (props) => {
  return (
    ReactDOM.createPortal(<div {...props} className={`${classes.backdrop} ${props.className}`} >{props.children}</div>, backdropRoot)
  );
};

export default Backdrop;
```





##### 结账页面 + 支付条



### React副作用Effect

订餐应用中的潜在的问题:

* 购物车中商品清空以后, 购物车还显示
* 结账页面中商品清空以后, 页面还显示



关于第一个问题,在采用最新方案之前,我是通过props的回调函数方式:

* 在cartDetail组件上, 调用了父组件cart中的`toggleShowCartDetail`来触发购物车的显示/隐藏, 调用了
* 在cartDetail组件中, 调用了`<Meal>`组件外层div上的lcick事件, 触发父组件的`toggleShowCartDetail`方法



新的解决方案:

> 在组件每次重新渲染时候, 检查商品的总数量,如果数量是0,则修改showDetails为false 
>
> 组件每次重新渲染, 组件的函数都会执行.

以下方案会报错, 死循环

```jsx
if (ctx.totalAmount === 0) {
  setShowDetails(false)
}
```



#### **Effect(副作用)**

> [Effect – 李立超 | lilichao.com](https://lilichao.com/?p=5646)

React组件有部分逻辑都可以直接编写到组件的函数体中的，像是对数组调用filter、map等方法，像是判断某个组件是否显示等。但是有一部分逻辑如果直接写在函数体中，会影响到组件的渲染，这部分会产生“副作用”的代码，是一定不能直接写在函数体中。

##### React.strictMode

> 如果你的React使用了严格模式，也就是在React中使用了`React.StrictMode`标签，那么React会非常“智能”的去检查你的组件中是否写有副作用的代码.
>
> 官网说明: 
>
> Strict mode can’t automatically detect side effects for you, but it can help you spot them by making them a little more deterministic. This is done by intentionally double-invoking the following functions:
>
> - Class component `constructor`, `render`, and `shouldComponentUpdate` methods
> - Class component static `getDerivedStateFromProps` method
> - Function component bodies
> - State updater functions (the first argument to `setState`)
> - Functions passed to `useState`, `useMemo`, or `useReducer`

也就是,开发模式下且开启严格模式后, 以上函数会被调用两次. 如果你的浏览器中安装了React Developer Tools，第二次调用会显示为灰色。

```jsx
<React.StrictMode>
	<App/>
</React.StrictMode>
```





##### 背景问题:

当前state和旧值相同时候, 它是不会触发组件的重新渲染的. 但在案例中却不是这样的.

```jsx
// src/App.js
import React from 'react';
import B from './B'
const App = (props) => {
  console.log('app组件重新渲染')
  const [count, setCount] = React.useState(0);

  const onClickHandler = () => {
    console.log('点击了按钮')
    setCount(1)
  }
  return (
    <div>这是app组件
      <B />
      <div><button onClick={onClickHandler}>点击按钮</button></div>
    </div>
  );
};

export default App;


// src/B.js
import React from 'react';

const B = (props) => {
  console.log('b组件渲染了')
  return (
    <div>B组件</div>
  );
};

export default B;
```



**现象描述:**

1.页面刷新以后, 打印了`app组件重新渲染, b组件渲染了`

2.点击按钮以后,打印了`点击了按钮; app组件重新渲染; b组件渲染了`

3.再次点击按钮以后, 打印了`点击了按钮; app组件重新渲染`

4.再次点击按钮以后, 打印`点击了按钮`



**现象归因**

首先,需要了解以下setState方法的执行流程(函数组件中的,类组件中的顺序不太一样)

* 它会首先判断,组件处于什么阶段?
* 如果是渲染阶段: 不会检查state的值是否相同. (也就是重复调用的问题原因)
* 如果是非渲染阶段: 会检查state的值是否相同.
  * 如果值不相同, 则对组件进行重新渲染
  * 如果值相同, React在一些情况下会继续执行当前组件的渲染
    * 但是这个渲染不会触发其子组件的渲染, 这次渲染也不会产生实际的效果. 这种情况通常发生在值第一次相同时(3)



##### 使用Effect

> 钩子函数`useEffect()`，Effect的翻译过来就是副作用，专门用来处理那些不能直接写在组件内部的代码。
>
> 哪些代码不能直接写在组件内部呢？像是：获取数据、记录日志、检查登录、设置定时器等。简单来说，就是那些和组件渲染无关，但却有可能对组件产生副作用的代码。

语法

```jsx
useEffect(()=>{
    /* 编写那些会产生副作用的代码 */
});
```

`useEffect()`中的回调函数会在组件每次渲染完毕之后执行, React会确保effect每次运行时，DOM都已经更新完毕。.



##### 限制Effect

> 组件每次渲染effect都会执行，这似乎并不总那么必要。因此在`useEffect()`中我们可以限制effect的执行时机，在`useEffect()`中可以将一个数组作为第二个参数传递，像是这样：
>
> 设置以后effect只有在变量a或b发生变化时才会执行。这样即可限制effect的执行次数，也可以直接传递一个空数组，如果是空数组，那么effect只会执行一次。

```jsx
useEffect(()=>{
    /* 编写那些会产生副作用的代码 */

    return () => {
        /* 这个函数会在下一次effect执行前调用 */
    };
}, [a, b]);
```

例如,在餐饮项目中购物车页面中, 触发Effect执行有下面几种情况:

1. 初始化
2. 点击`+`按钮时
3. 点击购物车条时(没有必要)

所以我们想去除非必要情况下useEffect的执行, 就需要使用useEffect的第二个参数, 这个参数是一个数组, 数组内部需要传递依赖的值, 只有当依赖的值发生变化后, 才会执行useEffect函数.

```jsx
// 购物车 src/Components/Cart.js

  // 使用useEffect
  useEffect(() => {
    console.log('useEffect执行了')
    if (cardContext.totalAmount === 0) {
      setShowCartDetail(false);
      setShowCheckout(false);
    }
  }, [cardContext, setShowCartDetail, setShowCheckout])

// 去除setState
  // 使用useEffect
  useEffect(() => {
    console.log('useEffect执行了')
    if (cardContext.totalAmount === 0) {
      setShowCartDetail(false);
      setShowCheckout(false);
    }
  }, [cardContext])
```

**注意:**

* 通常会将useEffect使用的局部变量设置为依赖项, 这样可以确保这些值发生变化时,会触发useEffect的执行; 像setState()是由钩子函数useState()生成的, useState()会确保每次渲染都会获取到相同的setState()对象, 所以setState方法可以不设置到依赖项中.
* 如果设置了一个空数组, 则意味着useEffct只会在组件初始化时触发一次.



##### 在餐饮项目输入框中采用useEffect方案  / 清除Effect

```jsx
const FilterMeals = (props) => {

  const [inputVal, setInputVal] = useState('');
  const onInputSearchHandler = (e) => {
    setInputVal(e.target.value.trim());
    // props.onFilter(e.target.value) 旧方案
  }
  useEffect(() => {
    console.log('useEffect执行了')
    props.onFilter(inputVal);
  }, [inputVal])
  return (
    <div className={classes.filterMeals}>
      <FontAwesomeIcon icon={faSearch} className={classes.searchIcon}/>
      <input value={inputVal} onChange={onInputSearchHandler}type="text" className={classes.searchInput} />
      <h2 style={{fontSize: '40rem', color: "red"}}>{inputVal}</h2>
    </div>
  )
}

export default FilterMeals
```

存在的问题:

每次键盘输入时,都会触发useEffect函数. 不合理. 需要将此触发次数. 处理方案: 当用户停止输入1秒后, 才做查询. 

```jsx
// src/Components/Meals/filterMeal

  useEffect(() => {
    setTimeout(() => {
      console.log('useEffect执行了')
      props.onFilter(inputVal);
    }, 1000)
  }, [inputVal])
```

但是这样做的话,依然会有问题. 打印信息不会减少, 只是延迟了一秒后再执行而已, 并没有解决我们的问题.  <u>所以, 在开启一个定时器之前, 应该关掉上一次.</u>

所以,引入了useEffect的`清理函数`, 它会再useEffect下次执行前调用.

```jsx
// src/Components/Meals/filterMeal

  useEffect(() => {
    
    let timer = setTimeout(() => {
      console.log('useEffect执行了')
      props.onFilter(inputVal);
    }, 1000)
    
    
		return () => { // 清理函数
      clearTimeout(timer)
      
    }
  }, [inputVal])
```



### Reducer

> [Reducer – 李立超 | lilichao.com](https://lilichao.com/?p=5650)



#### 使用背景

为了解决复杂state带来的不便, React引入了reducer来整合state的复杂操作.

例如,我们在餐饮项目中引入了`React.createContext`来实现全局通信, 但是cardData这个state的更新需要多个函数方法, 可以引入reducer来整合.

```jsx
// src/store/cardContext.js
import React from "react";

const CardContext = React.createContext({
  items: [],
  totalAmount: 0,
  totalPrice: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  clearItem: () => {},
});


export default CardContext;

// src/App.js
import CardContext from './store/CardContext'
const App = () => {
    // 存储购物车数据
  const [cardData, setCardData] = useState({
    items: [],
    totalAmount: 0,
    totalPrice: 0,
  });
  
  const addItem = () => {};
  const removeItem = () => {};
  const clearItem = () => {};
  
  //...
  
  return (
  	<CardContext.Provider value={ ...cardData, addItem, subItem, clearItem}>
    	<FilterMeals onFilter={filterHandler} />
      <Meals meals={mealsData} clearable />
      <Cart />
    </CardContext.Provider>
  )
}
```



#### 语法

```jsx
const [state, dispathFn] = useReducer(reduceFn, initialArg, initFn)
```

* 返参:返回值和useState相似, state用来读取state的值, 第二个返参是'派发器', 通过它可以向`reducerFn()`函数发送不同的指令, 控制`reducerFn()`做不同的操作.
* 入参:
  * `reducerFn`: 一个函数,是所谓的整合器.它的返回值会称为新的state的值. 当调用dispathFn时,dispatchFn会将消息发送给`reducerFn()`, 然后`reducerFn()`可以根据不同的消息对state进行不同的处理. 
    * `reducerFn(state, action)`入参:
    * state 当前最新的state的值
    * action 需要一个对象, 在对象中会存储dispatch所发送的指令
  * `initialArg`: 就是state的初始值.
  * `initFn`, 暂时忽略



**注意事项**

`reducerFn`函数需要定在在函数组件的外部, 因为每次组件渲染都会生成一个新的reducerFn



基本使用:

```jsx
import React from "react";

const App = (props) => {
  // const [count, setCount] = React.useState(0);

  const reducerFn = (state, action) => {
    switch (action.type) {
      case "ADD":
        return state + 1;
      case "SUB":
        return state - 1;
      default:
        return state;
    }
  };

  const [count, dispatchCount] = React.useReducer(reducerFn, 0);

  const onAddHandler = () => {
    // dispatchCount("ADD"); 非对象入参也好用
    dispatchCount({type: 'ADD'})
  };
  const onSubHandler = () => {
    // dispatchCount("SUB");
    dispatchCount({type: 'SUB'})
  };

  return (
    <div>
      App组件
      <div
        style={{ width: "300px", height: "300px", backgroundColor: "#bfa", margin: "50rem auto", textAlign: "center", fontSize: "40px" }}
      >
        <button onClick={onSubHandler}>-</button>
        {count}
        <button onClick={onAddHandler}>+</button>
      </div>
    </div>
  );
};

export default App;
```



好了,让我更改餐饮项目中CardData中的操作方法,将其集中到reducer中

```jsx
// src/App.js
import CardContext from "./store/CardContext";

  const reducerFn = (state, action) => {
    const newCardData = { ...state };

    switch (action.type) {
      case "ADD":
        if (newCardData.items.find((item) => item.id === action.meal.id)) {
          // 已经存在
          action.meal.amount += 1;
        } else {
          // 不存在
          action.meal.amount = 1;
          newCardData.items.push(action.meal);
        }
        newCardData.totalPrice += action.meal.price;
        newCardData.totalAmount += 1;
        newCardData.totalPrice += action.meal.price;
        return newCardData;
      case "SUB":
        action.meal.amount -= 1;
        if (action.meal.amount === 0) {
          newCardData.items.splice(newCardData.items.indexOf(action.meal), 1);
        }
        newCardData.totalPrice -= action.meal.price;
        newCardData.totalAmount -= 1;
        newCardData.totalPrice -= action.meal.price;
        return newCardData;
      case "CLEAR":
        newCardData.items.forEach((item) => delete item.amount);
        newCardData.items = [];
        newCardData.totalAmount = 0;
        newCardData.totalPrice = 0;

        return newCardData;
      default:
        return state;
    }
  }
  
  
  
  const App = () => {
    //...
    let initalArgs = {
      items: [],
      totalAmount: 0,
      totalPrice: 0,
    }
    const [cardData, dispatchCardData ] = useReducer(reducerFn, initialArgs)
    
    
    
    return (
    	  return (
          <CardContext.Provider value={{ ...cardData, dispatchCardData}}>
            <FilterMeals onFilter={filterHandler} />
            <Meals meals={mealsData} clearable />
            <Cart />

          </CardContext.Provider>
  );
    )
  }
  
  
  
 // src/store/CardData.js
  
  const CardData = React.createContext({
    items: [],
    totalAmount: 0,
    totalPrice: 0,
    dispatchCardData: () => {}
  })
```

更新了以后, 点击新增/删除按钮, 数量会以2的倍数进行更新? 是因为我们在开发环境+严格模式下进行的开发.

```jsx
// index.js

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```


#### Reducer+immer
##### 注意:
* Reducer(reducerFn, initialArg)中, 如果initialArg是个对象, 则reducerFn中返回值必须是一个对象, 否则不会触发重新渲染
* 如果对象解构非常复杂, 每次返回都需要重写很浪费事件, 需要使用immutable相关库: `immer`
* **在 react 里，只要涉及到 state 的修改，就必须返回新的对象，不管是 useState 还是 useReducer。**

```js

const reducerFn = (state: Data, action: Action) {
	switch(action.type) {
		case 'add':
			state.result += action.num
			return state;
			// return {
			//	result: state.result + action.num
			//}
		case 'minus':
			return {
				result: state.result - action.num
			}
	}
}

```


```ts
//npm i immer -S
//使用方法简单, 只有一个produce的api

function reducer(state: Data, action: Action) {

    switch(action.type) {
        case 'add':
	        return produce(state, state => {
		        state.a.c.e += action.num
	        })
            //return {
            //    ...state,
            //    a: {
            //        ...state.a,
            //        c: {
            //            ...state.a.c,
            //           e: state.a.c.e + action.num,
            //        },
            //    },
            //}
    }
    return state;
}
```

### React.memo

#### 背景

> 对组件进行缓存

#### 介绍

是一个高阶组件,接受另一个组件做为参数,返回一个包装过的新组件. 新组件具有缓存功能.

<u>包装过后, 只有组件的props发生变化,才会触发组件的重新渲染,否则总是返回缓存中的结果.</u> 



```jsx
// src/App.js
const App = (props) => {
  console.log('app组件渲染了')

  const clickHandler = () => {
    console.log('点击了按钮')
    setCount(count + 1)
  }

  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h3>App组件</h3>
      <button onClick={clickHandler}>点击按钮{count}</button>
      <B />
    </div>
  );
};



import React from 'react';
import B from './B';


const A = (props) => {
  console.log('A组件渲染了')
  const [count, setCount] = React.useState(1);
  const addHandler = () => {
    setCount(preCount => preCount + 1)
  }
  const test = count % 4 === 0
  console.log('test', count, test)
  return (
    <>
    <h2>A组件 -- {count}</h2>
    <button onClick={addHandler}>增加</button>
    <button onClick={props.onAdd} >增加App</button>
    <B test={test} />
    </>
  );
};

export default React.memo(A)



// B.js
import React from 'react';

const B = (props) => {
  console.log('b组件渲染了')
  return (
    <>
    <div>这是B组件</div>
    <p>{props.test && 'haha'}</p>  //只有当props发生变化时, 才会重新渲染
    </>
  );
};

export default React.memo(B)
```





### React.useCallback()

#### 背景

> 一个钩子函数, 用来创建react中的回调函数. 其创建的回调函数不会总在组件重新渲染时重新创建.



设置一种场景, 使React.memo失效

```jsx
import React from 'react';
import B from './B';


const A = (props) => {
  console.log('A组件渲染了')
  const [count, setCount] = React.useState(1);
  const addHandler = () => {
    setCount(preCount => preCount + 1)
  }
  const test = count % 4 === 0
  return (
    <>
    <h2>A组件 -- {count}</h2>
    <button onClick={addHandler}>增加</button>
    <button onClick={props.onAdd} >增加App</button>  //调用App组件中的方法, 触发state的更新, A组件会重新渲染,即便使用了React.memo方法
    
    <B test={test} />
    </>
  );
};

export default React.memo(A)
```



使用useCallbact钩子来避免重新渲染问题:

```jsx
import React from 'react';
import A from './A';


const App = (props) => {
  console.log('app组件渲染了')

  const clickHandler = () => {
    console.log('点击了按钮')
    setCount(count + 1)
  }

  const [count, setCount] = React.useState(0);

  const onAddHandler = () => {
    setCount(count + 1)
  }
  return (
    <div>
      <h3>App组件 -- {count}</h3>
      <button onClick={clickHandler}>点击按钮{count}</button>
      <A onAdd={onAddHandler}/>
    </div>
  );
};

export default App;
```



#### 语法

```jsx
useCallback(cbFn, devArr)
```

1.回调函数

2.依赖数组

* 当依赖数组中的变量发生变化时, 回调函数才会执行, (包括空数组)
* 如果不指定依赖数组, 回调函数每次都会执行

一定要将回调函数中使用的所有变量都设置到依赖数组中(除了setState). 否则回调函数永远都是初始化哪个回调函数, 其作用域都会是初始化哪个作用域.



### Strapi了解使用

> [Strapi – 李立超 | lilichao.com](https://lilichao.com/?p=6156)



#### 是什么

> Strapi就是一个API的管理系统，通过Strapi我们可以直接以网页的形式去定义自己的API、包括设置模型、权限等功能。有了Strapi我们无需编写代码便可开发出功能强大的API。



#### 创建项目

```bash
//npm
npx create-strapi-app@latest my-project --quickstart

//yarn
yarn create strapi-app my-project --quickstart
```



#### 基本配置

##### 启动项目

> npm run develop



##### 配置显示语言

> src/admin/admin.example.js



### Fetch

#### fetch的两种使用方法

使用then,catch

```jsx

useEffect(() => {
  fetch("http://localhost:1337/api/student")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        // 抛出一个错误
        throw new Error('数据请求失败')
      })
      .then((res) => {
        setLoading(false)
        setStuData(res.data);
      })
      .catch((err) => {
        console.log("err>", err);
        setLoading(false)
        // 设置一个错误状态
        setError(err.message)
      });
}, [])
```



使用await

注意, useEffect中不能使用async函数

```jsx
// 如下使用方法会报错

useEffect(async() => {
  let res = await fetch("http://localhost:1337/api/students")
})

// 解决方案
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch("http://localhost:1337/api/students")
  }
  
  fetchData()
}, [])
```



#### 删除数据





### 自定义钩子

钩子函数只能放在组件内部或自定义钩子当中

Reaact中的钩子函数只能在函数组件或自定义钩子中调用. 当我们需要将react中的钩子函数提取到一个公共区域时,旧可以使用自定义钩子.

自定义钩子其实就是一个普通函数, 只是它的名字需要使用use开头.











### Redux

> "一个专为JS应用设计的可预期的状态容器"



#### 在网页中使用

##### 使用步骤

1. 引入redux
2. 创建reducer整合函数
3. 通过reducer对象创建store (容器)
4. 对store中的state进行订阅
5. 通过dispatch派发state的操作指令



state表示当前state, 可以根据这个state生成心的state

action是一个js对象, 他里面会保存操作的信息

* type表示操作的类型
* 其它需要传递的参数, 也可以在action中设置



##### 基本案例

state是一个原始值,但只是案例,也没有必要使用redux. 通常情况下redux中的state是一个对象.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.bootcdn.net/ajax/libs/redux/4.0.5/redux.min.js"></script>
  <title>Document</title>
</head>
<body>
  <button id="add">+</button>
  <span id="content">1</span>
  <button id="sub">-</button>
</body>
<script>
  const addNode = document.getElementById('add')
  const subNode = document.getElementById('sub')
  const contentNode = document.getElementById('content')
  let count = 1;

  const store = Redux.createStore(reducer, 1)

  function reducer(state, action) {
    switch (action.type) {
      case 'ADD':
        return state + 1
      case 'SUB':
        return state - 1
      default:
        return state
    }
  }

  store.subscribe(() => {
    count = store.getState()
    contentNode.innerHTML = count
  })

  addNode.addEventListener('click', () => {
    count += 1
    // contentNode.innerHTML = count
    store.dispatch({ type: 'ADD' })
  })

  subNode.addEventListener('click', () => {
    count -= 1
    // contentNode.innerHTML = count
    store.dispatch({ type: 'SUB' })
  })
</script>
</html>
```





#### 案例中存在的问题



##### 存在的问题

1. 如果state过于复杂, 将会非常难以维护
   1. 对state进行分组

2. state每次操作时,都是需要对state进行复制,然后再去修改

3. case后面的常量维护起来比较麻烦



##### 如何解决

使用Redux ToolKit(RTK). 另一种使用redux的方式.处理redux过程中的重复性工作,简化redux中的各种操作.



### RTK

> [Redux Toolkit（RTK） – 李立超 | lilichao.com](https://lilichao.com/?p=6210)

#### 是什么



##### react中引入Redux

```bash
//旧方式
npm install -S redux react-redux
yarn add redux react-redux

//新方式
npm install react-redux @reduxjs/toolkit -S
yarn add react-redux @reduxjs/toolkit


```



在src/store目录下创建相关配置文件, 我们以最简单的index.js为例:

```js

import {createSlice, configureStore} from '@redux/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {value:0},
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    }
  }
})

export const {increment, decrement} = counterSlice.actions;


//创建容器
const store = configureStore({
  reducer: {
    counter: counterSlice,reducer
  }
})

export default store
```



```jsx
//src/index.js

import store from './store'
import {Provider} from 'react-redux'

//...
root.render(
	<Provider store={store}>
  	<App/>
  </Provider>
)
```



```jsx
//src/App.js

import {useSelector, useDispatch} from 'react-redux'
import {increment, decrement} from '.store/index'

const App = () => {
  const counter = useSelector(state => state.value)
  const dispatch = useDispatch()
  
  return (
  	<>
    	<button onClick={dispatch(increment())}>+</button>
    	<span>{counter.value}</span>
    	<button onClick={dispatch(decrement())}>-</button>    
    </>
  )
}
```



#### 拆分RTK 

现在RTK相关代码都存储在src/store/index文件中, 如果切片一多起来的话, 会非常杂乱,action的名字也有可能会重复,所以需要进行切片文件化, 然后暴露导入到store中.

```md
- store
-- index.js
-- StudentSlice.js
-- SchoolSlice.js
```

根据上面的结构,可以看出来,需要在默认文件index.js中引入StudentSlice, SchoolSlice这两个独立切片. 那切片怎么暴露呢?

```js
//... 以schoolSlice.js为例

export [actionName1, actionName2] = SchoolSlice.actions;
export default SchoolSlice.reducer;
```



然后,在store仓库中导入切片,在组件中导入actions

```js
// src/store/index.js

import SchoolSlice from './SchoolSlice'

const store = configureStore({
  school: SchoolSlice,
  student: StudentSlice.reducer
})
```







### TRKQ概述

> [RTK Query – 李立超 | lilichao.com](https://lilichao.com/?p=6218)



#### 是什么

> RTK Query是一个强大的数据获取和缓存工具。它使我们不再需要自己编写获取数据和缓存数据的逻辑。



#### 安装

```bash
```







#### 使用

RTKQ中将一组相关功能统一封装到一个Api对象中，比如：都是学生相关操作统一封装到StudentApi中，关于班级的相关操作封装到ClassApi中。.以一个简单请求为例,来简单说明其使用步骤.

##### 创建Api切片

1. 调用`createApi`创建Api对象. 
   1. 注意在RTK中有俩版本: 一个位于`@reduxjs/toolkit/dist/query`下，一个位于`@reduxjs/toolkit/dist/query/react`下. react目录下的版本会自动生成一个钩子(useXxxQuery, useXxxMutation),方便我们使用api. (建议用这个)
2. createApi方法需要传入一个配置对象:
   1. reducerPath: 用来设置reducer的唯一标识，主要用来在创建store时指定action的type属性，如果不指定默认为api。
   2. 用来设置发送请求的工具，就是你是用什么发请求，RTKQ为我们提供了fetchBaseQuery作为查询工具，它对fetch进行了简单的封装，很方便，如果你不喜欢可以改用其他工 

3. fetchBaseQuery

   1. 简单封装过的fetch调用后会返回一个封装后的工具函数。需要一个配置对象作为参数，baseUrl表示Api请求的基本路径，指定后请求将会以该路径为基本路径。配置对象中其他属性暂不讨论。

4. endpoints

   1. endpoints是一个回调函数，可以用普通方法的形式指定，也可以用箭头函数。回调函数中会收到一个build对象，使用build对象对点进行映射。回调函数的返回值是一个对象，Api对象中的所有端点都要在该对象中进行配置。

   2. 对象中属性名就是要实现的功能名，比如获取所有学生可以命名为getStudents，根据id获取学生可以命名为getStudentById。属性值要通过build对象创建，分两种情况：

      查询：`build.query({})`

      增删改：`build.mutation({})`

   3. query也需要一个配置对象作为参数. 配置对象中同样有n个属性. 例如(目前只说这个)

      1. query方法: 返回子路径, 会和baseUrl拼接成一个完整的请求路径.


```js
// src/store/studentApi

import {createApi, fetchBaseQuery } from '@reduxjx/toolkit/dist/query/react'

export const studentApi = createApi({
  reducerPath: 'studentApi',   //标识符
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:1337/api/'
  }),
  endpoints(build) {
    return {
      getStudents: build.query({
        query() {
          return 'students'
        }
      }),
      //查询数据
      getStudentById: builder.query({
        query(id) {
          return `students/${id}`
        }
      }),
      //删除数据
      delStudent: builder.query({
        query(id) {
          return {
            url: `students/${id}`,
            method: 'delete'
          }
        }
      }),
      
      //新增数据
      //更新数据
    }
  }
})

export const {useGetStudentsQuery, useGetStudentById, useDeleteStudentMutation } = studentApi
```



#### 示例

对本地的strapi中的接口发一个请求, 将数据展示在页面上即可. 以便对RTKQ有个基本的使用了解.

* 新建一个请求切片,并暴露这个切片及请求的方法(以query方法为例)
* store容器中引入这个切片,并将切片在reducer中声明
* 在组件中引入请求的方法,解构出data, isFetching, isSuccess数据

useGetStudentsQuery()返参信息:

1. data – 最新返回的数据
2. currentData – 当前参数的最新数据. 它是需要考虑参数的存在,不像data永远是最新的数据. currentData就是最新参数的数据.
3. error – 错误信息
4. isUninitialized – 如果为true则表示查询还没开始
5. isLoading – 为true时，表示请求正在<u>第一次加载</u>
6. isFetching 为true时，表示请求正在加载
7. isSuccess 为true时，表示请求发送成功
8. isError 为true时，表示请求有错误
9. refetch 函数，用来重新加载数据,不会使用缓存.
10. status: "pending" //表示请求的状态









#### 缓存

##### 表现

发送第一次请求以后, 在默认60秒内,重新请求(不是刷新浏览器),不会产生请求. 这就是缓存功能. 通过配置项`keepUnusedDataFor`属性对缓存时间进行配置.

##### 配置

每次请求时,不使用缓存功能.

keepUnusedDataFor: 0 //设置数据缓存的时间 单位秒, 默认是60秒

```js
  getStudentById: binder.query({
    query: (id) => {
      return `students/${id}`
    },
    keepUnusedDataFor: 10
  })
```



#### useQuery返回值和参数了解



##### useQuery返参

1. data – 最新返回的数据
2. currentData – 当前参数的最新数据. 它是需要考虑参数的存在,不像data永远是最新的数据. currentData就是最新参数的数据.
3. error – 错误信息
4. isUninitialized – 如果为true则表示查询还没开始
5. isLoading – 为true时，表示请求正在<u>第一次加载</u>
6. isFetching 为true时，表示请求正在加载
7. isSuccess 为true时，表示请求发送成功
8. isError 为true时，表示请求有错误
9. refetch 函数，用来重新加载数据,不会使用缓存.
10. status: "pending" //表示请求的状态







##### useQuery参数 

两个参数,第一个参数是query方法中的参数, 第二个参数是一个对象, 通过该对象可以对请求进行配置.



```js
selectFromResult: result => result //执行useQuery返回的结果

selectFromResult: result => {
  if (result.data) {
    result.data = result.data.filter(xxxx)
  }
  return result
}

pollingInterval: 0 //设置轮询的间隔, 单位毫秒. 默认是0


skip: false //默认值false, 设置是否跳过当前请求

refetchOnMounteOrArgChange: false //设置是否每次都重新加载数据 默认false,正常使用缓存; true,每次重载数据; 数字,数据缓存时间(秒)

refetchOnFoucus: false //是否在重新获取焦点时获取数据. 生效前提是在store中设置 setupListeners(store.dispatch), 设置成功以后, 才会支持refetchOnFocus refetchOnReconnect

refetchOnReconnect: false //是否重新连接后重载数据 默认false




```



#### 数据标签

> 实现数据的自动刷新

tagTypes, 用来指定Api中的标签类型.

query查询中,需要声明的属性名称是: providesTags

mutation查询中需要声明的属性名是: invalidatesTags

















### ReactRouter@5

> 客户端路由





#### react router使用步骤

1. 引入`react-router-dom`包
2. 在index.js中引入BrowserRouter组件
3. 将BrowserRouter设置为跟路由

##### 安装

```bash
npm install react-router-dom@5 -S

yarn add react-router-dom@5
```



##### 引入

```jsx
import {BrowswerRouter as Router, Link, Route, Switch} from 'react-router-dom'


<Router>
	<App/>  
</Router>
```



##### 使用

```jsx
import { Route } from "react-router-dom";
import Home from "./Components/Home";
import List from "./Components/List";


function App() {
  return (
    <div className="App">
     app 

     <Route exact path='/' component={Home} />
     <Route exact path='/list' component={List} />
    </div>
  );
}

export default App;
```





#### 基本使用

将路由和组件进行映射:

* 使用router映射组件和地址
* router属性 
  * path: 映射url地址; 
  * componnet: 要挂载的组件.
  * exact 路径是否完整匹配



注意: 当router路径被访问, 其对应的组件就会自动挂载. 注意: 默认情况下route并不是严格匹配, 只要url地址的头部和path一致,组件就会挂载,不会插件子路径.



#### Link和NavLink(标签体组件)

在react router中, 不要使用a标签创建超链接. 因为a标签创建的超链接, 会自动向服务器发送请求重新加载页面.  可以使用Link组件创建超链接.

NavLink和Link相似, 但可以指定链接激活后的样式, 使用`activeClassName={classes.active}`, 同时也可以使用`activeStyle={}`的形式来代替activeName.

```jsx

import React from 'react';
import { Link, NavLink } from "react-router-dom";
import classes from "./LinkComponent.module.css";

const LinkComponent = (props) => {
  return (
    <div>
      {/* <Link to="/">首页</Link> */}
      <NavLink to="/about" activeClassName={classes.active}>关于</NavLink>
      <br/>
      {/* <Link to="/list">列表</Link> */}
      <NavLink to="/list" activeClassName={classes.active}>列表</NavLink>
    </div>
  );
};

export default LinkComponent;
```



##### NavLink组件

特殊版本的Link, 可以根据不同的情况设置不同的样式:

属性:

1. activeClassName —— 字符串 链接激活时的class
2. activeStyle —— 对象 链接激活时的样式
3. isActive —— 函数，可动态判断链接是否激活
4. style —— 函数，动态设置样式
5. className —— 函数，动态设置class值



#### 两种router

* BrowserRouter
* HashRouter



##### BrowserRouter

> 直接通过url地址进行组件的跳转, 使用过程和普通的url地址没有区别.



##### HashRouter

> 会通过url地址中的hash值来对地址进行匹配





##### 404问题

描述:

使用BrowserRouter进入某个子页面时, 刷新浏览器, 出现404报错. (本地启动了Nginx)



解决:

1.使用HashRouter, 服务器不会去判断hash值.

2.使用BrowserRouter,需要修改服务器配置.

```js
// nginx.conf

location /{
  root html;
  #index index.html index.htm;  //注释此行
  try_files $uri /index.html;   //新增此行
}
```



#### Route组件

Route组件是路由的映射组件，通过该组件将url地址和React组件进行映射，映射后当url地址变为指定地址时指定的组件就会显示，否则不显示。

```jsx
<Route path="/home" component={Home} />
<Route path="/about" component={About} />
```

Route组件可以设置以下几个属性

1. path
2. exact 设置路由地址是否完整匹配
3. strict 是否匹配一`/`结尾的路径, 默认是false
4. component 设置路径匹配后需挂载的组件,和route的标签体类似.与标签体组件不同, 会自动向组件中传递3个参数: match,location,history
5. render
6. children
7. location
8. sensitive



##### component组件

参数:

1. match对象 表示请求匹配的路径信息
   1. param 请求参数
   2. isExact 布尔值,请求路径是否完全匹配
   3. path 请求路径的规则
   4. 匹配到的url地址
2. location对象: 表示浏览器地址栏的信息
   1. pathname 请求的路径
   2. search 查询字符串
   3. hash hash字符串
   4. state 历史记录中的状态对象,可以用来在跳转时候传递数据
3. history对象 用来读取和操作浏览器的历史记录（页面跳转）等功能
   1. length 历史记录的数量
   2. action 当前历史记录的状态
   3. location location对象
   4. push 添加新的历史记录
   5. replace 替换历史记录
   6. go 跳转到指定记录
   7. goBack 回退
   8. goForwar 前进
   9. block 用来阻止用户跳转行为,可以用Prompt组件代替



```jsx
// src/Components/List.js

import React from 'react';

const List = (props) => {
  
  // props.history.replace({pathname: '/about'})
  // props.history.push({pathname: '/about'})
  // props.match.params.id <<=  <Route exact path='/list/:id' component={List} />

  // 
  return (
    <div>
      <h1>List</h1>
      <li>孙悟空</li>
      <li>孙悟空</li>
      <li>孙悟空</li>
      <li>孙悟空</li>
    </div>
  );
};

export default List;
```



##### render参数

指定要挂载的组件, 和component组件相比, 可以指定参数, 而component组件只能传入类,不能传入jsx. 

```jsx
<Route path="/student/:id" render={Student}></Route>
```

但是如果这样我们就无法访问使用component时传入props的几个参数,所以render需要改写成回调函数形式:

```jsx
<Route path="/student/:id" render={ () => <Student stu={...}/> }></Route>
```

如何访问ReactRouter传递的几个参数: 使用入参 

```jsx
<Route paht="/student/:id" render={(routePros => {
    return <Student {...routePros}/>
  })}
```



##### children属性

也可以用来指定被挂载的组件. 用法有两种:

1.和render类似, 传递回调函数. 

当children设置回调函数时候, 该组件无论路径是否匹配都会挂载 

```jsx
<Route exact path='/list' children={routeProps => <List {...routeProps} />} />
```

2.可以直接传递组件.但获取路由组件参数需要更换方式(需要使用钩子)

```jsx
<Route exact path='/list' children={<Student  stu={data}/> />

// <Student />
const match = useRouteMath()
const location = useLocation()
const history = useHistory()
const useParams()
                                    
                                    
```



另几种使用方式:

```jsx
// 类似props.children(插槽)使用方式

<Route path="/student/:id">
	<Student />
</Route>



// 

<Route path="/sudent/:id">
	{routeProps => <Student {...routeProps}/>}
</Route>
```



#### 路由嵌套

简单实现路由嵌套示例

```jsx

// src/App.js

function App() {
  return (
  	<div>
    	<Route to="/about">
      	<About />
        <Route path="/about/hello">  //嵌套
        	<Hello />
        </Route>
      </Route>
    </div>
  )
}

// src/Components/About.js 则在父组件中定义嵌套组件

function About() {
  return (
  	// ...
    <Route path="/about/hello">
    	<Hello />
    </Route>
  )
}
```



嵌套路由动态设置渲染路径

```jsx
// src/Components/About.js 则在父组件中定义嵌套组件

function About() {
  const {path} = useRouteMatch()
  
  return (
  	// ...
    <Route path=`/${path}/hello`>
    	<Hello />
    </Route>
  )
}
```



#### Prompt组件

> 页面跳转之前, 提示组件

##### 属性

1. message 字符串/函数，设置离开前显示的提示信息
2. when布尔值，设置是否显示提示



基本使用

```jsx

const [isPrompt, setIsPrompt] = useState(false)
return (
	<Prompt when={isPrompt} message={'将要离开页面, 缺人吗?'}>
  	<input type="text" onChange={e=>setIsPrompt(e.target.value.trim())} />
  </Prompt>
)
```





#### Redirect组件

> 将请求重定向到一个新的位置，经常用来进行权限的处理。

属性：

1. to —— 重定向的目标地址，可以是一个字符串也可以是一个对象
2. from —— 需要重定向的地址
3. push —— 布尔值，是否使用push方式对请求进行重定向. 

例如：当用户已经登录时则正常显示组件，用户没有登录时则跳转到登录页面。

```jsx
{isLogin && <SomeAuthComponent/>}
{!isLogin && <Redirect to={"/login"}></Redirect>}


// 访问home页时,自动跳转到about页
<Redirect from={'/home'} to={'/about'} />
```







### ReactRouter@6

#### 安装

```bash
npm install react-router-dom@6 -S
```



#### 基本使用

两种router(hash, browser)标签和5相同



#### `<Route>基本使用`

和版本5相比, 需要使用Routes组件进行包裹. element属性的值是一个jsx内容,可以传递内容.

```jsx

import React from "react";

import Home from "./Components/Home";
import List from "./Components/List";
import { Route, Routes } from "react-router-dom";
function App() {
  let data = ['1']
  return (
    <div>
      app
      <Routes>
        <Route path="/" element={<Home data={data}/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/" element={<List/>} />  // 放在这个位置是,失效
      </Routes>
      <Routes>
        <Route path="/" element={<List/>} />
      </Routes>
    </div>
  );
}

export default App;
```





#### router的参数

```js
  const { id } = useParams();
  console.log("id>", id);

  const location = useLocation(); //获取当前地址信息 和v5打印结果一致
  console.log("location>", location);
  /**
   * {
    "pathname": "/list/2",
    "search": "",
    "hash": "",
    "state": null,
    "key": "default"
}
   */

  const match = useMatch("/list/:id"); //用来检查当前url是否匹配某个路由, 如果匹配返回一个对象,不匹配返回null

  console.log("match>", match);
  /**
 * {
    "params": {
        "id": "2"
    },
    "pathname": "/list/2",
    "pathnameBase": "/list/2",
    "pattern": {
        "path": "/list/:id",
        "caseSensitive": false,
        "end": true
    }
}
 */


  //获取一个页面跳转的函数 nav('/about') 默认push方式, 替换方式 nav('/about', {replace: true})
  const nav = useNavigate() 
```



#### 路由的嵌套

v6中的路径匹配默认是完全匹配

```jsx
// 在About组件中嵌入List组件

//About组件
import React from "react";
import List from "./List";
import { Route, Routes } from "react-router";

const About = (props) => {
  return (
    <>
      <h2>About</h2>
      <hr />
      <Routes>
        <Route path={"list"} element={<List />} />
      </Routes>
    </>
  );
};

export default About;


//App组件
function App() {
  let data = ['1']
  return (
    <div>
      app
      <Routes>
        <Route path="/" element={<Home data={data}/>} />
       <Route path="/about/*" element={<About/>} />  //<- 注意此处, about之后添加了通配符
       <Route path="/list/:id" element={<List/>} />
      </Routes>
      <Routes>
        <Route path="/" element={<About/>} />
      </Routes>
    </div>
  );
}

export default App;
```



上面是一种方案, 缺点是繁琐.  既要在父组件中引入嵌套的组件,还要声明父组件的路径声明. 可以使用`Outlet`组件来表示嵌套路由:

```jsx
//App组件
function App() {
  let data = ['1']
  return (
    <div>
      app
      <Routes>
        <Route path="/" element={<Home data={data}/>} />
       <Route path="/about/*" element={<About/>}>   // <- 注意此处
       	<Route path="hello" element={<Hello/>} 
       </Route>
       <Route path="/list/:id" element={<List/>} />
      </Routes>
      <Routes>
        <Route path="/" element={<About/>} />
      </Routes>
    </div>
  );
}

export default App;
         
```

使用`Outlet`组件进行匹配:

```jsx
//App组件
function App() {
  let data = ['1']
  return (
    <div>
      app
      <Routes>
        <Route path="/about/" element={<About />}>
          <Route path="hello" element={<Hello />} />  
        </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;

// About组件 使用Outlet组件进行组件接收

navigation

```



#### Navigate组件

> 用来跳转页面, 默认使用push方法, 新增一条历史记录. 可以添加'replace'属性



```jsx

<Navigate to='/student/1' />
```



#### NavLink组件

组件属性:

* style  回调函数使用形式,入参是一个对象,属性为`isActive`,布尔值.
* to 跳转目标路径.默认push方法

```jsx
<NavLink to="/student/2">学生</NavLink>

<NavLink style={(obj) => {}} to="/student/2">学生</NavLink>
```



### 路由案例-权限

#### token获取/存储/自动登出

流程介绍: 

1. 首先需要一个组件来获取用户输入的用户名密码,需要提供登录/注册接口
2. 使用RTKQ来提供登录/注册接口,获取用户信息
3. 使用redux切片来持久化存取或删除用户信息,并提供存储/删除用户信息的方法









#### 服务器验证

> 前端请求时候需要在请求头中添加`Authorization: token`信息, 如何添加呢?
>
> 需要在RTKQ中统一配置请求头

```js
const xxxApi = createApi({
  renderPath: 'xxxApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:1337/api/',
    //统一设置请求头
     prepareHeaders(headers, { getState }) {
      // 获取用户token 如何从state中获取? 第二个参数
      let token = getState().auth.token
      if (token) {
          headers.set('Authorization', token);
      }
      return headers
  	}
  })
})
```





## hooks介绍

### useMemo

> useMemo和useCallback十分相似，useCallback用来缓存函数对象，useMemo用来缓存函数的执行结果。在组件中，会有一些函数具有十分的复杂的逻辑，执行速度比较慢。闭了避免这些执行速度慢的函数返回执行，可以通过useMemo来缓存它们的执行结果，像是这样：

```js
const result = useMemo(()=>{
    return 复杂逻辑函数();
},[依赖项])
```

useMemo中的函数会在依赖项发生变化时执行，注意！是执行，这点和useCallback不同，useCallback是创建。执行后返回执行结果，如果依赖项不发生变化，则一直会返回上次的结果，不会再执行函数。这样一来就避免复杂逻辑的重复执行。

useMemo也能缓存组件:

```js
const someEle = useMemo(() => {
  return <Som a={a} b={b} />
}, [a,b])


```


### forwardRef

#### **概述**
> 把 ref 从子组件传递到父组件, 把组件内的 ref 转发一下

* 被 forwardRef 包裹的组件的类型是 ==React.forwardRefRenderFunction==

```ts
//App6.tsx

const Guang: React.ForwardRefRenderFunction<HTMLInputElement> = (props, ref) => {
  return (
    <div>
      <input ref={ref}></input>
    </div>
  );
};

const WrappedGuang = React.forwardRef(Guang);

function App() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    console.log("ref", ref.current);
    ref.current?.focus();
  }, []);
  return (
    <div className="App">
      <WrappedGuang ref={ref} />
    </div>
  );
}

export default App;

```


#### React.forwardRefRenderFunction
```ts
interface ForwardRefRenderFunction<T, P = {}> {
	(props: P, ref: ForwardedRef<T>): ReactNode;
	/**
	 * Used in debugging messages. You might want to set it
	 * explicitly if you want to display a different name for
	 * debugging purposes.
	 *
	 * Will show `ForwardRef(${Component.displayName || Component.name})`
	 * in devtools by default, but can be given its own specific name.
	 *
	 * @see {@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}
	 */
	displayName?: string | undefined;
	/**
	 * Ignored by React.
	 * @deprecated Only kept in types for backwards compatibility. Will be removed in a future major release.
	 */
	propTypes?: any;
}
```




### useImperativeHandle
##### 概述
* 在React中可以通过forwardRef来指定要暴露给外部组件的ref
* 

```js

//暴露Some组件中某个ref

const Some = React.forwardRef((props, ref) => {
  
  const h2Node = useRef()
  
  return (
  	<div>
    	<h2 ref={ref}>Some</h2>
      <h2 ref={h2Node}>Some组件内部的Dom引用</h2>
    </div>
  )
})

//在父组件中获取Some组件的引用
function App() {
  const someRef = useRef()
  useEffect(() => {
		console.log(someRef.current.innerText)
	})
  
  return (
  	<div>
    	<Some ref={someRef} />
    </div>
  )
}
```

以上使用方式耦合度高,不好维护. 那么如何使用这个方法呢? 使用`useImperativeHandle`

通过useImperativeHandle可以手动的指定ref要暴露的对象,回调函数的返回值一般是一个对象包含的方法.

```js
//Some组件
const Some = React.forwardRef((props, ref) => {
  
  const inputRef = React.useRef()

  React.useImperativeHandle(ref, () => ({
    changeInputVal: (val) => {
      inputRef.current.value = val
    }
  }))
  
  return (
  	<div>
      <h2 ref={ref}>Some --</h2>
      <input type='text' ref={inputRef} />
    </div>
  )
})

//App组件
function App() {
  console.log("app组件渲染了>");
  let [count, setCount] = React.useState(1);

  const someRef = React.useRef();

  React.useEffect(() => {
    someRef.current.changeInputVal(count);  //调用Some组件中暴露的方法
  });

  return (
    <div className="App">
      <h1>App</h1>
      <h2>count: {count}</h2>

      <button onClick={() => setCount((count) => count + 1)}>点我</button>

      <Some ref={someRef} />
    </div>
  );
}

export default App;
```



#### 3个effect

> [关于Hook – 李立超 | lilichao.com](https://lilichao.com/?p=6193)

React18中useEffect, useLayoutEffect差别很小, 只有在低版本中才有明显区别. 

![ababab](./assets/20220622111732278.png)







#### useDebugValue

> 给钩子设置标签,搭配浏览器插件来查看钩子. 使用场景较少.





#### useDeferredValue

> useDeferredValue用来设置一个延迟的state，比如我们创建一个state，并使用useDeferredValue获取延迟值：



当设置了延迟值后, 每次state修改时候都会触发两次重新的渲染.

这两次执行对于其它的部分没有区别,但是延迟至两次执行的值都不同.

第一次执行时, 延迟值是state的旧值, 第二次执行时,延迟值是state的新值.

延迟值, 总会比原版state,慢一步更新.

```js
const [queryStr, setQueryStr] = useState('');
const deferredQueryStr = useDeferredValue(queryStr);



```

使用场景: 当多个组件依赖一个state时候, 组件可能会互相影响,一个组件卡顿,会导致所有组件卡顿. 此时就可以使用延迟值

```js
//list.js
import React from 'react';

const list = Array.from(Array(100)).map((item,index)=> '学生'+(index+1))

const List = (props) => {
  console.log('props>', props)

    let begin = Date.now();
  while(1){
    if (Date.now() - begin > 3000) {
      break;
    }
  }


  const stuList = list.filter(item => item.indexOf(props.inputVal) !== -1)
  return (
    <div>
      <h2>List</h2>
      {
        stuList.map(item => <li key={item}>{item}</li>)
      }
    </div>
  );
};

export default React.memo(List);


//app.js
import React from "react";
import List from "./List";
import {useDeferredValue} from 'react'

function App() {
  const [inputVal, setInputVal] = React.useState("");

  const deferredInputVal = useDeferredValue(inputVal)
  return (
    <div className="App">
      <h2>App</h2>
      <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
      <List inputVal={deferredInputVal} />
    </div>
  );
}

export default App;
```





#### useTransition



采用两个state,理论上隔离了input输入框和子组件接收的值,输入框应该输入即显示,子组件应该延迟显示.

但是没有. 还是受到inputVal2的影响.

```js
import React from "react";
import List from "./List";
import {useDeferredValue} from 'react'

function App() {
  const [inputVal, setInputVal] = React.useState("");
  const [inputVal2, setInputVal2] = React.useState("");

  const changeHandler = (e) => {
    setInputVal(e.target.value);
    setInputVal2(e.target.value);
  }

  return (
    <div className="App">
      <h2>App</h2>
      <input type="text" value={inputVal} onChange={changeHandler} />
      <List inputVal={inputVal2} />
    </div>
  );
}

export default App;


//List.js
同上
```

使用startTransition, 其回调函数中设置的setState会在其它setState生效后才执行.

```js
import React from "react";
import List from "./List";
import {useDeferredValue} from 'react'

function App() {
  const [inputVal, setInputVal] = React.useState("");
  const [inputVal2, setInputVal2] = React.useState("");

  const changeHandler = (e) => {
    setInputVal(e.target.value);
    startTransition(() => {
      setInputVal2(e.target.value);
    })
    
  }

  return (
    <div className="App">
      <h2>App</h2>
      <input type="text" value={inputVal} onChange={changeHandler} />
      <List inputVal={inputVal2} />
    </div>
  );
}

export default App;
```

除了上面的使用方法, 还可以使用useTransition

##### useTransition

> useTransition会返回一个数组，数组中有两个元素，第一个元素是isPending，它是一个变量用来记录transition是否在执行中。第二个元素是startTransition，它是一个函数，可以将setState在其回调函数中调用，这样setState方法会被标记为transition并不会立即执行，而是在其他优先级更高的方法执行完毕，才会执行。

```js
// isPending, 执行startTransition时为true, 执行完成为false


```



#### useId

> 生成唯一id，使用于需要唯一id的场景，但不适用于列表的key。


#### 总结
- **useState**：状态是变化的数据，是组件甚至前端应用的核心。useState 有传入值和函数两种参数，返回的 setState 也有传入值和传入函数两种参数。
    
- **useEffect**：副作用 effect 函数是在渲染之外额外执行的一些逻辑。它是根据第二个参数的依赖数组是否变化来决定是否执行 effect，可以返回一个清理函数，会在下次 effect 执行前执行。
    
- **useLayoutEffect**：和 useEffect 差不多，但是 useEffect 的 effect 函数是异步执行的，所以可能中间有次渲染，会闪屏，而 useLayoutEffect 则是同步执行的，所以不会闪屏，但如果计算量大可能会导致掉帧。
    
- **useReducer**：封装一些修改状态的逻辑到 reducer，通过 action 触发，当修改深层对象的时候，创建新对象比较麻烦，可以结合 immer
    
- **useRef**：可以保存 dom 引用或者其他内容，通过 xxRef.current 来取，改变它的内容不会触发重新渲染
    
- **forwardRef + useImperativeHandle**：通过 forwardRef 可以从子组件转发 ref 到父组件，如果想自定义 ref 内容可以使用 useImperativeHandle
    
- **useContext**：跨层组件之间传递数据可以用 Context。用 createContext 创建 context 对象，用 Provider 修改其中的值， function 组件使用 useContext 的 hook 来取值，class 组件使用 Consumer 来取值
    
- **memo + useMemo + useCallback**：memo 包裹的组件只有在 props 变的时候才会重新渲染，useMemo、useCallback 可以防止 props 不必要的变化，两者一般是结合用。不过当用来缓存计算结果等场景的时候，也可以单独用 useMemo、useCallback




### hooks闭包陷阱
> [React 通关秘籍 - zxg_神说要有光 - 掘金小册](https://juejin.cn/book/7294082310658326565/section/7298292751051784230?enter_from=course_center&utm_source=course_center)



#### 1.是什么
> 闭包陷阱就是 effect 函数等引用了 state，形成了闭包，但是并没有把 state 加到依赖数组里，导致执行 effect 时用的 state 还是之前的。


#### 2. 3种解决方案
* 使用setState函数形式或者用 useReducer，直接 dispatch action
* 把使用到的state添加到useEffect依赖数组种
* 使用useRef保存每次渲染的值,用的时候从ref.current种取


#### 3.其它
> 关于要不要在渲染函数里直接修改 ref.current，其实都可以，直接改也行，包一层 useLayoutEffect 或者 useEffect 也行。

## 实例

### 0.React中如何写Typescript类型(未完成)
> [React 通关秘籍 - zxg_神说要有光 - 掘金小册](https://juejin.cn/book/7294082310658326565/section/7298568416409944101?enter_from=course_center&utm_source=course_center)

#### JSX的类型
* React 函数组件默认返回值就是 JSX.Element
* `JSX.Element`中Element的类型是: `interface Element extends React.ReactElement<any, any> {}`, 也就是`React.ReactElement`
* 在声明类型时,使用ReactElement来标识JSX类型
* JSX类型只能接收JSX类型, 如果变更类型例如数值/字符串/null等等,则需要将其类型更改为ReactNode类型
* 3个类型之间的关系: ReactNode > ReactElement > JSX



#### 函数组件的类型

* 函数组件的类型可声明为: `React.FunctionComponent<customProps>`



#### hook类型

* useEffect, useLayoutEffect没有类型参数
* useState一般使用推导的类型, 也可以手动声明类型
* useRef可以保存dom或其它内容,所以类型有两种
	* 引用dom时, 类型为`HTMLDivElement`, 初始值为null
	* 引用其它内容, 不能传null. (版本18, 19则没有这个报错
* useImperativeHandle: forwardRef 包裹的组件会额外传入 ref 参数，所以它不是 FunctionComponent 类型，而是专门的 ForwardRefRenderFunction 类型
* useReducer: 可以传一个类型参数也可以传两个
	* 当传一个的时候，是 Reducer<xx,yy> 类型，xx 是 state 的类型，yy 是 action 的类型
	* 当传了第二个的时候，就是传入的初始化函数参数的类型
* useCallback 的类型参数是传入的函数的类型
* useMemo 的类型参数是传入的函数的返回值类型
* useContext 的类型参数是 Context 内容的类型
* memo
	* 它可以直接用包裹的函数组件的参数类型
	* 也可以在类型参数里声明



![[App4.tsx]]







#### 参数类型


#### HTMLAttributes



#### EventHandler




### 1.复合组件
#### 1.来源
> https://mp.weixin.qq.com/s/7K_HXKmax-M0lEQMdKE45A

#### 2.作用
* 解决同一个 React 组件在不同场景下需要呈现完全不同的布局或样式

设想你在做一个通讯录管理应用，你会遇到：
* 在单独的页面编辑联系人信息。
* 在模态框（Modal）中编辑联系人信息。

尽管这两种界面拥有类似的输入框、保存/取消按钮和标题，但布局却完全不同：
* 页面模式：整页布局，标题和按钮位于顶部区域。
* 模态框模式：紧凑布局，需遵循模态框的样式限制。

过去，你可能会选择：
* 创建两个单独的组件，产生大量重复代码。
* 创建一个复杂的组件，根据传入的属性条件渲染。
但以上方式都存在缺陷，代码难以维护且扩展性差。


#### 3.复合组件(Compound Components)模式

> **复合组件模式** 是一种组合式的组件设计方法。你会创建一个父组件管理状态和行为，并暴露一系列子组件用于渲染不同的 UI 部分。

你可以将它理解为类似于 HTML 的 `<select>` 和 `<option>`，各个组件共同协作，但具体排列方式可以自由组合。


**实现复合组件的核心要素**
* 使用 Context 共享状态。
* 父组件管理逻辑并暴露给子组件。
* 子组件通过 Context 消费共享状态



**代码示例**
<iframe src="https://codesandbox.io/embed/md7rp7?view=editor+%2B+preview&module=%2Fsrc%2Fcomponents%2FModal.tsx&hidenavigation=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react-1-复合组件"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>




### 2.受控组件和非受控组件

#### 是什么
> 受控和非受控组件的核心区别在于, **谁持有并管理最终的状态值​**

|模式|数据管理权|数据更新触发方|典型代码特征|
|---|---|---|---|
|​**​受控组件​**​|父组件/外部代码|父组件必须通过`onChange`处理|`<Component value={外部值} onChange={处理函数}/>`|
|​**​非受控组件​**​|组件内部|组件内部自主管理|`<Component defaultValue={初始值} ref={获取值}/>`|



#### **受控组件和非受控组件的比较**
##### 受控组件 (Controlled Components)

- **状态位置**：状态存在于父组件中
- **值传递**：父组件通过props（如`value`）将状态值传给子组件
- **更新机制**：子组件不直接修改状态，而是通过调用父组件传入的函数（如`onChange`）请求状态更新
- **数据流向**：父组件 → 子组件 → 事件回调 → 父组件更新状态 → 重新渲染子组件

简单来说：**"受控"意味着组件的值受外部（父组件）控制，组件自己不维护状态**

##### 非受控组件 (Uncontrolled Components)

- **状态位置**：状态存在于DOM元素内部，React组件不直接管理
- **初始值**：可通过`defaultValue`等属性设置初始值，之后由DOM元素自行管理
- **值获取**：父组件需要通过ref直接访问DOM元素来获取当前值
- **数据流向**：初始渲染时父组件可设置默认值，之后用户交互直接与DOM交互无需经过React状态系统

简单来说：**"非受控"意味着组件的值不受React状态控制，而是由DOM自己管理**


#### 代码展示
```tsx
// 受控组件示例
function Parent() {
  const [value, setValue] = useState("");
  
  return (
    <ControlledInput 
      value={value}                     // 父组件状态传递给子组件
      onChange={(newValue) => {         // 提供更新机制给子组件
        setValue(newValue);
      }} 
    />
  );
}

function ControlledInput({ value, onChange }) {
  // 没有内部状态！值完全由props控制
  return (
    <input 
      value={value}                     // 值由props决定
      onChange={(e) => {                // 变更时通知父组件
        onChange(e.target.value);
      }} 
    />
  );
}

// 非受控组件示例
function Parent() {
  const inputRef = useRef(null);
  
  const handleSubmit = () => {
    // 需要值时，直接从DOM获取
    console.log(inputRef.current.value);
  };
  
  return (
    <>
      <UncontrolledInput 
        ref={inputRef}                  // 用ref获取DOM引用
        defaultValue="初始值"            // 只提供初始值
      />
      <button onClick={handleSubmit}>提交</button>
    </>
  );
}

function UncontrolledInput(props, ref) {
  // 内部无需React状态，直接使用DOM管理值
  return <input ref={ref} defaultValue={props.defaultValue} />;
}
UncontrolledInput = forwardRef(UncontrolledInput);
```

[[App82.tsx]]



#### 日历组件(受控+非受控)
以日历组件为模板, 来展示两种模式.

[[reactdemo/src/App10.tsx]]


[[reactdemo/src/App12.tsx]]



