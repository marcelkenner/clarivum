"use client";

/**
 * Minimal Plausible dispatcher aligned with ADR-029. Replace with the full
 * @clarivum/analytics toolkit once Tasks TSK-PLAT-005 and TSK-SEO-001 land.
 */
type AnalyticsEventMap = {
  HomepageHeroAreaSelected: { area: string };
  HomepageHeroGoalSelected: { area: string; goal: string };
  HomepageHeroPlanRequested: { area: string; goal: string; emailProvided: boolean };
  HomepageHeroPlanSkipped: { area: string };
  HomepageHeroPlanDisplayed: { area: string; goal: string };
  HomepageNewsletterSubmitted: { segments: string[]; emailProvided: boolean };
  HomepageNewsletterDismissed: Record<string, never>;
  HomepageUvWidgetPermissionRequested: Record<string, never>;
};

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

export function dispatchAnalyticsEvent<EventName extends keyof AnalyticsEventMap>(
  name: EventName,
  properties: AnalyticsEventMap[EventName],
): void {
  if (typeof window === "undefined") {
    return;
  }

  const plausible = window.plausible;
  if (typeof plausible === "function") {
    plausible(name, { props: properties });
  } else if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console -- Safe for development diagnostics.
    console.debug(`[analytics] ${name}`, properties);
  }
}

export type AnalyticsEventName = keyof AnalyticsEventMap;
