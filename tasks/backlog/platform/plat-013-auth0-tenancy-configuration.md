---
id: TSK-PLAT-013
title: Configure Auth0 Tenancy & Access Policies
status: backlog
area: platform
subarea: identity
owner: Security Lead
collaborators:
  - DevOps Lead
  - Frontend Lead
effort: medium
created_at: 2025-10-25
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/login/feature-requirements.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/adr/ADR-002-authentication-and-authorization.md
  - docs/runbooks/incident-response.md
context7:
  - /auth0/docs
  - /vercel/next.js
tags:
  - authentication
  - security
  - infrastructure
---

## Summary
Stand up the Auth0 tenant, applications, and role mappings required for Clarivum’s web app, Strapi admin, and automation clients while enforcing MFA, least-privilege access, and EU data residency options.

## Definition of Ready
- [x] Application inventory confirmed: `web-app`, `strapi-admin`, `ops-hub`, `cli-tools` with callback/logout URLs under `*.clarivum.com`.
- [x] Branding/localization/legal requirements aligned: Universal Login themed with `en`/`pl` locales and ToS/Privacy links.
- [x] Roles/permissions matrix documented: roles `member`, `subscriber`, `admin`, `reviewer` with scoped APIs and log streaming to CloudWatch.
- [x] Budget approval secured for Auth0 Business plan (upgrade to Enterprise if SAML/B2B needed) with Finance sign-off text prepared.

## Definition of Done
- [ ] Auth0 tenant provisioned with required applications, connections, and MFA policies per ADR-002.
- [ ] Roles, permissions, and RBAC groups created; access granted to internal staff via least privilege.
- [ ] Secrets distributed via AWS Secrets Manager and CI pipelines; sample `.env.example` updated.
- [ ] Login flows smoke-tested end-to-end with Next.js dev build and Strapi admin.
- [ ] Runbooks updated with escalation contacts and incident handling for Auth0 outages.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
