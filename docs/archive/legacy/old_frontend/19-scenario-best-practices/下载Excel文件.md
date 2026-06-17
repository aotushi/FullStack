> 20240711 
> 通用处理方案是,请求回来的数据,通过js方法来实现下载

## 第一种方案
get请求获取文件流
```js
axios.get(downUrl, {
 params,
 responseType: 'blob'
})
```

将数据转换成文件
```js

// 导出Excel公用方法
//接收文档流和文件名称
export function exportMethod (data,name) {
  const link = document.createElement('a')
  let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)

  // link.download = res.headers['content-disposition'] //下载后文件名
  link.download = name?name:'' //下载的文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
```