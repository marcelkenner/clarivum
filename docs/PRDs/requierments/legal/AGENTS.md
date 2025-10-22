# docs/PRDs/requierments/legal · AGENTS Guide

## Scope
- Centralizes legal, compliance, and disclosure requirements spanning policies, inline notices, and DSAR workflows.
- Guides how legal content integrates with marketing features (ebooks, recommendations, coupons, diagnostics).

## Must Read
- `feature-requirements.md`, `docs/policies/error-budget-policy.md`, and relevant ADRs for compliance surface changes.
- Sync with marketing/legal leads before editing policy summaries or disclosure patterns.

## Execution Guardrails
- Keep policy hierarchy (`/legal/` hub, subpages, disclosures) explicit; update navigation requirements when adding new documents.
- Track effective dates, version history, and localization needs; never overwrite previous policy versions without archiving.
- Ensure inline disclosures remain composable components used by dependent PRDs; document contexts requiring them.
- Respect consent and DSAR flows defined in auth/profile requirements; flag any new data collection for review.

## Handoff Checklist
- Confirm legal approval for every substantive change; record approvers and dates in the requirement or linked runbook.
- Update support and operations runbooks if DSAR workflows or contact channels change.
- Notify dependent feature owners when disclosure copy or requirements shift to avoid inconsistent messaging.
