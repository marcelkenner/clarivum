# docs/roadmaps · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` → `context7__get-library-docs`).

## Purpose
- Maintain multi-season engineering and product roadmaps; the canonical artifact is `engineering-roadmap-2025-2026.md`.
- Anchor roadmap updates to the Metsa cadence, Kaizen guardrails, and Sisu incident notes so flow/quality/sustainability stay balanced.
- Capture sprint-level links (`tasks/sprints/**/plan.md`), key initiatives, and metrics rollups for leadership reviews.

## Editing Workflow
- Keep roadmap sections grouped by Metsa season; add or update sprint links when schedules shift and adjust copy to match actual outcomes.
- Update milestone bullet lists in place instead of duplicating task details; link to task files (e.g., `../../tasks/backlog/...`) instead of restating statuses.
- Document sequencing or dependency changes with a short rationale and reference the supporting PRD/ADR (for example `docs/PRDs/first_steps.md`, `docs/adr/ADR-031-admin-operations-hub.md`).
- When creating a new roadmap, start from the existing structure, include a `Dependency Highlights` and `Review Cadence` section, and record the generation date in the intro paragraph.

## Validations
- Run `npm run lint:docs` after edits to catch broken links or anchors.
- Run `npm run lint:tasks` (or `npm run validate`) when you touch sprint/task references to keep metadata consistent.
- Use `npm run tasks:summary` to confirm the roadmap aligns with the task board lanes.
- Re-run `npm run ensure:agents` if you add or rename roadmap folders so sibling guides stay fresh.

## Coordination
- Mirror roadmap scope changes back into the relevant sprint plans and backlog tasks before merging.
- Surface new guardrail work in `docs/runbooks/` or `sisu-log/` and link those updates from the roadmap for traceability.
- Summarize major roadmap revisions in the daily Kaizen issue and `#clarivum-dev` to maintain shared visibility.
