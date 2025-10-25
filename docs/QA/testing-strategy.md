# Testing Strategy Guide

This guide operationalizes `docs/adr/ADR-015-testing-strategy.md` and the product requirements captured in `docs/PRDs/requierments/testing-stack/feature-requirements.md`. Use it to plan coverage, run suites locally, and keep Clarivum’s quality guardrails healthy.

## Canonical Sources
- Architecture: `docs/adr/ADR-015-testing-strategy.md`
- Product requirements: `docs/PRDs/requierments/testing-stack/feature-requirements.md`
- Repository governance: `docs/policies/repository-governance.md`
- Playbooks: `docs/playbooks/kaizen-minute.md`, `docs/playbooks/metsa-cadence.md`
- Runbook: `docs/runbooks/testing-stack.md`

Always resolve framework or library questions with Context7 before adding or changing tooling.

## Layered Coverage Model

| Layer | Tooling | Scope | Ownership | Cadence |
| --- | --- | --- | --- | --- |
| Unit | Vitest + Testing Library | Pure functions, hooks, view models, feature flags | Feature squads | PR + daily |
| Integration | Vitest + Testing Library custom render | Routed components, data-fetching boundaries, API adapters | Feature squads w/ QA pairing | PR + nightly smoke |
| End-to-end | Playwright smoke + regression projects | Golden funnels (diagnostics, ebooks, subscriptions), auth vs anonymous | QA + assigned engineers | Smoke on PR previews, regression nightly |
| Accessibility | Playwright + axe scans | Critical UI flows and navigation landmarks | QA accessibility lead | Weekly + on UI-heavy PRs |
| Performance | Playwright + Lighthouse scripted runs | Landing pages, checkout | Platform team | Monthly + before launches |

Tag tests with `@smoke`, `@regression`, or `@accessibility` to support selective execution in CI.

## Local Workflow
1. Install dependencies: `npm install`
2. Generate agent scaffolding (ensures AGENTS docs exist): `npm run ensure:agents`
3. Run targeted suites:
   - Unit/integration: `npm run test -- --runInBand ./path/to/file.test.tsx`
   - End-to-end: `npm run test:e2e -- --project smoke` (or `npm run test:e2e:smoke`)
4. Update fixtures under `tests/config/fixtures/` when API contracts change; keep them synthetic.
5. Record flake notes in `sisu-log/` when retries exceed guardrail thresholds.

> Tip: Use `.env.test` for secrets and feature-flag overrides. Never commit real credentials.

## CI Workflow
- PR validation (`.github/workflows/ci.yml`, job “Validate, test, and smoke”) runs sequential steps: `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run test -- --coverage`, and `npm run test:e2e:smoke`.
- The job uploads three artifacts: `vitest-coverage` (HTML + JSON), `playwright-report` (HTML report + traces in `blob-report`), and `ci-metrics` (duration + pass/fail JSON for downstream dashboards). Keep at least 14 days of coverage/smoke artifacts and 30 days of metrics history.
- When Playwright smoke fails, the workflow posts a PR comment with the run link and notifies `#clarivum-platform` via the `SLACK_WEBHOOK_CI` secret before failing the job.
- Nightly regression runs full Playwright matrix via `cron` (see `docs/diagrams/adr-015-testing-strategy/bpmn-ci.mmd`); hook its metrics into the same schema when available.
- Branch protection must require the single job check so merges cannot bypass lint/type/test guardrails. Owners must either fix failures immediately or open a `type:guardrail` task with a Kaizen/Kanban entry.
- Collaboration hand-offs between developers, QA, and metrics are mapped in `docs/diagrams/adr-015-testing-strategy/test-layer-sequence.mmd`.

## Coverage Expectations
- Maintain ≥80% statements overall and ≥90% on critical files (`src/app/(marketing)`, checkout, diagnostics).
- Every new feature must add tests at the lowest useful layer plus an e2e check if the flow is revenue-impacting.
- When bugs escape, add a regression test in the layer that would have caught it (see Sisu Debugging runbook).

## Ownership & Escalation
- **QE Guild Lead:** curates Playwright regression suite, monitors flake rate.
- **Platform Team:** maintains shared configs (`tests/config/`, Playwright reporters, parallelization).
- **Feature Squads:** own coverage for their domain, respond to failing tests within one business day.
- Escalate chronic flakes or missing coverage to the `#sisu-log` channel and file a `type:guardrail` issue.

## Metrics & Reporting
- Coverage reports (c8) export to `metrics/coverage.json`; leverage the `vitest-coverage` artifact to backfill if a run fails before commit.
- CI pipeline records lead time and pass/fail counts via the `ci-metrics` artifact (per-run JSON). Feed that data into `metrics/quality.json` when aggregating.
- Track Playwright runtime to stay under 12 minutes on PRs and 30 minutes on regression; throttle retries or shard when thresholds slip.

## Change Management Checklist
- [ ] Update ADR-015 if tooling decisions change materially.
- [ ] Document new helpers or fixtures under `tests/config/README.md`.
- [ ] Add or update tasks in `tasks/` when introducing new guardrails.
- [ ] Cross-link docs/runbooks so onboarding stays smooth.

Keep this guide current; review during each season’s retrospective per the Metsa cadence.
