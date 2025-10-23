---
id: TSK-PLAT-002
title: Automate Stale Feature Flag Detection
status: ready
area: platform
subarea: feature-flags
owner: Platform Engineer
collaborators: []
effort: small
created_at: 2025-10-21
updated_at: 2025-10-21
links:
  - docs/adr/ADR-005-feature-flags.md
  - docs/PRDs/requierments/feature-flags/feature-requirements.md
  - docs/role-guides/devops.md
  - docs/runbooks/deployment.md
context7:
  - /flagsmith/docs
  - /vercel/next.js
tags:
  - feature-flags
  - automation
---

## Summary
Build a scheduled script/job that detects Flagsmith entries past their `sunset_date`, alerts the platform channel, and creates follow-up tasks.

## Definition of Ready
- [x] Flagsmith API credentials and environment access confirmed.
- [x] Rollout policy documented with owner + sunset metadata requirements.
- [x] Alert routing (Slack + task creation) agreed with product and platform leads.

## Definition of Done
- [ ] Automated check implemented (serverless job or GitHub Action) and scheduled.
- [ ] Alerts posted to `#clarivum-platform` with actionable details; optional task auto-generated.
- [ ] Documentation updated in deployment runbook and platform role guide.
- [ ] Monitoring dashboard widget tracks stale flag counts over time.
- [ ] Retro notes captured for improving flag hygiene process.

## Notes
Align with release captain on scheduling to avoid noisy alert windows. Consider caching flag metadata to minimize API usage.
