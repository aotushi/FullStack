
# Vue2


> https://vue3js.cn/interview/
> https://juejin.cn/post/6844903918753808398
> https://www.cnblogs.com/wenshaochang123/p/14888494.html
> [web前端面试 - 面试官系列 (vue3js.cn)](https://vue3js.cn/interview/)
> https://juejin.cn/post/6844903918753808398#heading-20
  https://www.yuque.com/cuggz/interview/hswu8g#02b671eb804c1a7a0e637fb68e91d8ac
  [史上最强vue总结---面试开发全靠它了 - 掘金 (juejin.cn)](https://juejin.cn/post/6850037277675454478)


### 怎么实现vm
Vue 的 MVVM 实现主要由以下四个核心部分构成:

1. **Observer (数据观察者)**
    - 通过 Object.defineProperty 劫持数据对象的属性
    - 将数据对象的属性转换为 getter/setter
    - 在属性被访问和修改时能够获取通知
    - 负责监听数据对象的所有属性变化
2. **Compile (指令解析器)**
    - 对 DOM 模板进行解析
    - 识别其中的指令(v-开头)和插值表达式({{}})
    - 根据不同的指令类型执行相应的绑定操作
    - 初始化视图，将模板与数据关联起来
3. **Watcher (订阅者)**
    - 作为 Observer 和 Compile 的桥梁
    - 订阅数据变化
    - 接收属性的变化通知
    - 执行相应的视图更新操作
    - 实现数据变化到视图更新的关联逻辑
4. **Vue 实例(入口)**
    - 作为整个 MVVM 的入口
    - 接收并解析配置项
    - 初始化 Observer、Compile 和 Watcher
    - 协调三者的关系，建立数据响应系统


### Vue响应式原理(如何实现数据双向绑定)
> https://github.com/Easay/issuesSets/issues/41

Vue采用**数据劫持** + **依赖收集** + **发布订阅模式**来实现响应式. 
Vue通过**数据劫持**（使用Object.defineProperty或Proxy）拦截数据的访问和修改，在数据被访问时进行**依赖收集**，在数据变化时通过**发布订阅模式**通知相关依赖进行更新。



### Vue的渲染过程
模板 → 编译成 `render` 函数 → 执行渲染生成 VNode → Diff 对比后更新 DOM。  
数据变更时，触发 `setter` → 通知组件重新渲染 → 生成新 VNode → Diff 更新。



### MVVM和MVC的区别?
在前端开发领域，MVVM (Model-View-ViewModel) 和 MVC (Model-View-Controller) 是两种常见的架构模式。它们有一些关键的区别：
#### **1. 核心角色与交互方式​**​
- ​**​MVC​**​：
    - ​**​Model​**​：数据层，负责业务逻辑和数据操作。
    - ​**​View​**​：UI层，直接展示数据（用户可见的界面）。
    - ​**​Controller​**​：协调层，接收用户输入，更新Model，并通知View刷新。
    - ​**​交互方式​**​:
        View触发事件 → Controller处理 → 更新Model → Model通知View更新（可能通过Controller或直接观察）。
- ​**​MVVM​**​：
    - ​**​Model​**​：数据层，与MVC相同。
    - ​**​View​**​：UI层，仅负责展示，不处理逻辑。
    - ​**​ViewModel​**​：中间层，将Model数据转换为View可用的形式（如格式化数据、命令绑定），并处理View的交互逻辑。
    - ​**​交互方式​**​：  
        View通过数据绑定（Data Binding）与ViewModel同步，ViewModel监听Model变化并自动更新View，无需手动操作DOM。

#### ​**​2. 数据流与控制方式​**​
- ​**​MVC​**​：
    - ​**​单向数据流​**​：用户操作 → Controller → Model → View（需要手动更新）。
    - ​**​Controller主导​**​：需要显式编写代码来更新View（如`document.getElementById().innerHTML`）。
- ​**​MVVM​**​：
    - ​**​双向数据绑定​**​：View和ViewModel自动同步（例如输入框修改数据，ViewModel中的属性即时更新，反之亦然）。
    - ​**​ViewModel驱动​**​：通过绑定机制（如Vue的`v-model`、Angular的`ngModel`）实现自动化，减少手动DOM操作。
#### ​**​3. 职责划分​**​
- ​**​MVC​**​：
    - View可能包含部分逻辑（如事件监听），Controller容易变得臃肿（尤其是复杂交互时）。
    - 需要开发者手动维护View和Model的一致性。
- ​**​MVVM​**​：
    - View完全被动，ViewModel处理所有展示逻辑和状态管理。
    - 解耦更彻底，适合数据驱动的UI（如表单、动态列表）。

#### ​**​4. 典型应用场景​**​
- ​**​MVC​**​：
    - 传统服务端渲染应用（如Ruby on Rails、Spring MVC）。
    - 需要直接操作DOM的场合（如jQuery项目）。
- ​**​MVVM​**​：
    - 现代前端框架（如Vue.js、Angular、Knockout）。
    - 需要频繁交互的动态页面（如实时表单验证、复杂SPA）。

### Vue 跟 React 有什么异同
- 相同
    - 都是**单向数据流**
    - 都使用了 **虚拟DOM** 技术
    - 都是基于**组件化开发** / 都支持 SSR
- 不同点
    - 视图实现: vue: template ; react: JSX
	- 数据改变: vue: 响应式; react: **手动 setState**
	- 事件绑定: vue: 双向绑定;   react: 单向绑定



### 说说你对 SPA 单页面的理解，它的优缺点分别是什么？
>[面试官：你对SPA单页面的理解，它的优缺点分别是什么？如何实现SPA应用呢 | web前端面试 - 面试官系列 (vue3js.cn)](https://vue3js.cn/interview/vue/spa.html)

#### 什么是SPA?
SPA（single-page application），单页应用`SPA`是一种网络应用程序或网站的模型,它只有一个主页面，有多个页面片段，它是通过页面的**动态重写**来改变页面显示内容从而实现和用户的交互，由于用户从始至终实际上都是在同一个主页面上，仅仅是页面资源的不同装载和添加，也就是说单页面应用**不会进行重新加载**，只有在我们需要的时候才回去检索必要的html,css,js资源，所以用户不会因为页面切换而打断用户体验

#### MPA
多页面应用，是传统的一种网站模型，与SPA完全不同，它由多个主页面构成，**每个页面都是主页面**，每次访问不同页面都需要重新加载不同的html,css,js资源，因此会频繁进行页面切换

#### 两者比较

|           | 单页面应用（SPA）     | 多页面应用（MPA）                   |
| --------- | -------------- | ---------------------------- |
| 组成        | 一个主页面和多个页面片段   | 多个主页面                        |
| 刷新方式      | 局部刷新           | 整页刷新                         |
| url模式     | 哈希模式           | 历史模式                         |
| SEO搜索引擎优化 | 难实现，可使用SSR方式改善 | 容易实现                         |
| 数据传递      | 容易             | 通过url、cookie、localStorage等传递 |
| 页面切换      | 速度快，用户体验良好     | 切换加载资源，速度慢，用户体验差             |
| 维护成本      | 相对容易           | 相对复杂                         |


#### SPA优缺点
优点：

- 具有桌面应用的即时性、网站的可移植性和可访问性
- 用户体验好、快，内容的改变不需要重新加载整个页面
- 良好的前后端分离，分工更明确

缺点：

- 不利于搜索引擎的抓取
- 首次渲染速度相对较慢


### Vue的template标签的作用

* template主要是作为一个占位符去使用
* 在vue2中,作为一个占位符去使用或在组件传递一个插槽内容. 无论什么内容,tempalte会在编译后被去除
	* 使用场景有: 组件模板定义(单文件组件中), 条件渲染包装元素, 循环渲染包装元素
* 在vue3中,同样作为占位符,某些情况下会被保留
	* 多根节点下,会被保留; 使用vfor,vif时,与vue2相同,会被移除.

### 虚拟DOM//?
>https://github.com/Easay/issuesSets/issues/48

虚拟DOM本质上是一个普通对象，是从VNode类实例化的对象。vnode可以理解成节点描述对象，描述了应该怎样去创建真实的DOM节点。

当状态发生变化时，更新与之关联的DOM节点，虚拟DOM是解决这一问题的方式之一。

通过状态生成一个虚拟节点树，然后使用虚拟节点树进行渲染。在渲染之前会使用新生成的虚拟节点树和之前的虚拟节点树进行对比，只渲染不同的部分。

vue2.0中，将组件级别作为一个watcher实例，即使一个组件内有10个节点使用了某个状态，但其实也只有一个watcher在观察这个状态的变化。当变化发生后，通知到组件，组件内再通过虚拟DOM进行比对与渲染。

#### 渲染过程
在Vue.js中使用模板来描述状态与DOM之间的映射关系。
* 模板编译成渲染函数
* 执行渲染函数得到虚拟节点树
* 与上一次得到的虚拟节点树进行对比（diff算法）
* 找出要更新的节点进行DOM操作
* 渲染视图


#### 虚拟 DOM 实现原理？
虚拟 DOM 的实现原理主要包括以下 3 部分：

用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；
diff 算法 — 比较两棵虚拟 DOM 树的差异；
pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。

如果对以上 3 个部分还不是很了解的同学，可以查看本文作者写的另一篇详解虚拟 DOM 的文章《[深入剖析：Vue核心之虚拟DOM](https://juejin.cn/post/6844903895467032589#heading-14)》




#### 虚拟DOM优缺点
> [30 道 Vue 面试题，内含详细讲解（涵盖入门到精通，自测 Vue 掌握程度） - 掘金 (juejin.cn)](https://juejin.cn/post/6844903918753808398#heading-12)

优点：
**保证性能下限**： 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；
**无需手动操作DOM**： 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；
**跨平台**： 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等。

缺点:
**无法进行极致优化**： 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。



### Vue数据流
1. Vue也是一个单向数据流的框架
2. Vue通过指令实现了双向数据绑定： v-model
3. v-model都做了哪些事情; `<input v-model='msg' />`
   1. 将指定变量的数据赋值给input的value
   2. 给当前的表单项自动绑定一个input事件，监听View层表单项数据发生改变获取最新value的同时更新Model的数据

### Vue单向数据流
* 父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。
* 每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

**两种常见的更改Prop的情况**
* prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。 在这种情况下，最好定义一个本地的 data 属性并将这个 prop 用作其初始值：
```vue
props: ['initialCounter'],
data: function () {
  return {
    counter: this.initialCounter
  }
}
```
* 这个 prop 以一种原始的值传入且需要进行转换。 在这种情况下，最好使用这个 prop 的值来定义一个计算属性
```vue
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```


### Vue中的异步更新队列
>https://github.com/Easay/issuesSets/issues/53

Vue在观察数据变化时并不是直接更新DOM,而是开启一个队列，然后缓冲在同一个时间下发生的所有的数据改变，同时去重，只有在下一个事件循环中，VUE才会刷新队列，执行新的内容

**什么时候DOM会更新完成呢？**
$neckTick执行时就是DOM更新完成后
所以我们对数据变化的DOM对象做处理时，应该在$nextTick函数中做处理

### $nextTick作用及原理
>https://github.com/Easay/issuesSets/issues/52

#### 是什么
nextTick方法接收一个回调函数，作用是将回调延迟到下一次DOM更新周期后执行，与全局nextTick方法一样，不同的回调的this会自动绑定到调用它的vm实例上。如果没有回调，则返回Promise。

#### 使用场景
更新数据后，需要对新DOM做一些操作，但此时我们还无法获得更新后的DOM，因为还没有重新渲染。这时需要用到nextTick方法。
```js
new Vue({
	methods: {
		example:function(){
			//修改数据
			this.message = 'change',
			// DOM还未更新
			this.$nextTick(function(){
					// DOM现在更新了
					// this绑定到更新后的当前vm实例
					this.doSomethingElse();
			})
		}
	}
})
```

当状态发生变化时，watcher会得到通知，然后触发虚拟DOM的渲染流程。而watcher触发渲染这个操作并不是同步的，而是异步的。Vue.js中有个队列，每次需要渲染时，就将watcher推入这个队列，在下一次事件循环中再让watcher触发渲染的流程。

#### 异步更新队列的原因
//待补充





### Vue组件间多种通信方式

#### 1) Vue2组件间通信方式列表

```
1) props
2) vue自定义事件
3) 全局事件总线
4) v-model
5) .sync 
6) $attrs与$listeners
7) $refs, $children与$parent
8) provide与inject
9) Vuex
10) 插槽 ==> 作用域插槽
```


#### Vue3组件间通信方式
```md
- props
- $emit
- expose / ref
- $attrs
- v-model
- provide / inject（原理：原型链）
- Vuex/pinia
- mitt
```


#### 2) 通信方式的选择

#### 根据通信的2个组件间的关系来选择一种通信方式

```
父子
	props
	vue自定义事件
	v-model
	.sync
	$refs, $children与$parent
	插槽 ==> 作用域插槽
祖孙
	$attrs与$listeners
	provide与inject
兄弟或其它/任意
	全局事件总线
	Vuex
```



#### 方式1: props 

```
1). 实现父向子通信: 属性值是非函数
2). 实现子向父通信: 属性值是函数
应用: 最基本, 用得最多的方式
```

#### 方式2: vue自定义事件
```
1). 用来实现子组件向父组件通信
2). 相关语法:
    父组件中给子组件绑定自定义事件监听:
      <Child @eventName="callback">
    子组件中分发事件
      this.$emit('eventName', data)
应用: elment-ui的组件的事件监听语法都用的是自定义事件
      我们项目中的组件也用了不少自定义事件
```



#### 方式3: 全局事件总线   ===> 消息订阅与发布

```
实现任意组件间通信
编码:
	将入口js中的vm作为全局事件总线对象: 
			beforeCreate() {
					Vue.prototype.$bus = this
			}
	分发事件/传递数据的组件: this.$bus.$emit('eventName', data)
	处理事件/接收数据的组件: this.$bus.$on('eventName', (data) => {})
    
应用: 前台项目中使用全局事件总线
```

#### 方式4: v-model
* 实现父子之间相互通信/同步
* 组件标签上的v-model的本质: 自定义input监听来接收子组件分发$emit的数据更新父组件数据
父组件: 
```vue
	<CustomInput v-model="name"/>
	<!-- 等价于 -->
	<CustomInput :value="name" @input="name=$event"/>
```

子组件: 
子组件需要使用`$emit`来触发v-model绑定的事件
```vue
<input type="text" :value="value" @input="$emit('input', $event.target.value)">

props: ['value']
```

应用: element-ui中的表单项相关组件都用了v-model: Input / Select / Checkbox / Radio

#### 方式5: .sync
实现父子之间相互通信/同步(在原本父向子的基础上增加子向父)
组件标签的属性上使用.sync的本质: 事件监听来接收子组件分发$emit过来的数据并更新父组件的数据
父组件:
```vue
<child :money.sync="total"/>
<!-- 等价于 -->
<Child :money="total" @update:money="total=$event"/>

data () {
	return {
		total: 1000
	}
},
```
子组件:
```vue
<button @click="$emit('update:money', money-100)">花钱</button>
props: ['money']
```
应用:  
element-ui在有显示隐藏的组件上: Dialog / Drawer

#### 方式6: `$attrs`与$listeners
**$attrs**
//实现当前组件的父组件向当前组件的子组件通信
父组件传递给子组件的属性,除了props已经声明接收的属性及父组件的style,class属性.
它是包含所有父组件传入的标签属性(排除props声明, class与style的属性)的对象
使用: 通过 v-bind="$attrs" 将父组件传入的n个属性数据传递给当前组件的子组件


**$listeners**
实现当前组件的子组件向当前组件的父组件通信
$listeners是包含所有父组件传入的自定义事件监听名与对应回调函数的对象
使用: 通过v-on="$listeners" 将父组件绑定给当前组件的事件监听绑定给当前组件的子组件
应用: 利用它封装了一个自定义的带hover文本提示的el-button

#### 方式7: `$refs & $children & $parent`
$refs
  实现父组件向指定子组件通信
  $refs是包含所有有ref属性的标签对象或组件对象的容器对象
  使用: 通过 this.$refs.child 得到子组件对象, 从而可以直接更新其数据或调用其方法更新数据
$children
实现父组件向多个子组件通信
$children是所有直接子组件对象的数组
使用: 通过this.$children 遍历子组件对象, 从而可以更新多个子组件的数据
$parent
  实现子组件向父组件通信
  $parent是当前组件的父组件对象
  使用: 通过this.$parent 得到父组件对象, 从而可以更新父组件的数据
应用: 在后台管理项目中使用了$refs

#### 方式8: provide与inject

```js
//provide于inject案例
export default{
    //
    provide(){
        return { //声明向所有后代提供2个数据
            content1:this.content1,
            content2:this.content2,
            updateContent:this.updateContent
        }
    }
}

export default{
    //
    inject:['content1', 'content2', 'updateContent'] //声明注入的属性会成为组件对象的属性
}

```

实现祖孙组件间直接通信
使用
在祖组件中通过provide配置向后代组件提供数据
在后代组件中通过inject配置来声明接收数据
注意:
不太建议在应用开发中使用, 一般用来封装vue插件
provide提供的数据本身不是响应式的 ==> 父组件更新了数据, 后代组件不会变化
provide提供的数据对象内部是响应式的 ==> 父组件更新了数据, 后代组件也会变化
应用: element-ui中的Form组件中使用了provide和inject



#### 方式9: vuex

- vuex用来统一管理多个组件共享的状态数据

- 任意要进行通信的2个组件利用vuex就可以实现

  A组件触发action或mutation调用, 将数据保存到vuex的状态中

  B组件读取vuex中的state或getters数据, 得到最新保存的数据进行显示
  
- 面试题

  1. mutation负责同步修改状态数据的，能不能异步修改

     可以异步修改

     如果异步修改的话会导致Vuex的调试工具失效，无法检测异步修改数据

  2. 设计的时候为什么建议mutation同步修改状态数据，而新增action负责异步

     Vuex的作用是给多个组件共享数据

     如果支持mutation异步修改数据，又因为异步的特性，会导致store对象中state数据发生错乱甚至是报错

     为了数据的安全

  3. Vuex刷新页面，数据丢失问题
```md
 //数据丢失原因
1.	Vuex数据保存在运行内存中，vue实例初始化的时候为其分配内存
2.	当刷新页面的时候重新初始化Vue实例，所以重新为Vuex分配内存导致之前保存的数据丢失

   //如何解决?
1.	Vuex的数据都是每次组件加载时候动态请求获取数据保存
a)	优点： 保证数据不会丢失
b)	缺点: 性能差，因为网络问题可能有网络延迟

2.	将Vuex中的数据每次同步更新保存到sessionStorage中
a)	优点: 每次页面刷新后从sessionStorage中获取保存的数据，不会丢失
b)	缺点: state中的数据是动态的，就需要一直要同步到sessionStorage中，性能差

3.	在页面刷新之前获取Vuex的数据，将数据保存在sessionStorage中，页面加载后从sessionStorage中获取
a)	优点: 减少动态更新sessionStorage的次数，性能好
b)	重点: 给window绑定beforeunload事件监听

4.插件
使用持久化插件：可以使用Vuex持久化插件如vuex-persistedstate或vuex-along来将Vuex存储在浏览器的localStorage或cookie中，以便在刷新页面时保留数据状态。
```


```js
//绑定事件监听: 在页面卸载(关闭)或刷新时候保存当前数据
// beforeunload 页面即将刷新之前调用
window.addEventListener('beforeupload', () => {
    sessionStorage.setItem('test2', JSON.stringify(this.personArr))
})
// 读取sessionStorage中是否有之前缓存的数据
let personArr = sessionStorage.getItem('test2')
// 如果有： 更新Vuex中状态数据
personArr && this.changePersonArrMutation(JSON.parse(personArr))
```



#### 方式10:  插槽/作用域插槽slot-scope
实现父组件向子组件传递标签内容
  什么情况下使用作用域插槽?
  父组件需要向子组件传递标签结构内容,但决定父组件传递怎样标签结构的数据在子组件中
编码:
子组件:
```vue
<slot :row="item" :$index="index">  <!-- slot的属性会自动传递给父组件 -->
</slot>
```
父组件:
```vue
<template slot-scope="{row, $index}">
		<span>{{$index+1}}</span> &nbsp;&nbsp;
		<span :style="{color: $index%2===1 ? 'blue' : 'green'}" >{{row.text}}</span>
</template>
```
应用: element-ui中的Table组件


### computed与method和watch的区别

- **computed** 
  1. 支持缓存，多次读取, 只会执行一次计算, 只有依赖数据发生改变，才会重新进行计算 
  2. 不支持异步，当computed内有异步操作时无效，无法监听数据的变化
  3. 底层用到的是对象set和get方法: 简写为函数形式,就是get方法;完整写法为对象,get+set方法;
     1. setter和getter中的this上下文自动绑定为Vue实例;如果使用箭头函数形式, 可以将实例作为第一个参数
  4. 执行时机: 初始化时; 当依赖数据发生变化时;

- **method**
  - 没有缓存, 多次读取, 必须多次调用

- **watch**
  1. watch支持异步；
  2. 监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值；
  3. 当一个属性发生变化时，需要执行对应的操作；一对多；
  4. 监听数据必须是一个响应式数据(data/props/computed)
	  1. immediate：组件加载立即触发回调函数执行，
	  2. deep: 深度监听，为了发现**对象内部值**的变化，复杂类型的数据时使用，例如数组中的对象内容的改变
  5. 执行时机: 初始化, mounted后执行(mounted 钩子函数会在 watch 中的 handler 函数之前执行，因为 mounted 是在组件渲染完毕后执行的，而 watch 监听的数据变化需要等到组件渲染完毕后才能触发。)



### Vue 列表为什么加 key？

#### 是什么
> key是给每一个vnode的唯一id，也是diff的一种优化策略，可以根据key，更准确， 更快的找到对应的vnode节点


#### 背后逻辑
* 在使用`v-for`时，需要给单元加上`key`

- 如果不用key，Vue会采用**就地复用**原则：最小化element的移动，并且会尝试尽最大程度在同适当的地方对相同类型的element，做patch或者reuse。
  
- 如果使用了key，Vue会根据keys的顺序记录element，曾经拥有了key的element如果不再出现的话，会被直接remove或者destoryed


因为Vue在进行列表渲染时的优化策略涉及到了Virtual DOM，而在渲染Virtual DOM时，需要对比新旧节点的变化，如果没有唯一的key属性，Vue无法准确地追踪每个节点的变化情况。

通过给每个列表项加上唯一的key属性，Vue能够更加高效地渲染视图，提高渲染性能。同时，在使用列表组件时，key属性也可以用于优化过渡动画效果，确保在列表项被添加或删除时，动画效果能够正确地触发。

### Class 与 Style 如何动态绑定？
Class 可以通过对象语法和数组语法进行动态绑定：

对象语法：
```vue
<div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
data: {
  isActive: true,
  hasError: false
}
```
<div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>

数组语法：
```vue
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>


data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```


Style也可以通过对象语法和数组语法进行动态绑定：

对象语法：
```vue
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>


data: {
  activeColor: 'red',
  fontSize: 30
}
```
数组语法：
```vue
<div v-bind:style="[styleColor, styleSize]"></div>

data: {
  styleColor: {
     color: 'red'
   },
  styleSize:{
     fontSize:'23px'
  }
}
```




### 直接给一个数组项赋值，Vue 能检测到变化吗？
由于 JavaScript 的限制，Vue 不能检测到以下数组的变动：
* 当你利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
* 当你修改数组的长度时，例如：`vm.items.length = newLength`

为了解决第一个问题，Vue 提供了以下操作方法：
```js
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
// vm.$set，Vue.set的一个别名
vm.$set(vm.items, indexOfItem, newValue)
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```
为了解决第二个问题，Vue 提供了以下操作方法：
```js
// Array.prototype.splice
vm.items.splice(newLength)
```


### vfor与vif同时使用的问题?

> 在官方文档中明确指出**v-for和v-if不建议一起使用**。 原因：v-for比v-if优先级高，所以使用的话，每次v-for都会执行v-if,造成不必要的计算，影响性能，尤其是当之需要渲染很小一部分的时候。

`v-for` 和 `v-if` 同时使用有 3 种情景：

1. 部分遍历（内/外部条件）：一个 `list` 中某个属性值符合条件的遍历出来；
2. 全部遍历（外部条件）：某外部条件符合条件时遍历全部。
3. 全部遍历（内部条件）：根据某内部条件渲染出不同的内容。

#### 解决方案:

##### 使用计算属性

> 在计算属性中先用内/外部条件处理数据，再遍历处理后的数据

```javascript
<!-- 遍历list，条件是值小于100 方案：使用计算属性activeList首先筛选出符合条件的值再直接遍历 -->
<ul>
  <li v-for="item in activeList" :key="item"></li>
</ul>

export default {
  data() {
    return {
      list: [78, 90, 20, 45, 66, 120, 136]
    }
  },
  computed: {
    activeList() {
      return this.list.filter((item) => item < 100)
    }
  }
}
```



##### 条件放于父元素(外部条件)

> 解决方案：外部条件放到遍历的父级元素上，没有父级可以使用`<template></template>`。

```html
<ul v-if="isActive">
  <li v-for="item in list" :key="item"></li>
</ul>
<!-- or -->
<div>
  <template v-if="isActive">
    <span v-for="item in list" :key="item"></span>
  </template>
  <p>Hello,My name is Lillian!</p>
</div>

<script>
export default {
  data() {
    return {
      isActive: true,
      list: [78, 90, 20, 45, 66, 120, 136]
    }
  }
}
</script>
```



##### 遍历`template`(内部条件)

> 根据某内部条件，显示不同内容。注意 `key` 不能放 `template` 标签上

```html
<div>
  <template v-for="item in list">
    <span v-if="item.type===0" :key="item.id">文字+图标</span>
    <span v-if="item.type===1" :key="item.id">文字+文字</span>
    <span v-else :key="item.id">其他</span>
  </template>
</div>
```

`vue` 中会优先执行 `v-for`, 当 `v-for` 把所有内容全部遍历之后 , `v-if` 再对已经遍历的元素进行删除 , 造成了加载的浪费 , 所以应该尽量在执行 `v-for` 之前优先执行 `v-if` , 可以减少加载的压力。







### 为什么组件中的data必须是函数形式？

- Vue解析组件标签时，会创建一个新的组件实例对象
- 每个组件实例对象, 都需要有自己的data数据对象
- 如果data配置是对象, 就会导致同个组件的多个实例共享一个data对象
- 如果data是函数, 组件的多个实例的data对象是各自的, 是多份



### 如何理解vue的渐进式

![](https://img-blog.csdn.net/201806191038393?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dhbmd6dW5rdWFu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)



所谓的渐进式框架,就是把框架分层.

最核心的部分是视图层渲染,然后往外是组件机制,在这个基础上再加入路由机制,再加入状态管理,最外层是构建工具.

所谓分层,就是说你既可以只用最核心的视图层渲染功能来快速开发一些需求,也可以使用一整套全家桶来开发大型应用.




### Vue实例的生命周期

#### 是什么

> 每个 Vue 实例在被创建时都要经过一系列的初始化过程, 这个过程中也会运行一些叫做**生命周期钩子**的函数，这给了用户在不同阶段添加自己的代码的机会


#### Vue生命周期说明

* 有什么
* 三个阶段
  * 挂载阶段=>beforeCreate、created、beforeMounted、mounted
  * 更新阶段=>beforeUpdate、updated
  * 销毁阶段 beforeDestroy、destroyed
* 每个阶段适合干什么
  * created：实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到el属性，el属性，ref属性内容为空数组常用于简单的ajax请求
  * 页面的初始化 beforeMount 在挂载开始之前被调用，beforeMount之前，会找到对应的template，并编译成render函数 
  * mounted：实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，$ref属性可以访问常用于获取VNode信息和操作，ajax请求
  * beforeupdate：响应式数据更新时调用，发生在虚拟DOM打补丁之前，适合在更新之前访问现有的DOM，比如手动移除已添加的事件监听器 
  * updated：虚拟 DOM 重新渲染和打补丁之后调用，组件DOM已经更新，可执行依赖于DOM的操作避免在这个钩子函数中操作数据，可能陷入死循环 
  * beforeDestroy：实例销毁之前调用。这一步，实例仍然完全可用，this仍能获取到实例，常用于销毁定时器、解绑全局事件、销毁插件对象等操作

| 生命周期钩子    | 说明                                                         | 对应上述步骤   |
| --------------- | ------------------------------------------------------------ | -------------- |
| `beforeCreate`  | 初始化实例前，`data`、`methods`等不可获取                    | 1 之后，2 之前 |
| `created`       | 实例初始化完成，此时可获取`data`里数据和`methods`事件，无法获取 DOM | 2 之后，3 之前 |
| `beforeMount`   | 虚拟 DOM 创建完成，此时未挂载到页面中，`vm.$el`可获取未挂载模板 | 3 之后，4 之前 |
| `mounted`       | 数据绑定完成，真实 DOM 已挂载到页面，`vm.$el`可获取真实 DOM  | 4 之后         |
| `beforeUpdate`  | 数据更新，DOM Diff 得到差异，未更新到页面                    | 5 之后，6 之前 |
| `updated`       | 数据更新，页面也已更新                                       | 6 之后         |
| `beforeDestroy` | 实例销毁前                                                   | 7 之前         |
| `destroyed`     | 实例销毁完成                                                 | 7 之后         |





#### 重要生命周期函数（开发中常用） 

- **created / mounted** 

  发送AJAX请求、设置定时器等一次性任务

  created速度更快

- **beforeDestroy** 

  做一些收尾工作：取消AJAX请求，清除定时器等



#### Vue2与Vue3生命周期比较
- `beforeCreate` -> 使用 `setup()`
- `created` -> 使用 `setup()`
- `beforeMount` -> `onBeforeMount`
- `mounted` -> `onMounted`
- `beforeUpdate` -> `onBeforeUpdate`
- `updated` -> `onUpdated`
- `beforeDestroy` -> `onBeforeUnmount`
- `destroyed` -> `onUnmounted`
- `errorCaptured` -> `onErrorCaptured`


#### 父子组件的更新
**加载渲染过程**
父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

**子组件更新过程**
父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

**父组件更新过程**
父 beforeUpdate -> 父 updated

**销毁过程**
父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed




#### 周期函数补充

- 动态组件

  `<component :is="comName"></component>`  is属性来切换不同的组件

  正常传入props数据就可以接受到

- 缓存组件

  ```vue
  <keep-alive :include="['a','b']>
    <component :is="view"></component>
  </keep-alive>
  ```

- **errorCaptured(errObj, errVM, errMsg)**

  捕获一个来自子孙组件的错误时被调用

  return false // 阻止错误继续向上传播，并且不会在浏览器控制台抛出错误

  参数：错误对象，抛出错误的实例，错误信息



动态`<component>`案例

```vue
// src/comopnents/baseComponents/baseForm/index.vue

<template>
	<div @clik.stop>
    <component
    	:is="componentId"
      v-bind="$attrs"
      @click="(param) => this.$emit('click', param)"
    ></component>
  </div>
</template>


<script>
	import baseInput from "./baseInput"
  import baseSelect from "./baseSelectCustom"; // 定制版
  import baseTime from "./baseTime";
  import baseCheck from "./baseCheck";
  import baseJudge from "./baseJudge";
  import baseupload from "./baseupload";
  import baseSelectQuery from "./baseSelectQuery";
  import baseSelectQuery_two from "./baseFromMask_two";
  import baseSearchShll from "./baseSearchShll";
  import baseCheckTwo from "./basecheckTwo";
  import baseTime_two from "./baseTime_two";
  import baseCheckthree from "./baseCheckthree";
  import baseInputTwo from "./baseInputTwo";
  import baseuploadMetering from "./baseuploadMetering";
  import baseInputSelects from "./baseInputSelects";
  import basejudeFlag from "./basejudeFlag"
  import basePopup from "./baseInputpopup";
  import baseInforSearchShll from "./baseInforSearchShll";
  import baseTimeashdas from "./baseTimeashdas";
  import baseJudges from "./baseJudges";
  import baseJudgetb from "./baseJudgetb";
  
  export default {
    name: 'baseFrom',
    components: {
      baseInput,
      baseSelect,
      baseTime,
      baseCheck,
      baseJudge,
      baseupload,
      baseSelectQuery,
      baseSelectQuery_two,
      baseSearchShll,
      baseCheckTwo,
      baseTime_two,
      baseCheckthree,
      baseInputTwo, 
      baseuploadMetering,
      baseInputSelects,
      basejudeFlag,
      basePopup,
      baseInforSearchShll,
      baseTimeashdas,
      baseJudges,
      baseJudgetb,
    },
    props: {
      type: {type:String, default: '1'}
    },
    computed: {
      componentId() {
        return [
          "baseInput",//ok
          "baseSelect",//ok
          "baseTime",//ok
          "baseCheck",//ok
          "baseJudge",//ok
          "baseupload",//该组件默认不可修改
          "baseSelectQuery",//ok
          "baseSelectQuery_two",//
          "baseSearchShll",//9
          "baseCheckTwo",//ok
          "baseTime_two",//ok
          "baseCheckthree",//ok
          "baseInputTwo", //13ok
          "baseuploadMetering", // 14
          "baseInputSelects",//15
          "basejudeFlag",//16
          "basePopup",
          'baseInforSearchShll',//18ok
          'baseTimeashdas',//19ok
          'baseJudges',//20ok
          'baseJudgetb',//21ok
        ][this.type - 1];
      }
    }
  }
</script>
```



```vue
// 其他组件调用baseForm

<!-- 发电用户普查 -->
<article class="publicData" v-show="powerUsers">
  <template v-for="(item, index) in publicEntryList">
	<baseFrom
          v-if="[19].indexOf(index) != -1"
          :key="index"
          v-bind="item"
          v-model="publicEntryList[index]"
          @click="entryList($event, item, index)"
          />
  </template>
</article>
```



##### 在缓存组件的基础上存在的声明周期

- **activated()**

  每次缓存组件被激活时就会调用

- **deactivated()**

  缓存的组件停用时调用，可替代destroyed


#### 父子组件的生命周期

```js
子组件初始化: 在父组件beforeMount-->mounted之间 执行beforeCreated->mounted4个钩子
子组件更新: 在父组件beforeUpdate->updated之间 执行2个钩子
子组件死亡: 在父组件beforeDestroy->destroyed之间 执行2个钩子
```

- 初始化:
  - beforeCreate
  - created
  - beforeMount
  - *--child beforeCreate*
  - *--child created*
  - *--child beforeMount*
  - *--child mounted*
  - mounted
- 更新:
  - beforeUpdate
  - *--child beforeUpdate*
  - *--child updated*
  - updated
- 死亡:
  - beforeDestroy
  - *-- child beforeDestroy*
  - *-- child destroyed*
  - destroyed


#### 父组件可以监听到子组件的生命周期吗？
比如有父组件 Parent 和子组件 Child，如果父组件监听到子组件挂载 mounted 就做一些逻辑处理，可以通过以下写法实现：
```ts
// Parent.vue
<Child @mounted="doSomething"/>
    
// Child.vue
mounted() {
  this.$emit("mounted");
}
```

以上需要手动通过 $emit 触发父组件的事件，更简单的方式可以在父组件引用子组件时通过 @hook 来监听即可，如下所示：
```ts
//  Parent.vue
<Child @hook:mounted="doSomething" ></Child>

doSomething() {
   console.log('父组件监听到 mounted 钩子函数 ...');
},
    
//  Child.vue
mounted(){
   console.log('子组件触发 mounted 钩子函数 ...');
},    
    
// 以上输出顺序为：
// 子组件触发 mounted 钩子函数 ...
// 父组件监听到 mounted 钩子函数 ...  
```
当然 @hook 方法不仅仅是可以监听 mounted，其它的生命周期事件，例如：created，updated 等都可以监听。



### keep-alive
#### 是什么
keep-alive是vue的内置组件，能在组件切换过程中将状态保留在内存中，相当于缓存，防止DOM的重复渲染；

#### 基本用法
* keep-alive有三个属性：include（只有名字匹配的才会被缓存）、exclude（任何名字匹配的都不会被缓存）、max（最多可以缓存多少个组件）。
* 一般结合路由和动态组件一起使用，用于缓存组件；
* 提供 include 和 exclude 属性，两者都支持字符串或正则表达式， include 表示只有名称匹配的组件会被缓存，exclude 表示任何名称匹配的组件都不会被缓存 ，其中 exclude 的优先级比 include 高；
* 对应两个钩子函数 activated 和 deactivated ，当组件被激活时，触发钩子函数 activated，当组件被移除时，触发钩子函数 deactivated。

#### 生命周期
- 首次进入组件时：`beforeRouteEnter` > `beforeCreate` > `created`> `mounted` > `activated` > ... ... > `beforeRouteLeave` > `deactivated`
- 再次进入组件时：`beforeRouteEnter` >`activated` > ... ... > `beforeRouteLeave` > `deactivated`


#### 实例
**缓存后如何获取数据?**
1. beforeRouteEnter
2. actived

### Vue常用的修饰符及应用场景

#### 是什么
修饰符是用于限定类型以及类型成员的声明的一种符号
在`Vue`中，修饰符处理了许多`DOM`事件的细节，让我们不再需要花大量的时间去处理这些烦恼的事情

#### 分类
- 表单修饰符
- 事件修饰符
- 鼠标按键修饰符
- 键值修饰符
- v-bind修饰符

#### 表单修饰符
表单的修饰符有如下：

- lazy
- trim
- number
##### [#](https://vue3js.cn/interview/vue/modifier.html#lazy)lazy
在我们填完信息，光标离开标签的时候，才会将值赋予给`value`，也就是在`change`事件之后再进行信息同步

```
<input type="text" v-model.lazy="value">
<p>{{value}}</p>
```


##### [#](https://vue3js.cn/interview/vue/modifier.html#trim)trim
自动过滤用户输入的首尾空格字符，而中间的空格不会过滤

```
<input type="text" v-model.trim="value">
```


##### [#](https://vue3js.cn/interview/vue/modifier.html#number)number
自动将用户的输入值转为数值类型，但如果这个值无法被`parseFloat`解析，则会返回原来的值

```
<input v-model.number="age" type="number">
```


#### 事件修饰符
事件修饰符是对事件捕获以及目标进行了处理，有如下修饰符：
- stop
- prevent
- self
- once
- capture
- passive
- native
##### stop
阻止了事件冒泡，相当于调用了`event.stopPropagation`方法

```
<div @click="shout(2)">
  <button @click.stop="shout(1)">ok</button>
</div>
//只输出1
```

##### [#](https://vue3js.cn/interview/vue/modifier.html#prevent)prevent
阻止了事件的默认行为，相当于调用了`event.preventDefault`方法

```
<form v-on:submit.prevent="onSubmit"></form>
```


##### [#](https://vue3js.cn/interview/vue/modifier.html#self)self
只当在 `event.target` 是当前元素自身时触发处理函数

```
<div v-on:click.self="doThat">...</div>
```

> 使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 `v-on:click.prevent.self` 会阻止**所有的点击**，而 `v-on:click.self.prevent` 只会阻止对元素自身的点击

event.target vs. event.currentTarget

| ​**​属性​**​                    | ​**​描述​**​                  | ​**​示例场景​**​                                                         |
| ----------------------------- | --------------------------- | -------------------------------------------------------------------- |
| ​**​`event.target`​**​        | 触发事件的​**​实际元素​**​（事件起源的元素）。 | 点击 `<button>` 内部的 `<span>`，`target` 是 `<span>`。                      |
| ​**​`event.currentTarget`​**​ | 当前正在处理事件的元素（绑定事件监听器的元素）。    | 点击 `<button>` 内部的 `<span>`，`currentTarget` 是 `<button>`（如果事件绑定在按钮上）。 |

Vue 的事件修饰符 `.self` 用于确保事件​**​仅在 `event.currentTarget` 是触发元素时才执行​**​（即事件不是从子元素冒泡上来的）。

​**​作用​**​：
- 只有当用户​**​直接点击绑定事件的元素本身​**​（而非子元素）时，事件才会触发。
- 本质是通过检查 `event.target === event.currentTarget` 实现的。


**使用场景**
* 避免意外冒泡​​：
当父容器有事件逻辑，但子元素（如按钮、图标）不应触发时，使用 .self。
```html
<div @click.self="closeModal">
  <button>我不触发closeModal</button>
</div>
```

* 精确控制事件源​​：
仅在点击特定区域（如遮罩层）时执行操作，忽略内部内容。



#### [once](https://vue3js.cn/interview/vue/modifier.html#once)

绑定了事件以后只能触发一次，第二次就不会触发

```
<button @click.once="shout(1)">ok</button>
```

##### [#](https://vue3js.cn/interview/vue/modifier.html#capture)capture
使事件触发从包含这个元素的顶层开始往下触发

```
<div @click.capture="shout(1)">
    obj1
<div @click.capture="shout(2)">
    obj2
<div @click="shout(3)">
    obj3
<div @click="shout(4)">
    obj4
</div>
</div>
</div>
</div>
// 输出结构: 1 2 4 3 
```


##### [#](https://vue3js.cn/interview/vue/modifier.html#passive)passive

在移动端，当我们在监听元素滚动事件的时候，会一直触发`onscroll`事件会让我们的网页变卡，因此我们使用这个修饰符的时候，相当于给`onscroll`事件整了一个`.lazy`修饰符

```
<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

> 不要把 `.passive` 和 `.prevent` 一起使用,因为 `.prevent` 将会被忽略，同时浏览器可能会向你展示一个警告。
> 
> `passive` 会告诉浏览器你不想阻止事件的默认行为

##### [#](https://vue3js.cn/interview/vue/modifier.html#native)native

让组件变成像`html`内置标签那样监听根元素的原生事件，否则组件上使用 `v-on` 只会监听自定义事件

```
<my-component v-on:click.native="doSomething"></my-component>
```


> 使用.native修饰符来操作普通HTML标签是会令事件失效的


#### 鼠标按钮修饰符
鼠标按钮修饰符针对的就是左键、右键、中键点击，有如下：
- left 左键点击
- right 右键点击
- middle 中键点击

```
<button @click.left="shout(1)">ok</button>
<button @click.right="shout(1)">ok</button>
<button @click.middle="shout(1)">ok</button>
```

#### 键盘修饰符
键盘修饰符是用来修饰键盘事件（`onkeyup`，`onkeydown`）的，有如下：

`keyCode`存在很多，但`vue`为我们提供了别名，分为以下两种：

- 普通键（enter、tab、delete、space、esc、up...）
- 系统修饰键（ctrl、alt、meta、shift...）

#### v-bind修饰符
v-bind修饰符主要是为属性进行操作，用来分别有如下：
- `.prop` - 作为一个 DOM property 绑定而不是作为 attribute 绑定。([差别在哪里？](https://stackoverflow.com/questions/6003819/properties-and-attributes-in-html#answer-6004028))
- `.camel` - (2.1.0+) 将 kebab-case attribute 名转换为 camelCase。(从 2.1.0 开始支持)
- `.sync` (2.3.0+) 语法糖，会扩展成一个更新父组件绑定值的 `v-on` 侦听器。





##### [#](https://vue3js.cn/interview/vue/modifier.html#async)sync

能对`props`进行一个双向绑定

```
//父组件
<comp :myMessage.sync="bar"></comp> 
//子组件
this.$emit('update:myMessage',params);
```


以上这种方法相当于以下的简写

```
//父亲组件
<comp :myMessage="bar" @update:myMessage="func"></comp>
func(e){
 this.bar = e;
}
//子组件js
func2(){
  this.$emit('update:myMessage',params);
}
```


使用`async`需要注意以下两点：

- 使用`sync`的时候，子组件传递的事件名格式必须为`update:value`，其中`value`必须与子组件中`props`中声明的名称完全一致
  
- 注意带有 `.sync` 修饰符的 `v-bind` 不能和表达式一起使用
  
- 将 `v-bind.sync` 用在一个字面量的对象上，例如 `v-bind.sync=”{ title: doc.title }”`，是无法正常工作的
  

##### [#](https://vue3js.cn/interview/vue/modifier.html#props)props

设置自定义标签属性，避免暴露数据，防止污染HTML结构

```
<input id="uid" title="title1" value="1" :index.prop="index">
```

##### [#](https://vue3js.cn/interview/vue/modifier.html#camel)camel

将命名变为驼峰命名法，如将`view-Box`属性名转换为 `viewBox`

```
<svg :viewBox="viewBox"></svg>
```


### v-model 

#### 原理
我们在 vue 项目中主要使用 v-model 指令在表单 input、textarea、select 等元素上创建双向数据绑定，我们知道 v-model 本质上不过是语法糖，v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：
* text 和 textarea 元素使用 value 属性和 input 事件；
* checkbox 和 radio 使用 checked 属性和 change 事件；
* select 使用value属性和change事件。
以 input 表单元素为例：
```vue
<input v-model='something'>
    
//相当于
<input v-bind:value="something" v-on:input="something = $event.target.value">



<input type="checkbox" v-model="checkboxVal" />
<input type="checkbox" v-bind:checked="checkboxVal" v-on:change="checkboxVal=$event.target.checked"/>

<select type="select" v-model="selectVal" />
<select v-bind:value="selectVal" v-on:change="selectVal=$event.target.value" />
```
如果在自定义组件中，v-model 默认会利用名为 value 的 prop 和名为 input 的事件，如下所示：
```js
父组件：
<ModelChild v-model="message"></ModelChild>

子组件：
<div>{{value}}</div>

props:{
    value: String
},
methods: {
  test1(){
     this.$emit('input', '小红')
  },
}
```

但是像单选框、复选框等类型的输入控件可能会将 `value` attribute 用于[不同的目的](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)。<span style="color:blue;">**`model` 选项**可以用来声明v-model传递的属性和事件名称</span>,仍需要在组件的props选项中声明这个属性.

```html

<script>
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean  //props中需要接收绑定传递的v-model属性
  },
  template: `
  	<input
  		type="checkbox"
  		v-bind:checked="checked"
  		v-on:change="$emit('change', $event.target.value)"
  `
})
</script>  


<base-checkbox v-model="test"></base-checkbox>
```


#### 在组件上使用


### Vue自定义指令
#### 是什么
看到的`v-`开头的行内属性，都是指令，不同的指令可以完成或实现不同的功能

除了核心功能默认内置的指令 (`v-model` 和 `v-show`)，`Vue` 也允许注册自定义指令

指令使用的几种方式：
```js
//会实例化一个指令，但这个指令没有参数 
`v-xxx`

// -- 将值传到指令中
`v-xxx="value"`  

// -- 将字符串传入到指令中，如`v-html="'<p>内容</p>'"`
`v-xxx="'string'"` 

// -- 传参数（`arg`），如`v-bind:class="className"`
`v-xxx:arg="value"` 

// -- 使用修饰符（`modifier`）
`v-xxx:arg.modifier="value"` 
```


#### 如何实现
注册一个自定义指令有全局注册与局部注册

全局注册主要是通过`Vue.directive`方法进行注册
`Vue.directive`第一个参数是指令的名字（不需要写上`v-`前缀），第二个参数可以是对象数据，也可以是一个指令函数
```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
  }
})
```

局部注册通过在组件`options`选项中设置`directive`属性
```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus() // 页面加载完成之后自动让输入框获取到焦点的小功能
    }
  }
}
```

自定义指令也像组件那样存在钩子函数：
- `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
  
- `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
  
- `update`：所在组件的 `VNode` 更新时调用，但是可能发生在其子 `VNode` 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
  
- `componentUpdated`：指令所在组件的 `VNode` 及其子 `VNode` 全部更新后调用
  
- `unbind`：只调用一次，指令与元素解绑时调用
  

所有的钩子函数的参数都有以下：

- `el`：指令所绑定的元素，可以用来直接操作 `DOM`
- `binding`：一个对象，包含以下 `property`：
    - `name`：指令名，不包括 `v-` 前缀。
    - `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
    - `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
    - `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
    - `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
    - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`
- `vnode`：`Vue` 编译生成的虚拟节点
- `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用

> 除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 `dataset` 来进行

例子:
```
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
<script>
    Vue.directive('demo', function (el, binding) {
    console.log(binding.value.color) // "white"
    console.log(binding.value.text)  // "hello!"
    })
</script>
```


#### 应用场景
- 表单防止重复提交
- 图片懒加载
- 一键 Copy的功能
- 实现v-bind
* 实现v-for
* 实现v-if/show等等


##### 权限控制
[[Vue2 doc#^5b5ab6]]

##### 表单防止重复提交
```js
Vue.directive('throttle', {
	bind:(el,binding) => {
		let throttleTime = binding.value
		if (!throttleTime) {
			throttleTime = 2000
		}
		let timeId;
		el.addEventListener('click', event => {
			if (!timeId) {
				timeId = setTimeout(() => {
					timeId = null
				},throttleTime)
			} else {
				event && event.stopImmediatePropagation()
			}
		}, true) // true 表示在捕获阶段处理事件
	}
})
```


##### 一键copy功能
```js
import { Message } from 'ant-design-vue';

const vCopy = { //
  /*
    bind 钩子函数，第一次绑定时调用，可以在这里做初始化设置
    el: 作用的 dom 对象
    value: 传给指令的值，也就是我们要 copy 的值
  */
  bind(el, { value }) {
    el.$value = value; // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
    el.handler = () => {
      if (!el.$value) {
      // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
        Message.warning('无复制内容');
        return;
      }
      // 动态创建 textarea 标签
      const textarea = document.createElement('textarea');
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = 'readonly';
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = el.$value;
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea);
      // 选中值并复制
      textarea.select();
      // textarea.setSelectionRange(0, textarea.value.length);
      const result = document.execCommand('Copy');
      if (result) {
        Message.success('复制成功');
      }
      document.body.removeChild(textarea);
    };
    // 绑定点击事件，就是所谓的一键 copy 啦
    el.addEventListener('click', el.handler);
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el.$value = value;
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler);
  },
};

export default vCopy;
```


### Vue中的过滤器
#### 是什么
对数据进行格式化处理

#### 如何使用
`vue`中的过滤器可以用在两个地方：双花括号插值和 `v-bind` 表达式，过滤器应该被添加在 `JavaScript`表达式的尾部，由“管道”符号指示：
```
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```

#### 定义filter
在组件的选项中定义本地的过滤器
```
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

定义全局过滤器：
```
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```


#### 特点
- 局部过滤器优先于全局过滤器被调用
- 一个表达式可以使用多个过滤器。过滤器之间需要用管道符“|”隔开。其执行顺序从左往右


#### 应用场景
需要用到过滤器的地方有很多，比如单位转换、数字打点、文本格式化、时间格式化之类的等

**千分位符**
```
Vue.filter('toThousandFilter', function (value) {
     if (!value) return ''
     value = value.toString()
     return .replace(str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g, '$1,')
})
```


#### 原理分析
> https://vue3js.cn/interview/vue/filter.html#%E4%BA%8C%E3%80%81%E5%A6%82%E4%BD%95%E7%94%A8:~:text=%23-,%E5%9B%9B%E3%80%81%E5%8E%9F%E7%90%86%E5%88%86%E6%9E%90,-%E4%BD%BF%E7%94%A8%E8%BF%87%E6%BB%A4%E5%99%A8


### Vue中style scoped原理
Vue中的`scoped`样式是一种用于组件样式隔离的重要特性。以下是它的工作原理：
1. 编译过程： 当你在Vue组件中使用`<style scoped>`时，Vue会在编译阶段处理这些样式。
2. 添加唯一属性： Vue会为组件的根元素添加一个唯一的属性，类似于`data-v-f3f3eg9`。
3. 选择器转换： 在编译过程中，所有的选择器都会被转换。例如：
```css
.example { color: red; }
```
`
会被转换为：
```css
.example[data-v-f3f3eg9] { color: red; }
```

4. HTML元素标记： 组件模板中的所有HTML元素也会被添加这个唯一属性。
5. 样式隔离： 由于选择器现在包含了唯一属性，样式就只会应用到拥有对应属性的元素上，从而实现了样式隔离。
6. 深度选择器： 如果你需要影响子组件的样式，可以使用`::v-deep`或`/deep/`。
优点：
- 防止样式冲突
- 提高代码可维护性

缺点：
- 略微增加了编译时间和生成的CSS大小
需要注意的是，`scoped`并不能阻止子组件的根元素被父组件的样式影响。


### Vue.use
1. 自定义Vue插件需要向外暴露对象或者是函数
2. 如果向外暴露对象的话，对象中必须有install方法
3. 如果向外暴露的是函数的话，那么该函数本身就是install方法
4. 当Vue.use()的时候，会自动调用install方法，并且将Vue对象作为实参传入到install方法中

```js

//main.js
import Directives from './directives'
Vue.use(Directives)


//directives/index.js
import copy from "./copy";
import longpress from "./longpress";
import debounce from "./debounce";
import emoji from "./emoji";
import lazyLoad from "./lazyLoad";
import permission from "./permission";
import waterMarker from "./waterMaker";
import draggable from "./draggable";

  

const directives = {
	copy,
	longpress,
	debounce,
	emoji,
	lazyLoad,
	permission,
	waterMarker,
	draggable
};

export default {
	install(Vue) {
		Object.keys(directives).forEach((key) => {
			Vue.directive(key, directives[key]);
		});
	}
};
```





### 带缓存的路由组件生命周期keep-alive

```js
路由组件添加<keep-alive></keep-alive>之后,在mounted之后会出现activated
总结:路由组件生命钩子activated是在挂在mounted之后.离开的路由组件生命周期钩子deactivated是在进入的路由组件生命钩子mounted之前调用

(路由组件,activated是在自身mounted之后;deactivated是在进入其他路由组件mounted之前调用)
当前组件激活总是最后一个

 同级路由组件:离开一个进入一个 ++表示进入的路由组件,没有加的表示离开的路由组件
++beforeCreate
++created
++beforeMount
 deactivated
++mounted
++activated
```



- 初始化:
  - ...
  - mounted
  - *--Child activated*
  - activated
- 路由离开
  - *--Child deactivated*
  - deactivated
- 路由回来
  - *--Child activated*
  - activated

### 捕获子组件错误的勾子

- 子组件执行抛出错误
  - errorCaptured

```js
父组件中调用这个钩子:
errorCaptured(err,child,info){
    console.log('errorCaptured')
    console.log(err,child,info)  //打印的错误是灰色的
    return false;//不再向外传递,说明当前已经处理了错误
}
```



### 各个生命周期勾子说明

![vue组件生命周期详图.png](https://i.loli.net/2021/04/03/t4AIhPlnpNe8i9d.png)

(1) beforeCreate(): 在实例初始化之后调用, data和methods都还没有初始化完成, 通过this不能访问

初始化data与methods/computed

(2) created(): 此时data和methods都已初始化完成, 可以通过this去操作, 可以在此发ajax请求

编译模板

(3) beforeMount(): 模板已经在内存中编译, 但还没有挂载到页面上, 不能通过ref找到对应的标签对象

插入到界面上显示

(4) mounted(): 页面已经初始显示, 可以通过ref找到对应的标签, 也可以选择此时发ajax请求



n次更新数据

(5) beforeUpdate(): 在数据更新之后, 界面更新前调用, 只能访问到原有的界面

更新界面

(6) updated(): 在界面更新之后调用, 此时可以访问最新的界面



**销毁组件/ v-if隐藏/离开不缓存的路由组件**
(7) beforeDestroy(): 实例销毁之前调用, 此时实例仍然可以正常工作
(8) destroyed(): Vue 实例销毁后调用, 实例已经无法正常工作了
(9) deactivated():组件失活, 但没有死亡
(10) activated(): 组件激活, 被复用
(11) errorCaptured(): 用于捕获子组件的错误,return false可以阻止错误向上冒泡(传递)












### vue中对象响应式处理和数组响应式处理的区别

#### 对象

对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。但是，可以使用 `Vue.set(object, propertyName, value)` 方法或 `vm.$set`实例方法, 向嵌套对象添加响应式 property

需要为已有对象赋值多个新 property，比如使用 `Object.assign()` 或 `_.extend()`

#### 数组

Vue 不能检测以下数组的变动：

1. 当你利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如：`vm.items.length = newLength`

为了解决第一类问题，以下两种方式:

```
// Vue.set  vm.$set
Vue.set(vm.items, indexOfItem, newValue)
vm.$set(vm.items, indexOfItem, newValue)

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)

**push, pop, unshift, shift, splice, reverse, sort**
```



为了解决第二类问题，你可以使用 `splice`：

vm.items.splice(newLength)









### Vue.set和Vue.delete的基本原理

#### 背景

Vue.set和Vue.delete是Vue提供的两个API，用于向响应式对象添加或删除属性。

由于Vue在初始化实例时会对property执行getter/setter转换，所以property必须在data对象上存在才能让Vue将它转换为响应式的。这意味着，对于已经创建的实例，Vue不允许动态添加根级响应式属性。但是，可以使用Vue.set方法向嵌套对象添加响应式属性。此外，还可以使用vm.$set实例方法，这也是全局Vue.set方法的别名。

同理，Vue.delete方法用于删除对象的属性。如果该属性是响应式的，则删除后视图也会更新。此外，还可以使用vm.$delete实例方法，这也是全局Vue.delete方法的别名。



#### 语法

Vue.set

Vue.set(obj, key, val) 的作用是在对象 obj 中添加属性 key 并将其值设置为 val 。如果 obj 是响应式的，当添加了新属性后，新属性也将是响应式的，并触发视图重新渲染。

例如：

```
Vue.set(vm.obj, 'newKey', 'newValue');
```

Vue.delete

Vue.delete(obj, key) 的作用是删除对象 obj 中的属性 key。如果 obj 是响应式的，则删除后也会立即触发视图重新渲染。

例如：

```
Vue.delete(vm.obj, 'keyToDelete');
```

#### 原理

Vue.set 和 Vue.delete 的基本原理是**通过调用 Observer 对象上的 defineReactive 方法来实现的**。当给响应式对象添加或删除属性时，Observer 会监听到对象的变化并通知 Dep 对象，Dep 再通知 Watcher 更新视图。

总之，Vue.set 和 Vue.delete 提供了一种方便且安全地修改 Vue 实例中响应式数据的方式。




### vue2中new Vue之后做了什么事情?

在Vue2中，当我们使用new Vue()创建一个Vue实例时，会发生以下事情：

1. 初始化：Vue实例的_init方法会被调用。这个方法会合并配置，初始化生命周期，初始化事件，初始化渲染，初始化data、props、computed、watcher等。
2. 挂载：如果创建实例时传入了el选项，实例将立即进入挂载阶段。否则，需要手动调用vm.$mount方法才能触发挂载。在挂载阶段，Vue会将模板编译成渲染函数，并生成虚拟DOM，最终更新DOM。
3. 渲染更新：当实例中的响应式数据发生变化时，会触发重新渲染和更新DOM。
总之，在Vue2中，new Vue()会创建一个Vue实例，并执行初始化和挂载操作。





### 说说Vue与组件间之间的关系

在Vue中，组件是可复用的Vue实例，它们与新创建的Vue实例有着类似的选项，例如data、computed、watch、methods以及生命周期钩子等。

组件可以分为全局组件和局部组件。全局组件可以在任何新创建的Vue根实例的模板中使用，而局部组件则只能在注册它们的实例的模板中使用。

Vue通过组件化的方式实现了正交性（Orthogonality），即组件只关心自己的内部状态和行为，不依赖于其他组件的状态和行为。这种设计方式使得我们可以更加方便地维护和重用组件，同时也提高了应用的可读性和可测试性。

总之，组件是Vue中的核心概念，它们是构建用户界面的基本单元。组件可以嵌套、复用和传递数据，使得我们可以更加方便地构建复杂的应用程序。



### scoped样式的作用和原理

当 `<style>` 标签有 `scoped` 属性时，它的 CSS 只作用于当前组件中的元素。

使用 `scoped` 后，父组件的样式将不会渗透到子组件中。不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。

**原理**

在编译阶段，Vue会为每个组件生成一个唯一的属性（例如data-v-xxxxx），并将其添加到组件模板中的所有元素上。同时，Vue还会修改组件中的CSS选择器，在每个选择器后面添加一个对应的属性选择器（例如[data-v-xxxxx]）。这样，组件中的样式就只能作用于拥有对应属性的元素上。



### 深度作用域选择器的作用和原理

当我们使用scoped样式时，有时候我们需要为子组件中的元素定义样式。但是由于scoped样式的限制，我们不能直接在父组件中为子组件中的元素定义样式。这时候，我们就可以使用深度作用域选择器。

深度作用域选择器有两种形式：>>>和/deep/(`::v-deep`)。它们的作用是一样的，都是用来穿透scoped样式的限制，为子组件中的元素定义样式。


### vue的插件是什么，如何定义？如何使用？

Vue的插件是一个可以扩展Vue功能的功能模块。它们允许您在全局或组件级别注册新的全局功能、指令、过滤器或自定义组件，以及为现有Vue实例添加属性或方法。

插件通常用来为 Vue 添加全局功能。插件的功能范围没有严格的限制——一般有下面几种：

1. 添加全局方法或者 property。如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)
2. 添加全局资源：指令/过滤器/过渡等。如 [vue-touch](https://github.com/vuejs/vue-touch)
3. 通过全局混入来添加一些组件选项。如 [vue-router](https://github.com/vuejs/vue-router)
4. 添加 Vue 实例方法，通过把它们添加到 `Vue.prototype` 上实现。
5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)



#### 使用插件

通过全局方法 `Vue.use()` 使用插件。它需要在你调用 `new Vue()` 启动应用之前完成：

```vue
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)

new Vue({
  // ...组件选项
})

```

也可以传入一个可选的选项对象：

```vue
Vue.use(MyPlugin, { someOption: true })
```




### 混入是什么? 如何定义?如何使用?

一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子**之前**调用。

数据对象data在内部会进行递归合并，并在发生冲突时以组件数据优先

值为对象的选项，例如 `methods`、`components` 和 `directives`，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。



使用

```js
var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```



### vuex的数据持久化是什么？可以解决什么问题

Vuex是一个专为Vue.js应用程序开发的状态管理模式。它可以集中管理应用程序中所有组件的状态，并以一种可预测的方式进行状态变更。

然而，Vuex的状态存储是响应式的，当页面刷新或关闭时，Vuex的状态将会丢失。这就意味着，如果我们希望在页面刷新或关闭后仍然保留Vuex的状态，就需要进行数据持久化。

数据持久化指的是将Vuex的状态保存到客户端，例如localStorage、sessionStorage或cookie等，以便在页面刷新或关闭后仍然能够访问这些状态。

数据持久化可以解决Vuex状态丢失的问题。例如，我们可以在用户登录后将用户信息保存到Vuex中，并进行数据持久化。这样，即使用户刷新页面或关闭浏览器，我们仍然能够访问用户信息。

总之，Vuex的数据持久化指的是将Vuex的状态保存到客户端，以便在页面刷新或关闭后仍然能够访问这些状态。它可以解决Vuex状态丢失的问题。



### Vue发开中遇到的坑?

'就地复用'的问题
> vue在用v-if v-else渲染两个相同的按钮，一个绑定了事件，另外一个没有绑定事件。当渲染状态切换的时候，会导致未绑定事件的按钮也绑定上了事件。
> 原因是有的vue版本在没给条件渲染的元素加上key标识时候会默认复用元素提升渲染能力，导致事件被错误的绑定上另一个按钮。解决方案：更换高版本vue，加上key标识两个按钮。




### 编程式路由导航和声明式路由导航区别？

- 编程式路由导航：通过代码进行路由的跳转，在组件内部通过 `$router` 对象来操作路由，使用 `$router.push`、`$router.replace` 和 `$router.go` 等方法来实现路由的切换，主要适用于需要在某些场景下进行特定路由跳转的情况。
- 声明式路由导航：在模板中使用 Vue Router 提供的组件（如 `<router-link>`）来实现路由的跳转，通过设置 `to` 属性来指定目标路由地址，当用户点击这些组件时，路由会自动进行跳转，非常适用于需要在页面间进行切换的场景。



### 编程式路由导航重复导航报错？

### 缓存式路由组件？

- 当离开时, 路由组件会自动销毁, 再跳转回来, 需要重新创建
- 目标: 能不能让路由组件离开时不销毁, 再回来时, 直接复用
- 解决: 使用`<keep-alive>来包含<router-view>`, 就能让对应的路由组件离开时不销毁
- 作用: 能复活组件对象, 包含它的所有状态相关数据



### 路由组件间通信方式

### 路由的props如何指定?

### 组件内如果监听动态路由的数据改变

* 监听 `$route` 对象的变化

* 监听 `$route.params` 对象内的变化
* beforeRouteUpdate(to,from,next)



# Vue3面试题

## vue2和vue3的相关问题

### vue2和vue3的区别
1.**双向数据绑定的原理不同**
* vue2利用`Object.defineProperty`对数据进行劫持,结合发布/订阅模式方式来实,要通过遍历方式监听每一个属性
* vue3利用Proxy对数据代理.不需要遍历,自动监听
2.**根节点不同**
* vue2只有一个根节点
* vue3支持多个根节点
3.**组合式api和选项式api**
* vue2使用选项式api,将数据和逻辑进行了分离,不相关的数据放在一起,项目复杂以后,维护难度大;
* vue3支持组合api,更好的组织和复用代码.
4.**生命周期不同**
5.**对ts支持不同**
6.**性能增强**
* vue3重写了虚拟dom算法,比2更快;添加了模块化删除和tree-shaking,降低了体积.
7.其它:
* vue3使用hooks代替mixin
* v-model应用于组件时, 监听的事件和传递的值会改变(value/iput  modelValue/update:modelValue); v-model可以在同一组件上绑定多个

### vue3比2的优势
性能更好，打包体积更小(tree-shaking)，更好的ts支持，更好的代码组织，更好的逻辑抽离


### 生命周期介绍
选项式和组合式的生命周期名称有所不同,
![[Pasted image 20240925105704.png]]



### Vue2/Vue3通信方式比较

#### 1.Props
* vue2和vue3基本相同
```js
//vue2
<!-- 父组件 -->
<Child :message="parentMsg" />

<!-- 子组件 -->
<script>
export default {
  props: ['message']
}
</script>
```


#### 2.自定义事件
* vue2: `$emit` + `v-on`/`.sync`修饰符
* vue3: `$emit` + `v-on` / `v-model`增强
```js
//vue3
<!-- Vue2 -->
<Child @update="handleUpdate" />
<Child :title.sync="pageTitle" />  <!-- .sync语法 -->

<!-- Vue3 -->
<Child @update="handleUpdate" />
<Child v-model:title="pageTitle" /> <!-- 替代.sync -->
```

#### 3.provide/inject
- **Vue2**: 选项式API，非响应式(除非使用对象)
- - **Vue3**: 组合式API，可配合 `ref`/`reactive` 实现响应式


#### 4.事件总线
- Vue2常用方式：创建空的Vue实例作为事件中心
- Vue3不再推荐事件总线模式, 推荐使用替代方案
	- 使用 `mitt` 或 `tiny-emitter` 第三方库
	- 使用 `provide/inject` + 响应式状态


#### 5.`$attrs`/`$listeners` vs `$attrs`

- **Vue2**: 分离属性和事件
- **Vue3**: 合并为 `$attrs` (包含属性和事件)
```js
//vue2
<Child v-bind="$attrs" v-on="$listeners" />

//vue3
<Child v-bind="$attrs" />
```

#### 6.`$parent/$children` 和模板引用(vue3)
- **Vue2**: 直接访问父/子实例
- - **Vue3**: 推荐使用模板引用
```js
//vue2
this.$parent.methodName()
this.$children[0].methodName()

//vue3
<Child ref="childRef" />

<script setup>
import { ref } from 'vue'
const childRef = ref(null)
childRef.value.methodName()
</script>
```


| 通信方式                    | Vue2 实现                                                       | Vue3 实现                                    | 变化说明                                                        |
| ----------------------- | ------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| **1. Props**            | `props: ['message']`                                          | `defineProps(['message'])`                 | 基本一致，Vue3 支持 `defineProps` 编译器宏                             |
| **2. 自定义事件**            | `this.$emit('event')` + `@event="handler"`                    | `defineEmits(['event'])` + `emit('event')` | Vue3 引入 `defineEmits` 编译器宏                                  |
| **3. 全局事件总线**           | `const bus = new Vue()` + `bus.$on`/`bus.$emit`               | 推荐使用 `mitt` 或 `tiny-emitter` 库             | Vue3 移除了 `$on`/`$off`，不再推荐事件总线模式                            |
| **4. v-model**          | `value` prop + `input` 事件                                     | `modelValue` prop + `update:modelValue` 事件 | Vue3 支持多个 `v-model`（如 `v-model:title`）                      |
| **5. .sync**            | `:title.sync="val"` → `update:title` 事件                       | 被 `v-model:title` 替代                       | Vue3 移除了 `.sync`，功能合并到增强的 `v-model`                         |
| **6. $attrs**           | 仅包含非 props 的属性                                                | 包含所有非 props 的属性和事件                         | Vue3 的 `$attrs` 包含属性和事件（合并了 Vue2 的 `$attrs` + `$listeners`） |
| **7. $listeners**       | 单独包含父组件传递的事件                                                  | 已移除，合并到 `$attrs`                           | Vue3 不再需要单独处理                                               |
| **8. ref/ref/children** | `this.$refs.child` / `this.$children`                         | `ref` 模板引用（`<Child ref="childRef">`）       | Vue3 移除 `$children`，推荐使用模板引用                                |
| **9. $parent**          | `this.$parent` 访问父实例                                          | 仍存在但不推荐使用                                  | Vue3 推荐使用 `provide/inject` 或 props 替代                       |
| **10. Vuex**            | `this.$store` + `mapState/mapGetters/mapMutations/mapActions` | `useStore()` + 组合式 API 使用                  | Vue3 推荐使用 Pinia，但 Vuex 4 仍可用                                |
| **11. provide/inject**  | 选项式 API，默认非响应式                                                | 组合式 API，支持响应式数据                            | Vue3 可配合 `ref`/`reactive` 实现响应式                             |
| **12. 插槽**              | `<slot>` + `<template v-slot:name>`                           | `<slot>` + `<template #name>`（语法糖）         | Vue3 插槽语法更简洁，作用域插槽原理相同                                      |



### vFor与vIf的优先级
| 特性   | Vue2             | Vue3              |
| ---- | ---------------- | ----------------- |
| 优先级  | `v-for` > `v-if` | `v-if` > `v-for`  |
| 设计意图 | 兼容旧代码            | 更符合直觉             |
| 推荐用法 | 用计算属性过滤          | 用计算属性或嵌套 template |
| 同时使用 | 可能性能问题           | 会直接报错             |


### vue2中的指令原理和vue3中的有什么区别
#### 1. **钩子函数名称与生命周期调整**
- **Vue2**：指令通过 `bind`、`inserted`、`update`、`componentUpdated`、`unbind` 等钩子函数实现。
- ​**Vue3**：钩子函数名称**重命名**以对齐组件生命周期：
    
    - `bind` → `beforeMount`
    - `inserted` → `mounted`
    - `update` → ​**移除**​（由 `beforeUpdate` 和 `updated` 替代）
    - `componentUpdated` → `updated`
    - `unbind` → `unmounted`
    新增 `beforeUpdate` 钩子，在组件更新前触发。
#### 2.**参数传递与上下文变化**
- ​**Vue2**：钩子接收 `el`, `binding`, `vnode`, `oldVnode` 等参数。
- ​**Vue3**：参数调整为：
    - 移除 `vnode` 和 `oldVnode`，改为通过 `binding.instance` 访问组件实例。
    - `binding` 对象新增 `instance` 属性（指向组件实例）。
    - 移除了 `vnode` 的直接传递，需通过 `el.__vueParentComponent` 访问（不推荐直接操作）。

#### 3.**自定义指令注册**

- ​**Vue2**：全局指令通过 `Vue.directive()` 注册。
- ​**Vue3**：通过应用实例 `app.directive()` 注册，更符合模块化设计。

```js
// Vue2 指令
Vue.directive('focus', {
  bind(el, binding) {
    el.style.color = binding.value;
  },
  inserted(el) {
    el.focus();
  }
});

// Vue3 指令
app.directive('focus', {
  beforeMount(el, binding) {
    el.style.color = binding.value;
  },
  mounted(el) {
    el.focus();
  },
  beforeUpdate(el, binding) {
    // 响应式数据更新前逻辑
  }
});
```

### vue2中的v-model和vue3的有什么区别?

| 特性         | Vue2          | Vue3                |
| ---------- | ------------- | ------------------- |
| 默认 prop    | `value`       | `modelValue`        |
| 默认 event   | `input`       | `update:modelValue` |
| 多个 v-model | 不支持           | 支持                  |
| 自定义修饰符     | 不支持           | 支持                  |
| 修改默认行为     | 使用 `model` 选项 | 直接在 v-model 后指定参数   |


### 选项式和组合式的区别
**选项式api**
* 通过定义`data、computed、watch、method`等属性与方法，共同处理页面逻辑；
* 组件复杂后,组件难以阅读和后期维护成本变高；
**组合式api**
* 组件根据逻辑功能来组织，一个功能所定义的所有API会放在一起（高内聚，低耦合)
* 解决vue2业务逻辑碎片化,实现聚合处理;逻辑复用
**总结:**
- 在逻辑组织和逻辑复用这方面，组合式API是优于选项式API的；
- 组合式API中见不到this的使用，减少了this指向不明的情况；
- 组合式API几乎都是函数，会有更好的类型推断；


### vue3使用proxy代替defineProperty
- `Object.defineProperty` 只能遍历对象属性进行劫持；
- `Proxy` 直接可以劫持整个对象，便返回一个新对象，我们可以操作新对象达到响应式目的；
- `Proxy` 可以直接监听数组的变化；
- Proxy有13种拦截方法，不限于apply、ownKeys、deleteProperty、has等等，这是Object.defineProperty不具备的；

 

## watch和watchEffect区别
* 监听数据源
* 访问值的区别
* 立即执行的区别

1. `watch`：既要指明监听数据的源，也要指明监听的回调； `watchEffect`：可以自动监听数据源作为依赖,监听的回调中用到哪个数据，那就监听哪个数据；
2. `watch` 可以访问改变前后的值，`watchEffect` 只能获取改变后的值；
3. `watch`运行的时候 不会立即执行，值改变后才会执行，而`watchEffect`运行后可立即执行，这一点可以通过`watch`的配置项`immeriate`改变；


4. `watchEffect` 有点像 `computed`：
    - `computed`注重的是计算出来的值（回调函数的返回值），所以必须写返回值；
    - `watchEffect`注重的是过程（回调函数的函数体），所以不用写返回值；
        - `watchEffect`所指定的回调中用到的数据只要发生变化，则直接重新执行回调；
5. Vue3与Vue2中的watch配置项一致，但也有两个小坑：
    - 监听`reactive`定义的响应式数据时（监听数据整体），`oldVal`无法正确获取到，强制开启深度监听，deep配置项失效；
    - 监听`reactive`定义的响应式数据的某个属性时，deep配置项有效；

## ref与reactive区别

| 特性       | `ref`             | `reactive`  |
| -------- | ----------------- | ----------- |
| **数据类型** | 适用于基本类型和对象        | 仅适用于对象      |
| **访问方式** | 需要 `.value`       | 直接访问属性      |
| **模板使用** | 自动解包（无需 `.value`） | 需保持对象结构     |
| **适用场景** | 单个数据、组合式函数返回值     | 复杂状态管理（如表单） |


* **接收类型**
	* `ref`函数可以接收原始数据类型和引用数据类型
	*  `reactive`函数只能接收引用数据类型
* **原理**
	*  `ref`底层还是使用`reactive`来做，`ref`是在`reactive`上进行了封装，增强了其能力，使其支持了对原始数据类型的处理





## script setup是干什么的
script setup是Vue3的语法糖，简化了组合式API的写法，并且运行性能更高，使用script setup语法糖的特点：
* 属性和方法无需返回，直接使用；
* 引入组件的时候，会自动注册；
* 使用defineProps接收父组件传递的值；defineEmits获取自定义事件;使用useAttrs获取属性，useSlots获取插槽
* 默认不会对外暴露任何属性，如果有需要使用defineExpose；`


## setup中直接使用异步的问题
1. **组件无法正确渲染**
    - `setup` 如果是异步函数，组件会在 `setup` 完成前渲染，导致初始状态丢失
    - 返回的响应式数据可能无法被模板正确访问
2. **生命周期钩子执行时机问题**
    - 异步 `setup` 会导致生命周期钩子（如 `onMounted`）的执行时机不可控
3. **响应式数据初始化问题**
    - 异步获取的数据可能无法正确建立响应式关联

```js
// ❌ 错误示例：直接使用 async setup
export default {
  async setup() {
    const data = await fetchData(); // 异步操作
    
    return {
      data // 可能无法正确建立响应式
    };
  }
};
```


### 解决方案
#### 方案1：使用 `ref/reactive` + `onMounted`
```js
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const data = ref(null);
    
    onMounted(async () => {
      data.value = await fetchData();
    });
    
    return { data };
  }
};
```
#### 方案2: 使用 `reactive/ref` + 立即执行异步函数
```js
import { reactive } from 'vue';

export default {
  setup() {
    const state = reactive({ data: null });
    
    (async () => {
      state.data = await fetchData();
    })();
    
    return { state };
  }
};
```

#### 方案3：使用 Suspense (Vue3 实验性功能)

```js
// 子组件
export default {
  async setup() {
    const data = await fetchData();
    return { data };
  }
};

// 父组件
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```








## Pinia简介

### 比较
- Vuex: State、Getters、Mutations（同步）、Actions（异步）
- Pinia: State、Getters、Actions（同步异步都支持）

### 优点
- Pinia 没有 Mutations
- 没有模块的嵌套结构
- 更好的 TypeScript 支持
- Vue2 和 Vuc3 都支持
- 支持 Vue DevTools


### 使用介绍
#### 安装
```sh
npm i pinia
```

#### 配置
```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import axios from 'axios'
import { createPinia } from 'pinia'

const app = createApp(App)
app.config.globalProperties.$axios = axios
app
  .use(router)
  .use(createPinia())
  .mount('#app')


```


### 定义
```js
import { defineStore } from 'pinia'

interface IUser {
  name: string
  age: number
}
export const useUserStore = defineStore('user', {
  state(): IUser {
    return {
      name: '',
      age: 0,
    }
  },
  getters: {},
  actions: {
    updateUser(user: IUser) {
      this.name = user.name
      this.age = user.age
    },
  },
})

```

### 使用

##### state基本使用
```vue

<template>
  <div>userAge: {{ user.age }}</div>
</template>
<script setup lang="ts">
import { useUserStore } from '../pinia/user'
const user = useUserStore()
setTimeout(() => {
  user.updateUser({
    name: 'Sherry',
    age: 30
  })
}, 500)
</script>

```



#### storeToRefs 使解构也能响应式
```vue

<template>
  <div>userAge: {{ age }}</div>
</template>
<script setup lang="ts">
import { useUserStore } from '../pinia/user'
import { storeToRefs } from 'pinia'

const user = useUserStore()
// 使解构后的值也能拥有响应式
const { age } = storeToRefs(user)
setTimeout(() => {
  user.updateUser({
    name: 'Sherry',
    age: 30
  })
}, 500)
</script>

```

#### 修改state的方式
```vue

<template>
  <div>Name: {{ name }}</div>
  <div>Age: {{ age }}</div>
</template>
<script setup lang="ts">
import { useUserStore } from '../pinia/user'
import { storeToRefs } from 'pinia'

const user = useUserStore()
// 使解构后的值也能拥有响应式
const { age, name } = storeToRefs(user)
setTimeout(() => {
  // 1. 直接修改（不建议）
  // user.age = 200
  // 2. $patch（传递对象，多个数据修改）（不建议）
  user.$patch({
    name: 'Lance',
    age: 28,
  })
  // 3. $patch（传递箭头函数，多个数据修改）（不建议）
  user.$patch((state) => {
    state.name = 'GC'
    state.age = 31
  })
  // 4. 直接调用 action （推荐）
  user.updateInfo({
    name: 'QB',
    age: 29,
  })
}, 500)
</script>

```


#### getters

无参数传递 vs 有参数传递
```js


import { defineStore } from 'pinia'

interface IUser {
  name: string
  age: number
}
export const useUserStore = defineStore('user', {
  state(): IUser {
    return {
      name: '',
      age: 0,
    }
  },
  getters: {
    getAge(): number {
      return this.age
    },
    // 接受参数
    getFormatName(state): (value: string) => string {
      return (value: string) => {
        return state.name + value
      }
    },
  },
  actions: {
    updateInfo(user: IUser) {
      this.name = user.name
      this.age = user.age
    },
  },
})

```

```vue
<template>
  <div>Name: {{ name }}</div>
  <div>Age: {{ age }} - {{ getAge }} - {{ getFormatName('Lance') }}</div>
</template>
<script setup lang="ts">
import { useUserStore } from '../pinia/user'
import { storeToRefs } from 'pinia'
const user = useUserStore()
const { age, name, getAge, getFormatName } = storeToRefs(user)
setTimeout(() => {
  user.updateInfo({
    name: 'QB',
    age: 29,
  })
}, 500)
</script>

```


#### 跨模块更新数据
定义俩模块:
* user
* subject

```js
import { defineStore } from 'pinia'

export const useSubjectStore = defineStore('subject', {
  state() {
    return {
      courseList: ['数学', '语文'],
      currentIdx: 0,
    }
  },
})

```

然后希望在user模块中修改subject数据:
```js

import { defineStore } from 'pinia'
import { useSubjectStore } from './subject'
const subject = useSubjectStore()
...
export const useUserStore = defineStore('user', {
  state(): IUser {
    return {
      ...
    }
  },
  getters: {
    ...
  },
  actions: {
    ...
    addCourse(course: string) {
      subject.courseList.push(course)
    },
  },
})

```


页面中使用:
```vue

<template>
  ...
  <div>courseList: {{ subject.courseList.join(',') }}</div>
</template>
<script setup lang="ts">
import { useUserStore } from '../pinia/user'
import { useSubjectStore } from '../pinia/subject'

const user = useUserStore()
const subject = useSubjectStore()
user.addCourse('英语')
</script>

```




# Vuex

### 概述下Vuex
Vue应用的状态管理模式.每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。
* Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
* 改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。

主要包括以下几个模块：
State： 定义了应用状态的数据结构，可以在这里设置默认的初始状态。
Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。
Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。




### vuex多模块编程
- vuex的多模块编程的必要性
  - vuex单模块问题: 
    - 需要的管理状态数据比较多, 那对应的mutations/actions模块就会变得比较大
    - 如果添加新的数据管理, 需要修改现在文件(不断向其添加内容) 
  - vuex多模块编程: 对各个功能模块的数据分别进行管理, 这样更加具有扩展性

- 什么时候需要用vuex多模块编程? 需要vuex管理的数据比较多时使用
- 多模块编程的总state结构:

```js
{
	home: {
        categoryList: [],
        xxx: {}
    },
    user: {
        userInfo: {}
    }
}
```

### 问答题

#### vuex中的mutation可以执行异步操作吗?

- 可以 ==> 异步更新数据后界面确实会自动更新
- 问题 ==> vuex的调用工具监视不到mutation中的异步更新, 工具记录还是更新前的数据(不对)
- 扩展: 工具如何记录数据变化? ==> 每次mutation函数执行完后, 立即记录当前的数据   ==> 在mutation中同步更新state, 才能被记录到



#### vuex中的状态数据的响应式的原理?

1. 创建了一个vue实例(vm)对象

2. state中的数据都是实例的data数据(是响应式的)

3. 组件中读取的state数据本质读取的就是data中的数据

4. 一旦更新了state中的数据, 所有用到这个数据的组件就会自动更新



#### vuex数据刷新丢失的问题

```js
//数据丢失原因
1.	Vuex数据保存在运行内存中，vue实例初始化的时候为其分配内存
2.	当刷新页面的时候重新初始化Vue实例，所以重新为Vuex分配内存导致之前保存的数据丢失


//如何解决?
1.	Vuex的数据都是每次组件加载时候动态请求获取数据保存
a)	优点： 保证数据不会丢失
b)	缺点: 性能差，因为网络问题可能有网络延迟

2.	将Vuex中的数据每次同步更新保存到sessionStorage中
a)	优点: 每次页面刷新后从sessionStorage中获取保存的数据，不会丢失
b)	缺点: state中的数据是动态的，就需要一直要同步到sessionStorage中，性能差

3.	在页面刷新之前获取Vuex的数据，将数据保存在sessionStorage中，页面加载后从sessionStorage中获取
a)	优点: 减少动态更新sessionStorage的次数，性能好
b)	重点: 给window绑定beforeunload事件监听

```


```js
1. 使用本地存储

这是最简单和常用的方法之一：


`// 在状态改变时保存到localStorage store.subscribe((mutation, state) => {   localStorage.setItem('store', JSON.stringify(state)); }) // 在创建store时从localStorage恢复状态 const store = new Vuex.Store({   state: localStorage.getItem('store') ? JSON.parse(localStorage.getItem('store')) : {    // 初始状态  },  // ...其他配置 })`

2. 使用插件

Vuex提供了插件机制，你可以使用或创建插件来持久化状态：

Vuex PersistedState Plugin Usage


这个插件会自动将Vuex的状态保存到localStorage，并在页面加载时恢复。

3. 服务器端渲染（SSR）

如果你使用Nuxt.js或其他SSR解决方案，可以在服务器端初始化store状态：



`export default function ({ store, req }) {   if (process.server) {    // 从服务器API获取数据    store.dispatch('fetchInitialData')  } }`

4. 使用sessionStorage

如果你只需要在当前会话中保持数据，可以使用sessionStorage代替localStorage：



`store.subscribe((mutation, state) => {   sessionStorage.setItem('store', JSON.stringify(state)); })`

5. 使用Cookie

对于一些小型数据，你也可以考虑使用Cookie：



`import Cookies from 'js-cookie' store.subscribe((mutation, state) => {   Cookies.set('store', JSON.stringify(state)); })`

6. 只持久化特定字段

有时你可能只想保存部分状态：


`store.subscribe((mutation, state) => {   localStorage.setItem('user', JSON.stringify(state.user)); })`

选择哪种方法主要取决于你的具体需求，如数据大小、安全性要求、浏览器兼容性等。对于大多数应用，使用localStorage或专门的插件如vuex-persistedstate通常是最简单有效的解决方案。
```




- 绑定事件监听: 在页面卸载(关闭)或刷新时候保存当前数据

```js
beforeCreate(){
    window.addEventListener('beforeunload', () => {
	sessionStorage.setItem('CART_LIST_KEY', 
		JSON.stringify(this.$store.state.shopCart.cartList))
	})
}
```

- 在初始时读取保存数据作为状态的初始值. 解决页面刷新数据丢失的问题

```js
//state中初始化属性值
cartList: JSON.parse(sessionStorage.getItem('CART_LIST_KEY')) || [],
```


#### vuex原理,组件传参方式
 构建一个vm,state中的数据都是实例的data属性
 组件传参方式? 先需要确认是否是组件和vuex传递数据
 组件->vuex dispatch commit
 vuex->组件: mapState,mapGetters


#### 监听vuex自身数据
 两种方式获取vuex的state数据:  $store.state与mapState
 定义返回state数据的计算属性->通过watch监视这个计算属性->state变化,计算属性值,监视的回调

#### vuex理解
 - vuex是vue中集中式状态管理的一个插件,可以对组件共享状态进行集中式管理(管理:读写)
 - vuex是组件间通信的一种方式,可实现任意组件间通信.
 - 什么时候使用? 多个组件依赖同一状态,不同组件的行为要变更为同一状态: 购物车页面要根据登录状态来访问



#### vuex如何外部改变内部的值
 是组件更新了state中的数据:dispatch, commit
 模块化编程下,内部模块改变外部模块的值:


#### 对vuex的理解一些使用场景
 多个组件共享数据或者是跨组件传递数据时
 购物车的数据共享, 登录注册






# vue-router

### 声明式路由导航和编程式路由导航区别
- 跳转/导航路由的2种基本方式
  - 声明式路由: `\<router-link :to="{path: '/xxx'}" replace>xxx</router-link/>`
  - 编程式路由: `this.$router.push/replace(location)`

* 编程式路由导航：通过代码进行路由的跳转，在组件内部通过 `$router` 对象来操作路由，使用 `$router.push、$router.replace` 和 `$router.go` 等方法来实现路由的切换，主要适用于需要在某些场景下进行特定路由跳转的情况。

* 声明式路由导航：在模板中使用 Vue Router 提供的组件（如 `<router-link>`）来实现路由的跳转，通过设置 to 属性来指定目标路由地址，当用户点击这些组件时，路由会自动进行跳转，非常适用于需要在页面间进行切换的场景



#### 编程路由导航
>https://v3.router.vuejs.org/zh/guide/essentials/navigation.html


**参数:**
* 字符串
* path对象
* 命名路由对象
* 带查询参数的path对象

```js
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```

**注意**:
* 如果提供了 path，params 会被忽略
```js
const userId = '123'
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123

// 这里的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user
```



### 跳转路由携带参数(数据)的方式
#### params参数
传参方式:
* 注册路由的时候需要声明占位符，{path: '路由路径/:name/:age'}  //name,age是占位符

跳转时指定参数值:
- /xxx/abc/12
* {name: 'xxx', params: {name: 'abc', age: 12}}

#### query参数
传参方式:
* 注册的路由的时候不需要做任何事情
* 请求时url路径中以?开始以&连接key=value的字符形式,例如`path?key=value&key2=value2`
* params和query同时使用,params参数要放在query前面.

获取
* query参数无需声明即可接收,接收通过计算属性 `this.$route.query`


#### props
> https://v3.router.vuejs.org/zh/guide/essentials/passing-props.html#布尔模式

传参方式:
* 布尔值(只能搭配params参数使用)
	* props: true, // 只能同名映射params参数
* 对象(用于自定义参数)
	* props: {a: 1, b: 'abc'}, // 只能映射非params/query参数
* 函数(自定义参数 + 路由信息)
    - props: route => ({keyword3: route.params.keyword, keyword4: route.query.keyword2, xxx: 12}), //可以指定任何数据都可以

//布尔模式
如果 props 被设置为 true，route.params 将会被设置为组件属性。
```js

const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}


const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```

//对象模式
如果 props 是一个对象，它会被按原样设置为组件属性。当 props 是静态的时候有用。
```js
const router = new VueRouter({
  routes: [
    {
      path: '/promotion/from-newsletter',
      component: Promotion,
      props: { newsletterPopup: false }
    }
  ]
})
```


//函数模式
你可以创建一个函数返回 props。这样你便可以将参数转换成另一种类型，将静态值与基于路由的值结合等等。
```js
const router = new VueRouter({
  routes: [
    {
      path: '/search',
      component: SearchUser,
      props: route => ({ query: route.query.q })
    }
  ]
})
```
URL /search?q=vue 会将 {query: 'vue'} 作为属性传递给 SearchUser 组件。



#### meta
传参方式:
* 注册的时候通过meta字段进行参数设置,指定包含n个数据的对象

获取数据
* `this.$route.meta.xxx`





#### `$router` VS `$route`的区别
* **$router**
路由器对象
用来控制路由的跳转，包含相关方法: push()/replace()/back()/addRoutes()
* **$route**
路由信息对象
包含当前路由的所有信息(path, query, params, meta)




### 路由模式
> https://juejin.cn/post/7116336664540086286


#### 3种路由模式
可以通过mode选项修改路由的模式。
* hash:  使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；
* history :  依赖 HTML5 History API 和服务器配置。具体可以查看 HTML5 History 模式；
* abstract :  支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.



#### 路由中history模式和hash模式

- URL格式:
    - Hash模式: 使用井号(#)。例如: `http://example.com/#/user/1`
    - History模式: 看起来像普通的URL。例如: `http://example.com/user/1`
- 实现原理:
    - Hash模式: 基于URL的hash(#)。使用window.location.hash来操作。
    - History模式: 基于HTML5的History API。使用history.pushState()和history.replaceState()方法。
- 服务器配置:
    - Hash模式: 不需要特殊的服务器配置。
    - History模式: 需要服务器配置。所有的路由都需要重定向到index.html。
- 浏览器兼容性:
    - Hash模式: 兼容性较好，支持旧版浏览器。
    - History模式: 只在支持HTML5 History API的浏览器中可用。
- SEO友好性:
    - Hash模式: 对SEO不友好，因为搜索引擎通常会忽略#后面的内容。
    - History模式: 对SEO更友好，因为URL结构更像传统的网页。
- 刷新页面行为:
    - Hash模式: 刷新页面时，不会向服务器发送请求。
    - History模式: 刷新页面时会向服务器发送请求，因此需要proper服务器配置以避免404错误。



#### 路由模式实现原理
**hash 模式的实现原理**
早期的前端路由的实现就是基于 location.hash 来实现的。其实现原理很简单，location.hash 的值就是 URL 中 # 后面的内容。比如下面这个网站，它的 location.hash 的值为 '#search'：
```awk
https://www.word.com#search
```

**history 模式的实现原理**
HTML5 提供了 History API 来实现 URL 的变化。其中做最主要的 API 有以下两个：history.pushState() 和 history.repalceState()。这两个 API 可以在不进行刷新的情况下，操作浏览器的历史纪录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录，如下所示：
```js
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
```

如何做到修改url参数页面不刷新

HTML5引入了 `history.pushState()` 和 `history.replaceState()` 方法，它们分别可以添加和修改历史记录条目。
```js
let stateObj = {
    foo: "bar",
};

history.pushState(stateObj, "page 2", "bar.html");
```

假设当前页面为 `foo.html`，执行上述代码后会变为 `bar.html`，点击浏览器后退，会变为 `foo.html`，但浏览器并不会刷新。



### 路由(导航)守卫
#### 是什么
导航守卫是vue-router提供的下面2个方面的功能
- 监视路由跳转  -->回调函数
- 控制路由跳转  -->  放行/不放行/强制跳转到指定位置    next()

#### 使用场景
- 在跳转到界面前, 进行用户权限检查限制(如是否已登陆/是否有访问路由权限)
- 在跳转到登陆界面前, 判断用户没有登陆才显示

#### 全局前置守卫

```js
router.beforeEach((to, from, next) => {
  // 使用场景： 验证用户身份，判断用户是否登录
  if(isLogin){ // 如果登录，正常跳转至home
    next()
  }else { // 如果未登录就跳转至登录界面
    if(to.path === '/login'){
      next()
    }else {
      next('/login')
    }
  }
})
```

#### 全局解析守卫
- 这和 `router.beforeEach` 类似，区别是在导航被确认之前，**同时在所有组件内守卫和异步路由组件被解析之后**，解析守卫就被调用。
```js
router.beforeResolve((to, from, next) => {
  // 负责解析路由地址，加载对应的路由组件
})
```

#### 全局后置钩子
```js
router.afterEach((to, from) => {
  // 路由完全跳转后执行
})
```

#### 路由独享守卫
```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

#### 组件内的守卫
* beforeRouteEnter
* beforeRouteUpdate
* beforeRouteLeave
```js
beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
    // 因为当守卫执行前，组件实例还没被创建
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
},
beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
},
beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
}
```



### 完整导航解析流程

1. 导航被触发。
2. 在失活的组件里调用组件后置守卫 `beforeRouteLeave` 。
3. 调用全局前置守卫 `beforeEach` 。
4. 在重用的组件里调用 组件解析守卫`beforeRouteUpdate`  (2.2+)。
5. 在路由配置里调用路由前置守卫 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用组件前置守卫 `beforeRouteEnter`。
8. 调用全局解析守卫 `beforeResolve` (2.5+)。
9. 导航被确认。
10. 调用全局后置守卫 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用组件前置守卫 `beforeRouteEnter` 中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。



#### 触发钩子的完整顺序

> https://www.yuque.com/cuggz/interview/hswu8g#2c3f563ad7506984575f1a323937c5c0

路由导航、keep-alive、和组件生命周期钩子结合起来的，触发顺序，假设是从a组件离开，第一次进入b组件

- beforeRouteLeave：路由组件的组件离开路由前钩子，可取消路由离开。
- beforeEach：路由全局前置守卫，可用于登录验证、全局路由loading等。
- beforeEnter：路由独享守卫
- beforeRouteEnter：路由组件的组件进入路由前钩子。
- beforeResolve：路由全局解析守卫
- <u>afterEach：路由全局后置钩子</u>
- beforeCreate：组件生命周期，不能访问this。
- created;组件生命周期，可以访问this，不能访问dom。
- beforeMount：组件生命周期
- <u>deactivated：离开缓存组件a，或者触发a的beforeDestroy和destroyed组件销毁钩子。</u>
- mounted：访问/操作dom。
- <u>activated：进入缓存组件，进入a的嵌套子组件（如果有的话）。</u>
- 执行beforeRouteEnter回调函数next。


### 问题

#### 路由懒加载
懒加载/异步加载: 请求对应的路径时才请求获取对应的打包文件
import动态引入的特点:
  单独打包(code split  代码分割): 被引入的模块会被单独打包
  单独打包是懒加载的前提
包含动态引入的函数: () => import('@/views/Home')
  开始不执行, 请求对应的路径时才会执行
  执行函数进才会请求加载对应的打包文件 

import静态引入:
  import xxx from '模块'
  会打包在一起

为什么要这么做: 主要为了提高首页的访问检验(更快), 访问首页时, 需要加载的打包文件更小了

**懒加载的缺点**: 访问其它路由更慢了 => 需要发请求加载对应的打包文件
解决: 预加载    提前加载后面需要其它的打包文件


#### 缓存路由组件
- 当离开时, 路由组件会自动销毁, 再跳转回来, 需要重新创建
- 目标: 能不能让路由组件离开时不销毁, 再回来时, 直接复用
- 解决: 使用`<keep-alive>来包含<router-view>`, 就能让对应的路由组件离开时不销毁
- 作用: 能复活组件对象, 包含它的所有状态相关数据




#### 如果指定name与params配置, 但params中数据是一个"", 无法跳转
* 解决1: 不指定params
* 解决2: 指定params参数值为undefined

#### 路由组件能不能传递props数据?
* 可以: 可以将query或且params参数映射成props传递给路由组件对象

```js
//在routes中配置
props: route=>({keyword1:route.params.keyword, keyword2: route.query.keyword })
```

#### 编程式路由航重复导航报错？
>跳转到当前路由(参数不变), 多次执行会抛出NavigationDuplicated的警告错误

##### 说明情况:
当编程式跳转到当前路由且参数数据不变, 就会出警告错误:
错误: `Avoided redundant navigation to current location` ==> 重复跳转当前路由
原因: 
vue-router在3.1.0版本(2019.8)引入了push()的promise的语法, 如果没有通过参数指定回调函数就返回一个promise来指定成功/失败的回调, 且内部会判断如果要跳转的路径和参数都没有变化, 会抛出一个失败的promise
说明文档: https://github.com/vuejs/vue-router/releases?after=v3.3.1

##### 解决方案
办法1: 在每次push时指定回调函数或catch错误
```js
push('/xxx', () => {})   ===> 声明式路由跳转本质就是这样执行的
push('/xxx').catch()
```

办法2: 重写VueRouter原型上的push方法 (比较好)
* 如果没有指定回调函数, 需要调用原本的push()后catch()来处理错误的promise
* 如果传入了回调函数, 本身就没问题, 直接调用原本的push()就可以
    ```js
    const originPush = VueRouter.prototype.push
    VueRouter.prototype.push = function (location, onComplete, onAbort) {
      console.log('push()', onComplete, onAbort)
      // 判断如果没有指定回调函数, 通过call调用源函数并使用catch来处理错误
      if (onComplete===undefined && onAbort===undefined) {
        return originPush.call(this, location).catch(() => {})
      } else { // 如果有指定任意回调函数, 通过call调用源push函数处理
        return originPush.call(this, location, onComplete, onAbort)
      }
    }
    
    ```

说明:
声明式路由跳转之所有没有问题, 是因为默认传入了成功的空回调函数

   ```js
   // 缓存原型上的push方法
   const originPush = VueRouter.prototype.push
   VueRouter.prototype.push = function (location, onComplete, onAbort) {
     console.log('push()', location, onComplete, onAbort)
     // this是路由器对象 $router
     // 如果调用push, 传递了成功或者失败的回调函数
     if (onComplete || onAbort) {
       // 让原来的push方法进行处理
       originPush.call(this, location, onComplete, onAbort) // 不用返回, 因为执行的结果返回是undfined
     } else { // 如果调用push, 没传递了成功或者失败的回调函数, 可能会抛出失败的promise, 需要catch一下
       return originPush.call(this, location).catch(() => {
         console.log('catch error')
       })   // 必须返回产生的promise对象
     }
   }
   ```


#### params与path配置能不能同时使用
不可以: router.push({path: '/xx', params: {name: 'tom'}})
params只能与name配合: router.push({name: 'xx', params: {name: 'tom'}})   

#### 如何配置params参数可传可不传?
path: '/search/:keyword?',    
注意: 一旦声明可以不传, 不能传入一个空串的param参数

#### 跳转携带的参数, 刷新就丢失了
如果注册没有指定/:xxx的点位, 而跳转时通过params配置携带的参数数据, 刷新时就会丢失
因为url中没有携带的参数数据路径
this.$router.push({name: 'Info', params: {a: 1, b: 2}})
this.$route.params.a
/info/1/2

#### 路由组件能不能传递props参数?
可以, 但只是将params/query映射成props传入路由组件的

路由配置中props属性的作用
- 组件中使用$route会使对应的组件形成耦合,这些组件只能在相应的url上使用,限制灵活性
- 通过props传递,简化了以往需要计算属性获取params,query参数.可以直接在组件的props属性上声明接收.



#### 如何让路由跳转后, 滚动条自动停留到起始位置?

```js
new VueRouter({ // 配置对象
  // ...
  scrollBehavior (to, from, savedPosition) {
    // 指定路由跳转后滚条的坐标
    return { x: 0, y: 0 }
  }
})


//返回上个页面定位到底上次访问的位置
scrollBehavior(to,from,savedPosition){
    if(savedPosition){
        return savedPosition;
    }else{
        return {x:0, y:0}
    } 
}

//完善 上面的代码.不是每个页面都有这个需求 搭配使用meta属性
scrollBehaviour(to,from,savedPosition){
    if(savedPosition && to.meta===true){
        return savedPosition
    }else{
        return {x:0,y:0}
    }
}
```

#### 如何实现登陆后, 自动跳转到前面要访问的路由界面

在全局前置守卫中, 强制跳转到登陆页面时携带目标路径的redirect参数

```js
if (userInfo.name) {
  next()
} else {
  // 如果还没有登陆, 强制跳转到login
  next('/login?redirect='+to.path)  // 携带目标路径的参数数据
}
```

在登陆成功后, 跳转到redirect参数的路由路径上

```js
await this.$store.dispatch('login', {mobile, password})
// 成功了, 跳转到redirect路由 或 首页
const redirect = this.$route.query.redirect
this.$router.replace(redirect || '/')
```



#### 重载组件,页面没有变化的解决方法
当从 C 组件切换到 C 组件（只更新参数的时候），C 组件并不会被重新创建或卸载，而是复用之前 C 组件，这样会导致只有路由变化，页面没有发生变化
<span style="color:red;">解决方案</span> 3种
* watch
* beforeRouteUpate
* router key

##### watch
使用watch进行监视，因为每次更新时，$route都会创建一个新对象 ，而不是原对象，所以所有数据都是新的，可以监视
```js
//项目中使用
search页面改变参数，无法重复发请求的问题
watch: {
    $route(newVal, oldval) {
      this.handlerSearchParams();
      this.getSearchInfo();
    },
  },
```


##### beforeRouteUpdate
```javascript
beforeRouteUpdate(to, from, next) {
  
}
```


##### router key
> https://mp.weixin.qq.com/s/0Yekkc08ozbNxuquHVGveg

```html
<router-view v-bind:key="$route.fullpath"></router-view>
```


#### 命名路由的时候params和query分别可以和什么搭配使用

query + name

query + path

params + name  (怎么记忆, 都有am)


#### 如何监听路由变化 //?
>https://juejin.cn/post/6875198510221197319
>https://github.com/Easay/issuesSets/issues/142


**vue-router实现原理** //概述
```js
// ...
this._router = this.$options.router
// ...
Vue.util.defineReactive(this, '_route', this._router.history.current)
```

* `this.$options.router`就是VueRouter的实例
* `this._router.history.current`是当前路由，在每次你`this.$router.push/this.$router.replace`的时候，current都会更新。
* 响应式属性`_route`。当响应式属性更新时，依赖这个属性的组件都会更新。
* RouterView就依赖了这个属性`_route`。它会根据`_route`的改变而更新组件渲染内容(重新执行render函数)。
* `_route`又会对应有当前路由匹配的组件，这些匹配的组件就是RouterView要渲染的内容。


##### 如何监听
使用Proxy方法
```js
history.pushState = new Proxy(history.pushState, {
  apply: function (target, thisBinding, args) {
    console.log('就这？');
    return target.apply(thisBinding, args);
  },
});


```











