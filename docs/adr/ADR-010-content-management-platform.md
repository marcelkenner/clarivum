# ADR-010: Content Management Platform
Date: 2025-10-21
Status: Accepted

## Context
- Clarivum’s editorial roadmap (blog, ebooks, diagnostic copy) needs structured authoring, localization, and medical review workflows managed outside the application codebase.
- Editors require rich custom components, scheduled releases, and SEO controls aligned with the Strapi PRDs while engineering must keep schemas version-controlled.
- Small team size (<4 engineers) and GDPR obligations favour a managed solution with EU-hosted data and minimal DevOps overhead.
- Content deploys must integrate with Next.js ISR revalidation, feature flag metadata, and search webhooks while providing extensible APIs (REST + GraphQL).
- Requirements are outlined in `docs/PRDs/requierments/strapi/feature-requirements.md` and operational setup guidance in `docs/PRDs/requierments/strapi/setup.md`.

## Decision
- Standardize on **Strapi v5**, self-managed on **AWS (eu-central-1)** to retain cost control and align infrastructure with existing Terraform & runbook standards.
  - Package Strapi as a container deployed to AWS ECS Fargate with ALB ingress and HTTPS termination (Context7 `/strapi/documentation` deployment guidance).
  - Provision Amazon RDS for PostgreSQL 15 with PITR enabled; replicate daily snapshots to Supabase to satisfy ADR-001 disaster recovery goals.
  - Store media in S3 with versioning + lifecycle policies; connect via the Strapi S3 upload provider.
- Define the CMS solution architecture:
  - Create separate Strapi workloads for `dev` and `prod`, each sourced from GitOps-based configuration packages; schema changes promoted through CI/CD pipelines.
  - Model content types/components according to the Strapi blog requirements, enforcing Draft & Publish, localization, and workflow stages.
  - Expose read-only REST & GraphQL endpoints with API tokens scoped by environment; integrate rate limiting (ADR-006) to shield from abuse.
  - Webhooks trigger Next.js revalidation, Meilisearch indexing (ADR-009), and lifecycle analytics.
- Bundle custom admin extensions (e.g., medical review tools) as Strapi plugins stored in `cms/plugins/`, built into the admin panel during `yarn build`.
- Manage secrets via AWS Secrets Manager (ADR-007) injected at runtime through ECS task definitions and CI pipelines.

## Diagrams
- [Architecture Overview](../diagrams/adr-010-content-management-platform/architecture-overview.mmd) — AWS-hosted Strapi environments, integrations, and backup flows.
- [Data Lineage](../diagrams/adr-010-content-management-platform/data-lineage.mmd) — Core content types, localization relationships, and asset associations.
- [UML Extensions](../diagrams/adr-010-content-management-platform/uml-extensions.mmd) — Deployment, migration, plugin, and webhook components.
- [BPMN Release Workflow](../diagrams/adr-010-content-management-platform/bpmn-release.mmd) — Editorial path from drafting to publish and validation.

## Consequences
- **Benefits:** Self-managed Strapi keeps operating costs predictable, provides full control over upgrades, and still meets localization and workflow needs.
- **Trade-offs:** Clarivum assumes responsibility for runtime patching, autoscaling, and observability; mitigated via Terraform modules and runbook automation.
- **Operational notes:** Strapi upgrade cadence (v5 minor releases) must be tracked quarterly; regression tests run against the dev environment before promotion.
- **Follow-ups:**
  - Document editorial onboarding and role permissions in `docs/role-guides/editorial.md`.
  - Implement automated schema diffs to surface breaking changes during PR review.
  - Establish SLA for webhook processing and add alerting for failed revalidation/indexing jobs.
