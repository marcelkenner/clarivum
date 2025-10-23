# Architecture — UV Index Widget

```mermaid
graph TD
    subgraph Client["Browser (User Device)"]
        Widget["UV Widget Component\nNext.js (App Router)"]
        LocalCache["Local Storage Cache"]
        Consent["Geo Consent State"]
    end

    subgraph FrontendApp["Clarivum Frontend (Vercel)"]
        HeroPage["Homepage Hero\n(ViewModel + Coordinator)"]
        ApiRoute["/api/tools/uv-widget\nEdge Function"]
        Flagsmith["Feature Flag SDK"]
    end

    subgraph ToolsPlatform["Tools Platform (Node Runtime)"]
        WidgetManager["UVWidgetManager\n(Composition Root)"]
        OpenMeteoClient["OpenMeteoClient\n(fetch adapter)"]
        StrapiClient["Strapi Copy Client"]
        CacheLayer["Server Cache\n(Edge KV, 5 min)"]
    end

    subgraph External["External Services"]
        OpenMeteo["Open-Meteo Forecast API"]
        Geocode["Open-Meteo Geocoding API"]
        Strapi["Strapi CMS"]
    end

    Widget --> HeroPage
    Widget -->|Consent Request| Consent
    Widget -->|Read/Write| LocalCache
    HeroPage -->|Feature flag| Flagsmith
    Widget -->|fetch| ApiRoute
    ApiRoute --> WidgetManager
    WidgetManager --> CacheLayer
    WidgetManager -->|fetch| OpenMeteoClient
    WidgetManager -->|fetch| StrapiClient
    OpenMeteoClient --> OpenMeteo
    OpenMeteoClient --> Geocode
    StrapiClient --> Strapi
    CacheLayer --> WidgetManager
    WidgetManager --> ApiRoute
    ApiRoute --> Widget
```

**Legend**

- Frontend coordinates consent, local caching, and renders hero UI.
- Tools platform manager centralizes API calls, caching, and copy retrieval.
- Open-Meteo provides UV/forecast data; Strapi stores localized risk copy.
