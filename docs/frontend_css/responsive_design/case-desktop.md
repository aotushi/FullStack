# 桌面网站与后台

> [案例层] 普通内容页和后台工具页都走[通用响应式方案](./general-responsive.md)，几乎不需要 `rem` / `vw` 整体缩放。这一篇只补两类场景的专属约束。

## 普通内容页

目标：阅读舒适、自然换行。

- 外壳：`width: min(100% - 32px, 1200px)` + `margin-inline: auto`，一行搞定上限和两侧安全边距。
- 正文：`max-width: 72ch` 控制行长，行太长会影响阅读。
- 字号 / 间距：`clamp()` 平滑变化，少写断点。
- 图片：内容图用 `srcset`（密度），关键视觉用 `<picture>`（版式）。

```css
.page {
  width: min(100% - 32px, 1200px);
  margin-inline: auto;
}
.article {
  max-width: 72ch;
  font-size: clamp(16px, 1.2vw, 20px);
}
```

这类页面基本不需要等比还原，流式 + 少量断点就够。

## 后台 / 工具页

目标：信息密度、表格可用、操作稳定。

### 页面骨架

固定侧栏 + 弹性主栏，窄屏折叠：

```css
.dashboard {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 24px;
}
@media (width < 900px) {
  .dashboard {
    grid-template-columns: 1fr; /* 侧栏下移或收起 */
  }
}
```

`minmax(0, 1fr)` 里的 `0` 和 Flex 的 `min-width: 0` 同理：防止主栏被内部宽内容（表格、长串）撑破。

### 表格放不下

后台最常见的问题。优先保最小可用宽度 + 局部横向滚动，而不是硬压：

```css
.table-panel {
  overflow-x: auto;
}
.table {
  min-width: 960px;
}
```

信息特别多时再考虑“列收纳”：次要列在窄屏隐藏，或收进可展开行。

### 工具栏与操作区

Flex `flex-wrap` + `gap`，宽度不足时自然换行，而不是立刻改整页结构：

```css
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
```

### 复用业务组件

同一个卡片 / 面板在主栏、侧栏、弹窗里复用时，用容器查询按自身宽度切换，而不是看全局视口（见[通用响应式方案](./general-responsive.md)的容器查询部分）。

### UI 框架栅格

Element Plus 等框架的 `el-row` / `el-col` 的 `xs` / `sm` / `md` / `lg` / `xl` 是“布局加速器”，不是完整方案：

```vue
<el-row :gutter="16">
  <el-col :xs="24" :md="12" :lg="8">...</el-col>
</el-row>
```

用它快速分栏可以，但业务模块内部的响应式、表格 / 图表的最小宽度和溢出仍要自己处理——否则会出现“外层栅格响应了，里面模块仍不可用”。
