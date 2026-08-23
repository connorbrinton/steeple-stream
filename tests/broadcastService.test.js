import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { BroadcastService } from "../src/broadcastService.js";
import { JsonStore } from "../src/store.js";

class FakeBackend {
  getPlayback(channelId) {
    return {
      hlsUrl: `http://media/${channelId}/index.m3u8`,
      webrtcUrl: `http://media/${channelId}`,
      publish: {
        rtmpUrl: `rtmp://media/${channelId}`
      }
    };
  }
}

async function makeService(retentionHours = 24, overrides = {}) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-stream-test-"));
  const store = new JsonStore(path.join(dir, "state.json"));
  return new BroadcastService({
    store,
    mediaBackend: new FakeBackend(),
    config: {
      channelId: "stakecenter",
      retentionHours
    },
    ...overrides
  });
}

test("broadcast lifecycle starts, switches sacrament mode, and ends with replay", async () => {
  const service = await makeService();
  const initial = await service.summary();
  assert.equal(initial.preview.hlsUrl, "http://media/stakecenter/index.m3u8");

  const started = await service.start();
  assert.equal(started.broadcast.status, "live");
  assert.equal(started.broadcast.mode, "chapel");
  assert.equal(started.broadcast.playback.hlsUrl, "http://media/stakecenter/index.m3u8");

  const sacrament = await service.setMode("sacrament");
  assert.equal(sacrament.broadcast.status, "live");
  assert.equal(sacrament.broadcast.mode, "sacrament");

  const ended = await service.end();
  assert.equal(ended.broadcast.status, "replay");
  assert.equal(ended.broadcast.mode, "sacrament");
  assert.equal(ended.recordings[0].status, "available");
});

test("scene mode can change while offline and is preserved when starting", async () => {
  const service = await makeService();

  const selected = await service.setMode("sacrament");
  assert.equal(selected.broadcast.status, "offline");
  assert.equal(selected.broadcast.mode, "sacrament");

  const started = await service.start();
  assert.equal(started.broadcast.status, "live");
  assert.equal(started.broadcast.mode, "sacrament");
});

test("retention cleanup removes expired recordings and returns broadcast offline", async () => {
  const service = await makeService(0.001);
  await service.start();
  await service.end();

  const result = await service.cleanupExpired(new Date(Date.now() + 10 * 60 * 1000));
  assert.equal(result.deleted, 1);
  assert.equal(result.state.broadcast.status, "offline");
  assert.equal(result.state.recordings.length, 0);
  assert.equal(result.state.auditLog.some((entry) => entry.event === "recording.delete"), true);
});

test("viewer registration validates names without retaining duplicate PII", async () => {
  const service = await makeService();
  await service.registerViewer({ name: "Alice", sessionId: "abc" });
  await service.registerViewer({ name: "Alice Smith", sessionId: "abc" });

  const state = await service.summary();
  assert.equal(state.viewerCount, 0);
});

test("ptz recall records audit event", async () => {
  const service = await makeService();
  const result = await service.recallPreset("pulpit");
  const state = await service.summary();

  assert.equal(result.preset.name, "Pulpit");
  assert.equal(state.ptz.lastRecalledPresetId, null);
  assert.equal(state.auditLog.some((entry) => entry.event === "ptz.recall" && entry.details.presetId === "pulpit"), true);
});

test("source configuration is normalized and persisted", async () => {
  const service = await makeService();

  const state = await service.updateSource({
    type: "ndi",
    ndi: {
      sourceName: "ClearTouch RL500",
      urlAddress: "192.168.1.25:5961",
      discoveryServer: "192.168.1.25"
    },
    capture: {
      videoDevice: "/dev/video0",
      audioDevice: "alsa_input.usb",
      resolution: "1280x720",
      frameRate: 60
    },
    notes: "Temporary chapel camera source"
  });

  assert.equal(state.source.type, "ndi");
  assert.equal(state.source.ndi.sourceName, "ClearTouch RL500");
  assert.equal(state.source.ndi.urlAddress, "192.168.1.25:5961");
  assert.equal("receiveMode" in state.source.ndi, false);
  assert.equal(state.source.capture.frameRate, 60);
});

test("manual sources are stored separately from active source", async () => {
  const service = await makeService();
  await service.updateSource({
    type: "ndi",
    ndi: { sourceName: "Active Camera", urlAddress: "192.0.2.10:5961" }
  });

  const state = await service.addManualSource({
    type: "ndi",
    ndi: { sourceName: "Backup Camera", urlAddress: "192.0.2.11:5961" },
    notes: "Remembered without selecting"
  });

  assert.equal(state.source.ndi.sourceName, "Active Camera");
  assert.equal(state.manualSources.length, 1);
  assert.equal(state.manualSources[0].ndi.sourceName, "Backup Camera");
  assert.equal(state.auditLog.some((entry) => entry.event === "source.manual.save"), true);
});

test("ptz recall uses camera control source when stream source is network", async () => {
  const calls = [];
  const service = await makeService(24, {
    ptzController: {
      async recallPreset({ source }) {
        calls.push(source);
        return { transport: "ndi", status: "recalled" };
      }
    }
  });
  await service.updateSource({ type: "network", network: { protocol: "rtsp", uri: "rtsp://encoder/live" } });
  await service.updateCameraControlSource({ type: "ndi", ndi: { sourceName: "CHAPEL CAMERA", urlAddress: "192.0.2.20:5961" } });

  await service.recallPreset("pulpit");

  assert.equal(calls[0].type, "ndi");
  assert.equal(calls[0].ndi.sourceName, "CHAPEL CAMERA");
});

test("ptz recall falls back to active NDI source when camera control source is unset", async () => {
  const calls = [];
  const service = await makeService(24, {
    ptzController: {
      async recallPreset({ source }) {
        calls.push(source);
        return { transport: "ndi", status: "recalled" };
      }
    }
  });
  await service.updateSource({ type: "ndi", ndi: { sourceName: "ACTIVE CAMERA", urlAddress: "192.0.2.21:5961" } });

  await service.recallPreset("pulpit");

  assert.equal(calls[0].ndi.sourceName, "ACTIVE CAMERA");
});
