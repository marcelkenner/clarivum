---
id: TSK-SHARED-001
title: Consolidate Outstanding Clarivum Decisions
status: backlog
area: shared
subarea: strategy
owner: Product (TBD)
collaborators: []
effort: medium
created_at: 2025-10-21
updated_at: 2025-10-21
links: [docs/PRDs/first_steps.md, docs/PRDs/clarivum_brand.md, docs/PRDs/technology-stack-catalog.md, docs/adr/ADR-005-feature-flags.md]
context7: [/vercel/next.js, /supabase/supabase]
tags: [decision-log, governance, roadmap]
---

## Summary
Collect every open question surfaced across the Clarivum PRDs, requirements, ADRs, and tooling plans into a single decision backlog, assign accountable owners, and define when and how each choice will be closed so delivery teams can execute confidently.

## Definition of Ready
- [ ] Stakeholders for each decision cluster (Product, Engineering, Marketing, Legal, Growth, Ops) are identified and invited.
- [ ] Latest PRDs, ADRs, and requirements files reviewed to verify the decision list is current.
- [ ] Dependencies on external vendors or budget approvals flagged for finance/leadership awareness.

## Definition of Done
- [ ] Decision backlog documented (e.g., worksheet or Notion) with owners, due dates, and next steps per item.
- [ ] Outcomes logged in corresponding artifacts (requirements docs, ADR updates, runbooks) or follow-up tasks created.
- [ ] Communication sent to stakeholders summarizing resolved items and highlighting any escalations or blockers.

## Notes
### Platform & Engineering Decisions
- Frontend localization framework (next-intl vs custom), browser polyfill strategy, and Edge Middleware personalization timeline. *(frontend-platform requirements)*
- Supabase migration tooling choice (Drizzle vs SQL scripts), analytics warehousing destination (Supabase vs BigQuery), and potential adoption of Supabase Edge Functions. *(supabase-platform requirements)*
- Strapi deployment model (**resolved**: self-managed on AWS per `ADR-010`), localization tooling plan, and taxonomy ownership across content domains. *(strapi requirements)*
- Observability hosting (Grafana Cloud vs self-managed collectors), distributed tracing coverage for edge functions, and overlap boundaries between Grafana telemetry and Plausible analytics. *(observability requirements)*
- Feature flag operations: marketing self-serve segmentation, experimentation readouts (Flagsmith vs Plausible), and edge SDK readiness. *(feature-flags requirements)*
- Form engine localization model, need for heightened consent workflows (HIPAA-like), and mobile app reuse expectations. *(form-engine requirements)*
- Testing stack choices: visual regression tooling, Playwright infrastructure budget/parallelisation, and contract testing introduction (e.g., Pact). *(testing-stack requirements)*
- Storybook hosting (Chromatic vs Vercel), cadence for design QA reviews, and roadmap for documenting copy snippets. *(storybook requirements)*
- Security roadmap: target compliance framework (ISO 27001 vs SOC 2), ownership model (internal champion vs partner), and final observability tooling alignment. *(security requirements)*
- Authentication roadmap confirmations: validate Auth0 SaaS adoption details per ADR-002, define passkey rollout timeline, and ensure mobile/API contract requirements are captured. *(login requirements & ADR-002)*

### Product & Experience Decisions
- Homepage strategy: primary hero CTA (ebook vs diagnostic), localization toggle needs, and testimonial consent verification. *(homepage requirements)*
- Diagnostics placement (standalone vs embedded), CRM integration method (webhook vs batch), and component reuse validation. *(diagnostics requirements)*
- Tools backlog: MVP tool list per vertical, external API licensing (e.g., UV index), and whether shared components cover all planned interactions. *(tools requirements)*
- Newsletter program: marketing automation platform selection, multilingual content plan, and cross-promo module guidelines. *(newsletter requirements)*
- Recommendations governance: re-review cadence & owners, decision on user-generated reviews, and automating affiliate performance data ingestion. *(recommendations requirements)*
- Ebooks strategy: DRM/watermark approach, localization roadmap, and reuse of shared checkout flow across future digital products. *(ebooks requirements)*
- Subscriptions model: trial policy and upgrade incentives, corporate/team plan roadmap, and technical plan for blending subscription checkout with existing ecommerce flows. *(subscriptions requirements)*
- Profile experience: navigation paradigm (tabs vs sidebar), messaging channel strategy (in-app vs email), and mobile API evolution plan. *(profile requirements)*
- Coupons delivery: SSR vs client-side filtering for SEO and UX, partner conversion feedback integration, and taxonomy alignment with recommendations. *(coupons requirements)*
- Component library decisions: motion library adoption, packaging strategy (internal package vs workspace module), and icon asset delivery timeline. *(components requirements)*
- Analytics deployment: Plausible hosting/proxy model, warehouse sync cadence, and diagnostics segmentation contract. *(analytics requirements)*
- Legal/compliance roadmap: confirm additional regulatory scopes (HIPAA or similar), decide on feature flag hooks for regional messaging, and define legal archive storage location. *(legal requirements)*
