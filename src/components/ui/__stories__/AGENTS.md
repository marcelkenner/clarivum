# src/components/ui/**stories** · AGENTS Guide

# Storybook stories for UI primitives

- Author stories alongside components to keep the workbench current (see `docs/PRDs/requierments/storybook/feature-requirements.md`).
- Validate the static bundle with `npm run storybook:test` (invoked automatically via `npm run lint`) and review changes visually with `npm run storybook`.
- Import external libraries before relative component paths and place type-only imports last to satisfy the repo's ESLint ordering rules.
- Keep fixtures realistic by reusing marketing copy and analytics props defined in PRDs/ADRs so QA and design reviews mirror production behaviour.
