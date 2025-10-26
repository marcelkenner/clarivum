import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
} from "@playwright/test/reporter";

type ReporterOptions = {
  outputFile?: string;
};

type TestCounts = {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
};

const DEFAULT_OUTPUT = path.resolve("metrics", "quality.json");

/**
 * Custom reporter that emits flake metrics for QA dashboards.
 */
class QaMetricsReporter implements Reporter {
  private options: ReporterOptions;
  private suite: Suite | undefined;
  private startTime = 0;

  constructor(options: ReporterOptions = {}) {
    this.options = options;
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    this.suite = suite;
    // When running a single project (smoke/regression), we only expect one entry.
    if (config.projects.length === 1) {
      this.projectNames = [config.projects[0]!.name];
    } else {
      this.projectNames = config.projects.map((p) => p.name);
    }
  }

  onEnd(result: FullResult) {
    const durationMs = Date.now() - this.startTime;
    const tests = this.suite?.allTests?.() ?? [];
    const summary = summarizeTests(tests);
    const payload = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      source: "playwright",
      status: result.status,
      durationMs,
      project: this.projectNames[0] ?? "unknown",
      totals: summary.counts,
      flakes: {
        count: summary.flakyCount,
        rate:
          summary.counts.total > 0
            ? Number((summary.flakyCount / summary.counts.total).toFixed(4))
            : 0,
      },
      retries: summary.retryCount,
      environment: {
        ci: process.env["CI"] === "true",
        githubRunId: process.env["GITHUB_RUN_ID"] ?? null,
        githubSha: process.env["GITHUB_SHA"] ?? null,
        workflow: process.env["GITHUB_WORKFLOW"] ?? null,
        baseURL: process.env["PLAYWRIGHT_BASE_URL"] ?? null,
      },
    };

    const outputFile = this.options.outputFile
      ? path.resolve(this.options.outputFile)
      : DEFAULT_OUTPUT;
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2));
    console.log(`📈 Wrote Playwright metrics → ${outputFile}`);
  }

  // Keep a record of the project names from the config for reporting.
  private projectNames: Array<string> = [];
}

function summarizeTests(tests: Array<TestCase>) {
  const counts: TestCounts = {
    total: tests.length,
    passed: 0,
    failed: 0,
    skipped: 0,
  };
  let flakyCount = 0;
  let retryCount = 0;

  for (const test of tests) {
    const outcome = test.outcome();
    if (outcome === "expected") {
      counts.passed += 1;
    } else if (outcome === "unexpected") {
      counts.failed += 1;
    } else if (outcome === "skipped") {
      counts.skipped += 1;
    } else if (outcome === "flaky") {
      flakyCount += 1;
      counts.passed += 1; // Flaky tests eventually passed after retries.
    }

    retryCount += Math.max(0, test.results.length - 1);
  }

  return { counts, flakyCount, retryCount };
}

export default QaMetricsReporter;
