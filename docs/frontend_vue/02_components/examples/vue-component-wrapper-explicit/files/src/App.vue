<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import MyInput from "./components/MyInput.vue";
import type { MyInputExpose } from "./components/types";

const modelValue = ref("hello world");
const inputRef = useTemplateRef<MyInputExpose>("inputRef");
const lastChange = ref("none");

function clearInput() {
  inputRef.value?.clear();
}

function focusInput() {
  inputRef.value?.focus();
}

function blurInput() {
  inputRef.value?.blur();
}

function handleChange(value: string) {
  lastChange.value = value || "empty";
}
</script>

<template>
  <main class="app-shell">
    <section class="demo-panel">
      <p class="eyebrow">Vue CodeLab</p>
      <h1>显式边界封装</h1>
      <MyInput
        ref="inputRef"
        v-model="modelValue"
        placeholder="只暴露项目需要的能力"
        show-password
        @change="handleChange"
      >
        <template #prefix>前缀</template>
        <template #append>后缀</template>
      </MyInput>

      <div class="actions">
        <button type="button" @click="focusInput">focus</button>
        <button type="button" @click="clearInput">clear</button>
        <button type="button" @click="blurInput">blur</button>
      </div>

      <p class="value">modelValue: {{ modelValue || "empty" }}</p>
      <p class="value">lastChange: {{ lastChange }}</p>
    </section>
  </main>
</template>
