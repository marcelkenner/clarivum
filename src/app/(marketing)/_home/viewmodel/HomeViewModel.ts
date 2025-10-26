import type { VerticalHighlight } from "@/app/_vertical-experience/manager/ContentLibrary";
import type { CategorySummary } from "@/lib/content-map";

export type HomeLandingViewModel = {
  hero: {
    eyebrow: string;
    headline: string;
    subheading: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  diagnostics: {
    label: string;
    description: string;
    href: string;
  }[];
  learningMoments: {
    title: string;
    summary: string;
    href: string;
  }[];
  verticals: {
    key: string;
    tagline: string;
    description: string;
    accent: string;
    categories: CategorySummary[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  }[];
};

export function mapHighlightToViewModel(
  highlight: VerticalHighlight,
): HomeLandingViewModel["verticals"][number] {
  return {
    key: highlight.key,
    tagline: highlight.narrative.tagline,
    description: highlight.narrative.description,
    accent: highlight.narrative.accent,
    categories: highlight.categories,
    primaryCta: highlight.narrative.primaryCta,
    secondaryCta: highlight.narrative.secondaryCta,
  };
}
