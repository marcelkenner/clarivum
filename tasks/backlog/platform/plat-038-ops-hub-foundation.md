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
- [ ] Auth0 roles mapped to Ops Hub permissions with MFA enforced for admins and documented session lifetime policy.
- [ ] Supabase schema changes (integrations, jobs, audit tables) reviewed and migrations drafted with data governance.
- [ ] Environment variables and secrets cataloged per environment, stored in Secrets Manager, and mirrored in `.env.example`.
- [ ] ADR-031 walkthrough completed with stakeholders; decisions logged and open questions resolved.
- [ ] Flagsmith service keys provisioned per environment with restricted access and rotation plan documented.

## Definition of Done
- [ ] Next.js middleware enforces Auth0 RBAC for `/ops` routes with session timeout handling.
- [ ] Supabase migration adds `ops_audit` table, RLS policies, helper functions, and daily backup job.
- [ ] API proxy scaffold deployed (server-side route handlers with credential vault integration and structured logging).
- [ ] Feature flag scaffolding in place; default modules hidden until integration tasks complete.
- [ ] Observability (OTel spans + Grafana metrics) and alert baseline configured for the new namespace.
- [ ] Runbook `docs/runbooks/ops-hub.md` updated with access/rollback notes from implementation.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
