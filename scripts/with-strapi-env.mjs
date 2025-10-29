#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const [command, ...commandArgs] = process.argv.slice(2);

if (!command) {
  console.error("Usage: node scripts/with-strapi-env.mjs <npm-script> [-- <args>]");
  process.exit(1);
}

const repoRoot = process.cwd();
const cmsDir = path.join(repoRoot, "cms");
const cmsPackageJson = path.join(cmsDir, "package.json");

if (!fs.existsSync(cmsPackageJson)) {
  console.error("Strapi workspace missing (cms/package.json not found).");
  process.exit(1);
}

const env = { ...process.env };

const defaults = {
  APP_KEYS: "local-app-key-1,local-app-key-2",
  API_TOKEN_SALT: "local-api-token-salt",
  ADMIN_JWT_SECRET: "local-admin-jwt-secret",
  TRANSFER_TOKEN_SALT: "local-transfer-token-salt",
  JWT_SECRET: "local-jwt-secret",
  ENCRYPTION_KEY: "local-encryption-key",
  DATABASE_CLIENT: "sqlite",
  DATABASE_FILENAME: ".tmp/data.db",
  HOST: "0.0.0.0",
  PORT: "1337",
  STRAPI_TELEMETRY_DISABLED: "true",
};

for (const [key, value] of Object.entries(defaults)) {
  if (!env[key]) {
    env[key] = value;
  }
}

if (!env.NODE_ENV) {
  if (command === "build" || command === "start") {
    env.NODE_ENV = "production";
  } else if (command === "test") {
    env.NODE_ENV = "test";
  } else {
    env.NODE_ENV = "development";
  }
}

if (!env.DATABASE_URL && env.DATABASE_CLIENT === "sqlite") {
  const filename = env.DATABASE_FILENAME || ".tmp/data.db";
  const sqlitePath = path.join(cmsDir, filename);
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
}

const npmExecutable = process.platform === "win32" ? "npm.cmd" : "npm";
const child = spawn(npmExecutable, ["run", command, ...commandArgs], {
  cwd: cmsDir,
  env,
  stdio: "inherit",
});

child.on("close", (code, signal) => {
  if (signal) {
    console.error(`Strapi command terminated with signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
