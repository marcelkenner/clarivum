## Blog = **Category‑First** (clusters, CTAs, sample posts)

> Each category hub includes: hero + “Co zyskuję” + featured 3–5 posts + “Narzędzie tygodnia” + Primary e‑book CTA + Secondary upsell + email capture.
> 

---

## Gdzie to żyje w IA

```
/skin/                          ← hub sub‑brandu (menu: Start, Tematy, Narzędzia, Polecenia, E‑booki, Blog)
└── /skin/blog/                 ← indeks bloga (agreguje i linkuje do kategorii; opcjonalny)
    └── /skin/<kategoria>/…     ← kanoniczne URL‑e (Category‑First)

```

> Uwaga URL: kanoniczne ścieżki to /skin/<kategoria>/… (patrz redirect plan na końcu).
> 

---

## BLOG / SKIN — drzewo kategorii i wpisów (Category‑First)

```
/skin/blog/                                   ← indeks (siatka kategorii + „Narzędzie tygodnia” rotacyjne)
│
├── /skin/podstawy/ — Podstawy pielęgnacji    [P: Conscious Skincare | S: Barrier Reset | Tool: Generator Rutyny]
│   ├── /skin/podstawy/minimalny-plan-24h-dla-zapracowanych/
│   ├── /skin/podstawy/sucho-vs-odwodnienie-jak-rozpoznac-w-5-minut/
│   ├── /skin/podstawy/jak-dobrac-krem-tekstura-i-wyglad/
│   └── /skin/podstawy/czyszczenie-bez-przesuszania/
│
├── /skin/rutyna-24h/ — Rutyny i nawyki       [P: Conscious Skincare | S: Men’s Playbook | Tool: Kalendarz Retinolu]
│   ├── /skin/rutyna-24h/plan-na-dni-z-goleniem-i-bez/
│   ├── /skin/rutyna-24h/jak-utrzymac-80-proc-adherencje/
│   └── /skin/rutyna-24h/tydzien-resetu-barierowego/
│
├── /skin/skladniki/ — Składniki (INCI)       [P: Ingredient Atlas (w Conscious) | S: Even Tone | Tool: Analiza INCI]
│   ├── /skin/skladniki/retinoidy-rodzina-efekty-i-rytm-wprowadzania/
│   ├── /skin/skladniki/niacynamid-10-proc-kiedy-ma-sens/
│   ├── /skin/skladniki/kwas-azelinowy-na-zaczerwienienia-i-pory/
│   └── Sub‑hubs (opcjonalnie):
│       ├── /skin/skladniki/retinoidy/
│       ├── /skin/skladniki/kwasy/
│       └── /skin/skladniki/antyoksydanty/
│
├── /skin/spf/ — Słońce i fotoprotekcja        [P: Sun Playbook | S: Even Tone | Tool: Kalkulator SPF + Dzienny Limit UV]
│   ├── /skin/spf/jak-wybrac-spf-ktory-naprawde-nosze/
│   ├── /skin/spf/zimowy-blask-slonca-a-ochrona-w-biurze/
│   └── /skin/spf/tekstury-dla-skory-tlustej-i-z-brodka/
│
├── /skin/tradzik/ — Trądzik (wszyscy 16+)     [P: Acne Playbook | S: Barrier Reset | Tool: Test Bariera + Generator Rutyny]
│   ├── /skin/tradzik/pierwszy-tydzien-bez-panikowania/
│   ├── /skin/tradzik/purging-vs-podraznienie-rozroznianie/
│   └── /skin/tradzik/plan-na-slady-pih-pie-w-60-sekund/
│
├── /skin/rumien-rozacea/ — Zaczerwienienia & Rosacea (non‑medical)
│     [P: Redness & Rosacea‑Friendly | S: Sun Playbook | Tool: Dziennik Flush Events]
│   ├── /skin/rumien-rozacea/wyzwalacze-i-proste-kontry/
│   ├── /skin/rumien-rozacea/lagodne-aktywy-ktore-nie-pala/
│   └── /skin/rumien-rozacea/jak-mowic-w-gabinecie-krotkie-scenariusze/
│
├── /skin/pigmentacja/ — Przebarwienia (PIH/PIE)
│     [P: Even Tone | S: Sun Playbook | Tool: Standardy Zdjęć (PDF)]
│   ├── /skin/pigmentacja/pih-vs-pie-jak-odroznic/
│   ├── /skin/pigmentacja/czy-witamina-c-ma-sens-dla-mnie/
│   └── /skin/pigmentacja/kiedy-warto-pojsc-na-zabieg/
│
├── /skin/bariera/ — Bariera & wrażliwość      [P: Barrier Reset | S: Conscious Skincare | Tool: Test Bariera Skórna]
│   ├── /skin/bariera/sygnaly-rozregulowanej-bariery/
│   ├── /skin/bariera/14-dni-do-spokojniejszej-skory/
│   └── /skin/bariera/emolienty-humektanty-occlusive-prosto/
│
├── /skin/cialo/ — Skóra ciała (KP, bacne…)    [P: Body Confidence | S: Sun Playbook | Tool: Harmonogram Prysznic‑Pranie (PDF)]
│   ├── /skin/cialo/keratosis-pilaris-bez-przesady/
│   ├── /skin/cialo/trening-pot-i-prysznic-czasowanie/
│   └── /skin/cialo/jak-dbac-o-plecy-siatkowka-bacne/
│
├── /skin/skalp-wlosy/ — Skalp & linia włosów  [P: Scalp Sense | S: Men’s Playbook | Tool: Plan Rotacji Szamponów]
│   ├── /skin/skalp-wlosy/czytanie-etykiet-szamponow-aktywnych/
│   ├── /skin/skalp-wlosy/lagodny-dzien-resetu/
│   └── /skin/skalp-wlosy/kiedy-zmienic-szczotke-i-tekstylia/
│
├── /skin/mezczyzni/ — Skóra męska             [P: Men’s Playbook | S: Sun Playbook | Tool: Checklista Dnia Golenia]
│   ├── /skin/mezczyzni/golenie-bez-podrazen-3-kroki/
│   ├── /skin/mezczyzni/spf-dla-brody-i-stubble/
│   └── /skin/mezczyzni/torba-gym-3-produkty-ktore-wystarcza/
│
├── /skin/zakupy/ — Zakupowy know‑how          [P: Conscious Skincare | S: Even Tone | Tool: Analiza INCI + Checklista Roszczeń]
│   ├── /skin/zakupy/czytanie-inci-w-60-sekund/
│   ├── /skin/zakupy/jak-nie-przepalac-budzetu/
│   └── /skin/zakupy/duze-opakowania-kiedy-sie-oplaca/
│
├── /skin/zabiegi/ — Zabiegi profesjonalne (non‑medical)
│     [P: Procedure Navigator (Even Tone) | S: Redness‑Friendly | Tool: Karta Rozmowy w Gabinecie]
│   ├── /skin/zabiegi/pytania-przed-pilingiem/
│   ├── /skin/zabiegi/czego-oczekiwac-po-zabiegu/
│   └── /skin/zabiegi/ryzyko-pih-kto-bardziej-narazony/
│
└── /skin/mity-faq/ — Mity i najczęstsze pytania
      [P: Conscious Skincare | S: zależnie od wpisu | Tool: Quiz Prawda/Mit]
    ├── /skin/mity-faq/mit-kwasy-i-retinol-nie-da-sie-laczyc/
    ├── /skin/mity-faq/mit-woda-termalna-leczy-wszystko/
    └── /skin/mity-faq/faq-zapachy-i-podraznienia/

```

---

## Wsparcie odkrywania treści

```
/skin/szukaj/                      ← wyszukiwarka (facet: kategoria, typ, narzędzie, e‑book)
/skin/tag/<tag>/                   ← taksonomia tagów (np. /skin/tag/retinoidy/)

```

> Breadcrumbs (wzorzec):
> 
> 
> `/Skin/ > /Skin/<Kategoria>/ > /Skin/<Kategoria>/<Tytuł‑wpisu>/`
> 

---

## Moduły kategorii (layout)

Każdy **hub kategorii** zawiera: **hero** → „Co zyskuję” → **3–5 wyróżnionych wpisów** → **Narzędzie tygodnia** → **CTA e‑book (Primary)** → **upsell (Secondary)** → **zapis e‑mail** → mini‑FAQ (3 Q).

---

### 1) `/skin/podstawy/` — Podstawy pielęgnacji

- **Primary e‑book:** *Conscious Skincare*
- **Secondary:** *Barrier Reset*
- **Tool:** Generator Rutyny
    
    **Posts:**
    
- `/skin/podstawy/minimalny-plan-24h-dla-zapracowanych/`
- `/skin/podstawy/sucho-vs-odwodnienie-jak-rozpoznac-w-5-minut/`
- `/skin/podstawy/jak-dobrac-krem-tekstura-i-wyglad/`
- `/skin/podstawy/czyszczenie-bez-przesuszania/`

### 2) `/skin/rutyna-24h/` — Rutyny i nawyki

- **Primary e‑book:** *Conscious Skincare*
- **Secondary:** *Men’s Playbook*
- **Tool:** Kalendarz Retinolu
    
    **Posts:**
    
- `/skin/rutyna-24h/plan-na-dni-z-goleniem-i-bez/`
- `/skin/rutyna-24h/jak-utrzymac-80-proc-adherencje/`
- `/skin/rutyna-24h/tydzien-resetu-barierowego/`

### 3) `/skin/skladniki/` — Składniki (INCI)

- **Primary e‑book:** *Ingredient Atlas (bundle inside Conscious)*
- **Secondary:** *Even Tone*
- **Tool:** Analiza INCI
    
    **Sub‑hubs (optional):** `/retinoidy/`, `/kwasy/`, `/antyoksydanty/`
    
    **Posts:**
    
- `/skin/skladniki/retinoidy-rodzina-efekty-i-rytm-wprowadzania/`
- `/skin/skladniki/niacynamid-10-proc-kiedy-ma-sens/`
- `/skin/skladniki/kwas-azelinowy-na-zaczerwienienia-i-pory/`

### 4) `/skin/spf/` — Słońce i fotoprotekcja

- **Primary e‑book:** *Sun Playbook*
- **Secondary:** *Even Tone*
- **Tool:** Kalkulator SPF + Dzienny Limit UV
    
    **Posts:**
    
- `/skin/spf/jak-wybrac-spf-ktory-naprawde-nosze/`
- `/skin/spf/zimowy-blask-slonca-a-ochrona-w-biurze/`
- `/skin/spf/tekstury-dla-skory-tlustej-i-z-brodka/`

### 5) `/skin/tradzik/` — Trądzik (wszyscy 16+)

- **Primary e‑book:** *Acne Playbook*
- **Secondary:** *Barrier Reset*
- **Tool:** Test Bariera + Generator Rutyny
    
    **Posts:**
    
- `/skin/tradzik/pierwszy-tydzien-bez-panikowania/`
- `/skin/tradzik/purging-vs-podraznienie-rozroznianie/`
- `/skin/tradzik/plan-na-slady-pih-pie-w-60-sekund/`

### 6) `/skin/rumien-rozacea/` — Zaczerwienienia & Rosacea *(non‑medical)*

- **Primary e‑book:** *Redness & Rosacea‑Friendly*
- **Secondary:** *Sun Playbook*
- **Tool:** Dziennik Flush Events
    
    **Posts:**
    
- `/skin/rumien-rozacea/wyzwalacze-i-proste-kontry/`
- `/skin/rumien-rozacea/lagodne-aktywy-ktore-nie-pala/`
- `/skin/rumien-rozacea/jak-mowic-w-gabinecie-krotkie-scenariusze/`

### 7) `/skin/pigmentacja/` — Przebarwienia (PIH/PIE)

- **Primary e‑book:** *Even Tone*
- **Secondary:** *Sun Playbook*
- **Tool:** Standardy Zdjęć (PDF)
    
    **Posts:**
    
- `/skin/pigmentacja/pih-vs-pie-jak-odroznic/`
- `/skin/pigmentacja/czy-witamina-c-ma-sens-dla-mnie/`
- `/skin/pigmentacja/kiedy-warto-pojsc-na-zabieg/`

### 8) `/skin/bariera/` — Bariera & wrażliwość

- **Primary e‑book:** *Barrier Reset*
- **Secondary:** *Conscious Skincare*
- **Tool:** Test Bariera Skórna
    
    **Posts:**
    
- `/skin/bariera/sygnaly-rozregulowanej-bariery/`
- `/skin/bariera/14-dni-do-spokojniejszej-skory/`
- `/skin/bariera/emolienty-humektanty-occlusive-prosto/`

### 9) `/skin/cialo/` — Skóra ciała (KP, bacne, wrastające)

- **Primary e‑book:** *Body Confidence*
- **Secondary:** *Sun Playbook*
- **Tool:** Harmonogram Prysznic‑Pranie (PDF)
    
    **Posts:**
    
- `/skin/cialo/keratosis-pilaris-bez-przesady/`
- `/skin/cialo/trening-pot-i-prysznic-czasowanie/`
- `/skin/cialo/jak-dbac-o-plecy-siatkowka-bacne/`

### 10) `/skin/skalp-wlosy/` — Skalp & linia włosów

- **Primary e‑book:** *Scalp Sense*
- **Secondary:** *Men’s Playbook*
- **Tool:** Plan Rotacji Szamponów
    
    **Posts:**
    
- `/skin/skalp-wlosy/czytanie-etykiet-szamponow-aktywnych/`
- `/skin/skalp-wlosy/lagodny-dzien-resetu/`
- `/skin/skalp-wlosy/kiedy-zmienic-szczotke-i-tekstylia/`

### 11) `/skin/mezczyzni/` — Skóra męska

- **Primary e‑book:** *Men’s Playbook*
- **Secondary:** *Sun Playbook*
- **Tool:** Checklista Dnia Golenia
    
    **Posts:**
    
- `/skin/mezczyzni/golenie-bez-podrazen-3-kroki/`
- `/skin/mezczyzni/spf-dla-brody-i-stubble/`
- `/skin/mezczyzni/torba-gym-3-produkty-ktore-wystarcza/`

### 12) `/skin/zakupy/` — Zakupowy know‑how

- **Primary e‑book:** *Conscious Skincare*
- **Secondary:** *Even Tone*
- **Tool:** Analiza INCI + Checklista Roszczeń
    
    **Posts:**
    
- `/skin/zakupy/czytanie-inci-w-60-sekund/`
- `/skin/zakupy/jak-nie-przepalac-budzetu/`
- `/skin/zakupy/duze-opakowania-kiedy-sie-oplaca/`

### 13) `/skin/zabiegi/` — Zabiegi profesjonalne *(non‑medical)*

- **Primary e‑book:** *Procedure Navigator (Even Tone)*
- **Secondary:** *Redness‑Friendly*
- **Tool:** Karta Rozmowy w Gabinecie
    
    **Posts:**
    
- `/skin/zabiegi/pytania-przed-pilingiem/`
- `/skin/zabiegi/czego-oczekiwac-po-zabiegu/`
- `/skin/zabiegi/ryzyko-pih-kto-bardziej-narazony/`

### 14) `/skin/mity-faq/` — Mity i najczęstsze pytania

- **Primary e‑book:** *Conscious Skincare*
- **Secondary:** relevant per post
- **Tool:** Quiz Prawda/Mit
    
    **Posts:**
    
- `/skin/mity-faq/mit-kwasy-i-retinol-nie-da-sie-laczyc/`
- `/skin/mity-faq/mit-woda-termalna-leczy-wszystko/`
- `/skin/mity-faq/faq-zapachy-i-podraznienia/`

---

## Support pages for blog discovery

```
/skin/szukaj/                      ← On‑site search
/skin/tag/<tag>/                   ← Tag taxonomy (e.g., /skin/tag/retinoidy/)

```

---

## Redirect & Canonical Plan (must‑ship)

- **301** from each legacy `/skin/blog/<kategoria>/<artykuł>/` → `/skin/<kategoria>/<artykuł>/`.
- Category index **301**: `/skin/blog/<kategoria>/` → `/skin/<kategoria>/`.
- Preserve titles, meta, and H1s; add `<link rel="canonical">` to new URLs for 4 weeks.
- Update internal links, nav, sitemap.xml; resubmit in Search Console.

---

## Funnel Modules (per category)

- **Hero CTA (Primary e‑book)**: *“Pobierz rozdział: Mój plan 24 h”* (email capture).
- **Mid‑article tool CTA** (contextual): e.g., `/spf/` shows **Kalkulator SPF**.
- **Exit‑intent** (gentle): *“Chcesz gotowy plan? E‑book –15% dziś.”*
- **“Co zyskuję” side‑box:** 3 bullets in first person, PL.

**Mapping (examples)**

- `/skin/spf/` → Primary: *Sun Playbook* | Secondary: *Even Tone* | Tool: **Kalkulator SPF**
- `/skin/tradzik/` → Primary: *Acne Playbook* | Secondary: *Barrier Reset* | Tool: **Test Bariera**
- `/skin/pigmentacja/` → Primary: *Even Tone* | Secondary: *Sun Playbook* | Tool: **Standard Zdjęć (PDF)**

---

## Component & Template System

- **Category Hub template:** hero, benefits, featured posts, tool block, primary/secondary CTAs, email capture, FAQ (3 Qs).
- **Article template:** progress bar; sticky table of contents; inline glossary hovers; **2 CTA slots** (after H2 and before conclusion).
- **Tool card**: title, 1‑line benefit, “Uruchom” button.
- **E‑book card**: cover, 3 bullets “Co zyskuję”, price/discount ribbon, “Pobierz próbkę”.

---

## Editorial Calendar (starter)

- **4 posts/month**, one per core funnel category: `/spf/`, `/tradzik/`, `/skladniki/`, `/zakupy/`.
- Each post links to: (a) primary e‑book page; (b) one tool; (c) one related category post.

---

## Governance & Measurement

- **Events:** `ebook_view`, `ebook_sample_dl`, `tool_open`, `cta_primary_click`, `cta_secondary_click`, `checkout_start`.
- **Dashboards:** CTR by category, CSR by category, tool usage uplift.
- **Goal:** +25% **checkout start rate** from organic in 60 days.