---
id: TSK-PLAT-024
title: Implement Novu CI/CD & Governance
status: backlog
area: platform
subarea: ci-cd
owner: DevOps Lead
collaborators:
  - UI Platform Manager
  - QA Lead
effort: medium
created_at: 2025-10-26
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/subscriptions/feature-requirements.md
  - docs/adr/ADR-012-notification-experience-and-toasts.md
  - docs/runbooks/notifications.md
  - docs/checklists/pull-request.md
context7:
  - /novuhq/docs
  - /github/actions
  - /hashicorp/terraform
tags:
  - notifications
  - cicd
  - governance
---

## Summary
Create GitHub Actions workflows and governance standards for Novu workflows, subscriber management, and secret rotation. Ensure template changes are versioned, reviewed, and synchronized across environments with automated validation.

## Definition of Ready
- [x] Workflow export/storage defined: versioned JSON in `/novu/workflows/<name>.json` with PR review policy.
- [x] Environment schema confirmed: dev/stage/prod parity, naming `topic:<domain>` and `tmpl:<purpose>`, promotions gated via tags.
- [x] Sample workflows chosen: `welcome_email`, `reset_password`, `receipt` with snapshot rendering tests planned.
- [x] Telemetry contract agreed: delivery outcomes pushed via webhook containing `workflow_id`, `template_version`, `delivery_status`.

## Definition of Done
- [ ] CI pipeline lints Novu workflow definitions, runs unit tests for notification payload builders, and blocks on failure.
- [ ] Deploy pipeline promotes workflows via Novu API/CLI with environment-specific secrets pulled from AWS Secrets Manager.
- [ ] Automated smoke test validates inbox/email delivery against seeded accounts post-deploy.
- [ ] Change management policy documented covering approvals, rollback, and audit logging.
- [ ] Follow-up tasks logged for canary rollouts, load testing, or analytics enhancements.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
