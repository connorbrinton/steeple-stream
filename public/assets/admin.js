const statusDot = document.querySelector("#status-dot");
const statusLabel = document.querySelector("#status-label");
const health = document.querySelector("#health");
const sourceForm = document.querySelector("#source-form");
const sourceType = document.querySelector("#source-type");
const sourceHelp = document.querySelector("#source-help");
const adminPreview = document.querySelector("#admin-preview");
const sourceCurrent = document.querySelector("#source-current");
const sourceList = document.querySelector("#source-list");
const sourceDiscoveryStatus = document.querySelector("#source-discovery-status");
const sourceModal = document.querySelector("#manual-source-modal");
const openManualSource = document.querySelector("#open-manual-source");
const obsForm = document.querySelector("#obs-credential-form");

let latestHealth = null;
let latestState = null;
let latestPreviewSignature = "";
let obsCredentialsLoaded = false;
let sourceCatalog = null;
let selectingSourceId = null;
let selectingCameraControlSourceId = null;
let csrfToken = "development";

openManualSource.addEventListener("click", () => openManualSourceModal());
document.querySelector("#cancel-manual-source").addEventListener("click", () => closeManualSourceModal());
document.querySelector("#cancel-manual-source-x").addEventListener("click", () => closeManualSourceModal());
sourceModal.addEventListener("click", (event) => {
  if (event.target === sourceModal) closeManualSourceModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !sourceModal.hidden) closeManualSourceModal();
});
sourceType.addEventListener("change", () => updateSourceFieldVisibility(sourceType.value));
sourceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const state = await post("/api/sources/manual", readSourceForm());
  closeManualSourceModal({ reset: true });
  renderState(state);
  await loadSources();
});
obsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const result = await post("/api/obs-credentials", {
    unitName: document.querySelector("#obs-unit-name").value,
    port: Number(document.querySelector("#obs-port").value)
  });
  document.querySelector("#obs-new-password").textContent = `Password for ${result.unitName}: ${result.password}. This password is shown once.`;
  await loadObsCredentials();
});

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
  renderHealth(healthState);
}

function renderState(state) {
  latestState = state;
  const broadcast = state.broadcast;
  const capabilities = state.capabilities || {};
  document.querySelector("#obs-credentials-panel").hidden = window.steepleRole !== "administrator" || !capabilities.obsControl;
  if (window.steepleRole === "administrator" && capabilities.obsControl && !obsCredentialsLoaded) {
    obsCredentialsLoaded = true;
    loadObsCredentials().catch(console.error);
  }
  statusDot.className = `dot ${broadcast.status === "live" ? broadcast.mode : ""}`;
  statusLabel.textContent = capabilities.broadcastControls
    ? broadcast.status === "live" ? `${broadcast.mode} live` : broadcast.status
    : "camera control";
  renderPreview(state);
  renderSource(state.source);
}

function renderSource(source) {
  if (!source) return;
  updateSourceFieldVisibility(sourceType.value);
  renderSourceCatalog();
}

function readSourceForm() {
  return {
    type: sourceType.value,
    ndi: {
      sourceName: document.querySelector("#add-ndi-source-name").value,
      urlAddress: document.querySelector("#add-ndi-url-address").value,
      discoveryServer: ""
    },
    network: {
      protocol: document.querySelector("#network-protocol").value,
      uri: document.querySelector("#network-uri").value
    },
    notes: document.querySelector("#source-notes").value
  };
}

function updateSourceFieldVisibility(type) {
  for (const section of document.querySelectorAll("[data-source-fields]")) {
    section.classList.toggle("active", section.dataset.sourceFields === type);
  }
  sourceHelp.textContent = helpForSource(type);
}

function helpForSource(type) {
  if (type === "ndi") {
    return "NDI uses audio and video together. Discovery depends on local NDI/mDNS visibility from this computer.";
  }
  if (type === "network") {
    return "Network encoders can provide RTSP or SRT audio and video directly to the local media pipeline.";
  }
  return "";
}

async function loadSources({ silent = false } = {}) {
  if (!silent) {
    sourceDiscoveryStatus.textContent = "Refreshing...";
  }
  try {
    sourceCatalog = await fetch("/api/sources").then((result) => result.json());
  } catch (error) {
    if (!silent) sourceDiscoveryStatus.textContent = `Refresh failed: ${error.message}`;
    return;
  }
  renderSourceCatalog();
}

async function loadObsCredentials() {
  const response = await fetch("/api/obs-credentials");
  if (response.status === 404) return;
  const payload = await response.json();
  const list = document.querySelector("#obs-credentials");
  list.replaceChildren();
  for (const credential of payload.credentials || []) {
    const item = document.createElement("div");
    item.className = "list-item";
    item.textContent = `${credential.unitName}: port ${credential.port}`;
    list.append(item);
  }
}

function renderSourceCatalog() {
  const catalog = sourceCatalog;
  const sources = catalog?.sources || [];
  const active = sources.find((source) => source.selected) || null;
  const camera = sources.find((source) => source.cameraControl) || null;
  renderCurrentSource(active);
  renderCameraControlSource(camera);
  renderSourceRows(sources);
  renderSourceDiscoveryStatus(catalog?.discovery);
}

function renderCameraControlSource(source) {
  const detail = document.createElement("div");
  detail.className = "source-detail";
  detail.textContent = source
    ? `Camera control: ${source.name}${source.available ? "" : " (saved, not discovered)"}`
    : "Camera control: not configured";
  sourceCurrent.append(detail);
}

function renderCurrentSource(source) {
  sourceCurrent.replaceChildren();
  if (!source) {
    sourceCurrent.className = "source-current warn";
    sourceCurrent.textContent = "No input source is selected.";
    return;
  }
  sourceCurrent.className = `source-current ${sourceHealthLevel(source)}`;
  const title = document.createElement("div");
  title.className = "source-current-title";
  title.append(sourceBadge(source.type), textNode(source.name));
  const detail = document.createElement("div");
  detail.className = "source-detail";
  detail.textContent = [source.health?.message, source.detail].filter(Boolean).join(" · ");
  sourceCurrent.append(title, detail);
}

function renderSourceRows(sources) {
  sourceList.replaceChildren();
  if (!sources.length) {
    const empty = document.createElement("div");
    empty.className = "source-empty";
    empty.textContent = "No discovered or manual sources are available yet.";
    sourceList.append(empty);
    return;
  }
  for (const source of sources) {
    const row = document.createElement("div");
    row.className = `source-row ${source.selected ? "selected" : ""} ${source.cameraControl ? "camera-control" : ""} ${sourceHealthLevel(source)}`;

    const main = document.createElement("div");
    main.className = "source-row-main";
    const title = document.createElement("div");
    title.className = "source-row-title";
    title.append(sourceBadge(source.type), textNode(source.name));
    const detail = document.createElement("div");
    detail.className = "source-detail";
    detail.textContent = source.detail || source.origin;
    main.append(title, detail);

    const status = document.createElement("div");
    status.className = "source-row-status";
    status.append(sourceStatusPill(source));
    const roles = sourceRolePills(source);
    if (roles) status.append(roles);
    const actions = sourceActions(source);
    if (actions) status.append(actions);

    row.append(main, status);
    sourceList.append(row);
  }
}

function sourceActions(source) {
  const actions = document.createElement("div");
  actions.className = "source-actions-inline";
  if (!source.selected) actions.append(streamActionButton(source));
  if (source.type === "ndi" && !source.cameraControl) actions.append(cameraControlActionButton(source));
  return actions.childElementCount ? actions : null;
}

function streamActionButton(source) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "source-action-label";
  button.disabled = source.id === selectingSourceId;
  button.textContent = source.id === selectingSourceId ? "Selecting..." : "Use for Stream";
  button.addEventListener("click", () => selectSource(source));
  return button;
}

function cameraControlActionButton(source) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "source-action-label secondary";
  button.disabled = source.id === selectingCameraControlSourceId;
  button.textContent = source.id === selectingCameraControlSourceId ? "Saving..." : "Use for Camera";
  button.addEventListener("click", () => selectCameraControlSource(source));
  return button;
}

function sourceRolePills(source) {
  const roles = document.createElement("div");
  roles.className = "source-role-list";
  if (source.selected) roles.append(sourceRolePill("Stream"));
  if (source.cameraControl) roles.append(sourceRolePill("Camera"));
  return roles.childElementCount ? roles : null;
}

function sourceRolePill(label) {
  const pill = document.createElement("span");
  pill.className = "source-role-pill";
  pill.textContent = label;
  return pill;
}

async function selectSource(source) {
  selectingSourceId = source.id;
  renderSourceCatalog();
  try {
    const state = await post("/api/source", source.source, "PUT");
    renderState(state);
    await loadSources({ silent: true });
  } finally {
    selectingSourceId = null;
    renderSourceCatalog();
  }
}

async function selectCameraControlSource(source) {
  selectingCameraControlSourceId = source.id;
  renderSourceCatalog();
  try {
    const state = await post("/api/camera-control-source", source.source, "PUT");
    renderState(state);
    await loadSources({ silent: true });
  } finally {
    selectingCameraControlSourceId = null;
    renderSourceCatalog();
  }
}

function renderSourceDiscoveryStatus(discovery) {
  const ndi = discovery?.ndi;
  if (!ndi) {
    sourceDiscoveryStatus.textContent = "";
    return;
  }
  if (ndi.lastError) {
    sourceDiscoveryStatus.textContent = `Last refresh failed: ${ndi.lastError.message}`;
    return;
  }
  const completed = ndi.lastCompletedAt ? new Date(ndi.lastCompletedAt).toLocaleTimeString() : "not yet";
  sourceDiscoveryStatus.textContent = ndi.refreshing
    ? `Refreshing, ${ndi.sourceCount} found`
    : `Last refreshed ${completed}, ${ndi.sourceCount} found`;
}

function sourceBadge(type) {
  const badge = document.createElement("span");
  badge.className = "source-badge";
  badge.textContent = type === "ndi" ? "NDI" : type.toUpperCase();
  return badge;
}

function sourceStatusPill(source) {
  const pill = document.createElement("span");
  pill.className = `source-pill ${sourceHealthLevel(source)}`;
  if (source.id === selectingSourceId) pill.textContent = "Selecting";
  else if (source.id === selectingCameraControlSourceId) pill.textContent = "Saving";
  else if (source.selected && source.health?.status === "healthy") pill.textContent = "Receiving";
  else if (source.selected) pill.textContent = source.health?.error ? "Error" : "Connecting";
  else if (source.available) pill.textContent = "Available";
  else if (source.configured) pill.textContent = "Manual";
  else pill.textContent = "Unavailable";
  return pill;
}

function sourceHealthLevel(source) {
  if (source.selected && source.health?.status === "healthy") return "ok";
  if (source.selected) return source.health?.error ? "bad" : "warn";
  if (source.available) return "ok";
  return "warn";
}

function openManualSourceModal() {
  sourceModal.hidden = false;
  updateSourceFieldVisibility(sourceType.value);
  setTimeout(() => sourceType.focus(), 0);
}

function closeManualSourceModal({ reset = false } = {}) {
  sourceModal.hidden = true;
  if (reset) sourceForm.reset();
  updateSourceFieldVisibility(sourceType.value);
}

function textNode(value) {
  return document.createTextNode(value || "");
}

function renderPreview(state) {
  if (window.SteeplePlayer.renderPreviewStatus(adminPreview, state.source, "admin")) return;
  const broadcast = state.broadcast;
  const playback = broadcast.playback || state.preview;
  const hlsUrl = playback?.hlsUrl;
  const webrtcUrl = playback?.webrtcUrl;
  const streamKey = previewStreamKey(latestHealth?.ingest);
  latestPreviewSignature = streamKey;
  if (hlsUrl && webrtcUrl) {
    window.SteeplePlayer.renderHybridLive(adminPreview, playback, {
      autoplay: true,
      controls: false,
      timeline: false,
      timeoutMs: 4000,
      streamKey
    });
    return;
  }
  if (webrtcUrl) {
    window.SteeplePlayer.renderWebRtc(adminPreview, webrtcUrl, {
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
  if (hlsUrl) {
    window.SteeplePlayer.renderHls(adminPreview, hlsUrl, {
      autoplay: true,
      controls: false,
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

function renderHealth(payload) {
  const backend = payload.backend;
  const ingest = payload.ingest;
  health.replaceChildren();
  health.className = "health-grid";

  health.append(
    healthItem("MediaMTX", backend.ok && backend.ready ? "ok" : "warn", backend.ok ? `Ready, ${backend.readers} readers` : backend.message),
    healthItem("Engine", statusLevel(ingest?.status), ingest ? `${ingest.status}: ${ingest.message}` : "No ingest status"),
    healthItem("Scene", ingest?.scene?.transitioning ? "warn" : "ok", sceneSummary(ingest)),
    healthItem("Input video", inputLevel(ingest?.inputs?.video), inputSummary(ingest?.inputs?.video)),
    healthItem("Input audio", inputLevel(ingest?.inputs?.audio), inputSummary(ingest?.inputs?.audio)),
    healthItem("RTMP", outputLevel(ingest?.outputs?.rtmp), outputSummary(ingest?.outputs?.rtmp)),
    healthItem("RTSP/WebRTC", outputLevel(ingest?.outputs?.rtsp), outputSummary(ingest?.outputs?.rtsp))
  );

  if (ingest?.lastError) {
    health.append(healthItem("Last error", "bad", `${ingest.lastError.category}: ${ingest.lastError.message}`));
  }
}

function healthItem(label, level, value) {
  const item = document.createElement("div");
  item.className = "health-item";
  const dot = document.createElement("span");
  dot.className = `health-dot ${level}`;
  const name = document.createElement("span");
  name.className = "health-name";
  name.textContent = label;
  const detail = document.createElement("span");
  detail.className = "health-detail";
  detail.textContent = value || "Unknown";
  item.append(dot, name, detail);
  return item;
}

function statusLevel(status) {
  if (status === "running") return "ok";
  if (["starting", "waiting", "disabled", "stopped"].includes(status)) return "warn";
  return "bad";
}

function inputLevel(input) {
  if (!input?.expected) return "warn";
  return input.ready ? "ok" : "bad";
}

function outputLevel(output) {
  if (!output?.expected) return "warn";
  return output.ready ? "ok" : "bad";
}

function inputSummary(input) {
  if (!input?.expected) return "Not expected";
  return input.ready ? "Ready" : "Waiting";
}

function outputSummary(output) {
  if (!output?.expected) return "Not configured";
  return output.ready ? "Publishing" : "Waiting";
}

function sceneSummary(ingest) {
  const scene = ingest?.scene;
  if (!scene) return "Unknown";
  const observed = scene.observed ? `observed ${scene.observed}` : "not observed";
  return scene.transitioning ? `Transitioning to ${scene.requested}` : `${scene.requested || "none"}, ${observed}`;
}

async function initialize() {
  const response = await fetch("/api/session");
  if (!response.ok) {
    location.href = "/auth/login";
    return;
  }
  const principal = await response.json();
  window.steepleRole = principal.role;
  csrfToken = principal.csrfToken;
  if (principal.role !== "administrator") {
    location.href = `/broadcasts/${location.pathname.split("/")[2] || "stakecenter"}/broadcaster`;
    return;
  }
  await loadSources();
  await refresh();
  const events = new EventSource("/api/events");
  events.addEventListener("state", (event) => renderState(JSON.parse(event.data)));
  events.addEventListener("health", (event) => {
    latestHealth = JSON.parse(event.data);
    renderHealth(latestHealth);
    if (latestState && previewStreamKey(latestHealth.ingest) !== latestPreviewSignature) {
      renderPreview(latestState);
    }
    renderSourceCatalog();
  });
  if (principal.role === "administrator") {
    setInterval(() => loadSources({ silent: true }).catch(console.error), 7000);
  }
}

initialize().catch(console.error);
setInterval(() => refresh().catch(console.error), 30000);
