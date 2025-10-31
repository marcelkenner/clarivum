# docs/PRDs/requierments/aurora-data-platform · AGENTS Guide

## Scope
- Governs Aurora PostgreSQL schema, RLS design, performance budgets, and S3 asset storage requirements.
- Supports data needs for profiles, diagnostics, purchases, subscriptions, coupons, personalization, and cross-service integrations.

## Must Read
- `feature-requirements.md`, `docs/runbooks/aurora-operations.md`, `docs/runbooks/deployment.md`, `docs/runbooks/secrets-management.md`, plus relevant domain PRDs (profile, diagnostics, subscriptions).
- Pull AWS/Terraform documentation via Context7 (`/hashicorp/terraform-provider-aws`, `/aws_amazon`) when specifying infrastructure changes or database features.

## Execution Guardrails
- Keep migrations version-controlled with forward/backward plans and zero-downtime sequencing.
- Enforce RLS and privilege boundaries; document service accounts, API consumers, and justification for elevated roles.
- Capture latency budgets, scaling expectations, and monitoring hooks; align with observability ADRs.
- Document retention, deletion, and audit workflows aligned with GDPR and track sign-off in the runbook.

## Handoff Checklist
- Validate migrations and RLS policies in the dev environment; attach test artefacts and restore-drill notes.
- Update data contracts and TypeScript interfaces consumed by frontend or services when schema changes ship.
- Notify analytics/reporting owners if exports, warehouse syncs, or KPIs are impacted.
