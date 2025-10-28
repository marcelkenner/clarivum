import { test, expect } from "@playwright/test";

test.describe("Homepage smoke", () => {
  test("renders the placeholder homepage message", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Homepage refresh in progress/i }),
    ).toBeVisible();
    await expect(page.getByText(/we're rebuilding the clarivum introduction/i)).toBeVisible();
  });
});
