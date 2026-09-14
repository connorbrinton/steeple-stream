import { expect } from '@playwright/test';

export const video = page => page.locator('#player video');
export async function expectProgress(page) {
  const initial = await video(page).evaluate(element => element.currentTime);
  await expect.poll(() => video(page).evaluate(element => element.currentTime), { timeout: 20_000 }).toBeGreaterThan(initial + 0.3);
}
export async function startPlayback(page) {
  await expect.poll(() => video(page).evaluate(element => element.readyState)).toBeGreaterThanOrEqual(2);
  if (await video(page).evaluate(element => element.paused)) {
    await page.locator('.playback-status').getByRole('button', { name: /play video/i }).click();
  }
  await expectProgress(page);
  await page.locator('#player').hover();
  await page.locator('media-mute-button').focus();
}
export async function setLowVolume(page) {
  await page.locator('#player').hover();
  const slider = page.getByRole('slider', { name: /volume/i });
  await slider.focus();
  await slider.press('ArrowLeft');
  await expect.poll(() => video(page).evaluate(element => element.volume > 0 && element.volume < 1)).toBe(true);
  const volume = await video(page).evaluate(element => element.volume);
  expect(volume).toBeLessThan(1);
  return volume;
}
export async function expectAudio(page, volume, muted) {
  await expect.poll(() => video(page).evaluate(element => ({ volume: element.volume, muted: element.muted })))
    .toEqual({ volume, muted });
}
export async function observePeers(page) {
  await page.addInitScript(() => {
    window.testPeers = [];
    const Peer = window.RTCPeerConnection;
    window.RTCPeerConnection = class extends Peer {
      constructor(...args) { super(...args); window.testPeers.push(this); }
    };
  });
}
export async function expectWebRtcMedia(page) {
  await expect.poll(() => page.evaluate(async () => {
    const peer = window.testPeers.at(-1);
    if (!peer || peer.connectionState === 'closed') return false;
    const stats = [...(await peer.getStats()).values()];
    return stats.some(item => item.type === 'inbound-rtp' && item.kind === 'video' && item.framesDecoded > 0)
      && stats.some(item => item.type === 'inbound-rtp' && item.kind === 'audio' && item.totalAudioEnergy > 0);
  }), { timeout: 20_000 }).toBe(true);
}
