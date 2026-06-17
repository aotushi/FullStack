## webpack

> https://juejin.cn/post/6844904079219490830



### 是什么

`webpack` 是一个现代 `JavaScript` 应用程序的静态模块打包器，当 `webpack` 处理应用程序时，会递归构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个 `bundle`。 ?



### webpack核心概念

- entry: 入口
- output: 输出
- loader: 模块转换器，用于把模块原内容按照需求转换成新内容
- 插件(plugins): 扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情



### 初始化项目

新建一个文件夹，如: `webpack-first`. 推荐大家参考本文一步一步进行配置，不要总是在网上找什么最佳配置，你掌握了`webpack`之后，根据自己的需求配置出来的，就是最佳配置。















## CLI 



### vue-cli中修改webpack配置









## CLI使用案例

### 在控制台打印当前应用的信息

> 根据不同的启动环境,使用`console.table()`方法来打印相应的应用信息



#### 1. 根目录下生成环境文件

在你的项目根目录中放置下列文件来指定环境变量,:



```bash
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入 例如development, test, production
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```

一般我们在项目中生成的环境文件有:

* `.env`
* `.env.production`
* `.env.development`
* `.env.testing`
* `.env.staging`



#### 2.环境文件中声明环境变量的"键=值"对

> 只有<span style="color:red"> `NODE_ENV`，`BASE_URL` 和以 `VUE_APP_` </span>开头的变量将通过 `webpack.DefinePlugin` 静态地嵌入到*客户端侧*的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥
>
> 被载入的变量将会对 `vue-cli-service` 的所有命令、插件和依赖可用。

一般包含如下键:

* `NODE_ENV`

* `VUE_APP_CUSTOM_ITEM`  (CUSTOM_ITEM 为自定义内容)
* `BASE_URL`



一般在根目录下设置的环境文件的取值:

| 文件               | 键          | 值            |
| ------------------ | ----------- | ------------- |
| `.env.development` | NODE_ENV    | 'development' |
| `.env.development` | VUE_APP_ENV | 'development' |
|                    |             |               |
| `.env.production`  | NODE_ENV    | 'production'  |
| `.env.production`  | VUE_APP_ENV | 'production'  |
|                    |             |               |
| `.env`             | NODE_ENV    | 'production'  |
| `.env`             | VUE_APP_ENV | 'production'  |







#### 2.1 环境文件会如何加载

> 为一个特定模式准备的环境文件 (例如 `.env.production`) 将会比一般的环境文件 (例如 `.env`) 拥有更高的优先级。
>
> `.env` 环境文件是通过运行 `vue-cli-service` 命令载入的，因此环境文件发生变化，你需要重启服务。
>
> Vue CLI 启动时已经存在的环境变量拥有最高优先级，并不会被 `.env` 文件覆写。



不同的运行模式下,会加载不同的环境文件.

Vue CLI文档中的'模式和环境变量'章节提到, 一个 Vue CLI 项目有三个模式:

| 模式        | 使用场景                                            | 会加载的文件     |
| ----------- | --------------------------------------------------- | ---------------- |
| development | `vue-cli-service serve`                             | .env.development |
| test        | `vue-cli-service test:unit`                         | .env.test        |
| production  | `vue-cli-service build`  `vue-cli-service test:e2e` | .env.production  |

通过传递 `--mode` 选项参数为命令行覆写默认的模式

```bash
vue-cli-service build --mode development
```

会在 development 模式下加载可能存在的 `.env`、`.env.development 和 `.env.development.local` 文件然后构建出生产环境应用。

而`vue-cli-service build` 会加载可能存在的 `.env`、`.env.production` 和 `.env.production.local` 文件然后构建出生产环境应用



> 当运行 `vue-cli-service` 命令时，所有的环境变量都从对应的[环境文件](https://cli.vuejs.org/zh/guide/mode-and-env.html#环境变量)中载入, 环境文件只包含环境变量的“键=值”对. 它的值将取决于模式，例如，在 `production` 模式下被设置为 `"production"`，在 `test` 模式下被设置为 `"test"`，默认则是 `"development"`。

> `NODE_ENV` 将决定您的应用运行的模式，是开发，生产还是测试，因此也决定了创建哪种 webpack 配置。



#### 2.2 package.json文件配置

```json
"scripts": {
  "serve": "vue-cli-service serve --open",
  "testing": "vue-cli-service build --mode testing",
  "build": "vue-cli-service build",
  "stage": "vue-cli-service build --mode staging",
}
```





#### 3. 实现代码

应用根目录解构:

```markdown
// 使用 tree-node-cli包生成文档结构图

// yarn tree -L 2 -I "node_modules"    //注意: 双引号. yarn安装yarn运行

vue2program
├── README.md
├── babel.config.js       
├── jsconfig.json
├── package-lock.json     
├── package.json
├── pages.development.json
├── pages.production.json 
├── pages.staging.json    
├── pages.testing.json    
├── public
│   ├── css
│   ├── favicon.ico       
│   ├── fonts
│   ├── images
│   └── index.html        
├── src
│   └── pagess
├── vue.config.js
├── yarn-error.log        
├── yarn.lock
```

`pages.development.json`是数组形式,里面有page文件夹下多个应用的信息,例如:

```json
//pages.development.json

{
  "pages": [
    {
      "name": "A1003504",
      "code": "YJZC",
      "author": "前台项目",
      "menuNumber": "A1001",
      "offLine": false,
      "appType": "customName",
      "title": "前台项目"
    },
     {
      "name": "A1003506",
      "code": "xzzrl",
      "author": "新装增容类",
      "menuNumber": "1003506",
      "offLine": false,
      "appType": "customName",
      "title": "新装增容类"
    },
    //...
  ]
}
```



```javascript
// vue.config.js

const {pages} = require(`./pages.${process.env.VUE_APP_ENV}.json`); //

const argPageNameStr = process.argv[process.argv.length - 1]
const argPageName = argPageNameStr.replace('--', '')
const pageModule = pages.find(page => page.name === argPageName)


let {name:pageName, menuNumber, isPureH5, title} = pageModule || {}

const dirs = fs.readdirSync(path.resolve("src/pagess"))


if (!dirs.includes(pageName)) {
  title = pages[0].title
  pageName = pages[0].pageName
  menuNumber = pages[0].menuNumber
  isPureH5 = pages[0].isPureH5 || false
}
const APPTYPE_NAME = (pageModule.appType = "igw" ? I2GW : W2SGW);
if (pageName === '') throw '请定义打包模块名称, 在pages.json里面'.magenta

console.table({
  隶属场景编号: pageName,
  隶属场景名称: pageModule.title,
  菜单号: menuNumber,
  应用类型: APPTYPE_NAME
})

```



涉及的nodejs API有:

`process.argv`

返回一个当nodejs进程启动时候传递进的命令行参数的数组. 一般使用最末位的自定义数据

例如: 执行命名 `yarn serve --development`后, 打印`process.argv`结果是:

```javascript
[
   'D:\\Program Files\\nodejs\\node.exe',
   'E:\\github\\vue2program\\node_modules\\@vue\\cli-service\\bin\\vue-cli-service.js',
  'serve',
   '--development'
 ]
```



`path.resolve('a')`

返回的是当前绝对路径拼接现在的参数/Users/xxxx/a



`fs.readdirSync`

该方法将返回一个包含“指定目录下所有文件名称”的数组对象。



```javascript
const path = require('path')

const dirs = fs.readdirSync(path.resolve("src/pagess"))
```





## CLI配置



### 设置publicPath和base

vue-router的base和vue.config.js的publicPath区别和联系

> [vue-router的base和vue.config.js的publicPath区别和联系_闲人不梦卿的博客-CSDN博客_vue-router base](https://blog.csdn.net/atu1111/article/details/121371310)



#### 只配置vue-router中的base配置

配置路由基准路径为app, vue.config.js配置文件的publicPath为相对路径

路由配置

```js
const router = new VueRouter({
  mode: 'history',
  base: '/app/',
  routes
})
```

vue.config.js

```js
module.exports = {
  publicPath: './',
  
  outputDir: 'dist',
  //...
}
```

用http-server(一个本地小型服务器插件),在dist路径下启动打包后的代码

访问`http://127.0.0.1:8080/app`发现, 访问不了页面

访问`http://127.0.0.1:8080`发现, 却可以访问页面

在dist下新建一个app目录,把dist下所有文件放到app下,这时候访问`http://127.0.0.1:8080/app`,可以访问到页面.



如果把 base: ‘/app’,改为base: ‘/’,并且和上面一样在dist下新增添一个app目录，把dist下文件放到app下。访问`http://127.0.0.1:8080 `路径，是访问不到页面的



总结：如果整个单页应用服务在 /app/ 下(可以理解为放在app文件夹下)，然后 base 就应该设为 “/app/”，这样设置之后，通过ip+端口/app，可以访问到页面，也即是项目基座路径就是/app,而且即是你不通过基准路径访问项目也可以，效果和通过基准路径是一样的。



#### 只设置publicPath

路由配置

```js
const router = new VueRouter({
  mode: 'history',
  base: '/',  //或者不设置应该也可以
  routes
})
```

publicPath设置

```js
module.exports = {
  publicPath: '/app',
  
  outputDir: 'dist',
  //...
}
```

配置路由基准路径为/相对路径,vue.config.js配置文件的publicPath为app。

访问`http://127.0.0.1:8080`发现, 访问不了页面.从服务器可以得知，静态资源文件都是在app下的，所以在dist下新增添一个app目录，把dist下文件放到app下，相当于一个文件的路径，可以发现项目会正常启动。

访问`http://127.0.0.1:8080`发现, 有内容但是不是应用的内容

访问`http://127.0.0.1:8080/app`发现, 可以正常访问

总结：如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 `https://www.my-app.com/app/`，则设置 publicPath 为 /app/。如果nginx，一般nginx都会配置一个静态资源目录，打包后的文件都会放到这个静态资源目录里面，nginx去做映射，所以publicPath这个属性基本不用改。’/'就行



#### 同时设置base和publicPath

路由配置

```js
const router = new VueRouter({
  mode: 'history',
  base: '/app',  //或者不设置应该也可以
  routes
})
```

publicPath设置

```js
module.exports = {
  publicPath: '/app',
  
  outputDir: 'dist',
  //...
}
```

访问`http://127.0.0.1:8080`发现, 有内容但是不是应用的内容.

把dist下文件放到app下

访问`http://127.0.0.1:8080/app`发现, 可以正常访问

 ???







### 在src中设置环境变量

既然在根目录有不同环境的变量文件, 为什么还要在内部`src/config`下设置3个对应的文件呢?

> 修改起来方便, 不需要重启项目, 符合开发习惯.  ??? 没什么感觉



src/config文件夹下目录结构:

```markdown
src/config
|---env.development.js
|---env.production.js
|---env.staging.js
|---env.testing.js
|---index.js
```



```javascript
//index.js
exprot const config = require('./env.' + process.env.VUE_APP_ENV)
```



```javascript
//env.development.js

// 是否开启安全交互平台
let onSecurity = false

export const config = {
  title: 'xxx',
  vconsole: 'on',
  appid: 'yxxsldkjf',
  baseUrlApi: '/api',
  timeout: 5000,
  //....
}
```

使用:

```javascript
// 根据环境不同会引入不同的变量

import {baseApi} from '$root/config'

console.log(baseApi)
```



```javascript
// src/common/request.js

import {Toast} from 'vant'
const isBrowser = window.navigator.platform === 'Win32' || window.navigator.platform === 'MacIntel'
import env from '$root.config'

export const request = function(url='', localMock, errorTips='数据获取失败') {
  const entryParam = {
    url: url,
    data: {}
  }
  
  
  
  return function(taskParam) {
    return new Promise((resolve, reject) => {
      let isConsole = env.vconsole === 'on'
      
      try {
        if (isBroweser) {
          resolve(localMock)
        } else {
          entryParam.data = taskParam
          
          if (isConsole) {
            console.log(
            	'🚀 ~ file: request.js ~ line 36 ~ returnnewPromise ~ interFaceParam',
              JSON.stringify(entryParam)
            )
          }
          
          uap2.ready(() => {
            uex2Core.request(JSON.stringify(entryParam), response => {
              if (isConsole) {
                console.log('🚀 ~ file: request.js ~ line 34 ~ uex2Core.request ~ response', entryParam.url, response)
              }
              
              if (response && response.code == 1 && response.data.data.rtnCode == 1) {
                resolve(resonse)
              } else {
                let msg = response.data ? repsonse.data.message : response.message
                Toast(message || errorTips)
                reject(response)
              }
            })
          })
        }
      } catch(err) {
        Toast(err)
        console.log('err', err)
      }
    })
  }
}
```







### 全局变量

`vue.config.js` 配置使用 `css.loaderOptions` 选项,注入 `sass` 的 `mixin` `variables` 到全局，不需要手动引入 ,配置`$cdn`通过变量形式引入 cdn 地址,这样向所有 Sass/Less 样式传入共享的全局变量：



```javascript
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const defaultSettings = require('./src/config/index.js')
module.exports = {
  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      // 给 scss-loader 传递选项
      scss: {
        // 注入 `sass` 的 `mixin` `variables` 到全局, $cdn可以配置图片cdn
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        prependData: `
                @import "$rootAssets/css/mixin.scss";
                @import "$rootAssets/css/variables.scss";
                $cdn: "${defaultSettings.$cdn}";
                 `
      }
    }
  }
}
```

设置 js 中可以访问 `$cdn`,`.vue` 文件中使用`this.$cdn`访问

```javascript
// 引入全局样式
import '$rootAssets/css/index.scss'

// 设置 js中可以访问 $cdn
// 引入cdn
import { $cdn } from '@/config'
Vue.prototype.$cdn = $cdn
```

在 css 和 js 使用

```html
<script>
  console.log(this.$cdn)
</script>
<style lang="scss" scoped>
  .logo {
    width: 120px;
    height: 120px;
    background: url($cdn+'/weapp/logo.png') center / contain no-repeat;
  }
</style>
```





### 配置别名

```javascript
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('$root', resolve(`src`))
      .set('$rootAssets', resolve(`src/assets`))
      .set('@', resolve(`src/pages/${pageName}`))
      .set('@native', resolve('src/native'))
      .set('@assets', resolve(`src/pages/${pageName}/assets`))
      .set('@api', resolve(`src/pages/${pageName}/api`))
      .set('@components', resolve(`src/pages/${pageName}/components`))
  }
}
```



### 配置代理

!!!注意：你还需要将 `src/config/env.development.js` 里的 `baseApi` 设置成 '/'**</u>???

```javascript
module.exports = {
  devServer: {
    // ....
    proxy: {
      //配置跨域
      '/api': {
        target: 'https://test.xxx.com', // 接口的域名
        // ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
```





### 配置 打包分析

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  chainWebpack: config => {
    // 打包分析
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
  }
}
```





### 去掉console.log

保留了测试环境和本地环境的 `console.log`

```bash
npm i -D babel-plugin-transform-remove-console
```

在babel.config.js中配置

```javascript
// 获取 VUE_APP_ENV 非 NODE_ENV，测试环境依然 console
const IS_PROD = ['production', 'prod'].includes(process.env.VUE_APP_ENV)
const plugins = [
  [
    'import',
    {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    },
    'vant'
  ]
]
// 去除 console.log
if (IS_PROD) {
  plugins.push('transform-remove-console')
}

module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'entry' }]],
  plugins
}
```





### splitChunks 单独打包第三方模块

```javascript
module.exports = {
  chainWebpack: config => {
    
    
    config.when(IS_PROD, config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // 将 runtime 作为内联引入不单独存在
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          // cacheGroups 下可以可以配置多个组，每个组根据test设置条件，符合test条件的模块
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3, //  被至少用三次以上打包分离
            priority: 5, // 优先级
            reuseExistingChunk: true // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          },
          node_vendors: {
            name: 'chunk-libs',
            chunks: 'initial', // 只打包初始时依赖的第三方
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          vantUI: {
            name: 'chunk-vantUI', // 单独将 vantUI 拆包
            priority: 20, // 数字大权重到，满足多个 cacheGroups 的条件时候分到权重高的
            test: /[\\/]node_modules[\\/]_?vant(.*)/
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
```

[▲ 回顶部](#top)

### 字体图标

全局 Svg Icon 图标组件。

默认在 @/icons 中注册到全局中，可以在项目中任意地方使用。所以图标均可在 @/icons/svg。可自行添加或者删除图标，所以图标都
会被自动导入，无需手动操作。

1. 使用方式

```html
<!-- icon-class 为 icon 的名字; class-name 为 icon 自定义 class-->
<svg-icon icon-class="password" class-name="custom-class" />
```

2. 改变颜色

svg-icon 默认会读取其父级的 color fill: currentColor;

你可以改变父级的 color 或者直接改变 fill 的颜色即可。

2. 使用外链

支持使用外链的形式引入 svg。例如：

```html
<svg-icon icon-class="https://xxxx.svg />
```

3. 大小  
   如果你是从 iconfont 下载的图标，记得使用如 Sketch 等工具规范一下图标的大小问题，不然可能会造成项目中的图标大小尺寸不
   统一的问题。

本项目中使用的图标都是 128\*128 大小规格的。





### 添加 IE 兼容 

之前的方式 会报 `@babel/polyfill` is deprecated. Please, use required parts of `core-js` and
`regenerator-runtime/runtime` separately

`@babel/polyfill` 废弃，使用 `core-js` 和 `regenerator-runtime`

```bash
npm i --save core-js regenerator-runtime
```

在 `main.js` 中添加

```javascript
// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

配置 `babel.config.js`

```javascript
const plugins = []

module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'usage', corejs: 3 }]],
  plugins
}
```





###  Eslint + Pettier 统一开发规范

VScode （版本 1.47.3）安装 `eslint` `prettier` `vetur` 插件 `.vue` 文件使用 vetur 进行格式化，其他使用`prettier`,后面会
专门写个如何使用配合使用这三个玩意

在文件 `.prettierrc` 里写 属于你的 pettier 规则

```bash
{
   "printWidth": 120,
   "tabWidth": 2,
   "singleQuote": true,
   "trailingComma": "none",
   "semi": false,
   "wrap_line_length": 120,
   "wrap_attributes": "auto",
   "proseWrap": "always",
   "arrowParens": "avoid",
   "bracketSpacing": false,
   "jsxBracketSameLine": true,
   "useTabs": false,
   "overrides": [{
       "files": ".prettierrc",
       "options": {
           "parser": "json"
       }
   }]
}
```

Vscode 设置

```bash
    {
  // 将设置放入此文件中以覆盖默认设置
  "files.autoSave": "off",
  // 控制字体系列。
  "editor.fontFamily": "Consolas, 'Courier New', monospace,'宋体'",
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  // 以像素为单位控制字号。
  "editor.fontSize": 16,
  // 控制选取范围是否有圆角
  "editor.roundedSelection": false,
  // 建议小组件的字号
  "editor.suggestFontSize": 16,
  // 在“打开的编辑器”窗格中显示的编辑器数量。将其设置为 0 可隐藏窗格。
  "explorer.openEditors.visible": 0,
  // 是否已启用自动刷新
  "git.autorefresh": true,
  // 以像素为单位控制终端的字号，这是 editor.fontSize 的默认值。
  "terminal.integrated.fontSize": 14,
  // 控制终端游标是否闪烁。
  "terminal.integrated.cursorBlinking": true,
  // 一个制表符等于的空格数。该设置在 `editor.detectIndentation` 启用时根据文件内容进行重写。
  // Tab Size
  "editor.tabSize": 2,
  // By default, common template. Do not modify it!!!!!
  "editor.formatOnType": true,
  "window.zoomLevel": 0,
  "editor.detectIndentation": false,
  "css.fileExtensions": ["css", "scss"],
  "files.associations": {
    "*.string": "html",
    "*.vue": "vue",
    "*.wxss": "css",
    "*.wxml": "wxml",
    "*.wxs": "javascript",
    "*.cjson": "jsonc",
    "*.js": "javascript"
  },
  // 为指定的语法定义配置文件或使用带有特定规则的配置文件。
  "emmet.syntaxProfiles": {
    "vue-html": "html",。。
    "vue": "html"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true
  },
  //保存时eslint自动修复错误
  "editor.formatOnSave": true,
  // Enable per-language
  //配置 ESLint 检查的文件类型
  "editor.quickSuggestions": {
    "strings": true
  },
  // 添加 vue 支持
  // 这里是针对vue文件的格式化设置，vue的规则在这里生效
  "vetur.format.options.tabSize": 2,
  "vetur.format.options.useTabs": false,
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatter.css": "prettier",
  "vetur.format.defaultFormatter.scss": "prettier",
  "vetur.format.defaultFormatter.postcss": "prettier",
  "vetur.format.defaultFormatter.less": "prettier",
  "vetur.format.defaultFormatter.js": "vscode-typescript",
  "vetur.format.defaultFormatter.sass": "sass-formatter",
  "vetur.format.defaultFormatter.ts": "prettier",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "aligned-multiple", // 超过150折行
      "wrap-line-length": 150
    },
    // #vue组件中html代码格式化样式
    "prettier": {
      "printWidth": 120,
      "tabWidth": 2,
      "singleQuote": false,
      "trailingComma": "none",
      "semi": false,
      "wrap_line_length": 120,
      "wrap_attributes": "aligned-multiple", // 超过150折行
      "proseWrap": "always",
      "arrowParens": "avoid",
      "bracketSpacing": true,
      "jsxBracketSameLine": true,
      "useTabs": false,
      "overrides": [
        {
          "files": ".prettierrc",
          "options": {
            "parser": "json"
          }
        }
      ]
    }
  },
  // Enable per-language
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "vetur.validation.template": false,
  "html.format.enable": false,
  "json.format.enable": false,
  "javascript.format.enable": false,
  "typescript.format.enable": false,
  "javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": false,
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "octref.vetur"
  },
  "emmet.includeLanguages": {
    "wxml": "html"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // 开启eslint自动修复js/ts功能
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "minapp-vscode.disableAutoConfig": true,
  "javascript.implicitProjectConfig.experimentalDecorators": true,
  "editor.maxTokenizationLineLength": 200000
}

```



### 兼容 uap 库

目录结构

```bash
├── src
│   ├── native
│   │   └── index.js
```

index.js 内全部为原生方法（部分和原生无关 供全局调用的方法）

调用方式

```vue
//eg: 返回上一页
<script>
export default {
  methods: {
    prev() {
      this.$native._previousPage()
    }
  }
}
</script>
```

注： 关于根目录下的 uap





## 其它

### 生产环境中如何开启devtools

> [vue 生产环境开启 vue-devtools - dongweiq - 博客园 (cnblogs.com)](https://www.cnblogs.com/dongweiq/p/16477183.html)
>
> [生产环境如何开启 devtools vue2/vue3_「已注销」的博客-CSDN博客](https://blog.csdn.net/xxcmyh/article/details/121498959)
>
> [生产环境调用vue devtool的脚本 - 掘金 (juejin.cn)](https://juejin.cn/post/6979255974959775757)



#### 1.不修改代码

打开浏览器开发面板, 浏览器sources中的js文件, 一般是app开头文件, 









#### 2.修改代码

##### 2.1 修改main.js

```js
//main.js
import ** from 'xxx/xxx'
Vue.config.devtools = true

new Vue({
  //....
})
```

##### 2.2 

F12打开控制台，Console下复制粘贴上面代码，敲下回车，关闭控制台，再次打开就看到熟悉的vue tab了

```js
var Vue, walker, node;
walker = document.createTreeWalker(document.body,1);
while ((node = walker.nextNode())) {
  if (node.__vue__) {
    Vue = node.__vue__.$options._base;
    if (!Vue.config.devtools) {
      Vue.config.devtools = true;
      if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit("init", Vue);
        console.log("==> vue devtools now is enabled");
      }
    }
    break;
  }
}
```



##### 2.3

> [Vue 生产环境打开 devtools 的两种方法_如果有了可惜的博客-CSDN博客](https://blog.csdn.net/jufjzq/article/details/121263030)

```js
// 控制台
__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init', (app.__vue__.__proto__.__proto__.constructor.config.devtools = true) && app.__vue__.__proto__.__proto__.constructor)
```

