import { createHomeExperienceCoordinator } from "./_home/coordinator/HomeExperienceCoordinator";
import { HomeLandingView } from "./_home/view/HomeLandingView";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clarivum · Strona główna Skin · Fuel · Habits",
  description:
    "W mniej niż 20 sekund widzisz dalszy krok w Clarivum Skin, Clarivum Fuel i Clarivum Habits. Ta makieta odwzorowuje layout ASCII do czasu, aż Strapi poda finalne treści.",
};

export const revalidate = 1800;

export default function MarketingHomePage() {
  const coordinator = createHomeExperienceCoordinator();
  const viewModel = coordinator.buildLandingViewModel();

  return <HomeLandingView viewModel={viewModel} />;
}
