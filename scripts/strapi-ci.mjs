#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const cmsPackageJson = path.join(repoRoot, "cms", "package.json");

if (!fs.existsSync(cmsPackageJson)) {
  console.log("Skipping Strapi quality gate (cms/package.json not found).");
  process.exit(0);
}

const commands = ["lint", "typecheck", "test", "build"];
const results = [];

for (const command of commands) {
  console.log(`\n▶ Strapi ${command}`);
  const exitCode = await runWithEnv(command);
  results.push({ command, exitCode });
  if (exitCode !== 0) {
    break;
  }
}

printSummary(results);

if (results.some((result) => result.exitCode !== 0)) {
  process.exit(1);
}

function runWithEnv(command) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join("scripts", "with-strapi-env.mjs"), command], {
      cwd: repoRoot,
      stdio: "inherit",
    });

    child.on("close", (code, signal) => {
      if (signal) {
        resolve(1);
      } else {
        resolve(code ?? 0);
      }
    });

    child.on("error", () => resolve(1));
  });
}

function printSummary(resultsToPrint) {
  console.log("\nStrapi quality gate summary:");
  for (const { command, exitCode } of resultsToPrint) {
    const status = exitCode === 0 ? "PASSED" : "FAILED";
    console.log(`- ${command}: ${status}`);
  }
}
