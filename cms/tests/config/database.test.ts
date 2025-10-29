import path from "path";

import { describe, expect, it } from "vitest";

import databaseConfig from "../../config/database";

import type { ConfigContext, StrapiEnv } from "../../config/types";

const createEnv = (overrides: Record<string, unknown> = {}): StrapiEnv => {
  const store = new Map<string, unknown>(Object.entries(overrides));

  const envFn = ((key: string, defaultValue?: string) => {
    const value = store.get(key);
    if (value === undefined || value === null) {
      return defaultValue ?? "";
    }

    return String(value);
  }) as StrapiEnv;

  envFn.bool = (key: string, defaultValue?: boolean) => {
    const raw = store.get(key);
    if (raw === undefined || raw === null) {
      return defaultValue ?? false;
    }

    if (typeof raw === "boolean") {
      return raw;
    }

    return ["true", "1", "yes", "on"].includes(String(raw).toLowerCase());
  };

  envFn.int = (key: string, defaultValue?: number) => {
    const raw = store.get(key);
    if (raw === undefined || raw === null) {
      return defaultValue ?? 0;
    }

    const parsed = Number.parseInt(String(raw), 10);

    if (Number.isNaN(parsed)) {
      return defaultValue ?? 0;
    }

    return parsed;
  };

  envFn.array = (key: string, defaultValue?: string[]) => {
    const raw = store.get(key);
    if (raw === undefined || raw === null) {
      return defaultValue ?? [];
    }

    if (Array.isArray(raw)) {
      return raw.map((value) => String(value));
    }

    return String(raw)
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  };

  return envFn;
};

const buildContext = (overrides: Record<string, unknown> = {}): ConfigContext => ({
  env: createEnv(overrides),
});

describe("config/database", () => {
  it("defaults to postgres when an unsupported client is provided", () => {
    const ctx = buildContext({
      DATABASE_CLIENT: "sqlserver",
    });

    const config = databaseConfig(ctx);
    expect(config.connection.client).toBe("postgres");
  });

  it("builds sqlite configuration when requested", () => {
    const ctx = buildContext({
      DATABASE_CLIENT: "sqlite",
      DATABASE_FILENAME: "db.sqlite",
    });

    const config = databaseConfig(ctx);

    expect(config.connection.client).toBe("sqlite");
    const sqliteConfig = config.connection.connection as { filename: string };

    expect(sqliteConfig).toHaveProperty("filename");
    expect(path.basename(sqliteConfig.filename)).toBe("db.sqlite");
    expect(path.isAbsolute(sqliteConfig.filename)).toBe(true);
  });

  it("honours pool configuration for postgres", () => {
    const ctx = buildContext({
      DATABASE_CLIENT: "postgres",
      DATABASE_POOL_MIN: 4,
      DATABASE_POOL_MAX: 16,
    });

    const config = databaseConfig(ctx);
    expect(config.connection.pool).toEqual({ min: 4, max: 16 });
  });
});
