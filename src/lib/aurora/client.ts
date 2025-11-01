import { Pool, type PoolClient, type PoolConfig } from "pg";

type AuroraRole = "writer" | "reader";

interface PoolRegistry {
  writer?: Pool;
  reader?: Pool;
}

declare global {
  var __clarivumAuroraPools: PoolRegistry | undefined;
}

const globalKey = "__clarivumAuroraPools" satisfies keyof typeof globalThis;

const sharedPools: PoolRegistry = (globalThis[globalKey] ??= {});

export interface AuroraPoolOptions extends Omit<PoolConfig, "connectionString"> {
  /**
   * Optional Postgres search path. Values are joined with commas and supplied
   * via the connection `options` flag (`-c search_path=...`).
   */
  searchPath?: readonly string[] | string;
}

function requireEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function resolveConnectionString(role: AuroraRole): string {
  if (role === "reader") {
    return process.env["READ_DATABASE_URL"] ?? requireEnv("DATABASE_URL");
  }
  return requireEnv("DATABASE_URL");
}

function shouldEnableSsl(): boolean {
  const raw = process.env["DATABASE_SSL"] ?? "";
  if (raw === "") {
    return false;
  }
  return ["1", "true", "yes"].includes(raw.toLowerCase());
}

function resolveSearchPath(searchPath: AuroraPoolOptions["searchPath"]): string | undefined {
  if (!searchPath) {
    return undefined;
  }
  if (Array.isArray(searchPath)) {
    return searchPath.join(",");
  }
  if (typeof searchPath === "string") {
    return searchPath;
  }
  return undefined;
}

function buildPoolConfig(role: AuroraRole, options: AuroraPoolOptions = {}): PoolConfig {
  const connectionString = resolveConnectionString(role);
  const {
    searchPath,
    application_name: providedAppName,
    max: providedMax,
    idleTimeoutMillis: providedIdle,
    ...rest
  } = options;

  const maxFromEnv = parseInt(process.env["DATABASE_POOL_MAX"] ?? "", 10);
  const idleFromEnv = parseInt(process.env["DATABASE_IDLE_TIMEOUT_MS"] ?? "", 10);

  const config: PoolConfig = {
    connectionString,
    max: Number.isNaN(providedMax ?? maxFromEnv) ? undefined : (providedMax ?? maxFromEnv),
    idleTimeoutMillis: Number.isNaN(providedIdle ?? idleFromEnv)
      ? undefined
      : (providedIdle ?? idleFromEnv),
    application_name:
      providedAppName ?? process.env["DATABASE_APPLICATION_NAME"] ?? "clarivum-next-app",
    keepAlive: true,
    ...rest,
  };

  if (shouldEnableSsl()) {
    config.ssl = { rejectUnauthorized: false };
  }

  const mergedOptions: string[] = [];
  if (config.options) {
    mergedOptions.push(config.options);
  }

  const searchPathValue = resolveSearchPath(searchPath);
  if (searchPathValue) {
    mergedOptions.push(`-c search_path=${searchPathValue}`);
  }

  if (mergedOptions.length > 0) {
    config.options = mergedOptions.join(" ");
  }

  return config;
}

/**
 * Creates a new Aurora connection pool. Use `getAuroraPool` unless you
 * explicitly need an isolated pool instance.
 */
export function createAuroraPool(role: AuroraRole = "writer", options?: AuroraPoolOptions): Pool {
  return new Pool(buildPoolConfig(role, options));
}

/**
 * Returns the shared Aurora pool for the requested role. Callers should favour
 * this helper over creating ad-hoc pools to keep the connection footprint
 * predictable, especially in serverless/hybrid runtimes.
 */
export function getAuroraPool(role: AuroraRole = "writer"): Pool {
  const existing = sharedPools[role];
  if (existing) {
    return existing;
  }

  const pool = createAuroraPool(role);
  sharedPools[role] = pool;
  return pool;
}

/**
 * Executes a callback within a transaction. Automatically rolls back on
 * failure and releases the connection regardless of outcome.
 */
export async function withAuroraTransaction<T>(
  role: AuroraRole,
  handler: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getAuroraPool(role).connect();
  try {
    await client.query("BEGIN");
    const result = await handler(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export type AuroraPool = Pool;
export type AuroraClient = PoolClient;
