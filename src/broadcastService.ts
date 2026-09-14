import crypto from "node:crypto";
import { sourceId } from "./sourceCatalog.js";

export class BroadcastService {
  declare store: any;
  declare mediaBackend: any;
  declare config: any;
  declare ptzController: any;

  constructor({ store, mediaBackend, config, ptzController = null }) {
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
      broadcast: state.broadcast.status === "offline"
        ? { ...state.broadcast, playback: null }
        : state.broadcast,
      viewerCount: this.store.activePlaybackCount?.(state.broadcast.id) ?? 0
    };
  }

  async start(actor = null) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.retentionHours * 60 * 60 * 1000);
    const playback = this.mediaBackend.getPlayback(this.config.channelId);

    return this.store.update((state) => {
      if (state.broadcast.status === "live") return this.publicState(state);
      const mode = ["chapel", "sacrament"].includes(state.broadcast.mode) ? state.broadcast.mode : "chapel";
      state.broadcast = {
        id: crypto.randomUUID(),
        channelId: this.config.channelId,
        status: "live",
        mode,
        startedAt: now.toISOString(),
        endedAt: null,
        expiresAt: expiresAt.toISOString(),
        playback
      };
      state.recordings.push({
        id: state.broadcast.id,
        channelId: this.config.channelId,
        startedAt: now.toISOString(),
        endedAt: null,
        expiresAt: expiresAt.toISOString(),
        status: "recording",
        path: null
      });
      appendAudit(state, "broadcast.start", { broadcastId: state.broadcast.id, actor: auditActor(actor) });
      return this.publicState(state);
    });
  }

  async setMode(mode, actor = null) {
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

  async end(actor = null) {
    const now = new Date();
    return this.store.update((state) => {
      if (state.broadcast.status === "offline") {
        return this.publicState(state);
      }
      state.broadcast.status = "replay";
      state.broadcast.endedAt = now.toISOString();
      state.broadcast.playback = {
        recordingUrl: `/recordings/${encodeURIComponent(state.broadcast.id)}`
      };
      const recording = state.recordings.find((entry) => entry.id === state.broadcast.id);
      if (recording) {
        recording.endedAt = now.toISOString();
        recording.status = "available";
        recording.path = `/recordings/${encodeURIComponent(recording.id)}`;
      }
      appendAudit(state, "broadcast.end", { broadcastId: state.broadcast.id, actor: auditActor(actor) });
      return this.publicState(state);
    });
  }

  async cleanupExpired(referenceDate = new Date()) {
    return this.store.update((state) => {
      const before = state.recordings.length;
      const retained = [];
      for (const recording of state.recordings) {
        if (recording.expiresAt && new Date(recording.expiresAt) <= referenceDate) {
          appendAudit(state, "recording.delete", { recordingId: recording.id, reason: "retention_expired" });
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
          playback: null
        };
      }
      return { deleted: before - retained.length, state: this.publicState(state) };
    });
  }

  async registerViewer({ name, sessionId }: { name: any; sessionId: any; userAgent?: unknown; ip?: unknown }) {
    const viewerName = String(name || "").trim().slice(0, 80);
    if (!viewerName) {
      const error = new Error("Viewer name is required");
      error.status = 400;
      throw error;
    }
    return { id: sessionId || crypto.randomUUID(), name: viewerName };
  }

  async updateSource(source, actor = null) {
    const normalized = normalizeSource(source);
    return this.store.update((state) => {
      state.source = normalized;
      appendAudit(state, "source.update", { type: normalized.type, actor: auditActor(actor) });
      return this.publicState(state);
    });
  }

  async updateCameraControlSource(source, actor = null) {
    const normalized = normalizeSource(source);
    if (normalized.type !== "ndi" || !normalized.ndi.sourceName) {
      const error = new Error("Camera control source must be an NDI source");
      error.status = 400;
      throw error;
    }
    return this.store.update((state) => {
      state.cameraControlSource = normalized;
      appendAudit(state, "camera-control-source.update", { type: normalized.type, actor: auditActor(actor) });
      return this.publicState(state);
    });
  }

  async addManualSource(source, actor = null) {
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
      appendAudit(state, "source.manual.save", { type: normalized.type, key, actor: auditActor(actor) });
      return this.publicState(state);
    });
  }

  async addConfiguredSource(source, actor = null) {
    return this.addManualSource(source, actor);
  }

  async recallPreset(presetId, actor = null) {
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
      appendAudit(state, "ptz.recall", { presetId, transport: transport.transport, status: transport.status, actor: auditActor(actor) });
      return { preset, transport };
    });
  }

  async capturePreset(presetId, actor = null) {
    if (!this.ptzController) throw Object.assign(new Error("PTZ control is not configured"), { status: 409 });
    const current = await this.store.read();
    const target = current.ptz.presets.find((entry) => entry.id === presetId);
    if (!target) throw Object.assign(new Error("Unknown PTZ preset"), { status: 404 });
    const position = await this.ptzController.capturePosition({ source: cameraControlSourceFor(current) });
    return this.store.update((state) => {
      const preset = state.ptz.presets.find((entry) => entry.id === presetId);
      preset.position = position;
      appendAudit(state, "ptz.capture", { presetId, actor: auditActor(actor) });
      return { preset };
    });
  }

  publicState(state) {
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
      auditLog: state.auditLog.slice(-50)
    };
  }
}

function cameraControlSourceFor(state) {
  if (state.cameraControlSource?.type === "ndi" && state.cameraControlSource.ndi?.sourceName) return state.cameraControlSource;
  if (state.source?.type === "ndi" && state.source.ndi?.sourceName) return state.source;
  return state.cameraControlSource || state.source;
}

function auditActor(actor) {
  if (!actor) return null;
  return { type: actor.type || "user", id: actor.id || actor.email || null, name: actor.name || actor.email || null };
}

function normalizeSource(source: any = {}) {
  const type = ["ndi", "network"].includes(source.type) ? source.type : "ndi";
  return {
    type,
    ndi: {
      sourceName: String(source.ndi?.sourceName || "").trim().slice(0, 160),
      urlAddress: String(source.ndi?.urlAddress || "").trim().slice(0, 160),
      discoveryServer: String(source.ndi?.discoveryServer || "").trim().slice(0, 160)
    },
    capture: {
      videoDevice: String(source.capture?.videoDevice || "").trim().slice(0, 160),
      audioDevice: String(source.capture?.audioDevice || "").trim().slice(0, 160),
      resolution: String(source.capture?.resolution || "1920x1080").trim().slice(0, 40),
      frameRate: Number(source.capture?.frameRate || 30)
    },
    network: {
      uri: String(source.network?.uri || "").trim().slice(0, 500),
      protocol: ["rtsp", "srt"].includes(source.network?.protocol) ? source.network.protocol : "rtsp"
    },
    notes: String(source.notes || "").trim().slice(0, 1000)
  };
}

export function appendAudit(state, event, details = {}) {
  state.auditLog.push({
    id: crypto.randomUUID(),
    event,
    details,
    createdAt: new Date().toISOString()
  });
  if (state.auditLog.length > 500) {
    state.auditLog.splice(0, state.auditLog.length - 500);
  }
}
