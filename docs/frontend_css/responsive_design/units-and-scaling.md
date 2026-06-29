# 单位与等比还原

> [基础层] 这一篇是长度单位的参考表，以及 `rem` / `vw` / `scale` 三种“等比还原”的换算原理。`rem` / `vw` / `scale` 的换算**原理**在这里讲透；移动端专属的 `rem` 流派、`flexible.js`、动态根字号落地见[移动端适配](./case-mobile-h5.md)，大屏 `scale` 落地见[大屏看板](./case-dashboard.md)。像素、DPR、视口概念见[像素与视口](./pixels-and-viewport.md)。

## 长度单位速查

| 单位                     | 相对于谁                       | 典型用途                                       |
| ------------------------ | ------------------------------ | ---------------------------------------------- |
| `px`                     | 绝对（CSS 像素，非物理像素）   | 边框、细节尺寸                                 |
| `%`                      | 父元素对应属性                 | 流式宽度；不同属性参考对象不同，不适合统一换算 |
| `em`                     | 当前元素 `font-size`           | 跟随字号的间距                                 |
| `rem`                    | 根元素 `<html>` 的 `font-size` | 配合动态根字号做等比还原                       |
| `vw` / `vh`              | 视口宽 / 高的 1%               | 视口驱动的尺寸、等比还原                       |
| `dvh` / `svh` / `lvh`    | 动态 / 最小 / 最大视口高       | 移动端替代有坑的 `vh`（地址栏伸缩跳动）        |
| `vmin` / `vmax`          | 视口宽高中的较小 / 较大值      | 方向无关的尺寸                                 |
| `ch`                     | 当前字体 “0” 的宽度            | 正文阅读宽度，如 `max-width: 72ch`             |
| `clamp(min, ideal, max)` | ——                             | 给流体尺寸加上下限，替代多段媒体查询           |

## 什么是“等比还原”

把设计稿上的像素尺寸，按当前屏幕宽度**整体等比例**映射过去，让任何宽度的设备都和设计稿同一比例。它和“响应式”是两种思路：响应式追求“不同尺寸下重新排布”，等比还原追求“同一版式整体缩放”。

实现等比还原有三种数学上等价的手段：动态根字号（`rem`）、视口单位（`vw`）、整体变换（`scale`）。下面是它们的换算原理；具体到某个场景怎么落地，见案例层。

## `rem`：动态根字号

原理：写样式时统一用 `rem`，再用 JS 按设备宽度动态设置根字号，让 `1rem` 始终等于“设计稿的某等份”。

两种系数流派：

- **设计值 ÷ 100**：根字号 = `设备宽 × 100 / 设计稿宽`，样式里写 `设计值 / 100`。
- **设计值 ÷ (设计稿宽 / 10)**：根字号 = `设备宽 / 10`，把屏宽分成 10 份，样式里写 `设计值 / (设计稿宽 / 10)`。

“÷100”流派的根字号脚本：

```js
function adapter() {
  const dip = document.documentElement.clientWidth;
  const rootFontSize = (dip * 100) / 375; // 375 为设计稿宽
  document.documentElement.style.fontSize = rootFontSize + "px";
}

adapter();
window.addEventListener("resize", adapter);
```

手淘 `flexible.js` 用的是“分 10 份”流派：

```js
(function flexible(window, document) {
  const docEl = document.documentElement;
  const dpr = window.devicePixelRatio || 1;

  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + "px";
    } else {
      document.addEventListener("DOMContentLoaded", setBodyFontSize);
    }
  }
  setBodyFontSize();

  function setRemUnit() {
    const rem = docEl.clientWidth / 10;
    docEl.style.fontSize = rem + "px";
  }
  setRemUnit();
  window.addEventListener("resize", setRemUnit);
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) setRemUnit();
  });
})(window, document);
```

换算示例（750 设计稿、分 10 份 → `1rem = 75px`）：

```txt
视觉稿 176 * 176 的元素 → 176 / 75 = 2.346667rem
```

2018 年手淘把 REM 适配切换到 VW 适配：把 `px → rem` 改成 `px → vw`，去掉 `lib-flexible`，工程里用 `px2vw` 替换 `px2rem`。

## `vw`：视口单位

原理：`100vw` 恒等于视口宽度。设计稿宽 `W`，则 `1px = (100 / W) vw`，无需 JS。

```txt
750 设计稿：1px = 100 / 750 vw ≈ 0.1333vw
视觉稿 120 * 80 的图 → width: 16vw; height: 10.667vw;
```

纯 `vw` 把所有尺寸（含字号）都写成 `vw`，1:1 复刻设计稿、自动等比缩放：

```css
img {
  width: 32vw;
  height: 21.333vw;
}
```

代价是版式一旦定死，后期改布局成本很高——适合活动页、运营页、海报页等强视觉还原页面，不适合长期维护的大型项目。

## `vw` + `calc` / `clamp`：带上下限的流体

纯等比会让大屏上字号无限放大。想要“流体但有边界”，用 `vw` 配 `calc()`，或更简洁的 `clamp()`：

```css
html {
  font-size: 16px;
  /* 375px → 16px 平滑到 414px → 18px，并夹在 16~22px */
  font-size: clamp(16px, calc(16px + 2 * (100vw - 375px) / 39), 22px);
}
```

这其实已经偏向“响应式”而非纯等比，是两种思路的中间地带。

## `scale`：整体变换

原理：容器按设计稿尺寸（如 `1920 * 1080`）原样开发，再用 `transform: scale(比率)` 整体缩放到当前屏幕。元素内部完全不动，只在最外层缩放一次。

最朴素的“按宽度比率”会在超宽屏（如 `7680 * 2160`）下把高度顶出屏幕。更稳的做法是比较当前宽高比与设计稿宽高比，决定按宽还是按高缩放：

```js
const targetWidth = 1920;
const targetHeight = 1080;
const targetRatio = 16 / 9;

const currentWidth = document.documentElement.clientWidth;
const currentHeight = document.documentElement.clientHeight;

let scaleRatio = currentWidth / targetWidth;
const currentRatio = currentWidth / currentHeight;

if (currentRatio > targetRatio) {
  // 屏幕更宽：按高度缩放，避免内容高度溢出
  scaleRatio = currentHeight / targetHeight;
  document.body.style = `transform: scale(${scaleRatio}) translateX(-50%)`;
} else {
  // 屏幕不够宽：按宽度缩放，保证宽度铺满
  document.body.style = `transform: scale(${scaleRatio})`;
}
```

判断核心：屏幕更“宽”时按高度缩放（防高度溢出），不够宽时按宽度缩放（保证铺满宽度），多出来的区域留白（letterbox）。

## 三法对比

|            | 依赖 JS | 性质      | 适合                 | 主要坑                                    |
| ---------- | ------- | --------- | -------------------- | ----------------------------------------- |
| `rem`      | 是      | 等比      | 旧 H5、已有 REM 体系 | 大屏两侧留白；需维护根字号                |
| 纯 `vw`    | 否      | 等比      | 活动页、海报页       | 改版式成本高；配 `max-width` 居中会破内部 |
| `vw+clamp` | 否      | 流体+边界 | 字号 / 间距平滑变化  | 不是真正的布局结构变化                    |
| `scale`    | 是      | 等比      | 固定比例大屏看板     | 缩放原点、留白、交互坐标换算              |

共同缺陷——它们都盯着**全局视口**：`rem` / `vw` 在给页面设 `max-width` 居中后，内部元素仍按视口而非容器变化；这正是需要**容器查询**让组件跟随自身容器的原因（容器查询的用法见[通用响应式方案](./general-responsive.md)）。

落地细节：移动端的 750 稿 + PostCSS 工程化见[移动端适配](./case-mobile-h5.md)；大屏的画布尺寸、`transform-origin`、超宽屏补位见[大屏看板](./case-dashboard.md)。
