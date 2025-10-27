> **Canonical decisions:** `docs/adr/ADR-022-tools-and-calculators-platform.md` for shared tooling; UI primitives per `docs/adr/ADR-018-brand-design-system.md`.

Below are **mobile‑first ASCII wireframes** (≈38–42 char width) for the **Kompatybilność pH** tool. They cover the main flow, results (incl. the acceptance example), error/edge states, and i18n cues. Text defaults to **Polish** per spec, with select **English** variants shown where helpful.

---

## Legend (UI tokens used below)

* `[]` checkbox • `( )` radio • `>` action • `…` truncated
* `[#]` pill/chip • `[pH 3.0]` badge • `Δ=…` delta label
* `!` caution • `i` info • `≡` drag handle • `⋮` more
* `—` em dash used for **unknown/null pH**
* `⟷` draggable hint • `↔` reorder affordance

Target width ≈ **40 chars**.

---

## Screen A — Route Entry / Landing (PL default)

```
/skin/narzedzia/ph-kompatybilnosc/

┌────────────────────────────────────┐
│  Kompatybilność pH                │
│  Estymator rutyny pielęgnacyjnej  │
│  (heurystyka; brak porad medycz.) │
│                                    │
│  [ Rozpocznij budowę rutyny ]      │
│                                    │
│  i  Jak to działa?                 │
│  • Szacuje pH na podstawie aktyw.  │
│  • Oblicza różnice pH (Δ)          │
│  • Oznacza znane niezgodności      │
│  • Sugeruje kolejność aplikacji    │
│                                    │
│  Język: [PL]  EN                   │
│  Reguły: v1.0.0                    │
└────────────────────────────────────┘
```

---

## Screen B — Budowa rutyny (pusta lista)

```
┌────────────────────────────────────┐
│  ←  Rutyna: Twoje kroki            │
│  Dodaj nazwy produktów i aktywne   │
│                                    │
│  (brak kroków)                     │
│  Dodaj min. 1 krok, aby zacząć     │
│                                    │
│  [ + Dodaj krok ]                  │
│                                    │
│  Opcje obliczeń                    │
│  [x] Rozsz. mapowanie (peptydy)    │
│  Zaokrąglenie pH: ( )0 (•)1 ( )2   │
│                                    │
│  [ Oblicz kompatybilność ] (disabled)
└────────────────────────────────────┘
```

---

## Screen C — Dodaj krok (arkusz dolny)

```
┌────────────────────────────────────┐
│  + Dodaj krok                      │
│  Nazwa*                            │
│  [______________________________]  │
│  Znane pH (opcjonalnie, 0–14)      │
│  [_____]                           │
│  Aktywne (tagi, ENTER=zatwierdź)   │
│  [ ascorbic acid  ][ x ]           │
│  [ niacinamide    ][ x ]           │
│  [ + Dodaj aktywne ]               │
│                                    │
│  [ Anuluj ]      [ Zapisz krok ]   │
└────────────────────────────────────┘
```

*Autocomplete popover (PL)*

```
┌────────────────────────────────────┐
│  Propozycje aktywnych              │
│  > kwas askorbinowy (L-AA)         │
│  > kwasy AHA                       │
│  > kwas salicylowy (BHA)           │
│  > niacynamid (Vit B3)             │
│  > peptyd miedziowy (GHK-Cu)       │
└────────────────────────────────────┘
```

---

## Screen D — Budowa rutyny (przykład wypełniony)

*(Will be used to produce the acceptance‑case results.)*

```
┌────────────────────────────────────┐
│  ←  Rutyna (3)        ⋮            │
│                                    │
│  ≡ L-AA Vitamin C serum            │
│    [pH 3.0]  #ascorbic acid        │
│                                    │
│  ≡ Peptide serum                   │
│    [pH — ]  #peptide               │
│                                    │
│  ≡ Moisturizer                     │
│    [pH — ]                         │
│                                    │
│  [ + Dodaj krok ]                  │
│                                    │
│  [ Oblicz kompatybilność ]         │
└────────────────────────────────────┘
```

*(User provided known pH for first & third later; see results.)*

---

## Screen E — Wyniki (ACCEPTANCE EXAMPLE)

*Matches required output: estimated pH `[3.0, 6.0, 5.5]`, deltas `[3.0, 0.5]`, single caution flag, suggested order identical to input.*

```
┌────────────────────────────────────┐
│  ←  Wyniki kompatybilności pH      │
│  Reguły: v1.0.0    Język: [PL] EN  │
│                                    │
│  Kolejność zalecana                │
│  1. L-AA Vitamin C serum  [pH 3.0] │
│     Δ=3.0                          │
│  2. Peptide serum         [pH 6.0] │
│     Δ=0.5                          │
│  3. Moisturizer           [pH 5.5] │
│                                    │
│  Flagi (1)                          │
│  ! Średni: Duży skok pH            │
│    Gdzie: L-AA Vitamin C → Peptide │
│    ID: flag.pHjump.v1              │
│    [ Szczegóły ]                   │
│                                    │
│  Kroki (wyjaśnienia)               │
│  [#] L-AA Vitamin C serum          │
│      klasa: acid  pH:3.0           │
│      źródło: known  id:src.known   │
│      pewność: 1.0                  │
│  [#] Peptide serum                 │
│      klasa: neutral  pH:6.0        │
│      źródło: inferred id:map.peptide.6.0
│      pewność: 0.6  (nazwa zawiera „peptide”)
│  [#] Moisturizer                   │
│      klasa: neutral  pH:5.5        │
│      źródło: known  id:src.known   │
│      pewność: 1.0                  │
│                                    │
│  [Pokaż JSON odpowiedzi]           │
│  [ Zmień kolejność ]  [ Edytuj ]   │
└────────────────────────────────────┘
```

**Delta rendering detail (between tiles):**

```
[ L-AA Vitamin C serum ] [pH 3.0]
          │
          ├── Δ=3.0
          │
[   Peptide serum      ] [pH 6.0]
          │
          ├── Δ=0.5
          │
[    Moisturizer       ] [pH 5.5]
```

**“Pokaż JSON odpowiedzi” (collapsed → expanded):**

```
┌────────────────────────────────────┐
│ JSON (skrót)                       │
│ {                                  │
│  "estimated_ph":[3.0,6.0,5.5],     │
│  "pairwise_deltas":[3.0,0.5],      │
│  "flags":[{                        │
│   "type":"caution","where":"L-AA   │
│   Vitamin C → Peptide","reason":   │
│   "Large pH jump","severity":      │
│   "medium","rule_id":"flag.pH..."}], 
│  "order_suggestion":["L-AA...","Peptide...",
│   "Moisturizer"],                   │
│  "meta":{"rules_version":"1.0.0",  │
│          "locale":"pl-PL"}         │
│ }                                  │
└────────────────────────────────────┘
```

---

## Screen F — Szczegóły flagi (drawer)

```
┌────────────────────────────────────┐
│  ←  Szczegóły: Duży skok pH        │
│  Typ: ostrzeżenie (caution)        │
│  Surowość: medium                  │
│  Reguła: flag.pHjump.v1            │
│  Warunek: prev.ph<3.5 & next.ph>6.0│
│  Wpływ: możliwa niestabilność/      │
│         podrażnienie               │
│  Porada: Jeśli skóra wrażliwa,     │
│         rozważ rozdzielenie dni.   │
│  [ Zamknij ]                       │
└────────────────────────────────────┘
```

---

## Screen G — Zmień kolejność (drag & drop, bez „wait time”)

```
┌────────────────────────────────────┐
│  ←  Sugerowana kolejność           │
│  (Stabilne sortowanie wg koszyków)│
│                                    │
│  1  ≡  [pH 3.0]  L-AA Vitamin C    │
│  2  ≡  [pH 6.0]  Peptide serum     │
│  3  ≡  [pH 5.5]  Moisturizer       │
│                                    │
│  ⟷  Przeciągnij, aby zmienić       │
│                                    │
│  [ Zastosuj tę kolejność ]         │
│  [ Reset do mojej kolejności ]     │
└────────────────────────────────────┘
```

---

## Screen H — Edge: Zero‑knowledge / Neutral only

*(All steps lacked known pH and no patterns matched → show neutral guidance.)*

```
┌────────────────────────────────────┐
│  Wyniki kompatybilności pH         │
│                                    │
│  Neutralna wskazówka               │
│  i  Nie wykryto znanych aktywnych  │
│     ani pH. Zastosowano pH domyślne│
│     (5.5). Brak różnic i flag.     │
│  meta.neutral_guidance = true      │
│                                    │
│  Kolejność ogólna:                 │
│  Neutrale → Bezołowe → Okluzyjne   │
│                                    │
│  [ Dodaj/edytuj aktywne ]          │
└────────────────────────────────────┘
```

---

## Screen I — Edge: AHA/BHA + Retinoid (handoff banner)

```
┌────────────────────────────────────┐
│  Flagi (1)                         │
│  ! Wysoki: Ryzyko podrażnienia     │
│    (AHA/BHA i retinoid w rutynie)  │
│    ID: flag.aha.retinoid.v1        │
│  ——————————————————————————————— │
│  → Sugestia (handoff): Interakcje  │
│    Powód: AHA/BHA + retinoid       │
│    Kroki: "Exfoliating AHA",       │
│           "Anhydrous Retinol"      │
│    [ Otwórz narzędzie: Interakcje ]│
└────────────────────────────────────┘
```

---

## Screen J — Formularz: anhydrous retinoid (null pH)

```
┌────────────────────────────────────┐
│  Krok: Anhydrous Retinol in SQ     │
│  Rozpoznano: anhydrous + retinoid  │
│  Klasa: anhydrous   pH: — (pomij.) │
│  Wyjaśnienie: map.retin.anhyd      │
│  Pewność: 0.7                      │
│  [ OK ]                            │
└────────────────────────────────────┘
```

---

## Screen K — Walidacja (422) i wskazanie pola

```
┌────────────────────────────────────┐
│  Błąd walidacji (422)              │
│  • /steps/1/name: wymagane         │
│  • /steps/0/known_ph: poza 0–14    │
│  [ Popraw i spróbuj ponownie ]     │
│                                    │
│  Krok 1                            │
│  Nazwa* [__________________]  !    │
│  pH [ 17 ]  ! Zakres 0–14          │
│  Aktywne [            ]            │
│  [ Zapisz krok ]                   │
└────────────────────────────────────┘
```

---

## Screen L — Ustawienia / i18n & wyjście deterministyczne

```
┌────────────────────────────────────┐
│  Ustawienia                        │
│  Język: (•) Polski  ( ) English    │
│  Zaokrąglenie pH: ( )0 (•)1 ( )2   │
│  [x] Rozszerzone mapowania         │
│                                    │
│  Nagłówki odpowiedzi               │
│  X-Rules-Version: 1.0.0            │
│  Cache-Control: no-store           │
│                                    │
│  i  Idempotentne: te same dane →   │
│     te same wyniki (brak losowości)│
└────────────────────────────────────┘
```

---

## Screen M — Angielska wersja wyników (sample)

```
┌────────────────────────────────────┐
│  ←  pH Compatibility — Results     │
│  Rules: v1.0.0     Lang: PL [EN]   │
│                                    │
│  Suggested order                   │
│  1. L-AA Vitamin C serum [pH 3.0]  │
│     Δ=3.0                          │
│  2. Peptide serum        [pH 6.0]  │
│     Δ=0.5                          │
│  3. Moisturizer          [pH 5.5]  │
│                                    │
│  Flags (1):                        │
│  ! Medium: Large pH jump           │
│    Where: L-AA Vitamin C → Peptide │
│    ID: flag.pHjump.v1              │
│                                    │
│  Disclaimer: heuristic; not medical│
└────────────────────────────────────┘
```

---

## Screen N — Panel “Jak to działa?” (Explainability)

```
┌────────────────────────────────────┐
│  Jak to działa                     │
│  • ph_est: znane → "src.known"     │
│           brak → reguły map.*      │
│  • Δ: |pH_i - pH_{i+1}|            │
│  • Flagi wg reguł flag.*           │
│  • Klasy: acid / neutral /         │
│           anhydrous / occlusive    │
│                                    │
│  [ Otwórz reguły (v1.0.0) ]        │
└────────────────────────────────────┘
```

---

## Screen O — Stany ładowania i 500

```
┌────────────────────────────────────┐
│  Obliczanie…                       │
│  ⌛ Analiza kroków i reguł v1.0.0   │
│                                    │
│  [ Anuluj ]                        │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│  Błąd serwera (500)                │
│  Spróbuj ponownie. Jeśli trwa,     │
│  sprawdź status narzędzi.          │
│  [ Ponów próbę ]                   │
└────────────────────────────────────┘
```

---

## Component Snippets (for dev handoff)

**Step chip (compact, list & results reuse):**

```
[#] {name}
    [pH {3.0|6.0|—}]  #{tags…}  ⋮
```

**Delta bar (hidden if any side pH=null):**

```
│
├── Δ={n.n}
│
```

**Flag row (severity shades in real UI):**

```
! {severity}: {reason}
  Gdzie/Where: {A} → {B}
  ID: {rule_id}   [Szczegóły]
```

**Handoff card (non‑blocking):**

```
→ Interactions tool
  Reason: AHA/BHA + retinoid
  Steps: ["…","…"]
  [Open]
```

---

## Notes aligning to the spec

* **Stateless & deterministic:** No user data stored; outputs repeatable (v1.0.0).
* **No wait times enforced:** Ordering guidance only; no timers shown.
* **Explainability:** Every step shows `source`, `rule_id`, `confidence`.
* **Edge handling:** Zero‑knowledge “neutral” screen; anhydrous retinoid shows `pH —`.
* **Internationalization:** Polish default with English toggle; all copy translatable.
* **Accessibility:** Text badges for pH, explicit `Δ=…`, focusable `[ Szczegóły ]` and controls.
* **Headers:** Rules/version hints surfaced in UI (dev/debug).
* **Out of scope:** No medical claims; disclaimer present.

---

### Want a printable one‑pager?

I can condense these into a **single A4 ASCII/monospace blueprint** with all primary screens on one sheet.
