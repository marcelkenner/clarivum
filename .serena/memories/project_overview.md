# Clarivum project overview

- Purpose: Web experience for Clarivum built with Next.js App Router delivering marketing funnels, vertical experiences, and observability/automation guardrails tied to ADR/PRD docs.
- Tech stack: Node 20+, Next.js 15 (App Router, Turbopack), React 19, Tailwind CSS 4, TypeScript 5, Playwright, Vitest, Storybook, OpenTelemetry integrations, AWS deployment via ECS/Fargate with OpenNext bundling.
- Structure highlights: `src/app` for routes grouped by marketing/vertical experience, `src/components` for shared UI, `src/lib` for content, analytics, etc., `observability/` for OTEL scaffolding, `scripts/` for lint/task/metrics automation, `infra/` for AWS stacks, `docs/` for ADR/PRD/guardrails.
- Key documentation: `README.md`, global guardrails in `AGENTS.md`, architecture decisions under `docs/adr`, product PRD `docs/PRDs/first_steps.md`, runbooks in `docs/runbooks/`.
- Deployment flow: GitHub Actions validates via `npm run validate`, builds Next.js image, pushes to Amazon ECR, updates ECS behind CloudFront; requires observability env vars before deploy.
