import type { Core } from "@strapi/types";
import type { Context } from "koa";

export type HealthCheckOutcome = {
  component: string;
  healthy: boolean;
  durationMs: number;
  error?: string;
};

const AUTH_HEADER = "Cache-Control";
const AUTH_HEADER_VALUE = "no-store";

const pingDatabase = async (strapi: Core.Strapi): Promise<HealthCheckOutcome> => {
  const startedAt = Date.now();

  try {
    const connection = strapi.db?.connection as
      | { raw?: (sql: string) => Promise<unknown> }
      | undefined;

    if (!connection?.raw) {
      return {
        component: "database",
        healthy: false,
        durationMs: Date.now() - startedAt,
        error: "Database connection is not initialised.",
      };
    }

    await connection.raw("select 1+1 as result");

    return {
      component: "database",
      healthy: true,
      durationMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      component: "database",
      healthy: false,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
};

const buildResponse = (checks: HealthCheckOutcome[]) => {
  const healthy = checks.every((check) => check.healthy);

  return {
    healthy,
    checks,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Number(process.uptime().toFixed(3)),
    environment: process.env.NODE_ENV ?? "development",
  };
};

const healthzController = {
  async status(ctx: Context & { strapi: Core.Strapi }) {
    const checks: HealthCheckOutcome[] = [];

    checks.push(await pingDatabase(ctx.strapi));

    const response = buildResponse(checks);

    ctx.set(AUTH_HEADER, AUTH_HEADER_VALUE);
    ctx.status = response.healthy ? 200 : 503;
    ctx.body = response;
  },
};

export default healthzController;
