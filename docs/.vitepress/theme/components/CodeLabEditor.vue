<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, watch } from "vue";
import { EditorView } from "@codemirror/view";
import { vscodeEditorTheme, vscodeSyntaxHighlighting } from "../lab/vscodeTheme";

const props = defineProps<{
  code: string;
  filePath: string;
  busy: boolean;
  hasChanges: boolean;
}>();

const emit = defineEmits<{
  copy: [];
  reset: [];
  save: [];
  "update:code": [value: string];
}>();

const host = shallowRef<HTMLElement | null>(null);
const view = shallowRef<EditorView | null>(null);

function languageName(filePath: string) {
  if (filePath.endsWith(".vue")) return "Vue";
  if (filePath.endsWith(".ts")) return "TypeScript";
  if (filePath.endsWith(".js")) return "JavaScript";
  if (filePath.endsWith(".css")) return "CSS";
  if (filePath.endsWith(".html")) return "HTML";
  if (filePath.endsWith(".json")) return "JSON";
  return "Text";
}

async function createEditor() {
  if (!host.value) return;

  const [{ basicSetup }, { javascript }, { html }, { css }, { vue }] = await Promise.all([
    import("codemirror"),
    import("@codemirror/lang-javascript"),
    import("@codemirror/lang-html"),
    import("@codemirror/lang-css"),
    import("@codemirror/lang-vue"),
  ]);

  const extensions = [
    basicSetup,
    vscodeEditorTheme,
    vscodeSyntaxHighlighting,
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        emit("update:code", update.state.doc.toString());
      }
    }),
  ];

  if (props.filePath.endsWith(".vue")) extensions.push(vue());
  else if (props.filePath.endsWith(".ts")) extensions.push(javascript({ typescript: true }));
  else if (props.filePath.endsWith(".js")) extensions.push(javascript());
  else if (props.filePath.endsWith(".json")) extensions.push(javascript());
  else if (props.filePath.endsWith(".html")) extensions.push(html());
  else if (props.filePath.endsWith(".css")) extensions.push(css());

  view.value = new EditorView({
    doc: props.code,
    extensions,
    parent: host.value,
  });
}

watch(
  () => props.code,
  (code) => {
    if (!view.value) return;
    const current = view.value.state.doc.toString();
    if (current === code) return;
    view.value.dispatch({
      changes: { from: 0, to: current.length, insert: code },
    });
  },
);

onMounted(createEditor);

onBeforeUnmount(() => {
  view.value?.destroy();
});
</script>

<template>
  <section class="code-lab-editor">
    <div class="code-lab-editor__bar">
      <div class="code-lab-editor__meta">
        <span class="code-lab-editor__path">{{ filePath }}</span>
        <span>{{ languageName(filePath) }}</span>
      </div>
      <div class="code-lab-actions" aria-label="Current file actions">
        <button type="button" title="Copy current file" @click="emit('copy')">Copy</button>
        <button type="button" title="Reset current file" @click="emit('reset')">Reset</button>
        <button
          type="button"
          :disabled="busy || !hasChanges"
          title="Save current file"
          @click="emit('save')"
        >
          Save
        </button>
      </div>
    </div>
    <div ref="host" class="code-lab-editor__host" />
  </section>
</template>
