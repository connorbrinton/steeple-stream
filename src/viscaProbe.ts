import dgram from "node:dgram";
import { isIP } from "node:net";
import type { VideoSource } from "./domain.js";

type Protocol = "sony-visca-ip" | "raw-visca-udp";
type Inquiry = "version" | "panTilt" | "zoom";
type Position = { pan: number; tilt: number; zoom: number };

const commands: Record<Inquiry, Buffer> = {
  version: Buffer.from([0x81, 0x09, 0x00, 0x02, 0xff]),
  panTilt: Buffer.from([0x81, 0x09, 0x06, 0x12, 0xff]),
  zoom: Buffer.from([0x81, 0x09, 0x04, 0x47, 0xff]),
};

export interface CameraProbeReport {
  host: string;
  protocol: Protocol | null;
  port: number | null;
  version: string | null;
  position: Position | null;
  repeatedPosition: Position | null;
  responseMs: number | null;
  motionSync: "unknown";
  status: "reachable" | "unresponsive";
  note: string;
}

/**
 * Never probe an arbitrary address supplied by the browser: only an RFC1918
 * or local-link camera IP from the saved NDI camera control source.
 */
export function configuredCameraHost(source: VideoSource): string {
  if (source?.type !== "ndi")
    throw Object.assign(new Error("Select an NDI camera control source first"), { status: 409 });
  const fields = [source.ndi?.urlAddress, source.ndi?.sourceName];
  for (const field of fields) {
    const matches = String(field || "").match(/(?:\d{1,3}\.){3}\d{1,3}/g) || [];
    for (const address of matches) {
      if (isPrivateCameraIp(address)) return address;
    }
  }
  throw Object.assign(
    new Error("No private IPv4 camera address found in the selected NDI source"),
    { status: 409 },
  );
}

function isPrivateCameraIp(value: string): boolean {
  if (isIP(value) !== 4) return false;
  const [a, b = 0] = value.split(".").map(Number);
  return (
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    (a === 100 && b >= 64 && b <= 127)
  );
}

export function viscaInquiryPacket(payload: Buffer, sequence: number, protocol: Protocol): Buffer {
  if (protocol === "raw-visca-udp") return payload;
  const header = Buffer.alloc(8);
  header.writeUInt16BE(0x0110, 0); // VISCA inquiry over Sony VISCA-IP
  header.writeUInt16BE(payload.length, 2);
  header.writeUInt32BE(sequence, 4);
  return Buffer.concat([header, payload]);
}

export function viscaResponseBody(
  packet: Buffer,
  sequence: number,
  protocol: Protocol,
): Buffer | null {
  if (protocol === "raw-visca-udp") return packet;
  if (packet.length < 11 || packet[0] !== 0x01) return null;
  if (packet[1] !== 0x11 && packet[1] !== 0x10) return null;
  const length = packet.readUInt16BE(2);
  if (length < 3 || packet.length !== length + 8 || packet.readUInt32BE(4) !== sequence)
    return null;
  return packet.subarray(8);
}

function decodeFourNibbles(buffer: Buffer, offset: number, signed: boolean): number {
  if (buffer.length < offset + 4) throw new Error("Short VISCA position response");
  let number = 0;
  for (let i = 0; i < 4; i++) {
    if (buffer[offset + i]! > 15) throw new Error("Invalid VISCA position nibble");
    number = (number << 4) | buffer[offset + i]!;
  }
  return signed && number >= 0x8000 ? number - 0x10000 : number;
}

export function decodePanTilt(body: Buffer): { pan: number; tilt: number } {
  if (body.length !== 11 || body[0] !== 0x90 || body[1] !== 0x50 || body[10] !== 0xff)
    throw new Error("Invalid VISCA pan/tilt response");
  return { pan: decodeFourNibbles(body, 2, true), tilt: decodeFourNibbles(body, 6, true) };
}

export function decodeZoom(body: Buffer): number {
  if (body.length !== 7 || body[0] !== 0x90 || body[1] !== 0x50 || body[6] !== 0xff)
    throw new Error("Invalid VISCA zoom response");
  return decodeFourNibbles(body, 2, false);
}

async function inquire(
  host: string,
  port: number,
  protocol: Protocol,
  inquiry: Inquiry,
  sequence: number,
  timeoutMs: number,
): Promise<{ body: Buffer; ms: number } | null> {
  const socket = dgram.createSocket("udp4");
  const packet = viscaInquiryPacket(commands[inquiry], sequence, protocol);
  const started = performance.now();
  return new Promise((resolve) => {
    let done = false;
    const finish = (result: { body: Buffer; ms: number } | null) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      socket.close();
      resolve(result);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    socket.on("error", () => finish(null));
    socket.on("message", (data, remote) => {
      if (remote.address !== host) return;
      const body = viscaResponseBody(data, sequence, protocol);
      if (!body || body[0] !== 0x90 || body.at(-1) !== 0xff) return;
      if ((body[1]! & 0xf0) === 0x40) return; // ACK, not the inquiry response
      if ((body[1]! & 0xf0) === 0x50) finish({ body, ms: performance.now() - started });
      else if ((body[1]! & 0xf0) === 0x60) finish(null); // camera rejected inquiry
    });
    socket.send(packet, port, host, (error) => {
      if (error) finish(null);
    });
  });
}

/** Read-only inquiries; no recall, movement, storage, or camera settings writes. */
export async function probeVisca(
  host: string,
  options: { port?: number; timeoutMs?: number } = {},
): Promise<CameraProbeReport> {
  if (!isPrivateCameraIp(host)) throw new Error("Probe requires a private camera IPv4 address");
  const port = options.port ?? 52381;
  const timeoutMs = options.timeoutMs ?? 700;
  let sequence = 0;
  const targets: Array<{ protocol: Protocol; port: number }> = [
    { protocol: "sony-visca-ip", port },
    { protocol: "raw-visca-udp", port },
    ...(port === 1259 ? [] : [{ protocol: "raw-visca-udp" as const, port: 1259 }]),
  ];
  for (const target of targets) {
    const version = await inquire(
      host,
      target.port,
      target.protocol,
      "version",
      ++sequence,
      timeoutMs,
    );
    const pt = await inquire(host, target.port, target.protocol, "panTilt", ++sequence, timeoutMs);
    if (!version && !pt) continue;
    const zoom = await inquire(host, target.port, target.protocol, "zoom", ++sequence, timeoutMs);
    let position: Position | null = null;
    let repeatedPosition: Position | null = null;
    if (pt && zoom) {
      try {
        position = { ...decodePanTilt(pt.body), zoom: decodeZoom(zoom.body) };
        await new Promise((resolve) => setTimeout(resolve, 200));
        const secondPt = await inquire(
          host,
          target.port,
          target.protocol,
          "panTilt",
          ++sequence,
          timeoutMs,
        );
        const secondZoom = await inquire(
          host,
          target.port,
          target.protocol,
          "zoom",
          ++sequence,
          timeoutMs,
        );
        if (secondPt && secondZoom)
          repeatedPosition = { ...decodePanTilt(secondPt.body), zoom: decodeZoom(secondZoom.body) };
      } catch {
        // A responding camera may not implement one or both position formats.
      }
    }
    return {
      host,
      protocol: target.protocol,
      port: target.port,
      version: version?.body.toString("hex") || null,
      position,
      repeatedPosition,
      responseMs: pt?.ms ?? version?.ms ?? null,
      motionSync: "unknown",
      status: "reachable",
      note: position
        ? "Read-only position inquiries succeeded. Motion Sync is a camera-specific setting and was not changed."
        : "VISCA replied, but a complete PTZ position was not available.",
    };
  }
  return {
    host,
    protocol: null,
    port: null,
    version: null,
    position: null,
    repeatedPosition: null,
    responseMs: null,
    motionSync: "unknown",
    status: "unresponsive",
    note: "No VISCA reply. This does not prove the camera lacks VISCA; it may use another transport or reply port.",
  };
}
