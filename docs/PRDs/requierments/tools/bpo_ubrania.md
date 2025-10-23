Below is an **A–Z requirements spec** for **/skin/narzedzia/bpo-ubrania/** — *BPO Fabric‑Bleach Risk Aid*. It covers **functional** and **non‑functional** requirements so an engineer can implement it end‑to‑end (UI + API) with high confidence.

> **Consistency note:** The algorithm you provided (weights for BPO %, fabric, color, dry‑down, contact) sums to **12** for the illustrated case (5% BPO, cotton, dark, 15 min dry‑down, 480 min contact). The sample output shows **9**. This spec treats the algorithm as the source of truth; examples below are corrected accordingly.

---

## Functional requirements (A–Z)

**A. Access & routing**

* The page is available at `GET /skin/narzedzia/bpo-ubrania/`.
* A stateless API endpoint is exposed at `POST /api/bpo-ubrania/calc` (JSON in, JSON out). CORS limited to site origin.

**B. Base score by BPO %**

* Accepts `bpo_percent` in range **[2.5, 10]**.
* **Mapping (stepwise):**

  * 2.5–4.99% → **+2**
  * 5.0–9.99% → **+4**
  * exactly 10.0% → **+6**
* If input is outside range, **clamp** to nearest bound and emit a **warning** (see N).

**C. Color visibility factor**

* `color` enum: **white|light|dark**.
* Scores: white **+0**, light **+1**, dark **+2**.

**D. Dry‑down buffer (time before contact)**

* `time_before_contact_min` integer minutes **≥ 0**.
* If **≥ 60** → **−3**; **else if ≥ 30** → **−2**; else **0**.
* Apply **only the single best** matching reduction (no double‑count).

**E. Exposure/contact duration**

* `contact_duration_min` integer minutes **≥ 0**.
* If **≥ 240** → **+3**; **else if ≥ 60** → **+2**; else **0**.
* Apply **only the single best** matching addition.

**F. Fabric susceptibility**

* `fabric` enum: **cotton|linen|wool|silk|polyester|nylon|blend**.
* Scores: cotton/linen **+3**, wool/silk **+2**, polyester/nylon **+1**, blend **+2**.

**G. Guard rails & normalization**

* Reject negative times with **400** + error code.
* Times **> 1440** (1 day) return **422** with guidance, unless explicitly allowed by a feature flag.
* String enums are **case‑insensitive**; trim/normalize whitespace.

**H. Human‑readable explanations**

* Response includes `explanation[]` with **5 ordered items** reflecting the applied rules:

  1. BPO bracket used (e.g., “5% BPO”), 2) fabric, 3) color, 4) contact bracket (“long contact”), 5) dry‑down bracket (“short dry‑down” / “≥30 min dry‑down” / “≥60 min dry‑down”).

**I. Input schema (UI)**

* UI controls:

  * **BPO %**: discrete slider with stops 2.5 / 5 / 10 (or numeric input when typed).
  * **Fabric**: radio group.
  * **Color**: radio group.
  * **Time before contact** (minutes): numeric integer input.
  * **Contact duration** (minutes): numeric integer input.
* Required fields cannot submit until valid.

**J. JSON contract (API request)**

```json
{
  "bpo_percent": 2.5,
  "fabric": "cotton|linen|wool|silk|polyester|nylon|blend",
  "color": "white|light|dark",
  "time_before_contact_min": 15,
  "contact_duration_min": 480
}
```

**K. JSON contract (API response)**

```json
{
  "score": 12,
  "bucket": "high",
  "explanation": ["5% BPO", "cotton", "dark fabric", "long contact (≥240 min)", "short dry-down (<30 min)"],
  "tips": ["Use white linens", "Wait ≥60 min before dressing", "Wash hands after application", "Avoid contact with fresh application"],
  "warnings": []  // e.g., ["bpo_percent clamped to 10%"]
}
```

* `score` is an **integer**, non‑negative (lower bound at 0).
* `bucket` mapping: **0–3 = low**, **4–7 = moderate**, **≥8 = high**.

**L. Language (i18n)**

* Page renders in **PL** by default (path suggests Polish), with **EN** toggle.
* All labels/tips/explanations localizable.
* API remains English‑only for enums; UI maps translated choices to canonical enum values.

**M. Metrics surfaced in UI**

* Show a color‑coded badge and numeric score (e.g., **High (12/14)**).
* Include a textual sentence summarizing risk: “High likelihood of visible bleaching given cotton/dark/long contact.”

**N. Notes & warnings**

* When clamping BPO% or rejecting times, set a `warnings[]` array.
* Show non‑blocking inline notices in UI if clamped.

**O. Open results (shareability)**

* A “Copy link” control encodes current inputs in URL query (e.g., `?bpo=5&fabric=cotton&color=dark&tbc=15&cd=480`) and rehydrates state on load.

**P. Persistence (client‑side)**

* Last used inputs stored in `localStorage` (opt‑in) for convenience; never persisted server‑side.

**Q. Quick calculation mode**

* Results are recalculated **live** on change (debounced) and on explicit “Calculate” press.

**R. Result bucketing copy & color**

* **Low** (green), **Moderate** (amber), **High** (red) with accessible contrast; colors are a UI hint, not part of API.

**S. Seeded tips logic**

* Always include at least **3 tips**.
* For **High** add a fourth tip (“Avoid contact with fresh application”).
* Tip set (English):

  * “Use white linens (pillowcases/towels)”,
  * “Ensure full dry‑down before dressing”,
  * “Wash hands after application”,
  * “Avoid contact with fresh application”.
* Provide PL equivalents.

**T. Telemetry (functional)**

* On successful calc, emit `bpo_bleach_risk_assessed` with input enums, clamping flag, score, bucket (no PII).

**U. UI states**

* **Pristine** (no result yet), **Valid result**, **Inline errors** for invalid fields, **Warning** (clamped), **Reset** clears form.

**V. Validation errors**

* 400 for missing required fields; 422 for domain violations (e.g., times > 1440).
* Standard error body: `{ "error": { "code": "VALIDATION_ERROR", "field": "bpo_percent", "message": "..." } }`.

**W. Wording & tooltips**

* Include short info tooltips for BPO bleaching and what “dry‑down” means; localized.

**X. eXplanation determinism**

* The order and phrasing of `explanation[]` is deterministic and directly reflects applied rules (see H).

**Y. YAML/OpenAPI**

* Provide an OpenAPI 3.1 document in the repo (see Appendix for a starter).

**Z. Zero external dependencies**

* The calculation must run without external APIs; works fully offline once UI loads.

---

## Non‑functional requirements (A–Z)

**A. Availability**

* Target 99.9% monthly uptime for the API route (if deployed separately).

**B. Browser support**

* Latest 2 versions of Chrome/Edge/Firefox/Safari; graceful degradation on older.

**C. Compliance & disclaimers**

* Display “Not medical advice. Dye chemistry varies; results are estimates.”
* No collection of health data; treat usage as non‑sensitive but avoid logging free‑text.

**D. Data retention**

* No server‑side storage of requests/responses beyond ephemeral logs. Aggregated analytics only.

**E. Efficiency**

* Median compute time **< 5 ms** server‑side; UI updates within **100 ms** after input.

**F. Fault tolerance**

* Invalid inputs surfaced as structured errors without 500s.
* Unknown enums return 400 with suggestions (closest valid values).

**G. Governance & change control**

* All weight/table changes require a minor version bump and changelog entry.

**H. Health & monitoring**

* Basic uptime checks; alert on 5xx error rate > 1% over 5 min.

**I. Instrumentation**

* Structured JSON logs with correlation IDs; redact querystrings in logs when copied to external systems.

**J. Security (transport & app)**

* HTTPS/TLS 1.2+, strict CSP, same‑origin policy, CORS restricted to site.

**K. Accessibility**

* WCAG 2.1 AA: keyboard‑navigable controls; visible focus; ARIA live region updates for results; color‑contrast compliance.

**L. Load & scalability**

* Sustain 50 RPS baseline, burst to 250 RPS for 60s without degradation.

**M. Maintainability**

* Type‑safe code (e.g., TypeScript). Linting & unit tests required to merge.

**N. Network behavior**

* API idempotent; rate‑limit 120 req/min/IP to deter abuse.

**O. Observability**

* Expose p50/p95 latency, error rate, request count; per‑bucket distribution metrics.

**P. Portability**

* Containerized deployment (OCI). No platform‑specific services required.

**Q. Quality assurance**

* ≥ 90% unit test coverage for scoring; snapshot tests for i18n copy; e2e flows for UI.

**R. Reliability**

* Deterministic outputs: same inputs → identical outputs. No randomness.

**S. Supportability**

* README with build/run instructions; troubleshooting tips for common errors.

**T. Threat model**

* Inputs are simple enums/ints; still validate and sanitize. No SQL, no eval. Disable verbose stack traces in prod.

**U. Usability**

* Clear defaults; input help; “Reset” and “Copy link” shortcuts; no blocking modals.

**V. Versioning**

* API header `X-Tool-Version: 1.0.0`. Backward‑compatible changes only in minor versions.

**W. Workflow (CI/CD)**

* Pre‑merge: lint, typecheck, tests.
* Deploys are atomic with rollback.

**X. Cross‑language content**

* Translation keys stored once; avoid hard‑coded strings in code.

**Y. Yield (performance budgets)**

* JS bundle for this tool ≤ 50 KB gzipped; critical CSS ≤ 5 KB.

**Z. Zero trust**

* Principle of least privilege in infra; secrets not required for this tool.

---

## Algorithm (definitive rules)

1. **Base (BPO%)**:

   * If `bpo_percent` < 2.5 → clamp to 2.5 (warning).
   * If `bpo_percent` > 10 → clamp to 10 (warning).
   * Score: `2` (2.5–4.99), `4` (5.0–9.99), `6` (10.0).

2. **Fabric**: cotton/linen `+3`; wool/silk `+2`; polyester/nylon `+1`; blend `+2`.

3. **Color**: white `+0`; light `+1`; dark `+2`.

4. **Dry‑down**: `≥60` → `−3`; else if `≥30` → `−2`; else `0`.

5. **Contact**: `≥240` → `+3`; else if `≥60` → `+2`; else `0`.

6. **Total** = max(0, Base + Fabric + Color + Dry‑down + Contact).
   **Bucket**: `0–3 low`, `4–7 moderate`, `≥8 high`.

---

## API (OpenAPI starter)

```yaml
openapi: 3.1.0
info:
  title: BPO Fabric-Bleach Risk Aid
  version: 1.0.0
paths:
  /api/bpo-ubrania/calc:
    post:
      summary: Calculate bleaching risk score
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [bpo_percent, fabric, color, time_before_contact_min, contact_duration_min]
              properties:
                bpo_percent: { type: number, minimum: 0 }
                fabric: { type: string, enum: [cotton, linen, wool, silk, polyester, nylon, blend] }
                color: { type: string, enum: [white, light, dark] }
                time_before_contact_min: { type: integer, minimum: 0, maximum: 1440 }
                contact_duration_min: { type: integer, minimum: 0, maximum: 1440 }
      responses:
        "200":
          description: OK
          headers:
            X-Tool-Version:
              schema: { type: string }
          content:
            application/json:
              schema:
                type: object
                required: [score, bucket, explanation, tips, warnings]
                properties:
                  score: { type: integer, minimum: 0, maximum: 14 }
                  bucket: { type: string, enum: [low, moderate, high] }
                  explanation: { type: array, items: { type: string } }
                  tips: { type: array, items: { type: string }, minItems: 3 }
                  warnings: { type: array, items: { type: string } }
        "400":
          description: Missing or invalid required fields
        "422":
          description: Domain validation failed (e.g., times too large)
```

---

## Validation & error messages (samples)

* **Missing field:** `400` → `{"error":{"code":"MISSING_FIELD","field":"bpo_percent","message":"bpo_percent is required"}}`
* **Unknown fabric:** `400` → `{"error":{"code":"INVALID_ENUM","field":"fabric","message":"fabric must be one of cotton, linen, wool, silk, polyester, nylon, blend"}}`
* **Time too large:** `422` → `{"error":{"code":"DOMAIN_VIOLATION","field":"contact_duration_min","message":"must be ≤ 1440"}}`
* **Clamp warning (200):** include `warnings: ["bpo_percent clamped to 10%"]`

---

## Example requests & expected outputs

1. **High risk (corrected from prompt)**
   Request:

```json
{"bpo_percent":5,"fabric":"cotton","color":"dark","time_before_contact_min":15,"contact_duration_min":480}
```

Response (200):

```json
{
  "score": 12,
  "bucket": "high",
  "explanation": ["5% BPO", "cotton", "dark fabric", "long contact (≥240 min)", "short dry-down (<30 min)"],
  "tips": ["Use white linens", "Ensure full dry-down before dressing", "Wash hands after application", "Avoid contact with fresh application"],
  "warnings": []
}
```

2. **Moderate risk with dry‑down benefit**

```json
{"bpo_percent":4,"fabric":"linen","color":"dark","time_before_contact_min":90,"contact_duration_min":30}
```

→ Score = 2 + 3 + 2 − 3 + 0 = **4** → `bucket:"moderate"` with explanation reflecting “≥60 min dry‑down”.

3. **Low risk (polyester, white, good dry‑down)**

```json
{"bpo_percent":2.5,"fabric":"polyester","color":"white","time_before_contact_min":60,"contact_duration_min":0}
```

→ Score = 2 + 1 + 0 − 3 + 0 = **0** → `bucket:"low"`.

---

## Test matrix (must pass)

* (10, cotton, dark, 0, 600) → **14 / high**
* (5, wool, light, 45, 120) → **7 / moderate**
* (7.5, blend, light, 0, 30) → **7 / moderate**
* (1.0, nylon, white, 120, 0) → clamp to 2.5; **0 / low** + warning
* (12.0, silk, dark, 10, 59) → clamp to 10; **10 / high** + warning
* (5, cotton, white, 120, 240) → **7 / moderate**
* (5, linen, dark, 60, 59) → **6 / moderate**
* (2.5, blend, light, 0, 59) → **5 / moderate**

---

### UI copy (PL/EN key strings – examples)

* **Risk levels:**

  * EN: *Low / Moderate / High*
  * PL: *Niskie / Umiarkowane / Wysokie*
* **Field labels:**

  * EN: *BPO %*, *Fabric*, *Color*, *Time before contact (min)*, *Contact duration (min)*
  * PL: *Stężenie BPO (%)*, *Tkanina*, *Kolor*, *Czas do kontaktu (min)*, *Czas kontaktu (min)*
* **Disclaimer:**

  * EN: *This is an estimate. Fabric dyes and finishes vary; results may differ.*
  * PL: *To jedynie szacunek. Barwniki i wykończenia tkanin różnią się; wyniki mogą się różnić.*

---

### Implementation notes

* Keep the calculator logic in a pure, unit‑tested function (e.g., `computeBpoBleachRisk(input): Result`).
* Freeze the scoring tables in a config module for easy, audited changes.
* Use strict type guards on the API; never trust the client.
* Ensure deterministic `explanation[]` phrasing by deriving it from the exact bracket decisions made by the scorer.
