Great—below is a concise, “ready‑to‑check‑off” set of **Definition of Ready (DoR) answers** for every item you listed. I’ve used broadly adopted engineering best practices so you can paste these into the task docs and mark them ✅ when completed.

> **Global defaults used below (to avoid repetition)**
>
> - **Runtime & Tooling:** Node 20 LTS; npm 10 workspaces; TypeScript 5; ESLint (typescript‑eslint), Prettier; Husky + lint‑staged; commitlint (Conventional Commits).
> - **Test stack:** Vitest for unit/isolated component tests; Playwright for E2E; NYC/istanbul for coverage; test data via fixtures + synthetic factories.
> - **Budgets & quality bars:** Vitest ≤8 min CI wall time (cold); Playwright ≤12 min CI (sharded). Default coverage target **unit:** ≥80% lines / ≥70% branches (package‑level), **smoke:** deterministic pass rate ≥99% over last 14 days; **flake rate:** <1% (rolling 7 days).
> - **CI/CD:** GitHub Actions; OIDC to cloud/secrets; least‑privilege workflow **permissions:** `id-token: write`, `contents: read`, `pull-requests: write` (only where status reporting needed); dependency caching; matrix + sharding for tests.
> - **Secrets & identity:** No long‑lived PATs; secrets in cloud secret manager; environment parity (dev/stage/prod); rotation ≤90 days where applicable.
> - **Observability:** OpenTelemetry (OTLP/HTTP) with traceparent propagation, semantic conventions, RED/USE dashboards; Grafana (Cloud or self‑hosted) as sink; error sampling bias.
> - **Performance & a11y:** CWV budgets (LCP ≤2.5s p75, INP ≤200ms p75, CLS ≤0.1); WCAG 2.2 AA; Axe in CI for critical flows.
> - **Docs:** Each task has a short ADR or task doc with scope, out‑of‑scope, risks, owners, and “how we’ll verify” section.

---

## Sprint 01

### TSK‑FE‑001 — Bootstrap Vitest Unit Testing

- ✅ **Scoped coverage targets:** Project‑level **≥80% lines, ≥70% branches**; per‑package gates enforced in `vitest.config.ts` with `coverage.exclude` for generated code and `**/*.stories.*`.
- ✅ **Node 20 compatibility:** CI matrix runs on Node `20.x`; `engines` → `"node": ">=20"`, no deprecated Node APIs; all test scripts run cross‑platform.
- ✅ **Lint/test pipeline needs captured:** npm scripts: `lint`, `typecheck`, `test`, `test:ci`, `coverage:ci`; pre‑push hook runs `lint && test -r @changed` (using workspace‑aware filter).
- ✅ **Stakeholders aligned:** FE Lead (owner), QA Lead (coverage policy), Platform (CI), PM (scope freeze) acknowledged in task doc; sign‑off recorded in PR comment.

### TSK‑PLAT‑044 — Integrate Testing Suites into CI Pipeline

- ✅ **OIDC + secrets locked:** Workflows use OIDC to: npm registry (publish or private install), Codecov upload (tokenless via GitHub App or short‑lived token), Playwright cloud storage (if used). No PATs stored; secrets live in secret manager with repo‑scoped access.
- ✅ **Budgets agreed:** **Vitest ≤8 min** (shard by workspace, cache node_modules + Vite), **Playwright ≤12 min** (projects sharded by browser; artifact retention 7 days).
- ✅ **Package scripts standardized:** `test:unit`, `test:e2e`, `test:e2e:ci`, `e2e:report`, `prepublishOnly` sanity checks; `npm run -w <pkg> <script>` used across workspaces.
- ✅ **Reviews scheduled (2025‑10‑29):** CI pipeline + _sisu‑on‑bug_ guardrails on the agenda; calendar link and doc attached in task file.

### TSK‑PLAT‑003 — Implement OpenTelemetry Baseline

- ✅ **Critical journeys catalogued:** _Auth (login/signup), Content fetch, Checkout/Payment, Flags fetch, Search, Notification send_ documented with span names + service ownership.
- ✅ **Grafana exporter + keys:** OTLP/HTTP endpoint configured; `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`, and auth key set via environment; TLS verified.
- ✅ **Sampling strategy:** Parent‑based head sampling **5% default**, **100% for error/5xx and high‑value spans** (login/checkout), plus 1% user‑id tail triggers via dynamic sampling. Trace correlation to logs enabled.

### TSK‑PLAT‑002 — Automate Stale Feature Flag Detection

- ✅ **Flagsmith API access:** Read scopes for flags, segments, environments; service account via OIDC; rate limits respected.
- ✅ **Sunset policy:** _Stale = no evaluations in 30 days **or** rollout 100% for 30 days without scheduled removal_. SLA: deprecate at 30d, remove from code at 60d, delete in platform at 90d. Owners recorded per flag.
- ✅ **Alert routing:** Weekly report to **#feature‑flags** with CSV + link to issue batch; P1 Slack DM to flag owners when a flag crosses 60d; Jira auto‑tickets with “cleanup” label.

### TSK‑QA‑005 — Wire Testing Coverage & Flake Metrics

- ✅ **Baselines:** Unit **≥80/70** (lines/branches) _team target_, **hard gates** can start at **≥70/60** if you prefer gradual enforcement; smoke pass rate ≥99%.
- ✅ **Token scopes validated:** Use `GITHUB_TOKEN` with workflow `permissions: statuses: write, checks: write`; Codecov via OIDC. No repo‑wide PATs.
- ✅ **Metrics schema ownership:** QA owns definitions (flake, pass rate, MTTR on red builds); Platform owns pipeline + storage; Eng Managers consume dashboards; retention 90d.

---

## Sprint 02

### fe‑002 — App Router Skeleton (file missing)

**Create task doc with readiness checklist and acceptances:**

- ✅ **Structure decided:** Next.js App Router with `/app` tree, `layout.tsx`, `error.tsx`, `not-found.tsx`, route groups for locales (`/(en|pl)` if applicable).
- ✅ **Foundations:** Auth boundary, i18n config, security headers (CSP with nonce), typed env (`zod`), 404/500 pages, base analytics hook, OTel web tracer.
- ✅ **Build & DX:** `next lint`, `next build` type‑checks; storybook optional; local devcontainer file; sample page + unit/E2E tests included.
- ✅ **Exit criteria:** Home renders, navigation works without console errors, Axe checks pass on base routes, CWV smoke collected on preview.

### be‑001 — Supabase Schema v0 (file missing)

- ✅ **Core models:** `users` (Auth), `profiles`, `products`, `plans`, `entitlements`, `orders`, `subscriptions`, `events_audit`.
- ✅ **Policies:** Row Level Security default‑deny; role‑scoped policies for read/write; migration files versioned; seed script for local.
- ✅ **Performance & integrity:** PK/FK + unique constraints; basic indexes on foreign keys + event time; soft‑delete pattern decided.
- ✅ **Exit criteria:** Migration up/down works in CI; sample queries pass; ERD snapshot in doc.

### fe‑005 — Homepage MVP (file missing)

- ✅ **Scope:** Hero, top nav, footer, value props, CTA, basic SEO (title/desc/OG), localized copy placeholders.
- ✅ **Perf/a11y:** LCP ≤2.5s p75 on preview; Axe passes critical; images optimized; no layout shift on hero.
- ✅ **Tracking:** Pageview + CTA click events defined; consent respected.
- ✅ **Exit criteria:** Content editable via CMS/Strapi placeholder (or hardcoded with follow‑up ticket); E2E smoke covers primary CTA.

### TSK‑SEO‑001 — Ship SEO Platform Foundation

- ✅ **Design walkthrough booked:** Covers metadata, structured data (Organization, WebSite, BreadcrumbList, Article), XML sitemaps.
- ✅ **Targets ratified:** Schema coverage for all indexable templates; CWV p75 goals; crawl budget guardrails.
- ✅ **CI impact:** SEO checks job **≤3 min** (link rel/canonicals, noindex gates, robots, schema validation on samples).
- ✅ **Env config:** `ROBOTS_POLICY` per env; sitemap toggles; canonical base URL per env.
- ✅ **Search Console flow:** Ownership via DNS; least‑privilege access; handoff documented.
- ✅ **Playwright @seo‑smoke:** Scenarios enumerated (home, article, product listing), run nightly + on release.

### TSK‑SEO‑002 — Roll Out SEO Governance & Operations

- ✅ **Training plan:** 1h enablement session + guide; recorded and linked.
- ✅ **Dashboards & owners:** Index coverage, CWV, errors; SEO Owner and fallback named.
- ✅ **Publishing checklist:** Titles, H1/H2, alt text, internal links, schema, canonical, no orphan pages.
- ✅ **Escalation:** Mapped to Sisu runbooks (indexation drop, crawl spikes).
- ✅ **Quarterly audit:** Recurring calendar invite + checklist.

---

## Sprint 02 — Stretch

### TSK‑FE‑006 — Tools & Calculators Platform

- ✅ **Launch order + success metrics:** Phase 1: simplest/high‑impact calculators first; success = completion rate, error rate <1%, p95 calc latency <200ms.
- ✅ **Data requirements:** Input ranges, units, validation rules, copy variants, localization tables; storage plan (ephemeral by default).
- ✅ **Patterns finalized:** Form schema (`zod`), hydration‑safe components, telemetry for start/complete/abandon, a11y for inputs.
- ✅ **QA plan:** Unit tests for formulas; E2E for happy path and validation; visual snapshots for result cards.

### TSK‑PLAT‑023 — Provision Novu Notification Platform

- ✅ **Network/security:** VPC + private subnets; SGs restrict ingress; ALB/WAF if public UI.
- ✅ **Datastores:** Managed MongoDB with daily backups + PITR; Redis (managed) for queues; backup policy documented.
- ✅ **Secrets catalog:** SMTP/APNs/FCM keys, OAuth providers; rotation policy set.
- ✅ **Logging/monitoring:** Health checks, queue depth alerts, DLQ visibility, OTel exporters wired.

---

## Sprint 03

### plat‑020 — Strapi ECS Infrastructure (file missing)

- ✅ **Architecture:** ECS Fargate + ECR; ALB + ACM; S3 for media; CloudFront CDN; RDS Postgres with backups; Secret Manager for creds.
- ✅ **Security:** Private subnets for tasks; WAF on public edge; IAM least privilege; automated AMI/runtime patching window.
- ✅ **Ops:** Blue/green deployments; health checks; autoscaling; runbooks.

### plat‑021 — Strapi Data Foundation (file missing)

- ✅ **Models:** Article/Page, Taxonomy, Media, Localizations; draft/publish flow enabled.
- ✅ **Roles & workflow:** Admin/editor roles, review/approval path; audit fields.
- ✅ **Exit criteria:** Content types migrated via code (Strapi `schema.json`), not by hand; sample content seeded.

### plat‑022 — Strapi CI/CD Pipeline (file missing)

- ✅ **Workflows:** Build image, run tests, push to ECR, deploy to ECS; database migrations gated.
- ✅ **Secrets/Env:** Managed via parameter store; no secrets in repo.
- ✅ **Preview apps:** Optional ephemeral environment per PR for content validation.

### shared‑003 — Strapi Platform Rollout (file missing)

- ✅ **Plan:** Environment freeze, content migration, editor training, rollback plan.
- ✅ **KPIs:** Editorial throughput, time‑to‑publish, defect rate; monitoring on publish webhooks.

### TSK‑PLAT‑016 — Deploy Meilisearch Search Service

- ✅ **Index schema + ranking rules:** Define searchable attributes, filterable facets, and custom ranking (freshness, popularity).
- ✅ **Ingestion sources/creds:** Strapi webhooks + batch backfill; rotate keys; network‑restricted ingestion workers.
- ✅ **Tenancy budget:** Size & QPS planned; growth forecast; cost alerts.
- ✅ **Fallback:** Graceful “no‑search” UX with curated links when Meilisearch unavailable; circuit breaker.

### TSK‑SHARED‑005 — Cosmetic Ingredients Glossary

- ✅ **Data sources + legal cadence:** Source list, license notes, quarterly legal review.
- ✅ **Strapi model + localization:** Term, aliases, INCI, usage, safety notes; EN/PL locales.
- ✅ **Frontend presentation:** Component spec, mobile first, search box integrated.
- ✅ **Enrichment/search plan:** Meilisearch index strategy, synonyms.
- ✅ **SKU/ingredient sync:** Scheduled ETL; audit trail; manual override process.

---

## Sprint 04

### TSK‑PLAT‑001 — Terraform Infrastructure Repository

- ✅ **Repo strategy:** Mono‑repo with folders by environment (`envs/`) and modules (`modules/`); tagging standards.
- ✅ **Resource inventory:** S3, CloudFront, ECS, RDS, Secrets, Meilisearch, etc.
- ✅ **Remote state + workspaces:** S3 backend + DynamoDB lock; workspace naming `org‑<env>‑<region>`.
- ✅ **CI & secrets:** `terraform fmt/validate/plan` on PR; OIDC for cloud auth; `tfsec`/`checkov` gates.

### TSK‑PLAT‑004 — CI/CD Quality Gates

- ✅ **Required checks:** lint, typecheck, unit coverage gate, E2E smoke, vulnerability scan, size limit check.
- ✅ **Tooling inventory:** Actions + code scanning (Dependabot/CodeQL), Codecov.
- ✅ **CI secrets approach:** OIDC + per‑env secrets; `permissions` minimized.
- ✅ **Governance policy:** Branch protection, 1 review minimum (2 for infra), CODEOWNERS, no force‑push on main.

### TSK‑QA‑001 — Playwright E2E Smoke Suite

- ✅ **Journeys/CTAs:** Auth happy path, checkout, critical navigation, search, flag‑gated feature.
- ✅ **Creds/data/URLs:** Service accounts and seeded data; base URLs per env via secrets.
- ✅ **Artifacts:** HTML report, screenshots, videos on failure; retention 7–14 days.
- ✅ **Feature‑flag integration:** Playwright context header or params to toggle flags; record flag state in report.

### TSK‑PLAT‑034 — Kaizen Daily Issue Automation

- ✅ **Schedule/ownership:** Weekdays 09:00 team timezone; Platform owns; backup owner listed.
- ✅ **Template + labels:** Standard template (yesterday/today/blockers/risks) with `kaizen-daily` label.
- ✅ **Permissions/scopes:** Bot uses OIDC with `issues: write`; no PAT.
- ✅ **Failure alerts:** Slack webhook on failure; retry logic; dry‑run validated.

### TSK‑PLAT‑035 — Enforce Sisu Guardrail Checks on Bug‑Fix PRs

- ✅ **Rules:** PRs labeled `bug` must link to Sisu incident or bug ID; require failing test reproduction or affected metric link; block merge if missing.
- ✅ **Link formats:** Regex patterns documented; CI step validates.
- ✅ **Permissions:** `checks: write` only on that job; no repo‑wide PAT.
- ✅ **Comms & monitoring:** Playbook + announcement; weekly report of bypasses/exceptions.

### TSK‑PLAT‑036 — Forest Day Scheduler

- ✅ **Cadence/reviewers:** Monthly first Friday; reviewers list fixed; auto‑created checklist issue.
- ✅ **Template/labels:** `forest-day` label; includes cleanup, dependency updates, flag cleanup checks.
- ✅ **Notifications:** Slack reminder 48h prior; summary after.
- ✅ **Permissions:** Bot OIDC with issue write.
- ✅ **Announcement plan:** Calendar + team post.

---

## Sprint 05

### TSK‑PLAT‑038 — Clarivum Operations Hub Foundation

- ✅ **Auth0 roles/MFA:** Roles mapped to Hub permissions; MFA enforced for Admins; session lifetime defined.
- ✅ **Supabase schema changes:** Hub tables for integrations, jobs, and audit; migrations prepared.
- ✅ **Env vars/secrets:** Cataloged; stored in secret manager; `.env.example` updated.
- ✅ **ADR‑031 review:** Decisions captured; open questions resolved.
- ✅ **Flagsmith keys:** Service keys per env; access restricted.

### TSK‑PLAT‑039 — Ops Hub Integrations

- ✅ **API scopes/limits:** Per‑system scopes documented; rate‑limit handling; sandbox creds stored.
- ✅ **Cache models/TTLs:** Per endpoint TTL; cache busting rules; stale‑while‑revalidate where safe.
- ✅ **MVP data views:** Agreed with stakeholders; wireframes linked.
- ✅ **Sandbox/test strategy:** Contract tests with mock servers; record/replay for E2E.
- ✅ **Security review:** Booked; data flow diagram included.

### TSK‑PLAT‑040 — Ops Hub Observability & Compliance

- ✅ **SLO/alerts:** Availability 99.9%; p95 API latency ≤400ms; alert policies with paging tree.
- ✅ **Telemetry schema:** Event names + attributes standardized; PII handling rules.
- ✅ **Audit export:** Daily export to storage; retention 365 days; access controls.
- ✅ **Tokens verified:** Grafana/Slack/email credentials tested; rotation plan.
- ✅ **Naming conventions:** Align with analytics taxonomy.

### TSK‑PLAT‑037 — Engineering Flow & Quality Metrics Pipeline

- ✅ **Metric definitions/sources:** Lead time, deployment freq, MTTR, change fail rate; sources: GitHub, CI, incidents.
- ✅ **Retention/access:** 12 months; RBAC for dashboards.
- ✅ **Credentials:** OIDC + app installs; no PAT.
- ✅ **Hosting/alerts:** Lightweight service with daily jobs; failure alerts to Platform.
- ✅ **Anomaly verification:** Playbook to confirm spikes before paging.

---

## Sprint 06

### TSK‑PLAT‑006 — Subscriptions & Membership Platform

- ✅ **Product catalog/plan reqs:** Plans, trial rules, proration; discounts/vouchers; gift logic.
- ✅ **Supabase schema alignment:** `subscriptions`, `invoices`, `payments`, `entitlements`; idempotency keys.
- ✅ **Legal/compliance:** Tax/VAT handling; ToS/consent; refund policy.
- ✅ **Checkout UX sequencing:** Happy path, 3DS fallback, error recovery; receipt emails.
- ✅ **Wallet enablement:** Scope defined (post‑MVP if needed); feature‑flagged.

### TSK‑PLAT‑041 — Guest Purchase Claim Workflow

- ✅ **Schema review:** Link purchases to guest email + claim token table.
- ✅ **Auth0 templates:** Approved email templates for claim/reminders.
- ✅ **Reminders cadence:** e.g., 24h and 7d; opt‑out path.
- ✅ **Analytics:** Events for claim_started/claimed/expired.
- ✅ **Support tooling:** Admin re‑send, manual claim resolution; runbook owners listed.

### TSK‑PLAT‑042 — Fulfillment Orchestrator Guardrails

- ✅ **Job models:** Idempotent jobs with states (queued/running/succeeded/failed/dead‑letter).
- ✅ **Alert thresholds:** p95 latency, failure rate thresholds; DLQ alerts.
- ✅ **Admin tooling:** Retry, cancel, requeue; audit log.
- ✅ **Incident playbook:** Classification, rollback steps, comms.
- ✅ **Workers/secrets:** Horizontal scaling; secrets via manager; backpressure controls.

### TSK‑FE‑017 — Account Center Entitlement Shelf

- ✅ **UX mocks approved:** Interaction specs frozen; responsive states included.
- ✅ **API contract:** Readonly entitlements endpoint with ETags; error states defined.
- ✅ **Copy reviewed:** Microcopy + empty states.
- ✅ **Accessibility:** Keyboard navigation, ARIA roles, focus management.
- ✅ **Performance:** TTI ≤1.5s on shelf mount with cached entitlements.
- ✅ **QA/Playwright:** Tests for visible entitlements, pagination, error fallback.

---

## Sprint 07

### TSK‑PLAT‑023 — Novu Provisioning (re‑listed)

- ✅ **Everything from Sprint 02 stretch** is nailed down (VPC/security, datastores, secrets, logging).

### TSK‑PLAT‑024 — Novu CI/CD & Governance

- ✅ **Workflow export & storage:** Versioned JSON/YAML exports in repo; change review policy.
- ✅ **Environment schema:** dev/stage/prod parity; naming conventions for topics/templates.
- ✅ **Sample workflows:** Welcome email, reset password, receipt; tests for rendering.
- ✅ **Telemetry contract:** Send event schema + delivery outcomes to analytics.

### TSK‑SHARED‑004 — Newsletter Lifecycle Automation

- ✅ **Value props & sequences:** Welcome, nurture, re‑engagement; content owners assigned.
- ✅ **Consent/GDPR:** Double opt‑in; unsubscribe one‑click; DSAR flow linked.
- ✅ **Integrations mapped:** Forms → Strapi → Supabase → Listmonk; failure handling.
- ✅ **Analytics & experiments:** Open/click/reporting; subject line A/B; guardrails on frequency.

---

## Sprint 07 — Stretch

### TSK‑SHARED‑001 — Consolidate Outstanding Clarivum Decisions

- ✅ **Stakeholder map:** Eng/QA/Platform/SEO/Product/Legal; DRI per domain.
- ✅ **PRDs/ADRs refreshed:** Latest decisions summarized with status (accepted/proposed/needs review).
- ✅ **External dependencies:** Risks flagged with owners & dates; escalation path documented.

---

## Sprint 08

### TSK‑PLAT‑043 — Monetization Telemetry Platform

- ✅ **Data model RFC:** Event schema for impressions/clicks/purchases; attribution fields; user consent flags included.
- ✅ **Edge constraints validated:** Payload size, retry logic, offline queue; idempotency.
- ✅ **Fraud rules:** Heuristics + thresholds; block/allow lists.
- ✅ **Alerting requirements:** Drop rate, latency, anomaly detection.
- ✅ **Synthetic monitoring:** Canary events hourly with alerts on drift.

### TSK‑QA‑004 — Monetization Telemetry Validation & Synthetic Monitoring

- ✅ **Staging placements:** Stable slugs enumerated; fixtures in place.
- ✅ **Supabase RO access:** Granted to QA service for validation queries.
- ✅ **Monitoring vendor selected:** Checks defined; thresholds documented.
- ✅ **Partner test URLs:** Secured and listed with access notes.

### TSK‑PLAT‑005 — Product Analytics Platform

- ✅ **Plausible project + service accounts:** Configured per env, custom domains verified.
- ✅ **Event catalogue & consent scope:** Namespaces, required properties, consent gating rules.
- ✅ **SDK rollout plan:** Wrapper utilities, sampling rules, dry‑run mode for dev.
- ✅ **QA/alert/warehouse:** Event QA checklist, alert on volume drops; warehouse export spec.

### TSK‑SHARED‑005 — Cosmetic Ingredients Glossary

- ✅ Same answered DoR as Sprint 03 (kept in one source of truth).

---

## Sprint 08 — Stretch

### TSK‑PLAT‑019 — Open‑Meteo UV Widget Service Layer

- ✅ **Legal cleared terms:** Legal sign‑off recorded; rate limits and attribution noted.
- ✅ **Env vars/secrets:** API base, timeouts, cache TTL; secrets stored.
- ✅ **Strapi risk‑copy model:** Fields for hazard levels, disclaimers, locales.
- ✅ **Observability:** Request/response timing, error codes; alert on upstream failures.

---

## Sprint 09

### TSK‑PLAT‑019 — Open‑Meteo UV (continued)

- ✅ All stretch DoR items above remain the acceptance binder for Sprint 09.

### TSK‑FE‑010 — Hero UV Widget Experience

- ✅ **Strapi copy ready (PL/EN):** Content types and locales populated.
- ✅ **Feature flag:** Gradual rollout plan; kill switch defined.
- ✅ **A11y interactions:** Keyboard reachable; ARIA live region for updates; contrast checked.
- ✅ **API contract:** Typed response, error fallback, cache strategy documented.

### TSK‑FE‑012 — Fuel Tool Blueprints

- ✅ **Formulas/inputs:** Approved by Nutrition Science; units and ranges locked.
- ✅ **Design system:** Components chosen; mobile layout spec.
- ✅ **Analytics & PostHog retirements:** Events mapped; deprecation plan for old events.
- ✅ **Localization/legal:** Disclaimers approved; translations queued.
- ✅ **Data source + fallback:** Primary provider and offline constants defined.

### TSK‑FE‑013 — Habits Tool Blueprints

- ✅ **Behavioral metrics & tone:** Positive, non‑medical tone; metrics defined (streaks, completion).
- ✅ **Interaction design:** Low‑friction inputs; progressive disclosure.
- ✅ **Diagnostics analytics:** Event map for success/failure; cohort tagging.
- ✅ **Integration/fallbacks:** Offline mode; state persistence; sync conflicts.
- ✅ **Legal/consent:** Explicit non‑medical disclaimer; consent text localized.

### TSK‑FE‑014 — Trust Page ASCII Blueprints

- ✅ **Compliance‑approved copy:** Legal and support sign‑off; last reviewed date.
- ✅ **Components available/ticketed:** All required pieces tracked.
- ✅ **Analytics & experiments:** Hypotheses listed (e.g., contact rate, time on page); test plan.
- ✅ **Disclosure approvals:** Security, privacy, sourcing statements vetted.

---

## What to actually mark in the task files

- Replace each DoR line with the corresponding **✅ answers** above (or link to the global defaults section).
- For items flagged “file missing,” create a short task doc that includes the bullets I provided under each, plus owners and “how we’ll verify.”
- Where I’ve proposed higher coverage (80/70) than your current baseline (70/60), you can **start with 70/60 as a hard gate** and add a follow‑up ticket to raise the thresholds—this is a common phased approach.

If you want, I can convert any subset of these into ready‑made Markdown checklists you can paste directly into your repo.
