---
alias: xhr
---


### XMLHttpRequest对象
>https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest



#### 生命周期
XMLHttpRequest对象从创建到销毁存在一个完整的生命周期，在生命周期的每个阶段会调用XMLHttpRequest对象的不同函数，在函数中需要通过XMLHttpRequest对象的特定属性来判断函数执行情况。

#### 方法

**open('method', 'URL', `[asyncFlag], ['userName'], ['password']`**
建立对服务器的调用。
* method参数表示请求方式，可以为GET、POST或者PUT。
* URL参数表示请求的路径，可以是相对路径，也可以是绝对路径。
* 后面3个是可选参数，分别表示是否异步、用户名、密码。其中asyncFlag=true表示异步，asyncFlag=false表示同步，默认值为true。

**setRequestHeader('key', 'value)'**
设置请求头中属性为key的值为value。在设置请求头之前需要先调用open()函数，设置的header将随着send()函数一起发送。

**send(content)函数**
向服务器发送请求

**abort()**
如果请求已经发送，则停止当前请求

**getAllResponseHeaders()函数**
获取所有HTTP请求的响应头部，作为键值对返回；如果没有收到响应，则返回“null”

**getResponseHeader('key')**
获取指定key的HTTP响应头，如果没有收到响应或者响应中不存在key对应的报头，则返回“null”。

#### 属性

**onreadystatechange**
状态改变的事件触发器，每个状态改变时都会触发这个事件处理器，通常会调用一个JavaScript函数。

**readyState**
请求的状态，有5个可取的值。
* 0，未初始化，XMLHttpRequest对象已创建。
* 1，open()函数已调用，send()函数未调用，请求还未发送。
* 2，send()函数已调用，HTTP请求已发送到服务器，未接收到响应。
* 3，所有响应头接收完成，响应体开始接收但未完成。
* 4，HTTP响应接收完成。

**responseText**
接收的数据文本格式的服务器响应体（不包括响应头）

**responseXML**
服务器的响应，兼容DOM的XML对象，解析后可得到DOM对象。

**status**
服务器返回的HTTP状态码，用数字表示，如200表示“成功”，404表示“资源未找到”

**statusText**
HTTP状态码的文本表示，如状态码为200时，对应返回“OK”；状态码为404时，对应返回“Not Found”。



#### 生命周期
**1.创建XMLHttpRequest对象**
由于浏览器的差异性，创建XMLHttpRequest对象时需要使用不同的方法，主要体现在IE浏览器与其他浏览器之间。
```js
function createXMLHttp() {
	// code for IE7+, FireFox, Chrome, Opera, Safari
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest()
	}

	// code for IE6,IE5
	if (window.ActiveXObject) {
		try {
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
		} catch(e) {
			try {
				xmlhttp = new ActiveXObject('msxml2.XMLHTTP')
			} catch(e) {}
		}
	}
}
```

**2.建立连接**
通过open()函数建立连接，它指定了请求的url地址以及通过url传递的参数；数据传输方式，默认值为true，表示采用异步传输方式
```js
let xhr = new createXMLHttp()
xhr.open('post', '/admin/w/saveUser', true)
```

**3.发送请求传递数据**
使用send()函数发送请求，并传递数据content。由于传递的数据并不是必需的，所以content值可以为空。
```js
let content = {userName: 'kingx', password: '123456'}
xhr.send(content)
```


**4.处理响应**
onreadystatechange属性，它表示XMLHttpRequest对象状态改变的事件触发器，每次readyState的取值变化时，属性onreadystatechange对应的函数都会被执行一次。

当readyState的值为4时代表响应接收完成，需要注意的是响应接收完成并不代表请求是成功的，我们需要通过HTTP请求status状态码来判断，当status值为200时代表请求成功。
```js
xhr.onreadyStatechange = function() {
	// 当readyState为4,且状态码为200时代表请求成功
	if (xhr.readyState == 4 && xhr.status == 200) {
		// 处理响应值
		document.write(xhr.responseText)
	}
}
```


```js
设置ajax步骤:
1.创建ajax请求对象 const xhr=new XMLHttpRequest()
2.初始化          xhr.open('GET', 'url')
3.发送请求         xhr.send(body); ///get请求不传body参数，只有post请求传参.传参形式一般a=100&b=200类.
4.事件响应         xhr.onreadystatechange=function(){
				 if(xhr.readyState===4){
                     console.log(xhr.responseText);
                     //xhr.responseXML 接收xml格式的响应数据
					 //xhr.responseText 接收文本格式的响应数据

                 }
			 }
```



### express框架案例
#### GET
```js
XMLHttpRequest ajax的所有操作都是通过该对象进行的


====================页面中script=================
//ajax使用步骤
    
//0.创建ajax请求对象
const xhr=new XMLHttpRequest();
//1.初始化
xhr.open('GET', 'http://127.0.0.1/server');
//2.发送请求
xhr.send();
//3.绑定事件
xhr.onreadystatechange=function(){
    if(xhr.readyState===4){
        //查看服务器响应结果
        //响应状态码
        console.log(xhr.status);
        //响应状态码字符串
        console.log(xhr.statusText);
        //响应头
        console.log(xhr.getAllResponseHeaders());
        //响应体
        console.log(xhr.responseText);
    }
}


====================后台=================
const express=require('express');
const app=express();

app.get('/server', (request, respones)=>{
    //添加响应头
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.send('Hello, ajax');
});

app.listen(80);
```



#### POST
```js
==========服务端==============
const express=require('express');
const app=express();

app.post('/server', (request, respones)=>{
    //添加响应头
    response.setHeader('Access-Control-Allow-Origin', '*');//解决跨域
    response.setHeader('Access-Control-Allow-Headers', '*');//解决请求头设置报错
    response.setHeader('');
    response.send('Hello, ajax');
});

app.listen(80);


==========客户端==============
<script>
    const result=document.querySelector('#result');
	//绑定事件
	result.onmouseover=function(){
        //0.创建ajax对象
        const xhr=new XMLHttpRequest();
        //1.初始化[请求行]
        xhr.open('POST', 'http://127.0.0.1/server');
        //设置[请求头] 请求头的报文不能使用空文
        xhr.setRequestHeader('name', 'daydayup');
        //设置content-type 将[请求体]内容格式化 在Chrome-network中的最下格式化显示
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
        //2.发送 设置[请求体]
        xhr.send('username=admin&&password=admin');
        //3.绑定事件
        xhr.onreadystatechange=function(){
            if(xhr.readyState===4){
                result.innerHTML=xhr.responseText;
            }
        }
    }
<script>   
        
//浏览器中请求体在哪里查看?
点击xhr中的初始化URL, 在headers中的一栏        
```




### IE中缓存问题
```js
IE会对ajax请求响应的结果进行缓存,若下次请求与本次请求的URL完全一致,则以缓存结果作为响应结果.不向服务器发送请求.

问题：在一些浏览器中(IE),由于缓存机制的存在，ajax只会发送的第一次请求，剩余多次请求不会在发送给浏览器而是直接加载缓存中的数据。
解决方式：浏览器的缓存是根据url地址来记录的，所以我们只需要修改url地址即可避免缓存问题
xhr.open("get","/testAJAX?t="+Date.now());


//ajax使用步骤:
//1.创建ajax请求对象
const xhr=new XMLHttpRequest();
//2.初始化
xhr.open('GET', 'http://127.0.0.1/server?keyword=abc&t='+Date.now());
//3.发送请求
xhr.send();
//4.绑定事件onreadystatechange 处理响应结果. readyState是xhr对象中的一个属性,总共有5个值
xhr.onreadystatechange=function(){
    //判断
    if(xhr.readyState === 4){
        ....
    }
}

```



### 优缺点
优点:
* 无刷新更新数据
* 异步通信
* 前后端分离
* 前后端负载均衡
	* 在前后端进行分离开发后，以往由后端处理的数据逻辑，现在也可以交给前端处理，减轻服务端压力。
* 标准化支持 Ajax是一种基于Web标准化并被浏览器广泛支持的技术

缺点
* 破坏浏览器正常后退功能
	* 浏览器后退按钮没有办法和JavaScript进行很好的合作，从而导致Ajax对浏览器后退机制的破坏。 ??
* 安全性问题
	* Ajax的逻辑可以将前端安全扫描技术隐藏起来，允许黑客从远端服务器上建立新的链接。同时Ajax也难以避免一些已知的安全性弱点，例如跨域脚本攻击、SQL注入攻击和基于Credentials的安全漏洞
* 对搜索引擎支持较弱 浏览器在进行SEO（Search Engine Optimization，搜索引擎优化）时，会屏蔽掉所有的JavaScript代码
* 违背URL唯一资源定位的初衷
	* 由于Ajax请求并不会改变浏览器地址栏的URL，因此对于相同的URL，不同的用户看到的内容可能是不一样的


