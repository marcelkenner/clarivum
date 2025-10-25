---
id: TSK-QA-004
title: Monetization Telemetry Validation & Synthetic Monitoring
status: backlog
area: qa
subarea: monetization
owner: QA Lead
collaborators:
  - Platform Engineer
  - Frontend Engineer
  - Partnerships Manager
effort: medium
created_at: 2025-10-27
updated_at: 2025-10-27
links:
  - docs/PRDs/requierments/analytics/feature-requirements.md
  - docs/adr/ADR-033-advertising-and-affiliate-telemetry.md
  - docs/adr/ADR-029-plausible-analytics-platform.md
  - docs/runbooks/analytics-qa.md
  - docs/runbooks/affiliate-ad-ops.md
context7:
  - /playwright/test
  - /plausible/docs
  - /supabase/supabase
tags:
  - qa
  - monetization
  - guardrail
---

## Summary
Deliver automated tests and monitors that guarantee ad and affiliate placements emit impressions and clicks, enforce consent rules, and match partner statements.

## Scope
- Playwright scenarios for blog posts, recommendation hubs, and coupon pages verifying instrumentation and redirects.
- Synthetic monitors hitting `/go/...` endpoints and checking Supabase logs.
- QA checklist for partner reconciliation (CSV import verification).
- Alert triage workflows integrated with QA runbook.

## Definition of Ready
- [ ] Test placements identified with stable slugs in staging.
- [ ] Access to Supabase monetization tables granted (read-only).
- [ ] Synthetic monitoring vendor selected/configured (Checkly or GitHub Actions).
- [ ] Partner test URLs available (sandbox or deterministic).

## Definition of Done
- [ ] Playwright tests executed in CI verifying `AdPlacementViewed`, `AdPlacementClicked`, `AffiliateLinkClicked` events and consent gating.
- [ ] Automated job runs hourly to hit redirect endpoint, asserts 302 and log entry; alerts QA if latency/error > threshold.
- [ ] QA release checklist updated to include monetization instrumentation sign-off.
- [ ] Documentation added to `docs/runbooks/analytics-qa.md` and QA handbook summarizing steps.
- [ ] Synthetic monitor dashboards shared with partnerships and ops teams.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Work Plan
- [ ] Author Playwright helpers to parse Plausible debug API and Supabase logs for recent events.
- [ ] Add test flows for article page (affiliates), recommendation hub, and coupon list.
- [ ] Configure synthetic monitor and integrate with Slack alert channel.
- [ ] Update QA documentation and train QA/support on interpreting results.

## Out of Scope
- Manual partner communication (handled by partnerships).
- Finance reconciliation reports (covered by platform task).
- Paid media campaign attribution beyond on-site clicks.
