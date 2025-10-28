---
id: TSK-PLAT-052
title: Run Autumn Feature Flag Retirement Audit
status: backlog
area: platform
subarea: governance
owner: Platform Tech Lead
collaborators:
  - Frontend Lead
  - Product Ops Lead
  - QA Lead
effort: small
created_at: 2025-10-29
updated_at: 2025-10-29
links:
  - docs/PRDs/requierments/operations-hub/feature-requirements.md
  - docs/runbooks/feature-flags.md
  - docs/runbooks/ops-hub.md
  - metrics/quality.json
  - docs/adr/ADR-005-feature-flags.md
context7:
  - /flagsmith/flagsmith
  - /vercel/next.js
tags:
  - feature-flags
  - guardrail
---

## Summary
Audit Flagsmith environments, retire or consolidate stale feature flags, and ensure automation (`npm run flags:stale`) reflects the latest policies before the Autumn stabilization window.

## Definition of Ready
- [ ] Latest stale flag report generated (`metrics/feature-flags/stale-report.json`).
- [ ] Product owners confirm sunset decisions for flagged features.
- [ ] Rollback procedures documented for any critical flags slated for removal.

## Definition of Done
- [ ] All stale flags either deleted or justified with new sunset/review date recorded in Flagsmith + Ops Hub notes.
- [ ] Automation updated (scripts + GitHub Action) to cover new environments/projects if needed.
- [ ] Docs updated: `docs/runbooks/feature-flags.md`, Kaizen guardrail template, and Ops Hub flag dashboard.
- [ ] Follow-up guardrail tickets logged for any deferred flags with owners/dates.

## Notes
- Coordinate with QA to capture regression test IDs tied to deleting flag code paths.
- Consider adding a monthly Forest Day check to keep flag debt low.
