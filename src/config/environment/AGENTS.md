# Environment Configuration · AGENTS Guide

Environment management code lives here. Treat the environment as a first-class dependency so other layers can remain agnostic about deployment topology.

- Use `Environment` to represent a concrete deployment (`dev`, `prod`) and gate logic through its methods rather than ad-hoc string checks.
- `EnvironmentManager` is the single entry point for resolving the active environment from `process.env`. Inject alternatives in tests when needed.
- Keep additional adapters (flags, analytics, APIs) environment-agnostic by accepting an `Environment` instance instead of reading globals.
