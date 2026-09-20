// Test-only HTTP server: production player assets and production media proxy,
// with synthetic sources. Never imports the app's camera/discovery services.
import { spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { proxyHttp, sendStatic } from "../src/httpUtils.js";

const dir = path.dirname(fileURLToPath(import.meta.url));
const artifacts = path.join(dir, "artifacts");
await fs.mkdir(artifacts, { recursive: true });
const children = new Set();
let shuttingDown = false;
function start(command, args, name) {
  const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
  const log = createWriteStream(path.join(artifacts, `${name}.log`));
  child.stdout.pipe(log);
  child.stderr.pipe(log);
  children.add(child);
  child.once("error", (error) => {
    console.error(error);
    process.exit(1);
  });
  child.once("exit", () => children.delete(child));
  return child;
}
function shutdown() {
  shuttingDown = true;
  for (const child of children) child.kill("SIGTERM");
  server?.close();
}
let server;
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("exit", shutdown);

const recording = path.join(artifacts, "recording.mp4");
const generated = start(
  "ffmpeg",
  [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-y",
    "-f",
    "lavfi",
    "-i",
    "testsrc2=size=640x360:rate=15",
    "-f",
    "lavfi",
    "-i",
    "sine=frequency=440:sample_rate=48000",
    "-t",
    "15",
    "-c:v",
    "libx264",
    "-threads",
    "2",
    "-preset",
    "ultrafast",
    "-pix_fmt",
    "yuv420p",
    "-profile:v",
    "baseline",
    "-g",
    "15",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    "-movflags",
    "+faststart",
    recording,
  ],
  "fixture",
);
const [generatedCode] = await once(generated, "exit");
if (generatedCode !== 0)
  throw new Error("Could not generate recording fixture; see artifacts/fixture.log");

const mtx = start(
  process.env.MEDIAMTX_BINARY || "mediamtx",
  [path.join(dir, "mediamtx.yml")],
  "mediamtx",
);
async function waitFor(check, description) {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (await check().catch(() => false)) return;
    if (mtx.exitCode !== null) throw new Error("MediaMTX exited; see artifacts/mediamtx.log");
    await delay(200);
  }
  throw new Error(`Timed out waiting for ${description}`);
}
await waitFor(async () => (await fetch("http://127.0.0.1:9997/v3/paths/list")).ok, "MediaMTX API");
const startedAt = new Date().toISOString();
const publisher = start(
  "ffmpeg",
  [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-re",
    "-stream_loop",
    "-1",
    "-i",
    recording,
    "-map",
    "0:v",
    "-map",
    "0:a",
    "-c",
    "copy",
    "-f",
    "flv",
    "rtmp://127.0.0.1:1935/live",
    "-map",
    "0:v",
    "-map",
    "0:a",
    "-c:v",
    "copy",
    "-c:a",
    "libopus",
    "-b:a",
    "96k",
    "-f",
    "rtsp",
    "-rtsp_transport",
    "tcp",
    "rtsp://127.0.0.1:8554/live-webrtc",
  ],
  "publisher",
);
for (const child of [mtx, publisher])
  child.on("exit", (code) => {
    if (!shuttingDown) {
      console.error(`Media fixture exited (${code})`);
      process.exit(1);
    }
  });
await waitFor(async () => {
  const response = await fetch("http://127.0.0.1:9997/v3/paths/list");
  const { items } = await response.json();
  return ["live", "live-webrtc"].every((name) =>
    items.some((item) => item.name === name && item.ready),
  );
}, "both audio/video streams");

server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:4173");
  try {
    if (url.pathname === "/ready") {
      res.end("ready");
      return;
    }
    if (url.pathname === "/fixture/config") {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ startedAt }));
      return;
    }
    if (url.pathname.startsWith("/hls/")) {
      await proxyHttp(req, res, "http://127.0.0.1:8888", req.url.slice(4));
      return;
    }
    if (url.pathname.startsWith("/webrtc/")) {
      await proxyHttp(req, res, "http://127.0.0.1:8889", req.url.slice(7), {
        locationPrefix: "/webrtc",
      });
      return;
    }
    if (url.pathname === "/recording.mp4") {
      const data = await fs.readFile(recording);
      res.setHeader("content-type", "video/mp4");
      res.setHeader("accept-ranges", "bytes");
      const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || "");
      if (range) {
        const start = Number(range[1]);
        const end = range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1;
        if (start > end || start >= data.length) {
          res.writeHead(416, { "content-range": `bytes */${data.length}` });
          res.end();
          return;
        }
        res.writeHead(206, {
          "content-range": `bytes ${start}-${end}/${data.length}`,
          "content-length": end - start + 1,
        });
        res.end(data.subarray(start, end + 1));
      } else {
        res.setHeader("content-length", data.length);
        res.end(data);
      }
      return;
    }
    if (url.pathname === "/" || url.pathname === "/fixture.js") {
      await sendStatic(res, dir, url.pathname === "/" ? "/fixture.html" : "/fixture.js");
      return;
    }
    if (
      /^\/(assets|build|vendor)\/[a-zA-Z0-9_./-]+$/.test(url.pathname) &&
      !url.pathname.includes("..")
    ) {
      await sendStatic(res, path.join(dir, "../public"), url.pathname);
      return;
    }
    res.writeHead(404);
    res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.writeHead(502);
    res.end();
  }
});
server.listen(4173, "127.0.0.1");
