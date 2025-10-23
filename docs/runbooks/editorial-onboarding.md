# Editorial Onboarding Runbook

## Scope & objectives
- Provide a consistent path for onboarding editors, reviewers, and contractors into the Strapi-driven content stack described in ADR-010.
- Ensure RBAC, publishing workflows, and analytics guardrails are configured using `EditorialAccessCoordinator` and supporting managers.
- Deliver day-zero through day-30 checkpoints so newcomers can publish safely without engineering intervention.

## Roles & prerequisites
- **Owner:** Editorial Operations Manager.
- **Coordinators:** `EditorialAccessCoordinator` (provisions Strapi/Supabase), `ContentWorkflowManager` (training), `SearchIntegrationManager` (webhook verification).
- **Systems touched:** Strapi Cloud admin (`/websites/strapi_io_cms` Users & Permissions), Flagsmith, Supabase, Linear (content backlog), Notion (style guides).
- **Preconditions:** New hire record in HRIS, contract signed, email account activated, DPA acknowledged.

## Day -5: Access preparation
1. **Collect identity data:** Legal name, preferred display name, email, locale, required locales (PL/EN).
2. **Create Strapi invite:** In Strapi Admin → *Settings → Users & Permissions → Roles* (`Add new role` per Context7 documentation). Assign:
   - `Editor` role for staff with publish rights.
   - `Author` role for contributors (no publish).
   - Custom `MedicalReviewer` role if clinical approval needed.
3. **Provision Supabase read role:** Add user to `editorial_viewers` group for analytics dashboards.
4. **Flagsmith read-only:** Invite to project with segment access for content preview flags.
5. **Notify IT:** Request laptop, VPN if required.

## Day 0: Systems walkthrough (60 minutes)
1. **Orientation call:** Cover brand voice (`docs/PRDs/clarivum_brand.md`), legal guidelines.
2. **Strapi tour:** Demonstrate Draft & Publish workflow, explain locales, medical review stage.
3. **Search integration:** Show how publishing triggers `SearchIngestionManager` webhooks; highlight runbook for drift if preview missing.
4. **Tool stack overview:** Notion editorial calendar, Linear ticket templates, Slack channels (`#clarivum-editorial`, `#clarivum-dev`).

## Day 1–3: Guided exercises
- **Sandbox content:** Provide two Linear tickets (`EDITORIAL-###`). Trainee:
  1. Creates draft in Strapi (Author role) using sample assets.
  2. Requests medical review via Strapi workflow comment.
  3. Submits for publication; mentor publishes once QA checklist passes.
- **Access confirmation:** Verify user appears under Strapi *Users* with correct role and email confirmed (advanced settings require unique email per Context7 guidance).
- **Search verification:** Publish second draft to the dev environment; confirm Meilisearch entry via `npm run search:find -- --query "<title>"`.

## Day 4–7: Autonomy milestone
1. **Assign real content ticket:** Must include SEO brief, medical reviewer, publish window.
2. **Mentor review checklist:**
   - Draft complies with brand voice.
   - Assets sourced and licensed.
   - Feature flags (if any) set via Flagsmith.
   - Scheduling uses Strapi release feature (if future-dated).
3. **Publish simulation:** Trainee walks through go-live, signals `#clarivum-editorial`, monitors ISR revalidation (check Vercel deploy logs).
4. **Post-mortem:** Document learnings, add to `docs/role-guides/editorial.md`.

## Tool-specific notes
- **Strapi roles:** Use admin panel to adjust permissions; default `Authenticated`/`Public` roles remain untouched to protect API access.
- **Media library:** Editors receive upload rights; contractors restricted to existing assets (configure under Users & Permissions → Roles).
- **Localization:** Ensure `locale` field in Strapi entries set to supported values; translation tasks tracked separately.

## Quality & compliance checkpoints
- **GDPR:** Confirm data processing agreement signed; enforce unique email (enable *One account per email* in Strapi advanced settings).
- **Medical review:** Every health-related article requires `MedicalReviewer` approval before publish.
- **Accessibility:** Run Lighthouse audit on preview link; log issues in Linear.

## Offboarding
1. Remove Strapi access (Users & Permissions → Users → disable).
2. Revoke Supabase + Flagsmith roles.
3. Transfer Linear tickets; update editorial calendar.
4. Archive authored content attribution if required (Notion log).

## Change log
- **2025-10-23:** Initial onboarding runbook covering RBAC provisioning, training milestones, and compliance checkpoints.
