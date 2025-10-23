# Data Lineage — UV Index Widget

```mermaid
flowchart LR
    Consent["Geo Consent\n(localStorage uv_location_consent)"]
    Geoposition["Browser Geolocation API\n(lat, lon)"]
    Fallback["Fallback Coordinates\n(Warszawa)"]
    CitySearch["City Search Request\n(query, lang)"]
    GeoAPI["Open-Meteo Geocoding API\nJSON city candidates"]
    SelectedCity["Selected City\n(id, lat, lon, tz)"]
    Request["/api/tools/uv-widget\n(lat, lon, locale)"]
    Cache["Edge Cache (5 min)\nkey: lat:lon:locale"]
    ForecastAPI["Open-Meteo Forecast API\ncurrent uv_index, daily uv_index_max"]
    Copy["Strapi Copy\nrisk_copy[locale][level]"]
    Response["UV Widget Payload\n(uv_now, uv_max, risk_level, copy, fallback metadata)"]
    LocalCache["Client Cache\nlocalStorage uv_widget_payload (30 min)"]
    UI["Hero Widget UI"]
    Analytics["Analytics Events\nPlausible Analytics"]

    Consent -->|granted| Geoposition
    Consent -->|denied| Fallback
    Geoposition --> Request
    Fallback --> Request
    CitySearch --> GeoAPI --> SelectedCity --> Request
    Request --> Cache
    Cache -->|hit| Response
    Cache -->|miss| ForecastAPI --> Cache
    Cache -->|miss| Copy --> Cache
    Cache -->|return| Response
    Response --> LocalCache --> UI
    UI --> Analytics
```

**Key notes**

- Local storage caches the response for 30 min; expiry triggers a background refresh.
- Edge cache shields Open-Meteo from spikes and enforces 5 min freshness policy.
- Analytics capture consent state and UV values without persisting precise coordinates.
