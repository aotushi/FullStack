import { createApp } from "vue";
import Vant from "vant";
import "vant/lib/index.css";
import App from "./App.vue";
import "./style.css";

// 组件库整体注册（演示用）；生产可改按需引入以减小体积
createApp(App).use(Vant).mount("#app");
