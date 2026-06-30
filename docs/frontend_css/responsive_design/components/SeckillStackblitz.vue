<script setup lang="ts">
import { ref } from "vue";

// 读取 examples/seckill-vant/files 真实源码（与左侧 CodeLab 同一套，不手抄走样）。
// 排除 node_modules 与 lock：只把项目源文件喂给 StackBlitz。
const rawFiles = import.meta.glob(
  [
    "../../examples/seckill-vant/files/**/*.{html,json,js,ts,vue,css}",
    "!../../examples/seckill-vant/files/node_modules/**",
    "!../../examples/seckill-vant/files/package-lock.json",
  ],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

// 转成 StackBlitz 需要的相对路径 map：去掉 ".../files/" 前缀
const files: Record<string, string> = {};
for (const [key, content] of Object.entries(rawFiles)) {
  files[key.split("/files/").pop() as string] = content;
}

const opening = ref(false);

// 点击在新标签打开完整可运行的 StackBlitz：其自身页面已跨域隔离，WebContainer 可跑。
// 不在文档页内嵌运行，故本站无需 COOP/COEP，不影响其它跨域资源（如 Google Ads）。
async function openInStackBlitz() {
  opening.value = true;
  try {
    const sdk = (await import("@stackblitz/sdk")).default;
    sdk.openProject(
      {
        title: "seckill-vant",
        description: "Vant + postcss 双基准 px→vw 活动页",
        template: "node",
        files,
      },
      { newWindow: true, openFile: "src/components/SeckillCard.vue" },
    );
  } finally {
    opening.value = false;
  }
}
</script>

<template>
  <div class="seckill-stackblitz">
    <div class="seckill-stackblitz__text">
      <strong>在 StackBlitz 云端运行这套源码</strong>
      <span>
        新标签打开，真实 <code>npm install</code> + <code>vite dev</code>，改代码即时看双基准 px→vw
        效果
      </span>
    </div>
    <button
      type="button"
      class="seckill-stackblitz__btn"
      :disabled="opening"
      @click="openInStackBlitz"
    >
      {{ opening ? "正在打开…" : "在 StackBlitz 打开 ↗" }}
    </button>
  </div>
</template>

<style scoped>
.seckill-stackblitz {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin: 16px 0;
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
.seckill-stackblitz__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.seckill-stackblitz__text strong {
  font-size: 15px;
  color: var(--vp-c-text-1);
}
.seckill-stackblitz__text span {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.seckill-stackblitz__btn {
  flex: 0 0 auto;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: var(--vp-c-brand-1, #3451b2);
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.seckill-stackblitz__btn:hover {
  opacity: 0.85;
}
.seckill-stackblitz__btn:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
