import { notFound } from "next/navigation";

import { createVerticalExperienceCoordinator } from "@/app/_vertical-experience/coordinator/VerticalExperienceCoordinator";
import { VerticalHubView } from "@/app/_vertical-experience/view/VerticalViews";
import { allVerticals } from "@/lib/content-map";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  buildVerticalHubMetadata,
  buildVerticalHubStructuredData,
} from "@/lib/seo/routes/vertical-hub";

import type { Metadata } from "next";

export const revalidate = 86400;

export function generateStaticParams() {
  return allVerticals.map((vertical) => ({ vertical }));
}

export async function generateMetadata({
  params,
}: {
  params: { vertical: string };
}): Promise<Metadata> {
  const coordinator = createVerticalExperienceCoordinator();
  const model = coordinator.buildVerticalHub({ vertical: params.vertical });

  if (!model) {
    return {};
  }

  return buildVerticalHubMetadata(model);
}

export default function VerticalHubPage({ params }: { params: { vertical: string } }) {
  const coordinator = createVerticalExperienceCoordinator();
  const viewModel = coordinator.buildVerticalHub({ vertical: params.vertical });

  if (!viewModel) {
    notFound();
  }

  const structuredData = buildVerticalHubStructuredData(viewModel);

  return (
    <>
      <JsonLd id={`clarivum-${viewModel.key}-hub`} data={structuredData.webPage} />
      <JsonLd id={`clarivum-${viewModel.key}-hub-breadcrumbs`} data={structuredData.breadcrumb} />
      <JsonLd id={`clarivum-${viewModel.key}-hub-list`} data={structuredData.itemList} />
      <VerticalHubView model={viewModel} />
    </>
  );
}
