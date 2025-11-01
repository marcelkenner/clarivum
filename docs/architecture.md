# Clarivum Architecture Overview

This document captures the current system context and high-level architecture decisions for the Clarivum platform before production development begins. It mirrors the C4 model at the System and Container levels and should evolve alongside the ADR set.

## System context (C4 Level 1)

| Actor / System              | Interaction with Clarivum                                                                         |
|-----------------------------|----------------------------------------------------------------------------------------------------|
| Public visitors             | Consume marketing, education, and funnel experiences delivered via the Clarivum web application. |
| Logged-in members           | Access gated assets (ebooks, tools) and manage preferences via secure sessions.                   |
| Content & marketing editors | Curate content, upload assets, and trigger publishing workflows through the Lightsail-hosted WordPress admin. |
| Internal operators          | Triage incidents, manage communications, and execute guardrails via the Clarivum Operations Hub (`/ops`). |
| Third-party services        | Email/SMS providers (for lead magnets), analytics (Plausible Analytics – exclusive), and payment gateway (Stripe) |

Clarivum itself is the branded digital experience that surfaces verticalized content (Skin, Fuel, Habits) and orchestrates lead capture, diagnostics, and educational flows. It must remain compliant with EU privacy rules (Poland-first launch) and meet the SLOs defined in the PTRD.

## Container view (C4 Level 2)

```
┌──────────────────────────────────────────┐
│          Public / Member Clients         │
│ (Browsers, Mobile Web, RSS consumers)    │
└────────────────┬─────────────────────────┘
                 │ HTTPS (AWS CloudFront + CDN caching)
┌────────────────▼─────────────────────────┐
│        CloudFront Edge Tier              │
│  - TLS termination & caching             │
│  - Routes `/static` to S3 (OAC)          │
│  - Routes `/api` to API Gateway          │
└─────────────┬──────────────┬──────────────┘
              │              │
              │ Static assets│ API requests
              │              │
              ▼              ▼
┌─────────────────────────────┐     ┌──────────────────────────┐
│ Amazon S3 (Static Assets)   │     │ API Gateway HTTP API      │
│  - ISR/SSG pages            │     │  - Lambda (Graviton) BFF  │
│  - Immutable media          │     │  - REST/RPC integrations  │
└─────────────┬──────────────┘     └──────────────┬────────────┘
              │                                    │
              │                                    │ Lambda invocations
              │                                    ▼
              │                           ┌──────────────────────────┐
              │                           │ Lambda Application Tier  │
              │                           │  - Request orchestration │
              │                           │  - OTel instrumentation  │
              │                           │  - Async triggers        │
              │                           └─────────────┬────────────┘
              │                                         │
              │                                         │ Data access
              │                                         ▼
              │                            ┌──────────────────────────┐
              │                            │ Amazon DynamoDB          │
              │                            │ (On-Demand)              │
              │                            │  - Sessions, KV, cache   │
              │                            └─────────────┬────────────┘
              │                                          │
              │                                          │ Relational storage
              │                                          ▼
              │                            ┌────────────────────────────────┐
              │                            │ Amazon Aurora PostgreSQL       │
              │                            │ (Serverless v2)                │
              │                            │  - Core relational data        │
              │                            │  - RLS, PITR, audit extensions │
              │                            └─────────────┬──────────────────┘
              │                                          │
              │                                          │ Editorial sync
              │                                          ▼
              │                             ┌─────────────────────────┐
              │                             │ Lightsail CMS           │
              │                             │ (WordPress)             │
              │                             │  - Editorial workflows  │
              │                             └──────────────┬──────────┘
              │                                            │
              │                                            │ Asset storage + CDN origin
              │                                            ▼
              │                                  ┌─────────────────────┐
              │                                  │ Amazon S3 (Media)   │
              │                                  │ - Versioned buckets │
              │                                  │ - CloudFront origin │
              │                                  └─────────────────────┘

Telemetry pipeline:

```
Next.js + Lambda workers
    └── OpenTelemetry SDK
            └── Grafana Cloud Tempo/Prometheus/Loki (managed observability)
```

Operational tooling:

- **Feature flag service:** Flagsmith SaaS (via SDK in the Next.js app).
- **Analytics platform:** Plausible Analytics (privacy-first SaaS, sole analytics provider; proxied via CloudFront + Lambda@Edge per ADR-029 migration).
- **Operations hub:** Internal `/ops` console aggregating Lightsail WordPress, Listmonk, payments, incidents, and metrics per ADR-031 (`docs/PRDs/requierments/operations-hub/feature-requirements.md`) with deep-link navigation into the authoritative native consoles.
- **CDN & caching:** AWS CloudFront (global edge) + AWS ElastiCache Serverless for Redis (direct TLS connection today; Cache Gateway pending for edge contexts per ADR-006) for application-level caching and rate limiting.
- **Secrets management:** AWS Secrets Manager (primary) with Parameter Store mirrors, all managed via Terraform rotation policies.
- **Primary data platform:** Amazon Aurora PostgreSQL (Serverless v2) with S3-backed media buckets, provisioned via Terraform with PITR, row-level security, and Secrets Manager rotation.

## Data flows & responsibilities

1. **Content delivery:** Editors manage marketing pages in the Lightsail WordPress tenancy; approved content replicates to Aurora (dedicated schema) for personalization and to S3 for ISR/SSG generation. Lambda fetches structured copy via WordPress REST endpoints, hydrates ISR pages, and caches responses behind CloudFront with immutable asset headers.
2. **Lead capture & entitlements:** Web forms post to `/api/leads`. The Lambda BFF persists leads, entitlements, and mission progress in Aurora (relational) and DynamoDB (session/state), then emits enrichment events via EventBridge to downstream processors responsible for messaging and analytics enrichment.
3. **Background processing:** EventBridge-scheduled Lambda functions perform idempotent jobs (content snapshotting, email fulfillment, sitemap regeneration, Lightsail-to-Aurora sync). Failures route to EventBridge DLQs with exponential backoff capped at 15 minutes.
4. **Notification delivery:** ViewModels invoke `NotificationManager`, which renders Sonner toasts locally, consults preferences in DynamoDB/Aurora, and triggers SES or Pinpoint campaigns for transactional and marketing sends. Delivery outcomes persist for audit and surface in `/ops`.
5. **Operations hub aggregation:** Internal `/ops` modules consume Aurora, Lightsail WordPress, Listmonk, Grafana, Stripe/PayU/P24, and GitHub APIs via server-side proxy handlers, presenting consolidated dashboards and controlled actions. All operator activity is logged to the Aurora `ops_audit` schema.
6. **Observability:** All HTTP handlers and workers emit traces, metrics, and logs via OTel exporters. Golden signals (latency, error rate, saturation, traffic) feed SLO dashboards surfaced both in Grafana and the Operations Hub overview. Alerts route to the #clarivum-oncall channel.
7. **Security & privacy:** Aurora PostgreSQL row-level security protects member data; policies enforce tenant isolation across profiles, diagnostics, and entitlements. MFA is mandatory for admin accounts through Auth0 (see ADR-002); Operations Hub RBAC builds on the same roles. PII stored at rest uses Postgres column-level AES-GCM encryption via pgcrypto; WordPress content snapshots replicate into Aurora following ADR-010 controls.

## Aurora schema v0 (TSK-BE-001)

- **Personas (`personas`)** — canonical list of Clarivum personas with UUID v7 primary keys, human-friendly `key`, optional `sort_order`, and audit fields. Unique key plus indexes on `key`/`sort_order` keep taxonomy joins fast.
- **Profiles (`profiles`)** — member/prospect records with hashed email (`email_hash` using `pgcrypto`), optional Auth0 binding, persona affinity, locale/timezone, and pending-claim fields (`pending_claim_token`, `last_claim_email_sent_at`). Unique indexes cover `email`, `(auth_provider, auth_user_id)`, and `pending_claim_token`, while additional indexes on `status`, `persona_id`, and `email_hash` back Ops Hub lookup, account-claim flows, and analytics joins.
- **Leads (`leads`)** — marketing submissions with UTM metadata, optional links to `profiles`/`personas`, hashed emails, and JSONB payloads for campaign specifics. Indexes on hashed identifiers, persona, source, profile, and `created_at` support funnel dashboards and deduplication; a partial unique index on `(email, source)` prevents accidental duplicates per entry point.
- **Content references (`content_items`)** — WordPress-backed content surfaces the Next.js App Router depends on. Each row stores `external_id`, `slug`, persona, publish status, locale, feature-flag key, and metadata describing slots. Unique + coverage indexes on `external_id`, `slug`, persona, status, and `published_at` serve homepage view models with predictable latency.
- **Entitlements (`entitlements`, `entitlement_status_history`)** — durable product access rows with feature/plan keys, lifecycle timestamps, source references, and arbitrary metadata for downstream orchestration. Indexes on profile, status, feature, start/end dates, and external reference keep shelf hydration (<10 ms) and webhook idempotency guardrails intact; history rows store transitions for Sisu root-cause notes and support playback.
- **Guardrails & triggers** — Migration `20251027090000_core_schema.sql` installs `pg_uuidv7`, `pgcrypto`, `citext`, plus trigger `set_audit_fields()` so audit columns stay consistent across tables (revision increments, `updated_at` refresh). See ADR-036 for full index catalogue and future extension follow-ups (RLS, Ops Hub audit schema).

## Deployment topology

- **Environments:** `dev` (shared testing) and `prod` (customer-facing). Clarivum intentionally skips a persistent staging tier—use preview builds (per-PR S3/CloudFront artefacts) or the `dev` workspace for rehearsal. When legacy docs mention “staging,” read it as “preview” or “dev.”
- **Hosting pipeline:** GitHub Actions builds the Next.js app, exports static assets to the S3 static bucket, packages Lambda handlers (esbuild + AWS SAM/SST bundle), and applies Terraform to roll out API Gateway/Lambda, DynamoDB tables, Aurora updates, and CloudFront invalidations.
- **Lightsail tenancy:** Terraform (or documented console steps) provisions a WordPress bundle with automated snapshots, Secrets Manager integration for admin credentials, and scheduled content-sync Lambdas that replicate canonical data into Aurora.
- **Release model:** Trunk-based development with feature flags and automated smoke tests. Rollbacks redeploy the last known good Lambda/S3 artefacts and issue targeted CloudFront invalidations rather than building hotfix branches.

## Alignment with non-functional requirements

- **Availability:** CloudFront, API Gateway (multi-AZ), Lambda (multi-AZ), DynamoDB (multi-AZ), and Aurora Serverless (multi-AZ) underpin the 99.9% uptime objective. Lightsail workloads rely on nightly snapshots and documented recovery runbooks.
- **Performance:** CDN caching, ISR, WordPress REST response tuning, and Redis-backed edge caching (ElastiCache Serverless + gateway) keep p95 HTML responses below 300 ms for Poland. API surfaces have explicit budgets (p99 < 800 ms) with provisioned concurrency enabled only where needed.
- **Reliability:** RPO ≤ 15 minutes via Aurora point-in-time recovery; RTO ≤ 2 hours with automated restore scripts tested quarterly.
- **Security:** Auth0 + RBAC, secrets management, and CIS IG1 controls are codified in `docs/policies/security-baseline.md`.
- **Cost:** Budgets and alerts flow through AWS Budgets; the FinOps runbook defines actions when hitting 50/75/90% of monthly spend for CloudFront, API Gateway/Lambda, DynamoDB, Aurora ACUs, and Lightsail bundles.

Revisit this document whenever an ADR is added or an architectural component changes. For diagrams beyond ASCII, store source files (e.g., Structurizr DSL) alongside this doc.

### Implementation snapshot · dev (2025‑10‑30)

- **Network:** `vpc-0bfe1a3458c531a72` with public subnets (`subnet-00874c5c298320604`, `subnet-06b12c27a3abe5959`) and private subnets (`subnet-07958bfe0e465d42e`, `subnet-0b4a2e4455725e8ed`), backed by `nat-04f8a56ed66ed4964` and IGW `igw-05e2c2733ae25a93c`.
- **Content delivery:** CloudFront distribution `EPHSANK5PAPBA` (`d29q7vbsl5v19l.cloudfront.net`, alias `dev.clarivum.com`) fronts the static S3 bucket `clarivum-dev-static-869603330574` via OAC `E240OSKJ8C4XHZ`, serves media from `clarivum-dev-media-869603330574`, and routes `api/*` to the HTTP API origin; logs land in `clarivum-dev-cdn-logs-869603330574`.
- **Data plane:** DynamoDB table `platform-dev-kv` (TTL enabled) and Aurora PostgreSQL Serverless v2 cluster `platform-dev-aurora` (`platform-dev-aurora.cluster-c3ss2q66m8yw.eu-central-1.rds.amazonaws.com` / reader endpoint `...-ro-...`), secrets stored under `clarivum/platform/dev/database/*`.
- **API tier:** Lambda `platform-dev-core` (python3.12) runs inside the private subnets with API Gateway HTTP API `j0cjdyuqti` (`https://j0cjdyuqti.execute-api.eu-central-1.amazonaws.com`) publishing the public interface and fronted by CloudFront for `api/*` traffic.
- **Secrets & rotation:** AWS Serverless Application Repository stack `clarivum-platform-dev-database-master-rotation` deploys rotation Lambda `clarivum-platform-dev-database-master-fn` (VPC-enabled) that rotates `clarivum/platform/dev/database/master` every 30 days; Terraform wires the function output ARN into the Secrets Manager rotation schedule.
- **Scope guardrail:** Legacy Strapi deployment on ECS remains authoritative for CMS; no Lightsail workload was provisioned, keeping ADR‑010 intact.

> Update accompanying diagrams in `docs/diagrams/adr-001-primary-cloud-and-database/*` to reflect the identifiers above before the next architecture review.

### Implementation snapshot · prod (2025‑11‑01)

- **Network:** `vpc-063a9bf56877fa0f5` with public subnets (`subnet-03285e4e893d6b4cc`, `subnet-0123b36571ff1b2f2`) and private subnets (`subnet-05749cf7d39e9ea78`, `subnet-0dc83583337c45c03`), NAT gateway `nat-0fe3cabf9729dcbb9` (EIP `eipalloc-0891d8e572812125b`), IGW `igw-0a8cf4e757209969d`.
- **Content delivery:** CloudFront distribution `E35IWLJESBE865` (`d1bayoxw2levkx.cloudfront.net`, aliases `clarivum.com` & `www.clarivum.com`) fronts `clarivum-prod-static-869603330574` via OAC `E3BRSF38SOUVH9`, serves media from `clarivum-prod-media-869603330574`, and logs to `clarivum-prod-cdn-logs-869603330574` (ObjectWriter ownership).
- **Data plane:** DynamoDB `platform-prod-kv` and ElastiCache Serverless cache `platform-prod-cache` (Valkey 7, TLS). Aurora prod cluster pending provisioning; prod tfvars reference placeholder endpoints until the cluster lands.
- **API tier:** Lambda `platform-prod-core` (Node.js 20) invoked through API Gateway `jv77gs7dec`; CloudFront routes `api/*` to the HTTP API origin.
- **Secrets & rotation:** Secrets stored under `clarivum/platform/prod/database/*` rotated by `clarivum-platform-prod-database-master-fn` (Serverless App Repo stack `serverlessrepo-clarivum-platform-prod-database-master-rotation`).

> Update diagrams in `docs/diagrams/adr-006-edge-cache-and-rate-limiting-platform/*` to include the prod cache identifiers when refreshing visuals.

## App Router information architecture (TSK-FE-002)

The Clarivum web app now mirrors the Skin/Fuel/Habits sitemap described in `docs/PRDs/first_configuration.md`. Key highlights:

- **Route groups**: marketing experiences live under `src/app/(marketing)` (home, ebooks, narzedzia, blog). Verticalized flows use dynamic segments in `src/app/[vertical]/[category]/[slug]` so we can add categories without new folders.
- **Shared shell + DI**: `src/app/_vertical-experience/{manager,coordinator,view,viewmodel}` exposes `ContentLibrary`, coordinators, and typed ViewModels. Route files construct a coordinator per request, resolve params, and pass serializable models into view components.
- **Placeholders that match ASCII designs**: The new home + hub pages render TODO callouts referencing `docs/PRDs/requierments/ascii_designs.md` so design/content owners know exactly where to inject final copy.
- **Homepage funnel (TSK-FE-005)**: Implementation paused. The previous hero wizard, plan summary, UV consent widget, and newsletter banner have been removed with the `_home` modules. The root route now serves a placeholder from `src/app/page.tsx` until the refreshed experience is rebuilt. Preserve DI + instrumentation patterns from ADR-029 when reintroducing the funnel.
- **Sitemaps, robots, RSS**: `/sitemap.xml`, `/sitemaps/{skin,fuel,habits}.xml`, `/sitemaps/pages.xml`, `/robots.txt`, and `/rss` are generated via route handlers under `src/app/sitemap*.{ts,tsx}`. Update them alongside `observability/config.ts` whenever telemetry domains change.
- **Redirect guardrails**: `next.config.ts` encodes the legacy `/blog` URL migrations described in ADR-019 so search traffic lands on the new dynamic routes.

Extension points:

- Swap `ContentLibrary` inputs (currently static map) with WordPress/Aurora loaders once `TSK-SHARED-003` and `TSK-FE-006` ship. The coordinator/manager boundary lets tests inject doubles.
- Add package-level `AGENTS.md` entries whenever new route groups/components appear so future agents know which commands/tests to run.
- Align homepage metadata work with `docs/runbooks/seo-homepage-metadata-kickoff.md` as soon as SEO utilities start integrating the wizard.
- Update the sitemap helpers whenever we introduce new hubs (ebooks, tools, ops) so Flow/SEO metrics stay accurate.

## Responsive experience standards (ADR-037)

- **Breakpoints:** Adhere to tokens `xs` (320 px) through `2xl` (1536 px) defined in Tailwind config. Components must render mobile-first layouts, progressively enhancing for `md` and `lg` viewports.
- **Fluid scales:** Typography and spacing use `clamp()` ramps sourced from design tokens, ensuring resize text compliance. Avoid hard-coded pixel values; rely on utilities or CSS custom properties.
- **Images:** Implement responsive images with `srcset`/`sizes` (or Next `<Image>` with `deviceSizes`) so browsers select optimal assets per viewport, per 10up responsive guidelines.
- **CSS structure:** Nest media queries next to component styles or leverage container queries; forbid scattered breakpoint partials. Linting will flag raw, non-token media queries.
- **Testing:** Storybook stories must declare `viewport` parameters; Playwright and Lighthouse run at `xs`, `md`, `lg` in CI. Visual regression tooling will extend to these breakpoints in follow-up work.
