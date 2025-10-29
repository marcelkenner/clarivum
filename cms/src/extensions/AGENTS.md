# cms/src/extensions · AGENTS Guide

**Context7:** Follow Strapi plugin extension guidance in `/strapi/documentation/v5_2_2`.

- Extend core or marketplace plugins by creating folders like `<plugin-name>/strapi-server.ts` with the patterns from the docs. Return the mutated plugin object from each override.
- Keep overrides minimal—prefer configuring behaviour in `cms/config/*.ts` before patching controllers or routes.
- Document every extension in `docs/PRDs/requierments/strapi/feature-requirements.md` and reference the source task/ADR in a file header comment.
- Add regression tests (unit, integration, or admin e2e) for customised behaviour to ensure upgrades catch regressions.
- Review overrides during Strapi upgrades: compare with upstream plugin changes and note compatibility checks in the upgrade PR.
