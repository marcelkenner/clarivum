# docs/PRDs/requierments/newsletter · AGENTS Guide

## Scope
- Governs newsletter capture, preference management, and lifecycle messaging requirements.
- Links onsite forms to marketing automation sequences, consent logging, and personalization signals.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/form-engine/feature-requirements.md`, `docs/PRDs/requierments/diagnostics/feature-requirements.md`, `docs/PRDs/requierments/legal/feature-requirements.md`.
- Review automation platform documentation via Context7 before committing to API usage or segmentation changes.

## Execution Guardrails
- Keep opt-in flows explicit and localized; double opt-in logic must satisfy regional rules and legal copy.
- Maintain data sync between marketing automation, profile service, and analytics; document failure handling.
- Coordinate incentive messaging (lead magnets, coupons) with respective PRDs to avoid conflicting offers.
- Ensure capture modules reuse component library patterns and maintain accessibility/performance targets.

## Handoff Checklist
- Validate consent logging end-to-end (form → automation → profile) in the dev environment.
- Update lifecycle playbooks and dashboards when adding segments or sequences.
- Notify support and marketing teams about preference center changes and deliver updated FAQs if flows shift.
