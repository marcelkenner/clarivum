# ADR-024: Ebooks & Digital Products Platform
Date: 2025-10-24
Status: Accepted

## Context
- Clarivum plans to distribute ebooks and digital assets as lead magnets and premium products (`docs/PRDs/requierments/ebooks/feature-requirements.md`).
- Requirements include gated downloads, DRM-friendly watermarking, Supabase storage, Stripe/PayU checkout integration, and lifecycle messaging.
- We need a consistent platform that handles catalog metadata, file delivery, and compliance (GDPR, licensing).
- PDF and EPUB generation requirements are detailed in `docs/PRDs/requierments/pdf-converter/requirements.md`.

## Decision
- Manage ebook catalog in **Strapi** (ADR-010) with structured metadata (slug, vertical, pricing, fulfillment rules).
- Store binary assets in **Supabase Storage** (ADR-001) with signed URL delivery.
  - Apply watermarking pipeline via background jobs (ADR-003) when required.
- Checkout & entitlement:
  - Use Stripe/PayU flows (ADR-011) for purchases.
  - Persist entitlements in Supabase; expose via profile center (ADR-023).
- Delivery:
  - After purchase/lead capture, trigger download links via Listmonk (ADR-013) and on-screen success states.
  - Signed URLs expire within configured TTL; regenerate via profile UI.
- PDF & EPUB rendering:
  - Adopt a **dual-path export strategy**. Use **Playwright**-based headless browser rendering for high-fidelity replicas of existing marketing pages or CMS-driven layouts. Use **`@react-pdf/renderer`** for bespoke printable guides and structured lead magnets where reusable React components offer stronger control over pagination and headers/footers.
  - Generate EPUB 3 exports from the same semantic content sources (Markdown/HTML) using a scripted pipeline (e.g., Pandoc/`epub-gen`) to guarantee reflowable, accessible ebooks.
  - Encapsulate both rendering paths behind a shared `PdfEpubGenerationManager` with dependency-injected engines so future tooling swaps remain isolated.
- Analytics & tracking:
  - Emit events (ADR-008) for downloads, completions, upsell conversions.
  - Monitor storage bandwidth and costs; integrate with FinOps runbook.
- Security & compliance:
  - Respect consent preferences (ADR-014) before sending follow-up communications.
  - Provide data deletion/export options for purchase history.

## Consequences
- **Benefits:** Unified content workflow, secure delivery, integrated revenue tracking.
- **Trade-offs:** Requires coordination among Strapi, Supabase, and payment providers; watermarking adds processing overhead.
- **Follow-ups:**
  - Implement automated QA checklist validating signed URLs, watermark output, and PDF/EPUB accessibility scans.
  - Document refund and access revocation flows.
  - Evaluate additional formats (audio, interactive) once core system stabilizes.

## Diagrams
- Pending: add PDF/EPUB generation sequence diagram under `docs/diagrams/ebooks/pdf-epub-generation.drawio`.
