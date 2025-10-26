import { content } from "@/lib/content-map";

export const revalidate = 60 * 60;

export async function GET() {
  const items: string[] = [];

  const makeItem = (loc: string, title: string) =>
    `<item><title><![CDATA[${title}]]></title><link>${loc}</link></item>`;

  for (const vertical of Object.keys(content)) {
    const base = `https://clarivum.com/${vertical}`;
    for (const [categorySlug, category] of Object.entries(
      content[vertical as keyof typeof content].categories,
    )) {
      for (const post of category.posts) {
        items.push(makeItem(`${base}/${categorySlug}/${post}/`, post.replaceAll("-", " ")));
      }
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0"><channel><title>Clarivum RSS (placeholder)</title>` +
    items.join("") +
    `</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
