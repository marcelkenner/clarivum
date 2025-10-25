import { NextResponse } from "next/server";

import { readTelemetryConfig } from "../../../../../../observability/config";

import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const config = readTelemetryConfig();

const upstreamAuthHeader =
  config.basicAuthToken !== undefined ? `Basic ${config.basicAuthToken}` : undefined;

export async function POST(request: NextRequest) {
  if (!config.traceEndpoint || !upstreamAuthHeader) {
    return NextResponse.json({ error: "Tracer endpoint is not configured" }, { status: 503 });
  }

  const body = await request.arrayBuffer();
  const contentType = request.headers.get("content-type") ?? "application/x-protobuf";

  const upstreamResponse = await fetch(config.traceEndpoint, {
    method: "POST",
    headers: {
      authorization: upstreamAuthHeader,
      "content-type": contentType,
      "x-otel-source": "clarivum-nextjs-proxy",
    },
    body: Buffer.from(body),
  });

  if (!upstreamResponse.ok) {
    const payload = await upstreamResponse.text();
    return NextResponse.json(
      { error: "Grafana ingest rejected payload", details: payload },
      { status: upstreamResponse.status },
    );
  }

  return new NextResponse(null, { status: 204 });
}
