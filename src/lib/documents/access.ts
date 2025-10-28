import { notFound } from "next/navigation";

/**
 * Ensures that internal documentation surfaces are hidden in production by default.
 * Set INTERNAL_DOCS_ALLOW to "true" to intentionally expose these routes (e.g., on previews).
 */
export function assertInternalDocsAccess() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (process.env["INTERNAL_DOCS_ALLOW"]?.toLowerCase() === "true") {
    return;
  }

  notFound();
}
