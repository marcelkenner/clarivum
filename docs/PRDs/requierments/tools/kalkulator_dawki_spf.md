Below is a complete **A–Z specification** of functional & non‑functional requirements to implement **/skin/narzedzia/kalkulator-dawki-spf/** (Sunscreen Amount Calculator). It is written to be implementation‑ready and unambiguous.

---

## A) Product overview & scope

* **Goal:** Convert user‑selected body zones into **mL (and ≈g)** of sunscreen needed at **2 mg/cm²**, with optional guidance in **pumps/drops** when trustworthy.
* **Out of scope:** Skin‑type advice, SPF selection, child‑specific dosing, brand recommendations, spray/stick/tube “time” or “passes” conversions.

---

## B) Personas & primary use cases

1. **Everyday user:** Wants a quick number for face/neck or for a beach day full‑body application.
2. **Clinician / educator:** Needs consistent, defensible numbers to teach proper amounts.
3. **Content editor (PL/EN):** Needs to localize labels/copy and disclaimers without code changes.

---

## C) Definitions & assumptions

* **Target application density:** 2 mg/cm² (industry standard for labeled SPF).
* **Full body adult baseline:** **30.0 mL** (“shot glass rule”).
* **Approximate density:** **1.0 g/mL** → grams ≈ mL (display as “approx_grams”).
* **Rule of 9s allocation** used for per‑zone baselines (see D).
* Values are **heuristics for adults**; children/adolescents show a **disclaimer** (no special math).

---

## D) Zone taxonomy & allocations (source of truth)

Use these fixed **mL** values per zone:

* `face` = **1.2 mL** (subset of head/neck)
* `neck` (anterior) = **0.7 mL**
* `ears` = **0.3 mL**
* `both_arms` = **5.4 mL** (includes hands in Rule of 9s; see conflict rules below)
* `both_legs` = **10.8 mL**
* `front_torso` = **5.4 mL**
* `back_torso` = **5.4 mL**
* `hands` (backs) = **0.6 mL**
* **Scalp (if exposed)** = **0.6 mL** (added when `include_scalp_if_exposed=true`)

> **Note on overlap:** `both_arms` already covers hands in Rule of 9s. To avoid double counting, if `both_arms` is selected, **ignore** `hands` if also selected (see J).

---

## E) Input contract (API & client)

**JSON (request)**

```json
{
  "zones": ["face", "neck", "ears", "both_arms", "both_legs", "front_torso", "back_torso", "hands"],
  "include_scalp_if_exposed": false,
  "full_body_override": false,
  "packaging": {
    "type": "pump|dropper|tube|stick|spray|unknown",
    "output_ml_per_actuation": null
  }
}
```

**Rules**

* `zones`: array of distinct strings from the allowed set. Case‑sensitive IDs.
* `include_scalp_if_exposed`: boolean.
* `full_body_override`: boolean.
* `packaging.type`: enumerated.
* `packaging.output_ml_per_actuation`: number > 0 (mL) or null.

**JSON Schema (abbrev)**

```json
{
  "type": "object",
  "required": ["zones","include_scalp_if_exposed","full_body_override","packaging"],
  "properties": {
    "zones": {
      "type": "array",
      "items": {"enum":["face","neck","ears","both_arms","both_legs","front_torso","back_torso","hands"]},
      "uniqueItems": true
    },
    "include_scalp_if_exposed": {"type":"boolean"},
    "full_body_override": {"type":"boolean"},
    "packaging": {
      "type":"object",
      "required":["type","output_ml_per_actuation"],
      "properties": {
        "type": {"enum":["pump","dropper","tube","stick","spray","unknown"]},
        "output_ml_per_actuation": {"type":["number","null"], "minimum": 0.000001}
      }
    }
  },
  "additionalProperties": false
}
```

---

## F) Output contract

**JSON (response)**

```json
{
  "total_ml": 2.7,
  "approx_grams": 2.7,
  "recommended_acts": {
    "count": 11,
    "unit": "pumps",
    "assumption_ml_per_act": 0.25
  },
  "zone_breakdown_ml": {
    "face": 1.2,
    "neck": 0.7,
    "ears": 0.3,
    "both_arms": 0,
    "both_legs": 0,
    "front_torso": 0,
    "back_torso": 0,
    "hands": 0,
    "scalp": 0
  },
  "notes": [
    "Two-finger ≈ 1.0–1.3 mL for face.",
    "Adjust upward for beards/heavy hair.",
    "For sprays/sticks/tubes, show mL target only."
  ]
}
```

**Rules**

* `total_ml`: number with one decimal place in UI (see I), unrounded kept internally.
* `approx_grams` = `total_ml` × 1.0 (display as same precision).
* `recommended_acts`: nullable; included **only** for `pump`/`dropper` **and** when rule permits (see H/I).
* `zone_breakdown_ml` includes **all** zones plus `"scalp"`; zones not selected are `0`.
* `notes`: array of strings. Include face “two‑finger” note when `face` is selected. Include hair/scalp note when scalp true or face selected. Always include the spray/stick/tube caution when such a packaging type is selected.

---

## G) Core algorithm (single source of truth)

1. **Full‑body override:**
   If `full_body_override=true`, set `total_ml_raw = 30.0` and **skip to Step 5**.

2. **Base sum:**
   Map `zones` to their fixed mL values (Section D). If `include_scalp_if_exposed=true`, add **0.6 mL**.

3. **Overlap rule (hands vs arms):**
   If `zones` includes `both_arms`, **do not add** `hands` even if listed; treat `hands` = 0.

4. **Floors/ceilings:**

   * If (exactly) `zones == ["face"]` and `total_ml_raw < 1.0`, set to **1.0 mL**.
   * If (exactly) `zones == ["face","neck"]` (any order) and `total_ml_raw < 1.8`, set to **1.8 mL**.

5. **Acts (if applicable):**
   See H/I.

6. **Grams:** `approx_grams = total_ml_raw × 1.0`.

7. **Formatting & notes:** See I/K/M.

> **Invariant checks (for QA):**
>
> * Selecting all zones except `hands` + scalp=false should land near **≈30.0 mL** (due to discrete zone rounding it may be slightly above or below; do **not** force normalization).
> * With `both_arms` + `hands`, hands must contribute **0**.

---

## H) Packaging conversion logic (trustworthy only)

* **Allowed:**

  * `pump` → default **0.25 mL/actuation** when `output_ml_per_actuation=null`.
  * `dropper` → default **0.05 mL/drop** when `output_ml_per_actuation=null`.
  * If a **custom** `output_ml_per_actuation` is provided **and** type is `pump` or `dropper`, **use** it.

* **Not allowed (by policy):**

  * For `tube`, `stick`, `spray`, `unknown`, **never** compute `recommended_acts` (even if a custom output is provided). Display **mL target only** and add a cautionary note.

* **Computation:**
  `required_acts = ceil(total_ml_raw / output_ml_per_actuation)`
  `unit = "pumps"` for `pump`, `"drops"` for `dropper`.
  Also include `assumption_ml_per_act` in the response.

---

## I) Rounding & display rules

* **Internal math precision:** Keep full precision using IEEE 754 double or decimal, constants as specified.
* **Displayed `total_ml` & `approx_grams`:** round **half‑up** to **1 decimal** (e.g., 2.25 → 2.3).
* **`recommended_acts.count`:** integer **ceiling** (see H).
* **Zone breakdown:** show canonical constants (1.2, 0.7, 0.3, 5.4, 10.8, 5.4, 5.4, 0.6, 0.6) with one decimal where relevant.

---

## J) Validation & error handling

* **No zones & no override:** return **error** with message:

  * EN: “Select at least one area.”
  * PL: „Wybierz co najmniej jeden obszar.”
    HTTP 400 for API; in UI: inline error banner.

* **Unsupported zone IDs / invalid enum:** HTTP 400 with a clear message.

* **Negative/zero actuation value:** HTTP 400.

* **Conflicts (hands + both_arms):** silently resolve by **ignoring `hands`** and add an informational note:

  * EN: “Hands are included in both arms; we didn’t double‑count.”
  * PL: „Dłonie są uwzględnione w obu ramionach; nie zliczamy ich podwójnie.”

---

## K) UX & UI requirements (web)

* **Layout:**

  * **Zone selection:** checklist with icons (face, neck, ears, arms, legs, front torso, back torso, hands).
  * **Toggle:** “Include scalp if exposed (parted hair/short hair)” (`include_scalp_if_exposed`).
  * **Full‑body switch:** “Full body (adult)” → disables zone controls and shows 30.0 mL result.
  * **Packaging panel:**

    * Packaging type dropdown (pump, dropper, tube, stick, spray, unknown).
    * If type is pump/dropper: numeric field for “mL per actuation (optional)” with placeholder 0.25 (pump) / 0.05 (dropper).
    * If type is tube/stick/spray/unknown: hide actuation inputs and show informational notice.
  * **Results card:**

    * **Total:** `total_ml` (mL) and `≈ grams`.
    * **If applicable:** `recommended_acts.count` + unit (e.g., “9 pumps”).
    * **Breakdown table:** Zone → mL (only zones selected + scalp if applicable; others greyed or omitted).
    * **Notes:** bullets (two‑finger face guidance; hair/beard; spray/tube caution; hands vs arms info when relevant).
  * **Disclaimer block (always visible):**

    * EN: “These amounts are adult heuristics at 2 mg/cm². For adolescents/children, treat as reference only.”
    * PL: „Podane ilości dotyczą dorosłych (2 mg/cm²). Dla nastolatków/dzieci traktuj jako wskazówkę orientacyjną.”

* **Interaction rules:**

  * Selecting “Full body” immediately updates results to **30.0 mL**.
  * Changing packaging updates acts live.
  * Switching to tube/stick/spray hides acts and adds caution note.

* **Copy & microtext (EN/PL):** see Z.

* **Empty state:** if no zones and no override, disable “Calculate” (if present) and show inline helper.

---

## L) Accessibility (a11y)

* WCAG 2.1 AA:

  * All controls reachable with keyboard; visible focus states.
  * ARIA roles for toggle groups and checklists.
  * Minimum contrast 4.5:1; no color‑only cues.
  * Error messages associated via `aria-describedby`.
  * Language attributes (`lang="pl"`/`"en"`) per localized page.

---

## M) Internationalization & localization

* **Languages:** Polish (default for path), English.
* **Numerals:** Use locale formatting in UI:

  * EN: **1.2 mL**; PL: **1,2 ml** (lowercase “ml” acceptable in PL if your style guide requires).
* **Units:** Keep “mL”/“ml” & “g” localized in labels.
* **All strings externalized** to a resource file with keys (see Z: Copy deck).

---

## N) Performance & reliability

* **Client‑side compute only** (no server needed) for instant results; also expose a small stateless API (see S/T) if desired.
* **Performance budgets:**

  * JS for this widget ≤ **12 kB gzip** incremental.
  * First interaction response ≤ **16 ms** on mid‑range mobile.
* **No blocking network calls** for calculation.

---

## O) Security & privacy

* No PII collected.
* If analytics is enabled, only **anonymous event IDs**; no raw inputs in logs beyond zone selections and packaging type.
* HTTPS only.

---

## P) Analytics (optional)

* Events: `zone_selected`, `full_body_toggle`, `packaging_type_changed`, `custom_output_entered`, `calculated`.
* Properties: language, device, selected zones (hashed or enumerated), type, custom output bucketed (e.g., 0.20–0.29).

---

## Q) Testing strategy & acceptance criteria

### Unit tests (math)

Use exact constants. Verify the following (exact arithmetic shown):

1. **Face+Neck+Ears, pump default**
   Sum = 1.2 + 0.7 + 0.3 = **2.2 mL**.
   Acts (0.25): 2.2 / 0.25 = 8.8 → **ceil = 9**.

2. **Face only, dropper default**
   Sum = **1.2 mL** (floor rule doesn’t apply; 1.2 ≥ 1.0).
   Acts (0.05): 1.2 / 0.05 = **24** → ceil = **24**.

3. **Neck only, pump default**
   Sum = **0.7 mL**.
   Acts (0.25): 0.7 / 0.25 = 2.8 → **ceil = 3**.

4. **Both arms + hands (hands ignored)**
   Sum = 5.4 + 0 (hands ignored) = **5.4 mL**.
   Acts (0.25): 5.4 / 0.25 = 21.6 → **ceil = 22**.

5. **Full body override, pump default**
   Sum = **30.0 mL**.
   Acts (0.25): 30.0 / 0.25 = **120** → ceil = **120**.

6. **Face + scalp**
   Sum = 1.2 + 0.6 = **1.8 mL**.
   Acts (0.25): 1.8 / 0.25 = 7.2 → **ceil = 8**.

7. **Pump with custom output** (0.22 mL) and Face+Neck+Ears
   Sum = **2.2 mL**.
   Acts (0.22): 2.2 / 0.22 = **10** → ceil = **10**.

8. **Tube type with custom output given**
   Sum computed normally but **no acts** returned; note includes caution.

9. **No zones & no override**
   → **400 / inline error** “Select at least one area.”

10. **Face+Neck floor guard**
    Sum = 1.2 + 0.7 = **1.9 mL** → ≥ 1.8 → **no floor applied**.

### Integration/UI tests

* Keyboard‑only flow can select zones, toggle scalp, change packaging, and read result with screen reader labels.
* Locale switch updates decimal separators and all strings.
* Selecting full body disables zone checkboxes and shows **30.0 mL**.

**Acceptance (DoD):** All unit and integration tests above pass; UX matches K; strings localized; a11y checks pass.

---

## R) Error messages (EN/PL)

* **Select at least one area.** / **Wybierz co najmniej jeden obszar.**
* **Unsupported zone ID.** / **Nieobsługiwany identyfikator obszaru.**
* **Actuation must be a positive number.** / **Wartość na porcję musi być dodatnia.**

---

## S) Data model & code architecture

* **Core module:** Pure functions (framework‑agnostic).

  * `calculateDose(request: Request): Response | Error`
* **UI adapter:** React/Vue/Svelte or vanilla.
* **Constants module:** frozen map of zone → mL; default outputs per actuation.
* **i18n module:** string dictionaries (EN/PL).
* **Optional API:** stateless endpoint (see T).

**TypeScript types (reference)**

```ts
type ZoneId =
  | 'face' | 'neck' | 'ears'
  | 'both_arms' | 'both_legs'
  | 'front_torso' | 'back_torso'
  | 'hands';

type PackagingType = 'pump'|'dropper'|'tube'|'stick'|'spray'|'unknown';

interface Packaging {
  type: PackagingType;
  output_ml_per_actuation?: number | null;
}

interface Request {
  zones: ZoneId[];
  include_scalp_if_exposed: boolean;
  full_body_override: boolean;
  packaging: Packaging;
}

interface RecommendedActs {
  count: number | null;
  unit: 'pumps' | 'drops' | 'acts' | null;
  assumption_ml_per_act: number | null;
}

interface Response {
  total_ml: number;
  approx_grams: number;
  recommended_acts: RecommendedActs | null;
  zone_breakdown_ml: Record<ZoneId | 'scalp', number>;
  notes: string[];
}
```

---

## T) Optional HTTP API (if needed)

* **Endpoint:** `POST /api/spf-dose/v1`
* **Request:** as in Section E.
* **Response:** as in Section F.
* **Status codes:** 200 success; 400 invalid input; 500 unexpected.
* **Cache:** `Cache-Control: no-store` (stateless).
* **CORS:** allow same origin by default; configurable.

---

## U) Observability & logging

* **Server API (if used):** log request UUID, timestamp, language, selected zone IDs count, packaging type, and success/failure. **Never** log full payload with PII (none expected).
* **Client widget:** optional perf marks (init, compute complete).

---

## V) Maintenance & versioning

* **Version string:** `v1`.
* Changes to zone constants or rules bump **minor**; breaking schema changes bump **major**.
* Keep a **changelog** with dates and rationale.

---

## W) Risks & mitigations

* **Double counting (hands + arms):** handled via rule J.
* **Mistrust in spray/stick conversions:** disabled; only mL displayed + note.
* **Localization errors:** externalized strings; test snapshots per locale.
* **Rounding confusion:** documented in I; keep internal precision.

---

## X) Extensibility & future ideas (non‑blocking)

* Optional density override for ≈grams (default 1.0 g/mL).
* “Reapply” helper (e.g., every 2 hours) baked into notes.
* Save/load presets (e.g., “running outfit”).
* Children mode (separate heuristic) if medically vetted.

---

## Y) Implementation notes & pseudocode

**Pseudocode (pure function):**

```text
CONST Z = {
  face: 1.2, neck: 0.7, ears: 0.3,
  both_arms: 5.4, both_legs: 10.8,
  front_torso: 5.4, back_torso: 5.4,
  hands: 0.6
}
CONST SCALP = 0.6
CONST FULL_BODY = 30.0

function calculateDose(req):
  validate req against schema
  if req.full_body_override:
    total = FULL_BODY
    breakdown = all zeros
  else:
    selected = Set(req.zones)
    // resolve conflicts
    includeHands = selected.has('hands') && !selected.has('both_arms')
    total = 0
    breakdown = zeros
    for z in selected:
      if z == 'hands' and !includeHands: continue
      total += Z[z]; breakdown[z] = Z[z]
    if req.include_scalp_if_exposed:
      total += SCALP; breakdown['scalp'] = SCALP
    // floors
    if selected == {'face'} and total < 1.0: total = 1.0; breakdown['face'] = max(breakdown['face'], 1.0)
    if selected == {'face','neck'} and total < 1.8: total = 1.8 // do not redistribute breakdown
  grams = total * 1.0

  // packaging and acts
  acts = null
  notes = []
  if req.packaging.type in {'pump','dropper'}:
    out = req.packaging.output_ml_per_actuation
    if out == null:
      out = (pump ? 0.25 : 0.05)
    count = ceil(total / out)
    unit = (pump ? 'pumps' : 'drops')
    acts = {count, unit, assumption_ml_per_act: out}
  else:
    // tube/stick/spray/unknown
    notes.push('For sprays/sticks/tubes, show mL target only (no untrustworthy conversions).')

  if selected.has('face'):
    notes.push('Two-finger ≈ 1.0–1.3 mL for face.')
    notes.push('Adjust upward for beards/heavy hair.')

  if selected.has('both_arms') && selected.has('hands'):
    notes.push('Hands are included in both arms; we didn’t double-count.')

  return { total_ml: round1(total), approx_grams: round1(grams),
           recommended_acts: acts, zone_breakdown_ml: breakdown, notes }
```

*`round1(x)` = round half‑up to 1 decimal for display.*

---

## Z) Copy deck (EN/PL)

**Title**

* EN: Sunscreen Amount Calculator
* PL: Kalkulator ilości kremu z filtrem

**Intro**

* EN: “Pick the areas you’ll cover. We’ll convert to mL (≈g) at 2 mg/cm². Optional: pumps or drops.”
* PL: „Wybierz obszary do posmarowania. Przeliczymy na ml (≈g) przy 2 mg/cm². Opcjonalnie: pompki lub krople.”

**Controls**

* EN: Include scalp if exposed (parted/short hair)

* PL: Uwzględnij skórę głowy, jeśli odsłonięta (przedziałek/krótkie włosy)

* EN: Full body (adult)

* PL: Całe ciało (dorosły)

* EN: Packaging type

* PL: Rodzaj opakowania

* EN: mL per actuation (optional)

* PL: ml na porcję (opcjonalnie)

**Results**

* EN: Total

* PL: Razem

* EN: ≈ grams

* PL: ≈ gramy

* EN: Recommended

* PL: Zalecane

* EN: pumps / drops

* PL: pompki / krople

**Notes**

* EN: Two‑finger ≈ 1.0–1.3 mL for face.

* PL: Metoda „dwóch palców” ≈ 1,0–1,3 ml na twarz.

* EN: Adjust upward for beards/heavy hair.

* PL: Zwiększ ilość przy zaroście/gęstych włosach.

* EN: For sprays/sticks/tubes, show mL target only (no untrustworthy conversions).

* PL: Dla sprayów/sztyftów/tubek pokazujemy tylko ml (bez niepewnych przeliczeń).

* EN: Hands are included in both arms; we didn’t double‑count.

* PL: Dłonie są uwzględnione w obu ramionach; nie zliczamy ich podwójnie.

**Disclaimer**

* EN: “These amounts are adult heuristics at 2 mg/cm². For adolescents/children, treat as reference only.”
* PL: „Podane ilości dotyczą dorosłych (2 mg/cm²). Dla nastolatków/dzieci traktuj jako orientacyjne.”

---

### Implementation checklist (quick)

* [ ] Constants & overlap rule implemented exactly (Section D/J).
* [ ] Floors: only for `["face"]` and `["face","neck"]` exact sets.
* [ ] Pump (0.25 mL) / Dropper (0.05 mL) defaults; ceiling acts.
* [ ] No acts for tube/stick/spray/unknown.
* [ ] Hands ignored when both_arms selected.
* [ ] Locale formatting EN/PL for decimals and strings.
* [ ] a11y, validation, and error states per spec.
* [ ] Unit & integration tests (Section Q) green.

This A–Z spec gives you everything needed—data model, math, UI/UX, i18n, validation, testing, and API—to implement the calculator confidently.
