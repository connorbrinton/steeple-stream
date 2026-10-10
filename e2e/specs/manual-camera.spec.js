import { test, expect } from "@playwright/test";

test.describe("touch joysticks", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });
  test("two touches can aim and zoom independently", async ({ page, browserName }) => {
    test.skip(
      browserName !== "chromium",
      "Multi-touch is driven through Chromium's input protocol",
    );
    const commands = [];
    await page.route("**/api/ptz/move", async (route) => {
      commands.push(route.request().postDataJSON());
      await route.fulfill({ json: { accepted: true } });
    });
    await page.goto("/broadcasts/stakecenter/broadcaster");
    const pan = page.getByRole("group", { name: "Pan and tilt joystick", exact: true });
    const zoom = page.getByRole("group", { name: "Zoom joystick", exact: true });
    await pan.scrollIntoViewIfNeeded();
    const panBox = await pan.boundingBox();
    const zoomBox = await zoom.boundingBox();
    const touch = await page.context().newCDPSession(page);
    const first = { id: 1, x: panBox.x + 40, y: panBox.y + 80 };
    const second = { id: 2, x: zoomBox.x + 30, y: zoomBox.y + 100 };
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [first, second],
    });
    const moved = [
      { ...first, x: first.x + 40 },
      { ...second, y: second.y - 40 },
    ];
    await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: moved });
    await expect
      .poll(() => commands.some((command) => command.pan > 0 && command.zoom > 0))
      .toBe(true);
    await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [moved[1]] });
    await expect
      .poll(() => commands.some((command) => command.pan === 0 && command.zoom > 0))
      .toBe(true);
    await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => commands.at(-1)?.zoom).toBe(0);
    await expect(pan).toHaveAttribute("data-pan", "0");
    await expect(zoom).toHaveAttribute("data-zoom", "0");
  });
});

test("manual buttons send movement while held and stop on release", async ({ page }) => {
  const commands = [];
  await page.route("**/api/ptz/move", async (route) => {
    commands.push(route.request().postDataJSON());
    await route.fulfill({ json: { accepted: true } });
  });
  await page.goto("/broadcasts/stakecenter/broadcaster");
  const button = page.getByRole("button", { name: "Pan right", exact: true });
  await expect(button).toBeVisible();
  await button.hover();
  await page.mouse.down();
  await expect.poll(() => commands.some((command) => command.pan > 0)).toBe(true);
  await page.mouse.up();
  await expect.poll(() => commands.at(-1)?.pan).toBe(0);
  const count = commands.length;
  await page.waitForTimeout(350);
  expect(commands.length).toBe(count);
});

test("gamepad waits for neutral inputs and disables on focus loss", async ({ page }) => {
  const commands = [];
  await page.addInitScript(() => {
    window.testPad = {
      index: 0,
      mapping: "standard",
      axes: [0.8, 0],
      buttons: Array.from({ length: 8 }, () => ({ pressed: false, value: 0 })),
    };
    Object.defineProperty(navigator, "getGamepads", { value: () => [window.testPad] });
  });
  await page.route("**/api/ptz/move", async (route) => {
    commands.push(route.request().postDataJSON());
    await route.fulfill({ json: { accepted: true } });
  });
  await page.goto("/broadcasts/stakecenter/broadcaster");
  const enabled = page.getByRole("checkbox", { name: "Enable gamepad control" });
  await enabled.check();
  await expect(page.getByText("Release sticks and triggers to enable control.")).toBeVisible();
  expect(commands).toHaveLength(0);
  await page.evaluate(() => {
    window.testPad.axes[0] = 0;
  });
  await expect(page.getByText(/^Gamepad ready/)).toBeVisible();
  await page.evaluate(() => {
    window.testPad.axes[0] = 0.8;
  });
  await expect.poll(() => commands.some((command) => command.pan > 0)).toBe(true);
  const panPad = page.getByRole("group", { name: "Pan and tilt joystick", exact: true });
  await expect.poll(async () => Number(await panPad.getAttribute("data-pan"))).toBeGreaterThan(0);
  await page.evaluate(() => {
    window.testPad.axes[3] = -0.8;
    window.testPad.buttons[6].value = 1;
  });
  await expect.poll(() => commands.some((command) => command.zoom > 0)).toBe(true);
  const zoomPad = page.getByRole("group", { name: "Zoom joystick", exact: true });
  await expect.poll(async () => Number(await zoomPad.getAttribute("data-zoom"))).toBeGreaterThan(0);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(enabled).not.toBeChecked();
  await expect.poll(() => commands.at(-1)?.pan).toBe(0);
  await expect(panPad).toHaveAttribute("data-pan", "0");
  await expect(zoomPad).toHaveAttribute("data-zoom", "0");
});

test("drag joysticks start at the press location and provide proportional speed", async ({
  page,
}) => {
  const commands = [];
  await page.route("**/api/ptz/move", async (route) => {
    commands.push(route.request().postDataJSON());
    await route.fulfill({ json: { accepted: true } });
  });
  await page.goto("/broadcasts/stakecenter/broadcaster");
  const pad = page.getByRole("group", { name: "Pan and tilt joystick", exact: true });
  await expect(pad).toBeVisible();
  const box = await pad.boundingBox();
  const x = box.x + 25;
  const y = box.y + 40;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await expect(pad.locator(".joystick-origin")).toHaveCSS("left", "25px");
  await page.waitForTimeout(150);
  expect(commands).toHaveLength(0);
  await page.mouse.move(x + 25, y);
  await expect.poll(() => commands.at(-1)?.pan || 0).toBeGreaterThan(0.1);
  const slow = commands.at(-1).pan;
  await page.mouse.move(x + 65, y);
  await expect.poll(() => commands.at(-1)?.pan || 0).toBeGreaterThan(slow + 0.1);
  await page.mouse.move(x, y);
  await expect.poll(() => commands.at(-1)?.pan).toBe(0);
  await page.mouse.up();
  const zoom = page.getByRole("group", { name: "Zoom joystick", exact: true });
  const zoomBox = await zoom.boundingBox();
  await page.mouse.move(zoomBox.x + 30, zoomBox.y + 100);
  await page.mouse.down();
  await page.mouse.move(zoomBox.x + 30, zoomBox.y + 70);
  await expect.poll(() => commands.at(-1)?.zoom || 0).toBeGreaterThan(0);
  await page.mouse.up();
  await expect.poll(() => commands.at(-1)?.zoom).toBe(0);
});
