> **Canonical decisions:** `docs/adr/ADR-022-tools-and-calculators-platform.md` governs state + scheduling; interface tokens follow `docs/adr/ADR-018-brand-design-system.md`.

Below are **mobile‑first ASCII wireframes** for the **SPF Reapplication Timer**. They focus on the primary states and flows defined in your spec (Idle → Computed → DueNow → Error → Offline), with accessible labels, localized strings (EN/PL), and UI behaviors called out inline.

> Legend:
> `( )` radio (unselected) · `(•)` radio (selected) · `[ ]` switch/checkbox (off) · `[✓]` switch/checkbox (on)
> `[]` button · `▣` badge/chip · `⚑` alert/banner · `⏱` countdown (mm:ss) · `👁‍🗨` aria-live region

---

### 1) **Idle / Form (EN, mobile first 1‑column)**

```
┌────────────────────────────────────────────┐
│ SPF Reapplication Timer                    │
│ EN · PL                                    │
├────────────────────────────────────────────┤
│ (i) Educational tool; not medical advice.  │
├────────────────────────────────────────────┤
│ Last application (date & time)             │
│ [ 2025-10-23 · 10:00 ] (🕘 picker)         │
│ TZ hint: detected Europe/Warsaw            │
│ ( ) Use different timezone →               │
│     [ Select timezone ▼ ]                  │
│                                            │
│ [ Set to Now ] [ Reset last application ]  │
├────────────────────────────────────────────┤
│ Water resistance                           │
│ (•) None     ( ) 40 min     ( ) 80 min     │
├────────────────────────────────────────────┤
│ Exposure                                   │
│ [ ] In water or heavy sweat                │
│ [ ] Towel‑dried or wiped (reapply now)     │
├────────────────────────────────────────────┤
│ Environment                                │
│ [ Mostly outdoor ▼ ]                       │
│   Options: Mostly outdoor / Indoors – low  │
│            UV                              │
├────────────────────────────────────────────┤
│ Preferences                                │
│ [ ] Remember my last application (local)   │
│     [ Clear saved data ]                   │
├────────────────────────────────────────────┤
│                    [ Compute next reapply ]│
│                    (primary CTA)           │
└────────────────────────────────────────────┘
Keyboard order: Title → Lang → Date/Time → TZ → Set Now → Reset →
Water resistance (None→40→80) → Water switch → Towel switch → Env select →
Remember → Clear → Compute (Enter submits)
```

---

### 2) **Computed (Baseline case, EN)**

```
┌────────────────────────────────────────────┐
│ SPF Reapplication Timer            EN · PL │
├────────────────────────────────────────────┤
│ Inputs                                    ✎│
│ Last application: 23 Oct 2025, 10:00 (+02) │
│ TZ: Europe/Warsaw                          │
│ Water resistance: None                     │
│ Exposure: No water/sweat; No towel‑drying  │
│ Environment: Mostly outdoor                │
│ [ Edit inputs ]                            │
├────────────────────────────────────────────┤
│ RESULT                                     │
│ Next reapplication at:                     │
│ ► 12:00 (Europe/Warsaw) Thu, 23 Oct 2025   │
│                                            │
│  ⏱ Time remaining    ▣ 90 min              │
│     01:30:00 (live countdown, updates 1s)  │
│                                            │
│  Rule  ▣ Baseline 120                      │
│                                            │
│ Notes                                      │
│ • Reapply sooner after towel‑drying or     │
│   rubbing off.                             │
│ • If makeup on top, consider SPF top‑up    │
│   method.                                  │
│                                            │
│ [ Reset last application to Now ]          │
│ [ Recompute ] (disabled until input changed)│
│                                            │
│ 👁‍🗨 aria-live="polite": updates only when   │
│ countdown hits 00:00 → "Due now."          │
└────────────────────────────────────────────┘
```

---

### 3) **Computed (Water exposure, labeled 40 min, EN)**

```
┌────────────────────────────────────────────┐
│ SPF Reapplication Timer            EN · PL │
├────────────────────────────────────────────┤
│ RESULT                                     │
│ Next reapplication at: 10:40 (UTC)         │
│  ⏱ Time remaining  ▣ 15 min   00:15:23     │
│  Rule ▣ 40 min (water)                     │
│                                            │
│ Notes                                      │
│ • Reapply sooner after towel‑drying or     │
│   rubbing off.                             │
│ • If makeup on top, consider SPF top‑up    │
│   method.                                  │
│                                            │
│ [ Reset last application to Now ] [ Edit ] │
└────────────────────────────────────────────┘
```

---

### 4) **Towel‑dried override (Due now, EN)**

```
┌────────────────────────────────────────────┐
│ SPF Reapplication Timer            EN · PL │
├────────────────────────────────────────────┤
│ RESULT                                     │
│ Next reapplication at: 10:00 (−04:00)      │
│                                            │
│  ⏱ Time remaining  ▣ 0 min     00:00:00    │
│  Rule ▣ Towel‑dried — reapply now          │
│                                            │
│ ⚑ DUE NOW                                  │
│ • Reapply now due to towel‑drying/wiping.  │
│ • Reapply sooner after towel‑drying or     │
│   rubbing off.                             │
│ • If makeup on top, consider top‑up        │
│   methods (spray/powder SPF).              │
│                                            │
│ [ Reset last application to Now ]          │
│ [ Start new timer ] (sets last=now & recompute)│
│                                            │
│ 👁‍🗨 aria-live="polite": "Due now" announced │
└────────────────────────────────────────────┘
```

---

### 5) **Indoors – low UV (messaging only, EN)**

```
┌────────────────────────────────────────────┐
│ SPF Reapplication Timer            EN · PL │
├────────────────────────────────────────────┤
│ RESULT                                     │
│ Next reapplication at: 11:00 (+01:00)      │
│  ⏱ Time remaining  ▣ 45 min     00:45:12   │
│  Rule ▣ Baseline 120                       │
│                                            │
│ Notes                                      │
│ • Indoors near windows still has UV; many  │
│   people reapply every ~2 hours.           │
│ • Reapply sooner after towel‑drying or     │
│   rubbing off.                             │
│ • If makeup on top, consider SPF top‑up    │
│   method.                                  │
└────────────────────────────────────────────┘
```

---

### 6) **Validation error (422: last in future, EN)**

```
┌────────────────────────────────────────────┐
│ SPF Reapplication Timer            EN · PL │
├────────────────────────────────────────────┤
│ ⚑ Error: LAST_APPLICATION_IN_FUTURE        │
│ last_application_ts (2025-10-24T08:00:00Z) │
│ is in the future relative to now           │
│ (2025-10-23T12:00:00Z).                    │
│ [ Dismiss ]                                │
├────────────────────────────────────────────┤
│ Last application (date & time)             │
│ [ 2025-10-24 · 08:00 ] (error)             │
│ ↳ Please enter a past date/time.           │
│                                            │
│ [ Compute next reapply ] (disabled)        │
└────────────────────────────────────────────┘
```

---

### 7) **Bad request (400: schema/enum), EN**

```
┌────────────────────────────────────────────┐
│ SPF Reapplication Timer            EN · PL │
├────────────────────────────────────────────┤
│ ⚑ Error: INVALID_ENUM                      │
│ water_resistance must be one of: none, 40, │
│ 80.                                        │
│ [ Dismiss ]                                │
├────────────────────────────────────────────┤
│ Water resistance                           │
│ (•) None   ( ) 40 min   ( ) 80 min         │
└────────────────────────────────────────────┘
```

---

### 8) **Rate limited (429), EN**

```
┌────────────────────────────────────────────┐
│ SPF Reapplication Timer            EN · PL │
├────────────────────────────────────────────┤
│ ⚑ Too many requests. Please try again in   │
│ 12 seconds. (We limit to protect the API.) │
│ [ Retry now ] (disabled, 12s)              │
└────────────────────────────────────────────┘
```

---

### 9) **Offline mode (local compute), EN**

```
┌────────────────────────────────────────────┐
│ SPF Reapplication Timer            EN · PL │
├────────────────────────────────────────────┤
│ ⚑ Offline — using local clock. We’ll sync  │
│ when back online.                          │
├────────────────────────────────────────────┤
│ RESULT (computed locally)                  │
│ Next reapplication at: 12:00 (+02:00)      │
│  ⏱ Time remaining  ▣ 89 min     01:29:45   │
│  Rule ▣ Baseline 120                       │
│ Notes...                                   │
│                                            │
│ [ Try server again ] (retries in BG)       │
│ (On reconnect: subtle ✓ “Validated with API”)│
└────────────────────────────────────────────┘
```

---

### 10) **Polish locale (PL) — Computed example**

```
┌────────────────────────────────────────────┐
│ Timer ponownej aplikacji SPF       EN · PL │
├────────────────────────────────────────────┤
│ WYNIK                                      │
│ Następna aplikacja o: 12:00 (Europa/Warszawa)│
│  ⏱ Pozostało czasu  ▣ 90 min    01:30:00    │
│  Zasada ▣ Bazowa 120                       │
│                                            │
│ Notatki                                    │
│ • Nałóż ponownie wcześniej po wytarciu     │
│   ręcznikiem lub starciu.                  │
│ • Jeśli masz makijaż, rozważ dołożenie     │
│   SPF (mgiełka/puder).                     │
│                                            │
│ [ Ustaw ostatnią aplikację na Teraz ]      │
│ [ Edytuj dane ]                             │
└────────────────────────────────────────────┘
```

---

## Microcopy & i18n notes (EN / PL)

* **Always include**
  EN: “Reapply sooner after towel‑drying or rubbing off.”
  PL: „Nałóż ponownie wcześniej po wytarciu ręcznikiem lub starciu.”

* **Towel override (prepend)**
  EN: “Reapply now due to towel‑drying/wiping.”
  PL: „Nałóż ponownie teraz z powodu wytarcia/wycierania.”

* **Water + non‑resistant**
  EN: “Product not water‑resistant; 40‑min conservative interval used.”
  PL: „Produkt nie jest wodoodporny; zastosowano konserwatywny interwał 40 min.”

* **Indoor message (no water/sweat)**
  EN: “Indoors near windows still has UV; many people reapply every ~2 hours.”
  PL: „W pomieszczeniach przy oknach nadal jest UV; wiele osób dokłada co ~2 godz.”

* **Due now**
  EN: “If wearing makeup, consider top‑up methods (spray/powder SPF).”
  PL: „Jeśli masz makijaż, rozważ dołożenie SPF (mgiełka/puder).”

* **Long‑ago application (>36h)**
  EN: “If it has been a long time since application, consider applying fresh sunscreen first.”
  PL: „Jeśli od aplikacji minęło dużo czasu, najpierw nałóż świeży filtr.”

---

## Accessibility hooks (as depicted)

* Every control labeled with visible text; supporting hints via `aria-describedby`.
* Live region only announces once at **Due now**: `aria-live="polite"`.
* Focus order is linear, top‑to‑bottom; Enter activates primary CTA.
* Color badges (Rule / Minutes chip) **also** have text for non‑color users.

---

## State machine (tie‑back to W)

```
Idle → [Compute] → Computed → (tick to 00:00) → DueNow
  ↘ (validation error) Error ──[fix inputs]──→ Idle/Computed
Offline banner can overlay any state; on reconnect, validate silently.
```

---

## Footer (always)

```
(i) Educational tool; does not replace product label or medical advice.
Accept: application/vnd.timer-reapply.v1+json · Cache: no-store
```

---

### Optional: condensed bottom sheet CTA (small phones)

If vertical space is tight, treat the primary CTA as a sticky bottom sheet:

```
┌───────────── page content ──────────────┐
│ …                                        │
├──────────────────────────────────────────┤
│  ⏱ 01:27:52     ▣ Baseline 120   [Compute]│
└──────────────────────────────────────────┘
```

---

These ASCII screens reflect the **fields, rules, notes, errors, i18n, offline behavior, and accessibility** from your A–Z spec while keeping a **mobile‑first** single‑column layout. If you’d like, I can also turn these into a clickable HTML prototype or expand the PL screens across all states.
