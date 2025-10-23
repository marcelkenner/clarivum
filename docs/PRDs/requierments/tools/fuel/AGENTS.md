# docs/PRDs/requierments/tools/fuel · AGENTS Guide

## Scope
- Nutrition pillar tools supporting `/fuel/` funnels (diagnostics, planners, converters, shopping aids).
- Shaping product requirements, calculations, and UX rules before design or engineering begins.

## Must Read
- `docs/PRDs/clarivum_brand.md` (Fuel section positioning), `docs/PRDs/requierments/tools/feature-requirements.md`, `docs/runbooks/tools-platform-operations.md`.
- Nutrition science references validated with SMEs; confirm formulas via regulatory-compliant sources before implementation.

## Execution Guardrails
- Keep calculators headless: formulas and data services live in dedicated managers, UI consumes via ViewModels.
- Support Polish + English localization paths (copy, units, cultural food references).
- Persist optional user inputs via profile service; never store health data without explicit consent and retention policy.

## Handoff Checklist
- Attach PRD links to Jira task before sprint grooming.
- Verify analytics events with data team; document BigQuery schema updates if new metrics are introduced.
- Coordinate marketing sign-off for copy, disclaimers, and lead-gen CTAs bundled with each tool.
