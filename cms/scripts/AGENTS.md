# cms/scripts · AGENTS Guide

**Context7:** Validate CLI usage with the Strapi documentation (`/strapi/documentation/v5_2_2`).

- `run-lint.js` and `run-tests.js` back the `npm run lint` / `npm run test` scripts. Replace their console shims with real commands once linting or test tooling is adopted.
- Keep scripts executable (`chmod +x`) and Node 20-compatible; prefer zero external dependencies. Document any new dependency in `cms/AGENTS.md`.
- When shelling out to Strapi CLI commands, call them via `npm run strapi <command> -- --flag` to follow documented option forwarding.
- Add unit coverage in `cms/scripts/__tests__/` when scripts gain logic beyond simple wrappers.
- Update this guide and `docs/runbooks/deployment.md` whenever deployment or maintenance automation evolves.
