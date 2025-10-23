# Pull Request Checklist

Use this checklist before requesting review. It covers quality, testing, observability, and security guardrails derived from the PTRD.

## Required checks

- [ ] Scope is smallest reasonable slice; feature remains behind a Flagsmith flag if incomplete.
- [ ] ADR impact assessed. New or changed architectural decisions captured via new ADR or ADR update.
- [ ] Documentation updated (`docs/`, product copy, changelog) or explicitly noted as not needed.
- [ ] Diagrams created or refreshed per `docs/policies/diagramming-policy.md` (architecture, data, UML, BPMN).

## Testing

- [ ] Unit tests cover new logic and regression cases.
- [ ] Contract/service tests updated (API schemas, job payloads).
- [ ] E2E smoke (Playwright) passes in CI for affected journeys.
- [ ] Telemetry: traces/spans + metrics + logs instrumentation added or updated.

## Security & compliance

- [ ] Input validation and output encoding verified (Zod schemas, sanitization).
- [ ] AuthZ/AuthN implications reviewed; privileged actions covered by RBAC checks.
- [ ] Secrets stay out of code/config; environment references only.
- [ ] PII handling complies with retention and encryption policies.

## Observability & operations

- [ ] Alert thresholds reviewed if SLOs impacted.
- [ ] Runbooks or dashboards updated when operational work changes.
- [ ] Feature flags documented with owner, expiry, and rollout plan.

## Reviewer guidance

- Confirm checklist items are complete; request clarifications when unchecked.
- Ensure PR links to related tickets/incidents.
- Validate changes against the shared dev environment once merged, especially for Sev-1/2 fixes.

Attach this checklist (or reference it) in the PR description. CI enforces presence via a template gating rule.
