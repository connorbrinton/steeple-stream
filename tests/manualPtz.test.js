import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { spawnSync } from "node:child_process";
import { ManualPtz, cameraVelocity } from "../src/manualPtz.js";
import {
  deadZone,
  gamepadVelocity,
  gamepadIsNeutral,
  joystickVelocity,
} from "../.test-build/manual-camera.js";

const source = { type: "ndi", ndi: { sourceName: "Synthetic camera", urlAddress: "" } };
const zero = { pan: 0, tilt: 0, zoom: 0 };
function fixture({ ready = true } = {}) {
  const child = new EventEmitter();
  child.stdin = new PassThrough();
  child.stdout = new PassThrough();
  child.stderr = new PassThrough();
  const commands = [];
  child.stdin.on("data", (chunk) => commands.push(JSON.parse(chunk.toString())));
  child.stdin.on("finish", () => child.emit("exit", 0));
  const controller = new ManualPtz({ transport: "ndi" }, () => {
    if (ready) queueMicrotask(() => child.stdout.write("ready\n"));
    return child;
  });
  return { controller, child, commands };
}

test("manual speed validation rejects missing, nonfinite and out-of-range values", () => {
  assert.deepEqual(cameraVelocity(zero), zero);
  for (const pan of [undefined, "1", NaN, Infinity, -1.01, 1.01])
    assert.throws(() => cameraVelocity({ ...zero, pan }), { status: 400 });
});

test("dead zone and precision give proportional input without drift", () => {
  assert.equal(deadZone(0.1), 0);
  assert.equal(deadZone(-0.1), 0);
  assert.equal(deadZone(1), 1);
  const pad = {
    axes: [1, -1],
    buttons: Array.from({ length: 8 }, () => ({ value: 0, pressed: false })),
  };
  pad.buttons[7].value = 1;
  assert.deepEqual(gamepadVelocity(pad), { pan: 0.45, tilt: 0.45, zoom: 0.45 });
  pad.buttons[4].pressed = true;
  assert.equal(gamepadVelocity(pad).pan, 0.15);
  pad.axes = [0, 0];
  pad.buttons[6].value = 1;
  assert.equal(gamepadVelocity(pad).zoom, 0);
  assert.equal(gamepadIsNeutral(pad), false);
});

test("right stick zoom overrides triggers and participates in neutral arming", () => {
  const pad = {
    axes: [0, 0, 0, -1],
    buttons: Array.from({ length: 8 }, () => ({ value: 0, pressed: false })),
  };
  pad.buttons[6].value = 1;
  assert.equal(gamepadVelocity(pad).zoom, 0.45);
  assert.equal(gamepadIsNeutral(pad), false);
  pad.axes[3] = 0.05;
  assert.equal(gamepadVelocity(pad).zoom, -0.45);
  pad.buttons[6].value = 0;
  assert.equal(gamepadIsNeutral(pad), true);
});

test("floating joystick is proportional, has a radial dead zone and caps diagonal speed", () => {
  assert.deepEqual(joystickVelocity(0, 0, 60), { pan: 0, tilt: 0 });
  assert.deepEqual(joystickVelocity(3, 3, 60), { pan: 0, tilt: 0 });
  const slow = joystickVelocity(20, 0, 60);
  const fast = joystickVelocity(60, 0, 60);
  assert.ok(slow.pan > 0 && slow.pan < fast.pan);
  assert.equal(fast.pan, 0.45);
  const diagonal = joystickVelocity(100, -100, 60);
  assert.ok(diagonal.pan > 0 && diagonal.tilt > 0);
  assert.ok(Math.abs(Math.hypot(diagonal.pan, diagonal.tilt) - 0.45) < 1e-10);
});

test("a competing operator cannot move or stop the active camera", async () => {
  const { controller, commands } = fixture();
  await controller.move(source, "a", { ...zero, pan: 0.3 }, 0);
  await assert.rejects(controller.move(source, "b", zero, 0), { status: 409 });
  await controller.move(source, "a", zero, 1);
  assert.deepEqual(commands.at(-1), zero);
  await controller.stop();
});

test("late movement cannot override a newer stop", async () => {
  const { controller, commands } = fixture();
  await controller.move(source, "a", { ...zero, pan: 0.3 }, 0);
  await controller.move(source, "a", zero, 2);
  await controller.move(source, "a", { ...zero, pan: 0.7 }, 1);
  assert.equal(commands.length, 2);
  assert.deepEqual(commands.at(-1), zero);
  await controller.stop();
});

test("a stop during connection setup cancels the pending movement", async () => {
  const { controller, child, commands } = fixture({ ready: false });
  const movement = controller.move(source, "a", { ...zero, pan: 0.3 }, 0);
  await new Promise((resolve) => setImmediate(resolve));
  const stopping = controller.move(source, "a", zero, 1);
  child.stdout.write("ready\n");
  await Promise.all([movement, stopping]);
  assert.deepEqual(commands, [zero]);
  await controller.stop();
});

test("preset/source interruption invalidates old control sessions", async () => {
  const { controller, commands } = fixture();
  await controller.move(source, "a", { ...zero, pan: 0.3 }, 0);
  await controller.stop();
  await assert.rejects(controller.move(source, "a", { ...zero, pan: 0.7 }, 1), { status: 409 });
  assert.equal(commands.length, 1);
});

test("NDI helper stops on heartbeat loss, EOF and invalid commands using a fake receiver", () => {
  const result = spawnSync("python3", ["tests/ndi_manual_test.py"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
});
