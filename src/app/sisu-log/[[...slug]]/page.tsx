import { DocumentScreen } from "@/components/documents/DocumentScreen";

export const revalidate = 300;

export default function SisuLogRoute({ params }: { params: { slug?: string[] } }) {
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
