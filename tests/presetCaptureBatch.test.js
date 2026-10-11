import assert from "node:assert/strict";
import test from "node:test";
import { PresetCaptureBatch, waitForPresetToSettle } from "../src/presetCaptureBatch.js";

const coordinates = (pan, zoom = 0) => ({ pan, tilt: 0, zoom });
const preset = (id, position = null) => ({
  id,
  name: id.toUpperCase(),
  ndiPreset: id === "a" ? 1 : 2,
  position,
});

async function untilDone(batch) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (!batch.active) return batch.snapshot();
    await new Promise((resolve) => setImmediate(resolve));
  }
  throw new Error("Batch never completed");
}

function fakeClock() {
  let time = 0;
  return {
    now: () => time,
    sleep: async (ms) => {
      time += ms;
    },
  };
}

test("waits until camera position stays stable across the whole settling window", async () => {
  const clock = fakeClock();
  const values = [
    coordinates(50),
    coordinates(60),
    coordinates(65),
    coordinates(65),
    coordinates(68),
    coordinates(69),
    coordinates(70),
    coordinates(70),
    coordinates(70),
    coordinates(70),
    coordinates(70),
    coordinates(70),
    coordinates(70),
  ];
  let reads = 0;
  const result = await waitForPresetToSettle(
    async () => values[Math.min(reads++, values.length - 1)],
    coordinates(0),
    new AbortController().signal,
    { clock: clock.now, sleep: clock.sleep, sampleMs: 350, settleMs: 1800 },
  );
  assert.deepEqual(result, { position: coordinates(70), moved: true });
  assert.ok(reads >= 10, "must observe a full stable window");
});

test("automatically recalls and saves each preset after it settles", async () => {
  const clock = fakeClock();
  let current = coordinates(0);
  const recalled = [];
  const saved = [];
  const batch = new PresetCaptureBatch({
    plan: async () => ({
      presets: [preset("a"), preset("b")],
      readPosition: async () => ({ ...current }),
    }),
    recall: async (id) => {
      recalled.push(id);
      current = id === "a" ? coordinates(20, 300) : coordinates(500, 2000);
    },
    capture: async (id, position) => {
      saved.push({ id, position: { ...position } });
    },
    clock: clock.now,
    sleep: clock.sleep,
  });
  await batch.start();
  const status = await untilDone(batch);
  assert.equal(status.stage, "completed");
  assert.equal(status.completed, 2);
  assert.deepEqual(recalled, ["a", "b"]);
  assert.deepEqual(
    saved.map((s) => s.position),
    [coordinates(20, 300), coordinates(500, 2000)],
  );
});

test("defers the initially stationary preset until after another has moved", async () => {
  const clock = fakeClock();
  let current = coordinates(10);
  const recalled = [];
  const saved = [];
  const batch = new PresetCaptureBatch({
    plan: async () => ({
      presets: [preset("a"), preset("b")],
      readPosition: async () => ({ ...current }),
    }),
    recall: async (id) => {
      recalled.push(id);
      current = id === "a" ? coordinates(10) : coordinates(200);
    },
    capture: async (id) => {
      saved.push(id);
    },
    clock: clock.now,
    sleep: clock.sleep,
  });
  await batch.start();
  const status = await untilDone(batch);
  assert.equal(status.stage, "completed");
  assert.deepEqual(recalled, ["a", "b", "a"]);
  assert.deepEqual(saved, ["b", "a"]);
});

test("never saves a preset that does not move or whose destination cannot be verified", async () => {
  const clock = fakeClock();
  let saved = 0;
  const batch = new PresetCaptureBatch({
    plan: async () => ({
      presets: [preset("a")],
      readPosition: async () => coordinates(100),
    }),
    recall: async () => {},
    capture: async () => {
      saved++;
    },
    clock: clock.now,
    sleep: clock.sleep,
  });
  await batch.start();
  const status = await untilDone(batch);
  assert.equal(status.stage, "failed");
  assert.match(status.error, /No camera movement detected/);
  assert.equal(saved, 0);
});

test("cancellation prevents further native recalls and captures", async () => {
  const clock = fakeClock();
  const recalled = [];
  let saved = 0;
  let batch;
  batch = new PresetCaptureBatch({
    plan: async () => ({
      presets: [preset("a"), preset("b")],
      readPosition: async () => coordinates(0),
    }),
    recall: async (id) => {
      recalled.push(id);
      batch.cancel();
    },
    capture: async () => {
      saved++;
    },
    clock: clock.now,
    sleep: clock.sleep,
  });
  await batch.start();
  const status = await untilDone(batch);
  assert.equal(status.stage, "cancelled");
  assert.deepEqual(recalled, ["a"]);
  assert.equal(saved, 0);
});

test("only one capture job can run at once", async () => {
  let release;
  const plan = new Promise((resolve) => {
    release = resolve;
  });
  const batch = new PresetCaptureBatch({
    plan: () => plan,
    recall: async () => {},
    capture: async () => {},
  });
  const first = batch.start();
  await assert.rejects(batch.start(), /running/);
  release({ presets: [preset("a")], readPosition: async () => coordinates(0) });
  await first;
  batch.cancel();
  const state = await untilDone(batch);
  assert.equal(state.stage, "cancelled");
});
