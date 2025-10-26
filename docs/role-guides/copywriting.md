# Clarivum copywriting playbook

Ten przewodnik uzupełnia `AGENTS.md` i opisuje, jak pisać publiczne treści Clarivum tak, by brzmiały jak naturalny polski głos marki.

## Zawsze po polsku, naturalnie

- Pisz po polsku od zera. Literalne tłumaczenia z angielskiego psują rytm i nie przechodzą review.
- Korzystaj z języka, którym mówią nasi klienci: proste zdania, konkretne czasowniki, brak żargonu.
- Jeśli musisz przytoczyć termin produktowy (np. Strapi, Flagsmith), otocz go polskim kontekstem.

## „Me, me, me” — perspektywa odbiorcy

- Narracja pierwszoosobowa lub wprost do użytkownika („Chcę…”, „Dostaję…”, „Wiem co zrobić dalej”).
- Każde zdanie odpowiada na pytanie „co z tego mam?” zamiast opisywać, co oferujemy ogólnie.
- CTA-y zapisuj jako działanie użytkownika (np. „Chcę zobaczyć moją mapę drogi”, „Robię test bariery”).
- Nie wypisuj listy funkcji bez wytłumaczenia, jak zmieniają dzień użytkownika.

## Nazewnictwo filarów Clarivum

- Używaj tylko nazw: **Clarivum Skin**, **Clarivum Fuel**, **Clarivum Habits**.
- Nigdy nie zamieniaj ich na „Nutrition”, „Health” ani inne ogólne etykiety.
- W jednym akapicie możesz skrócić do „Skin/Fuel/Habits”, jeśli zdanie zaczyna się od pełnej nazwy.

## Krótkie checklisty publikacji

1. Czy każda widoczna fraza jest po polsku i brzmi naturalnie?
2. Czy odbiorca widzi bezpośrednią korzyść lub kolejny krok?
3. Czy CTA mówi o działaniu użytkownika?
4. Czy nazwy filarów to Clarivum Skin/Fuel/Habits?
5. Czy treść wskazuje, gdzie potwierdzić wynik (diagnostyka, guardrail, runbook)?

## Jak pracujemy nad copy

- Źródła: PRD/ADR w `docs/`, aktualne makiety ASCII oraz zatwierdzone komponenty Strapi.
- Każdy merge zmieniający `src/app/**` z copy musi jednocześnie dotknąć odpowiedni dokument lub runbook (patrz `AGENTS.md` §4).
- Zanim poprosisz o review, odpal `npm run validate` oraz manualnie sprawdź widok w przeglądarce.

Aktualizuj ten plik, gdy zmienia się ton głosu, proces akceptacji lub nazewnictwo produktów.
