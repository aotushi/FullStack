<script setup lang="ts">
import { shallowRef } from "vue";
import type { ComponentInstance } from "vue";
import { ElInput } from "element-plus";
import type { MyInputExpose } from "./types";

type ElInputInstance = ComponentInstance<typeof ElInput>;

withDefaults(
  defineProps<{
    placeholder?: string;
    showPassword?: boolean;
    disabled?: boolean;
  }>(),
  {
    placeholder: "",
    showPassword: false,
    disabled: false,
  },
);

const model = defineModel<string>({ required: true });

const emit = defineEmits<{
  change: [value: string];
}>();

const innerInput = shallowRef<ElInputInstance | null>(null);

defineExpose<MyInputExpose>({
  clear() {
    innerInput.value?.clear();
  },
  focus() {
    innerInput.value?.focus();
  },
  blur() {
    innerInput.value?.blur();
  },
});
</script>

<template>
  <ElInput
    ref="innerInput"
    v-model="model"
    :placeholder="placeholder"
    :show-password="showPassword"
    :disabled="disabled"
    @change="emit('change', $event)"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </ElInput>
</template>
