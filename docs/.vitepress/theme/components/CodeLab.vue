<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, shallowRef } from "vue";
import CodeLabEditor from "./CodeLabEditor.vue";
import CodeLabFileTree from "./CodeLabFileTree.vue";
import CodeLabPreview from "./CodeLabPreview.vue";
import { loadStaticLab } from "../lab/projects";
import {
  checkLocalServer,
  installLocalLab,
  readLocalFiles,
  readLocalStatus,
  runLocalLab,
  saveLocalFile,
  stopLocalLab,
} from "../lab/localServer";

const props = withDefaults(
  defineProps<{
    project: string;
    defaultFile?: string;
    height?: string;
  }>(),
  {
    height: "640px",
  },
);

const staticProject = loadStaticLab(props.project);
const state = reactive({
  files: staticProject?.files ?? {},
  activeFile: props.defaultFile || staticProject?.manifest.defaultFile || "",
  localAvailable: false,
  previewUrl: "",
  logs: "",
  status: "Ready",
  busy: false,
  explorerCollapsed: true,
});

const changedFiles = shallowRef(new Set<string>());
let reconnectTimer: ReturnType<typeof window.setInterval> | undefined;
let autoRunAttempted = false;

const manifest = computed(() => staticProject?.manifest);
const fileNames = computed(() => Object.keys(state.files).sort());
const activeCode = computed(() => state.files[state.activeFile] ?? "");
const hasChanges = computed(() => changedFiles.value.size > 0);
const canRun = computed(() => Boolean(manifest.value?.runnable));

function setActiveFile(path: string) {
  state.activeFile = path;
}

function toggleExplorer() {
  state.explorerCollapsed = !state.explorerCollapsed;
}

function updateCode(value: string) {
  state.files[state.activeFile] = value;
  const next = new Set(changedFiles.value);
  next.add(state.activeFile);
  changedFiles.value = next;

  if (!state.localAvailable) {
    window.localStorage.setItem(storageKey(state.activeFile), value);
  }
}

function storageKey(filePath: string) {
  return `fullstack:codelab:${props.project}:${filePath}`;
}

function restoreLocalDrafts() {
  for (const file of fileNames.value) {
    const draft = window.localStorage.getItem(storageKey(file));
    if (draft !== null) state.files[file] = draft;
  }
}

async function detectLocalServer() {
  state.localAvailable = await checkLocalServer();
  if (!state.localAvailable) {
    state.status = "Local lab server is offline";
    return;
  }

  try {
    const localFiles = await readLocalFiles(props.project);
    state.files = localFiles.files;
    const status = await readLocalStatus(props.project);
    state.previewUrl = status.url ?? "";
    state.logs = status.logs;
    state.status = status.running && status.url ? `Running at ${status.url}` : "Local lab server connected";
    if (!status.running && !status.url) await autoRunProject();
  } catch (error) {
    state.status = error instanceof Error ? error.message : String(error);
  }
}

function startReconnectPolling() {
  reconnectTimer = window.setInterval(async () => {
    if (state.localAvailable) {
      if (reconnectTimer) window.clearInterval(reconnectTimer);
      reconnectTimer = undefined;
      return;
    }
    await detectLocalServer();
  }, 2500);
}

async function saveCurrentFile() {
  if (!state.activeFile) return;

  if (!state.localAvailable) {
    window.localStorage.setItem(storageKey(state.activeFile), activeCode.value);
    state.status = "Saved to browser storage";
    return;
  }

  state.busy = true;
  try {
    await saveLocalFile(props.project, state.activeFile, activeCode.value);
    const next = new Set(changedFiles.value);
    next.delete(state.activeFile);
    changedFiles.value = next;
    state.status = "Saved to lab files";
  } catch (error) {
    state.status = error instanceof Error ? error.message : String(error);
  } finally {
    state.busy = false;
  }
}

function resetCurrentFile() {
  if (!staticProject || !state.activeFile) return;
  const original = staticProject.files[state.activeFile];
  if (original === undefined) return;
  state.files[state.activeFile] = original;
  window.localStorage.removeItem(storageKey(state.activeFile));
  const next = new Set(changedFiles.value);
  next.delete(state.activeFile);
  changedFiles.value = next;
  state.status = "Reset current file";
}

async function copyCurrentFile() {
  await navigator.clipboard.writeText(activeCode.value);
  state.status = "Copied";
}

async function installDependencies() {
  state.busy = true;
  try {
    if (!state.localAvailable) throw new Error("Start `npm run labs:server` first.");
    const result = await installLocalLab(props.project);
    state.logs = result.output;
    state.status = result.ok ? "Dependencies installed" : "Install failed";
  } catch (error) {
    state.status = error instanceof Error ? error.message : String(error);
  } finally {
    state.busy = false;
  }
}

async function runProject() {
  state.busy = true;
  try {
    if (!state.localAvailable) throw new Error("Start `npm run labs:server` first.");
    const result = await runLocalLab(props.project);
    state.previewUrl = result.url;
    state.status = `Running at ${result.url}`;
    setTimeout(refreshStatus, 1200);
  } catch (error) {
    state.status = error instanceof Error ? error.message : String(error);
  } finally {
    state.busy = false;
  }
}

async function autoRunProject() {
  if (autoRunAttempted || !canRun.value || !state.localAvailable || state.previewUrl) return;
  autoRunAttempted = true;
  await runProject();
}

async function stopProject() {
  if (!state.localAvailable) return;
  await stopLocalLab(props.project);
  state.previewUrl = "";
  state.status = "Stopped";
}

async function refreshStatus() {
  if (!state.localAvailable) {
    await detectLocalServer();
    return;
  }
  try {
    const status = await readLocalStatus(props.project);
    state.previewUrl = status.url ?? "";
    state.logs = status.logs;
    state.status = status.running && status.url ? `Running at ${status.url}` : "Local lab server connected";
  } catch {
    // Status refresh is non-critical.
  }
}

onMounted(async () => {
  restoreLocalDrafts();
  await detectLocalServer();
  if (!state.localAvailable) startReconnectPolling();
});

onBeforeUnmount(() => {
  if (reconnectTimer) window.clearInterval(reconnectTimer);
});
</script>

<template>
  <section class="code-lab" :style="{ '--code-lab-height': height }">
    <header class="code-lab__header">
      <p class="code-lab__eyebrow">CodeLab</p>
      <h3 class="code-lab__title">{{ manifest?.title ?? project }}</h3>
      <p v-if="manifest?.description" class="code-lab__description">
        {{ manifest.description }}
      </p>
    </header>

    <div
      class="code-lab__body"
      :class="{ 'code-lab__body--tree-collapsed': state.explorerCollapsed }"
    >
      <CodeLabFileTree
        :active-file="state.activeFile"
        :collapsed="state.explorerCollapsed"
        :files="fileNames"
        @select="setActiveFile"
        @toggle="toggleExplorer"
      />
      <CodeLabEditor
        :key="state.activeFile"
        :busy="state.busy"
        :code="activeCode"
        :file-path="state.activeFile"
        :has-changes="hasChanges"
        @copy="copyCurrentFile"
        @reset="resetCurrentFile"
        @save="saveCurrentFile"
        @update:code="updateCode"
      />
      <CodeLabPreview
        :busy="state.busy"
        :can-run="canRun"
        :local-available="state.localAvailable"
        :preview-url="state.previewUrl"
        :status="state.status"
        @install="installDependencies"
        @refresh="refreshStatus"
        @run="runProject"
        @stop="stopProject"
      />
    </div>
  </section>
</template>
