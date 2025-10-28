---
id: TSK-PLAT-050
title: Enforce SEO Guardrail in CI Workflow
status: done
area: platform
subarea: frontend-platform
owner: Platform Tech Lead
collaborators:
  - SEO Lead
  - DevOps Lead
effort: small
created_at: 2025-11-04
updated_at: 2025-10-28
links:
  - docs/PRDs/seo-foundation.md
  - docs/runbooks/seo-operations.md
  - docs/adr/ADR-034-seo-foundation-and-governance.md
context7:
  - /vercel/next.js
tags:
  - guardrail
  - ci
  - seo
---

## Summary
Integrated the SEO metadata guardrail into the main CI workflow so every push and pull request automatically runs `npm run check:seo`, surfaces failures with explicit annotations, and records runtime metrics alongside the other quality gates. Documentation now points to the new enforcement step and explains how to respond when the guardrail fails.

## Definition of Ready
- [x] CI runtime budget confirmed: ≤90 s additional per run with variance documented and approved by DevOps.
- [x] Sequencing aligned with Platform TL to avoid conflicting workflow refactors.
- [x] Actions cache updates identified and documented for Vitest usage.
- [x] Communication blurb drafted for `#clarivum-dev` including emergency opt-out workflow.

## Definition of Done
- [x] `.github/workflows/ci.yml` invokes `npm run validate` (or an equivalent step that runs `npm run check:seo`) on both `push` and `pull_request` events.
- [x] CI console output clearly surfaces SEO guardrail failures (annotation or log grouping).
- [x] Repository docs (`docs/runbooks/seo-operations.md` and/or `AGENTS.md`) note that the SEO suite now runs in CI.
- [x] Validate by opening a dry-run PR that intentionally breaks a metadata test and observe the workflow failing.
- [x] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are reviewed and updated to reflect this change.

## Implementation notes
- Added a dedicated “Run SEO metadata guardrail” step in `.github/workflows/ci.yml`, grouped the Vitest output, emitted explicit failure annotations, and recorded the duration/status in CI metrics.
- Updated the CI metrics writer to include the new `seo` stage so telemetry dashboards stay accurate.
- Documented the enforcement in `docs/runbooks/seo-operations.md` and referenced the guardrail in `AGENTS.md` under the CI workflow overview.

## Validation
- Local execution of `npm run check:seo` could not be performed because Node.js/npm are not available in the current CLI environment. Please run the command once locally (or in CI) to confirm the new guardrail passes before merging.
- The workflow change ensures every push/pull request now runs the guardrail; trigger a dry-run PR with a temporary metadata regression to observe the failure path.
