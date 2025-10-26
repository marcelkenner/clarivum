import Link from "next/link";

import { createContentLibrary } from "@/app/_vertical-experience/manager/ContentLibrary";

import type { ReactNode } from "react";

const contentLibrary = createContentLibrary();

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const nav = contentLibrary.listHighlights(3);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 lg:px-0">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Clarivum
          </Link>
          <p className="text-xs tracking-wide text-slate-500 uppercase">
            Clarivum Skin · Clarivum Fuel · Clarivum Habits
          </p>
        </div>
        <nav aria-label="Global">
          <ul className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            {nav.map((item) => (
              <li key={item.key}>
                <Link href={`/${item.key}`} className="hover:text-slate-900">
                  {item.key}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/narzedzia" className="hover:text-slate-900">
                Narzędzia
              </Link>
            </li>
            <li>
              <Link href="/ebooks" className="hover:text-slate-900">
                Ebooki
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-slate-900">
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/library"
                className="rounded-full border border-slate-300 px-4 py-1 text-slate-900 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
              >
                Biblioteka
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-slate-100 pt-6 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} Clarivum. TODO: podmień na finalny footer prawny z
          docs/PRDs/clarivum_brand.md.
        </p>
      </footer>
    </div>
  );
}
