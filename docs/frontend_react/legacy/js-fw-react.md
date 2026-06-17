[TOC]





## 1221 react



```
live reload enabled 实时刷新 
```



### 其他

```
1. script标签type类型为text/babel

代码中添加debugger,浏览器运行后,可在source栏中进入调试模式
```



### React简介

#### 官网

```
英文: https://reactjs.org/
中文: https://react.docschina.org
```

#### 介绍

```
1.用于动态构建用户界面的JS库(只关注视图)
2.由Facebook开源

是什么?
1.发送请求获取数据
2.处理数据(过滤,整理格式等)
3.操作DOM呈现页面
```

#### 特点

```JS
1.声明式编码   
//之前的操作编码方式叫做命令式编码,不能少一步.声明一下,其他不用管,需学会其语法.
2.组件化编码   //函数式组件 类式组件
3.React Native编写原生应用
4.高效(Diffing算法)
```

#### 高效原因

```
1.使用虚拟(virtual)DOM, 不总是直接操作页面真实DOM
2.DOM Diffing算法,最小化页面重绘.
```



### 基本使用

#### 相关JS库

```
//bootcdn.cn
//CDN使用说明:
1.使用16系列版本(16.14);
2.下载网址中不能有cjs(CommonJS),应使用包含umd的链接; umd表示符合es6语法规范.
3.使用/react.development.js 开发讲课中使用//react.development.min.js是压缩后的

老师资源本地下载文件说明:
1.react.development.js React核心库
2.react-dom.development.js 提供操作DOM的react扩展库
3.babel.min.js 解析JSX语法代码转换为JS代码的库.

//官网
https://react.docschina.org/docs/cdn-links.html
```

#### CDN库

```
//bootcdn.cn
```







#### hello_React

```html
<head>
    <meta charset='UTF-8'>
    <title>hello_react</title>
    <!-- 引入React核心库 -->
    <script type='text/javascript' src='../js/react.development.js'></script>
    <!-- 引入react-dom, 用于支撑react操作DOM -->
    <script type='text/javascript' src='../js/react-dom.development.js'></script>
    <!-- 引入babel, 用于将jsx转换为js -->
    <script type='text/javascript' src='../js/babel.min.js'></script>
</head>
<body>
    <!-- 准备好容器 -->
    <div id='test'></div>
    
    <script type='text/babel'> /* 此处必须写成babel */
    	//1.创建一个虚拟DOM
    	let VDOM=<h1>hello, React</h1> //此处一定不要加引号,因为不是字符串,是虚拟DOM
    	//2.让React将虚拟DOM(VDOM)转为真实DOM,渲染到页面  //渲染虚拟DOM
    	ReactDOM.render(VDOM, document.querySelector('#test'))//这行代码不是追加的动作,是替换的动作.如果再有一行ReactDOM.render(),后面的会替换前面的.
    	
    </script>
</body>
```



#### 虚拟DOM的2种创建方式

```markdown
//1.使用jsx语法创建虚拟DOM  虚拟DOM中可以添加小括号来包裹多行语句
//2.使用js语法创建虚拟DOM
```



#### jsx介绍

```
1.jsx的出现就是为了让程序员更加方便的创建虚拟DOM
2.jsx最终经过babel的编译，变成了最原始的js写法

- 介绍:
 -全称:JavaScript XML
 -react定义的一种类似于XML的JS扩展语法:JS+XML本质是React.createElement(component, props, ...childred)方法的语法糖(简化版).
 
- 作用:用来简化创建虚拟DOM
1.写法: var ele=<h1>hello jsx</h1>
2.注意: 它不是字符串,也不是HTML/XML标签;它最终产生的就是一个JS对象.
3.标签名任意:HTML标签或其他标签
4.标签属性任意:html标签属性或其它
5.基本语法规则:
5.1 遇到'<'开头的代码, 以标签的语法解析: html同名标签转换为html同名元素, 其它标签需要特别解析
5.2 遇到'{' 开头的代码，以JS语法解析: 标签中的js表达式必须用{ }包含

6.babel.js的作用
6.1浏览器不能直接解析JSX代码, 需要babel转译为纯JS的代码才能运行
6.2只要用了JSX，都要加上type="text/babel", 声明需要babel来处理

7.渲染虚拟DOM元素
7.1 语法: ReactDOM.render(virtualDOM, containerDOM/容器)
7.2 作用: 将虚拟DOM元素渲染到页面中的真实容器DOM中显示
7.3 参数说明: 参数一,纯JS或jsx创建的虚拟dom对象; 参数二:用来包含虚拟DOM元素的真实dom元素对象(一般是一个div)
```





```html 
<title>使用JS语法创建虚拟DOM</title>
<!-- 引入react核心库 -->
<script type="text/javascript" src="../js/react.development.js"></script>
<!-- 引入react-dom -->
<script type="text/javascript" src="../js/react-dom.development.js"></script>

<div id='test'></div>
<script type='text/babel'>
	//1.创建虚拟DOM
	let VDOM=React.createElement('h1', {id:'atguigu'}, React.createElement('span', null, 'Hello React'));
	//2.渲染虚拟DOM到页面
	ReactDOM.render(VDOM, document.getElementById('test'));
</script>

<!--========================================== -->
React.createElement('标签', {标签属性:属性值}, 标签内容)
标签属性这个对象可以为null
标签内容需要加引号.如果里面有其他标签,需要接着创建虚拟DOM(再写React.createElement)
```



```html
<title>使用JSX语法创建虚拟DOM</title>
<!-- 引入react核心库 -->
<script type="text/javascript" src="../js/react.development.js"></script>
<!-- 引入react-dom -->
<script type="text/javascript" src="../js/react-dom.development.js"></script>
<!-- 引入babel, 将jsx转换为js -->
<script type="text/javascript" src="../js/babel.min.js"></script>

//创建一个容器
<div id='test'></div>

<script type='text/babel'>
	//1.创建一个虚拟DOM
	let VDOM=(
		<h1 id='atguigu'>
    		<span>hello,react</span>
    	</h1>);
   //2.用React将虚拟DOM转换为真实DOM,渲染到页面
   ReactDOM.render(VDOM, document.getElementById('test'));
    	
</script>
```





#### 虚拟DOM和真实DOM比较

```HTML
关于虚拟DOM和真实DOM
1.虚拟DOM比较“轻”，真实DOM比较“重”，因为虚拟DOM是React在用的,无需真实DOM上那么多的属性。
2.虚拟DOM最终一定会转为真实DOM放入页面


<script>
console.log(VDOM typeof); //object 
console.log(VDOM instanceof Object)//true
</script>    
```







### jsx的语法规则

```js
1.创建虚拟DOM, 外层不要加引号
2.标签中要混入JS表达式,需要使用{JS表达式} //表达式和语句的区别
3.标签中引入[内部样式]的类型要用className代替class
4.标签中的内联(行内)样式要用style={{color:'white',fontSize:'40px'}},对象里的属性名有中横线的需要转为小驼峰命名(不能有中横线)
5.只能有一个根标签(结束标签 可使用div标签包裹)
6.标签必须闭合
7.关于标签首字母
 7.1 若首字母小写,那么React就会去寻找html中与之同名的html标签.若找见,直接转为html同名元素;若未找见,报错.
 7.2 若首字母大写,那么React就会去寻找与之同名的组件.若找见,则使用组件;若未找见,报错.
8. 注释写法: {/*jsx*/} //使用
```





### JS表达式和语句比较

```HTML
https://www.cnblogs.com/ziyunfei/archive/2012/09/16/2687589.html

一定注意区分：【js语句(代码)】与【js表达式】
1.表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方
下面这些都是表达式：
(1). a
(2). a+b
(3). demo(1)
(4). arr.map() 
(5). function test () {}
2.语句(代码)：
下面这些都是语句(代码)：
(1).if(){}
(2).for(){}
(3).switch(){case:xxxx}

```



### jsx练习

```HTML
//div中插入一个列表

<div id='test'></div>
<script type='text/babel'>
	const data=['Angular', 'React', 'Vue'];
	//1.创建虚拟DOM
	let VDOM=(<div>
    	<h1>前端框架</h1>
    	<ul>
    		{data.map((item, index)=><li key={index}>{item}</li>)}
    	</ul>
    </div>)
    //2.让React将虚拟DOM转换为真实DOM,渲染页面 //渲染虚拟DOM到页面
    ReactDOM.render(VDOM, document.querySelector('#test'));
</script>
```





## 1222

### 模块与组件,模块化与组件化

#### 模块

```
1.	理解：向外提供特定功能的js程序, 一般就是一个js文件
2.	为什么要拆成模块：随着业务逻辑增加，代码越来越多且复杂
3.  复用js, 简化js的编写, 提高js运行效率

```





#### 组件

```
- 定义:用来实现局部功能效果的代码和资源的集合(html/css/js/image等等)
- 原因: 界面功能更复杂
- 作用: 复用代码,简化项目代码,效率

- 注意事项:
1.组件名称首字母大写
2.虚拟DOM只能有一个根标签
3.虚拟DOM元素必须有结束标签
```



#### 模块化

```
应用的js都以模块来编写
```

#### 组件化

```
应用是以多组件的方式实现
```



### React面向组件编程

#### 使用react开发者工具调试

```
Chrome 扩展中添加
```



### 组件

#### 定义组件2种方式

```
函数式组件 //缺陷:不能有状态
类式组件  //推荐
```



#### 函数式组件

```html
//函数名称首字母大写,对应组件名称首字母大写
...
<div id='test'></div>
<script type='text/babel'>
	//1.定义一个组件(函数式)
	function Demo(){
		console.log(this); //此处的this是undefined，因为经过babel编译，开启了严格模式  缺点
		return <h1>我是用函数定义的组件（适用于【简单组件】的定义）</h1>
	}
	//2.渲染组件到页面
	ReactDOM.render(<Demo/>, docment.getElementById('test'));
</script>

<!--
//执行了ReactDOM.render(<Demo/>......后发生了什么？
1.React解析组件标签，寻找Demo组件的定义位置
2.React发现Demo组件是用函数定义的，随后React去直接调用Demo函数，将返回的虚拟DOM渲染到页面 
-->
```



#### 类组件

```html
...
<div id='test'></div>
<script type='text/babel'>
	//1.定义一个组件(类式)
	class Demo extends React.Component{
		render(){
			console.log(this);
			return <h1>我是用类定义的组件（适用于【复杂组件】的定义）</h1>
		}
	}
	//2.渲染组件到页面
	ReactDOM.render(<Demo/>, docment.getElementById('test'));
</script>

<!--
1.render方法放在哪里?   Demo的原型对象,供 实例使用
2.render中的this只谁?  Demo的实例对象(其他叫法:Demo组件实例对象, Demo组件对象(叫法模糊不准确)) //原因? 因为是底层自己带的,react解析后,创建一个实例对象来调用.
-->
```



##### 渲染类组件基本流程

```
执行ReactDOM.render后发生了什么?
1.React解析组件标签,寻找Demo组件的定义位置
2.React发现Demo组件使用类定义的,React创建了一个Demo组件的实例对象
3.通过实例对象去调用render方法
```



##### 类相关知识

```
1.类中的构造器不是必须要写的，如果想给实例添加一些自己独有的属性，那么就要写构造器；
2.如果A类继承了B类，且A类中写了构造器，那么在A类的构造器中必须调用super
3.类中的方法是放在类的原型对象上的，供实例使用，如果是通过实例调用的方法，那么方法中的this就是实例对象。
```



### 组件实例3大属性-state

#### 基本介绍

```HTML
1.state是组件对象的属性, 值是对象(可以包含多个key-value的组合)
2.组件被称为"状态机", 通过更新组件的state来实现对应页面的更新显示(重新渲染组件)
3.render方法中的this为组件实例对象,自定义方法中的this为undefined.
 解决:强制绑定this:通过函数对象bind(); 箭头函数
```



#### state案例-天气

```HTML
组件:简单组件,有状态组件. //如果组件没有状态(state),就是简单组件.
//类中函数(原型上的方法)中this的值为undefined的解决方法:bind,箭头函数
<!--第一版  初始化状态-->
<div id='test'></div>
<scirpt type='text/babel'>
	//定义一个组件
    class Weather extends React.Component{
    	constructor(props){ //因为是react调用的实例对象, 故添加构造器写法(参考文档)
    		super(props);
    		this.state={isHot: false}; //初始化状态
    	}
    	render(){
    		console.log(this);//this为实例化对象
    		const {isHot}=this.state;
    		return <h1>今天天气很{isHot?'炎热':'凉爽'}</h1>;
    	}
    }
    
    ReactDOM.render(<Weather/>, document.getElementById('test'));
</scirpt>
```



```js
//原生里事件绑定的3种方式
//btn.onclick=function(){}
//btn.addEventListener('click', ()=>{})
//<button id='btn' onlick="show()"></button> //注意引号
function show(){}
jsx语法中可以添加原生JS来,例如事件绑定

//<!--第二版 绑定click事件 -->
<scirpt type='text/babel'>
	//定义一个组件
    class Weather extends React.Component{
    	constructor(props){  
    		super(props);
    		this.state={isHot: false};  //给实例对象身上添加state属性的值
    	}
    	render(){
    		console.log(this); //实例对象
    		const {isHot}=this.state;
    		return <h1 id='h1'>今天天气很{isHot?'炎热':'凉爽'</h1>;
    	}
    }
    ReactDOM.render(<Weather/>, document.getElementById('teset'));    
	const h1=document.getElementById('h1'); //addEventListener react不推荐这两种方式
	h1.onclick=()=>{alert(1)}; //这种方法可以生效
</scirpt>

```



```js

//<!--第三版 绑定click事件-2 -->
<scirpt type='text/babel'>
	//定义一个组件
    class Weather extends React.Component{
    	constructor(props){  
    		super(props);
    		this.state={isHot: false};  
    	}
    	render(){
    		console.log(this);
    		const {isHot}=this.state;
    		return <h1 onClick={show}>今天天气很{isHot?'炎热':'凉爽'</h1>; 
            // onClick标准写法. 其值不能需要是函数,所以需要大括号来保存JS表达式
            //show函数不能有调用括号.jsx语法在解析时会直接调用.需要去掉.  jsx中的js表达式都会立即执行
            //如果show()形式,是把show()函数的返回值undefined作为点击回调
    	}
    }
    ReactDOM.render(<Weather/>, document.getElementById('teset')); 
	function show(){alert(1)}
</scirpt>

//如何验证jsx语法中js表达式会立即执行?
//将三元运算符的判断条件改为函数调用,然后更改函数的返回值true/false,页面上的结果相应的变化
...
return <h1 onClick={show}>今天天气很{getHot()?'炎热':'凉爽'</h1>; 
..
function getHot(){
    return true
}
```



```js
//类的大括号是没有作用域的

//<!--第四版 类中函数做回调this指向问题 -->
<scirpt type='text/babel'>
	//定义一个组件
    class Weather extends React.Component{
        //构造器
    	constructor(props){  
    		super(props);
    		this.state={isHot: false};  
    	}
        //必须要写的
    	render(){
    		console.log(this);
    		const {isHot}=this.state;
    		return <h1 onClick={show}>今天天气很{isHot?'炎热':'凉爽'</h1>;
    	}
    }
    ReactDOM.render(<Weather/>, document.getElementById('teset')); 
	show(){
        //1.获取isHot状态
        console.log(this);//this是谁? undefined. 函数中的this指向window,babel语法影响,为undefined.
        //2.取反赋值回去
    	}   
</scirpt>
```



```js

//<!--第四版 类中函数做回调this指向问题-2 -->
<scirpt type='text/babel'>
	//定义一个组件
    class Weather extends React.Component{
        //构造器
    	constructor(props){  
    		super(props);
    		this.state={isHot: false};  
    	}
        //必须要写的
    	render(){
    		console.log(this);
    		const {isHot}=this.state;
    		return <h1 onClick={this.show}>今天天气很{isHot?'炎热':'凉爽'</h1>;
            //运行之后显示,show is not defined. show方法在原型上,所以需要通过this访问
            //如果是this.show(),实例形式调用.那么show函数中this的值就是实例对象(谁调用函数,this指向谁)
            //react内部如何调用this.show,在内部指定了一个变量,直接指向show.当点击事件后react执行x(),同时类原型上的方法加上了严格模式,导致this丢失. 所以this是undefined.和babel暂时无关.
    	}
        //程序员根据业务逻辑自己定义的事件回调
        //show函数的位置: Weather的原型对象上,供实例对象使用
        //show中的this是谁? 此时的show函数,是作为点击事件的回调,根本就不是通过Weather的实例调用的,而且类中的方法开启了严格模式,所以this是undefined.
         show(){
        //1.获取isHot状态
        console.log(this); //运行之后显示undefined
        //2.取反赋值回去
    	}   
    }
    ReactDOM.render(<Weather/>, document.getElementById('teset')); 
</scirpt>
```







```js
//类中的this
//类中不能写什么代码?  例如console.log(9)
//类能写什么,4种? 赋值语句, 一般方法, 构造方法 静态属性. 其中赋值语句就是给实例自身添加的属性(赋值变量,函数, 函数就是方法)
<script type="text/javascript" >
			class Dog {
				constructor(name,age){
					this.name = name
					this.age = age
				}
				cry(){
					console.log(this); //输出是undefined
					console.log(`我的名字是:${this.name},我的年龄${this.age}`)
				}
			}
			const d = new Dog('旺财',4)
			const x = d.cry
			x() //此处属于cry的直接调用，类中所有定义的方法，浏览器在运行时，全都加上了use strict .//局部添加

			/* let obj = {
				a:1,
				b:2,
				c:function(){
					console.log(this)
				}
			}
			const y = obj.c
			y() */
</script>
```



```js
//<!--第5版 解决类中函数做回调this指向问题-3 -->
<scirpt type='text/babel'>
	//定义一个组件
    class Weather extends React.Component{
        //构造器
    	constructor(props){  
    		super(props);
    		this.state={isHot: false}; 
            //给实例自身添加一个同名的show方法,这个方法是根据原型上的show方法根据bind生成的,它的this没有问题.
            this.show=this.show.bind(this); //官网解决方案 给实例对象自身添加了一个show方法,且show方法中的this已经被更改为实例对象. 点击后不会再使用类原型上的show方法, 会使用实例对象自身身上的show方法
             
    	}
        //必须要写的
    	render(){
    		console.log(this);
    		const {isHot}=this.state;
    		return <h1 onClick={this.show}>今天天气很{isHot?'炎热':'凉爽'</h1>;   
    	}
         show(){ //
        //1.获取isHot状态
        console.log(this); 
        //2.取反赋值回去
    	}   
    }
    ReactDOM.render(<Weather/>, document.getElementById('teset')); 
</scirpt>
```



```js
//<!--第6版 setState使用 -->
<scirpt type='text/babel'>
	//定义一个组件
    class Weather extends React.Component{
        //构造器
    	constructor(props){  
    		super(props);
    		this.state={isHot: false};  
            this.show=this.show.bind(this); 
    	}
        //必须要写的
    	render(){
    		console.log(this);
    		const {isHot}=this.state;
    		return <h1 onClick={this.show}>今天天气很{isHot?'炎热':'凉爽'</h1>;   
    	}
         show(){ //
        //1.获取isHot状态
        console.log(this); 
        //2.取反赋值回去
        //注意:state不可以直接修改,需通过API修改
        //this.state.isHot=true; 更改state状态 语法错误
        const isHot=this.state.isHot;     
        this.setState({isHot: !isHot});
    	}   
    }
    ReactDOM.render(<Weather/>, document.getElementById('teset')); 
</scirpt>
```



```js
//组件类中自定义的事件回调,必须写成赋值语句+箭头函数.避免了this为undefined的问题.
//<!--第7版 简写state -->
<scirpt type='text/babel'>
	//定义一个组件
    class Weather extends React.Component{
        //初始化状态
    	state={isHot: false};  //构造器删除其他,只剩state状态赋值语句.
        //必须要写的
    	render(){
    		console.log(this);
    		const {isHot}=this.state;
    		return <h1 onClick={this.show}>今天天气很{isHot?'炎热':'凉爽'</h1>;   
    	}
        //箭头函数的this指向外层作用域.因为show外属于类,无法添加console.log(this)语句,根据箭头函数show中console.log(this)的结果倒推为箭头函数外部的this是实例对象   
        //改变this指向那句话删除了,所以无法读取this.state.
        //变为箭头函数的含义:给实例对象自身添加一个属性,名为show,值为函数. 
        //不能写为普通函数的原因(this的值为undefined).原因: 如果show为原型上的方法,自动开启严格模式;但现在是属性赋值形式,因为babel语法影响.       
        show=()=>{ 
        console.log(this); 
        const isHot=this.state.isHot;     
        this.setState({isHot: !isHot});
    	}   
    }
    ReactDOM.render(<Weather/>, document.getElementById('teset')); 
</scirpt>
```



### 组件实例3大属性-props



#### 基本介绍

```js
//专门收集从组件外部传入组件内部的属性
1.	每个组件对象都会有props(properties的简写)属性
2.	组件标签的所有属性都保存在props中

- 作用:
1.	通过标签属性从组件外向组件内传递变化的数据 //ReactDOM.render(<Person name='人物' age=18 gender='男性'/>, document....) 可以将组件标签中的属性传递到实例对象中的props属性当中.
2.	注意: 组件内部不要修改props数据???

```



#### 使用

```js
props传递属性:
分别传递 <Demo name='xxx' age={数字} />
批量传递 ...target

props属性修改方式:
直接赋值: name='yyy' 改变的是变量的值,而非props中的值.
错误方式: this.props.name='yyy'  props对象中的属性名值都是只读的,不能修改
```



```html
//通过组件标签向组件内传递属性
<div id='test'></div>
<div id='test2'></div>

<script type='text/babel'>
    //1.定义一个Person组件
    class Person extends React.Component{
        render(){
            let{name, age, sex}=this.props; 
        }
        return(){
            <ul>
                <li>姓名: {name}</li>
            	<li>性别: {sex}</li>
            	<li>年龄: {age}</li>
            </ul>    
        }
    }
    ReactDOM.render(<Person name='人物' age=18 gender='男性'/>,document.getElementById('test'));
    
<script>    
```



```js
//组件内部更改添加属性的值
<div id='test'></div>
<div id='test2'></div>

<script type='text/babel'>
    //1.定义一个Person组件
    class Person extends React.Component{
        render(){
            //const {name, age, sex}=this.props; 
        	//this.props.age=9;//修改属性后报错:因为props对象中的属性都是只读的
            
            let {name, age, sex}=this.props;
            age=9;
            return(){
                <ul>
                    <li>姓名: {name}</li>
                    <li>性别: {sex}</li>
                    <li>年龄: {age}</li>
                </ul>    
            }
        }
    }
    ReactDOM.render(<Person name='人物' age={18} gender='男性'/>,document.getElementById('test'));
	//如果直接写age=18会报错, 
    
<script>  

```



```html
//模拟请求后台数据, 代替组件标签内的属性
<div id='test'></div>
<div id='test2'></div>

<script >//type='text/babel'
    //1.定义一个Person组件
    class Person extends React.Component{
        
        render(){
            //const {name, age, sex}=this.props; 
        	//this.props.age=9;//修改属性后报错:因为props对象中的属性都是只读的
            
            let {name, age, sex}=this.props;
            age=9;
            return(){
                <ul>
                    <li>姓名: {name}</li>
                    <li>性别: {sex}</li>
                    <li>年龄: {age}</li>
                </ul>    
            }
        }
    }
	//分别传递标签属性
    ReactDOM.render(<Person name='人物' age={18} gender='男性'/>,document.getElementById('test'));
    //模拟数据
	const p1={name:'案例2', gender:'男', age:19;}
	//分别传递标签属性2
	ReactDOM.render(<Person name={p1.name} age={p1.age} gender={p1.gender}/>,document.getElementById('test'));
	//批量传递
    //在jsx中可以使用展开语法展开一个对象,但仅适用于传递标签属性
	ReactDOM.render(<Person {...p1}/>,document.getElementById('test'));
    //{...p1} 为什么没有报错? jsx语法中花括号内代表的模板语法的分隔符, 没有承接使用展开运算符后对象的花括号. 真正的js表达式是...p1.  由于引入了babel, 又处于react环境,设计上就是这么设计的.
<script> 
```





## 1223



### 组件3大属性-props

#### 对props进行限制

```js
通过类的静态属性设置
```



```js
1.内部读取某个属性值 this.props.name

2.对props中的属性值进行类型限制和必要性限制
 2.1 第一种方式: 15.5版本已弃用
 Person.propType={
     name:React.PropType.string.isRequired,
     age:React.PropType.number
 }
 2.2 第二种方式:使用prop-types库进行限制
在类的外部/函数式组件添加限制:
 Person.propTypes={
     name:PropTypes.string.isRequired, //如果没有传入,会报错,显示undefined
     age:PropTypes.number
 }
在类的内部: //推荐,实现组件化,避免全局污染
static.propTypes={
    name:PropTypes.string.isRequired,
    age: PropTypes.number
}

3.扩展属性:将对象的所有属性通过props传递 <Person {...person}/>
4.默认属性值:
 Person.defaultProps={
     age:18,
 }

5.组件类的构造函数
constructor(props){
    super(props)
    console.log(props);//打印所有属性
}

6.类式组件中,如果对props进行限制,如果有状态(默认值为空对象),状态是排在第一位的,props的限制则紧跟在状态state之后. 
```



#### prop-type包

```HTML 
//引入prop-type包, 用于对标签属性进行限制
//添加props属性限制和默认值设置(两种方式): 
类外部通过 compName.propTypes和compName.defaultProps
类内部通过static propTypes和static defaultProps

<head>
	<meta charset="UTF-8" />
	<title>对props进行限制</title>
	<!-- 引入react核心库 -->
	<script type="text/javascript" src="../js/react.development.js"></script>
	<!-- 引入react-dom，用于支撑react操作DOM-->
	<script type="text/javascript" src="../js/react-dom.development.js"></script>
	<!-- 引入babel，用于将jsx转为js -->
	<script type="text/javascript" src="../js/babel.min.js"></script>
	<!-- 引入prop-types，用于对标签属性进行限制 -->
	<script type="text/javascript" src="../js/prop-types.js"></script>

</head>
...
<script >//type="text/babel"
        class Person extends React.Component {
        	state={} //数据是第一位的
            static propTypes = {
                name: PropTypes.string.isRequired,
                age: PropTypes.number,
                sex: PropTypes.string
            }

            static defaultProps = {
                age: 18
            }
            render() {
                let { name, sex, age } = this.props
                return (
                    <ul>
                        <li>姓名：{name}</li>
                        <li>性别：{sex}</li>
                        <li>年龄：{age + 1}</li>
                    </ul>
                )
            }
        }
ReactDOM.render(<Person name="老刘" sex={9} />, document.getElementById('test'))
</script>
...
```



#### 函数式组件使用props

```HTML
<script >//type="text/babel"
	function Person(props){
		const {name,age,sex} = props
		return(
			<ul>
				<li>姓名：{name}</li>
				<li>性别：{sex}</li>
				<li>年龄：{age}</li>
    </ul>
		)
	}

	Person.propTypes = {
		name:PropTypes.string.isRequired,
		age:PropTypes.number,
		sex:PropTypes.string
	}

	Person.defaultProps = {
		age:18
	}

	ReactDOM.render(<Person name="老刘" sex="男" age={19}/>,document.getElementById('test'))

</script>
```







### 组件实例3大属性-refs

#### 字符串形式的ref

```HTML
//第一版: 通过在虚拟DOM中添加ref关键字(ref='字符串')的形式,将在实例对象中的refs属性中新增key:value的键值对的对象.
//形式: <input ref='input1' />
//存储节点的容器: this.refs



<script >//type="text/babel"
    class Demo extends React.Component{
        render(){
            return (
                <div>
                <input type="text" ref="input1"/>&nbsp;
                <button onClick={this.show}>点我提示左侧数据</button>&nbsp;
    			<input type="text" ref="input2" onBlur={this.show2} placeholder="失去焦点提示数据"/>
    </div>
    )
    }
    show = ()=>{
        // const {refs:{input1:{value:a}}} = this
        const {input1} = this.refs
        alert(input1.value)
    }

    show2 = ()=>{
        const {input2} = this.refs
        alert(input2.value)
    }
    }
    ReactDOM.render(<Demo/>,document.getElementById('test'))
</script>
```



#### 回调函数形式的ref

```js
//存储节点的容器: 实例this
//第二版

<script type="text/babel">
        class Demo extends React.Component {
            render() {
                return (
                    <div>{/*
            //回调形式:添加一个箭头函数(为什么是箭头函数,若是this.函数名的形式,还需要在render的同级添加一个相应的函数)
            //react调用了这个箭头函数.通过在函数体内添加console语句判断已经执行了.react解析执行
            //会收到一个参数,因为是react调用.通过写入参数x来打印其内容,是当前节点的内容. 一个参数,读取实参的第一个内容
            //其他:因为参数内容和个数的不确定,可以通过arguments打印读取全部参数内容.
                        {/*<input type='text' ref={(x)=>{console.log(x)}};*/}
                        <input type='text' ref={(c)=>{this.input1 = c}} />&nbsp;
                        <button onClick={this.show}>点我提示左侧数据</button>&nbsp;
                        <input type='text' ref={c => this.input2 = c} onBlur={this.show2} placeholder='失去焦点提示数据'/>
                    </div>
                )

            }
            show = () => {
                //可以看到在实例对象上添加了一个input1属性, 属性值为input标签(点击后直接会跳转到HTML中input标签位置)
                console.log(this);
                //语义化写法
                const {input1}=this;
                alert(input1.value)
                //没有语义的写法 不推荐
                //console.log(this.input1.value);
            }
            show2=()=>{
                const {input2}=this;
                alert(input2.value);
            }
        }
        ReactDOM.render(<Demo />, document.getElementById('test'));
    </script>
```





#### createRef形式的ref

```js 
//createRef创建ref容器
//存储节点的容器: container 容器结构(只绑定一个) 在实例对象中以对象形式表现:container:{current:节点名称}
//获取容器内容 container.current.value/或
//第三版
/*
container=React.createRef();
<input ref={this.container}/>

this.container.current.value
*/

<script type="text/babel">
	class Demo extends React.Component {
		container = React.createRef() //放在组件内部,实现集合化;避免变量污染全局
		container2 = React.createRef()//类中的赋值语句,是添加到实例对象上的.
		render() {
			return (
				<div>
					<input type="text" ref={this.container} />&nbsp;
					<button onClick={this.show}>点我提示左侧数据</button>&nbsp;
					<input type="text" ref={this.container2} onBlur={this.show2} placeholder="失去焦点提示数据" />
				</div>
			)
		}
		show = () => {
			alert(this.container.current.value)
		}

		show2 = () => {
			alert(this.container2.current.value)
		}
	}
	ReactDOM.render(<Demo />, document.getElementById('test'))
</script>
```



### 组件实例3大属性-总结

```js
1.state 
2.props 专门收集从组件外部传入组件内部的属性
3.refs 给节点打标识,拿到节点

// state 
//1个组件标签的情况下:
1.构造器调用了几次  1次
2.render调用了几次 1+n次    第一次是react解析,n次是外界调用的次数
3.自定义的函数调用了几次 n次  点几次调几次

//refs
选择使用的顺序:3->2->1
```





### 类式组件中的构造器-super+this

```js
1.类式组件中的构造器完全可以省略
2.若写了构造器，super必须调用，且需要在构造器中通过this.props取值，那么props要传给super
3.super()之前不能使用this,报错.但可以使用其他语句,例如console.log()

constructor(props){
    super()
    console.log(this.props) //super没有接受props,打印结果[可能]出现错误为undefined
}
```



### 构造器中this在super之后添加

```js
https://segmentfault.com/q/1010000019457421

子类实例的构建,基于父类实例,必须调用super之后,才可以使用this关键字,否则会报错.
```







### React中的事件处理

```js
1.	通过onXxx属性指定事件处理函数(注意大小写) 
1).React使用的是自定义(合成)事件, 而不是使用的原生DOM事件 ——————  为了更好的兼容性
2).React中的事件是通过事件委托方式处理的(委托给组件最外层的元素) ———————— 效率高
2.	通过[event.target]得到发生事件的DOM元素对象

//事件回调函数,接到的event是React自定义(封装)的事件对象,这个event拥有着和原生event同样的属性.但属性值都没有,用谁给谁.
```





### 收集表单数据

```
1.非受控组件:表单中的数据，在需要的时候，“现用现取” (通过ref获得到节点，进而访问到value值)
2.受控组件: 表单中输入类的DOM，随着用户的输入，将值收集到state中，那么就称为受控组件
2.0 发生事件的事件源和要操作的不是同一个事件源,获取输入值有2种方式:
 2.1 onChange
 2.2 ref打上标签节点

```



#### 非受控组件收集表单数据

```js
<script type="text/babel">
		/* 
			非受控组件：表单中的数据，在需要的时候，“现用现取” (通过ref获得到节点，进而访问到value值)
			//受谁控制? state 表单中的输入项要和state建立联系
		*/
			class Login extends React.Component{
				render(){
					return (
						<form onSubmit={this.handleLogin}>  //onSubmit事件
							用户名：<input type="text" ref={c => this.userNameNode = c}/><br/><br/>
							密码：<input type="password" ref={c => this.passwordNode = c}/><br/><br/>
							<button>登录</button>
						</form>
					)
				}
				handleLogin = (event)=>{
					event.preventDefault() //阻止提交之后浏览器自动刷新
					const {userNameNode,passwordNode} = this
					alert(`用户名是${userNameNode.value}，密码是${passwordNode.value}`)
				}
			}

			ReactDOM.render(<Login/>,document.getElementById('test'))
```





#### 受控组件收集表单数据

```js
//受控组件: 表单中输入类的DOM，随着用户的输入，将值收集到state中，那么就称为受控组件
//**** ref可以不写的情况: 发生事件的事件源和获取的就是一个
//但凡操作状态,需要初始化state

	<script type="text/babel">
		/* 
			受控组件：表单中输入类的DOM，随着用户的输入，将值收集到state中，那么就称为受控组件
		*/
		class Login extends React.Component {
			state = {
				username: '',
				password: ''
			}
			render() {
				return (
					<form onSubmit={this.handleLogin}>
						用户名：<input type="text" onChange={this.saveUsername} /><br /><br />
							密码：<input type="password" onChange={this.savePassword} /><br /><br />
						<button>登录</button>
					</form>
				)
			}

			//保存用户名到state中
			saveUsername = (event) => {
				this.setState({ username: event.target.value }) //setState不会造成无关数据的丢失 不覆盖只追加 提高效率
			}

			//保存密码到state中
			savePassword = (event) => {
				this.setState({ password: event.target.value })
			}

			handleLogin = (event) => {
				event.preventDefault()
				const { username, password } = this.state
				alert(`用户名是${username}，密码是${password}`)
			}
		}

		ReactDOM.render(<Login />, document.getElementById('test'))
	</script>
```



#### onChange

```

```







### 高阶函数和柯里化

#### 定义

```HTML
高阶函数：如果一个函数符合下面2个规范中的任何一个，那该函数就是高阶函数。
1.若A函数，接收的参数是一个函数，那么A就可以称之为高阶函数。
2.若A函数，调用的返回值依然是一个函数，那么A就可以称之为高阶函数。
常见的高阶函数有：Promise、setTimeout、arr.map()、bind等等

函数的柯里化：通过函数调用继续返回函数的方式，实现多次接收参数最后统一处理的函数编码形式。

<script>
function sum(a){
	return (b)=>{
		return (c)=>{
			return a+b+c
		}
	}
} 
</script>
```



#### 案例-收集表单数据

```js
<script type="text/babel">
    class Login extends React.Component {
        //初始化状态
        state = {
            username: '',
            password: ''
        }

render() {
    return (
        <form onSubmit={this.handleLogin}>
        用户名：<input type="text" onChange={this.saveFormData('username')} /><br /><br />
        密码：<input type="password" onChange={this.saveFormData('password')} /><br /><br />
        <button>登录</button>
		</form>
	)
}

saveFormData = (type) => {
    return (event) => this.setState({ [type]: event.target.value })
}

//登录按钮的回调
handleLogin = (event) => {
    event.preventDefault()
    const { username, password } = this.state
    	alert(`用户名是${username}，密码是${password}`)
		}
	}

	ReactDOM.render(<Login />, document.getElementById('test'))

</script>
```



#### 案例-收集表单数据-不用高阶&柯里化

```js
<script type="text/babel">
    class Login extends React.Component{
        //初始化状态
        state = {
            username:'',
            password:''
        }
	render(){
    return (
        <form onSubmit={this.handleLogin}>
        用户名：<input type="text" onChange={ event => this.saveFormData(event,'username') }/><br/><br/>
        密码：<input type="password" onChange={event => this.saveFormData(event,'password')}/><br/><br/>
        <button onClick={this.handleLogin}>登录</button>
		</form>
)
}
	saveFormData = (event,type)=>{
    	this.setState({[type]:event.target.value})
	}
//登录按钮的回调
handleLogin = (event)=>{
    event.preventDefault()
    const {username,password} = this.state
    alert(`用户名是${username}，密码是${password}`)
	}
}

ReactDOM.render(<Login/>,document.getElementById('test'))
</script>
```







## 1225



### React组件的生命周期-旧

#### 流程

```js
- 生命周期钩子/函数...

- 流程:
一.初始化阶段:由ReactDOM.render()触发,初次渲染
    1.constructor
	2.componentWillMount()
    3.render()
    4.componentDidMount()
    
二.更新阶段:由this.setState()或父组件重新render()触发    
	1.shouldComponentUpdate()
	2.componentWillUpdate()
	3.render()
	4.componentDidUpdate()
三.卸载组件,由ReactDOM.unmountComponentAtNode()触发
	1.componentWillUnmount()


四. React新的生命周期删除了componentWillMount, componentWillReceiveProps, componentWillUpdate
```





#### 组件生命周期图

![react生命周期(旧).png](https://i.loli.net/2020/12/25/veY9LbU1gQHo57n.png)



#### 案例-setState forceUpdate

```HTML
注意出翔:
1.React组件和自定义钩子要分开写,不要掺杂在一起
2.调用setState(),React会做两件事:1.更新state状态;2.调用render
3.使用强制更新this.forceUpdate(),钩子调用流程:
constructor=>componentWillUpdate=>render=>componentDidUpdate
3.1 阀门关闭后(shouldComponentUpdate返回false),forceUpdate()使用,再调用setState()后,state状态会改变,但组件只会运行should..Update, 没有也无法调用render
3.2 接上条.开发者工具中的state的值会改变,前提是先改变后打开.如果先打开,再改变,则不显示.//工具问题
```



```HTML
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>React生命周期(旧)</title>
		<!-- 引入react核心库 -->
		<script type="text/javascript" src="../js/react.development.js"></script>
		<!-- 引入react-dom，用于支撑react操作DOM-->
		<script type="text/javascript" src="../js/react-dom.development.js"></script>
		<!-- 引入babel，用于将jsx转为js -->
		<script type="text/javascript" src="../js/babel.min.js"></script>
	</head>
	<body>
		<div id="test"></div>
		
		<script >//type="text/babel"
			class Count extends React.Component{
				//构造器
				constructor(){
					console.log('constructor')
					super()
					this.state = {count:0}
				}

				//加按钮的回调
				add = ()=>{
					const {count} = this.state
					this.setState({count:count+1})
				}

				//卸载按钮的回调
				death = ()=>{
					ReactDOM.unmountComponentAtNode(document.getElementById('test'))
				}

				//强制更新一下
				must = ()=>{
					this.forceUpdate()
				}

				//组件将要挂载
				componentWillMount(){
					console.log('componentWillMount')
				}

				//组件挂载完毕
				/* 
					一般做一些初始化的事情：开启定时器、发送ajax请求、订阅消息等等
					只要写了这个组件,就相应的要写componentWillUnmount组件
				*/
				componentDidMount(){
					console.log('componentDidMount')
				}

				//组件将要卸载
				/* 
					一般做一些收尾的事情：关闭定时器、取消订阅消息等等
				*/
				componentWillUnmount(){
					console.log('componentWillUnmount')
				}

				//控制组件是否更新（该钩子可以进行组件的优化）
            	//可以写业务逻辑:例如单据审批
				shouldComponentUpdate(){
					console.log('shouldComponentUpdate')
					return false
				}

				//组件将要更新
				componentWillUpdate(){
					console.log('componentWillUpdate')
				}

				//组件更新完毕
				componentDidUpdate(){
					console.log('componentDidUpdate')
				}

				render(){
					console.log('render')
					return (
						<div>
							<h1>当前求和为：{this.state.count}</h1>	
							<button onClick={this.add}>点我+1</button>
							<button onClick={this.death}>点我卸载组件</button>
							<button onClick={this.must}>不加不减，就是强制掉一下render</button>
						</div>
					)
				}
			}
			
			ReactDOM.render(<Count/>, document.getElementById('test'));
```





#### 父子组件下的钩子调用

```
1.A是父组件,B是子组件.
2.在A组件中的jsx语法中添加B组件标签并传递props属性.
3.componentWillReceiveProps 第一次解析不执行
4.父子组件下的钩子调用都是放在子组件中
```



```js
class A extends React.Component {
    state = { carname: '阿特兹' }

    changeCar = () => {
        this.setState({ carname: '奔驰c63' })
    }

    render() {
        const { carname } = this.state
        return (
            <div className="a">
            <h3>我是A组件，我的车是：{carname}</h3>
    <button onClick={this.changeCar}>换车</button>
    <B carname={carname} /> //注意
        </div>
    	)
	}
}

class B extends React.Component {
    componentWillReceiveProps() { //在父组件重新render之后才调用,第一次解析的时候不会调用
        console.log('B----componentWillReceiveProps')
    }
    shouldComponentUpdate() {
        console.log('B-----shouldComponentUpdate')
        return true
    }
    componentWillUpdate() {
        console.log('B-----componentWillUpdate')
    }
    componentDidUpdate() {
        console.log('B-----componentDidUpdate')
    }
    render() {
        console.log('B------render')
        return <h3 className="b">我是B组件，我收到父亲给我的车是：{this.props.carname}</h3>
    }
}

ReactDOM.render(<A />, document.getElementById('test'))
```





### React组件的生命周期-新

#### 流程

```
1. 初始化阶段: 由ReactDOM.render()触发---初次渲染
    1.	constructor()
    2.	getDerivedStateFromProps 
    3.	render()
    4.	componentDidMount()
2. 更新阶段: 由组件内部this.setSate()或父组件重新render触发
    1.	getDerivedStateFromProps
    2.	shouldComponentUpdate()
    3.	render()
    4.	getSnapshotBeforeUpdate
    5.	componentDidUpdate()
3. 卸载组件: 由ReactDOM.unmountComponentAtNode()触发
	1.	componentWillUnmount()
```



#### 组件生命周期图(新)

##### 简略版

![react-lifecycles.png](https://i.loli.net/2021/01/09/kl6O2XjqSyHAGht.png)



##### 复杂版


![react生命周期(新).png](https://i.loli.net/2020/12/25/QbwyhUOTx8lWsrS.png)



#### 案例

```
1.本地安装17系列版本后,浏览器出现warning,需要对旧版本的钩子名称重命名,加上UNSAFE_钩子名称
2.根据官网,这里的unsafe不是指安全性,而是表示使用这些生命周期的代码在未来react版本中可能出现bug.
```



#### getDerivedStateFromProps

```
1.从props中获取派生的状态
2.当组件中的state完全取决于外部传来的props时,才使用该钩子.
3.是组件的静态方法,需要添加static来定义
4.参数是props,state
5._
```



#### getSnapshotBeforeUpdate

```
1.getSnapshotBeforeUpdare和componentDidUpdate必须同时出现
2.getSnapshotBeforeUpdate必须用return返回一个snapshot value或null. 快照值:任何值都可以,包括undefined.
3.
```



#### componentDidUpdate

```
1.接受3个参数:componentDidUpdate(组件中的preProps,preState,snapshotValue)
2.一种写法: componentDidUpdate(_,__,snapshotValue)  使用下划线用作占位符
3.应用: 网页实时聊天,利用它保留住用户查看聊天的位置
```





### Diffing算法

```
Diffing算法的最小单位是标签
```



#### 验证

```js
- 根据span标签里的时间状态更新且来查看子元素input中的value值是否也被重新覆盖 可以看到Diffing算法的存在 判断出最小单位是标签.
- 如果和上次的解析相同,则不会覆盖.
```







#### 原理

```
经典面试题:
1). react/vue中的key有什么作用？（key的内部原理是什么？）
2). 为什么遍历列表时，key最好不要用index?

1. 虚拟DOM中key的作用：
1). 简单的说: key是虚拟DOM对象的标识, 在更新显示时key起着极其重要的作用。
2). 详细的说: 当状态中的数据发生变化时，react会根据【新数据】生成【新的虚拟DOM】, 
随后React进行【新虚拟DOM】与【旧虚拟DOM】的diff比较，比较规则如下：

a. 旧虚拟DOM中找到了与新虚拟DOM相同的key：
(1).若虚拟DOM中内容没变, 直接使用之前的真实DOM
(2).若虚拟DOM中内容变了, 则生成新的真实DOM，随后替换掉页面中之前的真实DOM

b. 旧虚拟DOM中未找到与新虚拟DOM相同的key
根据数据创建新的真实DOM，随后渲染到到页面

2. 用index作为key可能会引发的问题：
1. 若对数据进行：逆序添加、逆序删除等破坏顺序操作:
会产生没有必要的真实DOM更新 ==> 界面效果没问题, 但效率低。

2. 如果结构中还包含输入类的DOM：
会产生错误DOM更新 ==> 界面有问题。

3. 注意！如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，
仅用于渲染列表用于展示，使用index作为key是没有问题的。

3. 开发中如何选择key?:
1.最好使用每条数据的唯一标识作为key, 比如id、手机号、身份证号、学号等唯一值。
2.如果确定只是简单的展示数据，用index也是可以的。
```





## 1226

### React应用(基于React脚手架)

### react脚手架

#### 介绍

```
1.	xxx脚手架: 用来帮助程序员快速创建一个基于xxx库的模板项目
    1.1	包含了所有需要的配置（语法检查、jsx编译、devServer…）
    1.2	下载好了所有相关的依赖
    1.3	可以直接运行一个简单效果
2.	react提供了一个用于创建react项目的脚手架库: create-react-app
3.	项目的整体技术架构为:  react + webpack + es6 + eslint
4.	使用脚手架开发的项目的特点: 模块化, 组件化, 工程化

```



#### 安装

```
通过包安装
1.修改npm下载源
1.1 查看目前的npm镜像
npm get registry
1.2 修改npm下载镜像为淘宝镜像
npm config set registry https://registry.npm.taobao.org
2.全局安装
npm i -g create-react-app
3.创建项目目录
create-react-app hello-react
4.进入项目文件夹
cd hello-react
5.启动项目
npm start

//安装成功后,界面会推荐相关的yarn命令
yarn start
yarn test
....

```



#### react脚手架项目结构

```
//源码文件夹src+静态资源文件夹public
//组件App.js的后缀一般在开发中写成App.jsx,用来和配置文件.js进行区分.

public ---- 静态资源文件夹
		favicon.icon ------ 网站页签图标
		index.html -------- 主页面     ****
		logo192.png ------- logo图
		logo512.png ------- logo图
		manifest.json ----- 应用加壳的配置文件
		robots.txt -------- 爬虫协议文件
src ---- 源码文件夹
		App.css -------- App组件的样式
		App.js --------- App组件      ****
		App.test.js ---- 用于给App做测试 以前的做法, 
		index.css ------ 样式 
		index.js ------- 入口文件      ****
		logo.svg ------- logo图
		reportWebVitals.js
			--- 页面性能分析文件(需要web-vitals库的支持) 使用繁琐,同类竞争产品多. 使用npmjs查看具体操作
		setupTests.js
			---- 组件单元测试的文件(需要jest-dom库的支持) 鸡肋对于前端来说

yarn.lock 存储的是包的具体信息,有这个文件,使用yarn命令下载包更快.如果没有使用npm i来安装包.
```



#### 项目结构2

```sql
index.js

//引入react核心库
import React from 'react';
//引入react-dom, 初期是通过script标签引入
import ReactDOM from 'reat-dom';
//引入样式
import './index.css';
//引入APP根组件
import App from './App';
//引入reportWebVitals,用于分析页面性能
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
	<React.StrictMode> //严格模式,17.0版本以后引入,但现有项目多有旧语法,所以暂时不推荐.
		<App/>
    </React.StrictMode>,
    document.getElementById('root')
);
reportWebVitals();
```



#### 其他

```sql
- vscode插件: ES7 React/Redux/GraphQL/....  提示代码补全
- 类式组件中,必须要有render(){}+return()
```





#### 功能界面组件化编码流程

```
一.组件化编码流程:
1.拆分组件: 拆分界面,抽取组件
2. 实现静态组件: 使用组件实现静态页面效果
3. 实现动态组件
3.1 动态显示初始化数据
3.1.1 数据类型
3.1.2 数据名称
3.1.2 保存在哪个组件?
 某个组件用,放在自身
 某些组件用,放在共同的父组件(状态提升)
3.2 交互(从绑定事件监听开始)

二.状态在哪里,操作状态的方法就在哪里
三.关于父子间通信:
 1.父组件给子组件传递数据:通过props
 2.子组件给父组件传递数据:通过props,要求父组件提前给子传递一个函数

四.兄弟组件之间的通信:借助共同的父组件
五.关于checked和defaultChecked:
1.什么时候用checked?
 不仅仅展示勾选的状态,后期还需要响应勾选的动作
 注意:用了checked,就必须使用onChange
2.什么时候用defaultChecked?
 仅仅展示勾选的状态; 注意:defaultChecked只管第一次渲染
3.value和defaultValue也是同理的.
```





#### 案例-todo列表

```sql
对象的解构赋值 传属性 {...this.state.todos}
1.数据的两种呈现方式:对象和数组, 一般是数组中有多个对象.state={sum:[{...},{...},{...}]}
2.
let {value}=event.target;
if(event.keyCode!==13) return
if(value.trim()==='') return alert('输入错误重新输入')
...
event.target.value='';

3.父子间通信:
通过props传递给子组件函数,实现函数调用,实现state更新
addTodo=(todoObj)=>{
	this.setState({[todoObj, ...todos]})
}
4.鼠标移入移出添加背景样式
- 不能直接操作DOM;
- 使用事件+className+css解决+状态
- 事件的回调函数传入参数的情况下,需要使用return+函数.因为会由初始解析时,react会调用这个函数,第二次才是事件调用函数.

5.三元运算符和样式结合
style={{display:MouseIsEnter?'block':'none'}}
className={MouseIsEnter?'active':''}

6.checked和onChange搭配使用
7.onChange方法种调用中的event.target.checked
8.reducer
9.全选状态按钮 如何判断checked的值? onChange获取点击选框的true或false值
10.对象的简写方式:形参done {...todoObj,done}<--{...todoObj,done:done}
11.
const newtodos=todos.filter((todoObj)=>{
			return !todoObj.done
		})
```



## 1228 React ajax

```
1.state中的状态是替换,不是覆盖.
2.函数中的参数超过4个,使用对象代替
3.函数中有没有作用的参数,使用占位符.一般是下划线
4.jsx中循环语句,都需要添加key值. 唯一和index
```



### 介绍

```
1.	React本身只关注于界面, 并不包含发送ajax请求的代码
2.	前端应用需要通过ajax请求与后台进行交互(json数据)
3.	react应用中需要集成第三方ajax库(或自己封装)
```



### 常用ajax请求库

```
1.	jQuery: 比较重, 如果需要另外引入不建议使用
2.	axios: 轻量级, 建议使用
    1)	封装XmlHttpRequest对象的ajax
    2)	 promise风格
    3)	可以用在浏览器端和node服务器端

```



### axios的使用

#### 文档

```js
https://github.com/axios/axios
```



#### 语法

```js

```







### 代理2种方式

#### package.json

```
"proxy": "http://localhost:5000"
```



#### setupProxy.js

```js
//根目录下设置setupProxy文件.

const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy(
			'/api1', //只有/api开头的请求，才转发给后端服务器
			{
				target: 'http://localhost:5000', //转发给谁
				changeOrigin: true, //控制服务器接收到的请求头中host字段的值
				pathRewrite: {'^/api1': ''} //重写路径(目的是：干掉前缀)
			}
		),
    proxy(
			'/api2', //只有/api开头的请求，才转发给后端服务器
			{
				target: 'http://localhost:5001', //转发给谁
				changeOrigin: true, //控制服务器接收到的请求头中host字段的值
				pathRewrite: {'^/api2': ''} //重写路径(目的是：干掉前缀)
			}
		)
  );
};
```







### 消息订阅与发布pubsub

#### 使用流程

```
1.	工具库: PubSubJS
2.	下载: npm install pubsub-js --save //yarn add pubsub-js
3.	使用: 
1)	import PubSub from 'pubsub-js' //引入
2)	PubSub.subscribe('delete', function(_,data){ }); //订阅 函数需要两个参数,第一个参数是发布的名称,因为重复可用占位符(_)代替.
3)	PubSub.publish('delete', data) //发布消息

```



#### 注意事项

```
1. state状态对象放在哪个组件中? 原则:谁读状态放在哪个组件
2.消息什么时候开始订阅? 组件出生的那一刻,componentDidMount
3.什么时候取消订阅? componentWillUNmount(){Pubsub.unsubscribe(this.token)}
```







## 1229

### Fetch

#### 介绍

```css
1.原生函数,不再使用XMLHTTPRequest对象提交ajax请求
2.老版本浏览器可能不支持
3.关注分离,第一次返回的response.json()结果是promise, 第二次then方法获取的是响应结果.

//其他:
1.发送ajax请求的方式:原生xhr,封装ajax的axios和jQuery.
2.和xhr评级的fetch
```



#### 语法

```js
//默认发送get请求 返回promise实例对象
fetch('url').
then(response=>{return response.json()}).
then(response=>{console.log(response)}).
catch(error=>{console.log(error)})

//post
fetch('url',{
    method:'POST',
    body:JSON.stringify(data)
}).then(response=>{console.log(response)}).
catch(error=>{console.log(error)})
```





### React路由

#### SPA单页页面

```
1.单页web应用(single page web application)
2.整个应用只有一个完整的页面
3.页面中的链接不会刷新页面,只会做页面的局部更新
4.数据都通过ajax请求获取,并在前端异步展现.
```



#### 单页页面spa优缺点

```
A.用户体验好、快，但是内容的改变需要重新加载整个页面，会造成不必要的跳转和重复渲染；
B.前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理；
C.初次加载耗时多：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
D.前进后退路由管理需要使用浏览器的前进后退功能
E.SEO 难度较大：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。
```



#### 路由

```js
//什么是路由
1.	一个路由就是一个映射关系(key:value)
2.	key为路径, value可能是function或component

```



#### 路由分类

```
1.	后端路由：
1)	理解： value是function, 用来处理客户端提交的请求。
2)	注册路由： router.get(path, function(req, res))
3)	工作过程：当node接收到一个请求时, 根据请求路径找到匹配的路由, 调用路由中的函数来处理请求, 返回响应数据

2.	前端路由：
1)	浏览器端路由，value是component，用于展示页面内容。
2)	注册路由: <Route path="/test" component={Test}>
3)	工作过程：当浏览器的path变为/test时, 当前路由组件就会变为Test组件

```



#### 基本使用

```JS
原生HTML中使用a标签实现页面的跳转
react中使用Link标签实现组件的切换 代替a标签 to属性代替href  其他标签例如button等不能使用Link标签代替
Link外不许看使用Router包裹(BrowserRouter/HashRouter),放在入口文件index.js

import{Route, Link} from 'react-router-dom'
//路由注册 展示区要根据路径去决定展示哪个组件
<Route path='/路径' component={组件名称}/>

//路由导航 react中使用Link标签实现组件的切换
<Link to='/组件名称'>xxx</Link>   
.
```



### 内置组件

##### BrowserRouter

```js
1.添加在入口文件index.js中,包裹外壳组件<App/>

<BrowserRouter>
    <App/>
</BrowserRouter> 
```



##### HashRouter

```

```





##### NavLink

```
Link升级版 
NavLink可以实现路由链接的高亮，通过activeClassName指定样式名 如果不加默认active
```



##### Switch

```
1.通常情况下，path和component是一一对应的关系。
2.Switch可以提高路由匹配效率(单一匹配)。

<Switch>
	<Router path='/路径' component={组件名}/>
	<Router path='/路径' component={组件名}/>
</Switch>
```







### 路由组件和一般组件

```css
1.使用方式不同：
	一般组件：程序员自己写组件标签触发渲染，例如： <Demo/>
	路由组件：靠路由器匹配路径触发渲染，例如：<Route path="/about" component={Demo}/>
2.存放位置不同
	一般组件：components 程序员自己写的
	路由组件：pages      
3.收到的props不同
    一般组件：程序员写标签时，传了什么，就收到什么
    路由组件：收到一个固定的对象，结构如下：
	使用componentDidMount(){console.log(this.props)}查看
    history:
    action: "PUSH"
    block: ƒ block(prompt)
    createHref: ƒ createHref(location)
    go: ƒ go(n)
    goBack: ƒ goBack()
    goForward: ƒ goForward()
    length: 2
    listen: ƒ listen(listener)
    location: {pathname: "/about", search: "", hash: "", state: null, key: "47zt8t"}
    push: ƒ push(path, state)
    replace: ƒ replace(path, state)

    location:
    hash: ""
    key: "47zt8t"
    pathname: "/about"
    search: ""
    state: null

    match:
    isExact: true
    params: {}
    path: "/about"
    url: "/about"
```



### 刷新页面丢失样式

```
刷新页面样式丢失问题
1.什么时候样式会丢失：当路径有多级结构时，刷新页面会造成样式的丢失(react中多级结构,不显示最后一个
2.如何解决：
(1).index.html中引入自身服务器的资源时，不要写./ 要写/
(2).index.html中引入自身服务器的资源时，不要写./ 要写%PUBLIC_URL%
(3).HashRouter替代BrowserRouter #之后的路径不向服务器发送
```



### 严格匹配和模糊匹配

```
默认模糊匹配: 路由导航添加多级结构后访问的是index.html
在路由导航中添加 exact={true}或者exact 实现URL的严格匹配.
开启后子路由会失效.

开启原则:如果不开启会造成错误.
```





### 二级路由

```
前端路由的工作模式不是追加而是替换
二级路由永远要带着一级路由的名字

       
```



### 路由传参

```
通过URL传递参数:
//1.给路由组件传递params参数
路由导航: <Link to={`/home/message/detail/${xx.id}/${xx.title}/${xx.content}`}>{xxx}</Link>

//2.声明接收params参数
路由注册: <Route path='/home/message/detail/:id/:title/:content' component={组件名称} />


组件中接收params参数
const{id, title, content}=this.props.match.params
```





## 1230



### 路由传参__Search参数

```css
axios传参的3种方式:params search body
search参数无需声明接收

1.在路由导航处给路由组件传递search参数: 
<Link to={`/home/message/detail?id=xx&title=xxx&contant=xxx`}

2.在路由注册处无需声明接收search参数
<Link path='/home/message/detail' component={MessageDetail}/>

3.在目标组件中引入qs(from 'querystring')模块来接受实例URL的search参数
const {id,title,content}=qs.parse(search.slice(1))

```



### 路由传参_location参数

```css
location.state参数(是一个对象)
无需声明接收

1.路由导航处传递location.state参数
<Link to={{
	pathname:'/home/message/detail',
      state:{
      	id:xxx,
      	title:xxx,
      	content:xxx
      }
    }}
      
2.路由注册处无需声明接收location.state参数
<Route path='/home/message/detail' component={MessageDetail}/>

3.目标组件通过this.props形式接收参数
cont {id, title, content}=this.props.location.state;
```



### 路由跳转的push和replace模式

```
默认push模式,有历史记录
replace模式,没有历史记录,在路由导航中Link中使用关键字replace={true}实现,简写replace

```



### 编程式路由导航

```
link和navlink是触发式 点击跳转
用代码控制路由进行跳转,使用props中的history中的push(path,state)和replace(path,state)方法

```



```
案例1: news组件3秒之后跳转到detail组件 使用挂载组件和卸载组件搭配定时器和this.props.history.push('/home/message')

案例2: 点击button跳转到使用location.state路由导航的页面
<button Onclick={this.handelPush(msgObj)}/>

//跳转到相应的页面
const{id,title,content}=msgObj;
handlePush=(msgObj)=>{
	return ()=>{this.props.location.replace('/home/message/detail', {id,title,content})}
}

```









### history_go/goBack/goForward

```
this.props.location.go(2) 正值前进几步,负值相反
this.props.location.goBack(),后退一步
this.props.location.goForward()/前进各一步
```





### withRouter

```
1.将一般组件添加上路由组件独有的属性api(location,search,match)等,
2.引入import{withRouter} from 'react-router-dom';
3.如何查看:在组件中使用挂载完成来打印this.props
4.添加页面路由处理: back=()=>{this.props.location.goBack()}
5.导出组件 export default widthRouter(Header); ***
```



### Redirect

```
访问404页面的两种方式:
1.创建404路由组件,在App组件中加入<Route to='/notfound' component={notFound}/>
pages/404/index.jsx 

2.使用react-router-dom中的Redirect组件
一般在所有路由注册的地方兜底,当没有匹配项时,使用这个组件


Redirect组件
有一个to参数,路径
用法:在<Switch></Switch>中最后添加<Redirect to='/路径'>

1.导入
import {NavLink,Switch, Route, Redirect} from 'react-router-dom';
2.在Switch组件中使用
<Switch>
<Route path='...' component={..}/>
<Redirect to='/...'/> /
</Switch>

3.作用:
3.1用来显示默认页面,用来兜底
3.2找到App组件,将
```



### redux

### 基本介绍

```
# 学习文档
1.	英文文档: https://redux.js.org/
2.	中文文档: http://www.redux.org.cn/
3.	Github: https://github.com/reactjs/redux
```



### 复用工程包

```
会安装一些不用的包
复制src,public,.gitignore, package.json, yarn.lock这5个文件到新文件夹下
修改package.json中的name
```



### 基本介绍

```
1.	redux是一个专门用于做状态管理的JS库(不是react插件库)。 import {createStore} from 'redux'
2.	它可以用在react, angular, vue等项目中, 但基本与react配合使用。
3.	作用: 集中式管理react应用中多个组件共享的状态。
```



### 使用情况

```
1.	某个组件的状态，需要让其他组件可以随时拿到（共享）。
2.	一个组件需要改变另一个组件的状态（通信）。
3.	总体原则：能不用就不用, 如果不用比较吃力才考虑使用
```

### 工作流程

![xxx](https://i.loli.net/2020/12/30/ewtJpbiHW6MNrj4.png)





### redux3个核心概念

```
action
1.动作的对象
2.包含2个属性
	type：标识属性, 值为字符串, 唯一, 必要属性
	data：数据属性, 值类型任意, 可选属性
3.	例子：{ type: 'ADD_STUDENT',data:{name: 'tom',age:18} }

reducer
1.	用于初始化状态、加工状态。
2.	加工时，根据旧的state和action， 产生新的state的纯函数。
3. 补充: store一出生,就调用了一次reducer.preState的值是undefined,action中type没值,data的值是默认设置的字符串.

store
1.	将state、action、reducer联系在一起的对象
2.	如何得到此对象?
1)	import {createStore} from 'redux'
2)	import reducer from './reducers'
3)	const store = createStore(reducer)
3.	此对象的功能?
1)	getState(): 得到state
2)	dispatch(action): 分发action, 触发reducer调用, 产生新的state
3)	subscribe(listener): 注册监听, 当产生了新的state时, 自动调用

```



### redux核心api介绍

```
createstore()
创建包含指定reducer的store对象

store对象
1.	作用: redux库最核心的管理对象
2.	它内部维护着:
1)	state
2)	reducer
3.	核心方法:
1)	getState()
2)	dispatch(action)
3)	subscribe(listener)
4.	具体编码:
1)	store.getState()
2)	store.dispatch({type:'INCREMENT', number})
3)	store.subscribe(render)

applyMiddleware()
作用：应用上基于redux的中间件(插件库)

combineReducers()
作用：合并多个reducer函数

```



### redux异步编程  ||

```
1.	redux默认是不能进行异步处理的, 
2.	某些时候应用中需要在redux中执行异步任务(ajax, 定时器)
3.  使用异步中间件redux-thunk来处理
```







### 迷你版redux案例



```js
注意事项:
0.更新state做的两件事:1.更新state状态;2.重新调用render()渲染页面

1.入口文件中需要使用store.subscribe(()=>{ReactDOM.render(....)})来根据状态更新来刷新页面.上面还要放一个render用来初始化页面. 只要redux状态发生改变,就会调用.

2.在store.dispatcth()下再调用this.setState({})来在再次渲染页面

3.常量模块: 共用的容易写错的.
例如固定的繁琐单词:
export const INCREMENT ='increment';


//其他:
组件名称_action.js 用于定义创建action函数
组件名称_reducer.js 用于定义组件服务的reducer. reducer可以初始化状态和加工状态
store.js 创建redux中最为核心的store对象
constant.js 该模块是存储一些容易写错的单次,使用常量大写形式.有提示

createStore()一旦创建,所有的东西都控制不了了.

```



```
案例

```







### 异步action版 |||

```js
目前无法实现让函数等一等收到返回值(return的值),但可以实现打印,弹出,get请求等.

const demo=(value, time)=>{
	setTimeout(()=>{
		return{type:'aa', data:value}
	})
}

const x=demo(1,500);
console.log(x); //undefined
======================================
const demo=(value, time)=>{
	return setTimeout(()=>{   //<-- 不同点:加了return
		return{type:'aa', data:value}
	})
}

const x=demo(1,500);
console.log(x); //1 返回的是定时器的id
```



```JS
const demo=(value, time)=>{
	setTimeout(()=>{
		return{type:'aa', data:value}
	})
}

//函数的返回值是undefined
//setTimeout的返回值是定时器的id
//没法用定时器实现函数的返回值,目前


store在每次拿到action的时候,都会进行一个判断: action instanceof Object/function,如果是一个函数,就会调用这个函数.
//同步action和异步action. 
//同步action: 特点,其值都是Object对象(type:,data:)
//异步action: 返回的是一个函数.
components中Count组件: store.dispatch(createIncrementAsyncAction(value*1, 500))



redux中store.js:
//如果不引用异步处理组件,报错内容:Actions must be plain objects.Use coutome middleware for async actions.
 //引入支持异步action的中间件: 
 1.安装引入 
 	import {createStore, applyMiddleware} from 'redux';
 	import thunk from 'redux-thunk';
 	
 2.使用: const store=createStore(countReducer, applyMiddleware(thunk));
 
 3.异步action中返回一个函数,store模块来调用的这个函数:
 //第一版
 import store from './store'
 export default createIncrementAsyncAction=(value,time)=>{
     return()=>{
         store.dispatch(createIncrementAction(value))
     }
 }
 =======================================================
//第二版 
 export default createIncrementAsyncAction=(value,time)=>{
 	return (dispatch)=>{ //action中返回对象或函数
 		setTimeout(()=>{ //异步定时器,函数是store调用的
 			dispatch(createIncrementAction(value)); //不能使用return 
 		})
 	}
 }
```



## 1231

### react-redux





```
1.	一个react插件库
2.	专门用来简化react应用中使用redux
```

### 介绍

```
 react-Redux将所有组件分成两大类
 1.	UI组件 components/组件/index.jsx
1)	只负责 UI 的呈现，不带有任何业务逻辑
2)	通过props接收数据(一般数据和函数)
3)	不使用任何 Redux 的 API
4)	一般保存在components文件夹下

2.	容器组件 containers/组件/index.jsx
1)	负责管理数据和业务逻辑，不负责UI的呈现
2)	使用 Redux 的 API
3)	一般保存在containers文件夹下

```



#### react-redux模型

#### 原型图:

![react-redux模型图.png](https://i.loli.net/2021/01/02/mxytMniNsBkc5zL.png)

```
1.ui组件都应该包裹在一个容器组件. 是父子关系
2.容器组件是真正和redux打交道的,里面可以使用任意redux的api
3.ui组件不能使用redux的api
4.容器组件会传给ui组件: redux中所保存的状态;2.用于操作状态的方法
5.容器给ui传递: 状态,操作状态的方法,均通过props传递.

```



```
容器组件一般放在container文件夹 container>Count>index.jsx  
ui组件一般放在components文件夹 components>Count>index.jsx

container下的容器需要一个内置方法生成:
//该文件是Count的容器组件,用于连接Count的UI和redux
1.安装react-redux
2.创建容器组件
//引入Count的UI组件
import CountUI from '../../component/Count'
//引入connect,用于连接UI与redux,生成容器组件.
import {connect} from 'react-redux';
const CountContainer=connect()(CountUI)
export default CountContainer;

3.App组件(渲染容器组件的组件),通过props形式传入store参数 store={store}
```





### 求和案例-react-redux基本使用

```
1.connect(a,b)(countUI); a和b都是回调函数,通过store调用.

(1).明确两个概念：
    1).UI组件:不能使用任何redux的api，只负责页面的呈现、交互等。
    2).容器组件：负责和redux通信，将结果交给UI组件。
(2).如何创建一个容器组件 ———— 靠react-redux 的 connect函数
写法：connect(mapStateToProps,mapDispatchToProps)(UI组件)
-mapStateToProps:映射状态，返回值是一个对象
-mapDispatchToProps:映射操作状态的方法，返回值是一个对象
(3).备注：容器组件中的store是靠props传进去的，而不是在容器组件中直接引入



```



### connect()()

```js
//连接UI与redux,生成容器组件
connect(a,b)(UI)

要求:
1.第一个括号需要传入两个函数
2.准备两个函数,用返回{对象}的形式给UI传递东西
3.

```



```js
function a(){}
function b(){}
connect(a,b)(UI)

如果直接a和b没有返回值,浏览器报错:
mapStateToProps() in Connect(Count) must return a plain object
mapDispatchToProps() in Connect(Count) must return a plain object.
如果没有传值,connect()(UI)
UI组件打印的props值是默认的{store:{...}, dispatch:f}
                  

function mapStateToProps(){
    return{sum:store.getState()}
}  
function mapDispatchProps(){
    return{
        jia:(value)=>{store.dispatch({type:'increment', data:value})}
        //jia:(value)=>{store.dispatch(createIncrementAction(value))}
        //导入action中的函数来简化dispatch分发的对象
    }
}                  
//简化,因为容器组件中已经在App组件或index入口中添加了store={store}属性.
mapStateToProps=(state)=>{
    return{sum:state}
}
函数a,b是回调函数,是store调用的,同时给a和b函数分别传递了state和dispatch.
mapStateToProps=(state)=>({sum:state})
mapDispatchToProps=(dispatch)=>{}


/*mapStateToProps函数的返回值必须是一个对象
返回的这个对象的key就作为传递给UI组件的props的key
返回的这个对象的value就作为传递给UI组件的props的value
mapStateToProps函数主要用于给UI组件传递状态 */        
                  
/* mapDispatchToProps函数的返回值必须是一个对象
返回的这个对象的key就作为传递给UI组件的props的key
返回的这个对象的value就作为传递给UI组件的props的value
mapDispatchToProps函数主要用于给UI组件传递操作状态的方法 */
```









### 求和案例-react-redux优化

```
(1).无需自己给容器组件传递store，给<App/>包裹一个<Provider store={store}>即可。 //批量组件得到store
(2).使用了react-redux后也不用再自己检测redux中状态的改变了，容器组件可以自动完成这个工作。(store.subscribe可以省略)
(3).mapDispatchToProps也可以简单的写成一个对象
(4).一个组件要和redux“打交道”要经过哪几步？
    (1).定义好UI组件---不暴露
    (2).引入connect生成一个容器组件，并暴露，写法如下：
    connect(
    state => ({key:value}), //映射状态
    {key:xxxxxAction} //映射操作状态的方法
    )(UI组件)
(4).在UI组件中通过this.props.xxxxxxx读取和操作状态
(5).容器组件和UI组件整合一个文件 **

扩展:
1.mapDispatchToProps函数简化成对象形式的原因: 
属性值最终返回的是一个action的对象,相比较普通写法来说,缺少了dispatch分发函数,但实际上react-redux中的connect函数底层实现了分发,它对其第二个参数(connect(操作状态,mapDispatchToProps)(UI组件)有个判断,如果是对象,connect自动调用dispatch分发;如果是函数,让函数正常执行,返回对象后再调用dispatch.
```





### 多组共享状态-Person组件静态

```
1.容器组件和UI组件整合成一个文件
2.多个组件的action和reduer组件放在一起混乱,使用文件夹actions和reducers来包裹不同的文件,然后将(组件名_action.js)改名为组件名.js
3.新添加组件状态,建议先加上常量constant
4.reducer,action本质是一个函数.
action返回对象是同步action,返回函数是异步action.
5.当有多个reducer工作的时候,redux所保存的总状态就要写成一个对象
5.1 combineReducers传入的哪个对象,就是redux中保存的总状态
6.import{combineReducers}from 'redux' combineReducers中传入的那个对象,就是redux中保存的总状态
7.建议顺序: 常量-->reducer-->action-->store *****

```





### redux开发者工具的使用

```
//npmjs.com
1.下载库 yarn add redux-devtools-extension
2.store引入  import{composeWithDevTools} from 'redux-devtools-extension'
3. const store=createStore(allReducer, composeEnhance(applyMiddleWare(thunk)))
```



### 求和案例-react-redux 优化

```
1.store中的reducer在reducer新建index.js汇总
2.export default默认暴露,之后必须跟着表达式
```





### react扩展



## react脚手架配置代理总结



### 方法一

> 在package.json中追加如下配置

```json
"proxy":"http://localhost:5000"
```

说明：

1. 优点：配置简单，前端请求资源时可以不加任何前缀。
2. 缺点：不能配置多个代理。
3. 工作方式：上述方式配置代理，当ajax请求了**3000**不存在的资源时，那么该请求会转发给5000 （**优先匹配前端资源**）
4. 请求URL可以简写:



### 方法二

1. 第一步：创建代理配置文件

   ```
   在src下创建配置文件：src/setupProxy.js
   ```

2. 编写setupProxy.js配置具体代理规则：

   ```js
   const proxy = require('http-proxy-middleware')
   
   module.exports = function(app) {
     app.use(
       proxy('/api1', {  //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
         target: 'http://localhost:5000', //配置转发目标地址(能返回数据的服务器地址)
         changeOrigin: true, //控制服务器接收到的请求头中host字段的值
         /*
         	changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
         	changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
         	changeOrigin默认值为false，但我们一般将changeOrigin值设为true
         */
         pathRewrite: {'^/api1': ''} //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
       }),
       proxy('/api2', { 
         target: 'http://localhost:5001',
         changeOrigin: true,
         pathRewrite: {'^/api2': ''}
       })
     )
   }
   ```

说明：

1. 优点：可以配置多个代理，可以灵活的控制请求是否走代理。
2. 缺点：配置繁琐，前端请求资源时必须加前缀。





## Vue代理

> 使用vcli框架中的代理,使用了webpack中的配置. 在cli脚手架, uniapp中都需要在vue.config.js中配置]
>
> 小程序不需要跨域设置 

```js
webpack中文文档:
https://webpack.docschina.org/configuration/dev-server/#devserverproxy

cli.vuejs.org文档
https://cli.vuejs.org/zh/config/#devserver-proxy

```



```js
module.exports = {
  devServer: {
    proxy: {
      '/api': {   //接头暗号, 请求网址中应该包含/api
        target: '<url>',   //目标服务器地址
        ws: true,          //websocket 
        changeOrigin: true, //允许跨域
        pathRewrite:{
            '/api':'/'
        }
      },
      
    }
  }
}
```



### websocket长链接

```js
//简介 websocket
握手协议 长链接 
//作用
用于数据实时通信，服务器端能够主动推送消息给客户端， 
//场景： 
1. 实时聊天，2. 购买商品使用第三方支付微信，支付后，微信后台主动推送支付结果给商家服务器端，用于更新订单状态
```









## 1. setState

### 深入setState

```
setState()是同步的,但其状态的更改可能是异步的.(官方文档写的是'可能')

setState本身就是一个同步的函数,由程序员亲自调用,JS引擎在主线程执行调用.但setState引发的'动作'是异步的.
```





```
一、setState()更新状态的动作是异步还是同步的?----要看setState的执行位置
		(1). 在由react所控制的回调中更新的动作是【异步】的: 生命周期勾子、react事件监听回调 
		(2). 在非react控制的异步回调中更新的动作是【同步】的: 定时器回调、原生事件回调
			补充:原生事件的回调是异步的吗?必须是.例如按钮,点击之后才调用.
		
二、setState的两种写法：
	(1). 对象式写法：setState(stateChange, [callback])
            1.stateChange为状态改变对象(该对象可以体现出状态的更改)
            2.callback是可选的回调函数, 它在状态更新完毕、界面也更新后(render调用后)才被调用
					
	(2). 函数式写法：setState(updater, [callback])
            1.updater为返回stateChange对象的函数。
            2.updater可以接收到state和props。
            4.callback是可选的回调函数, 它在状态更新、界面也更新后(render调用后)才被调用。
总结:
		1.对象式的setState是函数式的setState的简写方式(语法糖)
		2.使用原则：
				(1).如果新状态不依赖于原状态 ===> 使用对象方式
				(2).如果新状态依赖于原状态 ===> 使用函数方式
				(3).如果需要在setState()执行后获取最新的状态数据, 要在第二个callback函数中读取。
```



```js
//这就是react中的一个bug
//案例1-1

import React, {Component} from 'react';

export default class Demo extends Component{
    state={sum:0};
	//add是由React控制的事件回调，所以其中的setState更新状态的动作是【异步的】
	add=()=>{
        const{sum}=this.state;
        this.setState({sum:sum+1});
        console.log(sum); //输出0
        //11行代码下面的所有代码执行完后,才进行2个操作:改state,调render. setState是我们调用的,不是回调函数,所以setState不是异步函数.
    }
    
    componentDidMount(){
        console.log(this.state.sum);//只打印一次初始值
    }
    
   render(){
       const{sum}=this.state;
       return(
       	<Fragment>
        	<h2>当前state状态中sum的值是:{sum}</h2>   //1
			<button onClick={this.add}>点我+1</button>
        </Fragment>
       )
   }
}

```



```js
//案例1-2
//挂载完成组件中: 
	更改state,打印state; 
	更改两次state,打印两次state; 
	加入事件回调函数(异步)
//输出:0 1
import React, {Component} from 'react';

export default class Demo extends Component{
    state={sum:0};

	//componentDidMount是由React控制的生命周期钩子，所以其中的setState更新状态的动作是【异步的】
    componentDidMount(){
        const{sum}=this.state;
        this.setState({sum:sum+1});
        console.log(sum);//0
    }
    
   render(){
       const{sum}=this.state;
       return(
       	<Fragment>
        	<h2>当前state状态中sum的值是:{sum}</h2>   //1
			//<button onClick={this.add}></button>
        </Fragment>
       )
   }
}

//在挂载完成的钩子里更改两次sum值. 输出:0 0 1
//但是, 两次执行都是将0设置为1,在 react 内部会被合并掉，只执行一次。设置完成后 state.sum 值为 1。
//参考链接:https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/18
import React, {Component} from 'react';

export default class Demo extends Component{
    state={sum:0};
    componentDidMount(){
        const{sum}=this.state;
        this.setState({sum:sum+1});
        console.log(sum);//0
        
        this.setState({sum:sum+1});
        console.log(sum);//0
    }
    
   render(){
       const{sum}=this.state;
       return(
       	<Fragment>
        	<h2>当前state状态中sum的值是:{sum}</h2>   //1
			//<button onClick={this.add}></button>
        </Fragment>
       )
   }
}
```





```js
//案例1-3
//声明周期函数中含有我们定义的回调函数 状态的更改是同步的
import React, {Component} from 'react';

export default class Demo extends Component{
    state={sum:0};

    componentDidMount(){
        const{sum}=this.state;
        const{btn}=this;
        btn.addEventListener('click', ()=>{
            const {sum}=this.state;
            this.setState({sum:sum+1});
            console.log(sum);//1
        })
    }
    
   render(){
       const{sum}=this.state;
       return(
       	<Fragment>
        	<h2>当前state状态中sum的值是:{sum}</h2>   //1
			<button ref={c=>this.btn=c}></button>
        </Fragment>
       )
   }
}
```



```js
//案例1-4
//自定义的异步回调函数:定时器
import React, {Component} from 'react';

export default class Demo extends Component{
    state={sum:0};
	add2=()=>{
        setTimeout(()=>{
            const{sum}=this.state;
            this.setState({sum:sum+1});
            console.log(sum);//1
        })
    }
    
    
   render(){
       const{sum}=this.state;
       return(
       	<Fragment>
        	<h2>当前state状态中sum的值是:{sum}</h2>   //1
			<button onClick={this.add2}></button>
        </Fragment>
       )
   }
}
```



```js
//案例1-5
//来源:https://github.com/Advanced-Frontend/Daily-Interview-Question/blob/master/datum/summary.md#%E7%AC%AC-19-%E9%A2%98react-setstate-%E7%AC%94%E8%AF%95%E9%A2%98%E4%B8%8B%E9%9D%A2%E7%9A%84%E4%BB%A3%E7%A0%81%E8%BE%93%E5%87%BA%E4%BB%80%E4%B9%88
//答案:https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/18
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  
  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
};
```







```js
//更改state的两种方法:

import React, {Component} from 'react';
export default class Count extends Component{
    state={sum:0};
	add=()=>{
        //对象式的setState
        cont{sum}=this.state;
        this.setState({sum:sum+1})
        
        //函数式的setState
        this.setState(state=>({sum:state.sum+1}))
    }
    change=()=>{
        //新状态不依赖于原状态,适用于对象式的setState
        this.setState({sum:99})
    }
    render(){
        const{sum}=this.state;
        return(
            <div>
            	<h2>当前求和为:{sum}</h2>
				<button onClick={this.add}>点我加1</button>
				<button onClick={this.change}点我将和更改为99</button>
            </div>
        )
    }
}
```





## 2. lazyLoad

### 路由组件的lazyLoad

```js
	//1.通过React的lazy函数配合import()函数动态加载路由组件 ===> 路由组件代码会被分开打包
	const Login = lazy(()=>import('xxx/xxxx/test'))
	
	//2.通过<Suspense>指定在加载得到路由打包文件前显示一个自定义loading界面
	<Suspense fallback={<h1>loading.....</h1>}>//fallback={<Loading/>}
        <Switch>
            <Route path="/xxx" component={Xxxx}/>
            <Redirect to="/login"/>
        </Switch>
    </Suspense>
```



```js

```







## 3. Hooks

#### 1. Hooks是什么?

```
(1). Hook是React 16.8.0版本增加的新特性/新语法
(2). 可以让你在{函数组件}中使用 state 以及其他的 React 特性
```

#### 2. 三个常用的Hook

```
(1). State Hook: React.useState()
(2). Effect Hook: React.useEffect()
(3). Ref Hook: React.useRef()
```

#### 3. State Hook

```
(1). State Hook让函数组件也可以有state状态, 并进行状态数据的读写操作
(2). 语法: const [xxx, setXxx] = React.useState(initValue)  
(3). useState()说明:
        参数: 第一次初始化指定的值在内部作缓存
        返回值: 包含2个元素的数组, 第1个为内部当前状态值, 第2个为更新状态值的函数
(4). setXxx()2种写法:
        setXxx(newValue): 参数为非函数值, 直接指定新的状态值, 内部用其覆盖原来的状态值
        setXxx(value => newValue): 参数为函数, 接收原本的状态值, 返回新的状态值, 内部用其覆盖原来的状态值

5. setInterval中需要使用函数式更改state,setxxx(newvalue)不起作用.
```



```js
//目前react存在的小问题
function add(){
	setTimeout(()=>{
		//setSum(sum+3); 不起作用:页面只显示一个初始值,没有自动增加.
		setSum(sum=>sum+3)
	},500)
}
```









#### 4. Effect Hook

```
(1). Effect Hook 可以让你在函数组件中执行副作用操作(用于模拟类组件中的生命周期钩子)
(2). React中的副作用操作:
        发ajax请求数据获取
        设置订阅 / 启动定时器
(3). 语法和说明: 
        useEffect(() => { 
          // 在此可以执行任何带副作用操作
          return () => { // 在组件卸载前执行
            // 在此做一些收尾工作, 比如清除定时器/取消订阅等
          }
        }, [stateValue]) // 如果指定的是[], 回调函数只会在第一次render()后执行
    
(4). 可以把 useEffect Hook 看做如下三个函数的组合
        componentDidMount()
        componentDidUpdate()
        componentWillUnmount() 
```







```js
export default function Count(){
    const[sum, setSum]=React.useState(0);
    const[name]=React.useState('初始值');
    
    function add(){
        setSum(sum=>sum+3);
    }
    React.useEffect(()=>{//useEffect有两个参数,一个是函数,一个是数组.
        console.log(1); //只要sum状态一改变,就会打印.
    },[])//监测数组:空数组意味着谁都不监测.任何的改变都不会触发didupdate.监测谁就输入谁.如果不传数组,监测所有的改变.
    
    return(
    	<div>...</div>
    )
    
}

```



```js
export default function Count(){
    const[sum, setSum]=React.useState(0);
    const[name]=React.useState('初始值');
    
    function add(){
        setSum(sum=>sum+3);
    }
   
    React.useEffect(()=>{
        const time=setInterval(()=>{
            setSum(sum=>sum+3)
        },1000)  
        return()=>{clearInterval(time)}//return 返回一个函数.添加函数的返回值,相当于componentWillUnmount,所以可以添加清除定时器操作.
    })
    //
    //这么写后果会直接指数爆炸.1.useEffect相当于componentDidMount和componentDidUpdate等钩子,
    
}

```





#### 5. Ref Hook

```
(1). Ref Hook可以在函数组件中存储/查找组件内的标签或任意其它数据
(2). 语法: const refContainer = useRef()
(3). 作用:保存标签对象,功能与React.createRef()一样
```



------



## 4. Fragment

### 使用

	<Fragment><Fragment> 或 <></>

### 作用

> 避免无用的嵌套层级



<hr/>

## 5. Context

### 理解

> 一种组件间通信方式, 常用于【祖组件】与【后代组件】间通信

### 使用

```js
1) 创建Context容器对象：
	const XxxContext = React.createContext()  
	
2) 渲染子组时，外面包裹xxxContext.Provider, 通过value属性给后代组件传递数据：
	<xxxContext.Provider value={数据}>
		子组件
    </xxxContext.Provider>
    
3) 后代组件读取数据：

	//第一种方式:仅适用于类组件 
	  static contextType = xxxContext  // 声明接收context
	  const {value}=this.context // 读取context中的value数据
	  
	//第二种方式: 函数组件与类组件都可以使用
      import {xxxContext} from './context';
	  //const {Consumer}=xxxContext;
	  <xxxContext.Consumer>
	    {
	      value => ( // value就是context中的value数据
	        要显示的内容
	      )
	    }
	  </xxxContext.Consumer>
```

### 备注

	在应用开发中一般不用context, 一般都用它的封装react插件

<hr/>

## 6. 组件通信方式总结

#### 组件间的关系：

- 父子组件
- 兄弟组件（非嵌套组件）
- 祖孙组件（跨级组件）
- 其他关系

#### 几种通信方式：

		1.props：
			最简单的方式
		2.消息订阅-发布：
			pubs-sub、event等等(event从c#中来)
		3.集中式管理：
			redux、dva等等(dva react中路由和redux组合体体--第三方库dva)
		4.conText:
			生产者-消费者模式

#### 比较好的搭配方式：

		父子组件：props
		兄弟组件：消息订阅-发布、集中式管理
		祖孙组件(跨级组件)：消息订阅-发布、集中式管理、conText(开发用的少，封装插件用的多)
		其他组件:pub-sub 集中式







## 案例

```

```













## 案例

### antd基本介绍

#### 文档

> https://ant.design/docs/react/use-with-create-react-app-cn



#### 按需引入

> 前提:antd.css体积大; 参考3.x版本

```sql
1.安装依赖：yarn add react-app-rewired customize-cra babel-plugin-import less less-loader
		2.修改package.json
				....
					"scripts": {
						"start": "react-app-rewired start",
						"build": "react-app-rewired build",
						"test": "react-app-rewired test",
						"eject": "react-scripts eject"
					},
				....
		3.根目录下创建config-overrides.js
				//配置具体的修改规则
				const { override, fixBabelImports,addLessLoader} = require('customize-cra');
				module.exports = override(
					fixBabelImports('import', {
						libraryName: 'antd',//对哪个库进行按需引入
						libraryDirectory: 'es',//要按需引入的这个库,使用的是哪种模块化规范
						style: true,//对哪种文件进行按需引入.如果是布尔值,则true代表允许修改样式.
					}),
					addLessLoader({//此处按照未更新官网会报错,需要写这种形式
						lessOptions:{
							javascriptEnabled: true,//允许JS修改antd的less文件
							modifyVars: { '@primary-color': 'green' },
						}
					}),
				);
		
```



#### antd-mobile

```
https://mobile.ant.design/
```





### 复习: 请求参数

```js
1.HTTP有8大请求
2.请求方式:常用的4个: GET(查) POST(增) PUT(改) DELETE(删)
3.请求参数:
 常用的3种:
	query(查询字符串参数) 
	params 
    body(请求体参数)
 
4.body中两种参数形式: urlencoded编码形式: key=value&key=value...;json格式
5.其他:
	形如：key=value&key=value的结构，叫做urlencoded编码
	从理论上说，一次请求的3个参数，可以通过3中形式携带，但一般不这么做
	有请求体的请求（POST PUT DELETE ），一般都通过请求体携带数据


GET-带query参数:完整+精简
GET-带params参数:完整+精简
GET-带请求体(body)参数: 不能写

POST-带query参数:完整+不能简写,会导致参数丢失.
POST-带params参数:完整+精简
POST-带请求体(body)参数:完整+精简.

```



```js
//客户端

//axios发送get请求-带query参数-完整写法:
axios({
	url:'http://localhost:5000/test2',
	params:{name:'甲', age:16} //此处写的params,但携带的是query
}).then(
	response=>{console.log('请求成功了', response.data)},
    error=>{console.log('请求失败了', error)}
)

//axios发送get请求-带query参数-完整写法:
axios.get({'http://localhost:5000/test2', {params:{name:'甲', age:16}}}).then(
	response=>{console.log('请求成功了', response.data)},
    error=>{console.log('请求失败了', error)}
)

//axios发送get请求-带params参数-完整写法
axios({
    url:'http://localhost:5000/test3/甲/16/女'
}).then(
	response=>{console.log('请求成功了', response.data)},
    error=>{console.log('请求失败了', error)} 
)
//axios发送get请求-带params参数-精简写法
axios.get({'http://localhost:5000/test3/甲/16/女'}).then(
	response=>{console.log('请求成功了', response.data)},
    error=>{console.log('请求失败了', error)} 
)

//axios发送post请求-带query参数-完整写法
axios({
    url:'http://localhsot:5000/test4',
    method:'POST',
    params:{name:'甲', age:16, gender:'女'} //此处写的是params,但携带的是query参数
}).then(
	response=>{console.log('请求成功了', response.data)},
    error=>{console.log('请求失败了', error)} 
)

//axios发送post请求-带query参数-不能简写,会导致参数丢失!!!!
axios.post({'http://localhost:5000/test4', {params:{name:'甲', age:16, gender:'女'}}}).then(
	response=>{console.log('请求成功了', response.data)},
    error=>{console.log('请求失败了', error)} 
)


//axios发送post请求-带params参数-完整写法
axios({
    url:'http://localhsot:5000/test5/甲/16/女',
    method:'POST'
}).then(
	response=>{console.log('请求成功了', response.data)},
    error=>{console.log('请求失败了', error)} 
)
//axios发送post请求-带params参数-精简写法
axios.post('http://localhsot:5000/test5/甲/16/女').then(
	response=>{console.log('请求成功了', response.data)},
    error=>{console.log('请求失败了', error)} 
)

//axios发送post请求-带请求体参数-完整写法
axios({
    method:'POST',
    url:'http://localhost:5000/test6',
    //data:{name:'甲',age:16,gender:'女'} 第一种形式  json字符串形式
    data:'name=甲&age=16&gender=女'      //第二种形式 urlencoded形式
}).then(
	response=>{console.log('请求成功了', response.data)},
    error=>{console.log('请求失败了', error)} 
)

//axios发送post请求-带请求体参数-完整写法
axios.post('http://localhost:5000/test6', {name:'甲',age:16,gender:'女'}).then(
	response=>{console.log('请求成功了', response.data)},
    error=>{console.log('请求失败了', error)} 
)
```





```js
//服务端

const express=require('express');
const cors=require('cors');
const app=express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());//urlencoded和json是能获取body请求体参数的中间件

app.get('/test1',(req,res)=>{
	console.log('有人请求test1了')
	res.send('我是test1返回的一些数据')
})
...
服务端获取query参数: request.query
服务端获取params参数: request.params
服务端获取body参数: request.body


app.get('/test3/:name/:age/:gender', (request, response)=>{   //params参数的获取形式
    console.log('我是test3，我接到的params参数是',request.params)
	response.send('我是test3返回的一些数据')
})
...

app.listen(8080, (err)=>{
    if(!err) console.log('服务器开启成功')
})
```





### 案例

#### 注意点

```shell
1.静态页面设置之前,需要重置css样式:reset.css
 1.1 github搜索reset, 推荐使用提交较小的minireset.css.
2.更改css样式:index.css
 1.2 更改antd-mobile样式,可能需要提高权重!import

3.手机号正则的获取 浏览器插件:FEhelp
4.跨域解决-服务器端: 
    //1.使用中间件cors
    import cors from 'cors';
    app.use(cors())
4.1 跨域解决-客户端:
	package中设置porxy或根目录下设置setProxy.js

5.state中codeTime和canClick相呼应,设置按钮失效和时间限制的思想

5.1 移动端disabled失效.

6.config文件夹的使用
  保存常量constant.js 
  保存正则reg.js
  保存路由route.js //用于专门统一管理路由

6.1 route.js
routes数组中存储着所有的路由配置,每个路由配置是一个对象
const routes=[
    {path:'/login', component:Login},
    {}
]

6.2 登录按钮的校验逻辑
6.3 获取验证码的校验逻辑

7.路由<Switch>中路由的简写形式 //jsx中批量传递
routes.map((routeObj)=>{ <Route key={routeObj.path} {...routeObj}/> })
                        
8.JSDOC注释
/**+回车

9.测试接口是否可用
 9.1使用axios.post发送请求
 9.2使用postman软件
 
10. 统一管理ajax请求
 - 发送请求,禁止在组件中立即使用axios.
 - 根目录下新建ajax文件夹,根据不同组件新建相关js文件.例如login.js verify.js
 
11.
```















































































