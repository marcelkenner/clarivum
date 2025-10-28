# src/app/sisu-log · AGENTS Guide

Displays Markdown entries from `sisu-log/` (Sisu Debugging notes) via `DocumentScreen root="sisu-log"`.

- Respect append-only semantics. Never add mutation endpoints or UI that edits notes from this route.
- The footer reminds contributors about append-only edits. Keep messaging aligned with Section 6 of
  `AGENTS.md`.
- Ensure new notes conform to the required filename pattern before linking (YYYY-MM-DD-short-id.md).
- QA: `npm run lint:code -- src/app/sisu-log src/components/documents`, `npm run typecheck`,
  and manual navigation to `/sisu-log/YYYY-MM-DD-slug`.
- Production access is gated by `assertInternalDocsAccess()`. Leave `INTERNAL_DOCS_ALLOW` unset so
  notes stay internal-only.

Extend this file when we add filters (e.g., owner, area) or additional guardrails.
