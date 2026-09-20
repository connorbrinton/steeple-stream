import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { SqliteStore } from "../src/sqliteStore.js";

test("SQLite store imports legacy state and preserves a backup", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-sqlite-"));
  const legacy = path.join(dir, "state.json");
  await fs.writeFile(
    legacy,
    JSON.stringify({
      broadcast: { status: "live", mode: "chapel" },
      ptz: {
        presets: [
          { id: "pulpit", name: "Pulpit", protocol: "manual" },
          { id: "wide", name: "Wide", protocol: "manual" },
          { id: "choir", name: "Choir", protocol: "manual" },
        ],
      },
    }),
  );
  const store = new SqliteStore(path.join(dir, "state.sqlite"), { legacyPath: legacy });
  const state = await store.load();
  assert.equal(state.broadcast.status, "live");
  assert.equal(state.source.type, "ndi");
  assert.deepEqual(
    state.ptz.presets.map((preset) => [preset.id, preset.ndiPreset]),
    [
      ["pulpit", 18],
      ["first-row", 12],
      ["stand-congregation", 13],
      ["pulpit-wide", 2],
      ["music-leader", 8],
      ["choir", 1],
      ["piano", 16],
      ["organ", 9],
      ["chapel", 4],
      ["overflow", 6],
      ["cultural-hall", 7],
    ],
  );
  await fs.access(`${legacy}.pre-sqlite`);
});

test("playback sessions retain transport diagnostics", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-metrics-"));
  const store = new SqliteStore(path.join(dir, "state.sqlite"));
  await store.load();
  store.upsertPlaybackSession({
    id: "session-1",
    viewerId: "viewer-1",
    viewerName: "Patron",
    locationId: "stakecenter",
    transport: "webrtc-host",
    candidateType: "host",
    watchSeconds: 45,
    ip: "192.0.2.1",
    userAgent: "Browser",
  });
  const row = store.db.prepare("SELECT * FROM playback_sessions WHERE id='session-1'").get();
  assert.equal(row.transport, "webrtc-host");
  assert.equal(row.ip, "192.0.2.1");
  assert.equal(row.viewer_name, "Patron");
});

test("units, schedules and occurrence cancellations persist", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "steeple-schedules-"));
  const store = new SqliteStore(path.join(dir, "state.sqlite"));
  await store.load();
  const unit = store.createUnit({
    id: "unit-1",
    slug: "harris-lake",
    name: "Harris Lake Ward",
    type: "ward",
    parentUnitId: null,
  });
  const schedule = store.createBroadcastSchedule({
    id: "schedule-1",
    publicId: "public-schedule",
    channelId: "stakecenter",
    unitId: unit.id,
    title: "Sacrament Meeting",
    kind: "sacrament-meeting",
    timeZone: "America/New_York",
    recurrence: "weekly",
    weekday: 0,
    localDate: null,
    localStartTime: "11:00",
    durationMinutes: 90,
    enabled: true,
  });
  const updatedUnit = store.updateUnit(unit.id, {
    slug: unit.slug,
    name: "Harris Lake First Ward",
    type: unit.type,
    parentUnitId: null,
  });
  const updatedSchedule = store.updateBroadcastSchedule(schedule.id, {
    ...schedule,
    title: "Sunday Sacrament Meeting",
    durationMinutes: 75,
  });
  store.cancelScheduleOccurrence(schedule.id, "2026-10-18");

  assert.equal(updatedUnit.name, "Harris Lake First Ward");
  assert.equal(updatedSchedule.title, "Sunday Sacrament Meeting");
  assert.equal(updatedSchedule.publicId, schedule.publicId);
  assert.deepEqual(store.listUnits(), [updatedUnit]);
  assert.deepEqual(store.listBroadcastSchedules(), [updatedSchedule]);
  assert.deepEqual(store.listScheduleExceptions(), [
    { scheduleId: schedule.id, localDate: "2026-10-18", action: "cancel" },
  ]);
  assert.equal(store.db.prepare("PRAGMA user_version").get().user_version, 2);
});
