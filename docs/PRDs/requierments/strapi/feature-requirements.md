# Feature Requirements — Strapi Content Platform

> **Canonical decision:** `docs/adr/ADR-010-content-management-platform.md` defines the Strapi architecture and governance model.

## Objective
- Configure Strapi as the single source of truth for marketing and content assets powering Clarivum’s IA (homepage, vertical hubs, blog, ebooks, tools, coupons, recommendations).
- Enable non-technical teams to publish updates quickly while preserving structured data for developers.

## Target Outcomes
- Business: reduce engineering involvement in routine content changes and accelerate campaign launches.
- Experience: deliver consistent, structured content feeds with validation that prevents broken pages.

## Primary Users & Segments
- Internal: content editors, marketing managers, legal reviewers, developers consuming APIs.
- Segmentation: role-based access (editor, reviewer, publisher, admin), vertical-specific permissions when needed.

## Experience Principles
- Content models should mirror the sitemap and maintain single responsibility (one type per purpose).
- Provide clear editorial workflows (draft → review → publish) with required approvals.
- Emphasize localization readiness and media asset governance.

## Functional Requirements
- FR1 — Define content types for homepage modules, vertical hubs, blog posts, ebooks, tools, diagnostics, coupons, recommendations, legal policies, testimonials.
- FR2 — Implement relationships between types (e.g., ebook references CTA modules, recommendations link to coupons).
- FR3 — Enforce validation rules (required fields, slug uniqueness, date ranges for offers).
- FR4 — Support localization fields and future translation workflows.
- FR5 — Provide role-based workflows with review states and changelog history.
- FR6 — Expose performant APIs (REST/GraphQL) with caching headers suitable for ISR and on-demand revalidation.
- FR7 — Integrate media library with tagging, image optimization hints, and CDN compatibility.

## Content & Data Inputs
- Structured data defined in collaboration with marketing and product; taxonomy lists (verticals, categories, tags) maintained centrally.
- Legal-approved copy blocks for disclaimers and disclosures.
- Asset metadata (alt text, credits) enforced via validation.

## Integrations & Dependencies
- Internal: Next.js frontend, analytics (content metadata tagging), diagnostics, ebooks, coupons, recommendations services for cross-linking.
- External: Authentication for CMS (SSO with MFA), translation service integration (future), media CDN.

## Analytics & KPIs
- Track content deployment frequency, publish lead time, number of validation errors prevented, API performance metrics.
- Monitor editorial workflow metrics (time in review, number of revisions).

## Non-Functional Requirements
- Ensure Strapi deployment scales with content volume; implement caching layer or edge CDN for API responses.
- Back up content regularly; provide disaster recovery plan.
- Maintain uptime SLO 99.5% for content APIs.

## Compliance & Access Control
- Enforce MFA for all CMS accounts, with audit logs retained ≥12 months.
- Role permissions: editors create/edit, reviewers approve, publishers release, admins manage schema.
- Align with GDPR—ensure content storing personal data (testimonials) has consent records.

## Launch Readiness Checklist
- Content models documented and reviewed with stakeholders.
- Migration/import scripts prepared for initial content load.
- API endpoints smoke-tested with frontend components.
- Editorial training delivered, with playbook for using workflows and assets.

## Open Questions & Assumptions
- Need decision on hosting (self-managed vs Strapi Cloud) and deployment pipeline.
- Determine localization tooling (manual vs integrated translation provider).
- Assume Strapi will manage taxonomy for both blog and ecommerce content; confirm no conflicting systems.
