import { DocumentScreen } from "@/components/documents/DocumentScreen";

export const revalidate = 300;

export default function DocsRoute({ params }: { params: { slug?: string[] } }) {
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
