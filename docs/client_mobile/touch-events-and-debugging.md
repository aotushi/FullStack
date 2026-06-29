# 触摸事件与真机调试

> 移动端触摸事件、点击穿透和真机调试。这些不属于 CSS 响应式核心，已从响应式主题移到 `client_mobile`。

## 触摸事件类型

- `touchstart`：元素上触摸开始时触发。
- `touchmove`：元素上触摸移动时触发。
- `touchend`：手指从元素上离开时触发。
- `touchcancel`：触摸被打断时触发。

这些事件最早出现在 iOS Safari 中，用于传递移动端触摸交互信息。

应用场景：

- `touchstart`：触摸交互，例如页面跳转、标签页切换。
- `touchmove`：页面滑动特效、网页游戏、画板等。
- `touchend`：通常和 `touchmove` 结合使用。
- `touchcancel`：使用率不高，用于处理触摸被系统打断的情况。

注意点：

- `touchmove` 触发后，即使手指离开元素，仍可能持续触发相关移动过程。
- 触发 `touchmove` / `touchend` 前，一定先触发 `touchstart`。
- 事件的作用在于实现移动端界面交互。

## 点击穿透

> `touch` 事件结束后会默认触发元素的 `click` 事件。没有理想视口时间隔约 300ms，有理想视口约 30ms（也看设备）。如果 `touch` 事件隐藏了元素，后续 `click` 可能落到背后的新元素上，触发新的 `click` 或跳转——这就是点击穿透。

四种解法：

```txt
1. event.preventDefault() 阻止默认行为。
2. 穿透对象用 touch 事件代替 click 事件。
3. 延迟让背后元素 pointer-events: none，再恢复。
4. 延迟隐藏元素，避开 touch 和 click 的时间差。
```

阻止默认行为：

```js
node.addEventListener("touchstart", function (event) {
  event.preventDefault();
});
```

用触摸事件代替点击事件：

```js
bannerImg.addEventListener("touchstart", () => {
  location.href = "https://www.baidu.com";
});
```

让背后元素暂时不可点击：

```css
#anode {
  pointer-events: none;
}
```

```js
btn.addEventListener("touchstart", () => {
  shade.style.display = "none";
  setTimeout(() => {
    anode.style.pointerEvents = "auto";
  }, 500);
});
```

延迟隐藏元素：

```js
btn.addEventListener("touchstart", () => {
  setTimeout(() => {
    shade.style.display = "none";
  }, 300);
});
```

## 真机调试

常用内网穿透工具：

```txt
utools
ngrok
```

## 浏览器杂项

兼容性调试中可能看到 IE 判断代码：

```js
const isIe =
  document.documentMode || (+(navigator.userAgent.match(/MSIE\s(\d+)/) || [])[1] && RegExp.$1);
```

现代项目通常只在明确存在 IE 兼容目标时才需要这类判断。
