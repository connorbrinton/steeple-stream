import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import path from "node:path";
import type { VideoSource } from "./domain.js";

export interface CameraVelocity {
  pan: number;
  tilt: number;
  zoom: number;
}

export function cameraVelocity(body: Record<string, unknown>): CameraVelocity {
  const result = { pan: 0, tilt: 0, zoom: 0 };
  for (const key of ["pan", "tilt", "zoom"] as const) {
    const value = body[key];
    if (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > 1)
      throw Object.assign(new Error("Camera speeds must be numbers between -1 and 1"), {
        status: 400,
      });
    result[key] = value;
  }
  return result;
}

/** One owner per camera; the helper independently stops on lost heartbeats. */
export class ManualPtz {
  private child: ChildProcessWithoutNullStreams | null = null;
  private ready: Promise<void> | null = null;
  private owner = "";
  private sourceKey = "";
  private lastUpdate = 0;
  private generation = 0;
  private sequences = new Map<string, number>();
  private closing: Promise<void> = Promise.resolve();

  constructor(
    private config: { transport: string; ndiHelper?: string | null },
    private spawnHelper: (
      command: string,
      args: string[],
    ) => ChildProcessWithoutNullStreams = spawn,
  ) {}

  async move(source: VideoSource, owner: string, velocity: CameraVelocity & { watchdogMs?: number }, sequence: number) {
    if (this.sequences.get(owner) === Infinity)
      throw Object.assign(new Error("Camera control was interrupted; enable control again"), {
        status: 409,
      });
    if (sequence <= (this.sequences.get(owner) ?? -1)) return;
    this.sequences.set(owner, sequence);
    if (this.sequences.size > 128) this.sequences.delete(this.sequences.keys().next().value!);
    const moving = Object.values(velocity).some(Boolean);
    if (this.owner && this.owner !== owner && Date.now() - this.lastUpdate < 1000)
      throw Object.assign(new Error("Another operator is controlling the camera"), { status: 409 });
    if (!moving && !this.child) return;
    if (this.config.transport !== "ndi" || source.type !== "ndi" || !source.ndi.sourceName)
      throw Object.assign(new Error("Manual movement requires an NDI camera control source"), {
        status: 409,
      });
    const key = JSON.stringify(source.ndi);
    if (this.child && key !== this.sourceKey) {
      await this.stop();
      throw Object.assign(new Error("Camera source changed; enable control again"), {
        status: 409,
      });
    }
    this.owner = owner;
    this.lastUpdate = Date.now();
    const startGeneration = this.generation;
    await this.closing;
    if (startGeneration !== this.generation || this.owner !== owner) return;
    if (this.sequences.get(owner) !== sequence) return;
    if (!this.child) this.connect(source, key);
    const generation = this.generation;
    await this.ready;
    if (this.sequences.get(owner) !== sequence) return;
    if (this.owner !== owner) return;
    if (generation !== this.generation || !this.child)
      throw Object.assign(new Error("Camera control was interrupted"), { status: 409 });
    this.child.stdin.write(`${JSON.stringify(velocity)}\n`);
    if (!moving) this.owner = "";
  }

  stop(): Promise<void> {
    this.generation++;
    for (const owner of this.sequences.keys()) this.sequences.set(owner, Infinity);
    const child = this.child;
    if (child) {
      this.closing = new Promise<void>((resolve) => {
        child.once("exit", () => resolve());
        child.stdin.end();
      });
    }
    this.child = null;
    this.ready = null;
    this.owner = "";
    return this.closing;
  }

  private connect(source: VideoSource, key: string) {
    const helper = path.join(import.meta.dirname, "ndi_ptz.py");
    const child = this.spawnHelper(this.config.ndiHelper || "python3", [
      ...(this.config.ndiHelper ? [] : [helper]),
      "manual",
      "--source",
      source.ndi.sourceName,
      "--url-address",
      source.ndi.urlAddress || "",
    ]);
    this.child = child;
    this.sourceKey = key;
    child.stdin.on("error", () => {});
    child.stderr.resume();
    this.ready = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        child.stdin.end();
        reject(new Error("Camera control connection timed out"));
      }, 5000);
      let output = "";
      const onData = (data: Buffer) => {
        output += data.toString();
        if (!output.includes("\n")) return;
        clearTimeout(timer);
        child.stdout.off("data", onData);
        if (output.trim() === "ready") resolve();
        else reject(new Error("Unexpected camera control response"));
      };
      child.stdout.on("data", onData);
      const failed = () => {
        clearTimeout(timer);
        reject(new Error("Camera control helper disconnected"));
        if (this.child === child) {
          this.child = null;
          this.ready = null;
          this.owner = "";
          this.generation++;
        }
      };
      child.once("error", failed);
      child.once("exit", failed);
    });
  }
}
