<script setup>
import { ref, computed } from "vue";

// page: seckill(方案一手写) | list(方案二脚手架) | poster(方案三搭建)
const props = defineProps({
  page: { type: String, default: "seckill" },
});

const DESIGN_W = 750; // 设计稿宽
const HEIGHTS = { seckill: 720, list: 980, poster: 1334 }; // 各页设计稿高
const presets = [
  { w: 320, label: "SE" },
  { w: 375, label: "iPhone" },
  { w: 390, label: "13" },
  { w: 414, label: "Plus" },
];

const vpW = ref(390); // 模拟视口宽
const scale = computed(() => vpW.value / DESIGN_W);
const vwPerPx = computed(() => (100 / vpW.value).toFixed(3));
const pageH = computed(() => HEIGHTS[props.page] ?? 720);
const phoneH = computed(() => Math.round(pageH.value * scale.value));
</script>

<template>
  <div class="vd">
    <div class="vd__bar">
      <span class="vd__cap">模拟视口</span>
      <input
        class="vd__range"
        type="range"
        min="300"
        max="430"
        step="1"
        v-model.number="vpW"
        aria-label="模拟视口宽度"
      />
      <strong class="vd__val">{{ vpW }}px</strong>
      <button
        v-for="p in presets"
        :key="p.w"
        class="vd__chip"
        :class="{ 'vd__chip--on': vpW === p.w }"
        @click="vpW = p.w"
      >
        {{ p.label }}
      </button>
    </div>

    <p class="vd__hint">
      此刻 <code>1px ≈ {{ vwPerPx }}vw</code>（750 设计稿）。拖动滑块换手机宽度，整页
      <b>等比缩放、布局不变</b>——这就是纯 <code>vw</code> 的效果。演示把 750 设计稿按屏宽
      <code>transform: scale</code> 还原，视觉等价于 <code>vw</code>。
    </p>

    <div class="vd__stage">
      <div class="vd__phone" :style="{ width: vpW + 'px', height: phoneH + 'px' }">
        <div class="vd__paper" :style="{ transform: `scale(${scale})`, height: pageH + 'px' }">
          <!-- 方案一：组件库手写的秒杀页 -->
          <div v-if="page === 'seckill'" class="pg pg--sk">
            <div class="sk__banner">限时秒杀</div>
            <div class="sk__timer"><span>02</span>:<span>14</span>:<span>08</span></div>
            <div class="sk__card">
              <div class="sk__thumb"></div>
              <div class="sk__info">
                <p class="sk__name">夏日清凉冰萃咖啡 600ml</p>
                <p class="sk__price">¥<b>9.9</b><s>¥19.9</s></p>
              </div>
              <button class="sk__btn">立即抢</button>
            </div>
            <div class="sk__card">
              <div class="sk__thumb sk__thumb--2"></div>
              <div class="sk__info">
                <p class="sk__name">手冲挂耳礼盒 10 片装</p>
                <p class="sk__price">¥<b>39</b><s>¥69</s></p>
              </div>
              <button class="sk__btn">立即抢</button>
            </div>
          </div>

          <!-- 方案二：脚手架风格的营销列表页 -->
          <div v-else-if="page === 'list'" class="pg pg--ls">
            <header class="ls__nav">新人专享 · 1 元购</header>
            <div class="ls__grid">
              <div class="ls__item" v-for="n in 4" :key="n">
                <div class="ls__thumb" :class="'ls__thumb--' + n"></div>
                <p class="ls__name">爆款好物 {{ n }}</p>
                <p class="ls__price">¥{{ n }}.00</p>
                <button class="ls__btn">立即领</button>
              </div>
            </div>
          </div>

          <!-- 方案三：可视化搭建产出的海报页 -->
          <div v-else class="pg pg--ps">
            <p class="ps__sub">D O U B L E 11</p>
            <h3 class="ps__title">5折</h3>
            <p class="ps__desc">全场五折起 · 今晚 8 点开抢</p>
            <button class="ps__btn">立即查看</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vd {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

/* 控制条 */
.vd__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.vd__cap {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.vd__range {
  flex: 1;
  min-width: 120px;
  accent-color: var(--vp-c-brand-1);
}
.vd__val {
  font-variant-numeric: tabular-nums;
  min-width: 52px;
  text-align: right;
  color: var(--vp-c-brand-1);
}
.vd__chip {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.vd__chip--on {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}
.vd__hint {
  margin: 0;
  padding: 10px 16px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

/* 舞台与手机外壳 */
.vd__stage {
  display: flex;
  justify-content: center;
  padding: 24px 16px;
  background: repeating-linear-gradient(
    45deg,
    var(--vp-c-bg-soft),
    var(--vp-c-bg-soft) 10px,
    var(--vp-c-bg) 10px,
    var(--vp-c-bg) 20px
  );
}
.vd__phone {
  position: relative;
  flex: none;
  border: 6px solid #1a1a1a;
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  transition:
    width 0.12s ease,
    height 0.12s ease;

  box-sizing: content-box;
}
.vd__phone::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 34%;
  height: 14px;
  background: #1a1a1a;
  border-radius: 0 0 10px 10px;
  z-index: 2;
}
.vd__paper {
  width: 750px;
  transform-origin: top left;
}

/* 页面通用 */
.pg {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-family: -apple-system, "PingFang SC", sans-serif;
}

/* 方案一：秒杀（红橙系） */
.pg--sk {
  background: #fff5f0;
}
.sk__banner {
  height: 130px;
  background: linear-gradient(135deg, #ff3b30, #ff9500);
  color: #fff;
  font-size: 58px;
  font-weight: 800;
  letter-spacing: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sk__timer {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  font-size: 44px;
  font-weight: 700;
  color: #ff3b30;
}
.sk__timer span {
  background: #1a1a1a;
  color: #fff;
  padding: 6px 16px;
  border-radius: 8px;
}
.sk__card {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 22px 24px;
  padding: 22px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.sk__thumb {
  flex: none;
  width: 140px;
  height: 140px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ffd54f, #ff9500);
}
.sk__thumb--2 {
  background: linear-gradient(135deg, #a1887f, #5d4037);
}
.sk__info {
  flex: 1;
}
.sk__name {
  margin: 0 0 14px;
  font-size: 30px;
  color: #222;
}
.sk__price {
  margin: 0;
  font-size: 28px;
  color: #ff3b30;
}
.sk__price b {
  font-size: 50px;
}
.sk__price s {
  margin-left: 10px;
  color: #999;
  font-size: 26px;
}
.sk__btn {
  flex: none;
  border: none;
  border-radius: 40px;
  padding: 18px 30px;
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #ff3b30, #ff6b00);
}

/* 方案二：列表（蓝紫系） */
.pg--ls {
  background: #eef4ff;
}
.ls__nav {
  height: 100px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #0a84ff, #5e5ce6);
}
.ls__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  padding: 26px;
}
.ls__item {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}
.ls__thumb {
  height: 190px;
  background: linear-gradient(135deg, #64d2ff, #0a84ff);
}
.ls__thumb--2 {
  background: linear-gradient(135deg, #5e5ce6, #bf5af2);
}
.ls__thumb--3 {
  background: linear-gradient(135deg, #30d158, #0a84ff);
}
.ls__thumb--4 {
  background: linear-gradient(135deg, #ff9f0a, #ff375f);
}
.ls__name {
  margin: 16px 18px 6px;
  font-size: 28px;
  color: #222;
}
.ls__price {
  margin: 0 18px 14px;
  font-size: 36px;
  font-weight: 700;
  color: #0a84ff;
}
.ls__btn {
  display: block;
  width: calc(100% - 36px);
  margin: 0 18px 20px;
  border: none;
  border-radius: 30px;
  padding: 16px;
  font-size: 26px;
  color: #fff;
  background: #0a84ff;
}

/* 方案三：海报（整屏渐变） */
.pg--ps {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
  text-align: center;
  color: #fff;
  background: linear-gradient(160deg, #5e5ce6, #ff2d55 85%);
}
.ps__sub {
  margin: 0;
  font-size: 38px;
  letter-spacing: 16px;
  opacity: 0.9;
}
.ps__title {
  margin: 0;
  font-size: 200px;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}
.ps__desc {
  margin: 0;
  font-size: 44px;
  opacity: 0.95;
}
.ps__btn {
  margin-top: 30px;
  border: none;
  border-radius: 60px;
  padding: 26px 70px;
  font-size: 42px;
  font-weight: 800;
  color: #ff2d55;
  background: #fff;
}
</style>
