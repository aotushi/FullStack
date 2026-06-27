<script setup lang="ts">
import { computed, onMounted, shallowRef } from "vue";
import UrlLifecycleDiagram from "./UrlLifecycleDiagram.vue";

type StepKind = "actual" | "partial" | "simulated" | "skipped";

type LifecycleStep = {
  id: string;
  title: string;
  kind: StepKind;
  description: string;
  observable: boolean;
};

type LifecycleResponse = {
  id: string;
  scenario: {
    url: string;
    protocol: string;
    cache: string;
    status: number;
    delay: number;
    resourceType: string;
  };
  steps: LifecycleStep[];
};

const cacheMode = shallowRef("etag");
const statusCode = shallowRef(200);
const delay = shallowRef(160);
const resourceType = shallowRef("html");
const lifecycle = shallowRef<LifecycleResponse | null>(null);
const isLoading = shallowRef(false);
const errorMessage = shallowRef("");

const cacheOptions = [
  { value: "none", label: "无缓存" },
  { value: "memory", label: "内存缓存" },
  { value: "http-cache", label: "HTTP 缓存" },
  { value: "etag", label: "ETag 验证" },
];

const statusOptions = [200, 301, 302, 304, 401, 403, 404, 500];

const resourceOptions = [
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "js", label: "JavaScript" },
  { value: "image", label: "Image" },
  { value: "json", label: "JSON" },
];

const requestUrl = computed(() => {
  const params = new URLSearchParams({
    cache: cacheMode.value,
    status: String(statusCode.value),
    delay: String(delay.value),
    resource: resourceType.value,
  });

  return `/api/labs/url-lifecycle?${params.toString()}`;
});

async function runScenario() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch(requestUrl.value);
    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`);
    }
    lifecycle.value = (await response.json()) as LifecycleResponse;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  void runScenario();
});
</script>

<template>
  <section class="url-lifecycle" aria-labelledby="url-lifecycle-title">
    <div class="url-lifecycle__intro">
      <div>
        <p class="url-lifecycle__eyebrow">Visual Route Trace</p>
        <h2 id="url-lifecycle-title" class="url-lifecycle__title">请求路径示例流程</h2>
        <p class="url-lifecycle__summary">
          用概念化的流程图展示一次 URL 访问从浏览器到服务端再回到页面渲染的过程。
        </p>
      </div>
      <button class="url-lifecycle__run" type="button" :disabled="isLoading" @click="runScenario">
        {{ isLoading ? "Running..." : "Run" }}
      </button>
    </div>

    <form class="url-lifecycle__controls" @submit.prevent="runScenario">
      <label class="url-lifecycle__field">
        <span>缓存策略</span>
        <select v-model="cacheMode">
          <option v-for="option in cacheOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="url-lifecycle__field">
        <span>状态码</span>
        <select v-model.number="statusCode">
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </label>

      <label class="url-lifecycle__field">
        <span>延迟</span>
        <input v-model.number="delay" min="0" max="3000" step="40" type="number" />
      </label>

      <label class="url-lifecycle__field">
        <span>资源类型</span>
        <select v-model="resourceType">
          <option v-for="option in resourceOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </form>

    <p v-if="errorMessage" class="url-lifecycle__error">{{ errorMessage }}</p>

    <UrlLifecycleDiagram v-if="lifecycle" :lifecycle="lifecycle" />
  </section>
</template>

<style scoped>
.url-lifecycle {
  margin: 28px 0;
  overflow: hidden;
  border: 1px solid #d6dfeb;
  border-radius: 8px;
  background: #ffffff;
  color: #102033;
}

.url-lifecycle__intro {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #dbe4f0;
  padding: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.url-lifecycle__eyebrow {
  margin: 0 0 8px;
  color: #2f80ed;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.url-lifecycle__title {
  margin: 0;
  color: #102033;
  font-size: 22px;
  line-height: 1.35;
}

.url-lifecycle__summary {
  max-width: 680px;
  margin: 10px 0 0;
  color: #51647d;
  font-size: 14px;
  line-height: 1.8;
}

.url-lifecycle__run {
  min-width: 86px;
  border: 1px solid #1f6fd1;
  border-radius: 8px;
  padding: 9px 14px;
  background: #2f80ed;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.url-lifecycle__run:disabled {
  cursor: wait;
  opacity: 0.7;
}

.url-lifecycle__controls {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #dbe4f0;
  background: #f4f8fd;
}

.url-lifecycle__field {
  display: grid;
  gap: 6px;
  min-width: 0;
  color: #43546b;
  font-size: 12px;
  font-weight: 700;
}

.url-lifecycle__field input,
.url-lifecycle__field select {
  width: 100%;
  min-width: 0;
  border: 1px solid #c6d3e2;
  border-radius: 8px;
  padding: 9px 10px;
  background: #ffffff;
  color: #102033;
  font: inherit;
  font-weight: 500;
}

.url-lifecycle__error {
  margin: 16px 20px 0;
  border: 1px solid #ffc9c9;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff3f3;
  color: #b42318;
}

@media (max-width: 920px) {
  .url-lifecycle__controls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .url-lifecycle__intro {
    display: grid;
    padding: 16px;
  }

  .url-lifecycle__controls {
    grid-template-columns: 1fr;
    padding: 14px 16px;
  }

  .url-lifecycle__diagram {
    padding: 16px;
  }
}
</style>
