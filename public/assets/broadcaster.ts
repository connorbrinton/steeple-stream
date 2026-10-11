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
let csrfToken = "development";
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
  const response = await fetch(url, {
    method,
    headers: { "content-type": "application/json", "x-steeple-csrf": csrfToken },
    body: JSON.stringify(body),
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
  const [state, healthState] = await Promise.all([
    fetch("/api/state").then((response) => response.json()),
    fetch("/api/health").then((response) => response.json()),
  ]);
  latestHealth = healthState;
  renderState(state);
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
  renderPreview(state);
  renderPtzControls(state);
}

function renderPtzControls(state) {
  const cameraReady = Boolean(
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

async function initialize() {
  const response = await fetch("/api/session");
  if (!response.ok) {
    location.href = "/auth/login";
    return;
  }
  const principal = await response.json();
  csrfToken = principal.csrfToken;
  installManualCamera(() => csrfToken);
  await refresh();
  const events = new EventSource("/api/events");
  events.addEventListener("state", (event) => renderState(JSON.parse(event.data)));
  events.addEventListener("health", (event) => {
    const healthState = JSON.parse(event.data);
    latestHealth = healthState;
    if (latestState && previewStreamKey(healthState.ingest) !== latestPreviewSignature) {
      renderPreview(latestState);
    }
  });
}

initialize().catch(console.error);
setInterval(() => refresh().catch(console.error), 30000);
