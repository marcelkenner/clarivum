import Link from "next/link";

import type {
  ArticleViewModel,
  CategoryHubViewModel,
  VerticalHubViewModel,
} from "../viewmodel/VerticalViewModels";
import type { ReactNode } from "react";

type Breadcrumb = { label: string; href: string };

interface BreadcrumbProps {
  items: Breadcrumb[];
}

export function BreadcrumbTrail({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Jesteś tutaj" className="text-sm text-slate-500">
      <ol className="flex flex-wrap gap-1">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            <Link href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ViewSection({ title, description, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm shadow-slate-100/30">
      <div className="space-y-2 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description ? <p className="text-sm text-slate-500">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

interface ActionGroupProps {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

function ActionGroup({ primary, secondary }: ActionGroupProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={primary.href}
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        {primary.label}
      </Link>
      <Link
        href={secondary.href}
        className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
      >
        {secondary.label}
      </Link>
    </div>
  );
}

export function VerticalHubView({ model }: { model: VerticalHubViewModel }) {
  return (
    <div className="space-y-8">
      <header
        className="rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-sm"
        style={{ borderColor: model.accent, boxShadow: `0 10px 40px -25px ${model.accent}` }}
      >
        <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Clarivum / {model.key.toUpperCase()}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{model.headline}</h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">{model.description}</p>
        <p className="mt-4 text-xs text-slate-500">
          TODO: zamień ten blok na finalne moduły z docs/PRDs/requierments/ascii_designs.md.
        </p>
        <div className="mt-6">
          <ActionGroup primary={model.primaryCta} secondary={model.secondaryCta} />
        </div>
      </header>

      <ViewSection
        title="Priorytetowe kategorie"
        description="Podłącz JSON z CMS, kiedy Strapi dostarczy hierarchię i CTA mapping (see docs/PRDs/first_configuration.md)."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {model.categories.map((category) => (
            <li key={category.slug} className="rounded-2xl border border-slate-100 p-4">
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                {model.key} · {category.tool}
              </p>
              <Link
                href={`/${model.key}/${category.slug}`}
                className="mt-2 block text-lg font-semibold text-slate-900"
              >
                {category.label}
              </Link>
              <p className="mt-3 text-sm text-slate-500">
                TODO: wstaw opis kategorii {category.slug} (maks. 180 znaków) po akcepcie contentu.
              </p>
              <div className="mt-4 flex flex-col gap-1 text-xs text-slate-500">
                {category.posts.slice(0, 2).map((post) => (
                  <span key={post}>• {post.replaceAll("-", " ")}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </ViewSection>
    </div>
  );
}

export function CategoryHubView({
  model,
  breadcrumbs,
}: {
  model: CategoryHubViewModel;
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <div className="space-y-6">
      <BreadcrumbTrail items={breadcrumbs} />
      <header className="space-y-3 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {model.vertical.key.toUpperCase()} / narzedzie: {model.category.tool}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">{model.category.label}</h1>
        <p className="text-sm text-slate-500">
          TODO: dodaj długi opis i CTA z docs/PRDs/requierments/ascii_designs.md.
        </p>
      </header>

      <ViewSection
        title="Polecane materiały"
        description="Artykuły i sekwencje do uporządkowania wg PRD."
      >
        <ul className="space-y-3">
          {model.articles.items.map((article) => (
            <li
              key={article.slug}
              className="flex flex-col gap-1 rounded-2xl border border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{article.title}</p>
                <p className="text-xs text-slate-500">{article.slug}</p>
              </div>
              <Link
                href={article.href}
                className="text-sm font-semibold text-slate-900 hover:text-slate-600"
              >
                Zobacz -&gt;
              </Link>
            </li>
          ))}
        </ul>
      </ViewSection>
    </div>
  );
}

export function ArticleView({
  model,
  breadcrumbs,
}: {
  model: ArticleViewModel;
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <article className="space-y-6">
      <BreadcrumbTrail items={breadcrumbs} />
      <header className="space-y-3 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
        <p className="text-xs tracking-wide text-slate-500 uppercase">
          {model.vertical.key.toUpperCase()} / {model.category.label}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">{model.article.title}</h1>
        <p className="text-sm text-slate-500">
          TODO: Replace with structured content once Strapi delivers the article payload. Keep the
          CTA shelf consistent with docs/PRDs/requierments/ascii_designs.md.
        </p>
      </header>
      <ViewSection
        title="Wersja robocza"
        description="Tymczasowy korpus na diagnostyki i transkrypcje."
      >
        <div className="space-y-4 text-sm leading-relaxed text-slate-600">
          <p>
            Ten placeholder artykułu potwierdza routing dla <strong>{model.article.slug}</strong>.
            Połącz go z loaderem treści zanim ruszy kampania, żeby członkowie zobaczyli realne CTA i
            dane strukturalne.
          </p>
          <p>
            Wstaw diagnostyki, osadzenia narzędzi oraz checklisty zgodnie z makietą ASCII. Każdy
            moduł trzymaj poniżej 200 linii i przekazuj dane przez ViewModel zamiast bezpośrednich
            wywołań usług.
          </p>
        </div>
      </ViewSection>
    </article>
  );
}
