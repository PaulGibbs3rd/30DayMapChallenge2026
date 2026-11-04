# Day 03 · Election night atlas

**Theme: Polygons · November 3, 2026**

An interactive atlas of US House, US Senate and gubernatorial contests happening on Election Day. Blue identifies Democratic candidates, red Republican candidates, gold other parties, violet ties and gray awaiting results. Dark states have no contest supplied for the selected office.

## Run

From the repository root, run `npm run dev`, then open `http://127.0.0.1:4174/30DayMapChallenge2026/day3/`. The app is buildless and works under the existing GitHub Pages subpath. Internet access is required for ArcGIS, Calcite, state and congressional polygons, fonts and live data. It requires no ArcGIS key or sign-in because all requested resources are public and read-only.

## Start and stack

Started with the official interactive `npx @arcgis/create`, project `starter`, template `cdn`. The generated original is retained in [starter/](starter/index.html). Its ArcGIS Maps SDK for JavaScript 5.1 CDN bootstrap supplies Calcite and map components. The app adapts the starter’s Calcite Shell and ArcGIS map component, using core FeatureLayer queries and a client-side results renderer.

## Explore

- Switch among Senate, House and Governor; counts cover contests supplied in the selected feed, not overall chamber control.
- House view uses individual congressional district polygons. Select a polygon, district selector option, or race title to open one district; select a state to browse all its districts. Results and the map stay synchronized. Alaska and Hawaii have dedicated navigation buttons; Lower 48 restores the national extent.
- Search state names, abbreviations, district codes or candidate names. Filter to called, uncalled or close races (reported votes, no call, top-two margin at most five percentage points).
- Read all candidates, party labels, incumbent flags, reported vote totals, calculated vote percentages, provider reporting percentages and direct links to the source race.
- Auto-refresh polls the active office every 60 seconds while the page is visible. Manual Refresh retries immediately. Each office maintains its own data and connection status.
- The URL hash retains office, selected state and selected House district for bookmarking. Reset clears geographic selection, search and race filters.

## Sources and interpretation

[US State Boundaries, supplied ArcGIS Online item](https://www.arcgis.com/home/item.html?id=1612d351695b467eba75fdf82c10884f) is queried at runtime. State outlines derive from the US Census Bureau’s 2006 TIGER/Line data. Esri restricts this item to educational, demonstration and training use. This challenge is educational. The app preserves source attribution. These state polygons remain in the Senate and governor views.

[CivicAPI results](https://civicapi.org/results) and [API documentation](https://civicapi.org/api-documentation/) supply the following verified national feeds:

| Office | Endpoint | Contests in initial feed |
| --- | --- | --- |
| House | [87524](https://civicapi.org/api/v2/race/87524) | 435 |
| Senate | [87528](https://civicapi.org/api/v2/race/87528) | 35 |
| Governor | [87535](https://civicapi.org/api/v2/race/87535) | 36 |

The Senate feed includes Florida and Ohio special elections; the initial catalogue was cross-checked against the date-filtered Senate search. The map covers the 50 states and contests in these feeds; it excludes DC, territories, state legislative contests, primaries and future runoffs. Coverage changes trigger a visible warning. Test payloads, wrong dates, different offices and unrecognized state joins are rejected.

**House map fill shows the leading candidate’s party for each district**, using the [US Census TIGERweb 120th Congressional Districts layer](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Labels/MapServer/40), identified by the service as January 1, 2026 vintage. This replaces the earlier 119th Congress layer. The map credits the US Census Bureau and uses only Census geography; candidates and results come from CivicAPI.

All 435 voting polygons join one-to-one using state FIPS `STATE` and district code `CD120`. The renderer uses `GEOID`. Census code `00` maps to CivicAPI’s `al` suffix for the six at-large states. The service also contains non-voting districts (`98`) and water-only areas (`ZZ`), which are excluded. [The verified join manifest](data/district-join.json) records the new identifiers, source and fetch time. ArcGIS streams district geometry at the map’s current resolution. Selecting a district queries its extent for zoom. Failed geometry loads have a separate map warning and manual Refresh retry; candidate results remain usable. Senate and governor use the leading individual candidate; if more than one contest is supplied for a state, fill combines those contests’ votes by party.

A lead never creates a call. Calls use only a boolean `winner: true` from CivicAPI. No independent projections or forecasts are made. Called counts exclude seats not on the ballot. Reporting percentages are passed through from CivicAPI and are not assumed to equal ballots counted. Candidate percentages are calculated from reported candidate vote totals and may sum to slightly more or less than 100% after rounding. Early close-race margins can change. Other-party candidates are not automatically assigned to either major party or caucus.

## Freshness and fallback

The source returned zero votes during development on November 3, 2026; all three initial payloads had source update timestamps on October 23, 2026. The initial snapshots contain real provider payloads, not fabricated results. Each [saved snapshot](data/senate.json) records its exact source URL and fetch time. They are used only when the API is unavailable and are prominently labeled **Saved snapshot**, with an explicit not-live notice. A failed refresh retains the last successful payload with a warning. The app displays both source update time and last successful fetch time, and warns when a source update is over 15 minutes old.

The provider intermittently returned HTTP 502 while this app was developed. Browser verification exercised the saved fallback and subsequent recovery to a connected live feed. No credentials, backend proxy, or polling automation is needed. Refreshes occur only while the page is open.

To intentionally replace saved snapshots, run `node day3/scripts/update-snapshots.mjs`. It validates all three responses and expected coverage before writing them. A failed download or validation preserves existing files. This command is separate from the normal offline build/check.

## Validation

Run `node day3/scripts/check.mjs` for 16 election data and boundary-join checks covering source identity and coverage, zero-vote handling, strict call flags, close races, ties, other parties, individual candidate leads, House district colors and counts, all 435 boundary joins and at-large normalization, filters, special elections, rejected test data and escaped provider text. `npm run check` also runs this suite, builds the collection, and checks local links and assets.

Browser checks cover the rendered polygons, race switches, state selectors, candidate search, race filters, reset, Alaska/Hawaii navigation, About dialog, timestamps, fallback/recovery, desktop and mobile layouts, and console errors. The live map uses an Albers equal-area projection (WKID 102003) with no paid basemap or location service.

## Files

- [index.html](index.html), [styles.css](styles.css), [app.js](app.js): application and UI.
- [model.js](model.js): independently testable data validation and result interpretation.
- [requirements handoff](research/requirements.md): scope, stack, authentication and setup record.
- [starter](starter/README.md): retained official generated scaffold.

Results are unofficial and remain attributable to CivicAPI. Do not use this educational map as an official election certification source.
