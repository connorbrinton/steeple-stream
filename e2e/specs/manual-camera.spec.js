import { test, expect } from "@playwright/test";

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
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect(enabled).not.toBeChecked();
  await expect.poll(() => commands.at(-1)?.pan).toBe(0);
});
