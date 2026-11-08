import assert from "node:assert/strict";
import test from "node:test";
import { RtmpsForwarding, validateRtmpsDestination } from "../src/rtmpsForwarding.js";

function fixture() {
  const state = { broadcast: { status: "offline" }, rtmpsDestination: null };
  const store = {
    read: async () => structuredClone(state),
    update: async (change) => change(state),
  };
  const requests = [];
  let forward = [];
  let runtimeState = "forwarding";
  let patchStatus = 200;
  let listStatus = 200;
  const request = async (url, options = {}) => {
    if (options.method === "PATCH") {
      const entries = JSON.parse(options.body).forward;
      requests.push({ url, method: options.method, forward: entries });
      if (patchStatus === 200) forward = entries;
      return { ok: patchStatus === 200, status: patchStatus };
    }
    requests.push({ url, method: "GET" });
    return {
      ok: listStatus === 200,
      status: listStatus,
      json: async () => ({
        items: forward.map((_, pos) => ({ pos, state: runtimeState, lastError: "secret" })),
      }),
    };
  };
  const forwarding = new RtmpsForwarding({
    store,
    channelId: "stakecenter",
    apiBaseUrl: "http://127.0.0.1:9997",
    request,
  });
  return {
    state,
    forwarding,
    requests,
    get forward() {
      return forward;
    },
    setRuntimeState: (value) => {
      runtimeState = value;
    },
    setPatchStatus: (value) => {
      patchStatus = value;
    },
    setListStatus: (value) => {
      listStatus = value;
    },
  };
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

test("persists broadcaster settings without exposing stream keys", async () => {
  const { forwarding, state } = fixture();
  const result = await forwarding.configure({
    serverUrl: "rtmps://a.rtmps.youtube.com/live2",
    streamKey: "very-secret-key",
  });
  assert.equal(state.rtmpsDestination.streamKey, "very-secret-key");
  assert.equal(result.enabled, true);
  assert.equal(result.hasStreamKey, true);
  assert.equal(result.status, "idle");
  assert.equal(JSON.stringify(result).includes("very-secret-key"), false);
  await forwarding.configure({ serverUrl: "rtmps://example.com/live", streamKey: "" });
  assert.equal(state.rtmpsDestination.streamKey, "very-secret-key");
  await forwarding.configure({ enabled: false });
  assert.equal((await forwarding.summary()).enabled, false);
});

test("patches MediaMTX forwarding when broadcast starts and ends", async () => {
  const f = fixture();
  await f.forwarding.configure({
    serverUrl: "rtmps://a.rtmps.youtube.com/live2",
    streamKey: "private-key",
  });
  assert.equal(f.requests.length, 0);
  await f.forwarding.sync(true);
  assert.deepEqual(f.forward, [{ dest: "rtmps://a.rtmps.youtube.com/live2#private-key" }]);
  assert.match(f.requests[0].url, /\/v3\/config\/paths\/patch\/stakecenter$/);
  const status = await f.forwarding.summary();
  assert.equal(status.status, "streaming");
  assert.equal(JSON.stringify(status).includes("private-key"), false);
  await f.forwarding.sync(false);
  assert.deepEqual(f.forward, []);
  assert.equal((await f.forwarding.summary()).status, "idle");
});

test("updates a live destination and restores it after a MediaMTX restart", async () => {
  const f = fixture();
  await f.forwarding.configure({ serverUrl: "rtmps://one.example/live", streamKey: "secret" });
  await f.forwarding.sync(true);
  await f.forwarding.configure({ serverUrl: "rtmps://two.example/live", streamKey: "" });
  assert.deepEqual(f.forward, [{ dest: "rtmps://two.example/live#secret" }]);
  const patches = f.requests.filter((entry) => entry.method === "PATCH").length;
  await f.forwarding.mediaRestart(true);
  assert.equal(f.requests.filter((entry) => entry.method === "PATCH").length, patches + 1);
  assert.deepEqual(f.forward, [{ dest: "rtmps://two.example/live#secret" }]);
  await f.forwarding.stop();
});

test("status reflects runtime errors without exposing MediaMTX error text", async () => {
  const f = fixture();
  await f.forwarding.configure({ serverUrl: "rtmps://example.com/live", streamKey: "secret" });
  await f.forwarding.sync(true);
  f.setRuntimeState("error");
  const result = await f.forwarding.summary();
  assert.equal(result.status, "error");
  assert.equal(JSON.stringify(result).includes("secret"), false);
  f.setListStatus(404);
  assert.equal((await f.forwarding.summary()).status, "connecting");
  await f.forwarding.stop();
});

test("failed MediaMTX patches are retried, including a subsequent stop", async () => {
  const f = fixture();
  await f.forwarding.configure({ serverUrl: "rtmps://example.com/live", streamKey: "secret" });
  f.setPatchStatus(503);
  await f.forwarding.sync(true);
  const status = await f.forwarding.summary();
  assert.equal(status.status, "error");
  assert.equal(JSON.stringify(status).includes("secret"), false);
  f.setPatchStatus(200);
  await f.forwarding.sync(false);
  assert.deepEqual(f.requests.at(-1).forward, []);
  assert.equal((await f.forwarding.summary()).status, "idle");
  await f.forwarding.stop();
});
