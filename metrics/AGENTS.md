# metrics · AGENTS Guide

Use these guardrails when working under `metrics/`:

- Keep changes aligned with the PTRD (`docs/PRDs/first_steps.md`) and ADR-015 testing strategy.
- Refresh coverage snapshots via `npm run test -- --coverage && npm run metrics:coverage`.
- Playwright runs automatically refresh `metrics/quality.json`; use `npm run test:e2e:smoke` locally to verify the reporter output.
- CI publishes `metrics/coverage.json` and `metrics/quality.json` as the `qa-metrics` artifact (30-day retention). Do not delete those files unless the pipeline changes.
- Update this guide whenever schema changes or new metric families are introduced.
