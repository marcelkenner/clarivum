Below are concise, “good‑default” answers you can adopt and tweak. I’ve stated assumptions up front and embedded owners, artifacts, and guardrails so they’re immediately actionable.

---

## Assumptions (material to decisions)

* **Code & CI**: GitHub + GitHub Actions, Node 20 LTS, PNPM/Yarn/NPM (any), Playwright for E2E, Vitest for unit/integration, Codecov (or similar) optional.
* **Cloud**: AWS with GitHub OIDC, ECR/ECS/Fargate, RDS Postgres, S3, CloudFront, CloudWatch, KMS, Secrets Manager.
* **Web**: Next.js App Router, TypeScript, feature‑module architecture, zod for schema validation.
* **Data**: Supabase Postgres + RLS.
* **SEO**: JSON‑LD via a central metadata factory, Search Console enabled for all environments except dev/previews.

If any of these differ, the answers still hold with minor edits; I call out places where a change would matter.

---

## Sprint 01 – Guardrails Before Growth

### plat-044-testing-ci-integration.md:33 — **CI secrets & OIDC roles**

**Answer:** Yes—use a single AWS IAM role per repo with GitHub OIDC, plus scoped repo secrets.

* **IAM role (minimum policy):** `ecr:BatchCheckLayerAvailability`, `ecr:CompleteLayerUpload`, `ecr:InitiateLayerUpload`, `ecr:PutImage`, `ecr:UploadLayerPart`, `sts:AssumeRole`, optional read to `secretsmanager:GetSecretValue` for runtime tokens. Trust policy restricted to `repo:<org>/<repo>:ref:refs/heads/*`.
* **Repo/Org secrets:**

  * `NPM_TOKEN` (read‑only publish scope if using private registry)
  * `PLAYWRIGHT_BROWSERS_PATH=0` (to cache in Actions)
  * `CODECOV_TOKEN` (if used)
  * `SEARCH_CONSOLE_CLIENT` (later; production only)
  * No cloud long‑lived keys; rely on OIDC.
* **Permissioned `GITHUB_TOKEN`:** set per job: `permissions: { contents: write, checks: write, pull-requests: write, actions: read }`.

**Owner:** DevOps (DRI), with Platform reviewer.
**Artifact:** `infra/iam/github-oidc-role.tf` + runbook: `docs/runbooks/ci-oidc.md`.

---

### plat-044-testing-ci-integration.md:34 — **Vitest + Playwright budgets & parallelisation (for QA sign‑off)**

**Answer (defaults to gate PRs today, tighten later):**

* **Vitest (unit & light integration)**

  * **Wall‑clock budget (PR):** ≤ **8 min** on standard Actions runners.
  * **Shards/workers:** `--maxWorkers=75%` (CI); `testTimeout=10_000ms`, `retry=0`.
  * **Full parallel:** `fullyParallel: true`, fail fast on 5 failures.
* **Playwright (E2E smoke on PR; full on `main` nightly)**

  * **PR smoke budget:** ≤ **12 min** total; **nightly full suite:** ≤ **30 min**.
  * **Sharding:** per‑file, 4–6 workers on PR; 10–12 workers nightly.
  * **Retries:** `retries=2` (CI), `timeout=30_000ms` per test, `expect.timeout=5_000ms`.
  * **Browsers:** Chromium only on PR; all (Chromium/WebKit/Firefox) nightly.
  * **Artifacts:** trace/video on retry only; upload on failure.
* **Caching:** Node + Playwright browsers + Playwright cache keyed by lockfile & `playwright.config.ts` hash.

**Owner:** QA lead (sign‑off), Platform (config).
**Artifact:** `qa/test-budgets.md`.

---

### plat-044-testing-ci-integration.md:35 — **package.json script changes**

**Answer (minimal but complete):**

```json
{
  "scripts": {
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint .",
    "format:check": "prettier -c .",
    "test:unit": "vitest run --coverage",
    "test:unit:watch": "vitest",
    "test:e2e:install": "playwright install --with-deps",
    "test:e2e": "playwright test",
    "test:e2e:smoke": "playwright test -g @smoke",
    "test:ci": "pnpm -r typecheck && pnpm -r lint && pnpm test:unit && pnpm test:e2e:smoke"
  }
}
```

**Owner:** Platform.
**Artifact:** PR to update scripts + `playwright.config.ts` tags for `@smoke`.

---

### plat-044-testing-ci-integration.md:36 — **Draft CI workflow circulation**

**Answer:** Circulate drafts for **`.github/workflows/ci.yml`** and **`sisu-on-bug.yml`** by **Oct 29, 2025 17:00 UTC** for async review in PRs labeled `ci-draft`.
**Owner:** Platform (DRI), QA & DevOps reviewers.
**Artifact:** PRs + `docs/adr/adr-00X-ci-structure.md`.

---

### qa-005-testing-metrics-pipeline.md:31 — **Coverage & flake baselines (initial targets)**

**Answer (start reasonable, ratchet monthly):**

* **Unit coverage (Vitest):** **Lines ≥70%, Branches ≥60%** (repo‑wide), per‑package floor −10% of repo target to avoid one‑file drag.
* **E2E coverage proxy:** **Critical flow smoke pass‑rate ≥99%** (rolling 14 days).
* **Flake rate:** **<2%** (failures that pass on retry / total tests).
* **Quarantine policy:** auto‑quarantine after **3 flaky incidents** in 7 days; owner auto‑assigned.

**Owner:** QA (targets), Platform (enforcement).
**Artifact:** `qa/quality-gates.json`.

---

### qa-005-testing-metrics-pipeline.md:32 — **GitHub token scope for writing metrics artifacts**

**Answer:** Use **`GITHUB_TOKEN`** with **`contents: write`** (commit JSON to `metrics/` on a `metrics` branch) and **`checks: write`** (attach JSON as a check run). Avoid PATs unless cross‑repo writes are required; if needed, use a fine‑grained PAT scoped to `contents: write` on the destination repo only.

**Owner:** Platform.
**Artifact:** `/.github/workflows/metrics.yml`.

---

### qa-005-testing-metrics-pipeline.md:33 — **Ownership of `metrics/` JSON schema**

**Answer:** **QA** owns schema definition & versioning (SemVer), **Platform** is approver, **Product** is consumer. Schema lives at `metrics/schema/vX.Y.Z.json` with zod types generated to `@types/qa-metrics`. Changes follow a PR with a migration note.

**Owner:** QA lead (DRI).
**Artifact:** `docs/schemas/qa-metrics.md`.

---

## Sprint 02 – Experience Foundation

### fe-002-app-router-skeleton.md:32 — **Lock vertical taxonomy, slugs, CTA mapping**

**Answer:** Product/Content to freeze a **taxonomy registry** (YAML/JSON) with:

* **Verticals:** stable IDs + display names.
* **Category slugs:** `kebab-case`, immutable once published; redirects handled via `next.config.js` if ever changed.
* **CTA mapping:** per vertical/category → CTA component ID + UTM model.

**Deadline:** freeze by **Sprint 02, Day 5 (EOD UTC)**.
**Artifact:** `content/taxonomy.v1.json`.
**Owner:** Product Content (DRI), SEO reviewer.

---

### fe-002-app-router-skeleton.md:33 — **Shared layout requirements**

**Answer:**

* **Header:** sticky, 1‑level nav, skip‑to‑content link, search entry.
* **Footer:** legal, sitemap, social, language switcher.
* **Metadata:** site‑wide defaults (title template, OG image fallback, canonical factory), JSON‑LD injection hook.
* **Theme:** system dark/light, prefers‑reduced‑motion respect.
* **Grid/Spacing:** 8‑pt scale, container widths aligned to Content’s typography scale.

**Artifact:** `apps/web/src/app/(site)/layout.tsx` + `ui/layout/`.
**Owner:** Design (spec), Frontend (implementation).

---

### fe-002-app-router-skeleton.md:34 — **TypeScript module partitioning**

**Answer (avoid God objects):**

* **Layers:**

  * `entities/` (pure types/models + zod schemas)
  * `features/<name>/` (UI + state; single responsibility)
  * `services/` (managers: domain logic, IO orchestration)
  * `app/` (routes, thin loaders/coordinators)
  * `shared/` (design system, utils).
* **Rules:** no `services/` → `app/` imports; coordinators are route‑scoped; each feature exposes a **facade** index; enforce via eslint‑module‑boundaries.
* **Naming:** avoid `*Manager` catch‑alls; prefer `CheckoutPricingService`, `UserSessionStore`.

**Artifact:** `docs/adr/adr-00Y-module-boundaries.md`.
**Owner:** Frontend lead.

---

### be-001-supabase-schema-v0.md:30 — **Product data requirements (personas, leads, entitlements)**

**Answer:** Capture minimal v0:

* **Persona** `{ id, key, name, description }`
* **Lead** `{ id, email, persona_id?, utm, source, created_at }`
* **Entitlement** `{ id, user_id, feature_key, plan_key, starts_at, ends_at? }`
* PII policy: emails hashed for analytics; raw emails RLS‑protected.

**Artifact:** `product/schema/requirements.v0.md`.
**Owner:** Product (DRI), Data & Platform reviewers.

---

### be-001-supabase-schema-v0.md:31 — **Latest taxonomy from docs ready for schema?**

**Answer:** Require export to a **machine‑readable JSON** with stable IDs; if `docs/PRDs/clarivum_brand.md` is narrative, add `docs/PRDs/clarivum_brand.taxonomy.json`. Schema work begins only after this export is merged.

**Owner:** Product Content.
**Gate:** PR label `taxonomy-frozen`.

---

### be-001-supabase-schema-v0.md:32 — **Naming, auditing columns, soft delete**

**Answer:**

* **Tables:** plural `snake_case` (e.g., `user_entitlements`).
* **PKs:** `uuid` (v7 where supported).
* **Audit columns:** `created_at timestamptz default now()`, `created_by uuid`, `updated_at timestamptz`, `updated_by uuid`, `revision int default 1`.
* **Soft delete:** `deleted_at timestamptz null`; RLS excludes `deleted_at is not null`.
* **Indexes:** cover FKs + common filters; all FKs `ON DELETE RESTRICT` unless explicitly `CASCADE`.
* **RLS:** default deny, allow by tenant/user.

**Artifact:** `supabase/migrations/000_init.sql`.
**Owner:** Platform Data.

---

### be-001-supabase-schema-v0.md:33 — **Zero‑downtime migration approach**

**Answer (expand‑migrate‑contract):**

1. **Expand:** add new columns/tables nullable; backfill with job.
2. **Migrate:** dual‑write from app behind feature flag; verify.
3. **Contract:** drop old columns/paths next release.
   Automate with Supabase CLI migrations in CI; use transactional DDL where safe; long operations via batched backfills.

**Artifact:** `docs/runbooks/zero-downtime-migrations.md`.
**Owner:** Platform.

---

### fe-005-homepage-mvp.md:35 — **Homepage copy, slots, hero assets timeline**

**Answer:** Marketing/Design to deliver **final copy + asset specs** (desktop/mobile hero, alt text, focal point) by **Sprint 02, Day 7, 17:00 UTC**.

**Owner:** Marketing (DRI), Design (co‑owner).
**Artifact:** `content/pages/home.v1.json` + assets in `assets/home/`.

---

### fe-005-homepage-mvp.md:36 — **Shared components needing library work**

**Answer:**

* **Hero** (image/video, overlay, CTA; supports A/B via prop).
* **CTA cards** (icon, headline, body, primary/secondary).
* **Tool carousel** (SSRable, keyboard nav, inert offscreen slides).
  Design system owners to add variants + accessibility audits.

**Owner:** UI Library team.
**Artifact:** `packages/ui/*`.

---

### fe-005-homepage-mvp.md:37 — **Analytics & A/B requirements**

**Answer:**

* **Event model:** `view_{section}`, `click_cta_{section}`, `impression_card`, `scroll_75`.
* **Context:** `{ page, section, variant, experiment, user_role }`.
* **A/B:** feature‑flag provider with sticky bucketing; experiments declared in code with IDs.
* **Privacy:** honor DNT + region‑aware consent; no PII in events.

**Artifact:** `analytics/events.md` + `analytics/schema.ts`.
**Owner:** Product Analytics (DRI), Frontend implements.

---

### fe-005-homepage-mvp.md:38 — **Performance budgets & SEO acceptance**

**Answer:**

* **Performance (mobile, 75p):** LCP ≤ **2.5s**, CLS ≤ **0.1**, INP ≤ **200ms**; JS ≤ **180KB** gzip per route (initial).
* **CI gates:** Lighthouse CI PR check: score ≥ **90** Perf/SEO/Best Practices; bundle‑size check failing above budget.
* **SEO AC:** one H1, canonical present, meta title/desc set, OG/Twitter tags, JSON‑LD type set per template, noindex on non‑prod.

**Artifact:** `/.lighthouserc.json`, `bundle-budgets.json`.
**Owner:** Platform + SEO.

---

### plat-045-seo-platform-foundation.md:33 — **Design walkthrough (metadata factory + structured data)**

**Answer:** Schedule engineering design walkthrough for **Nov 1, 2025 16:00 UTC**. Agenda: factory API, template map, validation, fallbacks, testing, ownership.

**Owner:** Platform (DRI), SEO & Frontend attendees.
**Artifact:** deck `docs/design/metadata-factory.pdf`.

---

### plat-045-seo-platform-foundation.md:34 — **Core Web Vitals & schema targets**

**Answer:**

* **CWV targets (mobile, 75p):** LCP ≤ **2.5s**, INP ≤ **200ms**, CLS ≤ **0.1** (same as perf budgets).
* **Schema coverage:** **100%** of indexable routes mapped to JSON‑LD template; **0** validation errors; warnings tolerated up to 5% pages initially.

**Owner:** SEO lead (sign‑off).
**Artifact:** `seo/templates.map.ts`.

---

### plat-045-seo-platform-foundation.md:35 — **Additional CI runtime for SEO checks**

**Answer:** Allocate **≤ 3 minutes per PR** for SEO checks (metadata & schema validation on changed routes + Lighthouse smoke on 1–2 key pages).

**Owner:** Platform.
**Artifact:** `/.github/workflows/seo-checks.yml`.

---

### plat-045-seo-platform-foundation.md:36 — **robots.txt & sitemap base‑URL config**

**Answer:**

* `NEXT_PUBLIC_SITE_URL` (per env).
* `ROBOTS_POLICY=allow|disallow`. Non‑prod: disallow all; Prod: allow.
* Sitemaps at `${SITE_URL}/sitemap.xml`; split by index for >10k URLs.

**Owner:** Platform.
**Artifact:** `app/robots.ts`, `app/sitemap.ts`.

---

### plat-045-seo-platform-foundation.md:37 — **Unlock Search Console API credentials**

**Answer:** SEO lead requests **Google Cloud service account** with Search Console API access; Platform stores JSON key in **Secrets Manager**, injects into Actions as an ephemeral file. Prod‑only use; read scopes.

**Owner:** SEO lead (request), Platform (secrets).
**Artifact:** `docs/runbooks/search-console-api.md`.

---

### plat-045-seo-platform-foundation.md:38 — **Playwright SEO smoke templates**

**Answer (tag as `@seo-smoke`):**

* Canonical tag present & correct
* Meta robots matches env policy
* JSON‑LD parses & validates key fields
* Sitemap index & page included
* 404/410 responses correct; canonical absent on 404
* Hreflang (if localized) links reciprocal

**Artifact:** `e2e/seo/*.spec.ts`.
**Owner:** QA (DRI), SEO reviewer.

---

### shared-009-seo-governance-rollout.md:33 — **SEO training agenda & reviewers**

**Answer:** 60‑min: (1) Platform foundations (10), (2) Content taxonomy & slugs (10), (3) Metadata factory usage (15), (4) Structured data dos/don’ts (15), (5) Publishing checklist & pitfalls (10).
**Reviewers:** SEO lead, Content Ops, Platform.

**Artifact:** `training/seo-101-slides.pdf`.

---

### shared-009-seo-governance-rollout.md:34 — **Dashboards & owners**

**Answer:**

* **Search Console:** performance (queries, pages), coverage, sitemaps. **Owner:** SEO.
* **Analytics:** landing pages, CTR, bounce/engagement, A/B results. **Owner:** Product Analytics.
* **Operational:** Lighthouse trends & CWV field metrics. **Owner:** Platform.

**Artifact:** `dashboards/README.md` with links.

---

### shared-009-seo-governance-rollout.md:35 — **Publishing checklist changes**

**Answer (insert into editorial workflow):**

1. Confirm taxonomy ID & slug present/approved
2. Title/description within limits (≤60/≤155 chars)
3. One H1, semantic headings
4. Images have alt + focal
5. Canonical/robots set by template
6. Internal links added
7. Preview env QA sign‑off
8. Schedule publish with rollback plan

**Artifact:** `content/checklists/seo-publish.md`.
**Owner:** Content Ops (DRI), SEO reviewer.

---

### shared-009-seo-governance-rollout.md:36 — **Incident escalation paths alignment**

**Answer:** Align with current incident/Sisu runbooks by mapping **SEO incidents** to severities:

* **SEV‑1:** sitewide noindex/canonical to wrong host — page owners + Platform on‑call, 15‑min TTA, rollback change.
* **SEV‑2:** sitemap breakage / widespread 5xx on crawl — 30‑min TTA.
* **SEV‑3:** template schema regressions — next business day.
  Escalation via `#seo-incidents` channel + PagerDuty. Postmortem within 72 hours.

**Artifact:** `runbooks/seo-incidents.md`.
**Owner:** Platform (DRI), SEO & Content Ops.

---

### shared-009-seo-governance-rollout.md:37 — **Quarterly SEO audit cadence owner**

**Answer:** **SEO lead** owns scheduling + delivery; events pre‑created for the next 4 quarters, including follow‑up action items tracked in the shared backlog.

**Artifact:** `calendar/seo-audit-cadence.ics` + `seo/audits/YYYY-Q*.md`.

---

## Sprint 03 – CMS Foundation

### plat-020-strapi-ecs-infrastructure.md:33 — **VPC/subnet/security‑group conventions**

**Answer:**

* **VPC:** `/16`, three AZs.
* **Subnets:** public (ALB), private‑app (ECS), private‑data (RDS). NAT per AZ.
* **SGs:**

  * ALB SG: inbound 80/443 from internet → ECS SG only.
  * ECS SG: inbound from ALB SG, outbound to RDS SG + S3 VPC endpoint.
  * RDS SG: inbound 5432 from ECS SG only.
* **Egress:** default deny; allow list to S3, Secrets Manager, CloudWatch, required APIs.

**Artifact:** `infra/networking/*.tf`.
**Owner:** DevOps.

---

### plat-020-strapi-ecs-infrastructure.md:34 — **Container registry strategy**

**Answer:** **Shared ECR repo per app**, promote by **immutable tags**: `app:<git-sha>`, `app:staging`, `app:prod`. Promotions retag the same digest; provenance via SBOM/attestations.

**Owner:** DevOps.
**Artifact:** `infra/ecr.tf` + promotion script.

---

### plat-020-strapi-ecs-infrastructure.md:35 — **Secrets catalog pre‑approval**

**Answer:** Approve full list before Terraform:

* `STRAPI_APP_KEYS`, `STRAPI_ADMIN_JWT_SECRET`, `STRAPI_JWT_SECRET`
* `DATABASE_URL` (RDS)
* `UPLOAD_PROVIDER` + creds (S3 bucket & key)
* Webhook tokens (Next.js, Search, Supabase)
* OAuth/SSO client secrets (if used)
* Email provider creds (if used)

**Store:** AWS Secrets Manager; ECS task role **read‑only**.
**Owner:** Platform Ops (DRI).
**Artifact:** `docs/security/strapi-secrets.md`.

---

### plat-020-strapi-ecs-infrastructure.md:36 — **Observability requirements**

**Answer:**

* **Logs:** ECS → FireLens → CloudWatch; 30‑day retention + error alerts.
* **Metrics:** CPU/Mem, 5xx rate, p95 latency, queue depth (if any).
* **Traces:** OpenTelemetry to X‑Ray (basic spans).
* **Alerts:** SEV‑2 at p95>1s for 15 min or 5xx>2% for 5 min.

**Artifact:** `infra/observability/*.tf` + runbook.

---

### plat-021-strapi-data-foundation.md:33 — **Retention, RPO, RTO**

**Answer:**

* **Backups:** nightly full, 15‑min PITR, retain **35 days**.
* **RPO:** **≤15 min**; **RTO:** **≤60 min** (restore + re‑point ECS).
* Quarterly restore drill.

**Owner:** Platform Ops.
**Artifact:** `docs/runbooks/rds-backup-restore.md`.

---

### plat-021-strapi-data-foundation.md:34 — **Classifying assets/snapshots**

**Answer:**

* **Public assets:** S3 bucket with CloudFront, **SSE‑KMS**, public via CDN only.
* **Private assets:** separate bucket, signed URLs, **no public ACLs**.
* **DB snapshots:** encrypted with KMS, access limited to ops role.
* **Lifecycle:** move assets >180 days to IA; snapshots per retention policy.

**Owner:** Platform Security.
**Artifact:** `infra/storage/*.tf`.

---

### plat-021-strapi-data-foundation.md:35 — **Ingress/egress rules**

**Answer:**

* **Ingress:** ALB → ECS only; `/admin` optionally IP allowlist/VPN.
* **Egress:** ECS to RDS, S3 VPC endpoint, SMTP/Email provider; deny broad internet.
* **WAF:** basic SQLi/XSS on ALB; rate limit `/admin`.

**Owner:** Security & DevOps.
**Artifact:** `infra/waf/*.tf`.

---

### plat-021-strapi-data-foundation.md:36 — **Secrets flow through Terraform & runtime**

**Answer:** Terraform provisions names/keys in Secrets Manager; values injected via secure pipeline (manual `terraform apply -var-file` in vault or SM). ECS tasks read at boot using task role; **no plaintext in TF state or code**; rotate quarterly.

**Artifact:** `docs/security/secrets-flow.md`.
**Owner:** Platform Ops.

---

### plat-022-strapi-cicd-pipeline.md:33 — **Registry access & IAM for CI/CD**

**Answer:** GitHub OIDC role with least‑privileged permissions: `ecr:*Image*`, `ecs:Describe*`, `ecs:RegisterTaskDefinition`, `ecs:UpdateService`, `iam:PassRole` for task role, `secretsmanager:GetSecretValue` (read). Environment separation via condition keys on cluster ARN.

**Owner:** DevOps.
**Artifact:** `infra/iam/ci-cd-role.tf`.

---

### plat-022-strapi-cicd-pipeline.md:34 — **Migration/seed tooling standard**

**Answer:** **Strapi Transfer** for structure/content promotion between envs; **custom idempotent seed scripts** for dev/demo data only. Migration steps run as a pre‑deploy job with backout plan.

**Owner:** Editorial Engineering (structure), Platform (pipeline).
**Artifact:** `cms/scripts/seed.ts`, `cms/transfer/README.md`.

---

### plat-022-strapi-cicd-pipeline.md:35 — **Smoke‑test endpoints & runbooks**

**Answer:** Health at `/_health` (db ping + storage write test), `/admin` login page loads, sample content type GET returns 200, webhook endpoint responds 2xx. Playwright headless check post‑deploy; rollback if any fail.

**Artifact:** `cms/runbooks/deploy.md` + `e2e/cms-smoke.spec.ts`.
**Owner:** Editorial Eng + QA.

---

### plat-022-strapi-cicd-pipeline.md:36 — **Branch/release naming**

**Answer:** Trunk‑based: feature branches `feat/*`, releases `release/*`. Tags `cms-vX.Y.Z`. Promotion via tags; hotfix branches `hotfix/*`.

**Artifact:** `docs/release/cms.md`.
**Owner:** Product Ops.

---

### shared-003-strapi-platform-rollout.md:35 — **Editorial target content types, localization, lifecycle**

**Answer:** v0 types: `Article`, `LandingPage`, `Tool`, `NavigationItem`, `MediaAsset`.
Localization via Strapi i18n plugin; lifecycle states: `draft → in_review → approved → published → archived`. State transitions enforced by roles.

**Owner:** Editorial (DRI), SEO reviewer.
**Artifact:** `cms/models/*.json`.

---

### shared-003-strapi-platform-rollout.md:36 — **DevOps & content platform alignment (envs & release flow)**

**Answer:** Envs: `dev`, `staging`, `prod`; preview envs per PR (ephemeral). Release flow: content freeze window for schema changes; transfer structure → verify → lift freeze → publish.

**Artifact:** `docs/runbooks/cms-release-flow.md`.
**Owner:** DevOps + Content Platform.

---

### shared-003-strapi-platform-rollout.md:37 — **AWS infra requirements for content ops**

**Answer:** Document ECS services (tasks, autoscaling), RDS class/storage, S3 buckets (public/private), CloudFront distro, WAF rules, Secrets Manager keys, KMS CMKs, backup schedules.

**Owner:** DevOps.
**Artifact:** `docs/infra/cms-aws-overview.md`.

---

### shared-003-strapi-platform-rollout.md:38 — **Integration contracts (Next.js, Supabase, search)**

**Answer:**

* **Next.js ← Strapi:** GraphQL or REST contracts versioned; webhooks on publish → revalidate pages (ISR).
* **Supabase:** user entitlements/feature flags exposed to Strapi via read‑only service user; no PII round‑trip.
* **Search:** webhook on publish → indexer job; payload `{ id, type, slug, title, summary, locale, tags }`.

**Artifact:** `contracts/content.v1.json`.
**Owner:** Platform (DRI), Frontend & Search reviewers.

---

### shared-003-strapi-platform-rollout.md:39 — **Permissions, SSO, audit logging plan**

**Answer:**

* **Permissions:** role‑based (Author, Editor, Publisher, Admin); content type permissions least privilege; admin actions logged.
* **SSO:** OIDC/SAML with group → role mapping; require MFA at IdP.
* **Audit:** admin and content changes to an append‑only log; export daily to S3.

**Owner:** Security + Editorial Eng.
**Artifact:** `docs/security/cms-access-control.md`.

---

### shared-003-strapi-platform-rollout.md:40 — **Secrets catalog ownership & distribution flow**

**Answer:** **Platform Ops** maintains catalog & rotation; changes via PR to a **redacted** inventory. Distribution via Secrets Manager only; no `.env` in repos; rotation every 90 days or on staff change.

**Artifact:** `security/secrets-inventory.md`.
**Owner:** Platform Ops (DRI).

---

## Copy‑ready snippets

**.github/workflows/ci.yml (skeleton)**

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: write
  checks: write
  pull-requests: write
  actions: read
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
  unit:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit
  e2e_smoke:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:e2e:install
      - run: pnpm test:e2e:smoke
```

**Playwright `@seo-smoke` example**

```ts
test('@seo-smoke canonical + robots', async ({ page }) => {
  await page.goto('/some-page');
  const canonical = await page.locator('link[rel="canonical"]').first().getAttribute('href');
  expect(canonical).toContain('https://www.example.com/some-page');
  const robots = await page.locator('meta[name="robots"]').first().getAttribute('content');
  expect(robots ?? 'index,follow').toMatch(/index|noindex/);
});
```

**Next.js metadata factory sketch**

```ts
export type MetaInput = { title: string; description: string; canonicalPath: string; type: 'article'|'webpage'; image?: string };
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
export function buildMeta(i: MetaInput) {
  const url = new URL(i.canonicalPath, siteUrl).toString();
  return {
    title: `${i.title} | Brand`,
    description: i.description,
    alternates: { canonical: url },
    openGraph: { title: i.title, description: i.description, url, images: i.image ? [{ url: i.image }] : undefined },
    other: { 'script:type': i.type } // JSON-LD emitted separately
  };
}
