# Tool Specification — Interakcje Składników (Actives Interaction Checker)

> **Canonical decision:** Implement using the shared tooling platform in `docs/adr/ADR-022-tools-and-calculators-platform.md`.

Below is a complete **A–Z requirements** spec for the **Actives Interaction Checker** at
`/skin/narzedzia/interakcje-skladnikow/`.

---

## A) Aim & Audience

* **Aim:** Analyze a user’s routine (INCI list) and flag notable “avoid / caution / ok” ingredient combinations with clear, actionable guidance.
* **Primary users:** Consumers and skincare professionals checking compatibility of products/actives.
* **Scope:** Static rules (provided below) evaluated on tokens tagged from INCI strings, with optional context flags (e.g., pregnancy). Not a medical device.

---

## B) Business Rules (Authoritative)

Evaluate rules in **severity order**: `hard_avoid` → `caution` → `ok`. Higher severity wins when conflicts arise.

### HARD_AVOID

1. **BPO + Ascorbic Acid (L‑AA only)**

   * Trigger: `bpo ∧ ascorbic_acid` (exclude `vitc_derivative`)
   * Why: Risk of L‑ascorbic acid degradation/oxidation.
   * Action: Do not use together; separate times/days or choose alternative forms.

2. **Hydroquinone + BPO**

   * Trigger: `hydroquinone ∧ bpo`
   * Why: Staining / discoloration risk on skin, fabrics, and surfaces.
   * Action: Avoid in the same routine; separate strictly or pick alternatives.

3. **Tazarotene with Pregnancy Context**

   * Trigger: `tazarotene ∧ context.pregnancy = true`
   * Why: Prescription retinoid contraindication during pregnancy.
   * Action: Do not use; consult clinician. (Informational hard-avoid.)

### CAUTION / SEPARATE

4. **Retinoid + AHA**

   * Trigger: `retinoid ∧ aha`
   * Why: Higher irritation risk.
   * Action: Alternate nights or separate AM/PM.

5. **Retinoid + BHA**

   * Trigger: `retinoid ∧ bha`
   * Why: Higher irritation risk.
   * Action: Alternate nights or separate AM/PM.

6. **Ascorbic Acid (L‑AA) + AHA|BHA**

   * Trigger: `ascorbic_acid ∧ (aha ∨ bha)`
   * Why: Potential irritation; low pH stacking.
   * Action: Separate if sensitive; consider AM vitamin C and PM acids.

7. **Retinoid + BPO**

   * Trigger: `retinoid ∧ bpo`
   * Why: Efficacy reduction and irritation risks; **adapalene** tends to be more compatible than **tretinoin**.
   * Action: Prefer different times; if `retinoid=subtype:adapalene` lower copy intensity but still flag as caution.

8. **Copper Peptide + Ascorbic Acid (Low pH)**

   * Trigger: `copper_peptide ∧ ascorbic_acid` (exclude derivatives; assume low pH typical for L‑AA unless product metadata overrides)
   * Why: Potential instability/interaction.
   * Action: Separate applications (AM/PM or alternate nights).

### OK / COMMONLY FINE

9. **Niacinamide + Ascorbic Acid**

   * Trigger: `niacinamide ∧ (ascorbic_acid ∨ vitc_derivative)`
   * Why: Acceptable in modern formulations.
   * Action: No change; optional note that transient tint/odor can occur in some mixes.

10. **Azelaic Acid + (Retinoid ∨ AHA ∨ BHA)**

* Trigger: `azelaic_acid ∧ (retinoid ∨ aha ∨ bha)`
* Why: Often compatible; cumulative irritation possible.
* Action: Generally okay; advise not to stack multiple strong actives same night if sensitive.

---

## C) Context & Assumptions

* **Context flags** accepted: `pregnancy: boolean`, `sensitive_skin: boolean` (optional), `known_retinoid_subtype: enum`.
* If no context is provided, default to `pregnancy=false`, `sensitive_skin=unknown`.
* Tool does **not** infer product pH unless provided; assume typical L‑ascorbic acid is low pH.

---

## D) Data Model

### Canonical Ingredient Tokens (subset shown)

* **bpo:** benzoyl peroxide
* **ascorbic_acid:** L‑ascorbic acid
* **vitc_derivative:** sodium ascorbyl phosphate, magnesium ascorbyl phosphate, ascorbyl glucoside, 3‑O‑ethyl ascorbic acid, tetrahexyldecyl ascorbate (ATIP/THD), ascorbyl tetraisopalmitate, ascorbyl palmitate, ascorbyl phosphate (generic)
* **retinoid:** tretinoin, isotretinoin (topical), adapalene, tazarotene, retinol, retinal/retinaldehyde, retinyl palmitate/acetate/propionate, hydroxypinacolone retinoate (HPR)
* **aha:** glycolic acid, lactic acid, mandelic acid, tartaric acid, malic acid, citric acid (treat as AHA for compatibility UX), [PHA excluded from AHA unless tagged separately]
* **bha:** salicylic acid, betaine salicylate, capryloyl salicylic acid (LHA)
* **copper_peptide:** copper tripeptide‑1 (GHK‑Cu), copper lysinate/prolinate (if peptide-bound), copper peptide (generic)
* **niacinamide:** niacinamide (nicotinamide)
* **azelaic_acid:** azelaic acid
* **hydroquinone:** hydroquinone
* **tazarotene:** tazarotene (also tagged as retinoid with subtype)

### Tag Structure

```json
{
  "tokens": ["retinol","glycolic acid","benzoyl peroxide", "..."],
  "tags": [
    {"token":"benzoyl peroxide","canonical":"bpo","groups":["bpo"]},
    {"token":"retinol","canonical":"retinol","groups":["retinoid"],"subtype":"retinol"},
    {"token":"3-O-ethyl ascorbic acid","canonical":"3-o-ethyl ascorbic acid","groups":["vitc_derivative"]}
  ]
}
```

---

## E) Error Handling & Messages

* **Input parsing error** (malformed JSON): `400` with `"code":"bad_request"`.
* **Too long** (>5,000 chars or >300 tokens): `413` with `"code":"input_too_large"`.
* **Unsupported characters**: best‑effort sanitize; if completely unparseable, return `"code":"unable_to_parse_inci"`.
* **Short INCI note**: if `< 3 parsed tokens`, append `"notes":["Short INCI; interaction check may miss context."]`.
* Unknown items are returned under `unmatched_tokens`.

---

## F) Functional Requirements (End-to-End)

1. Accept input JSON with `inci_list` (comma‑separated string) and optional `context`.
2. Normalize and tokenize INCI (see H).
3. Map tokens to canonical forms and groups (see D, I).
4. Evaluate **solo** and **pairwise** rules in severity order.
5. Build `flags` array with `severity`, `pair` (or `solo`), `why`, `action`, and optional `details` (e.g., `"retinoid_subtype":"adapalene"`).
6. Deduplicate flags; when overlapping, **keep highest severity** per pair.
7. Return JSON with `flags`, `unmatched_tokens`, and `notes`.
8. Support i18n labels for severity and actions.
9. Provide deterministic output for the same input and rules version.
10. Render UI: input box, result list grouped by severity, inline explanations, and export/share.

---

## G) Governance of Rules

* Rules are stored in a versioned registry (e.g., JSON/YAML in repo or DB) with:

  * `id`, `version`, `severity`, `logic`, `why`, `action`, `locale_copy`
* Changes require code review and semantic version bump:

  * **MAJOR**: breaking categories/semantics
  * **MINOR**: new rules or expanded synonyms
  * **PATCH**: copy edits

---

## H) Normalization & Tokenization

* Lowercase; trim whitespace.
* Normalize diacritics (NFKD) and punctuation: keep letters, digits, spaces, hyphens; collapse multiple spaces.
* Split on commas **and** semicolons (robust to label styles).
* Remove parenthetical marketing phrases (keep inside if they contain recognized INCI).

  * e.g., `retinol (vitamin A)` → `retinol, vitamin a`
* Collapse duplicates after canonicalization.
* Ignore “base” non-actives (e.g., `aqua/water`, `parfum/fragrance`, common solvents/emollients) unless explicitly part of a rule (none are).

---

## I) Ingredient Dictionary & Synonyms

* Maintain a canonical **dictionary** with:

  * `display_name`, `canonical_key`, `synonyms` (INCI variants), `groups`, `subtype?`
* Examples:

  * `benzoyl peroxide` → `bpo`
  * `L-ascorbic acid`, `ascorbic acid` → `ascorbic_acid`
  * `sodium ascorbyl phosphate`, `magnesium ascorbyl phosphate`, `ascorbyl glucoside`, `3-o-ethyl ascorbic acid`, `tetrahexyldecyl ascorbate` → group `vitc_derivative`
  * `capryloyl salicylic acid` → group `bha`
  * `hydroxypinacolone retinoate` → `retinoid` with `subtype:hpr`
  * `retinal`/`retinaldehyde` → `retinoid` `subtype:retinal`

---

## J) API Contract

### Endpoint

* **POST** `/api/actives-interaction-checker`

  * Mirror on page `/skin/narzedzia/interakcje-skladnikow/` via client call.

### Request

```json
{
  "inci_list": "aqua, ascorbic acid, benzoyl peroxide, glycolic acid",
  "context": {
    "pregnancy": false,
    "sensitive_skin": true,
    "retinoid_subtype": "tretinoin" // optional hint if known
  },
  "locale": "pl-PL" // optional, default "en-US"
}
```

### Response

```json
{
  "flags": [
    {
      "severity":"hard_avoid",
      "pair":["bpo","ascorbic acid"],
      "why":"Vitamin C (L‑AA) may be deactivated/oxidized",
      "action":"Use at different times/days or choose a derivative",
      "rule_id":"R-BPO-LAA-01",
      "version":"2025.10.23"
    },
    {
      "severity":"caution",
      "pair":["retinoid","aha"],
      "why":"Higher irritation potential when stacked",
      "action":"Alternate nights",
      "rule_id":"R-RET-AHA-01",
      "version":"2025.10.23",
      "details":{"retinoid_subtype":"tretinoin"}
    }
  ],
  "unmatched_tokens": ["brand-proprietary-complex"],
  "notes": []
}
```

### Errors

```json
{"error":{"code":"bad_request","message":"Field 'inci_list' required"}}
```

---

## K) Privacy & Data Retention

* Do not store raw INCI by default.
* Aggregate, anonymized metrics allowed (counts, severity distribution).
* If logging is enabled for debugging, mask or hash tokens and purge within 30 days.

---

## L) Localization (i18n)

* Default: English; provide Polish (`pl‑PL`) given route context.
* Localize severity labels, action verbs, notes:

  * `hard_avoid` → **Unikaj**
  * `caution` → **Ostrożnie**
  * `ok` → **OK**
  * Example action (PL): “Stosuj naprzemiennie wieczorami.”
* All rule copy stored per-locale in the rule registry.

---

## M) Monitoring & Metrics

* Track: requests/min, avg latency, error rate, unmatched token rate, flags per severity, top triggered rules.
* Alerting thresholds (e.g., 5xx > 1% for 5 minutes).

---

## N) Non‑Functional Requirements

* **Performance:** p95 latency ≤ 120 ms server-side for ≤ 100 tokens; O(n) tagging; O(k) rule checks (k≪n² by targeting categories).
* **Scalability:** Handle bursts of 50 RPS.
* **Reliability:** 99.9% uptime target; graceful degradation (show partial results if some tags fail).
* **Compatibility:** Modern evergreen browsers; Node 18+/Python 3.11 backend friendly.
* **Maintainability:** Rules decoupled in registry; unit tests must cover ≥ 90% of rule logic.
* **Security:** Input sanitization; rate limit (per IP); CORS limited to site origins.
* **Accessibility:** WCAG 2.2 AA (see O).

---

## O) Accessibility & UX

* Keyboard navigable; focus states; ARIA roles for results list.
* Clear color contrasts; avoid color-only severity cues (add icons/text).
* Provide **Explain** toggles for each flag with “why” and “what to do”.

---

## P) Platform & Architecture

* Stateless API service with:

  * **Normalizer** → **Tagger** → **Rules Engine** → **Formatter**
* Rules engine reads **immutable** in-memory structure refreshed on deploy.
* Optional server-side rendering for SEO (static landing with client-side call).

---

## Q) Quality Assurance & Testing

* **Unit tests**: tokenizer, synonym mapping, rule triggers, precedence, i18n fallbacks.
* **Property-based tests**: random punctuation/casing.
* **Golden cases** (see X).
* **Regression suite**: every rule id must have at least 3 positive and 3 negative fixtures.
* **A11y tests**: axe-core snapshots for the results panel.
* **Performance tests**: large INCI lists (200+ tokens).

---

## R) Rules Engine Design (Authoring DSL)

* Example YAML:

```yaml
- id: R-BPO-LAA-01
  version: 2025.10.23
  severity: hard_avoid
  trigger: "has('bpo') && has('ascorbic_acid') && !has('vitc_derivative')"
  why:
    en-US: "Vitamin C (L‑AA) may be deactivated/oxidized"
    pl-PL: "Witamina C (L‑AA) może ulec dezaktywacji/utlenieniu"
  action:
    en-US: "Use at different times/days or choose a derivative"
    pl-PL: "Stosuj o różnych porach/dniach lub wybierz pochodną"
```

* Supported ops: `has()`, `hasGroup()`, `subtype()`, boolean operators, `context('key')`.

---

## S) Security

* Validate JSON schema; reject unknown top-level fields (strict mode).
* Neutralize HTML in tokens before rendering (XSS).
* Rate limiting (e.g., 100 req/5 min/IP).
* No PII collection. HTTPS required.

---

## T) Telemetry & Explainability

* Include `rule_id` and `version` in each flag.
* Optional **“copy to clinician”** summary text (no brand names).
* Provide a “confidence_hint” (low/medium) when triggers rely on assumptions (e.g., low pH vitamin C).

---

## U) UI/UX Requirements

* **Input:** Large textarea for INCI or pasted label; example placeholder.
* **Controls:** Locale selector, “Pregnancy” toggle, optional “Sensitive skin” toggle.
* **Results:** Group by severity with sticky headings; show counts; allow expand for “why/action”.
* **Chips:** Render matched actives as chips (hover shows canonical mapping).
* **Export:** Copy as text/JSON; print view.
* **Empty state:** Guidance text and examples.
* **Note surface:** Show the “Short INCI” note prominently when applicable.

---

## V) Versioning & Change Management

* Return `version` at top level and per rule.
* `/api/actives-interaction-checker?rules_version=2025.10.23` (optional pin).
* Changelog page for transparency.

---

## W) Workflow (Content & Engineering)

* **Content editors** propose rule text/synonyms via PR.
* **Maintainers** validate chemistry/category accuracy.
* **CI** validates YAML schema and runs rule tests before merge.
* **Release**: tagged; CDN cache busting via versioned hash.

---

## X) eXamples & Golden Test Cases

### 1) Hard Avoid (BPO + L‑AA)

**Input:** `aqua, ascorbic acid, benzoyl peroxide`
**Flags:**

* `hard_avoid` pair `["bpo","ascorbic acid"]`

### 2) Derivative Exemption

**Input:** `sodium ascorbyl phosphate, benzoyl peroxide`
**Flags:**

* **No** hard-avoid for BPO + L‑AA; (no vitamin C hard rule)
* `unmatched_tokens`: `[]`

### 3) Hydroquinone + BPO

**Input:** `hydroquinone, benzoyl peroxide, glycerin`
**Flags:**

* `hard_avoid` `["hydroquinone","bpo"]`

### 4) Retinoid + Acids

**Input:** `retinol, glycolic acid`
**Flags:**

* `caution` `["retinoid","aha"]` with action “Alternate nights”

### 5) Retinoid + BPO (Adapalene nuance)

**Input:** `adapalene, benzoyl peroxide`
**Flags:**

* `caution` `["retinoid","bpo"]`, `details.retinoid_subtype="adapalene"`

### 6) Copper Peptide + Vitamin C

**Input:** `copper tripeptide-1, ascorbic acid`
**Flags:**

* `caution` `["copper_peptide","ascorbic acid"]` (assumed low pH L‑AA)

### 7) OK Combos

**Input:** `niacinamide, ascorbic acid, azelaic acid, salicylic acid`
**Flags:**

* `ok` `["niacinamide","ascorbic acid"]`
* `ok` `["azelaic acid","bha"]`
* Possible note for cumulative irritation (if `sensitive_skin=true`, add advisory in `notes`)

### 8) Pregnancy Solo Rule

**Input:** `tazarotene, caprylic/capric triglyceride`; `context.pregnancy=true`
**Flags:**

* `hard_avoid` solo `"tazarotene"`

### 9) Short INCI

**Input:** `retinol`
**Notes:** `["Short INCI; interaction check may miss context."]`

---

## Y) Yardsticks (Success Criteria)

* ≥ 95% precision on rule triggers across curated validation set.
* p95 latency ≤ 120 ms for 100-token inputs.
* Accessibility audits pass WCAG 2.2 AA.
* < 5% unmatched rate for top-200 common INCI lists (after 3 months).

---

## Z) Constraints & Limitations (Transparent)

* Does not assess **strength, pH, occlusion, leave‑on vs rinse‑off**, or **formulation buffers**—context may alter real-world tolerance.
* Not medical advice; pregnancy flag is informational and conservative.
* “OK” means commonly fine; individual tolerance varies.
* Copper peptide interactions are partly formulation-dependent; flagged as caution with “confidence_hint":"low".

---

### Algorithmic Pseudocode (Reference)

```pseudo
function checkInteractions(inci_list, context={}, locale="en-US"):
  tokens = normalize_inci(inci_list)
  if count(tokens) < 3:
    notes.add("Short INCI; interaction check may miss context.")
  tags = tag_ingredients(tokens)  // dictionary lookups + groups

  present = set of canonical keys and groups from tags
  results = []

  // HARD_AVOID
  if has(present,'bpo') and has(present,'ascorbic_acid') and !has(present,'vitc_derivative'):
     addFlag('hard_avoid', ['bpo','ascorbic acid'], R-BPO-LAA-01)

  if has(present,'hydroquinone') and has(present,'bpo'):
     addFlag('hard_avoid', ['hydroquinone','bpo'], R-HQ-BPO-01)

  if context.pregnancy == true and has(present,'tazarotene'):
     addFlag('hard_avoid', ['tazarotene'], R-TAZ-PREG-01, solo=true)

  // CAUTION
  if hasGroup(present,'retinoid') and hasGroup(present,'aha'):
     addFlag('caution', ['retinoid','aha'], R-RET-AHA-01)

  if hasGroup(present,'retinoid') and hasGroup(present,'bha'):
     addFlag('caution', ['retinoid','bha'], R-RET-BHA-01)

  if has(present,'ascorbic_acid') and (hasGroup(present,'aha') or hasGroup(present,'bha')):
     addFlag('caution', ['ascorbic acid','aha|bha'], R-LAA-ACIDS-01)

  if hasGroup(present,'retinoid') and has(present,'bpo'):
     details = {}
     if subtype(present,'adapalene'): details.retinoid_subtype = 'adapalene'
     addFlag('caution', ['retinoid','bpo'], R-RET-BPO-01, details)

  if hasGroup(present,'copper_peptide') and has(present,'ascorbic_acid'):
     addFlag('caution', ['copper_peptide','ascorbic acid'], R-CU-LAA-01)

  // OK
  if has(present,'niacinamide') and (has(present,'ascorbic_acid') or hasGroup(present,'vitc_derivative')):
     addFlag('ok', ['niacinamide','ascorbic acid'], R-NIA-VITC-01)

  if has(present,'azelaic_acid') and (hasGroup(present,'retinoid') or hasGroup(present,'aha') or hasGroup(present,'bha')):
     addFlag('ok', ['azelaic acid','retinoid|aha|bha'], R-AZA-OTHERS-01)

  // Deduplicate and keep highest severity per pair
  results = dedupeMaxSeverity(results)

  return {
    flags: localize(results, locale),
    unmatched_tokens: getUnmatched(tokens, tags),
    notes: notes
  }
```

---

### Acceptance Criteria Summary

* **GIVEN** a list with `ascorbic acid` and `benzoyl peroxide`
  **WHEN** I submit
  **THEN** I receive exactly one `hard_avoid` flag for that pair and no `ok` overrides.

* **GIVEN** a list with `sodium ascorbyl phosphate` and `benzoyl peroxide`
  **THEN** no `hard_avoid` BPO+L‑AA rule fires.

* **GIVEN** `tazarotene` with `pregnancy=true`
  **THEN** a `hard_avoid` solo flag appears.

* **GIVEN** only one recognized token
  **THEN** I see the short INCI note.
