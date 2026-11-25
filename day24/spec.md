# Day 24 · Washington State Ferries

**Working spec · Network · November 24, 2026**

Map the Washington State Ferries system from the San Juan Islands to Point Defiance. Open on a nautical chart of all 19 Washington terminals. Let visitors switch to a transit-style diagram and select any dock to answer **Where can I go on one ferry?** The San Juans are the signature detail. Selecting a dock reveals the islands each published sailing pattern calls at along the way. [Official challenge theme](https://30daymapchallenge.com/2026/) · [WSDOT system overview](https://wsdot.wa.gov/about/data/multimodal-mobility-dashboard/dashboard/WSF/default.htm) · [WSDOT terminal design manual](https://apps.wsdot.wa.gov/publications/manuals/fulltext/M3082/AppendixP.pdf)

## Chart and diagram

- **Chart** uses geographic terminal locations and ferry paths on a simplified shoreline. Use midnight-blue water, pale gray-green land, four route colors keyed to the San Juans, Whidbey, Central Sound, and South Sound, and white dock rings. Highlight the selected pattern in amber against the quieter network. Give the San Juans a clearly labeled inset in the shareable overview so all five docks in that service group can be read at a glance.
- **Diagram** keeps the same services and terminal IDs while spacing the docks apart and straightening the lines. Preserve the broad north-to-south order. Show a single Seattle dock where the Bainbridge and Bremerton runs meet, and use a clear junction treatment only at shared terminals. Keep the gaps between disconnected ferry services visible.
- Include an optional **Suspended service** layer showing the international link to Sidney, B.C. Use a dashed gray line and label it **Service suspended** in both views. Keep it outside the 19 Washington terminal count and the destination results. [WSDOT 2026 fact sheet](https://wsdot.wa.gov/sites/default/files/2026-03/WSF-FactSheet-2026_0.pdf)

## Visitor experience

1. Start with the entire system visible and a compact route index. Selecting a terminal on either map or in the index highlights the docks served from there on a single published sailing. List those destinations in the panel and show whether the displayed sailing pattern has intermediate stops.
2. Select a route from the index to see its ordered stop patterns. Include a **San Juan Islands** shortcut that distinguishes sailings from Anacortes from sailings among Friday Harbor, Orcas, Shaw, and Lopez. In the south, make it easy to see which Fauntleroy–Southworth patterns call at Vashon. [WSDOT route information](https://apps.wsdot.wa.gov/publications/manuals/fulltext/M3082/AppendixP.pdf) · [WSDOT published schedules](https://wsdot.wa.gov/travel/washington-state-ferries/schedules)
3. Preserve the selected terminal or route when switching views. Provide a **Full network** reset and link each route card to WSDOT’s schedule. Show the date range behind the displayed service patterns and link to WSDOT’s current sailing information. Support the same selection actions by keyboard and touch.

## Coverage and data

| Area | Published services to represent |
| --- | --- |
| San Juan Islands | Anacortes, Friday Harbor, Orcas, Shaw, and Lopez, including interisland sailings |
| Whidbey Island | Port Townsend–Coupeville and Mukilteo–Clinton |
| Central Sound | Edmonds–Kingston, Seattle–Bainbridge Island, and Seattle–Bremerton |
| South Sound | Fauntleroy–Vashon, Fauntleroy–Southworth, Southworth–Vashon, and Point Defiance–Tahlequah |

Use WSDOT’s ferry GIS for terminal locations and crossing geometry. Filter to Washington State Ferries, since the source layers include multiple operators. Use the WSF GTFS feed and published timetables to verify passenger stop order and service dates. Save a dated local snapshot and record each source’s reuse terms and any geometry edits. Use regional hydrography for the coastline. [WSDOT ferry GIS](https://data.wsdot.wa.gov/arcgis/rest/services/Shared/FerryRoutes/MapServer) · [WSDOT GTFS directory](https://data.wsdot.wa.gov/gtfs/list.html) · [Washington Ecology GIS data](https://ecology.wa.gov/research-data/data-resources/geographic-information-systems-gis/data)

Give each dock a stable ID. Store the ordered stops and boarding and alighting rules for each verified sailing pattern. A single-sailing destination must appear later on the same boardable sailing, even if the boat calls somewhere in between. Use the published timetables to resolve feed ambiguities before including those patterns. Shared docks and map line crossings alone cannot establish a single-sailing connection.

## Delivery and acceptance

Build a public 2D map in `day24/` for the existing GitHub Pages collection. Follow Day 22’s ArcGIS Maps SDK for JavaScript approach for the geographic view, using local WGS 84 GeoJSON and a separate local layout for the diagram. Serve both from the same normalized service records. Provide a shareable full-system chart. [Day 22 implementation notes](../day22/readme.md) · [Esri GeoJSONLayer reference](https://developers.arcgis.com/javascript/latest/references/core/layers/GeoJSONLayer/)

- Both views represent all 19 Washington terminals and every group in the coverage table. The chart and diagram use the same names and service patterns.
- Selecting Seattle highlights Bainbridge Island and Bremerton. Selecting a San Juan terminal shows the applicable destinations and correctly distinguishes a sailing with an intermediate stop from a direct crossing. Check at least one such pattern against the published timetable.
- Switching to the diagram retains the selection. Enabling the suspended Sidney link adds context without adding a destination or changing the Washington terminal count.
- The route index and selection panel work on phones and with a keyboard. Verify the published map under the repository’s GitHub Pages subpath and run the collection checks before publication.
