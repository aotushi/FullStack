# Vue 组件二次封装

> 来源：[vue组件二次封装-究极版](https://www.bilibili.com/video/BV1bDe1z1Eyr/)（远方os）
>
> 说明：公开视频未提供可访问字幕，本文根据视频元数据、关键帧画面和 Vue 官方文档整理，不是逐字稿。

## 核心问题

二次封装第三方组件时，不能只把组件包一层。真正需要检查的是 5 条通道：

1. 属性是否能透传
2. 事件是否能透传
3. 插槽是否能透传
4. 内部组件方法是否能暴露给外部调用
5. TypeScript 和编辑器提示是否仍然可用

视频中的例子是封装 Element Plus 的 `ElInput`，最终目标是让 `MyInput` 看起来像自定义组件，但用起来仍然接近 `ElInput`。

## 基础封装：透传属性、事件、插槽

Vue 的 `h()` 可以创建一个 VNode。把目标组件、属性对象、插槽对象都传进去，就能完成一层透明转发。

```vue
<!-- MyInput.vue -->
<template>
  <component :is="h(ElInput, $attrs, $slots)" />
</template>

<script setup lang="ts">
import { h } from 'vue'
import { ElInput } from 'element-plus'
</script>
```

这个写法解决了三类内容：

- 属性：`placeholder`、`show-password` 等会进入 `$attrs`
- 事件：`@input`、`@change`、`@update:modelValue` 等也会作为监听器进入 `$attrs`
- 插槽：默认插槽、`#prefix`、`#append` 等会进入 `$slots`

调用侧可以这样写：

```vue
<template>
  <MyInput
    v-model="modelValue"
    placeholder="我自己写的组件"
    show-password
    @change="handleChange"
  >
    <template #prefix>前缀</template>
    <template #append>append</template>
  </MyInput>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MyInput from './components/MyInput.vue'

const modelValue = ref('hello world')

function handleChange(value: string) {
  console.log(value)
}
</script>
```

## `v-model` 为什么可以工作

`v-model` 在组件上本质上会被转换成：

```vue
<MyInput
  :model-value="modelValue"
  @update:modelValue="modelValue = $event"
/>
```

因此，只要封装组件把属性和事件一起透传给内部组件，`v-model` 就可以继续工作。

## 暴露内部组件方法

如果调用方希望拿到内部 `ElInput` 的方法，例如 `clear()`，只透传属性和插槽还不够。

调用侧：

```vue
<template>
  <MyInput
    ref="inputRef"
    v-model="modelValue"
    placeholder="我自己写的组件"
  />
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import MyInput from './components/MyInput.vue'

const modelValue = ref('hello world')
const input = useTemplateRef<InstanceType<typeof MyInput>>('inputRef')

setTimeout(() => {
  input.value?.clear()
}, 1000)
</script>
```

封装侧需要先拿到内部 `ElInput` 实例，再通过 `defineExpose()` 暴露外部允许调用的方法。

```vue
<!-- MyInput.vue -->
<template>
  <component :is="inputVNode" />
</template>

<script setup lang="ts">
import { computed, h, useAttrs, useSlots } from 'vue'
import type { ComponentInstance } from 'vue'
import { ElInput } from 'element-plus'

type ElInputInstance = ComponentInstance<typeof ElInput>

const attrs = useAttrs()
const slots = useSlots()

let innerInput: ElInputInstance | null = null

function changeRef(instance: unknown) {
  innerInput = instance as ElInputInstance | null
}

const inputVNode = computed(() => {
  return h(
    ElInput,
    {
      ...attrs,
      ref: changeRef,
    },
    slots,
  )
})

defineExpose({
  clear() {
    innerInput?.clear()
  },
  focus() {
    innerInput?.focus()
  },
  blur() {
    innerInput?.blur()
  },
})
</script>
```

这个版本更适合长期维护：它只暴露明确需要的命令式 API，不把内部组件实例完整泄漏出去。

## 视频中的“完整暴露”思路

视频还演示了更激进的方式：拿到当前组件实例，把内部组件的 exposed 对象接到当前组件上，再用类型断言让外部获得更完整的方法提示。

核心思想可以概括成：

```ts
import { getCurrentInstance } from 'vue'
import type { ComponentInstance } from 'vue'
import { ElInput } from 'element-plus'

const vm = getCurrentInstance()

function changeRef(exposed: unknown) {
  if (vm) {
    vm.exposed = exposed as Record<string, unknown>
  }
}

defineExpose({} as ComponentInstance<typeof ElInput>)
```

这个技巧的目的：

- 运行时：把内部 `ElInput` 暴露出来的方法转给 `MyInput`
- 类型层：让 `MyInput` 的模板引用尽量拥有 `ElInput` 的方法提示

但要注意，`getCurrentInstance()` 和直接改 `vm.exposed` 更接近框架内部用法。普通业务组件更推荐显式暴露白名单方法；只有在做组件库或强透明代理组件时，才考虑这种完整代理方案。

## 类型提示的边界

二次封装最容易误判的一点是：运行时能透传，不代表类型系统一定能完全理解。

| 内容 | 运行时透传 | 类型/提示 |
| --- | --- | --- |
| props | 可以通过 `$attrs` 透传 | 若未声明 props，编辑器提示可能不完整 |
| events | 可以通过 `$attrs` 透传 | 若未声明 emits，事件提示可能不完整 |
| slots | 可以通过 `$slots` 透传 | 复杂插槽最好显式声明 |
| methods | 需要 `ref` + `defineExpose` | 可以用 `ComponentInstance<typeof ElInput>` 辅助 |
| v-model | 依赖 `modelValue` + `update:modelValue` 透传 | 类型提示取决于 props/emits 声明 |

所以，封装组件有两种路线：

1. 透明代理：尽量把第三方组件能力全部转出去，代码少，但类型边界更难维护。
2. 业务封装：只暴露当前业务需要的属性、事件、插槽和方法，代码多一点，但稳定、可读、可控。

## 什么时候适合这种封装

适合：

- 给第三方组件增加统一默认值
- 给组件加统一样式、权限、埋点、校验、加载态
- 在组件库中做一层基础组件适配
- 想保留第三方组件大部分能力，又不想逐个手写转发

不适合：

- 只是为了“换个名字”再包一层
- 业务含义已经和原组件不同，却仍然暴露全部底层 API
- 需要强类型组件库，但不愿意维护 props、emits、slots 类型

## 个人结论

组件二次封装的关键不是“能不能包起来”，而是决定暴露边界。

如果目标是业务组件，优先显式声明：

- 组件真正支持哪些 props
- 组件真正触发哪些 emits
- 组件真正开放哪些 slots
- 组件真正允许外部调用哪些 methods

如果目标是基础组件库，可以用 `h()`、`$attrs`、`$slots`、`ref`、`defineExpose()` 做透明代理，但需要接受类型维护成本。

## 相关文档

- [Vue Render Functions](https://vuejs.org/guide/extras/render-function)
- [Vue Template Refs](https://vuejs.org/guide/essentials/template-refs)
- [Vue Composition API Helpers: useAttrs / useSlots](https://vuejs.org/api/composition-api-helpers)
- [Vue TypeScript with Composition API](https://vuejs.org/guide/typescript/composition-api)
- [Vue Component Events](https://vuejs.org/guide/components/events.html)
