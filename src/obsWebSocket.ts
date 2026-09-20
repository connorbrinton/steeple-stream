import crypto from "node:crypto";
import type { IncomingMessage, Server } from "node:http";
import type { Duplex } from "node:stream";
import type { BroadcastService } from "./broadcastService.js";
import type { Actor, Broadcast, ObsCredential, SceneMode } from "./domain.js";

const OPCODE_TEXT = 0x1;
const OPCODE_CLOSE = 0x8;

type ObsService = Pick<BroadcastService, "summary" | "setMode" | "start" | "end">;
interface ObsCoordinator {
  setMode(mode: SceneMode, actor?: Actor | null): Promise<unknown>;
  start(actor?: Actor | null): Promise<unknown>;
  end(actor?: Actor | null): Promise<unknown>;
}
type ObsSocket = Duplex & { buffer: Buffer; authenticated: boolean; challenge: string };
type RequestData = Record<string, unknown>;

interface ObsWebSocketOptions {
  server: Server;
  service: ObsService;
  coordinator?: ObsCoordinator | null;
  credential?: ObsCredential | null;
  actor?: Actor | null;
}

export class ObsWebSocketServer {
  declare server: Server;
  declare service: ObsService;
  declare coordinator: ObsCoordinator | null;
  declare credential: ObsCredential | null;
  declare actor: Actor | null;
  declare clients: Set<ObsSocket>;

  constructor({ server, service, coordinator = null, credential = null, actor = null }: ObsWebSocketOptions) {
    this.server = server;
    this.service = service;
    this.coordinator = coordinator;
    this.credential = credential;
    this.actor = actor;
    this.clients = new Set();
    server.on("upgrade", (req, socket) => {
      if (!["/", "/obs"].includes(new URL(req.url, "http://localhost").pathname)) return;
      this.handleUpgrade(req, socket);
    });
  }

  handleUpgrade(req: IncomingMessage, rawSocket: Duplex): void {
    const socket = rawSocket as ObsSocket;
    const key = req.headers["sec-websocket-key"];
    if (!key) {
      socket.destroy();
      return;
    }
    const accept = crypto
      .createHash("sha1")
      .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
      .digest("base64");
    socket.write([
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${accept}`,
      "",
      ""
    ].join("\r\n"));

    socket.buffer = Buffer.alloc(0);
    socket.authenticated = !this.credential;
    socket.challenge = crypto.randomBytes(24).toString("base64");
    socket.on("data", (chunk) => this.handleData(socket, chunk));
    socket.on("close", () => this.clients.delete(socket));
    this.clients.add(socket);
    this.send(socket, {
      op: 0,
      d: {
        obsWebSocketVersion: "5.0.0-steeple",
        rpcVersion: 1,
        ...(this.credential ? { authentication: { challenge: socket.challenge, salt: this.credential.salt } } : {})
      }
    });
  }

  async handleData(socket: ObsSocket, chunk: Buffer): Promise<void> {
    socket.buffer = Buffer.concat([socket.buffer, chunk]);
    while (socket.buffer.length >= 2) {
      const frame = readFrame(socket.buffer);
      if (!frame) return;
      socket.buffer = socket.buffer.subarray(frame.bytesRead);
      if (frame.opcode === OPCODE_CLOSE) {
        socket.end();
        return;
      }
      if (frame.opcode !== OPCODE_TEXT) continue;
      try {
        const payload: unknown = JSON.parse(frame.payload.toString("utf8"));
        await this.handleMessage(socket, payload);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.send(socket, { op: 7, d: { requestStatus: { result: false, code: 400, comment: message } } });
      }
    }
  }

  async handleMessage(socket: ObsSocket, value: unknown): Promise<void> {
    const message = asRecord(value);
    const data = asRecord(message.d);
    if (message.op === 1) {
      if (this.credential) {
        const expected = crypto.createHash("sha256").update(this.credential.secret + socket.challenge).digest("base64");
        if (!safeEqual(data.authentication, expected)) {
          socket.end(encodeCloseFrame(4009, "Authentication failed"));
          return;
        }
      }
      socket.authenticated = true;
      this.send(socket, { op: 2, d: { negotiatedRpcVersion: 1 } });
      return;
    }

    if (message.op !== 6 || !socket.authenticated) return;
    const requestType = String(data.requestType || "");
    const requestId = data.requestId;
    const response = await this.handleRequest(requestType, asRecord(data.requestData));
    this.send(socket, {
      op: 7,
      d: {
        requestType,
        requestId,
        requestStatus: { result: true, code: 100 },
        responseData: response
      }
    });
  }

  async handleRequest(requestType: string, requestData: RequestData): Promise<Record<string, unknown>> {
    switch (requestType) {
      case "GetSceneList": {
        const state = await this.service.summary();
        return {
          currentProgramSceneName: sceneFromState(state.broadcast),
          scenes: [{ sceneName: "Chapel" }, { sceneName: "Sacrament" }]
        };
      }
      case "GetCurrentProgramScene": {
        const state = await this.service.summary();
        return { currentProgramSceneName: sceneFromState(state.broadcast) };
      }
      case "SetCurrentProgramScene": {
        const sceneName = requestData.sceneName || requestData["scene-name"];
        await (this.coordinator || this.service).setMode(sceneName === "Sacrament" ? "sacrament" : "chapel", this.actor);
        return {};
      }
      case "StartStream":
        await (this.coordinator || this.service).start(this.actor);
        return {};
      case "StopStream":
        await (this.coordinator || this.service).end(this.actor);
        return {};
      case "GetStreamStatus": {
        const state = await this.service.summary();
        return {
          outputActive: state.broadcast.status === "live",
          outputReconnecting: false,
          outputTimecode: state.broadcast.startedAt || "00:00:00.000",
          outputDuration: 0,
          outputCongestion: 0,
          outputBytes: 0,
          outputSkippedFrames: 0,
          outputTotalFrames: 0
        };
      }
      default: {
        const error = new Error(`Unsupported OBS request: ${requestType}`);
        error.status = 400;
        throw error;
      }
    }
  }

  send(socket: ObsSocket, payload: unknown): void {
    if (socket.destroyed) return;
    const data = Buffer.from(JSON.stringify(payload));
    const header = encodeHeader(data.length);
    socket.write(Buffer.concat([header, data]));
  }
}

function safeEqual(actual: unknown, expected: string): boolean {
  const a = Buffer.from(String(actual || ""));
  const b = Buffer.from(String(expected));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function encodeCloseFrame(code: number, reason: string): Buffer {
  const payload = Buffer.alloc(2 + Buffer.byteLength(reason));
  payload.writeUInt16BE(code, 0);
  payload.write(reason, 2);
  return Buffer.concat([Buffer.from([0x88, payload.length]), payload]);
}

function sceneFromState(broadcast: Broadcast): string {
  return broadcast.mode === "sacrament" ? "Sacrament" : "Chapel";
}

function readFrame(buffer: Buffer): { opcode: number; payload: Buffer; bytesRead: number } | null {
  const first = buffer[0];
  const second = buffer[1];
  const opcode = first & 0x0f;
  const masked = Boolean(second & 0x80);
  let length = second & 0x7f;
  let offset = 2;

  if (length === 126) {
    if (buffer.length < 4) return null;
    length = buffer.readUInt16BE(2);
    offset = 4;
  } else if (length === 127) {
    if (buffer.length < 10) return null;
    length = Number(buffer.readBigUInt64BE(2));
    offset = 10;
  }

  const maskOffset = offset;
  if (masked) offset += 4;
  if (buffer.length < offset + length) return null;

  const payload = Buffer.from(buffer.subarray(offset, offset + length));
  if (masked) {
    const mask = buffer.subarray(maskOffset, maskOffset + 4);
    for (let index = 0; index < payload.length; index += 1) {
      payload[index] ^= mask[index % 4];
    }
  }

  return { opcode, payload, bytesRead: offset + length };
}

function encodeHeader(length: number): Buffer {
  if (length < 126) return Buffer.from([0x80 | OPCODE_TEXT, length]);
  if (length < 65536) {
    const header = Buffer.alloc(4);
    header[0] = 0x80 | OPCODE_TEXT;
    header[1] = 126;
    header.writeUInt16BE(length, 2);
    return header;
  }
  const header = Buffer.alloc(10);
  header[0] = 0x80 | OPCODE_TEXT;
  header[1] = 127;
  header.writeBigUInt64BE(BigInt(length), 2);
  return header;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
