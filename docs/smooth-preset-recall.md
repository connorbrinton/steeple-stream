# Experimental synchronized preset recall (Clear Touch RL500)

This feature uses the established NDI manual velocity commands to move the camera and **read-only raw VISCA inquiries** to observe pan, tilt, and zoom positions. It does not send VISCA movement commands, change a camera firmware setting, or overwrite camera-side presets.

## Preparation

1. Open **Admin → Video & Cameras → Camera Diagnostics**.
2. Confirm that the existing capability probe finds **raw VISCA UDP 1259**, with pan/tilt/zoom values (the RL500 did so in testing).
3. In the **Broadcaster** view, with experimental smooth recall **unchecked**, recall one of the usual camera presets. Wait for _all_ axes and zoom to stop.
4. Return to Camera Diagnostics, select the matching preset, and click **Save Current Position**. Repeat for each preset you want to test. This stores the VISCA feedback coordinates in Steeple Stream, not on the camera. **Don't capture during movement.**
5. In the Broadcaster view, check **Experimental smooth preset recall**, then select a _captured_ preset.

The checkbox defaults to **off** on every page load. Unchecked presets still use standard NDI firmware preset recall. Missing captured positions produce a clear error, **not** an unexpected fallback movement.

## Automatic capture of all presets

For a faster setup, open **Admin → Video & Cameras → Camera Diagnostics** and click
**Capture All Presets**. Confirm the warning that the camera will move, then leave
the page open to watch progress or return later; progress is maintained by the
server, not the browser.

- Steeple Stream recalls each existing **camera-side NDI preset in sequence**.
- It samples actual RL500 pan/tilt/zoom position over raw VISCA UDP 1259.
- A preset's position is saved only after the reading remains within a tight
  tolerance for 1.8 seconds, and a final reading confirms it is unchanged.
- If the camera already starts at the first preset, that preset is deferred
  until after another has moved.
- Captured coordinates are saved immediately after each successful preset;
  an interruption retains those completed captures.
- If a camera preset is unresponsive, still moving after 45 seconds, or its
  final position is unverified, the run stops with an error **without saving
  that preset**.
- **Cancel Remaining Captures** prevents further recalls, but does not
  guarantee that the camera stops its current native/firmware preset movement.
- Batch capture is blocked during a live broadcast. Manual movement, individual
  capture, source changes and new preset recalls are blocked while the batch
  is running, except the existing Stop Camera Motion action, which cancels
  further captures.

There is no need to capture each preset manually unless you want to override a
particular saved position or the automatic process cannot confirm it.

## Safety and current limitations

- Test with the camera pointed at a safe, empty area and no audience or active stream. The trajectory model has not been calibrated against the RL500's physical speed response.
- The first version uses an ease-in/out **speed envelope** and slows faster axes to follow the lagging axis. It does **not** guarantee a fixed-duration spline or mathematically exact simultaneous arrival on real motors.
- Pan, tilt, and zoom direction conventions must be verified on hardware. If position feedback moves against the intended direction, motion aborts. The probe alone doesn't verify the movement direction.
- Capture is from the _current_ physical camera position, so ensure the camera reached the actual preset before saving. If camera-side presets are later edited, recapture the corresponding Steeple Stream positions.
- An explicit stop is issued on success, interruption, camera-feedback failure, and timeout. The NDI helper watchdog remains 750 ms for manual movement and is extended to 1500 ms for the experimental automated controller to accommodate delayed position feedback. The default transition timeout is 45 seconds.
- The Broadcaster view provides a **Stop Camera Motion** button. A new preset or manual movement also interrupts an in-flight smooth transition. We never automatically fall back to a firmware recall **after smooth movement has started**, which could otherwise cause an unintended fast movement.
- Feedback is provided by the VISCA UDP 1259 endpoint. If another camera uses a different port, set `STEEPLE_NDI_PTZ_FEEDBACK_PORT` to its raw VISCA port.
- The basic capture/readout path is supported by the current VISCA probe; velocity-control response, physical arrival accuracy, easing and interruption still require RL500 testing before enabling by default.
