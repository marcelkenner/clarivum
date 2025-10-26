import Link from "next/link";
import { notFound } from "next/navigation";

import { createVerticalExperienceCoordinator } from "@/app/_vertical-experience/coordinator/VerticalExperienceCoordinator";
import { listCategories } from "@/lib/content-map";

import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: { vertical: string };
}

export default function VerticalLayout({ children, params }: LayoutProps) {
  const coordinator = createVerticalExperienceCoordinator();
  const model = coordinator.buildVerticalHub({ vertical: params.vertical });

  if (!model) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:px-0">
      <aside className="lg:w-64">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Clarivum / {model.key.toUpperCase()}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{model.headline}</h1>
        <p className="mt-2 text-sm text-slate-500">{model.description}</p>

        <div className="mt-6 space-y-1 text-sm">
          {listCategories(model.key).map((category) => (
            <Link
              key={category.slug}
              href={`/${model.key}/${category.slug}`}
              className="block rounded-full px-3 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
