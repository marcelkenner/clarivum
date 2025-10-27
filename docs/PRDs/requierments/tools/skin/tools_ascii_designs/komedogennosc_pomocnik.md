> **Canonical decisions:** `docs/adr/ADR-022-tools-and-calculators-platform.md` powers the tool runtime; follow tokens in `docs/adr/ADR-018-brand-design-system.md`.

Below are **mobile‑first ASCII wireframes** for the **Komedogennosc Pomocnik** UI (Polish-first, EN toggle). Each screen targets a ~360–400 px viewport; width is kept to ~44 chars. Controls are shown in **[BRACKETS]**; dynamic regions annotated with `(aria-…)` where relevant.

---

## S0 — SSR/SPA Loader (first paint)

```
+--------------------------------------------+
| Komedogennosc Pomocnik            [PL|EN]  |
| /skin/narzedzia/komedogennosc-pomocnik/    |
+--------------------------------------------+
| (aria-live="polite")                       |
| [skeleton title_____ ]                     |
| [skeleton textarea______________________]  |
| [skeleton button__] [skeleton button__]    |
|                                            |
| [skeleton badge_]   [skeleton meter____]   |
| [skeleton cards__________________________] |
|                                            |
| "Informational only; not medical advice."  |
+--------------------------------------------+
```

---

## S1 — Empty (PL default), ready for input

```
+--------------------------------------------+
| Komedogennosc Pomocnik            [PL|EN]  |
| /skin/narzedzia/komedogennosc-pomocnik/    |
+--------------------------------------------+
| Wklej pelne INCI (po przecinkach).         |
| [ textarea (rows≈6)                       ] |
| [                                           |
|   np.: Aqua, Cocos Nucifera (Coconut) Oil,  |
|   Dimethicone, Isopropyl Myristate          |
| ]                                           |
|                                            |
| [ANALIZUJ]   [WYCZYSC]                      |
|                                            |
| Dostepnosc: WCAG 2.2 AA; klawiatura OK.     |
| "Informational only; not medical advice."   |
+--------------------------------------------+
```

**Notes**

* **[ANALIZUJ]** is primary; Enter submits when focus in textarea.
* **[WYCZYSC]** clears textarea and results.
* No querystring; PII‑safe.

---

## S2 — Submitting (PL) — inline progress

```
+--------------------------------------------+
| Komedogennosc Pomocnik            [PL|EN]  |
| /skin/narzedzia/komedogennosc-pomocnik/    |
+--------------------------------------------+
| Wklej pelne INCI (po przecinkach).         |
| [ textarea: "Aqua, Cocos Nucifera ... IPM" ]|
|                                            |
| [ANALIZUJ ⟳]  [WYCZYSC]                     |
|                                            |
| (aria-live="polite")                        |
| Analizowanie...                             |
| [##########------------] 40%                |
+--------------------------------------------+
```

---

## S3 — Results: HIGH bucket (PL) using spec X2

```
+--------------------------------------------+
| Komedogennosc Pomocnik            [PL|EN]  |
| /skin/narzedzia/komedogennosc-pomocnik/    |
+--------------------------------------------+
| INCI                                        |
| [ Aqua, Cocos Nucifera (Coconut) Oil, ... ]|
|                                            |
| [ANALIZUJ]   [WYCZYSC]   [KOPIUJ JSON]     |
|                                            |
| WYNIK                                       |
| [ BADGE: WYSOKIE RYZYKO ]                   |
| Ocena 0–15: 9                               |
| [#########------] 9/15                      |
|                                            |
| DOPASOWANE SKLADNIKI                        |
| ─────────────────────────────────────────   |
| • Skladnik (kanon): isopropyl myristate     |
|   Ocena: 5 (0–5)                            |
|   Dopasowano z: "isopropyl myristate"       |
|   Uzyty synonim: —  | Uwagi: starter        |
| ─────────────────────────────────────────   |
| • Skladnik (kanon): coconut oil             |
|   Ocena: 4 (0–5)                            |
|   Dopasowano z: "cocos nucifera (coconut)…" |
|   Uzyty synonim: coconut oil | Uwagi: starter|
| ─────────────────────────────────────────   |
| • Skladnik (kanon): dimethicone             |
|   Ocena: 0 (0–5)                            |
|   Dopasowano z: "dimethicone"               |
|   Uzyty synonim: —  | Uwagi: starter        |
|                                            |
| EDU                                         |
| „Listy komedogennosci to wskazowki, a nie   |
| gwarancje. Reakcje sa indywidualne;         |
| wykonaj probe na skorze.”                   |
| Dodatkowo: Formulacja i stezenie maja       |
| znaczenie — unikaj zbyt ogolnych wnioskow.  |
|                                            |
| Meta: dataset_version=starter-1.0.0 | top_n=3|
+--------------------------------------------+
```

**Behavior**

* **[KOPIUJ JSON]** copies the exact API payload.
* Results region is `aria-live="polite"` and focus moves to **WYNIK** heading on success.

---

## S4 — “Copy JSON” overlay (PL)

```
+--------------------------------------------+
| [X] Kopiuj JSON (ESC zamyka)               |
|                                            |
| {                                          |
|   "matches": [                             |
|     {"name":"isopropyl myristate","score":5|
|      ,"matched_from":"isopropyl myristate",|
|      "synonym_used":null,"notes":"starter"},|
|     {"name":"coconut oil","score":4,       |
|      "matched_from":"cocos nucifera...",   |
|      "synonym_used":"coconut oil","notes":"|
|      starter"},                            |
|     {"name":"dimethicone","score":0,       |
|      "matched_from":"dimethicone","synonym_|
|      used":null,"notes":"starter"}         |
|   ],                                       |
|   "weighted_risk_score":9, "bucket":"high",|
|   "note":"Comedogenicity lists are guides…",|
|   "meta":{"dataset_version":"starter-1.0.0",|
|           "input_count":4,"match_count":3, |
|           "top_n_considered":3},           |
|   "warnings":[]                            |
| }                                          |
|                                            |
| [KOPIOWANO ✓]                               |
+--------------------------------------------+
```

---

## S5 — Results: LOW bucket (PL), no matches (spec X3)

```
+--------------------------------------------+
| Komedogennosc Pomocnik            [PL|EN]  |
+--------------------------------------------+
| [ textarea: "Aqua, Glycerin, Caprylic/..." ]|
|                                            |
| [ANALIZUJ]   [WYCZYSC]   [KOPIUJ JSON]     |
|                                            |
| [ BADGE: NISKIE RYZYKO ]                   |
| Ocena 0–15: 0                              |
| [---------------] 0/15                     |
|                                            |
| Nie znaleziono dopasowan z listy startowej.|
| „Listy komedogennosci to wskazowki...”     |
| Rada: „Nie znaleziono flagowanych skladnik-|
| ow z naszej listy startowej.”              |
|                                            |
| Meta: dataset_version=starter-1.0.0        |
+--------------------------------------------+
```

---

## S6 — Validation Error (PL): EMPTY / INVALID_INPUT

```
+--------------------------------------------+
| Komedogennosc Pomocnik            [PL|EN]  |
+--------------------------------------------+
| [ALERT ❗] Blad: INVALID_INPUT              |
| "inci_list jest wymagane"                  |
|                                            |
| [ textarea (pusta) ]                       |
| [ANALIZUJ]   [WYCZYSC]                     |
|                                            |
| Wymagania: tekst UTF‑8, max 20 000 znakow. |
+--------------------------------------------+
```

---

## S7 — Rate Limited (PL) with Retry-After

```
+--------------------------------------------+
| Komedogennosc Pomocnik            [PL|EN]  |
+--------------------------------------------+
| [ALERT ⏳] Ograniczenie ruchu (RATE_LIMITED)|
| Sprobuj ponownie za 27 s.                  |
| [PONOW PROBE]  [ZOBACZ DOK. API]           |
|                                            |
| W miedzyczasie: wklej INCI i przygotuj do  |
| analizy.                                   |
+--------------------------------------------+
```

---

## S8 — Results: MODERATE (EN), synonym match (IPP → isopropyl palmitate)

```
+--------------------------------------------+
| Comedogenicity Helper              [PL|EN]  |
| /skin/narzedzia/komedogennosc-pomocnik/    |
+--------------------------------------------+
| Paste full INCI (comma-separated).         |
| [ textarea: "Aqua, IPP, Squalane"         ] |
|                                            |
| [ANALYZE]   [CLEAR]   [COPY JSON]          |
|                                            |
| RESULT                                     |
| [ BADGE: MODERATE RISK ]                   |
| Score 0–15: 4                              |
| [####-----------] 4/15                     |
|                                            |
| MATCHED INGREDIENTS                        |
| ─────────────────────────────────────────   |
| • Ingredient (canonical): isopropyl        |
|   palmitate                                |
|   Score: 4  | Matched from: "IPP"          |
|   Synonym used: IPP | Notes: starter       |
| ─────────────────────────────────────────   |
| • Ingredient (canonical): squalane         |
|   Score: 0  | Matched from: "Squalane"     |
|   Synonym used: —  | Notes: starter        |
|                                            |
| EDU                                         |
| “Comedogenicity lists are guides, not       |
| guarantees. Individual response varies;     |
| patch test on skin.”                        |
|                                            |
| Meta: dataset_version=starter-1.0.0 | N=3  |
+--------------------------------------------+
```

---

## S9 — Config/Service Unavailable (graceful 503)

```
+--------------------------------------------+
| Komedogennosc Pomocnik            [PL|EN]  |
+--------------------------------------------+
| [ALERT ⚠] Usługa chwilowo niedostepna.     |
| Nie mozna zaladowac tabeli (CONFIG_UNAV...).|
| Zachowalismy poprzednia wersje dla bezpiec-|
| zenstwa; sprobuj ponownie pozniej.         |
| [ODSWIEZ] [STATUS /healthz]                |
+--------------------------------------------+
```

---

## Component Inventory (mobile)

```
[HEADER]
  Title + [PL|EN] toggle  | static path note
[TEXTAREA]
  label (visually hidden), placeholder, rows≈6, maxLen counter
[ACTION BAR]
  [ANALIZUJ/ANALYZE] (primary)  [WYCZYSC/CLEAR]
  [KOPIUJ JSON/COPY JSON]
[RESULTS REGION] (aria-live="polite", tabindex=-1)
  [BADGE: LOW|MODERATE|HIGH]
  Score meter [###############] n/15
  Matched list (stacked rows; accessible table semantics)
[ALERT]
  Banner for errors (role="alert")
[FOOTER]
  Disclaimer: “Informational only; not medical advice.”
  Dataset version + link to API docs (optional)
```

---

## Focus & A11y (quick notes)

* On submit, move focus to **RESULTS** header; region uses `aria-live="polite"`.
* Buttons have visible focus; everything reachable via Tab/Shift+Tab.
* Language toggle updates UI strings; **path stays Polish** as required.
* Screen reader labels:

  * Score bar: `role="img"` + `aria-label="Risk score 9 of 15 (High)"`
  * Badge: `aria-label="High risk"`
  * Alerts: `role="alert"`

---

### How this maps to the spec

* **U (UI/UX):** textarea, Analyze/Clear, badge, score bar, matched table, educational note, Copy JSON — all shown.
* **F/K:** scoring displayed as 0–15; bucket Low/Moderate/High; duplicates implied once per canonical row.
* **T:** core notes in PL/EN; extra caution message for **High**; reassurance for **No matches**.
* **I/J:** input shape and output JSON reflected; copy payload mirrors **X2**.
* **E/R:** error banners for `INVALID_INPUT`, `RATE_LIMITED`, `CONFIG_UNAVAILABLE`.
* **V:** dataset version surfaced in Meta.

If you want these turned into real HTML/CSS components next, I can translate each screen 1:1 into semantic markup with a minimal, responsive stylesheet.
