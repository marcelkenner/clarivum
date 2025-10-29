import { describe, expect, it, vi } from "vitest";

import controller, { type HealthCheckOutcome } from "../../../src/api/healthz/controllers/healthz";

type HealthzResponse = {
  healthy: boolean;
  checks: HealthCheckOutcome[];
};

type MockCtx = {
  strapi: {
    db: {
      connection: {
        raw: ReturnType<typeof vi.fn>;
      };
    };
  };
  set: ReturnType<typeof vi.fn>;
  status: number;
  body: HealthzResponse | null;
} & Record<string, unknown>;

const createCtx = (overrides: Partial<MockCtx> = {}): MockCtx => {
  const set = vi.fn();
  const ctx: MockCtx = {
    strapi: {
      db: {
        connection: {
          raw: vi.fn().mockResolvedValue([{ result: 2 }]),
        },
      },
    },
    set,
    status: 0,
    body: null,
    ...overrides,
  };

  return ctx;
};

describe("api::healthz.healthz controller", () => {
  it("returns 200 when dependencies respond", async () => {
    const ctx = createCtx();

    await controller.status(ctx as unknown as Parameters<(typeof controller)["status"]>[0]);

    expect(ctx.status).toBe(200);
    expect(ctx.body).not.toBeNull();
    expect(ctx.body?.healthy).toBe(true);
    expect(ctx.body?.checks[0]).toMatchObject({ component: "database", healthy: true });
    expect(ctx.set).toHaveBeenCalledWith("Cache-Control", "no-store");
  });

  it("propagates dependency failures", async () => {
    const ctx = createCtx({
      strapi: {
        db: {
          connection: {
            raw: vi.fn().mockRejectedValue(new Error("boom")),
          },
        },
      },
    });

    await controller.status(ctx as unknown as Parameters<(typeof controller)["status"]>[0]);

    expect(ctx.status).toBe(503);
    expect(ctx.body).not.toBeNull();
    expect(ctx.body?.healthy).toBe(false);
    expect(ctx.body?.checks[0]).toMatchObject({
      component: "database",
      healthy: false,
      error: "boom",
    });
  });
});
