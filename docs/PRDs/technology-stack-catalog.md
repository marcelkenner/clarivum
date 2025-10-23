# Technology Stack Catalog
Last Updated: 2025-10-23

Clarivum relies on a curated mix of open source projects, managed platforms, and vendor services to satisfy functional requirements while staying compliant with EU residency, privacy, and performance guardrails. This catalog inventories every adopted or planned tool so teams can align roadmaps, runbooks, and procurement. Update this file whenever we introduce, retire, or materially change a dependency.

> **Canonical decisions:** See `docs/adr/ADR-001-primary-cloud-and-database.md`, `docs/adr/ADR-002-authentication-and-authorization.md`, `docs/adr/ADR-003-background-jobs-and-queues.md`, `docs/adr/ADR-004-observability-stack.md`, `docs/adr/ADR-005-feature-flags.md`, `docs/adr/ADR-007-secrets-management-and-configuration-distribution.md`, `docs/adr/ADR-009-search-and-discovery-platform.md`, `docs/adr/ADR-011-payments-and-checkout-orchestration.md`, `docs/adr/ADR-013-mailing-platform-and-campaign-automation.md`, `docs/adr/ADR-016-ci-cd-platform.md`, `docs/adr/ADR-019-frontend-platform.md`, and `docs/adr/ADR-028-security-and-compliance-baseline.md` for the authoritative technology choices.

## Selection principles
- **Mission alignment:** Supports modular funnels described across `docs/PRDs/first_steps.md` and `docs/PRDs/clarivum_brand.md`.
- **SLA awareness:** Well-documented reliability plus clear runbook coverage before launch.
- **Compliance first:** EU hosting or regional data controls, GDPR-ready exports, and audit logging.
- **Operational leverage:** Active communities, automation hooks, and compatibility with Next.js 15, React 19, and Vercel serverless runtimes.

## Adopted tooling

### Core web platform
- **Next.js 15 (MIT)** – Primary application framework (App Router, ISR) running on Vercel. Referenced throughout marketing and diagnostics requirements.
- **React 19 (MIT)** – UI composition layer leveraging Server Components and concurrent rendering.
- **TypeScript 5 (Apache 2.0)** – Strict typing baseline for frontend, API routes, and shared packages.
- **Node.js 20 + Turbopack** – CI, local development, and Vercel build tooling.

### UI experience & styling
- **Tailwind CSS 4 (MIT)** – Utility-first styling mapped to Clarivum design tokens in `docs/PRDs/brand_design_system.md`.
- **Sonner (MIT)** – Toast notification system per ADR-012, orchestrated via `NotificationManager`.
- **Storybook (MIT)** – Component workbench supporting design QA and documentation.

### Forms & validation
- **React Hook Form (MIT)** – High-performance form controller for diagnostics and checkout flows.
- **Zod (MIT)** – Runtime schema validation for user input, API payloads, and personalization logic.

### Identity, security & feature control
- **Auth0 (Commercial SaaS)** – OIDC provider for members and staff (ADR-002), paired with enforced MFA. Implementation tracked in `tasks/backlog/platform/plat-013-auth0-tenancy-configuration.md` (TSK-PLAT-013).
- **Auth.js / NextAuth (ISC)** – Session orchestration inside Next.js BFF layer.
- **AWS Secrets Manager (Commercial)** – Central secret store with rotation workflows (ADR-007, `docs/runbooks/secrets-management.md`).
- **Flagsmith (BSD-3-Clause)** – Feature flag management with EU hosting (ADR-005). Implementation tracked in `tasks/backlog/platform/plat-014-flagsmith-environments.md` (TSK-PLAT-014).
- **Klaro! (AGPL-3.0)** – Consent Management Platform for cookie banners and preference center (ADR-014, `docs/runbooks/cookie-consent-operations.md`).

### Content, messaging & engagement
- **Strapi v5 (MIT)** – Headless CMS for editorial workflows (ADR-010).
- **Listmonk (AGPLv3 self-hosted)** – Lifecycle mailing engine deployed on AWS ECS Fargate (ADR-013, `docs/runbooks/mailing-operations.md`).
- **Amazon SES (Commercial)** – Outbound SMTP provider backing Listmonk campaigns and transactional messaging.

### Data, storage & integration
- **Supabase (Apache 2.0 managed)** – Primary Postgres + storage with Row Level Security (ADR-001). Implementation tracked in `tasks/backlog/platform/plat-012-supabase-tenancy-provision.md` (TSK-PLAT-012).
- **Upstash Redis (Commercial)** – Serverless Redis backing caching, rate limiting, and locks (ADR-006, `docs/runbooks/cache-invalidation.md`). Implementation tracked in `tasks/backlog/platform/plat-015-upstash-platform.md` (TSK-PLAT-015).
- **Amazon RDS Postgres (Commercial)** – Dedicated database for Listmonk workloads.
- **AWS ECS Fargate / S3** – Container runtime and asset storage for auxiliary services.

### Search & discovery
- **Meilisearch Cloud (Commercial / open core)** – Managed full-text search for articles, tools, and ebooks (ADR-009, `docs/runbooks/search-operations.md`). Implementation tracked in `tasks/backlog/platform/plat-016-meilisearch-service.md` (TSK-PLAT-016).

### Analytics, observability & quality
- **PostHog Cloud EU (MIT managed)** – Product analytics, funnels, and experimentation (ADR-008, `docs/runbooks/analytics-qa.md`).
- **OpenTelemetry (Apache 2.0)** – Unified tracing and metrics instrumentation exported to Grafana stack.
- **Grafana OSS Stack (AGPL/Apache mix)** – Loki, Tempo, Prometheus dashboards for reliability KPIs. Implementation tracked in `tasks/backlog/platform/plat-017-grafana-observability-stack.md` (TSK-PLAT-017).
- **Vitest + Testing Library (MIT)** – Unit and component testing harness.
- **Playwright (Apache 2.0)** – Cross-browser E2E automation for primary funnels.
- **Lighthouse CI (Apache 2.0)** – Performance regression checks within CI pipelines.

### Payments & revenue operations
- **Stripe (Commercial)** – Global card payments, subscriptions, and taxes (ADR-011, `docs/runbooks/payments-operations.md`).
- **PayU (Commercial)** – Polish local payment methods including BLIK (ADR-011).
- **Przelewy24 (Commercial)** – Redundant pay-by-link and Google Pay flows (ADR-011).

### Deployment & infrastructure automation
- **Vercel (Commercial)** – Primary hosting platform for the Next.js application.
- **Terraform (MPL 2.0)** – Infrastructure as code for AWS, Upstash, and Listmonk resources.
- **GitHub Actions (MIT)** – CI/CD automation enforcing lint, type-check, and validation steps.

## Maintenance expectations
- Track security advisories monthly; patch high-severity issues within two weeks.
- Keep runbooks (`docs/runbooks/*.md`) aligned with tooling changes before shipping.
- Update license inventory and vendor contacts in `compliance/open-source-report.csv` once established.
- Review this catalog during quarterly architecture reviews to confirm ownership and redundancy plans.
