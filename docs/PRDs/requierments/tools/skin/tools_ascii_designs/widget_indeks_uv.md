> **Canonical decisions:** `docs/adr/ADR-022-tools-and-calculators-platform.md` supplies APIs/state; visual hierarchy comes from `docs/adr/ADR-018-brand-design-system.md`.

Below are **mobile‑first ASCII wireframes** for the Clarivum **Widżet Indeksu UV**.
They are sized for ~360–400 px mobile viewports and cover the core states required by the spec.

---

### Legend & tokens

* `{{…}}` → dynamic value bound to API / CMS (Strapi `tools.uv-widget`).
* Risk badge color codes (WHO mapping): `[GRN]=low (0–2)`, `[YEL]=moderate (3–5)`, `[ORG]=high (6–7)`, `[RED]=very_high (8–10)`, `[PUR]=extreme (11+)`.
* `aria-*` notes show accessibility affordances (not rendered).
* Analytics (not rendered): events noted as `⟶ event:name`.

---

## 0) Top‑level app header (shared)

```
┌──────────────────────────────────────────────┐
│  Clarivum                                  PL│  ← Lang toggle (PL/EN)
└──────────────────────────────────────────────┘
```

---

## 1) First visit — location consent sheet

```
╭──────────────────────────────────────────────╮
│ 🌐  Użyj lokalizacji, aby pokazać UV w pobliżu? │
│                                              │
│  • Nie zapisujemy dokładnych współrzędnych.  │
│  • Zawsze możesz zmienić miasto ręcznie.     │
│                                              │
│  [Zezwól]      [Nie teraz]                   │
│   ⟶ uv_location_consent=true/false           │
│  Więcej o prywatności ›                      │
╰──────────────────────────────────────────────╯
```

* Timeout 5 s; on error/deny continues to Fallback (screen 3B).
* `aria-modal="true"`, focus trapped; first focus on `[Zezwól]`.

---

## 2) Loading skeleton (first paint / refresh)

```
┌──────────────────────────────────────────────┐
│  📍 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                      │  ← city label skeleton
│                                              │
│  [ ▒▒ ]   UV teraz                           │  ← circular value stub
│  ───────────────────────────────             │
│  Poziom ryzyka: [▒▒▒▒]                       │
│  UV max dziś: ▒▒                             │
│                                              │
│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                        │  ← CTA row skeletons
│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                        │
│                                              │
│  Ostatnia aktualizacja: ▒▒:▒▒                │
└──────────────────────────────────────────────┘
```

* `aria-busy="true"` on hero; announce completion via `aria-live="polite"`.

---

## 3A) Hero — normal state (auto‑location OK, risk = moderate)

```
┌──────────────────────────────────────────────┐
│ 📍 {{city_label}}                ⟳ Odśwież   │
│                                            i │  (i) shows tooltip with
│                                              │  last update
│                                              │
│   ┌──────────────┐                           │
│   │   UV teraz   │                           │
│   │     5.3      │   Poziom ryzyka: [YEL]    │
│   │              │   {{risk_level}}          │
│   └──────────────┘   {{risk_copy}}           │
│                                              │
│   UV max dziś: 6.8                           │
│   Źródło: Wttr.in                            │
│   Ostatnia akt.: 10:30  ⏱ Auto: 29:12        │
│                                              │
│  [Kalkulator dawki SPF]  [Timer reaplikacji] │
│    ⟶ /skin/narzedzia/kalkulator-dawki-spf    │
│    ⟶ /skin/narzedzia/timer-reaplikacji       │
│                                              │
│  Zmień lokalizację ›                         │
└──────────────────────────────────────────────┘
```

Bindings:

* `{{uv_now}}=5.3`, `{{uv_max_today}}=6.8`, `{{risk_level}}=moderate`, `{{risk_copy}}` from CMS.
* Buttons fire: `⟶ uv_widget_cta_click` with `cta_id`.
* Refresh: manual button `⟶ uv_widget_refresh`; auto refresh countdown (30m).

---

## 3B) Hero — **fallback city** (deny/error), with info banner

```
┌──────────────────────────────────────────────┐
│ 📍 Warszawa, PL (domyślna)        ⟳ Odśwież  │
│                                              │
│ ⚠  Pokazujemy Warszawę. Udostępnij           │
│    lokalizację, aby zobaczyć swoje miasto.   │
│                                              │
│   ┌──────────────┐                           │
│   │   UV teraz   │                           │
│   │     3.8      │   Poziom ryzyka: [YEL]    │
│   │              │   umiarkowane             │
│   └──────────────┘   Nałóż SPF 50 co 2h.     │
│                                              │
│   UV max dziś: 4.9                           │
│   Źródło: Wttr.in                            │
│                                              │
│  [Kalkulator dawki SPF]  [Timer reaplikacji] │
│                                              │
│  Zmień lokalizację ›                         │
└──────────────────────────────────────────────┘
```

* `fallback.is_fallback_city=true`; info line text from CMS.

---

## 4) City search (modal / popover)

```
╔══════════════════════════════════════════════╗
║ 🔎 Wpisz miasto (PL/EN)                      ║
║ [Wars…__________________________]  (×)       ║
║                                              ║
║  Wyniki (max 10):                            ║
║  ─ Warsaw, Poland          → wybierz         ║
║  ─ Warszawa, Poland        → wybierz         ║
║  ─ Waršava, Lithuania      → wybierz         ║
║  ─ …                                       ↓ ║
║                                              ║
║  Brak wyników dla "Wx": spróbuj inaczej.     ║
║                                              ║
║  [Anuluj]                                    ║
╚══════════════════════════════════════════════╝
```

* Input validation: min 2 / max 60 chars.
* Selecting result persists `last_city` (expiry 7d) and reloads hero.
* Events: `⟶ uv_widget_city_search` (props: query_length, results_count).

---

## 5) Error state — upstream API/network failure

```
┌──────────────────────────────────────────────┐
│ 📍 {{city_label}}                ⟳ Odśwież   │
│                                              │
│   Nie możemy teraz pobrać danych.            │
│   Skorzystaj z kalkulatora SPF.              │
│   (Błąd #{{error_id}})                       │
│                                              │
│  [Kalkulator dawki SPF]  [Timer reaplikacji] │
│                                              │
│  Zmień lokalizację ›                         │
└──────────────────────────────────────────────┘
```

* `aria-live="assertive"` for the error block.
* Server retries/backoff abstracted; keep UI responsive.

---

## 6) Extreme UV emphasis (risk = extreme)

```
┌──────────────────────────────────────────────┐
│ 📍 {{city_label}}                ⟳ Odśwież   │
│                                              │
│   ┌──────────────┐                           │
│   │   UV teraz   │                           │
│   │    11.2+     │   Poziom ryzyka: [PUR]    │
│   │              │   EXTREME                  │
│   └──────────────┘   Unikaj słońca 10–16.    │
│                      SPF 50+, kapelusz, cień.│
│                                              │
│   UV max dziś: 12.0+                          │
│   Źródło: Wttr.in                            │
│                                              │
│  [Kalkulator dawki SPF]  [Timer reaplikacji] │
│                                              │
│  Zmień lokalizację ›                         │
└──────────────────────────────────────────────┘
```

* Copy pulled from CMS key for `risk_level=extreme` (PL/EN variants).

---

## 7) Manual refresh tooltip (last updated)

```
             ⟲ Odśwież  (tap)
                 ╭──────────────────────────╮
                 │ Ostatnia aktualizacja:   │
                 │ 2025‑01‑17 10:30 (UTC+01)│
                 │ Auto-odświeżanie: 23:12  │
                 ╰──────────────────────────╯
```

* Appears on tap/long‑press; dismiss on blur/ESC. `aria-describedby` from icon.

---

## 8) English language variant (same layout)

```
┌──────────────────────────────────────────────┐
│ 📍 {{city_label}}                   Refresh  │
│                                              │
│   ┌──────────────┐                           │
│   │   UV now     │                           │
│   │     6.7      │   Risk status: [ORG]      │
│   │              │   high                     │
│   └──────────────┘   Apply SPF 50 every 2h.   │
│                                              │
│   UV max today: 7.1                           │
│   Source: Wttr.in                             │
│                                              │
│  [SPF dose calculator] [Reapplication timer]  │
│                                              │
│  Change location ›                            │
└──────────────────────────────────────────────┘
```

* Switching language resets copy, keeps coordinates (per FR5).

---

## 9) Offline / cache‑first (optimistic UI)

```
┌──────────────────────────────────────────────┐
│ 📍 {{city_label}}                ⟳ Odśwież   │
│                                              │
│   Pokazujemy zapisane dane sprzed 22 min.    │
│   Brak sieci — spróbujemy ponownie w tle.    │
│                                              │
│   [ UV teraz: 5.9 ]  [YEL] umiarkowane       │
│   UV max dziś: 6.5                            │
│                                              │
│  [Kalkulator dawki SPF]  [Timer reaplikacji] │
└──────────────────────────────────────────────┘
```

* Loaded from `localStorage` (≤30 min) while background refresh runs.

---

### Component notes (for dev hand‑off)

1. **Bindings:**

   * `{{uv_now}}`, `{{uv_max_today}}`, `{{risk_level}}`, `{{risk_copy}}`, `{{city_label}}`, `{{observed_at}}`, `{{source}}="Wttr.in"`, `{{fallback.is_fallback_city}}`, `{{fallback.message}}`.
2. **WHO color map → badge token:**

   * low→`[GRN]`, moderate→`[YEL]`, high→`[ORG]`, very_high→`[RED]`, extreme→`[PUR]`.
3. **Geolocation:** consent gate → success uses `{latitude,longitude}`; denial → 3B.
4. **Search:** min 2 chars; show up to 10 normalized `CityCandidate`.
5. **Caching/refresh:** show `Auto: mm:ss` countdown; manual ⟳ triggers optimistic loading state 2 with shimmer bars only inside hero.
6. **Accessibility:**

   * Risk badge meets AA contrast in real UI;
   * Errors announced via `aria-live="assertive"`;
   * Modal focus trap; ESC/Back closes;
   * Tap targets ≥44 px.
7. **Analytics (Plausible):**

   * `uv_widget_load {has_consent, source_city, uv_now}`
   * `uv_widget_refresh`
   * `uv_widget_city_search {query_length, results_count}`
   * `uv_widget_cta_click {cta_id}`

---

If you want, I can export these as a **print‑ready PDF** or add an **ASCII → HTML** style guide with spacing and token classes.
