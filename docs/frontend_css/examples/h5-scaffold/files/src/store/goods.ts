import { defineStore } from "pinia";
import { ref } from "vue";

// 脚手架预置 Pinia，业务状态集中管理（这里用静态数据示意，真实项目从接口拉取）
export const useGoodsStore = defineStore("goods", () => {
  const list = ref([
    {
      id: 1,
      name: "夏日清凉冰萃咖啡 600ml",
      price: "9.9",
      sales: 2300,
      thumb: "linear-gradient(135deg, #ffd54f, #ff9500)",
    },
    {
      id: 2,
      name: "手冲挂耳礼盒 10 片装",
      price: "39",
      sales: 860,
      thumb: "linear-gradient(135deg, #a1887f, #5d4037)",
    },
    {
      id: 3,
      name: "陶瓷手冲分享壶 600ml",
      price: "59",
      sales: 412,
      thumb: "linear-gradient(135deg, #80deea, #00838f)",
    },
  ]);
  return { list };
});
