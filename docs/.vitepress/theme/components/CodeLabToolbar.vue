<script setup lang="ts">
defineProps<{
  busy: boolean;
  canRun: boolean;
  hasChanges: boolean;
  localAvailable: boolean;
}>();

const emit = defineEmits<{
  copy: [];
  install: [];
  refresh: [];
  reset: [];
  run: [];
  save: [];
  stop: [];
}>();
</script>

<template>
  <div class="code-lab-toolbar">
    <button type="button" title="Copy current file" @click="emit('copy')">Copy</button>
    <button type="button" title="Reset current file" @click="emit('reset')">Reset</button>
    <button type="button" :disabled="busy || !hasChanges" title="Save current file" @click="emit('save')">
      Save
    </button>
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
    <button type="button" :disabled="busy || !localAvailable" title="Stop lab dev server" @click="emit('stop')">
      Stop
    </button>
    <button type="button" :disabled="busy" title="Refresh lab status" @click="emit('refresh')">
      Refresh
    </button>
  </div>
</template>
