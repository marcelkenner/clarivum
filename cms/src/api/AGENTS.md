# cms/src/api · AGENTS Guide

**Context7:** Reference Strapi API and Entity Service docs in `/strapi/documentation/v5_2_2`.

## Structure

- Each folder under `api/` maps to a content-type (`api::<collection>.<name>`). It contains `content-types/`, `controllers/`, `routes/`, and `services/`.
- JSON schema files are generated—edit them via the content-type builder or CLI, not by hand, to avoid drift.

## Workflow

- Create new types with `npm run strapi generate content-type` or through the admin builder, then commit the generated artifacts.
- Implement business logic inside services using `strapi.entityService` or repositories; keep controllers thin.
- Regenerate TypeScript definitions after schema changes via `npm run strapi ts:generate-types` and commit the updated types.
- Update `docs/PRDs/requierments/strapi/feature-requirements.md` whenever the API surface changes, and align frontend contracts in the relevant feature guides.

## Guardrails

- Add unit or integration tests before exposing new endpoints (wire them into `npm run test` when the suite matures).
- Validate security (RBAC, auth policies) against ADR-010 and audit logs. Capture follow-up guardrails in Kaizen Minutes.
- Document breaking changes and migrations in `sisu-log/` with an owner + verification plan.
