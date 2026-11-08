import { spawn, type ChildProcess, type SpawnOptions } from "node:child_process";
import type { RtmpsDestination, StateStore } from "./domain.js";

type RelayStatus = "disabled" | "idle" | "connecting" | "streaming" | "error";
type SpawnProcess = (command: string, args: string[], options: SpawnOptions) => ChildProcess;

export function validateRtmpsDestination(serverUrl: unknown, streamKey: unknown): RtmpsDestination {
  if (typeof serverUrl !== "string" || serverUrl.length > 2048) {
    throw Object.assign(new Error("Enter an RTMPS server URL."), { status: 400 });
  }
  let url: URL;
  try {
    url = new URL(serverUrl.trim());
  } catch {
    throw Object.assign(new Error("Enter a valid RTMPS server URL."), { status: 400 });
  }
  if (
    url.protocol !== "rtmps:" ||
    !url.hostname ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw Object.assign(
      new Error("Use an rtmps:// server URL without credentials or query parameters."),
      {
        status: 400,
      },
    );
  }
  if (
    typeof streamKey !== "string" ||
    !streamKey.trim() ||
    streamKey.length > 512 ||
    /[\s/?#\\]/.test(streamKey)
  ) {
    throw Object.assign(new Error("Enter the stream key separately from the server URL."), {
      status: 400,
    });
  }
  return { serverUrl: url.href.replace(/\/$/, ""), streamKey: streamKey.trim() };
}

/** Publishes an optional external stream without coupling it to local ingest or recording. */
export class RtmpsRelay {
  private readonly store: StateStore;
  private readonly inputUrl: string;
  private readonly binary: string;
  private readonly spawnProcess: SpawnProcess;
  private child: ChildProcess | null = null;
  private target: string | null = null;
  private live = false;
  private state: RelayStatus = "disabled";
  private lastError: string | null = null;
  private timer: NodeJS.Timeout | null = null;
  private queue: Promise<void> = Promise.resolve();

  constructor({
    store,
    inputUrl,
    binary = "ffmpeg",
    spawnProcess = spawn,
  }: {
    store: StateStore;
    inputUrl: string;
    binary?: string;
    spawnProcess?: SpawnProcess;
  }) {
    this.store = store;
    this.inputUrl = inputUrl;
    this.binary = binary;
    this.spawnProcess = spawnProcess;
  }

  async summary() {
    const state = await this.store.read();
    const destination = state.rtmpsDestination;
    return {
      enabled: Boolean(destination),
      serverUrl: destination?.serverUrl || "",
      hasStreamKey: Boolean(destination?.streamKey),
      status: this.state,
      lastError: this.lastError,
    };
  }

  async configure(input: Record<string, unknown>) {
    await this.store.update((state) => {
      if (input.enabled === false) {
        state.rtmpsDestination = null;
        return;
      }
      const oldKey = state.rtmpsDestination?.streamKey || "";
      const key =
        input.streamKey === "" || input.streamKey === undefined ? oldKey : input.streamKey;
      state.rtmpsDestination = validateRtmpsDestination(input.serverUrl, key);
    });
    await this.sync(this.live);
    return this.summary();
  }

  /** Serialized so simultaneous UI changes and broadcast start/end cannot race. */
  sync(live: boolean): Promise<void> {
    this.live = live;
    this.queue = this.queue.catch(() => {}).then(() => this.reconcile());
    return this.queue;
  }

  private async reconcile() {
    const { rtmpsDestination: destination } = await this.store.read();
    const target =
      this.live && destination
        ? destination.serverUrl + "/" + encodeURIComponent(destination.streamKey)
        : null;
    if (target && target === this.target && this.child) return;
    await this.stopChild();
    if (!target) {
      this.state = destination ? "idle" : "disabled";
      this.lastError = null;
      return;
    }

    this.target = target;
    this.state = "connecting";
    this.lastError = null;
    const child = this.spawnProcess(
      this.binary,
      [
        "-nostdin",
        "-hide_banner",
        "-nostats",
        "-loglevel",
        "error",
        "-stats_period",
        "3",
        "-progress",
        "pipe:2",
        "-i",
        this.inputUrl,
        "-c",
        "copy",
        "-f",
        "flv",
        target,
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );
    this.child = child;
    child.stderr?.on("data", (chunk: Buffer) => {
      // Never retain or log ffmpeg stderr; it may contain the full stream key.
      if (child === this.child && /out_time_(?:us|ms)=[1-9]\d*/.test(String(chunk))) {
        this.state = "streaming";
      }
    });
    child.once("error", () => {
      if (child !== this.child) return;
      this.child = null;
      this.state = "error";
      this.lastError = "Could not start the RTMPS relay; check that FFmpeg is installed.";
      this.scheduleRetry();
    });
    child.once("exit", (code) => {
      if (child !== this.child) return;
      this.child = null;
      this.state = "error";
      this.lastError =
        "RTMPS connection stopped (exit code " + code + "). Verify the destination and network.";
      this.scheduleRetry();
    });
  }

  private scheduleRetry() {
    if (!this.live || this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.sync(this.live).catch(() => {});
    }, 5000);
    this.timer.unref();
  }

  private async stopChild() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    const child = this.child;
    this.child = null;
    this.target = null;
    if (!child) return;
    await new Promise<void>((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        resolve();
      };
      child.once("exit", finish);
      const timeout = setTimeout(() => {
        child.kill("SIGKILL");
        finish();
      }, 3000);
      timeout.unref();
      child.kill("SIGTERM");
    });
  }

  async stop() {
    this.live = false;
    await this.sync(false);
  }
}
