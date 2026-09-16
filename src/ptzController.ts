import dgram from "node:dgram";
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import type { PtzPosition, PtzPreset, VideoSource } from "./domain.js";

interface PtzConfig {
  transport: string;
  host?: string | null;
  port?: number;
  timeoutMs?: number;
  smooth?: boolean;
  smoothDurationMs?: number;
  ndiHelper?: string | null;
  ndiPresetSpeed?: number;
  ndiSettleMs?: number;
}

interface PtzSource {
  type?: VideoSource["type"];
  ndi?: Partial<VideoSource["ndi"]>;
  network?: Partial<VideoSource["network"]>;
}

interface NdiRecallOptions {
  helper: string | null;
  sourceName: string;
  urlAddress: string;
  presetIndex: number;
  speed: number;
  settleMs: number;
  timeoutMs: number;
}

interface PtzRunner {
  recallNdiPreset(options: NdiRecallOptions): Promise<void>;
}

type SocketFactory = () => dgram.Socket;

interface PtzControllerOptions {
  config: PtzConfig;
  socketFactory?: SocketFactory;
  runner?: PtzRunner;
}

interface ViscaOptions {
  socketFactory: SocketFactory;
  host: string;
  port: number;
  timeoutMs: number;
}

const presetIndexes: Record<string, number> = {
  "full-stand": 1,
  pulpit: 2,
  "music-director": 8,
  choir: 12,
  piano: 13,
  "pulpit-wide": 16
};
const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class PtzController {
  declare config: PtzConfig;
  declare socketFactory: SocketFactory;
  declare runner: PtzRunner;

  constructor({ config, socketFactory = defaultSocketFactory, runner = defaultRunner }: PtzControllerOptions) {
    this.config = config;
    this.socketFactory = socketFactory;
    this.runner = runner;
  }

  async recallPreset({ preset, source }: { preset: PtzPreset; source: PtzSource }) {
    const transport = this.config.transport || "manual";
    if (transport === "manual") {
      return { transport, status: "recorded" };
    }
    if (transport === "ndi") {
      if (source?.type && source.type !== "ndi") {
        const error = new Error("NDI PTZ preset recall requires an NDI source");
        error.status = 409;
        throw error;
      }
      const sourceName = source?.ndi?.sourceName;
      if (!sourceName) {
        const error = new Error("NDI PTZ preset recall requires a selected NDI source");
        error.status = 409;
        throw error;
      }
      const cameraPresetNumber = Number(preset.ndiPreset);
      if (!Number.isInteger(cameraPresetNumber) || cameraPresetNumber < 1 || cameraPresetNumber > 100) {
        const error = new Error(`Preset ${preset.name} does not have a valid NDI camera preset number`);
        error.status = 400;
        throw error;
      }
      const presetIndex = cameraPresetNumber - 1;
      await this.runner.recallNdiPreset({
        helper: this.config.ndiHelper || null,
        sourceName,
        urlAddress: source.ndi?.urlAddress || "",
        presetIndex,
        speed: this.config.ndiPresetSpeed ?? 1,
        settleMs: this.config.ndiSettleMs ?? 750,
        timeoutMs: this.config.timeoutMs || 1500
      });
      return { transport, status: "recalled", movement: "ndi-preset", sourceName, preset: presetIndex, cameraPreset: cameraPresetNumber };
    }
    if (transport !== "visca-udp") {
      throw new Error(`Unsupported PTZ transport: ${transport}`);
    }

    const host = this.config.host || inferHostFromSource(source);
    if (!host) {
      const error = new Error("PTZ host is not configured and could not be inferred from the selected source");
      error.status = 409;
      throw error;
    }

    const presetIndex = Number(preset.viscaPreset ?? presetIndexes[preset.id]);
    if (!Number.isInteger(presetIndex) || presetIndex < 0 || presetIndex > 127) {
      const error = new Error(`Preset ${preset.name} does not have a valid VISCA preset number`);
      error.status = 400;
      throw error;
    }

    if (this.config.smooth && preset.position) {
      try {
        await smoothMove({
          socketFactory: this.socketFactory, host, port: this.config.port || 52381,
          timeoutMs: this.config.timeoutMs || 1500, target: preset.position,
          durationMs: this.config.smoothDurationMs || 1400
        });
        return { transport, status: "recalled", movement: "smooth", host, port: this.config.port || 52381 };
      } catch {
        // Cameras without reliable position inquiry use their firmware preset.
      }
    }
    await sendViscaUdp({
      socketFactory: this.socketFactory,
      host,
      port: this.config.port || 52381,
      timeoutMs: this.config.timeoutMs || 1500,
      command: viscaRecallPresetCommand(presetIndex)
    });

    return { transport, status: "recalled", movement: "firmware-preset", host, port: this.config.port || 52381, preset: presetIndex };
  }


  async capturePosition({ source }: { source: PtzSource }): Promise<PtzPosition> {
    const host = this.config.host || inferHostFromSource(source);
    if (!host) throw Object.assign(new Error("PTZ host is not configured"), { status: 409 });
    return queryPosition({
      socketFactory: this.socketFactory,
      host,
      port: this.config.port || 52381,
      timeoutMs: this.config.timeoutMs || 1500
    });
  }
}

export function viscaRecallPresetCommand(presetIndex: number): Buffer {
  return Buffer.from([0x81, 0x01, 0x04, 0x3f, 0x02, presetIndex, 0xff]);
}

export function viscaAbsolutePositionCommand({ pan, tilt, panSpeed = 12, tiltSpeed = 10 }: PtzPosition & { panSpeed?: number; tiltSpeed?: number }): Buffer {
  return Buffer.from([
    0x81, 0x01, 0x06, 0x02, panSpeed, tiltSpeed,
    ...nibbles(pan), ...nibbles(tilt), 0xff
  ]);
}

export function viscaAbsoluteZoomCommand(zoom: number): Buffer {
  return Buffer.from([0x81, 0x01, 0x04, 0x47, ...nibbles(zoom), 0xff]);
}

export function inferHostFromSource(source: PtzSource): string | null {
  const sourceName = source?.ndi?.urlAddress || source?.ndi?.sourceName || source?.network?.uri || "";
  const match = String(sourceName).match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);
  return match?.[0] || null;
}

async function smoothMove({ socketFactory, host, port, timeoutMs, target, durationMs }: ViscaOptions & { target: PtzPosition; durationMs: number }): Promise<void> {
  const start = await queryPosition({ socketFactory, host, port, timeoutMs });
  const steps = Math.max(2, Math.round(durationMs / 50));
  for (let index = 1; index <= steps; index += 1) {
    const progress = index / steps;
    const eased = progress * progress * (3 - 2 * progress);
    const position = {
      pan: interpolate(start.pan, target.pan, eased),
      tilt: interpolate(start.tilt, target.tilt, eased),
      zoom: interpolate(start.zoom, target.zoom, eased)
    };
    await sendViscaUdp({ socketFactory, host, port, timeoutMs, command: viscaAbsolutePositionCommand(position) });
    await sendViscaUdp({ socketFactory, host, port, timeoutMs, command: viscaAbsoluteZoomCommand(position.zoom) });
    if (index < steps) await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

async function queryPosition({ socketFactory, host, port, timeoutMs }: ViscaOptions): Promise<PtzPosition> {
  const panTilt = await sendViscaInquiry({ socketFactory, host, port, timeoutMs, command: Buffer.from([0x81, 0x09, 0x06, 0x12, 0xff]) });
  const zoom = await sendViscaInquiry({ socketFactory, host, port, timeoutMs, command: Buffer.from([0x81, 0x09, 0x04, 0x47, 0xff]) });
  if (panTilt.length < 11 || zoom.length < 7 || panTilt[1] !== 0x50 || zoom[1] !== 0x50) throw new Error("Camera returned an unsupported VISCA inquiry response");
  return {
    pan: fromNibbles(panTilt.subarray(2, 6)),
    tilt: fromNibbles(panTilt.subarray(6, 10)),
    zoom: fromNibbles(zoom.subarray(2, 6))
  };
}

async function sendViscaInquiry({ socketFactory, host, port, timeoutMs, command }: ViscaOptions & { command: Buffer }): Promise<Buffer> {
  const socket = socketFactory();
  return new Promise<Buffer>((resolve, reject) => {
    let settled = false;
    const finish = (error: Error | null, message?: Buffer) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.close();
      if (error) reject(error); else resolve(message!);
    };
    const timer = setTimeout(() => finish(new Error(`VISCA inquiry timed out after ${timeoutMs}ms`)), timeoutMs);
    socket.once("error", (error) => finish(error));
    socket.once("message", (message) => finish(null, message));
    if (typeof socket.bind === "function") socket.bind(0, () => socket.send(command, port, host, (error) => error && finish(error)));
    else socket.send(command, port, host, (error) => error && finish(error));
  });
}

function nibbles(value: number): number[] {
  const normalized = Math.round(value) & 0xffff;
  return [(normalized >> 12) & 0x0f, (normalized >> 8) & 0x0f, (normalized >> 4) & 0x0f, normalized & 0x0f];
}

function fromNibbles(bytes: Buffer) {
  let value = 0;
  for (const byte of bytes) value = (value << 4) | (byte & 0x0f);
  return value & 0x8000 ? value - 0x10000 : value;
}

function interpolate(from: number, to: number, progress: number) {
  return Math.round(from + (to - from) * progress);
}

async function sendViscaUdp({ socketFactory, host, port, timeoutMs, command }: ViscaOptions & { command: Buffer }): Promise<void> {
  const socket = socketFactory();
  await new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = (error: Error | null = null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.close();
      if (error) reject(error);
      else resolve();
    };
    const timer = setTimeout(() => finish(new Error(`VISCA UDP command timed out after ${timeoutMs}ms`)), timeoutMs);
    socket.once("error", finish);
    socket.send(command, port, host, finish);
  });
}

function defaultSocketFactory(): dgram.Socket {
  return dgram.createSocket("udp4");
}

const defaultRunner = {
  async recallNdiPreset({ helper, sourceName, urlAddress, presetIndex, speed, settleMs, timeoutMs }: NdiRecallOptions): Promise<void> {
    const command = helper || "python3";
    const args = [
      ...(helper ? [] : [path.resolve(__dirname, "ndi_ptz.py")]),
      "recall-preset",
      "--source",
      sourceName,
      "--preset",
      String(presetIndex),
      "--speed",
      String(speed),
      "--settle-ms",
      String(settleMs)
    ];
    if (urlAddress) args.push("--url-address", urlAddress);
    await execFileAsync(command, args, { timeout: timeoutMs + 3500 });
  }
};
