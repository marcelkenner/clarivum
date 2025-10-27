# Supabase generated assets · AGENTS Guide

Holds CLI-managed artefacts such as `types.ts`. Treat this directory as output-only: regenerate files via the Supabase CLI rather than editing by hand.

## Workflow

- Authenticate and link the project before regenerating:  
  `npx supabase@latest login` → `npx supabase@latest link`.
- Update schema types whenever migrations change:  
  `npx supabase@latest gen types typescript --linked > supabase/types.ts`
- Keep generated files out of Prettier/ESLint by listing them in `.prettierignore`.
- Never commit credentials; CLI reads `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`, and other secrets from the environment.

Cross-reference ADR-036 for schema intent and document any changes when regenerating assets.
