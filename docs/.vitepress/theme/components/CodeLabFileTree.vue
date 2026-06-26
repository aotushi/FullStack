<script setup lang="ts">
defineProps<{
  files: string[];
  activeFile: string;
  collapsed: boolean;
}>();

const emit = defineEmits<{
  select: [path: string];
  toggle: [];
}>();
</script>

<template>
  <aside
    class="code-lab-tree"
    :class="{ 'code-lab-tree--collapsed': collapsed }"
    aria-label="Lab files"
  >
    <div class="code-lab-tree__title">
      <span v-if="!collapsed">Explorer</span>
      <button
        class="code-lab-tree__toggle"
        type="button"
        :aria-expanded="!collapsed"
        :title="collapsed ? 'Expand Explorer' : 'Collapse Explorer'"
        @click="emit('toggle')"
      >
        {{ collapsed ? ">" : "<" }}
      </button>
    </div>
    <template v-if="!collapsed">
      <button
        v-for="file in files"
        :key="file"
        class="code-lab-tree__file"
        :class="{ 'code-lab-tree__file--active': file === activeFile }"
        type="button"
        @click="emit('select', file)"
      >
        <span class="code-lab-tree__icon">◇</span>
        <span class="code-lab-tree__path">{{ file }}</span>
      </button>
    </template>
  </aside>
</template>
