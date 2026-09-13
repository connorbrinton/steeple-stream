# Player checks

Each pull request runs `Node tests` and three browser checks. Chromium checks
real WebRTC/WHEP and HLS playback through MediaMTX, decoded audio and video,
fallback, network recovery, source cleanup, and WebRTC/HLS rewind transitions.
Chromium, Firefox and WebKit check recording playback, keyboard volume controls,
mute/volume persistence, denied autoplay, unavailable storage, and narrow/wide
layouts. WebKit here is the Linux port, not a substitute for iPhone testing.

The fixture imports the production `public/assets/player.js`, CSS, HLS bundle,
and HTTP media proxy. It does not start the production app or contact cameras,
Google, Cloudflare, or any deployed host. FFmpeg generates a moving test pattern
and 440 Hz tone; MediaMTX publishes AAC/HLS and Opus/WebRTC like the app.
These checks do not cover the GStreamer/NDI ingest pipeline or live hardware.

## Run locally (Linux x86-64)

Install Node 22+, FFmpeg (with libx264 and libopus), and Nix for the existing Node
runtime-resolution test. From the repository root:

```sh
npm ci
npm test
npm ci --prefix e2e
cd e2e
npx playwright install --with-deps
bash install-mediamtx.sh
MEDIAMTX_BINARY="$PWD/artifacts/bin/mediamtx" npm test
```

Ports 4173, 1935, 8554, 8888, 8889, 9997 and UDP 8189 must be free. The test
server owns its child processes and shuts them down after the suite. Tests run
serially within each browser, with no automatic retries to mask timing defects.
Polling assertions wait for readiness/progress rather than fixed sleeps.

## Reviewing a player PR

Download the `player-<browser>` artifact from its Actions run. The HTML report
includes desktop/mobile screenshots even on successful runs, and traces, failure
screenshots, videos, and MediaMTX/FFmpeg logs for diagnosis. Open the downloaded
report using `npx playwright show-report <report-directory>`.

Alternative player implementations should retain `window.SteeplePlayer`'s
public rendering API. If accessible labels differ, adapt the shared test helpers
to equivalent controls, not private component internals. Do not skip transport,
audio, persistence, or recovery assertions to get a candidate green. Autoplay
denial is simulated at the browser media API, followed by a real user click;
this checks rejection handling deterministically without relying on browser
engagement history. Actual media decoding is never mocked.

The browser dependencies have their own lockfile so adding test tools does not
change the production Nix npm dependency hash. Nothing in this workflow deploys
the app, publishes a site, or changes infrastructure.
