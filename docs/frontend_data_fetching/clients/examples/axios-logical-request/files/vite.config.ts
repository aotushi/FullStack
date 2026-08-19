import { defineConfig } from "vite";
import { mockDevServerPlugin } from "vite-plugin-mock-dev-server";

export default defineConfig({
  plugins: [
    mockDevServerPlugin({
      prefix: ["/api"],
      dir: "mock",
    }),
  ],
});
