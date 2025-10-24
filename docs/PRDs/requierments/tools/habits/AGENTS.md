# docs/PRDs/requierments/tools/habits · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
## Scope
- Habit, sleep, stress, and environment tools underpinning `/habits/` funnels and retention loops.
- Defines behavioural science framing, measurement protocols, and guardrails before UI or engineering begins.

## Must Read
- `docs/PRDs/clarivum_brand.md` (Habits pillar vision), `docs/PRDs/requierments/tools/feature-requirements.md`, `docs/runbooks/tools-platform-operations.md`.
- Behavioural health compliance policies (`docs/policies/behavioral-health.md`) — check for updates when touching sleep/stress assessments.

## Execution Guardrails
- Align scoring methods with validated surveys or peer-reviewed research; cite sources explicitly.
- Separate measurement logic (Managers) from presentation (ViewModels); support localization and accessibility from day one.
- Respect privacy: many inputs relate to health; enforce consent and retention policies per profile guidelines.

## Handoff Checklist
- Secure behavioural science + legal sign-off for any assessments or recommendations.
- Confirm analytics events with data team; document schema updates.
- Provide support documentation (FAQs, troubleshooting) for new tools before grooming tickets.
