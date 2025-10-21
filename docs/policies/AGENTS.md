# Policies · AGENTS Guide

Policy documents in this directory capture commitments (error budgets, security baselines, governance). Treat them as binding agreements.

## Editing principles

- Coordinate with the engineering lead and relevant stakeholders (security, product) before changes.
- Note effective dates and owners when updating policies.
- Tie every change back to an ADR, PTRD section, or incident/root cause analysis.
- Validate external references (OWASP, CIS, etc.) via Context7 or official docs before citing them.

## Review checklist

- [ ] Policy aligns with current architecture (`docs/architecture.md`) and ADRs.
- [ ] Enforcement mechanisms (CI checks, runbook steps) exist and are up to date.
- [ ] Budget/threshold numbers match dashboards and alerts.
- [ ] Communication plan for stakeholders documented.
