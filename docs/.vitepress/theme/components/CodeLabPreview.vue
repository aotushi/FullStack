<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    previewUrl: string;
    localAvailable: boolean;
    status: string;
    busy: boolean;
    canRun: boolean;
    layout?: "workbench" | "notebook";
  }>(),
  {
    layout: "workbench",
  },
);

const emit = defineEmits<{
  install: [];
  refresh: [];
  run: [];
  stop: [];
}>();

const isNotebook = computed(() => props.layout === "notebook");
const runtimeStatus = computed(() => {
  if (props.busy) return "正在处理";
  if (props.previewUrl) return "运行中";
  if (props.localAvailable) return "已连接";
  return "未连接";
});
</script>

<template>
  <aside class="code-lab-preview" :class="{ 'code-lab-preview--notebook': isNotebook }">
    <div class="code-lab-preview__bar">
      <span class="code-lab-preview__title">{{ isNotebook ? "运行结果" : "Preview" }}</span>
      <div v-if="!isNotebook" class="code-lab-preview__tools">
        <span :class="localAvailable ? 'is-online' : 'is-offline'">
          {{ localAvailable ? "local server" : "static mode" }}
        </span>
        <div class="code-lab-actions" aria-label="Preview runtime actions">
          <button
            type="button"
            :disabled="busy || !localAvailable"
            title="Install lab dependencies"
            @click="emit('install')"
          >
            Install
          </button>
          <button
            type="button"
            :disabled="busy || !canRun || !localAvailable"
            title="Run lab dev server"
            @click="emit('run')"
          >
            Run
          </button>
          <button
            type="button"
            :disabled="busy || !localAvailable"
            title="Stop lab dev server"
            @click="emit('stop')"
          >
            Stop
          </button>
          <button
            type="button"
            :disabled="busy"
            title="Refresh lab status"
            @click="emit('refresh')"
          >
            Refresh
          </button>
        </div>
      </div>
      <div v-else class="code-lab-preview__runtime">
        <span class="code-lab-preview__status" :class="localAvailable ? 'is-online' : 'is-offline'">
          <span class="code-lab-preview__status-dot" aria-hidden="true" />
          {{ runtimeStatus }}
        </span>
        <details class="code-lab-preview__menu">
          <summary>环境</summary>
          <div class="code-lab-preview__menu-panel">
            <button type="button" :disabled="busy || !localAvailable" @click="emit('install')">
              安装依赖
            </button>
            <button type="button" :disabled="busy || !localAvailable" @click="emit('stop')">
              停止运行
            </button>
            <button type="button" :disabled="busy" @click="emit('refresh')">刷新状态</button>
          </div>
        </details>
      </div>
    </div>

    <iframe
      v-if="previewUrl"
      class="code-lab-preview__frame"
      :src="previewUrl"
      title="CodeLab preview"
    />
    <div v-else class="code-lab-preview__empty">
      <p>{{ status }}</p>
      <template v-if="!localAvailable">
        <code>npm run labs:server</code>
        <span>{{ isNotebook ? "启动后点击上方“运行”" : "then install and run this lab" }}</span>
      </template>
      <span v-else-if="isNotebook">点击上方“运行”查看结果</span>
    </div>
  </aside>
</template>
