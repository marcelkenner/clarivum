import { notFound } from "next/navigation";

import { createVerticalExperienceCoordinator } from "@/app/_vertical-experience/coordinator/VerticalExperienceCoordinator";
import { CategoryHubView } from "@/app/_vertical-experience/view/VerticalViews";
import { buildBreadcrumbs } from "@/app/_vertical-experience/viewmodel/VerticalViewModels";

import type { Metadata } from "next";

export const revalidate = 60 * 60 * 24;

export function generateStaticParams() {
  const coordinator = createVerticalExperienceCoordinator();
  return coordinator.collectCategoryParams();
}

export async function generateMetadata({
  params,
}: {
  params: { vertical: string; category: string };
}): Promise<Metadata> {
  const coordinator = createVerticalExperienceCoordinator();
  const model = coordinator.buildCategoryHub(params);

  if (!model) {
    return {};
  }

  return {
    title: `${model.category.label} · Clarivum ${model.vertical.key}`,
    description: `CTA + tool shelf for ${model.category.label}.`,
  };
}

export default function CategoryHubPage({
  params,
}: {
  params: { vertical: string; category: string };
}) {
  const coordinator = createVerticalExperienceCoordinator();
  const model = coordinator.buildCategoryHub(params);

  if (!model) {
    notFound();
  }

  const breadcrumbs = buildBreadcrumbs({
    vertical: model.vertical.key,
    category: model.category.slug,
  });

  return <CategoryHubView model={model} breadcrumbs={breadcrumbs} />;
}
