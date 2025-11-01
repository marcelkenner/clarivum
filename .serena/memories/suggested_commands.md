# Common commands

- Install deps: `npm install`
- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Storybook: `npm run storybook`
- Lint (all): `npm run lint`
- Lint code only: `npm run lint:code`
- Lint tasks metadata: `npm run lint:tasks`
- Type check: `npm run typecheck`
- Validate quality gate (lint + typecheck + format check + SEO tests + Strapi CI): `npm run validate`
- Run Vitest suite: `npm run test`
- Coverage workflow: `npm run test:coverage && npm run metrics:coverage`
- Playwright smoke E2E (needs dev server at 127.0.0.1:3310): `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3310 npm run test:e2e:smoke`
- Update task summary: `npm run tasks:summary`
- Ensure AGENTS guidance: `npm run ensure:agents`
- OpenNext platform build: `npm run platform:bundle`
