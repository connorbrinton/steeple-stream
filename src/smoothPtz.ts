import type { PtzPosition } from "./domain.js";

export interface PtzVelocity {
  pan: number;
  tilt: number;
  zoom: number;
}

export interface SmoothMotionOptions {
  target: PtzPosition;
  readPosition(): Promise<PtzPosition>;
  sendVelocity(velocity: PtzVelocity): Promise<void>;
  stop(): Promise<void>;
  signal: AbortSignal;
  sampleMs?: number;
  timeoutMs?: number;
  panPolarity?: number;
  tiltPolarity?: number;
  zoomPolarity?: number;
}

const axes = ["pan", "tilt", "zoom"] as const;
const tolerance: PtzPosition = { pan: 12, tilt: 12, zoom: 20 };
const stopped: PtzVelocity = { pan: 0, tilt: 0, zoom: 0 };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function synchronizedVelocity(
  start: PtzPosition,
  now: PtzPosition,
  target: PtzPosition,
  polarity: PtzVelocity = { pan: 1, tilt: 1, zoom: 1 },
): PtzVelocity {
  const moving = axes.filter((axis) => Math.abs(target[axis] - start[axis]) > tolerance[axis]);
  if (!moving.length) return { ...stopped };
  const progress = (axis: (typeof axes)[number]) =>
    (now[axis] - start[axis]) / (target[axis] - start[axis]);
  const unfinished = moving.filter((axis) => Math.abs(target[axis] - now[axis]) > tolerance[axis]);
  if (!unfinished.length) return { ...stopped };
  // Track the slowest axis: faster axes wait rather than pan away before zoom has caught up.
  const common = clamp(Math.min(...unfinished.map(progress)), 0, 1);
  const envelope = 0.16 + 0.84 * Math.sin(Math.PI * common);
  const command: PtzVelocity = { ...stopped };
  for (const axis of unfinished) {
    const distance = target[axis] - now[axis];
    const direction = Math.sign(distance) * Math.sign(polarity[axis]);
    // If the motor coasts past its destination, reverse slowly rather than
    // waiting forever for an impossible positive-progress target.
    if (progress(axis) > 1) {
      command[axis] = direction * 0.12;
      continue;
    }
    // Allow a small look-ahead so the slowest axis can keep moving.
    // An axis that outruns the slowest one receives a zero-speed command.
    const lag = common + 0.07 - progress(axis);
    const magnitude = Math.min(0.65, Math.max(0, lag * 5.5 * envelope));
    command[axis] = direction * magnitude;
  }
  return command;
}

export async function runSynchronizedMove(options: SmoothMotionOptions): Promise<void> {
  const {
    readPosition,
    sendVelocity,
    stop,
    signal,
    target,
    sampleMs = 140,
    timeoutMs = 45000,
    panPolarity = 1,
    tiltPolarity = 1,
    zoomPolarity = 1,
  } = options;
  const start = await readPosition();
  const startedAt = performance.now();
  let last = start;
  const changedAt: PtzPosition = {
    pan: startedAt,
    tilt: startedAt,
    zoom: startedAt,
  };
  const polarity = { pan: panPolarity, tilt: tiltPolarity, zoom: zoomPolarity };
  try {
    while (true) {
      if (signal.aborted) throw new Error("Smooth camera movement was interrupted");
      const now = await readPosition();
      if (signal.aborted) throw new Error("Smooth camera movement was interrupted");
      const elapsed = performance.now() - startedAt;
      if (elapsed > timeoutMs)
        throw new Error("Smooth camera movement exceeded its safety timeout");
      const velocity = synchronizedVelocity(start, now, target, polarity);
      if (
        axes.every((axis) => velocity[axis] === 0) &&
        axes.every(
          (axis) =>
            Math.abs(target[axis] - now[axis]) <= tolerance[axis] ||
            Math.abs(target[axis] - start[axis]) <= tolerance[axis],
        )
      )
        return;
      for (const axis of axes) {
        if (Math.abs(now[axis] - last[axis]) > 1) changedAt[axis] = performance.now();
        const planned = Math.abs(target[axis] - start[axis]) > tolerance[axis];
        const away = (now[axis] - start[axis]) * Math.sign(target[axis] - start[axis]);
        if (planned && away < -2 * tolerance[axis])
          throw new Error("Camera feedback moved opposite the expected " + axis + " direction");
        if (Math.abs(velocity[axis]) > 0.12 && performance.now() - changedAt[axis] > 5000)
          throw new Error("Camera " + axis + " made no measurable progress");
      }
      last = now;
      await sendVelocity(velocity);
      await new Promise((resolve) => setTimeout(resolve, sampleMs));
    }
  } finally {
    // Always release motion, including transport failure, interruption, and timeout.
    await stop();
  }
}
