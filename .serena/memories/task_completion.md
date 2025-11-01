# Task completion checklist

- Run `npm run validate` before finishing, plus targeted linters/tests affected by the change (e.g., `npm run lint:code -- <path>` or `PLAYWRIGHT_BASE_URL=... npm run test:e2e:smoke` if E2E impacted).
- Confirm file sizes remain <500 lines and classes/functions obey SRP and OOP guardrails.
- Update relevant docs (ADR/PRD/AGENTS) when decisions shift; record follow-up tasks in `tasks/` as needed.
- Ensure observability env expectations remain satisfied when touching telemetry or deployment flows.
- Summarize changes succinctly and propose next steps (tests, deployment) in final handoff.
