<script setup lang="ts">
import { computed, shallowRef } from "vue";
import AxiosFlowDetail from "./AxiosFlowDetail.vue";
import AxiosFlowDiagram from "./AxiosFlowDiagram.vue";
import { flowNodes, flowScenarios, type FlowScenarioId } from "./axios-flow-data";

const DEFAULT_ZOOM = 0.84;
const MIN_ZOOM = 0.68;
const MAX_ZOOM = 1.12;

const activeScenarioId = shallowRef<FlowScenarioId>("all");
const selectedNodeId = shallowRef("client");
const zoom = shallowRef(DEFAULT_ZOOM);

const activeScenario = computed(() => {
  return (
    flowScenarios.find((scenario) => scenario.id === activeScenarioId.value) ?? flowScenarios[0]!
  );
});

const selectedNode = computed(() => {
  return flowNodes.find((node) => node.id === selectedNodeId.value) ?? flowNodes[0]!;
});

const zoomLabel = computed(() => `${Math.round(zoom.value * 100)}%`);

function selectScenario(scenarioId: FlowScenarioId) {
  const scenario = flowScenarios.find((item) => item.id === scenarioId);
  if (!scenario) {
    return;
  }

  activeScenarioId.value = scenarioId;
  selectedNodeId.value = scenario.defaultNodeId;
}

function adjustZoom(delta: number) {
  zoom.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number((zoom.value + delta).toFixed(2))));
}
</script>

<template>
  <section class="explorer" aria-labelledby="axios-flow-explorer-title">
    <header class="explorer__header">
      <div>
        <p class="explorer__eyebrow">REQUEST ROUTE CONSOLE</p>
        <h3 id="axios-flow-explorer-title">一次请求，到底穿过哪些模块？</h3>
        <p class="explorer__summary">
          默认显示全景。切换场景会把无关路径压暗；点任意模块，可以在图下查看它的输入、输出和边界。
        </p>
      </div>
      <div class="explorer__stat" aria-label="图中模块数量">
        <strong>{{ flowNodes.length }}</strong>
        <span>个职责节点</span>
      </div>
    </header>

    <div class="explorer__controls">
      <div class="scenario-tabs" role="tablist" aria-label="选择请求场景">
        <button
          v-for="scenario in flowScenarios"
          :key="scenario.id"
          class="scenario-tab"
          :class="{ 'scenario-tab--active': activeScenarioId === scenario.id }"
          type="button"
          role="tab"
          :aria-selected="activeScenarioId === scenario.id"
          @click="selectScenario(scenario.id)"
        >
          <span class="scenario-tab__wide">{{ scenario.label }}</span>
          <span class="scenario-tab__short">{{ scenario.shortLabel }}</span>
        </button>
      </div>

      <div class="zoom-controls" aria-label="流程图缩放">
        <button
          type="button"
          aria-label="缩小流程图"
          :disabled="zoom <= MIN_ZOOM"
          @click="adjustZoom(-0.08)"
        >
          −
        </button>
        <button
          type="button"
          class="zoom-controls__value"
          :aria-label="`重置流程图缩放，当前 ${zoomLabel}`"
          @click="zoom = DEFAULT_ZOOM"
        >
          {{ zoomLabel }}
        </button>
        <button
          type="button"
          aria-label="放大流程图"
          :disabled="zoom >= MAX_ZOOM"
          @click="adjustZoom(0.08)"
        >
          +
        </button>
      </div>
    </div>

    <div class="scenario-note" role="status">
      <span class="scenario-note__pulse" aria-hidden="true"></span>
      <strong>{{ activeScenario.label }}</strong>
      <span>{{ activeScenario.description }}</span>
    </div>

    <AxiosFlowDiagram
      :active-scenario="activeScenarioId"
      :selected-node-id="selectedNodeId"
      :zoom="zoom"
      @select="selectedNodeId = $event"
    />

    <div class="legend" aria-label="流程图线条说明">
      <span><i class="legend__line legend__line--main"></i>请求主线</span>
      <span><i class="legend__line legend__line--success"></i>正常返回</span>
      <span><i class="legend__line legend__line--auth"></i>401 恢复</span>
      <span><i class="legend__line legend__line--failure"></i>错误与重试</span>
      <span><i class="legend__line legend__line--session"></i>会话同步</span>
      <span><i class="legend__line legend__line--utility"></i>文件工具</span>
    </div>

    <AxiosFlowDetail :node="selectedNode" />
  </section>
</template>

<style scoped>
.explorer {
  width: 100%;
  margin: 26px 0 34px;
  padding: 24px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 22%, var(--vp-c-divider));
  border-radius: 22px;
  background:
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
      transparent 32%
    ),
    var(--vp-c-bg-soft);
  box-shadow: 0 20px 55px color-mix(in srgb, #0f172a 9%, transparent);
}

.explorer__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}

.explorer__eyebrow {
  margin: 0 0 5px;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.11em;
}

.explorer__header h3 {
  margin: 0;
  border: 0;
  font-size: clamp(20px, 2.5vw, 27px);
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.explorer__summary {
  max-width: 660px;
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.explorer__stat {
  display: grid;
  flex: 0 0 auto;
  min-width: 92px;
  padding: 12px 15px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
  text-align: right;
}

.explorer__stat strong {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 24px;
  line-height: 1;
}

.explorer__stat span {
  margin-top: 5px;
  color: var(--vp-c-text-3);
  font-size: 10px;
}

.explorer__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}

.scenario-tabs {
  display: flex;
  gap: 5px;
  padding: 4px;
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.scenario-tab,
.zoom-controls button {
  border: 0;
  color: var(--vp-c-text-2);
  background: transparent;
  cursor: pointer;
}

.scenario-tab {
  flex: 0 0 auto;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 680;
}

.scenario-tab:hover,
.scenario-tab:focus-visible {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  outline: none;
}

.scenario-tab--active {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-bg));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
}

.scenario-tab__short {
  display: none;
}

.zoom-controls {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.zoom-controls button {
  min-width: 34px;
  height: 34px;
  font-family: var(--vp-font-family-mono);
  font-size: 16px;
}

.zoom-controls button:hover:not(:disabled),
.zoom-controls button:focus-visible {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  outline: none;
}

.zoom-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.zoom-controls__value {
  min-width: 54px !important;
  border-right: 1px solid var(--vp-c-divider) !important;
  border-left: 1px solid var(--vp-c-divider) !important;
  font-size: 11px !important;
}

.scenario-note {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 6px 10px 10px 6px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 7%, var(--vp-c-bg));
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.5;
}

.scenario-note strong {
  flex: 0 0 auto;
  color: var(--vp-c-text-1);
}

.scenario-note__pulse {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--vp-c-brand-1) 13%, transparent);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin: 12px 2px 16px;
  color: var(--vp-c-text-3);
  font-size: 10px;
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend__line {
  display: inline-block;
  width: 20px;
  border-top: 2px solid #3b82f6;
}

.legend__line--success {
  border-color: #10b981;
}

.legend__line--auth {
  border-color: #f59e0b;
}

.legend__line--failure {
  border-color: #ef4444;
  border-style: dashed;
}

.legend__line--session {
  border-color: #8b5cf6;
  border-style: dashed;
}

.legend__line--utility {
  border-color: #14b8a6;
  border-style: dotted;
}

@media (max-width: 760px) {
  .explorer {
    padding: 16px;
    border-radius: 17px;
  }

  .explorer__header {
    gap: 12px;
  }

  .explorer__stat {
    display: none;
  }

  .explorer__controls {
    flex-direction: column;
    align-items: stretch;
  }

  .scenario-tabs {
    flex: 1 1 auto;
    width: 100%;
  }

  .zoom-controls {
    align-self: flex-end;
  }

  .scenario-tab__wide {
    display: none;
  }

  .scenario-tab__short {
    display: inline;
  }

  .scenario-note {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .scenario-note span:last-child {
    flex-basis: calc(100% - 20px);
    margin-left: 15px;
  }
}
</style>
