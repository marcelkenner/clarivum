This repository hosts the Clarivum web experience (Next.js App Router, React 19, Tailwind CSS 4, TypeScript 5). It is preconfigured with governance, documentation, and tooling captured in `AGENTS.md`, the PTRD (`docs/PRDs/first_steps.md`), and the ADR set (`docs/adr/`).

## Current status (2025-10-27)

- **Marketing experience:** The App Router home funnel is live under `src/app/(marketing)` with coordinator/view-model plumbing, newsletter segmentation banner, and the multi-step hero wizard that generates 14-day plans per pillar. Three verticals (Skin, Fuel, Habits) derive their CTAs from `src/lib/content-map.ts` while analytics events flow through the interim Plausible dispatcher in `src/lib/analytics/dispatch.ts`.
- **Observability:** OpenTelemetry scaffolding (`instrumentation*.ts`, `observability/`) is checked in; set the OTLP credentials described in `docs/runbooks/observability-operations.md` before deploying to capture spans/metrics.
- **Testing & QA:** Vitest + Testing Library cover the home/coordinator/content-library flows (≈15.5 % statements today). `scripts/write-coverage-metrics.mjs` emits `metrics/coverage.json`, and the Playwright smoke suite (`PLAYWRIGHT_BASE_URL=http://127.0.0.1:3310 npm run test:e2e:smoke`) validates the hero CTA while writing `metrics/quality.json` for dashboards.
- **Automation:** `.github/workflows/ci.yml` runs `npm run validate`, Vitest coverage, metrics export, and the Playwright smoke project. All runs upload `qa-metrics`, `vitest-coverage`, `playwright-report`, and `ci-metrics` artifacts per ADR-015.
- **Outstanding work:** Finish the Strapi hookup (`src/app/_vertical-experience`), apply the Supabase tenancy stack in `infra/supabase` with real credentials, raise coverage toward the ≥80 % goal, and continue populating Kaizen guardrails (see `tasks/ready/**`).

## Local development

Install dependencies (Node ≥ 20.11):

```bash
npm install
```

Common scripts:

| Purpose                | Command                                                            | Notes                                                                              |
| ---------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Start dev server       | `npm run dev`                                                      | Uses Turbopack; hot reload enabled.                                                |
| Build production       | `npm run build`                                                    | Generates the production bundle (Turbopack).                                       |
| Run quality gate       | `npm run validate`                                                 | Executes lint (tasks + code), typecheck, and Prettier format check.                |
| Lint tasks only        | `npm run lint:tasks`                                               | Validates task board metadata/schema.                                              |
| Lint code only         | `npm run lint:code`                                                | ESLint with zero warnings allowed.                                                 |
| Type-check only        | `npm run typecheck`                                                | Uses `tsconfig.json` strict settings.                                              |
| Auto-format source     | `npm run format`                                                   | Runs Prettier respecting `.prettierignore`.                                        |
| Refresh AGENTS docs    | `npm run ensure:agents`                                            | Regenerates directory-specific agent guidance files.                               |
| Task status digest     | `npm run tasks:summary`                                            | Rebuilds `tasks/status-summary.md`.                                                |
| Update coverage metric | `npm run test:coverage && npm run metrics:coverage`                | Produces `coverage/` HTML + refreshes `metrics/coverage.json` for dashboards.      |
| Smoke test + QA metric | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3310 npm run test:e2e:smoke` | Requires a running dev server on the same base URL; writes `metrics/quality.json`. |
| Stale flag audit       | `npm run flags:stale`                                              | Requires Flagsmith Admin API creds; posts Slack + GitHub alerts when configured.   |

CI relies on `npm run validate`; ensure it passes before pushing. Task changes alone still require `npm run lint:tasks`.

> **Note:** Playwright suites target whichever host is provided via `PLAYWRIGHT_BASE_URL`. Use `npm run dev -- --hostname 127.0.0.1 --port 3310` (or a deployed preview) before running the smoke suite locally so the QA metrics reporter embeds the correct URL in `metrics/quality.json`.

## Observability baseline

- The Next.js runtime auto-loads `instrumentation.ts` / `instrumentation.node.ts` to bootstrap OpenTelemetry (ADR-004). Do not import `@opentelemetry/*` ad hoc—extend the helpers in `observability/`.
- Browser spans flow through `POST /api/observability/v1/traces`, which relays payloads to Grafana Cloud using server-side credentials. Keep this proxy route lightweight; client code must only hit `/api/observability/...`.
- Dashboards and alert definitions live under `docs/observability/`. Import `dashboards/baseline.json` and `alerts/baseline.yaml` into Grafana Cloud whenever telemetry labels change, and update the runbook to match.
- Required env vars: `GRAFANA_OTLP_USERNAME`/`GRAFANA_OTLP_PASSWORD` (or `GRAFANA_OTLP_BASIC_AUTH`), `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_TRACE_RATIO`, `NEXT_PUBLIC_OTEL_PROXY_URL`, and `OBSERVABILITY_DEPLOYMENT_SECRET`. Set them per environment before deploying and share the deployment secret with Strapi CI via `STRAPI_DEPLOYMENT_WEBHOOK_TOKEN`.

## Documentation map

- Project guardrails: `AGENTS.md`, `docs/PRDs/first_steps.md`, `docs/architecture.md`.
- Architecture decisions: `docs/adr/ADR-00x-*.md`.
- Policy references: `docs/policies/`.
- Role and workflow guides: `docs/role-guides/`.
- Task board: `tasks/` (see `tasks/README.md` + lane-specific `AGENTS.md` guides).
- Homepage SEO/metadata hand-off: `docs/runbooks/seo-homepage-metadata-kickoff.md`.
- Atrament document viewer: visit `/library` locally to search/browse every PRD, ADR, task lane, and Sisu note with consistent Atrament typography. In production these routes return 404 unless you set `INTERNAL_DOCS_ALLOW=true`; keep technical/business docs internal by default.

## App Router information architecture

- Route groups live in `src/app/(marketing)` for public funnels and `src/app/[vertical]/[category]/[slug]` for Skin/Fuel/Habits hubs. Entry points should stay under 200 lines and only pass serialized ViewModels into view components.
- Shared logic sits in `src/app/_vertical-experience/{manager,coordinator,viewmodel,view}`. Pages must construct a coordinator via `createVerticalExperienceCoordinator()` and call the appropriate builder (`buildVerticalHub`, `buildCategoryHub`, `buildArticle`).
- Metadata/sitemap/RSS surfaces (`src/app/layout.tsx`, `src/app/sitemap*.ts`, `src/app/robots.ts`, `src/app/rss/route.ts`) share the same content map. Whenever the content taxonomy changes, update `src/lib/content-map.ts` and run `npm run validate` to keep type usage in sync.
- When adding routes, update the nearest `AGENTS.md`, note the sitemap or robots impact, and capture follow-up work in the relevant task lane. Use `npm run lint:code -- src/app/<segment>` while iterating so CI stays green.

Consult these artifacts before altering stack choices. Update or add new ADRs and PRD appendices when decisions change.

## Deployment

Vercel deploys automatically from protected branches. GitHub Actions enforces lint, type-check, tests (once available), and formatting before merges. See `docs/runbooks/deployment.md` and `docs/policies/repository-governance.md` for the detailed promotion and rollback process.

## Support

- Resolve framework/library questions via Context7 (see `AGENTS.md`).
- Keep files under 500 lines as mandated in `AGENTS.md`.
- For new directories, run `npm run ensure:agents` and customize the generated guide.
