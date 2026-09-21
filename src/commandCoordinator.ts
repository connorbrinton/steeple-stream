import { EventEmitter } from "node:events";
import type { BroadcastService } from "./broadcastService.js";
import type { Actor, BroadcastAssociation, SceneMode } from "./domain.js";

type CoordinatedService = Pick<
  BroadcastService,
  | "start"
  | "end"
  | "setMode"
  | "updateSource"
  | "updateCameraControlSource"
  | "addManualSource"
  | "recallPreset"
  | "capturePreset"
  | "summary"
>;
type PublicState = Awaited<ReturnType<BroadcastService["summary"]>>;

interface IngestManager {
  on?(event: "changed", listener: () => void): unknown;
  startForState(state: PublicState): Promise<unknown>;
  restartForState(state: PublicState): Promise<unknown>;
}

interface MediaManager {
  setRecording?(enabled: boolean): Promise<unknown>;
}

interface LocationCommandCoordinatorOptions {
  service: CoordinatedService;
  ingestManager: IngestManager;
  mediaManager?: MediaManager | null;
}

export class LocationCommandCoordinator extends EventEmitter {
  declare service: CoordinatedService;
  declare ingestManager: IngestManager;
  declare mediaManager: MediaManager | null;

  constructor({ service, ingestManager, mediaManager = null }: LocationCommandCoordinatorOptions) {
    super();
    this.service = service;
    this.ingestManager = ingestManager;
    this.mediaManager = mediaManager;
    this.ingestManager?.on?.("changed", () => this.emit("health-changed"));
  }

  async start(actor: Actor | null = null, association: BroadcastAssociation | null = null) {
    const state = await this.service.start(actor, association);
    await this.ingestManager.startForState(state);
    await this.mediaManager?.setRecording?.(true);
    return this.changed(await this.service.summary());
  }

  async end(actor: Actor | null = null) {
    await this.mediaManager?.setRecording?.(false);
    return this.changed(await this.service.end(actor));
  }

  async setMode(mode: SceneMode, actor: Actor | null = null) {
    const state = await this.service.setMode(mode, actor);
    await this.ingestManager.startForState(state);
    return this.changed(state);
  }

  async updateSource(source: unknown, actor: Actor | null = null) {
    const state = await this.service.updateSource(source, actor);
    await this.ingestManager.restartForState(state);
    return this.changed(state);
  }

  async updateCameraControlSource(source: unknown, actor: Actor | null = null) {
    const state = await this.service.updateCameraControlSource(source, actor);
    return this.changed(state);
  }

  async addConfiguredSource(source: unknown, actor: Actor | null = null) {
    const state = await this.service.addManualSource(source, actor);
    return this.changed(state);
  }

  async addManualSource(source: unknown, actor: Actor | null = null) {
    const state = await this.service.addManualSource(source, actor);
    return this.changed(state);
  }

  async recallPreset(presetId: string, actor: Actor | null = null) {
    const result = await this.service.recallPreset(presetId, actor);
    this.emit("changed");
    return result;
  }

  async capturePreset(presetId: string, actor: Actor | null = null) {
    const result = await this.service.capturePreset(presetId, actor);
    this.emit("changed");
    return result;
  }

  changed<T>(state: T): T {
    this.emit("changed", state);
    return state;
  }
}
