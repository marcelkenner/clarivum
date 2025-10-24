import { beforeEach, describe, expect, it } from "vitest";

import type { ClarivumEnvironmentName } from "@/config/environment/Environment";
import { EnvironmentManager } from "@/config/environment/EnvironmentManager";

type MutableEnv = Record<string, string | undefined>;

describe("EnvironmentManager", () => {
  let variables: MutableEnv;
  let manager: EnvironmentManager;

  beforeEach(() => {
    variables = {};
    manager = new EnvironmentManager(variables as NodeJS.ProcessEnv);
  });

  const getName = (): ClarivumEnvironmentName => manager.getEnvironment().name;

  it("prefers the explicit Clarivum environment variable", () => {
    variables["CLARIVUM_ENVIRONMENT"] = "prod";
    expect(getName()).toBe("prod");
  });

  it("falls back to the public environment variable", () => {
    variables["NEXT_PUBLIC_CLARIVUM_ENVIRONMENT"] = "development";
    expect(getName()).toBe("dev");
  });

  it("maps NODE_ENV=production to prod", () => {
    variables["NODE_ENV"] = "production";
    expect(getName()).toBe("prod");
  });

  it("defaults to dev when no variables set", () => {
    expect(getName()).toBe("dev");
  });

  it("throws when the value cannot be normalized", () => {
    variables["CLARIVUM_ENVIRONMENT"] = "staging";
    expect(() => getName()).toThrowError('Unsupported Clarivum environment "staging"');
  });

  it("caches the computed environment instance", () => {
    variables["CLARIVUM_ENVIRONMENT"] = "prod";
    const first = manager.getEnvironment();
    const second = manager.getEnvironment();

    expect(first).toBe(second);
  });

  it("recomputes after clearing the cache", () => {
    variables["CLARIVUM_ENVIRONMENT"] = "dev";
    const initial = manager.getEnvironment();
    variables["CLARIVUM_ENVIRONMENT"] = "prod";

    manager.clearCache();
    const updated = manager.getEnvironment();

    expect(initial).not.toBe(updated);
    expect(updated.name).toBe("prod");
  });
});
