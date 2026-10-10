export interface Velocity {
  pan: number;
  tilt: number;
  zoom: number;
}
const neutral = (): Velocity => ({ pan: 0, tilt: 0, zoom: 0 });
export function deadZone(value: number, threshold = 0.12) {
  if (!Number.isFinite(value) || Math.abs(value) <= threshold) return 0;
  return (Math.sign(value) * (Math.min(Math.abs(value), 1) - threshold)) / (1 - threshold);
}
export function gamepadVelocity(pad: Gamepad): Velocity {
  const scale = pad.buttons[4]?.pressed ? 0.15 : 0.45;
  return {
    pan: deadZone(pad.axes[0] || 0) * scale,
    tilt: -deadZone(pad.axes[1] || 0) * scale,
    zoom: deadZone((pad.buttons[7]?.value || 0) - (pad.buttons[6]?.value || 0)) * scale,
  };
}

export function gamepadIsNeutral(pad: Gamepad): boolean {
  return (
    deadZone(pad.axes[0] || 0) === 0 &&
    deadZone(pad.axes[1] || 0) === 0 &&
    deadZone(pad.buttons[6]?.value || 0) === 0 &&
    deadZone(pad.buttons[7]?.value || 0) === 0
  );
}

export function installManualCamera(csrf: () => string) {
  const host = document.querySelector<HTMLElement>("#manual-camera");
  if (!host) return;
  host.innerHTML = `<div class="manual-camera-toolbar">
    <label><input type="checkbox" id="gamepad-enabled"> Enable gamepad control</label>
    <label><input type="checkbox" id="camera-precision"> Precision</label></div>
    <div class="manual-camera-buttons" role="group" aria-label="Manual camera movement">
    <button class="button" data-pan="-0.35" aria-label="Pan left">←</button>
    <button class="button" data-tilt="0.35" aria-label="Tilt up">↑</button>
    <button class="button" data-tilt="-0.35" aria-label="Tilt down">↓</button>
    <button class="button" data-pan="0.35" aria-label="Pan right">→</button>
    <button class="button" data-zoom="-0.3">Zoom −</button>
    <button class="button" data-zoom="0.3">Zoom +</button></div>
    <p class="meta" role="status" id="camera-control-status">Hold a movement button. Gamepad: left stick to aim, triggers to zoom, left shoulder for precision.</p>`;
  const enabled = host.querySelector<HTMLInputElement>("#gamepad-enabled")!;
  const precision = host.querySelector<HTMLInputElement>("#camera-precision")!;
  const status = host.querySelector<HTMLElement>("#camera-control-status")!;
  let session = crypto.randomUUID();
  let pointer = neutral();
  let current = neutral();
  let armed = false;
  let inFlight = false;
  let wasMoving = false;
  let lastSent = 0;
  let activePad: number | null = null;
  let epoch = 0;
  let sequence = 0;

  const send = async (velocity: Velocity, keepalive = false) => {
    const response = await fetch("/api/ptz/move", {
      method: "POST",
      keepalive,
      headers: { "content-type": "application/json", "x-steeple-csrf": csrf() },
      body: JSON.stringify({ ...velocity, session, sequence: sequence++ }),
    });
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.error || "Camera movement failed");
    }
  };
  const stop = () => {
    epoch++;
    pointer = neutral();
    current = neutral();
    armed = false;
    if (wasMoving) void send(neutral(), true).catch(() => {});
    wasMoving = false;
  };
  const disable = () => {
    stop();
    enabled.checked = false;
    activePad = null;
  };
  enabled.addEventListener("change", () => {
    stop();
    session = crypto.randomUUID();
    sequence = 0;
  });
  window.addEventListener("blur", disable);
  window.addEventListener("pagehide", disable);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) disable();
  });
  window.addEventListener("gamepaddisconnected", disable);
  window.addEventListener("camera-source-changed", disable);
  document.querySelector("#ptz-controls")?.addEventListener("click", disable, true);
  for (const button of host.querySelectorAll<HTMLButtonElement>(
    "[data-pan], [data-tilt], [data-zoom]",
  )) {
    const begin = () => {
      stop();
      enabled.checked = false;
      session = crypto.randomUUID();
      sequence = 0;
      pointer = {
        pan: Number(button.dataset.pan || 0),
        tilt: Number(button.dataset.tilt || 0),
        zoom: Number(button.dataset.zoom || 0),
      };
    };
    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      button.setPointerCapture(event.pointerId);
      begin();
      event.preventDefault();
    });
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("lostpointercapture", stop);
    button.addEventListener("keydown", (event) => {
      if ((event.key === " " || event.key === "Enter") && !event.repeat) {
        begin();
        event.preventDefault();
      }
    });
    button.addEventListener("keyup", stop);
  }
  setInterval(() => {
    if (document.hidden || !document.hasFocus()) return;
    let target = pointer;
    if (enabled.checked) {
      const pads = navigator.getGamepads?.() || [];
      const pad =
        activePad === null
          ? Array.from(pads).find((entry) => entry?.mapping === "standard")
          : pads[activePad];
      if (!pad || pad.mapping !== "standard") {
        stop();
        activePad = null;
        status.textContent = "Connect a gamepad and press a button to make it available.";
        return;
      }
      activePad = pad.index;
      target = gamepadVelocity(pad);
      if (!armed) {
        if (!gamepadIsNeutral(pad)) {
          status.textContent = "Release sticks and triggers to enable control.";
          return;
        }
        armed = true;
      }
      status.textContent =
        "Gamepad ready. Left stick: aim. Triggers: zoom. Left shoulder: precision.";
    }
    if (precision.checked)
      target = { pan: target.pan / 3, tilt: target.tilt / 3, zoom: target.zoom / 3 };
    for (const key of ["pan", "tilt", "zoom"] as const)
      current[key] = target[key] === 0 ? 0 : current[key] + (target[key] - current[key]) * 0.6;
    const moving = Object.values(current).some(Boolean);
    if (!moving && !wasMoving) return;
    if (inFlight || Date.now() - lastSent < 100) return;
    inFlight = true;
    wasMoving = moving;
    lastSent = Date.now();
    const sentEpoch = epoch;
    void send({ ...current })
      .catch((error: unknown) => {
        if (sentEpoch !== epoch) return;
        disable();
        status.textContent = error instanceof Error ? error.message : "Camera connection lost";
      })
      .finally(() => {
        inFlight = false;
      });
  }, 50);
}
