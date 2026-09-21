import { test, expect } from "@playwright/test";

test("broadcaster chooses a unit only when automatic matching is ambiguous", async ({ page }) => {
  await page.goto("/broadcasts/stakecenter/broadcaster");
  await expect(page.getByRole("button", { name: "Start Broadcast" })).toBeVisible();

  await page.getByRole("button", { name: "Start Broadcast" }).click();
  const dialog = page.getByRole("dialog", { name: "Which unit is broadcasting?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Ward B" }).click();

  await expect(dialog).not.toBeVisible();
  await expect(page.getByText("Ward B", { exact: false })).toBeVisible();
  await expect(page.getByText("chapel live")).toBeVisible();
});

test("scheduled occurrence page becomes watchable when its broadcast starts", async ({ page }) => {
  await page.route("**/api/public-state", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        broadcast: {
          status: "live",
          association: { occurrenceKey: "conference-public/2026-10-18" },
        },
      }),
    }),
  );
  await page.goto("/broadcasts/conference-public/2026-10-18");

  await expect(page.getByText("Live", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Watch live" })).toHaveAttribute(
    "href",
    "/broadcasts/stakecenter",
  );
});
