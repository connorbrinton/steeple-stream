import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await fs.readFile(new URL("../public/assets/player.js", import.meta.url), "utf8");
class Element extends EventTarget {}
function harness(storage = new Map()) {
  const context = vm.createContext({
    window: { SteepleComponent: { mount() {} } },
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    setTimeout, clearTimeout
  });
  vm.runInContext(source, context);
  const mount = () => {
    const video = new Element();
    context.attachVolumeControls({}, video);
    return video;
  };
  return { mount, context };
}
function change(video, volume, muted) {
  video.volume = volume;
  video.muted = muted;
  video.dispatchEvent(new Event("volumechange"));
}
test("first playback defaults to full volume and unmuted", () => {
  const video = harness().mount();
  assert.equal(video.volume, 1);
  assert.equal(video.muted, false);
});
test("volume and mute persist across new media and reloads", () => {
  const storage = new Map(), h = harness(storage);
  change(h.mount(), 0.37, true);
  for (const next of [h.mount(), harness(storage).mount()]) {
    assert.equal(next.volume, 0.37);
    assert.equal(next.muted, true);
  }
});
test("zero volume remains a valid saved preference", () => {
  const h = harness();
  change(h.mount(), 0, false);
  assert.equal(h.mount().volume, 0);
});
test("malformed storage defaults safely; blocked storage retains in-page preferences", () => {
  for (const saved of ["invalid", "null", '{"volume":2,"muted":false}', '{"volume":"0.5","muted":false}']) {
    const video = harness(new Map([["steeple-stream:audio", saved]])).mount();
    assert.equal(video.volume, 1);
    assert.equal(video.muted, false);
  }
  const h = harness({ get() { throw new Error("blocked"); }, set() { throw new Error("blocked"); } });
  change(h.mount(), 0.42, true);
  assert.equal(h.mount().volume, 0.42);
  assert.equal(h.mount().muted, true);
});

test("autoplay denial does not turn a working WebRTC connection into a timeout", async () => {
  const { context } = harness();
  const video = Object.assign(new Element(), {
    readyState: 0,
    play: async () => { throw Object.assign(new Error("Gesture required"), { name: "NotAllowedError" }); }
  });
  await context.waitForPlaying(video, 10);
});

test("WebRTC still times out if playback genuinely never starts", async () => {
  const { context } = harness();
  const video = Object.assign(new Element(), { readyState: 0, play: () => new Promise(() => {}) });
  await assert.rejects(context.waitForPlaying(video, 10), /playback timed out/);
});

test("changing source cancels the old playback wait before the reused video plays", async () => {
  const { context } = harness();
  const video = Object.assign(new Element(), { readyState: 0, play: async () => {} });
  const pending = new AbortController();
  const result = context.waitForPlaying(video, 1000, pending.signal);
  pending.abort();
  video.dispatchEvent(new Event("playing"));
  await assert.rejects(result, /source changed/);
});
