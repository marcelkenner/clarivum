# docs/PRDs/requierments · AGENTS Guide

## Scope
- Collects Clarivum feature requirement briefs that inform discovery, planning, and delivery.
- Each subfolder focuses on one capability; keep documents short, current, and tied to measurable outcomes.

## Required Context
- Review `docs/PRDs/first_steps.md`, `docs/PRDs/clarivum_brand.md`, and the relevant ADRs before editing requirements.
- Use Context7 (`context7__resolve-library-id` → `context7__get-library-docs`) for any framework or platform clarification.

## Working Agreements
- Document changes that impact scope, KPIs, or dependencies in the matching `feature-requirements.md`; create additional files only when responsibility splits.
- Cross-link to adjacent requirements (analytics, subscriptions, etc.) when introducing dependencies so downstream teams can trace the impact.
- Reflect roadmap or ownership updates in `tasks/` and regenerate summaries (`npm run tasks:summary`) after significant edits.

## Maintenance Checklist
- Run `npm run ensure:agents` after adding directories so new folders inherit the guidance scaffolding.
- Keep every file under 500 lines; split content by concern instead of appending large sections.
- When requirements drive architecture changes, update or add ADRs and call out open questions explicitly.
