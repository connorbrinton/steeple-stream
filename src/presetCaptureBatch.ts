import type { Actor, PtzPosition, PtzPreset } from "./domain.js";

type Stage = "idle" | "running" | "cancelling" | "completed" | "cancelled" | "failed";
type Step = { id: string; name: string; position: PtzPosition };
type Plan = { presets: PtzPreset[]; readPosition(): Promise<PtzPosition> };
type Clock = () => number;
type Sleep = (ms: number, signal: AbortSignal) => Promise<void>;

export interface CaptureBatchStatus {
  stage: Stage;
  total: number;
  completed: number;
  current: { id: string; name: string } | null;
  results: Step[];
  error: string | null;
  startedAt: string | null;
  finishedAt: string | null;
}

interface CaptureBatchOptions {
  plan(): Promise<Plan>;
  recall(id: string, actor: Actor | null): Promise<void>;
  capture(id: string, position: PtzPosition, actor: Actor | null): Promise<void>;
  clock?: Clock;
  sleep?: Sleep;
  settleMs?: number;
  sampleMs?: number;
  timeoutMs?: number;
}

const axes = ["pan", "tilt", "zoom"] as const;
const stableTolerance: PtzPosition = { pan: 3, tilt: 3, zoom: 5 };
const movementThreshold: PtzPosition = { pan: 6, tilt: 6, zoom: 10 };

function closeEnough(a: PtzPosition, b: PtzPosition, delta: PtzPosition): boolean {
  return axes.every((axis) => Math.abs(a[axis] - b[axis]) <= delta[axis]);
}

function interrupted(signal: AbortSignal): void {
  if (signal.aborted) throw new Error("Capture cancelled");
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(new Error("Capture cancelled"));
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
      reject(new Error("Capture cancelled"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Wait for physical camera position to remain stable, not merely for the
 * NDI preset command to be acknowledged. Reports whether movement was
 * observed relative to the pre-recall position.
 */
export async function waitForPresetToSettle(
  readPosition: () => Promise<PtzPosition>,
  before: PtzPosition,
  signal: AbortSignal,
  options: {
    clock?: Clock;
    sleep?: Sleep;
    settleMs?: number;
    sampleMs?: number;
    timeoutMs?: number;
  } = {},
): Promise<{ position: PtzPosition; moved: boolean }> {
  const now = options.clock ?? (() => performance.now());
  const sleep = options.sleep ?? delay;
  const sampleMs = options.sampleMs ?? 350;
  const settleMs = options.settleMs ?? 1800;
  const timeoutMs = options.timeoutMs ?? 45000;
  const began = now();
  let stableSince = began;
  let stableAnchor: PtzPosition | null = null;
  let moved = false;
  while (true) {
    interrupted(signal);
    const position = await readPosition();
    interrupted(signal);
    const time = now();
    if (time - began > timeoutMs) throw new Error("Camera did not settle before timeout");
    if (!closeEnough(position, before, movementThreshold)) moved = true;
    if (!stableAnchor || !closeEnough(position, stableAnchor, stableTolerance)) {
      stableSince = time;
      stableAnchor = position;
    }
    if (time - stableSince >= settleMs) return { position, moved };
    await sleep(sampleMs, signal);
  }
}

/** A single camera-wide job; progress lives in the server rather than the browser. */
export class PresetCaptureBatch {
  private status: CaptureBatchStatus = {
    stage: "idle",
    total: 0,
    completed: 0,
    current: null,
    results: [],
    error: null,
    startedAt: null,
    finishedAt: null,
  };
  private abort: AbortController | null = null;
  private starting = false;

  constructor(private options: CaptureBatchOptions) {}

  snapshot(): CaptureBatchStatus {
    return structuredClone(this.status);
  }

  get active(): boolean {
    return this.starting || this.status.stage === "running" || this.status.stage === "cancelling";
  }

  assertInactive(): void {
    if (this.active)
      throw Object.assign(
        new Error("Camera preset capture is running. Cancel it before manually moving the camera."),
        { status: 409 },
      );
  }

  async start(actor: Actor | null = null): Promise<CaptureBatchStatus> {
    this.assertInactive();
    this.starting = true;
    try {
      const plan = await this.options.plan();
      if (!plan.presets.length)
        throw Object.assign(new Error("No camera presets are configured"), { status: 409 });
      const presets = structuredClone(plan.presets);
      const abort = new AbortController();
      this.abort = abort;
      this.status = {
        stage: "running",
        total: presets.length,
        completed: 0,
        current: null,
        results: [],
        error: null,
        startedAt: new Date().toISOString(),
        finishedAt: null,
      };
      // The HTTP response is immediate. The job continues until completion or cancellation.
      void this.run(plan.readPosition, presets, actor, abort.signal).catch((error: unknown) => {
        console.error("Camera preset capture failed", error);
      });
      return this.snapshot();
    } finally {
      this.starting = false;
    }
  }

  cancel(): CaptureBatchStatus {
    if (this.status.stage === "running") {
      this.status.stage = "cancelling";
      this.abort?.abort();
    }
    return this.snapshot();
  }

  private async run(
    readPosition: () => Promise<PtzPosition>,
    presets: PtzPreset[],
    actor: Actor | null,
    signal: AbortSignal,
  ): Promise<void> {
    try {
      // If the camera initially happens to be at the first preset, revisit it
      // after other shots rather than claiming success without seeing movement.
      const queue = [...presets];
      let deferredFirst = false;
      while (queue.length) {
        interrupted(signal);
        const preset = queue.shift()!;
        this.status.current = { id: preset.id, name: preset.name };
        const before = await readPosition();
        interrupted(signal);
        await this.options.recall(preset.id, actor);
        interrupted(signal);
        const settled = await waitForPresetToSettle(readPosition, before, signal, this.options);
        if (!settled.moved) {
          if (!deferredFirst && this.status.completed === 0 && queue.length) {
            deferredFirst = true;
            queue.push(preset);
            continue;
          }
          // A previously captured target that hasn't moved is safe to retain.
          if (!preset.position || !closeEnough(preset.position, settled.position, stableTolerance))
            throw new Error(
              'No camera movement detected for "' +
                preset.name +
                '". Its target could not be verified; no position was saved.',
            );
        }
        // Verify once more before committing; don't save coordinates from a camera
        // that's still moving or that was changed by an external controller.
        const verified = await readPosition();
        interrupted(signal);
        if (!closeEnough(verified, settled.position, stableTolerance))
          throw new Error('Position changed while saving preset "' + preset.name + '"');
        await this.options.capture(preset.id, verified, actor);
        this.status.results.push({
          id: preset.id,
          name: preset.name,
          position: verified,
        });
        this.status.completed++;
      }
      this.status.stage = "completed";
    } catch (error) {
      if (signal.aborted) {
        this.status.stage = "cancelled";
      } else {
        this.status.stage = "failed";
        this.status.error = error instanceof Error ? error.message : String(error);
      }
    } finally {
      this.abort = null;
      this.status.current = null;
      this.status.finishedAt = new Date().toISOString();
    }
  }
}
