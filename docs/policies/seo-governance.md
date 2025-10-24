# SEO Governance Policy

This policy ensures Clarivum ships and maintains SEO best practices through codified requirements, architecture guardrails, and operational rituals. It complements the Work Intake Policy and binds `docs/PRDs/seo-foundation.md`, ADR-034, and `docs/runbooks/seo-operations.md`.

## 1. Scope

- Applies to all user-facing routes rendered by Next.js (marketing, editorial, tools, account surfaces) and supporting CMS workflows.
- Covers metadata, structured data, sitemaps/robots, Core Web Vitals performance, and search telemetry.
- Includes collaboration between Frontend Platform, Content Operations, SEO Lead, and Analytics/Data.

## 2. Principles

1. **Automation first:** default metadata, schema, and indexation rules live in code, not manual checklists.
2. **Guardrails over heroics:** CI, Playwright, and monitoring enforce SEO contracts; incidents trigger new guardrails within 48 hours.
3. **Traceable decisions:** every SEO-impacting change references governing PRD/ADR/task entries, keeping history auditable.
4. **Performance equals discoverability:** Core Web Vitals budgets are part of Definition of Done for any public route.

## 3. Controls & requirements

### 3.1 Architecture & code

- Implement and maintain shared SEO utilities defined in ADR-034 (metadata factory, structured data modules, sitemap automation).
- `npm run validate` must execute SEO linting (metadata completeness, schema validation, broken link checks) on every PR touching `src/app/**` or `src/lib/seo/**`.
- All templates flagged as indexable must render canonical, hreflang (if localized), OpenGraph, and Twitter cards; missing fields block merges.

### 3.2 Content & publishing

- Content teams must complete the SEO brief template and publishing checklist before requesting review; runbook sign-off required.
- Previews must be reviewed by SEO Lead or delegate for canonical/structured data accuracy prior to release.
- Updates to Strapi schemas must include SEO field coverage and validation rules.

### 3.3 Monitoring & metrics

- Search Console ingestion runs nightly; outages >24h require incident ticket and escalation per runbook.
- `metrics/flow.json` and `metrics/quality.json` store organic KPIs and Core Web Vitals; deviations >10% from baseline demand Kaizen guardrail tasks.
- Quarterly audits (Forest Day) review sitemap coverage, robots.txt rules, performance budgets, and policy relevance.

## 4. Compliance & enforcement

- Governance reviewers verify PRD/ADR/task linking plus checklist completion during PR reviews.
- CI status checks for SEO lint/test suites are mandatory before merge; disabling requires Platform + SEO Lead approval and must be time-boxed with follow-up task.
- Violations (e.g., missing canonical, failing schema validation, skipped preview review) are logged in `sisu-log/` with guardrail tasks created within 48h.

## 5. Documentation & change control

- PRD/ADR revisions impacting SEO must update this policy and the runbook in the same PR.
- Policy must remain under 300 lines; supersede via versioned policy if scope changes materially.
- Track revisions in task changelog entries (Definitions of Done) and note owning teams.

## 6. Review cadence

- Revalidate policy effectiveness quarterly during Forest Day review.
- During seasonal planning (see `docs/playbooks/metsa-cadence.md`), ensure upcoming work respects policy guardrails.
- Publish summary of audit findings in `#clarivum-dev` and annotate policy if interpretations change.
