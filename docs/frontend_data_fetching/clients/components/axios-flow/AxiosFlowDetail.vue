<script setup lang="ts">
import type { FlowNode } from "./axios-flow-data";

const { node } = defineProps<{
  node: FlowNode;
}>();
</script>

<template>
  <aside class="detail" aria-live="polite">
    <div class="detail__heading">
      <span class="detail__module">{{ node.module }}</span>
      <h3>{{ node.title }}</h3>
      <p>{{ node.responsibility }}</p>
    </div>

    <dl class="detail__io">
      <div>
        <dt>拿到什么</dt>
        <dd>{{ node.input }}</dd>
      </div>
      <div>
        <dt>交出什么</dt>
        <dd>{{ node.output }}</dd>
      </div>
    </dl>

    <div class="detail__watch">
      <span aria-hidden="true">!</span>
      <p><strong>阅读提醒</strong>{{ node.watch }}</p>
    </div>
  </aside>
</template>

<style scoped>
.detail {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
  gap: 18px 28px;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg);
}

.detail__heading h3 {
  margin: 5px 0 7px;
  border: 0;
  font-size: 18px;
  line-height: 1.35;
}

.detail__heading p,
.detail__watch p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.detail__module {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 700;
}

.detail__io {
  display: grid;
  gap: 12px;
  margin: 0;
}

.detail__io div {
  padding-left: 12px;
  border-left: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 35%, var(--vp-c-divider));
}

.detail__io dt {
  margin-bottom: 2px;
  color: var(--vp-c-text-3);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.08em;
}

.detail__io dd {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 12px;
  line-height: 1.55;
}

.detail__watch {
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px dashed var(--vp-c-divider);
}

.detail__watch > span {
  display: grid;
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--vp-c-warning-1) 18%, transparent);
  color: var(--vp-c-warning-1);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 800;
}

.detail__watch strong {
  margin-right: 8px;
  color: var(--vp-c-text-1);
}

@media (max-width: 760px) {
  .detail {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .detail__watch {
    grid-column: auto;
  }
}
</style>
