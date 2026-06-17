# Unicode字符
>[Unicode与前端字符编码全揭秘 - 掘金 (juejin.cn)](https://juejin.cn/post/7070079762429034526)

### 产生背景
>计算机的底层是一个由0和1组成的数字世界，因此不能把现实中的字符（如：汉字、英语、标点符号等）直接写入内存，而必须先把它们转换成数字，然后把这些数字写入内存。等到读取的时候，再把数字转换成对应的字符。在这样一个字符和数字相互转换的过程中，就需要用到**字符集（Character Set）**。
>简单来讲，<span style="color:blue">字符集保存着字符和数字之间一对一的映射关系，而每个字符所对应的那个数字称为码点（Code Point）</span>。例如，ASCII就是被大家所熟知的一个字符集，其中字母`A`对应的码点是0x41（十六进制）。

ASCII包含的字符大部分是英文字母,英文字符和阿拉伯数字,为了适应各种符号及文字,Unicode就被创造出来了.

### 是什么
**Unicode**是一个超大字符集，其中几乎包含了全世界所有的字符

Unicode的码点范围，或者说编码空间，为U+0000..U+10FFFF，这些码点被平均分成17个**平面（Plane）**。其中，

- 第1个平面（U+0000..U+FFFF）称为**基本平面（Basic Multilingual Plane）**。
- 其余16个平面（U+10000..U+10FFFF）称为16个**补充平面（Supplementary Plane）**。

在一个平面中，又会根据字符类别划定大小不一的**区块（Block）**。例如，几乎所有的常用汉字都在基本平面中的CJK Unified Ideographs（U+4E00..U+9FFF）这个区块。

### 编码格式
字符必须先被转换成数字才能写入内存。那么，现在有了Unicode字符集，是不是只要将码点直接写入内存就可以了呢？事实并非如此。例如，对于字符串`狗🐶`，根据上文，可将其转换成十六进制码点序列`72D71F436`，进一步转换成二进制码点序列就是`11100101101011111111010000110110`。但在不了解原始字符串前提下,需要确定码点的边界,否则就无法准确的解码.一个简单的方法是通过将码点转换成二进制,把结果补齐到相同的位数(最高位前加0),然后再还原时以相同的位数单位进行读取.

例如,以`狗🐶`为例，整个转换过程如下：
```js
狗 -> U+72D7 -> 111001011010111 -> 000000011101011010111 
🐶 -> U+1F436 -> 11111010000110110 -> 000011111010000110110 

000000011101011010111000011111010000110110 
|-------------------||-------------------| 
21位                   21位
```

#### UTF-32
Unicode编码格式UTF-32类似于上面杜撰的UTF-21,也就是把码点统一补齐到32位(4个字节)
缺点: 浪费空间.

#### UTF-8
UTF-8针对不同范围的码点采用不同长度的字节数（1–4个字节）进行编码。整个编码过程相对复杂,在此不叙.
* 黑色的0和1表示固定标记位，用于确定码点边界。
* 其他颜色的0和1则表示如何将码点的各个比特位映射到对应的字节中。

![](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/.79u67s7xscs0.webp)

UTF-8节省空间，还具有兼容ASCII、容错率高、没有字节序问题等诸多优点。所以在日常开发中，像HTML、CSS和JS这些文件几乎都以UTF-8格式保存。

#### UTF-16
JS内部采用另外一种Unicode编码格式——UTF-16.
UTF-16的编码规则：
* 对于基本平面（U+0000..U+FFFF）中的码点，统一使用**2个字节**来表示，且与码点完全相同。
* 对于所有补充平面（U+10000..U+10FFFF）中的码点，先减去0x10000，于是数值范围变成0x00000–0xFFFFF，然后补齐到20位，最后把这20位一分为二。
* 将较高的10位处理后，称为**高位代理项（High Surrogate）**
* 将较低的10位处理后，称为**低位代理项（Low Surrogate）**
- 高位代理项（2个字节）和低位代理项（2个字节）在一起组成一个**代理对（Surrogate Pair）**。一个代理对（4个字节）编码一个补充平面的码点。



### JS与Unicode的历史变迁
<span style="color:red">JS内部使用UTF-16编码，但是许多API却无法处理补充平面中的码点。</span>比如`String.length`，就是以**2个字节为单位**计算字符串长度。而在UTF-16中，补充平面的码点需要占据4个字节,所以会出现`'狗'.length`等于1，而`'🐶'.length`等于2。

UTF-32和UTF-8的设计时间要早于UTF-16,JS恰好诞生在Unicode还只有一个基本平面，而UTF-16并不存在的年代.


### Unicode in JS
在UTF-16中，**1个码元（Code Unit）等于2个字节**。所以，我们可以说`String.length`是以UTF-16码元为单位计算字符串长度。

#### Unicode字符转义序列
在JS字符串中，我们一般都直接输入字符本身，不过在少数不方便输入字符的情况下，也可以通过`\u码元`或`\u{码点}`的方式来表示一个Unicode字符。这两种写法的最大区别就在于，`\u码元`必须通过代理对来表示补充平面的码点，例如：
```js
console.log('狗' === '\u72D7'); // output: true 
console.log('狗' === '\u{72D7}'); // output: true 
console.log('🐶' === '\uD83D\uDC36'); // output: true 
console.log('🐶' === '\u{1F436}'); // output: true

```


#### 以码点为单位分隔字符串
在JS中，和`String.length`行为相同的API还有很多，例如：`String.prototype.slice()`、`String.prototype.charAt()`和通过下标获取字符串中某个字符等，这些API都是以码元为单位分割字符串。所以如果字符串中包含补充平面的字符，就会出现问题。例如：
```js
const str = '🐶狗'; 
console.log(str.slice(1)); // output: "\udc36狗" 
console.log(str.charAt(1)); // output: "\udc36" 
console.log(str[1]); // output: "\udc36"

```


ES6之后，JS实现了以码点为单位分割字符串的迭代器——`String.prototype[@@iterator]()`。另外，`Array.from`和`for..of`也可以实现这个功能，因为它们在底层也都调用了这个迭代器。
```js
const str = '🐶狗';

// 1. iterator
const strIter = str[Symbol.iterator]();
console.log(strIter.next().value); // "🐶"
console.log(strIter.next().value); // "狗"

// 2. Array.from
console.log(Array.from(str));  // output: [ "🐶", "狗" ]

// 3. for..of
for (let v of str) {
  console.log(v);
}
// output: "🐶" "狗"
```


#### 以字符簇为单位分割字符串
虽然字符串自身的迭代器是以码点为单位分割字符串，但是也还是会遇到一些出乎意料的结果。例如：
```js
console.log(Array.from('🐕‍🦺'));  // output: [ "🐕", "‍", "🦺" ]
// 泰语
console.log(Array.from('สุ'));  // output: [ "ส", "ุ" ]
```

因为许多我们看起来是一个字符的图形或文字，实际是由多个码点组合而成。在上面的例子中，`🐕‍🦺`由3个码点组成，用转义序列可以表示为`"\u{1F415}\u{200D}\u{1F9BA}"`，而`สุ`可以表示为`"\u{0E2A}\u{0E38}"`。

这些从人类视觉角度被认为是单个字符的图形或文字，实际是由多个码点组合而成,在Unicode中被称为**字素簇（Grapheme Cluster）**。

如果要以字素簇为单位分割字符串，目前来说有两个方案。
第一个方案是原生API——[Intl.Segmenter](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fproposal-intl-segmenter "https://github.com/tc39/proposal-intl-segmenter")目前这个提案处于Stage 4，并且[Chrome和Safari已经支持](https://link.juejin.cn/?target=https%3A%2F%2Fcaniuse.com%2Fmdn-javascript_builtins_intl_segments "https://caniuse.com/mdn-javascript_builtins_intl_segments")。
另外一个方案就是调用第三方开源库，比如：[graphemer](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fflmnt%2Fgraphemer "https://github.com/flmnt/graphemer")、[text-segmentation](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fniklasvh%2Ftext-segmentation "https://github.com/niklasvh/text-segmentation")。这些库的实现原理是根据Unicode本身规定的[GraphemeBreakProperty](https://link.juejin.cn/?target=http%3A%2F%2Funicode.org%2Freports%2Ftr29%2F%23Default_Grapheme_Cluster_Table "http://unicode.org/reports/tr29/#Default_Grapheme_Cluster_Table")对文本进行切分.不多介绍.

```js
const segmenter = new Intl.Segmenter();
const segments = segmenter.segment('🐕‍🦺สุ');
// segments是可迭代的，所以可以用Array.from或for..of来调用其内部的迭代器
console.log(Array.from(segments));
// output: [
//   {segment: '🐕‍🦺', index: 0, input: '🐕‍🦺สุ'},
//   {segment: 'สุ', index: 5, input: '🐕‍🦺สุ'}
// ]
```


#### Unicode字符属性转义序列
在JS中，正则表达式默认也是以码元为单位进行匹配，不过可以通过添加`u`标记，将其转换成以码点为单位进行匹配。
```js
// 以码元为单位匹配
/^.$/.test('狗');    // return: true
/^.$/.test('🐶');    // return: false
// 以码点为单位匹配
/^.$/u.test('🐶');   // return: true
```
加上`u`标记之后，还为正则表达式提供了一个强大的功能——[Unicode字符属性转义序列（Unicode Property Escapes）](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FGuide%2FRegular_Expressions%2FUnicode_Property_Escapes "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes")，它可以大大简化编写Unicode字符相关的正则表达式的复杂度。

首先，让我们来了解下什么是Unicode字符属性。Unicode中的每一个字符都有许多属性，比如：`Age`（首次被收录的Unicode版本）、`Block`（所属区块）和`General_Category`（所属类别）等。以`狗`为例，下表列出了这个字符的部分属性（完整列表见[此处](https://link.juejin.cn?target=https%3A%2F%2Futil.unicode.org%2FUnicodeJsps%2Fcharacter.jsp%3Fa%3D%25E7%258B%2597%26B1%3DShow "https://util.unicode.org/UnicodeJsps/character.jsp?a=%E7%8B%97&B1=Show")）。

|Property Name|Type|Value|
|:--|:--|:--|
|Age|Catalog|1.1|
|Block|Catalog|CJK_Unified_Ideographs|
|General_Category|Enumeration|Other_Letter|
|Unified_Ideograph|Binary|Yes|

Unicode字符属性转义序列正是利用这些属性，让我们可以在正则表达式中很方便地筛选出符合条件的字符集合。语法如下：
```js
// 非Binary类型的属性
\p{PropertyName=PropertyValue}


// Binary类型的属性
\p{PropertyName}
```
以一个常见场景为例，如果你在网上搜索“如何用正则表达式匹配汉字”，八成会看到一个答案是`/[\u4E00-\u9FA5]/`。这是因为上文提到，大部分常用汉字都在CJK Unified Ideographs（U+4E00..U+9FFF）这个区块，并且在几十年前，这个区块中最后一个汉字的码点就是U+9FA5。

但是随着时间的推移，越来越多的生僻字被包括进Unicode中，而且大部分在其他区块中,另外，这些新的区块中的码点也不是一次性分配完毕的，而是随着Unicode的版本逐步分配。所以从当下来看，`/[\u4E00-\u9FA5]/`这个正则表达式在匹配常用汉字时依然够用，但是如果需要匹配所有汉字，那么就不准确了。
在这种情况下，用Unicode字符属性转义序列就能很方便地解决这个问题，因为`Unified_Ideograph`（中日韩统一表意文字）这个属性只有在汉字字符中才是`Yes`，其他都为`No`。所以正则表达式可以写成：
```js
// 匹配一个汉字
/\p{Unified_Ideograph}/u

// 实例：去除字符串中的所有汉字
'abc汉字'.replace(/\p{Unified_Ideograph}/ug, '');  // return: 'abc'
// 相反，如果想匹配字符串中的所有非汉字字符，则可以使用\P{...}
'abc汉字'.replace(/\P{Unified_Ideograph}/ug, '');  // return: '汉字'

```
这样，正则表达式就再也不需要改动，而且更简洁、更准确、可读性更强。
再举个例子，在`General_Category`这个属性中有个值为`Punctuation`，于是我们就可以很方便地匹配字符串中的所有标点符号，无论是中文标点，还是英文标点。示例如下：
```js
// 去掉字符串中所有的标点符号
'中，。；：‘“”’「」英,.?;:\'"!'.replace(/\p{General_Category=Punctuation}/ug, ''); // return: 中英


// General_Category还支持下面这种省略属性名的简写方式
'中，。；：‘“”’「」英,.?;:\'"!'.replace(/\p{Punctuation}/ug, ''); // return: '中英'

```

> [General_Category的完整列表](https://link.juejin.cn?target=https%3A%2F%2Fwww.unicode.org%2Freports%2Ftr44%2F%23GC_Values_Table "https://www.unicode.org/reports/tr44/#GC_Values_Table")

不过，目前在字符属性转义序列中只支持部分Unicode字符属性，比如`Age`就不支持，但是ES规范中指定了必须支持的[属性列表](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262%2Fmultipage%2Ftext-processing.html%23sec-runtime-semantics-unicodematchproperty-p "https://tc39.es/ecma262/multipage/text-processing.html#sec-runtime-semantics-unicodematchproperty-p")。如果不了解每个属性的用途，可以参考此[文档](https://link.juejin.cn?target=https%3A%2F%2Fwww.unicode.org%2Freports%2Ftr44%2F%23Property_List_Table "https://www.unicode.org/reports/tr44/#Property_List_Table")。另外，Unicode官方也提供了[工具](https://link.juejin.cn?target=https%3A%2F%2Futil.unicode.org%2FUnicodeJsps%2Flist-unicodeset.jsp%3Fa%3D%255B%253AUnified_Ideograph%253A%255D%26g%3D%26i%3D "https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5B%3AUnified_Ideograph%3A%5D&g=&i=")，方便查看具有某个属性的所有字符。

#### Normalization
由于一些历史原因和扩展的需要，许多字符在Unicode中有多种表现形式，既可以使用单一码点，也可以使用字素簇。例如，拼音中的`ǒ`，既可以用`"\u{01D2}"`来表示，也可以用`"\u{006F}\u{030C}"`。在第二种形式中，`"\u{006F}"`表示普通英文字母`o`，`"\u{030C}"`则表示拼音声调符号 `̌`。这两种形式所表达的字符语义完全相同，但是在字符串比较时却并不相同。

```js
console.log("\u{01D2}" === "\u{006F}\u{030C}"); // output: false
```

对于这种情况，JS原生提供了[normalize](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FString%2Fnormalize "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize")函数，方便在两种形式之间相互转换。
```js// NFC = Normalization Form Composition
// NFD = Normalization Form Decomposition
'\u{006F}\u{030C}'.normalize('NFC');  // return: '\u{01D2}'
'\u{01D2}'.normalize('NFD');          // return: '\u{006F}\u{030C}'

// 参数为空时，默认转换成NFC格式
'\u{006F}\u{030C}'.normalize();     // return: '\u{01D2}'
'\u{01D2}'.normalize();             // return: '\u{01D2}'


```
还有另外一些字符，看起来并不一样，用处也不同，比如：`⁵`（U+2075）和`5`（U+0035），`⁵`一般用来表示数学中的指数（如：`2⁵`）。但是，在一些上下文中可能表达一样的含义，比如：`⁵只狗`和`5只狗`。我们可以认为这两个5其实表达同样的意思，或者说是相互兼容的。在这种情况下，我们也可以使用normalize函数处理，只需设置参数为`NFKC`。不过，由于这种兼容性十分受到上下文的影响，所以要慎用。
```js
'⁵只狗'.normalize('NFKC');  // return: "5只狗"
```


#### Unicode与JS相互转换
> [javascript - JS基础篇--JS之汉字与Unicode码的相互转化 - 风雨过后见彩虹 - SegmentFault 思否](https://segmentfault.com/a/1190000012030831)

**汉字转换成`unicode`编码，使用JS的`charCodeAt()`方法就可以。**
```js
'好'.charCodeAt(0).toString(16) //597d
```

对Unicode解码的话，必须要用转义字符`'\u'`
```js
'\u54e6'
"哦"
```

汉字转unicode方法
```js
function toUnicodeFun(data){
  if(data == '' || typeof data == 'undefined') return '请输入汉字';
   var str =''; 
   for(var i=0;i<data.length;i++){
      str+="\\u"+data.charCodeAt(i).toString(16);
   }
   return str;
}

var resultUnicode = toUnicodeFun('中国'); // \u4e2d\u56fd
console.log(resultUnicode);


//其它方法
function toUnicode(s){ 
    return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g,function(newStr){
        return "\\u" + newStr.charCodeAt(0).toString(16); 
    }); 
}
```

unicode编码转换为汉字的方法:
```js
function toChineseWords(data){
    if(data == '' || typeof data == 'undefined') return '请输入十六进制unicode';
    data = data.split("\\u");
    var str ='';
    for(var i=0;i<data.length;i++){
        str+=String.fromCharCode(parseInt(data[i],16).toString(10));
    }
    return str;
}

var resultChineseWords = toChineseWords("\u4e2d\u56fd"); 
console.log(resultChineseWords);//中国
```

```js

```



### Unicode in HTML
在HTML中，除了直接输入字符本身之外，所有的Unicode字符还可以用**字符实体（Entity）** 来表示，格式为`&#十进制码点值;`或`&#x十六进制码点值;`，对于部分字符，还可以用`&实体名称;`表示。例如：

|Unicode字符|码点|十进制|十六进制|实体名称|
|---|---|---|---|---|
|<|`0x003C`|`&#60;`|`&#x3C;`|`&lt;`|
|🐶|`0x1F436`|`&#128054;`|`&#x1F436;`||

如果在浏览器中渲染以下html片段，你将会看到3只一模一样的狗子。
```html
<body>🐶 &#x1F436; &#128054;</body>
```
  
不过，当我们通过JS将上面的内容插入到body中时，不同的方法将得到不同的结果，例如：
```js
document.body.innerHTML = '🐶 &#x1F436; &#128054;';   // result: 🐶 🐶 🐶
document.body.textContent = '🐶 &#x1F436; &#128054;'; // result: 🐶 &#x1F436; &#128054;
```

这是因为，`innerHTML`将内容识别成HTML片段，所以会解析其中的字符实体，而`textContent`则将内容当做普通文本插入。


### Unicode in JSX

### Unicode in CSS
在CSS的字符串中，也可以用转义序列来表示一个Unicode字符，格式为`\十六进制码点值`。例如，`é`的码点为U+00e9，所以可以直接表示成`\e9`，前导0可以省略。
```css
.foo::after { content: '\e9'; /* é */ }
```

但是有些情况下，省略前导0可能会导致字符串解析错误。例如，如果把content的值改成`\e9cho`，你会发现最后浏览器中显示的结果是`ຜho`，而不是`écho`。这是因为解析器会把转义字符`\`后紧跟的连续的最多6个十六进制数字都用来组成码点。所以在`\e9cho`中，`\e9c`被解析成一个码点，而该码点对应的字符是`ຜ`。要想解决这个问题也很简单，只需要补全前导0即可，也就是`\0000e9cho`。


### 如何保证Unicode字符正确显示

上文中，我们提到如何在HTML、CSS和JS中使用转义序列或字符实体等形式来表示一个Unicode字符。但是，在允许的情况下始终应该优先选择输入Unicode字符本身，因为这样可维护性和可读性更好。但是，要想保证Unicode字符在浏览器中正确显示，我们还需要同时保证以下三点：

- 保存文件时，使用UTF-8编码。
- 对于HTML和CSS文件，需要在文件内声明编码格式，HTML为`<meta charset='utf-8'>`，CSS为`@charset 'utf-8'`。注意，虽然在HTML5中规定默认编码是UTF-8，但是有些浏览器并非如此（如：Safari），所以建议还是显式设置编码格式。
- 在服务器端，在请求资源的HTTP响应头中设置文件类型和编码格式，例如：`content-type: text/html; charset=utf-8`。

  


# 词法结构

> 编程语言的词法结构是一套基本规则,规定了如何使用这门语言编写程序.
>
> 词法结构是一门语言最低级的语法,规定了变量如何命名/注释的定界符/以及如何分割程序的语句等等.

* 区分大小写,空格和换行符
* 注释
* 字面量
* 标识符和保留字
* Unicode
* 可选的分号



### JS程序的文本

JS区分大小写, 意味着它的关键字, 变量, 函数名和其他标识符必须始终保持一致的大小写形式.

JS忽略程序记号(token)之间的空格.很大程度上,也忽略换行符. 可以在程序中随意使用空格和换行,可以按照便于理解的方式对程序进行格式化和缩进.

除了常规空格(`\u0020`), JS也将制表符, 各种ASCII控制符和Unicode间隔识别为空格.

将换行符, 回车符和回车换行识别为行终止符.



#### 回车和换行

> [回车和换行 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2006/04/post_213.html)

**来历**

打字机

回车(carriage return) : 原意是光标回到本行的开头

换行(line feed):光标往下一行,不一定是行首.

**表现**

Unix系统里，每行结尾只有"<换行>"，即"`\n`"；

Windows系统里面，每行结尾是"<回车><换行>"，即"`\r\n`"；

Mac系统里，每行结尾是"<回车>", `r`

一个直接后果是，Unix/Mac系统下的文件在Windows里打开的话，所有文字会变成一行；而Windows里的文件在Unix/Mac下打开的话，在每行的结尾可能会多出一个^M符号。



### 注释

JS支持两种注释: 单行注释,多行注释

单行注释:

 以`//`开头到一行末尾的内容

多行注释:

多行注释位于`/*`和`*/`之间,可以跨行,但不能嵌套.



### 字面量

> 字面量(literal)是一种直接出现在程序中的数据量.

```javascript
12
1.2
'hello world'
'Hi'
true
false
null
```



### 标识符和保留字

#### 标识符

标识符就是一个名字. 在JS中,标识符用于在JS代码中命名常量,变量,属性,函数和类,以及为某些循环提供标记(label).

#### 命名规则

必须以**字母, 下划线或美元符号**开头, 数字不能作为第一个字符,以便JS区分标识符和数值.
[[标识符#JS中标识符命名规范]]


### Unicode

JS程序是使用Unicode字符集编写的,因为在字符串和主时钟可以使用任意Unicode字符.

考虑到可以执行和易于编辑,建议在标识符中只是用ASCII字母和数字.

#### Unicode转义序列

某些计算机硬件和软件无法显示,输入或正确处理全部Unicode字符, 为了编码和支持使用老技术的系统,JS定义了转义序列,从而可以仅使用ASCII字符来表示Unicode字符. ^7c5949

这些Unicode字符以`\u`开头,后跟4位16进制数字或包含在一对花括号内的1~6位十六进制数字.

Unicode转义序列可以出现在JS字符串字面量, 正则表达式字面量和标识符中(不能出现在语言关键字中).

例如:

字符 `é` 的Unicode转义序列是`\u00E9`,以下是3种在变量种使用这个字符的示例:

```javascript
let café = 1; //使用Unicode字符定义一个变量
caf\u0009  // => 1; 使用转义序列访问这个变量
caf\u{E9}  // => 1; 相同转义序列的另一种形式
```

JS转义序列带大括号的版本是ES6新增的,为了更好的支持大于16位的Unicode码点,比如表情符号:

```javascript
console.log('u\{1F600}')
```

注释中的Unicode转义序列会被当做ASCII字符处理,不会被解释为Unicode

#### Unicode归一化

Unicode允许用多种编码方式表示同一个字符.

例如: 字符`é`可以被编码为一个Unicode字符`\u00E9`, 也可以被编码为一个常规ASCII字符'e'后跟一个重音组合标记`u\0301`.  这两种编码在文本编辑器中看起来完全相同,但他们的二进制编码不同,因为JS认为它们不同,这会导致很大的问题:

```javascript
const café = 1; //这个常量名为'caf\u{e9}'
const café = 2; //这个常量名为'cafe\u{301}'

café //1
café //2
```



Unicode标准为所有字符定义了首选编码并规定了归一化例程,用于把文本转换为适合比较的规范形式. JS假定自己解释的源代码已经归一化,它自己不会执行任何归一化.

如果你想在JS程序中使用Unicode字符,应该保证使用自己的编辑器或其他工具对自己的源代码执行Unicode归一化,以防其中包含看起来一样但实际不同的标识符.



### 可选的分号

JS使用分号(`;`)分隔语句.

在JS中,如果两条语句分别写在两行,通常可以省略它们之间的分号.

在程序末尾,如果接下来的记号是右花括号, 也可以省略分号.

**代码风格:**

一种使用分号明确标识语句结束,即便这些分号并非必须

另一种风格是尽可能省略分号,只在少数必要情况下采用.

**换行符 不一定等于 分号**

JS并非在任何时候都把换行符当做分号,而只是在不隐式添加分号就无法解析代码的情况下才这么做.具体来说,JS只在下一个非空格字符无法被解释为当前语句的一部分时才把换行符当做分号.

```javascript
let a
a
=
3
console.log(a)
```

JS将以上代码解析为:

```javascript
let a; a=3; console.log(a)
```

之所以把第一个换行符当做分号,是因为如果没有分号,JS就无法解析代码`let a a`.第二个a本身就是一条独立语句,但JS并没有把第二个换行符当做分号,是因为还可以继续解析更长的语句..

**防御性分号**

注意事项:

通常,如果语句以`(, [, /, +, -`其中任一开头,就有可能被解析为之前语句的一部分.实践中,以`/, +, -`开头的语句极少,但以`(, [`开头的语句不在少数.可以看到有的程序员在所有这种语句前面防御性的添加一个分号,这样即使前面的的语句被修改,删掉了之前末尾的分号,也不会影响当前语句:

```Javascript
let x = 0 //省略分号
;[x, x+1, x+2].forEach(console.log) //防御:保证这条语句的独立
```

3**种例外**

JS在不能把第二行解析为第一行的连续部分时,对换行符的解释有三种例外.

第一种: 涉及return, throw, yield, break, continue,这些语句经常独立存在,但有时后面也跟一个标识符或表达式.如果这几个单词后面有换行符,JS就会把这个换行符解释为分号. 这意味着一定不能在return, break, continue等关键字和它们后面的表达式之间加入换行符.

第二种: 涉及`++` 和 `--`操作符.如果当做后置操作符,那么必须与自己操作的表达式位于同一行.

第三种: 简洁箭头语法定义的函数, 箭头必须跟参数列表在同一行.






## 编码格式

在ECMAScript 6出现以前，JavaScript字符串一直基于16位字符编码（UTF-16）进行构建。每16位的序列是一个编码单元（code unit），代表一个字符. length、charAt()等字符串属性和方法都是基于这种编码单元构造的。在过去16位足以包含任何字符，直到Unicode引入扩展字符集，Unicode的目标是为全世界每一个字符提供全球唯一的标识符。如果我们把字符长度限制在16位，码位数量将不足以表示如此多的字符。

UTF-16中，前2<sup>16</sup>个码位均以16位的编码单元表示，这个范围被称作基本多文种平面（BMP，Basic Multilingual Plane）。超出这个范围的码位则要归属于某个辅助平面（supplementaryplane），其中的码位仅用16位就无法表示了。为此，UTF-16引入了代理对（surrogate pair），其规定用两个16位编码单元表示一个码位。

字符串里的字符有两种，一种是由一个编码单元16位表示的BMP字符，另一种是由两个编码单元32位表示的辅助平面字符。

```javascript
let text = '𠮷';
console.log(text.length); //2
console.log(/^.$/.test(text)); //false
console.log(text.charAt(0)); //''
console.log(text.charAt(1)); //''
console.log(text.charCodeAt(0)); //55362
console.log(text.charCodeAt(1)); //57271

//Unicode字符“[插图]”是通过代理对来表示的，因此，这个示例中的JavaScript字符串操作将其视为两个16位字符。
```



```JavaScript
字符串在计算机底层实际上就是一个字符数组
let str = 'Hello'; --> ['H', 'e', 'l', 'l', 'o'];

因为字符串是不可变数据类型,所以数组的破坏性方法无法使用.
```




# 标识符Identifier
### 定义
代码中用来标识**[变量 (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Variable)、[函数](https://developer.mozilla.org/zh-CN/docs/Glossary/Function)、或[属性 (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/property)的字符序列。(MDN)

>标识符与字符串不同之处在于字符串是数据，而标识符是代码的一部分。在 JavaScript 中，无法将标识符转换为字符串，但有时可以将字符串解析为标识符。



### 分类
>语言中的标识符一般可以分为两类，一类用于命名语法、符号等抽象概念，另一类用于命名数据（的存储位置）。前者被称为“**语法关键字**”，后者则被称为“**变量**”和“**常量**”。并且由此引入了一个概念：绑定。
>从标识符的角度来说，绑定分为语法关键字与语义逻辑的绑定，以及变量与它所存储数据和位置性质的绑定。
>其中，语法关键字对语义逻辑的绑定结果，是对<u>作用域</u>的限定；变量对位置性质的绑定结果，则是对<u>变量生存周期</u>的限定。

### 声明
<u>所谓声明，即约定数据的生存周期和逻辑的作用域</u>。由于这里的“声明”已经涵盖了逻辑与数据（这相当于“程序”的全部），因此整个编程的过程，其实被解释成了“说明逻辑和数据”的过程：

* 纯粹陈述“数据”的过程，被称为变量和类型声明
* 纯粹陈述“逻辑”的过程，被称为语句（含流程控制子句）
* 陈述“数据与（算法的）逻辑”的关系的过程，被称为表达式
![标识符与其语义关系的基本分类](https://cdn.jsdelivr.net/gh/aotushi/image-hosting@master/documentation/标识符与其语义关系的基本分类.4qzse7tlu4y0.png)
除了“声明”在语义上对绑定内容的限制之外，当一个被声明的标识符（变量、常量或符号等）去绑定一个数据时，事实上还有其他两个方面的语义：数据（受作用域限制）的生存周期及可写性。这三者是JavaScript在：

* 用于显式数据声明的语句let/var/const、函数声明与类声明
* 数种for语句、try...catch语句、赋值语句
* 在函数调用和new运算符等语法中通过形式参数传入值

这些语义中都存在着隐式或显式数据声明的原因：它们有着各自在“作用域、值和可写性”三方面的不同性质


### JS中标识符命名规范
* 标识符可以含有**字母,数字,下划线,$**,但不能以数字开头. 
  * 下划线开头的变量一般是隐藏变量,不需要被别人访问
  * $开头的变量一般是系统用的变量
  * 严格区分大小写
* 标识符不能是JS中的关键字和保留字,也不建议浏览器中的内置函数(变量)作为标识符
  * 查询文档MDN
* 标识符需要采用驼峰命名法
  * 小驼峰: 首字母小写,单词开头大写,其余字母小写
  * 大驼峰: 单词首字大写 一般多用于类


### 非法的标识符
开发中遇到这么一个问题, 在暴露的常量js文件中声明了一个对象, 其属性值为没有加引号的汉字.vue项目执行后, 报错汉字没有声明.
如果不符合标识符命名规范,就必须使用引号将其括起来,否则会产生语法错误。
```js
1var     // 不能以数字开头
my var   // 不能包含空格  
my-var   // 不能包含连字符
var      // var是保留字
中文标识符 // 不能包含非ASCII字符
```




### 字面量

<u>字面量是由语法表达式定义的常量；或，通过由一定字词组成的语词表达式定义的常量</u>

字面量是常量，其值是固定的，而且在程序脚本运行中不可更改.

**几种常用的字面量**

**1.数组字面量(Array literals)**

> 数组字面值是一个封闭在方括号对([])中的包含有零个或多个表达式的列表，其中每个表达式代表数组的一个元素。当你使用数组字面值创建一个数组时，该数组将会以指定的值作为其元素进行初始化，而其长度被设定为元素的个数。
>
> 数组字面值同时也是数组对象。有关数组对象的详情请参见[数组对象](https://developer.mozilla.org/zh-CN/docs/JavaScript/Guide/Predefined_Core_Objects#Array_Object)一文

**2.布尔字面量(Boolean literals)**

> 布尔类型有两种字面量：`true`和`false`
>
> 不要混淆作为布尔对象的真和假与布尔类型的原始值true和false。布尔对象是原始布尔数据类型的一个包装器

**3.浮点数字面量(Floating-point literals)**

**4.数字字面量(Numberic Integers)**

> JS 数字字面量包括不同进制的整数字面量和10进制的浮点数字面量
>
> 语言规范要求数字字面量不能带符号. 尽管如此,像`-123.4`这样的代码块是合理的, 会被解释为应用到数字字面量`123.4`的一元`-`操作符.

**4.1 整数字面量(Integer literals)**

> 整数和大整数字面量能以10进制,16进制,8进制和2进制书写.

```js
. 10进制整数字面量是没有0开头的一系列数字
. 正数字面量开头以0,或0o表明它是八进制. 八进制整数字面量只包含整数0-7.
. 开头0x(0X)表明一个16进制整数字面量,16进制整数包含数字0-9,字母a-f,A-F.(符号不能改变它的值,所以0xa = 0XA = 10,0xf=0XF=15)
. 开头以0b(0B)开头表明一个二进制整数字面量. 二进制整数字面量只能包含数字0和1.
. 跟随n后缀的整数字面量表明一个大整数字面量. 这个整数字面量能用上面例子中的任何一个. 注意以0开头8进制例如0123n是不被允许的,但是0o123n是可以的.
```



**4.2 浮点数字面量(Floating-pont literals)**

> 浮点字面量含有以下部分:

```js
一个没有符号的十进制整数

一个小数点

一部分(另一个小数) A fraction(another decimal number)

一个指数(An exponent)
```

这个指数部分是一个跟在一个整数后的`e`或`E`, 可以添加`+` 或 `-`来标志.

一个浮点数字面量必须至少有一个数字, 且有一个小数点或 `e`(或 `E`)

语法:

```js
[digits].[digits][(E|e)[(+|-)]digits]
```

案例:

```js
.1e-23
3.1E+12
.1234
3.1415926
```



**5.对象字面量(Ojbect literals)**

> 一个对象字面量是一个空列表或多对属性名和对应的值的列表,封闭在大括号中.

对象属性名字能用任何字符串,包括空字符. 如果属性名不是一个合法的标识符或数字, 它必须用引号引起来(it must be enclosed in quotes)

属性名如果不是合理的标识符不能通过点(.)属性获取,但是可以通过类数组符号('[]')来获取.

**5.1 加强版对象字面量**

> 在ES2015中, 对象字面量是为了支持设置构造函数的原型, 对象`foo:foo`声明的简写,声明方法, 用作`super`调用, 表达式计算属性名称
> 总之, 这也使对象字面量和类声明更紧密的结合在一起, 并允许基于对象的设计为相同的设施带来益处.(and allowed object-based design to benefit from some of the same conviniences)

```js
let obj = {
  //__proto__
  __proto__:theProtoObj,
  //Shorthand for 'handler: handler'
  handler,
  //methods
  toString() {
    //Super calls
    return 'd ' + super.toString();
  },
  //Computed (dynamic) property names
  ['prop_' + (() => 42)()]: 42
};
```



**6.RegExp literals**

> 正则字面量是一个斜杠包含的样式.

```js
let re = /ab+c/;
```



**7.字符串字面量(String literals)**

> 字符串字面量是使用双引号或单引号引用的空字符或多个字符.
> 字符串必须被相同类型的引用符号限制.

**字符串中使用转义字符**

> 除了普通字符, 也能在字符串中使用特殊字符.

```js
'one line \n another line'
```



# 变量与常量


### 声明
JavaScript 有三种声明方式。

var
声明一个变量，可选初始化一个值。

let
声明一个块作用域的局部变量，可选初始化一个值。

const
声明一个块作用域的只读常量

var/let/const声明变量
[[202301161338]]


### 声明变量
[[标识符#JS中标识符命名规范]]

[MDN中的规则](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#%E5%8F%98%E9%87%8F)

var/let/const声明变量

### 变量求值
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#%E5%8F%98%E9%87%8F%E6%B1%82%E5%80%BC)


### 变量的作用域


### 块级作用域

#### 0. 背景

<u>为了加强对变量生命周期的控制,ES6引入了块作用域</u>

来个例子:

通过var声明的变量存在变量提升的特性:

```javascript
if (condition) {
  var value = 1;
}

console.log(value);
```

因为存在变量提升,代码相当于:

```javascript
var value;
if (condition) {
  value = 1;
}
console.log(value);
```

如果 condition 为 false，结果会是 undefined。





### 变量定义
对值得命名引用 [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Variable)


#### 变量赋值发生了什么?
**值传递**: 相当于一份全新的拷贝, 将这份拷贝放在另一个内存地址里.

**引用传递**: 相当于为这两个变量指定同一个地址,即新变量对旧变量的一个引用.

JS作为弱类型语言(某一个变量被定义类型,该变量可以根据环境变化自动进行转换,不需要经过显性强制转换),它的赋值语句既有值传递,也有引用传递:

对基本类型(string, number, boolean, null, undefined)使用值传递

对引用类型(除基本类型外的其他类型)使用引用传递




### 常量



let a;  //使用let关键字声明变量.  
		//一个变量声明却没有赋值,那么它的值就是undefined

let b,c,d; //可同时声明多个变量 不能重复声明. var可以重复声明一个变量

a=33; //赋值变量 可任意修改   将等号右边的值赋值给左边的变量,变量只有在等号左边的时候才是变量 
a=true; //后写覆盖先写

声明常量
const声明的常量只能进行一次赋值,无法修改const b=33;

使用MDN查询兼容性

let是ES6新增的,兼容性较差. 
对于IE来说,let支持度不好.如果需要兼容IE,需要使用var代替,用法和let一样,也可以声明多个变量






声明&赋值同时进行

```js
let f = "abc";
let 变量 = 值;
let 变量 = 值, 变量 = 值;
var 变量 = 值;
---------------------------

在全局中:
var a = 10;
var a = 11; //var可以重新声明变量,也相当于window.a = 11;
b = 12; //相当于window.b = 12;

```

变量赋值的实例

```javascript
var a = {n: 1}  
var b = a;  
a.x = a = {n: 2} 
console.log(a.x);   
console.log(b.x);

简化:
var a = {n:1}; //将变量a的值(地址)链接向对象的地址
var b = a;	   //变量a赋值给变量b, 将变量b的值(地址)链接向对象的地址
a.x = {n:2}; a = {n:2}; //第一句的意思是向a代表的对象{n:1}中添加新的属性,那么现在的对象就是{n:1,x:{n:2}}. 第二句的意思是将一个新的对象地址赋值给变量a,此时原变量a覆盖.

console.log(a.x); //此时变量a指向的新对象中没有名为x的属性,所以返回undefined
console.log(b.x); //{n:2}

```



#### let,const和var的区别
* 1.let声明的变量有块作用域,var声明的变量没有
* 2.var声明的变量会提升,let声明的不会
* 3.var声明的全局变量会添加到window对象中; let或const不能覆盖全局变量只能遮蔽它
* 4.let不能重复声明变量 var可以.(var先声明,let再次声明也不行)

常量声明const、类声明class在块级作用域上的特性与let声明是类似的


let声明

let声明的用法与var相同。

用let代替var来声明变量，就可以把变量的作用域限制在当前代码块中

由于let声明不会被提升，因此开发者通常将let声明语句放在封闭代码块的顶部，以便整个代码块都可以访问

禁止重复声明： 假设作用域中已经存在某个标识符，此时再使用let关键字声明它就会抛出错误

```javascript
function getValue(condition) {
  if (condition) {
    let value = 'blue';
    //其他代码
    return value;
  } else {
    //变量value在此处不存在
    return null;
  }
  //变量value在此处不存在
}
```

变量value改由关键字let进行声明后，不再被提升至函数顶部。执行流离开if块，value立刻被销毁。如果condition的值为false，就永远不会声明并初始化value。

```javascript
var count = 30;

//抛出语法错误
let count = 40;
```

同一作用域中不能用let重复定义已经存在的标识符，所以此处的let声明会抛出错误。但如果当前作用域内嵌另一个作用域，便可在内嵌的作用域中用let声明同名变量，

```javascript
var count = 30;
if(condition) {
  let count = 40; //不会抛出错误
  //更多代码
}
```



##### const声明

使用const声明的是常量，其值一旦被设定后不可更改。因此，每个通过const声明的常量必须进行初始化

const声明不允许修改绑定，但允许修改值

```javascript
//有效的常量
const jmaxItems = 30;

//语法错误： 常量未初始化
const name;


const person = {name: 'Nicholas'};
//可以修改对象属性的值
person.name = 'Greg';

//抛出语法错误
person = {
  name: 'Greg'
}
```



const & let声明比较

1.都是块级标识符，只在当前代码块内有效，一旦执行到块外汇立即被销毁；
2.在同一作用域声明已经存在的标识符会导致语法错误，<u>无论标识符是使用var(全局或函数),还是let(块级作用域)声明的</u>。

3.无论是否是严格模式，都不能为const定义的常量再赋值
4.JS中的常量如果是对象，则对象的值可以修改;const声明不允许修改绑定,但允许修改绑定的值


#### 为什么let和const不存在变量提升？
> [为什么let和const不存在变量提升？ - 知乎](https://www.zhihu.com/question/535442142/answer/2510328090)

很多 JS 问题的研究都可以按照下面的顺序由浅入深：

引擎的表现是怎么样的？
规范是如何规定的？
为什么这么设计？

1.也可以说 let/const 也是存在提升的，因为它的确已经提前声明了，只是没初始化，从报错信息也可以看出，引擎已经提前感知到了它的存在。
```js
alert(a) // ReferenceError: Cannot access 'a' before initialization
alert(b) // ReferenceError: b is not defined
let a = 1
```

2.想要解释 let/const 为什么不存在提升，那就得先知道 var 为什么要提升。其实没什么好的原因，Brendan Eich 解释过 var 的提升是没设计好，他的本意是只让函数声明可以提升。函数提升是主要是为了可以把函数声明放在代码的尾部，这样也方便前面代码的阅读

3.既然 var 的提升都是意外，那 let/const 就更不想提升了。早在 ES4/3.1 时期（2008年），他们就大概决定了声明前使用（use-before-declare）是个不好的设计，也就是想让 let/const 没有提升。

4.那如果就在声明前使用了，该怎么办。有两种方案: 1是让它指向外层作用域的变量,也就是同一个作用域里的同名变量，可以有两个不同的绑定，这个因为一些原因被否掉了; 2是报错（dead zone）。报错有两个方案，一个是根据空间上、词法上、源码的文本顺序来看，只要在声明前使用，就报错，这个叫 Lexical dead zone（词法死区），这个也被否掉了
```js
f()
let a = 1 
function f() {alert(a)}
```

因为 a 的使用虽然从源码顺讯上是放在了 let a 后面，但从执行时间上却先求值了。所以只剩最后一个方案，时间死区（Temporal dead zone），也就是最终到了 ES6 里的 TDZ，这里 temporal 不是暂时的意思，temporal 有”时间的“含义，和空间相对应，比如最新替代 Date 的规范也叫 Temporal。所以结尾总结一下，为什么 let 和 const 不存在变量提升，因为提升成一个 undefined 的设计并不好。



### 变量作用域

#### 2. 块级声明

> 块级声明用于声明在指定块的作用域之外无法访问的变量。块级作用域（亦被称为词法作用域）存在于：
>
> · 函数内部
>
> · 块中（字符{和}之间的区域）

很多类C语言都有块级作用域，而ECMAScript 6引入块级作用域就是为了让JavaScript更灵活也更普适。




#### 3. 循环中的块作用域绑定

##### 3.0 简介

```javascript
for (var i=0; i<10; i++) {
  process(item[i]);
}

//这里仍然可以访问变量i
console.log(i); //10

```

在默认拥有块级作用域的其他语言中，这个示例也可以正常运行，并且变量i只在for循环中才能访问到。而在JavaScript中，<u>由于var声明得到了提升，变量i在循环结束后仍可访问</u>。如果换用let声明变量就能得到想要的结果

```javascript
for (let i=0; i<10; i++) {
  process(items[i]);
}

//i在这里不可以访问， Uncaught ReferenceError: i is not defined
console.log(i); 

//在这个示例中，变量i只存在于for循环中，一旦循环结束，在其他地方均无法访问该变量。
```



##### 3.1. 循环中的函数

```javascript
var funcs = [];
for (var i=0; i<10; i++) {
  funcs.push(function() {
    console.log(i);
  });
}

funcs.forEach(function(func) {
  func();   //输出10次数字10
})

//another version
var func = []
for (var i=0; i<3; i++) {
  func[i] = function() {
    console.log(i);
  }
}
func[0](); //3
```

你预期的结果可能是输出数字0～9，但它却一连串输出了10次数字10。这是因为循环里的每次迭代同时共享着变量i，循环内部创建的函数全都保留了对相同变量的引用。循环结束时变量i的值为10，所以每次调用console.log(i)时就会输出数字10。

**解决**

##### 3.1.1 IIFE(立即调用函数表达式)

使用立即调用函数表达式（IIFE），以强制生成计数器变量的副本

```javascript
var funcs = [];

for (var i=0; i<10; i++) {
  funcs.push((function(value) {
    return function() {
      console.log(value);
    }
  }(i)))
}
```

在循环内部，IIFE表达式为接受的每一个变量i都创建了一个副本并存储为变量value。这个变量的值就是相应迭代创建的函数所使用的值，因此调用每个函数都会像从0到9循环一样得到期望的值。ECMAScript 6中的let和const提供的块级绑定让我们无须再这么折腾。



##### 3.1.2 for循环中的let声明

let声明模仿上述示例中IIFE所做的一切来简化循环过程，每次迭代循环都会创建一个新变量，并以之前迭代中同名变量的值将其初始化。这意味着你彻底删除IIFE之后仍可得到预期中的结果

```javascript
let funcs = [];

for (let i=0; i<10; i++) {
  funcs.push(function() {
    console.log(i);
  })
}

funcs.forEach(function(func) {
  func(); //输出0-9
})
//
let funcs = [];
let obj = {
  a: true,
  b: true,
  c: true
};

for (let key in obj) {
  funcs.push(function() {
    console.log(key);
  })
}

funcs.forEach(function(func) {
  func();  //a b c
})
```

这段循环与之前那段结合了var和IIFE的循环的运行结果相同，但相比之下更为简洁。

<span style="text-decoration: underline wavy blue;">每次循环的时候let声明都会创建一个新变量i，并将其初始化为i的当前值，所以循环内部创建的每个函数都能得到属于它们自己的i的副本。对于for-in循环和for-of循环来说也是一样的</span>

[问题](https://github.com/mqyqingfeng/Blog/issues/82#:~:text=%E5%A6%82%E6%9E%9C%E8%A6%81%E8%BF%BD%E7%A9%B6%E8%BF%99%E4%B8%AA%E9%97%AE%E9%A2%98%EF%BC%8C%E5%B0%B1%E8%A6%81%E6%8A%9B%E5%BC%83%E6%8E%89%E4%B9%8B%E5%89%8D%E6%89%80%E8%AE%B2%E7%9A%84%E8%BF%99%E4%BA%9B%E7%89%B9%E6%80%A7%EF%BC%81%E8%BF%99%E6%98%AF%E5%9B%A0%E4%B8%BA%20let%20%E5%A3%B0%E6%98%8E%E5%9C%A8%E5%BE%AA%E7%8E%AF%E5%86%85%E9%83%A8%E7%9A%84%E8%A1%8C%E4%B8%BA%E6%98%AF%E6%A0%87%E5%87%86%E4%B8%AD%E4%B8%93%E9%97%A8%E5%AE%9A%E4%B9%89%E7%9A%84%EF%BC%8C%E4%B8%8D%E4%B8%80%E5%AE%9A%E5%B0%B1%E4%B8%8E%20let%20%E7%9A%84%E4%B8%8D%E6%8F%90%E5%8D%87%E7%89%B9%E6%80%A7%E6%9C%89%E5%85%B3%EF%BC%8C%E5%85%B6%E5%AE%9E%EF%BC%8C%E5%9C%A8%E6%97%A9%E6%9C%9F%E7%9A%84%20let%20%E5%AE%9E%E7%8E%B0%E4%B8%AD%E5%B0%B1%E4%B8%8D%E5%8C%85%E5%90%AB%E8%BF%99%E4%B8%80%E8%A1%8C%E4%B8%BA%E3%80%82):

* 如果不能重复声明,在循环第二次的时候,应该报错
* 即使因为某种原因重复声明不报错,一遍遍迭代最终值还应该是3
* 有种说法是for循环设置循环变量的那部分是一个单独的作用域

比如:

```javascript
for (let i=0; i<3; i++) {
  let i = 'abc';
  console.log(i);
}
//abc
//abc
//abc


这个例子是对的.如果我们把let改成var呢?
for (var i=0; i<3; i++) {
  var i = 'abc';
  console.log(i);
}
//abc
```

为什么结果就不一样了呢，如果有单独的作用域，结果应该是相同的呀……

如果要追究这个问题，就要抛弃掉之前所讲的这些特性！这是因为 let 声明在循环内部的行为是标准中专门定义的，不一定就与 let 的不提升特性有关，其实，在早期的 let 实现中就不包含这一行为。

我们查看[ ECMAScript 规范第 13.7.4.7 节](http://www.ecma-international.org/ecma-262/6.0/#sec-for-statement-runtime-semantics-labelledevaluation):  还看不懂????

![](https://camo.githubusercontent.com/b1b019f0cf27a4e36b315d9761594077554533a3dfb31812986969f33cc67ed4/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f4553362f6c65742f6c65742d65636d612e706e67)

在 for 循环中使用 let 和 var，底层会使用不同的处理方式。

使用let的时候: 在 `for (let i = 0; i < 3; i++)` 中，即圆括号之内建立一个隐藏的作用域，这就可以解释为什么上面案例打印了3此'abc'.

然后**<span style="color: red">每次迭代循环时都创建一个新变量,并以之前迭代中同名变量的值将其初始化</span>**.如下面案例所示代码和伪代码:

```javascript
var funcs = [];
for (let i=0; i<3; i++) {
  funcs[i] = function() {
    console.log(i);
  }
}

funcs[0](); //0


//伪代码
(let i=0) { funcs[0] = function() {console.log(i)}; }
(let i=1) { funcs[0] = function() {console.log(i)}; }
(let i=2) { funcs[0] = function() {console.log(i)}; }
```

当执行伪代码函数的时候,根据词法作用域就可以找到正确的值,其实你也可以理解为let声明模仿了闭包的做法来简化循环过程.



##### 3.1.3 循环中的const声明

ECMAScript 6标准中没有明确指明不允许在循环中使用const声明，然而，针对不同类型的循环它会表现出不同的行为。

* 普通for循环 
* for-in或for-of循环



对于普通的for循环来说，可以在初始化变量时使用const，但是更改这个变量的值就会抛出错误

在这段代码中，变量i被声明为常量。在循环的第一个迭代中，i是0，迭代执行成功。然后执行i++，因为这条语句试图修改常量，因此抛出错误

```javascript
var funcs = [];

//完成一次迭代后抛出错误
for (const i=0; i<10; i++) {
  funcs.push(functions() {
  	console.log(i);           
  })
}
```

在for-in或for-of循环中使用const时的行为与使用let一致。

> 之所以可以运用在for-in和for-of循环中，是因为每次迭代不会（像前面for循环的例子一样）修改已有绑定，而是会创建一个新绑定。

```javascript
var funcs = [],
    obj = {
      a: true,
      b: true,
      c: true
    };

//不会产生错误
for (const key in obj) {
  funcs.push(function() {
    console.log(key);
  })
}

funcs.forEach(function(func) {
  func(); //输出a b c
})
```



##### 3.2 最佳实践

* 开发中默认使用let而不是var,对于需要写保护的变量使用const
* 另一种做法: 默认使用const, 只有当确实需要改变变量的值的时候才使用let.

#### 4. 全局块作用域绑定

> 当var被用于全局作用域时，它会创建一个新的全局变量作为全局对象（浏览器环境中的window对象）的属性。这意味着用var很可能会无意中覆盖一个已经存在的全局变量

```javascript
//浏览器中
var RegExp = 'hello';
console.log(window.RegExp); //'hello'   覆盖了原来window上的RegExp

var ncz = 'hi';
console.log(window.ncz); //'hi'
```

>  <u>如果你在全局作用域中使用let或const，会在全局作用域下创建一个新的绑定，但该绑定不会添加为全局对象的属性。换句话说，用let或const不能覆盖全局变量，而只能遮蔽它。</u>

```javascript
let RegExp = 'hello';
console.log(RegExp); //'hello'
console.log(window.RegExp === RegExp); //false

const ncz = 'hi';
console.log(ncz); //'hi'
console.log('ncz' in window); //false
```

这里let声明的RegExp创建了一个绑定并遮蔽了全局的RegExp变量。结果是window.RegExp和RegExp不相同，但不会破坏全局作用域。同样，const声明的ncz创建了一个绑定但没有创建为全局对象的属性。如果不想为全局对象创建属性，则使用let和const要安全得多。

Note: 如果希望在全局对象下定义变量，仍然可以使用var。这种情况常见于在浏览器中跨frame或跨window访问代码。



#### 5. 最佳实践

> 默认使用const，只有确实需要改变变量的值时使用let




### 变量提升

#### 1. var声明及变量提升（Hoisting）机制

在函数作用域或全局作用域中通过关键字var声明的变量，无论实际上是在哪里声明的，都会被当成<u>在当前作用域顶部</u>声明的变量，这就是我们常说的提升（Hoisting）机制。

```javascript
function getValue(condition) {
  if(condition) {
    var value = 'blue';
    //其他代码
    return value;
  } else {
    //此处可访问value，其值为undefined
    return null;
  }
  //此处可访问value， 其值为undefined
}
```

事实上，无论如何变量value都会被创建。在预编译阶段，JavaScript引擎会将上面的getValue函数修改成下面这样

```javascript
function getValue(condition) {
  var value;
  if(condition) {
    value = 'blue';
    //其他代码
    return value;
  } else {
    return null;
  }
}
```

<u>变量value的声明被提升至函数顶部，而初始化操作依旧留在原处执行，这就意味着在else子句中也可以访问到该变量，且由于此时变量尚未初始化，所以其值为undefined.</u>   ECMAScript 6引入块级作用域来强化对变量生命周期的控制。



#### 为什么let和const不存在变量提升

> [为什么let和const不存在变量提升？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/535442142/answer/2510328090)

```
很多 JS 问题的研究都可以按照下面的顺序由浅入深:

1.引擎的表现是怎么样的？
2.规范是如何规定的？
3.为什么这么设计？
```



##### 背景

一段代码在被真正的执行前，会有个专门用来声明变量的过程，俗语常把这个过程称为预解析/预处理。无论是用 var 还是用 let/const 声明的变量，都是在这个过程里被提前声明好的，俗语常把这种表现称为 hoisting。只是 var 和 let/const 有个区别，var 变量被声明的同时，就会被初始化成 undefined，而后两者不会。

规范规定一个已经声明但未初始化的变量不能被赋值，甚至不能被引用.规范里用来声明 var/let 变量的内部方法是 CreateMutableBinding()，初始化变量用 InitializeBinding()，为变量赋值用 SetMutableBinding()，引用一个变量用 GetBindingValue()。在执行完 CreateMutableBinding() 后没有执行 InitializeBinding() 就执行 SetMutableBinding() 或者 GetBindingValue() 是会报错的，这种表现有个专门的术语（非规范术语）叫 TDZ（Temporal Dead Zone），通俗点说就是一个变量在声明后且初始化前是完完全全不能被使用的。
因为 var 变量的声明和初始化（成 undefined ）都是在“预处理”过程中同时进行的，所以永远不会触发 TDZ 错误。let 的话，声明和初始化是分开的，只有真正执行到 let 语句的时候，才会被初始化。如果只声明不赋值，比如 let foo，foo 会被初始化成 undefined，如果有赋值的话，只有等号右侧的表达式求值成功（不报错），才会初始化成功。一旦错过了初始化的机会，后面再没有弥补的机会。这是因为赋值运算符 = 只会执行 SetMutableBinding()，并不会执行 InitializeBinding()，所以例子中的 map 变量被永远困在了 TDZ 里。



##### 结论

var 和 let/const 并没有那么大的差别，无非就是声明的同时是否有被初始化。hoist 本身就是个不规范的词汇，到底什么才算 hoist？我也可以说 let/const 也是存在提升的，因为它的确已经提前声明了，只是没初始化，从报错信息也可以看出，引擎已经提前感知到了它的存在。

##### 原因

想要解释 let/const 为什么不存在提升，那就得先知道 var 为什么要提升。其实没什么好的原因，Brendan Eich 解释过 var 的提升是没设计好，他的本意是只让函数声明可以提升。

那如果就在声明前使用了，该怎么办。当时也考虑过可以让它指向外层作用域的变量，比如像 Rust：

```rust
fn main() {
    let a = "outer";
    {
        println!("{}", a); // outer
        let a = "inner";
        println!("{}", a); // inner
    } 
}
```

也就是同一个作用域里的同名变量，可以有两个不同的绑定，这个因为一些原因被否掉了。

剩下的选项就是**报错（dead zone）**。<span style="color:red">报错有两个方案</span>，一个是根据空间上、词法上、源码的文本顺序来看，只要在声明前使用，就报错，这个叫 Lexical dead zone（词法死区），这个也被否掉了：

```javascript
f()
let a = 1 
function f() {alert(a)} //Uncaught ReferenceError: a is not defined
```

因为 a 的使用虽然从源码顺讯上是放在了 let a 后面，但从执行时间上却先求值了。所以只剩最后一个方案，**时间死区（Temporal dead zone）**，也就是最终到了 ES6 里的 TDZ，这里 temporal 不是暂时的意思，temporal 有”时间的“含义，和空间相对应，比如最新替代 Date 的规范也叫 Temporal。

所以结尾总结一下，为什么 let 和 const 不存在变量提升，因为提升成一个 undefined 的设计并不好。




### 变量提升和函数提升

#### 是什么?

**变量提升**

* 在JS中所有使用var声明的变量，会在所有的代码执行前被声明. 也就是说我们可以在一个变量声明前就对其进行使用. 变量的提升只会提前声明，而不会提前赋值

**函数提升**

* 在JS中所有以function开头的函数，会在所有的代码执行前被创建;可以在函数声明前就对其进行调用. 
* 使用函数表达式所定义的函数不会被提升. 如果进行函数调用会抛出`TypeError`异常()(RHS,不合理操作报错)
* 有多个相同函数声明,前面的会被最后的覆盖.



**两者关系**

<span style="color:blue">函数声明和变量var声明都会被提升。函数会首先被提升，然后才是变量。</span>

函数声明和变量声明相同, 变量声明会被覆盖;



#### 案例

> https://juejin.cn/post/6844903794082316296



```js
var a = 10;
function test(){
	a=100;
	console.log(a);
    console.log(this.a);
    var a;
    console.log(a);
}
test();//100 10 10
简化:

function test(){
    var a;
    a = 100;
    console.log(a);
    console.log(this.a);
    console.log(a);
}
var a;
a = 10;

test();//预解析, 变量提升.  函数内的局部变量a,被赋值100.以函数形式调用的时候,this指的是window.
```



```javascript
var a = 100;

function a(){

var a = 200;

console.log(a);

}

a(); //抛出异常

//解析:提升之后的结果是
  function a() {
    var a = 200;
    console.log(a);
  }
  var a;
  a = 100;
  a();
```



### 时间死区(TMD Temporal Dead Zone) //待完成

> 与var不同，let和const声明的变量不会被提升到作用域顶部，如果在声明之前访问这些变量，即使是相对安全的typeof操作符也会触发引用错误
>
> 虽然ECMAScript标准并没有明确提到TDZ，但人们却常用它来描述let和const的不提升效果

JavaScript引擎在扫描代码发现变量声明时，要么将它们提升至作用域顶部（遇到var声明），要么将声明放到TDZ中（遇到let和const声明）。访问TDZ中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从TDZ中移出，然后方可正常访问。

```javascript
console.log(typeof value); //'undefined'
if(condition) {
  let value = 'blue';
}
```

<u>typeof是在声明变量value的代码块外执行的，此时value并不在TDZ中。这也就意味着不存在value这个绑定，typeof操作最终返回"undefined"。</u>






# JS数据类型
#### 背景
计算机程序通过操作值或文本来工作.编程语言中这些可以表示和操作的值被称为'类型',而一门语言支持的类型集也是这门语言最基本的特征.

JS支持面向对象的编程风格.粗略来说,这意味着不用定义全局函数去操作不同类型的值,而是由这些类型本身定义操作值得方法.比如要对数组元素排序,不用把数组传给一个sort()函数,而是可以调用数组的sort()方法.
#### 特点
* JS的对象类型是可以修改的,而原始类型是不可修改的. 
* JS 可以自由转换不同类型的值.

#### 分类
> 数据类型就是字面量的类型
> [JavaScript 数据类型和数据结构 - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)

最新的(2021.8.23)ECMAScript标准定义了8数据类型:
**原始类型**
7种原始值(Primitive values): undefined,string,Boolean,Number,bigInt,Symbol, null
**对象类型**
1种属性集合(collections of properties):Object

#### 原始类型和对象类型的特点
两者区别:引用类型可以添加属性和方法,而基本类型不可以

**原始(基本)类型**
* 基本类型的变量是存放在栈内存（Stack）里的
* 基本数据类型的值是按值访问的
* 基本类型的值是不可变的
* 基本类型的比较是它们的值的比较

**引用类型**
* 引用类型的值是保存在堆内存（Heap）中的对象（Object）
* 引用类型的值是按引用访问的
* 引用类型的值是可变的
* 引用类型的比较是引用的比较



#### 原始类型种类概括

##### 字符串(string)

* JS中字符串需要用引号引起来, 单双引号皆可, 不能混用,不能跨行使用.  新版使用反斜杠和n换行(\\n)
* 同类型引号之间不能嵌套 
* JS中使用反斜杠作为转义字符
  * \n 换行   document.write()需要使用标签\<br>进行换行
  * \t  制表符(缩进)

**模板字符串** ^557cbf

  > 以上特性是ES6新特性,老版本浏览器中不要使用
  > 模板字符串外可以加引号,依然可以传值

```js
`'${变量}'` //用于jsonp中函数调用服务端的中文汉字
```



##### 数值(number)

> JS的主要数值类型Number用于表示<span style="color:blue">整数和近似实数</span>.JS使用IEEE754标准定义的64位浮格式表示数值.这意味着JS可以表示的最大整数是 `±1.797 693 134 862 315 7 * 10<pub>308</pub>`, 最小整数是 `±5 * 10 <pub>-324</pub>`
>
> JS这种数据格式可以准确表示`-9 007 199 254 740 992(-2 <pub>53</pub>)`到 `9 007 199 254 740 992(2<pub>53</pub>)`之间的所有整数(包括首尾值). 
>
> 注意: JS中的某些操作是以32位整数计算的.
>
> 当数值出现在JS程序中时,就叫做数值字面量(numeric literal). JS支持几种形式的数值字面量.任何数值字面量前面都可以加上一个减号变成负值.

**实数,虚数,复数**

> [(3条消息) 实数、虚数和复数_Leon.ENV的博客-CSDN博客_实数和虚数](https://blog.csdn.net/hlzgood/article/details/110660281)

实数: 包括整数,有理数和无理数. 实数是相对于虚数来说的,有虚数后,才把费叙述叫做实数.

虚数: 虚数的平方是负数.

例如,假设有这样的数: 称之为i. 
$$
i * i = -1 \\
i = \sqrt{-1}  \\也就是i是-1的平方根
$$
那么-9的平方根是多少呢?
$$
\sqrt{-9} = \sqrt{(9 * -1)} = \sqrt{9} * \sqrt{-1} = 3 * \sqrt{-1} = 3i \\
故, 负数的平方根等于该数为正时的平方根乘以i:\\
\sqrt{(-x)} = i\sqrt{x}
$$
复数:

复数是实数和虚数的组合：注意：复数是两个数加起来的，一个是实数部分，一个是虚数部分。 但这两部分都可以是 0 ，所以所有实数和虚数都是复数。


**整数字面量**

在JS程序中,基数为10的整数可以直接写成数字序列.

JS也支持16进制(0x), 二进制(0b), 八进制数(0o)字字符串. //大小写都是支持的

十六进制是数字0到9和字母a(或A)到字母f(或F),a到f表示10到15.

```javascript
ob10101 //21 (1*2**4 + 0*2**3 + 1*2**2 + 0*2**1 + 1*2**0)
0o377 //255
```



**浮点字面量**

浮点字面量可以包含小数点,对实数使用传统语法.实数值由数值的整数部分,小数点和数值的小数部分组成.

浮点字面量也可以用指数计数法表示,即实数值后面可以跟字母e(或E),跟衣蛾可选的加号或减号,再跟一个整数指数.这种计数法表示的是实数值乘以10的指数次幂.

其语法形式:

```javascript
[digits][.digits](E|e)[(+|-)]digits]
```

例如:
$$
6.02e23    //6.02×10^{23}\\


1.4728223E-23 //1.4728223 × 10^{-32}
$$
数值字面量中的分隔符

可以用下划线将数值字面量分割为容易看清的数字段:

```javascript
let billion = 1_000_000_000 //以下划线作为千分位分隔符
let bytes = 0x89_AB_CD_E //作为字节分隔符
let bits = 0b001_1101_0111 //作为半字节分隔符
let fraction = 0.123_456_789 //也可以用在小数部分
```






##### 布尔值(boolean)

**是什么**
Boolean类型（又称布尔类型）的字面值只有两个，分别是true和false，它们是区分大小写的，其他值（如True和False）并不是Boolean类型的值。
**使用场景**
Boolean类型使用最多的场景就是用于if语句判断。在JavaScript中，if语句可以接受任何类型的表达式，即if(a)语句中的a，可以是Boolean、Number、String、Object、Function、Null、Undefined中的任何类型。

如果a不是Boolean类型的值，那么JavaScript解释器会自动调用Boolean()函数对a进行类型转换，返回最终符合if语句判断的true或者false值。


* 布尔值进行逻辑判断
* 布尔值只有两个 
  * true 真
  * false 假
* 使用 typeof 检查布尔值 会返回boolean

判断一个值是否是布尔值

```javascript
//https://github.com/jashkenas/underscore/blob/master/underscore.js#L104

function isBoolean(obj) {
  return typeof obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}
```



##### 未定义(undefined)

**是什么**
Undefined类型只有一个唯一的字面值undefined，表示的是一个变量不存在。

**出现的场景**
* 使用只声明而未初始化的变量时，会返回“undefined”
* 获取一个对象的某个不存在的属性（自身属性和原型链继承属性）时，会返回“undefined”
* 函数没有明确的返回值时，却在其他地方使用了返回值，会返回“undefined”。
* 函数定义时使用了多个形式参数（后文简称为形参），而在调用时传递的参数的数量少于形参数量，那么未匹配上的参数就为“undefined”。

```js
//1.未初始化变量 变量定义了没有赋值
let a;
console.log(a); //undefined


//2 不存在的对象属性或方法
let obj = {name: 'kingx'}
console.log(obj.address) //undefined

//3 不返回任何结果的函数的调用结果 
function foo(){}
console.log(foo()) //undefined

//4  函数需要实参,但调用时没有传值,形参是undefined
function foo(param1, param2, param3) {
  console.log(param3)
}
foo(1, 2) //undefined



// 越界索引数组元素
const colors = ['blue', 'white', 'red'];
colors[5];//undefined
colors[-1];//undefined

// 可选链
obj?.someProp返回undefined,前提是obj是undefined或null
undefined?.someProp
null?.someProp

```

**如何判断一个值是undefined?**
* 全等判断
* 对象原型上的toString方法


##### 空值(null)
**是什么**
Null类型只有一个唯一的字面值null，<span style="color:red">表示一个空指针对象</span>，这也是在使用typeof运算符检测null值时会返回“object”的原因。

**出现的场景**
下面是3种常见的出现null的场景。

* 一般情况下，如果声明的变量是为了以后保存某个值，则应该在声明时就将其赋值为“null”。
* JavaScript在获取DOM元素时，如果没有获取到指定的元素对象，就会返回“null”
* 在使用正则表达式进行捕获时，如果没有捕获结果，就会返回“null”。

```js
//1
let returnObj=null
function boo() {
  return {
    name: 'kingx'
  }
}
returnObj = foo()

//2
document.querySelector('#id') //null

//3
'test'.match(/a/) //null

```

**如何判断一个值是null**
* `===`
* Object.is(null, null)
* 对象原型上的toString方法

##### 数据类型-可迭代对象(iterable object)

> [Iterable object（可迭代对象） (javascript.info)](https://zh.javascript.info/iterable)

**可迭代（Iterable）** 对象是数组的泛化。这个概念是说任何对象都可以被定制为可在 `for..of` 循环中使用的对象。
[[Array#^08df4d]]


## 包装类??

```JavaScript
- JS中有3个包装类: String() Number() Boolean()
- 他们可以将一个基本数据类型包装为一个对象
 String()可以包装字符串对象
 Number()可以包装数值对象
 Boolean()可以包装布尔值对象
 -但是我们千万不能用它

- 当我们调用一个基本数据类型的属性或方法时,
  浏览器会临时使用包装类将基本数据类型转换为对象,
  然后调用对象的属性或方法,操作完毕临时对象即销毁


let s = new String('hello');
let s1 = new String('hello');
console.log(s === s1); //false  这是两个对象,内存地址不同

let bool = new Boolean(false);
if(bool){
    console.log('执行');// bool是个对象,只要是对象就是true
}

let str = 'hello';//自动装箱,自动拆箱
str.name = '孙悟空';
alert(str.name);  
//str是没有name属性的,但是运行却没有报错
//str是基本数据类型,临时把字符串转换成对象,然后调用属性的属性和方法,加完属性就销毁了.alert输出的是另一个对象的属性,然后销毁.
```



原始值在某种情况下被转换成它的对象形式(new String(), new Number(), new Boolean()),这通常称为"装箱".

把基本数据类型转换为对应的引用类型的操作称为"装箱"

把引用类型转换为基本的数据类型称为"拆箱"




## 类型间比较

##### Undefined 和 Null两种类型比较

Undefined和Null虽然是两种不同的基本数据类型，存在一些不同的特性，但是在某些表现上存在着相同之处，这里就总结了Undefined和Null的相同点和不同点。

**相同点:**
* Undefined和Null两种数据类型都只有一个字面值，分别是undefined和null。
* Undefined类型和Null类型在转换为Boolean类型的值时，都会转换为false。所以通过非运算符（！）获取结果为true的变量时，无法判断其值为undefined还是null。·
* 在需要将两者转换成对象时，都会抛出一个TypeError的异常，也就是平时最常见的引用异常。

```js
let a;
let b = null

console.log(a.name) //cannot read property 'name' of undefined
console.log(b.name) //cannot read property 'name' of null
```

* <span style="color:blue">Undefined类型派生自Null类型，所以在非严格相等的情况下，两者是相等的</span>

```js
null == undefined //true
```



**不同点**
* null是JavaScript中的关键字，而undefined是JavaScript中的一个全局变量，即挂载在window对象上的一个变量，并不是关键字。
* 在使用typeof运算符检测时，Undefined类型的值会返回“undefined”，而Null类型的值会返回“object”。
* 在通过call调用toString()函数时，Undefined类型的值会返回“[object Undefined]”，而Null类型的值会返回“[object Null]”。

```js
''.toString.call(undefined); //[object Undefined]
''.toString.call(null); //[object Null]
```

* 在需要进行字符串类型的转换时，null会转换为字符串"null"，而undefined会转换为字符串"undefined"。
```js
undefined + '' //'undefined'
null + '' //'null'
```

* 在需要进行数值类型的转换时，undefined会转换为NaN，无法参与计算；null会转换为0，可以参与计算。
```js
undefined + 0 //NaN
null + 0 //0
```

* 无论在什么情况下都没有必要将一个变量显式设置为undefined。如果需要定义某个变量来保存将来要使用的对象，应该将其初始化为null。这样不仅能将null作为空对象指针的惯例，还有助于区分null和undefined。



* 表示空的对象
* 空值只有一个就是null
* 使用typeof检查空值 **会返回object (历史遗留)**

```js
- 出现null的几种情况

1. 在JS的dom元素获取中,如果没有获取到指定的元素对象,结果一般是null
2. Object.prototype.__proto__的值是null  Object.getPrototype(Object.prototype)->null
3. 在正则捕获时, 如果没有捕获到结果,默认是null
4. JSON数据格式不支持undefined,只支持null
 JSON.stringify({a:undefined, b:null})// '{'b':null}'
```



#### 3.null和undefined使用比较

* In JavaScript, `undefined` means a variable has been declared but has not yet been assign a value
* `null` is an assignment value(分配值). It can be assigned to a variable as a representation of no value.
* two distinct types: `undefined` is a type itself(undefined) ,`null`is an object.

```javascript
null == undefined //true

null = 'value' //ReferenceError
undefined = 'value' //'value'
```



## 类型判断

> https://github.com/mqyqingfeng/Blog/issues/28

#### 1.typeof[[#typeof操作符]]

> The `typeof` oeprator ==returns a string== indicating the type of the unevaluated operand.

**Syntax**

> typeof operand
>
> typeof (operand)

**Paramenter**

`operand`

An expression representing the object or primitive whose type is to be returned.

一个标识对象或原始值的表达式,其类型将被返回.

**Desc**
```markdown

//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof

typeof可能的共计8种返回值: 
* undefined 
* string 
* number 
* boolean 
* function
* bigint 
* symbol
---------
* object 


typeof undefined //'undefined' Chrome中可直接返回         
typeof boolean类型 //'boolean'
typeof number类型 //'number'
typeof bigint类型 //'bigint'
typeof symbol类型// 'symbol'
typeof Function类型//'function'
typeof string类型 //'string'
其他任何对象 //'object'
typeof null //'object'
typeof []   //'object'
typeof {}   //'object'


typeof Number(1) === 'number' //true

typeof undefined === 'undefined'

//对象
  typeof {a:1} === 'object'

  typeof [1,2,4] === 'object'

  //实例
  typeof new Boolean(true) = 'object'
  typeof new Number(1) = 'object'
  typeof new String('ABC') === 'object'

  //函数
  typeof function(){} = 'function'
  typeof class C {} = 'function'
  typeof Math.sin === 'function'

  //JS诞生以来便是如此
  typeof null === 'object'

  //除Function外的所有构造函数的类型都是object
  var str = new String('String');
  var num = new Number(100);

  typeof str; // 返回 'object'
  typeof num; // 返回 'object'
  var func = new Function();
  typeof func; //返回'function'

  //括号有无将决定表达式的类型
  var iData = 99;
  typeof iData + 'Wisen';// 'number Wisen'
  typeof (iData + 'Wisen');//'string'


```



#### 2.Object.prototype.toString

#####  2.0 规范

> https://es5.github.io/#x15.2.4.2

> When the toString method is called, the following steps are taken:
>
> 1.If the  **this** value is **undefined**, return "**[object Undefined]**"
>
> 2.If the **this** value is **null**, return "**[object Null]**"
>
> 3.Let O be the result of calling ToObject passing the **this** value as the argument.
>
> 4.Let *class* be the value of the [[Class]] internal property of O.
>
> 5.Return the String value that is the result of concatenating the three Strings "[**object**,  *class*, and "**]**"

>当调用toString方法, 下面的步骤会被执行
>
>1.如果this值是undefined, 就返回[object Undefined]
>
>2.如果this值是null, 就返回[object Null
>
>3.让O成为ToObject(this)的结果
>
>4.让class成为对象O内部属性[[Class]]的值
>
>5.最后返回由3个字符串"[object" 和 class 和 "]"组成的字符串



##### 2.1 14种识别类型

```javascript
var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var und = undefined;     // [object Undefined]
var nul = null;          // [object Null]
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]


Object.prototype.toString(Math); //[object Math]
Object.prototype.toString(JSON); //[object JSON]

function func() {
  Object.prototype.toString.call(arguments); //[object Arguments]
}
```

所以我们可以识别至少 14 种类型，当然我们也可以算出来，<u>[[Class]] 属性至少有 12 个</u>。 ???? why?





##### 2.2 加call原因

```js
https://www.cnblogs.com/youhong/p/6209054.html

//1.用法
console.log(Object.prototype.toString.call(obj) === "[object Object]");

//2.无法区分自定义对象类型，自定义类型可以采用instanceof区分
console.log(Object.prototype.toString.call("jerry"));//[object String]
console.log(Object.prototype.toString.call(12));//[object Number]
console.log(Object.prototype.toString.call(true));//[object Boolean]
console.log(Object.prototype.toString.call(undefined));//[object Undefined]
console.log(Object.prototype.toString.call(null));//[object Null]
console.log(Object.prototype.toString.call({name: "jerry"}));//[object Object]
console.log(Object.prototype.toString.call(function(){}));//[object Function]
console.log(Object.prototype.toString.call([]));//[object Array]
console.log(Object.prototype.toString.call(new Date));//[object Date]
console.log(Object.prototype.toString.call(/\d/));//[object RegExp]
function Person(){};
console.log(Object.prototype.toString.call(new Person));//[object Object]

new Person instanceof Person //true

3.为什么不直接使用obj.toString方法呢?
  1.undefined/null身上没有toString方法
	2.toString方法返回反映这个对象的字符串
console.log("jerry".toString());//jerry
console.log((1).toString());//1
console.log([1,2].toString());//1,2
console.log(new Date().toString());//Wed Dec 21 2016 20:35:48 GMT+0800 (中国标准时间)
console.log(function(){}.toString());//function (){}
console.log(null.toString());//error
console.log(undefined.toString());//error

4.obj.toString()的结果和Object.prototype.toString.call(obj)的结果不一样
toString为Object的原型方法，而Array 、Function等类型作为Object的实例，都重写了toString方法。不同的对象类型调用toString方法时，根据原型链的知识，调用的是对应的重写之后的toString方法

//验证:删除数组身上的toString方法
let arr = [1,2];
console.log(Array.prototype.hasOwnProperty('toString'));//true
console.log(arr.toString()); //1,2,3
delete Array.prototype.toString;
console.log(Array.prototype.hasOwnProperty('toString')); //false
console.log(arr.toString()); //[object Array]

5.为什么需要加call
5.1 立即调用,gai'bian
```



#### 3 自定义API

>  写个 type 函数帮助我们以后识别各种类型的值

函数需求:

* 如果是基本类型，就使用 typeof，引用类型就使用 toString。
* 此外鉴于 typeof 的结果是小写，我也希望所有的结果都是小写。
* 考虑到实际情况下并不会检测 Math 和 JSON，所以去掉这两个类型的检测。

**第一版**

```javascript
let class2type = {};

//生成class2type的映射出
"Boolean String Number Null Undefined Object Array Function Date Error RegExp".split(" ").map(item => class2type["[object " + item + "]"] = item.toLowerCase());  //第一次看经把它当做一次性赋值的表达式,结果是class2type['[object boolean]', ....]

function type(obj) {
  return typeof obj === 'object' || typeof obj === 'function' ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
}
```

但是注意，在 IE6 中，null 和 undefined 会被 Object.prototype.toString 识别成 [object Object]！

**第二版(解决IE兼容性)**

```javascript
let class2type = {};
"Boolean Number String Object Array Function RegExp Date Error".split(' ').map(item => class2type["[object " + item + "]"] = item.toLowerCase());

function type(obj) {
  if (obj == null) { //注意,是两个双等号  非常聪明的方法 啧啧!
    return obj + '';
  }
  
  return typeof obj === 'object' || typeof obj === 'function' ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
}
```

**日常封装再使用**

```javascript
//函数
function isFunction(obj) {
  return type(obj) === 'function';
}

//数组
let isArray = Array.isArray || (obj) => type(obj) === 'array';
```

**结语**

我们已经可以判断日期、正则、错误类型啦，但是还有更复杂的判断比如 plainObject、空对象、Window对象、类数组对象等.

这个 type 函数抄的 jQuery，[点击查看 type 源码](https://github.com/jquery/jquery/blob/ac9e3016645078e1e42120822cfb2076151c8cbe/src/core.js#L269)。



#### 4.自定义API2

> 在上篇[《JavaScript专题之类型判断(上)》](https://github.com/mqyqingfeng/Blog/issues/28)中，我们抄袭 jQuery 写了一个 type 函数，可以检测出常见的数据类型，然而在开发中还有更加复杂的判断，比如 plainObject、空对象、Window 对象等，这一篇就让我们接着抄袭 jQuery 去看一下这些类型的判断。

##### plainObject

> plainObject 来自于 jQuery，可以翻译成纯粹的对象，所谓"纯粹的对象"，就是该对象是通过 "{}" 或 "new Object" 创建的，该对象含有零个或者多个键值对。 ???
>
> 之所以要判断是不是 plainObject，是为了跟其他的JavaScript对象如 null，数组，宿主对象(documents）等作区分，因为这些用 typeof 都会返回object。
>
> jQuery提供了 isPlainObject 方法进行判断，先让我们看看使用的效果：

```javascript
function Person(name) {
  this.name = name;
}

console.log($.isPlainObject({})); //true

console.log($.isPlainObject(new Object)) // true

console.log($.isPlainObject(Object.create(null))); // true

console.log($.isPlainObject(Object.assign({a: 1}, {b: 2}))); // true

console.log($.isPlainObject(new Person('yayu'))); // false

console.log($.isPlainObject(Object.create({}))); // false
```

由此我们可以看到，除了 {} 和 new Object 创建的之外，jQuery 认为一个没有原型的对象也是一个纯粹的对象。

 3.0 版本下的 isPlainObject，我们直接看源码：

```javascript
let type2class = {};

//相当于Object.prtotype.toString
let toString = type2class.toString;

//相当于Object.prototype.hasOwnProperty
let hasOwn = class2type.hasOwnProeprty;

function isPlainObject(obj) {
  let proto, Ctor;
  
  //排序明显不是obj的以及一些宿主对象如Window
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }
  
   /**
     * getPrototypeOf es5 方法，获取 obj 的原型
     * 以 new Object 创建的对象为例的话
     * obj.__proto__ === Object.prototype
     */
  proto = Object.getPrototypeOf(obj);
  
  //没有原型的对象是纯粹的,Object.create(null)就在这里返回true
  if (!proto) {
    return true;
  }
  
  /**
     * 以下判断通过 new Object 方式创建的对象
     * 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
     * 如果是 Object 函数创建的对象，Ctor 在这里就等于 Object 构造函数
     */
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
  
  //在这里判断 Ctor 构造函数是不是 Object 构造函数，用于区分自定义构造函数和 Object 构造函数
  return typeof Ctor === 'function' && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
}
```

注意: 我们判断Ctor构造函数是不是Object构造函数,用的是hasOwn.toString.call(Ctor).这个方法可不是Object.prototype.toString.我们可以通过在函数添加打印来查看:

```javascript
console.log(hasOwn.toString.call(Ctor)); //function Object() { [native code] }
console.log(Object.prototype.toString.call(Ctor)); //[object Object]
```


#### 判断是否为对象
方法总结:
* typeof
* instanceof
* Object.prototype.toString()
* 自定义构造函数

**typeof**
```js
let obj = {}; 
console.log(typeof obj === 'object'); // true
```
需要注意的是，`typeof null` 也会返回 `'object'`，所以这种方法需要额外处理 `null` 的情况。
    
**使用 `instanceof` 操作符**：
```js
let obj = {}; 
console.log(obj instanceof Object); // true
```
这种方法判断的是对象是否是 `Object` 构造函数的实例.
虽然使用instanceof方法可以排除`null`值,但是它依然存在其它几点弊端: [[关系运算符#instanceof#使用instanceof判断对象类型弊端]]
    
**结合 `Object.prototype.toString` 方法**：
```js
function isObject(value) {     
	return Object.prototype.toString.call(value) === '[object Object]'; 
} 

console.log(isObject({})); // true 
console.log(isObject([])); // false 
console.log(isObject(null)); // false
```
这种方法可以更准确地判断一个值是否是纯粹的对象（即由 `{}` 或 `new Object()` 创建的对象）。
    
**使用 `Object` 构造函数**：
```js
function isObject(value) {     
	return value !== null && typeof value === 'object'; 
} 
console.log(isObject({})); // true 
console.log(isObject([])); // true 
console.log(isObject(null)); // false
```
这种方法简单且常用，但需要注意数组和 `null` 也会被判断为对象。

最常用和推荐的方法是结合 `Object.prototype.toString` 来判断，这样可以避免数组和 `null` 的误判



#### 4.判断数组的6种方法

详细见数组

* 方法 Object.prototype.toString.call(arr).slice(8, -1)
* 方法 Array.isArray(arr)
* 方法 Array.prototype.isPrototypeOf(obj)
* 原型链 arr.\_\_proto\_\_ === Array.prototype
* 原型链 arr.constructor === Array
* 原型链 arr instanceof Array

#### 5.识别整数

ECMAScript 6添加了**Number.isInteget()**方法来确定一个值是否为JavaScript整数类型。Number.isInteger()方法利用了浮点数与整数的存储方式不同来判断.

**注意:** 如果有些数字看起来像浮点数，却存储为整数，这会让Number.isInteger()方法判断失效而返回true

```javascript
console.log(Number.isInteger(25)); //true
console.log(Number.isInteger(25.0)); //false
console.log(Number.isInteger(25.1)); //false
```

在JavaScript中，只给数字添加小数点不会让整数变为浮点数，此处的25.0确实是25，所以会按照整数的形式存储.



### 包装类型

JS里有3个原始包装类型: String, Number, Boolean.

每个类型都代表全局作用域中的一个构造函数, 并分别表示各自对应的原始值的对象. 原始包装类型的主要作用是让原始值具有对象般的行为,比如:

```js
var name = 'Nicholas'
console.log(name.Nicholas)
```

字符串能直接使用属性/方法的原因, 是JS引擎创建了String类型的新实例,紧跟着被销毁,当再次需要时就会又创建另一个对象.

```js
var name = 'Nicholas'
console.log(name.Nicholas)
console.log(name.auther) //undefined
```

同样,也可以手动创建这些对象

```js
// 不好的做法
var name = new String('Nicholas')
var author = new Boolean(true);
var count  = new Number(10)
```

最佳实践: 很多规范中都是禁止使用原始包装类型.




## 类型转换及比较

> 将其他的数据类型转换为 字符串(string), 数值(number)或布尔值(boolean)



#### 原始值转布尔值

我们使用 **Boolean 函数**将类型转换成布尔类型，在 JavaScript 中，只有 **6 种值**可以被转换成 false，其他都会被转换成 true。

```javascript
console.log(Boolean()); //false

console.log(Boolean(false)); //false

console.log(Boolean(undefined)); //false
console.log(Boolean(null)); //false
console.log(Boolean(+0)); //false
console.log(Boolean(-0)); //false
console.log(Boolean(NaN)); //false
console.log(Boolean('')); //false
```

#### 原始值转数字

使用Number函数将类型转换为数字类型,如果参数无法转换为数字,则返回NaN.

在看例子之前，我们先看 [ES5 规范 15.7.1.1](http://es5.github.io/#x15.7.1.1) 中关于 Number 的介绍:

> Returns a Number value (not a Number object) computed by [ToNumber](http://es5.github.io/#x9.3)(*value*) if *value* was supplied, else returns **+0**.

根据规范，如果 Number 函数不传参数，返回 +0，如果有参数，调用 `ToNumber(value)`

注意这个 `ToNumber` 表示的是一个底层规范实现上的方法，并没有直接暴露出来。

而 `ToNumber` 则直接给了一个[对应的结果表](http://es5.github.io/#x9.3)。表如下：

**内部规范方法 `ToNumber(value)` 结果对应表格:**

| 参数类型   | 结果                                                         |
| ---------- | ------------------------------------------------------------ |
| Undefined  | NaN                                                          |
| Null       | +0                                                           |
| Boolean    | 如果参数是true,返回1.参数为false,返回0                       |
| Number     | 返回与之相等的值                                             |
| String     | 如果字符串中只包含数字，则会转换成十进制数；如果前面有0，会直接省略掉，例如"0123"会转换为123。<br />如果字符串中包含的是有效的浮点数，则同样按照十进制转换，例如"1.23"会转换为1.23。<br />如果是空字符串，则转换为0<br />如果字符串中包含了除上述格式以外的字符串，则会直接转换为NaN<br />鉴于这种严格的判断，我们一般还会使用更加灵活的 parseInt 和 parseFloat 进行转换。 |
| Object类型 | Object类型在转换为Number类型时，会优先调用valueOf()函数，然后通过valueOf()函数的返回值按照上述规则进行转换。<br />如果转换的结果是NaN，则调用toString()函数，通过toString()函数的返回值重新按照上述规则进行转换；<br />如果有确定的Number类型返回值，则结束，否则返回“NaN”。 |



```javascript
console.log(Number()); //+0

console.log(Number(undefined)); //NaN
console.log(Number(null)); //+0

console.log(Number(false)); //+0
console.log(Number(true)); //1

console.log(Number('123')); //123
console.log(Number('-123')); //-123
console.log(Number('1.2')); //1.2
console.log(Number('000123')); //123
console.log(Number('-000123')); //-123

console.log(Number('0x11')); //17

console.log(Number('')); //0
console.log(Number(' ')); //0

console.log(Number("123 123")) // NaN
console.log(Number("foo")) // NaN
console.log(Number("100a")) // NaN
```

parseInt 只解析整数，parseFloat 则可以解析整数和浮点数，如果字符串前缀是 "0x" 或者"0X"，parseInt 将其解释为十六进制数，parseInt 和 parseFloat 都会跳过任意数量的前导空格，尽可能解析更多数值字符，并忽略后面的内容。如果第一个非空格字符是非法的数字直接量，将最终返回 NaN：

```javascript
console.log(parseInt("3 abc")) // 3
console.log(parseFloat("3.14 abc")) // 3.14
console.log(parseInt("-12.34")) // -12
console.log(parseInt("0xFF")) // 255
console.log(parseFloat(".1")) // 0.1
console.log(parseInt("0.1")) // 0
```



##### Number类型转换

在JavaScript中，一共有3个函数可以完成将其他类型的值转换为Number类型的情况，分别是Number()函数、parseInt()函数、parseFloat()函数

Number()函数

Number()函数可以用于将任何类型转换为Number类型，它在转换时遵循下列规则。

* 如果是数字，会按照对应的进制数据格式，统一转换为十进制并返回

```js
Number(10) //10
Number(010) //8 010是8进制,转换成十进制是8
Number(0x100) //16 0x10是16进制,转换成十进制是16
```

* 如果是Boolean类型的值，true将返回为“1”，false将返回为“0”
* 如果值为null，则返回“0”
* 如果值为undefined，则返回“NaN”
* 如果值为字符串类型，则遵循下列规则
  * 如果该字符串只包含数字，则会直接转换成十进制数；如果数字前面有0，则会直接忽略这个0
  * 如果字符串是有效的浮点数形式，则会直接转换成对应的浮点数，前置的多个重复的0会被清空，只保留一个
  * 如果字符串是有效的十六进制形式，则会转换为对应的十进制数值
  * 如果字符串是有效的八进制形式，则不会按照八进制转换，而是直接按照十进制转换并输出，因为前置的0会被直接忽略
  * 如果字符串为空，即字符串不包含任何字符，或为连续多个空格，则会转换为0
  * 如果字符串包含了任何不是以上5种情况的其他格式内容，则会返回“NaN”
  * 如果值为对象类型，则会先调用对象的valueOf()函数获取返回值，并将返回值按照上述步骤重新判断能否转换为Number类型。如果都不满足，则会调用对象的toString()函数获取返回值，并将返回值重新按照步骤判断能否转换成Number类型。如果也不满足，则返回“NaN”



##### parseInt()函数

parseInt()函数用于解析一个字符串，并返回指定的基数对应的整数值

详见parseInt方法.

##### parseFloat()方法

详见parseFloat方法









#### 原始值转字符

我们使用 `String` 函数将类型转换成字符串类型，依然先看 [规范15.5.1.1](http://es5.github.io/#x15.5.1.1)中有关 `String` 函数的介绍：

> Returns a String value (not a String object) computed by [ToString](http://es5.github.io/#x9.8)(*value*). If *value* is not supplied, the empty String `""` is returned.

如果 `String` 函数不传参数，返回空字符串，如果有参数，调用 `ToString(value)`，而 `ToString` 也给了一个对应的结果表。

表格如下：

| 参数类型  | 结果                                                  |
| --------- | ----------------------------------------------------- |
| Undefined | 'undefined'                                           |
| Null      | 'null'                                                |
| Boolean   | 如果参数是true,返回'true',如果参数是false,返回'false' |
| Number    | 参看以下示例                                          |
| String    | 返回与之前相等的值                                    |



```javascript
console.log(String()) // 空字符串

console.log(String(undefined)) // undefined
console.log(String(null)) // null

console.log(String(false)) // false
console.log(String(true)) // true

console.log(String(0)) // 0
console.log(String(-0)) // 0
console.log(String(1)) // 1
console.log(String(-1)) //-1
console.log(String(NaN)) // NaN
console.log(String(Infinity)) // Infinity
console.log(String(-Infinity)) // -Infinity
```



#### 原始值转对象

原始值到对象的转换非常简单，原始值通过调用 String()、Number() 或者 Boolean() 构造函数，转换为它们各自的包装对象。

null 和 undefined 属于例外，当将它们用在期望是一个对象的地方都会造成一个类型错误 (TypeError) 异常，而不会执行正常的转换。

```javascript
let a = 1;
console.log(typeof a); //number
let b = new Number(a);
console.log(typeof b); //object
```



#### 对象转布尔值

对象到布尔值的转换非常简单：所有对象(包括数组和函数)都转换为 true。对于包装对象也是这样

```javascript
console.log(Boolean(new Boolean(false))); //true
```



#### 对象转字符串和数字

<u>对象到字符串和对象到数字的转换都是通过调用待转换对象的一个方法来完成的</u>。而 JavaScript 对象有两个不同的方法来执行转换，一个是 `toString`，一个是 `valueOf`。注意这个跟上面所说的 `ToString` 和 `ToNumber` 是不同的，这两个方法是真实暴露出来的方法。

所有的对象除了 null 和 undefined 之外的任何值都具有 `toString` 方法，通常情况下，它和使用 String 方法返回的结果一致。`toString` 方法的作用在于返回一个反映这个对象的字符串，然而这才是情况复杂的开始。

当调用对象的 toString 方法时，其实调用的是 Object.prototype 上的 toString 方法

* 数组的 toString 方法将每个数组元素转换成一个字符串，并在元素之间添加逗号后合并成结果字符串。
* 函数的 toString 方法返回源代码字符串。
* 日期的 toString 方法返回一个可读的日期和时间字符串。
* RegExp 的 toString 方法返回一个表示正则表达式直接量的字符串。

另一个转换对象的函数是 valueOf，表示对象的原始值。默认的 valueOf 方法返回这个对象本身，数组、函数、正则简单的继承了这个默认方法，也会返回对象本身。日期是一个例外，它会返回它的一个内容表示: 1970 年 1 月 1 日以来的毫秒数。

```javascript
let date = new Date(2017,4,2);
console.log(date.valueOf()) //14952960000000
```



了解了 toString 方法和 valueOf 方法，我们分析下从对象到字符串是如何转换的。看规范 [ES5 9.8](http://es5.github.io/#x9.8)，其实就是 ToString 方法的对应表，只是这次我们加上 Object 的转换规则：

| 参数类型 | 结果                                                         |
| -------- | ------------------------------------------------------------ |
| Object   | 1. primValue = ToPrimitive(input, String)<br />2. 返回ToString(primValue) |

 所谓的 ToPrimitive 方法，其实就是输入一个值，然后返回一个一定是基本类型的值。

我们总结一下，当我们用 String 方法转化一个值的时候，如果是基本类型，就参照 “原始值转字符” 这一节的对应表，如果不是基本类型，我们会将调用一个 ToPrimitive 方法，将其转为基本类型，然后再参照“原始值转字符” 这一节的对应表进行转换。

其实，从对象到数字的转换也是一样：

| 参数类型 | 结果                                                         |
| -------- | ------------------------------------------------------------ |
| Object   | 1. primValue = ToPrimitive(input, Number)<br />2. 返回ToNumber(primValue) |

虽然转换成基本值都会使用 ToPrimitive 方法，但传参有不同，最后的处理也有不同，转字符串调用的是 `ToString`，转数字调用 `ToNumber`。



##### ToPrimitive

让我们看规范 9.1，函数语法表示如下：

> ToPrimitive(input, [, PreferredType])

第一个参数是 input，表示要处理的输入值。

第二个参数是 PreferredType，非必填，表示希望转换成的类型，有两个值可以选，Number 或者 String。

当不传入 PreferredType 时，如果 input 是日期类型，相当于传入 String，否则，都相当于传入 Number。

如果传入的 input 是 Undefined、Null、Boolean、Number、String 类型，直接返回该值。

<u>如果是 ToPrimitive(obj, Number)，处理步骤如下：</u>

1. 如果 obj 为 基本类型，直接返回
2. 否则，调用 valueOf 方法，如果返回一个原始值，则 JavaScript 将其返回。
3. 否则，调用 toString 方法，如果返回一个原始值，则 JavaScript 将其返回。
4. 否则，JavaScript 抛出一个类型错误异常。

<u>如果是 ToPrimitive(obj, String)，处理步骤如下：</u>

1. 如果 obj为 基本类型，直接返回
2. 否则，调用 toString 方法，如果返回一个原始值，则 JavaScript 将其返回。
3. 否则，调用 valueOf 方法，如果返回一个原始值，则 JavaScript 将其返回。
4. 否则，JavaScript 抛出一个类型错误异常。



##### 对象转字符串

所以总结下，对象转字符串(就是 Number() 函数)可以概括为：

* 如果对象具有 toString 方法，则调用这个方法。如果他返回一个原始值，JavaScript 将这个值转换为字符串，并返回这个字符串结果。
* 如果对象没有 toString 方法，或者这个方法并不返回一个原始值，那么 JavaScript 会调用 valueOf 方法。如果存在这个方法，则 JavaScript 调用它。如果返回值是原始值，JavaScript 将这个值转换为字符串，并返回这个字符串的结果。
* 否则，JavaScript 无法从 toString 或者 valueOf 获得一个原始值，这时它将抛出一个类型错误异常。

##### 对象转数字

对象转数字的过程中，JavaScript 做了同样的事情，只是它会首先尝试 valueOf 方法

1. 如果对象具有 valueOf 方法，且返回一个原始值，则 JavaScript 将这个原始值转换为数字并返回这个数字.如果转换的结果是NaN，则调用toString()函数
2. 否则，如果对象具有 toString 方法，且返回一个原始值，则 JavaScript 将其转换并返回。
3. 否则，JavaScript 抛出一个类型错误异常。

举个例子

```javascript
console.log(Number({})); //NaN
console.log(Number({a: 1})); //NaN

console.log(Number([])); //0
console.log(Number([0])); //0
console.log(Number([1, 2, 3])) // NaN
console.log(Number(function(){var a = 1;})) // NaN
console.log(Number(/\d+/g)) // NaN
console.log(Number(new Date(2010, 0, 1))) // 1262275200000
console.log(Number(new Error('a'))) // NaN
```

当我们 `Number([])` 的时候，先调用 `[]` 的 `valueOf` 方法，此时返回 `[]`，因为返回了一个对象而不是原始值，所以又调用了 `toString` 方法，此时返回一个空字符串，接下来调用 `ToNumber` 这个规范上的方法，参照对应表，转换为 `0`, 所以最后的结果为 `0`。

而当我们 `Number([1, 2, 3])` 的时候，先调用 `[1, 2, 3]` 的 `valueOf` 方法，此时返回 `[1, 2, 3]`，再调用 `toString` 方法，此时返回 `1,2,3`，接下来调用 `ToNumber`，参照对应表，因为无法转换为数字，所以最后的结果为 `NaN`。



```javascript
//疑问 chrome环境

1-{} //NaN
1+{} //'1[object Object]'

{}+1 //1
{}-1 //-1
```





#### 数组类型转换

> https://juejin.cn/post/6950664413317693470
>
> 数组调用`toString()`会隐含调用`Array.join()`方法

使用数组实现`a==1&&a==2&&a==3`效果

```javascript
let a = [1,2,3];
a.join = a.shift;
console.log(a==1&&a==2&&a==3); //true
```



#### JSON.stringify()

JSON.stringify() 方法可以将一个 JavaScript 值转换为一个 JSON 字符串，实现上也是调用了 toString 方法，也算是一种类型转换的方法。下面讲一讲JSON.stringify 的注意要点：

1.处理基本类型,与使用 toString基本相同,结果都是字符串.除了undefined.

```javascript
console.log(JSON.stringify(null)) // null
console.log(JSON.stringify(undefined)) // undefined，注意这个undefined不是字符串的undefined
console.log(JSON.stringify(true)) // true
console.log(JSON.stringify(42)) // 42
console.log(JSON.stringify("42")) // "42"
```

2.布尔值,数字,字符串的包装对象在序列化过程中会自动转换成对应的原始值

```javascript
JSON.stringify([new Number(1), new String("false"), new Boolean(false)]); 
// "[1,"false",false]"
```

3.undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）

```javascript
JSON.stringify({x: undefined, y: Object, z: Symbol("")}); 
// "{}"

JSON.stringify([undefined, Object, Symbol("")]);          
// "[null,null,null]" 
```

4.JSON.stringify 有第二个参数 replacer，它可以是数组或者函数，用来指定对象序列化过程中哪些属性应该被处理，哪些应该被排除。

```javascript
function replacer(key, value) {
  if (typeof value === 'string') {
    return undefined;
  }
  return value;
}

let foo = {foundation: 'Mozilla', model: 'box', week: 45, transport: 'car', month: 7};
let jsonString = JSON.stringify(foo, replacer);

console.log(jsonString);
//{"week":45,"month":7}
```

```javascript
var foo = {foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7};
console.log(JSON.stringify(foo, ['week', 'month']));
// {"week":45,"month":7}
```

5.如果一个被序列化的对象拥有 toJSON 方法，那么该 toJSON 方法就会覆盖该对象默认的序列化行为：不是那个对象被序列化，而是调用 toJSON 方法后的返回值会被序列化，例如：

```javascript
let obj = {
  foo: 'foo',
  toJSON: function() {
    return 'bar';
  }
};

JSON.stringify(obj); //'"bar"'
JSON.stringify({x: obj}); //'{"x": "bar"}'
```


#### 转换为Boolean值
不同类型与Boolean类型的值的转换是Boolean类型的重点，如下所述。

* String类型转换为Boolean类型
  * 空字符串""或者''都会转换为false
  * 任何非空字符串都会转换为true，包括只有空格的字符串" ".
* Number类型转换为Boolean类型
  * 0和NaN会转换为false
  * 除了0和NaN以外，都会转换为true，包括表示无穷大和无穷小的Infinity和-Infinity
* Object类型转换为Boolean类型
  * 当object为null时，会转换为false
  * 如果object不为null，则都会转换为true，包括空对象{}
* Function类型转换为Boolean类型
  * 任何Function类型的值都会转换为true
* Null类型转换为Boolean类型
  * Null类型只有一个null值，会转换为false。
* Undefined类型转换为Boolean类型
  * Undefined类型只有一个undefined值，会转换为false。


## 类型转换花式






## 6. 运算符使用-隐式类型转换

> 隐式类型转换
> 如果非数值进行运算时,JS会将其转换为数字然后再运算(除了字符串的加法)
> 利用这个特性,可以为任意值==\-0, *1== 来将其转换为数字.原理和Number()一样.



#### 隐式 转换为数值(+,-,\*)

一元运算符将其他类型转换为数值共有3种方法: +a, a-0, a*1,

```javascript
let a = 10 - true;// 10 - 1

a = true + false;// 1 + 0
a = 10 - '5'; // 10 - 5

a = 10 - null;// 10 - 0
a = 10 - undefined; // 10 - NaN a的值是Nan

隐式类型转换
let a = '2';

console.log(a, typeof a); // 2 string
//a = a + 0;
a = a * 1;
console.log(a, typeof a); // 2 "number"




转换为数值的4种方法:
let a = '10';

a = Number(a);
a = a - 0;
a = a * 1;
a = +a;



=====总结======
隐式类型转换:

转换为数字:
一元运算符:  +a
算术运算符:  a-0,a*1

转换为字符:
任意值+'';

转换为布尔值:
非布尔值: !!非布尔值


=======================
let a = '10';
let b = '5';
若要按照数值 临时 比较运算,且不影响a的数据类型,
   	+a > b; //非数值比较运算,会先转换为数值,再进行比较
```



#### 隐式 转换为字符串(+'')

对字符串进行加法运算时,它会将两个字符串拼接成一个字符串
任何值与字符串做加法运算时,都会被转换为字符串,然后和字符串进行拼串  

利用这个特点,可以为**任意值**加上一个 ==空串== 来将其转换成字符串然后拼串,其原理和String()是一样的,但是更加简洁



```js
let b = 'hello' + 'world';//'helloworld'

b = 'hello' + 123; // 'hello123'

b = NaN + 'abc'; // 'NaNabc'


隐士类型转换
let c = true;
c = c + '';//隐式类型转换
console.log(c, typeof c); // true string
```

