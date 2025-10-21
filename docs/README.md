# Clarivum Documentation Index

Clarivum’s pre-code documentation gathers all technical, operational, and governance decisions that must be locked before the first production feature ships. Use this index to navigate the repo and understand what is already agreed upon.

- **docs/PRDs/** – Product requirements and discovery artifacts. Start with `PRDs/first_steps.md` (Pre-Project Technical Readiness Document) and `PRDs/clarivum_brand.md` for brand, sitemap, and CTA strategy.
- **docs/architecture.md** – C4-style context and container overview for the Clarivum platform.
- **docs/adr/** – Architecture Decision Records. ADR-001…005 are accepted decisions; `_template.md` is the authoring scaffold for future ADRs.
- **docs/runbooks/** – Step-by-step operational guides (deployment, incident response, FinOps review).
- **docs/policies/** – Error budget policy and security baseline commitments.
- **docs/checklists/** – Pull request checklist aligning with testing and security guardrails from the PTRD.
- **docs/role-guides/** – Discipline-specific handbooks for frontend, backend, architecture, DevOps, and QA teams (start with `role-guides/README.md`).
- **tasks/README.md** – Task board structure with status/discipline lanes and authoring rules.
- **tasks/status-summary.md** – Auto-generated digest of active tasks by status and area (`npm run tasks:summary`).

## How to keep documentation healthy

1. **Review cadence:** Reconfirm ADRs and runbooks during the monthly reliability review (Section 12 of the PTRD). Flag superseded decisions with a follow-up ADR.
2. **Change policy:** Updates to any document in `docs/` require a pull request with at least one reviewer from product and one from engineering.
3. **Source of truth:** If a process or decision differs from what is written here, fix the docs immediately—do not allow drift.

## Snapshot of agreed non-functional targets

| Area          | Target                                                         | Owner / Notes                                   |
|---------------|----------------------------------------------------------------|-------------------------------------------------|
| Availability  | 99.9% monthly uptime (≈43 min error budget)                    | Engineering lead; see error budget policy       |
| Performance   | p95 HTML response < 300 ms, p99 < 800 ms from Poland            | Monitor via Vercel Analytics + RUM              |
| Security      | MFA enforced for elevated accounts; CIS IG1 controls in place  | Security champion; validated each sprint        |
| Data Recovery | RPO ≤ 15 min, RTO ≤ 2 hours                                    | Supabase PITR + DR drills every quarter         |
| Cost          | Cloud spend ≤ $2.5k/month at 10× current traffic               | FinOps review runbook outlines escalation bands |

Keep this table updated as SLOs evolve—it should always reflect the current commitments.
