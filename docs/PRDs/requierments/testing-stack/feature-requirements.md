# Feature Requirements — Testing Stack (Vitest, Testing Library, Playwright)

> **Canonical decision:** `docs/adr/ADR-015-testing-strategy.md` defines the tooling and enforcement for this stack.

## Objective
- Establish an automated testing strategy using Vitest for unit/integration tests, Testing Library for React component behavior, and Playwright for end-to-end coverage of critical funnels.
- Provide confidence in rapid releases while enforcing Clarivum’s quality guardrails.

## Target Outcomes
- Business: prevent regressions in revenue-generating flows (diagnostics, ebooks, subscriptions) and reduce manual QA burden.
- Experience: keep test suites fast (unit suite ≤2 min, e2e nightly suite ≤15 min) to sustain trunk-based development.

## Primary Users & Segments
- Internal: engineering owning tests, QA guiding coverage, product reviewing acceptance criteria.
- Segmentation: test layers (unit, integration, component, e2e), vertical scenarios, authenticated vs anonymous states.

## Experience Principles
- Favor behavior-driven assertions focused on user outcomes rather than implementation details.
- Keep tests deterministic and isolated; leverage fixtures and network mocks responsibly.
- Document expected coverage per feature to avoid gaps (SRP-aligned test files).

## Functional Requirements
- FR1 — Configure Vitest with Next.js-compatible tooling (tsx, module aliases, environment polyfills).
- FR2 — Implement Testing Library utilities with custom render helpers that wrap providers (feature flags, analytics, theming).
- FR3 — Provide fixtures/mocks for common services (Strapi content, Supabase queries, Flagsmith flags).
- FR4 — Set up Playwright project with multi-browser (Chromium, Firefox, WebKit) support and environment switching (dev vs production smoke).
- FR5 — Integrate visual regression or screenshot comparisons for key marketing pages (optional backlog).
- FR6 — Wire tests into CI with required checks (unit tests on every PR, e2e nightly + pre-release gate).
- FR7 — Collect coverage reports (Vitest -> c8) and enforce thresholds (e.g., statements 80%, critical files 90%).

## Content & Data Inputs
- Test data builders referencing Strapi schemas, Supabase seeded datasets, and anonymized real-world scenarios.
- Accessibility checklists to convert into automated tests (Playwright Axe).
- KPI definitions driving synthetic tests (expected CTA conversions).

## Integrations & Dependencies
- Internal: frontend platform, component library, feature flags (mocking), analytics (disable in tests).
- External: CI runners (GitHub Actions), Playwright cloud services if needed for parallelism.

## Analytics & KPIs
- Track test flake rate, runtime trends, coverage per feature, and defects escaped to production.
- Monitor CI feedback time; keep <10 minutes for PR pipeline.

## Non-Functional Requirements
- Tests must run in headless mode by default; interactive debugging available locally.
- Keep snapshot usage minimal and reviewable; prefer semantic assertions.
- Provide ability to tag tests (smoke, regression, experimental) for selective execution.

## Compliance & Access Control
- Store secrets for authenticated tests in secure CI vault; rotate regularly.
- Ensure test data does not contain real PII; use synthetic fixtures.
- Document roles responsible for approving test changes impacting regulated copy.

## Launch Readiness Checklist
- Vitest + Testing Library configured with sample tests for core components.
- Playwright suite covering home → ebook checkout, diagnostic completion, and profile update flows.
- CI pipeline enforcing tests before merge; reporting integrated with GitHub Checks.
- Testing strategy shared in `docs/QA/testing-strategy.md` (to be created) with maintenance owners assigned.

## Open Questions & Assumptions
- Need to decide on visual regression tooling (Playwright trace viewer vs Chromatic).
- Determine budget for Playwright cloud parallel runs vs self-hosted workers.
- Assume we will adopt contract testing for APIs later; backlog item to evaluate Pact or similar.
