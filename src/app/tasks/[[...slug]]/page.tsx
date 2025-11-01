import { DocumentScreen } from "@/components/documents/DocumentScreen";
import { assertInternalDocsAccess } from "@/lib/documents/access";
import { PageParamsResolver } from "@/lib/next/params/PageParamsResolver";

export const revalidate = 300;

type TasksRouteParams = { slug?: string[] };

export default async function TasksRoute({
  params,
}: { params: Promise<TasksRouteParams> }) {
  assertInternalDocsAccess();
  const { slug } = await PageParamsResolver.from<TasksRouteParams>(params).resolve();

  return (
    <DocumentScreen
      root="tasks"
      slug={slug}
      collectionLabel="Tasks · Boards"
      displayRoot="tasks"
      footerHint="Guardrail: task docs must reflect the latest Kaizen and Sisu updates before merge."
    />
  );
}
