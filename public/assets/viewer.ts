const sessionKey = "steeple.viewerSessionId";
const nameKey = "steeple.viewerName";
const sessionId = localStorage.getItem(sessionKey) || crypto.randomUUID();
localStorage.setItem(sessionKey, sessionId);

const statusDot = document.querySelector("#status-dot")!;
const statusLabel = document.querySelector("#status-label")!;
const details = document.querySelector("#details")!;
const frame = document.querySelector("#video-frame")!;
const namePanel = document.querySelector("#name-panel")!;
const nameForm = document.querySelector("#name-form")!;
const nameInput = document.querySelector("#viewer-name")!;

const storedName = localStorage.getItem(nameKey);
let viewerName = storedName || "";
interface PlaybackReport {
  id: string;
  viewerId: string;
  viewerName: string;
  broadcastId: string | null;
  startedAt: string;
  transport: string | null;
  watchSeconds: number;
  bufferingMs: number;
  bufferingCount: number;
  reconnectCount: number;
  [key: string]: unknown;
}

let playback: PlaybackReport | null = null;
if (storedName) {
  namePanel.style.display = "none";
  registerViewer(storedName).catch(console.error);
}

nameForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;
  await registerViewer(name);
  localStorage.setItem(nameKey, name);
  namePanel.style.display = "none";
});

async function registerViewer(name) {
  await fetch("/api/viewers", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, sessionId })
  });
  viewerName = name;
  await refresh();
}

async function refresh() {
  try {
    const response = await fetch("/api/public-state");
    if (!response.ok) throw new Error(`Broadcast status returned ${response.status}`);
    render(await response.json());
  } catch (error) {
    statusLabel.textContent = "Connection interrupted";
    details.textContent = "Reconnecting to the broadcast service.";
    if (!frame.querySelector("video")) {
      window.SteeplePlayer.renderSlate(frame, "Unable to connect", "The broadcast service is temporarily unavailable. Retrying automatically.");
    }
    console.error(error);
  }
}

function render(state) {
  const broadcast = state.broadcast;
  statusDot.className = `dot ${broadcast.status === "live" ? broadcast.mode : ""}`;
  statusLabel.textContent = labelFor(broadcast);
  details.textContent = detailsFor(broadcast, state.viewerCount);

  if (!viewerName) {
    window.SteeplePlayer.renderSlate(frame, "Name Required", "Enter your name to watch the broadcast.");
    return;
  }

  if (broadcast.status === "replay" && broadcast.playback?.recordingUrl) {
    startPlaybackSession(broadcast);
    updatePlayback({ transport: "recording" });
    window.SteeplePlayer.renderRecording(frame, broadcast.playback.recordingUrl, { autoplay: true, onVideo: observeVideo });
    return;
  }

  if (broadcast.status === "live" && broadcast.playback?.hlsUrl) {
    startPlaybackSession(broadcast);
    if (frame.dataset.broadcastId !== broadcast.id || !frame.querySelector("video")) {
      frame.dataset.broadcastId = broadcast.id;
      const started = performance.now();
      window.SteeplePlayer.renderHybridLive(frame, broadcast.playback, {
        autoplay: true,
        timelineStartAt: broadcast.startedAt,
        streamKey: broadcast.id,
        timeoutMs: 8000,
        onVideo: observeVideo,
        onTransport: ({ transport, candidateType, fallbackReason }) => updatePlayback({ transport, candidateType, fallbackReason, startupMs: Math.round(performance.now() - started) })
      });
    }
    return;
  }

  window.SteeplePlayer.renderSlate(frame, "Broadcast Offline", "The meeting broadcast is not currently active.");
}

function startPlaybackSession(broadcast) {
  if (playback?.broadcastId === broadcast.id) return;
  playback = {
    id: crypto.randomUUID(), viewerId: sessionId, viewerName,
    broadcastId: broadcast.id, startedAt: new Date().toISOString(),
    transport: null, watchSeconds: 0, bufferingMs: 0,
    bufferingCount: 0, reconnectCount: 0
  };
  reportPlayback();
}

function updatePlayback(patch) {
  if (!playback) return;
  Object.assign(playback, patch);
  reportPlayback();
}

function reportPlayback(beacon = false) {
  if (!playback) return;
  playback.watchSeconds = Math.max(0, (Date.now() - new Date(playback.startedAt).getTime()) / 1000);
  const body = JSON.stringify(playback);
  if (beacon) navigator.sendBeacon("/api/playback-sessions", new Blob([body], { type: "application/json" }));
  else fetch("/api/playback-sessions", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => {});
}

function observeVideo(video) {
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  let waitingAt: number | null = null;
  video.addEventListener("waiting", () => {
    waitingAt = performance.now();
    if (playback) playback.bufferingCount += 1;
  }, options);
  video.addEventListener("playing", () => {
    if (waitingAt !== null && playback) playback.bufferingMs += performance.now() - waitingAt;
    waitingAt = null;
  }, options);
  video.addEventListener("stalled", () => { if (playback) playback.reconnectCount += 1; }, options);
  video.addEventListener("error", () => updatePlayback({ terminalError: video.error?.message || "Media playback error" }), options);
  return () => listeners.abort();
}

function labelFor(broadcast) {
  if (broadcast.status === "live" && broadcast.mode === "sacrament") return "Sacrament in progress";
  if (broadcast.status === "live") return "Live";
  if (broadcast.status === "replay") return "Replay available";
  return "Offline";
}

function detailsFor(broadcast, viewerCount) {
  if (broadcast.status === "offline") return "No current broadcast.";
  const started = broadcast.startedAt ? new Date(broadcast.startedAt).toLocaleString() : "unknown";
  const expires = broadcast.expiresAt ? new Date(broadcast.expiresAt).toLocaleString() : "unknown";
  return `Started ${started}. Replay expires ${expires}. Connected names recorded: ${viewerCount}.`;
}

refresh().catch(console.error);
setInterval(() => refresh().catch(console.error), 5000);
setInterval(() => reportPlayback(), 15000);
addEventListener("pagehide", () => reportPlayback(true));
