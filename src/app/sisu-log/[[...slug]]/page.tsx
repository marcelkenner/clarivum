import { DocumentScreen } from "@/components/documents/DocumentScreen";
import { assertInternalDocsAccess } from "@/lib/documents/access";

export const revalidate = 300;

export default function SisuLogRoute({ params }: { params: { slug?: string[] } }) {
  assertInternalDocsAccess();

  return (
    <DocumentScreen
      root="sisu-log"
      slug={params.slug}
      collectionLabel="Sisu Log"
      displayRoot="sisu-log"
      footerHint="Remember: Sisu notes stay append-only. Edit only to correct links or owners."
    />
  );
}
