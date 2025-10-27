# Supabase helpers · AGENTS Guide

Use this directory for typed Supabase clients and schema helpers. Generated types live in `supabase/types.ts` at the repo root; re-export them from local modules so application code can import via `@/lib/supabase`.

## Workflow

- Keep generated files out of `src/`—invoke `npx supabase@latest gen types typescript --linked > supabase/types.ts` whenever migrations change.
- Re-export types (Database, Tables\*) from a stable module (`types.ts`) so call sites avoid long relative paths.
- Centralise client creation helpers here; ensure they read credentials from `process.env` via typed env accessors.
- Run `npm run typecheck` after updating helpers to validate ambient type changes.

Coordinate schema or policy updates with ADR-001 and ADR-036 and document new usage patterns in this guide as they evolve.
