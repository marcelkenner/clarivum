import type {
  AnalyticsEventName,
  AnalyticsEventRequest,
  AnalyticsEventPayloadMap,
} from "@/lib/analytics/dispatch";

const DEFAULT_EVENT_API_URL = "https://plausible.io/api/event";
const DEFAULT_SITE_URL = "https://clarivum.com";

export type PlausibleDispatchResult =
  | { status: "sent" }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string; statusCode?: number; body?: string };

type SupportedEventName = Extract<AnalyticsEventName, "WebVitalsMetric">;
export type SupportedAnalyticsEvent = AnalyticsEventRequest<SupportedEventName>;

type PlausibleConfig = {
  apiUrl: string;
  apiKey: string | undefined;
  domain: string;
};

export async function forwardAnalyticsEventToPlausible(
  event: SupportedAnalyticsEvent,
): Promise<PlausibleDispatchResult> {
  const config = resolvePlausibleConfig();

  if (!config.apiKey) {
    return {
      status: "skipped",
      reason: "PLAUSIBLE_API_KEY is not configured; skipping ingestion.",
    };
  }

  const payload = createEventPayload(event, config.domain);

  try {
    const response = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "content-type": "application/json",
        "user-agent": "clarivum-web/1.0 (+https://clarivum.com)",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const failure: PlausibleDispatchResult & { status: "failed" } = {
        status: "failed",
        statusCode: response.status,
        reason: `Plausible responded with status ${response.status}`,
      };

      const body = await safeReadBody(response);
      if (body) {
        failure.body = body;
      }

      return failure;
    }

    return { status: "sent" };
  } catch (error) {
    return {
      status: "failed",
      reason: error instanceof Error ? error.message : "Unknown Plausible dispatch error",
    };
  }
}

function resolvePlausibleConfig(): PlausibleConfig {
  const env = process.env;
  const apiUrl = env["PLAUSIBLE_API_URL"]?.trim() || DEFAULT_EVENT_API_URL;
  const apiKey = env["PLAUSIBLE_API_KEY"]?.trim();
  const domain = resolveDomain(env);

  return {
    apiUrl,
    apiKey,
    domain,
  };
}

function resolveDomain(env: NodeJS.ProcessEnv): string {
  const explicitDomain = env["PLAUSIBLE_DOMAIN"]?.trim();
  if (explicitDomain) {
    return explicitDomain;
  }

  const siteUrl = env["NEXT_PUBLIC_SITE_URL"]?.trim() || DEFAULT_SITE_URL;
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return DEFAULT_SITE_URL.replace(/^https?:\/\//u, "");
  }
}

function createEventPayload(
  event: SupportedAnalyticsEvent,
  domain: string,
): PlausibleEventPayload<SupportedEventName> {
  const url = event.url ?? `https://${domain}/`;

  const payload: PlausibleEventPayload<SupportedEventName> = {
    name: event.name,
    domain,
    url,
    props: event.props,
  };

  if (event.referrer) {
    payload.referrer = event.referrer;
  }

  return payload;
}

async function safeReadBody(response: Response): Promise<string | undefined> {
  try {
    return await response.text();
  } catch {
    return undefined;
  }
}

type PlausibleEventPayload<EventName extends SupportedEventName> = {
  name: EventName;
  domain: string;
  url: string;
  referrer?: string;
  props: AnalyticsEventPayloadMap[EventName];
};
