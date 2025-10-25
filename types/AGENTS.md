# types · AGENTS Guide

Holds shared TypeScript augmentations (e.g., `types/process-env.d.ts`). Update this directory whenever global types change so `tsc --noEmit` remains strict.

## Guidelines

- Declare new environment variables on `NodeJS.ProcessEnv` inside `process-env.d.ts` before using them in code. Provide a short comment describing the expected format or allowed values.
- Avoid ambient `any` in these files. If a type is temporary, add a TODO referencing the owning task.
- Run `npm run typecheck` after editing to ensure tooling picks up the augmentation.

When adding other global declarations (e.g., window extensions), keep them isolated per file and document the source ADR/PRD at the top.
