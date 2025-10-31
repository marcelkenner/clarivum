# src/app/sentry-example-page · AGENTS Guide

This demo page provides a one-click smoke test for our Sentry web instrumentation. It pairs with `src/app/api/sentry-example-api` to exercise both frontend and backend capture paths.

## Page Behaviour

- The page is marked `use client`; keep it that way so the throw originates in the browser context.
- The primary button wraps its work in `Sentry.startSpan`, fetches the paired API route, and then throws `SentryExampleFrontendError`. Maintain this order—Sentry expects both the network span and the client error.
- `Sentry.diagnoseSdkConnectivity()` runs on mount to warn about ad blockers. If you adjust connectivity logic, ensure the guidance still makes sense for support teams.

## Editing Tips

- Keep the example lightweight: avoid adding navigation links or production UI chrome.
- Update copy or links when Sentry project URLs change; coordinate with observability runbook owners for audit trails.
- Styles are inline for portability. If you refactor them, keep the button affordance obvious and the warning states accessible.

## Verification

- Run `npm run dev`, load `/sentry-example-page`, click “Throw Sample Error,” and confirm both a frontend error and backend error land in the correct Sentry project.
- Execute `npm run validate` after edits. No additional automated tests exist because the page is intentionally interactive.

## Guardrails

- Do not import application state or feature code into this demo—it must stay isolated from core flows.
- Keep links internal-only (e.g., docs, Sentry Issues). Never expose secrets, DSNs, or incident details in the UI.
- For SDK upgrades or new Sentry APIs, rely on Context7 documentation before changing spans or helper calls.
