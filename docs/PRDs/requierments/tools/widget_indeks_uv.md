# Tool Specification — Widżet Indeksu UV

> **Canonical decision:** Implement on the shared tools runtime per `docs/adr/ADR-022-tools-and-calculators-platform.md`. Integrate weather data via Open-Meteo (`https://open-meteo.com/`) with caching and privacy guardrails described below.

Poniższy dokument opisuje kompletne wymagania dla widżetu **Indeks UV + pogoda
lokalna**, renderowanego w sekcji hero strony głównej i dostępnego jako moduł
w repozytorium narzędzi Clarivum.

---

## A) Cel produktu i zakres

* **Cel nadrzędny:** Pomóc użytkownikowi ocenić ryzyko ekspozycji na UV w czasie
  rzeczywistym i szybciej przejść do działań ochronnych (SPF, plan dnia).
* **Zakres w ramach tego wydania:** pojedynczy kafel (hero widget) z danymi
  dziennymi (UV teraz + przewidywana maksymalna wartość) oraz skrótami do
  narzędzi SPF. Ma działać zarówno z automatyczną lokalizacją, jak i domyślną
  (Warszawa) z możliwością zmiany miasta.
* **Poza zakresem:** prognozy godzinowe 48h+, powiadomienia push, alerty
  pogodowe, osadzenia na innych stronach bez audytu UX.

---

## B) Persony i kluczowe scenariusze

1. **Skin Explorer (PL/EN):** wchodzi na stronę po poradę SPF, potrzebuje szybko
   sprawdzić UV i zdecydować o ochronie (krem, reaplikacja).
2. **Returning Member:** ma zapisane preferencje, oczekuje automatycznego
   dopasowania lokalizacji i przypomnienia o wysokim UV.
3. **Content Editor:** zarządza copy i ostrzeżeniami (PL/EN) bez ingerencji w
   kod; musi móc edytować teksty w CMS/JSON.

---

## C) Definicje, dane i założenia

* **Open-Meteo endpoints:** `https://api.open-meteo.com/v1/forecast` z
  parametrami `latitude`, `longitude`, `current=uv_index&daily=uv_index_max`.
* **Geokodowanie:** używamy `https://geocoding-api.open-meteo.com/v1/search`
  dla ręcznego wyboru miasta (max 10 wyników, wspieraj PL/EN).
* **Refresh window:** dane aktualizowane co 30 minut; wcześniejsze odpytywanie
  korzysta z cache (edge + local storage).
* **Fallback coordinates:** Warszawa (52.2297, 21.0122) gdy użytkownik odmówi
  lub gdy geolokalizacja nie jest dostępna.
* **Jednostki:** indeks UV (0–11+) z mapowaniem kolorów wg WHO,
  temperatura (°C) opcjonalnie w tooltipie (pobieramy `current_weather` tylko
  jeśli ma znaczenie dla copy).
* **Dostępność językowa:** PL (default), EN; etykiety w JSON (CMS Strapi
  namespace `tools.uv-widget`).
* **Caching strategy:** CDN edge 5 min, client storage 30 min (timestamp w ISO).

---

## D) Kontrakt danych wejściowych

### 1. Automatyczna lokalizacja

* Web API `navigator.geolocation.getCurrentPosition`.
* Timeout 5 s; on error → fallback do Warszawy i pokaż baner informacyjny.
* Dane przekazywane do back-endu jako `{latitude:number, longitude:number}`.

### 2. Ręczny wybór miasta

* Input `search_query` (min 2 znaki, max 60).
* Request (server → Open-Meteo Geocoding):

```json
{
  "name": "Warsaw",
  "count": 10,
  "language": "pl"
}
```

* Response to normalizowany obiekt `CityCandidate`:

```json
{
  "id": "geoname-756135",
  "name": "Warszawa",
  "country": "Poland",
  "latitude": 52.2297,
  "longitude": 21.0122,
  "timezone": "Europe/Warsaw"
}
```

* Po wyborze miasta zapisujemy `last_city` w `localStorage` (expiry 7 dni).

---

## E) Kontrakt danych wyjściowych

```json
{
  "city_label": "Warszawa, PL",
  "source": "Open-Meteo",
  "observed_at": "2025-01-17T10:30:00Z",
  "uv_now": 5.3,
  "uv_max_today": 6.8,
  "risk_level": "moderate",
  "risk_copy": "Nałóż SPF 50 i powtórz co 2h.",
  "next_steps": [
    {"label": "Kalkulator dawki SPF", "href": "/skin/narzedzia/kalkulator-dawki-spf"},
    {"label": "Timer reaplikacji", "href": "/skin/narzedzia/timer-reaplikacji"}
  ],
  "fallback": {
    "is_fallback_city": true,
    "message": "Pokazujemy Warszawę. Udostępnij lokalizację, aby zobaczyć swoje miasto."
  }
}
```

* `risk_level` mapowanie:
  * 0–2 → `low`
  * 3–5 → `moderate`
  * 6–7 → `high`
  * 8–10 → `very_high`
  * ≥11 → `extreme`
* `risk_copy` trzymane w content store per język i poziom.
* `fallback.is_fallback_city=false` gdy użytkownik umożliwi lokalizację lub
  wybierze miasto z listy.

---

## F) Wymagania funkcjonalne

### FR1 — Geolokalizacja i zgody

* Pop-up prosi o zgodę na lokalizację po wejściu na stronę (jednorazowo).
* W przypadku odmowy: pokaż Warszawę + CTA „Zmień lokalizację”.
* Opcja „Zmień lokalizację” otwiera wyszukiwarkę miast (modal / popover).

### FR2 — Pobieranie i prezentacja danych

* Po otrzymaniu współrzędnych front-end pyta własny endpoint
  (`/api/tools/uv-widget`) → serwer łączy się z Open-Meteo.
* W hero wyświetlamy: **UV teraz (liczba, kolor badge), nazwę miasta, status
  ryzyka, copy, linki skrótów**.
* Jeśli API zwróci błąd → fallback tekst: „Nie możemy teraz pobrać danych. Skorzystaj
  z kalkulatora SPF.” + `fallback.is_fallback_city=true`.

### FR3 — Odświeżanie i cache

* Auto-refresh co 30 min (timer w kliencie); manualny przycisk „Odśwież dane”
  z tooltipem o dacie ostatniej aktualizacji.
* Przy przeładowaniu strony w ciągu 30 min używamy cache (localStorage) przed
  nowym call’em do API → optymistyczne UI + update w tle.

### FR4 — Integracje narzędzi SPF

* `next_steps` generowane na serwerze na podstawie konfiguracji (list JSON).
* Kliknięcia w CTA instrumentowane zdarzeniem `uv_widget_cta_click`.

### FR5 — Obsługa języków

* Wersja EN: „UV now”, „UV max today”, `risk_copy` w EN.
* Przełączanie języka (Next.js i18n) powinno resetować copy, ale zachowywać
  współrzędne.

---

## G) Wymagania niefunkcjonalne

* **Performance:** SSR/ISR 60s revalidacji; client hydration <80 ms; bundle
  light (bez ciężkich wizualizacji).
* **Accessibility:** badge UV z kontrastem AA, aria-live dla komunikatów o
  błędach, focus management w modalu wyszukiwarki.
* **Reliability:** Open-Meteo 99.5% SLA; nasze endpointy retry 3x z backoffem
  300–1200 ms.
* **Security & Privacy:** Nie logujemy dokładnych współrzędnych; w analityce
  tylko `country_code` oraz `consent_status`. Zgoda na lokalizację przechowywana
  w `localStorage` (`uv_location_consent=true/false`).
* **Rate limiting:** max 1 call/min na usera (klient), 30 req/min (serwer → OM).

---

## H) Zależności i integracje

* **Internal:** Shared tools API layer, Strapi (copy), feature flag
  `tools.uv_widget.enabled`.
* **External:** Open-Meteo Forecast + Geocoding API, browser Geolocation API.
* **Observability:** Logi w DataDog (`service=tools-uv-widget`), metryki czasów
  odpowiedzi, % fallbacków.

---

## I) Analityka i KPI

* **Primary KPI:** CTR na CTA SPF z widżetu, `%users_with_high_uv_warning`.
* **Secondary:** procent użytkowników udzielających zgody lokalizacyjnej,
  średnia wartość `uv_now`.
* **Events (GA4 / Segment):**
  * `uv_widget_load` (props: `has_consent`, `source_city`, `uv_now`).
  * `uv_widget_refresh`.
  * `uv_widget_city_search` (props: `query_length`, `results_count`).
  * `uv_widget_cta_click` (props: `cta_id`).

---

## J) Plan wdrożenia & readiness checklist

1. Feature flag włączona na staging (`tools.uv_widget.enabled`).
2. Strapi: copy PL dla risk levels + fallback message; pozostaw gotowe pola dla przyszłych języków.
3. Legal review: komunikat o wykorzystaniu lokalizacji (PL) oraz zatwierdzony szablon do rozszerzenia na kolejne języki.
4. QA: testy z mockami dla zgody i odmowy lokalizacji, brak sieci, ręczne miasto.
5. Monitoring: alert gdy >20% odpytań kończy się fallbackiem w godzinie.
6. `docs/runbooks/tools-platform-operations.md` zaktualizowany o procedury awaryjne i poinformowany zespół on-call.

---

## K) Otwarte pytania i założenia

* Czy pokazujemy temperaturę / zachmurzenie? (opcjonalne, wymaga dodatkowych
  parametrów API).
* Jak obsługujemy multi-day stay? (rozważ zapisywanie UV max z wczoraj do
  porównań).
* Potrzebne potwierdzenie, czy CTA mają prowadzić do planów personalizowanych
  czy statycznych narzędzi.

---
