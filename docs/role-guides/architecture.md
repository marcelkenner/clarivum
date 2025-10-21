# Architecture Guide

This guide supports architects and tech leads stewarding Clarivum’s long-term design. It connects the PTRD, ADRs, and operational reviews into a single workflow.

## Core artifacts

- PTRD: `docs/PRDs/first_steps.md`
- Architecture overview (C4): `docs/architecture.md`
- ADR catalog: `docs/adr/`
- Error budget & security policies: `docs/policies/`
- Runbooks & checklists: `docs/runbooks/`, `docs/checklists/`

## Responsibilities

1. **Maintain decision logs**  
   - Ensure every significant change goes through an ADR using `_template.md`.  
   - Track decision status (Proposed → Accepted → Superseded) and keep the index updated.
2. **Govern non-functional requirements**  
   - Review SLO, performance, and cost metrics monthly (see `docs/runbooks/cost-review.md`).  
   - Audit SLO compliance; trigger feature freezes per `error-budget-policy.md` when budgets burn.
3. **Design reviews**  
   - Run architecture reviews before major features.  
   - Validate API/data designs against the indexing rules and reliability targets.  
   - Capture open questions in the ADR “Consequences” section.
4. **Documentation hygiene**  
   - Keep `docs/architecture.md` in sync with reality (containers, data flows, telemetry).  
   - Add links to diagrams or Structurizr models where applicable.
5. **Cross-team alignment**  
   - Host bi-weekly architecture syncs; log notes and decisions back into the repo.  
   - Partner with DevOps to ensure IaC and environments reflect the decisions.

## Tooling shortcuts

- Use Context7 (`/vercel/next.js`, `/aws/lambda`, `/auth0/docs`, etc.) for authoritative references.  
- Maintain a shared Miro/Lucid link for high-level diagrams linked from `docs/architecture.md`.

## Asking for help

- For conflicting priorities, escalate through the engineering lead and product lead jointly.  
  Document trade-offs in ADRs.  
- Start a `[Architecture]` GitHub issue when new concerns arise; assign follow-ups and deadlines.  
- Keep the vibe golden—highlight gaps early, and ensure every team knows they can request more docs or tooling support at any time.
