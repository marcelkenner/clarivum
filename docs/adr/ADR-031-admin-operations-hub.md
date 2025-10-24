# ADR-031: Clarivum Operations Hub (Unified Admin Panel)
Date: 2025-10-24  
Status: Proposed

## Context
- Clarivum relies on many discrete operator consoles (Strapi, Listmonk, Plausible, Flagsmith, Stripe, PayU, Przelewy24, Supabase, Grafana). Operators must jump between them to answer routine questions, which slows triage and introduces access risk.
- Existing runbooks reference these surfaces individually, but there is no consolidated view for cross-domain health, queue backlogs, or guardrail compliance. Kaizen/Sisu cadences now require faster feedback loops.
- Support, marketing, finance, and engineering leaders need a shared “source of operational truth” with contextual actions (e.g., trigger replays, resend emails, check wallet health) without broadening privileged access to every vendor console.
- We already standardized on Auth0 + Supabase for RBAC, Vercel for hosting, and Next.js for internal tools. A unified admin layer can reuse platform primitives (feature flags, observability, audit logging) and reduce cognitive load.
- A new artifact must avoid duplicating every external UI. Instead, it should aggregate key signals, deep-link operators to source systems, and provide the highest-value cross-system actions.

## Decision
- Build an internal “Clarivum Operations Hub” (COH) housed within the Clarivum Next.js app under an `/ops` namespace, deployed to Vercel but gated by Auth0 roles (`ops_admin`, `ops_editor`, `ops_viewer`).
- COH modules (initial launch):
  - **Overview dashboard:** surface SLO/SLA indicators (pull from Grafana HTTP API) plus recent incidents, Kaizen guardrails, and Sisu notes.
  - **Content & publishing:** list Strapi workflow states, failed webhook deliveries, and cache invalidation controls (using Strapi REST API + Supabase snapshots).
  - **Communications:** expose Listmonk campaign status, SES deliverability metrics, Novu workflow health, and guardrail checks for Kaizen tasks.
  - **Commerce & payments:** show Stripe, PayU, and Przelewy24 pipeline status (webhook health, wallet availability, settlement alerts) with quick links to refunds or retriggers; leverage existing webhook metadata stored in Supabase.
  - **User support console:** enable search across member profiles, entitlements, subscriptions, and support tickets (Supabase, Flagsmith, Listmonk).
- Every module must provide deep-link shortcuts back to the authoritative native console (e.g., Strapi entry, Listmonk campaign, Stripe dashboard) so operators can escalate into full tooling without hunting URLs.
- Introduce a composition layer (`/apps/ops/services/`) to proxy external APIs through server-side Next.js route handlers. This protects vendor credentials and allows centralized logging/auditing via Supabase `ops_audit` table.
- Enforce least privilege: all write operations require explicit feature flags, are logged, and respect manual approval toggles for destructive actions (e.g., refund, cache purge).
- Host diagrams describing system boundaries, data flow, admin workflows, and RBAC states under `docs/diagrams/adr-031-admin-operations-hub/`.
- Align runbook coverage with new operations: add `docs/runbooks/ops-hub.md` to document daily/weekly usage, incident response, and release rollout.
- Update PRD stack with `docs/PRDs/requierments/operations-hub/feature-requirements.md` capturing user journeys, requirements, and acceptance criteria.

## Diagrams
- [Architecture Diagram](../diagrams/adr-031-admin-operations-hub/architecture-overview.mmd) — container view showing COH data sources (Strapi, Supabase, Listmonk, Grafana, Stripe, Plausible) and Auth0/Vercel integration.
- [Data Flow Diagram](../diagrams/adr-031-admin-operations-hub/data-flow.mmd) — illustrates how operational data moves between vendor APIs, Supabase, and the Operations Hub UI.
- [UML Component Diagram](../diagrams/adr-031-admin-operations-hub/uml-components.mmd) — component relationships for proxy services, RBAC gateways, and module boundaries.
- [BPMN Operations Workflow](../diagrams/adr-031-admin-operations-hub/bpmn-operations.mmd) — incident-to-resolution process highlighting approvals, deep links, and audit logging.

## Consequences
- Benefits: reduced tool-switching, faster Sisu guardrail execution, centralized auditing, and consistent RBAC enforcement via Auth0 & Supabase.
- Costs: upfront engineering work (Next.js module, API proxy layer), ongoing vendor API maintenance, need for availability SLO (≥99.5% for internal operators).
- Risks: potential for privilege escalation if proxy layer misconfigured, rate limits from vendor APIs, security obligations for storing aggregated insights.
- Mitigations: enforce feature flags + server-side validations, reuse Supabase Row Level Security, cache vendor data with TTLs, document rollback (feature flag off).
- Follow-ups: create backlog tasks for MVP delivery (architecture, API integrations, UI/UX), extend monitoring dashboards, ensure compliance review before launch, and evaluate future integration with `/status` internal page.
