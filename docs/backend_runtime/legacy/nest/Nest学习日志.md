
## 快速上手Nest CLI

### 1.安装
```sh
npm i @Nestjs/cli -g
```

需要注意,以上方式需要不定时更新,以获取最新代码:
```sh
npm update @Nestjs/cli -g
```
### 2.了解基本命令
运行`nest -h`了解其命令


### 3.创建项目
创建项目相关命令:
![[Pasted image 20250304204143.png]]
直接使用`nest n cli-test -p pnpm`命令:


#### 生成指定代码片段
执行`nest generate -h`命令来查看生成指定的代码片段:
![[Pasted image 20250304213630.png]]




#### 构建应用

执行`nest build –h`命令，可以看到build命令提供了一些可选参数

![[Pasted image 20250304215027.png]]


#### 启动开发调试

使用`nest start`命令来启动开发调试:
![[Pasted image 20250304215258.png]]

#### 查看项目信息
`nest info`查看Node.js, npm及Nest依赖包的相关版本信息.



### 创建第一个Nest应用

> 创建一个服务端应用，并使用React构建一个客户端应用。我们将实现客户端发送请求后，服务端接收请求、进行数据处理，并返回新的数据给客户端。

#### 1.生成后端项目

```sh
nest n web-app -p pnpm
```
安装完成以后, 启动该项目并保持热重载:
```sh
nest start --watch
```


#### 2.生成前端项目
安装React脚手架`create-react-app`
```sh

npm i -g create-react-app
```

查看是否安装成功
```sh
create-react-app --version
```

创建名为`web-app-front`的项目
```sh
create-react-app web-app-front
```

启动该项目
```sh
npm start
```



#### 3.前端项目配置

**配置内容如下**
* 将react项目精简结构,只保留最基本的页面结构和请求处理
* 添加代理`src/setupProxy.js`文件, 添加代理地址, 端口位8088


#### 4.后端项目配置如下
* `main.ts`中端口更改位8088
* 在`app.controller.ts`文件的getHello方法中接收参数id, 同时调用Service服务的getHello()方法并传递参数id

![[Pasted image 20250323153742.png]]

![[Pasted image 20250323153856.png]]

通过以上的配置, 我们可以在前端获取后端的返参数据.



#### 5. 模块化开发

**1.创建user模块**
* `nest g resource user`生成user模块
* 更改请求路径: 在`user.controller.ts`中修改请求路径
* 更改返回信息: 在`user.service.ts`中修改返参信息

```ts
//user.controller.ts

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/create-user')
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}
}
```

```ts
//user.service.ts
@Injectable()
export class UserService {
	create(createUserDto: CreateUserDto) {
		return {
			status: true,
			msg: '创建成功'
		}
	}
}
```




## AOP架构理念
### MVC架构概述

#### 是什么
> Nest属于MVC（Model-View-Controller，模型-视图-控制器）架构体系.

* **Model层**负责业务逻辑处理，包括数据的获取、存储、验证以及数据库操作。
* **Controller层**通常用于处理用户的输入，调度Service服务，以及进行API的路由管理。
* **View层**在传统的服务器端渲染中，可能使用如ejs、hbs等模板引擎。在前后端分离的体系中，通常指的是客户端框架（如Vue或React）负责的部分。

#### HTTP请求的流程
当一个HTTP请求到达服务器时，它首先会被Controller层接收.
Controller层会根据请求调用Model层中的相应模块来处理业务逻辑，并将处理结果返回给View层以进行展示.
![[Figure-P42_868024.jpg]]

### AOP要解决的问题
#### 背景
> 以一个HTTP请求为例，客户端发送请求时首先会经过Controller（控制器）​、Service（服务）​、DB（数据访问或操作）等模块。如果想要在这些模块中加入一些操作，例如数据验证、权限校验或日志统计，应该怎么办呢？
> 如果有多个功能模块都需要进行校验，并且权限校验的逻辑相同，那么是不是意味着需要在多个Controller中重复加入这段逻辑?.
> 需要统一管理, 就是切面.

![[Pasted image 20250323163355.png]]


在Controller的前后都可以“切一刀”​，用来统一处理公共逻辑，这样就不会侵入Controller、Service等业务代码.

#### Nest中的切面(AOP)区域
![[Pasted image 20250323163757.png]]

中间的灰色区域属于AOP切面部分，包含
* Middleware（中间件）​、
* Guard（守卫）​、
* Interceptor（拦截器）​、
* Pipe（管道）
* Filter（过滤器）​。
它们都是AOP思想的具体实现。


### AOP在Nest中的应用
#### 1.中间件
* 默认基于Express
* 分为全局中间件和局部中间件
* 全局中间件通过use方法调用.  所有进入应用的请求都会经过全局中间件，通常用于执行日志统计、监控、安全性处理等任务
* 局部中间件通常应用于特定的控制器或单个路由上，以实现更细粒度的逻辑控制

#### 2.守卫
* 守卫所在的位置与中间件类似，可以对请求进行拦截和过滤. 通常用于权限, 角色等授权操作
* 守卫在调用路由程序之前返回true或者false来判断是否通行，分为全局守卫和局部守卫。
* 守卫必须实现CanActivate接口中的canActivate()方法，代码如下：
![[Figure-P45_8911024.jpg]]
* 全局守卫在main.ts中通过**useGlobalGuards**来调用，每个路由程序都会经过它进行权限验证才能够通行。
```ts
//main.js

async function bootstrap() {
	const app = await NestFfactory.create(AppModule);
	//守卫
	app.useGlobalGuards(new PersonGuard())
	//启动服务
	await app.listen(8088);
}
```
* 与中间件类似，作为局部守卫，可以缩小控制范围，从而实现更加精细的权限控制。
```ts
@Controller('person')
//声明守卫
@UssGuards(new PersonGuard())
//控制器
export class PersonController {}
```



#### 3.拦截器
* 拦截器不同于中间件和守卫，它在路由请求之前和之后都可以进行逻辑处理，能够充分操作request和response对象
* 拦截器通常用于记录请求日志、转换或格式化响应数据等。
* 类似于守卫，拦截器可以设置为控制器作用域、方法作用域或全局作用域。


**下面的代码定义了一个用于统计接口超时的拦截器**
![[Pasted image 20250323193230.png]]


****

**2.控制器作用域允许拦截器只作用于某个控制器。**
> 当程序执行到控制器时触发拦截器逻辑，通过@UseInterceptors装饰器将TimeoutInterceptor绑定到控制器类

```ts
@Controller('person') // 为控制器绑定超时拦截器 
@UseInterceptors(new TimeoutInterceptor()) 

export class PersonController {}
```


**3.方法作用域把拦截器的作用范围限制在某个方法上，比全局或控制器级别的范围更加精确。**
> 当程序执行到该方法时，触发拦截器的逻辑。

```ts
@Get() // 为单独的方法绑定超时拦截器 
@UseInterceptors(new TimeoutInterceptor()) 
findAll() { return this.personService.findAll(); }
```


**4.全局作用域允许拦截器应用到整个应用中。**
> 在main.ts文件中，可以通过app.useGlobalInterceptors()方法进行绑定，

```ts
async function bootstrap() { 
	const app = await NestFactory.create(AppModule); // 全局超时拦截器
	app.useGlobalInterceptors(new TimeoutInterceptor()); // 启动服务
	await app.listen(8088); } 
	bootstrap();
```



#### 4.管道
> 管道用于处理通用逻辑，其中两个典型的用例是处理请求参数的验证(validation)和转换(transformation)。
> 在执行路由方法之前，会首先执行管道逻辑，并将经过管道转换后的参数传递给路由方法。

Nest框架内置的管道, 及用户自定义的管道

**自定义管道-transform**
![[Pasted image 20250323194751.png]]


#### 5.过滤器

Nest中最为常见的是HTTP异常过滤器，通常用于在后端服务发生异常时向客户端报告异常的类型。目前内置的HTTP异常包含：
* BadRequestException
* UnauthorizedException
* NotFoundException
* ForbiddenException
* NotAcceptableException
*  RequestTimeoutException
* ConflictException
* GoneException
* HttpVersionNotSupportedException
* PayloadTooLargeException
* UnsupportedMediaTypeException

它们都继承自HttpException类。当然，我们也可以自定义异常过滤器，并向前端返回统一的数据格式：
![[Pasted image 20250323200919.png]]



....





## IoC(控制反转)思想
#### 背景
> 在后端架构中，当多个Controller模块调用同一个Service类时，我们希望确保它们使用的是同一个实例，即维持单例模式。在大型应用中，手动管理这种依赖关系可能会变得复杂，这是传统后端开发经常面临的一个挑战。
> 幸运的是，IoC（Inverse Of Control，控制反转）提供了一种解决方案。IoC容器在应用初始化时，会查找每个类上声明的依赖，并按顺序创建相应的实例，然后管理这些实例。当需要使用某个依赖时，IoC容器会提供相应的对象实例。

依赖注入(DI)是实现IoC的一种常见方式。

#### 为什么?
为么称之为“控制反转”呢？让我们通过一个生活化的比喻来说明：

自己做饭:
买菜->处理食材->烹饪

外出就餐:
菜单点菜->服务员->厨师


>通过IoC，我们从主动创建和维护对象转变为被动等待依赖注入，实现了从主动下厨到等待服务员上菜的转变，这就是IoC控制反转的精髓。??



#### IOC在Nest中的应用

```js
//app.controller.ts
     @Controller()
     export class AppController {
       constructor(private readonly appService: AppService) {}

       @Get()
       getHello(): string {
         return this.appService.getHello();
       } 
     } 
```


AppController类通过@Controller装饰器来修饰，表示它可以进行依赖注入，由Nest内置的IoC容器接管

```js
//app.service.ts
 import { Injectable } from '@nestjs/common';

 @Injectable()
 export class AppService {
   getHello(): string {
	 return 'Hello World!';
   } 
 } 
```

AppService类通过@Injectable进行装饰，表示这个类(class)可以被注入，同时也可以注入其他对象中。

#### 控制器的作用

* 控制器(Controller)只用于处理请求，不作为依赖对象被其他对象组件注入。
* 可以把控制器看作是消费者，而服务(Service)和中间件(Middleware)则是提供者。

#### 哪些组件适用装饰`@Injectable`?
> 殊情况下，Nest中所有需要依赖注入的模块都可以使用@Injectable进行标记，以便IoC容器进行收集和管理。

* 服务Service
* 中间件middleware
* 过滤器Filter
* 拦截器Interceptor
* 提供者Provider
* 网关Gateway
* 等


#### @Injectable认识

> 装饰器的核心能力并不是直接给类添加新方法或属性，而是通过元数据（metadata）​或包装类的方式，赋予类新的逻辑能力或框架层面的标识。@Injectable() 的威力在于它通过装饰器模式，将类标记和配置到 NestJS 的依赖注入系统中，而不是直接修改类本身。



##### 1.元数据于框架写作
> 装饰器本身可能不修改类的代码，但会**附加元数据**，框架在运行时读取这些元数据来决定如何处理这个类。例如：

```ts

import {Injectable} from '@nest/common'

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World';
	}
}
```
NestJS 在启动时，会扫描所有被 `@Injectable()` 装饰的类，将它们注册到 ​**IoC 容器**中。当其他类（如控制器）需要注入 `AppService` 时，容器会自动实例化并管理其生命周期。



##### 2.解析

```ts
// NestJS 源码 (简化)
export function Injectable(options?: InjectableOptions): ClassDecorator {
  return (target: object) => {
    // 1. 标记此类为 Provider
    Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, options, target);
    // 2. 记录依赖项元数据（通过 reflect-metadata）
    // ...
  };
}
```



## 调试Nest应用

### 1.在浏览器中调试

#### 两种调试方式
* 启动应用,并开启热重载+调试模式
* 访问WebSocket端口9229

#### 1.启动应用+热重载+调试
```sh
npm run start:debug

//修改端口
(npx) nest start --watch --debug 8083
```
启动之后, 访问`http://localhost:3000`即可看到正常返回的内容


#### 2.使用websocket接口调试
Nest启动了一个默认端口为9229的WebSocket服务. 只需连接这个端口就可以进行调试.
1. Chrome中输入`chrome://inspect`后按下enter键, 会显示已经连接上远程目标
2. 点击`inspect`, 可以在`资源`栏目下找到当前项目的资源, 即可添加断点,刷新前端页面, 即可调试.



### 2.在VSCode中调试

#### 3种方式
* 直接在代码中打断点
* package.json中添加命令行启动方式(不需要每次输入参数, nest已经配置)
* 使用vscode的自动附加模式

#### 3.自动附加模式

1. 按快捷键Ctrl+Shift+P(windows)​，在弹出的命令面板中输入“Toggle Auto Attach”​，接着选择“总是”选项，以自动附加调试器到Node.js进程
2. 重新打开控制台并运行: `pnpm run start:dev`命令, 此时vscode自动启动应用时,还会自动创建一个调试器(debugger)服务.

#### 4.扩展调试
1. 在调试面板中单击创建`launch.json`文件
2. 选择Node.js作为调试器, 配置相关调试信息, 将launch.json中,将program字段的值修改为应用程序的入口点,例如`main.ts`
3. 配置完成后, 即可在项目中添加断点,启动'调试'按钮.

![[Pasted image 20250402185836.png]]
此种方式优点就是避免了每次启动都需要创建一个新的websocket调试服务,从而节省了运行时的内存消耗. 这是最常用的调试方式, 适用于Vue, React, Node.js等多种应用调试.


## Nest核心概念概述
### 装饰器



### 模块化



### 控制器与服务



### 中间件




### 拦截器与RxJS






## 管道




## 文件上传

