# Tool Specification — Kompatybilność pH

> **Canonical decision:** Implement using the shared tooling platform in `docs/adr/ADR-022-tools-and-calculators-platform.md`.

Below is a complete **A–Z requirements** spec for implementing

**`/skin/narzedzia/ph-kompatybilnosc/` — pH Compatibility Estimator**
(*Polish slug kept; internal names in English for clarity*).

---

## A) Audience & Scope

* **Audience:** Consumer skincare users (B2C) and support editors/operators (B2B/ops).
* **Scope:** A stateless service that:

  1. estimates step pH values from partial info,
  2. computes adjacent pH deltas,
  3. raises caution flags for known incompatibilities,
  4. suggests an application order,
  5. returns structured, explainable output.
* **Out of scope:** Medical advice; exact chemical stability modeling; real-time lab measurements.

---

## B) Background & Objectives

* **Problem:** Users stack products with differing pH, risking irritation or ineffective actives.
* **Objective:** Provide a **heuristic**, explainable estimate of pH-based compatibility and ordering, **without enforcing wait times** and **without medical claims**.

---

## C) Core Functional Requirements

1. **Input acceptance**

   * Accept an ordered list of routine steps with optional `known_ph` and `actives`.
2. **pH estimation**

   * For each step, assign `ph_est` using **known** value if present, else infer using rules (see H).
3. **Delta computation**

   * Compute absolute pH differences between adjacent steps with numeric `ph_est`.
4. **Flagging**

   * Emit structured `flags` based on rule set (see F).
5. **Ordering suggestion**

   * Propose an application order based on buckets: **acids (<4.0)** → **neutrals (~5–6)** → **oils/anhydrous** → **occlusives**; no enforced wait time.
6. **Edge-case handling**

   * If no known pH and no recognizable actives for **all** steps → return neutral guidance only (see V/Z).
7. **Explainability**

   * Return `per_step.explain` with the rule/source used and confidence.
8. **Internationalization**

   * All user-facing strings translatable (Polish & English at minimum).
9. **Determinism**

   * Given the same input and rules version, output must be identical (no randomness).
10. **Inter-tool handoff**

* If **AHA/BHA and retinoid in same routine**, include `handoff` hint to “interactions” tool (no blocking).

---

## D) Data Model & Types

**Input step**

```json
{
  "name": "string (required)",
  "known_ph": 3.0,     // number in [0,14] or null
  "actives": ["ascorbic acid", "niacinamide"] // array of strings; optional
}
```

**Derived per-step fields**

* `ph_est: number|null` (rounded to 0.1; null only for “ignore pH” cases like certain anhydrous retinoids).
* `class: "acid" | "neutral" | "anhydrous" | "occlusive" | "unknown"`
* `explain: { source: "known"|"inferred", rule_id: string, notes?: string, confidence: number }`

**Output object**

```json
{
  "estimated_ph": [3.0, 6.0, 5.5],
  "pairwise_deltas": [3.0, 0.5],
  "flags": [
    {"type":"caution","where":"L-AA Vitamin C → Peptide","reason":"Large pH jump","severity":"medium","rule_id":"flag.pHjump.v1"}
  ],
  "order_suggestion": ["L-AA Vitamin C serum","Peptide serum","Moisturizer"],
  "per_step": [
    { "name":"L-AA Vitamin C serum","ph_est":3.0,"class":"acid","explain":{"source":"known","rule_id":"src.known","confidence":1.0}},
    { "name":"Peptide serum","ph_est":6.0,"class":"neutral","explain":{"source":"inferred","rule_id":"map.peptide.6.0","confidence":0.6}},
    { "name":"Moisturizer","ph_est":5.5,"class":"neutral","explain":{"source":"known","rule_id":"src.known","confidence":1.0}}
  ],
  "handoff": [
    // optional; see W
  ],
  "meta": {"rules_version":"1.0.0","locale":"en-US"}
}
```

---

## E) Endpoints & API Contract

* **Method/Path:** `POST /skin/narzedzia/ph-kompatybilnosc/estimate`
* **Content-Type:** `application/json; charset=utf-8`
* **Request body:**

```json
{
  "steps": [ /* array of step objects as in D */ ],
  "options": {
    "locale": "pl-PL|en-US",
    "round_to": 1,                   // decimals for pH rounding; default 1
    "enable_extended_mappings": true // includes peptide heuristic etc.
  }
}
```

* **Responses:**

  * `200 OK` with output object (see D).
  * `400 Bad Request` – malformed JSON or missing `steps`.
  * `422 Unprocessable Entity` – validation failures (see V).
  * `500 Internal Server Error` – unexpected.
* **Headers:**

  * `X-Rules-Version: 1.0.0`
  * `Cache-Control: no-store` (privacy-first, see P).
* **Idempotency:** pure function of input + rules version.

---

## F) Flag Rules (Business Logic)

Emit `flags[]` items with `{type, where, reason, severity, rule_id}`.

1. **Large pH jump after strong acid**

   * **Condition:** Any step with `ph_est < 3.5` followed immediately by `ph_est > 6.0`.
   * **Action:** `caution`, reason “Large pH jump”, severity `medium`, `rule_id: flag.pHjump.v1`.
2. **Ascorbic acid adjacent to copper peptide**

   * **Condition:** `"ascorbic acid"` in step **i** and `"copper peptide"` (or synonyms) in **i±1**.
   * **Action:** `caution`, reason “Potential instability”, severity `medium`, `rule_id: flag.vc.cu.v1`.
3. **AHA/BHA with retinoid in same routine**

   * **Condition:** Any step with `aha|bha` and any step with `retinoid` (anywhere in routine).
   * **Action:** `caution`, reason “Irritation risk; review interactions”, severity `high`, `rule_id: flag.aha.retinoid.v1`, plus **handoff** (see W).
4. **Optional informative flags** (non-blocking; configurable):

   * Very low pH product (`ph_est <= 2.5`): “May be sensitizing”.
   * Very high pH product (`ph_est >= 8.0`): “May disrupt acid mantle”.

> **Severity scale:** `info` < `low` < `medium` < `high`.

---

## G) Glossary & Taxonomy

* **AHA:** glycolic, lactic, mandelic, tartaric, malic, citric acids.
* **BHA:** salicylic acid.
* **Ascorbic acid:** L-ascorbic acid, L-AA, vitamin C (acidic form).
* **Retinoid (anhydrous):** anhydrous retinol, water-free retinoid solutions/serums.
* **Copper peptide:** GHK-Cu, copper tripeptide-1.
* **Occlusives:** petrolatum, waxes, heavy balms, high-dimethicone barriers.

---

## H) Heuristics Mapping (pH inference)

When `known_ph` is null, infer `ph_est` using **first match wins**:

| Rule ID             | Pattern (name/actives contains)                   | Target range         | Use value |
| ------------------- | ------------------------------------------------- | -------------------- | --------- |
| `map.ascorbic.3.0`  | `ascorbic acid`, `l-ascorbic`, `vitamin c (L-AA)` | 2.5–3.5              | **3.0**   |
| `map.ahabha.3.5`    | `aha`, `bha`, or any AHA/BHA from G               | 3.2–4.0              | **3.5**   |
| `map.azelaic.4.5`   | `azelaic acid`                                    | 4.0–5.0              | **4.5**   |
| `map.niacinamide.6` | `niacinamide`, `vitamin b3`                       | ~5.0–7.0             | **6.0**   |
| `map.peptide.6.0`   | **Keyword** `peptide` in `name` or `actives`      | neutral/slight-basic | **6.0**   |
| `map.retin.anhyd`   | `retinoid` **and** `anhydrous` (name)             | n/a (ignore pH)      | **null**  |
| `map.default.5.5`   | none of the above                                 | 5.0–6.0              | **5.5**   |

* **Rationale:** `map.peptide.6.0` is included to match the sample output provided.
* **Rounding:** Round numeric estimates to **1 decimal place** (configurable).

---

## I) Input Validation & Normalization

* Trim whitespace; collapse multiple spaces.
* Case-insensitive matching for keywords.
* Normalize actives by lowercasing and stripping punctuation.
* Validate `known_ph` ∈ [0,14]. Reject otherwise (422).
* If `name` is empty or non-string → 422.
* If `steps` is empty array → 422 with “At least one step required”.
* De-duplicate actives per step.

---

## J) JSON Schemas (Request/Response)

**Request**

```json
{
  "type":"object",
  "required":["steps"],
  "properties":{
    "steps":{
      "type":"array",
      "minItems":1,
      "items":{
        "type":"object",
        "required":["name"],
        "properties":{
          "name":{"type":"string","minLength":1,"maxLength":200},
          "known_ph":{"type":["number","null"],"minimum":0,"maximum":14},
          "actives":{
            "type":"array",
            "items":{"type":"string","minLength":1},
            "default":[]
          }
        },
        "additionalProperties":false
      }
    },
    "options":{
      "type":"object",
      "properties":{
        "locale":{"type":"string","enum":["pl-PL","en-US"]},
        "round_to":{"type":"integer","minimum":0,"maximum":2,"default":1},
        "enable_extended_mappings":{"type":"boolean","default":true}
      },
      "additionalProperties":false
    }
  },
  "additionalProperties":false
}
```

**Response** (abridged)

```json
{
  "type":"object",
  "required":["estimated_ph","pairwise_deltas","flags","order_suggestion","per_step","meta"],
  "properties":{
    "estimated_ph":{"type":"array","items":{"type":["number","null"]}},
    "pairwise_deltas":{"type":"array","items":{"type":["number","null"]}},
    "flags":{"type":"array","items":{
      "type":"object",
      "required":["type","where","reason","severity","rule_id"],
      "properties":{
        "type":{"type":"string","enum":["caution","info"]},
        "where":{"type":"string"},
        "reason":{"type":"string"},
        "severity":{"type":"string","enum":["low","medium","high"]},
        "rule_id":{"type":"string"}
      }
    }},
    "order_suggestion":{"type":"array","items":{"type":"string"}},
    "per_step":{"type":"array","items":{
      "type":"object",
      "required":["name","ph_est","class","explain"],
      "properties":{
        "name":{"type":"string"},
        "ph_est":{"type":["number","null"]},
        "class":{"type":"string","enum":["acid","neutral","anhydrous","occlusive","unknown"]},
        "explain":{"type":"object",
          "required":["source","rule_id","confidence"],
          "properties":{"source":{"type":"string"},"rule_id":{"type":"string"},"notes":{"type":"string"},"confidence":{"type":"number"}}
        }
      }
    }},
    "handoff":{"type":"array","items":{"type":"object"}},
    "meta":{"type":"object","required":["rules_version","locale"],"properties":{"rules_version":{"type":"string"},"locale":{"type":"string"}}}
  }
}
```

---

## K) Key Algorithms & Pseudocode

```pseudo
function estimate(request):
  steps = normalize(request.steps)
  est = []
  per_step = []
  for s in steps:
    if is_number(s.known_ph):
       ph = round(s.known_ph, round_to)
       rule = "src.known"; src="known"; conf=1.0
    else:
       (ph, rule, conf) = infer_ph(s, options.enable_extended_mappings)
    class = classify(ph, s) // acid/neutral/anhydrous/occlusive/unknown
    est.append(ph)
    per_step.append({name:s.name, ph_est:ph, class, explain:{source:src, rule_id:rule, confidence:conf}})
  deltas = []
  for i in 0..len(est)-2:
    if est[i] != null and est[i+1] != null:
       deltas.append(abs(est[i]-est[i+1]))
    else:
       deltas.append(null)
  flags = apply_flag_rules(steps, per_step, deltas)
  order = suggest_order(steps, per_step)
  handoff = build_handoffs(per_step, flags)
  return {estimated_ph:est, pairwise_deltas:deltas, flags, order_suggestion:order,
          per_step, handoff, meta:{rules_version:"1.0.0", locale:options.locale}}
```

---

## L) Logging & Observability

* **Request log (PII-minimized):** timestamp, hash of payload, rules_version, duration, success/error code.
* **Event log:** rule matches (`rule_id`), flag counts, handoff triggers.
* **Correlation ID:** `X-Request-Id` propagated through stack.
* **No** storage of full product names in long-term logs unless user opts in (see P).

---

## M) Monitoring & Metrics

* **SLI/SLO:** p95 latency ≤ 100ms under 50 steps; 99.9% uptime monthly.
* **Metrics:** requests/sec, error rate (by code), rule hit rates, average steps per request.
* **Dashboards:** latency histograms, 4xx/5xx time series, top rule triggers.

---

## N) Non‑Functional Requirements

* **Performance:** O(n) with small constant factors; scale to 200 steps per request.
* **Reliability:** Graceful degradation—if inference fails for a step, set `ph_est: null`, preserve rest.
* **Security:** TLS 1.2+; input size caps (≤ 64 KB); WAF for JSON.
* **Privacy:** No persistent storage of routines by default; redact names in logs unless consent.
* **Compliance:** GDPR-ready; DSAR support if any data persisted via opt-in.
* **Accessibility (UI):** color + icon cues; WCAG 2.1 AA; tooltips with text equivalents.
* **i18n/l10n:** locale-driven strings; decimal separator formatting per locale.
* **Maintainability:** Rules externalized in config (see Y), unit-tested, versioned.

---

## O) Ordering Suggestions Engine

1. **Bucket each step:**

   * `acid` if `ph_est < 4.0`.
   * `neutral` if `4.0 ≤ ph_est ≤ 6.5` or `ph_est` null but not anhydrous and not occlusive.
   * `anhydrous` if rule `map.retin.anhyd` matched or name contains indicators (e.g., “water-free”, “anhydrous oil”).
   * `occlusive` if keywords (balm, petrolatum, wax, ointment) detected.
2. **Stable sort** by bucket order: `acid` → `neutral` → `anhydrous` → `occlusive`.
3. **Tie-breakers:**

   * Within bucket, preserve original order.
   * If two acids: lower `ph_est` first.
4. **Notes:** No mandatory wait time. Include optional tip: “If sensitive, consider spacing strong acids and high-pH steps.”

---

## P) Privacy, Security & Compliance

* **Data Minimization:** Process in-memory; no database writes unless an explicit “Save routine” feature exists (out of scope here).
* **PII:** Product names may imply preferences; treat as sensitive.
* **Retention:** Request/response bodies not retained; metrics aggregated only.
* **Security reviews:** Dependency scanning; static analysis; threat model done before GA.

---

## Q) Quality Assurance & Testing

* **Unit tests:** mapping rules, classification, deltas, flag triggers, ordering ties.
* **Property tests:** idempotence (same input → same output), numeric invariants (0≤pH≤14).
* **Integration tests:** API contract, JSON schema validation, i18n strings present.
* **Regression tests:** lock known inputs/outputs (golden files) per rules_version.
* **Example tests (must pass):**

  1. **Given** sample input in the prompt
     **Expect** `estimated_ph=[3.0,6.0,5.5]`, `pairwise_deltas=[3.0,0.5]`, `flag.pHjump.v1` present, and suggested order identical to input.
  2. All-null with no actives → “neutral guidance only” (see V/Z).
  3. AHA + retinoid anywhere → high-severity flag + handoff.

---

## R) Risks, Limitations & Mitigations

* **Heuristics ≠ lab truth** → Prominent disclaimer; `confidence` field provided.
* **Ingredient name variability** → Synonym lists & NLP normalization (see S).
* **False positives for peptides** → Rule can be toggled (`enable_extended_mappings`).
* **User overreliance** → “Not medical advice” banner and copy.

---

## S) Synonyms & NLP Canonicalization

* **Normalization:** lowercase, strip diacritics, remove punctuation.
* **Keyword groups:**

  * AHA: `glycolic`, `lactic`, `mandelic`, `tartaric`, `malic`, `citric`.
  * BHA: `salicylic`.
  * Ascorbic acid: `ascorbic`, `l-ascorbic`, `vitamin c (l-aa)`.
  * Azelaic acid: `azelaic`.
  * Niacinamide: `niacinamide`, `vitamin b3`.
  * Peptides: `peptide`, `oligopeptide`, `tripeptide`, `copper peptide`, `ghk-cu`.
  * Retinoid anhydrous indicators: `anhydrous`, `water-free`, `squalane retinol`.
  * Occlusives: `petrolatum`, `beeswax`, `paraffin`, `ointment`, `balm`, `lanolin`, `dimethicone (high %)`.
* **Matching:** Look in both `name` and `actives`.

---

## T) Telemetry & Analytics (opt‑in)

* Count feature usage, average list length, most common rule hits.
* A/B test different **wording** of flags only (never algorithm without version bump).
* Store no raw product names unless users opt in.

---

## U) UI/UX Requirements

* **Route:** `/skin/narzedzia/ph-kompatybilnosc/`
* **Inputs:**

  * Dynamic list builder (name, known pH, actives).
  * Autocomplete for common actives (localized).
* **Outputs:**

  * **Per step chips:** Name + pH badge (e.g., “3.0”), class icon.
  * **Delta bar:** between tiles showing `Δ=…` (hide if null).
  * **Flags panel:** grouped by severity; concise text with “Learn more”.
  * **Order suggestion:** draggable list reflecting recommended order; “Reset to my order”.
  * **Disclaimer:** “Heuristic estimate; not medical advice.”
* **Accessibility:** Keyboard add/remove/reorder; announce flags to screen readers.
* **Localization:** Polish defaults for this path; English fallback.

---

## V) Versioning & Governance

* **Rules version:** Semantic version (e.g., `1.0.0`). Any logic change bumps minor/patch; behavior changes bump minor; output schema changes bump major.
* **Response header:** `X-Rules-Version`.
* **Changelog:** machine-readable (JSON) for client UIs to display “What changed”.

---

## W) Workflow & Integration (Inter‑tool Handoffs)

* When `flag.aha.retinoid.v1` is triggered:

```json
"handoff": [{
  "tool":"interactions",
  "reason":"AHA/BHA with retinoid in same routine → irritation risk",
  "steps_involved":["<names>"],
  "suggestion":"Review detailed interaction guidance"
}]
```

* Handoffs are **suggestions**; the estimator never blocks.

---

## X) eXplainability & Traceability

* For **each** step, include:

  * `explain.source` (`known` / `inferred`),
  * `explain.rule_id` (e.g., `map.ahabha.3.5`),
  * `explain.confidence` (1.0 known; else 0.6 default; rule-specific allowed),
  * optional `explain.notes` (e.g., “matched ‘peptide’ in name”).
* For **each** flag, return `rule_id` so UIs can link learn-more docs.

---

## Y) YAML/Config for Rules (externalized)

Example `rules.yaml` (abridged):

```yaml
version: "1.0.0"
inference:
  - id: map.ascorbic.3.0
    patterns: ["ascorbic acid","l-ascorbic","vitamin c (l-aa)"]
    value: 3.0
    class: acid
    confidence: 0.8
  - id: map.ahabha.3.5
    patterns: ["aha","bha","glycolic","lactic","mandelic","tartaric","malic","citric","salicylic"]
    value: 3.5
    class: acid
    confidence: 0.7
  - id: map.azelaic.4.5
    patterns: ["azelaic"]
    value: 4.5
    class: neutral
    confidence: 0.7
  - id: map.niacinamide.6
    patterns: ["niacinamide","vitamin b3"]
    value: 6.0
    class: neutral
    confidence: 0.7
  - id: map.peptide.6.0
    patterns: ["peptide","ghk-cu","copper peptide","tripeptide","oligopeptide"]
    value: 6.0
    class: neutral
    confidence: 0.6
  - id: map.retin.anhyd
    patterns: ["anhydrous","water-free"]
    require_any_of: ["retinol","retinoid","retinal","hpr","granactive"]
    value: null
    class: anhydrous
    confidence: 0.7
  - id: map.default.5.5
    value: 5.5
    class: neutral
    confidence: 0.5
flags:
  - id: flag.pHjump.v1
    type: caution
    severity: medium
    condition: "prev.ph<3.5 AND next.ph>6.0"
    reason: "Large pH jump"
  - id: flag.vc.cu.v1
    type: caution
    severity: medium
    condition: "adjacent(ascorbic acid, copper peptide)"
    reason: "Potential instability"
  - id: flag.aha.retinoid.v1
    type: caution
    severity: high
    condition: "exists(AHAorBHA) AND exists(retinoid)"
    reason: "Irritation risk (review interactions)"
```

---

## Z) Zero‑data / Edge Cases & Future Roadmap

* **Zero‑knowledge case:** If **all** steps have `known_ph=null` **and** no patterns match any step:

  * Return `estimated_ph` as array of **5.5** (neutral default) **or null** (configurable).
  * Suppress delta/flags; include `meta.neutral_guidance=true` and show generic ordering (neutrals → occlusives).
* **Other edges:**

  * Non-numeric `known_ph` → 422 with pointer (`/steps/idx/known_ph`).
  * `ph_est=null` in delta computation → delta `null` at that junction.
* **Future roadmap (non-blocking):**

  * Brand/product database for empirical pH.
  * User sensitivity profile to tune flag severities.
  * Batch comparison of alternative orders (“what-if”).
  * More actives (PHA, tranexamic acid, benzoyl peroxide) with dedicated rules.

---

### Acceptance Criteria (summary)

* Given the sample in the prompt, the service returns exactly:

  * `estimated_ph=[3.0,6.0,5.5]`, `pairwise_deltas=[3.0,0.5]`,
  * one `caution` flag for the large jump (Vitamin C → Peptide),
  * `order_suggestion` equals `["L-AA Vitamin C serum","Peptide serum","Moisturizer"]`,
  * `per_step` explains sources and rules,
  * `meta.rules_version="1.0.0"`.
