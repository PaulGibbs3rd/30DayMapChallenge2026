# Day 9 — Somewhere Between

**November 9, 2026 · Urban–rural**

Two places. One county. Compare Seattle and the valley on two equally sized maps with a shared scale, independent panning, and large tract-density figures. Three map lenses show people, growth boundaries, and working land.

## Explore

- Choose a place independently for map A and map B. Seven researched locations are available; click either map to sample a custom point.
- Both maps always use the same scale. Zoom with the shared buttons, mouse wheel, or double-click; the other map follows the scale while retaining its own center. Pan each map independently.
- Three suggested pairings provide starting points: City / farmland, Across the edge, and Two town centers. Swap places exchanges A and B. Recenter both returns each map to its selected place.
- People shows 2020 tract density. Growth boundary and Working land change both maps together with a shared legend.
- Large figures and a density ratio describe the surrounding full Census tracts. Planning designations and agricultural districts appear beneath each place.
- Sources & story opens method and credits. Share comparison preserves both selections, view centers, the lens, and shared scale. Previous A/B links remain supported.
- On phones the two equally sized map panels stack vertically, retaining independent selection and linked scale.

## Data and method

The app bundles snapshots of public King County GIS layers retrieved November 9, 2026, Pacific time. [Snapshot metadata](data/sources.json) records endpoints and retrieval time.

- [2020 Census tracts, major water bodies removed](https://www5.kingcounty.gov/SDC/?Layer=tracts20_shore_area): 494 tracts, original ALAND20 land area retained.
- [2020 Census redistricting population table](https://www5.kingcounty.gov/SDC/?Layer=tracts20_pl94totalpop): P0010001 total population joined to tract GEOID. All joins matched; total population is 2,269,675.
- [Urban Growth Areas](https://www5.kingcounty.gov/sdc/?Layer=urban_growth_area): county planning designations, including urban pockets. The catalog documents 2025 changes.
- [Agricultural Production Districts](https://www5.kingcounty.gov/SDC/?Layer=agrpddst_area): 13 polygon features representing five named districts. These are designations, not an inventory of active farms.

Density = population / (ALAND20 / 2,589,988.110336). The app does not recalculate area from clipped display polygons or estimate population inside arbitrary map windows. Geometry is generalized for display at 0.00003 degrees and six coordinate decimals. Point lookups are illustrative, not parcel-level determinations. Holes and multipart geometry are handled explicitly.

Comparison cards describe whole Census tracts, not the population or density of a city, farm, or neighborhood. Large tracts can contain both settlements and extensive uninhabited land. County planning designations are distinct from Census urban/rural classifications. Population is dated 2020; planning snapshots do not establish historical change. Missing data is distinct from zero.

Guided lines connect viewpoints, not a driving route. Narrative sources include [King County community descriptions](https://kingcounty.gov/en/dept/local-services/governance-leadership/local-government-for-unincorporated-king-county/community-service-areas) and [Fish, Farm & Flood](https://kingcounty.gov/en/dept/dnrp/nature-recreation/environment-ecology-conservation/watersheds/snoqualmie-skykomish-river/fish-farm-and-flood). The app links to the [Snoqualmie Tribe's Ancestral Lands Movement](https://snoqualmietribe.us/snoqualmie-tribe-ancestral-lands-movement/); Tribal map artwork and place-name datasets are not reproduced.

## Development

Scaffolded with `npx --yes @arcgis/create --name app --template js-maps-sdk-vite`. TypeScript, Vite, ArcGIS Maps SDK for JavaScript/map components 5.2.1 and Calcite 5.2.1; resolved versions are recorded in the lockfile. Source is isolated under `scripts/app`.

From the repository root with Node.js 24:

```powershell
npm --prefix day9/scripts/app ci
npm --prefix day9/scripts/app run dev
npm --prefix day9/scripts/app run export
node day9/scripts/check.mjs
npm run check
```

The export writes the production index and hashed assets into this day folder for the existing GitHub Pages publisher. Regenerate the public snapshots with `node day9/scripts/prepare-data.mjs` when needed; that requires internet access and validates complete joins before replacing data files. A regular build uses existing snapshots and does not query Census services.

Thematic geography is bundled; the Esri background and SDK auxiliary assets require internet access. No API keys, app secrets, account sign-in, or private portal resources are used. Background service attribution remains visible. Esri/Calcite distribution licenses are in `vendor/`.

## Validation

- Strict TypeScript check and production export passed.
- Data checks cover population joins/totals, density arithmetic, seven guide points, planning classifications, agricultural district lookup, polygon holes/multipart geometry, URL coordinate validation, and compressed data size.
- Browser checks exercise independent selectors and panning, shared scale from both common controls and a single map, all map lenses, swapping, same-tract handling, share/reload restoration, source dialog, and desktop/mobile layout.

[Research notes](research-seattle.md) retain the source investigation. [Current plan](plan.md) records the implemented scope. Publication is separate from the local build.
