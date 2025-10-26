# src/components · AGENTS Guide

Holds shared React components that live outside a specific route group. Currently focused on the
Atrament documentation UI (see `documents/`), but keep this guidance general for future components.

- Prefer server components unless the UI truly needs client hooks/state. Co-locate client wrappers
  (e.g., `DocumentIndex`) with `use client` directives at the file top.
- All shared components must ship with a narrow, documented API; add prop JSDoc so routes can adopt
  them without guesswork.
- Cross-check each component against ADR-018 (brand) before introducing new typography or color
  tokens.
- Tests: `npm run lint:code -- src/components` and `npm run typecheck`. Add unit tests (Vitest + RTL)
  under `src/components/__tests__/` as soon as a component gains logic.
- Update this file when we introduce additional shared component families (forms, layout, etc.).\*\*\* End Patch
