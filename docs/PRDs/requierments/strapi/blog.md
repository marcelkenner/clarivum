# Clarivum Strapi Requirements — Blog

> **Canonical decision:** `docs/adr/ADR-010-content-management-platform.md` governs the Strapi platform used in this specification.

This specification defines the Strapi (v5) content model, workflows, and integration contracts for Clarivum's blog experience. It translates the editorial blueprint in `docs/PRDs/blog_structure.md` into implementation-ready requirements; treat this document as the authoritative source for CMS configuration.

---

## 1. Scope and Goals

- **Scope**: Blog home, category hubs, sub-hubs, and individual articles for the Skin vertical (Fuel/Habits verticals must reuse the same model). Includes supporting taxonomies, author metadata, tool/ebook CTAs, and SEO payloads.
- **Out of scope**: Interactive tools, ebooks, recommendations, and diagnostics themselves (refer to respective PRDs). Monetization modules (ads, affiliate capsules) are also out of scope here.
- **Primary goals**:
  - Support the category-first routing strategy (`/skin/<category>/<slug>`).[^\*blog]
  - Give editors full control of required hub modules (hero, “Co zyskuję”, featured posts, tool/e-book CTAs, email capture, mini-FAQ) with reorder flexibility while enforcing cardinality rules.
  - Supply structured content to Next.js via REST/GraphQL with explicit populate fragments compatible with ISR caching.[^populatev5]

---

## 2. Content Architecture

### 2.1 Single Types

| Key | Purpose | Required Attributes |
| --- | --- | --- |
| `blog.home` | `/skin/blog/` index (optionally reused per vertical) | `hero`, `featuredCategories[]`, `toolSpotlight` (relation to `content.toolTeaser`), DZ `sections[]`, `seo` |
| `blog.globalSettings` | Shared blog settings | `defaultHeroImage`, `newsletterFormEmbed`, `authorListingIntro`, `listingPageSize`, `schemaPublisher`, `seoDefaults` |

### 2.2 Collection Types

| Collection | Purpose | Required Fields |
| --- | --- | --- |
| `blog.category` | Category hubs (e.g., `/skin/podstawy/`) | `title`, `slug`, `vertical` (`skin|fuel|habits`), `hero` component, `valueProps[]` (3 items), `primaryEbook` (relation to `commerce.ebook`), `secondaryUpsell` (relation to `commerce.ebook` or `commerce.bundle`), `toolOfWeek` (relation to `content.toolTeaser`), `featuredPosts[]` (3–5 relations to `blog.post`), `emailCapture` component, `miniFaq` (3 Q/A), `sections[]` DZ for optional extras, `seo`, `sourceDocPath` |
| `blog.subhub` | Optional nested hubs (e.g., `/skin/skladniki/retinoidy/`) | `title`, `slug`, parent `category`, `summary`, `featuredPosts[]` (2–4), `seo` |
| `blog.post` | Canonical articles | See §3.2 |
| `blog.tag` | Tag taxonomy (`/skin/tag/<slug>/`) | `name`, `slug`, `description`, `vertical`, `seo` |
| `blog.author` | Author profiles | `name`, `slug`, `role`, `bio`, `credentials`, `headshot`, `socialLinks[]`, `seo`, `displayOrder`, `isMedicalReviewer` |

### 2.3 Shared Components

| Component UID | Usage | Mandatory Fields |
| --- | --- | --- |
| `blog.hero` | Category/blog hero | `eyebrow`, `headline`, `dek`, `backgroundMedia`, optional `cta` |
| `blog.valuePropList` | “Co zyskuję” | Exactly 3 `items[] { icon, title, description }` |
| `blog.featuredPostCard` | Feature block | relation to `blog.post`, optional override `excerpt`, `ctaLabel` |
| `blog.toolSpotlight` | Tool highlight | relation to `content.toolTeaser`, optional `note` |
| `blog.ebookCta` | Primary or secondary ebook CTA | relation to `commerce.ebook` + `ctaLabel`, optional `bonusNote` |
| `blog.newsletterCapture` | Email module | `headline`, `subheading`, `formEmbedId`, `privacyCopy` |
| `blog.miniFaq` | 3-question FAQ | `questions[]` (exactly 3) |
| `blog.postBody.richtextSection` | Article section | `heading`, `bodyRichtext` |
| `blog.postBody.pullQuote` | Quote | `quote`, `attribution`, optional `link` |
| `blog.postBody.toolPromo` | Inline tool CTA | relation to `content.toolTeaser`, optional `context` |
| `blog.postBody.ebookPromo` | Inline ebook CTA | relation to `commerce.ebook`, optional `context` |
| `blog.postBody.checklist` | Bullet checklist | `title`, `items[]` |
| `blog.postBody.callout` | Highlight block | `title`, `body`, `variant` (`info|warning|success`) |
| `blog.schemaMeta` | Structured data overrides | `jsonLd` (validated JSON) |

All components with textual fields must have localization enabled. Validation must ensure fixed cardinalities (e.g., `valueProps[]` exactly three entries, `miniFaq.questions[]` exactly three).

---

## 3. Detailed Modeling

### 3.1 Category Hubs (`blog.category`)

- **Slug & Routing**: `slug` stored without leading slash; front-end builds route `/vertical/slug/`. Redirect strategy to move legacy `/skin/blog/<slug>` to new paths maintained outside Strapi.
- **Vertical Enforcement**: `vertical` drives downstream filtering; editors cannot change vertical once posts exist (use lifecycle hook).
- **Featured Posts**: Strapi validation enforces 3–5 published posts; order controls display sequence. Publishing/unpublishing posts must trigger webhook recalculations for the hub.
- **Tool of Week**: single relation to `content.toolTeaser`; Strapi must allow scheduling via `toolRotationStart`/`toolRotationEnd` optional fields. `toolOfWeek` becomes optional when outside the active window.
- **Primary/Secondary CTA**: `primaryEbook` required. `secondaryUpsell` optional but recommended; both use `blog.ebookCta` component to capture CTA label and supporting copy.
- **Email Capture**: Use `blog.newsletterCapture` component; embed IDs must map to marketing platform (e.g., Customer.io). Strapi should validate against allowlisted IDs.
- **Mini FAQ**: Provided via `blog.miniFaq`; questions drawn from editorial backlog (`docs/PRDs/blog_structure.md` baseline).
- **Dynamic Sections**: `sections[]` optional dynamic zone with allowed components: `shared.richtextSection`, `shared.mediaWithCopy`, `blog.toolSpotlight`, `shared.metricsRow`. No more than 4 sections.
- **Auditing**: `sourceDocPath` required (e.g., `docs/PRDs/blog_structure.md#line` referencing the canonical plan).
- **SEO**: Title, description, canonical URL (auto derived), OG image mandatory. Schema markup optionally overriding via `blog.schemaMeta`.
- **Locale Handling**: `pl` default. `en` may omit sections until translation ready; fallback logic in frontend uses default locale.

### 3.2 Posts (`blog.post`)

| Field | Requirement |
| --- | --- |
| `title`, `slug` | Slug auto-generated `vertical/category/slug`; editors may edit trailing slug but not category segment. |
| `hero` | `blog.hero` variant for article (with optional background media). |
| `dek` | 1–2 sentence summary; used for previews and SEO `og:description`. |
| `category` | Required relation to `blog.category`. |
| `subhub` | Optional relation to `blog.subhub`. |
| `vertical` | Derived from category (read-only). |
| `tags[]` | Many-to-many `blog.tag`; minimum one. |
| `authors[]` | Ordered relations to `blog.author`; at least one. |
| `medicalReviewers[]` | Optional relation to `blog.author` where `isMedicalReviewer=true`; enforcement ensures all reviewers flagged. |
| `readingTimeMinutes` | Numeric (auto-calculated with manual override). |
| `publishDate` | Defaults to created; used for ISR revalidation scheduling. |
| `body` | Dynamic Zone limited to `blog.postBody.*` components; must start with `richtextSection`. |
| `inlineToolReferences[]` | Optional explicit relations to `content.toolTeaser` to power “Narzędzie tygodnia” rotation when article trending. |
| `relatedPosts[]` | Up to 4 relations for “Czytaj dalej”. |
| `seo` | Title, description, canonical, OG tags. |
| `schemaMeta` | Optional component for article-level JSON-LD. |
| `statusFlags` | Enum set: `evergreen`, `seasonal`, `update-needed`. |
| `sourceDocPath` | Required pointer to editorial outline. |

- **Body Composition Rules**:
  - Max two consecutive `richtextSection`.
  - `pullQuote` must be followed by either `richtextSection` or `checklist`.
  - `toolPromo`/`ebookPromo` limited to one each per article to avoid CTA overload unless `statusFlags` includes `seasonal`.
- **Media**: Use Strapi Upload for images; alt text mandatory.
- **Draft & Publish**: Enabled; `publishDate` remains locked after publish unless legal/regulatory update (tracked via `statusFlags` change).
- **Locales**: `locale=pl` required before publishing; `en` optional but recommended.

### 3.3 Sub-hubs (`blog.subhub`)

- Provide optional intermediate landing pages for ingredient subcategories.
- Fields: `title`, `slug`, `category`, `summary`, `hero`, `featuredPosts[]` (2–4), optional `toolSpotlight`, `seo`.
- Renders using same module sequence as category minus newsletter capture; Strapi ensures `featuredPosts[]` all belong to parent `category`.

### 3.4 Tags (`blog.tag`)

- Provide taxonomy for search facets. Slugs unique per vertical.
- Each tag entry must reference at least one post before publish; lifecycle hook should prevent orphaned tags.

### 3.5 Authors (`blog.author`)

- `credentials` stored as structured object: `credentials[] { title, organization, credentialType }`.
- Provide optional `reviewerStatement` displayed when `isMedicalReviewer=true`.
- `displayOrder` used for author index sorting.
- Mandatory `slug` to power `/o-nas/autorzy/<slug>/`.

---

## 4. Editorial Workflow & Roles

- **Roles**:
  - *Editor*: Manage categories, posts, tags, blog home.
  - *Editor Senior*: Approve publication; manage `blog.globalSettings`.
  - *Medical Reviewer*: Can update reviewer notes but not publish posts.
  - *SEO Specialist*: May edit `seo` fields and schema overrides only.
- **Draft & Publish**: Enabled for all blog-related types.[^draft]
- **Review Flow**: Optional Strapi Review Workflows stage (`Writing` → `Review` → `Ready for publish`). Decide per staffing capacity.[^releases]
- **Scheduling**: Use Strapi Releases for coordinated category + post updates (e.g., launching new hub).[^\*blog]
- **Localization**: Workflow requires editorial confirmation that localized modules maintain cardinality (e.g., still 3 value props).
- **Change Logs**: When `statusFlags` includes `update-needed`, automation should open a task in backlog; store `updateReason` field.
- **Tool Rotation**: Editors update `toolOfWeek` weekly; automation sends reminder via Strapi scheduled publication.

---

## 5. API & Integration Requirements

- **REST**:
  - Blog home: `GET /api/blog-home?populate[sections][populate]=*&populate[toolSpotlight]=*&locale=pl`.
  - Category hub: `GET /api/blog-categories/{slug}?populate[hero]=*&populate[valueProps]=*&populate[featuredPosts][populate][0]=hero&populate[toolOfWeek]=*&populate[miniFaq]=*&locale=pl`.
  - Post: `GET /api/blog-posts/{slug}?populate[body][on][blog.post-body.richtext-section]=*&populate[body][on][blog.post-body.tool-promo][populate]=*&populate[authors]=*&populate[tags]=*&populate[category]=*&locale=pl`.
  - Strapi v5 requires explicit `on` fragments for each body component.[^populatev5]
- **GraphQL**:
  - Use fragments per component: `... on ComponentBlogPostBodyRichtextSection`, etc.[^graphql]
- **ISR & Webhooks**:
  - `entry.publish` for `blog.post`, `blog.category`, `blog.home` triggers Next.js revalidate for category path, blog index, and article path.
  - `entry.unpublish` similarly invalidates caches.
- **Search Index**:
  - On publish, webhook posts JSON payload to search service (e.g., Meilisearch) containing `title`, `dek`, `tags`, `category`, `vertical`, `publishDate`.
- **Analytics Hooks**:
  - Provide `analyticsSlug` field for consistent instrumentation.
- **Sitemaps**:
  - Strapi should expose `/api/blog-sitemap?locale=pl` listing categories/subhubs/posts with `lastmod` timestamps.

---

## 6. Non-Functional Requirements

- **Performance**: Category hub payload under 200 KB compressed (limit dynamic zones). Post body limited to 25 components; use pagination for very long articles.
- **Localization**: All textual fields flagged for translation; Strapi ensures fallback to default locale when missing.[^i18n]
- **Accessibility**: Provide alt text on hero/background assets; enforce heading hierarchy (H2+ sequential).
- **Versioning**: Retain previous post versions using Strapi content history (Enterprise) or manual revision fields (`changelog[]`).
- **Compliance**: Medical-reviewed articles require `medicalReviewers` relation and display `reviewedAt`.
- **Analytics**: Each publish event logs to data warehouse via webhook; include `documentId`, `locale`, `action`.
- **Backups**: Include blog tables in nightly DB snapshot; ensure Upload assets versioned.

---

## 7. Implementation Checklist

- [ ] Create `blog.home` and `blog.globalSettings` single types with Draft & Publish + i18n enabled.
- [ ] Model collection types (`blog.category`, `blog.subhub`, `blog.post`, `blog.tag`, `blog.author`) with validations and lifecycle hooks described above.
- [ ] Configure dynamic zones and components with localization toggles and cardinality checks.
- [ ] Wire webhooks for publish/unpublish → Next.js revalidate and search indexing.
- [ ] Document editorial workflow in `docs/role-guides/editorial.md`.
- [ ] Populate seed content for Skin categories per `docs/PRDs/blog_structure.md` before handoff.

---

## 8. Open Questions

1. Do we require Strapi Review Workflows (Enterprise) for medical reviewer approvals, or can status flags suffice?
2. Should tool rotation (`toolOfWeek`) support automated A/B testing via flags, or remain editor-driven only?
3. Confirm integration path for category newsletter forms (Customer.io vs. Mailchimp) to finalize embed validation rules.

---

[\*blog]: Clarivum blog structure blueprint (`docs/PRDs/blog_structure.md`).
[^draft]: Strapi Content-Type Builder advanced settings — Draft & Publish.[https://docs.strapi.io/dev-docs/content-type-builder/managing-content-types#advanced-settings]
[^populatev5]: Strapi v5 population strategy requiring explicit `on` fragments for components/dynamic zones.[https://docs.strapi.io/dev-docs/migration/v4-to-v5/breaking-changes/no-shared-population-strategy-components-dynamic-zones]
[^graphql]: Strapi GraphQL querying dynamic zones with fragments.[https://docs.strapi.io/dev-docs/api/graphql]
[^i18n]: Strapi internationalization workflow guidance.[https://docs.strapi.io/user-docs/content-manager/translating-content]
[^releases]: Strapi webhooks for release publish events and workflow integration.[https://docs.strapi.io/dev-docs/backend-customization/webhooks]
