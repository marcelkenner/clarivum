Below are **mobile‑first ASCII wireframes** for the BPO Fabric‑Bleach Risk Aid, covering the primary flows and required UI states. They reflect the spec’s rules, copy, and accessibility notes. Polish (PL) is the default; an EN toggle is shown in one screen.

---

## Legend (controls & notation)

```
( ) radio     (●) selected radio
[    ] input  [##  ] progress-ish / slider track
[o] knob      [BTN] button        [i] tooltip
[!] warning   ✱ required          ⌗ read-only/preview text
──── section  ┆ divider           → inline hint
aria-live: {polite|assertive}
```

---

## Screen A — Pristine (no result yet, PL default)

Route: `/skin/narzedzia/bpo-ubrania/`  (A, L, U)

```
┌──────────────────────────────────────────────┐
│ ← Narzędzia                                  │
│ BPO a ubrania                                │
│ PL | EN                                      │
└──────────────────────────────────────────────┘

Ryzyko odbarwienia od BPO
────────────────────────────────────────────────
[i] Czym jest BPO i odbarwianie?
→ Benzoyl peroxide może odbarwiać barwione tkaniny.

Stężenie BPO (%) ✱                                [W]
  2.5      5.0       10
 [o]───────┼──────────┼──────────                 (I, B)
      [i] Co oznaczają progi?

Tkanina ✱                                         [W]
 ( ) Bawełna       ( ) Len       ( ) Wełna
 ( ) Jedwab        ( ) Poliester ( ) Nylon
 ( ) Mieszanka                                           (I, F)

Kolor ✱                                            [W]
 ( ) Biały  ( ) Jasny  ( ) Ciemny                         (I, C)

Czas do kontaktu (min) ✱                          [W]
 [              ]  → np. “15”                       (I, D)

Czas kontaktu (min) ✱                              [W]
 [              ]  → np. “480”                      (I, E)

┆
[RESET]                 [OBLICZ] (disabled)      (Q, U, V)

────────────────────────────────────────────────
⌗ Wynik pojawi się tutaj po uzupełnieniu pól.
aria-live: polite (pusty)                         (K, M, R, K-a11y)

────────────────────────────────────────────────
* To jedynie szacunek. Barwniki i wykończenia tkanin różnią się;
  wyniki mogą się różnić.  (C)
```

Notes:

* `[W]` placeholders indicate room for **inline error/warning chips**.
* Slider has **discrete stops** at 2.5, 5.0, 10 (I, B).

---

## Screen B — Tooltips open (PL)

Shows the two short info tooltips per W.

```
Stężenie BPO (%) ✱   [i]
└ Tooltip:
  • 2.5–4.99% → niższa podstawa ryzyka
  • 5.0–9.99% → wyższa podstawa
  • 10% → najwyższa podstawa

Czas do kontaktu (min) ✱  [i]
└ Tooltip:
  “Dry‑down” = czas schnięcia przed kontaktem z tkaniną.
  ≥60 min znacząco zmniejsza ryzyko.                    (W)
```

---

## Screen C — Valid result: **High** (example 1)

Inputs (debounced live or on press):
`5% BPO, Bawełna, Ciemny, TBC=15, CK=480` → score **12**, bucket **Wysokie** (M, Q, X)

```
┌──────────────────────────────────────────────┐
│ ← Narzędzia                                  │
│ BPO a ubrania                                │
│ PL | EN                                      │
└──────────────────────────────────────────────┘

Stężenie BPO (%) ✱
  2.5      5.0       10
  ────────[o]────────┼──────────

Tkanina ✱
 (●) Bawełna  ( ) Len   ( ) Wełna
 ( ) Jedwab   ( ) Poliester ( ) Nylon
 ( ) Mieszanka

Kolor ✱
 ( ) Biały  ( ) Jasny  (●) Ciemny

Czas do kontaktu (min) ✱
 [      15      ]

Czas kontaktu (min) ✱
 [      480     ]

┆
[RESET]                 [OBLICZ] (enabled)

────────────────────────────────────────────────
WYNIK
[WSKAŹNIK: ● WYSOKIE]  (12 / 14)                 (M, R)
aria-live: polite

Opis:
 • 5% BPO
 • bawełna
 • ciemna tkanina
 • długi kontakt (≥240 min)
 • krótki dry‑down (<30 min)                      (H, X)

Zalecenia:
 • Używaj białych tekstyliów (poszewki/ręczniki)
 • Poczekaj ≥60 min przed ubraniem
 • Umyj ręce po aplikacji
 • Unikaj kontaktu ze świeżą aplikacją            (S)

┆
[SKOPIUJ LINK]    [UDOSTĘPNIJ…]   [ZAPISZ USTAWIENIA (local)] (O, P)

────────────────────────────────────────────────
* To jedynie szacunek. Barwniki… (C)
```

Inline behavioral notes:

* `aria-live` announces “WYSOKIE (12/14)” after compute (K, R, K-a11y).
* Telemetry event (T) fires on successful calc (not shown in UI).

---

## Screen D — Valid result: **Moderate** with dry‑down benefit (example 2)

Inputs: `4%, Len, Ciemny, TBC=90, CK=30` → **4 / 14** → **Umiarkowane**.

```
WYNIK
[WSKAŹNIK: ● UMIARKOWANE]  (4 / 14)

Opis:
 • 4% BPO
 • len
 • ciemna tkanina
 • krótki kontakt (<60 min)
 • dry‑down ≥60 min (korzystny)                   (D, H)

Zalecenia:
 • Używaj białych tekstyliów
 • Zapewnij pełny dry‑down przed ubraniem
 • Umyj ręce po aplikacji
```

---

## Screen E — Valid result: **Low** (example 3)

Inputs: `2.5%, Poliester, Biały, TBC=60, CK=0` → **0 / 14** → **Niskie**.

```
WYNIK
[WSKAŹNIK: ● NISKIE]   (0 / 14)

Opis:
 • 2.5% BPO
 • poliester
 • biała tkanina
 • bardzo krótki kontakt (<60 min)
 • dry‑down ≥60 min                                (H)

Zalecenia:
 • Używaj białych tekstyliów
 • Zapewnij pełny dry‑down przed ubraniem
 • Umyj ręce po aplikacji                         (≥3 tipy per S)
```

---

## Screen F — Clamp warning (inputs out of range) (N, G)

Case: user enters `bpo_percent = 12.0` (or `1.0`). API clamps; UI shows non‑blocking notice.

```
Stężenie BPO (%) ✱
  2.5      5.0       10
  ─────────┼──────────[o]
[!] bpo_percent clamped to 10%                   (N, B, Algorithm-1)

WYNIK
[WSKAŹNIK: ● WYSOKIE]  (10 / 14)
Opis:
 • 10% BPO (zeskalowane do maks.)
 • jedwab
 • ciemna tkanina
 • krótki kontakt (<60 min)
 • krótki dry‑down (<30 min)

Uwaga: Wartość BPO spoza zakresu została ograniczona.
```

---

## Screen G — Inline validation errors (V, G)

Case: time > 1440 or negative.

```
Czas kontaktu (min) ✱
 [      2000     ]
[!] must be ≤ 1440                                 code: DOMAIN_VIOLATION

Czas do kontaktu (min) ✱
 [      -5       ]
[!] wartość nie może być ujemna                    code: VALIDATION_ERROR

[OBLICZ] (disabled)
```

(If submitted, the API would return 422/400 with the standard error body (V).)

---

## Screen H — Shareable results + “Copy link” (O)

After pressing **SKOPIUJ LINK**, a non‑blocking snackbar appears.

```
[SKOPIUJ LINK]  →  ┌───────────────────────────────┐
                   │ Link skopiowany               │
                   │ ?bpo=5&fabric=cotton&color=   │
                   │ dark&tbc=15&cd=480            │
                   └───────────────────────────────┘
```

(Deep‑linking the page with this query **rehydrates** state on load.)

---

## Screen I — English toggle (L)

Same as Screen C but with EN copy.

```
Header: PL | EN (EN selected)

RESULT
[BADGE: ● HIGH]  (12 / 14)

Explanation:
 • 5% BPO
 • cotton
 • dark fabric
 • long contact (≥240 min)
 • short dry‑down (<30 min)

Tips:
 • Use white linens (pillowcases/towels)
 • Ensure full dry‑down before dressing
 • Wash hands after application
 • Avoid contact with fresh application

Disclaimer:
 This is an estimate. Fabric dyes and finishes vary; results may differ.
```

---

## Screen J — API error (unknown enum) surfaced gracefully (F, V)

(Should be rare because UI uses radios, but handled.)

```
Tkanina ✱
 [silcone]                                        ← user pasted or modified
[!] fabric must be one of:
    cotton, linen, wool, silk, polyester, nylon, blend
    code: INVALID_ENUM
```

---

## Component snippets (for reuse by engineers)

**1) Result badge (M, R, K)**

```
[● HIGH]    [● MODERATE]    [● LOW]
(Use tokens: --risk-high / --risk-amber / --risk-green)
Text alt for assistive tech: "High risk" etc.
```

**2) Explanation list (deterministic order) (H, X)**

```
1) "<BPO%> BPO"
2) "<fabric>"
3) "<color> fabric/tkanina"
4) "long contact (≥240 min)" | "≥60 min contact" | "short contact (<60 min)"
5) "short dry‑down (<30 min)" | "≥30 min dry‑down" | "≥60 min dry‑down"
```

**3) Tips logic (S)**

```
Always include >=3:
  • Use white linens (pillowcases/towels)
  • Ensure full dry‑down before dressing
  • Wash hands after application
If bucket == "high", add:
  • Avoid contact with fresh application
PL equivalents used in PL UI.
```

**4) Buttons & states (Q, U)**

```
[OBLICZ] enabled when all required fields valid or on live-change debounce.
[RESET] clears inputs + localStorage (if opted-in).
[SKOPIUJ LINK] copies canonical querystring.
```

**5) Accessibility (K)**

```
• Keyboard: radios tabbable; slider stops focusable (2.5 / 5 / 10).
• Visible focus rings.
• Announce result region via aria-live="polite".
• Badge color is a hint; text always conveys bucket & score.
```

---

## Test matrix (visual run-through across screens)

Each can be previewed by plugging values into the inputs; the badge and explanation update per Algorithm.

```
(10, cotton, dark, 0, 600)  → 14 / high  (Screen C-like, with 10%)
(5,  wool,   light,45,120)  →  7 / moderate
(7.5,blend,  light,0, 30)   →  7 / moderate
(1.0, nylon, white,120,0)   →  0 / low + clamp warning  (Screen F)
(12.0,silk,  dark,10, 59)   → 10 / high + clamp warning
(5,  cotton, white,120,240) →  7 / moderate
(5,  linen,  dark, 60, 59)  →  6 / moderate
(2.5,blend,  light,0,  59)  →  5 / moderate
```

---

### Implementation checklist mapping (quick reference)

* **A** Route/UI covered (Screen A).
* **B–F** Sliders/radios/inputs wired (Screens A–E).
* **G** Guards + clamp + normalization (Screens F, G, J).
* **H, X** Deterministic explanation (Screens C–E).
* **I, L** Control set + i18n (Screens A, I).
* **K, M, R** Result badge, score & copy color semantics (Screens C–E).
* **N, V** Warnings & errors (F, G, J).
* **O** Shareable link (H).
* **P** Local opt‑in persistence (C).
* **Q, U** Live & explicit calculate; states (A, C).
* **S** Tips logic varies by bucket (C–E).
* **C (disclaimer)** shown on all result screens.
* **K (a11y)** aria-live + focusable controls indicated throughout.

---

If you’d like, I can also provide a compact **desktop layout ASCII** (two columns: inputs left, results right) and a **one‑page printable spec** version.
