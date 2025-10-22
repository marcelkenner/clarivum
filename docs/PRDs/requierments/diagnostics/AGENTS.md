# docs/PRDs/requierments/diagnostics · AGENTS Guide

## Scope
- Captures requirements for quizzes and diagnostics that power personalization, lead capture, and recommendations.
- Defines branching logic, scoring, and data flows into profile, newsletter, and analytics systems.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/form-engine/feature-requirements.md`, `docs/PRDs/requierments/profile/feature-requirements.md`.
- Review privacy guidance in `docs/PRDs/requierments/legal/feature-requirements.md` before adjusting data capture.

## Execution Guardrails
- Model question banks as reusable modules with versioning; keep branching logic declared in configuration rather than embedded in UI code.
- Enforce consent handling and explain data usage in copy; coordinate with legal when questions change sensitivity.
- Ensure analytics events (start, drop-off, completion) stay aligned with analytics schema; update dashboards when altering funnels.
- Validate personalization outputs map to existing CTAs (ebooks, tools, newsletter segments) to avoid dead-ends.

## Handoff Checklist
- Update Strapi or configuration docs to reflect new questions/outcomes and share with marketing.
- Verify persistence paths (profile storage, anonymous save flows) are covered by QA plans.
- Provide support and lifecycle teams with summaries of any segmentation changes impacting messaging.
