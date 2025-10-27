Below are **mobile‑first ASCII wireframes** for the **Actives Interaction Checker** at
`/skin/narzedzia/interakcje-skladnikow/`.
They cover empty state → input → results (grouped by severity) → expand/explain → export/share, plus the key variants and error states required by the spec.

> **Conventions / Legend**
>
> * Severity icons: **✖ UNIKAJ (hard_avoid)** · **⚠ OSTROŻNIE (caution)** · **✓ OK**
> * [chip] = matched active (tap to see canonical mapping)
> * ⓘ / ⤓ / ⎘ = info / download / copy
> * “(sticky)” marks headers intended to stick to top on scroll
> * All interactive rows are keyboard reachable; focused item shown with **[▶]** caret

---

## SCREEN A — Empty State (PL, Mobile First)

```
┌──────────────────────────────────────────────────────────┐
│ Interakcje Składników                                    │
│ /skin/narzedzia/interakcje-skladnikow/                   │
├──────────────────────────────────────────────────────────┤
│ Analizuj listę INCI i sprawdź interakcje aktywów.        │
│ (Nie stanowi porady medycznej.)                          │
│                                                          │
│ INCI (wpisz lub wklej)                                   │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Np.: aqua, ascorbic acid, benzoyl peroxide,         │ │
│ │ glycolic acid                                       │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Kontekst                                                 │
│ [ ] Ciąża (pregnancy)    [ ] Skóra wrażliwa              │
│                                                             
│ Język / Language: [ Polski v ]                           │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Sprawdź interakcje  (disabled until input)         │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Przykłady: [BPO + L‑AA] [Retinoid + AHA] [OK zestawy]     │
│                                                          │
│ ℹ︎ Wskazówka: oddzielaj składniki przecinkami lub średnikami. │
└──────────────────────────────────────────────────────────┘
```

**A11y notes:**

* Page landmark roles: `header`, `main`, `form`, `region[label='Kontekst']`.
* Button has `aria-disabled="true"` until textarea has ≥1 token.

---

## SCREEN B — Input Filled (Before Submit)

```
┌──────────────────────────────────────────────────────────┐
│ Interakcje Składników                                    │
├──────────────────────────────────────────────────────────┤
│ INCI                                                     │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ aqua, ascorbic acid, benzoyl peroxide, glycolic acid │ │
│ └──────────────────────────────────────────────────────┘ │
│ Kontekst                                                 │
│ [ ] Ciąża  [x] Skóra wrażliwa                            │
│ Język: [ Polski v ]                                      │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │  Sprawdź interakcje  (primary)                       │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Rozpoznane aktywy (podgląd):                             │
│ [Ascorbic Acid | L‑AA] [Benzoyl Peroxide | BPO] [AHA]    │
│ Nierozpoznane: –                                         │
└──────────────────────────────────────────────────────────┘
```

---

## SCREEN C — Results (Counts + Chips + Grouped by Severity)

*(Example matches acceptance case: `ascorbic acid + benzoyl peroxide`, plus an extra `AHA` that triggers the separate **caution** rule for L‑AA + AHA)*

```
┌──────────────────────────────────────────────────────────┐
│ Interakcje Składników                                    │
├───────────────────────────── (sticky) ───────────────────┤
│ ✖ Unikaj (1)   ⚠ Ostrożnie (1)   ✓ OK (0)    ⤓ Eksport   │
├──────────────────────────────────────────────────────────┤
│ Twoja lista (tap to edit)                                │
│ [Ascorbic Acid | L‑AA] [Benzoyl Peroxide | BPO] [AHA]    │
│ Kontekst: Ciąża: NIE · Skóra wrażliwa: TAK · Język: PL   │
│ Wersja reguł: 2025.10.23                                 │
├──────────────────────────────────────────────────────────┤
│ ✖ UNIKAJ (1) (sticky)                                    │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Pair: [BPO] + [Ascorbic Acid | L‑AA]                 │ │
│ │ Dlaczego: możliwa dezaktywacja/utlenienie L‑AA       │ │
│ │ Co robić: Stosuj o różnych porach/dniach lub         │ │
│ │           wybierz pochodną wit. C                    │ │
│ │ Id: R-BPO-LAA-01 · Wersja: 2025.10.23                │ │
│ │ [Pokaż szczegóły ▸]                                   │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ⚠ OSTROŻNIE (1) (sticky)                                 │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Pair: [Ascorbic Acid | L‑AA] + [AHA]                 │ │
│ │ Dlaczego: niskie pH + kumulacja drażniąca            │ │
│ │ Co robić: Rozdziel aplikacje (np. AM wit. C, PM AHA) │ │
│ │ Id: R-LAA-ACIDS-01 · Wersja: 2025.10.23              │ │
│ │ [Pokaż szczegóły ▸]                                   │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ✓ OK (0)                                                 │
│ Brak pozycji do pokazania.                               │
│                                                          │
│ Notatki: —                                               │
│                                                          │
│ [⎘ Kopiuj tekst] [⎘ Kopiuj JSON] [🖨 Drukuj] [↗ Udostępnij] │
└──────────────────────────────────────────────────────────┘
```

---

## SCREEN D — Flag “Explain” Expanded (Details, Confidence, ARIA)

```
┌──────────────────────────────────────────────────────────┐
│ ✖ UNIKAJ (1)                                             │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Pair: [BPO] + [Ascorbic Acid | L‑AA]                 │ │
│ │ ───────────────────────────────────────────────────  │ │
│ │ WYJAŚNIENIE (aria-expanded="true")                   │ │
│ │ • Dlaczego: Witamina C (L‑AA) może ulec             │ │
│ │   dezaktywacji/utlenieniu w obecności BPO.          │ │
│ │ • Co robić: oddziel porami/dniami lub użyj          │ │
│ │   pochodnej (SAP, MAP, 3‑O‑ethyl, THD/ATIP).        │ │
│ │ • confidence_hint: medium                           │ │
│ │ • rule_id: R-BPO-LAA-01 · version: 2025.10.23       │ │
│ │ • Link „Kopiuj dla klinicysty”                       │ │
│ │ [Zamknij szczegóły ▾]                                │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## SCREEN E — Export / Share Bottom Sheet

```
┌──────────────────────────────────────────────────────────┐
│ ⤓ Eksport i udostępnianie                               │
│ ───────────────────────────────────────────────────────  │
│ [⎘ Kopiuj tekst]   [⎘ Kopiuj JSON]   [🖨 Drukuj]           │
│                                                          │
│ JSON (podgląd):                                          │
│ { "flags":[{ "severity":"hard_avoid", "pair":["bpo",     │
│ "ascorbic acid"], "rule_id":"R-BPO-LAA-01", "version":   │
│ "2025.10.23"}], "unmatched_tokens":[], "notes":[] }      │
│                                                          │
│ [ Zamknij ]                                              │
└──────────────────────────────────────────────────────────┘
```

---

## SCREEN F — Short INCI Variant (Spec §E & X.9)

```
┌──────────────────────────────────────────────────────────┐
│ Wyniki dla: [Retinol]                                    │
├──────────────────────────────────────────────────────────┤
│ Notatki                                                  │
│ • Short INCI; interaction check may miss context.        │
│                                                          │
│ ✖ UNIKAJ (0)  ⚠ OSTROŻNIE (0)  ✓ OK (0)                  │
│ Brak dopasowanych par do wyświetlenia.                   │
│ [Edytuj listę]                                           │
└──────────────────────────────────────────────────────────┘
```

---

## SCREEN G — Pregnancy Solo Rule (Spec §B.3, §X.8)

```
┌──────────────────────────────────────────────────────────┐
│ INCI: [Tazarotene] [Caprylic/Capric Triglyceride]        │
│ Kontekst: Ciąża: TAK  · Skóra wrażliwa: NIE              │
├──────────────────────────────────────────────────────────┤
│ ✖ UNIKAJ (1)                                             │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Solo: [Tazarotene]                                   │ │
│ │ Dlaczego: retinoid na receptę przeciwwskazany        │ │
│ │ w ciąży                                              │ │
│ │ Co robić: Nie używać; skonsultuj z klinicystą        │ │
│ │ Id: R-TAZ-PREG-01 · Wersja: 2025.10.23               │ │
│ └──────────────────────────────────────────────────────┘ │
│ ⚠ OSTROŻNIE (0)  ✓ OK (0)                                │
└──────────────────────────────────────────────────────────┘
```

---

## SCREEN H — Derivative Exemption (Spec §X.2)

```
┌──────────────────────────────────────────────────────────┐
│ INCI: [Sodium Ascorbyl Phosphate] [Benzoyl Peroxide]     │
├──────────────────────────────────────────────────────────┤
│ ✖ UNIKAJ (0)                                             │
│ (Brak hard‑avoid: pochodna wit. C nie podlega regule     │
│  BPO + L‑AA)                                             │
│ ⚠ OSTROŻNIE (0)  ✓ OK (0)                                │
│ Nierozpoznane: —                                         │
│ [⎘ Kopiuj JSON] [Edytuj listę]                          │
└──────────────────────────────────────────────────────────┘
```

---

## SCREEN I — Copper Peptide + L‑AA (Confidence = low; Spec §Z)

```
┌──────────────────────────────────────────────────────────┐
│ INCI: [Copper Tripeptide‑1 | GHK‑Cu] [Ascorbic Acid]     │
├──────────────────────────────────────────────────────────┤
│ ⚠ OSTROŻNIE (1)                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Pair: [Copper Peptide] + [Ascorbic Acid | L‑AA]      │ │
│ │ Dlaczego: potencjalna niestabilność/reakcja          │ │
│ │ Co robić: Rozdziel aplikacje (AM/PM lub co drugi dzień)││
│ │ confidence_hint: low                                 │ │
│ │ Id: R-CU-LAA-01 · Wersja: 2025.10.23                 │ │
│ └──────────────────────────────────────────────────────┘ │
│ ✖ UNIKAJ (0)  ✓ OK (0)                                  │
└──────────────────────────────────────────────────────────┘
```

---

## SCREEN J — “OK” Combos (Spec §X.7, with sensitive skin note)

```
┌──────────────────────────────────────────────────────────┐
│ INCI: [Niacinamide] [Ascorbic Acid] [Azelaic Acid]       │
│       [Salicylic Acid | BHA]                             │
│ Kontekst: Skóra wrażliwa: TAK                            │
├──────────────────────────────────────────────────────────┤
│ ✓ OK (2)                                                 │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Pair: [Niacinamide] + [Ascorbic Acid | L‑AA]         │ │
│ │ Uwaga: czasem chwilowe zabarwienie/zapach             │ │
│ └──────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Pair: [Azelaic Acid] + [BHA]                         │ │
│ │ Uwaga: kumulacja drażniąca możliwa                   │ │
│ └──────────────────────────────────────────────────────┘ │
│ Notatki                                                 │
│ • Skóra wrażliwa: rozważ nie łączyć wielu silnych       │
│   aktywów jednocześnie w tym samym wieczorze.           │
└──────────────────────────────────────────────────────────┘
```

---

## SCREEN K — Errors (Spec §E)

```
┌──────────────────────────────────────────────────────────┐
│ ⚠ Błąd                                                  │
├──────────────────────────────────────────────────────────┤
│ • 400 bad_request: Pole 'inci_list' jest wymagane.      │
│   [Powrót do formularza]                                │
├──────────────────────────────────────────────────────────┤
│ • 413 input_too_large: INCI > 5000 znaków lub > 300     │
│   tokenów. Podziel listę i spróbuj ponownie.            │
│   [Otwórz wskazówki dzielenia listy]                    │
├──────────────────────────────────────────────────────────┤
│ • unable_to_parse_inci: Nieobsługiwane znaki.           │
│   Oczyszczone wejście: “… retinol, glycolic acid …”     │
│   [Użyj wersji oczyszczonej] [Edytuj ręcznie]           │
└──────────────────────────────────────────────────────────┘
```

---

## SCREEN L — English Locale (i18n toggle)

```
┌──────────────────────────────────────────────────────────┐
│ Actives Interaction Checker                              │
│ Language: [ English v ]                                  │
├──────────────────────────────────────────────────────────┤
│ ✖ Avoid (1)    ⚠ Caution (1)   ✓ OK (0)                  │
│ Input: [Ascorbic Acid] [Benzoyl Peroxide] [AHA]          │
│ Rules version: 2025.10.23                                │
├──────────────────────────────────────────────────────────┤
│ ✖ AVOID                                                 │
│ Pair: [BPO] + [L‑AA]                                     │
│ Why: Possible deactivation/oxidation of L‑AA             │
│ Action: Separate times/days or choose a derivative       │
│ Id: R-BPO-LAA-01                                         │
│                                                          │
│ ⚠ CAUTION                                               │
│ Pair: [L‑AA] + [AHA]                                     │
│ Why: Low‑pH stacking; potential irritation               │
│ Action: Separate (AM vit. C / PM acids)                  │
└──────────────────────────────────────────────────────────┘
```

---

## COMPONENT NOTES (for build alignment with spec)

* **Chips**
  `[Display Name | Canonical/Group]`
  Tap → tooltip/sheet: *“Synonyms: … Groups: retinoid; subtype: adapalene”*.

* **Flag Card Data Fields (bound to API)**

  * `severity` → icon/text from i18n map
  * `pair` or `solo`
  * `why`, `action` (locale)
  * `rule_id`, `version`, optional `details` (e.g., `retinoid_subtype`)
  * `confidence_hint` shown when present (e.g., copper peptide)

* **Sticky group headers** for `UNIKAJ / OSTROŻNIE / OK` with counts.

* **Export**: “Copy text”, “Copy JSON”, “Print”. Includes `unmatched_tokens` & `notes`.

* **A11y**

  * Icons always paired with text (“Avoid/Caution/OK”).
  * All cards `role="listitem"`, groups `role="list"` with `aria-label`.
  * Buttons have visible focus; long text supports dynamic type.

* **Privacy**

  * No raw INCI stored by default; export via client only.

---

## TEST FLOWS COVERED (tie to Acceptance Criteria)

1. **BPO + L‑AA** → Screen C/D shows **exactly one** ✖ **UNIKAJ** for that pair (no OK overrides).
2. **Derivative exemption** (`SAP + BPO`) → Screen H shows **no** hard‑avoid.
3. **Pregnancy solo** (`tazarotene` + `pregnancy=true`) → Screen G shows ✖ solo flag.
4. **Single token** (`retinol`) → Screen F shows **Short INCI** note and no pairs.

---

### Bonus: Compact “Rules Version” Toast (optional)

A small non-modal banner can appear after results load:

```
[ℹ︎] Wyniki wg zestawu reguł 2025.10.23  [Zobacz changelog]
```

---

If you’d like, I can adapt these wireframes into **copy‑pasteable HTML skeletons** (still mobile‑first, semantic, and accessible) or into a **Figma-ready annotation list** that mirrors this structure.
