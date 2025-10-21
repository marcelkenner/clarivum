# Scripts · AGENTS Guide

Automation and maintenance scripts live here. Keep them lightweight, dependency-free, and aligned with repository workflows.

- Target Node.js 20+. Avoid features not supported by the runtime used in CI/Vercel.
- `ensure-agents.mjs` enforces automatic creation of `AGENTS.md` files; run `npm run ensure:agents` after restructuring directories.
- Do not introduce third-party CLIs without documenting installation steps in the root `AGENTS.md`.
- When referencing Node or library APIs, confirm behavior via Context7 docs before codifying it.
- Update this guide whenever new automation scripts are added.
