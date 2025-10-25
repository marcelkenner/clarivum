# API Routes · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
The `src/app/api/` directory contains Next.js App Router route handlers and server actions. Treat everything here as the backend-for-frontend (BFF) boundary that coordinates Clarivum’s UI with Supabase, Strapi, and the AWS job tier.

## Scope and structure

- Organize handlers by domain: `src/app/api/<area>/<resource>/route.ts`. Co-locate shared helpers under `src/app/api/<area>/lib/` with an `AGENTS.md` if the folder grows.
- Each handler exports a single HTTP method (`GET`, `POST`, etc.) and delegates business rules to Managers or Coordinators defined alongside the consuming feature.
- When exposing server actions, keep the exported function lean: validate inputs, call a Coordinator/Manager, and return serializable results.
- Mirror feature taxonomy from `docs/PRDs/` and reference the owning ADR in file headers or TODOs.

## Contracts and validation

- Define request/response schemas with Zod (or the shared schema package) and parse them before touching dependencies. Surface validation failures with typed error helpers so clients receive consistent responses.
- Use typed DTOs for Supabase queries, Strapi calls, and job payloads. Never return raw database rows—map through a ViewModel-friendly shape.
- Document new endpoints in `docs/api/` or the relevant runbook. Update the root `AGENTS.md` or ADR if the contract changes expectations across teams.

## Security and compliance

- Verify Auth0-issued tokens via NextAuth middleware (ADR-002). Reject unauthenticated requests before hitting business logic.
- Enforce authorization through role checks or Supabase policies. Never rely on frontend hints for access control.
- Sanitize all outbound payloads to avoid leaking PII. Log identifiers or metrics, not full objects, per `docs/policies/security-baseline.md`.
- Maintain rate limits and anti-abuse checks; coordinate with `docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md` when adjusting thresholds.

## Data access and side effects

- Managers own data mutations and integrations. Route handlers should only orchestrate dependencies, not embed SQL or third-party SDK logic inline.
- Queue background work via the shared job library from ADR-003 (SQS + Lambda). Include idempotency keys and guardrail tasks when introducing new job types.
- Cache decisions (`revalidate`, `cache`, tags) must align with `docs/architecture.md` and the Ops Hub runbooks. Prefer stale-while-revalidate over manual cache invalidation.

## Observability and guardrails

- Wrap every handler in OpenTelemetry spans (ADR-004) and emit structured logs with correlation IDs. Record failure metrics that feed the Kaizen scoreboard.
- Add automated tests (Vitest or integration tests) for new logic. Include fixtures under `__fixtures__/` and run `npm run test` / `npm run validate` before opening a PR.
- For incidents, append a Sisu note (`sisu-log/`) and land the guardrail within 48 hours as mandated in the root `AGENTS.md`.
- Browser traces relay through `/api/observability/v1/traces`. When updating that endpoint (or adding similar proxies), keep them slim: authenticate, forward, and return. Never expose Grafana credentials to the client.

## Review checklist

- [ ] Request and response schemas validated with Zod before side effects.
- [ ] AuthZ/AuthN handled consistently with NextAuth + Supabase RLS policies.
- [ ] Business logic lives in Managers/Coordinators, not route files.
- [ ] Observability (OTel span + structured log) and guardrails (tests or alerts) added or updated.
- [ ] Docs/runbooks/tasks updated to reflect new endpoints or behaviors.
