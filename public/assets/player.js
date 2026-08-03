window.SteeplePlayer = {
  async renderWebRtc(container, whepUrl, options = {}) {
    destroy(container);
    container.steepleSrc = whepUrl;
    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = Boolean(options.autoplay);
    video.playsInline = true;
    options.onVideo?.(video);
    renderVideoFrame(container, video, "WebRTC");
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
    await waitForPlaying(video, options.timeoutMs || 8000);
    const candidateType = await selectedCandidateType(pc);
    options.onTransport?.({ transport: `webrtc-${candidateType}`, candidateType });
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
    return video;
  },
  renderHls(container, hlsUrl, options = {}) {
    if (container.steepleSrc === hlsUrl && container.querySelector("video")) return container.querySelector("video");
    destroy(container);
    container.steepleSrc = hlsUrl;
    const video = document.createElement("video");
    video.controls = options.controls !== "live";
    video.muted = Boolean(options.muted);
    video.autoplay = Boolean(options.autoplay);
    video.playsInline = true;
    options.onVideo?.(video);
    if (options.controls === "live") {
      renderLivePlayer(container, video, { ...options, transportLabel: "HLS" });
    } else {
      renderVideoFrame(container, video, "HLS");
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      return video;
    }

    if (window.Hls?.isSupported()) {
      const hls = new window.Hls({
        lowLatencyMode: true,
        backBufferLength: 30
      });
      container.steepleHls = hls;
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          container.steepleSrc = null;
          renderMessage(container, "Preview Waiting", "No playable stream is available yet.");
        }
      });
      return video;
    }

    renderMessage(container, "Unsupported Browser", "This browser cannot play the local HLS stream.");
    return null;
  },

  renderHybridLive(container, playback, options = {}) {
    const hlsUrl = playback?.hlsUrl;
    const webrtcUrl = playback?.webrtcUrl;
    const key = `hybrid:${webrtcUrl || ""}:${hlsUrl || ""}:${options.timelineStartAt || ""}`;
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
    video.muted = Boolean(options.muted);
    video.autoplay = Boolean(options.autoplay);
    video.playsInline = true;
    video.controls = false;
    options.onVideo?.(video);
    chip.textContent = transportLabel;
    wrapper.insertBefore(video, chip);
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
        await showHls(0);
      }
      return null;
    } finally {
      update();
    }
  };

  const showHls = async (behind) => {
    if (!playback.hlsUrl) return null;
    if (mode !== "hls") {
      mode = "hls";
      const video = replaceVideo(document.createElement("video"), "HLS");
      attachHls(container, video, playback.hlsUrl, {
        onFatalError: () => renderMessage(container, "Preview Waiting", "No playable stream is available yet.")
      });
      video.addEventListener("loadedmetadata", () => seekHlsToBehind(behind), { once: true });
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
    const timeout = setTimeout(() => reject(new Error("WebRTC playback timed out")), timeoutMs);
    video.addEventListener("playing", () => { clearTimeout(timeout); resolve(); }, { once: true });
    video.play().catch(() => {});
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
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = hlsUrl;
    return video;
  }

  if (window.Hls?.isSupported()) {
    const hls = new window.Hls({
      lowLatencyMode: true,
      backBufferLength: 30
    });
    container.steepleHls = hls;
    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) options.onFatalError?.(data);
    });
    return video;
  }

  throw new Error("This browser cannot play the local HLS stream.");
}

function removeCurrentMedia(container, video) {
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
  const wrapper = document.createElement("div");
  const heading = document.createElement("h1");
  const paragraph = document.createElement("p");
  heading.textContent = title;
  paragraph.textContent = message;
  wrapper.append(heading, paragraph);
  slate.append(wrapper);
  container.append(slate);
}
