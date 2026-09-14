import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import fs from "node:fs/promises";

const source = await fs.readFile(new URL("../.test-build/player.js", import.meta.url), "utf8");

function harness({ native = false, mse = !native, autoplay = true } = {}) {
  let now = 0;
  let nextId = 0;
  let overlay = null;
  const timers = new Map();
  const schedule = (callback, delay, repeat = false) => {
    const id = ++nextId;
    timers.set(id, { callback, delay, repeat, at: now + delay });
    return id;
  };
  const video = Object.assign(new EventTarget(), {
    currentTime: 0, paused: false, seeking: false, ended: false,
    canPlayType: () => native ? "maybe" : "",
    play: async () => {},
    reloads: 0
  });
  Object.defineProperty(video, "src", { set() { video.reloads++; } });
  const container = {
    isConnected: true,
    contains: element => element === video,
    querySelector: selector => selector === ".playback-status" ? overlay : null
  };
  const instances = [];
  class Hls {
    static isSupported() { return mse; }
    static Events = { ERROR: "error" };
    constructor() { instances.push(this); }
    loadSource() {}
    attachMedia(media) { this.media = media; }
    on(_event, handler) { this.error = handler; }
    destroy() { this.destroyed = true; }
    stopLoad() { this.stopped = true; }
  }
  const document = { hidden: false };
  const context = vm.createContext({
    window: { Hls }, document,
    performance: { now: () => now },
    setTimeout: (fn, delay) => schedule(fn, delay),
    setInterval: (fn, delay) => schedule(fn, delay, true),
    clearTimeout: id => timers.delete(id),
    clearInterval: id => timers.delete(id)
  });
  vm.runInContext(source, context);
  context.showPlaybackStatus = (_container, title) => {
    overlay = { title, remove() { overlay = null; } };
  };
  context.attachHls(container, video, "/live.m3u8", { autoplay });
  const advance = milliseconds => {
    const end = now + milliseconds;
    while (true) {
      const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0];
      if (!next || next[1].at > end) break;
      const [id, timer] = next;
      now = timer.at;
      if (timer.repeat) timer.at += timer.delay;
      else timers.delete(id);
      timer.callback();
    }
    now = end;
  };
  return { video, container, document, instances, advance, context,
    status: () => overlay?.title,
    emit: name => video.dispatchEvent(new Event(name)) };
}

test("nonfatal HLS stalls reconnect on the same media element", () => {
  const h = harness();
  h.emit("playing");
  for (let i = 0; i < 17; i++) {
    h.emit("waiting"); // Repeated events must not postpone recovery.
    h.advance(1000);
  }
  assert.equal(h.instances.length, 2);
  assert.equal(h.instances[0].destroyed, true);
  assert.equal(h.instances[1].media, h.video);
  h.video.currentTime = 1;
  h.emit("timeupdate");
  assert.equal(h.status(), undefined);
});

test("buffered playback progressing after stalled events does not reconnect or retain an overlay", () => {
  const h = harness();
  h.emit("playing");
  for (let i = 1; i <= 30; i++) {
    h.emit("stalled");
    h.video.currentTime = i;
    h.advance(1000);
  }
  assert.equal(h.instances.length, 1);
  assert.equal(h.status(), undefined);
});

test("paused and backgrounded playback is not restarted; foreground stalls still recover", () => {
  const h = harness();
  h.emit("playing");
  h.video.paused = true;
  h.advance(60000);
  h.video.paused = false;
  h.document.hidden = true;
  h.advance(60000);
  assert.equal(h.instances.length, 1);
  h.document.hidden = false;
  h.advance(17000);
  assert.equal(h.instances.length, 2);
});

test("native HLS silent stalls reload the source", () => {
  const h = harness({ native: true });
  h.emit("playing");
  h.advance(17000);
  assert.equal(h.video.reloads, 2);
});

test("HLS.js is preferred when both native HLS and MSE are supported", () => {
  const h = harness({ native: true, mse: true });
  assert.equal(h.instances.length, 1);
  assert.equal(h.instances[0].media, h.video);
  assert.equal(h.video.reloads, 0);
});

test("spontaneous recovery cancels a pending reconnect", () => {
  const h = harness();
  h.emit("playing");
  h.advance(12000);
  for (let i = 1; i <= 10; i++) {
    h.video.currentTime = i;
    h.advance(1000);
  }
  assert.equal(h.instances.length, 1);
  assert.equal(h.status(), undefined);
});

test("fatal errors retry once even with repeated errors, and access denial stops recovery", () => {
  const h = harness();
  h.instances[0].error("error", { fatal: true });
  h.advance(2000);
  h.instances[0].error("error", { fatal: true });
  h.advance(3000);
  assert.equal(h.instances.length, 2);
  h.instances[1].error("error", { fatal: true, response: { code: 403 } });
  h.advance(60000);
  assert.equal(h.instances.length, 2);
  assert.equal(h.instances[1].stopped, true);
  assert.equal(h.status(), "Access expired");
});

test("destroy cancels pending reconnects and playback monitoring", () => {
  const h = harness();
  h.advance(12000);
  h.context.destroy(h.container);
  h.advance(60000);
  assert.equal(h.instances.length, 1);
  assert.equal(h.instances[0].destroyed, true);
});
