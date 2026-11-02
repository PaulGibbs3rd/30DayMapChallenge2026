### ArcGIS requirements handoff summary

- **Work Target:** New application
- **Project Folder:** day1 (existing challenge folder)
- **ArcGIS Product Context:** ArcGIS Maps SDK client renderer; no ArcGIS Online, Location Platform or Enterprise resources required
- **Target Platform:** Web, desktop and mobile
- **Delivery Scope:** Working challenge app with all 23 shows, sourced setlists and music playback
- **Identity & Access Model:** User requested client-side GeoJSON without ArcGIS authentication; Site hosting remains owner-private independently of data access
- **Core Features and Operations:** Local GeoJSON visualization, point selection, show filtering, setlist exploration, native music embeds

#### Remaining assumptions
1. The 23 US/Canada dates in the supplied poster define the scope; Mexico is not included.
2. Venue locations are approximate and show order is not a travel route.
3. User requested Spotify or Apple Music after YouTube returned unavailable. Spotify is the default; YouTube remains an alternative.

#### Next agent actions
- [x] Route to `build-with-arcgis-maps-sdk-for-javascript` and `build-with-calcite-design-system` for implementation.
- [x] Route to `follow-arcgis-authentication-patterns`; local geography requires no credentials.

Uses ArcGIS CDN 5.1, arcgis-map/arcgis-zoom web components, local GeoJSONLayer instances, compatible Calcite components and explicit TileInfo LODs for zoom without a tiled basemap.

References: https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-map/ ; https://developers.arcgis.com/javascript/latest/references/core/layers/GeoJSONLayer/ ; https://developers.arcgis.com/calcite-design-system/get-started/ ; https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed
