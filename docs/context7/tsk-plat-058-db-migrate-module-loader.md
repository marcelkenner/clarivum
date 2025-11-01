# CONTEXT7 · TSK-PLAT-058 — Migration Dependency Guard

## References
- [ADR-001: Primary Cloud & Database](../adr/ADR-001-primary-cloud-and-database.md)
- [Zero-Downtime Migrations Runbook](../runbooks/zero-downtime-migrations.md)

## Problem
- Running `npm run db:migrate -- --env <env>` currently fails with `ERR_MODULE_NOT_FOUND` because the scripts rely on the `pg` package being resolvable at import time.
- When the dependency is missing (fresh checkout, partial install, or corrupted `node_modules`), Node throws before we can emit actionable guidance that aligns with the Aurora operational guardrails.
- We need a predictable, AWS-aligned path for migrations with observability-friendly error messaging so engineers can recover quickly.

## Design
- Introduce a tiny gateway (`loadPgModule`) in `scripts/lib/` that lazily imports `pg`, adds contextual logging, and wraps module-not-found failures with explicit recovery steps (source nvm → install deps).
- Add a sibling loader (`loadSecretsManagerModule`) that dynamically resolves `@aws-sdk/client-secrets-manager`, raising `AwsSecretsManagerModuleMissingError` with the same remediation guidance when the AWS SDK package has not been installed yet.
- Update `db-migrate.mjs` and `db-migration-status.mjs` to consume the gateway via top-level `await`, ensuring both commands share the same dependency guard.
- Update `database-url-provider.mjs` to hydrate its `SecretsManagerGateway` via `loadSecretsManagerModule(label)` so fetching secrets cannot explode before we surface the actionable install steps.
- Bubble the wrapped errors so the existing `catch` blocks still exit with status `1`, but the console output now references ADR-001/runbook expectations and how to remediate.

```text
db-migrate.mjs ─┐
                ├─> loadPgModule(label)
db-migration-status.mjs ┘         │
                                  ├─ success → return { Client }
                                  └─ failure → PgModuleMissingError (install guidance)

database-url-provider.mjs ─┐
                           ├─> loadSecretsManagerModule(label)
SecretsManagerGateway      │         │
                           │         ├─ success → return { SecretsManagerClient, GetSecretValueCommand }
                           │         └─ failure → AwsSecretsManagerModuleMissingError (same install guidance)
                           └─> hydrate SecretsManagerClient lazily per region
```

```pseudo
function loadPgModule({ label, moduleLoader = import("pg") }):
  try:
    return await moduleLoader()
  catch error where error.code == "ERR_MODULE_NOT_FOUND":
    message = `[${label}] Missing dependency 'pg'. Run 'source ~/.nvm/nvm.sh && nvm use --silent && npm install'.`
    throw new PgModuleMissingError(message, cause=error)

function loadSecretsManagerModule({ label, moduleLoader = import("@aws-sdk/client-secrets-manager") }):
  try:
    return await moduleLoader()
  catch error where error.code == "ERR_MODULE_NOT_FOUND":
    message = `[${label}] Missing dependency '@aws-sdk/client-secrets-manager'. Run 'source ~/.nvm/nvm.sh && nvm use --silent && npm install'.`
    throw new AwsSecretsManagerModuleMissingError(message, cause=error)
```

## Acceptance Checks
1. **Given** a workspace without `pg` installed **when** `npm run db:migrate -- --env dev` executes **then** the CLI surfaces the contextual guidance and exits non-zero without a stack trace wall.
2. **Given** `pg` is installed **when** migrations run **then** the scripts behave exactly as before (connect, apply migrations, respect SSL flagging).
3. **Given** the new loader **when** unit tests simulate a missing module **then** the wrapped error includes remediation instructions referencing the nvm install flow.
4. **Given** `@aws-sdk/client-secrets-manager` is missing **when** `npm run db:migrate -- --env dev` executes **then** the database URL loader catches the failure, emits the same remediation guidance, and exits non-zero without hiding the root cause.
