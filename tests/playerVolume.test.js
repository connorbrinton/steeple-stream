import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await fs.readFile(new URL("../public/assets/player.js", import.meta.url), "utf8");

class Element extends EventTarget {
  children = [];
  attributes = {};
  append(...children) { this.children.push(...children); }
  querySelector(selector) { return this.children.find(child => `.${child.className}` === selector); }
  setAttribute(name, value) { this.attributes[name] = value; }
  remove() {}
}

function harness(storage = new Map()) {
  const context = vm.createContext({
    window: {},
    document: { createElement: () => new Element() },
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    setTimeout, clearTimeout
  });
  vm.runInContext(source, context);
  const mount = () => {
    const wrapper = new Element();
    const video = new Element();
    context.attachVolumeControls(wrapper, video);
    const [mute, volume] = wrapper.children[0].children;
    return {
      video, mute, volume,
      setVolume(value) { volume.value = String(value); volume.dispatchEvent(new Event("input")); },
      toggleMute() { mute.dispatchEvent(new Event("click")); }
    };
  };
  return { mount, context };
}

test("first playback is audible at full volume; slider and mute survive new streams and reloads", () => {
  const storage = new Map();
  const h = harness(storage);
  const first = h.mount();
  assert.equal(first.video.volume, 1);
  assert.equal(first.video.muted, false);
  first.setVolume(37);
  first.toggleMute();
  for (const next of [h.mount(), harness(storage).mount()]) {
    assert.equal(next.video.volume, 0.37);
    assert.equal(next.video.muted, true);
    assert.equal(next.mute.textContent, "Unmute");
    next.toggleMute();
    assert.equal(next.video.volume, 0.37);
    assert.equal(next.video.muted, false);
  }
});

test("zero volume is persisted and Unmute restores an audible level", () => {
  const h = harness();
  h.mount().setVolume(0);
  const next = h.mount();
  assert.equal(next.video.volume, 0);
  assert.equal(next.mute.textContent, "Unmute");
  next.toggleMute();
  assert.equal(next.video.volume, 1);
  assert.equal(next.video.muted, false);
  next.toggleMute();
  next.setVolume(25);
  assert.equal(next.video.muted, false);
  assert.equal(next.video.volume, 0.25);
});

test("native volume changes update controls and the saved preference", () => {
  const h = harness();
  const first = h.mount();
  first.video.volume = 0.6;
  first.video.muted = true;
  first.video.dispatchEvent(new Event("volumechange"));
  assert.equal(first.volume.value, "60");
  assert.equal(first.volume.attributes["aria-valuetext"], "60% (muted)");
  assert.equal(h.mount().video.volume, 0.6);
  assert.equal(h.mount().video.muted, true);
});

test("malformed storage defaults safely and unavailable storage retains in-page preferences", () => {
  for (const saved of ["invalid", "null", '{"volume":2,"muted":false}', '{"volume":"0.5","muted":false}']) {
    const h = harness(new Map([["steeple-stream:audio", saved]]));
    assert.equal(h.mount().video.volume, 1);
    assert.equal(h.mount().video.muted, false);
  }
  const h = harness({ get() { throw new Error("blocked"); }, set() { throw new Error("blocked"); } });
  h.mount().setVolume(42);
  assert.equal(h.mount().video.volume, 0.42);
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
