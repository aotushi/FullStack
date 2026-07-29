import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./browser-tests",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://localhost:5181",
    channel: "chrome",
    headless: true,
  },
  webServer: {
    command: "pnpm vite --host localhost --port 5181 --strictPort",
    url: "http://localhost:5181/browser/",
    reuseExistingServer: false,
  },
});
