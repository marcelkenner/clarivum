import { notFound } from "next/navigation";

import { createVerticalExperienceCoordinator } from "@/app/_vertical-experience/coordinator/VerticalExperienceCoordinator";
import { CategoryHubView } from "@/app/_vertical-experience/view/VerticalViews";
import { buildBreadcrumbs } from "@/app/_vertical-experience/viewmodel/VerticalViewModels";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  buildCategoryHubMetadata,
  buildCategoryHubStructuredData,
} from "@/lib/seo/routes/vertical-category";

import type { Metadata } from "next";

export const revalidate = 86400;

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

  return buildCategoryHubMetadata(model);
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

  const structuredData = buildCategoryHubStructuredData(model);

  return (
    <>
      <JsonLd
        id={`clarivum-${model.vertical.key}-${model.category.slug}`}
        data={structuredData.webPage}
      />
      <JsonLd
        id={`clarivum-${model.vertical.key}-${model.category.slug}-breadcrumbs`}
        data={structuredData.breadcrumb}
      />
      <JsonLd
        id={`clarivum-${model.vertical.key}-${model.category.slug}-list`}
        data={structuredData.itemList}
      />
      <CategoryHubView model={model} breadcrumbs={breadcrumbs} />
    </>
  );
}
