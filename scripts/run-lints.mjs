#!/usr/bin/env node

import { spawn } from "node:child_process";
import process from "node:process";

/**
 * Represents an individual lint command to execute.
 */
class LintCommand {
  constructor(label, npmScript) {
    this.label = label;
    this.npmScript = npmScript;
  }

  async run() {
    const executable = determineNpmExecutable();
    const args = ["run", this.npmScript];
    return new Promise((resolve) => {
      const child = spawn(executable, args, { stdio: "inherit" });
      let spawnError = null;

      child.on("error", (error) => {
        spawnError = error;
      });

      child.on("close", (code, signal) => {
        resolve(new LintExecutionResult(this, code, signal, spawnError));
      });
    });
  }
}

/**
 * Captures the outcome of running a lint command.
 */
class LintExecutionResult {
  constructor(command, exitCode, signal, error) {
    this.command = command;
    this.exitCode = exitCode;
    this.signal = signal;
    this.error = error;
  }

  isSuccess() {
    return !this.error && this.exitCode === 0;
  }

  statusLabel() {
    if (this.error) {
      return `FAILED (spawn error: ${this.error.message})`;
    }
    if (this.exitCode === 0) {
      return "PASSED";
    }
    if (this.signal) {
      return `FAILED (signal ${this.signal})`;
    }
    return `FAILED (exit code ${this.exitCode})`;
  }
}

/**
 * Orchestrates running all lint commands and surfaces a consolidated summary.
 */
class LintRunner {
  constructor(commands) {
    this.commands = commands;
  }

  async run() {
    const results = [];
    for (const command of this.commands) {
      console.log(`\n▶ Running ${command.label}...`);
      const result = await command.run();
      results.push(result);
    }
    this.printSummary(results);
    if (results.some((result) => !result.isSuccess())) {
      process.exitCode = 1;
    }
  }

  printSummary(results) {
    console.log("\nLint summary:");
    for (const result of results) {
      console.log(`- ${result.command.label}: ${result.statusLabel()}`);
    }
  }
}

function determineNpmExecutable() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

async function main() {
  const commands = [
    new LintCommand("lint:docs", "lint:docs"),
    new LintCommand("lint:diagrams", "lint:diagrams"),
    new LintCommand("lint:tasks", "lint:tasks"),
    new LintCommand("lint:code", "lint:code"),
  ];
  const runner = new LintRunner(commands);
  await runner.run();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
