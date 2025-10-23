# Process — UV Widget Consent & Refresh Flow

```mermaid
flowchart TD
    subgraph User["Lane: User"]
        Start([Page Load])
        ConsentPrompt{"Allow location?"}
        ManualCity{"Choose city manually"}
        ViewWidget["View UV widget"]
    end

    subgraph Frontend["Lane: Frontend App"]
        Init["Init Widget State"]
        GeoRequest["Request geolocation"]
        ConsentResult{"Geo success?"}
        UseFallback["Set fallback city = Warsaw"]
        SearchModal["Open city search modal"]
        SubmitCity["Submit search query"]
        RenderUV["Render payload"]
        RefreshTimer["30 min refresh timer"]
    end

    subgraph Platform["Lane: Tools Platform"]
        FetchPayload["Fetch UV payload"]
        CacheHit{"Cache hit?"}
        CallMeteo["Call Open-Meteo"]
        CallStrapi["Load risk copy"]
        CacheStore["Store payload 5 min"]
        ReturnPayload["Return payload"]
    end

    Start --> Init --> GeoRequest --> ConsentPrompt
    ConsentPrompt -->|Allow| ConsentResult
    ConsentPrompt -->|Deny| UseFallback
    ConsentResult -->|Yes| FetchPayload
    ConsentResult -->|No| UseFallback
    UseFallback --> FetchPayload
    FetchPayload --> CacheHit
    CacheHit -->|Yes| ReturnPayload
    CacheHit -->|No| CallMeteo --> CallStrapi --> CacheStore --> ReturnPayload
    ReturnPayload --> RenderUV --> ViewWidget
    ConsentPrompt -->|Manual change| ManualCity --> SearchModal --> SubmitCity --> FetchPayload
    ViewWidget --> RefreshTimer --> FetchPayload
```

**Process highlights**

- User choice drives either direct geolocation or fallback to Warsaw.
- Manual city selection branches into the geocoding workflow before fetching UV data.
- Refresh timer reuses the same payload fetch, respecting cache TTLs.
