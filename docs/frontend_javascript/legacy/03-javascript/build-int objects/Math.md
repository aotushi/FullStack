---
alias: Math
---


# Math实例

### 生成制定(x-y)之间的随机数

```js
//生成一个指定范围的随机数
0-x之间的随机数
	Math.round(Math.random()*x)

x-y之间的随机数
	Math.round(Math.random()*(y-x) + x)
	Math.round(Math.random()*(y-x)) + x

  Math.ceil(Math.random()*(y-x))+x

//Math.min()和Math.max()用于确定一组数组中最小和最大值

```



### 使用按位运算符随机生成整数

> 位运算只对整数有效，遇到小数时，会将小数部分舍去，只保留整数部分。所以，将一个小数与`0`进行二进制或运算，等同于对该数去除小数部分，即取整数位。

```js
// 按位或 '|'

(Math.randome()*2 | 0) //返回值0或1

//随机生成0或1
(Math.random()*2|0)+1) - 1
```





### 使用时间戳和随机数生成一个不重复的字符串

```javascript
//https://xpoet.cn/2018/11/%E5%88%A9%E7%94%A8%E6%97%B6%E9%97%B4%E6%88%B3%E5%92%8C%E9%9A%8F%E6%9C%BA%E6%95%B0%E7%94%9F%E6%88%90%E4%B8%80%E4%B8%AA%E4%B8%8D%E9%87%8D%E5%A4%8D%E7%9A%84%E5%AD%97%E7%AC%A6%E4%B8%B2/

export const getUUID = (randomLength) => {
  return Number(Math.random().toString().substring(2, randomLength) + Date.now()).toString(36);
}
```


### 生成16进制颜色字符串
```js
const 16color = () => `#${Math.random().toString(16).slice(2,8).padEnd(6, '0')}`
```

### 生成rgb颜色字符串
```js
const randomRgb = () => `rgb${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`
```


