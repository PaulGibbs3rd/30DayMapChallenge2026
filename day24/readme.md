# Washington State Ferries

**Day 24 · Network · November 24, 2026**

An interactive map of the 19 Washington State Ferries terminals in Washington. The design takes its green, white, and marine blue from the fleet’s livery. This is an independent 30 Day Map Challenge entry. [Official challenge theme](https://30daymapchallenge.com/2026/) · [Working spec](spec.md)

- **Chart** shows the geographic crossings and docks. **Diagram** spaces the terminals out and makes connections easier to read. Scroll, pinch, double-click, or use **+** and **−** to zoom in either view. Selections carry across both views.
- **Where can I go on one ferry?** Choose a departing terminal. Select a direct or intermediate-stop pattern to trace it across the map. The San Juans shortcut offers separate Anacortes and interisland views.
- **Suspended Sidney route** reveals the international crossing in gray. **Download chart** saves the full network and a San Juan Islands inset as a standalone SVG.

## Data and rendering

- **Ferries and terminals.** WSDOT’s ferry GIS supplies dock locations and much of the crossing linework, including the suspended Sidney link. Seattle uses Pier 52, Colman Dock. The main San Juan legs use official WSF GTFS shapes where individual legs are unavailable in the GIS. Both sources are for general reference, and the shape detail varies by crossing. [WSDOT GIS service](https://data.wsdot.wa.gov/arcgis/rest/services/Shared/FerryRoutes/MapServer)
- **Sailing patterns.** The bundled snapshot covers Nov 24–Dec 6, 2026. WSF publishes the feed as two-stop trips by origin and destination. The preparation script joins matching departure and arrival events to identify intermediate calls and adds the published Fauntleroy–Vashon patterns via Southworth. Where that method finds no intermediate call on a complex San Juan pair, the explorer says **No intermediate stop listed**. The Anacortes–Friday Harbor timetable confirms both a direct sailing and a sailing via Lopez Island. Use current WSDOT schedules for departures, alerts, and vehicle restrictions. [WSDOT GTFS directory and terms](https://data.wsdot.wa.gov/gtfs/list.html) · [San Juan Islands timetable](https://wsdot.com/ferries/schedule/scheduledetailbyroute.aspx?route=ana-sj) · [Fauntleroy–Vashon timetable](https://wsdot.com/ferries/schedule/scheduledetailbyroute.aspx?route=f-v-s) · [WSDOT 2026 fact sheet](https://wsdot.wa.gov/sites/default/files/2026-03/WSF-FactSheet-2026_0.pdf)
- **Shoreline.** Washington land uses U.S. Census Bureau 2024 cartographic county boundaries at 1:500,000. Canadian land uses Natural Earth 1:10m admin-0 boundaries. The preparation script clips and simplifies both for display. [Census cartographic boundary files](https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html) · [Natural Earth countries](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/) · [Natural Earth public-domain terms](https://www.naturalearthdata.com/about/terms-of-use/)
- **Artwork.** The masthead is an original ferry illustration from the built-in ImageGen tool. The prompt depicts a classic white-and-evergreen Pacific Northwest car ferry on Puget Sound against a forested shoreline and the Olympic foothills. [Masthead image](assets/ferry-hero.jpg)

The geographic chart uses the ArcGIS Maps SDK for JavaScript 5.2 `arcgis-map` component. Its shoreline, ferry crossings, and terminal markers are three ArcGIS `GraphicsLayer` instances built from local data. The chart applies selection styling to those layers and uses the ArcGIS view’s hit test for map clicks. A vector overlay serves the keyboard-selectable terminal labels. The diagram, chart export, and the geographic fallback use local vector rendering. The map supports anonymous access.

The generated starter is preserved in `day24/starter/`. It was created with `npx -y @arcgis/create --name starter --template js-maps-sdk-cdn` using `@arcgis/create` 1.0.0-0. The live app uses the starter’s 5.2 CDN and map component, with local ferry layers in place of the example web map. [Generated starter](starter/README.md) · [Esri CDN starter](https://github.com/Esri/jsapi-resources/tree/main/templates/js-maps-sdk-cdn)

## Run and verify

Run `npm run dev` from the repository root and open `/30DayMapChallenge2026/day24/` on the printed local server. Run `node day24/scripts/check.mjs` to validate the network snapshot and `npm run check` to validate the collection.

To reproduce the local data, save the WSDOT [terminal query](https://data.wsdot.wa.gov/arcgis/rest/services/Shared/FerryRoutes/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson) as `terminals.geojson`, the [crossing query](https://data.wsdot.wa.gov/arcgis/rest/services/Shared/FerryRoutes/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=geojson) as `routes.geojson`, the [WSF schedule feed](https://business.wsdot.wa.gov/Transit/csv_files/wsf/google_transit.zip) as `gtfs.zip`, the [Census county archive](https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_county_500k.zip) as `counties.zip`, and the [Natural Earth archive](https://naturalearth.s3.amazonaws.com/10m_cultural/ne_10m_admin_0_countries.zip) as `countries.zip`. Run `python day24/scripts/prepare.py <source-folder>` with GDAL Python bindings installed. The GTFS feed rolls forward, so regenerating the original snapshot requires a copy containing its reference dates.

[Open the map](index.html) · [All challenge maps](../directory/)
