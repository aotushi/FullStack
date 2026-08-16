<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  files: string[];
  activeFile: string;
  changedFiles: string[];
}>();

const emit = defineEmits<{
  select: [path: string];
}>();

const tabs = computed(() =>
  props.files.map((path) => {
    const segments = path.split("/");
    const label = segments.pop() ?? path;
    return {
      path,
      label,
      folder: segments.length > 0 ? `${segments.join("/")}/` : "",
    };
  }),
);

const changedFileSet = computed(() => new Set(props.changedFiles));
</script>

<template>
  <nav class="code-lab-tabs" aria-label="练习文件">
    <div class="code-lab-tabs__scroller">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        class="code-lab-tabs__tab"
        :class="{ 'code-lab-tabs__tab--active': tab.path === activeFile }"
        type="button"
        :aria-pressed="tab.path === activeFile"
        :title="tab.path"
        @click="emit('select', tab.path)"
      >
        <span v-if="tab.folder" class="code-lab-tabs__folder">{{ tab.folder }}</span>
        <span>{{ tab.label }}</span>
        <span
          v-if="changedFileSet.has(tab.path)"
          class="code-lab-tabs__changed"
          aria-label="已修改"
          title="已修改"
        />
      </button>
    </div>
  </nav>
</template>
