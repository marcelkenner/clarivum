> **Canonical decisions:** `docs/adr/ADR-022-tools-and-calculators-platform.md` governs the tooling plumbing; reuse surfaces from `docs/adr/ADR-018-brand-design-system.md`.

Below are **mobile‑first ASCII wireframes** for **/skin/narzedzia/budzet‑rutyny/** (Routine Budget Calculator). They reflect the A–Z spec you provided, emphasize **stacked cards** on small screens (table semantics under the hood), and demonstrate all key states: empty, canonical example, validation, zero‑usage, advanced month model, import/export, share link, and EN locale preview.

**Legend (ASCII UI cues)**

* `[?]` tooltip `[i]` inline help `[⋮]` more `[≡]` drag handle / reorder
* `▲/▼` stepper `⤿` duplicate `✖` delete `⎘` copy
* `···` collapsible/summary `[PL ▾]` language select `[zł]` currency symbol (display only)
* `—` muted/disabled text `!!` error text `⚐` note

---

## MF‑0 — First load / empty state (PL default)

```
┌────────────────────────────────────────────┐
│ Budżet rutyny                              │
│ ─ Routine Budget                            │
│ ------------------------------------------ │
│ ⚐ Szacunki zakładają regularne użycie.     │
│                                            │
│ [PL ▾]    [zł]    ··· Ustawienia           │
│                                            │
│ [ + Dodaj produkt ]                        │
│                                            │
│ ───── Brak pozycji ─────                    │
│ Dodaj pierwszy produkt, aby zacząć liczyć. │
│                                            │
│ WYNIKI                                     │
│  Miesięcznie: —                            │
│  Notatki:                                  │
│   • Estimates assume consistent use.       │
│                                            │
│ [ Import/Export JSON ]   [ Kopiuj link ]   │
│                                            │
│ (aria-live="polite") Totals updated.       │
└────────────────────────────────────────────┘
```

* *Layout:* stacked controls; no table grid on small viewports.
* *Semantics:* Under the hood, products render as `<table>` rows; on mobile they appear as cards.

---

## MF‑1 — Add product (card editor; table-on-mobile)

```
┌────────────────────────────────────────────┐
│ + Produkt                                  │
│ [≡]  Nazwa                                 │
│      [_____________________________]       │
│                                            │
│  Cena [zł]     Pojemność [ml]              │
│  [__________]  [__________]                │
│  !! liczba ≥ 0 (2 miejsca po przecinku)    │
│                                            │
│  Porcja [ml/ użycie]  Użycia/dzień         │
│  [__________]          [__▲▼]              │
│  Dni/tydzień [0–7]     [__▲▼]              │
│  [?] Dni/tydzień: ile dni w tygodniu używasz│
│                                            │
│  Obliczenia (na żywo)                      │
│   • Miesiące do wykorzystania: —           │
│   • Miesięczny koszt: —                    │
│   • Koszt za użycie: —                     │
│   • ml / miesiąc: —                        │
│  — Niewystarczające dane (pozycja wyłączona│
│    z sum).                                 │
│                                            │
│ [⤿ Duplikuj]    [✖ Usuń]                   │
└────────────────────────────────────────────┘
```

* **Row‑level validation** appears under the field; grey/muted computed block when insufficient.

---

## MF‑2 — Canonical example filled (matches Section G.6)

Two product cards entered; totals reflect **30/7** model.

```
┌────────────────────────────────────────────┐
│ Budżet rutyny                              │
│ ⚐ Szacunki zakładają regularne użycie.     │
│ [PL ▾]  [zł]   ··· Ustawienia              │
│                                            │
│ ▒▒▒ Produkt 1 — Gentle Cleanser ▒▒▒        │
│ [≡]  Nazwa: Gentle Cleanser                │
│  Cena [zł]: 14,99      Pojemność [ml]: 200 │
│  Porcja [ml]: 2,00     Użycia/dzień: 2     │
│  Dni/tydzień: 7                             │
│  Wyniki:                                    │
│   • Miesiące do wykorzystania: 1,67         │
│   • Miesięczny koszt: 8,99 zł               │
│   • Koszt za użycie: 0,15 zł                │
│   • ml / miesiąc: 120 ml                    │
│  [⤿ Duplikuj]   [✖ Usuń]                    │
│                                            │
│ ▒▒▒ Produkt 2 — Serum ▒▒▒                  │
│ [≡]  Nazwa: Serum                          │
│  Cena [zł]: 29,00      Pojemność [ml]: 30  │
│  Porcja [ml]: 0,33     Użycia/dzień: 1     │
│  Dni/tydzień: 5                             │
│  Wyniki:                                    │
│   • Miesiące do wykorzystania: 4,24         │
│   • Miesięczny koszt: 6,84 zł               │
│   • Koszt za użycie: 0,32 zł                │
│   • ml / miesiąc: 7,07 ml                   │
│  [⤿ Duplikuj]   [✖ Usuń]                    │
│                                            │
│ WYNIKI                                      │
│  Miesięcznie (suma): 15,83 zł               │
│  Notatki:                                   │
│   • Estimates assume consistent use.        │
│                                            │
│ [ Import/Export JSON ]   [ Kopiuj link ]   │
│                                            │
│ (aria-live="polite") Totals updated: 15,83 │
└────────────────────────────────────────────┘
```

* **Rounding & formatting:** Polish locale, 2 decimals; integer ml prints without decimals (e.g., *120 ml*).

---

## MF‑3 — Insufficient data + inline errors

```
┌────────────────────────────────────────────┐
│ ▒▒▒ Produkt 3 — Tonik (niewystarczające) ▒▒│
│ [≡] Nazwa: Tonik                           │
│  Cena [zł]: 39,90      Pojemność [ml]: —   │
│  !! Wymagane. Podaj pojemność > 0.         │
│  Porcja [ml]: 1,00     Użycia/dzień: 1     │
│  Dni/tydzień: 7                             │
│  — Niewystarczające dane (wyłączono z sum).│
│  Wyniki:                                    │
│   • Miesiące do wykorzystania: —            │
│   • Miesięczny koszt: —                     │
│   • Koszt za użycie: —                      │
│   • ml / miesiąc: 30,00 ml                  │
│ [⤿ Duplikuj]  [✖ Usuń]                      │
│                                            │
│ WYNIKI  Miesięcznie: 15,83 zł (bez Toniku) │
└────────────────────────────────────────────┘
```

* Row greyed/blended with **label “Niewystarczające dane (wyłączono z sum)”**.

---

## MF‑4 — Zero usage state (infinite months)

```
┌────────────────────────────────────────────┐
│ ▒▒▒ Produkt 4 — SPF ▒▒▒                    │
│  Cena [zł]: 55,00     Pojemność [ml]: 50   │
│  Porcja [ml]: 1,00     Użycia/dzień: 1     │
│  Dni/tydzień: 0 ▲▼                          │
│  Wyniki:                                    │
│   • Miesiące do wykorzystania: ∞            │
│   • Miesięczny koszt: 0,00 zł               │
│   • Koszt za użycie: 1,10 zł                │
│   • ml / miesiąc: 0 ml                      │
│  — Zero użycia: pozycja pokazana, koszt=0;  │
│    wyłączona z sumy.                        │
│ [⤿ Duplikuj] [✖ Usuń]                       │
│                                            │
│ WYNIKI  Miesięcznie: 15,83 zł               │
└────────────────────────────────────────────┘
```

* `∞` months, cost/month `0,00 zł`, excluded from totals, but still displayed.

---

## MF‑5 — Advanced: Month model selector (collapsed by default)

```
┌────────────────────────────────────────────┐
│ ··· Ustawienia                              │
│  Waluta (symbol, tylko wygląd): [zł] [?]   │
│  Język: [PL ▾]                              │
│  Model miesiąca: [ 30 dni (30/7) • ]        │
│                   (365/12)/7 (≈4,3482) ○    │
│   [?] Obliczenia używają tygodni/miesiąc.   │
│       Zmiana wpływa na wszystkie pozycje.   │
│ [ Zastosuj ]                                │
└────────────────────────────────────────────┘
```

* Default **30/7** selected; switching recalculates immediately.

---

## MF‑6 — Import / Export JSON (sheet)

```
┌────────────────────────────────────────────┐
│ Import/Export JSON                         │
│                                            │
│ [ Import ]  Wklej JSON wejściowy:          │
│ ┌────────────────────────────────────────┐ │
│ │ { "products":[{ "name":"Gentle ..."}], │ │
│ │   "config":{ "month_model":"30_day"} } │ │
│ └────────────────────────────────────────┘ │
│ [ Waliduj i załaduj ]                      │
│  !! 422: Pole size_ml musi być > 0 (w #2)  │
│                                            │
│ [ Export ]  Bieżący stan (tylko do odczytu)│
│ ┌────────────────────────────────────────┐ │
│ │ { "items":[ ... ], "totals":{ ... } } │ │
│ └────────────────────────────────────────┘ │
│ [ Zamknij ]                                │
└────────────────────────────────────────────┘
```

* Shows **422 validation** summary inline; export is **read‑only**.

---

## MF‑7 — Shareable link confirmation (URL state)

```
┌────────────────────────────────────────────┐
│ [ Kopiuj link ] → ✓ Skopiowano do schowka  │
│  Link: /skin/narzedzia/budzet-rutyny/?s=…  │
│  — Długi? Użyj krótkiego ID (zapisywanie). │
└────────────────────────────────────────────┘
```

* If payload too long, the UI can choose **Option B** (short‑ID) transparently.

---

## MF‑8 — Reorder / duplicate affordances

```
┌────────────────────────────────────────────┐
│ [≡] Gentle Cleanser   [⤿] [✖]              │
│ [≡] Serum             [⤿] [✖]              │
│ Drag to reorder. Totals update instantly.  │
└────────────────────────────────────────────┘
```

* Keyboard: focus `[≡]` → use ↑/↓ to reorder (announce change).

---

## MF‑9 — EN locale preview (formatting + strings)

```
┌────────────────────────────────────────────┐
│ Routine Budget                             │
│ ⚐ Estimates assume consistent use.         │
│ [EN ▾]  [€]  ··· Settings                  │
│                                            │
│ Product — Gentle Cleanser                  │
│  Price [€]: 14.99  Size [ml]: 200          │
│  Dose [ml]: 2.00  Uses/day: 2  Days/wk: 7  │
│  Results:                                  │
│   • Months to empty: 1.67                  │
│   • Cost per month: €8.99                  │
│   • Cost per use: €0.15                    │
│   • ml per month: 120 ml                   │
│                                            │
│ TOTALS  Monthly: €15.83                    │
│ Notes: Estimates assume consistent use.    │
└────────────────────────────────────────────┘
```

---

# Micro‑spec (what engineers & QA need from these screens)

**1) Fields & defaults (per card)**

* `price ≥ 0`, `size_ml ≥ 0`, `ml_per_use ≥ 0`, `uses_per_day ≥ 0`, `days_per_week ∈ [0..7]`
* Defaults: `uses_per_day=1`, `days_per_week=7`, `month_model="30_day"`, currency symbol from locale (PL→`zł`)

**2) Calculation display (per card)**

* Show computed block once user has typed any of the fields;
* When *insufficient* (`price≤0` OR `size_ml≤0` OR `ml_per_use≤0`):

  * grey/muted the computed block, label **“Niewystarczające dane (wyłączono z sum)”**
  * `months_to_empty=null`, `cost_per_use=null`, `cost_per_month` not added to totals
* When *zero usage* (`uses_per_day=0` OR `days_per_week=0`):

  * show `∞`, `cost_per_month=0,00`, note **Zero użycia**; exclude from totals

**3) Formatting**

* Money: localized, **2 decimals, half‑up** (PL: `8,99 zł`)
* Volumes: **2 decimals**; if integer after rounding, show no decimals (e.g., `120 ml`)
* `months_to_empty`: **2 decimals**
* **Totals**: sum unrounded per‑item, then round at end

**4) Accessibility**

* **ARIA live (polite)** line updates with “Totals updated: {value}”
* Each card forms a **row** semantically (`<tr>` via accessible role); headers via `<th scope="row">`
* Inputs navigable by keyboard; reorder via keyboard on the `[≡]` handle

**5) Controls**

* **Currency symbol** (display only; does not convert values)
* **Month model**: default 30/7; optional `(365/12)/7`
* **Import/Export JSON**, **Copy shareable link** (URL state)
* **Duplicate/Delete/Reorder** per card

**6) Canonical fixture (QA)**

* Exactly as in **MF‑2**; expect totals: **15,83 zł** (PL) with the per‑item values shown.

---

### Optional: Compact list mode (very small phones ≤320px)

Collapse inputs into single‑column; computed lines become a 4‑row mini table:

```
┌─ Wyniki ─────────────────────┐
│ Miesiące: 1,67               │
│ Koszt/mies.: 8,99 zł         │
│ Koszt/użycie: 0,15 zł        │
│ ml/mies.: 120                │
└──────────────────────────────┘
```

---

If you’d like, I can also provide a **desktop/tablet ASCII** variant (true grid table with column headers) that maps 1:1 to these mobile cards.
