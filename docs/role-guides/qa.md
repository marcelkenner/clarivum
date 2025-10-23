# Quality & Testing Guide

Quality is everyone’s job, but this guide focuses on tooling and expectations for QA engineers, testers, and developers wearing the quality hat.

## Foundation

- PTRD Section 8 (CI/CD, test strategy): `docs/PRDs/first_steps.md`
- PR checklist: `docs/checklists/pull-request.md`
- Deployment safeguards: `docs/runbooks/deployment.md`
- Incident learning loop: `docs/runbooks/incident-response.md`
- Observability setup: `docs/adr/ADR-004-observability-stack.md`

## Testing strategy

1. **Unit tests**  
   - Encourage teams to add Vitest (planned) for pure logic and React component tests.  
   - Track gaps in a testing backlog; prioritize authentication, pricing, CTA flows.
2. **Integration/contract tests**  
   - Validate API routes and Supabase interactions. Use mocked Auth0 tokens as needed.  
   - Ensure idempotent job handlers have contract coverage.
3. **E2E smoke**  
   - Playwright-based smoke suite runs on preview/dev builds.  
   - Maintain scripts that hit the primary funnels (landing → vertical start → CTA).
4. **Observability-driven testing**  
   - Verify OTel spans and metrics exist for each new flow; add assertions to alerting dashboards.
5. **Regression checklist**  
   - Update `docs/checklists/pull-request.md` if new mandatory checks appear.  
   - Keep a living regression suite map in the QA backlog.

## Workflow

- Join planning to identify acceptance criteria and negative scenarios early.  
- Pair with engineers to ensure feature flags cover new flows before enabling in production.  
- Record manual test notes in PRs until automation is in place.  
- After incidents, help translate postmortem actions into new tests or monitoring.

## Tooling & commands

- `npm run lint` (until we add `npm run test`).  
- Playwright (planned): `npx playwright test`.  
- Context7 for framework-specific testing best practices (Vitest, Playwright, Testing Library).

## Asking for help

- Quality questions → `#clarivum-qa`.  
- Add doc gaps to the testing backlog or open a `[QA]` issue.  
- Advocate relentlessly for coverage; if tooling is missing, raise it—nothing is off-limits to make this project feel golden.
