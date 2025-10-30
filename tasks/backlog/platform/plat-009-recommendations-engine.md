---
id: TSK-PLAT-009
title: Launch Recommendations & Merchandising Engine
status: backlog
area: platform
subarea: personalization
owner: Personalization Lead
collaborators:
  - Data Engineer
  - Frontend Engineer
  - Marketing Partner
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/recommendations/feature-requirements.md
  - docs/adr/ADR-025-recommendations-and-merchandising.md
  - docs/runbooks/search-operations.md
context7:
  - /meilisearch/documentation
  - /plausible/docs
  - /websites/aws_amazon-amazonrds-aurorauserguide
tags:
  - recommendations
  - personalization
  - merchandising
---

## Summary
Build the service layer that combines Strapi curation, behavioral signals, and diagnostics outcomes to deliver personalized recommendations and affiliate merchandising across Clarivum surfaces.

## Definition of Ready
- [x] Data contracts confirmed: Strapi collections `recommendation_slot`, `merch_rule`, Plausible-derived signals, diagnostics persisted to `rec_diagnostics`.
- [x] Affiliate compliance defined: always render locale-specific disclosure with tracking params `utm_source=clarivum&utm_medium=affiliate&acs_id=<id>`.
- [x] Caching and edge strategy aligned: server Upstash cache 300–900 s, edge SWR 60 s, purge on catalog update webhook.
- [x] KPI/experimentation plan set: dashboards for CTR/RPM/attach rate with Flagsmith multivariate tests.

## Definition of Done
- [ ] Recommendation API/service deployed with deterministic fallbacks and feature flags.
- [ ] Affiliate tracking, coupon overlays, and Plausible analytics instrumentation operational.
- [ ] Dashboards & alerts configured for impression/click/conversion performance.
- [ ] Documentation updated (PRD links, runbooks, experimentation guide).
- [ ] Follow-up experiments and ML roadmap captured as tasks.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
