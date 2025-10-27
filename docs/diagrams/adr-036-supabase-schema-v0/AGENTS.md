# ADR-036 Diagrams · AGENTS Guide

- `architecture-overview.mmd` — High-level flow of Next.js, Strapi, and external systems interacting with Supabase Schema v0 tables. Update whenever integration points shift.
- `data-lineage.mmd` — ER diagram highlighting personas, profiles, leads, content items, and entitlement relationships plus hashed identifier usage. Keep column names aligned with migrations.
- `uml-components.mmd` — UML class diagram covering audit trigger reuse and table dependencies. Extend when new triggers or supporting tables appear.
- `bpmn-migration.mmd` — BPMN-style flow (Mermaid) describing the expand → migrate → contract guardrails. Revise when deployment automation or validation steps change.
- `migration-sequence.mmd` — Sequence view for developer/tooling interactions; use it to validate step ordering against the zero-downtime runbook.
