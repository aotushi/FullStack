<script setup lang="ts">
import { shallowRef, useTemplateRef } from "vue";
import MyInput from "./MyInput.vue";
import type { MyInputExpose } from "./types";

const modelValue = shallowRef("hello world");
const lastChange = shallowRef("none");
const inputRef = useTemplateRef<MyInputExpose>("inputRef");

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
      <p class="eyebrow">Vue Playground</p>
      <h1>原生 input 显式边界封装</h1>
      <MyInput
        ref="inputRef"
        v-model="modelValue"
        placeholder="只暴露项目需要的能力"
        type="text"
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

<style scoped>
.app-shell {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 32px;
  background: #f4f7fb;
  color: #17202f;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.demo-panel {
  width: min(560px, 100%);
  border: 1px solid #d7dde8;
  border-radius: 8px;
  padding: 28px;
  background: #fff;
  box-shadow: 0 18px 48px rgb(25 35 55 / 12%);
}

.eyebrow {
  margin: 0 0 6px;
  color: #51607a;
  font-size: 13px;
}

h1 {
  margin: 0 0 22px;
  font-size: 28px;
  line-height: 1.2;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

button {
  border: 1px solid #c7cfdd;
  border-radius: 6px;
  padding: 7px 12px;
  background: #f8fafc;
  color: #17202f;
  cursor: pointer;
  font: inherit;
}

button:hover {
  border-color: #2b8a6f;
}

.value {
  margin: 18px 0 0;
  color: #51607a;
  font-size: 14px;
}
</style>
