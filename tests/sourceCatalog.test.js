import assert from "node:assert/strict";
import test from "node:test";
import { buildSourceCatalog } from "../src/sourceCatalog.js";

test("source catalog exposes discovered NDI sources without manual configuration", () => {
  const catalog = buildSourceCatalog({
    activeSource: { type: "ndi", ndi: { sourceName: "CHAPEL CAMERA", urlAddress: "" } },
    manualSources: [],
    discoveredNdiSources: [
      { name: "CHAPEL CAMERA", urlAddress: "192.0.2.10:5961", source: "gstreamer" },
      { name: "Steeple Stream Synthetic", urlAddress: "127.0.0.1:5961", source: "gstreamer" },
    ],
    ingestStatus: {
      ready: true,
      status: "running",
      inputs: { video: { ready: true }, audio: { ready: true } },
    },
    backendHealth: { ready: true },
  });

  assert.equal(catalog.sources.length, 2);
  assert.equal(catalog.sources[0].id, "ndi:CHAPEL CAMERA");
  assert.equal(catalog.sources[0].selected, true);
  assert.equal(catalog.sources[0].configured, false);
  assert.equal(catalog.sources[0].available, true);
  assert.equal(catalog.sources[0].health.status, "healthy");
});

test("source catalog includes manual and active-only sources when not discovered", () => {
  const catalog = buildSourceCatalog({
    activeSource: {
      type: "ndi",
      ndi: { sourceName: "CHAPEL CAMERA", urlAddress: "192.0.2.10:5961" },
    },
    manualSources: [
      { type: "network", network: { protocol: "rtsp", uri: "rtsp://encoder.local/live" } },
    ],
    discoveredNdiSources: [],
  });

  assert.equal(catalog.sources.length, 2);
  assert.equal(catalog.sources[0].id, "ndi:CHAPEL CAMERA");
  assert.equal(catalog.sources[0].selected, true);
  assert.equal(catalog.sources[0].available, false);
  assert.equal(catalog.sources[1].id, "network:rtsp:rtsp://encoder.local/live");
  assert.equal(catalog.sources[1].configured, true);
});

test("source catalog merges a manual NDI source with a discovered source", () => {
  const catalog = buildSourceCatalog({
    activeSource: { type: "ndi", ndi: { sourceName: "Backup Camera", urlAddress: "" } },
    manualSources: [
      {
        type: "ndi",
        ndi: { sourceName: "Backup Camera", urlAddress: "192.0.2.10:5961" },
        notes: "Saved fallback",
      },
    ],
    discoveredNdiSources: [
      { name: "Backup Camera", urlAddress: "192.0.2.11:5961", source: "gstreamer" },
    ],
  });

  assert.equal(catalog.sources.length, 1);
  assert.equal(catalog.sources[0].available, true);
  assert.equal(catalog.sources[0].configured, true);
  assert.equal(catalog.sources[0].source.ndi.urlAddress, "192.0.2.11:5961");
});

test("source catalog marks separate stream and camera control sources", () => {
  const catalog = buildSourceCatalog({
    activeSource: { type: "network", network: { protocol: "rtsp", uri: "rtsp://encoder/live" } },
    cameraControlSource: {
      type: "ndi",
      ndi: { sourceName: "CHAPEL CAMERA", urlAddress: "192.0.2.20:5961" },
    },
    discoveredNdiSources: [
      { name: "CHAPEL CAMERA", urlAddress: "192.0.2.20:5961", source: "gstreamer" },
    ],
  });

  assert.equal(catalog.activeSourceId, "network:rtsp:rtsp://encoder/live");
  assert.equal(catalog.cameraControlSourceId, "ndi:CHAPEL CAMERA");
  assert.equal(catalog.sources.find((source) => source.selected).type, "network");
  assert.equal(catalog.sources.find((source) => source.cameraControl).name, "CHAPEL CAMERA");
});
