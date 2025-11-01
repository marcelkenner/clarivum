import { notFound } from "next/navigation";

import { createVerticalExperienceCoordinator } from "@/app/_vertical-experience/coordinator/VerticalExperienceCoordinator";
import { VerticalHubView } from "@/app/_vertical-experience/view/VerticalViews";
import { allVerticals } from "@/lib/content-map";
import { PageParamsResolver } from "@/lib/next/params/PageParamsResolver";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  buildVerticalHubMetadata,
  buildVerticalHubStructuredData,
} from "@/lib/seo/routes/vertical-hub";

import type { Metadata } from "next";

type VerticalRouteParams = { vertical: string };

export const revalidate = 86400;

export function generateStaticParams() {
  return allVerticals.map((vertical) => ({ vertical }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<VerticalRouteParams>;
}): Promise<Metadata> {
  const { vertical } = await PageParamsResolver.from<VerticalRouteParams>(params).resolve();
  const coordinator = createVerticalExperienceCoordinator();
  const model = coordinator.buildVerticalHub({ vertical });

  if (!model) {
    return {};
  }

  return buildVerticalHubMetadata(model);
}

export default async function VerticalHubPage({
  params,
}: {
  params: Promise<VerticalRouteParams>;
}) {
  const { vertical } = await PageParamsResolver.from<VerticalRouteParams>(params).resolve();
  const coordinator = createVerticalExperienceCoordinator();
  const viewModel = coordinator.buildVerticalHub({ vertical });

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
