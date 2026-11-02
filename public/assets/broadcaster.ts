import { installManualCamera } from "./manual-camera.js";
const statusDot = document.querySelector("#status-dot")!;
const statusLabel = document.querySelector("#status-label")!;
const details = document.querySelector("#broadcast-details")!;
const broadcastControlsGroup = document.querySelector("#broadcast-controls-group")!;
const ptzControls = document.querySelector("#ptz-controls")!;
const smoothPresetRecall = document.querySelector<HTMLInputElement>("#smooth-preset-recall")!;
const stopCameraMotion = document.querySelector<HTMLButtonElement>("#stop-camera-motion")!;
const adminPreview = document.querySelector("#admin-preview")!;
const previewTransport = document.querySelector<HTMLElement>("#preview-transport")!;
const previewTransportDetail = document.querySelector<HTMLElement>("#preview-transport-detail")!;
const unitDialog = document.querySelector<HTMLDialogElement>("#unit-dialog")!;
const unitDialogOptions = document.querySelector("#unit-dialog-options")!;

let latestHealth: { ingest?: unknown } | null = null;
let latestState: unknown = null;
let latestPreviewSignature = "";
let csrfToken = "";
let sessionReady = false;
let sessionPending = false;
let previewRequested = false;
let previewAssets: Promise<void> | null = null;
const presetStorageKey = `steeple:camera-presets:${location.pathname}`;
let presetSignature = "";
let latestRecall = 0;
let manualSourceSignature = "";

stopCameraMotion.addEventListener("click", async () => {
  stopCameraMotion.disabled = true;
  try {
    await post("/api/ptz/stop", {}, "POST", false);
  } catch (error) {
    console.error("Camera stop failed", error);
  } finally {
    stopCameraMotion.disabled = false;
  }
});

document.querySelector("#start")!.addEventListener("click", () => startBroadcast());
document.querySelector("#unit-dialog-cancel")!.addEventListener("click", () => unitDialog.close());
document
  .querySelector("#chapel")!
  .addEventListener("click", () => post("/api/broadcast/mode", { mode: "chapel" }));
document
  .querySelector("#sacrament")!
  .addEventListener("click", () => post("/api/broadcast/mode", { mode: "sacrament" }));
document.querySelector("#end")!.addEventListener("click", () => post("/api/broadcast/end"));

async function post(url, body = {}, method: "POST" | "PUT" = "POST", refreshAfter = true) {
  if (!csrfToken) {
    alert("Connecting to camera control. Check your connection and try again.");
    throw new Error("Not connected to camera control");
  }
  const response = await fetch(url, {
    method,
    headers: { "content-type": "application/json", "x-steeple-csrf": csrfToken },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  }).catch((error) => {
    alert("Could not send the request. Check your connection and try again.");
    throw error;
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: response.statusText }));
    if (payload.code === "unit-selection-required")
      throw Object.assign(new Error(payload.error), { payload });
    alert(payload.error);
    throw new Error(payload.error);
  }
  const payload = await response.json().catch(() => null);
  if (method === "POST" && refreshAfter) await refresh();
  return payload;
}

async function startBroadcast(unitId?: string) {
  try {
    await post("/api/broadcast/start", unitId ? { unitId } : {});
    if (unitDialog.open) unitDialog.close();
  } catch (error) {
    const payload = error instanceof Error && "payload" in error ? error.payload : null;
    if (!isUnitSelection(payload)) return;
    unitDialogOptions.innerHTML = "";
    for (const unit of payload.units) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button primary";
      button.textContent = unit.name;
      button.addEventListener("click", () => startBroadcast(unit.id));
      unitDialogOptions.append(button);
    }
    unitDialog.showModal();
  }
}

function isUnitSelection(
  value: unknown,
): value is { code: "unit-selection-required"; units: Array<{ id: string; name: string }> } {
  if (!value || typeof value !== "object") return false;
  const payload = value as { code?: unknown; units?: unknown };
  return payload.code === "unit-selection-required" && Array.isArray(payload.units);
}

async function refresh() {
  const response = await fetch("/api/state", {
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  });
  if (!response.ok) {
    if (response.status === 401) {
      location.href = "/auth/login";
      return;
    }
    throw new Error(`Could not refresh camera state: ${response.status}`);
  }
  renderState(await response.json());

  // A slow health/preview endpoint must not delay camera controls.
  void fetch("/api/health", { cache: "no-store", signal: AbortSignal.timeout(6000) })
    .then((result) => {
      if (!result.ok) throw new Error(`Health request failed: ${result.status}`);
      return result.json();
    })
    .then((healthState) => {
      latestHealth = healthState;
      if (previewRequested && window.SteeplePlayer && latestState) renderPreview(latestState);
    })
    .catch(console.error);
}

function renderState(state) {
  const controlSource = JSON.stringify(state.cameraControlSource || state.source);
  if (manualSourceSignature && controlSource !== manualSourceSignature)
    window.dispatchEvent(new Event("camera-source-changed"));
  manualSourceSignature = controlSource;
  latestState = state;
  const broadcast = state.broadcast;
  const capabilities = state.capabilities || {};
  broadcastControlsGroup.hidden = !capabilities.broadcastControls;
  document.querySelector("#chapel")!.hidden = !capabilities.sceneControls;
  document.querySelector("#sacrament")!.hidden = !capabilities.sceneControls;
  statusDot.className = `dot ${broadcast.status === "live" ? broadcast.mode : ""}`;
  statusLabel.textContent = capabilities.broadcastControls
    ? broadcast.status === "live"
      ? `${broadcast.mode} live`
      : broadcast.status
    : "camera control";
  const association = broadcast.association
    ? ` Unit: ${broadcast.association.unitName}. Meeting: ${broadcast.association.title}.`
    : "";
  details.textContent = `Status: ${broadcast.status}. Mode: ${broadcast.mode}.${association} Started: ${format(broadcast.startedAt)}. Expires: ${format(broadcast.expiresAt)}.`;
  document.querySelector("#chapel")!.classList.toggle("active", broadcast.mode === "chapel");
  document.querySelector("#sacrament")!.classList.toggle("active", broadcast.mode === "sacrament");
  if (previewRequested && window.SteeplePlayer) renderPreview(state);
  renderPtzControls(state);
  try {
    localStorage.setItem(
      presetStorageKey,
      JSON.stringify({
        cameraReady: Boolean(
          state.cameraControlSource?.ndi?.sourceName ||
          (state.source?.type === "ndi" && state.source?.ndi?.sourceName),
        ),
        presets: state.ptz.presets.map((preset) => ({
          id: preset.id,
          name: preset.name,
          group: preset.group,
          ndiPreset: preset.ndiPreset,
        })),
      }),
    );
  } catch {
    // Storage may be unavailable; online controls still work.
  }
}

function renderPtzControls(state) {
  const cameraReady =
    typeof state.cameraReady === "boolean"
      ? state.cameraReady
      : Boolean(
          state.cameraControlSource?.ndi?.sourceName ||
          (state.source?.type === "ndi" && state.source?.ndi?.sourceName),
        );
  const signature = JSON.stringify([
    state.ptz.presets,
    cameraReady,
    state.cameraControlSource || state.source,
  ]);
  if (signature === presetSignature) return;
  presetSignature = signature;
  latestRecall++;
  ptzControls.innerHTML = "";
  const groups = new Map();
  for (const preset of state.ptz.presets) {
    const group = preset.group || "Other";
    if (!groups.has(group)) {
      const section = document.createElement("section");
      const heading = document.createElement("h3");
      heading.textContent = group;
      const controls = document.createElement("div");
      controls.className = "controls";
      section.append(heading, controls);
      ptzControls.append(section);
      groups.set(group, controls);
    }
    const button = document.createElement("button");
    button.className = "button";
    button.textContent = preset.name;
    button.disabled = !cameraReady;
    button.title = cameraReady
      ? `Camera preset ${preset.ndiPreset}`
      : "Camera control source is not configured";
    button.addEventListener("click", () => recallPreset(button, preset.id));
    button.addEventListener("animationend", (event) => {
      if (event.target === button && event.animationName.startsWith("preset-recent"))
        button.classList.remove("preset-recent");
    });
    groups.get(group).append(button);
  }
}

async function recallPreset(button, presetId) {
  const request = ++latestRecall;
  for (const other of ptzControls.querySelectorAll("button")) {
    other.classList.remove("preset-pending", "preset-recent");
    other.removeAttribute("aria-busy");
  }
  button.classList.add("preset-pending");
  button.setAttribute("aria-busy", "true");
  try {
    await post(
      "/api/ptz/recall",
      { presetId, mode: smoothPresetRecall.checked ? "smooth" : "native" },
      "POST",
      false,
    );
    if (request !== latestRecall || !ptzControls.contains(button)) return;
    button.classList.remove("preset-pending");
    button.removeAttribute("aria-busy");
    // Restart the recent-request animation even when the same preset is tapped again.
    void button.offsetWidth;
    button.classList.add("preset-recent");
    refresh().catch(console.error);
  } catch {
    if (request !== latestRecall) return;
    button.classList.remove("preset-pending");
    button.removeAttribute("aria-busy");
  }
}

function markPreviewPlaying() {
  window.SteepleEarlyPlay?.playing();
}

function observePreviewVideo(video: HTMLVideoElement) {
  video.addEventListener("playing", markPreviewPlaying);
  if (!video.paused && video.readyState >= 2) markPreviewPlaying();
  return () => video.removeEventListener("playing", markPreviewPlaying);
}

function showPreviewTransport(info) {
  const transport = info?.transport || "unknown";
  let label = "Preview transport unknown";
  let detail = "";
  if (transport === "connecting") {
    label = "WebRTC · Connecting…";
  } else if (transport === "reconnecting") {
    label = "WebRTC · Reconnecting…";
  } else if (transport.startsWith("webrtc-")) {
    const type = info.candidateType;
    label =
      type === "relay"
        ? "WebRTC · Relay"
        : type === "host" || type === "srflx" || type === "prflx"
          ? "WebRTC · Direct"
          : "WebRTC · Connected";
    detail = type && type !== "unknown" ? `ICE candidate: ${type}` : "";
  } else if (transport === "hls") {
    label = info.connectingWebRtc ? "HLS · Checking WebRTC" : "HLS · Higher latency";
    detail = info.fallbackReason ? `WebRTC unavailable: ${info.fallbackReason}` : "";
  } else if (transport === "error") {
    label = "WebRTC · Connection failed";
    detail = info.reason || "Retrying the video connection.";
  } else if (transport === "unavailable") {
    label = "Preview unavailable";
    detail = info.reason || "";
  }
  previewTransport.textContent = label;
  previewTransportDetail.textContent = detail;
  previewTransportDetail.hidden = !detail;
}

function renderPreview(state) {
  if (window.SteeplePlayer.renderPreviewStatus(adminPreview, state.source)) {
    showPreviewTransport({
      transport: "unavailable",
      reason: "No camera video source configured.",
    });
    return;
  }
  const broadcast = state.broadcast;
  const playback = broadcast.playback || state.preview;
  const hlsUrl = playback?.hlsUrl;
  const webrtcUrl = playback?.webrtcUrl;
  const streamKey = previewStreamKey(latestHealth?.ingest);
  if (latestPreviewSignature !== streamKey)
    showPreviewTransport(
      webrtcUrl
        ? { transport: "connecting" }
        : hlsUrl
          ? { transport: "hls" }
          : { transport: "unavailable", reason: "No preview URL available." },
    );
  latestPreviewSignature = streamKey;
  if (hlsUrl && webrtcUrl) {
    window.SteeplePlayer.renderHybridLive(adminPreview, playback, {
      autoplay: true,
      controls: false,
      timeline: false,
      timeoutMs: 4000,
      streamKey,
      onTransport: showPreviewTransport,
      onVideo: observePreviewVideo,
      onAutoplayBlocked: () => window.SteepleEarlyPlay?.blocked(),
    });
    return;
  }
  if (webrtcUrl) {
    window.SteeplePlayer.renderWebRtc(adminPreview, webrtcUrl, {
      autoplay: true,
      controls: false,
      timeoutMs: 4000,
      streamKey,
      retry: true,
      onTransport: showPreviewTransport,
    }).catch(() => {
      window.SteeplePlayer.renderSlate(
        adminPreview,
        "Preview Waiting",
        "No playable stream is available yet.",
      );
    });
    return;
  }
  if (hlsUrl) {
    window.SteeplePlayer.renderHls(adminPreview, hlsUrl, {
      autoplay: true,
      controls: false,
      streamKey,
      onTransport: showPreviewTransport,
    });
    return;
  }
  showPreviewTransport({ transport: "unavailable", reason: "No playback URL configured." });
  window.SteeplePlayer.renderSlate(
    adminPreview,
    "Preview Unavailable",
    "No local preview URL is configured.",
  );
}

function previewStreamKey(ingest) {
  if (!ingest) return "ingest:unknown";
  return JSON.stringify({
    status: ingest.status || null,
    ready: Boolean(ingest.ready),
    startedAt: ingest.startedAt || null,
    sourceName: ingest.sourceName || null,
    error: ingest.lastError?.message || null,
  });
}

function format(value) {
  return value ? new Date(value).toLocaleString() : "not set";
}

/** Show last-known controls before making a network request. */
function restorePresets() {
  try {
    const snapshot = JSON.parse(localStorage.getItem(presetStorageKey) || "null");
    if (!snapshot || !Array.isArray(snapshot.presets)) return;
    renderPtzControls({
      ptz: { presets: snapshot.presets },
      cameraReady: snapshot.cameraReady === true,
    });
  } catch {
    // An absent or invalid snapshot should not interfere with startup.
  }
}

function loadHlsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Hls) return resolve();
    const script = document.createElement("script");
    script.src = "/vendor/hls.min.js";
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Could not load HLS preview")), {
      once: true,
    });
    document.head.append(script);
  });
}

function loadPreview(): Promise<void> {
  previewAssets ??= (async () => {
    await Promise.all([import("../../tools/player-ui/index.ts"), loadHlsScript()]);
    await import("./player.ts");
  })().catch((error) => {
    previewAssets = null;
    throw error;
  });
  return previewAssets;
}

function requestPreview() {
  previewRequested = true;
  void loadPreview()
    .then(() => {
      if (latestState) renderPreview(latestState);
    })
    .catch((error) => {
      previewTransport.textContent = "Preview failed to load. Tap Play to retry.";
      console.error(error);
    });
}
document.querySelector("#preview-play")!.addEventListener("click", requestPreview);
// early-play.js runs before the main bundle. Honor clicks made during a slow initial load.
if (window.SteepleEarlyPlay?.requested) requestPreview();

/** Reauthenticate only when reachable; don't redirect due to network timeouts. */
async function connect() {
  if (sessionPending || sessionReady) return;
  sessionPending = true;
  try {
    const response = await fetch("/api/session", {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (response.status === 401) {
      location.href = "/auth/login";
      return;
    }
    if (!response.ok) throw new Error(`Session request failed: ${response.status}`);
    const principal = await response.json();
    csrfToken = principal.csrfToken;
    sessionReady = true;
    document.documentElement.dataset.controlSessionReady = "true";
    void refresh().catch(console.error);

    const events = new EventSource("/api/events");
    events.addEventListener("state", (event) => renderState(JSON.parse(event.data)));
    events.addEventListener("health", (event) => {
      const healthState = JSON.parse(event.data);
      latestHealth = healthState;
      if (
        previewRequested &&
        window.SteeplePlayer &&
        latestState &&
        previewStreamKey(healthState.ingest) !== latestPreviewSignature
      ) {
        renderPreview(latestState);
      }
    });
  } catch (error) {
    statusLabel.textContent = "Disconnected · retrying";
    console.warn("Camera control not yet reachable", error);
  } finally {
    sessionPending = false;
  }
}

const offlineStatus = document.querySelector<HTMLElement>("#offline-status")!;

/**
 * The browser may display the broadcaster before the service worker has
 * finished installing. Check the actual precached resources, not just
 * registration, before telling an operator that offline startup is ready.
 */
async function verifyOfflineCache(): Promise<boolean> {
  if (!navigator.serviceWorker.controller) return false;
  const required = ["/operator-shell", "/build/broadcaster.js", "/build/app.css"];
  const keys = await caches.keys();
  for (const key of keys.filter((key) => key.startsWith("workbox-precache-"))) {
    const cache = await caches.open(key);
    const paths = new Set((await cache.keys()).map((request) => new URL(request.url).pathname));
    if (required.every((resource) => paths.has(resource))) return true;
  }
  return false;
}

async function registerOfflineShell() {
  if (!("serviceWorker" in navigator) || !("caches" in window)) {
    offlineStatus.textContent = "Offline cache unavailable";
    return;
  }
  const checkOfflineReady = async () => {
    try {
      offlineStatus.textContent = (await verifyOfflineCache())
        ? "Offline controls ready"
        : "Preparing offline controls…";
    } catch (error) {
      console.warn("Offline cache status check failed", error);
      offlineStatus.textContent = "Offline cache unavailable";
    }
  };
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    void checkOfflineReady();
  });
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const notice = document.querySelector<HTMLElement>("#update-notice")!;
    const refreshButton = document.querySelector<HTMLButtonElement>("#refresh-update")!;
    const showWaitingUpdate = () => {
      notice.hidden = !(registration.waiting && navigator.serviceWorker.controller);
    };
    const watchInstaller = () => {
      const installing = registration.installing;
      installing?.addEventListener("statechange", () => {
        showWaitingUpdate();
        if (installing.state === "redundant") {
          offlineStatus.textContent = "Offline cache unavailable";
        }
        void checkOfflineReady();
      });
      showWaitingUpdate();
    };
    registration.addEventListener("updatefound", watchInstaller);
    watchInstaller();
    void checkOfflineReady();

    refreshButton.addEventListener("click", () => {
      refreshButton.disabled = true;
      const waiting = registration.waiting;
      if (!waiting) {
        location.reload();
        return;
      }
      navigator.serviceWorker.addEventListener("controllerchange", () => location.reload(), {
        once: true,
      });
      waiting.postMessage({ type: "SKIP_WAITING" }, []);
    });

    // Update checks must never delay app startup or interrupt the operator.
    void registration.update().catch(console.warn);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) void registration.update().catch(console.warn);
    });
  } catch (error) {
    console.warn("Offline shell could not be installed", error);
  }
}

restorePresets();
installManualCamera(() => csrfToken);
void registerOfflineShell();
void connect();
window.addEventListener("online", () => void connect());
setInterval(() => {
  if (!sessionReady) void connect();
}, 8000);
setInterval(() => {
  if (sessionReady) void refresh().catch(console.error);
}, 30000);
