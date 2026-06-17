```js
小程序官网:
实现布局,查看组件
实现功能,查看api
实现配置或页面语法,查看框架和指南
```



### 小程序和react vue比较

```js
react 小程序都没有数据劫持,引发视图更新, 必须要setData() setState()
```





### 知识点

```js
//app.js 
名称的原因:约定俗称的,

//响应式和自适应的区别
自适应:变化是实时的 用rem实现
响应式:根据临界值来变化 


//文档-框架-小程序配置-全局配置 
string[]   字符串类型的数组


//app.json 全局配置文件
navigationBarTextStyle: 'black' //是颜色的设置 只支持两种
style:'v2'  样式的版本

//app.wxss 样式文件
只有类选择器,不能使用id选择器

//pages
新建页面之前,应该先准备好app文件
view组件默认相当于div

//自动在最外层添加page标签,等同于html标签
有默认宽度100%,但是没有高度  //一般在app.wxss中设置高度为100%

//小程序如何修改数据  
this.setData({
    message:'xxx'
})
//在script中获取数据  this.data.key
  在页面中获取data数据 直接访问  {{data}} data
//
```





### 小程序index.js中

```js
//小程序修改数据是同步还是异步
同步

//标准事件流的几个阶段
0.捕获阶段
1.执行目标阶段
2.冒泡阶段

//tap和touchstart比较
tap相当于click事件
事件函数和data和生命周期同级

绑定事件名称: bind+事件名称, 例如bindtap="bindtap"

catch能捕获不能冒泡

//路由跳转
默认启动页面pages中的第一个,
如何设置:1.改变pages里页面顺序;2.使用entryPagePath

url参数是个字符串,需要添加根目录/

//生命周期
onLoad  页面加载  执行一次  发请求
onReady 页面初次渲染完成  执行一次
onShow 监听页面显示 执行多次
onHide  监听页面隐藏
onUnload 监听页面卸载

//wx.navigateTo
当前页面执行生命周期onHide

//wx.redirectTo
目标页面执行生命周期 onLoad onShow onReady

//授权 授权一次即可
open-type="getUserInfo"

//获取用户信息的基本操作

```



### 小程序特点

#### 概述

```js
//特点
1.没有DOM
2.组件化开发
  组件:具备特定功能效果的代码集合;
  组件和页面关系:1个页面可包含多个组件;
  如何用html描述什么是组件?标签可以认为是组件,多个组件拼接成页面
3.体积小.单个压缩包不能大于2M,否则无法上线

4.4个重要文件
  
5.适配方案rpx(responsive pixel响应式像素单位)
  响应式和自适应的比较:响应式是根据临界值实现,自适应是根据rem实现
  小程序适配单位rpx
  规定任何屏幕为750rpx
  小程序会根据屏幕的宽度不同自动计算rpx值大小
  iPhone6下, 1rpx=1物理像素=0.5px
```



#### 配置

```js
全局配置 app.json

页面配置 页面名称.json
页面配置权限高于全局配置

sitemap配置: sitemap.json
用于被微信搜索爬取页面


```





#### 框架接口

```js
1.APP
 全局app.js中执行App()
 生成当前应用的实例对象
 getApp()获取全局应用实例
 
2.Page
 页面.js中执行Page()
 生成当前页面的实例
 通过getCurrentPage()获取页面实例
```



### 小程序语法

#### 数据绑定+++

```js
1.初始化数据
页面.js中的data选装中
Page({
    data:{
        message: 'Hello, World'
    }
})

2.使用数据
 模板结构中使用双大括号{{message}}
 小程序中为单项数据流 model-->view
 
3.修改数据 ****
 this.setData({message:'修改之后的数据'}, callback)
 特点:
 同步修改:this.data的值被同步修改; 
 异步更新:异步将setData函数用于将数据从逻辑层发送到视图层
 
 
```





#### 事件绑定

```js
1.事件分类
 冒泡事件:当一个组件上的事件被触发后,该事件会向父节点传递.
 冒泡事件列表:
 
 非冒泡事件:当一个组件上的事件被触发后,该事件不会向父节点传递.
 表单事件和自定义事件通常是非冒泡事件.
 
2.绑定事件
 bind绑定:不会阻止事件向上冒泡.
 <view bindtap="handleTap">
     <text>xxxx</text>
 </view>
 catch绑定:会阻止事件向上冒泡
 
3.向事件对象传参
 语法:data-key=value  key是自定义,获取的时候也要写当时定义的名称
 <input bindblur="handleBlur" data-type="phone" type="text" placeholder="输入手机号"/>
     
 获取:
 event.target.dataset.key || event.currentTarget.dataset.key

4.Event.target和event.currentTarget的区别
 Event.target是触发事件的对象,但不一定是绑定事件的对象.如:事件委托,冒泡
 currentTarget触发事件的对象一定是绑定事件的对象,没有事件委托.
```



#### 列表渲染

```js
1.语法说明
wx:for='{{arr}}'
wx:key='{{唯一值}}'

2.注意事项
默认个体:item
默认下标:index
自定义个体变量名称: wx:for-item="myitem"
自定义下标变量名称: wx:for-index="myIndex"


```



#### 条件渲染

```js
1.语法说明
 wx:if="条件"
 wx:elif="条件"
 wx:else

2.wx:if VS hidden
 hidden用法: <view hidden='{{true}}'></view>
 wx:if等同于v-if, 条件为false时不加载,条件切换决定元素销毁或重新加载渲染.
 hidden等同于v-show, 始终加载元素,条件切换决定元素的显示和隐藏.
```





#### 模板使用

```
1.定义模板
 使用name属性,定义模板的名字,然后再<template/>内定义代码片段
 <template name="msgItem">
 	<view>
 </template>
 
2.引入模板
引入模板结构:
<import src="模板结构相对路径"/>
引入模板样式:
@import '模板样式路径'

3.使用模板
使用is属性,声明需要使用的模板,然后将模板搜需要的data传入.
<template is="msgItem" data='{{..item}}'

4.向模板中导入数据并使用数据
 导入数据
 <template data='{{...item}}'/>
 使用数据
 <template>
  <view>
    <text>{{msg}}</text>
  </view>
 </template>
 数据源:
 Page({
 	data:{
 		item:{
 			index:0,
 			msg:'this is a template'
 		}
 	}
 })
```



#### 生命周期

```js
1.onLoad(Object query)
 页面加载时触发.一个页面只会调用一次,可以在onLoad的参数中获取打开当前页面路径中的参数

2.onShow() 
 页面显示/切入前台时触发.
 会执行多次.
 
3.onReady()
 页面初次渲染完成时触发,一个页面只会调用一次.代表页面已经准备妥当,可以和视图层进行交互.
 
4.onHide()
 页面隐藏或切换后台时触发.如wx.navigateTo或底部tab切换到其他页面,小程序切入后台等.
 
5.onUnload()
 页面卸载时触发.如wx.redirectTo或wx.navigateBack到其他页面时.
```









### 数据绑定

|        | 数据流方向 | 数据绑定 | 初始化数据            | 修改数据                                | 获取数据       |
| ------ | ---------- | -------- | --------------------- | --------------------------------------- | -------------- |
| React  | 单向       | 单向     | state:{}              | this.setState().自身钩子异步,非自身同步 | this.state.key |
| Vue    | 单向       | 双向     | data-->代理到this身上 | this.key=value                          | this.key       |
| 小程序 | 单向       | 单向     | data:{}               | this.setData({})                        | this.data.key  |



### 标准事件流的几个阶段

```js
1.捕获阶段
2.执行目标阶段
3.冒泡阶段
```

![04. 事件流阶段说明.png](https://i.loli.net/2021/03/10/XjM1esDnHQ9SmdC.png)

### 获取用户基本信息

```js
1.首次登录未授权
<button open-type="getUserInfo" bindgetuserinfo="handleGetUserInfo">
    
2.授权以后再次登录
onLoad:function(options){
    wx.getUserInfo({
        success:(res)=>{
            this.setData({
                userInfo:res.userInfo
            })
        },
        fail:()=>{
            console.log('获取失败')
        }
    })
}
```



### 服务器域名配置

```js
//如何配置
小程序官网-->配置服务器信息
//如何禁用
不校验域名:开发工具->详情(右上角)->不校验合法域名...
```





<hr>


### 小程序中的for循环

```js
1.语法
 直接使用data中的数据;key值获取无需使用花括号;循环默认遍历的每个对象为item,索引为index
<swiper-item wx:for="{{bannersList}}" wx:key="bannerId" >
    <image src="{{item.pic}}"/>
        
2.key的作用以及其值采用index的缺点
页面更新DOM,要实现最小化页面重绘,使用Diffing算法根据key的值比较每个标签是否更新.

3.wx:for-item属性当在多个数据嵌套时,可以解决item的命名冲突.
```





### 前后端交互

```js
1. 语法： wx.request()
2. 注意点： 
   1. 要求所有请求的协议必须是https协议
   2. 最大并发限制是 10 个
   3. 发请求之前需要现在小程序后台开发主页上 配置 域名信息

```



### 封装请求++

```js
在utils/request.js中封装网络请求,将根目录地址再次封装到utils/config.js

//config.js
export defualt {
    host:'http://localhost:3000'
}

//request.js
import config from './config.js';
export default (url, data, method="get")=>{
    return new Promise((resolve,reject=>{
        wx.request({
            url:config.host+url,
            data,
            method,
            success:(res)=>{
                resolve(res.data)
            },
            fail:(err)=>{
                reject(err)
            }
        })
    }))
}

//index.js 自定义函数,与生命周期函数同级
import request from '../../utils/request';
getInitData(){
    let result = await request('/banner', {type:2});
}
```



### 事件委托

```js
1. 什么是事件委托
   1. 将子元素的绑定(委托)给父元素
2. 事件委托的好处
   1. 减少绑定的次数，节省内存空间
   2. 新添加的子元素也可以享用同类型的事件
3. 事件委托的原理
   1. 冒泡
4. 触发事件对象是谁
   1. 子元素
5. 如果找到触发的对象
   1. event.target

```



### currentTarget和target

```js
1. target
   1. 指向触发事件的对象不一定是绑定事件的对象
   2. 示例： 事件委托
2. currentTarget
   1. 触发事件的对象必须是绑定事件的对象

```



### 存储

```js
1. localStorage
   1. 永久存储，存储在硬盘，除非主动删除
   2. 存储量5M
2. sessionStorage
   1. 会话存储，存储在内存，会话结束，释放内存
   2. 存储量5M
3. cookie
   1. 由来： http协议是无状态协议
   2. 特点： 
      1. 存储量4kb
      2. cookie不安全，容易被截获，容易被编译
      3. 服务器端生成，保存在客户端
      4. 以后发请求每次都会携带，会造成带宽的浪费
4. session
   1. 服务器端生成，保存在服务器端
   2. 需要用cookie作为载体

```



### 封装公共组件

```js
封装公共组件components

1.定义
 接收props参数,
2.注册并使用
在页面.json中的usingcomponent中引入公共组件的路径
在页面.wxml中使用 <NavHeader title="xx" nav="xx"></NavHeader>

3.数据传递和接收
自定义属性传递, 使用properties接收属性
```



### 扩展-封装功能函数和组件介绍

```js
封装功能函数:
1.功能点明确,单一
2.函数内部保留的是静态不变的代码
3.将动态数据提取出来,作为函数的形参
4.由使用者根据情况来注入形参
5.要保证功能函数安全,应设置形参默认值

封装组件:
1.功能明确,单一
2.内部保留静态数据
3.由使用者根据情况以标签属性形式传入动态数据
4.一个良好组件应设置prop数据必要性和数据类型

```





### 自定义事件

```js
1. 绑定事件
   1. 事件名
   2. 事件的回调
   3. 获取数据的一方
   4. 订阅消息： subscribe(‘eventName’, callback)
   5. $on(‘eventName’, callback)
2. 触发事件
   1. 事件名
   2. 事件对象数据 === 标准DOM事件的event对象
   3. 提供数据的一方
   4. 发布消息： publish(‘eventName’, data)
   5. $emit(‘eventName’, data)



```







### 小程序组件使用

```js
1.轮播图swiper  一屏一个
<swiper circular indicator-dots indicator-color="#d43c33" indicator-active-color="#fff">
    <swiper-item></swiper-item>

2.滚动条scroll  一屏多个
<scroll-view enable-flex scroll-x>
    
3.bug
scroll-view变为flex之后,高度还是原来的,需要设定高度
```



### 样式

```js
1.单行文本省略
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis

2.多行文本省略
overflow:hidden;
text-overflow:ellipsis
display:-webkit-box;
-webkit-box-orient:vertical;
-webkit-line-clamp:2;
```



<hr>


### 功能-tabBar

```js
https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html

注意事项:
"pagePath":"path/index/index"  //不需要加根目录
```











### login页面功能实现

```js
登录流程
 1收集表单数据
 2前端验证
  2.1 验证表单内容是否合法
  2.2 验证不通过:提示用户
  2.3 验证通过:发请求,进行后端验证
 3.后端验证
  3.1 验证账号是否存在
  3.2 用户不存在:直接返回不存在数据,登录失败
  3.3 用户存在: 验证密码是否正确
  3.4 密码不正确:返回密码不正确数据
  3.5 密码正确:返回登录成功信息,通常包含用户的token

//login页面手机号和密码的收集
<input id="phone" data-phone="phone" type="phone" bindinput="handleInput" placeholder="输入手机号" />
事件bindinput:当input输入值时自动触发
id,data-xxx, type作为标签属性,存储在当前点击事件的event对象中,层级位置不同.
event.type
event.target.id event.currentTarget.id
event.target.dataset.xxx event.currentTarget.dataset.xxx

id只能设置一个,data-xxx可以设置多个
```





### video页面++

```js
flex:1
flex: flex-grow（可拉伸）: 0; flex-shrink(可压缩): 1; flex-basis: auto(自身宽度);
flex: 1; flex-grow: 1; flex-shrink: 1; flex-basis: 0%;
flex: auto; flex-grow: 1; flex-shrink: 1; flex-basis: auto;
flex: 1; 会导致父元素，伸缩盒模型宽度为100%；

标签属性id,获取其中数据标识会自动将number类型转换为string
navId===item.id 如果没有起作用,就是两者数据类型不一样

怪异盒子

```



### 请求模块中cookie获取使用

```js
获取cookie并将它设置在请求头中,必须使用同步代码wx.getStorage('cookies'), 否则容易出问题.

请求头中header是[object Array]
 因为使用了Object.prototype.call.toString(xx),所以需要将cookie转换成字符串
 JSON.stringify(wx.getStorageSync('cookies')),但转换成功后的字符串带着'['和']'
 所以使用数组的toString()方法
```





### 小程序中同步异步

```js
this.setData({}) 同步
```





### 扩展

```js
位移运算符: 
>>> <<<
1.右移零位:将非number强制转换成number类型
let num = 3;
// 0000 0011
//   000000 00
console.log(num>>>2) // 0
console.log(num>>>1) // 1
num>>>0  转换成数值  //将event.currentTarget.id自动转换成的字符串变成number类型

2. !!强转换成布尔值 !!!
    

```





<hr>


### video

#### 跳转到指定位置

```js
scroll-into-view=某个子元素id //不能数字开头  循环体中的id只能在循环体中使用
添加过渡 


```



### 跳转到指定位置播放

```js
api 跳转到指定位置 videoContext.seek(number)
组件-媒体-video bindtimeupdate 播放进度变化时触发 event.detail={currentTime, duration}


handleUpdateTime(event){
    let{}=this.data;
}



```



#### 视频播放结束

```js
//播放结束事件解决'跳转到指定(最后)位置播放'产生的bug. 如果播放到最后应该从记录数组中清除
```





#### 下拉刷新

```js
下拉刷新:
1.页面的
1.配置:框架-小程序配置-页面配置-enablePullDownRefresh
2.使用页面页面当中的函数 onPullDownRefresh

2.scroll-view标签的

```



#### 自定义转发分享

```js
https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object

1.button分享
<button open-type="share" >

2.用户点击右上角分享(调用分享给朋友功能)

使用js中的onShareAppMessage函数(框架-页面-page)可监听右上角和button组件的转发按钮行为,自定义转发内容


```





### 路由跳转

```js
vue路由跳转传参: query params props(布尔值 对象 函数) meta
小程序路由传参: query

原生小程序对query参数有长度限制,如果长度过长会自动截取.且会对query参数自动进行类型转换
所以在传递和接收时,需要进行json类型转换 传:JSON.stringify(xx) 收:JSON.parse(options.xx)

onLoad(options){}生命周期函数,options中接收query参数对象
```



### 动态设置窗口标题

```js
api-
wx.
```

























### 安装第三方包

```js
1.初始化package.json
2.勾选允许使用npm
3.下载npm包
4.构建npm: 开发工具-工具-构建npm. 会将node modules中的包打包到miniprogram npm中
```



### 分包

```js
1.分包的原因:
 1.1 小程序要求压缩包体积小于2M
 1.2 提高用户体验, 提高页面的加载速度

2.分包注意事项:  请求路径更新

3.分包形式3种
 3.1 常规分包
 a.实现 app.json->subpackages字段
 b.特点: 先加载,访问加载;分包不分家,访问主包文件..;主包:来源(除分包内容)&启动页+tabBar页面

 3.2 独立分包
 a.设置: independent:true
 b.特点: 可单独访问,无需下载主包;不能依赖主包或其他包   //静态资源需要复制一份:例如css,image
 c.使用场景:页面和其他页面关系不大时使用:临时广告页||活动页

4.分包预下载
 4.1配置:app.json->preloadRule
  4.1.1 key页面路径 packages预下载包名/根路径
 4.2特点:加载当前包时可设置预下载其他包;缩短等该时间+体验
```





### 总结:小程序开发中遇到的问题

```js
 
1.页面通信
 1.1 方式:路由 storage
 1.2 注意:原生小程序截取过长的query字段
2.本地存储
 2.1 上限
3.请求
 3.1 协议
 3.2 并发
4.分包
 4.1 原因
 4.2 形式
 4.3 特点
 
5.性能优化
 5.1 视频优化
 5.2 
6.分享
```











<hr style="height:4px; background-color:red;" />

## uni-app



### 开发配置信息

```js

1.使用HbuilderX编辑器运行到浏览器中的项目,需要提前配置好的有:
 跨域,
 数据假报错(数据已经请求回来并显示,但在console中有undefined的错误)
1.2 解决方案:
 根目录下vue.config.js文件
 使用webpack跨域代理设置devServer,请求网址添加跨域对接暗号,例如/api
 使用在父元素上使用v-if搭配子元素上的v-for使用(优先级)

2.HbuilderX运行小程序提前配置:
 2.1 工具-设置-小程序运行配置 添加小程序按钮路径
 2.2 项目根目录文件manifest.json->微信小程序配置->AppId,勾选ES6转ES5
 2.3 小程序开发工具->设置-安全设置-打开端口


3.
```



### 自定义服务器

>使用库koa koa-router
>
>1.初始化文件夹
>2.下载npm i koa koa-router
>3.模块化使用
>3.1 server.js

```js
//server文件夹根目录下 server.js
let Koa = require('koa');
let router = require('./router/index.js');

//1.实例化
let app = new Koa();

//4.使用中间件
app
   .use(router.routes()) //使用路由
   .use(router.allowedMethods()) //使用注册路由方法

//2.监听端口
app.listen('3001', (err)=>{
    //node中错误优先
    if(err) return console.log('服务器错误'+err);
    console.log('服务器启动成功');
    console.log('服务器地址: http://localhost:3001 ');
})
===================== 
// server文件下 router/index.js
let KoaRouter = require('koa-router');

//3.生成路由对象
let router = new KoaRouter();

// 5.注册路由  ctx=>context
router.get('/text', (ctx)=>{
    ctx.body = '测试数据'
})

//5.1 主页数据接口
let data = require('../datas/index.json')
router.get('/getIndexData', (ctx)=>{
    ctx.body = data;
})

module.exports = router;
```







### stylus样式

```js
样式书写规范:
1. 样式嵌套,有层级
2. 可省略大括号,引号,冒号
3. &表示父级引用
```



### 0319

### 样式

```js
display:flex
flex-wrap:wrap
justify-content:space-around


//解决奇数商品最后一个居中问题
&.after
 content:''
 width:345rpx
 
 
 //图片和文字基线
 vertical-align:middle
 image和text

//类名命名方式 中横线,小驼峰

//先写结构还是后写结构,根据数据获取的难易. 简单就先写结构

//伪元素


//小程序可能存在1个像素的偏差


//左右联动布局

```



### 数据传递

```js
原生小程序路由query参数传递数据过多会被自动截断

使用uniapp开发的小程序,可使用路由传对象,但需要进行字符串转化
```



### 响应式数据添加

```js
//通过vue,vm

Vue.set(obj,newPropertyName/newIndex, value)
vm.$set(obj,newPropertyName/newIndex, value
        
        
商品属性isSelected(是否被选中), count(数量)是需要后添加的
所以需要使用vue或vm上的set()方法,这样做的好处是节省内存.
    
```



### 3级联动数据设计

```js
//parentId设计

{
    "provinces": [
        {
        "name":"河北省",
        "id":"01"
        },
        {
        "name":"山西省",
        "id":"02"
        }
    ],
    "cities":[
        {
        "name":"保定市",
        "id":"01"
        "parentId":'12'
        }
        .....
    ],
    "countries":[]
   
}
```







### 0320

### 商品状态数量

```js
//vuex模块中可以使用wx方法
wx.showModal({
    title:'title',
    success:(res)=>{
        console.log(res.confirm)  //true false
    }
})
```



### 获取用户信息

```js
//使用jsonwebtoken(jwt)来

//获取用户基本信息
1.首次登录未授权(授权登录只需一次)
button按钮添加open-type属性,
2.wx.getUserInfo()获取用户信息

3.支付等需要验证用户唯一标识openId
https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
 3.1 获取用户临时id
 wx.login({
     success:(res)=>{
         let code = res.code;//调用接口获取登录凭证（code）
     }
 })
 3.2 使用3个数据appid appsecret code请求用户唯一标识openid
 3.3 
```













































































































