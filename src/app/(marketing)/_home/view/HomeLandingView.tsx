"use client";

import { ArrowRight, BookOpen, FileArrowDown, Leaf } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { Button, ButtonLink } from "@/components/ui";

import { HomeHeroWizard, type HomeHeroPlanState } from "./HomeHeroWizard";
import { HomeNewsletterBanner } from "./HomeNewsletterBanner";

import type { HomeLandingViewModel } from "../viewmodel/HomeViewModel";
import type { ReactNode } from "react";

export function HomeLandingView({ viewModel }: { viewModel: HomeLandingViewModel }) {
  const [planState, setPlanState] = useState<HomeHeroPlanState>({ status: "idle" });

  const handlePlanStateChange = useCallback((state: HomeHeroPlanState) => {
    setPlanState(state);

    if (state.status === "ready") {
      window.requestAnimationFrame(() => {
        const target = document.getElementById("home-plan-section");
        if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          target.focus({ preventScroll: true });
        }
      });
    }
  }, []);

  const newsletterBanner = useMemo(() => {
    if (!viewModel.featureFlags.newsletterBar) {
      return null;
    }

    return (
      <div className="sticky top-24 z-40">
        <HomeNewsletterBanner viewModel={viewModel.newsletter} />
      </div>
    );
  }, [viewModel.featureFlags.newsletterBar, viewModel.newsletter]);

  return (
    <div>
      <section className="full-bleed section">
        <div className="safe container flex flex-col gap-8">
          {newsletterBanner}
          <HomeHeroWizard
            viewModel={viewModel.heroWizard}
            showUvWidget={viewModel.featureFlags.uvWidget}
            onPlanStateChange={handlePlanStateChange}
          />
        </div>
      </section>

      <div className="section">
        <div className="container">
          <PlanSection planState={planState} />
        </div>
      </div>

      <div className="section">
        <div className="container">
          <Diagnostics diagnostics={viewModel.diagnostics} />
        </div>
      </div>

      <div className="section">
        <div className="container--wide container">
          <VerticalGrid verticals={viewModel.verticals} />
        </div>
      </div>

      <div className="section section--tight">
        <div className="container--narrow container">
          <LearningMoments learningMoments={viewModel.learningMoments} />
        </div>
      </div>
    </div>
  );
}

function PlanSection({ planState }: { planState: HomeHeroPlanState }) {
  if (planState.status === "idle") {
    return (
      <section
        id="home-plan-section"
        tabIndex={-1}
        className="border-ink-soft bg-snow text-ink-soft rounded-[2.5rem] border border-dashed p-8 text-center text-sm"
      >
        <p className="text-ink font-semibold tracking-[0.22em] uppercase">Twój plan na start</p>
        <p className="mt-2 text-base">
          Wygeneruj plan w hero — pojawi się tutaj w formie kroków na 14 dni, z guardrailami i
          dopasowanymi narzędziami.
        </p>
        <p className="mt-2 text-xs tracking-[0.22em] uppercase">
          Guardrail: dodaj go do checklisty w ciągu 48 h i zweryfikuj efekt.
        </p>
      </section>
    );
  }

  if (planState.status === "generating") {
    return (
      <section
        id="home-plan-section"
        tabIndex={-1}
        className="border-ink-soft bg-snow text-ink-soft rounded-[2.5rem] border p-8 text-center text-sm"
        aria-live="polite"
      >
        Przygotowujemy plan — dobieramy guardraile i narzędzia Clarivum. Sekcja odświeży się za
        moment.
      </section>
    );
  }

  const { goal, pillar } = planState;
  const plan = goal.plan;
  const accentColor = getPillarAccent(pillar.key);

  return (
    <section
      id="home-plan-section"
      tabIndex={-1}
      className="border-ink-soft bg-snow focus-visible:ring-jade rounded-[2.5rem] border p-8 shadow-[0_40px_65px_-50px_rgba(46,107,90,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:p-10"
      aria-live="polite"
    >
      <header className="space-y-3">
        <p className="text-ink-soft text-xs font-semibold tracking-[0.24em] uppercase">
          Twój plan na start · {plan.durationLabel}
        </p>
        <h2 className="font-display text-ink text-3xl md:text-[2.5rem]">
          {pillar.label} → {goal.label}
        </h2>
        <p className="text-ink-soft text-base leading-relaxed">{plan.summary}</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {plan.phases.map((phase) => (
          <article
            key={phase.title}
            className="border-ink-soft text-ink-soft rounded-[1.75rem] border bg-[rgba(255,255,255,0.92)] p-6 text-sm"
          >
            <h3 className="text-ink text-sm font-semibold tracking-[0.18em] uppercase">
              {phase.title}
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed">
              {phase.steps.map((step) => (
                <li key={step} className="text-ink-soft flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1 inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PlanLinks
          title="Narzędzia Clarivum"
          items={plan.tools}
          icon={<Leaf size={18} weight="regular" aria-hidden="true" />}
          accentColor={accentColor}
        />
        <PlanLinks
          title="Czytaj dalej"
          items={plan.resources}
          icon={<BookOpen size={18} weight="regular" aria-hidden="true" />}
          accentColor={accentColor}
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          accent={pillar.key}
          icon={<FileArrowDown size={18} weight="regular" aria-hidden="true" />}
        >
          Zapisz plan jako PDF
        </Button>
        <ButtonLink
          href="/ebooks"
          variant="primary"
          accent={pillar.key}
          iconPosition="end"
          icon={<ArrowRight size={16} weight="regular" aria-hidden="true" />}
        >
          Pobierz rozszerzony przewodnik
        </ButtonLink>
      </div>

      <p className="text-ink-soft mt-4 text-xs">{plan.disclaimer}</p>
    </section>
  );
}

function PlanLinks({
  title,
  items,
  icon,
  accentColor,
}: {
  title: string;
  items: { label: string; href: string }[];
  icon: ReactNode;
  accentColor: string;
}) {
  return (
    <section className="border-ink-soft text-ink-soft rounded-[1.75rem] border bg-[rgba(255,255,255,0.92)] p-6 text-sm">
      <header className="text-ink flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase">
        {icon}
        {title}
      </header>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="text-ink hover:text-jade inline-flex items-center gap-2 transition"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Diagnostics({ diagnostics }: Pick<HomeLandingViewModel, "diagnostics">) {
  return (
    <section className="border-ink-soft bg-snow rounded-[2.5rem] border p-8 shadow-[0_40px_65px_-55px_rgba(14,15,15,0.5)]">
      <header className="space-y-3">
        <p className="text-ink-soft text-xs font-semibold tracking-[0.24em] uppercase">
          Diagnostyka i guardraile
        </p>
        <h2 className="font-display text-ink text-3xl">Stabilizujemy i mierzymy każdy obszar</h2>
        <p className="text-ink-soft text-sm leading-relaxed">
          Zapisz jedno spowolnienie dziennie, dobierz guardrail i określ, jak zweryfikujesz
          rezultat.
        </p>
      </header>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {diagnostics.map((item) => (
          <article
            key={item.label}
            className="border-ink-soft rounded-[1.75rem] border bg-[rgba(255,255,255,0.92)] p-6"
          >
            <h3 className="text-ink text-base font-semibold">{item.label}</h3>
            <p className="text-ink-soft mt-2 text-sm leading-relaxed">{item.description}</p>
            <Link
              href={item.href}
              className="text-jade mt-4 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#245345]"
            >
              Robię to teraz
              <ArrowRight size={16} weight="regular" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function VerticalGrid({ verticals }: Pick<HomeLandingViewModel, "verticals">) {
  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="text-ink-soft text-xs font-semibold tracking-[0.24em] uppercase">
          Clarivum Skin · Fuel · Habits
        </p>
        <h2 className="font-display text-ink text-3xl">Wejdź w pion z planem</h2>
        <p className="text-ink-soft text-sm leading-relaxed">
          Każdy kafel odwzorowuje sitemapę i CTA z docs/PRDs/first_configuration.md — kliknij
          roadmapę, narzędzia i przewodniki dopasowane do Twojego celu.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-3">
        {verticals.map((vertical) => (
          <article
            key={vertical.key}
            className="border-ink-soft bg-snow rounded-[2rem] border p-6 shadow-[0_30px_55px_-45px_rgba(14,15,15,0.45)]"
            style={{
              borderColor: `${vertical.accent}`,
              boxShadow: `0 35px 60px -50px ${vertical.accent}`,
            }}
          >
            <p className="text-ink-soft text-xs font-semibold tracking-[0.22em] uppercase">
              {vertical.tagline}
            </p>
            <h3 className="font-display text-ink mt-3 text-2xl tracking-[0.12em] uppercase">
              {vertical.key}
            </h3>
            <p className="text-ink-soft mt-4 text-sm leading-relaxed">{vertical.description}</p>
            <div className="text-ink-soft mt-5 space-y-2 text-sm">
              {vertical.categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${vertical.key}/${category.slug}`}
                  className="hover:text-jade flex items-center gap-2 transition"
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: vertical.accent }}
                  />
                  {category.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href={vertical.primaryCta.href}
                className="bg-jade text-snow inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition hover:bg-[#245345]"
              >
                {vertical.primaryCta.label}
                <ArrowRight size={16} weight="regular" aria-hidden="true" />
              </Link>
              <Link
                href={vertical.secondaryCta.href}
                className="border-ink-soft text-ink hover:border-jade hover:text-jade inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition"
              >
                {vertical.secondaryCta.label}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LearningMoments({ learningMoments }: Pick<HomeLandingViewModel, "learningMoments">) {
  return (
    <section className="border-ink-soft bg-snow rounded-[2.5rem] border p-8 shadow-[0_40px_65px_-55px_rgba(14,15,15,0.5)]">
      <header className="space-y-3">
        <p className="text-ink-soft text-xs font-semibold tracking-[0.24em] uppercase">
          Ops · Kaizen · Metsa
        </p>
        <h2 className="font-display text-ink text-3xl">
          Dokumentujemy guardrails i mikro-learnings
        </h2>
        <p className="text-ink-soft text-sm leading-relaxed">
          Te moduły wymienisz na CMS, gdy Strapi (TSK-SHARED-003) dowiezie treści. Do tego czasu
          utrzymujemy ręczne sloty mapujące runbooki i playbooki.
        </p>
      </header>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {learningMoments.map((item) => (
          <article
            key={item.title}
            className="border-ink-soft text-ink-soft rounded-[1.75rem] border bg-[rgba(255,255,255,0.92)] p-6 text-sm"
          >
            <h3 className="text-ink text-base font-semibold">{item.title}</h3>
            <p className="mt-2 leading-relaxed">{item.summary}</p>
            <Link
              href={item.href}
              className="text-jade mt-4 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#245345]"
            >
              Czytam teraz
              <ArrowRight size={16} weight="regular" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function getPillarAccent(area: "skin" | "fuel" | "habits"): string {
  switch (area) {
    case "skin":
      return "var(--color-skin-teal)";
    case "fuel":
      return "var(--color-fuel-amber)";
    case "habits":
      return "var(--color-habits-indigo)";
    default:
      return "var(--color-jade)";
  }
}
