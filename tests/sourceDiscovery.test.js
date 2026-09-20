import assert from "node:assert/strict";
import test from "node:test";
import { parseGstDeviceMonitor, parsePtrAnswers } from "../src/sourceDiscovery.js";

test("parses NDI PTR answers from mDNS packets", () => {
  const packet = Buffer.from([
    0x00, 0x00, 0x84, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x04, 0x5f, 0x6e, 0x64,
    0x69, 0x04, 0x5f, 0x74, 0x63, 0x70, 0x05, 0x6c, 0x6f, 0x63, 0x61, 0x6c, 0x00, 0x00, 0x0c, 0x00,
    0x01, 0x00, 0x00, 0x00, 0x78, 0x00, 0x13, 0x10, 0x43, 0x6c, 0x65, 0x61, 0x72, 0x54, 0x6f, 0x75,
    0x63, 0x68, 0x20, 0x52, 0x4c, 0x35, 0x30, 0x30, 0xc0, 0x0c,
  ]);

  assert.deepEqual(parsePtrAnswers(packet, "_ndi._tcp.local"), ["ClearTouch RL500"]);
});

test("parses NDI names and direct addresses from GStreamer discovery", () => {
  const output = `Device found:

  name  : DEBIAN (Steeple Stream Synthetic)
  class : Source/Audio/Video/Network
  properties:
    ndi-name = DEBIAN (Steeple Stream Synthetic)
    url-address = 192.168.1.10:5961
`;

  assert.deepEqual(parseGstDeviceMonitor(output), [
    {
      name: "DEBIAN (Steeple Stream Synthetic)",
      urlAddress: "192.168.1.10:5961",
      source: "gstreamer",
      available: true,
    },
  ]);
});
