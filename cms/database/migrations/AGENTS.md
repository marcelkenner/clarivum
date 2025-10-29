# cms/database/migrations · AGENTS Guide

**Context7:** Follow Strapi migration and data-transfer guidance in `/strapi/documentation/v5_2_2`.

- Name files `YYYYMMDDHHmm_<slug>.ts` (or `.sql`) so deploy pipelines execute deterministically.
- Author reversible `up` / `down` helpers when possible. If a step cannot be rolled back, document the mitigation path in a header comment and the PR description.
- Use Strapi's Entity Service API or plain SQL via `pg` inside migrations—avoid importing application services to keep dependencies minimal.
- Validate each migration by running it against a throwaway Postgres instance, rolling back, and re-running to prove idempotency.
- Record execution instructions in the PR checklist and mirror persistent steps in `docs/runbooks/deployment.md`.
- Remove legacy migrations only after every environment has applied them and the cleanup is captured in a Sisu note.
