import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { SqliteStore } from "../src/sqliteStore.js";

test("SQLite store imports legacy state and preserves a backup", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-sqlite-"));
  const legacy = path.join(dir, "state.json");
  await fs.writeFile(legacy, JSON.stringify({
    broadcast: { status: "live", mode: "chapel" },
    ptz: {
      presets: [
        { id: "pulpit", name: "Pulpit", protocol: "manual" },
        { id: "wide", name: "Wide", protocol: "manual" },
        { id: "choir", name: "Choir", protocol: "manual" }
      ]
    }
  }));
  const store = new SqliteStore(path.join(dir, "state.sqlite"), { legacyPath: legacy });
  const state = await store.load();
  assert.equal(state.broadcast.status, "live");
  assert.equal(state.source.type, "ndi");
  assert.deepEqual(state.ptz.presets.map((preset) => [preset.id, preset.ndiPreset]), [
    ["full-stand", 1],
    ["pulpit", 2],
    ["music-director", 8],
    ["choir", 12],
    ["piano", 13],
    ["pulpit-wide", 16]
  ]);
  await fs.access(`${legacy}.pre-sqlite`);
});

test("playback sessions retain transport diagnostics", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-metrics-"));
  const store = new SqliteStore(path.join(dir, "state.sqlite"));
  await store.load();
  store.upsertPlaybackSession({
    id: "session-1", viewerId: "viewer-1", viewerName: "Patron",
    locationId: "stakecenter", transport: "webrtc-host",
    candidateType: "host", watchSeconds: 45, ip: "192.0.2.1", userAgent: "Browser"
  });
  const row = store.db.prepare("SELECT * FROM playback_sessions WHERE id='session-1'").get();
  assert.equal(row.transport, "webrtc-host");
  assert.equal(row.ip, "192.0.2.1");
  assert.equal(row.viewer_name, "Patron");
});
