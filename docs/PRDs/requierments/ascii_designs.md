# ASCII Designs & Narrative Concepts

> **Canonical decisions:** Follow the brand system in `docs/adr/ADR-018-brand-design-system.md` and the frontend platform in `docs/adr/ADR-019-frontend-platform.md`.

A tools‑first homepage proves value in ≤20 s, builds **mental availability** (jasne kody pionów) and **physical availability** (głęboki dostęp do narzędzi), while the optional capture respects autonomy—users stay, explore, i wracają.

---

## Forward look — **pełna kopia + szczegółowy projekt ASCII + interakcje**

### 1) Desktop — szczegółowy układ ASCII z gotową kopią

```
WIDTH ≈ 120ch
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP NAV                                                                                                      │
│ [CLARIVUM ▾LOGO ALT:"Clarivum — nauka w praktyce"]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎  │
│                                                                                                       👤 🛒  │
│ Sticky utility (on scroll): [logo]  Narzędzia  Ebooki  Szukaj  — reszta w menu ≡                                                                │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ STICKY NEWSLETTER (cienki pasek, zamykalny [×], nie zasłania hero)                                           │
│ Zapisz się po praktyczne plany (wybierz pion): [□ Skin] [□ Fuel] [□ Habits]  e‑mail [__________] [Zapisz się]│
│ Tekst pomocniczy: “0 spamu. Wypiszesz się jednym kliknięciem.”  [Polityka prywatności]                       │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ HERO — SZYBKA DIAGNOSTYKA (≤20 s)                                                                            │
│ H1: Uczymy. Upraszczamy. Dowozimy.                                                                           │
│ H2: Zrób 3 krótkie kroki — pokażemy gotowy plan + narzędzia.                                                 │
│                                                                                                              │
│ Krok 1. Wybierz obszar:   (radio)  ● Skóra   ○ Odżywianie   ○ Nawyki                                         │
│ Krok 2. Cel: (dynamiczne chipsy wg obszaru)                                                                  │
│  • Skóra: [SPF codziennie] [Retinoid bez podrażnień] [Trądzik] [Odbudowa bariery] [Wyrównanie tonu]          │
│  • Odżywianie: [TDEE i deficyt] [Cel białka] [Mądre przekąski] [Plan posiłków]                               │
│  • Nawyki: [Sen 7–9 h] [Poranek bez scrolla] [Redukcja stresu] [Aktywność 150’]                              │
│ Krok 3. (opcjonalnie) e‑mail → wyślemy Twój plan PDF + przypomnienia.  [pole e‑mail _________] [Pomiń]      │
│ [Generuj plan →]   Badges: ✓ Za darmo  ✓ Bez spamu  ✓ Oparte na dowodach                                     │
│ Microcopy: “To nie porada medyczna. Zobacz nasz [Disclaimer medyczny].”                                      │
│ Widżet UV: geolokalizacja → pokazujemy bieżący indeks UV; brak zgody = domyślnie Warszawa + manualna zmiana. (Spec: docs/PRDs/requierments/tools/widget_indeks_uv.md) │
│                                                                                                  ┌─────────────────────────┐  │
│                                                                                                  │ UV & POGODA             │  │
│                                                                                                  │ UV teraz: [  ☀  5.3 ]   │  │
│                                                                                                  │ Lokalizacja: [Warszawa] │  │
│                                                                                                  │ Jeśli udostępnisz ->    │  │
│                                                                                                  │ pokażemy Twoje miasto.  │  │
│                                                                                                  └─────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ NARZĘDZIA — NAJSZYBSZE SKRÓTY (8 kafelków, ikonki, 1 zdanie, CTA)                                            │
│ ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐   │
│ | UV Index SPF           | | Planner retinoidów     | | Składniki Checker      | | Kalkulator TDEE        |   │
│ | Sprawdź UV dziś i      | | Ułóż dawkę i częstot-  | | Wpisz INCI i zobacz    | | Oblicz zapotrzebowanie |   │
│ | dobierz SPF.           | | liwość bez podrażnień. | | zgodność + alerty.     | | i sugerowany deficyt.  |   │
│ | [Otwórz →]             | | [Otwórz →]             | | [Otwórz →]             | | [Otwórz →]             |   │
│ └────────────────────────┘ └────────────────────────┘ └────────────────────────┘ └────────────────────────┘   │
│ ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐   │
│ | Cel białka             | | Planer posiłków        | | Habit Tracker          | | Kalkulator snu          |   │
│ | Dobierz g/dzień do     | | 7‑dniowy jadłospis z   | | Buduj nawyki z          | | Wyznacz okna i cykle.   |   │
│ | celu i preferencji.    | | makrami i zakupami.    | | przypomnieniami.        | | [Otwórz →]              |   │
│ | [Otwórz →]             | | [Otwórz →]             | | [Otwórz →]              | |                          |   │
│ └────────────────────────┘ └────────────────────────┘ └────────────────────────┘ └────────────────────────┘   │
│ Link: Wolisz pełną listę? → [Zobacz wszystkie narzędzia]                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SUBBRANDS — KIM JESTEŚ I CZEGO SZUKASZ? (3 karty, kolorystycznie kodowane)                                  │
│ ┌───────────────────────────────┐ ┌───────────────────────────────┐ ┌───────────────────────────────┐        │
│ | SKIN                          | | FUEL                          | | HABITS                        |        │
│ | Rutyny oparte na dowodach.    | | Makra bez spiny.              | | Małe kroki, duże efekty.      |        │
│ | Retinoid bez paniki. SPF      | | TDEE, białko, rozsądne        | | Sen, stres, aktywność —       |        │
│ | codziennie — łatwo.           | | wybory z półki.               | | narzędzia zamiast haseł.      |        │
│ | [Wejdź → /skin/]              | | [Wejdź → /fuel/]              | | [Wejdź → /habits/]            |        │
│ └───────────────────────────────┘ └───────────────────────────────┘ └───────────────────────────────┘        │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DOWODY I ZAUFANIE                                                                                             │
│ “Dzięki Clarivum wreszcie mam plan, który trzymam dłużej niż tydzień.” — A.K.                                 │
│ “Proste wyjaśnienia, konkretne narzędzia. Bez szumu.” — M.P.                                                   │
│ Pasek mediów: [logo_prasy_1] [logo_prasy_2] [logo_prasy_3]  •  Zobacz naszą [Metodologię redakcyjną].         │
│ Uwaga YMYL: Treści edukacyjne; nie zastępują konsultacji ze specjalistą.                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ EBOOKI — POGŁĘB WIEDZĘ                                                                                        │
│ [Okładka] Retinoid bez paniki (SKIN)  — “Bezpieczny start i progresja.”  [Zobacz →]                           │
│ [Okładka] Makra bez spiny (FUEL)       — “Jedz normalnie, licz mądrze.”   [Zobacz →]                           │
│ [Okładka] Sen w 14 krokach (HABITS)    — “Protokół na realne życie.”      [Zobacz →]                           │
│ [Zobacz cały katalog → /ebooks/]                                                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ GLOBAL CTA (sekcja powtórzona lekko niżej)                                                                    │
│ “Chcesz gotowy plan?”  [Uruchom diagnostykę →]    lub   [Przejdź do narzędzi → /narzedzia/]                   │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ STOPKA                                                                                                        │
│ O nas  •  Jak zarabiamy  •  Disclaimer medyczny  •  Polityka prywatności  •  Polityka cookies  •  CMP        │
│ Kontakt • Reklama • Kariera • RSS • Sitemap • Ustawienia prywatności [Zarządzaj cookies]                      │
│ © Clarivum. Wszelkie prawa zastrzeżone.                                                                        │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2) Mobile — szczegółowy układ ASCII z kopią (≤ 414 px)

```
┌─────────────────────────────┐
│ [≡] [CLARIVUM]        🔎  🛒 │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Sticky newsletter (mini):   │
│ “Plany na e‑mail?” [Skin][Fuel][Habits] [____] [Zapisz] [×]             │
└─────────────────────────────┘
┌─────────────────────────────┐
│ H1: Uczymy. Upraszczamy.     │
│ H2: Zrób 3 kroki — dostaniesz│
│ plan + narzędzia.            │
│ Krok1:  ● Skóra  ○ Odżyw. ○Nawyki │
│ Krok2 (scroll chips): [SPF] [Retinoid] [Trądzik] [Bariera] [Ton]        │
│ Krok3 (opcjonalnie): e‑mail [____] [Pomiń]                              │
│ [Generuj plan →]  ✓Za darmo ✓Bez spamu                                  │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Narzędzia (siatka 2 kol.):  │
│ [UV Index]   [Planner retinoidów]                                        │
│ [Checker]    [TDEE]                                                      │
│ [Cel białka] [Planer pos.]                                               │
│ [Tracker]    [Sen]                                                       │
│ [Zobacz wszystkie →]                                                     │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Subbrandy (karuzela kart):  │
│ [SKIN →] [FUEL →] [HABITS →]│
└─────────────────────────────┘
┌─────────────────────────────┐
│ Dowody i prasa (pasek)      │
│ “Proste wyjaśnienia…” — M.P.│
│ [logo1][logo2][logo3]       │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Ebooki (3 karty):           │
│ [Okł.] Retinoid… [Zobacz]   │
│ [Okł.] Makra…    [Zobacz]   │
│ [Okł.] Sen…      [Zobacz]   │
│ [Katalog →]                   │
└─────────────────────────────┘
┌─────────────────────────────┐
│ Stopka + polityki + CMP     │
└─────────────────────────────┘
```

---

### 3) Interakcje i stany (funkcjonalne, bez kodu)

**Diagnostyka (hero)**

* **State machine**: `idle → area_selected → goal_selected(+/- email) → generating → plan_shown`.
* **Bez przymusu e‑maila**: kliknięcie **[Pomiń]** natychmiast generuje plan na stronie; jeśli podany e‑mail, po **[Generuj plan]** wysyłany jest również PDF do skrzynki.
* **Personalizacja chipsów** (Krok 2) zmienia się wg obszaru; ostatni wybór zapisywany w `localStorage` (expiry 30 dni).
* **Walidacja e‑maila**: inline (format + MX soft), błędy proste: “Ups! Wygląda na literówkę.” z sugestią (np. “gmail.com?”).
* **Wynik (plan)** otwiera się jako sekcja tuż pod hero (smooth scroll i fokus dla czytników):

  * **Nagłówek**: “Twój plan na start: [obszar] → [cel] (14 dni)”
  * **Kroki (lista)**: Dzień 1–3, Dzień 4–7, Dzień 8–14 (zwięzłe, nie‑medyczne wskazówki)
  * **Narzędzia dopasowane (3)**: np. “Planner retinoidów”, “UV Index SPF”, “Składniki Checker”
  * **Czytaj dalej (3)**: linki do przewodników/porównań (wejście do /skin/… lub /fuel/… itd.)
  * **CTA**: “Zapisz plan jako PDF →” (bez logowania) oraz “Pobierz rozszerzony przewodnik → /ebooks/…”
  * **Zastrzeżenie**: “Edukacyjnie, nie zastępuje konsultacji. [Disclaimer medyczny]”
* **Widżet UV**: pyta o zgodę na lokalizację przy pierwszym wejściu; brak zgody = dane z Warszawy (PL) z copy “Możesz zmienić lokalizację”. Odświeżanie co 30 min, fallback tekstowy jeśli API offline.

**Karty narzędzi**

* **Hover/Focus**: cień + podbicie CTA “Otwórz →”; klikalna cała karta (zachowuje dostępność: `role="link"` + `aria-label`).
* **Kolejność**: dynamicznie według popularności i personalizacji (o ile cookies zgody marketingowej = true).
* **Fallback**: brak personalizacji → kolejność domyślna.

**Subbrandy**

* **Punkty wejścia** do `/skin/start`, `/fuel/start`, `/habits/start` z anchorami “Zacznij tutaj”.
* **Zachowanie**: po wejściu z planu, wyróżnia dopasowane sekcje (małe badge “Rekomendowane”).

**Newsletter (sticky pasek)**

* **Po wysłaniu**: toast “Dziękujemy! Sprawdź skrzynkę (możliwe ‘Oferty/Promocje’).”
* **Po zamknięciu [×]**: ukryj na 7 dni (cookie funkcjonalne).
* **Segmentacja**: checkboxy pionów zapisane do ESP jako tagi.

**Dowody/Prasa**

* **Karuzela** z automatyczną pauzą po focus/hover (WCAG). Link do **Metodologii** i **Jak zarabiamy** w tej sekcji.

**Stopka/CMP**

* **Ustawienia prywatności** dostępne zawsze (sticky przy krawędzi po prawej na desktopie; w stopce mobile).

---

### 4) Komponenty — mikrocopy (PL) do wklejenia

**CTA & etykiety**

* Przyciski: **[Generuj plan] [Pomiń] [Otwórz] [Wejdź] [Zobacz] [Zapisz się] [Uruchom diagnostykę] [Zobacz wszystkie narzędzia] [Zarządzaj cookies]**
* Walidacja: “Podaj poprawny adres e‑mail.” / “Ups! Wygląda na literówkę — chodziło o `@gmail.com`?”
* Badge: “Za darmo”, “Bez spamu”, “Oparte na dowodach”.

**Alt‑texty**

* Logo: “Clarivum — nauka w praktyce”
* Widżet UV: “Widżet z bieżącym indeksem UV dla [miasto]”
* Okładki ebooków: “Okładka ebooka ‘Retinoid bez paniki’” itd.
* Ikony narzędzi: “Ikona słońca dla UV Index SPF” / “Ikona kolby dla Składniki Checker” itp.

**Disclaimer (YMYL)**

* “Treści Clarivum mają charakter edukacyjny i nie stanowią porady medycznej, dietetycznej ani psychologicznej. W razie wątpliwości skontaktuj się ze specjalistą.”

---

### 5) Tracking & UTM (nazwy zdarzeń do GA4/Tag Manager)

**Zdarzenia (nazwy czytelne, snake_case)**

* `diag_start`, `diag_select_area`, `diag_select_goal`, `diag_email_entered`, `plan_generate_click`, `plan_view`,
  `tool_card_view`, `tool_card_click`, `subbrand_card_click`, `ebook_card_click`,
  `newsletter_submit`, `newsletter_dismiss`, `footer_policy_view`, `search_used`.

**Parametry standardowe**

* `area` (`skin|fuel|habits`), `goal` (np. `spf_daily`), `cta_location` (`hero|tools_grid|ebooks`), `position_index`, `ab_variant`.

**UTM domyślne (linki wychodzące wewnątrz ekosystemu marketingowego, np. z newslettera)**

* `utm_source=web` • `utm_medium=homepage` • `utm_campaign=tools_first_2025-10` • `utm_content={section}_{card}`.

---

### 6) SEO & dane strukturalne (w pigułce)

* **Title:** “Clarivum — praktyczne narzędzia i plany: Skóra • Odżywianie • Nawyki”
* **Meta description:** “Uczymy. Upraszczamy. Dowozimy. Zrób krótką diagnostykę i od razu korzystaj z narzędzi: UV Index, TDEE, planner retinoidów, habit tracker i więcej.”
* **H1:** “Uczymy. Upraszczamy. Dowozimy.” (unikalny)
* **H2:** “Zrób 3 kroki — dostaniesz plan + narzędzia.”
* **Schema.org:** `Organization` (logo, social), `BreadcrumbList`, oraz `Product`/`CreativeWork` na karty ebooków na listingu (ogranicz w home do `ItemList`).

---

### 7) Dostępność (WCAG AA)

* Pełne **focus states**, nawigacja klawiaturą, aria‑labels na kartach i przyciskach, **prefers-reduced-motion** respektowany.
* Kolor/kontrast ≥ AA; wszystkie filtry (chipsy) dostępne jako przyciski.
* Karuzele z przyciskami **Pauza/Odtwórz**.
* Formularze z etykietami i przykładami (placeholder ≠ etykieta).

---

### 8) Przykładowa sekcja “Plan (po wygenerowaniu)” — ASCII + kopia

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ TWÓJ PLAN NA START: Skóra → Retinoid bez podrażnień (14 dni)                        │
│ “Prosty protokół progresji + narzędzia. Zapisz jako PDF lub kontynuuj online.”      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Dni 1–3                                                                              │
│ • Wieczorem: retinoid 1x, ilość “ziarnko grochu”, na suchą skórę.                    │
│ • SPF codziennie rano.                                                                │
│ Dni 4–7                                                                              │
│ • Wieczorem: retinoid 2x/tydz., obserwuj reakcję.                                    │
│ • Dodaj emolient po 20 min (jeśli ściąganie).                                        │
│ Dni 8–14                                                                             │
│ • 3x/tydz., zostaw na noc. Modyfikuj wg tolerancji.                                  │
│ Uwaga: Edukacyjnie, nie medycznie.                                                   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Narzędzia dopasowane                                                                 │
│ [Planner retinoidów →]  [UV Index SPF →]  [Składniki Checker →]                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Czytaj dalej                                                                         │
│ [Zacznij tutaj: /skin/start/]  [Przewodnik: retinoidy]  [Porównanie: sera z retinolem]│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [Zapisz plan jako PDF]     [Pobierz ebook: “Retinoid bez paniki” →]                  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Unknowns/Verify

* Unknown/Unverifiable as of 2025-10-22: **Brand kit (logo/kolory/typografia) i kody wizualne subbrandów**. Szybkie sprawdzenia: 1) podeślij pliki + wytyczne kontrastu; 2) wskaż zasady “na ekranie w 1–2 s”.
* Unknown/Unverifiable as of 2025-10-22: **ESP/CRM do newslettera i tagowania pionów**. Szybkie sprawdzenia: 1) nazwij pola/tagi; 2) wyślij tekst double‑opt‑in i polityki.

---

## Risks

* Zbyt rozbudowana diagnostyka może zwiększyć **drop** — mitigacja: chipsy, 3 kroki, e‑mail opcjonalny.
* Przesadne roszczenia YMYL w proof/case’ach — mitigacja: neutralna kopia + disclaimery + link do Metodologii.
* Personalizacja bez zgód CMP — mitigacja: domyślny porządek, personalizacja dopiero po zgodzie marketingowej.

—


These wireframes standardize trust pages and high‑traffic utilities so engineering/design can implement quickly with **stable UX patterns** (TOC, breadcrumbs, sticky actions, WCAG AA), while keeping copy minimal and compliant pending legal/editorial review.

---

## Forward look — **ASCII designs (desktop), with key interactions**

*(All pages share the same global header/footer as the homepage Option B. “→” denotes links; “[ ]” form inputs; `(i)` notes interactions.)*

---

### 1) **/o‑nas/** — About (brand story + methodology + team)

```
WIDTH ≈ 110ch
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM LOGO]  Skin Fuel Habits Narzędzia Ebooki Blog O nas 🔎                       👤 🛒 │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Breadcrumbs:  Strona główna → O nas                                                      │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ HERO                                                                                      │
│ H1: O Clarivum — nauka w praktyce                                                         │
│ Sub: Uczymy. Upraszczamy. Dowozimy. Bez szumu, z narzędziami.                            │
│ [Poznaj metodologię → /o-nas/redakcja/]    [Jak zarabiamy → /jak-zarabiamy/]             │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ SEKCJA: Misja i wartości                                                                  │
│ • Po co istniejemy (3 punkty)  • Dla kogo  • Jak mierzymy wpływ                           │
│ Quote: “Prosty plan > długi esej.”                                                        │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ SEKCJA: Metodologia redakcyjna (skrót)                                                    │
│ • Źródła, proces weryfikacji, aktualizacje treści                                         │
│ [Czytaj pełne zasady → /o-nas/redakcja/]                                                  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ SEKCJA: Zespół                                                                            │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                           │
│ | [Foto]      | | [Foto]      | | [Foto]      | | [Foto]      |                           │
│ | Imię, rola  | | Imię, rola  | | Imię, rola  | | Imię, rola  |                           │
│ | [Bio →]     | | [Bio →]     | | [Bio →]     | | [Bio →]     |                           │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘                           │
│ (i) Hover/Enter → karta się rozwija (krótki bio, link do /o-nas/autorzy/imię‑nazwisko)    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ SEKCJA: Osi czasu                                                                         │
│ 2023 ▸ start  | 2024 ▸ 1M czytelników  | 2025 ▸ narzędzia cross‑vertical                  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ SEKCJA: Media i partnerzy                                                                 │
│ [logo1][logo2][logo3][logo4]  •  [Kit prasowy → /o-nas/dla-prasy/]                        │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ CTA blok:                                                                                 │
│ “Dołącz do newslettera Clarivum”  [e‑mail ____] [Skin][Fuel][Habits] [Zapisz się]         │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Stopka + polityki                                                                         │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Key interactions:** TOC (sticky on scroll: Misja • Metodologia • Zespół • Oś czasu • Media); team cards expand; anchor links deep‑linkable.

---

### 2) **/polityka‑prywatnosci/** — Privacy Policy (GDPR‑first)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Breadcrumbs:  Strona główna → Polityka prywatności                                        │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Polityka prywatności                                                                  │
│ Meta: Ostatnia aktualizacja: [YYYY‑MM‑DD]  | Administrator: Clarivum sp. z o.o., kontakt: │
│ [privacy@clarivum.pl]                                                                     │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ SIDEBAR TOC (sticky)         │ TREŚĆ                                                      │
│ ▸ 1. Zakres                  │ 1. Zakres i definicje                                      │
│ ▸ 2. Administrator           │ 2. Administrator i dane kontaktowe                         │
│ ▸ 3. Dane i cele             │ 3. Jakie dane, w jakim celu, podstawa prawna               │
│ ▸ 4. Cookies/CMP             │ 4. Pliki cookies i zgody (CMP) [Zarządzaj → /ustawienia-…] │
│ ▸ 5. Odbiorcy                │ 5. Odbiorcy/przetwarzający                                 │
│ ▸ 6. Transfery               │ 6. Transfery poza EOG                                      │
│ ▸ 7. Retencja                │ 7. Okres przechowywania                                    │
│ ▸ 8. Prawa                   │ 8. Twoje prawa (dostęp, sprost., usunięcie, sprzeciw…)     │
│ ▸ 9. Bezpieczeństwo          │ 9. Bezpieczeństwo                                          │
│ ▸10. Zmiany                  │ 10. Zmiany polityki                                         │
│ ▸11. Kontakt RODO            │ 11. Kontakt w sprawach RODO                                │
│                             │ [Przycisk] Pobierz PDF  |  [Zgłoś wniosek RODO → /kontakt/] │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Interactions:** Sticky TOC highlights section in view; “Zarządzaj cookies” opens CMP; “Pobierz PDF” creates on‑the‑fly export; jump links preserved.

---

### 3) **/regulamin/** — Terms of Service

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Breadcrumbs: Strona główna → Regulamin                                                   │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Regulamin serwisu Clarivum                                                            │
│ Meta: Data wejścia w życie: [YYYY‑MM‑DD]                                                  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ TOC (sticky)                 │ TREŚĆ                                                      │
│ ▸ 1. Definicje               │ 1. Definicje                                               │
│ ▸ 2. Postanowienia ogólne    │ 2. Postanowienia ogólne                                    │
│ ▸ 3. Konto i dostęp          │ 3. Konto, newsletter, subskrypcje                          │
│ ▸ 4. Zakupy/zwroty (ebooks)  │ 4. Zakupy, płatności, odstąpienie                          │
│ ▸ 5. Odpowiedzialność        │ 5. Ograniczenia odpowiedzialności                          │
│ ▸ 6. Własność treści         │ 6. Prawa autorskie/licencje                                │
│ ▸ 7. Zmiany i wypowiedzenie  │ 7. Zmiany Regulaminu, wypowiedzenie                         │
│ ▸ 8. Prawo właściwe/spory    │ 8. Prawo właściwe i spory                                  │
│ ▸ 9. Kontakt                 │ 9. Kontakt                                                 │
│                             │ [Pobierz PDF]  [Wydrukuj]                                   │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Interactions:** Anchored headers; print styles; PDF export.

---

### 4) **/polityka‑cookies/** — Cookies Policy (with table)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Breadcrumbs: Strona główna → Polityka cookies                                             │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Polityka plików cookies                                                                │
│ Sub: Jak używamy cookies i podobnych technologii.                                          │
│ [Zarządzaj preferencjami → /ustawienia-prywatnosci/]                                       │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Kategorie cookies                                                                          │
│ [i] Niezbędne  — zawsze aktywne                                                            │
│ [ ] Analityczne  [Info]                                                                     │
│ [ ] Personalizacja [Info]                                                                   │
│ [ ] Reklamowe     [Info]                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Tabela przykładowa                                                                         │
│ ┌──────────────┬───────────┬───────────┬──────────────┬───────────────┐                    │
│ │ Nazwa        │ Dostawca  │ Cel       │ Typ/żywotność│ Kategoria      │                    │
│ ├──────────────┼───────────┼───────────┼──────────────┼───────────────┤                    │
│ │ _ga          │ Google    │ Analytics │ 1R           │ Analityczne    │                    │
│ │ cmp_state    │ Clarivum  │ Zgody     │ 6M           │ Niezbędne      │                    │
│ └──────────────┴───────────┴───────────┴──────────────┴───────────────┘                    │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Interactions:** “Info” opens inline accordions per kategorię; deep‑link to CMP page.

---

### 5) **/ustawienia‑prywatnosci/** — CMP (Cookie Preferences)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Ustawienia prywatności                                                                │
│ Sub: Wybierz, na co się zgadzasz. Możesz zmienić zdanie w każdej chwili.                  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Niezbędne] ▣ zawsze aktywne (opis)                                                       │
│ [Analityczne] [WŁ/ WYŁ]  (opis skrócony)                                                  │
│ [Personalizacja] [WŁ/ WYŁ]                                                                │
│ [Reklamowe] [WŁ/ WYŁ]                                                                     │
│ [Zezwól na wszystkie]   [Zapisz preferencje]   [Odrzuć opcjonalne]                        │
│ (i) Po “Zapisz”: toast potwierdzenia; link “Zobacz szczegóły cookies”.                    │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 6) **/disclaimer‑medyczny/** — Medical/health disclaimer

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Breadcrumbs: Strona główna → Disclaimer medyczny                                          │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Zastrzeżenie i zakres treści                                                          │
│ Blok ostrzegawczy: Treści mają charakter edukacyjny i nie stanowią porady medycznej.      │
│ W sytuacji nagłej skontaktuj się z odpowiednimi służbami.                                 │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Sekcje: Zakres • Źródła i weryfikacja • Aktualizacje • Kontakt do redakcji                │
│ [Metodologia → /o-nas/redakcja/]   [Kontakt → /kontakt/]                                  │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 7) **/jak‑zarabiamy/** — “How we make money” (affiliate/ad disclosure)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Jak zarabiamy                                                                         │
│ Lead: Wyjaśniamy modele przychodu i zasady niezależności redakcyjnej.                     │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Sekcja 1: Modele                                                                          │
│ • Ebooki (sprzedaż) • Afiliacja (oznaczenia #ad/#affiliate) • Reklama (formaty, zasady)   │
│ Sekcja 2: Oznaczenia i polityka linków                                                    │
│ Sekcja 3: Rozdział sprzedaż vs redakcja                                                   │
│ Sekcja 4: Jak wybieramy produkty (kryteria)                                               │
│ [Polityka reklamowa → /reklama/media-kit/]  [Polityka prywatności]                        │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 8) **/kontakt/** — Contact (form + routes)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Breadcrumbs: Strona główna → Kontakt                                                      │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Skontaktuj się z Clarivum                                                             │
│ Karty (tabs): [Współpraca i reklama] [Redakcja / korekty] [Wsparcie zakupów] [Prasa]      │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Formularz (uniwersalny)                                                                   │
│ Imię i nazwisko [__________]   E‑mail [__________]  Temat [__________]                    │
│ Pion: [Skin▾] [Fuel▾] [Habits▾]   Typ sprawy: [Zapytanie][Zgłoszenie][Wniosek RODO]       │
│ Wiadomość [______________________________textarea____________________________________]     │
│ Zgody: [ ] Przetwarzanie danych w celu kontaktu (wymagane)   [ ] Kopia do mnie            │
│ [Wyślij]  [Wyczyść]  • SLA: Odpowiadamy zwykle w 48h w dni robocze.                       │
│ (i) Walidacja inline, aria‑live dla błędów, honeypot anty‑spam.                           │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Alternatywy: e‑mail: [hello@clarivum.pl]  • Social: [LinkedIn][X][Instagram]              │
│ Dokumenty: [Kit prasowy →]  [Media kontakt →]  [RODO wniosek → /polityka-prywatnosci/]     │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 9) **/mapa‑strony/** — HTML sitemap (human‑readable)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER + H1: Mapa strony                                                                  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Szybkie linki: Strona główna • Narzędzia • Ebooki • Blog • O nas • Kontakt                │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Struktura                                                                                 │
│ / (Home)                                                                                  │
│ ├─ /skin/ …  /fuel/ …  /habits/ …                                                         │
│ ├─ /narzedzia/  (/skin/… /fuel/… /habits/…)                                               │
│ ├─ /ebooks/  (/skin/… /fuel/… /habits/…)                                                  │
│ ├─ /blog/  (/skin/ /fuel/ /habits/)                                                       │
│ ├─ /o‑nas/  (/redakcja/ /autorzy/ /dla‑prasy/)                                            │
│ ├─ /reklama/  (/media‑kit/ /wspolpraca/ /kontakt/)                                        │
│ ├─ /polityka‑prywatnosci/  /regulamin/  /polityka‑cookies/  /ustawienia‑prywatnosci/      │
│ ├─ /disclaimer‑medyczny/  /jak‑zarabiamy/  /kontakt/                                      │
│ └─ /rss/  /sitemap.xml  /robots.txt                                                       │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 10) **/szukaj/** — Search Results (with facets)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Szukaj                                                                                │
│ [ 🔎  wpisz frazę ______________________ ]  [Szukaj]  (i) autosugestia + klawiatura OK      │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ FACETY (lewa kol.)            │ WYNIKI (karty)                                            │
│ Pion: [☑ Skin][☐ Fuel][☐ Habits]│ ┌───────────────────────────────────────────────────┐   │
│ Typ: [☑ Artykuł][☐ Narzędzie]   │ | Tytuł wyniku (dopasowanie) →                       |   │
│      [☐ Ebook][☐ Porównanie]   │ | Snippet…  [Tagi]  [Data]  [Czytaj →]               |   │
│ Temat: [spf] [retinol] [sen]…  │ └───────────────────────────────────────────────────┘   │
│ Sortuj: [Najtrafniejsze▾]      │ (paginacja)  « 1 2 3 … »                                │
│ Clear: [Wyczyść]               │ Zero‑results: propozycje narzędzi/tematów               │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Interactions:** keyboard nav; facet chips removable; recent searches; “zero results” smart fallback.

---

### 11) **/404** — Not found (with recovery paths)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: 404 — Nie znaleźliśmy tej strony                                                      │
│ Tekst: Może literówka? Spróbuj wyszukiwania lub zobacz najpopularniejsze sekcje.          │
│ [ 🔎 Szukaj w Clarivum __________________ ] [Szukaj]                                       │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Najczęstsze ścieżki                                                                       │
│ [Zacznij tutaj → /skin/start/]  [Narzędzia → /narzedzia/]  [Ebooki → /ebooks/]            │
│ [O nas] [Kontakt]                                                                          │
│ (i) Automatyczny event “error_404” z referrerem i próbą autokorekty slugów                 │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 12) **/500** — Błąd serwera (graceful fallback)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Minimalny nagłówek (logo + link do Home)                                                  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Ups! Coś poszło nie tak.                                                              │
│ Tekst: To po naszej stronie. Spróbuj ponownie za chwilę lub przejdź na stronę główną.     │
│ [← Strona główna]   [Status systemu → status.clarivum.pl]                                 │
│ (i) Identyfikator incydentu: #ABC123  • automatyczny raport do logów                      │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Optional mobile pattern (uniwersalny)

* **Stacked layout**: header → H1 → key action → TOC (as dropdown) → content; sticky **“Zarządzaj cookies”** button on CMP‑relevant pages.
* **Forms**: single‑column, large tap targets, inline validation (`aria-live="polite"`).
* **TOC** collapses into **“Spis treści ▾”** above content; expands to anchor list.

---

## Unknowns/Verify

* Unknown/Unverifiable as of 2025‑10‑22: **Finalna treść prawna (RODO/Regulamin/Cookies)**. Szybkie sprawdzenia: (1) Podłącz kancelarię / szablony; (2) Ustal “ostatnia aktualizacja” + dane administratora.
* Unknown/Unverifiable as of 2025‑10‑22: **Kanały kontaktu i SLA**. Szybkie sprawdzenia: (1) Potwierdź skrzynki e‑mail i aliasy; (2) Zdecyduj o formularzu RODO (osobny czy ogólny).

---

## Risks

* **Ryzyko prawne** przy samodzielnym tworzeniu treści polityk — konieczna weryfikacja prawna.
* **Niedostępność** (WCAG) jeśli TOC i błędy formularzy nie będą oznaczone semantycznie.
* **Frustracja** użytkowników przy 404/500 bez ścieżek powrotu — mitigacja: wyszukiwarka + popularne linki.
* **Zgody marketingowe**: personalizacja bez zgody wbrew CMP — mitigacja: honoruj preferencje z /ustawienia‑prywatnosci/.

Extending B’s “prove value in ≤20s” to secondary pages keeps users exploring instead of bouncing after reading legal/utility content. A compact, accessible **Mini‑Diagnostyka** and a **Quick Tools** sampler maintain **mental** and **physical availability** while respecting these pages’ primary intent.

---

## Forward look — Tools‑first refit (GLOBAL PATTERN + PER‑PAGE ASCII)

### Global component (used on all pages)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ MINI‑DIAGNOSTYKA (skrót) — lekki, dostępny, domyślnie zwinięty na stronach prawnych       │
│ [▸ Otwórz diagnostykę]  [Wybierz pion ▾] [Cel ▾] [Generuj plan →]   [Zobacz narzędzia →]  │
│ (i) Enter/Space otwiera; focus trap w drawerze; ESC zamyka; aria-expanded toggluje.       │
└──────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ QUICK TOOLS (rail/grid, 3–4 skróty dopasowane do kontekstu strony)                        │
│ [UV Index]  [Planner retinoidów]  [TDEE]  [Habit Tracker]   [Zobacz wszystkie →]          │
│ (i) Na prawnych: pokazuj jako linki tekstowe; na innych: małe karty z ikonami.           │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 1) **/o‑nas/** (About) — tools‑first variant

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NAV + Sticky utility (jak na home B)                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ MINI‑DIAGNOSTYKA (otwarta na /o‑nas/)                                                    │
│ [Pion: ● Skóra ○ Odżywianie ○ Nawyki]  [Cel chipsy: SPF | Retinoid | TDEE | Sen]         │
│ [Generuj plan →]  ✓Za darmo ✓Bez spamu   [Zobacz narzędzia →]                            │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ HERO: O Clarivum — nauka w praktyce  |  Quick Tools: [UV] [TDEE] [Retinoid] [Habit]      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Misja i wartości • Metodologia (skrót) • Zespół (karty) • Oś czasu • Media/Partnerzy     │
│ [Metodologia → /o-nas/redakcja/]  [Jak zarabiamy → /jak-zarabiamy/]                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ CTA: “Chcesz plan na start?”  [Uruchom diagnostykę →]  lub  [Narzędzia → /narzedzia/]    │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Stopka                                                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2) **/polityka‑prywatnosci/** (Privacy) — tools‑first, but **non‑intrusive**

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NAV                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ MINI‑DIAGNOSTYKA — ZWINIĘTA (ikonka + tekst, 1 linia, [▸])   [Zobacz narzędzia →]        │
│ (i) Domyślnie zwinięta; otwarcie nie przesuwa TOC; pamięta stan w sessionStorage.        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Polityka prywatności      |   [Pobierz PDF]  [Zarządzaj cookies → /ustawienia‑…/]     │
│ Ostatnia aktualizacja: [YYYY‑MM‑DD]  • privacy@clarivum.pl                               │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ TOC (sticky): 1.Zakres 2.Admin 3.Dane i cele 4.Cookies 5.Odbiorcy 6.Transfery 7.Retencja │
│               8.Prawa 9.Bezpieczeństwo 10.Zmiany 11.Kontakt                               │
│ TREŚĆ (sekcje z anchorami; aria‑labelledby nagłówków)                                    │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Quick Tools (linki tekstowe): UV Index • TDEE • Planner retinoidów • Habit Tracker       │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Stopka                                                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 3) **/regulamin/** (Terms) — tools‑first, minimal

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NAV                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ MINI‑DIAGNOSTYKA — ZWINIĘTA  |  Quick Tools (linki): UV • TDEE • Habit • Narzędzia →     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Regulamin serwisu  |  [Pobierz PDF] [Wydrukuj]  | Data wejścia w życie: [YYYY‑MM‑DD] │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ TOC (sticky)  |  TREŚĆ (sekcje 1–9 z anchorami)                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Dyskretne CTA stop‑section: “Szukasz planu startowego?” [Uruchom diagnostykę →]          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 4) **/polityka‑cookies/** (Cookies)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NAV                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ MINI‑DIAGNOSTYKA — ZWINIĘTA  |  [Zarządzaj preferencjami → /ustawienia‑prywatnosci/]     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Polityka plików cookies  |  Sub: Jak używamy cookies i technologii pokrewnych        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Kategorie i tabela cookies + linki do dostawców                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Quick Tools (linki tekstowe pod treścią): UV • TDEE • Planner • Narzędzia →              │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 5) **/ustawienia‑prywatnosci/** (CMP)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NAV                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ MINI‑DIAGNOSTYKA — ZWINIĘTA (nie personalizuje się bez zgód)                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Ustawienia prywatności                                                               │
│ [Niezbędne] ▣ aktywne | [Analityczne] [WŁ/WYŁ] | [Personalizacja] [WŁ/WYŁ] | [Reklamowe] │
│ [Zezwól na wszystkie]  [Zapisz preferencje]  [Odrzuć opcjonalne]                         │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Quick Tools (tylko link do /narzędzia/ bez personalizacji)                               │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 6) **/disclaimer‑medyczny/** (Health disclaimer)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NAV                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ MINI‑DIAGNOSTYKA — ZWINIĘTA  |  Quick Tools (linki): UV • Przewodnik retinoidy • Sen     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Zastrzeżenie i zakres treści                                                         │
│ Blok ostrzegawczy (wysoki kontrast, aria‑live=off, bez animacji)                         │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Sekcje: Zakres • Źródła i weryfikacja • Aktualizacje • Kontakt                           │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ “Chcesz plan edukacyjny?” [Uruchom diagnostykę →]   (kopiowanie neutralne, bez obietnic) │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 7) **/jak‑zarabiamy/** (How we make money) — tools‑first promo, transparent

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NAV                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ MINI‑DIAGNOSTYKA — OTWARTA (tu pokazujemy wartość)                                       │
│ [Pion ▾] [Cel ▾] [Generuj plan →]   Badges: ✓Za darmo ✓Bez spamu ✓Transparentnie         │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Jak zarabiamy  | Lead: modele przychodu i niezależność redakcyjna                    │
│ Sekcja: Ebooki • Afiliacja (oznaczenia) • Reklama • Kryteria wyboru produktów            │
│ [Polityka reklamowa →] [Polityka prywatności →]                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Quick Tools: UV • TDEE • Planner • Habit  |  “Wypróbuj narzędzia bezpłatnie”             │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 8) **/kontakt/** (Contact) — self‑service first

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NAV                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ MINI‑DIAGNOSTYKA — OTWARTA   |   Quick Tools: [Narzędzia →] [FAQ →]                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Skontaktuj się z Clarivum                                                             │
│ Karty (tabs): [Współpraca] [Redakcja] [Wsparcie zakupów] [Prasa]                         │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ SEK C: Samopomoc (polecane)                                                               │
│ “Zanim napiszesz — spróbuj:”  [Uruchom diagnostykę]  [Top narzędzia]  [FAQ]              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Formularz: Imię | E‑mail | Temat | Pion | Typ sprawy | Wiadomość | Zgody                 │
│ [Wyślij] [Wyczyść]  • SLA: 48h                                                            │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 9) **/mapa‑strony/** (Sitemap) — quick actions up top

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NAV                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Quick Actions: [Uruchom diagnostykę] [Narzędzia] [Ebooki] [Blog]                         │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Mapa strony                                                                          │
│ Struktura IA (jak wcześniej), sekcja “Narzędzia” na górze listy                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 10) **/szukaj/** (Search) — pre‑results tool assist

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ NAV                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Szukaj                                                                               │
│ [ 🔎 fraza __________________ ] [Szukaj]   • Podpowiedzi: spf, retinoid, tdee, sen        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ MINI‑DIAGNOSTYKA — KONTEKSTOWA (chipsy zgodne z frazą)                                   │
│ “Skróć drogę: dopasujemy plan i narzędzia”  [Pion ▾] [Cel ▾] [Generuj plan →]            │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ FACETY (lewa)  |  WYNIKI (karty)  |  Quick Tools (prawa: dopasowane do frazy)            │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 11) **/404** (Not found) — recovery via tools

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ Minimal header                                                                           │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: 404 — Nie znaleźliśmy tej strony                                                     │
│ [🔎 Szukaj…]  |  [Uruchom diagnostykę]  [Narzędzia →]  [Zacznij tutaj → /skin/start/]     │
│ (i) event: error_404 z referrerem; proponuj narzędzia na bazie URL slug (heurystyka)     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 12) **/500** (Server error) — graceful, keep them exploring

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ Logo + link do Home                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ H1: Ups! Coś poszło nie tak                                                              │
│ [← Strona główna]  [Uruchom diagnostykę]  [Narzędzia]  [Status systemu]                  │
│ ID incydentu #ABC123 (auto‑report)                                                       │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Interakcje & Tracking (applies across pages)

* **Mini‑Diagnostyka drawer:** `idle → open → area_selected → goal_selected → plan_generated → close`.

  * Events: `mini_diag_open`, `mini_diag_select_area`, `mini_diag_select_goal`, `mini_plan_generate`, `mini_diag_close`.
* **Quick Tools clicks:** `quick_tool_click {tool, page_type}`; impression throttling per session.
* **Legal page safeguards:** default **collapsed**, no sticky overlap with headings; `tabindex` and `aria-controls` wired to content.
* **CMP:** no personalization of Quick Tools unless **marketing consent = true**.

---

## Unknowns/Verify

* Unknown/Unverifiable as of 2025‑10‑22: **Legal stance** on UI modules on policy pages. Fast checks: (1) Legal review of privacy/terms layouts; (2) Confirm that Mini‑Diagnostyka stays collapsed by default on legal pages.
* Unknown/Unverifiable as of 2025‑10‑22: **Tool priority rules** per context (e.g., which 3–4 to surface on each page). Fast checks: (1) Provide ranking by usage/GM; (2) Map tool ↔ page intent table.

---

## Risks

* **Compliance risk** if tools overshadow legal content—mitigate via collapsed defaults, neutral styling, and “skip” links.
* **Performance risk** on mobile if drawers are heavy—mitigate via pure CSS transitions, defer scripts, no LCP impact.
* **Personalization without consent** (GDPR)—serve non‑personalized defaults until opt‑in.

---

## Confidence

**81%** — The refits preserve primary page intents while injecting B’s proven mechanic. Confidence rises once legal OKs placement and tool ranking is tuned from analytics.

---

**Calculation (if any)**
—
