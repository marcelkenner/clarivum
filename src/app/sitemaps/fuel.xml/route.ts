import { xmlWrap, verticalUrls } from "../_utils";

export const revalidate = 60 * 60 * 24;

export async function GET() {
  return new Response(xmlWrap(verticalUrls("fuel")), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
