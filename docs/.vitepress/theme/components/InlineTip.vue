<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    text: string;
    side?: "top" | "bottom";
  }>(),
  {
    side: "top",
  },
);
</script>

<template>
  <span :class="['inline-tip-wrapper', `inline-tip-wrapper--${side}`]">
    <button class="inline-tip" type="button">
      {{ label }}
    </button>
    <span class="inline-tip-content" role="tooltip">
      {{ text }}
    </span>
  </span>
</template>

<style scoped>
.inline-tip-wrapper {
  position: relative;
  display: inline-flex;
  vertical-align: baseline;
}

.inline-tip {
  display: inline-flex;
  align-items: center;
  min-height: 1.45em;
  padding: 0 0.28em;
  border: 1px solid rgba(31, 118, 111, 0.34);
  border-radius: 5px;
  margin: 0 0.04em;
  background: rgba(31, 118, 111, 0.08);
  color: #1f766f;
  font: inherit;
  font-weight: 650;
  line-height: 1.1;
  cursor: help;
}

.inline-tip:hover,
.inline-tip:focus-visible {
  border-color: rgba(31, 118, 111, 0.64);
  background: rgba(31, 118, 111, 0.14);
}

.inline-tip:focus-visible {
  outline: 2px solid rgba(31, 118, 111, 0.3);
  outline-offset: 2px;
}

.inline-tip-content {
  position: absolute;
  left: 50%;
  z-index: 1200;
  width: max-content;
  max-width: min(320px, calc(100vw - 32px));
  border: 1px solid rgba(31, 118, 111, 0.18);
  border-radius: 8px;
  background: var(--vp-c-bg);
  box-shadow:
    0 16px 36px rgba(0, 0, 0, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.08);
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.65;
  opacity: 0;
  padding: 10px 12px;
  pointer-events: none;
  text-align: left;
  transform: translateX(-50%) translateY(4px);
  transition:
    opacity 0.14s ease,
    transform 0.14s ease;
  visibility: hidden;
  white-space: normal;
}

.inline-tip-content::before {
  position: absolute;
  left: 50%;
  width: 10px;
  height: 10px;
  border: inherit;
  background: inherit;
  content: "";
  transform: translateX(-50%) rotate(45deg);
}

.inline-tip-wrapper--top .inline-tip-content {
  bottom: calc(100% + 9px);
}

.inline-tip-wrapper--top .inline-tip-content::before {
  bottom: -6px;
  border-top: 0;
  border-left: 0;
}

.inline-tip-wrapper--bottom .inline-tip-content {
  top: calc(100% + 9px);
}

.inline-tip-wrapper--bottom .inline-tip-content::before {
  top: -6px;
  border-right: 0;
  border-bottom: 0;
}

.inline-tip-wrapper:hover .inline-tip-content,
.inline-tip-wrapper:focus-within .inline-tip-content {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  visibility: visible;
}
</style>
