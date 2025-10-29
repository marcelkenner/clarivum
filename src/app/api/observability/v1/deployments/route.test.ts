import type { NextRequest } from "next/server";
import { afterEach, describe, expect, test, vi } from "vitest";

const endpoint = "https://clarivum.test/api/observability/v1/deployments";

async function loadHandler() {
  const module = await import("./route");
  return module.POST;
}

function toNextRequest(request: Request): NextRequest {
  return request as unknown as NextRequest;
}

describe("POST /api/observability/v1/deployments", () => {
  afterEach(() => {
    Reflect.deleteProperty(process.env, "OBSERVABILITY_DEPLOYMENT_SECRET");
    vi.resetModules();
  });

  test("returns 503 when the deployment secret is missing", async () => {
    const POST = await loadHandler();
    const response = await POST(toNextRequest(new Request(endpoint, { method: "POST" })));

    expect(response.status).toBe(503);
  });

  test("rejects unauthorized requests", async () => {
    process.env.OBSERVABILITY_DEPLOYMENT_SECRET = "super-secret";
    vi.resetModules();
    const POST = await loadHandler();
    const response = await POST(toNextRequest(new Request(endpoint, { method: "POST" })));

    expect(response.status).toBe(401);
  });

  test("accepts valid payloads and emits deployment spans", async () => {
    process.env.OBSERVABILITY_DEPLOYMENT_SECRET = "super-secret";
    vi.resetModules();
    const POST = await loadHandler();

    const payload = {
      service: "clarivum-strapi",
      environment: "dev",
      status: "success",
      version: "1.2.3",
      image: "123.dkr.ecr.eu/clarivum/strapi:1.2.3",
    };

    const response = await POST(
      toNextRequest(
        new Request(endpoint, {
          method: "POST",
          headers: {
            Authorization: "Bearer super-secret",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }),
      ),
    );

    expect(response.status).toBe(202);
  });
});
