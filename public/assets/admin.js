const statusDot = document.querySelector("#status-dot");
const statusLabel = document.querySelector("#status-label");
const details = document.querySelector("#broadcast-details");
const auditLog = document.querySelector("#audit-log");
const health = document.querySelector("#health");
const ptzControls = document.querySelector("#ptz-controls");
const sourceForm = document.querySelector("#source-form");
const sourceType = document.querySelector("#source-type");
const sourceHelp = document.querySelector("#source-help");
const adminPreview = document.querySelector("#admin-preview");
const ndiSourceName = document.querySelector("#ndi-source-name");
const obsForm = document.querySelector("#obs-credential-form");

let sourceDirty = false;
let renderedSourceSignature = "";
let latestHealth = null;
let csrfToken = "development";

document.querySelector("#start").addEventListener("click", () => post("/api/broadcast/start"));
document.querySelector("#chapel").addEventListener("click", () => post("/api/broadcast/mode", { mode: "chapel" }));
document.querySelector("#sacrament").addEventListener("click", () => post("/api/broadcast/mode", { mode: "sacrament" }));
document.querySelector("#end").addEventListener("click", () => post("/api/broadcast/end"));
document.querySelector("#refresh-ndi-sources").addEventListener("click", () => loadNdiSources(readSourceForm().ndi.sourceName));
sourceForm.addEventListener("input", () => {
  sourceDirty = true;
});
sourceForm.addEventListener("change", () => {
  sourceDirty = true;
});
sourceType.addEventListener("change", () => updateSourceFieldVisibility(sourceType.value));
sourceForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const state = await post("/api/source", readSourceForm(), "PUT");
  sourceDirty = false;
  renderState(state);
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
  const broadcast = state.broadcast;
  statusDot.className = `dot ${broadcast.status === "live" ? broadcast.mode : ""}`;
  statusLabel.textContent = broadcast.status === "live" ? `${broadcast.mode} live` : broadcast.status;
  details.textContent = `Status: ${broadcast.status}. Mode: ${broadcast.mode}. Started: ${format(broadcast.startedAt)}. Expires: ${format(broadcast.expiresAt)}.`;
  document.querySelector("#chapel").classList.toggle("active", broadcast.mode === "chapel");
  document.querySelector("#sacrament").classList.toggle("active", broadcast.mode === "sacrament");
  renderPreview(state);
  renderSource(state.source);

  ptzControls.innerHTML = "";
  for (const preset of state.ptz.presets) {
    const button = document.createElement("button");
    button.className = "button";
    button.classList.toggle("active", state.ptz.lastRecalledPresetId === preset.id);
    button.textContent = preset.name;
    button.addEventListener("click", () => post("/api/ptz/recall", { presetId: preset.id }));
    ptzControls.append(button);
    if (window.steepleRole === "administrator") {
      const capture = document.createElement("button");
      capture.className = "button";
      capture.textContent = `Set ${preset.name}`;
      capture.addEventListener("click", () => post("/api/ptz/capture", { presetId: preset.id }));
      ptzControls.append(capture);
    }
  }

  auditLog.innerHTML = "";
  for (const entry of state.auditLog.slice().reverse().slice(0, 12)) {
    const item = document.createElement("div");
    item.className = "list-item";
    item.textContent = `${new Date(entry.createdAt).toLocaleTimeString()} ${entry.event}`;
    auditLog.append(item);
  }
}

function renderSource(source) {
  if (!source) return;
  const signature = JSON.stringify(source);
  if (sourceDirty && signature !== renderedSourceSignature) return;
  renderedSourceSignature = signature;
  sourceType.value = source.type;
  setNdiSelection(source.ndi?.sourceName || "", source.ndi?.urlAddress || "");
  document.querySelector("#ndi-discovery-server").value = source.ndi?.discoveryServer || "";
  document.querySelector("#network-protocol").value = source.network?.protocol || "rtsp";
  document.querySelector("#network-uri").value = source.network?.uri || "";
  document.querySelector("#source-notes").value = source.notes || "";
  updateSourceFieldVisibility(source.type);
}

function readSourceForm() {
  return {
    type: sourceType.value,
    ndi: {
      sourceName: ndiSourceName.value,
      urlAddress: ndiSourceName.selectedOptions[0]?.dataset.urlAddress || "",
      discoveryServer: document.querySelector("#ndi-discovery-server").value
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

async function loadNdiSources(selectedName = "") {
  const response = await fetch("/api/sources/ndi").then((result) => result.json());
  const sources = response.sources || [];
  ndiSourceName.innerHTML = "";
  if (!sources.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No NDI sources found";
    ndiSourceName.append(option);
    return;
  }
  for (const source of sources) {
    const option = document.createElement("option");
    option.value = source.name;
    option.dataset.urlAddress = source.urlAddress || "";
    option.textContent = source.available === false ? `${source.name} (saved)` : source.name;
    ndiSourceName.append(option);
  }
  setNdiSelection(selectedName || sources[0].name);
}

async function loadObsCredentials() {
  const payload = await fetch("/api/obs-credentials").then((response) => response.json());
  const list = document.querySelector("#obs-credentials");
  list.replaceChildren();
  for (const credential of payload.credentials || []) {
    const item = document.createElement("div");
    item.className = "list-item";
    item.textContent = `${credential.unitName}: port ${credential.port}`;
    list.append(item);
  }
}

function setNdiSelection(name, urlAddress = "") {
  if (name && ![...ndiSourceName.options].some((option) => option.value === name)) {
    const option = document.createElement("option");
    option.value = name;
    option.dataset.urlAddress = urlAddress;
    option.textContent = `${name} (saved)`;
    ndiSourceName.append(option);
  }
  ndiSourceName.value = name;
  if (urlAddress && ndiSourceName.selectedOptions[0]) {
    ndiSourceName.selectedOptions[0].dataset.urlAddress = urlAddress;
  }
}

function renderPreview(state) {
  const broadcast = state.broadcast;
  const playback = broadcast.playback || state.preview;
  const hlsUrl = playback?.hlsUrl;
  const webrtcUrl = playback?.webrtcUrl;
  if (hlsUrl && webrtcUrl) {
    window.SteeplePlayer.renderHybridLive(adminPreview, playback, {
      muted: true,
      autoplay: true,
      timeoutMs: 4000,
      timelineStartAt: broadcast.startedAt || latestHealth?.ingest?.startedAt
    });
    return;
  }
  if (hlsUrl) {
    window.SteeplePlayer.renderHls(adminPreview, hlsUrl, {
      muted: true,
      autoplay: true,
      controls: "live",
      timelineStartAt: broadcast.startedAt || latestHealth?.ingest?.startedAt
    });
    return;
  }
  window.SteeplePlayer.renderSlate(adminPreview, "Preview Unavailable", "No local preview URL is configured.");
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

function format(value) {
  return value ? new Date(value).toLocaleString() : "not set";
}

async function initialize() {
  const response = await fetch("/api/session");
  if (!response.ok) {
    location.href = "/auth/google";
    return;
  }
  const principal = await response.json();
  window.steepleRole = principal.role;
  csrfToken = principal.csrfToken;
  if (principal.role === "administrator") {
    await loadNdiSources();
    await loadObsCredentials();
  } else {
    document.querySelector("#source-panel").hidden = true;
    document.querySelector("#obs-credentials-panel").hidden = true;
  }
  await refresh();
  const events = new EventSource("/api/events");
  events.addEventListener("state", (event) => renderState(JSON.parse(event.data)));
  events.addEventListener("health", (event) => {
    latestHealth = JSON.parse(event.data);
    renderHealth(latestHealth);
  });
}

initialize().catch(console.error);
setInterval(() => refresh().catch(console.error), 30000);
