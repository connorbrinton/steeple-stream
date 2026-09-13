import { test, expect } from '@playwright/test';
import { video, startPlayback, setLowVolume, expectAudio, expectProgress } from './helpers.js';

test('recordings play with audio enabled at full volume', async ({ page }) => {
  await page.goto('/');
  await startPlayback(page);
  await expectAudio(page, 1, false);
  await expect(page.getByRole('slider', { name: /volume/i })).toBeVisible();
});

test('component controls pause, seek, and resume a recording', async ({ page }) => {
  await page.goto('/');
  await startPlayback(page);
  // Vidstack uses a Play toggle with aria-pressed for both play and pause.
  await page.locator('media-play-button').click();
  await expect.poll(() => video(page).evaluate(element => element.paused)).toBe(true);
  const initial = await video(page).evaluate(element => element.currentTime);
  const seek = page.getByRole('slider', { name: /^(seek|progress bar)$/i });
  await seek.focus();
  await seek.press('ArrowRight');
  await expect.poll(() => video(page).evaluate(element => element.currentTime)).toBeGreaterThan(initial + 1);
  await page.locator('media-play-button').click();
  await expectProgress(page);
});

test('keyboard volume and mute persist across reloads and future streams', async ({ page }) => {
  await page.goto('/');
  await startPlayback(page);
  const volume = await setLowVolume(page);
  await page.getByRole('button', { name: /^mute(?: audio)?$/i }).click();
  await expectAudio(page, volume, true);
  await page.reload();
  await expectAudio(page, volume, true);
  await page.getByRole('button', { name: 'Next stream', exact: true }).click();
  await expectAudio(page, volume, true);
  await page.getByRole('button', { name: /^unmute(?: audio)?$/i }).click();
  await expectAudio(page, volume, false);
});

test('unavailable local storage does not break playback or volume controls', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
  });
  await page.goto('/');
  await startPlayback(page);
  const volume = await setLowVolume(page);
  await page.getByRole('button', { name: 'Next stream', exact: true }).click();
  await expectAudio(page, volume, false);
});

test('autoplay is requested; rejection leaves a working user-initiated Play button', async ({ page }) => {
  await page.addInitScript(() => {
    window.playAttempts = 0;
    // Native attribute autoplay bypasses the JS play() method. Disable that
    // path too so this test consistently models a browser denying autoplay.
    const autoplay = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'autoplay');
    Object.defineProperty(HTMLMediaElement.prototype, 'autoplay', {
      configurable: true,
      get: autoplay.get,
      set() { autoplay.set.call(this, false); },
    });
    let interacted = false;
    document.addEventListener('click', event => { if (event.isTrusted) interacted = true; }, true);
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.playAttempts++;
      return interacted ? play.call(this) : Promise.reject(new DOMException('User gesture required', 'NotAllowedError'));
    };
  });
  await page.goto('/');
  await expect(page.locator('.playback-status').getByRole('button', { name: /play video/i })).toBeVisible();
  expect(await page.evaluate(() => window.playAttempts)).toBeGreaterThan(0);
  await expectAudio(page, 1, false);
  await page.locator('.playback-status').getByRole('button', { name: /play video/i }).click();
  await expectProgress(page);
  await expect(page.locator('.playback-status').getByRole('button', { name: /play video/i })).toBeHidden();
});

for (const width of [390, 1280]) test(`player controls are usable at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 800 });
  await page.goto('/');
  await startPlayback(page);
  const slider = page.getByRole('slider', { name: /volume/i });
  const mute = page.getByRole('button', { name: /^mute(?: audio)?$/i });
  await expect(slider).toBeVisible();
  await expect(mute).toBeVisible();
  const bounds = await slider.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
  await mute.click();
  await expectAudio(page, 1, true);
  await testInfo.attach(`player-${width}`, { body: await page.screenshot({ animations: 'disabled' }), contentType: 'image/png' });
});
