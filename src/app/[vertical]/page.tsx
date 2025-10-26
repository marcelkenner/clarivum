import { notFound } from "next/navigation";

import { createVerticalExperienceCoordinator } from "@/app/_vertical-experience/coordinator/VerticalExperienceCoordinator";
import { VerticalHubView } from "@/app/_vertical-experience/view/VerticalViews";
import { allVerticals } from "@/lib/content-map";

import type { Metadata } from "next";

export const revalidate = 60 * 60 * 24;

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

  return {
    title: `${model.key.toUpperCase()} · Clarivum`,
    description: model.description,
  };
}

export default function VerticalHubPage({ params }: { params: { vertical: string } }) {
  const coordinator = createVerticalExperienceCoordinator();
  const viewModel = coordinator.buildVerticalHub({ vertical: params.vertical });

  if (!viewModel) {
    notFound();
  }

  return <VerticalHubView model={viewModel} />;
}
