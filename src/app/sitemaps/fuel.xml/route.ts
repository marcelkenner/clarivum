import { xmlWrap, verticalUrls } from "../_utils";

export const revalidate = 86400;

export async function GET() {
  return new Response(xmlWrap(verticalUrls("fuel")), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
