import assert from "node:assert/strict";
import test from "node:test";
import { runSynchronizedMove, synchronizedVelocity } from "../src/smoothPtz.js";

test("fast axes wait for the slowest axis", () => {
  const start = { pan: 0, tilt: 0, zoom: 0 };
  const target = { pan: 1000, tilt: 0, zoom: 1000 };
  const command = synchronizedVelocity(start, { pan: 700, tilt: 0, zoom: 100 }, target);
  assert.equal(command.pan, 0);
  assert.ok(command.zoom > 0);
  const next = synchronizedVelocity(start, { pan: 1025, tilt: 0, zoom: 900 }, target);
  assert.ok(next.zoom > 0);
});

test("no commands needed when already at target", () => {
  assert.deepEqual(
    synchronizedVelocity(
      { pan: -1091, tilt: -47, zoom: 3619 },
      { pan: -1091, tilt: -47, zoom: 3619 },
      { pan: -1091, tilt: -47, zoom: 3619 },
    ),
    { pan: 0, tilt: 0, zoom: 0 },
  );
});

test("closed-loop motion reaches a target while throttling faster pan", async () => {
  let position = { pan: 0, tilt: 0, zoom: 0 };
  const target = { pan: 600, tilt: 0, zoom: 600 };
  const history = [];
  let stopped = 0;
  await runSynchronizedMove({
    target,
    signal: new AbortController().signal,
    sampleMs: 0,
    timeoutMs: 4000,
    readPosition: async () => ({ ...position }),
    sendVelocity: async (v) => {
      // Simulated camera: pan is four times as fast as zoom at the same NDI speed.
      position = {
        pan: position.pan + v.pan * 120,
        tilt: position.tilt + v.tilt * 80,
        zoom: position.zoom + v.zoom * 30,
      };
      history.push({ ...position });
    },
    stop: async () => { stopped++; },
  });
  assert.equal(stopped, 1);
  assert.ok(Math.abs(position.pan - target.pan) <= 12, "pan should finish at target");
  assert.ok(Math.abs(position.zoom - target.zoom) <= 20, "zoom should finish at target");
  const maxLead = Math.max(...history.map((p) => (p.pan - p.zoom) / 600));
  assert.ok(maxLead < 0.30, "fast pan should not finish long before slow zoom");
});

test("cancellation always stops velocity commands", async () => {
  const abort = new AbortController();
  let stopped = 0;
  let calls = 0;
  await assert.rejects(
    runSynchronizedMove({
      target: { pan: 400, tilt: 0, zoom: 0 },
      signal: abort.signal,
      sampleMs: 0,
      readPosition: async () => ({ pan: 0, tilt: 0, zoom: 0 }),
      sendVelocity: async () => {
        calls++;
        abort.abort();
      },
      stop: async () => { stopped++; },
    }),
    /interrupted/,
  );
  assert.equal(stopped, 1);
  assert.equal(calls, 1);
});

test("position inquiry failure after movement stops the camera", async () => {
  let stopped = 0;
  let reads = 0;
  await assert.rejects(
    runSynchronizedMove({
      target: { pan: 400, tilt: 0, zoom: 0 },
      signal: new AbortController().signal,
      sampleMs: 0,
      readPosition: async () => {
        if (++reads >= 3) throw new Error("feedback timeout");
        return { pan: 0, tilt: 0, zoom: 0 };
      },
      sendVelocity: async () => {},
      stop: async () => { stopped++; },
    }),
    /feedback timeout/,
  );
  assert.equal(stopped, 1);
});
