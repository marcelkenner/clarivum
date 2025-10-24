import { test, expect } from "@playwright/test";

test.describe("Placeholder smoke suite", () => {
  test("ensures Playwright wiring succeeds", async ({ page }) => {
    await page.goto("about:blank");
    await expect(page).toHaveTitle("");
  });
});
