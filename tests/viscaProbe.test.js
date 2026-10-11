import assert from "node:assert/strict";
import test from "node:test";
import {
  configuredCameraHost,
  decodePanTilt,
  decodeZoom,
  viscaInquiryPacket,
  viscaResponseBody,
} from "../src/viscaProbe.js";

test("frames read-only VISCA inquiries with the Sony VISCA-over-IP header", () => {
  const inquiry = Buffer.from([0x81, 0x09, 0x06, 0x12, 0xff]);
  assert.deepEqual(
    [...viscaInquiryPacket(inquiry, 7, "sony-visca-ip")],
    [0x01, 0x10, 0, 5, 0, 0, 0, 7, ...inquiry],
  );
  assert.deepEqual([...viscaInquiryPacket(inquiry, 7, "raw-visca-udp")], [...inquiry]);
});

test("correlates VISCA responses by packet sequence and payload length", () => {
  const response = Buffer.from([0x01, 0x11, 0, 3, 0, 0, 0, 7, 0x90, 0x50, 0xff]);
  assert.deepEqual(
    viscaResponseBody(response, 7, "sony-visca-ip"),
    Buffer.from([0x90, 0x50, 0xff]),
  );
  assert.equal(viscaResponseBody(response, 8, "sony-visca-ip"), null);
  assert.equal(viscaResponseBody(response.subarray(0, -1), 7, "sony-visca-ip"), null);
});

test("decodes signed pan/tilt and unsigned zoom positions", () => {
  const panTilt = Buffer.from([0x90, 0x50, 0x00, 0x01, 0x02, 0x03, 0x0f, 0x0f, 0x0f, 0x0e, 0xff]);
  const zoom = Buffer.from([0x90, 0x50, 0, 0, 1, 0, 0xff]);
  assert.deepEqual(decodePanTilt(panTilt), { pan: 0x0123, tilt: -2 });
  assert.equal(decodeZoom(zoom), 16);
  assert.throws(() => decodePanTilt(Buffer.from([0x90, 0x50, 0xff])), /Invalid/);
});

test("only resolves local configured NDI addresses, never arbitrary browser-supplied hosts", () => {
  const source = {
    type: "ndi",
    ndi: { sourceName: "Chapel (10.1.2.3)", urlAddress: "192.168.1.55:5961" },
  };
  assert.equal(configuredCameraHost(source), "192.168.1.55");
  assert.throws(
    () => configuredCameraHost({ type: "ndi", ndi: { sourceName: "camera (8.8.8.8)" } }),
    /private IPv4/,
  );
  assert.throws(() => configuredCameraHost({ type: "network" }), /NDI/);
});
