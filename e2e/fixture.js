// The only adapter between browser specs and the production player API.
// Alternative-player PRs should preserve this public API or update this adapter,
// not replace the production player with a special implementation for tests.
const container = document.querySelector('#player');
let mode = new URLSearchParams(location.search).get('mode') || 'recording';
const timeline = new URLSearchParams(location.search).get('timeline') !== 'false';
let generation = 0;
const ready = fetch('/fixture/config').then(response => response.json());
async function render() {
  const { startedAt } = await ready;
  const options = { autoplay: true, controls: false, streamKey: String(generation), timelineStartAt: startedAt, timeline };
  if (mode === 'recording') window.SteeplePlayer.renderRecording(container, `/recording.mp4?stream=${generation}`, options);
  if (mode === 'hls') window.SteeplePlayer.renderHls(container, '/hls/live/index.m3u8', options);
  if (mode === 'webrtc') await window.SteeplePlayer.renderWebRtc(container, '/webrtc/live-webrtc/whep', options);
  if (mode === 'hybrid') window.SteeplePlayer.renderHybridLive(container, {
    hlsUrl: '/hls/live/index.m3u8', webrtcUrl: '/webrtc/live-webrtc/whep',
  }, options);
}
for (const button of document.querySelectorAll('[data-mode]')) button.addEventListener('click', () => {
  mode = button.dataset.mode;
  generation++;
  render();
});
document.querySelector('#next').addEventListener('click', () => { generation++; render(); });
render();
