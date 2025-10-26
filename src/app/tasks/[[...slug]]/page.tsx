import { DocumentScreen } from "@/components/documents/DocumentScreen";

export const revalidate = 300;

export default function TasksRoute({ params }: { params: { slug?: string[] } }) {
  return (
    <DocumentScreen
      root="tasks"
      slug={params.slug}
      collectionLabel="Tasks · Boards"
      displayRoot="tasks"
      footerHint="Guardrail: task docs must reflect the latest Kaizen and Sisu updates before merge."
    />
  );
}
