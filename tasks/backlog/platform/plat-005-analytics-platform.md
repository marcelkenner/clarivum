---
id: TSK-PLAT-005
title: Implement Product Analytics Platform
status: backlog
area: platform
subarea: analytics
owner: Analytics Lead
collaborators:
  - Platform Engineer
  - QA Lead
  - Marketing Partner
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/analytics/feature-requirements.md
  - docs/adr/ADR-029-plausible-analytics-platform.md
  - docs/adr/ADR-008-product-analytics-platform.md
  - docs/runbooks/analytics-qa.md
context7:
  - /plausible/docs
  - /opentelemetry/docs
  - /flagsmith/docs
tags:
  - analytics
  - instrumentation
  - observability
---

## Summary
Stand up the managed Plausible Analytics EU project, shared analytics toolkit, and governance workflows so Clarivum can capture funnel events, segment audiences, and uphold privacy commitments end-to-end without introducing alternate vendors.

## Definition of Ready
- [x] Plausible projects/service accounts defined per env with custom domain `analytics.clarivum.com` (CNAME) and server-only keys in Secrets Manager.
- [x] Event catalogue & consent scope finalized: namespaces `entitlement.*`, `checkout.*`, `wallet.*`, `search.*`, `content.*` with required props and consent buckets (`analytics`, `marketing`).
- [x] SDK rollout plan set: `@clarivum/analytics` wrapper with consent/sampling guards (`dev=50%`, `stage=100%`, `prod=100%`), queue & retry, dev dry-run.
- [x] QA/alerting/export expectations documented: event shape QA checklist, volume drop alert (30-min vs 7-day baseline at −40%) to `#analytics-alerts`, nightly S3 NDJSON export `s3://clarivum-analytics-raw/` cataloged in Glue/Athena.

## Definition of Done
- [ ] Plausible project provisioned with RBAC, retention, and EU residency settings.
- [ ] `@clarivum/analytics` clients deployed with event schemas validated against ADR-029 catalogue.
- [ ] CI and Playwright smoke flows emit analytics and pass QA checklist.
- [ ] Slack/Flagsmith alerts wired for anomaly detection; dashboards shared with stakeholders.
- [ ] Documentation updates merged (runbook changelog, architecture references, PRD notes).
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
