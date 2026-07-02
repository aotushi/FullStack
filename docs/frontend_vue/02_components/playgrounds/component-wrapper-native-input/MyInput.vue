<script setup lang="ts">
import { shallowRef } from "vue";
import BaseInput from "./BaseInput.vue";
import type { InputActions, MyInputExpose } from "./types";

withDefaults(
  defineProps<{
    placeholder?: string;
    disabled?: boolean;
    type?: "text" | "password";
  }>(),
  {
    placeholder: "",
    disabled: false,
    type: "text",
  },
);

const model = defineModel<string>({ required: true });

const emit = defineEmits<{
  change: [value: string];
}>();

const innerInput = shallowRef<InputActions | null>(null);

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
  <BaseInput
    ref="innerInput"
    v-model="model"
    :placeholder="placeholder"
    :disabled="disabled"
    :type="type"
    @change="emit('change', $event)"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </BaseInput>
</template>
