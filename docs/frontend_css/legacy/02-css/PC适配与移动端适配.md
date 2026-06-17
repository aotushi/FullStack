
# PC适配


### 媒体查询

#### 是什么
通过css的@media、link的meida属性可以针对不同的屏幕大小使用对应的样式。通常用来特殊处理，适配不同屏幕，比如屏幕较小时隐藏侧边栏等

通常会有几个分割点，区分不同屏幕大小。常见分割方案如下

* <=600px， <=900px，<=1200px， <=1800px，>1800px
* <=480px，<=800px， <=1400px， >1400
* <768px（超小屏幕-手机），>=768px（小屏幕-平板），>=992px（桌面端），>=1200px（大屏）

TIP: 不管是移动优先还是PC优先，都是依据当随着屏幕宽度增大或减小的时候，后面的样式会覆盖前面的样式。因此，<span style="color:blue;">移动端优先首先使用的是min-width，PC端优先使用的max-width</span> ???

#### 使用方式
* css的@meida
```css
@media screen and (max-width: 1400px) {
	.home {
		width: 80%;
		font-size: 14px;
	}
}

@media screen and (max-width: 900px) {
	.home {
		width: 100%;
		font-size: 10px;
	}

}
```
* link的media属性
```html
< link rel="stylesheet" media="(max-width: 1400px)" href="pc.css" />
< link rel="stylesheet" media="(max-width: 900px)"  href="laptop.css" />
```


#### 样式案例
**通用样式**
```css
设备范围
    默认样式    注意：默认样式要写在最前面
    /* 打印样式 */
        @media print {}
    /* 手机等小屏幕手持设备 */
        @media screen and (min-width: 320px) and (max-width: 480px) {}
    /* 平板之类的宽度 1024 以下设备 */
        @media only screen and (min-width: 321px) and (max-width: 1024px) {}
    /* PC客户端或大屏幕设备: 1028px 至更大 */
        @media only screen and (min-width: 1029px) {}
    /* 竖屏 */
        @media screen and (orientation:portrait) {对应样式}
    /* 横屏 */
        @media screen and (orientation:landscape){对应样式}
```

**移动优先**
```css
/* iphone6 7 8 */
body {
    background-color: yellow;
}
/* iphone 5 */
@media screen and (max-width: 320px) {
    body {
      background-color: red;
    }
}
/* iphoneX */
@media screen and (min-width: 375px) and (-webkit-device-pixel-ratio: 3) {
    body {
      background-color: #0FF000;
    }
}
/* iphone6 7 8 plus */
@media screen and (min-width: 414px) {
    body {
      background-color: blue;
    }
}
/* ipad */
@media screen and (min-width: 768px) {
    body {
      background-color: green;
    }
}
/* ipad pro */
@media screen and (min-width: 1024px) {
    body {
      background-color: #FF00FF;
    }
}
/* pc */
@media screen and (min-width: 1100px) {
    body {
      background-color: black;
    }
}

```

**PC优先**
```css
/* pc width > 1024px */
    body {
        background-color: yellow;
    }
/* ipad pro */
@media screen and (max-width: 1024px) {
    body {
        background-color: #FF00FF;
    }
}
/* ipad */
@media screen and (max-width: 768px) {
    body {
        background-color: green;
    }
}
/* iphone6 7 8 plus */
@media screen and (max-width: 414px) {
    body {
        background-color: blue;
    }
}
/* iphoneX */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 3) {
    body {
        background-color: #0FF000;
    }
}
/* iphone6 7 8 */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 2) {
    body {
        background-color: #0FF000;
    }
}
/* iphone5 */
@media screen and (max-width: 320px) {
    body {
        background-color: #0FF000;
    }
}

```

#### 布局案例: 媒体查询+rem
```css
html{
   font-size:19.20px;  /*默认以设计稿为基准,将设计稿除100*/
   //1rem = 19.20px
}
@media only screen and (max-width: 1366px) {
	 //1rem = 13.66px;
   html{
      font-size:13.66px;
   }
}
#test{
   width:14.21875rem;
}

```


优点: 面对不同分辨率设备灵活性强,  能够快捷解决多设备显示适应问题
缺点:
* 只能在选取的几个主流设备尺寸下呈现完美适配，
* 用户体验也不友好，布局在响应断点范围内的分辨率下维持不变，而在响应断点切换的瞬间，布局带来断层式的切换变化
* 代码累赘 工作量大 效率低 加载时间长
* 一定程度上改变了原有的网站结构

#### 兼容性
除了 ie 大部分浏览器都支持
![[Pasted image 20231003161642.png]]


### 百分比
#### 是什么
根据比值来计算, 一个元素在原设计稿里，量出来距离顶部是200px，如果写死可能是`top:200px` 或者`margin-top:200px`,现在要转成百分比，那么这个值可能就是`23.3%`。这个值怎么算？如果设计稿是1080，`200/1080=18.51%`这样计算出来百分比的值。

#### 设计方法
设计方法：使用%百分比定义宽度，高度大都是用px来固定住，可以根据可视区域 (viewport) 和父元素的实时尺寸进行调整，尽可能的适应各种分辨率。往往配合 max-width/min-width 等属性控制尺寸流动范围以免过大或者过小影响阅读。

注意事项:
>子元素height和width/ top和bottom 、left和right的百分比是相对于父元素width，height
子元素的padding/margin 不论是垂直方向或者是水平方向，都相对于直接父亲元素的width，而与父元素的height无关。



#### 案例1
```css
/* pc width > 1100px */
html, body { margin: 0;padding: 0;width: 100%;height: 100%;}
aside {
    width: 10%;
    height: 100%;
    background-color: red;
    float: left;
}
main {
    height: 100%;
    background-color: blue;
    overflow: hidden;
}
/* ipad pro */
@media screen and (max-width: 1024px) {
    aside {
      width: 8%;
      background-color: yellow;
    }
}
/* ipad */
@media screen and (max-width: 768px) {
    aside {
      float: none;
      width: 100%;
      height: 10%;
      background-color: green;
    }
    main {
      height: calc(100vh - 10%);
      background-color: red;
    }
}
/* iphone6 7 8 plus */
@media screen and (max-width: 414px) {
    aside {
      float: none;
      width: 100%;
      height: 5%;
      background-color: yellow;
    }
    main {
      height: calc(100vh - 5%);
      background-color: red;
    }
}
/* iphoneX */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 3) {
    aside {
      float: none;
      width: 100%;
      height: 10%;
      background-color: blue;
    }
    main {
      height: calc(100vh - 10%);
      background-color: red;
    }
}
/* iphone6 7 8 */
@media screen and (max-width: 375px) and (-webkit-device-pixel-ratio: 2) {
    aside {
      float: none;
      width: 100%;
      height: 3%;
      background-color: black;
    }
    main {
      height: calc(100vh - 3%);
      background-color: red;
    }
}
/* iphone5 */
@media screen and (max-width: 320px) {
    aside {
      float: none;
      width: 100%;
      height: 7%;
      background-color: green;
    }
    main {
      height: calc(100vh - 7%);
      background-color: red;
    }
}
```


#### 案例2-rem和vw单位在移动端最佳实践
> CSS新世界 7.3rem和vw单位 -张鑫旭

有了vw单位，再配合calc()函数进行计算，无须使用任何JavaScript代码，我们就可以实现基于设备宽度的移动端布局适配方案。
```css
html {
    font-size: 16px;
}
@media screen and (min-width: 375px) {
    html {
        /* 375px作为16px基准，414px宽度时正好对应18px的根字号大小 */
        font-size: calc(16px + 2 * (100vw - 375px) / 39);
    }
}
@media screen and (min-width: 414px) {
    html {
        /* 屏幕宽度从414px到1000px，根字号大小累积增加4px（18px-22px） */
        font-size: calc(18px + 4 * (100vw - 414px) / 586);
    }
}
@media screen and (min-width: 1000px) {
    html {
        /* 屏幕宽度从1000px往后每增加100px，根字号大小就增加0.5px */
        font-size: calc(22px + 5 * (100vw - 1000px) / 1000);
    }
}
```


### 纯CSS方案
>[作为一个初级前端，面试的时候要求手写js轮播效果，写不出来正常吗？ - 知乎](https://www.zhihu.com/question/326363448/answer/1847750740)

响应式字体大小
```js
calc(38px + (60-38)*(100vw - 768px) / (1440px-768px))
```



### 动态rem方案
#### rem与em的区别
* em  两种情况: 用于font-size表示代表父元素字体大小;用在其它属性代表当前元素自身的font-size
* rem 根据根节点 html 的字体大小计算（root em），默认是 16 px

#### 是什么
以rem/em作为长度单位声明所有节点的几何属性，再根据不同屏幕大小，设置 **根元素/当前元素 的font-size**来实现响应式。通常用于对不同屏幕大小要设置不同字体大小，对响应式要求较高的系统

#### rem布局思想
* 一般不要给元素设置具体的宽度，但是对于一些小图标可以设定具体宽度值
* 高度值可以设置固定值，设计稿有多大，我们就严格有多大
* 所有设置的固定值都用rem做单位（首先在HTML总设置一个基准值：px和rem的对应比例，然后在效果图上获取px值，布局的时候转化为rem值)
* js获取真实屏幕的宽度，让其除以设计稿的宽度，算出比例，把之前的基准值按照比例进行重新的设定，这样项目就可以在移动端自适应了


#### 案例0
全屏16:9的解决方案
* 在 css 表示长度的时候，用设计稿上的长度除以 192, 算得 rem 的值。
* 页面内写一段 js 代码，根据我们上面的公式去计算并设置 html 元素的 font-size 值。
```js
// 方法1
export function init(screenRatioByDesign: number = 16 / 9) {
  let docEle = document.documentElement
  function setHtmlFontSize() {
    var screenRatio = docEle.clientWidth / docEle.clientHeight;
    var fontSize = (
      screenRatio > screenRatioByDesign
        ? (screenRatioByDesign / screenRatio)
        : 1
    ) * docEle.clientWidth / 10;

    docEle.style.fontSize = fontSize.toFixed(3) + "px";
  }
  setHtmlFontSize()
  window.addEventListener('resize', setHtmlFontSize)
}

//方法2
function refreshRem() {
    var docEl = doc.documentElement;
    var width = docEl.getBoundingClientRect().width;
    var rem = width / 10;
    docEl.style.fontSize = rem + 'px';
    flexible.rem = win.rem = rem;
}
win.addEventListener('resize', refreshRem);
```
#### 案例1

> [个人博客-使用rem来实现PC端适配屏幕尺寸](https://waliblog.com/css/2018/03/19/compatible.html)

`rem`相对于根元素(即html元素)`font-size`计算值的倍数。这里以PC常见的分辨率1920px和1366px(14寸笔记本)为例说明。为了更好的说明，假设设计师给的设计稿是1920px，我们既要做1920px屏幕，也要给1366px的屏幕做适配。


如果某个元素宽度是`273px`，高度随意。那么在1366px屏幕上宽度应该显示多少呢？

我们将屏幕宽度等比分成100份
```
//1920分辨率屏幕
avg = 1920 / 100 = 19.20 px

//1366分辨率屏幕
avg = 1366 / 100 = 13.66 px
```
在1366分辨率屏幕应该显示宽度 = `1366 * (273 / 1920)` 最后是`194.228125`px

```
//1920分辨率屏幕定义根元素字体大小
font-size = 19.20px //即 1rem = 19.20px

//1366分辨率屏幕
font-size = 13.66px  //即 1rem = 13.66px
```

适配代码, 也就是`194.228125 / 13.66 = 14.21876`.

```
html{
   font-size:19.20px;  /*默认以设计稿为基准*/
}

@media only screen and (max-width: 1366px) {
   html{
      font-size:13.66px;
   }
}

#test{
   width:14.21875rem;
}
```

#### px自动转换rem
每次手动计算麻烦, 使用插件将写好的px直接转换为rem.

**sass方法**
```
// PX 转 rem
@function px2Rem($px, $base-font-size: 19.2px) {
  @if (unitless($px)) { //有无单位
    @return ($px / 19.2) * 1rem;
  } @else if (unit($px) == em) {
    @return $px;
  }
  @return ($px / $base-font-size) * 1rem;
}
```

测试
```
#test{
   width:px2Rem(273px) 
}
//输出
#test{
   width:14.21875rem;
}
```


**插件方法**


#### rem布局缺点
* 在响应式布局中，必须通过js来动态控制根元素font-size的大小，也就是说css样式和js代码有一定的耦合性，且必须将改变font-size的代码放在css样式之前
* REM布局也是目前多屏幕适配的最佳方式。默认情况下我们html标签的font-size为16px,我们利用媒体查询，设置在不同设备下的字体大小

### scale整体缩放
#### 是什么
>scale缩放主要用于大屏可视化的响应式场景。

#### 背景


#### 具体概述
如果当前屏幕宽高比（1920 / 1080）大于设计稿宽高比（1440 * 1024），需要缩放的比例就是屏幕高度除以设计稿高度（1080 / 1024 = 1.05）即transform: scale(1.05)
如果当前屏幕宽高比（1200 / 900）小于设计稿宽高比（1440 * 1024），需要缩放的比例就是屏幕宽度除以设计稿宽度（1200 / 1440 = 0.83）即transform: scale(0.83)









### Flex布局方案
传统的布局方案依赖于`display`、`position`、`float`等属性，对响应式布局并不友好）
**通常可以解决绝大多数情况下的响应式布局问题，包括圣杯布局、流式布局、多列布局、内容居中等多种场景**
**缺点**是宽度缩小但字体、图标等都不会同步缩小导致换行错位




### Grid布局
#### 是什么
Grid 布局即网格布局，比较擅长将一个页面划分为几个主要区域，以及定义这些区域的大小、位置、层次等关系。号称是最强大的的 CSS 布局方案，是目前唯一一种 CSS 二维布局。


### 第三方方案

#### UI框架自带响应式布局
##### 是什么
许多UI框架都自带一套响应式方案，这也是最易上手的响应式方案。以ElementUI为例

Layout布局
基于24 分栏布局的el-row、el-col，能够迅速简便地创建响应式布局，xs、sm、md、lg和xl属性更具体地设置响应式布局

Container布局容器
通过`<el-container>、<el-header>、<el-aside>、<el-aside>、<el-footer>`快速搭建页面的基本结构。


#### postcss-px-to-viewport
##### 是什么
一款插件, 将px单位转换为视口单位的 (vw, vh, vmin, vmax) 的 PostCSS 插件.

##### 仓库地址
[README\_CN.md](https://github.com/evrone/postcss-px-to-viewport/blob/master/README_CN.md)


##### 使用
1. 在项目中安装`postcss-px-to-viewport`包: `npm i postcss-px-to-viewport -D`
2. 项目根目录下创建`postcss.config.js`,或者在脚手架配置文件中plugins导入配置
3. 启动项目, 按照UI图上的尺寸编写即可

##### `postcss.config.js`
PC端配置
```js

// postcss.config.js

module.exports = {
	plugins: {
		// autoprefixer: {},
		'postcss-px-to-viewport-8-plugin': {
		unitToConvert: 'px', // 要转化的单位
		viewportWidth: 1920, // UI设计稿的宽度
		unitPrecision: 6, // 转换后的精度，即小数点位数
		propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
		viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
		fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
		selectorBlackList: ['wrap'], // 指定不转换为视窗单位的类名，
		minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
		mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
		replace: true, // 是否转换后直接更换属性值
		exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
		landscape: false // 是否处理横屏情况
		}
	}
};

```

移动端配置
```js
// vue.config.js
module.exports = {
//动态设置 extract 的值。开发环境设为 false，生产环境设为 true，以便打包出单独的 css 文件。
extract: IS_PROD,
sourceMap: false,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px-to-viewport')({
            unitToConvert: 'px', // 需要转换的单位，默认为"px"
            viewportWidth: 375, // 视窗的宽度，对应移动端设计稿的宽度，一般是375
            // viewportHeight:667,// 视窗的高度，对应的是我们设计稿的高度
            unitPrecision: 3, // 单位转换后保留的精度
            propList: [
              // 能转化为vw的属性列表
              '*',
            ],
            viewportUnit: 'vw', // 希望使用的视口单位
            fontViewportUnit: 'vw', // 字体使用的视口单位
            selectorBlackList: [], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
            minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
            mediaQuery: false, // 媒体查询里的单位是否需要转换单位
            replace: true, // 是否直接更换属性值，而不添加备用属性
            exclude: /(\/|\\)(node_modules)(\/|\\)/, // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
          }),
        ],
      },
    },
  },
};
```


##### 存在的问题
* 行内样式不能转换为vw


#### flexible+postcss-pxtorem
>[一篇文章搞懂，vue中pc端与移动端适配解决方案（亲测有效） - 掘金](https://juejin.cn/post/7278646930174165050#heading-10)








# 移动端适配


## 屏幕/视口/像素概念
​在学习移动端之前，我们先来学习一些基础的概念和专有名词，这些知识会在以后的面试、工作沟通中经常用到。
> [移动端前端开发之viewport | 思忆技术 (si-yee.com)](https://blog.si-yee.com/2019/04/11/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%B9%8Bviewport/)


## 屏幕相关

### 1.屏幕大小
​			指屏幕对角线长度，单位是英寸(inch)。常见的尺寸有： 3.5寸、4.0寸、5.0寸、5.5寸、6.0寸等等。

​			**<span style="color:red">备注：1英寸(inch) = 2.54厘米(cm)</span>**

![](https://s1.ax1x.com/2020/06/27/NyZQbQ.png)


### 2.屏幕分辨率
​			是指屏幕在：横向、纵向上的**物理像素点**总数。一般表示用 n * m 表示。

​			例如：iPhone6 的屏幕分辨率为：<span style="color:red">**750 * 1334**</span>

- ​	注意点:	
  - <span style="color:red">**屏幕分辨率是一个固定值，无法修改！！**</span>
  - 屏幕分辨率、显示分辨率是两个概念，系统设置中可以修改的是：显示分辨率。
  - 屏幕分辨率 >= 显示分辨率。

**常见手机分辨率**

|                        型号                         |           分辨率（物理像素点总和）            |
| :-------------------------------------------------: | :-------------------------------------------: |
|                   iPhone 3G / 3GS                   |                   320 * 480                   |
|                    iPhone 4 / 4s                    |                   640 * 960                   |
|                    iPhone 5 / 5s                    |                  640 * 1136                   |
| <span style='color:red'>**iPhone 6 / 7 / 8**</span> | **<span style='color:red'>750 * 1334</span>** |
|                 iPhone 6p / 7p / 8p                 |                  1242 x 2208                  |
|                      iPhone X                       |                  1125 * 2436                  |
|                      华为 P30                       |                  1080 * 2340                  |
|                     华为Mate40                      |                  2772 x 1344                  |
|                       小米10                        |                  2340 x 1080                  |
|                       小米11                        |                  3200 x 1440                  |

### 3.屏幕密度

又称：屏幕像素密度，是指屏幕上每英寸里包含的物理像素点个数，单位是 ppi （pixels per inch），其实这里还有另一个单位 dpi（dots per inch），两个值的计算方式都一样，只是使用的场景不同。 ppi主要用来衡量屏幕，dpi 用来衡量打印机、投影仪等。

<img src="https://s1.ax1x.com/2020/06/27/NyZ1Ej.png" style="zoom: 25%;" />



## 像素相关

> https://www.cnblogs.com/houxianzhou/p/14604922.html
> 

### 0. css(css pixel, px) 像素

> 适用于web编程， 在CSS中以px为后缀，是一个长度单位

在 CSS 规范中，长度单位可以分为两类，绝对单位以及相对单位

px是一个相对单位，相对的是设备像素（device pixel）

一般情况，页面缩放比为1，1个CSS像素等于1个设备独立像素

`CSS`像素又具有两个方面的相对性：

- 在同一个设备上，每1个 CSS 像素所代表的设备像素是可以变化的（比如调整屏幕的分辨率）
- 在不同的设备之间，每1个 CSS 像素所代表的设备像素是可以变化的（比如两个不同型号的手机）

在页面进行缩放操作也会 引起`css`中`px`的变化，假设页面放大一倍，原来的 1px 的东西变成 2px，在实际宽度不变的情况下1px 变得跟原来的 2px 的长度（长宽）一样了（元素会占据更多的设备像素）

假设原来需要 320px 才能填满的宽度现在只需要 160px

px会受到下面的因素的影响而变化：

- 每英寸像素（PPI）
- 设备像素比（DPR）



### 1.设备像素（device pixel）

**设备像素：又名物理像素**(physical pixel)。指的是设备能控制显示的最小物理单位，不一定是一个小正方形区块，也没有标准的宽高，只是用于显示丰富色彩的一个“点”而已

可以参考公园里的景观变色彩灯，一个彩灯(物理像素)由红、蓝、绿小灯组成，三盏小灯不同的亮度混合出各种色彩

从屏幕在工厂生产出的那天起，它上面设备像素点就固定不变了，单位为`pt`

![](https://mmbiz.qpic.cn/mmbiz_png/gH31uF9VIibRcRiczR54yJAzIMHicu30E1HhFYuugVde3iaSHW43XF1xDaoKBwwsQhVfgu362RNXCTfgsBpnmQ9Evw/640?wx_fmt=png)



### 3.设备独立像素

设备独立像素简称 DIP （device-independent pixel），又称：**屏幕密度无关像素**。表示*与设备无关的逻辑像素*，<span style="color:blue">代表可以通过程序控制使用的虚拟像素</span>。是一个总体概念，包括了`css`像素。可以理解为：<span style="color:blue">`CSS像素 = 设备独立像素 = 逻辑像素`。</span>在`iOS`、`Android`和`React Native`开发中样式单位其实都使用的是设备独立像素。

**出现的原因?**

更高分辨率的屏幕诞生.理论上来讲，在白色手机(分辨率320\*480)上相同大小的图片和文字，在黑色手机(分辨率640\*960)上会被缩小一倍，因为它的分辨率提高了一倍。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37001e1c48e14b6c8606024183a1151b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

乔布斯在`iPhone4`的发布会上首次提出了`Retina Display`(视网膜屏幕)的概念，它正是解决了上面的问题. 在`iPhone4`使用的视网膜屏幕中，<span style="color:blue;">把`2x2`个像素当`1`个像素使用</span>，这样让屏幕看起来更精致，但是元素的大小却不会改变。

如果黑色手机使用了视网膜屏幕的技术，那么显示结果应该是下面的情况，比如列表的宽度为`300`个像素，那么在一条水平线上，白色手机会用`300`个物理像素去渲染它，而黑色手机实际上会用`600`个物理像素去渲染它。



我们必须<span style="color:blue">用一种单位</span>来同时告诉不同分辨率的手机，要显示的目标(对象)在界面上显示元素的大小是多少，这个单位就是设备独立像素(`Device Independent Pixels`)简称`DIP`或`DP`。

上面我们说，列表的宽度为`300`个像素，实际上我们可以说：列表的宽度为`300`个设备独立像素。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0dd7c1f817e4bbabe5590651ed97eb6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)



Chrome开发工具,模拟手机型号,每种型号上面会显示一个尺寸，比如`iPhone X`显示的尺寸是`375x812`，实际`iPhone X`的分辨率会比这高很多，这里显示的就是设备独立像素。



### 获取DIP

在`javaScript`中可以通过`window.screen.width/ window.screen.height` 查看





#### 4.设备像素比(dpr)

设备像素比dpr(device pixel ratio), 单一方向上【设备像素】除以【设备独立像素】的比值，用于描述整个渲染环境在硬件设备上的缩放程度。


$$
dpr = \frac{设备像素}{设备独立像素}
$$


获取:

在`web`中，浏览器为我们提供了`window.devicePixelRatio`来帮助我们获取`dpr`。

在`css`中，可以使用媒体查询`min-device-pixel-ratio`，区分`dpr`：

```css
@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {}
```



几款手机的屏幕像素参数，[点击这里查看更多](https://uiiiuiii.com/screen/)

|                        型号                         |           分辨率（物理像素点总和）            |            设备独立像素(dip或dp)             |             像素比(dpr)              |
| :-------------------------------------------------: | :-------------------------------------------: | :------------------------------------------: | :----------------------------------: |
|                     IPhone 3GS                      |                   320 * 480                   |                  320 * 480                   |                  1                   |
|                    IPhone 4 / 4s                    |                   640 * 960                   |                  320 * 480                   |                  2                   |
|                    IPhone 5 / 5s                    |                  640 * 1136                   |                  320 * 568                   |                  2                   |
| <span style='color:red'>**IPhone 6 / 7 / 8**</span> | **<span style='color:red'>750 * 1334</span>** | **<span style='color:red'>375 * 667</span>** | **<span style='color:red'>2</span>** |
|                 IPhone 6p / 7p / 8p                 |                  1242 x 2208                  |                  414 * 736                   |                  3                   |
|                      IPhone X                       |                  1125 * 2436                  |                  375 * 812                   |                  3                   |
|                       华为P10                       |                  1080 x 1920                  |                  360 x 640                   |                  3                   |



具体描述如下：

| 设备像素比 | 设备像素         | CSS像素 |
| ---------- | ---------------- | ------- |
| 1:1        | 1*1  1个设备像素 | 1       |
| 2:1        | 2*2  4个设备像素 | 1       |
| 3:1        | 3*3 9个设备像素  | 1       |

例外:

`iPhone 6、7、8 Plus`的实际物理像素是`1080 x 1920`，

在Chrome开发者工具中它的设备独立像素是`414 x 736`，设备像素比为`3`，

设备独立像素和设备像素比的乘积并不等于`1080 x 1920`，而是等于`1242 x 2208`。

实际上，手机会自动把`1242 x 2208`个像素点塞进`1080 * 1920`个物理像素点来渲染，我们不用关心这个过程，而`1242 x 2208`被称为屏幕的`设计像素`。我们开发过程中也是以这个`设计像素`为准。



安卓和苹果手机上设备独立像素的应用:

从苹果提出视网膜屏幕开始，才出现设备像素比这个概念.

由于`Android`屏幕尺寸非常多、分辨率高低跨度非常大，不像苹果只有它自己的几款固定设备、尺寸。所以，为了保证各种设备的显示效果，`Android`按照设备的像素密度将设备分成了几个区间：

由于各个设备的尺寸、分辨率上的差异，设备独立像素也不会完全相等，所以各种`Android`设备仍然不能做到在展示上完全相等。		


#### 总结

因为苹果高清屏的出现,为了保持设计值在不同设备上保持同样的宽高, 引入了设备独立像素(dip).

和出厂就设定好的<u>设备像素</u>不同, 设备独立像素是一个虚拟像素单位,不同设备上其值也不同, 其值获取方式为: `window.screen.width / height`

在高清屏上用来表示`x*x`个设备像素来表示一个设备独立像素, 所以出现<u>设备像素比(`dpr device-pixel-ratio`)</u>的概念,其求值公式是`dpr=设备像素/设备独立像素`,

注意: 某些手机的<u>设备独立像素 × 设备像素比 > 设备像素</u>, 手机会自动把其乘积的像素塞进设备像素内,我们不需要关心这个过程,开发中仍然以其乘积作为设计像素为准.

由于各个设备尺寸,分辨率上的差异,设备独立像素也不完全相等所以各种安卓设备仍然不能做到展示上完全相等.



* 无缩放情况下，1个CSS像素等于1个设备独立像素
* 设备像素由屏幕生产之后就不发生改变，而设备独立像素是一个虚拟单位会发生改变
* PC端中，1个设备独立像素 = 1个设备像素 （在100%，未缩放的情况下）
* 在移动端中，标准屏幕（160ppi）下 1个设备独立像素 = 1个设备像素
* 设备像素比（dpr） = 设备像素 / 设备独立像素
* 每英寸像素（ppi），值越大，图像越清晰






## 视口/视窗(viewport)

### 概述
viewport 即视窗、视口，用于显示网页部分的区域，在 PC 端视口即是浏览器窗口区域;
在移动端，为了让页面展示更多的内容，视窗的宽度默认不为设备的宽度，在移动端视窗有三个概念：**布局视窗、视觉视窗、理想视窗**

### 1. 布局视口(layout viewport)
**概念**
> 是我们可以进行网页布局区域的大小，以 CSS 像素做计量单位。移动设备默认会设置一个较大的视窗尺寸（比如，iOS 一般默认是 `980px`），布局视窗的宽度是大于浏览器可视区域的宽度的。


**示意图**
![[Pasted image 20241021221000.png]]

**获取布局视口:**

默认的布局视口宽度为980px.`clientWidth`不包括border,margin和滚动条(如果存在).

```javascript
document.documentElement.clientWidth
document.documentElement.clientHeight
```

**设置**

如果显式设置布局视口,可以使用HTML中的meta标签

```javascript
<meta name='viewport' content="width=400"
```

布局视口使移动端浏览器屏幕宽度与视口完全独立开来. CSS将根据它来进行计算,并被它约束.



### 2. 视觉视口(visual viewport)
**概况**
用户通过屏幕真实看到的区域，默认等于浏览器窗口的大小（包括滚动条宽度）。可以通过`window.innerWidth`来获取，宽度等于浏览器可视区域的宽度。
当用户对浏览器进行缩放时，不会改变布局视口的大小，所以页面布局是不变的，但是缩放会改变视觉视口的大小。
例如：用户将浏览器窗口放大了200%，这时浏览器窗口中的`CSS`像素会随着视觉视口的放大而放大，这时一个`CSS`像素会跨越更多的物理像素。
所以，布局视口会限制你的`CSS`布局而视觉视口决定用户具体能看到什么。

**是什么**
视觉视口(`visual viewport`)：用户当前看到的区域,包含滚动条等.默认等于当前浏览器的窗口大小.它就是设备的像素分辨率。

**示意图**
![[Pasted image 20241021221016.png]]



**视觉视口与布局视口关系**
* <span style="color:blue">视觉视口默认等于当前浏览器的窗口大小<span style="background: #ccc">（包括滚动条宽度）</span>。</span>
>可以把`layout viewport`理解为一张完全遮住并且不能更边大小的白纸，把`visual viewport`理解为一个有边框的透视器，你可以通过这个透视器来查看这张白纸的内容。通过这个透视器你可以一点点的看到白纸部分内容，这里所能看到的就是`visual viewport`。你也可以靠近或者远离的方式来透视白纸（白纸静止不动），你看的内容可以变多或者变少，但是白纸`layout viewport`自身的大小和形状是不会发生改变的。 -- [来源](https://blog.si-yee.com/2019/04/11/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%B9%8Bviewport/#:~:text=%E5%8F%AF%E4%BB%A5%E6%8A%8Alayout%20viewport%E7%90%86%E8%A7%A3%E4%B8%BA%E4%B8%80%E5%BC%A0%E5%AE%8C%E5%85%A8%E9%81%AE%E4%BD%8F%E5%B9%B6%E4%B8%94%E4%B8%8D%E8%83%BD%E6%9B%B4%E8%BE%B9%E5%A4%A7%E5%B0%8F%E7%9A%84%E7%99%BD%E7%BA%B8%EF%BC%8C%E6%8A%8Avisual%20viewport%E7%90%86%E8%A7%A3%E4%B8%BA%E4%B8%80%E4%B8%AA%E6%9C%89%E8%BE%B9%E6%A1%86%E7%9A%84%E9%80%8F%E8%A7%86%E5%99%A8%EF%BC%8C%E4%BD%A0%E5%8F%AF%E4%BB%A5%E9%80%9A%E8%BF%87%E8%BF%99%E4%B8%AA%E9%80%8F%E8%A7%86%E5%99%A8%E6%9D%A5%E6%9F%A5%E7%9C%8B%E8%BF%99%E5%BC%A0%E7%99%BD%E7%BA%B8%E7%9A%84%E5%86%85%E5%AE%B9%E3%80%82%E9%80%9A%E8%BF%87%E8%BF%99%E4%B8%AA%E9%80%8F%E8%A7%86%E5%99%A8%E4%BD%A0%E5%8F%AF%E4%BB%A5%E4%B8%80%E7%82%B9%E7%82%B9%E7%9A%84%E7%9C%8B%E5%88%B0%E7%99%BD%E7%BA%B8%E9%83%A8%E5%88%86%E5%86%85%E5%AE%B9%EF%BC%8C%E8%BF%99%E9%87%8C%E6%89%80%E8%83%BD%E7%9C%8B%E5%88%B0%E7%9A%84%E5%B0%B1%E6%98%AFvisual%20viewport%E3%80%82%E4%BD%A0%E4%B9%9F%E5%8F%AF%E4%BB%A5%E9%9D%A0%E8%BF%91%E6%88%96%E8%80%85%E8%BF%9C%E7%A6%BB%E7%9A%84%E6%96%B9%E5%BC%8F%E6%9D%A5%E9%80%8F%E8%A7%86%E7%99%BD%E7%BA%B8%EF%BC%88%E7%99%BD%E7%BA%B8%E9%9D%99%E6%AD%A2%E4%B8%8D%E5%8A%A8%EF%BC%89%EF%BC%8C%E4%BD%A0%E7%9C%8B%E7%9A%84%E5%86%85%E5%AE%B9%E5%8F%AF%E4%BB%A5%E5%8F%98%E5%A4%9A%E6%88%96%E8%80%85%E5%8F%98%E5%B0%91%EF%BC%8C%E4%BD%86%E6%98%AF%E7%99%BD%E7%BA%B8layout%20viewport%E8%87%AA%E8%BA%AB%E7%9A%84%E5%A4%A7%E5%B0%8F%E5%92%8C%E5%BD%A2%E7%8A%B6%E6%98%AF%E4%B8%8D%E4%BC%9A%E5%8F%91%E7%94%9F%E6%94%B9%E5%8F%98%E7%9A%84%E3%80%82)

视觉视口和缩放比例的关系为:

> 当前的缩放值 = 理想视口宽度 / 视觉视口宽度   ???


**获取视觉视口宽度/高度:**

```javascript
window.innerwidth
window.innerHeight
```


### 3. 理想视口
> 布局视口的默认宽度并不是一个理想的宽度，于是 Apple 和其他浏览器厂商引入了理想视口的概念，它对设备而言是最理想的布局视口尺寸。显示在理想视口中的网站具有最理想的宽度，用户无需进行缩放。
> 
> 理想视口的值其实就是屏幕分辨率的值，它对应的像素叫做设备独立像素（device independent pixel, dip）。dip 和设备的物理像素无关，一个 dip 在任意像素密度的设备屏幕上都占据相同的空间。如果用户没有进行`缩放`，那么一个 CSS 像素就等于一个 dip。


> 理想视口宽度 = 移动设备横向分辨率 / DPR


**示意图**
![[Pasted image 20241021221103.png]]

**获取**
我们可以通过调用`screen.width / height ` 来获取理想视口的宽/高
```javascript
window.screen.width
window.screen.height
```



#### 理想视口设置(viewport)

移动设备默认的`viewport`默认是`layout viewport`，也就是那个比屏幕要宽的`viewport`，但在进行移动设备网站的开发时，我们需要的是`ideal viewport`。那么怎么才能得到`ideal viewport`呢？这就该轮到`meta`标签出场了。

`meta`元素表示那些不能由其它`HTML`元相关元素之一表示的任何元数据信息，它可以告诉浏览器如何解析页面。我们可以借助`meta`元素的`viewport`来帮助我们设置视口、缩放等，从而让移动端得到更好的展示效果。

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maxium-scale=1, user-scalable=no">
```

作用是让当前`viewport`的宽度等于设备的宽度，同时不允许用户手动缩放。如果你不这样的设定的话，那就会使用那个比屏幕宽的默认`layout viewport`，就会出现横向滚动条。

##### meta标签 viewport
1. width  布局视口的宽度  //开启理想视口
2. initial-scale  【系统】初始缩放比例  //开启理想视口
3. maximum-scale 允许【用户】缩放的最大比例
4. minimum-scale  允许【用户】缩放的最小比例
5. user-scalable  是否允许用户缩放
6. viewport-fit 设置为cover值可以解决刘海屏的留白问题 

`viewport`配置的具体含义：

| name          | 可能值                | 描述                                                         |
| :------------ | :-------------------- | :----------------------------------------------------------- |
| width         | 正整数或device-width  | 以pixels（像素）为单位， 定义布局视口的宽度。                |
| height        | 正整数或device-height | 以pixels（像素）为单位， 定义布局视口的高度。                |
| initial-scale | 0.0 - 10.0            | 定义页面初始缩放比率。This parameter sets the initial zoom level, which means **1 CSS pixel** is equal to **1 viewport pixel**. |
| minimum-scale | 0.0 - 10.0            | 定义缩放的最小值；必须小于或等于maximum-scale的值。          |
| maximum-scale | 0.0 - 10.0            | 定义缩放的最大值；必须大于或等于minimum-scale的值。          |
| user-scalable | 布尔值（yes或者no）   | 如果设置为 no，用户将不能放大或缩小网页。默认值为 yes。      |


**width** 

> 用来设置页面的布局视口宽度,属性值不带单位,默认单位为像素.其默认值在不同的浏览器中不同,但大多数为980.

<span style="color:#ee0b41">width值可以是 device-width，也可以是具体值，但有些安卓手机是不支持具体值，IOS全系列都支持。</span>

在w3schools.com中的解释是:

> `width=device-width` part sets <span style="background: #ccc" >the width of the page</span> to follow <span style="background: #ccc">the screen-width of the device</span>(which will vary depending on the device). 这里的 'the width of the page' 应该指的就是布局视口的宽度. 'the screen-width of the device'指的是设备独立像素.

width能决定布局视口的宽度,实际上并不是唯一决定性因素,设置initial-scale也能影响到布局视口,因为<span style="color: red">布局视口取得是`width`和`视觉视口宽度`的最大值.</span>

`width`能控制`layout viewport`的宽度，`device-width`就等于理想视口的宽度，所以设置`width=device-width`就相当于让布局视口等于理想视口。

```html
<meta name="viewport" content="width=device-width">

device-width = 设备的物理分辨率 / (devicePixelRatio * scale)
```

通过设置`initial-scale`可以达到同样的效果：

```html
<meta name="viewport" content="initial-scale=1">
```

由于`initial-scale = 理想视口宽度 / 视觉视口宽度`，所以我们设置`initial-scale=1;`就相当于让视觉视口等于理想视口。

```
当前缩放值 = ideal viewport宽度 / visual viewport宽度
```



**initial-scale**  

>Possible: a positive number between 0.0 and 10.0
>des: defines the ratio between the <span style="background: #ccc">device width</span>(device-width in portrait mode or device-height in landscape mode) and <span style="background: #ccc">the viewport size</span>.

根据上面的device-width的解释,其值为设备屏幕宽度,也就是设备独立像素,其值的获取方式是`screen.width`
1. initial-scale 为页面初始化时的显示比例。  
2. initial-scale = 屏幕宽度(设备独立像素)  /  布局视口宽度。(理想视口宽度 / 视觉视口宽度
3. 只写initial-scale = 1.0 也可以实现完美视口，但为了良好的兼容性，width=device-width, initial-scale=1.0一般一起写。

**maximum-scale** 
1. 设置允许用户最大缩放比例，苹果浏览器 safari 不认识该属性
2. maximum-scale = 屏幕宽度(设备独立像素) / 视觉视口宽度值


**minimum-scale**
1. 设置允许用户最小缩放比例。
2. minimum-scale = 屏幕宽度(设备独立像素) / 视觉视口宽度值

**user-scalable**
  user-scalable的值是no和
​	是否允许用户通过手指缩放页面。苹果浏览器 safari 不认识该属性

**viewport-fit**
值设置为 cover 可以解决『刘海屏』的留白问题

 
#### 注意事项

要把当前的`viewport`宽度设为`ideal viewport`的宽度，既可以设置`width=device-width`，也可以设置`initial-scale=1`。但这两者各有一个小缺陷，就是`iPhone`、`iPad`以及`IE`会横竖屏不分，通通以竖屏的`ideal viewport`宽度为准。所以，最完美的写法应该是，两者都写上去，这样就`initial-scale=1`解决了`iPhone`、`iPad`的毛病，`width=device-width`则解决了`IE`的毛病。当两个设置冲突时，布局视口取两者最大值。

这时，1个`CSS`像素就等于1个设备独立像素，而且我们也是基于理想视口来进行布局的，所以呈现出来的页面布局在各种设备上都能大致相似。


**其他注意事项**

* viewport标签只针对移动端浏览器有效,对PC端是无效的
* 当缩放比例为100%, dip宽度=CSS像素宽度=理想视口宽度=布局视口宽度
* 单独设置`initial-scale`或`width`都会有兼容问题,所以设置布局视口为理想视口的最佳方法是同时设置这两个属性
* 即使设置了`user-scalable=no` 在Android Chrome浏览器中也可以强制启动手动缩放



### 获取各种窗口大小
![[Pasted image 20231005181534.png]]

* document.documentElement.clientHeight：获取浏览器布局视口高度，包括内边距，但不包括垂直滚动条、边框和外边距。
* document.documentElement.offsetHeight：包括内边距、滚动条、边框和外边距。
* document.documentElement.scrollHeight：在不使用滚动条的情况下适合视口中的所有内容所需的最小宽度。测量方式与clientHeight相同：它包含元素的内边距，但不包括边框，外边距或垂直滚动条。
* window.innerHeight：获取浏览器视觉视口高度（包括垂直滚动条）。
* window.outerHeight：获取浏览器窗口外部的高度。表示整个浏览器窗口的高度，包括侧边栏、窗口镶边和调正窗口大小的边框。
* window.screen.Height：获取获屏幕取理想视口高度，这个数值是固定的，设备的分辨率/设备像素比
* window.screen.availHeight：浏览器窗口可用的高度。


#### `window.innerWidth与documentElement.clientWidth区别?`
* 是否包含滚动条
	* innerWidth包含滚动条宽度
	* clientWidth不包含滚动条宽度
* 视口与文档根元素的区别
	* `window.innerWidth`关注的是浏览器窗口的视口（viewport），即用户当前看到的部分，与页面内容无关。即使页面内容超出视口，`innerWidth` 仍返回视口的实际宽度
	* document.documentElement.clientWidth​ 关注的是文档根元素的可视区域，与页面布局相关。如果根元素被 CSS 修改了尺寸（如设置 width: 80%），clientWidth 会反映调整后的值
* 应用场景
	* 需要获取包含滚动条的窗口宽度时，使用 `window.innerWidth`
	* 需要精确计算页面内容布局（如响应式设计）时，优先使用 `document.documentElement.clientWidth`



## 缩放的表现

#### PC端缩放
放大时
- 元素的 css 像素值不变，但一个css像素所占面积变大了。

缩小时
- 元素的 css 像素值不变，但一个css像素所占面积变小了。

```js
//pc端,resize监测视口(初始包含块)的变化
//移动端, 布局视口
window.onresize=()=>{
    console.log(document.documentElement.clientWidth)
}
```



#### 移动端缩放
屏幕放大时
- 布局视口不变
- 视觉视口变小

屏幕缩小时
- 布局视口不变
- 视觉视口变大

从现实世界的观感来说,放大页面时页面(布局视口)宽高不变确实有些违反常理,通过以下几个关键点来理解:
2. 放大时候, 每个css像素占用了更多的物理像素,但就是为什么内容看起来变大了.
3. 布局视口的尺寸是以CSS像素计算的,所以它保持不变.


## 适配方案
> [现代 Web 布局 - 大漠_w3cpluscom - 掘金小册 (juejin.cn)](https://juejin.cn/book/7161370789680250917/section/7165496907714789407)

### 背景
> 在国内用于移动端的适配布局主要有 **REM** 和 **VW** 两种，或者在该基础上衍生出来的其他类似布局方案，比如 **VW + REM** 布局。
> 为了应对这多么的终端设备，设计师**常选择 iPhone6 作为基准设计尺寸，交付给 Web 开发者的设计尺寸是按** **`750px x 1334px`** **为准(高度会随着内容多少而改变)。 Web 开发者通过一套适配规则自动适配到其他的尺寸** 。






* rem 适配（主流方式，几乎完美适配）
* vw适配
* 响应式UI




### 2 rem适配

#### 背景
* 使用rem单位来做适配是因为,任何元素的属性值取rem作为单位的值,它始终都是相对于HTML根元素`<html>`的`font-size`来计算.
* 如果使用百分比计算,不同属性相对的参考对象不同,比如`width,padding,margin,font-size`等参考物都不同,不利于开发.


#### 原理
rem适配的原理：编写样式时统一使用rem为单位，在不同设备上动态调整根字体大小



#### 方案一 设置值/100

![rem适配方案1.png](https://i.loli.net/2021/01/05/ziclxkXCKmEVnaM.png)

##### 方案介绍

淘宝、百度的移动端页面用的此方案

1. 设置完美视口
2. <span style="color:#ee0b41">通过js设置根字体大小 = ( 当前设备横向独立像素值 *100)/设计稿宽度</span>
3. <span style="color:#ee0b41">编写样式时，直接以rem为单位，值为：原型上设计值 / 100 </span>  
4. 增加 JS 代码进行实时适配

##### 公式详解
来让我们细化一下公式:
```html
还是相同占比的问题:

设计值/设计稿宽度  = x/dip

设计值/设计稿宽度*100 = x/dip*100

```


$$
\begin{aligned}
\frac{设计值}{设计稿宽度} = \frac{x}{dip} \\
\\
\frac{dip*100}{设计稿宽度} = \frac{x*100}{设计值} \\
\\
规定:1rem=\frac{dip*100}{设计稿宽度}
\\
故: 1rem = \frac{x*100}{设计值} = \frac{dip*100}{设计稿宽度}
\\
故: x = \frac{设计值}{100}*1rem
\end{aligned}
$$


##### 代码实例

优势：编写样式时直接挪动小数点即可。

```html
//页面JS脚本中-设置实时刷新页面布局
<script type='text/javascript'>
    function adapter(){ //适配器函数
  			//获取手机横向的设备独立像素dip
        const dip=document.documentElement.clientWidth;
  			//计算根根字体大小(100是我们指定的,375是设计稿宽度)
        const rootfontSize=(dip*100)/375;
  			//设置根字体
    	document.documentElement.style.fontSize=rootFontSize+'px';
    }
    window.onresize=adapter;
</script>

less写法:
@font:100rem;
*{margin:0;padding:0}
#demo{
	width:690/@font;
	height:300/@font;
	background-color:#ddd;
    //border:1px solid black; 边框不参与适配 都是固定的1px
	border:0.01rem solid black; 边框参与适配 有大有小 1/100
}
```



#### 方案2  设计值/(设计稿宽度/10)

![rem适配方案2.png](https://i.loli.net/2021/01/05/PnVTJDEoRyYHAqO.png)

搜狐、唯品会的移动端页面用的此方案

1. 设置完美视口
2. <span style="color:#ee0b41">通过js设置根字体大小  = 当前设备横向独立像素值 / 10 </span>
3. <span style="color:#ee0b41">编写样式时，直接以rem为单位，值为：(设计值/(设计稿宽度/10))*rem</span>   例如345px/(375px/10)\*rem(41.4px)
4. 增加 JS 代码进行实时适配

```javascript
function adapter() {
  let rem = document.documentElement.clientWidth / 10
  
  document.style.fontSize = rem + 'px'
   
}

window.onresize = adapter()
```





### 2.1 rem适配在手淘中的使用
>[现代 Web 布局 - 大漠_w3cpluscom - 掘金小册 (juejin.cn)](https://juejin.cn/book/7161370789680250917/section/7165496907714789407)

移动端REM适配方案,会将基于`750px`的设计稿分成100个等份(这样设计的初衷是为了更好地从rem过渡到vw),每一等份被定义成一个单位a.同时1rem单位被认定为10a.
```js
1a = 7.5px
1rem = 75px
```

那示例稿就分成了10份,也就是整个宽度是10rem,即750px; html元素对应的font-size为75px.对于视觉稿上的元素尺寸换算,值需要原始的px除以rem基准值即可.例如`176px*176px`,转换称为`2.346667rem * 2.346667rem`.
这种比例其原理是方案2中的等比关系.
$$
\begin{aligned}
\frac{设计值176}{设计稿宽度750} = \frac{x}{dip} \\
\\
\\ 
\ 1rem = \frac{dip}{10}\
\\
\\
\ \frac{设计值176 * 10}{设计稿宽度750}\ * 1rem  = x

\\

\ \frac{设计值176}{设计稿宽度75}\ * 1rem  = x

\end{aligned}
$$
不同移动端设备的视觉窗口宽度不一致,这就需要动态调整html的font-size.虽然 CSS 媒体查询可以调整 `html` 的 `font-size` 值，但我们需要一个更动态的方案，所以最终选择 JavaScript 脚本来动态计算 `html` 的 `font-size` 值：
```js
//flexible.js
// https://github.com/amfe/lib-flexible/blob/2.0/index.js
// 原作者在文章中展示了这段代码,在这里我们也同样拿出来展示,代码难度不高,处理直接简单.但你得能想得到.f

(
	function flexible(window, document) {
		let docEl = document.documentElement
		let dpr = window.devicePixelRatio || 1

		function setBodyFontSize() {
			if (document.body) {
				document.body.style.fontSize = (12 * dpr) + 'px' // 为了解决高分辨率屏幕（如 Retina 屏）上字体模糊的问题。当设备像素比(dpr)大于1时，如果不做调整，文字会显得模糊。
			} else {
				document.addEventListener('DOMContentLoaded', setBodyFontSize)
			}
		}
		setBodyFontSize()

		//set 1rem = clientWidth/10
		function setRemUnit() {
			let rem = docEl.clientWidth
			docEl.style.fontSize = rem + 'px'
		}

		// reset rem unit on page resize
		window.addEventListener('resize', setRemUnit)
		window.addEventListener('pageshow', function(e) { //当用户使用浏览器的"前进/后退"按钮时，页面可能会从缓存中加载（称为 bfcache，即后退/前进缓存）
			if (e.persisted) { // 如果是从缓存加载的页面
				setRemUnit()
			}
		})

		//detect 0.5px supports
		// - 在高清屏(dpr >= 2)上，1px 的边框会占用 2个或更多物理像素，看起来会比较粗. 某些场景下需要更细的边框，理想情况是能显示 0.5px 的边框,但并不是所有浏览器都支持.
		// 这里需要搭配两个类来实现
		if (dpr >= 2) {
			let fakeBody = document.createElement('body')
			let testElement = document.createElement('div')
			testElement.style.border = '.5px solid transparent'
			fakeBody.appendChild(testElement)
			docEl.appendChild(fakeBody)
			if (testElement.offsetHeight === 1) {
				docEl.classList.add('hairlines')
			}
			docEl.removeChild(fakeBody)
		}
	}
)(window, document)


在css中可以添加如下内容:
//在支持的设备上使用0.5px
.hairlines .element {
	border-width: 0.5px;
}
//其它设备回退到1px
.element {
	border-width: 1px;
}
```



在2018年,手淘团队将REM的适配切换到VW适配方案,其整个设计思路不变:
- 把 `px` 转 `rem` 单位换成 `px` 转 `vw` 单位；
- 从工程中干掉 `lib-flexible` 脚本库；
- 工程体系中将 `px2rem` 替换成 `px2vw` （[www.npmjs.com/package/@mo…](https://www.npmjs.com/package/@moohng/postcss-px2vw)）。

#### REM和VW方案的缺陷
* REM方案在一些大屏幕上,页面呈现有一定缺陷.例如京东在大屏幕上会有留白.
* VW缺陷: 假如给页面一个最大宽度,让页面水平居中,它会打破整个页面的布局.内部元素尺寸无法根据外部容器尺寸变化而相应调小,如此会造成页面布局混乱.





### 3.vw vh方案

#### vw+calc函数实现移动端布局适配方案
> CSS新世界 7.3 rem和vw单位与移动端适配最佳实践

有了vw单位，再配合calc()函数进行计算，无须使用任何JavaScript代码，我们就可以实现基于设备宽度的移动端布局适配方案。

例如，希望375px～414px的宽度区间的根字号大小是16px～18px，就可以这么设置：
**第一步**: **使用calc函数+媒体查询配置字体**
```css
html {
	font-size: 16px;
}

@media screen and (min-width: 375px) {
	html {
	  // 
		font-size: calc(16px + 2 * (100vw - 375px) / 39); 
	}
}

@media screen and (min-width: 414px) {
	html {
		font-size: 18px;
	}
}
```

按照上面的计算公式,如果设备宽度是375px,则font-size属性的计算值是16px; 如果设备宽度是400px,则计算值为17.28px; 如果设备宽度是414px，则font-size属性的计算值是18px;

**第二步**,**将视觉稿对应的px单位改成等比例的rem单位**.例如，视觉稿上图片尺寸是120px×80px，则我们布局的时候使用：
```css
img {
	width: 7.5rem; // 120 / 16 = 7.5
	height: 5rem;  // 80 / 16 = 5
}
```
3px的间隙可以如下表示:
```css
.container {
	gap: calc(3/16rem);
	/* 也可以直接设置成 gap:.1875rem; */
}
```


##### 最佳实践范例代码
>下面这段CSS代码是我最常用的基于rem和vw单位并配合calc()函数的移动端适配代码，大家可以自行微调或者直接复制粘贴到自己的项目中使用，例如screen and可以删除，1000px之后的尺寸可以使用固定值等：

```css
html {
    font-size: 16px;
}
@media screen and (min-width: 375px) {
    html {
        /* 375px作为16px基准，414px宽度时正好对应18px的根字号大小 */
        font-size: calc(16px + 2 * (100vw - 375px) / 39);
    }
}
@media screen and (min-width: 414px) {
    html {
        /* 屏幕宽度从414px到1000px，根字号大小累积增加4px（18px-22px） */
        font-size: calc(18px + 4 * (100vw - 414px) / 586);
    }
}
@media screen and (min-width: 1000px) {
    html {
        /* 屏幕宽度从1000px往后每增加100px，根字号大小就增加0.5px */
        font-size: calc(22px + 5 * (100vw - 1000px) / 1000);
    }
}
```


**起点中文网移动端 适配方案**
```css
html {
  font-size: 16px
}
@media screen and (min-width:375px) {
  html {
    font-size: calc(100% + 2 * (100vw - 375px)/ 39);
    font-size: calc(16px + 2 * (100vw - 375px)/ 39)
  }
}
@media screen and (min-width:414px) {
  html {
    font-size: calc(112.5% + 4 * (100vw - 414px)/ 586);
    font-size: calc(18px + 4 * (100vw - 414px)/ 586)
  }
}
@media screen and (min-width:600px) {
  html {
    font-size: calc(125% + 4 * (100vw - 600px)/ 400);
    font-size: calc(20px + 4 * (100vw - 600px)/ 400)
  }
}
@media screen and (min-width:1000px) {
  html {
    font-size: calc(137.5% + 6 * (100vw - 1000px)/ 1000);
    font-size: calc(22px + 6 * (100vw - 1000px)/ 1000)
  }
}
```

##### 范例升级+clamp函数
>随着越来越多的浏览器支持clamp()函数，我们也可以使用下面这种更加精简的语法：

```css
html {
	font-size: 16px;
	font-size: clamp(16px, calc(16px + 2 * (100vw - 375px) / 39), 22px);
}
```


##### 纯vw适配方案使用场景
>CSS新世界 7.3 rem和vw单位与移动端适配最佳实践


>在这种纯vw单位的布局方式下，布局尺寸和图文大小既不使用px单位，也不使用rem单位，而是统一使用vw单位。例如，视觉稿上图片的尺寸是120px×80px，使用vw单位表示就是：

```css
img {
	- [ ] width: 32vw;
	height: 21.333vw;
}
```

一切单位皆是vw。于是，开发的时候只需要使用vw单位按照1∶1的尺寸将视觉稿复刻下来，就可以做到无论是什么宽度的设备，都会等比例缩放，不用担心因为设备宽度不一样而出现错位或无法对齐等布局问题。
但是，不建议在长期维护的大型项目中使用纯vw布局方式，因为这种布局方式一旦确定，后期更换布局的成本会非常高，这种布局方式比较适合用在运营活动页面中。



### 4 响应式适配
> [现代 Web 布局 - 大漠_w3cpluscom - 掘金小册 (juejin.cn)](https://juejin.cn/book/7161370789680250917/section/7165496907714789407)

#### 背景
对一个响应式 UI 或者布局而言，需要响应的大部分是：
- 响应元素的大小；
- 响应元素的位置；
- 响应元素的排版。















## vue中实现移动端适配
### 方案1-postcss-px-to-viewport适配移动端/PC端
> 在vue-cli5项目中使用postcss-px-to-viewport插件.
> 链接地址: [Vue使用 postcss-px-to-viewport 适配移动端、PC端布局 px自动转换vw - 千里不留行 -- 个人记录 (goodsunlc.com)](https://www.goodsunlc.com/archives/507.html)

1.安装插件
```bash
npm i postcss-px-to-viewport -D
```

2.在`vue.config.js`中添加配置
```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            [
              'postcss-px-to-viewport',
              {
                unitToConvert: 'px',    // 需要转换的单位，默认为"px"
                viewportWidth: 750,     // 设计稿的视窗宽度
                unitPrecision: 3,       // 单位转换后保留的精度
                propList: ['*'],        // 能转化为 vw 的属性列表
                viewportUnit: 'vw',     // 希望使用的视窗单位
                fontViewportUnit: 'vw', // 字体使用的视窗单位
                selectorBlackList: [],  // 需要忽略的 CSS 选择器，不会转为视窗单位，使用原有的 px 等单位
                minPixelValue: 1,       // 设置最小的转换数值，如果为 1 的话，只有大于 1 的值会被转换
                mediaQuery: false,      // 媒体查询里的单位是否需要转换单位
                replace: true,          // 是否直接更换属性值，而不添加备用属性
                exclude: /(\/|\\)(node_modules)(\/|\\)/, // 设置忽略文件，用正则做目录
                // include: /\/src\//,     // 如果设置了include，那将只有匹配到的文件才会被转换
                landscape: false,       // 是否添加根据 landscapeWidth 生成的媒体查询条件
                landscapeUnit: 'vw',    // 横屏时使用的单位
                landscapeWidth: 667,   // 横屏时使用的视窗宽度
              },
            ],
          ],
        },
      }
    }
  }
})
```

3.注意问题
 - 在行内样式上的style不会被转换,使用id,类选择器才会被转换
 - element-ui,vant-ui等ui组件库,默认会被转换
 - 横屏情况下,字体会变大.


### 方案2-起点中文网方案
> 采用上面张鑫旭提到的起点中文网方案,直接将适配样式在main.js中导入,作为全局适配样式






### 方案3-淘宝大漠的postcss方案
 > [如何在Vue项目中使用vw实现移动端适配 - 前端开发者学堂 (fedev.cn) - 前端开发社区](https://fedev.cn/mobile/vw-layout-in-vue.html)

技术框架
```
vue-cli5
node 20
```


1.安装postcss及需要的插件
```bash
npm i postcss-aspect-ratio-mini postcss-px-to-viewport postcss-write-svg postcss-cssnext cssnano -S
```

每个插件的作用简介:
* postcss-aspect-ratio-mini 主要用来处理元素容器宽高比
* postcss-px-to-viewport 主要用来把`px`单位转换为`vw`、`vh`、`vmin`或者`vmax`这样的视窗单位，也是[`vw`适配方案](https://www.atatech.org/articles/87388)的核心插件之一
* postcss-write-svg 主要用来处理移动端`1px`的解决方案
* postcss-cssnext 插件可以让我们使用CSS未来的特性，其会对这些特性做相关的兼容性处理
* cssnano 主要用来压缩和清理CSS代码


2.配置postcss
vue-cli5的配置可以通过根目录下的`.postcssrc`或`vue.config.js`中的`css.loaderOoptions.postcss`中([Working with CSS | Vue CLI (vuejs.org)](https://cli.vuejs.org/guide/css.html#postcss))
```json
//vue.config.js

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
	transpileDependencies: true,
	css: {
		loaderOptions: {
			postcss: {
				postcssOptions: {
					plugins: [
						require('autoprefixer'),
            require('postcss-url'),
						require("postcss-aspect-ratio-mini"),
						require("postcss-write-svg")({
							utf8: false,
						}),
						
						//postcss-px-to-viewport是将其他单位转化成vw的
						require("postcss-px-to-viewport")({
							viewportWidth: 750, // (Number) The width of the viewport.
							viewportHeight: 1334, // (Number) The height of the viewport.
							unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
							viewportUnit: "vw", // (String) Expected units.
							selectorBlackList: [".ignore", ".hairlines"], // (Array) The selectors to ignore and leave as px.
							minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
							mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
						}),
					
						require('cssnano')({
	              preset: 'advanced',
	              autoprefixer: false,
	              'postcss-zindex': false
	            })
					],
				},
			},
		},
	},
});				            

```

**postcss-px-to-viewport相关**
在哪些地方可以使用`vw`来适配我们的页面。根据相关的测试：
- 容器适配，可以使用`vw`
- 文本的适配，可以使用`vw`
- 大于`1px`的边框、圆角、阴影都可以使用`vw`
- 内距和外距，可以使用`vw`

**postcss-aspect-ratio-mini使用相关**
> 主要用来处理元素容器宽高比. 具体操作请查看链接文档.


## 适配问题及解决

> [关于移动端适配，你必须要知道的 - 掘金 (juejin.cn)](https://juejin.cn/post/6844903845617729549#heading-21)

### 1px问题

为了适配各种屏幕，我们写代码时一般使用设备独立像素来对页面进行布局。

而在设备像素比大于`1`的屏幕上，我们写的`1px`实际上是被多个物理像素渲染，这就会出现`1px`在有些屏幕上看起来很粗的现象。



#### border-image

基于`media`查询判断不同的设备像素比给定不同的`border-image`：

```css
.border_1px{
  border-bottom: 1px solid #000;
}
@media only screen and (-webkit-min-device-pixel-ratio:2){
  .border_1px{
    border-bottom: none;
    border-width: 0 0 1px 0;
    border-image: url(../img/1pxline.png) 0 0 2 0 stretch;
  }
}
```



#### background-image

和`border-image`类似，准备一张符合条件的边框背景图，模拟在背景上。

```css
.border_1px{
  border-bottom: 1px solid #000;
}
@media only screen and (-webkit-min-device-pixel-ratio:2){
  .border_1px{
    background: url(../img/1pxline.png) repeat-x left bottom;
    background-size: 100% 1px;
  }
}
```

上面两种都需要单独准备图片，而且圆角不是很好处理，但是可以应对大部分场景。



#### 伪类 + transform

基于`media`查询判断不同的设备像素比对线条进行缩放：

```css
.border_1px:before{
  content: '';
  position: absolute;
  top: 0;
  height: 1px;
  width: 100%;
  background-color: #000;
  transform-origin: 50% 0%;
}
@media only screen and (-webkit-min-device-pixel-ratio:2){
  .border_1px:before{
    transform: scaleY(0.5);
  }
}
@media only screen and (-webkit-min-device-pixel-ratio:3){
  .border_1px:before{
    transform: scaleY(0.33);
  }
}
```

这种方式可以满足各种场景，如果需要满足圆角，只需要给伪类也加上`border-radius`即可。



#### svg

上面我们`border-image`和`background-image`都可以模拟`1px`边框，但是使用的都是位图，还需要外部引入。

借助`PostCSS`的`postcss-write-svg`我们能直接使用`border-image`和`background-image`创建`svg`的`1px`边框：

```css
@svg border_1px { 
  height: 2px; 
  @rect { 
    fill: var(--color, black); 
    width: 100%; 
    height: 50%; 
    } 
  } 
.example { border: 1px solid transparent; border-image: svg(border_1px param(--color #00b1ff)) 2 2 stretch; }
```

编译后

```css 
.example { border: 1px solid transparent; border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E") 2 2 stretch; }
```

上面的方案是大漠在他的文章中推荐使用的，基本可以满足所有场景，而且不需要外部引入，这是我个人比较喜欢的一种方案。

#### 设置viewport

通过设置缩放，让`CSS`像素等于真正的物理像素。

例如：当设备像素比为`3`时，我们将页面缩放`1/3`倍，这时`1px`等于一个真正的屏幕像素。

```javascript
const scale = 1 / window.devicePixelRatio;
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        window.document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale);
```

实际上，上面这种方案是早先`flexible`采用的方案。

当然，这样做是要付出代价的，这意味着你页面上所有的布局都要按照物理像素来写。这显然是不现实的，这时，我们可以借助`flexible`或`vw、vh`来帮助我们进行适配。????





### 适配iPhoneX

iPhoneX和其他具有边缘屏幕的手机

![331ae1667fbd495892819ea0a3750ad6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp (1304×685) (byteimg.com)](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/331ae1667fbd495892819ea0a3750ad6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

这些手机和普通手机在外观上无外乎做了三个改动：圆角（`corners`）、刘海（`sensor housing`）和小黑条（`Home Indicator`）。为了适配这些手机，安全区域这个概念变诞生了：安全区域就是一个不受上面三个效果的可视窗口范围。

为了保证页面的显示效果，我们必须把页面限制在安全范围内，但是不影响整体效果。

#### viewport-fit

`viewport-fit`是专门为了适配`iPhoneX`而诞生的一个属性，它用于限制网页如何在安全区域内进行展示.

它的值是:

`contain`: 可视窗口完全包含网页内容

`cover`：网页内容完全覆盖可视窗口

默认情况下或者设置为`auto`和`contain`效果相同

#### env / constant

我们需要将顶部和底部合理的摆放在安全区域内，`iOS11`新增了两个`CSS`函数`env、constant`，用于设定安全区域与边界的距离。

函数内部可以是四个常量：

- `safe-area-inset-left`：安全区域距离左边边界距离
- `safe-area-inset-right`：安全区域距离右边边界距离
- `safe-area-inset-top`：安全区域距离顶部边界距离
- `safe-area-inset-bottom`：安全区域距离底部边界距离

注意：我们必须指定`viweport-fit`后才能使用这两个函数

```javascript
<meta name="viewport" content="viewport-fit=cover"
```

`constant`在`iOS < 11.2`的版本中生效，`env`在`iOS >= 11.2`的版本中生效，这意味着我们往往要同时设置他们，将页面限制在安全区域内：

```css
body {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
```

当使用底部固定导航栏时，我们要为他们设置`padding`值：

```css
{
  padding-bottom: constant(safe-area-inset-bottom)
  padding-bottom: env(safe-area-inset-bottom)
}
```



### 横屏适配

很多视口我们要对横屏和竖屏显示不同的布局，所以我们需要检测在不同的场景下给定不同的样式：

#### JS检测横屏

`window.orientation`获取屏幕旋转方向

```javascript
window.addEventListener('resize', () => {
  if (window.orientation === 180 || window.orientation === 0) {
    //正常方向或屏幕旋转180度
    console.log('竖屏')
  };
  
  if (window.orientation === 90 || window.orientation === -90) {
    // // 屏幕顺时钟旋转90度或屏幕逆时针旋转90度
    console.log('横屏')
  }
})
```

#### CSS检测横屏

```css
@media screen and (orientation: portrait) {
  /*竖屏...*/
} 
@media screen and (orientation: landscape) {
  /*横屏...*/
}
```



### 图片模糊问题

#### 产生原因

我们平时使用的图片大多数都属于位图（`png、jpg...`），位图由一个个像素点构成的，每个像素都具有特定的位置和颜色值.

理论上，位图的每个像素对应在屏幕上使用一个物理像素来渲染，才能达到最佳的显示效果。

而在`dpr > 1`的屏幕上，位图的一个像素可能由多个物理像素来渲染，然而这些物理像素点并不能被准确的分配上对应位图像素的颜色，只能取近似值，所以相同的图片在`dpr > 1`的屏幕上就会模糊:

#### 解决方案

为了保证图片质量，我们应该尽可能让一个屏幕像素来渲染一个图片像素，所以，针对不同`DPR`的屏幕，我们需要展示不同分辨率的图片。

如：在`dpr=2`的屏幕上展示两倍图`(@2x)`，在`dpr=3`的屏幕上展示三倍图`(@3x)`。

##### media查询

使用`media`查询判断不同的设备像素比来显示不同精度的图片：

只适用于背景图. ???

```css
.avatar{
  background-image: url(conardLi_1x.png);
}
@media only screen and (-webkit-min-device-pixel-ratio:2){
  .avatar{
    background-image: url(conardLi_2x.png);
  }
}
@media only screen and (-webkit-min-device-pixel-ratio:3){
  .avatar{
    background-image: url(conardLi_3x.png);
  }
}
```



##### image-set

> 只适用于背景图

```css
.avatar {
    background-image: -webkit-image-set( "conardLi_1x.png" 1x, "conardLi_2x.png" 2x );
}
```



##### srcset

使用`img`标签的`srcset`属性，浏览器会自动根据像素密度匹配最佳显示图片：

```css
<img src="conardLi_1x.png"
     srcset=" conardLi_2x.png 2x, conardLi_3x.png 3x">
```



##### JS拼接图片URL

使用`window.devicePixelRatio`获取设备像素比，遍历所有图片，替换图片地址：

```javascript
const dpr = window.devicePixelRatio;
const images =  document.querySelectorAll('img');
images.forEach((img)=>{
  img.src.replace(".", `@${dpr}x.`);
})

```



##### 使用svg

`SVG `的全称是可缩放矢量图（`Scalable Vector Graphics`）。不同于位图的基于像素，`SVG` 则是属于对图像的形状描述，所以它本质上是文本文件，体积较小，且不管放大多少倍都不会失真。

除了我们手动在代码中绘制`svg`，我们还可以像使用位图一样使用`svg`图片：

```html
<img src="conardLi.svg">

<img src="data:image/svg+xml;base64,[data]">

.avatar {
  background: url(conardLi.svg);
}
```

- [99designs.com/blog/tips/p…](https://link.juejin.cn/?target=https%3A%2F%2F99designs.com%2Fblog%2Ftips%2Fppi-vs-dpi-whats-the-difference%2F)
- [www.w3cplus.com/css/vw-for-…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.w3cplus.com%2Fcss%2Fvw-for-layout.html)
- [aotu.io/notes/2017/…](https://link.juejin.cn/?target=https%3A%2F%2Faotu.io%2Fnotes%2F2017%2F11%2F27%2Fiphonex%2Findex.html)



# 移动端事件

### 事件类型

移动端事件列表

* touchstart   元素上触摸开始时触发
* touchmove   元素上触摸移动时触发
* touchend   手指从元素上离开时触发
* touchcancel   触摸被打断时触发

这几个事件最早出现于IOS safari中，为了向开发人员转达一些特殊的信息。

### 应用场景

- touchstart 事件可用于元素触摸的交互，比如页面跳转，标签页切换

- touchmove 事件可用于页面的滑动特效，网页游戏，画板

- touchend 事件主要跟 touchmove 事件结合使用

- touchcancel 使用率不高


注意：

- touchmove 事件触发后，即使手指离开了元素，touchmove 事件也会持续触发
- 触发 touchmove 与 touchend 事件，一定要先触发 touchstart 
- <span style="color:#ee0b41">事件的作用在于实现移动端的界面交互</span>

### 点击穿透

<span style="color:#ee0b41">        touch 事件结束后会默认触发元素的 click 事件</span>，如没有设置完美视口，则事件触发的时间间隔为 300ms 左右，如设置完美视口则时间间隔为 30ms 左右（备注：具体的时间也看设备的特性）。

​       如果 touch 事件隐藏了元素，则 click 动作将作用到新的元素上，触发新元素的 click 事件或页面跳转，此现象称为点击穿透

```
1.使用默认阻止事件 event.preventDefault()
2.点击穿透的对象使用touch事件代替click事件
3.延时(需要大于touch和click事件之间的时间差)使用pointerEvent属性no/auto;
4.延时(需要大于时间差)再调用事件函数.
```



#### 解决方法一

阻止默认行为

```js
//阻止默认行为
node.addEventListener('touchstart', function(e){
    console.log('hello')
	e.preventDefault(); 
})
```

#### 解决方法二

使背后元素不具备click特性，用touchXxxx代替click

```js
banner_img.addEventListener('touchstart',()=>{
    location.href = 'http://www.baidu.com'
    //window.location.href="https://www.baidu.com"
})
```

#### 解决方案三

让背后的元素暂时失去click事件，300毫秒左右再复原

```css
#anode{
  pointer-events: none; //老属性,表示这个元素不能响应任何事件.
}
```

```js
btn.addEventListener('touchstart',(event)=>{
    shade.style.display =  'none'
    setTimeout(()=>{
        anode.style.pointerEvents = 'auto'; //500毫秒之后,取消事件冻结
    },500)
})
```

#### 解决方案四

让隐藏的元素延迟300毫秒左右再隐藏

```js
btn.addEventListener('touchstart',(event)=>{
    setTimeout(()=>{
    	shade.style.display =  'none'
    },300)
})
```





### 其他

#### 真机调试

```
内网穿透工具:
utools
ngrok
```



## 浏览器

### 其他

判断是否是IE浏览器

```javascript
//document.documentMode 返回IE浏览器版本,例如IE5,返回5;
let isIe = document.documentMode
	|| +(navigator.userAgent.match(/MSIE\s(\d+)/)) && RegExp.$1;
```


## PC端适配方案


