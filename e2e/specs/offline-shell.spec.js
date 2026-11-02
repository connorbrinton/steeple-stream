import { test, expect } from "@playwright/test";

const broadcaster = "/broadcasts/stakecenter/broadcaster";

async function waitForCachedShell(page) {
  await page.goto(broadcaster);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
    .toBe(true);
  const cachedPaths = await page.evaluate(async () => {
    const keys = await caches.keys();
    const cacheName = keys.find((key) => key.startsWith("workbox-precache-"));
    if (!cacheName) return [];
    const cache = await caches.open(cacheName);
    return (await cache.keys()).map((request) => new URL(request.url).pathname);
  });
  expect(cachedPaths).toEqual(
    expect.arrayContaining(["/operator-shell", "/build/broadcaster.js", "/build/app.css"]),
  );
  await expect(page.locator("#offline-status")).toHaveText("Offline controls ready");
}

test("a newly opened tab loads the broadcaster controls while completely offline", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "Playwright WebKit offline emulation crashes on service-worker navigation",
  );
  await waitForCachedShell(page);
  await page.evaluate(() => {
    localStorage.setItem(
      `steeple:camera-presets:${location.pathname}`,
      JSON.stringify({ cameraReady: true, presets: [{ id: "pulpit", name: "Pulpit" }] }),
    );
  });

  await context.setOffline(true);
  const newPage = await context.newPage();
  await newPage.goto(broadcaster);
  await expect(newPage.getByRole("button", { name: "Pulpit", exact: true })).toBeVisible();
  await expect(newPage.locator("#offline-status")).toHaveText("Offline controls ready");
  await context.setOffline(false);
});

test("cached broadcaster and presets open without an available API", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "Playwright WebKit cannot simulate an offline SW reload reliably",
  );
  await waitForCachedShell(page);
  await page.evaluate(() => {
    localStorage.setItem(
      `steeple:camera-presets:${location.pathname}`,
      JSON.stringify({
        cameraReady: true,
        presets: [{ id: "pulpit", name: "Pulpit", group: "Camera", ndiPreset: 2 }],
      }),
    );
  });

  await context.setOffline(true);
  await page.reload();

  await expect(page.getByRole("button", { name: "Pulpit", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop Camera Motion" })).toBeVisible();
  await expect(page.locator("#status-label")).toContainText("Disconnected");
  await context.setOffline(false);
});

test("footer diagnostics show the loaded UI, live server, and installed worker revisions", async ({
  page,
}) => {
  await waitForCachedShell(page);
  await page.locator("#diagnostics-open").click();
  await expect(page.locator("#diagnostics-dialog")).toBeVisible();
  const uiCommit = (await page.locator("#diag-ui-commit").textContent())?.trim();
  expect(uiCommit).toBeTruthy();
  await expect(page.locator("#diag-server-commit")).toHaveText(uiCommit);
  await expect(page.locator("#diag-worker-commit")).toHaveText(uiCommit);
  await expect(page.locator("#diag-registration")).toContainText("Registered");
  await expect(page.locator("#diag-controller")).toHaveText("Yes");
  await expect(page.locator("#diag-cache")).toContainText("Complete");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedDiagnosticReport = text;
        },
      },
    });
  });
  await page.getByRole("button", { name: "Copy diagnostics" }).click();
  await expect(page.locator("#diagnostics-copy-status")).toHaveText("Diagnostics copied");
  const copied = await page.evaluate(() => window.copiedDiagnosticReport);
  expect(copied).toContain(`Loaded UI commit: ${uiCommit}`);
  expect(copied).toContain(`Live server commit: ${uiCommit}`);
  expect(copied).toContain("Offline control cache: Complete");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.locator("#diagnostics-dialog")).toBeHidden();
});

test("a background update offers an operator-controlled refresh", async ({ page }) => {
  await waitForCachedShell(page);
  await page.request.post("/fixture/worker-update");
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration.update();
  });
  await expect(page.locator("#update-notice")).toBeVisible();
  await page.getByRole("button", { name: "Refresh to update" }).click();
  await expect(page.locator("#update-notice")).toBeHidden();
  await expect(page.getByRole("button", { name: "Play camera preview" })).toBeVisible();
});
