---
id: TSK-PLAT-002
title: Automate Stale Feature Flag Detection
status: done
area: platform
subarea: feature-flags
owner: Platform Engineer
collaborators: []
effort: small
created_at: 2025-10-21
updated_at: 2025-10-26
links:
  - docs/adr/ADR-005-feature-flags.md
  - docs/PRDs/requierments/feature-flags/feature-requirements.md
  - docs/runbooks/feature-flags-operations.md
  - docs/runbooks/deployment.md
  - docs/role-guides/devops.md
  - .github/workflows/flags-stale.yml
  - scripts/flags-stale-check.mjs
  - metrics/feature-flags/README.md
context7:
  - /flagsmith/flagsmith
  - /vercel/next.js
tags:
  - feature-flags
  - automation
---

## Summary
Scheduled automation now enforces the Flagsmith sunset policy. The new Node script (`npm run flags:stale`) calls the Flagsmith Admin API, writes a dashboard-friendly snapshot (`metrics/feature-flags/stale-report.json`), posts actionable summaries to `#clarivum-platform`, and opens `[flags] Sunset overdue` GitHub issues whenever a flag passes its `sunset_date`. A dedicated GitHub Action (`.github/workflows/flags-stale.yml`) runs every Monday at 09:00 UTC so stale flags move straight into the guardrail lane without manual audits. The deployment runbook, feature-flag runbook, and DevOps role guide now document the workflow, secret requirements, and retro learnings.

## Definition of Ready
- [x] Flagsmith API credentials and environment access confirmed.
- [x] Rollout policy documented with owner + sunset metadata requirements.
- [x] Alert routing (Slack + task creation) agreed with product and platform leads.

## Definition of Done
- [x] Automated check implemented via `scripts/flags-stale-check.mjs` and scheduled in `.github/workflows/flags-stale.yml`.
- [x] Slack alerts land in `#clarivum-platform` and GitHub issues (`type:guardrail`, `feature-flags`) are auto-created for each stale flag.
- [x] Documentation updated in `docs/runbooks/feature-flags-operations.md`, `docs/runbooks/deployment.md`, and `docs/role-guides/devops.md` (plus README + AGENTS references).
- [x] `metrics/feature-flags/stale-report.json` keeps a snapshot for the monitoring widget.
- [x] Retro note recorded in the feature-flag runbook to capture hygiene improvements.
- [x] Acceptance criteria satisfied; related README, AGENTS, ADR, and workflow docs reference the new automation.

## Notes
- Workflow secrets required: `FLAGSMITH_PROJECT_ID`, `FLAGSMITH_API_TOKEN`, `SLACK_WEBHOOK_CI`, and optional `FLAGSMITH_PROJECT_DASHBOARD_URL` repository variable for deep links.
- Follow-up issues embed `<!-- flagsmith-feature-id:<id> -->` markers so reruns avoid duplicates. Update the linked GitHub issue when extending or retiring a flag.
