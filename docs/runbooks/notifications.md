# Notifications Runbook

## Scope & objectives
- Operationalize the toast + Novu notification experience defined in ADR-012.
- Ensure `NotificationManager`, `ToastNotificationCoordinator`, `NovuNotificationPublisher`, and consuming ViewModels deliver consistent, accessible feedback across channels.
- Provide deployment, theming, and incident procedures across environments (Next.js 15 + Sonner + self-hosted Novu).
- For channel selection guidance, refer to `docs/runbooks/communication-channel-selection.md`.

## Roles & tooling
- **Owner:** UI Platform Manager (front-of-house UX) & Platform Notifications Owner (Novu infrastructure).
- **Design partner:** Product design lead (copy + theming).
- **Accessibility reviewer:** QA lead with assistive tech checklist.
- **Tooling:** Sonner docs (`/websites/sonner_emilkowal_ski`), Novu self-hosting guide (`/novuhq/docs`), Chromatic visual regression suite, Lighthouse CI, OpenTelemetry events (`notification.triggered`, `notification.delivered`).

## Architecture snapshot
- `NotificationManager` exposes domain-specific methods (success/error/promise) injected into ViewModels, then distributes to Sonner + Novu.
- `ToastNotificationCoordinator` enforces deduplication, priority routing, and directs to specific Sonner Toaster instances when needed.
- `NovuNotificationPublisher` calls the Novu Node SDK with `serverURL` pointing at the self-hosted API (`new Novu({ secretKey, serverURL })` per Context7).
- Sonner `Toaster` rendered in `layout.tsx`; theming controlled via `ThemeManager`.
- Novu services run on ECS Fargate (API, worker) with MongoDB + Redis backends; secrets stored in AWS Secrets Manager.

## Release workflow
1. **Design sign-off:** Update copy variants and visual tokens in `docs/design-system/notifications.md` (pending ADR action).
2. **Implementation in dev:**
   - Introduce changes behind feature flag (`notifications_theme_experiment`) for Sonner UI adjustments.
   - Update `Toaster` configuration (position, rich colors) referencing Sonner API.
   - Update Novu workflows/templates in the staging project; snapshot JSON exported to repo under `packages/notifications/workflows/`.
3. **Automated checks:**
   - Run `npm run validate`.
   - Execute Chromatic to detect visual deltas.
   - Capture Lighthouse run ensuring ARIA live region remains announced.
   - Run `npm run notifications:test` (Novu SDK contract tests) once available.
4. **Manual QA:**
   - Keyboard-only dismissal (`toast.dismiss` hotkey).
   - Screen reader verification (VoiceOver/NVDA).
   - Mobile viewport (offset via `mobileOffset` prop per Sonner docs).
   - Trigger Novu test subscribers (seed accounts) and confirm inbox/email delivery.
5. **Deploy flag** once success criteria met; promote Novu workflow to production via CI rollout and monitor telemetry for notification engagement.

## Content update procedure
1. Modify notification copy or layout via `NotificationBlueprint` class.
2. Add corresponding unit coverage (snapshot or logic).
3. Update Novu template variant if copy impacts cross-channel messaging; ensure localized strings propagate.
4. Validate action buttons render `toast({ action: ... })` with accessible labels (per Sonner API).
5. Update runbook changelog with summary + owner.

## Incident response
1. **Symptoms:** Missing toasts, duplicated toasts, accessibility regression, Novu workflow failures, or runtime errors involving Sonner/Novu SDK.
2. **Initial triage:**
   - Check feature flags for active experiments.
   - Review browser console errors referencing `toast` or `Novu`.
   - Inspect Novu API health (ECS service status, MongoDB/Redis metrics).
   - Inspect recent deploy diff for `Toaster` config, Novu workflow changes, or dependency upgrades.
3. **Mitigation steps:**
   - Revert to previous theme via flag (`notifications_theme_experiment=false`).
   - If Sonner upgrade caused regression, pin to prior version and redeploy.
   - Use `toast.dismiss()` programmatically to clear wedged toasts.
   - For Novu incidents: scale ECS service replicas, recycle workers, or switch workflows to fallback template via Novu dashboard; validate `serverURL` secrets.
4. **Communication:** Announce in `#clarivum-dev` including impacted flows, mitigation, next actions.
5. **Postmortem:** Document root cause, add regression test (Chromatic story or Playwright) if coverage missing.

## Accessibility checklist
- Ensure `containerAriaLabel` set to “Notifications”.
- Provide cancel/action buttons with descriptive labels.
- Dismissible toasts must be reachable via keyboard (`alt+t` hotkey per Sonner defaults).
- Persist critical alerts by setting `duration: Infinity` and requiring explicit dismissal.

## Monitoring & telemetry
- Each ViewModel call to `NotificationManager` emits OpenTelemetry event with `variant`, `source`, `duration`.
- Novu delivery webhooks feed into `notification.delivery` metric (success/error per channel).
- Dashboard tracks toast rate per route and Novu delivery success; spikes trigger manual audit.
- Capture error rate of promise toasts vs success to ensure copy clarity.

## Change log
- **2025-10-26:** Added Novu self-hosting operations, workflow QA, and telemetry guidance.
- **2025-10-23:** Initial runbook covering notification lifecycle, release, and incident handling.
