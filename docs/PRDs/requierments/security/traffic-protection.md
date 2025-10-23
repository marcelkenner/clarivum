# Traffic Protection Requirements

> **Canonical references:** `docs/adr/ADR-028-security-and-compliance-baseline.md` sets platform guardrails; `docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md` defines edge capabilities.

## Objective
- Prevent automated abuse, spam, and malicious traffic from high-risk geographies without degrading legitimate user experiences.
- Establish reusable guardrails for country-based access policies, bot detection, and form submission hygiene.

## Scope
- All public web properties deployed on Vercel, including marketing pages and interactive flows.
- Both server components and API routes invoked during form submissions or authenticated actions.
- Excludes mobile apps (future work) and on-premise integrations.

## Target Outcomes
- Business: Reduce fraudulent sign-ups and spam form submissions by ≥90% within three months.
- Brand: Demonstrate proactive security posture to stakeholders and auditors.
- Operations: Provide deterministic controls with documented override and review cycles.

## Primary Personas
- **Security Champion:** Defines policies, validates telemetry, and coordinates reviews.
- **Frontend Engineer:** Integrates honeypots and exposes client hints necessary for detection.
- **DevOps Lead:** Manages edge configuration and country block lists across environments.

## Experience Principles
- Keep friction invisible for legitimate users; use silent controls (geo blocks, honeypots) before CAPTCHAs.
- Provide localized access denied messaging with escalation path (support email) when traffic is blocked.
- Expose observability signals for every mitigation action to permit rapid tuning.

## Functional Requirements
- **FR1 — Country Access Control:** Enforce denylist for high-risk countries (initially CN, RU, IR, IQ, KP, SY, AF, BY) at the edge with per-environment overrides.
- **FR2 — Allowlist Exceptions:** Support explicit per-IP or per-path overrides to permit vetted partners or internal QA.
- **FR3 — Bot Detection Signals:** Collect user agent, header entropy, and request velocities for scoring; support pluggable bot providers (e.g., Vercel BotID).
- **FR4 — Honeypot Fields:** Implement invisible honeypot fields for all net-new forms with configurable field names to evade pattern recognition.
- **FR5 — Spam Throttling:** Rate-limit repeat submissions per IP/device fingerprint while logging metadata for analysis.
- **FR6 — Observability:** Emit structured security events (blocked_country, honeypot_triggered, bot_score_low) to the diagnostics platform.
- **FR7 — Administration:** Provide configuration surface (JSON or CMS integration) for security team to adjust denylist/thresholds with audit logging.

## Non-Functional Requirements
- Edge middleware must add <5 ms latency at p95 and remain idempotent.
- Country detection should degrade gracefully if geolocation headers are missing (default allow with alert).
- All controls must be testable in preview environments using header overrides (`x-clarivum-country`).
- Source code and configuration must stay under 500 lines per file and align with single responsibility principles.

## Dependencies
- `@vercel/functions` for geolocation/IP (verify via Context7 before implementation).
- Existing rate limiting platform (ADR-006) for throttling integration.
- Diagnostics platform (ADR-021) for event ingestion.
- Feature flagging via Flagsmith for progressive rollout.

## Analytics & KPIs
- Block rate per mitigation channel (country, honeypot, bot score).
- False positive rate (<0.5% of legitimate traffic blocked).
- Time to adjust policies (target <1 business day).
- Volume of spam submissions pre/post launch.

## Risks & Mitigations
- **Overblocking legitimate traffic:** Provide override workflows and monitor false positives daily during launch.
- **Evasion of honeypots:** Rotate field names regularly and randomize DOM ordering.
- **Latency regressions:** Benchmark middleware and apply caching where safe.
- **Compliance considerations:** Document rationale and policy approvals in security governance records.

## Launch Checklist
- Policies approved by Security Champion and Legal.
- Alerting configured for mitigation actions exceeding baseline thresholds.
- Runbook for request security operations published (see `docs/runbooks/request-security-controls.md`).
- Tasks created in backlog with owners and estimates.
- Dry run completed in staging with simulated malicious traffic patterns.

## Open Questions
- Should we procure a managed bot mitigation vendor (BotID vs. Cloudflare Turnstile) for advanced scenarios?
- How will we rotate denylist policy and override data (GitOps vs. admin UI)?
- Do we need to mirror controls at CDN/WAF layer outside Vercel for redundancy?
