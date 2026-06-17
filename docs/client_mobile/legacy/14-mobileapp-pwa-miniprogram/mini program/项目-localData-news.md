# 项目名称: localData-news

## 来源:

微信读书-<零基础学,微信小程序开发>



## 基础

### 微信小程序配置

在微信小程序中，app.json和app.wxml就是用来进行统一的样式配置的。

#### 样式配置

app.json文件是统一的项目配置文件，每一个页面的配置文件为pageName.json。app.json文件的具体代码如下：

```json
{
  "pages":[
    "pages/index/index",
    "pages/logs/logs"
  ],
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "WeChat",
    "navigationBarTextStyle":"black"
  }
}
```

pages用来存放用到的所有页面的路径，写的是pageName.wxml的路径，但是不需要写后缀，系统会自动查找页面对应的其他文件。注意，最后一个不需要用“,”分隔。第一个页面路径为首页显示的页面。

window是窗口的样式设置，用来设置微信小程序的状态栏、标题、导航栏等的样式。颜色只接受十六进制的颜色值。

![](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.3jxv81cwewu0.webp)



![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.36n4vdpfn7u0.webp)

tabBar是多tab应用时使用的，用户可以在微信小程序的底部切换页面，建议最少2个，最多5个。

![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.5vlz9n9yec00.webp)



![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.yeoz44sb0kw.webp)

























































