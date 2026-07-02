<script setup lang="ts">
import { computed, onMounted, shallowRef } from "vue";
import { loadVuePlaygroundProject } from "../playground/vueProjects";

const props = withDefaults(
  defineProps<{
    project: string;
    title?: string;
    description?: string;
    mainFile?: string;
    activeFile?: string;
    height?: string;
  }>(),
  {
    height: "640px",
  },
);

const ReplComponent = shallowRef();
const editorComponent = shallowRef();
const store = shallowRef();
const loadingError = shallowRef("");

const project = computed(() => loadVuePlaygroundProject(props.project));
const title = computed(() => props.title || project.value?.manifest.title || props.project);
const description = computed(() => props.description || project.value?.manifest.description || "");
const mainFile = computed(() => {
  return props.mainFile || project.value?.manifest.mainFile || "App.vue";
});
const activeFile = computed(() => {
  return props.activeFile || project.value?.manifest.activeFile || mainFile.value;
});

onMounted(async () => {
  if (!project.value) {
    loadingError.value = `Vue playground project not found: ${props.project}`;
    return;
  }

  try {
    const [{ Repl, useStore }, { default: CodeMirror }] = await Promise.all([
      import("@vue/repl"),
      import("@vue/repl/codemirror-editor"),
    ]);

    const nextStore = useStore();
    await nextStore.setFiles(project.value.files, mainFile.value);
    nextStore.setActive(activeFile.value);

    ReplComponent.value = Repl;
    editorComponent.value = CodeMirror;
    store.value = nextStore;
  } catch (error) {
    loadingError.value = error instanceof Error ? error.message : String(error);
  }
});
</script>

<template>
  <section class="vue-playground" :style="{ '--vue-playground-height': height }">
    <header class="vue-playground__header">
      <p class="vue-playground__eyebrow">Vue SFC Playground</p>
      <h3 class="vue-playground__title">{{ title }}</h3>
      <p v-if="description" class="vue-playground__description">
        {{ description }}
      </p>
    </header>

    <div class="vue-playground__body">
      <p v-if="loadingError" class="vue-playground__error">{{ loadingError }}</p>
      <p v-else-if="!ReplComponent || !editorComponent || !store" class="vue-playground__loading">
        Loading playground...
      </p>
      <component
        :is="ReplComponent"
        v-else
        :editor="editorComponent"
        :store="store"
        :show-compile-output="false"
        :show-import-map="false"
        :show-open-source-map="false"
        :show-ssr-output="false"
        :show-ts-config="false"
        layout="horizontal"
        theme="dark"
      />
    </div>
  </section>
</template>

<style scoped>
.vue-playground {
  margin: 32px 0;
  overflow: hidden;
  border: 1px solid #2f3a4a;
  border-radius: 8px;
  background: #161718;
}

.vue-playground__header {
  padding: 24px;
  border-bottom: 1px solid #2f3a4a;
}

.vue-playground__eyebrow {
  margin: 0 0 12px;
  color: #9aa4b2;
  font-size: 14px;
}

.vue-playground__title {
  margin: 0;
  color: #f3f4f6;
  font-size: 22px;
  line-height: 1.3;
}

.vue-playground__description {
  max-width: 720px;
  margin: 12px 0 0;
  color: #b6c0cc;
  font-size: 15px;
  line-height: 1.7;
}

.vue-playground__body {
  height: var(--vue-playground-height);
  min-height: 420px;
}

.vue-playground__loading,
.vue-playground__error {
  display: grid;
  height: 100%;
  margin: 0;
  place-items: center;
  color: #b6c0cc;
}

.vue-playground__error {
  color: #fca5a5;
}

.vue-playground__body :deep(.vue-repl) {
  height: 100%;
}

.vue-playground__body :deep(.split-pane) {
  height: 100%;
}

.vue-playground__body :deep(.tab-buttons) {
  background: #202124;
}

.vue-playground__body :deep(.output-container) {
  background: #f7f9fc;
}

@media (max-width: 768px) {
  .vue-playground__header {
    padding: 18px;
  }

  .vue-playground__body {
    height: 720px;
  }
}
</style>
