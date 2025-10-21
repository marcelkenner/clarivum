# DevOps & Platform Guide

This guide equips the DevOps/Platform crew with the processes, tooling, and guardrails that keep Clarivum stable and fast.

## Key references

- Deployment runbook: `docs/runbooks/deployment.md`
- Incident response: `docs/runbooks/incident-response.md`
- Cost review: `docs/runbooks/cost-review.md`
- Policies: `docs/policies/error-budget-policy.md`, `docs/policies/security-baseline.md`
- ADRs: `ADR-001` (hosting/DB), `ADR-003` (queues/jobs), `ADR-004` (observability), `ADR-005` (feature flags)
- Scripts: `scripts/` (automation, AGENTS guard)

## Daily/weekly cadence

1. **Environment health**
   - Monitor Grafana dashboards for latency, error rate, saturation, and cost signals.
   - Ensure budgets/alerts (AWS Budgets, Vercel spend) are active; adjust thresholds as traffic grows.
2. **CI/CD stewardship**
   - Keep GitHub Actions pipelines green and fast; document any changes in `docs/runbooks/deployment.md`.
   - Verify Flagsmith integration for new flags; add stale-flag checks.
3. **Infrastructure as Code**
   - Manage Terraform modules for Vercel, Supabase, AWS (SQS/Lambda/Secrets Manager).
   - Review IaC PRs with an architectural lens; update ADRs when infrastructure evolves.
4. **Security hygiene**
   - Enforce MFA, key rotations, and secrets management per `security-baseline.md`.
   - Run vulnerability scans monthly; track remediations in the security backlog.
5. **Cost control**
   - Execute the monthly cost review runbook; share highlights with engineering + finance.
   - Right-size resources (Lambda concurrency, Supabase tiers, Vercel bandwidth) proactively.

## Toolchain

- Terraform (with remote state), Supabase CLI, AWS CLI, Vercel CLI.
- OpenTelemetry exporters, Grafana dashboards, PagerDuty for alerts.
- Context7 queries for infrastructure/provider updates (AWS, Vercel, Supabase release notes).
- Repo scripts: `npm run lint:tasks` (validate planning docs), `npm run tasks:summary` (generate status digest), `npm run ensure:agents` (documentation hygiene).

## Asking for help

- Infra blockers → `#clarivum-platform`.
- Cost anomalies → Slack the finance partner and log in the cost review doc.
- Security incidents → page the on-call per incident runbook.
- Missing automation? Open a `[DevOps]` issue, or extend `scripts/` with a new helper and document it in `scripts/AGENTS.md`.
