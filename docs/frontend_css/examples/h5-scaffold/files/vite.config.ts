import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    // 脚手架预置：按需自动引入用到的 Vant 组件及其样式
    // 页面里直接写 <van-button>，无需手动 import / 注册
    Components({ resolvers: [VantResolver()] }),
  ],
});
