# Checklists · AGENTS Guide

Checklists in this directory codify the gates used in CI/CD and code review. Keep them concise, actionable, and aligned with real automation.

## Maintenance expectations

- Ensure checklist items map to actual CI steps (lint, tests, deploy blocks). Update CI when the checklist changes, and vice versa.
- Reference the relevant PTRD sections or ADRs when adding new items so reviewers know the source of truth.
- Use Context7 when instructions cite tooling (ESLint, Vitest, Playwright) to stay current with best practices.
- Avoid duplicating guidance from root `AGENTS.md`; instead, link to shared policies or runbooks.

## Review checklist

- [ ] Items are ordered by criticality (security, reliability, quality, docs).
- [ ] Each item is phrased as a binary question an agent can check quickly.
- [ ] Links point to maintained docs/runbooks.
- [ ] CI configuration reflects the checklist (no orphaned steps).
