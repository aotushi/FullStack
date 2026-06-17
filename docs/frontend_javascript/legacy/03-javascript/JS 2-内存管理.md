---
alias: JS内存机制
---




##  JS内存机制

> [浅谈JS内存机制 - 掘金 (juejin.cn)](https://juejin.cn/post/7087442230775906341)

### JS 3种类型空间

在 JavaScript 的执行过程中， 主要有三种类型内存空间，分别是代码空间、栈空间和堆空间。

**代码空间**：用来存放可执行代码

**栈空间**：一块连续的内存区域，容量较小，读取速度快，被设计成先进后出结构

**堆空间**：不连续的内存区域，容量较大，用于储存大数据，读取速度慢



### 栈空间

栈空间其实就是 JavaScript 中的调用栈，是用来储存执行上下文，以及存储执行上下文中的一些基本类型中的小数据，如下图所示：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cac06d18ee5049fe85483fd0a42baa92~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

**变量环境：** 存放var声明与函数声明的变量空间，编译时就能确定，不受块级作用域影响

**词法环境：** 存放let与const声明的变量空间，编译时不能完全确定，受块级作用域影响



### 堆空间

* 用来**储存大数据**如引用类型，然后把他们的引用地址保存到栈空间的变量中
  * 所以多了这一道中转,JavaScript 对堆空间数据的读取自然会比栈空间数据的要慢

* 通常情况下，**栈空间都不会设置太大**
  * 这是因为 JavaScript 引擎需要用栈来维护程序执行期间上下文的状态，如果栈空间大了的话，所有的数据都存放在栈空间里面，那么会影响到上下文切换的效率，进而又影响到整个程序的执行效率。

栈空间和堆空间的关系：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8acbe215955f49ff8bf34aa181951b8e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

### 堆栈存放的数据类型

大量资料提到: 原始类型的数据是存放在栈中，引用类型的数据是存放在堆中. 来判断一下:

#### 数字

V8把数字分成两种类型：smi(small integer 小整数) 和 heapNumber

smi是范围为 ：<span style="color:blue"> -2³¹ 到 2³¹-1的整数</span>，在栈中直接存值；

Int32类型的范围是 -(2^31) ~ 2^31 - 1, 为什么Smi类型会比Int32小呢，这是因为在V8中，Sim类型的值是根据它的地址直接得出的，为了区分Smi类型和普通的指针，Smi类型都存储在最低位为0的地址中，所以Smi的范围实际上是Int31类型的范围。

除了smi，其余数字类型都是heapNumber，需要另外开辟堆空间进行储存，变量保存其引用。

```javascript
var times = 50000
var smi_in_stack = 1;
var heap_number = 1.1;

// about 1.5~1.6ms fast
console.time('smi_in_stack')
for (let i=0; i<times; i++) {
  smi_in_stack++;
}
console.timeEnd('smi_in_stack')

// about 2.1~2.5ms, slow
console.time('heap_number');
for (let i = 0; i < times; i++) {
  heap_number++;
}
console.timeEnd('heap_number');
```

同时我们可以通过heap snapshots观察到heap_number的存在，所以验证了栈中的heapNumber值是存在堆中，smi值是直接存在栈中。 ????



#### 其他基本类型

V8定义了一种 [oddball](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8%2Fblob%2Fc736a452575f406c9a05a8c202b0708cb60d43e5%2Fsrc%2Fobjects.h%23L9368) 类型，属于 oddball 类型的有null、undefined、true和false

```javascript
function BasicType() {
  this.oddBall1 = true;
  this.oddBall2 = false;
  this.oddBall3 = undefined;
  this.oddBall4 = null;
  this.oddBall5 = '';
}
const obj1 = new BasicType();
const obj2 = new BasicType();
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae9de4293c094b738d3580076d76c116~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)



这里可以看到oddball类型以及空字符串的堆引用全部都是一个固定值，代表在V8跑起来的第一时间，不管我们有没有声明这些基本类型，他们都已经在堆中被创建完毕了。由此猜想栈中这些类型使用的也是堆中的地址。

```javascript
function Obj() {
  this.string = 'str';
  this.num1 = 1;
  this.num2 = 1.1;
  this.bigInt = BigInt('1');
  this.symbol = Symbol('1');
}
const obj = new Obj();
debugger;
obj.string = 'other str';
obj.num1 = 2;
obj.num2 = 1;
obj.bigInt = BigInt('2');
obj.symbol = Symbol('2');
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b81e3322b2a47a4981ee5b761f5b76c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)



**debugger后的内存快照**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d672dd78332a4f8cae0cbd60e2c63608~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)



其中bring、symbol的内存地址都进行了更换，由此可以猜想是因为这三种类型占用的内存大小不是一个固定值，需要根据其值进行动态分配，所以内存地址会进行更换；

heapNumber的内存地址并没有发生变化，这个更换值的操作还是在原来的内存空间中进行。

因为栈是一块连续的内存空间，不希望运行中会产生内存碎片，由此可以得出bigInt、string、symbol这些内存大小不固定的类型在栈中也是保存其堆内存的引用。

同时我们在栈中可以声明很大的string，如果string存放在栈中明显也不合理

**故栈空间中的基本类型储存位置如下：**

| 类型      | 储存位置                        |
| --------- | ------------------------------- |
| Number    | smi储存栈中，heapNumber储存堆中 |
| String    | 堆                              |
| Boolean   | 堆                              |
| Null      | 堆                              |
| undefined | 堆                              |
| BigInit   | 堆                              |
| Symbol    | 堆                              |

上述结论主要是从heap snapshots和栈的特性中得出，毕竟最正确的答案是在源码中获得



### JS内存回收 ???

#### 栈内存回收

```
function fn1() {
  //....
  function fn2() {
    //...
  }
  fn2();
}
fn1();
复制代码
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51f0533d2a17485eb821c5b6fe9823c8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?) 调用栈中有一个记录当前执行状态的指针（称为 ESP），随着函数的执行，函数执行上下文被压入调用栈中，执行上下文中的数据会按照前面说的JS数据存储机制被分配到堆栈中，ESP会指向最后压栈的执行上下文，如左图所示的fn2函数。当fn2函数调用完毕，JS 会把ESP指针下移至fn1函数，这个指针下移的操作就是销毁fn1函数执行上下文的过程。最后fn1函数执行上下文所占用的区域会变成无效区域，下一个函数执行上下文压入调用栈的时候会直接覆盖其内存空间。简而言之，只要函数调用结束，该栈内存就会自动被回收，不需要我们操心。刚刚我们也聊到闭包，如果出现闭包的情况，闭包的数据就会组成一个对象保存在堆空间里。

#### 堆内存回收

内存垃圾回收领域中有个重要术语：**代际假说**，其有以下两个特点：

1. 大部分对象在内存中存在的时间很短，简单来说，就是很多对象一经分配内存，很快就变得不可访问；

1. 不死的对象，会活得更久。

基于代际假说，JS 把堆空间分成新生代和老生代两个区域，新生代中存放的是生存时间短的对象，通常只支持 1～8M 的容量；老生代中存放的生存时间长的对象，一些大的数据也会被直接分配到老生区中。而针对这两个区域，JS 存在两个垃圾回收器：主垃圾处理器和副垃圾处理器。这里先说说垃圾回收一般都有相同的执行流程：

1. 标记空间中活动对象和非活动对象

1. 回收非活动对象所占据的内存

1. 内存整理，这步是可选的，因为有的垃圾回收器工作过程会产生内存碎片，这时就需要内存整理防止不够连续空间分配给大数据

#### 副垃圾回收器

副垃圾回收器主要是采用 Scavenge 算法进行新生区的垃圾回收，它把新生区划分为两个区域：对象区域和空闲区域，新加入的对象都会存放到对象区域，当对象区域快被写满时，会对对象区域进行垃圾标记，把存活对象复制并有序排列至空闲区域，完成后让这两个区域角色互转，由此便能无限循环进行垃圾回收。同时存在对象晋升策略，也就是经过两次垃圾回收依然还存活的对象，会被移动到老生区中。

#### 主垃圾回收器

由于老生区空间大，数据大，所以不适用 Scavenge 算法，主要是采用标记-整理算法，其工作流程是从一组根元素开始，递归遍历这组根元素，在这个遍历过程中，能到达的元素称为活动对象，没有到达的元素就可以判断为垃圾数据。接着让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存。垃圾回收工作是需要占用主线程的，必须暂停JS脚本执行等待垃圾回收完成后恢复，这种行为称为**全停顿。** 由于老生代内存大，全停顿对性能的影响非常大，所以出现了增量标记的策略进行老生区的垃圾回收。



