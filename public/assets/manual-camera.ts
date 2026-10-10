export interface Velocity {
  pan: number;
  tilt: number;
  zoom: number;
}
const neutral = (): Velocity => ({ pan: 0, tilt: 0, zoom: 0 });
const maximumSpeed = 0.45;
export function deadZone(value: number, threshold = 0.12) {
  if (!Number.isFinite(value) || Math.abs(value) <= threshold) return 0;
  return (Math.sign(value) * (Math.min(Math.abs(value), 1) - threshold)) / (1 - threshold);
}
export function gamepadVelocity(pad: Gamepad): Velocity {
  const scale = pad.buttons[4]?.pressed ? 0.15 : 0.45;
  const stickZoom = deadZone(-(pad.axes[3] || 0));
  return {
    pan: deadZone(pad.axes[0] || 0) * scale,
    tilt: -deadZone(pad.axes[1] || 0) * scale,
    zoom:
      (stickZoom || deadZone((pad.buttons[7]?.value || 0) - (pad.buttons[6]?.value || 0))) * scale,
  };
}

export function gamepadIsNeutral(pad: Gamepad): boolean {
  return (
    deadZone(pad.axes[0] || 0) === 0 &&
    deadZone(pad.axes[1] || 0) === 0 &&
    deadZone(pad.axes[3] || 0) === 0 &&
    deadZone(pad.buttons[6]?.value || 0) === 0 &&
    deadZone(pad.buttons[7]?.value || 0) === 0
  );
}

export function joystickVelocity(dx: number, dy: number, radius: number) {
  const distance = Math.hypot(dx, dy);
  if (!distance || radius <= 0) return { pan: 0, tilt: 0 };
  const speed = deadZone(distance / radius) * maximumSpeed;
  if (!speed) return { pan: 0, tilt: 0 };
  return { pan: (dx / distance) * speed, tilt: (-dy / distance) * speed };
}

export function installManualCamera(csrf: () => string) {
  const host = document.querySelector<HTMLElement>("#manual-camera");
  if (!host) return;
  host.innerHTML = `<div class="manual-camera-toolbar">
    <label><input type="checkbox" id="gamepad-enabled"> Enable gamepad control</label>
    <label><input type="checkbox" id="camera-precision"> Precision</label></div>
    <div class="camera-joysticks">
      <div><div class="control-label">Pan / tilt</div>
        <div class="camera-joystick camera-joystick-pan" role="group" aria-label="Pan and tilt joystick">
          <span class="joystick-origin" aria-hidden="true"></span>
          <span class="joystick-thumb" aria-hidden="true"></span>
        </div></div>
      <div><div class="control-label">Zoom</div>
        <div class="camera-joystick camera-joystick-zoom" role="group" aria-label="Zoom joystick">
          <span class="zoom-direction zoom-in" aria-hidden="true">+</span>
          <span class="zoom-direction zoom-out" aria-hidden="true">−</span>
          <span class="joystick-origin" aria-hidden="true"></span>
          <span class="joystick-thumb" aria-hidden="true"></span>
        </div></div>
    </div>
    <p class="meta">Press anywhere and drag to move. Drag farther for more speed; release to stop.</p>
    <div class="manual-camera-buttons" role="group" aria-label="Manual camera movement">
    <button class="button" data-pan="-0.35" aria-label="Pan left">←</button>
    <button class="button" data-tilt="0.35" aria-label="Tilt up">↑</button>
    <button class="button" data-tilt="-0.35" aria-label="Tilt down">↓</button>
    <button class="button" data-pan="0.35" aria-label="Pan right">→</button>
    <button class="button" data-zoom="-0.3">Zoom −</button>
    <button class="button" data-zoom="0.3">Zoom +</button></div>
    <p class="meta" role="status" id="camera-control-status">Gamepad: left stick to aim, right stick or triggers to zoom, left shoulder for precision. Buttons below the joysticks also support keyboard control.</p>`;
  const enabled = host.querySelector<HTMLInputElement>("#gamepad-enabled")!;
  const precision = host.querySelector<HTMLInputElement>("#camera-precision")!;
  const status = host.querySelector<HTMLElement>("#camera-control-status")!;
  const panPad = host.querySelector<HTMLElement>(".camera-joystick-pan")!;
  const zoomPad = host.querySelector<HTMLElement>(".camera-joystick-zoom")!;
  type Drag = { id: number; x: number; y: number; radius: number };
  const drags = new Map<HTMLElement, Drag>();
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

  const renderJoysticks = () => {
    for (const pad of [panPad, zoomPad]) {
      const drag = drags.get(pad);
      const x = drag?.x ?? pad.clientWidth / 2;
      const y = drag?.y ?? pad.clientHeight / 2;
      const radius = drag?.radius ?? Math.min(panPad.clientWidth, pad.clientHeight) * 0.35;
      const origin = pad.querySelector<HTMLElement>(".joystick-origin")!;
      const thumb = pad.querySelector<HTMLElement>(".joystick-thumb")!;
      origin.style.left = `${x}px`;
      origin.style.top = `${y}px`;
      thumb.style.left = `${x + (pad === panPad ? (current.pan / maximumSpeed) * radius : 0)}px`;
      thumb.style.top = `${y - ((pad === panPad ? current.tilt : current.zoom) / maximumSpeed) * radius}px`;
      pad.dataset.pan = String(pad === panPad ? current.pan : 0);
      pad.dataset.tilt = String(pad === panPad ? current.tilt : 0);
      pad.dataset.zoom = String(pad === zoomPad ? current.zoom : 0);
      pad.classList.toggle(
        "is-moving",
        pad === panPad ? Boolean(current.pan || current.tilt) : Boolean(current.zoom),
      );
    }
  };

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
    drags.clear();
    renderJoysticks();
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
  for (const pad of [panPad, zoomPad]) {
    pad.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || drags.has(pad)) return;
      if (!drags.size) {
        disable();
        session = crypto.randomUUID();
        sequence = 0;
      }
      const rect = pad.getBoundingClientRect();
      drags.set(pad, {
        id: event.pointerId,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        radius: Math.min(panPad.clientWidth, pad.clientHeight) * 0.35,
      });
      pad.setPointerCapture(event.pointerId);
      renderJoysticks();
      event.preventDefault();
    });
    pad.addEventListener("pointermove", (event) => {
      const drag = drags.get(pad);
      if (!drag || drag.id !== event.pointerId) return;
      const rect = pad.getBoundingClientRect();
      const dx = event.clientX - rect.left - drag.x;
      const dy = event.clientY - rect.top - drag.y;
      if (pad === panPad) Object.assign(pointer, joystickVelocity(dx, dy, drag.radius));
      else pointer.zoom = deadZone(-dy / drag.radius) * maximumSpeed;
      event.preventDefault();
    });
    const release = (event: PointerEvent) => {
      if (drags.get(pad)?.id !== event.pointerId) return;
      drags.delete(pad);
      if (pad === panPad) {
        pointer.pan = 0;
        pointer.tilt = 0;
        current.pan = 0;
        current.tilt = 0;
      } else {
        pointer.zoom = 0;
        current.zoom = 0;
      }
      renderJoysticks();
      if (wasMoving) void send({ ...current }, true).catch(() => {});
      wasMoving = Object.values(current).some(Boolean);
    };
    pad.addEventListener("pointerup", release);
    pad.addEventListener("pointercancel", release);
    pad.addEventListener("lostpointercapture", release);
  }
  for (const button of host.querySelectorAll<HTMLButtonElement>(
    "button[data-pan], button[data-tilt], button[data-zoom]",
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
        "Gamepad ready. Left stick: aim. Right stick or triggers: zoom. Left shoulder: precision.";
    }
    if (precision.checked)
      target = { pan: target.pan / 3, tilt: target.tilt / 3, zoom: target.zoom / 3 };
    for (const key of ["pan", "tilt", "zoom"] as const)
      current[key] = target[key] === 0 ? 0 : current[key] + (target[key] - current[key]) * 0.6;
    renderJoysticks();
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
