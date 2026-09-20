import fs from "node:fs/promises";
import path from "node:path";
import type { ApplicationState, PtzPreset, StateMutator, VideoSource } from "./domain.js";

export const defaultState: ApplicationState = {
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
      { id: "pulpit", name: "Pulpit", group: "Stand", protocol: "ndi", ndiPreset: 18, position: null },
      { id: "first-row", name: "1st Row", group: "Stand", protocol: "ndi", ndiPreset: 12, position: null },
      { id: "stand-congregation", name: "Stand + Congregation", group: "Stand", protocol: "ndi", ndiPreset: 13, position: null },
      { id: "pulpit-wide", name: "Pulpit Wide", group: "Stand", protocol: "ndi", ndiPreset: 2, position: null },
      { id: "music-leader", name: "Music Leader", group: "Music", protocol: "ndi", ndiPreset: 8, position: null },
      { id: "choir", name: "Choir", group: "Music", protocol: "ndi", ndiPreset: 1, position: null },
      { id: "piano", name: "Piano", group: "Music", protocol: "ndi", ndiPreset: 16, position: null },
      { id: "organ", name: "Organ", group: "Music", protocol: "ndi", ndiPreset: 9, position: null },
      { id: "chapel", name: "Chapel", group: "Congregation", protocol: "ndi", ndiPreset: 4, position: null },
      { id: "overflow", name: "Overflow", group: "Congregation", protocol: "ndi", ndiPreset: 6, position: null },
      { id: "cultural-hall", name: "Cultural Hall", group: "Congregation", protocol: "ndi", ndiPreset: 7, position: null }
    ],
    lastRecalledPresetId: null
  },
  recordings: [],
  auditLog: []
};

export class JsonStore {
  declare filePath: string;
  declare state: ApplicationState;
  declare loaded: boolean;
  declare writeQueue: Promise<void>;

  constructor(filePath: string) {
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
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await this.save();
    }
    this.loaded = true;
    return this.state;
  }

  async read() {
    await this.load();
    return structuredClone(this.state);
  }

  async update<T>(mutator: StateMutator<T>): Promise<T> {
    await this.load();
    const result = await mutator(this.state);
    await this.save();
    return result ?? structuredClone(this.state) as T;
  }

  async save() {
    const payload = JSON.stringify(this.state, null, 2);
    this.writeQueue = this.writeQueue.then(() => fs.writeFile(this.filePath, `${payload}\n`));
    return this.writeQueue;
  }
}

export function migrateState(state: unknown = {}): ApplicationState {
  const migrated = mergeState(defaultState, state);
  migrated.source = migrateSource(migrated.source);
  migrated.cameraControlSource = migrated.cameraControlSource ? migrateSource(migrated.cameraControlSource) : null;
  migrated.manualSources = migrateManualSources(migrated.manualSources, migrated.configuredSources);
  delete migrated.configuredSources;
  migrated.ptz = migratePtz(migrated.ptz);
  return migrated;
}

function migratePtz(value: unknown = {}): ApplicationState["ptz"] {
  const ptz = asRecord(value);
  const defaultPresets = new Map(defaultState.ptz.presets.map((preset) => [preset.id, preset]));
  const candidates = Array.isArray(ptz.presets) && ptz.presets.length ? ptz.presets.filter(isPresetCandidate) : defaultState.ptz.presets;
  const savedPresets = candidates.filter(isPtzPreset);
  const legacyIds = new Set(["pulpit", "wide", "choir", "full-stand", "music-director", "piano", "pulpit-wide",
    ...Array.from({ length: 18 }, (_, index) => `ndi-raw-${index + 1}`)]);
  const replaceCatalog = isLegacyDefaultPresetList(candidates)
    || candidates.some((preset) => ["full-stand", "music-director"].includes(preset.id) || /^ndi-raw-\d+$/.test(preset.id));
  // Replace the unverified catalog without carrying positions across changed camera mappings.
  const presets = replaceCatalog
    ? [...structuredClone(defaultState.ptz.presets), ...savedPresets.filter((preset) => !legacyIds.has(preset.id) && !defaultPresets.has(preset.id))]
    : savedPresets;
  const mergedPresets = presets.map((preset) => ({
      ...defaultPresets.get(preset.id),
      ...preset
    }));
  for (const preset of defaultState.ptz.presets) {
    if (!mergedPresets.some((entry) => entry.id === preset.id)) mergedPresets.push(structuredClone(preset));
  }
  return {
    ...ptz,
    presets: mergedPresets,
    lastRecalledPresetId: replaceCatalog ? null : typeof ptz.lastRecalledPresetId === "string" ? ptz.lastRecalledPresetId : null
  };
}

function isLegacyDefaultPresetList(presets: Array<{ id: string }>) {
  return JSON.stringify(presets.map((preset) => preset.id)) === JSON.stringify(["pulpit", "wide", "choir"]);
}

function migrateSource(value: unknown = {}): VideoSource {
  const source = asRecord(value);
  const ndi = asRecord(source.ndi);
  const capture = asRecord(source.capture);
  const network = asRecord(source.network);
  const type = source.type === "network" ? "network" : "ndi";
  return {
    ...source,
    type,
    ndi: {
      sourceName: String(ndi.sourceName || ""),
      urlAddress: String(ndi.urlAddress || ""),
      discoveryServer: String(ndi.discoveryServer || "")
    },
    capture: {
      videoDevice: String(capture.videoDevice || ""),
      audioDevice: String(capture.audioDevice || ""),
      resolution: String(capture.resolution || "1920x1080"),
      frameRate: Number(capture.frameRate || 30)
    },
    network: {
      uri: String(network.uri || ""),
      protocol: network.protocol === "srt" ? "srt" : "rtsp"
    },
    notes: String(source.notes || "")
  };
}

function migrateManualSources(manualSources: unknown = [], configuredSources: unknown = []): VideoSource[] {
  const sources = Array.isArray(manualSources) && manualSources.length ? manualSources : configuredSources;
  return Array.isArray(sources) ? sources.map(migrateSource) : [];
}

export function mergeState<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(override) ? override : structuredClone(base)) as T;
  if (!base || typeof base !== "object") return (override ?? base) as T;
  const baseRecord = base as Record<string, unknown>;
  const merged = structuredClone(baseRecord);
  for (const [key, value] of Object.entries(asRecord(override))) {
    merged[key] = mergeState(baseRecord[key], value);
  }
  return merged as T;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function isPtzPreset(value: unknown): value is PtzPreset {
  const preset = asRecord(value);
  return typeof preset.id === "string" && typeof preset.name === "string" && typeof preset.ndiPreset === "number";
}

function isPresetCandidate(value: unknown): value is { id: string } {
  return typeof asRecord(value).id === "string";
}
