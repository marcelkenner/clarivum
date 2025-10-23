> **Canonical references:** Follow `docs/adr/ADR-018-brand-design-system.md` for brand system and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

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
