/**
 * MISSIONWELL AI — Unified Tri-Service Local Runner
 * Starts and orchestrates:
 * 1. Python ML Microservice (Port 8000)
 * 2. Node.js Express REST API (Port 5000)
 * 3. Next.js Web Frontend (Port 3000)
 */

const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

const ROOT_DIR = __dirname;
const isWin = process.platform === "win32";

const fs = require("fs");
const hasAiEngine = fs.existsSync(path.join(ROOT_DIR, "ai-engine", "main.py"));
const mlDir = hasAiEngine ? "ai-engine" : "ml-service";
const mlScript = hasAiEngine ? "main.py" : "server.py";

const SERVICES = [
  {
    name: "ML-ENGINE",
    color: "\x1b[35m", // Magenta
    port: 8000,
    checkPath: "/health",
    cmd: "python",
    args: [mlScript],
    cwd: path.join(ROOT_DIR, mlDir),
  },
  {
    name: "BACKEND",
    color: "\x1b[36m", // Cyan
    port: 5000,
    checkPath: "/health",
    cmd: isWin ? "cmd.exe" : "npm",
    args: isWin ? ["/c", "npm", "run", "dev"] : ["run", "dev"],
    cwd: path.join(ROOT_DIR, "backend"),
  },
  {
    name: "FRONTEND",
    color: "\x1b[32m", // Green
    port: 3000,
    checkPath: "/",
    cmd: isWin ? "cmd.exe" : "npm",
    args: isWin ? ["/c", "npm", "run", "dev"] : ["run", "dev"],
    cwd: path.join(ROOT_DIR, "frontend"),
  },
];

const children = [];

function checkPort(port, checkPath) {
  return new Promise((resolve) => {
    const req = http.get({ host: "127.0.0.1", port, path: checkPath, timeout: 1500 }, (res) => {
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

function log(prefix, color, message) {
  const reset = "\x1b[0m";
  const lines = message.toString().split("\n");
  for (const line of lines) {
    if (line.trim()) {
      console.log(`${color}[${prefix}]${reset} ${line}`);
    }
  }
}

async function startAll() {
  console.log("\n=================================================================");
  console.log(" MISSIONWELL AI — UNIFIED SYSTEM ORCHESTRATOR");
  console.log(" Organization: Ministry of Home Affairs / CRPF, Police II Div");
  console.log("=================================================================\n");

  for (const s of SERVICES) {
    const isRunning = await checkPort(s.port, s.checkPath);
    if (isRunning) {
      console.log(`\x1b[33m[INFO]\x1b[0m ${s.name} is ALREADY RUNNING on http://localhost:${s.port}`);
      continue;
    }

    console.log(`\x1b[34m[LAUNCH]\x1b[0m Starting ${s.name} on http://localhost:${s.port}...`);
    const child = spawn(s.cmd, s.args, {
      cwd: s.cwd,
      shell: false,
      env: { ...process.env },
    });

    child.stdout.on("data", (data) => log(s.name, s.color, data));
    child.stderr.on("data", (data) => log(s.name, s.color, data));

    child.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        console.log(`\x1b[31m[EXIT]\x1b[0m ${s.name} process exited with code ${code}`);
      }
    });

    children.push(child);
  }

  console.log("\n=================================================================");
  console.log(" ALL SERVICES ONLINE & INTEGRATED");
  console.log(" Frontend Portal : http://localhost:3000");
  console.log(" Backend API     : http://localhost:5000");
  console.log(" ML Inference    : http://localhost:8000");
  console.log(" Sign-In Page    : http://localhost:3000/login");
  console.log("=================================================================\n");
}

function cleanup() {
  console.log("\n[SHUTDOWN] Stopping all managed sub-services...");
  for (const child of children) {
    try {
      if (isWin) {
        spawn("taskkill", ["/pid", child.pid, "/f", "/t"]);
      } else {
        child.kill("SIGTERM");
      }
    } catch {
      // Ignored
    }
  }
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

startAll();
