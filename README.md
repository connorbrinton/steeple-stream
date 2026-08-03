# Steeple Stream

Steeple Stream is a self-hosted ward/stake broadcast control plane. It keeps
the church-specific workflow in this app and delegates media transport,
recording, playback, and protocol handling to MediaMTX.

## Run Locally

```bash
nix run
```

If the checkout is not a Git repository, or a tool has mounted a placeholder
`.git` directory, force Nix to use the local path fetcher:

```bash
scripts/nix-run-local.sh
```

Then open:

- Viewer: http://localhost:8080/broadcasts/stakecenter
- Operator console: http://localhost:8080/broadcasts/stakecenter/admin
- Health: http://localhost:8080/api/health

State, OAuth sessions, OBS credentials, and playback metrics are stored in
`data/steeple-stream.sqlite`. An existing `steeple-stream.json` is imported once
and preserved as `steeple-stream.json.pre-sqlite`.

For development:

```bash
nix develop
npm start
```

The flake is the authoritative runtime definition. It provides Node, MediaMTX,
GStreamer, the GStreamer plugin set, `gst-plugin-ndi`, and the proprietary NDI
runtime library, then launches the app with the right `PATH`, `GST_PLUGIN_PATH`,
and `LD_LIBRARY_PATH`.

## Media Backend

The default backend adapter targets MediaMTX. Steeple Stream writes a generated
MediaMTX config to `data/mediamtx.yml`. It accepts RTMP, RTSP, SRT, WebRTC, HLS,
and records live broadcasts to `data/recordings`. Offline preview remains
available to authenticated operators without recording. Recording starts with
the broadcast and expires 24 hours after the broadcast start time.

In the normal flake runtime, Steeple Stream starts `mediamtx` from `PATH`.
Fallback runtime modes are retained for development and debugging.

Useful environment variables:

- `STEEPLE_MEDIAMTX_AUTO_START=0` disables managed MediaMTX startup.
- `STEEPLE_MEDIAMTX_RUNTIME=system|auto|binary|nix|download` selects the runtime strategy.
- `STEEPLE_MEDIAMTX_BINARY=/path/to/mediamtx` uses a specific binary.
- `STEEPLE_MEDIAMTX_NIX_PACKAGE=nixpkgs#mediamtx` changes the Nix fallback package reference.
- `STEEPLE_MEDIAMTX_VERSION=v1.19.2` changes the downloaded fallback version.
- `STEEPLE_MEDIAMTX_CACHE_DIR=/path/to/cache` changes where downloaded fallback binaries are stored.

`docker-compose.yml` is retained only as an optional development convenience.


## Ingest and Playback

NDI is one supported ingest adapter, not a requirement of the media core.
RTSP and SRT network sources can also be selected in the admin interface.
MediaMTX does not ingest NDI directly, so Steeple Stream starts a managed
GStreamer adapter when the saved source is an NDI stream.

NDI discovery runs continuously in the backend. The admin source picker reads
from the in-memory cache immediately and asks the discovery service to refresh
optimistically in the background. Ingest startup also uses the cached discovery
state to refresh stale direct NDI addresses without persisting transient address
changes to SQLite.

The bridge:

- runs a single GStreamer compositor process from the flake-provided environment
- receives NDI audio and video
- switches between the live feed and sacrament slate without restarting output
- publishes synchronized H.264/AAC over RTMP for HLS/recording
- publishes H.264/Opus over RTSP for direct WebRTC playback
- reports structured media-engine state for input readiness, output publishing,
  scene transitions, heartbeats, and pipeline errors

Viewers attempt WebRTC first and fall back to low-latency HLS after eight
seconds. Only free STUN discovery is configured; there is no TURN relay.
Playback sessions record the selected ICE candidate type, HLS fallbacks,
startup time, buffering, duration, viewer name, UUID, IP, and user agent.
Detailed sessions are aggregated and removed after 90 days.

The GStreamer plugin still requires the proprietary NDI runtime library at
runtime. The flake wrapper provides `nixpkgs#ndi` and adds its `lib` directory
automatically.

If you need to use a local SDK install instead, set:

```bash
STEEPLE_NDI_RUNTIME_DIR=/path/to/ndi/lib
```

The admin Health panel shows ingest status. Saving a different source in the
admin UI restarts the bridge automatically.

Useful environment variables:

- `STEEPLE_INGEST_RUNTIME=system|nix` selects the ingest runtime strategy.
- `STEEPLE_GST_LAUNCH_BINARY=/path/to/gst-launch-1.0` uses a specific GStreamer launcher.
- `STEEPLE_NDI_RUNTIME_DIR=/path/to/ndi/lib` adds a local NDI SDK runtime directory.
- `STEEPLE_NDI_NIX_PACKAGE=nixpkgs#ndi-6` changes the package used by the explicit Nix fallback.
- `STEEPLE_NDI_DISCOVERY_INTERVAL_MS=7000` changes the backend NDI discovery polling interval.

For manual debugging, the same bridge can be run with:

```bash
bash scripts/ndi-to-mediamtx.sh "CHAPEL CAMERA (Chapel Camera, 192.168.110.145)"
```

To create a synthetic NDI source with moving video and stereo audio:

```bash
nix develop
npm run ndi:synthetic
```

To verify a source independently of the compositor and MediaMTX:

```bash
npm run ndi:probe -- 'HOST (Source name)' --url-address HOST:PORT
```

Then the admin preview should play:

```text
http://localhost:8888/stakecenter/index.m3u8
```

Useful checks:

```bash
nix build .#gst-plugin-ndi
GST_PLUGIN_PATH=$(readlink -f result)/lib/gstreamer-1.0 \
  nix shell nixpkgs#gst_all_1.gstreamer nixpkgs#gst_all_1.gst-plugins-base \
    --command gst-inspect-1.0 ndisrc
```

## Current Scope

Implemented:

- Viewer page with first-visit name prompt.
- Location-scoped operator console for start, chapel, sacrament, end, source configuration, PTZ preset recall, and retention cleanup.
- Structured media-engine boundary between the Node control plane and the
  managed GStreamer compositor.
- NDI source selection model with audio and video always paired.
- SQLite-backed control API with Google sign-in for operators and administrators.
- Unit-specific authenticated OBS WebSocket v5 endpoints on separate ports.
- MediaMTX-oriented backend interface and default configuration.
- Live-only recording, recorded MP4 replay, physical 24-hour retention, and audit log.
- NDI camera preset recall with last app-recalled preset highlighting.

## PTZ Control

Steeple Stream defaults to recalling the camera's read-only NDI presets:

```bash
STEEPLE_PTZ_TRANSPORT=ndi
```

The NDI preset mapping is:

- Full Stand: NDI preset 1
- Pulpit: NDI preset 2
- Music Director: NDI preset 8
- Choir: NDI preset 12
- Piano: NDI preset 13
- Pulpit Wide: NDI preset 16

Steeple Stream does not store or overwrite NDI presets. Those presets are
treated as camera-owned configuration that should remain as installed by the AV
company.

Steeple Stream can also recall camera presets over VISCA-over-UDP:

```bash
STEEPLE_PTZ_TRANSPORT=visca-udp
```

By default, it infers the camera host from the selected NDI source name if it
contains an IP address, such as `CHAPEL CAMERA (..., 192.168.110.145)`. To set
the host explicitly:

```bash
STEEPLE_PTZ_HOST=192.168.110.145
STEEPLE_PTZ_PORT=52381
```

The VISCA fallback preset mapping is:

- Full Stand: VISCA memory 1
- Pulpit: VISCA memory 2
- Music Director: VISCA memory 8
- Choir: VISCA memory 12
- Piano: VISCA memory 13
- Pulpit Wide: VISCA memory 16

Next hardware-facing work:

- Use the administrator `Set` controls to capture RL500 absolute positions and
  verify its position-inquiry behavior; unsupported firmware automatically
  falls back to camera memory presets.
- Validate direct WebRTC success rates and transport metrics on church WiFi.

## Production Authentication

Google OAuth is optional only for loopback development. A non-loopback bind is
rejected unless these values are configured:

```bash
STEEPLE_PUBLIC_BASE_URL=https://apexstake.org
STEEPLE_GOOGLE_CLIENT_ID=...
STEEPLE_GOOGLE_CLIENT_SECRET=...
STEEPLE_ADMIN_EMAILS=admin@example.com
STEEPLE_OPERATOR_EMAILS=operator@example.com
STEEPLE_SESSION_SECRET=replace-with-a-long-random-secret
```

Register `${STEEPLE_PUBLIC_BASE_URL}/auth/google/callback` as the Google OAuth
redirect URI. Cloudflare Tunnel or another HTTPS reverse proxy should route the
location to the loopback-bound application. The NixOS module is available as
`nixosModules.default` and accepts an environment file for secrets.

For the first Cloudflare Tunnel deployment, use HLS for public viewers:

```bash
STEEPLE_PUBLIC_BASE_URL=https://broadcasts.brintonium.com
STEEPLE_PUBLIC_WEBRTC=0
```

See [docs/cloudflare-tunnel.md](docs/cloudflare-tunnel.md) for the recommended
`brintonium.com` tunnel shape and deployment checklist. The flake exposes
`cloudflared` as `nix run .#cloudflared -- ...`, and the NixOS module can
manage the Cloudflare Tunnel service with
`services.steeple-stream.cloudflareTunnel`.
