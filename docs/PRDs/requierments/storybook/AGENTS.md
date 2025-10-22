# docs/PRDs/requierments/storybook · AGENTS Guide

## Scope
- Defines Storybook as the living documentation workspace for Clarivum’s component library and interaction patterns.
- Ensures every shared component ships with stories, accessibility insights, and visual validation.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/components/feature-requirements.md`, `docs/PRDs/requierments/form-engine/feature-requirements.md`.
- Review Storybook and Chromatic guidance through Context7 when adjusting tooling or addons.

## Execution Guardrails
- Keep story organization mirrored with component responsibilities and vertical variants; avoid dumping unrelated examples.
- Require accessibility (addon-a11y) and controls documentation for each story; note any exclusions with rationale.
- Capture visual regression strategy and CI expectations—coordinate with testing stack PRD for shared tooling.
- Include links or embeds to design references (Figma) and note approval workflows for regulated messaging.

## Handoff Checklist
- Verify Storybook builds (local + CI) succeed and produce updated static artifacts; share preview URL with stakeholders.
- Update contributor guides when component categories or taxonomy shift.
- Communicate new stories or breaking changes to design, QA, and frontend teams to keep reviews aligned.
