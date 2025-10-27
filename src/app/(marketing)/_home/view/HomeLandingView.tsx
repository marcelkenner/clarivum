"use client";

import { ArrowRight, BookOpen, FileArrowDown, Leaf, Quotes } from "@phosphor-icons/react/ssr";
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
        <div className="container--wide container">
          <ToolsGrid tools={viewModel.tools} />
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
        <div className="container">
          <TrustStrip trust={viewModel.trust} />
        </div>
      </div>

      <div className="section section--tight">
        <div className="container--wide container">
          <EbooksStrip ebooks={viewModel.ebooks} />
        </div>
      </div>

      <div className="section section--tight">
        <div className="container--narrow container">
          <GlobalCtaStrip data={viewModel.globalCta} />
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
          Wypełnij trzy kroki w hero — pokażemy tutaj plan na 14 dni z guardrailami, narzędziami i
          materiałami do doczytania.
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
          Twój plan na start
        </p>
        <h2 className="font-display text-ink text-3xl md:text-[2.5rem]">
          {pillar.label} → {goal.label} ({plan.durationLabel})
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
            <Link
              href={item.href}
              className="text-ink hover:text-jade inline-flex items-center gap-2 transition"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ToolsGrid({ tools }: Pick<HomeLandingViewModel, "tools">) {
  return (
    <section className="border-ink-soft bg-snow rounded-[2.5rem] border p-8 shadow-[0_40px_65px_-55px_rgba(14,15,15,0.45)] md:p-10">
      <header className="space-y-3">
        <p className="text-ink-soft text-xs font-semibold tracking-[0.24em] uppercase">
          {tools.eyebrow}
        </p>
        <h2 className="font-display text-ink text-3xl md:text-[2.1rem]">{tools.headline}</h2>
        <p className="text-ink-soft text-sm leading-relaxed md:text-base">{tools.description}</p>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tools.items.map((item, index) => (
          <Link
            key={item.key}
            href={item.href}
            className="border-ink-soft text-ink hover:border-jade hover:text-jade group flex h-full flex-col justify-between gap-4 rounded-[1.75rem] border bg-[rgba(255,255,255,0.92)] p-5 transition hover:shadow-[0_24px_40px_-32px_rgba(46,107,90,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-jade"
            aria-label={`Otwórz narzędzie ${item.label}`}
          >
            <div className="space-y-2">
              <span className="text-ink-soft text-[0.7rem] font-semibold tracking-[0.22em] uppercase">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-ink text-lg font-semibold leading-tight">{item.label}</h3>
              <p className="text-ink-soft text-sm leading-relaxed">{item.description}</p>
            </div>
            <span className="text-jade inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] transition group-hover:gap-3">
              Otwórz
              <ArrowRight size={16} weight="regular" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href={tools.seeAllHref}
          className="text-ink hover:text-jade inline-flex items-center gap-2 text-sm font-semibold transition"
        >
          {tools.seeAllLabel}
          <ArrowRight size={16} weight="regular" aria-hidden="true" />
        </Link>
      </div>
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
        <h2 className="font-display text-ink text-3xl">Wybierz pion i kontynuuj plan</h2>
        <p className="text-ink-soft text-sm leading-relaxed">
          Jeden klik otwiera zestaw narzędzi, checklisty i przewodniki dla wybranego obszaru. Każdy
          pion ma gotowe wejście „Zacznij tutaj”.
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
                aria-label={`${vertical.primaryCta.label}`}
              >
                {vertical.primaryCta.label}
                <ArrowRight size={16} weight="regular" aria-hidden="true" />
              </Link>
              <Link
                href={vertical.secondaryCta.href}
                className="text-ink-soft hover:text-jade inline-flex items-center gap-2 text-sm transition"
              >
                <ArrowRight size={14} weight="regular" aria-hidden="true" />
                {vertical.secondaryCta.label}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrustStrip({ trust }: Pick<HomeLandingViewModel, "trust">) {
  return (
    <section className="border-ink-soft bg-snow rounded-[2.5rem] border p-8 shadow-[0_40px_65px_-55px_rgba(14,15,15,0.5)] md:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <header className="space-y-3 lg:max-w-md">
          <p className="text-ink-soft text-xs font-semibold tracking-[0.24em] uppercase">
            {trust.eyebrow}
          </p>
          <h2 className="font-display text-ink text-3xl">{trust.headline}</h2>
          <div className="flex flex-wrap gap-3 text-sm font-semibold uppercase tracking-[0.18em]">
            {trust.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink hover:text-jade transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </header>
        <div className="flex-1 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {trust.quotes.map((quote) => (
              <figure
                key={quote.quote}
                className="border-ink-soft rounded-[1.75rem] border bg-[rgba(255,255,255,0.92)] p-5 text-sm leading-relaxed"
              >
                <Quotes size={22} weight="fill" className="text-jade" aria-hidden="true" />
                <blockquote className="text-ink mt-2">&ldquo;{quote.quote}&rdquo;</blockquote>
                <figcaption className="text-ink-soft mt-3 text-xs font-semibold tracking-[0.18em] uppercase">
                  {quote.author}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {trust.logos.map((logo) => (
              <Link
                key={logo.href}
                href={logo.href}
                className="border-ink-soft text-ink hover:border-jade hover:text-jade inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition"
              >
                {logo.alt}
              </Link>
            ))}
          </div>
          <p className="text-ink-soft text-xs leading-relaxed">{trust.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

function EbooksStrip({ ebooks }: Pick<HomeLandingViewModel, "ebooks">) {
  return (
    <section className="border-ink-soft bg-snow rounded-[2.5rem] border p-8 shadow-[0_40px_65px_-55px_rgba(14,15,15,0.45)] md:p-10">
      <header className="space-y-3">
        <p className="text-ink-soft text-xs font-semibold tracking-[0.24em] uppercase">
          {ebooks.eyebrow}
        </p>
        <h2 className="font-display text-ink text-3xl">{ebooks.headline}</h2>
        <p className="text-ink-soft text-sm leading-relaxed md:text-base">{ebooks.description}</p>
      </header>
      <div
        className="mt-6 grid gap-4 md:grid-cols-3"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        {ebooks.items.map((ebook, index) => (
          <Link
            key={ebook.slug}
            href={ebook.href}
            className="border-ink-soft text-ink hover:border-jade hover:text-jade group flex h-full flex-col gap-4 rounded-[1.75rem] border bg-[rgba(255,255,255,0.92)] p-5 transition hover:shadow-[0_24px_40px_-32px_rgba(46,107,90,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-jade"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <meta itemProp="position" content={`${index + 1}`} />
            <div className="space-y-2">
              <span className="text-ink-soft text-[0.7rem] font-semibold tracking-[0.22em] uppercase">
                Ebook
              </span>
              <h3 className="text-ink text-lg font-semibold leading-tight" itemProp="name">
                {ebook.title}
              </h3>
              <p className="text-ink-soft text-sm leading-relaxed" itemProp="description">
                {ebook.description}
              </p>
            </div>
            <span className="text-jade inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] transition group-hover:gap-3">
              Zobacz
              <ArrowRight size={16} weight="regular" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link
          href={ebooks.seeAllHref}
          className="text-ink hover:text-jade inline-flex items-center gap-2 text-sm font-semibold transition"
        >
          {ebooks.seeAllLabel}
          <ArrowRight size={16} weight="regular" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function GlobalCtaStrip({ data }: { data: HomeLandingViewModel["globalCta"] }) {
  return (
    <section className="border-ink-soft bg-snow rounded-[2.5rem] border p-8 text-center shadow-[0_40px_65px_-55px_rgba(14,15,15,0.45)] md:p-12">
      <p className="text-ink-soft text-xs font-semibold tracking-[0.24em] uppercase">
        {data.eyebrow}
      </p>
      <h2 className="font-display text-ink mt-3 text-3xl md:text-[2.4rem]">{data.headline}</h2>
      <p className="text-ink-soft mt-4 text-base leading-relaxed md:text-lg">{data.subheading}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink
          href={data.primaryCta.href}
          variant="primary"
          iconPosition="end"
          icon={<ArrowRight size={18} weight="regular" aria-hidden="true" />}
        >
          {data.primaryCta.label}
        </ButtonLink>
        {data.secondaryCta ? (
          <ButtonLink
            href={data.secondaryCta.href}
            variant="secondary"
            iconPosition="end"
            icon={<ArrowRight size={18} weight="regular" aria-hidden="true" />}
          >
            {data.secondaryCta.label}
          </ButtonLink>
        ) : null}
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
