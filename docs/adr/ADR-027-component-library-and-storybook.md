# ADR-027: Component Library & Storybook Workbench
Date: 2025-10-24
Status: Accepted

## Context
- Clarivum must deliver a reusable component library aligned with the brand system (ADR-018) and icon strategy (ADR-017).
- The PRDs for components (`docs/PRDs/requierments/components/feature-requirements.md`) and Storybook (`docs/PRDs/requierments/storybook/feature-requirements.md`) call for a single source of truth for UI, accessibility, and documentation.
- Prior efforts risked duplicated components across verticals and unverified accessibility.

## Decision
- Centralize UI components in a **Component Library package** within the monorepo:
  - Components live under `src/components/<domain>/` with co-located stories and tests.
  - Enforce OOP-first patterns (`ViewModel`, `Manager`) per ADR-019.
  - Export primitives (Button, Card, FormField, IconButton) and composite layouts.
- Styling & tokens:
  - Rely on Tailwind 4 and CSS variables derived from ADR-018.
  - Icon usage sourced from ADR-017; no ad-hoc SVGs allowed without review.
- Documentation & QA:
  - Use **Storybook** as the canonical workbench.
    - Stories include accessibility notes, interaction states, and responsive variants.
    - Integrate Storybook a11y and Visual Regression (Chromatic or Playwright snapshots) as follow-up.
  - Connect Storybook to design tokens and docs via MDX pages.
- Governance:
  - Changes to components require design + accessibility review.
  - Linting ensures stories accompany components and tests exist (Vitest/Testing Library per ADR-015).
- Tooling:
  - Storybook deployed to Vercel; preview gating via CI (ADR-016).
  - Add addons for viewport, interactions, and docs.

## Consequences
- **Benefits:** Shared library accelerates feature work, avoids duplication, and keeps UI consistent with brand.
- **Trade-offs:** Requires process discipline; Storybook upkeep adds overhead.
- **Follow-ups:**
  - Implement automated coverage reports for story/test presence.
  - Add design token synchronization from Figma once available.
  - Evaluate visual regression tooling integration by Q1 2026.
