import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type NextRequest = import("next/server").NextRequest;

const AUTH_SCHEME = "Bearer ";
const REVALIDATE_SECRET =
  process.env["STRAPI_REVALIDATE_SECRET"] ?? process.env["REVALIDATE_TOKEN"] ?? "";

type RevalidatePayload = {
  paths?: string[];
  tags?: string[];
  invalidateStatic?: boolean;
};

const scopeRegistry: Record<
  string,
  {
    paths?: string[];
    tags?: string[];
  }
> = {
  strapi: {
    paths: ["/", "/library"],
    tags: ["strapi:content"],
  },
  homepage: {
    paths: ["/"],
  },
};

function unauthorized(): NextResponse {
  return NextResponse.json(
    { error: "Unauthorized" },
    {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

function unavailable(): NextResponse {
  return NextResponse.json(
    { error: "Revalidation secret is not configured." },
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

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value
      .split(",")
      .map((segment) => segment.trim())
      .filter(Boolean);
  }

  return [];
}

function collectScopeNames(searchParams: URLSearchParams): string[] {
  const scopes = searchParams.getAll("scope");

  if (scopes.length === 0) {
    return [];
  }

  const unique = new Set<string>();
  for (const scope of scopes) {
    const normalized = scope.toLowerCase().trim();
    if (normalized && scopeRegistry[normalized]) {
      unique.add(normalized);
    }
  }

  return Array.from(unique);
}

async function parsePayload(request: NextRequest): Promise<RevalidatePayload | { error: string }> {
  if (!request.body) {
    return {};
  }

  try {
    const body = await request.json();

    if (body && typeof body === "object") {
      const payload = body as Record<string, unknown>;

      const paths = normalizeList(payload["paths"]);
      const tags = normalizeList(payload["tags"]);

      return {
        paths,
        tags,
        invalidateStatic: payload["invalidateStatic"] === true,
      };
    }

    return {};
  } catch {
    return { error: "Malformed JSON payload." };
  }
}

export async function POST(request: NextRequest) {
  if (!REVALIDATE_SECRET) {
    return unavailable();
  }

  const authorization = request.headers.get("authorization");
  const token =
    authorization && authorization.startsWith(AUTH_SCHEME)
      ? authorization.slice(AUTH_SCHEME.length)
      : undefined;

  if (!token || token !== REVALIDATE_SECRET) {
    return unauthorized();
  }

  const parsedPayload = await parsePayload(request);
  if ("error" in parsedPayload) {
    return badRequest(parsedPayload.error);
  }

  const scopeNames = collectScopeNames(request.nextUrl.searchParams);
  const paths = new Set<string>();
  const tags = new Set<string>();

  for (const scopeName of scopeNames) {
    const scope = scopeRegistry[scopeName];
    scope?.paths?.forEach((path) => paths.add(path));
    scope?.tags?.forEach((tag) => tags.add(tag));
  }

  parsedPayload.paths?.forEach((path) => paths.add(path));
  parsedPayload.tags?.forEach((tag) => tags.add(tag));

  if (paths.size === 0 && tags.size === 0) {
    return badRequest("No paths or tags to revalidate.");
  }

  const revalidated: { paths: string[]; tags: string[] } = {
    paths: Array.from(paths),
    tags: Array.from(tags),
  };

  try {
    for (const path of revalidated.paths) {
      revalidatePath(path);
    }

    for (const tag of revalidated.tags) {
      revalidateTag(tag);
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to revalidate.",
        details: error instanceof Error ? error.message : undefined,
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  return NextResponse.json(
    {
      revalidated,
      scopes: scopeNames,
      timestamp: new Date().toISOString(),
    },
    {
      status: 202,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export function GET() {
  return NextResponse.json(
    { error: "Use POST to trigger revalidation." },
    {
      status: 405,
      headers: {
        Allow: "POST",
        "Cache-Control": "no-store",
      },
    },
  );
}
