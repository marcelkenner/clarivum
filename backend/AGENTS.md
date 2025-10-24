# Backend · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
This directory captures backend practices for Clarivum’s BFF layer, asynchronous jobs, and shared server-side utilities. Keep it aligned with `docs/role-guides/backend.md`, ADR-001, ADR-002, ADR-003, and ADR-004.

## Scope and structure

- Backend logic primarily lives in:
  - Next.js route handlers and server actions under `src/app/api/` (see that guide for HTTP-specific rules).
  - Managers, Coordinators, and repositories that power ViewModels (`src/app/<feature>/managers|coordinators`).
  - Background job handlers and shared server utilities (place under `backend/jobs/`, `backend/lib/`, or feature-specific folders; add local `AGENTS.md` if a subdirectory grows).
- Keep business rules out of UI components. Route handlers and jobs should orchestrate Managers rather than embed SQL or third-party SDK code inline.

## Tooling and commands

- Run Supabase migrations and seed data through the database workflow (`database/AGENTS.md`).
- Execute backend-focused validation before shipping:
  - `npm run lint:code` – catches unused imports, banned patterns.
  - `npm run typecheck` – ensures shared types remain in sync.
  - `npm run test` – run Vitest suites covering Managers, Coordinators, and job handlers.
- For job handlers, add integration smoke tests or contract tests where feasible; document manual steps in the PR when automation is missing.

## Security and observability

- Enforce Auth0 + NextAuth authentication and role checks before mutating data. Align Supabase RLS policies with expectations in `docs/policies/security-baseline.md`.
- Emit OpenTelemetry spans and structured logs (JSON) with correlation IDs across API handlers and jobs. Ensure failures increment appropriate metrics for the Kaizen scoreboard.
- Never log secrets or PII—log identifiers or counts only.

## Background jobs

- Queue work via the shared job library targeting Amazon SQS (ADR-003). Define payload schemas with Zod and include idempotency keys.
- Lambda handlers should be idempotent, retry-safe, and instrumented. Bump visibility timeouts or concurrency limits via IaC PRs and document the change.
- Record new jobs in `docs/runbooks/ops-hub.md` or a dedicated runbook section to support incident response.

## Review checklist

- [ ] Authentication and authorization are enforced before business logic.
- [ ] Request/response or payload schemas validated via shared utilities.
- [ ] Managers/Coordinators own third-party calls or SQL; route handlers/jobs remain orchestration only.
- [ ] OTel span + structured log added or updated; dashboards/docs referenced if thresholds shift.
- [ ] Guardrail (unit/integration test, lint rule, alert) added and linked in the Kaizen log.
- [ ] Database schema or storage changes coordinated with the database guide and documented as needed.

Keep this guide synchronized with architecture decisions and runbooks. Update it when backend tooling, infrastructure, or conventions evolve.
