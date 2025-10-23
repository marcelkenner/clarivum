# docs/PRDs/requierments/tools/habits/narzedzia · AGENTS Guide

## Scope
- Individual Habits pillar tools (sleep, stress, ergonomics, routines) that power `/habits/narzedzia/*`.
- Captures assessments, timers, logging journeys, and weekly reporting prior to design/build.

## Workflow Notes
- Use Feature Requirements template; keep each file under 500 lines, focused on one tool.
- Cite behavioural or medical literature via Context7 references; include version/date.
- Coordinate with privacy lead when storing mood, blood pressure, or other sensitive data.

## Collaboration
- Behavioural science lead validates assessment scoring; product marketing approves copy and CTAs.
- Analytics owner sets GA4/server events; document naming conventions inside each PRD.

## Before Shipping Changes
- Run `npm run validate` locally to guard formatting/link integrity.
- Notify Docs maintainers if navigation slugs or taxonomy change (`docs/PRDs/clarivum_brand.md`).
