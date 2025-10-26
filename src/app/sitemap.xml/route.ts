import { siteUrl } from "@/lib/content-map";

export const revalidate = 86400;

export async function GET() {
  const sitemaps = [
    "/sitemaps/pages.xml",
    "/sitemaps/skin.xml",
    "/sitemaps/fuel.xml",
    "/sitemaps/habits.xml",
  ];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    sitemaps.map((path) => `<sitemap><loc>${siteUrl}${path}</loc></sitemap>`).join("") +
    "</sitemapindex>";

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
