import { defineConfig } from "vite";
import { mockDevServerPlugin } from "vite-plugin-mock-dev-server";

export default defineConfig({
  // 练习运行环境：让 mock/ 中声明的接口挂载到本地 Vite 服务。
  plugins: [
    mockDevServerPlugin({
      prefix: ["/api"],
      dir: "mock",
    }),
  ],
});
