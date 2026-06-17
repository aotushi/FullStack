# React

## 资源链接
* [semlinker/reactjs-interview-questions: List of top 304 ReactJS Interview Questions & Answers](https://github.com/semlinker/reactjs-interview-questions)
* https://juejin.cn/post/7182382408807743548
* [「2021」高频前端面试题汇总之React篇（上）2021 高频前端面试题汇总之React篇，前端面试题汇总系列文章的R - 掘金](https://juejin.cn/post/6941546135827775525)



### React18有哪些更新?



### React设计思想
- **组件化**
每个组件都符合开放-封闭原则，封闭是针对渲染工作流来说的，指的是组件内部的状态都由自身维护，只处理内部的渲染逻辑。开放是针对组件通信来说的，指的是不同组件可以通过props（单项数据流）进行数据交互

- **数据驱动视图**
UI=f(data)

通过上面这个公式得出，如果要渲染界面，不应该直接操作DOM，而是通过修改数据(state或prop)，数据驱动视图更新

- **虚拟DOM**
由浏览器的渲染流水线可知，DOM操作是一个昂贵的操作，很耗性能，因此产生了虚拟DOM。虚拟DOM是对真实DOM的映射，React通过新旧虚拟DOM对比，得到需要更新的部分，实现数据的增量更新

  

作者：lyllovelemon  
链接：https://juejin.cn/post/7182382408807743548  
来源：稀土掘金  
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### JSX是什么,和JS有什么区别?
