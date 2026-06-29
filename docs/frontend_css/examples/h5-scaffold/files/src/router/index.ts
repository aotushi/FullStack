import { createRouter, createWebHashHistory } from "vue-router";

// 脚手架预置：H5 常用 hash 路由，免服务端额外配置
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: "/", name: "goods", component: () => import("../views/GoodsList.vue") }],
});
