<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from "vue";
import { flowEdges, flowNodes, type FlowScenarioId } from "./axios-flow-data";

const { activeScenario, selectedNodeId, zoom } = defineProps<{
  activeScenario: FlowScenarioId;
  selectedNodeId: string;
  zoom: number;
}>();

const emit = defineEmits<{
  select: [nodeId: string];
}>();

const viewportRef = useTemplateRef<HTMLDivElement>("viewport");

watch(
  () => selectedNodeId,
  async (nodeId) => {
    await nextTick();
    const viewport = viewportRef.value;
    const node = flowNodes.find((item) => item.id === nodeId);
    if (!viewport || !node) {
      return;
    }

    const left = (node.x + node.width / 2) * zoom - viewport.clientWidth / 2;
    const top = (node.y + node.height / 2) * zoom - viewport.clientHeight / 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollTo({
      behavior: reduceMotion ? "auto" : "smooth",
      left: Math.max(0, left),
      top: Math.max(0, top),
    });
  },
);

function isNodeActive(scenarios: Exclude<FlowScenarioId, "all">[]) {
  return activeScenario === "all" || scenarios.includes(activeScenario);
}

function isEdgeActive(scenarios: Exclude<FlowScenarioId, "all">[]) {
  return activeScenario === "all" || scenarios.includes(activeScenario);
}
</script>

<template>
  <div
    ref="viewport"
    class="diagram-viewport"
    tabindex="0"
    aria-label="Axios 请求完整流程图，可横向和纵向滚动"
  >
    <svg
      class="diagram"
      :style="{ width: `${1260 * zoom}px` }"
      viewBox="0 0 1260 1135"
      role="img"
      aria-labelledby="axios-flow-title axios-flow-description"
    >
      <title id="axios-flow-title">admin-backend-3 Axios 请求层完整流程</title>
      <desc id="axios-flow-description">
        流程从页面、查询层、业务 API 进入 HTTP 客户端，经过请求拦截器和网络，再按正常响应、401
        刷新、失败重试或文件传输分支返回。
      </desc>

      <defs>
        <marker id="arrow-main" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#3b82f6" />
        </marker>
        <marker id="arrow-success" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#10b981" />
        </marker>
        <marker id="arrow-auth" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#f59e0b" />
        </marker>
        <marker id="arrow-failure" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#ef4444" />
        </marker>
        <marker id="arrow-utility" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#14b8a6" />
        </marker>
        <marker id="arrow-session" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#8b5cf6" />
        </marker>
        <filter id="node-shadow" x="-20%" y="-30%" width="140%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.11" />
        </filter>
      </defs>

      <g class="lanes" aria-hidden="true">
        <rect class="lane lane--app" x="20" y="28" width="280" height="1098" rx="18" />
        <rect class="lane lane--core" x="320" y="28" width="280" height="1098" rx="18" />
        <rect class="lane lane--response" x="620" y="28" width="280" height="1098" rx="18" />
        <rect class="lane lane--auth" x="920" y="28" width="280" height="1098" rx="18" />
        <text class="lane-label" x="40" y="20">01 · 页面与业务</text>
        <text class="lane-label" x="340" y="20">02 · 逻辑请求与发送</text>
        <text class="lane-label" x="640" y="20">03 · 响应与错误</text>
        <text class="lane-label" x="940" y="20">04 · 认证与会话</text>
      </g>

      <g class="edges" aria-hidden="true">
        <g
          v-for="edge in flowEdges"
          :key="edge.id"
          class="edge"
          :class="[`edge--${edge.tone}`, { 'edge--inactive': !isEdgeActive(edge.scenarios) }]"
        >
          <path
            class="edge-path"
            :d="edge.path"
            fill="none"
            :marker-end="`url(#arrow-${edge.tone})`"
          />
          <text
            v-if="edge.label"
            class="edge-label"
            :x="edge.labelX"
            :y="edge.labelY"
            text-anchor="middle"
          >
            {{ edge.label }}
          </text>
        </g>
      </g>

      <g class="nodes">
        <g
          v-for="node in flowNodes"
          :key="node.id"
          class="node"
          :class="[
            `node--${node.tone}`,
            {
              'node--inactive': !isNodeActive(node.scenarios),
              'node--selected': selectedNodeId === node.id,
            },
          ]"
          :transform="`translate(${node.x} ${node.y})`"
          :tabindex="isNodeActive(node.scenarios) ? 0 : -1"
          role="button"
          :aria-label="`${node.module}：${node.title}。${node.summary}`"
          :aria-disabled="!isNodeActive(node.scenarios)"
          :aria-pressed="selectedNodeId === node.id"
          @click="emit('select', node.id)"
          @keydown.enter="emit('select', node.id)"
          @keydown.space.prevent="emit('select', node.id)"
        >
          <rect class="node-surface" :width="node.width" :height="node.height" rx="12" />
          <rect class="node-accent" width="5" :height="node.height - 18" x="10" y="9" rx="2.5" />
          <text class="node-module" x="26" y="19">{{ node.module }}</text>
          <text class="node-title" x="26" y="42">{{ node.title }}</text>
          <text class="node-summary" x="26" y="61">{{ node.summary }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.diagram-viewport {
  max-height: 760px;
  overflow: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background:
    radial-gradient(
      circle at 10% 0%,
      color-mix(in srgb, var(--vp-c-brand-1) 9%, transparent),
      transparent 30%
    ),
    var(--vp-c-bg-soft);
  scrollbar-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent) transparent;
  outline: none;
}

.diagram-viewport:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
}

.diagram {
  display: block;
  min-width: 940px;
  height: auto;
  font-family: var(--vp-font-family-base);
}

.lane {
  stroke: color-mix(in srgb, var(--vp-c-divider) 64%, transparent);
  stroke-width: 1;
}

.lane--app {
  fill: color-mix(in srgb, #3b82f6 4%, var(--vp-c-bg));
}

.lane--core {
  fill: color-mix(in srgb, #14b8a6 4%, var(--vp-c-bg));
}

.lane--response {
  fill: color-mix(in srgb, #10b981 4%, var(--vp-c-bg));
}

.lane--auth {
  fill: color-mix(in srgb, #8b5cf6 4%, var(--vp-c-bg));
}

.lane-label {
  fill: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.edge {
  transition: opacity 180ms ease;
}

.edge-path {
  stroke: #3b82f6;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.edge--success .edge-path {
  stroke: #10b981;
}

.edge--auth .edge-path {
  stroke: #f59e0b;
}

.edge--failure .edge-path {
  stroke: #ef4444;
  stroke-dasharray: 6 5;
}

.edge--utility .edge-path {
  stroke: #14b8a6;
  stroke-dasharray: 3 4;
}

.edge--session .edge-path {
  stroke: #8b5cf6;
  stroke-dasharray: 8 4;
}

.edge--inactive {
  opacity: 0.07;
}

.edge-label {
  fill: var(--vp-c-text-2);
  stroke: var(--vp-c-bg-soft);
  stroke-width: 5px;
  paint-order: stroke;
  font-size: 10px;
  font-weight: 650;
}

.node {
  cursor: pointer;
  outline: none;
  transition: opacity 180ms ease;
}

.node-surface {
  fill: var(--vp-c-bg);
  stroke: color-mix(in srgb, var(--vp-c-divider) 84%, transparent);
  stroke-width: 1.2;
  filter: url(#node-shadow);
  transition:
    stroke 160ms ease,
    stroke-width 160ms ease,
    fill 160ms ease;
}

.node:hover .node-surface,
.node:focus-visible .node-surface {
  stroke: var(--node-color);
  stroke-width: 2;
  fill: color-mix(in srgb, var(--node-color) 5%, var(--vp-c-bg));
}

.node--selected .node-surface {
  stroke: var(--node-color);
  stroke-width: 2.5;
  fill: color-mix(in srgb, var(--node-color) 8%, var(--vp-c-bg));
}

.node-accent {
  fill: var(--node-color);
}

.node-module {
  fill: var(--node-color);
  font-family: var(--vp-font-family-mono);
  font-size: 9.5px;
  font-weight: 700;
}

.node-title {
  fill: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 760;
}

.node-summary {
  fill: var(--vp-c-text-2);
  font-size: 10.5px;
}

.node--app {
  --node-color: #3b82f6;
}

.node--business {
  --node-color: #0f766e;
}

.node--core {
  --node-color: #2563eb;
}

.node--adapter {
  --node-color: #7c3aed;
}

.node--auth {
  --node-color: #d97706;
}

.node--support {
  --node-color: #0891b2;
}

:global(.dark) .node--app,
:global(.dark) .node--core {
  --node-color: #60a5fa;
}

:global(.dark) .node--business {
  --node-color: #5eead4;
}

:global(.dark) .node--adapter {
  --node-color: #a78bfa;
}

:global(.dark) .node--auth {
  --node-color: #fbbf24;
}

:global(.dark) .node--support {
  --node-color: #22d3ee;
}

.node--inactive {
  pointer-events: none;
  opacity: 0.14;
}

@media (max-width: 700px) {
  .diagram-viewport {
    max-height: 660px;
    border-radius: 12px;
  }
}
</style>
