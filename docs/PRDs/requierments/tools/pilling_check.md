Below is a complete **A–Z requirements spec** (functional + non‑functional) for **`/skin/narzedzia/pilling-check` — Pilling Risk Estimator** that engineers can implement directly. It includes API contract, dictionaries, heuristics, scoring logic, acceptance tests, observability, and rollout.

---

## A) API Overview & Objectives

* **Goal:** Estimate the risk of cosmetic pilling for a skincare routine from (1) ingredient lists per step and (2) layering behavior.
* **Primary Output:** Risk **score**, **bucket**, **contributors**, **mitigation tips**.
* **Determinism:** Given identical inputs, returns identical outputs (no randomness).
* **Idempotent:** POST with the same body returns the same response; safe to retry.

---

## B) Business Rules & Scoring Model (authoritative)

**Inputs:**

```json
{
  "inci_per_step": [
    {"step":"serum","inci":"..."},
    {"step":"moisturizer","inci":"..."},
    {"step":"sunscreen","inci":"..."}
  ],
  "layering": {
    "num_steps": 3,
    "wait_seconds_between_steps": 30,
    "uses_silicone_primer": true,
    "rubs_in_vigorously": true
  }
}
```

**Ingredient factors** (computed **once per routine**):

* **Film‑formers (type groups):**
  Groups = {**silicones**, **acrylates** (excl. carbomer), **carbomer**, **vp/va**, **polyquats**}.
  **+2** points for **each distinct group present anywhere** in the routine, **capped at +6** (i.e., max 3 groups contribute).
* **High mineral load:** If **zinc oxide** or **titanium dioxide** appears **within the first 5** ingredients of **any** step ⇒ **+2** (applied once per routine).

**Behavior factors** (applied once per routine):

* **Many steps:** if `num_steps ≥ 5` ⇒ **+2**.
* **Short waits:** if `wait_seconds_between_steps < 60` ⇒ **+2**.
* **Silicone stack:** if `uses_silicone_primer = true` **AND** a **sunscreen** step is **silicone‑heavy** (heuristics in §E) ⇒ **+2**.
* **Application style:** if `rubs_in_vigorously = true` ⇒ **+1** (patting reduces pilling risk).

**Total score:** Sum of all applicable points.
**Buckets:** `0–3` **low**, `4–7` **moderate**, `≥8` **high**.

---

## C) Contract (Request/Response) & Schemas

### Endpoint

* **Method/Path:** `POST /skin/narzedzia/pilling-check`
* **Content-Type:** `application/json; charset=utf-8`
* **Auth:** See §P (JWT or session cookie).

### Request JSON Schema (draft-07+)

```json
{
  "type": "object",
  "required": ["inci_per_step", "layering"],
  "additionalProperties": false,
  "properties": {
    "inci_per_step": {
      "type": "array",
      "minItems": 1,
      "maxItems": 20,
      "items": {
        "type": "object",
        "required": ["step", "inci"],
        "additionalProperties": false,
        "properties": {
          "step": { "type": "string", "minLength": 1, "maxLength": 100 },
          "inci": { "type": "string", "minLength": 1, "maxLength": 10000 }
        }
      }
    },
    "layering": {
      "type": "object",
      "required": ["num_steps", "wait_seconds_between_steps", "uses_silicone_primer", "rubs_in_vigorously"],
      "additionalProperties": false,
      "properties": {
        "num_steps": { "type": "integer", "minimum": 1, "maximum": 20 },
        "wait_seconds_between_steps": { "type": "integer", "minimum": 0, "maximum": 1800 },
        "uses_silicone_primer": { "type": "boolean" },
        "rubs_in_vigorously": { "type": "boolean" }
      }
    },
    "options": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "locale": { "type": "string", "default": "en" },
        "return_explain": { "type": "boolean", "default": false },
        "strict_inci_order": { "type": "boolean", "default": true }
      }
    }
  }
}
```

### Response JSON (base)

```json
{
  "score": 8,
  "bucket": "high",
  "contributors": [
    "multiple film-formers",
    "mineral UV filters top-5",
    "short wait times",
    "silicone primer + silicone sunscreen"
  ],
  "tips": [
    "Wait 60–90s between steps",
    "Pat on sunscreen",
    "Consider lighter moisturizer"
  ]
}
```

### Response JSON (optional explain block when `return_explain: true`)

```json
{
  "score": 8,
  "bucket": "high",
  "contributors": [...],
  "tips": [...],
  "explain": {
    "factors": [
      {"code":"FILM_FORMERS", "value":6, "groups_triggered":["silicones","acrylates","vp/va"], "cap_applied":true},
      {"code":"MINERAL_TOP5", "value":2, "steps":["sunscreen"]},
      {"code":"SHORT_WAIT", "value":2, "wait_seconds":30},
      {"code":"SILICONE_STACK", "value":2, "primer":true, "sunscreen_silicone_heavy":true},
      {"code":"RUB_STYLE", "value":1, "rubs_in_vigorously":true}
    ],
    "ingredient_matches": {
      "silicones": ["dimethicone","cyclopentasiloxane","trimethylsiloxysilicate"],
      "acrylates": ["Acrylates/C10-30 Alkyl Acrylate Crosspolymer"],
      "vp_va": ["VP/VA Copolymer"],
      "polyquats": []
    },
    "mineral_positions": {"sunscreen": ["Zinc Oxide (2)"]},
    "warnings": []
  }
}
```

### Error format (RFC 7807 style)

```json
{
  "type": "https://docs.example.com/errors/validation",
  "title": "Invalid request",
  "status": 400,
  "detail": "layering.num_steps (5) does not match inci_per_step length (3)",
  "errors": [
    {"path":"/layering/num_steps", "code":"MISMATCH_WITH_STEPS", "expected":3, "actual":5}
  ]
}
```

---

## D) Data Model & Dictionaries (INCI lexicons)

Implement normalized, case‑insensitive string matching over tokenized INCI.

**Normalization (apply in order):**

1. Lowercase; 2. Replace Unicode diacritics; 3. Convert `/` to `/` literal (keep in copolymer names);
2. Remove duplicate whitespace; 5. Split by `,` into ordered list; 6. Trim each token; 7. Strip enclosing parentheses content into a notes array (optional).

**Core groups & indicative patterns:**

* **Silicones:** tokens containing `silicone`, `siloxane`, `-methicone`, `-trimethicone`, `dimethiconol`, `trimethylsiloxysilicate`, `polysilicone-`, `cetearyl methicone`, `phenyl trimethicone`, `bis-peg-…-dimethicone`.
  *Regex (suggestion):* `\b(?:[a-z- ]*siloxane|[a-z- ]*silicone|[a-z- ]*methicone|dimethiconol|trimethylsiloxysilicate|polysilicone-\d+|phenyl trimethicone|cetearyl methicone)\b`
* **Acrylates (excl. carbomer):** `acrylates`, `polyacrylate`, `acrylate crosspolymer`, `acrylate copolymer`, `poly(meth)acrylate`, `crosspolymer` when paired with acrylates.
  *Regex:* `\b(?:acrylates(?:\/[a-z0-9 -]+)? (?:co|cross)polymer|poly(?:methyl)?acrylate[s]?|acrylate (?:co|cross)polymer)\b`
* **Carbomer:** exactly `carbomer` (allow plural/number).
  *Regex:* `\bcarbomer(s)?\b`
* **VP/VA (vinylpyrrolidone copolymers):** `vp/va copolymer`, `vp/eicosene copolymer`, `vp/dmaema copolymer`.
  *Regex:* `\bvp\/(?:va|eicosene|dm[a-z]+|hexadecene) copolymer\b`
* **Polyquats:** `polyquaternium-<number>`, possibly `quaternium-<number>` if INCI legacy is present.
  *Regex:* `\bpolyquaternium-\d+\b|\bquaternium-\d+\b`

**Mineral UV filters:**

* Match tokens equal to **`zinc oxide`** or **`titanium dioxide`** (case-insensitive). Allow variants like `CI 77947 (Zinc Oxide)`—strip parentheses; recognize `CI 77891` (TiO₂) cautiously: count **only** when name includes “titanium dioxide” OR `CI 77891` **and** a UV filter context (step labeled sunscreen or UV filters present) to avoid counting pigments in makeup.

**Organic UV filters (for sunscreen detection only):** includes `avobenzone`, `octocrylene`, `homosalate`, `octisalate` (ethylhexyl salicylate), `octinoxate` (ethylhexyl methoxycinnamate), `bemotrizinol` (tinosorb s), `bisoctrizole` (tinosorb m), `drometrizole trisiloxane`, `polysilicone-15`, `isododecane` is not UV but often in primers (don’t treat as UV).

Keep these dictionaries configurable (JSON files) for updates without code change.

---

## E) Detection Heuristics (disambiguation rules)

1. **Order significance:** By default, assume provided INCI order reflects concentration order (**`strict_inci_order=true`**). If false, treat “top‑5” checks as “present” only (never trigger mineral top‑5).
2. **Unique film‑former groups:** Deduplicate groups across all steps; **max 3 groups** count (cap +6).
3. **Mineral top‑5:** Trigger if **any step** has **ZnO** or **TiO₂** at **index 0–4** (0‑based) after normalization. Apply **once** per routine.
4. **Sunscreen step identification:**

   * Prefer `step == "sunscreen"` (case‑insensitive).
   * Else, if a step contains **≥1 UV filter** from the dictionary, treat it as a sunscreen step.
5. **Silicone‑heavy sunscreen:** true if the sunscreen step has **either**:

   * Any **silicone** in its **top‑10**, **or**
   * **≥2 distinct silicone tokens** anywhere in its INCI.
6. **Primer detection for advice:** We already get `uses_silicone_primer` as a boolean; no INCI needed.
7. **One‑step routines:** Run rules normally; expect lower scores unless film‑formers + minerals raise it.

---

## F) Edge Cases & Validation (strict)

* **Step count mismatch:** If `layering.num_steps !== inci_per_step.length` ⇒ **400** with `MISMATCH_WITH_STEPS` (see error sample).
* **Empty or blank INCI:** Reject with `EMPTY_INCI` unless the product is explicitly skipped (not supported in v1).
* **Very long INCI:** Truncate at 200 tokens per step (log warning) or return **413** if `maxLength` violated.
* **Duplicate steps:** Allowed (e.g., two serums).
* **Unknown language or non‑Latin INCI:** Normalize best‑effort; if parsing fails, treat as “unknown”, proceed without ingredient factors, and include explain warning.
* **Pigment‑only TiO₂ (makeup):** If step name contains `foundation`/`bb` and no other UV filters, don’t count `CI 77891` as TiO₂ UV unless string “titanium dioxide” present.

---

## G) Governance & Versioning

* **Version field:** Implement internal `model_version` (e.g., `"v1.0.0"`) emitted only when `return_explain=true`.
* **Change types:**

  * **Patch:** Regex/lexicon tweaks that don’t alter scores for reference test set.
  * **Minor:** Score changes but bucket thresholds unchanged; bump to `v1.x`.
  * **Major:** Scoring or thresholds change; bump to `v2.0`.
* **Deprecation:** Maintain previous minor versions for ≥90 days with switchable `?model=v1.1`.

---

## H) Hard Limits & Performance

* **SLO:** p95 latency ≤ **120 ms** at 1 KB payload; p99 ≤ **250 ms**.
* **Throughput target:** 100 RPS sustained, burst 200 RPS.
* **Payload limits:** 64 KB request body.
* **Availability:** 99.9% monthly.

---

## I) Internationalization (i18n) & Localization (l10n)

* Localize **`bucket`**, **`contributors`**, **`tips`** strings via key map.
* Keep ingredient parsing locale‑agnostic (English INCI expected).
* Default locale `en`; unsupported locale falls back to `en`.

---

## J) JSON Examples

### Example – High risk

**Request** (from prompt):

```json
{
  "inci_per_step": [
    {"step":"serum","inci":"Water, Dimethicone, VP/VA Copolymer, Glycerin"},
    {"step":"moisturizer","inci":"Water, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Carbomer"},
    {"step":"sunscreen","inci":"Water, Zinc Oxide, Cyclopentasiloxane, Trimethylsiloxysilicate"}
  ],
  "layering": {"num_steps":3, "wait_seconds_between_steps":30, "uses_silicone_primer": true, "rubs_in_vigorously": true}
}
```

**Response**

```json
{
  "score": 13,
  "bucket": "high",
  "contributors": [
    "multiple film-formers",
    "mineral UV filters top-5",
    "short wait times",
    "silicone primer + silicone sunscreen",
    "vigorous rubbing"
  ],
  "tips": [
    "Wait 60–90s between steps",
    "Pat on sunscreen",
    "Consider lighter moisturizer",
    "Reduce number of layers"
  ]
}
```

> Note: Score here = film-formers +6 (3 groups), mineral +2, short waits +2, silicone stack +2, rubbing +1 → 13.

### Example – Low risk

```json
{
  "inci_per_step":[
    {"step":"moisturizer","inci":"Water, Glycerin, Squalane"},
    {"step":"sunscreen","inci":"Water, Homosalate, Octocrylene, Butyloctyl Salicylate"}
  ],
  "layering":{"num_steps":2,"wait_seconds_between_steps":120,"uses_silicone_primer":false,"rubs_in_vigorously":false}
}
```

```json
{
  "score": 0,
  "bucket": "low",
  "contributors": [],
  "tips": []
}
```

---

## K) Key Algorithms (pseudocode)

```text
parse_all_steps():
  steps = []
  for item in inci_per_step:
    tokens = normalize_and_tokenize(item.inci)  // ordered list
    steps.append({name: lc(item.step), tokens})

detect_groups(steps):
  present = set()
  for s in steps:
    if any(token matches SILICONE_REGEX): present.add("silicones")
    if any(token matches ACRYLATES_REGEX but not carbomer): present.add("acrylates")
    if any(token matches CARBOMER_REGEX): present.add("carbomer")
    if any(token matches VP_VA_REGEX): present.add("vp/va")
    if any(token matches POLYQUAT_REGEX): present.add("polyquats")
  film_points = min(3, len(present)) * 2  // cap +6
  return film_points, present

has_mineral_top5(steps):
  for s in steps:
    top5 = s.tokens[0:5]
    if contains "zinc oxide" or "titanium dioxide" (see §D):
      return true
  return false

identify_sunscreen_step(steps):
  for s in steps:
    if s.name == "sunscreen": return s
  for s in steps:
    if any token in UV_FILTERS: return s
  return null

is_silicone_heavy(sunscreen_step):
  if not sunscreen_step: return false
  top10 = sunscreen_step.tokens[0:10]
  if any token in top10 matches SILICONE_REGEX: return true
  if count distinct silicone tokens in sunscreen_step.tokens >= 2: return true
  return false

compute_score():
  score = 0; contributors = []

  film_points, groups = detect_groups(steps)
  if film_points > 0: score += film_points; contributors.add("multiple film-formers")

  if has_mineral_top5(steps): score += 2; contributors.add("mineral UV filters top-5")

  if layering.num_steps >= 5: score += 2; contributors.add("many layers (≥5)")

  if layering.wait_seconds_between_steps < 60: score += 2; contributors.add("short wait times")

  if layering.uses_silicone_primer && is_silicone_heavy(sunscreen):
     score += 2; contributors.add("silicone primer + silicone sunscreen")

  if layering.rubs_in_vigorously:
     score += 1; contributors.add("vigorous rubbing")

  bucket = "low" if score <= 3 else "moderate" if score <= 7 else "high"
  tips = build_tips(contributors, groups, steps, layering)

  return score, bucket, contributors, tips
```

---

## L) Logging & Explainability

* **Structured logs** per request: request ID, model version, factors applied, contributors, matched tokens, runtime, warnings.
* **PII policy:** Do not log raw INCI by default; log **hashes** of tokens and counts. Include raw only when `X-Debug-Mode: true` and user has engineer role.
* **Explain block** (`return_explain`) provides transparent factorization to the caller.

---

## M) Mitigation Tips Mapping (data‑driven rules)

Generate tips based on triggered contributors:

| Contributor / Condition                             | Tip (localized)                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------------ |
| `short wait times`                                  | “Wait 60–90s between steps”                                                    |
| `silicone primer + silicone sunscreen`              | “Use either primer or a lighter, non‑silicone sunscreen”                       |
| `multiple film-formers` with `silicones`            | “Swap one silicone‑heavy step for a lighter emulsion”                          |
| `multiple film-formers` with `acrylates`/`carbomer` | “Reduce polymer gel layers or thin with hydrating mist”                        |
| `mineral UV filters top-5`                          | “Pat on sunscreen; avoid vigorous rubbing; apply over fully dried moisturizer” |
| `many layers (≥5)`                                  | “Reduce number of layers or combine steps; apply thin to thick”                |
| `vigorous rubbing`                                  | “Pat final layers instead of rubbing”                                          |

Deduplicate tips and limit to **max 5**.

---

## N) Non‑Functional Requirements (summary)

* **Security:** §P.
* **Reliability:** No single point of failure; graceful degradation.
* **Maintainability:** Dictionaries externalized; unit test coverage ≥90% on parser and scoring; complexity manageable.
* **Portability:** Stateless service; containerized.
* **Usability:** Clear, actionable tips; optional explain block.

---

## O) Observability & Metrics

* **Counters:** requests_total{status}, errors_total{code}, model_version.
* **Histograms:** latency_ms, parsing_tokens_count.
* **Gauges:** dictionary_version.
* **Tracing:** Trace spans: parse, detect_groups, mineral_top5, sunscreen_id, silicone_heavy, score.
* **Dashboards & alerts:** p95>120ms (5m), error_rate>1% (5m).

---

## P) Privacy, Security & Compliance

* **Auth:**

  * Public sandbox: no auth but strict rate limits.
  * Production: OAuth2/JWT (Bearer) or session cookie with CSRF for browser.
* **Data minimization:** Do not store request bodies by default. If analytics is enabled, store **only** de‑identified features (counts, flags).
* **Transport:** HTTPS only, HSTS.
* **Compliance:** GDPR/CCPA ready; expose `X-Request-ID`; allow deletion of debug logs.

---

## Q) Quality Gates & Testing Strategy

* **Static checks:** JSON schema validation; unit tests for regex and tokenization; property‑based tests on random commas/spacing.
* **Deterministic Golden Set:** Maintain ~100 curated routines with expected outputs; changes require review.
* **Fuzzing:** Inject unicode, parentheses, extra spaces, casing variants.
* **CI:** Block merges if coverage < 90% for parser + ≥80% overall, or if golden set diff is not approved.
* **Contract tests:** Ensure 400 on mismatch counts; ensure caps applied at +6; ensure bucket transitions at 4 and 8.

---

## R) Rate Limiting & Quotas

* **Anonymous:** 30 req/min/IP, burst 60.
* **Authenticated:** 300 req/min/token, burst 600.
* **Abuse protection:** exponential backoff with `Retry-After`.

---

## S) Service Interface & Deployment

* **HTTP Status Codes:**

  * 200 OK (success)
  * 400 Bad Request (schema/semantic errors)
  * 413 Payload Too Large
  * 429 Too Many Requests
  * 500/503 on server/maintenance
* **Headers:**

  * `X-Request-ID` (echo), `X-Model-Version`, `Content-Language` (bucket/tips locale).
* **Deployment:** Container image, 2+ replicas, rolling update, readiness/liveness probes.
* **Timeouts:** Server 2s; client recommended 3s.

---

## T) Telemetry & Audit

* **Audit events (admin only):** dictionary edit, model version change, config toggles.
* **Retention:** 14 days default for metrics/logs; debug logs 7 days.

---

## U) UI/UX Requirements (if a web tool is provided)

* **Inputs:**

  * A per‑step dynamic list with `step` (dropdown with common values + free text) and `inci` (multiline).
  * Layering behavior controls (steps count auto‑derived with editable override + wait seconds slider + toggles).
* **Realtime validation:** show mismatch warnings; show token counts per step.
* **Output panel:**

  * Badge for **Bucket** (Low/Moderate/High), numeric **Score**, chips for **Contributors**, and a **Tips** list.
  * “Show details” to reveal `explain` with exact matched tokens and step diagnostics.
* **Accessibility:** WCAG 2.1 AA; keyboard navigable; ARIA labels.
* **Copy/export:** “Copy JSON”, “Export as TXT/CSV”.

---

## V) Validation Rules (detailed list)

1. `inci_per_step.length ≥ 1` else 400 `NO_STEPS`.
2. Each `step` non‑empty; `inci` non‑empty.
3. No HTML allowed in `inci`; strip tags if present; if any `<script>` found ⇒ 400 `INVALID_CONTENT`.
4. `layering.num_steps` must equal `inci_per_step.length` (unless a future `auto_count=true` flag exists; not in v1).
5. `wait_seconds_between_steps` integer 0–1800; negative rejected.
6. Strings trimmed; collapse repeated commas; ignore trailing commas.
7. If all parsing fails across all steps ⇒ still return 200 with **score based on behavior only**, and `contributors` reflecting behavior; add explain warning `"INGREDIENT_PARSE_FAILED"`.

---

## W) Workflow (high‑level)

1. **Validate** JSON schema → **Semantic checks** (mismatch counts, sizes) → **Parse & normalize** INCI.
2. **Detect** film‑former groups, mineral top‑5, identify sunscreen, silicone‑heavy flag.
3. **Apply** behavior rules → **Sum** score → **Map** to bucket.
4. **Assemble** contributors → **Generate** tips → **(Optional)** explain.
5. **Respond** + log metrics and trace spans.

---

## X) eXamples for Tricky Cases (acceptance tests)

* **Acrylates vs. Carbomer:**

  * INCI: “… Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Carbomer …”
    Film‑former groups detected: `acrylates` + `carbomer` = 2 groups ⇒ +4 (respect cap).
* **Polyquats in hair product included in routine:**

  * INCI: “… Polyquaternium‑7 …” in one step ⇒ +2 counts in groups.
* **TiO₂ as pigment only:**

  * Step “foundation”, INCI: “Mica, CI 77891, Iron Oxides …” and **no UV filters** in any step ⇒ **do not** trigger mineral top‑5.
* **Silicone‑heavy sunscreen heuristic:**

  * Sunscreen top‑10 contains “Cyclopentasiloxane” ⇒ silicone‑heavy = true.
  * OR sunscreen contains “Dimethicone” and “Silica” (note: Silica is **not** silicone) — only counts if two **silicone** tokens present.
* **Short waits only:**

  * Behavior only makes score 2; bucket stays low.

---

## Y) Yields & Output Semantics

* **`score`**: integer, 0..15 typical.
* **`bucket`**: string enum {`low`,`moderate`,`high`} localized before returning.
* **`contributors`**: array of short phrases; order by importance (ingredient factors first, then behavior).
* **`tips`**: max 5 actionable items deduplicated; ordered by estimated impact (wait time, silicone stack, film‑former swap, patting, layer count).

---

## Z) Zero‑Downtime & Rollout

* **Blue/Green** or **Canary** deploy with 5% → 25% → 100% traffic.
* **Shadow testing:** Compare vNext vs. vCurrent on live traffic (read‑only) using golden set to ensure bucket drift < 5%.
* **Instant rollback:** Keep previous container image warm.
* **Config toggles:** Feature flag for `silicone_heavy_top10` threshold and dictionary version pin.

---

### Implementation Notes (quick start)

* **Language:** Any; keep regexes compiled.
* **Data:** Ship initial dictionaries under `/etc/pilling/lexicon.json`.
* **Thread safety:** All lookups read‑only; no global mutable state.
* **Time complexity:** O(total_tokens).
* **Space complexity:** O(total_tokens) for explain mode; O(1) otherwise.

---

### Done‑Definition / Acceptance Criteria

* Returns correct buckets & scores for all examples in §J and §X.
* Caps film‑former contribution at **+6**.
* Recognizes mineral top‑5 correctly with order significance.
* Detects silicone‑heavy sunscreen per §E.
* Emits localized messages for at least `en` (base) and one additional locale (e.g., `pl`).
* Meets SLOs in §H on reference hardware.
* Logs trace spans and counters in §O; error handling per §C.
