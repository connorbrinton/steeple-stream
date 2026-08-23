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
  cameraControlSource: null,
  manualSources: [],
  viewers: [],
  ptz: {
    presets: [
      { id: "full-stand", name: "Full Stand", protocol: "ndi", ndiPreset: 1, viscaPreset: 1, position: null },
      { id: "pulpit", name: "Pulpit", protocol: "ndi", ndiPreset: 2, viscaPreset: 2, position: null },
      { id: "music-director", name: "Music Director", protocol: "ndi", ndiPreset: 8, viscaPreset: 8, position: null },
      { id: "choir", name: "Choir", protocol: "ndi", ndiPreset: 12, viscaPreset: 12, position: null },
      { id: "piano", name: "Piano", protocol: "ndi", ndiPreset: 13, viscaPreset: 13, position: null },
      { id: "pulpit-wide", name: "Pulpit Wide", protocol: "ndi", ndiPreset: 16, viscaPreset: 16, position: null },
      { id: "ndi-raw-1", name: "1", protocol: "ndi", ndiPreset: 1, viscaPreset: 1, position: null },
      { id: "ndi-raw-2", name: "2", protocol: "ndi", ndiPreset: 2, viscaPreset: 2, position: null },
      { id: "ndi-raw-3", name: "3", protocol: "ndi", ndiPreset: 3, viscaPreset: 3, position: null },
      { id: "ndi-raw-4", name: "4", protocol: "ndi", ndiPreset: 4, viscaPreset: 4, position: null },
      { id: "ndi-raw-5", name: "5", protocol: "ndi", ndiPreset: 5, viscaPreset: 5, position: null },
      { id: "ndi-raw-6", name: "6", protocol: "ndi", ndiPreset: 6, viscaPreset: 6, position: null },
      { id: "ndi-raw-7", name: "7", protocol: "ndi", ndiPreset: 7, viscaPreset: 7, position: null },
      { id: "ndi-raw-8", name: "8", protocol: "ndi", ndiPreset: 8, viscaPreset: 8, position: null },
      { id: "ndi-raw-9", name: "9", protocol: "ndi", ndiPreset: 9, viscaPreset: 9, position: null },
      { id: "ndi-raw-10", name: "10", protocol: "ndi", ndiPreset: 10, viscaPreset: 10, position: null },
      { id: "ndi-raw-11", name: "11", protocol: "ndi", ndiPreset: 11, viscaPreset: 11, position: null },
      { id: "ndi-raw-12", name: "12", protocol: "ndi", ndiPreset: 12, viscaPreset: 12, position: null },
      { id: "ndi-raw-13", name: "13", protocol: "ndi", ndiPreset: 13, viscaPreset: 13, position: null },
      { id: "ndi-raw-14", name: "14", protocol: "ndi", ndiPreset: 14, viscaPreset: 14, position: null },
      { id: "ndi-raw-15", name: "15", protocol: "ndi", ndiPreset: 15, viscaPreset: 15, position: null },
      { id: "ndi-raw-16", name: "16", protocol: "ndi", ndiPreset: 16, viscaPreset: 16, position: null },
      { id: "ndi-raw-17", name: "17", protocol: "ndi", ndiPreset: 17, viscaPreset: 17, position: null },
      { id: "ndi-raw-18", name: "18", protocol: "ndi", ndiPreset: 18, viscaPreset: 18, position: null }
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
  migrated.cameraControlSource = migrated.cameraControlSource ? migrateSource(migrated.cameraControlSource) : null;
  migrated.manualSources = migrateManualSources(migrated.manualSources, migrated.configuredSources);
  delete migrated.configuredSources;
  migrated.ptz = migratePtz(migrated.ptz);
  return migrated;
}

function migratePtz(ptz = {}) {
  const defaultPresets = new Map(defaultState.ptz.presets.map((preset) => [preset.id, preset]));
  const savedPresets = Array.isArray(ptz.presets) && ptz.presets.length ? ptz.presets : defaultState.ptz.presets;
  const presets = isLegacyDefaultPresetList(savedPresets) ? defaultState.ptz.presets : savedPresets;
  const mergedPresets = presets.map((preset) => ({
      ...defaultPresets.get(preset.id),
      ...preset
    }));
  for (const preset of defaultState.ptz.presets) {
    if (!mergedPresets.some((entry) => entry.id === preset.id)) mergedPresets.push(preset);
  }
  return {
    ...ptz,
    presets: mergedPresets,
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

function migrateManualSources(manualSources = [], configuredSources = []) {
  const sources = Array.isArray(manualSources) && manualSources.length ? manualSources : configuredSources;
  return Array.isArray(sources) ? sources.map(migrateSource) : [];
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
