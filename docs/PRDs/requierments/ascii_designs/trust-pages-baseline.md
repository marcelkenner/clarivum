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
