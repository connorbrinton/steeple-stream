import { test, expect } from '@playwright/test';
import { video, startPlayback, setLowVolume, expectAudio, expectProgress } from './helpers.js';

test('recordings play with audio enabled at full volume', async ({ page }) => {
  await page.goto('/');
  await startPlayback(page);
  await expectAudio(page, 1, false);
  await expect(page.getByRole('slider', { name: 'Volume', exact: true })).toBeVisible();
});

test('keyboard volume and mute persist across reloads and future streams', async ({ page }) => {
  await page.goto('/');
  await startPlayback(page);
  const volume = await setLowVolume(page);
  await page.getByRole('button', { name: 'Mute audio', exact: true }).click();
  await expectAudio(page, volume, true);
  await page.reload();
  await expectAudio(page, volume, true);
  await page.getByRole('button', { name: 'Next stream', exact: true }).click();
  await expectAudio(page, volume, true);
  await page.getByRole('button', { name: 'Unmute audio', exact: true }).click();
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
    let interacted = false;
    document.addEventListener('click', event => { if (event.isTrusted) interacted = true; }, true);
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      window.playAttempts++;
      return interacted ? play.call(this) : Promise.reject(new DOMException('User gesture required', 'NotAllowedError'));
    };
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /play video/i })).toBeVisible();
  expect(await page.evaluate(() => window.playAttempts)).toBeGreaterThan(0);
  await expectAudio(page, 1, false);
  await page.getByRole('button', { name: /play video/i }).click();
  await expectProgress(page);
  await expect(page.getByRole('button', { name: /play video/i })).toBeHidden();
});

for (const width of [390, 1280]) test(`player controls are usable at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 800 });
  await page.goto('/');
  await startPlayback(page);
  const slider = page.getByRole('slider', { name: 'Volume', exact: true });
  const mute = page.getByRole('button', { name: 'Mute audio', exact: true });
  await expect(slider).toBeVisible();
  await expect(mute).toBeVisible();
  const bounds = await slider.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
  await mute.click();
  await expectAudio(page, 1, true);
  await testInfo.attach(`player-${width}`, { body: await page.screenshot(), contentType: 'image/png' });
});
