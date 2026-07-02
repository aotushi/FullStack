<script setup lang="ts">
import { useTemplateRef } from "vue";
import type { InputActions } from "./types";

withDefaults(
  defineProps<{
    modelValue: string;
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

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const inputRef = useTemplateRef<HTMLInputElement>("inputRef");

function updateValue(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}

function commitValue(event: Event) {
  emit("change", (event.target as HTMLInputElement).value);
}

defineExpose<InputActions>({
  clear() {
    emit("update:modelValue", "");
    emit("change", "");
  },
  focus() {
    inputRef.value?.focus();
  },
  blur() {
    inputRef.value?.blur();
  },
});
</script>

<template>
  <label class="base-input" :class="{ 'is-disabled': disabled }">
    <span v-if="$slots.prefix" class="base-input__addon">
      <slot name="prefix" />
    </span>
    <input
      ref="inputRef"
      class="base-input__control"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="updateValue"
      @change="commitValue"
    />
    <span v-if="$slots.append" class="base-input__addon">
      <slot name="append" />
    </span>
  </label>
</template>

<style scoped>
.base-input {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #ccd4e1;
  border-radius: 6px;
  background: #fff;
}

.base-input:focus-within {
  border-color: #2b8a6f;
  box-shadow: 0 0 0 3px rgb(43 138 111 / 14%);
}

.base-input.is-disabled {
  background: #f2f4f8;
  color: #9aa4b2;
}

.base-input__addon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  border-right: 1px solid #e0e6ef;
  padding: 0 12px;
  background: #f8fafc;
  color: #51607a;
  font-size: 14px;
}

.base-input__addon:last-child {
  border-right: 0;
  border-left: 1px solid #e0e6ef;
}

.base-input__control {
  min-width: 0;
  border: 0;
  padding: 10px 12px;
  color: #17202f;
  font: inherit;
  outline: 0;
}

.base-input__control::placeholder {
  color: #9aa4b2;
}
</style>
