# Senior Business/System Analyst Guide

You own Clarivum’s requirements truth. This playbook aggregates every source, artifact, and decision so you can answer “what, why, and how” instantly.

## Mission

- Keep the business narrative, UX flows, and system behaviors in sync.
- Ensure every feature has a Definition of Ready/Done that satisfies product, design, engineering, QA, and compliance.
- Guard the documentation corpus so teams can ship with confidence and zero guesswork.

## Source of truth map

| Need | Primary doc | Secondary references |
|------|-------------|----------------------|
| Brand story, CTAs, funnels | `docs/PRDs/clarivum_brand.md` | `docs/PRDs/blog_structure.md`, `first_configuration.md` |
| Technical readiness & NFRs | `docs/PRDs/first_steps.md` | `docs/architecture.md`, ADR-001…005 |
| Visual system & UI specs | `docs/PRDs/brand_design_system.md` (Section J) | Design Figma boards, `src/app/AGENTS.md` |
| Roles & workflows | `docs/role-guides/` | `AGENTS.md`, `tasks/README.md` |
| Task status & backlog | `tasks/README.md` | Jira/Notion (if mirrored) |
| Operations & policies | `docs/runbooks/`, `docs/policies/` | Incident/cost review notes |

When uncertain, start here. Every document cross-links back to its owners; if information is missing, create an issue tagged `[Docs]` or update the file directly.

## UI/UX guardrails (from design system)

- **Primary actions**: Jade buttons, 10–12 px radius, 14 px vertical padding, min tap target **44×44 px**, focus ring 2 px Jade with 1 px offset (`brand_design_system.md` §J).
- **Nav bar**: 72 px desktop / 56 px mobile height; logo 160 px desktop minimum; active link uses Jade underline.
- **CTA pathways**: Confirm copy/targets in `clarivum_brand.md` (e.g., Skin → “Pobierz rozdział” to flagship ebook). Maintain the hierarchical flows “Home → Pillar Hub → Start → CTA”.
- **Accessibility**: WCAG 2.2 AA minimum (contrast ≥4.5:1, focus visible, keyboard support). Highlight deviations and ensure remediation tasks are in `tasks/README.md`.
- **Content voice**: Align with brand pillars (evidence, craft, harmony, restraint). No medical claims; emphasize literacy and decision support.

## Business logic ownership

- **Lead capture & entitlements**: Documented in PTRD §5–§9 with supporting tasks (`TSK-010`, `TSK-014`, `TSK-015`). Supabase schema design resides in ADR-001 + future ADR addenda.
- **Feature flags & rollout**: ADR-005 defines policy; verify new features list owner, rollout stages, and sunset path.
- **Background processes**: ADR-003 governs SQS/Lambda jobs (lead enrichment, sitemap regeneration). Ensure runbooks cover failure handling.
- **Cost & compliance**: `docs/policies/error-budget-policy.md` and `security-baseline.md`. Confirm business features respect budgets and security controls before launch.

## Daily Analyst loop

1. **Triage inputs**  
- Review task board (`tasks/README.md`) and product/marketing requests.  
- Record new work as TSK tickets with Definition of Ready/Done, linking to PRDs/ADRs.
- Reference `docs/role-guides/planning.md` for slicing guidance when breaking features into tasks.
2. **Clarify requirements**  
   - Facilitate cross-team alignment (design, marketing, engineering).  
   - Update PRDs or runbooks when decisions diverge from existing docs.
3. **Support delivery**  
   - Attend stand-ups or async threads; unblock questions about flows, copy, or measurements.  
   - Validate acceptance criteria against analytics/observability goals (p95/p99, conversion metrics).
4. **Validate completion**  
   - Check merged PRs against business rules, CTAs, and instrumentation.  
   - Move tasks to Done only when documentation, tests, and monitoring are updated.
5. **Continuous improvement**  
   - Note missing assets (e.g., diagrams, checklists) and create follow-up tasks.  
   - Leverage Context7 (Next.js, Supabase, Auth0, Flagsmith) to confirm implementation details before codifying them.

## Definition of Ready checklist

- [ ] User outcome and business value articulated (reference PRD section).  
- [ ] Success metrics / KPIs defined (activation, lead conversions, etc.).  
- [ ] UX specs (button sizes, routes, content) confirmed in design system or sitemap.  
- [ ] Dependencies and integrations (Auth0, Supabase, SQS) mapped to ADRs.  
- [ ] Acceptance criteria and test approach captured in task + QA plan.  
- [ ] Risks or open questions documented with owners.

## Definition of Done checklist

- [ ] Feature flag lifecycle documented (if applicable) with rollout and sunset plan.  
- [ ] CTA destinations, copy, and telemetry verified end-to-end.  
- [ ] Tests/monitoring added (Vitest/Playwright tasks, OTel instrumentation).  
- [ ] Documentation updated (PRDs, runbooks, role guides, tasks).  
- [ ] Stakeholders signed off (product, design, engineering, QA, compliance).  
- [ ] Post-launch measurement plan established (dashboards/alerts).

## Asking for help / escalation

- Product alignment → product lead via `#clarivum-product`.  
- Copy & creative → marketing lead or `#clarivum-design`.  
- Technical gaps → engineering lead; include relevant ADR references.  
- If information is missing from the repo, open a `[Docs]` issue or create a PR with a proposal. The team’s commitment is to keep this project “golden”—no question is too small.

Keep this guide evergreen: after every discovery session or launch, capture updates here so the next analyst inherits a complete knowledge base.
