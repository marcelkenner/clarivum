# Clarivum Engineering Roadmap (2025–2026)

> Cadence anchors: Metsa seasons (Winter debt, Spring design, Summer build, Autumn stabilize) and the daily Kaizen/guardrail rhythm. Review and refresh this document at each quarterly planning checkpoint; update task metadata when sequencing shifts.

## Nov–Dec 2025 · Foundation Launch Window
> **Sprints:** [Sprint 01](../../tasks/sprints/sprint-01/plan.md) (2025-11-03 → 2025-11-14), [Sprint 02](../../tasks/sprints/sprint-02/plan.md) (2025-11-17 → 2025-11-28), [Sprint 03](../../tasks/sprints/sprint-03/plan.md) (2025-12-01 → 2025-12-12)
- **Platform:** Launch the Strapi backbone — infrastructure, data, CI/CD (`TSK-PLAT-020`, `TSK-PLAT-021`, `TSK-PLAT-022`) plus Supabase tenancy (`TSK-PLAT-012`); lock SEO guardrail + Web Vitals ingestion (`TSK-PLAT-050`, `TSK-PLAT-051`); finish UV service + CMS copy to unblock January guardrails (`TSK-PLAT-019`, `TSK-PLAT-047`).
- **Frontend:** Stand up Storybook and component coverage baselines (`TSK-FE-004`, `TSK-FE-019`); deliver App Router loaders and global navigation data (`TSK-FE-021`, `TSK-FE-022`); align trust page ASCII layouts and Lighthouse guardrails (`TSK-FE-014`, `TSK-FE-015`).
- **Shared:** Close intake prerequisites (`TSK-SHARED-001`, `TSK-SHARED-002`, `TSK-SHARED-005`, `TSK-SHARED-007`, `TSK-SHARED-008`); execute Strapi rollout playbook and SEO governance launch (`TSK-SHARED-003`, `TSK-SEO-002`).
- **QA:** Secure environments, data, and selectors for upcoming smoke/UV suites (`TSK-QA-001`, `TSK-QA-002`).
- **Reference docs:** ADR-010, ADR-001, ADR-007, ADR-036, ADR-034, ADR-037, ADR-038; PRDs `docs/PRDs/requierments/strapi/feature-requirements.md`, `docs/PRDs/requierments/strapi/setup.md`, `docs/PRDs/requierments/supabase-platform/feature-requirements.md`, `docs/PRDs/requierments/frontend-platform/feature-requirements.md`; runbooks `docs/runbooks/deployment.md`, `docs/runbooks/secrets-management.md`, `docs/runbooks/seo-operations.md`.

## Jan 2026 (Winter) · Guardrails & Observability
> **Sprints:** [Sprint 04](../../tasks/sprints/sprint-04/plan.md) (2026-01-06 → 2026-01-17), [Sprint 05](../../tasks/sprints/sprint-05/plan.md) (2026-01-20 → 2026-01-31)
- **Platform:** Harden UV caching + analytics and feature-flag platform (`TSK-PLAT-015`, `TSK-PLAT-048`, `TSK-PLAT-049`, `TSK-PLAT-014`), complete service + copy delivery (`TSK-PLAT-019`, `TSK-PLAT-047`); roll out security & bug guardrails (`TSK-PLAT-028`, `TSK-PLAT-035`); keep fulfillment protections tracking (`TSK-PLAT-042`); stand up observability + metrics baselines (`TSK-PLAT-017`, `TSK-PLAT-040`, `TSK-PLAT-037`).
- **Frontend:** Ship UV widget hero experience and shared form engine foundations (`TSK-FE-010`, `TSK-FE-009`); add interaction smoke coverage (`TSK-FE-020`).
- **QA:** Execute Playwright smoke and UV validation suites with analytics + accessibility checks (`TSK-QA-001`, `TSK-QA-002`).
- **Reference docs:** ADR-005, ADR-006, ADR-004, ADR-020, ADR-028, ADR-030; PRDs `docs/PRDs/requierments/feature-flags/feature-requirements.md`, `docs/PRDs/requierments/observability/feature-requirements.md`; runbooks `docs/runbooks/feature-flags-operations.md`, `docs/runbooks/observability-operations.md`, `docs/runbooks/incident-response.md`, `docs/runbooks/background-jobs.md`.

## Feb 2026 · Notifications & Privacy
> **Sprints:** [Sprint 06](../../tasks/sprints/sprint-06/plan.md) (2026-02-03 → 2026-02-14), [Sprint 07](../../tasks/sprints/sprint-07/plan.md) (2026-02-17 → 2026-02-28)
- **Platform:** Configure Auth0 tenancy (`TSK-PLAT-013`); provision Novu infrastructure and governance (`TSK-PLAT-023`, `TSK-PLAT-024`); validate trial reminders (`TSK-PLAT-026`); automate Klaro consent enforcement (`TSK-PLAT-025`).
- **Frontend:** Implement authenticated experiences and notification delivery (`TSK-FE-008`, `TSK-FE-011`).
- **Shared:** Deliver legal/compliance surfaces and newsletter lifecycle workflows (`TSK-SHARED-006`, `TSK-SHARED-004`).
- **Reference docs:** ADR-002, ADR-012, ADR-013, ADR-014; PRDs `docs/PRDs/requierments/login/feature-requirements.md`, `docs/PRDs/requierments/newsletter/feature-requirements.md`; runbooks `docs/runbooks/notifications.md`, `docs/runbooks/mailing-operations.md`, `docs/runbooks/cookie-consent-operations.md`, `docs/runbooks/communication-channel-selection.md`.

## Mar 2026 · Payments & Trials Hardening
> **Sprints:** [Sprint 08](../../tasks/sprints/sprint-08/plan.md) (2026-03-03 → 2026-03-14), [Sprint 09](../../tasks/sprints/sprint-09/plan.md) (2026-03-17 → 2026-03-28)
- **Platform:** Finalize subscription orchestrator and payment guardrails (`TSK-PLAT-006`, `TSK-PLAT-030`, `TSK-PLAT-031`, `TSK-PLAT-032`, `TSK-PLAT-033`).
- **Frontend:** Align payment UI flows with wallet rollouts; continue preparing tool platform specs (`TSK-FE-006` discovery).
- **Shared:** Coordinate finance/support readiness for wallet launches (continues `TSK-SHARED-004`, `TSK-SHARED-006` follow-through).
- **Reference docs:** ADR-011, ADR-032, ADR-024, ADR-026; PRDs `docs/PRDs/requierments/subscriptions/feature-requirements.md`, `docs/PRDs/requierments/ebooks/feature-requirements.md`, `docs/PRDs/requierments/tools/skin/widget_indeks_uv.md`; runbooks `docs/runbooks/payments-operations.md`, `docs/runbooks/ebooks-fulfillment.md`, `docs/runbooks/account-claiming.md`, `docs/runbooks/zero-downtime-migrations.md`.

## Apr–May 2026 (Spring) · Search, Analytics, Ops Foundations
> **Sprints:** [Sprint 10](../../tasks/sprints/sprint-10/plan.md) (2026-03-31 → 2026-04-11), [Sprint 11](../../tasks/sprints/sprint-11/plan.md) (2026-04-14 → 2026-04-25), [Sprint 12](../../tasks/sprints/sprint-12/plan.md) (2026-04-28 → 2026-05-09), [Sprint 13](../../tasks/sprints/sprint-13/plan.md) (2026-05-12 → 2026-05-23)
- **Platform:** Deliver search and recommendations stack (`TSK-PLAT-016`, `TSK-PLAT-005`, `TSK-PLAT-009`); build account & Ops Hub pillars (`TSK-PLAT-007`, `TSK-PLAT-038`, `TSK-PLAT-039`).
- **Frontend:** Roll out tools/calculators platform and blueprints (`TSK-FE-006`, `TSK-FE-012`, `TSK-FE-013`); ship Ops Hub interface and diagnostics experiences (`TSK-FE-016`, `TSK-FE-007`); launch vertical UIs across Skin/Fuel/Habits (`TSK-FE-023`, `TSK-FE-024`, `TSK-FE-025`).
- **Shared:** Keep glossary/content ops aligned with new surfaces (wrap remaining actions from `TSK-SHARED-005`, `TSK-SHARED-007`).
- **QA:** Plan ebook fulfillment guardrail automation ahead of June go-live (`TSK-QA-003` prep).
- **Reference docs:** ADR-009, ADR-008, ADR-021, ADR-022, ADR-023, ADR-031, ADR-033; PRDs `docs/PRDs/requierments/operations-hub/feature-requirements.md`, `docs/PRDs/requierments/tools/skin/feature-requirements.md`, `docs/PRDs/requierments/tools/habits/planer_drzemek.md`, `docs/PRDs/requierments/analytics/feature-requirements.md`; runbooks `docs/runbooks/ops-hub.md`, `docs/runbooks/search-operations.md`, `docs/runbooks/tools-platform-operations.md`, `docs/runbooks/analytics-qa.md`.

## Jun 2026 · Digital Products Enablement
> **Sprints:** [Sprint 14](../../tasks/sprints/sprint-14/plan.md) (2026-05-26 → 2026-06-06), [Sprint 15](../../tasks/sprints/sprint-15/plan.md) (2026-06-09 → 2026-06-20)
- **Platform:** Chain ebook initiatives — generation pipeline, watermarking, delivery, guest claim workflow (`TSK-PLAT-018`, `TSK-PLAT-027`, `TSK-PLAT-008`, `TSK-PLAT-041`) while keeping orchestrator guardrails current (`TSK-PLAT-042`).
- **Frontend:** Ship entitlement shelf and related UI flows (`TSK-FE-017`) and connect tool platform outputs to new content surfaces (`TSK-FE-006` follow-through).
- **QA:** Deploy fulfillment reliability guardrails and synthetic monitors (`TSK-QA-003`).
- **Reference docs:** ADR-024, ADR-032, ADR-033; PRDs `docs/PRDs/requierments/ebooks/feature-requirements.md`, `docs/PRDs/requierments/tools/skin/tools_ascii_designs/widget_indeks_uv.md`; runbooks `docs/runbooks/ebooks-fulfillment.md`, `docs/runbooks/background-jobs.md`, `docs/runbooks/analytics-qa.md`.

## Jul–Aug 2026 (Summer) · Monetization Systems
> **Sprints:** [Sprint 16](../../tasks/sprints/sprint-16/plan.md) (2026-06-23 → 2026-07-04), [Sprint 17](../../tasks/sprints/sprint-17/plan.md) (2026-07-07 → 2026-07-18), [Sprint 18](../../tasks/sprints/sprint-18/plan.md) (2026-07-21 → 2026-08-01), [Sprint 19](../../tasks/sprints/sprint-19/plan.md) (2026-08-04 → 2026-08-15), [Sprint 20](../../tasks/sprints/sprint-20/plan.md) (2026-08-18 → 2026-08-29)
- **Platform:** Implement affiliate catalog, monetization telemetry, and coupon platform enhancements (`TSK-PLAT-046`, `TSK-PLAT-043`, `TSK-PLAT-010`).
- **Frontend:** Integrate monetization SDKs and surface affiliate experiences across UI (`TSK-FE-018`).
- **Shared:** Stand up affiliate operations workflow and partner governance (`TSK-SHARED-010`).
- **QA:** Extend automation from `TSK-QA-001/003` to cover monetization funnels (follow-on checklist).
- **Reference docs:** ADR-026, ADR-033, ADR-035; PRDs `docs/PRDs/requierments/affiliate/feature-requirements.md`, `docs/PRDs/requierments/coupons/mission-engineering-scope.md`; runbooks `docs/runbooks/affiliate-ad-ops.md`, `docs/runbooks/analytics-qa.md`, `docs/runbooks/feature-flags-operations.md`.

## Sep 2026 · Platform Reliability & Governance
> **Sprints:** [Sprint 21](../../tasks/sprints/sprint-21/plan.md) (2026-09-01 → 2026-09-12), [Sprint 22](../../tasks/sprints/sprint-22/plan.md) (2026-09-15 → 2026-09-26)
- **Platform:** Land security/compliance baseline, Listmonk infrastructure, Terraform repo, CI/CD quality gates, and automation guardrails (`TSK-PLAT-011`, `TSK-PLAT-029`, `TSK-PLAT-001`, `TSK-PLAT-004`, `TSK-PLAT-034`, `TSK-PLAT-036`).
- **Frontend:** Execute hardening passes on component, lighthouse, and interaction guardrails (`TSK-FE-015`, `TSK-FE-019`, `TSK-FE-020` follow-up) while ensuring vertical UIs remain compliant.
- **Shared:** Review policy/compliance playbooks post-implementation (`TSK-SHARED-006` sustainment).
- **QA:** Revalidate smoke/guardrail suites against stabilized infrastructure (extensions to `TSK-QA-001` and `TSK-QA-003`).
- **Reference docs:** ADR-028, ADR-016, ADR-030, ADR-001, ADR-004; PRDs `docs/PRDs/requierments/security/feature-requirements.md`, `docs/PRDs/requierments/storybook/feature-requirements.md`; runbooks `docs/runbooks/security-baseline.md`, `docs/runbooks/deployment.md`, `docs/runbooks/testing-stack.md`, `docs/runbooks/cache-invalidation.md`, `docs/runbooks/sisu-debugging.md`.

## Oct 2026 (Autumn) · Stabilize & Plan Next Cycle
> **Sprints:** [Sprint 23](../../tasks/sprints/sprint-23/plan.md) (2026-09-29 → 2026-10-10), [Sprint 24](../../tasks/sprints/sprint-24/plan.md) (2026-10-13 → 2026-10-24)
- Consolidate Ops Hub observability learnings, retire stale flags, and log retrospectives ahead of 2027 planning (`TSK-PLAT-040`, `TSK-PLAT-036`, Kaizen backlog updates).
- Update this roadmap after Autumn review and archive completed milestones in `tasks/status-summary.md`.
- **Reference docs:** ADR-031, ADR-005, ADR-004; PRDs `docs/PRDs/first_steps.md`, `docs/PRDs/requierments/operations-hub/feature-requirements.md`; runbooks `docs/runbooks/ops-hub.md`, `docs/runbooks/observability-operations.md`, `docs/runbooks/feature-flags-operations.md`, `docs/runbooks/cost-review.md`.

---

### Dependency Highlights
- Strapi rollout (`TSK-PLAT-020/021/022`) and Supabase tenancy (`TSK-PLAT-012`) enable shared content tasks (`TSK-SHARED-003`, `TSK-FE-021/022`, `TSK-FE-023/024/025`).
- Auth0/Flagsmith foundations (`TSK-PLAT-013`, `TSK-PLAT-014`) precede security-sensitive frontend work (`TSK-FE-008`, `TSK-PLAT-028`).
- Subscription orchestration + fulfillment guardrails (`TSK-PLAT-006`, `TSK-PLAT-042`) must land before wallets, ebooks, and monetization flows (`TSK-PLAT-031/032/033`, `TSK-PLAT-008`, `TSK-PLAT-043`, `TSK-FE-018`, `TSK-QA-003`).
- Observability (`TSK-PLAT-017`, `TSK-PLAT-040`, `TSK-PLAT-037`) underpins later guardrails, payments, and monetization analytics.

### Review Cadence
- **Quarterly:** Align with seasonal Metsa checkpoints; adjust sequencing after retrospectives.
- **Monthly:** Sync with Forest Day automation (`TSK-PLAT-036`) to retire achieved milestones and pull next guardrails forward.
- **Weekly:** Kaizen Minute issues surface blockers early; update this roadmap when scope or sequencing changes materially.
