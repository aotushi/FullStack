
# axios二次封装



### axios封装方案了解

#### 1.前端请求流程图
[[前端请求流程图]]

#### 封装方案了解
##### 方案1
> https://juejin.cn/post/7124573626161954823
##### 方案2
> 来源: [blog/docs/ts/axios.md at master · kvchen95/blog](https://github.com/kvchen95/blog/blob/master/docs/ts/axios.md)


### 如何优雅的封装axios
- [x] 全局消息提示
- [ ] axios二次封装
  - [x] 请求拦截器+响应拦截器的基础设置
  - [x] 取消全部请求
  - [x] 允许重复请求
  - [x] 本地开发切换代理
  - [x] 推导出response的类型
  - [x] token无感刷新
  - [ ] 接口缓存策略
  - [ ] 请求超时重复机制
  - [ ] 下载/上传
- [x] mock数据服务: strapi




### 1.请求拦截器+响应拦截器基础设置
* 基础请求(get, post, put, del等请求的封装)
* 拦截器的基本封装
  * 请求拦截器: 
    * 请求头设置
    * 用户标识添加
  * 响应拦截器
    * 网络错误处理
    * 授权错误处理
    * 普通错误处理
    * 代码异常处理


### 2.axios中如何取消请求
#### 2.1Axios请求取消实现方法

##### 使用AbortController（推荐，现代API）
1. 创建AbortController实例
2. 将controller.signal传递给axios请求的config
3. 调用controller.abort()取消请求
4. 在拦截器中捕获取消异常
5. 使用axios.isCancel()判断错误是否为取消操作

##### 使用CancelToken（传统方式，已弃用）
1. 创建CancelTokenSource: const source = axios.CancelToken.source()
2. 将source.token传递给请求配置
3. 调用source.cancel()方法取消请求
4. 处理取消请求的异常

#### 2.2实现方案
 * 重复请求取消的实现步骤
 * 实现重复取消机制的关键代码

#### 2.3 实现方案
1. 整体思路是将请求中的`url,method,params,data`字符串拼接形式作为唯一的键, 将axios的取消方法实例作为值.
2. 在**请求拦截器**中将请求添加到map中:
   * 如果已经存在相同请求, 则取消此请求
   * 如果不存在相同请求, 则正常添加到map中
1. 在**响应拦截器**中
   *  在成功和失败的回调中, 调用移除请求的方法
4. 声明取消全部请求的方法


##### 适用场景
* 页面切换
* 搜索输入时的防抖节流: 快速输入时,需要取消上一次的搜索请求,只发送最后一次
* 下拉列表的频繁切换
* 用户手动取消操作: 用户点击取消按钮,关闭弹窗或放弃某个操作
* 请求超时自动取消
* 重复提交防止
* 组件卸载时
* 登录状态改变: 用户退出登录时取消所有未完成的请求
* 依赖条件变更: 如使用React的useEffect时，依赖项变化导致之前的请求不再有效
* 网络状态变化: 网络从在线变为离线
* 无限滚动加载时切换条件: 比如用户在滚动加载时突然切换了筛选条件

##### 注意事项
1. 新版Axios推荐使用AbortController而非CancelToken
2. 请求取消不会阻止服务器端的处理，只是客户端不再接收响应
3. 取消请求需要合理处理异常，避免出现未捕获错误
4. 批量取消请求时需保证取消操作的幂等性


```ts
// src/axios/http.ts  简化版

class HttpRequest {
  private _instace
  private _defaultConfig = {
    baseURL: import.env.VUE_APP_BASE_URL || 'api',
    timeout: 1000*6
  }
	private pendingRequests
  
  constructor(config) {
    this._instance = axios.create(Object.assign(this._defaultConfig, config))
    
    this.pendingRequests = new Map()
    this.setupInterceptors()
  }


	private getRequestsKey(config) {
    const {method, url, params, data} = config
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

	private removePendingRequest(requestKey) {
    if (this.pendingRequests.has(requestKey)) {
      const controller = this.pendingRequests.get(requestKey)
      controller.abort()
      this.pendingRequests.delete(requestKey)
    }
  }

	private addPendingRequest(config) {
    const requestKey = this.getRequestsKey(config)
    this.removeRequestKey(requestKey)
    
    const controller = new AbortController()
    config.signal = controlller.signal
    this.pendingRequests.set(requestKey, controller)
  }
  //取消所有请求
	public cancelAllRequests() {
    this.pendingRequests.forEach(controller => controller.abort())
    this.pendingRequests.clear()
  }

	setupInterceptors() {
    this._instance.interceptor.request.use(
    	config => {
        // 防止重复请求
        this.addPendingRequest(config)
        
        //处理请求头
        //...
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    this._instance.interceptor.response.use(
    	response => {
        const requestKey = this.getReuqestKey(response.config)
        this.removePendingRequest(requestKey)
        
        if (response.status !== 200) {
          return Promise.reject(response.data)
        }
        handleAuthError(response.data.errno)
        handleGeneralError(response.data.errno, response.data.errmsg)
        return response
      },
      err => {
        if (error.config) {
          const requestKey = this.getRequestKey(error.config)
          this.removePendingRequest(requestKey)
        }
        
        if (axios.isCancel(err)) {
          return Pormise.reject(new Error('请求已取消'))
        }
        
        if (error.response) {
          handleNetworkError(error.response.status);
        } else {
          message.error('网络异常，请稍后重试');
        }
        return Promise.reject(error);
      }
    )
  }
	
}
```



![image-20250413135453209](assets/image-20250413135453209.png)

### 3.取消全部请求

 声明一个方法, 在页面上调用即可.

```ts
// src/api/http.ts


class HttpRequest {
  private _instance;
  private _defaultConfig = {
    baseURL:import.env.VUE_APP_BASE_URL || '/api',
    timeout: 1000*6
  }
  
  private pendingRequests
  
  constructor(config) {
    this._instance = axios.create(Object.assign(this._defaultConfig, config))
    
    this.pendingRequests = new Map()
    this.setupInterceptors()
  }
  
   //取消所有请求
	public cancelAllRequests() {
    this.pendingRequests.forEach(controller => controller.abort())
    this.pendingRequests.clear()
  }
}
```



### 4.本地开发切换代理

#### 需要代理的情况

* 开发环境中的跨域请求
* 生产环境中需要隐藏真实的api地址的情况
* 需要在请求时候添加特定头部或处理的场景



#### 切换代理场景

需要针对不同的API环境进行测试, 例如本地环境,测试环境,预发布环境等.

通常是搭配`.env.xxx` + proxy.target中的配置来出现本地/测试环境中的不同代理地址, 打包时采用测试+生产两个打包命令来打不同的包.

```ts
   .env.development    # 开发环境变量
   .env.staging        # 预发布环境变量
   .env.production     # 生产环境变量
```



```ts
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",              // 默认生产环境
       "build:staging": "vite build --mode staging",  // 预发布环境
       "build:prod": "vite build --mode production"   // 生产环境
     }
   }
```











### 5.自动推导返参response的类型

在 Axios + TypeScript 项目中自动推导返回数据类型有手动设置和自动推导两种形式, 完全自动化的类型推导在目前的TypeScript和API交互中还是存在困难.



#### 手动声明类型

> 前提是知道返参的类型



##### 1.axios[封装]+泛型接口

这里概述为2种形式:

* 类型接口+请求函数
* 类型接口+封装的axios实例
  * 使用拦截器
  * 使用axios的配置对象config



**类型接口+请求函数**

```ts
//类型接口+请求函数

import axios, { AxiosResponse } from 'axios';

// 定义数据类型接口
interface User {
  id: number;
  name: string;
  email: string;
}

// 定义响应数据结构接口
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 使用泛型请求函数
async function getUsers(): Promise<AxiosResponse<ApiResponse<User[]>>> {
  return axios.get<ApiResponse<User[]>>('/api/users');
}

// 使用时
getUsers().then(response => {
  const users: User[] = response.data.data; // 自动推导出User[]类型
});

```



**类型接口+封装的axios实例-拦截器**

这种方案就是第一种方案的复杂版本而已.

```ts
// 定义通用响应结构
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 创建带类型的 axios 实例
const api = axios.create();

// 响应拦截器
api.interceptors.response.use(response => {
  return response.data;
});

// 封装带类型的请求方法
function get<T>(url: string, config) {
  return api.get<AxiosResponse<ApiResponse<T>>>(url, {...config});
}





// 使用
interface User {
  id: number;
  name: string;
}

get<User>('/api/user/1').then(response => {
  // response 被推导为 ApiResponse<User> 类型
  const user = response.data; // user 被推导为 User 类型
});
```



**类型接口+封装的axios实例-config配置**

> 这种方案是有问题的, 在拦截器中定义返参类型会失效.

```ts
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

// 扩展AxiosRequestConfig
declare module 'axios' {
  interface AxiosRequestConfig {
    responseType?: 'json' | 'arraybuffer' | 'blob' | 'document' | 'text' | 'stream';
    meta?: {
      responseType?: any;
    };
  }
}

// 请求拦截器
axios.interceptors.request.use((config) => {
  if (config.meta?.responseType) {
    config.responseType = config.meta.responseType;
  }
  return config;
});

// 响应拦截器
axios.interceptors.response.use((response: AxiosResponse) => {
  if (response.config.meta?.responseType) {
    response.data = response.data as typeof response.config.meta.responseType;
  }
  return response;
});

// 使用
interface Comment {
  id: number;
  content: string;
}

async function getComments(postId: number) {
  const response = await axios.get(`/posts/${postId}/comments`, {
    meta: { responseType: [] as Comment[] }
  });
  return response.data; // 自动推导为Comment[]
}
```

这里有个重要的问题, 就是泛型为什么不能在拦截器函数中给response添加呢?

> - Axios 方法的泛型 `<T>` 是在**调用函数的特定位置**，由 TypeScript 在**编译时**直接将泛型参数 (`Comment[]`) 应用到函数签名定义的返回类型 (`Promise<AxiosResponse<T>>`) 上，从而确定了结果变量的静态类型。这是一种**静态的、局部的类型确定**。
> - 你尝试在拦截器中做的事情，是希望通过检查一个**运行时的配置值**，来**动态地影响**一个在**拦截器内部**进行的类型断言，并期望这个断言能够将**外部调用时传入的类型信息**重新关联起来。这超出了 TypeScript 静态类型系统在不进行大量额外映射工作的情况下能直接处理的能力范围。TypeScript 无法轻易地在编译时建立起“如果 `config.meta.responseType` 的运行时值是 `[]`，那么 `response.data` 的类型就是 `Comment[]`”这样的动态关联。
>
> 所以，即使泛型在运行时被擦除，它们在**编译时**的作用是告诉 TypeScript **在函数调用这个特定点**，数据的类型是什么。而拦截器中的方法试图根据一个**运行时的值**来决定**静态的类型**，这是类型系统不容易做到的。





#### 自动推断类型

> 待办





### 6.token无感刷新

#### 资源

> [基于 Axios 封装一个完美的双 token 无感刷新用户登录之后，会返回一个用户的标识，之后带上这个标识请求别的接 - 掘金](https://juejin.cn/post/7271139265442021391)
>
> https://mp.weixin.qq.com/s/7ZjF2ZtDShC9UiWOTjxm4Q
>
> https://mp.weixin.qq.com/s/LHDd3Tol0JIORdMfFpZKaA



#### 介绍

> 用户登录之后，会返回一个用户的标识，之后带上这个标识请求别的接口，就能识别出该用户。
>
> 标识登录状态的方案有两种： session 和 jwt。
>
> session 是通过 cookie 返回一个 id，关联服务端内存里保存的 session 对象，请求时服务端取出 cookie 里 id 对应的 session 对象，就可以拿到用户信息。
>
> 这两种方案一个服务端存储，通过 cookie 携带标识，一个在客户端存储，通过 header 携带标识。
>
> session 的方案默认不支持分布式，因为是保存在一台服务器的内存的，另一台服务器没有。
>
> 但是这样有个问题：token 是有过期时间的，比如 3 天，那过期后再访问就需要重新登录了。所以要加上续签机制，也就是延长 token 过期时间。主流的方案是通过双 token，一个 access_token、一个 refresh_token。





