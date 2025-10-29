import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

type NextRequest = import("next/server").NextRequest;

vi.mock("next/cache", () => {
  return {
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
  };
});

const endpoint = "https://clarivum.test/api/revalidate";

async function loadHandlers() {
  const routes = await import("./route");
  return { POST: routes.POST, GET: routes.GET };
}

function toNextRequest(request: Request): NextRequest {
  return request as unknown as NextRequest;
}

describe("/api/revalidate", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    Reflect.deleteProperty(process.env, "STRAPI_REVALIDATE_SECRET");
    Reflect.deleteProperty(process.env, "REVALIDATE_TOKEN");
    vi.resetAllMocks();
  });

  test("GET requests are rejected with 405", async () => {
    const { GET } = await loadHandlers();
    const response = await GET();

    expect(response.status).toBe(405);
  });

  test("returns 503 when the secret is not configured", async () => {
    const { POST } = await loadHandlers();
    const response = await POST(toNextRequest(new Request(endpoint, { method: "POST" })));

    expect(response.status).toBe(503);
  });

  test("rejects requests with missing or invalid authorization header", async () => {
    process.env["STRAPI_REVALIDATE_SECRET"] = "super-secret";
    vi.resetModules();
    const { POST } = await loadHandlers();

    const response = await POST(toNextRequest(new Request(endpoint, { method: "POST" })));
    expect(response.status).toBe(401);
  });

  test("revalidates scoped paths and tags", async () => {
    process.env["STRAPI_REVALIDATE_SECRET"] = "super-secret";
    vi.resetModules();
    const { POST } = await loadHandlers();
    const { revalidatePath, revalidateTag } = await import("next/cache");

    const response = await POST(
      toNextRequest(
        new Request(`${endpoint}?scope=strapi`, {
          method: "POST",
          headers: {
            Authorization: "Bearer super-secret",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paths: ["/news"], tags: ["custom:tag"] }),
        }),
      ),
    );

    expect(response.status).toBe(202);
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/library");
    expect(revalidatePath).toHaveBeenCalledWith("/news");
    expect(revalidateTag).toHaveBeenCalledWith("strapi:content");
    expect(revalidateTag).toHaveBeenCalledWith("custom:tag");
  });

  test("returns 400 when no paths or tags are provided", async () => {
    process.env["STRAPI_REVALIDATE_SECRET"] = "super-secret";
    vi.resetModules();
    const { POST } = await loadHandlers();

    const response = await POST(
      toNextRequest(
        new Request(endpoint, {
          method: "POST",
          headers: {
            Authorization: "Bearer super-secret",
          },
        }),
      ),
    );

    expect(response.status).toBe(400);
  });
});
