# src/app/\_components · AGENTS Guide

Shared helpers that multiple routes import. Keep modules minimal, documented, and covered by the surrounding guardrails.

- `WebVitalsReporter.tsx` is a client component that wires Next.js `useReportWebVitals` into our analytics dispatcher. Before changing it:
  - Review Context7 `/vercel/next.js` docs for `useReportWebVitals`.
  - Update `src/lib/analytics/dispatch.ts` with any new telemetry event names.
  - Never emit raw network requests from here; reuse analytics/observability helpers so secrets stay server-side.
- Prefer keeping UI components close to their routes. Promote code into `_components` only when it is reused in at least two segments.
- After edits, run `npm run check:seo` (or `npm run test -- WebVitalsReporter`) to confirm telemetry guardrails continue to pass.
- When telemetry behavior changes, document it in `docs/runbooks/seo-operations.md` and refresh relevant ADRs.
