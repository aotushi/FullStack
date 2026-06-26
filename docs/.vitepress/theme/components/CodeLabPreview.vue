<script setup lang="ts">
defineProps<{
  previewUrl: string;
  localAvailable: boolean;
  status: string;
  busy: boolean;
  canRun: boolean;
}>();

const emit = defineEmits<{
  install: [];
  refresh: [];
  run: [];
  stop: [];
}>();
</script>

<template>
  <aside class="code-lab-preview">
    <div class="code-lab-preview__bar">
      <span>Preview</span>
      <div class="code-lab-preview__tools">
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
    </div>

    <iframe
      v-if="previewUrl"
      class="code-lab-preview__frame"
      :src="previewUrl"
      title="CodeLab preview"
    />
    <div v-else class="code-lab-preview__empty">
      <p>{{ status }}</p>
      <code>npm run labs:server</code>
      <span>then install and run this lab</span>
    </div>
  </aside>
</template>
