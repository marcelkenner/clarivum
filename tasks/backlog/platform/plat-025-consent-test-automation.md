---
id: TSK-PLAT-025
title: Automate Consent Enforcement Tests
status: backlog
area: platform
subarea: privacy
owner: QA Lead
collaborators:
  - Platform Engineer
  - Analytics Lead
effort: small
created_at: 2025-10-26
updated_at: 2025-10-26
links:
  - docs/adr/ADR-014-cookie-consent-and-preference-management.md
  - docs/PRDs/requierments/legal/feature-requirements.md
  - docs/runbooks/cookie-consent-operations.md
context7:
  - /klaro-org/klaro
  - /vercel/next.js
  - /playwright/test
tags:
  - privacy
  - automation
  - analytics
---

## Summary
Implement automated checks that verify Klaro consent states block non-essential analytics until opt-in, update Flagsmith traits on change, and ensure the consent script loads successfully in CI.

## Definition of Ready
- [ ] Klaro configuration finalized for essential/analytics/marketing buckets.
- [ ] Flagsmith trait mapping for consent states documented.
- [ ] Playwright environment variables for consent tests available.

## Definition of Done
- [ ] Playwright (or equivalent) tests simulate consent accept/deny flows and confirm analytics scripts behavior.
- [ ] Flagsmith trait updates asserted and logged in tests.
- [ ] CI pipeline step fails when consent script fails to load or tests regress.
- [ ] Results documented in `docs/runbooks/cookie-consent-operations.md` and shared with QA/analytics.
