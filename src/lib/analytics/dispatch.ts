"use client";

/**
 * Minimal Plausible dispatcher aligned with ADR-029. Replace with the full
 * @clarivum/analytics toolkit once Tasks TSK-PLAT-005 and TSK-SEO-001 land.
 */
export type AnalyticsEventPayloadMap = {
  HomepageHeroAreaSelected: { area: string };
  HomepageHeroGoalSelected: { area: string; goal: string };
  HomepageHeroPlanRequested: { area: string; goal: string; emailProvided: boolean };
  HomepageHeroPlanSkipped: { area: string; goal: string };
  HomepageHeroPlanDisplayed: { area: string; goal: string };
  HomepageNewsletterSubmitted: { segments: string[]; emailProvided: boolean };
  HomepageNewsletterDismissed: Record<string, never>;
  HomepageUvWidgetPermissionRequested: Record<string, never>;
  WebVitalsMetric: { id: string; name: string; value: number; navigationType: string };
};

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

export type AnalyticsEventName = keyof AnalyticsEventPayloadMap;
export type AnalyticsEventRequest<EventName extends AnalyticsEventName = AnalyticsEventName> = {
  name: EventName;
  url?: string;
  referrer?: string;
  props: AnalyticsEventPayloadMap[EventName];
  timestamp?: string;
};

const ANALYTICS_EVENT_ENDPOINT = "/api/analytics/events";

export function dispatchAnalyticsEvent<EventName extends AnalyticsEventName>(
  name: EventName,
  properties: AnalyticsEventPayloadMap[EventName],
): void {
  if (typeof window === "undefined") {
    return;
  }

  const plausible = window.plausible;
  if (typeof plausible === "function") {
    plausible(name, { props: properties });
    return;
  }

  if (name === "WebVitalsMetric") {
    queueMicrotask(() => {
      postAnalyticsEvent({ name, props: properties });
    });
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console -- Safe for development diagnostics.
    console.debug(`[analytics] ${name}`, properties);
  }
}

function postAnalyticsEvent<EventName extends AnalyticsEventName>(
  event: AnalyticsEventRequest<EventName>,
): void {
  try {
    if (typeof window === "undefined") {
      return;
    }

    const url = window.location?.href;
    const referrer = typeof document !== "undefined" ? document.referrer : undefined;
    const payload: AnalyticsEventRequest<EventName> = {
      name: event.name,
      props: event.props,
      url: event.url ?? url,
      timestamp: new Date().toISOString(),
    };

    if (event.referrer) {
      payload.referrer = event.referrer;
    } else if (referrer) {
      payload.referrer = referrer;
    }

    const serialized = JSON.stringify(payload);

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([serialized], { type: "application/json" });
      const sent = navigator.sendBeacon(ANALYTICS_EVENT_ENDPOINT, blob);
      if (sent) {
        return;
      }
    }

    void fetch(ANALYTICS_EVENT_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: serialized,
      keepalive: true,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console -- Allowed for development diagnostics.
      console.debug("[analytics] failed to queue event", error);
    }
  }
}
