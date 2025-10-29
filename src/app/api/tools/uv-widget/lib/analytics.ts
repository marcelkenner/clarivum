import type { AnalyticsEventRequest } from "@/lib/analytics/dispatch";
import {
  forwardAnalyticsEventToPlausible,
  type SupportedAnalyticsEvent,
} from "@/lib/analytics/server/plausible";

import type { ParsedRequestInput, UVWidgetPayload } from "./types";

type RequestKind = "geo" | "city" | "fallback";

function resolveRequestKind(input: ParsedRequestInput): RequestKind {
  if (input.cityQuery) {
    return "city";
  }

  if (input.location) {
    return "geo";
  }

  return "fallback";
}

function deriveFallbackReason(
  payload: UVWidgetPayload,
  input: ParsedRequestInput,
): string | undefined {
  return payload.fallback.reason ?? input.fallbackReason ?? undefined;
}

function logDispatchFailure(event: string, reason: string, extra?: Record<string, unknown>) {
  const payload = {
    severity: "WARN",
    message: "uv_widget_analytics_dispatch_failed",
    event,
    reason,
    ...(extra ?? {}),
  };

  console.warn(JSON.stringify(payload));
}

function dispatchAnalyticsEvent(event: SupportedAnalyticsEvent) {
  void forwardAnalyticsEventToPlausible(event).then((result) => {
    if (result.status === "failed") {
      logDispatchFailure(event.name, result.reason, {
        statusCode: result.statusCode,
        responseBody: result.body,
      });
    }

    if (result.status === "skipped") {
      logDispatchFailure(event.name, result.reason);
    }
  });
}

export function recordUvWidgetLoad(payload: {
  input: ParsedRequestInput;
  result: UVWidgetPayload;
}): void {
  const { input, result } = payload;
  const requestKind = resolveRequestKind(input);
  const fallbackReason = deriveFallbackReason(result, input);

  dispatchAnalyticsEvent({
    name: "uv_widget_load",
    props: {
      has_consent: "unknown",
      request_kind: requestKind,
      cache_status: result.meta.cache_status ?? "miss",
      locale: result.meta.locale,
      source_city: result.city_label,
      risk_level: result.risk_level,
      uv_now: result.uv_now,
      uv_max: result.uv_max_today,
      ...(result.meta.cache_source ? { cache_source: result.meta.cache_source } : {}),
      ...(fallbackReason ? { fallback_reason: fallbackReason } : {}),
    },
  });
}

export function recordUvWidgetError(payload: {
  input: ParsedRequestInput;
  error: Error;
  cacheStatus?: "hit" | "miss" | "stale";
  fallbackReason?: string;
}): void {
  const { input, error, cacheStatus, fallbackReason } = payload;
  const requestKind = resolveRequestKind(input);

  const props: AnalyticsEventRequest<"uv_widget_error">["props"] = {
    error: error.message,
    locale: input.locale,
    request_kind: requestKind,
  };

  if (cacheStatus) {
    props.cache_status = cacheStatus;
  }

  if (fallbackReason) {
    props.fallback_reason = fallbackReason;
  }

  dispatchAnalyticsEvent({
    name: "uv_widget_error",
    props,
  });
}

export function recordUvWidgetRateLimited(payload: {
  input: ParsedRequestInput;
  scope: "ip" | "global";
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}): void {
  const { input, scope, limit, remaining, retryAfterSeconds } = payload;
  const requestKind = resolveRequestKind(input);

  dispatchAnalyticsEvent({
    name: "uv_widget_rate_limited",
    props: {
      locale: input.locale,
      request_kind: requestKind,
      scope,
      limit,
      remaining,
      retry_after: retryAfterSeconds,
    },
  });
}
