> **Canonical references:** `docs/adr/ADR-018-brand-design-system.md`, `docs/adr/ADR-019-frontend-platform.md`

Krótko odpowiadając: **„run inline” = „uruchom w miejscu”** — narzędzie działa bez przechodzenia na osobną podstronę; wynik pojawia się od razu w tej sekcji.

Poniżej masz **360° widok układu** w ASCII z gotową polską kopią (bez opisów technicznych w środku).
**Opis techniczny i biznesowy** znajdziesz **pod ASCII** w markdown.

---

## DESKTOP — pełny układ z kopią

```
WIDTH ≈ 120ch
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ GÓRNY PASEK                                                                                                   │
│ [CLARIVUM ▾ ALT:"Clarivum — nauka w praktyce"]   Narzędzia  Ebooki  Blog  O nas                               │
│ [Szukaj narzędzia (/, ⌘K) ________________________________________________]   🔎     👤     🛒                 │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ STICKY NEWSLETTER                                                                                             │
│ Zapisz się po praktyczne plany:  [□ Skóra] [□ Odżywianie] [□ Nawyki]    e‑mail [_____________] [Zapisz się]  │
│ 0 spamu. Wypiszesz się jednym kliknięciem.  [Polityka prywatności]                                            │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ OSTATNIO UŻYWANE                                                                                              │
│ [UV Index SPF →]  [Kalkulator TDEE →]  [Cel białka →]  [Habit Tracker →]                       [Wyczyść]      │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ HERO                                                                                                          │
│ H1: Uczymy. Upraszczamy. Dowozimy.                                                                            │
│ H2: Wybierz cel albo uruchom narzędzie — wynik masz od razu.                                                  │
│                                                                                                               │
│ ┌───────────────────────────────────────────────┐   ┌───────────────────────────────────────────────────────┐ │
│ │ Szybka diagnostyka                            │   │ Mini narzędzia (wynik na miejscu)                    │ │
│ │ Krok 1:  ● Skóra   ○ Odżywianie   ○ Nawyki     │   │ ┌─────────────────────────────────────────────────┐ │ │
│ │ Krok 2:  [SPF codziennie] [Retinoid] [Trądzik] │   │ │ UV teraz: [ ☀  5.3 ]  • Lokalizacja: [Warszawa]  │ │
│ │           [Bariera] [Wyrównanie tonu]          │   │ │ Rekomendacja: SPF 50.  [Sprawdź szczegóły →]     │ │
│ │ (opcjonalnie) e‑mail [_____________] [Pomiń]   │   │ └─────────────────────────────────────────────────┘ │ │
│ │ [Pokaż plan →]  ✓ Za darmo  ✓ Bez spamu        │   │ ┌─────────────────────────────────────────────────┐ │ │
│ │ “To nie porada medyczna.” [Disclaimer]         │   │ │ TDEE (mini)                                     │ │
│ └───────────────────────────────────────────────┘   │ │ Wzrost [___]  Waga [___]  Płeć [▾]               │ │
│                                                     │ │ [Policz]  • Szacunek: 2350 kcal  • Deficyt: −400 │ │
│                                                     │ │ [Otwórz pełny widok →]                           │ │
│                                                     │ └─────────────────────────────────────────────────┘ │ │
│                                                     │ ┌─────────────────────────────────────────────────┐ │ │
│                                                     │ │ Cel białka (mini)                               │ │
│                                                     │ │ Masa [___]  Aktywność [▾]  → Cel: 120 g/dzień   │ │
│                                                     │ │ [Wyznacz]  [Otwórz pełny widok →]               │ │
│                                                     │ └─────────────────────────────────────────────────┘ │ │
│                                                     └───────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ NARZĘDZIA — SZYBKIE SKRÓTY                                                                                     │
│ ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐   │
│ | UV Index SPF           | | Planner retinoidów     | | Składniki Checker      | | Kalkulator TDEE        |   │
│ | Dobierz SPF na dziś.   | | Rozpisz bez podrażnień.| | Wpisz INCI i sprawdź.  | | Policz zapotrzebowanie.|   │
│ | [Szybki wynik] [Otwórz]| | [Szybki wynik] [Otwórz]| | [Otwórz]               | | [Szybki wynik] [Otwórz]|   │
│ └────────────────────────┘ └────────────────────────┘ └────────────────────────┘ └────────────────────────┘   │
│ ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐   │
│ | Cel białka             | | Planer posiłków        | | Habit Tracker          | | Kalkulator snu         |   │
│ | Wyznacz dzienny cel.   | | 7 dni z zakupami.      | | Małe kroki, postęp.    | | Okna i cykle snu.      |   │
│ | [Szybki wynik] [Otwórz]| | [Otwórz]               | | [Otwórz]               | | [Otwórz]               |   │
│ └────────────────────────┘ └────────────────────────┘ └────────────────────────┘ └────────────────────────┘   │
│ Wolisz pełną listę?  [Zobacz wszystkie narzędzia →]                                                           │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PLAN — PO WYBORZE                                                                                             │
│ Twój plan na start: [obszar] → [cel] (14 dni)     [Zapisz jako PDF]  [Otwórz narzędzie kluczowe →]            │
│ Dni 1–3: …  •  Dni 4–7: …  •  Dni 8–14: …                                                                      │
│ Narzędzia: [Planner retinoidów]  [UV Index SPF]  [Składniki Checker]                                          │
│ Czytaj dalej: [Zacznij tutaj]  [Przewodnik]  [Porównanie]                                                     │
│ “Edukacyjnie, nie zastępuje konsultacji.”  [Disclaimer medyczny]                                              │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SUBBRANDY                                                                                                      │
│ ┌───────────────────────────────┐ ┌───────────────────────────────┐ ┌───────────────────────────────┐         │
│ | SKIN                          | | FUEL                          | | HABITS                        |         │
│ | Rutyny oparte na faktach.     | | Makra bez spiny.              | | Małe kroki, duże efekty.      |         │
│ | [Wejdź → /skin/]              | | [Wejdź → /fuel/]              | | [Wejdź → /habits/]            |         │
│ └───────────────────────────────┘ └───────────────────────────────┘ └───────────────────────────────┘         │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DOWODY I ZAUFANIE                                                                                            │
│ “Wreszcie mam plan, który trzymam dłużej niż tydzień.” — A.K.                                                 │
│ “Prosto, konkretnie, bez szumu.” — M.P.                                                                       │
│ [logo1] [logo2] [logo3]   •  [Metodologia redakcyjna]  •  [Jak zarabiamy]                                    │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ EBOOKI                                                                                                        │
│ [Okładka] Retinoid bez paniki — Bezpieczny start i progresja.   [Zobacz →]                                   │
│ [Okładka] Makra bez spiny   — Jedz normalnie, licz mądrze.      [Zobacz →]                                   │
│ [Okładka] Sen w 14 krokach  — Protokół na realne życie.         [Zobacz →]                                   │
│ [Zobacz cały katalog →]                                                                                       │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ GLOBAL CTA                                                                                                    │
│ Chcesz gotowy plan?  [Uruchom diagnostykę]   lub   [Przejdź do narzędzi]                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ STOPKA                                                                                                        │
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP                           │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  [Zarządzaj cookies]                                  │
│ © Clarivum. Wszelkie prawa zastrzeżone.                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## MOBILE — pełny układ z kopią (≤ 414 px)

```
┌─────────────────────────────┐
│ [≡]  CLARIVUM        🔎   🛒 │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Newsletter: “Plany na e‑mail?” [Skóra][Odżyw.][Nawyki] [________] [Zapisz] [×]                              │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Ostatnio: [UV] [TDEE] [Białko] [Więcej]                                                                      │
└─────────────────────────────┘
┌─────────────────────────────┐
│ H1: Uczymy. Upraszczamy. Dowozimy.                                                                            │
│ Wybierz cel albo użyj narzędzia:                                                                              │
│ ● Skóra   ○ Odżywianie   ○ Nawyki                                                                              │
│ [SPF] [Retinoid] [Trądzik] [Bariera] [Ton]  ⇢ przewijaj                                                       │
│ e‑mail (opcjonalnie) [________]  [Pokaż plan]  [Pomiń]                                                        │
│ “To nie porada medyczna.” [Disclaimer]                                                                         │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Mini narzędzia                                                                                        │
│ • UV: dziś [5.3] — SPF 50.  [Szczegóły →]                                                             │
│ • TDEE: [Policz]  → Szacunek: 2350 kcal   [Otwórz →]                                                  │
│ • Cel białka: [Wyznacz]  → 120 g/dzień   [Otwórz →]                                                   │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Narzędzia (siatka 2 kol.)                                                                             │
│ [UV Index]   [Planner retinoidów]                                                                     │
│ [Checker]    [TDEE]                                                                                   │
│ [Cel białka] [Planer posiłków]                                                                        │
│ [Tracker]    [Sen]                                                                                    │
│ [Zobacz wszystkie →]                                                                                  │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Subbrandy:  [SKIN →]  [FUEL →]  [HABITS →]                                                             │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Dowody i prasa: “Prosto, konkretnie.” — M.P.   [logo1][logo2][logo3]                                  │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Ebooki                                                                                                 │
│ • Retinoid bez paniki  [Zobacz]                                                                        │
│ • Makra bez spiny      [Zobacz]                                                                        │
│ • Sen w 14 krokach     [Zobacz]                                                                        │
│ [Katalog →]                                                                                           │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Stopka: Polityki • CMP • Kontakt                                                                        │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Dół ekranu (sticky):  [Narzędzia]   [Szukaj]   [Ostatnie]                                                │
└─────────────────────────────┘
```

---

# Opis techniczny i biznesowy (markdown)

## Co oznacza „Szybki wynik (inline)”

* **Uruchomienie w miejscu**: narzędzie działa w obrębie bieżącej sekcji strony, bez przejścia na osobną podstronę.
* **Dla kogo**: UV, TDEE, Cel białka, Planner retinoidów (wersja skrócona).
* **Po co**: zrywa tarcie i pokazuje wartość w ≤20 s. Zawsze dostępny też przycisk **„Otwórz”** do pełnej wersji.

## Zachowanie kluczowych elementów

* **Wizytujący pierwszy raz**: hero widoczny w całości; mini narzędzia po prawej.
* **Powracający**: pasek „Ostatnio używane” nad hero; hero może być krótszy.
* **Plan po diagnostyce**: renderuje się pod hero; przyciski: **Zapisz jako PDF**, **Otwórz narzędzie kluczowe**.
* **Newsletter**: cienki pasek; główna prośba o e‑mail pojawia się też po udanym wyniku/planu („Wyślij wynik na e‑mail?”).
* **UV**: po zgodzie geolokalizacja; bez zgody domyślnie Warszawa z możliwością zmiany.

## Instrumentacja (Plausible)

**Zdarzenia**

* `diag_start`, `diag_select_area`, `diag_select_goal`, `diag_email_entered`,
  `plan_generate_click`, `plan_view`,
* `tool_card_view`, `tool_card_click`,
* `inline_tool_start`, `inline_tool_result`, `inline_open_full`,
* `recent_tool_click`, `search_used`, `command_palette_open`, `command_palette_select`,
* `newsletter_submit`, `newsletter_dismiss`,
* `footer_policy_view`, `ebook_card_click`, `subbrand_card_click`.

**Parametry**

* `area: skin|fuel|habits`, `goal`, `tool_id`, `cta_location: hero|tools_grid|plan|header`,
* `position_index`, `from_mode: first_visit|returning`, `ab_variant`, `has_consent_marketing`.

**UTM domyślne**
`utm_source=web&utm_medium=homepage&utm_campaign=tools_first_2025-10&utm_content={sekcja}_{karta}`

## Kopiowalna biblioteka tekstów (PL)

**Nawigacja**

* `Narzędzia`, `Ebooki`, `Blog`, `O nas`, `Szukaj narzędzia (/, ⌘K)`

**Hero**

* H1: `Uczymy. Upraszczamy. Dowozimy.`
* H2: `Wybierz cel albo uruchom narzędzie — wynik masz od razu.`
* E‑mail label: `e‑mail (opcjonalnie)`
* Przyciski: `Pokaż plan`, `Pomiń`

**Mini narzędzia (etykiety i wyniki)**

* UV: `UV teraz: {x} • Lokalizacja: {miasto}`  /  `Rekomendacja: SPF 50.`

  * CTA: `Sprawdź szczegóły →`
* TDEE: `Wzrost`, `Waga`, `Płeć`, `Policz`, `Szacunek: {kcal} kcal`, `Deficyt: −{kcal}`

  * CTA: `Otwórz pełny widok →`
* Cel białka: `Masa`, `Aktywność`, `Wyznacz`, `Cel: {g}/dzień`

  * CTA: `Otwórz pełny widok →`

**Karty narzędzi (8 szt.)**

* UV Index SPF — `Dobierz SPF na dziś.`  — `[Szybki wynik] [Otwórz]`
* Planner retinoidów — `Rozpisz bez podrażnień.` — `[Szybki wynik] [Otwórz]`
* Składniki Checker — `Wpisz INCI i sprawdź.` — `[Otwórz]`
* Kalkulator TDEE — `Policz zapotrzebowanie.` — `[Szybki wynik] [Otwórz]`
* Cel białka — `Wyznacz dzienny cel.` — `[Szybki wynik] [Otwórz]`
* Planer posiłków — `7 dni z zakupami.` — `[Otwórz]`
* Habit Tracker — `Małe kroki, postęp.` — `[Otwórz]`
* Kalkulator snu — `Okna i cykle snu.` — `[Otwórz]`

**Plan (po wygenerowaniu)**

* Tytuł: `Twój plan na start: {obszar} → {cel} (14 dni)`
* CTA: `Zapisz jako PDF`, `Otwórz narzędzie kluczowe →`
* Dodatki: `Zacznij tutaj`, `Przewodnik`, `Porównanie`

**Subbrandy**

* SKIN: `Rutyny oparte na faktach.` / CTA: `Wejdź → /skin/`
* FUEL: `Makra bez spiny.` / CTA: `Wejdź → /fuel/`
* HABITS: `Małe kroki, duże efekty.` / CTA: `Wejdź → /habits/`

**Newsletter**

* Pasek: `Zapisz się po praktyczne plany:` `[Skóra][Odżywianie][Nawyki]` `e‑mail` `[Zapisz się]`
* Pomocnicze: `0 spamu. Wypiszesz się jednym kliknięciem.`
* Po wysłaniu: `Dzięki! Sprawdź skrzynkę (czasem „Oferty/Promocje”).`
* Po wynikach/planu: `Wyślij wynik na e‑mail?` `[Tak] [Nie teraz]`

**Dowody i polityki**

* Cytaty: `Wreszcie mam plan, który trzymam dłużej niż tydzień.` — `Prosto, konkretnie, bez szumu.`
* Linki: `Metodologia redakcyjna`, `Jak zarabiamy`, `Disclaimer medyczny`

**Stopka**

* `O nas`, `Polityka prywatności`, `Polityka cookies`, `Disclaimer medyczny`, `CMP`,
  `Kontakt`, `Reklama`, `Kariera`, `RSS`, `Sitemap`, `Zarządzaj cookies`
* Copyright: `© Clarivum. Wszelkie prawa zastrzeżone.`

**Dół ekranu (mobile)**

* `Narzędzia`, `Szukaj`, `Ostatnie`

**YMYL (krótko)**

* `Treści Clarivum mają charakter edukacyjny i nie stanowią porady medycznej, dietetycznej ani psychologicznej.`

## Stany i logika (skrót)

* **Maszyna stanów**: `idle → area_selected → goal_selected (+/− email) → generating → plan_shown`.
* **Powracający**: jeśli istnieje `cv_recent_tools`, pokazuj „Ostatnio używane”.
* **Personalizacja**: kolejność kart po zgodzie marketingowej; w przeciwnym razie domyślna.
* **Przechowywanie**:
  `cv_recent_tools`, `cv_last_area_goal`, `cv_hide_newsletter_until`.

## Dostępność i wydajność

* Klawiszologia: `/` i `⌘K` otwierają wyszukiwarkę/paletę.
* Widoczne focusy, aria‑label na kartach i przyciskach, przyjazne dla screen readerów.
* Lazy‑load pełnych narzędzi; mini wersje liczą lokalnie; cel LCP ≤ 1,8 s.

## SEO i dane strukturalne

* Title: `Clarivum — praktyczne narzędzia i plany: Skóra • Odżywianie • Nawyki`
* Meta: `Uczymy. Upraszczamy. Dowozimy. Zrób krótką diagnostykę i od razu korzystaj z narzędzi…`
* Schema: `Organization`, `BreadcrumbList`, `ItemList` (lista narzędzi), `Product/CreativeWork` dla ebooków (na listingu).

---

Jeśli chcesz, w kolejnym kroku przygotuję gotowe **stuby komponentów (TSX)** z propami pod analitykę i dokładnym mapowaniem na tę kopię.
