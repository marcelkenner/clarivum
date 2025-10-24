---
id: TSK-QA-003
title: Ebooks Fulfillment Reliability Guardrails
status: backlog
area: qa
subarea: digital-products
owner: QA Lead
collaborators:
  - Platform Engineer
  - Support Ops Lead
effort: medium
created_at: 2025-10-27
updated_at: 2025-10-27
links:
  - docs/runbooks/ebooks-fulfillment.md
  - docs/runbooks/account-claiming.md
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/adr/ADR-032-guest-entitlements-and-account-claiming.md
  - tasks/backlog/platform/plat-041-guest-account-claim-workflow.md
  - tasks/backlog/platform/plat-042-fulfillment-orchestrator-guardrails.md
context7:
  - /playwright/test
  - /stripe/stripe
  - /supabase/supabase
tags:
  - qa
  - guardrail
  - entitlements
---

## Summary
Create automated and manual QA guardrails that ensure every successful payment triggers receipts, download links, and account entitlements, and that regressions surface before production deploys.

## Scope
- Playwright smoke scenarios covering authenticated purchases, guest purchases, retries, and claim flows.
- Synthetic monitoring job invoking staging fulfillment every hour and verifying email + entitlements.
- Regression checklist for release trains, including orchestrator dashboard review.
- QA signoff procedure integrated with CI gating (`npm run validate` extensions).

## Definition of Ready
- [ ] Test data (Stripe test cards, sample ebooks) available in staging.
- [ ] Access to observability dashboards granted to QA team.
- [ ] Synthetic monitoring platform (Checkly, GitHub Action cron, etc.) selected with required secrets.
- [ ] Support/marketing stakeholders approve receipt email templates for automation parsing.

## Definition of Done
- [ ] Playwright tests added to CI verifying: authenticated purchase, guest purchase with claim, retry after temporary email failure.
- [ ] Synthetic monitor deployed hitting staging purchase flow hourly; failures alert QA + platform.
- [ ] QA release checklist updated to include orchestrator job review and reconciliation report check.
- [ ] Documentation added to `docs/runbooks/ebooks-fulfillment.md` / QA playbook referencing guardrails.
- [ ] Metrics dashboard includes QA synthetic results and is linked in runbook.
- [ ] Tests documented in `tasks/AGENTS.md` with commands for local execution.

## Work Plan
- [ ] Build Playwright helpers for purchasing test SKU, polling mailbox API, and verifying entitlements API.
- [ ] Add Playwright test suite to CI (tagged `@ebooks`) with environment configuration.
- [ ] Configure synthetic monitor via GitHub Actions cron or Checkly; use webhook to notify Slack.
- [ ] Update QA release checklist and train QA/support teams.
- [ ] Archive artifacts (emails, logs) for at least 14 days for debugging.

## Out of Scope
- Full load testing of payment provider.
- Non-ebook digital product scenarios.
- Localization coverage for receipts (handled separately).
