> **Canonical references:** `docs/adr/ADR-018-brand-design-system.md`, `docs/adr/ADR-019-frontend-platform.md`

Świetnie — poniżej dostajesz **refit “tools‑first”** w tej samej konwencji:

1. **ASCII (desktop) z gotową, naturalną kopią** — bez technicznych komentarzy.
2. **Pod ASCII**: krótki **opis techniczno‑biznesowy** (interakcje, tracking, zasady zgodności).

Uwaga: na stronach prawnych komponenty narzędzi są dyskretne (linki), na pozostałych — mini‑karty.

---

## GLOBALNE KOMPONENTY (używane na wszystkich stronach)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ MINI‑DIAGNOSTYKA                                                                          │
│ [▸ Otwórz diagnostykę]   [Obszar: ▾ Skóra]   [Cel: ▾ wybierz]   [Pokaż plan]   [Narzędzia]│
└──────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ QUICK TOOLS                                                                               │
│ [UV Index SPF]   [Planner retinoidów]   [Kalkulator TDEE]   [Habit Tracker]   [Wszystkie] │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy (globalne):**

* Mini‑Diagnostyka: bar zwinięty domyślnie na stronach prawnych; otwarty na /o‑nas/, /jak‑zarabiamy/, /kontakt/, /szukaj/.
* Quick Tools: 3–4 skróty powiązane z kontekstem strony (na prawnych — linki tekstowe).
* Tracking (Plausible): `mini_diag_open`, `mini_diag_select_area`, `mini_diag_select_goal`, `mini_plan_generate`, `quick_tool_click {tool,page}`.
* Zgody (CMP): brak personalizacji skrótów bez zgody marketingowej.

---

## 1) `/o‑nas/` — O nas (wariant tools‑first)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎                    👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [Otwórz diagnostykę]  [Obszar: ▾ Skóra]  [Cel: ▾ SPF / Retinoid / TDEE / Sen]  [Pokaż plan]│
│ [Narzędzia]                                                                                 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O Clarivum — nauka w praktyce                                                               │
│ Uczymy. Upraszczamy. Dowozimy. Bez szumu, z narzędziami.                                    │
│ [Poznaj metodologię]   [Jak zarabiamy]                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Szybkie skróty                                                                               │
│ [UV Index SPF]   [Kalkulator TDEE]   [Planner retinoidów]   [Habit Tracker]                 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Misja i wartości                                                                            │
│ Pomagamy podejmować rozsądne decyzje w trzech obszarach: skóra, odżywianie, nawyki.         │
│ Stawiamy na prosty plan, jasny język i działające narzędzia.                                │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Metodologia (skrót)                                                                         │
│ Pracujemy na wiarygodnych źródłach i regularnie aktualizujemy treści.                       │
│ [Pełne zasady redakcyjne]                                                                   │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Zespół                                                                                      │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                              │
│ | [Foto]      | | [Foto]      | | [Foto]      | | [Foto]      |                              │
│ | Imię, rola  | | Imię, rola  | | Imię, rola  | | Imię, rola  |                              │
│ | [Zobacz bio]| | [Zobacz bio]| | [Zobacz bio]| | [Zobacz bio]|                              │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘                              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Nasza droga                                                                                 │
│ 2023 — start   •   2024 — 1 mln czytelników   •   2025 — narzędzia łączące piony           │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Media i partnerzy                                                                           │
│ [logo1] [logo2] [logo3] [logo4]   [Kit prasowy]                                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Chcesz plan na start?  [Uruchom diagnostykę]   lub   [Przejdź do narzędzi]                  │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP         │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  Zarządzaj cookies                   │
│ © Clarivum                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** mini‑diag otwarta na wejściu; skróty z prawej w hero; karty zespołu linkują do `/o‑nas/autorzy/{slug}`; eventy: `about_cta_click`, `team_card_open`.

---

## 2) `/polityka‑prywatnosci/` — Polityka prywatności (dyskretnie)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎                    👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [▸ Otwórz diagnostykę]   [Narzędzia]                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Polityka prywatności   [Pobierz PDF]   [Zarządzaj cookies]                               │
│ Ostatnia aktualizacja: 2025‑10‑28   •   privacy@clarivum.pl                              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Spis treści                                                                                │
│ 1. Zakres  •  2. Administrator  •  3. Dane i cele  •  4. Cookies  •  5. Odbiorcy          │
│ 6. Transfery  •  7. Retencja  •  8. Twoje prawa  •  9. Bezpieczeństwo  •  10. Zmiany       │
│ 11. Kontakt                                                                                 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Treść                                                                                      │
│ [Sekcje zgodne ze spisem treści; nagłówki z anchorami]                                     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Szybkie skróty                                                                             │
│ UV Index • Kalkulator TDEE • Planner retinoidów • Habit Tracker                            │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP         │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  Zarządzaj cookies                   │
│ © Clarivum                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** mini‑diag zwinięta; Quick Tools jako linki; akcent na PDF/ CMP; eventy: `privacy_pdf_download`, `privacy_open_cmp`.

---

## 3) `/regulamin/` — Regulamin (minimalnie, narzędzia na marginesie)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎                    👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [▸ Otwórz diagnostykę]   UV • TDEE • Habit • Narzędzia →                                 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Regulamin serwisu   [Pobierz PDF]   [Wydrukuj]                                            │
│ Data wejścia w życie: 2025‑10‑28                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Spis treści  •  Treść                                                                     │
│ 1–9: Definicje, Postanowienia, Konto, Zakupy i zwroty, Odpowiedzialność, Prawa,           │
│ Zmiany, Prawo i spory, Kontakt                                                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Szukasz planu startowego?  [Uruchom diagnostykę]                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP         │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  Zarządzaj cookies                   │
│ © Clarivum                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** TOC sticky, styl do druku/PDF; mini‑diag zwinięta; eventy: `tos_pdf_download`, `tos_print`.

---

## 4) `/polityka‑cookies/` — Polityka cookies

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎                    👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [▸ Otwórz diagnostykę]   [Zarządzaj preferencjami]                                       │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Polityka plików cookies                                                                   │
│ Jak używamy cookies i podobnych technologii.                                              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Kategorie                                                                                 │
│ Niezbędne — zawsze aktywne                                                                │
│ Analityczne  [Pokaż szczegóły]                                                            │
│ Personalizacja  [Pokaż szczegóły]                                                         │
│ Reklamowe  [Pokaż szczegóły]                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Przykładowa lista                                                                         │
│ Nazwa  •  Dostawca  •  Cel  •  Typ/żywotność  •  Kategoria                                │
│ cmp_state — Clarivum — zapamiętanie zgód — cookie/6M — Niezbędne                          │
│ _pa — Plausible — analityka bez PII — cookie/1R — Analityczne                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Skróty:  UV • TDEE • Planner • Wszystkie narzędzia →                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP         │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  Zarządzaj cookies                   │
│ © Clarivum                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** akordeony kategorii; link do `/ustawienia‑prywatnosci/`; eventy: `cookies_manage_open`, `cookies_category_toggle`.

---

## 5) `/ustawienia‑prywatnosci/` — Ustawienia prywatności (CMP)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎                    👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [▸ Otwórz diagnostykę]                                                                    │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Ustawienia prywatności                                                                    │
│ Wybierz, na co się zgadzasz. Możesz zmienić zdanie w każdej chwili.                       │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Niezbędne — zawsze aktywne                                                                │
│ Analityczne  [WŁ / WYŁ]                                                                   │
│ Personalizacja  [WŁ / WYŁ]                                                                │
│ Reklamowe  [WŁ / WYŁ]                                                                     │
│ [Zezwól na wszystkie]   [Zapisz preferencje]   [Odrzuć opcjonalne]                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Skrót:  [Wszystkie narzędzia]                                                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP         │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  Zarządzaj cookies                   │
│ © Clarivum                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** zapis preferencji + toast; brak personalizacji skrótów; eventy: `cmp_save`, `cmp_allow_all`, `cmp_reject_all`.

---

## 6) `/disclaimer‑medyczny/` — Zastrzeżenie zdrowotne

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎                    👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [▸ Otwórz diagnostykę]   UV • Przewodnik: retinoidy • Sen                                 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Zastrzeżenie i zakres treści                                                              │
│ Treści Clarivum mają charakter edukacyjny i nie zastępują porady medycznej,               │
│ dietetycznej ani psychologicznej. W sytuacji nagłej skontaktuj się z odpowiednimi służbami.│
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Zakres  •  Źródła i weryfikacja  •  Aktualizacje  •  Kontakt do redakcji                  │
│ [Metodologia redakcyjna]                                                                   │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Chcesz plan edukacyjny?  [Uruchom diagnostykę]                                            │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP         │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  Zarządzaj cookies                   │
│ © Clarivum                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** wysoki kontrast bloku ostrzegawczego; neutralna kopia; event: `disclaimer_link_click`.

---

## 7) `/jak‑zarabiamy/` — Jak zarabiamy (transparentnie, pokazujemy wartość)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎                    👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [Otwórz diagnostykę]  [Obszar: ▾]  [Cel: ▾]  [Pokaż plan]   ✓ Za darmo  ✓ Bez spamu  ✓ Jawnie│
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Jak zarabiamy                                                                              │
│ Wyjaśniamy nasze źródła przychodu i zasady niezależności redakcyjnej.                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Modele przychodu                                                                           │
│ • Ebooki — własne publikacje.                                                              │
│ • Afiliacja — linki oznaczone #affiliate / #ad.                                            │
│ • Reklama — ograniczone formaty, bez „ścian” śledzących.                                   │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Oznaczenia i linki                                                                         │
│ Wszystkie treści komercyjne są wyraźnie opisane. Rekomendacje nie są „na zamówienie”.      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Rozdział: redakcja vs sprzedaż                                                             │
│ Zespół redakcyjny i sprzedaż działają niezależnie.                                         │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Jak wybieramy produkty                                                                     │
│ Liczą się wiarygodność, dostępność i stosunek jakości do ceny.                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [Polityka reklamowa]   [Polityka prywatności]                                              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Wypróbuj narzędzia bezpłatnie                                                              │
│ [UV Index SPF]   [Kalkulator TDEE]   [Planner retinoidów]   [Habit Tracker]               │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP         │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  Zarządzaj cookies                   │
│ © Clarivum                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** mini‑diag otwarta; sekcje linkowalne; eventy: `money_policy_link_click`, `quick_tool_click`.

---

## 8) `/kontakt/` — Kontakt (najpierw samoobsługa)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎                    👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [Otwórz diagnostykę]   [Narzędzia]   [FAQ]                                                │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Skontaktuj się z Clarivum                                                                 │
│ [Współpraca]   [Redakcja / korekty]   [Wsparcie zakupów]   [Prasa]                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Zanim napiszesz — spróbuj                                                                 │
│ [Uruchom diagnostykę]   [Najpopularniejsze narzędzia]   [FAQ]                              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Imię i nazwisko [__________________]   E‑mail [__________________]   Temat [___________]  │
│ Obszar: [Skóra ▾] [Odżywianie ▾] [Nawyki ▾]   Typ sprawy: [Zapytanie ▾]                   │
│ Wiadomość                                                                                 │
│ [____________________________________________________________________________________]    │
│ Zgody: [ ] Wyrażam zgodę na kontakt w odpowiedzi na wiadomość (wymagane)   [ ] Kopia do mnie│
│ [Wyślij]   [Wyczyść]    Zwykle odpowiadamy w 48 h w dni robocze.                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ hello@clarivum.pl   •   [LinkedIn]  [X]  [Instagram]                                      │
│ [Kit prasowy]   [Media kontakt]   [Wniosek RODO]                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP         │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  Zarządzaj cookies                   │
│ © Clarivum                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** tabs do routingu zapytań; walidacja inline; eventy: `contact_submit {topic}`, `contact_tab_click`.

---

## 9) `/mapa‑strony/` — Mapa strony (quick actions na górze)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎                    👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Szybkie działania:  [Uruchom diagnostykę]   [Narzędzia]   [Ebooki]   [Blog]              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Mapa strony                                                                               │
│ /                                                                                         │
│ ├─ /skin/ …   /fuel/ …   /habits/ …                                                       │
│ ├─ /narzedzia/  (/skin/… /fuel/… /habits/…)                                               │
│ ├─ /ebooks/    (/skin/… /fuel/… /habits/…)                                                │
│ ├─ /blog/      (/skin/ /fuel/ /habits/)                                                   │
│ ├─ /o‑nas/     (/redakcja/ /autorzy/ /dla‑prasy/)                                         │
│ ├─ /reklama/   (/media‑kit/ /wspolpraca/ /kontakt/)                                       │
│ ├─ /polityka‑prywatnosci/  /regulamin/  /polityka‑cookies/  /ustawienia‑prywatnosci/      │
│ ├─ /disclaimer‑medyczny/  /jak‑zarabiamy/  /kontakt/                                      │
│ └─ /rss/   /sitemap.xml   /robots.txt                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP         │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  Zarządzaj cookies                   │
│ © Clarivum                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** prosta lista HTML; quick actions wspierają eksplorację; event: `sitemap_link_click`.

---

## 10) `/szukaj/` — Szukaj (asysta narzędzi przed wynikami)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]  Skin  Fuel  Habits  Narzędzia  Ebooki  Blog  O nas  🔎                    👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Szukaj                                                                                   │
│ [ 🔎  wpisz frazę __________________________ ]  [Szukaj]                                   │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Szybki plan                                                                               │
│ [Obszar: ▾]   [Cel: ▾]   [Pokaż plan]                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Filtry (lewa)                                                                             │
│ Pion: [☑ Skin] [☐ Fuel] [☐ Habits]                                                       │
│ Typ:  [☑ Artykuł] [☐ Narzędzie] [☐ Ebook] [☐ Porównanie]                                  │
│ Temat: [spf] [retinoid] [sen] [białko]…                                                   │
│ Sortuj: [Najtrafniejsze ▾]   [Wyczyść]                                                    │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Wyniki (środek)                                                                           │
│ ┌──────────────────────────────────────────────────────┐                                   │
│ │ Tytuł wyniku →                                                                            │
│ │ Krótki opis…   [Tagi]   [Data]   [Czytaj →]                                              │
│ └──────────────────────────────────────────────────────┘                                   │
│ Paginacja: « 1 2 3 … »                                                                     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Skróty dopasowane do frazy (prawa kolumna)                                                │
│ [UV Index SPF]   [Kalkulator TDEE]   [Cel białka]   [Zobacz wszystkie]                    │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ O nas  •  Polityka prywatności  •  Polityka cookies  •  Disclaimer medyczny  •  CMP         │
│ Kontakt  •  Reklama  •  Kariera  •  RSS  •  Sitemap  •  Zarządzaj cookies                   │
│ © Clarivum                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** autosugestie, sterowanie klawiaturą; skróty po prawej wynikają z frazy; eventy: `search_used`, `search_result_click`, `quick_tool_click`.

---

## 11) `/404` — Nie znaleziono (odzyskanie przez narzędzia)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]   Narzędzia   Ebooki   O nas   🔎                                           👤 🛒 │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ 404 — Nie znaleźliśmy tej strony                                                         │
│ Może literówka? Użyj wyszukiwarki albo skorzystaj ze skrótów poniżej.                    │
│ [ 🔎  Szukaj w Clarivum ______________________ ]  [Szukaj]                                │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Szybkie ścieżki                                                                           │
│ [Uruchom diagnostykę]   [Narzędzia]   [Zacznij tutaj — /skin/start/]   [Kontakt]          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ © Clarivum                                                                                │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** logujemy `error_404` + referrer; heurystyka podpowiada narzędzia na bazie slug.

---

## 12) `/500` — Błąd serwera (graceful, kierujemy do wartości)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [CLARIVUM]   [Strona główna]                                                              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Ups! Coś poszło nie tak                                                                    │
│ To po naszej stronie. Spróbuj ponownie albo wróć na stronę główną.                         │
│ [← Strona główna]   [Uruchom diagnostykę]   [Narzędzia]   [Status systemu]                │
│ Identyfikator incydentu: #ABC123                                                           │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ © Clarivum                                                                                │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**Opis techniczno‑biznesowy:** lekka strona, auto‑raport; event: `error_500_view`.

---

# Zasady wspólne (interakcje, tracking, zgodność)

**Mini‑Diagnostyka (drawer/pasek):**

* Stany: `idle → open → area_selected → goal_selected → plan_generated → close`.
* Klawiatura: Enter/Spacja otwiera, ESC zamyka, focus trap w obrębie.
* Pamięć: stan rozwinięcia w `sessionStorage`; ostatni wybór obszaru/celu w `localStorage` (30 dni).
* Eventy: `mini_diag_open`, `mini_diag_select_area`, `mini_diag_select_goal`, `mini_plan_generate`, `mini_diag_close`.

**Quick Tools:**

* Dobór kontekstowy:

  * **/o‑nas/**: UV, TDEE, Planner, Habit.
  * **Polityki/Regulamin/Disclaimer**: linki tekstowe UV/TDEE/Planner/Habit.
  * **/jak‑zarabiamy/**: UV, TDEE, Planner, Habit (akcent „bezpłatnie”).
  * **/kontakt/**: „Narzędzia”, „FAQ”, a dalej top 3 narzędzia.
  * **/szukaj/**: skróty na podstawie frazy (np. „retinoid” → Planner, „UV” → UV Index).
* Event: `quick_tool_click {tool,page}`; limit impresji per sesja.

**Zgodność i prywatność:**

* Brak personalizacji skrótów na stronach prawnych bez zgody marketingowej; wszystko zgodnie z `/ustawienia‑prywatnosci/`.
* PDF/druk dostępne na politykach/regulaminie; druk przyjazny (`@media print`).
* WCAG AA: kontrast, focus states, aria‑label, nagłówki zakotwiczone; „Spis treści” sticky bez zasłaniania Hx.

**SEO:**

* `BreadcrumbList` na stronach z okruszkami; `CreativeWork` dla polityk/regulaminu; `Organization` na /o‑nas/.
* Tytuły i meta krótkie, rzeczowe; kanoniczne linki zgodnie z ADR‑019.

**Ryzyka & mitygacje:**

* **Zbyt inwazyjne narzędzia na stronach prawnych** → domyślnie zwinięte, neutralne linki.
* **Wydajność drawerów** → lekkie animacje CSS, lazy init skryptów.
* **Zgody** → bez personalizacji do czasu opt‑inu.

**Unknowns/Verify:**

* Potwierdzenie u działu prawnego układu polityk i miejsca CTA.
* Ranking skrótów per strona po pierwszych danych (ustaw A/B na /o‑nas/ i /jak‑zarabiamy/).

**Confidence:** 81% — układ zachowuje intencję stron i dodaje ścieżki do wartości bez naruszania czytelności treści prawnych.

---

Chcesz, żebym dorzucił **stuby TSX** (Mini‑Diagnostyka, QuickToolsRail, TOC sticky) pod ADR‑019 z gotowymi propami na eventy Plausible?
