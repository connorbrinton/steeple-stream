import crypto from "node:crypto";
import type {
  Actor,
  ApplicationState,
  Playback,
  PtzPosition,
  PtzPreset,
  SceneMode,
  StateStore,
  VideoSource,
} from "./domain.js";
import { sourceId } from "./sourceCatalog.js";

interface BroadcastServiceConfig {
  retentionHours: number;
  channelId: string;
  capabilities: unknown;
}

interface MediaBackend {
  getPlayback(channelId: string): Playback;
}

interface PtzTransportResult {
  transport: string;
  status: string;
  [key: string]: unknown;
}

interface PtzController {
  recallPreset(options: { preset: PtzPreset; source: VideoSource }): Promise<PtzTransportResult>;
  capturePosition(options: { source: VideoSource }): Promise<PtzPosition>;
}

interface BroadcastServiceOptions {
  store: StateStore;
  mediaBackend: MediaBackend;
  config: BroadcastServiceConfig;
  ptzController?: PtzController | null;
}

export class BroadcastService {
  declare store: StateStore;
  declare mediaBackend: MediaBackend;
  declare config: BroadcastServiceConfig;
  declare ptzController: PtzController | null;

  constructor({ store, mediaBackend, config, ptzController = null }: BroadcastServiceOptions) {
    this.store = store;
    this.mediaBackend = mediaBackend;
    this.config = config;
    this.ptzController = ptzController;
  }

  async summary() {
    const state = await this.store.read();
    return this.publicState(state);
  }

  async publicSummary() {
    const state = await this.store.read();
    return {
      broadcast:
        state.broadcast.status === "offline"
          ? { ...state.broadcast, playback: null }
          : state.broadcast,
      viewerCount: this.store.activePlaybackCount?.(state.broadcast.id) ?? 0,
    };
  }

  async start(actor: Actor | null = null) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.retentionHours * 60 * 60 * 1000);
    const playback = this.mediaBackend.getPlayback(this.config.channelId);

    return this.store.update((state) => {
      if (state.broadcast.status === "live") return this.publicState(state);
      const mode: SceneMode = ["chapel", "sacrament"].includes(state.broadcast.mode)
        ? state.broadcast.mode
        : "chapel";
      const broadcastId = crypto.randomUUID();
      state.broadcast = {
        id: broadcastId,
        channelId: this.config.channelId,
        status: "live",
        mode,
        startedAt: now.toISOString(),
        endedAt: null,
        expiresAt: expiresAt.toISOString(),
        playback,
      };
      state.recordings.push({
        id: broadcastId,
        channelId: this.config.channelId,
        startedAt: now.toISOString(),
        endedAt: null,
        expiresAt: expiresAt.toISOString(),
        status: "recording",
        path: null,
      });
      appendAudit(state, "broadcast.start", {
        broadcastId: state.broadcast.id,
        actor: auditActor(actor),
      });
      return this.publicState(state);
    });
  }

  async setMode(mode: SceneMode, actor: Actor | null = null) {
    if (!["chapel", "sacrament"].includes(mode)) {
      const error = new Error("Mode must be chapel or sacrament");
      error.status = 400;
      throw error;
    }
    return this.store.update((state) => {
      state.broadcast.mode = mode;
      appendAudit(state, "broadcast.mode", { mode, actor: auditActor(actor) });
      return this.publicState(state);
    });
  }

  async end(actor: Actor | null = null) {
    const now = new Date();
    return this.store.update((state) => {
      if (state.broadcast.status === "offline") {
        return this.publicState(state);
      }
      state.broadcast.status = "replay";
      state.broadcast.endedAt = now.toISOString();
      state.broadcast.playback = {
        recordingUrl: `/recordings/${encodeURIComponent(state.broadcast.id || "")}`,
      };
      const recording = state.recordings.find((entry) => entry.id === state.broadcast.id);
      if (recording) {
        recording.endedAt = now.toISOString();
        recording.status = "available";
        recording.path = `/recordings/${encodeURIComponent(recording.id)}`;
      }
      appendAudit(state, "broadcast.end", {
        broadcastId: state.broadcast.id,
        actor: auditActor(actor),
      });
      return this.publicState(state);
    });
  }

  async cleanupExpired(referenceDate = new Date()) {
    return this.store.update((state) => {
      const before = state.recordings.length;
      const retained = [];
      for (const recording of state.recordings) {
        if (recording.expiresAt && new Date(recording.expiresAt) <= referenceDate) {
          appendAudit(state, "recording.delete", {
            recordingId: recording.id,
            reason: "retention_expired",
          });
        } else {
          retained.push(recording);
        }
      }
      state.recordings = retained;
      if (state.broadcast.expiresAt && new Date(state.broadcast.expiresAt) <= referenceDate) {
        state.broadcast = {
          id: null,
          channelId: this.config.channelId,
          status: "offline",
          mode: "chapel",
          startedAt: null,
          endedAt: null,
          expiresAt: null,
          playback: null,
        };
      }
      return { deleted: before - retained.length, state: this.publicState(state) };
    });
  }

  async registerViewer({
    name,
    sessionId,
  }: {
    name: unknown;
    sessionId: unknown;
    userAgent?: unknown;
    ip?: unknown;
  }) {
    const viewerName = String(name || "")
      .trim()
      .slice(0, 80);
    if (!viewerName) {
      const error = new Error("Viewer name is required");
      error.status = 400;
      throw error;
    }
    return { id: sessionId || crypto.randomUUID(), name: viewerName };
  }

  async updateSource(source: unknown, actor: Actor | null = null) {
    const normalized = normalizeSource(source);
    return this.store.update((state) => {
      state.source = normalized;
      appendAudit(state, "source.update", { type: normalized.type, actor: auditActor(actor) });
      return this.publicState(state);
    });
  }

  async updateCameraControlSource(source: unknown, actor: Actor | null = null) {
    const normalized = normalizeSource(source);
    if (normalized.type !== "ndi" || !normalized.ndi.sourceName) {
      const error = new Error("Camera control source must be an NDI source");
      error.status = 400;
      throw error;
    }
    return this.store.update((state) => {
      state.cameraControlSource = normalized;
      appendAudit(state, "camera-control-source.update", {
        type: normalized.type,
        actor: auditActor(actor),
      });
      return this.publicState(state);
    });
  }

  async addManualSource(source: unknown, actor: Actor | null = null) {
    const normalized = normalizeSource(source);
    if (!sourceId(normalized)) {
      const error = new Error("Source name or URI is required");
      error.status = 400;
      throw error;
    }
    return this.store.update((state) => {
      const key = sourceId(normalized);
      state.manualSources = Array.isArray(state.manualSources) ? state.manualSources : [];
      const index = state.manualSources.findIndex((entry) => sourceId(entry) === key);
      if (index >= 0) state.manualSources[index] = normalized;
      else state.manualSources.push(normalized);
      appendAudit(state, "source.manual.save", {
        type: normalized.type,
        key,
        actor: auditActor(actor),
      });
      return this.publicState(state);
    });
  }

  async addConfiguredSource(source: unknown, actor: Actor | null = null) {
    return this.addManualSource(source, actor);
  }

  async recallPreset(presetId: string, actor: Actor | null = null) {
    const current = await this.store.read();
    const target = current.ptz.presets.find((entry) => entry.id === presetId);
    if (!target) {
      const error = new Error("Unknown PTZ preset");
      error.status = 404;
      throw error;
    }
    const controlSource = cameraControlSourceFor(current);
    const transport = this.ptzController
      ? await this.ptzController.recallPreset({ preset: target, source: controlSource })
      : { transport: "not_configured", status: "recorded" };

    return this.store.update((state) => {
      const preset = state.ptz.presets.find((entry) => entry.id === presetId);
      appendAudit(state, "ptz.recall", {
        presetId,
        transport: transport.transport,
        status: transport.status,
        actor: auditActor(actor),
      });
      return { preset, transport };
    });
  }

  async capturePreset(presetId: string, actor: Actor | null = null) {
    if (!this.ptzController)
      throw Object.assign(new Error("PTZ control is not configured"), { status: 409 });
    const current = await this.store.read();
    const target = current.ptz.presets.find((entry) => entry.id === presetId);
    if (!target) throw Object.assign(new Error("Unknown PTZ preset"), { status: 404 });
    const position = await this.ptzController.capturePosition({
      source: cameraControlSourceFor(current),
    });
    return this.store.update((state) => {
      const preset = state.ptz.presets.find((entry) => entry.id === presetId);
      if (!preset) throw Object.assign(new Error("Unknown PTZ preset"), { status: 404 });
      preset.position = position;
      appendAudit(state, "ptz.capture", { presetId, actor: auditActor(actor) });
      return { preset };
    });
  }

  publicState(state: ApplicationState) {
    return {
      capabilities: this.config.capabilities,
      broadcast: state.broadcast,
      preview: this.mediaBackend.getPlayback(this.config.channelId),
      source: state.source,
      cameraControlSource: state.cameraControlSource || null,
      manualSources: state.manualSources || [],
      configuredSources: state.manualSources || [],
      viewerCount: this.store.activePlaybackCount?.(state.broadcast.id) ?? 0,
      ptz: state.ptz,
      recordings: state.recordings,
      auditLog: state.auditLog.slice(-50),
    };
  }
}

function cameraControlSourceFor(state: ApplicationState): VideoSource {
  if (state.cameraControlSource?.type === "ndi" && state.cameraControlSource.ndi?.sourceName)
    return state.cameraControlSource;
  if (state.source?.type === "ndi" && state.source.ndi?.sourceName) return state.source;
  return state.cameraControlSource || state.source;
}

function auditActor(
  actor: Actor | null,
): { type: string; id: string | null; name: string | null } | null {
  if (!actor) return null;
  return {
    type: actor.type || "user",
    id: actor.id || actor.email || null,
    name: actor.name || actor.email || null,
  };
}

function normalizeSource(value: unknown = {}): VideoSource {
  const source = asRecord(value);
  const ndi = asRecord(source.ndi);
  const capture = asRecord(source.capture);
  const network = asRecord(source.network);
  const type = source.type === "network" ? "network" : "ndi";
  return {
    type,
    ndi: {
      sourceName: String(ndi.sourceName || "")
        .trim()
        .slice(0, 160),
      urlAddress: String(ndi.urlAddress || "")
        .trim()
        .slice(0, 160),
      discoveryServer: String(ndi.discoveryServer || "")
        .trim()
        .slice(0, 160),
    },
    capture: {
      videoDevice: String(capture.videoDevice || "")
        .trim()
        .slice(0, 160),
      audioDevice: String(capture.audioDevice || "")
        .trim()
        .slice(0, 160),
      resolution: String(capture.resolution || "1920x1080")
        .trim()
        .slice(0, 40),
      frameRate: Number(capture.frameRate || 30),
    },
    network: {
      uri: String(network.uri || "")
        .trim()
        .slice(0, 500),
      protocol: network.protocol === "srt" ? "srt" : "rtsp",
    },
    notes: String(source.notes || "")
      .trim()
      .slice(0, 1000),
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function appendAudit(
  state: ApplicationState,
  event: string,
  details: Record<string, unknown> = {},
): void {
  state.auditLog.push({
    id: crypto.randomUUID(),
    event,
    details,
    createdAt: new Date().toISOString(),
  });
  if (state.auditLog.length > 500) {
    state.auditLog.splice(0, state.auditLog.length - 500);
  }
}
