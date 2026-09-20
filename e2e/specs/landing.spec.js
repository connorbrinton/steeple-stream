import { test, expect } from "@playwright/test";

test("public landing page links an active broadcast", async ({ page }) => {
  await page.goto("/?page=landing");

  await expect(page.getByRole("heading", { name: "Watch a meeting" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Live now" })).toBeVisible();
  await expect(page.getByText("2 viewers", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "Watch live" })).toHaveAttribute(
    "href",
    "/broadcasts/stakecenter",
  );
  await expect(page.getByRole("link", { name: "Broadcaster sign in" })).toHaveAttribute(
    "href",
    "/broadcaster",
  );
});
