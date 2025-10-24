# Testing Helpers

This directory will contain shared utilities for Vitest and Playwright suites. Use it to store fixtures, environment factories, and helper functions referenced in `docs/runbooks/testing-stack.md`.

## Conventions

- Keep helpers small and single-purpose; prefer composition over large utility files.
- Export TypeScript types alongside builders so tests stay strongly typed.
- Document any external services or feature flags the helper relies on.

## Getting Started

Add new helpers in sibling files (e.g., `fixtures/user.ts`) and reference them from tests via the `@` alias or relative imports. Update this README with owner information as the stack matures.
