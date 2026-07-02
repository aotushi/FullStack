<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import MyInput from "./components/MyInput.vue";

const modelValue = ref("hello world");
const inputRef = useTemplateRef<InstanceType<typeof MyInput>>("inputRef");

function clearInput() {
  inputRef.value?.clear();
}

function focusInput() {
  inputRef.value?.focus();
}

const handleChange = () => {
  console.log("aaa");
};

setTimeout(() => {
  clearInput();
}, 1000);
</script>

<template>
  <main class="app-shell">
    <section class="demo-panel">
      <p class="eyebrow">Vue CodeLab</p>
      <h1>父组件App</h1>
      <MyInput
        ref="inputRef"
        v-model="modelValue"
        placeholder="我自己写的组件"
        :show-password="false"
        aaaa="123"
        @change="handleChange"
      >
        <template #prefix>前缀</template>
        <template #append>后缀</template>
      </MyInput>

      <div class="actions">
        <button type="button" @click="focusInput">focus</button>
        <button type="button" @click="clearInput">clear</button>
      </div>

      <p class="value">modelValue: {{ modelValue || "empty" }}</p>
    </section>
  </main>
</template>
