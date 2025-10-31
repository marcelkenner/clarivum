# Feature Requirements — Aurora Data Platform (PostgreSQL & S3 Storage)

> **Canonical decisions:** `docs/adr/ADR-001-primary-cloud-and-database.md` designates Aurora PostgreSQL and S3 as the authoritative data and asset stores. See `docs/adr/ADR-023-account-center.md`, `docs/adr/ADR-024-ebooks-and-digital-products.md`, and `docs/runbooks/aurora-operations.md` for domain integrations and operational guardrails.

## Objective
- Deliver a reliable application data backbone using Amazon Aurora PostgreSQL Serverless v2 for relational workloads and Amazon S3 for asset storage (ebooks, media, exports).
- Provide secure, low-latency access patterns for Next.js routes, background services, and internal tooling while honoring EU residency and GDPR obligations.

## Target Outcomes
- Business: ensure transactional integrity for purchases, subscriptions, personalization, and compliance-driven records.
- Experience: guarantee p95 query latency ≤ 50 ms for primary routes, secure signed delivery for assets, and consistent data availability during scaling events.

## Primary Users & Segments
- Internal: platform/feature teams, analytics, content ops needing governed data access.
- External: customers indirectly through performant APIs, durable personalization, and reliable assets.
- Segmentation: anonymous vs authenticated members, staff roles, entitlement tiers, vertical tagging for discovery.

## Experience Principles
- Model domains with clear boundaries (profiles, diagnostics, purchases, subscriptions, content metadata) to prevent coupling and simplify guardrails.
- Enforce row-level security policies for every table exposed to multi-tenant contexts; default-deny and document authorized roles.
- Automate schema evolution via versioned migrations, rollbacks, and zero-downtime choreography (create → backfill → swap).
- Treat S3 buckets as private by default; expose assets through CloudFront signed URLs or presigned downloads only.

## Functional Requirements
- FR1 — Define normalized Aurora schemas covering profiles, diagnostics, purchases, subscriptions, coupons, and personalization metadata with documented entity ownership.
- FR2 — Implement RLS policies, roles, and views aligned to Auth0/NextAuth session claims and service principals (public, member, subscriber, staff, automation).
- FR3 — Provide curated views/functions for hot paths (ebook listings, entitlement checks, coupon availability) with execution plans captured in the data contract appendix.
- FR4 — Provision S3 asset buckets with lifecycle policies, encryption, and CDN guidance for ebooks, media, and exports; document naming, retention, and access semantics.
- FR5 — Publish connection pooling, retry, and failover strategies for app services (e.g., RDS Proxy roadmap) to maintain throughput under load.
- FR6 — Establish backup, PITR, and restore processes per `docs/runbooks/aurora-operations.md`, including quarterly drill expectations and success criteria.
- FR7 — Emit monitoring signals (pg_stat_statements, replication lag, storage growth, slow query alerts) integrated with Grafana and incident runbooks.

## Content & Data Inputs
- Structured content metadata from Strapi (`docs/PRDs/requierments/strapi/feature-requirements.md`); maintain sync views and change-data capture notes.
- Auth claims from Auth0 via NextAuth for row-level authorization; document mapping between JWT claims and Aurora roles.
- Analytics events aggregated for warehousing (Plausible exports) stored in Aurora/S3 per retention policies.

## Integrations & Dependencies
- Internal: Next.js API routes, background jobs, Operations Hub, analytics ETL, billing systems, feature flag services.
- External: AWS infrastructure (Aurora, S3, Secrets Manager), Terraform modules under `infra/app-data`, observability stack (Grafana, OpenTelemetry).

## Analytics & KPIs
- Track query latency, connection usage, scaling events, storage growth, and backup success.
- Measure RLS coverage (no table without policy) and migration failure rate; include in `metrics/quality.json`.
- Monitor S3 lifecycle effectiveness (transition/expiration counts) to ensure retention budgets hold.

## Non-Functional Requirements
- Availability SLO 99.9%; design for graceful degradation (read replicas, cached reads) if Aurora enters failover.
- Enforce TLS connections, minimum TLS 1.2, and IAM authentication roadmap for privileged access.
- Support serverless scaling without cold-start regressions by pre-warming capacity before major launches.

## Compliance & Access Control
- Restrict privileged AWS IAM roles; require MFA for console access and audit via CloudTrail.
- Maintain GDPR-aligned retention/deletion workflows (30-day SLA) and record outcomes in `docs/runbooks/secrets-management.md` and `docs/runbooks/aurora-operations.md`.
- Log DDL changes, migrations, and manual data fixes in `sisu-log/` guardrail notes.

## Launch Readiness Checklist
- Schema v1 reviewed with product, analytics, and platform teams; documented in `docs/runbooks/aurora-operations.md`.
- Automated tests cover RLS policies, migration application, and rollback paths; guardrails wired into CI (`npm run test`, `npm run validate`).
- Backup/restore drill executed with documented RPO/RTO results; sign-off recorded in the runbook.
- Secrets Manager entries populated and referenced by application workloads; manual connection tests recorded.

## Open Questions & Assumptions
- Determine long-term warehousing strategy (Aurora read replicas vs dedicated analytics store); track decision in a follow-up ADR.
- Evaluate adoption timeline for RDS Proxy or PgBouncer once concurrent connections exceed 50.
- Define event streaming requirements (Kinesis / EventBridge) if real-time change feeds become necessary; backlog task when needed.
