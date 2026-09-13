import 'media-chrome';
import './style.css';

window.SteepleComponent = {
  mount(wrapper, video, preference) {
    const controller = document.createElement('media-controller');
    controller.className = 'component-player';
    controller.setAttribute('default-volume', String(preference.volume));
    video.controls = false;
    video.slot = 'media';
    video.before(controller);
    controller.append(video);
    const listeners = new AbortController();
    const bar = document.createElement('media-control-bar');
    bar.innerHTML = '<media-play-button></media-play-button><media-mute-button></media-mute-button><media-volume-range></media-volume-range><span class="control-spacer"></span><media-pip-button></media-pip-button><media-fullscreen-button></media-fullscreen-button>';
    // Firefox interprets step="any" as a whole-unit keyboard increment on
    // this 0..1 range. Give the underlying HTML range a consistent 5% step.
    bar.querySelector('media-volume-range').range.step = '0.05';
    if (video.getAttribute('src') && !wrapper.querySelector('.live-controls')) {
      const timeline = document.createElement('media-time-range');
      const updateStep = () => {
        if (Number.isFinite(video.duration) && video.duration > 0) timeline.range.step = String(Math.min(1, 5 / video.duration));
      };
      video.addEventListener('durationchange', updateStep, { signal: listeners.signal });
      updateStep();
      timeline.slot = 'top-chrome';
      controller.append(timeline);
    }
    controller.append(bar);
    return () => { listeners.abort(); controller.remove(); };
  }
};
