"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { dispatchAnalyticsEvent } from "@/lib/analytics/dispatch";

import type {
  HomeHeroGoal,
  HomeHeroPillar,
  HomeHeroWizardViewModel,
} from "../viewmodel/HomeViewModel";

export type HomeHeroPlanState =
  | { status: "idle" }
  | { status: "generating"; pillar: HomeHeroPillar; goal: HomeHeroGoal }
  | { status: "ready"; pillar: HomeHeroPillar; goal: HomeHeroGoal };

type HomeHeroWizardProps = {
  viewModel: HomeHeroWizardViewModel;
  showUvWidget: boolean;
  onPlanStateChange?: (state: HomeHeroPlanState) => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LAST_SELECTION_STORAGE_KEY = "clarivum-home-hero-selection";
const LAST_SELECTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function HomeHeroWizard({
  viewModel,
  showUvWidget,
  onPlanStateChange,
}: HomeHeroWizardProps) {
  const { pillars, badges, uvWidget } = viewModel;
  const [selectedAreaKey, setSelectedAreaKey] = useState(pillars[0]?.key ?? "skin");
  const activePillar = useMemo(
    () => pillars.find((pillar) => pillar.key === selectedAreaKey) ?? pillars[0],
    [pillars, selectedAreaKey],
  );
  const [selectedGoal, setSelectedGoal] = useState<HomeHeroGoal | null>(
    activePillar?.goals[0] ?? null,
  );
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [planState, setPlanState] = useState<HomeHeroPlanState>({ status: "idle" });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAST_SELECTION_STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as {
        area?: HomeHeroPillar["key"];
        goal?: HomeHeroGoal["slug"] | null;
        savedAt?: number;
      };
      if (!parsed?.area || !parsed.savedAt) {
        return;
      }
      if (Date.now() - parsed.savedAt > LAST_SELECTION_TTL_MS) {
        window.localStorage.removeItem(LAST_SELECTION_STORAGE_KEY);
        return;
      }
      const storedPillar = pillars.find((pillar) => pillar.key === parsed.area);
      if (!storedPillar) {
        return;
      }
      setSelectedAreaKey(storedPillar.key);
      const storedGoal =
        storedPillar.goals.find((goal) => goal.slug === parsed.goal) ??
        storedPillar.goals[0] ??
        null;
      setSelectedGoal(storedGoal);
    } catch {
      // Ignored: jeśli JSON jest niepoprawny, startujemy z domyślnym widokiem.
    }
  }, [pillars]);

  useEffect(() => {
    if (!activePillar) {
      return;
    }

    const goalFromPillar = activePillar.goals.find((goal) => goal.slug === selectedGoal?.slug);
    if (!goalFromPillar) {
      setSelectedGoal(activePillar.goals[0] ?? null);
    }
  }, [activePillar, selectedGoal?.slug]);

  useEffect(() => {
    onPlanStateChange?.(planState);
  }, [planState, onPlanStateChange]);

  const resetPlanState = useCallback(() => {
    setPlanState({ status: "idle" });
  }, []);

  const persistSelection = useCallback(
    (areaKey: HomeHeroPillar["key"], goal: HomeHeroGoal | null) => {
      try {
        window.localStorage.setItem(
          LAST_SELECTION_STORAGE_KEY,
          JSON.stringify({
            area: areaKey,
            goal: goal?.slug ?? null,
            savedAt: Date.now(),
          }),
        );
      } catch {
        // Ignore quota errors (np. tryb prywatny) — po prostu nie zapisujemy stanu.
      }
    },
    [],
  );

  const selectArea = useCallback(
    (areaKey: typeof selectedAreaKey) => {
      setSelectedAreaKey(areaKey);
      const pillar = pillars.find((candidate) => candidate.key === areaKey);
      const defaultGoal = pillar?.goals[0] ?? null;
      setSelectedGoal(defaultGoal);
      persistSelection(areaKey, defaultGoal);
      resetPlanState();
      dispatchAnalyticsEvent("HomepageHeroAreaSelected", { area: areaKey });
    },
    [persistSelection, pillars, resetPlanState],
  );

  const selectGoal = useCallback(
    (goal: HomeHeroGoal) => {
      setSelectedGoal(goal);
      if (activePillar) {
        persistSelection(activePillar.key, goal);
      }
      resetPlanState();
      dispatchAnalyticsEvent("HomepageHeroGoalSelected", {
        area: activePillar?.key ?? goal.slug,
        goal: goal.slug,
      });
    },
    [activePillar, persistSelection, resetPlanState],
  );

  const validateEmail = useCallback((value: string) => {
    if (!value) {
      return null;
    }

    if (!EMAIL_REGEX.test(value)) {
      return "Podaj poprawny adres e-mail.";
    }

    return null;
  }, []);

  const triggerPlanGeneration = useCallback(
    (goal: HomeHeroGoal) => {
      if (!activePillar) {
        return;
      }

      const generatingState: HomeHeroPlanState = {
        status: "generating",
        pillar: activePillar,
        goal,
      };
      setPlanState(generatingState);

      window.setTimeout(() => {
        const readyState: HomeHeroPlanState = { status: "ready", pillar: activePillar, goal };
        setPlanState(readyState);
        dispatchAnalyticsEvent("HomepageHeroPlanDisplayed", {
          area: activePillar.key,
          goal: goal.slug,
        });
      }, 320);
    },
    [activePillar],
  );

  const handleGenerate = useCallback(() => {
    if (!selectedGoal || !activePillar) {
      return;
    }

    const trimmedEmail = email.trim();
    const error = validateEmail(trimmedEmail);
    setEmailError(error);
    if (error) {
      return;
    }

    dispatchAnalyticsEvent("HomepageHeroPlanRequested", {
      area: activePillar.key,
      goal: selectedGoal.slug,
      emailProvided: trimmedEmail.length > 0,
    });

    triggerPlanGeneration(selectedGoal);
  }, [activePillar, email, selectedGoal, triggerPlanGeneration, validateEmail]);

  const handleSkip = useCallback(() => {
    if (!selectedGoal || !activePillar) {
      return;
    }

    dispatchAnalyticsEvent("HomepageHeroPlanSkipped", {
      area: activePillar.key,
      goal: selectedGoal.slug,
    });

    setEmail("");
    setEmailError(null);
    triggerPlanGeneration(selectedGoal);
  }, [activePillar, selectedGoal, triggerPlanGeneration]);

  const handleUvWidgetClick = useCallback(() => {
    dispatchAnalyticsEvent("HomepageUvWidgetPermissionRequested", {});

    if (!("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        // Placeholder: next iteration wires location storage + OTLP signal.
      },
      () => {
        // Placeholder: consent handling sits in observability tasks.
      },
    );
  }, []);

  const currentStep = useMemo(() => {
    if (!activePillar) {
      return 1;
    }
    if (!selectedGoal) {
      return 1;
    }
    return email.trim().length > 0 ? 3 : 2;
  }, [activePillar, email, selectedGoal]);

  return (
    <section
      className="border-ink-soft flex flex-col gap-6 rounded-[2.5rem] border bg-[linear-gradient(145deg,rgba(255,255,255,0.92)_0%,rgba(237,230,218,0.65)_100%)] p-6 shadow-[0_40px_65px_-50px_rgba(46,107,90,0.45)] lg:flex-row lg:p-8"
      aria-labelledby="clarivum-hero-heading"
    >
      <div className="flex w-full flex-col gap-6 lg:w-2/3">
        <header className="space-y-3">
          <p className="text-ink-soft text-xs font-semibold tracking-[0.26em] uppercase">
            {viewModel.eyebrow}
          </p>
          <h1
            id="clarivum-hero-heading"
            className="font-display text-ink text-4xl leading-tight lg:text-5xl"
          >
            {viewModel.headline}
          </h1>
          <p className="text-ink-soft max-w-xl text-base leading-relaxed">{viewModel.subheading}</p>
          <ul className="text-ink-soft flex flex-wrap gap-2 pt-2 text-[0.65rem] font-semibold tracking-[0.22em] uppercase">
            {badges.map((badge) => (
              <li
                key={badge}
                className="border-ink-soft rounded-full border px-3 py-1 text-[0.65rem]"
              >
                {badge}
              </li>
            ))}
          </ul>
        </header>

        <form
          className="space-y-6"
          aria-label="Szybka diagnostyka Clarivum"
          onSubmit={(event) => {
            event.preventDefault();
            handleGenerate();
          }}
        >
          <p className="text-ink-soft text-xs font-semibold tracking-[0.24em] uppercase">
            Krok {currentStep} z 3
          </p>
          <fieldset
            className="border-ink-soft bg-snow space-y-3 rounded-[1.75rem] border p-5 backdrop-blur-sm"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <legend className="text-ink-soft text-xs font-semibold tracking-[0.22em] uppercase">
              Krok 1 z 3 · Wybierz obszar
            </legend>
            <div className="flex flex-wrap gap-3">
              {pillars.map((pillar) => {
                const isActive = pillar.key === activePillar?.key;
                return (
                  <button
                    key={pillar.key}
                    type="button"
                    onClick={() => selectArea(pillar.key)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-jade text-snow shadow-[0_12px_18px_-14px_rgba(46,107,90,0.65)]"
                        : "border-ink-soft text-ink hover:border-jade border"
                    }`}
                    aria-pressed={isActive}
                  >
                    {pillar.label}
                  </button>
                );
              })}
            </div>
            <p className="text-ink-soft text-xs leading-relaxed">{activePillar?.description}</p>
          </fieldset>

          <fieldset
            className="border-ink-soft bg-snow space-y-3 rounded-[1.75rem] border p-5 backdrop-blur-sm"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <legend className="text-ink-soft text-xs font-semibold tracking-[0.22em] uppercase">
              Krok 2 z 3 · Wybierz cel
            </legend>
            <div className="flex flex-wrap gap-2">
              {activePillar?.goals.map((goal) => {
                const isSelected = goal.slug === selectedGoal?.slug;
                return (
                  <button
                    key={goal.slug}
                    type="button"
                    onClick={() => selectGoal(goal)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isSelected
                        ? "border-jade text-jade border bg-[rgba(46,107,90,0.08)]"
                        : "border-ink-soft text-ink hover:border-jade border"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {goal.label}
                  </button>
                );
              })}
            </div>
            <p className="text-ink-soft text-xs leading-relaxed">{selectedGoal?.description}</p>
          </fieldset>

          <fieldset
            className="border-ink-soft bg-snow space-y-3 rounded-[1.75rem] border p-5 backdrop-blur-sm"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <legend className="text-ink-soft text-xs font-semibold tracking-[0.22em] uppercase">
              Krok 3 z 3 · Opcjonalny e-mail
            </legend>
            <div className="flex flex-col gap-2">
              <label className="text-ink-soft text-xs font-semibold tracking-[0.22em] uppercase">
                {viewModel.emailLabel}{" "}
                <span className="text-ink-soft font-normal">{viewModel.emailOptionalLabel}</span>
              </label>
              <input
                type="email"
                inputMode="email"
                placeholder={viewModel.emailPlaceholder}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (emailError) {
                    setEmailError(null);
                  }
                }}
                className="border-ink-soft text-ink focus:border-jade focus-visible:ring-jade w-full rounded-full border px-5 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
                aria-invalid={emailError ? "true" : "false"}
              />
              <p className="text-ink-soft text-xs leading-relaxed">{viewModel.emailHelper}</p>
              {emailError ? <p className="text-xs text-[#c9403d]">{emailError}</p> : null}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-jade text-snow focus-visible:ring-jade rounded-full px-5 py-2 text-sm font-semibold transition hover:bg-[#245345] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
              disabled={!selectedGoal || planState.status === "generating"}
            >
              {planState.status === "generating" ? "Generuję plan…" : viewModel.primaryActionLabel}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="border-ink-soft text-ink hover:border-jade focus-visible:ring-jade rounded-full border px-5 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
              disabled={!selectedGoal || planState.status === "generating"}
            >
              {viewModel.secondaryActionLabel}
            </button>
          </div>

          <PlanStatusMessage planState={planState} />
        </form>

        <div className="text-ink-soft flex flex-wrap gap-4 text-xs">
          {viewModel.disclaimers.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:decoration-jade underline decoration-[rgba(46,107,90,0.25)] underline-offset-4 transition"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <aside className="flex w-full flex-col gap-4 lg:w-1/3">
        <div
          className="border-ink-soft bg-snow text-ink-soft rounded-[1.75rem] border p-5 text-sm leading-relaxed"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.82)" }}
        >
          <p className="text-ink font-semibold tracking-[0.24em] uppercase">Jak to działa?</p>
          <p className="mt-2">
            Dobieramy kroki i guardraile na 14 dni. Plan pojawi się poniżej hero — możesz go zapisać
            jako PDF lub od razu kliknąć narzędzia.
          </p>
          <p className="mt-2">
            Bez presji na e-mail: kliknij <span className="text-ink font-semibold">Pomiń</span>, aby
            zobaczyć plan w przeglądarce.
          </p>
        </div>

        {showUvWidget ? (
          <button
            type="button"
            onClick={handleUvWidgetClick}
            className="group border-ink-soft bg-snow text-ink hover:border-jade focus-visible:ring-jade rounded-[1.75rem] border p-5 text-left text-sm transition hover:shadow-[0_18px_38px_-28px_rgba(46,107,90,0.45)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.86)" }}
            aria-label="Włącz widżet UV i pogody Clarivum"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-ink-soft text-xs font-semibold tracking-[0.22em] uppercase">
                  {uvWidget.title}
                </p>
                <p className="text-ink mt-1 text-base font-semibold">{uvWidget.subtitle}</p>
              </div>
              <span className="bg-jade text-snow rounded-full px-3 py-1 text-xs font-semibold tracking-[0.22em] uppercase transition group-hover:bg-[#245345]">
                {uvWidget.actionLabel}
              </span>
            </div>
            <p className="text-ink-soft mt-3 text-xs">
              Domyślna lokalizacja:{" "}
              <span className="text-ink font-semibold">{uvWidget.fallbackCity}</span>
            </p>
            <p className="text-ink-soft mt-1 text-xs">{uvWidget.consentCopy}</p>
            <p className="text-ink-soft mt-3 text-[0.65rem] tracking-[0.22em] uppercase">
              Widżet z bieżącym indeksem UV dla Twojego miasta
            </p>
          </button>
        ) : null}
      </aside>
    </section>
  );
}

function PlanStatusMessage({ planState }: { planState: HomeHeroPlanState }) {
  if (planState.status === "generating") {
    return (
      <div
        aria-live="polite"
        className="border-ink-soft bg-snow text-ink-soft rounded-[1.5rem] border px-5 py-3 text-sm"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      >
        Przygotowujemy plan — dobieramy guardraile i narzędzia Clarivum. Plan pojawi się zaraz pod
        hero.
      </div>
    );
  }

  if (planState.status === "ready") {
    return (
      <div
        aria-live="polite"
        className="border-jade text-jade rounded-[1.5rem] border bg-[rgba(46,107,90,0.08)] px-5 py-3 text-sm"
      >
        Plan gotowy! Przewiń w dół — sekcja “Twój plan na start” czeka tuż pod hero.
      </div>
    );
  }

  return (
    <p className="text-ink-soft text-sm">
      Guardrail reminder: dodaj plan do wyników w ciągu 48 godzin i uzupełnij go własnymi notatkami.
    </p>
  );
}
