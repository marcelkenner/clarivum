import { DocumentScreen } from "@/components/documents/DocumentScreen";
import { assertInternalDocsAccess } from "@/lib/documents/access";
import { PageParamsResolver } from "@/lib/next/params/PageParamsResolver";

export const revalidate = 300;

type DocsRouteParams = { slug?: string[] };

export default async function DocsRoute({
  params,
}: { params: Promise<DocsRouteParams> }) {
  assertInternalDocsAccess();
  const { slug } = await PageParamsResolver.from<DocsRouteParams>(params).resolve();

  return (
    <DocumentScreen
      root="docs"
      slug={slug}
      collectionLabel="PRDs · ADRs"
      displayRoot="docs"
      footerHint="Docs render with the Atrament typography styles. Commit updates under docs/ to change this view."
    />
  );
}
