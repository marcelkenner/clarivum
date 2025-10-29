import { SpanStatusCode, trace } from "@opentelemetry/api";

import { readCache, writeCache } from "./cache";
import { loadCopyBundle } from "./copy-loader";
import { fetchWttrForecast } from "./wttr-client";

import type {
  LocaleLanguage,
  ParsedRequestInput,
  RiskLevel,
  UVWidgetCopyBundle,
  UVWidgetManagerConfig,
  UVWidgetManagerDependencies,
  UVWidgetPayload,
  WttrCurrentCondition,
  WttrNearestArea,
  WttrResponse,
  WttrWeatherDay,
} from "./types";

const tracer = trace.getTracer("clarivum.api.tools");

const DEFAULT_CONFIG: UVWidgetManagerConfig = {
  cacheTtlMs: 5 * 60 * 1000,
  fetchTimeoutMs: 4500,
  fallbackCityLabel: "Warszawa, PL",
  fallbackCoordinates: {
    latitude: 52.2297,
    longitude: 21.0122,
  },
};

type CacheStatus = "hit" | "miss" | "stale";
type CacheSource = "upstash" | "memory";

function computeRiskLevel(uvIndex: number): RiskLevel {
  if (!Number.isFinite(uvIndex) || uvIndex <= 0) {
    return "low";
  }

  if (uvIndex <= 2) return "low";
  if (uvIndex <= 5) return "moderate";
  if (uvIndex <= 7) return "high";
  if (uvIndex <= 10) return "very_high";
  return "extreme";
}

function normaliseCityLabel(area: WttrNearestArea | undefined, fallbackLabel: string) {
  if (!area) {
    return fallbackLabel;
  }

  const areaName = area.areaName?.[0]?.value ?? area.region?.[0]?.value;
  const country = area.country?.[0]?.value;

  if (!areaName && !country) {
    return fallbackLabel;
  }

  if (!areaName) {
    return country ?? fallbackLabel;
  }

  return country ? `${areaName}, ${country}` : areaName;
}

function parseFloatSafe(value?: string) {
  if (!value) return Number.NaN;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function extractUvValues(response: WttrResponse) {
  const current = response.current_condition?.[0];
  const day = response.weather?.[0];

  const uvNow = parseFloatSafe(current?.uvIndex);

  const dayLevel = parseFloatSafe(day?.uvIndex);
  const hourlyLevels = (day?.hourly ?? [])
    .map((hour) => parseFloatSafe(hour.uvIndex))
    .filter((value) => Number.isFinite(value));
  const hourlyMax = hourlyLevels.length > 0 ? Math.max(...hourlyLevels) : Number.NaN;

  const uvMax = Number.isFinite(dayLevel)
    ? dayLevel
    : Number.isFinite(hourlyMax)
      ? hourlyMax
      : Number.isFinite(uvNow)
        ? uvNow
        : 0;

  return {
    uvNow: Number.isFinite(uvNow) ? uvNow : 0,
    uvMax: uvMax,
    current,
    day,
  };
}

function extractObservedAt(
  current: WttrCurrentCondition | undefined,
  day: WttrWeatherDay | undefined,
  area: WttrNearestArea | undefined,
) {
  const local = current?.localObsDateTime ?? current?.observation_time;
  if (!local) {
    return new Date().toISOString();
  }

  const timezoneEntry = area?.timezone?.[0];
  const offsetRaw = timezoneEntry?.offset ?? timezoneEntry?.UTCOffset ?? timezoneEntry?.utcOffset;
  const offsetNumber = offsetRaw ? Number.parseFloat(offsetRaw) : Number.NaN;
  const offset = Number.isFinite(offsetNumber) ? buildOffset(offsetNumber) : undefined;

  const datePart =
    local.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? day?.date ?? new Date().toISOString().slice(0, 10);

  const timePart = extractTime(local);

  const isoCandidate = `${datePart}T${timePart}${offset ?? "Z"}`;
  const parsed = new Date(isoCandidate);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function buildOffset(value: number) {
  const sign = value >= 0 ? "+" : "-";
  const absolute = Math.abs(value);
  const hours = Math.floor(absolute);
  const minutes = Math.round((absolute - hours) * 60);

  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function extractTime(value: string) {
  const dateTimeMatch = value.match(/(\d{2}:\d{2}:\d{2})/);
  if (dateTimeMatch) {
    return dateTimeMatch[1];
  }

  const timeMatch = value.match(/(\d{1,2}):(\d{2})\s?(AM|PM)?/i);
  if (!timeMatch) {
    return "00:00:00";
  }

  const hour = Number.parseInt(timeMatch[1] ?? "0", 10);
  const minute = timeMatch[2] ?? "00";
  const meridian = (timeMatch[3] ?? "").toUpperCase();

  let normalisedHour = Number.isFinite(hour) ? hour : 0;
  if (meridian === "PM" && normalisedHour < 12) {
    normalisedHour += 12;
  }

  if (meridian === "AM" && normalisedHour === 12) {
    normalisedHour = 0;
  }

  return `${String(normalisedHour).padStart(2, "0")}:${minute}:00`;
}

function extractCoordinates(area: WttrNearestArea | undefined) {
  if (!area) return undefined;

  const lat = parseFloatSafe(area.latitude);
  const lon = parseFloatSafe(area.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return undefined;
  }

  return {
    latitude: lat,
    longitude: lon,
  };
}

function buildCacheKey(language: LocaleLanguage, input: ParsedRequestInput) {
  if (input.cityQuery) {
    return `${language}:city:${input.cityQuery.toLowerCase()}`;
  }

  if (input.location) {
    const lat = input.location.latitude.toFixed(2);
    const lon = input.location.longitude.toFixed(2);
    return `${language}:geo:${lat}:${lon}`;
  }

  return `${language}:fallback`;
}

export function createUvWidgetManager(
  deps?: Partial<UVWidgetManagerDependencies>,
  config?: Partial<UVWidgetManagerConfig>,
) {
  const dependencies: UVWidgetManagerDependencies = {
    fetchForecast: deps?.fetchForecast ?? fetchWttrForecast,
    now: deps?.now ?? (() => Date.now()),
    loadCopy: deps?.loadCopy ?? loadCopyBundle,
  };

  const mergedConfig: UVWidgetManagerConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  function withCacheMetadata(
    payload: UVWidgetPayload,
    status: CacheStatus,
    source?: CacheSource,
  ): UVWidgetPayload {
    return {
      ...payload,
      meta: {
        ...payload.meta,
        cache_status: status,
        ...(source ? { cache_source: source } : {}),
      },
    };
  }

  async function getPayload(input: ParsedRequestInput): Promise<UVWidgetPayload> {
    const cacheKey = buildCacheKey(input.language, input);

    const cacheLookup = await readCache(cacheKey);
    if (cacheLookup.status === "hit") {
      return withCacheMetadata(cacheLookup.payload, "hit", cacheLookup.source);
    }

    return tracer.startActiveSpan("uv_widget.fetch", async (span) => {
      span.setAttribute("clarivum.tools.locale", input.locale);
      span.setAttribute("clarivum.tools.language", input.language);
      span.setAttribute(
        "clarivum.tools.request_kind",
        input.cityQuery ? "city" : input.location ? "geo" : "fallback",
      );

      const copyPromise: Promise<UVWidgetCopyBundle> = dependencies.loadCopy(input.language);

      try {
        const response = await dependencies.fetchForecast({
          language: input.language,
          ...(input.location ? { location: input.location } : {}),
          ...(input.cityQuery ? { cityQuery: input.cityQuery } : {}),
          revalidateSeconds: Math.floor(mergedConfig.cacheTtlMs / 1000),
          timeoutMs: mergedConfig.fetchTimeoutMs,
        });

        const area = response.nearest_area?.[0];
        const { uvNow, uvMax, current, day } = extractUvValues(response);
        const riskLevel = computeRiskLevel(uvNow);
        const copyBundle = await copyPromise;

        const fallbackDetails: UVWidgetPayload["fallback"] = {
          is_fallback_city: input.cityQuery
            ? false
            : !input.location ||
              (input.location?.latitude === mergedConfig.fallbackCoordinates.latitude &&
                input.location?.longitude === mergedConfig.fallbackCoordinates.longitude),
          message: copyBundle.fallbackMessage,
        };

        if (!input.cityQuery) {
          const computedReason = input.fallbackReason ?? (input.location ? undefined : "default");
          if (computedReason) {
            fallbackDetails.reason = computedReason;
          }
        }

        const meta: UVWidgetPayload["meta"] = {
          locale: input.locale,
          cache_ttl_seconds: Math.floor(mergedConfig.cacheTtlMs / 1000),
        };

        const sourceCoordinates = extractCoordinates(area);
        if (sourceCoordinates) {
          meta.source_coordinates = sourceCoordinates;
        }

        const payload: UVWidgetPayload = {
          city_label: normaliseCityLabel(area, mergedConfig.fallbackCityLabel),
          source: "Wttr.in",
          observed_at: extractObservedAt(current, day, area),
          uv_now: Number(uvNow.toFixed(1)),
          uv_max_today: Number(uvMax.toFixed(1)),
          risk_level: riskLevel,
          risk_copy: copyBundle.riskCopy[riskLevel] ?? copyBundle.riskCopy.low,
          next_steps: copyBundle.nextSteps.map((step) => ({ ...step })),
          fallback: fallbackDetails,
          meta,
        };

        await writeCache(cacheKey, payload, mergedConfig.cacheTtlMs);

        span.setAttribute("clarivum.tools.uv_now", payload.uv_now);
        span.setAttribute("clarivum.tools.uv_max", payload.uv_max_today);
        span.setAttribute("clarivum.tools.risk_level", payload.risk_level);
        span.setAttribute(
          "clarivum.tools.cache_status",
          cacheLookup.status === "hit" ? "hit" : "miss",
        );
        span.setAttribute("clarivum.tools.copy_source", copyBundle.source);
        span.end();
        return withCacheMetadata(payload, "miss");
      } catch (error) {
        const copyBundle = await copyPromise;
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (error as Error).message,
        });
        span.end();

        if (cacheLookup.status === "stale") {
          span.setAttribute("clarivum.tools.cache_status", "stale");
          return withCacheMetadata(cacheLookup.payload, "stale", cacheLookup.source);
        }

        const fallbackPayload: UVWidgetPayload = {
          city_label: mergedConfig.fallbackCityLabel,
          source: "Wttr.in",
          observed_at: new Date().toISOString(),
          uv_now: 0,
          uv_max_today: 0,
          risk_level: "low",
          risk_copy: copyBundle.riskCopy.low,
          next_steps: copyBundle.nextSteps.map((step) => ({ ...step })),
          fallback: {
            is_fallback_city: true,
            message: copyBundle.fallbackMessage,
            reason: "error",
          },
          meta: {
            locale: input.locale,
            cache_ttl_seconds: Math.floor(mergedConfig.cacheTtlMs / 1000),
          },
        };

        return withCacheMetadata(fallbackPayload, "miss");
      }
    });
  }

  return {
    getPayload,
  };
}

export const uvWidgetManager = createUvWidgetManager();
