# ADR-019: Frontend Application Platform
Date: 2025-10-24
Status: Accepted

## Context
- Clarivum’s customer experience lives in a Next.js 15 App Router application targeting Vercel edge/serverless runtimes.
- We must support modular verticals (Skin, Fuel, Habits), reusable view models/managers per the OOP-first mandate, and rapid content iteration fed by Strapi and Supabase.
- The platform needs predictable file conventions, dependency boundaries, styling tokens, and testing hooks so feature squads can ship without collisions.
- Prior spikes compared alternative stacks (Remix, Astro, plain React). The team already invested in Next.js App Router primitives, Tailwind 4 tokens, and React 19 concurrency.
- Product requirements are tracked in `docs/PRDs/requierments/frontend-platform/feature-requirements.md`; this ADR codifies the selected approach.

## Decision
- Use **Next.js 15 App Router** as the core UI framework.
  - Route groups segment verticals; server components host data loading with strict separation between view models, managers, coordinators.
  - Dynamic rendering (ISR + Route Handlers) pairs with Vercel Edge cache policy per ADR-006.
- Adopt **React 19** with Server Components and the latest concurrency features.
  - Client components isolate interactive surfaces; shared hooks live under `src/view-models/` with single responsibility.
- Standardize **Tailwind CSS 4** for styling:
  - Tokenize Clarivum brand foundations (ADR-018) via Tailwind config + CSS custom properties.
  - Enforce component-level utility usage with composition helpers rather than ad-hoc CSS files.
- Composition rules:
  - Each feature exposes a `ViewModel`, `Manager`, and optional `Coordinator` to respect modular design.
  - Shared utilities belong in `/src/shared/` packages consumed via dependency injection.
  - Avoid runtime cross-vertical imports; rely on explicit interfaces.
- Performance guardrails:
  - Leverage Next.js `optimizePackageImports` for heavy libraries (e.g., Phosphor icons per ADR-017).
  - Enforce 2 kB per-route JS budget before hydration; measure via Lighthouse CI.
- Tooling:
  - Storybook (ADR-027) documents components.
  - Vitest + Testing Library (ADR-015) cover view models and UI logic.
  - GitHub Actions (ADR-016) runs lint/type/test gates before merge.

## Diagrams
- [Architecture Overview](../diagrams/adr-019-frontend-platform/architecture-overview.mmd) — Route groups, ViewModels, Managers, Coordinators, and external services.
- [Data Lineage](../diagrams/adr-019-frontend-platform/data-lineage.mmd) — Relationships between view models, managers, shared utilities, and style tokens.
- [UML Platform Components](../diagrams/adr-019-frontend-platform/uml-components.mmd) — Core classes orchestrating data loading, business rules, theming, and caching.
- [BPMN Delivery Flow](../diagrams/adr-019-frontend-platform/bpmn-release.mmd) — Feature implementation pipeline from scaffold to monitoring.

## Consequences
- **Benefits:** Shared conventions for routing, styling, and composition accelerate delivery and align with the brand system. Next.js + Tailwind synergy keeps bundle size low.
- **Trade-offs:** Requires ongoing vigilance to prevent client bundle creep; Tailwind utility sprawl must be tamed via linting.
- **Follow-ups:**
  - Automate lint rules for banned CSS patterns and cross-vertical imports.
  - Publish a `frontend-platform` handbook under `docs/role-guides/frontend.md`.
  - Review performance budgets quarterly as new dependencies land.
