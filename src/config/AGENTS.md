# Config · AGENTS Guide

The `src/config/` directory centralizes reusable configuration objects that decouple runtime concerns from the UI layer.

- Encapsulate configuration lookups inside dedicated classes to keep business logic out of components.
- Prefer dependency injection so managers and coordinators can accept configuration instances without reaching into `process.env` directly.
- When adding a new configuration area, create a focused subdirectory with its own `AGENTS.md` to document responsibilities and extension points.
