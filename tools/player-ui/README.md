# Media Chrome player controls

Media Chrome supplies the accessible player controls while Steeple owns WHEP,
HLS.js, recovery, autoplay fallback, and saved volume/mute preferences.

Desktop and fine-pointer input uses one conventional control row: play/pause,
mute and an expanding volume control, time, seek, Live status, PiP, and
fullscreen. Touch input moves play/pause to the center of the video, moves
presentation actions to the upper right, and leaves time and seeking at the
bottom. The most recently used pointer type selects the layout, so hybrid
devices can move between them.

For live broadcasts, the Media Chrome timeline represents meeting-relative
time. Steeple reads dated segments from the HLS playlist to identify the real
available rewind window. Seeking switches playback to HLS; Back to live returns
to WebRTC when available. The same video element and control surface remain in
place through the switch.

## Build

`npm ci --prefix tools/player-ui`
`npm run build --prefix tools/player-ui`

Commit the generated `public/vendor/player-ui*` assets with source changes. CI
rebuilds them and checks for drift. Dependencies remain isolated from the
production npm lockfile and Nix dependency hash. No runtime CDN is required.

## Review

CI exercises desktop and touch interaction, source switching, live rewind,
returning to WebRTC, volume persistence, and autoplay fallback. Its reports
include screenshots at 390px and 1280px. Fullscreen, PiP, iPhone system volume,
and autoplay eligibility still require real-device checks.
