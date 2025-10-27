# Tool Specification — Planer Eksfoliacji (Exfoliation Planner)

> **Canonical decision:** Implement using the shared tooling platform in `docs/adr/ADR-022-tools-and-calculators-platform.md`.

Below is a **complete A–Z specification** (functional + non‑functional) for **/skin/narzedzia/planer‑eksfoliacji — Exfoliation Frequency Planner** so engineering can implement it end‑to‑end.

---

## A) **API & Contracts**

**Endpoint (page):**
`GET /skin/narzedzia/planer-eksfoliacji/` – renders the planner UI.

**Computation endpoint (service):**
`POST /api/skin/planer-eksfoliacji/v1/compute`

**Request body (JSON):**

```json
{
  "skin_type": "dry|normal|combo|oily",
  "concerns": ["acne","blackheads","pih","dullness","texture","sensitivity","rosacea"],
  "actives_in_routine": { "retinoid": "none|new|tolerant", "vitc_acidic": true, "azelaic_acid": true },
  "preferred_exfoliant": "aha|bha|either",
  "sensitivity_level": "low|medium|high",
  "plan_tier": "free|pro"            // optional; default "free"
}
```

**Response body (JSON):**

```json
{
  "recommended_sessions_per_week": 0,
  "exfoliant_type": "AHA|BHA",
  "example_week": ["Hydrate","Hydrate","Hydrate","Hydrate","Hydrate","Hydrate","Hydrate"],
  "rules": [
    "string", "string"
  ],
  "explanations": {
    "base_from_skin_type": 1,
    "concern_adjustments": { "bha_bonus": 0, "aha_bonus": 0, "sensitivity_penalty": 0 },
    "caps": {
      "retinoid_cap": 4,
      "sensitivity_cap": 4,
      "global_cap": 4,
      "final_cap_applied": 2
    },
    "conflicts_resolved": ["string note if any"],
    "notes": ["string note if any"]
  },
  "warnings": ["string (e.g., caution for rosacea + acne)"]
}
```

**HTTP semantics**

* 200 with computed plan.
* 400 on validation errors (see section E).
* 422 when inputs are valid but constraints make scheduling impossible as requested; respond with a feasible reduced plan (still 200) **and** a warning message. Use 422 only if the request includes a **hard required** count in a future pro endpoint; for this v1, always return 200 and degrade gracefully.

**Idempotency:** Pure function of inputs.

**Versioning:** Prefix all computation endpoints with `/v1/`. Breaking changes create `/v2/…`.

---

## B) **Business Logic Overview**

**Goal:** Recommend weekly **frequency** and a **simple 7‑day layout** for exfoliating acids (AHA or BHA) based on skin type, concerns, sensitivity, and retinoid use, keeping it safe and simple for a “starter” plan.

**Key principles**

1. Keep it conservative and simple (no AHA+BHA stacking per night in **Free** tier).
2. Spread exfoliation evenly.
3. Don’t place exfoliation adjacent to a retinoid night (linear week, no wrap‑around adjacency).
4. Respect caps from retinoids and sensitivity.
5. Provide clear safety notes for sensitive/rosacea users.

---

## C) **Calculation Order & Deterministic Rules**

> The original algorithm contains some ranges (“+1–2”). We make them deterministic so the service is repeatable.

**Step C1 – Base frequency by skin type**

* dry → **1**
* normal/combo → **2** (interpret “1–2” as 2 to avoid under‑recommendation; we’ll cap later)
* oily → **3** (interpret “2–4” as 3; we’ll cap later)

**Step C2 – Concern adjustments (apply once per group)**

* If `concerns` contains **acne** or **blackheads**:

  * If **both** present → **+2 BHA** nights (preferred).
  * If **one** present → **+1 BHA** night.
* If `concerns` contains **pih** or **texture** or **dullness** → **+1 AHA** night (single +1 even if multiple are present).
* If `concerns` contains **sensitivity** or **rosacea** → **−1** total night (apply once even if both are present). Minimum after this step is **0**.

> Store intermediate totals; track whether the “bonus” is AHA‑leaning or BHA‑leaning for type selection.

**Step C3 – Preliminary total**
`pre_total = clamp(base + bonuses − penalty, 0, 4)`

**Step C4 – Retinoid interaction caps**

* `actives_in_routine.retinoid == "new"` → **retinoid_cap = 1**
* `== "tolerant"` → **retinoid_cap = 3**
* `== "none"` → **retinoid_cap = 4**

**Step C5 – Sensitivity level cap**

* high → **1**
* medium → **2**
* low → **4**

**Step C6 – Final total after caps**

```
final_total = min(pre_total, retinoid_cap, sensitivity_cap, 4)
```

**Step C7 – Exfoliant type selection (single type per week in Free)**

1. If `preferred_exfoliant != "either"` → use the chosen one unless safety rule overrides.
2. Else:

   * If acne or blackheads present → **BHA**
   * Else if (pih | texture | dullness) present → **AHA**
   * Else fallback → **AHA**
3. Special safety override: if **acne AND rosacea** are both present → **BHA** and **final_total = min(final_total, 1)**; add **warning**.

**Step C8 – Vitamin C / Azelaic guidance (advisory only, no hard cap)**

* If `vitc_acidic: true`, add rule: “Use vit C in AM on non‑exfoliation days.”
* If `azelaic_acid: true`, add rule: “Prefer azelaic on Hydrate nights.”

**Step C9 – Example week generation (7‑day layout)**

* Days: `["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]`.
* Pre-place **retinoid placeholders**:

  * if retinoid == `tolerant` → place on **Mon** and **Fri** (2×/wk default).
  * if retinoid == `new` → place on **Mon** (1×/wk).
  * if retinoid == `none` → none.

  > These are placeholders for the example only. We do **linear adjacency** (no Sun↔Mon wrap‑around).
* Build a set of **forbidden days** for exfoliation:

  * all retinoid days, plus their immediate neighbors within the same week (e.g., Tue and Sun are neighbors of Mon **only if shown in this linear week; Sun is not considered adjacent to Mon**).
* Candidate days = days − forbidden.
* If `final_total == 0` → all days = “Hydrate” (with any retinoid placeholders kept).
* Else: greedily place `final_total` exfoliation nights on candidate days aiming for even spacing:

  * Compute ideal floating positions `i * 7/(final_total+1)` for `i=1..final_total`, round to nearest candidate day not yet used; if taken, choose nearest free candidate day; never place two exfoliation nights on consecutive days.
  * If **not enough candidate days** to place all `final_total` sessions, **reduce** the count until placement succeeds. Record a note in `conflicts_resolved`.
* Label placed nights with selected **AHA** or **BHA**; all other non‑retinoid nights → **Hydrate**.
* Output `example_week` as a 7‑item array of `"Retinoid" | "AHA" | "BHA" | "Hydrate"`.

**Step C10 – Rules & Warnings assembly**

* Always include: “Avoid stacking acids + retinoid on the same night (starter plan).”
* Always include: “In Free plan, never stack AHA & BHA the same night.”
* Add vitamin C / azelaic notes if relevant.
* Add sensitivity/rosacea caution if relevant.

---

## D) **Data Model**

**Enums**

* `SkinType`: `dry | normal | combo | oily`
* `Concern`: as given.
* `RetinoidUse`: `none | new | tolerant`
* `PreferredExfoliant`: `aha | bha | either`
* `SensitivityLevel`: `low | medium | high`
* `PlanTier`: `free | pro` (default free; future‑proofing)

**Typescript interfaces**

```ts
type Inputs = {
  skin_type: "dry"|"normal"|"combo"|"oily";
  concerns: ("acne"|"blackheads"|"pih"|"dullness"|"texture"|"sensitivity"|"rosacea")[];
  actives_in_routine: { retinoid: "none"|"new"|"tolerant"; vitc_acidic: boolean; azelaic_acid: boolean; };
  preferred_exfoliant: "aha"|"bha"|"either";
  sensitivity_level: "low"|"medium"|"high";
  plan_tier?: "free"|"pro";
};

type Output = {
  recommended_sessions_per_week: number; // 0..4
  exfoliant_type: "AHA"|"BHA";
  example_week: ("Retinoid"|"AHA"|"BHA"|"Hydrate")[]; // length 7
  rules: string[];
  explanations: {
    base_from_skin_type: number;
    concern_adjustments: { bha_bonus: number; aha_bonus: number; sensitivity_penalty: number; };
    caps: { retinoid_cap: number; sensitivity_cap: number; global_cap: number; final_cap_applied: number; };
    conflicts_resolved: string[];
    notes: string[];
  };
  warnings: string[];
};
```

---

## E) **Error Handling & Validation**

* **400** if:

  * Unknown enum value; missing required field; array contains duplicates outside allowed set.
  * `example_week` internal mismatch (dev sanity tests).
* **Validation rules:**

  * `concerns` must be unique; subset of allowed list.
  * `recommended_sessions_per_week` must be integer `0..4`.
  * `example_week.length === 7`.
  * If `retinoid != none`, `example_week` must contain 1 (“new”) or 2 (“tolerant”) “Retinoid” entries as per placeholder logic.
* **Message format (localized):**

```json
{ "code": "VALIDATION_ERROR", "field": "skin_type", "message": "Unsupported value 'x'." }
```

---

## F) **Frontend & UX Requirements**

* **Form controls**

  * Skin type: radio buttons (4).
  * Concerns: checkboxes (7) with helper tooltips.
  * Retinoid use: segmented control (None / New / Tolerant).
  * Vitamin C (acidic), Azelaic acid: toggles with info tooltips.
  * Preferred exfoliant: radio (AHA / BHA / Either).
  * Sensitivity level: radio (Low / Medium / High).
  * Submit button: “Generate plan”.
* **Results card**

  * Big number: “X× per week” and chip: “AHA” or “BHA”.
  * 7‑day row chips (Mon…Sun) with labels: Retinoid / AHA / BHA / Hydrate.
  * “Why this plan” expandable panel with `explanations`.
  * “Safety notes” panel listing `rules` and `warnings`.
* **Microcopy (EN/PL) examples**

  * EN: “We keep exfoliation off the day before and after retinoids to reduce irritation.”
  * PL: “Unikamy złuszczania dzień przed i po retinoidach, aby zmniejszyć podrażnienia.”
* **Accessibility (see U)**

---

## G) **Governance & Safety Disclaimers**

* “This tool provides general skincare guidance and is not medical advice.”
* “If you have active dermatitis, eczema, or are under dermatologic care, consult your clinician before exfoliating.”
* Show stronger caution when `sensitivity_level = high` or concerns include `rosacea`.

---

## H) **Health‑check & Monitoring (Service)**

* `/health` returns 200 + static `{status:"ok", version:"v1"}`.
* `/metrics` (Prometheus) exporting request counts, latencies, error rates, rule‑cap distributions.

---

## I) **Internationalization & Localization**

* UI and messages localized for **EN** and **PL** at launch.
* All enumerations and labels map through i18n keys (e.g., `concern.pih.label` → “post‑inflammatory hyperpigmentation” / “przebarwienia pozapalne”).
* Date labels “Mon…Sun” localized (`localeStartMonday` toggle; default Mon start to align with example).

---

## J) **User Journeys**

1. **Quick plan (anonymous)**

   * Fill form → compute → see plan → copy/share.
2. **Returning user (future)**

   * Load saved defaults (if consented) → tweak → recompute.
3. **Pro upsell (future)**

   * If conflicting constraints limit placement, show banner “Pro lets you fine‑tune retinoid nights and allow gentle AHA+BHA rotations.”

---

## K) **KPIs & Analytics**

* Conversion: % users who reach a result.
* Safety: % plans reduced due to caps; % warnings displayed.
* Engagement: clicks on “Why this plan”.
* Retention (future): % returning users applying similar inputs.

Event schema (example):

```json
{ "event":"plan_generated", "skin_type":"oily", "retinoid":"tolerant", "total":2, "type":"BHA", "had_warning":true }
```

---

## L) **Logging & Audit**

* Log only aggregate computation facts (no PII).
* Include `request_id`, `timestamp`, `final_total`, `type`, `caps_applied`: {which, to_what}.

---

## M) **Maintainability & Extensibility**

* Parameterize all constants (base frequencies, caps, placeholder days) in a config file.
* Strategy pattern for scheduling so Pro tier can override:

  * `FreeScheduler` (no stacking; fixed retinoid placeholders).
  * `ProScheduler` (user‑set retinoid nights; optional AHA/BHA alternation).

---

## N) **Non‑Functional Summary**

* **Performance:** p95 < 50 ms for compute; payload < 5 KB.
* **Availability:** 99.9% monthly for compute API.
* **Scalability:** stateless; horizontal autoscale.
* **Compatibility:** evergreen browsers; SSR or CSR allowed; no cookies required.

---

## O) **Operational & Deployment**

* Blue/green deploy; config via environment variables.
* Feature flags for: rosacea caution text, Pro scheduler, bilingual UI.

---

## P) **Performance & Load Testing**

* Synthetic load: 200 RPS sustained, p99 < 120 ms.
* Property-based tests to fuzz all enum combinations.

---

## Q) **Quality Assurance & Testing**

**Unit test matrix (illustrative subset; expandable):**

1. **Acne + oily + tolerant + low sens**

   * Expect BHA; base 3 +1 = 4 → cap by tolerant(3) → 3 sessions.
2. **Dry + rosacea + high sens + new retinoid**

   * Base 1 −1 = 0 → caps(1 & 1) → 0 sessions; strong caution.
3. **Normal + PIH + no retinoid + low sens**

   * Base 2 +1 = 3 → caps(4 & 4) → 3 sessions; AHA.
4. **Combo + acne+blackheads + medium sens + no retinoid**

   * Base 2 +2 = 4 → cap medium(2) → 2 sessions; BHA.
5. **Oily + acne + rosacea + tolerant**

   * Base 3 +1 → 4 → special override: BHA & 1×/wk; warning.
6. **Any case with vitC & azelaic true**

   * Rules include AM vitC guidance + azelaic on Hydrate notes.
7. **Scheduler with retinoid tolerant (Mon,Fri) & 2 sessions**

   * Ensure exfoliation on Wed and Sun (allowed by linear adjacency rule).
8. **Scheduler when not enough candidate days**

   * Reduce sessions and record `conflicts_resolved`.

**Contract tests:** Validate shape and enum outputs.
**Accessibility tests:** Keyboard nav + screen reader roles for result chips.

---

## R) **Reliability & Resilience**

* Timeouts on compute (2s).
* Safe defaults: if scheduling fails, return `"Hydrate"` week + explanation.

---

## S) **Security & Privacy**

* No account required; no PII; no cookies necessary.
* HTTPS only; CORS restricted to site origin.
* Rate limit: 60 req/min/IP.

---

## T) **Telemetry & Experimentation**

* A/B: Base freq choice for normal/combo (1 vs 2) behind flag; monitor irritation proxy (% high sens inputs who bounce).
* Track scheduling conflict rate pre/post tweaks.

---

## U) **Usability & Accessibility**

* WCAG 2.1 AA:

  * Color‑independent status (icons + text on chips).
  * Focus outlines; form labels; ARIA for role=“list” (week) and role=“listitem” (days).
  * Minimum 44×44 touch targets.
* Copy buttons: “Copy plan”.

---

## V) **Versioning & Backward Compatibility**

* v1 returns single exfoliant type (Free).
* v2 (future Pro) can return per‑night types:

```json
"example_week": ["Retinoid","Hydrate","BHA","Hydrate","Retinoid","AHA","Hydrate"]
```

* Maintain v1 for 6 months after v2 launch.

---

## W) **Wireframe (text) & UI Content**

**Form (left)**

* “Skin type” (4 radios)
* “Your concerns” (7 checkboxes)
* “Retinoid use” (3 segment buttons)
* “Other actives” (two toggles)
* “Preferred exfoliant” (3 radios)
* “Sensitivity level” (3 radios)
* [Generate plan]

**Results (right)**

* Header: `2× per week • AHA`
* Week row: Mon Retinoid · Tue Hydrate · Wed AHA · Thu Hydrate · Fri Retinoid · Sat Hydrate · Sun AHA
* Safety notes & Why panels

---

## X) **eXamples (Sample requests / responses)**

### X1. 2×/wk AHA with retinoid tolerant (like in the brief)

**Request**

```json
{
  "skin_type": "normal",
  "concerns": ["pih"],
  "actives_in_routine": {"retinoid":"tolerant","vitc_acidic":false,"azelaic_acid":false},
  "preferred_exfoliant":"either",
  "sensitivity_level":"low"
}
```

**Computation**

* Base 2; +1 AHA → 3; caps: retinoid 3, sensitivity 4 → **3**.
* But with Mon & Fri retinoid placeholders, candidates are Wed & Sun → only **2** can be safely placed → reduce to **2**; note conflict.
* Type: AHA.

**Response**

```json
{
  "recommended_sessions_per_week": 2,
  "exfoliant_type": "AHA",
  "example_week": ["Retinoid","Hydrate","AHA","Hydrate","Retinoid","Hydrate","AHA"],
  "rules": [
    "Avoid stacking acids + retinoid same night in starter plan",
    "In Free plan, never stack AHA & BHA on the same night"
  ],
  "explanations": {
    "base_from_skin_type": 2,
    "concern_adjustments": {"bha_bonus":0,"aha_bonus":1,"sensitivity_penalty":0},
    "caps": {"retinoid_cap":3,"sensitivity_cap":4,"global_cap":4,"final_cap_applied":2},
    "conflicts_resolved": ["Reduced from 3 to 2 due to adjacency limits with Mon/Fri retinoid."],
    "notes": []
  },
  "warnings": []
}
```

### X2. Oily skin, acne only, no retinoid, medium sensitivity

* Base 3 +1 BHA → 4; cap medium 2 → **2 BHA**.
* Example week (no retinoid): Tue & Fri BHA.

### X3. Dry, rosacea + acne, new to retinoid, high sensitivity

* Base 1 −1 → 0; special override BHA 1×/wk max; but retinoid_cap=1, sensitivity_cap=1 → **0 or 1?** Final safety chooses **1 BHA max** only if candidates exist away from Mon retinoid; with Mon retinoid, candidates: Wed, Thu, Fri, Sat, Sun (non‑adjacent Tue & Sun blocked) → choose **Wed**. Add strong warning.

### X4. Combo, texture+dullness, no retinoid, low sens, prefers BHA

* Base 2 +1 AHA → 3; preference=BHA honored (efficacy note: AHA might target texture better). **3 BHA** (Tue, Thu, Sun).

### X5. Normal, blackheads, tolerant retinoid, medium sensitivity, vitC+azelaic

* Base 2 +1 BHA → 3; caps: retinoid 3, sensitivity 2 → **2 BHA** (Wed, Sun), rules include vitC AM use & azelaic on Hydrate.

---

## Y) **Yardsticks (Acceptance Criteria)**

* ✅ Given `oily + acne + none retinoid + low`, API returns `type=BHA`, `sessions ∈ [1..4]` and never > 4.
* ✅ If `retinoid=new`, `recommended_sessions_per_week ≤ 1`.
* ✅ With `retinoid=tolerant` and `sessions>2`, planner **reduces** sessions if adjacency prevents safe placement and records a conflict note.
* ✅ If both `acne` and `rosacea` present → `type=BHA`, `sessions ≤ 1`, includes caution warning.
* ✅ `example_week` length is 7 and contains only valid tokens.
* ✅ No AHA/BHA on the same night in `plan_tier=free`.

---

## Z) **Zero‑defect Rollout & Known Limitations / Roadmap**

* **Known limitations (v1)**

  * Retinoid nights are fixed placeholders (Mon / Mon+Fri). Users can’t edit them.
  * Only one exfoliant type per week (Free).
  * Linear adjacency (Sun is NOT adjacent to Mon) to match example.

* **Roadmap (v2 Pro)**

  * User‑editable retinoid nights and counts.
  * Alternating AHA/BHA patterns across the week (still no per‑night stacking).
  * Morning vs evening guidance blocks (with vitamin C, azelaic placements).
  * Per‑concern weight sliders (severity).

---

## Reference Implementation Pseudocode (deterministic)

```ts
function computePlan(input: Inputs): Output {
  const baseBySkin = { dry:1, normal:2, combo:2, oily:3 };
  let base = baseBySkin[input.skin_type];

  const has = (c:string)=>input.concerns.includes(c);
  let bhaBonus = (has("acne")?1:0) + (has("blackheads")?1:0);
  bhaBonus = Math.min(bhaBonus, 2);
  let ahaBonus = (has("pih")||has("texture")||has("dullness")) ? 1 : 0;
  const sensPenalty = (has("sensitivity")||has("rosacea")) ? 1 : 0;

  let pre = Math.max(0, Math.min(4, base + bhaBonus + ahaBonus - sensPenalty));

  let retinoidCap = 4;
  if (input.actives_in_routine.retinoid === "new") retinoidCap = 1;
  else if (input.actives_in_routine.retinoid === "tolerant") retinoidCap = 3;

  const sensCap = input.sensitivity_level === "high" ? 1 :
                  input.sensitivity_level === "medium" ? 2 : 4;

  let finalTotal = Math.min(pre, retinoidCap, sensCap, 4);

  // Type selection
  let type: "AHA"|"BHA";
  if (input.preferred_exfoliant !== "either") {
    type = input.preferred_exfoliant.toUpperCase() as "AHA"|"BHA";
  } else if (has("acne") || has("blackheads")) {
    type = "BHA";
  } else if (ahaBonus > 0) {
    type = "AHA";
  } else { type = "AHA"; }

  const warnings:string[] = [];
  if (has("acne") && has("rosacea")) {
    type = "BHA";
    finalTotal = Math.min(finalTotal, 1);
    warnings.push("Rosacea + acne: limit BHA to 1×/week and monitor irritation.");
  }

  // Example week with retinoid placeholders (linear adjacency)
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const week = Array(7).fill("Hydrate");
  let retDays:number[] = [];
  if (input.actives_in_routine.retinoid === "new") retDays = [0];        // Mon
  if (input.actives_in_routine.retinoid === "tolerant") retDays = [0,4]; // Mon,Fri
  retDays.forEach(i=>week[i]="Retinoid");

  const forbidden = new Set<number>();
  retDays.forEach(i=>{
    forbidden.add(i);
    if (i-1>=0) forbidden.add(i-1);
    if (i+1<=6) forbidden.add(i+1);
  });

  const candidates = days.map((_,i)=>i).filter(i=>!forbidden.has(i));
  let canPlace = Math.min(finalTotal, candidates.length);
  const targetCount = canPlace; // may be < finalTotal

  // even spacing greedy
  const chosen:number[] = [];
  for (let k=1; k<=targetCount; k++){
    const ideal = Math.round(k * 7/(targetCount+1)) - 1;
    // pick nearest available candidate not adjacent to existing exfoliation
    let pick = -1, bestDist = 99;
    for (const c of candidates){
      if (chosen.includes(c)) continue;
      if (chosen.some(d=>Math.abs(d-c)===1)) continue;
      const dist = Math.abs(c - ideal);
      if (dist < bestDist){ bestDist = dist; pick = c; }
    }
    if (pick>=0) chosen.push(pick);
  }
  chosen.sort((a,b)=>a-b).forEach(i=>week[i]=type);

  const reduced = finalTotal > targetCount;
  const rules = [
    "Avoid stacking acids + retinoid same night in starter plan",
    "In Free plan, never stack AHA & BHA on the same night"
  ];
  if (input.actives_in_routine.vitc_acidic) rules.push("Use vitamin C (ascorbic acid) in the morning on non‑exfoliation days.");
  if (input.actives_in_routine.azelaic_acid) rules.push("Prefer azelaic acid on Hydrate nights.");

  return {
    recommended_sessions_per_week: targetCount,
    exfoliant_type: type,
    example_week: week as any,
    rules,
    explanations: {
      base_from_skin_type: base,
      concern_adjustments: { bha_bonus: bhaBonus, aha_bonus: ahaBonus, sensitivity_penalty: sensPenalty },
      caps: { retinoid_cap: retinoidCap, sensitivity_cap: sensCap, global_cap: 4, final_cap_applied: targetCount },
      conflicts_resolved: reduced ? ["Reduced sessions due to limited safe candidate days around retinoid nights."] : [],
      notes: []
    },
    warnings
  };
}
```

---

## Implementation Notes & Developer Checklist

* [ ] Implement input schema validation (Zod/Yup/JSON‑Schema).
* [ ] Parameterize constants (`config/planner.json`).
* [ ] Build Free scheduler as above; keep interface open for Pro.
* [ ] Add i18n keys for all labels/messages.
* [ ] Add unit tests for each case in section Q.
* [ ] Add analytics events in section K.
* [ ] Add health and metrics endpoints.
* [ ] Ship with disclaimers (section G) and A11y (section U).
