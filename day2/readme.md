# Day 2 · Seattle, a City of Climbs

A public, anonymous 3D street explorer for the Lines theme. Built November 2, 2026 using the official `npx @arcgis/create` CLI, selecting its CDN template. The untouched starter is preserved in [starter/index.html](starter/index.html).

## Run

From the repository root, run `npm run dev` and open the printed local URL followed by `day2/`. No package installation, API key, or sign-in is required. ArcGIS Maps SDK for JavaScript 5.1 loads its components and compatible Calcite dependencies through the official CDN. Internet access and WebGL are required.

## Features

- True-scale 3D terrain and streets colored by SDOT's recorded grade.
- Top 20 eligible segments, descending by slope; ties share competition ranks.
- Minimum segment length: any, 100 (default), 250, or 500 feet.
- Optional one segment per street name (default on), retaining the steepest eligible segment.
- Select a list entry or street in the scene; highlight, inspect endpoints and grade, zoom, and view a linked terrain profile using `arcgis-elevation-profile`.
- Optional scene filter for grades of at least 15%; this does not change the citywide ranking.
- Keyboard-operable Calcite controls, reduced-motion navigation, responsive stacked mobile layout, and data-error feedback.

## Data and methodology

[Seattle Streets](https://data-seattlecitygis.opendata.arcgis.com/datasets/seattle-streets/explore), Seattle Department of Transportation; live [FeatureServer layer](https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Seattle_Streets_1/FeatureServer/0). Schema and sample values checked November 2, 2026. All data requests are read-only.

Rankings use numeric `SLOPE_PCT` and length in `SEGLENGTH` (feet). Eligibility: `STATUS = 'INSVC' AND STREETTYPE IS NOT NULL AND STREETTYPE <> 'Alley'`; unknown classifications are conservatively excluded. Null slopes are excluded, zero slopes are retained. This identifies eligible source records, not independently field-verified drivable roads. Attribute queries paginate through all records; only the ranked and selected segments' geometries are explicitly requested for markers and profiles. The scene streams its own geometry.

Grades describe segments, not entire named streets, maximum instantaneous grades, degrees, or travel direction. Recorded extremes can occur on short segments. At initial inspection Hillcrest Ave SW had 47% on a 38-foot segment; the default 100-foot filter excludes it. Source records can change.

The profile independently samples Esri World Elevation. It is terrain, not a road-surface survey; bridges and elevated roadways can differ substantially. Street lines are draped on terrain. The scene has no vertical exaggeration; chart axes scale independently. Basemap and elevation attribution remain visible in the scene. No data sharing or access permissions have been changed.

## ArcGIS requirements handoff summary

- **Work Target:** New application within Day 2.
- **Project Folder:** day2 (confirmed).
- **ArcGIS Product Context:** ArcGIS Online public hosted feature service and public basemap/elevation resources.
- **Target Platform:** Web; repository's existing static hosting workflow.
- **Delivery Scope:** Interactive prototype; no publishing requested.
- **Identity & Access Model:** Public, no sign-in (confirmed). Public resources verified to load anonymously; no credentials stored.
- **Core Features and Operations:** 3D scene, read-only queries, grade ranking and filtering, elevation profiles.

### Remaining assumptions
1. Recorded grade is the ranking measure; the profile is a separate terrain measurement.

### Next agent actions
- [x] Use JavaScript SDK and Calcite skills for implementation.
- [x] Resolve access with authentication skill: anonymous access to public resources.


## Validation

JavaScript syntax and repository build/link checks passed. In Chrome, verified anonymous layer/basemap/terrain loading, all 20 ranked rows, source grades and endpoints, list selection and linked profile, camera zoom, keyboard Enter selection, the length filters, unique-name toggle, steep-only scene toggle, and desktop/mobile layouts. No browser warnings or errors were reported during these workflows. Tested at 1280×800 and 390×844. The terrain profile intentionally remains distinct from SDOT's grade field.

## Uphill exploration

Ranked circles follow each segment at its midpoint along the line. Ties use the same rank as the list. Filters rebuild the markers; they are replaced by A/B endpoint labels at block scale.

Terrain is sampled before assigning A (lower endpoint) and B (higher endpoint). The profile geometry is reversed when necessary to run A → B. The camera faces from the lower side toward the higher endpoint, sampling its own position to stay above terrain. This does not indicate one-way traffic direction. Ground elevation remains distinct from the recorded SDOT grade. No-data elevations, disconnected paths, coincident endpoints, or differences below 0.5 m use a neutral view with explanatory text.

Run `node day2/scripts/check.mjs` for direction reversal, no-data/flat/multipart safeguards, camera bearing/distance, and along-line midpoint tests. The repository check includes these tests.

The uphill update was checked in Chrome: reversed-source profiles rise from A to B; ranked-circle clicks select and zoom; endpoint labels remain legible above the selected line; overview restores numbered markers. Nearby ranked markers can overlap at city scale; zooming separates them, and the list provides an accessible alternative.

## LinkedIn demo

[Download the animated demo](media/seattle-climbs-linkedin.gif) — a 20-second looping GIF, 1080 × 1080, approximately 4.7 MB. It shows the city ranking, selection of 22nd Ave E, the uphill camera, and the linked chart/scene indicator. [Still preview](media/seattle-climbs-linkedin.png).

The animation uses real browser captures with explanatory captions and source credits. The assembly script is [scripts/make-demo.py](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/blob/main/day2/scripts/make-demo.py); it takes a folder of captured PNG frames and a timing manifest. Temporary capture frames are kept outside the repository.
