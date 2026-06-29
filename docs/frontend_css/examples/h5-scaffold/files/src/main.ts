import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";
import "./style.css";
// 注意：这里没有 import Vant —— 组件按需引入，由 unplugin-vue-components 自动处理

const app = createApp(App);
app.use(createPinia()); // 脚手架预置：Pinia 状态管理
app.use(router); // 脚手架预置：vue-router 路由

// 脚手架预置：移动端调试面板，仅开发环境加载
if (import.meta.env.DEV) {
  import("vconsole").then(({ default: VConsole }) => new VConsole());
}

app.mount("#app");
