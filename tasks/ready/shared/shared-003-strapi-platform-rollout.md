---
id: TSK-SHARED-003
title: Roll Out Strapi Content Platform
status: ready
area: shared
subarea: content-platform
owner: Content Platform Lead
collaborators:
  - Frontend Engineer
  - Content Strategist
  - Localization Partner
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/strapi/feature-requirements.md
  - docs/PRDs/requierments/strapi/setup.md
  - docs/PRDs/requierments/strapi/basic_pages.md
  - docs/PRDs/requierments/strapi/blog.md
  - docs/adr/ADR-010-content-management-platform.md
context7:
  - /strapi/documentation
  - /supabase/supabase
  - /vercel/next.js
tags:
  - cms
  - content
  - localization
---

## Summary
Configure Strapi v5, content models, workflows, and integrations so editors can publish Clarivum content quickly while engineers consume structured data across the site.

## Definition of Ready
- [x] Confirm content types, localization, and lifecycle states with editorial team (v0 set: Article, LandingPage, Tool, NavigationItem, MediaAsset with Strapi i18n; workflow `draft → in_review → approved → published → archived`).
- [x] Align deployment strategy (hosting, environments, CI) with DevOps (envs: dev, staging, prod plus PR previews; structure transfers under freeze window before publish).
- [x] Document AWS infrastructure requirements (ECS services, RDS class/storage, S3 public/private buckets, CloudFront, WAF, Secrets Manager keys, KMS CMKs, backup schedules in `docs/infra/cms-aws-overview.md`).
- [x] Document integration contracts for Next.js, Supabase, and search (versioned GraphQL/REST contracts, publish webhooks revalidating ISR, Supabase read-only entitlements, search indexer payload `{id,type,slug,title,summary,locale,tags}`).
- [x] Plan permissions, SSO integration, and governance (roles Author/Editor/Publisher/Admin with least privilege, OIDC/SAML SSO with MFA, append-only audit logs exported daily to S3).
- [x] Capture secrets catalog and distribution flow via AWS Secrets Manager (Platform Ops maintains redacted inventory, rotates every 90 days/role change, distribution only through Secrets Manager; no `.env` commits).
- [x] Align Strapi content model fields and editor guidance with the canonical layouts/copy defined in `docs/PRDs/requierments/ascii_designs.md` for homepage and related site experiences.

## Definition of Done
- [ ] ECS-hosted Strapi dev/prod environments deployed with required plugins, roles, localization, and AWS ALB ingress.
- [ ] RDS PostgreSQL, S3 media storage, and secrets wiring provisioned via Terraform with `.env.example` documented.
- [ ] Content models created per PRDs (homepage, blog, basic pages, ebooks) and mirror the layout/copy requirements captured in `docs/PRDs/requierments/ascii_designs.md`.
- [ ] CI/CD pipeline builds admin, runs schema validation/tests, and promotes changes with migration step.
- [ ] API integrations validated (preview, publish, webhook triggers) including signed webhook secrets.
- [ ] SSO, RBAC, security middleware (CSP/CORS), and audit logging configured per requirements.
- [ ] Backup + restore automation tested and logged; editorial workflow documented with training session scheduled.
- [ ] Follow-up tasks logged for observability, autoscaling, advanced content types, or automation gaps.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

