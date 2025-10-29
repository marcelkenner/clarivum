export type LocaleLanguage = "pl" | "en";

export type RiskLevel = "low" | "moderate" | "high" | "very_high" | "extreme";

export type UVWidgetNextStep = {
  label: string;
  href: string;
  cta_id: string;
};

export type UVWidgetPayload = {
  city_label: string;
  source: "Wttr.in";
  observed_at: string;
  uv_now: number;
  uv_max_today: number;
  risk_level: RiskLevel;
  risk_copy: string;
  next_steps: UVWidgetNextStep[];
  fallback: {
    is_fallback_city: boolean;
    message: string;
    reason?: string;
  };
  meta: {
    locale: string;
    cache_ttl_seconds: number;
    cache_status?: "hit" | "miss" | "stale";
    cache_source?: "upstash" | "memory";
    source_coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
};

export type ParsedRequestInput = {
  locale: string;
  language: LocaleLanguage;
  location?: {
    latitude: number;
    longitude: number;
  };
  cityQuery?: string;
  fallbackReason?: "default" | "manual";
};

export type WttrNearestArea = {
  areaName?: Array<{ value?: string }>;
  country?: Array<{ value?: string }>;
  region?: Array<{ value?: string }>;
  latitude?: string;
  longitude?: string;
  timezone?: Array<{
    name?: string;
    zone?: string;
    offset?: string;
    UTCOffset?: string;
    utcOffset?: string;
  }>;
};

export type WttrCurrentCondition = {
  uvIndex?: string;
  FeelsLikeC?: string;
  temp_C?: string;
  localObsDateTime?: string;
  observation_time?: string;
  precipMM?: string;
};

export type WttrHourly = {
  time?: string;
  uvIndex?: string;
};

export type WttrWeatherDay = {
  date?: string;
  uvIndex?: string;
  hourly?: WttrHourly[];
};

export type WttrResponse = {
  current_condition?: WttrCurrentCondition[];
  weather?: WttrWeatherDay[];
  nearest_area?: WttrNearestArea[];
  request?: Array<{
    query?: string;
    type?: string;
  }>;
};

export type UVWidgetManagerConfig = {
  cacheTtlMs: number;
  fetchTimeoutMs: number;
  fallbackCityLabel: string;
  fallbackCoordinates: {
    latitude: number;
    longitude: number;
  };
};

export type UVWidgetCopyBundle = {
  riskCopy: Record<RiskLevel, string>;
  fallbackMessage: string;
  nextSteps: UVWidgetNextStep[];
  source: "fallback" | "strapi";
};

export type UVWidgetManagerDependencies = {
  fetchForecast: (input: {
    language: LocaleLanguage;
    location?: { latitude: number; longitude: number };
    cityQuery?: string;
    revalidateSeconds: number;
    timeoutMs: number;
  }) => Promise<WttrResponse>;
  now: () => number;
  loadCopy: (language: LocaleLanguage) => Promise<UVWidgetCopyBundle>;
};
