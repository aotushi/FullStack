# 大屏看板

> [案例层] 数据大屏、监控中心、可视化看板要把一张固定比例的设计稿铺满各种分辨率的物理屏。`rem` / `vw` / `scale` 的换算**原理**统一见[单位与等比还原](./units-and-scaling.md)，这一篇只讲大屏专属的选型、铺满策略与工程落地。

## 大屏和普通页面不一样在哪

普通网页要“在不同尺寸下重新排布”，大屏恰恰相反——它有一套**钉死的设计稿**（最常见 `1920 * 1080`，超宽屏出到 `3840 * 1080`），诉求是把这一张稿**原样铺满整块屏**，不重排、不变形、组件内部一像素都不用改。约束也很硬：

- **全屏、不滚动**：投在会议室大屏、拼接墙、机房监控屏上，通常一屏定死，没有滚动条。
- **比例固定**：设计稿是 16:9，但真实屏可能是 16:9、21:9、32:9，甚至竖屏拼接。铺满时要么留黑边、要么补内容。
- **一次开发**：不希望为每种分辨率维护一套断点，写一遍设计稿尺寸就够。

这正是 `scale` 的主场：把整个画布当一张图，最外层缩放一次，内部全部按设计稿的 `px` 写死。

## 选型

| 方案              | 用在大屏时               | 主要问题                             |
| ----------------- | ------------------------ | ------------------------------------ |
| `rem + font-size` | 大屏内局部按比例换算     | 要 JS 维护根字号；超宽屏两侧留白失衡 |
| `vw`              | 宽度驱动的等比页面       | 超宽屏高度顶出屏幕，只显示一部分     |
| `scale()`         | **固定设计稿比例的大屏** | 需处理缩放原点、留白、图表清晰度     |

`rem` / `vw` 也能做等比还原，但它们盯的是**全局视口**：一旦屏幕宽高比偏离设计稿（如 `7680 * 2160` 超宽屏），按宽算就顶高、按高算就留白，且每个组件都要参与换算。`scale` 把“铺满”收敛成最外层的**一次变换**，设计稿 1:1 开发、内部零改动，是固定版式大屏的默认解。为什么 `vw` 按宽缩放会在超宽屏下只显示一半，对比见[单位与等比还原](./units-and-scaling.md#scale-整体变换)。

## 三种铺满策略

`scale` 铺满有三种取舍，先看效果再选：

<svg viewBox="0 0 640 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="三种铺满策略：等比留白、拉伸铺满、补边铺满" style="max-width:600px; width:100%; height:auto;">
  <g font-family="sans-serif" font-size="13" fill="currentColor" text-anchor="middle">
    <!-- 1 等比留白 -->
    <rect x="20" y="20" width="170" height="96" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="20" y="20" width="26" height="96" fill="currentColor" fill-opacity="0.12"/>
    <rect x="164" y="20" width="26" height="96" fill="currentColor" fill-opacity="0.12"/>
    <rect x="46" y="20" width="118" height="96" fill="#3b82f6" fill-opacity="0.16" stroke="#3b82f6" stroke-width="1.5"/>
    <text x="105" y="72">16:9 画布</text>
    <text x="105" y="138">等比留白</text>
    <text x="105" y="154" font-size="11" fill="#3b82f6">不变形·两侧黑边</text>
    <!-- 2 拉伸铺满 -->
    <rect x="235" y="20" width="170" height="96" fill="#ef4444" fill-opacity="0.14" stroke="#ef4444" stroke-width="1.5"/>
    <text x="320" y="72">拉伸变形</text>
    <text x="320" y="138">拉伸铺满</text>
    <text x="320" y="154" font-size="11" fill="#ef4444">无黑边·会变形</text>
    <!-- 3 补边铺满 -->
    <rect x="450" y="20" width="170" height="96" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="450" y="20" width="118" height="96" fill="#3b82f6" fill-opacity="0.16" stroke="#3b82f6" stroke-width="1.5"/>
    <rect x="568" y="20" width="52" height="96" fill="#22c55e" fill-opacity="0.16" stroke="#22c55e" stroke-width="1.5"/>
    <text x="509" y="72" font-size="12">设计稿</text>
    <text x="594" y="66" font-size="10" fill="#22c55e">补</text>
    <text x="594" y="80" font-size="10" fill="#22c55e">位</text>
    <text x="535" y="138">补边铺满</text>
    <text x="535" y="154" font-size="11" fill="#22c55e">铺满·撑开容器</text>
  </g>
</svg>

| 策略                 | 做法                                       | 结果                     | 适合                                         |
| -------------------- | ------------------------------------------ | ------------------------ | -------------------------------------------- |
| **等比留白**（默认） | `scale(min(rw, rh))`，宽高用同一比率       | 不变形，多余处留黑边     | 绝大多数看板；比例和屏接近时几乎无边         |
| **拉伸铺满**         | `scale(rw, rh)`，宽高各自比率              | 无黑边，但轻微拉伸变形   | 比例接近、能容忍变形、要求满屏               |
| **补边铺满**         | 等比缩放 + 把短的一边**加宽/加高容器**填满 | 无黑边、不变形，画面变大 | 有可延展的背景/次要区（`autofit.js` 的思路） |

`rw = 屏宽 / 设计稿宽`，`rh = 屏高 / 设计稿高`。**等比留白**是安全默认（比率取两者较小值，保证画布完整、绝不变形）；比例吻合度高时黑边可忽略。

## 落地：一个可复用的等比画布

核心就三步：容器写死设计稿尺寸 → 算 `scale = min(rw, rh)` → 定位居中，多余留白。

**结构与样式**（`transform-origin` 用中心，配合定位居中，缩放结果最可预测）：

```html
<div class="screen-wrapper">
  <div class="screen" id="screen">
    <!-- 内部所有组件照 1920 * 1080 设计稿的 px 写死 -->
  </div>
</div>
```

```css
.screen-wrapper {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #030814; /* 黑边/留白的底色 */
}
.screen {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1920px;
  height: 1080px;
  transform-origin: center center;
  transform: translate(-50%, -50%) scale(var(--scale, 1));
}
```

**缩放脚本**（等比留白版）：

```js
const DESIGN_W = 1920;
const DESIGN_H = 1080;

function resize() {
  const rw = document.documentElement.clientWidth / DESIGN_W;
  const rh = document.documentElement.clientHeight / DESIGN_H;
  const scale = Math.min(rw, rh); // 取小 → 等比留白；改成 scale(rw, rh) 即拉伸铺满
  document.getElementById("screen").style.setProperty("--scale", scale);
}

resize();
window.addEventListener("resize", debounce(resize, 200));
```

**用 `ResizeObserver` 替代 `resize`**（现代首选，只在真正尺寸变化时触发，比 `window.resize` 更准）：

```js
const ro = new ResizeObserver(() => {
  // 包一层 rAF，避开 “ResizeObserver loop completed…” 告警
  requestAnimationFrame(resize);
});
ro.observe(document.documentElement);
```

**Vue 3 组件封装**（挂载即生效，卸载解绑，首屏算完再显示避免闪一下）：

```vue
<!-- ScaleScreen.vue -->
<template>
  <div class="screen-wrapper">
    <div ref="screen" class="screen" :style="{ visibility: ready ? 'visible' : 'hidden' }">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({ width: { default: 1920 }, height: { default: 1080 } });
const screen = ref(null);
const ready = ref(false);
let ro;

function resize() {
  const rw = document.documentElement.clientWidth / props.width;
  const rh = document.documentElement.clientHeight / props.height;
  screen.value.style.setProperty("--scale", Math.min(rw, rh));
  ready.value = true;
}

onMounted(() => {
  screen.value.style.width = props.width + "px";
  screen.value.style.height = props.height + "px";
  resize();
  ro = new ResizeObserver(() => requestAnimationFrame(resize));
  ro.observe(document.documentElement);
});
onBeforeUnmount(() => ro?.disconnect());
</script>
```

## 工程坑

- **首屏闪一下（FOUC）**：`scale` 是在 JS 算完后才应用的，容器默认 `visibility: hidden`、算完置 `visible`，避免以 1:1 尺寸闪现再突然缩放。
- **图表 / Canvas 变糊**：`scale` 放大的是**已渲染的位图**，ECharts、Canvas、图片被拉大后会模糊。稳妥做法是**别让图表跟着 `scale` 放大**——图表容器照设计稿 `px` 占位参与缩放，但图表内部监听容器尺寸、用 `chart.resize()` 按新尺寸**重绘**（矢量清晰）。文字、SVG 图标本身矢量，缩放不糊。
- **交互坐标还原**：鼠标点击、`hover` 命中会随 `scale` 一起变换，通常**不用手动处理**；但当你**手动**用 `e.clientX - rect.left` 之类算相对坐标做拖拽、地图打点、自定义 Canvas 绘制时，得把差值**除以缩放比率**才是设计稿坐标系里的真实位置。
- **弹窗 / 下拉挂到了 `body` 上**：Element Plus、Ant Design 的 `Dialog` / `Select` 默认 `Teleport` 到 `body`，落在 `.screen` 缩放容器**之外**，尺寸和位置全乱。要么把它们 `append-to` 指到画布容器内，要么单独给这层设一致的缩放。
- **局部滚动区**：大屏整体不滚，但若某个列表要滚动，`scale` 会把滚动条和滚动区一并缩放，滚动手感变形。滚动区最好跳出 `scale` 容器，或用独立的容器查询方案（见[通用响应式方案](./general-responsive.md)）。
- **`ResizeObserver` 循环告警**：回调里若改动了被观察元素的尺寸，会触发 “ResizeObserver loop completed with undelivered notifications”。用 `requestAnimationFrame` 包住回调可消掉告警（见[MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)）。

## 超宽屏补位

设计稿是 16:9，屏是 21:9 / 32:9 时，等比留白会留下大片黑边。三条路，按“能不能改设计稿”选：

1. **纯留黑边**：最省事，`min(rw, rh)` 天然做到，两侧填底色。信息不吃亏，只是浪费屏。
2. **单独出超宽设计稿**：如再出一张 `3840 * 1080`，按宽高比切换加载哪张画布 + 补充分区。信息量最大，但要多维护一套。
3. **两侧补装饰/次要信息**：主画布居中不变形，左右用可延展的背景、装饰线、次要指标填满（`autofit.js` 的补边思路）。

## 什么时候**不**该上 scale

`scale` 只适合**固定版式、以可视化为主、基本不滚动**的看板。一旦大屏是**内容型**（长列表、大量文字、要滚动阅读），`scale` 会把文字一起缩放、牺牲可读性——这类反而该走[通用响应式方案](./general-responsive.md)（流式 + Grid + 容器查询），让区块按容器自然伸缩，而不是当一张图整体缩放。

## 现成方案

不想自己写缩放容器，直接用成熟库（都是上面 `scale` + 尺寸监听的封装）：

- [`v-scale-screen`](https://github.com/Alfred-Skyblue/v-scale-screen)：Vue 大屏自适应组件，一个 `<v-scale-screen>` 包住内容即可，支持等比 / 拉伸 / 铺满多种模式。
- [`autofit.js`](https://github.com/auto-plugin/autofit.js)：框架无关，`autofit.init({ designWidth, designHeight })` 一行搞定；主打**补边铺满**（在 `scale` 基础上给右/下加尺寸，不挤压不拉伸）。
- [`@jiaminghi/data-view`](http://datav.jiaminghi.com/)（DataV）：不止缩放，还带一整套边框、装饰、图表组件，适合快速拼一个科技风看板。

## 参考资料

- [autofit.js 官方文档](https://auto-plugin.github.io/index/autofit.js/) —— 补边铺满原理与配置。
- [MDN: ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API) —— 容器尺寸监听、`rAF` 规避循环告警。
- [大屏窗口自适应方案（技术开发分享录）](https://www.fenxianglu.cn/article/505) —— `scale` / `vw` / 铺满策略的横向对比。
