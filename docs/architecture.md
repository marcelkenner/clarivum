# Clarivum Architecture Overview

This document captures the current system context and high-level architecture decisions for the Clarivum platform before production development begins. It mirrors the C4 model at the System and Container levels and should evolve alongside the ADR set.

## System context (C4 Level 1)

| Actor / System              | Interaction with Clarivum                                                                         |
|-----------------------------|----------------------------------------------------------------------------------------------------|
| Public visitors             | Consume marketing, education, and funnel experiences delivered via the Clarivum web application. |
| Logged-in members           | Access gated assets (ebooks, tools) and manage preferences via secure sessions.                   |
| Content & marketing editors | Curate content, upload assets, and trigger publishing workflows through the Strapi admin console. |
| Internal operators          | Triage incidents, manage communications, and execute guardrails via the Clarivum Operations Hub (`/ops`). |
| Third-party services        | Email/SMS providers (for lead magnets), analytics (Plausible Analytics – exclusive), and payment gateway (Stripe) |

Clarivum itself is the branded digital experience that surfaces verticalized content (Skin, Fuel, Habits) and orchestrates lead capture, diagnostics, and educational flows. It must remain compliant with EU privacy rules (Poland-first launch) and meet the SLOs defined in the PTRD.

## Container view (C4 Level 2)

```
┌──────────────────────────────────────────┐
│          Public / Member Clients         │
│ (Browsers, Mobile Web, RSS consumers)    │
└────────────────┬─────────────────────────┘
                 │ HTTPS (Vercel edge + CDN caching)
┌────────────────▼─────────────────────────┐
│        Clarivum Web App (Next.js)         │
│  - App Router (server & client components)│
│  - API Routes for BFF endpoints           │
│  - ISR/SSG for content-heavy pages        │
│  - OTel SDK instrumentation               │
│  - Internal `/ops` module (Clarivum Ops Hub)|
└─────────────┬──────────────┬──────────────┘
              │              │
              │              │ Background job dispatch (idempotent JSON payloads)
              │              ▼
              │        ┌───────────────┐
              │        │ AWS SQS Queue │
              │        └──────┬────────┘
              │               │ Lambda workers (BullMQ-compatible handler)
              │               ▼
              │        ┌───────────────┐
              │        │ AWS Lambda    │
              │        │ (job workers) │
              │        └───────────────┘
              │
              │ Supabase SDKs (SQL + Storage)
              ▼
┌──────────────────────────────────────────┐
│ Supabase Postgres & Storage (eu-central) │
│  - Primary application data (profiles,   │
│    leads, entitlements, mission states)  │
│  - Signed asset delivery + RLS policies  │
└─────────────┬──────────────┬──────────────┘
              │              │
              │              │ CMS content sync
              │              ▼
              │        ┌────────────────────────┐
              │        │ Strapi CMS (AWS ECS)   │
              │        │ - Admin UI behind ALB  │
              │        │ - REST/GraphQL delivery│
              │        │ - Webhooks (ISR, search)│
              │        └──────────────┬─────────┘
              │                       │
              │                       │ Asset storage (signed URLs)
              │                       ▼
              │                ┌─────────────────────┐
              │                │ Amazon S3 (media)   │
              │                └─────────────────────┘
              │
              │ Strapi persistence (SQL)
              ▼
        ┌──────────────────────────────────────────┐
        │ Amazon RDS PostgreSQL 15 (eu-central-1)  │
        │  - CMS content schemas & workflows       │
        │  - Snapshot replication into Supabase    │
        └──────────────────────────────────────────┘
              │
              │ Notification workflows (REST)
              ▼
┌──────────────────────────────────────────┐
│ Novu Notifications (AWS ECS Fargate)     │
│  - Inbox + multi-channel orchestration   │
│  - Node SDK auth via AWS Secrets Manager │
└──────────────────────────────────────────┘

Telemetry pipeline:

```
Next.js + Lambda workers
    └── OpenTelemetry SDK
            └── Grafana Cloud Tempo/Prometheus/Loki (managed observability)
```

Operational tooling:

- **Feature flag service:** Flagsmith SaaS (via SDK in the Next.js app).
- **Analytics platform:** Plausible Analytics (privacy-first SaaS, sole analytics provider; proxied via Vercel per ADR-029).
- **Operations hub:** Internal `/ops` console aggregating Strapi, Listmonk, payments, incidents, and metrics per ADR-031 (`docs/PRDs/requierments/operations-hub/feature-requirements.md`) with deep-link navigation into the authoritative native consoles.
- **CDN & caching:** Vercel’s global edge cache + Upstash Redis (plan) for application-level caching and rate limiting.
- **Secrets management:** Vercel Environments + AWS Secrets Manager (mirrored via Terraform) with rotation policy.
- **Primary data platform:** Supabase Postgres & Storage (ADR-001) provisioned via Terraform with PITR, RLS, and access policies enforced by Supabase Dashboard + GitOps.

## Data flows & responsibilities

1. **Content delivery:** Editors work in Strapi; content persists in RDS and media in S3. Next.js fetches structured copy via Strapi REST/GraphQL APIs, stores derived references in Supabase, hydrates ISR pages, and caches responses. Frequently-read queries must have appropriate Strapi API pagination and caching headers; database indices tracked via Terraform modules.
2. **Lead capture & entitlements:** Web forms post to `/api/leads`. The BFF persists leads, entitlements, and mission progress directly in Supabase Postgres, enqueues enrichment via SQS, and hands off to Lambda workers that push to the CRM and email providers.
3. **Background processing:** Lambda handlers implement idempotent jobs (content snapshotting, email fulfillment, sitemap regeneration) that read/write Supabase and invoke Strapi webhooks as needed. Dead-letter queues capture poison messages; retries use exponential backoff capped at 15 minutes.
4. **Notification delivery:** ViewModels invoke `NotificationManager`, which renders Sonner toasts locally, reads subscriber preferences from Supabase, and triggers Novu workflows for inbox/email/SMS delivery. Novu stores channel receipts for audit.
5. **Operations hub aggregation:** Internal `/ops` modules consume Supabase, Strapi, Listmonk, Grafana, Stripe/PayU/P24, and GitHub APIs via server-side proxy handlers, presenting consolidated dashboards and controlled actions. All operator activity is logged to the Supabase `ops_audit` table.
6. **Observability:** All HTTP handlers and workers emit traces, metrics, and logs via OTel exporters. Golden signals (latency, error rate, saturation, traffic) feed SLO dashboards surfaced both in Grafana and the Operations Hub overview. Alerts route to the #clarivum-oncall channel.
7. **Security & privacy:** Supabase Row Level Security protects member data; policies enforce tenant isolation across profiles, diagnostics, and entitlements. MFA is mandatory for admin accounts through Auth0 (see ADR-002); Operations Hub RBAC builds on the same roles. PII stored at rest uses Postgres column-level AES-GCM encryption via pgcrypto; Strapi data snapshots replicate into Supabase following ADR-010 controls.

## Deployment topology

- **Environments:** `dev` (shared testing), `prod` (customer-facing). Vercel preview deployments continue to spin up per pull request for isolated QA.
- **Hosting:** Vercel handles web build/deploy with GitHub Actions orchestrating linting, tests, and SLO guardrails before promotion. Strapi and Novu run on AWS ECS Fargate with Terraform-managed services; Lambda jobs are deployed via Terraform-driven GitHub Actions workflows.
- **Release model:** Trunk-based development with feature flags and automated smoke tests. Rollbacks prefer redeploying the last known good build rather than hotfix branches (documented in the deployment runbook).

## Alignment with non-functional requirements

- **Availability:** Vercel + Strapi ECS + Novu ECS (two AZs) + Supabase provide regional redundancy; combined design supports the 99.9% uptime objective. Lambda workers run across at least two AZs.
- **Performance:** CDN caching, ISR, Strapi response tuning, Novu workflow SLAs, and Redis-backed edge caching keep p95 HTML responses below 300 ms for Poland. API surfaces have explicit budgets (p99 < 800 ms).
- **Reliability:** RPO ≤ 15 minutes via RDS and Supabase point-in-time recovery; RTO ≤ 2 hours with automated restore scripts tested quarterly.
- **Security:** Auth0 + RBAC, secrets management, and CIS IG1 controls are codified in `docs/policies/security-baseline.md`.
- **Cost:** Budgets and alerts are configured through AWS Budgets and Vercel spend caps; the FinOps runbook defines actions when hitting 50/75/90% of monthly spend.

Revisit this document whenever an ADR is added or an architectural component changes. For diagrams beyond ASCII, store source files (e.g., Structurizr DSL) alongside this doc.
