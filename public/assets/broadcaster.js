const statusDot = document.querySelector("#status-dot");
const statusLabel = document.querySelector("#status-label");
const details = document.querySelector("#broadcast-details");
const broadcastControlsGroup = document.querySelector("#broadcast-controls-group");
const ptzControls = document.querySelector("#ptz-controls");
const adminPreview = document.querySelector("#admin-preview");

let latestHealth = null;
let latestState = null;
let latestPreviewSignature = "";
let csrfToken = "development";

document.querySelector("#start").addEventListener("click", () => post("/api/broadcast/start"));
document.querySelector("#chapel").addEventListener("click", () => post("/api/broadcast/mode", { mode: "chapel" }));
document.querySelector("#sacrament").addEventListener("click", () => post("/api/broadcast/mode", { mode: "sacrament" }));
document.querySelector("#end").addEventListener("click", () => post("/api/broadcast/end"));

async function post(url, body = {}, method = "POST") {
  const response = await fetch(url, {
    method,
    headers: { "content-type": "application/json", "x-steeple-csrf": csrfToken },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: response.statusText }));
    alert(payload.error);
    throw new Error(payload.error);
  }
  const payload = await response.json().catch(() => null);
  if (method === "POST") await refresh();
  return payload;
}

async function refresh() {
  const [state, healthState] = await Promise.all([
    fetch("/api/state").then((response) => response.json()),
    fetch("/api/health").then((response) => response.json())
  ]);
  latestHealth = healthState;
  renderState(state);
}

function renderState(state) {
  latestState = state;
  const broadcast = state.broadcast;
  const capabilities = state.capabilities || {};
  broadcastControlsGroup.hidden = !capabilities.broadcastControls;
  document.querySelector("#chapel").hidden = !capabilities.sceneControls;
  document.querySelector("#sacrament").hidden = !capabilities.sceneControls;
  statusDot.className = `dot ${broadcast.status === "live" ? broadcast.mode : ""}`;
  statusLabel.textContent = capabilities.broadcastControls
    ? broadcast.status === "live" ? `${broadcast.mode} live` : broadcast.status
    : "camera control";
  details.textContent = `Status: ${broadcast.status}. Mode: ${broadcast.mode}. Started: ${format(broadcast.startedAt)}. Expires: ${format(broadcast.expiresAt)}.`;
  document.querySelector("#chapel").classList.toggle("active", broadcast.mode === "chapel");
  document.querySelector("#sacrament").classList.toggle("active", broadcast.mode === "sacrament");
  renderPreview(state);
  renderPtzControls(state);
}

function renderPtzControls(state) {
  ptzControls.innerHTML = "";
  const cameraReady = Boolean(state.cameraControlSource?.ndi?.sourceName || state.source?.type === "ndi" && state.source?.ndi?.sourceName);
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
    button.title = cameraReady ? `Camera preset ${preset.ndiPreset}` : "Camera control source is not configured";
    button.addEventListener("click", () => post("/api/ptz/recall", { presetId: preset.id }));
    groups.get(group).append(button);
  }
}

function renderPreview(state) {
  if (window.SteeplePlayer.renderPreviewStatus(adminPreview, state.source)) return;
  const broadcast = state.broadcast;
  const capabilities = state.capabilities || {};
  const playback = broadcast.playback || state.preview;
  const hlsUrl = playback?.hlsUrl;
  const webrtcUrl = playback?.webrtcUrl;
  const streamKey = previewStreamKey(latestHealth?.ingest);
  latestPreviewSignature = streamKey;
  if (webrtcUrl && (!capabilities.hlsScrub || broadcast.status !== "live")) {
    window.SteeplePlayer.renderWebRtc(adminPreview, webrtcUrl, {
      muted: true,
      autoplay: true,
      controls: false,
      timeoutMs: 4000,
      streamKey,
      retry: true
    }).catch(() => {
      window.SteeplePlayer.renderSlate(adminPreview, "Preview Waiting", "No playable stream is available yet.");
    });
    return;
  }
  if (hlsUrl && webrtcUrl) {
    window.SteeplePlayer.renderHybridLive(adminPreview, playback, {
      muted: true,
      autoplay: true,
      timeoutMs: 4000,
      timelineStartAt: broadcast.startedAt || latestHealth?.ingest?.startedAt,
      streamKey
    });
    return;
  }
  if (hlsUrl) {
    window.SteeplePlayer.renderHls(adminPreview, hlsUrl, {
      muted: true,
      autoplay: true,
      controls: capabilities.hlsScrub && broadcast.status === "live" ? "live" : false,
      timelineStartAt: broadcast.startedAt || latestHealth?.ingest?.startedAt,
      streamKey
    });
    return;
  }
  window.SteeplePlayer.renderSlate(adminPreview, "Preview Unavailable", "No local preview URL is configured.");
}

function previewStreamKey(ingest) {
  if (!ingest) return "ingest:unknown";
  return JSON.stringify({
    status: ingest.status || null,
    ready: Boolean(ingest.ready),
    startedAt: ingest.startedAt || null,
    sourceName: ingest.sourceName || null,
    error: ingest.lastError?.message || null
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
  await refresh();
  const events = new EventSource("/api/events");
  events.addEventListener("state", (event) => renderState(JSON.parse(event.data)));
  events.addEventListener("health", (event) => {
    latestHealth = JSON.parse(event.data);
    if (latestState && previewStreamKey(latestHealth.ingest) !== latestPreviewSignature) {
      renderPreview(latestState);
    }
  });
}

initialize().catch(console.error);
setInterval(() => refresh().catch(console.error), 30000);
