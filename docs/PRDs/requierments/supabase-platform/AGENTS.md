# docs/PRDs/requierments/supabase-platform · AGENTS Guide

## Scope
- Covers Supabase Postgres + Storage requirements: schema design, RLS, performance budgets, and backup strategy.
- Supports data needs for profiles, diagnostics, purchases, subscriptions, coupons, and personalization.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/profile/feature-requirements.md`, `docs/PRDs/requierments/diagnostics/feature-requirements.md`, `docs/PRDs/requierments/subscriptions/feature-requirements.md`.
- Pull Supabase/Postgres documentation via Context7 when defining migrations, RLS policies, or storage rules.

## Execution Guardrails
- Keep schemas version-controlled with migration plans, rollbacks, and zero-downtime sequencing documented.
- Enforce RLS policies for every table; note client vs service role access and justify exceptions.
- Capture performance budgets (latency, connection pooling) and monitoring hooks; align with observability PRD.
- Document data residency, retention, and backup requirements; coordinate with legal on GDPR commitments.

## Handoff Checklist
- Validate migrations in staging, including RLS tests and restore drills; attach results or logs.
- Update data contracts shared with frontend/services when schema or API views change.
- Notify analytics and reporting owners if schema updates alter exports or warehousing pipelines.
