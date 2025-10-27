> **Canonical decisions:** `docs/adr/ADR-022-tools-and-calculators-platform.md` for computation + state; respect UI tokens per `docs/adr/ADR-018-brand-design-system.md`.

Below are **mobile‑first ASCII wireframes** for the “**Kalkulator Dawki SPF**” in key states. They are sized for a narrow viewport (≈40–44ch). Copy shows **Polish by default** (per path), plus one **English** sample to prove i18n (decimal separators + labels).

**Legend (for all screens)**

```
[ ] unchecked   [x] checked   [–] disabled
[?] helper / microcopy         ! error banner
[v] dropdown    [ ]→[x] tap toggles   ... overflow
```

---

## SCREEN 1 — First load / Empty state (PL)

```
+--------------------------------------+
| ← Kalkulator Dawki SPF         [PL|EN]
+--------------------------------------+
| „Wybierz obszary do posmarowania.    |
|  Przeliczymy na ml (≈ g) przy        |
|  2 mg/cm². Opcjonalnie: pompki/krople|
+--------------------------------------+

[ SELEKCJA OBSZARÓW ]
[ ] Twarz (face)            [1,2 ml]
[ ] Szyja (neck)            [0,7 ml]
[ ] Uszy (ears)             [0,3 ml]
[ ] Oba ramiona (both_arms) [5,4 ml]
[ ] Obie nogi (both_legs)  [10,8 ml]
[ ] Klatka przód (front)    [5,4 ml]
[ ] Plecy (back)            [5,4 ml]
[ ] Dłonie (hands)          [0,6 ml]

[ PRZEŁĄCZNIKI ]
[ ] Uwzględnij skórę głowy, jeśli odsłonięta
    (scalp)

[ ] Całe ciało (dorosły)

[ OPAKOWANIE ]
Rodzaj: [ pump v ]
ml na porcję (opcjonalnie): [ 0,25 ]

! Wybierz co najmniej jeden obszar.

[ WYNIK ]
+------------------------------------+
| Razem: –.– ml   •   ≈ gramy: –.– g |
| Zalecane: —                         |
| Rozbicie wg obszarów:               |
|  (zostanie pokazane po wyborze)     |
| Notatki:                            |
|  • Dla sprayów/sztyftów/tubek...    |
+------------------------------------+

[ DISCLAIMER ]
Podane ilości dotyczą dorosłych (2 mg/cm²).
Dla nastolatków/dzieci traktuj jako orientacyjne.
```

---

## SCREEN 2 — Face + Neck + Ears, Pump default (PL)

```
+--------------------------------------+
| ← Kalkulator Dawki SPF         [PL|EN]
+--------------------------------------+

[ SELEKCJA OBSZARÓW ]
[x] Twarz (face)            [1,2 ml]
[x] Szyja (neck)            [0,7 ml]
[x] Uszy (ears)             [0,3 ml]
[ ] Oba ramiona             [5,4 ml]
[ ] Obie nogi              [10,8 ml]
[ ] Klatka przód            [5,4 ml]
[ ] Plecy                   [5,4 ml]
[ ] Dłonie                  [0,6 ml]

[ PRZEŁĄCZNIKI ]
[ ] Uwzględnij skórę głowy, jeśli odsłonięta
[ ] Całe ciało (dorosły)

[ OPAKOWANIE ]
Rodzaj: [ pump v ]
ml na porcję (opcjonalnie): [ 0,25 ]

[ WYNIK ]
+------------------------------------+
| Razem: 2,2 ml • ≈ gramy: 2,2 g     |
| Zalecane: 9 pompki                 |
|  (założenie: 0,25 ml / pompka)     |
| Rozbicie wg obszarów:              |
|  • Twarz ............... 1,2 ml    |
|  • Szyja ............... 0,7 ml    |
|  • Uszy ................ 0,3 ml    |
| Notatki:                            |
|  • Metoda „dwóch palców”           |
|    ≈ 1,0–1,3 ml na twarz.           |
|  • Zwiększ ilość przy zaroście/     |
|    gęstych włosach.                 |
+------------------------------------+

[ DISCLAIMER ] (zawsze widoczny)
```

---

## SCREEN 3 — Both arms + Hands conflict (PL)

```
+--------------------------------------+
| ← Kalkulator Dawki SPF         [PL|EN]
+--------------------------------------+

[ SELEKCJA OBSZARÓW ]
[ ] Twarz                     [1,2]
[ ] Szyja                     [0,7]
[ ] Uszy                      [0,3]
[x] Oba ramiona               [5,4]
[x] Dłonie                    [0,6]  (wybrane)

[ PRZEŁĄCZNIKI ]
[ ] Uwzględnij skórę głowy
[ ] Całe ciało (dorosły)

[ OPAKOWANIE ]
Rodzaj: [ pump v ]
ml na porcję (opcjonalnie): [ 0,25 ]

[ WYNIK ]
+------------------------------------+
| Razem: 5,4 ml • ≈ gramy: 5,4 g     |
| Zalecane: 22 pompki                |
| Rozbicie wg obszarów:              |
|  • Oba ramiona .......... 5,4 ml   |
|  • Dłonie ................ 0,0 ml   |
| Notatki:                            |
|  • Dłonie są uwzględnione w obu     |
|    ramionach; nie zliczamy         |
|    ich podwójnie.                  |
+------------------------------------+
```

---

## SCREEN 4 — Invalid custom actuation (error) (PL)

```
+--------------------------------------+
| ← Kalkulator Dawki SPF         [PL|EN]
+--------------------------------------+

[ SELEKCJA OBSZARÓW ]
[x] Twarz                     [1,2]
[x] Szyja                     [0,7]

[ OPAKOWANIE ]
Rodzaj: [ pump v ]
ml na porcję (opcjonalnie): [ -0,20 ]
  ! Wartość na porcję musi być dodatnia.

[ WYNIK ]
+------------------------------------+
| Razem: 1,9 ml • ≈ gramy: 1,9 g     |
| Zalecane: — (ukryte do poprawy)    |
| Rozbicie wg obszarów:              |
|  • Twarz ............... 1,2 ml    |
|  • Szyja ............... 0,7 ml    |
| Notatki:                            |
|  • Metoda „dwóch palców”           |
|    ≈ 1,0–1,3 ml na twarz.           |
|  • Zwiększ ilość przy zaroście/     |
|    gęstych włosach.                 |
+------------------------------------+
```

---

## SCREEN 5 — Tube / Stick / Spray (no acts, caution) (PL)

```
+--------------------------------------+
| ← Kalkulator Dawki SPF         [PL|EN]
+--------------------------------------+

[ SELEKCJA OBSZARÓW ]
[x] Twarz                     [1,2]

[ OPAKOWANIE ]
Rodzaj: [ tube v ]
(ml na porcję ukryte dla: tube/stick/spray/unknown)

[ WYNIK ]
+------------------------------------+
| Razem: 1,2 ml • ≈ gramy: 1,2 g     |
| Zalecane: —                        |
| Rozbicie wg obszarów:              |
|  • Twarz ............... 1,2 ml    |
| Notatki:                            |
|  • Dla sprayów/sztyftów/tubek      |
|    pokazujemy tylko ml (bez        |
|    niepewnych przeliczeń).         |
|  • Metoda „dwóch palców” ...       |
+------------------------------------+
```

---

## SCREEN 6 — Include scalp (PL)

```
+--------------------------------------+
| ← Kalkulator Dawki SPF         [PL|EN]
+--------------------------------------+

[ SELEKCJA OBSZARÓW ]
[x] Twarz                     [1,2]

[ PRZEŁĄCZNIKI ]
[x] Uwzględnij skórę głowy, jeśli odsłonięta

[ OPAKOWANIE ]
Rodzaj: [ pump v ]   ml/porcję: [ 0,25 ]

[ WYNIK ]
+------------------------------------+
| Razem: 1,8 ml • ≈ gramy: 1,8 g     |
| Zalecane: 8 pompki                 |
|  (założenie: 0,25 ml / pompka)     |
| Rozbicie wg obszarów:              |
|  • Twarz ............... 1,2 ml    |
|  • Skóra głowy ......... 0,6 ml    |
| Notatki:                            |
|  • Metoda „dwóch palców” ...       |
|  • Zwiększ ilość przy zaroście/     |
|    gęstych włosach.                 |
+------------------------------------+
```

---

## SCREEN 7 — Full body (adult) override (PL)

```
+--------------------------------------+
| ← Kalkulator Dawki SPF         [PL|EN]
+--------------------------------------+

[ PRZEŁĄCZNIK TRYBU ]
[x] Całe ciało (dorosły)

[ SELEKCJA OBSZARÓW ] (wyłączone)
[–] Twarz [1,2]   [–] Szyja [0,7]   [–] Uszy [0,3]
[–] Oba ramiona [5,4]  [–] Obie nogi [10,8]
[–] Klatka przód [5,4] [–] Plecy [5,4]
[–] Dłonie [0,6]
[–] Uwzględnij skórę głowy

[ OPAKOWANIE ]
Rodzaj: [ pump v ]   ml/porcję: [ 0,25 ]

[ WYNIK ]
+------------------------------------+
| Razem: 30,0 ml • ≈ gramy: 30,0 g   |
| Zalecane: 120 pompki               |
|  (założenie: 0,25 ml / pompka)     |
| Rozbicie wg obszarów:              |
|  • Tryb „Całe ciało” — stała wartość|
+------------------------------------+
```

---

## SCREEN 8 — English locale sample (Face + Neck, Dropper)

```
+--------------------------------------+
| ← Sunscreen Amount Calculator  [EN|PL]
+--------------------------------------+

[ AREAS ]
[x] Face                      [1.2 mL]
[x] Neck                      [0.7 mL]

[ OPTIONS ]
[ ] Include scalp if exposed (parted/short hair)
[ ] Full body (adult)

[ PACKAGING ]
Type: [ dropper v ]
mL per actuation (optional): [ 0.05 ]

[ RESULT ]
+------------------------------------+
| Total: 1.9 mL • ≈ grams: 1.9 g     |
| Recommended: 38 drops              |
|  (assumption: 0.05 mL / drop)      |
| Breakdown:                         |
|  • Face .................. 1.2 mL  |
|  • Neck .................. 0.7 mL  |
| Notes:                              |
|  • Two‑finger ≈ 1.0–1.3 mL for face.|
|  • Adjust upward for beards/heavy   |
|    hair.                            |
+------------------------------------+

[ DISCLAIMER ]
These amounts are adult heuristics at 2 mg/cm².
For adolescents/children, treat as reference only.
```

---

### A11y call‑outs (applies to all screens)

* **Keyboard order:** Header → Areas checklist → Toggles → Packaging dropdown → Actuation field → Result card (read‑only) → Disclaimer.
* **Roles/labels:** checklist `role="group"` + each item `role="checkbox"` with `aria-checked`; scalp + full‑body as `role="switch"`; error helpers tied via `aria-describedby` to the offending input; language attribute on root (`lang="pl"` / `lang="en"`).
* **Contrast:** All interactive labels designed to meet 4.5:1; notes and helpers not conveyed by color alone.

---

### Notes mapping to spec

* **Constants & math** reflected in values (e.g., 2,2 ml; 5,4 ml; 30,0 ml; acts = ceil with 0,25/0,05; hands vs arms conflict).
* **Error states**: empty‑state banner and invalid actuation.
* **Packaging rules**: no acts for tube/stick/spray; caution note shown.
* **Localization**: PL (comma + “ml”) vs EN (dot + “mL”); strings externalizable.
* **Results card**: 1‑decimal display; breakdown shows only selected + scalp when used; full‑body shows fixed 30,0 ml.

If you'd like, I can also provide a **desktop breakpoint ASCII** (two‑column layout) or turn these into a **component checklist** for QA.
