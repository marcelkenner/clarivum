import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { createHomeExperienceCoordinator } from "@/app/(marketing)/_home/coordinator/HomeExperienceCoordinator";
import MarketingHomePage from "@/app/(marketing)/page";

type MockedImageProps = React.ComponentProps<"img"> & { priority?: boolean };

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props?: MockedImageProps) => {
    const { priority, alt, ...rest } = props ?? {};
    void priority;

    // eslint-disable-next-line @next/next/no-img-element -- Use a plain img for predictable tests while Next Image is mocked.
    return <img {...rest} alt={alt ?? ""} />;
  },
}));

const coordinator = createHomeExperienceCoordinator();
const landingViewModel = coordinator.buildLandingViewModel();

describe("Marketing home page", () => {
  it("renders the Clarivum hero copy", () => {
    render(<MarketingHomePage />);

    expect(
      screen.getByRole("heading", { name: landingViewModel.hero.headline }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: landingViewModel.hero.secondaryCta.label }),
    ).toHaveAttribute("href", landingViewModel.hero.secondaryCta.href);
  });

  it("surfaces Skin, Fuel, and Habits entry points", () => {
    render(<MarketingHomePage />);

    landingViewModel.verticals.forEach((vertical) => {
      expect(
        screen.getByRole("link", { name: vertical.primaryCta.label }),
      ).toHaveAttribute("href", vertical.primaryCta.href);
    });
  });
});
