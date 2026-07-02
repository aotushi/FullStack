<script setup lang="ts">
import { getCurrentInstance, h } from "vue";
import type { ComponentInstance } from "vue";
import { ElInput } from "element-plus";

defineProps<{ aaaa: string }>();

const vm = getCurrentInstance();

function changeRef(exposed: unknown) {
  if (!vm) {
    return;
  }

  vm.exposed = exposed as ComponentInstance<typeof ElInput>;
}

defineExpose({} as ComponentInstance<typeof ElInput>);
</script>

<template>
  <h3>子组件MyInput</h3>
  <component :is="h(ElInput, { ...$attrs, ref: changeRef }, $slots)" />
</template>
