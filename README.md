This repository hosts the Clarivum web experience (Next.js App Router, React 19, Tailwind CSS 4, TypeScript 5). It is preconfigured with governance, documentation, and tooling captured in `AGENTS.md`, the PTRD (`docs/PRDs/first_steps.md`), and the ADR set (`docs/adr/`).

## Local development

Install dependencies (Node ≥ 20.11):

```bash
npm install
```

Common scripts:

| Purpose             | Command                | Notes                                                                 |
| ------------------- | ---------------------- | --------------------------------------------------------------------- |
| Start dev server    | `npm run dev`          | Uses Turbopack; hot reload enabled.                                   |
| Build production    | `npm run build`        | Generates the production bundle (Turbopack).                          |
| Run quality gate    | `npm run validate`     | Executes lint (tasks + code), typecheck, and Prettier format check.   |
| Lint tasks only     | `npm run lint:tasks`   | Validates task board metadata/schema.                                 |
| Lint code only      | `npm run lint:code`    | ESLint with zero warnings allowed.                                    |
| Type-check only     | `npm run typecheck`    | Uses `tsconfig.json` strict settings.                                 |
| Auto-format source  | `npm run format`       | Runs Prettier respecting `.prettierignore`.                           |
| Refresh AGENTS docs | `npm run ensure:agents`| Regenerates directory-specific agent guidance files.                  |
| Task status digest  | `npm run tasks:summary`| Rebuilds `tasks/status-summary.md`.                                   |

CI relies on `npm run validate`; ensure it passes before pushing. Task changes alone still require `npm run lint:tasks`.

## Documentation map

- Project guardrails: `AGENTS.md`, `docs/PRDs/first_steps.md`, `docs/architecture.md`.
- Architecture decisions: `docs/adr/ADR-00x-*.md`.
- Policy references: `docs/policies/`.
- Role and workflow guides: `docs/role-guides/`.
- Task board: `tasks/` (see `tasks/README.md` + lane-specific `AGENTS.md` guides).

Consult these artifacts before altering stack choices. Update or add new ADRs and PRD appendices when decisions change.

## Deployment

Vercel deploys automatically from protected branches. GitHub Actions enforces lint, type-check, tests (once available), and formatting before merges. See `docs/runbooks/deployment.md` and `docs/policies/repository-governance.md` for the detailed promotion and rollback process.

## Support

- Resolve framework/library questions via Context7 (see `AGENTS.md`).
- Keep files under 500 lines as mandated in `AGENTS.md`.
- For new directories, run `npm run ensure:agents` and customize the generated guide.
