# Engineering guide

Steeple Stream is a self-hosted camera-control and broadcast application.
Read [README.md](README.md) for runtime architecture and deployment profiles.

## Supported environment and validation

- Use the Nix flake for the supported Node, GStreamer, NDI, and MediaMTX runtime:
  `nix develop` to develop and `nix run` to launch locally.
- Install JavaScript dependencies with `npm ci`.
- Before proposing a change, run `npm run format:check`,
  `npm run lint`, `npm run typecheck`, and `npm test`.
  Use `npm run format` if formatting needs correction.
- Python media/NDI tests run through:
  `nix develop --command python3 -m unittest discover -s tests -p '*test*.py' -v`.
- Browser/media tests are described in [e2e/README.md](e2e/README.md);
  they start their own MediaMTX and synthetic FFmpeg sources.
- GitHub Actions must pass before merging. The browser fixtures do **not**
  exercise the production app server or physical NDI equipment.

## Code boundaries

- `src/` contains the Node backend, SQLite persistence, media orchestration,
  and hardware integration. Keep HTTP routing separate from service behavior;
  new route modules should take explicit dependencies and have HTTP tests.
- `frontend/` contains React screens. New application UI should generally
  use React; `public/assets/` contains older operator and player code being
  migrated incrementally.
- The player manages HLS and WebRTC concurrently and carefully preserves the
  media element across transport changes. Keep transport logic independent
  from the UI framework and retain the browser recovery tests.
- `src/gst_ingest_controller.py` and `src/ndi_ptz.py` interact with the
  media pipeline and camera. Exercise Python tests for changes in these areas.

## Safety and operational invariants

- Camera commands must have bounded movement durations, safe stop behavior,
  and interruption semantics. Never run disruptive hardware tests against
  a live broadcast without explicit operator authorization.
- Offline broadcaster UI may cache its static shell and last-known presets,
  but must **never** cache or replay authenticated API commands, media streams,
  or camera movement requests.
- Protect RTMPS stream keys, OAuth/session secrets, and SOPS plaintext.
  Never log credentials or return them from API responses.
- `STEEPLE_PROFILE=camera-control` is the deployed appliance profile; the
  full `broadcast` profile enables additional functionality. Check both
  capability paths when modifying routing and UI.
- Application `main` is not a production deployment. The separate
  `steeple-stream-deploy` repository pins the app as a flake input;
  merging that repository's `main` lets comin activate a new appliance
  generation. Do not auto-merge production deployment proposals.

## Changing behavior

- Prefer focused PRs that preserve API contracts unless an intentional
  migration is documented.
- Add or adapt automated regression coverage for changed behavior rather
  than deleting tests to make CI green.
- Distinguish simulator/browser validation from real chapel hardware
  verification in PR descriptions.
