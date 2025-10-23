# First Configuration Workflow

> **Canonical decisions:** Follow `docs/adr/ADR-019-frontend-platform.md` for frontend architecture, `docs/adr/ADR-016-ci-cd-platform.md` for automation, and `docs/adr/ADR-001-primary-cloud-and-database.md` for environment provisioning.

Below is a **copy‑paste‑ready starter** for a Next.js (App Router) project on **Vercel** that mirrors your Clarivum IA and sitemap strategy (global index + per‑vertical sitemaps; redirects from old blog paths; Category‑First URLs under `/skin`, `/fuel`, `/habits`). I’m using **TypeScript** and the **App Router**.

---

## 0) Create the project & push to GitHub

```bash
# Create a Next.js 15 App Router project (TS)
npx create-next-app@latest clarivum --ts --app --eslint --src-dir --use-npm

cd clarivum
git init && git add . && git commit -m "init Clarivum"
# Create a GitHub repo and push (replace YOUR_ORG/clarivum)
git remote add origin git@github.com:YOUR_ORG/clarivum.git
git push -u origin main
```

---

## 1) Minimal folder scaffold that matches your IA

```
clarivum/
├─ app/
│  ├─ (marketing)/                ← optional route group for home/ebooks/tools/blog hubs
│  │  ├─ page.tsx                 ← "/" brand hub (funnel to Skin/Fuel/Habits)
│  │  ├─ ebooks/                  ← /ebooks global hub (optional stub)
│  │  ├─ narzedzia/               ← /narzedzia global index (optional stub)
│  │  └─ blog/                    ← /blog global index (aggregator, optional)
│  ├─ [vertical]/                 ← skin | fuel | habits
│  │  ├─ page.tsx                 ← /[vertical] hub
│  │  ├─ blog/                    ← optional index at /[vertical]/blog
│  │  │  └─ page.tsx
│  │  ├─ [category]/              ← Category‑First hub e.g. /skin/spf
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]/               ← Posts e.g. /skin/spf/jak-wybrac-spf-...
│  │  │     └─ page.tsx
│  ├─ sitemap.xml/
│  │  └─ route.ts                 ← sitemap index: /sitemap.xml
│  ├─ sitemaps/
│  │  ├─ pages.xml/
│  │  │  └─ route.ts              ← /sitemaps/pages.xml
│  │  ├─ skin.xml/
│  │  │  └─ route.ts              ← /sitemaps/skin.xml
│  │  ├─ fuel.xml/
│  │  │  └─ route.ts              ← /sitemaps/fuel.xml
│  │  └─ habits.xml/
│  │     └─ route.ts              ← /sitemaps/habits.xml
│  ├─ robots.ts                   ← /robots.txt (generated)
│  └─ rss/                        ← optional global RSS
│     └─ route.ts                 ← /rss
├─ components/
│  ├─ CtaPrimary.tsx
│  ├─ CtaSecondary.tsx
│  └─ ToolCard.tsx
├─ lib/
│  ├─ site.ts                     ← baseUrl + helpers
│  └─ content-map.ts              ← Categories, posts & CTA mapping (Skin/Fuel/Habits)
├─ next.config.ts
├─ package.json
└─ README.md
```

> We purposely use **dynamic segments** (`[vertical]/[category]/[slug]`) so you don’t have to hand‑create folders for every category/post. We statically pre‑generate only the combos you declare in `lib/content-map.ts` via `generateStaticParams`.

---

## 2) Content map that encodes your categories/posts/CTAs

Create **`lib/content-map.ts`** and paste:

```ts
// lib/content-map.ts
export type VerticalKey = 'skin' | 'fuel' | 'habits';

type Category = {
  label: string;
  ebookPrimary: string;   // slug or name
  ebookSecondary: string; // slug or name
  tool: string;
  posts: string[];        // post slugs
};

type Vertical = {
  categories: Record<string, Category>; // key is category slug
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clarivum.vercel.app';

export const content: Record<VerticalKey, Vertical> = {
  skin: {
    categories: {
      'podstawy': {
        label: 'Podstawy pielęgnacji',
        ebookPrimary: 'conscious-skincare',
        ebookSecondary: 'barrier-reset',
        tool: 'generator-rutyny',
        posts: [
          'minimalny-plan-24h-dla-zapracowanych',
          'sucho-vs-odwodnienie-jak-rozpoznac-w-5-minut',
          'jak-dobrac-krem-tekstura-i-wyglad',
          'czyszczenie-bez-przesuszania',
        ],
      },
      'rutyna-24h': {
        label: 'Rutyny i nawyki',
        ebookPrimary: 'conscious-skincare',
        ebookSecondary: 'mens-playbook',
        tool: 'kalendarz-retinolu',
        posts: [
          'plan-na-dni-z-goleniem-i-bez',
          'jak-utrzymac-80-proc-adherencje',
          'tydzien-resetu-barierowego',
        ],
      },
      'skladniki': {
        label: 'Składniki (INCI)',
        ebookPrimary: 'ingredient-atlas',
        ebookSecondary: 'even-tone',
        tool: 'analiza-inci',
        posts: [
          'retinoidy-rodzina-efekty-i-rytm-wprowadzania',
          'niacynamid-10-proc-kiedy-ma-sens',
          'kwas-azelinowy-na-zaczerwienienia-i-pory',
        ],
      },
      'spf': {
        label: 'Słońce i fotoprotekcja',
        ebookPrimary: 'sun-playbook',
        ebookSecondary: 'even-tone',
        tool: 'kalkulator-spf',
        posts: [
          'jak-wybrac-spf-ktory-naprawde-nosze',
          'zimowy-blask-slonca-a-ochrona-w-biurze',
          'tekstury-dla-skory-tlustej-i-z-brodka',
        ],
      },
      'tradzik': {
        label: 'Trądzik (16+)',
        ebookPrimary: 'acne-playbook',
        ebookSecondary: 'barrier-reset',
        tool: 'test-bariera',
        posts: [
          'pierwszy-tydzien-bez-panikowania',
          'purging-vs-podraznienie-rozroznianie',
          'plan-na-slady-pih-pie-w-60-sekund',
        ],
      },
      'rumien-rozacea': {
        label: 'Zaczerwienienia & Rosacea (non-medical)',
        ebookPrimary: 'redness-rosacea-friendly',
        ebookSecondary: 'sun-playbook',
        tool: 'dziennik-flush-events',
        posts: [
          'wyzwalacze-i-proste-kontry',
          'lagodne-aktywy-ktore-nie-pala',
          'jak-mowic-w-gabinecie-krotkie-scenariusze',
        ],
      },
      'pigmentacja': {
        label: 'Przebarwienia (PIH/PIE)',
        ebookPrimary: 'even-tone',
        ebookSecondary: 'sun-playbook',
        tool: 'standardy-zdjec-pdf',
        posts: [
          'pih-vs-pie-jak-odroznic',
          'czy-witamina-c-ma-sens-dla-mnie',
          'kiedy-warto-pojsc-na-zabieg',
        ],
      },
      'bariera': {
        label: 'Bariera & wrażliwość',
        ebookPrimary: 'barrier-reset',
        ebookSecondary: 'conscious-skincare',
        tool: 'test-bariera-skorna',
        posts: [
          'sygnaly-rozregulowanej-bariery',
          '14-dni-do-spokojniejszej-skory',
          'emolienty-humektanty-occlusive-prosto',
        ],
      },
      'cialo': {
        label: 'Skóra ciała',
        ebookPrimary: 'body-confidence',
        ebookSecondary: 'sun-playbook',
        tool: 'harmonogram-prysznic-pranie-pdf',
        posts: [
          'keratosis-pilaris-bez-przesady',
          'trening-pot-i-prysznic-czasowanie',
          'jak-dbac-o-plecy-siatkowka-bacne',
        ],
      },
      'skalp-wlosy': {
        label: 'Skalp & linia włosów',
        ebookPrimary: 'scalp-sense',
        ebookSecondary: 'mens-playbook',
        tool: 'plan-rotacji-szamponow',
        posts: [
          'czytanie-etykiet-szamponow-aktywnych',
          'lagodny-dzien-resetu',
          'kiedy-zmienic-szczotke-i-tekstylia',
        ],
      },
      'mezczyzni': {
        label: 'Skóra męska',
        ebookPrimary: 'mens-playbook',
        ebookSecondary: 'sun-playbook',
        tool: 'checklista-dnia-golenia',
        posts: [
          'golenie-bez-podrazen-3-kroki',
          'spf-dla-brody-i-stubble',
          'torba-gym-3-produkty-ktore-wystarcza',
        ],
      },
      'zakupy': {
        label: 'Zakupowy know-how',
        ebookPrimary: 'conscious-skincare',
        ebookSecondary: 'even-tone',
        tool: 'analiza-inci-checklista-roszczen',
        posts: [
          'czytanie-inci-w-60-sekund',
          'jak-nie-przepalac-budzetu',
          'duze-opakowania-kiedy-sie-oplaca',
        ],
      },
      'zabiegi': {
        label: 'Zabiegi profesjonalne (non-medical)',
        ebookPrimary: 'procedure-navigator',
        ebookSecondary: 'redness-friendly',
        tool: 'karta-rozmowy-w-gabinecie',
        posts: [
          'pytania-przed-pilingiem',
          'czego-oczekiwac-po-zabiegu',
          'ryzyko-pih-kto-bardziej-narazony',
        ],
      },
      'mity-faq': {
        label: 'Mity i najczęstsze pytania',
        ebookPrimary: 'conscious-skincare',
        ebookSecondary: 'contextual',
        tool: 'quiz-prawda-mit',
        posts: [
          'mit-kwasy-i-retinol-nie-da-sie-laczyc',
          'mit-woda-termalna-leczy-wszystko',
          'faq-zapachy-i-podraznienia',
        ],
      },
    },
  },
  fuel: {
    categories: {
      'podstawy': {
        label: 'Podstawy żywienia',
        ebookPrimary: 'fuel-fundamentals',
        ebookSecondary: 'meal-prep-system',
        tool: 'kalkulator-tdee',
        posts: [
          'jak-ustalic-tdee-bez-obsesji',
          'porcje-na-oko-dlonie-i-talerz',
          'zlota-trojka-bialko-blonnik-tluszcz',
        ],
      },
      'makro': {
        label: 'Makroskładniki',
        ebookPrimary: 'fuel-fundamentals',
        ebookSecondary: 'protein-playbook',
        tool: 'rozklad-makro-procenty',
        posts: [
          'bialko-ile-realnie-na-dzien',
          'weglowodany-kiedy-wiecej-kiedy-mniej',
          'tluszcze-omega-3-vs-omega-6-prosto',
        ],
      },
      'planowanie': {
        label: 'Planowanie i meal‑prep',
        ebookPrimary: 'meal-prep-system',
        ebookSecondary: 'budget-fuel',
        tool: 'planer-posilkow-lista-zakupow',
        posts: [
          'meal-prep-90-minut-na-5-dni',
          'rotacja-3-sniadan',
          'jak-ukladac-koszyk-na-tydzien',
        ],
      },
      'przekaski': {
        label: 'Mądrze o przekąskach',
        ebookPrimary: 'smart-snacking',
        ebookSecondary: 'protein-playbook',
        tool: 'budowniczy-przekasek',
        posts: [
          '3-minutowe-do-pracy',
          'slodkie-opcje-o-wiekszej-sytosci',
          'zestaw-awaryjny-do-plecaka',
        ],
      },
      'suplementy': {
        label: 'Suplementy (non‑medical)',
        ebookPrimary: 'supplements-sense',
        ebookSecondary: 'omega-3-guide',
        tool: 'suplement-checker',
        posts: [
          'omega-3-ile-kiedy-i-jakie-formy',
          'kreatyna-dla-nietrenujacych-czy-ma-sens',
          'witamina-d-jak-nie-przesadzic',
        ],
      },
      'gut': {
        label: 'Trawienie i jelita (non‑medical)',
        ebookPrimary: 'gut-calm',
        ebookSecondary: 'fiber-playbook',
        tool: 'dziennik-trawienia-fodmap-filtr',
        posts: [
          'sygnaly-ze-masz-za-malo-blonnika',
          'wzdecia-po-straczkach-plan-wprowadzania',
          'low-fodmap-kiedy-warto-sprobowac',
        ],
      },
      'hydratacja': {
        label: 'Nawodnienie i elektrolity',
        ebookPrimary: 'hydration-blueprint',
        ebookSecondary: 'even-energy',
        tool: 'kalkulator-nawodnienia-elektrolity',
        posts: [
          'ile-pic-proste-widelki',
          'kawa-a-nawodnienie',
          'elektrolity-po-intensywnym-dniu',
        ],
      },
      'sytosc-glikemia': {
        label: 'Sytość i glikemia',
        ebookPrimary: 'smart-carbs',
        ebookSecondary: 'protein-playbook',
        tool: 'planer-sytosci',
        posts: [
          'talerz-3xS-sytosc-smak-sklad',
          'biurowy-dzien-prosty-balans-wegli',
          'deser-po-obiedzie-jak-sprytnie',
        ],
      },
      'budzet-zakupy': {
        label: 'Budżet i zakupy',
        ebookPrimary: 'budget-fuel',
        ebookSecondary: 'meal-prep-system',
        tool: 'koszyk-budzetowy-lista-promocji',
        posts: [
          'koszyk-oszczednych-bialek',
          'czy-duze-opakowania-sie-oplaca',
          'jak-polowac-na-promocje-bez-marnowania',
        ],
      },
      'jedzenie-w-drodze': {
        label: 'Miasto i podróże',
        ebookPrimary: 'travel-fuel',
        ebookSecondary: 'smart-snacking',
        tool: 'mapa-porcji',
        posts: [
          'stacje-benzynowe-co-wybierac',
          'lotnisko-5-opcji-ktore-dzialaja',
          'kolacja-sluzbowa-jak-skladac-menu',
        ],
      },
      'diety': {
        label: 'Wzorce żywienia (non‑medical)',
        ebookPrimary: 'fuel-fundamentals',
        ebookSecondary: 'protein-playbook',
        tool: 'filtr-diety',
        posts: [
          'wegetariansko-i-bialko-jak-ukladac',
          'bez-laktozy-sniadania-ktore-dzialaja',
          'bez-glutenu-madre-weglowodany',
        ],
      },
      'kawa-alkohol': {
        label: 'Kofeina i alkohol',
        ebookPrimary: 'even-energy',
        ebookSecondary: 'hydration-blueprint',
        tool: 'kalkulator-kofeiny-i-jednostek',
        posts: [
          'ile-kofeiny-widelki-bez-przesady',
          'alkohol-a-sen-i-sytosc-co-zauwazysz',
          'weekendowe-wyjscia-plan-minimalizowania-szkod',
        ],
      },
      'mity-faq': {
        label: 'Mity i najczęstsze pytania',
        ebookPrimary: 'fuel-fundamentals',
        ebookSecondary: 'contextual',
        tool: 'quiz-prawda-mit',
        posts: [
          'mit-trzeba-jesc-co-3-godziny',
          'mit-detoksy-sokowe-oczyszczaja',
          'faq-bcaa-potrzebne-czy-nie',
        ],
      },
    },
  },
  habits: {
    categories: {
      'podstawy': {
        label: 'Podstawy nawyków',
        ebookPrimary: 'habit-systems',
        ebookSecondary: 'focus-and-flow',
        tool: 'habit-tracker',
        posts: [
          'systemy-vs-cele-dlaczego-liczy-sie-rytm',
          'metoda-2-minut-w-praktyce',
          'mini-nawyki-w-parach',
        ],
      },
      'sen': {
        label: 'Sen',
        ebookPrimary: 'sleep-playbook',
        ebookSecondary: 'light-and-circadian',
        tool: 'kalkulator-snu',
        posts: [
          'okna-snu-90-minutowe-bloki',
          'drzemki-kiedy-i-jak',
          'wieczorne-nakrecenie-jak-je-wyhamowac',
        ],
      },
      'swiatlo': {
        label: 'Światło i rytm cyrkadiany',
        ebookPrimary: 'light-and-circadian',
        ebookSecondary: 'sleep-playbook',
        tool: 'plan-ekspozycji-swiatla',
        posts: [
          'poranne-swiatlo-w-5-minut',
          'zima-jak-dobic-swiatlo',
          'sygnaly-ze-wieczorem-za-duzo-swiatla',
        ],
      },
      'aktywnosc': {
        label: 'Aktywność i przerwy',
        ebookPrimary: 'everyday-movement',
        ebookSecondary: 'recovery-reset',
        tool: 'planer-mikro-przerw',
        posts: [
          'protokol-30-5-1-siedzenie-ruch-postawa',
          '3-ruchy-co-godzine-w-biurze',
          'dzien-wciagniety-awaryjne-10-minut',
        ],
      },
      'stres': {
        label: 'Stres (non‑medical)',
        ebookPrimary: 'stress-reset',
        ebookSecondary: 'breath-toolkit',
        tool: 'dziennik-stresu-3-min-protokoly',
        posts: [
          '3-oddechy-ktore-reguluja',
          '60-sekund-po-trigerze-co-robic',
          'jak-oceniac-obciazenie-tygodnia',
        ],
      },
      'fokus': {
        label: 'Fokus i głęboka praca',
        ebookPrimary: 'focus-and-flow',
        ebookSecondary: 'digital-hygiene',
        tool: 'blokownik-rozpraszaczy',
        posts: [
          'bloki-50-10-vs-25-5-co-dziala',
          'listy-uwagi-i-parking',
          'zestaw-startowy-domowego-biura',
        ],
      },
      'higiena-cyfrowa': {
        label: 'Higiena cyfrowa',
        ebookPrimary: 'digital-hygiene',
        ebookSecondary: 'focus-and-flow',
        tool: 'detoks-powiadomien',
        posts: [
          'ekran-przed-snem-plan-redukcji',
          'apki-ustawienia-ktore-pomagaja',
          'tydzien-bez-social-wersja-light',
        ],
      },
      'poranek-wieczor': {
        label: 'Poranek i wieczór',
        ebookPrimary: 'morning-playbook',
        ebookSecondary: 'sleep-playbook',
        tool: 'planer-poranka',
        posts: [
          'poranna-trojka-swiatlo-ruch-bialko',
          'wieczorny-reset-20-minut',
          'rutyny-weekend-vs-praca',
        ],
      },
      'dom': {
        label: 'Dom i środowisko',
        ebookPrimary: 'home-health',
        ebookSecondary: 'sleep-playbook',
        tool: 'checklista-domu',
        posts: [
          'sypialnia-5-szybkich-korekt',
          'halas-tla-jak-go-wygasic',
          'temperatura-a-zasypianie',
        ],
      },
      'plecy-biurko': {
        label: 'Plecy i biurko (non‑medical)',
        ebookPrimary: 'back-friendly-desk',
        ebookSecondary: 'everyday-movement',
        tool: 'przerwy-biurowe',
        posts: [
          'mapa-przerw-dla-plecow',
          'krzeslo-vs-ruch-co-wazniejsze',
          'zestaw-biurkowy-minimal',
        ],
      },
      'regeneracja': {
        label: 'Regeneracja',
        ebookPrimary: 'recovery-reset',
        ebookSecondary: 'sleep-playbook',
        tool: 'plan-odpoczynku',
        posts: [
          'dni-bez-bodzcow-jak-je-rozkminic',
          'mikro-zakresy-kiedy-odpuscic',
          'sygnaly-przeladowania',
        ],
      },
      'podroz': {
        label: 'Podróże i jet lag (non‑medical)',
        ebookPrimary: 'travel-health',
        ebookSecondary: 'light-and-circadian',
        tool: 'plan-podrozy-i-stref',
        posts: [
          'plan-swiatla-na-zmiane-stref',
          'rytualy-snu-w-hotelu',
          'kondycja-w-delegacji-mini-zestaw',
        ],
      },
      'motywacja-nawyki': {
        label: 'Motywacja i utrzymanie',
        ebookPrimary: 'habit-systems',
        ebookSecondary: 'morning-playbook',
        tool: 'plan-2-1-0',
        posts: [
          'kalendarz-lancuszka-jak-go-nie-zepsuc',
          'nagrody-bez-jedzenia',
          'zjazdy-plan-minimalny',
        ],
      },
      'mity-faq': {
        label: 'Mity i najczęstsze pytania',
        ebookPrimary: 'habit-systems',
        ebookSecondary: 'contextual',
        tool: 'quiz-prawda-mit',
        posts: [
          'mit-5am-klub-jest-dla-wszystkich',
          'mit-trzeba-miec-silna-wole',
          'faq-czy-niedziela-moze-byc-dniem-bez-planu',
        ],
      },
    },
  },
};

// Helpers:
export const allVerticals = Object.keys(content) as VerticalKey[];
export function buildUrl(parts: string[]) {
  return `${siteUrl}${parts.join('')}`;
}
```

> Add/remove posts anytime; the sitemap and static generation will follow automatically.

---

## 3) Dynamic routes that render hubs and posts + pre‑generate paths

**`app/[vertical]/[category]/page.tsx`** (Category hubs):

```tsx
// app/[vertical]/[category]/page.tsx
import { content, allVerticals } from '@/lib/content-map';
import Link from 'next/link';

export const revalidate = 60 * 60 * 24; // ISR daily

export async function generateStaticParams() {
  const params: { vertical: string; category: string }[] = [];
  for (const v of allVerticals) {
    for (const category of Object.keys(content[v].categories)) {
      params.push({ vertical: v, category });
    }
  }
  return params;
}

export default function CategoryHub({
  params,
}: { params: { vertical: string; category: string } }) {
  const { vertical, category } = params;
  if (!['skin', 'fuel', 'habits'].includes(vertical)) return null;

  const cat = content[vertical as 'skin' | 'fuel' | 'habits'].categories[category];
  if (!cat) return null;

  return (
    <main>
      <header>
        <h1>{cat.label}</h1>
        <p>Vertical: {vertical}</p>
      </header>

      {/* Example: Tool + CTAs (replace with your real components) */}
      <section><strong>Narzędzie tygodnia:</strong> {cat.tool}</section>
      <section><strong>Primary e‑book:</strong> {cat.ebookPrimary}</section>
      <section><strong>Secondary:</strong> {cat.ebookSecondary}</section>

      <h2>Wyróżnione wpisy</h2>
      <ul>
        {cat.posts.map((slug) => (
          <li key={slug}>
            <Link href={`/${vertical}/${category}/${slug}/`}>{slug.replace(/-/g, ' ')}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

**`app/[vertical]/[category]/[slug]/page.tsx`** (Post pages):

```tsx
// app/[vertical]/[category]/[slug]/page.tsx
import { content, allVerticals } from '@/lib/content-map';

export const revalidate = 60 * 60 * 24;

export async function generateStaticParams() {
  const params: { vertical: string; category: string; slug: string }[] = [];
  for (const v of allVerticals) {
    for (const [category, cat] of Object.entries(content[v].categories)) {
      for (const slug of cat.posts) {
        params.push({ vertical: v, category, slug });
      }
    }
  }
  return params;
}

export default function PostPage({
  params,
}: { params: { vertical: string; category: string; slug: string } }) {
  const { vertical, category, slug } = params;
  const cat = content[vertical as 'skin' | 'fuel' | 'habits'].categories[category];
  if (!cat || !cat.posts.includes(slug)) return null;

  return (
    <article>
      <h1>{slug.replace(/-/g, ' ')}</h1>
      <p>Vertical: {vertical} • Kategoria: {cat.label}</p>
      {/* TODO: load MDX/CMS content; render CTAs (after H2 and before conclusion) */}
    </article>
  );
}
```

> You can later swap the hardcoded `posts` array for a CMS (MDX/Headless), but the routing and sitemaps stay the same.

---

## 4) Redirects for legacy blog URLs (Vercel‑friendly)

In **`next.config.ts`**, add redirects (permanent 301). Next.js recommends `redirects()` for this. ([Next.js][1])

```ts
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  async redirects() {
    return [
      // Skin
      { source: '/skin/blog/:category/:slug', destination: '/skin/:category/:slug', permanent: true },
      { source: '/skin/blog/:category',        destination: '/skin/:category',        permanent: true },

      // Fuel
      { source: '/fuel/blog/:category/:slug', destination: '/fuel/:category/:slug', permanent: true },
      { source: '/fuel/blog/:category',        destination: '/fuel/:category',       permanent: true },

      // Habits
      { source: '/habits/blog/:category/:slug', destination: '/habits/:category/:slug', permanent: true },
      { source: '/habits/blog/:category',        destination: '/habits/:category',       permanent: true },

      // Optional: legacy taxonomy rename
      { source: '/ebooks/nutrition/:path*', destination: '/ebooks/fuel/:path*', permanent: true },
      { source: '/ebooks/health/:path*',    destination: '/ebooks/habits/:path*', permanent: true },
      { source: '/narzedzia/nutrition/:path*', destination: '/narzedzia/fuel/:path*', permanent: true },
      { source: '/narzedzia/health/:path*',    destination: '/narzedzia/habits/:path*', permanent: true },
    ];
  },
};

export default config;
```

> If you ever need **thousands of dynamic redirects**, consider Edge Config + Middleware, but the above covers your current plan. ([Vercel][2])

---

## 5) Robots.txt (generated)

Create **`app/robots.ts`** (uses Next’s metadata API). ([Next.js][3])

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://clarivum.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
```

---

## 6) Sitemap index + per‑vertical sitemaps (custom routes)

This matches your preferred URLs (`/sitemaps/skin.xml` etc.) using **Route Handlers**. ([Next.js][4])

**`app/sitemap.xml/route.ts`** (index):

```ts
// app/sitemap.xml/route.ts
import { siteUrl } from '@/lib/content-map';

export const revalidate = 60 * 60 * 24;

export async function GET() {
  const sitemaps = [
    '/sitemaps/pages.xml',
    '/sitemaps/skin.xml',
    '/sitemaps/fuel.xml',
    '/sitemaps/habits.xml',
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    sitemaps
      .map((p) => `<sitemap><loc>${siteUrl}${p}</loc></sitemap>`)
      .join('') +
    `</sitemapindex>`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
```

**Helper for generating URL sets**

```ts
// app/sitemaps/_utils.ts
import { siteUrl, content } from '@/lib/content-map';

export function url(loc: string, lastmod?: string) {
  const date = lastmod || new Date().toISOString();
  return `<url><loc>${siteUrl}${loc}</loc><lastmod>${date}</lastmod></url>`;
}

export function xmlWrap(urls: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function skinUrls() {
  const base = '/skin';
  let items = '';
  for (const [catSlug, cat] of Object.entries(content.skin.categories)) {
    items += url(`${base}/${catSlug}/`);
    for (const post of cat.posts) items += url(`${base}/${catSlug}/${post}/`);
  }
  return items;
}

// Similar helpers for fuel and habits:
export function fuelUrls() {
  const base = '/fuel';
  let items = '';
  for (const [catSlug, cat] of Object.entries(content.fuel.categories)) {
    items += url(`${base}/${catSlug}/`);
    for (const post of cat.posts) items += url(`${base}/${catSlug}/${post}/`);
  }
  return items;
}

export function habitsUrls() {
  const base = '/habits';
  let items = '';
  for (const [catSlug, cat] of Object.entries(content.habits.categories)) {
    items += url(`${base}/${catSlug}/`);
    for (const post of cat.posts) items += url(`${base}/${catSlug}/${post}/`);
  }
  return items;
}
```

**Per‑vertical routes**

```ts
// app/sitemaps/skin.xml/route.ts
import { xmlWrap, skinUrls } from '../_utils';

export const revalidate = 60 * 60 * 24;

export async function GET() {
  return new Response(xmlWrap(skinUrls()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
```

```ts
// app/sitemaps/fuel.xml/route.ts
import { xmlWrap, fuelUrls } from '../_utils';
export const revalidate = 60 * 60 * 24;
export async function GET() {
  return new Response(xmlWrap(fuelUrls()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
```

```ts
// app/sitemaps/habits.xml/route.ts
import { xmlWrap, habitsUrls } from '../_utils';
export const revalidate = 60 * 60 * 24;
export async function GET() {
  return new Response(xmlWrap(habitsUrls()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
```

**Optional**: a small **pages** sitemap for global, legal, etc.:

```ts
// app/sitemaps/pages.xml/route.ts
import { xmlWrap, url } from '../_utils';
export const revalidate = 60 * 60 * 24;
export async function GET() {
  const pages = [
    '/', '/ebooks/', '/narzedzia/', '/blog/', '/o-nas/', '/kontakt/',
    '/polityka-prywatnosci/', '/polityka-cookies/', '/regulamin/',
    '/disclaimer-medyczny/', '/jak-zarabiamy/',
  ];
  const items = pages.map((p) => url(p)).join('');
  return new Response(xmlWrap(items), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
```

> **Alternative**: Next.js now has **`generateSitemaps()`** to produce multiple sitemaps automatically at `/sitemap/[id].xml`. Use that if you’re okay with those paths instead of `/sitemaps/*.xml`. ([Next.js][5])

---

## 7) (Optional) Global RSS via a route handler

```ts
// app/rss/route.ts
import { content } from '@/lib/content-map';

export const revalidate = 60 * 60; // hourly
export async function GET() {
  const items: string[] = [];

  const makeItem = (loc: string, title: string) =>
    `<item><title><![CDATA[${title}]]></title><link>${loc}</link></item>`;

  for (const v of ['skin', 'fuel', 'habits'] as const) {
    for (const [catSlug, cat] of Object.entries(content[v].categories)) {
      for (const slug of cat.posts) {
        const loc = `https://clarivum.com/${v}/${catSlug}/${slug}/`;
        items.push(makeItem(loc, slug.replace(/-/g, ' ')));
      }
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0"><channel><title>Clarivum RSS</title>` +
    items.join('') +
    `</channel></rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
```

---

## 8) Vercel deployment

1. **Import** the repo in Vercel → *Add New Project* → select **Next.js** (Vercel detects it).
2. **Env var**: set `NEXT_PUBLIC_SITE_URL=https://clarivum.com` (and for Preview, consider the `vercel.app` preview URL).
3. Keep defaults (**Build Command**: `next build`, **Output**: `.next`).
4. Assign your domain; ship.
5. Verify:

   * `https://clarivum.com/robots.txt` (should reference sitemap). ([Next.js][3])
   * `https://clarivum.com/sitemap.xml` (index) + `/sitemaps/skin.xml` etc.
   * A few canonical pages e.g. `/skin/spf/`, `/skin/spf/jak-wybrac-spf-ktory-naprawde-nosze/`.
   * Legacy redirects (e.g., `/skin/blog/spf/jak-wybrac-spf-...` → 301 → canonical). ([Next.js][1])

---

## 9) Notes & good practices

* **Canonical URLs**: keep one canonical per post; use `generateMetadata` on post pages to emit `<link rel="canonical">`.
* **Revalidation (ISR)**: adjust `revalidate` to how often you publish (daily above).
* **Preview/Prod base URL**: consider reading host from `request.headers.get('x-forwarded-host')` in route handlers to build absolute URLs in sitemaps for previews.
* **Extending**: add `/sitemaps/ebooks.xml`, `/sitemaps/narzedzia.xml`, etc., by following the same pattern.
* **Docs for reference**: Next’s metadata files for **sitemap** and **robots**, **Route Handlers**, and **redirects** in `next.config.js`. ([Next.js][6])

---

### Want me to turn this into a repo boilerplate?

I can provide a ready‑to‑clone skeleton with these files and placeholder components for the **CTA blocks**, **Tool card**, and simple **MDX support**—just say the word, and I’ll lay down the exact files you can drop into your repo.

[1]: https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects?utm_source=chatgpt.com "redirects - next.config.js"
[2]: https://vercel.com/guides/how-can-i-increase-the-limit-of-redirects-or-use-dynamic-redirects-on-vercel?utm_source=chatgpt.com "How can I increase the limit of redirects or use dynamic ..."
[3]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots?utm_source=chatgpt.com "Metadata Files: robots.txt"
[4]: https://nextjs.org/docs/app/getting-started/route-handlers-and-middleware?utm_source=chatgpt.com "Getting Started: Route Handlers and Middleware"
[5]: https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps?utm_source=chatgpt.com "Functions: generateSitemaps"
[6]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap?utm_source=chatgpt.com "Metadata Files: sitemap.xml"
