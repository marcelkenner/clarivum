# docs/PRDs/requierments/components · AGENTS Guide

## Scope
- Defines Clarivum’s reusable marketing component library, aligned with the brand design system and Storybook.
- Establishes how primitives, content modules, and accent variants support every vertical without duplication.

## Must Read
- `feature-requirements.md`, `docs/PRDs/clarivum_brand.md`, `docs/PRDs/requierments/storybook/feature-requirements.md`.
- Reference Tailwind/Next/React docs via Context7 before updating platform assumptions.

## Execution Guardrails
- Keep components stateless where possible; hook dependencies (analytics, flags) must be injected rather than hard-coded.
- Document prop contracts, accessibility notes, and vertical accent options in Storybook concurrently.
- Enforce file size and performance budgets; note bundle impact when adding animations or heavy assets.
- Coordinate token or motion decisions with design and update ADRs if tooling or library choices shift.

## Handoff Checklist
- Ensure new/updated components have stories, accessibility validation, and analytics hooks defined.
- Update adoption tracking (component inventory, usage notes) in `docs/architecture.md` if patterns change.
- Notify dependent PRD owners (homepage, tools, ebooks) about breaking prop or token adjustments.
