export default function VerticalNotFound() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white/80 p-8 text-center text-slate-600">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Ścieżka niedostępna
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Nie znaleziono tej ścieżki</h1>
      <p className="mt-3 text-sm">
        Sprawdź slug verticalu/kategorii/sluga i porównaj z content-mapą
        (docs/PRDs/first_configuration.md). Dodaj brakujące dane zanim uruchomisz kolejne kampanie.
      </p>
    </div>
  );
}
