import { HomeExperienceManager } from "../manager/HomeExperienceManager";

import type { HomeLandingViewModel } from "../viewmodel/HomeViewModel";

export interface HomeExperienceCoordinatorDependencies {
  manager?: HomeExperienceManager;
}

export class HomeExperienceCoordinator {
  constructor(private readonly manager: HomeExperienceManager) {}

  public buildLandingViewModel(): HomeLandingViewModel {
    return this.manager.buildLandingViewModel();
  }
}

export function createHomeExperienceCoordinator(
  dependencies?: HomeExperienceCoordinatorDependencies,
) {
  return new HomeExperienceCoordinator(dependencies?.manager ?? new HomeExperienceManager());
}
