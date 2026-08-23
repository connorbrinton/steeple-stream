import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { inferHostFromSource, PtzController, viscaRecallPresetCommand } from "../src/ptzController.js";

test("builds VISCA memory recall command", () => {
  assert.deepEqual([...viscaRecallPresetCommand(2)], [0x81, 0x01, 0x04, 0x3f, 0x02, 0x02, 0xff]);
});

test("infers camera host from NDI source name", () => {
  assert.equal(
    inferHostFromSource({ ndi: { sourceName: "CHAPEL CAMERA (Chapel Camera, 192.0.2.10)" } }),
    "192.0.2.10"
  );
});

test("VISCA UDP controller sends recall command to inferred host", async () => {
  const sends = [];
  const controller = new PtzController({
    config: { transport: "visca-udp", port: 52381, timeoutMs: 100 },
    socketFactory() {
      return new FakeSocket(sends);
    }
  });

  const result = await controller.recallPreset({
    preset: { id: "pulpit", name: "Pulpit", viscaPreset: 2 },
    source: { ndi: { sourceName: "CHAPEL CAMERA (Chapel Camera, 192.0.2.10)" } }
  });

  assert.equal(result.status, "recalled");
  assert.equal(result.host, "192.0.2.10");
  assert.deepEqual(sends, [{
    command: [0x81, 0x01, 0x04, 0x3f, 0x02, 0x02, 0xff],
    port: 52381,
    host: "192.0.2.10"
  }]);
});

test("NDI controller recalls configured NDI preset", async () => {
  const calls = [];
  const controller = new PtzController({
    config: { transport: "ndi", timeoutMs: 100, ndiPresetSpeed: 0.75, ndiSettleMs: 900 },
    runner: {
      async recallNdiPreset(options) {
        calls.push(options);
      }
    }
  });

  const result = await controller.recallPreset({
    preset: { id: "pulpit", name: "Pulpit", ndiPreset: 2 },
    source: {
      type: "ndi",
      ndi: {
        sourceName: "CHAPEL CAMERA (Chapel Camera, 192.0.2.10)",
        urlAddress: "192.0.2.10:5961"
      }
    }
  });

  assert.equal(result.status, "recalled");
  assert.equal(result.transport, "ndi");
  assert.equal(result.movement, "ndi-preset");
  assert.equal(result.preset, 1);
  assert.equal(result.cameraPreset, 2);
  assert.deepEqual(calls, [{
    helper: null,
    sourceName: "CHAPEL CAMERA (Chapel Camera, 192.0.2.10)",
    urlAddress: "192.0.2.10:5961",
    presetIndex: 1,
    speed: 0.75,
    settleMs: 900,
    timeoutMs: 100
  }]);
});

test("NDI controller requires a selected NDI source", async () => {
  const controller = new PtzController({
    config: { transport: "ndi" },
    runner: { async recallNdiPreset() { throw new Error("should not be called"); } }
  });

  await assert.rejects(
    controller.recallPreset({ preset: { id: "pulpit", name: "Pulpit", ndiPreset: 2 }, source: { type: "network" } }),
    /requires an NDI source/
  );
});

test("VISCA controller captures absolute pan tilt and zoom", async () => {
  const responses = [
    Buffer.from([0x90, 0x50, 0x00, 0x01, 0x02, 0x03, 0x0f, 0x0f, 0x0f, 0x0e, 0xff]),
    Buffer.from([0x90, 0x50, 0x00, 0x00, 0x01, 0x00, 0xff])
  ];
  const controller = new PtzController({
    config: { transport: "visca-udp", host: "192.0.2.10", timeoutMs: 100 },
    socketFactory() { return new InquirySocket(responses.shift()); }
  });
  const position = await controller.capturePosition({ source: {} });
  assert.deepEqual(position, { pan: 0x0123, tilt: -2, zoom: 0x0010 });
});

class FakeSocket extends EventEmitter {
  constructor(sends) {
    super();
    this.sends = sends;
  }

  send(command, port, host, callback) {
    this.sends.push({ command: [...command], port, host });
    callback();
  }

  close() {}
}

class InquirySocket extends EventEmitter {
  constructor(response) { super(); this.response = response; }
  bind(_port, callback) { callback(); }
  send(_command, _port, _host, callback) {
    callback();
    queueMicrotask(() => this.emit("message", this.response));
  }
  close() {}
}
