window.SteeplePlayer = {
  renderPreviewStatus(container, source, audience = "broadcaster") {
    const configured = source?.type === "ndi" ? Boolean(source.ndi?.sourceName)
      : source?.type === "capture" ? Boolean(source.capture?.videoDevice && source.capture?.audioDevice)
      : Boolean(source?.network?.uri);
    if (configured) return false;
    this.renderSlate(container, "Camera preview not configured", audience === "admin"
      ? "No video source is selected."
      : "An administrator needs to select a video source.");
    return true;
  },
  async renderWebRtc(container, whepUrl, options = {}) {
    const sourceKey = options.streamKey ? `webrtc:${whepUrl}:${options.streamKey}` : whepUrl;
    if (container.steepleSrc === sourceKey && container.querySelector("video")) return container.querySelector("video");
    destroy(container);
    container.steepleSrc = sourceKey;
    const video = getVideo(container);
    const generation = container.steepleGeneration;
    video.controls = options.controls !== false;
    video.autoplay = Boolean(options.autoplay);
    video.playsInline = true;
    video.steepleObserverCleanup = options.onVideo?.(video);
    renderVideoFrame(container, video, "WebRTC");
    monitorPlayback(container, video, options);
    const connect = async () => {
      try {
        await attachWebRtc(container, video, whepUrl, options);
      } catch {
        if (container.steepleGeneration !== generation) return;
        showPlaybackStatus(container, "Waiting for video", "The video is temporarily unavailable. Retrying automatically.");
        container.steeplePeer?.close();
        if (container.steepleWhepResource) {
          fetch(container.steepleWhepResource, { method: "DELETE" }).catch(() => {});
          container.steepleWhepResource = null;
        }
        if (options.retry !== false) container.steepleRetryTimer = setTimeout(() => {
          if (container.isConnected && container.steepleGeneration === generation) connect();
        }, options.retryDelayMs || 5000);
      }
    };
    await connect();
    return video;
  },
  renderRecording(container, url, options = {}) {
    if (container.steepleSrc === url && container.querySelector("video")) return container.querySelector("video");
    destroy(container);
    container.steepleSrc = url;
    const video = getVideo(container);
    video.controls = true;
    video.autoplay = Boolean(options.autoplay);
    video.playsInline = true;
    video.steepleObserverCleanup = options.onVideo?.(video);
    video.src = url;
    renderVideoFrame(container, video, "Replay");
    monitorPlayback(container, video, { ...options, recording: true });
    return video;
  },
  renderHls(container, hlsUrl, options = {}) {
    if (options.controls === "live") return this.renderHybridLive(container, { hlsUrl }, options);
    const sourceKey = options.streamKey ? `hls:${hlsUrl}:${options.streamKey}` : hlsUrl;
    if (container.steepleSrc === sourceKey && container.querySelector("video")) return container.querySelector("video");
    destroy(container);
    container.steepleSrc = sourceKey;
    const video = getVideo(container);
    video.controls = options.controls !== false && options.controls !== "live";
    video.autoplay = Boolean(options.autoplay);
    video.playsInline = true;
    video.steepleObserverCleanup = options.onVideo?.(video);
    renderVideoFrame(container, video, "HLS");

    attachHls(container, video, hlsUrl, options);
    return video;
  },

  renderHybridLive(container, playback, options = {}) {
    const hlsUrl = playback?.hlsUrl;
    const webrtcUrl = playback?.webrtcUrl;
    const key = `hybrid:${webrtcUrl || ""}:${hlsUrl || ""}:${options.timelineStartAt || ""}:${options.streamKey || ""}`;
    if (container.steepleSrc === key && container.querySelector("video")) return container.querySelector("video");
    if (!hlsUrl && !webrtcUrl) {
      destroy(container);
      container.steepleSrc = null;
      renderMessage(container, "Preview Unavailable", "No local preview URL is configured.");
      return null;
    }

    destroy(container);
    container.steepleSrc = key;
    renderHybridPlayer(container, { hlsUrl, webrtcUrl }, options);
    return container.querySelector("video");
  },

  renderSlate(container, title, message) {
    const slateKey = `${title}\n${message}`;
    if (container.steepleSlate === slateKey) return;
    destroy(container);
    container.steepleSrc = null;
    container.steepleSlate = slateKey;
    renderMessage(container, title, message);
  }
};

function destroy(container) {
  if (container.steepleControlsCleanup) {
    container.steepleControlsCleanup();
    container.steepleControlsCleanup = null;
  }
  const video = container.steepleVideo;
  removeCurrentMedia(container, video);
  video?.steepleUiCleanup?.();
  if (video) video.steepleTimeline = null;
  container.steepleSlate = null;
}

// Keep the element (and its browser playback permission) for this container,
// including across offline slates. Transports and controls have shorter lives.
function getVideo(container) {
  return container.steepleVideo ||= document.createElement("video");
}

function renderHybridPlayer(container, playback, options = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "live-player";
  const video = getVideo(container);
  let mode = null;
  let stopped = false;
  let requestedTime = null;
  let followingLive = true;
  let advertised = null;
  let refreshTimer;
  let request;
  const subscribers = new Set();
  const startedAt = Date.parse(options.timelineStartAt || "") || Date.now();
  const elapsed = () => Math.max(0, (Date.now() - startedAt) / 1000);
  const notify = () => { for (const callback of subscribers) callback(); };
  const hlsOffset = () => {
    const hls = container.steepleHls;
    const fragments = hls?.levels?.[hls.currentLevel]?.details?.fragments;
    const anchor = fragments?.find(fragment => Number.isFinite(fragment.programDateTime));
    if (anchor) return (anchor.programDateTime - startedAt) / 1000 - anchor.start;
    const range = getLiveWindow(video);
    return range && advertised ? advertised.end - range.end : null;
  };
  const state = () => {
    const end = elapsed();
    const offset = mode === "hls" ? hlsOffset() : null;
    const current = requestedTime ?? (offset !== null ? video.currentTime + offset : end);
    const available = advertised && Date.now() - advertised.updatedAt < 15000;
    return {
      start: available ? Math.max(0, advertised.start) : end,
      end,
      current: clamp(current, 0, end),
      live: followingLive,
      available: Boolean(available && advertised.end > Math.max(0, advertised.start) + 1),
      busy: requestedTime !== null
    };
  };
  const switchMedia = (transport) => {
    removeCurrentMedia(container, video);
    mode = transport;
    video.steepleObserverCleanup = options.onVideo?.(video);
    monitorPlayback(container, video, options);
  };
  const seekHls = () => {
    if (requestedTime === null || mode !== "hls") return;
    const range = getLiveWindow(video);
    const offset = hlsOffset();
    if (!range || offset === null) return;
    video.currentTime = clamp(requestedTime - offset, range.start, range.end - 0.5);
    requestedTime = null;
    video.play().catch(() => {});
    notify();
  };
  const showHls = (time = null, fallbackReason = null) => {
    if (!playback.hlsUrl || stopped) return;
    requestedTime = time;
    followingLive = time === null;
    if (mode !== "hls") {
      switchMedia("hls");
      options.onTransport?.({ transport: "hls", fallbackReason });
      const listeners = new AbortController();
      container.steepleTransportCleanup = () => listeners.abort();
      for (const event of ["loadedmetadata", "progress", "canplay"]) {
        video.addEventListener(event, seekHls, { signal: listeners.signal });
      }
      attachHls(container, video, playback.hlsUrl, options);
    }
    seekHls();
    if (time === null) {
      const range = getLiveWindow(video);
      if (range) video.currentTime = range.end - 0.5;
      video.play().catch(() => {});
    }
    notify();
  };
  const goLive = async () => {
    if (stopped) return;
    requestedTime = null;
    followingLive = true;
    if (!playback.webrtcUrl) return showHls();
    if (mode === "webrtc") {
      video.play().catch(() => {});
      return;
    }
    switchMedia("webrtc");
    const generation = container.steepleGeneration;
    try {
      await attachWebRtc(container, video, playback.webrtcUrl, options);
    } catch (error) {
      if (!stopped && generation === container.steepleGeneration) showHls(null, error.message);
    }
    notify();
  };
  video.steepleTimeline = {
    getState: state,
    subscribe(callback) { subscribers.add(callback); return () => subscribers.delete(callback); },
    seek(time) {
      const value = state();
      if (time >= value.end - 1.5) return goLive();
      if (!value.available) return;
      showHls(clamp(time, value.start, Math.min(value.end, advertised.end) - 0.5));
    },
    goLive
  };
  video.steepleIsLive = true;
  video.autoplay = Boolean(options.autoplay);
  video.playsInline = true;
  wrapper.append(video);
  container.replaceChildren(wrapper);
  attachVolumeControls(wrapper, video);

  // Read only the playlist, not a second video stream. Until it advertises
  // dated segments, do not promise viewers a rewind range we cannot locate.
  const refreshWindow = async () => {
    if (!playback.hlsUrl || stopped) return;
    request = new AbortController();
    const timeout = setTimeout(() => request?.abort(), 8000);
    try {
      let url = new URL(playback.hlsUrl, window.location.href);
      let response = await fetch(url, { signal: request.signal, cache: "no-store" });
      if (!response.ok) throw new Error("HLS playlist unavailable");
      let text = await response.text();
      const variant = hlsVariant(text);
      if (variant) {
        url = new URL(variant, url);
        response = await fetch(url, { signal: request.signal, cache: "no-store" });
        if (!response.ok) throw new Error("HLS playlist unavailable");
        text = await response.text();
      }
      if (stopped) return;
      const range = hlsPlaylistWindow(text);
      if (range) advertised = {
        start: (range.start - startedAt) / 1000,
        end: (range.end - startedAt) / 1000,
        updatedAt: Date.now()
      };
      seekHls();
      notify();
    } catch { /* Keep the last range briefly; then disable unavailable seeking. */ }
    finally {
      clearTimeout(timeout);
      if (!stopped) refreshTimer = setTimeout(refreshWindow, 3000);
    }
  };
  const timer = setInterval(notify, 500);
  container.steepleControlsCleanup = () => {
    stopped = true;
    clearInterval(timer);
    clearTimeout(refreshTimer);
    request?.abort();
    subscribers.clear();
  };
  refreshWindow();
  goLive();
}

// Return the first advertised variant; media playlists have no variant tag.
function hlsVariant(text) {
  const lines = text.split(/\r?\n/).map(line => line.trim());
  const index = lines.findIndex(line => line.startsWith("#EXT-X-STREAM-INF:"));
  return index < 0 ? null : lines.slice(index + 1).find(line => line && !line.startsWith("#"));
}

function hlsPlaylistWindow(text) {
  let date = null;
  let duration = null;
  let start = null;
  let end = null;
  for (const line of text.split(/\r?\n/).map(line => line.trim())) {
    if (line.startsWith("#EXT-X-PROGRAM-DATE-TIME:")) {
      const parsed = Date.parse(line.slice("#EXT-X-PROGRAM-DATE-TIME:".length));
      date = Number.isFinite(parsed) ? parsed : null;
    } else if (line.startsWith("#EXTINF:")) {
      duration = Number.parseFloat(line.slice(8));
    } else if (line && !line.startsWith("#") && date !== null && Number.isFinite(duration) && duration > 0) {
      start ??= date;
      date += duration * 1000;
      end = date;
      duration = null;
    }
  }
  return start !== null && end > start ? { start, end } : null;
}

function waitForIceGathering(pc, timeoutMs) {
  if (pc.iceGatheringState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, timeoutMs);
    pc.addEventListener("icegatheringstatechange", function handler() {
      if (pc.iceGatheringState !== "complete") return;
      clearTimeout(timeout);
      pc.removeEventListener("icegatheringstatechange", handler);
      resolve();
    });
  });
}

function waitForPlaying(video, timeoutMs, signal) {
  if (video.readyState >= 3) return video.play().catch(() => {});
  return new Promise((resolve, reject) => {
    const finish = (error) => {
      clearTimeout(timeout);
      video.removeEventListener("playing", playing);
      signal?.removeEventListener("abort", aborted);
      if (error) reject(error);
      else resolve();
    };
    const playing = () => finish();
    const aborted = () => finish(new Error("WebRTC source changed"));
    const timeout = setTimeout(() => finish(new Error("WebRTC playback timed out")), timeoutMs);
    video.addEventListener("playing", playing, { once: true });
    signal?.addEventListener("abort", aborted, { once: true });
    // The playback monitor offers a Play button. Browser autoplay policy is
    // not a transport failure and must not trigger a reconnect/HLS fallback.
    video.play().catch((error) => {
      if (error.name === "NotAllowedError") finish();
    });
  });
}

async function selectedCandidateType(pc) {
  const stats = await pc.getStats();
  let pair = null;
  for (const report of stats.values()) {
    if (report.type === "transport" && report.selectedCandidatePairId) pair = stats.get(report.selectedCandidatePairId);
    if (!pair && report.type === "candidate-pair" && report.nominated && report.state === "succeeded") pair = report;
  }
  const remote = pair ? stats.get(pair.remoteCandidateId) : null;
  return remote?.candidateType || "unknown";
}

async function attachWebRtc(container, video, whepUrl, options = {}) {
  const pc = new RTCPeerConnection();
  container.steeplePeer = pc;
  const pending = new AbortController();
  container.steepleTransportCleanup = () => pending.abort();
  const isCurrent = () => container.steeplePeer === pc;
  const checkCurrent = () => {
    if (!isCurrent()) throw new Error("WebRTC source changed");
  };
  const stream = new MediaStream();
  video.srcObject = stream;
  pc.ontrack = (event) => stream.addTrack(event.track);
  pc.addTransceiver("video", { direction: "recvonly" });
  pc.addTransceiver("audio", { direction: "recvonly" });
  const offer = await pc.createOffer();
  checkCurrent();
  await pc.setLocalDescription(offer);
  await waitForIceGathering(pc, 3000);
  checkCurrent();
  const response = await fetch(whepUrl, {
    method: "POST",
    headers: { "content-type": "application/sdp" },
    body: pc.localDescription.sdp
  });
  const location = response.headers.get("location");
  const resource = location ? new URL(location, new URL(whepUrl, window.location.href)).href : null;
  if (!isCurrent()) {
    if (resource) fetch(resource, { method: "DELETE", keepalive: true }).catch(() => {});
    checkCurrent();
  }
  if (!response.ok) throw new Error(`WHEP returned HTTP ${response.status}`);
  container.steepleWhepResource = resource;
  const sdp = await response.text();
  checkCurrent();
  await pc.setRemoteDescription({ type: "answer", sdp });
  checkCurrent();
  await waitForPlaying(video, options.timeoutMs || 4000, pending.signal);
  checkCurrent();
  const candidateType = await selectedCandidateType(pc);
  checkCurrent();
  options.onTransport?.({ transport: `webrtc-${candidateType}`, candidateType });
}

function attachHls(container, video, hlsUrl, options = {}) {
  const generation = container.steepleGeneration;
  let retryPending = false;
  const fail = (data = {}) => {
    if (container.steepleGeneration !== generation || !container.contains(video)) return;
    const denied = [401, 403].includes(data.response?.code);
    if (retryPending && !denied) return;
    showPlaybackStatus(container, denied ? "Access expired" : "Waiting for video",
      denied ? "Reload this page to sign in again." : "The video is temporarily unavailable. Retrying automatically.");
    clearTimeout(container.steepleRetryTimer);
    if (denied || options.retry === false) {
      container.steepleMediaCleanup?.();
      container.steepleMediaCleanup = null;
      container.steepleHls?.stopLoad();
      return;
    }
    retryPending = true;
    container.steepleRetryTimer = setTimeout(() => {
      if (!container.isConnected || container.steepleGeneration !== generation) return;
      container.steepleHls?.destroy();
      container.steepleHls = null;
      attachHls(container, video, hlsUrl, options);
    }, options.retryDelayMs || 5000);
  };
  container.steepleMediaCleanup?.();
  monitorPlayback(container, video, {
    ...options,
    onStall: () => fail(),
    onProgress: () => {
      if (!retryPending) return;
      clearTimeout(container.steepleRetryTimer);
      retryPending = false;
    }
  });
  // Native HLS support does not guarantee a seekable live window (Chromium
  // can play this stream while reporting no ranges). Prefer HLS.js for DVR.
  if (window.Hls?.isSupported()) {
    const hls = new window.Hls({
      lowLatencyMode: true,
      backBufferLength: 30
    });
    container.steepleHls = hls;
    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) fail(data);
    });
    return video;
  }

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.onerror = () => fail();
    video.src = hlsUrl;
    return video;
  }

  showPlaybackStatus(container, "Video unavailable in this browser", "Try another browser to watch this video.");
  return null;
}

function removeCurrentMedia(container, video) {
  container.steepleGeneration = (container.steepleGeneration || 0) + 1;
  container.steepleTransportCleanup?.();
  container.steepleTransportCleanup = null;
  clearTimeout(container.steepleRetryTimer);
  container.steepleMediaCleanup?.();
  container.steepleMediaCleanup = null;
  if (container.steeplePeer) {
    container.steeplePeer.ontrack = null;
    container.steeplePeer.close();
    container.steeplePeer = null;
  }
  if (container.steepleWhepResource) {
    fetch(container.steepleWhepResource, { method: "DELETE", keepalive: true }).catch(() => {});
    container.steepleWhepResource = null;
  }
  if (container.steepleHls) {
    container.steepleHls.destroy();
    container.steepleHls = null;
  }
  if (video) {
    video.steepleObserverCleanup?.();
    video.steepleObserverCleanup = null;
    video.onerror = null;
    video.pause();
    video.removeAttribute("src");
    video.srcObject = null;
    video.load?.();
  }
  container.querySelector(".playback-status")?.remove();
}


function renderVideoFrame(container, video, transportLabel) {
  video.steepleIsLive = transportLabel !== "Replay";
  const wrapper = document.createElement("div");
  wrapper.className = "live-player";
  wrapper.append(video);
  container.replaceChildren(wrapper);
  attachVolumeControls(wrapper, video);
}

const volumeStorageKey = "steeple-stream:audio";
let audioPreference = { volume: 1, muted: false };

function readAudioPreference() {
  try {
    const saved = JSON.parse(localStorage.getItem(volumeStorageKey));
    if (saved && typeof saved.volume === "number" && Number.isFinite(saved.volume)
        && saved.volume >= 0 && saved.volume <= 1 && typeof saved.muted === "boolean") {
      audioPreference = { volume: saved.volume, muted: saved.muted };
    }
  } catch { /* Storage can be unavailable; retain the preference for this page. */ }
  return audioPreference;
}

function attachVolumeControls(wrapper, video) {
  const preference = readAudioPreference();
  video.volume = preference.volume;
  video.muted = preference.muted;
  const save = () => {
    audioPreference = { volume: video.volume, muted: video.muted };
    try { localStorage.setItem(volumeStorageKey, JSON.stringify(audioPreference)); } catch { /* Optional storage. */ }
  };
  const dispose = window.SteepleComponent.mount(wrapper, video, preference);
  video.addEventListener("volumechange", save);
  video.steepleUiCleanup = () => {
    video.removeEventListener("volumechange", save);
    dispose?.();
    video.steepleUiCleanup = null;
  };
}

function getLiveWindow(video) {
  const ranges = video.seekable;
  if (!ranges.length) return null;
  const index = ranges.length - 1;
  const start = ranges.start(index);
  const end = ranges.end(index);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  return { start, end };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderMessage(container, title, message) {
  container.replaceChildren();
  const slate = document.createElement("div");
  slate.className = "slate";
  slate.setAttribute("role", "status");
  const wrapper = document.createElement("div");
  const heading = document.createElement("h2");
  const paragraph = document.createElement("p");
  heading.textContent = title;
  paragraph.textContent = message;
  wrapper.append(heading, paragraph);
  slate.append(wrapper);
  container.append(slate);
}

function showPlaybackStatus(container, title, message) {
  let overlay = container.querySelector(".playback-status");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "slate playback-status";
    overlay.setAttribute("role", "status");
    const content = document.createElement("div");
    content.append(document.createElement("h2"), document.createElement("p"));
    overlay.append(content);
    container.append(overlay);
  }
  if (overlay.querySelector("h2").textContent !== title) overlay.querySelector("h2").textContent = title;
  if (overlay.querySelector("p").textContent !== message) overlay.querySelector("p").textContent = message;
}

function monitorPlayback(container, video, options) {
  let disposed = false;
  let waitingSince = null;
  let lastProgressAt = performance.now();
  let lastTime = video.currentTime;
  let hasPlayed = false;
  let autoplayBlocked = false;
  if (!container.querySelector(".playback-status")) {
    showPlaybackStatus(container, options.recording ? "Loading recording" : "Connecting to video", "");
  }
  const playing = () => {
    hasPlayed = true;
    autoplayBlocked = false;
    waitingSince = null;
    container.querySelector(".playback-status")?.remove();
  };
  const progress = () => {
    if (video.seeking || video.currentTime === lastTime) return false;
    lastTime = video.currentTime;
    lastProgressAt = performance.now();
    options.onProgress?.();
    playing();
    return true;
  };
  const loaded = () => {
    if (!options.autoplay) return playing();
    video.play().catch((reason) => {
      if (disposed || !container.contains(video)) return;
      if (reason.name !== "NotAllowedError") return;
      autoplayBlocked = true;
      showPlaybackStatus(container, "Ready to watch", "");
      const overlay = container.querySelector(".playback-status");
      if (overlay.querySelector("button")) return;
      const button = document.createElement("button");
      button.className = "button";
      button.textContent = "Play video";
      button.addEventListener("click", () => video.play().catch(error));
      overlay.firstElementChild.append(button);
    });
  };
  const waiting = () => {
    waitingSince ??= performance.now();
  };
  const error = () => {
    if (container.contains(video)) showPlaybackStatus(container, options.recording ? "Recording unavailable" : "Video interrupted",
      options.recording ? "This recording may have expired or could not be loaded." : "Waiting for the video connection to recover.");
  };
  video.addEventListener("playing", playing);
  video.addEventListener("loadeddata", loaded);
  video.addEventListener("waiting", waiting);
  video.addEventListener("stalled", waiting);
  video.addEventListener("error", error);
  video.addEventListener("timeupdate", progress);
  // A stalled event can occur while buffered video still plays, and a dead
  // decoder need not emit a fatal error. Measure playback progress instead.
  const timer = setInterval(() => {
    if (!container.contains(video)) return;
    const now = performance.now();
    if (document.hidden || autoplayBlocked || video.ended || (video.paused && (hasPlayed || !options.autoplay))) {
      lastProgressAt = now;
      waitingSince = null;
      return;
    }
    if (progress()) return;
    if (waitingSince !== null && now - waitingSince >= 4000) error();
    if (now - lastProgressAt >= 12000) {
      lastProgressAt = now;
      waitingSince = null;
      if (options.onStall && options.retry !== false) options.onStall();
      else error();
    }
  }, 1000);
  container.steepleMediaCleanup = () => {
    disposed = true;
    clearInterval(timer);
    video.removeEventListener("playing", playing);
    video.removeEventListener("loadeddata", loaded);
    video.removeEventListener("waiting", waiting);
    video.removeEventListener("stalled", waiting);
    video.removeEventListener("error", error);
    video.removeEventListener("timeupdate", progress);
  };
}
