# Cookie Consent Operations Runbook

## Scope & objectives
- Operate the Klaro!-based consent management platform defined in ADR-014.
- Ensure GDPR/ePrivacy compliance across locales by maintaining accurate consent categories, copy, and audit trails.
- Coordinate feature flag, analytics, and marketing integrations so they respect user preferences.

## Roles & tooling
- **Owner:** Privacy & Compliance Manager.
- **Engineering liaison:** Web platform engineer (Monthly rotation).
- **Legal reviewer:** Legal counsel responsible for policy wording changes.
- **Tooling:**
  - Klaro configuration (`config/klaro/config.json`).
  - Strapi entries for localized consent copy.
  - Supabase consent audit table (`consent_events`).
  - Flagsmith for consent trait propagation.
  - Playwright consent regression suite.

## Configuration lifecycle
1. **Change request intake:** Capture via Jira/Linear ticket outlining reason (legal update, new vendor, wording change).
2. **Update copy & localization:**
   - Edit Strapi `global.legal.klaro` components for each locale.
   - Ensure translations validated by native speakers.
3. **Adjust Klaro config:**
   - Modify `config/klaro/config.json` categories or services.
   - Map additional scripts to consent categories (e.g., new marketing pixel).
   - Commit changes to repo; trigger preview deploy for review.
4. **Sync Flagsmith traits:**
   - Update consent trait mappings in `ConsentPreferenceManager`.
   - Verify new categories propagate to feature flag rules.
5. **Review & approval:** Legal signs off wording; engineering validates behavior in the dev environment before merge.

## Pre-release QA checklist
- Run `npm run consent:test` (Playwright suite) to verify:
  - Banner displays on first visit.
  - Accept all and reject all flows toggle consent categories correctly.
  - Managing cookies via modal updates Flagsmith traits, supresses analytics scripts until opt-in.
- Inspect Klaro audit event in Supabase for recent test (ensure timestamp, categories, locale captured).
- Confirm accessibility: keyboard navigation, screen reader labels, focus trapping.
- Verify caching headers allow updates to propagate promptly (no stale copy).

## Production deployment steps
1. Merge configuration changes; deploy via standard pipeline.
2. Validate on production:
   - Clear cookies, load homepage; check banner copy and links to `/ustawienia-prywatnosci/`.
   - Accept analytics consent; confirm PostHog loads (check network requests).
   - Revoke consent via footer link; ensure analytics stops.
3. Log deployment summary in compliance register (date, changes, approving parties).

## Audit & reporting
- Supabase `consent_events` retention: minimum 24 months.
- Monthly export of consent stats (opt-in rates per category) for legal review.
- Document vendor mappings (service → provider → data processing agreement) in legal hub.
- Annual review: confirm Klaro version up-to-date; apply security patches promptly.

## Incident response
1. **Trigger conditions:** Banner not showing, consent not respected, audit logs missing, or regulatory request.
2. **Immediate actions:**
   - Enable fallback mode via feature flag (`cmp_banner_override`) to display static banner if Klaro fails.
   - Investigate recent deployments affecting consent scripts.
   - Audit Supabase logs for potential data loss.
3. **Remediation:**
   - Roll back Klaro config to last known good commit.
   - Patch integration causing consent bypass (e.g., third-party script loaded before consent).
4. **Communication:** Notify `#clarivum-leadership` and legal counsel with timeline and mitigation steps.
5. **Post-incident:** Update runbook if new guardrails required; add regression tests if gap identified.

## Change log
- **2025-10-23:** Initial runbook covering Klaro configuration, QA, deployment, and audit procedures.
