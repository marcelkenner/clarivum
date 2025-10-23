Below is an **A–Z requirements specification** for **/skin/narzedzia/timer-reaplikacji — SPF Reapplication Timer**. It blends **functional** and **non‑functional** requirements, with concrete schemas, rules, and acceptance criteria so your team can implement it end‑to‑end.

---

## A) API surface (public contract)

**Endpoints**

1. **UI page**

* `GET /skin/narzedzia/timer-reaplikacji/`
  Serves the interactive tool (HTML + JS).

2. **Computation API (stateless)**

* `POST /api/skin/timer-reapply/compute`

  * **Request (JSON)**

    ```json
    {
      "last_application_ts": "ISO-8601 date-time, required",
      "water_resistance": "none|40|80",
      "exposure": {
        "in_water_or_heavy_sweat": false,
        "towel_dried_or_wiped": false
      },
      "environment": "indoor_low_uv|mostly_outdoor",
      "user_timezone": "IANA TZ like Europe/Warsaw (optional)",
      "now_ts": "ISO-8601 for testing/preview (optional)"
    }
    ```
  * **Response 200 (JSON)**

    ```json
    {
      "next_reapply_ts": "ISO-8601",
      "minutes_remaining": 37,
      "rule_used": "baseline|40min_water|80min_water|towel_dried_override",
      "notes": [
        "Reapply sooner after towel-drying or rubbing off.",
        "If makeup on top, consider SPF top-up method."
      ]
    }
    ```
  * **Error responses**

    * `400` invalid input schema (e.g., missing `last_application_ts`).
    * `422` logical error (e.g., `last_application_ts` in the future).
    * `429` rate limited.
    * `500` unexpected server error.

**Headers**

* `Content-Type: application/json`
* `Cache-Control: no-store`
* Optional for testing: `X-Now-Override: <ISO-8601>` (if you prefer header over `now_ts` body).

**Versioning**

* `Accept: application/vnd.timer-reapply.v1+json` (see §V).

---

## B) Business rules & algorithm (authoritative logic)

1. **Baseline interval** `I = 120` minutes.
2. **Priority overrides (highest → lowest):**

   1. If `exposure.towel_dried_or_wiped = true` → **due now**. Set `I = 0`, `rule_used = "towel_dried_override"`.
   2. Else if `exposure.in_water_or_heavy_sweat = true`:

      * If `water_resistance = "80"` → `I = 80`, `rule_used = "80min_water"`.
      * Else if `water_resistance = "40"` → `I = 40`, `rule_used = "40min_water"`.
      * Else (`"none"`) → `I = min(120, 40) = 40`, `rule_used = "40min_water"` (conservative).
   3. Else (no water/heavy sweat): keep baseline `I = 120`, `rule_used = "baseline"`.
3. **Environment note:** `environment = "indoor_low_uv"` **does not extend** beyond 120. It affects **messaging only** (see §G) when no water/sweat is reported.
4. **Compute target**

   * `T_next = last_application_ts + I minutes` (preserve original timezone/offset when formatting).
   * `minutes_remaining = max(0, floor((T_next - now)/60 seconds))`.
   * “Due now” is represented by `minutes_remaining = 0`.
5. **No state is stored server-side** (stateless compute).

---

## C) Clocks, time & timezone handling

* Accept **any valid ISO‑8601** with offset or `Z`.
* If `user_timezone` is supplied, **display** values in that zone; computation uses absolute instants.
* `now` defaults to **server monotonic wall-clock**; can be overridden via `now_ts`/`X-Now-Override` for tests.
* Handle DST/offset changes: add minutes in **UTC instant space**, then render in target timezone.
* Precision: seconds-level, but the public field `minutes_remaining` is **integer** (floor).
* If `last_application_ts` is > 36 hours ago, include a **note** suggesting fresh application before counting (messaging only).

---

## D) Data model & types (JSON Schema excerpts)

**Request (draft‑2020‑12)**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["last_application_ts", "water_resistance", "exposure", "environment"],
  "properties": {
    "last_application_ts": { "type": "string", "format": "date-time" },
    "water_resistance": { "type": "string", "enum": ["none", "40", "80"] },
    "exposure": {
      "type": "object",
      "required": ["in_water_or_heavy_sweat", "towel_dried_or_wiped"],
      "properties": {
        "in_water_or_heavy_sweat": { "type": "boolean" },
        "towel_dried_or_wiped": { "type": "boolean" }
      },
      "additionalProperties": false
    },
    "environment": { "type": "string", "enum": ["indoor_low_uv", "mostly_outdoor"] },
    "user_timezone": { "type": "string" },
    "now_ts": { "type": "string", "format": "date-time" }
  },
  "additionalProperties": false
}
```

**Response**

```json
{
  "type": "object",
  "required": ["next_reapply_ts", "minutes_remaining", "rule_used", "notes"],
  "properties": {
    "next_reapply_ts": { "type": "string", "format": "date-time" },
    "minutes_remaining": { "type": "integer", "minimum": 0 },
    "rule_used": {
      "type": "string",
      "enum": ["baseline", "40min_water", "80min_water", "towel_dried_override"]
    },
    "notes": { "type": "array", "items": { "type": "string" } }
  },
  "additionalProperties": false
}
```

---

## E) Edge cases & validation (functional)

* **Missing `last_application_ts`** → `400` with field error: `"last_application_ts is required"`.
* **Malformed timestamps** → `400` with pointer to offending field.
* **Future `last_application_ts`** relative to `now` → `422` with code `LAST_APPLICATION_IN_FUTURE`.
* **Unknown enum values** → `400` with code `INVALID_ENUM`.
* **Conflicting inputs**: none produce an error; rules are **deterministic** due to priority list (§B).
* **Extreme ages** of `last_application_ts` (weeks/months) → compute normally **plus** advisory note.
* **Missing/blank booleans** → schema rejects (`400`).
* **Clock skew**: if `now_ts` precedes `last_application_ts` due to skew, still caught by the future‑timestamp rule.

---

## F) Front‑end UX (page behavior)

* **Form fields**: datetime picker (with timezone hint), radio for water resistance, binary toggles for the two exposures, environment selector.
* **Primary action**: “Compute next reapplication”.
* **Result card**:

  * “Next reapplication at: **{local time}**”
  * “Time remaining: **{minutes_remaining} min**”, with a minute countdown.
  * **Rule badge**: “Baseline 120”, “40 min (water)”, “80 min (water)”, or “Towel-dried — reapply now”.
  * **Notes list** (contextual).
* **Countdown**: runs every 1s; when reaches 0, changes label to **“Due now”** and announces via ARIA live region.
* **“Reset last application to now”** button; optionally **“Remember my last application”** (localStorage, see §S).
* **Error display**: inline field errors; non-field errors in a dismissible alert.
* **Language toggle**: PL / EN (see §I).
* **Disclaimers**: “Educational tool; does not replace product label or medical advice.”

---

## G) Guidance & content strings (notes logic)

* Always include:

  * “Reapply sooner after towel‑drying or rubbing off.”
* If `exposure.towel_dried_or_wiped = true`:

  * Prepend “Reapply now due to towel‑drying/wiping.”
* If `exposure.in_water_or_heavy_sweat = true` and `water_resistance = "none"`:

  * Add “Product not water‑resistant; 40‑min conservative interval used.”
* If `environment = "indoor_low_uv"` and no water/sweat:

  * Add “Indoors near windows still has UV; many people reapply every ~2 hours.”
* If `minutes_remaining = 0`:

  * Add “If wearing makeup, consider top‑up methods (spray/powder SPF).”
* If `last_application_ts` > 36h ago:

  * Add “If it has been a long time since application, consider applying fresh sunscreen first.”

Provide strings in both **EN** and **PL** (see §I).

---

## H) HTTP semantics, caching & CORS

* `Cache-Control: no-store` for API responses (time‑varying).
* CORS: allow only approved origins (site domain(s)).
* Timeouts: 2s server timeout; expected p50 latency ≤ 50ms (see §N).
* Idempotent compute: identical inputs → identical outputs.

---

## I) Internationalization & localization

* **Languages**: English (default), Polish.
* **Date/time formatting**: locale‑aware (`Intl.DateTimeFormat`) with explicit timezone display.
* **String catalog**: keys for titles, labels, notes, errors, and disclaimers.
* **Right‑to‑left** support not required now, but avoid hard‑coded directions.

---

## J) Jobs & scheduling

* No server cron required.
* **Client countdown** uses `setInterval(1000)` or a Web Worker to avoid throttling.
* On page regain focus (visibility change), **recompute** from API or locally to correct drift.

---

## K) Keyboard & accessibility

* **WCAG 2.2 AA**: focus rings, 4.5:1 contrast, no color‑only cues.
* Labels and `aria-describedby` for all controls.
* **ARIA live region** (`aria-live="polite"`) announces “Due now”.
* All functionality accessible via keyboard; tab order logical.
* Datetime input must be usable without a mouse.

---

## L) Logging & monitoring

* **Server logs**: structured JSON with `request_id`, `timestamp`, `status`, `latency_ms`, and **no PII beyond coarse country/IP**.
* **Do not log** exact `last_application_ts` unless in **debug mode** behind admin flag.
* Error logs include validation codes and stack traces (server‑side only).

---

## M) Metrics & analytics (privacy‑preserving)

* Counters: `compute_requests_total`, `compute_success_total`, `compute_error_total`.
* Distribution: `latency_ms`.
* UI events (aggregated, anonymous): tool opened, compute clicked, rule_used enum occurrences, due_now impressions.
* No cross‑site identifiers; no precise timestamps tied to users.

---

## N) Non‑functional targets (SLOs)

* **Availability**: 99.9% monthly for API.
* **Latency**: p50 ≤ 50ms, p95 ≤ 200ms at 50 RPS.
* **Throughput**: support ≥ 200 RPS burst with autoscale.
* **Scalability**: stateless; horizontal scale.
* **Maintainability**: ≥ 80% unit test line coverage on compute module.
* **Security**: OWASP ASVS L1; input validation at boundary.
* **Accessibility**: WCAG 2.2 AA checked before release.

---

## O) Operations & deployment

* Blue/green or canary deploys with instant rollback.
* Feature flag for **PL language** and **localStorage remember‑me**.
* Runbooks for 5xx spikes and latency regressions.
* Synthetic probes hitting `/api/skin/timer-reapply/compute` every 1 min with fixed payload.

---

## P) Privacy & security

* Treat inputs as **sensitive personal habit data** (not special category).
* **GDPR**: legal basis “legitimate interests” for service operation; no profiling.
* **Data retention**: no server persistence of request bodies; only aggregate metrics.
* TLS 1.2+; HSTS on the site.
* Rate limiting: e.g., 120 requests / minute / IP; friendly 429 message.

---

## Q) QA & testing strategy

* **Unit tests**: pure function from request → response across all rule branches.
* **Property tests**: increasing `now` never increases `minutes_remaining`.
* **Contract tests**: JSON Schema validation round‑trip.
* **Timezone tests**: DST transitions, leap day (Feb 29).
* **E2E**: UI form → API → renders countdown; keyboard‑only path.
* **i18n tests**: PL/EN toggles; correct note sets.

---

## R) Resilience & error handling (UX & API)

* API returns machine‑readable errors:

  ```json
  { "error": { "code": "LAST_APPLICATION_IN_FUTURE", "message": "..." } }
  ```
* UI fallbacks:

  * If API unreachable, offer **local offline compute** using the same rules (see §S Offline).
  * On validation error, highlight field(s) and keep user input intact.

---

## S) Storage & state (client‑side only)

* **No server DB**.
* Optional **localStorage** keys:

  * `spf.last_application_ts`
  * `spf.water_resistance`
  * `spf.environment`
  * `spf.locale`
* TTL: none; user can “Clear saved data”.
* **Offline mode**: compute locally when offline; show banner “Offline — using local clock”.

---

## T) Telemetry & observability

* Export Prometheus metrics (§M).
* Distributed tracing headers accepted (e.g., W3C TraceContext) though the service is single‑hop.
* Dashboards: latency, error rate, rule_used distribution.

---

## U) UI design specifics

* Responsive layout: mobile first; 320px min width.
* Controls:

  * Radio group: water resistance (None, 40 min, 80 min).
  * Switches: “In water or heavy sweat”, “Towel‑dried or wiped”.
  * Select: environment (Indoors – low UV, Mostly outdoor).
  * Datetime input with “Set to Now” button.
* Visuals:

  * Countdown text (mm:ss) and **minutes chip**.
  * Rule badge colors with accessible contrast; also show text label.
* Content polish (examples):

  * Title EN: “SPF Reapplication Timer”
  * Title PL: “Timer ponownej aplikacji SPF”

---

## V) Versioning & deprecation

* Media type versioning (`application/vnd.timer-reapply.v1+json`) or URL prefix `/v1/`.
* **Semantic versioning** of compute module.
* Deprecation policy: 90‑day window for breaking changes; dual‑serve for 30 days.

---

## W) Workflow & states (UI state machine)

* **Idle** → user enters inputs.
* **Computed** → shows next timestamp and live countdown.
* **DueNow** (minutes_remaining = 0) → emphasizes “Reapply now”.
* **Error** → shows validation or compute error.
* **Offline** → banner + local compute; on regain connectivity, silently validate with API.

Transitions are triggered by submit, time ticks, connectivity changes, or input edits.

---

## X) eXamples (requests & responses)

1. **Baseline, mostly outdoor**

* Request:

  ```json
  {
    "last_application_ts": "2025-10-23T10:00:00+02:00",
    "water_resistance": "none",
    "exposure": { "in_water_or_heavy_sweat": false, "towel_dried_or_wiped": false },
    "environment": "mostly_outdoor",
    "now_ts": "2025-10-23T10:30:00+02:00"
  }
  ```
* Response:

  ```json
  {
    "next_reapply_ts": "2025-10-23T12:00:00+02:00",
    "minutes_remaining": 90,
    "rule_used": "baseline",
    "notes": [
      "Reapply sooner after towel-drying or rubbing off.",
      "If makeup on top, consider SPF top-up method."
    ]
  }
  ```

2. **In water, 40‑min labeled product**

* Request:

  ```json
  {
    "last_application_ts": "2025-10-23T10:00:00Z",
    "water_resistance": "40",
    "exposure": { "in_water_or_heavy_sweat": true, "towel_dried_or_wiped": false },
    "environment": "mostly_outdoor",
    "now_ts": "2025-10-23T10:25:00Z"
  }
  ```
* Response:

  ```json
  {
    "next_reapply_ts": "2025-10-23T10:40:00Z",
    "minutes_remaining": 15,
    "rule_used": "40min_water",
    "notes": [
      "Reapply sooner after towel-drying or rubbing off.",
      "If makeup on top, consider SPF top-up method."
    ]
  }
  ```

3. **Towel‑dried override**

* Request:

  ```json
  {
    "last_application_ts": "2025-10-23T10:00:00-04:00",
    "water_resistance": "80",
    "exposure": { "in_water_or_heavy_sweat": true, "towel_dried_or_wiped": true },
    "environment": "mostly_outdoor",
    "now_ts": "2025-10-23T10:05:00-04:00"
  }
  ```
* Response:

  ```json
  {
    "next_reapply_ts": "2025-10-23T10:00:00-04:00",
    "minutes_remaining": 0,
    "rule_used": "towel_dried_override",
    "notes": [
      "Reapply now due to towel-drying/wiping.",
      "Reapply sooner after towel-drying or rubbing off.",
      "If makeup on top, consider SPF top-up method."
    ]
  }
  ```

4. **Indoors low UV, no water**

* Request:

  ```json
  {
    "last_application_ts": "2025-10-23T09:00:00+01:00",
    "water_resistance": "none",
    "exposure": { "in_water_or_heavy_sweat": false, "towel_dried_or_wiped": false },
    "environment": "indoor_low_uv",
    "now_ts": "2025-10-23T10:15:00+01:00"
  }
  ```
* Response:

  ```json
  {
    "next_reapply_ts": "2025-10-23T11:00:00+01:00",
    "minutes_remaining": 45,
    "rule_used": "baseline",
    "notes": [
      "Indoors near windows still has UV; many people reapply every ~2 hours.",
      "Reapply sooner after towel-drying or rubbing off.",
      "If makeup on top, consider SPF top-up method."
    ]
  }
  ```

5. **Validation error (future last application)**

* Response `422`:

  ```json
  {
    "error": {
      "code": "LAST_APPLICATION_IN_FUTURE",
      "message": "last_application_ts (2025-10-24T08:00:00Z) is in the future relative to now (2025-10-23T12:00:00Z)."
    }
  }
  ```

---

## Y) Yardsticks (acceptance criteria)

* **Rule precedence**: towel-dry overrides water, which overrides baseline.
* **Baseline case**: with no water/sweat, `rule_used = baseline` and `I = 120`.
* **Non‑water‑resistant + water**: `I = 40`, `rule_used = 40min_water`.
* **Minutes rounding**: `minutes_remaining` equals floor of remaining seconds / 60; never negative.
* **Timezone correctness**: Adding 120 minutes across DST changes yields correct **instant**; displayed in `user_timezone` if provided.
* **Indoor messaging**: With `environment = indoor_low_uv` and no water/sweat, a specific indoor note is present.
* **Error on future timestamp**: 100% reproducible `422` with clear message.
* **Accessibility**: All inputs have labels; “Due now” announced via screen reader.

---

## Z) Zealous edge‑case tests (must‑pass)

1. **DST forward jump** (clocks skip an hour): last app 01:30 local, baseline → next = 03:30 local after jump; minutes calculation correct.
2. **DST backward** (clocks repeat an hour): adding 120 minutes lands correctly 2 hours of real time later.
3. **Leap day**: last app on Feb 29 → add intervals correctly.
4. **Very old last app**: 30 days ago → compute normally; include “fresh application” note.
5. **Rapid toggling**: switch towel flag on/off; result updates instantly with correct rule.
6. **Offline**: API down → local compute produces same outputs as server for same inputs.
7. **Large now skew**: `now_ts` supplied behind server time → still validates future/ past correctly relative to provided `now_ts`.
8. **Whitespace/ casing**: reject `" 80 "` or `"None"` (schema‑validated enums only).
9. **Internationalization**: PL locale renders dates in Polish and shows Polish notes.
10. **Performance**: 200 RPS for 60s soak with p95 latency ≤ 200ms.

---

### Reference pseudocode (deterministic core)

```ts
function compute(payload, now = systemNow()):
  validateSchema(payload)
  const last = parseISO(payload.last_application_ts) // throw if invalid
  const nowInst = payload.now_ts ? parseISO(payload.now_ts) : now
  if (last > nowInst) throw 422 LAST_APPLICATION_IN_FUTURE

  // 1) Towel override
  if (payload.exposure.towel_dried_or_wiped) {
    return build(last, nowInst, 0, "towel_dried_override", payload)
  }

  // 2) Water/heavy sweat
  if (payload.exposure.in_water_or_heavy_sweat) {
    let I = 40
    if (payload.water_resistance === "80") I = 80
    else if (payload.water_resistance === "40") I = 40
    // "none" stays conservative 40
    const rule = (I === 80) ? "80min_water" : "40min_water"
    return build(addMinutes(last, I), nowInst, null, rule, payload, last)
  }

  // 3) Baseline
  return build(addMinutes(last, 120), nowInst, null, "baseline", payload, last)

function build(targetOrLast, now, intervalOverride, rule, payload, last?):
  const T_next = intervalOverride === 0 ? last /* towel */ : targetOrLast
  const secondsRemaining = Math.max(0, (T_next - now) / 1000)
  const minutes_remaining = Math.floor(secondsRemaining / 60)
  const notes = generateNotes(rule, payload, minutes_remaining, last, now)
  return {
    next_reapply_ts: formatISO(T_next, payload.user_timezone),
    minutes_remaining,
    rule_used: rule,
    notes
  }
```

---

This specification is designed to be **directly implementable** by backend and frontend teams, with clear logic, contracts, and quality bars. If you’d like, I can also provide an **OpenAPI 3.1** file and a **minimal JS/TS implementation with unit tests** matching the above acceptance criteria.
