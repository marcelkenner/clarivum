# ADR-001: Primary Cloud & Database Platform
Date: 2025-10-21
Status: Accepted

## Context
- Clarivum’s first release is a content-heavy marketing and education experience built on Next.js App Router.
- We need globally cached delivery for anonymous visitors, plus secure sessions for members and editors.
- The data model comprises structured taxonomies, lead records, and entitlement metadata that must support relational queries, auditing, and row-level security.
- The engineering team is small (≤4 engineers) and must bias toward managed services with EU residency to satisfy GDPR for the Poland-first launch.
- Product requirements tracked in `docs/PRDs/requierments/supabase-platform/feature-requirements.md` and environment bootstrap milestones in `docs/PRDs/first_configuration.md`.

## Decision
- Host the web application on **Vercel** with two persistent environments (`dev`, `prod`) plus ephemeral preview deployments per pull request. Leverage Vercel Edge Network for CDN, incremental static regeneration, and image optimization.
- Use **Supabase Postgres 16** as the primary transactional database (region: `eu-central-1`). Enable `pg_stat_statements`, point-in-time recovery (PITR), and row-level security.
- Store large assets (ebooks, media) in **Supabase Storage** (S3-compatible) with lifecycle rules; serve via signed URLs.
- Manage infrastructure configuration via Terraform modules stored in the `infra/` repository (to be created). Provision the Vercel project, Supabase instance, networking, and secrets through IaC.

## Consequences
- **Upside:** Fast developer feedback loops (Vercel previews), minimal ops burden, and native Postgres capabilities (indexes, RLS, extensions). EU residency is guaranteed through Supabase’s Frankfurt region.
- **Risk:** Vendor concentration (Vercel + Supabase). Mitigate by keeping IaC exportable and documenting migration paths (AWS App Runner + RDS) if cost or compliance drives change.
- **Cost:** Combined baseline spend stays within the $2.5k/month cap at 10× traffic, but we must monitor Vercel bandwidth tiers and Supabase storage growth via the FinOps runbook.
- **Follow-ups:** 
  - Implement connection pooling (pgBouncer) when concurrent requests exceed 50.
  - Conduct quarterly DR drills to validate PITR and documented RPO/RTO targets.
