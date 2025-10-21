# Clarivum Pre-Code Readiness Plan (A–Z)

> Sources consolidated: `first_configuration.md`, `first_steps.md`, the populated `clarivum_brand.md`, `brand_design_system.md`, and Next.js App Router sitemap guidance retrieved via Context7 (`/vercel/next.js`, topic “app router sitemap planning”).

The goal is to settle every critical decision, artifact, and workflow before a single line of production code is written. Treat each section as a blocking checklist; do not move forward until every item is complete and explicitly signed off.

---

## A. Align on Brand Narrative
**Goal:** lock down the story, tone, and promises Clarivum makes across web, content, and product.
- Decisions to lock:
  - Confirm the brand architecture and messaging now captured in `clarivum_brand.md` (Skin/Fuel/Habits pillars, taglines, CTA slots) and decide on any remaining voice or differentiation gaps.
  - Finalize visual language (colors, typography, imagery rules) and narrative guardrails for design hand-off.
- Actions before coding:
  - Review and sign off the updated `clarivum_brand.md`, annotating any open questions directly in the file.
  - Cross-check that `brand_design_system.md` implements the same pillars, color policy, and CTA structure; resolve discrepancies across the two documents.
  - Capture stakeholder approvals (marketing, founders) and store a link to the meeting notes or sign-off record beneath Section A.

## B. Business Outcomes & Success Metrics
**Goal:** define the two leading business KPIs and two user-experience outcomes the launch must hit.
- Decisions to lock:
  - Business north-star metrics (e.g., qualified leads, conversions) with baseline and targets.
  - Experience metrics (e.g., p95 LCP ≤ 2.5 s, support ticket rate) plus owners.
- Actions before coding:
  - Complete Section 1.1 of `first_steps.md` with quantified goals.
  - Draft an OKR or scorecard and agree on measurement cadence with leadership.

## C. Customer & Audience Insights
**Goal:** ground all flows in real audience needs and jobs-to-be-done.
- Decisions to lock:
  - Primary personas per vertical (Skin, Fuel, Habits) and their top problems.
- Actions before coding:
  - Summarize existing research/analytics in a shared doc.
  - Capture the core user → job → outcome line in the PTRD executive summary.

## D. Discovery Scope & Constraints
**Goal:** clarify boundaries before engineering commits to scope.
- Decisions to lock:
  - Regulatory, data residency, accessibility, and localization requirements.
  - Budget ceilings (infrastructure, tooling, headcount) and hiring constraints.
- Actions before coding:
  - Fill Section 1.2 of `first_steps.md`.
  - Record sign-off from legal/finance on compliance and budget guardrails.

## E. Experience Guardrails (NFRs)
**Goal:** make non-functional requirements explicit and measurable.
- Decisions to lock:
  - Reliability, performance, security, and cost SLOs with error budgets.
- Actions before coding:
  - Populate Section 2 of `first_steps.md` with the concrete numbers and monitoring owners.
  - Draft an error-budget policy (template in `first_steps.md`) and circulate for approval.

## F. Financial & Cost Strategy
**Goal:** avoid cloud overspend and tool sprawl from day one.
- Decisions to lock:
  - Monthly/annual infra budget, alerting thresholds, and FinOps cadence.
  - Pricing tiers for any third-party services and CDN usage.
- Actions before coding:
  - Build a cost model for the launch scope (traffic tiers, storage, bandwidth).
  - Define who reviews spend (finance or engineering lead) and how often.

## G. Governance & Architecture Decision Records
**Goal:** institutionalize decision tracking.
- Decisions to lock:
  - ADR process owner, review cadence, and storage location (`/doc/adr`).
  - Initial ADRs for DB, auth, queues, observability, feature flags (see Section 3 of `first_steps.md`).
- Actions before coding:
  - Create the `/doc/adr` directory and add ADR templates (see §17.A in `first_steps.md`).
  - Schedule the first ADR review meeting and assign authors.

## H. Hosting & Infrastructure Strategy
**Goal:** pick cloud/hosting defaults and deployment topology.
- Decisions to lock:
  - Primary cloud provider, region(s), and baseline environment topology (preview, staging, prod).
  - Static vs. dynamic rendering strategy in Next.js (ISR windows, edge usage).
- Actions before coding:
  - Document choices in ADR-001 (primary DB & cloud) and ADR-004 (observability stack).
  - Outline IaC plan (Terraform or equivalent) and ownership.

## I. Information Architecture & Routing
**Goal:** finalize sitemap, route groups, and redirects.
- Decisions to lock:
  - Route hierarchy per `first_configuration.md` and the refined sitemap already mapped in `clarivum_brand.md` (global hub, vertical hubs, diagnostic flows).
  - Legacy redirect matrix for old blog paths.
- Actions before coding:
  - Convert the sitemap in `clarivum_brand.md` into a signed-off IA diagram and content inventory.
  - Approve the redirect list and add it to the planned `next.config.ts` `redirects()` config.

## J. Journey Mapping & Content Flows
**Goal:** map navigation, CTAs, and funnels end-to-end.
- Decisions to lock:
  - Primary CTA destinations (ebooks, tools) per category, using the funnels and pillar taxonomies described in `clarivum_brand.md`.
- Actions before coding:
  - Draft the `content-map` structure in a spreadsheet (or `lib/content-map.ts` draft) that reflects the CTA mappings from `clarivum_brand.md`, then review with stakeholders.
  - Identify content gaps (missing posts, ebooks) and assign owners.

## K. Knowledge Base & Repository Hygiene
**Goal:** ensure all prework lives in source control or the shared KB.
- Decisions to lock:
  - Documentation taxonomy (PTRD, ADRs, runbooks) and storage (e.g., `/docs`).
- Actions before coding:
  - Create README pointers to PTRD, ADR index, and operational policies.
  - Define versioning strategy for documentation updates (PR template, reviewers).

## L. Legal, Privacy & Compliance
**Goal:** prevent post-launch compliance blockers.
- Decisions to lock:
  - GDPR/CCPA obligations, consent mechanism, data retention policies.
- Actions before coding:
  - Collect legal sign-off on privacy policy drafts and cookie banners.
  - Decide where legal pages will live in the sitemap (see pages list in `first_configuration.md`).

## M. Monitoring & Observability
**Goal:** design telemetry before code exists.
- Decisions to lock:
  - Observability stack (OpenTelemetry + chosen backend) and data retention.
- Actions before coding:
  - Document required traces, metrics, and logs for each user journey.
  - Capture runbook expectations (Section 10 of `first_steps.md`) and alert routing.

## N. Naming, Taxonomy & Data Model
**Goal:** avoid churn in category names, slugs, and schema.
- Decisions to lock:
  - Category and post slug conventions per vertical.
  - Database schema v0 (if applicable) and migration policy.
- Actions before coding:
  - Finalize the taxonomy table used by `lib/content-map.ts`.
  - Draft Schema ERD and indexing plan (Section 4 of `first_steps.md`).

## O. Operational Processes & Delivery Model
**Goal:** choose how the team ships.
- Decisions to lock:
  - Trunk-based workflow with feature flags (ADR-005) vs. alternatives.
  - Definition of done, PR review SLAs, and release cadence.
- Actions before coding:
  - Finalize the PR template (Section 17.C of `first_steps.md`) and add to repo.
  - Align on sprint/iteration ceremonies and RACI for approvals.

## P. People & Capability Plan
**Goal:** confirm the team can execute the plan.
- Decisions to lock:
  - Required roles (engineering, design, DevOps, analytics) and hiring gaps.
- Actions before coding:
  - Draft onboarding checklists for each role.
  - Ensure single points of contact are named for each section of this document.

## Q. Quality Assurance & Testing Strategy
**Goal:** ensure test coverage expectations are explicit.
- Decisions to lock:
  - Test pyramid requirements (unit, integration, E2E) and automation tooling.
  - CI gate criteria (e.g., required checks for merge).
- Actions before coding:
  - Populate Section 8 of `first_steps.md` with testing policy and tooling decisions.
  - Adapt the furnished test checklist (Section 17.C) into the PR template.

## R. Risk Management & Security Baseline
**Goal:** mitigate security/privacy risks upfront.
- Decisions to lock:
  - AuthN/AuthZ model (ADR-002), session policy, MFA requirements.
  - Secrets management approach and incident response process.
- Actions before coding:
  - Complete Section 9 (Security) of the PTRD with OWASP controls and audit cadence.
  - Draft initial threat model covering the marketing site and gated assets.

## S. SEO, Metadata & Discoverability
**Goal:** plan technical SEO artifacts.
- Decisions to lock:
  - Sitemap strategy (index + per-vertical sitemaps) and update cadence, aligning with the sitemap definitions in `clarivum_brand.md`.
  - Canonical URL policy and structured data usage.
- Actions before coding:
  - Finalize the sitemap route plan from `first_configuration.md` and map it to Next.js metadata files. Context7 documentation confirms `app/sitemap.ts` (or per-route handlers) can return dynamic entries before implementation.
  - Draft robots.txt and canonical tag rules for review.

## T. Tooling & Local Environment
**Goal:** standardize local dev setup.
- Decisions to lock:
  - Node/TypeScript versions, package manager (npm per starter), linting/formatting policies.
- Actions before coding:
  - Document environment bootstrap steps (matching Section 0 & 1 of `first_configuration.md`).
  - Provide a `setup.sh` or README instructions tested on clean machines.

## U. UX/UI System & Design Tokens
**Goal:** translate the codified brand system into reusable UI foundations.
- Decisions to lock:
  - Confirm adoption of the rules, tokens, and component specs documented in `brand_design_system.md` (grid, typography scale, Jade primary + pillar accent palette) and identify any gaps needing clarification for engineering.
  - Select component tooling (Figma libraries, Storybook, tailwind tokens, etc.) and accessibility standards that enforce those rules.
- Actions before coding:
  - Review `brand_design_system.md` with design + engineering, annotating required implementation notes (CSS variables, design token generation) directly in the file.
  - Export final component specs and token definitions from the design library so engineers can wire them into the chosen frontend tooling before development starts.
  - Run automated contrast tests on the Jade + accent palette (AA thresholds) and document the tooling/workflow that will enforce these checks in CI.

## V. Vendor & Integration Strategy
**Goal:** anticipate third-party dependencies.
- Decisions to lock:
  - Analytics, marketing automation, authentication providers, etc.
- Actions before coding:
  - List integrations with owner, contract status, and data considerations.
  - Verify SDK availability and compliance requirements for each vendor.

## W. Workflow & Project Management
**Goal:** keep execution disciplined.
- Decisions to lock:
  - Issue tracking tooling, workflow states, and definition of ready.
- Actions before coding:
  - Configure boards with sections mirroring this plan to track completion.
  - Install automation (e.g., GitHub issue templates) reflecting PTRD checklists.

## X. Experimental Scope (“Innovation Tokens”)
**Goal:** limit novelty to what the team can support.
- Decisions to lock:
  - Which (max two) new technologies are allowed beyond the standard stack.
- Actions before coding:
  - Document rationale for each innovation token in an ADR.
  - Create rollback plans if the experiment under-delivers.

## Y. Yield & Analytics Strategy
**Goal:** ensure insights and KPIs are observable from day one.
- Decisions to lock:
  - Analytics stack (e.g., PostHog, GA) and event taxonomy.
- Actions before coding:
  - Draft analytics implementation spec (events, properties, success criteria).
  - Connect analytics strategy to the business outcomes in Section B.

## Z. Zero-Day Go/No-Go Checklist
**Goal:** confirm readiness before the first commit to main.
- Decisions to lock:
  - Acceptance criteria for “we can start coding” (PTRD §0).
- Actions before coding:
  - Fill the PTRD executive summary once every preceding section is approved.
  - Run a pre-flight review meeting; record go/no-go decision and outstanding risks.

---

### How to Use This Document
1. Assign an owner to each section (A–Z) and track progress in your project board.
2. Update `first_steps.md` inline as you resolve decisions; link back to the relevant section here.
3. When a section is completed, add references (meeting notes, ADR IDs, design files) directly beneath the associated heading.
4. Only once every section shows ✅ should the team begin implementing the Next.js scaffold from `first_configuration.md`.
