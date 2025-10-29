import { SpanStatusCode, trace } from "@opentelemetry/api";
import { NextRequest, NextResponse } from "next/server";

type DeploymentEventPayload = {
  service: string;
  environment: string;
  status: string;
  version?: string;
  image?: string;
  digest?: string;
  sha?: string;
  workflowUrl?: string;
  triggeredAt: string;
  metadata?: Record<string, unknown>;
};

const AUTH_SCHEME = "Bearer ";
const DEPLOYMENT_SECRET = process.env.OBSERVABILITY_DEPLOYMENT_SECRET;
const tracer = trace.getTracer("clarivum.observability.deployments");

function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: "Unauthorized" },
    {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

function serviceUnavailable(message: string): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

function badRequest(message: string): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeMetadata(value: unknown): Record<string, unknown> | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return undefined;
}

function parsePayload(body: unknown): DeploymentEventPayload | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object." };
  }

  const candidate = body as Record<string, unknown>;
  const service = normalizeString(candidate["service"]);
  const environment = normalizeString(candidate["environment"]);
  const status = normalizeString(candidate["status"]);

  if (!service || !environment || !status) {
    return {
      error: "Fields `service`, `environment`, and `status` are required strings.",
    };
  }

  const version = normalizeString(candidate["version"]);
  const image = normalizeString(candidate["image"]);
  const digest = normalizeString(candidate["digest"]);
  const sha = normalizeString(candidate["sha"]);
  const workflowUrl = normalizeString(candidate["workflowUrl"]);
  const metadata = normalizeMetadata(candidate["metadata"]);

  const triggeredAtCandidate = normalizeString(candidate["triggeredAt"]);

  const timestamp = triggeredAtCandidate ? new Date(triggeredAtCandidate) : new Date();

  if (Number.isNaN(timestamp.getTime())) {
    return { error: "`triggeredAt` must be an ISO-8601 timestamp." };
  }

  const payload: DeploymentEventPayload = {
    service,
    environment,
    status,
    triggeredAt: timestamp.toISOString(),
  };

  if (version) {
    payload.version = version;
  }

  if (image) {
    payload.image = image;
  }

  if (digest) {
    payload.digest = digest;
  }

  if (sha) {
    payload.sha = sha;
  }

  if (workflowUrl) {
    payload.workflowUrl = workflowUrl;
  }

  if (metadata) {
    payload.metadata = metadata;
  }

  return payload;
}

export async function POST(request: NextRequest) {
  if (!DEPLOYMENT_SECRET) {
    return serviceUnavailable("OBSERVABILITY_DEPLOYMENT_SECRET is not configured.");
  }

  const authorization = request.headers.get("authorization");
  const token =
    authorization && authorization.startsWith(AUTH_SCHEME)
      ? authorization.slice(AUTH_SCHEME.length)
      : undefined;

  if (!token || token !== DEPLOYMENT_SECRET) {
    return unauthorizedResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Malformed JSON payload.");
  }

  const parsed = parsePayload(body);

  if ("error" in parsed) {
    return badRequest(parsed.error);
  }

  const response = tracer.startActiveSpan("observability.deployment.webhook", (span) => {
    try {
      span.setAttribute("deployment.service", parsed.service);
      span.setAttribute("deployment.environment", parsed.environment);
      span.setAttribute("deployment.status", parsed.status);
      span.setAttribute("deployment.triggered_at", parsed.triggeredAt);

      if (parsed.version) {
        span.setAttribute("deployment.version", parsed.version);
      }

      if (parsed.image) {
        span.setAttribute("deployment.image", parsed.image);
      }

      if (parsed.digest) {
        span.setAttribute("deployment.digest", parsed.digest);
      }

      if (parsed.sha) {
        span.setAttribute("deployment.sha", parsed.sha);
      }

      if (parsed.workflowUrl) {
        span.setAttribute("deployment.workflow_url", parsed.workflowUrl);
      }

      if (parsed.metadata) {
        span.setAttribute("deployment.metadata_json", JSON.stringify(parsed.metadata));
      }

      span.addEvent("deployment.event.received", {
        "deployment.service": parsed.service,
        "deployment.environment": parsed.environment,
        "deployment.status": parsed.status,
        "deployment.triggered_at": parsed.triggeredAt,
      });

      span.setStatus({ code: SpanStatusCode.OK });

      return NextResponse.json(
        { accepted: true },
        {
          status: 202,
          headers: { "Cache-Control": "no-store" },
        },
      );
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: "failed_to_emit_deployment_event" });

      return NextResponse.json(
        { error: "Failed to emit deployment event." },
        {
          status: 500,
          headers: { "Cache-Control": "no-store" },
        },
      );
    } finally {
      span.end();
    }
  });

  return response;
}
