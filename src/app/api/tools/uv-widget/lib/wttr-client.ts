import type { LocaleLanguage, WttrResponse } from "./types";

const WTTR_BASE_URL = process.env["WTTR_BASE_URL"] ?? "https://wttr.in";
const DEFAULT_REVALIDATE_SECONDS = 300;
const DEFAULT_TIMEOUT_MS = 4500;

const USER_AGENT = "clarivum-uv-widget/1.0 (+https://clarivum.com)";

function encodeCityForPath(city: string) {
  return city.trim().replace(/\s+/g, "+").replace(/[,]+/g, "+");
}

function buildUrl(input: {
  language: LocaleLanguage;
  location?: { latitude: number; longitude: number };
  cityQuery?: string;
  revalidateSeconds?: number;
}) {
  const params = new URLSearchParams();
  params.set("format", "j1");
  params.set("num_of_days", "1");
  params.set("lang", input.language);

  const locationSegment =
    input.cityQuery !== undefined
      ? encodeCityForPath(input.cityQuery)
      : input.location !== undefined
        ? `${input.location.latitude.toFixed(4)},${input.location.longitude.toFixed(4)}`
        : "";

  return {
    url: `${WTTR_BASE_URL}/${locationSegment}?${params.toString()}`,
    revalidate: input.revalidateSeconds ?? DEFAULT_REVALIDATE_SECONDS,
  };
}

export async function fetchWttrForecast(input: {
  language: LocaleLanguage;
  location?: { latitude: number; longitude: number };
  cityQuery?: string;
  revalidateSeconds?: number;
  timeoutMs?: number;
}): Promise<WttrResponse> {
  const { url, revalidate } = buildUrl(input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "user-agent": USER_AGENT,
        accept: "application/json",
        "accept-language": input.language,
      },
      next: { revalidate },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`wttr_response_not_ok:${response.status}`);
    }

    return (await response.json()) as WttrResponse;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error("wttr_request_timeout");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
