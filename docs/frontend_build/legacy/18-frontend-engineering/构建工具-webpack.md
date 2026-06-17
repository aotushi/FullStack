## webpack快速入门教程

### 1、webpack 介绍

* 什么是webpack<https://www.webpackjs.com/>
  * Webpack是一个模块打包器(bundler)
  * 在Webpack看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理
  * 它将根据模块的依赖关系进行静态分析，生成对应的静态资源
* 五个核心概念
  * Entry：入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
  * Output：output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件
  * Loader：loader 让 webpack 能够去处理那些非 JavaScript 文件
  * Plugins：插件则可以用于执行范围更广的任务。例如：打包优化、压缩
  * Mode：模式，有生产模式 production 和开发模式 development 
* 理解 Loader
  * Webpack 本身只能加载 JS/JSON 模块，如果要加载其他类型的文件(模块)，就需要使用对应的loader 进行转换/加载
  * Loader 本身也是运行在 node.js 环境中的 JavaScript 模块
  * loader 一般以 xxx-loader 的方式命名，xxx 代表了这个 loader 要做的转换功能，比如 less-loader。
* 理解 Plugins
  * 插件可以完成一些loader不能完成的功能。
  * 插件的使用一般是在 webpack 的配置信息 plugins 选项中指定。
* 配置文件(默认)
  * webpack.config.js : 是一个node模块，返回一个 json 格式的配置信息对象

### 2、webpack 安装

* npm 初始化
* 安装 webpack
  * npm install webpack@4  webpack-cli@3  -g  //全局安装,作为指令使用
  * npm install webpack@4 webpack-cli@3 -D //本地安装,作为本地依赖使用

### 3、编译打包应用

* 创建js文件

  * src/js/app.js
  * src/js/module1.js
  * src/js/module2.js
  * src/js/module3.js

* 创建json文件

  * src/json/data.json  

* 创建主页面: 

  * src/index.html

* 运行指令

  * 开发配置指令

    ```shell
    webpack src/js/app.js -o build/js/app.js --mode=development
    ```

    > webpack 能够编译打包 js 和 json 文件，并且能将 es6 的模块化语法转换成浏览器能识别的语法

  * 生产配置指令

    ```shell
    webpack src/js/app.js -o build/js/app.js --mode=production
    ```

    >  production 配置能够压缩代码

* 结论：

  * webpack能够编译打包 js 和 json 文件
  * 能将 es6 的模块化语法进行代码打包  //Chrome浏览器能识别es6语法
  * 能压缩代码

* 缺点：

  * 不能编译打包 css、img 等文件
  * 不能将 js 的 es6 基本语法转化为 es5 语法 
  * 打包命令复杂



局部安装后 

```
npx webpack 旧路径 -o 新路径

node ./node_modules/webpack/bin/webpack.js 旧路径 -o 新路径 

卸载全局中的webpack包: node uninstall webpack -g 

推荐使用局部安装,为了工作环境统一.

使用import导入json后,自动转换成JS对象
```



### 新增



#### 引入css模块

```
在webpack入口JS文件中引入css模块
import "../css/app.css";
```



#### 打包css文件

```js
//先后顺序,在config.js中先写style再写css
style-loader css-loader


1.安装loader
 npm i css-loader style-loader -D
2.修改webpack.config.js配置文件
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }]
    }
3.运行打包命令 npx webpack //页面中没有生成style标签
```









### 4、使用 webpack 配置文件

* 目的：在项目根目录定义配置文件，通过自定义配置文件，还原以上功能

* 文件名称：webpack.config.js

* 文件内容：

  ```js
  //node内置核心模块，用来设置路径。
  const { resolve } = require('path');
  //只能使用 CommonJS 规范暴露
  module.exports = {
    // 入口文件配置
    entry: './src/js/app.js',   			
    // 输出配置
    output: {         
      // 输出文件名
      filename: './js/built.js',    
      //输出文件路径配置
      path: resolve(__dirname, 'build')   //路径需要写成相对路径.如果绝对,则以绝对路径为准(斜杠)
    },
    // development 与 production 开发环境(二选一)
    mode: 'development'  ,
    module:{
        rules:[{
            test:/\.css$/,
            use:[
            		'style-loader',
            		'css-loader'
        ]
        ]
    }
  };
  ```

* 运行指令： webpack

### 5、打包 less 资源

less 文件 webpack 不能解析，需要借助 loader 编译解析，使用步骤如下：

1. 创建less文件

  * src/css/test1.less
  * src/css/test2.less

2. 入口app.js文件

  ```js
//引入两个 less 文件
import '../css/test1.less';
import '../css/test2.less';
  ```

3. 安装 loader

  ```shell
npm install css-loader style-loader less-loader less --save-dev //-D
  ```

4. webpack.config.js 配置 loader

   ```js
   module.exports = {
       .
       .
       .
       module:{
           rules:[
               {
                   test:/\.less$/,  		// 检查文件是否以.less结尾（检查是否是less文件）
                   use:[					// 数组中loader执行是从下到上，从右到左顺序执行
                       'style-loader', 	// 创建style标签，添加上js中的css代码
                       'css-loader', 		// 将css以commonjs方式整合到js文件中
                       'less-loader' 		// 将less文件解析成css文件
                   ]
               }
           ]
       },
   }
   ```

5. 运行指令

   ```shell
   > webpack
   ```

### 6、JS 语法检查

 ESLint（<https://eslint.bootcss.com/>） 能对 JS 基本语法错误/隐患进行提前检查，使用步骤

1. 安装loader

   ```shell
   npm install eslint-loader eslint --save-dev
   ```

   > eslint 是语法检查的包
   >
   > eslint-loader 是 eslint 在 webpack 中的 loader 包

2. webpack.config.js 配置 loader

   ```js
   module.exports = {
       .
       .
       .
       module: {
           rules: [
       		.
       		.
       		.
               {
                   test: /\.js$/,                  //只检测js文件
                   exclude: /node_modules/,        //排除node_modules文件夹
                   enforce: "pre",                 //提前加载使用 第一位的
                   use: {                          
                       loader: "eslint-loader"		//使用eslint-loader解析
                   }
               }
           ]
       }
   }
   ```

   

3. 创建 `.eslintrc` 文件 //项目的根目录 

   ```js
   {
       "parserOptions": {
           "ecmaVersion": 6, 				// 支持es6
           "sourceType": "module"			// 使用es6模块化
       },
       "env": { 							// 设置环境
           "browser": true,   				// 支持浏览器环境： 能够使用window上的全局变量
           "node": true       				// 支持服务器环境:  能够使用node上global的全局变量
       },
       "globals": {						// 声明使用的全局变量, 这样即使没有定义也不会报错了
           "$": "readonly"					// $ 不允许重写变量
       },
       "rules": {  						// eslint检查的规则  0 忽略 1 警告 2 错误
           "no-console": 0, 				// 不允许出现 console
           "eqeqeq": 0,					// 必须使用 === 
           "no-alert": 0 					// 不能使用 alert
       },
       "extends": "eslint:recommended" 	// 使用eslint推荐的默认规则
   }
   ```

4. 运行指令

   ```shell
   > npx webpack
   ```

### 7、JS 语法转换

```
https://eslint.bootcss.com/  检查语法含义
```



借助 Babel 可以将浏览器不能识别的新语法（ES6, ES7）转换成原来识别的旧语法（ES5），浏览器兼容性处理

1. 安装loader

   ```shell
   > npm install babel-loader @babel/core @babel/preset-env --save-dev
   ```

   > @babel/core  是 babel 的核心库
   >
   > @babel/preset-env  是 babel 的预设的工具包，默认可以将所有最新的语法转为为 ES5
   >
   > babel-loader   是 babel 在 webpack 中的 loader 包

2. 配置loader

   ```js
   module: {
     rules: [
       .
       .
       .
       {
         test: /\.js$/,
         exclude: /node_modules/,
         use: {
           loader: "babel-loader",
           options: {
             presets: ['@babel/preset-env']
           }
         }
       }
   ]
   }
   ```

3. 运行指令

  ```
> webpack	
  ```

  

### 8、JS 兼容性处理

Polyfill 是一块代码（通常是 Web 上的 JavaScript），用来为旧浏览器提供它没有原生支持的较新的功能

1. 安装 polyfill

   ```shell
   > npm install @babel/polyfill
   ```

2. app.js（入口文件）引入

   ```js
   import '@babel/polyfill';
   ```

> 解决 babel 只能转换语法的问题(如：let/const/解构赋值...)，引入polyfill可以转换高级语法(如:Promise...)



### 9、打包样式文件中的图片资源

图片文件 webpack 不能解析，需要借助 url-loader编译解析

1. 两张资源图片:

   * 小图, 小于8kb: src/images/vue.png
   * 大图, 大于8kb: src/images/react.jpg

2. 在 less 文件中通过背景图的方式引入图片

   ```css
   .react {
     width: 200px;
     height: 200px;
     background: url('../images/react.png') no-repeat;
     background-size: cover;
   }
   
   .vue {
     width: 200px;
     height: 200px;
     background: url('../images/vue.png') no-repeat;
     background-size: cover;
   }
   ```

3. 安装 loader

  ```shell
> npm install file-loader url-loader --save-dev 
  ```

  > 补充：url-loader是对象file-loader的上层封装，使用时需配合file-loader使用。

4. webpack.config.js 配置 loader

   ```js
   module.exports = {
       .
       .
       .
       module: {
           rules: [
               .
               .
       		.
               {
                   test: /\.(png|jpg|gif)$/,
                   use: {
                       loader: 'url-loader',
                       options: {
                           limit: 8192,               		// 8kb以下的图片会 base64 处理
                           outputPath: 'images',           // 文件本地输出路径 总输出文件夹下的images文件夹
                           publicPath: '../build/images',   // 图片的url路径的前缀
                           name: '[hash:8].[ext]',         // 修改文件名称和后缀 
                       }
                   }
               },
           ]
       }
   
   }
   ```

5. 运行指令

   ```shell
   > webpack
   ```

   

### 10、打包 HTML 文件

 HTML 文件不能直接被 webpack 解析，需要借助 `HtmlWebpackPlugin` 插件编译解析

1. 在 src 目录下创建 index.html 文件，==注意不要在 HTML 中引入任何 CSS 和  JS  文件==

2. 安装插件 

   ```shell
   > npm install html-webpack-plugin --save-dev 
   ```

3. webpack.config.js 修改配置

   ```js
   // 插件都需要手动引入
   const HtmlWebpackPlugin = require('html-webpack-plugin');
   .
   .
   module.exports = {
       .
       .
       mode: 'development',
       .
       .
       .
       plugins: [
           new HtmlWebpackPlugin({
               template: './src/index.html', // 设置要编译的 HTML 源文件路径
           })
       ]
   }
   ```

4. 运行指令

   ```
   > webpack
   ```

> src 目录就是源文件目录，所有的代码和资源都保存在该目录，index.html 也是如此

### 11、打包 HTML 中图片资源

url-loader 只能处理 JS 和 CSS 中引入的图片，无法处理 HTML 中的 img 图片，需要 html-loader 处理。

1. src/index.html 添加 img 标签

  ```html
<img src="./images/sun.jpg" alt="">
  ```

2. 安装loader

   ```shell
   > npm install html-loader --save-dev 
   ```

3. 配置loader

   ```js
   module.exports = {
       .
       .
       .
       module: {
           rules: [
               .
               .
               .
               {
                   test: /\.(html)$/,
                   use: {
                       loader: 'html-loader'
                   }
               },
           ]
       }
   }
   ```

4. 运行指令

   ```
   > webpack
   ```

### 12、打包字体资源

字体文件需要借助 file-loader 编译解析，以 iconfont 为例，下载一个项目

1. 将字体文件保存在 `src/fonts` 目录下

  * src/fonts/iconfont.eot
  * src/fonts/iconfont.svg
  * src/fonts/iconfont.ttf
  * src/fonts/iconfont.woff
  * src/fonts/iconfont.woff2

2. 创建 src/css/iconfont.less 并将 iconfont 的 css 样式粘到 less 文件中，并修改字体路径

   ```css
   @font-face {
     font-family: 'iconfont';
     src: url('../fonts/iconfont.eot');
     src: url('../fonts/iconfont.eot?#iefix') format('embedded-opentype'),
         url('../fonts/iconfont.woff2') format('woff2'),
         url('../fonts/iconfont.woff') format('woff'),
         url('../fonts/iconfont.ttf') format('truetype'),
         url('../fonts/iconfont.svg#iconfont') format('svg');
   }
   
   .iconfont {
     font-family: "iconfont" !important;
     font-size: 16px;
     font-style: normal;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   }
   ```

3. 修改 `src/index.html`

   ```html
   <span class="iconfont">&#xe8ab;</span>
   ```

4. 配置 loader

   ```js
   module.exports = {
       .
       .
       .
       module: {
           rules: [
               .
               .
               .
               {
                   test: /\.(eot|svg|woff|woff2|ttf|mp3|mp4|avi)$/,  // 处理字体文件
                   loader: 'file-loader',
                   options: {
                     outputPath: 'fonts',
                     name: '[hash:8].[ext]'
                   }
               },
           ]
       }
   }
   ```

5. 运行指令

   ```shell
   > webpack
   ```

   


### 13、自动编译打包运行

之前的操作，每次修改代码都需要重新执行 webpack 命令，可以使用 webpack-dev-server 自动打包运行

1. 安装 loader

   ```shell
   > npm install webpack-dev-server -g
   ```

2. 详细配置见官网  <https://www.webpackjs.com/configuration/dev-server/>

3. 修改 webpack.config.js

   ```js
   .
   .
   .
   module.exports = {
       .
       output: {
           path: resolve(__dirname, 'build'),
           filename: 'js/app.js',
           //1. 添加 devServer 服务后需要调整输出的路径
           publicPath: '/'
       },
       module: {
           rules: [
               .
               .
               .
               {
                   test: /\.(png|jpg|gif)$/,
                   use: {
                       loader: 'url-loader',
                       options: {
                           limit: 8192,               		
                           outputPath: 'images',           
                           name: '[hash:8].[ext]',       
               			//2. 删除 publicPath 配置
                       }
                   }
               },
               
   
           ]
       },
       .
       .
       //3. 增加 devServer 配置
       devServer: {
           open: true, 	// 自动打开浏览器
           compress: true, // 启动gzip压缩
           port: 3000, 	// 端口号
       },
       mode: 'development'
   }
   ```

4. 现在就可以启动服务

   ```shell
   > webpack-dev-server
   ```

  ```
5. 配置 package.json 中 scripts 指令。增加 server 配置
  
   ```json
   {
      .
      .
      .
      "scripts": {
           "server": "webpack-dev-server" 
       },
      .
      .
      .
    }
    
  ```

6. 运行指令

   ```shell
   > npm run server 
   ```

   


### 14、热模替换功能

模块热替换 (HMR - Hot Module Replacement) 功能会在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面，详细配置地址（<https://www.webpackjs.com/guides/hot-module-replacement/>）

修改 webpack.config.js 的 devServer 配置

```js
.
.
.
module.exports = {
    //index.html 不能自动刷新的解决方法
    //新增一个入口，解决开启热模块替换后首页无法刷新的问题
    entry: {
        main:['./src/js/app.js','./src/index.html']
    },
    .
    .
    .
    devServer: {
        open: true, 	
        compress: true, 
        port: 3000, 	
        hot: true		// 开启热模块替换功能
    },
    mode: 'development'
}
```



### 15、devtool

devtool 配置控制 source-map 的生成 , 可以将压缩/编译文件中的代码映射回源文件中的原始位置，便于调试代码

详细配置官网地址 <https://www.webpackjs.com/configuration/devtool/>

配置 webpack.config.js 

```js
.
.
.
module.exports = {
    .
    .
    .
    devtool:  'cheap-module-eval-source-map', //设置 devtool 策略
    mode: 'development'
}
```

推荐使用：

* 开发环境： cheap-module-eval-source-map
* 生产环境： none        

### 16、准备生产环境

webpack 可以使用不同的配置文件，进行不同的编译。

1. 创建文件夹 config，将 webpack.config.js 复制两份

   * ./config/webpack.dev.js
   * ./config/webpack.prod.js

2. 修改 webpack.prod.js 配置，删除 webpack-dev-server 配置

   ```js
   .
   .
   .
   module.exports = {
       entry: {
           main:['./src/js/app.js','./src/index.html']
       },
       //出口配置
       output: {
           path: resolve(__dirname, '../build'), //0. 出口目录配置
           filename: 'js/bundle.js',
           publicPath: '/'
       },
       .
       .
       .
       //1. 设置 devtool
       devtool: 'none',
       //2. 设置 mode
       mode: 'production'
       //3. 删除 devServer 配置
   }
   ```

3. 修改 package.json 的指令

  ```json
{
	.
	.
	.
	"scripts": {
        "dev": "webpack-dev-server --config ./config/webpack.dev.js",
        "build": "webpack --config ./config/webpack.prod.js"
    }
    .
    .
    .
}
  ```

4. 开发环境指令

  * npm run dev   		用于开发环境   不打包文件
  * npm run build        用于生产环境    打包文件 （==打包后的index.html不能直接双击打开，需要启动服务==）

### 17、清除打包文件目录

每次打包生成了文件，都需要手动删除，引入插件 `clean-webpack-plugin` 帮助我们自动删除上一次生成的文件

1. 安装插件

   ```shell
   > npm install clean-webpack-plugin --save-dev
   ```

2. `webpack.prod.js` 引入插件

   ```js
   //1. 引入插件
   const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 
   .
   .
   .
   module.exports = {
       .
       .
       .
       plugins: [
           new HtmlWebpackPlugin({
               template: './src/index.html', 
           }),
           //2. 配置插件 自动删除输出的打包目录
           new CleanWebpackPlugin() 
       ],
   }
   ```

3. 运行指令

   ```shell
   > npm run build
   ```

### 18、提取 CSS 成单独文件

前面的 CSS 样式代码都是放在 style 标签中，这里可以借助 mini-css-extract-plugin 抽离 CSS 文件

1. 安装插件

   ```shell
   > npm install mini-css-extract-plugin --save-dev 
   ```

2. 配置 webpack.prod.js

  ```js
.
.
// 1. 引入插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    .
    .
    .
    module: {
        rules: [
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,   	// 2. 修改配置 loader
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    plugins: [
        .
        .
        new MiniCssExtractPlugin({					// 3. 配置插件
            filename: "css/[hash:8].css",
        })
    ]
    .
    .
}
  ```

3. 运行指令

   ```
   > webpack
   ```

### 19、添加 CSS 兼容

1. 安装 loader

```shell
> npm install postcss-loader autoprefixer --save-dev 
```

2. webpack.prod.js 配置 loader

```js
.
.
.
module.exports = {
   	.
    .
    module: {
        rules: [
            {
                test: /\.less$/, 
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader', // 1. 设置 postcss-loader
                    'less-loader',
                ]
            },
            .
            .
        ]
    }
    
}
```

3. 在项目根目录下添加 postcss.config.js 配置文件

```js
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```

4. 在项目目录下创建 `.browserslistrc`  ==这里一要加目标浏览器设置==

```con
chrome 50
last 1 versions
ie 10
iOS 7
```

5. 运行指令：

```shell
> npm run build
```



### 20、压缩 CSS

1. 安装插件

   ```shell
   > npm install optimize-css-assets-webpack-plugin --save-dev 
   ```

2. 引入插件，配置插件

   ```js
   //1. 引入插件
   const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
   
   module.exports = {
   
       plugins: [
           .
           .
           .
           //2. 配置插件
           new OptimizeCssAssetsPlugin()
       ],
       mode: 'production'
   }
   ```

3. 运行指令

   ```shell
   > npm run build
   ```


## 附录

### browserslist 

browserslist 目标浏览器配置表，可以针对目标浏览器进行编译处理，避免不必要的兼容代码

配置的方法有两种，一种是在 package.json 中，一种是创建 `.browserslistrc`

package.json 形式

```json
{
	.
	.
	.
	"browserslist": [
        "> 1%",
        "last 2 versions"
    ]
}
```

`.browserslistrc` 形式

```
> 1%
last 2 versions
```

配置规则介绍

| 规则                   | 介绍                                                  |
| ---------------------- | ----------------------------------------------------- |
| > 1%                   | 全球超过1%人使用的浏览器                              |
| > 5% in US             | 指定国家使用率覆盖                                    |
| last 2 versions        | 所有浏览器兼容到最后两个版本根据CanIUse.com追踪的版本 |
| Firefox > 20           | 指定浏览器的版本范围                                  |
| not ie <=8             | 排除 ie8 及以下                                       |
| Firefox 12.1           | 指定浏览器的兼容到指定版本                            |
| since 2013             | 2013年之后发布的所有版本                              |
| not dead with > 0.2%   | 仍然还在使用且使用率大于 0.2%                         |
| last 2 Chrome versions | 最新的两个 Chrome 配置                                |
| cover 99.5%            | 99.5% 的浏览器都是目标                                |



## 具体API

### require.context

> https://webpack.js.org/guides/dependency-management/#requirecontext
>
> https://webpack.docschina.org/guides/dependency-management/#requirecontext
>
> https://blog.csdn.net/weixin_45622540/article/details/107505732

**syntax**

> the arguments must be literals

require.context函数接受三个参数(没错官网就是这么写的,虽然实际上是4个)

directory {String} -读取文件的路径

useSubdirectories {Boolean} -是否遍历文件的子目录

regExp {RegExp} -匹配文件的正则

```javascript
require.context(
  //组件目录的相对路径
	directory,
  //是否查询子目录
  (useSubdirectories = true),
  //匹配基础组件文件名的正则表达式
  (regExp = /^\.\/.*$/),
  //是否异步加载
  (mode = 'sync')
)

//example
require.context('./text', false, /\.test\.js$/);


```

#### API

require.context()结果是一个函数, 有3个属性: 

* `resolve` 是一个函数并返回解析request的模块id
* `keys` 是一个函数,返回匹配成功模块的名字组成的数组
* `id` 上下文模块的模块. ???



执行了keys方法返回了一个由匹配文件的文件名组成的数组
id属性返回了匹配的文件夹的相对于工程的相对路径,是否遍历子目录,匹配正则组成的字符串

对于resolve方法可以看到它是一个函数接受req参数,经过实践我发现这个req参数的值是keys方法返回的数组的元素,接着我们传入其中一个元素执行resolve函数 resolve方法返回了一个字符串代表着传入参数的文件相对于整个工程的相对路径



同时返回值作为一个函数,也接受一个req参数,这个和resolve方法的req参数是一样的,即匹配的文件名的相对路径,而files函数返回的是一个模块,


```javascript
//store/index.js

const moduleFIles = require.context('./modules', true, /\.js$/)
const modules = moduleFiles.keys().reduce((modules, modulePath) => {
  let moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  //处理多层文件
  if (moduleName.includes('/')) {
    let moduleNameParts = moduleName.split('/')
    for (let idx=1,len=moduleNameParts.length; idx<len; idx++) {
      const item = moduleNameParts[idx]
      moduleNameParts[idx] = item.slice(0, 1).toUpperCase() + item.slice(1)
    }
    moduleName = moduleNamePargs.join('')
  }
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
```



看下返回值

```js
在main.js中打印
//const moduleFiles = require.context('./components', true, /\.(vue|js)$/);
//console.log('moduleFiles', moduleFiles)


var map = {
	"./Alert/index.js": "./src/components/Alert/index.js",
	"./Avatar/index.vue": "./src/components/Avatar/index.vue",
	"./Bottom/index.vue": "./src/components/Bottom/index.vue",
	"./Confirm/index.js": "./src/components/Confirm/index.js",
	"./Gender/index.vue": "./src/components/Gender/index.vue",
	"./Header/index.vue": "./src/components/Header/index.vue",
	"./Message/Status.vue": "./src/components/Message/Status.vue",
	"./Message/index.vue": "./src/components/Message/index.vue",
	"./Toast/index.js": "./src/components/Toast/index.js",
	"./arrow/index.vue": "./src/components/arrow/index.vue",
	"./input-sumbit/index.vue": "./src/components/input-sumbit/index.vue",
	"./input/index.vue": "./src/components/input/index.vue",
	"./loading-over/loading.js": "./src/components/loading-over/loading.js",
	"./loading/loading.js": "./src/components/loading/loading.js",
	"./photo-viewer/index.js": "./src/components/photo-viewer/index.js",
	"./photo-viewer/vue-picture-preview.vue": "./src/components/photo-viewer/vue-picture-preview.vue",
	"./searchBar/index.vue": "./src/components/searchBar/index.vue",
	"./svg-modal/index.js": "./src/components/svg-modal/index.js",
	"./svg-modal/index.vue": "./src/components/svg-modal/index.vue",
	"./svg-modal/svg.js": "./src/components/svg-modal/svg.js",
	"./userHead/index.vue": "./src/components/userHead/index.vue"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/components sync recursive \\.(vue|js)$";
```



```js
//讲components文件夹中的组件全部注册到Vue公共组件中

moduleFiles.keys().forEach(fileName => {
  let str = fileName.match(/(\w+)\.(vue)$/)[1]
  let [first, ...rest] = str
  let str2 = [first.toUpperCase(), ...rest].join(',')
  Vue.component(str, moduleFiles[fileName])
})
```





### 代理

#### vue设置proxy代理，如何去查看代理地址

> 两种方法
>
> [vue设置proxy代理，如何去查看代理地址_qq_37322135的博客-CSDN博客_配置了proxy情况下查看真实的接口调用地址](https://blog.csdn.net/qq_37322135/article/details/126721935)

第一种，终端查看，需要在vue.config.js中代理中设置logLeve: ‘debug’,这样在代理接口请求之后终端会有显示真实的接口地址

```js
'/api': {
  target: 'xxx',
  changeOrigin: true,
  logLevel: 'debug',
  xfwd: true,
  pathRewrite: {
    "^/api": "/"
  }
       
}
```

第二种，dev-server的proxy有两个事件“onProxyReq”，“onProxyRes”，onProxyReq:可以在请求发送前对请求内容进行更改.

```js
'/api': {
  target: 'xxx',
  changeOrigin: true,
  logLevel: 'debug',
  xfwd: true,
  pathRewrite: {
    "^/api": "/"
  },
  onProxyReq: (proxyRes, req, res) => {
    console.log(req.url)
  }
       
}
```

