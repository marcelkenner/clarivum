# SEO Operations Runbook

This runbook aligns with `docs/PRDs/seo-foundation.md`, ADR-034, and the governance policy (`docs/policies/seo-governance.md`). It codifies rituals, guardrails, and escalation paths that keep Clarivum's SEO surface fast, indexable, and trustworthy.

## 1. Roles & responsibilities

- **SEO Lead (Marketing/Growth):** owns keyword strategy, monitors Search Console, requests schema updates, and drives backlog prioritization.
- **Frontend Platform Team:** maintains metadata/structured data libraries, CI guardrails, sitemap automation, and Core Web Vitals performance.
- **Content Operations:** follows publishing checklist, supplies SEO brief inputs, validates previews, and coordinates medical/legal reviews.
- **Analytics & Data:** ensures telemetry pipelines populate `metrics/flow.json` and `metrics/quality.json`, and surfaces anomalies in weekly review.

## 2. Operating cadence

### Daily

- Review Search Console coverage and performance alerts; file issues tagged `type:guardrail` if new errors surface.
- Check latest `metrics/quality.json` snapshot for Core Web Vitals regressions (>10% vs baseline for LCP/INP/CLS) and raise TSK-level tasks when thresholds breached.
- Validate previous day's deployments: confirm sitemap delta published, run `npm run validate` locally on representative branch if CI indicated flakiness.

### Weekly (Kaizen Minute integration)

- Rotate through key templates (homepage, pillar hub, blog article, tool) and run the SEO smoke checklist:
  - Structured data passes Google Rich Results test.
  - Canonical, hreflang, and OpenGraph fields match expectations.
  - Loading performance stays within p75 Core Web Vitals budgets on mobile throttling.
- Update internal linking map partials (if new content published) and ensure tasks reflect guardrail work.
- Summarize findings in `#kaizen-minute`, linking to relevant tasks and Sisu notes if incidents occurred.

### Monthly (Forest Day)

- Run full-site crawl (Screaming Frog or equivalent) and archive report in shared drive; record highlights in `docs/playbooks/kaizen-minute.md` scoreboard.
- Audit robots.txt, sitemap indexes, and canonical rules for new route types.
- Refresh SEO policy controls (section 4) and confirm documentation accuracy; open ADR updates if architectural changes required.

## 3. Release readiness checklist

Before shipping SEO-impacting changes (`src/app/**`, metadata libraries, CMS schema updates):

1. `npm run validate` passes (lint + typecheck + metadata guardrails).
2. Playwright smoke suite covers canonical templates (`npm run test:e2e:smoke`).
3. Preview environment reviewed by SEO Lead (titles, descriptions, schema markup, canonical).
4. Sitemaps regenerated in staging and validated via Search Console inspection tool.
5. Change log captured in tasks entry with context links to PRD, ADR, and policy.

## 4. Incident response (Sisu Debugging tie-in)

- Label organic traffic drops or indexation failures as `type:bug`; follow Sisu Debugging flow (`docs/runbooks/sisu-debugging.md`).
- Within 48h add a guardrail (test, linter, monitoring) tied to the incident -- document in `sisu-log/YYYY-MM-DD-<slug>.md` and update this runbook if pattern recurs.
- Example guardrails: schema regression tests, link checker expansions, fallback metadata defaults.

## 5. Tooling & integrations

- **Search Console API:** nightly ingestion job writes coverage metrics (impressions, clicks, CTR, average position) to `metrics/flow.json`; alert if API fails >24h.
- **Web Vitals library (`web-vitals`):** capture LCP/INP/CLS/TTFB in browser and ship to Plausible custom events; threshold breaches trigger Kaizen guardrail tasks.
- **Broken link monitor:** part of CI; manual rerun via `npm run validate -- --only broken-links` (script to be added during implementation).
- **Schema validator:** Ajv-based tests under `src/lib/seo/__tests__/schema.spec.ts`; update snapshots when Google releases guideline changes.

## 6. Knowledge sharing & training

- Host quarterly 30-minute refreshers covering algorithm updates, tooling changes, and guardrail outcomes; record and store in shared knowledge base.
- Maintain playbook examples in `docs/playbooks/kaizen-minute.md` for quick reference (<60m guardrails) and cross-link tasks showing impact.

## 7. Escalation & contact matrix

| Incident type | Primary | Secondary | Notes |
| --- | --- | --- | --- |
| Sitemap/robots failure | Frontend Platform On-call | SEO Lead | Toggle emergency robots patch, revert via Vercel deployment if needed |
| Structured data regression | Frontend Platform | Content Ops | Roll back release, add failing test, coordinate schema update |
| Core Web Vitals regression | Analytics & Data | Frontend Platform | Validate CDN/cache behavior, consider feature flag rollout |
| Manual action / security warning | SEO Lead | Security Champion | Escalate to incident-response per `docs/runbooks/incident-response.md` |

## 8. Document control

- Keep this runbook under 300 lines; revise alongside PRD/ADR when architecture changes.
- All updates must include rationale referencing tasks, PRs, or ADR amendments. Run `npm run lint:docs` (if defined) and `npm run validate` before merging.
