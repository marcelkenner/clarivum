---
id: TSK-QA-002
title: Validate UV Widget Experience & Data Quality
status: backlog
area: qa
subarea: web-experience
owner: QA Lead
collaborators:
  - Frontend Engineer
  - Platform Engineer
effort: small
created_at: 2025-10-23
updated_at: 2025-10-23
links:
  - docs/PRDs/requierments/tools/widget_indeks_uv.md
  - docs/PRDs/requierments/homepage/feature-requirements.md
  - docs/adr/ADR-015-testing-strategy.md
  - docs/adr/ADR-022-tools-and-calculators-platform.md
context7:
  - /microsoft/playwright
  - /vitest-dev/vitest
tags:
  - qa
  - accessibility
  - monitoring
---

## Summary
Plan and execute automated + manual coverage for the UV widget, ensuring data accuracy (Open-Meteo vs cache), accessibility behaviors, consent flows, and analytics events meet the requirements before launch.

## Definition of Ready
- [ ] Test environments seeded with Strapi copy and feature flag enabled.
- [ ] Mocked Open-Meteo responses documented for deterministic tests.
- [ ] Analytics event schema and expected properties approved.
- [ ] Accessibility acceptance criteria reviewed with product/design.

## Definition of Done
- [ ] Playwright scenarios cover consent grant/deny, manual city selection, cache refresh, and API failure fallback.
- [ ] Automated assertions validate UV risk thresholds and CTA visibility.
- [ ] Axe accessibility scans and manual screen reader checks completed.
- [ ] Analytics events verified in staging with consent variations.
- [ ] QA report delivered with sign-off + follow-up issues logged in tracker.
