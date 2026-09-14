import { test, expect } from '@playwright/test';
import { video } from './helpers.js';

test.use({ hasTouch: true, viewport: { width: 390, height: 800 } });

test('touch overlays center playback, place actions at the top, and seek at the bottom', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect.poll(() => video(page).evaluate(v => v.readyState)).toBeGreaterThanOrEqual(2);
  if (await video(page).evaluate(v => v.paused)) await page.locator('.playback-status button').tap();
  await video(page).tap({ position: { x: 20, y: 60 } });
  const controller = page.locator('media-controller');
  await expect(controller).toHaveAttribute('data-touch', '');
  await expect(page.locator('.desktop-play')).toBeHidden();
  await expect(page.locator('.player-volume')).toBeHidden();
  const center = page.locator('.touch-play');
  await expect(center).toBeVisible();
  await center.tap();
  await expect.poll(() => video(page).evaluate(v => v.paused)).toBe(true);
  const bounds = await video(page).boundingBox();
  const play = await center.boundingBox();
  expect(Math.abs(play.x + play.width / 2 - bounds.x - bounds.width / 2)).toBeLessThan(3);
  expect(Math.abs(play.y + play.height / 2 - bounds.y - bounds.height / 2)).toBeLessThan(3);
  const actions = await page.locator('.player-actions').boundingBox();
  const seek = page.getByRole('slider', { name: /^seek$/i });
  const rail = await seek.boundingBox();
  expect(actions.y).toBeLessThan(play.y);
  expect(rail.y).toBeGreaterThan(play.y);
  expect(actions.x + actions.width).toBeLessThanOrEqual(390);
  await seek.tap({ position: { x: rail.width * 0.65, y: rail.height / 2 } });
  await expect.poll(() => video(page).evaluate(v => v.currentTime)).toBeGreaterThan(5);
  await expect(controller).toHaveAttribute('data-touch', '');
  await testInfo.attach('touch-recording', { body: await page.screenshot(), contentType: 'image/png' });
});

test('tapping hidden video reveals the overlay without pausing playback', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => video(page).evaluate(v => v.readyState)).toBeGreaterThanOrEqual(2);
  if (await video(page).evaluate(v => v.paused)) await page.locator('.playback-status button').tap();
  await page.evaluate(() => document.activeElement?.blur());
  await expect(page.locator('media-controller')).toHaveAttribute('data-hidden', '', { timeout: 6000 });
  await video(page).tap({ position: { x: 20, y: 60 } });
  await expect(page.locator('media-controller')).not.toHaveAttribute('data-hidden', '');
  expect(await video(page).evaluate(v => v.paused)).toBe(false);
});
