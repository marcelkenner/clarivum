# Request Security Controls Runbook

Use this runbook to operate Clarivum’s request-level protections: country access rules, bot mitigation, and honeypot validation.

## Prerequisites
- Vercel project access with ability to deploy middleware updates.
- Flagsmith feature toggles `request-security` and `honeypot-validation`.
- Familiarity with configuration files under `config/security/` (to be introduced during implementation).
- Observability dashboards in Grafana (`Clarivum/Security-Events`) and Flagsmith audit logs.

## Change Workflow
1. **Create Change Record:** File a ticket referencing `TSK-PLAT-028` (security traffic protection) or follow-up tasks. Capture reason, expected impact, and validation plan.
2. **Update Configuration:** Modify the relevant JSON configuration:
   - `countryPolicies.json` — adjust deny/allow lists; include justification.
   - `honeypotSettings.json` — rotate field names, thresholds.
   - `botSignals.json` — tweak scoring weights or provider keys.
   Use a feature branch and open PR referencing ADR-030.
3. **Peer Review:** Require approval from Security Champion and DevOps Lead. Confirm no file exceeds 500 lines and each manager remains single-responsibility.
4. **Staging Validation:**
   - Deploy to preview via Vercel.
   - Simulate requests using `curl` with `x-clarivum-country` header values (e.g., `CN`, `US`).
   - Submit form payloads populating honeypot fields to confirm automatic rejection.
   - Inspect Grafana dashboards to verify event emission.
5. **Flagged Rollout:** Enable `request-security` flag for 10% traffic, monitor metrics for 30 minutes. Proceed to 100% if block rate and latency stay within thresholds.

## Incident Response
- **Unexpected Blocking:** Immediately disable the feature flag. Review logs for `false_positive` tags and revert configuration commit.
- **Honeypot Evasion Spike:** Rotate honeypot field names, increase scoring thresholds, and consider enabling CAPTCHA fallback (separate feature flag).
- **Bot Surge:** Engage rate limiting platform per ADR-006; escalate to Security Champion. Evaluate third-party bot provider activation.

## Telemetry & Reporting
- Primary metrics: `blocked_requests_total` (labels: reason, country), `honeypot_trigger_total`, `bot_score_histogram`.
- Alerts:
  - `security_false_positive_rate > 0.5%` over 15m.
  - `blocked_requests_total{reason="country"} > baseline x3` over 30m.
- Weekly review: Export event summaries to security governance meeting notes.

## Escalation Matrix
- **Security Champion:** owns policy adjustments.
- **DevOps Lead:** handles deployment or runtime defects.
- **Product Support:** communicates with affected customers; use pre-approved messaging from Legal.
- For persistent attacks, open incident via `docs/runbooks/incident-response.md`.

## References
- `docs/PRDs/requierments/security/traffic-protection.md`
- `docs/adr/ADR-030-request-security-coordinator.md`
- `docs/policies/security-baseline.md`
- Flagsmith environment guide (`docs/adr/ADR-005-feature-flags.md`)
