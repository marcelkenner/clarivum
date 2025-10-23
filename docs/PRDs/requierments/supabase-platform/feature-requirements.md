# Feature Requirements — Supabase Platform (Postgres & Storage)

> **Canonical decisions:** `docs/adr/ADR-001-primary-cloud-and-database.md` defines the Supabase tenancy; see also `docs/adr/ADR-023-account-center.md` and `docs/adr/ADR-024-ebooks-and-digital-products.md` for domain-specific integrations.

## Objective
- Deliver a reliable data backbone using Supabase Postgres 16 and Storage to persist Clarivum’s structured content, user profiles, entitlements, and assets.
- Provide secure, low-latency access patterns for Next.js, Strapi integrations, and future services while honoring GDPR residency requirements.

## Target Outcomes
- Business: ensure transactional integrity for purchases, subscriptions, and personalization signals.
- Experience: guarantee p95 query latency ≤ 50 ms for primary routes and seamless asset delivery via signed URLs.

## Primary Users & Segments
- Internal: engineering teams, analytics, content ops relying on consistent data.
- External: customers indirectly via fast-loading, personalized experiences.
- Segmentation: anonymous vs authenticated users, subscriber entitlements, vertical tagging for content discovery.

## Experience Principles
- Use relational modeling with clear boundaries (users, content, entitlements, events) to avoid coupling.
- Apply row-level security policies for every table exposed to client contexts.
- Automate schema evolution through version-controlled migrations; no ad-hoc console edits.

## Functional Requirements
- FR1 — Define normalized schema covering profiles, diagnostic results, purchases, subscriptions, coupons, and content metadata references.
- FR2 — Implement Row Level Security policies aligned with auth role claims (public, member, subscriber, admin).
- FR3 — Provide database functions or views optimized for common read patterns (e.g., ebook listings by vertical, coupon availability).
- FR4 — Configure Supabase Storage buckets for ebooks and media assets with lifecycle rules and signed URL distribution.
- FR5 — Enable real-time change streams for features that need live updates (optional backlog) while defaulting to polling to avoid overuse.
- FR6 — Set up automated backups, PITR, and retention policies documented in `docs/runbooks/supabase-operations.md`.
- FR7 — Establish monitoring (pg_stat_statements, connection pooling, slow query alerts) integrated with Grafana.

## Content & Data Inputs
- Structured content IDs from Strapi; maintain sync tables or references.
- Auth claims from Auth0 via NextAuth for mapping to database roles.
- Analytics events aggregated for warehousing (Plausible Analytics API export into Supabase or external storage).

## Integrations & Dependencies
- Internal: Next.js API routes, background jobs, Strapi webhooks, analytics ETL, subscription billing system.
- External: Supabase managed service (EU region), Terraform for infrastructure automation.

## Analytics & KPIs
- Monitor query latency, connection usage, cache hit rates, storage growth, and backup success.
- Track RLS policy coverage (no table without policy) and migration success rates.

## Non-Functional Requirements
- Availability SLO 99.9%; design for graceful degradation if Supabase outage occurs (read-only fallbacks).
- Queries must use prepared statements via Supabase client or PostgreSQL driver; avoid dynamic SQL injection risks.
- Keep migration batches deployable with zero downtime (create column → backfill → swap).

## Compliance & Access Control
- Restrict privileged roles; require MFA for Supabase dashboard access.
- Maintain data retention policies (delete personal data on request within 30 days).
- Log administrative actions and schema changes for audit.

## Launch Readiness Checklist
- Schema v1 reviewed and approved across product, analytics, and engineering.
- RLS policies tested with integration tests; unauthorized access attempts rejected.
- Backup/restore drill completed per `docs/runbooks/supabase-operations.md` with documented RPO/RTO.
- Supabase client libraries configured with service/access roles and rotation policy.

## Open Questions & Assumptions
- Need to determine preference between Drizzle ORM vs Supabase SQL migrations; placeholder uses SQL migration scripts.
- Decide on warehousing strategy (Supabase vs external BigQuery) for long-term analytics storage.
- Assume Supabase Edge Functions may be leveraged later for webhooks; evaluate when required.
