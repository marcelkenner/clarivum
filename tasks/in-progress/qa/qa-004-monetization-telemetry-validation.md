---
id: TSK-QA-004
title: Monetization Telemetry Validation & Synthetic Monitoring
status: in-progress
area: qa
subarea: monetization
owner: QA Lead
collaborators:
  - Platform Engineer
  - Frontend Engineer
  - Partnerships Manager
effort: medium
created_at: 2025-10-27
updated_at: 2025-11-03
links:
  - docs/PRDs/requierments/analytics/feature-requirements.md
  - docs/adr/ADR-033-advertising-and-affiliate-telemetry.md
  - docs/adr/ADR-029-plausible-analytics-platform.md
  - docs/runbooks/analytics-qa.md
  - docs/runbooks/affiliate-ad-ops.md
context7:
  - /playwright/test
  - /plausible/docs
  - /websites/aws_amazon-amazonrds-aurorauserguide
tags:
  - qa
  - monetization
  - guardrail
---

## Summary
Deliver automated tests and monitors that guarantee ad and affiliate placements emit impressions and clicks, enforce consent rules, and match partner statements.

## Scope
- Playwright scenarios for blog posts, recommendation hubs, and coupon pages verifying instrumentation and redirects.
- Synthetic monitors hitting `/go/...` endpoints and checking Aurora monetization tables and CloudWatch query exports.
- QA checklist for partner reconciliation (CSV import verification).
- Alert triage workflows integrated with QA runbook.

## Definition of Ready
- [ ] Staging placements enumerated with stable slugs and fixtures committed for deterministic tests.
- [ ] Aurora monetization schemas exposed via read-only role (through Secrets Manager) for QA validation queries.
- [ ] Synthetic monitoring vendor selected/configured with check definitions and alert thresholds documented.
- [ ] Partner/Sandbox test URLs secured and cataloged with access notes for QA.

## Definition of Done
- [ ] Playwright tests executed in CI verifying `AdPlacementViewed`, `AdPlacementClicked`, `AffiliateLinkClicked` events and consent gating.
- [ ] Automated job runs hourly to hit redirect endpoint, asserts 302 and log entry; alerts QA if latency/error > threshold.
- [ ] QA release checklist updated to include monetization instrumentation sign-off.
- [ ] Documentation added to `docs/runbooks/analytics-qa.md` and QA handbook summarizing steps.
- [ ] Synthetic monitor dashboards shared with partnerships and ops teams.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Work Plan
- [ ] Author Playwright helpers to parse Plausible debug API and Aurora query results/log exports for recent events.
- [ ] Add test flows for article page (affiliates), recommendation hub, and coupon list.
- [ ] Configure synthetic monitor and integrate with Slack alert channel.
- [ ] Update QA documentation and train QA/support on interpreting results.

## Out of Scope
- Manual partner communication (handled by partnerships).
- Finance reconciliation reports (covered by platform task).
- Paid media campaign attribution beyond on-site clicks.
