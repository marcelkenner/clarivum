import { xmlWrap, url } from "../_utils";

export const revalidate = 86400;

const STATIC_PAGES = [
  "/",
  "/ebooks/",
  "/narzedzia/",
  "/blog/",
  "/polityka-prywatnosci/",
  "/polityka-cookies/",
  "/regulamin/",
];

export async function GET() {
  const payload = STATIC_PAGES.map((path) => url(path)).join("");
  return new Response(xmlWrap(payload), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
