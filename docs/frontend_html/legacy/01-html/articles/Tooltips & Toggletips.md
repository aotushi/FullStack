> https://inclusive-components.design/tooltips-toggletips/


> 工具提示大体上可以分为两类: 真正的工具提示; 可以'toggletip'的模式.

## Inclusive tooltips(包容性工具提示)
首先要作对的事是让工具提示中的文本对辅助技术可访问.有很多方法可以将tooltip与焦点控件连接起来,我们基于tooltipo特定role来选择: <span style="color:blue">tooltip是用作标签还是辅助性声明?</span>

### 标签/辅助性描述
![](https://inclusive-components.design/content/images/2017/07/primary_or_auxiliary.svg)


一个带有"通知"提示的通知控制将该提示视为主要标签。另外，读取"查看通知并管理设置"的工具提示则是补充性的。





### 作为主要标签的tooltip

> 可以使用 aria-labelledby 来将一个元素与另一个元素关联起来，作为它的主要标签。

通过`aria-labelledby`和`id`属性共享相同的值来建立这种关系。
```html
<button class="notifications" aria-labelledby="notifications-label">  
  <svg><use xlink:href="#notifications-icon"></use></svg>
</button>  
<div role="tooltip" id="notifications-label">Notifications</div>


// 
```

* 记住`role=tooltip`的用法,其提供的所有保证就是,`aria-describedby`在受支持的环境中工作.[除非你合适的使用role, 否则ARIA标签和元素有时并不适用所有元素](https://www.tpgi.com/short-note-on-aria-label-aria-labelledby-and-aria-describedby/). [[aria-label,aria-labelledby,aria-describedby]]
* 在某些标签中的内容例如svg,链接的SVG中的任何文本内容都不会被读出。aria-labelledby关联优先于按钮的文本内容作为标签。

对于屏幕阅读器及用户,上面代码功能上与下面的简单文本标签类似:
```html
<button class="notifications">Notifications</button>
```

#### 多余的tooltips
* 使用title属性来链接相同文本节点
```html
<a href="/some/path" title="Heydon's special page">Heydon's special page</a>
```


#### 包含通知数量
> `aria-labelledby`能接受多个,以空格分隔的id.

通知按钮包含未读通知的数量.

![](https://inclusive-components.design/content/images/2017/07/notification_count-1.svg)


```html
<button class="notifications" aria-labelledby="notifications-count notifications-label">  
  <svg><use xlink:href="#notifications-icon"></use></svg>
  <span id="notifications-count">3</span>
</button>  
<div role="tooltip" id="notifications-label">Notifications</div>
```



### 作为辅助说明的tooltip
一些交互元素可能具有可访问的描述,但是所有的交互元素都需要可访问的标签.例如`<input>`的`placeholder`, tooltips(工具提示)应添加信息和说明.
一些交互元素可能有可访问的描述，但所有交互元素都需要可访问的标签。如果我们使用aria-describedby来连接工具提示文本，我们将需要另一种方法来提供"通知"标签。我们可以在按钮的文本节点中添加一个视觉上隐藏的跨度，而不是使用aria-labelledby，与现有的"3"计数器并排。
```html
<button class="notifications" aria-describedby="notifications-desc">  
  <svg><use xlink:href="#notifications-icon"></use></svg>
  <span id="notifications-count">3</span> 
  <span class="visually-hidden">Notifications</span>
</button>  
<div role="tooltip" id="notifications-desc">View and manage notifications settings</div>  
```

`visually-hidden`类隐藏`<span>`,但在屏幕阅读器上依然是可读的.
```css
.visually-hidden {
  clip-path: inset(100%);
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```

aria-describedby规定的行为是作为控件的最后一部分信息进行公告，位于标签和角色之后。在这种情况下：“通知按钮…查看和管理通知设置”（大多数屏幕阅读器会在描述前留下一个暂停）。







### 交互interaction
为了改善声名狼藉的`title`属性，我们定制的工具提示应在焦点和悬停时出现。通过在按钮旁边的元素中提供工具提示，我们只需使用CSS即可实现此功能：

```css
[role="tooltip"] {
  display: none;
}

button:hover + [role="tooltip"],  
button:focus + [role="tooltip"] {  
  display: block;
}
```

然而，我们可能需要将按钮和工具提示包裹在一个容器元素中以便定位：

```css
.button-and-tooltip {
  position: relative;
}

[role="tooltip"] {
  position: absolute;
  /* left/top/right/bottom values as required */
}
```







### 触摸交互(touch interaction)

到目前为止，这对触屏用户来说并不太好用，因为focus和active状态同时发生。实际上，这意味着你会看到工具提示，但只有在按钮被按下时才会出现。









### 兼容性的切换提示(inclusive toggletips)

toggletips和tooltips类似,都是提供补充或声明信息.它们差异在让控件本身成为补充: 切换提示是为了显示信息提示,没有其它作用.
通常,它们采用小`i` 标志的形式:

![](https://inclusive-components.design/content/images/2017/07/i-1.svg)


触摸操作的效果与鼠标或键盘一样好，通过点击而不是悬停和聚焦来显示切换提示。这意味着aria-describedby的关联不再适用。为什么？因为屏幕阅读器用户在按下按钮之前就能获取到信息，所以按下它似乎没有任何效果。

#### 带有实时区域的切换提示
诀窍是让屏幕阅读器在点击事件后宣布信息。这是一个完美的实时区域使用案例。我们可以提供一个空的实时区域，并在调用时用"气泡"填充它。这将使气泡在视觉上出现并导致实时区域宣布工具提示的信息。
以下是未填充实时区域的标记。注意.tooltip-container元素，该元素被提供以帮助定位。此元素应有相对位置，允许绝对定位生成的.toggletip-bubble元素附近。

```html
<span class="tooltip-container">  
  <button type="button" aria-label="more info" data-toggletip-content="This clarifies whatever needs clarifying">i</button>
  <span role="status"></span>
</span>  
```

注意type="button"属性，其目的是防止某些浏览器在将按钮放置在表单内时误认为它是提交按钮。以下是填充了实时区域的标记（在点击toggletip按钮后）：
```html
<span class="tooltip-container">  
  <button type="button" aria-label="more info" data-toggletip-content="This clarifies whatever needs clarifying">i</button>
  <span role="status">
    <span class="toggletip-bubble">This clarifies whatever needs clarifying</span>
  </span>
</span>  
```


完整的代码:
```js
(function() {
  // Get all the toggletip buttons
  var toggletips = document.querySelectorAll('[data-toggletip-content]');

  // Iterate over them
  Array.prototype.forEach.call(toggletips, function (toggletip) {
    // Get the message from the data-content element
    var message = toggletip.getAttribute('data-toggletip-content');

    // Get the live region element
    var liveRegion = toggletip.nextElementSibling;

    // Toggle the message
    toggletip.addEventListener('click', function () {
        liveRegion.innerHTML = '';
        window.setTimeout(function() {
          liveRegion.innerHTML = '<span class="toggletip-bubble">'+ message +'</span>';
        }, 100);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (toggletip !== e.target) {
        liveRegion.innerHTML = '';
      }                        
    });

    // Remove toggletip on ESC
    toggletip.addEventListener('keydown', function(e) {
      if ((e.keyCode || e.which) === 27)
      liveRegion.innerHTML = '';
    });
  });
}());

```

#### 逐步提升的标题

标题属性确实很不稳定。但至少它为一些辅助技术提供了一个可访问的标签，在按钮被聚焦时可用。我们可以通过标题提供气泡内容，并使用此来在页面加载时构建data-toggletip-content属性。我们脚本的初始钩子现在变成了布尔值data-toggletip。
```html
<button data-toggletip aria-label="more info" title="This clarifies whatever needs clarifying">i</button>  

<script>
var toggletips = document.querySelectorAll('[data-toggletip][title]');

Array.prototype.forEach(toggletips, function (toggletip) {  
  var message = toggletip.getAttribute('title');
  toggletip.setAttribute('data-tooltip-content', message);
  toggletip.removeAttribute('title');
});
</script>
```

在脚本中，我们需要从标题中获取值来构建数据提示内容，然后销毁标题，因为我们不再需要它，并且如果留下可能会继续出现/被公布。

#### 更好的提高
一个没有任何功能并且恰好有标题属性的按钮，其实并不是一个很好的基准。相反，我建议直接显示toggletip的内容，然后通过动态创建toggletip按钮进行增强。

这里有另一个codePen，它将简单的段落逐步提升为toggletip：
<iframe height="265" scrolling="no" title="Toogletip from paragraph" src="https://codepen.io/heydon/embed/Vzwdpy/?height=265&amp;theme-id=0&amp;default-tab=html,result&amp;embed-version=2" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 100%;" __idm_id__="11886593">See the Pen <a href='https://codepen.io/heydon/pen/Vzwdpy/'>Toogletip from paragraph</a> by Heydon (<a href='https://codepen.io/heydon'>@heydon</a>) on <a href='https://codepen.io'>CodePen</a>.  
</iframe>
<iframe height="265" scrolling="no" title="Toogletip from paragraph" src="https://codepen.io/heydon/embed/Vzwdpy/?height=265&amp;theme-id=0&amp;default-tab=html,result&amp;embed-version=2" frameborder="no" allowtransparency="true" allowfullscreen="true" style="width: 100%;" __idm_id__="11886593">See the Pen <a href='https://codepen.io/heydon/pen/Vzwdpy/'>Toogletip from paragraph</a> by Heydon (<a href='https://codepen.io/heydon'>@heydon</a>) on <a href='https://codepen.io'>CodePen</a>.  
</iframe>
### 测试和错误信息

如果我们的toggletip组件属于一个设计系统，可能会被很多不同的人借用和使用。通过编写测试并包含警告，我们可以尝试确保它没有被误用。

一个不是`<button>`的toggletip按钮对辅助技术提供了欺骗性角色，并且不能通过键盘聚焦（除非它是另一个不适当的可聚焦元素，如超链接）。在我们的脚本中，我们可以检测元素nodeName，并返回错误信息如果它不是BUTTON。 我们使用return来停止执行IIFE（立即调用函数表达式）的其余部分。

```js
if (toggletip.nodeName !== 'BUTTON') {  
  console.error('Toggletip buttons need to be <button> elements.')
  return;
}
```

#### CSS测试和错误信息

在《包容性设计模式》中，我写到了创建刻意的视觉回归以突出代码错误，并在开发者工具的CSS检查器中提供错误信息。

我们之前用JavaScript捕获的错误可以使用CSS选择器`[data-tooltip]:not(button)`来捕获。我们可以用红色轮廓突出显示错误元素，并使用虚构的ERROR属性提供一个错误消息：

```css
[data-tooltip]:not(button) {
  outline: red solid 0.5em;
  ERROR: Toggletip buttons need to be <button> elements.
}
```

尽管是无效的属性，但当检查元素时，错误会出现在开发者工具中。

![](https://inclusive-components.design/content/images/2017/07/red_outline.svg)


### 兼容性

大多数情况下，如果你提供了清晰的文本标签和熟悉的图标，就不需要使用工具提示。大多数时候，切换提示是一种复杂的提供信息方式，这些信息完全可以作为文档的散文内容。但我在审核网站时总会看到这些组件，所以我想提供一些如何充分利用它们的指导。

**检查清单**
* 如果你有空间，不要使用工具提示或切换提示。只需提供清晰的标签和足够的正文文字。
* 如果你打算使用工具提示，请决定是否应将该提示内容作为标签或描述，并相应地选择ARIA属性。
* 不要依赖标题属性。他们无法通过键盘访问，并且在许多屏幕阅读器设置中都不受支持。
* 不要用aria-describedby来描述切换提示。这会使主题按钮对屏幕阅读器用户失去功能。
* 别在工具提示或切换提示中放入交互式内容，如关闭和确认按钮或链接。这是更复杂菜单和对话框组件的任务。