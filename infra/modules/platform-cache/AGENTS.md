# platform-cache module · AGENTS Guide

- Keep changes in sync with `docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md`.
- This module provisions the shared ElastiCache Serverless cache plus the security boundary that allows platform Lambdas to connect over TLS on port 6379.
- VPC inputs must reference private subnets; the cache automatically spans all provided subnets.
- Never widen the security group ingress beyond the platform Lambda security group without consulting the Platform Performance team.
- Outputs feed Lambda environment variables (`UV_WIDGET_CACHE_*`). Update the consuming code when renaming outputs.
- Run `terraform fmt` after editing files in this module.
