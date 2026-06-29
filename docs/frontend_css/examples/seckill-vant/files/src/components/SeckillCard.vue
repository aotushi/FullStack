<!-- SeckillCard.vue —— 组件库(Vant) + vw 手写：全程按 750 设计稿写 px，postcss 自动转 vw -->
<script setup lang="ts">
import { ref } from "vue";

const time = ref(2 * 60 * 60 * 1000); // 倒计时 2 小时（毫秒）
const goods = ref([
  {
    id: 1,
    name: "夏日清凉冰萃咖啡 600ml",
    price: "9.9",
    origin: "19.9",
    thumb: "linear-gradient(135deg, #ffd54f, #ff9500)",
  },
  {
    id: 2,
    name: "手冲挂耳礼盒 10 片装",
    price: "39",
    origin: "69",
    thumb: "linear-gradient(135deg, #a1887f, #5d4037)",
  },
]);
</script>

<template>
  <div class="seckill">
    <!-- 主视觉横幅 -->
    <div class="seckill__banner">限时秒杀</div>

    <!-- Vant 倒计时组件，用插槽自定义成深色色块 -->
    <van-count-down :time="time" class="seckill__timer">
      <template #default="t">
        <span class="seckill__seg">{{ String(t.hours).padStart(2, "0") }}</span>
        <i>:</i>
        <span class="seckill__seg">{{ String(t.minutes).padStart(2, "0") }}</span>
        <i>:</i>
        <span class="seckill__seg">{{ String(t.seconds).padStart(2, "0") }}</span>
      </template>
    </van-count-down>

    <!-- 业务卡片手写，按钮复用 Vant -->
    <div v-for="g in goods" :key="g.id" class="seckill__card">
      <div class="seckill__thumb" :style="{ background: g.thumb }"></div>
      <div class="seckill__info">
        <p class="seckill__name">{{ g.name }}</p>
        <p class="seckill__price">
          ¥<b>{{ g.price }}</b
          ><s>¥{{ g.origin }}</s>
        </p>
      </div>
      <van-button class="seckill__btn" type="danger" round>立即抢</van-button>
    </div>
  </div>
</template>

<style scoped>
/* 全程按 750 设计稿标 px，postcss-px-to-viewport 构建时自动转成 vw */
.seckill {
  padding-bottom: 24px;
  background: #fff5f0;
}
.seckill__banner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 130px;
  font-size: 58px;
  font-weight: 800;
  letter-spacing: 10px;
  color: #fff;
  background: linear-gradient(135deg, #ff3b30, #ff9500);
}
.seckill__timer {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  font-size: 44px;
  font-weight: 700;
  color: #ff3b30;
}
.seckill__seg {
  padding: 6px 16px;
  color: #fff;
  background: #1a1a1a;
  border-radius: 8px;
}
.seckill__card {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 22px 24px;
  padding: 22px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.seckill__thumb {
  flex: none;
  width: 140px;
  height: 140px;
  border-radius: 14px;
}
.seckill__info {
  flex: 1;
}
.seckill__name {
  margin: 0 0 14px;
  font-size: 30px;
  color: #222;
}
.seckill__price {
  margin: 0;
  font-size: 28px;
  color: #ff3b30;
}
.seckill__price b {
  font-size: 50px;
}
.seckill__price s {
  margin-left: 10px;
  font-size: 26px;
  color: #999;
}
.seckill__btn {
  flex: none;
  height: 72px;
  padding: 0 30px;
  font-size: 30px;
}
</style>
