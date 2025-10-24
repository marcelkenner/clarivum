# QA Documentation · AGENTS Guide

## Purpose
- Centralize quality-engineering guides that complement `docs/adr/ADR-015-testing-strategy.md`.
- Keep onboarding smooth for engineers and QA contributors rolling onto Clarivum projects.

## Expectations
- Update `testing-strategy.md` whenever tooling, coverage targets, or workflows change.
- Cross-link relevant runbooks (`docs/runbooks/testing-stack.md`, `docs/runbooks/sisu-debugging.md`) and playbooks.
- Note Context7 sources for new frameworks before committing doc changes.

## Maintenance
- Review during Metsa seasonal checkpoints; adjust owners and links as needed.
- Run `npm run lint:docs` prior to submitting PRs that modify this directory.
- Ensure new docs capture Sisu Debugging and guardrail practices introduced elsewhere in the repo.
