> **Canonical decisions:** `docs/adr/ADR-022-tools-and-calculators-platform.md` sets the quiz foundation; visual, typographic tokens per `docs/adr/ADR-018-brand-design-system.md`.

Below are **mobile‑first ASCII wireframes** for the Fitzpatrick quiz, showing the key **states** and **flows** from the spec. They’re sized for small screens (~320–375 px). Copy directly into specs, tickets, or PRDs.

---

### Legend (ASCII UI tokens)

```
( ) radio (unselected)     (x) radio (selected)
[ Button ]                 [ Button:disabled ]  (disabled)
{anchor}                   inline anchor link
[toast]                    ephemeral toast
[sticky]                   sticky section header
[i18n:key]                 text comes from translation catalog
```

---

## 1) Page – PRISTINE (PL default, mobile)

```
[Skip to content]

Skin > Narzędzia > Fitzpatrick
------------------------------------------------
H1: Test fototypu skóry (Fitzpatrick)
[PL | EN]                                             
------------------------------------------------
(optional banner slot)

[sticky] Sekcja: Genetyczne cechy

1. Kolor oczu  (id: eye_color)
   ( ) Jasnoniebieskie/zielone   ( ) Niebieskie/zielone
   ( ) Piwne                     ( ) Brązowe
   ( ) Ciemnobrązowe/czarne

2. Naturalny kolor włosów  (id: natural_hair)
   ( ) Rude  ( ) Blond  ( ) Ciemny blond/jasny brąz
   ( ) Brązowe  ( ) Ciemnobrązowe/czarne

3. Odcień skóry (wewn. przedramię)  (id: inner_arm_skin)
   ( ) Bardzo jasna  ( ) Jasna  ( ) Jasny beż
   ( ) Średnia       ( ) Ciemna

4. Piegi  (id: freckles)
   ( ) Wiele  ( ) Trochę  ( ) Niewiele  ( ) Rzadko  ( ) Brak

{anchor} -> Przejdź do II sekcji

------------------------------------------------
Akcje:
[ Pokaż wynik :disabled ]   [ Wyczyść odpowiedzi ]
[ Kopiuj wynik (JSON) :disabled ]   [ Drukuj ]
------------------------------------------------
Footer: [link] Polityka prywatności
```

> Notes
> • Left→right options are ordered 0→4 **without showing numbers**.
> • Submit remains disabled until all 10 are answered.
> • All labels come from i18n; examples above are illustrative.

---

## 2) Page – SECTION 2 (Sun response), with “Back to genetic” anchor

```
{anchor} ↑ Wróć do genetyczne cechy

[sticky] Sekcja: Reakcja na słońce

5. Pierwsze silne słońce  (id: first_strong_sun)
   ( ) Zawsze się pali / nigdy nie opala
   ( ) Często się pali / minimalna opalenizna
   ( ) Czasem lekko się pali / opala powoli
   ( ) Rzadko się pali / opala się łatwo
   ( ) Nigdy się nie pali / głęboka opalenizna

6. Nasilenie oparzeń  (id: burn_severity)
   ( ) Bolesne/złuszczanie  ( ) Umiarkowane  ( ) Lekkie
   ( ) Rzadko               ( ) Nigdy

7. Zdolność opalania  (id: tanning_ability)
   ( ) Brak  ( ) Lekka  ( ) Umiarkowana  ( ) Dobra  ( ) Bardzo głęboka

8. Tempo opalania  (id: tan_speed)
   ( ) Nigdy  ( ) Bardzo wolno  ( ) Wolno  ( ) Średnio  ( ) Szybko

9. Wrażliwość twarzy na słońce  (id: sun_sensitivity_face)
   ( ) Bardzo wrażliwa  ( ) Wrażliwa  ( ) Umiarkowana
   ( ) Mało wrażliwa    ( ) Niewrażliwa

10. Opalenizna w zeszłym roku  (id: tan_last_year)
    ( ) Nigdy   ( ) Rzadko   ( ) Czasem   ( ) Często   ( ) Zawsze

------------------------------------------------
Akcje:
[ Pokaż wynik ]   [ Wyczyść odpowiedzi ]
[ Kopiuj wynik (JSON) :disabled ]   [ Drukuj ]
```

> Notes
> • “Back to genetic” anchor sits at the very top of section 2.
> • Radios are true `<input type="radio">` in semantic HTML; wrap to next line on narrow screens.

---

## 3) CLIENT ERROR STATE (missing answers highlighted)

*(Triggered if the UI detects incomplete selections when user tries to submit; submit should normally stay disabled until complete. This state illustrates accessible inline errors.)*

```
... (within either section)

[error] Uzupełnij wszystkie pytania.  (aria-describedby links)

10. Opalenizna w zeszłym roku  (id: tan_last_year)
    ( ) Nigdy   ( ) Rzadko   ( ) Czasem   ( ) Często   ( ) Zawsze
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    helper: To pytanie jest wymagane.

[ Pokaż wynik :disabled ]
```

> Notes
> • Error text is visibly associated to the field via `aria-describedby`.
> • Keyboard focus moves to the **first** invalid question.

---

## 4) SERVER VALIDATION ERROR (422) – banner + mapping

*(If POST is attempted and backend rejects payload – e.g., extraneous key, unknown option.)*

```
[error banner]
Nie można obliczyć wyniku (422/INVALID_OPTION).
Szczegóły: question=natural_hair, option="auburn".
[ Zamknij ]

Problemowe pytania zostały oznaczone poniżej.
```

---

## 5) SUCCESS – RESULT CARD (inline, with persistent disclaimer)

```
--- Po wysłaniu, przewiń i fokus na wynik (h2) ---

Wynik testu
[badge] Typ: IV
Wynik: 22 / 40

Ogólne wskazówki:
• Burn risk: low–moderate
• Use daily broad-spectrum protection
• Consider higher UVA protection if hyperpigmentation-prone

[ Pokaż detale techniczne ▼ ]  (toggle shows versions)

(technical)
 engine_version: 1.0.0
 quiz_version: 2025-10-23
 language: pl

[ Kopiuj wynik (JSON) ]   [ Drukuj ]
{CTA} Dowiedz się o ochronie przeciwsłonecznej  (nofollow)
{CTA} Znajdź dermatologa                          (nofollow)

------------------------------------------------
Uwaga (zawsze widoczna):
**Autotesty nie zastępują porady lekarskiej.**
Ryzyko nowotworów skóry zależy od wielu czynników.
------------------------------------------------
[aria-live=polite] ✓ Wynik obliczony
```

> Notes
> • Numeric score first appears **only here** (never during fill).
> • `aria-live` announces the result.
> • CTAs are configurable; `rel="nofollow noopener"`.

---

## 6) JSON COPY – toast feedback

```
[ Kopiuj wynik (JSON) ]  -> pressed

[toast] JSON skopiowany do schowka.
```

*(No modal required. The JSON matches Y/“Yield” contract.)*

---

## 7) OFFLINE / SHADOW SCORER MODE

```
[offline banner]
Tryb offline: pytania z cache. Wynik
zostanie obliczony lokalnie. Niektóre
funkcje (analiza, wysyłka) są ograniczone.
[ Spróbuj ponownie połączyć ]

... (user completes quiz) ...

Wynik testu (offline)
[badge] Typ: III
Wynik: 16 / 40
• Burn risk: moderate
• Still use daily protection

[ Kopiuj wynik (JSON) ]   [ Drukuj ]

(disclaimer remains visible)
```

> Notes
> • Local client scorer computes type; POST is deferred/optional.

---

## 8) PRINT VIEW (mobile trigger, simplified)

```
PRINT PREVIEW (single column)
--------------------------------
H1, breadcrumb
Genetyczne cechy: Q1–Q4 (selected labels)
Reakcja na słońce: Q5–Q10 (selected labels)

Wynik: Typ IV (22/40)
Wskazówki (4 bullets)
Disclaimer (persistent)
```

---

### Accessibility and Interaction Callouts (embedded in the design)

* Real `<fieldset><legend>` per question; each chip is `<input type="radio" id=...>` with `<label for=...>`.
* Radios support arrow‑key navigation (roving focus per group) and 24×24 px hit targets.
* High‑contrast by design; do **not** convey meaning by color alone.
* “Skip to content” link shown and focusable; sticky section headers keep context during scroll.
* On submit, page scrolls to the result card and shifts focus to the result heading.

---

## Where each requirement is visible in the wireframes

* **Two sections, sticky headers** → Screens 1–2.
* **Left→right increasing score; no numbers shown** → All question rows.
* **Submit disabled until all 10 answered** → Screens 1–2.
* **Next section / Back to genetic anchors** → Screens 1–2.
* **Inline result card + persistent disclaimer** → Screen 5.
* **Secondary actions (Reset, Copy JSON, Print)** → Screens 1–2–5–6.
* **Validation errors** → Screens 3–4.
* **Offline mode** → Screen 7.
* **i18n** → `[PL | EN]` toggle; labels sourced from translation.

---

If you’d like, I can generate a **matching checklist** for QA (derived from “Z”) that references each ASCII element by line to speed up acceptance testing.
