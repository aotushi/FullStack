# 组件封装

> 所属模块：`frontend_vue/02_components`

组件封装不是把第三方组件再包一层，而是把项目里的稳定约定沉淀成更小、更明确的接口。

适合封装的内容：

- 业务里反复出现的默认属性、插槽组合和交互规则。
- 需要统一暴露给父组件的方法，例如 `focus`、`clear`。
- 第三方组件 API 太宽，而项目只需要其中一小部分能力。

不适合封装的内容：

- 只使用一次的样式调整。
- 没有稳定边界的临时需求。
- 把原组件所有属性和事件原样转发，却没有新增项目语义。

## ElInput封装

> 来源：[vue组件二次封装-究极版](https://www.bilibili.com/video/BV1bDe1z1Eyr/)（远方os）

### 版本1：透明代理封装

这一版按视频中的思路实现：外层组件 `MyInput` 尽量像一个透明代理，把传入的属性、事件、插槽继续交给内部的 `ElInput`，再把内部 `ElInput` 暴露出来的方法接到当前组件上。

它要解决的是 5 件事：

- 属性透传。
- 事件透传。
- 插槽透传。
- 方法暴露。
- 编辑器类型提示。

这一版的关键点是 `getCurrentInstance()` + `vm.exposed = exposed`。它的意思是：拿到内部 `ElInput` 暴露出来的对象后，把这个对象作为当前 `MyInput` 的暴露对象。

点评：

- 优点：非常适合解释“完整代理”这件事，父组件可以像使用 `ElInput` 一样使用 `MyInput`。
- 风险：封装边界很宽，父组件容易依赖 `Element Plus` 的内部实例能力。
- 风险：如果后期替换 UI 库，父组件里依赖过 `ElInput` 方法的地方都可能受影响。
- 适合场景：组件库底层适配层，或明确希望封装组件尽量继承第三方组件能力的场景。
- 不适合场景：普通业务组件。业务组件更应该沉淀项目自己的稳定接口，而不是把第三方组件能力整包暴露出去。

本地运行：

```bash
npm run dev
```

打开页面后，CodeLab 会自动连接本地实验服务并启动预览。

<CodeLab
  project="vue-component-wrapper"
  default-file="src/components/MyInput.vue"
/>

### 视频内容整理

二次封装第三方组件时，不能只看“能不能包一层”。真正需要检查的是 5 条通道：

1. 属性是否能透传。
2. 事件是否能透传。
3. 插槽是否能透传。
4. 内部组件方法是否能暴露给外部调用。
5. TypeScript 和编辑器提示是否仍然可用。

视频中的例子是封装 Element Plus 的 `ElInput`，最终目标是让 `MyInput` 看起来像自定义组件，但用起来仍然接近 `ElInput`。

#### 基础封装：透传属性、事件、插槽

Vue 的 `h()` 可以创建一个 VNode。把目标组件、属性对象、插槽对象都传进去，就能完成一层透明转发。

```vue
<!-- MyInput.vue -->
<script setup lang="ts">
import { h } from "vue";
import { ElInput } from "element-plus";
</script>

<template>
  <component :is="h(ElInput, $attrs, $slots)" />
</template>
```

这个写法解决了三类内容：

- 属性：`placeholder`、`show-password` 等会进入 `$attrs`。
- 事件：`@input`、`@change`、`@update:modelValue` 等也会作为监听器进入 `$attrs`。
- 插槽：默认插槽、`#prefix`、`#append` 等会进入 `$slots`。

调用侧可以这样写：

```vue
<script setup lang="ts">
import { ref } from "vue";
import MyInput from "./components/MyInput.vue";

const modelValue = ref("hello world");

function handleChange(value: string) {
  console.log(value);
}
</script>

<template>
  <MyInput v-model="modelValue" placeholder="我自己写的组件" show-password @change="handleChange">
    <template #prefix>前缀</template>
    <template #append>append</template>
  </MyInput>
</template>
```

#### `v-model` 为什么可以工作

`v-model` 在组件上本质上会被转换成：

```vue
<MyInput :model-value="modelValue" @update:modelValue="modelValue = $event" />
```

因此，只要封装组件把属性和事件一起透传给内部组件，`v-model` 就可以继续工作。

#### 视频中的“完整暴露”思路

视频还演示了更激进的方式：拿到当前组件实例，把内部组件的 exposed 对象接到当前组件上，再用类型断言让外部获得更完整的方法提示。

这里的 <ConceptNote
  label="ref: changeRef 为什么会自动调用？"
  title="函数模板引用：Vue 在登记组件实例"
  description="changeRef 没有在代码里主动执行；它作为函数形式的 ref 被交给 Vue，由渲染器在建立模板引用时调用。"
  :sections="[
  {
  title: '先看等价写法',
  body: 'h() 只是创建并返回 VNode。第二个参数中的 ref 是 Vue 保留的特殊 attribute，不是传给 ElInput 的普通 prop。',
  code: `h(ElInput, { ref: changeRef }, $slots)\n\n// 等价于\n<ElInput :ref='changeRef' />`,
  },
  {
  title: '首次挂载时发生什么',
  items: ['Vue 创建并挂载 ElInput。', '渲染器取得 ElInput 对父组件可见的公共实例。', 'Vue 调用 changeRef(elInputInstance)，完成引用登记。', 'changeRef 再把这个实例接到 MyInput 的 exposed 上。'],
  },
  {
  title: '它不只调用一次',
  items: ['首次挂载：参数是 ElInput 的公共组件实例。', '组件更新：函数模板引用可能再次执行。', 'ElInput 卸载：函数会再执行一次，参数是 null。'],
  },
  {
  title: 'exposed 参数是什么',
  body: '它不是 ElInput 的所有内部属性，而是组件对父级公开的实例接口。使用 script setup 的组件默认私有，通常只能访问它通过 defineExpose() 明确公开的内容。',
  },
  {
  title: '不要和 ref() 混淆',
  items: ['ref: changeRef 是函数模板引用，用于接收 DOM 元素或组件实例。', 'ref(value) 是响应式 API，用于创建带 .value 的响应式容器。'],
  },
  {
  title: 'Vue 官方文档',
  links: [
  { label: '函数模板引用', href: 'https://cn.vuejs.org/guide/essentials/template-refs.html#function-refs' },
  { label: 'ref 特殊 attribute', href: 'https://cn.vuejs.org/api/built-in-special-attributes.html#ref' },
  ],
  },
  ]"
/> 是理解下面这段代码的关键。

核心思想可以概括成：

```ts
import { getCurrentInstance } from "vue";
import type { ComponentInstance } from "vue";
import { ElInput } from "element-plus";

const vm = getCurrentInstance();

//方法的透传使用ref,将函数绑定组件的ref->`h(ElInput, {...$attrs, ref:changeRef}, $slots)`. 当ElInput挂载时,就会把ElInput暴露出来的属性, 去调用这个函数
function changeRef(exposed: unknown) {
  if (!vm) return;

  const elInput = exposed as ComponentInstance<typeof ElInput>;
  vm.exposed = elInput as unknown as Record<string, unknown>;
  // vm.exposed 实际上等于 defineExpose(exposed)
}

// defineExpose的作用是将这个对象绑定到实例的某个属性上, 所以vm.expose可以代替defineExpose({exposed: exposed})
defineExpose({} as ComponentInstance<typeof ElInput>);
```

这个技巧的目的：

- 运行时：把内部 `ElInput` 暴露出来的方法转给 `MyInput`。
- 类型层：让 `MyInput` 的模板引用尽量拥有 `ElInput` 的方法提示。

但要注意，`getCurrentInstance()` 和直接改 `vm.exposed` 更接近框架内部用法。普通业务组件更推荐显式暴露白名单方法；只有在做组件库或强透明代理组件时，才考虑这种完整代理方案。

#### 类型提示的边界

二次封装最容易误判的一点是：运行时能透传，不代表类型系统一定能完全理解。

| 内容    | 运行时透传                                   | 类型/提示                            |
| ------- | -------------------------------------------- | ------------------------------------ |
| props   | 可以通过 `$attrs` 透传                       | 若未声明 props，编辑器提示可能不完整 |
| events  | 可以通过 `$attrs` 透传                       | 若未声明 emits，事件提示可能不完整   |
| slots   | 可以通过 `$slots` 透传                       | 复杂插槽最好显式声明                 |
| methods | 需要 `ref` + `defineExpose`                  | 推荐用显式公开方法接口约束           |
| v-model | 依赖 `modelValue` + `update:modelValue` 透传 | 类型提示取决于 props/emits 声明      |

所以，封装组件有两种路线：

1. 透明代理：尽量把第三方组件能力全部转出去，代码少，但类型边界更难维护。
2. 业务封装：只暴露当前业务需要的属性、事件、插槽和方法，代码多一点，但稳定、可读、可控。

#### 什么时候适合这种封装

适合：

- 给第三方组件增加统一默认值。
- 给组件加统一样式、权限、埋点、校验、加载态。
- 在组件库中做一层基础组件适配。
- 想保留第三方组件大部分能力，又不想逐个手写转发。

不适合：

- 只是为了“换个名字”再包一层。
- 业务含义已经和原组件不同，却仍然暴露全部底层 API。
- 需要强类型组件库，但不愿意维护 props、emits、slots 类型。

#### 相关文档

- [Vue Render Functions](https://vuejs.org/guide/extras/render-function)
- [Vue Template Refs](https://vuejs.org/guide/essentials/template-refs)
- [Vue Composition API Helpers: useAttrs / useSlots](https://vuejs.org/api/composition-api-helpers)
- [Vue TypeScript with Composition API](https://vuejs.org/guide/typescript/composition-api)
- [Vue Component Events](https://vuejs.org/guide/components/events.html)

### 版本2：显式边界封装

这一版按更适合长期项目维护的方式实现：`MyInput` 不再追求完整继承 `ElInput`，而是只声明项目当前需要的能力。

它的重点不是“把 `ElInput` 全部转出去”，而是回答：

- 当前业务允许传哪些属性？
- 当前业务允许监听哪些事件？
- 当前业务保留哪些插槽？
- 当前业务允许父组件调用哪些方法？

这样写会比透明代理多一点代码，但组件边界更稳定。后期即使内部从 `Element Plus` 换成别的输入框组件，父组件也只依赖 `MyInput` 自己承诺过的接口。

<CodeLab
  project="vue-component-wrapper-explicit"
  default-file="src/components/MyInput.vue"
/>

### 版本 2.2：原生 input 显式边界封装

这一版把内部组件从 `ElInput` 换成普通 `input`，目的不是替代 Element Plus，而是把“组件封装”这件事单独拿出来看。

当内部只是原生输入框时，封装边界会更清楚：

- `BaseInput` 负责原生输入框的 DOM 行为。
- `MyInput` 负责对外声明稳定接口。
- 父组件只依赖 `MyInput` 暴露的 `focus`、`clear`、`blur`，不关心内部最终是原生输入框还是第三方组件。

这个版本适合用来理解版本二的核心思想：组件封装不是继承内部组件的全部能力，而是把项目愿意长期承诺的能力显式写出来。

<VuePlayground project="vue-component-wrapper-native-input" height="680px" />
