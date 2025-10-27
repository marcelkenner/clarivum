import { createContentLibrary } from "@/app/_vertical-experience/manager/ContentLibrary";
import type { ContentLibrary } from "@/app/_vertical-experience/manager/ContentLibrary";

import {
  mapHighlightToViewModel,
  type HomeEbooksViewModel,
  type HomeFeatureFlags,
  type HomeGlobalCtaViewModel,
  type HomeHeroPillar,
  type HomeLandingViewModel,
  type HomeNewsletterViewModel,
  type HomeToolsViewModel,
  type HomeTrustViewModel,
} from "../viewmodel/HomeViewModel";

const FEATURE_FLAGS: HomeFeatureFlags = {
  heroWizard: true,
  newsletterBar: true,
  uvWidget: true,
};

const NEWSLETTER: HomeNewsletterViewModel = {
  eyebrow: "Newsletter Clarivum",
  headline: "Zapisz się po praktyczne plany",
  subheadline:
    "Wybierz pion i dostawaj tylko to, co pomoże Ci w kolejnych krokach. Zero spamu, wypis jedną akcją.",
  segmentationLabel: "Który pion chcesz śledzić?",
  segmentation: [
    { id: "skin", label: "Clarivum Skin", description: "Pielęgnacja, bariery, fotoprotekcja." },
    { id: "fuel", label: "Clarivum Fuel", description: "Makro, plany posiłków, guardraile TDEE." },
    { id: "habits", label: "Clarivum Habits", description: "Plan Forest Day, rytm Metsa, Kaizen." },
  ],
  emailLabel: "E-mail (opcjonalnie)",
  emailPlaceholder: "anna@example.com",
  submitLabel: "Zapisz się",
  dismissLabel: "Zamknij pasek",
  privacyCopy: {
    label: "Polityka prywatności",
    href: "/docs/policies/security-baseline.md#data-protection--privacy",
  },
};

const TOOLS_GRID: HomeToolsViewModel = {
  eyebrow: "Narzędzia Clarivum",
  headline: "Otwórz gotowe narzędzia w mniej niż minutę",
  description:
    "Każde narzędzie prowadzi do konkretnego działania: planu, checklisty lub kalkulatora. Zacznij od jednego i wracaj, kiedy potrzebujesz kolejnego kroku.",
  seeAllLabel: "Zobacz wszystkie narzędzia",
  seeAllHref: "/narzedzia",
  items: [
    {
      key: "uv-index",
      label: "Indeks UV i reaplikacja",
      description: "Sprawdź indeks UV i zaplanuj przypomnienia reaplikacji SPF.",
      href: "/narzedzia/indeks-uv",
    },
    {
      key: "retinoid-planner",
      label: "Planner retinoidów",
      description: "Zaplanuj rytm 2-1-2, notuj reakcje i unikaj podrażnień.",
      href: "/narzedzia/retinoid-planner",
    },
    {
      key: "inci-checker",
      label: "Składniki Checker",
      description: "Wklej INCI, zobacz potencjalne ryzyka i kompatybilność z barierą.",
      href: "/narzedzia/analiza-inci",
    },
    {
      key: "tdee",
      label: "Kalkulator TDEE",
      description: "Policz zapotrzebowanie energetyczne z guardrailem deficytu.",
      href: "/narzedzia/kalkulator-tdee",
    },
    {
      key: "protein",
      label: "Cel białka",
      description: "Dobierz dzienne białko i rozkład posiłków zgodnie z Twoją wagą i celem.",
      href: "/narzedzia/rozklad-makro",
    },
    {
      key: "meal-planner",
      label: "Planner posiłków",
      description: "Ułóż jadłospis na tydzień z listą zakupów i sygnałami głodu.",
      href: "/narzedzia/plan-posilkow",
    },
    {
      key: "habit-tracker",
      label: "Habit Tracker",
      description: "Monitoruj mikro-nawyki, Forest Day i guardraile Kaizen.",
      href: "/narzedzia/habit-tracker",
    },
    {
      key: "sleep-calculator",
      label: "Kalkulator snu",
      description: "Policz cykle snu i ustaw guardrail pobudki 7–9 godzin.",
      href: "/narzedzia/tracker-snu",
    },
  ],
};

const HERO_PILLARS: HomeHeroPillar[] = [
  {
    key: "skin",
    label: "Skóra",
    description:
      "Chcesz odbudować barierę, wdrożyć retinoid albo nauczyć się SPF bez wyrzutów sumienia.",
    goals: [
      {
        slug: "barrier-reset",
        label: "Odbudowa bariery",
        description: "14 dni spokoju dla skóry: reset, nawilżenie i plan na dalsze kroki.",
        plan: {
          title: "Plan Clarivum Skin: Bariera & wrażliwość",
          durationLabel: "14 dni",
          summary:
            "Stopniowy powrót do aktywów z kontrolą reakcji. Codziennie jeden mały krok plus guardrail.",
          phases: [
            {
              title: "Dni 1–3 · Reset i ocena",
              steps: [
                "Wyrównaj mycie i SPF — tylko łagodne formuły, brak szczoteczek.",
                "Notuj objawy w checkliście bariery (rano/wieczór).",
                "Zrób zdjęcia referencyjne zgodnie z naszym PDF-em.",
              ],
            },
            {
              title: "Dni 4–7 · Warstwa nawilżenia",
              steps: [
                "Dodaj humektant + emolient w rytmie wieczornym.",
                "Monitoruj potencjalne szczypanie — jeśli przekracza 3/10, cofamy krok.",
                "Guardrail: sprawdź UV index, noś SPF ≥ 30 nawet przy zachmurzeniu.",
              ],
            },
            {
              title: "Dni 8–14 · Test aktywów",
              steps: [
                "Wprowadzaj jeden aktyw (np. retinoid) co 3 dni, kontrolując podrażnienia.",
                "Dziennik reakcji — zapisz każdą zmianę odczuć lub wyglądu.",
                "Przygotuj pytania do konsultacji na bazie checklisty.",
              ],
            },
          ],
          tools: [
            { label: "Test bariery Clarivum", href: "/skin/bariera" },
            { label: "Planner retinoidów", href: "/narzedzia/retinoid-planner" },
            { label: "UV Index (widget)", href: "/narzedzia/indeks-uv" },
          ],
          resources: [
            { label: "Runbook ochrony bariery", href: "/docs/runbooks/skin-barrier.md" },
            { label: "FAQ retinoidy", href: "/skin/rutyna-24h" },
            { label: "Plan SPF na co dzień", href: "/skin/spf" },
          ],
          disclaimer: "Materiały edukacyjne. Nie zastępują konsultacji z lekarzem.",
        },
      },
      {
        slug: "retinoid",
        label: "Retinoid bez podrażnień",
        description: "Wejście w retinoid w rytmie 2-1-2 z checklistą objawów.",
        plan: {
          title: "Plan Clarivum Skin: Retinoid start",
          durationLabel: "14 dni",
          summary:
            "Budujemy tolerancję w rytmie, który pasuje do Twojej bariery. Każdy krok z guardrailami.",
          phases: [
            {
              title: "Dni 1–4 · Fundament",
              steps: [
                "Ustal dni retinoidu (np. wtorek/piątek).",
                "Przygotuj bufor — łagodny krem emolientowy.",
                "Guardrail: jeśli pojawi się zaczerwienienie > 2/5, przerwij i wróć do bariery.",
              ],
            },
            {
              title: "Dni 5–9 · Budowanie tolerancji",
              steps: [
                "Aplikuj groszek na suchą skórę, potem bufor.",
                "Dziennik objawów: notuj szczypanie, łuszczenie, punkty zapalne.",
                "Wprowadź SPF 50 codziennie z re-aplikacją przy UV > 4.",
              ],
            },
            {
              title: "Dni 10–14 · Konsolidacja",
              steps: [
                "Rozważ trzeci dzień, jeśli reakcja ≤ 2/5.",
                "Dodaj antyoksydant rano (np. wit. C) — sprawdzaj tolerancję.",
                "Przygotuj notatki do wizyty/teleporady (opcjonalnie).",
              ],
            },
          ],
          tools: [
            { label: "Planner retinoidów", href: "/narzedzia/retinoid-planner" },
            { label: "Checklistę objawów", href: "/narzedzia/checklista-bariery" },
            { label: "UV Index", href: "/narzedzia/indeks-uv" },
          ],
          resources: [
            { label: "Retinoid 101", href: "/skin/skladniki/retinoidy" },
            { label: "Jak buforować aktywy", href: "/skin/rutyna-24h" },
            { label: "Disclaimer medyczny", href: "/docs/policies/medical-disclaimer.md" },
          ],
          disclaimer:
            "Retinoid to aktyw kosmetyczny. Reaguj na sygnały skóry i skonsultuj lekarza w razie wątpliwości.",
        },
      },
      {
        slug: "uv-care",
        label: "SPF codziennie",
        description: "Dobierasz SPF i uczysz się re-aplikacji w realnym rytmie dnia.",
        plan: {
          title: "Plan Clarivum Skin: SPF nawyk",
          durationLabel: "7 dni",
          summary:
            "Codzienna fotoprotekcja z testem tekstur i guardrailami UV. Zapiszesz wynik i dostaniesz przypomnienia.",
          phases: [
            {
              title: "Dzień 1 · Audyt",
              steps: [
                "Sprawdź aktualne SPF: PA, filtry, data ważności.",
                "Test tekstury na policzkach i czole.",
                "Ustal progi UV z naszego widżetu.",
              ],
            },
            {
              title: "Dni 2–4 · Rytuał poranny",
              steps: [
                "Nakładaj 2 mg/cm² (~pół łyżeczki) i notuj czas.",
                "Guardrail: jeśli UV ≥ 5, ustaw przypomnienie re-aplikacji.",
                "Dodaj odzież/nakrycie, gdy przebywasz na zewnątrz > 30 min.",
              ],
            },
            {
              title: "Dni 5–7 · Re-aplikacja w praktyce",
              steps: [
                "Wybierz produkt do re-aplikacji (spray, stick).",
                "Ćwicz w pracy/szkole — ustaw budzik, zanotuj odczucia.",
                "Oceń barierę i odnotuj wszelkie reakcje.",
              ],
            },
          ],
          tools: [
            { label: "UV Index widget", href: "/narzedzia/indeks-uv" },
            { label: "Kalkulator SPF", href: "/narzedzia/kalkulator-spf" },
            { label: "Checklistę re-aplikacji", href: "/narzedzia/checklista-spf" },
          ],
          resources: [
            { label: "Poradnik fotoprotekcji", href: "/skin/spf" },
            { label: "Plan wyjazdowy SPF", href: "/ebooks" },
            { label: "Polityka UVA/UVB Clarivum", href: "/docs/policies/uv-exposure.md" },
          ],
          disclaimer: "Informacje edukacyjne — nie stanowią porady medycznej.",
        },
      },
    ],
  },
  {
    key: "fuel",
    label: "Fuel",
    description:
      "Chcesz policzyć TDEE, zbalansować makro albo ogarnąć plan posiłków trzymając guardraile.",
    goals: [
      {
        slug: "tdee",
        label: "TDEE i deficyt",
        description: "Obliczasz zapotrzebowanie plus deficyt z guardrailem energii.",
        plan: {
          title: "Plan Clarivum Fuel: TDEE i deficyt",
          durationLabel: "10 dni",
          summary:
            "Poznasz swoje zapotrzebowanie, ustawisz deficyt i przygotujesz plan posiłków z checkpointami.",
          phases: [
            {
              title: "Dni 1–3 · Dane wejściowe",
              steps: [
                "Wypełnij kalkulator TDEE i zapisz wariant konserwatywny/agresywny.",
                "Uporządkuj aktywność fizyczną w tygodniu (realne wartości).",
                "Guardrail: deficyt ≤ 20% aby utrzymać energię.",
              ],
            },
            {
              title: "Dni 4–7 · Budowa jadłospisu",
              steps: [
                "Zdefiniuj posiłki bazowe (śniadanie/obiad/kolacja) ze źródłami białka.",
                "Dodaj przekąski według głodu (skala 1–5).",
                "Wprowadź monitorowanie nawodnienia.",
              ],
            },
            {
              title: "Dni 8–10 · Guardraile i test",
              steps: [
                "Przetestuj jadłospis przez 3 dni i oceniaj energię, głód, sen.",
                "Notuj zmiany masy ciała max 2x w tygodniu.",
                "Skalibruj deficyt, jeśli energia spada < 3/5.",
              ],
            },
          ],
          tools: [
            { label: "Kalkulator TDEE", href: "/narzedzia/kalkulator-tdee" },
            { label: "Tracker nawodnienia", href: "/narzedzia/tracker-woda" },
            { label: "Planner posiłków", href: "/narzedzia/plan-posilkow" },
          ],
          resources: [
            { label: "Podstawy żywienia", href: "/fuel/podstawy" },
            { label: "Makro w praktyce", href: "/fuel/makro" },
            { label: "Disclaimer medyczny", href: "/docs/policies/medical-disclaimer.md" },
          ],
          disclaimer: "Program edukacyjny — nie zastępuje konsultacji dietetycznych.",
        },
      },
      {
        slug: "protein",
        label: "Cel białka i posiłki",
        description: "Budujesz strukturę dnia pod zaplanowaną podaż białka.",
        plan: {
          title: "Plan Clarivum Fuel: Białko bez stresu",
          durationLabel: "7 dni",
          summary:
            "Poznasz minimalny próg białka i wdrożysz produktowe skróty, żeby realnie go dowozić.",
          phases: [
            {
              title: "Dni 1–2 · Audyt białka",
              steps: [
                "Sprawdź obecną podaż białka w 3 typowych dniach.",
                "Dobierz docelowy zakres (g/kg masy ciała).",
                "Guardrail: minimum 20 g na posiłek główny.",
              ],
            },
            {
              title: "Dni 3–5 · Poszerzenie repertuaru",
              steps: [
                "Dodaj szybkie źródła (skyry, jogurty, tofu, strączki).",
                "Recepta: zbuduj 2 potrawy wysokobiałkowe na automatycznym wprowadzeniu.",
                "Zaplanuj przekąski 15 g białka gdy tempo dnia rośnie.",
              ],
            },
            {
              title: "Dni 6–7 · Guardrail tygodniowy",
              steps: [
                "Monitoruj sytość i energię vs ilość białka.",
                "Zaplanuj zakupy na kolejny tydzień (lista automatyczna).",
                "Notuj przepisy które działają i co można uprościć.",
              ],
            },
          ],
          tools: [
            { label: "Kalkulator makro", href: "/narzedzia/rozklad-makro" },
            { label: "Lista zakupowa", href: "/narzedzia/lista-zakupow" },
            { label: "Plan posiłków", href: "/narzedzia/plan-posilkow" },
          ],
          resources: [
            { label: "Przewodnik białka", href: "/fuel/makro" },
            { label: "Meal prep system", href: "/ebooks" },
            { label: "Checklistę supermarketową", href: "/docs/runbooks/fuel-shopping.md" },
          ],
          disclaimer: "Nie jest to dieta lecznicza. Konsultuj lekarza przy chorobach przewlekłych.",
        },
      },
      {
        slug: "snacks",
        label: "Mądre przekąski",
        description: "Zbuduj przekąski 250 kcal, które wytrzymają dzień poza domem.",
        plan: {
          title: "Plan Clarivum Fuel: Przekąski na tempo",
          durationLabel: "5 dni",
          summary:
            "Przygotujesz rotację przekąsek, które trzymają sytość i pasują do Twojego stylu pracy.",
          phases: [
            {
              title: "Dzień 1 · Audyt nawyków",
              steps: [
                "Notuj kiedy sięgasz po przekąskę i dlaczego.",
                "Określ docelowe kalorie (200–300 kcal).",
                "Guardrail: białko ≥ 12 g, błonnik ≥ 4 g.",
              ],
            },
            {
              title: "Dni 2–3 · Kompletowanie zestawów",
              steps: [
                "Zaprojektuj 3 zestawy (biuro, dom, podróż).",
                "Dodaj listę do aplikacji zakupowej.",
                "Przetestuj kolejność spożycia vs głód.",
              ],
            },
            {
              title: "Dni 4–5 · Automatyzacja",
              steps: [
                "Ustaw przypomnienie na uzupełnienie zapasów.",
                "Sprawdź poziom energii po 2, 4 i 6 godzinach.",
                "Zapisz modyfikacje, które działają lepiej.",
              ],
            },
          ],
          tools: [
            { label: "Plan posiłków", href: "/narzedzia/plan-posilkow" },
            { label: "Szablon listy zakupów", href: "/narzedzia/lista-zakupow" },
            { label: "Tracker energii", href: "/narzedzia/tracker-energii" },
          ],
          resources: [
            { label: "Przewodnik przekąsek", href: "/fuel/podstawy" },
            { label: "Meal prep skróty", href: "/ebooks" },
            { label: "Guardrail: cukry proste", href: "/docs/runbooks/fuel-guardrails.md" },
          ],
          disclaimer: "Materiały edukacyjne. Skonsultuj specjalistę przy alergiach/intolerancjach.",
        },
      },
    ],
  },
  {
    key: "habits",
    label: "Habits",
    description:
      "Budujesz rytm dnia z Forest Day, lepszym snem i redukcją stresu — bez wyrzutów sumienia.",
    goals: [
      {
        slug: "forest-day",
        label: "Forest Day w kalendarzu",
        description: "Raz w miesiącu oczyszczasz backlog i wzmacniasz guardrail.",
        plan: {
          title: "Plan Clarivum Habits: Forest Day",
          durationLabel: "30 dni",
          summary:
            "Zaplanujesz i wykonasz Forest Day: jeden dzień na upraszczanie, uczenie i guardrail.",
          phases: [
            {
              title: "Tydzień 1 · Blokada i cel",
              steps: [
                "Zablokuj Forest Day w kalendarzu (8 godzin, bez spotkań).",
                "Wybierz cel: uprość, usuń, naucz (zgodnie z docs/playbooks/metsa-cadence.md).",
                "Guardrail: powiadom zespół i partnerów 7 dni wcześniej.",
              ],
            },
            {
              title: "Tydzień 2 · Przygotowanie",
              steps: [
                "Zbierz listę długu/guardrails — max 3 zadania.",
                "Ustaw automatyczne przypomnienia i blokadę Slack/Email.",
                "Przygotuj checklistę sukcesu (metryka lub test).",
              ],
            },
            {
              title: "Tydzień 3–4 · Wykonanie i retro",
              steps: [
                "Forest Day → wykonaj zadania i zanotuj wynik.",
                "Uzupełnij `docs/runbooks/ops-hub.md` o nowe wnioski.",
                "Opublikuj nagranie 15 min + guardrail w #kaizen-minute.",
              ],
            },
          ],
          tools: [
            { label: "Planner Forest Day", href: "/narzedzia/forest-day" },
            { label: "Kaizen minute board", href: "/tasks" },
            { label: "Guardrail tracker", href: "/narzedzia/guardrail-tracker" },
          ],
          resources: [
            { label: "Playbook Forest Day", href: "/docs/playbooks/metsa-cadence.md" },
            { label: "Kaizen minute", href: "/docs/playbooks/kaizen-minute.md" },
            { label: "Sisu debugging note", href: "/docs/runbooks/sisu-debugging.md" },
          ],
          disclaimer: "Ustal z zespołem oczekiwania — to narzędzie produktywności, nie terapia.",
        },
      },
      {
        slug: "sleep",
        label: "Sen 7–9 godzin",
        description: "Rytuały wieczorne i guardrail pobudki, żeby spać głębiej.",
        plan: {
          title: "Plan Clarivum Habits: Sen i regeneracja",
          durationLabel: "14 dni",
          summary:
            "Zbudujesz wieczorne rytuały, ustawisz guardrail dla ekspozycji światła i oceniasz efekt.",
          phases: [
            {
              title: "Dni 1–3 · Diagnostyka snu",
              steps: [
                "Zapisuj godziny snu/budzenia oraz ekspozycję na światło.",
                "Guardrail: brak ekranów 30 minut przed snem (ustaw automatyczne tryby).",
                "Wybierz rutynę wyciszającą (oddech, journaling, rozciąganie).",
              ],
            },
            {
              title: "Dni 4–9 · Rytm dobowy",
              steps: [
                "Ustal stałą godzinę pobudki (±15 minut).",
                "Dodaj poranną ekspozycję na światło naturalne ≥ 10 minut.",
                "Monitoruj energię (skala 1–5) i nastrój.",
              ],
            },
            {
              title: "Dni 10–14 · Optymalizacja",
              steps: [
                "Wprowadź dodatkowy guardrail: kofeina tylko do 14:00.",
                "Testuj temperaturę i otoczenie snu.",
                "Przegląd wyników — czy osiągnęłaś 7–9h przez min. 5 dni?",
              ],
            },
          ],
          tools: [
            { label: "Tracker snu", href: "/narzedzia/tracker-snu" },
            { label: "Checklistę wieczorną", href: "/narzedzia/checklista-wieczor" },
            { label: "Skala energii", href: "/narzedzia/tracker-energii" },
          ],
          resources: [
            { label: "Poradnik snu", href: "/habits/sen" },
            { label: "Forest Day reset", href: "/docs/playbooks/metsa-cadence.md" },
            { label: "Guardrail stresu", href: "/docs/runbooks/habits-guardrails.md" },
          ],
          disclaimer:
            "Jeśli masz zaburzenia snu, skonsultuj lekarza lub terapeutę poznawczo-behawioralnego.",
        },
      },
      {
        slug: "stress",
        label: "Redukcja stresu w pracy",
        description: "Guardrail stresu i krótkie praktyki oddechowe w rytmie dnia.",
        plan: {
          title: "Plan Clarivum Habits: Stres pod kontrolą",
          durationLabel: "10 dni",
          summary:
            "Zdiagnozujesz źródła stresu, dodasz mikro-praktyki i guardrail na przeciążenia.",
          phases: [
            {
              title: "Dni 1–3 · Mapowanie stresorów",
              steps: [
                "Notuj sytuacje stresowe (co, kiedy, skala).",
                "Guardrail: max 2 konteksty równocześnie — reszta do backlogu.",
                "Wybierz praktykę oddechową 4-7-8 lub box breathing.",
              ],
            },
            {
              title: "Dni 4–6 · Praktyka i wsparcie",
              steps: [
                "Ustaw przypomnienia breathing break (3x dziennie).",
                "Dodaj mikro-ruch (5 min spacer) po stresującym callu.",
                "Porozmawiaj z partnerem zespołowym o podziale pracy.",
              ],
            },
            {
              title: "Dni 7–10 · Guardrail i refleksja",
              steps: [
                "Wprowadź zasadę 'no meeting Friday' lub analogiczny limit.",
                "Podziel zadania, które nie wymagają Twojej ekspertyzy.",
                "Napisz krótką notatkę — co działa, co poprawić, co delegować.",
              ],
            },
          ],
          tools: [
            { label: "Checklistę stresu", href: "/narzedzia/checklista-stres" },
            { label: "Przypomnienia oddechowe", href: "/narzedzia/breathing-timer" },
            { label: "Planner Forest Day", href: "/narzedzia/forest-day" },
          ],
          resources: [
            { label: "Guardrail stresu", href: "/docs/runbooks/habits-guardrails.md" },
            { label: "Kaizen minute", href: "/docs/playbooks/kaizen-minute.md" },
            { label: "Sisu debugging", href: "/docs/runbooks/sisu-debugging.md" },
          ],
          disclaimer:
            "Jeśli doświadczasz objawów klinicznych, zgłoś się do specjalisty zdrowia psychicznego.",
        },
      },
    ],
  },
];

const HERO_WIZARD = {
  eyebrow: "Clarivum · Skin · Fuel · Habits",
  headline: "Uczymy. Upraszczamy. Dowozimy.",
  subheading:
    "Zrób 3 krótkie kroki — pokażemy gotowy plan + narzędzia gotowe do użycia w ≤20 sekund.",
  badges: ["Za darmo", "Bez spamu", "Oparte na dowodach"],
  emailHelper:
    "Wyślemy PDF planu i przypomnienia guardrail — możesz pominąć i zobaczyć plan na stronie.",
  primaryActionLabel: "Generuj plan",
  secondaryActionLabel: "Zobacz przykładowy plan",
  emailLabel: "E-mail",
  emailOptionalLabel: "(opcjonalnie)",
  emailPlaceholder: "anna@example.com",
  disclaimers: [
    { label: "Disclaimer medyczny", href: "/docs/policies/medical-disclaimer.md" },
    {
      label: "Zasady danych Clarivum",
      href: "/docs/adr/ADR-028-security-and-compliance-baseline.md",
    },
  ],
  uvWidget: {
    title: "UV & pogoda",
    subtitle: "Sprawdzaj indeks UV i planuj re-aplikację.",
    fallbackCity: "Warszawa (domyślnie, jeśli brak zgody)",
    actionLabel: "Udostępnij lokalizację",
    consentCopy: "Brak zgody → pokażemy Warszawę; możesz zmienić ręcznie.",
  },
  pillars: HERO_PILLARS,
};

const DIAGNOSTIC_PROMPTS: HomeLandingViewModel["diagnostics"] = [
  {
    label: "Test bariery (Clarivum Skin)",
    description: "W 3 minuty sprawdzasz wrażliwość skóry i dostajesz rutynę gotową do kliknięcia.",
    href: "/skin/bariera",
  },
  {
    label: "Checkpoint Clarivum Fuel",
    description: "Otrzymujesz TDEE, makro i guardrail wysłany prosto na e-mail.",
    href: "/fuel/podstawy",
  },
  {
    label: "Podgląd Clarivum Habits",
    description: "Układasz Forest Day i guardrail, który faktycznie dowozisz.",
    href: "/habits/podstawy",
  },
];

const LEARNING_MOMENTS: HomeLandingViewModel["learningMoments"] = [
  {
    title: "Podglądam Ops Hub",
    summary:
      "Zobacz, jak runbooki i docs trzymają się ADR-031 zanim odpali się `/ops` w produkcji.",
    href: "/docs/runbooks/ops-hub.md",
  },
  {
    title: "Guardrail w 60 minut",
    summary:
      "Przykłady guardrails z potwierdzeniem skuteczności — wszystko do wdrożenia jeszcze dziś.",
    href: "/docs/playbooks/kaizen-minute.md",
  },
  {
    title: "Sezonowy rytm Metsa",
    summary: "Plan rocznych sezonów i Forest Day, żebyś mogła złapać tempo Metsa.",
    href: "/docs/playbooks/metsa-cadence.md",
  },
];

const TRUST_STRIP: HomeTrustViewModel = {
  eyebrow: "Dowody i zaufanie",
  headline: "Budujemy guardraile na faktach, nie hype'ie",
  quotes: [
    {
      quote:
        "Wreszcie widzę plan z guardrailami, który da się dowieźć bez konsultanta na speed dial.",
      author: "Marta P., Product Lead",
    },
    {
      quote: "Clarivum zbiera dane i tłumaczy je na działania, a nie 100-punktowe checklisty.",
      author: "dr Karolina W., dermatolożka",
    },
  ],
  logos: [
    { alt: "Rzeczpospolita", href: "/docs/PRDs/clarivum_brand.md" },
    { alt: "My Company Polska", href: "/docs/PRDs/clarivum_brand.md" },
    { alt: "Forbes Women", href: "/docs/PRDs/clarivum_brand.md" },
  ],
  links: [
    { label: "Metodologia", href: "/docs/PRDs/seo-foundation.md" },
    { label: "Jak zarabiamy", href: "/docs/PRDs/clarivum_brand.md" },
  ],
  disclaimer:
    "Clarivum to projekt edukacyjny. Nie zastępuje profesjonalnej konsultacji medycznej, dietetycznej ani psychologicznej.",
};

const EBOOKS_SECTION: HomeEbooksViewModel = {
  eyebrow: "Ebooki Clarivum",
  headline: "Zanurz się głębiej w przewodniki",
  description:
    "Każdy ebook to konkretne sekwencje kroków, guardraile i checklisty — bez lania wody. Najpierw narzędzia, potem kontekst.",
  seeAllLabel: "Zobacz katalog",
  seeAllHref: "/ebooks",
  items: [
    {
      slug: "retinoid-playbook",
      title: "Retinoid bez podrażnień",
      description: "3 scenariusze wdrożenia retinoidu + plan awaryjny dla bariery.",
      href: "/ebooks/retinoid-playbook",
    },
    {
      slug: "fuel-prep",
      title: "Meal prep na realne życie",
      description: "Makra, listy zakupów i gotowe rotacje posiłków na tydzień.",
      href: "/ebooks/meal-prep",
    },
    {
      slug: "sleep-rhythm",
      title: "Sen i rytm dobowy",
      description: "14-dniowy reset snu z mikro praktykami i checklistą guardraili.",
      href: "/ebooks/sleep-playbook",
    },
  ],
};

const GLOBAL_CTA: HomeGlobalCtaViewModel = {
  eyebrow: "Gotowa na kolejny krok?",
  headline: "Uruchom diagnostykę i narzędzia Clarivum",
  subheading:
    "Zacznij od darmowych narzędzi, a gdy będziesz gotowa — przejdź do rozszerzonych przewodników i warsztatów.",
  primaryCta: { label: "Przejdź do narzędzi", href: "/narzedzia" },
  secondaryCta: { label: "Uruchom diagnostykę", href: "/diagnostyka" },
};

export class HomeExperienceManager {
  constructor(private readonly contentLibrary: ContentLibrary = createContentLibrary()) {}

  public buildLandingViewModel(): HomeLandingViewModel {
    const highlights = this.contentLibrary.listHighlights(3).map(mapHighlightToViewModel);

    return {
      featureFlags: FEATURE_FLAGS,
      newsletter: NEWSLETTER,
      heroWizard: HERO_WIZARD,
      tools: TOOLS_GRID,
      diagnostics: DIAGNOSTIC_PROMPTS,
      learningMoments: LEARNING_MOMENTS,
      trust: TRUST_STRIP,
      ebooks: EBOOKS_SECTION,
      globalCta: GLOBAL_CTA,
      verticals: highlights,
    };
  }
}
