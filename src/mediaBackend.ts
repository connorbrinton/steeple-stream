import type { Playback } from "./domain.js";

interface MediaMtxBackendOptions {
  apiBaseUrl: string;
  hls?: boolean;
  hlsBaseUrl?: string;
  publicWebRtc?: boolean;
  webrtcBaseUrl?: string;
}

interface MediaMtxPathResponse {
  ready?: boolean;
  readers?: unknown[];
  source?: unknown;
}

export type MediaBackendHealth =
  | { ok: true; backend: "mediamtx"; ready: boolean; readers: number; source: unknown }
  | { ok: false; backend: "mediamtx"; message: string };

export class MediaMtxBackend {
  declare options: MediaMtxBackendOptions;

  constructor(options: MediaMtxBackendOptions) {
    this.options = options;
  }

  getPlayback(channelId: string): Playback {
    const encoded = encodeURIComponent(channelId);
    const playback: Playback = {
      publish: {
        rtmpUrl: `rtmp://localhost:1935/${encoded}`,
        rtspUrl: `rtsp://localhost:8554/${encoded}`,
        srtUrl: `srt://localhost:8890?streamid=publish:${encoded}`,
      },
    };
    if (this.options.hls !== false && this.options.hlsBaseUrl) {
      playback.hlsUrl = `${this.options.hlsBaseUrl}/${encoded}/index.m3u8`;
    }
    if (this.options.publicWebRtc !== false && this.options.webrtcBaseUrl) {
      playback.webrtcUrl = `${this.options.webrtcBaseUrl}/${encoded}-webrtc/whep`;
    }
    return playback;
  }

  async getHealth(channelId: string): Promise<MediaBackendHealth> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    try {
      const response = await fetch(
        `${this.options.apiBaseUrl}/v3/paths/get/${encodeURIComponent(channelId)}`,
        {
          signal: controller.signal,
        },
      );
      if (!response.ok) {
        return {
          ok: false,
          backend: "mediamtx",
          message: `MediaMTX API returned ${response.status}`,
        };
      }
      const value: unknown = await response.json();
      const body: MediaMtxPathResponse =
        value && typeof value === "object" ? (value as MediaMtxPathResponse) : {};
      return {
        ok: true,
        backend: "mediamtx",
        ready: Boolean(body.ready),
        readers: body.readers?.length || 0,
        source: body.source || null,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        backend: "mediamtx",
        message:
          error instanceof Error && error.name === "AbortError"
            ? "MediaMTX API timed out"
            : message,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
