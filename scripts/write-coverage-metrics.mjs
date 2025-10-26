#!/usr/bin/env node

/**
 * Writes aggregated coverage metrics from Vitest's coverage summary into
 * metrics/coverage.json so QA dashboards and scheduled jobs can ingest them.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const COVERAGE_SUMMARY_PATH = path.resolve("coverage", "coverage-summary.json");
const OUTPUT_PATH = path.resolve("metrics", "coverage.json");

const MIN_THRESHOLDS = {
  statements_pct: 70,
  branches_pct: 60,
};

function readCoverageSummary() {
  if (!fs.existsSync(COVERAGE_SUMMARY_PATH)) {
    console.error(
      `Coverage summary not found at ${COVERAGE_SUMMARY_PATH}. ` +
        "Run `npm run test -- --coverage` first."
    );
    process.exitCode = 1;
    return null;
  }

  try {
    const raw = fs.readFileSync(COVERAGE_SUMMARY_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse coverage summary:", error);
    process.exitCode = 1;
    return null;
  }
}

function extractTotals(summary) {
  const totals = summary?.total ?? {};
  const makeMetric = (section = {}) => ({
    pct: Number(section.pct ?? 0),
    covered: Number(section.covered ?? 0),
    total: Number(section.total ?? 0),
    skipped: Number(section.skipped ?? 0),
  });

  return {
    statements: makeMetric(totals.statements),
    branches: makeMetric(totals.branches),
    functions: makeMetric(totals.functions),
    lines: makeMetric(totals.lines),
  };
}

function writeMetrics(payload) {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2));
  console.log(`📊 Wrote coverage metrics → ${OUTPUT_PATH}`);
}

function main() {
  const summary = readCoverageSummary();
  if (!summary) {
    return;
  }

  const totals = extractTotals(summary);
  const payload = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: "vitest",
    commit: process.env["GITHUB_SHA"] ?? null,
    totals,
    thresholds: MIN_THRESHOLDS,
  };

  writeMetrics(payload);
}

main();
