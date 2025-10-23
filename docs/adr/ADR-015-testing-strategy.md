# ADR-015: Testing Strategy & Tooling
Date: 2025-10-24
Status: Accepted

## Context
- Clarivum’s quality guardrails (PTRD Section 8, repository governance policy) require automated evidence before any change merges to `main`.
- The codebase spans Next.js App Router server components, client interactions, shared TypeScript utilities, and serverless jobs that must stay reliable as squads scale.
- Feature flags drive frequent experiments; we need fast feedback on component-level changes plus guardrails on full-funnel behaviour.
- Previous experience shows that ad-hoc tool choices create duplicated setup costs and brittle pipelines.
- Product requirements are documented in `docs/PRDs/requierments/testing-stack/feature-requirements.md`; this ADR operationalizes those expectations.

## Decision
- Adopt a layered testing approach:
  - **Unit & integration:** use **Vitest** with React Testing Library wrappers for component logic and shared TypeScript modules. Co-locate tests under `__tests__` directories to keep files ≤200 lines and maintain single-responsibility view models/managers.
  - **End-to-end smoke:** use **Playwright** for critical flows (home → vertical CTA, diagnostics, subscriptions) executed on preview and staging builds.
  - **Accessibility & performance spot checks:** reuse Playwright traces with axe scans and Lighthouse scripted runs; extend coverage incrementally via follow-up tasks.
- Integrate both Vitest and Playwright into GitHub Actions CI:
  - Pull requests must pass `npm run test` (Vitest) and `npm run test:e2e -- --project smoke` on preview deployments.
  - Failures block merges via branch protection rules described in `docs/policies/repository-governance.md`.
- Standardize configuration:
  - Provide shared helpers under `tests/config/` for environment setup, feature-flag seeding, and Supabase fixtures.
  - Capture secrets via GitHub Actions OIDC + Vercel/Supabase integration; local runs rely on `.env.test`.
- Documentation requirements:
  - Keep role guides (`frontend`, `backend`, `qa`) aligned with this stack.
  - Update runbooks when adding new suites or modifying triggers; note references in tasks per the work-intake policy.

## Consequences
- **Benefits:** Consistent tooling across squads, faster feedback loops, and deterministic smoke coverage tied to product funnels.
- **Trade-offs:** CI runtime increases; mitigate with test parallelism and selective Playwright suites for smoke vs. regression.
- **Follow-ups:**
  - Add visual regression tooling evaluation once the design system stabilizes.
  - Explore contract testing for Supabase/Strapi APIs after initial launch.
  - Monitor CI duration and flake rate; adjust sampling or retry strategies as we scale.
