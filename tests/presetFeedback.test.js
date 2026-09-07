import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await fs.readFile(new URL("../public/assets/broadcaster.js", import.meta.url), "utf8");

function button() {
  const classes = new Set();
  const attributes = new Map();
  return {
    classList: { add: name => classes.add(name), remove: (...names) => names.forEach(name => classes.delete(name)) },
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: name => attributes.delete(name),
    classes, attributes, offsetWidth: 100
  };
}

function harness() {
  const buttons = [button(), button()];
  const controls = { querySelectorAll: () => buttons, contains: b => buttons.includes(b) };
  const requests = [];
  const alerts = [];
  const context = vm.createContext({
    document: { querySelector: id => id === "#ptz-controls" ? controls : { addEventListener() {} } },
    fetch(url) {
      if (url === "/api/session") return new Promise(() => {});
      return new Promise((resolve, reject) => requests.push({ resolve, reject }));
    },
    alert: message => alerts.push(message), console, setInterval() {}
  });
  vm.runInContext(source, context);
  context.refresh = async () => {};
  const resolve = index => requests[index].resolve({ ok: true, json: async () => ({}) });
  return { context, buttons, requests, resolve, alerts };
}

test("pending feedback ends at command response, without waiting for state refresh", async () => {
  const h = harness();
  h.context.refresh = () => new Promise(() => {});
  const promise = h.context.recallPreset(h.buttons[0], "pulpit");
  assert.ok(h.buttons[0].classes.has("preset-pending"));
  assert.equal(h.buttons[0].attributes.get("aria-busy"), "true");
  h.resolve(0);
  await promise;
  assert.ok(h.buttons[0].classes.has("preset-recent"));
  assert.ok(!h.buttons[0].classes.has("preset-pending"));
  assert.ok(!h.buttons[0].attributes.has("aria-busy"));
});

test("latest tap owns feedback even when earlier responses arrive later", async () => {
  const h = harness();
  const first = h.context.recallPreset(h.buttons[0], "pulpit");
  const second = h.context.recallPreset(h.buttons[1], "choir");
  assert.equal(h.buttons[0].classes.size, 0);
  h.resolve(1);
  await second;
  h.resolve(0);
  await first;
  assert.equal(h.buttons[0].classes.size, 0);
  assert.ok(h.buttons[1].classes.has("preset-recent"));
});

test("repeat taps send repeat requests and restart pending feedback", async () => {
  const h = harness();
  const first = h.context.recallPreset(h.buttons[0], "pulpit");
  h.resolve(0);
  await first;
  const second = h.context.recallPreset(h.buttons[0], "pulpit");
  assert.equal(h.requests.length, 2);
  assert.ok(!h.buttons[0].classes.has("preset-recent"));
  assert.ok(h.buttons[0].classes.has("preset-pending"));
  h.resolve(1);
  await second;
  assert.ok(h.buttons[0].classes.has("preset-recent"));
});

test("failed requests clear pending feedback and keep the existing alert behavior", async () => {
  const h = harness();
  const request = h.context.recallPreset(h.buttons[0], "pulpit");
  h.requests[0].resolve({ ok: false, json: async () => ({ error: "Camera unavailable" }) });
  await request;
  assert.equal(h.buttons[0].classes.size, 0);
  assert.deepEqual(h.alerts, ["Camera unavailable"]);
});
