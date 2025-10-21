# Clarivum Brand Design System v1.0 — **A to Z**

> Brand promise: knowledge‑forward wellness that is premium, serene, and trustworthy.
> 
> 
> **Visual theme:** Korean calm, scientific rigor, natural materials, limited ornament.
> 
> **Pillars:** **evidence, craft, harmony, restraint**.
> 

---

## A) Brand Architecture & Naming

- **Master brand:** **Clarivum**.
- **Pillars (sub‑brands):**
    - **Clarivum Skin** — topicals & appearance comfort (kept).
    - **Clarivum Fuel** — food & supplements (ingestibles literacy; non‑medical).
    - **Clarivum Habits** — sleep, stress, movement, environment & care‑navigation (non‑medical).
- **One‑hue policy:** **Jade** is the **only action color** for all pillars. Differentiation uses surface **ratios, layout density, and motifs** (see Section K).

---

## B) Core Marks (Logo System)

- **Primary icon:** minimalist **Rod of Asclepius**; single serpent with **leaf‑tail** cue to nature.
- **Primary lockup:** icon left, wordmark right, optical centers aligned.
- **Stacked lockup:** icon above, wordmark below; total width = icon height × 2.
- **Clear space:** minimum = **rod height** on all sides.
- **Minimum sizes:** icon **18 px** digital, **8 mm** print. **Hide gold ring** below 24 px.
- **Misuse (never):** gradients, shadows, tilt, mirroring the serpent, stroke changes, recolors.

**File delivery**

- `/brand/logo/` — SVG, PDF, EPS (live + outlined), dark/light variants; monochrome Jade and Ink.
- Favicon: 32/48/64 px PNG + SVG; mask icon for Safari pinned tabs.

---

## C) Wordmark & Typography

- **Wordmark typeface:** modern serif with high contrast, smooth terminals. Options: **Cormorant Garamond, Canela, or licensed equivalent**.
- **Pairing (UI/body):** **Inter** (or system sans) for UI; **Noto Serif KR / Noto Sans KR** for Korean.
- **Tracking:** +40–60 display, +10 nav, 0 small text.
- **Case:** uppercase **CLARIVUM** by default; Title Case allowed in body.

**Type scale (desktop)**

- H1 **56**, H2 **40**, H3 **28**, H4 **22**, Body **18**, Small **16**.
- Line‑height: headlines **1.1**, body **1.5**, Korean body **1.35**.
- Numerals: **lining** for UI, **oldstyle** allowed in long‑form.
- Ligatures: standard only; discretionary **off** for UI clarity.

---

## D) Color System (Tokens & Roles)

| Token | Hex | Role & Notes |
| --- | --- | --- |
| **Jade** | **#2E6B5A** | **Primary/action**; trust, nature, depth |
| **Beige** | **#EDE6DA** | **Ground/surfaces**; warm, quiet |
| **Gold** | **#C7A55A** | **Accent (micro only)**; foil spot, dividers |
| **Ink** | **#0E0F0F** | **Text** on light grounds; data |
| **Snow** | **#FFFFFF** | **Canvas**/secondary background |

**Accessibility (WCAG quick refs)**

- **Ink on Beige**: ~15.5:1 → **AAA** ✓ (use for long‑form).
- **Ink on Snow**: 21:1 → **AAA** ✓.
- **Jade on Beige**: ~5.0:1 → **AA** ✓ (headlines, overlines; limit paragraphs).
- **Snow on Jade**: ~6.2:1 → **AA** ✓ (**AAA large**).
- **Gold on Beige**: ~1.9:1 → **FAIL** (decorative only).

**CMYK starting points** *(proof on press)*

- Jade **75/30/55/30**, Beige **6/7/14/0**, Gold (ink) **20/30/70/5**; metallic foil for premium SKUs.

---

## E) Layout & Grid

- **8‑pt spacing system**; **12‑column** desktop, **4‑column** mobile.
- **Gutters:** 24 px desktop / 16 px tablet / 12 px mobile.
- **Section rhythm:** top 96 px • internal 64 px • bottom 96 px (desktop).
- **Cards:** 12 px radius, **1 px hairline** border at **Jade 10%** opacity.
- **Shadows:** **none**; depth via tints and hairlines.

---

## F) Iconography

- **Style:** outline, uniform stroke, rounded caps/joins, circular holds.
- **Stroke:** **2.0 px** at 24 px artboard (scale proportionally).
- **Corners:** ≤12° interior curvature; avoid interior angles <60°.
- **Negative space:** ≥1.5× stroke inside containers.
- **Fills:** none, except micro dots or the gold ring in hero marks.

---

## G) Motion

- **Principle:** calm, responsive, purpose‑driven.
- **Durations:** micro **120 ms**, standard **180 ms**, hero **240 ms**.
- **Easing:** `cubic-bezier(0.2,0.0,0.2,1)` for move/fade.
- **Entrance:** fade‑in + 8 px rise; **Exit:** 8 px drop + fade.
- **Icon hover:** 2 px stroke tint shift, 10% scale, 120 ms.
- **Reduced motion:** honor `prefers-reduced-motion` → opacity‑only.

---

## H) Imagery

- **Photography:** soft diffused light, neutral backgrounds, jade props, real textures.
- **People:** diverse tones, relaxed posture, clean skin, no heavy retouch.
- **Food (Fuel):** in‑season produce, matte ceramics, top‑down or 45°.
- **Post:** −10–15% saturation, slight shadow lift, gentle contrast.

---

## I) Accessibility

- **Target:** WCAG **2.2 AA** minimum; AAA where practical for body text.
- **Text on light grounds:** **Ink** or **Jade** only (with size caveats).
- **Focus states:** **2 px outline** — Jade @ 40% on light; **Beige ring** on Jade surfaces.
- **Hit areas:** ≥ **44×44 px**; 8‑pt spacing preserved.
- **Forms:** label + helper text; error messaging not color‑only (icon + text).

---

## J) Components (Web/UI)

**Buttons**

- **Primary:** Jade fill, Snow text, radius 10–12 px, vertical padding 14 px.
    - Hover: Jade‑90 (tint) • Active: Jade‑110 (shade) • Disabled: 30% opacity, cursor default.
- **Secondary:** Jade outline 1 px, Jade text; hover: Beige fill @ ~6–10%.
- **Link buttons:** Jade text + underline on hover/focus; no ghost buttons.

**Forms**

- Inputs: **1 px Jade‑10** border, 12 px radius, 12 px padding; Focus: **2 px Jade** outline + 2 px offset.
- Error: Ink text + caution icon + Jade border; never red fills.
- Toggles/checkboxes: Jade track/check; focus ring as above.

**Navigation**

- Top bar height: **72 px** desktop / **56 px** mobile.
- Logo min width: **160 px** desktop / **120 px** mobile.
- Active link: Jade text + 1 px bottom border (Jade 100%).

**Cards**

- Surfaces: Snow or Beige‑95; hairline Jade‑10% border; 12 px radius.
- Content: Ink title, Ink‑80 meta, Jade link.

**Tables**

- Header Ink; zebra rows Beige‑95; row hover Beige‑90; dividers Ink‑10% (or Jade‑10%).

**Alerts**

- Neutral info only; icon + title Ink; border Jade‑30%. No colored backgrounds.

**Modals**

- Surface Snow; 24–32 px padding; close icon Jade; focus trap; ESC closes.

**Tabs & Breadcrumbs**

- Tabs: underlined active (Jade border); Breadcrumbs: Ink text, Jade link, `>` separator.

**Charts**

- Monochrome **Jade tints** (60–100%); Ink axes; Gold only as a **single annotation**.

**Empty states**

- Outline illustration (Jade/Ink), one sentence in Ink, primary CTA in Jade.

---

## K) Pillar Theming (without new hues)

**One‑hue policy:** **Jade** for all actions. Pillar mood via **surfaces/layout/motifs**:

| Pillar | Surface ratio | Typographic feel | Imagery cue | Micro accent |
| --- | --- | --- | --- | --- |
| **Skin** | Beige‑forward, Snow for data | Serif display + Sans body | clean skin, neutral props | micro Gold dots/dividers |
| **Fuel** | Snow‑forward, Beige cards | Sans‑forward tables/lists | produce/capsules (outline) | sparse Gold section markers |
| **Habits** | 50/50 Snow–Beige, more whitespace | Serif headlines, roomy body | moon/clock/steps (outline) | minimal Gold or none |

**Surface tokens** (backgrounds only):

- `-surface-skin` = Beige‑95, `-surface-fuel` = Snow + Beige veil 10%, `-surface-habits` = Beige‑85.

---

## L) Copy & Voice

- **Tone:** precise, calm, informed; never hypey.
- **Sentence length:** 8–18 words; **lead with result**.
- **Vocabulary:** science‑literate, plain terms; define acronyms on first use.
- **Microcopy:** verbs first, no colons in buttons.
- **Examples:** “Przeczytaj dowody”, “Pobierz rozdział”, “Uruchom narzędzie”.

---

## M) Motion & Interaction Accessibility

- Always provide **non‑motion cues** (underline, border) in addition to color.
- Respect `prefers-reduced-motion`; switch to opacity‑only fades.
- Focus visible at all times (keyboard and pointer).

---

## N) Web Structure & Templates (applies to all pillars)

- **URL pattern:** `/skin/<kategoria>/<artykuł>` (similarly `/fuel/…`, `/habits/…`).
- **Templates:**
    - **Category hub:** hero, benefits, featured posts, tool block, primary/secondary CTAs, email capture.
    - **Article:** sticky ToC, glossary hovers, 2 CTA slots (mid + pre‑conclusion), progress bar.

---

## O) Email & Editorial

- **Header:** wordmark, Jade accent rule.
- **Body:** Ink on Snow; CTA buttons Jade.
- **Footer:** micro Gold divider (1 px), legal links in Ink‑80.
- **Signature:** wordmark lockup, name/title, Jade links.

---

## P) Social & Ads

- **Backgrounds:** Snow or Beige‑95.
- **Type:** large serif headline, Sans details.
- **Do not** use Gold for body copy; micro dots/dividers only.

---

## Q) Print & Packaging

- **Paper:** uncoated warm white 120–150 gsm interiors; 350 gsm cover.
- **Foil:** warm Gold, semi‑matte; foil only the ring or icon head.
- **Emboss:** 0.3–0.5 mm; blind emboss on Jade substrates.
- **Lines:** min 0.2 mm ink; 0.25 mm foil.
- **Dielines:** safety 4 mm; bleed 2 mm; 6 mm from folds.
- **Barcode:** 37.29×25.93 mm, bottom back, no foil nearby.

---

## R) Internationalization

- **Korean pairing:** Noto Serif KR / Spoqa Han Serif for headlines; Noto Sans KR for UI.
- **Spacing:** looser letter‑spacing (+1 to +2) for Korean display.
- **Date/number formats:** ISO‑8601 dates in UI; decimal comma or dot per locale.

---

## S) Governance & Files

- **File tree:**
    - `/brand/logo/` (SVG, PDF, EPS; live + outlined)
    - `/brand/type/` (licenses, CSS)
    - `/brand/colors/` (ASE, ACO, .clr, JSON tokens)
    - `/ui/icons/` (16/20/24/32 px, stroke 2 px)
    - `/print/` (dielines, proofs, Pantone notes, press approvals)
- **Review cadence:** monthly hygiene; **quarterly drift audit** with screenshots.
- **Versioning:** semantic tags, e.g., `v1.2.0-icons`.

---

## T) Do & Don’t (Quick Rules)

**Do**

- Use **Ink** for long‑form text; **Jade** for actions and short headings.
- Keep layouts quiet; prefer **hairlines** over shadows.
- Limit **Gold** to micro details (<3% of a page).
- Maintain clear space around marks.

**Don’t**

- Introduce new brand hues per pillar.
- Set any text in **Gold**.
- Add gradients or shadows to marks.
- Outline the wordmark.

---

## U) QA Checklists

**Accessibility**

- [ ]  All body text Ink on Beige/Snow (AA/AAA).
- [ ]  Buttons: Jade fill/Snow label (AA).
- [ ]  Focus ring visible; color‑independent cues present.
- [ ]  Motion reduced when requested.

**Visual**

- [ ]  No shadows; hairline borders only.
- [ ]  Gold used as micro accent only.
- [ ]  Icon strokes uniform; no fills (except permitted dots/ring).

**Content**

- [ ]  Headlines lead with result; 8–18 word sentences.
- [ ]  Acronyms defined on first use.

---

## V) Measurement

- **Design velocity:** tickets shipped/week.
- **AA coverage:** % of text elements passing AA or higher.
- **CTA performance:** Jade primary CTR vs. historical.
- **Brand drift index:** # of non‑token colors detected by linter per release.

---

## W) Legal & Compliance

- **Trademarks:** lockups used as delivered; no alternations.
- **Regulatory:** educational, non‑medical framing across Skin/Fuel/Habits; claims literacy allowed, **no treatment claims**.

---

## X) Example Implementations

**Hero block (web)**

- Background: `-surface-skin` (or pillar surface).
- H1 (Ink), overline (Jade), body (Ink), primary CTA (Jade), secondary CTA (Jade outline).
- Illustration: outline style; Jade strokes; no fills.

**Blog card**

- Background: Beige‑95; border Jade‑10%; title Ink; meta Ink‑80; link Jade.

**Data chart**

- Bars: Jade tints 60–100%; axes Ink; single Gold annotation arrow.

---

## Y) Developer Tokens (CSS & JSON)

**CSS tokens**

```css
:root{
  /* Core colors */
  --clr-jade:#2E6B5A; --clr-beige:#EDE6DA; --clr-gold:#C7A55A;
  --clr-ink:#0E0F0F; --clr-snow:#FFFFFF;

  /* Surfaces (pillar accents) */
  --surface-skin:  color-mix(in srgb, var(--clr-beige), white 5%);   /* Beige-95 */
  --surface-fuel:  color-mix(in srgb, var(--clr-snow), var(--clr-beige) 10%); /* Snow veil */
  --surface-habits:color-mix(in srgb, var(--clr-beige), white 15%);  /* Beige-85 */

  /* Interaction states */
  --jade-90:  color-mix(in srgb, var(--clr-jade), white 10%); /* hover */
  --jade-110: color-mix(in srgb, var(--clr-jade), black 10%); /* active */

  /* Radii & spacing */
  --radii-card:12px; --radii-button:10px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-6:24px;

  /* Type */
  --font-serif:'Cormorant Garamond','Noto Serif KR',serif;
  --font-sans:'Inter','Noto Sans KR',system-ui,sans-serif;

  /* Hairline */
  --hairline:0 0 0 1px rgba(46,107,90,0.10);
}

```

**JSON tokens (excerpt)**

```json
{
  "color": {
    "jade": {"value":"#2E6B5A"},
    "beige": {"value":"#EDE6DA"},
    "gold": {"value":"#C7A55A"},
    "ink": {"value":"#0E0F0F"},
    "snow": {"value":"#FFFFFF"},
    "jadeHover": {"value":"{color.jade} 90% tint"},
    "jadeActive": {"value":"{color.jade} 110% shade"}
  },
  "radius": {"card":{"value":"12px"},"button":{"value":"10px"}},
  "space": {"1":{"value":"4px"},"2":{"value":"8px"},"3":{"value":"12px"},"4":{"value":"16px"},"6":{"value":"24px"}},
  "typeface": {"serif":{"value":"Cormorant Garamond"},"sans":{"value":"Inter"}}
}

```