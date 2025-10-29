import { NextResponse } from "next/server";

import type { AnalyticsEventRequest } from "@/lib/analytics/dispatch";
import { forwardAnalyticsEventToPlausible } from "@/lib/analytics/server/plausible";

type WebVitalsEventRequest = AnalyticsEventRequest<"WebVitalsMetric">;

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!isWebVitalsEvent(payload)) {
    return NextResponse.json({ error: "Unsupported analytics payload" }, { status: 400 });
  }

  const result = await forwardAnalyticsEventToPlausible(payload);

  if (result.status === "sent") {
    return new Response(null, { status: 204 });
  }

  if (result.status === "skipped") {
    console.warn(
      "[analytics] WebVitalsMetric event skipped because Plausible configuration is missing.",
    );
    return NextResponse.json(
      { status: "skipped", reason: result.reason },
      { status: 202, headers: { "cache-control": "no-store" } },
    );
  }

  console.error("[analytics] Failed to forward WebVitalsMetric event", {
    reason: result.reason,
    statusCode: result.statusCode,
    responseBody: result.body,
  });

  return NextResponse.json(
    { error: "Failed to forward analytics event" },
    { status: result.statusCode ?? 502, headers: { "cache-control": "no-store" } },
  );
}

function isWebVitalsEvent(value: unknown): value is WebVitalsEventRequest {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<Record<string, unknown>>;

  if (record["name"] !== "WebVitalsMetric") {
    return false;
  }

  const props = record["props"];
  if (typeof props !== "object" || props === null) {
    return false;
  }

  const metrics = props as Partial<Record<string, unknown>>;

  return (
    typeof metrics["id"] === "string" &&
    typeof metrics["name"] === "string" &&
    typeof metrics["value"] === "number" &&
    typeof metrics["navigationType"] === "string" &&
    (record["url"] === undefined || typeof record["url"] === "string") &&
    (record["referrer"] === undefined || typeof record["referrer"] === "string")
  );
}
