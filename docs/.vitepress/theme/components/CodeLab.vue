<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, shallowRef } from "vue";
import CodeLabEditor from "./CodeLabEditor.vue";
import CodeLabFileTabs from "./CodeLabFileTabs.vue";
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
    layout?: "workbench" | "notebook";
    height?: string;
  }>(),
  {
    height: "640px",
    layout: "workbench",
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
const changedFileNames = computed(() => Array.from(changedFiles.value));
const currentFileChanged = computed(() => changedFiles.value.has(state.activeFile));
const canRun = computed(() => Boolean(manifest.value?.runnable));
const isNotebook = computed(() => props.layout === "notebook");

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
    state.status =
      status.running && status.url ? `Running at ${status.url}` : "Local lab server connected";
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

async function saveChangedFiles(filePaths: string[]) {
  for (const filePath of filePaths) {
    await saveLocalFile(props.project, filePath, state.files[filePath] ?? "");
    const next = new Set(changedFiles.value);
    next.delete(filePath);
    changedFiles.value = next;
  }
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
    await saveChangedFiles([state.activeFile]);
    state.status = "Saved to lab files";
  } catch (error) {
    state.status = error instanceof Error ? error.message : String(error);
  } finally {
    state.busy = false;
  }
}

async function resetCurrentFile() {
  if (!staticProject || !state.activeFile) return;
  const filePath = state.activeFile;
  const original = staticProject.files[filePath];
  if (original === undefined) return;
  state.files[filePath] = original;
  window.localStorage.removeItem(storageKey(filePath));

  if (state.localAvailable) {
    state.busy = true;
    try {
      await saveLocalFile(props.project, filePath, original);
    } catch (error) {
      const next = new Set(changedFiles.value);
      next.add(filePath);
      changedFiles.value = next;
      state.status = error instanceof Error ? error.message : String(error);
      state.busy = false;
      return;
    }
    state.busy = false;
  }

  const next = new Set(changedFiles.value);
  next.delete(filePath);
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
    if (changedFiles.value.size > 0) {
      state.status = "Saving changes";
      await saveChangedFiles(Array.from(changedFiles.value));
    }
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
    state.status =
      status.running && status.url ? `Running at ${status.url}` : "Local lab server connected";
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
  <section
    v-if="isNotebook"
    class="code-lab code-lab--notebook"
    :style="{ '--code-lab-height': height }"
  >
    <div class="code-lab-notebook__workspace">
      <header class="code-lab-notebook__toolbar">
        <CodeLabFileTabs
          :active-file="state.activeFile"
          :changed-files="changedFileNames"
          :files="fileNames"
          @select="setActiveFile"
        />
        <div class="code-lab-notebook__actions" aria-label="代码操作">
          <span
            class="code-lab-notebook__connection"
            :class="state.localAvailable ? 'is-online' : 'is-offline'"
          >
            <span class="code-lab-notebook__connection-dot" aria-hidden="true" />
            {{ state.localAvailable ? (state.previewUrl ? "运行中" : "已连接") : "本地服务未连接" }}
          </span>
          <button type="button" :disabled="state.busy" @click="copyCurrentFile">复制</button>
          <button
            type="button"
            :disabled="state.busy || !currentFileChanged"
            @click="resetCurrentFile"
          >
            重置
          </button>
          <button
            class="code-lab-notebook__run"
            type="button"
            :disabled="state.busy || !canRun || !state.localAvailable"
            @click="runProject"
          >
            {{ state.busy ? "处理中" : "运行" }}
          </button>
        </div>
      </header>

      <CodeLabEditor
        :key="state.activeFile"
        :busy="state.busy"
        :code="activeCode"
        :file-path="state.activeFile"
        :has-changes="currentFileChanged"
        :show-toolbar="false"
        @copy="copyCurrentFile"
        @reset="resetCurrentFile"
        @save="saveCurrentFile"
        @update:code="updateCode"
      />
    </div>

    <CodeLabPreview
      :busy="state.busy"
      :can-run="canRun"
      layout="notebook"
      :local-available="state.localAvailable"
      :preview-url="state.previewUrl"
      :status="state.status"
      @install="installDependencies"
      @refresh="refreshStatus"
      @run="runProject"
      @stop="stopProject"
    />
  </section>

  <section v-else class="code-lab" :style="{ '--code-lab-height': height }">
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
        :has-changes="currentFileChanged"
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
