<script setup lang="ts">
import { computed } from "vue";

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

type IconName = "user" | "browser" | "cache" | "dns" | "server" | "service" | "render";

type DiagramNode = {
  id: string;
  step: string;
  label: string;
  detail: string;
  labelLines: string[];
  detailLines: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  fill: string;
  icon: IconName;
};

type DiagramNodeInput = Omit<DiagramNode, "labelLines" | "detailLines"> & {
  labelLines?: string[];
  detailLines?: string[];
};

type DiagramLink = {
  id: string;
  path: string;
  label: string;
  labelX: number;
  labelY: number;
  dashed?: boolean;
};

const props = defineProps<{
  lifecycle: LifecycleResponse;
}>();

const stepById = computed(() => {
  const map = new Map<string, LifecycleStep>();
  for (const step of props.lifecycle.steps) {
    map.set(step.id, step);
  }
  return map;
});

const cacheLabel = computed(() => {
  const labels: Record<string, string> = {
    none: "跳过缓存",
    memory: "命中内存缓存",
    "http-cache": "检查 HTTP 缓存",
    etag: "ETag 验证",
  };

  return labels[props.lifecycle.scenario.cache] ?? props.lifecycle.scenario.cache;
});

const statusTone = computed(() => {
  const status = props.lifecycle.scenario.status;
  if (status >= 500) return "Server Error";
  if (status >= 400) return "Client Error";
  if (status >= 300) return "Redirect";
  return "OK";
});

function splitText(text: string, maxLength: number) {
  const chars = Array.from(text);
  const lines: string[] = [];

  for (let index = 0; index < chars.length; index += maxLength) {
    lines.push(chars.slice(index, index + maxLength).join(""));
  }

  return lines.slice(0, 2);
}

function createNode(node: DiagramNodeInput, lineLength = 16): DiagramNode {
  return {
    ...node,
    labelLines: node.labelLines ?? splitText(node.label, 12),
    detailLines: node.detailLines ?? splitText(node.detail, lineLength),
  };
}

function labelWidth(text: string) {
  const charCount = Array.from(text).length;
  return Math.max(48, charCount * 13 + 22);
}

const nodes = computed<DiagramNode[]>(() => [
  createNode(
    {
      id: "user",
      step: "1",
      label: "用户输入 URL",
      detail: "协议 / 域名 / 路径 / 参数",
      detailLines: ["协议 / 域名", "路径 / 参数"],
      x: 92,
      y: 168,
      w: 190,
      h: 86,
      color: "#2F80ED",
      fill: "#EAF3FF",
      icon: "user",
    },
    22,
  ),
  createNode({
    id: "browser",
    step: "2",
    label: stepById.value.get("url-parse")?.title ?? "URL 解析",
    detail: "协议 / 主机 / 路径 / 查询",
    x: 372,
    y: 168,
    w: 218,
    h: 86,
    color: "#2F80ED",
    fill: "#F3F8FF",
    icon: "browser",
  }),
  createNode({
    id: "cache",
    step: "3",
    label: stepById.value.get("cache-check")?.title ?? "缓存检查",
    detail: cacheLabel.value,
    x: 372,
    y: 306,
    w: 218,
    h: 86,
    color: "#8A63D2",
    fill: "#F7F1FF",
    icon: "cache",
  }),
  createNode({
    id: "resolver",
    step: "4",
    label: stepById.value.get("dns")?.title ?? "DNS 解析",
    detail: "缓存 / Resolver / 权威 DNS",
    x: 118,
    y: 512,
    w: 232,
    h: 86,
    color: "#8A63D2",
    fill: "#FAF5FF",
    icon: "dns",
  }),
  createNode({
    id: "connection",
    step: "5",
    label: "连接与 TLS",
    detail: "TCP / QUIC / TLS",
    x: 422,
    y: 512,
    w: 232,
    h: 86,
    color: "#F2A93B",
    fill: "#FFF7E8",
    icon: "server",
  }),
  createNode({
    id: "server",
    step: "6",
    label: "服务端入口",
    detail: `${props.lifecycle.scenario.resourceType.toUpperCase()} 请求进入服务端`,
    x: 802,
    y: 168,
    w: 230,
    h: 88,
    color: "#19A974",
    fill: "#EDFCF4",
    icon: "server",
  }),
  createNode({
    id: "service",
    step: "7",
    label: "业务处理",
    detail: `${props.lifecycle.scenario.delay}ms / 状态 ${props.lifecycle.scenario.status}`,
    x: 802,
    y: 352,
    w: 230,
    h: 88,
    color: "#19A974",
    fill: "#EDFCF4",
    icon: "service",
  }),
  createNode({
    id: "response",
    step: "8",
    label: "HTTP 响应",
    detail: `${props.lifecycle.scenario.status} ${statusTone.value}`,
    x: 802,
    y: 536,
    w: 230,
    h: 88,
    color: "#2F80ED",
    fill: "#F3F8FF",
    icon: "server",
  }),
  createNode({
    id: "render",
    step: "9",
    label: "解析与渲染",
    detail: "HTML / CSS / JS 生成页面",
    x: 410,
    y: 684,
    w: 252,
    h: 88,
    color: "#E65F99",
    fill: "#FFF1F7",
    icon: "render",
  }),
]);

const links: DiagramLink[] = [
  {
    id: "user-browser",
    path: "M 282 211 H 372",
    label: "输入",
    labelX: 326,
    labelY: 198,
  },
  {
    id: "browser-cache",
    path: "M 481 254 V 306",
    label: "先查本地",
    labelX: 526,
    labelY: 282,
  },
  {
    id: "cache-resolver",
    path: "M 481 392 V 448 H 234 V 512",
    label: "未命中",
    labelX: 360,
    labelY: 438,
    dashed: true,
  },
  {
    id: "resolver-connection",
    path: "M 350 555 H 422",
    label: "得到 IP",
    labelX: 386,
    labelY: 540,
    dashed: true,
  },
  {
    id: "connection-server",
    path: "M 654 555 H 714 V 212 H 802",
    label: "建立安全通道",
    labelX: 714,
    labelY: 386,
    dashed: true,
  },
  {
    id: "server-service",
    path: "M 917 256 V 352",
    label: "请求处理",
    labelX: 966,
    labelY: 306,
  },
  {
    id: "service-response",
    path: "M 917 440 V 536",
    label: "生成响应",
    labelX: 966,
    labelY: 490,
  },
  {
    id: "response-render",
    path: "M 802 580 H 700 V 728 H 662",
    label: "返回浏览器",
    labelX: 704,
    labelY: 654,
  },
];
</script>

<template>
  <figure class="lifecycle-diagram" aria-labelledby="url-route-diagram-title">
    <div class="lifecycle-diagram__scroll">
      <svg
        class="lifecycle-diagram__canvas"
        viewBox="0 0 1120 830"
        role="img"
        aria-describedby="url-route-diagram-desc"
      >
        <title id="url-route-diagram-title">浏览器输入 URL 后的请求路径流程图</title>
        <desc id="url-route-diagram-desc">
          从用户输入 URL 到浏览器解析、缓存检查、DNS、连接、服务端处理、HTTP
          响应和页面渲染的流程图。
        </desc>

        <defs>
          <marker
            id="route-arrow"
            markerWidth="9"
            markerHeight="9"
            refX="7"
            refY="4.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 9 4.5 L 0 9 z" fill="#243447" />
          </marker>
          <filter id="card-shadow" x="-12%" y="-12%" width="130%" height="135%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="4"
              flood-color="#223044"
              flood-opacity="0.045"
            />
          </filter>
          <pattern id="diagram-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 H 0 V 28" fill="none" stroke="#EAF0F7" stroke-width="1" />
          </pattern>
        </defs>

        <rect width="1120" height="830" rx="22" fill="#FFFFFF" />
        <rect x="22" y="22" width="1076" height="786" rx="18" fill="url(#diagram-grid)" />

        <text x="58" y="62" class="lifecycle-diagram__poster-title">
          What happens when you type a URL?
        </text>
        <text x="58" y="88" class="lifecycle-diagram__poster-subtitle">
          A browser request is a chain, not a single API call.
        </text>

        <g class="lifecycle-diagram__zone">
          <rect x="56" y="120" width="604" height="304" rx="20" fill="#F2F8FF" stroke="#BBD9FF" />
          <text x="82" y="146" class="lifecycle-diagram__zone-title">Browser / Local Machine</text>
        </g>
        <g class="lifecycle-diagram__zone">
          <rect
            x="82"
            y="462"
            width="598"
            height="166"
            rx="20"
            fill="#FBF7FF"
            stroke="#DAC8FF"
            stroke-dasharray="8 7"
          />
          <text x="108" y="488" class="lifecycle-diagram__zone-title">
            Network: real but partly hidden
          </text>
        </g>
        <g class="lifecycle-diagram__zone">
          <rect x="760" y="120" width="306" height="530" rx="20" fill="#F1FFF7" stroke="#B8E8D1" />
          <text x="786" y="146" class="lifecycle-diagram__zone-title">Server Side</text>
        </g>

        <g class="lifecycle-diagram__links">
          <template v-for="link in links" :key="link.id">
            <path
              :d="link.path"
              :class="{ 'is-dashed': link.dashed }"
              class="lifecycle-diagram__link"
              marker-end="url(#route-arrow)"
            />
            <g class="lifecycle-diagram__link-label">
              <rect
                :x="link.labelX - labelWidth(link.label) / 2"
                :y="link.labelY - 16"
                :width="labelWidth(link.label)"
                height="25"
                rx="12.5"
              />
              <text :x="link.labelX" :y="link.labelY">{{ link.label }}</text>
            </g>
          </template>
        </g>

        <g v-for="node in nodes" :key="node.id" class="lifecycle-diagram__node">
          <rect
            :x="node.x"
            :y="node.y"
            :width="node.w"
            :height="node.h"
            rx="18"
            :fill="node.fill"
            :stroke="node.color"
            filter="url(#card-shadow)"
          />
          <circle :cx="node.x + 17" :cy="node.y - 1" r="10" fill="#1597E5" />
          <text :x="node.x + 17" :y="node.y + 3" class="lifecycle-diagram__step">
            {{ node.step }}
          </text>

          <rect
            :x="node.x + 18"
            :y="node.y + 22"
            width="46"
            height="46"
            rx="14"
            :fill="node.color"
            opacity="0.12"
          />
          <g
            class="lifecycle-diagram__icon"
            :transform="`translate(${node.x + 28}, ${node.y + 30})`"
            :stroke="node.color"
          >
            <template v-if="node.icon === 'user'">
              <circle cx="14" cy="8" r="6" fill="none" />
              <path d="M 3 29 C 6 17, 22 17, 25 29" fill="none" stroke-linecap="round" />
            </template>
            <template v-else-if="node.icon === 'browser'">
              <rect x="1" y="2" width="28" height="24" rx="4" fill="none" />
              <path d="M 1 10 H 29" />
              <circle cx="8" cy="6" r="1.8" :fill="node.color" stroke="none" />
            </template>
            <template v-else-if="node.icon === 'cache'">
              <ellipse cx="15" cy="6" rx="13" ry="5" fill="none" />
              <path d="M 2 6 V 25 C 2 29, 28 29, 28 25 V 6" fill="none" />
              <path d="M 2 16 C 2 20, 28 20, 28 16" fill="none" />
            </template>
            <template v-else-if="node.icon === 'dns'">
              <circle cx="15" cy="15" r="14" fill="none" />
              <path
                d="M 2 15 H 28 M 15 1 C 9 9, 9 21, 15 29 M 15 1 C 21 9, 21 21, 15 29"
                fill="none"
              />
            </template>
            <template v-else-if="node.icon === 'server'">
              <rect x="2" y="3" width="28" height="9" rx="3" fill="none" />
              <rect x="2" y="18" width="28" height="9" rx="3" fill="none" />
              <circle cx="9" cy="7.5" r="1.6" :fill="node.color" stroke="none" />
              <circle cx="9" cy="22.5" r="1.6" :fill="node.color" stroke="none" />
            </template>
            <template v-else-if="node.icon === 'service'">
              <path
                d="M 6 24 H 25 C 31 24, 31 15, 24 14 C 23 7, 12 5, 10 13 C 4 12, 1 20, 6 24 Z"
                fill="none"
              />
              <path d="M 11 17 H 22" stroke-linecap="round" />
            </template>
            <template v-else>
              <rect x="2" y="4" width="28" height="20" rx="4" fill="none" />
              <path d="M 11 30 H 21 M 16 24 V 30" stroke-linecap="round" />
            </template>
          </g>

          <text :x="node.x + 78" :y="node.y + 34" class="lifecycle-diagram__node-title">
            <tspan
              v-for="(line, index) in node.labelLines"
              :key="line"
              :x="node.x + 78"
              :dy="index === 0 ? 0 : 18"
            >
              {{ line }}
            </tspan>
          </text>
          <text :x="node.x + 78" :y="node.y + 59" class="lifecycle-diagram__node-detail">
            <tspan
              v-for="(line, index) in node.detailLines"
              :key="line"
              :x="node.x + 78"
              :dy="index === 0 ? 0 : 16"
            >
              {{ line }}
            </tspan>
          </text>
        </g>

        <g class="lifecycle-diagram__legend">
          <rect x="84" y="742" width="276" height="42" rx="14" fill="#FFFFFF" stroke="#D7E1ED" />
          <circle cx="106" cy="763" r="7" fill="#1597E5" />
          <text x="123" y="768">编号表示主流程顺序</text>
          <rect x="756" y="742" width="286" height="42" rx="14" fill="#FFFFFF" stroke="#D7E1ED" />
          <path d="M 778 763 H 824" class="lifecycle-diagram__link is-dashed" />
          <text x="840" y="768">虚线表示前端无法完整观测</text>
        </g>
      </svg>
    </div>
  </figure>
</template>

<style scoped>
.lifecycle-diagram {
  margin: 0;
  background: #fff;
}

.lifecycle-diagram__scroll {
  overflow: hidden;
  padding: 12px;
  background: #f7f9fd;
}

.lifecycle-diagram__canvas {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #d9e2ef;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.045);
}

.lifecycle-diagram__poster-title {
  fill: #111827;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: 0;
}

.lifecycle-diagram__poster-subtitle {
  fill: #607089;
  font-size: 13px;
  letter-spacing: 0;
}

.lifecycle-diagram__zone-title {
  fill: #34465d;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.lifecycle-diagram__link {
  fill: none;
  stroke: #243447;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.lifecycle-diagram__link.is-dashed {
  stroke-dasharray: 7 7;
}

.lifecycle-diagram__link-label rect {
  fill: #ffffff;
  stroke: #d4deeb;
}

.lifecycle-diagram__link-label text {
  fill: #475569;
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
}

.lifecycle-diagram__icon {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.lifecycle-diagram__node-title {
  fill: #102033;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0;
}

.lifecycle-diagram__node-detail {
  fill: #53657d;
  font-size: 12px;
  letter-spacing: 0;
}

.lifecycle-diagram__step {
  fill: #ffffff;
  font-size: 11px;
  font-weight: 800;
  text-anchor: middle;
}

.lifecycle-diagram__legend text {
  fill: #53657d;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 640px) {
  .lifecycle-diagram__scroll {
    padding: 12px;
  }
}
</style>
