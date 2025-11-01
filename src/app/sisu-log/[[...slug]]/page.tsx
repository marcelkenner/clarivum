import { DocumentScreen } from "@/components/documents/DocumentScreen";
import { assertInternalDocsAccess } from "@/lib/documents/access";
import { PageParamsResolver } from "@/lib/next/params/PageParamsResolver";

export const revalidate = 300;

type SisuLogRouteParams = { slug?: string[] };

export default async function SisuLogRoute({ params }: { params: Promise<SisuLogRouteParams> }) {
  assertInternalDocsAccess();
  const { slug } = await PageParamsResolver.from<SisuLogRouteParams>(params).resolve();

  return (
    <DocumentScreen
      root="sisu-log"
      slug={slug}
      collectionLabel="Sisu Log"
      displayRoot="sisu-log"
      footerHint="Remember: Sisu notes stay append-only. Edit only to correct links or owners."
    />
  );
}
