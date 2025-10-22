# docs/PRDs/requierments/form-engine · AGENTS Guide

## Scope
- Specifies the shared React Hook Form + Zod engine driving diagnostics, newsletter, checkout, and account forms.
- Ensures validation, localization, and accessibility standards are enforced consistently.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/diagnostics/feature-requirements.md`, `docs/PRDs/requierments/login/feature-requirements.md`.
- Pull React Hook Form and Zod references via Context7 before changing core patterns or helpers.

## Execution Guardrails
- Keep schemas versioned and shared between client and server layers to avoid divergence; document breaking changes.
- Ensure component library integration (inputs, error messaging) remains consistent with accessibility guidance.
- Respect consent logging and persistence rules; coordinate with legal when introducing new required fields.
- Budget bundle size (<15 KB gzipped) and runtime targets (validation <150 ms) when adding dependencies.

## Handoff Checklist
- Update Storybook form examples and schema packages when new patterns ship.
- Verify analytics instrumentation for starts, errors, and completions in staging.
- Provide QA scripts covering localization, keyboard navigation, and persistence if multi-step flows change.
