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
    const video = document.createElement("video");
    video.controls = options.controls !== false;
    video.autoplay = Boolean(options.autoplay);
    video.playsInline = true;
    options.onVideo?.(video);
    renderVideoFrame(container, video, "WebRTC");
    monitorPlayback(container, video, options);
    const connect = async () => {
      try {
        await attachWebRtc(container, video, whepUrl, options);
      } catch {
        if (!container.contains(video)) return;
        showPlaybackStatus(container, "Waiting for video", "The video is temporarily unavailable. Retrying automatically.");
        container.steeplePeer?.close();
        if (container.steepleWhepResource) {
          fetch(container.steepleWhepResource, { method: "DELETE" }).catch(() => {});
          container.steepleWhepResource = null;
        }
        if (options.retry !== false) container.steepleRetryTimer = setTimeout(() => {
          if (container.isConnected && container.contains(video)) connect();
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
    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = Boolean(options.autoplay);
    video.playsInline = true;
    options.onVideo?.(video);
    video.src = url;
    renderVideoFrame(container, video, "Replay");
    monitorPlayback(container, video, { ...options, recording: true });
    return video;
  },
  renderHls(container, hlsUrl, options = {}) {
    const sourceKey = options.streamKey ? `hls:${hlsUrl}:${options.streamKey}` : hlsUrl;
    if (container.steepleSrc === sourceKey && container.querySelector("video")) return container.querySelector("video");
    destroy(container);
    container.steepleSrc = sourceKey;
    const video = document.createElement("video");
    video.controls = options.controls !== false && options.controls !== "live";
    video.autoplay = Boolean(options.autoplay);
    video.playsInline = true;
    options.onVideo?.(video);
    if (options.controls === "live") {
      renderLivePlayer(container, video, { ...options, transportLabel: "HLS" });
    } else {
      renderVideoFrame(container, video, "HLS");
    }

    attachHls(container, video, hlsUrl, options);
    return video;
  },

  renderHybridLive(container, playback, options = {}) {
    const hlsUrl = playback?.hlsUrl;
    const webrtcUrl = playback?.webrtcUrl;
    const key = `hybrid:${webrtcUrl || ""}:${hlsUrl || ""}:${options.timelineStartAt || ""}:${options.streamKey || ""}`;
    if (container.steepleSrc === key && container.querySelector("video")) return container.querySelector("video");
    if (!hlsUrl && !webrtcUrl) {
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
  clearTimeout(container.steepleRetryTimer);
  container.steepleMediaCleanup?.();
  container.steepleMediaCleanup = null;
  if (container.steeplePeer) {
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
  container.querySelector("video")?.steepleUiCleanup?.();
  if (container.steepleControlsCleanup) {
    container.steepleControlsCleanup();
    container.steepleControlsCleanup = null;
  }
  container.steepleSlate = null;
}

function renderHybridPlayer(container, playback, options = {}) {
  const wrapper = document.createElement("div");
  const controls = document.createElement("div");
  const left = document.createElement("div");
  const chip = createTransportChip("WebRTC");
  const liveDot = document.createElement("span");
  const liveText = document.createElement("span");
  const timeText = document.createElement("span");
  const range = document.createElement("input");
  const liveButton = document.createElement("button");

  wrapper.className = "live-player";
  controls.className = "live-controls";
  left.className = "live-status";
  liveDot.className = "live-dot at-live";
  liveText.textContent = "Live";
  timeText.className = "live-time";
  range.className = "live-range";
  range.setAttribute("aria-label", "Seek");
  range.type = "range";
  range.min = "0";
  range.max = "1000";
  range.step = "1";
  range.value = "1000";
  liveButton.className = "live-button";
  liveButton.type = "button";
  liveButton.textContent = "Live";
  liveButton.disabled = true;

  left.append(liveDot, liveText, timeText);
  controls.append(left, range, liveButton);
  wrapper.append(chip, controls);
  container.replaceChildren(wrapper);

  let activeVideo = null;
  let mode = null;
  let dragging = false;
  let followingLive = true;
  let targetBehind = 0;
  let timer = null;
  let hideTimer = null;
  let hlsSwitch = null;
  const rangeUnits = 1000;
  const timelineStart = Date.parse(options.timelineStartAt || "") || Date.now();

  const showControls = () => {
    controls.classList.add("visible");
    chip?.classList.add("visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!dragging && document.activeElement !== range && document.activeElement !== liveButton) {
        controls.classList.remove("visible");
        chip?.classList.remove("visible");
      }
    }, 2400);
  };

  const replaceVideo = (video, transportLabel) => {
    removeCurrentMedia(container, activeVideo);
    activeVideo = video;
    video.autoplay = Boolean(options.autoplay);
    video.playsInline = true;
    video.controls = false;
    options.onVideo?.(video);
    chip.textContent = transportLabel;
    wrapper.insertBefore(video, chip);
    attachVolumeControls(wrapper, video);
    monitorPlayback(container, video, options);
    return video;
  };

  const showWebRtc = async () => {
    if (!playback.webrtcUrl) return showHls(0);
    if (mode === "webrtc") return activeVideo;
    mode = "webrtc";
    followingLive = true;
    targetBehind = 0;
    const video = replaceVideo(document.createElement("video"), "WebRTC");
    try {
      await attachWebRtc(container, video, playback.webrtcUrl, options);
      return video;
    } catch (error) {
      if (mode === "webrtc") {
        mode = null;
        await showHls(0, error.message);
      }
      return null;
    } finally {
      update();
    }
  };

  const showHls = async (behind, fallbackReason = null) => {
    if (!playback.hlsUrl) return null;
    if (mode !== "hls") {
      mode = "hls";
      options.onTransport?.({ transport: "hls", fallbackReason });
      const video = replaceVideo(document.createElement("video"), "HLS");
      attachHls(container, video, playback.hlsUrl, options);
      // HLS metadata can arrive before the live seekable window exists.
      // Retain the requested rewind until that window becomes available.
      const seekEvents = ["loadedmetadata", "progress", "canplay"];
      const applyInitialSeek = () => {
        if (activeVideo !== video || !getLiveWindow(video)) return;
        seekHlsToBehind(behind);
        for (const event of seekEvents) video.removeEventListener(event, applyInitialSeek);
      };
      for (const event of seekEvents) video.addEventListener(event, applyInitialSeek);
      video.addEventListener("playing", update);
      video.addEventListener("waiting", update);
      video.play().catch(() => {});
      hlsSwitch = video;
    }
    targetBehind = Math.max(0, behind);
    followingLive = targetBehind < 1.5;
    seekHlsToBehind(targetBehind);
    update();
    return hlsSwitch;
  };

  const seekHlsToBehind = (behind) => {
    if (mode !== "hls" || !activeVideo) return;
    const liveWindow = getLiveWindow(activeVideo);
    if (!liveWindow) return;
    activeVideo.currentTime = seekTargetForBehind(liveWindow, behind);
    activeVideo.play().catch(() => {});
  };

  const maxTimelineBehind = () => Math.max(0, (Date.now() - timelineStart) / 1000);

  const update = () => {
    if (!followingLive) targetBehind = Math.min(targetBehind, maxTimelineBehind());
    if (followingLive) targetBehind = 0;
    const availableBehind = maxTimelineBehind();
    range.disabled = availableBehind < 1;
    liveButton.disabled = followingLive;
    if (!dragging) {
      const ratio = followingLive || availableBehind <= 0 ? 1 : clamp(1 - (targetBehind / availableBehind), 0, 1);
      range.value = String(Math.round(ratio * rangeUnits));
    }
    liveDot.classList.toggle("at-live", followingLive);
    timeText.textContent = followingLive ? "" : `${formatBehind(targetBehind)} behind`;
  };

  range.addEventListener("input", () => {
    dragging = true;
    const ratio = Number(range.value) / rangeUnits;
    targetBehind = maxTimelineBehind() * (1 - ratio);
    followingLive = targetBehind < 1.5;
    if (followingLive) {
      showWebRtc();
    } else {
      showHls(targetBehind);
    }
    update();
  });
  range.addEventListener("change", () => {
    dragging = false;
    const ratio = Number(range.value) / rangeUnits;
    targetBehind = maxTimelineBehind() * (1 - ratio);
    followingLive = targetBehind < 1.5;
    if (followingLive) showWebRtc();
    else showHls(targetBehind);
    update();
  });
  liveButton.addEventListener("click", () => {
    followingLive = true;
    targetBehind = 0;
    showWebRtc();
    update();
  });
  wrapper.addEventListener("pointermove", showControls);
  wrapper.addEventListener("pointerdown", showControls);
  wrapper.addEventListener("focusin", showControls);
  wrapper.addEventListener("touchstart", showControls, { passive: true });

  timer = setInterval(update, 250);
  update();
  showControls();
  showWebRtc();

  container.steepleControlsCleanup = () => {
    clearInterval(timer);
    clearTimeout(hideTimer);
    wrapper.removeEventListener("pointermove", showControls);
    wrapper.removeEventListener("pointerdown", showControls);
    wrapper.removeEventListener("focusin", showControls);
    wrapper.removeEventListener("touchstart", showControls);
  };
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

function waitForPlaying(video, timeoutMs) {
  if (video.readyState >= 3) return video.play().catch(() => {});
  return new Promise((resolve, reject) => {
    const finish = (error) => {
      clearTimeout(timeout);
      video.removeEventListener("playing", playing);
      if (error) reject(error);
      else resolve();
    };
    const playing = () => finish();
    const timeout = setTimeout(() => finish(new Error("WebRTC playback timed out")), timeoutMs);
    video.addEventListener("playing", playing, { once: true });
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
  const stream = new MediaStream();
  video.srcObject = stream;
  pc.ontrack = (event) => stream.addTrack(event.track);
  pc.addTransceiver("video", { direction: "recvonly" });
  pc.addTransceiver("audio", { direction: "recvonly" });
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await waitForIceGathering(pc, 3000);
  const response = await fetch(whepUrl, {
    method: "POST",
    headers: { "content-type": "application/sdp" },
    body: pc.localDescription.sdp
  });
  if (!response.ok) throw new Error(`WHEP returned HTTP ${response.status}`);
  container.steepleWhepResource = response.headers.get("location");
  await pc.setRemoteDescription({ type: "answer", sdp: await response.text() });
  await waitForPlaying(video, options.timeoutMs || 4000);
  const candidateType = await selectedCandidateType(pc);
  options.onTransport?.({ transport: `webrtc-${candidateType}`, candidateType });
}

function attachHls(container, video, hlsUrl, options = {}) {
  let retryPending = false;
  const fail = (data = {}) => {
    if (!container.contains(video)) return;
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
      if (!container.isConnected || !container.contains(video)) return;
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
  clearTimeout(container.steepleRetryTimer);
  container.steepleMediaCleanup?.();
  container.steepleMediaCleanup = null;
  if (container.steeplePeer) {
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
    video.steepleUiCleanup?.();
    video.pause();
    video.removeAttribute("src");
    video.srcObject = null;
    video.load?.();
    video.remove();
  }
}

function renderLivePlayer(container, video, options = {}) {
  const wrapper = document.createElement("div");
  const controls = document.createElement("div");
  const left = document.createElement("div");
  const chip = createTransportChip(options.transportLabel);
  const liveDot = document.createElement("span");
  const liveText = document.createElement("span");
  const timeText = document.createElement("span");
  const range = document.createElement("input");
  const liveButton = document.createElement("button");

  wrapper.className = "live-player";
  controls.className = "live-controls";
  left.className = "live-status";
  liveDot.className = "live-dot";
  liveText.textContent = "Live";
  timeText.className = "live-time";
  range.className = "live-range";
  range.setAttribute("aria-label", "Seek");
  range.type = "range";
  range.min = "0";
  range.max = "1000";
  range.step = "1";
  range.value = "1000";
  liveButton.className = "live-button";
  liveButton.type = "button";
  liveButton.textContent = "Live";

  left.append(liveDot, liveText, timeText);
  controls.append(left, range, liveButton);
  wrapper.append(video, chip, controls);
  attachVolumeControls(wrapper, video);
  container.replaceChildren(wrapper);

  let dragging = false;
  let followingLive = true;
  let targetBehind = 0;
  let timer = null;
  let hideTimer = null;
  const rangeUnits = 1000;

  const showControls = () => {
    controls.classList.add("visible");
    chip?.classList.add("visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!dragging && document.activeElement !== range && document.activeElement !== liveButton) {
        controls.classList.remove("visible");
        chip?.classList.remove("visible");
      }
    }, 2400);
  };

  const update = () => {
    const liveWindow = getLiveWindow(video);
    if (!liveWindow) {
      range.disabled = true;
      liveButton.disabled = true;
      timeText.textContent = "";
      liveDot.classList.remove("at-live");
      return;
    }

    if (!followingLive) {
      targetBehind = Math.min(targetBehind, maxAvailableBehind(liveWindow));
      if (targetBehind < 1.5) followingLive = true;
    }
    if (followingLive) targetBehind = 0;

    range.disabled = false;
    liveButton.disabled = followingLive;
    if (!dragging) {
      const availableBehind = maxAvailableBehind(liveWindow);
      const ratio = followingLive || availableBehind <= 0 ? 1 : clamp(1 - (targetBehind / availableBehind), 0, 1);
      range.value = String(Math.round(ratio * rangeUnits));
    }
    liveDot.classList.toggle("at-live", followingLive);
    timeText.textContent = followingLive ? "" : `${formatBehind(targetBehind)} behind`;
  };

  range.addEventListener("input", () => {
    dragging = true;
    const liveWindow = getLiveWindow(video);
    if (liveWindow) {
      const ratio = Number(range.value) / rangeUnits;
      targetBehind = maxAvailableBehind(liveWindow) * (1 - ratio);
      followingLive = targetBehind < 1.5;
      video.currentTime = seekTargetForBehind(liveWindow, targetBehind);
    }
    update();
  });
  range.addEventListener("change", () => {
    const liveWindow = getLiveWindow(video);
    if (liveWindow) {
      const ratio = Number(range.value) / rangeUnits;
      targetBehind = maxAvailableBehind(liveWindow) * (1 - ratio);
      followingLive = targetBehind < 1.5;
      video.currentTime = seekTargetForBehind(liveWindow, targetBehind);
    }
    dragging = false;
    update();
  });
  const handlePlay = () => {
    if (targetBehind < 1.5) followingLive = true;
  };

  liveButton.addEventListener("click", () => {
    const liveWindow = getLiveWindow(video);
    if (!liveWindow) return;
    followingLive = true;
    targetBehind = 0;
    video.currentTime = seekTargetForBehind(liveWindow, 0);
    video.play().catch(() => {});
    update();
  });
  video.addEventListener("play", handlePlay);
  wrapper.addEventListener("pointermove", showControls);
  wrapper.addEventListener("pointerdown", showControls);
  wrapper.addEventListener("focusin", showControls);
  wrapper.addEventListener("touchstart", showControls, { passive: true });

  timer = setInterval(update, 250);
  for (const event of ["loadedmetadata", "playing", "waiting"]) {
    video.addEventListener(event, update);
  }
  update();
  showControls();

  container.steepleControlsCleanup = () => {
    clearInterval(timer);
    clearTimeout(hideTimer);
    for (const event of ["loadedmetadata", "playing", "waiting"]) {
      video.removeEventListener(event, update);
    }
    video.removeEventListener("play", handlePlay);
    wrapper.removeEventListener("pointermove", showControls);
    wrapper.removeEventListener("pointerdown", showControls);
    wrapper.removeEventListener("focusin", showControls);
    wrapper.removeEventListener("touchstart", showControls);
  };
}

function renderVideoFrame(container, video, transportLabel) {
  const wrapper = document.createElement("div");
  const chip = createTransportChip(transportLabel);
  wrapper.className = "live-player";
  wrapper.append(video);
  attachVolumeControls(wrapper, video);
  if (chip) wrapper.append(chip);
  container.replaceChildren(wrapper);

  if (!chip) return;
  let hideTimer = null;
  const showChip = () => {
    chip.classList.add("visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => chip.classList.remove("visible"), 2400);
  };
  wrapper.addEventListener("pointermove", showChip);
  wrapper.addEventListener("pointerdown", showChip);
  wrapper.addEventListener("focusin", showChip);
  wrapper.addEventListener("touchstart", showChip, { passive: true });
  showChip();

  container.steepleControlsCleanup = () => {
    clearTimeout(hideTimer);
    wrapper.removeEventListener("pointermove", showChip);
    wrapper.removeEventListener("pointerdown", showChip);
    wrapper.removeEventListener("focusin", showChip);
    wrapper.removeEventListener("touchstart", showChip);
  };
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

function createTransportChip(label) {
  if (!label) return null;
  const chip = document.createElement("div");
  chip.className = "transport-chip";
  chip.textContent = label;
  return chip;
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

function maxAvailableBehind(liveWindow) {
  return Math.max(0, liveWindow.end - liveWindow.start - 0.5);
}

function seekTargetForBehind(liveWindow, behind) {
  return clamp(liveWindow.end - behind, liveWindow.start, liveWindow.end - 0.5);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatBehind(seconds) {
  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const rest = String(rounded % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
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
      if (!container.contains(video)) return;
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
    clearInterval(timer);
    video.removeEventListener("playing", playing);
    video.removeEventListener("loadeddata", loaded);
    video.removeEventListener("waiting", waiting);
    video.removeEventListener("stalled", waiting);
    video.removeEventListener("error", error);
    video.removeEventListener("timeupdate", progress);
  };
}
