# Homepage Metadata Kick-off (TSK-SEO-001)

Clarifies the immediate follow-up work for `TSK-SEO-001` once the Tools-first homepage skeleton (TSK-FE-005) lands. Focus: wire the shared metadata utilities, JSON-LD fixtures, and CI guardrails without blocking feature delivery.

## Scope & objectives

- Deliver a typed `metadataFactory` for the homepage and pillar templates that composes titles, descriptions, canonical URLs, and alternates from a single source of truth.
- Prepare JSON-LD blueprints for `WebPage`, `BreadcrumbList`, and hero CTA actions so the homepage launches with zero Rich Results warnings.
- Align the metadata toolkit with Next.js 15’s Metadata API (App Router) so future routes can opt into the same abstraction. Source: Context7 `/vercel/next.js` documentation for `metadata` and `generateMetadata` exports (see “Configure Page Metadata” and “Add Type Safety to Async `generateMetadata` Function”).
- Document guardrails for CI (`npm run validate`) so metadata omissions fail fast once the utilities exist.

## Next.js Metadata API contract

| Concern | Decision |
| --- | --- |
| Export style | Static metadata for shared layout via `export const metadata: Metadata`. Dynamic sections use `export async function generateMetadata(): Promise<Metadata>` (Context7 `/vercel/next.js`). |
| Types | Always import `Metadata` (and `ResolvingMetadata` when extending parent metadata) from `next` for type safety. |
| Base URL | Define `metadataBase` inside the factory using `NEXT_PUBLIC_SITE_URL` to ensure relative Open Graph and canonical URLs stay correct across environments. |
| Resource hints | Defer to `ReactDOM.preconnect`/`ReactDOM.preload` helpers in client components when needed (see Context7 resource hint snippet). Keep all hints centralized to avoid duplicate preloads. |
| Viewport | If the homepage needs to toggle viewport settings, expose a `generateViewport` helper that returns `Viewport` from `next`. |

## JSON-LD fixtures (homepage launch)

1. **`WebPage`** — key fields: `@type`, `name`, `description`, `url`, `inLanguage`, `publisher`. Accept runtime overrides for hero title/subheading.
2. **`BreadcrumbList`** — `itemListElement` referencing “Home → Tools-first homepage → Clarivum Skin/Fuel/Habits”. Ensure every item has `@id`.
3. **Hero CTA actions** — model as `PotentialAction` (`Action` + `target`) to help search engines connect generative answers with our on-site funnels.
4. **Structured tools** — when hero goals map to tool pages, embed `ItemList` referencing the top three tools (slug + name) surfaced in the generated plan.

Store fixtures under a dedicated homepage module (reintroduced alongside the rebuild) with `.ts` exports returning typed objects. Add unit tests (Vitest) that validate the shapes using `Ajv` once the schema package lands.

## Guardrails & follow-up tasks

- Extend `npm run validate` with metadata/schema checks (per ADR-034) and surface failures via CI annotation.
- Document the metadata factory usage in `docs/runbooks/seo-operations.md` (owner: Frontend Platform Lead).
- After merge, update `docs/PRDs/seo-foundation.md` launch checklist to mark homepage coverage complete.
- Coordinate with Flagsmith rollout (`TSK-PLAT-014`) so metadata experiments can run without forked JSX.

## References

- ADR-034: SEO Foundation & Governance (`docs/adr/ADR-034-seo-foundation-and-governance.md`)
- PRD: SEO Platform Foundation (`docs/PRDs/seo-foundation.md`)
- Context7 `/vercel/next.js` metadata API documentation (generateMetadata, metadata object examples)
