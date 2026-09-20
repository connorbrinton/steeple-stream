import assert from "node:assert/strict";
import test from "node:test";
import { defaultState, migrateState } from "../src/store.js";
import { PtzController } from "../src/ptzController.js";

test("verified presets have the requested names, groups and order", () => {
  assert.deepEqual(
    defaultState.ptz.presets.map(({ group, name, ndiPreset }) => [group, name, ndiPreset]),
    [
      ["Stand", "Pulpit", 18],
      ["Stand", "1st Row", 12],
      ["Stand", "Stand + Congregation", 13],
      ["Stand", "Pulpit Wide", 2],
      ["Music", "Music Leader", 8],
      ["Music", "Choir", 1],
      ["Music", "Piano", 16],
      ["Music", "Organ", 9],
      ["Congregation", "Chapel", 4],
      ["Congregation", "Overflow", 6],
      ["Congregation", "Cultural Hall", 7],
    ],
  );
});

test("migration replaces old named and diagnostic presets, preserving custom entries", () => {
  const custom = { id: "custom", name: "Custom", ndiPreset: 25, position: { pan: 1 } };
  const state = migrateState({
    ptz: {
      presets: [
        ...["full-stand", "pulpit", "music-director", "choir", "piano", "pulpit-wide"].map(
          (id) => ({ id, ndiPreset: 2, position: { pan: 100 } }),
        ),
        ...Array.from({ length: 18 }, (_, index) => ({
          id: `ndi-raw-${index + 1}`,
          ndiPreset: index + 1,
        })),
        custom,
      ],
      lastRecalledPresetId: "pulpit",
    },
  });
  assert.deepEqual(state.ptz.presets, [...defaultState.ptz.presets, custom]);
  assert.equal(state.ptz.lastRecalledPresetId, null);
  assert.deepEqual(migrateState(state), state);
  state.ptz.presets[0].name = "Changed";
  assert.equal(defaultState.ptz.presets[0].name, "Pulpit");
});

test("every verified preset recalls its zero-based NDI identifier without setting presets", async () => {
  const indices = [];
  const controller = new PtzController({
    config: { transport: "ndi" },
    runner: {
      async recallNdiPreset({ presetIndex }) {
        indices.push(presetIndex);
      },
    },
  });
  const source = { type: "ndi", ndi: { sourceName: "Test camera" } };
  for (const preset of defaultState.ptz.presets) await controller.recallPreset({ preset, source });
  assert.deepEqual(indices, [17, 11, 12, 1, 7, 0, 15, 8, 3, 5, 6]);
  await assert.rejects(
    controller.recallPreset({ preset: { id: "pulpit", name: "Pulpit" }, source }),
    /valid NDI camera preset/,
  );
});
