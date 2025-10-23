# Notifications Runbook

## Scope & objectives
- Operationalize the toast-based notification experience defined in ADR-012.
- Ensure `NotificationManager`, `ToastNotificationCoordinator`, and consuming ViewModels deliver consistent, accessible feedback.
- Provide deployment, theming, and incident procedures across environments (Next.js 15 + Sonner).

## Roles & tooling
- **Owner:** UI Platform Manager.
- **Design partner:** Product design lead (copy + theming).
- **Accessibility reviewer:** QA lead with assistive tech checklist.
- **Tooling:** Sonner docs (`/websites/sonner_emilkowal_ski`), Chromatic visual regression suite, Lighthouse CI, OpenTelemetry events (`notification.triggered`).

## Architecture snapshot
- `NotificationManager` exposes domain-specific methods (success/error/promise) injected into ViewModels.
- `ToastNotificationCoordinator` enforces deduplication, priority routing, and directs to specific Sonner Toaster instances when needed.
- Sonner `Toaster` rendered in `layout.tsx`; theming controlled via `ThemeManager`.

## Release workflow
1. **Design sign-off:** Update copy variants and visual tokens in `docs/design-system/notifications.md` (pending ADR action).
2. **Implementation staging:**
   - Introduce changes behind feature flag (`notifications_theme_experiment`).
   - Update `Toaster` configuration (position, rich colors) referencing Sonner API.
3. **Automated checks:**
   - Run `npm run validate`.
   - Execute Chromatic to detect visual deltas.
   - Capture Lighthouse run ensuring ARIA live region remains announced.
4. **Manual QA:**
   - Keyboard-only dismissal (`toast.dismiss` hotkey).
   - Screen reader verification (VoiceOver/NVDA).
   - Mobile viewport (offset via `mobileOffset` prop per Sonner docs).
5. **Deploy flag** once success criteria met; monitor telemetry for notification engagement.

## Content update procedure
1. Modify notification copy or layout via `NotificationBlueprint` class.
2. Add corresponding unit coverage (snapshot or logic).
3. Validate action buttons render `toast({ action: ... })` with accessible labels (per Sonner API).
4. Update runbook changelog with summary + owner.

## Incident response
1. **Symptoms:** Missing toasts, duplicated toasts, accessibility regression, or runtime errors involving Sonner.
2. **Initial triage:**
   - Check feature flags for active experiments.
   - Review browser console errors referencing `toast`.
   - Inspect recent deploy diff for `Toaster` config or dependency upgrades.
3. **Mitigation steps:**
   - Revert to previous theme via flag (`notifications_theme_experiment=false`).
   - If Sonner upgrade caused regression, pin to prior version and redeploy.
   - Use `toast.dismiss()` programmatically to clear wedged toasts.
4. **Communication:** Announce in `#clarivum-dev` including impacted flows, mitigation, next actions.
5. **Postmortem:** Document root cause, add regression test (Chromatic story or Playwright) if coverage missing.

## Accessibility checklist
- Ensure `containerAriaLabel` set to “Notifications”.
- Provide cancel/action buttons with descriptive labels.
- Dismissible toasts must be reachable via keyboard (`alt+t` hotkey per Sonner defaults).
- Persist critical alerts by setting `duration: Infinity` and requiring explicit dismissal.

## Monitoring & telemetry
- Each ViewModel call to `NotificationManager` emits OpenTelemetry event with `variant`, `source`, `duration`.
- Dashboard tracks toast rate per route; spikes trigger manual audit.
- Capture error rate of promise toasts vs success to ensure copy clarity.

## Change log
- **2025-10-23:** Initial runbook covering notification lifecycle, release, and incident handling.
