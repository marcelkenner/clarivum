# Plausible Analytics Platform Diagrams · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
## Directory Purpose
- Visualize the Plausible-first analytics architecture defined in `docs/adr/ADR-029-plausible-analytics-platform.md`.
- Ensure diagrams stay synchronized with runbooks (`docs/runbooks/analytics-qa.md`, `docs/runbooks/cookie-consent-operations.md`) and the event catalogue.
- Provide modular Mermaid sources that other teams can embed without exceeding 500-line limits.

## Diagram Responsibilities
- `architecture-overview.mmd`: Show client/server event producers, consent gating, proxy endpoints, Plausible ingestion, dashboarding, and alerting.
- `data-lineage.mmd`: Describe data origins, consent flags, Plausible storage, nightly exports to Supabase, and downstream consumers.
- `uml-instrumentation.mmd`: Document classes (`PlausibleScriptManager`, `PlausibleEventDispatcher`, `AnalyticsEventRegistry`, `AnalyticsConsentGuard`) plus injected interfaces.
- `bpmn-governance.mmd`: Map the workflow for proposing, reviewing, testing, and launching analytics schema changes.

## Contribution Workflow
- Update diagrams alongside ADR or runbook edits so architectural intent stays consistent.
- Include a short rationale in PR descriptions, referencing impacted PRDs or tasks.
- Request reviews from Growth Analytics and one cross-discipline partner (platform, privacy, or QA).
- Keep Mermaid files idiomatic: explicit node names, subgraphs for boundaries, and comments when flows grow dense.
- Run `npm run validate` and preview diagrams locally before merging.

## Quality Checklist
- Ensure files remain under 500 lines; split diagrams if detail increases.
- Use terminology that matches ADR-029 and shared type definitions.
- Highlight consent and privacy boundaries clearly.
- Prefer first-party endpoints in node labels (`/analytics/js/script.js`, `/analytics/api/event`).

## Escalation
- Capture open questions in `tasks/` with the `analytics` tag.
- Raise a new ADR amending ADR-029 if diagram changes imply a material decision shift.
