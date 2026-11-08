import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { RtmpsRelay, validateRtmpsDestination } from "../src/rtmpsRelay.js";

function fixture() {
  const state = {
    broadcast: { status: "offline" },
    rtmpsDestination: null,
  };
  const store = {
    read: async () => structuredClone(state),
    update: async (change) => change(state),
  };
  const children = [];
  const calls = [];
  const relay = new RtmpsRelay({
    store,
    inputUrl: "rtmp://127.0.0.1:1935/stakecenter",
    spawnProcess: (command, args) => {
      const child = new EventEmitter();
      child.stderr = new EventEmitter();
      child.kill = () => {
        queueMicrotask(() => child.emit("exit", 0));
        return true;
      };
      calls.push({ command, args });
      children.push(child);
      return child;
    },
  });
  return { state, relay, calls, children };
}

test("requires an RTMPS server and separate stream key", () => {
  assert.throws(() => validateRtmpsDestination("rtmp://example.com/live", "secret"), /rtmps:/);
  assert.throws(
    () => validateRtmpsDestination("rtmps://example.com/live?key=x", "secret"),
    /rtmps:/,
  );
  assert.throws(
    () => validateRtmpsDestination("rtmps://example.com/live", "secret/other"),
    /stream key/,
  );
  assert.equal(
    validateRtmpsDestination("rtmps://example.com/live2", "stream-key").serverUrl,
    "rtmps://example.com/live2",
  );
});

test("destination is saved for a broadcaster without exposing the stream key", async () => {
  const { relay, state } = fixture();
  const result = await relay.configure({
    serverUrl: "rtmps://a.rtmps.youtube.com/live2",
    streamKey: "very-secret-key",
  });
  assert.equal(state.rtmpsDestination.streamKey, "very-secret-key");
  assert.equal(result.enabled, true);
  assert.equal(result.hasStreamKey, true);
  assert.equal(JSON.stringify(result).includes("very-secret-key"), false);
  assert.equal(result.status, "idle");
  await relay.configure({ serverUrl: "rtmps://another.example.com/live", streamKey: "" });
  assert.equal(state.rtmpsDestination.streamKey, "very-secret-key");
  await relay.configure({ enabled: false });
  assert.equal((await relay.summary()).enabled, false);
});

test("relay starts and stops with the broadcast without touching ingest", async () => {
  const { relay, calls, children } = fixture();
  await relay.configure({ serverUrl: "rtmps://example.com/live", streamKey: "secret" });
  await relay.sync(true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].command, "ffmpeg");
  assert.deepEqual(calls[0].args.slice(-5), [
    "-c",
    "copy",
    "-f",
    "flv",
    "rtmps://example.com/live/secret",
  ]);
  assert.equal((await relay.summary()).status, "connecting");
  children[0].stderr.emit("data", Buffer.from("out_time_ms=23000\n"));
  assert.equal((await relay.summary()).status, "streaming");
  await relay.sync(false);
  assert.equal((await relay.summary()).status, "idle");
});

test("config changes replace a running relay; failure does not reveal credentials", async () => {
  const { relay, calls, children } = fixture();
  await relay.configure({ serverUrl: "rtmps://example.com/live", streamKey: "private-key" });
  await relay.sync(true);
  await relay.configure({ serverUrl: "rtmps://other.example.com/app", streamKey: "" });
  assert.equal(calls.length, 2);
  children[1].emit("exit", 1);
  const status = await relay.summary();
  assert.equal(status.status, "error");
  assert.equal(JSON.stringify(status).includes("private-key"), false);
  await relay.stop();
});
