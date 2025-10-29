#!/usr/bin/env node

/**
 * Runs the Vitest suite scoped to the Strapi workspace.
 *
 * The tests live under `cms/tests` and validate configuration contracts so we
 * catch breaking changes before they reach the deployment pipeline.
 */

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");

const repoRoot = path.resolve(__dirname, "..", "..");
const vitestCli = path.join(repoRoot, "node_modules", "vitest", "vitest.mjs");
const configPath = path.join("cms", "vitest.config.ts");

if (process.env.CI) {
  const reportsDir = path.join(repoRoot, "cms", "tests", "reports");
  fs.mkdirSync(reportsDir, { recursive: true });
}

const child = spawn(
  process.execPath,
  [vitestCli, "run", "--config", configPath, "--passWithNoTests=false"],
  {
    cwd: repoRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV ?? "test",
    },
  },
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
