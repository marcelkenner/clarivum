# docs/PRDs/requierments/strapi · AGENTS Guide

## Scope
- Governs Strapi content models, editorial workflows, and API expectations for Clarivum’s marketing surfaces.
- Keeps structured content synchronized with Next.js, analytics tagging, and legal/compliance requirements.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/frontend-platform/feature-requirements.md`, `docs/PRDs/requierments/legal/feature-requirements.md`, and any ADRs on CMS hosting.
- Check Strapi plugin or API documentation via Context7 before introducing schema or workflow tooling changes.

## Execution Guardrails
- Maintain single-responsibility content types that mirror sitemap modules; document relationships to prevent orphaned data.
- Enforce validation rules, localization readiness, and media governance; note deviations with review responsibilities.
- Capture API performance expectations (ISR triggers, caching headers) when requirements evolve.
- Ensure role-based permissions and workflow states align with security policies; update audit expectations if they change.

## Handoff Checklist
- Communicate schema changes to frontend and analytics teams, including migration plans and content backfills.
- Update editorial training materials/runbooks when workflows or permissions shift.
- Verify API endpoints post-change (preview + production) and log cache invalidation requirements.
