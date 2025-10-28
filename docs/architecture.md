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

## Supabase schema v0 (TSK-BE-001)

- **Personas (`personas`)** — canonical list of Clarivum personas with UUID v7 primary keys, human-friendly `key`, optional `sort_order`, and audit fields. Unique key plus indexes on `key`/`sort_order` keep taxonomy joins fast.
- **Profiles (`profiles`)** — member/prospect records with hashed email (`email_hash` using `pgcrypto`), optional Auth0 binding, persona affinity, locale/timezone, and pending-claim fields (`pending_claim_token`, `last_claim_email_sent_at`). Unique indexes cover `email`, `(auth_provider, auth_user_id)`, and `pending_claim_token`, while additional indexes on `status`, `persona_id`, and `email_hash` back Ops Hub lookup, account-claim flows, and analytics joins.
- **Leads (`leads`)** — marketing submissions with UTM metadata, optional links to `profiles`/`personas`, hashed emails, and JSONB payloads for campaign specifics. Indexes on hashed identifiers, persona, source, profile, and `created_at` support funnel dashboards and deduplication; a partial unique index on `(email, source)` prevents accidental duplicates per entry point.
- **Content references (`content_items`)** — Strapi-backed content surfaces the Next.js App Router depends on. Each row stores `external_id`, `slug`, persona, publish status, locale, feature-flag key, and metadata describing slots. Unique + coverage indexes on `external_id`, `slug`, persona, status, and `published_at` serve homepage view models with predictable latency.
- **Entitlements (`entitlements`, `entitlement_status_history`)** — durable product access rows with feature/plan keys, lifecycle timestamps, source references, and arbitrary metadata for downstream orchestration. Indexes on profile, status, feature, start/end dates, and external reference keep shelf hydration (<10 ms) and webhook idempotency guardrails intact; history rows store transitions for Sisu root-cause notes and support playback.
- **Guardrails & triggers** — Migration `20251027090000_core_schema.sql` installs `pg_uuidv7`, `pgcrypto`, `citext`, plus trigger `set_audit_fields()` so audit columns stay consistent across tables (revision increments, `updated_at` refresh). See ADR-036 for full index catalogue and future extension follow-ups (RLS, Ops Hub audit schema).

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

## App Router information architecture (TSK-FE-002)

The Clarivum web app now mirrors the Skin/Fuel/Habits sitemap described in `docs/PRDs/first_configuration.md`. Key highlights:

- **Route groups**: marketing experiences live under `src/app/(marketing)` (home, ebooks, narzedzia, blog). Verticalized flows use dynamic segments in `src/app/[vertical]/[category]/[slug]` so we can add categories without new folders.
- **Shared shell + DI**: `src/app/_vertical-experience/{manager,coordinator,view,viewmodel}` exposes `ContentLibrary`, coordinators, and typed ViewModels. Route files construct a coordinator per request, resolve params, and pass serializable models into view components.
- **Placeholders that match ASCII designs**: The new home + hub pages render TODO callouts referencing `docs/PRDs/requierments/ascii_designs.md` so design/content owners know exactly where to inject final copy.
- **Homepage funnel (TSK-FE-005)**: Implementation paused. The previous hero wizard, plan summary, UV consent widget, and newsletter banner have been removed with the `_home` modules. The root route now serves a placeholder from `src/app/page.tsx` until the refreshed experience is rebuilt. Preserve DI + instrumentation patterns from ADR-029 when reintroducing the funnel.
- **Sitemaps, robots, RSS**: `/sitemap.xml`, `/sitemaps/{skin,fuel,habits}.xml`, `/sitemaps/pages.xml`, `/robots.txt`, and `/rss` are generated via route handlers under `src/app/sitemap*.{ts,tsx}`. Update them alongside `observability/config.ts` whenever telemetry domains change.
- **Redirect guardrails**: `next.config.ts` encodes the legacy `/blog` URL migrations described in ADR-019 so search traffic lands on the new dynamic routes.

Extension points:

- Swap `ContentLibrary` inputs (currently static map) with Strapi/Supabase loaders once `TSK-SHARED-003` and `TSK-FE-006` ship. The coordinator/manager boundary lets tests inject doubles.
- Add package-level `AGENTS.md` entries whenever new route groups/components appear so future agents know which commands/tests to run.
- Align homepage metadata work with `docs/runbooks/seo-homepage-metadata-kickoff.md` as soon as SEO utilities start integrating the wizard.
- Update the sitemap helpers whenever we introduce new hubs (ebooks, tools, ops) so Flow/SEO metrics stay accurate.

## Responsive experience standards (ADR-037)

- **Breakpoints:** Adhere to tokens `xs` (320 px) through `2xl` (1536 px) defined in Tailwind config. Components must render mobile-first layouts, progressively enhancing for `md` and `lg` viewports.
- **Fluid scales:** Typography and spacing use `clamp()` ramps sourced from design tokens, ensuring resize text compliance. Avoid hard-coded pixel values; rely on utilities or CSS custom properties.
- **Images:** Implement responsive images with `srcset`/`sizes` (or Next `<Image>` with `deviceSizes`) so browsers select optimal assets per viewport, per 10up responsive guidelines.
- **CSS structure:** Nest media queries next to component styles or leverage container queries; forbid scattered breakpoint partials. Linting will flag raw, non-token media queries.
- **Testing:** Storybook stories must declare `viewport` parameters; Playwright and Lighthouse run at `xs`, `md`, `lg` in CI. Visual regression tooling will extend to these breakpoints in follow-up work.
