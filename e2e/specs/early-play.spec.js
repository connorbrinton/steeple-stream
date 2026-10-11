import { test, expect } from "@playwright/test";

test("Play is clickable before broadcaster state and media negotiation finish", async ({
  page,
}) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  let requestedState = false;
  await page.route("**/api/state", async (route) => {
    requestedState = true;
    await gate;
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        broadcast: {
          status: "offline",
          mode: "chapel",
          startedAt: null,
          expiresAt: null,
          playback: null,
        },
        capabilities: { broadcastControls: false, sceneControls: false },
        source: { type: "ndi", ndi: { sourceName: "synthetic-ndi" } },
        cameraControlSource: null,
        preview: {
          hlsUrl: "/hls/live/index.m3u8",
          webrtcUrl: "/webrtc/live-webrtc/whep",
        },
        ptz: { presets: [] },
      }),
    });
  });
  await page.goto("/broadcasts/stakecenter/broadcaster");
  await expect.poll(() => requestedState).toBe(true);
  const play = page.getByRole("button", { name: "Play camera preview" });
  await expect(play).toBeVisible();
  await play.click();
  expect(await page.evaluate(() => window.SteepleEarlyPlay.requested)).toBe(true);
  expect(await page.locator("#preview-play-message").textContent()).toContain("Connecting");
  release();
  await expect
    .poll(
      () =>
        page
          .locator("#admin-preview video")
          .first()
          .evaluate((element) => element.currentTime),
      {
        timeout: 20000,
      },
    )
    .toBeGreaterThan(0.3);
  await expect(page.locator("#preview-start")).toBeHidden();
  await expect(
    page.locator("#admin-preview .playback-status").getByText("Ready to watch"),
  ).toHaveCount(0);
});
