import fs from "node:fs/promises";
import fsSync from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const repo = "bluenviron/mediamtx";

export class MediaMtxManager {
  [key: string]: any;
  constructor(options) {
    this.options = options;
    this.process = null;
    this.stopping = false;
    this.retryTimer = null;
    this.retryAttempt = 0;
  }

  async start() {
    if (!this.options.autoStart) {
      return { started: false, reason: "disabled" };
    }

    clearTimeout(this.retryTimer);
    this.stopping = false;
    const command = await this.resolveCommand();
    await this.writeConfig();

    this.process = spawn(command.command, [...command.args, this.options.configPath], {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env
    });

    this.process.stdout.on("data", (chunk) => process.stdout.write(`[mediamtx] ${chunk}`));
    this.process.stderr.on("data", (chunk) => process.stderr.write(`[mediamtx] ${chunk}`));
    this.process.on("exit", (code, signal) => {
      this.process = null;
      if (code !== 0 && signal !== "SIGTERM") {
        console.error(`MediaMTX exited with code=${code} signal=${signal}`);
      }
      if (!this.stopping && this.options.autoStart) {
        this.retryAttempt += 1;
        const delay = Math.min(30000, 1000 * 2 ** Math.min(this.retryAttempt - 1, 5));
        this.retryTimer = setTimeout(() => this.start().catch((error) => console.error("MediaMTX restart failed", error)), delay);
        this.retryTimer.unref();
      }
    });

    return { started: true, runtime: command.runtime, command: command.command, configPath: this.options.configPath };
  }

  async stop() {
    this.stopping = true;
    clearTimeout(this.retryTimer);
    if (!this.process) return;
    const child = this.process;
    await new Promise<void>((resolve) => {
      child.once("exit", resolve);
      child.kill("SIGTERM");
      setTimeout(() => {
        if (!child.killed) child.kill("SIGKILL");
        resolve();
      }, 2500).unref();
    });
  }

  async setRecording(enabled) {
    const channel = this.options.channelId || "stakecenter";
    const response = await fetch(`${this.options.apiBaseUrl}/v3/config/paths/patch/${encodeURIComponent(channel)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ record: Boolean(enabled) })
    });
    if (!response.ok) throw new Error(`MediaMTX recording update failed with HTTP ${response.status}`);
  }

  async resolveCommand() {
    const runtime = this.options.runtime || "auto";
    if (!["system", "auto", "binary", "nix", "download"].includes(runtime)) {
      throw new Error(`Unsupported MediaMTX runtime: ${runtime}`);
    }

    if (runtime === "nix") return this.resolveNixCommand();
    if (runtime === "download") {
      return { runtime: "download", command: await this.downloadCachedBinary(), args: [] };
    }

    if (this.options.binaryPath) {
      await assertExecutable(this.options.binaryPath);
      return { runtime: "binary", command: this.options.binaryPath, args: [] };
    }

    const pathBinary = await findOnPath("mediamtx");
    if (pathBinary) return { runtime: "path", command: pathBinary, args: [] };

    if (runtime === "system" || runtime === "binary") {
      throw new Error("MediaMTX system runtime requested, but no binary was configured or found on PATH");
    }

    const nix = await this.tryResolveNixCommand();
    if (nix) return nix;

    return { runtime: "download", command: await this.downloadCachedBinary(), args: [] };
  }

  async resolveNixCommand() {
    const nix = await this.tryResolveNixCommand();
    if (!nix) throw new Error("MediaMTX Nix runtime requested, but nix was not found on PATH");
    return nix;
  }

  async tryResolveNixCommand() {
    const nix = await findOnPath("nix");
    if (!nix) return null;
    return {
      runtime: "nix",
      command: nix,
      args: ["shell", this.options.nixPackage || "nixpkgs#mediamtx", "--command", "mediamtx"]
    };
  }

  async downloadCachedBinary() {
    const platform = releasePlatform();
    const arch = releaseArch();
    const version = this.options.version;
    const installDir = path.join(this.options.cacheDir, version, `${platform}_${arch}`);
    const binary = path.join(installDir, process.platform === "win32" ? "mediamtx.exe" : "mediamtx");

    if (fsSync.existsSync(binary)) {
      await assertExecutable(binary);
      return binary;
    }

    await fs.mkdir(installDir, { recursive: true });
    const archiveName = `mediamtx_${version}_${platform}_${arch}.tar.gz`;
    const archiveUrl = `https://github.com/${repo}/releases/download/${version}/${archiveName}`;
    const archivePath = path.join(installDir, archiveName);

    console.log(`Downloading MediaMTX ${version} from ${archiveUrl}`);
    await downloadFile(archiveUrl, archivePath);
    await extractTarGz(archivePath, installDir);
    await fs.chmod(binary, 0o755);
    return binary;
  }

  async writeConfig() {
    await fs.mkdir(path.dirname(this.options.configPath), { recursive: true });
    if (this.options.playback !== false) {
      await fs.mkdir(this.options.recordingsDir, { recursive: true });
    }
    const hlsEnabled = this.options.hls !== false;
    const playbackEnabled = this.options.playback !== false;
    const config = [
      "api: yes",
      "apiAddress: 127.0.0.1:9997",
      "",
      "metrics: yes",
      "metricsAddress: 127.0.0.1:9998",
      "",
      "rtmp: yes",
      "rtmpAddress: 127.0.0.1:1935",
      "",
      "rtsp: yes",
      "rtspAddress: 127.0.0.1:8554",
      "",
      "srt: yes",
      "srtAddress: 127.0.0.1:8890",
      "",
      `hls: ${hlsEnabled ? "yes" : "no"}`,
      "hlsAddress: 127.0.0.1:8888",
      `hlsAlwaysRemux: ${hlsEnabled ? "yes" : "no"}`,
      "hlsVariant: lowLatency",
      "hlsDirectory: ''",
      "",
      "webrtc: yes",
      "webrtcAddress: 127.0.0.1:8889",
      "webrtcLocalUDPAddress: :8189",
      "webrtcICEServers2:",
      "  - url: stun:stun.cloudflare.com:3478",
      "  - url: stun:stun.l.google.com:19302",
      "",
      `playback: ${playbackEnabled ? "yes" : "no"}`,
      "playbackAddress: 127.0.0.1:9996",
      "",
      "pathDefaults:",
      "  record: no",
      `  recordPath: ${yamlString(path.join(this.options.recordingsDir, "%path/%Y-%m-%d_%H-%M-%S-%f"))}`,
      "  recordFormat: fmp4",
      "  recordPartDuration: 1s",
      "  recordSegmentDuration: 15m",
      "  recordDeleteAfter: 24h",
      "",
      "paths:",
      `  ${this.options.channelId || "stakecenter"}:`,
      "    source: publisher",
      "    runOnReadyRestart: yes",
      `  ${(this.options.channelId || "stakecenter") + "-webrtc"}:`,
      "    source: publisher",
      "    record: no",
      ""
    ].join("\n");
    await fs.writeFile(this.options.configPath, config);
  }
}

async function assertExecutable(binary) {
  await fs.access(binary, fsSync.constants.X_OK);
}

async function findOnPath(command) {
  const segments = (process.env.PATH || "").split(path.delimiter).filter(Boolean);
  const names = process.platform === "win32" ? [`${command}.exe`, command] : [command];
  for (const segment of segments) {
    for (const name of names) {
      const candidate = path.join(segment, name);
      try {
        await assertExecutable(candidate);
        return candidate;
      } catch {
        // Keep searching.
      }
    }
  }
  return null;
}

async function downloadFile(url, destination) {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }
  await pipeline(Readable.fromWeb(response.body), fsSync.createWriteStream(destination));
}

async function extractTarGz(archivePath, destination) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn("tar", ["-xzf", archivePath, "-C", destination], { stdio: "ignore" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`tar exited with code ${code}`));
    });
  });
}

function releasePlatform() {
  if (process.platform === "linux") return "linux";
  if (process.platform === "darwin") return "darwin";
  if (process.platform === "win32") return "windows";
  throw new Error(`Unsupported MediaMTX platform: ${process.platform}`);
}

function releaseArch() {
  if (process.arch === "x64") return "amd64";
  if (process.arch === "arm64") return "arm64";
  if (process.arch === "arm") {
    return os.endianness() === "LE" ? "armv7" : "armv6";
  }
  throw new Error(`Unsupported MediaMTX architecture: ${process.arch}`);
}

function yamlString(value) {
  return JSON.stringify(value);
}
