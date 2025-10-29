# cms/src/api/healthz/routes · AGENTS Guide

Defines the Strapi router config for `/api/healthz`. Treat it as infrastructure-critical—deployment workflows and ALB health checks rely on the route shape.

- Keep the method (`GET`), path (`/healthz`), and handler (`api::healthz.healthz.status`) stable. Any rename requires coordinated changes in CI/CD (`.github/workflows/strapi-ci-cd.yml`) and ADR updates.
- The route must remain unauthenticated (`auth: false`) with no custom middleware. Health probes run before session bootstrapping and from outside the Clarivum network.
- When adding rate limits or additional policies, confirm they do not block AWS ALB checks (10-second timeout, retries) and document the change in `docs/runbooks/deployment.md`.
- Reference the Strapi routing guide through Context7 (`/strapi/documentation`) for syntax questions.
