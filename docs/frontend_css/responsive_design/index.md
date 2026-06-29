# Responsive Design

响应式设计要解决的，不是“PC 一套、移动端一套”，也不是“把 `px` 全换成 `rem` 或 `vw`”，而是：同一套页面在不同**空间**（屏幕 / 容器尺寸、方向）、**输入**（鼠标 / 触摸）、**偏好**（深色、减少动效）下，仍然可读、可用、可维护。

落到一个具体元素上，“响应”的其实就是三件事——**大小、位置、排版**。先想清楚这三件，比纠结用哪个单位更重要。

## 两条路线：整体缩放 vs 真·响应式

移动端适配长期走的是“整体缩放”：挑一张设计稿当基准（如手淘 `750`），定一套规则把整页等比缩放到别的屏——这就是 `rem` / `vw` 两大流派的由来。它们是一种**设计思想**，不是单位本身（很多人误以为用了 `rem`/`vw` 单位就叫适配）。缩放方案上手快，但都“以缩放为基准”，于是有共同硬伤：大屏要么两侧留白、要么整体糊大；给容器加 `max-width` 居中会直接打破布局，因为元素尺寸全按视口算、不跟随容器。

另一条路线是**真正的响应式**：用流式 + 现代布局系统（Flexbox / Grid 默认就是弹性的）+ 少量断点，让元素按**内容与容器**自然伸缩，而不是把整页当一张图缩放。等 `calc()` / `min()` / `max()` / `clamp()` 和自定义属性普及后，连“像素级还原一张设计稿”都能不靠整体缩放做到。

一个判断：

- 普通业务页面（PC + 大部分移动端）→ 走**真·响应式**（流式 + 布局系统 + 少量断点）。
- 必须按设计稿像素级还原的活动页、大屏看板 → 才上**等比还原**（`rem` / `vw` / `scale`，原理见[单位与等比还原](./units-and-scaling.md)）。

## 页面级 vs 组件级

媒体查询响应的是**视口**，是页面级的——组件无从知道自己被塞进了多窄的容器。**容器查询**把响应粒度下沉到组件本身：同一个卡片，放进宽栏横排、放进侧栏竖排，跟全局视口无关。写可复用组件时优先想容器查询。

## 这个主题怎么组织

| 文档                                      | 写什么                                                                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [单位与等比还原](./units-and-scaling.md)  | `px`/`%`/`em`/`rem`/`vw`/`dvh`/`clamp` 等单位，及 `rem`/`vw`/`scale` 等比还原的换算原理。                                                              |
| [通用响应式方案](./general-responsive.md) | 一套通用方法：空间 / 输入 / 偏好三维度、布局优先、核心陷阱与配方。                                                                                     |
| [桌面网站与后台](./case-desktop.md)       | 普通内容页 + 后台工具页。                                                                                                                              |
| [移动端适配](./case-mobile-h5.md)         | 选型、`rem` 两流派与手淘、动态根字号、纯 `vw` 活动页、Vue 工程接线、`1px` / 安全区 / 横屏 / 高清图。配套背景见[像素与视口](./pixels-and-viewport.md)。 |
| [大屏看板](./case-dashboard.md)           | `scale()` 等比画布与超宽屏补位。                                                                                                                       |

第一次看，从[通用响应式方案](./general-responsive.md)入手；要查单位或换算，回[单位与等比还原](./units-and-scaling.md)；要落地某个场景，进对应案例。

## 选哪个案例

先判断页面类型，再决定走通用方法、还是叠加场景约束。

| 页面类型           | 主要目标                 | 去哪篇                                                |
| ------------------ | ------------------------ | ----------------------------------------------------- |
| 普通内容页         | 阅读舒适、自然换行       | [桌面网站与后台](./case-desktop.md)                   |
| 后台 / 工具页      | 信息密度、表格可用       | [桌面网站与后台](./case-desktop.md)                   |
| 移动端 H5 / 活动页 | 设计稿等比还原           | [移动端适配](./case-mobile-h5.md)                     |
| 大屏看板           | 固定比例画布铺满屏幕     | [大屏看板](./case-dashboard.md)                       |
| 独立可复用组件     | 跟随自身容器而非全局视口 | [通用响应式方案](./general-responsive.md)（容器查询） |

## 参考资料

主线课程：

- [web.dev: Learn Responsive Design](https://web.dev/learn/design/)
- [MDN: Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
- [MDN: CSS layout](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout)

布局能力：

- [Josh Comeau: An Interactive Guide to CSS Grid](https://www.joshwcomeau.com/css/interactive-guide-to-grid/)
- [CSS-Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Every Layout](https://every-layout.dev/)

现代响应式：

- [大漠《现代 Web 布局》：构建响应式 UI](https://juejin.cn/book/7161370789680250917/section/7165496907714789407) —— `clamp()` / 比较函数 / 容器查询，本页“两条路线”“页面级 vs 组件级”的主要参考。
- [MDN: CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [Ahmad Shadeed: The Guide To Responsive Design in 2023 and Beyond](https://ishadeed.com/article/responsive-design/)
- [Defensive CSS](https://defensivecss.dev/)
