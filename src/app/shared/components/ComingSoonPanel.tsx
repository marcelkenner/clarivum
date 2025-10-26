import Link from "next/link";

interface ComingSoonPanelProps {
  title: string;
  description: string;
  checklist: string[];
  docsLink?: { href: string; label: string };
}

export function ComingSoonPanel({ title, description, checklist, docsLink }: ComingSoonPanelProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-8 text-slate-700">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Wersja robocza</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-600">{description}</p>
      <p className="mt-3 text-xs text-slate-500">
        TODO: zamień tę sekcję na realne treści, gdy Strapi (TSK-SHARED-003) i SEO governance
        (TSK-SEO-002) dowiozą platformę.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {checklist.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span
              className="mt-1 inline-flex h-2 w-2 rounded-full bg-slate-900"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {docsLink ? (
        <Link
          href={docsLink.href}
          className="mt-5 inline-flex text-sm font-semibold text-slate-900 hover:text-slate-600"
        >
          {docsLink.label} -&gt;
        </Link>
      ) : null}
    </div>
  );
}
