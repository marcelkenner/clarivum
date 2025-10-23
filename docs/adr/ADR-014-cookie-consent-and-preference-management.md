# ADR-014: Cookie Consent & Preference Management Platform
Date: 2025-10-23
Status: Proposed

## Context
- Clarivum must comply with EU GDPR, ePrivacy Directive, and Polish national requirements by collecting explicit consent before setting non-essential cookies or triggering marketing analytics (per legal PRD requirements).
- The experience must provide multilingual disclosures, granular categories (essential, analytics, marketing, functional), audit logging for regulators, and a “manage cookies” interface accessible from the footer and legal hub.
- Next.js 15 + Vercel edge runtime constraints mean the solution must load asynchronously, avoid blocking rendering, and expose hooks so feature flags/analytics respect consent state.
- Building a bespoke Consent Management Platform (CMP) would require significant engineering and legal effort (consent state storage, proof of consent, geo-targeted behavior, accessibility), increasing compliance risk.

## Decision
- Adopt **Klaro!** (AGPL-3.0) as the consent management platform.
  - Self-host the loader script and configuration JSON within Clarivum’s assets to keep data inside EU infrastructure.
  - Configure consent categories (`essential`, `analytics`, `marketing`, `personalization`) mapped to Flagsmith traits so services (PostHog, Sonner notifications, marketing pixels) respect user preferences.
  - Localize consent copy via Strapi-managed strings and Klaro’s translation hooks (Polish + English initial rollout).
  - Persist consent decisions in browser storage (Klaro default) and emit a server-side event (`consent.updated`) for audit logs stored in Supabase.
  - Expose a global “Manage cookies” entry point via Klaro’s modal API, anchored in the footer and legal pages.
- Integrate Klaro initialization into the Next.js client entry point with lazy loading; default to blocking non-essential scripts until Klaro resolves consent.

## Consequences
- **Benefits:** Mature OSS CMP with configurable UI, GDPR-compliant workflows, and minimal engineering lift versus bespoke build.
- **Trade-offs:** AGPL license obligates sharing modifications if distributed; mitigate by isolating Klaro customization to configuration and CSS overrides. If deeper code changes are required, coordinate with legal for compliance.
- **Operational impacts:** Need to maintain Klaro configuration alongside legal policy updates; add to runbook for audits and localization.
- **Follow-ups:**
  - Create `docs/runbooks/cookie-consent-operations.md` to cover configuration changes, testing, and audit procedures.
  - Add Klaro to the technology stack catalog and ensure CI verifies consent scripts load correctly in staging.
  - Plan automated tests verifying consent enforcement (analytics disabled until opt-in, revoke updates Flagsmith traits).
