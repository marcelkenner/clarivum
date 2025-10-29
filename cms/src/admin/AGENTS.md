# cms/src/admin · AGENTS Guide

**Context7:** Follow the Strapi admin customization docs (`/strapi/documentation/v5_2_2`).

## Responsibilities

- `app.example.tsx` becomes `app.tsx` when we customize the admin. It controls theme tokens, translations, menu logos, and bootstrap hooks (see docs for supported keys).
- `tsconfig.json` and `vite.config.example.ts` define the admin bundler. Keep them updated when the build toolchain changes.

## Workflow

- Copy `app.example.tsx` to `app.tsx` before making changes, and document new UX/permissions impacts in `docs/PRDs/requierments/strapi/feature-requirements.md`.
- Run `npm run develop -- --watch-admin` while editing the admin so Strapi rebuilds assets automatically.
- Store custom assets under `cms/src/admin/extensions/` and reference them via imports. Avoid using `public/uploads` for admin UI.
- When enabling new locales, update both this folder and `config/admin.ts`. Coordinate translations with the copywriting guide.

## Guardrails

- Ensure `npm run build` passes before merging to prove the production admin bundles correctly.
- Add or update Playwright smoke coverage (`npm run test:e2e:smoke`) covering any new admin flows.
- Log permission changes or rollout instructions in `docs/runbooks/ops-hub.md` and capture incident learnings in `sisu-log/`.
