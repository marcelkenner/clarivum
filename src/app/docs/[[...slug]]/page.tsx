import { DocumentScreen } from "@/components/documents/DocumentScreen";
import { assertInternalDocsAccess } from "@/lib/documents/access";

export const revalidate = 300;

export default function DocsRoute({ params }: { params: { slug?: string[] } }) {
  assertInternalDocsAccess();

  return (
    <DocumentScreen
      root="docs"
      slug={params.slug}
      collectionLabel="PRDs · ADRs"
      displayRoot="docs"
      footerHint="Docs render with the Atrament typography styles. Commit updates under docs/ to change this view."
    />
  );
}
