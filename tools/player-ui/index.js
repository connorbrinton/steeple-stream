import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/player/layouts/default';
import { MediaProviderElement } from 'vidstack/elements';
import { VideoProviderLoader } from 'vidstack';
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/video.css';
import './style.css';

// Reuse Vidstack's HTML video adapter, while Steeple owns src/srcObject,
// WHEP sessions, HLS recovery, and WebRTC/DVR switching.
class SteepleProviderElement extends MediaProviderElement {
  onConnect() { this.load(this.querySelector('video')); }
}
customElements.define('media-steeple-provider', SteepleProviderElement);

window.SteepleComponent = {
  mount(wrapper, video, preference) {
    video.controls = false;
    const player = document.createElement('media-player');
    player.className = 'component-player';
    player.setAttribute('view-type', 'video');
    player.setAttribute('load', 'eager');
    player.setAttribute('playsinline', '');
    player.setAttribute('volume', String(preference.volume));
    if (preference.muted) player.setAttribute('muted', '');
    player.storage = null;
    video.steepleUiReady = new Promise(resolve => {
      player.addEventListener('provider-setup', resolve, { once: true });
    });
    player.src = { src: 'steeple:external', type: 'video/steeple' };
    const provider = document.createElement('media-steeple-provider');
    const loader = new VideoProviderLoader();
    loader.canPlay = src => src.type === 'video/steeple';
    const load = loader.load.bind(loader);
    loader.load = async ctx => {
      const adapter = await load(ctx);
      adapter.loadSource = async source => { adapter.currentSrc = source; };
      return adapter;
    };
    provider.loaders = [loader];
    video.before(player);
    provider.append(video);
    const layout = document.createElement('media-video-layout');
    layout.setAttribute('small-when', 'never');
    player.append(provider, layout);
    return () => { player.destroy(); player.remove(); };
  }
};
