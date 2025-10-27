---
id: TSK-PLAT-036
title: Schedule Monthly Forest Day Automation
status: backlog
area: platform
subarea: developer-experience
owner: DevOps Lead
collaborators:
  - Product Operations Lead
  - Engineering Manager
effort: tiny
created_at: 2025-10-24
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/observability/feature-requirements.md
  - docs/adr/ADR-016-ci-cd-platform.md
  - docs/playbooks/metsa-cadence.md
  - docs/AGENTS.md
  - docs/role-guides/continuous-improvement.md
context7:
  - /websites/github_en_actions
  - /octokit/rest.js
tags:
  - forest-day
  - automation
  - cadence
---

## Summary
Implement a GitHub Actions workflow that opens the monthly Forest Day task with the required checklist so the team consistently schedules a no-meeting improvement day and tracks outcomes in GitHub.

## Definition of Ready
- [ ] Cadence and reviewers confirmed (monthly first Friday, reviewers list fixed, checklist issue format approved).
- [ ] Template and labels finalized (`forest-day` label, cleanup/dependency/flag cleanup checklist items).
- [ ] Notification plan defined (Slack reminder 48 h prior, summary after) with owners.
- [ ] GitHub OIDC permissions validated for issue creation (no PAT) and secrets configured.
- [ ] Announcement plan drafted (calendar invite + team post) with responsible owner.

## Definition of Done
- [ ] Workflow `.github/workflows/forest-day-monthly.yml` created with cron and manual trigger, writing issues that match the playbook template.
- [ ] Dry run executed in a branch or sandbox repository to verify content formatting and idempotency.
- [ ] Documentation (`docs/playbooks/metsa-cadence.md`, `docs/AGENTS.md`) updated with trigger behavior and recovery steps.
- [ ] Notifications configured (e.g., Slack message or GitHub mention) when the issue opens.
- [ ] Follow-up backlog captured for enhancements such as automated assignee rotation or retrospective summaries.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
