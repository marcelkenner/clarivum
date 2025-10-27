> **Canonical decisions:** `docs/adr/ADR-022-tools-and-calculators-platform.md` for logic and data plumbing; UI surfaces align with `docs/adr/ADR-018-brand-design-system.md`.

Below are **mobile‑first ASCII wireframes** for the **Exfoliation Frequency Planner**. They’re sized for a narrow phone viewport and annotated so engineering can lift labels, ARIA roles, and event hooks directly.

---

## Legend (UI tokens)

```
[ ] unchecked   [x] checked          ( ) radio    (•) selected radio
⟦Label⟧ selected segment             [ Label ] button / chip
ⓘ info / tooltip                     ⚠ warning   ⏳ loading   ✅ success
⌄ expand (closed)                    ⌃ collapse (open)
```

---

## A1) Planner — Landing (EN, empty state)

```
┌──────────────── Exfoliation Planner ───────────────┐
│ ← Back                                   EN | PL   │
├────────────────────────────────────────────────────┤
│ [H1] Plan exfoliation safely                        │
│ This tool suggests how many nights per week and     │
│ a simple 7‑day layout for AHA/BHA.                  │
│                                                     │
│ Skin type (radio)                                   │
│  ( ) Dry                                            │
│  ( ) Normal                                         │
│  ( ) Combo                                          │
│  ( ) Oily                                           │
│                                                     │
│ Your concerns (checkboxes) ⓘ                        │
│  [ ] Acne     [ ] Blackheads                        │
│  [ ] PIH (dark spots)                               │
│  [ ] Dullness  [ ] Texture                          │
│  [ ] Sensitivity  [ ] Rosacea                       │
│                                                     │
│ Retinoid use (segmented)                            │
│  ⟦ None ⟧  [ New ]  [ Tolerant ]                    │
│                                                     │
│ Other actives (toggles)                             │
│  Vitamin C (acidic)   [ OFF ]  ⓘ                    │
│  Azelaic acid         [ OFF ]  ⓘ                    │
│                                                     │
│ Preferred exfoliant (radio)                         │
│  ( ) AHA   ( ) BHA   (•) Either                     │
│                                                     │
│ Sensitivity level (radio)                           │
│  (•) Low   ( ) Medium   ( ) High                    │
│                                                     │
│                   [ Generate plan → ]               │
│                                                     │
│ ──────────────────────────────────────────────────  │
│ “This tool provides general skincare guidance and   │
│  is not medical advice.”                            │
└────────────────────────────────────────────────────┘
```

**Notes**

* **Tap targets**: each control row ≥ 2 text lines tall (≥44px).
* **ARIA**: field groups use `role="group"` with `aria-labelledby` to section labels.
* **Event**: `click` Generate → POST `/api/skin/planer-eksfoliacji/v1/compute`.

---

## A2) Planner — Tooltip (bottom sheet)

```
┌──────────────── Info ───────────────────────────────┐
│ PIH (post‑inflammatory hyperpigmentation)           │
│ AHA often helps with tone/texture; start low freq.  │
│                                                     │
│                                      [ Got it ]     │
└────────────────────────────────────────────────────┘
```

---

## A3) Planner — Validation error (inline + toast)

```
┌──────────────── Exfoliation Planner ───────────────┐
│ ← Back                                   EN | PL   │
├────────────────────────────────────────────────────┤
│ ⚠ Please fix 1 error.                              │
│                                                     │
│ Skin type (radio)                                   │
│  ( ) Dry  ( ) Normal  ( ) Combo  ( ) Oily           │
│   ↑ Required                                        │
│                                                     │
│ … (rest of form) …                                  │
│                   [ Generate plan → ]               │
└────────────────────────────────────────────────────┘

[Toast] ⚠ VALIDATION_ERROR • field: skin_type • “Unsupported or missing value.”
```

---

## B1) Compute — Loading (skeleton)

```
┌──────────────── Generating plan… ───────────────────┐
│ ⏳ Calculating safe frequency and layout…            │
│ [▓▓▓░░░]                                            │
└────────────────────────────────────────────────────┘
```

---

## C1) Results — Summary card (matches **X1** in spec)

```
┌──────────────── Your plan (Free) ───────────────────┐
│  2× per week   •   [ AHA ]                          │
│                                                     │
│ Week (Mon→Sun) — role="list"                        │
│  Mon  [ Retinoid ]                                  │
│  Tue  [ Hydrate ]                                   │
│  Wed  [ AHA ]                                       │
│  Thu  [ Hydrate ]                                   │
│  Fri  [ Retinoid ]                                  │
│  Sat  [ Hydrate ]                                   │
│  Sun  [ AHA ]                                       │
│                                                     │
│ Actions: [ Copy plan ] [ Share ]                    │
│                                                     │
│ Safety notes  ⌄                                     │
│ Why this plan ⌄                                     │
│                                                     │
│ “We keep exfoliation off the day before and after   │
│  retinoids to reduce irritation.”                   │
└────────────────────────────────────────────────────┘
```

**Telemetry example (fire on render):**

```
{ "event":"plan_generated","skin_type":"normal","retinoid":"tolerant",
  "total":2,"type":"AHA","had_warning":false }
```

---

## C2) Results — “Why this plan” expanded

```
┌──────────────── Why this plan ⌃ ────────────────────┐
│ Base from skin type: 2 (Normal)                     │
│ Concern adjustments:                                │
│  • AHA bonus: +1 (PIH)                              │
│  • BHA bonus: +0                                    │
│  • Sensitivity penalty: −0                          │
│ Preliminary total (clamped 0..4): 3                 │
│ Caps:                                               │
│  • Retinoid cap: 3 (tolerant)                       │
│  • Sensitivity cap: 4 (low)                         │
│  • Global cap: 4                                    │
│ Final requested: 3 → Placed safely: 2               │
│ Conflicts resolved:                                  │
│  • Reduced from 3→2 due to adjacency with Mon/Fri   │
│    retinoid placeholders.                           │
│ Notes: —                                            │
└────────────────────────────────────────────────────┘
```

---

## C3) Results — “Safety notes” expanded

```
┌─────────────── Safety notes ⌃ ──────────────────────┐
│ • Avoid stacking acids + retinoid on the same night.│
│ • In Free plan, never stack AHA & BHA the same night│
│ • If using Vitamin C (acidic): use AM on non‑exfo   │
│   days.                                             │
│ • If using Azelaic acid: prefer Hydrate nights.     │
└────────────────────────────────────────────────────┘
```

---

## D1) Results — High‑risk combo (rosacea + acne, new retinoid)

```
┌──────────────── Your plan (Free) ───────────────────┐
│  1× per week   •   [ BHA ]                          │
│                                                     │
│ ⚠ Caution: Rosacea + acne present. Limit BHA to     │
│   1×/week and monitor irritation.                   │
│                                                     │
│ Week (Mon→Sun)                                      │
│  Mon  [ Retinoid ]                                  │
│  Tue  [ Hydrate ]                                   │
│  Wed  [ BHA ]                                       │
│  Thu  [ Hydrate ]                                   │
│  Fri  [ Hydrate ]                                   │
│  Sat  [ Hydrate ]                                   │
│  Sun  [ Hydrate ]                                   │
│                                                     │
│ Safety notes  ⌄   Why this plan ⌄                   │
└────────────────────────────────────────────────────┘
```

---

## D2) Results — “Not enough candidate days” banner (Pro upsell hook)

```
┌──────────────── Placement reduced ──────────────────┐
│ We scheduled fewer sessions to avoid nights next to │
│ retinoids. Pro lets you adjust retinoid nights and  │
│ alternate AHA/BHA gently. [ Learn more ]            │
└────────────────────────────────────────────────────┘
```

---

## E1) Copy / Share — Toast

```
[Toast] ✅ Plan copied to clipboard (Mon…Sun).
```

---

## F1) Planner — Polish locale (PL) + A11y text

```
┌────────────── Planer Eksfoliacji (PL) ──────────────┐
│ ← Wstecz                                 EN | PL    │
├────────────────────────────────────────────────────┤
│ Typ cery                                        ⓘ  │
│  ( ) Sucha  ( ) Normalna  ( ) Mieszana  ( ) Tłusta  │
│ Twoje problemy                                   ⓘ │
│  [ ] Trądzik  [ ] Zaskórniki  [ ] Przebarwienia    │
│  [ ] Szarość  [ ] Tekstura  [ ] Wrażliwość [ ]     │
│      Trądzik różowaty                              │
│ Retinoidy:  ⟦ Brak ⟧  [ Nowy ]  [ Tolerancja ]     │
│ Inne składniki:                                    │
│  Witamina C (kwaśna) [ WYŁ ]   Kwas azelainowy [WYŁ]│
│ Preferowany eksfoliant: ( ) AHA  ( ) BHA  (•) Dowolny│
│ Poziom wrażliwości: (•) Niski  ( ) Średni  ( ) Wysoki│
│                                                     │
│                [ Generuj plan → ]                   │
│                                                     │
│ „Unikamy złuszczania dzień przed i po retinoidach,  │
│  aby zmniejszyć podrażnienia.”                      │
└────────────────────────────────────────────────────┘

A11y notes (PL/EN): Week container uses role="list",
each day role="listitem"; chips have aria-label e.g.
"Środa: AHA" / "Wednesday: AHA".
```

---

## G) Empty / Offline / Retry

```
┌──────────────── Network issue ──────────────────────┐
│ Couldn’t reach the compute service.                 │
│ [ Retry ]   [ Save inputs & try later ]             │
└────────────────────────────────────────────────────┘
```

---

# Component inventory (mobile)

**Form controls**

* Radios (vertical), Checkboxes (multi‑line), Segmented (3), Toggles (ON/OFF).
* Info tooltips use a bottom sheet (A2).

**Result components**

* Summary header (big frequency + chip).
* Week list (linear Mon→Sun; chips: Retinoid / AHA / BHA / Hydrate).
* Accordions: *Safety notes*, *Why this plan*.
* Copy / Share actions + toast.
* Conditional banners: caution (D1), placement reduced (D2).

**Accessibility**

* All group sections: `role="group"`, labelled by visible headings.
* Week: `role="list"`, days: `role="listitem"`.
* Chips include text + icon (ASCII) so status isn’t color‑dependent.
* Focus outlines preserved; all tap targets ≥44×44.
* EN/PL strings come from i18n keys (see spec I).

---

# API wiring (from UI)

* **GET** `/skin/narzedzia/planer-eksfoliacji/` → renders A1.
* **POST** `/api/skin/planer-eksfoliacji/v1/compute`

  * Body mirrors inputs from A1.
  * On success → render C1/C2/C3 or D1; hydrate accordions from `explanations`, `rules`, `warnings`.
  * Always degrade gracefully to 200 per v1 spec.

**Validation surfacing**

* Client‑side sanity (required + enum).
* Server messages (E) mapped to inline errors + toast, as in A3.

---

## Sample filled form (X1 request) → tap “Generate”

```
Skin type: ( ) Dry (•) Normal ( ) Combo ( ) Oily
Concerns:  [x] PIH
Retinoid:  [ None ] [ New ] ⟦ Tolerant ⟧
Other:     Vitamin C [ OFF ]  Azelaic [ OFF ]
Pref:      ( ) AHA  ( ) BHA  (•) Either
Sens:      (•) Low  ( ) Medium  ( ) High
→ Returns screen C1 exactly as shown.
```

---

### Notes for handoff

* Keep all constants (base, caps, placeholder days) in `config/planner.json`.
* Ensure **linear adjacency** (no Sun↔Mon wrap).
* Chips’ tokens must be one of: `"Retinoid" | "AHA" | "BHA" | "Hydrate"`.
* Fire analytics per **K** on successful compute.
* Strings used above are placeholders; replace with i18n keys.

If you’d like, I can adapt these ASCII screens into a low‑fi clickable HTML prototype next.
