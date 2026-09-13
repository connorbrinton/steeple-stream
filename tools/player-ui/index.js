import videojs from 'video.js/core';
import 'video.js/dist/video-js.css';
import './style.css';

window.SteepleComponent = {
  mount(wrapper, video, preference) {
    video.controls = false;
    video.classList.add('video-js');
    const player = videojs(video, {
      controls: true, autoplay: false, preload: 'auto', fluid: false,
      bigPlayButton: false, errorDisplay: false,
      controlBar: {
        volumePanel: { inline: true },
        progressControl: Boolean(video.getAttribute('src')),
        remainingTimeDisplay: false, liveDisplay: false,
        pictureInPictureToggle: true
      }
    });
    player.el().classList.add('component-player');
    player.ready(() => {
      if (player.isDisposed()) return;
      player.volume(preference.volume);
      player.muted(preference.muted);
    });
    return () => player.dispose();
  }
};
