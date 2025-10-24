# Backend Guide

Clarivum’s backend work focuses on the BFF layer inside Next.js, Supabase data modelling, and asynchronous jobs on AWS. Use this guide to stay aligned with the platform decisions already in place.

## Key references

- Architecture overview & C4 diagrams: `docs/architecture.md`
- ADRs:  
  - `ADR-001` (Supabase, Vercel hosting)  
  - `ADR-002` (Auth0 authentication model)  
  - `ADR-003` (SQS + Lambda jobs)  
  - `ADR-004` (Observability)  
- Data & indexing policies: `docs/PRDs/first_steps.md` §4
- Security baseline: `docs/policies/security-baseline.md`

## Daily workflow

1. **Design first**  
   - Draft API contracts (input/output JSON) and validation with Zod.  
   - Confirm data ownership and indexing requirements; update ERD or migrations plan in `/docs/architecture.md` if structure changes.
2. **AuthN/AuthZ**  
   - Enforce Auth0-issued JWT validation via NextAuth middleware.  
   - Map Auth0 roles to Supabase RLS policies; document changes in the PR.
3. **Database work**  
   - Use Supabase SQL migrations (via `supabase db diff/push`).  
   - Every new query must include indexes or reference an existing indexing plan.  
   - Record schema changes in a short ADR addendum if they affect other teams.
4. **Background jobs**  
   - Model payloads as TypeScript types shared between enqueuer and worker.  
   - Implement idempotency keys and retry semantics per `ADR-003`.  
   - Update `docs/runbooks/deployment.md` if new jobs need deployment steps.
5. **Observability & testing**  
   - Add OTel spans/metrics for every new API or job.  
   - Cover shared TypeScript utilities with Vitest (`npm run test`) and document gaps that still need contract or integration tests.  
   - Monitor Grafana dashboards after merging; note anomalies in #clarivum-backend.

## Performance & reliability guardrails

- Hit the p95/p99 targets (300 ms / 800 ms) defined in `docs/README.md`.  
- Any change that risks SLOs must update `docs/policies/error-budget-policy.md` and related dashboards.  
- Maintain RPO ≤ 15 min, RTO ≤ 2 hours—run restore drills as described in `docs/runbooks/incident-response.md`.

## Asking for help

- Database reviews → ping the data champion (listed in `docs/architecture.md`).  
- Auth questions → coordinate with the security lead and consult Context7 Auth0/NextAuth docs.  
- Job infrastructure → #clarivum-platform or the DevOps rotation.  
- If something feels missing, open a `[Backend]` issue or drop details in `#clarivum-dev`; we’ll document or automate it quickly.
