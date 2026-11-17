# Day 16 · Seattle, in Common

November 16, 2026 · Collaborative map

Everyday transit is a shared experience. The map follows the bus routes, trains, and ferries riders use together, from shared corridors downtown to the crossings of Elliott Bay and Puget Sound. The atlas opens with all three modes visible. Use the checkboxes to compare modes, or select a route to see its operator and highlight its alignment.

## Data and cartography

- **Transit.** The local [GeoJSON snapshot](data/routes.geojson) was generated from Sound Transit’s consolidated Puget Sound static GTFS feed for scheduled service on November 16, 2026. It includes 95 bus routes, eight rail services, and nine ferry services with published shapes that touch the Seattle selection rectangle. Routes continue beyond that rectangle. The rail group includes Link, Sounder, the two Seattle Streetcar lines, Monorail, and Amtrak Cascades. Ferry services from separate operators remain distinct. [Sound Transit Open Transit Data downloads](https://www.soundtransit.org/help-contacts/business-information/open-transit-data-otd/otd-downloads)
- **Selection.** The script applies the weekly schedule and calendar exceptions, then selects the most frequently scheduled shape touching the Seattle rectangle for each route. It combines reverse-direction ferry records from the same operator. The resulting lines are representative alignments for one service day. Detours, variants, stops, frequency, and real-time conditions are outside this view.
- **Basemap.** The [edited vector tile stylesheet](data/seattle-style.json) applies blue land, teal water, lime parks, and gray roads to Esri World Basemap v2 vector tiles. It retains the source’s geometry filters and zoom stops while removing features that compete with the transit lines. Color inspiration comes from Morghan Montez’s London map. Esri basemap credits are shown in the map. [Esri vector style editing documentation](https://vtse.arcgis.com/documentation/editing-json/)

## Run and regenerate

The [spec](spec.md) preceded implementation. The app started from the ArcGIS scaffold generated with `npx -y @arcgis/create --name seattle-cdn --template js-maps-sdk-cdn`. It uses the ArcGIS Maps SDK for JavaScript 5.2 CDN with a vector tile basemap and client-side graphics created from static GeoJSON.

From the repository root, run `npm run dev` and open `http://127.0.0.1:4174/30DayMapChallenge2026/day16/`. The map needs a network connection for the Esri SDK, vector tiles, and map fonts.

To regenerate the snapshot and style, download the [Puget Sound GTFS archive](https://gtfs.sound.obaweb.org/prod/gtfs_puget_sound_consolidated.zip) and [Esri base style JSON](https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/styles/root.json), then run the standard-library Python script with the two files.

```sh
python day16/scripts/build-data.py path/to/gtfs.zip path/to/root.json --day 2026-11-16
```

The schedule source rolls forward, so reproducing the original snapshot later requires an archived feed covering the same service day.
