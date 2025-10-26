import { promises as fs } from "node:fs";
import path from "node:path";

export type DocumentRoot = "docs" | "tasks" | "sisu-log";

export interface LoadedDocument {
  content: string;
  absolutePath: string;
  relativePath: string;
  updatedAt: Date;
  bytes: number;
}

const ROOT_DIRECTORIES: Record<DocumentRoot, string> = {
  docs: path.join(process.cwd(), "docs"),
  tasks: path.join(process.cwd(), "tasks"),
  "sisu-log": path.join(process.cwd(), "sisu-log"),
};

const FALLBACK_FILES = ["README.md", "index.md"];
const SUPPORTED_EXTENSIONS = ["", ".md", ".mdx"];

interface GetDocumentParams {
  root: DocumentRoot;
  slug?: string[] | undefined;
}

export async function getDocument({
  root,
  slug,
}: GetDocumentParams): Promise<LoadedDocument | null> {
  const rootDirectory = ROOT_DIRECTORIES[root];
  const normalizedSlug = normalizeSlug(slug);

  const candidateFiles = buildCandidateFiles(rootDirectory, normalizedSlug);

  for (const candidate of candidateFiles) {
    const file = await statIfExists(candidate);
    if (!file?.isFile()) {
      continue;
    }

    const content = await fs.readFile(candidate, "utf8");
    return {
      content,
      absolutePath: candidate,
      relativePath: path.relative(rootDirectory, candidate).replace(/\\/g, "/"),
      updatedAt: file.mtime,
      bytes: file.size,
    };
  }

  return null;
}

function normalizeSlug(slug?: string[]) {
  if (!slug || slug.length === 0) {
    return "README.md";
  }

  const joined = slug.join("/");
  const normalized = path.normalize(joined);
  return normalized;
}

function buildCandidateFiles(rootDirectory: string, normalizedSlug: string) {
  const candidates: string[] = [];
  const basePath = path.join(rootDirectory, normalizedSlug);

  if (!basePath.startsWith(rootDirectory)) {
    return candidates;
  }

  const extension = path.extname(basePath);

  if (extension) {
    candidates.push(basePath);
    return candidates;
  }

  for (const supportedExtension of SUPPORTED_EXTENSIONS) {
    if (!supportedExtension) {
      continue;
    }
    candidates.push(`${basePath}${supportedExtension}`);
  }

  for (const fallback of FALLBACK_FILES) {
    candidates.push(path.join(basePath, fallback));
  }

  return candidates;
}

async function statIfExists(target: string) {
  try {
    return await fs.stat(target);
  } catch {
    return null;
  }
}
