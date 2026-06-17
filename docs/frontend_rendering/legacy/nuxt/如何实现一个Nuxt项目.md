

### 0.创建项目

#### 背景

```
node 20
```



#### 安装使用

##### 创建项目

```bash
npx nuxi@latest init nuxt3-app
```



##### 启动项目

```bash
npm run dev
```



##### 页面跳转

```js
<NuxtLink to="/detail">Detail Page</NuxtLink>
```



##### 打包

`.output` 目录即为打包结果。



##### 预览

打包结果想要被用户浏览，需要启动预览服务，执行`preview`命令即可：

```bash
npm run preview
```

> 可以输入终端提示的地址测试一下结果，例如我这里是：[http://localhost:3000。](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%E3%80%82)
>
> 注意：这里是带有端口号的，未来可以在服务器配置`nginx`反向代理到该服务，用户就可以更方便地访问我们的站点。



### 1.构建视图

> 基于文件的路由.
>
> 根据 pages 目录中的文件会自动创建 routes 配置。

#### 1.1 动态路由

文件名或文件夹名称里包含了方括号,它们将会被转换为动态路由参数.

```diff
pages/
  index.vue
	detail-[id].vue //访问路径 /detail-1.vue
```



```diff
	detail
  	[id].vue      //访问路径 /detail/1.vue
```



在组件中访问路由参数

```vue
// vue2
<tempalte>
  {{ $route.params.id }}
</tempalte>
```



#### 1.2 嵌套路由

如果存在目录和文件同名，就制造了嵌套路由。比如下面目录结构：

detail.vue是父组件, [id].vue是父组件中的嵌套路由

```diff
pages/
--- detail/
------[id].vue
--- detail.vue
--- index.vue
```



嵌套路由的渲染访问,使用`<NuxtPage></NuxtPage>`来展示,通过访问特定路由来显示内容.



#### 1.3 布局系统

Nuxt 提供了布局系统，可以把公用的页面布局内容提取到`layouts`目录中以便复用。

> 首先创建 /layouts/default.vue 作为默认布局页：

```xml
<template>
  <div>
    <nav>导航栏</nav>
    <slot />
  </div>
</template>

```

> `app.vue`中将页面内容作为布局页的插槽：

```xml
<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

```



### 2.静态资源使用及tailwind引入

#### 2.1 资源目录

Nuxt 项目存放样式、图片等静态资源的目录默认有两个：

* public：会被作为应用程序根目录提供给用户，打包工具不会处理，访问时添加`/`即可
* assets：打包工具会处理，访问时以`~`开头



除了`~`，Nuxt3 中还有一些默认别名：

```json
json复制代码{
  "~~": "/<rootDir>",
  "@@": "/<rootDir>",
  "~": "/<rootDir>",
  "@": "/<rootDir>",
  "assets": "/<rootDir>/assets",
  "public": "/<rootDir>/public"
}
```



#### 2.2 全局样式

有两种方式可以配全局样式：

- 配置文件 nuxt.config.ts；
- app.vue 中引入。



##### 1) app.vue中引入全局样式

```html
<script>
import "~/assets/global.css";
</script>
```



##### 2) 使用CSS预处理器SCSS

1. 安装, `npm i sass -D`
2. 新建`assets/global.scss, assets/_variables.scss`
3. 修改配置文件 nuxt.config.js
4. 任意组件均可使用变量.无需导入.

```scss
//global.scss
a {
  text-decoration: none;
  color: red;
}

//_variables.scss
$linkColor: #3370ff;
```



```json
// nuxt.config.js
export default defineNuxtConfig({
  css: ["assets/global.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/_variables.scss";', //使用变量
        },
      },
    },
  },
});

```



#### 2.3 引入tailwindcss

##### 步骤

1. 安装 `npm i -D @nuxtjs/tailwindcss`
2. 添加配置项 
3. 配置全局样式和变量
4. 解决vscode不识别tainwindcss自定义指令

```json
//配置项 nuxt.config.js
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})

```



```css
//添加全局样式和变量

// assets/css/tailwind.css
@import '_variables.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

a {
  text-decoration: none;
  color: orange;
}

//assets/css/_variables.css
:root {
  --link-color: #3370ff;   //组件中使用直接将颜色替换成var(--link-color)形式
}
```



### 3.自动导入特性及UI库整合

#### 自动导入

Nuxt3 中会处理以下依赖的自动导入。

- Nuxt 自动导入：数据访问 useFetch、状态管理 useState、App 上下文 useNuxtApp、运行时配置 useRuntimeConfig 等等。
- Vue自动导入：ref、reactive、computed 等等。
- 基于路径自动导入：
  - 组件目录：/components ；
  - hooks目录：/composables ；
  - 工具库目录：/utils 



#### 组件自动导入

Nuxt 中约定把组件放在`components/`目录中，这些组件只要被用在页面或其他组件中，就会自动导入并注册。

创建 components/Navbar.vue：

```html
html复制代码<template>
  <nav
    class="border-b border-slate-200 px-5 py-2 flex items-center justify-between"
  >
    <h1 class="text-2xl font-bold">Nuxt3 in Action</h1>
    <img
      class="w-[50px] border-[1px] border-slate-300 rounded-full inline-block"
      src="~/assets/avatar.png"
      alt="avatar"
    />
  </nav>
</template>
```

下面就可以直接使用了，layouts/default.vue:

```html
html复制代码<template>
  <div>
    <Navbar></Navbar>
    <slot />
  </div>
</template>
```



#### 组件名称约定

没有嵌套的组件会以文件名直接导入;存在嵌套关系的组件,其**组件名称将会基于路径和文件名以大驼峰方式连起来**

比如下面的`base/foo/Button.vue`注册名称将会是`BaseFooButton`

```diff
| components/
--| base/
----| foo/
------| Button.vue

```



#### 整合组件库

组件库方案：Nuxt UI

> 由于该UI库内置了[@nuxtjs/tailwindcss](https://link.juejin.cn/?target=https%3A%2F%2Ftailwindcss.nuxtjs.org%2F) 和 [@nuxtjs/color-mode](https://link.juejin.cn/?target=https%3A%2F%2Fcolor-mode.nuxtjs.org%2F)，因此要移除nuxt.config.ts和package.json中的相关模块和依赖



可以访问：[Nuxt Modules](https://link.juejin.cn/?target=https%3A%2F%2Fnuxt.com%2Fmodules%3Fq%3Dui) 查看支持的组件库.



##### 遇到的问题

按照前面的指示,将已安装的tailwindcss移除后,安装了`nuxt/ui`模块, 但是出现了一个问题. 就是`/assets/css/tailwind.css`中原先导入的tailwind样式注释以后, 以前在vue模板中引入的类名失效.

```css
/* @tailwind base;
@tailwind components;
@tailwind utilities; */
```





#### 自定义扫描目录

- Nuxt3 默认只扫描根目录中模块。
- 可以通过设置 nuxt.config.ts 中 `imports` 选项自定义扫描目录：

```json
export default defineNuxtConfig({
  imports: {
    dirs: [
      // 扫描顶层目录中模块
      'composables',
      // 扫描内嵌一层深度的模块，指定特定文件名和后缀名
      'composables/*/index.{ts,js,mjs,mts}',
      // 扫描给定目录中所有模块
      'composables/**'
    ]
  }
})
```



### 4.基于API路由开发接口

使用 Nuxt3 提供的 API Route 自己编写接口，主要包括以下知识点：

- 创建服务端 API；
- 处理请求参数；
- 返回响应数据。





#### 创建服务端API

> Nuxt 项目下`~/server/api`目录下的文件会被注册为服务端 API，并约定在这些文件中导出一个默认函数`defineEventHandler(handler)`，handler 中可以直接返回 JSON 数据或 Promise，当然也可以使用 `event.node.res.end()` 发送响应，虽然没有这个必要。

> [server/ · Nuxt Directory Structure](https://nuxt.com/docs/guide/directory-structure/server)
>
> 上面的地址是nuxt文档中server一篇,速读

##### 案例1-简单请求:

创建server/api/hello.ts 测试一下：这里我们返回给用户一个 json 数据。并在hello.vue中使用`$fetch('/api/hello')`请求

```js
export default defineEventHandler((event) => {
  return {
    message: 'hello，nuxt3！'
  }
})


// hello.vue
<template>
  <div>
    {{ message }}
  </div>
</template>

<script setup lang="ts">
const { message } = await $fetch('/api/hello')
</script>

```





##### 案例2-获取博客列表

- 创建一个 /api/posts 接口，获取指定目录~/content下所有 markdown 文章
- 创建 server/api/posts.ts，获取 content 中文件列表并返回。
- 接下来在首页请求文章列表数据，index.vue：



```js
import fs from "fs";
import path from "path";
import matter from 'gray-matter';

// 文章目录
const postsDir = path.join(process.cwd(), "content");

export default defineEventHandler((event) => {
  const fileNames = fs.readdirSync(postsDir);
  const posts = fileNames.map((fileName) => {
    // 获取文件名作为文章标题
    const id = fileName.replace(/.md$/, "");

    // 获取文章标题和创建日期
    const fullPath = path.join(postsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterInfo = matter(fileContents);
    const fileInfo = fs.statSync(fullPath);

    return {
      id,
      title: matterInfo.data.title as string,
      date: fileInfo.ctime,
    };
  });
  // 降序排列
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
});

```





#### 处理请求参数

常用的请求参数形式有三种：

- 路由参数，例如：/api/hello/[name].ts；
- 请求体，例如：post 请求中的 data；
- 查询参数，例如：/api/hello?name=cunzhang。



##### 获取路由参数

假如创建 API 接口文件 server/api/detail/[id].ts，可以通过 `getRouterParam(event, 'id')` 获取参数 id：

```ts

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {remark} from 'remark'
import html from 'remark-html'

//文章目录
const postsDir = path.join(process.cwd()), 'content')

export default defineEventHandler(async(event) => {
  const fileName = getRouterParam(event, 'id') + '.md'
  
  
  //获取文章内容
  const fullPath = path.join(postDir, fileName)
  const fileContent = fs.readFileSync(fullPath, 'utf-8')
  
  //解析页面信息
  const matterInfo = matter(fileContent)
  
  //转换markdown为HTML
  const processdContent = await remark().use(html).process(matterInfo.content)
  const content = processdContent.toString() as string
  
  return {
    title: matterInfo.data.title as string,
    content
  }
})




```



detail.vue内容

```vue
<template>
  <div class="p-5">
    <h1 class="text-2xl">{{ title }}</h1>
    <div v-html="content"></div>
  </div>
</template>

<script setup lang="ts">
const router = useRoute();
const { title, content } = await $fetch(`/api/detail/${router.params.id}`);
</script>

```



##### 获取请求体

用户发送 post 类型的请求提交数据的时候，请求数据通常通过 request body，类似这样：

```js
$fetch('/api/create-post', { method: 'post', body: { id: 'new id' } })
```

在 Nuxt 中，服务端可以通过`readBody(event)`获取 request body 数据：

```js
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    return { body }
})

```



##### 获取查询参数

用户发送类似 `/api/query?param1=a&param2=b `这样的包含查询参数的请求时，可以通过`getQuery(event)`获取参数：

```js
export default defineEventHandler((event) => {
  const query = getQuery(event)
  return { a: query.param1, b: query.param2 }
})

```



##### 更多工具方法

Nitro 的底层实现基于 [h3](https://link.juejin.cn/?target=http%3A%2F%2Fgithub.com%2Funjs%2Fh3)，除了前面介绍的 getRouterParam()、readBody()、getQuery() 等还有不少非常有用[工具方法](https://link.juejin.cn/?target=https%3A%2F%2Fwww.jsdocs.io%2Fpackage%2Fh3%23package-index-functions)，例如：getCookie()、 getMethod()、getHeader() 等，大家可以先看文档探索一下，后续范例和项目中都会陆续用到。



### 5种获取数据API及应用最佳实践

#### $fetch

```ts

const { data } = await $fetch('/api/hello', { query: { name: 'tom' } })
const { result } = await $fetch('/api/post', { method: 'post', body: newPost })

```



前面说过，如果开发团队有服务端，并且接口已经开发完毕，则我们可以直接调用这些接口。但是由于我们是服务端渲染，不得不考虑接口的调用时机问题：

- 首屏渲染，调用发生在服务端；
- 客户端激活之后，调用发生在客户端。

这导致我们首先需要判断代码执行环境，其次发送请求的 API 可能不同，另外如果在客户端发送请求到其他接口服务器还会存在跨域问题，需要给项目配代理，很复杂是吧！**这就是 Nuxt3 为什么替我们封装了** **`$fetch`** **，它全局可用，可以智能处理调用时机，还能统一 API，避免配置代理**。





#### Nuxt数据访问API

Nuxt3 也为我们提供了四个接口，通过封装 $fetch，给用户提供响应式数据便于直接使用。



##### useFetch

> 页面、组件或者插件中可以使用`useFetch`获取任意 URL 资源。`useFetch`是对`useAsyncData`和`$fetch`的封装，只需传入请求的 URL 或者一个请求函数即可，一些选项会自动填入，用起来最简洁，是最推荐的数据获取方式。



`useFetch`方法签名：

```ts

function useFetch(
  url: string | Request | Ref<string | Request> | () => string | Request,
  options?: UseFetchOptions<DataT>
): Promise<AsyncData<DataT>>

type AsyncData<DataT> = {
  data: Ref<DataT> // 返回数据
  pending: Ref<boolean> // 加载状态
  refresh: (opts?: { dedupe?: boolean }) => Promise<void> // 刷新数据
  execute: () => Promise<void> // 同 refresh，没有去重选项
  error: Ref<Error | boolean> // 错误信息
}
```



将前面的博客列表获取操作重构为`useFetch()`方式

为了观察效果，我们修改posts接口，posts.ts

```vue
export default defineEventHandler((event) => {
  // ...
  // 这样前端要等1s才能拿到结果，便于观察加载状态
  return new Promise<
    {
      id: string;
      title: string;
      date: Date;
    }[]
  >((resolve) => {
    setTimeout(() => {
      posts.sort((a, b) => (a.date < b.date ? 1 : -1));
      resolve(posts);
    }, 1000);
  });
});

```

注意，此时刷新页面，我们并不能看到loading状态，而是看到路由被阻塞转圈圈，1秒钟之后直接看到页面内容:

这是因为 useFetch 默认会阻塞路由，要想看到loading状态，我们得设置一个`lazy`选项：

> 注意我们刷新首页无论如何都看不到loading状态，首屏渲染的时候我估计nuxt为了让用户可以看到内容而不是白屏，会选择等到pending状态结束再返回结果，所以它依然会卡1秒。

```js
const { data: posts, pending, error } = await useFetch('/api/posts', {
  lazy: true
})

```



##### useLazyFetch

该方法等效于`useFetch`设置了`lazy`选项为 true，不同之处在于它**不会阻塞路由导航**，这意味着我们需要处理 data 为 null 的情况（或者通过 default 选项给 data 设置一个默认值）。



##### useAsyncData

该方法和 `useFetch` 相比功能上是相同的，但是更底层，使用方法类似于 ahooks 库中的 `useRequest`，我们需要提供一个用于缓存去重的 key 和数据请求的处理函数。也就是说，`useFetch` 相当于：`useAsyncData(key, () => $fetch(url))`，useAsyncData签名如下：

```ts
function useAsyncData(
  handler: (nuxtApp?: NuxtApp) => Promise<DataT>,
  options?: AsyncDataOptions<DataT>
): AsyncData<DataT>


function useAsyncData(
  key: string,
  handler: (nuxtApp?: NuxtApp) => Promise<DataT>,
  options?: AsyncDataOptions<DataT>
): Promise<AsyncData<DataT>>


```

因此 useAsyncData 有两种用法：一种传 key，一种不传 key，但是即使你不传，Nuxt 也会帮你生成一个。 我们实践一下，用 `useAsyncData` 获取文章内容数据，detail/[id].vue：

```vue
<template>
  <div class="p-5">
    <div v-if="pending">加载中...</div>
    <div v-else>
      <h1 class="text-2xl">{{ data?.title }}</h1>
      <div v-html="data?.content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRoute();
const fetchPost = () => $fetch(`/api/detail/${router.params.id}`);
const { data, pending } = await useAsyncData(fetchPost);
</script>

```



##### useLazyAsyncData

该方法等效于`useAsyncData`，仅仅设置了`lazy`选项为true，也就是它不会阻塞路由导航，这意味着我们需要处理 data 为 null 的情况，或者通过 default 选项给 data 设置一个默认值。





#### 刷新数据

有时候页面数据是需要刷新的，比如：翻页、条件过滤、搜索等。

我们可以使用`useFetch()`等 API 返回的`refresh()`刷新数据。需要注意，如果请求的 key 参数没有发生变化，我们实际上拿到的还是之前缓存的结果。例如下面代码执行 `refresh()` 并不会得到最新数据：

```ts

const { data, refresh } = useFetch('/api/somedata')
// 数据并没有刷新！
refresh()

```

而想要获取最新数据，就要在 url 中添加一个参数，并作为函数返回值传给`useFetch`：

```ts
// url需要改为由函数返回
const { data, refresh } = useFetch(() => `/api/somedata?page=${page}`)
// 数据刷新！
page++
refresh()

```



范例: 分页获取文章列表

下面的范例在请求参数上添加一个页码，则页码变化后再刷新就可以得到最新的数据了，index.vue：

```html
```



### 内置状态管理useState及Pinia整合

本来这是一个比较简单的事情，但是只要涉及服务端渲染，问题就会复杂化，状态的初始化在服务端进行，想要带着状态信息到客户端，就要提前序列化存储，到了客户端激活时，又要确保在被调用前恢复。这些操作如果没有框架支持会相当复杂。还好 Nuxt 替我们处理了这些，隐藏了很多处理细节，我们不需要关心序列化或 XSS 攻击，只是使用就好了。本节涉及内容如下：

- Nuxt 内置的状态管理模块 `useState()`；
- 整合全局状态管理库：Pinia。



#### Nuxt3内置的状态管理

Nuxt3 提供了 `useState()`，用于创建响应式的且服务端友好的跨组件状态。

> useState() 对于 React 用户来说在熟悉不过了，两者确实有类似之处，但是除了给组件声明状态之外，Nuxt3 中的 useState() 还能用于创建全局状态。



##### useState基本用法

如何声明?

```ts
// 函数重载
useState<T>(init?: () => T | Ref<T>): Ref<T>
useState<T>(key: string, init?: () => T | Ref<T>): Ref<T>
```



基本使用

> 在组件中用 useState() 声明一个状态，counter.vue。

```vue
<template>
  <div class="p-4">
    Counter: {{ counter }}
    <div class="mt-2">
      <UButton @click="counter++">+</UButton>
      <UButton @click="counter--">-</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const counter = useState("counter", () => Math.round(Math.random() * 1000));
</script>

```



##### useState()和ref()的比较

* useState(key, init) 是有**缓存性**的，如果 key 不变，init 只做初始化，则多次调用同一个 useState，结果是一样的；
* 服务端友好性，得益于缓存性，即便 init 返回值是不稳定的，也能保证前端注水时前后端状态的一致性，比如初始值是随机值的情况。

```vue
<template>
  <div class="p-4">
    Counter: {{ counter }} CounterRef: {{ counterRef }}
    <div class="mt-2">
      <UButton @click="counter++; counterRef++;">+</UButton>
      <UButton @click="counter--; counterRef--;">-</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const counterRef = ref(Math.round(Math.random() * 1000));
const counter = useState("counter", () => Math.round(Math.random() * 1000));
</script>

```



> 但是控制台出现了警告信息：
>
> **注水时**发现 CounterRef 不匹配，这是因为初始值不确定的情况下，ref() 无法保证服务端和客户端的状态一致性。但是 useState() 可以保证一致性，这是其服务端友好性的一个表现。

```js
//控制台警告:
runtime-core.esm-bundler.js:51 

[Vue warn]: Hydration text mismatch in 
 
  - rendered on server: " Counter: 608 counterRef: 938 "
  - expected on client: " Counter: 608 counterRef: 998 " 
  at <Counter onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< undefined > > 
  at <Anonymous key="/counter" vnode= 
{__v_isVNode: true, __v_skip: true, type: {…}, props: {…}, key: null, …}
 route= 
{fullPath: '/counter', hash: '', query: {…}, name: 'counter', path: '/counter', …}
  ... > 
  at <RouterView name=undefined route=undefined > 
  at <NuxtPage> 
  at <Default ref=Ref< undefined > > 
  at <LayoutLoader key="default" layoutProps= 
{ref: RefImpl}
 name="default" > 
  at <NuxtLayoutProvider layoutProps= 
{ref: RefImpl}
 key="default" name="default"  ... > 
  at <NuxtLayout> 
  at <App key=4 > 
  at <NuxtRoot>
    
    
    
    
runtime-core.esm-bundler.js:1590 Hydration completed but contains mismatches.
```





##### 共享状态

> 可以使用 useState() 创建可在组件之间共享的全局状态。

可以在 composables 目录中创建一个 composable，并在里面导出一个函数，该函数由`useState()`返回全局状态，例如，composables/counter.ts. 

```ts
// composables/counter.ts

export const useCounter = () => useState('count', () => 1)
```

在所有组件内都可以获取该状态。

创建components/Counter.vue

```ts
<template>
  <div class="p-4">
    Count: {{ count }} Count2: {{ count2 }}
    <div class="mt-2">
      <UButton
        @click="
          count++;
          count2++;
        "
        >+</UButton
      >
      <UButton
        @click="
          count--;
          count2--;
        "
        >-</UButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
// 全局状态
const count = useCounter();
// 局部状态
const count2 = ref(1);
</script>


```

在page/counter.vue中引入Counter

```ts
<template>
  <div class="p-4">
    <!--之前的内容-->
    <Counter></Counter>
    <Counter></Counter>
  </div>
</template>

<script setup lang="ts">
// 局部状态
const counterRef = ref(Math.round(Math.random() * 1000));
const counter = useState("counter", () => Math.round(Math.random() * 1000));
// 全局状态
const count = useCounter();
</script>

```



**范例**

我们给范例博客增加一个留言功能：要求留言者已登录，否则跳转登录页。

首先创建这个全局登录状态，创建 composables/user.ts：

```ts
export const useLogin = () => useState(() => false)
```

给详情页添加一个留言框，并在提交留言时判断登录态，[id].vue：

```ts

<template>
  <div class="p-5">
    <div v-if="pending">加载中...</div>
    <div v-else>
      <h1 class="text-2xl">{{ data?.title }}</h1>
      <div v-html="data?.content"></div>
      <!-- 评论区 -->
      <div class="py-2">
        <UTextarea
          v-model="value"
          placeholder="输入评论"
        />
        <UButton @click="onSubmit">发送</UButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const router = useRouter();
const route = useRoute()
const fetchPost = () => $fetch(`/api/detail/${route.params.id}`);
const { data, pending } = await useAsyncData(fetchPost);

// 增加评论相关逻辑，注意登录状态的获取和使用
const value = useState("comment", () => "");
const isLogin = useLogin()
const toast = useToast()
const onSubmit = () => {
  if (isLogin.value) {
    // 提示用户
    toast.add({ title: '已提交评论!' })
    // 提交留言...
    value.value = ''
  } else {
    // 要求登录
    router.push('/login?callback=' + route.path)
  }
}
</script>

```



#### Pinia

更好全局状态管理方案的选择，那就是 Pinia。

##### 使用步骤

安装依赖

```bash
npm i pinia @pinia/nuxt --legacy-peer-deps
```

需要添加'--legacy-peer-deps'的原因: [npm error when installing pinia · Issue #853 · vuejs/pinia (github.com)](https://github.com/vuejs/pinia/issues/853)



> 20241102新项目中, 不用添加`--legacy-peeor-deps`,可成功安装



添加配置文件

```ts
export default defineNuxtConfig({
  modules: [
    // 引入 Pinia
    [
      "@pinia/nuxt",
      {
        autoImports: [
          // 自动引入 `defineStore(), storeToRefs()`
          "defineStore",
          "storeToRefs"
        ],
      },
    ]
  ],
  pinia: {
    storesDirs: ['./store/**'],
  },
});

```



##### 基本使用

声明

* 选项式使用
* 组合式使用
* Vuex式使用

组件中获取

> 因为我们配置过自动导入,所以可以直接读取定义的store中的数据

```vue
<script setup>
  const counter = useXXXX()
  
</script>
```













### Nuxt应用异常处理   //?

#### 错误分类

* Vue 渲染过程中的错误（包括客户端和服务端）；
* 服务端 Nitro 引擎内部运行时错误（特指/server目录下）；
* 服务器和客户端启动错误（包括客户端和服务端）；
* 下载JS代码块报错



#### Vue渲染过程中的错误

> 视图层是通过 Vue 实现的，因此不管是 SSR，还是 SPA 在渲染过程中的错误，都可以在 Vue 层面处理，当然也可以等错误传播到顶层时通过 Nuxt 提供的生命周期钩子处理。

##### 利用Vue选项处理错误

> Vue 实例提供的全局配置选项, onErrorCaptured

```ts
app.config.errorHandler = (error, context) {}
```



通过 Nuxt 提供的插件机制获取获得 Vue 实例

```ts
// ~/plugins/error.ts`

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, context) => {
    console.log('vue error handler')
  }
})


```



如何测试:

新建一个`error.vue`页面, 在页面中访问一个不存在的变量. 错误会输出到服务端控制台,因为首屏渲染发生在服务端:

```ts
Vite server hmr 8 files in 15.92ms
vue error handler
```







##### 利用Nuxt钩子处理错误

针对上面的错误, 还可以利用 Nuxt 层级的钩子捕获来自 Vue 传播上来的错误：

```ts

export default defineNuxtPlugin((nuxtApp) => {
  // 省略前面的代码
  nuxtApp.hook('vue:error', (..._args) => {
    console.log('vue:error')
  })
})

```



服务端控制台的错误输出:

```ts
Vite server hmr 8 files in 827.363ms
vue:error
```





#### 服务端错误处理 

> 如果错误发生在服务端，比如 API 中发生运行时错误，此时服务端会有一个 JSON 响应（请求头携带`Accept: application/json`）或者 HTML 错误页面



##### 抛出异常

> 在服务端自定义错误信息。可以使用 `createError` 方法抛出异常，然后在客户端处理.
>

就像下面这样，server\api\test-error.ts：

```ts
export default defineEventHandler(event => {
  //参数类型有错误就抛出异常
  const id = parseInt(event.context.params.id) as number
  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      message: 'ID应该是一个数字'
    })
  }
  
  return 'ok'
})
```

访问 [localhost:3000/api/test-error](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Ftest-error) 触发这个错误,效果如下:

```json
{
 	'url': '/api/test-error',
  statusCode: 400,
  'statusMessage': '',
  'message': 'ID应该是一个数字',
  'stack': '....'
}
```

但是实践中发现返回的信息和Vue渲染的错误是一样的,都是在页面上直接渲染的.



**范例**文章详情接口错误处理

> 我们修改文章详情接口，如果用户传递的 id 没有对应的文章，则抛出异常，`server/detail/[id].ts`:

```ts
```







#### 自定义错误页面

> 有另一种交互处理是显示一个全屏错误页面给用户以提供更好的体验，Nuxt 对错误信息页面有默认处理，如果需要自定义，可以**在项目根目录创建一个 error.vue**，该页面会接收一个包含错误信息的 error 属性。

##### 范例: 自定义错误页面

创建`~/error.vue`

```vue
<template>
  <div class="pt-10">
    <h1 class="text-2xl text-center mb-2">
      出了点错 - {{ error?.statusCode }}
    </h1>
    <p class="text-center p-4">{{ error?.message }}</p>
    <div class="text-center">
      <UButton @click="retry" class="mr-2">重试</UButton>
      <UButton @click="handleError">回到首页</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object,
});
console.log(props.error);
const router = useRouter();
const retry = () => window.location.href = props.error!.url;
const handleError = () => clearError({ redirect: "/" });
</script>


```



##### 显示错误页面

> Nuxt 提供了 `showError` 方法用于显示全屏错误页，我们可以在客户端或直接在中间件、插件、setup函数中使用它。 只需要传递给它一个字符串或者错误对象即可，就像下面这样：

```ts
showError("文件不存在")
showError({
  statusCode: 404,
  statusMessage: "文件不存在"
})


```





#### 组件级错误处理

> **专门用于处理客户端错误**。

##### NuxtErrorBoundary

> 可以把` <NuxtErrorBoundary>` 作为容器组件将内容包起来，其默认插槽中发生的错误会被捕获，避免向上冒泡，并且渲染 error 插槽。我们可以像下面这样使用 ：

```vue
<template>
  <NuxtErrorBoundary @error="errorLogger">
    <!-- 默认插槽放置要渲染的内容 -->
    <!-- ... -->
    <!-- error 插槽处理错误，接收 error 为错误信息 -->
    <template #error="{ error }">
      这里显示错误信息
      <button @click="error = null">
        设置 error = null 清除错误，显示内容
      </button>
    </template>
  </NuxtErrorBoundary>
</template>

```



##### 范例,在组件中处理错误

创建页面 pages/error-handle.vue:

```vue
<template>
  <NuxtErrorBoundary>
    <!-- 默认插槽显示正常内容 -->
    <!-- 触发一个错误 -->
    <ThrowError></ThrowError>
    <!-- error插槽显示错误时内容 -->
    <template #error="{ error }">
      <p class="my-4 text-xl text-gray-500">发生了一些错误 {{ error }}</p>
      <NButton type="success" @click="error.value = null"> 修正错误 </NButton>
    </template>
  </NuxtErrorBoundary>
</template>

```



创建ThrowError抛出错误, components/ThrowError.vue

```vue
```





### 项目开发常用配置及SEO配置

#### 几种常用配置方式对比:

Nuxt 应用中有三种常见的配置方式：

- nuxt.config.ts：覆盖或扩展默认 Nuxt 配置；
- app.config.ts：配置公共变量；
- 外部配置文件：配置项目中其他方面。



##### Nuxt.config.ts

> 需要覆盖或扩展默认 Nuxt 配置时，我们就可以在项目根目录下创建一个 nuxt.config.ts, 它默认导出 defineNuxtConfig() 的执行结果，再和默认 nuxt 配置合并并最终生效

```ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    [
      "@pinia/nuxt",
      {
        autoImports: [
          "defineStore",
          "storeToRefs"
        ],
      },
    ]
  ]
});

```





##### app.config.ts

> [app.config.ts · Nuxt Directory Structure](https://nuxt.com/docs/guide/directory-structure/app-config)



> 配置一些项目需要的公共变量，可以在项目根目录创建 `app.config.ts`，这些变量是响应式的，不仅在运行时可以访问，还可以改变。
>
> nuxt.config.ts 中有个 appConfig 选项可以起到相同的作用。

```ts

export default defineAppConfig({
  title: 'Hello Nuxt',
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000'
    }
  }
})

```



```vue
//访问app.config.ts中的变量

const appConfig = useAppConfig()
```

需要额外开启 tailwind 黑暗模式，创建 `tailwind.config.js`：

```js
module.exports = {
  darkMode: 'class',
}
```





##### 外部配置文件

Nuxt 只认 `nuxt.config.ts`，因此一些大家熟悉的独立配置文件会被忽略，作为替代，nuxt.config.ts 中会有对应的配置项，我们来看一下都有哪些：

- ~~nitro.config.ts~~：不能使用，使用 nitro 选项配置；
- ~~postcss.config.js~~：不能使用，使用 postcss 选项配置；
- ~~vite.config.ts~~：不能使用，使用 vite 选项配置；
- ~~webpack.config.ts~~：不能使用，使用 webpack 选项配置。

当然，还有一些配置文件依然可以使用：

- tsconfig.json；
- .eslintrc.js；
- .prettieerrc.json；
- .stylelintrc.json；
- tailwind.config.js；
- vitest.config.js。



#### 开发常用配置

##### 配置打包工具

Nuxt 支持 Vite、Webpack 两种打包工具，默认使用 Vite。我们可以根据项目需要选择，设置 builder 即可。

下面配置设置打包工具为 Webpack:

注意：需要安装 @nuxt/webpack-builder。

```ts
export default defineNuxtConfig({
  builder: "webpack"
});

```

如果要修改对应打包工具配置，可以使用 Vite 或 Webpack 选项：

```ts
export default defineNuxtConfig({
  vite: {},
  webpack: {}
});

```

##### 配置渲染模式

Nuxt 默认渲染模式是 SSR 模式。

可以通过设置 `ssr: false` 修改渲染模式为 SPA

```ts
export default defineNuxtConfig({
  ssr: false,
})

```

可以通过设置 `nitro.presets` 选项修改渲染模式为非 node 模式

```ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel'
  },
})

```



##### 端口号

配置了端口号为 8080，避免和其他本地服务端口冲突，package.json:

```json
{
  "scripts": {
    "dev": "nuxt dev --port=8080"
  }
}
```



##### 环境变量

Nuxt 配置中有一个运行时配置 `runtimeConfig` 可用于对外暴露值，就像环境变量、秘钥等。默认情况下这些 key 只能用于服务端，除非把 key 存储在 `runtimeConfig.public` 字段中。跟 `appConfig` 比起来，它们只能在 nuxt.config 中定义，值可以被环境变量覆盖，且不能在运行时修改。

添加 `runtimeConfig`，nuxt.config.ts：

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 只能用于服务端的 keys
    apiSecret: '123',
    // 可用于客户端的 keys
    public: {
      apiBase: '/api'
    }
  }
})

```



结合 `.env` 可以配置环境变量并覆盖 runtimeConfig 中的对应项，创建 .env 文件:

```ts
NUXT_API_SECRET=api_secret_token
NUXT_PUBLIC_API_BASE=https://nuxt3.cn
```



##### 自动导入

该选项主要设置自动导入，例如前面的 store 目录就可以通过配置该选项，避免用户每次使用时手动导入。nuxt.config.ts：

```ts
export default defineNuxtConfig({
  imports: {
    dirs: ['store']
  },
}

```



#### 配置meta信息

Nuxt 提供三种修改 Meta 信息的方法：

- 全局配置页头信息；
- composables 方法；
- 内置组件修改。

##### 全局配置页头信息

通过`app.head`全局配置网站页头信息:

```ts
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8', // 快捷方式
      viewport: 'width=device-width, initial-scale=1', // 快捷方式
      title: 'My App',
      meta: [
        { name: 'description', content: 'My amazing site.' },
        { name: 'charset', content: 'utf-8' },
      ],
      "link": [],
      "style": [],
      "script": []
    }
  }
})

```



##### composables方法

Nuxt 提供了一个 useHead() 可以在组件内修改 meta 信息：

可以用来设置各个子页面的标题

```js
<script setup lang="ts">
useHead({
  title: 'My App',
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [ { children: 'console.log('Hello world')' } ]
})
</script>
```

但是会覆盖之前设置的网站名称,可以使用模板标题来解决.

在某个页面中添加如下内容:

```html
<script setup lang="ts">
useHead({
  titleTemplate: (s) => {
    return s ? `${s} - 村长的技术空间` : "村长的技术空间";
  },
});
</script>


```



##### 内置组件修改

Nuxt 还提供了多种组件可以在模板中设置具体页面页头信息：`<Title>`, `<Base>`, `<NoScript>`, `<Style>`, `<Meta>`, `<Link>`, `<Body>`, `<Html>` , `<Head>`，像下面这样使用：

```html
<script setup>
const title = ref('Hello World')
</script>

<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="title" />
    </Head>
  </div>
</template>

```



### Nuxt生命周期钩子的作用和应用

#### 生命周期钩子

> 由于 Nuxt 整合了 Vue、Nitro 前后端两个运行时，再加上它自身的创建过程，因此框架生命周期钩子分为三类：
>
> - Nuxt 钩子；
> - Vue App 钩子；
> - Nitro App 钩子。



#### Nuxt钩子

> Nuxt 钩子在构建时执行，**贯穿初始化和构建过程**中各种工具和引擎，例如 Nuxi、Vite、Webpack、Nitro 等，主要用于编写模块时构建上下文。
>
> 例如下面这段代码定义了一个Nuxt模块，在Nuxt就绪之后可以对Nuxt实例执行扩展操作：

```ts
```



#### Vue app钩子

会在运行时调用，主要用于编写插件，从而可以在渲染生命周期中插入代码逻辑。

基本用法如下：

```js
export default defineNuxtPlugin(nuxtApp => {
  nextApp.hook('app:created', vueApp => {
    //可以在这里修改vue实例
  })
})
```

范例: 给 Vue 添加一个全局的方法 $toast，可以用于显示一个通知。这个需求可以用一个插件来完成：这里利用了 app:created 这个钩子配置 Vue 实例：

```ts
// plugins/toast.ts
// 给组件声明一个自定义属性
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: (title: string) => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", (vueApp) => {
    vueApp.config.globalProperties.$toast = (title: string) => {
      const toast = useToast();
      toast.add({ title })
    };
  });
});

```

试用一下，detail/[id].vue：

```ts
// const toast = useToast()
const onSubmit = () => {
  if (isLogin.value) {
    // 用$toast提示用户
    // toast.add({ title: '已提交评论!' })
    getCurrentInstance()?.proxy?.$toast('已提交评论!')
    value.value = ''
  } else {
    router.push('/login?callback=' + route.path)
  }
}

```



#### Nitro app钩子

会在 Nitro 引擎运行时调用，用于编写服务端插件，从而可以修改或扩展引擎的默认行为。

例如下面插件利用 render:html 钩子修改了最终渲染的 html 内容，并在响应时打了一条日志：

```ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    console.log('render:html', html)
    html.bodyAppend.push('<hr>Appended by custom plugin')
  })
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    console.log('render:response', response)
  })
})

```





### 安装Docker本地版本

#### 1.安装([官网下载](https://www.docker.com/))

#### 2.启动docker

#### 3.通过docker-compose安装Mysql和Adminer

##### 1.


### MySQL数据库设计和开发基础

#### 用户管理

> 从安全角度讲，我们将来需要在应用中使用非 root 用户，则需要添加新的 MySQL 用户，并且不同用户可以赋予不同的用户权限。这个操作实际上是往 `mysql` 数据库中的 `user` 表添加新数据：



##### 增加新用户

以下为添加用户的实例，新增一个普通用户，只能查看、新增和更新数据：

- 用户名：57code；
- 密码为：666666；
- 操作权限：SELECT、INSERT、UPDATE。







#### 数据库增删

##### 数据类型

在mysql中主要由3大类数据类型：`string, numeric, date and time`

* 字符串: 指的是 CHAR、VARCHAR、BINARY、VARBINARY、BLOB、TEXT、ENUM和SET，具体范围如下：
* 数值: ：包括严格数值数据类型(INTEGER、SMALLINT、DECIMAL 和 NUMERIC)，以及近似数值数据类型(FLOAT、REAL 和 DOUBLE PRECISION)。
* 日期和时间: 表示时间值的日期和时间类型为DATETIME、DATE、TIMESTAMP、TIME和YEAR



##### 数据表增删

尝试设计一张表`course`,希望像下面这样展示课程:

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd2c989582294d3aabaa5de59926aad7~tplv-k3u1fbpfcp-jj-mark:2041:0:0:0:q75.awebp)



则我们需要如下字段:

* 封面: cover
* 价格: price
* 原价: t-price
* 标题: title
* 描述信息: desc



#### 数据表设计



#### 数据CRUD





### 基于Apifox的接口设计实践



#### 接口设计流程

1. 前端（或后端）在 Apifox 上定好`接口文档`初稿。
2. 前后端一起评审、完善`接口文档`，定好`接口用例`。
3. 前端使用系统根据接口文档自动生成的 `Mock 数据`进入开发，无需手写 mock 规则。
4. 后端使用`接口用例` 调试开发中接口，只要所有接口用例调试通过，接口就开发完成了。如开发过中接口有变化，调试的时候就自动更新了文档，零成本保障了接口维护的及时性。
5. 后端每次调试完一个功能就保存为一个`接口用例`。
6. 测试人员直接使用`接口用例`测试接口。
7. 所有接口开发完成后，测试人员（也可以是后端）使用`集合测试`功能进行多接口集成测试，完整测试整个接口调用流程。
8. 前后端都开发完，前端从`Mock 数据`切换到`正式数据`，联调通常都会非常顺利，因为前后端双方都完全遵守了接口定义的规范。



#### Apifox使用

##### 1.创建项目

##### 2.接口设计

##### 3.创建接口

##### 4.创建数据模型

##### 5.接口用例和调试

##### 6.接口mock



### Prisma基本使用

#### 是什么

> **Prisma 是一个使用 TypeScript 和 Node.js 开发的 ORM (对象关系映射) 库**，用于简化对数据库的访问和操作



#### 概述

Prisma Schema是Prisma ORM的主要配置,由3部分组成:

* Data Source: 规定Prisma ORM应该连接的数据源的细节信息
* Generator: 基于数据模型,规定客户端生成
* Data model definition: 指定应用模型及之间的关系

##### Data source

> https://www.prisma.io/docs/orm/prisma-schema/overview/data-sources

`data source`决定Prisma ORM如何连接你的数据库, 由Prisma schema中的`datasource`块标识. 一个Prisma schema只能由一个data source.



```prisma
datasource db {
	provider = 'postgresql'
	url 		 = 'postgresql://johndoe:mypassword@localhost:5432/mydb?schema=public'
}
```



##### generator

> [Generators (Reference) | Prisma Documentation](https://www.prisma.io/docs/orm/prisma-schema/overview/generators)

一个Prisma shcema可以有1个或多个generators, 使用`generator`块表示:

```prisma
generator client {
	provider = 'prisma-client-js'
	output   = './generated/prisma-client-js'
}
```

`provider`属性定义了哪个**Prisma Client(语言定义)**被创建, 只有`prisma-client-js`可用.

可选: `output`定义了生成资产的输出文件夹



##### Data model

> [Models | Prisma Documentation](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

定义应用模型(也叫做Prisma models).

* 表示应用域的实体
* 在数据库中映射表(例如PostgreSQL)或集合(例如MongoDB)



数据模块的组成:

* Modesl: 定义fields
* Enums 如果连接器支持Enums
* Attributes and functions,改变fields 和 models的行为



### Prisma访问数据库流程:

**如何使用 Prisma 访问数据库:**

1. 创建 schema.prisma；
2. 生成数据库；
3. 创建 PrismaClient；
4. 访问数据库







#### 创建数据库

根目录下`server/database/schema.prisma`: 

```json
    datasource db {
      provider = "mysql"
      url      = env("DATABASE_URL")
    }

    generator client {
      provider = "prisma-client-js"
    }

    model Post {
      id        Int     @id @default(autoincrement())
      title     String
      content   String?
      published Boolean @default(false)
      author    User?   @relation(fields: [authorId], references: [id])
      authorId  Int?
    }

    model User {
      id    Int     @id @default(autoincrement())
      email String  @unique
      name  String?
      posts Post[]
    }

```



添加环境变量DATABASE_URL, 根目录下创建`.env`文件

```env
DATABASE_URL="mysql://root:rootpassword@localhost:3306/test"
```



#### 生成数据库

然后通过定义生成数据库表结构，我们需要执行 `prisma migrate` CLI 命令，这个命令同时会生成 prisma client：

```bash
npx prisma migrate dev --name init --schema server/database/schema.prisma 
```



#### 创建client

最后在代码中通过client访问数据库:

```js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 查询所有用户
  const allUsers = await client.user.findMany()
  // eslint-disable-next-line no-console
  console.log(allUsers)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

```



执行这段代码:

```bash
// 原教程中是: npx ts-node server/database/test.ts

npx tsx server/database/test.ts
```

注意需要配置一下ts-node模块选项,tsconfig.json:

```json
{
  // https://nuxt.com/docs/guide/concepts/typescript
  "extends": "./.nuxt/tsconfig.json",
  "ts-node": {
    "compilerOptions": {
      "module":"CommonJS"
    }
  }
}


```

在test.ts中操作数据

```js
//插入数据
  await prisma.user.create({
    data: {
      name: '村长',
      email: 'yt0379@qq.com',
      posts: {
        create: {
          title: '10分钟速通下一代ORM解决方案：Prisma',
        },
      },
    },
  })

```





















### Nuxt多种打包方式

#### 方式介绍

> 与传统服务端渲染只能发布于 Node.js 服务不同，Nuxt 应用不仅可以发布在 Node.js 服务上，还能预渲染内容做为静态服务，Nuxt3 甚至可以发布在 Serverless 或 CDN 等云服务环境。
>
> 打包 Nuxt 项目可以用`nuxt build`或`nuxt generate`，根据配置不同，可分为以下几种方式：
>
> - SSR：`nuxt build`。面向Node.js服务，代码会被打包到`.output`目录，打包产物分为 public 和 server 两部分。入口为 index.mjs，可以使用 node 或 pm2 等进程管理工具启动服务，也可以配合`nuxt preview`启动预览服务。
>
> 
>
> - SPA：传统单页面应用模式。设置`ssr:false`，再执行 `nuxt generate`。产物只有 .output/public 中的静态文件，发布 .output/public 即可。但是 SPA 需要在运行时访问接口获取数据，因此仍然需要提供接口服务才能正常显示页面。
>
> 
>
> - SSG：静态站点生成模式，生成静态页面。使用`nuxt generate`打包，产物只有 .output/public 中的静态文件，发布 .output/public 即可。这种方式会在创建时生成页面内容，因此只需要提供静态服务即可预览。
>
> 
>
> - 其他服务：`presets`，可用于其他非 node 运行时打包，例如 deno，serverless，edge worker 等。产物根据预设不同会有不同，部署需要按照对应的平台进行操作。



#### 打包SSR

直接执行`nuxt build`：

```
npm run build
```

打包结束可以运行 `npm run preview` 预览项目。



#### 打包SSG

直接执行 `nuxt generate`：

```bash
npm run generate
```

打包结束后, serve文件夹是空的. 只有public中的静态内容.

可以运行`npm run preview`预览打包结果.



#### 打包SPA

在nuxt.config.ts中配置`ssr: false`

```ts
export default defineNuxtConfig({
  ssr: false
})
```

执行命令: `nuxt generate`

serve文件夹是空的, 跟SSG不同的是,动态的detail没有了,会作为前端动态路由出现.



##### 使用presets

此方式主要用于各种云服务部署。 我们配置 `nitro.preset`选项即可，nuxt.config.ts：

例如,我们准备发布到vercel,可以设置`nitro.preset`为`vercel`或`verce edge`





#### 部署Node.js服务

针对前面介绍的 SSR 方式打包，访问页面需要服务器实时渲染，因此需要启动 node server。

##### 启动node.js服务

执行如下命令启动服务:

```bash
node .output/server/index.mjs
```

服务启动效果如下:

```bash
=> nuxt3-app git:(3.0-deploment) x node .output/server/index.msj
Listening http://[::]:3000
```

访问 `http://localhost:3000/`,这意味着我们只需要将 `.output` 中的内容上传至服务器并启动 node 服务即可。



##### 运行时配置

服务器上可能有多个应用，因此需要配置端口号等。传递环境变量可以修改端口号等的默认配置，例如：

- PORT：端口号；
- HOST：服务地址；
- NITRO_SSL_CERT 和 NITRO_SSL_KEY：启用 HTTPS。

下面我们修改端口号为 8080：

```bash
PORT=8080 node .output/server/index.mjs
```

##### 进程管理

服务器一般会有 pm2 之类的工具便于管理多个服务进程，可以配置 ecosystem.config.js：

```js
module.exports = {
  apps: [
    {
      name: 'czblog',
      port: '8080',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}

```

安装pm2

> npm i pm2 -g

启动服务

```bash
pm2 start ecosystem.config.js
```

访问`http://localhost:8080`，效果是一致的



#### 部署静态服务器

如果生成的是 SPA 或 SSG，则仅需上传 public 中的内容到服务器，并启动一个静态服务即可，例如 nginx。

本地演示,使用serve包

```bash
cd .output/public
# 需要先安装 serve 包
serve
```

访问`http://localhost:3000`, 查看部署后的效果



#### 部署到云服务

Nuxt 应用可以部署在各种云服务环境上，但是需要 Nuxt 有对应的 present 支持，目前官方提供了非常多 presents：





##### 部署到vercel

这里就以 Vercel 为例给大家演示 Nuxt 应用发布过程：

1.修改预设定为`vercel`, nuxt.config.js

> 由于vercel是零配置提供商，因此理论上这一步可以免掉，大家可以测试一下。

```ts
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel'
  }
})
```



2.发布项目到github/gitlab:

3.qmwh vercel导入项目

4.发布项目: 配置会自动导入,点击Deploy发布

5.部署成功

6.预览项目







## nuxt项目

### 1.脚手架安装

```bassh
npx nuxi@latest init 项目名称
```

安装过程中有两个可选项:

* 选择包管理工具
* `Initialize git repository`



### 2.UI配置

#### 0.添加全局CSS样式

在`assets/css`目录下创建reactive.css文件, 然后在nuxt.config.js中添加css的配置项.

```js

//nuxt.config.js

export default defineNuxtConfig({
  devtools: {enable: true},
  modules: ['@nuxt/ui'],
  css: [
    'assets/css/reactive.css'  //添加全局响应式处理
  ]
})
```





#### 1.安装nuxtui

安装命令

```bash
npx nuxi@latest module add ui
```

配置项(以上的命令会自动配置)

```js
// nuxt.config.ts

export default defineNuxtConfig({
  modules: ['@nuxt/ui']
})
```

项目中使用了tailwindcss,但是ui框架中已经包含了tailwindcss库.



#### 2.全局安装naiveui

> https://juejin.cn/post/7387001928209825807
>
> [Nuxt.js - Naive UI](https://www.naiveui.com/en-US/os-theme/docs/nuxtjs)

**安装nuxtjs-naive-ui**

官网的安装命令有问题:

```bash
npx nuxi module add nuxtjs-naive-ui
```

一直报错: `  ERROR  [GET] "https://registry.npmjs.org/nuxtjs-naive-ui/latest": <no response> fetch failed`

背景信息:

* 命令行正确, 从官网copy来
* 网络正常
* 代理正常

原因并没有找到, 所以我们需要手动安装和配置:

1.安装

```bash
npm i nuxtjs-naive-ui
```

2.在nuxt.config.ts中添加配置

```js
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['nuxtjs-naive-ui']
})
```



**安装自动导入相关的包**

在终端上黏贴后直接运行:

```bash
npm i -D naive-ui
npm i unplugin-auto-import -D
npm i unplugin-vue-components -D
```

添加自动导入的配置:

```ts
//nuxt.config.ts

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['nuxtjs-naive-ui'],
  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ]
  }
})
```



在组件中测试是否成功引入:

```vue
<n-button>aaa</n-button>
```





### 3.登录/注册页面实现

#### 1.创建布局页面

##### layouts文件夹介绍

> [layouts/ · Nuxt Directory Structure](https://nuxt.com/docs/guide/directory-structure/layouts)

**是什么? **

> Nuxt提供了布局系统,可以把公用页面布局内容提取到`layouts`目录中以便复用.

**如何使用?**

在`app.vue`中直接使用`<NuxtLayout>`组件即可.

**其它功能**

* 默认Layout
* 命名Layout
  * 嵌套文件的命令方式
* 动态更改Layout `setPageLayout('custom')`
* 重写Layout内容

#### 1.创建默认布局

`layouts/default.vue`

需要在根目录下创建`components/`文件夹, 创建`MyHeader, MyFooter, Menu`组件, 在组件中可自动导入.

```vue
<template>
  <div class="min-w-[1024px] bg-gray-100 flex flex-col min-h-screen">
    <MyHeader />
    <main class="container container-content m-auto mt-20">
      <slot />
    </main>
    <MyFooter />
  </div>
</template>

<style>
  .container-content {
    
  }
</style>
```



app.vue中使用`defualt.vue`

```vue
<template>
	<NuxtLayout>
  	<NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
```





#### 2.创建login/register等页面

##### 创建默认布局-登录布局

在`layouts`下创建`blank.vue`布局

```vue
<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100">
    <div class="shadow-lg bg-white rounded-lg p-5">
      <slot />
    </div>
  </div>
</template>

```



我们需要在login/register页面中使用`definePageMeta`中

##### definePageMeta

> [definePageMeta · Nuxt Utils](https://nuxt.com/docs/api/utils/define-page-meta)

为`pages/`路径下的页面组件设置元数据

为每个路由设置布局的静态或动态名称。如果需要禁用默认布局，则可以将其设置为 false。

```ts
definePageMeta({
  layout: 'blank' //为当前的页面组件设置blank样式的布局. blank位于'layouts/blank.vue'
})
```



#### 3.apifox提供测试接口

> 使用apiFox提供登录(login)和注册(register)的接口



#### 4.创建后端接口

##### 1.需要准备什么

后端接口需要操作数据库,我们需要docker来安装数据库和其管理端,需要prisma来对数据库进行CRUD操作

所以我们需要:

* 安装docker,进而安装MySql和Adminer管理端
* 安装prisma
* 编写后端接口



##### 2.安装docker

1.安装([官网下载](https://www.docker.com/))

2.根目录下添加`docker-compose.yml`文件

3.执行命令`docker compose up -d`,拉取镜像

4.安装成功, 可通过`http://localhost:8080`管理数据库

> 遇到的问题

使用命令行创建docker中的服务后, 数据库老师自动停止报错.在这里我们采用清理之前运行过的数据卷残留

```bash
docker-compose down -v
```



##### 3.安装prisma

0.prisma操作数据库应该在项目初始时就应该建立.

1.本地创建scheme文件: `server/database/scheme.prisma`

2.根目录下添加环境变量文件`.env`, 配置数据库地址

3.执行相关命令`npx prisma migrate dev --name init --scheme server/database/scheme.prisma`,生成数据库表结构

4.之后,便可以在后端接口中通过prismaclient访问数据库

5.如何访问, 我们在database下创建一个prisma.ts文件,用来暴露prisma实例. 通过实例上的方法来操作数据库

按照java开发中业务和逻辑分开的原则,在database文件夹下创建repositories文件夹,当作逻辑操作;业务操作复杂的可置于service文件夹下,简单的就直接置于database文件夹下.



访问流程说明:

前端发起请求 => `server/api/*`下的接口捕获 => `server/database/repositories`去操作后端数据库并返回数据



##### 4.注册后端接口

我们注册了:

`server/api/register.post.ts`接口

`server/api/login.ts`

`server/api/userInfo.get.ts`



##### 5.页面实现

登录页面和注册页面实现

在这里我们需要封装$fetch, 引入pinia管理全局状态,并编写接口.



**使用Pinia**

> 文档 [Nuxt.js | Pinia](https://pinia.vuejs.org/ssr/nuxt.html)

**安装**

此命令失败:   `npx nuxi@latest module add pinia`,提示Error说找不到仓库

直接安装 `npm i @pinia/nuxt pinia`

**添加配置文件**

添加nuxt的模块处理及配置自动导入功能.

```js
//nuxt.config.js

export default defineNuxtConfig({
  module: [
    '@nuxt/ui',
    [
      '@pinia/nuxt',
      //配置自动导入或直接使用和module同级pinia项
      {
        aotuImports: [
          'defineStore', //暴露量;以的store
          'storeToRefs'  //从store中提取单个引用
        ]
      }
    ]
  ]
})
```



**定义全局状态**

创建`store/user.ts`来定义全局状态

```ts
//store/user.ts

export const useUser = defineStore('user', {})
```



#### 首页前后端实现

#### 页面介绍

首页有4个部分组成: banner,内容推荐,最新课程,最新专栏



#### 种子数据

##### 如何使用prisma来创建种子数据?

1.在server/database文件夹下创建`seed.ts`或`seed.js`文件(类型取决于环境)

2.在package.json中配置seed命令

> 这个地方建议事件tsx包来替换ts-node, 因为:
>
> 1.不需要单独配置typescript.json中的'ts-node'的模块引入方式
>
> 2.package.json中的module形式可以继续使用`type: module `

```bash
npm i tsx
```



```json
"prisma": {
  // "seed": "ts-node server/database/seed.ts"
  "seed": "tsx server/database/seed.ts"
},
"scripts": {
  "seed": "npx prisma db seed",
  //...
}

```



3.创建种子数据

server/database/seed.ts

```ts
//....
```



4.使用cli命令,设定种子数据. 会向数据库中插入种子数据.

```bash
npx prisma db seed
```



##### 种子数据使用环境

* 开发环境中快速填充测试数据

* 设置数据库的初始状态

* 确保所有开发人员有相同的基础测试数据



#### 接口实现

##### 1.专栏接口和课程接口的数据请求

> server/repositories/columnRespository

```ts
import type {Column} from '@prisma/client'
import prisma from '~/server/database/client'

export async function getNewColumn(): Prisma<Column[] | null> {
  const result = await prisma.column.findMany({
    orderBy: {id: 'desc'},
    take: 4
  })
}
```



> server/repositories/courserRepository

```ts
import type { Course } from '@prisma/client'
import prisma from '~/server/database/client'

export async function getNewCourses(): Promise<Course[] | null> {
  const result = await prisma.course.findMany({
    orderBy: { id: 'desc' },
    take: 4,
  })
  return result
}

```



##### 2.专栏接口和课程接口的接口

```ts
import { getNewColumns } from '../database/repositories/columnRepository'
import { getNewCourses } from '../database/repositories/courseRepository'

export default defineEventHandler(async (e) => {
  try {
    const columns = await getNewColumns()
    const courses = await getNewCourses()

    return { ok: true, data: { columns, courses } }
  }
  catch (error) {
    return sendError(e, createError('获取数据失败'))
  }
})

```



#### 前端页面实现





### 列表页实现

#### 页面介绍

> 页面有3部分组成:
>
> * 面包屑导航
> * 内容列表
> * 分页器



#### 接口实现

我们需要实现两个接口：

- course：分页获取课程列表
  - Query params：page和size
  - 返回 { ok: boolean, data: { courses: Course[], total: number}}
- column：分页获取专栏列表
  - Query params：page和size
  - 返回 { ok: boolean, data: { columns: Column[], total: number}}

```ts
// server/database/columnRepository.ts 

export async function getColumns({page, size}): Promise<{columns: Column[] | null; total: number}> {
  const [columns, total] = await Promise.all([
    prisma.column.findMany({
      orderBy: {id: 'desc'},
      skip: page * size,
      take: size
    }),
    prisma.column.count()
  ])
  
  return { column, total }
}
```



```ts

// server/database/courseRepository.ts

export async function getCourses({ page, size }): Promise<{ courses: Course[] | null; total: number }> {
  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      orderBy: { id: 'desc' },
      skip: page * size,
      take: size,
    }),
    prisma.course.count(),
  ])
  return { courses, total }
}

```



分别实现course和column接口, 

```ts
// server/api/course.ts

import { getCourses } from '../database/repositories/courseRepository'

export default defineEventHandler(async (e) => {
  try {
    // 获取分页信息
    const query = getQuery(e)
    const page = query.page ? parseInt(query.page as string) : 0
    const size = query.size ? parseInt(query.size as string) : 8
    // 分页获取课程列表和总条数
    const { courses, total } = await getCourses({ page, size })

    return { ok: true, data: { list: courses, total } }
  }
  catch (error) {
    return sendError(e, createError('获取数据失败'))
  }
})

```



```ts
// server/api/column.ts

import { getColumns } from '../database/repositories/columnRepository'

export default defineEventHandler(async (e) => {
  try {
    // 获取分页信息
    const query = getQuery(e)
    const page = query.page ? parseInt(query.page as string) : 0
    const size = query.size ? parseInt(query.size as string) : 8
    // 分页获取课程列表和总条数
    const { columns, total } = await getColumns({ page, size })

    return { ok: true, data: { list: columns, total } }
  }
  catch (error) {
    return sendError(e, createError('获取数据失败'))
  }
})

```



#### 前端页面实现

课程页面和专栏页面相似,都是由3部分组成:

* 面包屑
* 列表
* 分页

所以,我们用一个列表页来实现,

* 过一个动态路由`/list/:type`区分；
* 删除之前 course.vue 和 column.vue；
* 修改 MyHeader.vue 中的导航链接地址；
* 修改 index.vue 中的“更多课程”和“更多专栏”链接地址。

**创建pages/list/[type].vue**

> 使用动态路由

```vue
// pages/list/[type].vue

<!-- 课程列表页 -->
<script setup lang="ts">
import type { IResult } from '~/types/IResult'

const route = useRoute()
const type = route.params.type as string
const title = type === 'course' ? '课程' : '专栏'
useHead({ title })

const url = type === 'course' ? '/api/course' : '/api/column'
const page = ref(1)
const size = ref(8)
const {
  data,
} = await useFetch<IResult>(() => `${url}?page=${page.value - 1}`, {
  watch: [page],
})

const onPageChange = (pageNum) => {
  page.value = pageNum
}
</script>

<template>
  <div>
    <NBreadcrumb class="mb-5">
      <NBreadcrumbItem>
        <nuxt-link to="/">
          首页
        </nuxt-link>
      </NBreadcrumbItem>
      <NBreadcrumbItem>
        {{ title }}
      </NBreadcrumbItem>
    </NBreadcrumb>
    <!-- 课程渲染 -->
    <NGrid :x-gap="20" :cols="4">
      <NGi v-for="item in data?.data.list" :key="item.id">
        <Prod :data="item" :type="type" />
      </NGi>
    </NGrid>
    <!-- 分页组件 -->
    <div class="flex justify-center items-center mt-5 mb-10">
      <NPagination
        size="large" :item-count="data?.data.total" :page="page" :page-size="size"
        :on-update:page="onPageChange"
      />
    </div>
  </div>
</template>

```



### 详情页实现

#### 页面介绍

课程页、专栏详的情页设计非常相似，因此统一处理。它们由 3 部分构成：

- 课程/专栏简介：不同点是专栏没有价格；
- 详情/目录：不同点是专栏没有目录；
- 推荐列表：暂时显示最新的两个。

#### 接口实现

我们需要实现两个接口：

- /course/[id]：获取指定课程详情
  - 返回 { ok: boolean, data: { item: Course, recommend: Course[] }}
- /column/[id]：分页获取专栏列表
  - 返回 { ok: boolean, data: { item: Column, recommend: Column[] }}

更新两个 repository，columnRepository.ts

```ts
// server/database/columnRepository.ts

export function getColumnById(id: number): Promise<Column | null> {
  const result = await prisma.column.findFirst({
  	where: {
  		id,
		}
	})
  return result
}
```



```ts
//server/database/courseRepository.ts

export function getColumnById(id: number): Promise<Course | null> {
  const result = await prisma.course.findFirst({
  	where: {
  		id,
		},
    include: { Catalogue: true }
	})
  return result
}
```



分别实现course和column接口, 

`server/api/course/[id].ts`

```ts

//server/api/[id].ts
import {getCourseById, getColumns} from '~/server/database/repositories/courseRepository'
export default defineEventHandler(async(e) => {
  
})
```

`server/api/column/[id].ts`

```ts
// server/api/column/[id].ts

import { getColumnById, getColumns } from '~/server/database/repositories/columnRepository'

export default defineEventHandler(async (e) => {
  const id = e.context.params?.id ? parseInt(e.context.params.id) : undefined
  if (!id)
    return sendError(e, createError({ statusCode: 400, statusMessage: '参数错误' }))
  try {
    const column = await getColumnById(id)
    if (!column)
      return sendError(e, createError({ statusCode: 404, statusMessage: '没有对应专栏' }))

    const { columns: recommend } = await getColumns({ page: 1, size: 2 })

    return { ok: true, data: { item: column, recommend } }
  }
  catch (error) {
    return sendError(e, createError({ statusCode: 500, statusMessage: '服务器错误' }))
  }
})

```



#### 前端页面实现



### 订阅流程实现

#### 页面介绍

支付流程:

1. 首先创建订单（状态为等待确认 WAIT_CONFIRM)；
2. 然后跳转订单确认页面；
3. 用户确认订单（状态变为等待支付 WAIT_PAY）；
4. 并跳转支付页面；
5. 用户扫码支付结束（订单状态变为已完成 COMPLETED)；
6. 页面发现订单完成跳转至课程详情页。



#### 页面设计

订单确认页 + 支付页



#### 接口实现

我们需要实现两个接口：

- /order：创建订单。
  - method: post
  - body：{ courseId: number }
  - 返回 { ok: boolean, data: { orderId: number } }
- /order/[id]：获取订单详情。
  - method：get
  - 返回 { ok: boolean, data: Order }
- /order: 更新订单状态。
  - method：patch
  - body: { id: number, status: string }
  - 返回 { ok: boolean }



创建`server/database/repositories/orderRepository`

```ts
import type { Order } from '@prisma/client'
import prisma from '~/server/database/client'

export async function createOrder(data: Order) {
  const user = await prisma.order.create({data})
  return user
}

export async function getOrderById(id: number) {
  const result = await prisma.order.findUnique({
    where: {
      id
    },
    include: {
      course: {
        select: {
          title: true,
          cover: true,
          price: true
        }
      }
    }
  })
  return result
}

export async function updateOrder(id:number, data: Partial<Order>) {
  const result = awiat prisma.order.update({
    where: {
      id
    },
    data
  })
  return result
}
```



### 用户体验优化

#### 响应式设计

天啊



#### 页面权限控制

有些页面需要在登录之后才能看到,例如:

* 用户中心页面
* 订单确认页面
* 支付页面
* ...



##### 通过路由中间件实现页面权限控制

> 在vue项目中,是通过路由守卫的方式达到页面权限管理,nuxt封装了vue-router,想要获取路由器实例可以通过 useRouter，然后再添加守卫。然而官方却不推荐这么做，详情参见：
>
> [nuxt.com/docs/api/co…](https://link.juejin.cn/?target=https%3A%2F%2Fnuxt.com%2Fdocs%2Fapi%2Fcomposables%2Fuse-router%23navigation-guards)
>
> 

1.创建Auth中间件

```ts
// ~/middleware/auth.ts

export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')
  const route = useRoute()

  // 未登录重定向到登录页
  if (!token.value) {
    if (process.client)
      message.error('请先登录')

    return navigateTo(`/login?from=${route.fullPath}`)
  }
})

```



2.注册中间件

在需要的页面注册 auth 中间件。例如,在用户中心页面注册中间件.

```vue
// pages/usercenter.vue

definePageMeta({
	middleware: ['auth']
})
```





#### 展示加载进度

加载进度的反馈方式有很多,例如:

- 进度条
- 菊花图
- 骨架屏

我们使用naive-ui的骨架屏组件完成一个加载进度的实现:

1.创建公共loading组件:

在不同页面使用的时候还需要根据内容做调整

```vue
// ~/components/Loading.vue

<script setup lang="ts">
const props = defineProps({
  pending: {
    type: Boolean,
    default: false,
  },
})

// 防止加载过快画面闪烁
const loading = ref(false)
watchEffect(() => {
  if (props.pending && !loading.value) {
    loading.value = true
  }
  else {
    setTimeout(() => {
      loading.value = false
    }, 200)
  }
})
</script>

<template>
  <div>
    <template v-if="loading">
      <slot name="loading">
        <NCard v-for="i in 4" :key="i" class="mb-5">
          <NSkeleton text style="width: 30%" />
          <NSkeleton text :repeat="2" />
          <NSkeleton text style="width: 45%" />
          <NSkeleton text style="width: 60%" />
        </NCard>
      </slot>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

```



### 本地测试部署



后台启动

```bash
docker-compose up -d
```



删除之前的旧卷?

```bash
docker-compose down -v
```

重新构建

```bash
docker-compose build --no-cache
```





#### 遇到的问题:

启动之后,控制台报错:

```bash
docker-compose up
time="2024-11-10T11:35:49+08:00" level=warning msg="C:\\PersonalData\\github\\Nuxt\\nuxt3-app-course2\\docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"        
[+] Running 3/0
 ✔ Container nuxt3-app-course2-adminer_container-1   Runni...                                                   0.0s 
 ✔ Container nuxt3-app-course2-mysql_db_container-1  Runn...                                                    0.0s 
 ✔ Container nuxt_app                                Running                                                    0.0s 
Attaching to adminer_container-1, mysql_db_container-1, nuxt_app
nuxt_app              | [nuxt] [request error] [unhandled] [500] Named export 'VLazyTeleport' not found. The requested module 'vueuc' is a CommonJS module, which may not support all module.exports as named exports.
nuxt_app              | CommonJS modules can always be imported via the default export, for example using:
nuxt_app              |
nuxt_app              | import pkg from 'vueuc';
nuxt_app              | const { VResizeObserver, VFocusTrap, VLazyTeleport } = pkg;
nuxt_app              |
nuxt_app              |
nuxt_app              | [nuxt] [request error] [unhandled] [500] Named export 'VLazyTeleport' not found. The requested module 'vueuc' is a CommonJS module, which may not support all module.exports as named exports.
nuxt_app              | CommonJS modules can always be imported via the default export, for example using:
nuxt_app              |
nuxt_app              | import pkg from 'vueuc';
nuxt_app              | const { VResizeObserver, VFocusTrap, VLazyTeleport } = pkg;
nuxt_app              |
nuxt_app              |
```



解决方案:

这个错误是因为 vueuc 模块的导入方式有问题。这是一个典型的 CommonJS 和 ES Module 混用导致的问题。让我们来修复它：

1. 首先，检查你的项目中是否有直接使用 `vueuc` 的导入。通常这个模块是被 naive-ui 或其他 UI 库依赖的。
2. 修改导入方式，有几种解决方案：

方案一：修改 nuxt.config.ts，添加 transpile 配置：

```
typescriptCopyexport default defineNuxtConfig({
  // ... 其他配置
  build: {
    transpile: [
      'vueuc',
      /naive-ui/ // 如果你使用了 naive-ui
    ]
  },
})
```

方案二：如果你直接使用了 vueuc，修改导入方式：

```
typescriptCopy// 修改前
import { VLazyTeleport } from 'vueuc'

// 修改后
import vueuc from 'vueuc'
const { VLazyTeleport } = vueuc
```

方案三：添加 vite 配置来处理这个模块：

```
typescriptCopy// nuxt.config.ts
export default defineNuxtConfig({
  // ... 其他配置
  vite: {
    optimizeDeps: {
      include: ['vueuc']
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    }
  }
})
```

方案四：如果你使用的是 naive-ui，可以尝试更新配置：

```
typescriptCopy// nuxt.config.ts
export default defineNuxtConfig({
  // ... 其他配置
  build: {
    transpile: process.env.NODE_ENV === 'production'
      ? [
          'naive-ui',
          'vueuc',
          '@css-render/vue3-ssr',
          '@juggle/resize-observer'
        ]
      : ['@juggle/resize-observer']
  },
  vite: {
    optimizeDeps: {
      include: process.env.NODE_ENV === 'development'
        ? ['naive-ui', 'vueuc', 'date-fns-tz/formatInTimeZone']
        : []
    }
  }
})
```

1. 更新 package.json 中的依赖版本，确保使用最新的兼容版本：

```
jsonCopy{
  "dependencies": {
    "vueuc": "^latest",
    "naive-ui": "^latest" // 如果使用了 naive-ui
  }
}
```





# Nuxt静态网站更新范式 (???)

网站当前的技术架构（Nuxt.js + 无内容管理系统），文章内容的更新机制可能有以下实现方式，且​**​不需要每次更新都部署前后端代码​**​。以下是具体分析：

### 1.静态内容动态化(主流方案)

​​Markdown/JSON文件存储​​：文章内容可能存储在/content目录下的Markdown文件或JSON数据文件中
​​Nuxt Content模块​​：通过@nuxt/content模块实现内容解析（截图未明示但技术可行）
​​Git Hook自动触发​​：当编辑者通过Git提交新文章时，触发CI/CD流程自动构建

### 2.**混合渲染模式（Hybrid Mode）​**​

- ​**​增量静态生成 (ISR)​**​：针对频繁更新的文章列表页：


### 3.客户端动态加载（Fallback方案）​​
首屏渲染静态框架，通过客户端JavaScript动态请求文章数据：



### 更新流程解析（无需代码部署）

|步骤|操作方式|技术实现|
|---|---|---|
|1. 内容编辑|运营人员修改Markdown/JSON文件|通过Git仓库或CMS后台|
|2. 触发构建|提交变更到代码仓库|GitHub/GitLab Webhooks|
|3. 自动部署|CI/CD流水线执行|GitHub Actions / Jenkins|
|4. 内容更新|生成新的静态文件|Nuxt generate 命令|
|5. CDN刷新|清除旧缓存|Cloudflare Purge API|