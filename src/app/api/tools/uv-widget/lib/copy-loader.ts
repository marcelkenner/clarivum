import { SpanStatusCode, trace } from "@opentelemetry/api";

import type { LocaleLanguage, RiskLevel, UVWidgetCopyBundle, UVWidgetNextStep } from "./types";

const tracer = trace.getTracer("clarivum.api.tools");

const RISK_LEVELS: RiskLevel[] = ["low", "moderate", "high", "very_high", "extreme"];

const DEFAULT_COPY: Record<LocaleLanguage, UVWidgetCopyBundle> = {
  pl: {
    riskCopy: {
      low: "UV jest niskie. SPF 30 wystarczy, ale pamiętaj o reaplikacji.",
      moderate: "Nałóż SPF 50 i powtarzaj co 2 godziny.",
      high: "UV jest wysokie - użyj SPF 50+ i unikaj słońca w południe.",
      very_high: "UV jest bardzo wysokie. Szukaj cienia i noś odzież ochronną.",
      extreme: "UV ekstremalne! Zostań w pomieszczeniu, jeśli możesz, i stosuj ochronę 360°.",
    },
    fallbackMessage:
      "Pokazujemy Warszawę. Udostępnij lokalizację, aby zobaczyć dane dla Twojego miasta.",
    nextSteps: [
      {
        label: "Kalkulator dawki SPF",
        href: "/skin/narzedzia/kalkulator-dawki-spf",
        cta_id: "spf-dose-calculator",
      },
      {
        label: "Timer reaplikacji SPF",
        href: "/skin/narzedzia/timer-reaplikacji",
        cta_id: "spf-reapply-timer",
      },
    ],
    source: "fallback",
  },
  en: {
    riskCopy: {
      low: "UV risk is low. SPF 30 is enough; reapply every 2 hours.",
      moderate: "Apply SPF 50 and reapply every 2 hours.",
      high: "UV is high - use SPF 50+ and stay in the shade around noon.",
      very_high: "Very high UV. Seek shade and wear protective clothing.",
      extreme: "Extreme UV! Stay indoors if possible and apply full protection.",
    },
    fallbackMessage: "Showing Warsaw. Share your location to see your city's UV index.",
    nextSteps: [
      {
        label: "SPF Dose Calculator",
        href: "/skin/tools/spf-dose-calculator",
        cta_id: "spf-dose-calculator",
      },
      {
        label: "SPF Reapply Timer",
        href: "/skin/tools/spf-reapply-timer",
        cta_id: "spf-reapply-timer",
      },
    ],
    source: "fallback",
  },
};

const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheRecord = {
  expiresAt: number;
  bundle: UVWidgetCopyBundle;
};

const cache = new Map<LocaleLanguage, CacheRecord>();

export async function loadCopyBundle(language: LocaleLanguage): Promise<UVWidgetCopyBundle> {
  const cached = cache.get(language);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.bundle;
  }

  const span = tracer.startSpan("uv_widget.strapi_copy.fetch", {
    attributes: {
      "clarivum.tools.language": language,
    },
  });

  try {
    const bundle = await fetchFromStrapi(language, span);
    if (!bundle) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: "strapi_copy_missing",
      });
      span.end();
      return DEFAULT_COPY[language];
    }

    cache.set(language, { bundle, expiresAt: now + CACHE_TTL_MS });
    span.setStatus({ code: SpanStatusCode.OK });
    span.setAttribute("clarivum.tools.copy.source", bundle.source);
    span.end();
    return bundle;
  } catch (error) {
    span.recordException(error as Error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: (error as Error).message,
    });
    span.end();
    return DEFAULT_COPY[language];
  }
}

function getBaseUrl() {
  const baseUrl = process.env["STRAPI_API_URL"] ?? process.env["STRAPI_BASE_URL"];
  if (!baseUrl) {
    return undefined;
  }

  try {
    return new URL(baseUrl);
  } catch {
    return undefined;
  }
}

async function fetchFromStrapi(
  language: LocaleLanguage,
  span: ReturnType<typeof tracer.startSpan>,
) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    span.addEvent("strapi_base_url_missing");
    return undefined;
  }

  const token =
    process.env["STRAPI_TOOLS_UV_WIDGET_TOKEN"] ?? process.env["STRAPI_DELIVERY_API_TOKEN"];

  const searchParams = new URLSearchParams();
  searchParams.set("locale", language);
  searchParams.set("publicationState", "live");
  searchParams.set("pagination[pageSize]", "1");
  searchParams.set("populate[0]", "risk_levels");
  searchParams.set("populate[1]", "ctas");
  searchParams.set("populate[2]", "fallback_banner");

  const endpoint = new URL("/api/tools-uv-widget", baseUrl);
  endpoint.search = searchParams.toString();

  const headers = new Headers({
    accept: "application/json",
    "user-agent": "clarivum-next-tools/1.0",
  });

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  } else {
    span.addEvent("strapi_token_missing");
  }

  const response = await fetch(endpoint.toString(), {
    method: "GET",
    headers,
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`strapi_response_not_ok:${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const normalised = normaliseResponse(payload, language);

  if (!normalised) {
    return undefined;
  }

  return {
    ...normalised,
    source: "strapi" as const,
  };
}

function normaliseResponse(payload: unknown, language: LocaleLanguage) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const data = (payload as { data?: unknown }).data;
  const entry = Array.isArray(data) ? data[0] : data;
  if (!entry || typeof entry !== "object") {
    return undefined;
  }

  const attributes = (entry as { attributes?: unknown }).attributes;
  const source = attributes && typeof attributes === "object" ? attributes : entry;

  if (!source || typeof source !== "object") {
    return undefined;
  }

  const riskCopy = normaliseRiskCopy(source);
  const fallbackMessage = normaliseFallbackMessage(source, language);
  const nextSteps = normaliseNextSteps(source, language);

  if (!riskCopy) {
    return undefined;
  }

  return {
    riskCopy,
    fallbackMessage,
    nextSteps,
  };
}

function normaliseRiskCopy(source: Record<string, unknown>): Record<RiskLevel, string> | undefined {
  const candidate =
    source["risk_levels"] ??
    source["riskLevels"] ??
    source["risk_copy"] ??
    source["riskCopy"] ??
    source["risk"] ??
    source["copy"];

  const result: Partial<Record<RiskLevel, string>> = {};

  if (Array.isArray(candidate)) {
    for (const item of candidate) {
      if (!item || typeof item !== "object") continue;
      const level = normaliseRiskLevel((item as Record<string, unknown>)["level"]);
      if (!level) continue;
      const message =
        extractString(item, ["message", "copy", "text", "value", "content"]) ??
        extractString((item as Record<string, unknown>)["translations"], ["default"]);
      if (!message) continue;
      result[level] = message;
    }
  } else if (candidate && typeof candidate === "object") {
    for (const key of Object.keys(candidate)) {
      const level = normaliseRiskLevel(key);
      if (!level) continue;
      const value = (candidate as Record<string, unknown>)[key];
      if (typeof value === "string") {
        result[level] = value;
      } else if (value && typeof value === "object") {
        const message = extractString(value, ["message", "copy", "text", "value", "content"]);
        if (message) {
          result[level] = message;
        }
      }
    }
  }

  if (Object.keys(result).length === 0) {
    return undefined;
  }

  const completed: Record<RiskLevel, string> = {
    low: result.low ?? DEFAULT_COPY.pl.riskCopy.low,
    moderate: result.moderate ?? DEFAULT_COPY.pl.riskCopy.moderate,
    high: result.high ?? DEFAULT_COPY.pl.riskCopy.high,
    very_high: result.very_high ?? DEFAULT_COPY.pl.riskCopy.very_high,
    extreme: result.extreme ?? DEFAULT_COPY.pl.riskCopy.extreme,
  };

  return completed;
}

function normaliseFallbackMessage(source: Record<string, unknown>, language: LocaleLanguage) {
  return (
    extractString(source, ["fallback_message", "fallbackMessage"]) ??
    extractString(source["fallback"], ["message", "copy"]) ??
    extractString(source["fallback_banner"], ["message", "copy", "text"]) ??
    DEFAULT_COPY[language].fallbackMessage
  );
}

function normaliseNextSteps(
  source: Record<string, unknown>,
  language: LocaleLanguage,
): UVWidgetNextStep[] {
  const raw = source["ctas"] ?? source["next_steps"] ?? source["nextSteps"];
  if (!Array.isArray(raw)) {
    return DEFAULT_COPY[language].nextSteps;
  }

  const parsed: UVWidgetNextStep[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const label = extractString(entry, ["label", "title", "text"]);
    const href = extractString(entry, ["href", "url", "link"]);
    const ctaId =
      extractString(entry, ["cta_id", "ctaId", "cta_identifier", "identifier", "id"]) ??
      (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    if (!label || !href || !ctaId) continue;
    parsed.push({ label, href, cta_id: ctaId });
  }

  if (parsed.length === 0) {
    return DEFAULT_COPY[language].nextSteps;
  }

  return parsed;
}

function normaliseRiskLevel(value: unknown): RiskLevel | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const candidate = value.toLowerCase().replace(/[\s-]/g, "_");
  return RISK_LEVELS.includes(candidate as RiskLevel) ? (candidate as RiskLevel) : undefined;
}

function extractString(source: unknown, keys: string[]): string | undefined {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  for (const key of keys) {
    const value = (source as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

export function __dangerous__resetCopyCache() {
  cache.clear();
}

export function getDefaultCopy(language: LocaleLanguage) {
  return DEFAULT_COPY[language];
}
