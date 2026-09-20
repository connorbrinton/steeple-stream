import assert from "node:assert/strict";
import test from "node:test";
import { SourceDiscoveryService } from "../src/sourceDiscoveryService.js";

test("source discovery service warms NDI cache on startup", async () => {
  const service = new SourceDiscoveryService({
    intervalMs: 0,
    discover: async () => [
      { name: "CHAPEL CAMERA", urlAddress: "192.168.1.10:5961", source: "gstreamer" },
    ],
  });

  await service.start();

  assert.deepEqual(service.listNdiSources(), [
    {
      name: "CHAPEL CAMERA",
      urlAddress: "192.168.1.10:5961",
      source: "gstreamer",
      available: true,
    },
  ]);
  assert.equal(service.status().ndi.sourceCount, 1);
  assert.equal(service.status().ndi.lastError, null);
});

test("source discovery service includes configured source when it is not currently discovered", () => {
  const service = new SourceDiscoveryService({ intervalMs: 0, discover: async () => [] });
  const currentSource = {
    type: "ndi",
    ndi: { sourceName: "CHAPEL CAMERA", urlAddress: "192.168.1.10:5962" },
  };

  assert.deepEqual(service.listNdiSources(currentSource), [
    {
      name: "CHAPEL CAMERA",
      urlAddress: "192.168.1.10:5962",
      source: "configured",
      available: false,
    },
  ]);
});

test("source discovery service triggerRefresh returns before discovery completes", async () => {
  let resolveDiscovery;
  const discoveryStarted = new Promise((resolve) => {
    resolveDiscovery = resolve;
  });
  const service = new SourceDiscoveryService({
    intervalMs: 0,
    discover: async () => {
      await discoveryStarted;
      return [{ name: "CHAPEL CAMERA", urlAddress: "192.168.1.10:5961" }];
    },
  });

  service.triggerRefresh();

  assert.deepEqual(service.listNdiSources(), []);
  resolveDiscovery();
  await service.refresh();
  assert.equal(service.listNdiSources()[0].urlAddress, "192.168.1.10:5961");
});

test("source discovery service resolves stale NDI direct address from cache", async () => {
  const service = new SourceDiscoveryService({
    intervalMs: 0,
    discover: async () => [
      { name: "CHAPEL CAMERA", urlAddress: "192.168.1.10:5961", available: true },
    ],
  });
  await service.start();

  const source = service.resolveNdiSource({
    type: "ndi",
    ndi: { sourceName: "CHAPEL CAMERA", urlAddress: "192.168.1.10:5962" },
  });

  assert.equal(source.ndi.urlAddress, "192.168.1.10:5961");
});
