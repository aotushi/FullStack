---
aliases: CSS选择器分类222
---







### 分类

> https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Selectors  (未笔记)
>
> https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks

> 按照第一个链接来抄录笔记,  第二个内容分类没有根据








#### 类型,类和ID选择器

##### 类型选择器

有时也叫做“标签名选择器*”*或者是”元素选择器“，因为它在文档中选择了一个HTML标签/元素的缘故

##### 全局选择器

全局选择器，是由一个星号（`*`）代指的，它选中了文档中的所有内容（或者是父元素中的所有内容，比如，它紧随在其他元素以及邻代运算符之后的时候）

使用全局选择器,让选择器更易读

```html
article :first-child {} //用作<article>元素选择器的一个后代选择器

article:first-child {}  //选择了作为其他元素的第一子元素的<article>元素
  
//解决
  
article *:first-child {} //选中<article>元素的任何第一子元素：
```

<iframe src="https://codesandbox.io/embed/css-universal-selector-and-pseudo-selector-forked-kvpk2i?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="CSS - Universal selector and Pseudo selector (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>








##### 类选择器



##### ID选择器

ID选择器开头为`#`而非句点，不过基本上和类选择器是同种用法。

在一篇文档中，一个ID只会用到一次。

它能选中设定了`id`的元素，你能在ID前面加上类型选择器，只指向元素和ID都匹配的类。



#### 属性选择器

> [属性选择器 - CSS（层叠样式表） | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors)

CSS **属性选择器**通过已经存在的属性名或属性值匹配元素。

##### 存否和值选择器

这些选择器允许基于一个元素自身是否存在（例如`href`）或者基于各式不同的按属性值的匹配，来选取元素。

| 选择器          | 示例                            | 描述                                                         |
| :-------------- | :------------------------------ | :----------------------------------------------------------- |
| `[attr]`        | `a[title]`                      | 匹配带有一个名为*attr*的属性的元素——方括号里的值。           |
| `[attr=value]`  | `a[href="https://example.com"]` | 匹配带有一个名为*attr*的属性的元素，其值正为*value*——引号中的字符串。 |
| `[attr~=value]` | `p[class~="special"]`           | 表示带有以 attr 命名的属性的元素，并且该属性是一个以空格作为分隔的值列表，其中至少有一个值为 value。 |
| `[attr|=value]` | `div[lang|="zh"]`               | 表示带有以 attr 命名的属性的元素，属性值为“value”或是以“value-”为前缀（"`-`"为连字符，Unicode 编码为 U+002D）开头。典型的应用场景是用来匹配语言简写代码（如 zh-CN，zh-TW 可以用 zh 作为 value）。 |

使用案例:



##### 子字符串匹配选择器

| 选择器                                           | 示例                | 描述                                                         |
| :----------------------------------------------- | :------------------ | :----------------------------------------------------------- |
| `[attr^=value]`                                  | `li[class^="box-"]` | 匹配带有一个名为*attr*的属性的元素，其值开头为*value*子字符串。 |
| `[attr$=value]`                                  | `li[class$="-box"]` | 匹配带有一个名为*attr*的属性的元素，其值结尾为*value*子字符串 |
| `[attr*=value]`                                  | `li[class*="box"]`  | 匹配带有一个名为*attr*的属性的元素，其值的字符串中的任何地方，至少出现了一次*value*子字符串。 |
| `[*attr* *operator* *value* i]`                    |                     | 在属性选择器的右方括号前添加一个用空格隔开的字母 `i`（或 `I`），可以在匹配属性值时忽略大小写（支持 ASCII 字符范围之内的字母）。 |
| `[*attr* *operator* *value* s]` Experimental阶段 |                     | 在属性选择器的右方括号前添加一个用空格隔开的字母 `s`（或 `S`），可以在匹配属性值时区分大小写（支持 ASCII 字符范围之内的字母）。 |



使用案例:



##### 大小写敏感

如果你想在大小写不敏感的情况下，匹配属性值的话，<span style="color:blue">你可以在闭合括号(中括号)之前，使用`i`值</span>。这个标记告诉浏览器，要以大小写不敏感的方式匹配ASCII字符。没有了这个标记的话，值会按照文档语言对大小写的处理方式，进行匹配——HTML中是大小写敏感的。

有一个更加新的`s`值，它会强制在上下文的匹配正常为大小写不敏感的时候，强行要求匹配时大小写敏感。不过，在浏览器中它不太受支持，而且在上下文为HTML时也没啥用。

使用案例:

```css
li[class^='a' i] {
  color: red;
}
```





#### 伪类与伪元素







##### 伪元素

表现得是像你往标记文本中加入全新的HTML元素一样，而不是向现有的元素上应用类。伪元素开头为双冒号`::`



**语法**

```css
::pseudo-element-name

//一些早期的伪元素曾使用单冒号的语法,现代的浏览器为了保持后向兼容，支持早期的带有单双冒号语法的伪元素。
```



**案例**

如果你想选中一段的第一行，你可以把它用一个`<span>`元素包起来，然后使用元素选择器；不过，如果包起来的单词/字符数目长于或者短于父元素的宽度，这样做会失败。由于我们一般不会知道一行能放下多少单词/字符——因为屏幕宽度或者字体大小改变的时候这也会变——通过改变HTML的方式来可预测地这么做是不可能的。

`::first-line`伪元素选择器会值得信赖地做到这件事——即使单词/字符的数目改变，它也只会选中第一行。



##### 伪类和伪元素结合



**案例**

第一段的第一行加粗，你需要把`:first-child`和`::first-line`选择器放到一起。

```css
article p:first-child::first-line {
  font-size: 120%;
  font-weight: bold;
}
```



##### 生成带有`::before 和 ::after`内容

有一组特别的伪元素，它们和[`content`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content)属性一同使用，使用CSS将内容插入到你的文档中中

伪元素的更推荐的用法是插入一个图标，例如下面的示例加入的一个小箭头，作为一个视觉性的提示，而且我们并不希望屏幕阅读器读出它。

```css
.box::after {
    content: " ➥"
}
```

`::before`和`::after`伪元素与`content`属性的共同使用，在CSS中被叫做“生成内容”，而且你会见到这种技术被用于完成各种任务。

案例1

<iframe width="100%" height="400" src="https://mdn.github.io/css-examples/learn/selectors/after-icon.html" loading="lazy"></iframe>

案例2

用 `::before`伪元素加入了个空字符串。我们把它设为了`display: block`，以让它可以用 width 和 height 进行样式化。然后我们可以用 CSS 像任何元素那样样式化。你可以摆弄 CSS，改变它的外观和行为。

<iframe width="100%" height="500" src="https://mdn.github.io/css-examples/learn/selectors/before-styled.html" loading="lazy"></iframe>





[CSS Arrow Please](http://www.cssarrowplease.com/)网站就是一个著名的示例，它帮你用CSS生成一个箭头。



##### 伪类和伪元素列表

[伪类](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements#伪类)

| 选择器                                                                                         | 描述                                                                                                        |
| :------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------- |
| [`:active`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:active)                       | 在用户激活（例如点击）元素的时候匹配。                                                                                       |
| [`:any-link`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:any-link)                   | 匹配一个链接的`:link`和`:visited`状态。                                                                              |
| [`:blank`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:blank)                         | 匹配空输入值的[`<input>`元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)。                    |
| [`:checked`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:checked)                     | 匹配处于选中状态的单选或者复选框。                                                                                         |
| [`:current` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)           | 匹配正在展示的元素，或者其上级元素。                                                                                        |
| [`:default`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:default)                     | 匹配一组相似的元素中默认的一个或者更多的UI元素。                                                                                 |
| [`:dir`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:dir)                             | 基于其方向性（HTML`dir`属性或者CSS`direction`属性的值）匹配一个元素。                                                            |
| [`:disabled`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:disabled)                   | 匹配处于关闭状态的用户界面元素                                                                                           |
| [`:empty`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:empty)                         | 匹配除了可能存在的空格外，没有子元素的元素。                                                                                    |
| [`:enabled`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:enabled)                     | 匹配处于开启状态的用户界面元素。                                                                                          |
| [`:first`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:first)                         | 匹配[分页媒体](https://developer.mozilla.org/en-US/docs/Web/CSS/Paged_Media)的第一页。                               |
| [`:first-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:first-child)             | 匹配兄弟元素中的第一个元素。                                                                                            |
| [`:first-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:first-of-type)         | 匹配兄弟元素中第一个某种类型的元素。                                                                                        |
| [`:focus`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus)                         | 当一个元素有焦点的时候匹配。                                                                                            |
| [`:focus-visible`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus-visible)         | 当元素有焦点，且焦点对用户可见的时候匹配。                                                                                     |
| [`:focus-within`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus-within)           | 匹配有焦点的元素，以及子代元素有焦点的元素。                                                                                    |
| [`:future` (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/:future)               | 匹配当前元素之后的元素。                                                                                              |
| [`:hover`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:hover)                         | 当用户悬浮到一个元素之上的时候匹配。                                                                                        |
| [`:indeterminate`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:indeterminate)         | 匹配未定态值的UI元素，通常为[复选框](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)。           |
| [`:in-range`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:in-range)                   | 用一个区间匹配元素，当值处于区间之内时匹配。                                                                                    |
| [`:invalid`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:invalid)                     | 匹配诸如`<input>`的位于不可用状态的元素。                                                                                 |
| [`:lang`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:lang)                           | 基于语言（HTML[lang](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/lang)属性的值）匹配元素。       |
| [`:last-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:last-child)               | 匹配兄弟元素中最末的那个元素。                                                                                           |
| [`:last-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:last-of-type)           | 匹配兄弟元素中最后一个某种类型的元素。                                                                                       |
| [`:left`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:left)                           | 在[分页媒体 (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Pages)中，匹配左手边的页。                     |
| [`:link`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:link)                           | 匹配未曾访问的链接。                                                                                                |
| [`:local-link` (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/:local-link)       | 匹配指向和当前文档同一网站页面的链接。                                                                                       |
| [`:is()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:is)                             | 匹配传入的选择器列表中的任何选择器。                                                                                        |
| [`:not`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)                             | 匹配作为值传入自身的选择器未匹配的物件。                                                                                      |
| [`:nth-child(an+b)`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-child)           | 匹配一列兄弟元素中的元素——兄弟元素按照an+b形式的式子进行匹配（比如2n+1匹配元素1、3、5、7等。即所有的奇数个）。                                            |
| [`:nth-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-of-type)             | 匹配某种类型的一列兄弟元素（比如，`<p>`元素）——兄弟元素按照an+b形式的式子进行匹配（比如2n+1匹配元素1、3、5、7等。即所有的奇数个）。                               |
| [`:nth-last-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-last-child)       | 匹配一列兄弟元素，从后往前倒数。兄弟元素按照an+b形式的式子进行匹配（比如2n+1匹配按照顺序来的最后一个元素，然后往前两个，再往前两个，诸如此类。从后往前数的所有奇数个）。                  |
| [`:nth-last-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-last-of-type)   | 匹配某种类型的一列兄弟元素（比如，`<p>`元素），从后往前倒数。兄弟元素按照an+b形式的式子进行匹配（比如2n+1匹配按照顺序来的最后一个元素，然后往前两个，再往前两个，诸如此类。从后往前数的所有奇数个）。 |
| [`:only-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:only-child)               | 匹配没有兄弟元素的元素。                                                                                              |
| [`:only-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:only-of-type)           | 匹配兄弟元素中某类型仅有的元素。                                                                                          |
| [`:optional`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:optional)                   | 匹配不是必填的form元素。                                                                                            |
| [`:out-of-range`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:out-of-range)           | 按区间匹配元素，当值不在区间内的的时候匹配。                                                                                    |
| [`:past` (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/:past)                   | 匹配当前元素之前的元素。                                                                                              |
| [`:placeholder-shown`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:placeholder-shown) | 匹配显示占位文字的input元素。                                                                                         |
| [`:playing` (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/:playing)             | 匹配代表音频、视频或者相似的能“播放”或者“暂停”的资源的，且正在“播放”的元素。                                                                 |
| [`:paused` (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/:paused)               | 匹配代表音频、视频或者相似的能“播放”或者“暂停”的资源的，且正在“暂停”的元素。                                                                 |
| [`:read-only`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:read-only)                 | 匹配用户不可更改的元素。                                                                                              |
| [`:read-write`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:read-write)               | 匹配用户可更改的元素。                                                                                               |
| [`:required`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:required)                   | 匹配必填的form元素。                                                                                              |
| [`:right`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:right)                         | 在[分页媒体 (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Pages)中，匹配右手边的页。                     |
| [`:root`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:root)                           | 匹配文档的根元素。                                                                                                 |
| [`:scope`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:scope)                         | 匹配任何为参考点元素的的元素。                                                                                           |
| [`:valid`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:valid)                         | 匹配诸如`<input>`元素的处于可用状态的元素。                                                                                |
| [`:target`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:target)                       | 匹配当前URL目标的元素（例如如果它有一个匹配当前[URL分段](https://en.wikipedia.org/wiki/Fragment_identifier)的元素）。                  |
| [`:visited`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:visited)                     | 匹配已访问链接。                                                                                                  |

[伪元素](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements#伪元素)

| 选择器                                                       | 描述                                                 |
| :----------------------------------------------------------- | :--------------------------------------------------- |
| [`::after`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::after) | 匹配出现在原有元素的实际内容之后的一个可样式化元素。 |
| [`::before`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::before) | 匹配出现在原有元素的实际内容之前的一个可样式化元素。 |
| [`::first-letter`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-letter) | 匹配元素的第一个字母。                               |
| [`::first-line`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-line) | 匹配包含此伪元素的元素的第一行。                     |
| [`::grammar-error`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::grammar-error) | 匹配文档中包含了浏览器标记的语法错误的那部分。       |
| [`::selection`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::selection) | 匹配文档中被选择的那部分。                           |
| [`::spelling-error`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::spelling-error) | 匹配文档中包含了浏览器标记的拼写错误的那部分。       |







**实例(未完成)**

在众多网站上按钮在不同状态下效果不一，用以增强用户体验.

根据用户的行为不同，按钮效果可以分为：默认状态、悬浮状态、点击时状态、焦点状态和点击后状态，可以按照CSS3的动态伪选择器，在不同状态下给按钮赋予不同的样式风格.

<iframe height="300" style="width: 100%;" scrolling="no" title="动态伪类选择器-未完成" src="https://codepen.io/westover/embed/preview/gOWOPmJ?defaultTab=css%2Cresult&editable=true&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/westover/pen/gOWOPmJ">
  动态伪类选择器-未完成</a> by xxl (<a href="https://codepen.io/westover">@westover</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>









2. 目标伪类选择器

目标伪类选择器“:target”是众多实用的CSS3特性中的一个，用来匹配文档（页面）的URI[插图]中某个标志符的目标元素

URI中的标志符通常会包含一个井号（#），后面带有一个标志符名称，例如“#contact”“:target”就是用来匹配ID为“contact”的元素的。

**语法**

| 选择器   | 功能描述                                    |
| -------- | ------------------------------------------- |
| E:target | 选择匹配E的所有元素,且匹配元素被相关url指向 |

**实例**

> 页面中有三个区块，默认状态只显示三个区块的标题，点击其中一个标题时，其对应的内容就会显示；点击另一个标题时，对应区块内容将显示，而前一块内容将隐藏

<iframe height="300" style="width: 100%;" scrolling="no" title="目标伪类选择器" src="https://codepen.io/westover/embed/preview/WNjNxYB?defaultTab=css%2Cresult&editable=true&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/westover/pen/WNjNxYB">
  目标伪类选择器</a> by xxl (<a href="https://codepen.io/westover">@westover</a>)
  on <a href="https://codepen.io">CodePen</a>
</iframe>







**更多的应用场景**

| 效果                                       | 地址                                                         |
| ------------------------------------------ | ------------------------------------------------------------ |
| 高亮显示区块                               |                                                              |
| 从相互层叠的盒容器或图片中突出显示其中一项 | http://www.red-team-design.com/get-to-know-your-css3-target-pseudo-class |
| tabs效果                                   |                                                              |
| 幻灯片效果                                 |                                                              |
| 相册效果                                   | 失效                                                         |



**实例-突出显示一项**

<iframe height="300" style="width: 100%;" scrolling="no" title="目标伪类选择器" src="https://codepen.io/westover/embed/preview/qBmBqqG?defaultTab=html%2Cresult&editable=true&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/westover/pen/qBmBqqG">
  目标伪类选择器</a> by xxl (<a href="https://codepen.io/westover">@westover</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>






**实例-幻灯片 ++**

第二个和第四个没有效果.

<iframe height="700" style="width: 100%;" scrolling="no" title="目标伪类选择器-幻灯片(未完成)" src="https://codepen.io/westover/embed/MWmYXyv?defaultTab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/westover/pen/MWmYXyv">
  目标伪类选择器-幻灯片(未完成)</a> by xxl (<a href="https://codepen.io/westover">@westover</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>





**实例-tab效果**

<iframe height="300" style="width: 100%;" scrolling="no" title="目标伪类选择器-tab" src="https://codepen.io/westover/embed/xxdwRwX?defaultTab=html%2Cresult&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/westover/pen/xxdwRwX">
  目标伪类选择器-tab</a> by xxl (<a href="https://codepen.io/westover">@westover</a>)
  on <a href="https://codepen.io">CodePen</a>
</iframe>









3.语言伪类选择器

使用语言伪类选择器来匹配使用语言的元素是非常有用的，特别是用于多语言版本的网站，其作用更是明显。可以使用他来根据不同语言版本设置页面的字体风格。



**语法**

语言伪类选择器是根据元素的语言编码匹配元素。这种语言信息必须包含在文档中，或者与文档关联，不能从CSS指定。为文档指定语言，有两种方法可以表示:

```css
//h5
<!doctype html>
<html lang='en-US'>

//第二种方法
<body lang='fr'>
```

语言伪类选择器允许为不同的语言定义特殊的规则，这在多语言版本的网站用起来是特别的方便。



**实例**

```css
语言伪类选择器，就是根据元素的 lang属性，来匹配使用指定语言的元素。可以根据不同语言版本，设置不同的字体风格、定义不同的引号标记,不同的背景图片等

<p lang="en"><q>Quote in English</q></p>
<p lang="zh-cn"><q>中文的引号</q></p>

//英文版本的引文效果
:lang(en) {
  font-family: Arial;
  quotes: '"' '"';
}
//中文版本下的字体效果和引文效果
:lang(zh-cn) {
  font-family: 宋体;
  quotes: '<<' '>>'
}
```





4. UI元素状态选择器

是CSS3选择器模块组中的一部分，主要用于form表单元素上，以提高网页的人机交互、操作逻辑以及页面的整体美观，使表单页面更具个性与品位，而且使用户操作页面表单更便利和简单



**UI 元素状态伪类选择器语法**

UI元素的状态一般包括：启用、禁用、选中、未选中、获得焦点、失去焦点、锁定和待机等

在HTML元素中有可用和不可用状态，例如表单中的文本输入框；HTML元素中还有选中和未选中状态，例如表单中的复选按钮和单选按钮。这几种状态都是CSS3选择器中常用的状态伪类选择器



| 选择器     | 类型                 | 功能描述                             |
| ---------- | -------------------- | ------------------------------------ |
| E:checked  | 选中状态伪类选择器   | 匹配选中的复选按钮或单选按钮表单元素 |
| E:enabled  | 启用状态伪类选择器   | 匹配所有启用的表单元素               |
| E:disabled | 不可用状态伪类选择器 | 匹配所有禁用的表单元素               |



**实例**

```css
//表单元素获得焦点效果
textarea:focus,
input[type='text']:focus,
input[type='password']:focus {
  border-color: rgba(82,168,236,.8);
  outline: 0;
  outline: thin dotted \9;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.75), 0 0 8px rgba(82,168,236,.6);
}

//表单下拉选择框,文件控件,单选按钮,复选按钮得到焦点效果
select:focus,
input[type='file']:focus,
input[type='radio']:focus,
input[type='checkbox']:focus {
  outline: thin dotted #333;
  outline: 5px auto -webkit-focus-ring-color; // 用的很少,不同浏览器解析不同的颜色.
  outline-color: -2px;
}

//禁用的input select textarea表单元素效果
input[disabled],  //等效于input:diasbled;
select[disabled],  //等效于input:diasbled;
textarea[disabled] { //等效于input:diasbled;
  cursor: not-allowed;
  background-color: #eee;
  border-color: #ddd;
}

//禁用的单选按钮和复选按钮效果
input[type='radio'][disabled], //等效于 input[type='radio']:disabled
input[type='checkbox'][disabled] { //等效于 input[type='checkbox']:disabled
  background-color: #ddd;
}

//表单警告状态下效果 自己定义的类型 class='control-group warning'
.control-group.warning .checkbox,
.control-group.warning .radio,
.control-group.warning  input,
.control-group.warning select,
.control-group.warning textarea {
  color: #c09853;
  border-color: #c09853;
}

//表单警告状态下获得焦点效果
.control-group.warning .checkbox:focus,
.control-group.warning .radio:focus,
.control-group.warning input:focus,
.control-group.warning select:focus,
.control-group.warning textarea:focus {
  border-color: #a47e3c;
  box-shadow: 0 0 6px #dbc59e;
}

//表单错误状态与成功下效果
.control-group.error .checkbox
.control-group.success .checkbox
```



注意: 表单元素得到焦点和禁用两种状态使用方法，在使用UI状态选择器时特别注意，HTML结构中要存在这种状态，例如禁用的输入框，需要在HTML的对应元素上添加禁用属性.

```html
<input class="input-xlarge disabled" id="disabledInput" type='text' placeholder='Disabled input here'>
```





5. 结构伪类选择器

伪类可以将一段并不存在的HTML当作独立元素来定位，或是找到无法使用其他简单选择器就能定位到的切实存在的元素。因此CSS3给伪类选择器引入一种“结构伪类选择器”。这种选择器可以根据元素在文档树中的某些特性（如相对位置）定位到它们。也就是说，**通过文档树结构的相互关系来匹配特定的元素**，从而减少HTML文档对ID或类名的定义，帮助你保持代码干净和整洁。



**文档树**

文档树（Document Tree）是HTML页面的层级结构。它由元素、属性和文本组成，它们都是一个节点（Node），就像公司的组织结构图一样.

**用法**

| 选择器                | 功能描述                                                     |
| --------------------- | ------------------------------------------------------------ |
| E:root                | 选择匹配元素E所在文档的根元素.在HTML文档中,根元素始终是html,<br/>此时该选择器与html类型选择器匹配的内容相同. |
| E:empty               | 选择没有子元素的元素,且该元素不包括任何文本节点<br/>常用来处理动态输出内容,例如高亮用户搜索出来的结果为空时. |
| E:first-child         | 作为父元素第一个子元素的元素. 与E:nth-child(1)等同           |
| E:last-child          | 作为父元素E的最后一个子元素的元素. 与E:nth-last-child(1)等同. |
| E F:nth-child(n)      | 选择父元素E的第n个子元素F. <br/>其中,n的值可以是整数(1,2,3),关键字(odd,event),公式(2n+1, -n+5).<br/>n的起始值为1,不是0. |
| E F:nth-last-child(n) | 选择父元素E的倒数第n个子元素F.<br/>此选择器与`E F:nth-child(n)`刚好相反,但使用方法都一样.<br/>其中:nth-last-child(1)始终匹配的是最后一个元素,与:last-child等同. |
| E:nth-of-type(n)      | 选择父元素内具有指定类型的第n个E元素                         |
| E:nth-last-of-type(n) | 选择父元素内具有指定类型的倒数第n个E元素                     |
| E:first-of-type       | 选择父元素内具有指定类型的第一个E元素,与E:nth-of-type(1)等同 |
| E:last-of-type        | 选择父元素内具有指定类型的倒数第1个E元素, 与E:nth-last-of-type(1)等同. |
| E:only-child          | 选择父元素只包含一个子元素,且该子元素匹配E元素               |
| E:only-of-type        | 选择父元素只包含一个同类型的子元素,且该子元素匹配E元素       |
|                       |                                                              |



**实例**

<iframe height="300" style="width: 100%;" scrolling="no" title="结构伪类选择器-demo" src="https://codepen.io/westover/embed/ExmVQmw?defaultTab=html%2Cresult&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/westover/pen/ExmVQmw">
  结构伪类选择器-demo</a> by xxl (<a href="https://codepen.io/westover">@westover</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>







**浏览器兼容性**

CSS3结构伪类选择器在主流浏览器下运行都非常的完美，只是在IE 9以下版本的浏览器中无法正常运行



**结构伪类选择器中的n指什么**

```js
//在结构伪类选择器中，有4 个伪类选择器接受参数n
:nth-child(n)
:nth-of-child(n)
:nth-of-type(n)
:nth-last-of-type(n)
n的起始值始终是1，而不是0。换句话说，当参数n的值为0时，选择器将选择不到任何匹配的元素。

表达式中,n从0开始计算
```

n的值为:

1.具体数值

2.表达式n*length

3.n+length

4.-n+length

5.n*length+b

6.odd/even



**实例2-zebra斑马线表格**

给数据量大的表格设计背景色,传统方法是奇偶行不同背景色,但存在潜在的不便,例如动态插入行.

<iframe height="300" style="width: 100%;" scrolling="no" title="结构伪类选择器-zebra表格" src="https://codepen.io/westover/embed/JjNYvXY?defaultTab=html%2Cresult&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/westover/pen/JjNYvXY">
  结构伪类选择器-zebra表格</a> by xxl (<a href="https://codepen.io/westover">@westover</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>









6. 否定伪类选择器

否定选择器“:not()”是CSS3的新选择器，类似jQuery中的“:not()”选择器，主要用来定位不匹配该选择器的元素

**语法**

| 选择器   | 功能描述                   |
| -------- | -------------------------- |
| E:not(F) | 匹配所有除元素F之外的E元素 |





##### 伪元素选择器案例

伪元素可用于定位文档中包含的文本，但无法在文档树中定位。伪类一般反映无法在CSS中轻松或可靠地检测到的某个元素属性或状态；另一方面，伪元素表示DOM外部的某种文档结构

CSS3中对伪元素进行了一定的调整，在以前的基础上增加一个冒号

对于IE 6～8，仅支持单冒号表示法，而现代浏览器同时支持这两种表示法。另外一个区别是，双冒号与单冒号在CSS3中主要用来区分伪类和伪元素。到目前来说，这两种方式都是被浏览器接受的。



::first-letter

“::first-letter”用来选择文本块的第一个字母，除非在同一行中包含一些其他元素。“::first-letter”通常用于给文本元素添加排版细节，例如下沉字母或首字母，下面的代码是如何使用“::first-letter”创建首字下沉。



**实例**

<iframe height="300" style="width: 100%;" scrolling="no" title="::first-letter -首字下沉" src="https://codepen.io/westover/embed/vYmNjjW?defaultTab=html%2Cresult&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/westover/pen/vYmNjjW">
  ::first-letter -首字下沉</a> by xxl (<a href="https://codepen.io/westover">@westover</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>







::first-line

“::first-line”的使用和“::first-letter”类似，也常用于文本排版方面，只不过“::firstline”用来匹配元素的第一行文本，可以应用一些特殊的样式，给文本添加一些细微的区别。“::first-line”将匹配block、inline-block、table-caption、table-cell等级别元素的第一行





::before ::after

“:before”和“:after”，或许不会陌生，因为清除浮动就使用这两个伪类

“::before”和“::after”不是指存在于标记中的内容，而是可以插入额外内容的位置。尽管生成的内容不会成为DOM的一部分，但它同样可以设置样式

要伪元素生成内容,还需要配合content属性. 例如，假设在页面上所有外部链接之后的括号中附加它们所指向的URL，无须将URL硬编码到标记中，可以结合使用一个属性选择器和“::after”伪元素。

```css
a[href^=http]::after {
  content: "("attr(href)")"
}

//html显示
内容(url的地址)
```



::selection

“::selection”是用来匹配突出显示的文本。浏览器默认情况下，选择网站文本是深蓝的背景，白色的字体

浏览器对“::selection”支持并不完美，在整个IE 系列中仅有IE 9支持，Firefox也需要加上其私有属性“-moz”

注意:

伪元素::selection仅接受两个属性，一个是background，另一个是color。

**实例**

<iframe height="300" style="width: 100%;" scrolling="no" title="::selection demo" src="https://codepen.io/westover/embed/rNmOKPY?defaultTab=html%2Cresult&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/westover/pen/rNmOKPY">
  ::selection demo</a> by xxl (<a href="https://codepen.io/westover">@westover</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>



#### 关系选择器



##### 后代选择器

后代选择器——典型用单个空格（` `）字符——组合两个选择器



##### 子代关系选择器

子代关系选择器是个大于号（`>`），只会在选择器选中<u>直接子元素</u>的时候匹配.继承关系上更远的后代则不会匹配。



##### 相邻兄弟选择器

邻接兄弟选择器（`+`）用来选中恰好处于另一个在继承关系上同级的元素同级的元素





##### 通用兄弟选择器

如果你想选中一个元素的兄弟元素，即使它们不直接相邻，你还是可以使用通用兄弟关系选择器（`~`）

案例:

选中所有的`<p>`元素后*任何地方*的`<img>`元素

```css
p~img
```



#### 选择器使用遇到的问题

##### 伪类选择器`:first-child`, `:last-child`失效

>   使用`:first-child`伪类时一定要保证前面没有兄弟节点，把h1去掉就可以；或者使用div包住article，然后css：`div.article:first-child`
>
>   或者使用`first-of-type`


