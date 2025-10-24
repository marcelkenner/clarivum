# Metsa Cadence Playbook

The Metsa cadence (Finnish: Mets\u00e4, meaning "forest") keeps Clarivum on a sustainable seasonal rhythm. Use this playbook to plan Forest Days, organize seasonal boards, and communicate focus areas.

## Seasonal Focus

- Winter (Jan-Mar): debt removal, simplification, test coverage, SLO hardening.
- Spring (Apr-Jun): design docs, RFCs, prototypes, architectural decisions.
- Summer (Jul-Sep): customer-visible delivery, low-risk migrations, telemetry upgrades.
- Autumn (Oct-Dec): stabilization, retrospectives, capacity planning, next-year risk reviews.

## Seasonal Board Structure

Create or update the seasonal board in Notion or GitHub Projects with the following columns:

1. Debt to remove
2. Guardrails to add
3. Refactors
4. Prototypes
5. Build
6. Stabilize

Link each entry to a task in `tasks/` and ensure the entry references the relevant ADR or PRD.

## Monthly Forest Day

- Schedule one Forest Day per month (no meetings, no roadmap work).
- Goals:
  - Delete or simplify at least one notable area (code, automation, documentation).
  - Update or create at least one runbook or guide.
  - Share a recorded 15 minute learning with the team.
  - Merge at least one guardrail PR and log it in the Kaizen/Sisu channels.
- Capture the Forest Day plan through the `forest-day` issue template and update progress in `tasks/status-summary.md`.

## Metrics and Reporting

- Add seasonal highlights to `metrics/` snapshots (e.g., debt items resolved, guardrails added).
- Include seasonal progress in the weekly scorecard shared in `#clarivum-dev`.
- During Autumn planning, review the past three quarters of metrics and update goals for the next year.

## Related Documents

- Root guidance: `AGENTS.md` (sections 7, 16)
- Continuous improvement guide: `docs/role-guides/continuous-improvement.md`
- Kaizen ritual: `docs/playbooks/kaizen-minute.md`
- Sisu debugging: `docs/runbooks/sisu-debugging.md`
