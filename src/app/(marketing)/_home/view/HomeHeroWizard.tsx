"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { dispatchAnalyticsEvent } from "@/lib/analytics/dispatch";

import type {
  HomeHeroGoal,
  HomeHeroPlanViewModel,
  HomeHeroWizardViewModel,
} from "../viewmodel/HomeViewModel";

type HomeHeroWizardProps = {
  viewModel: HomeHeroWizardViewModel;
  showUvWidget: boolean;
};

type PlanState =
  | { status: "idle" }
  | { status: "generating"; goal: HomeHeroGoal }
  | { status: "ready"; goal: HomeHeroGoal };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function HomeHeroWizard({ viewModel, showUvWidget }: HomeHeroWizardProps) {
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
  const [planState, setPlanState] = useState<PlanState>({ status: "idle" });

  useEffect(() => {
    if (!activePillar) {
      return;
    }

    const isCurrentGoalValid = activePillar.goals.some((goal) => goal.slug === selectedGoal?.slug);

    if (!isCurrentGoalValid) {
      setSelectedGoal(activePillar.goals[0] ?? null);
    }
  }, [activePillar, selectedGoal?.slug]);

  const selectArea = useCallback(
    (areaKey: typeof selectedAreaKey) => {
      setSelectedAreaKey(areaKey);
      const pillar = pillars.find((candidate) => candidate.key === areaKey);
      const defaultGoal = pillar?.goals[0] ?? null;
      setSelectedGoal(defaultGoal);
      setPlanState({ status: "idle" });
      dispatchAnalyticsEvent("HomepageHeroAreaSelected", { area: areaKey });
    },
    [pillars],
  );

  const selectGoal = useCallback(
    (goal: HomeHeroGoal) => {
      setSelectedGoal(goal);
      setPlanState({ status: "idle" });
      dispatchAnalyticsEvent("HomepageHeroGoalSelected", {
        area: activePillar?.key ?? goal.slug,
        goal: goal.slug,
      });
    },
    [activePillar?.key],
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

  const setPlan = useCallback(
    (goal: HomeHeroGoal) => {
      setPlanState({ status: "generating", goal });
      window.setTimeout(() => {
        setPlanState({ status: "ready", goal });
        dispatchAnalyticsEvent("HomepageHeroPlanDisplayed", {
          area: activePillar?.key ?? goal.slug,
          goal: goal.slug,
        });
      }, 250);
    },
    [activePillar?.key],
  );

  const handleGenerate = useCallback(() => {
    if (!selectedGoal) {
      return;
    }

    const error = validateEmail(email.trim());
    setEmailError(error);
    if (error) {
      return;
    }

    dispatchAnalyticsEvent("HomepageHeroPlanRequested", {
      area: activePillar?.key ?? selectedGoal.slug,
      goal: selectedGoal.slug,
      emailProvided: email.trim().length > 0,
    });

    setPlan(selectedGoal);
  }, [activePillar?.key, email, selectedGoal, setPlan, validateEmail]);

  const handleSkip = useCallback(() => {
    if (!selectedGoal) {
      return;
    }

    dispatchAnalyticsEvent("HomepageHeroPlanSkipped", {
      area: activePillar?.key ?? selectedGoal.slug,
    });

    setEmail("");
    setEmailError(null);
    setPlan(selectedGoal);
  }, [activePillar?.key, selectedGoal, setPlan]);

  const handleUvWidgetClick = useCallback(() => {
    dispatchAnalyticsEvent("HomepageUvWidgetPermissionRequested", {});

    if (!("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        // noop: we do not yet persist the location, but the follow-up task will wire OTLP + tooling.
      },
      () => {
        // noop: consent will be handled by the dedicated observability/UX tasks.
      },
    );
  }, []);

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 shadow-sm lg:flex-row">
      <div className="flex w-full flex-col gap-6 lg:w-2/3">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {viewModel.eyebrow}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 lg:text-4xl">
            {viewModel.headline}
          </h1>
          <p className="text-base text-slate-600">{viewModel.subheading}</p>
          <ul className="flex flex-wrap gap-2 pt-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {badges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-slate-200 px-3 py-1 text-[0.6rem] tracking-wide"
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
          <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-4">
            <legend className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
              Krok 1 · Wybierz obszar
            </legend>
            <div className="flex flex-wrap gap-3">
              {pillars.map((pillar) => (
                <button
                  key={pillar.key}
                  type="button"
                  onClick={() => selectArea(pillar.key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    pillar.key === activePillar?.key
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 text-slate-900 hover:border-slate-900"
                  }`}
                  aria-pressed={pillar.key === activePillar?.key}
                >
                  {pillar.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">{activePillar?.description}</p>
          </fieldset>

          <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-4">
            <legend className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
              Krok 2 · Wybierz cel
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
                        ? "bg-slate-900 text-white"
                        : "border border-slate-300 text-slate-900 hover:border-slate-900"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {goal.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500">{selectedGoal?.description}</p>
          </fieldset>

          <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-4">
            <legend className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
              Krok 3 · Opcjonalny e-mail
            </legend>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                {viewModel.emailLabel}{" "}
                <span className="font-normal text-slate-400">{viewModel.emailOptionalLabel}</span>
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
                className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                aria-invalid={emailError ? "true" : "false"}
              />
              <p className="text-xs text-slate-500">{viewModel.emailHelper}</p>
              {emailError ? <p className="text-xs text-red-600">{emailError}</p> : null}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              disabled={!selectedGoal || planState.status === "generating"}
            >
              {planState.status === "generating" ? "Generuję plan…" : viewModel.primaryActionLabel}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
              disabled={!selectedGoal || planState.status === "generating"}
            >
              {viewModel.secondaryActionLabel}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          {viewModel.disclaimers.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="underline decoration-slate-300 underline-offset-2 transition hover:decoration-slate-900"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <aside className="flex w-full flex-col gap-4 lg:w-1/3">
        {planState.status === "ready" ? (
          <PlanSummary plan={planState.goal.plan} />
        ) : planState.status === "generating" ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600">
            Przygotowujemy plan… sprawdzamy guardraile i dobieramy narzędzia Clarivum.
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/40 p-5 text-sm text-slate-500">
            Wybierz cel i kliknij <span className="font-semibold">Generuj plan</span>, aby zobaczyć
            propozycję kroków, narzędzi i guardraili na kolejne dni.
          </div>
        )}

        {showUvWidget ? (
          <button
            type="button"
            onClick={handleUvWidgetClick}
            className="group rounded-2xl border border-slate-200 bg-white/80 p-5 text-left transition hover:border-slate-900 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  {uvWidget.title}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{uvWidget.subtitle}</p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition group-hover:bg-slate-700">
                {uvWidget.actionLabel}
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Domyślna lokalizacja: <span className="font-semibold">{uvWidget.fallbackCity}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">{uvWidget.consentCopy}</p>
          </button>
        ) : null}
      </aside>
    </section>
  );
}

function PlanSummary({ plan }: { plan: HomeHeroPlanViewModel }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
      <header className="space-y-1">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {plan.durationLabel}
        </p>
        <h2 className="text-xl font-semibold text-slate-900">{plan.title}</h2>
        <p className="text-sm text-slate-600">{plan.summary}</p>
      </header>
      <div className="space-y-3">
        {plan.phases.map((phase) => (
          <section key={phase.title} className="rounded-xl border border-slate-100 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">{phase.title}</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {phase.steps.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-900" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="space-y-2">
        <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Narzędzia Clarivum
        </h3>
        <ul className="space-y-1 text-sm text-slate-600">
          {plan.tools.map((tool) => (
            <li key={tool.href}>
              <a
                href={tool.href}
                className="text-slate-900 underline decoration-slate-300 underline-offset-2 transition hover:decoration-slate-900"
              >
                {tool.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Czytaj dalej
        </h3>
        <ul className="space-y-1 text-sm text-slate-600">
          {plan.resources.map((resource) => (
            <li key={resource.href}>
              <a
                href={resource.href}
                className="text-slate-900 underline decoration-slate-300 underline-offset-2 transition hover:decoration-slate-900"
              >
                {resource.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-slate-500">{plan.disclaimer}</p>
    </article>
  );
}
