# ADR-030: Request Security Coordinator & Edge Controls
Date: 2025-10-23
Status: Proposed

## Context
- Product scope and functional requirements are defined in `docs/PRDs/requierments/security/traffic-protection.md`; this ADR captures the architectural response.
- Stakeholders requested hardening against bots, spam, and malicious traffic from sanctioned or high-risk geographies (e.g., China, Russia, Iran, Iraq, etc.).
- Existing security baseline (ADR-028) mandates protective controls but lacks a concrete implementation path for request-level enforcement.
- Next.js 15 removes direct geo/IP access on `NextRequest`; Vercel recommends `@vercel/functions` helpers for geolocation (reference via Context7).
- Clarivum depends on edge middleware (ADR-006) for rate limiting; cohesive orchestration is required to avoid fragmented logic across routes.
- Form submissions currently lack honeypots or spam scoring, increasing risk of abuse and operational overhead for manual triage.

## Decision
- Introduce a stateless `RequestSecurityCoordinator` middleware layer that orchestrates specialized managers:
  - `CountryAccessManager` enforces deny/allow lists backed by configuration mapped per environment.
  - `BotMitigationManager` aggregates signals (user agent, header entropy, velocity, optional BotID integration) and yields block decisions.
  - `FormHygieneManager` injects honeypot directives and validates submissions from shared form handlers.
- Implement middleware using `@vercel/functions` `geolocation`/`ipAddress` utilities and expose overrides via custom headers for testing.
- Store policy configuration in typed JSON under `config/security/` with dependency injection to keep modules reusable.
- Emit structured security events to the diagnostics platform for observability and false-positive review.
- Guard rollout via Flagsmith feature flags and document operational procedures in a dedicated runbook.

## Diagrams
- [Architecture Overview](../diagrams/adr-030-request-security-coordinator/architecture-overview.mmd) — Request flow from edge middleware through coordinators and managers.
- [Data Lineage](../diagrams/adr-030-request-security-coordinator/data-lineage.mmd) — Signals received, decision outcomes, and telemetry exports.
- [UML Components](../diagrams/adr-030-request-security-coordinator/uml-components.mmd) — Coordinator, managers, configuration adapters, and observability emitters.
- [BPMN Rollout Flow](../diagrams/adr-030-request-security-coordinator/bpmn-rollout.mmd) — Policy authoring, testing, approval, and deployment orchestration.

## Consequences
- **Positive:** Centralizes access policies, reduces spam, and provides auditable decisions per request.
- **Negative:** Adds edge middleware latency (<5 ms target) and requires ongoing policy curation.
- **Follow-ups:** 
  - Produce the referenced diagrams before code merge.
  - Validate compatibility with rate limiting platform to avoid duplicate throttling.
  - Evaluate managed bot mitigation vendors during post-launch optimization.
