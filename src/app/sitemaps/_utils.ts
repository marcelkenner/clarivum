import { content, siteUrl } from "@/lib/content-map";

export function url(loc: string, lastmod = new Date().toISOString()) {
  return `<url><loc>${siteUrl}${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
}

export function xmlWrap(payload: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${payload}</urlset>`;
}

export function verticalUrls(vertical: keyof typeof content) {
  let items = "";
  const base = `/${vertical}`;
  for (const [categorySlug, category] of Object.entries(content[vertical].categories)) {
    items += url(`${base}/${categorySlug}/`);
    for (const post of category.posts) {
      items += url(`${base}/${categorySlug}/${post}/`);
    }
  }
  return items;
}
