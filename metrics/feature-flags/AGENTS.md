# Feature Flags Metrics · AGENTS Guide

Use this directory to store automation outputs tied to feature-flag governance.

- `npm run flags:stale` runs `scripts/flags-stale-check.mjs`, which queries the Flagsmith Admin API, summarizes stale flags, sends Slack + GitHub alerts (when env vars are set), and writes `stale-report.json`.
- The scheduled workflow `.github/workflows/flags-stale.yml` refreshes these files every Monday at 09:00 UTC; keep the schema backward-compatible so dashboards and the `/ops` view stay stable.
- Do not hand-edit generated JSON. If you need to regenerate locally, export `FLAGSMITH_PROJECT_ID`, `FLAGSMITH_API_TOKEN`, and (optionally) `SLACK_WEBHOOK_URL`, then run the script.

Document any additional metrics you add here so automation owners know how to extend dashboards and guardrails.
