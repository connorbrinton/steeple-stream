import 'media-chrome';
import { createMediaStore } from 'media-chrome/media-store/media-store';
import './style.css';

const timeLabel = seconds => {
  const value = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(value / 3600);
  return (hours ? hours + ':' : '') + String(Math.floor(value / 60) % 60).padStart(hours ? 2 : 1, '0') + ':' + String(value % 60).padStart(2, '0');
};

window.SteepleComponent = {
  mount(wrapper: HTMLElement, video: HTMLVideoElement) {
    const timeline = video.steepleTimeline, live = video.steepleIsLive;
    const controller = document.createElement('media-controller');
    controller.className = 'component-player';
    for (const attr of ['noautohide', 'gesturesdisabled', 'nodefaultstore']) controller.setAttribute(attr, '');
    controller.fullscreenElement = wrapper;
    video.controls = false;
    video.slot = 'media';
    video.before(controller);
    controller.append(video);
    const listeners = new AbortController();
    const listen = (element: any, type: string, callback: any, options: any = {}) => element.addEventListener(type, callback, { ...options, signal: listeners.signal });
    const bar = document.createElement('media-control-bar');
    bar.className = 'player-bar';
    bar.innerHTML = '<media-play-button class="desktop-play"></media-play-button><div class="player-volume"><media-mute-button></media-mute-button><media-volume-range></media-volume-range></div><span class="player-time"></span><media-time-range aria-label="Seek"></media-time-range><button class="player-live" type="button">Live</button><div class="player-actions"><media-captions-button></media-captions-button><media-pip-button></media-pip-button><media-fullscreen-button></media-fullscreen-button></div>';
    const center = document.createElement('media-play-button');
    center.className = 'touch-play';
    center.slot = 'centered-chrome';
    const top = document.createElement('div');
    top.className = 'player-top';
    top.slot = 'top-chrome';
    const position = bar.querySelector('.player-time'), range = bar.querySelector('media-time-range');
    const liveButton = bar.querySelector('.player-live'), actions = bar.querySelector('.player-actions');
    bar.querySelector('media-volume-range').range.step = '0.05';
    range.hidden = live && !timeline;
    liveButton.hidden = !live || !timeline;
    liveButton.disabled = !timeline;
    listen(liveButton, 'click', () => timeline?.goLive());
    controller.append(top, center, bar);
    for (const element of [top, center, bar]) element.setAttribute('noautohide', '');
    let dragging = false, pendingSeek = null, touch = matchMedia('(pointer: coarse)').matches, hideTimer;
    const nativeStore = createMediaStore({ media: video, fullscreenElement: wrapper, documentElement: document,
      options: { noAutoSeekToLive: true, noVolumePref: true, noMutedPref: true } });
    const subscribers = new Set<(state: any) => void>();
    const project = () => {
      const native = nativeStore.getState();
      if (!timeline) return native;
      const state = timeline.getState();
      return { ...native, mediaCurrentTime: pendingSeek ?? state.current, mediaDuration: state.end,
        mediaSeekable: [state.start, state.end], mediaBuffered: [], mediaStreamType: 'live',
        mediaTimeIsLive: state.live, mediaLoading: native.mediaLoading || state.busy };
    };
    const render = () => {
      const state = project(), broadcast = timeline?.getState(), current = state.mediaCurrentTime || 0;
      actions.querySelector('media-captions-button').hidden = !state.mediaSubtitlesList?.length;
      position.textContent = live ? (timeline ? timeLabel(current) : '') : timeLabel(current) + ' / ' + timeLabel(state.mediaDuration);
      if (broadcast) {
        range.toggleAttribute('disabled', !broadcast.available);
        range.title = broadcast.available ? 'Available from ' + timeLabel(broadcast.start) + ' after meeting start' : 'Rewind history is not available yet';
        liveButton.textContent = broadcast.live ? 'Live' : 'Back to live';
        liveButton.setAttribute('aria-label', liveButton.textContent);
        liveButton.dataset.live = String(broadcast.live);
      }
      const duration = (state.mediaDuration || 0) - (broadcast?.start || 0);
      if (duration > 0) range.range.step = String(Math.min(1, 5 / duration));
      controller.toggleAttribute('data-paused', Boolean(state.mediaPaused));
      if (!dragging) for (const callback of subscribers) callback(state);
    };
    const seek = time => timeline ? timeline.seek(time) : nativeStore.dispatch({ type: 'mediaseekrequest', detail: time });
    controller.mediaStore = {
      getState: project,
      subscribe(callback) { subscribers.add(callback); callback(project()); return () => subscribers.delete(callback); },
      dispatch(event) {
        if (event.type === 'mediaseekrequest') {
          if (dragging) pendingSeek = event.detail;
          else seek(event.detail);
          return;
        }
        if (timeline && event.type === 'mediaseektoliverequest') return timeline.goLive();
        nativeStore.dispatch(event);
      }
    };
    const unsubscribeNative = nativeStore.subscribe(render);
    const unsubscribeTimeline = timeline?.subscribe(render);
    const reveal = () => {
      controller.removeAttribute('data-hidden');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!dragging && !video.paused && !controller.matches(':focus-within')) controller.setAttribute('data-hidden', '');
      }, 3000);
    };
    const setTouch = value => {
      touch = value;
      controller.toggleAttribute('data-touch', value);
      const parent = value ? top : bar;
      if (actions.parentElement !== parent) parent.append(actions);
      reveal();
    };
    setTouch(touch);
    listen(controller, 'pointerdown', event => { setTouch(event.pointerType === 'touch' || event.pointerType === 'pen'); reveal(); }, { capture: true });
    listen(controller, 'pointermove', event => {
      if (event.pointerType === 'mouse') { if (touch) setTouch(false); reveal(); }
    });
    listen(video, 'click', () => { if (!touch) video.paused ? video.play().catch(() => {}) : video.pause(); });
    listen(controller, 'focusin', reveal);
    listen(controller, 'focusout', reveal);
    listen(video, 'pause', reveal);
    listen(video, 'playing', reveal);
    listen(range, 'pointerdown', () => { dragging = true; pendingSeek = null; reveal(); }, { capture: true });
    const finishSeek = () => {
      if (!dragging) return;
      dragging = false;
      const target = pendingSeek;
      pendingSeek = null;
      if (target !== null) seek(target);
      render();
      reveal();
    };
    listen(window, 'pointerup', finishSeek);
    listen(window, 'pointercancel', () => { pendingSeek = null; finishSeek(); });
    render();
    return () => {
      clearTimeout(hideTimer);
      listeners.abort();
      unsubscribeTimeline?.();
      unsubscribeNative();
      controller.remove();
      subscribers.clear();
    };
  }
};
