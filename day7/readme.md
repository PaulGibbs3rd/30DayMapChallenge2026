# Day 7: Seven Days of Shaking

**Date:** November 7, 2026
**Theme:** 10 minute map
**Status:** Complete. [Open the map on GitHub Pages](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day7/).

A public, anonymous world map of USGS-reported M2.5+ earthquakes from the past seven days. Orange circles grow with magnitude; click a circle for the reported location, UTC event time, depth, and USGS event page. The Pacific-centered view reveals the pattern around its margins.

## Build and run

Scaffolded with `npx --yes @arcgis/create --name app --template vite` in `day7/scripts/`. Source is in `scripts/app/`; `index.html` and `assets/` are its exported static runtime.

From `day7/scripts/app/`, run `npm ci`, then `npm run dev`. To export changes, run `npm run build`, followed by `node ../export.mjs`. Vite uses a relative base for GitHub Pages. From the repository root, `npm run dev` previews the complete collection.

Uses ArcGIS Maps SDK for JavaScript 5.1, Map Components, Calcite, TypeScript, and Vite. Dependency resolutions are recorded in the lockfile. The template's optional OAuth example is unused. The map accesses public resources without an API key or sign-in; it needs internet access for the USGS feed, basemap, and SDK assets.

## Data and interpretation

- [USGS GeoJSON summary format](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
- [Past-seven-days M2.5+ GeoJSON feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson)
- [Esri GeoJSONLayer earthquake example](https://developers.arcgis.com/javascript/latest/sample-code/layers-geojson/)
- [ArcGIS CLI setup](https://developers.arcgis.com/javascript/latest/get-started/)

Accessed November 7, 2026, Pacific time. Earthquake data: USGS Earthquake Hazards Program, a US federal source. Basemap providers retain their own rights; attribution remains on the map. No third-party artwork is included.

The application fetches the feed once on page load, retains earthquake events with numeric magnitudes at least 2.5, and displays feed generation time. Reload for a fresh fetch. USGS depth is copied from the third coordinate into a depth field in kilometres; map points use longitude and latitude only. The popup formats event times explicitly in UTC. The summary covers the complete fetched feed, not just the visible extent.

Detection coverage varies worldwide. This is a feed of USGS-reported events, not a uniform worldwide inventory. Circle sizes communicate magnitude; they do not represent energy, rupture dimensions, damage, or affected area. Magnitudes and locations can be revised by USGS. This map is an exploratory visualization.

## Ten-minute process

The clock started at 11:09:27 PM PST on November 7, including scaffolding, installation, implementation, build, export, and browser verification. The first sandboxed npm request failed DNS; the approved network retry succeeded. The first static runtime was exported by 11:15:02 PM. Browser checks identified cramped phone labels and raw popup field labels; both were corrected within the same working window. Completion timing and final check results are recorded below.

Deliberate scope: one feed, one point layer, one size variable, built-in navigation, popup, and legend. No animation, custom artwork, spatial analysis, or additional datasets. The installed ArcGIS requirements, authentication, JavaScript SDK, and Calcite skills guided the work.

## Validation

- TypeScript check and Vite production build passed.
- Exported runtime opened through the repository preview at its GitHub Pages subpath.
- Anonymous basemap, points, legend, count, and largest-magnitude summary rendered. Initial verification showed 311 earthquake events and a maximum of M6.1; these values change with the feed.
- A Japan event opened its popup with event time, depth, and USGS source link.
- Desktop and 390 × 844 phone layouts inspected; mobile label spacing corrected.
- No browser errors or warnings were reported during the initial rendered-map check.

The source and plan are available in this folder. The exported runtime is published with the collection through GitHub Pages.

Keyboard activation of the zoom control and the Home button were checked. Final phone layout was verified after the label fix. Preview: [earthquake-preview.jpg](earthquake-preview.jpg).

Repository check result: all Day 1–3 checks passed and the static collection packaged successfully. The final link checker is blocked by an existing unrelated link in `docs/arcgis-toolkit-feedback.md` to `../day4/scripts/app/README.md`, which is excluded from the published artifact. That unrelated document was left unchanged.

Timed implementation and verification completed in approximately 9 minutes 25 seconds, including installation delays. No deployment was performed.

Publication check: a clean copy of the staged publication files passed the full collection check, including 45,956 local references. The unrelated local draft that caused the earlier link failure was excluded from this commit.
