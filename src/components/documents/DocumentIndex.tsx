"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { DocumentRoot } from "@/lib/documents/get-document";
import type { DocumentSummary } from "@/lib/documents/list-documents";

type Props = {
  documents: DocumentSummary[];
};

const rootLabels: Record<DocumentRoot, string> = {
  docs: "Docs · PRDs · ADRs",
  tasks: "Tasks Board",
  "sisu-log": "Sisu Notes",
};

export function DocumentIndex({ documents }: Props) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalizedQuery) {
      return documents;
    }

    return documents.filter((doc) => {
      const haystack = `${doc.title} ${doc.relativePath}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [documents, normalizedQuery]);

  const grouped = useMemo(() => {
    const roots: DocumentRoot[] = ["docs", "tasks", "sisu-log"];
    return roots.map((root) => ({
      root,
      label: rootLabels[root],
      items: filtered.filter((doc) => doc.root === root),
    }));
  }, [filtered]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">Clarivum Library</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">Atrament knowledge index</h1>
          <p className="mt-3 text-base text-slate-600">
            Browse every PRD, ADR, task lane, and Sisu note with the Atrament ink treatment.
          </p>
        </div>
        <label className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10">
          <span className="text-sm font-semibold tracking-[0.3em] text-slate-400 uppercase">
            Search
          </span>
          <input
            type="search"
            placeholder="PRD, ADR, task, or Sisu note"
            className="flex-1 border-none bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className="text-xs font-semibold text-slate-500">
            {filtered.length} / {documents.length}
          </span>
        </label>
      </header>

      <div className="space-y-4">
        {grouped.map((group) => {
          if (group.items.length === 0) {
            return null;
          }

          return (
            <section
              key={group.root}
              className="rounded-3xl border border-slate-100 bg-white/80 p-5"
            >
              <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
                <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">{group.label}</p>
                <p className="text-sm text-slate-500">
                  {group.items.length} document{group.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <ul className="divide-y divide-slate-100">
                {group.items.map((doc) => (
                  <li key={doc.id}>
                    <Link
                      href={buildDocumentHref(doc)}
                      className="flex flex-col gap-1 py-4 transition hover:pl-3 hover:text-slate-900 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-base font-semibold text-slate-900">{doc.title}</p>
                        <p className="text-xs tracking-[0.25em] text-slate-400 uppercase">
                          {doc.relativePath}
                        </p>
                      </div>
                      <div className="text-xs text-slate-500 sm:text-right">
                        <p>{doc.updatedAt.toLocaleDateString("pl-PL")}</p>
                        <p>{(doc.bytes / 1024).toFixed(1)} KB</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {filtered.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-slate-500">
            No documents found. Try a different phrase or remove filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function buildDocumentHref(doc: DocumentSummary) {
  const encoded = doc.relativePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `/${doc.root}/${encoded}`;
}
