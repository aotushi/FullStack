<script setup lang="ts">
import { computed, h, useAttrs, useSlots } from "vue";
import type { ComponentInstance } from "vue";
import { ElInput } from "element-plus";

type ElInputInstance = ComponentInstance<typeof ElInput>;

const attrs = useAttrs();
const slots = useSlots();

let innerInput: ElInputInstance | null = null;

function setInnerInput(instance: unknown) {
  innerInput = instance as ElInputInstance | null;
}

const inputVNode = computed(() => {
  return h(
    ElInput,
    {
      ...attrs,
      ref: setInnerInput,
    },
    slots,
  );
});

defineExpose({
  clear() {
    innerInput?.clear();
  },
  focus() {
    innerInput?.focus();
  },
  blur() {
    innerInput?.blur();
  },
});
</script>

<template>
  <component :is="inputVNode" />
</template>
