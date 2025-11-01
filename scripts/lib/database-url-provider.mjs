import process from "node:process";
import { loadSecretsManagerModule } from "./secrets-manager-module-loader.mjs";

const DEFAULT_REGION = "eu-central-1";

export class SecretsManagerGateway {
  constructor({ moduleLoader = loadSecretsManagerModule } = {}) {
    this.moduleLoader = moduleLoader;
    this.clientsByRegion = new Map();
    this.modulePromise = undefined;
  }

  async getSecretString({ secretId, region, label }) {
    const { SecretsManagerClient, GetSecretValueCommand } = await this.#loadModule(label);
    const client = this.#getClient(region, SecretsManagerClient);
    const response = await client.send(new GetSecretValueCommand({ SecretId: secretId }));
    if (response.SecretString) {
      return response.SecretString;
    }
    if (response.SecretBinary) {
      return Buffer.from(response.SecretBinary, "base64").toString("utf8");
    }
    throw new Error(`Secret ${secretId} did not contain a string or binary value.`);
  }

  #getClient(region, SecretsManagerClient) {
    if (!this.clientsByRegion.has(region)) {
      this.clientsByRegion.set(region, new SecretsManagerClient({ region }));
    }
    return this.clientsByRegion.get(region);
  }

  async #loadModule(label) {
    if (!this.modulePromise) {
      this.modulePromise = Promise.resolve().then(() => this.moduleLoader({ label }));
    }
    return this.modulePromise;
  }
}

export class DatabaseUrlProvider {
  constructor({
    gateway = new SecretsManagerGateway(),
    defaultRegion = DEFAULT_REGION,
  } = {}) {
    this.gateway = gateway;
    this.defaultRegion = defaultRegion;
  }

  async getConnectionString({ env, label }) {
    const existing = process.env.DATABASE_URL;
    if (existing) {
      return existing;
    }

    if (!env) {
      const prefix = label ? `[${label}]` : "[db:migrate]";
      throw new Error(
        `${prefix} DATABASE_URL is not set and no --env flag was provided. Export DATABASE_URL or run with --env <env> to load it automatically.`,
      );
    }

    const region = this.#resolveRegion();
    const prefix = label ? `[${label}]` : "[db:migrate]";
    const secretIds = this.#buildSecretIds(env);

    let lastError;
    for (const secretId of secretIds) {
      console.log(`${prefix} Loading DATABASE_URL from Secrets Manager (${secretId}) in ${region}.`);
      try {
        const secretString = await this.gateway.getSecretString({
          secretId,
          region,
          label: label ?? "db:migrate",
        });
        const connectionString = this.#parseSecret(secretString, secretId, prefix);
        process.env.DATABASE_URL = connectionString;
        console.log(`${prefix} Resolved DATABASE_URL via Secrets Manager.`);
        return connectionString;
      } catch (error) {
        lastError = error;
        if (error && error.name === "ResourceNotFoundException") {
          continue;
        }
        throw error;
      }
    }

    const attempted = secretIds.join(", ");
    throw new Error(
      `${prefix} Unable to resolve DATABASE_URL from Secrets Manager (attempted: ${attempted}).`,
      { cause: lastError },
    );
  }

  #resolveRegion() {
    return (
      process.env.AWS_REGION ??
      process.env.AWS_DEFAULT_REGION ??
      this.defaultRegion
    );
  }

  #buildSecretIds(env) {
    const withoutLeadingSlash = `clarivum/platform/${env}/database/url`;
    const withLeadingSlash = `/${withoutLeadingSlash}`;
    return [withoutLeadingSlash, withLeadingSlash];
  }

  #parseSecret(secretString, secretId, prefix) {
    if (!secretString) {
      throw new Error(`${prefix} Secret ${secretId} returned an empty payload.`);
    }

    const trimmed = secretString.trim();
    if (!trimmed) {
      throw new Error(`${prefix} Secret ${secretId} returned whitespace only.`);
    }

    try {
      const parsed = JSON.parse(trimmed);
      const candidate = this.#extractDatabaseUrl(parsed);
      if (candidate) {
        return candidate;
      }
    } catch {
      if (this.#looksLikeConnectionString(trimmed)) {
        return trimmed;
      }
    }

    throw new Error(`${prefix} Secret ${secretId} does not contain a DATABASE_URL value.`);
  }

  #extractDatabaseUrl(payload) {
    if (typeof payload === "string" && this.#looksLikeConnectionString(payload)) {
      return payload;
    }

    if (payload && typeof payload === "object") {
      const candidate =
        payload.DATABASE_URL ??
        payload.databaseUrl ??
        payload.url ??
        (typeof payload.Result === "string" ? this.#extractFromResult(payload.Result) : undefined);
      if (typeof candidate === "string" && this.#looksLikeConnectionString(candidate)) {
        return candidate;
      }
    }

    return undefined;
  }

  #extractFromResult(resultString) {
    try {
      const parsed = JSON.parse(resultString);
      if (parsed && typeof parsed === "object") {
        const candidate = parsed.DATABASE_URL ?? parsed.databaseUrl ?? parsed.url;
        if (typeof candidate === "string" && this.#looksLikeConnectionString(candidate)) {
          return candidate;
        }
      }
    } catch {
      if (this.#looksLikeConnectionString(resultString)) {
        return resultString;
      }
    }
    return undefined;
  }

  #looksLikeConnectionString(value) {
    return typeof value === "string" && value.startsWith("postgres");
  }
}

export function createDatabaseUrlProvider(options) {
  return new DatabaseUrlProvider(options);
}
