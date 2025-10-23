Below is an **A–Z** specification for **/skin/narzedzia/budzet‑rutyny/** (Routine Budget Calculator). It combines **functional** and **non‑functional** requirements so engineering, QA, and design can implement and ship the tool end‑to‑end.

> **Important numeric note:** The sample output in your prompt for “Gentle Cleanser” does **not** match the given algorithm (30‑day month model). Using the algorithm as written (see Section **G**), the cleanser should produce `months_to_empty ≈ 1.67` and `cost_per_month ≈ 8.99`. This spec adopts the algorithm exactly; please update fixtures accordingly.

---

## A) Aim & Outcomes (Purpose)

* **Goal:** Turn product sizes, prices, and usage patterns into:

  * Cost per **month** per product and total.
  * Estimated **months to empty** per product.
  * **Cost per use** per product.
  * **ML per month** consumed per product.
  * Clear notes/disclaimers.
* **Primary outcomes:** Help users plan skincare budgets and refill timing.

---

## B) Business Scope & Constraints

* **In scope:** One‑page calculator, instant client‑side results, shareable state (URL), optional server API for persistence/analytics.
* **Out of scope (v1):** Account logins, inventory reminders/notifications, commerce checkout.
* **Constraints:** Monetary values in 2 decimals; default month model = 30 days (factor `30/7`).

---

## C) Core Users & Scenarios

* **End users:** Consumers planning routine costs; skincare enthusiasts; advisors writing guides.
* **Scenarios:**

  1. User enters product rows (name, price, size_ml, ml_per_use, uses_per_day, days_per_week) → sees per‑item and total monthly cost.
  2. User omits some fields → item flagged “insufficient data” and excluded from totals.
  3. User toggles month model (optional) or currency symbol (UI only) → recalculation.
  4. User saves/shares a link that restores all rows/values.

---

## D) Definitions & Units

* **Month model:** Default `weeks_per_month = 30 / 7 ≈ 4.28571429`. (Configurable; see G.7)
* **Monetary rounding:** Round **half‑up** to 2 decimals for display.
* **Volumes:** Milliliters (ml) only in v1. (Extensible; see Q.4)
* **Usage frequency:**

  * `uses_per_day` (number ≥ 0; may be fractional)
  * `days_per_week` (integer 0–7; default 7)

---

## E) Input Contract (Functional)

### E.1 JSON shape (request to API or local state)

```json
{
  "products":[
    {
      "name":"string",
      "price": 0,
      "size_ml": 0,
      "ml_per_use": 0,
      "uses_per_day": 0,
      "days_per_week": 0
    }
  ],
  "config": {
    "month_model": "30_day", 
    "currency_symbol": "zł",
    "locale": "pl-PL"
  }
}
```

### E.2 Field defaults

* `days_per_week` default **7** if omitted.
* `uses_per_day` default **1** if omitted.
* `config.month_model` default **"30_day"**.
* `config.currency_symbol` default inferred from locale; fallback `"zł"` for PL.
* `config` optional.

### E.3 Required for calculations (per product)

* **Required:** `price`, `size_ml`, `ml_per_use` must all be present and **> 0** to compute costs.
* **Optional:** `uses_per_day`, `days_per_week` (defaulting as above).

---

## F) UI/UX Requirements (Functional)

1. **Layout**

   * Title (PL/EN): *Budżet rutyny* / *Routine Budget*.
   * Intro note: “Szacunki zakładają regularne użycie.” / “Estimates assume consistent use.”
   * **Editable table** of products (add row, duplicate row, delete row, reorder).
   * Inline validation messages per cell.
   * **Results panel**:

     * Per‑item: `months_to_empty`, `cost_per_month`, `cost_per_use`, `ml_per_month`.
     * Totals: `monthly`.
     * Notes list.
   * **Controls**:

     * Currency symbol (display only).
     * Month model selector (optional advanced; defaults hidden).
     * Import/Export JSON.
     * “Copy shareable link”.

2. **Real‑time updates:** Any edit recalculates instantly.

3. **Formatting**

   * Money: localized with 2 decimals (e.g., `10,49 zł` in `pl‑PL`; `€10.49` in `en‑IE`).
   * Volumes to **2 decimals** (truncate trailing zeros for UI polish), except show integer if exact.

4. **States**

   * Insufficient data → greyed out row, “Insufficient data (excluded from totals)”.
   * Zero usage (e.g., `uses_per_day=0` or `days_per_week=0`) → `months_to_empty = ∞` (UI string), `cost_per_month = 0.00`, `cost_per_use = n/a`, included in output but excluded from totals.
   * Errors: highlight invalid cells with helper text.

5. **Internationalization**

   * Polish as primary; English fallback; all UI strings externalized (see K).

6. **Accessibility**

   * Keyboard navigation for table and buttons.
   * Announce recalculation to screen readers (ARIA live region: polite).
   * Sufficient contrast; focus outlines on inputs.

---

## G) Calculation Rules (Functional)

Let product `p` have:

* `price` (currency), `size_ml`, `ml_per_use`, `uses_per_day`, `days_per_week`.

### G.1 Core formulas

* `uses_per_week = uses_per_day * days_per_week`
* `uses_per_month = uses_per_week * weeks_per_month`
* `ml_per_month = ml_per_use * uses_per_month`
* `months_to_empty = size_ml / ml_per_month`

  * If `ml_per_month == 0` → **infinite** months.
* `cost_per_month = price / months_to_empty`

  * If `months_to_empty` is infinite → `cost_per_month = 0`.
* `cost_per_use = price / (size_ml / ml_per_use)`

  * If `ml_per_use == 0` → undefined (null/“n/a”).

### G.2 Month model constant (default)

* `weeks_per_month = 30 / 7 ≈ 4.2857142857`

### G.3 Rounding & precision

* **Internal math:** use precise decimals (base‑10) to avoid FP drift.
* **Display rounding:**

  * Money: **2 decimals**, half‑up.
  * Volumes: **2 decimals**.
  * `months_to_empty`: **2 decimals**.
* **Totals:** sum **unrounded** per‑item `cost_per_month`, then round the total.

### G.4 Exclusion from totals

* If any of `price`, `size_ml`, `ml_per_use` is missing or ≤ 0 → mark `"insufficient_data": true` and **exclude** from totals.
* If `ml_per_month == 0` (no usage) → exclude `cost_per_month` from totals (it is 0) but still display the row.

### G.5 Notes

* Always include: `"Estimates assume consistent use."`
* Add contextual notes per item when excluded or when infinite months.

### G.6 Example (canonical, based on the algorithm)

**Input (from prompt):**

* Gentle Cleanser: `price=14.99`, `size_ml=200`, `ml_per_use=2.0`, `uses_per_day=2`, `days_per_week=7`
* Serum: `price=29.00`, `size_ml=30`, `ml_per_use=0.33`, `uses_per_day=1`, `days_per_week=5`

**Computed (30‑day month):**

* Cleanser:

  * `uses_per_week = 14`
  * `uses_per_month = 60.00`
  * `ml_per_month = 120.00`
  * `months_to_empty = 1.67`
  * `cost_per_month = 8.99`
  * `cost_per_use = 0.15`
* Serum:

  * `uses_per_week = 5`
  * `uses_per_month ≈ 21.43`
  * `ml_per_month ≈ 7.07`
  * `months_to_empty ≈ 4.24`
  * `cost_per_month ≈ 6.84`
  * `cost_per_use ≈ 0.32`
* **Totals:** `monthly ≈ 15.83`

### G.7 Optional month models (configurable)

* `"30_day"`: `weeks_per_month = 30/7` (default; matches algorithm).
* `"365_div_12"`: `weeks_per_month = (365/12)/7 ≈ 4.3482142857`.
* `"calendar"`: use the actual current month’s days (requires a `start_date`; not enabled in v1).

---

## H) Output Contract (Functional)

### H.1 JSON response

```json
{
  "items": [
    {
      "name": "string",
      "months_to_empty": 1.67,              // null if infinite or insufficient
      "cost_per_month": 8.99,               // 0.00 if infinite months
      "cost_per_use": 0.15,                 // null if ml_per_use <= 0
      "ml_per_month": 120.00,
      "insufficient_data": false,
      "infinite_months": false,             // true if ml_per_month == 0
      "excluded_from_totals": false         // true if insufficient or infinite
    }
  ],
  "totals": { "monthly": 15.83 },
  "notes": ["Estimates assume consistent use."]
}
```

### H.2 JSON–friendly infinity

* Use boolean `infinite_months` and set numeric to `null` where undefined.

---

## I) Validation Rules & Error Handling (Functional)

* **Per field:**

  * `price`, `size_ml`, `ml_per_use` → must be numeric and ≥ 0.
  * `uses_per_day` → numeric and ≥ 0.
  * `days_per_week` → integer 0–7.
* **Row level:**

  * If (`price <= 0` OR `size_ml <= 0` OR `ml_per_use <= 0`) → `insufficient_data=true`.
* **API errors:**

  * `400 invalid_request` (malformed JSON / types)
  * `422 validation_error` (field‑level issues with details per path)
  * `500 server_error` (unexpected)
* **UI errors:** Inline messages per field; summary toast for API errors.

---

## J) Accessibility (Non‑functional)

* WCAG **2.2 AA** compliance.
* Semantic table markup with headers (`<th scope="col">`, `<th scope="row">`).
* ARIA live region to announce “Totals updated”.
* All controls operable via keyboard; visible focus states.

---

## K) Internationalization & Localization (Non‑functional)

* **Locales:** `pl‑PL` (default), `en‑US` (fallback).
* **Externalized strings.** Examples:

  * “Budżet rutyny” / “Routine Budget”
  * “Niewystarczające dane” / “Insufficient data”
  * “Miesięczny koszt” / “Monthly cost”
  * “Miesiące do wykorzystania” / “Months to empty”
* **Number/currency formatting** via locale; currency symbol is **display‑only** (does not convert values).

---

## L) Performance (Non‑functional)

* Time‑to‑interactive ≤ **2s** on 3G/low‑end mobile.
* Recalculation after input ≤ **16ms** (one frame) for ≤ **200** rows.
* Payload size for shared state URL ≤ **2KB** compressed (target), otherwise fall back to short‑ID persistence (see P.3).

---

## M) Security & Privacy (Non‑functional)

* No PII processed in v1.
* If server persistence is used:

  * Store only calculator payloads; no IP or user identifiers beyond standard logs.
  * HTTPS only; HSTS.
  * Rate limiting on the API endpoints.

---

## N) Reliability & Availability (Non‑functional)

* If a server API is offered: **99.9%** monthly availability SLO.
* Graceful degradation: Calculator runs fully **client‑side** if API is unreachable.

---

## O) Observability & Analytics (Non‑functional)

* Track events (anonymized):

  * `calc_viewed`, `row_added`, `row_removed`, `calc_shared`, `calc_exported`, `calc_imported`, `validation_error`.
* Metrics:

  * Average rows per session, average monthly total, error rate, API p95 latency.

---

## P) API & Integration (Functional + Non‑functional)

### P.1 REST endpoints (optional but recommended)

* **POST** `/api/skin/tools/routine-budget-calc/compute`

  * **Request:** Input JSON (Section E.1)
  * **Response:** Output JSON (Section H.1)
  * **Codes:** 200, 400, 422, 500
  * **Idempotent:** Yes.

* **POST** `/api/skin/tools/routine-budget-calc/save`

  * Stores payload; returns short ID.
  * Response: `{ "id": "abc123" }`.

* **GET** `/api/skin/tools/routine-budget-calc/load/{id}`

  * Returns stored payload (Input JSON).

### P.2 OpenAPI (excerpt)

```yaml
paths:
  /api/skin/tools/routine-budget-calc/compute:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/RoutineBudgetInput' }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/RoutineBudgetOutput' }
        '422': { description: Validation error }
components:
  schemas:
    ProductInput:
      type: object
      required: [name, price, size_ml, ml_per_use]
      properties:
        name: { type: string, minLength: 1 }
        price: { type: number, minimum: 0 }
        size_ml: { type: number, minimum: 0 }
        ml_per_use: { type: number, minimum: 0 }
        uses_per_day: { type: number, minimum: 0, default: 1 }
        days_per_week: { type: integer, minimum: 0, maximum: 7, default: 7 }
    RoutineBudgetInput:
      type: object
      properties:
        products:
          type: array
          items: { $ref: '#/components/schemas/ProductInput' }
        config:
          type: object
          properties:
            month_model: { type: string, enum: [30_day, 365_div_12, calendar], default: 30_day }
            currency_symbol: { type: string }
            locale: { type: string }
    ProductItem:
      type: object
      properties:
        name: { type: string }
        months_to_empty: { type: number, nullable: true }
        cost_per_month: { type: number }
        cost_per_use: { type: number, nullable: true }
        ml_per_month: { type: number }
        insufficient_data: { type: boolean }
        infinite_months: { type: boolean }
        excluded_from_totals: { type: boolean }
    RoutineBudgetOutput:
      type: object
      properties:
        items:
          type: array
          items: { $ref: '#/components/schemas/ProductItem' }
        totals:
          type: object
          properties:
            monthly: { type: number }
        notes:
          type: array
          items: { type: string }
```

### P.3 Shareable state

* **Option A (URL only):** Base64‑URL encoded JSON in querystring `?s=...` (limit length; compress).
* **Option B (preferred when long):** Save payload to `/save` → return ID → share `?id=abc123`.

---

## Q) Data Model & Extensibility

1. **Client state:** Array of `ProductInput` + `config`.
2. **Server persistence (if used):** `{ id, payload_json, created_at, locale }`.
3. **Flags per item:** `insufficient_data`, `infinite_months`, `excluded_from_totals`.
4. **Future extensibility:** Units

   * Add `size_unit` (`"ml" | "g" | "oz"`) and `dose_unit`.
   * Optional `density` for `g↔ml` conversion; **v1 sticks to ml** to avoid assumptions.

---

## R) Edge Cases (Functional)

* Missing any of `price`, `size_ml`, `ml_per_use` → **insufficient**; exclude from totals.
* Zeros:

  * `ml_per_use=0` → `cost_per_use=null`, `months_to_empty=null`, `insufficient=true`.
  * `uses_per_day=0` or `days_per_week=0` → `ml_per_month=0`, `months_to_empty=∞`, `cost_per_month=0`.
* Unrealistic values:

  * Negative numbers → validation error.
  * Extremely large numbers → cap to `1e9` for safety; show warning.
* Rounding consistency:

  * Totals computed from **unrounded** per‑item values then rounded at end.

---

## S) Testing & QA (Non‑functional)

### S.1 Unit tests (examples)

* **Canonical case (matches Section G.6):**

  * Cleanser → months `1.67`, cost/month `8.99`, cost/use `0.15`, ml/month `120.00`.
  * Serum → months `4.24`, cost/month `6.84`, cost/use `0.32`, ml/month `7.07`.
  * Totals → monthly `15.83`.
* Missing fields → mark insufficient; excluded from totals.
* Zero usage (days_per_week=0) → infinite months; `cost_per_month=0.00`.

### S.2 Property tests

* Increasing `ml_per_use` **decreases** `months_to_empty`.
* Increasing `uses_per_day` **increases** `ml_per_month` and **increases** monthly cost (if other required fields valid).
* Setting `price=0` yields `cost_per_use=0`, `cost_per_month=0`.

### S.3 Integration & UI

* Keyboard navigation through the table.
* Copy/share link restores exact state.
* Locale switch changes formatting but not numeric results.

---

## T) Release, Versioning & Migration (Non‑functional)

* **Version stamp** in output: `"version": "1.0.0"` (optional).
* Changes to month model or units → minor version.
* Breaking changes (schema) → major version and migration shim.

---

## U) Build, CI/CD & Deployment (Non‑functional)

* Static front‑end build (ES2019 target), SSR optional.
* Lint + typecheck on PR; unit tests required.
* Canary release for API if used; automated rollback on elevated 5xx.

---

## V) Documentation (Non‑functional)

* User help tooltip describing each field and the month model.
* Developer README:

  * Algorithm, rounding policy, examples.
  * API contract and error codes.
  * I18n guidelines (adding languages).

---

## W) SEO & Sharing (Non‑functional)

* Route: `/skin/narzedzia/budzet-rutyny/`
* Title/description (PL):

  * Title: “Kalkulator budżetu rutyny pielęgnacyjnej”
  * Meta: “Oblicz miesięczny koszt kosmetyków i przewidywany termin zużycia.”
* Open Graph tags; shareable URL restores state (if user consents).

---

## X) Legal & Compliance (Non‑functional)

* Disclaimer: “Wyniki to przybliżone szacunki. Rzeczywista konsumpcja może się różnić.”
* No medical claims; no PII stored; GDPR‑friendly if persistence enabled.

---

## Y) Risks & Mitigations

* **R1**: Floating‑point rounding errors → **Use decimal math / integer cents**.
* **R2**: Very long share URLs → **Short‑ID persistence**.
* **R3**: Confusion about month length → **Document month model; allow optional switch**.

---

## Z) Acceptance Criteria (Definition of Done)

1. User can add/edit/delete rows; values recalc **instantly**.
2. Rows with missing `price`, `size_ml`, or `ml_per_use` are marked **insufficient** and excluded.
3. With the **canonical input** (Section G.6), results must match:

   * Cleanser: `months_to_empty=1.67`, `cost_per_month=8.99`, `cost_per_use=0.15`, `ml_per_month=120.00`
   * Serum: `months_to_empty=4.24`, `cost_per_month=6.84`, `cost_per_use=0.32`, `ml_per_month=7.07`
   * Totals: `monthly=15.83`
4. “Estimates assume consistent use.” appears in notes.
5. Accessibility checks: keyboard operable; screen reader announces updates.
6. Localization: PL and EN render with correct number/currency formatting.
7. API (if enabled) passes contract tests; returns 422 with clear field errors for invalid input.
8. Performance: typing in any cell does not drop below 60 FPS for ≤200 rows.

---

### Optional: Minimal Reference Logic (pseudo‑code)

```ts
const WEEKS_PER_MONTH = cfg.month_model === '365_div_12'
  ? (365/12)/7
  : 30/7;

for (const p of products) {
  const usesPerWeek = (p.uses_per_day ?? 1) * (p.days_per_week ?? 7);
  const usesPerMonth = usesPerWeek * WEEKS_PER_MONTH;
  const mlPerMonth = (p.ml_per_use ?? 0) * usesPerMonth;

  const insufficient = !(p.price > 0 && p.size_ml > 0 && p.ml_per_use > 0);
  const infinite = !insufficient && mlPerMonth === 0;

  let monthsToEmpty = null, costPerMonth = 0, costPerUse = null;

  if (!insufficient) {
    monthsToEmpty = infinite ? null : p.size_ml / mlPerMonth;
    costPerMonth = infinite ? 0 : p.price / monthsToEmpty;
    costPerUse = p.ml_per_use > 0 ? p.price / (p.size_ml / p.ml_per_use) : null;
  }

  // Round for display
  monthsToEmpty = round2(monthsToEmpty);
  costPerMonth = round2(costPerMonth);
  costPerUse = round2(costPerUse);
  mlPerMonth = round2(mlPerMonth);

  // Exclusion flag
  const excluded = insufficient || infinite;

  // accumulate total on unrounded values before rounding at end

