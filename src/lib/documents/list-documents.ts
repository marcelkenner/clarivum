import { promises as fs } from "node:fs";
import path from "node:path";

import type { DocumentRoot } from "./get-document";

export interface DocumentSummary {
  id: string;
  root: DocumentRoot;
  relativePath: string;
  title: string;
  updatedAt: Date;
  bytes: number;
}

const allowedExtensions = new Set([".md", ".mdx"]);
const rootDirectories: Record<DocumentRoot, string> = {
  docs: path.join(process.cwd(), "docs"),
  tasks: path.join(process.cwd(), "tasks"),
  "sisu-log": path.join(process.cwd(), "sisu-log"),
};
const cacheDirectory = path.join(process.cwd(), ".next", "cache", "clarivum");
const cacheFile = path.join(cacheDirectory, "documents.json");
const runtimeCache = new Map<string, DocumentSummary[]>();

interface CachedDocumentSummary extends Omit<DocumentSummary, "updatedAt"> {
  updatedAt: string;
}

export async function listDocuments(): Promise<DocumentSummary[]> {
  const cacheKey = "default";
  const runtime = runtimeCache.get(cacheKey);
  if (runtime) {
    return runtime;
  }

  const cached = await readCachedDocuments();
  if (cached) {
    runtimeCache.set(cacheKey, cached);
    return cached;
  }

  const entries = await Promise.all(
    (Object.keys(rootDirectories) as DocumentRoot[]).map((root) => gatherRootDocuments(root)),
  );

  const flattened = entries.flat().sort((a, b) => {
    if (a.root !== b.root) {
      return a.root.localeCompare(b.root);
    }
    return a.relativePath.localeCompare(b.relativePath);
  });

  runtimeCache.set(cacheKey, flattened);
  persistDocuments(flattened).catch(() => {});

  return flattened;
}

async function gatherRootDocuments(root: DocumentRoot) {
  const rootDir = rootDirectories[root];
  return gatherWithinDirectory(root, rootDir, "");
}

async function gatherWithinDirectory(
  root: DocumentRoot,
  absoluteDir: string,
  relativeDir: string,
): Promise<DocumentSummary[]> {
  const dirents = await fs.readdir(absoluteDir, { withFileTypes: true });
  const summaries: DocumentSummary[] = [];

  for (const entry of dirents) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const relativePath = path.posix.join(relativeDir, entry.name).replace(/\\/g, "/");
    const absolutePath = path.join(absoluteDir, entry.name);

    if (entry.isDirectory()) {
      const nested = await gatherWithinDirectory(root, absolutePath, relativePath);
      summaries.push(...nested);
      continue;
    }

    if (!allowedExtensions.has(path.extname(entry.name).toLowerCase())) {
      continue;
    }

    const stats = await fs.stat(absolutePath);
    const title = await extractTitle(absolutePath, relativePath);

    summaries.push({
      id: `${root}:${relativePath}`,
      root,
      relativePath,
      title,
      updatedAt: stats.mtime,
      bytes: stats.size,
    });
  }

  return summaries;
}

async function extractTitle(absolutePath: string, fallback: string) {
  try {
    const source = await fs.readFile(absolutePath, "utf8");
    const heading = source.match(/^#\s+(.+)$/m);
    if (heading?.[1]) {
      return heading[1].trim();
    }
  } catch {
    // ignore
  }

  return (
    fallback
      .replace(/\.mdx?$/i, "")
      .split("/")
      .pop()
      ?.replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/(^\w)|(\s\w)/g, (token) => token.toUpperCase())
      .trim() ?? fallback
  );
}

async function readCachedDocuments(): Promise<DocumentSummary[] | null> {
  try {
    const raw = await fs.readFile(cacheFile, "utf8");
    const payload = JSON.parse(raw) as CachedDocumentSummary[];
    if (!Array.isArray(payload)) {
      return null;
    }

    return payload.map((doc) => ({
      ...doc,
      updatedAt: new Date(doc.updatedAt),
    }));
  } catch {
    return null;
  }
}

async function persistDocuments(documents: DocumentSummary[]) {
  try {
    const payload: CachedDocumentSummary[] = documents.map((doc) => ({
      ...doc,
      updatedAt: doc.updatedAt.toISOString(),
    }));
    await fs.mkdir(cacheDirectory, { recursive: true });
    await fs.writeFile(cacheFile, JSON.stringify(payload, null, 2), "utf8");
  } catch {
    // best-effort cache; ignore failures (e.g., read-only FS)
  }
}
