# Metrics Snapshots

This directory stores JSON snapshots produced by scheduled jobs or manual scripts. Each file should focus on the dimensions described in `AGENTS.md` (flow, quality, sustainability, coverage) and include timestamps for traceability.

## Canonical files

- `coverage.json` — Written by `npm run metrics:coverage` (parses `coverage/coverage-summary.json`) and uploaded in CI as part of the `qa-metrics` artifact.
- `quality.json` — Produced automatically whenever `npm run test:e2e:*` runs thanks to the custom Playwright reporter at `tests/reporters/qa-metrics-reporter.ts`. The payload records the `PLAYWRIGHT_BASE_URL` so downstream dashboards know which environment was exercised.
- `feature-flags/stale-report.json` — Populated by `npm run flags:stale`.

Keep historical files (or snapshots per date) to preserve trend analysis. Do not commit personally identifiable information or secrets.

## Refresh workflow

1. Run `npm run test -- --coverage` followed by `npm run metrics:coverage` to update `coverage.json`.
2. Start a dev or preview server (`npm run dev -- --hostname 127.0.0.1 --port 3310` is the local default), set `PLAYWRIGHT_BASE_URL` to that host, then run `npm run test:e2e:smoke` (or another Playwright project) to refresh `quality.json`. The reporter logs flake counts, retries, runtime, and the base URL that was exercised.
3. Commit updated JSON snapshots alongside any code/doc changes.
4. CI aggregates the latest files into the `qa-metrics` artifact with a 30-day retention so dashboards can ingest them automatically.

Metrics surfaced in the Clarivum Operations Hub overview should map back to these JSON snapshots; update both the automation scripts and `/ops` widgets together.
