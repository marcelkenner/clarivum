> **Canonical decisions:** `docs/adr/ADR-022-tools-and-calculators-platform.md` handles the runtime; visual system per `docs/adr/ADR-018-brand-design-system.md`.

Below are **mobile‑first ASCII wireframes** for **`/skin/narzedzia/pilling-check` — Pilling Risk Estimator**, aligned with the spec. Each screen fits a ~**360–400 px** mobile viewport and shows primary states, validation, explain, and export.

---

### Legend (UI tokens used in all screens)

* **[ ]** unchecked / **[x]** checked toggle
* **( )** radio / **(•)** selected radio
* **▸ / ▾** collapsed / expanded section
* **● CHIP** = contributor chip
* **[Btn]** button (primary actions use **[▶ Estimate risk]**)
* Counters like **Tokens: 23** update in realtime
* Accessibility: each input line has implicit `aria-label` noted in `[]`

---

## Screen 1 — Landing & Routine Builder (empty state)

```
┌──────────────────────────────────────────────┐
│ Pilling Check                                │
│ ──────────────────────────────────────────── │
│ What’s your routine?                         │
│                                              │
│ Steps                                        │
│ [Add step ▸]                                 │
│                                              │
│ Layering behavior                            │
│ Steps count: 0 (auto)  [✎ Override]          │
│ Wait between steps [  60s ]  (slider)        │
│ Silicone primer        [ ] Yes               │
│ Rub in vigorously      [ ] Yes               │
│                                              │
│ ──────────────────────────────────────────── │
│ [▶ Estimate risk]         [More ▸]           │
└──────────────────────────────────────────────┘
```

Notes:

* **Estimate** disabled until ≥1 step.
* **More ▸** opens help/FAQ.

---

## Screen 2 — Add/Edit Step (inline card)

```
┌──────────────────────────────────────────────┐
│ Pilling Check                                │
│ Steps                                        │
│ ┌──────────────── Step #1 ─────────────────┐ │
│ | [Step type ▼] [Serum]                    | │
│ | [INCI list (comma‑separated)]            | │
│ | Water, Dimethicone, VP/VA Copolymer,     | │
│ | Glycerin                                 | │
│ |                                          | │
│ | Tokens: 4    Top‑5 visible: Yes          | │
│ | [Delete]                          [✓ OK] | │
│ └──────────────────────────────────────────┘ │
│ [ + Add step ]                               │
│                                              │
│ Layering behavior                            │
│ Steps count: 1 (auto)  [✎ Override]          │
│ Wait between steps [  30s ]  (slider)        │
│ Silicone primer        [x] Yes               │
│ Rub in vigorously      [x] Yes               │
│                                              │
│ Validation                                   │
│ ✓ JSON‑safe  ✓ No HTML  ✓ Length OK          │
│                                              │
│ [▶ Estimate risk]         [More ▸]           │
└──────────────────────────────────────────────┘
```

Notes:

* **Tokens** and **Top‑5** aid §E “order significance”.
* Delete uses confirm on tap (see Screen 11).

---

## Screen 3 — Routine Builder (3 steps; realtime validation)

```
┌──────────────────────────────────────────────┐
│ Pilling Check                                │
│ Steps (3)                                    │
│ ┌──── #1 Serum ────────────────────────────┐ │
│ | INCI: Water, Dimethicone, VP/VA Copolymer| │
│ | Tokens: 4  Top‑5: Yes                    | │
│ └──────────────────────────────────────────┘ │
│ ┌──── #2 Moisturizer ──────────────────────┐ │
│ | INCI: Water, Acrylates/C10-30..., Carbomer|│
│ | Tokens: 3  Top‑5: Yes (mineral? No)      | │
│ └──────────────────────────────────────────┘ │
│ ┌──── #3 Sunscreen ────────────────────────┐ │
│ | INCI: Water, Zinc Oxide, Cyclopentasilox.| │
│ | Tokens: 3  Top‑5: ZnO @ index 1          | │
│ | Detected as: SUNSCREEN (UV filters present)|│
│ └──────────────────────────────────────────┘ │
│ [+ Add step]                                 │
│                                              │
│ Layering behavior                            │
│ Steps count: 3 (auto)   [✎ Override]         │
│ Wait between steps [  30s ] (slider)         │
│ Silicone primer        [x] Yes               │
│ Rub in vigorously      [x] Yes               │
│                                              │
│ Validation                                   │
│ ✓ Count matches steps                        │
│ ✓ No scripts    ✓ Tokens/step ≤ 200          │
│                                              │
│ [▶ Estimate risk]         [More ▸]           │
└──────────────────────────────────────────────┘
```

---

## Screen 4 — Semantic Error (400) inline banner

```
┌──────────────────────────────────────────────┐
│ Pilling Check                                │
│ ✕ Error                                      │
│ layering.num_steps (5) ≠ steps entered (3).  │
│ Fix: Set Steps count to 3 or add 2 steps.    │
│ [Set to 3]  [Add step]  [Details ▾]          │
│                                              │
│ Details: code=MISMATCH_WITH_STEPS            │
│ path=/layering/num_steps expected=3 actual=5 │
└──────────────────────────────────────────────┘
```

* Mirrors RFC7807 semantics for clarity.

---

## Screen 5 — Results (High risk sample from §J)

```
┌──────────────────────────────────────────────┐
│ Result                                       │
│ ┌──────────────────────────────────────────┐ │
│ | BUCKET: [■■■ HIGH]   SCORE: 13           | │
│ |                                          | │
│ | Contributors                              | │
│ | ● multiple film‑formers                   | │
│ | ● mineral UV filters top‑5                | │
│ | ● short wait times                        | │
│ | ● silicone primer + silicone sunscreen    | │
│ | ● vigorous rubbing                        | │
│ |                                          | │
│ | Tips                                      | │
│ | • Wait 60–90s between steps               | │
│ | • Pat on sunscreen                        | │
│ | • Consider lighter moisturizer            | │
│ | • Reduce number of layers                 | │
│ └──────────────────────────────────────────┘ │
│ [▾ Show details]  [Copy JSON]  [Export ▼]    │
│ [New check]                                   │
└──────────────────────────────────────────────┘
```

Notes:

* Chips order: ingredient factors first, then behavior (§Y).

---

## Screen 6 — Details / Explain (expanded drawer)

```
┌──────────────────────────────────────────────┐
│ Details                                      │
│ Factors (value)                              │
│ • FILM_FORMERS (+6) cap:Yes groups:          │
│   silicones, acrylates, vp/va                │
│ • MINERAL_TOP5 (+2) steps: sunscreen         │
│ • SHORT_WAIT (+2) wait_seconds: 30           │
│ • SILICONE_STACK (+2) primer:Yes, sunscreen: │
│   silicone‑heavy: Yes                        │
│ • RUB_STYLE (+1) rubbing: Yes                │
│                                              │
│ Ingredient matches                           │
│ silicones: dimethicone, cyclopentasiloxane,  │
│            trimethylsiloxysilicate           │
│ acrylates: Acrylates/C10‑30...               │
│ vp/va: VP/VA Copolymer                       │
│ polyquats: —                                 │
│ mineral positions: sunscreen → Zinc Oxide(2) │
│ warnings: —                                  │
│                                              │
│ Model: v1.0.0   Locale: en                   │
│ [Hide details ▴]                              │
└──────────────────────────────────────────────┘
```

---

## Screen 7 — Results (Low risk sample from §J)

```
┌──────────────────────────────────────────────┐
│ Result                                       │
│ ┌──────────────────────────────────────────┐ │
│ | BUCKET: [• LOW]   SCORE: 0               | │
│ | Contributors: —                           | │
│ | Tips: —                                   | │
│ └──────────────────────────────────────────┘ │
│ [New check]                                   │
└──────────────────────────────────────────────┘
```

---

## Screen 8 — Export / Copy actions

```
┌──────────────────────────────────────────────┐
│ Export                                       │
│ (•) Copy JSON to clipboard                   │
│ ( ) Save as TXT                              │
│ ( ) Save as CSV                              │
│                                              │
│ File name: pilling-check-2025-10-27          │
│ [Export]  [Cancel]                            │
└──────────────────────────────────────────────┘
```

* JSON mirrors base or explain payload depending on toggle.

---

## Screen 9 — More / Help / Settings (i18n + a11y)

```
┌──────────────────────────────────────────────┐
│ More                                         │
│ Locale: [en ▼]  (fallback to en if missing)  │
│ Accessibility: WCAG 2.1 AA compliant         │
│ • All inputs keyboard focusable              │
│ • Buttons have aria‑labels                   │
│ • Chips read as "Contributor: ..."           │
│                                              │
│ Data & Privacy                               │
│ • No INCI stored by default                  │
│ • X‑Request‑ID echoed in responses           │
│                                              │
│ [Back]                                        │
└──────────────────────────────────────────────┘
```

---

## Screen 10 — 429 / Rate limit

```
┌──────────────────────────────────────────────┐
│ Too many requests                            │
│ You’ve hit the limit. Please try again later.│
│ Retry‑After: 60s                             │
│ [OK]                                          │
└──────────────────────────────────────────────┘
```

---

## Screen 11 — Delete step confirm

```
┌──────────────────────────────────────────────┐
│ Remove step #2?                              │
│ This won’t affect other steps.               │
│ [Cancel]                  [Delete step]      │
└──────────────────────────────────────────────┘
```

---

## Screen 12 — HTML sanitization / invalid content

```
┌──────────────────────────────────────────────┐
│ INCI contains HTML tags.                     │
│ <script> is not allowed.                     │
│ Code: INVALID_CONTENT                        │
│ [Clear INCI]                 [Got it]        │
└──────────────────────────────────────────────┘
```

---

## Screen 13 — Token cap hint (soft limit, warn @ 200)

```
┌──────────────────────────────────────────────┐
│ Heads‑up                                     │
│ This step lists 214 tokens.                   │
│ We’ll parse first 200 for scoring (§F).       │
│ [Trim to 200]             [Continue]         │
└──────────────────────────────────────────────┘
```

---

### Interaction Notes (concise, mapped to spec)

* **Realtime validation** under the builder reflects §V and shows:

  * step count match, no HTML, tokens per step ≤ 200, etc.
* **Sunscreen detection** line appears on any step meeting §E.4.
* **Silicone‑heavy** is not a manual toggle; it appears in Explain per §E.5.
* **Order significance**: a **Top‑5** badge per step is shown only when `strict_inci_order=true`.
* **Tips** generated from mapping in §M; **max 5**, deduped.
* **Explain** contains: factors (+values), matched tokens, mineral indices, warnings, and `model_version` when expanded.
* **i18n**: The **bucket label**, **contributors**, and **tips** strings are localized; keys map in code.

If you’d like, I can adapt these wireframes to your brand’s typography (e.g., icons/labels) or produce a **single printable page** that product and engineering can annotate.
