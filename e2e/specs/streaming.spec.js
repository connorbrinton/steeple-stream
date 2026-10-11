import { test, expect } from "@playwright/test";
import {
  video,
  expectProgress,
  startPlayback,
  observePeers,
  expectWebRtcMedia,
  setLowVolume,
  expectAudio,
} from "./helpers.js";

test.beforeEach(async ({ page }) => observePeers(page));

test("WHEP delivers decoded video and non-silent audio from MediaMTX", async ({ page }) => {
  await page.goto("/?mode=webrtc");
  await startPlayback(page);
  await expectWebRtcMedia(page);
  await expectAudio(page, 1, false);
});

test("the player reports WebRTC negotiation and the connected ICE candidate type", async ({
  page,
}) => {
  await page.goto("/?mode=hybrid&timeline=false");
  await startPlayback(page);
  await expectWebRtcMedia(page);
  await expect
    .poll(() =>
      page.evaluate(() => window.testTransports.some((item) => item.transport === "connecting")),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.testTransports.some((item) => item.transport.startsWith("webrtc-")),
      ),
    )
    .toBe(true);
});

test("HLS delivers moving video and a decoded audio signal", async ({ page }) => {
  await page.goto("/?mode=hls");
  await startPlayback(page);
  await page.evaluate(() => {
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const source = context.createMediaElementSource(document.querySelector("#player video"));
    source.connect(analyser);
    analyser.connect(context.destination);
    window.testAudio = { context, analyser };
    return context.resume();
  });
  await expect
    .poll(() =>
      page.evaluate(() => {
        const { analyser } = window.testAudio;
        const samples = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(samples);
        return samples.some((value) => Math.abs(value) > 0.001);
      }),
    )
    .toBe(true);
  await expectAudio(page, 1, false);
});

test("HLS plays while a WebRTC signaling request remains pending", async ({ page }) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  let whepStarted = false;
  await page.route("**/webrtc/**", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    whepStarted = true;
    await gate;
    await route.fulfill({ status: 503 });
  });
  await page.goto("/?mode=hybrid&timeline=false");
  await expect.poll(() => whepStarted).toBe(true);
  // WebRTC is still blocked above, but HLS must already be showing frames.
  await startPlayback(page);
  await expect.poll(() => video(page).evaluate((element) => element.srcObject)).toBe(null);
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.testTransports.some((item) => item.transport === "hls" && item.connectingWebRtc),
      ),
    )
    .toBe(true);
  release();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.testTransports.some((item) => item.transport === "hls" && item.fallbackReason),
      ),
    )
    .toBe(true);
});

test("a failed WHEP request falls back to playable HLS", async ({ page }) => {
  await page.route("**/webrtc/**", (route) => route.fulfill({ status: 503 }));
  await page.goto("/?mode=hybrid");
  await startPlayback(page);
  await expect.poll(() => video(page).evaluate((element) => element.srcObject === null)).toBe(true);
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.testTransports.some(
          (item) =>
            item.transport === "hls" && item.fallbackReason?.includes("WHEP returned HTTP 503"),
        ),
      ),
    )
    .toBe(true);
  await expectAudio(page, 1, false);
});

test("an established WebRTC connection that fails ICE switches to playable HLS", async ({
  page,
}) => {
  await page.goto("/?mode=hybrid&timeline=false");
  await startPlayback(page);
  await expectWebRtcMedia(page);
  await page.evaluate(() => {
    const peer = window.testPeers.at(-1);
    Object.defineProperty(peer, "connectionState", {
      configurable: true,
      get: () => "failed",
    });
    peer.dispatchEvent(new Event("connectionstatechange"));
  });
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.testTransports.some(
          (item) =>
            item.transport === "hls" && item.fallbackReason === "WebRTC peer connection failed",
        ),
      ),
    )
    .toBe(true);
  await expect.poll(() => video(page).evaluate((element) => element.srcObject === null)).toBe(true);
  await expectProgress(page);
});

test("a brief WebRTC disconnection does not abandon a recovered connection", async ({ page }) => {
  await page.goto("/?mode=hybrid&timeline=false");
  await startPlayback(page);
  await expectWebRtcMedia(page);
  await page.evaluate(() => {
    const peer = window.testPeers.at(-1);
    window.testFakeConnectionState = "disconnected";
    Object.defineProperty(peer, "connectionState", {
      configurable: true,
      get: () => window.testFakeConnectionState,
    });
    peer.dispatchEvent(new Event("connectionstatechange"));
  });
  await expect
    .poll(() =>
      page.evaluate(() => window.testTransports.some((item) => item.transport === "reconnecting")),
    )
    .toBe(true);
  await page.evaluate(() => {
    window.testFakeConnectionState = "connected";
    window.testPeers.at(-1).dispatchEvent(new Event("connectionstatechange"));
  });
  await page.waitForTimeout(2800);
  expect(await video(page).evaluate((element) => element.srcObject !== null)).toBe(true);
  expect(
    await page.evaluate(() =>
      window.testTransports.some(
        (item) => item.transport === "hls" && item.fallbackReason?.includes("disconnected"),
      ),
    ),
  ).toBe(false);
});

test("a broadcaster or admin hybrid preview has no seek bar", async ({ page }) => {
  await page.goto("/?mode=hybrid&timeline=false");
  await startPlayback(page);
  await expectWebRtcMedia(page);
  await expect(page.getByRole("slider", { name: /^seek$/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /live/i })).toHaveCount(0);
});

test("HLS recovers after a network interruption without resetting audio preferences", async ({
  page,
}) => {
  let interrupted = false;
  let blocked = 0;
  await page.route("**/hls/**", (route) => {
    if (interrupted) {
      blocked++;
      return route.abort();
    }
    return route.continue();
  });
  await page.goto("/?mode=hls");
  await startPlayback(page);
  const volume = await setLowVolume(page);
  interrupted = true;
  await expect.poll(() => blocked).toBeGreaterThan(0);
  await expect(page.getByRole("status")).toBeVisible({ timeout: 30_000 });
  interrupted = false;
  await expectProgress(page);
  await expect(page.getByRole("status")).toBeHidden();
  await expectAudio(page, volume, false);
});

test("rewind switches to HLS and Live returns to WebRTC with the same volume", async ({ page }) => {
  await page.goto("/?mode=hybrid");
  await startPlayback(page);
  await expectWebRtcMedia(page);
  const original = await video(page).elementHandle();
  const volume = await setLowVolume(page);
  const seek = page.getByRole("slider", { name: /^seek$/i });
  await expect(seek).toBeEnabled();
  await seek.focus();
  await seek.press("Home");
  await expect.poll(() => video(page).evaluate((element) => element.srcObject === null)).toBe(true);
  await expectProgress(page);
  expect(await video(page).evaluate((element, first) => element === first, original)).toBe(true);
  await expect
    .poll(() =>
      video(page).evaluate((element) => {
        const ranges = element.seekable;
        return ranges.length ? ranges.end(ranges.length - 1) - element.currentTime : 0;
      }),
    )
    .toBeGreaterThan(2);
  await expectAudio(page, volume, false);
  await page.getByRole("button", { name: "Back to live", exact: true }).click();
  await expectWebRtcMedia(page);
  expect(await video(page).evaluate((element, first) => element === first, original)).toBe(true);
  await expectProgress(page);
  await expectAudio(page, volume, false);
});

test("source changes release the old WebRTC connection", async ({ page }) => {
  await page.goto("/?mode=webrtc");
  await startPlayback(page);
  await expectWebRtcMedia(page);
  const original = await video(page).elementHandle();
  await page.getByRole("button", { name: "Next stream", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.testPeers[0].connectionState)).toBe("closed");
  await expectWebRtcMedia(page);
  await expectProgress(page);
  expect(await video(page).evaluate((element, first) => element === first, original)).toBe(true);
});

test("recording, HLS and WebRTC switches reuse the video and release transports", async ({
  page,
}) => {
  await page.goto("/");
  await startPlayback(page);
  const original = await video(page).elementHandle();
  for (const name of ["HLS", "WebRTC", "Recording", "HLS", "Recording"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await startPlayback(page);
    expect(await video(page).evaluate((element, first) => element === first, original)).toBe(true);
    if (name === "WebRTC") await expectWebRtcMedia(page);
    else {
      expect(await video(page).evaluate((element) => element.srcObject)).toBe(null);
      expect(
        await page.evaluate(() =>
          window.testPeers.every((peer) => peer.connectionState === "closed"),
        ),
      ).toBe(true);
    }
    await expect(page.locator("media-controller")).toHaveCount(1);
  }
});

test("a late WHEP response cannot change a replacement recording", async ({ page }) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  let held = false;
  let deleted = false;
  await page.route("**/webrtc/**", async (route) => {
    if (route.request().method() === "DELETE") {
      deleted = true;
      return route.fulfill({ status: 200 });
    }
    held = true;
    await gate;
    await route.fulfill({
      status: 201,
      headers: { location: "/webrtc/obsolete-session" },
      body: "obsolete SDP",
    });
  });
  await page.goto("/?mode=webrtc");
  await expect.poll(() => held).toBe(true);
  const original = await video(page).elementHandle();
  await page.getByRole("button", { name: "Recording", exact: true }).click();
  release();
  await expect.poll(() => deleted).toBe(true);
  await startPlayback(page);
  expect(await video(page).evaluate((element, first) => element === first, original)).toBe(true);
  expect(
    await page.evaluate(() => window.testPeers.every((peer) => peer.connectionState === "closed")),
  ).toBe(true);
  await expect(page.locator(".playback-status")).toBeHidden();
});
