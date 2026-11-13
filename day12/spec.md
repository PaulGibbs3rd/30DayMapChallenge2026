# When Power Changed

Day 12 · Power · November 12, 2026

## Purpose and scope

Show which source generated the most electricity in each country or economy from 2000 to 2025, when that lead changed, and how the generation mix shifted even where the leader stayed the same. The main comparison opens at 2000 and 2024. The public entry will run at `day12/` on GitHub Pages using the ArcGIS Maps SDK for JavaScript 5.2. [Official 2026 challenge](https://30daymapchallenge.com/2026/)

## Map and interactions

- Show two maps with the same projection, starting viewpoint, and fuel legend. Label the panels **Year A** and **Year B** so either can represent the earlier date. Use the same fuel colors in both maps and the chart. A separate legend entry identifies ties, and neutral grays identify unavailable data and zero reported generation. Use stable fills and borders throughout the timeline so a color change always has the same meaning.
- Give each map a labeled year slider with one-year steps and previous and next buttons. Either year can move independently from 2000 through 2025. Include a **Reset comparison** button that restores 2000, 2024, and the world view. Synchronize pan and zoom on desktop so both maps stay aligned. On narrow screens, stack the maps with year controls beside their respective headings. Keep the page vertically scrollable around each map.
- Report the number of countries and economies with generation data beside each year. For 2025, show a short coverage note explaining that fewer geographies have published data in this release. A country without data for the selected year remains selectable, and its details explain the gap.
- Selecting a geography on either map or in an alphabetized keyboard-accessible country and economy picker opens the same detail panel. Highlight its mapped geometry on both maps. The picker also includes Ember geographies without a usable boundary. Provide a labeled clear-selection control and preserve the selection when either year changes.
- For the selected geography, show the leading source, TWh, and share for each comparison year. Plot annual generation share for each source from 2000 through 2025 with two labeled year markers. Provide a text list of lead changes, a shared-lead annotation where applicable, and an expandable data table with year, source, TWh, and share. Represent missing observations with gaps in the chart and an explicit label in the table. Provide a short keyboard-accessible chart summary and honor reduced-motion settings.

## Data and interpretation

### Generation

Pin the November 11, 2026 release of Ember’s global yearly electricity CSV for the initial build. The input reviewed for this spec has SHA-256 `08932763076fa781634371dd1b75d8156f76592710c7e984836ed56a663d5688`. Record the source URL, publication date, retrieval date, and checksum in the build manifest. If the mutable endpoint changes, document the new release and rerun the data audit before updating the baseline. Publish the processed snapshot with the app. Credit Ember and identify the filtering, ranking, and geographic join as modifications. [Ember Yearly Electricity Data](https://ember-energy.org/data/yearly-electricity-data/) · [Global CSV](https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv) · [Ember license statement](https://ember-energy.org/data/electricity-data-explorer/)

1. Parse the CSV by header with a parser that handles quoted fields. Use `Area type = Country or economy`, a usable `ISO 3 code`, and years 2000–2025. Retain each unique geography, year, and source. Validate required headers, flag duplicate rows, and fail on conflicting values for the same key.
2. Rank these nine Ember categories by `Generation (TWh)` in each geography and year: bioenergy, coal, gas, hydro, nuclear, other fossil, other renewables, solar, and wind. Read `Total generation` only as the denominator and a completeness check. Exclude imports, demand, and aggregate source groups from rankings. Preserve explicit zero values. Store blank, absent, or invalid values as unavailable and report invalid values during preprocessing.
3. For each geography and year, compare the sum of available source values with the reported total. Use a fixed tolerance of 0.06 TWh to accommodate rounding in the pinned release. For a positive reported total, permit a classification when the sum reconciles and any unexplained positive remainder is smaller than the largest reported source if categories are missing. Withhold the classification where coverage or reconciliation is insufficient and keep numeric source observations visible in the table. A reported zero with no positive source is **Zero reported generation**. Review small positive totals and sparse rows in the audit because rounded values can obscure the lead.
4. Use the largest reported value at source precision. An exact tie for first gets a **Shared lead** map fill and lists every co-leader. Calculate shares from reported TWh and reported total for comparable years, rounding for display only. Use the same denominator and rule across the map, chart, and table. Explain that the map ranks domestic electricity generation and that the leading source can supply less than half of it.
5. Record a switch when adjacent calendar years each have one leader and the leaders differ. Display gaps and shared-lead years in the chart and timeline without assigning a switch year across them. The comparison can still show that the selected endpoints differ.

### Geography and coverage

- Use Natural Earth 1:50m Admin 0 map units as the boundary candidate. Build a reviewed join by ISO3 with a versioned override table keyed by stable Natural Earth IDs. Document dependent territories, disputed units, grouped economies, and unmatched records. Resolve multiple polygons for an Ember geography into a multipart feature. Use one consistent geography for each country across the timeline and explain that the map uses present-day boundaries. Attribute Natural Earth in the app. [Natural Earth map units](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-details/) · [Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/)
- Keep unmatched Ember geographies in the picker and timeline, with a clear **No mapped boundary** label. Keep unmatched map units gray and state when the data uses a different reporting geography. Report matched and unmatched IDs in the build audit. Check representative dependent territories and small economies by hand before publishing.
- The inspected Ember release has at least one numeric source observation for 207 geographies in 2000, 194 in 2024, and 94 in 2025. Before the geographic join, the classification rules yield 206 single leaders and one shared lead in 2000, 189 single leaders, four shared leads, and one reported zero in 2024, and 94 single leaders in 2025. Report mapped counts separately in the audit. [Ember global CSV](https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv)

## Implementation

- Replace `day12/index.html` during the build and keep the runtime HTML, CSS, JavaScript, and versioned data inside `day12/`. Add a repeatable data preparation script under `day12/scripts/`, a data manifest, and an audit with coverage, reconciliation, join exceptions, and tie counts. The app loads local generated assets so readers get the same snapshot. Update the Day 12 readme and site directory metadata during implementation.
- Load the SDK from `https://js.arcgis.com/5.2/` and mount two `<arcgis-map>` components. Set an explicit common spatial reference and world viewpoint for both maps. Use the local boundary geometry over a neutral background for the thematic maps. The application uses the public CDN and local assets and requires no ArcGIS account or sign-in. [Esri CDN setup](https://developers.arcgis.com/javascript/latest/get-started/) · [Map component reference](https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-map/)
- Generate one compact WGS84 GeoJSON asset with stable feature IDs, the joined Ember ID, and one leader-class field per year. Create a separate `GeoJSONLayer` instance in each map from that asset. Declare the annual field schema and switch each layer’s `UniqueValueRenderer` to the selected year field with shared color definitions. Keep detailed series in a separate compact JSON asset keyed by Ember ISO3 for the picker, chart, and table. Use the same normalized dataset to generate both assets. [GeoJSONLayer reference](https://developers.arcgis.com/javascript/latest/references/core/layers/GeoJSONLayer/) · [UniqueValueRenderer reference](https://developers.arcgis.com/javascript/latest/references/core/renderers/UniqueValueRenderer/)
- After both map views are ready, synchronize viewpoints using Esri’s active-view pattern and confirm it handles both directions without feedback loops. Limit click hit testing to the thematic layer. Derive the chart and both highlights from a single selected ID, clear prior highlight handles when replacing them, and guard rapid input against stale asynchronous results. Include a visible fallback with sources and country details if the map cannot initialize. [Esri view synchronization sample](https://developers.arcgis.com/javascript/latest/sample-code/views-synchronize/) · [Map component reference](https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-map/)
- Keep individual plants as a follow-up. Global Energy Monitor’s tracker could supply a later reference layer with plant locations, commissioning years, and operating status. Ember supplies the historical generation rankings for this entry. [Global Integrated Power Tracker](https://globalenergymonitor.org/projects/global-integrated-power-tracker)

## Acceptance criteria

1. The GitHub Pages build opens at 2000 and 2024, and both maps show the same initial geographic view, fuel colors, and readable year controls. Desktop navigation stays synchronized. At mobile width, both years and their controls remain usable with ordinary page scrolling.
2. Changing either year updates the correct map and comparison detail without resetting the other year, selection, or viewport. Selecting 2025 shows its coverage note and unavailable geographies in gray without carrying forward 2024 values. Reset restores the opening comparison and viewpoint.
3. Selecting a mapped country in either map or in the picker highlights it in both maps and shows the same details. An unmatched geography remains accessible in the picker. The chart and table show actual missing observations, explicit zero values, and shared leads with distinct labels.
4. The pinned data reproduces coal to gas for the United States in 2016, coal to wind for Germany in 2023, and coal as China’s leading source in both 2000 and 2025 with its share falling from about 78% to 55%. In 2024, Lesotho shows zero reported generation and Myanmar shows a shared lead between hydro and gas at 10.0 TWh each. Synthetic cases verify that ties and gaps produce no invented switch dates. [Ember global CSV](https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv)
5. A fresh signed-out browser loads both maps and local data without authentication prompts. Test keyboard-only year and country selection, visible focus, chart/table access, and contrast. Smoke-test desktop and mobile layouts, fast year changes, and data and SDK load failures. Run the data preparation checks, `npm run check`, and `npm run build`, then verify the generated `day12/` route and attribution links.

### ArcGIS requirements handoff summary

- **Work Target:** New application
- **Project Folder:** `day12/`
- **ArcGIS Product Context:** ArcGIS Maps SDK for JavaScript 5.2 with local data on GitHub Pages
- **Target Platform:** Web
- **Delivery Scope:** Public challenge entry with comparison maps and country-level timelines
- **Identity & Access Model:** Anonymous access using the SDK CDN and locally hosted data assets
- **Core Features and Operations:** 2D mapping, year comparison, country selection, and generation-mix visualization

#### Remaining assumptions

1. Natural Earth map units meet coverage and boundary requirements after the join audit. The exact overrides and exceptions will come from the build audit.

#### Next agent actions

- [ ] Route to `build-with-arcgis-maps-sdk-for-javascript` for implementation.
