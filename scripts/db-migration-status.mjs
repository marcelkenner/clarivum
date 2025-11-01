#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { promises as fs } from "node:fs";
import { createDatabaseUrlProvider } from "./lib/database-url-provider.mjs";
import { loadPgModule, PgModuleMissingError } from "./lib/postgres-module-loader.mjs";
import { AwsSecretsManagerModuleMissingError } from "./lib/secrets-manager-module-loader.mjs";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "database/migrations");
const MIGRATIONS_TABLE = "public.schema_migrations";
const databaseUrlProvider = createDatabaseUrlProvider();
const { Client } = await loadPgModule({ label: "db:migration:status" });

function parseArgs(argv) {
  const args = { env: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--env" || value === "-e") {
      args.env = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function shouldEnableSsl() {
  const raw = process.env.DATABASE_SSL;
  if (!raw) return false;
  return ["1", "true", "yes"].includes(raw.toLowerCase());
}

async function ensureTableExists(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id bigserial PRIMARY KEY,
      name text NOT NULL UNIQUE,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function listMigrationFiles() {
  const entries = await fs.readdir(MIGRATIONS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();
}

async function readApplied(client) {
  const result = await client.query(
    `SELECT name, applied_at FROM ${MIGRATIONS_TABLE} ORDER BY name ASC`,
  );
  return result.rows;
}

function printTable(rows) {
  if (rows.length === 0) {
    console.log("No migrations recorded yet.");
    return;
  }

  const header = `${"Status".padEnd(10)}  ${"Migration".padEnd(60)}  Applied At`;
  console.log(header);
  console.log("-".repeat(header.length));
  for (const row of rows) {
    console.log(
      `${row.status.padEnd(10)}  ${row.name.padEnd(60)}  ${row.applied_at ?? ""}`,
    );
  }
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  if (args.env) {
    console.log(`[db:migration:status] Target environment: ${args.env}`);
  }

  const connectionString = await databaseUrlProvider.getConnectionString({
    env: args.env,
    label: "db:migration:status",
  });
  const client = new Client({
    connectionString,
    ssl: shouldEnableSsl() ? { rejectUnauthorized: false } : undefined,
    application_name: process.env.DATABASE_APPLICATION_NAME ?? "clarivum-db-migration-status",
  });

  await client.connect();
  try {
    await ensureTableExists(client);

    const [files, applied] = await Promise.all([listMigrationFiles(), readApplied(client)]);
    const appliedMap = new Map(applied.map((row) => [row.name, row.applied_at]));

    const rows = files.map((file) => ({
      name: file,
      applied_at: appliedMap.get(file) ?? null,
      status: appliedMap.has(file) ? "applied" : "pending",
    }));

    printTable(rows);

    const pendingCount = rows.filter((row) => row.status === "pending").length;
    console.log(`\nPending migrations: ${pendingCount}`);
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  if (error instanceof PgModuleMissingError || error instanceof AwsSecretsManagerModuleMissingError) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
