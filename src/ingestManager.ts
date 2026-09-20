import {
  defaultNdiNixPackage,
  type EngineExitEvent,
  type GStreamerConfig,
  GStreamerMediaEngine,
  type GStreamerRunner,
  type IngestStatus,
  gstPluginPackages,
  gstRuntimePackages,
  ndiToRtmpPipeline,
  sacramentSlateToRtmpPipeline,
  switchableNdiSlateToRtmpCommand,
  type StartSceneOptions
} from "./gstreamerMediaEngine.js";
import { discoverNdiSources, type NdiSource } from "./sourceDiscovery.js";
import { EventEmitter } from "node:events";
import type { ApplicationState, VideoSource } from "./domain.js";

interface IngestConfig extends GStreamerConfig {
  autoStart: boolean;
  sceneControls?: boolean;
}

type RequestedState = Pick<ApplicationState, "source" | "broadcast">;
type NdiDiscovery = (source?: VideoSource | null) => Promise<NdiSource[]>;

export {
  defaultNdiNixPackage,
  gstPluginPackages,
  gstRuntimePackages,
  ndiToRtmpPipeline,
  sacramentSlateToRtmpPipeline,
  switchableNdiSlateToRtmpCommand
};

export class IngestManager extends EventEmitter {
  declare config: IngestConfig;
  declare ndiDiscovery: NdiDiscovery;
  declare currentSourceKey: string | null;
  declare currentConfiguredSourceKey: string | null;
  declare retryTimer: NodeJS.Timeout | null;
  declare retryAttempt: number;
  declare lastRequestedState: RequestedState | null;
  declare engine: GStreamerMediaEngine;

  constructor({ config, cwd = process.cwd(), runner, ndiDiscovery = discoverNdiSources }: {
    config: IngestConfig;
    cwd?: string;
    runner?: GStreamerRunner;
    ndiDiscovery?: NdiDiscovery;
  }) {
    super();
    this.config = config;
    this.ndiDiscovery = ndiDiscovery;
    this.currentSourceKey = null;
    this.currentConfiguredSourceKey = null;
    this.retryTimer = null;
    this.retryAttempt = 0;
    this.lastRequestedState = null;
    this.engine = new GStreamerMediaEngine({
      config,
      cwd,
      runner,
      onExit: (event) => this.handleEngineExit(event)
    });
    this.engine.on("changed", (status) => this.emit("changed", status));
  }

  async startForState(state: RequestedState): Promise<IngestStatus> {
    this.lastRequestedState = structuredClone(state);
    let source = state.source;
    const mode = this.config.sceneControls === false ? "chapel" : state.broadcast?.mode === "sacrament" ? "sacrament" : "chapel";

    if (!this.config.autoStart) {
      this.engine.setState({ status: "disabled", message: "Ingest autostart is disabled." });
      return this.status();
    }

    if (mode === "sacrament") {
      if (this.engine.running) {
        this.engine.setMode(mode);
        return this.status();
      }

      if (!hasConfiguredSource(source)) {
        const sourceKey = JSON.stringify({ type: "slate-only" });
        if (this.engine.running && this.currentSourceKey === sourceKey) return this.status();
        await this.stop();
        this.currentSourceKey = sourceKey;
        await this.startScene({ mode, sourceName: null, pipelineType: "slate-only" });
        return this.status();
      }

      source = await this.resolveRuntimeSource(source);
      this.currentSourceKey = runtimeSourceKey(source);
      this.currentConfiguredSourceKey = configuredSourceKey(source);
      await this.startScene({ mode, source, pipelineType: "switcher" });
      return this.status();
    }

    if (!source || !["ndi", "network"].includes(source.type)) {
      await this.stop();
      this.engine.setState({ status: "stopped", sourceType: source?.type || null, message: "No supported source is selected." });
      return this.status();
    }

    if (source.type === "ndi" && !source.ndi?.sourceName) {
      await this.stop();
      this.engine.setState({ status: "waiting", sourceType: "ndi", sourceName: null, message: "Select an NDI source to start ingest." });
      return this.status();
    }

    if (source.type === "network" && !source.network?.uri) {
      await this.stop();
      this.engine.setState({ status: "waiting", sourceType: "network", sourceName: null, message: "Enter a network source URI to start ingest." });
      return this.status();
    }

    if (this.engine.running && this.currentConfiguredSourceKey === configuredSourceKey(source)) {
      this.engine.setMode(mode);
      return this.status();
    }

    source = await this.resolveRuntimeSource(source);
    const sourceKey = runtimeSourceKey(source);
    if (this.engine.running && this.currentSourceKey === sourceKey) {
      this.engine.setMode(mode);
      return this.status();
    }

    await this.stop();
    this.currentSourceKey = sourceKey;
    this.currentConfiguredSourceKey = configuredSourceKey(source);
    await this.startScene({ mode, source, pipelineType: "switcher" });
    return this.status();
  }

  async restartForState(state: RequestedState): Promise<IngestStatus> {
    await this.stop();
    return this.startForState(state);
  }

  async startScene(options: StartSceneOptions): Promise<void> {
    this.clearRetry();
    await this.engine.startScene(options);
    this.retryAttempt = 0;
  }

  async stop() {
    this.clearRetry();
    await this.engine.stop();
    this.currentSourceKey = null;
    this.currentConfiguredSourceKey = null;
  }

  handleEngineExit({ code, signal, sdkMissing, stopping }: EngineExitEvent): void {
    const shouldRetry = !stopping && !sdkMissing && this.lastRequestedState && this.config.autoStart;
    if (!shouldRetry) return;

    this.engine.setState({
      status: "starting",
      message: `Ingest exited with code=${code} signal=${signal}; retrying shortly.`
    });
    this.scheduleRetry();
  }

  scheduleRetry() {
    this.retryAttempt += 1;
    const delayMs = Math.min(10000, 1000 * this.retryAttempt);
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      const requestedState = this.lastRequestedState;
      if (!requestedState) return;
      this.startForState(requestedState).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        this.engine.setState({
          status: "failed",
          message: `Failed to restart ingest: ${message}`,
          lastError: {
            category: "supervisor",
            message,
            at: new Date().toISOString()
          }
        });
        this.scheduleRetry();
      });
    }, delayMs);
    this.retryTimer.unref();
  }

  clearRetry() {
    if (!this.retryTimer) return;
    clearTimeout(this.retryTimer);
    this.retryTimer = null;
    this.retryAttempt = 0;
  }

  status(): IngestStatus {
    return this.engine.status();
  }

  async resolveRuntimeSource(source: VideoSource): Promise<VideoSource> {
    if (source?.type !== "ndi" || !source.ndi?.sourceName || !this.ndiDiscovery) {
      return source;
    }
    try {
      const discovered = await this.ndiDiscovery(source);
      const match = discovered.find((entry) => entry.name === source.ndi.sourceName && entry.available !== false && entry.urlAddress);
      if (!match?.urlAddress || match.urlAddress === source.ndi.urlAddress) return source;
      return {
        ...source,
        ndi: {
          ...source.ndi,
          urlAddress: match.urlAddress
        }
      };
    } catch {
      return source;
    }
  }
}

function hasConfiguredSource(source: VideoSource | null | undefined): boolean {
  return Boolean(source?.type === "ndi" ? source.ndi?.sourceName : source?.type === "network" ? source.network?.uri : false);
}

function runtimeSourceKey(source: VideoSource): string {
  return JSON.stringify(source);
}

function configuredSourceKey(source: VideoSource | null | undefined): string {
  if (!source) return JSON.stringify(null);
  if (source.type === "ndi") {
    return JSON.stringify({ type: "ndi", sourceName: source.ndi?.sourceName || "" });
  }
  if (source.type === "network") {
    return JSON.stringify({ type: "network", protocol: source.network?.protocol || "", uri: source.network?.uri || "" });
  }
  return JSON.stringify({ type: source.type || null });
}
