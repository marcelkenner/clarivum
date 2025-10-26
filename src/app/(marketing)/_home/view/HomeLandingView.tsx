import Link from "next/link";

import type { HomeLandingViewModel } from "../viewmodel/HomeViewModel";

export function HomeLandingView({ viewModel }: { viewModel: HomeLandingViewModel }) {
  return (
    <div className="space-y-10">
      <Hero {...viewModel.hero} />
      <Diagnostics diagnostics={viewModel.diagnostics} />
      <VerticalGrid verticals={viewModel.verticals} />
      <LearningMoments learningMoments={viewModel.learningMoments} />
    </div>
  );
}

function Hero(props: HomeLandingViewModel["hero"]) {
  return (
    <header className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 shadow-sm">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {props.eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-900">{props.headline}</h1>
      <p className="mt-4 max-w-3xl text-base text-slate-600">{props.subheading}</p>
      <p className="mt-4 text-xs text-slate-500">
        TODO: podmień hero na finalny moduł z docs/PRDs/requierments/ascii_designs.md i pilnuj, żeby
        CTA pozostały zgodne z akceptem marketingu.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={props.primaryCta.href}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {props.primaryCta.label}
        </Link>
        <Link
          href={props.secondaryCta.href}
          className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
        >
          {props.secondaryCta.label}
        </Link>
      </div>
    </header>
  );
}

function Diagnostics({ diagnostics }: Pick<HomeLandingViewModel, "diagnostics">) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      <div className="flex flex-col gap-2 pb-4">
        <h2 className="text-xl font-semibold text-slate-900">Diagnostyka i guardraile</h2>
        <p className="text-sm text-slate-500">
          Każdego dnia wpisuję spowolnienie, ustawiam guardrail i wiem, jak sprawdzę efekt.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {diagnostics.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-100 p-4">
            <h3 className="text-base font-semibold text-slate-900">{item.label}</h3>
            <p className="mt-2 text-sm text-slate-500">{item.description}</p>
            <Link
              href={item.href}
              className="mt-4 inline-flex text-sm font-semibold text-slate-900 hover:text-slate-600"
            >
              Robię to teraz -&gt;
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function VerticalGrid({ verticals }: Pick<HomeLandingViewModel, "verticals">) {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Skin · Fuel · Habits</h2>
        <p className="text-sm text-slate-500">
          Każdy kafel odwzorowuje sitemapę z docs/PRDs/first_configuration.md i wskazuje CTA dla
          danego verticalu.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        {verticals.map((vertical) => (
          <article
            key={vertical.key}
            className="rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm"
            style={{
              borderColor: vertical.accent,
              boxShadow: `0 10px 35px -30px ${vertical.accent}`,
            }}
          >
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              {vertical.tagline}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {vertical.key.toUpperCase()}
            </h3>
            <p className="mt-3 text-sm text-slate-600">{vertical.description}</p>
            <div className="mt-4 space-y-2 text-xs text-slate-500">
              {vertical.categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${vertical.key}/${category.slug}`}
                  className="flex items-center gap-2"
                >
                  <span
                    className="inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: vertical.accent }}
                  />
                  <span>{category.label}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={vertical.primaryCta.href}
                className="rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-700"
              >
                {vertical.primaryCta.label}
              </Link>
              <Link
                href={vertical.secondaryCta.href}
                className="rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-900 hover:border-slate-900"
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
    <section className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Ops i momenty nauki</h2>
        <p className="text-sm text-slate-500">
          Tymczasowe moduły redakcyjne — wymień je na sloty z CMS, gdy Strapi (TSK-SHARED-003)
          dostarczy bazę.
        </p>
      </header>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {learningMoments.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-100 p-4">
            <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{item.summary}</p>
            <Link
              href={item.href}
              className="mt-4 inline-flex text-sm font-semibold text-slate-900 hover:text-slate-600"
            >
              Czytam teraz -&gt;
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
