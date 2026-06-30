import { createServer } from "node:http";
import net from "node:net";
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const docsRoot = path.resolve(root, "docs");
const legacyLabsRoot = path.join(docsRoot, "labs");
const apiPort = Number(process.env.LABS_PORT || 4180);
const previewBasePort = Number(process.env.LABS_PREVIEW_PORT || 5190);
const runningLabs = new Map();
const reservedPorts = new Set();

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  res.end(body);
}

function sendText(res, status, payload) {
  res.writeHead(status, {
    "content-type": "text/plain; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 5 * 1024 * 1024) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function getLabDir(labId) {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(labId)) {
    throw new Error("Invalid lab id.");
  }

  const candidates = [path.resolve(legacyLabsRoot, labId)];
  for (const entry of readdirSync(docsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    candidates.push(path.resolve(docsRoot, entry.name, "examples", labId));
  }

  const labDir = candidates.find((candidate) => existsSync(candidate));
  if (!labDir) {
    throw new Error(`Lab not found: ${labId}`);
  }

  if (!labDir.startsWith(docsRoot + path.sep)) {
    throw new Error("Lab path escapes docs directory.");
  }
  return labDir;
}

function getFilesDir(labId) {
  return path.join(getLabDir(labId), "files");
}

function resolveLabFile(labId, filePath) {
  if (!filePath || path.isAbsolute(filePath) || filePath.includes("..")) {
    throw new Error("Invalid file path.");
  }
  const filesDir = getFilesDir(labId);
  const resolved = path.resolve(filesDir, filePath);
  if (!resolved.startsWith(filesDir + path.sep) && resolved !== filesDir) {
    throw new Error("File path escapes lab directory.");
  }
  return resolved;
}

async function walkFiles(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = {};

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    if (
      entry.name === "package-lock.json" ||
      entry.name === "pnpm-lock.yaml" ||
      entry.name === "yarn.lock"
    )
      continue;
    const fullPath = path.join(dir, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      Object.assign(files, await walkFiles(fullPath, relativePath));
      continue;
    }

    const info = await stat(fullPath);
    if (info.size > 1024 * 1024) continue;
    files[relativePath] = await readFile(fullPath, "utf8");
  }

  return files;
}

function runCommand(command, args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      shell: process.platform === "win32",
      env: { ...process.env, FORCE_COLOR: "0" },
    });

    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.on("close", (code) => {
      resolve({ code, output });
    });
  });
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
    if (reservedPorts.has(port)) continue;
    // 同步预留:后续 await 期间其它并发 runLab 会跳过该端口,避免拿到同一个
    reservedPorts.add(port);
    if (await isPortAvailable(port)) return port;
    // 端口被外部进程占用,释放预留后继续探测下一个
    reservedPorts.delete(port);
  }
  throw new Error("No available preview port found.");
}

async function installLab(labId) {
  const cwd = getFilesDir(labId);
  if (!existsSync(path.join(cwd, "package.json"))) {
    throw new Error("This lab does not contain a package.json.");
  }
  return runCommand("npm", ["install"], cwd);
}

async function ensureLabDependencies(labId) {
  const cwd = getFilesDir(labId);
  if (existsSync(path.join(cwd, "node_modules"))) return;

  const result = await installLab(labId);
  if (result.code !== 0) {
    throw new Error(result.output || "Failed to install lab dependencies.");
  }
}

async function runLab(labId) {
  const cwd = getFilesDir(labId);
  if (!existsSync(path.join(cwd, "package.json"))) {
    throw new Error("This lab does not contain a package.json.");
  }

  const current = runningLabs.get(labId);
  if (current && !current.process.killed) {
    return current;
  }

  await ensureLabDependencies(labId);

  const port = await findAvailablePort(previewBasePort);
  const child = spawn(
    "npm",
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd,
      shell: process.platform === "win32",
      env: { ...process.env, FORCE_COLOR: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  const state = {
    process: child,
    port,
    url: `http://127.0.0.1:${port}/`,
    logs: "",
    startedAt: Date.now(),
  };

  child.stdout.on("data", (chunk) => {
    state.logs += chunk.toString();
    state.logs = state.logs.slice(-12000);
  });
  child.stderr.on("data", (chunk) => {
    state.logs += chunk.toString();
    state.logs = state.logs.slice(-12000);
  });
  child.on("exit", (code) => {
    state.exitCode = code;
    reservedPorts.delete(port);
  });

  runningLabs.set(labId, state);
  return state;
}

function stopLab(labId) {
  const current = runningLabs.get(labId);
  if (!current) return false;
  current.process.kill();
  reservedPorts.delete(current.port);
  runningLabs.delete(labId);
  return true;
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendText(res, 204, "");
    return;
  }

  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const parts = url.pathname.split("/").filter(Boolean);

    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, { ok: true, mode: "local-lab-server" });
      return;
    }

    if (parts[0] !== "api" || parts[1] !== "labs" || !parts[2]) {
      sendJson(res, 404, { error: "Not found." });
      return;
    }

    const labId = parts[2];
    getLabDir(labId);

    if (req.method === "GET" && parts.length === 3) {
      const manifestPath = path.join(getLabDir(labId), "manifest.json");
      sendJson(res, 200, JSON.parse(await readFile(manifestPath, "utf8")));
      return;
    }

    if (req.method === "GET" && parts[3] === "files") {
      sendJson(res, 200, { files: await walkFiles(getFilesDir(labId)) });
      return;
    }

    if (req.method === "PUT" && parts[3] === "files") {
      const body = JSON.parse(await readBody(req));
      const target = resolveLabFile(labId, body.path);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, String(body.content ?? ""), "utf8");
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && parts[3] === "install") {
      const result = await installLab(labId);
      sendJson(res, result.code === 0 ? 200 : 500, {
        ok: result.code === 0,
        code: result.code,
        output: result.output,
      });
      return;
    }

    if (req.method === "POST" && parts[3] === "run") {
      const state = await runLab(labId);
      sendJson(res, 200, { ok: true, url: state.url, port: state.port });
      return;
    }

    if (req.method === "POST" && parts[3] === "stop") {
      sendJson(res, 200, { ok: true, stopped: stopLab(labId) });
      return;
    }

    if (req.method === "GET" && parts[3] === "status") {
      const state = runningLabs.get(labId);
      sendJson(res, 200, {
        running: Boolean(state && state.exitCode === undefined),
        url: state?.url ?? null,
        logs: state?.logs ?? "",
        exitCode: state?.exitCode ?? null,
      });
      return;
    }

    sendJson(res, 404, { error: "Not found." });
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(apiPort, "127.0.0.1", () => {
  console.log(`Local lab server: http://127.0.0.1:${apiPort}`);
});

process.on("SIGINT", () => {
  for (const labId of runningLabs.keys()) {
    stopLab(labId);
  }
  server.close(() => process.exit(0));
});
