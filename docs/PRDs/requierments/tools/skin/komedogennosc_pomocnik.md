# Tool Specification — Komedogenność Pomocnik

> **Canonical decision:** Implement using the shared tooling platform in `docs/adr/ADR-022-tools-and-calculators-platform.md`.

Below is an **A–Z** specification of **functional and non‑functional requirements** for the **Comedogenicity Helper** located at
`/skin/narzedzia/komedogennosc-pomocnik/` (Polish UI path; ASCII-only slug for URLs).

---

## A) Architecture & API Surface (Functional)

**A1. Endpoint types**

* **Public UI route (SSR/SPA):** `GET /skin/narzedzia/komedogennosc-pomocnik/`

  * Renders the tool UI and loader. No PII or inputs in querystring by default.
* **Analyze API (JSON):** `POST /api/skin/comedogenicity-helper/v1/analyze`

  * Purpose: Accept an INCI string, return matches, weighted score, bucket, and context note.
* **Status/health (ops):** `GET /api/skin/comedogenicity-helper/v1/healthz` → `{ "status":"ok", "version":"x.y.z" }`.

**A2. Authentication**

* Public read‑only tool; **no auth required** to analyze single inputs.
* Optional API key for batch or partner use (see W).

**A3. Transport**

* HTTPS only (HSTS), JSON only for the API.

---

## B) Business Goals & Scope (Functional)

**B1. Goals**

* Provide a fast, explainable risk signal based on traditional comedogenicity scores.
* Emphasize **variability**: individual response, concentration, and formulation matter.

**B2. Out of scope**

* Diagnosis, treatment, or medical advice.
* Predictive modeling beyond the **simple rules-based table** provided.

---

## C) COMEDO_TABLE Content (Functional)

**C1. Starter dataset (canonical names → score 0–5)**

* **5:** isopropyl myristate, myristyl myristate, isopropyl isostearate
* **4:** isopropyl palmitate, lauric acid, cocoa butter, coconut oil
* **3:** marula oil, wheat germ oil
* **2:** avocado oil, shea butter
* **1:** mineral oil
* **0:** squalane, dimethicone

**C2. Synonym mapping (examples)**

* coconut oil ⇄ *cocos nucifera (coconut) oil*
* cocoa butter ⇄ *theobroma cacao (cocoa) seed butter*
* shea butter ⇄ *butyrospermum parkii (shea) butter*
* avocado oil ⇄ *persea gratissima (avocado) oil*
* wheat germ oil ⇄ *triticum vulgare (wheat) germ oil*
* isopropyl palmitate ⇄ *IPP*
* isopropyl myristate ⇄ *IPM*
* lauric acid ⇄ *dodecanoic acid*

> ✅ **Requirement:** Synonyms are configurable and stored with the table (see Y).

**C3. Data fields**

* `canonical_name` (string, lowercase)
* `score` (int 0–5)
* `synonyms` (string[])
* `notes` (optional string; short caveats or provenance tag “starter”)
* `last_updated` (ISO date)

---

## D) Data Model & Storage (Functional)

* Default source: a **YAML or JSON** file shipped with the service (read‑only at runtime, hot‑reloadable).
* In-memory cache with TTL (e.g., 15 minutes) and ETag for config version.
* Optional admin‑only write path (feature‑flagged) for future curation.

---

## E) Errors & Fault Handling (Functional)

**E1. API error envelope (always 200 or 4xx/5xx with JSON):**

```json
{
  "error": { "code": "INVALID_INPUT", "message": "inci_list is required", "details": [] }
}
```

**E2. Error codes**

* `INVALID_INPUT`, `PAYLOAD_TOO_LARGE`, `UNSUPPORTED_MEDIA_TYPE`,
  `RATE_LIMITED`, `INTERNAL_ERROR`, `CONFIG_UNAVAILABLE`.

**E3. Validation**

* `inci_list` required; type string; length ≤ 20,000 chars; UTF‑8.
* Reject binary control characters; normalize Unicode.

---

## F) Functional Flow (User Journey)

1. User pastes INCI string (any language labels allowed).
2. Client calls `POST /analyze` with JSON.
3. Service **normalizes and tokenizes** ingredients (I).
4. Service **matches** against COMEDO_TABLE (K).
5. Service **scores**: sum of top 3 highest scores present (K).
6. Service **buckets**: 0–2 = low; 3–6 = moderate; ≥7 = high.
7. Response includes **matched items**, **weighted_risk_score**, **bucket**, and a **context note** emphasizing variability.
8. UI displays results + educational message + copyable JSON.

---

## G) Governance & Curation (Functional + Non‑functional)

* **Change control:** Any score or synonym changes require PR + reviewer approval.
* **Versioning:** Each table change bumps a `dataset_version` (semantic version).
* **Audit:** Log `dataset_version` used per request (L).

---

## H) Health, Readiness, & Status (Non‑functional)

* `/healthz` for liveness; `/readyz` for readiness (ensures table loaded).
* Expose build `version`, `dataset_version`, and last load timestamp.

---

## I) Inputs & Normalization (Functional)

**I1. Input shape**

```json
{ "inci_list": "Aqua, Cocos Nucifera (Coconut) Oil, Dimethicone, Isopropyl Myristate" }
```

**I2. Normalization steps**

1. **Unicode NFKC** normalize.
2. **Lowercase**.
3. **Replace separators**: `; | · / •` → `,`.
4. **Strip** content inside parentheses **but keep a copy** for alias detection.
   Example: “cocos nucifera (coconut) oil” → tokens:

   * primary: `cocos nucifera oil`
   * alias candidate: `coconut oil`
5. **Trim punctuation** and extra whitespace.
6. **De‑duplicate** tokens (set semantics).
7. **Alias expansion:** try exact token, then alias tokens via synonym map.
8. **Safety filters:** avoid partial word traps (e.g., “coco‑betaine” ≠ “coconut oil”).

**I3. Token boundaries**

* Split on commas as primary delimiter.
* Also tolerate newlines and bullets.

**I4. Locale awareness**

* Accept diacritics; strip for matching (`ł` → `l`) while preserving original for display.

---

## J) JSON Schemas (Functional)

**J1. Request schema**

```json
{
  "type": "object",
  "required": ["inci_list"],
  "properties": {
    "inci_list": { "type": "string", "maxLength": 20000 },
    "lang": { "type": "string", "enum": ["en", "pl"], "default": "en" },
    "return_context": { "type": "boolean", "default": true }
  },
  "additionalProperties": false
}
```

**J2. Response schema (200)**

```json
{
  "type": "object",
  "properties": {
    "matches": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },            // canonical_name
          "score": { "type": "integer", "minimum": 0, "maximum": 5 },
          "matched_from": { "type": "string" },    // original token or synonym
          "synonym_used": { "type": "string", "nullable": true },
          "notes": { "type": "string", "nullable": true }
        },
        "required": ["name", "score", "matched_from"]
      }
    },
    "weighted_risk_score": { "type": "integer", "minimum": 0, "maximum": 15 },
    "bucket": { "type": "string", "enum": ["low", "moderate", "high"] },
    "note": { "type": "string" },
    "meta": {
      "type": "object",
      "properties": {
        "dataset_version": { "type": "string" },
        "input_count": { "type": "integer" },
        "match_count": { "type": "integer" },
        "top_n_considered": { "type": "integer", "default": 3 }
      }
    },
    "warnings": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["matches", "weighted_risk_score", "bucket", "note"]
}
```

**J3. Error schema**

```json
{ "error": { "code": "STRING", "message": "STRING", "details": [] } }
```

---

## K) Key Algorithm & Scoring (Functional)

**K1. Matching**

* Exact match on `canonical_name`.
* If not found, attempt **synonym match** (normalized equality).
* A given ingredient contributes **once** (use the canonical max score across synonyms).

**K2. Weighted risk score**

* Sort **unique** matched scores descending; **sum top 3**.

  * If <3 matches, sum what exists.
  * If duplicates (e.g., “coconut oil” appears twice), count **once**.

**K3. Bucketing**

* 0–2 → `"low"`
* 3–6 → `"moderate"`
* ≥7 → `"high"`

**K4. Notes**

* Always include: *“Comedogenicity lists are guides, not guarantees. Individual response varies; patch test on skin.”*
* If no matches, add reassurance: *“No flagged ingredients from our starter list were found.”*

**K5. Determinism**

* Given the same `dataset_version` and input, output must be identical.

**K6. Pseudocode**

```text
tokens = normalize(inci_list)
candidates = {}
for t in tokens:
  if t in TABLE: add (canonical=t, score=TABLE[t], from=t)
  else if t in SYN_MAP: c = canon(SYN_MAP[t]); add (canonical=c, score=TABLE[c], from=t, syn=t)
# de-dup by canonical; keep highest score if collision
scores = sort_desc([score for each unique canonical])
weighted = sum(scores[0:3])
bucket = (weighted <= 2) ? "low" : (weighted <= 6) ? "moderate" : "high"
```

---

## L) Logging & Audit (Non‑functional)

* **Do not log** raw `inci_list` by default.

  * Log only: length, hash (SHA‑256), `match_count`, `weighted_risk_score`, `bucket`, `dataset_version`, latency, status.
* Correlate with `request_id` header (trace ID).
* Retain logs 30–90 days (configurable).

---

## M) Monitoring & Metrics (Non‑functional)

Expose Prometheus (or equivalent):

* `requests_total{status}`, `latency_ms_bucket`, `matches_per_request_histogram`
* `dataset_version_info{version}`, `table_load_failures_total`
* `rate_limited_total`, `errors_total{code}`

---

## N) Non‑functional Constraints (Performance, Availability, Scalability)

* **P50 latency:** ≤ 50 ms; **P95:** ≤ 200 ms (at 50 RPS)
* **Cold start:** ≤ 1 s
* **Availability SLO:** 99.9% for API
* **Throughput baseline:** 100 RPS per pod; horizontal autoscale on CPU or latency
* **Memory footprint:** ≤ 64 MB per pod for table + code

---

## O) Operations & Deployment (Non‑functional)

* Containerized service; 12‑factor app.
* Blue/green or canary deploys; config via env vars:

  * `COMEDO_TABLE_URL`, `TABLE_REFRESH_SEC`, `LOG_LEVEL`, `LANG_DEFAULT`.
* Rollback within 1 click and ≤ 5 minutes.
* Daily job to validate table integrity (checksum, schema).

---

## P) Privacy, Security & Compliance (Non‑functional)

* No PII required; treat input as **user content**.
* TLS 1.2+; HSTS, X‑Content‑Type‑Options, X‑Frame‑Options, CSP.
* Input sanitization; reject HTML/JS.
* CORS: allow same‑site; configurable allowlist for partners.
* Rate limiting per IP/API key (e.g., 120/min burst 240).
* “Not medical advice” disclaimer present in UI and API docs.

---

## Q) Quality Assurance & Testing (Functional + Non‑functional)

**Q1. Unit tests**

* Normalization: parentheses stripping, alias detection, diacritics.
* Matching: canonical vs synonym, de‑dupe.
* Scoring: edge cases (0, 1, 2, 3+ matches).
* Bucketing thresholds.

**Q2. Property‑based tests**

* Random separators/newlines; ensure idempotent normalization.

**Q3. Integration tests**

* API contract with example payloads.
* Config hot‑reload test (dataset_version bump detected).

**Q4. Regression tests**

* Lock in outputs for a curated set of real‑world INCI lists.

---

## R) Resilience & Rate Limiting (Non‑functional)

* Graceful degradation: if table unavailable, return `503` with clear message.
* Circuit breaker for config store.
* Rate limits as in P; friendly error message and `Retry‑After` header.

---

## S) SLIs/SLOs & Reliability (Non‑functional)

* **SLIs:** availability, latency, error rate, config freshness.
* **SLO Breach policy:** page on `5xx` error spikes or table load failure > 5 min.

---

## T) Text, Tone & Disclaimers (Functional)

* **Core note (English):**
  “Comedogenicity lists are guides, not guarantees. Individual response varies; patch test on skin.”
* **Core note (Polish):**
  „Listy komedogenności to wskazówki, a nie gwarancje. Reakcje są indywidualne; wykonaj próbę na skórze.”
* Additional contextual strings shown when:

  * **High bucket:** add *“Formulation, concentration and your skin context matter—avoid blanket assumptions.”*
  * **No matches:** add reassurance line from K4.

---

## U) UI/UX Requirements (Functional)

* **Input area:** multi‑line textarea with placeholder “Paste full INCI (comma‑separated).”
* **Actions:** Analyze, Clear.
* **Results panel:**

  * **Badge** for bucket: Low / Moderate / High.
  * **Score bar** showing `weighted_risk_score` on a 0–15 scale.
  * **Matched ingredients table:** columns = *Ingredient (canonical)*, *Score (0–5)*, *Matched from* (exact token / synonym), *Notes*.
  * **Educational note** (T).
  * **Copy JSON** button (returns exact API payload).
* **Accessibility:** WCAG 2.2 AA; keyboard navigable; visible focus; ARIA labels.
* **Localization:** EN/PL toggle; path stays Polish; API `lang` governs messages.

---

## V) Versioning & Backward Compatibility (Non‑functional)

* **API version** in path (`/v1/…`). Breaking changes require new version.
* Response includes `meta.dataset_version`.
* Deprecation headers: `Sunset` and `Deprecation` when needed.

---

## W) Workflows: Batch & Partner Use (Functional)

* Optional partner endpoint (authenticated):
  `POST /api/skin/comedogenicity-helper/v1/batch` with:

  ```json
  { "items": [{ "id": "sku123", "inci_list": "..." }, ...], "top_n": 3 }
  ```
* Response streams per item (NDJSON) or returns aggregated array.
* **Limits:** up to 1,000 items per request; server‑side timeouts; backpressure.

---

## X) eXamples & Acceptance Criteria (Functional)

**X1. Example request**

```http
POST /api/skin/comedogenicity-helper/v1/analyze
Content-Type: application/json

{
  "inci_list": "Aqua, Cocos Nucifera (Coconut) Oil, Dimethicone, Isopropyl Myristate"
}
```

**X2. Example response**

```json
{
  "matches": [
    { "name": "isopropyl myristate", "score": 5, "matched_from": "isopropyl myristate", "synonym_used": null, "notes": "starter" },
    { "name": "coconut oil", "score": 4, "matched_from": "cocos nucifera (coconut) oil", "synonym_used": "coconut oil", "notes": "starter" },
    { "name": "dimethicone", "score": 0, "matched_from": "dimethicone", "synonym_used": null, "notes": "starter" }
  ],
  "weighted_risk_score": 9,
  "bucket": "high",
  "note": "Comedogenicity lists are guides, not guarantees. Individual response varies; patch test on skin.",
  "meta": { "dataset_version": "starter-1.0.0", "input_count": 4, "match_count": 3, "top_n_considered": 3 },
  "warnings": []
}
```

**X3. Edge case (no matches)**

* Input: `"Aqua, Glycerin, Caprylic/Capric Triglyceride"`
* Output: `weighted_risk_score=0`, `bucket="low"`, note includes reassurance.

**X4. Acceptance criteria**

* Given input with **isopropyl myristate** and **coconut oil**, result `weighted_risk_score >= 9` and bucket `high`.
* Given input with **only squalane**, result `weighted_risk_score = 0`, bucket `low`.
* Given duplicate **coconut oil** entries, counted once.
* Given **IPP** matches **isopropyl palmitate** via synonym.

---

## Y) YAML Config & Admin (Functional + Non‑functional)

**Y1. Config file format (excerpt)**

```yaml
dataset_version: "starter-1.0.0"
ingredients:
  - canonical_name: "isopropyl myristate"
    score: 5
    synonyms: ["ipm", "isopropyl myristate"]
    notes: "starter"
  - canonical_name: "coconut oil"
    score: 4
    synonyms: ["cocos nucifera (coconut) oil", "coconut oil"]
    notes: "starter"
  - canonical_name: "dimethicone"
    score: 0
    synonyms: ["dimethicone"]
    notes: "starter"
```

**Y2. Admin safeguards**

* Schema validation at load; reject invalid entries.
* No overlapping canonical names; synonyms must be unique across items.

---

## Z) Zero‑downtime, Rollback & Compliance (Non‑functional)

* **Hot reload:** swap config atomically; if load fails, keep prior table.
* **Rollback:** revert to previous `dataset_version` instantly.
* **Compliance:** Persist only **aggregate** metrics; no INCI content retention unless user opts in for history (future feature/flag).
* **Legal footer:** “Informational only; not medical advice.”

---

### OpenAPI 3.0 (Minimal) for `/analyze`

```yaml
openapi: 3.0.3
info:
  title: Comedogenicity Helper API
  version: 1.0.0
paths:
  /api/skin/comedogenicity-helper/v1/analyze:
    post:
      summary: Analyze INCI for comedogenicity matches
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnalyzeRequest'
      responses:
        '200':
          description: Analysis result
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AnalyzeResponse'
        '400':
          description: Invalid input
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    AnalyzeRequest:
      type: object
      required: [inci_list]
      properties:
        inci_list: { type: string, maxLength: 20000 }
        lang: { type: string, enum: [en, pl], default: en }
        return_context: { type: boolean, default: true }
    AnalyzeResponse:
      type: object
      required: [matches, weighted_risk_score, bucket, note]
      properties:
        matches:
          type: array
          items:
            type: object
            required: [name, score, matched_from]
            properties:
              name: { type: string }
              score: { type: integer, minimum: 0, maximum: 5 }
              matched_from: { type: string }
              synonym_used: { type: string, nullable: true }
              notes: { type: string, nullable: true }
        weighted_risk_score: { type: integer, minimum: 0, maximum: 15 }
        bucket: { type: string, enum: [low, moderate, high] }
        note: { type: string }
        meta:
          type: object
          properties:
            dataset_version: { type: string }
            input_count: { type: integer }
            match_count: { type: integer }
            top_n_considered: { type: integer }
        warnings:
          type: array
          items: { type: string }
    Error:
      type: object
      properties:
        error:
          type: object
          required: [code, message]
          properties:
            code: { type: string }
            message: { type: string }
            details: { type: array, items: { type: string } }
```

---

## Implementation Notes (Concise)

* Language/runtime: any (Node, Python, Go); pure in‑memory table for speed.
* Use a **deterministic normalizer** (I2) and a **strict matcher** to avoid false positives.
* Keep the **starter** list minimal and conservative; make expansion via YAML only.
* Provide **unit and integration tests** covering X1–X4 and corner cases.
* Ensure **UI** plainly communicates the limitations and variability (T).
