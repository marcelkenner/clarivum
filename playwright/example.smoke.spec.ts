import { test, expect } from "@playwright/test";

import { createHomeExperienceCoordinator } from "@/app/(marketing)/_home/coordinator/HomeExperienceCoordinator";

test.describe("Marketing home smoke", () => {
  test("renders the hero copy and CTA from the coordinator", async ({ page }) => {
    const coordinator = createHomeExperienceCoordinator();
    const landingViewModel = coordinator.buildLandingViewModel();

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: landingViewModel.hero.headline }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: landingViewModel.hero.primaryCta.label }),
    ).toHaveAttribute("href", landingViewModel.hero.primaryCta.href);
  });
});
