import { execFile } from "node:child_process";
import { EventEmitter } from "node:events";
import { promisify } from "node:util";
import { spawn } from "node:child_process";
import path from "node:path";
import type { ChildProcessWithoutNullStreams, SpawnOptionsWithoutStdio } from "node:child_process";
import type { SceneMode, VideoSource } from "./domain.js";

const execFileAsync = promisify(execFile);

export const gstRuntimePackages = ["nixpkgs#gst_all_1.gstreamer"];

export const gstPluginPackages = [
  "nixpkgs#gst_all_1.gstreamer.out",
  ".#gst-plugin-ndi",
  "nixpkgs#gst_all_1.gst-plugins-base",
  "nixpkgs#gst_all_1.gst-plugins-good",
  "nixpkgs#gst_all_1.gst-plugins-bad",
  "nixpkgs#gst_all_1.gst-plugins-ugly",
  "nixpkgs#gst_all_1.gst-libav",
  "nixpkgs#gst_all_1.gst-rtsp-server",
];

export const defaultNdiNixPackage = "nixpkgs#ndi";

export type PipelineType = "switcher" | "slate-only";
type InputKind = "video" | "audio";
type OutputKind = "rtmp" | "rtsp";

export interface GStreamerConfig {
  runtime: string;
  rtmpUrl: string;
  webrtcRtspUrl?: string;
  frameRate: number;
  videoBitrateKbps: number;
  audioBitrate: number;
  transitionDurationMs?: number;
  gstLaunchBinary?: string | null;
  ndiRuntimeDir?: string | null;
  ndiNixPackage?: string;
}

interface RunnerOptions {
  env?: NodeJS.ProcessEnv;
  impure?: boolean;
}

export interface GStreamerRunner {
  spawn(
    command: string,
    args: readonly string[],
    options: SpawnOptionsWithoutStdio & { stdio: ["pipe", "pipe", "pipe"] },
  ): ChildProcessWithoutNullStreams;
  nixBuild(packages: readonly string[], cwd: string, options?: RunnerOptions): Promise<string[]>;
}

export interface EngineExitEvent {
  code: number | null;
  signal: NodeJS.Signals | null;
  sdkMissing: boolean;
  stopping: boolean;
}

interface EndpointState {
  expected: boolean;
  ready: boolean;
  lastSeenAt?: string | null;
  url?: string | null;
}

export interface IngestStatus {
  status: "stopped" | "starting" | "running" | "failed" | "disabled" | "waiting";
  ready: boolean;
  sourceType: string | null;
  sourceName: string | null;
  source: VideoSource | null;
  message: string;
  startedAt: string | null;
  exitedAt: string | null;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  scene: {
    requested: SceneMode | null;
    observed: SceneMode | null;
    transitioning: boolean;
    transitionStartedAt: string | null;
  };
  inputs: Record<InputKind, EndpointState>;
  outputs: Record<OutputKind, EndpointState>;
  observedMode?: SceneMode;
  transitioning?: boolean;
  videoReady?: boolean;
  audioReady?: boolean;
  lastHeartbeatAt: string | null;
  lastError: { category: string; message: string; debug?: string | null; at: string } | null;
  log: string[];
}

export interface StartSceneOptions {
  mode: SceneMode;
  source?: VideoSource | null;
  sourceName?: string | null;
  sourceUrlAddress?: string;
  pipelineType?: PipelineType;
}

interface GStreamerCommand {
  command: string;
  args: string[];
  env: NodeJS.ProcessEnv;
}

interface ControllerEvent {
  event: string;
  mode: SceneMode;
  outputs?: OutputKind[];
  media: InputKind;
  message: string;
  debug?: string;
  category?: string;
  inputVideoReady?: boolean;
  inputAudioReady?: boolean;
  inputVideoAgeMs?: number | null;
  inputAudioAgeMs?: number | null;
}

export class GStreamerMediaEngine extends EventEmitter {
  declare config: GStreamerConfig;
  declare cwd: string;
  declare runner: GStreamerRunner;
  declare onExit: ((event: EngineExitEvent) => void) | null;
  declare process: ChildProcessWithoutNullStreams | null;
  declare stopping: boolean;
  declare currentMode: SceneMode | null;
  declare stdoutBuffer: string;
  declare state: IngestStatus;

  constructor({
    config,
    cwd = process.cwd(),
    runner = defaultRunner,
    onExit = null,
  }: {
    config: GStreamerConfig;
    cwd?: string;
    runner?: GStreamerRunner;
    onExit?: ((event: EngineExitEvent) => void) | null;
  }) {
    super();
    this.config = config;
    this.cwd = cwd;
    this.runner = runner;
    this.onExit = onExit;
    this.process = null;
    this.stopping = false;
    this.currentMode = null;
    this.stdoutBuffer = "";
    this.state = initialState();
  }

  get running() {
    return Boolean(this.process);
  }

  async startScene({
    mode,
    source = null,
    sourceName = source?.ndi?.sourceName || source?.network?.uri || null,
    sourceUrlAddress = source?.ndi?.urlAddress,
    pipelineType = "switcher",
  }: StartSceneOptions) {
    this.setState({
      status: "starting",
      sourceType: mode === "sacrament" ? "slate" : source?.type || "ndi",
      sourceName,
      source: source ? structuredClone(source) : null,
      scene: {
        requested: mode,
        observed: null,
        transitioning: false,
        transitionStartedAt: null,
      },
      inputs: inputStateFor(source, pipelineType),
      outputs: outputStateFor(this.config, pipelineType),
      message:
        mode === "sacrament"
          ? "Preparing GStreamer sacrament slate."
          : `Preparing GStreamer ${source?.type || "NDI"} ingest.`,
      startedAt: new Date().toISOString(),
      exitedAt: null,
      exitCode: null,
      signal: null,
      ready: false,
      transitioning: false,
      lastError: null,
      log: [],
    });

    const command = await this.gstreamerCommand({
      mode,
      source,
      sourceName,
      sourceUrlAddress,
      pipelineType,
    });

    this.stopping = false;
    this.process = this.runner.spawn(command.command, command.args, {
      cwd: this.cwd,
      env: command.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this.currentMode = mode;

    this.setState({
      status: "starting",
      message:
        mode === "sacrament"
          ? `Publishing sacrament slate to ${this.config.rtmpUrl}.`
          : `Publishing ${source?.type || "NDI"} source "${sourceName}" to ${this.config.rtmpUrl}.`,
    });
    this.process.stdout.on("data", (chunk) => this.handleControllerOutput(chunk));
    this.process.stderr.on("data", (chunk) => this.appendLog(chunk));
    this.process.on("exit", (code, signal) => {
      this.process = null;
      const sdkMissing = this.state.lastError?.category === "missing-runtime";
      this.currentMode = null;
      this.setState({
        status: this.stopping ? "stopped" : "failed",
        ready: false,
        message: this.stopping
          ? "Ingest stopped."
          : sdkMissing
            ? this.state.message
            : `Ingest exited with code=${code} signal=${signal}.`,
        exitedAt: new Date().toISOString(),
        exitCode: code,
        signal,
      });
      this.onExit?.({ code, signal, sdkMissing, stopping: this.stopping });
    });
  }

  async stop() {
    if (!this.process) return;
    this.stopping = true;
    const child = this.process;
    await new Promise<void>((resolve) => {
      child.once("exit", resolve);
      child.kill("SIGTERM");
      setTimeout(() => {
        if (this.process === child) child.kill("SIGKILL");
        resolve();
      }, 2500).unref();
    });
    this.process = null;
    this.currentMode = null;
  }

  setMode(mode: SceneMode) {
    if (!this.process || this.currentMode === mode) return;
    this.currentMode = mode;
    this.process.stdin.write(`${JSON.stringify({ type: "set-mode", mode })}\n`);
    const sourceType = mode === "sacrament" ? "slate" : this.state.source?.type || "ndi";
    this.setState({
      sourceType,
      scene: {
        ...this.state.scene,
        requested: mode,
        transitioning: true,
        transitionStartedAt: new Date().toISOString(),
      },
      message:
        mode === "sacrament"
          ? `Publishing sacrament slate to ${this.config.rtmpUrl}.`
          : `Publishing ${sourceType} source "${this.state.sourceName}" to ${this.config.rtmpUrl}.`,
    });
  }

  async gstreamerEnvironment() {
    if (this.config.runtime !== "nix") {
      const libraryPath = [this.config.ndiRuntimeDir, process.env.LD_LIBRARY_PATH]
        .filter(Boolean)
        .join(":");
      return {
        ...process.env,
        ...(libraryPath ? { LD_LIBRARY_PATH: libraryPath } : {}),
      };
    }
    const paths = await this.runner.nixBuild(gstPluginPackages, this.cwd);
    const pluginPath = paths.map((output) => `${output}/lib/gstreamer-1.0`).join(":");
    const ndiLibraryDirs = await this.ndiLibraryDirs();
    const libraryPath = [...ndiLibraryDirs, this.config.ndiRuntimeDir, process.env.LD_LIBRARY_PATH]
      .filter(Boolean)
      .join(":");
    return {
      ...process.env,
      GST_PLUGIN_PATH: process.env.GST_PLUGIN_PATH
        ? `${pluginPath}:${process.env.GST_PLUGIN_PATH}`
        : pluginPath,
      ...(libraryPath ? { LD_LIBRARY_PATH: libraryPath } : {}),
    };
  }

  async gstreamerCommand({
    mode,
    source = null,
    sourceName = null,
    sourceUrlAddress,
    pipelineType = "switcher",
  }: StartSceneOptions): Promise<GStreamerCommand> {
    const env = await this.gstreamerEnvironment();
    const pipeline =
      pipelineType === "slate-only"
        ? sacramentSlateToRtmpPipeline({
            rtmpUrl: this.config.rtmpUrl,
            frameRate: this.config.frameRate,
            videoBitrateKbps: this.config.videoBitrateKbps,
            audioBitrate: this.config.audioBitrate,
          })
        : switchableNdiSlateToRtmpCommand({
            sourceType: source?.type === "network" ? source.network.protocol : "ndi",
            networkUri: source?.network?.uri,
            sourceName,
            sourceUrlAddress,
            rtmpUrl: this.config.rtmpUrl,
            webrtcRtspUrl: this.config.webrtcRtspUrl,
            frameRate: this.config.frameRate,
            videoBitrateKbps: this.config.videoBitrateKbps,
            audioBitrate: this.config.audioBitrate,
            transitionDurationMs: this.config.transitionDurationMs,
            mode,
          });

    if (this.config.runtime === "nix") {
      return pipelineType === "slate-only"
        ? {
            command: "nix",
            args: [
              "shell",
              ...gstRuntimePackages,
              "--command",
              "gst-launch-1.0",
              "-e",
              ...pipeline,
            ],
            env,
          }
        : {
            command: "nix",
            args: ["shell", ...gstRuntimePackages, "--command", ...pipeline],
            env,
          };
    }

    if (this.config.runtime !== "system") {
      throw new Error(`Unsupported ingest runtime: ${this.config.runtime}`);
    }

    return {
      command:
        pipelineType === "slate-only"
          ? this.config.gstLaunchBinary || "gst-launch-1.0"
          : pipeline[0]!,
      args: pipelineType === "slate-only" ? ["-e", ...pipeline] : pipeline.slice(1),
      env,
    };
  }

  async ndiLibraryDirs() {
    const ndiPackage = this.config.ndiNixPackage || defaultNdiNixPackage;
    if (!ndiPackage) return [];

    const outputs = await this.runner.nixBuild([ndiPackage], this.cwd, {
      env: { ...process.env, NIXPKGS_ALLOW_UNFREE: "1" },
      impure: true,
    });
    return outputs.map((output) => `${output}/lib`);
  }

  status() {
    return structuredClone(this.state);
  }

  setState(patch: Partial<IngestStatus>, { emit = true }: { emit?: boolean } = {}) {
    this.state = { ...this.state, ...patch };
    if (emit) this.emit("changed", this.status());
  }

  appendLog(chunk: Uint8Array | string) {
    const text = String(chunk);
    process.stdout.write(`[ingest] ${text}`);
    if (text.includes("Failed loading NDI SDK")) {
      this.setState({
        status: "failed",
        message:
          "NDI runtime library is missing. Run through the Steeple Stream flake wrapper or set STEEPLE_NDI_RUNTIME_DIR to a local SDK lib directory.",
        lastError: {
          category: "missing-runtime",
          message: "NDI runtime library is missing.",
          at: new Date().toISOString(),
        },
      });
    }
    this.appendLogLines(text);
  }

  handleControllerOutput(chunk: Uint8Array | string) {
    const text = String(chunk);
    process.stdout.write(`[ingest] ${text}`);
    this.stdoutBuffer += text;
    const lines = this.stdoutBuffer.split(/\r?\n/);
    this.stdoutBuffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.trim()) continue;
      this.state.log.push(line.trim());
      try {
        this.applyControllerEvent(JSON.parse(line) as ControllerEvent);
      } catch {
        // Preserve non-JSON subprocess diagnostics in the bounded log.
      }
    }
    this.trimLog();
  }

  appendLogLines(text: string) {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    this.state.log.push(...lines);
    this.trimLog();
  }

  trimLog() {
    if (this.state.log.length > 50) this.state.log.splice(0, this.state.log.length - 50);
  }

  applyControllerEvent(event: ControllerEvent) {
    if (event.event === "ready") {
      this.setState({
        status: "running",
        ready: true,
        observedMode: event.mode,
        transitioning: false,
        scene: { ...this.state.scene, observed: event.mode, transitioning: false },
        outputs: markOutputs(this.state.outputs, event.outputs || []),
      });
    } else if (event.event === "mode" || event.event === "transition-complete") {
      this.setState({
        observedMode: event.mode,
        transitioning: event.event === "mode",
        scene: {
          ...this.state.scene,
          observed: event.mode,
          transitioning: event.event === "mode",
          transitionStartedAt: event.event === "mode" ? this.state.scene.transitionStartedAt : null,
        },
      });
    } else if (event.event === "transition") {
      this.setState({
        transitioning: true,
        scene: {
          ...this.state.scene,
          requested: event.mode,
          transitioning: true,
          transitionStartedAt: new Date().toISOString(),
        },
      });
    } else if (event.event === "error") {
      this.setState({
        status: "failed",
        ready: false,
        ...(event.category === "input"
          ? {
              videoReady: false,
              audioReady: false,
              inputs: {
                video: { ...this.state.inputs.video, ready: false },
                audio: { ...this.state.inputs.audio, ready: false },
              },
            }
          : {}),
        message: event.message,
        lastError: {
          category: event.category || "pipeline",
          message: event.message,
          debug: event.debug || null,
          at: new Date().toISOString(),
        },
      });
    } else if (event.event === "input-ready" || event.event === "ndi-ready") {
      this.setState({
        inputs: {
          ...this.state.inputs,
          [event.media]: {
            ...this.state.inputs[event.media],
            ready: true,
            lastSeenAt: new Date().toISOString(),
          },
        },
        [`${event.media}Ready`]: true,
      });
    } else if (event.event === "heartbeat") {
      const now = Date.now();
      const inputs = { ...this.state.inputs };
      const freshness = [
        ["video", "inputVideoReady", "inputVideoAgeMs"],
        ["audio", "inputAudioReady", "inputAudioAgeMs"],
      ] as const;
      for (const [media, readyField, ageField] of freshness) {
        if (!(ageField in event)) continue;
        const age = event[ageField];
        const fresh = typeof age === "number" && Number.isFinite(age) && age < 15_000;
        inputs[media] = {
          ...inputs[media],
          ready: event[readyField] === true && fresh,
          lastSeenAt:
            typeof age === "number" && Number.isFinite(age)
              ? new Date(now - Math.max(0, age)).toISOString()
              : null,
        };
      }
      this.setState(
        {
          lastHeartbeatAt: new Date(now).toISOString(),
          inputs,
          videoReady: inputs.video.ready,
          audioReady: inputs.audio.ready,
        },
        { emit: false },
      );
    }
  }
}

interface SwitchablePipelineOptions {
  sourceType?: string;
  networkUri?: string;
  sourceName: string | null;
  sourceUrlAddress?: string;
  rtmpUrl: string;
  webrtcRtspUrl?: string;
  frameRate: number;
  videoBitrateKbps: number;
  audioBitrate: number;
  transitionDurationMs?: number;
  mode: SceneMode;
}

interface RtmpPipelineOptions {
  rtmpUrl: string;
  frameRate: number;
  videoBitrateKbps: number;
  audioBitrate: number;
}

export function switchableNdiSlateToRtmpCommand({
  sourceType = "ndi",
  networkUri,
  sourceName,
  sourceUrlAddress,
  rtmpUrl,
  webrtcRtspUrl,
  frameRate,
  videoBitrateKbps,
  audioBitrate,
  transitionDurationMs = 600,
  mode,
}: SwitchablePipelineOptions): string[] {
  const command = [
    process.env.STEEPLE_GST_CONTROLLER_BINARY || "python3",
    path.join(import.meta.dirname, "gst_ingest_controller.py"),
    "--source-type",
    sourceType,
  ];
  if (sourceType === "ndi") {
    if (!sourceName) throw new Error("NDI source name is required");
    command.push("--ndi-source", sourceName);
    if (sourceUrlAddress) command.push("--ndi-url-address", sourceUrlAddress);
  } else {
    if (!networkUri) throw new Error("Network source URI is required");
    command.push("--network-uri", networkUri);
  }
  command.push(
    "--rtmp-url",
    rtmpUrl,
    ...(webrtcRtspUrl ? ["--webrtc-rtsp-url", webrtcRtspUrl] : []),
    "--frame-rate",
    String(frameRate),
    "--video-bitrate-kbps",
    String(videoBitrateKbps),
    "--audio-bitrate",
    String(audioBitrate),
    "--transition-duration-ms",
    String(transitionDurationMs),
    "--initial-mode",
    mode,
  );
  return command;
}

export function ndiToRtmpPipeline({
  sourceName,
  rtmpUrl,
  frameRate,
  videoBitrateKbps,
  audioBitrate,
}: RtmpPipelineOptions & { sourceName: string }): string[] {
  return [
    "ndisrc",
    `ndi-name=${sourceName}`,
    "bandwidth=100",
    "!",
    "ndisrcdemux",
    "name=demux",
    "demux.video",
    "!",
    "queue",
    "!",
    "videoconvert",
    "!",
    "videorate",
    "!",
    `video/x-raw,format=I420,framerate=${frameRate}/1`,
    "!",
    "x264enc",
    "tune=zerolatency",
    "speed-preset=veryfast",
    `bitrate=${videoBitrateKbps}`,
    `key-int-max=${frameRate * 2}`,
    "!",
    "h264parse",
    "config-interval=1",
    "!",
    "queue",
    "!",
    "mux.",
    "demux.audio",
    "!",
    "queue",
    "!",
    "audioconvert",
    "!",
    "audioresample",
    "!",
    "avenc_aac",
    `bitrate=${audioBitrate}`,
    "!",
    "aacparse",
    "!",
    "queue",
    "!",
    "mux.",
    "flvmux",
    "name=mux",
    "streamable=true",
    "!",
    "rtmpsink",
    `location=${rtmpUrl}`,
  ];
}

export function sacramentSlateToRtmpPipeline({
  rtmpUrl,
  frameRate,
  videoBitrateKbps,
  audioBitrate,
}: RtmpPipelineOptions): string[] {
  return [
    "videotestsrc",
    "is-live=true",
    "pattern=black",
    "!",
    `video/x-raw,format=I420,width=1920,height=1080,framerate=${frameRate}/1`,
    "!",
    "textoverlay",
    "text=Sacrament in progress - broadcast will return shortly",
    "halignment=center",
    "valignment=center",
    "font-desc=Sans 48",
    "!",
    "x264enc",
    "tune=zerolatency",
    "speed-preset=veryfast",
    `bitrate=${videoBitrateKbps}`,
    `key-int-max=${frameRate * 2}`,
    "!",
    "h264parse",
    "config-interval=1",
    "!",
    "queue",
    "!",
    "mux.",
    "audiotestsrc",
    "is-live=true",
    "wave=silence",
    "!",
    "audio/x-raw,rate=48000,channels=2",
    "!",
    "avenc_aac",
    `bitrate=${audioBitrate}`,
    "!",
    "aacparse",
    "!",
    "queue",
    "!",
    "mux.",
    "flvmux",
    "name=mux",
    "streamable=true",
    "!",
    "rtmpsink",
    `location=${rtmpUrl}`,
  ];
}

function initialState(): IngestStatus {
  return {
    status: "stopped",
    ready: false,
    sourceType: null,
    sourceName: null,
    source: null,
    message: "Ingest is stopped.",
    startedAt: null,
    exitedAt: null,
    exitCode: null,
    signal: null,
    scene: {
      requested: null,
      observed: null,
      transitioning: false,
      transitionStartedAt: null,
    },
    inputs: {
      video: { expected: false, ready: false, lastSeenAt: null },
      audio: { expected: false, ready: false, lastSeenAt: null },
    },
    outputs: {
      rtmp: { expected: false, ready: false, url: null },
      rtsp: { expected: false, ready: false, url: null },
    },
    lastHeartbeatAt: null,
    lastError: null,
    log: [],
  };
}

function inputStateFor(
  source: VideoSource | null,
  pipelineType: PipelineType,
): Record<InputKind, EndpointState> {
  const expected = pipelineType !== "slate-only" && Boolean(source);
  return {
    video: { expected, ready: pipelineType === "slate-only", lastSeenAt: null },
    audio: { expected, ready: pipelineType === "slate-only", lastSeenAt: null },
  };
}

function outputStateFor(
  config: GStreamerConfig,
  pipelineType: PipelineType,
): Record<OutputKind, EndpointState> {
  return {
    rtmp: { expected: true, ready: pipelineType === "slate-only", url: config.rtmpUrl },
    rtsp: {
      expected: Boolean(config.webrtcRtspUrl) && pipelineType !== "slate-only",
      ready: false,
      url: config.webrtcRtspUrl || null,
    },
  };
}

function markOutputs(
  outputs: Record<OutputKind, EndpointState>,
  readyOutputs: OutputKind[],
): Record<OutputKind, EndpointState> {
  const next = structuredClone(outputs);
  for (const output of readyOutputs) {
    if (next[output]) next[output].ready = true;
  }
  return next;
}

const defaultRunner = {
  spawn,
  async nixBuild(
    packages: readonly string[],
    cwd: string,
    options: RunnerOptions = {},
  ): Promise<string[]> {
    const args = [
      "build",
      ...(options.impure ? ["--impure"] : []),
      "--no-link",
      "--print-out-paths",
      ...packages,
    ];
    const { stdout } = await execFileAsync("nix", args, {
      cwd,
      env: options.env,
      maxBuffer: 1024 * 1024 * 20,
    });
    return stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  },
};
