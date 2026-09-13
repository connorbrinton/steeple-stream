# vidstack experiment

This branch replaces the handmade mute/volume UI with vidstack controls on
recordings, camera previews, and broadcasts. It is an alternative to the other
player experiment branches; merge only the selected implementation.

Steeple keeps WHEP negotiation, HLS.js, recovery, persisted volume/mute, and the
WebRTC-to-HLS DVR timeline. The component owns ordinary media controls. Autoplay
is still requested, with Steeple's Play button when the browser blocks it.

The native video element remains the transport integration point. UI instances
are disposed when streams change. Existing audio preferences are reused.

## Build

`npm ci --prefix tools/player-ui`
`npm run build --prefix tools/player-ui`

Commit the generated `public/vendor/player-ui*` assets with source changes.
CI rebuilds and checks them for drift. Component dependencies are isolated from
the production npm lockfile and Nix dependency hash. No runtime CDN is required.

## Review

Use the shared browser reports and 390px/1280px screenshots from this PR's CI.
The component can be exercised locally using the fixture described in
`e2e/README.md`. Verify fullscreen/PiP on real devices before choosing a player;
headless tests cannot establish iPhone behavior. No deployment is part of this PR.
