import "@/styles/document-theme.css";

import { DocumentIndex } from "@/components/documents/DocumentIndex";
import { documentSerif } from "@/lib/documents/fonts";
import { listDocuments } from "@/lib/documents/list-documents";

export const revalidate = 300;

export default async function LibraryPage() {
  const documents = await listDocuments();

  return (
    <div className={`${documentSerif.variable} document-shell`}>
      <div className="document-stage">
        <article className="document-paper">
          <DocumentIndex documents={documents} />
        </article>
      </div>
    </div>
  );
}
