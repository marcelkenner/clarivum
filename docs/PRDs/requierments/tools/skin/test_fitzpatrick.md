# Tool Specification — Test Fitzpatrick

> **Canonical decisions:** Follow `docs/adr/ADR-022-tools-and-calculators-platform.md` for the tooling shell and `docs/adr/ADR-021-diagnostics-platform.md` for quiz/scoring patterns.

Below is a complete **A–Z functional and non‑functional requirements** package for **/skin/narzedzia/test-fitzpatrick/** (Fitzpatrick Skin Type Quiz). It’s implementation‑ready and organized so engineers, designers, QA, and compliance can work in parallel.

---

## A) Audience, Scope & Goals

**Audience**

* General public; age 16+; no prior dermatology knowledge assumed.
* Mobile‑first; accessible to screen‑reader users.

**In‑scope**

* Self‑reported 10‑item questionnaire.
* Localized UI (PL primary, EN secondary).
* Deterministic scoring → type I–VI.
* Result rendering (score, type, general guidance).
* Optional JSON export.

**Out‑of‑scope**

* Diagnosis, treatment, medical triage.
* User accounts or storing PII by default.

**Success metrics**

* ≥85% completion rate after start.
* <2% server‑side validation errors after submit.
* P95 page interactive <2.0s on 3G Fast.

---

## B) Business Rules & Domain Definitions

* **Phototype**: Determined solely by total score S = Σ(item scores), S ∈ [0,40].
* **Mapping** (inclusive ranges):

  * I: 0–6
  * II: 7–12
  * III: 13–18
  * IV: 19–24
  * V: 25–30
  * VI: 31–40
* **Left→right option order increases score**, but UI **must not display numeric values**.
* **Submission requires all 10 answers**.
* **Disclaimer** must display **before** or **with** results: “Self‑assessment only; skin cancer risk depends on many factors.”

---

## C) Calculations & Scoring Engine (deterministic)

**Questions (IDs, options → scores 0–4):**

**Genetic**

1. `eye_color`: light blue/green(0), blue/green(1), hazel(2), brown(3), dark brown/black(4)
2. `natural_hair`: red(0), blonde(1), dark blonde/light brown(2), brown(3), dark brown/black(4)
3. `inner_arm_skin`: very fair(0), fair(1), light beige(2), medium(3), dark(4)
4. `freckles`: many(0), some(1), few(2), scarcely(3), none(4)

**Sun response**
5. `first_strong_sun`: always burns/never tans(0), often burns/minimal tan(1), sometimes mild burn/tan slowly(2), rarely burns/tans easily(3), never burns/deep tan(4)
6. `burn_severity`: painful/peeling(0), moderate(1), mild(2), rarely(3), never(4)
7. `tanning_ability`: none(0), light(1), moderate(2), good(3), very deep(4)
8. `tan_speed`: never(0), very slow(1), slow(2), average(3), fast(4)
9. `sun_sensitivity_face`: very sensitive(0), …, not sensitive(4)
10. `tan_last_year`: never(0), …, always(4)

**Engine requirements**

* Pure function: `result = evaluate(answers, quiz_version)`.
* Stable, deterministic, unit‑testable; no side effects.
* Bound checks: each score must be integer 0–4; S must compute to 0–40.
* Mapping function covers all inclusive ranges above.
* Return structure (see Y).

---

## D) Data Model (Client & Server)

**Question schema**

```json
{
  "id": "eye_color",
  "section": "genetic",
  "prompt": {"en": "Eye color", "pl": "Kolor oczu"},
  "options": [
    {"id":"light_blue_green","label":{"en":"Light blue/green","pl":"Jasnoniebieskie/zielone"},"score":0},
    {"id":"blue_green","label":{"en":"Blue/green","pl":"Niebieskie/zielone"},"score":1},
    {"id":"hazel","label":{"en":"Hazel","pl":"Piwne"},"score":2},
    {"id":"brown","label":{"en":"Brown","pl":"Brązowe"},"score":3},
    {"id":"dark_brown_black","label":{"en":"Dark brown/black","pl":"Ciemnobrązowe/czarne"},"score":4}
  ],
  "required": true
}
```

**Submission payload**

```json
{
  "quiz_version": "2025-10-23",
  "language": "pl",
  "answers": {
    "eye_color": "dark_brown_black",
    "natural_hair": "brown",
    "inner_arm_skin": "light_beige",
    "freckles": "none",
    "first_strong_sun": "rarely_burns_tans_easily",
    "burn_severity": "rarely",
    "tanning_ability": "good",
    "tan_speed": "average",
    "sun_sensitivity_face": "slightly_sensitive",
    "tan_last_year": "often"
  },
  "consent_analytics": false
}
```

**Result schema** (see Y).

---

## E) Endpoints / API Contract

**Public page (SSR/CSR)**

* `GET /skin/narzedzia/test-fitzpatrick/` → HTML (+ hydration). Caches: CDN 1h, revalidate on deploy.

**Quiz content**

* `GET /api/fitzpatrick/v1/questions?lang=pl`
  200 → questions array, `quiz_version`, `updated_at`.
  304 on unchanged ETag.

**Score evaluation**

* `POST /api/fitzpatrick/v1/score` (JSON only)

  * Auth: none; CSRF required for browser; CORS restricted.
  * 200 → result JSON.
  * 400 → malformed JSON.
  * **422** → missing/invalid answers (see H).
  * 429 → rate limit exceeded.
  * 500 → internal.

**OpenAPI (excerpt)**

```yaml
openapi: 3.0.3
info: {title: Fitzpatrick Quiz API, version: 1.0.0}
paths:
  /api/fitzpatrick/v1/questions:
    get:
      parameters:
        - in: query; name: lang; schema: {type: string, enum: [pl, en]}; required: false
      responses:
        '200': {description: Ok}
  /api/fitzpatrick/v1/score:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema: {$ref: '#/components/schemas/Submission'}
      responses:
        '200': {description: Result}
        '422': {description: Validation error}
components:
  schemas:
    Submission:
      type: object
      required: [answers, quiz_version]
      properties:
        quiz_version: {type: string}
        language: {type: string}
        answers:
          type: object
          additionalProperties: {type: string}
```

---

## F) Form Behavior & UX

* Two sections with sticky section headers: **Genetic**, **Sun response**.
* Each question: `<fieldset>` with legend; 5 radio buttons in a single row (wrap on small screens).
* “Next section” anchor after Q4; “Back to genetic” at top of section 2.
* Primary button **Submit** disabled until all required questions answered.
* Secondary actions: **Reset**, **Copy JSON**, **Print**.
* Upon submit: inline result card + persistent disclaimer.
* No numeric scores visible during fill; show score only on result screen.
* Save progress to `localStorage` every change; **Reset** clears it.

---

## G) General Guidance Content Rules

* **Output must remain non‑diagnostic**; no treatment claims.
* Provide 2–4 short bullets tailored by type, e.g.:

  * **I**: “Burn risk: very high”, “Prioritize shade, protective clothing”, “Broad‑spectrum sunscreen.”
  * **II**: “Burn risk: high”, “Build sun exposure gradually.”
  * **III**: “Burn risk: moderate”, “Still use daily protection.”
  * **IV**: “Burn risk: low–moderate”, “Consider higher UVA protection if hyperpigmentation‑prone.”
  * **V**: “Burn risk: lower”, “Monitor for uneven pigmentation.”
  * **VI**: “Burn risk: lowest”, “Be aware that damage can occur without burning.”
* Guidance strings kept in translation files; no clinical red flags implied.

---

## H) Handling Errors, Validation & Edge Cases

**Client‑side**

* Prevent submit until all 10 answers selected.
* On refresh/return, repopulate from `localStorage`.
* If corrupted state, show non‑blocking toast: “We reset your answers due to a saved‑state error.”

**Server‑side**

* Validate presence and membership (answer IDs exist for each question).
* Reject extra keys (whitelist).
* Responses:

  * **422/MISSING_ANSWER**: list missing IDs.
  * **422/INVALID_OPTION**: specify offending question and option.
  * **422/OUT_OF_RANGE_SCORE**: if option score not 0–4 (config sanity).
* Rate‑limit: 30 submissions / IP / 5 min.

**Edge cases**

* All zeros → S=0 → I.
* All fours → S=40 → VI.
* Boundary tests (see Q).

---

## I) Internationalization & Localization

* Default language: **pl** (based on path); toggle to **en**.
* All text in i18n catalogs; no strings hardcoded.
* Numerals/units neutral; no date/time.
* RTL not required (future‑proof by avoiding hard‑coded LTR assumptions).
* URL remains ASCII: `/skin/narzedzia/test-fitzpatrick/`.

---

## J) Journey & Navigation

* Entry points: tools index → quiz; SEO landing allowed (canonical).
* Post‑result CTAs (configurable): “Learn about sun protection”, “Find a dermatologist” (outbound, `rel="nofollow noopener"`).
* Back‑to‑tools link.

---

## K) Keyboard & Accessibility (WCAG 2.2 AA)

* Fully operable via keyboard: arrows for radio groups; focus outlines.
* `<fieldset>` + `<legend>` for each question; `<label for>` for each radio.
* Visible error text associated via `aria-describedby`.
* Color contrast ≥ 4.5:1; hit targets ≥ 24×24 px.
* Screen reader live region announces “Result calculated” after submit.
* Skip‑to‑content link present.

---

## L) Legal, Consent & Disclaimers

* Persistent disclaimer under result:

  * **PL**: “**Autotesty nie zastępują porady lekarskiej.** Ryzyko nowotworów skóry zależy od wielu czynników.”
  * **EN**: “**Self‑assessment only; not medical advice.** Skin cancer risk depends on many factors.”
* Privacy notice link; cookie consent only if non‑essential analytics enabled.
* Not a medical device; no CE/US FDA claims.

---

## M) Metrics, Analytics & Experimentation

* Events (only if user consents):

  * `quiz_started`, `section_viewed`, `quiz_completed` (score, type), `validation_error` (category), `json_copied`.
* A/B: layout variant (1 vs 2 column on desktop), gated behind feature flag.
* Store only aggregated, non‑PII; truncate IP at edge (if logged at all).

---

## N) Non‑Functional: Performance & Scalability

* P95 TTFB < 500 ms; P95 interactive < 2.0 s on 3G Fast.
* Page weight target < 120 KB (gzipped) excluding fonts; no heavy dependencies.
* Server capacity: 100 RPS sustained; autoscale HPA based on CPU/latency.
* CDN caching for questions; score endpoint not cached; 99.9% monthly availability.

---

## O) Operational Concerns (Deploy, Flags, Config)

* Feature flags:

  * `fitzpatrick.enabled`
  * `fitzpatrick.ab.layout`
  * `fitzpatrick.analytics` (requires consent)
* Config store for guidance text and external CTA links.
* Blue/green or canary deploy; healthcheck `/healthz`.

---

## P) Privacy, Security & Compliance

* No account, no PII collection by default.
* CSRF protection for POST; CORS limited to first‑party origins.
* Input validation (whitelist IDs), output encoding; strict CSP:

  * `default-src 'self'`; allowlist analytics domain when consented.
* Cookies: none unless analytics consent; `SameSite=Lax`, `Secure`, `HttpOnly` when applicable.
* Logs exclude IP or truncate at /24; rotate & encrypt at rest.

---

## Q) Quality Assurance & Test Plan

**Unit tests (engine)**

* Sums: all 0 → 0 (I); all 4 → 40 (VI).
* Boundaries:

  * 6 → I; 7 → II
  * 12 → II; 13 → III
  * 18 → III; 19 → IV
  * 24 → IV; 25 → V
  * 30 → V; 31 → VI
* Randomized property test: S ∈ [0,40].

**API tests**

* 200 path with valid payload.
* 422 on: missing field; unknown option; extraneous answer; wrong quiz_version.
* Idempotency: same payload → same result.

**Accessibility tests**

* Axe clean; keyboard traversal; screen reader labels verify.

**Cross‑browser**

* Latest Chrome/Firefox/Safari/Edge; iOS Safari 15+; Android Chrome 111+.

**Visual regression**

* Snapshot states: empty, partially filled, completed result (I–VI samples).

---

## R) Reliability & Resilience

* Timeouts: 3s upstream, 10s client; retries for GET `/questions` with backoff.
* Idempotent POST by payload hash (server may log hash for dedup analytics only, no PII).
* Graceful degradation: if API down, client can compute result locally from embedded schema (shadow scorer), with banner “Offline mode”.

---

## S) SEO, Social Sharing & Structured Data

* `<title>` and `<meta description>` localized.
* Canonical URL: `/skin/narzedzia/test-fitzpatrick/`.
* Structured data: `WebApplication` with `applicationCategory: HealthApplication` (informational); no medical claims.
* Open Graph/Twitter card preview; no index blocking.

---

## T) Telemetry & Monitoring

* Uptime checks for both endpoints (1‑min interval).
* Alerts: P95 latency > 1s (questions), > 400ms (score) sustained 5 min; 5xx rate >1%.
* Error aggregation (e.g., Sentry): capture 422 details by category (no payload bodies).

---

## U) UI Spec (Components & States)

* **Components**

  * Page header with breadcrumb: Skin → Narzędzia → Fitzpatrick.
  * Section cards: “Genetyczne cechy”, “Reakcja na słońce”.
  * Question row: legend + 5 radio “chips”.
  * Actions: Submit (primary), Reset, Copy JSON, Print.
  * Result card: badge with Type (I–VI), total score, 2–4 guidance bullets, disclaimer block, CTAs.

* **States**

  * **Pristine**: submit disabled.
  * **In‑progress**: autosave active.
  * **Error**: missing question highlights with helper text.
  * **Success**: result card visible; page scrolls to result; focus shifted to result heading.

---

## V) Versioning & Compatibility

* `quiz_version` (ISO date) returned by `/questions` and echoed in submission.
* Server rejects unknown `quiz_version` only if breaking change; otherwise accepts and maps.
* Response includes `engine_version` and `guidance_version`.
* Changelog maintained; backward‑compatible option IDs when updating wording.

---

## W) Wording & Microcopy (samples)

**Polish**

* H1: “Test fototypu skóry (Fitzpatrick)”
* Submit: “Pokaż wynik”
* Reset: “Wyczyść odpowiedzi”
* Copy JSON: “Kopiuj wynik (JSON)”
* Validation: “Uzupełnij wszystkie pytania.”
* Disclaimer: “Autotesty nie zastępują porady lekarskiej…”

**English**

* H1: “Fitzpatrick Skin Type Quiz”
* Submit: “Show result”
* Validation: “Please answer all questions.”

---

## X) eXperience for Edge Devices (Offline/PWA)

* Works offline for `/questions` via cached JSON (stale‑while‑revalidate).
* Client‑side scorer available offline.
* Low‑bandwidth mode: no web fonts; system fonts only.
* No layout shift > 0.1 CLS target.

---

## Y) Yield / Output Contract & Examples

**Canonical result JSON**

```json
{
  "score": 22,
  "type": "IV",
  "general_guidance": [
    "Burn risk: low–moderate",
    "Use daily broad‑spectrum protection",
    "Consider higher UVA protection if hyperpigmentation‑prone"
  ],
  "engine_version": "1.0.0",
  "quiz_version": "2025-10-23",
  "language": "pl"
}
```

**Type mapping table** (server constant):

```json
[
  {"type":"I","min":0,"max":6},
  {"type":"II","min":7,"max":12},
  {"type":"III","min":13,"max":18},
  {"type":"IV","min":19,"max":24},
  {"type":"V","min":25,"max":30},
  {"type":"VI","min":31,"max":40}
]
```

---

## Z) Zero‑Defect Checklist & Acceptance Criteria

**Acceptance Criteria**

1. Page loads with 10 questions grouped into two sections; each question shows 5 options; left→right order matches scores 0→4.
2. Submit is disabled until all 10 answers are selected; enabling occurs immediately after the 10th selection.
3. POST with a complete, valid payload returns HTTP 200 and a JSON body containing `score`, `type`, and `general_guidance`.
4. Boundary submissions (S=6,7,12,13,18,19,24,25,30,31) map to the correct adjacent types.
5. Missing answers return HTTP 422 with `code: "MISSING_ANSWER"` and a list of missing IDs.
6. The result card displays the correct type badge (I–VI), numeric score, guidance bullets, and a persistent non‑diagnostic disclaimer.
7. All interactive elements are keyboard accessible; automated a11y tests pass with no critical issues.
8. With analytics disabled (no consent), no analytics network requests are made.
9. Mobile viewport (320px) remains usable without horizontal scroll; radio groups wrap cleanly.
10. Refreshing mid‑quiz restores previous answers; **Reset** clears stored state.

**Go‑live checklist**

* [ ] CSP enabled and verified.
* [ ] SEO tags localized; canonical URL present.
* [ ] Monitoring alarms green for 24h canary.
* [ ] Engine/unit tests ≥95% coverage of scoring paths.
* [ ] Translations proofread (PL/EN).

---

### Implementation Notes (optional but helpful)

* Keep a single **source of truth** for question IDs and option scores shared by client and server (e.g., generated TypeScript types from the JSON schema).
* Provide a tiny “shadow scorer” in the client so results can be computed locally and displayed even if the POST fails; the POST then becomes optional/for analytics only (with consent).
* Use semantic HTML for radios; avoid custom role hacks to keep a11y simple.
