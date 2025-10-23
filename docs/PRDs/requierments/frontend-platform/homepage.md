# Frontend Platform — Homepage ASCII Specification

> **Canonical decisions:** Follow `docs/adr/ADR-019-frontend-platform.md` for implementation patterns and `docs/adr/ADR-018-brand-design-system.md` for visual rules.

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
│                                                                                                  [Hero IMG]  │
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
* Hero IMG: “Osoba korzysta z prostego planu na telefonie”
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
* Unknown/Unverifiable as of 2025-10-22: **ESP/CRM do newslettera i tagowania pionów**. Szybkie sprawdzenia: 1) nazwij pola/tagi; 2) wyślij tekst double‑opt‑in i polityki.

---

## Risks

* Zbyt rozbudowana diagnostyka może zwiększyć **drop** — mitigacja: chipsy, 3 kroki, e‑mail opcjonalny.
* Przesadne roszczenia YMYL w proof/case’ach — mitigacja: neutralna kopia + disclaimery + link do Metodologii.
* Personalizacja bez zgód CMP — mitigacja: domyślny porządek, personalizacja dopiero po zgodzie marketingowej
