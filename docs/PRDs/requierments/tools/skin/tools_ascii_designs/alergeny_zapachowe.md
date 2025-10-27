# Tool Specification — Alergeny Zapachowe (Fragrance Allergen Checker)

> **Canonical decision:** Implement using the shared tooling platform in `docs/adr/ADR-022-tools-and-calculators-platform.md`.

Below is an end‑to‑end (A → Z) specification you can hand to engineering to implement **/skin/narzedzia/alergeny-zapachowe/** — *Fragrance Allergen Checker*. It covers functional + non‑functional requirements, data structures, API contracts, algorithmic details, i18n text, examples, test vectors, and acceptance criteria.

---

## A) **API contract**

**Endpoint:** `POST /skin/narzedzia/alergeny-zapachowe/scan`
**Purpose:** Parse an INCI string and highlight matches from **ALLERGEN_SET_26**; add context notes and regulatory flags.

**Request (JSON)**

```json
{
  "inci_list": "Aqua, Parfum (Fragrance), Linalool, Hexyl Cinnamal",
  "mode": "strict",
  "lang": "auto",
  "include_debug": false
}
```

* `inci_list` *(required, string)*: Raw INCI/ingredients text as printed on label.
* `mode` *(optional, enum)*: `"strict"` (exact/alias/regex patterns only; default) or `"fuzzy"` (Levenshtein ≤1 on tokens ≥6 chars).
* `lang` *(optional, enum)*: `"auto"`, `"en"`, `"pl"`. Controls message texts, not matching.
* `include_debug` *(optional, bool)*: If true, returns normalization artifacts for QA.

**Response (200 OK)**

```json
{
  "dataset_id": "ALLERGEN_SET_26",
  "dataset_version": "1.0.0",
  "last_updated": "2025-01-01",
  "fragrance_present": true,
  "allergens_found": [
    {
      "name": "linalool",
      "alias_matched": "linalool",
      "status_eu": "allergen",
      "note": "Fragrance allergen; oxidation increases risk",
      "positions": [{"start": 31, "end": 39}]
    },
    {
      "name": "hexyl cinnamal",
      "alias_matched": "hexyl cinnamal",
      "status_eu": "allergen",
      "note": "Fragrance allergen",
      "positions": [{"start": 41, "end": 56}]
    }
  ],
  "no_hits": false,
  "advisories": [
    {
      "code": "PARFUM_NO_LISTED_ALLERGENS",
      "message": "Fragrance present; specific allergens not listed (may be below thresholds or undisclosed)."
    },
    {
      "code": "EU_THRESHOLD_DISCLAIMER",
      "message": "Labeling thresholds differ for leave‑on vs. rinse‑off products; allergens may be present below declaration thresholds."
    }
  ],
  "debug": {
    "normalized_inci": "aqua, parfum, linalool, hexyl cinnamal",
    "tokens": ["aqua","parfum","linalool","hexyl cinnamal"],
    "negations": [],
    "mode": "strict"
  }
}
```

**Error responses**

* `400` — invalid payload / missing `inci_list`
* `413` — payload too large
* `415` — unsupported content type
* `422` — unable to parse (after normalization)
* `429` — rate limited
* `500` — unexpected error

**Headers**

* Request: `Content-Type: application/json`, optional `Accept-Language: pl|en`
* Response: `Cache-Control: no-store`; optional `X-Allergen-Set: ALLERGEN_SET_26@1.0.0`

---

## B) **Business rules**

1. Case/diacritic/punctuation‑insensitive matching (managed by normalization).
2. Match against **canonical names + curated aliases + permissive regex patterns** (hyphens/spaces/Greek letters).
3. Mark **Lilial** (*butylphenyl methylpropional, BMHCA*) and **Lyral** (*hydroxyisohexyl 3‑cyclohexene carboxaldehyde, HICC*) as `"status_eu": "restricted/banned"` and add a legacy note.
4. If any of `parfum|fragrance|aroma|perfum|parfume` are present without any allergen hits → set `fragrance_present=true`, include advisory `PARFUM_NO_LISTED_ALLERGENS`.
5. Handle **negations** (“free from X”, “bez X”, “no X”, “without X”, “w/o X”) to avoid false positives.
6. De‑duplicate hits; preserve **first character offsets** for highlighting.
7. Always include the **threshold disclaimer** advisory.
8. If `mode="fuzzy"`, only consider fuzzy match when **no exact/alias/regex** has matched that token; never fuzzy‑match very short tokens (<6 chars).

---

## C) **Canonicalization & tokenization (normalize_inci)**

Pipeline (in order):

1. **Trim & collapse** whitespace; normalize separators (`, ; • · | /` → comma).
2. **Unicode normalize** (NFKC), **lowercase**, **strip diacritics** (e.g., `é`→`e`), normalize dashes (`–—−`→`-`).
3. **Greek letters** (`α`, `β`) → spelled out (`alpha`, `beta`).
4. **Parenthetical retention**: keep both the outer token and inner text as separate searchable slices (e.g., `parfum (linalool)` yields `parfum` and `linalool` tokens).
5. **Split tokens** on commas/semicolons/newlines and **also** scan the full normalized string with regex for multi‑word patterns that might span punctuation.
6. **Clean token edges**: strip surrounding parentheses/periods/percentages.
7. **Negation windowing**: mark tokens as negated when patterns like `free from|bez|without|no|w/o` occur within **3 tokens to the left** of a candidate match.
8. **Deduplicate** tokens (preserving first index for positions).
9. Output: `normalized_inci` (string), `tokens` (string list), `index_map` (token → list of char spans).

---

## D) **Data model (allergen entries)**

Each entry in the set:

```json
{
  "canonical": "butylphenyl methylpropional",
  "aliases": ["bmhca", "lilial", "p-tert-butyl-alpha-methylhydrocinnamaldehyde"],
  "regex": ["\\bbutyl\\s*phenyl\\s*methyl\\s*propional\\b", "\\blilial\\b", "\\bbmhca\\b"],
  "eu_status": "restricted/banned",
  "note_en": "Restricted/banned in EU context (legacy INCI may still appear on old labels).",
  "note_pl": "Ograniczony/zakazany w UE (starsze etykiety mogą zawierać nazwę)."
}
```

**Core fields**

* `canonical`: canonical INCI string
* `aliases`: lowercase aliases/acronyms/trade names
* `regex`: permissive regex allowing optional spaces/hyphens
* `eu_status`: `"allergen"` or `"restricted/banned"`
* `note_en` / `note_pl`: localized notes for output

---

## E) **Edge cases**

* **Parfum only**: Show fragrance advisory; `no_hits` should be **true** if there are zero allergen matches.
* **Parenthetical cues**: `Parfum (Limonene)` → detect both.
* **Typos** (fuzzy mode): e.g., `limonEEN` → limonene.
* **“Free from” claims**: `without linalool` → do **not** flag.
* **Mixed languages**: English/Polish/German words around INCI must not affect matching.
* **Very long INCI**: accept up to 10,000 chars; truncate with `413` beyond that.
* **Essential oils**: If only botanical oils listed (e.g., `citrus limon peel oil`) and no allergens explicitly named, return no allergen hits but keep fragrance advisory **only if** generic fragrance terms present.

---

## F) **Fuzzy matching**

* Levenshtein distance ≤ **1** for tokens length ≥ **6**.
* Disabled by default; enable via `mode="fuzzy"`.
* Fuzzy match **never** overrides a negation window.
* Record `alias_matched` as the **closest alias** and add `"match_type": "fuzzy"` in debug.

---

## G) **Governance & versioning**

* **Dataset ID**: `ALLERGEN_SET_26`
* **Version**: semantic (e.g., `1.0.0`)
* Include `dataset_id`, `dataset_version`, `last_updated` in every response.
* Add `/metadata` GET endpoint to return set contents, version, and change log (for internal QA/UIs).

---

## H) **HTTP & security**

* Only `POST` with `application/json`.
* CORS: allow GET/POST from configured origins (`*.domain.tld`).
* **Rate limit**: default 60 req/min/IP; burst 120.
* **No PII storage**. Logs redact payloads unless `include_debug=true` **and** environment is non‑prod.
* Input size guardrails and timeouts (see P below).

---

## I) **Internationalization (i18n)**

* Message texts available in **English** and **Polish**.
* Language resolution order: `lang` body param → `Accept-Language` → default `"en"`.
* Output `note` localized to chosen language.
* Standard advisories (codes) must be language‑agnostic; only `message` is localized.

**Key advisory messages**

* EN: *“Fragrance present; specific allergens not listed (may be below thresholds or undisclosed).”*
  PL: *„Wykryto kompozycję zapachową; konkretne alergeny nie zostały wyszczególnione (mogą być poniżej progów deklaracji lub nieujawnione).”*
* EN: *“Labeling thresholds differ for leave‑on vs. rinse‑off products; allergens may be present below declaration thresholds.”*
  PL: *„Progi znakowania różnią się dla produktów pozostających na skórze i spłukiwanych; alergeny mogą występować poniżej progów deklaracji.”*

---

## J) **JSON Schemas**

**Request schema (OpenAPI/JSON Schema 2020‑12)**

```json
{
  "type": "object",
  "required": ["inci_list"],
  "properties": {
    "inci_list": {"type": "string", "minLength": 1, "maxLength": 10000},
    "mode": {"type": "string", "enum": ["strict", "fuzzy"], "default": "strict"},
    "lang": {"type": "string", "enum": ["auto", "en", "pl"], "default": "auto"},
    "include_debug": {"type": "boolean", "default": false}
  },
  "additionalProperties": false
}
```

**Response schema (excerpt)**

```json
{
  "type": "object",
  "required": ["dataset_id","dataset_version","fragrance_present","allergens_found","no_hits","advisories"],
  "properties": {
    "dataset_id": {"type": "string"},
    "dataset_version": {"type": "string"},
    "last_updated": {"type": "string", "format": "date"},
    "fragrance_present": {"type": "boolean"},
    "allergens_found": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name","alias_matched","status_eu","note","positions"],
        "properties": {
          "name": {"type": "string"},
          "alias_matched": {"type": "string"},
          "status_eu": {"type": "string", "enum": ["allergen","restricted/banned"]},
          "note": {"type": "string"},
          "positions": {
            "type": "array",
            "items": {"type": "object","properties":{"start":{"type":"integer"},"end":{"type":"integer"}}}
          }
        }
      }
    },
    "no_hits": {"type": "boolean"},
    "advisories": {
      "type": "array",
      "items": {"type": "object","properties":{"code":{"type":"string"},"message":{"type":"string"}}}
    },
    "debug": {"type": "object"}
  }
}
```

---

## K) **Knowledge base: ALLERGEN_SET_26 (starter)**

> Canonical → aliases (lowercased) and permissive regex patterns (examples); `status_eu` = `"allergen"` unless noted.

* **linalool** → `["linalool"]`
* **limonene** → `["limonene","d-limonene","l-limonene"]`
* **citronellol** → `["citronellol"]`
* **geraniol** → `["geraniol"]`
* **eugenol** → `["eugenol"]`
* **isoeugenol** → `["isoeugenol"]`
* **cinnamal** → `["cinnamaldehyde","cinnamal"]`
* **cinnamyl alcohol** → `["cinnamyl alcohol"]`
* **benzyl alcohol** → `["benzyl alcohol"]`
* **benzyl benzoate** → `["benzyl benzoate"]`
* **benzyl salicylate** → `["benzyl salicylate"]`
* **coumarin** → `["coumarin"]`
* **hydroxycitronellal** → `["hydroxycitronellal"]`
* **alpha‑isomethyl ionone** → `["alpha isomethyl ionone","α‑isomethyl ionone","isomethyl ionone alpha"]`
* **amyl cinnamal** → `["amyl cinnamaldehyde"]`
* **amylcinnamyl alcohol** → `["amylcinnamyl alcohol"]`
* **anisyl alcohol** → `["anisyl alcohol"]`
* **citral** → `["citral","citral a","citral b","geranial","neral"]`
* **farnesol** → `["farnesol"]`
* **hexyl cinnamal** → `["hexyl cinnamaldehyde"]`
* **hydroxyisohexyl 3‑cyclohexene carboxaldehyde** *(HICC)* → `["hydroxyisohexyl 3-cyclohexene carboxaldehyde","hicc","lyral"]` → **status_eu: restricted/banned**
* **methyl 2‑octynoate** → `["methyl 2-octynoate","methyl heptine carbonate","mhc"]`
* **evernia prunastri extract (oakmoss)** → `["evernia prunastri","oakmoss","oak moss","oakmoss extract"]`
* **evernia furfuracea extract (treemoss)** → `["evernia furfuracea","treemoss","tree moss","treemoss extract"]`
* **butylphenyl methylpropional (Lilial)** → `["butylphenyl methylpropional","lilial","bmhca"]` → **status_eu: restricted/banned**
* **lyral** *(legacy name for HICC)* → mapped to HICC; still output with alias captured; flagged restricted/banned.

> For each, compile regex like `\\b(alpha\\s*-?\\s*isomethyl\\s*-?\\s*ionone)\\b` to allow spaces/hyphens.

---

## L) **Logging & observability**

* **Info**: request id, mode, language, token count, number of matches.
* **Warn**: payload size near limit; unknown encoding.
* **Error**: validation failures, timeouts.
* **No raw INCI in prod logs** unless feature flag `LOG_PAYLOADS=true` and environment ≠ prod.

---

## M) **Metrics**

* `checker.requests.total`, `checker.matches.count`, `checker.false_negation.avoided` (when negation prevents a match), `checker.mode.fuzzy_ratio`, latency p50/p95/p99, error codes count, average token length.

---

## N) **Non‑functional requirements**

* **Availability**: 99.9% monthly.
* **Latency**: p95 ≤ 60ms for 1k‑char inputs; ≤ 150ms for 10k‑char inputs.
* **Throughput**: ≥ 100 RPS sustained (single instance), horizontally scalable.
* **Scalability**: O(n) in input length; regex set pre‑compiled on boot.
* **Security**: OWASP ASVS L1; CORS restricted; JSON only; input sanitized.
* **Privacy**: No storage of INCI content in prod; metrics and counts only.
* **Accessibility (front‑end)**: results must be screen‑reader friendly; WCAG 2.1 AA for the UI.

---

## O) **Output specifics**

For each hit:

* `name` = canonical allergen
* `alias_matched` = exact text/alias matched (or the standardized alias if fuzzy)
* `status_eu` = `"allergen"` or `"restricted/banned"`
* `note` = localized per allergen (e.g., *“Fragrance allergen; oxidation increases risk”* for linalool)
* `positions` = list of start/end char indices in the **normalized** INCI string

Top‑level:

* `fragrance_present` (bool) – presence of generic fragrance terms
* `no_hits` (bool) – `true` when `allergens_found.length == 0`
* `advisories` – machine‑readable codes + localized messages

---

## P) **Performance & limits**

* Input length: **max 10,000 chars**; reject with `413` above.
* Timeout: **200ms** CPU budget per request (server‑side), including regex scan.
* Regex compiled once at process start; shared immutable.
* Memory footprint target: < 10 MB for datasets and indexes.

---

## Q) **QA & testing**

**Unit tests**

* Normalization (diacritics, hyphens, Greek letters).
* Alias mapping for Lilial/Lyral/HICC/BMHCA.
* Negation handling: `"without linalool"` → no hit.
* Parenthetical detection: `"Parfum (Limonene)"` → hit limonene.
* Fuzzy: `"limoneen"` with `mode=fuzzy` → hit limonene; with `strict` → no hit.
* Duplicates: repeated allergen appears once with first position.

**Integration tests**

* Full payload paths, headers, i18n switching, error codes.
* Load tests at 100 RPS sustained.

**Test vectors (samples)**

1. **Parfum only**

```json
{"inci_list":"Aqua, Parfum"}
```

→ `fragrance_present=true`, `allergens_found=[]`, advisory `PARFUM_NO_LISTED_ALLERGENS`, `no_hits=true`.

2. **Classic hits**

```json
{"inci_list":"Aqua, Linalool, Hexyl Cinnamaldehyde, Benzyl Benzoate"}
```

→ hits: linalool, hexyl cinnamal, benzyl benzoate; `no_hits=false`.

3. **Legacy/banned**

```json
{"inci_list":"Aqua, Butylphenyl Methylpropional, Hydroxyisohexyl 3-Cyclohexene Carboxaldehyde"}
```

→ hits: lilial (restricted/banned), HICC/lyral (restricted/banned); notes indicate legacy.

4. **Negation**

```json
{"inci_list":"Aqua, without linalool, parfum"}
```

→ no hit for linalool; fragrance advisory present.

5. **Fuzzy**

```json
{"inci_list":"Aqua, LimoNENE, citranal", "mode":"fuzzy"}
```

→ limonene hit; citral might match if distance rules allow (distance 2 → no).

---

## R) **Risks & mitigations**

* **False positives** from broad synonyms (e.g., “oak moss” in marketing text): mitigate by anchoring regex to token boundaries and scanning normalized INCI only.
* **False negatives** from typos: `mode=fuzzy` as opt‑in.
* **Regulatory drift**: surface `dataset_version`, provide metadata endpoint, plan for new set(s).

---

## S) **Security**

* Strict JSON parse; reject unknown fields (`additionalProperties=false`).
* Input normalization guards against regex DoS (no user‑supplied regex).
* Dependency pinning and SCA scanning; no dynamic code execution.
* Observability without PII payloads.

---

## T) **Telemetries for product**

* Track which allergens most often matched (aggregated).
* Track share of requests with `parfum` and without listed allergens.
* Track locale usage.

---

## U) **UI/UX (reference widget)**

* **Input**: multiline textarea (placeholder: “Paste INCI / ingredient list…”), language toggle (EN/PL), “Strict / Fuzzy” switch (tooltip explains).
* **Output**:

  * Badge per match (name, status chip, info icon for note).
  * Inline highlight of matched text (positions).
  * Advisories panel with standard messages.
  * Download JSON button (exact response).
  * Accessibility: semantic headings, ARIA labels; keyboard‑navigable.

---

## V) **Validation rules**

* `inci_list` must contain at least one letter.
* Reject inputs with >20% non‑printable characters (likely binary).
* Trim leading/trailing quotes if user pasted with quotes (quality of life).
* When `lang="auto"`, do **not** affect matching—only messages.

---

## W) **Wording & disclaimers (legal)**

* Provide generic, non‑diagnostic guidance:
  *“This tool flags label‑listed fragrance allergens for awareness only and does not assess concentrations or safety.”*
* Threshold disclaimer (already included).
* EU context language for Lilial/Lyral:
  *“Restricted/banned in EU context (legacy INCI may still appear on old labels).”*

---

## X) **eXamples (full)**

**Request**

```json
{
  "inci_list": "Aqua, Parfum (Fragrance), Linalool, Hexyl Cinnamal, Evernia prunastri extract",
  "mode": "strict",
  "lang": "en",
  "include_debug": true
}
```

**Response (abridged)**

```json
{
  "dataset_id":"ALLERGEN_SET_26",
  "dataset_version":"1.0.0",
  "fragrance_present": true,
  "allergens_found": [
    {"name":"linalool","alias_matched":"linalool","status_eu":"allergen","note":"Fragrance allergen; oxidation increases risk","positions":[{"start": 33,"end": 41}]},
    {"name":"hexyl cinnamal","alias_matched":"hexyl cinnamal","status_eu":"allergen","note":"Fragrance allergen","positions":[{"start": 43,"end": 58}]},
    {"name":"evernia prunastri extract","alias_matched":"evernia prunastri extract","status_eu":"allergen","note":"Fragrance allergen (oakmoss)","positions":[{"start": 60,"end": 86}]}
  ],
  "no_hits": false,
  "advisories":[{"code":"EU_THRESHOLD_DISCLAIMER","message":"Labeling thresholds differ for leave‑on vs. rinse‑off products; allergens may be present below declaration thresholds."}],
  "debug": {"normalized_inci":"aqua, parfum, linalool, hexyl cinnamal, evernia prunastri extract", "tokens":["aqua","parfum","linalool","hexyl cinnamal","evernia prunastri extract"]}
}
```

---

## Y) **Yield (return semantics & stability)**

* Response is deterministic in `strict` mode.
* In `fuzzy` mode, results remain stable for same input/version but are labeled with `match_type` in debug for auditability.

---

## Z) **Zero‑downtime delivery & ops**

* Blue/green deploys; pre‑warm regex set on boot.
* Backwards‑compatible changes only at patch/minor version; if breaking, bump `dataset_id` or `dataset_version` major and expose both sets under feature flag.
* Health check: `/healthz` returns regex compilation status and dataset load checksum.

---

## OpenAPI (concise)

```yaml
openapi: 3.0.3
info:
  title: Fragrance Allergen Checker
  version: 1.0.0
paths:
  /skin/narzedzia/alergeny-zapachowe/scan:
    post:
      summary: Scan INCI for 26 fragrance allergens
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ScanRequest' }
      responses:
        '200': { description: OK, content: { application/json: { schema: { $ref: '#/components/schemas/ScanResponse' }}}}
        '400': { description: Bad Request }
        '413': { description: Payload Too Large }
        '415': { description: Unsupported Media Type }
        '422': { description: Unprocessable Entity }
        '429': { description: Too Many Requests }
        '500': { description: Server Error }
components:
  schemas:
    ScanRequest: { type: object, required: [inci_list], properties:
      inci_list: { type: string, minLength: 1, maxLength: 10000 }
      mode: { type: string, enum: [strict, fuzzy], default: strict }
      lang: { type: string, enum: [auto, en, pl], default: auto }
      include_debug: { type: boolean, default: false } }
    Position: { type: object, properties: { start: {type: integer}, end: {type: integer} } }
    FoundAllergen: { type: object, required: [name, alias_matched, status_eu, note, positions],
      properties: { name: {type: string}, alias_matched: {type: string}, status_eu: {type: string, enum: [allergen, restricted/banned]}, note: {type: string}, positions: {type: array, items: { $ref: '#/components/schemas/Position'}}}}
    Advisory: { type: object, properties: { code: {type: string}, message: {type: string} } }
    ScanResponse: { type: object, required: [dataset_id, dataset_version, fragrance_present, allergens_found, no_hits, advisories],
      properties:
        dataset_id: { type: string }
        dataset_version: { type: string }
        last_updated: { type: string, format: date }
        fragrance_present: { type: boolean }
        allergens_found: { type: array, items: { $ref: '#/components/schemas/FoundAllergen' } }
        no_hits: { type: boolean }
        advisories: { type: array, items: { $ref: '#/components/schemas/Advisory' } }
        debug: { type: object } }
```

---

## Pseudocode (reference)

```python
def normalize_inci(text):
    s = to_nfkc(text).lower()
    s = replace_dashes(s)
    s = strip_diacritics(s)
    s = replace_greek(s)  # α->alpha etc.
    s = normalize_separators(s)  # commas
    tokens, index_map = split_tokens_and_map(s)  # keep parentheses content
    negations = detect_negations(tokens)  # indexes with free from/bez/no/without/w/o within 3 tokens
    return s, tokens, index_map, negations

def scan(inci_list, mode='strict', lang='en', include_debug=False):
    normalized, tokens, index_map, negations = normalize_inci(inci_list)
    matches = []
    fragrance_present = any(t in ('parfum','fragrance','aroma','perfum','parfume') for t in tokens)
    for token_idx, token in enumerate(tokens):
        if token_idx in negations: 
            continue
        m = match_against_dataset(token, normalized, mode)
        if m:
            pos = first_positions_of_match(normalized, m.matched_text)
            matches.append({
              "name": m.canonical,
              "alias_matched": m.alias,
              "status_eu": m.eu_status,
              "note": localize_note(m, lang),
              "positions": pos
            })
    # de-dupe by canonical
    matches = dedupe_by_name(matches)
    advisories = [threshold_advisory(lang)]
    if fragrance_present and not matches:
        advisories.insert(0, parfum_advisory(lang))
    return build_response(matches, fragrance_present, advisories, dataset_meta, normalized, tokens, negations, include_debug)
```

---

## Implementation notes

* Pre‑compile all regex patterns at startup; store in a small index mapping alias → canonical.
* Use a **two‑stage** matcher: (1) exact/alias hash check, (2) regex over entire normalized string to catch multi‑word patterns spanning separators.
* Fuzzy: compute distance token↔aliases; take best within threshold.
* Offset finding: use `re.finditer` on normalized text for the **matched alias string**; keep first span.

---

## Definition of Done (DoD)

* All unit & integration tests above pass.
* p95 latency within stated budgets under 100 RPS.
* OpenAPI document published; JSON Schemas validated.
* i18n messages verified in EN/PL.
* Observability dashboards show requests, latency, error rates, top allergens.
* Security review: no PII logs in prod; rate limiting active; dependencies scanned.
