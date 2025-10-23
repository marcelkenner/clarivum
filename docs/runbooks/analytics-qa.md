# Analytics QA Runbook

## Scope & objectives
- Validate product analytics instrumentation across web, server, and background jobs per ADR-008 before release.
- Maintain parity between `@clarivum/analytics` schema, `docs/analytics_events.md`, and PostHog project configuration.
- Ensure privacy compliance (consent, data minimization) while preserving funnel fidelity.

## Roles & tooling
- **Owner:** Analytics QA Lead.
- **Partners:** Growth analyst (dashboard verification), Platform engineer (SDK changes), Privacy officer (consent).
- **Tooling:**
  - PostHog Cloud (EU residency) project.
  - `@clarivum/analytics` package (BrowserEventClient, ServerEventDispatcher).
  - Supabase warehouse sync (nightly export).
  - QA automation (Playwright analytics harness), OpenTelemetry logs.

## Release checklist (pre-merge)
1. **Schema review:**
   - Confirm new events appended to `docs/analytics_events.md` with owner, purpose, property definitions.
   - Run `npm run analytics:schema-validate` to ensure TypeScript types match event dictionary.
2. **Consent gating:**
   - Verify Flagsmith gating logic; simulate `marketing_consent = false` to ensure BrowserEventClient blocks emit.
   - Confirm server-side dispatch respects opt-out by checking unit tests in `analytics/__tests__/consent`.
3. **Performance guardrail:**
   - Lighthouse run must show <10 ms impact from analytics bundle; lazy load verified via network waterfall.
4. **Event accuracy tests:**
   - Execute Playwright QA suite `npm run qa:analytics -- --scenario funnel_checkout`.
   - Inspect recorded events in PostHog (temporary QA namespace `qa-session-<date>`).
   - Validate property casing and data types (strings vs numbers).
5. **Alert wiring:**
   - Ensure new funnel dashboards include >20% drop detectors with Slack channel `#clarivum-insights`.
6. **Documentation:**
   - Update runbook changelog and add release notes to analytics PR template.

## Post-deploy verification
1. Monitor PostHog live view for 30 minutes; confirm events hitting correct environment.
2. Review Grafana dashboard for ingestion latency (<5 min SLO).
3. Trigger sample GDPR deletion request to confirm PostHog API hook removes user profile.
4. Validate Supabase nightly sync (spot check aggregated table).

## Data quality triage workflow
1. **Detection sources:** Dashboard anomalies, alert triggers, QA bug reports.
2. **Triage steps:**
   - Reproduce event path using staging env; capture network logs.
   - Compare event payload vs schema; identify missing/incorrect properties.
   - If regression caused by flag, toggle fallback (e.g., disable new event property) via Flagsmith.
3. **Fix implementation:** Coordinate with feature squad to patch instrumentation. Add regression test in analytics QA suite.
4. **Communication:** Note incident in `#clarivum-dev` with scope, root cause, mitigation.

## Privacy & compliance checks
- Ensure IP anonymization flag remains active in PostHog settings.
- Validate user deletion queue empty daily; escalate if >24 hours backlog.
- Audit access roles quarterly (Marketing view-only, Analysts export, Engineering manage schema).

## Maintenance cadence
- **Weekly:** Review funnel drop alerts, reconcile Supabase vs PostHog counts.
- **Monthly:** Audit events for unused or redundant properties; retire per data minimization policy.
- **Quarterly:** Refresh SDK versions, re-run performance budget tests, validate warehouse sync configuration.

## Change log
- **2025-10-23:** Initial analytics QA runbook defining release checklist, verification flow, and compliance maintenance.
