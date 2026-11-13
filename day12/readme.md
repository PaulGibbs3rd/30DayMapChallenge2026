# When Power Changed

Day 12 · Power · November 12, 2026

[Open the map](index.html) · [Implementation spec](spec.md) · [All challenge days](../directory/index.html)

Which source generated the most electricity in each country, and when did that lead change? Two ArcGIS Maps SDK for JavaScript 5.2 maps open at 2000 and 2024 and highlight every place where wind led on its own. Choose another source to compare where it led, or choose All sources to see the full map legend. The summary counts mapped countries and economies for each selected year. Select a country on either map or in Country history to see its generation shares, changes in the lead, and annual data. The reset and clear actions use Calcite buttons from the SDK CDN, with native buttons available if the CDN fails to load.

The United States switched from coal to gas in 2016, and Germany switched from coal to wind in 2023. Coal remained China’s leading source, while its share fell from about 78% in 2000 to 55% in 2025. The November 11 Ember release contains numeric generation observations for 207 countries and economies in 2000, 194 in 2024, and 94 in 2025. [Ember Yearly Electricity Data](https://ember-energy.org/data/yearly-electricity-data/)

Turn on **Highlight changes** for a single source to see where it gained, lost, or kept the lead from the earlier year to the later year. A missing year or a tied lead gets its own map color. Select either count beside the title to list those places, then choose a place to center both maps and open its history.

The totals and trends below the maps compare the same countries and economies in both selected years. Total electricity generated sums Ember’s reported totals for observations classified as a single leader, shared lead, or explicit zero. Wind and solar share divides the sum of reported output from those two sources by the same generation total. The count of places with a different leading source uses only places with one leader in both selected years. The selected source’s output and share use the subset with reported output for that source in both years, including places where it did not lead.

## Data and method

- Ember's November 11, 2026 global electricity data is available under CC BY 4.0. The app filters it to annual domestic generation in TWh by country or economy, reconciles sources against reported totals, ranks individual sources, and tracks changes between adjacent years with single leaders. Shared leads, explicit zero generation, and unavailable observations have separate classifications. [Ember data and license](https://ember-energy.org/data/electricity-data-explorer/) · [Source CSV](https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv)
- Natural Earth 1:50m Admin 0 map units provide the present-day geography in the app. The ISO3 join preserves separately reported territories. The reviewed overrides match Kosovo’s boundary to Ember’s `XKX` record and keep the uninhabited Ashmore and Cartier Islands separate from Australia’s reporting geography. [Natural Earth map units](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-details/) · [Public domain terms](https://www.naturalearthdata.com/about/terms-of-use/) · [Overrides](data/boundary-overrides.json)
- All 209 Ember geographies in the snapshot matched a map feature. Forty-two map units have no matching Ember geography and appear gray. The 2025 map uses available observations for that year. [Join and coverage audit](data/audit.json) · [Source manifest](data/manifest.json)

## Local preview and regeneration

Run `npm run dev` from the repository root and open the `/30DayMapChallenge2026/day12/` route. Both maps load ArcGIS SDK 5.2 from Esri’s CDN. The boundary and generation assets are served with the page, and the country details can still be used if the map SDK fails to load.

To rebuild the local snapshot, download the files in the source manifest and run:

```text
python day12/scripts/prepare-data.py path/to/ember.csv path/to/map-units.geojson --retrieved YYYY-MM-DD
```

The script checks both SHA-256 pins before generating the map geometry, country series, manifest, and coverage audit. The Ember endpoint publishes updates over time, so reproducing this release requires a copy of the pinned input. The checked-in processed snapshot is the data used by the app.

The repository publishes the static route with `npm run build` and checks it with `npm run check`.
