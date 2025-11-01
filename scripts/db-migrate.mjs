#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createDatabaseUrlProvider } from "./lib/database-url-provider.mjs";
import { loadPgModule, PgModuleMissingError } from "./lib/postgres-module-loader.mjs";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "database/migrations");
const MIGRATIONS_TABLE = "public.schema_migrations";
const databaseUrlProvider = createDatabaseUrlProvider();
const { Client } = await loadPgModule({ label: "db:migrate" });

function parseArgs(argv) {
  const args = { env: undefined, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--env" || value === "-e") {
      args.env = argv[i + 1];
      i += 1;
    } else if (value === "--dry-run") {
      args.dryRun = true;
    }
  }
  return args;
}

function shouldEnableSsl() {
  const raw = process.env.DATABASE_SSL;
  if (!raw) return false;
  return ["1", "true", "yes"].includes(raw.toLowerCase());
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id bigserial PRIMARY KEY,
      name text NOT NULL UNIQUE,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function loadMigrationFiles() {
  const entries = await fs.readdir(MIGRATIONS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();
}

async function readAppliedMigrations(client) {
  const result = await client.query(
    `SELECT name FROM ${MIGRATIONS_TABLE} ORDER BY name ASC`,
  );
  return new Set(result.rows.map((row) => row.name));
}

async function applyMigration(client, filename, dryRun) {
  const filePath = path.join(MIGRATIONS_DIR, filename);
  const sql = await fs.readFile(filePath, "utf8");

  console.log(`\n[db:migrate] Applying ${filename}`);
  if (dryRun) {
    console.log("[db:migrate] Dry run enabled — skipping execution.");
    return;
  }

  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query(
      `INSERT INTO ${MIGRATIONS_TABLE} (name, applied_at) VALUES ($1, now())`,
      [filename],
    );
    await client.query("COMMIT");
    console.log(`[db:migrate] ✅ ${filename} applied.`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(`[db:migrate] ❌ Failed to apply ${filename}`);
    throw error;
  }
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  if (args.env) {
    console.log(`[db:migrate] Target environment: ${args.env}`);
  }

  const connectionString = await databaseUrlProvider.getConnectionString({
    env: args.env,
    label: "db:migrate",
  });
  const client = new Client({
    connectionString,
    ssl: shouldEnableSsl() ? { rejectUnauthorized: false } : undefined,
    application_name: process.env.DATABASE_APPLICATION_NAME ?? "clarivum-db-migrate",
  });

  await client.connect();
  try {
    await ensureMigrationsTable(client);

    const files = await loadMigrationFiles();
    if (files.length === 0) {
      console.log("[db:migrate] No migration files found.");
      return;
    }

    const applied = await readAppliedMigrations(client);
    const pending = files.filter((file) => !applied.has(file));

    if (pending.length === 0) {
      console.log("[db:migrate] Database is up to date — nothing to apply.");
      return;
    }

    console.log(`[db:migrate] Pending migrations: ${pending.length}`);
    for (const filename of pending) {
      await applyMigration(client, filename, args.dryRun);
    }

    console.log("\n[db:migrate] Completed successfully.");
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  if (error instanceof PgModuleMissingError) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});
