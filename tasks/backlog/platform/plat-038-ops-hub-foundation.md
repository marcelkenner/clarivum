---
id: TSK-PLAT-038
title: Stand Up Clarivum Operations Hub Foundation
status: backlog
area: platform
subarea: internal-tools
owner: Platform Tech Lead
collaborators:
  - Frontend Lead
  - Security Lead
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/operations-hub/feature-requirements.md
  - docs/adr/ADR-031-admin-operations-hub.md
  - docs/runbooks/ops-hub.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/AGENTS.md
context7:
  - /vercel/next.js
  - /auth0/nextjs-auth0
  - /supabase/supabase
tags:
  - internal-tools
  - auth
  - platform
---

## Summary
Bootstrap the `/ops` namespace inside the Next.js app, enforce Auth0-based RBAC, provision the Supabase `ops_audit` schema, and wire feature flags so the Clarivum Operations Hub can ship behind controlled gates.

## Definition of Ready
- [ ] Confirm Auth0 role mapping (`ops_viewer`, `ops_editor`, `ops_admin`, `ops_finance`) and MFA policy with security.
- [ ] Align Supabase schema changes (ops_audit, supporting views) with data governance.
- [ ] Define Vercel environment variables and Secrets Manager entries for proxy credentials.
- [ ] Review ADR-031 architecture with stakeholders; capture feedback.
- [ ] Feature flag keys agreed (`ops_module_<slug>`) and seeded in Flagsmith.

## Definition of Done
- [ ] Next.js middleware enforces Auth0 RBAC for `/ops` routes with session timeout handling.
- [ ] Supabase migration adds `ops_audit` table, RLS policies, helper functions, and daily backup job.
- [ ] API proxy scaffold deployed (server-side route handlers with credential vault integration and structured logging).
- [ ] Feature flag scaffolding in place; default modules hidden until integration tasks complete.
- [ ] Observability (OTel spans + Grafana metrics) and alert baseline configured for the new namespace.
- [ ] Runbook `docs/runbooks/ops-hub.md` updated with access/rollback notes from implementation.
