**Brand architecture (branded house):**

- **Clarivum Skin** — *Topicals & appearance comfort* (cosmetic focus, Poland‑first).
- **Clarivum Fuel** — *Food & supplements* (meal structure, grocery systems, supplement literacy; non‑medical, Poland first).
- **Clarivum Habits** — *Sleep, stress, movement, environment & care‑navigation* (trainings, non‑medical, Poland first).

**Scope boundaries (include/exclude):**

- **Skin**: Face/body/scalp/hair routines, ingredient literacy, SPF adherence, at‑home device literacy (education only), clinic conversation prep. *Exclude:* diagnosis/treatment.
- **Fuel**: Meal timing, protein/fiber targets, pantry systems, vitamin understanding, dining‑out swaps, **supplement claims literacy**. *Exclude:* therapeutic diets, medical nutrition therapy.
- **Habits**: Sleep protocol, stress tools, movement snacks, ergonomics, indoor air/light, **doctor/pharmacist conversation scripts**, screening literacy (what to ask, not what to diagnose). *Exclude:* prescribing, individualized treatment.

**Naming & taglines:**

- Clarivum **Skin** — “Świadoma pielęgnacja, zero ściemy.”
- Clarivum **Fuel** — “Jedzenie i suplementy, które działają dla Ciebie.”
- Clarivum **Habits** — “Sen, stres, ruch - decyzje, które trzymasz.”

**Primary funnels (pillar → flagship e‑books):**

- **Skin:** *Conscious Skincare* → Acne line, Sun Playbook, Redness, Men’s Playbook.
- **Fuel:** *Smart Protein & Fiber* → *Even Tone via Diet* (PIH‑supportive habits), *Supplement Claims Decoded*.
- **Habits:** *Sleep ROI* → *Stress Protocol*, *Office Ergonomics*, *Sun & Light Daily*.

**Example pillar taxonomies (with CTAs):**

- **/fuel/** — *białko*, *błonnik*, *cukier & glikemia*, *posiłki & planowanie*, *suplementy*, *zakupy* → Primary CTA: *Smart Protein & Fiber* e‑book; Tool: *Planner posiłków*.
- **/habits/** — *sen*, *stres*, *ruch & ergonomia*, *światło & UV*, *nawigacja opieki* → Primary CTA: *Sleep ROI*; Tool: *Kalkulator snu 90‑min*; Secondary: *Conversation Pack*.

**Editorial & product map (starter):**

- **Fuel** e‑books: *Smart Protein (PL pantry)* • *Fiber 30* • *Supplement Claims Decoded* • *Meal Systems for Busy Weeks*.
- **Habits** e‑books: *Sleep ROI* • *Stress in 3 Levers* • *Movement Snacks @ Desk* • *Doctor/Pharmacy Scripts* (non‑medical).

**Design system cues:**

- Global CTA/action color: Jade (#2E6B5A) across all pillars.
- Color accents: Skin (teal), Fuel (amber), Habits (indigo).
- Icons: Skin (leaf/dermis), Fuel (fork/capsule), Habits (moon/heart/steps).
- Reusable CTA blocks: “Pobierz rozdział”, “Uruchom narzędzie”, “Zobacz pakiet”.

---

## Key decisions (so you see the logic)

- **Vertical slugs** are the sub‑brand names: `/skin/`, `/fuel/`, `/habits/`.
    
    *Set 301s from older generic slugs:* `/nutrition/ → /fuel/`, `/health/ → /habits/`.
    
- **Content types** are consistent per vertical: **Start**, **Topics (pillar hubs)**, **Guides**, **Comparisons**, **Tools**, **Recommendations (affiliate)**, **Reviews**, **Glossary**, **FAQ**, **Newsletter**, **Blog**, and **Ebooks**.
- **Global hubs** (ebooks, tools, blog, recommendations) aggregate and facet by vertical, but canonical content lives **inside each vertical**.
- **E‑E‑A‑T & YMYL**: dedicated editorial, methodology, medical disclaimer, and author pages.
- **Conversion surfaces**: vertical “Start here” pages, in‑content CTAs, per‑vertical quiz/diagnostic landers, and coupon hub.

---

## Refined global sitemap (v1)

```
/                                  ← Clarivum home (brand hub + funnel only)
│   ├── #hero                      – “Uczymy. Upraszczamy. Dowozimy.”
│   ├── #subbrands                 – Cards: Skin / Fuel / Habits (+ key promises)
│   ├── #narzedzia-top             – Cross-vertical tools sampler (3–6 tiles)
│   ├── #dowody-sukcesu            – Testimonials / press logos / metrics
│   ├── #cta-newsletter            – Global sticky signup (segmentation by vertical)
│   └── #cta-ebooks                – Lead magnet → /ebooks/
│
├── /skin/                         ← Sub‑brand hub (vertical homepage)
│   ├── /skin/start/               – “Zacznij tutaj” (diagnostic → ebook/tool/rec)
│   ├── /skin/tematy/              – Pillar hubs (SEO categories)
│   │   ├── /skin/tematy/spf/
│   │   ├── /skin/tematy/retinol/
│   │   ├── /skin/tematy/tradzik/
│   │   └── /skin/tematy/bariera/
│   ├── /skin/przewodniki/         – Longform guides (cluster spokes)
│   ├── /skin/porownania/          – A vs B, rankings, “najlepsze X”
│   ├── /skin/recenzje/            – Single product reviews (schema markup)
│   ├── /skin/narzedzia/           – Calculators & checkers
│   │   ├── /skin/narzedzia/uv-index-spf/
│   │   ├── /skin/narzedzia/retinoid-planner/
│   │   └── /skin/narzedzia/skladniki-checker/
│   ├── /skin/polecenia/           – Affiliate picks (collections)
│   │   ├── /skin/polecenia/najlepsze-kremy-spf/
│   │   ├── /skin/polecenia/serumy-retinol/
│   │   └── /skin/polecenia/odbudowa-bariery/
│   ├── /skin/ebooki/              – Skin ebooks listing
│   ├── /skin/blog/                – Vertical blog (news/updates)
│   ├── /skin/slownik/             – Glossary (A–Z + /skin/slownik/<haslo>/)
│   ├── /skin/faq/
│   ├── /skin/newsletter/
│   └── /skin/rss.xml
│
├── /fuel/                         ← Sub‑brand hub (nutrition)
│   ├── /fuel/start/
│   ├── /fuel/tematy/
│   │   ├── /fuel/tematy/bialko/
│   │   ├── /fuel/tematy/tluszcze/
│   │   ├── /fuel/tematy/mikroelementy/
│   │   └── /fuel/tematy/odchudzanie/
│   ├── /fuel/przewodniki/
│   ├── /fuel/porownania/
│   ├── /fuel/recenzje/
│   ├── /fuel/narzedzia/
│   │   ├── /fuel/narzedzia/kalkulator-tdee/
│   │   ├── /fuel/narzedzia/cel-bialka/
│   │   └── /fuel/narzedzia/planer-posilkow/
│   ├── /fuel/polecenia/
│   │   ├── /fuel/polecenia/bialko/
│   │   ├── /fuel/polecenia/omega-3/
│   │   └── /fuel/polecenia/madre-przekaski/
│   ├── /fuel/ebooki/
│   ├── /fuel/blog/
│   ├── /fuel/slownik/ (+ /fuel/slownik/<haslo>/)
│   ├── /fuel/faq/
│   ├── /fuel/newsletter/
│   └── /fuel/rss.xml
│
├── /habits/                       ← Sub‑brand hub (health, routines)
│   ├── /habits/start/
│   ├── /habits/tematy/
│   │   ├── /habits/tematy/sen/
│   │   ├── /habits/tematy/aktywnosc/
│   │   ├── /habits/tematy/stres/
│   │   └── /habits/tematy/produktywnosc/
│   ├── /habits/przewodniki/
│   ├── /habits/porownania/
│   ├── /habits/recenzje/
│   ├── /habits/narzedzia/
│   │   ├── /habits/narzedzia/kalkulator-snu/
│   │   ├── /habits/narzedzia/habit-tracker/
│   │   └── /habits/narzedzia/planer-poranka/
│   ├── /habits/polecenia/
│   │   ├── /habits/polecenia/trackery-snu/
│   │   └── /habits/polecenia/lampy-swiatla-dziennego/
│   ├── /habits/ebooki/
│   ├── /habits/blog/
│   ├── /habits/slownik/ (+ /habits/slownik/<haslo>/)
│   ├── /habits/faq/
│   ├── /habits/newsletter/
│   └── /habits/rss.xml
│
├── /ebooks/                       ← Global ebooks hub/catalog
│   ├── /ebooks/skin/
│   ├── /ebooks/fuel/
│   ├── /ebooks/habits/
│   ├── /ebooks/<slug>/            – Product detail (upsells, bundle blocks)
│   └── /ebooks/faq/
│
├── /narzedzia/                    ← Global tools index (faceted by vertical/type)
│   ├── /narzedzia/skin/
│   ├── /narzedzia/fuel/
│   └── /narzedzia/habits/
│
├── /polecenia/                    ← Affiliate/referrals hub (disclosed)
│   ├── /polecenia/skin/
│   ├── /polecenia/fuel/
│   └── /polecenia/habits/
│
├── /kody-rabatowe/                ← Global coupons/deals (filter by brand/vertical)
│
├── /blog/                         ← Global blog hub (aggregates all verticals)
│   ├── /blog/skin/
│   ├── /blog/fuel/
│   └── /blog/habits/
│
├── /o-nas/                        ← Brand story
│   ├── /o-nas/redakcja/           – Editorial policy & methodology
│   ├── /o-nas/autorzy/            – Author index + /o-nas/autorzy/<autor>/
│   ├── /o-nas/dla-prasy/          – Press room / media assets
│   └── /o-nas/kariera/            – Careers (optional)
│
├── /reklama/                      ← Advertise with Clarivum
│   ├── /reklama/media-kit/
│   ├── /reklama/wspolpraca/
│   └── /reklama/kontakt/
│
├── /newsletter/                   ← Global subscription center
│   ├── /newsletter/skin/
│   ├── /newsletter/fuel/
│   └── /newsletter/habits/
│
├── /szukaj/                       ← Site search (facets: vertical, type, topic)
├── /rss/                          ← Global RSS (+ per vertical above)
├── /mapa-strony/                  ← HTML sitemap (for users; XML below)
│
├── /konto/                        ← Account area (ebooks, orders, preferences)
│   ├── /konto/logowanie/
│   ├── /konto/rejestracja/
│   ├── /konto/zamowienia/
│   ├── /konto/pobrania/
│   ├── /konto/subskrypcje/        – Newsletter prefs (granular)
│   └── /konto/ustawienia/
│
├── /koszyk/
├── /checkout/
│
├── /disclaimer-medyczny/          ← Non‑medical advice disclaimer (YMYL)
├── /jak-zarabiamy/                ← Affiliate disclosure (“How we make money”)
├── /polityka-prywatnosci/
├── /polityka-cookies/
├── /ustawienia-prywatnosci/       ← Cookie preferences (CMP)
├── /regulamin/
├── /kontakt/
│
├── /sitemap.xml                   ← XML (see note below)
└── /robots.txt

```

---

## Notes that improve conversions, SEO, and ops

### 1) URL hygiene & redirects

- **Standardize:** use `/skin/`, `/fuel/`, `/habits/` everywhere.
- **301s:**
    - `/ebooks/nutrition/ → /ebooks/fuel/`
    - `/ebooks/health/ → /ebooks/habits/`
    - `/narzedzia/nutrition/ → /narzedzia/fuel/`
    - `/narzedzia/health/ → /narzedzia/habits/`
    - Any legacy `/blog/nutrition/` → `/blog/fuel/`, etc.

### 2) Pillar → cluster model (per vertical)

- **Pillar hub** at `/[vertical]/tematy/<pillar>/` links to:
    - evergreen guides at `/[vertical]/przewodniki/<topic>/…`
    - tools at `/[vertical]/narzedzia/<tool>/`
    - affiliate collections at `/[vertical]/polecenia/<collection>/`
    - relevant ebooks at `/[vertical]/ebooki/` (+ CTA blocks)
- Internal links form **tight clusters** for topical authority.

### 3) Lead gen & monetization paths

- **“Start” diagnostics** (one per vertical) segment visitors → personalized CTAs (ebook, tool, or recommendation list).
- **In‑article CTAs**: top, mid, and end; swap by pillar (e.g., SPF calculator on SPF content).
- **Affiliate integrity**: place **/jak-zarabiamy/** in footer and reference it contextually on `/polecenia/` pages.

### 4) E‑E‑A‑T / YMYL safeguards

- Prominent **/disclaimer-medyczny/**; medical references cite sources; add **/o-nas/redakcja/** to explain methodology, fact‑checking, update cadence, and who medically reviews which articles.
- **Author pages** with credentials and all contributions.

### 5) Search, tags, and discovery

- Keep **faceted search** in `/szukaj/` with filters: vertical, content type, pillar, product brand/range, and “has coupon”.
- Avoid global `/tag/` sprawl; if needed, contain tags per vertical (e.g., `/skin/tag/<tag>/`) but prefer **pillars** for primary IA.

### 6) Sitemaps & indexing

- **/sitemap.xml** as **index** that references:
    - `/sitemaps/pages.xml`, `/sitemaps/blog.xml`, `/sitemaps/tools.xml`, `/sitemaps/ebooks.xml`, `/sitemaps/polecenia.xml`, and per‑vertical sitemaps (e.g., `/sitemaps/skin.xml`).
- Add **`lastmod`** and split large sitemaps by 10k URLs max.

### 7) Structured data (high‑level)

- **HowTo/FAQ** on appropriate guides and FAQ pages.
- **Product/Review/AggregateRating** on `/polecenia/` and `/recenzje/`.
- **SoftwareApplication** for tools.
- **Book** for `/ebooks/<slug>/`.
- **Organization** & **WebSite** on `/`, with **SearchAction** for `/szukaj/`.

### 8) Consistent component slots (per vertical page type)

- **Top nav**: vertical‑scoped (Start, Tematy, Narzędzia, Polecenia, Ebooks, Blog).
- **Sidebar**: related within pillar; glossary and tool shortcuts.
- **Footer**: global legal, disclosure, newsletter, and coupons.

---

## Optional “nice to have” additions (low effort, high ROI)

- **/kolekcje/**: editorial collections across verticals (e.g., “Back to office energy”, “Zima bez trądziku”), each linking to guides, tools, and affiliate picks.
- **/promocje/**: time‑bound roundups (seasonal sales → affiliate spikes).
- **/status/** (internal): uptime for tools; helps support.
- **/deklaracja-dostepnosci/**: accessibility statement.
