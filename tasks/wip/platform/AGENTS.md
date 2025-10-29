# tasks/wip/platform · AGENTS Guide

Platform-specific WIP notes live here (infra, tooling, observability). Use this lane when platform work is still being sized or awaits upstream dependencies.

## When to add items
- Upcoming platform initiatives surfaced in the roadmap but missing detailed tasks (e.g., Supabase tenancy rollouts, Strapi backups).
- Guardrails that require investigation prior to opening a backlog ticket.
- Cross-team blockers that need platform input before moving to `ready/platform`.

## Required metadata
- `tags`: include at least `platform` plus one capability tag (`infra`, `observability`, `ci-cd`, etc.) so dashboards group them correctly.
- `links`: point to ADRs (e.g., ADR-010, ADR-038) or runbooks (`docs/runbooks/tools-platform-operations.md`) that drive the work.
- `context7`: seed with libraries you expect to use (`/hashicorp/terraform`, `/supabase/supabase`, `/aws/rds`) to speed up future hand-offs.

## Workflow expectations
- Refresh or archive entries every Kaizen cycle; nothing should stay in WIP longer than two weeks without an update note.
- Promote to `tasks/backlog/platform` with refined Definition of Ready when scope stabilises.
- Run `npm run lint:tasks` before committing changes to catch schema drift.

Follow the general WIP guidance in `tasks/wip/AGENTS.md` and the platform standards captured in `docs/runbooks/secrets-management.md`, `docs/runbooks/supabase-operations.md`, and relevant ADRs.
