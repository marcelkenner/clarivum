# Environment Configuration · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
Environment management code lives here. Treat the environment as a first-class dependency so other layers can stay agnostic about deployment topology.

- Model each deployment (`dev`, `preview`, `prod`, etc.) as an `Environment` class with explicit capabilities (e.g., `supportsPreviewFeatures()`).
- `EnvironmentManager` is the only class that reads raw variables. Validate inputs eagerly, emit descriptive errors, and expose typed getters. Provide test doubles via dependency injection.
- Downstream adapters (feature flags, analytics, payments) must accept an `Environment` instance and remain oblivious to `process.env`.
- Add unit tests for every new branch or capability and log the guardrail in `#kaizen-minute`. Link the Sisu Debugging entry if the change comes from an incident.
