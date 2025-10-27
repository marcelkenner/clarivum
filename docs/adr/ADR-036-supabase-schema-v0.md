# ADR-036: Supabase Schema v0
Date: 2025-10-27
Status: Accepted

## Context
- Sprint 02 requires a durable data backbone so homepage view models, App Router content loaders, and the Operations Hub can ship against stable IDs (`TSK-FE-005`, `TSK-PLAT-038`).
- Product scope in `docs/PRDs/requierments/supabase-platform/feature-requirements.md` and PTRD §4 lock personas, leads, and entitlements as the first-class relational core; hashed identifiers are mandatory for analytics (ADR-029) and GDPR compliance.
- Sisu Debugging and Ops Hub telemetry (ADR-031, `docs/runbooks/account-claiming.md`) expect canonical tables for profiles with pending-claim flows, entitlement status history, and audit trails.
- No prior migrations existed in `database/migrations/`, so we needed to establish extensions, naming conventions (plural snake_case, UUID v7), audit columns, and seed data before dependent teams begin integration work.

## Decision
- Ship migration `20251027090000_core_schema.sql` that enables `pgcrypto`, `pg_uuidv7`, and `citext`, then creates opinionated enums and audit triggers:
  - Enums: `profile_status`, `entitlement_status`, `content_kind`, `content_publish_status`.
  - Trigger `set_audit_fields()` standardises `created_*`, `updated_*`, and `revision` handling across tables.
- Model core tables aligned with DoR/DoD agreements:
  - `personas` — UUID v7 PKs, unique `key`, optional `sort_order`.
  - `profiles` — hashed email (`email_hash`), pending-claim fields (`pending_claim_token`, `last_claim_email_sent_at`), optional persona link, marketing opt-in, locale/timezone.
  - `leads` — hashed email, UTM surfaces, optional `profile_id/persona_id`, JSONB metadata for campaign payloads.
  - `content_items` — Strapi `external_id`, slug, persona association, publishing state, feature flag hook for selective exposure.
  - `entitlements` — feature/plan keys, lifecycle timestamps, source reference, metadata, plus supporting `entitlement_status_history`.
- Add guardrail indexes for primary query paths (documented below) and uniqueness constraints where required:
  - `profiles_email_unique`, `profiles_pending_claim_token_unique`, `leads_email_source_unique`, `content_items_slug_unique`, `entitlements_active_unique`, `entitlements_external_reference_unique`.
  - Coverage indexes on hashed identifiers, persona relations, lifecycle timestamps, and status columns keep JOIN + WHERE + ORDER BY workloads under ms-scale latency.
- Seed fixtures (`database/seeds/20251027_core_seed.sql`) inserting the three launch personas, a demo profile, homepage content placeholders, a marketing lead, and a starter entitlement + history row—idempotent via `ON CONFLICT`.
- Document the expand / migrate / contract expectations in a dedicated runbook (`docs/runbooks/zero-downtime-migrations.md`) and refresh `docs/architecture.md` with schema + index rationale.

### Index strategy (canonical queries)
| Query family | Tables + columns | Index rationale |
| --- | --- | --- |
| Account lookup (`GET /api/profile`, Ops Hub search) | `profiles.email`, `profiles.auth_provider + auth_user_id`, `profiles.pending_claim_token` | Unique + partial indexes guarantee sub-millisecond lookup for account claiming and support tooling. |
| Homepage & vertical loaders | `content_items.slug`, `content_items.persona_id`, `content_items.status`, `content_items.published_at` | Composite coverage ensures hero/section queries filter by persona & status quickly and sort by publish date. |
| Lead attribution analytics | `leads.email_hash`, `leads.persona_id`, `leads.source`, `leads.created_at` | Hash + time indexes optimise deduping, funnel cohorts, and dashboard rollups without exposing raw PII. |
| Entitlement shelf + guardrails | `entitlements.profile_id`, `entitlements.status`, `entitlements.feature_key`, `entitlements.ends_at`, `entitlements.external_reference` | Supports account shelf hydration, claim resolution, expirations, and webhook idempotency checks. |
| Incident/audit playback | `entitlement_status_history.entitlement_id`, `entitlement_status_history.created_at` | Keeps timeline reconstruction efficient for Sisu debugging and support interventions. |

## Diagrams
- [Architecture Overview](../diagrams/adr-036-supabase-schema-v0/architecture-overview.mmd) — Next.js API routes, Operations Hub, Strapi, and external systems interacting with Supabase Schema v0 tables.
- [Data Lineage](../diagrams/adr-036-supabase-schema-v0/data-lineage.mmd) — Persona ↔ profile ↔ lead ↔ content ↔ entitlement relationships including hashed identifier strategy.
- [UML Components](../diagrams/adr-036-supabase-schema-v0/uml-components.mmd) — Shared audit trigger plus table dependencies (foreign keys, generated columns).
- [BPMN Migration Flow](../diagrams/adr-036-supabase-schema-v0/bpmn-migration.mmd) — Expand → migrate → contract guardrails for zero-downtime deployments.
- [Migration Sequence](../diagrams/adr-036-supabase-schema-v0/migration-sequence.mmd) — Developer, Supabase CLI, and Postgres interactions during local resets and staged deploys.
- [Primary Data Lineage](../diagrams/adr-001-primary-cloud-and-database/data-lineage.mmd) — Update this shared diagram when schema v0 evolves so downstream ADRs (Ops Hub, analytics) remain consistent.

## Consequences
- **Benefits:** Establishes a single source of truth for customer context, unlocks homepage/App Router integrations, and gives Ops Hub an auditable schema to build upon. Indexes prevent early hot-path regressions, and audit triggers cut repetition in future migrations.
- **Trade-offs:** Additional enums and triggers require coordination when future migrations touch audit fields; contributors must test migrations locally to ensure `pg_uuidv7` and `citext` remain available in Supabase environments.
- **Follow-ups:** 
  - Extend schema with Ops Hub `ops_audit` logging, mission progress, and background job tables as forthcoming tasks land.
  - Wire RLS policies + role mappings (pending `TSK-PLAT-041` workflow).
  - Sync Strapi content ingestion jobs to populate `content_items` automatically; current entries are placeholders for development only.
