import fs from "node:fs/promises";
import path from "node:path";

export const defaultState = {
  version: 1,
  broadcast: {
    id: null,
    channelId: "stakecenter",
    status: "offline",
    mode: "chapel",
    startedAt: null,
    endedAt: null,
    expiresAt: null,
    playback: null
  },
  source: {
    type: "ndi",
    ndi: {
      sourceName: "",
      urlAddress: "",
      discoveryServer: ""
    },
    capture: {
      videoDevice: "",
      audioDevice: "",
      resolution: "1920x1080",
      frameRate: 30
    },
    network: {
      uri: "",
      protocol: "rtsp"
    },
    notes: ""
  },
  viewers: [],
  ptz: {
    presets: [
      { id: "full-stand", name: "Full Stand", protocol: "ndi", ndiPreset: 1, viscaPreset: 1, position: null },
      { id: "pulpit", name: "Pulpit", protocol: "ndi", ndiPreset: 2, viscaPreset: 2, position: null },
      { id: "music-director", name: "Music Director", protocol: "ndi", ndiPreset: 8, viscaPreset: 8, position: null },
      { id: "choir", name: "Choir", protocol: "ndi", ndiPreset: 12, viscaPreset: 12, position: null },
      { id: "piano", name: "Piano", protocol: "ndi", ndiPreset: 13, viscaPreset: 13, position: null },
      { id: "pulpit-wide", name: "Pulpit Wide", protocol: "ndi", ndiPreset: 16, viscaPreset: 16, position: null }
    ],
    lastRecalledPresetId: null
  },
  recordings: [],
  auditLog: []
};

export class JsonStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.state = structuredClone(defaultState);
    this.loaded = false;
    this.writeQueue = Promise.resolve();
  }

  async load() {
    if (this.loaded) return this.state;
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      this.state = migrateState(JSON.parse(raw));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await this.save();
    }
    this.loaded = true;
    return this.state;
  }

  async read() {
    await this.load();
    return structuredClone(this.state);
  }

  async update(mutator) {
    await this.load();
    const result = await mutator(this.state);
    await this.save();
    return result ?? structuredClone(this.state);
  }

  async save() {
    const payload = JSON.stringify(this.state, null, 2);
    this.writeQueue = this.writeQueue.then(() => fs.writeFile(this.filePath, `${payload}\n`));
    return this.writeQueue;
  }
}

export function migrateState(state = {}) {
  const migrated = mergeState(defaultState, state);
  migrated.source = migrateSource(migrated.source);
  migrated.ptz = migratePtz(migrated.ptz);
  return migrated;
}

function migratePtz(ptz = {}) {
  const defaultPresets = new Map(defaultState.ptz.presets.map((preset) => [preset.id, preset]));
  const savedPresets = Array.isArray(ptz.presets) && ptz.presets.length ? ptz.presets : defaultState.ptz.presets;
  const presets = isLegacyDefaultPresetList(savedPresets) ? defaultState.ptz.presets : savedPresets;
  return {
    ...ptz,
    presets: presets.map((preset) => ({
      ...defaultPresets.get(preset.id),
      ...preset
    })),
    lastRecalledPresetId: ptz.lastRecalledPresetId || null
  };
}

function isLegacyDefaultPresetList(presets) {
  return JSON.stringify(presets.map((preset) => preset.id)) === JSON.stringify(["pulpit", "wide", "choir"]);
}

function migrateSource(source = {}) {
  const type = ["ndi", "network"].includes(source.type) ? source.type : "ndi";
  return {
    ...source,
    type,
    ndi: {
      sourceName: String(source.ndi?.sourceName || ""),
      urlAddress: String(source.ndi?.urlAddress || ""),
      discoveryServer: String(source.ndi?.discoveryServer || "")
    }
  };
}

export function mergeState(base, override) {
  if (Array.isArray(base)) return Array.isArray(override) ? override : structuredClone(base);
  if (!base || typeof base !== "object") return override ?? base;
  const merged = structuredClone(base);
  for (const [key, value] of Object.entries(override || {})) {
    merged[key] = mergeState(base[key], value);
  }
  return merged;
}
