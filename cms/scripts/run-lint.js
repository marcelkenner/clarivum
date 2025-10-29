#!/usr/bin/env node

/**
 * Executes ESLint against the Strapi workspace.
 *
 * We intentionally shell out to the repo-level eslint binary so the Strapi
 * project shares the same configuration and dependency tree as the Next.js app.
 * This keeps `npm run strapi:ci` deterministic in CI and locally.
 */

const { spawn } = require("node:child_process");
const path = require("node:path");
const process = require("node:process");

const repoRoot = path.resolve(__dirname, "..", "..");
const eslintCli = path.join(repoRoot, "node_modules", "eslint", "bin", "eslint.js");
const targets = [path.join("cms", "config"), path.join("cms", "src"), path.join("cms", "tests")];

const child = spawn(
  process.execPath,
  [eslintCli, "--config", path.join("eslint.config.mjs"), "--max-warnings=0", ...targets],
  {
    cwd: repoRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      TSESTREE_ALLOW_DEFAULT_PROJECT: "1",
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
