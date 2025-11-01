# Coding guidelines

- Always follow AGENTS.md guardrails: keep files <500 lines (break near 400), enforce OOP composition with dedicated classes/managers/coordinators/view models per responsibility, avoid god classes, apply SRP.
- Use descriptive, intention-revealing names; avoid vague placeholders.
- Maintain modular, reusable design with DI/protocol extension points; never mix UI and business logic.
- Ensure functions stay under ~30-40 lines; split classes beyond ~200 lines into focused helpers.
- Infrastructure is AWS-centric; do not introduce Supabase.
- Leverage Context7 for documentation lookups; warm NVM (`source ~/.nvm/nvm.sh`) before commands.
