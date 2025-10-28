import { inferLocale } from "./locale";

import type { LocaleLanguage, ParsedRequestInput } from "./types";
import type { NextRequest } from "next/server";

const FALLBACK_COORDINATES = {
  latitude: 52.2297,
  longitude: 21.0122,
};

function parseCoordinate(value: string | null, min: number, max: number) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error("coordinate_out_of_range");
  }

  return Number(parsed.toFixed(4));
}

function normaliseCityQuery(value: string | null) {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  if (trimmed.length > 100) {
    throw new Error("city_query_too_long");
  }

  return trimmed;
}

export function parseRequestInput(request: NextRequest): ParsedRequestInput {
  const searchParams = request.nextUrl.searchParams;

  const latitudeParam = searchParams.get("lat") ?? searchParams.get("latitude");
  const longitudeParam = searchParams.get("lon") ?? searchParams.get("longitude");
  const cityParam = searchParams.get("city") ?? searchParams.get("q");
  const localeParam = searchParams.get("locale");
  const fallbackParam = searchParams.get("fallback");

  const acceptLanguage = request.headers.get("accept-language");
  const { locale, language } = inferLocale(localeParam, acceptLanguage);

  const latitude = parseCoordinate(latitudeParam, -90, 90);
  const longitude = parseCoordinate(longitudeParam, -180, 180);
  const cityQuery = normaliseCityQuery(cityParam);

  if (
    (latitude !== undefined && longitude === undefined) ||
    (longitude !== undefined && latitude === undefined)
  ) {
    throw new Error("coordinates_incomplete");
  }

  const locationCandidate =
    latitude !== undefined && longitude !== undefined
      ? { latitude, longitude }
      : cityQuery
        ? undefined
        : { ...FALLBACK_COORDINATES };

  let fallbackReason: "default" | "manual" | undefined;
  if (locationCandidate) {
    const matchesFallback =
      locationCandidate.latitude === FALLBACK_COORDINATES.latitude &&
      locationCandidate.longitude === FALLBACK_COORDINATES.longitude;
    if (matchesFallback) {
      fallbackReason = "default";
    }
  }

  if (fallbackParam === "manual") {
    fallbackReason = "manual";
  }

  const result: ParsedRequestInput = {
    locale,
    language: language as LocaleLanguage,
  };

  if (locationCandidate) {
    result.location = locationCandidate;
  }

  if (cityQuery) {
    result.cityQuery = cityQuery;
  }

  if (fallbackReason) {
    result.fallbackReason = fallbackReason;
  }

  return result;
}
