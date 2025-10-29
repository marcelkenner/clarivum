# cms/tests/config · AGENTS Guide

Validates Strapi configuration factories under `cms/config/*`. These tests ensure environment helpers and defaults stay aligned with infrastructure (`infra/strapi`) and deployment runbooks.

- `database.test.ts` and `server.test.ts` assert that env overrides are parsed correctly. Extend them whenever config files gain new options.
- When adding a config module, mirror it here with `<module>.test.ts` and simulate environment variables via the local `createEnv` helper.
- Keep tests hermetic—do not read from the real process environment.

## Commands

- Specific config suite: `npm run strapi:test -- --run tests/config`
- Full Strapi validation: `npm run strapi:ci`

## Checklist for config changes

1. Update the config file (`cms/config/*.ts`) and its corresponding test.
2. Adjust documentation (`cms/README.md`, `docs/runbooks/deployment.md`) if new environment variables are required.
3. Run `npm run strapi:test` locally; CI will block if coverage is missing.
