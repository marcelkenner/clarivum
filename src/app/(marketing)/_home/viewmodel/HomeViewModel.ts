import type { VerticalHighlight } from "@/app/_vertical-experience/manager/ContentLibrary";
import type { CategorySummary } from "@/lib/content-map";

export type HomeFeatureFlags = {
  heroWizard: boolean;
  newsletterBar: boolean;
  uvWidget: boolean;
};

export type HomeNewsletterSegment = {
  id: string;
  label: string;
  description: string;
};

export type HomeNewsletterViewModel = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  dismissLabel: string;
  privacyCopy: { label: string; href: string };
  segmentationLabel: string;
  segmentation: HomeNewsletterSegment[];
};

export type HomeHeroPlanPhase = {
  title: string;
  steps: string[];
};

export type HomeHeroPlanResource = {
  label: string;
  href: string;
};

export type HomeHeroPlanViewModel = {
  title: string;
  durationLabel: string;
  summary: string;
  phases: HomeHeroPlanPhase[];
  tools: HomeHeroPlanResource[];
  resources: HomeHeroPlanResource[];
  disclaimer: string;
};

export type HomeHeroGoal = {
  slug: string;
  label: string;
  description: string;
  plan: HomeHeroPlanViewModel;
};

export type HomeHeroPillar = {
  key: "skin" | "fuel" | "habits";
  label: string;
  description: string;
  goals: HomeHeroGoal[];
};

export type HomeHeroWizardViewModel = {
  eyebrow: string;
  headline: string;
  subheading: string;
  badges: string[];
  emailHelper: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  emailLabel: string;
  emailOptionalLabel: string;
  emailPlaceholder: string;
  disclaimers: { label: string; href: string }[];
  uvWidget: {
    title: string;
    subtitle: string;
    fallbackCity: string;
    actionLabel: string;
    consentCopy: string;
  };
  pillars: HomeHeroPillar[];
};

export type HomeLandingViewModel = {
  featureFlags: HomeFeatureFlags;
  newsletter: HomeNewsletterViewModel;
  heroWizard: HomeHeroWizardViewModel;
  tools: HomeToolsViewModel;
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
  trust: HomeTrustViewModel;
  ebooks: HomeEbooksViewModel;
  globalCta: HomeGlobalCtaViewModel;
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

export type HomeToolCardViewModel = {
  key: string;
  label: string;
  description: string;
  href: string;
  eyebrow?: string;
};

export type HomeToolsViewModel = {
  eyebrow: string;
  headline: string;
  description: string;
  seeAllLabel: string;
  seeAllHref: string;
  items: HomeToolCardViewModel[];
};

export type HomeTrustViewModel = {
  eyebrow: string;
  headline: string;
  quotes: { quote: string; author: string }[];
  logos: { alt: string; href: string }[];
  links: { label: string; href: string }[];
  disclaimer: string;
};

export type HomeEbookCardViewModel = {
  slug: string;
  title: string;
  description: string;
  href: string;
};

export type HomeEbooksViewModel = {
  eyebrow: string;
  headline: string;
  description: string;
  seeAllLabel: string;
  seeAllHref: string;
  items: HomeEbookCardViewModel[];
};

export type HomeGlobalCtaViewModel = {
  eyebrow: string;
  headline: string;
  subheading: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};
