# PRDs · AGENTS Guide

Product Requirement Documents capture discovery and alignment before code begins. Handle files in `docs/PRDs/` with extra care.

## Editing principles

- Obtain explicit stakeholder approval (product + marketing) before material edits.
- Preserve localized language (Polish copy) as authored; consult stakeholders for changes.
- Cross-reference updates with the PTRD (`first_steps.md`) to keep scope, constraints, and outcomes aligned.
- For architectural implications, create or update ADRs and note the linkage in the PR description.
- If you cite libraries or frameworks, confirm statements via Context7 docs.

## Review checklist

- [ ] Rationale and scope remain accurate; no contradictions with other PRDs.
- [ ] CTAs, funnels, and sitemap references align with `clarivum_brand.md`.
- [ ] Any resulting engineering work has clear TODOs or tickets.
- [ ] Document version/date updated in the header if significant.

These documents are canonical—avoid speculative edits or premature implementation details.
