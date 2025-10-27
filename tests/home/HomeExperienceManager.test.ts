import { describe, expect, it } from "vitest";

import { HomeExperienceManager } from "@/app/(marketing)/_home/manager/HomeExperienceManager";

describe("HomeExperienceManager", () => {
  it("builds a homepage view model with hero wizard and feature flags", () => {
    const manager = new HomeExperienceManager();
    const viewModel = manager.buildLandingViewModel();

    expect(viewModel.featureFlags.heroWizard).toBe(true);
    expect(viewModel.featureFlags.newsletterBar).toBe(true);
    expect(viewModel.featureFlags.uvWidget).toBe(true);

    expect(viewModel.heroWizard.pillars).toHaveLength(3);
    for (const pillar of viewModel.heroWizard.pillars) {
      expect(pillar.goals.length).toBeGreaterThan(0);
      pillar.goals.forEach((goal) => {
        expect(goal.plan.title).toBeTruthy();
        expect(goal.plan.phases.length).toBeGreaterThan(0);
        expect(goal.plan.tools.length).toBeGreaterThan(0);
      });
    }
  });

  it("includes editorial sections and diagnostics", () => {
    const manager = new HomeExperienceManager();
    const viewModel = manager.buildLandingViewModel();

    expect(viewModel.diagnostics.length).toBeGreaterThan(0);
    expect(viewModel.learningMoments.length).toBeGreaterThan(0);
    expect(viewModel.verticals.length).toBeGreaterThan(0);
  });
});
