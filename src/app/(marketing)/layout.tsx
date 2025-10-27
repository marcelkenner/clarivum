import { MagnifyingGlass, ShoppingCart, UserCircle } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { createContentLibrary } from "@/app/_vertical-experience/manager/ContentLibrary";

import type { ReactNode } from "react";

const contentLibrary = createContentLibrary();

const primaryNav = [
  { label: "Skin", href: "/skin", accent: "skin" },
  { label: "Fuel", href: "/fuel", accent: "fuel" },
  { label: "Habits", href: "/habits", accent: "habits" },
  { label: "Narzędzia", href: "/narzedzia" },
  { label: "Ebooki", href: "/ebooks" },
  { label: "Blog", href: "/blog" },
  { label: "O nas", href: "/docs/PRDs/clarivum_brand.md" },
];

const utilityLinks = [
  { label: "Metodologia", href: "/docs/PRDs/seo-foundation.md" },
  { label: "Jak zarabiamy", href: "/docs/PRDs/clarivum_brand.md#monetization" },
  { label: "Kontakt", href: "/docs/PRDs/clarivum_brand.md#contact" },
];

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const highlights = contentLibrary.listHighlights(3);

  return (
    <div className="bg-beige flex min-h-screen flex-col">
      <header
        className="border-ink-soft sticky top-0 z-50 border-b backdrop-blur-lg"
        style={{ backgroundColor: "rgba(237, 230, 218, 0.95)" }}
      >
        <div className="mx-auto flex w-full max-w-[120ch] items-center gap-6 px-4 py-4 lg:px-8">
          <Link
            href="/"
            className="text-jade hover:text-jade flex items-center gap-2 transition"
            aria-label="Clarivum — nauka w praktyce"
          >
            <span className="font-display text-2xl tracking-[0.18em]">CLARIVUM</span>
            <span className="border-jade text-jade rounded-full border px-2 py-[0.3rem] text-xs font-semibold tracking-[0.18em] uppercase">
              Tools First
            </span>
          </Link>
          <nav aria-label="Główna nawigacja" className="hidden flex-1 lg:block">
            <ul className="text-ink-soft flex flex-wrap items-center gap-5 text-sm font-semibold tracking-[0.12em] uppercase">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group hover:text-ink inline-flex items-center gap-2 transition"
                  >
                    <AccentDot accent={item.accent} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-ink ml-auto flex items-center gap-3 text-sm font-semibold tracking-[0.12em] uppercase">
            <Link
              href="/szukaj"
              className="border-ink-soft hover:border-jade hover:text-jade inline-flex items-center gap-2 rounded-full border px-3 py-1 transition"
            >
              <MagnifyingGlass size={20} weight="regular" aria-hidden="true" />
              <span className="hidden sm:inline">Szukaj</span>
            </Link>
            <Link
              href="/konto"
              className="border-ink-soft hover:border-jade hover:text-jade inline-flex h-8 w-8 items-center justify-center rounded-full border transition"
              aria-label="Strefa klientki"
            >
              <UserCircle size={20} weight="regular" aria-hidden="true" />
            </Link>
            <Link
              href="/koszyk"
              className="border-ink-soft hover:border-jade hover:text-jade inline-flex h-8 w-8 items-center justify-center rounded-full border transition"
              aria-label="Koszyk Clarivum"
            >
              <ShoppingCart size={20} weight="regular" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div
          className="text-ink-soft mx-auto hidden w-full max-w-[120ch] items-center justify-between gap-4 border-t px-4 py-2 text-xs font-medium tracking-[0.16em] uppercase lg:flex"
          style={{ borderColor: "rgba(14, 15, 15, 0.18)" }}
        >
          <span className="flex items-center gap-3">
            <span className="text-ink font-semibold">Szybkie skróty:</span>
            <Link href="/narzedzia" className="hover:text-jade transition">
              Narzędzia
            </Link>
            <Link href="/ebooks" className="hover:text-jade transition">
              Ebooki
            </Link>
            <Link href="/library" className="hover:text-jade transition">
              Biblioteka
            </Link>
          </span>
          <span className="flex items-center gap-3">
            {utilityLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-jade transition">
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className="border-ink-soft text-ink hover:border-jade hover:text-jade inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition"
              aria-label="Zarządzaj cookies"
            >
              CMP
            </button>
          </span>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <div className="mx-auto w-full max-w-[120ch] px-4 pt-10 pb-20 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="border-ink-soft bg-beige-soft mt-auto border-t">
        <div className="text-ink-soft mx-auto flex w-full max-w-[120ch] flex-col gap-6 px-4 py-10 text-sm md:flex-row md:items-start md:justify-between md:px-8">
          <div className="space-y-2">
            <p className="font-display text-ink text-xl tracking-[0.18em] uppercase">Clarivum</p>
            <p className="max-w-md text-sm leading-relaxed">
              Treści Clarivum mają charakter edukacyjny i nie stanowią porady medycznej,
              dietetycznej ani psychologicznej. W razie wątpliwości skontaktuj się ze specjalistą.
            </p>
            <p className="text-ink-soft text-xs tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} Clarivum · Tools-first wellness
            </p>
          </div>
          <div className="grid gap-2 text-sm">
            <Link href="/docs/policies/security-baseline.md" className="hover:text-jade transition">
              Polityka prywatności
            </Link>
            <Link
              href="/docs/policies/medical-disclaimer.md"
              className="hover:text-jade transition"
            >
              Disclaimer medyczny
            </Link>
            <Link
              href="/docs/PRDs/clarivum_brand.md#monetization"
              className="hover:text-jade transition"
            >
              Jak zarabiamy
            </Link>
            <Link href="/docs/PRDs/brand_design_system.md" className="hover:text-jade transition">
              Brand design system
            </Link>
            <Link href="/sisu-log" className="hover:text-jade transition">
              Sisu log
            </Link>
          </div>
          <div className="grid gap-3 text-sm">
            <p className="text-ink text-xs font-semibold tracking-[0.18em] uppercase">Na skróty</p>
            {highlights.map((highlight) => (
              <Link
                key={highlight.key}
                href={`/${highlight.key}`}
                className="text-ink hover:text-jade inline-flex items-center gap-2 transition"
              >
                <AccentDot accent={highlight.narrative.accent} />
                {highlight.narrative.tagline}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function AccentDot({ accent }: { accent?: string | undefined }) {
  if (!accent) {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: "rgba(46, 107, 90, 0.35)" }}
      />
    );
  }

  if (accent === "skin") {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-skin-teal)]"
      />
    );
  }

  if (accent === "fuel") {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-fuel-amber)]"
      />
    );
  }

  if (accent === "habits") {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-habits-indigo)]"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: accent }}
    />
  );
}
