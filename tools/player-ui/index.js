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
    const bar = document.createElement('media-control-bar');
    bar.innerHTML = '<media-play-button></media-play-button><media-mute-button></media-mute-button><media-volume-range></media-volume-range><span class="control-spacer"></span><media-pip-button></media-pip-button><media-fullscreen-button></media-fullscreen-button>';
    if (video.getAttribute('src') && !wrapper.querySelector('.live-controls')) {
      const timeline = document.createElement('media-time-range');
      timeline.slot = 'top-chrome';
      controller.append(timeline);
    }
    controller.append(bar);
    return () => controller.remove();
  }
};
