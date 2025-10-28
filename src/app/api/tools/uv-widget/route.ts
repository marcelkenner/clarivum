import { createHash } from "node:crypto";

import { SpanStatusCode, trace } from "@opentelemetry/api";
import { NextResponse } from "next/server";

import { uvWidgetManager } from "./lib/manager";
import { evaluateRateLimit } from "./lib/rate-limit";
import { parseRequestInput } from "./lib/request";

import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const tracer = trace.getTracer("clarivum.api.tools");

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
    try {
      const rateResult = await evaluateRateLimit(rateLimitKey(request));
      span.setAttribute("clarivum.tools.rate_limit.source", rateResult.source);
      span.setAttribute("clarivum.tools.rate_limit.remaining", rateResult.remaining);
      span.setAttribute("clarivum.tools.rate_limit.limit", rateResult.limit);

      if (!rateResult.allowed) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: "rate_limited",
        });
        span.setAttribute("clarivum.tools.rate_limited", true);
        return NextResponse.json(
          { error: "Too many requests. Please slow down." },
          {
            status: 429,
            headers: {
              "cache-control": "no-store",
              "retry-after": String(rateResult.retryAfterSeconds ?? 60),
              "x-ratelimit-limit": String(rateResult.limit),
              "x-ratelimit-remaining": String(rateResult.remaining),
              "x-ratelimit-reset": String(Math.ceil(rateResult.resetAt / 1000)),
              "x-ratelimit-source": rateResult.source,
            },
          },
        );
      }

      const parsedInput = parseRequestInput(request);
      span.setAttribute("clarivum.tools.locale", parsedInput.locale);
      span.setAttribute("clarivum.tools.language", parsedInput.language);

      const payload = await uvWidgetManager.getPayload(parsedInput);
      span.setAttribute("clarivum.tools.cache_status", payload.meta.cache_status ?? "miss");
      if (payload.meta.cache_source) {
        span.setAttribute("clarivum.tools.cache_source", payload.meta.cache_source);
      }
      span.setStatus({ code: SpanStatusCode.OK });
      span.setAttribute("clarivum.tools.response_risk", payload.risk_level);

      return NextResponse.json(payload, {
        status: 200,
        headers: {
          ...CACHE_HEADERS,
          "content-language": parsedInput.language,
          "x-ratelimit-limit": String(rateResult.limit),
          "x-ratelimit-remaining": String(rateResult.remaining),
          "x-ratelimit-reset": String(Math.ceil(rateResult.resetAt / 1000)),
          "x-ratelimit-source": rateResult.source,
        },
      });
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });

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
