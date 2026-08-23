import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { defaultNdiNixPackage, gstPluginPackages, IngestManager, ndiToRtmpPipeline, sacramentSlateToRtmpPipeline, switchableNdiSlateToRtmpCommand } from "../src/ingestManager.js";

class FakeProcess extends EventEmitter {
  constructor() {
    super();
    this.stdout = new EventEmitter();
    this.stderr = new EventEmitter();
    this.killedWith = null;
    this.stdin = {
      writes: [],
      write: (chunk) => this.stdin.writes.push(chunk)
    };
  }

  kill(signal) {
    this.killedWith = signal;
    this.emit("exit", 0, signal);
  }
}

function makeRunner() {
  const calls = [];
  const child = new FakeProcess();
  return {
    calls,
    child,
    runner: {
      spawn(command, args, options) {
        calls.push({ command, args, options });
        return child;
      },
      async nixBuild(packages, cwd, options) {
        calls.push({ nixBuild: packages, cwd, options });
        if (packages.includes(defaultNdiNixPackage)) return ["/nix/store/ndi"];
        return ["/nix/store/gst-plugin-ndi", "/nix/store/gst-plugins-good"];
      }
    }
  };
}

function makeIngestManager(options) {
  return new IngestManager({
    ndiDiscovery: async () => [],
    ...options
  });
}

test("NDI pipeline publishes audio and video to MediaMTX RTMP path", () => {
  const pipeline = ndiToRtmpPipeline({
    sourceName: "CHAPEL CAMERA",
    rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
    frameRate: 30,
    videoBitrateKbps: 4500,
    audioBitrate: 128000
  });

  assert.equal(pipeline.includes("ndisrc"), true);
  assert.equal(pipeline.includes("ndisrcdemux"), true);
  assert.equal(pipeline.includes("x264enc"), true);
  assert.equal(pipeline.includes("video/x-raw,format=I420,framerate=30/1"), true);
  assert.equal(pipeline.includes("avenc_aac"), true);
  assert.equal(pipeline.includes("rtmpsink"), true);
  assert.equal(pipeline.includes("location=rtmp://127.0.0.1:1935/stakecenter"), true);
});

test("switchable NDI slate command uses the controller process", () => {
  const command = switchableNdiSlateToRtmpCommand({
    sourceName: "CHAPEL CAMERA",
    sourceUrlAddress: "192.0.2.10:5961",
    rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
    frameRate: 30,
    videoBitrateKbps: 4500,
    audioBitrate: 128000,
    mode: "sacrament"
  });

  assert.equal(command[0], "python3");
  assert.match(command[1], /gst_ingest_controller\.py$/);
  assert.equal(command.includes("--ndi-source"), true);
  assert.equal(command.includes("CHAPEL CAMERA"), true);
  assert.equal(command.includes("--ndi-url-address"), true);
  assert.equal(command.includes("192.0.2.10:5961"), true);
  assert.equal(command.includes("--initial-mode"), true);
  assert.equal(command.includes("sacrament"), true);
});

test("sacrament slate pipeline publishes generated video with silent audio", () => {
  const pipeline = sacramentSlateToRtmpPipeline({
    rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
    frameRate: 30,
    videoBitrateKbps: 4500,
    audioBitrate: 128000
  });

  assert.equal(pipeline.includes("videotestsrc"), true);
  assert.equal(pipeline.includes("textoverlay"), true);
  assert.equal(pipeline.includes("audiotestsrc"), true);
  assert.equal(pipeline.includes("wave=silence"), true);
  assert.equal(pipeline.includes("location=rtmp://127.0.0.1:1935/stakecenter"), true);
});

test("ingest manager starts NDI pipeline with system GStreamer runtime", async () => {
  const { calls, runner } = makeRunner();
  const manager = makeIngestManager({
    cwd: "/project",
    runner,
    config: {
      autoStart: true,
      runtime: "system",
      rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000,
      ndiRuntimeDir: "/opt/ndi/lib"
    }
  });

  await manager.startForState({
    broadcast: { mode: "chapel" },
    source: {
      type: "ndi",
      ndi: { sourceName: "CHAPEL CAMERA" }
    }
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].command, "python3");
  assert.match(calls[0].args[0], /gst_ingest_controller\.py$/);
  assert.equal(calls[0].args.includes("--ndi-source"), true);
  assert.match(calls[0].options.env.LD_LIBRARY_PATH, /\/opt\/ndi\/lib/);
  assert.equal(manager.status().status, "starting");
});

test("ingest manager refreshes stale NDI direct address before starting", async () => {
  const { calls, runner } = makeRunner();
  const manager = makeIngestManager({
    cwd: "/project",
    runner,
    ndiDiscovery: async () => [
      { name: "CHAPEL CAMERA", urlAddress: "192.0.2.10:5961", available: true }
    ],
    config: {
      autoStart: true,
      runtime: "system",
      rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000
    }
  });

  await manager.startForState({
    broadcast: { mode: "chapel" },
    source: {
      type: "ndi",
      ndi: { sourceName: "CHAPEL CAMERA", urlAddress: "192.0.2.10:5962" }
    }
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].args.includes("--ndi-url-address"), true);
  assert.equal(calls[0].args.includes("192.0.2.10:5961"), true);
  assert.equal(manager.status().source.ndi.urlAddress, "192.0.2.10:5961");
});

test("ingest manager keeps saved NDI direct address when discovery has no match", async () => {
  const { calls, runner } = makeRunner();
  const manager = makeIngestManager({
    cwd: "/project",
    runner,
    ndiDiscovery: async () => [],
    config: {
      autoStart: true,
      runtime: "system",
      rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000
    }
  });

  await manager.startForState({
    broadcast: { mode: "chapel" },
    source: {
      type: "ndi",
      ndi: { sourceName: "CHAPEL CAMERA", urlAddress: "192.0.2.10:5962" }
    }
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].args.includes("192.0.2.10:5962"), true);
});

test("ingest manager switches scene mode without restarting the controller", async () => {
  const { calls, runner, child } = makeRunner();
  const manager = makeIngestManager({
    cwd: "/project",
    runner,
    config: {
      autoStart: true,
      runtime: "system",
      rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000
    }
  });

  const state = {
    source: { type: "ndi", ndi: { sourceName: "CHAPEL CAMERA" } }
  };

  await manager.startForState({ ...state, broadcast: { mode: "chapel" } });
  await manager.startForState({ ...state, broadcast: { mode: "sacrament" } });

  assert.equal(calls.length, 1);
  assert.deepEqual(JSON.parse(child.stdin.writes[0]), { type: "set-mode", mode: "sacrament" });
  assert.equal(manager.status().sourceType, "slate");
});

test("ingest manager ignores sacrament mode when scene controls are disabled", async () => {
  const { calls, runner } = makeRunner();
  const manager = makeIngestManager({
    cwd: "/project",
    runner,
    config: {
      autoStart: true,
      sceneControls: false,
      runtime: "system",
      rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000
    }
  });

  await manager.startForState({
    broadcast: { mode: "sacrament" },
    source: { type: "ndi", ndi: { sourceName: "CHAPEL CAMERA" } }
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].args.includes("--initial-mode"), true);
  assert.equal(calls[0].args.includes("chapel"), true);
  assert.equal(calls[0].args.includes("sacrament"), false);
  assert.equal(manager.status().scene.requested, "chapel");
});

test("ingest manager switches from sacrament back to chapel without NDI rediscovery", async () => {
  const { calls, runner, child } = makeRunner();
  let discoveryCalls = 0;
  const manager = makeIngestManager({
    cwd: "/project",
    runner,
    ndiDiscovery: async () => {
      discoveryCalls += 1;
      return [{ name: "CHAPEL CAMERA", urlAddress: "192.0.2.10:5961", available: true }];
    },
    config: {
      autoStart: true,
      runtime: "system",
      rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000
    }
  });

  const state = {
    source: { type: "ndi", ndi: { sourceName: "CHAPEL CAMERA", urlAddress: "192.0.2.10:5962" } }
  };

  await manager.startForState({ ...state, broadcast: { mode: "chapel" } });
  assert.equal(discoveryCalls, 1);
  await manager.startForState({ ...state, broadcast: { mode: "sacrament" } });
  await manager.startForState({ ...state, broadcast: { mode: "chapel" } });

  assert.equal(calls.length, 1);
  assert.equal(discoveryCalls, 1);
  assert.deepEqual(child.stdin.writes.map((entry) => JSON.parse(entry)), [
    { type: "set-mode", mode: "sacrament" },
    { type: "set-mode", mode: "chapel" }
  ]);
});

test("ingest manager emits health changes for scene transitions", async () => {
  const { runner, child } = makeRunner();
  const manager = makeIngestManager({
    cwd: "/project",
    runner,
    config: {
      autoStart: true,
      runtime: "system",
      rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000
    }
  });
  const changes = [];
  manager.on("changed", (status) => changes.push(status.scene));

  await manager.startForState({
    broadcast: { mode: "chapel" },
    source: { type: "ndi", ndi: { sourceName: "CHAPEL CAMERA" } }
  });
  changes.length = 0;

  await manager.startForState({
    broadcast: { mode: "sacrament" },
    source: { type: "ndi", ndi: { sourceName: "CHAPEL CAMERA" } }
  });
  child.stdout.emit("data", "{\"event\":\"transition-complete\",\"mode\":\"sacrament\"}\n");

  assert.equal(changes[0].requested, "sacrament");
  assert.equal(changes[0].transitioning, true);
  assert.equal(changes.at(-1).observed, "sacrament");
  assert.equal(changes.at(-1).transitioning, false);
});

test("ingest manager reports running only after controller readiness", async () => {
  const { runner, child } = makeRunner();
  const manager = makeIngestManager({
    runner,
    config: {
      autoStart: true,
      runtime: "system",
      rtmpUrl: "rtmp://127.0.0.1/live",
      webrtcRtspUrl: "rtsp://127.0.0.1:8554/live-webrtc",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000
    }
  });
  await manager.startForState({ broadcast: { mode: "chapel" }, source: { type: "ndi", ndi: { sourceName: "CAMERA" } } });
  assert.equal(manager.status().status, "starting");
  assert.equal(manager.status().inputs.video.expected, true);
  assert.equal(manager.status().outputs.rtmp.expected, true);
  assert.equal(manager.status().outputs.rtsp.expected, true);
  child.stdout.emit("data", `${JSON.stringify({ event: "input-ready", media: "video" })}\n`);
  child.stdout.emit("data", `${JSON.stringify({ event: "ready", mode: "chapel", outputs: ["rtmp", "rtsp"] })}\n`);
  assert.equal(manager.status().status, "running");
  assert.equal(manager.status().observedMode, "chapel");
  assert.equal(manager.status().scene.observed, "chapel");
  assert.equal(manager.status().inputs.video.ready, true);
  assert.equal(manager.status().outputs.rtmp.ready, true);
  assert.equal(manager.status().outputs.rtsp.ready, true);
});

test("ingest manager records structured pipeline failures", async () => {
  const { runner, child } = makeRunner();
  const manager = makeIngestManager({
    runner,
    config: { autoStart: true, runtime: "system", rtmpUrl: "rtmp://127.0.0.1/live", frameRate: 30, videoBitrateKbps: 4500, audioBitrate: 128000 }
  });
  await manager.startForState({ broadcast: { mode: "chapel" }, source: { type: "ndi", ndi: { sourceName: "CAMERA" } } });
  child.stdout.emit("data", `${JSON.stringify({ event: "error", message: "RTMP sink failed", debug: "connection refused" })}\n`);

  assert.equal(manager.status().status, "failed");
  assert.equal(manager.status().lastError.category, "pipeline");
  assert.equal(manager.status().lastError.message, "RTMP sink failed");
  assert.equal(manager.status().lastError.debug, "connection refused");
});

test("ingest manager starts sacrament slate without requiring an NDI source", async () => {
  const { calls, runner } = makeRunner();
  const manager = makeIngestManager({
    cwd: "/project",
    runner,
    config: {
      autoStart: true,
      runtime: "system",
      rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000
    }
  });

  await manager.startForState({
    broadcast: { mode: "sacrament" },
    source: { type: "ndi", ndi: { sourceName: "" } }
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].command, "gst-launch-1.0");
  assert.equal(calls[0].args.includes("videotestsrc"), true);
  assert.equal(calls[0].args.includes("audiotestsrc"), true);
  assert.equal(manager.status().sourceType, "slate");
  assert.equal(manager.status().status, "starting");
});

test("ingest manager can still start NDI pipeline through explicit Nix fallback", async () => {
  const { calls, runner } = makeRunner();
  const manager = makeIngestManager({
    cwd: "/project",
    runner,
    config: {
      autoStart: true,
      runtime: "nix",
      rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000,
      ndiRuntimeDir: "/opt/ndi/lib",
      ndiNixPackage: defaultNdiNixPackage
    }
  });

  await manager.startForState({
    broadcast: { mode: "chapel" },
    source: {
      type: "ndi",
      ndi: { sourceName: "CHAPEL CAMERA" }
    }
  });

  assert.deepEqual(calls[0].nixBuild, gstPluginPackages);
  assert.deepEqual(calls[1].nixBuild, [defaultNdiNixPackage]);
  assert.equal(calls[1].options.impure, true);
  assert.equal(calls[1].options.env.NIXPKGS_ALLOW_UNFREE, "1");
  assert.equal(calls[2].command, "nix");
  assert.equal(calls[2].args[0], "shell");
  assert.equal(calls[2].args.includes("python3"), true);
  assert.match(calls[2].options.env.GST_PLUGIN_PATH, /gst-plugin-ndi/);
  assert.match(calls[2].options.env.LD_LIBRARY_PATH, /\/nix\/store\/ndi\/lib/);
  assert.match(calls[2].options.env.LD_LIBRARY_PATH, /\/opt\/ndi\/lib/);
  assert.equal(manager.status().status, "starting");
});

test("ingest manager waits when NDI source is not selected", async () => {
  const { calls, runner } = makeRunner();
  const manager = makeIngestManager({
    runner,
    config: {
      autoStart: true,
      runtime: "nix",
      rtmpUrl: "rtmp://127.0.0.1:1935/stakecenter",
      frameRate: 30,
      videoBitrateKbps: 4500,
      audioBitrate: 128000
    }
  });

  await manager.startForState({ broadcast: { mode: "chapel" }, source: { type: "ndi", ndi: { sourceName: "" } } });

  assert.equal(calls.length, 0);
  assert.equal(manager.status().status, "waiting");
});
