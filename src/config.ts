import path from "node:path";

const dataDir = process.env.STEEPLE_DATA_DIR || path.resolve("data");
const publicBaseUrl = process.env.STEEPLE_PUBLIC_BASE_URL || "http://localhost:8080";
const csv = (value: string | undefined) =>
  new Set(
    String(value || "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  );
const profile = process.env.STEEPLE_PROFILE || "broadcast";
const host = process.env.STEEPLE_HOST || "127.0.0.1";
const channelId = process.env.STEEPLE_CHANNEL_ID || "stakecenter";

if (!["broadcast", "camera-control"].includes(profile)) {
  throw new Error(`Unsupported Steeple Stream profile: ${profile}`);
}

const capabilities = {
  profile,
  admin: true,
  cameraControl: true,
  livePreview: true,
  broadcastControls: profile === "broadcast",
  sceneControls: profile === "broadcast",
  publicViewer: profile === "broadcast",
  hlsScrub: profile === "broadcast",
  recording: profile === "broadcast",
  obsControl: profile === "broadcast",
};

export const config = {
  profile,
  capabilities,
  host,
  port: Number(process.env.STEEPLE_PORT || 8080),
  obsPort: Number(process.env.STEEPLE_OBS_PORT || 4455),
  obsHost: process.env.STEEPLE_OBS_HOST || "127.0.0.1",
  dataDir,
  storePath: process.env.STEEPLE_STORE_PATH || path.join(dataDir, "steeple-stream.json"),
  databasePath: process.env.STEEPLE_DATABASE_PATH || path.join(dataDir, "steeple-stream.sqlite"),
  publicBaseUrl,
  channelId,
  retentionHours: Number(process.env.STEEPLE_RETENTION_HOURS || 24),
  auth: {
    mode: process.env.STEEPLE_AUTH_MODE || "google",
    clientId: process.env.STEEPLE_GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.STEEPLE_GOOGLE_CLIENT_SECRET || "",
    redirectUri: process.env.STEEPLE_GOOGLE_REDIRECT_URI || `${publicBaseUrl}/auth/google/callback`,
    adminEmails: csv(process.env.STEEPLE_ADMIN_EMAILS),
    operatorEmails: csv(process.env.STEEPLE_OPERATOR_EMAILS),
    sessionSecret: process.env.STEEPLE_SESSION_SECRET || "development-only",
    sessionHours: Number(process.env.STEEPLE_SESSION_HOURS || 12),
    channelId,
    publicBaseUrl,
    host,
    trustedProxy: process.env.STEEPLE_TRUSTED_PROXY === "1",
    requireProductionConfig: process.env.STEEPLE_AUTH_REQUIRE_PRODUCTION !== "0",
  },
  ptz: {
    transport: process.env.STEEPLE_PTZ_TRANSPORT || "ndi",
    host: process.env.STEEPLE_PTZ_HOST || null,
    port: Number(process.env.STEEPLE_PTZ_PORT || 52381),
    timeoutMs: Number(process.env.STEEPLE_PTZ_TIMEOUT_MS || 1500),
    smooth: process.env.STEEPLE_PTZ_SMOOTH !== "0",
    smoothDurationMs: Number(process.env.STEEPLE_PTZ_SMOOTH_DURATION_MS || 1400),
    ndiHelper: process.env.STEEPLE_NDI_PTZ_HELPER || null,
    ndiPresetSpeed: Number(process.env.STEEPLE_NDI_PTZ_PRESET_SPEED || 1),
    ndiSettleMs: Number(process.env.STEEPLE_NDI_PTZ_SETTLE_MS || 750),
  },
  discovery: {
    ndiIntervalMs: Number(process.env.STEEPLE_NDI_DISCOVERY_INTERVAL_MS || 7000),
  },
  ingest: {
    autoStart: process.env.STEEPLE_INGEST_AUTO_START !== "0",
    sceneControls: capabilities.sceneControls,
    runtime: process.env.STEEPLE_INGEST_RUNTIME || "system",
    videoBitrateKbps: Number(process.env.STEEPLE_INGEST_VIDEO_BITRATE_KBPS || 4500),
    audioBitrate: Number(process.env.STEEPLE_INGEST_AUDIO_BITRATE || 128000),
    frameRate: Number(process.env.STEEPLE_INGEST_FRAME_RATE || 30),
    transitionDurationMs: Number(process.env.STEEPLE_TRANSITION_DURATION_MS || 600),
    rtmpUrl:
      process.env.STEEPLE_INGEST_RTMP_URL ||
      `rtmp://127.0.0.1:1935/${process.env.STEEPLE_CHANNEL_ID || "stakecenter"}`,
    webrtcRtspUrl:
      process.env.STEEPLE_INGEST_WEBRTC_RTSP_URL ||
      `rtsp://127.0.0.1:8554/${process.env.STEEPLE_CHANNEL_ID || "stakecenter"}-webrtc`,
    gstLaunchBinary: process.env.STEEPLE_GST_LAUNCH_BINARY || null,
    ndiRuntimeDir: process.env.STEEPLE_NDI_RUNTIME_DIR || null,
    ndiNixPackage: process.env.STEEPLE_NDI_NIX_PACKAGE || "nixpkgs#ndi",
  },
  mediamtx: {
    channelId: process.env.STEEPLE_CHANNEL_ID || "stakecenter",
    autoStart: process.env.STEEPLE_MEDIAMTX_AUTO_START !== "0",
    hls: process.env.STEEPLE_MEDIAMTX_HLS !== "0",
    playback: capabilities.recording && process.env.STEEPLE_MEDIAMTX_PLAYBACK !== "0",
    runtime: process.env.STEEPLE_MEDIAMTX_RUNTIME || "system",
    nixPackage: process.env.STEEPLE_MEDIAMTX_NIX_PACKAGE || "nixpkgs#mediamtx",
    binaryPath: process.env.STEEPLE_MEDIAMTX_BINARY || null,
    version: process.env.STEEPLE_MEDIAMTX_VERSION || "v1.19.2",
    cacheDir: process.env.STEEPLE_MEDIAMTX_CACHE_DIR || path.join(dataDir, "bin", "mediamtx"),
    configPath: process.env.STEEPLE_MEDIAMTX_CONFIG || path.join(dataDir, "mediamtx.yml"),
    recordingsDir: process.env.STEEPLE_RECORDINGS_DIR || path.join(dataDir, "recordings"),
    apiBaseUrl: process.env.STEEPLE_MEDIAMTX_BASE_URL || "http://127.0.0.1:9997",
    hlsBaseUrl: process.env.STEEPLE_HLS_BASE_URL || "/hls",
    hlsProxyBaseUrl: process.env.STEEPLE_HLS_PROXY_BASE_URL || "http://localhost:8888",
    playbackBaseUrl: process.env.STEEPLE_PLAYBACK_BASE_URL || "http://127.0.0.1:9996",
    webrtcBaseUrl: process.env.STEEPLE_WEBRTC_BASE_URL || "/webrtc",
    publicWebRtc: process.env.STEEPLE_PUBLIC_WEBRTC !== "0",
  },
};
