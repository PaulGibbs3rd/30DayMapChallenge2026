# Day 5: Seattle Sightlines

**Theme:** Senses: Sight · November 5, 2026

**Status:** Complete · implemented and verified locally

A 3D line-of-sight explorer from the Space Needle to ten illustrative public-space points around Seattle and Mount Rainier’s summit area. A restrained navy and lime Calcite interface keeps the city in focus, with landmark search, visibility filters, target heights, custom points, camera presets, and CSV export.

## Run and build

The application was generated with the official @arcgis/create 5.2.0 CLI using its Vite template. Source, dependencies and build tools live in scripts/app/; the exported index.html, assets/ and calcite/ files run directly on GitHub Pages.

From day5/scripts/app/:

- npm ci — install the locked dependencies.
- npm run dev — preview the source with Vite.
- npm run export — type-check, build and export into day5/.

From the repository root, npm run dev previews the exported page at /30DayMapChallenge2026/day5/. npm run check validates the collection. Export Day 5 after source changes. Root builds package the exported page and deliberately exclude scripts/ and dependencies.

## Analysis model

Each landmark uses its own ArcGIS LineOfSightAnalysis with an observer on an approximate 21 m Space Needle deck rim, facing that target. The observer altitude is sampled terrain at the tower center plus 158.496 m (520 ft) plus 1.5 m eye height. The rim placement approximates moving around the observation deck and avoids starting at the tower’s center inside its model. The 21 m radius and eye height are modeling assumptions, not a surveyed deck position.

City targets are hand-curated WGS84 sample locations in public spaces, not official surveyed entrances or whole-building visibility tests. Default target height is 2 m above queried terrain; users can change it to 1–300 m. The source table is scripts/app/src/landmarks.ts. Distances are horizontal great-circle distances from the tower center; bearings are initial bearings relative to true north. Scene geometry and terrain drive visibility; results are never preassigned.

The analysis uses the SDK result visible property only after scene updating stops. Null results and off-screen targets remain Pending. Gray rays are unresolved. Green is the visible segment and red starts at the first obstruction. Results depend on camera position and loaded geometry detail. City overview restores the initial city extent. Mount Rainier is about 96 km away and is normally Pending in that city view. Selecting it automatically frames the regional sightline; Inspect sightline frames both endpoints. From the deck aims toward the summit; the analysis may remain Pending there when its observer or target is outside the rendered view. Its altitude is queried terrain plus the displayed offset, not a hard-coded published summit elevation. At this regional scale, terrain and buildings have coarser detail; the result is exploratory and excludes clouds and haze.

Custom points are sampled from terrain, even when a building roof is clicked. The app accepts points 50 m–8 km from the tower, caps the session at 25 targets, supports removing custom points and resetting, and keeps all additions only in browser memory. CSV contains all targets with current visibility or pending state, input heights, distance, bearing, model vintage and an export timestamp. It is a snapshot of the current scene, not a permanent visibility classification.

## Data, credits and access

- [USGS GNIS Mount Rainier high point](https://edits.nationalmap.gov/apps/gaz-domestic/public/gaz-record/1533614): 46.8528267° N, 121.7604408° W. Used as a named summit-area sample; terrain elevation comes from World Elevation.

- [Seattle 3D Buildings](https://www.arcgis.com/home/item.html?id=fd343811bb604dafa58f23a00e5c0fd0), City of Seattle, Office of Planning and Community Development. Public 3DObject SceneLayer; derived from lidar and footprints captured in **2015/16**. Seattle makes no warranty of accuracy. Read the item’s terms for the original source.
- [Seattle Space Needle model](https://www.arcgis.com/home/item.html?id=6f8eb961cbff4554acbde23fa3de0ca0), City of Seattle. Public detailed 3D tower model; the same accuracy disclaimer applies.
- [World Elevation terrain](https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer), Esri and contributing elevation providers. Queried with returnSampleInfo; missing samples fail the operation.
- Esri Dark Gray Canvas vector basemap; provider attribution is shown by the scene.
- [Space Needle official description](https://www.spaceneedle.com/about) supplies the 520-foot observation deck height.
- [ArcGIS LineOfSightAnalysis](https://developers.arcgis.com/javascript/latest/references/core/analysis/LineOfSightAnalysis/) documents analysis and detail limitations.
- Calcite Design System components, icons and English localization assets, Esri. UI assets are packaged locally; SDK runtime assets and geographic services need an internet connection.

Source metadata checked November 5, 2026. Both selected portal items are public. The app performs read-only requests and client-side scene analysis, requires no API key or sign-in, and never requests private feature-service access. No protected resources were made public.

## Limits

The building model is historical. Construction since 2015–16, trees, window transparency, weather, atmospheric haze and real-world optical visibility are not modeled. A single sampled point can be obstructed while another portion of a landmark is visible. Terrain and building vertical datums may differ; no survey-grade datum correction is applied. The City of Seattle disclaims accuracy. This is an exploratory map, not a current visibility guarantee or engineering assessment.

## Validation

Mount Rainier addition: verified the 11th target in the browser at 96.24 km and 152°, automatic regional framing, and the From the deck control. The summit sample resolved Clear in the tested regional view; this is a current scene result, not a weather or real-world visibility guarantee. Production build, exported asset references and diff whitespace checks pass.

TypeScript and Vite production build pass. The Day 5 static checker verifies over 11,000 HTML, CSS and module references. Live browser checks confirmed terrain, buildings, the detailed tower, analysis rays and results, public layer metadata, landmark selection, search, visibility filters, camera inspection, target-height edits, custom target creation/removal, reset and the methodology dialog. Raising Pike Place’s target from 2 m to 200 m changed its result from obstructed to clear. A downloaded CSV had its header plus all 11 tested points, model vintage and current statuses. Desktop (1440×900) and mobile (390×844) layouts were inspected; mobile actions, target-height access and reset filter synchronization were corrected.

The collection-wide npm run check passed its data validations and built the static artifact, then stopped on an existing broken link to MAUI_HIKING_APP_SPEC.md in the separate docs/arcgis-toolkit-feedback.md draft. That unrelated file was left unchanged. Run node day5/scripts/check.mjs for the scoped Day 5 asset check.

[Collection](../directory/index.html) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day5) · [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day5/)
