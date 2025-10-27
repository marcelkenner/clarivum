// lib/content-map.ts
export type VerticalKey = "skin" | "fuel" | "habits";
export type CategorySlug = string;
export type ArticleSlug = string;

export type Category = {
  label: string;
  ebookPrimary: string; // slug or name
  ebookSecondary: string; // slug or name
  tool: string;
  posts: string[]; // post slugs
};

export type Vertical = {
  categories: Record<string, Category>; // key is category slug
};

export const siteUrl = process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://clarivum.com";

export const content: Record<VerticalKey, Vertical> = {
  skin: {
    categories: {
      podstawy: {
        label: "Podstawy pielęgnacji",
        ebookPrimary: "conscious-skincare",
        ebookSecondary: "barrier-reset",
        tool: "generator-rutyny",
        posts: [
          "minimalny-plan-24h-dla-zapracowanych",
          "sucho-vs-odwodnienie-jak-rozpoznac-w-5-minut",
          "jak-dobrac-krem-tekstura-i-wyglad",
          "czyszczenie-bez-przesuszania",
        ],
      },
      "rutyna-24h": {
        label: "Rutyny i nawyki",
        ebookPrimary: "conscious-skincare",
        ebookSecondary: "mens-playbook",
        tool: "kalendarz-retinolu",
        posts: [
          "plan-na-dni-z-goleniem-i-bez",
          "jak-utrzymac-80-proc-adherencje",
          "tydzien-resetu-barierowego",
        ],
      },
      skladniki: {
        label: "Składniki (INCI)",
        ebookPrimary: "ingredient-atlas",
        ebookSecondary: "even-tone",
        tool: "analiza-inci",
        posts: [
          "retinoidy-rodzina-efekty-i-rytm-wprowadzania",
          "niacynamid-10-proc-kiedy-ma-sens",
          "kwas-azelinowy-na-zaczerwienienia-i-pory",
        ],
      },
      spf: {
        label: "Słońce i fotoprotekcja",
        ebookPrimary: "sun-playbook",
        ebookSecondary: "even-tone",
        tool: "kalkulator-spf",
        posts: [
          "jak-wybrac-spf-ktory-naprawde-nosze",
          "zimowy-blask-slonca-a-ochrona-w-biurze",
          "tekstury-dla-skory-tlustej-i-z-brodka",
        ],
      },
      tradzik: {
        label: "Trądzik (16+)",
        ebookPrimary: "acne-playbook",
        ebookSecondary: "barrier-reset",
        tool: "test-bariera",
        posts: [
          "pierwszy-tydzien-bez-panikowania",
          "purging-vs-podraznienie-rozroznianie",
          "plan-na-slady-pih-pie-w-60-sekund",
        ],
      },
      "rumien-rozacea": {
        label: "Zaczerwienienia & Rosacea (non-medical)",
        ebookPrimary: "redness-rosacea-friendly",
        ebookSecondary: "sun-playbook",
        tool: "dziennik-flush-events",
        posts: [
          "wyzwalacze-i-proste-kontry",
          "lagodne-aktywy-ktore-nie-pala",
          "jak-mowic-w-gabinecie-krotkie-scenariusze",
        ],
      },
      pigmentacja: {
        label: "Przebarwienia (PIH/PIE)",
        ebookPrimary: "even-tone",
        ebookSecondary: "sun-playbook",
        tool: "standardy-zdjec-pdf",
        posts: [
          "pih-vs-pie-jak-odroznic",
          "czy-witamina-c-ma-sens-dla-mnie",
          "kiedy-warto-pojsc-na-zabieg",
        ],
      },
      bariera: {
        label: "Bariera & wrażliwość",
        ebookPrimary: "barrier-reset",
        ebookSecondary: "conscious-skincare",
        tool: "test-bariera-skorna",
        posts: [
          "sygnaly-rozregulowanej-bariery",
          "14-dni-do-spokojniejszej-skory",
          "emolienty-humektanty-occlusive-prosto",
        ],
      },
      cialo: {
        label: "Skóra ciała",
        ebookPrimary: "body-confidence",
        ebookSecondary: "sun-playbook",
        tool: "harmonogram-prysznic-pranie-pdf",
        posts: [
          "keratosis-pilaris-bez-przesady",
          "trening-pot-i-prysznic-czasowanie",
          "jak-dbac-o-plecy-siatkowka-bacne",
        ],
      },
      "skalp-wlosy": {
        label: "Skalp & linia włosów",
        ebookPrimary: "scalp-sense",
        ebookSecondary: "mens-playbook",
        tool: "plan-rotacji-szamponow",
        posts: [
          "czytanie-etykiet-szamponow-aktywnych",
          "lagodny-dzien-resetu",
          "kiedy-zmienic-szczotke-i-tekstylia",
        ],
      },
      mezczyzni: {
        label: "Skóra męska",
        ebookPrimary: "mens-playbook",
        ebookSecondary: "sun-playbook",
        tool: "checklista-dnia-golenia",
        posts: [
          "golenie-bez-podrazen-3-kroki",
          "spf-dla-brody-i-stubble",
          "torba-gym-3-produkty-ktore-wystarcza",
        ],
      },
      zakupy: {
        label: "Zakupowy know-how",
        ebookPrimary: "conscious-skincare",
        ebookSecondary: "even-tone",
        tool: "analiza-inci-checklista-roszczen",
        posts: [
          "czytanie-inci-w-60-sekund",
          "jak-nie-przepalac-budzetu",
          "duze-opakowania-kiedy-sie-oplaca",
        ],
      },
      zabiegi: {
        label: "Zabiegi profesjonalne (non-medical)",
        ebookPrimary: "procedure-navigator",
        ebookSecondary: "redness-friendly",
        tool: "karta-rozmowy-w-gabinecie",
        posts: [
          "pytania-przed-pilingiem",
          "czego-oczekiwac-po-zabiegu",
          "ryzyko-pih-kto-bardziej-narazony",
        ],
      },
      "mity-faq": {
        label: "Mity i najczęstsze pytania",
        ebookPrimary: "conscious-skincare",
        ebookSecondary: "contextual",
        tool: "quiz-prawda-mit",
        posts: [
          "mit-kwasy-i-retinol-nie-da-sie-laczyc",
          "mit-woda-termalna-leczy-wszystko",
          "faq-zapachy-i-podraznienia",
        ],
      },
    },
  },
  fuel: {
    categories: {
      podstawy: {
        label: "Podstawy żywienia",
        ebookPrimary: "fuel-fundamentals",
        ebookSecondary: "meal-prep-system",
        tool: "kalkulator-tdee",
        posts: [
          "jak-ustalic-tdee-bez-obsesji",
          "porcje-na-oko-dlonie-i-talerz",
          "zlota-trojka-bialko-blonnik-tluszcz",
        ],
      },
      makro: {
        label: "Makroskładniki",
        ebookPrimary: "fuel-fundamentals",
        ebookSecondary: "protein-playbook",
        tool: "rozklad-makro-procenty",
        posts: [
          "bialko-ile-realnie-na-dzien",
          "weglowodany-kiedy-wiecej-kiedy-mniej",
          "tluszcze-omega-3-vs-omega-6-prosto",
        ],
      },
      planowanie: {
        label: "Planowanie i meal‑prep",
        ebookPrimary: "meal-prep-system",
        ebookSecondary: "budget-fuel",
        tool: "planer-posilkow-lista-zakupow",
        posts: [
          "meal-prep-90-minut-na-5-dni",
          "rotacja-3-sniadan",
          "jak-ukladac-koszyk-na-tydzien",
        ],
      },
      przekaski: {
        label: "Mądrze o przekąskach",
        ebookPrimary: "smart-snacking",
        ebookSecondary: "protein-playbook",
        tool: "budowniczy-przekasek",
        posts: [
          "3-minutowe-do-pracy",
          "slodkie-opcje-o-wiekszej-sytosci",
          "zestaw-awaryjny-do-plecaka",
        ],
      },
      suplementy: {
        label: "Suplementy (non‑medical)",
        ebookPrimary: "supplements-sense",
        ebookSecondary: "omega-3-guide",
        tool: "suplement-checker",
        posts: [
          "omega-3-ile-kiedy-i-jakie-formy",
          "kreatyna-dla-nietrenujacych-czy-ma-sens",
          "witamina-d-jak-nie-przesadzic",
        ],
      },
      gut: {
        label: "Trawienie i jelita (non‑medical)",
        ebookPrimary: "gut-calm",
        ebookSecondary: "fiber-playbook",
        tool: "dziennik-trawienia-fodmap-filtr",
        posts: [
          "sygnaly-ze-masz-za-malo-blonnika",
          "wzdecia-po-straczkach-plan-wprowadzania",
          "low-fodmap-kiedy-warto-sprobowac",
        ],
      },
      hydratacja: {
        label: "Nawodnienie i elektrolity",
        ebookPrimary: "hydration-blueprint",
        ebookSecondary: "even-energy",
        tool: "kalkulator-nawodnienia-elektrolity",
        posts: ["ile-pic-proste-widelki", "kawa-a-nawodnienie", "elektrolity-po-intensywnym-dniu"],
      },
      "sytosc-glikemia": {
        label: "Sytość i glikemia",
        ebookPrimary: "smart-carbs",
        ebookSecondary: "protein-playbook",
        tool: "planer-sytosci",
        posts: [
          "talerz-3xS-sytosc-smak-sklad",
          "biurowy-dzien-prosty-balans-wegli",
          "deser-po-obiedzie-jak-sprytnie",
        ],
      },
      "budzet-zakupy": {
        label: "Budżet i zakupy",
        ebookPrimary: "budget-fuel",
        ebookSecondary: "meal-prep-system",
        tool: "koszyk-budzetowy-lista-promocji",
        posts: [
          "koszyk-oszczednych-bialek",
          "czy-duze-opakowania-sie-oplaca",
          "jak-polowac-na-promocje-bez-marnowania",
        ],
      },
      "jedzenie-w-drodze": {
        label: "Miasto i podróże",
        ebookPrimary: "travel-fuel",
        ebookSecondary: "smart-snacking",
        tool: "mapa-porcji",
        posts: [
          "stacje-benzynowe-co-wybierac",
          "lotnisko-5-opcji-ktore-dzialaja",
          "kolacja-sluzbowa-jak-skladac-menu",
        ],
      },
      diety: {
        label: "Wzorce żywienia (non‑medical)",
        ebookPrimary: "fuel-fundamentals",
        ebookSecondary: "protein-playbook",
        tool: "filtr-diety",
        posts: [
          "wegetariansko-i-bialko-jak-ukladac",
          "bez-laktozy-sniadania-ktore-dzialaja",
          "bez-glutenu-madre-weglowodany",
        ],
      },
      "kawa-alkohol": {
        label: "Kofeina i alkohol",
        ebookPrimary: "even-energy",
        ebookSecondary: "hydration-blueprint",
        tool: "kalkulator-kofeiny-i-jednostek",
        posts: [
          "ile-kofeiny-widelki-bez-przesady",
          "alkohol-a-sen-i-sytosc-co-zauwazysz",
          "weekendowe-wyjscia-plan-minimalizowania-szkod",
        ],
      },
      "mity-faq": {
        label: "Mity i najczęstsze pytania",
        ebookPrimary: "fuel-fundamentals",
        ebookSecondary: "contextual",
        tool: "quiz-prawda-mit",
        posts: [
          "mit-trzeba-jesc-co-3-godziny",
          "mit-detoksy-sokowe-oczyszczaja",
          "faq-bcaa-potrzebne-czy-nie",
        ],
      },
    },
  },
  habits: {
    categories: {
      podstawy: {
        label: "Podstawy nawyków",
        ebookPrimary: "habit-systems",
        ebookSecondary: "focus-and-flow",
        tool: "habit-tracker",
        posts: [
          "systemy-vs-cele-dlaczego-liczy-sie-rytm",
          "metoda-2-minut-w-praktyce",
          "mini-nawyki-w-parach",
        ],
      },
      sen: {
        label: "Sen",
        ebookPrimary: "sleep-playbook",
        ebookSecondary: "light-and-circadian",
        tool: "kalkulator-snu",
        posts: [
          "okna-snu-90-minutowe-bloki",
          "drzemki-kiedy-i-jak",
          "wieczorne-nakrecenie-jak-je-wyhamowac",
        ],
      },
      swiatlo: {
        label: "Światło i rytm cyrkadiany",
        ebookPrimary: "light-and-circadian",
        ebookSecondary: "sleep-playbook",
        tool: "plan-ekspozycji-swiatla",
        posts: [
          "poranne-swiatlo-w-5-minut",
          "zima-jak-dobic-swiatlo",
          "sygnaly-ze-wieczorem-za-duzo-swiatla",
        ],
      },
      aktywnosc: {
        label: "Aktywność i przerwy",
        ebookPrimary: "everyday-movement",
        ebookSecondary: "recovery-reset",
        tool: "planer-mikro-przerw",
        posts: [
          "protokol-30-5-1-siedzenie-ruch-postawa",
          "3-ruchy-co-godzine-w-biurze",
          "dzien-wciagniety-awaryjne-10-minut",
        ],
      },
      stres: {
        label: "Stres (non‑medical)",
        ebookPrimary: "stress-reset",
        ebookSecondary: "breath-toolkit",
        tool: "dziennik-stresu-3-min-protokoly",
        posts: [
          "3-oddechy-ktore-reguluja",
          "60-sekund-po-trigerze-co-robic",
          "jak-oceniac-obciazenie-tygodnia",
        ],
      },
      fokus: {
        label: "Fokus i głęboka praca",
        ebookPrimary: "focus-and-flow",
        ebookSecondary: "digital-hygiene",
        tool: "blokownik-rozpraszaczy",
        posts: [
          "bloki-50-10-vs-25-5-co-dziala",
          "listy-uwagi-i-parking",
          "zestaw-startowy-domowego-biura",
        ],
      },
      "higiena-cyfrowa": {
        label: "Higiena cyfrowa",
        ebookPrimary: "digital-hygiene",
        ebookSecondary: "focus-and-flow",
        tool: "detoks-powiadomien",
        posts: [
          "ekran-przed-snem-plan-redukcji",
          "apki-ustawienia-ktore-pomagaja",
          "tydzien-bez-social-wersja-light",
        ],
      },
      "poranek-wieczor": {
        label: "Poranek i wieczór",
        ebookPrimary: "morning-playbook",
        ebookSecondary: "sleep-playbook",
        tool: "planer-poranka",
        posts: [
          "poranna-trojka-swiatlo-ruch-bialko",
          "wieczorny-reset-20-minut",
          "rutyny-weekend-vs-praca",
        ],
      },
      dom: {
        label: "Dom i środowisko",
        ebookPrimary: "home-health",
        ebookSecondary: "sleep-playbook",
        tool: "checklista-domu",
        posts: [
          "sypialnia-5-szybkich-korekt",
          "halas-tla-jak-go-wygasic",
          "temperatura-a-zasypianie",
        ],
      },
      "plecy-biurko": {
        label: "Plecy i biurko (non‑medical)",
        ebookPrimary: "back-friendly-desk",
        ebookSecondary: "everyday-movement",
        tool: "przerwy-biurowe",
        posts: [
          "mapa-przerw-dla-plecow",
          "krzeslo-vs-ruch-co-wazniejsze",
          "zestaw-biurkowy-minimal",
        ],
      },
      regeneracja: {
        label: "Regeneracja",
        ebookPrimary: "recovery-reset",
        ebookSecondary: "sleep-playbook",
        tool: "plan-odpoczynku",
        posts: [
          "dni-bez-bodzcow-jak-je-rozkminic",
          "mikro-zakresy-kiedy-odpuscic",
          "sygnaly-przeladowania",
        ],
      },
      podroz: {
        label: "Podróże i jet lag (non‑medical)",
        ebookPrimary: "travel-health",
        ebookSecondary: "light-and-circadian",
        tool: "plan-podrozy-i-stref",
        posts: [
          "plan-swiatla-na-zmiane-stref",
          "rytualy-snu-w-hotelu",
          "kondycja-w-delegacji-mini-zestaw",
        ],
      },
      "motywacja-nawyki": {
        label: "Motywacja i utrzymanie",
        ebookPrimary: "habit-systems",
        ebookSecondary: "morning-playbook",
        tool: "plan-2-1-0",
        posts: [
          "kalendarz-lancuszka-jak-go-nie-zepsuc",
          "nagrody-bez-jedzenia",
          "zjazdy-plan-minimalny",
        ],
      },
      "mity-faq": {
        label: "Mity i najczęstsze pytania",
        ebookPrimary: "habit-systems",
        ebookSecondary: "contextual",
        tool: "quiz-prawda-mit",
        posts: [
          "mit-5am-klub-jest-dla-wszystkich",
          "mit-trzeba-miec-silna-wole",
          "faq-czy-niedziela-moze-byc-dniem-bez-planu",
        ],
      },
    },
  },
};

// Helpers:
export const allVerticals = Object.keys(content) as VerticalKey[];

type VerticalNarrative = {
  tagline: string;
  description: string;
  accent: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

const verticalNarratives: Record<VerticalKey, VerticalNarrative> = {
  skin: {
    tagline: "Clarivum Skin · Bariera najpierw, zero chaosu",
    description:
      "Clarivum Skin daje mi rutyny wspierane dermatologią, gotowe CTA i diagnostyki dla prawdziwej skóry, żebym mogła szybko zobaczyć efekt zanim dorzucę płatne usługi.",
    accent: "#2f8c7a",
    primaryCta: { label: "Chcę zobaczyć roadmapę Skin", href: "/skin" },
    secondaryCta: { label: "Robię test bariery", href: "/skin/bariera" },
  },
  fuel: {
    tagline: "Clarivum Fuel · Narzędziowe wsparcie codziennego odżywiania",
    description:
      "Clarivum Fuel przekłada dietetyczne playbooki na checklisty, kalkulatory i skrypty, żebym nawet w zabiegany dzień wiedziała, co zjeść i jak to zmierzyć.",
    accent: "#d98a1a",
    primaryCta: { label: "Otwieram mapę Fuel", href: "/fuel" },
    secondaryCta: { label: "Odpalam półkę narzędzi", href: "/narzedzia" },
  },
  habits: {
    tagline: "Clarivum Habits · Systemy na energię, sen i fokus",
    description:
      "Clarivum Habits dostarcza szablony rytmu, rytuały Forest Day i guardraile Kaizen, żebym mogła zaplanować tydzień z mierzalnymi checkpointami.",
    accent: "#3f3c7f",
    primaryCta: { label: "Wchodzę do Habits HQ", href: "/habits" },
    secondaryCta: { label: "Diagnozuję wąskie gardło", href: "/habits/fokus" },
  },
};

export type CategorySummary = Category & { slug: CategorySlug };
export type ArticleSummary = { slug: ArticleSlug; title: string };

export function buildUrl(parts: string[]) {
  return `${siteUrl}${parts.join("")}`;
}

export function getVerticalNarrative(vertical: VerticalKey): VerticalNarrative {
  return verticalNarratives[vertical];
}

export function listVerticalHighlights(limit = 2) {
  return allVerticals.map((vertical) => ({
    key: vertical,
    narrative: getVerticalNarrative(vertical),
    categories: listCategories(vertical).slice(0, limit),
  }));
}

export function isVerticalKey(value: string | undefined): value is VerticalKey {
  return allVerticals.includes(value as VerticalKey);
}

export function resolveVertical(value: string | undefined): VerticalKey | null {
  return isVerticalKey(value) ? (value as VerticalKey) : null;
}

export function hasCategory(vertical: VerticalKey, slug: CategorySlug): boolean {
  return Boolean(content[vertical].categories[slug]);
}

export function resolveCategory(
  vertical: VerticalKey,
  slug: string | undefined,
): CategorySlug | null {
  if (!slug) {
    return null;
  }

  return hasCategory(vertical, slug) ? slug : null;
}

export function getCategorySummary(
  vertical: VerticalKey,
  slug: CategorySlug,
): CategorySummary | null {
  const data = content[vertical].categories[slug];
  if (!data) {
    return null;
  }

  return {
    slug,
    ...data,
  };
}

export function listCategories(vertical: VerticalKey): CategorySummary[] {
  return Object.entries(content[vertical].categories).map(([slug, definition]) => ({
    slug,
    ...definition,
  }));
}

export function listArticleSummaries(vertical: VerticalKey, slug: CategorySlug): ArticleSummary[] {
  const category = getCategorySummary(vertical, slug);
  if (!category) {
    return [];
  }

  return category.posts.map((postSlug) => ({
    slug: postSlug,
    title: formatTitleFromSlug(postSlug),
  }));
}

export function formatTitleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function buildCategoryPath(vertical: VerticalKey, slug: CategorySlug): string {
  return `/${vertical}/${slug}`;
}

export function buildArticlePath(
  vertical: VerticalKey,
  slug: CategorySlug,
  post: ArticleSlug,
): string {
  return `/${vertical}/${slug}/${post}`;
}

export function collectCategoryParams(): { vertical: VerticalKey; category: CategorySlug }[] {
  const params: { vertical: VerticalKey; category: CategorySlug }[] = [];

  for (const vertical of allVerticals) {
    for (const slug of Object.keys(content[vertical].categories)) {
      params.push({ vertical, category: slug });
    }
  }

  return params;
}

export function collectArticleParams(): {
  vertical: VerticalKey;
  category: CategorySlug;
  slug: ArticleSlug;
}[] {
  const params: { vertical: VerticalKey; category: CategorySlug; slug: ArticleSlug }[] = [];

  for (const vertical of allVerticals) {
    for (const [categorySlug, category] of Object.entries(content[vertical].categories)) {
      for (const post of category.posts) {
        params.push({ vertical, category: categorySlug, slug: post });
      }
    }
  }

  return params;
}
