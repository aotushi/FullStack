import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

function readOption(names, fallback) {
  for (let index = 0; index < process.argv.length; index += 1) {
    if (names.includes(process.argv[index])) {
      const value = Number(process.argv[index + 1]);
      if (Number.isFinite(value)) return value;
    }
  }
  return fallback;
}

function hasFlag(names) {
  return process.argv.some((arg) => names.includes(arg));
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once("error", () => resolve(false));
    probe.once("listening", () => {
      probe.close(() => resolve(true));
    });
    probe.listen(port, "127.0.0.1");
  });
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + 50; port += 1) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available port found from ${startPort}.`);
}

const docsPort = await findAvailablePort(
  readOption(["--port", "--docs-port"], Number(process.env.DOCS_PORT || 5180)),
);
const labsPort = await findAvailablePort(
  readOption(["--labs-port"], Number(process.env.LABS_PORT || 4180)),
);
const labsPreviewPort = readOption(
  ["--labs-preview-port"],
  Number(process.env.LABS_PREVIEW_PORT || 5190),
);
const workerEnabled = !hasFlag(["--no-worker"]) && process.env.WORKER_DEV !== "0";
const workerPort = workerEnabled
  ? await findAvailablePort(readOption(["--worker-port"], Number(process.env.WORKER_PORT || 8787)))
  : null;

if (workerEnabled && !existsSync(path.join(root, "docs", ".vitepress", "dist", "index.html"))) {
  process.stdout.write("[dev] Building static assets for local Worker dev...\n");
  const build = spawnSync("npm", ["run", "docs:build"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (build.status !== 0) {
    process.exit(build.status ?? 1);
  }
}

const sharedEnv = {
  ...process.env,
  DOCS_PORT: String(docsPort),
  LABS_PORT: String(labsPort),
  LABS_PREVIEW_PORT: String(labsPreviewPort),
  VITE_LABS_PORT: String(labsPort),
  ...(workerPort
    ? {
        WORKER_PORT: String(workerPort),
        VITE_WORKER_PORT: String(workerPort),
        VITE_WORKER_API_BASE: `http://127.0.0.1:${workerPort}`,
      }
    : {}),
};

const processes = [
  {
    name: "docs",
    command: process.execPath,
    args: [
      path.join(root, "node_modules", "vitepress", "bin", "vitepress.js"),
      "dev",
      "docs",
      "--host",
      "127.0.0.1",
      "--port",
      String(docsPort),
    ],
  },
  {
    name: "labs",
    command: process.execPath,
    args: [path.join(root, "scripts", "lab-server.mjs")],
  },
  ...(workerPort
    ? [
        {
          name: "worker",
          command: process.execPath,
          args: [
            path.join(root, "node_modules", "wrangler", "bin", "wrangler.js"),
            "dev",
            "--ip",
            "127.0.0.1",
            "--port",
            String(workerPort),
            "--show-interactive-dev-session=false",
          ],
        },
      ]
    : []),
];

const children = new Map();
let shuttingDown = false;

function prefixLines(name, chunk, stream) {
  const text = chunk.toString();
  for (const line of text.split(/\r?\n/)) {
    if (line.length > 0) {
      stream.write(`[${name}] ${line}\n`);
    }
  }
}

function stopChild(child) {
  if (!child.pid || child.killed) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
    return;
  }

  child.kill("SIGTERM");
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children.values()) {
    stopChild(child);
  }

  process.exit(code);
}

for (const item of processes) {
  const child = spawn(item.command, item.args, {
    cwd: root,
    env: sharedEnv,
    stdio: ["ignore", "pipe", "pipe"],
  });

  children.set(item.name, child);

  child.stdout.on("data", (chunk) => prefixLines(item.name, chunk, process.stdout));
  child.stderr.on("data", (chunk) => prefixLines(item.name, chunk, process.stderr));

  child.on("exit", (code, signal) => {
    children.delete(item.name);
    if (!shuttingDown) {
      const reason = signal ? `signal ${signal}` : `code ${code ?? 0}`;
      process.stderr.write(`[dev] ${item.name} exited with ${reason}; stopping dev services.\n`);
      shutdown(code ?? 1);
    }
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
process.on("uncaughtException", (error) => {
  process.stderr.write(`[dev] ${error.stack || error.message}\n`);
  shutdown(1);
});
