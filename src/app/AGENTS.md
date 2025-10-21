# App Router · AGENTS Guide

The `src/app/` directory houses Next.js route segments, layouts, metadata, and server actions.

## Routing & structure

- Follow App Router conventions: segment folders, `page.tsx`, `layout.tsx`, and route groups as needed.
- Keep route hierarchy aligned with the sitemap defined in `docs/PRDs/clarivum_brand.md` and `first_configuration.md`.
- Annotate dynamic segments with TypeScript types; validate params before use.
- Centralize shared layout patterns (navigation, footers) to avoid duplication.

## Data & async considerations

- Prefer server components for data fetching; use Suspense boundaries thoughtfully.
- Ensure caching strategies (`revalidate`, fetch cache tags) match performance targets from `docs/README.md`.
- Consult Context7 for Next.js caching, metadata, and streaming updates before adopting new APIs.

## Review checklist

- [ ] Routes render the correct CTA funnels per PRDs.
- [ ] Metadata and SEO tags meet brand requirements.
- [ ] Edge/runtime configuration matches reliability expectations.
- [ ] Telemetry (OTel spans, analytics) preserved for key flows.
