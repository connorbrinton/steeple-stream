// Loaded before the app bundle: the Play affordance exists even while the
// session and transport requests are still pending.
(() => {
  const frame = document.querySelector("#admin-preview");
  const video = frame?.querySelector(".preview-preplay-video");
  const overlay = document.querySelector("#preview-start");
  const button = document.querySelector("#preview-play");
  const message = document.querySelector("#preview-play-message");
  if (!frame || !video || !button || !overlay || !message) return;

  // The player reuses this element for HLS, WebRTC, and any later fallback.
  frame.steepleVideo = video;
  let requested = false;
  const tryPlay = () => {
    const promise = video.play();
    promise?.catch(() => {
      // A browser can reject play() before a source has been assigned. The
      // normal player will retry after media becomes available.
    });
  };
  button.addEventListener("click", () => {
    requested = true;
    message.textContent = "Connecting to camera…";
    // Invoke play() synchronously inside the user gesture, *before* awaiting
    // any backend requests or media negotiation.
    tryPlay();
  });

  window.SteepleEarlyPlay = {
    get requested() {
      return requested;
    },
    playing() {
      overlay.hidden = true;
    },
    blocked() {
      overlay.hidden = false;
      button.textContent = "Play camera preview";
      message.textContent = "Tap to start audio and video.";
    },
    waiting() {
      if (requested) message.textContent = "Connecting to camera…";
    },
  };
})();
