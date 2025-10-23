# ADR-005: Feature Flag & Experimentation Platform
Date: 2025-10-21
Status: Accepted

## Context
- Trunk-based development with progressive delivery is a core guardrail (PTRD Section 8).
- We need a low-friction way to hide unfinished features, run limited rollouts, and coordinate experiments across verticals without custom infrastructure.
- The solution must offer a hosted control plane, SDK support for Next.js (including edge), and role-based access for marketers/PMs.
- Functional requirements are captured in `docs/PRDs/requierments/feature-flags/feature-requirements.md`.

## Decision
- Adopt **Flagsmith (managed SaaS)** for feature flag management and simple experimentation.
  - Use the EU-hosted Flagsmith environment to satisfy GDPR requirements.
  - Environments: `dev`, `prod`. Only engineering can toggle in dev; production toggles require dual approval (engineering + product). Preview deployments inherit the `dev` configuration.
  - Integrate the Flagsmith JavaScript SDK in the Next.js app (SSR + client). Evaluate edge SDK once edge middleware is introduced.
- Store flag metadata (ownership, rollout plan, expiry date) in `flagsmith` tags; expose them via documentation automation (`npm run flags:report` to be added).
- Wire Flagsmith audit logs to Grafana Loki for compliance and change tracking.

## Diagrams
- [Architecture Overview](../diagrams/adr-005-feature-flags/architecture-overview.mmd) — Flagsmith control plane, SDK, caching, and observability integration.
- [Data Lineage](../diagrams/adr-005-feature-flags/data-lineage.mmd) — Flag definitions, variants, audits, and cached states.
- [UML SDK Components](../diagrams/adr-005-feature-flags/uml-sdk.mmd) — Client abstractions managing fetch, caching, and audit publishing.
- [BPMN Flag Lifecycle](../diagrams/adr-005-feature-flags/bpmn-flag-lifecycle.mmd) — Governance flow from flag proposal through sunsetting.

## Consequences
- **Benefits:** Hosted solution with role-based access, audit trails, and native SDKs. Enables phased rollouts and marketing-controlled toggles without deploys.
- **Risks:** SaaS dependency; risk mitigated by exporting flag configs nightly and keeping a migration path to open-source Unleash if costs or features become limiting.
- **Operational impact:** Introduces runtime dependency on Flagsmith API; implement 200 ms fallback timeout with cached flag values to protect performance budgets.
- **Follow-ups:**
  - Define flag lifecycle policy (creation, ownership, expiry) in the deployment runbook.
  - Automate stale flag detection via weekly CI job that alerts when flags exceed their `sunset_date`.
