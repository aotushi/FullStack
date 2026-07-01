<script setup lang="ts">
import { computed, shallowRef } from "vue";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "reka-ui";

interface ConceptLink {
  label: string;
  href: string;
}

interface ConceptSection {
  title: string;
  body?: string;
  items?: string[];
  code?: string;
  links?: ConceptLink[];
}

interface Props {
  title?: string;
  label?: string;
  description?: string;
  details?: string;
  sections?: ConceptSection[];
  tone?: "default" | "warning";
}

const props = withDefaults(defineProps<Props>(), {
  tone: "default",
});

const isOpen = shallowRef(false);
const triggerLabel = computed(() => props.label ?? props.title ?? "查看释义");
const panelTitle = computed(() => props.title ?? props.label ?? "概念释义");
</script>

<template>
  <span class="concept-note">
    <DialogRoot v-model:open="isOpen">
      <DialogTrigger as-child>
        <button
          class="concept-note__trigger"
          :class="`concept-note__trigger--${props.tone}`"
          type="button"
        >
          {{ triggerLabel }}
        </button>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay class="concept-note__overlay" />
        <DialogContent class="concept-note__panel" :class="`concept-note__panel--${props.tone}`">
          <header class="concept-note__header">
            <div class="concept-note__heading">
              <span class="concept-note__marker" aria-hidden="true" />
              <DialogTitle class="concept-note__title">
                {{ panelTitle }}
              </DialogTitle>
            </div>
            <DialogClose as-child>
              <button class="concept-note__close" type="button" aria-label="关闭释义">×</button>
            </DialogClose>
          </header>

          <DialogDescription v-if="props.description" class="concept-note__description">
            {{ props.description }}
          </DialogDescription>

          <div class="concept-note__body">
            <template v-if="props.sections?.length">
              <section
                v-for="section in props.sections"
                :key="section.title"
                class="concept-note__section"
              >
                <p class="concept-note__section-title">
                  <strong>{{ section.title }}</strong>
                </p>
                <p v-if="section.body">{{ section.body }}</p>
                <ul v-if="section.items?.length">
                  <li v-for="item in section.items" :key="item">{{ item }}</li>
                </ul>
                <pre v-if="section.code"><code>{{ section.code }}</code></pre>
                <ul v-if="section.links?.length" class="concept-note__links">
                  <li v-for="link in section.links" :key="link.href">
                    <a :href="link.href" target="_blank" rel="noreferrer noopener">{{
                      link.label
                    }}</a>
                  </li>
                </ul>
              </section>
            </template>
            <p v-else-if="props.details">{{ props.details }}</p>
            <slot v-else />
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </span>
</template>

<style scoped>
.concept-note {
  display: inline;
}

.concept-note__trigger {
  display: inline;
  margin: 0;
  padding: 1px 3px;
  border: 0;
  border-radius: 3px;
  background: rgba(31, 118, 111, 0.1);
  color: var(--vp-c-text-1);
  font: inherit;
  line-height: inherit;
  text-align: inherit;
  text-decoration-line: underline;
  text-decoration-style: dotted;
  text-decoration-color: #1f766f;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  cursor: pointer;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.concept-note__trigger:hover {
  background: rgba(31, 118, 111, 0.18);
  color: #1f766f;
}

.concept-note__trigger:focus-visible {
  outline: 2px solid #2f8f86;
  outline-offset: 2px;
}

.concept-note__trigger--warning {
  background: color-mix(in srgb, #ea580c 12%, transparent);
  text-decoration-color: #c2410c;
}

.concept-note__overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.3);
}

.concept-note__panel {
  position: fixed;
  top: 72px;
  right: 24px;
  bottom: 24px;
  z-index: 1001;
  width: min(560px, calc(100vw - 48px));
  overflow: auto;
  padding: 20px;
  border: 1px solid rgba(31, 118, 111, 0.26);
  border-radius: 8px;
  background: linear-gradient(rgba(31, 118, 111, 0.08) 1px, transparent 1px), var(--vp-c-bg);
  background-size: 100% 28px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
}

.concept-note__panel--warning {
  border-color: rgba(181, 103, 13, 0.32);
  background: linear-gradient(rgba(181, 103, 13, 0.1) 1px, transparent 1px), var(--vp-c-bg);
  background-size: 100% 28px;
}

.concept-note__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.concept-note__heading {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.concept-note__marker {
  width: 10px;
  height: 10px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: #1f766f;
  box-shadow: 0 0 0 4px rgba(31, 118, 111, 0.14);
}

.concept-note__title {
  min-width: 0;
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.45;
}

.concept-note__close {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.concept-note__close:hover {
  color: var(--vp-c-text-1);
  border-color: #2f8f86;
}

.concept-note__description,
.concept-note__body {
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.8;
}

.concept-note__description {
  margin: 10px 0 14px;
}

.concept-note__body :deep(p) {
  margin: 10px 0;
}

.concept-note__body :deep(p:first-child) {
  margin-top: 0;
}

.concept-note__body :deep(p:last-child) {
  margin-bottom: 0;
}

.concept-note__body :deep(strong) {
  color: #1f766f;
}

.concept-note__body :deep(a),
.concept-note__links a {
  color: #1f766f;
  font-weight: 500;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.concept-note__body :deep(a:hover),
.concept-note__links a:hover {
  color: #2f8f86;
}

.concept-note__section {
  margin: 14px 0;
}

.concept-note__section:first-child {
  margin-top: 0;
}

.concept-note__section:last-child {
  margin-bottom: 0;
}

.concept-note__section-title {
  margin: 0 0 4px;
}

.concept-note__body :deep(ul),
.concept-note__body ul {
  margin: 8px 0 0;
  padding-left: 20px;
}

.concept-note__body :deep(li + li),
.concept-note__body li + li {
  margin-top: 4px;
}

.concept-note__body :deep(pre),
.concept-note__body pre {
  overflow: auto;
  margin: 8px 0 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: var(--vp-code-block-bg);
  line-height: 1.65;
}

.concept-note__body :deep(pre code),
.concept-note__body pre code {
  padding: 0;
  background: transparent;
  font-size: 0.92em;
}

.concept-note__body :deep(:not(pre) > code),
.concept-note__body :not(pre) > code {
  padding: 1px 4px;
  border-radius: 4px;
  background: var(--vp-code-bg);
  font-size: 0.92em;
}

.concept-note__body :deep(div[class*="language-"]) {
  margin: 8px 0 0;
  border-radius: 6px;
  background: var(--vp-code-block-bg);
}

.concept-note__body :deep(div[class*="language-"] pre) {
  margin: 0;
}

.concept-note__body :deep(div[class*="language-"] > span.lang) {
  top: 6px;
  right: 8px;
}

.concept-note__links {
  list-style: disc;
}

@media (max-width: 768px) {
  .concept-note__overlay {
    background: rgba(15, 23, 42, 0.38);
  }

  .concept-note__panel {
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    width: auto;
    max-height: min(78vh, 680px);
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius: 12px 12px 0 0;
  }
}
</style>
