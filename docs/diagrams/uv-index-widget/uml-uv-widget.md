# Domain Sequence — UV Index Widget Load

```mermaid
sequenceDiagram
    participant User
    participant WidgetVM as HeroUVViewModel
    participant ConsentMgr as GeoConsentManager
    participant CityStore as CityPreferenceStore
    participant ApiClient as UVWidgetApiClient
    participant Manager as UVWidgetManager
    participant Cache as EdgeCache
    participant Meteo as OpenMeteo API
    participant Strapi as Strapi CMS

    User->>WidgetVM: Load hero module
    WidgetVM->>ConsentMgr: requestLocation()
    ConsentMgr-->>WidgetVM: lat/lon | fallback
    WidgetVM->>CityStore: loadLastCity()
    CityStore-->>WidgetVM: cityOverride?
    WidgetVM->>ApiClient: fetchUVPayload(params)
    ApiClient->>Manager: GET /uv-widget
    Manager->>Cache: lookup(lat, lon, locale)
    alt cache hit
        Cache-->>Manager: payload
    else cache miss
        Manager->>Meteo: fetchCurrentUV(lat, lon)
        Manager->>Strapi: getRiskCopy(locale)
        Meteo-->>Manager: uv_now, uv_max
        Strapi-->>Manager: risk_copy
        Manager->>Cache: store(payload, ttl=5min)
    end
    Manager-->>ApiClient: payload
    ApiClient-->>WidgetVM: payload
    WidgetVM->>WidgetVM: deriveRiskLevel()
    WidgetVM->>CityStore: persistCity(payload.city_label)
    WidgetVM-->>User: render UV badge + CTA
```

**Domain roles**

- `HeroUVViewModel` composes state for the React component.
- `UVWidgetManager` encapsulates API aggregation, caching, and output shaping.
- `GeoConsentManager` tracks consent lifecycle; `CityPreferenceStore` handles overrides.
