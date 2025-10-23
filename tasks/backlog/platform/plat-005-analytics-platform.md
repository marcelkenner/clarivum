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
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/analytics/feature-requirements.md
  - docs/adr/ADR-008-product-analytics-platform.md
  - docs/runbooks/analytics-qa.md
context7:
  - /posthog/posthog
  - /opentelemetry/docs
  - /flagsmith/docs
tags:
  - analytics
  - instrumentation
  - observability
---

## Summary
Stand up the managed PostHog EU project, shared analytics toolkit, and governance workflows so Clarivum can capture funnel events, segment audiences, and uphold privacy commitments end-to-end.

## Definition of Ready
- [ ] Configure PostHog project and service accounts aligned with security baseline.
- [ ] Confirm event catalogue scope and consent requirements with product + legal.
- [ ] Align SDK rollout plan (web + server) with frontend and backend owners.
- [ ] Review runbook expectations for QA, alerting, and warehouse sync.

## Definition of Done
- [ ] PostHog project provisioned with RBAC, retention, and EU residency settings.
- [ ] `@clarivum/analytics` clients deployed with event schemas validated against ADR-008 catalogue.
- [ ] CI and Playwright smoke flows emit analytics and pass QA checklist.
- [ ] Slack/Flagsmith alerts wired for anomaly detection; dashboards shared with stakeholders.
- [ ] Documentation updates merged (runbook changelog, architecture references, PRD notes).
