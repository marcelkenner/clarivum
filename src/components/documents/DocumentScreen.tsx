import "@/styles/document-theme.css";

import { notFound } from "next/navigation";
import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { documentSerif } from "@/lib/documents/fonts";
import { getDocument } from "@/lib/documents/get-document";

interface HeadingEntry {
  depth: number;
  text: string;
  slug: string;
}

interface DocumentScreenProps {
  root: Parameters<typeof getDocument>[0]["root"];
  slug?: string[] | undefined;
  collectionLabel: string;
  displayRoot: "docs" | "tasks" | "sisu-log";
  footerHint?: string;
}

export async function DocumentScreen({
  root,
  slug,
  collectionLabel,
  displayRoot,
  footerHint,
}: DocumentScreenProps) {
  const doc = await getDocument({ root, slug });

  if (!doc) {
    notFound();
  }

  const headings = collectHeadings(doc.content);
  const tocEntries = headings.filter((heading) => heading.depth <= 3);
  const headingQueue = [...headings];
  const components = createMarkdownComponents(headingQueue);

  const displayTitle =
    headings.find((heading) => heading.depth === 1)?.text ?? titleFromFilename(doc.relativePath);

  const breadcrumb = [collectionLabel, ...pathSegments(doc.relativePath)]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={`${documentSerif.variable} document-shell`}>
      <div className="document-stage">
        <article className="document-paper">
          <header className="document-header">
            <p className="document-breadcrumb">{breadcrumb}</p>
            <h1 className="document-title">{displayTitle}</h1>
            <p className="document-meta">
              <strong>Last updated:</strong>{" "}
              {doc.updatedAt.toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              <strong>File:</strong> {displayRoot}/{doc.relativePath}
            </p>
          </header>

          <div className="document-grid">
            <div className="document-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {doc.content}
              </ReactMarkdown>

              <footer className="document-footer">
                <span>
                  {footerHint ??
                    `Update ${displayRoot}/${doc.relativePath} to change this content.`}
                </span>
                <span>Size: {(doc.bytes / 1024).toFixed(1)} KB</span>
              </footer>
            </div>

            {tocEntries.length > 0 ? (
              <aside className="document-toc">
                <h3>Sections</h3>
                <ul>
                  {tocEntries.map((entry) => (
                    <li key={entry.slug} data-depth={entry.depth}>
                      <a href={`#${entry.slug}`}>{entry.text}</a>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  );
}

function collectHeadings(markdown: string): HeadingEntry[] {
  const regex = /^(#{1,6})\s+(.+)$/gm;
  const entries: HeadingEntry[] = [];
  const counts = new Map<string, number>();

  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    const [, hashes, title] = match;
    if (!hashes || !title) {
      continue;
    }

    const depth = hashes.length;
    const text = title.trim();

    if (!text) {
      continue;
    }

    const base = slugify(text);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    const slugValue = count > 0 ? `${base}-${count}` : base;

    entries.push({ depth, text, slug: slugValue });
  }

  return entries;
}

function createMarkdownComponents(queue: HeadingEntry[]): Components {
  const fallbackCounts = new Map<string, number>();

  const getNextId = (text: string) => {
    if (queue.length > 0) {
      const next = queue.shift();
      if (next) {
        return next.slug;
      }
    }

    const base = slugify(text);
    const count = fallbackCounts.get(base) ?? 0;
    fallbackCounts.set(base, count + 1);
    return count > 0 ? `${base}-${count}` : base;
  };

  const components: Components = {
    h1({ children, ...props }: ComponentPropsWithoutRef<"h1">) {
      const id = getNextId(extractText(children));
      return (
        <h1 id={id} {...props}>
          {children}
        </h1>
      );
    },
    h2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
      const id = getNextId(extractText(children));
      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      );
    },
    h3({ children, ...props }: ComponentPropsWithoutRef<"h3">) {
      const id = getNextId(extractText(children));
      return (
        <h3 id={id} {...props}>
          {children}
        </h3>
      );
    },
    h4({ children, ...props }: ComponentPropsWithoutRef<"h4">) {
      const id = getNextId(extractText(children));
      return (
        <h4 id={id} {...props}>
          {children}
        </h4>
      );
    },
    h5({ children, ...props }: ComponentPropsWithoutRef<"h5">) {
      const id = getNextId(extractText(children));
      return (
        <h5 id={id} {...props}>
          {children}
        </h5>
      );
    },
    h6({ children, ...props }: ComponentPropsWithoutRef<"h6">) {
      const id = getNextId(extractText(children));
      return (
        <h6 id={id} {...props}>
          {children}
        </h6>
      );
    },
    a({ children, href, ...props }: ComponentPropsWithoutRef<"a">) {
      const isExternal = href ? /^https?:\/\//.test(href) : false;
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },
  };

  return components;
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/(^-|-$)/g, "")
      .trim() || "section"
  );
}

function extractText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement<{ children?: ReactNode }>(child)) {
        return extractText(child.props.children);
      }

      return "";
    })
    .join(" ")
    .trim();
}

function titleFromFilename(pathname: string) {
  const filename = pathname.split("/").pop() ?? "";
  return filename
    .replace(/\.mdx?$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(^\w)|(\s\w)/g, (match) => match.toUpperCase())
    .trim();
}

function pathSegments(relativePath: string) {
  return relativePath
    .replace(/\.mdx?$/i, "")
    .split("/")
    .map(capitalizeSegment);
}

function capitalizeSegment(segment: string) {
  if (!segment) {
    return segment;
  }

  return segment
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
