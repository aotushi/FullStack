import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const isCi =
  process.env.CI === "true" || process.env.WORKERS_CI === "1" || process.env.CF_PAGES === "1";

if (isCi) {
  console.log("[prepare] Skip Git hooks setup in CI.");
  process.exit(0);
}

const command =
  process.platform === "win32"
    ? join("node_modules", ".bin", "vp.cmd")
    : join("node_modules", ".bin", "vp");

if (!existsSync(command)) {
  console.log("[prepare] Skip Git hooks setup because vite-plus is not installed.");
  process.exit(0);
}

const result = spawnSync(command, ["config", "--hooks-dir", ".vite-hooks", "--no-agent"], {
  shell: process.platform === "win32",
  stdio: "inherit",
});

process.exit(result.status ?? 1);
