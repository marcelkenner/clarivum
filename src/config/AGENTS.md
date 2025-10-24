# Config · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
The `src/config/` directory holds reusable configuration classes that expose environment, feature flag, and integration settings to Managers and Coordinators.

## Principles

- Treat configuration as a dependency object. Wrap every logical concern in a dedicated class (e.g., `RoutingConfig`, `SeoConfig`, `FeatureFlagConfig`). Each class owns a single responsibility.
- Never read `process.env` or global state inside ViewModels/components. Instead, inject configuration classes through constructors when building Managers or Coordinators.
- Keep constructors synchronous and predictable; configuration classes must not perform I/O. If dynamic data is needed, delegate to a Manager that can be mocked in tests.

## Structure

- Group related configs in subdirectories with their own `AGENTS.md` describing scope and extension points (for example, `environment/`, `analytics/`).
- Export interfaces from `index.ts` files and bind concrete implementations in factories (e.g., `createRuntimeConfig()`).
- Follow single-responsibility rules: split a config file before it exceeds 200 lines or spans multiple domains.

## Guardrails

- Provide type-safe defaults and validation at construction time. Use Value Objects or schema parsing to fail fast when environment variables are missing or malformed.
- Add unit tests for each config class covering happy path, missing values, and overrides. Hook the tests into the daily guardrail cadence and record them in `#kaizen-minute`.
- Reference the configuration usage in documentation (`docs/role-guides/continuous-improvement.md`, relevant PRDs) whenever new toggles or thresholds are introduced.

Maintain the config layer so upstream Managers remain environment-agnostic and easy to reuse across routes or services.
