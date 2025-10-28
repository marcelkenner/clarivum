---
id: TSK-PLAT-034
title: Automate Kaizen Daily Issue Ritual
status: backlog
area: platform
subarea: developer-experience
owner: DevOps Lead
collaborators:
  - Engineering Manager
  - Analytics Lead
effort: small
created_at: 2025-10-24
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/observability/feature-requirements.md
  - docs/adr/ADR-016-ci-cd-platform.md
  - docs/AGENTS.md
  - docs/playbooks/kaizen-minute.md
  - docs/role-guides/continuous-improvement.md
context7:
  - /websites/github_en_actions
  - /octokit/rest.js
tags:
  - kaizen
  - automation
  - workflow
---

## Summary
Ship a GitHub Actions workflow that opens the daily Kaizen Minute issue on weekdays, avoiding duplicates and tagging the right owners so the team can reliably capture slowdowns and guardrails without manual coordination.

## Definition of Ready
- [x] Schedule/ownership set: weekdays 09:00 team timezone with Platform as primary and named backup.
- [x] Issue template/labels finalized: reuse `Kaizen Minute` template with `kaizen-daily` label and required fields.
- [x] Permissions scoped: GitHub Actions via OIDC with `issues:write`, avoiding PATs.
- [x] Failure alerts planned: Slack webhook notifications, retry with jitter, dry-run validated.

## Definition of Done
- [ ] Workflow committed under `.github/workflows/kaizen-daily.yml` with schedule + manual trigger, using configuration from playbook.
- [ ] Duplicate-issue guard implemented via search API; integration test or dry run demonstrates idempotency.
- [ ] Slack or alternative notification configured so owners see creation confirmation each weekday.
- [ ] Runbooks (`docs/runbooks/deployment.md`) and platform status summary updated to describe automation.
- [ ] Follow-up tasks logged for multi-timezone support or guardrail enhancements.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
