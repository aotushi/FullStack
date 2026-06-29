<!-- GoodsList.vue —— 业务页：直接写 <van-xxx>，按需引入由脚手架自动接管 -->
<script setup lang="ts">
import { useGoodsStore } from "../store/goods";

const goods = useGoodsStore();
</script>

<template>
  <div class="list">
    <div class="list__bar">
      <span class="list__title">人气好物</span>
      <!-- 没有 import van-tag / van-button，按需引入插件自动补全 -->
      <van-tag type="danger" round>热销榜</van-tag>
    </div>

    <div v-for="g in goods.list" :key="g.id" class="list__card">
      <div class="list__thumb" :style="{ background: g.thumb }"></div>
      <div class="list__info">
        <p class="list__name">{{ g.name }}</p>
        <p class="list__sales">已售 {{ g.sales }}</p>
      </div>
      <div class="list__right">
        <span class="list__price"
          >¥<b>{{ g.price }}</b></span
        >
        <van-button type="danger" size="small" round>购买</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全程按 750 设计稿标 px，postcss 构建时自动转 vw（脚手架预置） */
.list {
  padding: 24px;
  min-height: 100vh;
  background: #f7f8fa;
}
.list__bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.list__title {
  font-size: 40px;
  font-weight: 800;
  color: #222;
}
.list__card {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 22px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.list__thumb {
  flex: none;
  width: 140px;
  height: 140px;
  border-radius: 14px;
}
.list__info {
  flex: 1;
}
.list__name {
  margin: 0 0 12px;
  font-size: 30px;
  color: #222;
}
.list__sales {
  margin: 0;
  font-size: 24px;
  color: #999;
}
.list__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}
.list__price {
  font-size: 28px;
  color: #ff3b30;
}
.list__price b {
  font-size: 46px;
}
</style>
