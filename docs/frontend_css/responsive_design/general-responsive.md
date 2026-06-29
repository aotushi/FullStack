# 通用响应式方案

> [通用层] 这一篇是一套**通用**的响应式方法，适用于绝大多数 PC 和移动端业务页面。它只讲判断、顺序、陷阱和配方；单位的“是什么”在[单位与等比还原](./units-and-scaling.md)，具体场景落地在案例层。

## 一句话立意

响应式不是“PC 一套、移动端一套”，也不是“`px` 换 `rem` / `vw`”。它是让同一套页面在三个维度上都可用：

- **空间**：视口和容器的尺寸、方向、可用阅读宽度。
- **输入**：鼠标还是触摸，能不能 hover。
- **偏好 / 能力**：深色、减少动效、高对比等系统设置。

大多数人只做了“空间”一维，这一篇把另外两维也补上。

## 空间维度：方法与顺序

核心判断：**布局系统优先于单位方案**。先用布局能力让内容自然适应，不要一上来就 `rem` / `vw` / 整体缩放。

推荐顺序：

1. 先让内容自然流动：外层 `width: min(100% - 32px, 1200px)` + `margin-inline: auto`，正文 `max-width: 72ch`。
2. 用 Flex / Grid 建立结构。
3. 用 `clamp()` / `min()` / `max()` 控制连续尺寸（字号、间距、容器宽度），减少断点。
4. 用媒体查询处理**页面级**结构断点。
5. 用容器查询处理**组件级**断点。
6. `rem` / `vw` / `scale` 整体缩放只在特定场景用（活动页、大屏），不是默认方案。

工具对应：

| 问题                       | 方案                                          |
| -------------------------- | --------------------------------------------- |
| 主体居中并限制阅读宽度     | `max-width` / `min()` + `margin-inline: auto` |
| 列表 4 列 → 2 列 → 1 列    | Grid + 媒体查询，或 `auto-fit`                |
| 导航 / 按钮组 / 标签换行   | Flex `flex-wrap` + `gap`                      |
| 侧边栏窄屏折叠 / 下移      | 媒体查询                                      |
| 卡片按自身宽度变化         | 容器查询                                      |
| 字号 / 间距 / 宽度平滑变化 | `clamp()` / `min()` / `max()`                 |
| 表格小屏放不下             | 最小宽度 + 横向滚动 / 列收纳                  |
| 固定比例大屏               | `scale()`（见案例，非通用默认）               |

### 空间维度的核心陷阱（防御式 CSS）

- **Flex 子项加 `min-width: 0`**：否则长内容会撑破 Flex 子项导致横向溢出。

  ```css
  .main {
    flex: 1 1 auto;
    min-width: 0;
  }
  ```

- **`auto-fit` 网格用 `min()` 兜底**：避免窄屏下 `minmax` 的最小值本身溢出。

  ```css
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
    gap: 16px;
  }
  ```

- **容器宽度用 `min()` 留安全边距**：`width: min(100% - 32px, 1200px)` 一行同时给出“上限 + 两侧边距”。
- **移动端高度用 `dvh` 而非 `vh`**：`vh` 在地址栏伸缩时会跳动，用 `dvh` / `svh` / `lvh`。
- **用逻辑属性**：`margin-inline` / `padding-block` / `inset`，天然适配 RTL 和国际化。
- **媒体查询从内容出发**，不从设备型号出发：侧栏挤压主内容时才折叠，卡片最小宽度维持不住时才减列。
- **复用组件优先容器查询**：同一张卡片出现在主栏、侧栏、弹窗时，应看自身容器宽度而不是全局视口。

  ```css
  .card-list {
    container-type: inline-size;
  }
  @container (width >= 480px) {
    .card {
      grid-template-columns: 160px 1fr;
    }
  }
  ```

- **移动优先 vs PC 优先**只是写法方向；真正重要的是默认样式取“最容易保证可用”的状态，空间充足时再增强。

## 输入维度

不要假设用户一定有鼠标、或一定是触摸。

```css
/* 仅在精确指针 + 支持 hover 时才用 hover 效果 */
@media (hover: hover) and (pointer: fine) {
  .btn:hover {
    /* ... */
  }
}

/* 触摸（粗指针）下放大命中区域 */
@media (pointer: coarse) {
  .btn {
    min-height: 44px;
    min-width: 44px;
  }
}
```

要点：hover 效果不能是唯一的交互入口（触摸设备摸不到）；触摸目标建议 ≥ 44px。

## 偏好 / 能力维度

尊重系统设置，这也是无障碍的一部分。

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    /* 深色变量 */
  }
}

@media (prefers-contrast: more) {
  /* 高对比 */
}
```

## 响应式图片

图片要响应两件事：**密度**（高 DPR 屏更清晰）和**版式**（不同尺寸用不同裁剪）。

- 内容图按密度：`<img srcset="a@2x.jpg 2x, a@3x.jpg 3x" />`。
- 内容图按版式（art direction）：`<picture>` + `<source media="...">`。
- 矢量图标用 SVG，放大不失真。

> 为什么高 DPR 屏上位图会糊？根因（DPR）在[像素与视口](./pixels-and-viewport.md)；移动端 `@2x` / `@3x` 的具体落地在[移动端适配](./case-mobile-h5.md)。

## 当前最佳实践组合

普通页面（PC 和大部分移动端）：

1. 外层 `min()` 控阅读宽度 + 安全边距。
2. 结构用 Grid，局部排列用 Flex。
3. 连续尺寸用 `clamp()`。
4. 页面级变化用媒体查询，组件级用容器查询。
5. 表格 / 代码块 / 图表保留最小宽度 + 局部横向滚动。
6. 补上输入维度（hover / pointer）和偏好维度（reduced-motion / dark）。

不要把 `rem` / `vw` / 整体缩放当通用默认。

## 什么时候跳出通用方法

| 信号                                     | 去哪                                          |
| ---------------------------------------- | --------------------------------------------- |
| 普通内容页 / 后台                        | [桌面网站与后台](./case-desktop.md)           |
| 必须按设计稿像素级还原的移动 H5 / 活动页 | [移动端适配](./case-mobile-h5.md)             |
| 固定比例、铺满屏幕的大屏看板             | [大屏看板](./case-dashboard.md)               |
| 需求差异大到难以共用一套页面             | 考虑响应式之外的方案：独立移动站、App、小程序 |

## 来源

- [MDN: Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)
- [MDN: CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN: clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [web.dev: Learn Responsive Design](https://web.dev/learn/design/)
- [Defensive CSS](https://defensivecss.dev/)
