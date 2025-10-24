# Testing Stack Runbook

This runbook explains how to operate the Vitest, Testing Library, and Playwright suites defined in `docs/adr/ADR-015-testing-strategy.md`. Follow it during incidents, releases, and seasonal hardening.

## Contacts
- **Primary owner:** Platform Engineering (testing lead)
- **Secondary:** QA Guild
- **Escalation:** `#sisu-log` (incidents), `#clarivum-dev` (coordination)

## Tooling Overview
- Unit/integration: Vitest + Testing Library helpers under `tests/config/`
- End-to-end: Playwright projects (`smoke`, `regression`, `accessibility`)
- Reporting: c8 coverage, Playwright trace viewer, GitHub Checks summaries

## Environments
- **Local:** `npm run test`, `npm run test:e2e -- --project smoke`
- **Preview:** GitHub Actions deploy preview → Playwright smoke
- **Nightly:** GitHub Actions scheduled regression matrix across Chromium, Firefox, WebKit
- **Release:** Manual Playwright regression on production-like data before major launches

## Standard Operation
1. **Setup**
   - Ensure `.env.test` has required keys (Flagsmith, Supabase anon, Stripe test, etc.).
   - Run `npm run ensure:agents` after pulling latest changes.
2. **Run Sequencing**
   - Unit/integration first (`npm run test`).
   - Trigger smoke Playwright (`npm run test:e2e:smoke`).
   - Optional: `npm run test:e2e:regression` locally before releases.
3. **Artifacts**
   - Vitest coverage: `coverage/` (HTML + JSON)
   - Playwright: `playwright-report/`, `blob-report/`
   - Upload artifacts to GitHub when CI fails for fast triage.

## Incident Response (Sisu Debugging Alignment)
1. Stabilize: revert/bypass failing test only if user impact is critical; otherwise fix root cause.
2. Contain: add failing scenario to Sisu note (`sisu-log/YYYY-MM-DD-<id>.md`).
3. Guardrail: write/repair the regression test within 48h.
4. Communicate: update the matching task, QA channel, and runbook if new patterns emerge.

## Flake Handling
- Quarantine only after two consecutive flakes with the same signature.
- When quarantining, open a `type:guardrail` issue referencing logs, traces, and root cause hypothesis.
- Track flakes in `metrics/quality.json` under `playwright_flake_rate`.

## Maintenance Cadence
- **Weekly:** review failing tests dashboard, prune obsolete fixtures.
- **Monthly (Forest Day):** rotate regression tags, review slow tests, simplify helpers.
- **Seasonal (Metsa Winter):** raise coverage thresholds, refactor flaky helpers, archive unused fixtures.

## Change Management
- Update this runbook when scripts, tooling versions, or escalation paths change.
- Reference new Context7 docs in the `context7` field of related tasks.
- Every PR touching `tests/config/` must mention this runbook in the summary.

## Appendices
- [Testing Strategy Guide](../QA/testing-strategy.md)
- [Sisu Debugging Runbook](./sisu-debugging.md)
- [Repository Governance](../policies/repository-governance.md)
- [Playwright Project Configuration](../../tests/config/README.md) *(to be added alongside tooling implementation)*
