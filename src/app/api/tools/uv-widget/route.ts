import { createHash } from "node:crypto";

import { SpanStatusCode, trace } from "@opentelemetry/api";
import { NextResponse, type NextRequest } from "next/server";

import {
  recordUvWidgetError,
  recordUvWidgetLoad,
  recordUvWidgetRateLimited,
} from "./lib/analytics";
import { uvWidgetManager } from "./lib/manager";
import { evaluateRateLimit } from "./lib/rate-limit";
import { parseRequestInput } from "./lib/request";

import type { ParsedRequestInput } from "./lib/types";

export const runtime = "nodejs";

const tracer = trace.getTracer("clarivum.api.tools");

function isUvWidgetEnabled() {
  const value = process.env["UV_WIDGET_SERVICE_ENABLED"];
  if (value === undefined) {
    return true;
  }

  const normalised = value.trim().toLowerCase();
  return (
    normalised !== "false" &&
    normalised !== "0" &&
    normalised !== "off" &&
    normalised !== "disabled"
  );
}

function extractClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function hashIdentifier(identifier: string) {
  return createHash("sha256").update(identifier).digest("hex");
}

function rateLimitKey(request: NextRequest) {
  return hashIdentifier(extractClientIp(request));
}

const CACHE_HEADERS = {
  "cache-control": "public, s-maxage=300, stale-while-revalidate=120",
};

export async function GET(request: NextRequest) {
  return tracer.startActiveSpan("uv_widget.request", async (span) => {
    let parsedInput: ParsedRequestInput | undefined;

    try {
      if (!isUvWidgetEnabled()) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "service_disabled",
        });
        return NextResponse.json(
          { error: "UV widget temporarily disabled." },
          {
            status: 503,
            headers: { "cache-control": "no-store" },
          },
        );
      }

      parsedInput = parseRequestInput(request);
      span.setAttribute("clarivum.tools.locale", parsedInput.locale);
      span.setAttribute("clarivum.tools.language", parsedInput.language);

      const rateResult = await evaluateRateLimit(rateLimitKey(request));
      span.setAttribute("clarivum.tools.rate_limit.ip.source", rateResult.ip.source);
      span.setAttribute("clarivum.tools.rate_limit.ip.remaining", rateResult.ip.remaining);
      span.setAttribute("clarivum.tools.rate_limit.ip.limit", rateResult.ip.limit);
      if (rateResult.global) {
        span.setAttribute("clarivum.tools.rate_limit.global.source", rateResult.global.source);
        span.setAttribute(
          "clarivum.tools.rate_limit.global.remaining",
          rateResult.global.remaining,
        );
        span.setAttribute("clarivum.tools.rate_limit.global.limit", rateResult.global.limit);
      }

      if (!rateResult.allowed) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "rate_limited",
        });
        span.setAttribute("clarivum.tools.rate_limited", true);

        if (parsedInput) {
          recordUvWidgetRateLimited({
            input: parsedInput,
            scope: rateResult.blockedScope ?? "ip",
            limit:
              (rateResult.blockedScope === "global"
                ? rateResult.global?.limit
                : rateResult.ip.limit) ?? rateResult.ip.limit,
            remaining:
              (rateResult.blockedScope === "global"
                ? rateResult.global?.remaining
                : rateResult.ip.remaining) ?? rateResult.ip.remaining,
            retryAfterSeconds: rateResult.retryAfterSeconds ?? 60,
          });
        }

        const retryAfter = rateResult.retryAfterSeconds ?? 60;

        return NextResponse.json(
          { error: "Too many requests. Please slow down." },
          {
            status: 429,
            headers: {
              "cache-control": "no-store",
              "retry-after": String(retryAfter),
              "x-ratelimit-limit": String(rateResult.ip.limit),
              "x-ratelimit-remaining": String(Math.max(0, rateResult.ip.remaining)),
              "x-ratelimit-reset": String(Math.ceil(rateResult.ip.resetAt / 1000)),
              "x-ratelimit-source": rateResult.ip.source,
              ...(rateResult.global
                ? {
                    "x-ratelimit-global-limit": String(rateResult.global.limit),
                    "x-ratelimit-global-remaining": String(
                      Math.max(0, rateResult.global.remaining),
                    ),
                    "x-ratelimit-global-reset": String(Math.ceil(rateResult.global.resetAt / 1000)),
                    "x-ratelimit-global-source": rateResult.global.source,
                  }
                : {}),
            },
          },
        );
      }

      const payload = await uvWidgetManager.getPayload(parsedInput);
      span.setAttribute("clarivum.tools.cache_status", payload.meta.cache_status ?? "miss");
      if (payload.meta.cache_source) {
        span.setAttribute("clarivum.tools.cache_source", payload.meta.cache_source);
      }
      span.setStatus({ code: SpanStatusCode.OK });
      span.setAttribute("clarivum.tools.response_risk", payload.risk_level);

      recordUvWidgetLoad({ input: parsedInput, result: payload });

      return NextResponse.json(payload, {
        status: 200,
        headers: {
          ...CACHE_HEADERS,
          "content-language": parsedInput.language,
          "x-ratelimit-limit": String(rateResult.ip.limit),
          "x-ratelimit-remaining": String(Math.max(0, rateResult.ip.remaining)),
          "x-ratelimit-reset": String(Math.ceil(rateResult.ip.resetAt / 1000)),
          "x-ratelimit-source": rateResult.ip.source,
          ...(rateResult.global
            ? {
                "x-ratelimit-global-limit": String(rateResult.global.limit),
                "x-ratelimit-global-remaining": String(Math.max(0, rateResult.global.remaining)),
                "x-ratelimit-global-reset": String(Math.ceil(rateResult.global.resetAt / 1000)),
                "x-ratelimit-global-source": rateResult.global.source,
              }
            : {}),
        },
      });
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });

      if (parsedInput) {
        const errorPayload = {
          input: parsedInput,
          error: error as Error,
          ...(parsedInput.fallbackReason ? { fallbackReason: parsedInput.fallbackReason } : {}),
        };
        recordUvWidgetError(errorPayload);
      }

      const message =
        (error as Error).message === "coordinate_out_of_range"
          ? "Latitude or longitude is outside the supported range."
          : (error as Error).message === "coordinates_incomplete"
            ? "Latitude and longitude must be provided together."
            : (error as Error).message === "city_query_too_long"
              ? "City query exceeds maximum length."
              : "Unable to process request.";

      const status =
        (error as Error).message === "coordinate_out_of_range" ||
        (error as Error).message === "coordinates_incomplete" ||
        (error as Error).message === "city_query_too_long"
          ? 400
          : 500;

      return NextResponse.json(
        { error: message },
        {
          status,
          headers: {
            "cache-control": "no-store",
          },
        },
      );
    } finally {
      span.end();
    }
  });
}
