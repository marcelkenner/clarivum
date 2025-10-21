# ADR-002: Authentication & Authorization Model
Date: 2025-10-21
Status: Accepted

## Context
- Clarivum requires secure access for two cohorts: public members (for gated assets) and internal editors/ops users.
- Compliance expectations include MFA for privileged roles, GDPR consent capture, and the ability to revoke access centrally.
- Next.js runs primarily on Vercel (serverless/edge constraints), so bespoke auth services would increase maintenance cost.
- We must support social sign-in (Google, Apple) for members while keeping SSO/MFA enforceable for staff.

## Decision
- Use **Auth0 (EU region)** as the primary OIDC identity provider.
  - Create two applications: `clarivum-public` (PKCE + social connections) and `clarivum-admin` (enterprise connections + enforced MFA).
  - Enforce MFA for any role with `role:admin` or `role:editor` via Auth0 policies.
- Integrate Auth0 with **NextAuth.js** (Auth.js) in the Next.js BFF layer:
  - Store sessions as encrypted, HTTP-only cookies (`SameSite=Lax`, `Secure`).
  - Issue short-lived (8-hour) access tokens and refresh tokens for server components; refresh handled via rotating sessions.
- Model RBAC within Auth0 and mirror permissions in Postgres using role claims; apply Row Level Security policies that map to Auth0 roles.
- For internal tooling (background workers, scripts), use Auth0 Machine-to-Machine applications with client credentials, rotated via AWS Secrets Manager.

## Consequences
- **Benefits:** Managed identity lifecycle, MFA out-of-the-box, low engineering lift, auditable login history, and GDPR-compliant EU data residency.
- **Trade-offs:** Adds recurring vendor cost and platform lock-in. Mitigation: review annually; keep NextAuth adapters abstracted to enable migration to Cognito or custom IdP.
- **Operational impacts:** Auth0 rate limits require caching of JWKS and introspection responses. Documented in the deployment runbook to avoid exceeding quotas.
- **Follow-ups:**
  - Configure automated user provisioning for staff via SCIM once headcount grows.
  - Add security monitoring hooks (log streaming to Grafana Loki) to detect suspicious auth events.
