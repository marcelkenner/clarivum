# docs/PRDs/requierments/frontend-platform · AGENTS Guide

## Scope
- Documents the foundational Next.js, React, Tailwind, and TypeScript platform decisions that power Clarivum.
- Drives routing, theming, performance budgets, and shared utilities leveraged by every feature PRD.

## Must Read
- `feature-requirements.md`, ADRs covering architecture decisions, and `docs/PRDs/clarivum_brand.md` for sitemap mapping.
- Reference Next.js, React, and Tailwind documentation via Context7 when reconsidering framework features.

## Execution Guardrails
- Preserve App Router conventions (route groups, layouts, metadata) that align with the IA; note deviations explicitly.
- Enforce strict TypeScript and ESLint policies; log any required exceptions with rationale and expiry.
- Keep Core Web Vitals and bundle budgets visible in requirements; coordinate with observability when adjusting targets.
- Ensure dependency injections (analytics, flags, localization) remain composable; avoid singletons baked into platform code.

## Handoff Checklist
- Update developer documentation (`docs/architecture.md`, `docs/role-guides/frontend.md` if changed) when platform patterns evolve.
- Validate performance assumptions with lab data or Web Vitals reports before sign-off.
- Notify downstream PRD owners when routing, theming, or provider contracts change.
