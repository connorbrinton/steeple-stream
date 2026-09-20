import { test, expect } from "@playwright/test";

test("administrator creates units and schedules", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administration" })).toBeVisible();
  await expect(page.getByText("admin@example.com")).toBeVisible();

  await page.getByRole("link", { name: "Units" }).click();
  await page.getByRole("button", { name: "Add unit" }).click();
  await page.getByLabel("Name").fill("Harris Lake Ward");
  await page.getByLabel("URL slug").fill("harris-lake");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("heading", { name: "Harris Lake Ward" })).toBeVisible();

  await page.getByRole("link", { name: "Schedules" }).click();
  await page.getByRole("button", { name: "Add schedule" }).click();
  await page.getByLabel("Unit").selectOption({ label: "Harris Lake Ward" });
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("heading", { name: "Sacrament Meeting" })).toBeVisible();
  await expect(page.getByText("Harris Lake Ward · Sunday at 11:00")).toBeVisible();

  await page.getByRole("link", { name: "People & access" }).click();
  await page.getByRole("button", { name: "Add person" }).click();
  await page.getByLabel("Google account email").fill("wyatt@example.com");
  await page.getByRole("group", { name: "Units" }).getByText("Harris Lake Ward").click();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("heading", { name: "wyatt@example.com" })).toBeVisible();
  await expect(page.getByText("Broadcaster · Harris Lake Ward")).toBeVisible();
});
