> **Canonical decisions:** This PTRD is implemented through the ADR suite (`docs/adr/ADR-001-…ADR-028`). Link new sections to the relevant ADRs before promoting work to tasks, per `docs/policies/work-intake-workflow.md`.

---

# Pre‑Project Technical Readiness Document (PTRD)

> Purpose. Prevent the 6→12→18→24 month slow‑motion collapse by making a few boring, high‑leverage decisions up front—architecture, quality, reliability, security, cost, and ways of working.
> 

---

## 0) Executive summary (fill this in last)

- **Product in one sentence:**
- **Core user → job → outcome:**
- **“Non‑negotiables” (SLOs, privacy, cost ceilings):**
- **Stack (1–2 “innovation tokens” max):**
- **Go/no‑go criteria to start coding:** all sections below are complete and checked ✅.

---

## 1) Outcomes, scope, and constraints

**1.1 Outcomes (business & user)**

- Top two *business* outcomes (e.g., paid conversions + activation to aha‑moment).
- Top two *experience* outcomes (e.g., p95 API < 300 ms; support tickets < 1% of monthly users).
    - Why p‑percentiles? Average latency hides the pain your tail users feel; tail latency dominates user experience at scale. See “The Tail at Scale.” ([Google Research](https://research.google/pubs/the-tail-at-scale/?utm_source=chatgpt.com))

**1.2 Constraints**

- Regulatory (GDPR/CCPA, sector standards), data residency, accessibility, export controls.
- Budget guardrails (monthly cloud, tools, headcount).
- Hiring constraints (skills that *must* be available in the market).

---

## 2) Non‑functional requirements (NFRs)

Use ISO/IEC 25010 quality characteristics to force clarity (performance, reliability, security, maintainability, etc.). List the few that matter most and make them measurable. ([ISO 25000](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010?utm_source=chatgpt.com))

**Example NFRs (fill in numbers):**

- **Reliability:** API SLO 99.9% monthly (error budget ≈ 43 min/mo); mobile sync SLO 99%. Error‑budget policy in place (freeze features if budget is spent). ([Google SRE](https://sre.google/workbook/error-budget-policy/?utm_source=chatgpt.com))
- **Performance:** p95 request < ___ ms, p99 < ___ ms; Largest Contentful Paint ≤ 2.5 s at 75th percentile. ([web.dev](https://web.dev/articles/lcp?utm_source=chatgpt.com))
- **Security:** MFA for admin + sensitive ops; OWASP Top 10 mitigations; CIS Controls IG1 minimum. ([OWASP Foundation](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/?utm_source=chatgpt.com))
- **Cost:** infra ≤ $___/month at 10× current users; alarms at 50/75/90% of budget.

---

## 3) Architecture—make the big decisions once (and record them)

- **Decision log:** Adopt ADRs (Architecture Decision Records). Every significant decision gets a 1‑page ADR (context → decision → consequences). Store in repo `/doc/adr`. ([Cognitect.com](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions?utm_source=chatgpt.com))
- **Choose boring tech:** Prefer mature stacks with known failure modes (e.g., React/Node/Postgres, or your equivalent). Spend “innovation tokens” sparingly. ([Dan McKinley](https://mcfunley.com/choose-boring-technology?utm_source=chatgpt.com))
- **Service shape (now vs. later):** Start with a modular monolith with clear boundaries; reserve an easy path to split hot spots later.
- **API design & versioning:** Write the API surface *before* code. Document pagination, idempotency, rate‑limit and compatibility. Pick a versioning scheme (URL `v1`, header, or query) and stick to it; consistency beats ideology. ([Microsoft Learn](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design?utm_source=chatgpt.com))

**ADR‑000 examples to fill now**

- ADR‑001: Primary DB & cloud provider
- ADR‑002: Authn/Authz model (OIDC/OAuth2 provider, session vs. token)
- ADR‑003: Queues/background jobs
- ADR‑004: Observability stack & telemetry standard (OpenTelemetry) ([OpenTelemetry](https://opentelemetry.io/docs/what-is-opentelemetry/?utm_source=chatgpt.com))
- ADR‑005: Feature‑flag system for trunk‑based development ([trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/feature-flags/?utm_source=chatgpt.com))

---

## 4) Data model, storage & indexing (so month‑7 doesn’t kill you)

**4.1 Database plan (Postgres)**

- Schema v0 (ERD + naming, auditing columns, soft‑delete policy).
- **Indexing policy:**
    - Every frequently‑queried predicate (JOIN/WHERE/ORDER BY) must be covered by an index; prefer B‑tree; consider partial or expression indexes for common filters (e.g. `status='active'`, `lower(email)`). ([PostgreSQL](https://www.postgresql.org/docs/current/indexes.html?utm_source=chatgpt.com))
    - Enable `pg_stat_statements`; require `EXPLAIN (ANALYZE, BUFFERS)` for queries with table scans or > 1k rows examined. ([PostgreSQL](https://www.postgresql.org/docs/current/sql-explain.html?utm_source=chatgpt.com))
- Migrations: zero‑downtime patterns (backfill + dual‑write if needed).

**Why this matters:** The fastest way to reenact your “month‑13: every feature breaks” story is unindexed queries and ad‑hoc migrations. The Postgres docs are blunt: indexes radically reduce search time; misuse or absence leads to scans. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes.html?utm_source=chatgpt.com))

---

## 5) Scalability & capacity (think for 100× on day one)

- **Traffic model:** daily peak RPS, read/write mix, largest objects, burst factors.
- **Tail‑latency aware targets:** set p95/p99 budgets and cache strategy (CDN + application cache + DB read‑replicas later). Tail sensitivity grows as you fan out calls; design for it. ([Google Research](https://research.google/pubs/the-tail-at-scale/?utm_source=chatgpt.com))
- **Background jobs & queues:** choose one (e.g., SQS/Sidekiq/BullMQ). Define idempotency keys, retries, and dead‑letter queues.
- **File storage:** use object storage with lifecycle policies (e.g., S3 → IA/Glacier after N days).
- **Rate limits & quotas:** protect hot paths and 3rd‑party APIs.

---

## 6) Reliability: SLOs, error budgets, and release safety

- **SLOs & SLIs:** Document user‑visible SLIs; attach SLOs and compute budgets. Include an explicit **error‑budget policy** (what freezes when budgets are burned). ([Google SRE](https://sre.google/workbook/implementing-slos/?utm_source=chatgpt.com))
- **Deployment safety:** canary + feature flags; instant rollback. Feature flags enable trunk‑based dev and safe, progressive exposure. ([Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development?utm_source=chatgpt.com))
- **Backups & DR:** Define *RPO* (acceptable data loss) and *RTO* (time to restore); choose DR tier accordingly. Document restore drills. ([Amazon Web Services, Inc.](https://aws.amazon.com/blogs/mt/establishing-rpo-and-rto-targets-for-cloud-applications/?utm_source=chatgpt.com))

---

## 7) Security baseline (day‑1 hygiene)

- **Authentication & sessions:** MFA for admin; robust session management; avoid weak password flows; use strong password hashing. Follow OWASP guidance. ([OWASP Foundation](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/?utm_source=chatgpt.com))
- **Secrets management:** No secrets in repo or plain env files. Centralize storage & rotation (Vault/Secrets Manager); audit access. OWASP has a concise cheat sheet. ([OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html?utm_source=chatgpt.com))
- **App hardening:** Adopt OWASP Top 10 controls (access control, crypto, injection, security misconfiguration). Track a short checklist per PR. ([OWASP Foundation](https://owasp.org/Top10/?utm_source=chatgpt.com))
- **Baseline controls:** Aim to satisfy CIS Controls IG1 on day one (inventory, secure configs, vulnerability mgmt., controlled admin access, backups). ([CIS](https://www.cisecurity.org/controls/v8?utm_source=chatgpt.com))

> Your field note (“68% auth vulns”) is sadly plausible. Broken auth/session handling is a perennial top risk category. (OWASP Foundation)
> 

---

## 8) Quality & speed: CI/CD, automated tests, and code review

- **Trunk‑based development + feature flags.** Merge small PRs to `main` behind flags; deploy continuously. This correlates with higher delivery performance in DORA research. ([Dora](https://dora.dev/research/2022/dora-report/?utm_source=chatgpt.com))
- **Test strategy (the practical test pyramid):** many unit tests, a meaningful layer of service/contract tests, and a small set of fast, reliable E2E jobs. Gate merges on green. ([martinfowler.com](https://martinfowler.com/articles/practical-test-pyramid.html?utm_source=chatgpt.com))
- **Minimal day‑1 coverage:**
    - Auth flows, pricing/checkout, PII touchpoints, DB migrations, background jobs.
- **Code review policy:** respond within 1 business day; small changes; checklists. (Google’s public guidance is a good model.) ([Google GitHub](https://google.github.io/eng-practices/review/reviewer/speed.html?utm_source=chatgpt.com))

> Why invest early? Stripe’s Developer Coefficient study shows developers lose ~17.3 hours/week on maintenance and ~3.8 hours/week on “bad code.” Lightweight CI, tests, and reviews claw this back.
> 

---

## 9) Observability from the first commit

- **Standardize on OpenTelemetry** for traces, metrics, and logs; choose any backend now, you can switch later. ([OpenTelemetry](https://opentelemetry.io/docs/what-is-opentelemetry/?utm_source=chatgpt.com))
- **Golden signals & SLO‑driven alerts:** latency (p95/p99), errors, saturation, traffic; alert on SLOs, not on every CPU spike. (CNCF: logs/metrics/traces are the classic signals, but focus on outcomes.) ([CNCF](https://www.cncf.io/wp-content/uploads/2022/03/CNCF_Observability_MicroSurvey_030222.pdf?utm_source=chatgpt.com))

---

## 10) Cost guardrails (FinOps basics)

- **Right‑sizing & budgets:** Rightsize instances, set budget alerts, enable cost explorer rightsizing and Trusted Advisor checks. ([AWS Documentation](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-rightsizing.html?utm_source=chatgpt.com))
- **Waste is real:** Flexera’s 2024/2025 surveys consistently find ~27–28% of cloud spend is wasted; cost control is the top challenge. Bake in controls now. ([learn.flexera.com](https://learn.flexera.com/flexera-business-value/1491301?utm_source=chatgpt.com))
- **Performance efficiency & cost pillars:** Use AWS Well‑Architected to review early (six pillars include cost and performance). ([Amazon Web Services, Inc.](https://aws.amazon.com/architecture/well-architected/?utm_source=chatgpt.com))

> Back‑of‑envelope: If you “save $38,800/mo” by trimming idle capacity, that’s $465,600/year—worth three days of review anywhere. (38,800×12 calculated.)
> 

---

## 11) Release & runtime operations

- **Environments:** dev → prod; dev is the single pre-production gate and prod is the truth.
- **Runbooks & incident levels:** who pages whom; severities; rollback steps.
- **Change management:** canary, automated rollbacks, feature kill‑switch.
- **Data retention:** define per‑object lifecycle and deletion (user‑requested, auto).

---

## 12) Team, process, and docs

- **Roles:** product lead, tech lead/architect (with prior scale experience), SRE‑minded developer.
- **Cadence:** weekly planning, daily sync, monthly reliability review (SLOs, budgets).
- **Docs that must exist:**
    - `/README.md` (how to run), `/doc/adr/*`, `/doc/architecture.md` (C4 diagram), `/doc/runbooks/*`.

---

## 13) Exit criteria to **start building** (checklist)

- [ ]  Outcomes & NFRs quantified (Section 1–2)
- [ ]  ADR‑001…005 approved; stack locked (Section 3)
- [ ]  Schema v0 + **index plan**; migrations framework (Section 4)
- [ ]  Capacity + caching + queue plan (Section 5)
- [ ]  SLOs + error‑budget policy + backup/RPO/RTO (Section 6)
- [ ]  Security baseline & secrets manager wired (Section 7)
- [ ]  CI/CD pipeline + tests + code‑review checklist (Section 8)
- [ ]  OpenTelemetry instrumentation, dashboards, alerts (Section 9)
- [ ]  Budgets & cost alerts + rightsizing checks live (Section 10)
- [ ]  Runbooks + on‑call basics (Section 11)

---

## 14) Two‑week “Architecture Sprint” (no code, only plumbing)

**Day 1–2: Outcomes, risks, and stack**

- Finalize NFRs & SLOs (Section 2), choose stack, write ADR‑001…002.
- Draft API surface (OpenAPI). Pick versioning approach. ([Microsoft Learn](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design?utm_source=chatgpt.com))

**Day 3–4: Data & storage**

- Model schema v0; decide partitioning and **indexes**; turn on `pg_stat_statements`. Script `EXPLAIN` checks in CI. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes.html?utm_source=chatgpt.com))

**Day 5–6: Security & secrets**

- Wire SSO/MFA for admin; create roles/permissions; stand up secrets manager; remove plaintext `.env` from repo. ([OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html?utm_source=chatgpt.com))

**Day 7–8: CI/CD & testing**

- Create pipelines: lint → unit → service tests → E2E smoke → build → deploy (dev). Add test pyramid skeleton & merge gates. ([martinfowler.com](https://martinfowler.com/articles/practical-test-pyramid.html?utm_source=chatgpt.com))

**Day 9–10: Observability & cost**

- Add OpenTelemetry SDKs; ship traces/metrics/logs; create SLO dashboards & alerts.
- Configure budgets & rightsizing; schedule monthly Well‑Architected review. ([OpenTelemetry](https://opentelemetry.io/docs/what-is-opentelemetry/?utm_source=chatgpt.com))

**Deliverables:** the checklist in §13 is all ✅, plus an “Architecture Review” by an external with scale experience.

---

## 15) Guardrails that directly counter the month‑1→25+ failure pattern

- **Slowdown at month 7–12:** Run **SLO/error‑budget reviews** monthly; freeze features if budgets tank. Tail latency & cache regressions surface here—watch p95/p99, not averages. ([Google Research](https://research.google/pubs/the-tail-at-scale/?utm_source=chatgpt.com))
- **Fragile deploys at month 13–18:** Keep changes small with **trunk‑based dev + flags**; ensure tests run in minutes; require green builds. ([Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development?utm_source=chatgpt.com))
- **Hiring just to maintain at month 19–24:** Invest early in **indexing, CI, and observability**; Stripe’s data shows maintenance/bad‑code time is a huge tax if you don’t.
- **Cost blowups at any time:** Budget alarms + rightsizing + “turn it off” culture; industry surveys show ~27–28% cloud wastage—treat cost as a first‑class KPI. ([learn.flexera.com](https://learn.flexera.com/flexera-business-value/1491301?utm_source=chatgpt.com))

---

## 16) “Smell tests” you can run before first feature work

- **Query audit:** Can every top‑10 query explain without a full scan? (If not, add/adjust an index.) ([PostgreSQL](https://www.postgresql.org/docs/current/indexes.html?utm_source=chatgpt.com))
- **Load probe:** Does a 100× synthetic burst keep p95/p99 under target with caches enabled?
- **One‑click sanity:** Can you run *one* pipeline that: builds → tests → deploys → seeds → runs a smoke E2E → tears down?
- **Cost check:** If you 10× users, is your monthly cloud still under the ceiling (autoscaling + budgets prove it)? ([AWS Documentation](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-rightsizing.html?utm_source=chatgpt.com))
- **Security poke:** Can an unprivileged account access admin routes? Are secrets observable in logs? (If yes, stop: fix per OWASP.) ([OWASP Foundation](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/?utm_source=chatgpt.com))

---

## 17) Lightweight templates (copy into your repo)

**A. ADR template (Nygard style)** ([Cognitect.com](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions?utm_source=chatgpt.com))

```
# ADR-00X: <Decision>
Date: YYYY-MM-DD
Status: Proposed | Accepted | Superseded by ADR-00Y

## Context
<Forces, constraints, relevant data>

## Decision
<What we will do>

## Consequences
<Trade-offs, risks, follow-ups>

```

**B. Error‑budget policy (excerpt)** ([Google SRE](https://sre.google/workbook/error-budget-policy/?utm_source=chatgpt.com))

```
If the service exceeds its monthly error budget:
- Freeze non-P0 features until back within SLO.
- Prioritize reliability fixes from the postmortem.
- Only security fixes + P0 changes ship.

```

**C. Test checklist (PR template)**

```
- [ ] Unit tests cover new logic
- [ ] Contract/service tests updated
- [ ] E2E smoke passes in CI
- [ ] Telemetry: traces/spans + metrics + logs
- [ ] Security: input validation, authz, secrets absent from logs

```

**D. Security baseline (startup‑sized)**

```
- MFA on admin/users with elevated permissions (OWASP)
- No plaintext secrets; use <Secrets Manager> (OWASP)
- Passwords hashed with Argon2id/bcrypt; no reversible storage (OWASP)
- Session: HttpOnly + Secure + SameSite cookies; rotate on privilege change (OWASP)

```

([OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html?utm_source=chatgpt.com))

---

## 18) Notes on the numbers in your brief (and how to use them)

- **“Engineers lose ~42% to bad code/maintenance.”** The canonical Stripe/Harris “Developer Coefficient” study breaks this down as ~17.3 hours/week on maintenance and ~3.8 hours/week on “bad code,” with total work week ≈ 41.1 hours. Use their table rather than a single percentage when you present to leadership.
    - Example: 4 engineers × $120k × 3 years × 0.42 ≈ **$605k** of time lost. (Calculated.)
- **“13% utilization, 8× more servers than needed.”** Anecdotal but consistent with industry reports of **~27–28% cloud waste**; use FinOps guardrails from day one. ([learn.flexera.com](https://learn.flexera.com/flexera-business-value/1491301?utm_source=chatgpt.com))
- **“Auth vulns in 68%.”** Broken auth/session remains an OWASP Top‑10 risk; treat it as a first‑release blocker. ([OWASP Foundation](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/?utm_source=chatgpt.com))
- **“No automated tests in 91%.”** DORA’s multi‑year research shows teams with CI/CD and automation deliver more frequently with lower change‑failure rate; your policy in §8 is how to avoid “Russian roulette releases.” ([Dora](https://dora.dev/research/2022/dora-report/?utm_source=chatgpt.com))

---

# One‑page starter stack (opinionated, “boring” defaults)

- **Frontend:** React + Vite; CWV budget in CI (LCP ≤ 2.5 s). ([web.dev](https://web.dev/articles/lcp?utm_source=chatgpt.com))
- **Backend:** Node (TypeScript) + Fastify/Express; OpenAPI‑first.
- **DB:** Postgres 16, `pg_stat_statements` on; pgbouncer when needed; indexes per §4. ([PostgreSQL](https://www.postgresql.org/docs/current/indexes.html?utm_source=chatgpt.com))
- **Queue:** SQS/Redis‑based (pick one); idempotent handlers.
- **Infra:** Docker + IaC (Terraform); AWS ECS/Fargate or App Runner; S3 (+ lifecycle).
- **CI/CD:** GitHub Actions with matrix jobs; trunk‑based + feature flags (Unleash/Flagsmith). ([docs.getunleash.io](https://docs.getunleash.io/feature-flag-tutorials/use-cases/trunk-based-development?utm_source=chatgpt.com))
- **Observability:** OpenTelemetry SDK + a backend (Grafana/Tempo/Prometheus or any APM). ([OpenTelemetry](https://opentelemetry.io/docs/what-is-opentelemetry/?utm_source=chatgpt.com))
- **Security:** Managed IdP; OWASP cheat‑sheets as PR checklists; vault for secrets. ([OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html?utm_source=chatgpt.com))
- **Cost:** Budget alerts + rightsizing from day 1; monthly Well‑Architected check. ([AWS Documentation](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-rightsizing.html?utm_source=chatgpt.com))

---

### Final thought

Two quiet weeks on architecture, guardrails, and test/telemetry plumbing can save **18 months of thrash**. The evidence is clear: teams that practice **continuous delivery, trunk‑based development, and early automation** hit their goals faster *and* stay reliable. Don’t buy the speed vs. quality false trade‑off—use this PTRD to get both. ([Dora](https://dora.dev/research/2022/dora-report/?utm_source=chatgpt.com))
