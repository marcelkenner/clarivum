import { describe, expect, it } from "vitest";

import serverConfig from "../../config/server";

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

describe("config/server", () => {
  it("returns sane defaults when no environment variables are provided", () => {
    const ctx = buildContext();
    const config = serverConfig(ctx);

    expect(config.host).toBe("0.0.0.0");
    expect(config.port).toBe(1337);
    expect(config.app?.keys).toEqual([]);
  });

  it("respects overrides from the env helper", () => {
    const ctx = buildContext({
      HOST: "127.0.0.1",
      PORT: 8080,
      APP_KEYS: "a,b",
    });

    const config = serverConfig(ctx);

    expect(config.host).toBe("127.0.0.1");
    expect(config.port).toBe(8080);
    expect(config.app?.keys).toEqual(["a", "b"]);
  });
});
