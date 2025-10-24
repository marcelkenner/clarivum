---
id: TSK-FE-015
title: Automate Lighthouse CI Performance Gates
status: backlog
area: frontend
subarea: observability
owner: Frontend Engineer
collaborators:
  - Platform Engineer
  - QA Lead
effort: small
created_at: 2025-10-27
updated_at: 2025-10-27
links:
  - docs/PRDs/requierments/homepage/feature-requirements.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/adr/ADR-019-frontend-platform.md
  - docs/adr/ADR-016-ci-cd-platform.md
  - docs/runbooks/deployment.md
context7:
  - /googlechrome/lighthouse-ci
  - /vercel/next.js
  - /websites/github_en_actions
tags:
  - performance
  - ci-cd
  - lighthouse
---

## Summary
Wire Lighthouse CI into GitHub Actions so every deploy enforces the homepage performance targets (≥90 performance/accessibility) and exposes trend dashboards for regression triage.

## Definition of Ready
- [ ] Confirm target pages, thresholds, and budgets with product/design stakeholders.
- [ ] Decide on build artifacts vs live URL testing strategy and caching inputs with platform team.
- [ ] Ensure secrets and tokens (e.g., Vercel preview URLs) are available to CI workflows.
- [ ] Align reporting destinations (GitHub checks, Slack summaries, dashboards) with observability owners.

## Definition of Done
- [ ] Lighthouse CI configuration checked into repo with environment-specific settings and assertions.
- [ ] GitHub Actions workflows execute audits on PRs and main, gating merges when budgets fail.
- [ ] Reports published (HTML/JSON) and retention strategy documented; trend dashboards accessible to stakeholders.
- [ ] Playbook for handling regressions added to `docs/runbooks/deployment.md` with escalation steps.
- [ ] Follow-up backlog items logged for expanded URL coverage or experiment-specific budgets.
