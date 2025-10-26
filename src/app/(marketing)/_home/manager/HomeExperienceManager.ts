import { createContentLibrary } from "@/app/_vertical-experience/manager/ContentLibrary";
import type { ContentLibrary } from "@/app/_vertical-experience/manager/ContentLibrary";

import { mapHighlightToViewModel, type HomeLandingViewModel } from "../viewmodel/HomeViewModel";

const HERO_COPY = {
  eyebrow: "Clarivum · Skin, Fuel i Habits pod moje tempo",
  headline: "W 20 sekund wiem, co mam zrobić dalej",
  subheading:
    "Clarivum Skin, Clarivum Fuel i Clarivum Habits prowadzą mnie przez diagnostyki, ebooki oraz guardraile tak, abym natychmiast dostała kolejny krok i sposób jego weryfikacji.",
  primaryCta: { label: "Chcę zobaczyć moją mapę drogi", href: "/skin" },
  secondaryCta: { label: "Sprawdzam guardraile Kaizen", href: "/docs" },
};

const DIAGNOSTIC_PROMPTS: HomeLandingViewModel["diagnostics"] = [
  {
    label: "Test bariery (Clarivum Skin)",
    description: "W 3 minuty sprawdzam wrażliwość skóry i dostaję rutyny gotowe do kliknięcia.",
    href: "/skin/bariera",
  },
  {
    label: "Checkpoint Clarivum Fuel",
    description: "Otrzymuję TDEE, makro i guardraile wysłane prosto na mój e-mail.",
    href: "/fuel/podstawy",
  },
  {
    label: "Podgląd Clarivum Habits",
    description: "Układam plan Forest Day i guardrail, który faktycznie dowożę.",
    href: "/habits/podstawy",
  },
];

const LEARNING_MOMENTS: HomeLandingViewModel["learningMoments"] = [
  {
    title: "Podglądam Ops Hub",
    summary: "Widzę, jak moje runbooki i docs trzymają się ADR-031 zanim odpali się ops-hub.mdx.",
    href: "/ops",
  },
  {
    title: "Guardraile Kaizen w 60 minut",
    summary:
      "Dostaję przykłady guardrails z potwierdzeniem skuteczności, wszystko do wdrożenia dziś.",
    href: "/docs/playbooks/kaizen-minute",
  },
  {
    title: "Sezonowy rytm Metsa",
    summary: "Plan rocznych sezonów i Forest Day, żebym mogła złapać tempo 2025.",
    href: "/docs/playbooks/metsa-cadence",
  },
];

export class HomeExperienceManager {
  constructor(private readonly contentLibrary: ContentLibrary = createContentLibrary()) {}

  public buildLandingViewModel(): HomeLandingViewModel {
    const highlights = this.contentLibrary.listHighlights(3).map(mapHighlightToViewModel);

    return {
      hero: HERO_COPY,
      diagnostics: DIAGNOSTIC_PROMPTS,
      learningMoments: LEARNING_MOMENTS,
      verticals: highlights,
    };
  }
}
