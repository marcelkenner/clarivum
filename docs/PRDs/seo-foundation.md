> **Canonical decisions:** Implement through `docs/adr/ADR-034-seo-foundation-and-governance.md`, `docs/runbooks/seo-operations.md`, and `docs/policies/seo-governance.md`. Align content workflows with `docs/runbooks/editorial-onboarding.md` and brand voice constraints from `docs/PRDs/clarivum_brand.md`.

---

# SEO Foundation & Governance PRD

> Purpose. Establish a durable SEO operating model that pairs Clarivum's Next.js architecture with content, performance, and analytics guardrails so organic discovery compounds instead of eroding.

---

## 0) Executive summary

- **North-star outcome:** 3x growth in qualified organic sessions within 12 months while holding conversion rate at least 90% of the current baseline.
- **Primary levers:** fast Core Web Vitals (LCP target 3.0 s p75 mobile), structured content with schema.org coverage, opinionated metadata automation, and search insights flowing into content planning.
- **Guardrails:** every user-facing surface ships with indexation intent, canonical rules, and a monitoring hook recorded in `metrics/quality.json`.
- **Launch criteria:** ADR-034 ratified, runbook adopted by growth + engineering, policy accepted by platform governance, and tasks TSK-SEO-001/002 ready for execution.

---

## 1) Outcomes & scope

**1.1 Business & user outcomes**

- Increase qualified organic traffic (non-bounce sessions reaching an engagement event) by 12% quarter-over-quarter, validated in Plausible dashboards per `docs/diagrams/adr-029-plausible-analytics-platform/`.
- Lift article-to-signup conversion rate by 20% via richer search snippets (FAQ/HowTo schema, featured snippet eligibility).
- Reduce manual SEO rework requests by 50% by automating metadata and guardrails in CI.

**1.2 In scope**

- Technical SEO platform capabilities in the Next.js 15 app router (metadata API, dynamic routes, ISR cadence, sitemaps, robots.txt, canonical URLs, hreflang).
- Content governance (SEO brief template, publishing checklist, schema coverage targets) shared with content operations.
- Observability of organic performance (search console ingestion, broken link detection, Core Web Vitals monitoring).

**1.3 Out of scope**

- Paid acquisition or off-site backlink programs (handled by marketing operations).
- Migration of legacy blog assets (tracked separately under existing PRDs).

---

## 2) Users & workflows

- **SEO Lead:** defines keyword strategies, monitors search console alerts, and curates schema patterns.
- **Frontend Platform Team:** implements reusable metadata + structured data primitives, validates during CI (`npm run validate`).
- **Content Editors:** follow runbook checklists, supply brief inputs, and review automated preview diffs before publish.
- **Analytics & Data:** maintain pipelines feeding metrics JSON snapshots, ensuring SEO KPIs surface in flow/quality dashboards.

Each publish workflow: the PRD requires at least 85% of metadata to be auto-generated, editors provide only canonical overrides, and schema fragments come from configuration YAML with guardrail tests blocking missing fields.

---

## 3) Non-functional & measurement targets

- **Core Web Vitals:** LCP <= 3.0 s, INP <= 200 ms, CLS <= 0.1 at p75 mobile across major templates. Track via Web Vitals reports and in `metrics/quality.json`.
- **Index health:** <1% crawl errors/week per sitemap; 0 orphaned pages flagged in monthly crawl; 100% high-priority templates have canonical + hreflang.
- **Structured data coverage:** 90% of eligible templates emit schema.org entities (Article, FAQPage, Product, HowTo) passing Google Rich Results tests.
- **Automation:** 100% of PRs touching `src/app` run metadata/structured-data lint in CI; Playwright smoke suite verifies meta tags for canonical page types.

---

## 4) Requirements

**4.1 Technical primitives**

- Metadata factory using Next.js `generateMetadata` to standardize title, description, canonical, robots, and social props; allow overrides per route.
- Structured data builder generating JSON-LD (Article, BreadcrumbList, FAQ, Product) with validation via Ajv schema tests.
- Automated XML sitemaps segmented by content type with <50k URLs per file, updated via ISR or on-demand revalidation; include `<lastmod>` based on content updates.
- Robots.txt managed from configuration with environment toggles (disallow staging, allow prod).
- 404/410 handling with helpful navigation and search, plus link to site map.

**4.2 Content governance**

- SEO brief template capturing intent, primary/secondary keywords, SERP features, internal linking plan, medical/legal reviewers.
- Publishing checklist requiring runbook sign-off, preview validation, and screenshot diff review for hero + metadata blocks.
- Internal linking map stored in repo (`docs/PRDs/internal-linking.md`, to be created separately) with update cadence.

**4.3 Monitoring & analytics**

- Nightly job pulling Search Console coverage data, writing to `metrics/flow.json` (extend schema) with impressions, clicks, CTR, position.
- Broken link detection (internal + external) integrated into `npm run validate` guardrail.
- Core Web Vitals telemetry via `web-vitals` library shipping to Plausible / first-party endpoint.

**4.4 Compliance & accessibility**

- Ensure metadata/localization interplay meets GDPR/consent requirements (respecting `docs/runbooks/cookie-consent-operations.md`).
- Align language alternate tags with actual localized routes; fallback to default locale otherwise.

---

## 5) Dependencies & staging plan

- Adopt ADR-034 for architecture boundaries and ownership.
- Coordinate with content platform (Strapi) teams to expose SEO fields via API (see `docs/PRDs/requierments/strapi/blog.md`).
- Update CI pipeline (extend `.github/workflows/ci.yml`) once metadata lint suite lands.
- Provide staging environment parity with noindex flags; produce shareable preview links for SEO review.

Roll-out phases:

1. **Foundation (Weeks 1-3):** metadata factory, sitemap automation, robots controls.
2. **Schema & Monitoring (Weeks 4-6):** structured data modules, Search Console ingestion, broken link guardrails.
3. **Governance (Weeks 7-8):** policy ratification, runbook adoption, training session, metrics dashboards live.

---

## 6) Acceptance & guardrails

- [x] Automated tests cover metadata and JSON-LD for hero templates.
- [x] CI fails when canonical or hreflang missing on high-priority routes.
- [x] Sitemaps validated via integration test before deploy.
- [x] SEO operations runbook adds weekly/monthly rituals; policy mandates quarterly audit.
- [x] Tasks TSK-SEO-001 (Platform implementation) and TSK-SEO-002 (Runbook adoption) move to Ready with owners assigned.

---

## 7) Open questions & follow-up work

- Decide on canonical internal linking map format (YAML vs JSON) and location.
- Evaluate need for dedicated SEO dashboard vs extending existing analytics.
- Determine resource owning schema test updates when Google Rich Result requirements change.

---

## 8) References

- [Next.js SEO fundamentals](https://nextjs.org/docs/app/building-your-application/optimizing/metadata?utm_source=chatgpt.com)
- [Google Search Central structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?utm_source=chatgpt.com)
- [Core Web Vitals definitions](https://web.dev/vitals/?utm_source=chatgpt.com)
- [Sitemaps best practices](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?utm_source=chatgpt.com)
