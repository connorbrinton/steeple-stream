import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { SqliteStore } from "./sqliteStore.js";
import { MediaMtxBackend, type MediaBackendHealth } from "./mediaBackend.js";
import { MediaMtxManager } from "./mediamtxManager.js";
import { BroadcastService } from "./broadcastService.js";
import { IngestManager } from "./ingestManager.js";
import { PtzController } from "./ptzController.js";
import { parseJson, proxyHttp, sendJson, sendStatic } from "./httpUtils.js";
import { SourceDiscoveryService } from "./sourceDiscoveryService.js";
import { LocationCommandCoordinator } from "./commandCoordinator.js";
import { AuthService } from "./authService.js";
import { ObsEndpointManager } from "./obsEndpointManager.js";
import { buildSourceCatalog } from "./sourceCatalog.js";
import { AppRateLimiter, clientIp } from "./rateLimit.js";
import type { PlaybackSession, SceneMode } from "./domain.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");

const store = new SqliteStore(config.databasePath, { legacyPath: config.storePath });
const mediamtxManager = new MediaMtxManager(config.mediamtx);
const mediaBackend = new MediaMtxBackend(config.mediamtx);
const ptzController = new PtzController({ config: config.ptz });
const service = new BroadcastService({ store, mediaBackend, config, ptzController });
const sourceDiscovery = new SourceDiscoveryService({ intervalMs: config.discovery.ndiIntervalMs });
const ingestManager = new IngestManager({
  config: config.ingest,
  ndiDiscovery: async (source) => sourceDiscovery.listNdiSources(source)
});
const coordinator = new LocationCommandCoordinator({ service, ingestManager, mediaManager: mediamtxManager });
const auth = new AuthService({ store, config: config.auth });
const rateLimiter = new AppRateLimiter();
const obsEndpoints = new ObsEndpointManager({ store, service, coordinator, host: config.obsHost });
let latestBackendHealth: MediaBackendHealth | null = null;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  try {
    applySecurityHeaders(res);
    await route(req, res);
  } catch (error) {
    const finalError = await rateLimitedError(req, error);
    const status = finalError.status || 500;
    const headers = finalError.retryAfter ? { "retry-after": String(finalError.retryAfter) } : {};
    sendJson(res, status, { error: finalError.message }, headers);
  }
});

await auth.initialize();
if (config.capabilities.obsControl) await obsEndpoints.reload();
await mediamtxManager.start();
await sourceDiscovery.start({ waitForInitial: true });
await ingestManager.startForState(await service.summary());

server.listen(config.port, config.host, () => {
  console.log(`Steeple Stream listening on http://${config.host}:${config.port}`);
  console.log(`Profile: ${config.profile}`);
  if (config.capabilities.obsControl) console.log(`OBS WebSocket unit endpoints active: ${store.listObsCredentials().length}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    server.close();
    await ingestManager.stop();
    sourceDiscovery.stop();
    await mediamtxManager.stop();
    await obsEndpoints.stop();
    process.exit(0);
  });
}

setInterval(() => {
  if (config.capabilities.recording) {
    service.cleanupExpired().catch((error) => console.error("retention cleanup failed", error));
  }
  if (config.capabilities.publicViewer) {
    try { store.aggregatePlaybackSessions(); } catch (error) { console.error("metrics aggregation failed", error); }
  }
}, 5 * 60 * 1000).unref();

async function route(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const method = req.method || "GET";

  if (method === "GET" && ["/auth/login", "/auth/google"].includes(url.pathname)) {
    if (config.auth.mode === "trusted-proxy") {
      auth.authorize(req, "operator");
      res.writeHead(302, { location: `/broadcasts/${config.channelId}/broadcaster` });
      res.end();
      return;
    }
    await rateLimiter.authStartFor(req, config.auth);
    const target = await auth.begin(url.searchParams.get("returnTo") || `/broadcasts/${config.channelId}/broadcaster`);
    res.writeHead(302, { location: target.href });
    res.end();
    return;
  }

  if (method === "GET" && url.pathname === "/auth/google/callback") {
    await rateLimiter.authCallbackFor(req, config.auth);
    const result = await auth.complete(new URL(req.url, config.publicBaseUrl).href);
    res.writeHead(302, { location: result.returnTo, "set-cookie": auth.sessionCookie(result.token) });
    res.end();
    return;
  }

  if (method === "POST" && url.pathname === "/auth/logout") {
    auth.authorize(req, "operator", { csrfRequired: true });
    auth.logout(req);
    res.writeHead(204, { "set-cookie": auth.clearCookie() });
    res.end();
    return;
  }

  if (method === "GET" && url.pathname === "/api/session") {
    const principal = auth.authenticate(req);
    sendJson(res, principal ? 200 : 401, principal || { error: "Authentication required", loginUrl: "/auth/login" });
    return;
  }

  if (method === "GET" && url.pathname === "/api/health") {
    auth.authorize(req, "operator");
    sendJson(res, 200, await healthSummary());
    return;
  }

  if (method === "GET" && url.pathname === "/api/state") {
    auth.authorize(req, "operator");
    sendJson(res, 200, await service.summary());
    return;
  }

  if (method === "GET" && url.pathname === "/api/events") {
    auth.authorize(req, "operator");
    res.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive"
    });
    const sendState = async () => res.write(`event: state\ndata: ${JSON.stringify(await service.summary())}\n\n`);
    const sendHealth = async (options: HealthOptions) => res.write(`event: health\ndata: ${JSON.stringify(await healthSummary(options))}\n\n`);
    const stateListener = () => sendState().catch(() => {});
    const healthListener = () => sendHealth({ refreshBackend: false }).catch(() => {});
    coordinator.on("changed", stateListener);
    coordinator.on("health-changed", healthListener);
    const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 15000);
    req.on("close", () => {
      clearInterval(heartbeat);
      coordinator.off("changed", stateListener);
      coordinator.off("health-changed", healthListener);
    });
    await sendState();
    await sendHealth({ refreshBackend: true });
    return;
  }

  if (method === "GET" && url.pathname === "/api/public-state") {
    sendJson(res, 200, await service.publicSummary());
    return;
  }

  if (method === "POST" && url.pathname === "/api/broadcast/start") {
    requireCapability("broadcastControls");
    const actor = auth.authorize(req, "operator", { csrfRequired: true });
    sendJson(res, 200, await coordinator.start(actor));
    return;
  }

  if (method === "POST" && url.pathname === "/api/broadcast/end") {
    requireCapability("broadcastControls");
    const actor = auth.authorize(req, "operator", { csrfRequired: true });
    sendJson(res, 200, await coordinator.end(actor));
    return;
  }

  if (method === "POST" && url.pathname === "/api/broadcast/mode") {
    requireCapability("sceneControls");
    const actor = auth.authorize(req, "operator", { csrfRequired: true });
    const body = await parseJson(req);
    sendJson(res, 200, await coordinator.setMode(sceneMode(body.mode), actor));
    return;
  }

  if (method === "PUT" && url.pathname === "/api/source") {
    const actor = auth.authorize(req, "administrator", { csrfRequired: true });
    const body = await parseJson(req);
    sendJson(res, 200, await coordinator.updateSource(body, actor));
    return;
  }

  if (method === "PUT" && url.pathname === "/api/camera-control-source") {
    const actor = auth.authorize(req, "administrator", { csrfRequired: true });
    const body = await parseJson(req);
    sendJson(res, 200, await coordinator.updateCameraControlSource(body, actor));
    return;
  }

  if (method === "POST" && (url.pathname === "/api/sources/manual" || url.pathname === "/api/sources/configured")) {
    const actor = auth.authorize(req, "administrator", { csrfRequired: true });
    const body = await parseJson(req);
    sendJson(res, 201, await coordinator.addManualSource(body, actor));
    return;
  }

  if (method === "GET" && url.pathname === "/api/sources") {
    auth.authorize(req, "administrator");
    sourceDiscovery.triggerRefresh();
    sendJson(res, 200, await sourceCatalogSummary({ refreshBackend: false }));
    return;
  }

  if (method === "GET" && url.pathname === "/api/sources/ndi") {
    auth.authorize(req, "administrator");
    sourceDiscovery.triggerRefresh();
    const catalog = await sourceCatalogSummary({ refreshBackend: false });
    sendJson(res, 200, {
      sources: catalog.sources.filter((source) => source.type === "ndi").map((source) => ({
        name: source.source.ndi.sourceName,
        urlAddress: source.source.ndi.urlAddress,
        source: source.discoveryMethod || source.origin,
        configured: source.configured,
        available: source.available
      })),
      discovery: catalog.discovery
    });
    return;
  }

  if (method === "POST" && url.pathname === "/api/viewers") {
    requireCapability("publicViewer");
    const body = await parseJson(req);
    sendJson(res, 200, await service.registerViewer({
      name: body.name,
      sessionId: body.sessionId,
      userAgent: req.headers["user-agent"],
      ip: clientIp(req, config.auth)
    }));
    return;
  }

  if (method === "POST" && url.pathname === "/api/playback-sessions") {
    requireCapability("publicViewer");
    const body = await parseJson(req);
    if (!body.id || !body.viewerId || !String(body.viewerName || "").trim()) {
      sendJson(res, 400, { error: "Playback session id, viewer id, and viewer name are required" });
      return;
    }
    store.upsertPlaybackSession({
      id: String(body.id),
      viewerId: String(body.viewerId),
      viewerName: String(body.viewerName).trim().slice(0, 80),
      locationId: config.channelId,
      broadcastId: optionalString(body.broadcastId),
      transport: optionalString(body.transport),
      candidateType: optionalString(body.candidateType),
      startedAt: optionalString(body.startedAt) || undefined,
      endedAt: optionalString(body.endedAt),
      watchSeconds: optionalNumber(body.watchSeconds),
      startupMs: optionalNumber(body.startupMs),
      bufferingMs: optionalNumber(body.bufferingMs),
      bufferingCount: optionalNumber(body.bufferingCount),
      reconnectCount: optionalNumber(body.reconnectCount),
      fallbackReason: optionalString(body.fallbackReason),
      terminalError: optionalString(body.terminalError),
      ip: clientIp(req, config.auth),
      userAgent: req.headers["user-agent"] || null
    } satisfies PlaybackSession);
    sendJson(res, 202, { accepted: true });
    return;
  }

  if (method === "POST" && url.pathname === "/api/ptz/recall") {
    const actor = auth.authorize(req, "operator", { csrfRequired: true });
    const body = await parseJson(req);
    sendJson(res, 200, await coordinator.recallPreset(String(body.presetId || ""), actor));
    return;
  }

  if (method === "POST" && url.pathname === "/api/ptz/capture") {
    const actor = auth.authorize(req, "administrator", { csrfRequired: true });
    const body = await parseJson(req);
    sendJson(res, 200, await coordinator.capturePreset(String(body.presetId || ""), actor));
    return;
  }

  if (method === "POST" && url.pathname === "/api/retention/cleanup") {
    requireCapability("recording");
    auth.authorize(req, "administrator", { csrfRequired: true });
    sendJson(res, 200, await service.cleanupExpired());
    return;
  }

  if (method === "GET" && url.pathname === "/api/obs-credentials") {
    requireCapability("obsControl");
    auth.authorize(req, "administrator");
    sendJson(res, 200, { credentials: store.listObsCredentials().map(({ secret, salt, ...entry }) => entry) });
    return;
  }

  if (method === "POST" && url.pathname === "/api/obs-credentials") {
    requireCapability("obsControl");
    auth.authorize(req, "administrator", { csrfRequired: true });
    const body = await parseJson(req);
    if (!String(body.unitName || "").trim() || !Number.isInteger(Number(body.port)) || Number(body.port) < 1024 || Number(body.port) > 65535) {
      sendJson(res, 400, { error: "Unit name and a port from 1024 through 65535 are required" });
      return;
    }
    const credential = store.createObsCredential({ unitName: String(body.unitName), port: Number(body.port) });
    await obsEndpoints.reload();
    sendJson(res, 201, credential);
    return;
  }

  if ((method === "GET" || method === "HEAD") && url.pathname === "/admin") {
    res.writeHead(302, { location: `/broadcasts/${config.channelId}/admin` });
    res.end();
    return;
  }

  if ((method === "GET" || method === "HEAD") && url.pathname === "/broadcaster") {
    res.writeHead(302, { location: `/broadcasts/${config.channelId}/broadcaster` });
    res.end();
    return;
  }

  if (method === "GET" && url.pathname === `/broadcasts/${config.channelId}/admin`) {
    const principal = auth.authenticate(req);
    if (!principal) {
      res.writeHead(302, { location: `/auth/login?returnTo=${encodeURIComponent(url.pathname)}` });
      res.end();
      return;
    }
    if (principal.role !== "administrator") {
      res.writeHead(302, { location: `/broadcasts/${config.channelId}/broadcaster` });
      res.end();
      return;
    }
    await sendStatic(res, publicDir, "/admin.html");
    return;
  }

  if (method === "GET" && url.pathname === `/broadcasts/${config.channelId}/broadcaster`) {
    if (!auth.authenticate(req)) {
      res.writeHead(302, { location: `/auth/login?returnTo=${encodeURIComponent(url.pathname)}` });
      res.end();
      return;
    }
    await sendStatic(res, publicDir, "/broadcaster.html");
    return;
  }

  if (method === "GET" && url.pathname === `/broadcasts/${config.channelId}`) {
    requireCapability("publicViewer");
    await sendStatic(res, publicDir, "/viewer.html");
    return;
  }

  if ((method === "GET" || method === "HEAD") && url.pathname.startsWith("/hls/")) {
    if (!config.capabilities.publicViewer) auth.authorize(req, "operator");
    const state = await service.summary();
    if (state.broadcast.status !== "live" && !auth.authenticate(req)) {
      sendJson(res, 404, { error: "Broadcast is not live" });
      return;
    }
    await proxyHttp(req, res, config.mediamtx.hlsProxyBaseUrl, url.pathname.replace(/^\/hls/, "") + url.search);
    return;
  }

  if (["POST", "PATCH", "DELETE", "OPTIONS"].includes(method) && url.pathname.startsWith("/webrtc/")) {
    const state = await service.summary();
    if (state.broadcast.status !== "live" && !auth.authenticate(req)) {
      sendJson(res, 404, { error: "Broadcast is not live" });
      return;
    }
    await proxyHttp(req, res, "http://127.0.0.1:8889", url.pathname.replace(/^\/webrtc/, "") + url.search, { locationPrefix: "/webrtc" });
    return;
  }

  if ((method === "GET" || method === "HEAD") && url.pathname.startsWith("/recordings/")) {
    requireCapability("recording");
    const id = decodeURIComponent(url.pathname.slice("/recordings/".length));
    const state = await service.summary();
    const recording = state.recordings.find((entry) => entry.id === id && entry.status === "available");
    if (!recording || !recording.startedAt || !recording.endedAt || new Date(recording.expiresAt) <= new Date()) {
      sendJson(res, 404, { error: "Recording not found" });
      return;
    }
    const duration = Math.max(1, (new Date(recording.endedAt).getTime() - new Date(recording.startedAt).getTime()) / 1000);
    const query = new URLSearchParams({
      path: config.channelId,
      start: recording.startedAt,
      duration: String(duration),
      format: "mp4"
    });
    await proxyHttp(req, res, config.mediamtx.playbackBaseUrl, `/get?${query}`);
    return;
  }

  if (method === "GET" && (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/build/") || url.pathname.startsWith("/vendor/"))) {
    await sendStatic(res, publicDir, url.pathname);
    return;
  }

  if (method === "GET" && url.pathname === "/") {
    res.writeHead(302, { location: config.capabilities.publicViewer ? `/broadcasts/${config.channelId}` : `/broadcasts/${config.channelId}/broadcaster` });
    res.end();
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

async function rateLimitedError(req: IncomingMessage, value: unknown): Promise<Error> {
  const error = asError(value);
  if (error.status !== 401 || !(req.url || "").startsWith("/api/")) return error;
  try {
    await rateLimiter.unauthenticatedApiFor(req, config.auth);
    return error;
  } catch (rateLimitError) {
    return asError(rateLimitError);
  }
}

type CapabilityName = Exclude<keyof typeof config.capabilities, "profile">;

function requireCapability(name: CapabilityName): void {
  if (config.capabilities[name]) return;
  const error = new Error(`Capability is disabled in ${config.profile} profile: ${name}`);
  error.status = 404;
  throw error;
}

function applySecurityHeaders(res: ServerResponse): void {
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("x-frame-options", "DENY");
  res.setHeader("referrer-policy", "same-origin");
  res.setHeader("permissions-policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("content-security-policy", "default-src 'self'; connect-src 'self'; media-src 'self' blob:; img-src 'self' data:; style-src 'self'; script-src 'self'");
}

interface HealthOptions { refreshBackend?: boolean }

async function healthSummary({ refreshBackend = true }: HealthOptions = {}) {
  let backend = latestBackendHealth;
  if (refreshBackend || !backend) {
    backend = await mediaBackend.getHealth(config.channelId);
    latestBackendHealth = backend;
  }
  return {
    ok: true,
    app: "steeple-stream",
    backend,
    ingest: ingestManager.status(),
    discovery: sourceDiscovery.status()
  };
}

async function sourceCatalogSummary({ refreshBackend = true }: HealthOptions = {}) {
  const state = await service.summary();
  const health = await healthSummary({ refreshBackend });
  return buildSourceCatalog({
    activeSource: state.source,
    cameraControlSource: state.cameraControlSource,
    manualSources: state.manualSources || state.configuredSources || [],
    discoveredNdiSources: sourceDiscovery.listNdiSources(),
    discoveryStatus: sourceDiscovery.status(),
    ingestStatus: health.ingest,
    backendHealth: health.backend
  });
}

function asError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

function optionalString(value: unknown): string | null {
  return value === undefined || value === null || value === "" ? null : String(value);
}

function optionalNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function sceneMode(value: unknown): SceneMode {
  if (value === "chapel" || value === "sacrament") return value;
  const error = new Error("Mode must be chapel or sacrament");
  error.status = 400;
  throw error;
}
