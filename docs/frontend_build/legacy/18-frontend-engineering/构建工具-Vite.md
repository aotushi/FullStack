
# vite

## 功能介绍
### 1.裸模块导入
原生ES导入不支持如下形式的裸模块(是指没有相对路径或绝对路径的模块)导入:

```js
import {someMethod} from 'app'
```

Node.js, webpack, vite都可以使用裸模块导入, 是因为它们都有查找路径的方法. Vite中查找和转换的规则如下:
* 预构建: 将CommonJS/UMD转换为ESM格式
* 修改裸模块路径: 如将路径指向`node_modules`文件夹下.

需要预构建的原因? 因为不是所有模块都是ESM, Vite无法解析CommonJS或UMD.
在默认情况下, Vite会将裸模块路径指向`node_modules`文件夹下. 例如:
```js
//在源码中使用
import dayjs from 'dayjs'

//在浏览器解析时
import dayjs from '/node_modules/dayjs/dayjs.min.js'
```


### 2.依赖预构建

**什么是预构建? **

上面提到了


**怎么预构建?**

在开发环境中,使用esbuild来执行预构建
在生产环境下,不会使用依赖预构建, 使用rollup的`rollup/plugin-commonjs`插件来打包代码


**为什么预构建开发和生产中不同?**
因为当前esbuild对打包功能支持不够完善,如生成哈希值,处理资源文件,分析包文件等无法用esbuild实现.

**预构建的优势?**
1.自动缓存
 预构建缓存有浏览器和文件系统两层缓存. 文件系统缓存到`node_modules/.vite`下; 浏览器缓存到HTTP强缓存: `max-age=31536000,immutable`

2.依赖优化
背景: vite默认使用index.html文件中抓取项目的依赖项并执行预构建,这个过程是根据模块间的导入关系自动实现的.Vite只会从`node_modules`文件夹下抓取依赖,有时可能修改依赖路径, 例如在某个组件中新导入一个依赖. 这就需要依赖优化.

如何实现? 通过optimizeDeps配置项来实现.

### 3.模块热替换
模块热替换(Hot Module Replement, HMR).  在开发模式下修改代码, 构建工具会自动检测文件变化,将发生变化的部分重新构建并在页面中更新,无需刷新浏览器,提高效率.
Vite提供了一套使用原生ESM的HMR Api,主流框架均可使用.
框架与实现模块热替换插件的对应关系:
* vue:  @vitejs/plugin-vue
* react @vitejs/plugin-react
* Preact @prefresh/vite

当使用脚手架创建项目时, 此功能默认开启.

如何在一个全新的Vite项目中集成模块热替换? 添加如下配置即可.

```js
//vite.config.js

import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()]
})
```


### 4.TS转译
vite支持TS,支持直接导入ts文件,不需要其它插件协助.
支持TS一般是以下两个方面:
* 类型转移
* 类型检查
vite使用esbuild来实现类型转译, 不进行类型检查. 类型检查交给编辑器执行(vscode中的ts插件).

在vite中使用ts需要注意如下两点:
1.强制使用ESM
TS将没有import/export的文件视为旧脚本文件,会被当作全局脚本文件而不是模块. 在`tsconfig.json`配置文件的compilerOptions选项下, 将配置项isolatedmodules的值设为true, 这样可以保证esbuild在转译TS时候,转译对象都是标准的ESM. 当用户编写没有import/export关键字的文件时候, 编辑器会提示错误, 这样会强制规范用户编写ESM代码.


2.客户端类型
vite默认的类型定义是面相node的, vite单独为客户端提供了类型.在客户端根目录下添加一个声明文件`d.ts`,引入客户端类型:
```ts
/// <reference types="vite/client" />
```

此时, 在源码中使用`import.meta.env`对象就可以看到环境变量的类型.



### 5.JSX/TSX转译


### 6.CSS资源处理
在vite中, 不管是`.vue`文件还是JS文件中单独导入一个css文件, 最终样式都会被编译到html文件的style标签内. 

vite对CSS提供了多项优化支持:
* `@import`开箱即用
* css modules支持
* css预处理器:  
	* 推荐在vite项目中使用css变量或postcss插件提供的语法; 
	* 安装了预处理器less,sas等的支持,只需安装特定插件,不需要安装特定插件
	* 在预处理器中`@import`关键字支持路径别名
	* css模块也支持预处理器模块: `test.module.less`


### 7.静态资源导入
**是什么?**
静态资源导入主要是图片,字体等非代码资源的导入.

vite支持修改资源被引入的方式, 如设置导入资源返回的资源路径还是字符串,可以通过如下方式实现:
```js

import json from './test.json?url'
console.log(json) // /src/assets/img.png


import json2 from './test.json?raw'
console.log(json2) //'{name:'test'}'
```


**被动导入(懒加载/异步加载)**

使用import()函数实现


**Glob导入**
vite支持通过模糊匹配批量导入资源, 这种方式被称为Glob导入. 其是通过特殊的`import.meta.glob()`函数实现的, 参数是模糊路径.

使用介绍:
```js
let modules = import.meta.glob('./dir/*.js)

// modules值是一个返回的对象,属性是匹配到的文件卖山; , 值是一个import()动态导入函数.
等同于下面的效果
{
 './dir/a.js': () => import('./dir/a.js'),
 './dir/b.js': () => import('./dir/b.js')
}
```




## 通用配置

### base
> 开发或生产环境下的公共基础路径,默认是'/'.


### mode
> 用于设置开发环境和生产环境.

### plugin
> 用于定义vite中引用的插件数组.导入的所有插件必须定义到这里才会生效.


### publicDir
> 静态资源文件目录,默认是public.该目录下存储的简略; 文件不会经过任何编译和转换处理,再打包后直接被复制到输出目录下,因此这里适合存储在index.html中直接引用的文件.
> 在源码中不推荐引用publicDir目录下的文件,推荐放到src/assets文件目录下.


### cacheDir
> 表示存储缓存文件的目录. Vite会将依赖缓存起来以提高构建性能.其中,文件系统缓存存储在`node_modules/.vite`目录下,该目录是cacheDir的默认值.


### resolve
> 用于定义一些解析规则,其值是一个对象.最常用的子选择有俩: alias, extensions.

resolve.alias配置
```js
// vite.config.js

import { defineConfig } from 'vite'
export default defineConfig({command, mode} => {
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})
```

resolve.extensions配置:
定义导入模块时可以省略的扩展名.其值是一个数组. 默认值是:`['.mjs', '.js','.jsx','.tsx','.json']`. 以这些扩展名为后缀的文件在导入时,可以省略后缀,vite会自动查找匹配的文件. 假设有文件`src/demo.js`,结合别名,以下3种导入方式效果一样:
```js
import demo from './src/demo.ts'
import demo from './src/demo'
import demo from '@/demo'
```

### css
> 用于定义如何解析css. 最常用的选项只有1个: css.devSourcemap, 用来表示是否开启devSourcemap(源码映射)
> Vite会将css编译到html文件的style标签内, 在浏览器种调试代码时,单击样式也会定位到style标签下.
> devSourcemap在生产环境下不生效,直接开启即可.


### esbuild
> 用于定义esbuild的TransformAPI,主要的应用场景是自定义JSX. 该选项主要包含两个属性: jsxFactory属性表示转换JSX的构造函数, jsxFragment属性表示批量创建元素的无外部包裹的函数.



### envDir
> 用于加载`.env`文件的目录,默认是项目根目录. `.env`用于定义环境变量,当需要按照不同模式加载不同环境变量时, 会定义像`.env.staging`这样的文件. 


### envPrefix
> 表示有效的环境变量前缀, 默认是`VITE_`, 为了安全起见, vite认为只有符合该选项配置前缀的环境变量才是有效的.









  