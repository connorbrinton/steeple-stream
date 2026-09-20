import assert from "node:assert/strict";
import test from "node:test";
import { MediaMtxBackend } from "../src/mediaBackend.js";

test("MediaMTX playback advertises WebRTC by default", () => {
  const backend = new MediaMtxBackend({ hlsBaseUrl: "/hls", webrtcBaseUrl: "/webrtc" });
  const playback = backend.getPlayback("stakecenter");
  assert.equal(playback.hlsUrl, "/hls/stakecenter/index.m3u8");
  assert.equal(playback.webrtcUrl, "/webrtc/stakecenter-webrtc/whep");
});

test("MediaMTX playback can advertise HLS only for public tunnel deployments", () => {
  const backend = new MediaMtxBackend({
    hlsBaseUrl: "/hls",
    webrtcBaseUrl: "/webrtc",
    publicWebRtc: false,
  });
  const playback = backend.getPlayback("stakecenter");
  assert.equal(playback.hlsUrl, "/hls/stakecenter/index.m3u8");
  assert.equal("webrtcUrl" in playback, false);
});

test("MediaMTX playback can advertise WebRTC preview without HLS", () => {
  const backend = new MediaMtxBackend({
    hls: false,
    hlsBaseUrl: "/hls",
    webrtcBaseUrl: "/webrtc",
  });
  const playback = backend.getPlayback("stakecenter");
  assert.equal("hlsUrl" in playback, false);
  assert.equal(playback.webrtcUrl, "/webrtc/stakecenter-webrtc/whep");
});
