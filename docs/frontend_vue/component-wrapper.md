# 组件封装

组件封装不是把第三方组件再包一层，而是把项目里的稳定约定沉淀成更小、更明确的接口。

适合封装的内容：

- 业务里反复出现的默认属性、插槽组合和交互规则。
- 需要统一暴露给父组件的方法，例如 `focus`、`clear`。
- 第三方组件 API 太宽，而项目只需要其中一小部分能力。

不适合封装的内容：

- 只使用一次的样式调整。
- 没有稳定边界的临时需求。
- 把原组件所有属性和事件原样转发，却没有新增项目语义。

## Element Plus Input 二次封装

这个案例展示如何封装一个 `Element Plus` 输入框，并继续保留常用的 `attrs`、`slots` 和实例方法。

本地运行：

```bash
npm run dev
```

打开页面后，CodeLab 会自动连接本地实验服务并启动预览。

<CodeLab
  project="vue-component-wrapper"
  default-file="src/components/MyInput.vue"
/>
