# Authentication & Authorization Model Diagrams
- **ADR:** `docs/adr/ADR-002-authentication-and-authorization.md`
- **Last updated:** 2025-10-23
- **Owners:** Security Engineering

## Overview
These diagrams outline how Auth0, NextAuth.js, and Clarivum’s platform collaborate to secure member and staff access. They cover the identity flows, role mapping into Supabase, and the operational playbook for managing privileged access.

## Files
- `architecture-overview.mmd` — OIDC integrations between Auth0, Next.js, and Supabase.
- `data-lineage.mmd` — Identity, session, and role data replicated across providers.
- `uml-domain.mmd` — Session and role management classes involved in enforcing RBAC.
- `bpmn-access-governance.mmd` — Access provisioning and revocation workflow across teams.
