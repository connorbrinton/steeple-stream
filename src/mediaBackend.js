export class MediaMtxBackend {
    constructor(options) {
        this.options = options;
    }
    getPlayback(channelId) {
        const encoded = encodeURIComponent(channelId);
        const playback = {
            publish: {
                rtmpUrl: `rtmp://localhost:1935/${encoded}`,
                rtspUrl: `rtsp://localhost:8554/${encoded}`,
                srtUrl: `srt://localhost:8890?streamid=publish:${encoded}`
            }
        };
        if (this.options.hls !== false && this.options.hlsBaseUrl) {
            playback.hlsUrl = `${this.options.hlsBaseUrl}/${encoded}/index.m3u8`;
        }
        if (this.options.publicWebRtc !== false && this.options.webrtcBaseUrl) {
            playback.webrtcUrl = `${this.options.webrtcBaseUrl}/${encoded}-webrtc/whep`;
        }
        return playback;
    }
    async getHealth(channelId) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1500);
        try {
            const response = await fetch(`${this.options.apiBaseUrl}/v3/paths/get/${encodeURIComponent(channelId)}`, {
                signal: controller.signal
            });
            if (!response.ok) {
                return { ok: false, backend: "mediamtx", message: `MediaMTX API returned ${response.status}` };
            }
            const body = await response.json();
            return {
                ok: true,
                backend: "mediamtx",
                ready: Boolean(body.ready),
                readers: body.readers?.length || 0,
                source: body.source || null
            };
        }
        catch (error) {
            return { ok: false, backend: "mediamtx", message: error.name === "AbortError" ? "MediaMTX API timed out" : error.message };
        }
        finally {
            clearTimeout(timeout);
        }
    }
}
