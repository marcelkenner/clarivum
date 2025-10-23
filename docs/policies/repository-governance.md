# Repository Governance Policy

This policy codifies how engineers work with Git so no change reaches `main` without the expected code quality, documentation, and review signals. It complements the deployment runbook and pull-request checklist.

## Branch protection rules

- All work happens on feature branches; direct pushes to `main` are blocked via GitHub branch protection.
- Pull requests must:
  - Have at least one approving review from an engineer outside the author list.
  - Pass required status checks (`lint`, `typecheck`, `unit-test`, `e2e-smoke`, `build`, `format:check`) executed by GitHub Actions.
  - Include up-to-date links to the corresponding task(s) so reviewers can trace requirements.
- Force pushes to protected branches are disabled. Rewrites require an explicit incident-level approval from the engineering lead.

## Commit quality standards

- Follow Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, etc.) with descriptive subject lines.
- Keep commits focused; do not mix refactors with feature code unless the refactor is a prerequisite captured in the task notes.
- Prefer squashing to a clean history; final merge commits must reflect the user-facing change (e.g., `feat(skin): add SPF diagnostic flow`).
- Add code comments only where business logic or non-obvious trade-offs need context. Avoid noise—comments should answer “why,” not restate “what.”

## Pull-request expectations

- Use the PR template and ensure every checkbox in `docs/checklists/pull-request.md` is addressed. Missing items must be justified inline.
- Provide:
  - Summary of the change and affected vertical(s).
  - Testing evidence (`npm run validate`, `npm run test`, Playwright output, CI screenshots if relevant).
  - Screenshots or screen recordings for UI updates, with before/after when feasible.
  - Rollback plan or confirmation that existing runbooks cover it.
- Resolve review comments through code changes or documented rationale before merging. “Won’t fix” requires agreement from both reviewer and author.

## Local workflow best practices

1. Sync daily: `git fetch origin` → `git rebase origin/main` to keep feature branches current.
2. Run the local quality bar before pushing:
   ```bash
   npm run validate
   npm run test
   npm run build
   ```
   (Add Playwright smoke or Vitest watch commands when working on affected surfaces. `npm run validate` already runs `lint`, `typecheck`, and `format:check`.)
3. For task-only updates, `npm run lint:tasks` provides a faster board validation shortcut.
4. Push with `--force-with-lease` only when rebasing personal branches; never bypass CI.

## CI/CD enforcement

- GitHub Actions publish required statuses that gate merges. The platform task `TSK-PLAT-004` tracks implementing these workflows and branch protections.
- Vercel remains the deployment engine; successful merges trigger preview/production builds automatically. A failing status check prevents deployment because the PR cannot merge.
- Add new status checks through code owners in `ci.yml` so the branch protection rule stays aligned.

## Exceptions

- Hotfixes follow the incident-response runbook and still require:
- Passing automated checks (at minimum `lint`, `typecheck`, targeted tests).
  - Pair review (synchronous call if necessary).
  - Retroactive documentation updates post-incident.
- If CI is down, pause merges. Do **not** bypass protections without sign-off from engineering + QA leads and an entered incident ticket.

Keep this document updated as tooling evolves. All engineers are accountable for following and enforcing these rules in code reviews.
